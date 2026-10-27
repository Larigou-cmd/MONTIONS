import React from "react";
import { AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, OUT, P, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Por que o antialérgico dá sono?" — Modelo 1, série "Farmácia sem mitos", tudo desenhado em código (sem marcas).
// Roteiro e fontes: roteiros/antialergico_sono.md. Narração da Juliana; tempos em fala.json (scripts/transcrever.py).
const ROXO = "#a78bfa",
  AMBAR = "#fbbf24",
  AZUL = "#60a5fa",
  VERM = "#ef4444",
  VERDE = "#4ade80",
  ROSA = "#f472b6";

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
  sono: Tw("sono"),
  cerebro: Tw("cérebro"),
  histamina: Tw("histamina") - 16,
  coceira: Tw("coceira"),
  espirro: Tw("espirro"),
  nariz: Tw("nariz"),
  bloqueia: Tw("bloqueia"),
  h1: Tw("h1"),
  noCerebro: Tw("só") - 6,
  acordado: Tw("acordado"),
  primeira: Tw("antialérgicos") - 14,
  dexclor: Tw("dexclorfeniramina"),
  prometa: Tw("prometazina"),
  hidroxi: Tw("hidroxizina"),
  barreira: Tw("barreira"),
  sono2: Tw("sono", 2),
  segunda: Tw("já", 2) - 6,
  lora: Tw("loratadina"),
  deslora: Tw("desloratadina"),
  fexo: Tw("fexofenadina"),
  bomba: Tw("bomba"),
  nenhum: Tw("nenhum"),
  cetirizina: Tw("cetirizina"),
  atencao: Tw("atenção") - 6,
  dirija: Tw("dirija"),
  alcoolica: Tw("alcoólica"),
  curiosidade: Tw("curiosidade") - 6,
  enjoo: Tw("enjoo"),
  dimen: Tw("dimenidrinato"),
  primeira3: Tw("primeira", 2),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ANTIALERGICO = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.sono, "pop", 0.2],
  [T.histamina, "whoosh", 0.25],
  [T.espirro, "pop", 0.2],
  [T.bloqueia, "trava", 0.28],
  [T.noCerebro, "whoosh", 0.25],
  [T.acordado, "plim", 0.22],
  [T.primeira, "whoosh", 0.25],
  [T.barreira, "pop", 0.2],
  [T.sono2, "trava", 0.3],
  [T.segunda, "whoosh", 0.25],
  [T.bomba, "trava", 0.28],
  [T.nenhum, "plim", 0.22],
  [T.atencao, "whoosh", 0.25],
  [T.dirija, "trava", 0.28],
  [T.curiosidade, "whoosh", 0.25],
  [T.dimen, "pop", 0.2],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// "zZz" subindo
const Zzz: React.FC<{ f: number; x: number; y: number; at: number }> = ({ f, x, y, at }) => {
  if (f < at) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((f - at + i * 14) % 42) / 42;
        return (
          <div key={i} style={{ position: "absolute", left: x + t * 120 + i * 20, top: y - t * 260, fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 60 + i * 20, color: ROXO, opacity: Math.sin(Math.PI * t) }}>
            z
          </div>
        );
      })}
    </>
  );
};

// receptor H1 (fechadura) com a tampa do antialérgico
const Receptor: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.bloqueia - 10, T.bloqueia + 4, 0, 1, SNAP);
  const tampa = it(f, T.bloqueia, T.bloqueia + 12, 0, 1, OUT);
  return (
    <Svg>
      <g transform={`translate(540,1180) scale(${k})`}>
        <rect x={-260} y={40} width={520} height={60} rx={20} fill={rgba(ROSA, 0.3)} stroke={ROSA} strokeWidth={4} />
        <path d="M-90,40 L-90,-70 A90,90 0 0 1 90,-70 L90,40 Z" fill={rgba(ROSA, 0.25)} stroke={ROSA} strokeWidth={6} />
        <text y={-10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={ROSA}>H1</text>
        <g transform={`translate(0,${-260 + 230 * tampa})`} opacity={tampa}>
          <rect x={-110} y={-40} width={220} height={80} rx={40} fill={AZUL} />
          <text y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#0b1220">antialérgico</text>
        </g>
      </g>
    </Svg>
  );
};

// cérebro com interruptor acordado/sono
const Interruptor: React.FC<{ f: number; dorme: number }> = ({ f, dorme }) => (
  <div style={{ position: "absolute", left: 540, top: 1000, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ fontFamily: EMOJI, fontSize: 260, lineHeight: 1, filter: `brightness(${1 - 0.5 * dorme})` }}>🧠</div>
    <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 20, padding: "16px 34px", borderRadius: 999, background: C.box, border: `3px solid ${dorme > 0.5 ? ROXO : AMBAR}` }}>
      <span style={{ fontFamily: EMOJI, fontSize: 60 }}>{dorme > 0.5 ? "🌙" : "☀️"}</span>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: dorme > 0.5 ? ROXO : AMBAR }}>{dorme > 0.5 ? "sono" : "acordado"}</span>
    </div>
  </div>
);

// barreira do cérebro: moléculas do sangue (esquerda) tentam ir para o cérebro (direita)
const Barreira: React.FC<{ f: number; at: number; passa: boolean; bomba?: number }> = ({ f, at, passa, bomba = 0 }) => {
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <Svg>
      <g opacity={k}>
        <rect x={60} y={720} width={380} height={620} rx={30} fill={rgba(VERM, 0.12)} stroke={rgba(VERM, 0.4)} strokeWidth={3} />
        <text x={90} y={780} fontFamily={SANS} fontWeight={800} fontSize={34} fill={VERM}>sangue</text>
        <rect x={640} y={720} width={380} height={620} rx={30} fill={rgba(ROXO, 0.12)} stroke={rgba(ROXO, 0.4)} strokeWidth={3} />
        <text x={990} y={780} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={34} fill={ROXO}>cérebro</text>
        {/* o muro */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={i % 2 ? 470 : 480} y={720 + i * 78} width={130} height={70} rx={8} fill="#64748b" stroke="#94a3b8" strokeWidth={3} />
        ))}
        {/* bomba que devolve (glicoproteína-P) */}
        {bomba > 0 && (
          <g transform={`translate(540,1030) scale(${bomba})`}>
            <circle r={70} fill={VERDE} opacity={0.9} />
            <text y={16} textAnchor="middle" fontFamily={EMOJI} fontSize={60}>🔄</text>
          </g>
        )}
        {/* moléculas */}
        {Array.from({ length: 7 }, (_, i) => {
          const t = (((f - at) * 0.012 + random(`m${i}`)) % 1 + 1) % 1;
          const y = 830 + i * 72;
          let x: number;
          if (passa) x = 120 + t * 860;
          else x = t < 0.5 ? 120 + t * 2 * 330 : 450 - (t - 0.5) * 2 * 330;
          return <circle key={i} cx={x} cy={y} r={24} fill={AZUL} stroke="#fff" strokeWidth={3} />;
        })}
      </g>
    </Svg>
  );
};

const Chip: React.FC<{ x: number; y: number; at: number; txt: string; cor: string; f: number }> = ({ x, y, at, txt, cor, f }) => (
  <Pill x={x} y={y} text={txt} color={cor} size={38} k={P(f, at - 4, at + 8)} />
);

export const VideoAntialergico: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo = f < T.histamina ? ROXO : f < T.noCerebro ? ROSA : f < T.segunda ? ROXO : f < T.atencao ? VERDE : f < T.curiosidade ? VERM : AMBAR;
  return (
    <AbsoluteFill>
      <Background color={corFundo} pulses={[T.sono, T.bloqueia, T.acordado, T.sono2, T.bomba, T.dirija, T.final]} />

      {/* 1. gancho */}
      <Part from={0} to={T.histamina}>
        <Title f={f} at={2} y={220} size={70} font={SANS} weight={900} from={ROXO}>
          POR QUE O ANTIALÉRGICO
          <br />
          DÁ SONO?
        </Title>
        <Emoji f={f} at={4} x={430} y={900} size={200}>
          💊
        </Emoji>
        <Emoji f={f} at={T.sono - 4} x={680} y={900} size={220}>
          🥱
        </Emoji>
        <Zzz f={f} x={760} y={760} at={T.sono} />
        <Pill x={540} y={1250} text="🧠 a explicação está no cérebro" color={ROXO} size={44} k={P(f, T.cerebro - 4, T.cerebro + 8)} />
      </Part>

      {/* 2. a histamina e o H1 */}
      <Part from={T.histamina} to={T.noCerebro}>
        <Title f={f} at={T.histamina + 4} y={220} size={76} weight={600} from={ROSA}>
          a <span style={{ color: ROSA }}>histamina</span>
        </Title>
        <Emoji f={f} at={T.coceira - 4} x={260} y={580} size={130}>🫳</Emoji>
        <Emoji f={f} at={T.espirro - 4} x={540} y={580} size={130}>🤧</Emoji>
        <Emoji f={f} at={T.nariz - 4} x={820} y={580} size={130}>💧</Emoji>
        <Chip f={f} x={260} y={720} at={T.coceira} txt="coceira" cor={ROSA} />
        <Chip f={f} x={540} y={720} at={T.espirro} txt="espirro" cor={ROSA} />
        <Chip f={f} x={820} y={720} at={T.nariz} txt="coriza" cor={ROSA} />
        <Receptor f={f} />
        <Pill x={540} y={1450} text="o antialérgico bloqueia o receptor H1" color={AZUL} size={40} k={P(f, T.h1 - 4, T.h1 + 8)} />
      </Part>

      {/* 3. no cérebro, ela mantém acordado */}
      <Part from={T.noCerebro} to={T.primeira}>
        <Title f={f} at={T.noCerebro + 4} y={220} size={72} weight={600} from={AMBAR}>
          no cérebro, ela <span style={{ color: AMBAR }}>mantém você acordado</span>
        </Title>
        <Interruptor f={f} dorme={0} />
      </Part>

      {/* 4. primeira geração: atravessa */}
      <Part from={T.primeira} to={T.segunda}>
        <Title f={f} at={T.primeira + 4} y={200} size={70} weight={600} from={ROXO}>
          <span style={{ color: ROXO }}>1ª geração</span>: atravessa a barreira
        </Title>
        <Chip f={f} x={540} y={460} at={T.dexclor} txt="dexclorfeniramina" cor={ROXO} />
        <Chip f={f} x={330} y={570} at={T.prometa} txt="prometazina" cor={ROXO} />
        <Chip f={f} x={750} y={570} at={T.hidroxi} txt="hidroxizina" cor={ROXO} />
        {f < T.sono2 - 20 ? (
          <Barreira f={f} at={T.barreira - 30} passa />
        ) : (
          <>
            <Interruptor f={f} dorme={it(f, T.sono2 - 6, T.sono2 + 6, 0, 1, OUT)} />
            <Zzz f={f} x={700} y={850} at={T.sono2} />
          </>
        )}
      </Part>

      {/* 5. segunda geração: a bomba joga de volta */}
      <Part from={T.segunda} to={T.atencao}>
        <Title f={f} at={T.segunda + 4} y={200} size={70} weight={600} from={VERDE}>
          <span style={{ color: VERDE }}>2ª geração</span>: quase não passa
        </Title>
        <Chip f={f} x={540} y={460} at={T.lora} txt="loratadina" cor={VERDE} />
        <Chip f={f} x={330} y={570} at={T.deslora} txt="desloratadina" cor={VERDE} />
        <Chip f={f} x={750} y={570} at={T.fexo} txt="fexofenadina" cor={VERDE} />
        <Barreira f={f} at={T.segunda + 4} passa={false} bomba={it(f, T.bomba - 4, T.bomba + 10, 0, 1, SNAP)} />
        <Pill x={540} y={1460} text="pouco ou nenhum sono, na maioria 😊" color={VERDE} size={40} k={P(f, T.nenhum - 6, T.nenhum + 6)} />
        <Pill x={540} y={1580} text="cetirizina: pode dar um pouco, em parte das pessoas" color={AMBAR} size={32} k={P(f, T.cetirizina - 4, T.cetirizina + 8)} />
      </Part>

      {/* 6. atenção */}
      <Part from={T.atencao} to={T.curiosidade}>
        <Title f={f} at={T.atencao + 4} y={220} size={76} weight={600} from={VERM}>
          atenção ⚠️
        </Title>
        <Card f={f} at={T.dirija - 10} x={140} y={560} w={800} h={260} border={rgba(VERM, 0.7)} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 110 }}>🚗</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, lineHeight: 1.2 }}>
            deu sono? <span style={{ color: VERM }}>não dirija</span>
          </span>
        </Card>
        <Card f={f} at={T.alcoolica - 6} x={140} y={900} w={800} h={260} border={rgba(AMBAR, 0.7)} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 110 }}>🍺</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, lineHeight: 1.2 }}>
            o álcool <span style={{ color: AMBAR }}>aumenta</span> o efeito
          </span>
        </Card>
      </Part>

      {/* 7. curiosidade: remédio de enjoo */}
      <Part from={T.curiosidade} to={T.siga}>
        <Title f={f} at={T.curiosidade + 4} y={220} size={74} weight={600} from={AMBAR}>
          curiosidade 🤔
        </Title>
        <Emoji f={f} at={T.enjoo - 6} x={430} y={640} size={170}>🚌</Emoji>
        <Emoji f={f} at={T.enjoo} x={680} y={640} size={170}>🤢</Emoji>
        <Pill x={540} y={860} text="remédio para enjoo de viagem" color={AMBAR} size={42} k={P(f, T.enjoo, T.enjoo + 10)} />
        <Card f={f} at={T.dimen - 6} x={140} y={980} w={800} h={300} border={rgba(ROXO, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: bornColor(f, T.dimen, C.ink, ROXO) }}>dimenidrinato</span>
          <span style={{ fontWeight: 700, fontSize: 40, opacity: P(f, T.primeira3 - 6, T.primeira3 + 6) }}>= antialérgico de 1ª geração 😴</span>
        </Card>
      </Part>

      {/* 8. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card f={f} at={T.siga} x={110} y={760} w={860} h={300} border={rgba(ROXO, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "0 40px" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: bornColor(f, T.siga, C.ink, ROXO) }}>Me siga</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>para mais dicas de farmacologia e curiosidades sobre a área</span>
        </Card>
      </Part>

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_ANTIALERGICO} inY={100} outDur={1}>
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
                color: i === 1 ? bornColor(f, at, ROXO, "#f5f3ff", 20) : bornColor(f, at, C.ink, ROXO),
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
      <Audio src={staticFile("antialergico/narracao.mp3")} />
      <Audio src={staticFile("antialergico/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION_ANTIALERGICO - 60, DURATION_ANTIALERGICO))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
