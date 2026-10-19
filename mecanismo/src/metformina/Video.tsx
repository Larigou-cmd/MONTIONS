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
  W,
  bornColor,
  it,
  mix,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";

// "O médico passou metformina e começou a diarreia?" no modelo "aula elegante" (série "Começou a tomar X e sentiu Y?").
// Narração: Juliana (ElevenLabs, eleven_v4, sem tags). Tempos: audio/metformina_palavras.json (quadro = segundos × 30).
const COR = "#2dd4bf"; // metformina
const VERDE = "#4ade80",
  VERM = "#ef4444",
  ROSA = "#f9a8d4",
  AZUL = "#7dd3fc",
  AMAR = "#fbbf24";

// TEMPOS
const T = {
  diarreia: 98,
  calma: 125,
  comum: 175,
  explicacao: 211,
  metformina: 242,
  mundo: 322,
  diabetes: 337,
  acucar: 425,
  intestino: 463,
  passa: 522,
  absorvida: 602,
  mexe: 649,
  bile: 701,
  serotonina: 734,
  bacterias: 792,
  agua: 881,
  gases: 914,
  enjoo: 931,
  diarreia2: 953,
  boa: 979,
  comeco: 1088,
  leve: 1130,
  melhorando: 1152,
  acostuma: 1213,
  coisas: 1238,
  primeiro: 1291,
  refeicao: 1339,
  segundo: 1399,
  aumentando: 1471,
  terceiro: 1548,
  xr: 1649,
  menos: 1711,
  agora: 1742,
  naoPare: 1793,
  fale: 1860,
  ajustar: 1958,
  horario: 1973,
  dose: 1997,
  versao: 2018,
  alerta: 2062,
  forte: 2098,
  naoPassar: 2117,
  muitoTempo: 2174,
  procure: 2234,
  outraCausa: 2290,
  entao: 2359,
  comum2: 2471,
  melhorar: 2498,
  ajudar: 2531,
  siga: 2551,
  final: 2680,
};
export const DURATION = 2770; // 92,3 s (narração de 88,9 s + mensagem final)
const PARTES: [number, number][] = [
  [0, 248],
  [242, 469],
  [463, 985],
  [979, 1244],
  [1238, 1748],
  [1742, 2068],
  [2062, 2365],
  [2359, 2557],
  [2551, 2684],
  [2678, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  [T.diarreia, "trava", 0.35],
  [T.calma, "pop", 0.22],
  [R(1)[0], "whoosh", 0.3],
  [T.diabetes, "pop", 0.22],
  [T.acucar, "plim", 0.22],
  [R(2)[0], "whoosh", 0.3],
  [T.bile, "pop", 0.22],
  [T.serotonina, "pop", 0.22],
  [T.bacterias, "pop", 0.22],
  [T.diarreia2, "trava", 0.32],
  [R(3)[0], "whoosh", 0.3],
  [T.comeco, "pop", 0.2],
  [T.acostuma, "plim", 0.25],
  [R(4)[0], "whoosh", 0.3],
  [T.primeiro, "pop", 0.22],
  [T.segundo, "pop", 0.22],
  [T.terceiro, "pop", 0.22],
  [T.menos, "plim", 0.25],
  [R(5)[0], "whoosh", 0.3],
  [T.naoPare, "trava", 0.38],
  [T.fale, "pop", 0.22],
  [R(6)[0], "whoosh", 0.3],
  [T.forte, "pop", 0.22],
  [T.naoPassar, "pop", 0.22],
  [T.muitoTempo, "pop", 0.22],
  [T.procure, "trava", 0.32],
  [R(7)[0], "whoosh", 0.3],
  [T.comum2, "pop", 0.22],
  [T.melhorar, "pop", 0.22],
  [T.ajudar, "plim", 0.25],
  [R(8)[0], "whoosh", 0.3],
  [R(9)[0], "whoosh", 0.3],
  [T.final, "plim", 0.3],
];
const MENSAGEM_FINAL = [
  "Consulte um",
  "profissional de saúde",
  "para orientações.",
];

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
}> = ({ f, at, y, icone, texto, cor = COR, h = 140 }) => (
  <Card
    f={f}
    at={at}
    x={60}
    y={y}
    w={960}
    h={h}
    border={rgba(cor, 0.6)}
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
        color: bornColor(f, at, C.ink, cor),
      }}
    >
      {texto}
    </span>
  </Card>
);
// caixa de remédio sem marca
export const Caixa: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-210}
      y={-150}
      width={420}
      height={300}
      rx={22}
      fill="#f8fafc"
      stroke={COR}
      strokeWidth={8}
      style={{ filter: `drop-shadow(0 0 30px ${rgba(COR, 0.7)})` }}
    />
    <rect x={-210} y={-150} width={420} height={70} rx={22} fill={COR} />
    <rect x={-210} y={-100} width={420} height={20} fill={COR} />
    <text
      x={0}
      y={-102}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={900}
      fontSize={40}
      fill="#0f172a"
    >
      METFORMINA
    </text>
    <text
      x={0}
      y={-6}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={800}
      fontSize={44}
      fill="#334155"
    >
      500 mg
    </text>
    <text
      x={0}
      y={44}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={600}
      fontSize={28}
      fill="#64748b"
    >
      comprimidos • uso oral
    </text>
    <rect
      x={-150}
      y={84}
      width={300}
      height={34}
      rx={17}
      fill={rgba(COR, 0.25)}
    />
  </g>
);
// comprimido redondo
const Comp: React.FC<{ x: number; y: number; r?: number }> = ({
  x,
  y,
  r = 20,
}) => (
  <g>
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="#f8fafc"
      style={{ filter: `drop-shadow(0 0 8px ${rgba(COR, 0.8)})` }}
    />
    <line
      x1={x - r * 0.6}
      y1={y}
      x2={x + r * 0.6}
      y2={y}
      stroke="#cbd5e1"
      strokeWidth={3}
    />
  </g>
);

// intestino em serpentina: 3 faixas ligadas por curvas
const SX0 = 170,
  SX1 = 910,
  SY0 = 520,
  SG = 150,
  SR = SG / 2;
const SL = SX1 - SX0;
const SNAKE_LEN = 3 * SL + 2 * Math.PI * SR;
const noIntestino = (s: number): [number, number] => {
  const arc = Math.PI * SR;
  const seg = [SL, arc, SL, arc, SL];
  let i = 0;
  let r = ((s % SNAKE_LEN) + SNAKE_LEN) % SNAKE_LEN;
  while (i < seg.length - 1 && r > seg[i]) {
    r -= seg[i];
    i++;
  }
  const yRow = (n: number) => SY0 + n * SG;
  if (i === 0) return [SX0 + r, yRow(0)];
  if (i === 2) return [SX1 - r, yRow(1)];
  if (i === 4) return [SX0 + r, yRow(2)];
  const a = r / SR; // ângulo percorrido na curva
  if (i === 1) return [SX1 + Math.sin(a) * SR, yRow(0) + SR - Math.cos(a) * SR];
  return [SX0 - Math.sin(a) * SR, yRow(1) + SR - Math.cos(a) * SR];
};
const SNAKE_D = `M${SX0},${SY0} H${SX1} A${SR},${SR} 0 0,1 ${SX1},${SY0 + SG} H${SX0} A${SR},${SR} 0 0,0 ${SX0},${SY0 + 2 * SG} H${SX1}`;

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const treme =
    f >= T.diarreia && f < T.diarreia + 24
      ? Math.sin(f * 2.4) * 8 * (1 - (f - T.diarreia) / 24)
      : 0;
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
          fontSize: 80,
          lineHeight: 1.08,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        COMEÇOU A TOMAR
        <br />
        <span style={{ color: COR }}>METFORMINA?</span>
      </div>
      <Tela>
        <g opacity={P(f, 6, 18)} transform={`translate(${treme},0)`}>
          <Caixa x={420} y={720} s={0.95} rot={-5} />
        </g>
      </Tela>
      <Emoji f={f} at={T.diarreia} x={850} y={640} size={170}>
        🚽
      </Emoji>
      <Emoji f={f} at={T.diarreia + 6} x={760} y={480} size={100}>
        ⚡
      </Emoji>
      <Title
        f={f}
        at={T.diarreia}
        y={940}
        size={56}
        weight={600}
        color={C.ink}
        from={COR}
      >
        …e começou a diarreia?
      </Title>
      <Pill
        x={540}
        y={1110}
        text="😌 calma: é muito comum"
        color={COR}
        size={38}
        k={P(f, T.calma, T.calma + 12)}
      />
      <Pill
        x={540}
        y={1210}
        text="✨ e tem explicação"
        color={AMAR}
        size={36}
        k={P(f, T.explicacao, T.explicacao + 12)}
      />
    </Part>
  );
};

// 2. o que é a metformina
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const baixa = it(f, T.acucar, T.acucar + 40, 0, 1, OUT);
  const cubos: [number, number][] = [
    [490, 820],
    [580, 800],
    [450, 900],
    [540, 900],
    [630, 890],
    [500, 980],
    [590, 975],
    [545, 735],
  ];
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title f={f} at={T.metformina} y={210} size={74} weight={600} from={COR}>
        Metformina
      </Title>
      <Pill
        x={540}
        y={340}
        text="🌎 um dos remédios mais usados no mundo"
        color={COR}
        size={32}
        k={P(f, T.mundo, T.mundo + 12)}
      />
      <Tela>
        <g opacity={P(f, T.diabetes - 4, T.diabetes + 10)}>
          <path
            d="M540,560 C540,560 380,760 380,870 A160,160 0 0,0 700,870 C700,760 540,560 540,560 Z"
            fill={rgba(VERM, 0.28)}
            stroke={VERM}
            strokeWidth={6}
            style={{ filter: `drop-shadow(0 0 22px ${rgba(VERM, 0.6)})` }}
          />
          {cubos.map(([x, y], i) => {
            const some = i >= 3 ? baixa : 0; // 5 cubinhos saem, 3 ficam
            return (
              <rect
                key={i}
                x={x - 22}
                y={y - 22 - some * 40}
                width={44}
                height={44}
                rx={6}
                fill="#f8fafc"
                opacity={1 - some}
                transform={`rotate(${((i * 23) % 30) - 15},${x},${y})`}
              />
            );
          })}
        </g>
      </Tela>
      <Pill
        x={540}
        y={1110}
        text="🩸 diabetes tipo 2"
        color={VERM}
        size={38}
        k={P(f, T.diabetes, T.diabetes + 12)}
      />
      <Title
        f={f}
        at={T.acucar}
        y={1190}
        size={50}
        weight={600}
        color={C.ink}
        from={COR}
      >
        ajuda a controlar o açúcar no sangue
      </Title>
    </Part>
  );
};

// 3. por que dá diarreia
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const anda = Math.max(0, f - T.passa) * 4.2;
  const gotas = it(f, T.agua, T.agua + 50, 0, 1, OUT);
  const hip: [string, string, string, number][] = [
    ["💧", "bile", AMAR, T.bile],
    ["⚡", "serotonina", "#c084fc", T.serotonina],
    ["🦠", "bactérias", VERDE, T.bacterias],
  ];
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.intestino} y={210} size={66} weight={600} from={COR}>
        E o intestino? <span style={{ fontFamily: EMOJI }}>🤔</span>
      </Title>
      <Tela>
        <g opacity={P(f, T.intestino + 10, T.intestino + 26)}>
          <path
            d={SNAKE_D}
            fill="none"
            stroke={rgba(ROSA, 0.3)}
            strokeWidth={104}
            strokeLinecap="round"
          />
          <path
            d={SNAKE_D}
            fill="none"
            stroke={rgba(ROSA, 0.7)}
            strokeWidth={4}
            strokeDasharray="10 16"
          />
        </g>
        {f >= T.passa &&
          [0, 1, 2, 3, 4].map((i) => {
            const s = anda - i * 150;
            if (s < 0) return null;
            const [x, y] = noIntestino(s);
            return <Comp key={i} x={x} y={y} r={22} />;
          })}
        {f >= T.agua &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const [x, y] = noIntestino(240 + i * 300);
            const yy = y - 140 * (1 - gotas);
            return (
              <path
                key={i}
                d={`M${x},${yy - 22} C${x},${yy - 22} ${x - 14},${yy - 2} ${x - 14},${yy + 6} A14,14 0 0,0 ${x + 14},${yy + 6} C${x + 14},${yy - 2} ${x},${yy - 22} ${x},${yy - 22} Z`}
                fill={AZUL}
                opacity={gotas}
                style={{ filter: `drop-shadow(0 0 8px ${AZUL})` }}
              />
            );
          })}
      </Tela>
      <Pill
        x={540}
        y={360}
        text="⏳ passa um tempo no intestino"
        color={ROSA}
        size={32}
        k={P(f, T.passa, T.passa + 12)}
      />
      <div
        style={{
          position: "absolute",
          top: 930,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 28,
          color: C.dim,
          opacity: P(f, T.mexe, T.mexe + 12),
        }}
      >
        lá, ela mexe com… (mecanismos ainda em estudo)
      </div>
      {hip.map(([e, txt, c, at], i) => (
        <Card
          key={txt}
          f={f}
          at={at}
          x={90 + i * 310}
          y={990}
          w={280}
          h={170}
          tilt={[-1.5, 0.8, -0.6][i]}
          border={rgba(c, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 64 }}>{e}</span>
          <span style={{ fontWeight: 800, fontSize: 32, color: c }}>{txt}</span>
        </Card>
      ))}
      <Pill
        x={300}
        y={1250}
        text="💧 mais água"
        color={AZUL}
        size={32}
        k={P(f, T.agua, T.agua + 10)}
      />
      <Pill
        x={780}
        y={1250}
        text="💨 gases"
        color={C.dim}
        size={32}
        k={P(f, T.gases, T.gases + 10)}
      />
      <Pill
        x={300}
        y={1340}
        text="🤢 enjoo"
        color={VERDE}
        size={32}
        k={P(f, T.enjoo, T.enjoo + 10)}
      />
      <Pill
        x={780}
        y={1340}
        text="🚽 diarreia"
        color={VERM}
        size={32}
        k={P(f, T.diarreia2, T.diarreia2 + 10)}
      />
    </Part>
  );
};

// 4. a boa notícia
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const alturas = [380, 250, 140, 60];
  const base = 900;
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.boa} y={210} size={66} weight={600} from={VERDE}>
        A boa notícia <span style={{ fontFamily: EMOJI }}>🎉</span>
      </Title>
      <Tela>
        <g opacity={P(f, T.boa + 20, T.boa + 34)}>
          <line
            x1={160}
            y1={base}
            x2={940}
            y2={base}
            stroke={C.dim}
            strokeWidth={4}
          />
          <text
            x={160}
            y={430}
            fontFamily={SANS}
            fontWeight={700}
            fontSize={28}
            fill={C.dim}
          >
            desconforto (ilustração)
          </text>
        </g>
        {alturas.map((h, i) => {
          const at = T.comeco + i * 18;
          const k = it(f, at, at + 20, 0, 1, OUT);
          const cor = mix(VERM, VERDE, i / 3);
          const x = 200 + i * 190;
          return (
            <g key={i} opacity={Math.min(1, k * 1.5)}>
              <rect
                x={x}
                y={base - h * k}
                width={130}
                height={h * k}
                rx={14}
                fill={cor}
                fillOpacity={0.85}
                style={{ filter: `drop-shadow(0 0 14px ${cor})` }}
              />
              <text
                x={x + 65}
                y={base + 50}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={700}
                fontSize={30}
                fill={C.ink}
              >
                semana {i + 1}
              </text>
            </g>
          );
        })}
      </Tela>
      <Pill
        x={540}
        y={1030}
        text="📍 aparece no começo do tratamento"
        color={AMAR}
        size={32}
        k={P(f, T.comeco, T.comeco + 12)}
      />
      <Pill
        x={540}
        y={1115}
        text="🌤️ costuma ser leve"
        color={VERDE}
        size={32}
        k={P(f, T.leve, T.leve + 12)}
      />
      <Pill
        x={540}
        y={1200}
        text="📉 melhora com o tempo"
        color={VERDE}
        size={32}
        k={P(f, T.melhorando, T.melhorando + 12)}
      />
      <Title
        f={f}
        at={T.acostuma}
        y={1270}
        size={50}
        weight={600}
        color={C.ink}
        from={VERDE}
      >
        o corpo se acostuma <span style={{ fontFamily: EMOJI }}>💪</span>
      </Title>
    </Part>
  );
};

// 5. o que ajuda
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const solto = (vel: number) =>
    Math.min(12, Math.max(0, (f - T.xr - 10) * vel));
  const nuvem = (cx: number, n: number) =>
    Array.from({ length: Math.floor(n) }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + 0.3;
      const d = 70 + (i % 3) * 30;
      return (
        <circle
          key={i}
          cx={cx + Math.cos(a) * d}
          cy={1000 + Math.sin(a) * d * 0.6}
          r={11}
          fill={COR}
          opacity={0.85}
        />
      );
    });
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.coisas} y={200} size={62} weight={600} from={COR}>
        O que ajuda <span style={{ fontFamily: EMOJI }}>✅</span>
      </Title>
      <Item
        f={f}
        at={T.primeiro}
        y={310}
        icone="🍽️"
        texto={
          <>
            tomar <b style={{ color: COR }}>junto com a refeição</b> (ou logo
            depois)
          </>
        }
      />
      <Item
        f={f}
        at={T.segundo}
        y={470}
        icone="📈"
        texto={
          <>
            começar com <b style={{ color: COR }}>dose baixa</b> e aumentar aos
            poucos, como o médico orientar
          </>
        }
        h={160}
      />
      <Item
        f={f}
        at={T.terceiro}
        y={650}
        icone="🐢"
        texto={
          <>
            versão <b style={{ color: COR }}>XR</b> (liberação prolongada)
          </>
        }
      />
      {f >= T.xr - 4 && (
        <>
          <Tela>
            <g opacity={P(f, T.xr - 4, T.xr + 8)}>
              {nuvem(300, solto(1.2))}
              {nuvem(780, solto(0.1))}
              <circle cx={300} cy={1000} r={46} fill="#f8fafc" />
              <circle cx={780} cy={1000} r={46} fill="#f8fafc" />
              <circle
                cx={780}
                cy={1000}
                r={56}
                fill="none"
                stroke={COR}
                strokeWidth={6}
              />
            </g>
          </Tela>
          <div
            style={{
              position: "absolute",
              top: 1120,
              width: W,
              display: "flex",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 32,
              color: C.ink,
              opacity: P(f, T.xr, T.xr + 12),
            }}
          >
            <div style={{ width: 540, textAlign: "center" }}>
              comum: libera <span style={{ color: VERM }}>tudo de uma vez</span>
            </div>
            <div style={{ width: 540, textAlign: "center" }}>
              XR: libera <span style={{ color: VERDE }}>devagar</span>
            </div>
          </div>
        </>
      )}
      <Pill
        x={540}
        y={1250}
        text="🐢 XR = bem menos diarreia"
        color={VERDE}
        size={38}
        k={P(f, T.menos, T.menos + 12)}
      />
    </Part>
  );
};

// 6. não pare por conta própria
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Title f={f} at={T.agora} y={200} size={66} weight={600} from={AMAR}>
        Atenção <span style={{ fontFamily: EMOJI }}>⚠️</span>
      </Title>
      <Item
        f={f}
        at={T.naoPare}
        y={330}
        icone="❌"
        cor={VERM}
        texto={
          <>
            <b style={{ color: VERM }}>NÃO</b> pare o remédio por conta própria
          </>
        }
        h={170}
      />
      <Item
        f={f}
        at={T.fale}
        y={540}
        icone="👩‍⚕️"
        cor={VERDE}
        texto={
          <>
            fale com o <b style={{ color: VERDE }}>médico ou farmacêutico</b>
          </>
        }
        h={170}
      />
      <Title
        f={f}
        at={T.ajustar}
        y={800}
        size={46}
        font={SANS}
        weight={600}
        color={C.ink}
        from={COR}
      >
        muitas vezes, só ajustar já resolve:
      </Title>
      <Pill
        x={260}
        y={960}
        text="⏰ horário"
        color={COR}
        size={36}
        k={P(f, T.horario, T.horario + 10)}
      />
      <Pill
        x={540}
        y={960}
        text="💊 dose"
        color={COR}
        size={36}
        k={P(f, T.dose, T.dose + 10)}
      />
      <Pill
        x={820}
        y={960}
        text="🐢 versão"
        color={COR}
        size={36}
        k={P(f, T.versao, T.versao + 10)}
      />
    </Part>
  );
};

// 7. sinais de alerta
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Emoji f={f} at={T.alerta} x={540} y={300} size={150}>
        ⚠️
      </Emoji>
      <Title
        f={f}
        at={T.alerta + 6}
        y={410}
        size={52}
        weight={600}
        color={C.ink}
        from={VERM}
      >
        Procure atendimento se a diarreia:
      </Title>
      <Item
        f={f}
        at={T.forte}
        y={560}
        icone="💥"
        cor={VERM}
        texto="for muito forte"
      />
      <Item
        f={f}
        at={T.naoPassar}
        y={720}
        icone="⏳"
        cor={VERM}
        texto="não passar"
      />
      <Item
        f={f}
        at={T.muitoTempo}
        y={880}
        icone="📅"
        cor={VERM}
        texto="começar depois de meses ou anos tomando sem problema"
        h={160}
      />
      <Pill
        x={540}
        y={1140}
        text="🏥 procure atendimento"
        color={VERM}
        size={40}
        k={P(f, T.procure, T.procure + 12)}
      />
      <Title
        f={f}
        at={T.outraCausa}
        y={1220}
        size={44}
        font={SANS}
        weight={600}
        color={C.dim}
        from={VERM}
      >
        pode ser outra causa e precisa ser avaliado
      </Title>
    </Part>
  );
};

// 8. fechamento
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const selos: [string, number][] = [
    ["✔ é comum", T.comum2],
    ["✔ costuma melhorar", T.melhorar],
    ["✔ tem como ajudar", T.ajudar],
  ];
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Emoji f={f} at={T.entao} x={540} y={400} size={170}>
        😌
      </Emoji>
      <Title
        f={f}
        at={T.entao + 6}
        y={540}
        size={56}
        weight={600}
        color={C.ink}
        from={COR}
      >
        Metformina soltou o intestino no começo?
      </Title>
      {selos.map(([txt, at], i) => (
        <Pill
          key={txt}
          x={540}
          y={790 + i * 100}
          text={txt}
          color={VERDE}
          size={42}
          k={P(f, at, at + 10)}
        />
      ))}
    </Part>
  );
};

// 9. me siga
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100}>
      <Card
        f={f}
        at={T.siga}
        x={110}
        y={700}
        w={860}
        h={300}
        border={rgba(COR, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          textAlign: "center",
          boxShadow: `0 0 34px ${rgba(COR, 0.25)}`,
        }}
      >
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 78 }}>
          <span style={{ fontFamily: EMOJI }}>👩‍⚕️</span> Me siga
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34 }}>
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área
        </span>
      </Card>
    </Part>
  );
};

// 10. mensagem final
const S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(9)[0]} to={R(9)[1]} inY={100} outDur={1}>
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
                  ? bornColor(f, at, COR, "#f0fdfa", 20)
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

export const VideoMetformina: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(3)[0] && f < R(4)[0]
      ? VERDE
      : f >= R(6)[0] && f < R(7)[0]
        ? VERM
        : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[
          T.diarreia,
          T.diarreia2,
          T.boa,
          T.xr,
          T.naoPare,
          T.alerta,
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
      <Grain />
      <Audio src={staticFile("metformina/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio
        src={staticFile("metformina/musica.wav")}
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
