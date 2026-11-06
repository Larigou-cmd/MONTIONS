import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Objetos 3D do vídeo da semaglutida em comprimido (versão "painel 3D"): comprimido de duas cores,
// caneta, cartela, estômago, semana com doses caindo e a caixa de remédio suspeita.
// Tudo depende só do quadro (f), para o render ser sempre igual.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export type Tipo3D = "abertura" | "cartela" | "estomago" | "semana" | "caixa" | "duelo" | "falsa" | "real" | "vazia";

const Comprimido: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <group scale={[s, s, s]}>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 0.8, 40]} />
      <meshPhysicalMaterial color="#facc15" roughness={0.2} clearcoat={1} />
    </mesh>
    <mesh position={[0, 0.8, 0]}>
      <sphereGeometry args={[0.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial color="#facc15" roughness={0.2} clearcoat={1} />
    </mesh>
    <mesh position={[0, -0.4, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 0.8, 40]} />
      <meshPhysicalMaterial color="#ef4444" roughness={0.2} clearcoat={1} />
    </mesh>
    <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
      <sphereGeometry args={[0.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial color="#ef4444" roughness={0.2} clearcoat={1} />
    </mesh>
  </group>
);
const Caneta: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <group scale={[s, s, s]}>
    <mesh>
      <cylinderGeometry args={[0.28, 0.28, 3.0, 40]} />
      <meshPhysicalMaterial color="#e5e7eb" roughness={0.25} metalness={0.2} clearcoat={0.8} />
    </mesh>
    <mesh position={[0, 1.15, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.9, 40]} />
      <meshPhysicalMaterial color="#22d3ee" roughness={0.3} clearcoat={1} />
    </mesh>
    <mesh position={[0, -0.2, 0.22]}>
      <boxGeometry args={[0.22, 0.7, 0.12]} />
      <meshPhysicalMaterial color="#bae6fd" roughness={0.1} transparent opacity={0.8} />
    </mesh>
    <mesh position={[0, -1.65, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.3, 24]} />
      <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

const Cena: React.FC<{ f: number; ini: number; tipo: Tipo3D; marcos: number[]; zoom: number }> = ({ f, ini, tipo, marcos, zoom }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.6;
    scene.background = null;
  }, [gl, scene]);
  const t = f - ini;
  useLayoutEffect(() => {
    camera.position.set(Math.sin(t / 140) * 1.4, 0.8 + Math.sin(t / 200) * 0.3, (11 - Math.min(1.5, t / 200)) / zoom);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, t]);
  const nasce = interpolate(t, [0, 20], [0.001, 1], clamp);
  const m0 = marcos[0] ?? 0,
    m1 = marcos[1] ?? 0;
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 8]} intensity={1.6} />
      <pointLight position={[-5, -2, 4]} intensity={30} color="#22c55e" />
      <group scale={[nasce, nasce, nasce]}>
        {tipo === "abertura" && (
          <>
            {/* a caneta sai para a esquerda e o comprimido entra girando */}
            <group position={[interpolate(f, [m0 - 20, m0 + 10], [0, -3.4], clamp), 0, 0]} rotation={[0, 0, 0.5 + t / 90]}>
              <Caneta s={1.1} />
            </group>
            <group position={[interpolate(f, [m0 - 10, m0 + 20], [6, 1.6], clamp), interpolate(f, [m0 - 10, m0 + 20], [3, 0], clamp), 0]} rotation={[t / 40, t / 25, 0.6]}>
              <Comprimido s={1.5} />
            </group>
          </>
        )}
        {tipo === "cartela" && (
          <group rotation={[0.75 + Math.sin(t / 60) * 0.05, Math.sin(t / 90) * 0.35, 0]}>
            <mesh>
              <boxGeometry args={[6.2, 0.12, 3.0]} />
              <meshStandardMaterial color="#9aa4b2" metalness={0.6} roughness={0.35} />
            </mesh>
            {Array.from({ length: 8 }, (_, i) => {
              const x = -2.4 + (i % 4) * 1.6,
                z = i < 4 ? -0.7 : 0.7;
              const k = interpolate(f, [m0 + i * 4, m0 + i * 4 + 10], [0, 1], clamp);
              return (
                <group key={i} position={[x, 0.08, z]}>
                  <mesh>
                    <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial color="#e2e8f0" roughness={0.1} clearcoat={1} transparent opacity={0.45} />
                  </mesh>
                  <mesh position={[0, 0.18, 0]} scale={[0.4 * k + 0.001, 0.2 * k + 0.001, 0.4 * k + 0.001]}>
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.4} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}
        {tipo === "estomago" && (
          <>
            <mesh rotation={[0, 0, -0.4]} scale={[2.6, 1.8, 1.6]}>
              <sphereGeometry args={[1, 48, 32]} />
              <meshPhysicalMaterial color="#fb7185" roughness={0.35} transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[2.5, -1.7, 0]} rotation={[0, 0, 0.9]}>
              <cylinderGeometry args={[0.4, 0.4, 2.4, 24, 1, true]} />
              <meshPhysicalMaterial color="#fb7185" roughness={0.35} transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: 34 }, (_, i) => {
              // comida saindo devagar pelo piloro; depois do marco fica ainda mais lenta
              const vel = interpolate(f, [m0 - 10, m0 + 30], [0.012, 0.003], clamp);
              const u = (rnd(i) + t * vel * (0.7 + rnd(i + 9) * 0.6)) % 1;
              const dentro = u < 0.8;
              const a = rnd(i + 3) * Math.PI * 2;
              const p: [number, number, number] = dentro
                ? [Math.cos(a) * 1.8 * rnd(i + 5), Math.sin(a) * 1.1 * rnd(i + 6), (rnd(i + 7) - 0.5) * 1.2]
                : [1.6 + (u - 0.8) * 9, -1.0 - (u - 0.8) * 7, 0];
              return (
                <mesh key={i} position={p} scale={0.16 + rnd(i + 8) * 0.08}>
                  <icosahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial color={i % 3 ? "#fbbf24" : "#a3e635"} roughness={0.5} />
                </mesh>
              );
            })}
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2 + t / 40;
              const k = interpolate(f, [m1, m1 + 20], [0, 1], clamp);
              return (
                <mesh key={`g${i}`} position={[Math.cos(a) * 3.4, Math.sin(a) * 2.4, 0.5]} scale={0.18 * k + 0.001}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1.5} />
                </mesh>
              );
            })}
          </>
        )}
        {tipo === "semana" && (
          <group rotation={[0.5, -0.25 + Math.sin(t / 120) * 0.1, 0]}>
            {[0, 1].map((linha) =>
              Array.from({ length: 7 }, (_, d) => {
                const x = -3.6 + d * 1.2,
                  z = linha === 0 ? -0.9 : 0.9;
                const cai = linha === 0 ? (d === 0 ? interpolate(f, [m0, m0 + 14], [0, 1], clamp) : 0) : interpolate(f, [m1 + d * 5, m1 + d * 5 + 12], [0, 1], clamp);
                return (
                  <group key={`${linha}-${d}`} position={[x, 0, z]}>
                    <mesh>
                      <boxGeometry args={[1.05, 0.18, 1.3]} />
                      <meshStandardMaterial color={cai > 0.9 ? (linha === 0 ? "#7f1d1d" : "#1e3a8a") : "#1f2937"} roughness={0.6} />
                    </mesh>
                    {cai > 0 && (
                      <group position={[0, 0.5 + (1 - cai) * 4, 0]} rotation={[Math.PI / 2, 0, linha === 0 ? 0.3 : 0]}>
                        {linha === 0 ? <Caneta s={0.28} /> : <Comprimido s={0.32} />}
                      </group>
                    )}
                  </group>
                );
              }),
            )}
          </group>
        )}
        {tipo === "caixa" && (
          <group rotation={[0.25, t / 50, Math.sin(t / 30) * 0.08]}>
            <mesh>
              <boxGeometry args={[3.2, 2.0, 1.2]} />
              <meshPhysicalMaterial color="#f97316" roughness={0.45} clearcoat={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.61]}>
              <planeGeometry args={[2.6, 0.7]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            <mesh position={[0, 0.65, 0.61]}>
              <planeGeometry args={[2.6, 0.2]} />
              <meshStandardMaterial color="#fde68a" />
            </mesh>
          </group>
        )}
        {tipo === "falsa" && (
          <>
            {/* caneta genérica girando com luz vermelha de alerta piscando */}
            <pointLight position={[3, 2, 4]} intensity={20 + 40 * (0.5 + 0.5 * Math.sin(t / 5))} color="#ef4444" />
            <group rotation={[0.35, t / 40, 0.55 + Math.sin(t / 50) * 0.1]}>
              <Caneta s={1.6} />
            </group>
          </>
        )}
        {tipo === "real" && (
          <>
            <pointLight position={[3, 2, 4]} intensity={45} color="#22c55e" />
            <group rotation={[0.3, t / 45, 0.5]}>
              <Caneta s={1.6} />
            </group>
          </>
        )}
        {tipo === "vazia" && (
          <group rotation={[0.3, t / 45, 0.5]} scale={[1.6, 1.6, 1.6]}>
            {/* corpo transparente: não dá para saber o que tem dentro */}
            <mesh>
              <cylinderGeometry args={[0.28, 0.28, 3.0, 40]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.05} transparent opacity={0.22} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.9, 40]} />
              <meshPhysicalMaterial color="#64748b" roughness={0.3} transparent opacity={0.5} />
            </mesh>
            <mesh position={[0, -1.65, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.3, 24]} />
              <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        )}
        {tipo === "duelo" && (
          <>
            <group position={[-2.2, 0, 0]} rotation={[0.3, t / 35, 0.4]}>
              <Caneta s={0.95} />
            </group>
            <group position={[2.2, 0, 0]} rotation={[t / 45, t / 30, 0.5]}>
              <Comprimido s={1.25} />
            </group>
          </>
        )}
      </group>
    </>
  );
};

export const Objeto3D: React.FC<{ f: number; ini: number; tipo: Tipo3D; marcos?: number[]; h?: number; zoom?: number }> = ({ f, ini, tipo, marcos = [], h = 900, zoom = 1 }) => {
  const { width } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={h} camera={{ fov: 45, near: 0.1, far: 80, position: [0, 0.8, 11] }}>
      <Cena f={f} ini={ini} tipo={tipo} marcos={marcos} zoom={zoom} />
    </ThreeCanvas>
  );
};
