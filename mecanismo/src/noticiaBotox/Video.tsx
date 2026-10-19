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
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { Reporter, RW } from "../noticias/Reporter";
import boca from "./boca.json";

// Quadro "Notícias da Farmácia" #1: Anvisa manda apreender lote falsificado de toxina botulínica (19/10/2026).
// Narração gravada pela Larissa no ElevenLabs (Juliana, tom de repórter). Tempos: audio/noticiaBotox_palavras.json (quadro = segundos × 30).
const COR = "#f43f5e"; // vermelho de plantão
const VERDE = "#4ade80",
  VERM = "#ef4444",
  AMAR = "#fbbf24",
  AZUL = "#38bdf8";

// TEMPOS
export const T = {
  noticias: 26,
  hoje: 79,
  anvisa: 109,
  falsificado: 165,
  botulinica: 212,
  botox: 263,
  decisao: 303,
  diario: 344,
  dysport: 406,
  lote: 451,
  alerta: 529,
  falsas: 618,
  como: 661,
  detalhes: 707,
  validade: 745,
  v2028: 806,
  original: 851,
  v2027: 896,
  frasco: 948,
  codigo: 1007,
  outroLote: 1043,
  preocupa: 1076,
  ninguem: 1124,
  eua: 1222,
  palpebra: 1373,
  visao: 1406,
  engolir: 1438,
  respirar: 1484,
  entao: 1535,
  profissional: 1592,
  caixa: 1664,
  preco: 1750,
  seDepois: 1841,
  visao2: 1898,
  engolir2: 1925,
  respirar2: 1974,
  emergencia: 2003,
  outros: 2090,
  so: 2204,
  siga: 2260,
  final: 2370,
};
export const DURATION = 2460; // 82 s (narração de 78,4 s + mensagem final)
export const PARTES: [number, number][] = [
  [0, 309],
  [303, 667],
  [661, 1082],
  [1076, 1541],
  [1535, 1847],
  [1841, 2096],
  [2090, 2256],
  [2250, 2374],
  [2368, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  [T.noticias, "whoosh", 0.35],
  [T.anvisa, "pop", 0.22],
  [T.falsificado, "trava", 0.38],
  [R(1)[0], "whoosh", 0.3],
  [T.lote, "trava", 0.35],
  [T.alerta, "pop", 0.22],
  [R(2)[0], "whoosh", 0.3],
  [T.v2028, "pop", 0.22],
  [T.v2027, "pop", 0.22],
  [T.frasco, "pop", 0.22],
  [T.outroLote, "plim", 0.22],
  [R(3)[0], "whoosh", 0.3],
  [T.ninguem, "trava", 0.32],
  [T.palpebra, "pop", 0.2],
  [T.visao, "pop", 0.2],
  [T.engolir, "pop", 0.2],
  [T.respirar, "pop", 0.2],
  [R(4)[0], "whoosh", 0.3],
  [T.profissional, "pop", 0.22],
  [T.caixa, "pop", 0.22],
  [T.preco, "pop", 0.22],
  [R(5)[0], "whoosh", 0.3],
  [T.emergencia, "trava", 0.38],
  [R(6)[0], "whoosh", 0.3],
  [T.so, "plim", 0.25],
  [R(7)[0], "whoosh", 0.3],
  [R(8)[0], "whoosh", 0.3],
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
// frasco-ampola genérico (sem marca); "falso" tem outro formato
export const Frasco: React.FC<{
  x: number;
  y: number;
  s?: number;
  falso?: boolean;
  rot?: number;
}> = ({ x, y, s = 1, falso = false, rot = 0 }) => {
  const larg = falso ? 150 : 120;
  const alt = falso ? 190 : 220;
  const tampa = falso ? "#a855f7" : "#94a3b8";
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {/* tampa */}
      <rect
        x={-larg * 0.42}
        y={-alt / 2 - 62}
        width={larg * 0.84}
        height={40}
        rx={falso ? 20 : 8}
        fill={tampa}
      />
      {/* gargalo */}
      <rect
        x={-larg * 0.3}
        y={-alt / 2 - 26}
        width={larg * 0.6}
        height={30}
        fill="#e2e8f0"
        opacity={0.9}
      />
      {/* corpo de vidro */}
      <rect
        x={-larg / 2}
        y={-alt / 2}
        width={larg}
        height={alt}
        rx={falso ? 50 : 22}
        fill={rgba("#e0f2fe", 0.22)}
        stroke="#e2e8f0"
        strokeWidth={6}
      />
      {/* pó liofilizado */}
      <rect
        x={-larg / 2 + 10}
        y={alt / 2 - 50}
        width={larg - 20}
        height={40}
        rx={12}
        fill="#f8fafc"
        opacity={0.85}
      />
      {/* rótulo */}
      <rect
        x={-larg / 2 + 6}
        y={-alt / 2 + 40}
        width={larg - 12}
        height={70}
        rx={8}
        fill="#f8fafc"
      />
      <rect
        x={-larg / 2 + 18}
        y={-alt / 2 + 56}
        width={larg - 36}
        height={12}
        rx={6}
        fill={falso ? "#a855f7" : AZUL}
      />
      <rect
        x={-larg / 2 + 18}
        y={-alt / 2 + 80}
        width={(larg - 36) * 0.6}
        height={10}
        rx={5}
        fill="#cbd5e1"
      />
    </g>
  );
};
// carimbo
export const Carimbo: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  texto: string;
  cor?: string;
  size?: number;
  rot?: number;
}> = ({ f, at, x, y, texto, cor = VERM, size = 56, rot = -12 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${1.6 - 0.6 * k})`,
        opacity: Math.min(1, k * 1.4),
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 4,
        color: cor,
        border: `6px solid ${cor}`,
        borderRadius: 14,
        padding: "6px 22px",
        background: rgba("#0f172a", 0.55),
        whiteSpace: "nowrap",
        textShadow: `0 0 18px ${rgba(cor, 0.6)}`,
      }}
    >
      {texto}
    </div>
  );
};
// faixa fixa do quadro, no topo
const Faixa: React.FC<{ f: number }> = ({ f }) => {
  const k = P(f, R(1)[0], R(1)[0] + 14) * (1 - P(f, R(8)[0], R(8)[0] + 10));
  if (k <= 0) return null;
  const pisca = 0.55 + 0.45 * Math.abs(Math.sin(f / 9));
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        width: W,
        display: "flex",
        justifyContent: "center",
        opacity: k,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 3,
          color: C.ink,
          padding: "8px 24px",
          borderRadius: 30,
          background: rgba(COR, 0.18),
          border: `2px solid ${rgba(COR, 0.6)}`,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: COR,
            opacity: pisca,
            boxShadow: `0 0 12px ${COR}`,
          }}
        />
        NOTÍCIAS DA FARMÁCIA · 19/10/2026
      </span>
    </div>
  );
};

// 1. vinheta
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const barra = it(f, 4, 22, 0, 1, OUT);
  const pisca = 0.5 + 0.5 * Math.abs(Math.sin(f / 8));
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      {/* bloco da vinheta */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 60,
          width: 960 * barra,
          height: 230,
          overflow: "hidden",
          borderRadius: 24,
          background: `linear-gradient(90deg, ${COR}, ${rgba(COR, 0.75)})`,
          boxShadow: `0 0 50px ${rgba(COR, 0.5)}`,
        }}
      >
        <div
          style={{
            width: 960,
            height: 230,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 48,
            boxSizing: "border-box",
            opacity: P(f, 14, 26),
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: 6,
              color: "#fff1f2",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: "#ffffff",
                opacity: pisca,
              }}
            />
            PLANTÃO
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 66,
              lineHeight: 1.05,
              color: "#ffffff",
            }}
          >
            NOTÍCIAS DA FARMÁCIA
          </span>
        </div>
      </div>
      <Pill
        x={540}
        y={530}
        text="🗓️ 19/10/2026 · 🏛️ ANVISA"
        color={AMAR}
        size={32}
        k={P(f, T.anvisa, T.anvisa + 12)}
      />
      {/* coluna da esquerda: a âncora fica à direita (VideoNoticiaBotox) */}
      <Tela>
        <g opacity={P(f, T.anvisa + 10, T.anvisa + 24)}>
          <Frasco x={320} y={820} s={1.15} />
        </g>
      </Tela>
      <Carimbo
        f={f}
        at={T.falsificado}
        x={320}
        y={830}
        texto="LOTE FALSIFICADO"
        size={42}
      />
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 40,
          width: 560,
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 54,
          color: bornColor(f, T.botulinica, C.ink, COR),
          opacity: P(f, T.botulinica, T.botulinica + 12),
        }}
      >
        toxina botulínica
      </div>
      <Pill
        x={320}
        y={1180}
        text="💉 o famoso “botox”"
        color={COR}
        size={34}
        k={P(f, T.botox, T.botox + 12)}
      />
    </Part>
  );
};

// 2. a decisão no Diário Oficial
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const linha = (y: number, w: number, at: number) => (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: y,
        width: w * P(f, at, at + 14),
        height: 14,
        borderRadius: 7,
        background: "#cbd5e1",
      }}
    />
  );
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Card
        f={f}
        at={T.decisao}
        x={140}
        y={230}
        w={800}
        h={760}
        tilt={-1.2}
        style={{ background: "#f8fafc", color: "#0f172a" }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            width: 800,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 1,
          }}
        >
          DIÁRIO OFICIAL
        </div>
        <div
          style={{
            position: "absolute",
            top: 100,
            width: 800,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 24,
            color: "#475569",
          }}
        >
          19 de outubro de 2026 · Resolução da Anvisa
        </div>
        {linha(170, 660, T.decisao + 10)}
        {linha(200, 600, T.decisao + 14)}
        {linha(230, 640, T.decisao + 18)}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 290,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 38,
            opacity: P(f, T.dysport, T.dysport + 12),
          }}
        >
          Produto: <b>Dysport</b> (toxina botulínica)
        </div>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 370,
            padding: "10px 24px",
            borderRadius: 12,
            background: rgba(AMAR, 0.85 * P(f, T.lote, T.lote + 12)),
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: 2,
            opacity: P(f, T.lote, T.lote + 12),
          }}
        >
          LOTE 025155
        </div>
        {linha(520, 640, T.lote + 10)}
        {linha(550, 560, T.lote + 14)}
        {linha(580, 620, T.lote + 18)}
        {linha(610, 420, T.lote + 22)}
      </Card>
      <Carimbo
        f={f}
        at={T.lote + 24}
        x={700}
        y={870}
        texto="APREENSÃO"
        size={64}
        rot={-14}
      />
      <Pill
        x={540}
        y={1100}
        text="📣 alerta dado pela própria fabricante"
        color={AMAR}
        size={34}
        k={P(f, T.alerta, T.alerta + 12)}
      />
      <Pill
        x={540}
        y={1190}
        text="⚠️ unidades falsas circulando"
        color={COR}
        size={34}
        k={P(f, T.falsas, T.falsas + 12)}
      />
    </Part>
  );
};

// 3. como descobriram: original × falso
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const linhas: [string, string, number, string, number, string, number][] = [
    ["📅", "validade", T.validade, "jun/2027", T.original, "jun/2028", T.v2028],
    [
      "🧪",
      "frasco",
      T.frasco,
      "formato padrão",
      T.frasco + 8,
      "outro formato",
      T.frasco + 14,
    ],
    [
      "▮▮▯▮",
      "código de barras",
      T.codigo,
      "lote 025155",
      T.codigo + 10,
      "de OUTRO lote",
      T.outroLote,
    ],
  ];
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.como} y={200} size={64} weight={600} from={COR}>
        Como descobriram? <span style={{ fontFamily: EMOJI }}>🔍</span>
      </Title>
      <Pill
        x={540}
        y={320}
        text="nos detalhes"
        color={AMAR}
        size={34}
        k={P(f, T.detalhes, T.detalhes + 12)}
      />
      <Tela>
        <g opacity={P(f, T.detalhes + 6, T.detalhes + 20)}>
          <Frasco x={300} y={560} s={0.9} />
          <text
            x={300}
            y={730}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={36}
            fill={VERDE}
          >
            ORIGINAL ✓
          </text>
        </g>
        <g opacity={P(f, T.detalhes + 12, T.detalhes + 26)}>
          <Frasco x={780} y={560} s={0.9} falso />
          <text
            x={780}
            y={730}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={36}
            fill={VERM}
          >
            FALSO ✕
          </text>
        </g>
      </Tela>
      {linhas.map(([ic, rot, at, ok, atOk, ruim, atRuim], i) => (
        <Card
          key={rot}
          f={f}
          at={at}
          x={60}
          y={790 + i * 160}
          w={960}
          h={140}
          border={rgba(COR, 0.5)}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 360,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 36,
              color: VERDE,
              opacity: P(f, atOk, atOk + 10),
            }}
          >
            {ok}
          </div>
          <div
            style={{
              width: 240,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: ic.includes("▮") ? SANS : EMOJI,
                fontSize: ic.includes("▮") ? 36 : 48,
                fontWeight: 900,
                letterSpacing: ic.includes("▮") ? -2 : 0,
              }}
            >
              {ic}
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: C.dim }}>
              {rot}
            </span>
          </div>
          <div
            style={{
              width: 360,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 36,
              color: VERM,
              opacity: P(f, atRuim, atRuim + 10),
            }}
          >
            {ruim}
          </div>
        </Card>
      ))}
    </Part>
  );
};

// 4. por que preocupa
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const sint: [string, string, number][] = [
    ["😑", "pálpebra caída", T.palpebra],
    ["👀", "visão dupla", T.visao],
    ["😣", "dificuldade para engolir", T.engolir],
    ["🫁", "dificuldade para respirar", T.respirar],
  ];
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.preocupa} y={200} size={64} weight={600} from={COR}>
        Por que preocupa?
      </Title>
      <Tela>
        <g opacity={P(f, T.ninguem - 4, T.ninguem + 10)}>
          <Frasco x={540} y={500} s={1} falso />
        </g>
      </Tela>
      <Emoji f={f} at={T.ninguem} x={700} y={400} size={130}>
        ❓
      </Emoji>
      <Title
        f={f}
        at={T.ninguem + 6}
        y={680}
        size={44}
        font={SANS}
        weight={600}
        color={C.ink}
        from={COR}
      >
        ninguém sabe o que tem dentro
      </Title>
      <Pill
        x={540}
        y={800}
        text="🇺🇸 EUA, 2024: botox falsificado causou…"
        color={AMAR}
        size={32}
        k={P(f, T.eua, T.eua + 12)}
      />
      {sint.map(([e, txt, at], i) => (
        <Card
          key={txt}
          f={f}
          at={at}
          x={i % 2 === 0 ? 70 : 560}
          y={880 + Math.floor(i / 2) * 190}
          w={450}
          h={170}
          border={rgba(VERM, 0.6)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            textAlign: "center",
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 58 }}>{e}</span>
          <span style={{ fontWeight: 700, fontSize: 32, lineHeight: 1.15 }}>
            {txt}
          </span>
        </Card>
      ))}
    </Part>
  );
};

// 5. antes de aplicar
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.entao} y={200} size={62} weight={600} from={VERDE}>
        Antes de aplicar <span style={{ fontFamily: EMOJI }}>✅</span>
      </Title>
      <Item
        f={f}
        at={T.profissional}
        y={330}
        icone="👩‍⚕️"
        cor={VERDE}
        texto={
          <>
            escolha um <b style={{ color: VERDE }}>profissional habilitado</b>
          </>
        }
      />
      <Item
        f={f}
        at={T.caixa}
        y={500}
        icone="📦"
        cor={VERDE}
        texto={
          <>
            peça para ver <b style={{ color: VERDE }}>a caixa e o lote</b> do
            produto
          </>
        }
      />
      <Item
        f={f}
        at={T.preco}
        y={670}
        icone="💸"
        cor={AMAR}
        texto={
          <>
            preço muito abaixo do normal?{" "}
            <b style={{ color: AMAR }}>desconfie</b>
          </>
        }
      />
    </Part>
  );
};

// 6. sintomas depois da aplicação = emergência
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const sint: [string, number][] = [
    ["👀 visão dupla", T.visao2],
    ["😣 dificuldade para engolir", T.engolir2],
    ["🫁 dificuldade para respirar", T.respirar2],
  ];
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Emoji f={f} at={T.seDepois} x={540} y={300} size={150}>
        🚑
      </Emoji>
      <Title
        f={f}
        at={T.seDepois + 6}
        y={400}
        size={52}
        weight={600}
        color={C.ink}
        from={VERM}
      >
        Depois de uma aplicação:
      </Title>
      {sint.map(([txt, at], i) => (
        <Pill
          key={txt}
          x={540}
          y={560 + i * 100}
          text={txt}
          color={VERM}
          size={38}
          k={P(f, at, at + 10)}
        />
      ))}
      <Card
        f={f}
        at={T.emergencia}
        x={90}
        y={880}
        w={900}
        h={200}
        border={VERM}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: rgba(VERM, 0.2),
          boxShadow: `0 0 40px ${rgba(VERM, 0.4)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 70 }}>🏥</span>
        <span style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.1 }}>
          procure EMERGÊNCIA
          <br />
          <span style={{ color: VERM }}>na hora</span>
        </span>
      </Card>
    </Part>
  );
};

// 7. só esse lote
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Item
        f={f}
        at={T.outros}
        y={420}
        icone="✅"
        cor={VERDE}
        texto={
          <>
            os outros lotes <b style={{ color: VERDE }}>NÃO</b> foram afetados
          </>
        }
        h={170}
      />
      <Item
        f={f}
        at={T.so}
        y={640}
        icone="🚫"
        cor={VERM}
        texto={
          <>
            a medida vale só para o <b style={{ color: VERM }}>lote 025155</b>
          </>
        }
        h={170}
      />
    </Part>
  );
};

// 8. me siga
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
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
          para mais notícias e dicas
          <br />
          de farmacologia
        </span>
      </Card>
    </Part>
  );
};

// 9. mensagem final
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100} outDur={1}>
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
                  ? bornColor(f, at, COR, "#fff1f2", 20)
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

// a âncora do jornal: a farmacêutica do perfil, com a boca seguindo a narração (scripts/boca.py → boca.json).
// Grande à direita na vinheta, pequena no canto de baixo durante a notícia e no centro no "me siga".
const Ancora: React.FC<{ f: number }> = ({ f }) => {
  type Pose = { x: number; y: number; s: number };
  const grande: Pose = { x: 680, y: 570, s: 0.62 };
  const canto: Pose = { x: 30, y: 1330, s: 0.3 };
  const centro: Pose = { x: 540 - (RW * 0.45) / 2, y: 1040, s: 0.45 };
  const vai = (a: Pose, b: Pose, k: number): Pose => ({
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    s: a.s + (b.s - a.s) * k,
  });
  const k1 = it(f, R(1)[0] - 8, R(1)[0] + 16, 0, 1, OUT);
  const k2 = it(f, R(7)[0], R(7)[0] + 20, 0, 1, OUT);
  const p = vai(vai(grande, canto, k1), centro, k2);
  const entra = it(f, 8, 24, 0, 1, OUT);
  const sai = 1 - P(f, R(8)[0], R(8)[0] + 10);
  if (sai <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: p.x + (1 - entra) * 120,
        top: p.y + Math.sin(f / 26) * 4,
        transform: `scale(${p.s})`,
        transformOrigin: "0 0",
        opacity: Math.min(entra, sai),
        filter: `drop-shadow(0 0 24px ${rgba(COR, 0.35)})`,
      }}
    >
      <Reporter f={f} boca={boca as number[]} />
    </div>
  );
};

export const VideoNoticiaBotox: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(4)[0] && f < R(5)[0]
      ? VERDE
      : f >= R(6)[0] && f < R(7)[0]
        ? VERDE
        : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[T.falsificado, T.lote, T.ninguem, T.emergencia, T.final]}
      />
      <Faixa f={f} />
      <Ancora f={f} />
      <S1 />
      <S2 />
      <S3 />
      <S4 />
      <S5 />
      <S6 />
      <S7 />
      <S8 />
      <S9 />
      <Grain />
      <Audio src={staticFile("noticiaBotox/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio
        src={staticFile("noticiaBotox/musica.wav")}
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
