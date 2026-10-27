import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import {
  Background,
  Grain,
  OUT,
  P,
  Part,
  Pill,
  SNAP,
  W,
  bornColor,
  it,
  mix,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";

// "Você sabe como a pílula do dia seguinte funciona?" no Modelo 1 (roteiro em pilula_dia_seguinte/roteiro.md).
// Narração gravada pela Larissa no ElevenLabs (voz Juliana, com as marcas). Tempos: audio/pilula_usuaria2_palavras.json (quadro = segundos × 30).
export const COR = "#f472b6"; // pílula
const LH = "#fbbf24"; // sinal do cérebro
const ESC = "#2dd4bf"; // escudo da pílula
const VERDE = "#4ade80",
  VERM = "#ef4444",
  OVO = "#fde68a";

// TEMPOS
const T = {
  abortiva: 133,
  hora: 189,
  vem: 220,
  maisUsada: 354,
  levo: 409,
  postinor: 470,
  pozato: 504,
  diad: 537,
  poslov: 561,
  outros: 585,
  hormonio: 628,
  progesterona: 666,
  dose: 732,
  mg: 760,
  lembra: 875,
  esperma: 929,
  cincoDias: 988,
  esperando: 1048,
  ovulo: 1069,
  ovario: 1144,
  cerebro: 1167,
  sinal: 1190,
  lh: 1259,
  age: 1315,
  bloqueia: 1374,
  naoAcontece: 1466,
  semOvulo: 1504,
  naoAbortiva: 1606,
  gravidez: 1685,
  embriao: 1759,
  implantou: 1787,
  interrompe: 1852,
  ate5: 1929,
  h72: 2071,
  ovulacaoJa: 2134,
  menos: 2202,
  quantoAntes: 2257,
  resto: 2369,
  naoProtege: 2422,
  soAquela: 2473,
  ists: 2574,
  atenta: 2653,
  vomitar: 2694,
  repetir: 2846,
  menstruacao: 2923,
  postinor2: 3109,
  emergencia: 3156,
  rotina: 3207,
  proteger: 3277,
  profissional: 3356,
  siga: 3456,
  final: 3590,
};
export const DURATION = 3680; // 122,7 s (narração da Larissa de 119,4 s + mensagem final; abaixo de 3 min)
const PARTES: [number, number][] = [
  [0, 318],
  [312, 871],
  [865, 1107],
  [1101, 1602],
  [1596, 1897],
  [1891, 2304],
  [2298, 2649],
  [2643, 3023],
  [3017, 3452],
  [3446, 3592],
  [3586, DURATION],
];
// FIM TEMPOS

function R0(i: number) {
  return PARTES[i][0];
}
const SFX: [number, string, number][] = [
  [8, "pop", 0.25],
  [T.abortiva, "pop", 0.22],
  [T.hora, "pop", 0.22],
  [R0(1), "whoosh", 0.3],
  [T.levo, "plim", 0.25],
  [T.postinor, "pop", 0.22],
  [T.pozato, "pop", 0.22],
  [T.diad, "pop", 0.22],
  [T.poslov, "pop", 0.22],
  [T.dose, "pop", 0.22],
  [R0(2), "whoosh", 0.3],
  [T.esperma, "pop", 0.2],
  [T.cincoDias, "plim", 0.25],
  [R0(3), "whoosh", 0.3],
  [T.sinal, "bip", 0.22],
  [T.bloqueia, "trava", 0.38],
  [T.naoAcontece, "plim", 0.25],
  [R0(4), "whoosh", 0.3],
  [T.naoAbortiva, "trava", 0.38],
  [T.interrompe, "pop", 0.22],
  [R0(5), "whoosh", 0.3],
  [T.h72, "plim", 0.25],
  [T.menos, "trava", 0.32],
  [R0(6), "whoosh", 0.3],
  [T.naoProtege, "trava", 0.36],
  [T.ists, "pop", 0.22],
  [R0(7), "whoosh", 0.3],
  [T.vomitar, "pop", 0.22],
  [T.menstruacao, "pop", 0.22],
  [R0(8), "whoosh", 0.3],
  [T.postinor2, "pop", 0.22],
  [T.emergencia, "plim", 0.28],
  [T.profissional, "pop", 0.22],
  [R0(9), "whoosh", 0.3],
  [R0(10), "whoosh", 0.3],
  [T.final, "plim", 0.3],
];
const MENSAGEM_FINAL = [
  "Consulte um",
  "profissional de saúde",
  "para orientações.",
];

const R = (i: number) => PARTES[i];
const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);
const Item: React.FC<{
  f: number;
  at: number;
  y: number;
  icone: string;
  texto: React.ReactNode;
  cor?: string;
  h?: number;
}> = ({ f, at, y, icone, texto, cor, h = 150 }) => (
  <Card
    f={f}
    at={at}
    x={60}
    y={y}
    w={960}
    h={h}
    border={cor ? rgba(cor, 0.6) : C.boxBorder}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "0 32px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 58, flexShrink: 0 }}>
      {icone}
    </span>
    <span
      style={{
        fontSize: 38,
        fontWeight: 600,
        lineHeight: 1.25,
        color: bornColor(f, at, C.ink, cor ?? COR),
      }}
    >
      {texto}
    </span>
  </Card>
);
// comprimido redondo da pílula
export const Comprimido: React.FC<{
  x: number;
  y: number;
  r?: number;
  glow?: number;
}> = ({ x, y, r = 90, glow = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle
      r={r}
      fill="#fdf2f8"
      style={{
        filter: `drop-shadow(0 0 ${r * 0.35 * glow}px ${rgba(COR, 0.8)})`,
      }}
    />
    <circle r={r * 0.86} fill="none" stroke="#fbcfe8" strokeWidth={r * 0.05} />
    <ellipse
      cx={-r * 0.35}
      cy={-r * 0.4}
      rx={r * 0.32}
      ry={r * 0.14}
      fill="#ffffff"
      opacity={0.8}
      transform={`rotate(-30 ${-r * 0.35} ${-r * 0.4})`}
    />
    <text
      y={r * 0.17}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={800}
      fontSize={r * 0.42}
      fill={COR}
    >
      1,5
    </text>
  </g>
);
// espermatozoide nadando (cabeça + cauda ondulando)
const Esperma: React.FC<{
  x: number;
  y: number;
  f: number;
  i: number;
  rot?: number;
  o?: number;
}> = ({ x, y, f, i, rot = 0, o = 1 }) => {
  const pts = Array.from(
    { length: 9 },
    (_, k) => `${-18 - k * 9},${Math.sin(f / 4 + i + k * 0.8) * (2 + k * 0.9)}`,
  ).join(" ");
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
      <polyline
        points={`-12,0 ${pts}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <ellipse
        rx={15}
        ry={10}
        fill="#f8fafc"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.6))" }}
      />
    </g>
  );
};
// ovário com um folículo (óvulo dentro)
const Ovario: React.FC<{
  x: number;
  y: number;
  s?: number;
  fechado?: number;
  f: number;
}> = ({ x, y, s = 1, fechado = 0, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse
      rx={150}
      ry={100}
      fill={rgba("#f9a8d4", 0.22)}
      stroke="#f9a8d4"
      strokeWidth={5}
    />
    {[
      [-80, -30, 18],
      [70, 40, 14],
      [-40, 55, 12],
      [95, -35, 10],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={rgba("#f9a8d4", 0.35)} />
    ))}
    <circle
      cx={10}
      cy={-5}
      r={46}
      fill={rgba(OVO, 0.18)}
      stroke={OVO}
      strokeWidth={3}
    />
    <circle
      cx={10}
      cy={-5}
      r={24 + Math.sin(f / 12) * 1.5}
      fill={OVO}
      style={{ filter: `drop-shadow(0 0 12px ${OVO})` }}
    />
    {fechado > 0 && (
      <g opacity={fechado}>
        <circle
          cx={10}
          cy={-5}
          r={60}
          fill="none"
          stroke={ESC}
          strokeWidth={7}
          strokeDasharray="14 10"
        />
        <text
          x={10}
          y={-80}
          textAnchor="middle"
          fontFamily={EMOJI}
          fontSize={54}
        >
          🔒
        </text>
      </g>
    )}
  </g>
);
// escudo (inteiro ou quebrado)
const Escudo: React.FC<{
  x: number;
  y: number;
  s?: number;
  cor?: string;
  quebrado?: number;
  label?: string;
}> = ({ x, y, s = 1, cor = ESC, quebrado = 0, label }) => {
  const d = "M0,-90 L75,-62 L70,10 Q60,70 0,98 Q-60,70 -70,10 L-75,-62 Z";
  const sep = 14 * quebrado;
  const half = (side: number) => (
    <g
      transform={`translate(${side * sep},${quebrado * 10}) rotate(${side * 8 * quebrado})`}
    >
      <clipPath id={`c${side}${x}`}>
        <path
          d={
            side < 0
              ? "M-90,-100 L5,-100 L-12,-20 L10,20 L-8,110 L-90,110 Z"
              : "M5,-100 L90,-100 L90,110 L-8,110 L10,20 L-12,-20 Z"
          }
        />
      </clipPath>
      <path
        d={d}
        clipPath={`url(#c${side}${x})`}
        fill={rgba(cor, 0.25)}
        stroke={cor}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </g>
  );
  return (
    <g
      transform={`translate(${x},${y}) scale(${s})`}
      style={{ filter: `drop-shadow(0 0 14px ${rgba(cor, 0.6)})` }}
    >
      {half(-1)}
      {half(1)}
      {label && (
        <text
          y={14}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={34}
          fill={C.ink}
        >
          {label}
        </text>
      )}
    </g>
  );
};
// carimbo "✕ MITO"
const Mito: React.FC<{ f: number; at: number; texto: string }> = ({
  f,
  at,
  texto,
}) => {
  const k = it(f, at, at + 12, 0, 1, SNAP);
  if (f < at) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          width: W,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, k * 1.5),
        }}
      >
        <div
          style={{
            transform: `rotate(-6deg) scale(${2 - k})`,
            border: `7px solid ${VERM}`,
            borderRadius: 18,
            padding: "6px 34px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 76,
            letterSpacing: 6,
            color: VERM,
            textShadow: `0 0 20px ${rgba(VERM, 0.7)}`,
            boxShadow: `0 0 24px ${rgba(VERM, 0.35)}`,
          }}
        >
          ✕ MITO
        </div>
      </div>
      <Title
        f={f}
        at={at + 8}
        y={330}
        size={50}
        weight={600}
        color={C.ink}
        from={VERM}
      >
        {texto}
      </Title>
    </>
  );
};

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const q = 1 + 0.06 * Math.sin(f / 9);
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <div
        style={{
          position: "absolute",
          top: 200,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.08,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        VOCÊ SABE COMO A<br />
        <span style={{ color: COR }}>PÍLULA DO DIA SEGUINTE</span>
        <br />
        FUNCIONA?
      </div>
      <Tela>
        <g
          opacity={P(f, 6, 18)}
          transform={`translate(0,${(1 - it(f, 6, 22, 0, 1, OUT)) * 40})`}
        >
          <Comprimido
            x={540}
            y={800}
            r={150}
            glow={1 + 0.3 * Math.sin(f / 10)}
          />
        </g>
        <text
          x={540}
          y={720}
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight={700}
          fontSize={260 * q}
          fill={C.ink}
          opacity={P(f, 20, 32) * 0.9}
          style={{ filter: `drop-shadow(0 0 22px ${COR})` }}
          transform="translate(150,-40)"
        >
          ?
        </text>
      </Tela>
      <Pill
        x={300}
        y={1060}
        text="abortiva? 🤔"
        color={COR}
        size={44}
        k={P(f, T.abortiva, T.abortiva + 12)}
      />
      <Pill
        x={760}
        y={1150}
        text="a qualquer hora? ⏰"
        color={LH}
        size={44}
        k={P(f, T.hora, T.hora + 12)}
      />
      <Title
        f={f}
        at={T.vem}
        y={1290}
        size={50}
        weight={600}
        color={C.ink}
        from={COR}
      >
        o que ela realmente faz no corpo
      </Title>
    </Part>
  );
};

// núcleo esteroide (4 anéis) do levonorgestrel
const Esteroide: React.FC<{ f: number; at: number; x: number; y: number }> = ({
  f,
  at,
  x,
  y,
}) => {
  const hex = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${i ? "L" : "M"}${cx + Math.cos(a) * 52},${cy + Math.sin(a) * 52}`;
    }).join(" ") + "Z";
  const pent = (cx: number, cy: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = ((Math.PI * 2) / 5) * i - Math.PI / 2 + 0.3;
      return `${i ? "L" : "M"}${cx + Math.cos(a) * 46},${cy + Math.sin(a) * 46}`;
    }).join(" ") + "Z";
  const rings = [hex(-135, 30), hex(-45, -22), hex(45, 30), pent(128, -10)];
  return (
    <g transform={`translate(${x},${y})`}>
      {rings.map((d, i) => {
        const k = P(f, at + i * 6, at + i * 6 + 14);
        return k <= 0 ? null : (
          <path
            key={i}
            d={d}
            fill={rgba(COR, 0.08)}
            stroke={COR}
            strokeWidth={6}
            strokeLinejoin="round"
            opacity={k}
            style={{ filter: `drop-shadow(0 0 10px ${rgba(COR, 0.7)})` }}
          />
        );
      })}
      <g opacity={P(f, at + 26, at + 38)}>
        <line
          x1={-178}
          y1={55}
          x2={-215}
          y2={78}
          stroke={COR}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <text
          x={-238}
          y={100}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={34}
          fill={C.ink}
        >
          O
        </text>
        <line
          x1={160}
          y1={-30}
          x2={200}
          y2={-60}
          stroke={COR}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <text
          x={222}
          y={-62}
          fontFamily={SANS}
          fontWeight={800}
          fontSize={32}
          fill={C.ink}
        >
          OH
        </text>
        <line
          x1={150}
          y1={-40}
          x2={190}
          y2={-10}
          stroke={COR}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <line
          x1={190}
          y1={-10}
          x2={240}
          y2={-10}
          stroke={COR}
          strokeWidth={6}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};

// 2. o que é
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title
        f={f}
        at={R0(1) + 10}
        y={210}
        size={44}
        font={SANS}
        weight={600}
        color={C.dim}
        from={COR}
      >
        a mais usada no Brasil
      </Title>
      <Card
        f={f}
        at={T.levo}
        x={90}
        y={300}
        w={900}
        h={190}
        border={rgba(COR, 0.75)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          boxShadow: `0 0 30px ${rgba(COR, 0.25)}`,
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 74,
            color: bornColor(f, T.levo, C.ink, COR),
          }}
        >
          Levonorgestrel
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 40,
            color: COR,
            opacity: P(f, T.mg, T.mg + 12),
          }}
        >
          1,5 mg
        </span>
      </Card>
      <Pill
        x={220}
        y={555}
        text="Postinor Uno"
        color={C.ink}
        size={34}
        k={P(f, T.postinor, T.postinor + 12)}
      />
      <Pill
        x={540}
        y={555}
        text="Pozato Uni"
        color={C.ink}
        size={34}
        k={P(f, T.pozato, T.pozato + 12)}
      />
      <Pill x={840} y={555} text="Diad" color={C.ink} size={34} k={P(f, T.diad, T.diad + 12)} />
      <Pill x={400} y={635} text="Poslov" color={C.ink} size={34} k={P(f, T.poslov, T.poslov + 12)} />
      <Pill x={680} y={635} text="e outros" color={C.dim} size={34} k={P(f, T.outros, T.outros + 12)} />
      <Tela>
        <Esteroide f={f} at={T.hormonio} x={540} y={770} />
      </Tela>
      <Pill
        x={540}
        y={930}
        text="hormônio parecido com a progesterona"
        color={COR}
        size={36}
        k={P(f, T.progesterona, T.progesterona + 12)}
      />
      <Card
        f={f}
        at={T.dose}
        x={210}
        y={1010}
        w={660}
        h={260}
        border={rgba(COR, 0.6)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
        }}
      >
        <svg width={200} height={200} viewBox="-100 -100 200 200">
          <rect
            x={-90}
            y={-70}
            width={180}
            height={140}
            rx={24}
            fill="rgba(226,232,240,.12)"
            stroke="#cbd5e1"
            strokeWidth={4}
          />
          <Comprimido x={0} y={0} r={48} />
        </svg>
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              color: C.ink,
            }}
          >
            DOSE ÚNICA
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 34,
              color: C.dim,
            }}
          >
            1 comprimido
          </span>
        </span>
      </Card>
    </Part>
  );
};

// trompa + útero estilizados (usados no ciclo)
const Trompa: React.FC<{ o: number }> = ({ o }) => (
  <g opacity={o}>
    <path
      d="M150,760 C260,620 420,640 540,700 C660,760 800,760 930,640"
      fill="none"
      stroke={rgba("#f9a8d4", 0.35)}
      strokeWidth={70}
      strokeLinecap="round"
    />
    <path
      d="M150,760 C260,620 420,640 540,700 C660,760 800,760 930,640"
      fill="none"
      stroke="#f9a8d4"
      strokeWidth={4}
      strokeDasharray="2 14"
      strokeLinecap="round"
    />
    <text
      x={540}
      y={830}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={600}
      fontSize={30}
      fill={C.dim}
    >
      trompa
    </text>
  </g>
);

// 3. o ciclo: espermatozoides esperando até 5 dias
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const chega = it(f, T.esperma, T.esperma + 60, 0, 1, OUT);
  const dias = Math.min(
    5,
    Math.floor(
      P(f, T.cincoDias, T.cincoDias + 40) * 5 + (f >= T.cincoDias ? 1 : 0),
    ),
  );
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.lembra} y={220} size={56} weight={600} from={COR}>
        lembra de uma coisa…
      </Title>
      <Tela>
        <Trompa o={P(f, T.lembra, T.lembra + 20)} />
        {f >= T.esperma &&
          Array.from({ length: 7 }, (_, i) => {
            const tx = 250 + i * 55 + Math.sin(f / 20 + i) * 14;
            const ty =
              690 -
              Math.sin((tx - 150) / 260) * 30 +
              Math.cos(f / 15 + i * 2) * 10;
            const x = 40 + (tx - 40) * chega;
            return (
              <Esperma
                key={i}
                x={x}
                y={ty}
                f={f}
                i={i}
                rot={Math.sin(f / 18 + i) * 12}
              />
            );
          })}
        {/* lugar do óvulo: ainda vazio */}
        <g opacity={P(f, T.esperando, T.esperando + 14)}>
          <circle
            cx={830}
            cy={700}
            r={42}
            fill="none"
            stroke={OVO}
            strokeWidth={4}
            strokeDasharray="10 10"
            transform={`rotate(${f} 830 700)`}
          />
          <text
            x={830}
            y={712}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={40}
            fill={OVO}
          >
            ?
          </text>
          <text
            x={830}
            y={790}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={700}
            fontSize={30}
            fill={OVO}
          >
            óvulo
          </text>
        </g>
        {/* contador de dias */}
        <g opacity={P(f, T.cincoDias - 6, T.cincoDias + 6)}>
          {Array.from({ length: 5 }, (_, i) => {
            const on = i < dias;
            return (
              <g key={i}>
                <rect
                  x={170 + i * 150}
                  y={960}
                  width={130}
                  height={110}
                  rx={20}
                  fill={on ? rgba(COR, 0.25) : "rgba(148,163,200,.08)"}
                  stroke={on ? COR : "#475569"}
                  strokeWidth={4}
                />
                <text
                  x={235 + i * 150}
                  y={1030}
                  textAnchor="middle"
                  fontFamily={SANS}
                  fontWeight={800}
                  fontSize={40}
                  fill={on ? C.ink : "#64748b"}
                >
                  {i + 1}º
                </text>
              </g>
            );
          })}
        </g>
      </Tela>
      <Pill
        x={540}
        y={1170}
        text="⏳ alguns sobrevivem até 5 dias"
        color={COR}
        size={44}
        k={P(f, T.cincoDias, T.cincoDias + 12)}
      />
      <Title
        f={f}
        at={T.ovulo}
        y={1270}
        size={40}
        font={SANS}
        weight={600}
        color={C.dim}
        from={OVO}
      >
        esperando o óvulo ser liberado
      </Title>
    </Part>
  );
};

// 4. mecanismo: o pico de LH e o bloqueio
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const raio = P(f, T.sinal, T.sinal + 50); // raio descendo
  const bloq = P(f, T.bloqueia, T.bloqueia + 14);
  const y0 = 470,
    y1 = 1020,
    yEsc = 790;
  const ponta = y0 + (y1 - y0) * raio;
  const yMax = bloq > 0 ? Math.min(ponta, yEsc - 70) : ponta;
  const zig = (a: number, b: number) => {
    const n = Math.max(1, Math.floor((b - a) / 40));
    return Array.from(
      { length: n + 1 },
      (_, i) => `${540 + (i % 2 ? 26 : -26)},${a + ((b - a) * i) / n}`,
    ).join(" ");
  };
  const desiste = P(f, T.semOvulo, T.semOvulo + 50);
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Emoji f={f} at={T.cerebro} x={540} y={370} size={150}>
        🧠
      </Emoji>
      <Tela>
        <g opacity={P(f, T.ovario - 20, T.ovario)}>
          <Ovario
            x={540}
            y={1130}
            s={1.1}
            f={f}
            fechado={P(f, T.naoAcontece, T.naoAcontece + 16)}
          />
          <text
            x={540}
            y={1290}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={600}
            fontSize={32}
            fill={C.dim}
          >
            ovário
          </text>
        </g>
        {f >= T.sinal && yMax > y0 + 5 && (
          <g
            style={{ filter: `drop-shadow(0 0 14px ${LH})` }}
            opacity={bloq > 0 ? 0.5 + 0.5 * Math.abs(Math.sin(f / 3)) : 1}
          >
            <polyline
              points={zig(y0, yMax)}
              fill="none"
              stroke={LH}
              strokeWidth={10}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        )}
        <g opacity={P(f, T.lh, T.lh + 10)}>
          <rect
            x={620}
            y={560}
            width={150}
            height={80}
            rx={40}
            fill={rgba(LH, 0.2)}
            stroke={LH}
            strokeWidth={4}
          />
          <text
            x={695}
            y={615}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={44}
            fill={LH}
          >
            LH
          </text>
        </g>
        {f >= T.age && (
          <g opacity={P(f, T.age, T.age + 12)}>
            <Comprimido x={240} y={yEsc} r={58} />
          </g>
        )}
        {bloq > 0 && (
          <g opacity={bloq}>
            <Escudo x={540} y={yEsc} s={0.9 + 0.1 * SNAP(bloq)} />
          </g>
        )}
        {bloq > 0 && (
          <text
            x={540}
            y={yEsc - 130}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={110}
            fill={VERM}
            opacity={P(f, T.bloqueia + 6, T.bloqueia + 16)}
            style={{ filter: `drop-shadow(0 0 14px ${VERM})` }}
            transform={`translate(240,40)`}
          >
            ✕
          </text>
        )}
        {/* espermatozoides ao lado do ovário, desistindo */}
        {f >= T.ovario &&
          Array.from({ length: 4 }, (_, i) => (
            <Esperma
              key={i}
              x={140 + i * 40 - desiste * 80}
              y={1050 + i * 34 + desiste * 40}
              f={f * (1 - desiste * 0.8)}
              i={i}
              rot={desiste * 70}
              o={1 - 0.7 * desiste}
            />
          ))}
      </Tela>
      <Pill
        x={540}
        y={1380}
        text="sinal bloqueado ou atrasado"
        color={ESC}
        size={40}
        k={P(f, T.bloqueia + 10, T.bloqueia + 22)}
      />
      <Title
        f={f}
        at={T.naoAcontece}
        y={1440}
        size={52}
        font={SANS}
        weight={800}
        color={C.ink}
        from={ESC}
      >
        a ovulação não acontece
      </Title>
      <Title
        f={f}
        at={T.semOvulo}
        y={1530}
        size={38}
        font={SANS}
        weight={600}
        color={C.dim}
        from={OVO}
      >
        sem óvulo, não há encontro
      </Title>
    </Part>
  );
};

// útero com embrião implantado
const Utero: React.FC<{ f: number; emb: number }> = ({ f, emb }) => (
  <g transform="translate(540,760)">
    <path
      d="M-300,-120 C-240,-170 -170,-120 -150,-90 C-120,-140 120,-140 150,-90 C170,-120 240,-170 300,-120"
      fill="none"
      stroke="#f9a8d4"
      strokeWidth={22}
      strokeLinecap="round"
      opacity={0.7}
    />
    <path
      d="M-160,-100 C-200,60 -90,230 0,250 C90,230 200,60 160,-100 C110,-140 -110,-140 -160,-100 Z"
      fill={rgba("#f9a8d4", 0.2)}
      stroke="#f9a8d4"
      strokeWidth={6}
    />
    <path
      d="M-110,-70 C-130,40 -60,170 0,190 C60,170 130,40 110,-70 C70,-100 -70,-100 -110,-70 Z"
      fill={rgba("#be185d", 0.25)}
    />
    {emb > 0 && (
      <g
        opacity={emb}
        transform={`translate(30,-20) scale(${0.6 + 0.4 * SNAP(Math.min(1, emb))})`}
      >
        <circle
          r={30 + Math.sin(f / 10) * 2}
          fill={OVO}
          style={{ filter: `drop-shadow(0 0 14px ${OVO})` }}
        />
        {[
          [-10, -8],
          [10, -6],
          [-4, 10],
          [12, 10],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill="#fbbf24" />
        ))}
      </g>
    )}
  </g>
);

// 5. mito 1: não é abortiva
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Mito f={f} at={T.naoAbortiva} texto="“a pílula é abortiva”" />
      <Tela>
        <g opacity={P(f, T.gravidez, T.gravidez + 14)}>
          <Utero f={f} emb={P(f, T.embriao, T.embriao + 16)} />
        </g>
        <text
          x={540}
          y={1070}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={600}
          fontSize={32}
          fill={C.dim}
          opacity={P(f, T.implantou, T.implantou + 12)}
        >
          embrião já implantado no útero
        </text>
      </Tela>
      <Item
        f={f}
        at={T.interrompe}
        y={1140}
        icone="🛡️"
        texto={
          <>
            <b style={{ color: VERDE }}>não interrompe</b> uma gravidez que já
            existe
          </>
        }
        cor={VERDE}
      />
      <Pill
        x={540}
        y={1380}
        text="ela age ANTES da ovulação"
        color={ESC}
        size={38}
        k={P(f, T.interrompe + 20, T.interrompe + 32)}
      />
    </Part>
  );
};

// 6. mito 2: funciona a qualquer hora
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 110,
    x1 = 970,
    by = 720;
  const enche = P(f, T.ate5, T.ate5 + 60);
  const hx = (h: number) => x0 + ((x1 - x0) * h) / 120;
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Mito f={f} at={R0(5) + 8} texto="“funciona a qualquer hora”" />
      <Tela>
        <defs>
          <linearGradient id="horas" x1="0" x2="1">
            <stop offset="0" stopColor={VERDE} />
            <stop offset="0.6" stopColor={LH} />
            <stop offset="1" stopColor={VERM} />
          </linearGradient>
        </defs>
        <g opacity={P(f, T.ate5 - 10, T.ate5)}>
          <rect
            x={x0}
            y={by - 40}
            width={x1 - x0}
            height={80}
            rx={40}
            fill="rgba(148,163,200,.1)"
            stroke="#475569"
            strokeWidth={3}
          />
          <clipPath id="ench">
            <rect
              x={x0}
              y={by - 40}
              width={(x1 - x0) * enche}
              height={80}
              rx={40}
            />
          </clipPath>
          <rect
            x={x0}
            y={by - 40}
            width={x1 - x0}
            height={80}
            rx={40}
            fill="url(#horas)"
            clipPath="url(#ench)"
          />
          {[0, 24, 48, 72, 96, 120].map((h) => (
            <g key={h}>
              <line
                x1={hx(h)}
                y1={by + 50}
                x2={hx(h)}
                y2={by + 66}
                stroke={C.dim}
                strokeWidth={3}
              />
              <text
                x={hx(h)}
                y={by + 106}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={h === 72 ? 900 : 700}
                fontSize={h === 72 ? 40 : 32}
                fill={h === 72 ? C.ink : C.dim}
              >
                {h}h
              </text>
            </g>
          ))}
          <text
            x={x1}
            y={by - 70}
            textAnchor="end"
            fontFamily={SANS}
            fontWeight={700}
            fontSize={32}
            fill={C.dim}
          >
            até 5 dias
          </text>
        </g>
        {f >= T.h72 && (
          <g opacity={P(f, T.h72, T.h72 + 12)}>
            <rect
              x={x0 - 8}
              y={by - 52}
              width={hx(72) - x0 + 16}
              height={104}
              rx={48}
              fill="none"
              stroke={VERDE}
              strokeWidth={6}
              style={{ filter: `drop-shadow(0 0 14px ${VERDE})` }}
            />
            <text
              x={(x0 + hx(72)) / 2}
              y={by - 74}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={800}
              fontSize={36}
              fill={VERDE}
            >
              eficácia maior
            </text>
          </g>
        )}
      </Tela>
      <Item
        f={f}
        at={T.ovulacaoJa}
        y={930}
        icone="🥚"
        texto={
          <>
            se a ovulação já aconteceu, ela funciona{" "}
            <b style={{ color: "#fca5a5" }}>bem menos</b>
          </>
        }
        cor={VERM}
      />
      <div
        style={{
          position: "absolute",
          top: 1180,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 80,
          color: C.ink,
          opacity: P(f, T.quantoAntes, T.quantoAntes + 12),
          transform: `scale(${0.8 + 0.2 * it(f, T.quantoAntes, T.quantoAntes + 14, 0, 1, SNAP)})`,
          textShadow: `0 0 30px ${rgba(VERDE, 0.5)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI }}>⏰</span> QUANTO ANTES,
        <br />
        <span style={{ color: VERDE }}>MELHOR</span>
      </div>
    </Part>
  );
};

// 7. mito 3: protege o mês todo
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 160,
    cy = 520,
    cs = 108;
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Mito f={f} at={R0(6) + 8} texto="“protege o resto do mês”" />
      <Tela>
        <g opacity={P(f, T.resto, T.resto + 14)}>
          <rect
            x={cx - 30}
            y={cy - 70}
            width={7 * cs + 60}
            height={5 * cs * 0.82 + 110}
            rx={30}
            fill={C.box}
            stroke={C.boxBorder}
            strokeWidth={2}
          />
          {Array.from({ length: 30 }, (_, i) => {
            const x = cx + (i % 7) * cs + cs / 2 - 30,
              y = cy + Math.floor(i / 7) * cs * 0.82 + 20;
            const dia = i === 11;
            const risca = dia
              ? 0
              : P(f, T.naoProtege + i * 0.6, T.naoProtege + i * 0.6 + 8);
            return (
              <g key={i}>
                <rect
                  x={x - 38}
                  y={y - 34}
                  width={76}
                  height={70}
                  rx={14}
                  fill={
                    dia && f >= T.soAquela
                      ? rgba(COR, 0.35)
                      : "rgba(148,163,200,.06)"
                  }
                  stroke={dia && f >= T.soAquela ? COR : "#334155"}
                  strokeWidth={dia ? 5 : 2}
                  style={
                    dia && f >= T.soAquela
                      ? { filter: `drop-shadow(0 0 12px ${COR})` }
                      : undefined
                  }
                />
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  fontFamily={SANS}
                  fontWeight={700}
                  fontSize={30}
                  fill={mix(C.ink, "#475569", risca)}
                >
                  {i + 1}
                </text>
                {risca > 0 && (
                  <line
                    x1={x - 24}
                    y1={y + 18}
                    x2={x - 24 + 48 * risca}
                    y2={y - 18}
                    stroke={VERM}
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={0.75}
                  />
                )}
              </g>
            );
          })}
        </g>
      </Tela>
      <Pill
        x={540}
        y={1020}
        text="vale só para AQUELA relação"
        color={COR}
        size={42}
        k={P(f, T.soAquela, T.soAquela + 12)}
      />
      <Tela>
        {f >= T.ists && (
          <g opacity={P(f, T.ists, T.ists + 12)}>
            <Escudo
              x={250}
              y={1220}
              s={0.95}
              cor={VERM}
              quebrado={it(f, T.ists + 8, T.ists + 30, 0, 1, OUT)}
            />
          </g>
        )}
      </Tela>
      <Card
        f={f}
        at={T.ists}
        x={380}
        y={1120}
        w={640}
        h={200}
        border={rgba(VERM, 0.6)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        <span>
          <b style={{ color: "#fca5a5" }}>não protege</b> contra infecções
          sexualmente transmissíveis (ISTs)
        </span>
      </Card>
    </Part>
  );
};

// 8. cuidados
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <div
        style={{
          position: "absolute",
          top: 230,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 66,
          color: C.ink,
          opacity: P(f, T.atenta - 4, T.atenta + 8),
          textShadow: `0 0 26px ${rgba(LH, 0.6)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI }}>⚠️</span> FIQUE ATENTA
      </div>
      <Item
        f={f}
        at={T.vomitar}
        y={420}
        icone="🤢"
        texto={
          <>
            vomitou até <b style={{ color: LH }}>3 horas</b> depois de tomar?
          </>
        }
        cor={LH}
      />
      <Item
        f={f}
        at={T.repetir - 30}
        y={600}
        icone="👩‍⚕️"
        texto={
          <>
            procure orientação: pode ser preciso{" "}
            <b style={{ color: LH }}>repetir a dose</b>
          </>
        }
        cor={LH}
        h={170}
      />
      <Item
        f={f}
        at={T.menstruacao}
        y={820}
        icone="📅"
        texto={
          <>
            é normal a próxima menstruação vir{" "}
            <b style={{ color: COR }}>um pouco antes ou depois</b>
          </>
        }
        cor={COR}
        h={170}
      />
    </Part>
  );
};

// 9. fechamento: método de emergência
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const selo = it(f, T.emergencia, T.emergencia + 14, 0, 1, SNAP);
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100}>
      <Tela>
        <g opacity={P(f, R0(8) + 6, R0(8) + 20)}>
          <Comprimido x={540} y={500} r={140} />
        </g>
        {f >= T.emergencia && (
          <g
            transform={`translate(540,700) rotate(-5) scale(${0.6 + 0.4 * selo})`}
            opacity={Math.min(1, selo * 1.4)}
          >
            <rect
              x={-280}
              y={-60}
              width={560}
              height={120}
              rx={60}
              fill={VERM}
              style={{ filter: `drop-shadow(0 0 22px ${rgba(VERM, 0.8)})` }}
            />
            <text
              y={20}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={900}
              fontSize={60}
              letterSpacing={4}
              fill="#fff"
            >
              🚨 EMERGÊNCIA
            </text>
          </g>
        )}
      </Tela>
      <Pill
        x={540}
        y={300}
        text="levonorgestrel • Postinor Uno"
        color={COR}
        size={40}
        k={P(f, T.postinor2 - 30, T.postinor2 - 18)}
      />
      <Title
        f={f}
        at={T.rotina}
        y={830}
        size={46}
        font={SANS}
        weight={700}
        color={C.ink}
        from={VERM}
      >
        <span style={{ color: "#fca5a5" }}>não</span> é anticoncepcional de
        rotina
      </Title>
      <Card
        f={f}
        at={T.proteger}
        x={60}
        y={980}
        w={960}
        h={250}
        border={rgba(VERDE, 0.7)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 36px",
          boxShadow: `0 0 30px ${rgba(VERDE, 0.2)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 84 }}>🗓️</span>
        <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 2,
              color: VERDE,
            }}
          >
            PARA TODOS OS DIAS
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 44,
              lineHeight: 1.2,
              opacity: P(f, T.profissional - 10, T.profissional + 4),
            }}
          >
            converse com um profissional sobre o método ideal para você
          </span>
        </span>
      </Card>
    </Part>
  );
};

// 10. me siga
const S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(9)[0]} to={R(9)[1]} inY={100}>
      <Emoji f={f} at={T.siga - 4} x={540} y={600} size={170}>
        👩‍⚕️
      </Emoji>
      <Card
        f={f}
        at={T.siga}
        x={110}
        y={760}
        w={860}
        h={300}
        border={rgba(COR, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          textAlign: "center",
          padding: "0 40px",
          boxShadow: `0 0 34px ${rgba(COR, 0.25)}`,
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 84,
            color: bornColor(f, T.siga, C.ink, COR),
          }}
        >
          Me siga
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.3,
          }}
        >
          para mais dicas de farmacologia e curiosidades sobre a área
        </span>
      </Card>
    </Part>
  );
};

// 11. mensagem final
const S11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(10)[0]} to={R(10)[1]} inY={100} outDur={1}>
      {MENSAGEM_FINAL.map((l, i) => {
        const at = T.final + 4 + i * 8;
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
                  ? bornColor(f, at, COR, "#fdf2f8", 20)
                  : bornColor(f, at, C.ink, COR),
              textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none",
              opacity: k,
              transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, DURATION, 0, 1, (x) => x)})`,
              filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
            }}
          >
            {l}
          </div>
        );
      })}
    </Part>
  );
};

export const VideoPilula: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R0(3) && f < R0(4)
      ? ESC
      : (f >= R0(4) + 8 && f < R0(4) + 60) ||
          (f >= R0(5) + 8 && f < R0(5) + 60) ||
          (f >= R0(6) + 8 && f < R0(6) + 60)
        ? VERM
        : f >= R0(7) && f < R0(8)
          ? LH
          : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[
          T.abortiva,
          T.levo,
          T.bloqueia,
          T.naoAbortiva,
          T.h72,
          T.naoProtege,
          T.emergencia,
          T.final,
        ]}
      />
      <S1 />
      <S2 />
      <S3 />
      <S4 />
      <S5 />
      <S6 />
      <S7 />
      <S8 />
      <S9 />
      <S10 />
      <S11 />
      <Grain />
      <Audio src={staticFile("pilula/narracao_usuaria2.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio
        src={staticFile("pilula/musica_leve.wav")}
        volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
