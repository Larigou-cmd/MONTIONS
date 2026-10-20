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
  rgba,
} from "../lib";
import { Card, EMOJI, Title } from "../aas/ui";

// "Como preparar a amoxicilina do jeito certo" no modelo "aula elegante", em formato de receita passo a passo:
// o frasco no centro é preparado ao vivo (pó solta, água até a marca, agita, espuma baixa, completa).
// Narração gravada pela Larissa (ElevenLabs, Juliana). Tempos: audio/amoxiPreparo_palavras.json (quadro = segundos × 30).
const COR = "#38bdf8"; // água / preparo
const VERDE = "#4ade80",
  VERM = "#ef4444",
  AMAR = "#fbbf24",
  AMBAR = "#b45309",
  CREME = "#fef3c7",
  GELO = "#93c5fd";

// TEMPOS
const T = {
  amoxicilina: 29,
  erro: 102,
  colherada: 186,
  passoAPasso: 215,
  passo1: 257,
  fechado: 320,
  agite1: 333,
  po: 376,
  passo2: 411,
  agua: 460,
  marca: 521,
  frasco: 557,
  passo3: 583,
  tampe: 617,
  agite3: 630,
  descansar: 678,
  confira: 716,
  baixou: 748,
  complete: 782,
  antes: 849,
  agiteNovo: 898,
  fundo: 958,
  errada: 1060,
  meca: 1094,
  seringa: 1115,
  colher: 1196,
  tamanho: 1279,
  prazo: 1300,
  sozinha: 1370,
  catorze: 1428,
  ambiente: 1477,
  clav: 1499,
  geladeira: 1583,
  sete: 1621,
  confiraBula: 1648,
  faca: 1712,
  fim: 1763,
  melhorar: 1821,
  passou: 1857,
  descarte: 1884,
  siga: 1930,
  final: 2060,
};
export const DURATION = 2150; // 71,7 s (narração de 68,4 s + mensagem final)
const PARTES: [number, number][] = [
  [0, 263],
  [257, 417],
  [411, 589],
  [583, 855],
  [849, 1100],
  [1094, 1306],
  [1300, 1718],
  [1712, 1936],
  [1930, 2064],
  [2058, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  [T.erro, "trava", 0.3],
  [R(1)[0], "whoosh", 0.3],
  [T.agite1, "pop", 0.2],
  [R(2)[0], "whoosh", 0.3],
  [T.marca, "plim", 0.25],
  [R(3)[0], "whoosh", 0.3],
  [T.agite3, "pop", 0.2],
  [T.baixou, "pop", 0.2],
  [T.complete + 30, "plim", 0.25],
  [R(4)[0], "whoosh", 0.3],
  [T.agiteNovo, "pop", 0.2],
  [T.errada, "trava", 0.3],
  [R(5)[0], "whoosh", 0.3],
  [T.seringa, "plim", 0.22],
  [T.colher, "trava", 0.3],
  [R(6)[0], "whoosh", 0.3],
  [T.catorze, "pop", 0.22],
  [T.sete, "pop", 0.22],
  [R(7)[0], "whoosh", 0.3],
  [T.fim, "plim", 0.22],
  [T.descarte, "pop", 0.22],
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
// selo do passo: número grande num círculo + texto
const Passo: React.FC<{ f: number; at: number; n: number; texto: string }> = ({
  f,
  at,
  n,
  texto,
}) => {
  if (f < at - 2) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 0,
        width: W,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity: Math.min(1, k * 1.5),
        transform: `scale(${0.8 + 0.2 * k})`,
      }}
    >
      <span
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          background: COR,
          color: "#0f172a",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 30px ${rgba(COR, 0.6)}`,
        }}
      >
        {n}
      </span>
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 56,
          color: C.ink,
        }}
      >
        {texto}
      </span>
    </div>
  );
};

// ---------- o frasco, preparado ao vivo (cenas 1 a 5) ----------
const FX = 540,
  TOPO = 640,
  FUNDO = 1180,
  MARCA = 730;
const Frasco: React.FC<{ f: number }> = ({ f }) => {
  if (f > R(4)[1]) return null;
  const entra = it(f, 4, 24, 0, 1, OUT);
  const sai = 1 - P(f, R(4)[1] - 14, R(4)[1]);
  // chacoalhar
  const janela = (a: number, b: number) =>
    f >= a && f < b ? Math.sin((f - a) * 1.1) * 9 * (1 - (f - a) / (b - a)) : 0;
  const ang =
    janela(T.agite1, T.po + 25) +
    janela(T.agite3, T.descansar) +
    janela(T.agiteNovo, T.agiteNovo + 45);
  // nível da suspensão (y do topo do líquido)
  const enche = it(f, T.agua, T.marca + 6, 0, 1, EASE);
  const baixa = it(f, T.descansar + 10, T.baixou + 10, 0, 1, EASE);
  const completa = it(f, T.complete + 10, T.complete + 40, 0, 1, EASE);
  const nivel = FUNDO - (FUNDO - MARCA) * enche + 22 * baixa - 22 * completa;
  const temAgua = enche > 0;
  const espuma =
    P(f, T.agite3 + 6, T.agite3 + 20) * (1 - P(f, T.descansar, T.baixou));
  const tampa = Math.min(
    1,
    1 - P(f, T.agua - 30, T.agua - 12) + P(f, T.tampe - 10, T.tampe + 6),
  );
  // depósito no fundo (antes de agitar de novo)
  const assentado =
    P(f, T.antes - 6, T.antes + 10) * (1 - P(f, T.agiteNovo, T.agiteNovo + 20));
  const solto = it(f, T.agite1, T.po + 10, 0, 1, OUT); // pó solto depois de agitar
  return (
    <Tela>
      <g opacity={entra * sai} transform={`rotate(${ang},${FX},${FUNDO})`}>
        <defs>
          <clipPath id="vidro">
            <rect
              x={FX - 150}
              y={TOPO}
              width={300}
              height={FUNDO - TOPO}
              rx={46}
            />
          </clipPath>
          <linearGradient id="ambar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="45%" stopColor={AMBAR} />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>
        {/* gargalo */}
        <rect
          x={FX - 62}
          y={TOPO - 70}
          width={124}
          height={80}
          rx={14}
          fill="url(#ambar)"
          opacity={0.85}
        />
        {/* corpo de vidro âmbar */}
        <rect
          x={FX - 150}
          y={TOPO}
          width={300}
          height={FUNDO - TOPO}
          rx={46}
          fill="url(#ambar)"
          opacity={0.55}
        />
        <g clipPath="url(#vidro)">
          {/* pó (antes da água) */}
          {!temAgua && (
            <g>
              {Array.from({ length: 70 }, (_, i) => {
                const px = FX - 135 + ((i * 37) % 270);
                const pula =
                  f < T.po + 25
                    ? Math.abs(Math.sin(i + f / 5)) * 30 * solto
                    : 0;
                const py =
                  FUNDO - 14 - ((i * 13) % 90) * (0.4 + 0.6 * solto) - pula;
                return (
                  <circle
                    key={i}
                    cx={px}
                    cy={py}
                    r={7}
                    fill="#fffbeb"
                    opacity={0.95}
                  />
                );
              })}
            </g>
          )}
          {/* suspensão */}
          {temAgua && (
            <g>
              <rect
                x={FX - 150}
                y={nivel}
                width={300}
                height={FUNDO - nivel}
                fill={CREME}
                opacity={0.9 - 0.5 * assentado}
              />
              {assentado > 0 && (
                <rect
                  x={FX - 150}
                  y={FUNDO - 120}
                  width={300}
                  height={120}
                  fill="#fde68a"
                  opacity={assentado}
                />
              )}
              {espuma > 0 &&
                Array.from({ length: 14 }, (_, i) => (
                  <circle
                    key={i}
                    cx={FX - 130 + i * 20}
                    cy={nivel - 8 - (i % 3) * 8}
                    r={12 + (i % 3) * 4}
                    fill="#ffffff"
                    opacity={espuma * 0.95}
                  />
                ))}
            </g>
          )}
        </g>
        {/* marca do frasco */}
        <line
          x1={FX - 150}
          y1={MARCA}
          x2={FX - 90}
          y2={MARCA}
          stroke="#ffffff"
          strokeWidth={6}
        />
        {/* rótulo */}
        <rect
          x={FX - 140}
          y={860}
          width={280}
          height={200}
          rx={14}
          fill="#f8fafc"
        />
        <rect x={FX - 140} y={860} width={280} height={54} rx={14} fill={COR} />
        <rect x={FX - 140} y={890} width={280} height={24} fill={COR} />
        <text
          x={FX}
          y={900}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={30}
          fill="#0f172a"
        >
          AMOXICILINA
        </text>
        <text
          x={FX}
          y={960}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={700}
          fontSize={24}
          fill="#334155"
        >
          pó para suspensão oral
        </text>
        <text
          x={FX}
          y={1000}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={600}
          fontSize={22}
          fill="#64748b"
        >
          agite antes de usar
        </text>
        {/* reflexo */}
        <rect
          x={FX - 125}
          y={TOPO + 30}
          width={22}
          height={FUNDO - TOPO - 80}
          rx={11}
          fill="#ffffff"
          opacity={0.18}
        />
        {/* tampa */}
        <g
          transform={`translate(${(1 - tampa) * 260},${(1 - tampa) * -120}) rotate(${(1 - tampa) * 30},${FX},${TOPO - 90})`}
        >
          <rect
            x={FX - 76}
            y={TOPO - 120}
            width={152}
            height={64}
            rx={14}
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth={4}
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={FX - 60 + i * 24}
              y1={TOPO - 112}
              x2={FX - 60 + i * 24}
              y2={TOPO - 64}
              stroke="#cbd5e1"
              strokeWidth={3}
            />
          ))}
        </g>
      </g>
      {/* seta da marca (fora da rotação) */}
      <g
        opacity={
          P(f, T.marca - 6, T.marca + 6) *
          (1 - P(f, R(4)[0], R(4)[0] + 10)) *
          sai
        }
      >
        <polygon
          points={`${FX - 175},${MARCA} ${FX - 215},${MARCA - 22} ${FX - 215},${MARCA + 22}`}
          fill={AMAR}
        />
        <text
          x={FX - 225}
          y={MARCA + 12}
          textAnchor="end"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={36}
          fill={AMAR}
        >
          marca
        </text>
      </g>
      {/* copo de água filtrada despejando */}
      {f >= T.agua - 30 && f < T.marca + 30 && (
        <g
          opacity={
            P(f, T.agua - 30, T.agua - 12) *
            (1 - P(f, T.marca + 10, T.marca + 30))
          }
        >
          <g
            transform={`rotate(${-70 * it(f, T.agua - 20, T.agua, 0, 1, OUT)},800,470)`}
          >
            <path
              d="M 740 380 L 860 380 L 845 560 L 755 560 Z"
              fill={rgba(COR, 0.25)}
              stroke="#e0f2fe"
              strokeWidth={5}
            />
            <rect
              x={760}
              y={430}
              width={80}
              height={125}
              fill={rgba(COR, 0.6)}
            />
          </g>
          {f >= T.agua && (
            <path
              d={`M 690 470 Q ${620 + Math.sin(f / 3) * 4} 520 ${FX} ${TOPO - 70}`}
              stroke={COR}
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              opacity={0.85}
            />
          )}
          <text
            x={800}
            y={620}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={30}
            fill={COR}
          >
            água filtrada
          </text>
        </g>
      )}
      {/* gota que completa */}
      {f >= T.complete && f < T.complete + 30 && (
        <path
          d={`M ${FX} ${TOPO - 150 + (f - T.complete) * 18} c -12 18 -12 30 0 30 c 12 0 12 -12 0 -30 Z`}
          fill={COR}
        />
      )}
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
          top: 180,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 72,
          lineHeight: 1.08,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        VOCÊ PREPARA A
        <br />
        <span style={{ color: COR }}>AMOXICILINA</span> CERTO?
      </div>
      <Pill
        x={540}
        y={420}
        text="⚠️ um erro muda a dose de cada colherada"
        color={VERM}
        size={30}
        k={P(f, T.erro, T.erro + 12)}
      />
      <Pill
        x={540}
        y={1320}
        text="🧑‍🍳 o passo a passo"
        color={AMAR}
        size={40}
        k={P(f, T.passoAPasso, T.passoAPasso + 12)}
      />
    </Part>
  );
};

// ---------- 2 a 4. os passos ----------
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={40}>
      <Passo f={f} at={T.passo1} n={1} texto="Agite o pó" />
      <Pill
        x={540}
        y={360}
        text="🔒 frasco ainda fechado"
        color={COR}
        size={32}
        k={P(f, T.fechado, T.fechado + 12)}
      />
      <Pill
        x={540}
        y={1320}
        text="solta o pó do fundo"
        color={AMAR}
        size={34}
        k={P(f, T.po, T.po + 12)}
      />
    </Part>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={40}>
      <Passo f={f} at={T.passo2} n={2} texto="Água até a marca" />
      <Pill
        x={540}
        y={360}
        text="💧 água filtrada, com calma"
        color={COR}
        size={32}
        k={P(f, T.agua, T.agua + 12)}
      />
      <Pill
        x={540}
        y={1320}
        text="🎯 até a marca do frasco"
        color={AMAR}
        size={34}
        k={P(f, T.marca, T.marca + 12)}
      />
    </Part>
  );
};
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={40}>
      <Passo f={f} at={T.passo3} n={3} texto="Agite e confira" />
      <Pill
        x={540}
        y={360}
        text="⏳ deixe descansar um pouquinho"
        color={COR}
        size={32}
        k={P(f, T.descansar, T.descansar + 12)}
      />
      <Pill
        x={540}
        y={1320}
        text="baixou? complete até a marca ✅"
        color={VERDE}
        size={34}
        k={P(f, T.baixou, T.baixou + 12)}
      />
    </Part>
  );
};
// ---------- 5. agite antes de cada dose ----------
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={40}>
      <Title f={f} at={T.antes} y={200} size={56} weight={600} from={COR}>
        Antes de CADA dose
      </Title>
      <Pill
        x={540}
        y={330}
        text="🔄 agite de novo"
        color={COR}
        size={36}
        k={P(f, T.agiteNovo, T.agiteNovo + 12)}
      />
      <Pill
        x={540}
        y={1320}
        text="o remédio assenta no fundo"
        color={AMAR}
        size={32}
        k={P(f, T.fundo, T.fundo + 12)}
      />
      <Pill
        x={540}
        y={1410}
        text="❌ sem agitar, a dose sai errada"
        color={VERM}
        size={32}
        k={P(f, T.errada, T.errada + 12)}
      />
    </Part>
  );
};

// ---------- 6. medir certo ----------
const Seringa: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      x={-40}
      y={-200}
      width={80}
      height={330}
      rx={14}
      fill={rgba("#e0f2fe", 0.35)}
      stroke="#e0f2fe"
      strokeWidth={5}
    />
    <rect
      x={-36}
      y={-40}
      width={72}
      height={166}
      rx={10}
      fill={CREME}
      opacity={0.9}
    />
    {Array.from({ length: 9 }, (_, i) => (
      <line
        key={i}
        x1={-40}
        y1={-180 + i * 36}
        x2={i % 2 ? -20 : -6}
        y2={-180 + i * 36}
        stroke="#e0f2fe"
        strokeWidth={4}
      />
    ))}
    <rect x={-12} y={130} width={24} height={50} rx={6} fill="#e0f2fe" />
    <rect x={-56} y={-230} width={112} height={30} rx={8} fill="#e0f2fe" />
    <rect x={-10} y={-300} width={20} height={80} fill="#e0f2fe" />
    <rect x={-50} y={-320} width={100} height={22} rx={8} fill="#e0f2fe" />
  </g>
);
const Colher: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-30)`}>
    <ellipse
      cx={0}
      cy={0}
      rx={46}
      ry={32}
      fill="#cbd5e1"
      stroke="#f1f5f9"
      strokeWidth={4}
    />
    <rect x={40} y={-8} width={150} height={16} rx={8} fill="#cbd5e1" />
  </g>
);
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const xk = P(f, T.colher + 10, T.colher + 24);
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={60}>
      <Title f={f} at={T.meca} y={200} size={56} weight={600} from={COR}>
        Meça do jeito certo
      </Title>
      <Tela>
        <g opacity={P(f, T.seringa, T.seringa + 14)}>
          <Seringa x={290} y={780} />
          <text
            x={290}
            y={1040}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={34}
            fill={VERDE}
          >
            seringa / copinho ✓
          </text>
        </g>
        <g opacity={P(f, T.colher, T.colher + 14)}>
          <Colher x={720} y={620} s={0.7} />
          <Colher x={760} y={780} s={1} />
          <Colher x={720} y={930} s={1.3} />
          <text
            x={760}
            y={1080}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={34}
            fill={VERM}
          >
            colher de cozinha ✕
          </text>
          {xk > 0 && (
            <text
              x={760}
              y={850}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={900}
              fontSize={260 * xk}
              fill={VERM}
              opacity={0.85}
              style={{ filter: `drop-shadow(0 0 16px ${VERM})` }}
            >
              ✕
            </text>
          )}
        </g>
      </Tela>
      <Pill
        x={540}
        y={1200}
        text="📏 cada colher tem um tamanho"
        color={AMAR}
        size={34}
        k={P(f, T.tamanho - 30, T.tamanho - 18)}
      />
    </Part>
  );
};

// ---------- 7. guardar e validade ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const quadros = (x: number, y: number, n: number, cor: string, at: number) =>
    Array.from({ length: n }, (_, i) => (
      <rect
        key={i}
        x={x + (i % 7) * 52}
        y={y + Math.floor(i / 7) * 52}
        width={44}
        height={44}
        rx={8}
        fill={cor}
        opacity={P(f, at + i * 2, at + i * 2 + 6)}
      />
    ));
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={60}>
      <Title f={f} at={T.prazo} y={200} size={56} weight={600} from={AMAR}>
        Depois de pronta, tem prazo
      </Title>
      <Card
        f={f}
        at={T.sozinha}
        x={70}
        y={340}
        w={940}
        h={360}
        border={rgba(AMAR, 0.7)}
      >
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 40,
            fontWeight: 900,
            fontSize: 42,
            color: AMAR,
          }}
        >
          amoxicilina
        </div>
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 40,
            fontWeight: 700,
            fontSize: 34,
          }}
        >
          <span style={{ fontFamily: EMOJI }}>🌡️</span> temperatura ambiente
        </div>
        <div
          style={{
            position: "absolute",
            top: 160,
            right: 50,
            fontWeight: 900,
            fontSize: 70,
            color: AMAR,
            opacity: P(f, T.catorze, T.catorze + 10),
          }}
        >
          14 dias
        </div>
      </Card>
      <Card
        f={f}
        at={T.clav}
        x={70}
        y={740}
        w={940}
        h={360}
        border={rgba(GELO, 0.7)}
      >
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 40,
            fontWeight: 900,
            fontSize: 42,
            color: GELO,
          }}
        >
          amoxicilina + clavulanato
        </div>
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 40,
            fontWeight: 700,
            fontSize: 34,
            opacity: P(f, T.geladeira, T.geladeira + 10),
          }}
        >
          <span style={{ fontFamily: EMOJI }}>❄️</span> geladeira
        </div>
        <div
          style={{
            position: "absolute",
            top: 160,
            right: 50,
            fontWeight: 900,
            fontSize: 70,
            color: GELO,
            opacity: P(f, T.sete, T.sete + 10),
          }}
        >
          7 dias
        </div>
      </Card>
      <Tela>
        {f >= T.sozinha + 6 && quadros(110, 520, 14, AMAR, T.catorze)}
        {f >= T.clav + 6 && quadros(110, 920, 7, GELO, T.sete)}
      </Tela>
      <Pill
        x={540}
        y={1180}
        text="📄 confira sempre a bula do seu frasco"
        color={COR}
        size={34}
        k={P(f, T.confiraBula, T.confiraBula + 12)}
      />
    </Part>
  );
};

// ---------- 8. até o fim ----------
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={60}>
      <Title f={f} at={T.faca} y={200} size={56} weight={600} from={VERDE}>
        Tratamento até o fim
      </Title>
      <Item
        f={f}
        at={T.faca + 10}
        y={340}
        icone="⏰"
        cor={VERDE}
        texto="no horário certo"
      />
      <Item
        f={f}
        at={T.fim}
        y={500}
        icone="📅"
        cor={VERDE}
        texto={
          <>
            até o último dia, <b style={{ color: VERDE }}>mesmo se melhorar</b>
          </>
        }
      />
      <Item
        f={f}
        at={T.descarte}
        y={660}
        icone="🗑️"
        cor={VERM}
        texto={
          <>
            passou do prazo? <b style={{ color: VERM }}>descarte</b> o que
            sobrou
          </>
        }
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
                  ? bornColor(f, at, COR, "#f0f9ff", 20)
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

export const VideoAmoxiPreparo: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(6)[0] && f < R(7)[0]
      ? AMAR
      : f >= R(7)[0] && f < R(8)[0]
        ? VERDE
        : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[T.erro, T.marca, T.complete + 30, T.errada, T.colher, T.final]}
      />
      <Frasco f={f} />
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
      <Audio src={staticFile("amoxiPreparo/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio
        src={staticFile("amoxiPreparo/musica.wav")}
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

// Capa (1080×1920): o frasco pronto com a seta na marca. Os 20% de baixo ficam livres (contador do TikTok).
export const CapaAmoxiPreparo: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 150,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 84,
        lineHeight: 1.05,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      VOCÊ PREPARA A
      <br />
      <span style={{ color: COR }}>AMOXICILINA</span>
      <br />
      DO JEITO CERTO?
    </div>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: W,
        height: 1920,
        transform: "translateY(20px) scale(0.85)",
        transformOrigin: "540px 900px",
      }}
    >
      <Frasco f={T.complete + 60} />
    </div>
    <div
      style={{
        position: "absolute",
        top: 1250,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {["1 agite", "2 água até a marca", "3 confira"].map((t) => (
        <span
          key={t}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 32,
            color: C.ink,
            padding: "12px 20px",
            borderRadius: 30,
            border: `2px solid ${rgba(COR, 0.7)}`,
            background: rgba(COR, 0.14),
          }}
        >
          {t}
        </span>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        top: 1370,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 38,
        color: AMAR,
      }}
    >
      + quanto tempo ela dura depois de pronta
    </div>
    <Grain />
  </AbsoluteFill>
);
