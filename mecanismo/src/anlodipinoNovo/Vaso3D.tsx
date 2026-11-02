import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Vaso em 3D: a câmera começa dentro dele e sai pela parede. O cálcio entra e o vaso aperta;
// a porta fecha e o vaso abre. Tudo depende só do quadro (f), para o render ser sempre igual.
export type TemposVaso = {
  sai: number;
  fora: number;
  calcio: number;
  aperta: number;
  fecha: number;
  abre: number;
};
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const COMPR = 44;
const ZC = -9;
const liga = (f: number, a: number, b: number) => {
  const k = interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return k * k * (3 - 2 * k);
};

const Cena: React.FC<{ f: number; t: TemposVaso }> = ({ f, t }) => {
  const { gl, scene, camera } = useThree();
  const hemacia = useMemo(() => {
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
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = new THREE.Color("#04120f");
    scene.fog = new THREE.Fog("#04120f", 8, 48);
  }, [gl, scene]);
  const saiu = liga(f, t.sai, t.fora);
  useLayoutEffect(() => {
    camera.position.set(11.5 * saiu, 1.6 * saiu, 5 - 12 * saiu);
    camera.lookAt(0, 0, ZC + 2 * (1 - saiu));
    camera.updateProjectionMatrix();
  }, [camera, saiu]);
  const R =
    1.62 -
    0.6 * liga(f, t.aperta - 30, t.aperta + 10) +
    0.95 * liga(f, t.abre - 40, t.abre + 14);
  const fluxo =
    0.3 * Math.min(f, t.aperta) +
    0.13 * Math.max(Math.min(f, t.abre) - t.aperta, 0) +
    0.42 * Math.max(f - t.abre, 0);
  const entra = liga(f, t.calcio - 6, t.aperta);
  const barra = liga(f, t.fecha, t.fecha + 20);
  const portas = liga(f, t.fecha - 14, t.fecha + 4);
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 7, 6]} intensity={1.3} />
      <pointLight position={[0, 0, 2]} intensity={9} color="#b8ffd8" />
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, ZC]}
        scale={[R, 1, R]}
      >
        <cylinderGeometry args={[1, 1, COMPR, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#b63a4c"
          roughness={0.28}
          transparent
          opacity={0.26}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* anéis de músculo em volta do vaso */}
      {Array.from({ length: 58 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0, ZC - COMPR / 2 + 0.5 + i * 0.75]}
          scale={[R, R, 1]}
        >
          <torusGeometry args={[1.02, 0.07, 14, 72]} />
          <meshStandardMaterial
            color="#ff5f73"
            roughness={0.35}
            emissive="#5a1020"
          />
        </mesh>
      ))}
      {/* hemácias */}
      {Array.from({ length: 60 }, (_, i) => {
        const z = ((rnd(i) * COMPR + fluxo) % COMPR) - 37;
        const ang = rnd(i + 200) * Math.PI * 2;
        const r = (0.3 + rnd(i + 100) * 0.55) * R;
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
            scale={0.72}
          >
            <meshStandardMaterial color="#b5121f" roughness={0.42} />
          </mesh>
        );
      })}
      {/* cálcio entrando; depois da porta fechada, ele fica de fora */}
      {Array.from({ length: 30 }, (_, i) => {
        const ang = rnd(i + 500) * Math.PI * 2;
        const dentro = 1 - entra;
        const d = R + 0.12 + 3.4 * dentro * (0.5 + rnd(i + 550)) + 1.5 * barra;
        const s = entra > 0 || f > t.calcio - 20 ? 0.13 : 0;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(ang) * d,
              Math.sin(ang) * d,
              ZC - 8 + rnd(i + 600) * 16,
            ]}
            scale={s}
          >
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial
              color="#f2e52e"
              emissive="#8a7f00"
              roughness={0.3}
            />
          </mesh>
        );
      })}
      {/* portas do cálcio fechando */}
      {Array.from({ length: 12 }, (_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(ang) * (R + 0.08),
              Math.sin(ang) * (R + 0.08),
              ZC - 6 + (i % 4) * 4,
            ]}
            scale={0.26 * portas}
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#3dff8f"
              emissive="#0f8a46"
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const Vaso3D: React.FC<{ f: number; t: TemposVaso }> = ({ f, t }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 52, near: 0.1, far: 120, position: [0, 0, 5] }}
    >
      <Cena f={f} t={t} />
    </ThreeCanvas>
  );
};
