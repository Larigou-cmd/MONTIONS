import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, OUT, P, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Descongestionante nasal vicia?" — Modelo 1, série "Farmácia sem mitos", tudo desenhado em código (frasco genérico, sem marca).
// Roteiro e fontes: roteiros/descongestionante_nasal.md. Narração da Juliana; tempos em fala.json (scripts/transcrever.py).
const AZUL = "#60a5fa",
  VERM = "#ef4444",
  ROXO = "#a78bfa",
  AMBAR = "#fbbf24",
  VERDE = "#4ade80",
  CIANO = "#22d3ee";

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
  pinga: Tw("pinga"),
  vezes: Tw("vezes"),
  respira: Tw("respira"),
  age: Tw("esses") - 6,
  nafazolina: Tw("nafazolina"),
  oxi: Tw("oximetazolina"),
  apertam: Tw("apertam"),
  desincha: Tw("desincha"),
  desentope: Tw("desentope"),
  rebote: Tw("problema") - 10,
  todoDia: Tw("todo"),
  passa: Tw("passa"),
  abrem: Tw("abrem"),
  reboteW: Tw("rebote"),
  entope: Tw("entope"),
  pior: Tw("pior"),
  ciclo: Tw("aí") - 6,
  menos: Tw("menos"),
  cicloW: Tw("ciclo"),
  rinite: Tw("rinite"),
  vicio: Tw("vício") - 14,
  acostuma: Tw("acostuma"),
  bula: Tw("bula"),
  maximo: Tw("máximo"),
  criancas: Tw("atenção") - 8,
  menores: Tw("menores"),
  intox: Tw("intoxicação"),
  soro: Tw("soro") - 12,
  causa: Tw("causa", 2),
  procure: Tw("procure"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_NASAL = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.pinga, "pop", 0.18],
  [T.vezes, "pop", 0.18],
  [T.age, "whoosh", 0.25],
  [T.apertam, "pop", 0.22],
  [T.desentope, "plim", 0.22],
  [T.rebote, "whoosh", 0.25],
  [T.reboteW, "trava", 0.32],
  [T.ciclo, "whoosh", 0.25],
  [T.rinite, "trava", 0.28],
  [T.vicio, "whoosh", 0.25],
  [T.maximo, "bip", 0.22],
  [T.criancas, "whoosh", 0.25],
  [T.menores, "trava", 0.28],
  [T.soro, "whoosh", 0.25],
  [T.causa, "plim", 0.22],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// frasco de spray genérico, com gotas caindo
const Frasco: React.FC<{ f: number; x?: number; y?: number; s?: number; at?: number }> = ({ f, x = 540, y = 960, s = 1, at = 0 }) => {
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <Svg>
      <g transform={`translate(${x},${y}) scale(${s * k}) rotate(${Math.sin(f / 18) * 3})`}>
        <path d="M-26,-300 L26,-300 L36,-170 L-36,-170 Z" fill="#e2e8f0" />
        <rect x={-60} y={-180} width={120} height={50} rx={12} fill={AZUL} />
        <rect x={-110} y={-140} width={220} height={330} rx={50} fill="rgba(255,255,255,0.92)" />
        <rect x={-110} y={-40} width={220} height={120} fill={rgba(AZUL, 0.25)} />
        <text textAnchor="middle" y={30} fontFamily={SANS} fontWeight={900} fontSize={34} fill="#1e3a8a">
          spray nasal
        </text>
        {f >= T.pinga &&
          Array.from({ length: 4 }, (_, i) => {
            const t = (f - T.pinga + i * 9) % 36;
            return <text key={i} x={(i - 1.5) * 16} y={-310 - t * 6} fontFamily={EMOJI} fontSize={40} textAnchor="middle" opacity={1 - t / 36}>💧</text>;
          })}
      </g>
    </Svg>
  );
};

// contador de vezes por dia
const Vezes: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.pinga) return null;
  const n = Math.min(8, 1 + Math.floor((f - T.pinga) / 6));
  return (
    <div style={{ position: "absolute", top: 1330, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 80, color: C.ink }}>
      <span style={{ fontFamily: EMOJI }}>💧</span> × <span style={{ color: AZUL }}>{n}</span>
      <span style={{ fontSize: 44, fontWeight: 700, opacity: 0.8 }}> por dia</span>
    </div>
  );
};

// corte da passagem do nariz: mucosa de cima e de baixo com vasos; "inchaco" 0 = desinchado, 1 = normal, >1 = rebote
const Nariz: React.FC<{ f: number; inchaco: number }> = ({ f, inchaco }) => {
  const esp = 90 + 210 * inchaco; // espessura da mucosa
  const r = 14 + 22 * inchaco; // raio dos vasos
  const passagem = Math.max(0, 1 - inchaco * 0.75); // quanto ar passa
  return (
    <Svg>
      <rect x={80} y={620} width={920} height={esp} rx={40} fill={rgba("#f9a8d4", 0.35)} stroke="#f9a8d4" strokeWidth={4} />
      <rect x={80} y={1380 - esp} width={920} height={esp} rx={40} fill={rgba("#f9a8d4", 0.35)} stroke="#f9a8d4" strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <circle cx={170 + i * 150} cy={620 + esp / 2} r={r} fill={VERM} opacity={0.85} />
          <circle cx={170 + i * 150} cy={1380 - esp / 2} r={r} fill={VERM} opacity={0.85} />
        </g>
      ))}
      {/* ar passando */}
      {passagem > 0.15 &&
        Array.from({ length: 6 }, (_, i) => {
          const x = ((f * 9 + i * 170) % 1000) + 40;
          return (
            <text key={i} x={x} y={1000 + Math.sin(f / 8 + i) * 20} fontFamily={SANS} fontWeight={900} fontSize={70} fill={CIANO} opacity={passagem} textAnchor="middle">
              ›
            </text>
          );
        })}
      <text x={540} y={590} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill="#f9a8d4">mucosa do nariz</text>
    </Svg>
  );
};

// ciclo que gira cada vez mais rápido
const Ciclo: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.ciclo, T.ciclo + 14, 0, 1, SNAP);
  const t = f - T.ciclo;
  const ang = t * 0.6 + Math.max(0, t - 60) * t * 0.004; // acelera
  const etapas = ["💧 pinga", "😮‍💨 desentope", "⏳ passa", "😤 entope pior"];
  return (
    <div style={{ position: "absolute", left: 540, top: 960, width: 0, height: 0, transform: `scale(${k})` }}>
      <svg width={760} height={760} style={{ position: "absolute", left: -380, top: -380 }}>
        <circle cx={380} cy={380} r={300} fill="none" stroke={rgba(ROXO, 0.5)} strokeWidth={8} strokeDasharray="30 22" transform={`rotate(${ang} 380 380)`} />
      </svg>
      {etapas.map((e, i) => {
        const a = ((ang + i * 90 - 90) * Math.PI) / 180;
        return (
          <div key={i} style={{ position: "absolute", left: Math.cos(a) * 300, top: Math.sin(a) * 300, transform: "translate(-50%,-50%)", whiteSpace: "nowrap", padding: "14px 24px", borderRadius: 999, background: C.box, border: `2px solid ${rgba(ROXO, 0.7)}`, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.ink }}>
            {e}
          </div>
        );
      })}
    </div>
  );
};

export const VideoNasal: React.FC = () => {
  const f = useCurrentFrame();
  // inchaço da mucosa: normal → desincha (apertam→desincha) → rebote (passa→antes)
  const inchaco = 1 - 0.85 * it(f, T.apertam, T.desincha + 10, 0, 1, OUT) + 1.3 * it(f, T.passa, T.abrem + 30, 0, 1, OUT);
  const corFundo = f < T.rebote ? AZUL : f < T.ciclo ? VERM : f < T.vicio ? ROXO : f < T.criancas ? AZUL : f < T.soro ? AMBAR : VERDE;
  return (
    <AbsoluteFill>
      <Background color={corFundo} pulses={[T.desentope, T.reboteW, T.rinite, T.maximo, T.menores, T.causa, T.final]} />

      {/* 1. gancho */}
      <Part from={0} to={T.age}>
        <Title f={f} at={2} y={200} size={70} font={SANS} weight={900} from={AZUL}>
          DESCONGESTIONANTE
          <br />
          VICIA?
        </Title>
        <Frasco f={f} y={900} at={4} />
        <Vezes f={f} />
        <Pill x={540} y={1530} text="😮‍💨 sem ele, não respira?" color={AZUL} size={44} k={P(f, T.respira - 4, T.respira + 8)} />
      </Part>

      {/* 2. como age */}
      <Part from={T.age} to={T.rebote}>
        <Title f={f} at={T.age + 4} y={220} size={72} weight={600} from={AZUL}>
          ele <span style={{ color: AZUL }}>aperta os vasos</span> do nariz
        </Title>
        <Pill x={330} y={440} text="nafazolina" color={CIANO} size={40} k={P(f, T.nafazolina - 4, T.nafazolina + 8)} />
        <Pill x={750} y={440} text="oximetazolina" color={CIANO} size={40} k={P(f, T.oxi - 4, T.oxi + 8)} />
        <Nariz f={f} inchaco={inchaco} />
        <Pill x={540} y={1530} text="desincha e desentope em minutos ✅" color={VERDE} size={42} k={P(f, T.desentope - 4, T.desentope + 8)} />
      </Part>

      {/* 3. efeito rebote */}
      <Part from={T.rebote} to={T.ciclo}>
        <Title f={f} at={T.rebote + 4} y={220} size={72} weight={600} from={VERM}>
          o problema: usar <span style={{ color: VERM }}>todo dia</span>
        </Title>
        <Emoji f={f} at={T.passa - 6} x={540} y={450} size={110}>
          ⏳
        </Emoji>
        <Nariz f={f} inchaco={inchaco} />
        {f >= T.reboteW && (
          <div style={{ position: "absolute", left: 540, top: 1000, transform: `translate(-50%,-50%) rotate(-8deg) scale(${2.2 - 1.2 * it(f, T.reboteW, T.reboteW + 7, 0, 1, OUT)})`, opacity: it(f, T.reboteW, T.reboteW + 7, 0, 1, OUT), border: `8px solid ${VERM}`, borderRadius: 14, padding: "6px 34px", fontFamily: SANS, fontWeight: 900, fontSize: 96, letterSpacing: 6, color: VERM, background: rgba("#000000", 0.55) }}>
            REBOTE
          </div>
        )}
        <Pill x={540} y={1530} text="entope de novo, e pior 😤" color={VERM} size={44} k={P(f, T.entope - 4, T.entope + 8)} />
      </Part>

      {/* 4. o ciclo */}
      <Part from={T.ciclo} to={T.vicio}>
        <Title f={f} at={T.ciclo + 4} y={220} size={72} weight={600} from={ROXO}>
          vira um <span style={{ color: ROXO }}>ciclo</span>
        </Title>
        <Ciclo f={f} />
        <Card f={f} at={T.rinite - 6} x={140} y={1420} w={800} h={170} border={rgba(ROXO, 0.8)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 60, color: bornColor(f, T.rinite, C.ink, ROXO) }}>rinite medicamentosa</span>
        </Card>
      </Part>

      {/* 5. não é vício de droga; a bula */}
      <Part from={T.vicio} to={T.criancas}>
        <Title f={f} at={T.vicio + 4} y={220} size={72} weight={600} from={AZUL}>
          não é vício de droga
        </Title>
        <Card f={f} at={T.acostuma - 8} x={140} y={480} w={800} h={220} border={rgba(AZUL, 0.7)} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 100 }}>👃</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 56 }}>
            o nariz <span style={{ color: AZUL }}>se acostuma</span>
          </span>
        </Card>
        <Emoji f={f} at={T.bula - 6} x={540} y={930} size={170}>
          📄
        </Emoji>
        {f >= T.maximo - 4 && (
          <div style={{ position: "absolute", top: 1120, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, color: C.ink, transform: `scale(${it(f, T.maximo - 4, T.maximo + 8, 0.6, 1, SNAP)})` }}>
            <div style={{ fontSize: 48, opacity: 0.85 }}>no máximo</div>
            <div style={{ fontSize: 130, color: AMBAR, lineHeight: 1.05 }}>3 a 5 dias</div>
            <div style={{ fontSize: 48, opacity: 0.85 }}>seguidos</div>
          </div>
        )}
      </Part>

      {/* 6. crianças */}
      <Part from={T.criancas} to={T.soro}>
        <Title f={f} at={T.criancas + 4} y={220} size={72} weight={600} from={AMBAR}>
          atenção com as <span style={{ color: AMBAR }}>crianças</span>
        </Title>
        <Emoji f={f} at={T.criancas + 8} x={540} y={620} size={200}>
          👶
        </Emoji>
        <Card f={f} at={T.menores - 8} x={110} y={860} w={860} h={300} border={rgba(AMBAR, 0.8)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center", padding: "0 40px" }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44 }}>⚠️ nafazolina</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, color: AMBAR }}>não indicada para menores de 12 anos</span>
        </Card>
        <Pill x={540} y={1300} text="causa comum de intoxicação nos pequenos" color={VERM} size={40} k={P(f, T.intox - 6, T.intox + 6)} />
      </Part>

      {/* 7. o que fazer */}
      <Part from={T.soro} to={T.siga}>
        <Title f={f} at={T.soro + 4} y={220} size={72} weight={600} from={VERDE}>
          e o <span style={{ color: VERDE }}>soro fisiológico</span>?
        </Title>
        <Emoji f={f} at={T.soro + 8} x={540} y={600} size={180}>
          🧴
        </Emoji>
        <Pill x={540} y={830} text="✅ não causa rebote" color={VERDE} size={50} k={P(f, T.causa - 4, T.causa + 8)} />
        <Card f={f} at={T.procure - 8} x={110} y={1000} w={860} h={300} border={rgba(VERDE, 0.7)} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 110 }}>🩺</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, lineHeight: 1.2 }}>
            preso no ciclo? <span style={{ color: VERDE }}>procure um médico</span>
          </span>
        </Card>
      </Part>

      {/* 8. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card f={f} at={T.siga} x={110} y={760} w={860} h={300} border={rgba(AZUL, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "0 40px" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: bornColor(f, T.siga, C.ink, AZUL) }}>Me siga</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>para mais dicas de farmacologia e curiosidades sobre a área</span>
        </Card>
      </Part>

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_NASAL} inY={100} outDur={1}>
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
                color: i === 1 ? bornColor(f, at, AZUL, "#eff6ff", 20) : bornColor(f, at, C.ink, AZUL),
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
      <Audio src={staticFile("nasal/narracao.mp3")} />
      <Audio src={staticFile("nasal/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION_NASAL - 60, DURATION_NASAL))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

