import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, useVideoConfig } from "remotion";

// Cenas 3D do vídeo longo "O caminho do remédio dentro do corpo" (farmacocinética do paracetamol).
// Órgãos estilizados feitos só com formas simples do three.js (sem imagem gerada, sem marca).
// Tudo depende só do quadro (f), para o render ser sempre igual.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export type TipoViagem = "copo" | "estomago" | "intestino" | "figado" | "coracao" | "cerebro" | "metabolismo" | "rim";

const COR = {
  comp: "#f8fafc",
  marcado: "#22c55e",
  toxico: "#ef4444",
  sangue: "#b91c1c",
  figado: "#7c2d12",
  rim: "#9a3412",
};

// comprimido genérico, redondo e branco, com o sulco no meio
const Comprimido: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <group scale={[s, s, s]}>
    <mesh>
      <cylinderGeometry args={[0.9, 0.9, 0.34, 56]} />
      <meshPhysicalMaterial color={COR.comp} roughness={0.55} clearcoat={0.3} />
    </mesh>
    <mesh position={[0, 0.172, 0]}>
      <boxGeometry args={[1.6, 0.02, 0.07]} />
      <meshStandardMaterial color="#cbd5e1" />
    </mesh>
  </group>
);
// molécula do remédio: bolinha branca; "marcada" ganha a etiqueta verde do fígado
const Molecula: React.FC<{ p: [number, number, number]; s?: number; cor?: string; etiqueta?: number }> = ({ p, s = 0.16, cor = COR.comp, etiqueta = 0 }) => (
  <group position={p}>
    <mesh scale={s}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color={cor} roughness={0.35} emissive={cor} emissiveIntensity={0.15} />
    </mesh>
    {etiqueta > 0.01 && (
      <mesh position={[s * 1.1, s * 0.6, 0]} scale={s * 0.6 * etiqueta}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={COR.marcado} emissive={COR.marcado} emissiveIntensity={0.8} />
      </mesh>
    )}
  </group>
);

const Cena: React.FC<{ f: number; ini: number; tipo: TipoViagem; marcos: number[]; zoom: number }> = ({ f, ini, tipo, marcos, zoom }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.6;
    scene.background = null;
  }, [gl, scene]);
  const t = f - ini;
  useLayoutEffect(() => {
    camera.position.set(Math.sin(t / 160) * 1.2, 0.9 + Math.sin(t / 220) * 0.3, (11 - Math.min(1.5, t / 260)) / zoom);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, t, zoom]);
  const nasce = interpolate(t, [0, 20], [0.001, 1], clamp);
  const m0 = marcos[0] ?? 0;
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 7, 8]} intensity={1.6} />
      <pointLight position={[-5, -2, 4]} intensity={30} color="#22c55e" />
      <group scale={[nasce, nasce, nasce]}>
        {tipo === "copo" && (
          <>
            {/* copo d'água: o comprimido cai e solta bolhas */}
            <mesh>
              <cylinderGeometry args={[1.7, 1.45, 4.2, 48, 1, true]} />
              <meshPhysicalMaterial color="#e2e8f0" roughness={0.05} transparent opacity={0.18} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[1.62, 1.47, 2.9, 48]} />
              <meshPhysicalMaterial color="#38bdf8" roughness={0.05} transparent opacity={0.25} />
            </mesh>
            <group position={[0, interpolate(t, [10, 60], [4.2, -1.7], clamp), 0]} rotation={[0.6 + t / 50, t / 40, 0.3]}>
              <Comprimido s={0.8} />
            </group>
            {Array.from({ length: 18 }, (_, i) => {
              const u = ((t - 40) / 90 + rnd(i)) % 1;
              if (t < 40) return null;
              return (
                <mesh key={i} position={[(rnd(i + 1) - 0.5) * 2.2, -1.9 + u * 2.6, (rnd(i + 2) - 0.5) * 1.6]} scale={0.06 + rnd(i + 3) * 0.06}>
                  <sphereGeometry args={[1, 12, 12]} />
                  <meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} />
                </mesh>
              );
            })}
          </>
        )}
        {tipo === "estomago" && (
          <>
            <mesh rotation={[0, 0, -0.4]} scale={[2.6, 1.8, 1.6]}>
              <sphereGeometry args={[1, 48, 32]} />
              <meshPhysicalMaterial color="#fb7185" roughness={0.35} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[2.5, -1.7, 0]} rotation={[0, 0, 0.9]}>
              <cylinderGeometry args={[0.4, 0.4, 2.4, 24, 1, true]} />
              <meshPhysicalMaterial color="#fb7185" roughness={0.35} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* o comprimido encolhe enquanto se desmancha em partículas */}
            {(() => {
              const k = interpolate(t, [40, 260], [1, 0], clamp);
              return k > 0.02 ? (
                <group rotation={[0.9, t / 70, 0.2]} scale={[k, k, k]}>
                  <Comprimido s={0.9} />
                </group>
              ) : null;
            })()}
            {Array.from({ length: 50 }, (_, i) => {
              const sai = interpolate(t, [40 + rnd(i) * 200, 120 + rnd(i) * 200], [0, 1], clamp);
              if (sai <= 0) return null;
              const a = rnd(i + 3) * Math.PI * 2;
              const r = sai * (0.6 + rnd(i + 4) * 1.2);
              // depois de espalhar, vão escorrendo para a saída do estômago
              const vai = interpolate(t, [m0 || 999999, (m0 || 999999) + 120], [0, 1], clamp) * rnd(i + 9);
              const x = Math.cos(a) * r * (1 - vai) + 2.7 * vai;
              const y = Math.sin(a) * r * 0.7 * (1 - vai) - 1.9 * vai;
              return <Molecula key={i} p={[x, y, (rnd(i + 5) - 0.5) * 1.2]} s={0.09 + rnd(i + 6) * 0.05} />;
            })}
          </>
        )}
        {tipo === "intestino" && (
          <group rotation={[0.35, -0.3, 0]}>
            {/* parede do intestino com as vilosidades balançando */}
            <mesh position={[0, -1.8, 0]}>
              <boxGeometry args={[8, 0.4, 3.2]} />
              <meshStandardMaterial color="#f9a8d4" roughness={0.6} />
            </mesh>
            {Array.from({ length: 24 }, (_, i) => {
              const x = -3.5 + (i % 8);
              const z = -1 + Math.floor(i / 8);
              return (
                <mesh key={i} position={[x, -0.9, z]} rotation={[0, 0, Math.sin(t / 25 + i) * 0.12]}>
                  <capsuleGeometry args={[0.28, 1.3, 8, 16]} />
                  <meshStandardMaterial color="#f472b6" roughness={0.5} />
                </mesh>
              );
            })}
            {/* vaso de sangue por cima, onde o remédio entra */}
            <mesh position={[0, 1.9, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.55, 0.55, 8.5, 32, 1, true]} />
              <meshPhysicalMaterial color={COR.sangue} roughness={0.3} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: 40 }, (_, i) => {
              const u = ((t / 140 + rnd(i)) % 1) * 1.6;
              const x0 = -3.5 + rnd(i + 1) * 7;
              const y = u < 1 ? -2.8 + u * 4.7 : 1.9;
              const x = u < 1 ? x0 : x0 + (u - 1) * 9;
              if (x > 4.2) return null;
              return <Molecula key={i} p={[x, y, (rnd(i + 2) - 0.5) * 2]} s={0.12} />;
            })}
          </group>
        )}
        {(tipo === "figado" || tipo === "metabolismo") && (
          <group position={tipo === "metabolismo" ? [0, 1.6, -2] : [0.4, 0.3, 0]} scale={tipo === "metabolismo" ? 0.8 : 1}>
            {/* fígado: lobo direito grande e lobo esquerdo menor */}
            {(() => {
              const vermelho = tipo === "metabolismo" ? interpolate(f, [m0 + 60, m0 + 200], [0, 1], clamp) : 0;
              const cor = new THREE.Color(COR.figado).lerp(new THREE.Color("#dc2626"), vermelho);
              return (
                <>
                  <mesh position={[0.8, 0, 0]} scale={[2.3, 1.4, 1.3]} rotation={[0, 0, -0.15]}>
                    <sphereGeometry args={[1, 48, 32]} />
                    <meshPhysicalMaterial color={cor} roughness={0.45} clearcoat={0.3} emissive={cor} emissiveIntensity={0.1 + vermelho * 0.5} />
                  </mesh>
                  <mesh position={[-1.6, 0.25, 0.1]} scale={[1.3, 0.9, 1]} rotation={[0, 0, 0.3]}>
                    <sphereGeometry args={[1, 48, 32]} />
                    <meshPhysicalMaterial color={cor} roughness={0.45} clearcoat={0.3} emissive={cor} emissiveIntensity={0.1 + vermelho * 0.5} />
                  </mesh>
                </>
              );
            })()}
            {tipo === "figado" && (
              <>
                {/* veia porta chegando do intestino (embaixo, à esquerda) */}
                <mesh position={[-2.6, -2.2, 0.6]} rotation={[0, 0, -0.75]}>
                  <cylinderGeometry args={[0.32, 0.32, 3.6, 24, 1, true]} />
                  <meshPhysicalMaterial color="#7c3aed" roughness={0.3} transparent opacity={0.55} side={THREE.DoubleSide} />
                </mesh>
                {/* veia que sai do fígado para o corpo (em cima, à direita) */}
                <mesh position={[2.9, 2.0, 0.6]} rotation={[0, 0, -0.75]}>
                  <cylinderGeometry args={[0.32, 0.32, 3.0, 24, 1, true]} />
                  <meshPhysicalMaterial color="#2563eb" roughness={0.3} transparent opacity={0.55} side={THREE.DoubleSide} />
                </mesh>
                {Array.from({ length: 36 }, (_, i) => {
                  const u = (t / 160 + rnd(i)) % 1;
                  const fica = rnd(i + 7) < 0.3; // uma parte é transformada na primeira passagem
                  // trajeto: veia porta -> dentro do fígado -> veia de saída
                  const p0 = new THREE.Vector3(-3.9, -3.5, 0.6),
                    p1 = new THREE.Vector3(0, 0, 1.2),
                    p2 = new THREE.Vector3(4, 3.2, 0.6);
                  const pos = u < 0.5 ? p0.clone().lerp(p1, u * 2) : p1.clone().lerp(p2, (u - 0.5) * 2);
                  if (fica && u > 0.55) return null;
                  const cor = fica && u > 0.4 ? "#facc15" : COR.comp;
                  return <Molecula key={i} p={[pos.x + (rnd(i + 1) - 0.5) * 0.4, pos.y + (rnd(i + 2) - 0.5) * 0.4, pos.z]} s={0.13} cor={cor} />;
                })}
              </>
            )}
          </group>
        )}
        {tipo === "metabolismo" && (
          <group position={[0, -1.2, 1]}>
            {/* esteira da "linha de produção" dentro do fígado */}
            <mesh position={[0, -0.45, 0]}>
              <boxGeometry args={[9, 0.25, 1.4]} />
              <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
            </mesh>
            {Array.from({ length: 10 }, (_, i) => {
              const x = -4.5 + ((t * 0.03 + i * 0.9) % 9);
              const toxico = i % 7 === 3;
              const excesso = f >= m0 + 40 && m0 > 0;
              const etiqueta = toxico ? 0 : interpolate(x, [-0.4, 0.2], [0, 1], clamp);
              const escudo = toxico && !excesso ? interpolate(x, [0.4, 1.0], [0, 1], clamp) : 0;
              return (
                <group key={i}>
                  <Molecula p={[x, 0, 0]} s={0.28} cor={toxico && x > 0 ? COR.toxico : COR.comp} etiqueta={etiqueta} />
                  {escudo > 0.01 && (
                    <mesh position={[x, 0, 0]} scale={0.5 * escudo} rotation={[t / 20, t / 15, 0]}>
                      <torusGeometry args={[1, 0.12, 12, 32]} />
                      <meshStandardMaterial color={COR.marcado} emissive={COR.marcado} emissiveIntensity={0.9} />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        )}
        {tipo === "coracao" && (
          <>
            {(() => {
              const b = 1 + 0.07 * Math.max(0, Math.sin(t / 5)) ** 3;
              return (
                <group scale={[b, b, b]} rotation={[0, Math.sin(t / 90) * 0.3, 0.2]}>
                  <mesh position={[-0.55, 0.4, 0]}>
                    <sphereGeometry args={[0.95, 40, 32]} />
                    <meshPhysicalMaterial color="#dc2626" roughness={0.35} clearcoat={0.5} />
                  </mesh>
                  <mesh position={[0.55, 0.4, 0]}>
                    <sphereGeometry args={[0.95, 40, 32]} />
                    <meshPhysicalMaterial color="#dc2626" roughness={0.35} clearcoat={0.5} />
                  </mesh>
                  <mesh position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[1.42, 2.1, 40]} />
                    <meshPhysicalMaterial color="#dc2626" roughness={0.35} clearcoat={0.5} />
                  </mesh>
                </group>
              );
            })()}
            {/* circulação: anel de vaso com moléculas, algumas "de carona" em proteínas */}
            <mesh rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[3.4, 0.08, 12, 96]} />
              <meshStandardMaterial color={COR.sangue} emissive={COR.sangue} emissiveIntensity={0.4} />
            </mesh>
            {Array.from({ length: 22 }, (_, i) => {
              const a = (i / 22) * Math.PI * 2 + t / 45;
              const p: [number, number, number] = [Math.cos(a) * 3.4, Math.sin(a) * 3.4 * Math.cos(Math.PI / 2.4), Math.sin(a) * 3.4 * Math.sin(Math.PI / 2.4)];
              const carona = i % 5 === 0;
              return (
                <group key={i}>
                  <Molecula p={p} s={0.15} />
                  {carona && (
                    <mesh position={[p[0] + 0.25, p[1] + 0.1, p[2]]} scale={0.3}>
                      <icosahedronGeometry args={[1, 1]} />
                      <meshStandardMaterial color="#a78bfa" roughness={0.6} />
                    </mesh>
                  )}
                </group>
              );
            })}
          </>
        )}
        {tipo === "cerebro" && (
          <>
            <mesh scale={[2.3, 1.7, 1.9]} rotation={[0, t / 200, 0]}>
              <icosahedronGeometry args={[1, 4]} />
              <meshStandardMaterial color="#f9a8d4" roughness={0.7} flatShading />
            </mesh>
            {/* barreira que protege o cérebro */}
            <mesh scale={[2.9, 2.3, 2.5]}>
              <sphereGeometry args={[1, 48, 32]} />
              <meshPhysicalMaterial color="#22d3ee" transparent opacity={0.12 + 0.05 * Math.sin(t / 10)} emissive="#22d3ee" emissiveIntensity={0.4} side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: 20 }, (_, i) => {
              const u = (t / 120 + rnd(i)) % 1;
              const a = rnd(i + 1) * Math.PI * 2;
              const r = 4.6 - u * 3.2;
              return <Molecula key={i} p={[Math.cos(a) * r, Math.sin(a) * r * 0.75, (rnd(i + 2) - 0.5) * 1.5]} s={0.14} cor={u > 0.5 ? "#fde68a" : COR.comp} />;
            })}
          </>
        )}
        {tipo === "rim" && (
          <>
            {/* rim em forma de feijão, ureter descendo para a bexiga */}
            <group position={[0, 1.2, 0]} rotation={[0, Math.sin(t / 120) * 0.3, 0.15]}>
              <mesh scale={[1.25, 2.0, 0.9]}>
                <sphereGeometry args={[1, 48, 32]} />
                <meshPhysicalMaterial color={COR.rim} roughness={0.4} clearcoat={0.4} />
              </mesh>
              <mesh position={[-0.95, 0, 0.1]} scale={[0.55, 0.8, 0.8]}>
                <sphereGeometry args={[1, 32, 24]} />
                <meshStandardMaterial color="#fcd34d" roughness={0.5} />
              </mesh>
            </group>
            <mesh position={[-0.9, -1.6, 0.2]} rotation={[0, 0, 0.25]}>
              <cylinderGeometry args={[0.13, 0.13, 3.0, 16]} />
              <meshStandardMaterial color="#fcd34d" />
            </mesh>
            {(() => {
              const enche = interpolate(t, [30, 400], [0.3, 1], clamp);
              return (
                <mesh position={[-1.3, -3.3, 0.2]} scale={[1.2 * enche + 0.2, 0.9 * enche + 0.2, 1]}>
                  <sphereGeometry args={[1, 32, 24]} />
                  <meshPhysicalMaterial color="#fde047" transparent opacity={0.55} roughness={0.2} />
                </mesh>
              );
            })()}
            {Array.from({ length: 26 }, (_, i) => {
              const u = (t / 150 + rnd(i)) % 1;
              // entra pelo lado direito, passa pelo filtro e desce pelo ureter
              const p: [number, number, number] =
                u < 0.4 ? [4 - u * 9, 1.2 + (rnd(i + 1) - 0.5) * 2, 0.9] : u < 0.7 ? [-0.9, 1.2 - (u - 0.4) * 9, 0.4] : [-1.1 - (u - 0.7) * 1.2, -1.5 - (u - 0.7) * 6, 0.4];
              return <Molecula key={i} p={p} s={0.13} etiqueta={1} />;
            })}
          </>
        )}
      </group>
    </>
  );
};

export const Viagem3D: React.FC<{ f: number; ini: number; tipo: TipoViagem; marcos?: number[]; h?: number; zoom?: number }> = ({ f, ini, tipo, marcos = [], h = 900, zoom = 1 }) => {
  const { width } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={h} camera={{ fov: 45, near: 0.1, far: 80, position: [0, 0.9, 11] }}>
      <Cena f={f} ini={ini} tipo={tipo} marcos={marcos} zoom={zoom} />
    </ThreeCanvas>
  );
};
