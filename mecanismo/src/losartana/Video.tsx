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

// "O que a losartana faz no seu coração?" no modelo "aula elegante": coração com efeito 3D (giro e batimento),
// vaso que aperta e relaxa, receptor AT1 como fechadura. Narração gravada pela Larissa (ElevenLabs, Juliana).
// Tempos: audio/losartana_palavras.json (texto do roteiro alinhado às pausas da narração; quadro = segundos × 30).
const COR = "#f43f5e"; // coração / pressão
const VERDE = "#4ade80",
  VERM = "#ef4444",
  AMAR = "#fbbf24",
  AZUL = "#60a5fa",
  ANG = "#fb923c", // angiotensina II
  LOS = "#2dd4bf", // losartana
  ROXO = "#a78bfa";

// TEMPOS
const T = {
  losartana: 26,
  coracao: 137,
  vasos: 168,
  batida: 189,
  empurra: 233,
  sangue: 252,
  pressao: 298,
  forca: 324,
  parede: 374,
  corpo: 415,
  angiotensina: 486,
  aperta: 535,
  mangueira: 600,
  sal: 667,
  resultado: 700,
  sobe: 746,
  trabalhar: 795,
  angio2: 829,
  encaixa: 907,
  fechadura: 931,
  receptor: 964,
  entra: 1027,
  losartana2: 1040,
  bloqueia: 1072,
  sem: 1119,
  relaxa: 1161,
  segura: 1190,
  cai: 1255,
  tranquilo: 1313,
  lembra: 1343,
  enalapril: 1385,
  ponto: 1447,
  bradicinina: 1540,
  tosseSeca: 1594,
  troca: 1695,
  atencao: 1759,
  tontura: 1831,
  levante: 1859,
  potassio: 1902,
  salLight: 1982,
  gravidez: 2087,
  lembre: 2162,
  sintomas: 2244,
  naoPare: 2272,
  siga: 2389,
  final: 2520,
};
export const DURATION = 2610; // 87 s (narração de 83,8 s + mensagem final)
const PARTES: [number, number][] = [
  [0, 195],
  [189, 421],
  [415, 835],
  [829, 1125],
  [1119, 1349],
  [1343, 1765],
  [1759, 2168],
  [2162, 2395],
  [2389, 2524],
  [2518, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  [T.coracao, "pop", 0.2],
  [R(1)[0], "whoosh", 0.3],
  [T.parede, "pop", 0.2],
  [R(2)[0], "whoosh", 0.3],
  [T.angiotensina, "pop", 0.22],
  [T.aperta, "trava", 0.32],
  [T.sobe, "trava", 0.32],
  [R(3)[0], "whoosh", 0.3],
  [T.fechadura, "pop", 0.22],
  [T.losartana2, "whoosh", 0.25],
  [T.bloqueia, "trava", 0.38],
  [R(4)[0], "whoosh", 0.3],
  [T.relaxa, "plim", 0.25],
  [T.cai, "plim", 0.25],
  [R(5)[0], "whoosh", 0.3],
  [T.enalapril, "pop", 0.22],
  [T.tosseSeca, "pop", 0.22],
  [T.troca, "plim", 0.25],
  [R(6)[0], "whoosh", 0.3],
  [T.tontura, "pop", 0.2],
  [T.potassio, "pop", 0.2],
  [T.gravidez, "pop", 0.2],
  [R(7)[0], "whoosh", 0.3],
  [T.naoPare, "trava", 0.35],
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
    style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}
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

// ---------- coração com efeito 3D ----------
// ritmo em batidas por segundo; o giro (scaleX) e o brilho que acompanha dão a sensação de volume
export const Coracao: React.FC<{
  f: number;
  x: number;
  y: number;
  s?: number;
  ritmo?: number;
  giro?: boolean;
}> = ({ f, x, y, s = 1, ritmo = 1.1, giro = true }) => {
  const fase = ((f / 30) * ritmo) % 1;
  const bate = Math.pow(Math.max(0, Math.sin(fase * Math.PI * 2)), 4);
  const esc = s * (1 + 0.07 * bate);
  const ang = giro ? Math.sin(f / 70) : 0;
  const sx = 0.82 + 0.18 * Math.cos(ang * 0.9);
  const luz = 30 + ang * 25;
  return (
    <g transform={`translate(${x},${y}) scale(${esc * sx},${esc}) skewY(${ang * 4})`}>
      <defs>
        <radialGradient id="musculo" cx={`${luz}%`} cy="30%" r="80%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="45%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
        <linearGradient id="aorta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="pulmonar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      {/* veia cava (azul), atrás */}
      <path d="M 105 -80 L 118 -250" stroke="#2563eb" strokeWidth={40} strokeLinecap="round" fill="none" />
      {/* tronco pulmonar */}
      <path
        d="M -30 -100 C -50 -190 -130 -200 -170 -150"
        stroke="url(#pulmonar)"
        strokeWidth={46}
        strokeLinecap="round"
        fill="none"
      />
      {/* aorta: arco com 3 ramos */}
      <path
        d="M 20 -110 C 20 -230 120 -270 165 -200 C 185 -168 175 -130 160 -100"
        stroke="url(#aorta)"
        strokeWidth={52}
        strokeLinecap="round"
        fill="none"
      />
      {/* ramos do arco (tronco braquiocefálico, carótida e subclávia) */}
      {[
        [62, -236, 48, -300],
        [98, -246, 100, -312],
        [134, -232, 152, -292],
      ].map(([x0, y0, x1, y1], i) => (
        <path
          key={i}
          d={`M ${x0} ${y0} Q ${(x0 + x1) / 2 + (i - 1) * 8} ${(y0 + y1) / 2} ${x1} ${y1}`}
          stroke="url(#aorta)"
          strokeWidth={22 - i * 3}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {/* músculo cardíaco */}
      <path
        d="M -20 -120 C 70 -150 160 -110 168 -20 C 176 70 100 165 -15 215 C -65 235 -90 205 -118 160 C -178 80 -176 -20 -136 -82 C -105 -122 -62 -112 -20 -120 Z"
        fill="url(#musculo)"
        stroke="#fecdd3"
        strokeWidth={4}
        style={{ filter: `drop-shadow(0 0 ${30 + 30 * bate}px ${rgba(COR, 0.7)})` }}
      />
      {/* artérias coronárias e veias na superfície */}
      <path d="M -5 -105 C -40 -20 -55 80 -45 195" stroke="#fda4af" strokeWidth={7} fill="none" opacity={0.9} />
      <path d="M 70 -95 C 130 -40 145 45 110 125" stroke="#fda4af" strokeWidth={6} fill="none" opacity={0.85} />
      <path d="M 25 -80 C 35 0 25 100 -5 185" stroke="#93c5fd" strokeWidth={5} fill="none" opacity={0.75} />
      {/* brilho de volume */}
      <ellipse cx={-60 + ang * 40} cy={-50} rx={46} ry={28} fill="#ffffff" opacity={0.18} transform="rotate(-25)" />
    </g>
  );
};

// ---------- vaso sanguíneo (corte longitudinal) ----------
const Vaso: React.FC<{ f: number; y: number; raio: number; k: number; vel?: number }> = ({
  f,
  y,
  raio,
  k,
  vel = 4,
}) => {
  if (k <= 0) return null;
  const celulas = Array.from({ length: 9 }, (_, i) => i);
  return (
    <g opacity={k}>
      <rect x={-20} y={y - raio - 26} width={1120} height={26} rx={13} fill={rgba(COR, 0.55)} stroke="#fecdd3" strokeWidth={3} />
      <rect x={-20} y={y + raio} width={1120} height={26} rx={13} fill={rgba(COR, 0.55)} stroke="#fecdd3" strokeWidth={3} />
      <rect x={-20} y={y - raio} width={1120} height={raio * 2} fill={rgba(VERM, 0.12)} />
      {celulas.map((i) => {
        const cx = ((f * vel + i * 130) % 1200) - 60;
        const cy = y + Math.sin(i * 1.7) * raio * 0.5;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={Math.min(30, raio * 0.45)} ry={Math.min(14, raio * 0.22)} fill="#dc2626" stroke="#fca5a5" strokeWidth={2} />
        );
      })}
    </g>
  );
};

// ---------- medidor de pressão (mostrador) ----------
const Manometro: React.FC<{ x: number; y: number; nivel: number; k: number }> = ({ x, y, nivel, k }) => {
  if (k <= 0) return null;
  const a = Math.PI * (1 - nivel);
  const cor = mix(VERDE, VERM, nivel);
  return (
    <g opacity={k}>
      <path d={`M ${x - 120} ${y} A 120 120 0 0 1 ${x + 120} ${y}`} fill="none" stroke={C.dim} strokeWidth={14} strokeLinecap="round" />
      <path
        d={`M ${x - 120} ${y} A 120 120 0 0 1 ${x + 120 * Math.cos(a)} ${y - 120 * Math.sin(a)}`}
        fill="none"
        stroke={cor}
        strokeWidth={14}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 10px ${cor})` }}
      />
      <line x1={x} y1={y} x2={x + 95 * Math.cos(a)} y2={y - 95 * Math.sin(a)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={12} fill={C.ink} />
      <text x={x} y={y + 50} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} fill={C.ink}>
        pressão
      </text>
    </g>
  );
};

// angiotensina II: cadeia de 8 bolinhas (octapeptídeo)
const Angio: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    {Array.from({ length: 8 }, (_, i) => (
      <circle key={i} cx={i * 18 - 63} cy={Math.sin(i * 1.3) * 8} r={10} fill={ANG} stroke="#fed7aa" strokeWidth={2} />
    ))}
  </g>
);

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
          fontSize: 76,
          lineHeight: 1.08,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        O QUE A <span style={{ color: LOS }}>LOSARTANA</span>
        <br />
        FAZ NO SEU CORAÇÃO?
      </div>
      <Tela>
        <g opacity={it(f, 6, 26, 0, 1, OUT)}>
          <Coracao f={f} x={540} y={900} s={1.55} />
        </g>
      </Tela>
      <Pill x={540} y={1400} text="❤️ coração e 🩸 vasos" color={COR} size={38} k={P(f, T.coracao, T.coracao + 12)} />
    </Part>
  );
};

// ---------- 2. o que é pressão ----------
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const kv = P(f, T.empurra, T.empurra + 14);
  const seta = P(f, T.parede, T.parede + 12);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={60}>
      <Title f={f} at={T.batida} y={200} size={58} weight={600} from={COR}>
        A cada batida…
      </Title>
      <Tela>
        <Coracao f={f} x={540} y={560} s={0.95} />
        <Vaso f={f} y={1080} raio={110} k={kv} />
        {seta > 0 &&
          [260, 540, 820].map((x, i) => {
            const d = 10 * Math.sin(f / 6 + i);
            return (
              <g key={i} opacity={seta}>
                <path d={`M ${x} 1080 L ${x} ${990 - d}`} stroke={AMAR} strokeWidth={8} />
                <polygon points={`${x - 16},${1000 - d} ${x + 16},${1000 - d} ${x},${975 - d}`} fill={AMAR} />
                <path d={`M ${x} 1080 L ${x} ${1170 + d}`} stroke={AMAR} strokeWidth={8} />
                <polygon points={`${x - 16},${1160 + d} ${x + 16},${1160 + d} ${x},${1185 + d}`} fill={AMAR} />
              </g>
            );
          })}
      </Tela>
      <Pill x={540} y={850} text="💨 empurra o sangue pelos vasos" color={COR} size={34} k={P(f, T.empurra, T.empurra + 12)} />
      <Title f={f} at={T.pressao} y={1290} size={46} font={SANS} weight={700} color={C.ink} from={AMAR}>
        pressão = força do sangue na parede
      </Title>
    </Part>
  );
};

// ---------- 3. o vilão: angiotensina II ----------
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const aperto = it(f, T.aperta, T.aperta + 40, 0, 1, EASE);
  const raio = 110 - 55 * aperto;
  const nivel = 0.35 + 0.55 * it(f, T.resultado, T.sobe + 20, 0, 1, EASE);
  const ritmo = 1.1 + 0.9 * it(f, T.sobe, T.trabalhar, 0, 1, EASE);
  const agua = P(f, T.sal, T.sal + 20);
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={60}>
      <Title f={f} at={T.corpo} y={200} size={56} weight={600} from={ANG}>
        O vilão: angiotensina II
      </Title>
      <Tela>
        <Vaso f={f} y={560} raio={raio} k={P(f, T.corpo + 10, T.corpo + 24)} vel={4 + 3 * aperto} />
        {f >= T.angiotensina &&
          [0, 1, 2, 3].map((i) => {
            const k = it(f, T.angiotensina + i * 8, T.angiotensina + 30 + i * 8, 0, 1, OUT);
            const xs = 180 + i * 240;
            const ys = (i % 2 === 0 ? 560 - raio - 50 : 560 + raio + 50) + (1 - k) * (i % 2 === 0 ? -200 : 200);
            return <Angio key={i} x={xs} y={ys} s={0.9} o={k} />;
          })}
        {/* sal e água acumulando */}
        {agua > 0 &&
          Array.from({ length: 10 }, (_, i) => (
            <text
              key={i}
              x={120 + i * 85}
              y={820 + Math.sin(i * 2.1) * 20}
              textAnchor="middle"
              fontFamily={EMOJI}
              fontSize={44}
              opacity={P(f, T.sal + i * 3, T.sal + i * 3 + 10)}
            >
              {i % 2 ? "💧" : "🧂"}
            </text>
          ))}
        <Coracao f={f} x={330} y={1150} s={0.7} ritmo={ritmo} />
        <Manometro x={780} y={1180} nivel={nivel} k={P(f, T.resultado, T.resultado + 12)} />
      </Tela>
      <Pill x={540} y={370} text="🤏 aperta o vaso, como uma mangueira" color={ANG} size={32} k={P(f, T.mangueira, T.mangueira + 12)} />
      <Pill x={540} y={900} text="segura sal e água no corpo" color={AZUL} size={30} k={P(f, T.sal, T.sal + 12)} />
      <Pill x={540} y={1340} text="📈 pressão sobe · coração trabalha mais" color={VERM} size={32} k={P(f, T.sobe, T.sobe + 12)} />
    </Part>
  );
};

// ---------- 4. a fechadura AT1 e a losartana ----------
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const kLos = it(f, T.losartana2, T.bloqueia, 0, 1, OUT);
  // a chave (angiotensina) tenta entrar e volta quando a fechadura está bloqueada
  const tenta = it(f, T.encaixa - 20, T.encaixa + 10, 0, 1, OUT);
  const volta = it(f, T.bloqueia + 10, T.bloqueia + 30, 0, 1, OUT);
  const bate = f >= T.bloqueia + 4 && f < T.bloqueia + 14 ? Math.sin((f - T.bloqueia) * 2) * 10 : 0;
  const chaveY = 380 + 240 * tenta - 200 * volta;
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={60}>
      <Title f={f} at={T.angio2} y={200} size={52} weight={600} from={ANG}>
        A chave e a fechadura
      </Title>
      <Tela>
        {/* membrana da célula do vaso */}
        <g opacity={P(f, T.angio2 + 10, T.angio2 + 24)}>
          <rect x={-20} y={860} width={1120} height={70} fill={rgba(ROXO, 0.18)} />
          {Array.from({ length: 28 }, (_, i) => (
            <circle key={i} cx={i * 40} cy={865} r={12} fill={rgba(ROXO, 0.6)} />
          ))}
          {Array.from({ length: 28 }, (_, i) => (
            <circle key={`b${i}`} cx={i * 40} cy={925} r={12} fill={rgba(ROXO, 0.6)} />
          ))}
        </g>
        {/* receptor AT1 em forma de fechadura */}
        <g opacity={P(f, T.fechadura - 6, T.fechadura + 8)}>
          <rect x={430} y={700} width={220} height={300} rx={40} fill={rgba(ROXO, 0.35)} stroke={ROXO} strokeWidth={8} />
          <circle cx={540} cy={790} r={34} fill="#0f172a" />
          <rect x={524} y={790} width={32} height={80} rx={8} fill="#0f172a" />
          <text x={540} y={1050} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={ROXO}>
            receptor AT1
          </text>
        </g>
        {/* losartana tampando a fechadura */}
        {kLos > 0 && (
          <g transform={`translate(${540 + (1 - kLos) * 420},${790 - (1 - kLos) * 200})`}>
            <circle r={58} fill={LOS} opacity={0.9} style={{ filter: `drop-shadow(0 0 20px ${LOS})` }} />
            <text y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill="#0f172a">
              LOS
            </text>
          </g>
        )}
        {/* a chave: angiotensina II */}
        {f >= T.angio2 + 20 && <Angio x={540 + bate} y={chaveY} s={1.1} />}
        {f >= T.bloqueia + 4 && (
          <text
            x={700}
            y={600}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={110 * P(f, T.bloqueia + 4, T.bloqueia + 14)}
            fill={VERM}
            style={{ filter: `drop-shadow(0 0 14px ${VERM})` }}
          >
            ✕
          </text>
        )}
      </Tela>
      <Pill x={540} y={330} text="🔑 angiotensina II = a chave" color={ANG} size={32} k={P(f, T.encaixa, T.encaixa + 12)} />
      <Pill x={540} y={1170} text="💊 a losartana BLOQUEIA a fechadura" color={LOS} size={36} k={P(f, T.bloqueia, T.bloqueia + 12)} />
    </Part>
  );
};

// ---------- 5. o resultado ----------
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const relax = it(f, T.relaxa, T.relaxa + 40, 0, 1, EASE);
  const nivel = 0.9 - 0.55 * it(f, T.cai, T.cai + 40, 0, 1, EASE);
  const ritmo = 2 - 0.9 * it(f, T.cai, T.tranquilo, 0, 1, EASE);
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={60}>
      <Title f={f} at={T.sem} y={200} size={56} weight={600} from={VERDE}>
        Sem o encaixe…
      </Title>
      <Tela>
        <Vaso f={f} y={560} raio={55 + 75 * relax} k={P(f, T.sem + 6, T.sem + 18)} vel={7 - 3 * relax} />
        <Coracao f={f} x={330} y={1100} s={0.7} ritmo={ritmo} />
        <Manometro x={780} y={1130} nivel={nivel} k={P(f, T.sem + 20, T.sem + 32)} />
      </Tela>
      <Pill x={540} y={370} text="😮‍💨 o vaso relaxa" color={VERDE} size={36} k={P(f, T.relaxa, T.relaxa + 12)} />
      <Pill x={540} y={820} text="💧 segura menos sal e água" color={AZUL} size={32} k={P(f, T.segura, T.segura + 12)} />
      <Pill x={540} y={1300} text="📉 pressão cai · ❤️ coração mais tranquilo" color={VERDE} size={32} k={P(f, T.cai, T.cai + 12)} />
    </Part>
  );
};

// ---------- 6. a ligação com a tosse ----------
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const card = (x: number, at: number, cor: string, nome: string, icone: string, texto: string, sub: string) => (
    <Card
      f={f}
      at={at}
      x={x}
      y={420}
      w={440}
      h={520}
      border={rgba(cor, 0.7)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <span style={{ fontWeight: 900, fontSize: 40, color: cor }}>{nome}</span>
      <span style={{ fontFamily: EMOJI, fontSize: 120 }}>{icone}</span>
      <span style={{ fontWeight: 800, fontSize: 36 }}>{texto}</span>
      <span style={{ fontWeight: 600, fontSize: 26, color: C.dim }}>{sub}</span>
    </Card>
  );
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={60}>
      <Title f={f} at={T.lembra} y={200} size={54} weight={600} from={AMAR}>
        Lembra do vídeo da tosse?
      </Title>
      {card(70, T.enalapril, VERM, "enalapril / captopril", "😣", "tosse seca", "acumula bradicinina")}
      {card(570, T.tosseSeca, VERDE, "losartana", "🙂", "tosse rara", "não acumula bradicinina")}
      <Pill x={540} y={330} text="mesmo sistema, ponto diferente" color={AMAR} size={30} k={P(f, T.ponto, T.ponto + 12)} />
      <Pill x={540} y={1030} text="🔄 troca comum quando o enalapril dá tosse" color={LOS} size={34} k={P(f, T.troca, T.troca + 12)} />
    </Part>
  );
};

// ---------- 7. cuidados ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={60}>
      <Title f={f} at={T.atencao} y={200} size={60} weight={600} from={AMAR}>
        Atenção <span style={{ fontFamily: EMOJI }}>⚠️</span>
      </Title>
      <Item
        f={f}
        at={T.tontura}
        y={340}
        icone="💫"
        cor={AMAR}
        texto={
          <>
            pode dar <b style={{ color: AMAR }}>tontura</b> no começo: levante devagar
          </>
        }
        h={160}
      />
      <Item
        f={f}
        at={T.potassio}
        y={530}
        icone="🧂"
        cor={ANG}
        texto={
          <>
            pode subir o <b style={{ color: ANG }}>potássio</b>: sal light ou suplemento só com orientação
          </>
        }
        h={180}
      />
      <Item
        f={f}
        at={T.gravidez}
        y={740}
        icone="🤰"
        cor={VERM}
        texto={
          <>
            <b style={{ color: VERM }}>não</b> deve ser usada na gravidez
          </>
        }
        h={160}
      />
    </Part>
  );
};

// ---------- 8. não pare sozinho ----------
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, T.naoPare, T.naoPare + 12, 0, 1, SNAP);
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={60}>
      <Title f={f} at={T.lembre} y={200} size={54} weight={600} from={COR}>
        Pressão alta é silenciosa
      </Title>
      <Tela>
        <Manometro x={540} y={620} nivel={0.8} k={P(f, T.lembre + 10, T.lembre + 22)} />
      </Tela>
      <Emoji f={f} at={T.sintomas} x={540} y={820} size={110}>
        😶
      </Emoji>
      <Pill x={540} y={950} text="quase não dá sintomas" color={AMAR} size={34} k={P(f, T.sintomas, T.sintomas + 12)} />
      {f >= T.naoPare && (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1150,
            transform: `translate(-50%,-50%) rotate(-8deg) scale(${1.5 - 0.5 * k})`,
            opacity: Math.min(1, k * 1.4),
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 52,
            letterSpacing: 3,
            color: VERM,
            border: `6px solid ${VERM}`,
            borderRadius: 14,
            padding: "8px 26px",
            background: rgba("#0f172a", 0.6),
            whiteSpace: "nowrap",
          }}
        >
          ❌ NÃO PARE SOZINHO
        </div>
      )}
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
              color: i === 1 ? bornColor(f, at, COR, "#fff1f2", 20) : bornColor(f, at, C.ink, COR),
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

export const VideoLosartana: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(2)[0] && f < R(3)[0]
      ? ANG
      : f >= R(3)[0] && f < R(4)[0]
        ? ROXO
        : f >= R(4)[0] && f < R(5)[0]
          ? VERDE
          : f >= R(6)[0] && f < R(7)[0]
            ? AMAR
            : COR;
  return (
    <AbsoluteFill>
      <Background color={cor} pulses={[T.coracao, T.aperta, T.sobe, T.bloqueia, T.cai, T.troca, T.naoPare, T.final]} />
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
      <Audio src={staticFile("losartana/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio src={staticFile("losartana/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): coração com a losartana bloqueando o AT1. Os 20% de baixo ficam livres (contador do TikTok).
export const CapaLosartana: React.FC = () => (
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
        fontSize: 92,
        lineHeight: 1.04,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      O QUE A
      <br />
      <span style={{ color: LOS }}>LOSARTANA</span>
      <br />
      FAZ NO SEU
      <br />
      CORAÇÃO?
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <Coracao f={0} x={540} y={980} s={1.2} giro={false} />
      <g transform="translate(790,840)">
        <circle r={78} fill={LOS} style={{ filter: `drop-shadow(0 0 24px ${LOS})` }} />
        <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={54} fill="#0f172a">
          AT1
        </text>
        <line x1={-55} y1={-55} x2={55} y2={55} stroke="#0f172a" strokeWidth={12} strokeLinecap="round" />
      </g>
    </svg>
    <div style={{ position: "absolute", top: 1330, width: W, display: "flex", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 38,
          color: C.ink,
          padding: "14px 30px",
          borderRadius: 40,
          border: `2px solid ${rgba(LOS, 0.7)}`,
          background: rgba(LOS, 0.14),
        }}
      >
        e por que ela <span style={{ color: LOS }}>quase não dá tosse</span>
      </span>
    </div>
    <Grain />
  </AbsoluteFill>
);
