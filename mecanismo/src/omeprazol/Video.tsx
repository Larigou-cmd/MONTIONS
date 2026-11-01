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
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Toma omeprazol todo dia há anos?" — Modelo 1, tudo desenhado em código.
// Roteiro e fontes: roteiros/omeprazol_todo_dia.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
const AZUL = "#60a5fa",
  VERM = "#ef4444",
  ROXO = "#a78bfa",
  AMBAR = "#fbbf24",
  VERDE = "#4ade80";

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
  perguntou: Tw("perguntou"),
  ainda: Tw("ainda"),
  promessa: Tw("ele") - 6,
  tratar: Tw("tratar"),
  problema: Tw("problema"),
  parar: Tw("parar"),
  bombas: Tw("omeprazol", 2) - 18,
  desliga: Tw("desliga"),
  gente: Tw("gente"),
  meses: Tw("meses"),
  anos: Tw("anos", 2),
  acido: Tw("esse") - 6,
  queimar: Tw("queimar"),
  aproveitar: Tw("aproveitar"),
  b12: Tw("b12"),
  risco: Tw("uso") - 14,
  ligam: Tw("ligam"),
  b122: Tw("b12", 2),
  magnesio: Tw("magnésio"),
  fraturas: Tw("fraturas"),
  acontecer: Tw("acontecer"),
  reavaliar: Tw("reavaliar"),
  erra0: Tw("lembra") - 6,
  erra: Tw("erra"),
  rebote0: Tw("quando") - 6,
  corta: Tw("corta"),
  demais: Tw("demais"),
  rebote: Tw("rebote"),
  queimacao: Tw("queimação"),
  acha: Tw("acha"),
  comeca: Tw("começa", 2),
  precisa0: Tw("tem", 2) - 20,
  usar: Tw("usar"),
  pare: Tw("pare"),
  consulta: Tw("na", 2) - 6,
  ainda2: Tw("ainda", 2),
  menor: Tw("menor"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_OMEPRAZOL = T.final + 90;
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.ainda, POP, 0.2],
  [T.promessa, WHOOSH, 0.28],
  [T.problema, TRAVA, 0.3],
  [T.bombas, WHOOSH, 0.28],
  [T.desliga, BIP, 0.25],
  [T.meses, POP, 0.2],
  [T.anos, PLIM, 0.25],
  [T.acido, WHOOSH, 0.28],
  [T.b12, PLIM, 0.25],
  [T.risco, WHOOSH, 0.28],
  [T.b122, POP, 0.2],
  [T.magnesio, POP, 0.2],
  [T.fraturas, POP, 0.2],
  [T.acontecer, BIP, 0.22],
  [T.erra0, WHOOSH, 0.28],
  [T.erra, TRAVA, 0.32],
  [T.rebote0, WHOOSH, 0.28],
  [T.rebote, TRAVA, 0.32],
  [T.queimacao, POP, 0.2],
  [T.acha, POP, 0.2],
  [T.comeca, POP, 0.2],
  [T.precisa0, WHOOSH, 0.28],
  [T.pare, TRAVA, 0.32],
  [T.consulta, WHOOSH, 0.28],
  [T.ainda2, PLIM, 0.25],
  [T.menor, PLIM, 0.25],
  [T.salva, POP, 0.2],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_OMEPRAZOL + 1).fill(0);
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

// bombas de ácido que se apagam com o omeprazol
const Bombas: React.FC<{ f: number; y: number }> = ({ f, y }) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: y,
      width: 780,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 30,
    }}
  >
    {Array.from({ length: 8 }, (_, i) => {
      const apaga = it(f, T.desliga + i * 3, T.desliga + i * 3 + 12, 0, 1, OUT);
      return (
        <div
          key={i}
          style={{
            height: 130,
            borderRadius: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 46,
            color: C.ink,
            background: rgba(AMBAR, 0.75 - 0.68 * apaga),
            border: `3px solid ${rgba(AMBAR, 0.9 - 0.65 * apaga)}`,
          }}
        >
          H⁺
        </div>
      );
    })}
  </div>
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

// o ácido sobe depois de parar de uma vez
const Medidor: React.FC<{ f: number; y: number }> = ({ f, y }) => {
  const k = it(f, T.corta, T.demais + 12, 0.25, 1, OUT);
  const nivel = it(f, T.corta + 10, T.demais + 12, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: y,
        width: 840,
        opacity: k > 0.25 ? 1 : 0,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          color: C.ink,
          marginBottom: 16,
        }}
      >
        ácido no estômago
      </div>
      <div
        style={{
          height: 74,
          borderRadius: 37,
          background: rgba("#ffffff", 0.08),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${15 + 85 * nivel}%`,
            background: VERM,
            borderRadius: 37,
          }}
        />
      </div>
    </div>
  );
};

export const VideoOmeprazol: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo =
    f < T.bombas
      ? ROXO
      : f < T.acido
        ? AMBAR
        : f < T.risco
          ? AZUL
          : f < T.erra0
            ? ROXO
            : f < T.precisa0
              ? VERM
              : f < T.consulta
                ? AMBAR
                : f < T.siga
                  ? VERDE
                  : AZUL;
  return (
    <AbsoluteFill>
      <Background
        color={corFundo}
        pulses={[T.problema, T.anos, T.erra, T.rebote, T.pare, T.final]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.promessa}>
        <Title
          f={f}
          at={2}
          y={230}
          size={84}
          font={SANS}
          weight={900}
          from={ROXO}
        >
          TOMA OMEPRAZOL
          <br />
          TODO DIA <span style={{ color: ROXO }}>HÁ ANOS?</span>
        </Title>
        <Emoji f={f} at={8} x={540} y={760} size={270}>
          💊
        </Emoji>
        <Pill
          x={540}
          y={1090}
          text="💬 alguém já te perguntou"
          color={AZUL}
          size={48}
          k={P(f, T.perguntou - 10, T.perguntou + 2)}
        />
        <Pill
          x={540}
          y={1230}
          text="🤔 se você ainda precisa?"
          color={AMBAR}
          size={52}
          k={P(f, T.ainda - 6, T.ainda + 6)}
        />
      </Part>

      {/* 2. promessa */}
      <Part from={T.promessa} to={T.bombas}>
        <Linha f={f} at={T.tratar - 14} y={430} cor={VERDE} emoji="✅" h={200}>
          ótimo para tratar o estômago
        </Linha>
        <Emoji f={f} at={T.problema - 12} x={540} y={830} size={170}>
          ⚠️
        </Emoji>
        <Carimbo f={f} at={T.problema} y={1090} cor={VERM} size={60}>
          O PROBLEMA APARECE
        </Carimbo>
        <Grande f={f} at={T.parar - 6} y={1210} cor={C.ink} size={74}>
          na hora de parar
        </Grande>
      </Part>

      {/* 3. bombas de ácido */}
      <Part from={T.bombas} to={T.acido}>
        <Title
          f={f}
          at={T.bombas + 4}
          y={220}
          size={70}
          weight={600}
          from={AMBAR}
        >
          ele desliga as
          <br />
          <span style={{ color: AMBAR }}>bombas de ácido</span>
        </Title>
        <Bombas f={f} y={470} />
        <Pill
          x={540}
          y={930}
          text="começa por um tempo… e vai ficando"
          color={AZUL}
          size={44}
          k={P(f, T.gente - 6, T.gente + 6)}
        />
        <Grande f={f} at={T.meses} y={1040} cor={C.ink}>
          MESES
        </Grande>
        <Grande f={f} at={T.anos} y={1170} cor={AMBAR} size={130}>
          ANOS
        </Grande>
      </Part>

      {/* 4. o ácido também serve para outra coisa */}
      <Part from={T.acido} to={T.risco}>
        <Title
          f={f}
          at={T.acido + 4}
          y={240}
          size={72}
          weight={600}
          from={AZUL}
        >
          o ácido <span style={{ color: AZUL }}>não serve</span> só para queimar
        </Title>
        <Linha f={f} at={T.aproveitar - 16} y={560} cor={AZUL} emoji="🍳" h={230}>
          ajuda o corpo a aproveitar a vitamina da comida
        </Linha>
        <Grande f={f} at={T.b12} y={880} cor={AZUL} size={190}>
          B12
        </Grande>
      </Part>

      {/* 5. uso prolongado */}
      <Part from={T.risco} to={T.erra0}>
        <Title
          f={f}
          at={T.risco + 4}
          y={200}
          size={64}
          weight={600}
          from={ROXO}
        >
          uso prolongado:
          <br />
          <span style={{ color: ROXO }}>estudos ligam a…</span>
        </Title>
        <Linha f={f} at={T.b122 - 6} y={440} cor={ROXO} emoji="🔻" h={150}>
          vitamina B12 baixa
        </Linha>
        <Linha f={f} at={T.magnesio - 6} y={610} cor={ROXO} emoji="🔻" h={150}>
          magnésio baixo
        </Linha>
        <Linha f={f} at={T.fraturas - 6} y={780} cor={ROXO} emoji="🦴" h={150}>
          mais fraturas
        </Linha>
        <Pill
          x={540}
          y={1040}
          text="não quer dizer que vai acontecer com você"
          color={VERDE}
          size={40}
          k={P(f, T.acontecer - 14, T.acontecer - 2)}
        />
        <Grande f={f} at={T.reavaliar - 6} y={1130} cor={AMBAR} size={76}>
          é motivo para reavaliar
        </Grande>
      </Part>

      {/* 6. ponta solta */}
      <Part from={T.erra0} to={T.rebote0}>
        <Title
          f={f}
          at={T.erra0 + 4}
          y={500}
          size={76}
          weight={600}
          from={VERM}
        >
          lembra da hora de parar?
        </Title>
        <Carimbo f={f} at={T.erra - 16} y={850} cor={VERM} size={46}>
          É AQUI QUE MUITA GENTE ERRA
        </Carimbo>
      </Part>

      {/* 7. efeito rebote */}
      <Part from={T.rebote0} to={T.precisa0}>
        <Title
          f={f}
          at={T.rebote0 + 4}
          y={220}
          size={76}
          weight={600}
          from={VERM}
        >
          cortou <span style={{ color: VERM }}>de uma vez</span>
        </Title>
        <Medidor f={f} y={400} />
        <Carimbo f={f} at={T.rebote} y={690} cor={VERM} size={74}>
          EFEITO REBOTE
        </Carimbo>
        <Linha f={f} at={T.queimacao - 6} y={830} cor={VERM} emoji="🔥" h={150}>
          a queimação volta
        </Linha>
        <Linha f={f} at={T.acha - 6} y={1000} cor={AMBAR} emoji="😟" h={150}>
          “não vivo sem o remédio”
        </Linha>
        <Linha f={f} at={T.comeca - 6} y={1170} cor={ROXO} emoji="🔁" h={150}>
          começa tudo de novo
        </Linha>
      </Part>

      {/* 8. quem precisa */}
      <Part from={T.precisa0} to={T.consulta}>
        <Linha f={f} at={T.precisa0 + 6} y={480} cor={AZUL} emoji="🩺" h={230}>
          tem gente que precisa mesmo usar por muito tempo
        </Linha>
        <Emoji f={f} at={T.pare - 14} x={540} y={900} size={170}>
          🛑
        </Emoji>
        <Carimbo f={f} at={T.pare} y={1130} cor={VERM} size={48}>
          NÃO PARE POR CONTA PRÓPRIA
        </Carimbo>
      </Part>

      {/* 9. consulta */}
      <Part from={T.consulta} to={T.siga}>
        <Title
          f={f}
          at={T.consulta + 4}
          y={230}
          size={74}
          weight={600}
          from={VERDE}
        >
          na próxima <span style={{ color: VERDE }}>consulta</span>
        </Title>
        <Linha f={f} at={T.ainda2 - 8} y={450} cor={VERDE} emoji="1️⃣" h={200}>
          ainda preciso tomar?
        </Linha>
        <Linha f={f} at={T.menor - 18} y={680} cor={VERDE} emoji="2️⃣" h={200}>
          qual é a menor dose para mim?
        </Linha>
        <Pill
          x={540}
          y={1000}
          text="📌 salva para não esquecer"
          color={AMBAR}
          size={46}
          k={P(f, T.salva - 4, T.salva + 8)}
        />
        <Pill
          x={540}
          y={1130}
          text="📲 manda para quem toma todo dia"
          color={AZUL}
          size={44}
          k={P(f, T.salva + 44, T.salva + 56)}
        />
      </Part>

      {/* 10. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card
          f={f}
          at={T.siga}
          x={110}
          y={760}
          w={860}
          h={300}
          border={rgba(AZUL, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 84,
              color: bornColor(f, T.siga, C.ink, AZUL),
            }}
          >
            Me siga
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.3,
            }}
          >
            para mais dicas de farmacologia e curiosidades sobre a área
          </span>
        </Card>
      </Part>

      {/* 11. tela final */}
      <Part from={T.final - 4} to={DURATION_OMEPRAZOL} inY={100} outDur={1}>
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
      <Audio src={staticFile("omeprazol/narracao.mp3")} />
      <Audio
        src={staticFile("omeprazol/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_OMEPRAZOL - 60, DURATION_OMEPRAZOL))
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
export const CapaOmeprazol: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={ROXO} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 94,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      TOMA OMEPRAZOL
      <br />
      <span style={{ color: ROXO, textShadow: `0 0 30px ${rgba(ROXO, 0.5)}` }}>
        TODO DIA?
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 680,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 280,
        lineHeight: 1,
      }}
    >
      💊📅
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1150,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${VERM}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 66,
        letterSpacing: 3,
        color: VERM,
        background: rgba(VERM, 0.1),
        whiteSpace: "nowrap",
      }}
    >
      VOCÊ AINDA PRECISA?
    </div>
    <div
      style={{
        position: "absolute",
        top: 1330,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 60,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      o problema aparece
      <br />
      na hora de parar
    </div>
    <Grain />
  </AbsoluteFill>
);
