import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// 3D do Novembro Azul (depende só do quadro f). Célula do câncer de próstata (esfera azul-acinzentada
// com "fechaduras" = receptores de andrógeno) recebendo testosterona (bolinhas âmbar) de uma "fábrica"
// (o testículo, caixa com janela acesa). Três momentos:
// 1. desliga: a janela da fábrica apaga e o fluxo para (gosserrelina / leuprorrelina);
// 2. fecha: a fábrica volta, mas tampas azuis cobrem as fechaduras e a testosterona não encaixa
//    (bicalutamida / enzalutamida);
// 3. trava: aparecem também as fontes menores (dentro da célula); um cadeado azul trava todas
//    e o fluxo para de novo (abiraterona).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AMBAR = "#ffb020",
  AZUL = "#3da9ff",
  AZUL2 = "#9fd4ff";

export type Tempos3D = {
  ini: number;
  desliga: number;
  fecha: number;
  trava: number;
};

const FAB = new THREE.Vector3(-3.3, 0.4, 0);
const CEL = new THREE.Vector3(1.0, -0.1, 0);
const RC = 1.7;
// fechaduras no lado esquerdo da célula (de frente para a fábrica)
const RECS = Array.from({ length: 7 }, (_, i) => {
  const a = Math.PI * (0.62 + (i / 6) * 0.76); // de cima para baixo, lado esquerdo
  const z = Math.sin(i * 1.7) * 0.6;
  const v = new THREE.Vector3(Math.cos(a), Math.sin(a), z * 0.5).normalize();
  return { n: v, p: CEL.clone().add(v.clone().multiplyScalar(RC)) };
});

const Cena: React.FC<{ f: number; t: Tempos3D }> = ({ f, t }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = null;
  }, [gl, scene]);
  const tt = f - t.ini;
  useLayoutEffect(() => {
    camera.position.set(
      Math.sin(tt / 170) * 1.6 - 0.4,
      0.8,
      10.5 - Math.min(tt, 300) * 0.003,
    );
    camera.lookAt(-0.6, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, tt]);

  const nasce = interpolate(tt, [0, 18], [0.001, 1], clamp);
  // fábrica acesa: apaga em "desliga", volta antes de "fecha", apaga de novo em "trava"
  const fab =
    f < t.fecha - 14
      ? 1 - interpolate(f, [t.desliga, t.desliga + 22], [0, 1], clamp)
      : 1 - interpolate(f, [t.trava + 10, t.trava + 32], [0, 1], clamp);
  const volta =
    f >= t.fecha - 14
      ? interpolate(f, [t.fecha - 14, t.fecha], [0, 1], clamp)
      : 1;
  const fluxo = fab * volta;
  // tampas nas fechaduras (só no momento 2)
  const tampa =
    interpolate(f, [t.fecha, t.fecha + 14], [0, 1], clamp) *
    (1 - interpolate(f, [t.trava - 12, t.trava], [0, 1], clamp));
  // fontes internas + cadeado (momento 3)
  const interna = interpolate(f, [t.trava - 10, t.trava + 4], [0, 1], clamp);
  const cadeado = interpolate(f, [t.trava + 6, t.trava + 20], [0, 1], clamp);
  const internaAcesa =
    interna * (1 - interpolate(f, [t.trava + 10, t.trava + 32], [0, 1], clamp));

  const N = 42;
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 6, 8]} intensity={1.5} />
      <pointLight
        position={[-4, 1, 3]}
        intensity={18 * fab * volta}
        color={AMBAR}
      />
      <group scale={[nasce, nasce, nasce]}>
        {/* fábrica (testículo) */}
        <mesh position={FAB}>
          <boxGeometry args={[1.5, 1.2, 1.1]} />
          <meshPhysicalMaterial
            color="#5b6b86"
            roughness={0.45}
            clearcoat={0.6}
          />
        </mesh>
        <mesh position={[FAB.x + 0.35, FAB.y + 0.95, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#4a5872" />
        </mesh>
        {[-0.38, 0.38].map((dx, i) => (
          <mesh key={i} position={[FAB.x + dx, FAB.y + 0.1, 0.56]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshStandardMaterial
              color={fab > 0.05 ? AMBAR : "#2a3142"}
              emissive={AMBAR}
              emissiveIntensity={1.6 * fab * volta}
            />
          </mesh>
        ))}
        {/* célula */}
        <mesh position={CEL}>
          <icosahedronGeometry args={[RC, 4]} />
          <meshPhysicalMaterial
            color="#33507a"
            roughness={0.35}
            clearcoat={1}
            transmission={0.15}
            emissive="#16325c"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[CEL.x + 0.2, CEL.y - 0.1, 0.3]}>
          <sphereGeometry args={[0.55, 24, 16]} />
          <meshStandardMaterial color="#1c2f52" />
        </mesh>
        {/* fechaduras (receptores) e tampas */}
        {RECS.map((r, i) => {
          const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            r.n,
          );
          return (
            <group key={i} position={r.p} quaternion={q}>
              <mesh position={[0, 0.08, 0]}>
                <torusGeometry args={[0.17, 0.06, 10, 20]} />
                <meshStandardMaterial
                  color={AZUL2}
                  emissive={AZUL2}
                  emissiveIntensity={0.3}
                />
              </mesh>
              <mesh
                position={[0, 0.2, 0]}
                scale={[tampa + 0.001, tampa + 0.001, tampa + 0.001]}
              >
                <cylinderGeometry args={[0.28, 0.28, 0.1, 24]} />
                <meshStandardMaterial
                  color={AZUL}
                  emissive={AZUL}
                  emissiveIntensity={0.7}
                />
              </mesh>
            </group>
          );
        })}
        {/* fontes internas (momento 3) */}
        {[
          [CEL.x + 0.6, CEL.y + 0.6, 0.9],
          [CEL.x + 0.9, CEL.y - 0.5, 0.8],
        ].map((p, i) => (
          <group
            key={`i${i}`}
            position={p as [number, number, number]}
            scale={[interna + 0.001, interna + 0.001, interna + 0.001]}
          >
            <mesh>
              <boxGeometry args={[0.45, 0.35, 0.35]} />
              <meshStandardMaterial
                color="#5b6b86"
                emissive={AMBAR}
                emissiveIntensity={1.2 * internaAcesa}
              />
            </mesh>
          </group>
        ))}
        {/* cadeado azul sobre a fábrica e sobre as fontes internas */}
        {[
          [FAB.x, FAB.y - 0.05, 0.75],
          [CEL.x + 0.75, CEL.y + 0.05, 1.35],
        ].map((p, i) => (
          <group
            key={`c${i}`}
            position={p as [number, number, number]}
            scale={[cadeado + 0.001, cadeado + 0.001, cadeado + 0.001]}
          >
            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[0.22, 0.07, 10, 24, Math.PI]} />
              <meshStandardMaterial
                color={AZUL}
                emissive={AZUL}
                emissiveIntensity={0.8}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.62, 0.48, 0.2]} />
              <meshStandardMaterial
                color={AZUL}
                emissive={AZUL}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}
        {/* testosterona: bolinhas âmbar da fábrica até as fechaduras */}
        {Array.from({ length: N }, (_, i) => {
          const r = RECS[i % RECS.length];
          const u = (((tt / 55 + i / N) % 1) + 1) % 1;
          const meio = FAB.clone()
            .lerp(r.p, 0.5)
            .add(new THREE.Vector3(0, Math.sin(i) * 0.7, Math.cos(i) * 0.5));
          const a = FAB.clone().lerp(meio, u),
            b = meio
              .clone()
              .lerp(
                r.p
                  .clone()
                  .add(r.n.clone().multiplyScalar(tampa > 0.5 ? 0.42 : 0)),
                u,
              );
          const pos = a.lerp(b, u);
          // sem fluxo, as que ainda não saíram somem
          const vis =
            Math.min(1, fluxo * 1.4) *
            (u > 0.97 ? 0 : 1) *
            (tampa > 0.5 && u > 0.88 ? 0.4 : 1);
          const s = 0.14 * vis + 0.001;
          return (
            <mesh
              key={`p${i}`}
              position={pos}
              scale={[s / 0.14, s / 0.14, s / 0.14]}
            >
              <sphereGeometry args={[0.14, 14, 10]} />
              <meshStandardMaterial
                color={AMBAR}
                emissive={AMBAR}
                emissiveIntensity={0.9}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

export const Prostata3D: React.FC<{ f: number; t: Tempos3D; h?: number }> = ({
  f,
  t,
  h = 1000,
}) => {
  const { width } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 0, top: 380, width, height: h }}>
      <ThreeCanvas
        width={width}
        height={h}
        camera={{ fov: 42, near: 0.1, far: 80, position: [0, 0.8, 10.5] }}
      >
        <Cena f={f} t={t} />
      </ThreeCanvas>
    </div>
  );
};
