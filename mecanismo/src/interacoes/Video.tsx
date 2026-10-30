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
import { OUT, P, SNAP, bornColor, it, rgba, tri } from "../lib";
import falaJson from "./fala.json";

// "7 remédios que não combinam" — YouTube longo HORIZONTAL 1920×1080, visual do Modelo 1.
// Roteiro e fontes: roteiros/remedios_que_nao_combinam.md. Narração: VoiceStudio, perfil "Farmacêutica PT-BR".
// Tempos em fala.json (scripts/transcrever.py). Cada capítulo é descrito em CAPS e os tópicos entram na palavra-gatilho.
export const W = 1920;
export const H = 1080;
const EMOJI = "'Noto Color Emoji','Segoe UI Emoji',sans-serif";
const VERM = "#ef4444",
  AMBAR = "#fbbf24",
  VERDE = "#4ade80",
  AZUL = "#60a5fa",
  ROXO = "#a78bfa",
  ROSA = "#f472b6",
  TEAL = "#2dd4bf";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
// primeira vez que a palavra aparece a partir do quadro "desde"
const Ta = (w: string, desde = 0) => {
  for (const p of FALA) if (p.f >= desde && norm(p.w) === w) return p.f;
  return 99999;
};
const Tn = (w: string, n: number) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};

type Cap = {
  a: string;
  b: string;
  cor: string;
  emoji: string;
  selo: string;
  seloCor: string;
  itens: [string, string][]; // [palavra-gatilho, texto]
};
const CAPS: Cap[] = [
  {
    a: "anticoncepcional",
    b: "antibiótico",
    cor: ROSA,
    emoji: "💊",
    selo: "quase sempre é mito",
    seloCor: VERDE,
    itens: [
      ["mito", "❌ Mito: a maioria não corta o efeito"],
      ["amoxicilina", "✅ amoxicilina, azitromicina, cefalexina"],
      ["rifampicina", "⚠️ exceção: rifampicina (tuberculose)"],
      ["fígado", "⚙️ acelera o fígado: o hormônio cai"],
      ["quatro", "📅 outro método + 4 semanas depois"],
      ["vomitar", "🤮 vômito ou diarreia forte: atenção"],
    ],
  },
  {
    a: "anti-inflamatório",
    b: "remédio de pressão",
    cor: AMBAR,
    emoji: "🫘",
    selo: "cuidado",
    seloCor: AMBAR,
    itens: [
      ["ibuprofeno", "💊 ibuprofeno, diclofenaco, naproxeno"],
      ["segurar", "🧂 o corpo segura sal e água"],
      ["atrapalhar", "📈 atrapalha o remédio de pressão"],
      ["tripla", "⚠️ tripla ameaça: + losartana/enalapril + diurético"],
      ["rins", "🫘 pode lesar os rins (1º mês)"],
      ["conta", "🚫 nada de anti-inflamatório por conta própria"],
    ],
  },
  {
    a: "omeprazol",
    b: "clopidogrel",
    cor: AZUL,
    emoji: "🔑",
    selo: "cuidado",
    seloCor: AMBAR,
    itens: [
      ["infarto", "🩸 clopidogrel: afina o sangue (infarto, stent)"],
      ["ativado", "🔑 precisa ser ativado pelo fígado"],
      ["bloqueia", "🚫 o omeprazol bloqueia essa ativação"],
      ["horários", "⏰ separar os horários não resolve"],
      ["pantoprazol", "✅ alternativa comum: pantoprazol"],
    ],
  },
  {
    a: "varfarina",
    b: "anti-inflamatório",
    cor: VERM,
    emoji: "🩸",
    selo: "risco de sangramento",
    seloCor: VERM,
    itens: [
      ["afina", "🩸 a varfarina afina o sangue"],
      ["irrita", "🔥 o anti-inflamatório irrita o estômago"],
      ["sangramento", "⚠️ muito mais risco de sangramento"],
      ["paracetamol", "✅ dor ou febre: paracetamol"],
      ["altas", "📏 menor dose e por pouco tempo"],
    ],
  },
  {
    a: "sinvastatina",
    b: "claritromicina",
    cor: ROXO,
    emoji: "💪",
    selo: "não usar juntos",
    seloCor: VERM,
    itens: [
      ["colesterol", "🫀 sinvastatina: colesterol"],
      ["trava", "🔒 a claritromicina trava a enzima do fígado"],
      ["acumula", "📈 a sinvastatina se acumula no sangue"],
      ["músculos", "💪 dor e lesão nos músculos"],
      ["proíbe", "🚫 a bula proíbe: suspender a sinvastatina"],
      ["toranja", "🍊 evite suco de toranja (grapefruit)"],
    ],
  },
  {
    a: "levotiroxina",
    b: "cálcio, ferro, antiácido",
    cor: TEAL,
    emoji: "🦋",
    selo: "separar horários",
    seloCor: AMBAR,
    itens: [
      ["tireoide", "🦋 hormônio da tireoide"],
      ["grudam", "🧲 cálcio, ferro e antiácido grudam nela"],
      ["jejum", "💧 em jejum, sozinha, com água"],
      ["quatro", "⏰ 4 horas de distância"],
    ],
  },
  {
    a: "sildenafila",
    b: "nitrato",
    cor: VERM,
    emoji: "📉",
    selo: "proibido",
    seloCor: VERM,
    itens: [
      ["erétil", "💊 sildenafila: disfunção erétil"],
      ["isossorbida", "🫀 nitrato (isossorbida): dor no peito"],
      ["caminho", "↔️ abrem os vasos pelo mesmo caminho"],
      ["desmaio", "📉 a pressão despenca: desmaio, infarto"],
      ["proibida", "🚫 combinação proibida"],
      ["vinte", "⏱️ nitrato só depois de 24 horas"],
    ],
  },
];

// TEMPOS
const INICIO = CAPS.map((_, i) => Tn("número", i + 1) - 8);
const T = {
  cortar: Ta("cortar"),
  somar: Ta("somar"),
  sete: Ta("sete"),
  recap: Ta("recapitulando") - 8,
  regra: Ta("regra") - 10,
  siga: Ta("siga") - 14,
  final: FALA[FALA.length - 1].f + 30,
};
const FIM = [...INICIO.slice(1), T.recap];
const RECAP: [string, string, string][] = [
  [
    "anticoncepcional",
    "Anticoncepcional só perde efeito com rifampicina",
    ROSA,
  ],
  ["atrapalha", "Anti-inflamatório atrapalha a pressão e o rim", AMBAR],
  ["enfraquece", "Omeprazol enfraquece o clopidogrel", AZUL],
  ["sangramento", "Varfarina + anti-inflamatório: sangramento", VERM],
  ["toranja", "Sinvastatina: nada de claritromicina nem toranja", ROXO],
  ["ferro", "Levotiroxina longe do cálcio e do ferro", TEAL],
  ["nunca", "Sildenafila nunca junto com nitrato", VERM],
];
export const DURATION_INTERACOES = T.final + 120;
// FIM TEMPOS

const SFX: [number, string, number][] = [
  [T.cortar, "pop", 0.2],
  [T.somar, "pop", 0.2],
  ...INICIO.map((f): [number, string, number] => [f, "whoosh", 0.28]),
  ...INICIO.map((f): [number, string, number] => [f + 26, "trava", 0.22]),
  [T.recap, "whoosh", 0.28],
  [T.regra, "plim", 0.25],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

// ---------- fundo horizontal ----------
const Fundo: React.FC<{ cor: string; pulsos: number[] }> = ({
  cor,
  pulsos,
}) => {
  const f = useCurrentFrame();
  const pulse = pulsos.reduce((s, p) => Math.max(s, tri(f, p, 15)), 0);
  const force = 0.3 + 0.05 * Math.sin((f / 240) * Math.PI * 2) + 0.16 * pulse;
  const rh = 520 + 40 * Math.sin((f / 330) * Math.PI * 2) + 100 * pulse;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(cor.slice(i, i + 2), 16));
  const stops = Array.from({ length: 11 }, (_, i) => {
    const d = i / 10;
    return `rgba(${r},${g},${b},${(force * Math.pow(1 - d, 1.9)).toFixed(4)}) ${d * 100}%`;
  }).join(",");
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1500px 900px at 50% 30%, ${C.bg2} 0%, rgba(7,11,26,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1800px ${rh}px at 50% ${H + 140}px, ${stops})`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 80 }, (_, i) => {
          const x0 = random(`x${i}`) * W,
            y0 = random(`y${i}`) * H;
          const sp = 0.2 + random(`s${i}`) * 0.5,
            r0 = 1 + random(`r${i}`) * 2.2;
          const y = (((y0 - f * sp) % H) + H) % H;
          return (
            <circle
              key={i}
              cx={x0 + Math.sin(f / 40 + i) * 10}
              cy={y}
              r={r0}
              fill="rgb(170,185,255)"
              opacity={0.1 + 0.07 * Math.sin(f / 25 + i)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Grao: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill
      style={{ mixBlendMode: "multiply", opacity: 0.2, pointerEvents: "none" }}
    >
      <svg width={W} height={H}>
        <filter id={`g${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={seed}
          />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 1.08" />
        </filter>
        <rect width={W} height={H} filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// cena que entra e sai com um leve deslize
const Cena: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const ki = from <= 0 ? 1 : it(f, from, from + 14, 0, 1, OUT);
  const ko = it(f, to - 10, to, 0, 1, OUT);
  const op = Math.min(ki, 1 - ko);
  return (
    <AbsoluteFill
      style={{
        opacity: op,
        transform: `translateY(${(1 - ki) * 40 - ko * 80}px)`,
        filter: op < 0.98 ? `blur(${(1 - op) * 10}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Pilula: React.FC<{
  x: number;
  y: number;
  txt: string;
  cor: string;
  k: number;
  size?: number;
}> = ({ x, y, txt, cor, k, size = 44 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * k})`,
      opacity: Math.min(1, k * 1.4),
      padding: `${size * 0.4}px ${size * 0.8}px`,
      borderRadius: 999,
      border: `3px solid ${cor}`,
      background: rgba(cor, 0.16),
      color: cor,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      whiteSpace: "nowrap",
      boxShadow: `0 0 ${24 * k}px ${rgba(cor, 0.3)}`,
    }}
  >
    {txt}
  </div>
);

// ---------- abertura ----------
const Abertura: React.FC<{ to: number }> = ({ to }) => {
  const f = useCurrentFrame();
  const junta = it(f, 20, 60, 0, 1, OUT);
  const faisca = tri(f, 60, 14);
  return (
    <Cena from={0} to={to}>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 104,
          color: C.ink,
          opacity: P(f, 2, 16),
        }}
      >
        <span
          style={{ color: VERM, textShadow: `0 0 30px ${rgba(VERM, 0.5)}` }}
        >
          {f >= T.sete - 4 ? "7 " : ""}
        </span>
        REMÉDIOS QUE <span style={{ color: VERM }}>NÃO COMBINAM</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960 - 330 + 210 * junta,
          top: 560,
          transform: "translate(-50%,-50%) rotate(-30deg)",
          fontFamily: EMOJI,
          fontSize: 230,
        }}
      >
        💊
      </div>
      <div
        style={{
          position: "absolute",
          left: 960 + 330 - 210 * junta,
          top: 560,
          transform: "translate(-50%,-50%) rotate(30deg)",
          fontFamily: EMOJI,
          fontSize: 230,
          filter: "hue-rotate(160deg)",
        }}
      >
        💊
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 420,
          transform: `translate(-50%,-50%) scale(${0.6 + 0.8 * faisca + 0.4 * P(f, 60, 70)})`,
          opacity: P(f, 56, 64),
          fontFamily: EMOJI,
          fontSize: 140,
        }}
      >
        ⚡
      </div>
      <Pilula
        x={620}
        y={860}
        txt="➖ um corta o efeito do outro"
        cor={AZUL}
        k={P(f, T.cortar - 4, T.cortar + 10)}
      />
      <Pilula
        x={1300}
        y={860}
        txt="➕ ou soma de um jeito perigoso"
        cor={VERM}
        k={P(f, T.somar - 4, T.somar + 10)}
      />
    </Cena>
  );
};

// ---------- capítulo ----------
const Capitulo: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const c = CAPS[i];
  const from = INICIO[i],
    to = FIM[i];
  const kA = it(f, from + 6, from + 20, 0, 1, SNAP);
  const kB = it(f, from + 14, from + 28, 0, 1, SNAP);
  const kSelo = it(f, from + 26, from + 38, 0, 1, SNAP);
  const choque = tri(f, from + 26, 12);
  let desde = from;
  const tempos = c.itens.map(([w]) => {
    const t = Ta(w, desde);
    desde = t;
    return t;
  });
  return (
    <Cena from={from} to={to}>
      {/* número */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 150,
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 220,
          lineHeight: 1,
          color: bornColor(f, from + 4, c.cor, C.ink, 20),
          textShadow: `0 0 40px ${rgba(c.cor, 0.45)}`,
          opacity: P(f, from, from + 10),
        }}
      >
        {i + 1}
      </div>
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 520,
          transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * Math.sin(f / 18)})`,
          fontFamily: EMOJI,
          fontSize: 220,
          opacity: 0.18,
        }}
      >
        {c.emoji}
      </div>
      {/* os dois remédios */}
      <Pilula x={520} y={420} txt={c.a} cor={c.cor} k={kA} size={52} />
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 535,
          transform: `translate(-50%,-50%) scale(${0.8 + 0.6 * choque})`,
          fontFamily: EMOJI,
          fontSize: 80,
          opacity: kB,
        }}
      >
        ⚡
      </div>
      <Pilula x={520} y={650} txt={c.b} cor={C.ink} k={kB} size={52} />
      {/* selo */}
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 820,
          transform: `translate(-50%,-50%) rotate(-5deg) scale(${1.6 - 0.6 * kSelo})`,
          opacity: kSelo,
          border: `6px solid ${c.seloCor}`,
          borderRadius: 14,
          padding: "8px 30px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 46,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: c.seloCor,
          background: rgba(c.seloCor, 0.1),
          whiteSpace: "nowrap",
        }}
      >
        {c.selo}
      </div>
      {/* tópicos */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 170,
          width: 860,
          height: 760,
          borderRadius: 30,
          background: C.box,
          border: `2px solid ${rgba(c.cor, 0.6)}`,
          boxShadow: "0 16px 44px rgba(0,0,0,.35)",
          opacity: P(f, from + 10, from + 24),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
          padding: "0 46px",
          boxSizing: "border-box",
        }}
      >
        {c.itens.map(([, txt], j) => {
          const k = it(f, tempos[j] - 6, tempos[j] + 8, 0, 1, OUT);
          const atual =
            j === c.itens.length - 1
              ? f >= tempos[j]
              : f >= tempos[j] && f < tempos[j + 1];
          return (
            <div
              key={j}
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 38,
                lineHeight: 1.25,
                color: atual ? C.ink : rgba("#e2e8f0", 0.72),
                opacity: k,
                transform: `translateX(${(1 - k) * 40}px)`,
                borderLeft: `6px solid ${atual ? c.cor : "transparent"}`,
                paddingLeft: 20,
              }}
            >
              {txt}
            </div>
          );
        })}
      </div>
    </Cena>
  );
};

// ---------- topo: capítulo atual e barra de progresso ----------
const Hud: React.FC = () => {
  const f = useCurrentFrame();
  if (f < INICIO[0] || f > T.siga) return null;
  let idx = -1;
  INICIO.forEach((s, i) => {
    if (f >= s) idx = i;
  });
  const rotulo =
    f >= T.regra
      ? "REGRA DE OURO"
      : f >= T.recap
        ? "RESUMO"
        : `${idx + 1} DE 7`;
  const prog = P(f, INICIO[0], T.siga);
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 60,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 4,
          color: rgba("#e2e8f0", 0.7),
        }}
      >
        {rotulo}
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 60,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 4,
          color: VERM,
        }}
      >
        REMÉDIOS QUE NÃO COMBINAM
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          bottom: 50,
          height: 8,
          borderRadius: 4,
          background: rgba("#94a3b8", 0.2),
        }}
      >
        <div
          style={{
            width: `${prog * 100}%`,
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${ROSA}, ${VERM})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VideoInteracoes: React.FC = () => {
  const f = useCurrentFrame();
  let cor = VERM;
  INICIO.forEach((s, i) => {
    if (f >= s) cor = CAPS[i].cor;
  });
  if (f >= T.recap) cor = ROSA;
  if (f >= T.regra) cor = VERDE;
  if (f >= T.siga) cor = TEAL;
  let desde = T.recap;
  const tRecap = RECAP.map(([w]) => {
    const t = Ta(w, desde);
    desde = t;
    return t;
  });
  return (
    <AbsoluteFill>
      <Fundo cor={cor} pulsos={[...INICIO, T.recap, T.regra, T.final]} />
      <Abertura to={INICIO[0]} />
      {CAPS.map((_, i) => (
        <Capitulo key={i} i={i} />
      ))}

      {/* resumo */}
      <Cena from={T.recap} to={T.regra}>
        <div
          style={{
            position: "absolute",
            top: 130,
            width: W,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 72,
            color: C.ink,
          }}
        >
          recapitulando
        </div>
        {RECAP.map(([, txt, c], j) => {
          const k = it(f, tRecap[j] - 6, tRecap[j] + 8, 0, 1, OUT);
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                left: 330,
                top: 270 + j * 96,
                width: 1260,
                height: 78,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 30px",
                boxSizing: "border-box",
                borderRadius: 18,
                background: C.box,
                border: `2px solid ${rgba(c, 0.6)}`,
                opacity: k,
                transform: `translateX(${(1 - k) * 60}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 46,
                  color: c,
                  width: 40,
                }}
              >
                {j + 1}
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 36,
                  color: C.ink,
                }}
              >
                {txt}
              </span>
            </div>
          );
        })}
      </Cena>

      {/* regra de ouro */}
      <Cena from={T.regra} to={T.siga}>
        <div
          style={{
            position: "absolute",
            top: 180,
            width: W,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 80,
            color: bornColor(f, T.regra + 4, C.ink, VERDE),
          }}
        >
          a <span style={{ color: VERDE }}>regra de ouro</span> 🏆
        </div>
        {[
          ["conte", "🗣️ conte ao médico e ao farmacêutico", VERDE],
          ["receita", "💊 todos os remédios, até os sem receita", AZUL],
          ["vitaminas", "🍵 vitaminas e chás também", AMBAR],
          ["nunca", "🚫 nunca pare ou troque por conta própria", VERM],
        ].map(([w, txt, c], j) => {
          const t = Ta(w, T.regra);
          return (
            <Pilula
              key={j}
              x={960}
              y={400 + j * 130}
              txt={txt}
              cor={c}
              k={P(f, t - 6, t + 8)}
              size={44}
            />
          );
        })}
      </Cena>

      {/* me siga */}
      <Cena from={T.siga} to={T.final}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 300,
            transform: "translate(-50%,-50%)",
            fontFamily: EMOJI,
            fontSize: 150,
          }}
        >
          👩‍⚕️
        </div>
        <div
          style={{
            position: "absolute",
            left: 460,
            top: 420,
            width: 1000,
            height: 300,
            borderRadius: 30,
            background: C.box,
            border: `2px solid ${rgba(TEAL, 0.7)}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 96,
              color: bornColor(f, T.siga, C.ink, TEAL),
            }}
          >
            Me siga
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 40,
              color: C.ink,
            }}
          >
            para mais dicas de farmacologia e curiosidades sobre a área
          </span>
        </div>
      </Cena>

      {/* tela final */}
      <Cena from={T.final - 4} to={DURATION_INTERACOES + 20}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
            const at = T.final + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 330 + i * 130,
                  width: W,
                  textAlign: "center",
                  fontFamily: SERIF,
                  fontWeight: i === 1 ? 600 : 400,
                  fontSize: i === 1 ? 110 : 92,
                  color:
                    i === 1
                      ? bornColor(f, at, TEAL, "#f0fdfa", 20)
                      : bornColor(f, at, C.ink, TEAL),
                  opacity: k,
                  transform: `translateY(${(1 - k) * 40}px)`,
                }}
              >
                {l}
              </div>
            );
          },
        )}
      </Cena>

      <Hud />
      <Grao />
      <Audio src={staticFile("interacoes/narracao.wav")} />
      <Audio
        src={staticFile("interacoes/musica.wav")}
        loop
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_INTERACOES - 60, DURATION_INTERACOES))
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
