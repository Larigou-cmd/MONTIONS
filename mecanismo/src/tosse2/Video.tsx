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

// "Tosse que não passa? Pode ser o seu remédio" (IECA e tosse seca, versão 2) no modelo "aula elegante".
// Narração no mesmo tom do vídeo da sinvastatina (texto simples, sem tags, velocidade original), então
// quadro = segundos da transcrição × 30 (audio/tosse2_palavras.json).
const COR = "#38bdf8"; // remédio de pressão (IECA)
const ANG = "#fb923c"; // angiotensina
const BRADI = "#c084fc"; // bradicinina
const LOSA = "#4ade80"; // família da losartana
const VERDE = "#4ade80",
  VERM = "#ef4444",
  SANGUE = "#f87171";
export const DURATION = 3907; // narração de 126 s no tom do vídeo da sinvastatina + mensagem final

const T = {
  tosse: 19,
  passa: 38,
  pode: 74,
  remedioH: 95,
  suspeito: 170,
  pressao: 218,
  enalapril: 268,
  captopril: 286,
  lisinopril: 316,
  familia: 413,
  eca: 451,
  brasil: 510,
  coracao: 554,
  excelentes: 589,
  efeito: 624,
  tosseSeca: 691,
  entender: 732,
  enzima: 856,
  tesoura: 934,
  transforma: 1001,
  angio: 1022,
  aperta: 1069,
  sobe: 1124,
  bloqueiam: 1162,
  menos: 1210,
  relaxados: 1274,
  baixa: 1310,
  otimo: 1363,
  soQue: 1382,
  segundo: 1418,
  destroi: 1481,
  bradi: 1531,
  bloqueia2: 1590,
  acumular: 1667,
  pulmoes: 1718,
  irrita: 1771,
  resultado: 1817,
  cocega: 1915,
  sinais: 1978,
  s1: 2016,
  s2: 2071,
  s3: 2150,
  s4: 2275,
  umEm10: 2371,
  mulheres: 2477,
  agora: 2503,
  raramente: 2621,
  angioedema: 2678,
  labios: 2717,
  lingua: 2738,
  garganta: 2758,
  respirar: 2846,
  emergencia: 2906,
  desconfiou: 2976,
  naoPara: 3019,
  subir: 3091,
  medico: 3133,
  troca: 3180,
  losartana: 3226,
  mesmaVia: 3271,
  naoMexe: 3311,
  quaseNunca: 3386,
  semanas: 3542,
  manda: 3595,
  segue: 3708,
  curiosidades: 3730,
  final: 3807,
};
const PARTES: [number, number][] = [
  [0, 156],
  [150, 730],
  [724, 1382],
  [1376, 1978],
  [1972, 2503],
  [2497, 2974],
  [2968, 3593],
  [3587, 3809],
  [3803, DURATION],
];
const SFX: [number, string, number][] = [
  [T.tosse, "pop", 0.25],
  [T.pode, "plim", 0.22],
  [150, "whoosh", 0.3],
  [T.suspeito, "pop", 0.22],
  [T.enalapril, "pop", 0.22],
  [T.captopril, "pop", 0.22],
  [T.lisinopril, "pop", 0.22],
  [T.eca, "pop", 0.22],
  [T.excelentes, "plim", 0.2],
  [T.tosseSeca, "trava", 0.38],
  [724, "whoosh", 0.3],
  [T.enzima, "pop", 0.22],
  [T.tesoura, "plim", 0.22],
  [T.angio, "pop", 0.22],
  [T.sobe, "pop", 0.22],
  [T.bloqueiam, "trava", 0.42],
  [T.baixa, "pop", 0.22],
  [T.otimo, "plim", 0.22],
  [1376, "whoosh", 0.3],
  [T.segundo, "pop", 0.22],
  [T.bradi, "pop", 0.25],
  [T.bloqueia2, "trava", 0.4],
  [T.pulmoes, "pop", 0.22],
  [T.resultado, "trava", 0.35],
  [1972, "whoosh", 0.3],
  [T.s1, "pop", 0.22],
  [T.s2, "pop", 0.22],
  [T.s3, "pop", 0.22],
  [T.s4, "pop", 0.22],
  [T.umEm10, "plim", 0.22],
  [T.mulheres, "pop", 0.2],
  [2497, "whoosh", 0.3],
  [T.agora, "trava", 0.4],
  [T.angioedema, "pop", 0.25],
  [T.labios, "pop", 0.2],
  [T.lingua, "pop", 0.2],
  [T.garganta, "pop", 0.2],
  [T.emergencia, "trava", 0.45],
  [2968, "whoosh", 0.3],
  [T.naoPara, "trava", 0.32],
  [T.medico, "pop", 0.22],
  [T.losartana, "pop", 0.25],
  [T.naoMexe, "pop", 0.22],
  [T.quaseNunca, "plim", 0.25],
  [T.semanas, "pop", 0.22],
  [3587, "whoosh", 0.3],
  [T.manda, "pop", 0.25],
  [T.segue, "plim", 0.25],
  [3803, "whoosh", 0.3],
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
const Marca: React.FC<{
  x: number;
  y: number;
  k: number;
  ok: boolean;
  size?: number;
}> = ({ x, y, k, ok, size = 110 }) =>
  k <= 0 ? null : (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={800}
      fontSize={size * SNAP(Math.min(1, k))}
      fill={ok ? VERDE : C.alert}
      style={{ filter: `drop-shadow(0 0 16px ${ok ? VERDE : C.alert})` }}
    >
      {ok ? "✓" : "✕"}
    </text>
  );
const Caixa: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w?: number;
  t: string;
  cor: string;
  apaga?: number;
}> = ({ f, at, x, y, w = 440, t, cor, apaga = 0 }) => (
  <Card
    f={f}
    at={at}
    x={x}
    y={y}
    w={w}
    h={96}
    border={rgba(cor, 0.7 * (1 - apaga) + 0.15)}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SERIF,
      fontWeight: 600,
      fontSize: 42,
      color: mix(cor, "#475569", apaga),
      opacity: 1 - 0.5 * apaga,
    }}
  >
    {t}
  </Card>
);
const MONO = "'DejaVu Sans Mono', 'Courier New', monospace";

// tesoura (a enzima ECA): abre e fecha enquanto trabalha; travada e cinza quando bloqueada
const Tesoura: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  ativa: boolean;
  bloq: number;
  cor?: string;
}> = ({ x, y, s = 1, f, ativa, bloq, cor = "#e2e8f0" }) => {
  const ang = ativa ? 4 + 20 * Math.abs(Math.sin(f / 5)) : 4;
  const c = mix(cor, "#64748b", bloq);
  const Lamina = ({ sinal }: { sinal: number }) => (
    <g transform={`rotate(${sinal * ang}) scale(1,${sinal})`}>
      <path d="M0,-7 L150,-3 Q166,0 150,4 L0,9 Z" fill={c} />
      <line
        x1={0}
        y1={0}
        x2={-38}
        y2={-18}
        stroke={c}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <circle
        cx={-62}
        cy={-28}
        r={26}
        fill="none"
        stroke={mix(COR, "#64748b", bloq)}
        strokeWidth={10}
      />
    </g>
  );
  return (
    <g
      transform={`translate(${x},${y}) scale(${s})`}
      style={{
        filter:
          bloq < 1 ? `drop-shadow(0 0 12px ${rgba(COR, 0.5)})` : undefined,
      }}
    >
      <Lamina sinal={1} />
      <Lamina sinal={-1} />
      <circle r={8} fill="#0f172a" stroke={c} strokeWidth={4} />
    </g>
  );
};

// caixinha de remédio sem marca
const CaixaRemedio: React.FC<{
  x: number;
  y: number;
  s: number;
  foco: number;
}> = ({ x, y, s, foco }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${-4 + 4 * foco})`}>
    <rect
      x={-200}
      y={-150}
      width={400}
      height={300}
      rx={22}
      fill="#f8fafc"
      stroke={mix("#94a3b8", COR, foco)}
      strokeWidth={6}
      style={{
        filter: foco > 0 ? `drop-shadow(0 0 ${24 * foco}px ${COR})` : undefined,
      }}
    />
    <rect x={-200} y={-150} width={400} height={70} rx={22} fill={COR} />
    <rect x={-200} y={-100} width={400} height={20} fill={COR} />
    <text
      x={0}
      y={-104}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={800}
      fontSize={32}
      fill="#0f172a"
    >
      REMÉDIO DE PRESSÃO
    </text>
    <text
      x={0}
      y={-10}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={700}
      fontSize={34}
      fill="#334155"
    >
      comprimidos
    </text>
    <text
      x={0}
      y={40}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={600}
      fontSize={28}
      fill="#64748b"
    >
      uso oral • 30 unidades
    </text>
    <rect
      x={-150}
      y={80}
      width={300}
      height={36}
      rx={18}
      fill={rgba(COR, 0.25)}
    />
  </g>
);

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const tosse = f >= 4 ? Math.max(0, Math.sin((f - 4) / 4)) : 0;
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <div
        style={{
          position: "absolute",
          top: 230,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 76,
          letterSpacing: 1,
          lineHeight: 1.1,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          transform: `scale(${0.9 + 0.1 * it(f, 2, 16, 0, 1, SNAP)})`,
          textShadow: `0 0 30px ${rgba(COR, 0.4)}`,
        }}
      >
        TOSSE QUE
        <br />
        NÃO PASSA? <span style={{ fontFamily: EMOJI }}>🤧</span>
      </div>
      <Tela>
        <g
          transform="translate(540,720)"
          opacity={
            it(f, 4, 18, 0, 1, OUT) * (1 - 0.6 * P(f, T.pode - 6, T.pode + 6))
          }
        >
          <text
            x={0}
            y={60}
            textAnchor="middle"
            fontFamily={EMOJI}
            fontSize={220}
            transform={`scale(${1 + 0.06 * tosse})`}
          >
            😣
          </text>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${130 + i * 40},-80 q26,50 0,100`}
              fill="none"
              stroke={C.ink}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={tosse * (1 - i * 0.25)}
              transform={`translate(${tosse * 14},0)`}
            />
          ))}
        </g>
        {f >= T.pode - 4 && (
          <g opacity={P(f, T.pode - 4, T.pode + 8)}>
            <CaixaRemedio
              x={540}
              y={1060}
              s={0.85}
              foco={P(f, T.remedioH, T.remedioH + 14)}
            />
          </g>
        )}
      </Tela>
      <Title
        f={f}
        at={T.pode}
        y={1290}
        size={52}
        weight={600}
        color={C.ink}
        from={COR}
      >
        Pode ser algum remédio
      </Title>
      <Title
        f={f}
        at={T.remedioH + 10}
        y={1370}
        size={40}
        font={SANS}
        weight={600}
        color={COR}
        from={COR}
      >
        que você está tomando 💊
      </Title>
    </Part>
  );
};

// 2. o principal suspeito
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const sus: [number, string][] = [
    [T.enalapril, "ENALAPRIL"],
    [T.captopril, "CAPTOPRIL"],
    [T.lisinopril, "LISINOPRIL"],
  ];
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title
        f={f}
        at={T.suspeito}
        y={215}
        size={44}
        font={SANS}
        weight={700}
        color={C.dim}
        from={COR}
      >
        🔍 principal suspeito
      </Title>
      <Title f={f} at={T.pressao - 8} y={275} size={64} weight={600} from={COR}>
        o remédio de pressão
      </Title>
      {sus.map(([at, t], i) => (
        <Card
          key={t}
          f={f}
          at={at}
          x={140}
          y={400 + i * 125}
          w={800}
          h={105}
          tilt={[-1, 0.8, -0.6][i]}
          border={rgba(COR, 0.6)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 48,
            letterSpacing: 3,
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 52 }}>💊</span>
          {t}
        </Card>
      ))}
      <Pill
        x={540}
        y={810}
        text="família: inibidores da ECA"
        color={COR}
        size={38}
        k={P(f, T.familia, T.familia + 12)}
      />
      <Pill
        x={330}
        y={905}
        text="🩺 pressão alta"
        color={COR}
        size={32}
        k={P(f, T.brasil, T.brasil + 12)}
      />
      <Pill
        x={750}
        y={905}
        text="❤️ coração"
        color={COR}
        size={32}
        k={P(f, T.coracao, T.coracao + 12)}
      />
      <Title
        f={f}
        at={T.excelentes}
        y={985}
        size={40}
        font={SANS}
        weight={600}
        color={VERDE}
        from={VERDE}
      >
        ✓ remédios excelentes
      </Title>
      <Card
        f={f}
        at={T.efeito}
        x={110}
        y={1090}
        w={860}
        h={230}
        border={rgba(VERM, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: `0 0 30px ${rgba(VERM, 0.2)}`,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            color: C.dim,
          }}
        >
          efeito colateral famoso
        </span>
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 76,
            color: bornColor(f, T.tosseSeca, "#fca5a5", C.ink),
          }}
        >
          tosse seca <span style={{ fontFamily: EMOJI }}>🫁</span>
        </span>
      </Card>
    </Part>
  );
};

// selo "mecanismo.exe" com barra de progresso
const Exe: React.FC<{ f: number; at: number; fim: number }> = ({
  f,
  at,
  fim,
}) => {
  const n = Math.round(6 * Math.max(0.15, P(f, at, fim)));
  return (
    <div
      style={{
        position: "absolute",
        top: 215,
        width: W,
        textAlign: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 46,
        color: COR,
        opacity: P(f, at - 6, at + 6),
        textShadow: `0 0 14px ${rgba(COR, 0.6)}`,
      }}
    >
      mecanismo.exe {"▓".repeat(n)}
      {"░".repeat(6 - n)}
    </div>
  );
};

// 3. como funcionam: a tesoura ECA faz angiotensina II
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const bloq = P(f, T.bloqueiam + 6, T.bloqueiam + 20);
  const corte = f >= T.tesoura && f < T.bloqueiam + 6;
  // abertura do vaso: normal → apertado (angiotensina II) → relaxado (remédio)
  const gap =
    150 -
    70 * P(f, T.aperta, T.aperta + 20) +
    110 * P(f, T.relaxados - 10, T.relaxados + 20);
  const vy = 1060;
  const pilula = it(f, T.bloqueiam - 14, T.bloqueiam + 6, 0, 1, OUT);
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Exe f={f} at={T.entender} fim={T.otimo} />
      <Caixa
        f={f}
        at={T.tesoura - 10}
        x={320}
        y={320}
        t="angiotensina I"
        cor={C.ink}
      />
      <Tela>
        <g opacity={P(f, T.enzima, T.enzima + 12)}>
          <Tesoura x={470} y={540} f={f} ativa={corte} bloq={bloq} />
          <text
            x={700}
            y={530}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={46}
            fill={mix(COR, "#64748b", bloq)}
          >
            ECA
          </text>
          <text
            x={700}
            y={572}
            fontFamily={SANS}
            fontWeight={600}
            fontSize={28}
            fill={C.dim}
          >
            a “tesoura”
          </text>
          <line
            x1={540}
            y1={420}
            x2={540}
            y2={470}
            stroke={C.dim}
            strokeWidth={5}
          />
          <line
            x1={540}
            y1={610}
            x2={540}
            y2={655}
            stroke={mix(ANG, "#64748b", bloq)}
            strokeWidth={6}
            opacity={P(f, T.transforma, T.transforma + 10)}
          />
          <polygon
            points="522,650 558,650 540,676"
            fill={mix(ANG, "#64748b", bloq)}
            opacity={P(f, T.transforma, T.transforma + 10)}
          />
        </g>
        {pilula > 0 && (
          <g
            transform={`translate(${1000 - 420 * pilula},540)`}
            opacity={pilula}
          >
            <rect x={-70} y={-30} width={140} height={60} rx={30} fill={COR} />
            <rect x={0} y={-30} width={70} height={60} rx={30} fill="#e0f2fe" />
            <rect x={0} y={-30} width={30} height={60} fill="#e0f2fe" />
          </g>
        )}
        <Marca x={300} y={580} k={bloq} ok={false} />
        {/* vaso sanguíneo */}
        {f >= T.aperta - 10 && (
          <g opacity={P(f, T.aperta - 10, T.aperta + 4)}>
            <rect
              x={100}
              y={vy - gap / 2 - 26}
              width={880}
              height={26}
              rx={13}
              fill={SANGUE}
            />
            <rect
              x={100}
              y={vy + gap / 2}
              width={880}
              height={26}
              rx={13}
              fill={SANGUE}
            />
            {Array.from({ length: 9 }, (_, i) => {
              const xx = 100 + ((f * 6 + i * 100) % 880);
              return (
                <ellipse
                  key={i}
                  cx={xx}
                  cy={vy + Math.sin(i * 2) * gap * 0.25}
                  rx={16}
                  ry={10}
                  fill={rgba(SANGUE, 0.7)}
                />
              );
            })}
            <text
              x={540}
              y={vy + 175}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={600}
              fontSize={30}
              fill={C.dim}
            >
              vaso sanguíneo
            </text>
          </g>
        )}
      </Tela>
      <Caixa
        f={f}
        at={T.angio}
        x={320}
        y={685}
        t="angiotensina II"
        cor={ANG}
        apaga={P(f, T.menos, T.menos + 16)}
      />
      <Pill
        x={540}
        y={1300}
        text="🔺 aperta os vasos • pressão sobe"
        color={VERM}
        size={34}
        k={P(f, T.sobe, T.sobe + 12) * (1 - P(f, T.menos - 6, T.menos))}
      />
      <Pill
        x={540}
        y={1300}
        text="menos angiotensina II • vasos relaxam"
        color={VERDE}
        size={34}
        k={P(f, T.menos, T.menos + 12) * (1 - P(f, T.baixa - 6, T.baixa))}
      />
      <Pill
        x={540}
        y={1300}
        text="🔻 a pressão baixa"
        color={VERDE}
        size={38}
        k={P(f, T.baixa, T.baixa + 12)}
      />
      <Title
        f={f}
        at={T.otimo}
        y={1395}
        size={44}
        font={SANS}
        weight={700}
        color={VERDE}
        from={VERDE}
      >
        até aqui, tudo ótimo ✓
      </Title>
    </Part>
  );
};

// 4. o segundo trabalho da tesoura: destruir a bradicinina
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const B = T.bloqueia2;
  const bloq = P(f, B, B + 14);
  const tx = 540,
    ty = 700; // ponta da tesoura
  const lx = 540,
    ly = 1080; // pulmões
  const irrita = P(f, T.irrita, T.irrita + 20);
  // bolinhas de bradicinina: nascem à esquerda e vão até a tesoura
  const pontos: React.ReactNode[] = [];
  let acumulado = 0;
  for (let i = 0; i < 46; i++) {
    const nasce = T.destroi - 40 + i * 9;
    if (f < nasce) break;
    const chega = nasce + 40;
    const p = Math.min(1, (f - nasce) / 40);
    let x = 80 + (tx - 110 - 80) * p,
      y = ty + Math.sin(i * 1.7) * 30,
      op = 1,
      r = 13;
    if (chega < B) {
      if (f > chega) {
        const k = Math.min(1, (f - chega) / 10); // cortada: some
        x = tx - 110 + 20 * k;
        op = 1 - k;
        r = 13 * (1 - 0.5 * k);
      }
    } else if (f >= chega) {
      // acumula ao redor da tesoura e depois desce para os pulmões
      const j = acumulado++;
      const ax = tx - 160 + (j % 7) * 52 + Math.sin(j) * 8,
        ay = ty - 80 + Math.floor(j / 7) * 44 + 140;
      const d = P(f, T.pulmoes + j * 2, T.pulmoes + j * 2 + 40);
      x = ax + (lx - 120 + (j % 6) * 48 - ax) * d;
      y = ay + (ly - 30 + Math.floor(j / 6) * 26 - ay) * d;
      x = x + Math.sin(f / 7 + j) * 3;
    }
    if (op > 0)
      pontos.push(
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill={BRADI}
          opacity={op}
          style={{ filter: `drop-shadow(0 0 6px ${BRADI})` }}
        />,
      );
  }
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.soQue} y={220} size={52} weight={600} from={COR}>
        A tesoura tem 2 trabalhos
      </Title>
      <Card
        f={f}
        at={T.soQue + 10}
        x={60}
        y={310}
        w={465}
        h={130}
        border={rgba(ANG, 0.5)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 24px",
          opacity: 0.75,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: ANG,
          }}
        >
          1. fazer
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32 }}>
          angiotensina II
        </span>
      </Card>
      <Card
        f={f}
        at={T.segundo}
        x={555}
        y={310}
        w={465}
        h={130}
        border={rgba(BRADI, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 24px",
          boxShadow: `0 0 24px ${rgba(BRADI, 0.25)}`,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: BRADI,
          }}
        >
          2. destruir
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32 }}>
          bradicinina
        </span>
      </Card>
      <Tela>
        <g opacity={P(f, T.segundo, T.segundo + 12)}>
          <Tesoura
            x={tx - 200}
            y={ty}
            s={0.75}
            f={f}
            ativa={f < B}
            bloq={bloq}
          />
        </g>
        {pontos}
        <Marca x={tx - 230} y={ty - 60} k={bloq} ok={false} size={90} />
        {f >= T.pulmoes - 4 && (
          <g opacity={P(f, T.pulmoes - 4, T.pulmoes + 10)}>
            <circle
              cx={lx}
              cy={ly}
              r={190}
              fill={rgba(VERM, 0.25 * irrita * (0.6 + 0.4 * Math.sin(f / 4)))}
              style={{ filter: "blur(30px)" }}
            />
            <text
              x={lx}
              y={ly + 80}
              textAnchor="middle"
              fontFamily={EMOJI}
              fontSize={230}
            >
              🫁
            </text>
          </g>
        )}
      </Tela>
      <Pill
        x={540}
        y={530}
        text="BRADICININA 🫁"
        color={BRADI}
        size={40}
        k={P(f, T.bradi, T.bradi + 12)}
      />
      <Pill
        x={540}
        y={870}
        text="bloqueou a tesoura → bradicinina acumula"
        color={BRADI}
        size={30}
        k={
          P(f, T.acumular, T.acumular + 12) *
          (1 - P(f, T.pulmoes - 6, T.pulmoes))
        }
      />
      <Pill
        x={540}
        y={870}
        text="irrita as vias aéreas"
        color={VERM}
        size={34}
        k={P(f, T.irrita, T.irrita + 12)}
      />
      <Title
        f={f}
        at={T.resultado}
        y={1290}
        size={78}
        weight={600}
        color={C.ink}
        from={VERM}
      >
        tosse seca
      </Title>
      <Pill
        x={540}
        y={1420}
        text="sem catarro • 🪶 cócega chata na garganta"
        color={COR}
        size={32}
        k={P(f, T.cocega, T.cocega + 12)}
      />
    </Part>
  );
};

// 5. como reconhecer
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const sinais: [number, string, string][] = [
    [T.s1, "✅", "tosse seca, sem catarro"],
    [T.s2, "✅", "piora à noite ou ao deitar"],
    [T.s3, "✅", "começa semanas ou meses depois"],
    [T.s4, "✅", "nenhum xarope resolve"],
  ];
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.sinais} y={220} size={60} weight={600} from={COR}>
        Como reconhecer
      </Title>
      {sinais.map(([at, e, t], i) => (
        <Item
          key={t}
          f={f}
          at={at}
          y={310 + i * 150}
          icone={e}
          texto={t}
          h={130}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 940,
          width: W,
          display: "flex",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const k = it(f, T.umEm10 + i * 2, T.umEm10 + i * 2 + 12, 0, 1, SNAP);
          return (
            <span
              key={i}
              style={{
                fontFamily: EMOJI,
                fontSize: 76,
                opacity: k * (i === 0 ? 1 : 0.35),
                transform: `scale(${k})`,
                filter: i === 0 ? `drop-shadow(0 0 14px ${COR})` : undefined,
              }}
            >
              🧍
            </span>
          );
        })}
      </div>
      <Title
        f={f}
        at={T.umEm10 + 10}
        y={1080}
        size={56}
        weight={600}
        color={COR}
        from={COR}
      >
        ≈ 1 em cada 10 que tomam
      </Title>
      <Pill
        x={540}
        y={1210}
        text="parece ser mais comum em mulheres"
        color={BRADI}
        size={32}
        k={P(f, T.mulheres, T.mulheres + 12)}
      />
    </Part>
  );
};

// 6. alerta: angioedema
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const partes: [number, string, string][] = [
    [T.labios, "👄", "lábios"],
    [T.lingua, "👅", "língua"],
    [T.garganta, "🫁", "garganta"],
  ];
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <div
        style={{
          position: "absolute",
          top: 215,
          width: W,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 44,
          color: "#fecaca",
          opacity: P(f, T.agora - 6, T.agora + 6),
          textShadow: `0 0 16px ${rgba(VERM, 0.8)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI }}>⚠️</span> ERRO: efeito grave
        detectado
      </div>
      <Title
        f={f}
        at={T.angioedema}
        y={340}
        size={84}
        weight={600}
        color={VERM}
        from={VERM}
      >
        angioedema
      </Title>
      <Title
        f={f}
        at={T.angioedema + 10}
        y={455}
        size={36}
        font={SANS}
        weight={600}
        color={C.dim}
        from={VERM}
      >
        um inchaço causado pela bradicinina
      </Title>
      <Pill
        x={540}
        y={555}
        text="mais raro"
        color={VERM}
        size={34}
        k={P(f, T.raramente, T.raramente + 12)}
      />
      {partes.map(([at, e, t], i) => (
        <Card
          key={t}
          f={f}
          at={at}
          x={60 + i * 330}
          y={640}
          w={300}
          h={210}
          tilt={[-1, 0.8, -0.6][i]}
          border={rgba(VERM, 0.6)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: EMOJI,
              fontSize: 80,
              transform: `scale(${1 + 0.06 * Math.sin(f / 5 + i)})`,
            }}
          >
            {e}
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36 }}>
            {t}
          </span>
        </Card>
      ))}
      <Item
        f={f}
        at={T.respirar}
        y={900}
        icone="😮‍💨"
        texto="dificuldade pra respirar"
        cor={VERM}
      />
      <Card
        f={f}
        at={T.emergencia}
        x={60}
        y={1100}
        w={960}
        h={220}
        border={VERM}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          background: rgba(VERM, 0.18 + 0.08 * Math.sin(f / 4)),
          boxShadow: `0 0 40px ${rgba(VERM, 0.45)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 90 }}>🚨</span>
        <span style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 64,
              color: "#fecaca",
              letterSpacing: 2,
            }}
          >
            EMERGÊNCIA
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38 }}>
            pronto-socorro na hora
          </span>
        </span>
      </Card>
    </Part>
  );
};

// 7. o que fazer
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.desconfiou} y={220} size={54} weight={600} from={COR}>
        Desconfiou que é o remédio?
      </Title>
      <Item
        f={f}
        at={T.naoPara}
        y={300}
        icone="✋"
        texto={
          <>
            Não pare <b style={{ color: "#fca5a5" }}>por conta própria</b>
          </>
        }
        cor={VERM}
        h={130}
      />
      <Pill
        x={540}
        y={480}
        text="a pressão pode subir"
        color={VERM}
        size={30}
        k={P(f, T.subir, T.subir + 12)}
      />
      <Item
        f={f}
        at={T.medico}
        y={540}
        icone="👩‍⚕️"
        texto="Fale com o seu médico"
        cor={COR}
        h={130}
      />
      <Card
        f={f}
        at={T.troca}
        x={60}
        y={710}
        w={430}
        h={150}
        tilt={-1}
        border={rgba(COR, 0.5)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          opacity: 1 - 0.4 * P(f, T.losartana, T.losartana + 14),
        }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34 }}>
          ✂️ inibidor da ECA
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            color: C.dim,
          }}
        >
          enalapril, captopril…
        </span>
      </Card>
      <div
        style={{
          position: "absolute",
          top: 755,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 56,
          color: LOSA,
          opacity: P(f, T.losartana - 8, T.losartana + 4),
        }}
      >
        →
      </div>
      <Card
        f={f}
        at={T.losartana}
        x={590}
        y={710}
        w={430}
        h={150}
        tilt={1}
        border={rgba(LOSA, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          boxShadow: `0 0 26px ${rgba(LOSA, 0.25)}`,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            color: LOSA,
          }}
        >
          família da losartana
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            color: C.dim,
          }}
        >
          losartana, valsartana…
        </span>
      </Card>
      <Item
        f={f}
        at={T.mesmaVia}
        y={900}
        icone="🎯"
        texto="age no mesmo sistema"
        cor={LOSA}
        h={130}
      />
      <Item
        f={f}
        at={T.naoMexe}
        y={1050}
        icone="✂️"
        texto="não mexe na tesoura da bradicinina"
        cor={LOSA}
        h={130}
      />
      <Title
        f={f}
        at={T.quaseNunca}
        y={1230}
        size={46}
        font={SANS}
        weight={700}
        color={VERDE}
        from={VERDE}
      >
        ✓ quase nunca dá tosse
      </Title>
      <Pill
        x={540}
        y={1340}
        text="⏳ paciência: a tosse pode levar semanas pra sumir"
        color={COR}
        size={30}
        k={P(f, T.semanas - 40, T.semanas - 28)}
      />
    </Part>
  );
};

// 8. fechamento
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Emoji f={f} at={T.manda} x={540} y={420} size={170}>
        📤
      </Emoji>
      <Title
        f={f}
        at={T.manda + 6}
        y={560}
        size={48}
        font={SANS}
        weight={700}
        color={C.ink}
        from={COR}
      >
        Manda pra quem toma
      </Title>
      <Title
        f={f}
        at={T.manda + 30}
        y={630}
        size={44}
        font={SANS}
        weight={600}
        color={COR}
        from={COR}
      >
        remédio de pressão e vive tossindo
      </Title>
      <Card
        f={f}
        at={T.segue}
        x={110}
        y={780}
        w={860}
        h={260}
        border={rgba(COR, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          textAlign: "center",
          boxShadow: `0 0 34px ${rgba(COR, 0.25)}`,
        }}
      >
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 74 }}>
          <span style={{ fontFamily: EMOJI }}>👩‍⚕️</span> Me segue
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 36,
            color: bornColor(f, T.curiosidades, C.ink, COR),
          }}
        >
          pra mais curiosidades sobre medicamentos
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

export const VideoTosse2: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= T.agora - 10 && f < T.desconfiou - 10
      ? VERM
      : f >= T.soQue - 10 && f < T.sinais - 10
        ? BRADI
        : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[
          T.tosse,
          T.tosseSeca,
          T.bloqueiam,
          T.bloqueia2,
          T.resultado,
          T.agora,
          T.emergencia,
          T.quaseNunca,
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
      <Grain />
      <Audio src={staticFile("tosse2/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio src={staticFile("tosse2/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
