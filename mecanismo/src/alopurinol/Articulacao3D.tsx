import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Articulação em 3D: ácido úrico como partículas douradas que viram cristais em agulha;
// a articulação vira um mapa de calor (vermelho = inflamada) que esfria quando o alopurinol age.
// Tudo depende só do quadro (f), para o render ser sempre igual.
export type TemposArt = {
  ini: number;
  cristais: number;
  trava: number;
  dissolve: number;
};
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const QUENTE = new THREE.Color("#ff3b2f"),
  MORNO = new THREE.Color("#ffb020"),
  FRIO = new THREE.Color("#3dff8f");
const calor = (k: number) =>
  k > 0.5
    ? MORNO.clone().lerp(QUENTE, (k - 0.5) * 2)
    : FRIO.clone().lerp(MORNO, k * 2);

const Cena: React.FC<{ f: number; t: TemposArt }> = ({ f, t }) => {
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
      Math.sin(tt / 140) * 2.2,
      0.4,
      14 - Math.min(tt, 200) * 0.006,
    );
    camera.lookAt(0, -0.2, 0);
    camera.updateProjectionMatrix();
  }, [camera, tt]);
  const nasce = interpolate(tt, [0, 18], [0, 1], clamp);
  const forma = interpolate(
    f,
    [t.cristais - 30, t.cristais + 50],
    [0, 1],
    clamp,
  );
  const some = interpolate(
    f,
    [t.dissolve - 10, t.dissolve + 90],
    [0, 1],
    clamp,
  );
  const k = Math.max(0, forma - some * 1.05);
  const inflam = calor(Math.min(1, k * 1.1));
  const pulso = 1 + 0.04 * Math.sin(f / 5) * k;
  const fabrica = 1 - interpolate(f, [t.trava, t.trava + 30], [0, 0.85], clamp);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 8]} intensity={1.5} />
      <pointLight position={[0, 0, 3]} intensity={6 * k} color="#ff6a3d" />
      <group scale={[nasce * 0.64, nasce * 0.64, nasce * 0.64]} position={[0, 0.25, 0]}>
        {/* dois ossos e a cápsula da articulação */}
        <mesh position={[0, 2.05, 0]}>
          <capsuleGeometry args={[0.8, 1.5, 12, 32]} />
          <meshStandardMaterial color="#f1e7d2" roughness={0.6} />
        </mesh>
        <mesh position={[0, -2.05, 0]}>
          <capsuleGeometry args={[0.8, 1.5, 12, 32]} />
          <meshStandardMaterial color="#f1e7d2" roughness={0.6} />
        </mesh>
        <mesh scale={[pulso * 1.7, pulso * 1.15, pulso * 1.7]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial
            color={inflam}
            emissive={inflam}
            emissiveIntensity={0.25 + 0.35 * k}
            transparent
            opacity={0.42}
            roughness={0.25}
          />
        </mesh>
        {/* cristais em agulha dentro da articulação */}
        {Array.from({ length: 34 }, (_, i) => {
          const a = rnd(i) * Math.PI * 2,
            b = (rnd(i + 20) - 0.5) * 1.4;
          const r = 0.25 + rnd(i + 40) * 0.95;
          const cres = Math.max(
            0,
            Math.min(1, forma * 1.3 - rnd(i + 60) * 0.3) -
              some * (0.6 + rnd(i + 80) * 0.6),
          );
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * r, b * 0.9, Math.sin(a) * r]}
              rotation={[rnd(i + 100) * 3, rnd(i + 120) * 3, rnd(i + 140) * 3]}
              scale={[cres, cres, cres]}
            >
              <coneGeometry args={[0.05, 0.85, 6]} />
              <meshStandardMaterial
                color="#fff3b0"
                emissive="#e8b400"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>
      {/* ácido úrico como partículas douradas no sangue, que diminuem quando a enzima é travada */}
      {Array.from({ length: 70 }, (_, i) => {
        const u = (rnd(i + 200) + tt * 0.004 * (0.7 + rnd(i + 220) * 0.6)) % 1;
        const lado = i % 2 ? 1 : -1;
        const x = lado * (2.2 + rnd(i + 240) * 1.6);
        const y = 3 - u * 6;
        const vis = rnd(i + 260) < fabrica ? 1 : 0;
        return (
          <mesh
            key={i}
            position={[x, y, (rnd(i + 280) - 0.5) * 1.5]}
            scale={0.09 * vis * nasce}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color="#ffd54a"
              emissive="#c79100"
              emissiveIntensity={1.1}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const Articulacao3D: React.FC<{ f: number; t: TemposArt }> = ({
  f,
  t,
}) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      gl={{ alpha: true }}
      camera={{ fov: 52, near: 0.1, far: 80, position: [0, 0.8, 11.5] }}
    >
      <Cena f={f} t={t} />
    </ThreeCanvas>
  );
};
