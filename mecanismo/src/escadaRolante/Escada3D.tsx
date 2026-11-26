import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useVideoConfig } from "remotion";

// Escada rolante em 3D low-poly (personagem e cenário nossos).
// Tudo depende só do quadro f, para o render ser sempre igual.

export const tf = (t: number) => Math.round((t + 0.3) * 30);
const ss = (f: number, a: number, b: number) => {
  const k = Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
  return k * k * (3 - 2 * k);
};

// ---------- geometria da escada ----------
const A = 1.6; // patamar plano
const H = 3; // altura entre andares
const ANG = (30 * Math.PI) / 180;
const LX = H / Math.tan(ANG);
const R = 0.6; // raio da volta
const Hd = 0.23; // altura do espelho
const D = 0.44; // profundidade do degrau
const W = 1.0; // largura
export const GEO = { A, H, LX, R, Hd, D, W };

type Pt = { x: number; y: number; th: number };
const construirLaco = () => {
  const up: { x: number; y: number }[] = [];
  const passo = 0.02;
  const linha = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / passo));
    for (let i = 0; i < n; i++)
      up.push({ x: x0 + ((x1 - x0) * i) / n, y: y0 + ((y1 - y0) * i) / n });
  };
  const curva = (p0: number[], p1: number[], p2: number[]) => {
    const n = 40;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      up.push({
        x: (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
        y: (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
      });
    }
  };
  const c = 0.8;
  const cx = c * Math.cos(ANG);
  const cy = c * Math.sin(ANG);
  linha(-A, 0, -c, 0);
  curva([-c, 0], [0, 0], [cx, cy]);
  linha(cx, cy, LX - cx, H - cy);
  curva([LX - cx, H - cy], [LX, H], [LX + c, H]);
  linha(LX + c, H, LX + A, H);
  const pts: Pt[] = up.map((p) => ({ ...p, th: 0 }));
  const nUp = pts.length;
  // volta de cima (horária)
  for (let i = 0; i < 80; i++) {
    const phi = (Math.PI * i) / 80;
    pts.push({
      x: LX + A + R * Math.sin(phi),
      y: H - R + R * Math.cos(phi),
      th: -phi,
    });
  }
  // volta por baixo, de cabeça para baixo
  for (let i = up.length - 1; i >= 0; i--)
    pts.push({ x: up[i].x, y: up[i].y - 2 * R, th: -Math.PI });
  // volta de baixo
  for (let i = 0; i < 80; i++) {
    const phi = (Math.PI * i) / 80;
    pts.push({
      x: -A - R * Math.sin(phi),
      y: -R - R * Math.cos(phi),
      th: -Math.PI - phi,
    });
  }
  const cum = [0];
  for (let i = 1; i <= pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i % pts.length];
    cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  return { pts, cum, L: cum[pts.length], sUpEnd: cum[nUp], nUp, up };
};
const LACO = construirLaco();
export const L_LACO = LACO.L;
const S_TOPO = LACO.sUpEnd; // início da volta de cima
const S_VOLTA = Math.PI * R;

export const pontoEm = (sIn: number): Pt => {
  const { pts, cum, L } = LACO;
  const s = ((sIn % L) + L) % L;
  let lo = 0;
  let hi = pts.length;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (cum[m] <= s) lo = m;
    else hi = m;
  }
  const a = pts[lo];
  const b = pts[(lo + 1) % pts.length];
  const k = (s - cum[lo]) / Math.max(1e-6, cum[lo + 1] - cum[lo]);
  let thb = b.th;
  if (lo === pts.length - 1) thb = a.th - Math.PI / 80;
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    th: a.th + (thb - a.th) * k,
  };
};

// ---------- linha do tempo (segundos da fala) ----------
export const FASES = {
  gancho: [0, 5.4],
  ze: [5.4, 14.8],
  esteira: [14.8, 31.0],
  tortos: [31.0, 37.8],
  rodinhas: [37.8, 47.8],
  trilhos: [47.8, 61.0],
  motor: [61.0, 68.4],
  circulo: [68.4, 81.8],
  pente: [81.8, 92.7],
  ano1896: [92.7, 101.8],
  final: [101.8, 112],
} as const;
export type Fase = keyof typeof FASES;
export const faseEm = (f: number): Fase => {
  const t = f / 30 - 0.3;
  let atual: Fase = "gancho";
  (Object.keys(FASES) as Fase[]).forEach((k) => {
    if (t >= FASES[k][0] - 0.3) atual = k;
  });
  return atual;
};

// velocidade da corrente em cada quadro e posição acumulada
const S_ALVO = 1.6; // degrau amarelo no começo da subida em 68,7 s
const velocidade = (f: number) => {
  const t = f / 30 - 0.3;
  if (t >= 37.8 && t < 47.8) return 0;
  if (t >= 68.7 && t < 71.4) return (S_TOPO - S_ALVO) / 2.7;
  if (t >= 71.4 && t < 74.6) return S_VOLTA / 3.2;
  if (t >= 74.6 && t < 77.9) return LACO.sUpEnd / 3.3;
  if (t >= 77.9 && t < 78.8) return S_VOLTA / 0.9;
  return 0.5;
};
const ACUM: number[] = (() => {
  const a = [0];
  for (let f = 1; f < 4000; f++) a.push(a[f - 1] + velocidade(f - 1) / 30);
  return a;
})();
const NDEG = Math.round(LACO.L / 0.46);
const ESP = LACO.L / NDEG;
const DESLOC = S_ALVO - ACUM[tf(68.7)];
export const sDegrau = (i: number, f: number) =>
  i * ESP + ACUM[Math.min(3999, Math.max(0, f))] + DESLOC;
const degrauPerto = (f: number, alvo: number) => {
  let melhor = 0;
  let dist = 1e9;
  for (let i = 0; i < NDEG; i++) {
    const s = ((sDegrau(i, f) % LACO.L) + LACO.L) % LACO.L;
    if (Math.abs(s - alvo) < dist) {
      dist = Math.abs(s - alvo);
      melhor = i;
    }
  }
  return melhor;
};
const ZE_P9 = degrauPerto(tf(88.4), 0.9);
const ZE_P11 = degrauPerto(tf(101.8), 0.8);

// ---------- câmera ----------
type Cam = {
  t: number;
  p: [number, number, number];
  l: [number, number, number];
};
const CAMS: Cam[] = [
  { t: -0.3, p: [-5.2, 4.6, 7.4], l: [2.4, 1.9, 0] },
  { t: 4.8, p: [-3.0, 1.5, 3.0], l: [-0.9, 0.15, 0] },
  { t: 5.39, p: [-3.0, 1.5, 3.0], l: [-0.9, 0.15, 0] },
  { t: 5.4, p: [-4.6, 2.3, 6.4], l: [0.6, 1.3, 0] },
  { t: 14.79, p: [-3.9, 2.8, 7.2], l: [0.9, 1.5, 0] },
  { t: 14.8, p: [-6.2, 3.2, 8.2], l: [2.0, 1.7, 0] },
  { t: 21.5, p: [-4.4, 2.2, 6.4], l: [0.4, 1.0, 0] },
  { t: 30.99, p: [-4.4, 2.2, 6.4], l: [0.4, 1.0, 0] },
  { t: 31.0, p: [-3.6, 3.4, 6.2], l: [2.0, 1.9, 0] },
  { t: 37.79, p: [-2.8, 3.0, 5.6], l: [2.0, 1.8, 0] },
  { t: 37.8, p: [2.6, 1.75, 3.0], l: [2.55, 1.55, 0] },
  { t: 44.6, p: [2.6, 1.75, 3.0], l: [2.55, 1.55, 0] },
  { t: 46.0, p: [2.6, 2.3, 6.2], l: [2.6, 2.0, 0] },
  { t: 47.79, p: [2.6, 2.3, 6.4], l: [2.6, 2.0, 0] },
  { t: 47.8, p: [2.2, 1.2, 15.5], l: [2.2, 0.9, 0] },
  { t: 53.4, p: [2.2, 1.2, 15.5], l: [2.2, 0.9, 0] },
  { t: 55.0, p: [-0.8, 0.35, 6.4], l: [-0.8, 0.1, 0] },
  { t: 60.99, p: [-0.7, 0.35, 6.0], l: [-0.7, 0.1, 0] },
  { t: 61.0, p: [6.3, 2.5, 5.6], l: [6.2, 2.4, 0] },
  { t: 68.39, p: [6.6, 2.4, 6.4], l: [6.3, 2.3, 0] },
  { t: 68.4, p: [2.2, 1.0, 16.0], l: [2.2, 0.75, 0] },
  { t: 81.79, p: [2.2, 1.0, 16.0], l: [2.2, 0.75, 0] },
  { t: 81.8, p: [8.9, 4.7, 2.6], l: [6.6, 3.1, 0] },
  { t: 88.2, p: [8.6, 4.5, 2.9], l: [6.6, 3.1, 0] },
  { t: 88.3, p: [-2.4, 2.4, 4.6], l: [0.6, 1.0, 0] },
  { t: 92.69, p: [-1.8, 2.5, 4.4], l: [1.0, 1.2, 0] },
  { t: 92.7, p: [-6.4, 2.6, 7.4], l: [-0.4, 1.0, 0] },
  { t: 101.79, p: [-5.6, 2.4, 6.8], l: [-0.2, 1.0, 0] },
  { t: 101.8, p: [-4.8, 3.6, 7.2], l: [2.4, 1.9, 0] },
  { t: 112, p: [-4.0, 3.9, 6.6], l: [2.6, 2.2, 0] },
];
const camEm = (f: number) => {
  const t = f / 30 - 0.3;
  let i = 0;
  while (i < CAMS.length - 2 && CAMS[i + 1].t <= t) i++;
  const a = CAMS[i];
  const b = CAMS[i + 1];
  let k = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  k = k * k * (3 - 2 * k);
  const mix = (u: number[], v: number[]) =>
    u.map((x, j) => x + (v[j] - x) * k) as [number, number, number];
  return { p: mix(a.p, b.p), l: mix(a.l, b.l) };
};

// ---------- peças ----------
const COR = {
  piso: "#f1e7d6",
  parede: "#f4ece0",
  degrau: "#5d6066",
  amarelo: "#ffcc22",
  saia: "#c9ccd2",
  inox: "#aeb4bc",
  corrimao: "#1d1d1f",
  azul: "#2f8cff",
  laranja: "#ff7a1a",
  corrente: "#3b3b40",
};

const Mat: React.FC<{ c: string; e?: string; ei?: number; o?: number }> = ({
  c,
  e,
  ei = 0,
  o,
}) => (
  <meshStandardMaterial
    color={c}
    flatShading
    roughness={0.75}
    emissive={e ?? "#000"}
    emissiveIntensity={ei}
    transparent={o !== undefined}
    opacity={o ?? 1}
  />
);

const Degrau: React.FC<{
  amarelo?: boolean;
  rodas?: boolean;
  brilhoRodas?: number;
}> = ({ amarelo, rodas, brilhoRodas = 0 }) => (
  <group>
    <mesh position={[-D / 2, Hd - 0.025, 0]} castShadow receiveShadow>
      <boxGeometry args={[D, 0.05, W]} />
      <Mat
        c={amarelo ? COR.amarelo : COR.degrau}
        e={amarelo ? "#ffaa00" : undefined}
        ei={amarelo ? 0.35 : 0}
      />
    </mesh>
    {[-0.36, -0.18, 0, 0.18, 0.36].map((z) => (
      <mesh key={z} position={[-D / 2, Hd + 0.002, z]}>
        <boxGeometry args={[D * 0.96, 0.01, 0.03]} />
        <Mat c="#3c3e43" />
      </mesh>
    ))}
    <mesh position={[-0.03, Hd + 0.004, 0]}>
      <boxGeometry args={[0.05, 0.012, W]} />
      <Mat c={COR.amarelo} />
    </mesh>
    <mesh position={[-D + 0.02, Hd / 2, 0]} castShadow>
      <boxGeometry args={[0.04, Hd, W]} />
      <Mat c={amarelo ? "#e6b000" : "#4a4c52"} />
    </mesh>
    {rodas ? (
      <>
        {[W / 2 + 0.05].map((z) => (
          <group key={z}>
            <mesh position={[0, 0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
              <Mat c={COR.azul} e={COR.azul} ei={brilhoRodas} />
            </mesh>
            <mesh
              position={[-D + 0.05, 0.06, z]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
              <Mat c={COR.laranja} e={COR.laranja} ei={brilhoRodas} />
            </mesh>
          </group>
        ))}
      </>
    ) : null}
  </group>
);

// bonequinho Zé (nosso), pés na origem, olhando para +x
const Ze: React.FC<{
  f: number;
  anda?: number;
  sacolas?: boolean;
  acena?: number;
  suor?: number;
}> = ({ f, anda = 0, sacolas = true, acena = 0, suor = 0 }) => {
  const balanco = Math.sin(f * 0.35) * 0.5 * anda;
  return (
    <group scale={1.25}>
      {[0.09, -0.09].map((z, i) => (
        <mesh
          key={z}
          position={[0, 0.22, z]}
          rotation={[0, 0, (i ? -1 : 1) * balanco]}
          castShadow
        >
          <boxGeometry args={[0.13, 0.44, 0.12]} />
          <Mat c="#2d4a7a" />
        </mesh>
      ))}
      <mesh position={[0, 0.66, 0]} castShadow>
        <boxGeometry args={[0.24, 0.46, 0.34]} />
        <Mat c="#e8553d" />
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
      {/* braços */}
      <mesh position={[0, 0.62, 0.21]} rotation={[0, 0, -balanco * 0.6]}>
        <boxGeometry args={[0.1, 0.38, 0.09]} />
        <Mat c="#e8553d" />
      </mesh>
      <group
        position={[0, 0.82, -0.21]}
        rotation={[
          acena > 0 ? -2.6 + Math.sin(f * 0.5) * 0.35 * acena : 0,
          0,
          balanco * 0.6,
        ]}
      >
        <mesh position={[0, -0.19, 0]}>
          <boxGeometry args={[0.1, 0.38, 0.09]} />
          <Mat c="#e8553d" />
        </mesh>
      </group>
      {sacolas ? (
        <>
          <mesh position={[0.02, 0.3, 0.3]} castShadow>
            <boxGeometry args={[0.22, 0.26, 0.1]} />
            <Mat c="#2f8cff" />
          </mesh>
          {acena > 0 ? null : (
            <mesh position={[0.02, 0.3, -0.3]} castShadow>
              <boxGeometry args={[0.22, 0.26, 0.1]} />
              <Mat c="#ffcc22" />
            </mesh>
          )}
        </>
      ) : null}
      {suor > 0
        ? [0, 1, 2].map((i) => {
            const p = (f / 18 + i / 3) % 1;
            return (
              <mesh
                key={i}
                position={[0.05, 1.2 - p * 0.3, 0.12 - i * 0.12]}
                scale={suor * (1 - p)}
              >
                <sphereGeometry args={[0.03, 6, 6]} />
                <Mat c="#7fd0ff" />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

const Pessoa1896: React.FC<{ x: number; z: number; i: number; f: number }> = ({
  x,
  z,
  i,
  f,
}) => {
  const cores = ["#5a4632", "#2f2a26", "#6b5a44", "#3d342b"];
  const pulo = Math.max(0, Math.sin(f * 0.2 + i)) * 0.03;
  return (
    <group position={[x, Hd + pulo, z]} scale={1.15}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 0.9, 7]} />
        <Mat c={cores[i % 4]} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <icosahedronGeometry args={[0.14, 1]} />
        <Mat c="#d2a47c" />
      </mesh>
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.14, 10]} />
        <Mat c="#1e1a16" />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 12]} />
        <Mat c="#1e1a16" />
      </mesh>
    </group>
  );
};

const Loja: React.FC<{ x: number; y: number; cor: string; toldo: string }> = ({
  x,
  y,
  cor,
  toldo,
}) => (
  <group position={[x, y, -4.9]}>
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[2.6, 2.2, 0.2]} />
      <Mat c={cor} />
    </mesh>
    <mesh position={[0, 0.95, 0.12]}>
      <boxGeometry args={[2.0, 1.4, 0.05]} />
      <Mat c="#bfe3f2" e="#bfe3f2" ei={0.15} />
    </mesh>
    <mesh position={[0, 2.0, 0.35]} rotation={[0.35, 0, 0]}>
      <boxGeometry args={[2.6, 0.06, 0.7]} />
      <Mat c={toldo} />
    </mesh>
  </group>
);

const Tubo: React.FC<{
  pts: THREE.Vector3[];
  r: number;
  cor: string;
  e?: number;
  desenho?: number;
  o?: number;
}> = ({ pts, r, cor, e = 0, desenho = 1, o }) => {
  const geo = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(pts),
        Math.max(8, pts.length),
        r,
        6,
        false,
      ),
    [pts, r],
  );
  const total = geo.index ? geo.index.count : 0;
  useLayoutEffect(() => {
    geo.setDrawRange(
      0,
      Math.floor((total * Math.min(1, Math.max(0, desenho))) / 6) * 6,
    );
  }, [geo, total, desenho]);
  return (
    <mesh geometry={geo}>
      <Mat c={cor} e={cor} ei={e} o={o} />
    </mesh>
  );
};

// ---------- cena ----------
const Cena: React.FC<{ f: number }> = ({ f }) => {
  const { scene, camera } = useThree();
  const fase = faseEm(f);
  const t = f / 30 - 0.3;
  const sepia = fase === "ano1896";
  useLayoutEffect(() => {
    scene.background = new THREE.Color(sepia ? "#d8c3a0" : "#f6efe4");
    scene.fog = new THREE.Fog(sepia ? "#d8c3a0" : "#f6efe4", 14, 40);
  }, [scene, sepia]);
  const cam = camEm(f);
  useLayoutEffect(() => {
    camera.position.set(...cam.p);
    camera.lookAt(...cam.l);
    camera.updateProjectionMatrix();
  }, [camera, cam.p[0], cam.p[1], cam.p[2], cam.l[0], cam.l[1], cam.l[2]]);

  const escadaReal = [
    "gancho",
    "rodinhas",
    "trilhos",
    "motor",
    "circulo",
    "pente",
    "final",
  ].includes(fase);
  const corte = ["rodinhas", "trilhos", "motor", "circulo"].includes(fase);
  const zePasso = fase === "pente" ? ZE_P9 : fase === "final" ? ZE_P11 : -1;

  // trilhos
  const trilhoFrente = useMemo(
    () =>
      LACO.up
        .filter((_, i) => i % 6 === 0)
        .map((p) => new THREE.Vector3(p.x, p.y + 0.02, W / 2 + 0.05)),
    [],
  );
  const trilhoTras = useMemo(
    () =>
      LACO.up
        .filter((_, i) => i % 6 === 0)
        .map(
          (p) => new THREE.Vector3(p.x - D + 0.05, p.y + 0.06, W / 2 + 0.05),
        ),
    [],
  );
  const lacoInteiro = useMemo(() => {
    const out: THREE.Vector3[] = [];
    for (let s = 0; s < LACO.L; s += 0.08) {
      const p = pontoEm(s);
      out.push(new THREE.Vector3(p.x, p.y + 0.02, W / 2 + 0.12));
    }
    out.push(out[0].clone());
    return out;
  }, []);
  const corrimao = useMemo(
    () =>
      LACO.up
        .filter((_, i) => i % 6 === 0)
        .map((p) => new THREE.Vector3(p.x, p.y + Hd + 0.95, 0)),
    [],
  );

  // painel lateral (saia) desenhado em volta do laço
  const saiaGeo = useMemo(() => {
    const sh = new THREE.Shape();
    const up = LACO.up.filter((_, i) => i % 5 === 0);
    sh.moveTo(up[0].x - R - 0.25, up[0].y + Hd + 0.12);
    up.forEach((p) => sh.lineTo(p.x, p.y + Hd + 0.12));
    sh.lineTo(LX + A + R + 0.25, H + Hd + 0.12);
    sh.lineTo(LX + A + R + 0.25, H - 2 * R - 0.35);
    [...up].reverse().forEach((p) => sh.lineTo(p.x, p.y - 2 * R - 0.35));
    sh.lineTo(up[0].x - R - 0.25, -2 * R - 0.35);
    sh.closePath();
    return new THREE.ShapeGeometry(sh);
  }, []);
  const vidroGeo = useMemo(() => {
    const sh = new THREE.Shape();
    const up = LACO.up.filter((_, i) => i % 5 === 0);
    sh.moveTo(up[0].x, up[0].y + Hd + 0.12);
    up.forEach((p) => sh.lineTo(p.x, p.y + Hd + 0.12));
    [...up].reverse().forEach((p) => sh.lineTo(p.x, p.y + Hd + 0.92));
    sh.closePath();
    return new THREE.ShapeGeometry(sh);
  }, []);

  // degraus
  const amareloOn = fase === "circulo" || fase === "rodinhas";
  const destaque = fase === "rodinhas" ? degrauPerto(tf(38), 7.0) : 0;
  const brilhoRodas =
    fase === "rodinhas"
      ? 0.25 + 0.6 * ss(f, tf(40.3), tf(41.0)) * (0.6 + 0.4 * Math.sin(f * 0.3))
      : 0.15;
  const degraus = escadaReal
    ? Array.from({ length: NDEG }, (_, i) => {
        const p = pontoEm(sDegrau(i, f));
        return (
          <group key={i} position={[p.x, p.y, 0]} rotation={[0, 0, p.th]}>
            <Degrau
              amarelo={amareloOn && i === destaque}
              rodas={corte}
              brilhoRodas={brilhoRodas}
            />
          </group>
        );
      })
    : null;

  // corrente (elos)
  const elos =
    fase === "motor" || fase === "circulo"
      ? Array.from({ length: NDEG * 3 }, (_, i) => {
          const p = pontoEm(i * (ESP / 3) + ACUM[f] + DESLOC);
          return (
            <mesh
              key={i}
              position={[p.x, p.y + 0.02, W / 2 + 0.1]}
              rotation={[0, 0, p.th]}
            >
              <boxGeometry args={[ESP / 3 - 0.02, 0.05, 0.03]} />
              <Mat
                c={COR.corrente}
                e="#ff3b30"
                ei={fase === "motor" ? 0.4 * ss(f, tf(63.2), tf(63.8)) : 0}
              />
            </mesh>
          );
        })
      : null;
  const giro = ACUM[f] / R;
  const motorBrilho =
    fase === "motor"
      ? ss(f, tf(65.9), tf(66.5)) * (0.5 + 0.3 * Math.sin(f * 0.4))
      : 0;

  // esteira (fases 3, 4 e 1896)
  const esteira = fase === "esteira" || fase === "tortos" || sepia;
  const angEst =
    fase === "esteira"
      ? (16 + 18 * ss(f, tf(19.2), tf(21.4))) * (Math.PI / 180)
      : ANG;
  const congelado = fase === "esteira" && t >= 24.0;
  const tEst = congelado ? 24.0 : t;
  const movEst = (tEst * 0.8) % 0.5;

  // Zé na esteira
  let zeEst: React.ReactNode = null;
  if (fase === "esteira") {
    const sobe = Math.min(2.8, Math.max(0, (tEst - 16.0) * 0.55));
    const desce = ss(tEst * 30, 22.6 * 30, 23.4 * 30) * 3.6;
    const xLoc = 0.6 + sobe - desce;
    const caindo = Math.max(0, tEst - 23.3);
    if (xLoc > 0.2) {
      const ca = Math.cos(angEst);
      const sa = Math.sin(angEst);
      zeEst = (
        <group
          position={[xLoc * ca, Hd + 0.08 + xLoc * sa, 0]}
          rotation={[0, 0, angEst * 0.5 + desce * 0.25]}
        >
          <Ze f={congelado ? tf(24) : f} anda={tEst < 21.4 ? 0.6 : 0} />
        </group>
      );
    } else {
      zeEst = (
        <group
          position={[
            -0.6 - caindo * 1.5,
            Hd + 0.3 + Math.max(-0.3, 0.5 - caindo * 3),
            0,
          ]}
          rotation={[0, 0, 0.6 + Math.min(1.3, caindo * 4)]}
        >
          <Ze f={tf(24)} />
        </group>
      );
    }
  }

  // Zé na escada rolante
  let zeRola: React.ReactNode = null;
  if (zePasso >= 0) {
    const p = pontoEm(sDegrau(zePasso, f));
    zeRola = (
      <group position={[p.x - D / 2, p.y + Hd, 0]}>
        <Ze
          f={f}
          acena={fase === "final" ? ss(f, tf(102), tf(102.6)) : 0}
          sacolas
        />
      </group>
    );
  }

  // Zé na escada comum
  const zeComum =
    fase === "ze" ? (
      <group
        position={[
          -0.9 + Math.min(1.0, Math.max(0, (t - 7) * 0.22)),
          Hd + Math.min(0.46, Math.max(0, (t - 8.4) * 0.12)),
          0,
        ]}
      >
        <Ze
          f={f}
          anda={t > 7 && t < 12 ? 0.5 : 0}
          suor={ss(f, tf(10.4), tf(11))}
        />
      </group>
    ) : null;

  const pente =
    fase === "pente" || fase === "gancho" || fase === "final" || corte;
  const penteBrilho =
    fase === "pente"
      ? ss(f, tf(83.4), tf(84)) * (0.5 + 0.3 * Math.sin(f * 0.4))
      : 0;
  const marcas = Array.from({ length: 22 }, (_, i) => {
    const n = LACO.up.length;
    const k = Math.floor(
      ((((i / 22) * n + (ACUM[f] / LACO.sUpEnd) * n) % n) + n) % n,
    );
    const p = LACO.up[k];
    return (
      <mesh key={i} position={[p.x, p.y + Hd + 0.97, 0]}>
        <boxGeometry args={[0.1, 0.03, 0.09]} />
        <Mat c="#ffffff" e="#ffffff" ei={fase === "pente" ? 0.5 : 0.1} />
      </mesh>
    );
  });

  return (
    <>
      <hemisphereLight args={["#ffffff", "#b8ab96", 1.7]} />
      <directionalLight
        position={[-4, 10, 8]}
        intensity={2.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* andar de baixo e de cima */}
      <mesh position={[-8 - A - R - 0.3, Hd - 0.15, 0]} receiveShadow>
        <boxGeometry args={[16, 0.3, 12]} />
        <Mat c={COR.piso} />
      </mesh>
      <mesh position={[-A - (R + 0.3) / 2, Hd - 0.03, 0]} receiveShadow>
        <boxGeometry args={[R + 0.3, 0.06, W + 0.4]} />
        <Mat c={COR.inox} />
      </mesh>
      {/* chão em volta da escada, nas laterais */}
      {[1, -1].map((s) =>
        corte && s === 1 ? null : (
          <mesh
            key={s}
            position={[LX / 2, Hd - 0.15, s * (W / 2 + 3.4)]}
            receiveShadow
          >
            <boxGeometry args={[LX + 2 * A + 6, 0.3, 6]} />
            <Mat c={COR.piso} />
          </mesh>
        ),
      )}
      <mesh position={[LX + A + 8 + R, H + Hd - 0.2, 0]} receiveShadow>
        <boxGeometry args={[16, 0.4, 12]} />
        <Mat c={COR.piso} />
      </mesh>
      <mesh position={[LX + A + (R + 0.3) / 2 + 0.02, H + Hd - 0.03, 0]}>
        <boxGeometry args={[R + 0.3, 0.06, W + 0.4]} />
        <Mat c={COR.inox} />
      </mesh>
      {!escadaReal ? (
        <mesh
          position={[(LX + LX + A + R + 0.3) / 2, H + Hd - 0.2, 0]}
          receiveShadow
        >
          <boxGeometry args={[A + R + 0.3, 0.4, 12]} />
          <Mat c={COR.piso} />
        </mesh>
      ) : null}
      {/* pente de metal nas duas pontas */}
      {pente
        ? [
            [LX + A + 0.02, H + Hd, -1],
            [-A - 0.02, Hd, 1],
          ].map(([x, y, s], k) => (
            <group key={k} position={[x, y, 0]}>
              {Array.from({ length: 12 }, (_, j) => (
                <mesh key={j} position={[s * 0.05, 0.01, -0.45 + j * 0.082]}>
                  <boxGeometry args={[0.12, 0.025, 0.03]} />
                  <Mat c={COR.amarelo} e="#ffcc22" ei={penteBrilho} />
                </mesh>
              ))}
            </group>
          ))
        : null}
      {/* parede de fundo e lojas */}
      <mesh position={[2, 4, -5.2]}>
        <boxGeometry args={[40, 12, 0.2]} />
        <Mat c={COR.parede} />
      </mesh>
      {!sepia ? (
        <>
          <Loja x={-7.5} y={Hd} cor="#7fc8a9" toldo="#e8553d" />
          <Loja x={-4.4} y={Hd} cor="#f2b134" toldo="#2f8cff" />
          <Loja x={8.6} y={H + Hd} cor="#c39bd3" toldo="#ffcc22" />
          <Loja x={11.7} y={H + Hd} cor="#85c1e9" toldo="#e8553d" />
        </>
      ) : null}

      {/* escada comum */}
      {fase === "ze"
        ? Array.from({ length: 13 }, (_, i) => (
            <mesh
              key={i}
              position={[i * 0.4, Hd + i * 0.23 + 0.115, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.4, 0.23 + 0.02, W]} />
              <Mat c="#b9aa94" />
            </mesh>
          ))
        : null}
      {zeComum}

      {/* esteira inclinada */}
      {esteira ? (
        <group position={[0, Hd, 0]} rotation={[0, 0, angEst]}>
          <mesh position={[3.25, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.5, 0.15, W]} />
            <Mat c={sepia ? "#5b4a37" : "#3f4248"} />
          </mesh>
          {fase !== "tortos"
            ? Array.from({ length: 13 }, (_, i) => (
                <mesh key={i} position={[(i * 0.5 + movEst) % 6.5, 0.08, 0]}>
                  <boxGeometry args={[0.06, 0.02, W * 0.98]} />
                  <Mat c={sepia ? "#8a7356" : "#7d8189"} />
                </mesh>
              ))
            : Array.from({ length: 14 }, (_, i) => (
                <mesh
                  key={i}
                  position={[((i * 0.46 + t * 0.5) % 6.44) + 0.03, 0.12, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.4, 0.05, W]} />
                  <Mat c={COR.degrau} />
                </mesh>
              ))}
          {[0.6, 3.2, 5.8].map((x) => (
            <mesh key={x} position={[x, -0.6, 0]} rotation={[0, 0, -angEst]}>
              <boxGeometry args={[0.12, 1.2 + x * 0.3, 0.12]} />
              <Mat c="#8d8f94" />
            </mesh>
          ))}
        </group>
      ) : null}
      {zeEst}
      {fase === "tortos" ? (
        <group
          position={[1.6 * Math.cos(ANG), Hd + 0.14 + 1.6 * Math.sin(ANG), 0]}
          rotation={[0, 0, ANG + Math.sin(f * 0.25) * 0.12]}
        >
          <Ze f={f} />
        </group>
      ) : null}
      {sepia
        ? Array.from({ length: 16 }, (_, i) => (
            <Pessoa1896
              key={i}
              i={i}
              f={f}
              x={-1.0 - i * 0.62}
              z={0.15 * Math.sin(i * 1.7)}
            />
          ))
        : null}

      {/* escada rolante de verdade */}
      {escadaReal ? (
        <>
          {degraus}
          {[1, -1].map((s) =>
            corte && s === 1 ? null : (
              <mesh
                key={s}
                geometry={saiaGeo}
                position={[0, 0, s * (W / 2 + 0.2)]}
              >
                <meshStandardMaterial
                  color={corte ? "#e3e6ea" : COR.saia}
                  side={THREE.DoubleSide}
                  flatShading
                />
              </mesh>
            ),
          )}
          {!corte ? (
            <>
              {[1, -1].map((s) => (
                <mesh
                  key={s}
                  geometry={vidroGeo}
                  position={[0, 0, s * (W / 2 + 0.12)]}
                >
                  <meshStandardMaterial
                    color="#bfe6ff"
                    transparent
                    opacity={0.28}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
              {[1, -1].map((s) => (
                <group key={s} position={[0, 0, s * (W / 2 + 0.12)]}>
                  <Tubo
                    pts={corrimao}
                    r={0.05}
                    cor={COR.corrimao}
                    e={fase === "pente" ? 0.15 * ss(f, tf(88.6), tf(89.2)) : 0}
                  />
                  {s === 1 ? marcas : null}
                </group>
              ))}
            </>
          ) : null}
          {corte ? (
            <>
              {fase !== "motor" && fase !== "circulo" ? (
                <>
                  <Tubo
                    pts={trilhoFrente}
                    r={0.025}
                    cor={COR.azul}
                    e={0.5}
                    desenho={fase === "rodinhas" ? (t - 44.9) / 1.4 : 1}
                  />
                  <Tubo
                    pts={trilhoTras}
                    r={0.025}
                    cor={COR.laranja}
                    e={0.5}
                    desenho={fase === "rodinhas" ? (t - 44.9) / 1.4 : 1}
                  />
                </>
              ) : null}
              {elos}
              {/* engrenagens e motor */}
              {[
                [LX + A, H - R],
                [-A, -R],
              ].map(([x, y], k) => (
                <group
                  key={k}
                  position={[x, y, W / 2 + 0.16]}
                  rotation={[0, 0, -giro]}
                >
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[R * 0.8, R * 0.8, 0.06, 18]} />
                    <Mat
                      c="#9aa1aa"
                      e="#ff3b30"
                      ei={k === 0 ? motorBrilho : 0}
                    />
                  </mesh>
                  {Array.from({ length: 12 }, (_, j) => (
                    <mesh
                      key={j}
                      position={[
                        Math.cos((j / 12) * Math.PI * 2) * R * 0.86,
                        Math.sin((j / 12) * Math.PI * 2) * R * 0.86,
                        0,
                      ]}
                      rotation={[0, 0, (j / 12) * Math.PI * 2]}
                    >
                      <boxGeometry args={[0.12, 0.1, 0.06]} />
                      <Mat c="#7d838b" />
                    </mesh>
                  ))}
                </group>
              ))}
              <mesh position={[LX + A + 0.95, H - 1.15, W / 2 + 0.16]}>
                <boxGeometry args={[0.7, 0.5, 0.4]} />
                <Mat c="#2e7d4f" e="#ff3b30" ei={motorBrilho} />
              </mesh>
              {fase === "circulo" ? (
                <Tubo
                  pts={lacoInteiro}
                  r={0.035}
                  cor={COR.amarelo}
                  e={0.7}
                  desenho={(t - 78.7) / 1.0}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
      {zeRola}
    </>
  );
};

export const Escada3D: React.FC<{ f: number }> = ({ f }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      camera={{ fov: 50, near: 0.1, far: 120, position: [0, 2, 10] }}
    >
      <Cena f={f} />
    </ThreeCanvas>
  );
};
