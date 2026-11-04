import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Membrana do neurônio com 3 receptores de adenosina em forma de fechadura.
// Adenosina = chave verde (encaixa e acende o sinal de cansaço).
// Cafeína = chave amarela quase igual (encaixa, trava e não acende nada).
// Linha do tempo em quadros absolutos: aden (adenosina encaixa), caf (cafeína toma o lugar),
// acum (adenosina começa a se amontoar do lado de fora), sai (cafeína sai e tudo encaixa de uma vez).
// Tudo depende só do quadro, para o render ser sempre igual.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });

const VERDE = "#3dff8f";
const AMAR = "#f2e52e";
const XS = [-2.7, 0, 2.7];
const SLOT_Y = -0.15;

type Props = {
  f: number;
  ini: number;
  aden: number;
  caf: number;
  acum: number;
  sai: number;
};

// chave: cabeça redonda + haste com dentes
const Chave: React.FC<{
  pos: [number, number, number];
  cor: string;
  emis: string;
  s: number;
  anel?: boolean;
}> = ({ pos, cor, emis, s, anel }) => (
  <group position={pos} scale={s}>
    <mesh position={[0, 0.75, 0]}>
      <sphereGeometry args={[0.36, 24, 24]} />
      <meshStandardMaterial color={cor} emissive={emis} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.05, 0]}>
      <capsuleGeometry args={[0.14, 0.9, 8, 16]} />
      <meshStandardMaterial color={cor} emissive={emis} roughness={0.3} />
    </mesh>
    <mesh position={[0.18, -0.15, 0]}>
      <boxGeometry args={[0.22, 0.14, 0.2]} />
      <meshStandardMaterial color={cor} emissive={emis} roughness={0.3} />
    </mesh>
    {anel && (
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.06, 12, 32]} />
        <meshStandardMaterial
          color="#fff6a8"
          emissive="#6b6400"
          roughness={0.3}
        />
      </mesh>
    )}
  </group>
);

const Cena: React.FC<Props> = ({ f, ini, aden, caf, acum, sai }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = null;
  }, [gl, scene]);
  const t = f - ini;
  useLayoutEffect(() => {
    camera.position.set(Math.sin(t / 170) * 1.2, 1.4, 17);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
  }, [camera, t]);
  const nasce = io(t, 0, 16);

  // monte de adenosina do lado de fora (cresce a partir de "acum"; corre para os receptores em "sai")
  const N = 34;
  const visiveis = interpolate(f, [acum, acum + 110], [0, N], clamp);
  const corre = io(f, sai + 16, sai + 36);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 8]} intensity={1.5} />
      <group scale={[nasce, nasce, nasce]} position={[0, -0.6, 0]}>
        {/* membrana do neurônio */}
        <mesh position={[0, -1.35, 0]}>
          <boxGeometry args={[9.4, 0.5, 2.2]} />
          <meshStandardMaterial
            color="#1f7a5c"
            roughness={0.55}
            emissive="#06281d"
          />
        </mesh>
        {Array.from({ length: 22 }, (_, i) => (
          <mesh key={i} position={[-4.4 + i * 0.42, -1.05, 0.95]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#2fa57c" roughness={0.5} />
          </mesh>
        ))}
        {XS.map((x, r) => {
          // ocupantes de cada receptor
          const dAden =
            io(f, aden + r * 9, aden + r * 9 + 22) *
            (1 - io(f, caf - 8 + r * 4, caf + 8 + r * 4));
          const dCaf =
            io(f, caf + 4 + r * 6, caf + 26 + r * 6) *
            (1 - io(f, sai + r * 4, sai + 18 + r * 4));
          const dVolta = io(f, sai + 22 + r * 3, sai + 40 + r * 3);
          const aceso = Math.max(dAden, dVolta);
          const yA = SLOT_Y + (1 - dAden) * 3.6;
          const yC = SLOT_Y + (1 - dCaf) * 3.6;
          const yV = SLOT_Y + (1 - dVolta) * 2.2;
          return (
            <group key={r} position={[x, 0, 0]}>
              {/* fechadura: duas paredes e o fundo, formando um U */}
              {[-0.48, 0.48].map((dx) => (
                <mesh key={dx} position={[dx, -0.25, 0]}>
                  <boxGeometry args={[0.32, 1.7, 0.9]} />
                  <meshPhysicalMaterial
                    color="#d8efe6"
                    roughness={0.25}
                    metalness={0.1}
                    clearcoat={0.6}
                  />
                </mesh>
              ))}
              <mesh position={[0, -1.0, 0]}>
                <boxGeometry args={[1.28, 0.3, 0.9]} />
                <meshPhysicalMaterial
                  color="#d8efe6"
                  roughness={0.25}
                  clearcoat={0.6}
                />
              </mesh>
              {/* sinal de cansaço: acende quando a adenosina encaixa */}
              <mesh position={[0, -1.75, 0.6]} scale={0.32 + aceso * 0.14}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshStandardMaterial
                  color={aceso > 0.05 ? VERDE : "#3b4a44"}
                  emissive={VERDE}
                  emissiveIntensity={aceso * 2.2}
                  roughness={0.3}
                />
              </mesh>
              {dAden > 0.01 && (
                <Chave pos={[0, yA, 0]} cor={VERDE} emis="#0f8a46" s={1} />
              )}
              {dCaf > 0.01 && (
                <Chave
                  pos={[0, yC + (f > sai ? (1 - dCaf) * 1.2 : 0), 0]}
                  cor={AMAR}
                  emis="#5c5600"
                  s={1}
                  anel
                />
              )}
              {dVolta > 0.01 && (
                <Chave pos={[0, yV, 0]} cor={VERDE} emis="#16b85e" s={1} />
              )}
            </group>
          );
        })}
        {/* adenosina acumulada do lado de fora */}
        {Array.from({ length: N }, (_, i) => {
          if (i >= visiveis) return null;
          const alvo = XS[i % 3];
          const x0 = -4 + rnd(i) * 8;
          const y0 = 1.9 + rnd(i + 30) * 2.2 + Math.sin(t / 11 + i) * 0.08;
          const x = x0 + (alvo - x0) * corre;
          const y = y0 + (SLOT_Y + 0.6 - y0) * corre;
          const s =
            0.2 *
            (1 - corre * 0.9) *
            interpolate(i, [visiveis - 1, visiveis], [1, 0.3], clamp);
          return (
            <mesh key={i} position={[x, y, 0.3 + rnd(i + 60) * 0.6]} scale={s}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={VERDE}
                emissive="#0f8a46"
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

export const Receptor3D: React.FC<Props> = (p) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      gl={{ alpha: true }}
      camera={{ fov: 50, near: 0.1, far: 80, position: [0, 1.4, 17] }}
    >
      <Cena {...p} />
    </ThreeCanvas>
  );
};
