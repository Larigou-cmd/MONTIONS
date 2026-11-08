import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// 3D da prednisona, em duas cenas que dependem só do quadro (f):
// - Adrenais: dois rins com as glândulas adrenais em cima soltando cortisol (partículas âmbar);
//   a prednisona (partículas verdes, maiores) chega, a adrenal apaga; ao parar de repente, some tudo.
// - Fígado: comprimidos de prednisona entram cinzas ("desligados") e saem verdes, já como prednisolona.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AMBAR = new THREE.Color("#ffb020"),
  APAGADO = new THREE.Color("#6f6a5e"),
  VERDE = "#3dff8f";

const Luzes: React.FC = () => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = null;
  }, [gl, scene]);
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 8]} intensity={1.4} />
    </>
  );
};

const Camera: React.FC<{ tt: number; z: number }> = ({ tt, z }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(
      Math.sin(tt / 160) * 1.8,
      0.5,
      z - Math.min(tt, 240) * 0.004,
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, tt, z]);
  return null;
};

export type TemposAdrenal = {
  ini: number;
  pred: number;
  desliga: number;
  para: number;
};

const CenaAdrenal: React.FC<{ f: number; t: TemposAdrenal }> = ({ f, t }) => {
  const tt = f - t.ini;
  const nasce = interpolate(tt, [0, 18], [0, 1], clamp);
  // adrenal acesa (1) até a prednisona assumir; depois apaga
  const ativo =
    1 - interpolate(f, [t.desliga - 40, t.desliga + 30], [0, 0.92], clamp);
  const pred =
    interpolate(f, [t.pred - 4, t.pred + 24], [0, 1], clamp) *
    (1 - interpolate(f, [t.para - 4, t.para + 14], [0, 1], clamp));
  const cor = APAGADO.clone().lerp(AMBAR, ativo);
  const s = nasce * 0.8;
  return (
    <>
      <Luzes />
      <Camera tt={tt} z={11} />
      <pointLight
        position={[0, 1.4, 2.5]}
        intensity={5 * ativo}
        color="#ffb020"
      />
      <group scale={[s, s, s]} position={[0, -0.9, 0]}>
        {[-1, 1].map((lado) => (
          <group
            key={lado}
            position={[lado * 1.7, 0, 0]}
            rotation={[0, 0, lado * -0.18]}
          >
            {/* rim em forma de feijão */}
            <mesh scale={[0.95, 1.45, 0.72]}>
              <sphereGeometry args={[1, 48, 32]} />
              <meshStandardMaterial color="#b0524a" roughness={0.55} />
            </mesh>
            {/* glândula adrenal em cima */}
            <mesh position={[0, 1.55, 0]} scale={[1, 0.85, 0.7]}>
              <coneGeometry args={[0.62, 0.9, 24]} />
              <meshStandardMaterial
                color={cor}
                emissive={cor}
                emissiveIntensity={0.15 + 0.7 * ativo}
                roughness={0.35}
              />
            </mesh>
          </group>
        ))}
        {/* cortisol saindo das adrenais */}
        {Array.from({ length: 48 }, (_, i) => {
          const lado = i % 2 ? 1 : -1;
          const u = (rnd(i + 10) + tt * 0.006 * (0.7 + rnd(i + 30) * 0.6)) % 1;
          const x = lado * 1.7 + (rnd(i + 50) - 0.5) * (0.4 + u * 2.4);
          const y = 2.1 + u * 2.1;
          const vis = rnd(i + 70) < ativo ? 1 : 0;
          return (
            <mesh
              key={i}
              position={[x, y, (rnd(i + 90) - 0.5) * 1.2]}
              scale={0.085 * vis * (1 - u * 0.5)}
            >
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial
                color="#ffd27a"
                emissive="#ff9d00"
                emissiveIntensity={1.1}
              />
            </mesh>
          );
        })}
        {/* prednisona chegando de cima (maior e mais forte) */}
        {Array.from({ length: 26 }, (_, i) => {
          const u =
            (rnd(i + 200) + tt * 0.005 * (0.7 + rnd(i + 220) * 0.6)) % 1;
          const x = (rnd(i + 240) - 0.5) * 6.5;
          const y = 3.9 - u * 4.8;
          return (
            <mesh
              key={i}
              position={[x, y, (rnd(i + 260) - 0.5) * 1.5]}
              scale={0.15 * pred}
            >
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial
                color={VERDE}
                emissive={VERDE}
                emissiveIntensity={0.9}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

export type TemposFigado = { ini: number; transforma: number };

const CenaFigado: React.FC<{ f: number; t: TemposFigado }> = ({ f, t }) => {
  const tt = f - t.ini;
  const nasce = interpolate(tt, [0, 18], [0, 1], clamp);
  // antes de "transforma", os comprimidos entram e param no fígado; depois atravessam e saem verdes
  const libera = interpolate(
    f,
    [t.transforma - 10, t.transforma + 20],
    [0, 1],
    clamp,
  );
  const s = nasce * 0.85;
  return (
    <>
      <Luzes />
      <Camera tt={tt} z={11} />
      <group scale={[s, s, s]} position={[0, 0.1, 0]}>
        {/* fígado: lobo direito grande + lobo esquerdo menor */}
        <mesh
          position={[0.35, 0, 0]}
          scale={[1.75, 1.15, 0.95]}
          rotation={[0, 0, -0.12]}
        >
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial color="#8e3a2c" roughness={0.45} />
        </mesh>
        <mesh
          position={[-1.35, 0.3, 0.1]}
          scale={[1.05, 0.7, 0.7]}
          rotation={[0, 0, 0.35]}
        >
          <sphereGeometry args={[1, 40, 28]} />
          <meshStandardMaterial color="#9a4334" roughness={0.45} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => {
          const per = 150;
          const u = ((tt + i * (per / 5)) % per) / per;
          // sem "libera", o comprimido para na borda do fígado (x = -2.2)
          const xLivre = -3.4 + u * 6.8;
          const x = libera > 0.5 ? xLivre : Math.min(xLivre, -2.3 - i * 0.55);
          const dentro = x > -2.0 && x < 2.0;
          const saiu = x >= 2.0;
          const k = saiu ? 1 : 0;
          const cor = saiu ? VERDE : "#c9c4b8";
          const y = i % 2 ? 0.25 : -0.25;
          return (
            <mesh
              key={i}
              position={[x, y, 1.6]}
              rotation={[0, 0, Math.PI / 2]}
              scale={dentro ? 0.0001 : 1}
            >
              <capsuleGeometry args={[0.3, 0.75, 8, 16]} />
              <meshStandardMaterial
                color={cor}
                emissive={cor}
                emissiveIntensity={0.05 + 0.8 * k}
                roughness={0.35}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

const Canvas3D: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      gl={{ alpha: true }}
      camera={{ fov: 52, near: 0.1, far: 80, position: [0, 0.5, 11] }}
    >
      {children}
    </ThreeCanvas>
  );
};

export const Adrenal3D: React.FC<{ f: number; t: TemposAdrenal }> = ({
  f,
  t,
}) => (
  <Canvas3D>
    <CenaAdrenal f={f} t={t} />
  </Canvas3D>
);

export const Figado3D: React.FC<{ f: number; t: TemposFigado }> = ({
  f,
  t,
}) => (
  <Canvas3D>
    <CenaFigado f={f} t={t} />
  </Canvas3D>
);
