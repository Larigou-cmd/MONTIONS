import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { Articulacao2D } from "./Articulacao2D";
import { Articulacao3D } from "./Articulacao3D";
import falaJson from "./fala.json";

// "Começou a tomar alopurinol?" — Modelo 1 verde; articulação em 3D (mapa de calor e cristais) só na explicação.
// Roteiro e fontes: roteiros/alopurinol_comecou.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
const AZUL = "#3dff8f",
  VERM = "#ff4d4d",
  AMBAR = "#f2e52e",
  VERDE = "#3dff8f";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  sabe: Tw("sabe"),
  piorar: Tw("piorar"),
  guarda: Tw("guarda"),
  sinal: Tw("sinal"),
  bloco: Tw("seu", 2) - 8,
  acido: Tw("ácido"),
  cristais: Tw("cristais"),
  agulhas: Tw("agulhas"),
  dor: Tw("dor"),
  alop: Tw("alopurinol", 2) - 6,
  trava: Tw("trava"),
  enzima: Tw("enzima"),
  menos: Tw("menos"),
  dissolvendo: Tw("dissolvendo"),
  ponta: Tw("só") - 6,
  crise: Tw("crise"),
  inicio: Tw("início"),
  provocar: Tw("provocar"),
  outro: Tw("outro"),
  meses: Tw("meses"),
  deu: Tw("deu") - 6,
  pare: Tw("pare"),
  fale: Tw("fale"),
  agora: Tw("agora") - 6,
  manchas: Tw("manchas"),
  bolhas: Tw("bolhas"),
  feridas: Tw("feridas"),
  febre: Tw("febre"),
  pare2: Tw("pare", 2),
  grave: Tw("grave"),
  semanas: Tw("semanas"),
  dia: Tw("dia") - 10,
  comer: Tw("comer"),
  agua: Tw("água"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ALOP = T.final + 90;
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.sabe, POP, 0.2],
  [T.piorar, TRAVA, 0.3],
  [T.guarda, POP, 0.22],
  [T.bloco, WHOOSH, 0.28],
  [T.cristais, POP, 0.2],
  [T.dor, TRAVA, 0.3],
  [T.trava, BIP, 0.25],
  [T.dissolvendo, PLIM, 0.25],
  [T.ponta, WHOOSH, 0.28],
  [T.provocar, TRAVA, 0.3],
  [T.deu, WHOOSH, 0.28],
  [T.pare, TRAVA, 0.32],
  [T.agora, WHOOSH, 0.28],
  [T.manchas, POP, 0.2],
  [T.bolhas, POP, 0.2],
  [T.feridas, POP, 0.2],
  [T.febre, POP, 0.2],
  [T.pare2, TRAVA, 0.34],
  [T.dia, WHOOSH, 0.28],
  [T.salva, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_ALOP + 1).fill(0);
  FALA.forEach((p, i) => {
    const fim = Math.min(FALA[i + 1]?.f ?? p.f + 24, p.f + 24);
    for (let fr = p.f; fr < fim; fr++) a[fr] = 1;
  });
  return a.map((_, i) => {
    let s = 0,
      n = 0;
    for (let j = i - 8; j <= i + 8; j++)
      if (a[j] !== undefined) {
        s += a[j];
        n++;
      }
    return s / n;
  });
})();
const musica = (fr: number) =>
  0.22 -
  0.13 *
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0);

const Carimbo: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 72, children }) =>
  f >= at ? (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%,-50%) rotate(-5deg) scale(${2.2 - 1.2 * it(f, at, at + 7, 0, 1, OUT)})`,
        opacity: it(f, at, at + 7, 0, 1, OUT),
        border: `8px solid ${cor}`,
        borderRadius: 14,
        padding: "6px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        color: cor,
        background: rgba("#000000", 0.55),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  ) : null;

const Linha: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  emoji: string;
  children: React.ReactNode;
  h?: number;
}> = ({ f, at, y, cor, emoji, children, h = 170 }) => (
  <Card
    f={f}
    at={at}
    x={110}
    y={y}
    w={860}
    h={h}
    border={rgba(cor, 0.75)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 34,
      padding: "0 46px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 84 }}>{emoji}</span>
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

// frase grande no centro
const Grande: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 96, children }) => {
  const k = it(f, at - 6, at + 6, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.1,
        color: cor,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const VideoAlopurinol: React.FC<{ sem3D?: boolean }> = ({ sem3D = false }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background color={f < T.agora || f >= T.siga ? VERDE : f < T.dia ? VERM : AMBAR} pulses={[T.guarda, T.dor, T.pare, T.pare2, T.final]} />

      {/* 1 e 2. gancho */}
      <Part from={0} to={T.guarda - 4}>
        <Title f={f} at={0} y={220} size={76} font={SANS} weight={900} from={VERDE}>
          COMEÇOU A TOMAR
          <br />
          <span style={{ color: VERDE }}>ALOPURINOL?</span>
        </Title>
        <Grande f={f} at={T.sabe - 4} y={430} cor={AMBAR} size={64}>
          SABE O QUE ELE FAZ?
        </Grande>
        <Emoji f={f} at={6} x={380} y={820} size={200}>
          💊
        </Emoji>
        <Emoji f={f} at={T.piorar - 8} x={700} y={820} size={200}>
          🦶
        </Emoji>
        <Pill x={540} y={1060} text="e por que a gota pode piorar no começo?" color={VERM} size={40} k={P(f, T.piorar - 8, T.piorar + 4)} />
      </Part>
      <Part from={T.guarda - 4} to={T.bloco}>
        <Carimbo f={f} at={T.guarda} y={340} cor={AMBAR} size={76}>
          GUARDA ISSO
        </Carimbo>
        <Grande f={f} at={T.sinal - 6} y={520} cor={C.ink} size={56}>
          no final: o sinal para parar e procurar atendimento
        </Grande>
      </Part>

      {/* 3 a 5. articulação em 3D */}
      <Sequence from={T.bloco} durationInFrames={T.deu - T.bloco + 8} layout="none">
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 900px 900px at 50% 52%, rgba(46,160,110,.42), rgba(46,160,110,0) 75%), linear-gradient(180deg, rgba(8,48,36,.55) 0%, rgba(8,48,36,0) 30%)",
            }}
          />
          {sem3D ? (
            <Articulacao2D f={f} t={{ ini: T.bloco, cristais: T.cristais, trava: T.trava, dissolve: T.dissolvendo }} />
          ) : (
            <Articulacao3D f={f} t={{ ini: T.bloco, cristais: T.cristais, trava: T.trava, dissolve: T.dissolvendo }} />
          )}
        </AbsoluteFill>
      </Sequence>
      <Part from={T.bloco} to={T.ponta}>
        {f < T.alop && (
          <Grande f={f} at={T.acido - 6} y={230} cor={AMBAR} size={60}>
            ácido úrico em excesso
          </Grande>
        )}
        {f < T.alop && (
          <Pill x={540} y={360} text="✨ forma cristais em agulha na articulação" color={AMBAR} size={38} k={P(f, T.agulhas - 10, T.agulhas + 2)} />
        )}
        {f >= T.dor - 6 && f < T.alop && (
          <Carimbo f={f} at={T.dor - 4} y={1440} cor={VERM} size={58}>
            A DOR DA GOTA
          </Carimbo>
        )}
        {f >= T.alop && (
          <Grande f={f} at={T.alop} y={230} cor={VERDE} size={56}>
            o alopurinol trava a enzima
          </Grande>
        )}
        <Pill x={540} y={360} text="que fabrica o ácido úrico" color={VERDE} size={38} k={f >= T.alop ? P(f, T.enzima - 4, T.enzima + 8) : 0} />
        <Pill x={540} y={1440} text="🧊 os cristais vão se dissolvendo com o tempo" color={VERDE} size={38} k={P(f, T.dissolvendo - 8, T.dissolvendo + 4)} />
      </Part>
      <Part from={T.ponta} to={T.deu}>
        <Carimbo f={f} at={T.ponta + 4} y={300} cor={VERM} size={58}>
          NÃO É REMÉDIO PARA DOR
        </Carimbo>
        <Pill x={540} y={1350} text="não trata a crise que já começou" color={AMBAR} size={38} k={P(f, T.crise - 8, T.crise + 4)} />
        <Pill x={540} y={1450} text="⚠️ no início, pode provocar uma crise" color={VERM} size={38} k={P(f, T.provocar - 10, T.provocar + 2)} />
        <Pill x={540} y={1550} text="💊 o médico pode receitar outro remédio junto" color={VERDE} size={38} k={P(f, T.outro - 10, T.outro + 2)} />
      </Part>

      {/* 6. crise com tratamento */}
      <Part from={T.deu} to={T.agora}>
        <Title f={f} at={T.deu + 4} y={260} size={66} weight={600} from={AMBAR}>
          deu crise com o tratamento em andamento?
        </Title>
        <Carimbo f={f} at={T.pare} y={600} cor={VERM} size={48}>
          NÃO PARE POR CONTA PRÓPRIA
        </Carimbo>
        <Linha f={f} at={T.fale - 8} y={740} cor={VERDE} emoji="🩺" h={170}>
          fale com seu médico
        </Linha>
      </Part>

      {/* 7. sinal de reação grave */}
      <Part from={T.agora} to={T.dia}>
        <Title f={f} at={T.agora + 4} y={220} size={62} weight={600} from={VERM}>
          o sinal que eu pedi para guardar
        </Title>
        <Pill x={300} y={460} text="manchas na pele" color={VERM} size={42} k={P(f, T.manchas - 6, T.manchas + 4)} />
        <Pill x={760} y={460} text="bolhas" color={VERM} size={42} k={P(f, T.bolhas - 6, T.bolhas + 4)} />
        <Pill x={330} y={580} text="feridas na boca" color={VERM} size={42} k={P(f, T.feridas - 6, T.feridas + 4)} />
        <Pill x={760} y={580} text="febre" color={VERM} size={42} k={P(f, T.febre - 6, T.febre + 4)} />
        <Carimbo f={f} at={T.pare2} y={820} cor={VERM} size={46}>
          PARE E PROCURE ATENDIMENTO
        </Carimbo>
        <Linha f={f} at={T.grave - 10} y={960} cor={AMBAR} emoji="⚠️" h={190}>
          pode ser reação grave, mais provável nas primeiras semanas
        </Linha>
      </Part>

      {/* 8. dia a dia */}
      <Part from={T.dia} to={T.siga}>
        <Title f={f} at={T.dia + 4} y={260} size={72} weight={600} from={VERDE}>
          no dia a dia
        </Title>
        <Linha f={f} at={T.comer - 10} y={460} cor={VERDE} emoji="🍽️" h={160}>
          tome depois de comer
        </Linha>
        <Linha f={f} at={T.agua - 12} y={640} cor={VERDE} emoji="💧" h={160}>
          beba bastante água
        </Linha>
        <Pill x={540} y={900} text="📌 salva e manda para quem tem gota" color={AMBAR} size={44} k={P(f, T.salva - 4, T.salva + 8)} />
      </Part>

      {/* 10. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("alopurinol/logo.jpg")}
          style={{
            position: "absolute",
            left: 350,
            top: 380,
            width: 380,
            height: 380,
            borderRadius: "50%",
          }}
        />
        <Grande f={f} at={T.siga + 4} y={800} cor={C.ink} size={120}>
          ME SIGA
        </Grande>
        <div
          style={{
            position: "absolute",
            top: 950,
            left: 110,
            width: 860,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1.3,
            color: C.ink,
          }}
        >
          para mais dicas de farmacologia e curiosidades sobre a área
        </div>
      </Part>

      {/* 11. tela final */}
      <Part from={T.final - 4} to={DURATION_ALOP} inY={100} outDur={1}>
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
                      ? bornColor(f, at, AZUL, "#eff6ff", 20)
                      : bornColor(f, at, C.ink, AZUL),
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
      <Audio src={staticFile("alopurinol/narracao.mp3")} />
      <Audio
        src={staticFile("alopurinol/musica.wav")}
        volume={(fr) => musica(fr) * (1 - P(fr, DURATION_ALOP - 60, DURATION_ALOP))}
      />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e y≈1620, o recorte 3:4 do TikTok e do Instagram.
export const CapaAlopurinol: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div style={{ position: "absolute", top: 340, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 88, lineHeight: 1.05, color: C.ink }}>
      COMEÇOU A TOMAR
      <br />
      <span style={{ color: VERDE, textShadow: `0 0 30px ${rgba(VERDE, 0.5)}` }}>ALOPURINOL?</span>
    </div>
    <div style={{ position: "absolute", top: 620, width: W, textAlign: "center", fontFamily: EMOJI, fontSize: 230, lineHeight: 1 }}>
      💊🦶
    </div>
    <div style={{ position: "absolute", left: 540, top: 1040, transform: "translate(-50%,-50%) rotate(-5deg)", border: `9px solid ${VERM}`, borderRadius: 16, padding: "8px 28px", fontFamily: SANS, fontWeight: 900, fontSize: 60, letterSpacing: 2, color: VERM, background: rgba(VERM, 0.08), whiteSpace: "nowrap" }}>
      A GOTA PIOROU?
    </div>
    <div style={{ position: "absolute", top: 1200, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 58, lineHeight: 1.2, color: C.ink }}>
      e o sinal para parar
      <br />
      e procurar atendimento
    </div>
    <Grain />
  </AbsoluteFill>
);
