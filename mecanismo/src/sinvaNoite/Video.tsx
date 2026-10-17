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

// "Por que a sinvastatina é tomada à noite?" (parte 2 do vídeo da sinvastatina) no modelo "aula elegante":
// fundo escuro com brilho, títulos em serifa, cartões arredondados, sem legenda e sem referências na tela.
// Tempos em quadros (30 fps), tirados de audio/sinvaNoite_palavras.json (quadro = segundos × 30).
const COR = "#2dd4bf"; // sinvastatina (mesma cor da parte 1)
const NOITE = "#818cf8";
const GORD = "#fbbf24"; // colesterol
const FIG = "#c2410c"; // fígado
const VERDE = "#4ade80",
  VERM = "#ef4444",
  LONGA = "#c084fc";
export const DURATION = 2930; // 97,7 s (narração de 93,9 s + mensagem final)

const T = {
  parte: 7,
  sinva: 77,
  noite: 118,
  figado: 182,
  dia: 233,
  fabrica: 276,
  ritmo: 340,
  relogio: 380,
  pico: 439,
  noite2: 499,
  dorme: 538,
  jejum: 566,
  peca: 596,
  enzima: 661,
  hmg: 689,
  controla: 782,
  lenta: 822,
  velocidade: 862,
  exatamente: 945,
  bloqueiam: 1019,
  detalhe: 1071,
  meiaVida: 1142,
  sinva2: 1182,
  curta: 1233,
  entra: 1298,
  age: 1317,
  saindo: 1355,
  manha: 1418,
  madrugada: 1452,
  sobrou: 1539,
  sangue: 1576,
  tomandoNoite: 1600,
  auge: 1653,
  produzindo: 1718,
  sincronizar: 1764,
  outras: 1850,
  ator: 1910,
  rosu: 1943,
  longa: 1998,
  diaInteiro: 2066,
  qualquer: 2156,
  mesmo: 2230,
  resumindo: 2252,
  sinva3: 2278,
  dura: 2338,
  madrugada3: 2423,
  esquecer: 2458,
  nunca: 2498,
  mude: 2589,
  siga: 2684,
  final: 2830,
};
const PARTES: [number, number][] = [
  [0, 176],
  [170, 590],
  [584, 1065],
  [1059, 1411],
  [1405, 1844],
  [1838, 2246],
  [2240, 2454],
  [2448, 2680],
  [2674, 2832],
  [2826, DURATION],
];
const SFX: [number, string, number][] = [
  [7, "pop", 0.25],
  [118, "plim", 0.25],
  [170, "whoosh", 0.3],
  [233, "pop", 0.2],
  [340, "pop", 0.22],
  [439, "pop", 0.25],
  [499, "plim", 0.22],
  [566, "pop", 0.2],
  [584, "whoosh", 0.3],
  [689, "pop", 0.25],
  [822, "pop", 0.22],
  [1019, "trava", 0.42],
  [1059, "whoosh", 0.3],
  [1233, "pop", 0.25],
  [1298, "pop", 0.2],
  [1317, "pop", 0.2],
  [1355, "pop", 0.2],
  [1405, "whoosh", 0.3],
  [1539, "trava", 0.38],
  [1653, "plim", 0.28],
  [1764, "pop", 0.22],
  [1838, "whoosh", 0.3],
  [1910, "pop", 0.22],
  [1943, "pop", 0.22],
  [1998, "pop", 0.22],
  [2156, "plim", 0.22],
  [2230, "pop", 0.2],
  [2240, "whoosh", 0.3],
  [2278, "pop", 0.25],
  [2338, "pop", 0.22],
  [2423, "pop", 0.22],
  [2448, "whoosh", 0.3],
  [2498, "trava", 0.35],
  [2589, "pop", 0.25],
  [2674, "whoosh", 0.3],
  [2684, "plim", 0.28],
  [2740, "pop", 0.22],
  [2770, "pop", 0.22],
  [2826, "whoosh", 0.3],
  [2830, "plim", 0.3],
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
    <span style={{ fontFamily: EMOJI, fontSize: 60, flexShrink: 0 }}>
      {icone}
    </span>
    <span
      style={{
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.25,
        color: bornColor(f, at, C.ink, cor ?? COR),
      }}
    >
      {texto}
    </span>
  </Card>
);
const Marca: React.FC<{ x: number; y: number; k: number; ok: boolean }> = ({
  x,
  y,
  k,
  ok,
}) =>
  k <= 0 ? null : (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={800}
      fontSize={110 * SNAP(Math.min(1, k))}
      fill={ok ? VERDE : C.alert}
      style={{ filter: `drop-shadow(0 0 16px ${ok ? VERDE : C.alert})` }}
    >
      {ok ? "✓" : "✕"}
    </text>
  );

// curvas (esquemáticas): produção de colesterol no fígado ao longo do dia e nível do remédio no sangue
const sintese = (h: number) =>
  0.22 + 0.78 * Math.exp(-((h - 26) ** 2) / (2 * 3.2 ** 2)); // pico de madrugada (≈ 2 h)
const curva = (t: number, ka: number, k: number) => {
  if (t <= 0) return 0;
  const tmax = Math.log(ka / k) / (ka - k);
  return (
    (Math.exp(-k * t) - Math.exp(-ka * t)) /
    (Math.exp(-k * tmax) - Math.exp(-ka * tmax))
  );
};
const remedio = (h: number, dose: number) => curva(h - dose, 1.2, 0.33); // meia-vida curta
const remedioLongo = (h: number, dose: number) =>
  0.55 * curva(h - dose, 1.2, 0.035) + 0.45 * curva(h - dose + 24, 1.2, 0.035); // meia-vida longa (dose de ontem + de hoje)

const caminho = (
  fn: (h: number) => number,
  h0: number,
  h1: number,
  x: number,
  y: number,
  w: number,
  h: number,
  p: number,
) => {
  const n = 120;
  const pts: string[] = [];
  for (let i = 0; i <= Math.round(n * Math.max(0, Math.min(1, p))); i++) {
    const hr = h0 + ((h1 - h0) * i) / n;
    pts.push(
      `${(x + (w * i) / n).toFixed(1)},${(y + h * (1 - 0.86 * fn(hr))).toFixed(1)}`,
    );
  }
  return pts.length > 1 ? `M${pts.join(" L")}` : "";
};

// gráfico de 24 horas (das 6 h às 6 h do dia seguinte)
const Grafico: React.FC<{
  f: number;
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  sAt?: number;
  noiteAt?: number;
  dose?: number;
  dAt?: number;
  picoAt?: number;
  longo?: boolean;
  dCor?: string;
}> = ({
  f,
  x,
  y,
  w,
  h,
  at,
  sAt,
  noiteAt,
  dose,
  dAt,
  picoAt,
  longo,
  dCor = COR,
}) => {
  const a = P(f, at, at + 14);
  if (a <= 0) return null;
  const hx = (hr: number) => x + ((hr - 6) / 24) * w;
  const nk = noiteAt !== undefined ? P(f, noiteAt, noiteAt + 18) : 0;
  const fn = (hr: number) =>
    longo ? remedioLongo(hr, dose ?? 0) : remedio(hr, dose ?? 0);
  const pd = dAt !== undefined ? P(f, dAt, dAt + 60) : 0;
  return (
    <g opacity={a}>
      {nk > 0 && (
        <g opacity={nk}>
          <rect
            x={hx(19)}
            y={y}
            width={hx(30) - hx(19)}
            height={h}
            rx={18}
            fill={rgba(NOITE, 0.14)}
          />
          <text
            x={hx(20.6)}
            y={y + 52}
            textAnchor="middle"
            fontFamily={EMOJI}
            fontSize={42}
          >
            🌙
          </text>
        </g>
      )}
      <line
        x1={x}
        y1={y + h}
        x2={x + w}
        y2={y + h}
        stroke={C.dim}
        strokeWidth={3}
      />
      {[6, 12, 18, 24, 30].map((hr) => (
        <g key={hr}>
          <line
            x1={hx(hr)}
            y1={y + h}
            x2={hx(hr)}
            y2={y + h + 12}
            stroke={C.dim}
            strokeWidth={3}
          />
          <text
            x={hx(hr)}
            y={y + h + 50}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={600}
            fontSize={30}
            fill={C.dim}
          >{`${hr % 24}h`}</text>
        </g>
      ))}
      <text
        x={hx(12)}
        y={y + 52}
        textAnchor="middle"
        fontFamily={EMOJI}
        fontSize={42}
      >
        ☀️
      </text>
      {sAt !== undefined && (
        <path
          d={caminho(sintese, 6, 30, x, y, w, h, P(f, sAt, sAt + 70))}
          fill="none"
          stroke={GORD}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 10px ${rgba(GORD, 0.6)})` }}
        />
      )}
      {picoAt !== undefined && f >= picoAt && (
        <g opacity={P(f, picoAt, picoAt + 10)}>
          <circle
            cx={hx(26)}
            cy={y + h * (1 - 0.86)}
            r={14 + 4 * Math.sin(f / 5)}
            fill={GORD}
          />
          <text
            x={hx(26) + 26}
            y={y + h * (1 - 0.86) - 10}
            textAnchor="start"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={34}
            fill={GORD}
          >
            PICO
          </text>
        </g>
      )}
      {dose !== undefined && dAt !== undefined && f >= dAt && (
        <g>
          <path
            d={`${caminho(fn, 6, 30, x, y, w, h, pd)} L${x + w * pd},${y + h} L${x},${y + h} Z`}
            fill={rgba(dCor, 0.16)}
            stroke="none"
          />
          <path
            d={caminho(fn, 6, 30, x, y, w, h, pd)}
            fill="none"
            stroke={dCor}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 10px ${rgba(dCor, 0.6)})` }}
          />
          {!longo && (
            <text
              x={hx(dose)}
              y={y + h - 16}
              textAnchor="middle"
              fontFamily={EMOJI}
              fontSize={44}
              opacity={P(f, dAt, dAt + 10)}
            >
              💊
            </text>
          )}
        </g>
      )}
    </g>
  );
};
const Legenda: React.FC<{
  f: number;
  at: number;
  y: number;
  itens: [string, string][];
}> = ({ f, at, y, itens }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      width: W,
      display: "flex",
      justifyContent: "center",
      gap: 40,
      opacity: P(f, at, at + 14),
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 30,
      color: C.dim,
    }}
  >
    {itens.map(([cor, t]) => (
      <span key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 34,
            height: 8,
            borderRadius: 4,
            background: cor,
            boxShadow: `0 0 10px ${cor}`,
          }}
        />
        {t}
      </span>
    ))}
  </div>
);

// engrenagem da "fábrica" de colesterol
const Engrenagem: React.FC<{
  x: number;
  y: number;
  r: number;
  giro: number;
  cor: string;
}> = ({ x, y, r, giro, cor }) => (
  <g transform={`translate(${x},${y}) rotate(${giro})`}>
    {Array.from({ length: 10 }, (_, i) => (
      <rect
        key={i}
        x={-r * 0.16}
        y={-r * 1.28}
        width={r * 0.32}
        height={r * 0.42}
        rx={4}
        fill={cor}
        transform={`rotate(${i * 36})`}
      />
    ))}
    <circle r={r} fill={cor} />
    <circle r={r * 0.4} fill="#1c1917" />
  </g>
);

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <Pill
        x={540}
        y={300}
        text="PARTE 2"
        color={COR}
        size={40}
        k={P(f, T.parte, T.parte + 12)}
      />
      <Emoji f={f} at={T.sinva - 30} x={540} y={720} size={300}>
        🌙
      </Emoji>
      <Title f={f} at={T.sinva} y={960} size={78} weight={600} from={COR}>
        Sinvastatina
      </Title>
      <Title
        f={f}
        at={T.noite - 16}
        y={1080}
        size={58}
        weight={600}
        color={NOITE}
        from={NOITE}
      >
        por que tomar à noite?
      </Title>
    </Part>
  );
};

// 2. o fígado fabrica colesterol num ritmo que segue o relógio do corpo
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const giro = f * 2.5;
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title f={f} at={T.figado} y={225} size={58} weight={600} from={FIG}>
        O fígado fabrica colesterol
      </Title>
      <Tela>
        <g
          opacity={it(f, T.figado, T.figado + 16, 0, 1, OUT)}
          transform="translate(0,-60)"
        >
          <path
            d="M210,470 C250,380 520,360 760,400 C900,420 900,520 820,600 C720,700 560,760 420,740 C260,720 170,580 210,470 Z"
            fill={rgba(FIG, 0.35)}
            stroke="#fb923c"
            strokeWidth={5}
            style={{ filter: "drop-shadow(0 0 20px rgba(251,146,60,.35))" }}
          />
          <Engrenagem x={460} y={560} r={70} giro={giro} cor="#fbbf24" />
          <Engrenagem x={570} y={500} r={42} giro={-giro * 1.6} cor="#fbbf24" />
          {Array.from({ length: 6 }, (_, i) => {
            const p = (f / 50 + i / 6) % 1;
            return (
              <circle
                key={i}
                cx={680 + Math.sin(i * 2) * 50}
                cy={560 - p * 140}
                r={12}
                fill={GORD}
                opacity={1 - p}
              />
            );
          })}
        </g>
        <Grafico
          f={f}
          x={110}
          y={900}
          w={860}
          h={400}
          at={T.relogio - 10}
          sAt={T.relogio}
          picoAt={T.pico}
          noiteAt={T.noite2}
        />
      </Tela>
      <Pill
        x={540}
        y={760}
        text="o dia inteiro…"
        color={GORD}
        size={34}
        k={P(f, T.dia, T.dia + 12) * (1 - P(f, T.ritmo - 6, T.ritmo))}
      />
      <Pill
        x={540}
        y={760}
        text="…mas não no mesmo ritmo"
        color={GORD}
        size={34}
        k={P(f, T.ritmo, T.ritmo + 12)}
      />
      <Title
        f={f}
        at={T.relogio}
        y={830}
        size={36}
        font={SANS}
        weight={600}
        color={C.dim}
        from={GORD}
      >
        ⏰ segue o relógio biológico
      </Title>
      <Legenda
        f={f}
        at={T.relogio + 10}
        y={1380}
        itens={[[GORD, "produção de colesterol"]]}
      />
      <Pill
        x={540}
        y={1490}
        text="😴 dormindo e em jejum"
        color={NOITE}
        size={34}
        k={P(f, T.dorme, T.dorme + 12)}
      />
    </Part>
  );
};

// 3. a enzima HMG-CoA redutase e o bloqueio pelas estatinas
const Caixa: React.FC<{
  f: number;
  y: number;
  t: string;
  cor: string;
  at: number;
}> = ({ f, y, t, cor, at }) => (
  <Card
    f={f}
    at={at}
    x={290}
    y={y}
    w={500}
    h={100}
    border={rgba(cor, 0.7)}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SERIF,
      fontWeight: 600,
      fontSize: 46,
      color: cor,
    }}
  >
    {t}
  </Card>
);
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const bloq = P(f, T.bloqueiam, T.bloqueiam + 16);
  const brilho = it(f, T.hmg, T.hmg + 20, 0, 1, OUT) * (1 - bloq);
  const seta = mix(COR, "#64748b", bloq);
  const seta2 = mix(GORD, "#64748b", bloq);
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.peca} y={225} size={58} weight={600} from={COR}>
        A peça principal
      </Title>
      <Caixa f={f} y={360} t="HMG-CoA" cor={C.ink} at={T.enzima - 10} />
      <Tela>
        <g opacity={P(f, T.enzima, T.enzima + 12)}>
          <line
            x1={540}
            y1={470}
            x2={540}
            y2={640}
            stroke={seta}
            strokeWidth={8}
          />
          <polygon points="518,630 562,630 540,662" fill={seta} />
          <line
            x1={540}
            y1={782}
            x2={540}
            y2={850}
            stroke={seta2}
            strokeWidth={8}
            strokeDasharray="4 16"
            strokeLinecap="round"
          />
          <polygon points="518,846 562,846 540,878" fill={seta2} />
        </g>
        {brilho > 0 && (
          <circle
            cx={540}
            cy={555}
            r={60 + 6 * Math.sin(f / 5)}
            fill="none"
            stroke={COR}
            strokeWidth={4}
            opacity={brilho * 0.8}
            style={{ filter: `drop-shadow(0 0 14px ${COR})` }}
          />
        )}
        <Marca x={540} y={595} k={bloq} ok={false} />
      </Tela>
      <Card
        f={f}
        at={T.hmg}
        x={600}
        y={500}
        w={420}
        h={110}
        tilt={1}
        border={rgba(COR, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 22px",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 32,
            color: COR,
          }}
        >
          HMG-CoA redutase
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            color: C.dim,
          }}
        >
          a enzima
        </span>
      </Card>
      <Card
        f={f}
        at={T.lenta}
        x={40}
        y={490}
        w={250}
        h={130}
        tilt={-1.5}
        border={rgba(GORD, 0.6)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 32,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 40 }}>🐢</span>etapa mais
        lenta
      </Card>
      <Caixa f={f} y={672} t="Mevalonato" cor={C.ink} at={T.enzima} />
      <Caixa f={f} y={888} t="Colesterol" cor={GORD} at={T.enzima + 8} />
      <Title
        f={f}
        at={T.velocidade}
        y={1010}
        size={36}
        font={SANS}
        weight={600}
        color={C.dim}
        from={GORD}
      >
        ela define a velocidade da fábrica
      </Title>
      <Card
        f={f}
        at={T.exatamente}
        x={110}
        y={1100}
        w={860}
        h={180}
        tilt={-0.6}
        border={rgba(COR, 0.7)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 34px",
          boxShadow: `0 0 30px ${rgba(COR, 0.2)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 80 }}>🎯</span>
        <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 48,
              color: COR,
            }}
          >
            O alvo das estatinas
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              color: C.ink,
            }}
          >
            elas inibem a HMG-CoA redutase
          </span>
        </span>
      </Card>
      <Pill
        x={540}
        y={1400}
        text="💊 estatina bloqueia ✕"
        color={VERM}
        size={36}
        k={P(f, T.bloqueiam, T.bloqueiam + 12)}
      />
    </Part>
  );
};

// 4. meia-vida curta
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const x = 110,
    y = 560,
    w = 860,
    h = 460;
  const hx = (t: number) => x + (t / 12) * w;
  const hy = (v: number) => y + h * (1 - 0.86 * v);
  const fn = (t: number) => curva(t, 1.2, 0.33);
  const p = P(f, T.sinva2, T.sinva2 + 90);
  const rot: [number, number, string][] = [
    [T.entra, 0.6, "entra"],
    [T.age, 1.5, "age"],
    [T.saindo, 5.5, "sai"],
  ];
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.detalhe} y={225} size={52} weight={600} from={COR}>
        O detalhe que faz a diferença
      </Title>
      <Title
        f={f}
        at={T.meiaVida}
        y={320}
        size={80}
        weight={600}
        color={COR}
        from={COR}
      >
        meia-vida
      </Title>
      <Tela>
        <g opacity={P(f, T.sinva2 - 10, T.sinva2 + 4)}>
          <line
            x1={x}
            y1={y + h}
            x2={x + w}
            y2={y + h}
            stroke={C.dim}
            strokeWidth={3}
          />
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={y + h}
            stroke={C.dim}
            strokeWidth={3}
          />
          <text
            x={x + w}
            y={y + h + 50}
            textAnchor="end"
            fontFamily={SANS}
            fontWeight={600}
            fontSize={30}
            fill={C.dim}
          >
            tempo depois de tomar →
          </text>
          <text
            x={x + w}
            y={y + 20}
            textAnchor="end"
            fontFamily={SANS}
            fontWeight={600}
            fontSize={30}
            fill={C.dim}
          >
            remédio no sangue
          </text>
          <path
            d={`${caminho(fn, 0, 12, x, y, w, h, p)} L${x + w * p},${y + h} L${x},${y + h} Z`}
            fill={rgba(COR, 0.16)}
          />
          <path
            d={caminho(fn, 0, 12, x, y, w, h, p)}
            fill="none"
            stroke={COR}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 12px ${rgba(COR, 0.6)})` }}
          />
        </g>
        {rot.map(([at, t, txt]) => {
          const k = P(f, at, at + 10);
          if (k <= 0) return null;
          const cx = hx(t),
            cy = hy(fn(t));
          return (
            <g key={txt} opacity={k}>
              <circle cx={cx} cy={cy} r={13} fill={COR} />
              <text
                x={cx + 22}
                y={cy - 22}
                fontFamily={SANS}
                fontWeight={800}
                fontSize={40}
                fill={C.ink}
              >
                {txt}
              </text>
            </g>
          );
        })}
      </Tela>
      <Pill
        x={540}
        y={1150}
        text="⏱️ meia-vida curta: poucas horas"
        color={COR}
        size={38}
        k={P(f, T.curta, T.curta + 12)}
      />
    </Part>
  );
};

// 5. tomar de manhã x tomar à noite
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const x = 110,
    w = 860,
    h = 290;
  const hx = (hr: number) => x + ((hr - 6) / 24) * w;
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title
        f={f}
        at={T.manha - 10}
        y={200}
        size={46}
        font={SANS}
        weight={700}
        color={GORD}
        from={GORD}
      >
        ☀️ Tomou de manhã
      </Title>
      <Tela>
        <Grafico
          f={f}
          x={x}
          y={290}
          w={w}
          h={h}
          at={T.manha - 10}
          sAt={T.manha - 10}
          noiteAt={T.madrugada}
          dose={8}
          dAt={T.manha + 4}
        />
        <Marca
          x={hx(26)}
          y={290 + 150}
          k={P(f, T.sobrou, T.sobrou + 12)}
          ok={false}
        />
        <Grafico
          f={f}
          x={x}
          y={900}
          w={w}
          h={h}
          at={T.tomandoNoite - 10}
          sAt={T.tomandoNoite - 10}
          noiteAt={T.tomandoNoite}
          dose={22}
          dAt={T.tomandoNoite + 4}
        />
        <Marca x={hx(26) + 70} y={900 + 120} k={P(f, T.auge, T.auge + 12)} ok />
      </Tela>
      <Pill
        x={540}
        y={705}
        text="pouco remédio na madrugada"
        color={VERM}
        size={32}
        k={P(f, T.sobrou, T.sobrou + 12)}
      />
      <Title
        f={f}
        at={T.tomandoNoite - 10}
        y={810}
        size={46}
        font={SANS}
        weight={700}
        color={NOITE}
        from={NOITE}
      >
        🌙 Tomou à noite
      </Title>
      <Pill
        x={540}
        y={1315}
        text="remédio no auge = fábrica no pico"
        color={VERDE}
        size={32}
        k={P(f, T.auge, T.auge + 12)}
      />
      <Legenda
        f={f}
        at={T.manha}
        y={1400}
        itens={[
          [GORD, "produção de colesterol"],
          [COR, "sinvastatina"],
        ]}
      />
      <Title
        f={f}
        at={T.sincronizar}
        y={1490}
        size={44}
        weight={600}
        color={C.ink}
        from={COR}
      >
        ⏰ remédio no ritmo do corpo
      </Title>
    </Part>
  );
};

// 6. as outras estatinas
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const cards: [number, string][] = [
    [T.ator, "Atorvastatina"],
    [T.rosu, "Rosuvastatina"],
  ];
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Title f={f} at={T.outras} y={225} size={58} weight={600} from={LONGA}>
        E as outras estatinas?
      </Title>
      {cards.map(([at, t], i) => (
        <Card
          key={t}
          f={f}
          at={at}
          x={60 + i * 495}
          y={340}
          w={465}
          h={130}
          tilt={[-1, 0.8][i]}
          border={rgba(LONGA, 0.6)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 44,
            color: LONGA,
          }}
        >
          {t}
        </Card>
      ))}
      <Tela>
        <Grafico
          f={f}
          x={110}
          y={600}
          w={860}
          h={340}
          at={T.longa - 14}
          dose={9}
          dAt={T.longa}
          longo
          dCor={LONGA}
        />
      </Tela>
      <Pill
        x={540}
        y={540}
        text="meia-vida longa"
        color={LONGA}
        size={36}
        k={P(f, T.longa, T.longa + 12)}
      />
      <Title
        f={f}
        at={T.diaInteiro}
        y={1030}
        size={38}
        font={SANS}
        weight={600}
        color={C.dim}
        from={LONGA}
      >
        continuam agindo o dia inteiro
      </Title>
      <Item
        f={f}
        at={T.qualquer}
        y={1120}
        icone="🕐"
        texto="podem ser tomadas em qualquer horário"
        cor={LONGA}
      />
      <Pill
        x={540}
        y={1360}
        text="✓ mas sempre no mesmo horário"
        color={VERDE}
        size={36}
        k={P(f, T.mesmo, T.mesmo + 12)}
      />
    </Part>
  );
};

// 7. resumo
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.resumindo} y={240} size={58} weight={600} from={COR}>
        Resumindo
      </Title>
      <Card
        f={f}
        at={T.sinva3}
        x={60}
        y={360}
        w={960}
        h={240}
        border={rgba(NOITE, 0.7)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          boxShadow: `0 0 34px ${rgba(NOITE, 0.25)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 110 }}>🌙</span>
        <span style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 64,
              color: COR,
            }}
          >
            Sinvastatina
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 56,
              color: NOITE,
            }}
          >
            à noite
          </span>
        </span>
      </Card>
      <Item
        f={f}
        at={T.dura}
        y={680}
        icone="⏱️"
        texto="ela dura pouco no sangue"
        cor={COR}
      />
      <Item
        f={f}
        at={T.madrugada3}
        y={870}
        icone="🏭"
        texto="o fígado produz mais colesterol de madrugada"
        cor={GORD}
        h={170}
      />
    </Part>
  );
};

// 8. esqueceu a dose
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Title f={f} at={T.esquecer} y={260} size={60} weight={600} from={COR}>
        Esqueceu uma dose?
      </Title>
      <Item
        f={f}
        at={T.nunca}
        y={420}
        icone="✋"
        texto={
          <>
            Nunca tome <b style={{ color: "#fca5a5" }}>duas juntas</b> para
            compensar
          </>
        }
        cor={VERM}
        h={170}
      />
      <Item
        f={f}
        at={T.mude}
        y={640}
        icone="🚫"
        texto={
          <>
            Não mude horário nem dose{" "}
            <b style={{ color: "#fca5a5" }}>por conta própria</b>
          </>
        }
        cor={VERM}
        h={170}
      />
    </Part>
  );
};

// 9. chamada para seguir
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100}>
      <Emoji f={f} at={T.siga - 4} x={540} y={520} size={200}>
        👩‍⚕️
      </Emoji>
      <Title
        f={f}
        at={T.siga}
        y={700}
        size={92}
        weight={600}
        color={C.ink}
        from={COR}
      >
        Me siga
      </Title>
      <Item
        f={f}
        at={T.siga + 56}
        y={860}
        icone="💊"
        texto="dicas de farmacologia"
        cor={COR}
      />
      <Item
        f={f}
        at={T.siga + 86}
        y={1040}
        icone="🔬"
        texto="curiosidades sobre a área"
        cor={NOITE}
      />
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

export const VideoSinvaNoite: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background
        color={
          f >= T.outras - 10 && f < T.resumindo - 10
            ? LONGA
            : f >= T.esquecer - 10 && f < T.siga - 10
              ? VERM
              : NOITE
        }
        pulses={[
          T.noite,
          T.pico,
          T.bloqueiam,
          T.sobrou,
          T.auge,
          T.nunca,
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
      <Audio src={staticFile("sinvaNoite/narracao.mp3")} />
      <Audio
        src={staticFile("sinvaNoite/musica.wav")}
        volume={(fr) => 0.11 * (1 - P(fr, DURATION - 60, DURATION))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
