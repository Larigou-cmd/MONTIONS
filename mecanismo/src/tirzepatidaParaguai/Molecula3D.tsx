import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Molécula genérica (cadeia de peptídeo em hélice) girando: "a substância", sem marca nenhuma.
// Depende só do quadro (f). A partir de "marca", etiquetas planas (as marcas) orbitam em volta.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CORES = ["#22c55e", "#86efac", "#e9edf2", "#60a5fa"];

const Cena: React.FC<{
  f: number;
  ini: number;
  etiquetas: number;
  uma: number;
}> = ({ f, ini, etiquetas, uma }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.6;
    scene.background = null;
  }, [gl, scene]);
  const t = f - ini;
  useLayoutEffect(() => {
    camera.position.set(
      Math.sin(t / 150) * 1.2,
      0.6,
      11.5 - Math.min(1.5, t / 220),
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, t]);
  const nasce = interpolate(t, [0, 20], [0.001, 1], clamp);
  const n = 22;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = i * 0.62;
    return new THREE.Vector3(
      Math.cos(a) * 1.1,
      (i - n / 2) * 0.26,
      Math.sin(a) * 1.1,
    );
  });
  // etiquetas: aparecem várias; depois de "uma" sobra só a verde
  const kEt = interpolate(f, [etiquetas, etiquetas + 16], [0, 1], clamp);
  const kUma = interpolate(f, [uma, uma + 14], [0, 1], clamp);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 8]} intensity={1.6} />
      <pointLight position={[-4, -2, 4]} intensity={30} color="#22c55e" />
      <group scale={[nasce, nasce, nasce]} rotation={[0.25, t / 60, 0.15]}>
        {pts.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i % 3 === 0 ? 0.36 : 0.26, 28, 18]} />
            <meshPhysicalMaterial
              color={CORES[i % 4]}
              roughness={0.25}
              clearcoat={1}
              emissive={CORES[i % 4]}
              emissiveIntensity={0.12}
            />
          </mesh>
        ))}
        {pts.slice(1).map((p, i) => {
          const a = pts[i];
          const mid = a.clone().add(p).multiplyScalar(0.5);
          const dir = p.clone().sub(a);
          const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.clone().normalize(),
          );
          return (
            <mesh key={`b${i}`} position={mid} quaternion={q}>
              <cylinderGeometry args={[0.07, 0.07, dir.length(), 10]} />
              <meshStandardMaterial
                color="#94a3b8"
                metalness={0.4}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 + t / 70;
        const fica = i === 0;
        const s = kEt * (fica ? 1 : 1 - kUma) + 0.001;
        return (
          <group
            key={`e${i}`}
            position={[
              Math.cos(a) * 3.3,
              Math.sin(a * 1.3) * 0.8,
              Math.sin(a) * 1.6,
            ]}
            scale={[s, s, s]}
            rotation={[0, -a, 0.1]}
          >
            <mesh>
              <boxGeometry args={[1.2, 0.6, 0.06]} />
              <meshPhysicalMaterial
                color={fica ? "#22c55e" : "#cbd5e1"}
                roughness={0.3}
                clearcoat={1}
                emissive={fica ? "#16a34a" : "#000000"}
                emissiveIntensity={fica ? 0.6 * kUma : 0}
              />
            </mesh>
            <mesh position={[-0.42, 0, 0.04]}>
              <circleGeometry args={[0.1, 20]} />
              <meshStandardMaterial color="#0f1216" />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

export const Molecula3D: React.FC<{
  f: number;
  ini: number;
  etiquetas: number;
  uma: number;
  h?: number;
}> = ({ f, ini, etiquetas, uma, h = 900 }) => {
  const { width } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={h}
      camera={{ fov: 45, near: 0.1, far: 80, position: [0, 0.6, 11.5] }}
    >
      <Cena f={f} ini={ini} etiquetas={etiquetas} uma={uma} />
    </ThreeCanvas>
  );
};
