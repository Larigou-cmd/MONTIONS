import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Coágulo em 3D: a câmera começa dentro da veia, com as hemácias vindo na direção dela, e sai pela parede.
// Tudo depende só do quadro (f), para o render ser sempre igual.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const COMPR = 70;
const ZCOAG = -7;

const useHemacia = () =>
  useMemo(() => {
    // perfil de disco com o centro afundado
    const p = [
      [0, 0.16],
      [0.18, 0.19],
      [0.36, 0.29],
      [0.46, 0.25],
      [0.5, 0.1],
      [0.5, -0.1],
      [0.46, -0.25],
      [0.36, -0.29],
      [0.18, -0.19],
      [0, -0.16],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(
      new THREE.SplineCurve(p).getPoints(48),
      48,
    );
    g.computeVertexNormals();
    return g;
  }, []);

const Cena: React.FC<{ f: number; ate: number }> = ({ f, ate }) => {
  const { gl, scene, camera } = useThree();
  const hemacia = useHemacia();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = new THREE.Color("#07080f");
    scene.fog = new THREE.Fog("#1a0509", 5, 46);
  }, [gl, scene]);
  const sai = interpolate(f, [ate * 0.42, ate * 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const suave = sai * sai * (3 - 2 * sai);
  useLayoutEffect(() => {
    camera.position.set(9.5 * suave, 2.4 * suave, 5 - 9 * suave);
    camera.lookAt(0.2 - 0.2 * suave, 0, ZCOAG + 2 * suave);
    camera.updateProjectionMatrix();
  }, [camera, suave]);
  // o fluxo desacelera conforme o coágulo cresce
  const andou = 0.34 * Math.min(f, 90) + 0.13 * Math.max(f - 90, 0);
  const cresce = (at: number, dur = 40) =>
    interpolate(f, [at, at + dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <pointLight position={[0, 0, 2]} intensity={10} color="#ff8a7a" />
      {/* parede da veia */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -12]}>
        <cylinderGeometry args={[1.75, 1.75, COMPR, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#a8303f"
          roughness={0.25}
          metalness={0.05}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* hemácias */}
      {Array.from({ length: 80 }, (_, i) => {
        const z = ((rnd(i) * COMPR + andou) % COMPR) - 67.5;
        const ang = Math.PI * (0.7 + rnd(i + 200) * 1.55);
        const r = 0.75 + rnd(i + 100) * 0.7;
        return (
          <mesh
            key={i}
            geometry={hemacia}
            position={[Math.cos(ang) * r, Math.sin(ang) * r, z]}
            rotation={[
              rnd(i + 300) * 3 + f * 0.012,
              rnd(i + 400) * 3,
              f * 0.01,
            ]}
            scale={0.8}
          >
            <meshStandardMaterial
              color="#b5121f"
              roughness={0.42}
              envMapIntensity={0.5}
              metalness={0.08}
            />
          </mesh>
        );
      })}
      {/* coágulo preso na parede */}
      {Array.from({ length: 26 }, (_, i) => {
        const k = cresce(58 + i * 3.4);
        const s = (0.34 + rnd(i + 500) * 0.42) * k;
        return (
          <mesh
            key={i}
            position={[
              1.25 - rnd(i + 600) * 1.05,
              (rnd(i + 700) - 0.5) * 1.5,
              ZCOAG + (rnd(i + 800) - 0.5) * 2.4,
            ]}
            scale={[s, s * 0.9, s * 1.1]}
          >
            <icosahedronGeometry args={[1, 4]} />
            <meshPhysicalMaterial
              color="#5c0a16"
              roughness={0.42}
              clearcoat={0.7}
            />
          </mesh>
        );
      })}
      {/* fibras de fibrina */}
      {Array.from({ length: 18 }, (_, i) => {
        const k = cresce(82 + i * 3.2, 24);
        return (
          <mesh
            key={i}
            position={[
              0.7 - rnd(i + 900) * 1.1,
              (rnd(i + 950) - 0.5) * 1.8,
              ZCOAG + (rnd(i + 1000) - 0.5) * 2.8,
            ]}
            rotation={[rnd(i + 1100) * 6, rnd(i + 1200) * 6, rnd(i + 1300) * 6]}
            scale={[1, k, 1]}
          >
            <cylinderGeometry args={[0.022, 0.022, 2.1, 8]} />
            <meshStandardMaterial
              color="#ffd58a"
              emissive="#7a5410"
              roughness={0.35}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const Coagulo3D: React.FC<{ f: number; ate: number }> = ({ f, ate }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 52, near: 0.1, far: 120, position: [0, 0, 5] }}
    >
      <Cena f={f} ate={ate} />
    </ThreeCanvas>
  );
};
