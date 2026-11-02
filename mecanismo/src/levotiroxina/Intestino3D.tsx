import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Intestino em 3D: as moléculas de levotiroxina (verdes) passam pelas vilosidades até o sangue.
// "cafe": café e comida ficam no caminho; "calcio": cálcio e ferro se ligam ao remédio e o prendem.
// Tudo depende só do quadro (f), para o render ser sempre igual.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CORES = {
  cafe: ["#7a4a2a", "#e8d2a6"],
  calcio: ["#f4f4f0", "#c7742e"],
};

const Cena: React.FC<{
  f: number;
  ini: number;
  bloqueia: number;
  tipo: "cafe" | "calcio";
}> = ({ f, ini, bloqueia, tipo }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = null;
  }, [gl, scene]);
  const t = f - ini;
  useLayoutEffect(() => {
    camera.position.set(Math.sin(t / 160) * 1.2, 0.6, 14);
    camera.lookAt(0, -0.2, 0);
    camera.updateProjectionMatrix();
  }, [camera, t]);
  const nasce = interpolate(t, [0, 18], [0, 1], clamp);
  const b = interpolate(f, [bloqueia - 10, bloqueia + 40], [0, 0.55], clamp);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 8]} intensity={1.5} />
      <group scale={[nasce, nasce, nasce]}>
        {/* vaso de sangue em cima */}
        <mesh position={[0, 2.0, -0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.62, 0.62, 9, 40, 1, true]} />
          <meshPhysicalMaterial
            color="#ff5f73"
            roughness={0.3}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* parede do intestino com vilosidades */}
        <mesh position={[0, -1.75, -0.4]}>
          <boxGeometry args={[8.6, 0.3, 1.6]} />
          <meshStandardMaterial color="#e5899a" roughness={0.5} />
        </mesh>
        {Array.from({ length: 13 }, (_, i) => (
          <mesh key={i} position={[-3.9 + i * 0.65, -0.95, -0.4]}>
            <capsuleGeometry args={[0.2, 1.2, 8, 16]} />
            <meshStandardMaterial
              color="#f2a0ae"
              roughness={0.45}
              emissive="#4a1520"
            />
          </mesh>
        ))}
        {/* moléculas do remédio */}
        {Array.from({ length: 40 }, (_, i) => {
          const preso = rnd(i + 50) < b;
          const u = (rnd(i) + t * 0.006 * (0.8 + rnd(i + 70) * 0.4)) % 1;
          const x = -3.8 + rnd(i + 90) * 7.6;
          const y = preso
            ? -2.55 + Math.sin(t / 12 + i) * 0.05
            : -3.0 + u * 5.2;
          const some = !preso && y > 2.15;
          return (
            <group key={i}>
              <mesh position={[x, y, 0.2]} scale={some ? 0 : 0.13}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color="#3dff8f"
                  emissive="#0f8a46"
                  roughness={0.3}
                />
              </mesh>
              {preso && (
                <mesh position={[x + 0.16, y - 0.12, 0.25]} scale={0.16}>
                  <icosahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial
                    color={CORES[tipo][i % 2]}
                    roughness={0.5}
                  />
                </mesh>
              )}
            </group>
          );
        })}
        {/* partículas que atrapalham, soltas no intestino */}
        {Array.from({ length: 18 }, (_, i) => (
          <mesh
            key={i}
            position={[
              -3.8 + rnd(i + 400) * 7.6,
              -2.9 + rnd(i + 420) * 0.6 + Math.sin(t / 15 + i) * 0.08,
              0.1,
            ]}
            scale={
              0.18 *
              interpolate(f, [bloqueia - 16, bloqueia + 4], [0, 1], clamp)
            }
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={CORES[tipo][i % 2]} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </>
  );
};

export const Intestino3D: React.FC<{
  f: number;
  ini: number;
  bloqueia: number;
  tipo: "cafe" | "calcio";
}> = (p) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 52, near: 0.1, far: 80, position: [0, 0.6, 14] }}
    >
      <Cena {...p} />
    </ThreeCanvas>
  );
};
