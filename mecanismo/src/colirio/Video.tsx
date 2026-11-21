// Colírio: o caminho da gota, em maquete isométrica (estilo "maquete 3D com caminho aceso").
// Tempos em quadros (30 fps), medidos em colirio_caminho/fala.json.
// Salas em zigue-zague para caber na tela em pé: OLHO (topo) → NARIZ (esq.) → GARGANTA (centro)
// → FÍGADO (esq.) e CORAÇÃO (dir.), com o rio de sangue passando ao lado do fígado.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  Easing,
  random,
} from "remotion";
import { SANS } from "../fonts";
import falaJson from "./fala.json";

export const DURATION_COLIRIO = 1920;
const FALA = falaJson as { w: string; f: number }[];

const K = {
  bg: "#0a1c1d",
  grid: "#1f4a47",
  floor: "#e9f4f0",
  floorSide: "#b9d6cc",
  wall: "#d3e8e1",
  wallSide: "#a9cbbf",
  neon: "#5dffc4",
  off: "#4f6f68",
  drop: "#4cc3ff",
  ink: "#f4fbf8",
  red: "#ff5a6a",
  pink: "#f29ab0",
  liver: "#9b5a3c",
  gold: "#ffd166",
  pele: "#f1cfb6",
};

const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const cl = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const P = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], cl);
const it = (f: number, a: number, b: number, v0: number, v1: number) =>
  interpolate(f, [a, b], [v0, v1], { ...cl, easing: EASE });
const fade = (f: number, a: number, b: number, d = 10) =>
  Math.min(P(f, a, a + d), 1 - P(f, b - d, b));
const keys = (f: number, ks: number[][], i: number) =>
  interpolate(
    f,
    ks.map((k) => k[0]),
    ks.map((k) => k[i]),
    { ...cl, easing: EASE },
  );

type V3 = [number, number, number];
const iso = (x: number, y: number, z = 0): [number, number] => [
  (x - y) * 0.866,
  (x + y) * 0.5 - z,
];
const pts = (a: [number, number][]) =>
  a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

const T = {
  pinga: 30,
  maior: 155,
  furinho: 272,
  lagrima: 401,
  amargo: 575,
  sangue: 610,
  figado: 752,
  timolol: 815,
  asma: 1028,
  medico: 1079,
  fechar: 1120,
  aperta: 1314,
  minutos: 1396,
  fica: 1445,
  umaGota: 1545,
  manda: 1595,
  siga: 1658,
  final: 1795,
};

const Caixa: React.FC<{
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  top: string;
  side: string;
  side2?: string;
  op?: number;
}> = ({ x, y, w, d, h, z = 0, top, side, side2, op = 1 }) => {
  const t: [number, number][] = [
    iso(x, y, z + h),
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ];
  const s1: [number, number][] = [
    iso(x, y + d, z + h),
    iso(x + w, y + d, z + h),
    iso(x + w, y + d, z),
    iso(x, y + d, z),
  ];
  const s2: [number, number][] = [
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x + w, y + d, z),
    iso(x + w, y, z),
  ];
  return (
    <g opacity={op}>
      <polygon points={pts(s1)} fill={side} />
      <polygon points={pts(s2)} fill={side2 ?? side} />
      <polygon points={pts(t)} fill={top} />
    </g>
  );
};

const S = 520;
const Sala: React.FC<{
  x: number;
  y: number;
  paredeY?: boolean;
  paredeX?: boolean;
}> = ({ x, y, paredeY = true, paredeX = true }) => (
  <g>
    <Caixa x={x} y={y} w={S} d={S} h={18} top={K.floor} side={K.floorSide} />
    {paredeY && (
      <Caixa
        x={x}
        y={y}
        w={S}
        d={14}
        h={120}
        z={18}
        top={K.wall}
        side={K.wallSide}
      />
    )}
    {paredeX && (
      <Caixa
        x={x}
        y={y}
        w={14}
        d={S}
        h={120}
        z={18}
        top={K.wall}
        side={K.wallSide}
      />
    )}
  </g>
);

const Placa: React.FC<{
  at: [number, number];
  t: string;
  op: number;
  cor?: string;
  size?: number;
}> = ({ at, t, op, cor = K.ink, size = 34 }) => {
  if (op <= 0) return null;
  const w = t.length * size * 0.62 + 40;
  return (
    <g
      transform={`translate(${at[0]},${at[1]}) scale(${0.85 + 0.15 * op})`}
      opacity={op}
    >
      <rect
        x={-w / 2}
        y={-size * 0.95}
        width={w}
        height={size * 1.6}
        rx={10}
        fill="#0d1715"
        stroke={K.neon}
        strokeWidth={3}
      />
      <text
        x={0}
        y={size * 0.25}
        fill={cor}
        fontFamily={SANS}
        fontWeight={800}
        fontSize={size}
        textAnchor="middle"
      >
        {t}
      </text>
    </g>
  );
};

const Gota: React.FC<{
  at: [number, number];
  s?: number;
  f: number;
  op?: number;
}> = ({ at, s = 1, f, op = 1 }) => {
  if (op <= 0) return null;
  const bob = Math.sin(f / 6) * 3;
  const pisca = f % 90 < 4 ? 0.15 : 1;
  return (
    <g
      transform={`translate(${at[0]},${at[1] + bob}) scale(${s})`}
      opacity={op}
    >
      <ellipse cx={0} cy={30} rx={26} ry={8} fill="#000" opacity={0.25} />
      <path
        d="M0,-46 C14,-24 30,-6 30,10 C30,28 16,38 0,38 C-16,38 -30,28 -30,10 C-30,-6 -14,-24 0,-46 Z"
        fill={K.drop}
        stroke="#dff4ff"
        strokeWidth={3}
      />
      <ellipse cx={-10} cy={8} rx={6} ry={8 * pisca} fill="#fff" />
      <ellipse cx={10} cy={8} rx={6} ry={8 * pisca} fill="#fff" />
      <circle cx={-9} cy={10} r={3} fill="#0b2a3a" />
      <circle cx={11} cy={10} r={3} fill="#0b2a3a" />
      <ellipse cx={-12} cy={-12} rx={5} ry={9} fill="#fff" opacity={0.5} />
    </g>
  );
};

const OLHO_CANTO: V3 = [422, 14, 211];
const NARIZ: V3 = [260, 780, 30];
const LINGUA: V3 = [780, 780, 30];
const RIO_X = 440;

const CAMINHO: number[][] = [
  [0, 260, 140, 520],
  [T.pinga + 40, 260, 40, 150],
  [T.maior + 60, 330, 40, 170],
  [T.furinho + 50, 422, 30, 205],
  [T.furinho + 90, 440, 80, 30],
  [T.lagrima + 30, 260, 520, 30],
  [T.lagrima + 90, 260, 780, 30],
  [T.lagrima + 130, 520, 780, 30],
  [T.amargo - 10, 780, 780, 30],
  [T.amargo + 25, 780, 780, 30],
  [T.sangue + 40, 300, 900, 30],
  [T.sangue + 90, RIO_X, 1060, 10],
  [T.figado - 10, RIO_X, 1300, 10],
  [T.figado + 50, RIO_X, 1640, 10],
  [T.timolol + 40, 1300, 1640, 10],
  [T.timolol + 100, 1300, 1380, 30],
  [T.fechar - 10, 1300, 1380, 30],
  [T.fechar + 10, 270, 40, 150],
  [T.manda, 270, 40, 150],
];

const GERAL = [600, 860, 0, 0.74];
const CAM: number[][] = [
  [0, ...GERAL],
  [T.pinga + 20, ...GERAL],
  [T.pinga + 70, 300, 120, 120, 1.25],
  [T.maior + 80, 320, 120, 120, 1.3],
  [T.furinho + 40, 420, 60, 150, 1.5],
  [T.lagrima, 300, 420, 40, 1.0],
  [T.lagrima + 100, 300, 760, 40, 1.05],
  [T.amargo, 740, 780, 40, 1.05],
  [T.sangue + 60, 400, 1000, 20, 0.95],
  [T.figado, 560, 1350, 20, 0.9],
  [T.timolol + 20, 900, 1560, 20, 0.9],
  [T.timolol + 110, 1300, 1320, 40, 1.05],
  [T.fechar - 10, 1300, 1320, 40, 1.05],
  [T.fechar + 60, 330, 60, 130, 1.35],
  [T.minutos + 40, 360, 60, 140, 1.45],
  [T.manda - 10, 300, 60, 130, 1.25],
  [T.manda + 30, ...GERAL],
  [T.siga, ...GERAL],
];

const Mundo: React.FC<{ f: number }> = ({ f }) => {
  const fechado = P(f, T.aperta + 6, T.aperta + 24);
  const palpebra =
    it(f, 1243, 1262, 0, 1) * (1 - it(f, T.fica, T.fica + 15, 0, 1));
  const transborda =
    P(f, T.maior, T.maior + 60) * (1 - P(f, T.furinho + 80, T.furinho + 120));
  const lingua = fade(f, T.amargo - 5, T.sangue + 30, 12);
  const bpm = f < T.timolol + 100 ? 1.2 : 0.65;
  const pulso = 1 + 0.06 * Math.max(0, Math.sin((f / 30) * Math.PI * 2 * bpm));
  const aperto = P(f, 985, 1010) * (1 - P(f, T.fechar, T.fechar + 20));
  const c = fechado > 0.5 ? K.off : K.neon;
  const geral = 1 - Math.min(1, Math.abs(keys(f, CAM, 4) - 0.74) * 4);

  const seg = (a: V3, b: V3, ini: number) => {
    const k = P(f, ini, ini + 30);
    if (k <= 0) return null;
    const A = iso(...a),
      B = iso(...b);
    const C: [number, number] = [
      A[0] + (B[0] - A[0]) * k,
      A[1] + (B[1] - A[1]) * k,
    ];
    return (
      <g>
        <line
          x1={A[0]}
          y1={A[1]}
          x2={C[0]}
          y2={C[1]}
          stroke={c}
          strokeWidth={26}
          opacity={0.18}
          strokeLinecap="round"
        />
        <line
          x1={A[0]}
          y1={A[1]}
          x2={C[0]}
          y2={C[1]}
          stroke={c}
          strokeWidth={8}
          strokeLinecap="round"
        />
      </g>
    );
  };

  return (
    <g>
      {Array.from({ length: 30 }, (_, i) => {
        const a = iso(-800 + i * 120, -800),
          b = iso(-800 + i * 120, 2600);
        const c2 = iso(-800, -800 + i * 120),
          d = iso(2600, -800 + i * 120);
        return (
          <g key={i} stroke={K.grid} strokeWidth={2} opacity={0.6}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
            <line x1={c2[0]} y1={c2[1]} x2={d[0]} y2={d[1]} />
          </g>
        );
      })}

      <Sala x={0} y={0} />
      <Sala x={0} y={S} paredeY={false} />
      <Caixa
        x={RIO_X - 40}
        y={1040}
        w={80}
        d={640}
        h={8}
        top="#5a1f2c"
        side="#3a121b"
      />
      <Caixa
        x={RIO_X - 40}
        y={1600}
        w={900}
        d={80}
        h={8}
        top="#5a1f2c"
        side="#3a121b"
      />
      {Array.from({ length: 14 }, (_, i) => {
        const t = (i * 110 + f * 5) % 1500;
        const p =
          t < 600
            ? iso(RIO_X - 20 + random(`a${i}`) * 40, 1050 + t, 12)
            : iso(RIO_X + (t - 600), 1620 + random(`b${i}`) * 40, 12);
        return (
          <ellipse
            key={i}
            cx={p[0]}
            cy={p[1]}
            rx={18}
            ry={8}
            fill={K.red}
            opacity={0.7}
          />
        );
      })}
      <Sala x={S} y={S} paredeX={false} />
      <Sala x={S} y={2 * S} paredeY={false} />
      <Sala x={2 * S} y={2 * S} paredeX={false} />

      <Caixa
        x={640}
        y={1160}
        w={280}
        d={280}
        h={140}
        z={18}
        top="#b86d4b"
        side={K.liver}
        side2="#7c4630"
      />
      <Caixa
        x={540}
        y={1280}
        w={20}
        d={40}
        h={90}
        z={18}
        top="#ddd"
        side="#999"
      />
      {(() => {
        const a = iso(RIO_X + 40, 1300, 70),
          b = iso(640, 1300, 70);
        return (
          <line
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke={K.gold}
            strokeWidth={8}
            strokeDasharray="18 12"
          />
        );
      })()}

      {(() => {
        const o = iso(260, 14, 140);
        return (
          <g transform={`translate(${o[0]},${o[1]})`}>
            <ellipse
              cx={0}
              cy={0}
              rx={150}
              ry={80}
              fill="#fff"
              stroke="#9bb"
              strokeWidth={4}
            />
            <circle cx={0} cy={0} r={56} fill="#3c8d7c" />
            <circle cx={0} cy={0} r={26} fill="#0a1514" />
            <circle cx={16} cy={-18} r={10} fill="#fff" opacity={0.8} />
            {Array.from({ length: 4 }, (_, i) => (
              <ellipse
                key={i}
                cx={-100 + i * 60}
                cy={78 + ((f * 2 + i * 20) % 60) * transborda}
                rx={9}
                ry={13}
                fill={K.drop}
                opacity={transborda * 0.8}
              />
            ))}
            <path
              d={`M-155,0 Q0,${-90 + 170 * palpebra} 155,0 Q0,-95 -155,0 Z`}
              fill="#e0b48f"
              stroke="#b7895f"
              strokeWidth={4}
              opacity={palpebra > 0.02 ? 1 : 0}
            />
          </g>
        );
      })()}
      {(() => {
        const p = iso(...OLHO_CANTO);
        return (
          <g>
            <circle cx={p[0]} cy={p[1]} r={14} fill="#0a1514" />
            <circle
              cx={p[0]}
              cy={p[1]}
              r={26}
              fill="none"
              stroke={K.neon}
              strokeWidth={4}
              opacity={
                fade(f, T.furinho, T.lagrima + 40) *
                (0.5 + 0.5 * Math.sin(f / 5))
              }
            />
          </g>
        );
      })()}

      {(() => {
        const n = iso(14, 780, 120);
        return (
          <g transform={`translate(${n[0]},${n[1]})`}>
            <path
              d="M40,-80 C10,-40 -70,20 -60,50 C-50,70 0,70 30,55 Z"
              fill={K.pele}
              stroke="#c99b80"
              strokeWidth={4}
            />
            <ellipse cx={-8} cy={52} rx={14} ry={8} fill="#5c3b2e" />
          </g>
        );
      })()}
      <Caixa
        x={660}
        y={680}
        w={240}
        d={200}
        h={22}
        z={18}
        top={lingua > 0 ? "#ff9fb8" : K.pink}
        side="#c56b83"
      />
      {lingua > 0 &&
        (() => {
          const p = iso(780, 780, 60);
          return (
            <circle
              cx={p[0]}
              cy={p[1]}
              r={150}
              fill={K.gold}
              opacity={0.18 * lingua}
            />
          );
        })()}

      {seg(OLHO_CANTO, [440, 80, 30], T.furinho + 50)}
      {seg([440, 80, 30], [260, 520, 30], T.furinho + 90)}
      {seg([260, 520, 30], NARIZ, T.lagrima + 30)}
      {seg(NARIZ, [520, 780, 30], T.lagrima + 90)}
      {seg([520, 780, 30], LINGUA, T.lagrima + 130)}
      {seg(NARIZ, [RIO_X, 1060, 10], T.sangue + 40)}
      {seg([RIO_X, 1060, 10], [RIO_X, 1640, 10], T.sangue + 90)}
      {seg([RIO_X, 1640, 10], [1300, 1640, 10], T.figado + 50)}
      {seg([1300, 1640, 10], [1300, 1380, 30], T.timolol + 40)}

      {(() => {
        const h = 18 + 100 * fechado;
        const a = iso(180, S, h),
          b = iso(340, S, h),
          b0 = iso(340, S, 18),
          a0 = iso(180, S, 18);
        return (
          <polygon
            points={pts([a, b, b0, a0])}
            fill={K.red}
            opacity={0.85 * P(f, T.aperta, T.aperta + 10)}
          />
        );
      })()}

      {(() => {
        const h = iso(1300, 1300, 120);
        return (
          <g>
            <g transform={`translate(${h[0]},${h[1]}) scale(${pulso})`}>
              <path
                d="M0,40 C-70,-10 -50,-70 0,-35 C50,-70 70,-10 0,40 Z"
                fill={K.red}
                stroke="#ffd0d6"
                strokeWidth={4}
              />
            </g>
            <g
              transform={`translate(${h[0] - 150},${h[1] + 30}) scale(${1 - 0.18 * aperto},1)`}
            >
              <ellipse rx={50} ry={80} fill={K.pink} opacity={0.9} />
            </g>
            <g
              transform={`translate(${h[0] + 150},${h[1] + 30}) scale(${1 - 0.18 * aperto},1)`}
            >
              <ellipse rx={50} ry={80} fill={K.pink} opacity={0.9} />
            </g>
          </g>
        );
      })()}

      {(() => {
        const p = iso(...OLHO_CANTO);
        const k =
          it(f, T.aperta - 20, T.aperta + 8, 0, 1) *
          (1 - it(f, T.fica + 20, T.fica + 40, 0, 1));
        if (k <= 0) return null;
        return (
          <g
            transform={`translate(${p[0] + 60 - 20 * k},${p[1] - 260 + 220 * k}) rotate(-25)`}
            opacity={Math.min(1, k * 2)}
          >
            <rect
              x={-34}
              y={-180}
              width={68}
              height={200}
              rx={34}
              fill="#e8b892"
              stroke="#b07f5a"
              strokeWidth={4}
            />
            <rect
              x={-22}
              y={-170}
              width={44}
              height={50}
              rx={18}
              fill="#f6d8c4"
            />
          </g>
        );
      })()}

      <Placa at={iso(260, 260, 330)} t="OLHO" op={geral} size={40} />
      <Placa at={iso(260, 780, 260)} t="NARIZ" op={geral} size={40} />
      <Placa at={iso(780, 780, 260)} t="GARGANTA" op={geral} size={40} />
      <Placa at={iso(780, 1300, 340)} t="FÍGADO" op={geral} size={40} />
      <Placa at={iso(1300, 1300, 330)} t="CORAÇÃO" op={geral} size={40} />

      <Placa
        at={iso(260, 120, 420)}
        t="GOTA ≈ 30 a 50 µL"
        op={fade(f, T.maior + 10, T.furinho)}
      />
      <Placa
        at={iso(260, 120, 360)}
        t="O OLHO SEGURA ≈ 10 µL"
        op={fade(f, T.maior + 50, T.furinho)}
        cor={K.neon}
      />
      <Placa
        at={iso(780, 780, 280)}
        t="AMARGO"
        op={fade(f, T.amargo, T.sangue + 40)}
        cor={K.gold}
        size={44}
      />
      <Placa
        at={iso(780, 1300, 360)}
        t="FÍGADO"
        op={fade(f, T.figado - 30, T.timolol + 10)}
      />
      <Placa
        at={iso(RIO_X, 1420, 180)}
        t="SEM PASSAR PELO FÍGADO"
        op={fade(f, T.figado + 5, T.timolol + 10)}
        cor={K.red}
        size={30}
      />
      <Placa
        at={iso(1300, 1300, 360)}
        t="TIMOLOL"
        op={fade(f, 885, T.fechar)}
      />
      <Placa
        at={iso(1300, 1300, 300)}
        t="TEM ASMA? CONTE AO MÉDICO"
        op={fade(f, T.medico - 30, T.fechar)}
        cor={K.gold}
        size={28}
      />
      <Placa
        at={iso(260, 120, 400)}
        t="2 a 3 MIN"
        op={f >= T.minutos ? fade(f, T.minutos, T.fica + 40) : 0}
        cor={K.neon}
        size={52}
      />
      <Placa
        at={iso(260, 120, 400)}
        t="1 GOTA BASTA"
        op={fade(f, T.umaGota, T.manda + 10)}
        cor={K.neon}
        size={48}
      />
    </g>
  );
};

const PALAVRAS_CHAVE = new Set([
  "olho",
  "caminho",
  "garganta",
  "amargo",
  "sangue",
  "fígado",
  "timolol",
  "asma",
  "médico",
  "fechar",
  "cantinho",
  "minutos",
  "basta",
  "gota",
  "nariz",
  "lágrima",
  "furinho",
]);
const limpa = (w: string) => w.replace(/[.,:?]/g, "");
const TOKENS: { t: string; f: number; chave: boolean }[] = (() => {
  const out: { t: string; f: number; chave: boolean }[] = [];
  for (let i = 0; i < FALA.length; i++) {
    const a = limpa(FALA[i].w);
    const curta =
      a.length <= 3 && !/[.,:?]$/.test(FALA[i].w) && i + 1 < FALA.length;
    if (curta) {
      const b = limpa(FALA[i + 1].w);
      out.push({
        t: `${a} ${b}`,
        f: FALA[i].f,
        chave: PALAVRAS_CHAVE.has(b.toLowerCase()),
      });
      i++;
    } else {
      out.push({
        t: a,
        f: FALA[i].f,
        chave: PALAVRAS_CHAVE.has(a.toLowerCase()),
      });
    }
  }
  return out;
})();

const Palavra: React.FC<{ f: number }> = ({ f }) => {
  if (f >= T.siga - 2) return null;
  let i = -1;
  for (let k = 0; k < TOKENS.length; k++) if (TOKENS[k].f <= f) i = k;
  if (i < 0) return null;
  const w = TOKENS[i];
  const k = P(f, w.f, w.f + 4);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1380,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: w.chave ? 104 : 84,
        color: w.chave ? K.neon : K.ink,
        letterSpacing: -1,
        transform: `scale(${0.8 + 0.2 * k})`,
        opacity: 0.4 + 0.6 * k,
        textShadow:
          "0 4px 0 #000, 0 0 24px rgba(0,0,0,.9), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000",
      }}
    >
      {w.t}
    </div>
  );
};

const MeSiga: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.siga, T.siga + 14, 0, 1);
  return (
    <AbsoluteFill
      style={{
        background: K.bg,
        opacity: fade(f, T.siga, T.final, 10),
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
      }}
    >
      <Img
        src={staticFile("colirio/logo.jpg")}
        style={{
          width: 420,
          height: 420,
          borderRadius: "50%",
          objectFit: "cover",
          border: `8px solid ${K.neon}`,
          transform: `scale(${0.85 + 0.15 * k})`,
          boxShadow: `0 0 80px ${K.neon}55`,
        }}
      />
      <div
        style={{
          marginTop: 70,
          width: 860,
          textAlign: "center",
          color: K.ink,
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        Me siga para mais dicas de{" "}
        <span style={{ color: K.neon }}>farmacologia</span> e curiosidades sobre
        a área
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill
    style={{
      background: K.bg,
      opacity: P(f, T.final - 2, T.final + 12),
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
    }}
  >
    <div
      style={{
        width: 820,
        textAlign: "center",
        color: K.ink,
        fontSize: 64,
        fontWeight: 800,
        lineHeight: 1.2,
      }}
    >
      Consulte um <span style={{ color: K.neon }}>profissional de saúde</span>{" "}
      para orientações.
    </div>
  </AbsoluteFill>
);

// ---------- som (efeitos reais CC0 do Freesound, via Openverse; créditos em public/sfx_openverse/*.json) ----------
const OV = "sfx_openverse/";
const SFX: [number, string, number][] = (() => {
  const l: [number, string, number][] = [
    [T.pinga + 8, OV + "gota.mp3", 0.5],
    [T.furinho, OV + "whoosh.mp3", 0.3],
    [T.lagrima, OV + "whoosh.mp3", 0.3],
    [T.amargo, OV + "ding.mp3", 0.35],
    [T.sangue, OV + "whoosh.mp3", 0.3],
    [T.aperta, OV + "portao.mp3", 0.45],
    [T.minutos, OV + "ding.mp3", 0.3],
    [T.umaGota, OV + "ding.mp3", 0.35],
    [T.siga, OV + "whoosh.mp3", 0.3],
    [T.final - 4, OV + "sting.mp3", 0.55],
  ];
  // coração: rápido e depois mais lento (timolol)
  for (let fr = T.timolol + 10; fr < T.timolol + 100; fr += 25)
    l.push([fr, OV + "coracao.mp3", 0.4]);
  for (let fr = T.timolol + 110; fr < T.asma - 10; fr += 46)
    l.push([fr, OV + "coracao.mp3", 0.4]);
  // pop nas palavras-chave (sem repetir em cima de outro efeito)
  TOKENS.filter((t) => t.chave).forEach((t) => {
    if (!l.some(([fr]) => Math.abs(fr - t.f) < 12))
      l.push([t.f, OV + "pop.mp3", 0.22]);
  });
  return l;
})();
const FALANDO = (() => {
  const v = new Float32Array(DURATION_COLIRIO + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_COLIRIO, fim + 6);
      fr++
    )
      v[fr] = 1;
  });
  const s = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    s[fr] = acc;
  }
  return s;
})();
const musica = (fr: number) =>
  (0.22 -
    0.13 *
      (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ??
        0)) *
  interpolate(fr, [DURATION_COLIRIO - 12, DURATION_COLIRIO], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const VideoColirio: React.FC = () => {
  const f = useCurrentFrame();
  const cx = keys(f, CAM, 1),
    cy = keys(f, CAM, 2),
    cz = keys(f, CAM, 3),
    s = keys(f, CAM, 4);
  const [px, py] = iso(cx, cy, cz);
  const gota = iso(
    keys(f, CAMINHO, 1),
    keys(f, CAMINHO, 2),
    keys(f, CAMINHO, 3),
  );
  const gotaOp = Math.max(
    1 - P(f, T.fechar - 10, T.fechar),
    P(f, T.fica, T.fica + 15) * (1 - P(f, T.manda, T.manda + 15)),
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(100% 70% at 50% 45%, #12302f 0%, ${K.bg} 75%)`,
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g
          transform={`translate(540,900) scale(${s}) translate(${-px},${-py})`}
        >
          <Mundo f={f} />
          <Gota at={gota} f={f} s={1.3} op={gotaOp} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 110,
          fontFamily: SANS,
          color: K.neon,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 3,
          opacity: 1 - P(f, T.siga - 10, T.siga),
        }}
      >
        ■ FARMA.EXE
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1220,
          height: 700,
          background:
            "linear-gradient(rgba(10,28,29,0), rgba(10,28,29,.92) 35%)",
        }}
      />
      <Palavra f={f} />
      {f >= T.siga - 2 && <MeSiga f={f} />}
      {f >= T.final - 2 && <Final f={f} />}
      <Audio src={staticFile("colirio/fala.mp3")} />
      <Audio
        src={staticFile("colirio/musica.wav")}
        volume={(fr) => musica(fr)}
      />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={Math.max(0, fr)}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------- capa (1080×1920; tudo entre y≈300 e 1620, o recorte 3:4 das redes) ----------
export const CapaColirio: React.FC = () => {
  const f = T.amargo + 20; // caminho aceso do olho até a garganta, língua acesa
  const [px, py] = iso(GERAL[0], GERAL[1], GERAL[2]);
  const gota = iso(
    keys(f, CAMINHO, 1),
    keys(f, CAMINHO, 2),
    keys(f, CAMINHO, 3),
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(100% 70% at 50% 55%, #12302f 0%, ${K.bg} 75%)`,
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g
          transform={`translate(540,1040) scale(0.5) translate(${-px},${-py})`}
        >
          <Mundo f={f} />
          <Gota at={gota} f={f} s={1.6} op={1} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 320,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          color: K.ink,
          fontSize: 92,
          lineHeight: 1.02,
          textShadow: "0 6px 30px rgba(0,0,0,.7)",
        }}
      >
        PINGOU COLÍRIO E SENTIU{" "}
        <span style={{ color: K.neon }}>GOSTO NA BOCA?</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1450,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          color: K.neon,
          fontSize: 64,
          textShadow: "0 6px 30px rgba(0,0,0,.8)",
        }}
      >
        olho → nariz → boca
      </div>
    </AbsoluteFill>
  );
};
