import React from "react";
import { AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, OUT, P, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";
import { Card, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Seu glóbulo vermelho vive só 120 dias" — Modelo 1, tudo desenhado em código.
// Roteiro e fontes: roteiros/globulo_vermelho_120_dias.md. Narração da Juliana; tempos alinhados em fala.json.
const VERM = "#ef4444",
  AMBAR = "#fbbf24",
  AZUL = "#60a5fa",
  ROXO = "#a78bfa",
  OSSO = "#e7e5e4";

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
  dias: Tw("dias"),
  destruido: Tw("destruído"),
  outro: Tw("outro"),
  nasce: Tw("ele") - 6,
  medula: Tw("medula"),
  vertebras: Tw("vértebras"),
  esterno: Tw("esterno"),
  costelas: Tw("costelas"),
  bacia: Tw("bacia"),
  milhoes: Tw("milhões"),
  rins: Tw("quem") - 6,
  rinsW: Tw("rins"),
  falta: Tw("falta"),
  epo: Tw("eritropoetina"),
  produzir: Tw("produzir"),
  nucleoCena: Tw("para", 2) - 6,
  maduro: Tw("maduro"),
  nucleo: Tw("núcleo"),
  disco: Tw("disco"),
  hemoglobina: Tw("hemoglobina"),
  oxigenio: Tw("oxigênio", 2),
  baco: Tw("mas") - 6,
  fragil: Tw("frágil"),
  bacoW: Tw("baço"),
  espremer: Tw("espremer"),
  micro: Tw("micrômetros"),
  oito: Tw("oito"),
  velho: Tw("velho"),
  rompe: Tw("rompe"),
  recicla: Tw("nada") - 6,
  ferro: Tw("ferro"),
  novo: Tw("novo"),
  bilirrubina: Tw("bilirrubina"),
  fezes: Tw("fezes"),
  exame: Tw("causa") - 14,
  glicada: Tw("glicada"),
  media: Tw("média"),
  meses: Tw("meses"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_GLOBULO = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.dias, "pop", 0.2],
  [T.destruido, "trava", 0.28],
  [T.outro, "pop", 0.22],
  [T.nasce, "whoosh", 0.25],
  [T.vertebras, "bip", 0.18],
  [T.esterno, "bip", 0.18],
  [T.costelas, "bip", 0.18],
  [T.bacia, "bip", 0.18],
  [T.milhoes, "plim", 0.22],
  [T.rins, "whoosh", 0.25],
  [T.falta, "trava", 0.25],
  [T.epo, "plim", 0.25],
  [T.nucleoCena, "whoosh", 0.25],
  [T.nucleo, "pop", 0.25],
  [T.baco, "whoosh", 0.25],
  [T.rompe, "trava", 0.35],
  [T.recicla, "whoosh", 0.25],
  [T.ferro, "pop", 0.2],
  [T.bilirrubina, "pop", 0.2],
  [T.exame, "whoosh", 0.25],
  [T.meses, "plim", 0.25],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

// glóbulo vermelho visto de lado: disco com o centro mais claro (bicôncavo)
const Hemacia: React.FC<{ x: number; y: number; r: number; rot?: number; sx?: number; sy?: number; alpha?: number; racha?: number }> = ({
  x,
  y,
  r,
  rot = 0,
  sx = 1,
  sy = 1,
  alpha = 1,
  racha = 0,
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${sx},${sy})`} opacity={alpha}>
    <circle r={r} fill="url(#hemGrad)" style={{ filter: `drop-shadow(0 0 ${r * 0.35}px ${rgba(VERM, 0.55)})` }} />
    <ellipse rx={r * 0.48} ry={r * 0.48} fill="rgba(255,190,190,0.28)" />
    {racha > 0 && (
      <path
        d={`M${-r * 0.7},${-r * 0.2} L${-r * 0.2},${r * 0.05} L${r * 0.1},${-r * 0.3} L${r * 0.7},${r * 0.15}`}
        stroke="#1a0505"
        strokeWidth={r * 0.08}
        fill="none"
        strokeDasharray={r * 2}
        strokeDashoffset={r * 2 * (1 - racha)}
      />
    )}
  </g>
);
const Defs: React.FC = () => (
  <defs>
    <radialGradient id="hemGrad" cx="45%" cy="40%" r="60%">
      <stop offset="0" stopColor="#ff8a8a" />
      <stop offset="0.55" stopColor="#dc2626" />
      <stop offset="1" stopColor="#7f1d1d" />
    </radialGradient>
  </defs>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    <Defs />
    {children}
  </svg>
);

// 1. o glóbulo e o contador de dias
const Contador: React.FC<{ f: number }> = ({ f }) => {
  const d = Math.round(120 * it(f, T.dias - 10, T.destruido - 8, 0, 1, OUT));
  return (
    <div style={{ position: "absolute", top: 1330, width: W, textAlign: "center", fontFamily: SANS, color: C.ink }}>
      <div style={{ fontWeight: 900, fontSize: 150, color: VERM, lineHeight: 1, textShadow: `0 0 30px ${rgba(VERM, 0.5)}` }}>{d}</div>
      <div style={{ fontWeight: 700, fontSize: 48, opacity: 0.85 }}>dias</div>
    </div>
  );
};

// 2. esqueleto simples com os ossos que fabricam sangue
const Esqueleto: React.FC<{ f: number }> = ({ f }) => {
  const luz = (at: number) => P(f, at - 4, at + 8);
  const cor = (at: number) => (f >= at - 4 ? VERM : OSSO);
  const glow = (at: number) => (f >= at - 4 ? `drop-shadow(0 0 ${14 * luz(at)}px ${VERM})` : undefined);
  return (
    <Svg>
      <g transform="translate(540,1000)" opacity={P(f, T.nasce, T.nasce + 10)}>
        <circle cx={0} cy={-380} r={78} fill={OSSO} opacity={0.85} />
        {/* vértebras */}
        <g style={{ filter: glow(T.vertebras) }}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={-16} y={-290 + i * 38} width={32} height={28} rx={6} fill={cor(T.vertebras)} />
          ))}
        </g>
        {/* esterno */}
        <rect x={-14} y={-260} width={28} height={170} rx={10} fill={cor(T.esterno)} style={{ filter: glow(T.esterno) }} transform="translate(0,0)" opacity={0.95} />
        {/* costelas */}
        <g style={{ filter: glow(T.costelas) }} fill="none" stroke={cor(T.costelas)} strokeWidth={14} strokeLinecap="round">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <path d={`M-20,${-250 + i * 32} C${-150 - i * 6},${-270 + i * 32} ${-170},${-170 + i * 30} ${-90},${-140 + i * 34}`} />
              <path d={`M20,${-250 + i * 32} C${150 + i * 6},${-270 + i * 32} ${170},${-170 + i * 30} ${90},${-140 + i * 34}`} />
            </g>
          ))}
        </g>
        {/* bacia */}
        <path
          d="M-170,190 C-200,120 -120,90 -30,140 L30,140 C120,90 200,120 170,190 C140,260 60,270 0,230 C-60,270 -140,260 -170,190 Z"
          fill={cor(T.bacia)}
          style={{ filter: glow(T.bacia) }}
        />
        {/* braços e pernas, só o contorno */}
        <g stroke={OSSO} strokeWidth={14} strokeLinecap="round" opacity={0.45}>
          <line x1={-120} y1={-260} x2={-200} y2={60} />
          <line x1={120} y1={-260} x2={200} y2={60} />
          <line x1={-90} y1={250} x2={-110} y2={560} />
          <line x1={90} y1={250} x2={110} y2={560} />
        </g>
      </g>
      {/* glóbulos novos saindo */}
      {f >= T.milhoes - 6 &&
        Array.from({ length: 14 }, (_, i) => {
          const t = (f - T.milhoes + 6 + i * 9) % 70;
          const x = 540 + (random(`gx${i}`) - 0.5) * 300 + t * (random(`gv${i}`) - 0.5) * 12;
          const y = 1100 - t * 9;
          return <Hemacia key={i} x={x} y={y} r={22} rot={t * 4} alpha={Math.min(1, t / 8) * (1 - t / 70)} />;
        })}
    </Svg>
  );
};

// 3. rins mandam a eritropoetina
const Rins: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.rins, T.rins + 14, 0, 1, SNAP);
  const voa = it(f, T.epo + 4, T.produzir - 2, 0, 1, OUT);
  const rim = (x: number, flip: number) => (
    <path
      transform={`translate(${x},640) scale(${flip * k},${k})`}
      d="M-60,-110 C40,-140 90,-60 80,0 C70,60 40,130 -50,110 C-100,95 -90,40 -40,20 C-10,10 -10,-20 -40,-30 C-90,-50 -110,-95 -60,-110 Z"
      fill={AMBAR}
      opacity={0.9}
      style={{ filter: `drop-shadow(0 0 18px ${rgba(AMBAR, 0.5)})` }}
    />
  );
  return (
    <Svg>
      {rim(380, 1)}
      {rim(700, -1)}
      {/* osso com medula no alvo */}
      <g transform="translate(540,1340)" opacity={P(f, T.epo - 4, T.epo + 8)}>
        <rect x={-260} y={-50} width={520} height={100} rx={50} fill={OSSO} />
        <circle cx={-260} cy={-40} r={50} fill={OSSO} />
        <circle cx={-260} cy={40} r={50} fill={OSSO} />
        <circle cx={260} cy={-40} r={50} fill={OSSO} />
        <circle cx={260} cy={40} r={50} fill={OSSO} />
        <rect x={-200} y={-28} width={400} height={56} rx={28} fill={f >= T.produzir - 4 ? VERM : "#b45353"} style={{ filter: f >= T.produzir - 4 ? `drop-shadow(0 0 16px ${VERM})` : undefined }} />
      </g>
      {f >= T.produzir - 4 &&
        Array.from({ length: 8 }, (_, i) => {
          const t = f - T.produzir + 4 - i * 4;
          if (t < 0) return null;
          return <Hemacia key={i} x={360 + i * 52} y={1340 - Math.min(t, 30) * 6} r={22} alpha={Math.min(1, t / 6)} />;
        })}
      {/* mensageiro EPO */}
      {f >= T.epo - 2 && (
        <g transform={`translate(${540},${700 + voa * 560})`}>
          <rect x={-90} y={-36} width={180} height={72} rx={36} fill={rgba(AZUL, 0.2)} stroke={AZUL} strokeWidth={4} />
          <text textAnchor="middle" y={14} fontFamily={SANS} fontWeight={900} fontSize={40} fill={AZUL}>
            EPO
          </text>
        </g>
      )}
    </Svg>
  );
};

// 4. a célula expulsa o núcleo e vira disco
const Nucleo: React.FC<{ f: number }> = ({ f }) => {
  const sai = it(f, T.nucleo - 6, T.nucleo + 18, 0, 1, OUT);
  const vermelho = it(f, T.nucleo + 4, T.disco + 6, 0, 1, OUT);
  return (
    <Svg>
      <g transform="translate(540,1000)">
        <circle r={230} fill={vermelho > 0.5 ? "url(#hemGrad)" : "#c084a0"} opacity={0.35 + 0.65 * Math.max(vermelho, 0.6)} style={{ filter: `drop-shadow(0 0 40px ${rgba(VERM, 0.4 * vermelho)})` }} />
        {vermelho > 0.5 && <circle r={110} fill="rgba(255,190,190,0.25)" opacity={vermelho} />}
        <circle cx={60 + sai * 300} cy={-20 - sai * 330} r={90} fill={ROXO} opacity={1 - sai * 0.6} style={{ filter: `drop-shadow(0 0 18px ${ROXO})` }} />
        {sai > 0.3 && (
          <text x={60 + sai * 300} y={-140 - sai * 330} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={ROXO} opacity={sai}>
            núcleo
          </text>
        )}
        {/* O2 grudando na hemoglobina */}
        {f >= T.oxigenio - 10 &&
          Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + f / 40;
            const u = it(f, T.oxigenio - 10 + i * 2, T.oxigenio + 8 + i * 2, 0, 1, OUT);
            const r = 420 - 250 * u;
            return (
              <g key={i} transform={`translate(${Math.cos(a) * r},${Math.sin(a) * r})`} opacity={u}>
                <circle r={34} fill={rgba(AZUL, 0.25)} stroke={AZUL} strokeWidth={3} />
                <text textAnchor="middle" y={12} fontFamily={SANS} fontWeight={800} fontSize={30} fill={AZUL}>
                  O₂
                </text>
              </g>
            );
          })}
      </g>
    </Svg>
  );
};

// 5. o túnel do baço
const Baco: React.FC<{ f: number }> = ({ f }) => {
  const anda = it(f, T.espremer - 20, T.velho, 0, 1, OUT);
  const x = 140 + anda * 360;
  const aperto = it(f, T.espremer, T.oito, 0, 1, OUT);
  const racha = it(f, T.velho, T.rompe, 0, 1, OUT);
  const rompeu = f >= T.rompe;
  return (
    <Svg>
      {/* paredes da polpa vermelha */}
      <rect x={520} y={620} width={260} height={360} rx={30} fill="#7c2d3a" opacity={0.85} />
      <rect x={520} y={1040} width={260} height={360} rx={30} fill="#7c2d3a" opacity={0.85} />
      <line x1={800} y1={980} x2={800} y2={1040} stroke={AMBAR} strokeWidth={5} />
      <text x={820} y={1022} fontFamily={SANS} fontWeight={800} fontSize={40} fill={AMBAR} opacity={P(f, T.micro - 6, T.micro + 6)}>
        3 µm
      </text>
      {!rompeu && <Hemacia x={x} y={1010} r={110} sx={1 + 0.35 * aperto} sy={1 - 0.45 * aperto} racha={racha} />}
      {!rompeu && (
        <text x={x} y={1170} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={C.ink} opacity={P(f, T.oito - 6, T.oito + 6)}>
          8 µm
        </text>
      )}
      {rompeu &&
        Array.from({ length: 12 }, (_, i) => {
          const t = f - T.rompe;
          const a = (i / 12) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={x + Math.cos(a) * t * (6 + random(`r${i}`) * 6)}
              cy={1010 + Math.sin(a) * t * (6 + random(`s${i}`) * 6)}
              r={14 + random(`z${i}`) * 14}
              fill="#dc2626"
              opacity={Math.max(0, 1 - t / 40)}
            />
          );
        })}
    </Svg>
  );
};

// 6. reciclagem: ferro e bilirrubina
const Reciclagem: React.FC<{ f: number }> = ({ f }) => {
  const volta = it(f, T.ferro, T.novo - 4, 0, 1, OUT);
  return (
    <Svg>
      <g transform={`translate(${300 + volta * 0},${720 + volta * 0})`}>
        <circle r={80} fill={rgba(AMBAR, 0.2)} stroke={AMBAR} strokeWidth={5} opacity={P(f, T.ferro - 6, T.ferro + 4)} />
        <text textAnchor="middle" y={22} fontFamily={SANS} fontWeight={900} fontSize={64} fill={AMBAR} opacity={P(f, T.ferro - 6, T.ferro + 4)}>
          Fe
        </text>
      </g>
      <path d="M380,720 C520,600 660,600 780,720" fill="none" stroke={AMBAR} strokeWidth={6} strokeDasharray="14 12" opacity={volta} />
      {f >= T.novo - 6 && <Hemacia x={800} y={760} r={80 * it(f, T.novo - 6, T.novo + 8, 0, 1, SNAP)} rot={f * 2} />}
    </Svg>
  );
};

// 7. tubo de exame HbA1c
const Tubo: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.exame, T.exame + 14, 0, 1, SNAP);
  return (
    <Svg>
      <g transform={`translate(330,1000) rotate(-8) scale(${k})`}>
        <rect x={-70} y={-260} width={140} height={440} rx={60} fill="rgba(255,255,255,0.08)" stroke={C.ink} strokeWidth={6} />
        <rect x={-62} y={-60} width={124} height={232} rx={54} fill="#b91c1c" />
        <rect x={-90} y={-290} width={180} height={50} rx={14} fill={ROXO} />
        <rect x={-66} y={-200} width={132} height={70} fill="#f5f5f4" />
        <text textAnchor="middle" y={-152} fontFamily={SANS} fontWeight={900} fontSize={34} fill="#111">
          HbA1c
        </text>
      </g>
    </Svg>
  );
};

export const VideoGlobulo: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo = f >= T.rins && f < T.nucleoCena ? AMBAR : f >= T.exame && f < T.siga ? ROXO : VERM;
  return (
    <AbsoluteFill>
      <Background color={corFundo} pulses={[T.destruido, T.outro, T.milhoes, T.epo, T.nucleo, T.rompe, T.novo, T.meses, T.final]} />

      {/* 1. gancho */}
      <Part from={0} to={T.nasce}>
        <Title f={f} at={2} y={200} size={66} font={SANS} weight={900} from={VERM}>
          VOCÊ SABIA?
        </Title>
        <Svg>
          {f < T.destruido + 10 && (
            <Hemacia x={540} y={860} r={250} rot={f * 1.5} alpha={1 - P(f, T.destruido, T.destruido + 10)} racha={P(f, T.destruido - 6, T.destruido + 4)} />
          )}
          {f >= T.outro - 6 && <Hemacia x={540} y={860} r={250 * it(f, T.outro - 6, T.outro + 8, 0, 1, SNAP)} rot={f * 1.5} />}
        </Svg>
        <Contador f={f} />
        <Pill x={540} y={1600} text="e outro já ocupa o lugar 🔄" color={VERM} size={42} k={P(f, T.outro, T.outro + 10)} />
      </Part>

      {/* 2. onde nasce */}
      <Part from={T.nasce} to={T.rins}>
        <Title f={f} at={T.nasce + 4} y={190} size={74} weight={600} from={VERM}>
          nasce na <span style={{ color: VERM }}>medula óssea</span> 🦴
        </Title>
        <Esqueleto f={f} />
        <Pill x={540} y={1640} text="⚡ milhões por segundo" color={VERM} size={50} k={P(f, T.milhoes, T.milhoes + 12)} />
      </Part>

      {/* 3. a ordem dos rins */}
      <Part from={T.rins} to={T.nucleoCena}>
        <Title f={f} at={T.rins + 4} y={190} size={74} weight={600} from={AMBAR}>
          quem dá a ordem: os <span style={{ color: AMBAR }}>rins</span>
        </Title>
        <Pill x={540} y={860} text="⚠️ falta oxigênio" color={AMBAR} size={44} k={P(f, T.falta, T.falta + 10)} />
        <Rins f={f} />
        <Pill x={540} y={1560} text="ERITROPOETINA → “produz mais!”" color={AZUL} size={40} k={P(f, T.epo, T.epo + 12)} />
      </Part>

      {/* 4. sem núcleo */}
      <Part from={T.nucleoCena} to={T.baco}>
        <Title f={f} at={T.nucleoCena + 4} y={190} size={74} weight={600} from={VERM}>
          ele abre mão do <span style={{ color: ROXO }}>núcleo</span>
        </Title>
        <Nucleo f={f} />
        <Pill x={540} y={1450} text="disco cheio de hemoglobina" color={VERM} size={44} k={P(f, T.hemoglobina - 4, T.hemoglobina + 8)} />
        <Pill x={540} y={1570} text="🫁 carrega o oxigênio" color={AZUL} size={44} k={P(f, T.oxigenio - 4, T.oxigenio + 8)} />
      </Part>

      {/* 5. o fim no baço */}
      <Part from={T.baco} to={T.recicla}>
        <Title f={f} at={T.baco + 4} y={190} size={74} weight={600} from={VERM}>
          o fim acontece no <span style={{ color: VERM }}>baço</span>
        </Title>
        <Pill x={540} y={420} text="com o tempo, fica frágil" color={AMBAR} size={42} k={P(f, T.fragil - 4, T.fragil + 8)} />
        <Baco f={f} />
        <Pill x={540} y={1560} text="💥 o velho se rompe" color={VERM} size={48} k={P(f, T.rompe - 4, T.rompe + 8)} />
      </Part>

      {/* 6. reciclagem */}
      <Part from={T.recicla} to={T.exame}>
        <Title f={f} at={T.recicla + 4} y={190} size={78} weight={600} from={AMBAR}>
          nada se perde ♻️
        </Title>
        <Reciclagem f={f} />
        <Pill x={540} y={960} text="ferro → glóbulo novo" color={AMBAR} size={44} k={P(f, T.novo - 6, T.novo + 6)} />
        <Card f={f} at={T.bilirrubina - 6} x={110} y={1120} w={860} h={280} border={rgba(AMBAR, 0.7)} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: "#facc15", boxShadow: "0 0 30px rgba(250,204,21,0.6)", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: bornColor(f, T.bilirrubina, C.ink, AMBAR) }}>bilirrubina</span>
            <span style={{ fontWeight: 700, fontSize: 38, color: "#d6a35c", opacity: P(f, T.fezes - 6, T.fezes + 6) }}>dá a cor marrom das fezes 💩</span>
          </div>
        </Card>
      </Part>

      {/* 7. hemoglobina glicada */}
      <Part from={T.exame} to={T.siga}>
        <Title f={f} at={T.exame + 4} y={190} size={70} weight={600} from={ROXO}>
          por isso o exame de <span style={{ color: ROXO }}>hemoglobina glicada</span>
        </Title>
        <Tubo f={f} />
        <Card f={f} at={T.media - 6} x={480} y={820} w={520} h={360} border={rgba(ROXO, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 40 }}>média da glicose</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 96, color: ROXO, opacity: P(f, T.meses - 6, T.meses + 6) }}>3 meses</span>
        </Card>
      </Part>

      {/* 8. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card f={f} at={T.siga} x={110} y={760} w={860} h={300} border={rgba(VERM, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "0 40px" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: bornColor(f, T.siga, C.ink, VERM) }}>Me siga</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>para mais dicas de farmacologia e curiosidades sobre a área</span>
        </Card>
      </Part>

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_GLOBULO} inY={100} outDur={1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map((l, i) => {
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
                color: i === 1 ? bornColor(f, at, VERM, "#fef2f2", 20) : bornColor(f, at, C.ink, VERM),
                opacity: k,
                transform: `translateY(${(1 - k) * 40}px)`,
              }}
            >
              {l}
            </div>
          );
        })}
      </Part>
      <Grain />
      <Audio src={staticFile("globulo/narracao.mp3")} />
      <Audio src={staticFile("globulo/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION_GLOBULO - 60, DURATION_GLOBULO))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
