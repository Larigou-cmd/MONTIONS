import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import {
  Background,
  Grain,
  IN,
  OUT,
  P,
  Part,
  Pill,
  W,
  bornColor,
  it,
  rgba,
  tri,
} from "../lib";
import PAL from "../insulinaAplicacao_palavras.json";

// "Insulina: ângulo e local certo" — Modelo 1 (paleta verde), curto vertical 1080×1920.
// Formato inspirado nos vídeos de referência (etiquetas no topo, corte da pele em camadas, "grava aí").
// Roteiro e fontes: roteiros/insulina_angulo_local.md. Narração: Juliana (ElevenLabs v4).
// public/insulinaAplicacao/narracao_pausa.mp3 = narração com 2,5 s de pausa antes do "Me siga" (para ler o "Grava aí").

const NEON = "#3dff8f",
  LIMAO = "#f2e52e",
  VERM = "#ff5a5a",
  MINT = "#8fc4ae",
  BG0 = "#04120f";

export const FPS_INS = 30;
const CORTE = 83.4, // limiar dos tempos; o áudio é cortado em 83,8 s, no meio do silêncio
  PAUSA = 2.5;
const fr = (s: number) => Math.round((s >= CORTE ? s + PAUSA : s) * FPS_INS);

type Pal = { w: string; s: number };
const FALA: Pal[] = PAL as Pal[];
const FIM = FALA[FALA.length - 1].s;
export const DURATION_INSULINA = fr(FIM) + 75;

// ---------- legenda em pílula, palavra acesa ----------
const FRASES: { ini: number; fim: number; w: { t: string; f: number }[] }[] =
  (() => {
    const out: { ini: number; fim: number; w: { t: string; f: number }[] }[] =
      [];
    let cur: { t: string; f: number }[] = [];
    FALA.forEach((p, i) => {
      cur.push({ t: p.w, f: fr(p.s) });
      const fimFrase =
        /[.,?:;!]$/.test(p.w) || cur.length >= 5 || i === FALA.length - 1;
      if (fimFrase) {
        out.push({ ini: cur[0].f, fim: 0, w: cur });
        cur = [];
      }
    });
    out.forEach((o, i) => {
      const ult = o.w[o.w.length - 1].f;
      o.fim = Math.min(out[i + 1]?.ini ?? ult + 40, ult + 40);
    });
    return out;
  })();

const Legenda: React.FC<{ f: number }> = ({ f }) => {
  if (f >= fr(83.48) - 6) return null;
  const c = FRASES.find((o) => f >= o.ini - 2 && f < o.fim);
  if (!c) return null;
  const k = Math.min(
    it(f, c.ini - 2, c.ini + 4, 0, 1, OUT),
    1 - it(f, c.fim - 4, c.fim, 0, 1, IN),
  );
  let ativa = -1;
  c.w.forEach((w, i) => {
    if (f >= w.f) ativa = i;
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1478,
        left: 0,
        width: W,
        display: "flex",
        justifyContent: "center",
        opacity: k,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          padding: "14px 26px",
          borderRadius: 20,
          background: "rgba(4,18,15,0.82)",
          border: `1.5px solid ${rgba(NEON, 0.22)}`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: "60px",
          textAlign: "center",
          color: C.ink,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 12px",
        }}
      >
        {c.w.map((w, i) => (
          <span
            key={i}
            style={{
              padding: "0 8px",
              borderRadius: 10,
              background: i === ativa ? NEON : "transparent",
              color:
                i === ativa ? BG0 : i < ativa ? C.ink : rgba("#f7f3df", 0.45),
            }}
          >
            {w.t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------- etiquetas fixas no topo ----------
const ABAS: [string, number][] = [
  ["ÂNGULO", 19.0],
  ["LOCAL", 36.6],
  ["CAROÇO", 46.0],
  ["RODÍZIO", 62.6],
];
const Abas: React.FC<{ f: number }> = ({ f }) => {
  const k = Math.min(
    it(f, fr(5.3), fr(5.3) + 12, 0, 1, OUT),
    1 - it(f, fr(83.4), fr(83.4) + 10, 0, 1, IN),
  );
  if (k <= 0) return null;
  let atual = -1;
  ABAS.forEach(([, s], i) => {
    if (f >= fr(s)) atual = i;
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 262,
        left: 0,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        opacity: k,
      }}
    >
      {ABAS.map(([n, s], i) => {
        const on = i === atual;
        const pulso = tri(f, fr(s) + 4, 8);
        return (
          <div
            key={n}
            style={{
              padding: "10px 24px",
              borderRadius: 999,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 2,
              border: `2px solid ${i <= atual ? NEON : rgba("#f7f3df", 0.18)}`,
              background: on
                ? NEON
                : i < atual
                  ? rgba(NEON, 0.1)
                  : "transparent",
              color: on ? BG0 : i < atual ? NEON : rgba("#f7f3df", 0.4),
              transform: `scale(${1 + 0.12 * pulso})`,
              boxShadow: on ? `0 0 22px ${rgba(NEON, 0.45)}` : "none",
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

// ---------- título da cena, à esquerda ----------
const G: React.FC<{ c?: string; children: React.ReactNode }> = ({
  c = NEON,
  children,
}) => <span style={{ color: c }}>{children}</span>;
const Cabeca: React.FC<{
  f: number;
  at: number;
  y?: number;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y = 360, size = 66, children }) => {
  const k = it(f, at, at + 12, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: y,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.12,
        color: C.ink,
        opacity: k,
        transform: `translateY(${(1 - k) * 24}px)`,
      }}
    >
      {children}
    </div>
  );
};

// pílula que entra num quadro
const Pila: React.FC<{
  f: number;
  at: number;
  x?: number;
  y: number;
  cor?: string;
  size?: number;
  ate?: number;
  children: string;
}> = ({ f, at, x = 540, y, cor = NEON, size = 40, ate, children }) => {
  const kOut = ate ? 1 - P(f, ate - 6, ate) : 1;
  return (
    <Pill
      x={x}
      y={y}
      text={children}
      color={cor}
      size={size}
      k={P(f, at - 6, at + 4) * kOut}
    />
  );
};

// ---------- corte da pele em camadas ----------
const SX = 90,
  SW = 900,
  SY = 850,
  HP = 70,
  HG = 180,
  HM = 200;
const g = (x: number, cx: number, bw: number) =>
  Math.exp(-(((x - cx) / bw) ** 2));
type Camada = "pele" | "gordura" | "musculo";

const Pele: React.FC<{
  f: number;
  bump?: number; // altura do relevo (prega ou caroço), em px
  bumpX?: number;
  bumpW?: number;
  luz?: Camada | null;
  luzCor?: string;
  luzK?: number;
  rotulos?: [Camada, number][]; // [camada, quadro em que aparece]
  caroco?: number; // 0..1 contorno tracejado do caroço
  children?: React.ReactNode; // desenhos por cima (caneta, gota)
}> = ({
  f,
  bump = 0,
  bumpX = 540,
  bumpW = 150,
  luz = null,
  luzCor = NEON,
  luzK = 1,
  rotulos = [],
  caroco = 0,
  children,
}) => {
  const N = 90;
  const xs = Array.from({ length: N + 1 }, (_, i) => SX + (SW * i) / N);
  const top = (x: number) => SY - bump * g(x, bumpX, bumpW);
  const b1 = (x: number) => SY + HP - bump * 0.88 * g(x, bumpX, bumpW * 0.95);
  const b2 = () => SY + HP + HG;
  const bot = () => SY + HP + HG + HM;
  const poly = (a: (x: number) => number, b: (x: number) => number) =>
    [
      ...xs.map((x) => `${x},${a(x)}`),
      ...[...xs].reverse().map((x) => `${x},${b(x)}`),
    ].join(" ");
  const regs: [Camada, string][] = [
    ["pele", poly(top, b1)],
    ["gordura", poly(b1, b2)],
    ["musculo", poly(b2, bot)],
  ];
  const fill: Record<Camada, string> = {
    pele: "url(#ins-pele)",
    gordura: "url(#ins-gord)",
    musculo: "url(#ins-musc)",
  };
  const nomes: Record<Camada, string> = {
    pele: "pele",
    gordura: "gordura",
    musculo: "músculo",
  };
  const meio: Record<Camada, number> = {
    pele: SY + HP / 2,
    gordura: SY + HP + HG / 2,
    musculo: SY + HP + HG + HM / 2,
  };
  return (
    <svg
      width={W}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <defs>
        <linearGradient id="ins-pele" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0b9ae" />
          <stop offset="1" stopColor="#c97f78" />
        </linearGradient>
        <pattern
          id="ins-gord"
          width="46"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <rect width="46" height="40" fill="#cdb56a" />
          <circle
            cx="12"
            cy="11"
            r="11"
            fill="#f1dc95"
            stroke="#b89c52"
            strokeWidth="1.5"
          />
          <circle
            cx="35"
            cy="14"
            r="10"
            fill="#ecd48a"
            stroke="#b89c52"
            strokeWidth="1.5"
          />
          <circle
            cx="23"
            cy="31"
            r="10"
            fill="#f3e0a0"
            stroke="#b89c52"
            strokeWidth="1.5"
          />
          <circle
            cx="2"
            cy="33"
            r="7"
            fill="#ead28a"
            stroke="#b89c52"
            strokeWidth="1.5"
          />
          <circle
            cx="44"
            cy="35"
            r="7"
            fill="#ead28a"
            stroke="#b89c52"
            strokeWidth="1.5"
          />
        </pattern>
        <pattern
          id="ins-musc"
          width="40"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect width="40" height="12" fill="#8e2a33" />
          <line x1="0" y1="3" x2="40" y2="4" stroke="#b5404a" strokeWidth="3" />
          <line
            x1="0"
            y1="9"
            x2="40"
            y2="8.5"
            stroke="#6e1e26"
            strokeWidth="2"
          />
        </pattern>
        <clipPath id="ins-clip">
          <rect
            x={SX}
            y={SY - 260}
            width={SW}
            height={HP + HG + HM + 260}
            rx={28}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#ins-clip)">
        {regs.map(([n, pts]) => (
          <g key={n}>
            <polygon points={pts} fill={fill[n]} />
            {luz && luz !== n && (
              <polygon points={pts} fill={BG0} opacity={0.5 * luzK} />
            )}
          </g>
        ))}
      </g>
      {luz && (
        <polygon
          points={regs.find(([n]) => n === luz)![1]}
          fill="none"
          stroke={luzCor}
          strokeWidth={6}
          opacity={luzK}
          clipPath="url(#ins-clip)"
          style={{ filter: `drop-shadow(0 0 14px ${luzCor})` }}
        />
      )}
      {caroco > 0 && (
        <ellipse
          cx={bumpX}
          cy={SY + HP + HG / 2 - bump * 0.45}
          rx={bumpW * 1.15}
          ry={HG / 2 + bump * 0.55}
          fill="none"
          stroke={LIMAO}
          strokeWidth={5}
          strokeDasharray="16 12"
          opacity={caroco}
          style={{ filter: `drop-shadow(0 0 10px ${LIMAO})` }}
        />
      )}
      {children}
      {rotulos.map(([n, at]) => {
        const k = P(f, at - 4, at + 6);
        if (k <= 0) return null;
        return (
          <g
            key={n}
            opacity={k}
            transform={`translate(${SX + SW - 30},${meio[n]})`}
          >
            <rect
              x={-200}
              y={-28}
              width={200}
              height={56}
              rx={28}
              fill="rgba(4,18,15,0.85)"
              stroke={luz === n ? luzCor : rgba("#f7f3df", 0.3)}
              strokeWidth={2.5}
            />
            <text
              x={-100}
              y={11}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={800}
              fontSize={32}
              fill={luz === n ? luzCor : C.ink}
            >
              {nomes[n]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// caneta de insulina (desenhada apontando para baixo; ang = 90 é reto)
const Caneta: React.FC<{
  x: number;
  y: number;
  ang?: number;
  agulha?: number;
  corpo?: number;
  op?: number;
}> = ({ x, y, ang = 90, agulha = 130, corpo = 170, op = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang - 90})`} opacity={op}>
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-agulha}
      stroke="#e8eef0"
      strokeWidth={5}
      strokeLinecap="round"
    />
    <rect
      x={-14}
      y={-agulha - 22}
      width={28}
      height={24}
      rx={5}
      fill="#b9c4c8"
    />
    <rect
      x={-30}
      y={-agulha - 22 - corpo}
      width={60}
      height={corpo}
      rx={22}
      fill="#dfe7ea"
      stroke="#9fb0b5"
      strokeWidth={3}
    />
    <rect
      x={-18}
      y={-agulha - 22 - corpo * 0.62}
      width={36}
      height={corpo * 0.36}
      rx={8}
      fill={rgba(NEON, 0.75)}
    />
    <rect
      x={-22}
      y={-agulha - 22 - corpo - 26}
      width={44}
      height={30}
      rx={10}
      fill="#9fb0b5"
    />
  </g>
);

const Gota: React.FC<{
  x: number;
  y: number;
  k: number;
  cor?: string;
  irregular?: boolean;
}> = ({ x, y, k, cor = NEON, irregular }) => {
  if (k <= 0) return null;
  if (irregular)
    return (
      <g opacity={k}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx={x + (random(`gx${i}`) - 0.5) * 150}
            cy={y + (random(`gy${i}`) - 0.5) * 70}
            rx={14 + 22 * random(`gr${i}`) * k}
            ry={10 + 12 * random(`gq${i}`) * k}
            fill={rgba(cor, 0.75)}
            style={{ filter: `drop-shadow(0 0 10px ${cor})` }}
          />
        ))}
      </g>
    );
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={70 * k}
      ry={30 * k}
      fill={rgba(cor, 0.8)}
      stroke={cor}
      strokeWidth={3}
      style={{ filter: `drop-shadow(0 0 16px ${cor})` }}
    />
  );
};

// ---------- corpo (frente e costas) ----------
const CORPO = {
  torso:
    "M -112,140 Q -118,128 -96,126 L 96,126 Q 118,128 112,140 L 94,380 L 108,440 L -108,440 L -94,380 Z",
  bracoE: "M -116,142 L -158,148 L -174,430 L -138,434 Z",
  pernaE: "M -106,442 L -8,442 L -22,742 L -82,742 Z",
};
const espelho = (d: string) =>
  d.replace(/(-?\d+(?:\.\d+)?),/g, (_, n) => `${-parseFloat(n)},`);
const REG = {
  barriga: <ellipse cx={0} cy={318} rx={74} ry={58} />,
  bracoE: <path d="M -118,152 L -158,158 L -166,280 L -138,282 Z" />,
  bracoD: <path d="M 118,152 L 158,158 L 166,280 L 138,282 Z" />,
  coxaE: <path d="M -100,470 L -22,470 L -30,620 L -92,620 Z" />,
  coxaD: <path d="M 100,470 L 22,470 L 30,620 L 92,620 Z" />,
  gluteoE: <ellipse cx={-56} cy={466} rx={44} ry={36} />,
  gluteoD: <ellipse cx={56} cy={466} rx={44} ry={36} />,
};
const Corpo: React.FC<{
  x: number;
  y: number;
  s?: number;
  costas?: boolean;
  luzes: [keyof typeof REG, number][];
  umbigo?: number;
  label?: string;
  f: number;
}> = ({ x, y, s = 1, costas, luzes, umbigo = 0, label, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g
      fill="rgba(143,196,174,0.07)"
      stroke={rgba("#f7f3df", 0.55)}
      strokeWidth={3}
      strokeLinejoin="round"
    >
      <circle cx={0} cy={58} r={50} />
      <rect x={-18} y={104} width={36} height={26} />
      <path d={CORPO.bracoE} />
      <path d={espelho(CORPO.bracoE)} />
      <path d={CORPO.pernaE} />
      <path d={espelho(CORPO.pernaE)} />
      <path d={CORPO.torso} />
      {costas && <line x1={0} y1={430} x2={0} y2={505} />}
    </g>
    {luzes.map(([r, at]) => {
      const k = P(f, at - 4, at + 8);
      if (k <= 0) return null;
      const viva = 1 - 0.45 * P(f, at + 40, at + 60);
      return (
        <g
          key={r}
          fill={NEON}
          opacity={0.75 * k * viva}
          style={{ filter: `drop-shadow(0 0 ${14 * k}px ${NEON})` }}
        >
          {REG[r]}
        </g>
      );
    })}
    {!costas && (
      <circle
        cx={0}
        cy={318}
        r={7}
        fill={BG0}
        stroke={rgba("#f7f3df", 0.7)}
        strokeWidth={2}
      />
    )}
    {umbigo > 0 && (
      <g
        opacity={umbigo}
        stroke={VERM}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      >
        <circle cx={0} cy={318} r={30} />
        <line x1={-18} y1={300} x2={18} y2={336} />
        <line x1={18} y1={300} x2={-18} y2={336} />
      </g>
    )}
    {label && (
      <text
        x={0}
        y={790}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={700}
        fontSize={34}
        letterSpacing={3}
        fill={MINT}
      >
        {label}
      </text>
    )}
  </g>
);

// ---------- gráfico da glicose sobe e desce ----------
const Glicose: React.FC<{ f: number; at: number; y: number }> = ({
  f,
  at,
  y,
}) => {
  const pts = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((u, i) => [
    140 + u * 800,
    y + 210 + [0, -150, 60, -170, 90, -120, 40, -160][i],
  ]);
  const d = pts.map(([px, py]) => `${px},${py}`).join(" ");
  const L = 2600;
  const k = P(f, at, at + 45);
  return (
    <svg
      width={W}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <rect
        x={110}
        y={y + 140}
        width={860}
        height={90}
        rx={14}
        fill={rgba(NEON, 0.12)}
        stroke={rgba(NEON, 0.4)}
        strokeWidth={2}
        strokeDasharray="10 8"
        opacity={P(f, at - 10, at)}
      />
      <text
        x={970}
        y={y + 345}
        textAnchor="end"
        fontFamily={SANS}
        fontWeight={700}
        fontSize={30}
        fill={NEON}
        opacity={P(f, at - 10, at)}
      >
        faixa do alvo
      </text>
      <polyline
        points={d}
        fill="none"
        stroke={LIMAO}
        strokeWidth={9}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={L}
        strokeDashoffset={L * (1 - k)}
        style={{ filter: `drop-shadow(0 0 12px ${LIMAO})` }}
      />
      <text
        x={110}
        y={y + 410}
        fontFamily={SANS}
        fontWeight={800}
        fontSize={34}
        letterSpacing={3}
        fill={MINT}
        opacity={P(f, at - 10, at)}
      >
        GLICOSE
      </text>
    </svg>
  );
};

// ---------- mapa do rodízio na barriga ----------
const PONTOS: [number, number][] = (() => {
  const out: [number, number][] = [];
  const quad = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  quad.forEach(([qx, qy]) => {
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 3; c++)
        out.push([qx * (110 + c * 85), qy * (55 + r * 80)]);
  });
  return out;
})();
const CAROCO_I = 4; // ponto que vira caroço (1º quadrante)
const Rodizio: React.FC<{ f: number; at: number; carocoAt: number }> = ({
  f,
  at,
  carocoAt,
}) => {
  const cx = 540,
    cy = 860;
  const passo = 4;
  const kC = P(f, carocoAt - 4, carocoAt + 8);
  return (
    <svg
      width={W}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={420}
        ry={250}
        fill="rgba(143,196,174,0.07)"
        stroke={rgba("#f7f3df", 0.5)}
        strokeWidth={3}
      />
      <line
        x1={cx - 400}
        y1={cy}
        x2={cx + 400}
        y2={cy}
        stroke={rgba("#f7f3df", 0.25)}
        strokeWidth={2}
        strokeDasharray="10 10"
      />
      <line
        x1={cx}
        y1={cy - 240}
        x2={cx}
        y2={cy + 240}
        stroke={rgba("#f7f3df", 0.25)}
        strokeWidth={2}
        strokeDasharray="10 10"
      />
      <circle
        cx={cx}
        cy={cy}
        r={60}
        fill={BG0}
        stroke={rgba(VERM, 0.7)}
        strokeWidth={3}
        strokeDasharray="8 8"
      />
      <circle cx={cx} cy={cy} r={9} fill={rgba("#f7f3df", 0.7)} />
      {PONTOS.map(([dx, dy], i) => {
        const t0 = at + i * passo;
        const k = P(f, t0, t0 + 6);
        if (k <= 0) return null;
        const ultimo = f < t0 + passo + 6;
        const ehCaroco = i === CAROCO_I && f >= carocoAt - 4;
        if (ehCaroco) return null;
        return (
          <circle
            key={i}
            cx={cx + dx}
            cy={cy + dy}
            r={(ultimo ? 22 : 15) * k}
            fill={ultimo ? NEON : rgba(NEON, 0.45)}
            style={{
              filter: ultimo ? `drop-shadow(0 0 14px ${NEON})` : undefined,
            }}
          />
        );
      })}
      {kC > 0 && (
        <g opacity={kC}>
          <circle
            cx={cx + PONTOS[CAROCO_I][0]}
            cy={cy + PONTOS[CAROCO_I][1]}
            r={46}
            fill={rgba(LIMAO, 0.35)}
            stroke={LIMAO}
            strokeWidth={4}
            strokeDasharray="10 8"
          />
          <g stroke={VERM} strokeWidth={7} strokeLinecap="round">
            <line
              x1={cx + PONTOS[CAROCO_I][0] - 26}
              y1={cy + PONTOS[CAROCO_I][1] - 26}
              x2={cx + PONTOS[CAROCO_I][0] + 26}
              y2={cy + PONTOS[CAROCO_I][1] + 26}
            />
            <line
              x1={cx + PONTOS[CAROCO_I][0] + 26}
              y1={cy + PONTOS[CAROCO_I][1] - 26}
              x2={cx + PONTOS[CAROCO_I][0] - 26}
              y2={cy + PONTOS[CAROCO_I][1] + 26}
            />
          </g>
        </g>
      )}
      <text
        x={cx}
        y={cy + 300}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={700}
        fontSize={32}
        letterSpacing={3}
        fill={MINT}
      >
        BARRIGA
      </text>
    </svg>
  );
};

// ---------- tabela "grava aí" ----------
const TABELA: [string, string][] = [
  ["ÂNGULO", "90° com a agulha de 4 mm"],
  ["LOCAL", "barriga, braço, coxa, bumbum"],
  ["CAROÇO", "não aplique em cima"],
  ["RODÍZIO", "mude o ponto a cada vez"],
];

// ---------- sons ----------
const OV = "sfx_openverse/";
// revisado com o Earshot: pops mais baixos, grave real nas revelações, clique real da caneta
const SFX: [number, string, number][] = [
  [fr(0.2), "pop", 0.14],
  [fr(2.86), "pop", 0.14],
  ...[5.3, 19.0, 33.85, 36.6, 46.0, 62.6, 74.75, 81.0].map(
    (s) => [fr(s) - 5, "whoosh", 0.26] as [number, string, number],
  ),
  ...[19.0, 50.26, 63.74, 81.0].map(
    (s) => [fr(s), "grave_curto", 0.5] as [number, string, number],
  ),
  [fr(13.8), "whoosh", 0.16],
  [fr(7.74), "pop", 0.12],
  ...[11.66, 12.26, 13.06].map(
    (s) => [fr(s), "pop", 0.1] as [number, string, number],
  ),
  [fr(15.8), "carimbo", 0.3],
  [fr(19.8), "caneta_clique", 0.45],
  [fr(25.0), "gota", 0.35],
  ...[20.5, 22.66, 25.78].map(
    (s) => [fr(s), "pop", 0.1] as [number, string, number],
  ),
  [fr(30.52), "ding", 0.2],
  ...[38.34, 41.94, 44.38, 45.36].map(
    (s) => [fr(s), "pop", 0.12] as [number, string, number],
  ),
  [fr(39.5), "carimbo", 0.3],
  ...[46.4, 47.1, 47.8, 48.5].map(
    (s) => [fr(s), "tique", 0.1] as [number, string, number],
  ),
  [fr(52.8), "pop", 0.1],
  [fr(59.92), "whoosh", 0.16],
  [fr(66.86), "carimbo", 0.3],
  [fr(70.2), "pop", 0.1],
  [fr(71.5), "pop", 0.1],
  [fr(75.8), "caneta_clique", 0.45],
  ...[77.4, 78.4, 79.4, 80.4].map(
    (s) => [fr(s), "tique", 0.12] as [number, string, number],
  ),
  ...[0, 1, 2, 3].map(
    (i) => [fr(81.3) + i * 30, "pop", 0.1] as [number, string, number],
  ),
  [fr(83.48) - 10, "whoosh", 0.26],
  [2550, "ding", 0.14], // fecha a pausa do "Grava aí" (85 s do vídeo)
  [fr(88.0) - 3, "ding", 0.16],
  [fr(FIM) + 20, "sting", 0.45],
];

export const VideoInsulinaAplicacao: React.FC = () => {
  const f = useCurrentFrame();
  const S = fr;

  // agulha longa que passa da gordura (cena 1)
  const fundo = it(f, S(14.4), S(15.9), -30, HP + HG + 70);
  // caneta curta e reta (cena 2)
  const reta =
    f < S(26.9)
      ? it(f, S(23.3), S(24.6), -40, 115)
      : it(f, S(26.9), S(27.4), 115, -60);
  // picadas no mesmo ponto (cena 5)
  const picadas = [46.4, 47.1, 47.8, 48.5].reduce(
    (m, s) => Math.max(m, tri(f, S(s) + 6, 9)),
    0,
  );
  const bumpCaroco = it(f, S(50.1), S(51.4), 0, 80, OUT);

  return (
    <AbsoluteFill>
      <Background
        color={f >= S(46.0) && f < S(62.6) ? LIMAO : NEON}
        pulses={[S(15.8), S(25.0), S(30.52), S(50.26), S(63.74), S(FIM)]}
      />

      {/* 0. gancho */}
      <Part from={0} to={S(5.3)}>
        <div
          style={{
            position: "absolute",
            top: 330,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 1.05,
            color: C.ink,
          }}
        >
          SEMPRE NO
          <br />
          <span
            style={{ color: NEON, textShadow: `0 0 30px ${rgba(NEON, 0.5)}` }}
          >
            MESMO LUGAR?
          </span>
        </div>
        <svg
          width={W}
          height={1920}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <Corpo f={f} x={540} y={600} s={0.95} luzes={[]} />
          {Array.from({ length: 14 }, (_, i) => {
            const at = 8 + i * 5;
            const k = P(f, at, at + 4);
            if (k <= 0) return null;
            return (
              <circle
                key={i}
                cx={540 - 40 + (random(`p${i}`) - 0.5) * 22}
                cy={600 + 318 * 0.95 - 10 + (random(`q${i}`) - 0.5) * 18}
                r={8 * k}
                fill={LIMAO}
                opacity={0.85}
              />
            );
          })}
        </svg>
        {f >= S(2.86) - 4 && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 1350,
              transform: `translate(-50%,-50%) rotate(-4deg) scale(${2 - it(f, S(3.0), S(3.0) + 7, 0, 1, OUT)})`,
              opacity: it(f, S(3.0), S(3.0) + 7, 0, 1, OUT),
              border: `7px solid ${LIMAO}`,
              borderRadius: 14,
              padding: "6px 26px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              letterSpacing: 2,
              color: LIMAO,
              background: rgba("#000000", 0.5),
              whiteSpace: "nowrap",
            }}
          >
            BAGUNÇA A GLICOSE
          </div>
        )}
      </Part>

      {/* 1. o endereço: a gordura */}
      <Part from={S(5.3)} to={S(19.0)}>
        {f < S(13.9) ? (
          <Cabeca f={f} at={S(5.4)}>
            A insulina tem <G>endereço</G>:
            <br />a <G>gordura</G> sob a pele
          </Cabeca>
        ) : (
          <Cabeca f={f} at={S(13.9)}>
            Passou da gordura?
            <br />
            <G c={LIMAO}>Age diferente</G>
          </Cabeca>
        )}
        <Pele
          f={f}
          luz={f < S(7.6) ? null : f < S(15.7) ? "gordura" : "musculo"}
          luzCor={f < S(15.7) ? NEON : VERM}
          luzK={f < S(15.7) ? P(f, S(7.6), S(8.0)) : P(f, S(15.7), S(16.0))}
          rotulos={[
            ["pele", S(11.66)],
            ["gordura", S(12.26)],
            ["musculo", S(13.06)],
          ]}
        >
          {f >= S(14.3) && (
            <Caneta
              x={540}
              y={SY + fundo}
              agulha={330}
              corpo={150}
              op={P(f, S(14.3), S(14.6))}
            />
          )}
          <Gota
            x={540}
            y={SY + HP + HG + 70}
            k={P(f, S(16.0), S(16.8))}
            cor={VERM}
          />
        </Pele>
        <Pila f={f} at={S(7.74)} y={790} ate={S(13.9)}>
          💉 a insulina vai aqui
        </Pila>
        <Pila f={f} at={S(17.08)} y={1365} cor={LIMAO}>
          no músculo, ela age diferente do esperado
        </Pila>
      </Part>

      {/* 2. o ângulo */}
      <Part from={S(19.0)} to={S(33.85)}>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 345,
            opacity: P(f, S(19.1), S(19.5)),
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: f < S(27.6) ? 168 : 130,
              lineHeight: 1,
              color: NEON,
              textShadow: `0 0 30px ${rgba(NEON, 0.45)}`,
            }}
          >
            {f < S(27.6) ? "90°" : "prega"}
          </div>
          <div style={{ fontFamily: SANS }}>
            <div
              style={{
                color: MINT,
                fontWeight: 800,
                fontSize: f < S(27.6) ? 26 : 22,
                letterSpacing: 2,
                whiteSpace: "nowrap",
              }}
            >
              {f < S(27.6) ? "AGULHA DE 4 MM" : "CRIANÇA PEQUENA · MUITO MAGRO"}
            </div>
            <div
              style={{
                color: C.ink,
                fontWeight: 800,
                fontSize: 54,
                lineHeight: 1.1,
              }}
            >
              {f < S(27.6) ? "reto, na gordura" : "levanta a pele"}
            </div>
            <div
              style={{
                color: rgba("#f7f3df", 0.6),
                fontWeight: 600,
                fontSize: 28,
              }}
            >
              {f < S(27.6) ? "sem beliscar a pele" : "com 2 ou 3 dedos"}
            </div>
          </div>
        </div>
        <Pele
          f={f}
          luz="gordura"
          luzK={P(f, S(24.6), S(25.0))}
          bump={it(f, S(30.3), S(31.2), 0, 120, OUT)}
          bumpW={130}
        >
          {f < S(27.5) && (
            <Caneta x={800} y={SY + reta} op={P(f, S(19.8), S(20.3))} />
          )}
          {f < S(27.5) && f >= S(24.0) && (
            <g opacity={P(f, S(24.0), S(24.4)) * (1 - P(f, S(26.9), S(27.2)))}>
              <path
                d={`M 800,${SY - 70} A 70,70 0 0 1 870,${SY}`}
                fill="none"
                stroke={NEON}
                strokeWidth={5}
              />
              <line
                x1={800}
                y1={SY}
                x2={960}
                y2={SY}
                stroke={NEON}
                strokeWidth={4}
              />
              <text
                x={880}
                y={SY - 50}
                fontFamily={SANS}
                fontWeight={800}
                fontSize={40}
                fill={NEON}
              >
                90°
              </text>
            </g>
          )}
          <Gota
            x={800}
            y={SY + 115}
            k={P(f, S(25.0), S(25.8)) * (1 - P(f, S(26.9), S(27.3)))}
          />
          {f >= S(30.3) &&
            [-1, 1].map((sd) => {
              const k = it(f, S(30.3), S(31.3), 0, 1, OUT);
              return (
                <ellipse
                  key={sd}
                  cx={540 + sd * (260 - 70 * k)}
                  cy={SY - 30}
                  rx={46}
                  ry={88}
                  transform={`rotate(${sd * -24} ${540 + sd * (260 - 70 * k)} ${SY - 30})`}
                  fill="#d9a38b"
                  stroke="#a8705c"
                  strokeWidth={4}
                  opacity={k}
                />
              );
            })}
        </Pele>
        <Pila f={f} at={S(20.5)} x={300} y={1365} ate={S(27.4)}>
          agulha de 4 mm
        </Pila>
        <Pila f={f} at={S(22.66)} x={740} y={1365} ate={S(27.4)}>
          caneta do SUS
        </Pila>
        <Pila f={f} at={S(31.38)} y={1365} cor={LIMAO}>
          ✌️ prega com 2 ou 3 dedos
        </Pila>
      </Part>

      {/* 3. ponta solta */}
      <Part from={S(33.85)} to={S(36.6)}>
        <div
          style={{
            position: "absolute",
            top: 760,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 84,
            lineHeight: 1.12,
            color: C.ink,
            opacity: P(f, S(33.9), S(34.3)),
          }}
        >
          o ângulo nem é
          <br />
          <span style={{ color: LIMAO }}>o erro mais comum</span>
        </div>
      </Part>

      {/* 4. os locais */}
      <Part from={S(36.6)} to={S(46.0)}>
        <Cabeca f={f} at={S(36.7)}>
          Onde aplicar: <G>4 locais</G>
        </Cabeca>
        <svg
          width={W}
          height={1920}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <Corpo
            f={f}
            x={310}
            y={520}
            s={1}
            label="FRENTE"
            umbigo={P(f, S(39.5), S(39.8))}
            luzes={[
              ["barriga", S(38.34)],
              ["bracoE", S(41.94)],
              ["bracoD", S(41.94)],
              ["coxaE", S(44.38)],
              ["coxaD", S(44.38)],
            ]}
          />
          <Corpo
            f={f}
            x={780}
            y={520}
            s={1}
            costas
            label="COSTAS"
            luzes={[
              ["bracoE", S(41.94)],
              ["bracoD", S(41.94)],
              ["gluteoE", S(45.36)],
              ["gluteoD", S(45.36)],
            ]}
          />
        </svg>
        {(
          [
            [38.34, 41.9, "barriga · longe do umbigo"],
            [41.94, 44.3, "braço · fora e em cima"],
            [44.38, 45.3, "coxa · frente e lateral"],
            [45.36, 46.0, "bumbum"],
          ] as [number, number, string][]
        ).map(([a, b, t]) => (
          <Pila key={t} f={f} at={S(a)} ate={S(b)} y={1385}>
            {t}
          </Pila>
        ))}
      </Part>

      {/* 5. o caroço */}
      <Part from={S(46.0)} to={S(62.6)}>
        {f < S(55.4) ? (
          <Cabeca f={f} at={S(46.1)}>
            Sempre no <G c={LIMAO}>mesmo ponto</G>?
          </Cabeca>
        ) : (
          <Cabeca f={f} at={S(55.4)}>
            No caroço, a insulina
            <br />
            <G c={LIMAO}>é absorvida irregular</G>
          </Cabeca>
        )}
        {f < S(59.8) && (
          <AbsoluteFill style={{ opacity: 1 - P(f, S(59.4), S(59.8)) }}>
            <Pele
              f={f}
              bump={bumpCaroco}
              bumpW={150}
              caroco={P(f, S(50.26), S(50.7))}
              luz={f >= S(55.5) ? "gordura" : null}
              luzCor={LIMAO}
              luzK={P(f, S(55.5), S(55.9))}
            >
              {f < S(49.2) && (
                <Caneta
                  x={540}
                  y={SY - 40 + 130 * picadas}
                  op={P(f, S(46.1), S(46.3)) * (1 - P(f, S(49.0), S(49.2)))}
                />
              )}
              {[46.4, 47.1, 47.8, 48.5].map((s, i) =>
                f >= S(s) + 6 ? (
                  <circle
                    key={i}
                    cx={530 + i * 7}
                    cy={SY - bumpCaroco + 4}
                    r={6}
                    fill={VERM}
                    opacity={0.9}
                  />
                ) : null,
              )}
              <Gota
                x={540}
                y={SY + HP + HG / 2 - bumpCaroco * 0.4}
                k={P(f, S(57.6), S(58.4))}
                cor={LIMAO}
                irregular
              />
            </Pele>
            <Pila f={f} at={S(50.26)} y={1365} cor={LIMAO} ate={S(52.7)}>
              nasce um caroço de gordura
            </Pila>
            <Pila f={f} at={S(52.8)} y={1365} ate={S(57.5)}>
              😌 dói menos… e a gente volta ali
            </Pila>
          </AbsoluteFill>
        )}
        {f >= S(59.6) && (
          <AbsoluteFill style={{ opacity: P(f, S(59.6), S(59.9)) }}>
            <Glicose f={f} at={S(59.92)} y={720} />
            <Pila f={f} at={S(61.04)} y={1365} cor={LIMAO}>
              sobe e desce sem explicação
            </Pila>
          </AbsoluteFill>
        )}
      </Part>

      {/* 6. o rodízio */}
      <Part from={S(62.6)} to={S(74.75)}>
        <Cabeca f={f} at={S(62.7)}>
          A saída: <G>rodízio</G>
        </Cabeca>
        <Rodizio f={f} at={S(64.86)} carocoAt={S(66.86)} />
        <Pila f={f} at={S(64.86)} y={520} ate={S(66.7)}>
          mude o ponto a cada aplicação
        </Pila>
        <Pila f={f} at={S(68.0)} y={1260} cor={LIMAO}>
          caroço: espere sumir · pode levar meses
        </Pila>
        <Pila f={f} at={S(71.5)} y={1370} cor={LIMAO} size={36}>
          reaproveitar a agulha aumenta o risco do caroço
        </Pila>
      </Part>

      {/* 7. o botão */}
      <Part from={S(74.75)} to={S(81.0)}>
        <Cabeca f={f} at={S(74.85)}>
          Apertou o botão?
          <br />
          <G>Segure a agulha na pele</G>
        </Cabeca>
        <Pele f={f} luz="gordura" luzK={1}>
          <Caneta x={540} y={SY + 115} />
          <Gota x={540} y={SY + 115} k={P(f, S(76.3), S(78.0))} />
          {(() => {
            const k = P(f, S(77.0), S(80.6));
            const r = 82,
              cx = 830,
              cy = 690,
              L = 2 * Math.PI * r;
            return (
              <g opacity={P(f, S(76.9), S(77.2))}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="rgba(4,18,15,0.85)"
                  stroke={rgba("#f7f3df", 0.2)}
                  strokeWidth={12}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={NEON}
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={L}
                  strokeDashoffset={L * (1 - k)}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ filter: `drop-shadow(0 0 10px ${NEON})` }}
                />
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  fontFamily={SANS}
                  fontWeight={800}
                  fontSize={38}
                  fill={C.ink}
                >
                  conte
                </text>
              </g>
            );
          })()}
        </Pele>
        <Pila f={f} at={S(78.46)} y={1365}>
          📄 conte o tempo que a bula da caneta pede
        </Pila>
      </Part>

      {/* 8. grava aí */}
      <Part from={S(81.0)} to={S(83.48) - 4}>
        <Cabeca f={f} at={S(81.1)}>
          <G>Grava aí.</G>
        </Cabeca>
        {TABELA.map(([a, b], i) => {
          const at = S(81.3) + i * 30;
          const k = it(f, at, at + 10, 0, 1, OUT);
          return (
            <div
              key={a}
              style={{
                position: "absolute",
                left: 80,
                width: 920,
                top: 520 + i * 165,
                height: 135,
                borderRadius: 24,
                background: "rgba(9,32,26,0.92)",
                border: `2.5px solid ${rgba(NEON, 0.2 + 0.5 * k)}`,
                display: "flex",
                alignItems: "center",
                gap: 30,
                padding: "0 34px",
                opacity: 0.25 + 0.75 * k,
                transform: `translateX(${(1 - k) * 40}px)`,
                fontFamily: SANS,
              }}
            >
              <span
                style={{
                  width: 210,
                  color: NEON,
                  fontWeight: 900,
                  fontSize: 34,
                  letterSpacing: 2,
                }}
              >
                {a}
              </span>
              <span style={{ color: C.ink, fontWeight: 700, fontSize: 42 }}>
                {b}
              </span>
            </div>
          );
        })}
        <Pila f={f} at={S(81.3)} y={1250} cor={LIMAO} size={40}>
          📌 salva para a próxima aplicação
        </Pila>
      </Part>

      {/* 9. me siga */}
      <Part from={S(83.48) - 4} to={S(88.0)}>
        <Img
          src={staticFile("anlodipinoNovo/logo.jpg")}
          style={{
            position: "absolute",
            left: 350,
            top: 420,
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: `6px solid ${NEON}`,
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 850,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            color: C.ink,
          }}
        >
          ME SIGA
        </div>
        <div
          style={{
            position: "absolute",
            top: 1010,
            left: 110,
            width: 860,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1.3,
            color: C.ink,
          }}
        >
          para mais dicas de farmacologia e curiosidades sobre a área
        </div>
      </Part>

      {/* 10. tela final */}
      <Part from={S(88.0)} to={DURATION_INSULINA} inY={100} outDur={1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
            const at = S(88.14) + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 700 + i * 110,
                  width: W,
                  textAlign: "center",
                  fontFamily: SERIF,
                  fontWeight: i === 1 ? 600 : 400,
                  fontSize: i === 1 ? 92 : 80,
                  color:
                    i === 1
                      ? bornColor(f, at, "#eff6ff", NEON, 20)
                      : bornColor(f, at, C.ink, NEON),
                  opacity: k,
                  transform: `translateY(${(1 - k) * 40}px)`,
                }}
              >
                {l}
              </div>
            );
          },
        )}
      </Part>

      <Abas f={f} />
      <Legenda f={f} />
      <Grain />
      <Audio src={staticFile("insulinaAplicacao/narracao_pausa.mp3")} />
      {/* sem música de fundo: pedido da usuária em 23/11/2026 (só voz e efeitos) */}
      {SFX.map(([x, nome, vol], i) => (
        <Sequence key={i} from={x} durationInFrames={90}>
          <Audio src={staticFile(OV + nome + ".mp3")} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e y≈1620, o recorte 3:4 do TikTok e do Instagram.
export const CapaInsulinaAplicacao: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={NEON} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      INSULINA SEMPRE
      <br />
      <span style={{ color: NEON, textShadow: `0 0 30px ${rgba(NEON, 0.5)}` }}>
        NO MESMO LUGAR?
      </span>
    </div>
    <Pele
      f={999}
      bump={80}
      bumpW={150}
      caroco={1}
      luz="gordura"
      luzCor={LIMAO}
      luzK={1}
      rotulos={[
        ["pele", 0],
        ["gordura", 0],
        ["musculo", 0],
      ]}
    >
      <Caneta x={820} y={SY - 14} agulha={100} corpo={120} op={1} />
    </Pele>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1440,
        transform: "translate(-50%,-50%) rotate(-4deg)",
        border: `8px solid ${LIMAO}`,
        borderRadius: 16,
        padding: "8px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 60,
        letterSpacing: 2,
        color: LIMAO,
        background: rgba("#000000", 0.5),
        whiteSpace: "nowrap",
      }}
    >
      ÂNGULO E LOCAL CERTO
    </div>
    <Pill x={290} y={700} text="caroço?" color={LIMAO} size={44} k={1} />
    <Grain />
  </AbsoluteFill>
);
