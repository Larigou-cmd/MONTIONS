import React from "react";
import {
  AbsoluteFill,
  Audio,
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
  OUT,
  P,
  Part,
  Pill,
  SNAP,
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Por que bebida alcoólica faz fazer tanto xixi?" — Modelo 1, série "Fisiologia curiosa", tudo desenhado em código.
// Roteiro e fontes: roteiros/alcool_xixi.md. Narração da Juliana; tempos alinhados em fala.json (scripts/transcrever.py).
const AMBAR = "#fbbf24",
  AZUL = "#60a5fa",
  VERM = "#ef4444",
  ROXO = "#a78bfa",
  VERDE = "#4ade80";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  cerveja: Tw("cerveja"),
  vezes: Tw("vezes"),
  banheiro: Tw("banheiro"),
  liquido: Tw("líquido"),
  hormonio: Tw("hormônio"),
  rins: Tw("lembra") - 6,
  agua: Tw("água"),
  adh: Tw("adh"),
  antidiuretico: Tw("antidiurético"),
  vasopressina: Tw("vasopressina"),
  cerebro: Tw("ele") - 6,
  hipotalamo: Tw("hipotálamo"),
  hipofise: Tw("hipófise"),
  ducto: Tw("fim") - 6,
  coletor: Tw("coletor"),
  canais: Tw("canais"),
  aquaporinas: Tw("aquaporinas"),
  volta: Tw("volta", 2),
  alcool: Tw("álcool") - 10,
  inibe: Tw("inibe"),
  fechados: Tw("fechados"),
  bexiga: Tw("bexiga"),
  resultado: Tw("resultado") - 6,
  xixi: Tw("xixi"),
  claro: Tw("claro"),
  vezes2: Tw("vezes", 2),
  sede: Tw("essa") - 6,
  seca: Tw("seca"),
  sedeW: Tw("sede"),
  intercale: Tw("intercale"),
  cuidado: Tw("toma") - 14,
  pressao: Tw("pressão"),
  diuretico: Tw("diurético"),
  converse: Tw("converse"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ALCOOL = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.cerveja, "pop", 0.2],
  [T.vezes, "bip", 0.18],
  [T.banheiro, "bip", 0.18],
  [T.hormonio, "plim", 0.22],
  [T.rins, "whoosh", 0.25],
  [T.adh, "trava", 0.28],
  [T.cerebro, "whoosh", 0.25],
  [T.hipotalamo, "pop", 0.2],
  [T.hipofise, "pop", 0.2],
  [T.ducto, "whoosh", 0.25],
  [T.aquaporinas, "plim", 0.22],
  [T.alcool, "whoosh", 0.25],
  [T.inibe, "trava", 0.32],
  [T.bexiga, "pop", 0.2],
  [T.resultado, "whoosh", 0.25],
  [T.claro, "pop", 0.2],
  [T.sede, "whoosh", 0.25],
  [T.intercale, "plim", 0.22],
  [T.cuidado, "whoosh", 0.25],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// copo de cerveja que enche
const Copo: React.FC<{ f: number }> = ({ f }) => {
  const enche = P(f, 0, T.liquido);
  const h = 420 * enche;
  return (
    <Svg>
      <g transform="translate(540,1050)">
        <path
          d="M-150,-260 L150,-260 L125,240 L-125,240 Z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={8}
        />
        <clipPath id="copoClip">
          <path d="M-146,-256 L146,-256 L121,236 L-121,236 Z" />
        </clipPath>
        <g clipPath="url(#copoClip)">
          <rect
            x={-160}
            y={236 - h}
            width={320}
            height={h}
            fill={AMBAR}
            opacity={0.85}
          />
          <rect
            x={-160}
            y={236 - h - 50}
            width={320}
            height={56}
            rx={26}
            fill="#fffbeb"
            opacity={enche > 0.05 ? 0.95 : 0}
          />
          {Array.from({ length: 14 }, (_, i) => {
            const t =
              (f * (1.5 + random(`b${i}`)) + random(`o${i}`) * 400) % 400;
            return (
              <circle
                key={i}
                cx={-100 + random(`x${i}`) * 200}
                cy={230 - t}
                r={5 + random(`r${i}`) * 5}
                fill="#fff7d6"
                opacity={t < h ? 0.7 : 0}
              />
            );
          })}
        </g>
        <path
          d="M150,-160 C260,-160 260,120 135,120"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={22}
        />
      </g>
    </Svg>
  );
};

// contador de idas ao banheiro
const Banheiro: React.FC<{
  f: number;
  inicio: number;
  rapido?: boolean;
  y?: number;
}> = ({ f, inicio, rapido = false, y = 1500 }) => {
  if (f < inicio) return null;
  const n = Math.min(
    rapido ? 9 : 3,
    1 + Math.floor((f - inicio) / (rapido ? 6 : 22)),
  );
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: "100%",
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 70,
        color: C.ink,
      }}
    >
      <span style={{ fontFamily: EMOJI }}>🚻</span> ×{" "}
      <span style={{ color: AMBAR }}>{n}</span>
    </div>
  );
};

// os dois rins (mesmo desenho do vídeo do glóbulo)
const Rins: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const k = it(f, at, at + 14, 0, 1, SNAP);
  const rim = (x: number, flip: number) => (
    <path
      transform={`translate(${x},760) scale(${1.3 * flip * k},${1.3 * k})`}
      d="M-60,-110 C40,-140 90,-60 80,0 C70,60 40,130 -50,110 C-100,95 -90,40 -40,20 C-10,10 -10,-20 -40,-30 C-90,-50 -110,-95 -60,-110 Z"
      fill={AMBAR}
      opacity={0.9}
      style={{ filter: `drop-shadow(0 0 18px ${rgba(AMBAR, 0.5)})` }}
    />
  );
  return (
    <Svg>
      {rim(360, 1)}
      {rim(720, -1)}
    </Svg>
  );
};

// cabeça com hipotálamo e hipófise
const Cabeca: React.FC<{ f: number; bloqueia?: number }> = ({
  f,
  bloqueia = 0,
}) => {
  const k = it(f, T.cerebro, T.cerebro + 14, 0, 1, SNAP);
  const luz = (at: number) => P(f, at - 4, at + 8);
  const desce = it(f, T.hipofise + 6, T.hipofise + 40, 0, 1, OUT);
  return (
    <Svg>
      <g transform={`translate(540,900) scale(${k})`}>
        <path
          d="M-200,40 C-220,-200 -60,-320 60,-300 C220,-280 260,-120 230,0 C215,60 250,90 230,130 C210,160 170,150 160,200 C150,260 80,280 20,270 L10,380 L-150,380 L-140,230 C-190,180 -195,110 -200,40 Z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={6}
        />
        <ellipse
          cx={20}
          cy={-130}
          rx={170}
          ry={120}
          fill={rgba(ROXO, 0.18)}
          stroke={rgba(ROXO, 0.6)}
          strokeWidth={4}
        />
        <circle
          cx={40}
          cy={-40}
          r={34}
          fill={ROXO}
          opacity={0.3 + 0.7 * luz(T.hipotalamo)}
          style={{
            filter: `drop-shadow(0 0 ${20 * luz(T.hipotalamo)}px ${ROXO})`,
          }}
        />
        <circle
          cx={50}
          cy={40}
          r={26}
          fill={AZUL}
          opacity={0.3 + 0.7 * luz(T.hipofise) * (1 - 0.7 * bloqueia)}
          style={{
            filter: `drop-shadow(0 0 ${20 * luz(T.hipofise) * (1 - bloqueia)}px ${AZUL})`,
          }}
        />
        <text
          x={100}
          y={-34}
          fontFamily={SANS}
          fontWeight={800}
          fontSize={34}
          fill={ROXO}
          opacity={luz(T.hipotalamo)}
        >
          hipotálamo
        </text>
        <text
          x={95}
          y={54}
          fontFamily={SANS}
          fontWeight={800}
          fontSize={34}
          fill={AZUL}
          opacity={luz(T.hipofise)}
        >
          hipófise
        </text>
        {/* o ADH desce pelo sangue */}
        {desce > 0 &&
          bloqueia < 0.5 &&
          [0, 1, 2].map((i) => (
            <g
              key={i}
              transform={`translate(${50 + i * 20},${70 + desce * (380 + i * 60)})`}
              opacity={1 - desce * 0.6}
            >
              <rect
                x={-44}
                y={-22}
                width={88}
                height={44}
                rx={22}
                fill={rgba(AZUL, 0.25)}
                stroke={AZUL}
                strokeWidth={3}
              />
              <text
                textAnchor="middle"
                y={10}
                fontFamily={SANS}
                fontWeight={900}
                fontSize={24}
                fill={AZUL}
              >
                ADH
              </text>
            </g>
          ))}
        {bloqueia > 0 && (
          <g
            opacity={bloqueia}
            stroke={VERM}
            strokeWidth={12}
            strokeLinecap="round"
          >
            <line x1={10} y1={0} x2={90} y2={80} />
            <line x1={90} y1={0} x2={10} y2={80} />
          </g>
        )}
      </g>
    </Svg>
  );
};

// ducto coletor com as "portas" de água (aquaporinas): abertas, a água volta; fechadas, segue para a bexiga
const Ducto: React.FC<{ f: number; abre: number; segue: number }> = ({
  f,
  abre,
  segue,
}) => (
  <Svg>
    {/* sangue em cima */}
    <rect
      x={80}
      y={700}
      width={920}
      height={170}
      rx={30}
      fill={rgba(VERM, 0.18)}
      stroke={rgba(VERM, 0.5)}
      strokeWidth={3}
    />
    <text
      x={110}
      y={760}
      fontFamily={SANS}
      fontWeight={800}
      fontSize={34}
      fill={VERM}
    >
      sangue
    </text>
    {/* o ducto */}
    <rect
      x={80}
      y={980}
      width={920}
      height={200}
      rx={40}
      fill={rgba(AMBAR, 0.12)}
      stroke={AMBAR}
      strokeWidth={5}
    />
    <text
      x={110}
      y={1240}
      fontFamily={SANS}
      fontWeight={800}
      fontSize={34}
      fill={AMBAR}
    >
      ducto coletor
    </text>
    <text
      x={980}
      y={1240}
      textAnchor="end"
      fontFamily={SANS}
      fontWeight={800}
      fontSize={34}
      fill={AMBAR}
    >
      → bexiga
    </text>
    {/* portas */}
    {[0, 1, 2, 3].map((i) => {
      const x = 240 + i * 200;
      return (
        <g key={i}>
          <rect x={x - 40} y={960} width={80} height={40} fill={C.bg} />
          <rect
            x={x - 40 - 36 * abre}
            y={955}
            width={40}
            height={14}
            rx={6}
            fill={AZUL}
          />
          <rect
            x={x + 36 * abre}
            y={955}
            width={40}
            height={14}
            rx={6}
            fill={AZUL}
          />
        </g>
      );
    })}
    {/* gotas */}
    {Array.from({ length: 16 }, (_, i) => {
      const fase = (((f * 0.02 + random(`d${i}`)) % 1) + 1) % 1;
      const porta = 240 + (i % 4) * 200;
      const sobe = abre * (1 - segue);
      const x = 120 + fase * 860;
      const xs = x + (porta - x) * sobe;
      const y = 1080 - sobe * Math.max(0, (fase - 0.2) / 0.8) * 300;
      return (
        <text
          key={i}
          x={xs}
          y={y}
          fontFamily={EMOJI}
          fontSize={44}
          textAnchor="middle"
        >
          💧
        </text>
      );
    })}
  </Svg>
);

// régua de cor da urina
const Cores: React.FC<{ f: number }> = ({ f }) => {
  const k = P(f, T.claro - 6, T.claro + 30);
  const cores = ["#ca8a04", "#eab308", "#facc15", "#fde68a", "#fef9c3"];
  return (
    <div
      style={{
        position: "absolute",
        top: 1000,
        left: 140,
        right: 140,
        display: "flex",
        gap: 14,
      }}
    >
      {cores.map((c, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 120,
            borderRadius: 20,
            background: c,
            opacity: 0.35 + 0.65 * (Math.abs(i - k * 4) < 0.6 ? 1 : 0.2),
            transform: `scale(${Math.abs(i - k * 4) < 0.6 ? 1.12 : 1})`,
          }}
        />
      ))}
    </div>
  );
};

export const VideoAlcool: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo =
    f < T.rins
      ? AMBAR
      : f < T.cerebro
        ? AMBAR
        : f < T.alcool
          ? ROXO
          : f < T.sede
            ? VERM
            : f < T.siga
              ? AZUL
              : VERDE;
  return (
    <AbsoluteFill>
      <Background
        color={corFundo}
        pulses={[
          T.hormonio,
          T.adh,
          T.aquaporinas,
          T.inibe,
          T.claro,
          T.intercale,
          T.final,
        ]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.rins}>
        <Title
          f={f}
          at={2}
          y={220}
          size={70}
          font={SANS}
          weight={900}
          from={AMBAR}
        >
          VOCÊ SABIA?
        </Title>
        <Copo f={f} />
        <Banheiro f={f} inicio={T.vezes} y={1400} />
        <Pill
          x={540}
          y={560}
          text="só por causa do líquido? 🤔"
          color={AMBAR}
          size={44}
          k={P(f, T.liquido - 4, T.liquido + 8)}
        />
        <Pill
          x={540}
          y={1600}
          text="🧪 tem um hormônio nessa história"
          color={ROXO}
          size={42}
          k={P(f, T.hormonio, T.hormonio + 10)}
        />
      </Part>

      {/* 2. os rins e o ADH */}
      <Part from={T.rins} to={T.cerebro}>
        <Title
          f={f}
          at={T.rins + 4}
          y={220}
          size={74}
          weight={600}
          from={AMBAR}
        >
          lembra dos <span style={{ color: AMBAR }}>rins</span>?
        </Title>
        <Rins f={f} at={T.rins + 4} />
        <Pill
          x={540}
          y={1010}
          text="💧 quase toda a água volta"
          color={AZUL}
          size={44}
          k={P(f, T.agua - 4, T.agua + 8)}
        />
        <Card
          f={f}
          at={T.adh - 4}
          x={110}
          y={1140}
          w={860}
          h={330}
          border={rgba(AZUL, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 96,
              color: bornColor(f, T.adh, AZUL, C.ink),
            }}
          >
            ADH
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 40,
              opacity: P(f, T.antidiuretico - 6, T.antidiuretico + 6),
            }}
          >
            hormônio antidiurético
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 44,
              color: AZUL,
              opacity: P(f, T.vasopressina - 6, T.vasopressina + 6),
            }}
          >
            ou vasopressina
          </span>
        </Card>
      </Part>

      {/* 3. de onde vem e como age */}
      <Part from={T.cerebro} to={T.alcool}>
        {f < T.ducto ? (
          <>
            <Title
              f={f}
              at={T.cerebro + 4}
              y={220}
              size={74}
              weight={600}
              from={ROXO}
            >
              fabricado no <span style={{ color: ROXO }}>cérebro</span>
            </Title>
            <Cabeca f={f} />
          </>
        ) : (
          <>
            <Title
              f={f}
              at={T.ducto + 4}
              y={220}
              size={70}
              weight={600}
              from={AZUL}
            >
              ele abre <span style={{ color: AZUL }}>portas de água</span>
            </Title>
            <Ducto
              f={f}
              abre={it(f, T.canais - 4, T.canais + 12, 0, 1, OUT)}
              segue={0}
            />
            <Pill
              x={540}
              y={1400}
              text="aquaporinas 🚪💧"
              color={AZUL}
              size={46}
              k={P(f, T.aquaporinas - 4, T.aquaporinas + 8)}
            />
            <Pill
              x={540}
              y={1530}
              text="↑ a água volta para o sangue"
              color={VERDE}
              size={42}
              k={P(f, T.volta - 4, T.volta + 8)}
            />
          </>
        )}
      </Part>

      {/* 4. o álcool desliga o ADH */}
      <Part from={T.alcool} to={T.resultado}>
        <Title
          f={f}
          at={T.alcool + 4}
          y={220}
          size={74}
          weight={600}
          from={VERM}
        >
          o <span style={{ color: AMBAR }}>álcool</span> desliga o ADH 🍺
        </Title>
        {f < T.fechados - 8 ? (
          <>
            <Cabeca
              f={T.hipofise + 20 + (f - T.alcool) * 0}
              bloqueia={it(f, T.inibe, T.inibe + 10, 0, 1, OUT)}
            />
            <Pill
              x={540}
              y={1450}
              text="ADH ↓"
              color={VERM}
              size={60}
              k={P(f, T.inibe, T.inibe + 10)}
            />
          </>
        ) : (
          <>
            <Ducto
              f={f}
              abre={1 - it(f, T.fechados - 8, T.fechados + 4, 0, 1, OUT)}
              segue={it(f, T.fechados, T.fechados + 20, 0, 1, OUT)}
            />
            <Pill
              x={540}
              y={1400}
              text="🚪 canais fechados"
              color={VERM}
              size={44}
              k={P(f, T.fechados - 4, T.fechados + 8)}
            />
            <Pill
              x={540}
              y={1530}
              text="→ a água segue para a bexiga"
              color={AMBAR}
              size={42}
              k={P(f, T.bexiga - 6, T.bexiga + 6)}
            />
          </>
        )}
      </Part>

      {/* 5. resultado */}
      <Part from={T.resultado} to={T.sede}>
        <Title
          f={f}
          at={T.resultado + 4}
          y={220}
          size={78}
          weight={600}
          from={AZUL}
        >
          mais <span style={{ color: AMBAR }}>xixi</span>, e mais claro
        </Title>
        <Emoji f={f} at={T.xixi - 4} x={540} y={700} size={200}>
          🚽
        </Emoji>
        {f >= T.claro - 6 && <Cores f={f} />}
        <Banheiro f={f} inicio={T.vezes2 - 20} rapido y={1300} />
      </Part>

      {/* 6. dia seguinte */}
      <Part from={T.sede} to={T.cuidado}>
        <Title f={f} at={T.sede + 4} y={220} size={74} weight={600} from={AZUL}>
          no dia seguinte...
        </Title>
        <Emoji f={f} at={T.seca - 6} x={540} y={720} size={220}>
          🥵
        </Emoji>
        <Pill
          x={540}
          y={960}
          text="boca seca e mais sede"
          color={AMBAR}
          size={46}
          k={P(f, T.sedeW - 6, T.sedeW + 6)}
        />
        <Card
          f={f}
          at={T.intercale - 6}
          x={140}
          y={1100}
          w={800}
          h={260}
          border={rgba(AZUL, 0.7)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            padding: "0 50px",
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 120 }}>💧</span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 56,
              lineHeight: 1.15,
            }}
          >
            intercale a bebida com <span style={{ color: AZUL }}>água</span>
          </span>
        </Card>
      </Part>

      {/* 7. cuidado com remédios */}
      <Part from={T.cuidado} to={T.siga}>
        <Title
          f={f}
          at={T.cuidado + 4}
          y={220}
          size={74}
          weight={600}
          from={VERDE}
        >
          toma remédio?
        </Title>
        <Emoji f={f} at={T.pressao - 6} x={540} y={700} size={200}>
          💊
        </Emoji>
        <Pill
          x={540}
          y={940}
          text="🩺 para pressão"
          color={VERM}
          size={46}
          k={P(f, T.pressao - 4, T.pressao + 8)}
        />
        <Pill
          x={540}
          y={1070}
          text="💧 diurético"
          color={AZUL}
          size={46}
          k={P(f, T.diuretico - 4, T.diuretico + 8)}
        />
        <Card
          f={f}
          at={T.converse - 4}
          x={140}
          y={1200}
          w={800}
          h={220}
          border={rgba(VERDE, 0.7)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 50,
              lineHeight: 1.2,
            }}
          >
            converse com o{" "}
            <span style={{ color: VERDE }}>médico ou farmacêutico</span> antes
            de beber
          </span>
        </Card>
      </Part>

      {/* 8. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card
          f={f}
          at={T.siga}
          x={110}
          y={760}
          w={860}
          h={300}
          border={rgba(AMBAR, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 84,
              color: bornColor(f, T.siga, C.ink, AMBAR),
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

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_ALCOOL} inY={100} outDur={1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
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
                      ? bornColor(f, at, AMBAR, "#fffbeb", 20)
                      : bornColor(f, at, C.ink, AMBAR),
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
      <Grain />
      <Audio src={staticFile("alcool/narracao.mp3")} />
      <Audio
        src={staticFile("alcool/musica.wav")}
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_ALCOOL - 60, DURATION_ALCOOL))
        }
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
