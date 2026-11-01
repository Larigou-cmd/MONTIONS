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

// "Vitamina C previne gripe?" — Modelo 1, tudo desenhado em código.
// Roteiro e fontes: roteiros/vitamina_c_gripe.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
const LARANJA = "#fb923c",
  AZUL = "#60a5fa",
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
  espirrar: Tw("espirrar"),
  laranja: Tw("laranja"),
  estudos: Tw("estudos"),
  primeiro: Tw("primeiro") - 6,
  influenza: Tw("influenza"),
  febre: Tw("febre"),
  dor: Tw("dor"),
  leve: Tw("leve"),
  maioria: Tw("maioria") - 10,
  revisao: Tw("revisão"),
  onze: Tw("onze"),
  resultado: Tw("resultado"),
  diminuiu: Tw("diminuiu"),
  ajudou: Tw("ajudou") - 6,
  oito: Tw("oito"),
  semana: Tw("semana"),
  meio: Tw("meio"),
  quem: Tw("quem"),
  comecar: Tw("começar"),
  consistente: Tw("consistente"),
  pergunta: Tw("aí") - 6,
  bastante: Tw("bastante"),
  nao: Tw("não", 4),
  dois: Tw("dois"),
  diarreia: Tw("diarreia"),
  barriga: Tw("barriga"),
  pedra: Tw("pedra"),
  protege: Tw("então", 2) - 6,
  vacina: Tw("vacina"),
  ano: Tw("ano"),
  muda: Tw("muda"),
  graves: Tw("graves"),
  internacao: Tw("internação"),
  regra: Tw("então", 3) - 6,
  laranja2: Tw("laranja", 2),
  escudo: Tw("escudo"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_VITAMINAC = T.final + 90;
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.espirrar, POP, 0.2],
  [T.estudos, POP, 0.2],
  [T.primeiro, WHOOSH, 0.28],
  [T.influenza, POP, 0.2],
  [T.leve - 10, POP, 0.2],
  [T.maioria, WHOOSH, 0.28],
  [T.onze, BIP, 0.25],
  [T.diminuiu, TRAVA, 0.32],
  [T.ajudou, WHOOSH, 0.28],
  [T.oito, PLIM, 0.25],
  [T.meio, BIP, 0.25],
  [T.comecar, POP, 0.2],
  [T.pergunta, WHOOSH, 0.28],
  [T.nao, TRAVA, 0.32],
  [T.dois, PLIM, 0.25],
  [T.diarreia, POP, 0.2],
  [T.barriga, POP, 0.2],
  [T.pedra, POP, 0.2],
  [T.protege, WHOOSH, 0.28],
  [T.vacina, PLIM, 0.28],
  [T.graves, POP, 0.2],
  [T.internacao, POP, 0.2],
  [T.regra, WHOOSH, 0.28],
  [T.escudo, TRAVA, 0.3],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_VITAMINAC + 1).fill(0);
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

// cartão de gripe ou resfriado
const Doenca: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  emoji: string;
  nome: string;
  children: React.ReactNode;
}> = ({ f, at, y, cor, emoji, nome, children }) => (
  <Card
    f={f}
    at={at}
    x={110}
    y={y}
    w={860}
    h={360}
    border={rgba(cor, 0.8)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 36,
      padding: "0 46px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 130 }}>{emoji}</span>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 66,
          color: cor,
        }}
      >
        {nome}
      </span>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 42,
          lineHeight: 1.25,
        }}
      >
        {children}
      </span>
    </div>
  </Card>
);

// os 7 dias do resfriado: o último perde meio dia
const Semana: React.FC<{ f: number; y: number }> = ({ f, y }) => {
  const k = it(f, T.semana - 8, T.semana + 16, 0, 1, OUT);
  const corta = it(f, T.meio, T.meio + 14, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: y,
        width: 840,
        opacity: k > 0 ? 1 : 0,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 110,
              borderRadius: 16,
              background: rgba("#ffffff", 0.08),
              overflow: "hidden",
              opacity: it(k, i / 7, (i + 1) / 7, 0, 1),
            }}
          >
            <div
              style={{
                width: i === 6 ? `${100 - 50 * corta}%` : "100%",
                height: "100%",
                background: rgba(AZUL, 0.85),
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          color: bornColor(f, T.meio, C.ink, AMBAR),
          opacity: corta,
        }}
      >
        cerca de meio dia a menos
      </div>
    </div>
  );
};

export const VideoVitaminaC: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo =
    f < T.primeiro
      ? LARANJA
      : f < T.maioria
        ? AZUL
        : f < T.ajudou
          ? ROXO
          : f < T.pergunta
            ? AZUL
            : f < T.protege
              ? VERM
              : f < T.regra
                ? VERDE
                : f < T.siga
                  ? LARANJA
                  : AZUL;
  const pessoas = Math.round(it(f, T.onze - 20, T.onze + 10, 0, 11000, OUT));
  const reduz = Math.round(it(f, T.oito - 10, T.oito + 14, 0, 8, OUT));
  return (
    <AbsoluteFill>
      <Background
        color={corFundo}
        pulses={[T.diminuiu, T.oito, T.nao, T.vacina, T.escudo, T.final]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.primeiro}>
        <Title
          f={f}
          at={2}
          y={230}
          size={84}
          font={SANS}
          weight={900}
          from={LARANJA}
        >
          VITAMINA C
          <br />
          PREVINE <span style={{ color: LARANJA }}>GRIPE?</span>
        </Title>
        <Emoji f={f} at={6} x={540} y={760} size={280}>
          🍊
        </Emoji>
        <Pill
          x={540}
          y={1080}
          text="🤧 começou a espirrar…"
          color={AZUL}
          size={48}
          k={P(f, T.espirrar - 4, T.espirrar + 8)}
        />
        <Pill
          x={540}
          y={1210}
          text="🧃 lá vem o suco de laranja"
          color={LARANJA}
          size={48}
          k={P(f, T.laranja - 8, T.laranja + 4)}
        />
        <Pill
          x={540}
          y={1340}
          text="🔬 o que os estudos mostram?"
          color={AMBAR}
          size={48}
          k={P(f, T.estudos - 4, T.estudos + 8)}
        />
      </Part>

      {/* 2. gripe não é resfriado */}
      <Part from={T.primeiro} to={T.maioria}>
        <Title
          f={f}
          at={T.primeiro + 4}
          y={250}
          size={78}
          weight={600}
          from={AZUL}
        >
          gripe <span style={{ color: VERM }}>≠</span> resfriado
        </Title>
        <Doenca
          f={f}
          at={T.influenza - 22}
          y={480}
          cor={VERM}
          emoji="🤒"
          nome="GRIPE"
        >
          vírus influenza, mais forte: febre e dor no corpo
        </Doenca>
        <Doenca
          f={f}
          at={T.leve - 14}
          y={900}
          cor={AZUL}
          emoji="🤧"
          nome="RESFRIADO"
        >
          costuma ser mais leve
        </Doenca>
      </Part>

      {/* 3. a revisão */}
      <Part from={T.maioria} to={T.ajudou}>
        <Title
          f={f}
          at={T.maioria + 4}
          y={230}
          size={70}
          weight={600}
          from={ROXO}
        >
          a maioria dos estudos olhou para o{" "}
          <span style={{ color: ROXO }}>resfriado</span>
        </Title>
        <Pill
          x={540}
          y={520}
          text="📚 uma grande revisão"
          color={ROXO}
          size={48}
          k={P(f, T.revisao - 8, T.revisao + 4)}
        />
        <div
          style={{
            position: "absolute",
            top: 610,
            width: W,
            textAlign: "center",
            opacity: P(f, T.onze - 20, T.onze - 10),
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 150,
              color: C.ink,
              lineHeight: 1.1,
            }}
          >
            +{pessoas.toLocaleString("pt-BR")}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 48,
              color: C.ink,
            }}
          >
            pessoas 👥
          </div>
        </div>
        <Linha f={f} at={T.resultado} y={940} cor={LARANJA} emoji="🍊">
          vitamina C todo dia
        </Linha>
        <div
          style={{
            position: "absolute",
            top: 1140,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 46,
            color: C.ink,
            opacity: P(f, T.diminuiu - 34, T.diminuiu - 22),
          }}
        >
          chance de ficar resfriado:
        </div>
        <Carimbo f={f} at={T.diminuiu} y={1290} cor={VERM}>
          NÃO DIMINUIU
        </Carimbo>
      </Part>

      {/* 4. ajudou só um pouquinho */}
      <Part from={T.ajudou} to={T.pergunta}>
        <Title
          f={f}
          at={T.ajudou + 4}
          y={210}
          size={70}
          weight={600}
          from={AZUL}
        >
          ajudou <span style={{ color: AZUL }}>só um pouquinho</span>
        </Title>
        <div
          style={{
            position: "absolute",
            top: 330,
            width: W,
            textAlign: "center",
            opacity: P(f, T.oito - 10, T.oito),
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 190,
              color: AZUL,
              lineHeight: 1.05,
            }}
          >
            −{reduz}%
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 44,
              color: C.ink,
            }}
          >
            de duração do resfriado, nos adultos
          </div>
        </div>
        <Semana f={f} y={680} />
        <Linha f={f} at={T.quem - 10} y={950} cor={VERDE} emoji="📅">
          só em quem já tomava todo dia
        </Linha>
        <Linha f={f} at={T.comecar - 6} y={1150} cor={VERM} emoji="🤧" h={210}>
          começar depois dos sintomas:{" "}
          <span style={{ color: bornColor(f, T.consistente, C.ink, VERM) }}>
            sem efeito consistente
          </span>
        </Linha>
      </Part>

      {/* 5. limite */}
      <Part from={T.pergunta} to={T.protege}>
        <Title
          f={f}
          at={T.pergunta + 4}
          y={220}
          size={76}
          weight={600}
          from={VERM}
        >
          então, tomo <span style={{ color: AMBAR }}>bastante?</span>
        </Title>
        <Carimbo f={f} at={T.nao} y={410} cor={VERM} size={90}>
          NÃO
        </Carimbo>
        <div
          style={{
            position: "absolute",
            top: 530,
            width: W,
            textAlign: "center",
            opacity: it(f, T.dois - 8, T.dois + 4, 0, 1, OUT),
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 130,
              color: AMBAR,
              lineHeight: 1.1,
            }}
          >
            2 g por dia
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 44,
              color: C.ink,
            }}
          >
            é o limite para adultos
          </div>
        </div>
        <Linha f={f} at={T.diarreia - 6} y={790} cor={VERM} emoji="🚽">
          diarreia
        </Linha>
        <Linha f={f} at={T.barriga - 6} y={990} cor={VERM} emoji="🤢">
          dor de barriga
        </Linha>
        <Linha f={f} at={T.pedra - 6} y={1190} cor={VERM} emoji="🪨">
          em algumas pessoas, pedra no rim
        </Linha>
      </Part>

      {/* 6. vacina */}
      <Part from={T.protege} to={T.regra}>
        <Title
          f={f}
          at={T.protege + 4}
          y={220}
          size={70}
          weight={600}
          from={VERDE}
        >
          o que protege da gripe{" "}
          <span style={{ color: VERDE }}>de verdade?</span>
        </Title>
        <Emoji f={f} at={T.vacina - 8} x={540} y={620} size={230}>
          💉
        </Emoji>
        <div
          style={{
            position: "absolute",
            top: 770,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            color: VERDE,
            opacity: it(f, T.vacina - 4, T.vacina + 6, 0, 1, OUT),
          }}
        >
          A VACINA
        </div>
        <Pill
          x={540}
          y={980}
          text="📅 todo ano"
          color={VERDE}
          size={52}
          k={P(f, T.ano - 10, T.ano + 2)}
        />
        <Pill
          x={540}
          y={1100}
          text="🦠 porque o vírus muda"
          color={AMBAR}
          size={48}
          k={P(f, T.muda - 10, T.muda + 2)}
        />
        <Linha f={f} at={T.graves - 14} y={1200} cor={VERDE} emoji="🛡️" h={210}>
          menos risco de{" "}
          <span style={{ color: bornColor(f, T.graves, C.ink, VERDE) }}>
            casos graves
          </span>{" "}
          e de{" "}
          <span style={{ color: bornColor(f, T.internacao, C.ink, VERDE) }}>
            internação
          </span>
        </Linha>
      </Part>

      {/* 7. guarda essa */}
      <Part from={T.regra} to={T.siga}>
        <Title
          f={f}
          at={T.regra + 4}
          y={250}
          size={78}
          weight={600}
          from={LARANJA}
        >
          guarda essa 👇
        </Title>
        <Linha f={f} at={T.laranja2 - 8} y={520} cor={LARANJA} emoji="🍊">
          a laranja faz bem
        </Linha>
        <Emoji f={f} at={T.escudo - 16} x={540} y={900} size={200}>
          🛡️
        </Emoji>
        <Carimbo f={f} at={T.escudo} y={1150} cor={VERM} size={48}>
          NÃO É ESCUDO CONTRA A GRIPE
        </Carimbo>
      </Part>

      {/* 8. me siga */}
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

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_VITAMINAC} inY={100} outDur={1}>
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
      <Audio src={staticFile("vitaminac/narracao.mp3")} />
      <Audio
        src={staticFile("vitaminac/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_VITAMINAC - 60, DURATION_VITAMINAC))
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
export const CapaVitaminaC: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={LARANJA} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 112,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      VITAMINA C
      <br />
      <span
        style={{ color: LARANJA, textShadow: `0 0 30px ${rgba(LARANJA, 0.5)}` }}
      >
        PREVINE GRIPE?
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 690,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 280,
        lineHeight: 1,
      }}
    >
      🍊🤧
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1160,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${VERM}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 52,
        letterSpacing: 3,
        color: VERM,
        background: rgba(VERM, 0.1),
        whiteSpace: "nowrap",
      }}
    >
      O QUE OS ESTUDOS DIZEM
    </div>
    <div
      style={{
        position: "absolute",
        top: 1340,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 62,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      a resposta não é
      <br />a que todo mundo acha
    </div>
    <Grain />
  </AbsoluteFill>
);
