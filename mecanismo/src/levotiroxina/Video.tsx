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
import { Intestino3D } from "./Intestino3D";
import falaJson from "./fala.json";

// "Começou a tomar levotiroxina?" — Modelo 1 com a paleta verde e intestino em 3D na explicação.
// Roteiro e fontes: roteiros/levotiroxina_comecou.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
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
  jejum: Tw("jejum"),
  suplemento: Tw("suplemento"),
  guarda: Tw("guarda"),
  bloco: Tw("levotiroxina", 2) - 10,
  hormonio: Tw("hormônio"),
  sensivel: Tw("sensível"),
  absorvida: Tw("absorvida"),
  intestino: Tw("intestino"),
  atrapalha: Tw("atrapalha", 2),
  cafe: Tw("café") - 10,
  cafe2: Tw("café", 2),
  comida: Tw("comida"),
  soja: Tw("soja"),
  fibra: Tw("fibra"),
  sangue: Tw("sangue"),
  agua: Tw("água"),
  trinta: Tw("trinta"),
  ponta2: Tw("detalhe") - 24,
  tome2: Tw("tome", 2) - 6,
  horario: Tw("horário"),
  exame: Tw("exame"),
  agora: Tw("agora") - 6,
  calcio: Tw("cálcio"),
  ferro: Tw("ferro"),
  ligam: Tw("ligam"),
  quatro: Tw("quatro"),
  antiacidos: Tw("antiácidos"),
  nao: Tw("não", 2) - 6,
  noite: Tw("noite"),
  orientacao: Tw("orientação"),
  nunca: Tw("nunca"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_LEVO = T.final + 90;
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
  [T.guarda, TRAVA, 0.3],
  [T.bloco, WHOOSH, 0.28],
  [T.sensivel, POP, 0.2],
  [T.absorvida - 20, WHOOSH, 0.28],
  [T.cafe, TRAVA, 0.3],
  [T.comida, POP, 0.2],
  [T.soja, POP, 0.2],
  [T.fibra, POP, 0.2],
  [T.agua, PLIM, 0.25],
  [T.ponta2, WHOOSH, 0.28],
  [T.horario, BIP, 0.25],
  [T.agora, WHOOSH, 0.28],
  [T.calcio, TRAVA, 0.32],
  [T.quatro, PLIM, 0.25],
  [T.nao, WHOOSH, 0.28],
  [T.orientacao, TRAVA, 0.3],
  [T.salva, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_LEVO + 1).fill(0);
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

export const VideoLevotiroxina: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background color={f < T.agora || f >= T.siga ? VERDE : f < T.nao ? AMBAR : VERM} pulses={[T.guarda, T.cafe, T.calcio, T.orientacao, T.final]} />

      {/* 1 e 2. gancho */}
      <Part from={0} to={T.guarda - 4}>
        <Title f={f} at={0} y={220} size={70} font={SANS} weight={900} from={VERDE}>
          COMEÇOU A TOMAR
          <br />
          <span style={{ color: VERDE }}>LEVOTIROXINA?</span>
        </Title>
        <Grande f={f} at={T.sabe - 4} y={430} cor={AMBAR} size={62}>
          SABE POR QUE É EM JEJUM?
        </Grande>
        <Emoji f={f} at={6} x={330} y={820} size={190}>
          💊
        </Emoji>
        <Emoji f={f} at={T.jejum - 10} x={540} y={820} size={190}>
          ⏰
        </Emoji>
        <Emoji f={f} at={T.jejum} x={750} y={820} size={190}>
          💧
        </Emoji>
      </Part>
      <Part from={T.guarda - 4} to={T.bloco}>
        <Carimbo f={f} at={T.guarda} y={340} cor={AMBAR} size={76}>
          GUARDA ISSO
        </Carimbo>
        <Grande f={f} at={T.guarda + 6} y={520} cor={C.ink} size={58}>
          tem um suplemento que atrapalha
        </Grande>
      </Part>

      {/* 3. o que ela faz */}
      <Part from={T.bloco} to={T.absorvida - 20}>
        <Emoji f={f} at={T.bloco + 6} x={540} y={600} size={220}>
          🦋
        </Emoji>
        <Linha f={f} at={T.hormonio - 14} y={790} cor={VERDE} emoji="💊" h={190}>
          repõe o hormônio que a tireoide não está produzindo direito
        </Linha>
        <Grande f={f} at={T.sensivel - 8} y={1060} cor={AMBAR} size={86}>
          ELA É SENSÍVEL
        </Grande>
      </Part>

      {/* 4. intestino em 3D: café e comida atrapalham */}
      <Sequence from={T.absorvida - 20} durationInFrames={T.ponta2 - T.absorvida + 28} layout="none">
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 900px 900px at 50% 52%, rgba(46,160,110,.42), rgba(46,160,110,0) 75%), linear-gradient(180deg, rgba(8,48,36,.55) 0%, rgba(8,48,36,0) 30%)",
            }}
          />
          <Intestino3D f={f} ini={T.absorvida - 20} bloqueia={T.cafe2} tipo="cafe" />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.absorvida - 20} to={T.ponta2}>
        {f < T.cafe2 - 4 && (
          <Grande f={f} at={T.absorvida - 8} y={230} cor={C.ink} size={58}>
            absorvida no intestino
          </Grande>
        )}
        {f >= T.cafe - 6 && f < T.agua - 10 && (
          <Grande f={f} at={T.cafe - 6} y={230} cor={AMBAR} size={58}>
            ☕ e o café atrapalha
          </Grande>
        )}
        <Pill x={190} y={400} text="☕ café" color={AMBAR} size={36} k={f < T.agua - 10 ? P(f, T.cafe2 - 6, T.cafe2 + 4) : 0} />
        <Pill x={420} y={400} text="🍞 comida" color={AMBAR} size={36} k={f < T.agua - 10 ? P(f, T.comida - 6, T.comida + 4) : 0} />
        <Pill x={640} y={400} text="🫘 soja" color={AMBAR} size={36} k={f < T.agua - 10 ? P(f, T.soja - 6, T.soja + 4) : 0} />
        <Pill x={860} y={400} text="🌾 fibra" color={AMBAR} size={36} k={f < T.agua - 10 ? P(f, T.fibra - 6, T.fibra + 4) : 0} />
        {f >= T.agua - 10 && (
          <Grande f={f} at={T.agua - 10} y={230} cor={VERDE} size={60}>
            só com água, em jejum
          </Grande>
        )}
        <Pill x={540} y={400} text="⏰ 30 a 60 min antes do café da manhã" color={VERDE} size={40} k={P(f, T.trinta - 8, T.trinta + 4)} />
        <Pill x={540} y={1440} text="🟢 remédio passando do intestino para o sangue" color={VERDE} size={32} k={P(f, T.absorvida, T.absorvida + 12)} />
      </Part>

      {/* 5. mesmo horário */}
      <Part from={T.ponta2} to={T.agora}>
        <Title f={f} at={T.ponta2 + 4} y={250} size={70} weight={600} from={VERDE}>
          tome todo dia <span style={{ color: VERDE }}>no mesmo horário</span>
        </Title>
        <Emoji f={f} at={T.horario - 10} x={540} y={680} size={220}>
          ⏰
        </Emoji>
        <Linha f={f} at={T.exame - 10} y={880} cor={AMBAR} emoji="🩸" h={190}>
          assim o exame mostra se a dose está certa
        </Linha>
      </Part>

      {/* 6. cálcio e ferro, em 3D */}
      <Sequence from={T.agora} durationInFrames={T.nao - T.agora + 8} layout="none">
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 900px 900px at 50% 52%, rgba(46,160,110,.42), rgba(46,160,110,0) 75%), linear-gradient(180deg, rgba(8,48,36,.55) 0%, rgba(8,48,36,0) 30%)",
            }}
          />
          <Intestino3D f={f} ini={T.agora} bloqueia={T.ligam} tipo="calcio" />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.agora} to={T.nao}>
        {f < T.quatro - 12 && (
          <Grande f={f} at={T.calcio - 8} y={220} cor={AMBAR} size={92}>
            CÁLCIO E FERRO
          </Grande>
        )}
        <Pill x={540} y={400} text="🔗 se ligam ao remédio e prendem" color={VERM} size={40} k={f < T.quatro - 12 ? P(f, T.ligam - 8, T.ligam + 4) : 0} />
        {f >= T.quatro - 12 && (
          <Carimbo f={f} at={T.quatro - 10} y={290} cor={VERDE} size={66}>
            4 HORAS DE DISTÂNCIA
          </Carimbo>
        )}
        <Pill x={540} y={440} text="vale para alguns antiácidos também" color={AMBAR} size={40} k={P(f, T.antiacidos - 8, T.antiacidos + 4)} />
      </Part>

      {/* 7. à noite e a dose */}
      <Part from={T.nao} to={T.siga}>
        <Title f={f} at={T.nao + 4} y={240} size={70} weight={600} from={AMBAR}>
          não consegue de manhã?
        </Title>
        <Linha f={f} at={T.noite - 12} y={430} cor={AMBAR} emoji="🌙" h={170}>
          tem quem tome à noite, horas depois do jantar
        </Linha>
        <Carimbo f={f} at={T.orientacao - 4} y={720} cor={VERM} size={44}>
          SÓ COM ORIENTAÇÃO DO MÉDICO
        </Carimbo>
        <Pill x={540} y={870} text="nunca mude a dose por conta própria" color={VERM} size={42} k={P(f, T.nunca - 8, T.nunca + 4)} />
        <Pill x={540} y={1000} text="📌 salva e manda para quem toma" color={VERDE} size={44} k={P(f, T.salva - 4, T.salva + 8)} />
      </Part>

      {/* 10. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("levotiroxina/logo.jpg")}
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
      <Part from={T.final - 4} to={DURATION_LEVO} inY={100} outDur={1}>
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
      <Audio src={staticFile("levotiroxina/narracao.mp3")} />
      <Audio
        src={staticFile("levotiroxina/musica.wav")}
        volume={(fr) => musica(fr) * (1 - P(fr, DURATION_LEVO - 60, DURATION_LEVO))}
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
export const CapaLevotiroxina: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div style={{ position: "absolute", top: 340, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: C.ink }}>
      COMEÇOU A TOMAR
      <br />
      <span style={{ color: VERDE, textShadow: `0 0 30px ${rgba(VERDE, 0.5)}` }}>LEVOTIROXINA?</span>
    </div>
    <div style={{ position: "absolute", top: 620, width: W, textAlign: "center", fontFamily: EMOJI, fontSize: 230, lineHeight: 1 }}>
      ☕💊
    </div>
    <div style={{ position: "absolute", left: 540, top: 1040, transform: "translate(-50%,-50%) rotate(-5deg)", border: `9px solid ${AMBAR}`, borderRadius: 16, padding: "8px 28px", fontFamily: SANS, fontWeight: 900, fontSize: 60, letterSpacing: 2, color: AMBAR, background: rgba(AMBAR, 0.08), whiteSpace: "nowrap" }}>
      O CAFÉ ATRAPALHA?
    </div>
    <div style={{ position: "absolute", top: 1200, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 58, lineHeight: 1.2, color: C.ink }}>
      e o suplemento que
      <br />
      você toma junto
    </div>
    <Grain />
  </AbsoluteFill>
);
