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
  mix,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "O que o anlodipino faz nos seus vasos? E por que o tornozelo incha" — Modelo 1, no formato do vídeo da losartana.
// Roteiro e fontes: roteiros/anlodipino_tornozelo.md. Narração da Juliana; tempos em fala.json (scripts/transcrever.py).
const COR = "#f43f5e", // vaso / pressão
  CA = "#fbbf24", // cálcio
  ANL = "#2dd4bf", // anlodipino
  AZUL = "#60a5fa", // veia / líquido
  VERM = "#ef4444",
  VERDE = "#4ade80",
  ROXO = "#a78bfa";

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
  tornozelo: Tw("tornozelo"),
  vasos: Tw("vasos"),
  musculo: Tw("os") - 8,
  quando: Tw("quando"),
  aperta: Tw("aperta"),
  sobe: Tw("sobe"),
  portoes: Tw("cálcio", 2) - 14,
  canais: Tw("canais"),
  fecha: Tw("fecha"),
  relaxa: Tw("relaxa"),
  abre: Tw("abre"),
  cai: Tw("cai"),
  dura: Tw("fica") - 14,
  comprimido: Tw("comprimido"),
  agora: Tw("agora") - 6,
  arterias: Tw("artérias"),
  veias: Tw("veias"),
  entra: Tw("entra", 3),
  sai: Tw("sai"),
  vasinhos: Tw("vasinhos"),
  escapa: Tw("escapa"),
  gravidade: Tw("gravidade"),
  acumula: Tw("acumula"),
  agua: Tw("não", 2) - 6,
  diuretico: Tw("diurético"),
  quem: Tw("inchaço", 2) - 8,
  doses: Tw("doses"),
  mulheres: Tw("mulheres"),
  combinado: Tw("combinado"),
  diminuir: Tw("diminuir"),
  atencao: Tw("atenção") - 6,
  dor: Tw("dor"),
  rosto: Tw("rosto"),
  tontura: Tw("tontura"),
  inchar: Tw("inchar"),
  medico: Tw("médico"),
  siga: Tw("siga") - 14,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ANLODIPINO = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.tornozelo, "pop", 0.2],
  [T.musculo, "whoosh", 0.25],
  [T.aperta, "trava", 0.28],
  [T.portoes, "whoosh", 0.25],
  [T.fecha, "trava", 0.3],
  [T.cai, "plim", 0.22],
  [T.dura, "whoosh", 0.25],
  [T.comprimido, "pop", 0.2],
  [T.agora, "whoosh", 0.25],
  [T.escapa, "pop", 0.2],
  [T.acumula, "trava", 0.28],
  [T.agua, "whoosh", 0.25],
  [T.quem, "whoosh", 0.25],
  [T.diminuir, "plim", 0.22],
  [T.atencao, "whoosh", 0.25],
  [T.inchar, "trava", 0.28],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// íon de cálcio
const Ca: React.FC<{ x: number; y: number; o?: number; r?: number }> = ({
  x,
  y,
  o = 1,
  r = 22,
}) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} fill={CA} stroke="#fef3c7" strokeWidth={3} />
    <text
      x={x}
      y={y + 7}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={900}
      fontSize={r * 0.8}
      fill="#422006"
    >
      Ca
    </text>
  </g>
);

// medidor de pressão (mesmo do vídeo da losartana)
const Manometro: React.FC<{
  x: number;
  y: number;
  nivel: number;
  k: number;
}> = ({ x, y, nivel, k }) => {
  if (k <= 0) return null;
  const a = Math.PI * (1 - nivel);
  const cor = mix(VERDE, VERM, nivel);
  return (
    <g opacity={k}>
      <path
        d={`M ${x - 110} ${y} A 110 110 0 0 1 ${x + 110} ${y}`}
        fill="none"
        stroke={C.dim}
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d={`M ${x - 110} ${y} A 110 110 0 0 1 ${x + 110 * Math.cos(a)} ${y - 110 * Math.sin(a)}`}
        fill="none"
        stroke={cor}
        strokeWidth={14}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 10px ${cor})` }}
      />
      <line
        x1={x}
        y1={y}
        x2={x + 88 * Math.cos(a)}
        y2={y - 88 * Math.sin(a)}
        stroke={C.ink}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={12} fill={C.ink} />
      <text
        x={x}
        y={y + 48}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={28}
        fill={C.ink}
      >
        pressão
      </text>
    </g>
  );
};

// ---------- vaso em corte: anel de músculo em volta, cálcio entrando e apertando ----------
const VasoCorte: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.musculo + 6, T.musculo + 20, 0, 1, SNAP);
  const aperto = it(f, T.aperta - 6, T.aperta + 14, 0, 1, OUT);
  const luz = 190 - 100 * aperto; // raio por onde passa o sangue
  const cx = 540,
    cy = 900;
  return (
    <Svg>
      <g opacity={k}>
        {/* músculo (anel) */}
        <circle
          cx={cx}
          cy={cy}
          r={luz + 55}
          fill="none"
          stroke={rgba(COR, 0.75)}
          strokeWidth={110}
        />
        {Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * (luz + 8)}
              y1={cy + Math.sin(a) * (luz + 8)}
              x2={cx + Math.cos(a) * (luz + 102)}
              y2={cy + Math.sin(a) * (luz + 102)}
              stroke="#fecdd3"
              strokeWidth={3}
              opacity={0.5}
            />
          );
        })}
        {/* sangue */}
        <circle cx={cx} cy={cy} r={luz} fill={rgba(VERM, 0.2)} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = i * 1.05 + f * 0.02;
          return (
            <ellipse
              key={i}
              cx={cx + Math.cos(a) * luz * 0.5}
              cy={cy + Math.sin(a) * luz * 0.5}
              rx={26}
              ry={12}
              fill="#dc2626"
              stroke="#fca5a5"
              strokeWidth={2}
            />
          );
        })}
        <text
          x={cx}
          y={cy - luz - 135}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={36}
          fill={COR}
        >
          músculo
        </text>
        {/* cálcio entrando no músculo */}
        {f >= T.quando - 10 &&
          Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.3;
            const t = ((((f - T.quando) * 0.02 + random(`c${i}`)) % 1) + 1) % 1;
            const r = luz + 260 - t * 180;
            return (
              <Ca
                key={i}
                x={cx + Math.cos(a) * r}
                y={cy + Math.sin(a) * r}
                o={Math.min(1, (1 - t) * 3) * P(f, T.quando - 10, T.quando + 6)}
                r={20}
              />
            );
          })}
      </g>
    </Svg>
  );
};

// ---------- membrana da célula com portões (canais de cálcio) ----------
const Portoes: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.portoes + 4, T.portoes + 18, 0, 1, SNAP);
  const fecha = it(f, T.fecha - 4, T.fecha + 10, 0, 1, OUT);
  const y = 820;
  const gates = [220, 540, 860];
  const abertura = 70 * (1 - fecha);
  return (
    <Svg>
      <g opacity={k}>
        <text
          x={80}
          y={y - 200}
          fontFamily={SANS}
          fontWeight={800}
          fontSize={32}
          fill={C.dim}
        >
          fora da célula
        </text>
        <text
          x={80}
          y={y + 230}
          fontFamily={SANS}
          fontWeight={800}
          fontSize={32}
          fill={C.dim}
        >
          dentro do músculo
        </text>
        {/* membrana */}
        <rect
          x={0}
          y={y - 40}
          width={W}
          height={80}
          fill={rgba(COR, 0.35)}
          stroke={rgba(COR, 0.8)}
          strokeWidth={3}
        />
        {gates.map((gx, i) => (
          <g key={i}>
            <rect
              x={gx - abertura / 2 - 60}
              y={y - 60}
              width={60}
              height={120}
              rx={16}
              fill={ROXO}
              stroke="#ddd6fe"
              strokeWidth={3}
            />
            <rect
              x={gx + abertura / 2}
              y={y - 60}
              width={60}
              height={120}
              rx={16}
              fill={ROXO}
              stroke="#ddd6fe"
              strokeWidth={3}
            />
            {/* anlodipino trancando */}
            {fecha > 0 && (
              <g
                transform={`translate(${gx},${y - 90 - 60 * (1 - fecha)}) scale(${fecha})`}
              >
                <rect
                  x={-58}
                  y={-26}
                  width={116}
                  height={52}
                  rx={26}
                  fill={ANL}
                />
                <text
                  y={13}
                  textAnchor="middle"
                  fontFamily={EMOJI}
                  fontSize={34}
                >
                  🔒
                </text>
              </g>
            )}
          </g>
        ))}
        {/* cálcio: passa pelos portões abertos; depois bate e volta */}
        {gates.map((gx, gi) =>
          [0, 1, 2].map((j) => {
            const t =
              ((((f - T.portoes) * 0.018 + random(`p${gi}${j}`)) % 1) + 1) % 1;
            const aberto = f < T.fecha;
            const yy = aberto
              ? y - 260 + t * 480
              : y - 260 + (t < 0.5 ? t * 2 * 150 : (1 - t) * 2 * 150);
            return (
              <Ca
                key={`${gi}${j}`}
                x={gx + (j - 1) * (aberto ? 0 : 70)}
                y={yy}
                o={Math.sin(Math.PI * t)}
              />
            );
          }),
        )}
      </g>
    </Svg>
  );
};

// ---------- artéria → vasinhos → veia; o líquido escapa e desce para o tornozelo ----------
const Circulacao: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.agora + 6, T.agora + 20, 0, 1, SNAP);
  const art = it(f, T.arterias - 6, T.arterias + 14, 0, 1, OUT); // artéria bem aberta
  const ra = 40 + 45 * art,
    rv = 40;
  const y = 700;
  const pressao = P(f, T.vasinhos - 6, T.vasinhos + 10);
  const brilho = 0.25 + 0.5 * pressao;
  return (
    <Svg>
      <g opacity={k}>
        {/* artéria */}
        <rect
          x={30}
          y={y - ra}
          width={330}
          height={ra * 2}
          rx={ra}
          fill={rgba(VERM, 0.3)}
          stroke={VERM}
          strokeWidth={5}
        />
        <text
          x={195}
          y={y - ra - 22}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={32}
          fill={VERM}
        >
          artéria
        </text>
        {/* vasinhos (capilares) */}
        {[-36, 0, 36].map((d, i) => (
          <path
            key={i}
            d={`M 360 ${y + d * 0.6} C 450 ${y + d * 2.2}, 630 ${y - d * 2.2}, 720 ${y + d * 0.6}`}
            fill="none"
            stroke={mix(VERM, AZUL, 0.5)}
            strokeWidth={14}
            strokeLinecap="round"
            style={{
              filter:
                pressao > 0
                  ? `drop-shadow(0 0 ${14 * pressao}px ${CA})`
                  : undefined,
            }}
            opacity={0.6 + brilho * 0.5}
          />
        ))}
        <text
          x={540}
          y={y + 120}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={30}
          fill={C.ink}
          opacity={0.85}
        >
          vasinhos
        </text>
        {/* veia */}
        <rect
          x={720}
          y={y - rv}
          width={330}
          height={rv * 2}
          rx={rv}
          fill={rgba(AZUL, 0.3)}
          stroke={AZUL}
          strokeWidth={5}
        />
        <text
          x={885}
          y={y - rv - 22}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={32}
          fill={AZUL}
        >
          veia
        </text>
        {/* setas: entra muito, sai pouco */}
        <g opacity={P(f, T.entra - 6, T.entra + 6)}>
          <text
            x={195}
            y={y + 22}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={80}
            fill={C.ink}
          >
            ➜
          </text>
        </g>
        <g opacity={P(f, T.sai - 6, T.sai + 6)}>
          <text
            x={885}
            y={y + 12}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={36}
            fill={C.ink}
          >
            ➜
          </text>
        </g>
        {/* gotas escapando e descendo com a gravidade */}
        {f >= T.escapa - 6 &&
          Array.from({ length: 8 }, (_, i) => {
            const t =
              ((((f - T.escapa) * 0.016 + random(`g${i}`)) % 1) + 1) % 1;
            const desce = f >= T.gravidade ? 1 : 0.25;
            const x0 = 440 + random(`gx${i}`) * 200;
            return (
              <text
                key={i}
                x={x0 + (540 - x0) * t * desce}
                y={y + 60 + t * 620 * desce}
                textAnchor="middle"
                fontFamily={EMOJI}
                fontSize={44}
                opacity={
                  Math.sin(Math.PI * t) * P(f, T.escapa - 6, T.escapa + 6)
                }
              >
                💧
              </text>
            );
          })}
      </g>
    </Svg>
  );
};

const Chip: React.FC<{
  x: number;
  y: number;
  at: number;
  txt: string;
  cor: string;
  f: number;
  size?: number;
}> = ({ x, y, at, txt, cor, f, size = 38 }) => (
  <Pill
    x={x}
    y={y}
    text={txt}
    color={cor}
    size={size}
    k={P(f, at - 4, at + 8)}
  />
);

const Linha: React.FC<{
  f: number;
  at: number;
  y: number;
  emoji: string;
  cor: string;
  children: React.ReactNode;
}> = ({ f, at, y, emoji, cor, children }) => (
  <Card
    f={f}
    at={at}
    x={140}
    y={y}
    w={800}
    h={200}
    border={rgba(cor, 0.7)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 30,
      padding: "0 50px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 96 }}>{emoji}</span>
    <span
      style={{
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 50,
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  </Card>
);

export const VideoAnlodipino: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo =
    f < T.musculo
      ? ANL
      : f < T.dura
        ? COR
        : f < T.agora
          ? ANL
          : f < T.agua
            ? AZUL
            : f < T.atencao
              ? ROXO
              : CA;
  // pé que incha
  const incha = it(f, T.acumula - 10, T.acumula + 30, 0, 1, OUT);
  return (
    <AbsoluteFill>
      <Background
        color={corFundo}
        pulses={[
          T.tornozelo,
          T.aperta,
          T.fecha,
          T.cai,
          T.acumula,
          T.diminuir,
          T.final,
        ]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.musculo}>
        <Title
          f={f}
          at={2}
          y={220}
          size={68}
          font={SANS}
          weight={900}
          from={ANL}
        >
          O QUE O <span style={{ color: ANL }}>ANLODIPINO</span>
          <br />
          FAZ NOS SEUS VASOS?
        </Title>
        <Emoji f={f} at={6} x={400} y={880} size={200}>
          💊
        </Emoji>
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 880,
            transform: `translate(-50%,-50%) scale(${P(f, T.tornozelo - 6, T.tornozelo + 8) * (1 + 0.18 * P(f, T.tornozelo + 6, T.tornozelo + 30))})`,
            fontFamily: EMOJI,
            fontSize: 220,
            lineHeight: 1,
            filter: `drop-shadow(0 0 ${30 * P(f, T.tornozelo + 6, T.tornozelo + 30)}px ${rgba(AZUL, 0.8)})`,
          }}
        >
          🦶
        </div>
        <Chip
          f={f}
          x={540}
          y={1180}
          at={T.tornozelo + 10}
          txt="tornozelo inchado no fim do dia? 🤔"
          cor={AZUL}
          size={42}
        />
        <Chip
          f={f}
          x={540}
          y={1300}
          at={T.vasos}
          txt="a explicação está nos vasos"
          cor={ANL}
          size={42}
        />
      </Part>

      {/* 2. o músculo do vaso e o cálcio */}
      <Part from={T.musculo} to={T.portoes}>
        <Title
          f={f}
          at={T.musculo + 4}
          y={220}
          size={66}
          weight={600}
          from={COR}
        >
          o vaso tem <span style={{ color: COR }}>músculo</span> em volta
        </Title>
        <VasoCorte f={f} />
        <Chip
          f={f}
          x={540}
          y={1260}
          at={T.quando}
          txt="⚡ o cálcio entra → o vaso aperta"
          cor={CA}
          size={40}
        />
        <Svg>
          <Manometro
            x={540}
            y={1560}
            nivel={0.35 + 0.5 * P(f, T.sobe - 8, T.sobe + 10)}
            k={P(f, T.aperta, T.aperta + 10)}
          />
        </Svg>
      </Part>

      {/* 3. os portões e o anlodipino */}
      <Part from={T.portoes} to={T.dura}>
        <Title
          f={f}
          at={T.portoes + 4}
          y={220}
          size={64}
          weight={600}
          from={ROXO}
        >
          os <span style={{ color: ROXO }}>canais de cálcio</span>
        </Title>
        <Chip
          f={f}
          x={540}
          y={400}
          at={T.fecha}
          txt="🔒 o anlodipino fecha os portões"
          cor={ANL}
          size={40}
        />
        <Portoes f={f} />
        <Chip
          f={f}
          x={540}
          y={1180}
          at={T.relaxa}
          txt="o músculo relaxa 😌"
          cor={VERDE}
        />
        <Chip
          f={f}
          x={540}
          y={1280}
          at={T.abre}
          txt="o vaso abre ↔️"
          cor={VERDE}
        />
        <Svg>
          <Manometro
            x={540}
            y={1530}
            nivel={0.85 - 0.5 * P(f, T.cai - 8, T.cai + 12)}
            k={P(f, T.relaxa, T.relaxa + 10)}
          />
        </Svg>
      </Part>

      {/* 4. dura muito no corpo */}
      <Part from={T.dura} to={T.agora}>
        <Title f={f} at={T.dura + 4} y={220} size={68} weight={600} from={ANL}>
          ele fica <span style={{ color: ANL }}>muito tempo</span> no corpo
        </Title>
        <Emoji f={f} at={T.dura + 8} x={540} y={820} size={260}>
          ⏰
        </Emoji>
        <Chip
          f={f}
          x={540}
          y={1100}
          at={T.dura + 20}
          txt="cerca de 30 a 50 horas"
          cor={ANL}
          size={44}
        />
        <Chip
          f={f}
          x={540}
          y={1230}
          at={T.comprimido}
          txt="💊 1 comprimido por dia"
          cor={VERDE}
          size={48}
        />
      </Part>

      {/* 5. por que o tornozelo incha */}
      <Part from={T.agora} to={T.agua}>
        <Title
          f={f}
          at={T.agora + 4}
          y={220}
          size={70}
          weight={600}
          from={AZUL}
        >
          e o <span style={{ color: AZUL }}>tornozelo</span>?
        </Title>
        <Chip
          f={f}
          x={260}
          y={430}
          at={T.arterias}
          txt="abre muito"
          cor={VERM}
          size={34}
        />
        <Chip
          f={f}
          x={820}
          y={430}
          at={T.veias}
          txt="quase não abre"
          cor={AZUL}
          size={34}
        />
        <Circulacao f={f} />
        <Chip
          f={f}
          x={540}
          y={960}
          at={T.entra}
          txt="entra mais sangue do que sai"
          cor={CA}
          size={38}
        />
        <Chip
          f={f}
          x={300}
          y={1180}
          at={T.gravidade}
          txt="gravidade ⬇️"
          cor={AZUL}
          size={36}
        />
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1460,
            transform: `translate(-50%,-50%) scale(${P(f, T.gravidade - 10, T.gravidade + 6) * (1 + 0.25 * incha)})`,
            fontFamily: EMOJI,
            fontSize: 200,
            lineHeight: 1,
            filter: `drop-shadow(0 0 ${36 * incha}px ${rgba(AZUL, 0.9)})`,
          }}
        >
          🦶
        </div>
        <Chip
          f={f}
          x={540}
          y={1610}
          at={T.acumula}
          txt="acumula nos pés e tornozelos"
          cor={AZUL}
          size={38}
        />
      </Part>

      {/* 6. não é retenção de água */}
      <Part from={T.agua} to={T.quem}>
        <Title f={f} at={T.agua + 4} y={220} size={66} weight={600} from={AZUL}>
          não é <span style={{ color: AZUL }}>retenção de água</span>
        </Title>
        <Linha f={f} at={T.agua + 8} y={620} emoji="🚫" cor={AZUL}>
          não é o corpo <span style={{ color: AZUL }}>segurando água</span>
        </Linha>
        <Linha f={f} at={T.diuretico - 6} y={900} emoji="💧" cor={CA}>
          diurético costuma <span style={{ color: CA }}>ajudar pouco</span>
        </Linha>
      </Part>

      {/* 7. quem incha mais e o que ajuda */}
      <Part from={T.quem} to={T.atencao}>
        <Title f={f} at={T.quem + 4} y={220} size={64} weight={600} from={ROXO}>
          o inchaço é <span style={{ color: ROXO }}>mais comum</span>
        </Title>
        <Chip
          f={f}
          x={330}
          y={480}
          at={T.doses}
          txt="📈 doses maiores"
          cor={ROXO}
          size={40}
        />
        <Chip
          f={f}
          x={760}
          y={480}
          at={T.mulheres}
          txt="👩 mulheres"
          cor={ROXO}
          size={40}
        />
        <Card
          f={f}
          at={T.combinado - 6}
          x={110}
          y={700}
          w={860}
          h={420}
          border={rgba(VERDE, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 56,
              color: ANL,
            }}
          >
            anlodipino
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44 }}>
            +
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 46,
              lineHeight: 1.2,
            }}
          >
            família da <span style={{ color: COR }}>losartana</span> ou do{" "}
            <span style={{ color: COR }}>enalapril</span>
          </span>
        </Card>
        <Chip
          f={f}
          x={540}
          y={1260}
          at={T.diminuir}
          txt="📉 o inchaço costuma diminuir"
          cor={VERDE}
          size={42}
        />
      </Part>

      {/* 8. atenção */}
      <Part from={T.atencao} to={T.siga}>
        <Title
          f={f}
          at={T.atencao + 4}
          y={220}
          size={70}
          weight={600}
          from={VERM}
        >
          atenção ⚠️
        </Title>
        <Pill
          x={540}
          y={400}
          text="no começo, pode dar:"
          color={C.ink}
          size={36}
          k={P(f, T.atencao + 8, T.atencao + 20)}
        />
        <Emoji f={f} at={T.dor - 4} x={210} y={580} size={130}>
          🤕
        </Emoji>
        <Emoji f={f} at={T.rosto - 4} x={540} y={580} size={130}>
          😳
        </Emoji>
        <Emoji f={f} at={T.tontura - 4} x={870} y={580} size={130}>
          💫
        </Emoji>
        <Chip
          f={f}
          x={210}
          y={720}
          at={T.dor}
          txt="dor de cabeça"
          cor={CA}
          size={32}
        />
        <Chip
          f={f}
          x={540}
          y={720}
          at={T.rosto}
          txt="rosto vermelho"
          cor={CA}
          size={32}
        />
        <Chip
          f={f}
          x={870}
          y={720}
          at={T.tontura}
          txt="tontura"
          cor={CA}
          size={32}
        />
        <Linha f={f} at={T.inchar - 6} y={880} emoji="🦶" cor={VERM}>
          inchou? <span style={{ color: VERM }}>não pare sozinho</span>
        </Linha>
        <Linha f={f} at={T.medico - 6} y={1140} emoji="👩‍⚕️" cor={VERDE}>
          o médico pode <span style={{ color: VERDE }}>ajustar a dose</span>
        </Linha>
      </Part>

      {/* 9. me siga */}
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
          border={rgba(ANL, 0.7)}
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
              color: bornColor(f, T.siga, C.ink, ANL),
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

      {/* 10. tela final */}
      <Part from={T.final - 4} to={DURATION_ANLODIPINO} inY={100} outDur={1}>
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
                      ? bornColor(f, at, ANL, "#f0fdfa", 20)
                      : bornColor(f, at, C.ink, ANL),
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
      <Audio src={staticFile("anlodipino/narracao.mp3")} />
      <Audio
        src={staticFile("anlodipino/musica.wav")}
        loop
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_ANLODIPINO - 60, DURATION_ANLODIPINO))
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
