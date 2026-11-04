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
import { EMOJI, Emoji, Title } from "../aas/ui";
import { Receptor3D } from "./Receptor3D";
import falaJson from "./fala.json";

// "O café não te dá energia: ele esconde o cansaço" — Modelo 1, paleta verde, receptor em 3D só no mecanismo.
// Roteiro e fontes: roteiros/cafeina_sono.md. Narração no OpenArt (Eleven v4, voz Matilda); tempos em fala.json.
const VERDE = "#3dff8f",
  AMBAR = "#f2e52e",
  VERM = "#ff4d4d",
  FUNDO3D = "rgba(22,92,66,.96)";

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
  esconde: Tw("esconde"),
  enquanto: Tw("enquanto") - 6,
  acumulando: Tw("acumulando"),
  adenosina: Tw("adenosina"),
  sinal: Tw("ela") - 8,
  quanto: Tw("quanto"),
  sono: Tw("sono"),
  soQue: Tw("só", 2) - 4,
  formato: Tw("formato"),
  fechadura: Tw("fechadura"),
  naoGira: Tw("gira") - 6,
  aviso: Tw("aviso"),
  mas: Tw("mas") - 4,
  problema: Tw("problema"),
  meia: Tw("leva") - 14,
  cinco: Tw("cinco"),
  metade: Tw("metade"),
  estudo: Tw("estudo") - 6,
  seis: Tw("seis"),
  tirou: Tw("tirou"),
  perceberam: Tw("perceberam"),
  quando: Tw("quando") - 6,
  sai: Tw("sai"),
  vez: Tw("vez"),
  apagao: Tw("apagão"),
  entao: Tw("então") - 4,
  horario: Tw("horário"),
  manda: Tw("manda"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_CAFEINA = T.final + 90;
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.esconde, POP, 0.22],
  [T.enquanto, WHOOSH, 0.28],
  [T.adenosina, PLIM, 0.22],
  [T.sinal, WHOOSH, 0.28],
  [T.fechadura + 10, BIP, 0.25],
  [T.naoGira + 6, TRAVA, 0.32],
  [T.problema, POP, 0.22],
  [T.meia, WHOOSH, 0.28],
  [T.metade, POP, 0.22],
  [T.tirou, TRAVA, 0.3],
  [T.perceberam, POP, 0.22],
  [T.quando, WHOOSH, 0.28],
  [T.vez, TRAVA, 0.36],
  [T.entao, WHOOSH, 0.28],
  [T.manda, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_CAFEINA + 1).fill(0);
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
        background: FUNDO3D,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  ) : null;

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

// barra horizontal que enche (medidor de cansaço, xícara, noite de sono)
const Barra: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  cor: string;
  k: number;
  opacity?: number;
}> = ({ x, y, w, h, cor, k, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: h / 2,
      border: `3px solid ${rgba(cor, 0.8)}`,
      background: rgba("#000000", 0.25),
      overflow: "hidden",
      opacity,
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, k)) * 100}%`,
        height: "100%",
        background: `linear-gradient(90deg, ${rgba(cor, 0.55)}, ${cor})`,
        boxShadow: `0 0 24px ${rgba(cor, 0.6)}`,
      }}
    />
  </div>
);

// legenda com fundo verde sólido, para ficar legível perto do 3D
const Leg: React.FC<{
  y: number;
  text: string;
  color: string;
  size?: number;
  k: number;
}> = ({ y, text, color, size = 40, k }) => (
  <Pill
    x={540}
    y={y}
    text={text}
    color={color}
    size={size}
    k={k}
    style={{ background: FUNDO3D }}
  />
);

const Brilho3D: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse 900px 800px at 50% 55%, rgba(46,160,110,.42), rgba(46,160,110,0) 75%)",
    }}
  />
);

export const VideoCafeina: React.FC = () => {
  const f = useCurrentFrame();
  // xícara: cai pela metade a cada "5 h" do relógio da cena
  const horas = it(f, T.meia + 10, T.estudo - 10, 0, 10, OUT);
  const xicara = Math.pow(0.5, horas / 5);
  const relogio = [
    "16h",
    "17h",
    "18h",
    "19h",
    "20h",
    "21h",
    "22h",
    "23h",
    "0h",
    "1h",
    "2h",
  ][Math.round(horas)];
  // apagão: a tela escurece rapidinho
  const apagao =
    it(f, T.apagao - 4, T.apagao + 6, 0, 1, OUT) *
    (1 - it(f, T.apagao + 22, T.entao, 0, 1, OUT));
  return (
    <AbsoluteFill>
      <Background
        color={
          f >= T.quando && f < T.entao
            ? VERM
            : f >= T.soQue && f < T.meia
              ? AMBAR
              : VERDE
        }
        pulses={[T.esconde, T.naoGira, T.tirou, T.vez, T.final]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.enquanto}>
        <Title
          f={f}
          at={0}
          y={230}
          size={74}
          font={SANS}
          weight={900}
          from={VERDE}
        >
          O CAFÉ NÃO TE
          <br />
          <span style={{ color: VERDE }}>DÁ ENERGIA</span>
        </Title>
        <Emoji f={f} at={4} x={400} y={760} size={240}>
          ☕
        </Emoji>
        <Emoji f={f} at={10} x={720} y={760} size={170}>
          🔋
        </Emoji>
        {f >= T.esconde - 10 && (
          <div
            style={{
              position: "absolute",
              left: 720,
              top: 760,
              transform: `translate(-50%,-50%) scale(${it(f, T.esconde - 10, T.esconde, 2, 1, OUT)})`,
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 220,
              color: AMBAR,
              opacity: it(f, T.esconde - 10, T.esconde, 0, 1, OUT),
            }}
          >
            ✕
          </div>
        )}
        <Carimbo f={f} at={T.esconde} y={1080} cor={AMBAR} size={70}>
          ESCONDE O CANSAÇO
        </Carimbo>
      </Part>

      {/* 2. adenosina acumulando ao longo do dia */}
      <Part from={T.enquanto} to={T.sinal}>
        <Title
          f={f}
          at={T.enquanto + 4}
          y={230}
          size={64}
          weight={600}
          from={VERDE}
        >
          enquanto você está acordado...
        </Title>
        <Emoji f={f} at={T.enquanto + 8} x={540} y={640} size={230}>
          🧠
        </Emoji>
        <div
          style={{
            position: "absolute",
            top: 860,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 4,
            color: C.ink,
            opacity: P(f, T.enquanto + 10, T.enquanto + 20),
          }}
        >
          CANSAÇO
        </div>
        <Barra
          x={140}
          y={920}
          w={800}
          h={64}
          cor={VERDE}
          k={it(f, T.enquanto + 10, T.sinal - 4, 0.05, 0.85)}
          opacity={P(f, T.enquanto + 10, T.enquanto + 20)}
        />
        <Pill
          x={540}
          y={1060}
          text={`⏰ ${["7h", "9h", "11h", "13h", "15h", "17h", "18h"][Math.round(it(f, T.enquanto + 10, T.sinal - 4, 0, 6))]}`}
          color={C.ink}
          size={40}
          k={P(f, T.enquanto + 14, T.enquanto + 24)}
        />
        <Grande f={f} at={T.adenosina - 4} y={1200} cor={VERDE} size={104}>
          ADENOSINA
        </Grande>
        <Pill
          x={540}
          y={1400}
          text="a molécula do cansaço"
          color={VERDE}
          size={42}
          k={P(f, T.adenosina + 4, T.adenosina + 14)}
        />
      </Part>

      {/* 3 e 4. receptor em 3D: adenosina encaixa, cafeína trava, adenosina se acumula */}
      <Sequence
        from={T.sinal}
        durationInFrames={T.meia - T.sinal + 8}
        layout="none"
      >
        <AbsoluteFill>
          <Brilho3D />
          <Receptor3D
            f={f}
            ini={T.sinal}
            aden={T.sinal + 20}
            caf={T.fechadura}
            acum={T.mas}
            sai={99999}
          />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.sinal} to={T.meia}>
        {f < T.soQue && (
          <Grande f={f} at={T.sinal + 4} y={230} cor={VERDE} size={66}>
            🟢 encaixou = SONO
          </Grande>
        )}
        <Leg
          y={1450}
          text="🧠 receptores do neurônio"
          color={C.ink}
          size={36}
          k={f < T.soQue ? P(f, T.sinal + 14, T.sinal + 24) : 0}
        />
        <Leg
          y={1560}
          text="quanto mais encaixa, mais sono"
          color={VERDE}
          size={40}
          k={f < T.soQue ? P(f, T.quanto - 6, T.quanto + 6) : 0}
        />
        {f >= T.soQue && f < T.mas && (
          <Grande f={f} at={T.soQue} y={230} cor={AMBAR} size={66}>
            🟡 CAFEÍNA ≈ 🟢 ADENOSINA
          </Grande>
        )}
        <Leg
          y={380}
          text="quase o mesmo formato"
          color={AMBAR}
          size={40}
          k={f >= T.soQue && f < T.mas ? P(f, T.formato - 6, T.formato + 6) : 0}
        />
        <Leg
          y={1450}
          text="🔒 entra na fechadura..."
          color={AMBAR}
          size={42}
          k={
            f >= T.soQue && f < T.mas
              ? P(f, T.fechadura - 4, T.fechadura + 8)
              : 0
          }
        />
        {f < T.mas && (
          <Carimbo f={f} at={T.naoGira} y={1580} cor={AMBAR} size={56}>
            ...E NÃO GIRA A CHAVE
          </Carimbo>
        )}
        <Leg
          y={380}
          text="🔕 o aviso de cansaço não chega"
          color={C.ink}
          size={40}
          k={f >= T.aviso - 4 && f < T.mas ? P(f, T.aviso - 4, T.aviso + 8) : 0}
        />
        {f >= T.mas && (
          <Grande f={f} at={T.mas} y={220} cor={VERDE} size={60}>
            mas a adenosina
            <br />
            continua se acumulando
          </Grande>
        )}
        <Leg
          y={1500}
          text="⚠️ e é aí que vem o problema"
          color={AMBAR}
          size={44}
          k={P(f, T.problema - 6, T.problema + 6)}
        />
      </Part>

      {/* 5. meia-vida e o estudo do sono */}
      <Part from={T.meia} to={T.quando}>
        {f < T.estudo && (
          <>
            <Title
              f={f}
              at={T.meia + 4}
              y={230}
              size={64}
              weight={600}
              from={AMBAR}
            >
              a cafeína cai pela <span style={{ color: AMBAR }}>metade</span>
              <br />
              em cerca de <span style={{ color: AMBAR }}>5 horas</span>
            </Title>
            <Emoji
              f={f}
              at={T.meia + 8}
              x={540}
              y={720}
              size={220}
              float={false}
            >
              ☕
            </Emoji>
            <Barra x={190} y={900} w={700} h={70} cor={AMBAR} k={xicara} />
            <div
              style={{
                position: "absolute",
                top: 1010,
                width: W,
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 110,
                color: C.ink,
                opacity: P(f, T.meia + 10, T.meia + 20),
              }}
            >
              {relogio}
            </div>
            <Pill
              x={540}
              y={1240}
              text={`ainda resta ${Math.round(xicara * 100)}%`}
              color={AMBAR}
              size={44}
              k={P(f, T.cinco, T.cinco + 10)}
            />
          </>
        )}
        {f >= T.estudo && (
          <>
            <Title
              f={f}
              at={T.estudo + 2}
              y={230}
              size={60}
              weight={600}
              from={AMBAR}
            >
              num estudo: dose alta,
              <br />
              <span style={{ color: AMBAR }}>6 h antes de dormir</span>
            </Title>
            <Emoji f={f} at={T.estudo + 6} x={540} y={640} size={200}>
              😴
            </Emoji>
            <div
              style={{
                position: "absolute",
                top: 830,
                width: W,
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 40,
                letterSpacing: 4,
                color: C.ink,
              }}
            >
              NOITE DE SONO
            </div>
            <Barra
              x={140}
              y={890}
              w={800}
              h={70}
              cor={VERDE}
              k={1 - it(f, T.tirou - 4, T.tirou + 14, 0, 0.14, OUT)}
            />
            <Pill
              x={830}
              y={1020}
              text="− 1 h"
              color={VERM}
              size={52}
              k={P(f, T.tirou, T.tirou + 10)}
            />
            <Carimbo f={f} at={T.perceberam - 4} y={1240} cor={AMBAR} size={62}>
              E NEM PERCEBERAM
            </Carimbo>
          </>
        )}
      </Part>

      {/* 6. o apagão: a cafeína sai e a adenosina encaixa de uma vez */}
      <Sequence
        from={T.quando}
        durationInFrames={T.entao - T.quando + 8}
        layout="none"
      >
        <AbsoluteFill>
          <Brilho3D />
          <Receptor3D
            f={f}
            ini={T.quando}
            aden={-99999}
            caf={T.quando - 200}
            acum={T.quando - 400}
            sai={T.sai}
          />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: apagao * 0.55,
          pointerEvents: "none",
        }}
      />
      <Part from={T.quando} to={T.entao}>
        <Grande f={f} at={T.quando + 4} y={230} cor={C.ink} size={62}>
          quando a cafeína sai...
        </Grande>
        <Leg
          y={1480}
          text="toda a adenosina encaixa de uma vez"
          color={VERDE}
          size={40}
          k={P(f, T.vez - 30, T.vez - 18)}
        />
        <Carimbo f={f} at={T.apagao} y={420} cor={VERM} size={96}>
          APAGÃO
        </Carimbo>
      </Part>

      {/* 7. solução */}
      <Part from={T.entao} to={T.siga}>
        <Title
          f={f}
          at={T.entao + 4}
          y={230}
          size={62}
          weight={600}
          from={VERDE}
        >
          sono ruim? olhe o horário do
          <br />
          <span style={{ color: VERDE }}>último cafezinho</span>
        </Title>
        <Emoji f={f} at={T.horario - 12} x={400} y={720} size={210}>
          ⏰
        </Emoji>
        <Emoji f={f} at={T.horario - 4} x={700} y={720} size={190}>
          ☕
        </Emoji>
        <Grande f={f} at={T.horario + 10} y={960} cor={AMBAR} size={60}>
          o café esconde o cansaço,
          <br />
          não tira
        </Grande>
        <Pill
          x={540}
          y={1260}
          text="📌 manda para quem vive à base de café"
          color={VERDE}
          size={42}
          k={P(f, T.manda - 4, T.manda + 8)}
        />
      </Part>

      {/* 8. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("cafeina/logo.jpg")}
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

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_CAFEINA} inY={100} outDur={1}>
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
                      ? bornColor(f, at, VERDE, "#eff6ff", 20)
                      : bornColor(f, at, C.ink, VERDE),
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
      <Audio src={staticFile("cafeina/narracao.mp3")} />
      <Audio
        src={staticFile("cafeina/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_CAFEINA - 60, DURATION_CAFEINA))
        }
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
export const CapaCafeina: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      O CAFÉ NÃO TE
      <br />
      <span
        style={{ color: VERDE, textShadow: `0 0 30px ${rgba(VERDE, 0.5)}` }}
      >
        DÁ ENERGIA
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 640,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 260,
        lineHeight: 1,
      }}
    >
      ☕🧠
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1080,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${AMBAR}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 64,
        letterSpacing: 2,
        color: AMBAR,
        background: rgba(AMBAR, 0.08),
        whiteSpace: "nowrap",
      }}
    >
      ELE ESCONDE O CANSAÇO
    </div>
    <div
      style={{
        position: "absolute",
        top: 1240,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 58,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      e por que bate
      <br />o apagão da tarde
    </div>
    <Grain />
  </AbsoluteFill>
);
