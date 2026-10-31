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
  SNAP,
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Antibiótico: por que não pode parar quando melhora?" — Modelo 1, tudo desenhado em código.
// Roteiro e fontes: roteiros/antibiotico_parar_quando_melhora.md. Narração da Juliana (ElevenLabs), gerada pela usuária; tempos em fala.json (scripts/transcrever.py).
const AZUL = "#60a5fa",
  VERM = "#ef4444",
  ROXO = "#a78bfa",
  AMBAR = "#fbbf24",
  VERDE = "#4ade80",
  CIANO = "#22d3ee";

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
  terceiro: Tw("terceiro"),
  resposta: Tw("resposta"),
  corpo: Tw("quando") - 6,
  cai: Tw("cai"),
  febre: Tw("febre"),
  melhora: Tw("melhora"),
  melhorar: Tw("melhorar"),
  sobraram: Tw("sobraram"),
  crescer: Tw("crescer"),
  volta: Tw("volta"),
  tempo: Tw("tem") - 6,
  tuberculose: Tw("tuberculose"),
  meses: Tw("meses"),
  garganta: Tw("garganta"),
  dez: Tw("dez"),
  coracao: Tw("coração"),
  ciencia: Tw("mas") - 6,
  bmj: Tw("bmj"),
  termine: Tw("termine"),
  resistencia: Tw("resistência"),
  uso: Tw("uso"),
  estudos: Tw("estudos") - 6,
  curtos: Tw("curtos"),
  pneumonia: Tw("pneumonia"),
  tres: Tw("três"),
  oito: Tw("oito"),
  regra: Tw("então") - 6,
  fim2: Tw("fim", 2),
  melhorar2: Tw("melhorar", 2),
  prescreveu: Tw("prescreveu"),
  achou: Tw("achou"),
  sobras: Tw("nunca") - 8,
  sobrou: Tw("sobrou"),
  outra: Tw("outra"),
  receita: Tw("receita"),
  via: Tw("via"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ANTIBIOTICO = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.terceiro, "pop", 0.18],
  [T.corpo, "whoosh", 0.25],
  [T.febre, "pop", 0.18],
  [T.melhora, "pop", 0.18],
  [T.volta, "trava", 0.32],
  [T.tempo, "whoosh", 0.25],
  [T.meses, "bip", 0.22],
  [T.dez, "bip", 0.22],
  [T.ciencia, "whoosh", 0.25],
  [T.termine, "plim", 0.22],
  [T.estudos, "whoosh", 0.25],
  [T.oito, "plim", 0.25],
  [T.regra, "whoosh", 0.25],
  [T.fim2, "trava", 0.25],
  [T.melhorar2, "trava", 0.25],
  [T.prescreveu, "plim", 0.28],
  [T.sobras, "whoosh", 0.25],
  [T.receita, "pop", 0.2],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

// caixa com bactérias que somem com o antibiótico e voltam quando ele para cedo
const Bacterias: React.FC<{ f: number }> = ({ f }) => {
  const n =
    f < T.crescer
      ? Math.round(it(f, T.cai - 8, T.melhorar, 24, 4))
      : Math.round(it(f, T.crescer, T.volta + 10, 4, 22));
  const k = it(f, T.corpo, T.corpo + 14, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 420,
        width: 840,
        height: 560,
        borderRadius: 40,
        border: `3px solid ${rgba(f < T.crescer ? VERDE : VERM, 0.6)}`,
        background: C.box,
        opacity: k,
        transform: `scale(${0.9 + 0.1 * k})`,
      }}
    >
      {Array.from({ length: 24 }, (_, i) => {
        const col = i % 6,
          lin = Math.floor(i / 6);
        // ordem embaralhada, para sumirem espalhadas
        const ordem = (i * 7) % 24;
        const viva = ordem < n;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 50 + col * 128 + Math.sin(f / 14 + i) * 8,
              top: 40 + lin * 124 + Math.cos(f / 17 + i * 2) * 8,
              fontFamily: EMOJI,
              fontSize: 84,
              opacity: viva ? 1 : 0.08,
              transform: `scale(${viva ? 1 : 0.6})`,
            }}
          >
            🦠
          </span>
        );
      })}
    </div>
  );
};

// frase riscada (o que NÃO é a regra)
const Riscada: React.FC<{ f: number; at: number; y: number; text: string }> = ({
  f,
  at,
  y,
  text,
}) => {
  const k = it(f, at - 6, at + 6, 0, 1, OUT);
  const risco = it(f, at + 6, at + 18, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: W,
        textAlign: "center",
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 66,
          color: C.ink,
          opacity: 1 - 0.45 * risco,
        }}
      >
        ❌ “{text}”
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "52%",
            height: 8,
            width: `${risco * 100}%`,
            background: VERM,
            borderRadius: 4,
          }}
        />
      </span>
    </div>
  );
};

// barra de dias de tratamento
const Barra: React.FC<{
  f: number;
  at: number;
  y: number;
  dias: number;
  cor: string;
}> = ({ f, at, y, dias, cor }) => {
  const k = it(f, at - 6, at + 14, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: y,
        opacity: k > 0 ? 1 : 0,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 54,
          color: cor,
          marginBottom: 12,
        }}
      >
        {dias} dias
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: dias }, (_, i) => (
          <div
            key={i}
            style={{
              width: 88,
              height: 88,
              borderRadius: 18,
              background: rgba(cor, 0.85),
              opacity: it(k, i / dias, (i + 1) / dias, 0, 1),
              fontFamily: EMOJI,
              fontSize: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            💊
          </div>
        ))}
      </div>
    </div>
  );
};

const Linha: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  emoji: string;
  children: React.ReactNode;
  h?: number;
}> = ({ f, at, y, cor, emoji, children, h = 200 }) => (
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
    <span style={{ fontFamily: EMOJI, fontSize: 96 }}>{emoji}</span>
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

export const VideoAntibiotico: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo =
    f < T.corpo
      ? AZUL
      : f < T.tempo
        ? f < T.crescer
          ? VERDE
          : VERM
        : f < T.ciencia
          ? AMBAR
          : f < T.regra
            ? ROXO
            : f < T.sobras
              ? VERDE
              : f < T.siga
                ? VERM
                : AZUL;
  return (
    <AbsoluteFill>
      <Background
        color={corFundo}
        pulses={[
          T.volta,
          T.dez,
          T.termine,
          T.oito,
          T.prescreveu,
          T.receita,
          T.final,
        ]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.corpo}>
        <Title
          f={f}
          at={2}
          y={190}
          size={74}
          font={SANS}
          weight={900}
          from={AZUL}
        >
          MELHOROU.
          <br />
          POSSO PARAR O
          <br />
          ANTIBIÓTICO?
        </Title>
        <Emoji f={f} at={6} x={540} y={820} size={260}>
          💊
        </Emoji>
        <Pill
          x={540}
          y={1130}
          text="📅 dia 3: já estou bem 😊"
          color={AZUL}
          size={46}
          k={P(f, T.terceiro - 4, T.terceiro + 8)}
        />
        <Pill
          x={540}
          y={1300}
          text="a resposta surpreende 👀"
          color={AMBAR}
          size={46}
          k={P(f, T.resposta - 4, T.resposta + 8)}
        />
      </Part>

      {/* 2. melhorar não é curar */}
      <Part from={T.corpo} to={T.tempo}>
        <Title
          f={f}
          at={T.corpo + 4}
          y={220}
          size={70}
          weight={600}
          from={VERDE}
        >
          melhorar <span style={{ color: VERM }}>≠</span> curar
        </Title>
        <Bacterias f={f} />
        <Pill
          x={330}
          y={1080}
          text="🌡️ febre baixa"
          color={VERDE}
          size={42}
          k={P(f, T.febre - 4, T.febre + 8)}
        />
        <Pill
          x={760}
          y={1080}
          text="✅ dor melhora"
          color={VERDE}
          size={42}
          k={P(f, T.melhora - 4, T.melhora + 8)}
        />
        <Pill
          x={540}
          y={1220}
          text="parou cedo: as que sobraram crescem"
          color={AMBAR}
          size={40}
          k={P(f, T.sobraram - 4, T.sobraram + 8)}
        />
        {f >= T.volta && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 1400,
              transform: `translate(-50%,-50%) rotate(-6deg) scale(${2.2 - 1.2 * it(f, T.volta, T.volta + 7, 0, 1, OUT)})`,
              opacity: it(f, T.volta, T.volta + 7, 0, 1, OUT),
              border: `8px solid ${VERM}`,
              borderRadius: 14,
              padding: "6px 30px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 76,
              letterSpacing: 4,
              color: VERM,
              background: rgba("#000000", 0.55),
              whiteSpace: "nowrap",
            }}
          >
            A INFECÇÃO VOLTA
          </div>
        )}
      </Part>

      {/* 3. infecções que precisam de tempo */}
      <Part from={T.tempo} to={T.ciencia}>
        <Title
          f={f}
          at={T.tempo + 4}
          y={220}
          size={68}
          weight={600}
          from={AMBAR}
        >
          tem infecção que{" "}
          <span style={{ color: AMBAR }}>precisa de tempo</span>
        </Title>
        <Linha f={f} at={T.tuberculose - 8} y={470} cor={AMBAR} emoji="🫁">
          tuberculose:{" "}
          <span style={{ color: bornColor(f, T.meses, C.ink, AMBAR) }}>
            meses de tratamento
          </span>
        </Linha>
        <Linha f={f} at={T.garganta - 8} y={740} cor={AMBAR} emoji="🦠" h={250}>
          garganta (estreptococo) com penicilina:{" "}
          <span style={{ color: bornColor(f, T.dez, C.ink, AMBAR) }}>
            10 dias
          </span>
        </Linha>
        <Emoji f={f} at={T.coracao - 6} x={540} y={1170} size={150}>
          ❤️
        </Emoji>
        <Pill
          x={540}
          y={1360}
          text="protege o coração da febre reumática"
          color={VERM}
          size={42}
          k={P(f, T.coracao - 4, T.coracao + 8)}
        />
      </Part>

      {/* 4a. a ciência revisou o "termine o tratamento" */}
      <Part from={T.ciencia} to={T.estudos}>
        <Title
          f={f}
          at={T.ciencia + 4}
          y={220}
          size={70}
          weight={600}
          from={ROXO}
        >
          mas olha que <span style={{ color: ROXO }}>curioso</span>
        </Title>
        <Pill
          x={540}
          y={470}
          text="📰 revista médica BMJ · 2017"
          color={ROXO}
          size={46}
          k={P(f, T.bmj - 4, T.bmj + 8)}
        />
        <Card
          f={f}
          at={T.termine - 8}
          x={110}
          y={600}
          w={860}
          h={360}
          border={rgba(ROXO, 0.75)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            textAlign: "center",
            padding: "0 50px",
          }}
        >
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64 }}>
            “termine o tratamento”
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 42,
              color: bornColor(f, T.termine + 30, C.ink, ROXO),
            }}
          >
            não tem prova para todas as infecções
          </span>
        </Card>
        <Linha f={f} at={T.resistencia - 8} y={1060} cor={VERM} emoji="📈">
          a resistência vem do{" "}
          <span style={{ color: bornColor(f, T.uso, C.ink, VERM) }}>
            uso a mais
          </span>{" "}
          de antibiótico
        </Linha>
      </Part>

      {/* 4b. tratamentos mais curtos */}
      <Part from={T.estudos} to={T.regra}>
        <Title
          f={f}
          at={T.estudos + 4}
          y={220}
          size={70}
          weight={600}
          from={ROXO}
        >
          em vários casos,{" "}
          <span style={{ color: ROXO }}>mais curto funciona</span>
        </Title>
        <Pill
          x={540}
          y={500}
          text="🫁 pneumonia · internados já estáveis"
          color={CIANO}
          size={42}
          k={P(f, T.pneumonia - 4, T.pneumonia + 8)}
        />
        <Barra f={f} at={T.tres} y={640} dias={3} cor={VERDE} />
        <Barra f={f} at={T.oito} y={900} dias={8} cor={AZUL} />
        <Pill
          x={540}
          y={1260}
          text="✅ funcionaram igual"
          color={VERDE}
          size={54}
          k={P(f, T.oito + 6, T.oito + 18)}
        />
      </Part>

      {/* 5. a regra */}
      <Part from={T.regra} to={T.sobras}>
        <Title
          f={f}
          at={T.regra + 4}
          y={220}
          size={74}
          weight={600}
          from={VERDE}
        >
          guarda essa 👇
        </Title>
        <Riscada f={f} at={T.fim2} y={430} text="toma até o fim" />
        <Riscada f={f} at={T.melhorar2} y={560} text="para quando melhorar" />
        <Card
          f={f}
          at={T.prescreveu - 14}
          x={110}
          y={740}
          w={860}
          h={330}
          border={rgba(VERDE, 0.85)}
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
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44 }}>
            ✅ a regra é tomar
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 66,
              lineHeight: 1.15,
              color: bornColor(f, T.prescreveu, C.ink, VERDE),
            }}
          >
            exatamente como o médico prescreveu
          </span>
        </Card>
        <Linha f={f} at={T.achou - 8} y={1170} cor={AZUL} emoji="🩺">
          achou que não precisa mais?{" "}
          <span style={{ color: AZUL }}>fale com ele antes</span>
        </Linha>
      </Part>

      {/* 6. sobras e receita */}
      <Part from={T.sobras} to={T.siga}>
        <Title
          f={f}
          at={T.sobras + 4}
          y={220}
          size={74}
          weight={600}
          from={VERM}
        >
          e <span style={{ color: VERM }}>nunca</span>…
        </Title>
        <Linha f={f} at={T.sobrou - 8} y={450} cor={VERM} emoji="🚫">
          guarde a sobra para usar depois
        </Linha>
        <Linha f={f} at={T.outra - 8} y={690} cor={VERM} emoji="🙅‍♀️">
          passe para outra pessoa
        </Linha>
        <Card
          f={f}
          at={T.receita - 30}
          x={110}
          y={980}
          w={860}
          h={330}
          border={rgba(VERDE, 0.75)}
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
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42 }}>
            aqui no Brasil, antibiótico só com
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 76,
              color: bornColor(f, T.receita, C.ink, VERDE),
            }}
          >
            receita 🧾
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 38,
              opacity: it(f, T.via - 20, T.via, 0, 1),
            }}
          >
            e a farmácia fica com uma via
          </span>
        </Card>
      </Part>

      {/* 7. me siga */}
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

      {/* 8. tela final */}
      <Part from={T.final - 4} to={DURATION_ANTIBIOTICO} inY={100} outDur={1}>
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
      <Audio src={staticFile("antibiotico/narracao.mp3")} />
      <Audio
        src={staticFile("antibiotico/musica.wav")}
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_ANTIBIOTICO - 60, DURATION_ANTIBIOTICO))
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
