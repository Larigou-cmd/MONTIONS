import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { useVideoConfig } from "remotion";

// Máquina de pegar bichinho em 3D low-poly (personagem e cenário nossos).
// Tudo depende só do quadro f, para o render ser sempre igual.

export const tf = (t: number) => Math.round((t + 0.3) * 30);
const sm = (k: number) => {
  const c = Math.min(1, Math.max(0, k));
  return c * c * (3 - 2 * c);
};
const ss = (t: number, a: number, b: number) =>
  sm((t - a) / Math.max(1e-6, b - a));

export const FASES = {
  gancho: 0,
  ze: 4.26,
  abrir: 12.68,
  ima: 21.28,
  placa: 28.36,
  conta: 35.28,
  jogadas: 44.82,
  vez: 53.94,
  dicas: 58.08,
  final: 66.06,
};
export type Fase = keyof typeof FASES;
export const faseEmT = (t: number): Fase => {
  let r: Fase = "gancho";
  for (const k of Object.keys(FASES) as Fase[]) if (t >= FASES[k]) r = k;
  return r;
};

// ---------- medidas da máquina ----------
const PISO = 1.0; // chão de dentro (onde ficam os bichinhos)
const TOPO = 2.6;
const LX = 0.85; // meia largura
const LZ = 0.72; // meia profundidade
const Y_TRILHO = 2.5;
const CALHA: [number, number] = [0.52, 0.42]; // buraco do prêmio (x, z)
const BANDEJA: [number, number, number] = [0.52, 0.32, 0.86];

// ---------- garra: quadros-chave (t, x, z, y, abre) ----------
type K = [number, number, number, number, number];
const REPOUSO: [number, number] = CALHA;
const KS: K[] = [
  [0, -0.3, 0, 2.3, 1],
  [0.6, -0.3, 0, 1.47, 1],
  [0.9, -0.3, 0, 1.47, 0],
  [1.9, -0.3, 0, 2.3, 0.1],
  [2.45, -0.3, 0, 2.3, 0.15],
  [2.6, -0.3, 0, 2.3, 0.8],
  [4.1, -0.3, 0, 2.3, 1],
  [4.2, REPOUSO[0], REPOUSO[1], 2.3, 1],
  [5.76, REPOUSO[0], REPOUSO[1], 2.3, 1],
  [6.9, -0.3, 0, 2.3, 1],
  [7.12, -0.3, 0, 2.3, 1],
  [7.9, -0.3, 0, 1.47, 1],
  [8.12, -0.3, 0, 1.47, 0],
  [8.86, -0.3, 0, 1.6, 0.1],
  [10.0, -0.3, 0, 2.3, 0.12],
  [10.55, -0.05, 0.22, 2.3, 0.15],
  [10.75, 0.0, 0.25, 2.3, 0.85],
  [11.9, 0.0, 0.25, 2.3, 1],
  [12.6, REPOUSO[0], REPOUSO[1], 2.3, 1],
  [16.66, REPOUSO[0], REPOUSO[1], 2.3, 1],
  [17.4, REPOUSO[0], -0.45, 2.3, 1],
  [18.1, REPOUSO[0], -0.45, 2.3, 1],
  [18.7, -0.55, -0.45, 2.3, 1],
  [19.8, -0.55, -0.45, 2.3, 1],
  [20.3, -0.55, -0.45, 1.6, 1],
  [20.9, -0.55, -0.45, 2.3, 1],
  [21.25, 0, 0, 2.05, 1],
  [21.76, 0, 0, 2.05, 1],
  [22.6, 0, 0, 2.05, 0.55],
  [25.4, 0, 0, 2.05, 0.55],
  [27.9, 0, 0, 2.05, 0],
  [28.3, 0, 0, 2.05, 0],
  [44.7, REPOUSO[0], REPOUSO[1], 2.3, 1],
  [45.3, 0, 0.25, 2.3, 1],
  [45.8, 0, 0.25, 1.47, 1],
  [46.1, 0, 0.25, 1.47, 0],
  [46.8, 0, 0.25, 2.2, 0.15],
  [47.0, 0, 0.25, 2.25, 0.2],
  [47.15, 0, 0.25, 2.25, 0.85],
  [47.3, 0, 0.25, 2.3, 1],
  [47.65, 0, 0.25, 1.47, 1],
  [48.0, 0, 0.25, 1.47, 0],
  [48.7, 0, 0.25, 2.15, 0.15],
  [48.95, 0, 0.25, 2.2, 0.2],
  [49.1, 0, 0.25, 2.2, 0.85],
  [49.4, 0, 0.25, 2.3, 1],
  [52.3, 0, 0.25, 2.3, 1],
  [52.75, 0, 0.25, 1.47, 1],
  [53.0, 0, 0.25, 1.47, 0],
  [53.6, 0, 0.25, 2.3, 0],
  [54.4, CALHA[0], CALHA[1], 2.3, 0],
  [54.6, CALHA[0], CALHA[1], 2.3, 1],
  [80, CALHA[0], CALHA[1], 2.3, 1],
];
export const garraEm = (t: number) => {
  let i = 0;
  while (i < KS.length - 2 && KS[i + 1][0] <= t) i++;
  const a = KS[i];
  const b = KS[i + 1];
  const k = sm((t - a[0]) / (b[0] - a[0]));
  const m = (j: number) => a[j] + (b[j] - a[j]) * k;
  return { x: m(1), z: m(2), y: m(3), abre: m(4) };
};

// força mandada ao eletroímã (0 a 1) e se é "força total" (garra dourada)
export const forcaEm = (t: number) => {
  if (t >= 21.76 && t < 28.36)
    return 0.32 + 0.68 * ss(t, 25.4, 27.9) * (t < 28.2 ? 1 : 0);
  if (t >= 52.4 && t < 55.2) return 1;
  const pega = [
    [0.9, 2.45],
    [8.12, 10.6],
    [46.1, 47.0],
    [48.0, 48.95],
  ];
  for (const [a, b] of pega) if (t >= a && t < b) return 0.3;
  return 0;
};

// ---------- ursinho principal ----------
type Seg = {
  de: number;
  ate: number;
  destino: [number, number, number];
  teleporte?: boolean;
};
const Y_URSO = PISO + 0.14;
const CASA: [number, number, number] = [-0.3, Y_URSO, 0];
const SEGS: Seg[] = [
  { de: 0.9, ate: 2.6, destino: CASA },
  { de: 4.2, ate: 4.2, destino: CASA, teleporte: true },
  { de: 8.12, ate: 10.75, destino: [0, Y_URSO, 0.25] },
  { de: 46.1, ate: 47.15, destino: [0, Y_URSO, 0.25] },
  { de: 48.0, ate: 49.1, destino: [0, Y_URSO, 0.25] },
  { de: 53.0, ate: 54.6, destino: BANDEJA },
];
const presoEm = (t: number): [number, number, number] => {
  const g = garraEm(t);
  return [g.x, g.y - 0.34, g.z];
};
export const ursoEm = (t: number): [number, number, number] => {
  let rest = CASA;
  for (const s of SEGS) {
    if (t < s.de) return rest;
    if (s.teleporte) {
      rest = s.destino;
      continue;
    }
    if (t < s.ate) return presoEm(t);
    const dt = t - s.ate;
    const ini = presoEm(s.ate);
    const dur = 0.4;
    if (dt < dur) {
      const k = (dt / dur) ** 2;
      if (s.destino === BANDEJA) {
        // cai pela calha e aparece na bandeja da frente
        if (k < 0.7)
          return [ini[0], ini[1] + (0.4 - ini[1]) * (k / 0.7), ini[2]];
        return [
          s.destino[0],
          s.destino[1],
          ini[2] + (s.destino[2] - ini[2]) * ((k - 0.7) / 0.3),
        ];
      }
      return [ini[0], ini[1] + (s.destino[1] - ini[1]) * k, ini[2]];
    }
    rest = s.destino;
  }
  return rest;
};

// ---------- câmera ----------
type Cam = {
  t: number;
  p: [number, number, number];
  l: [number, number, number];
};
const CAMS: Cam[] = [
  { t: -0.3, p: [1.5, 2.05, 2.5], l: [-0.15, 1.65, 0] },
  { t: 4.25, p: [1.2, 2.0, 2.2], l: [-0.15, 1.6, 0] },
  { t: 4.26, p: [2.4, 1.9, 4.6], l: [0, 1.35, 0.2] },
  { t: 7.0, p: [1.3, 2.0, 2.9], l: [-0.15, 1.55, 0] },
  { t: 12.67, p: [1.1, 2.0, 2.6], l: [-0.1, 1.55, 0] },
  { t: 12.68, p: [2.7, 3.7, 3.4], l: [0, 1.9, 0] },
  { t: 21.27, p: [2.3, 3.5, 2.9], l: [0, 1.9, 0] },
  { t: 21.28, p: [0.75, 2.2, 1.05], l: [0, 1.95, 0] },
  { t: 28.35, p: [0.55, 2.1, 0.85], l: [0, 1.9, 0] },
  { t: 28.36, p: [1.3, 0.95, 2.6], l: [0, 0.5, 0.3] },
  { t: 35.27, p: [0.9, 0.8, 2.0], l: [0, 0.5, 0.3] },
  { t: 35.28, p: [0.35, 0.6, 1.55], l: [0, 0.5, 0.35] },
  { t: 44.81, p: [0.25, 0.58, 1.4], l: [0, 0.5, 0.35] },
  { t: 44.82, p: [1.9, 2.3, 2.9], l: [0.1, 1.6, 0.1] },
  { t: 53.93, p: [1.6, 2.2, 2.6], l: [0.2, 1.5, 0.2] },
  { t: 53.94, p: [2.4, 2.1, 4.4], l: [0.2, 1.2, 0.3] },
  { t: 58.07, p: [2.6, 2.3, 4.8], l: [0.2, 1.3, 0.3] },
  { t: 58.08, p: [-0.2, 2.45, 2.3], l: [-0.25, 1.1, -0.1] },
  { t: 66.05, p: [-0.25, 2.35, 2.15], l: [-0.25, 1.1, -0.1] },
  { t: 66.06, p: [2.5, 1.7, 4.4], l: [0.3, 1.1, 0.6] },
  { t: 75, p: [2.1, 1.7, 3.9], l: [0.3, 1.1, 0.6] },
];
const camEm = (t: number) => {
  let i = 0;
  while (i < CAMS.length - 2 && CAMS[i + 1].t <= t) i++;
  const a = CAMS[i];
  const b = CAMS[i + 1];
  const k = sm((t - a.t) / (b.t - a.t));
  const mix = (u: number[], v: number[]) =>
    u.map((x, j) => x + (v[j] - x) * k) as [number, number, number];
  return { p: mix(a.p, b.p), l: mix(a.l, b.l) };
};

// ---------- peças ----------
const COR = {
  fundo: "#f6efe4",
  corpo: "#e8443a",
  corpo2: "#c7352d",
  metal: "#b9bec6",
  escuro: "#2a2a30",
  amarelo: "#ffcc22",
  ouro: "#ffb800",
  cobre: "#c8743c",
  placa: "#1f7a4a",
  vidro: "#bfe6ff",
};

const Mat: React.FC<{
  c: string;
  e?: string;
  ei?: number;
  o?: number;
  m?: number;
}> = ({ c, e, ei = 0, o, m = 0 }) => (
  <meshStandardMaterial
    color={c}
    flatShading
    roughness={0.7}
    metalness={m}
    emissive={e ?? "#000"}
    emissiveIntensity={ei}
    transparent={o !== undefined}
    opacity={o ?? 1}
    depthWrite={o === undefined || o > 0.6}
  />
);

const Urso: React.FC<{
  cor: string;
  pos: [number, number, number];
  rot?: number;
  anel?: string;
}> = ({ cor, pos, rot = 0, anel }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <mesh position={[0, 0, 0]} castShadow>
      <icosahedronGeometry args={[0.13, 1]} />
      <Mat c={cor} />
    </mesh>
    <mesh position={[0, 0.17, 0.02]} castShadow>
      <icosahedronGeometry args={[0.1, 1]} />
      <Mat c={cor} />
    </mesh>
    {[0.07, -0.07].map((x) => (
      <mesh key={x} position={[x, 0.25, 0]}>
        <icosahedronGeometry args={[0.04, 0]} />
        <Mat c={cor} />
      </mesh>
    ))}
    <mesh position={[0, 0.15, 0.11]}>
      <icosahedronGeometry args={[0.035, 0]} />
      <Mat c="#f7e3c8" />
    </mesh>
    {[0.035, -0.035].map((x) => (
      <mesh key={x} position={[x, 0.2, 0.09]}>
        <sphereGeometry args={[0.013, 6, 6]} />
        <Mat c="#111" />
      </mesh>
    ))}
    {anel ? (
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial color={anel} side={THREE.DoubleSide} />
      </mesh>
    ) : null}
  </group>
);

// pilha de bichinhos (posições fixas)
const PILHA: { p: [number, number, number]; c: string; r: number }[] = [
  { p: [-0.62, Y_URSO, -0.5], c: "#ff8fb8", r: 0.4 },
  { p: [-0.35, Y_URSO, -0.45], c: "#7fd0ff", r: -0.3 },
  { p: [-0.08, Y_URSO, -0.52], c: "#b6e36b", r: 0.2 },
  { p: [-0.62, Y_URSO, -0.18], c: "#c9a4f5", r: 0.9 },
  { p: [-0.6, Y_URSO, 0.15], c: "#ffd23f", r: -0.6 },
  { p: [-0.55, Y_URSO, 0.45], c: "#ff8fb8", r: 0.3 },
  { p: [-0.25, Y_URSO, 0.4], c: "#7fd0ff", r: 1.2 },
  { p: [0.0, Y_URSO, -0.22], c: "#ff7a1a", r: -0.2 },
  { p: [0.25, Y_URSO, -0.48], c: "#c9a4f5", r: 0.5 },
  { p: [0.3, Y_URSO, -0.05], c: "#b6e36b", r: -1.0 },
  { p: [-0.32, Y_URSO + 0.2, -0.25], c: "#ffd23f", r: 0.1 },
  { p: [-0.5, Y_URSO + 0.2, -0.38], c: "#7fd0ff", r: 0.7 },
];
export const SOLTO_IDX = 9; // bichinho solto (dica)
export const VIDRO_IDX = 3; // bichinho colado no vidro (dica)

const Garra: React.FC<{
  t: number;
  brilhoTrilho: number;
  brilhoFio: number;
}> = ({ t, brilhoTrilho, brilhoFio }) => {
  const g = garraEm(t);
  const forca = forcaEm(t);
  const total = forca >= 1;
  const ang = 0.12 + 0.6 * g.abre;
  const fio = Y_TRILHO - (g.y + 0.12);
  const corGarra = total ? COR.ouro : COR.metal;
  return (
    <group>
      {/* trilhos laterais (frente e trás) */}
      {[LX - 0.06, -LX + 0.06].map((x) => (
        <mesh key={x} position={[x, Y_TRILHO, 0]}>
          <boxGeometry args={[0.05, 0.05, LZ * 2]} />
          <Mat
            c={brilhoTrilho > 0 ? COR.amarelo : COR.escuro}
            e={COR.amarelo}
            ei={brilhoTrilho}
          />
        </mesh>
      ))}
      {/* ponte (lados) */}
      <mesh position={[0, Y_TRILHO, g.z]}>
        <boxGeometry args={[LX * 2 - 0.1, 0.05, 0.06]} />
        <Mat
          c={brilhoTrilho > 0 ? COR.amarelo : COR.escuro}
          e={COR.amarelo}
          ei={brilhoTrilho}
        />
      </mesh>
      <mesh position={[g.x, Y_TRILHO - 0.04, g.z]}>
        <boxGeometry args={[0.16, 0.1, 0.16]} />
        <Mat c={COR.escuro} />
      </mesh>
      {/* fio */}
      <mesh position={[g.x, Y_TRILHO - fio / 2, g.z]}>
        <cylinderGeometry args={[0.008, 0.008, Math.max(0.01, fio), 6]} />
        <Mat
          c={brilhoFio > 0 ? COR.amarelo : "#444"}
          e={COR.amarelo}
          ei={brilhoFio}
        />
      </mesh>
      {/* cabeça da garra com a bobina do eletroímã */}
      <group position={[g.x, g.y, g.z]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.09, 16]} />
          <Mat c={COR.cobre} e="#ff9a2e" ei={forca * 1.6} m={0.3} />
        </mesh>
        {[0.045, 0.075, 0.105].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.072, 0.006, 6, 20]} />
            <Mat c="#9b5524" e="#ff9a2e" ei={forca} />
          </mesh>
        ))}
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.06, 12]} />
          <Mat
            c={corGarra}
            e={total ? COR.ouro : undefined}
            ei={total ? 0.6 : 0}
            m={0.5}
          />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <group position={[0.06, -0.02, 0]} rotation={[0, 0, ang]}>
              <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[0.025, 0.24, 0.03]} />
                <Mat
                  c={corGarra}
                  e={total ? COR.ouro : undefined}
                  ei={total ? 0.6 : 0}
                  m={0.5}
                />
              </mesh>
              <mesh position={[-0.03, -0.25, 0]} rotation={[0, 0, -0.9]}>
                <boxGeometry args={[0.025, 0.09, 0.03]} />
                <Mat c={corGarra} m={0.5} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

const Ze: React.FC<{ f: number; acena?: number; mao?: number }> = ({
  f,
  acena = 0,
  mao = 0,
}) => (
  <group scale={1.0}>
    {[0.09, -0.09].map((z) => (
      <mesh key={z} position={[0, 0.22, z]} castShadow>
        <boxGeometry args={[0.13, 0.44, 0.12]} />
        <Mat c="#2d4a7a" />
      </mesh>
    ))}
    <mesh position={[0, 0.66, 0]} castShadow>
      <boxGeometry args={[0.24, 0.46, 0.34]} />
      <Mat c="#2f8cff" />
    </mesh>
    <mesh position={[0, 1.02, 0]} castShadow>
      <icosahedronGeometry args={[0.16, 1]} />
      <Mat c="#c98b5b" />
    </mesh>
    <mesh position={[-0.02, 1.13, 0]}>
      <icosahedronGeometry args={[0.15, 1]} />
      <Mat c="#2a1d14" />
    </mesh>
    {[0.06, -0.06].map((z) => (
      <mesh key={z} position={[0.15, 1.04, z]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <Mat c="#111" />
      </mesh>
    ))}
    <group position={[0, 0.82, 0.21]} rotation={[0, 0, mao]}>
      <mesh position={[0, -0.19, 0]}>
        <boxGeometry args={[0.1, 0.38, 0.09]} />
        <Mat c="#2f8cff" />
      </mesh>
    </group>
    <group
      position={[0, 0.82, -0.21]}
      rotation={[acena > 0 ? -2.6 + Math.sin(f * 0.5) * 0.35 * acena : 0, 0, 0]}
    >
      <mesh position={[0, -0.19, 0]}>
        <boxGeometry args={[0.1, 0.38, 0.09]} />
        <Mat c="#2f8cff" />
      </mesh>
    </group>
  </group>
);

const Maquina: React.FC<{
  t: number;
  f: number;
  abertaBase: number;
  vidro: number;
}> = ({ t, f, abertaBase, vidro }) => {
  const fase = faseEmT(t);
  const brilhoTrilho = fase === "abrir" ? ss(t, 15.2, 15.6) : 0;
  const brilhoFio = fase === "abrir" ? ss(t, 19.2, 19.5) : 0;
  const placaBrilho =
    fase === "placa" || fase === "conta"
      ? 0.4 + 0.4 * Math.abs(Math.sin(f * 0.15))
      : 0.1;
  const urso = ursoEm(t);
  const dicas = fase === "dicas";
  return (
    <group>
      {/* base */}
      <mesh position={[0, PISO / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[LX * 2 + 0.1, PISO, LZ * 2 + 0.1]} />
        <Mat
          key={abertaBase < 1 ? "vazada" : "cheia"}
          c={COR.corpo}
          o={abertaBase < 1 ? abertaBase : undefined}
        />
      </mesh>
      {/* painel de controle */}
      <mesh position={[0, PISO - 0.05, LZ + 0.17]} castShadow>
        <boxGeometry args={[LX * 2 + 0.1, 0.1, 0.32]} />
        <Mat c={COR.corpo2} />
      </mesh>
      <mesh position={[-0.35, PISO + 0.06, LZ + 0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
        <Mat c="#222" />
      </mesh>
      <mesh position={[-0.35, PISO + 0.14, LZ + 0.2]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <Mat c="#ff3b30" />
      </mesh>
      <mesh position={[0.05, PISO + 0.02, LZ + 0.2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 14]} />
        <Mat c={COR.amarelo} />
      </mesh>
      {/* entrada da ficha */}
      <mesh position={[-0.55, 0.72, LZ + 0.06]}>
        <boxGeometry args={[0.12, 0.16, 0.02]} />
        <Mat c={COR.metal} m={0.4} />
      </mesh>
      <mesh position={[-0.55, 0.74, LZ + 0.075]}>
        <boxGeometry args={[0.015, 0.08, 0.01]} />
        <Mat c="#111" />
      </mesh>
      {/* porta do prêmio */}
      <mesh position={[BANDEJA[0], 0.3, LZ + 0.06]}>
        <boxGeometry args={[0.36, 0.3, 0.02]} />
        <Mat c="#1a1a1e" />
      </mesh>
      {/* placa (cérebro) dentro da base */}
      <group position={[0, 0.5, 0.45]}>
        <mesh>
          <boxGeometry args={[0.9, 0.5, 0.03]} />
          <Mat c={COR.placa} e="#2bd47a" ei={placaBrilho * 0.4} />
        </mesh>
        {[
          [-0.25, 0.1, 0.18, 0.14],
          [0.05, 0.1, 0.22, 0.16],
          [0.3, -0.08, 0.14, 0.12],
          [-0.2, -0.13, 0.26, 0.08],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.025]}>
            <boxGeometry args={[w, h, 0.025]} />
            <Mat c="#151515" />
          </mesh>
        ))}
        {[-0.38, -0.32, -0.26].map((x, i) => (
          <mesh key={x} position={[x, 0.2, 0.03]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <Mat
              c="#ff3b30"
              e="#ff3b30"
              ei={Math.floor(f / 8 + i) % 3 === 0 ? 2 : 0.2}
            />
          </mesh>
        ))}
        {placaBrilho > 0.2 ? (
          <>
            {/* fio da placa até a garra */}
            <mesh position={[0.42, 0.9, -0.2]}>
              <boxGeometry args={[0.02, 1.8, 0.02]} />
              <Mat c="#2bd47a" e="#2bd47a" ei={placaBrilho} />
            </mesh>
          </>
        ) : null}
      </group>
      {/* colunas e topo */}
      {[
        [LX, LZ],
        [-LX, LZ],
        [LX, -LZ],
        [-LX, -LZ],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, (PISO + TOPO) / 2, z]}>
          <boxGeometry args={[0.06, TOPO - PISO, 0.06]} />
          <Mat c={COR.corpo2} />
        </mesh>
      ))}
      <mesh position={[0, TOPO + 0.15, 0]} castShadow>
        <boxGeometry args={[LX * 2 + 0.1, 0.3, LZ * 2 + 0.1]} />
        <Mat c={COR.corpo} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-LX + 0.1 + i * 0.2, TOPO + 0.15, LZ + 0.06]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <Mat
            c="#fff3b0"
            e="#ffd23f"
            ei={(Math.floor(f / 6) + i) % 2 ? 1.6 : 0.2}
          />
        </mesh>
      ))}
      {/* vidro */}
      {vidro > 0.01
        ? [
            { p: [0, 1.8, LZ], r: 0, w: LX * 2 },
            { p: [0, 1.8, -LZ], r: 0, w: LX * 2 },
            { p: [LX, 1.8, 0], r: Math.PI / 2, w: LZ * 2 },
            { p: [-LX, 1.8, 0], r: Math.PI / 2, w: LZ * 2 },
          ].map((v, i) => (
            <mesh
              key={i}
              position={v.p as [number, number, number]}
              rotation={[0, v.r, 0]}
            >
              <planeGeometry args={[v.w, TOPO - PISO]} />
              <meshStandardMaterial
                color={COR.vidro}
                transparent
                opacity={vidro}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          ))
        : null}
      {/* chão de dentro */}
      <mesh position={[0, PISO + 0.005, 0]} receiveShadow>
        <boxGeometry args={[LX * 2, 0.01, LZ * 2]} />
        <Mat c="#3a2f5a" />
      </mesh>
      {/* calha do prêmio (acrílico) */}
      {[
        [CALHA[0] - 0.16, CALHA[1], Math.PI / 2],
        [CALHA[0], CALHA[1] - 0.16, 0],
      ].map(([x, z, r], i) => (
        <mesh key={i} position={[x, PISO + 0.2, z]} rotation={[0, r, 0]}>
          <boxGeometry args={[0.32, 0.4, 0.02]} />
          <Mat c="#d9f3ff" o={0.45} />
        </mesh>
      ))}
      <mesh position={[CALHA[0], PISO + 0.012, CALHA[1]]}>
        <boxGeometry args={[0.3, 0.012, 0.3]} />
        <Mat c="#0d0d10" />
      </mesh>
      {/* bichinhos */}
      {PILHA.map((u, i) => (
        <Urso
          key={i}
          cor={u.c}
          pos={u.p}
          rot={u.r}
          anel={
            dicas && i === SOLTO_IDX && t >= 60.28
              ? "#2bd47a"
              : dicas && i === VIDRO_IDX && t >= 61.26
                ? "#ff3b30"
                : undefined
          }
        />
      ))}
      <Urso cor="#a8743f" pos={urso} rot={0.3} />
      <Garra t={t} brilhoTrilho={brilhoTrilho} brilhoFio={brilhoFio} />
    </group>
  );
};

const Cena: React.FC<{ f: number }> = ({ f }) => {
  const { scene, camera } = useThree();
  const t = f / 30 - 0.3;
  const fase = faseEmT(t);
  useLayoutEffect(() => {
    scene.background = new THREE.Color(COR.fundo);
    scene.fog = new THREE.Fog(COR.fundo, 9, 25);
  }, [scene]);
  const cam = camEm(t);
  useLayoutEffect(() => {
    camera.position.set(...cam.p);
    camera.lookAt(...cam.l);
    camera.updateProjectionMatrix();
  }, [camera, cam.p[0], cam.p[1], cam.p[2], cam.l[0], cam.l[1], cam.l[2]]);
  const abertaBase = fase === "placa" || fase === "conta" ? 0.18 : 1;
  const vidro = fase === "abrir" ? 0.22 * (1 - ss(t, 13.0, 14.4)) + 0.04 : 0.2;
  const zeVisivel = fase === "ze" || fase === "final" || fase === "vez";
  const moeda = fase === "ze" ? ss(t, 4.7, 5.2) : 1;
  return (
    <>
      <hemisphereLight args={["#ffffff", "#b8ab96", 1.6]} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <Mat c="#efe3cf" />
      </mesh>
      {/* outras máquinas ao fundo */}
      {[-2.4, 2.4].map((x, i) => (
        <group key={x} position={[x, 0, -1.2]}>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[1.6, 2.8, 1.4]} />
            <Mat c={i ? "#6c5ce7" : "#00a884"} />
          </mesh>
        </group>
      ))}
      <Maquina t={t} f={f} abertaBase={abertaBase} vidro={vidro} />
      {zeVisivel ? (
        <group position={[-0.35, 0, 1.45]} rotation={[0, Math.PI / 2, 0]}>
          <Ze
            f={f}
            acena={fase === "final" ? 1 : 0}
            mao={fase === "ze" ? -0.9 * (1 - moeda) - 0.6 : 0}
          />
        </group>
      ) : null}
      {fase === "ze" && t < 5.3 ? (
        <mesh
          position={[-0.55, 0.74 + (1 - moeda) * 0.3, LZ + 0.2 - moeda * 0.12]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <Mat c={COR.ouro} e={COR.ouro} ei={0.4} m={0.6} />
        </mesh>
      ) : null}
    </>
  );
};

export const Garra3D: React.FC<{ f: number }> = ({ f }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      camera={{ fov: 50, near: 0.05, far: 80, position: [0, 2, 6] }}
    >
      <Cena f={f} />
    </ThreeCanvas>
  );
};
