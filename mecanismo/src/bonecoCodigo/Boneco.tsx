import React from "react";
import { random } from "remotion";
import { MAO } from "../fonts";

// Boneco de palito desenhado em código (SVG). Sem IA, sem créditos.
// Ângulos em graus: 0 = para baixo, 90 = para a direita da tela, -90 = esquerda, 180 = para cima.
export const INK = "#1f1d1a",
  PAPEL = "#f5efe1",
  LILAS = "#5a3d8a",
  VERDE = "#1fae5b",
  NEON = "#2fe07f",
  VERM = "#d93a3a",
  AZUL = "#2f6fd6",
  AMARELO = "#f2c230";

const D = Math.PI / 180;
export const seg = (
  x: number,
  y: number,
  a: number,
  l: number,
): [number, number] => [x + Math.sin(a * D) * l, y + Math.cos(a * D) * l];

export type Pose = {
  la: [number, number];
  ra: [number, number];
  ll: [number, number];
  rl: [number, number];
  tilt?: number;
};
export const EM_PE: Pose = {
  la: [-14, -8],
  ra: [14, 8],
  ll: [-8, -4],
  rl: [8, 4],
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({
  la: [lerp(a.la[0], b.la[0], k), lerp(a.la[1], b.la[1], k)],
  ra: [lerp(a.ra[0], b.ra[0], k), lerp(a.ra[1], b.ra[1], k)],
  ll: [lerp(a.ll[0], b.ll[0], k), lerp(a.ll[1], b.ll[1], k)],
  rl: [lerp(a.rl[0], b.rl[0], k), lerp(a.rl[1], b.rl[1], k)],
  tilt: lerp(a.tilt ?? 0, b.tilt ?? 0, k),
});
// sequência de poses no tempo: [[quadro, pose], ...]
export const poseAt = (f: number, keys: [number, Pose][]): Pose => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const k = (f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      return mixPose(keys[i - 1][1], keys[i][1], e);
    }
  }
  return keys[keys.length - 1][1];
};
// andando: pernas e braços balançam
export const andar = (f: number, base: Pose = EM_PE): Pose => {
  const s = Math.sin(f / 4.5);
  return {
    ...base,
    ll: [-24 * s, -24 * s - 12 * Math.max(0, s)],
    rl: [24 * s, 24 * s - 12 * Math.max(0, -s)],
    la: [18 * s - 12, 18 * s - 4],
    ra: [-18 * s + 12, -18 * s + 4],
  };
};

export type Cara =
  | "neutro"
  | "feliz"
  | "triste"
  | "doente"
  | "bravo"
  | "surpreso"
  | "pensando";

export const Rosto: React.FC<{
  f: number;
  cara: Cara;
  dir?: number;
  r?: number;
  seed?: number;
}> = ({ f, cara, dir = 0, r = 62, seed = 0 }) => {
  const s = r / 62;
  const dx = dir * 9 * s;
  const pisca = (f + seed * 37) % 110 < 4;
  const olho = (x: number) =>
    cara === "feliz" ? (
      <path
        d={`M${x - 8 * s},${-6 * s} Q${x},${-16 * s} ${x + 8 * s},${-6 * s}`}
        fill="none"
        stroke={INK}
        strokeWidth={4.5 * s}
        strokeLinecap="round"
      />
    ) : (
      <ellipse
        cx={x}
        cy={-8 * s}
        rx={6.5 * s}
        ry={pisca ? 1 : (cara === "surpreso" ? 9 : 7) * s}
        fill={INK}
      />
    );
  const boca: Record<Cara, string> = {
    neutro: `M${-16 * s + dx},${24 * s} L${16 * s + dx},${24 * s}`,
    feliz: `M${-22 * s + dx},${16 * s} Q${dx},${40 * s} ${22 * s + dx},${16 * s}`,
    triste: `M${-18 * s + dx},${32 * s} Q${dx},${14 * s} ${18 * s + dx},${32 * s}`,
    doente: `M${-18 * s + dx},${30 * s} Q${-6 * s + dx},${20 * s} ${dx},${30 * s} Q${8 * s + dx},${38 * s} ${18 * s + dx},${26 * s}`,
    bravo: `M${-18 * s + dx},${30 * s} Q${dx},${18 * s} ${18 * s + dx},${30 * s}`,
    surpreso: "",
    pensando: `M${-10 * s + dx},${26 * s} L${18 * s + dx},${20 * s}`,
  };
  return (
    <g>
      {olho(-20 * s + dx)}
      {olho(20 * s + dx)}
      {cara === "bravo" && (
        <g stroke={INK} strokeWidth={5 * s} strokeLinecap="round">
          <line x1={-32 * s + dx} y1={-28 * s} x2={-10 * s + dx} y2={-18 * s} />
          <line x1={32 * s + dx} y1={-28 * s} x2={10 * s + dx} y2={-18 * s} />
        </g>
      )}
      {cara === "doente" && (
        <g fill={VERM} opacity={0.35}>
          <circle cx={-34 * s + dx} cy={12 * s} r={10 * s} />
          <circle cx={34 * s + dx} cy={12 * s} r={10 * s} />
        </g>
      )}
      {cara === "surpreso" ? (
        <circle
          cx={dx}
          cy={26 * s}
          r={10 * s}
          fill="none"
          stroke={INK}
          strokeWidth={4.5 * s}
        />
      ) : (
        <path
          d={boca[cara]}
          fill="none"
          stroke={INK}
          strokeWidth={4.5 * s}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// cabelo cacheado em rabo alto (a farmacêutica)
const Cabelo: React.FC<{ r: number; dir: number }> = ({ r, dir }) => {
  const cachos = Array.from({ length: 13 }, (_, i) => {
    const a = -100 + i * 15;
    return [
      Math.sin(a * D) * r * 0.98,
      -Math.cos(a * D) * r * 0.98 + 6,
      16 + random(`c${i}`) * 7,
    ] as const;
  });
  const rx = -dir * r * 0.55;
  return (
    <g>
      {/* rabo alto */}
      {Array.from({ length: 9 }, (_, i) => (
        <circle
          key={i}
          cx={rx * 1.25 + (random(`rx${i}`) - 0.5) * 50 - dir * 30}
          cy={-r * 1.15 - i * 3 + (random(`ry${i}`) - 0.3) * 50}
          r={17 + random(`rr${i}`) * 8}
          fill="#3a2a22"
          stroke={INK}
          strokeWidth={3}
        />
      ))}
      {cachos.map(([x, y, rr], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={rr}
          fill="#3a2a22"
          stroke={INK}
          strokeWidth={3}
        />
      ))}
      <circle
        cx={rx * 0.7}
        cy={-r * 0.92}
        r={9}
        fill={NEON}
        stroke={INK}
        strokeWidth={2.5}
      />
    </g>
  );
};

export const Boneco: React.FC<{
  f: number;
  x: number;
  y: number; // pé no chão
  s?: number;
  pose?: Pose;
  cara?: Cara;
  dir?: number; // para onde olha: -1, 0, 1
  farma?: boolean;
  pele?: string;
  maoD?: (x: number, y: number) => React.ReactNode;
  maoE?: (x: number, y: number) => React.ReactNode;
  seed?: number;
}> = ({
  f,
  x,
  y,
  s = 1,
  pose = EM_PE,
  cara = "neutro",
  dir = 0,
  farma = false,
  pele,
  maoD,
  maoE,
  seed = 0,
}) => {
  const sw = 9;
  const quadril: [number, number] = [0, -230];
  const pesc: [number, number] = [0, -440];
  const ombro: [number, number] = [0, -410];
  const r = 62;
  const cab: [number, number] = [0, -440 - r + 6];
  const t = pose.tilt ?? 0;
  const membro = (
    o: [number, number],
    a: [number, number],
    l1: number,
    l2: number,
  ) => {
    const j = seg(o[0], o[1], a[0], l1);
    const m = seg(j[0], j[1], a[1], l2);
    return { d: `M${o[0]},${o[1]} L${j[0]},${j[1]} L${m[0]},${m[1]}`, m };
  };
  const pe = membro(quadril, pose.ll, 118, 112);
  const pd = membro(quadril, pose.rl, 118, 112);
  const be = membro(ombro, pose.la, 100, 92);
  const bd = membro(ombro, pose.ra, 100, 92);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`rotate(${t},0,-230)`}>
        <g
          fill="none"
          stroke={INK}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={pe.d} />
          <path d={pd.d} />
          <line x1={quadril[0]} y1={quadril[1]} x2={pesc[0]} y2={pesc[1]} />
        </g>
        {farma && (
          <g>
            <path
              d="M-48,-412 L48,-412 L70,-200 L-70,-200 Z"
              fill="#ffffff"
              stroke={INK}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            <path
              d="M-18,-412 L0,-360 L18,-412"
              fill="none"
              stroke={INK}
              strokeWidth={4}
            />
            <line
              x1={0}
              y1={-360}
              x2={0}
              y2={-205}
              stroke={INK}
              strokeWidth={4}
            />
            <rect
              x={14}
              y={-345}
              width={38}
              height={26}
              rx={5}
              fill={NEON}
              stroke={INK}
              strokeWidth={3}
            />
          </g>
        )}
        <g
          fill="none"
          stroke={INK}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={be.d} />
          <path d={bd.d} />
        </g>
        <g transform={`translate(${cab[0]},${cab[1]})`}>
          {farma && <Cabelo r={r} dir={dir || 1} />}
          <circle
            r={r}
            fill={pele ?? "#ffffff"}
            stroke={INK}
            strokeWidth={sw}
          />
          <Rosto f={f} cara={cara} dir={dir} seed={seed} />
        </g>
        {maoE && maoE(be.m[0], be.m[1])}
        {maoD && maoD(bd.m[0], bd.m[1])}
      </g>
    </g>
  );
};

// ---------- objetos ----------
export const Comprimido: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  cor?: string;
}> = ({ x, y, s = 1, rot = 0, cor = VERM }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M0,-18 L-30,-18 A18,18 0 0 0 -30,18 L0,18 Z"
      fill={cor}
      stroke={INK}
      strokeWidth={4}
    />
    <path
      d="M0,-18 L30,-18 A18,18 0 0 1 30,18 L0,18 Z"
      fill="#ffffff"
      stroke={INK}
      strokeWidth={4}
    />
  </g>
);

export const Cartela: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  restam?: number;
}> = ({ x, y, s = 1, rot = 0, restam = 3 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-60}
      y={-38}
      width={120}
      height={76}
      rx={10}
      fill="#dfe6ee"
      stroke={INK}
      strokeWidth={4}
    />
    {Array.from({ length: 8 }, (_, i) => {
      const cx = -42 + (i % 4) * 28,
        cy = -14 + Math.floor(i / 4) * 28;
      return i < restam ? (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={10}
          ry={8}
          fill="#ffffff"
          stroke={INK}
          strokeWidth={3}
        />
      ) : (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={10}
          ry={8}
          fill="none"
          stroke={INK}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      );
    })}
  </g>
);

export const Gaveta: React.FC<{ x: number; y: number; abre?: number }> = ({
  x,
  y,
  abre = 0,
}) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      x={-150}
      y={-300}
      width={300}
      height={300}
      rx={8}
      fill="#e9d6b4"
      stroke={INK}
      strokeWidth={6}
    />
    <rect
      x={-130}
      y={-150}
      width={260}
      height={130}
      rx={6}
      fill="#e9d6b4"
      stroke={INK}
      strokeWidth={5}
    />
    <g transform={`translate(${-abre * 110},${0})`}>
      <rect
        x={-130}
        y={-280}
        width={260}
        height={110}
        rx={6}
        fill="#f1e2c6"
        stroke={INK}
        strokeWidth={5}
      />
      <circle cx={0} cy={-225} r={10} fill={INK} />
    </g>
    <circle cx={0} cy={-85} r={10} fill={INK} />
  </g>
);

export const Virus: React.FC<{
  f: number;
  x: number;
  y: number;
  r?: number;
  cara?: Cara;
}> = ({ f, x, y, r = 120, cara = "feliz" }) => (
  <g transform={`translate(${x},${y}) rotate(${Math.sin(f / 20) * 6})`}>
    {Array.from({ length: 12 }, (_, i) => {
      const a = i * 30;
      const [x1, y1] = seg(0, 0, a, r * 0.95);
      const [x2, y2] = seg(0, 0, a, r * 1.32);
      return (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={6} />
          <circle
            cx={x2}
            cy={y2}
            r={r * 0.11}
            fill="#f08bb0"
            stroke={INK}
            strokeWidth={4}
          />
        </g>
      );
    })}
    <circle r={r} fill="#f7b3cb" stroke={INK} strokeWidth={7} />
    <g transform={`scale(${r / 70})`}>
      <Rosto f={f} cara={cara} r={50} seed={3} />
    </g>
  </g>
);

export const Bacteria: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  rot?: number;
  forte?: boolean;
  seed?: number;
}> = ({ f, x, y, s = 1, rot = 0, forte = false, seed = 0 }) => (
  <g
    transform={`translate(${x},${y + Math.sin(f / 14 + seed) * 6}) rotate(${rot + Math.sin(f / 18 + seed) * 5}) scale(${s})`}
  >
    {Array.from({ length: 6 }, (_, i) => (
      <path
        key={i}
        d={`M${-60 + i * 24},${-38} q6,-22 -4,-34`}
        fill="none"
        stroke={INK}
        strokeWidth={3}
      />
    ))}
    <rect
      x={-80}
      y={-40}
      width={160}
      height={80}
      rx={40}
      fill={forte ? "#e5735e" : "#a7d98b"}
      stroke={INK}
      strokeWidth={6}
    />
    <g transform="scale(0.7)">
      <Rosto f={f} cara={forte ? "bravo" : "neutro"} r={50} seed={seed} />
    </g>
  </g>
);

export const XVermelho: React.FC<{
  x: number;
  y: number;
  s?: number;
  k: number;
}> = ({ x, y, s = 1, k }) => {
  if (k <= 0) return null;
  const a = Math.min(1, k * 2),
    b = Math.max(0, Math.min(1, k * 2 - 1));
  return (
    <g
      transform={`translate(${x},${y}) scale(${s})`}
      stroke={VERM}
      strokeWidth={16}
      strokeLinecap="round"
    >
      <line x1={-60} y1={-60} x2={-60 + 120 * a} y2={-60 + 120 * a} />
      {b > 0 && <line x1={60} y1={-60} x2={60 - 120 * b} y2={-60 + 120 * b} />}
    </g>
  );
};

export const Visto: React.FC<{
  x: number;
  y: number;
  s?: number;
  k: number;
}> = ({ x, y, s = 1, k }) =>
  k <= 0 ? null : (
    <path
      transform={`translate(${x},${y}) scale(${s})`}
      d="M-50,0 L-15,38 L55,-45"
      fill="none"
      stroke={VERDE}
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.min(1, k)}
    />
  );

export const Termometro: React.FC<{
  x: number;
  y: number;
  rot?: number;
  s?: number;
}> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={0}
      y={-7}
      width={90}
      height={14}
      rx={7}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={3.5}
    />
    <rect x={4} y={-3} width={60} height={6} rx={3} fill={VERM} />
    <circle cx={90} cy={0} r={11} fill={VERM} stroke={INK} strokeWidth={3.5} />
  </g>
);

export const Sacola: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path
      d="M-26,0 Q-26,-34 0,-34 Q26,-34 26,0"
      fill="none"
      stroke={INK}
      strokeWidth={5}
    />
    <path
      d="M-50,0 L50,0 L42,110 L-42,110 Z"
      fill="#ffffff"
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <Cartela x={0} y={55} s={0.55} restam={3} />
  </g>
);

export const Coletor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      x={-120}
      y={-420}
      width={240}
      height={420}
      rx={14}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={6}
    />
    <rect
      x={-120}
      y={-420}
      width={240}
      height={110}
      rx={14}
      fill={VERDE}
      stroke={INK}
      strokeWidth={6}
    />
    <rect x={-70} y={-270} width={140} height={22} rx={8} fill={INK} />
    <text
      x={0}
      y={-378}
      textAnchor="middle"
      fontFamily={MAO}
      fontWeight={700}
      fontSize={31}
      fill="#ffffff"
    >
      DESCARTE DE
    </text>
    <text
      x={0}
      y={-340}
      textAnchor="middle"
      fontFamily={MAO}
      fontWeight={700}
      fontSize={31}
      fill="#ffffff"
    >
      MEDICAMENTOS
    </text>
    <path
      d="M-40,-150 l20,20 l40,-50"
      fill="none"
      stroke={VERDE}
      strokeWidth={10}
      strokeLinecap="round"
    />
  </g>
);

export const Lixeira: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g
    transform={`translate(${x},${y}) scale(${s})`}
    stroke={INK}
    strokeWidth={6}
    strokeLinejoin="round"
  >
    <path d="M-70,-180 L70,-180 L55,0 L-55,0 Z" fill="#cfd6dc" />
    <rect x={-85} y={-205} width={170} height={25} rx={6} fill="#b6c0c8" />
    <line x1={-25} y1={-150} x2={-20} y2={-30} />
    <line x1={25} y1={-150} x2={20} y2={-30} />
  </g>
);

export const Vaso: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g
    transform={`translate(${x},${y}) scale(${s})`}
    stroke={INK}
    strokeWidth={6}
    strokeLinejoin="round"
    fill="#ffffff"
  >
    <rect x={-20} y={-230} width={110} height={120} rx={10} />
    <path d="M-90,-110 L90,-110 Q90,-40 30,-30 L30,0 L-40,0 L-40,-30 Q-90,-40 -90,-110 Z" />
    <ellipse cx={0} cy={-110} rx={90} ry={18} />
  </g>
);

export const Receita: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-90}
      y={-120}
      width={180}
      height={240}
      rx={8}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={5}
    />
    <text
      x={-62}
      y={-60}
      fontFamily={MAO}
      fontWeight={700}
      fontSize={56}
      fill={AZUL}
    >
      Rx
    </text>
    {[0, 1, 2, 3].map((i) => (
      <line
        key={i}
        x1={-60}
        y1={-10 + i * 30}
        x2={[60, 40, 55, 20][i]}
        y2={-10 + i * 30}
        stroke="#9aa6b2"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ))}
    <path
      d="M10,95 q15,-20 30,0 t30,-5"
      fill="none"
      stroke={AZUL}
      strokeWidth={4}
    />
  </g>
);

export const Calendario: React.FC<{
  x: number;
  y: number;
  texto: string;
  s?: number;
}> = ({ x, y, texto, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect
      x={-110}
      y={-110}
      width={220}
      height={220}
      rx={12}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={6}
    />
    <rect
      x={-110}
      y={-110}
      width={220}
      height={60}
      rx={12}
      fill={VERM}
      stroke={INK}
      strokeWidth={6}
    />
    <circle cx={-55} cy={-120} r={9} fill={INK} />
    <circle cx={55} cy={-120} r={9} fill={INK} />
    <text
      x={0}
      y={60}
      textAnchor="middle"
      fontFamily={MAO}
      fontWeight={700}
      fontSize={110}
      fill={INK}
    >
      {texto}
    </text>
  </g>
);
