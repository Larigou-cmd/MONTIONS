import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Artéria aberta, vasinhos e veia estreita: entra mais sangue do que sai, e o líquido desce.
// Tudo depende só do quadro (f), para o render ser sempre igual.
export type TemposFluxo = { ini: number; liquido: number; pes: number };
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Cena: React.FC<{ f: number; t: TemposFluxo }> = ({ f, t }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = new THREE.Color("#04120f");
  }, [gl, scene]);
  useLayoutEffect(() => {
    camera.position.set(0, 0.4, 15.5);
    camera.lookAt(0, -0.6, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  const nasce = interpolate(f, [t.ini, t.ini + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gota = interpolate(f, [t.liquido - 12, t.liquido + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const poca = interpolate(f, [t.pes - 50, t.pes + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 8]} intensity={1.5} />
      <group scale={[nasce, nasce, nasce]} position={[0, 1.1, 0]}>
        {/* artéria aberta */}
        <mesh position={[-2.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.05, 1.05, 2.3, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#ff5f73"
            roughness={0.3}
            transparent
            opacity={0.42}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* veia estreita */}
        <mesh position={[2.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 2.3, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#58a6ff"
            roughness={0.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* vasinhos */}
        {[-0.72, -0.36, 0, 0.36, 0.72].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 3.3, 20, 1, true]} />
            <meshPhysicalMaterial
              color="#f2a9b4"
              roughness={0.35}
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        {/* sangue: muito entra, pouco sai */}
        {Array.from({ length: 64 }, (_, i) => {
          const u =
            (rnd(i) + (f - t.ini) * 0.0042 * (0.8 + rnd(i + 40) * 0.4)) % 1;
          const x = -3.9 + u * 7.8;
          const ang = rnd(i + 80) * Math.PI * 2;
          const faixa = [-0.72, -0.36, 0, 0.36, 0.72][i % 5];
          const naVeia = x > 1.6;
          const naArteria = x < -1.6;
          const r = naArteria ? 0.15 + rnd(i + 120) * 0.72 : 0.1;
          const y = naArteria
            ? Math.sin(ang) * r
            : naVeia
              ? (rnd(i + 160) - 0.5) * 0.3
              : faixa;
          const z = naArteria ? Math.cos(ang) * r : 0;
          const mostra = naVeia ? i % 3 === 0 : true;
          return (
            <mesh
              key={i}
              position={[x, y, z]}
              scale={mostra ? (naArteria ? 0.15 : 0.09) : 0}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#c9141f" roughness={0.4} />
            </mesh>
          );
        })}
      </group>
      {/* líquido que escapa e desce */}
      {Array.from({ length: 34 }, (_, i) => {
        const v = (rnd(i + 300) + (f - t.liquido) * 0.0105) % 1;
        const fase = f < t.liquido ? 0 : Math.max(v, 0);
        return (
          <mesh
            key={i}
            position={[(rnd(i + 340) - 0.5) * 2.6, 0.3 - fase * 3.7, 0.2]}
            scale={0.1 * gota}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#6fd3ff"
              emissive="#17627f"
              roughness={0.2}
            />
          </mesh>
        );
      })}
      {/* líquido acumulado nos pés */}
      <mesh
        position={[0, -3.4, 0]}
        scale={[2.4 * poca, 0.3 * poca, 0.7 * poca]}
      >
        <sphereGeometry args={[1, 32, 20]} />
        <meshPhysicalMaterial
          color="#6fd3ff"
          roughness={0.2}
          transparent
          opacity={0.75}
        />
      </mesh>
    </>
  );
};

export const Fluxo3D: React.FC<{ f: number; t: TemposFluxo }> = ({ f, t }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 52, near: 0.1, far: 80, position: [0, 0.4, 15.5] }}
    >
      <Cena f={f} t={t} />
    </ThreeCanvas>
  );
};
