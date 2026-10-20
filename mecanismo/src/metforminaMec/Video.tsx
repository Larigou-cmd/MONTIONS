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
  EASE,
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

// "Como a metformina age: do corpo à molécula" no modelo "aula elegante", com zoom contínuo
// corpo → fígado → célula → mitocôndria. Narração gravada pela Larissa (ElevenLabs, Juliana).
// Tempos: audio/metforminaMec_palavras.json (texto do roteiro alinhado às pausas da narração; quadro = segundos × 30).
const COR = "#2dd4bf"; // metformina
const VERDE = "#4ade80",
  VERM = "#ef4444",
  AMAR = "#fbbf24",
  FIGADO = "#c2410c",
  MITO = "#fb923c",
  ROXO = "#a78bfa",
  ROSA = "#f9a8d4";

// TEMPOS
const T = {
  corpo: 115,
  vem: 136,
  molecula: 205,
  diabetes: 237,
  insulina: 317,
  responde: 351,
  detalhe: 414,
  figado: 474,
  soltando: 501,
  precisa: 576,
  justamente: 601,
  metformina: 659,
  forca: 715,
  noFigado: 740,
  dentro: 762,
  celula: 784,
  mitocondria: 830,
  usina: 860,
  freada: 919,
  sente: 947,
  energiaBaixa: 969,
  sensor: 1000,
  ampk: 1086,
  liga: 1114,
  desliga: 1156,
  fabrica: 1174,
  resultado: 1218,
  menos: 1273,
  outros: 1325,
  intestino: 1399,
  glp1: 1470,
  responder: 1511,
  repara: 1557,
  pancreas: 1614,
  sozinha: 1702,
  hipoglicemia: 1764,
  cientistas: 1808,
  mecanismo: 1891,
  certa: 1945,
  alimentacao: 2011,
  atividade: 2036,
  acompanhamento: 2087,
  siga: 2123,
  final: 2260,
};
export const DURATION = 2350; // 78,3 s (narração de 74,8 s + mensagem final)
const PARTES: [number, number][] = [
  [0, 243],
  [237, 607],
  [601, 768],
  [762, 1006],
  [1000, 1331],
  [1325, 1563],
  [1557, 1814],
  [1808, 2129],
  [2123, 2264],
  [2258, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  [T.corpo, "pop", 0.2],
  [R(1)[0], "whoosh", 0.3],
  [T.figado, "pop", 0.22],
  [T.precisa, "trava", 0.3],
  [R(2)[0], "whoosh", 0.3],
  [T.justamente + 20, "whoosh", 0.35],
  [T.noFigado, "plim", 0.22],
  [R(3)[0], "whoosh", 0.3],
  [T.mitocondria, "whoosh", 0.3],
  [T.freada, "trava", 0.35],
  [T.energiaBaixa, "pop", 0.22],
  [R(4)[0], "whoosh", 0.3],
  [T.ampk, "plim", 0.28],
  [T.desliga, "trava", 0.35],
  [T.menos, "plim", 0.25],
  [R(5)[0], "whoosh", 0.3],
  [T.glp1, "pop", 0.22],
  [T.responder, "pop", 0.22],
  [R(6)[0], "whoosh", 0.3],
  [T.pancreas, "pop", 0.22],
  [T.hipoglicemia, "plim", 0.25],
  [R(7)[0], "whoosh", 0.3],
  [T.alimentacao, "pop", 0.2],
  [T.atividade, "pop", 0.2],
  [T.acompanhamento, "pop", 0.2],
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
// molécula de glicose (hexágono)
const Glicose: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({
  x,
  y,
  r = 14,
  o = 1,
}) => (
  <polygon
    points={Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
    }).join(" ")}
    fill={AMAR}
    opacity={o}
    style={{ filter: `drop-shadow(0 0 6px ${AMAR})` }}
  />
);
// comprimido de metformina
const Comp: React.FC<{ x: number; y: number; r?: number }> = ({
  x,
  y,
  r = 18,
}) => (
  <g>
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="#f8fafc"
      style={{ filter: `drop-shadow(0 0 10px ${COR})` }}
    />
    <line
      x1={x - r * 0.6}
      y1={y}
      x2={x + r * 0.6}
      y2={y}
      stroke="#94a3b8"
      strokeWidth={3}
    />
  </g>
);
// medidor de glicose no sangue (barra vertical)
const Medidor: React.FC<{ x: number; y: number; nivel: number; k: number }> = ({
  x,
  y,
  nivel,
  k,
}) =>
  k <= 0 ? null : (
    <g opacity={k}>
      <rect
        x={x}
        y={y}
        width={56}
        height={300}
        rx={28}
        fill="none"
        stroke={C.dim}
        strokeWidth={5}
      />
      <rect
        x={x + 9}
        y={y + 9 + 282 * (1 - nivel)}
        width={38}
        height={282 * nivel}
        rx={19}
        fill={mix(VERDE, VERM, nivel)}
        style={{ filter: `drop-shadow(0 0 12px ${mix(VERDE, VERM, nivel)})` }}
      />
      <text
        x={x + 28}
        y={y + 350}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={26}
        fill={C.ink}
      >
        glicose
      </text>
    </g>
  );

// ---------- mundo 1: o corpo (cenas 1 a 3, com zoom no fígado) ----------
const LX = 470,
  LY = 760; // centro do fígado no corpo
const Corpo: React.FC<{ f: number }> = ({ f }) => {
  if (f > R(2)[1]) return null;
  const z = it(f, T.justamente + 10, T.justamente + 110, 0, 1, EASE);
  const s = 1 + z * 9;
  const sai = 1 - P(f, T.justamente + 95, T.justamente + 112);
  const fluxo = (f * 3) % 400;
  const figadoBrilha = P(f, T.figado, T.figado + 14);
  // sem zoom, o corpo fica onde foi desenhado; com zoom, o fígado vai para o centro da tela
  const fx = 540 + (LX - 540) * z,
    fy = 760 + (LY - 760) * z,
    sy = 760 + 100 * z;
  return (
    <Tela>
      <g
        opacity={P(f, 4, 20) * sai}
        transform={`translate(${540 - fx * s},${sy - fy * s}) scale(${s})`}
      >
        {/* silhueta */}
        <g
          fill={rgba(COR, 0.08)}
          stroke={COR}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 18px ${rgba(COR, 0.6)})` }}
        >
          <circle cx={540} cy={470} r={72} />
          <path d="M 400 600 Q 540 560 680 600 L 700 1010 Q 540 1050 380 1010 Z" />
          <path d="M 404 612 L 300 900" fill="none" strokeWidth={34} />
          <path d="M 676 612 L 780 900" fill="none" strokeWidth={34} />
          <path d="M 470 1020 L 455 1320" fill="none" strokeWidth={40} />
          <path d="M 610 1020 L 625 1320" fill="none" strokeWidth={40} />
        </g>
        {/* vaso principal com glicose correndo */}
        <line
          x1={590}
          y1={600}
          x2={590}
          y2={1000}
          stroke={rgba(VERM, 0.6)}
          strokeWidth={10}
          strokeLinecap="round"
        />
        {f >= T.diabetes &&
          [0, 1, 2, 3].map((i) => {
            const y = 600 + ((fluxo + i * 100) % 400);
            return <Glicose key={i} x={590} y={y} r={10} />;
          })}
        {/* fígado */}
        <path
          d={`M ${LX - 90} ${LY - 10} Q ${LX - 70} ${LY - 60} ${LX + 30} ${LY - 50} Q ${LX + 110} ${LY - 40} ${LX + 90} ${LY + 10} Q ${LX + 20} ${LY + 50} ${LX - 60} ${LY + 35} Q ${LX - 100} ${LY + 20} ${LX - 90} ${LY - 10} Z`}
          fill={mix("#7c2d12", FIGADO, figadoBrilha)}
          stroke="#fdba74"
          strokeWidth={3}
          opacity={0.6 + 0.4 * P(f, 10, 30)}
          style={{
            filter:
              figadoBrilha > 0
                ? `drop-shadow(0 0 ${20 * figadoBrilha}px ${FIGADO})`
                : undefined,
          }}
        />
        {/* fígado soltando glicose */}
        {f >= T.soltando &&
          [0, 1, 2, 3, 4].map((i) => {
            const t = ((f - T.soltando) * 0.02 + i * 0.2) % 1;
            return (
              <Glicose
                key={i}
                x={LX + 60 + t * 60}
                y={LY - 20 - t * 40 + i * 6}
                r={9}
                o={1 - t}
              />
            );
          })}
        {/* o comprimido descendo até o estômago */}
        {f < T.diabetes + 20 &&
          (() => {
            const k = it(f, 30, 110, 0, 1, EASE);
            return <Comp x={540} y={520 + k * 280} r={16} />;
          })()}
      </g>
    </Tela>
  );
};

// ---------- mundo 2: a célula do fígado (cenas 3 e 4, com zoom na mitocôndria) ----------
const MX = 700,
  MY = 980; // mitocôndria escolhida para o zoom
const Celula: React.FC<{ f: number }> = ({ f }) => {
  const de = T.justamente + 96;
  if (f < de || f > R(3)[1]) return null;
  const entra = it(f, de, de + 22, 0, 1, OUT);
  const z = it(f, T.mitocondria - 10, T.mitocondria + 40, 0, 1, EASE);
  const s = (0.7 + 0.3 * entra) * (1 + z * 5);
  const sai = 1 - P(f, T.mitocondria + 30, T.mitocondria + 46);
  // o centro da câmera vai do meio da célula até a mitocôndria escolhida
  const cx = 540 + (MX - 540) * z,
    cy = 860 + (MY - 860) * z;
  const mitos: [number, number, number][] = [
    [380, 680, -20],
    [MX, MY, 15],
    [420, 1060, 30],
    [740, 640, -40],
  ];
  return (
    <Tela>
      <g
        opacity={Math.min(entra, sai)}
        transform={`translate(${540 - cx * s},${860 - cy * s}) scale(${s})`}
      >
        {/* hepatócito (célula poligonal) */}
        <polygon
          points="540,470 860,620 880,1000 600,1220 260,1080 220,700"
          fill={rgba(FIGADO, 0.16)}
          stroke="#fdba74"
          strokeWidth={6}
          style={{ filter: `drop-shadow(0 0 20px ${rgba(FIGADO, 0.6)})` }}
        />
        {/* núcleo */}
        <circle
          cx={520}
          cy={840}
          r={95}
          fill={rgba(ROXO, 0.3)}
          stroke={ROXO}
          strokeWidth={5}
        />
        <circle cx={540} cy={820} r={22} fill={rgba(ROXO, 0.6)} />
        {mitos.map(([x, y, a], i) => (
          <g key={i} transform={`rotate(${a},${x},${y})`}>
            <ellipse
              cx={x}
              cy={y}
              rx={70}
              ry={34}
              fill={rgba(MITO, 0.25)}
              stroke={MITO}
              strokeWidth={4}
            />
            <path
              d={`M ${x - 50} ${y} q 12 -22 24 0 q 12 22 24 0 q 12 -22 24 0 q 12 22 24 0`}
              fill="none"
              stroke={MITO}
              strokeWidth={3}
            />
          </g>
        ))}
        {/* comprimidos entrando na célula */}
        {f >= T.metformina &&
          [0, 1, 2].map((i) => {
            const k = it(
              f,
              T.noFigado - 20 + i * 8,
              T.noFigado + 30 + i * 8,
              0,
              1,
              OUT,
            );
            return k <= 0 ? null : (
              <Comp
                key={i}
                x={120 + k * (480 + i * 60)}
                y={760 + i * 70 + k * 40}
                r={14}
              />
            );
          })}
      </g>
    </Tela>
  );
};

// ---------- 1. gancho ----------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <div
        style={{
          position: "absolute",
          top: 190,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 74,
          lineHeight: 1.08,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        O QUE A <span style={{ color: COR }}>METFORMINA</span>
        <br />
        FAZ NO SEU CORPO?
      </div>
      <Pill
        x={540}
        y={1500}
        text="🔬 do corpo até a molécula"
        color={COR}
        size={38}
        k={P(f, T.vem, T.vem + 12)}
      />
    </Part>
  );
};

// ---------- 2. o problema ----------
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const nivel = 0.35 + 0.5 * it(f, T.soltando, T.precisa, 0, 1, EASE);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={60}>
      <Title f={f} at={T.diabetes} y={200} size={60} weight={600} from={COR}>
        Diabetes tipo 2
      </Title>
      <Pill
        x={540}
        y={320}
        text="🔑 tem insulina, mas o corpo não responde bem"
        color={AMAR}
        size={30}
        k={P(f, T.responde, T.responde + 12)}
      />
      <Tela>
        <Medidor
          x={880}
          y={700}
          nivel={nivel}
          k={P(f, T.figado, T.figado + 12)}
        />
      </Tela>
      <Pill
        x={540}
        y={1440}
        text="🏭 o fígado continua soltando açúcar"
        color={FIGADO}
        size={34}
        k={P(f, T.figado, T.figado + 12)}
      />
      <Pill
        x={540}
        y={1525}
        text="…mesmo quando não precisa"
        color={VERM}
        size={32}
        k={P(f, T.precisa, T.precisa + 12)}
      />
    </Part>
  );
};

// ---------- 3. zoom no fígado ----------
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={60}>
      <Title f={f} at={T.justamente} y={200} size={56} weight={600} from={COR}>
        A metformina age mais no…
      </Title>
      <div
        style={{
          position: "absolute",
          top: 300,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 96,
          color: FIGADO,
          textShadow: `0 0 30px ${rgba(FIGADO, 0.6)}`,
          opacity: P(f, T.forca, T.forca + 12),
          transform: `scale(${0.8 + 0.2 * it(f, T.forca, T.forca + 14, 0, 1, SNAP)})`,
        }}
      >
        FÍGADO
      </div>
      <Pill
        x={540}
        y={1440}
        text="célula do fígado (hepatócito)"
        color="#fdba74"
        size={32}
        k={P(f, T.justamente + 110, T.justamente + 122)}
      />
    </Part>
  );
};

// ---------- 4. a mitocôndria (usina) ----------
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const de = T.mitocondria + 34;
  const freada = it(f, T.freada, T.freada + 30, 0, 1, OUT);
  const carga = 1 - 0.75 * it(f, T.freada + 6, T.energiaBaixa + 10, 0, 1, EASE);
  const raios = Array.from({ length: 10 }, (_, i) => i);
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={60}>
      <Title f={f} at={T.dentro} y={200} size={56} weight={600} from={COR}>
        Dentro da célula…
      </Title>
      {f >= de && (
        <Tela>
          <g opacity={it(f, de, de + 16, 0, 1, OUT)}>
            <ellipse
              cx={540}
              cy={820}
              rx={400}
              ry={210}
              fill={rgba(MITO, 0.18)}
              stroke={MITO}
              strokeWidth={8}
              style={{ filter: `drop-shadow(0 0 24px ${rgba(MITO, 0.6)})` }}
            />
            <path
              d="M 200 820 q 40 -120 80 0 q 40 120 80 0 q 40 -120 80 0 q 40 120 80 0 q 40 -120 80 0 q 40 120 80 0 q 40 -120 80 0 q 40 120 80 0"
              fill="none"
              stroke={MITO}
              strokeWidth={6}
            />
            {/* complexo I */}
            <rect x={262} y={760} width={70} height={60} rx={12} fill={ROXO} />
            <text
              x={297}
              y={745}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={800}
              fontSize={26}
              fill={ROXO}
            >
              complexo I
            </text>
            {/* raios de energia (ATP): diminuem depois da freada */}
            {raios.map((i) => {
              if (i >= 10 - 7 * freada) return null;
              const t = (f * 0.03 + i * 0.13) % 1;
              const a = (i / 10) * Math.PI * 2;
              const r0 = 230 + t * 160;
              return (
                <text
                  key={i}
                  x={540 + Math.cos(a) * r0 * 1.5}
                  y={820 + Math.sin(a) * r0 * 0.8}
                  textAnchor="middle"
                  fontFamily={EMOJI}
                  fontSize={46}
                  opacity={1 - t}
                >
                  ⚡
                </text>
              );
            })}
            {/* a metformina encaixando no complexo I */}
            {f >= T.freada - 30 &&
              (() => {
                const k = it(f, T.freada - 30, T.freada, 0, 1, OUT);
                return <Comp x={140 + 157 * k} y={600 + 190 * k} r={26} />;
              })()}
          </g>
        </Tela>
      )}
      <Pill
        x={540}
        y={1110}
        text="🏭 mitocôndria: a usina de energia"
        color={MITO}
        size={34}
        k={P(f, T.usina, T.usina + 12)}
      />
      <Pill
        x={540}
        y={1195}
        text="🛑 a metformina dá uma freada leve"
        color={COR}
        size={34}
        k={P(f, T.freada, T.freada + 12)}
      />
      {/* bateria da célula */}
      {f >= T.sente - 6 && (
        <Tela>
          <g opacity={P(f, T.sente - 6, T.sente + 6)}>
            <rect
              x={340}
              y={1290}
              width={360}
              height={110}
              rx={20}
              fill="none"
              stroke={C.ink}
              strokeWidth={7}
            />
            <rect x={706} y={1322} width={22} height={46} rx={7} fill={C.ink} />
            <rect
              x={354}
              y={1304}
              width={332 * carga}
              height={82}
              rx={12}
              fill={mix(VERM, VERDE, carga)}
              style={{
                filter: `drop-shadow(0 0 12px ${mix(VERM, VERDE, carga)})`,
              }}
            />
          </g>
          <text
            x={540}
            y={1470}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={40}
            fill={C.ink}
            opacity={P(f, T.energiaBaixa, T.energiaBaixa + 10)}
          >
            “opa, energia baixa!”
          </text>
        </Tela>
      )}
    </Part>
  );
};

// ---------- 5. AMPK desliga a fábrica de glicose ----------
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const ampk = P(f, T.ampk, T.ampk + 12);
  const pisca =
    ampk > 0 && f < T.desliga ? 0.6 + 0.4 * Math.abs(Math.sin(f / 5)) : 1;
  const desligada = it(f, T.desliga, T.desliga + 20, 0, 1, OUT);
  const nivel = 0.85 - 0.5 * it(f, T.resultado, T.menos + 20, 0, 1, EASE);
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={60}>
      <Title f={f} at={T.sensor} y={200} size={56} weight={600} from={AMAR}>
        Entra o sensor de energia
      </Title>
      <Tela>
        {/* sensor AMPK */}
        <g opacity={P(f, T.sensor + 10, T.sensor + 24)}>
          <circle
            cx={540}
            cy={470}
            r={110}
            fill={rgba(AMAR, 0.15 + 0.35 * ampk * pisca)}
            stroke={AMAR}
            strokeWidth={8}
            style={{
              filter:
                ampk > 0
                  ? `drop-shadow(0 0 ${30 * ampk}px ${AMAR})`
                  : undefined,
            }}
          />
          <text
            x={540}
            y={488}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={58}
            fill={C.ink}
          >
            AMPK
          </text>
        </g>
        {/* fábrica de glicose */}
        <g opacity={P(f, T.desliga - 30, T.desliga - 14)}>
          <rect
            x={300}
            y={820}
            width={360}
            height={240}
            rx={14}
            fill={rgba(FIGADO, 0.3)}
            stroke="#fdba74"
            strokeWidth={6}
          />
          <rect
            x={560}
            y={700}
            width={60}
            height={130}
            fill={rgba(FIGADO, 0.3)}
            stroke="#fdba74"
            strokeWidth={6}
          />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={330 + i * 110}
              y={880}
              width={80}
              height={70}
              rx={8}
              fill={mix(AMAR, "#1e293b", desligada)}
            />
          ))}
          {[0, 1, 2, 3].map((i) => {
            const t = (f * 0.025 + i * 0.25) % 1;
            return (
              <Glicose
                key={i}
                x={590 + Math.sin(t * 6 + i) * 20}
                y={690 - t * 160}
                r={16}
                o={(1 - t) * (1 - desligada)}
              />
            );
          })}
          <text
            x={480}
            y={1110}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={30}
            fill={C.dim}
          >
            fábrica de glicose
          </text>
          {desligada > 0 && (
            <text
              x={480}
              y={1010}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={900}
              fontSize={160 * desligada}
              fill={VERM}
              style={{ filter: `drop-shadow(0 0 16px ${VERM})` }}
            >
              ✕
            </text>
          )}
        </g>
        <Medidor
          x={880}
          y={760}
          nivel={nivel}
          k={P(f, T.resultado - 6, T.resultado + 6)}
        />
      </Tela>
      <Pill
        x={540}
        y={640}
        text="🔋 modo economia"
        color={AMAR}
        size={34}
        k={P(f, T.liga, T.liga + 12)}
      />
      <Pill
        x={540}
        y={1250}
        text="📉 o fígado solta MENOS açúcar no sangue"
        color={VERDE}
        size={34}
        k={P(f, T.menos, T.menos + 12)}
      />
    </Part>
  );
};

// ---------- 6. ajuda extra: intestino e músculo ----------
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={60}>
      <Title f={f} at={T.outros} y={200} size={56} weight={600} from={COR}>
        E ainda ajuda de outros jeitos
      </Title>
      <Card
        f={f}
        at={T.intestino}
        x={70}
        y={380}
        w={450}
        h={520}
        border={rgba(ROSA, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <svg width={300} height={200}>
          <path
            d="M 30 40 H 270 A 40 40 0 0 1 270 120 H 30 A 40 40 0 0 0 30 200"
            fill="none"
            stroke={rgba(ROSA, 0.7)}
            strokeWidth={36}
            strokeLinecap="round"
          />
        </svg>
        <span style={{ fontWeight: 800, fontSize: 38 }}>intestino</span>
        <span
          style={{
            fontWeight: 900,
            fontSize: 52,
            color: VERDE,
            opacity: P(f, T.glp1, T.glp1 + 10),
          }}
        >
          GLP-1 ↑
        </span>
      </Card>
      <Card
        f={f}
        at={T.responder - 10}
        x={560}
        y={380}
        w={450}
        h={520}
        border={rgba(VERDE, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 150 }}>💪</span>
        <span style={{ fontWeight: 800, fontSize: 38 }}>músculo</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 32,
            textAlign: "center",
            color: VERDE,
          }}
        >
          responde melhor
          <br />à insulina
        </span>
      </Card>
      <Pill
        x={540}
        y={1000}
        text="💉 a semaglutida se inspira no GLP-1"
        color={ROXO}
        size={30}
        k={P(f, T.glp1 + 20, T.glp1 + 32)}
      />
    </Part>
  );
};

// ---------- 7. não força o pâncreas ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={60}>
      <Title f={f} at={T.repara} y={200} size={56} weight={600} from={COR}>
        Repara neste detalhe
      </Title>
      <Tela>
        <g opacity={P(f, T.pancreas - 20, T.pancreas)}>
          <path
            d="M 250 640 Q 300 540 460 580 Q 640 620 800 560 Q 880 540 860 610 Q 820 700 620 690 Q 450 690 330 720 Q 220 730 250 640 Z"
            fill={rgba(AMAR, 0.25)}
            stroke={AMAR}
            strokeWidth={6}
            style={{ filter: `drop-shadow(0 0 18px ${rgba(AMAR, 0.5)})` }}
          />
          <text
            x={555}
            y={790}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={34}
            fill={C.dim}
          >
            pâncreas
          </text>
        </g>
      </Tela>
      <Emoji f={f} at={T.pancreas} x={560} y={600} size={90}>
        😌
      </Emoji>
      <Item
        f={f}
        at={T.pancreas + 6}
        y={870}
        icone="🙅"
        texto={
          <>
            não obriga o pâncreas a produzir{" "}
            <b style={{ color: COR }}>mais insulina</b>
          </>
        }
        h={160}
      />
      <Item
        f={f}
        at={T.hipoglicemia}
        y={1060}
        icone="✅"
        cor={VERDE}
        texto={
          <>
            sozinha, <b style={{ color: VERDE }}>raramente</b> causa
            hipoglicemia
          </>
        }
        h={160}
      />
    </Part>
  );
};

// ---------- 8. ciência honesta + cuidados ----------
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={60}>
      <Emoji f={f} at={T.cientistas} x={540} y={300} size={130}>
        🔬
      </Emoji>
      <Title
        f={f}
        at={T.cientistas + 6}
        y={400}
        size={50}
        weight={600}
        color={C.ink}
        from={ROXO}
      >
        detalhes ainda em estudo
      </Title>
      <Title
        f={f}
        at={T.certa}
        y={520}
        size={46}
        font={SANS}
        weight={700}
        color={C.ink}
        from={COR}
      >
        mas uma coisa é certa:
      </Title>
      <Item
        f={f}
        at={T.alimentacao}
        y={640}
        icone="🥗"
        texto="+ alimentação equilibrada"
        cor={VERDE}
      />
      <Item
        f={f}
        at={T.atividade}
        y={800}
        icone="🏃‍♀️"
        texto="+ atividade física"
        cor={VERDE}
      />
      <Item
        f={f}
        at={T.acompanhamento}
        y={960}
        icone="👩‍⚕️"
        texto="+ acompanhamento profissional"
        cor={VERDE}
      />
    </Part>
  );
};

// ---------- 9. me siga ----------
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

// ---------- 10. mensagem final ----------
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

export const VideoMetforminaMec: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(3)[0] && f < R(4)[0]
      ? MITO
      : f >= R(4)[0] && f < R(5)[0]
        ? AMAR
        : f >= R(1)[0] && f < R(3)[0]
          ? FIGADO
          : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[
          T.figado,
          T.forca,
          T.freada,
          T.ampk,
          T.desliga,
          T.hipoglicemia,
          T.final,
        ]}
      />
      <Corpo f={f} />
      <Celula f={f} />
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
      <Audio src={staticFile("metforminaMec/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio
        src={staticFile("metforminaMec/musica.wav")}
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

// Capa (1080×1920): a viagem corpo → fígado → mitocôndria. Os 20% de baixo ficam livres (contador do TikTok).
export const CapaMetforminaMec: React.FC = () => {
  const bolha = (
    cx: number,
    cy: number,
    cor: string,
    rotulo: string,
    filho: React.ReactNode,
  ) => (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={150}
        fill={rgba(cor, 0.12)}
        stroke={cor}
        strokeWidth={6}
        style={{ filter: `drop-shadow(0 0 22px ${rgba(cor, 0.6)})` }}
      />
      {filho}
      <text
        x={cx}
        y={cy + 200}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={38}
        fill={C.ink}
      >
        {rotulo}
      </text>
    </g>
  );
  return (
    <AbsoluteFill>
      <Background color={COR} pulses={[]} />
      <div
        style={{
          position: "absolute",
          top: 170,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 88,
          lineHeight: 1.05,
          color: C.ink,
          textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
        }}
      >
        O QUE A
        <br />
        <span style={{ color: COR }}>METFORMINA</span>
        <br />
        FAZ NO SEU CORPO?
      </div>
      <Tela>
        {bolha(
          250,
          720,
          COR,
          "corpo",
          <g stroke={COR} strokeWidth={8} fill="none" strokeLinecap="round">
            <circle cx={250} cy={640} r={26} />
            <path d="M 205 680 Q 250 668 295 680 L 300 770 Q 250 780 200 770 Z" />
            <path d="M 230 775 L 225 840 M 270 775 L 275 840" />
          </g>,
        )}
        <text
          x={540}
          y={740}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={80}
          fill={C.dim}
        >
          →
        </text>
        {bolha(
          830,
          720,
          FIGADO,
          "fígado",
          <path
            d="M 740 720 Q 760 670 850 680 Q 930 690 910 735 Q 850 770 780 760 Q 735 750 740 720 Z"
            fill={FIGADO}
            stroke="#fdba74"
            strokeWidth={4}
          />,
        )}
        <text
          x={700}
          y={960}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={80}
          fill={C.dim}
          transform="rotate(35,700,940)"
        >
          ↓
        </text>
        {bolha(
          540,
          1110,
          MITO,
          "mitocôndria",
          <g>
            <ellipse
              cx={540}
              cy={1110}
              rx={110}
              ry={56}
              fill={rgba(MITO, 0.3)}
              stroke={MITO}
              strokeWidth={5}
            />
            <path
              d="M 460 1110 q 16 -30 32 0 q 16 30 32 0 q 16 -30 32 0 q 16 30 32 0 q 16 -30 32 0"
              fill="none"
              stroke={MITO}
              strokeWidth={4}
            />
            <circle
              cx={470}
              cy={1080}
              r={20}
              fill="#f8fafc"
              style={{ filter: `drop-shadow(0 0 10px ${COR})` }}
            />
          </g>,
        )}
      </Tela>
      <div
        style={{
          position: "absolute",
          top: 1400,
          width: W,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 40,
            color: C.ink,
            padding: "14px 32px",
            borderRadius: 40,
            border: `2px solid ${rgba(COR, 0.7)}`,
            background: rgba(COR, 0.14),
          }}
        >
          <span style={{ fontFamily: EMOJI }}>🔬</span> do corpo até a molécula
        </span>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
