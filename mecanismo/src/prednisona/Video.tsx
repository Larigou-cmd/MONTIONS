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
import { Adrenal3D, Figado3D } from "./Corpo3D";
import falaJson from "./fala.json";

// "Parou a prednisona de repente?" — Modelo 1 verde; 3D só na explicação (adrenais apagando e fígado convertendo).
// Roteiro e fontes: roteiros/prednisona_comecou.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
const VERM = "#ff4d4d",
  AMBAR = "#f2e52e",
  VERDE = "#3dff8f",
  CINZA = "#b9b3a6";

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
  tonto: Tw("tonto"),
  tem: Tw("tem"),
  fica: Tw("fica") - 4,
  dif: Tw("diferença"),
  pred1: Tw("prednisona", 2),
  predl1: Tw("prednisolona"),
  confunde: Tw("confunde"),
  bloco: Tw("seu") - 8,
  fabrica: Tw("fábrica"),
  rins: Tw("rins"),
  adrenais: Tw("adrenais"),
  cortisol2: Tw("cortisol", 2),
  pressao: Tw("pressão"),
  acucar: Tw("açúcar"),
  energia: Tw("energia"),
  doente: Tw("doente"),
  pred: Tw("prednisona", 3),
  imita: Tw("imita"),
  forte: Tw("forte"),
  pensa: Tw("pensa"),
  sobra: Tw("sobra"),
  desliga: Tw("desligando"),
  depois: Tw("depois") - 6,
  semanas: Tw("semanas"),
  meses: Tw("meses"),
  repente: Tw("repente", 2),
  nenhum: Tw("nenhum"),
  sinal: Tw("sinal") - 6,
  fraqueza: Tw("fraqueza"),
  tontura: Tw("tontura"),
  enjoo: Tw("enjoo"),
  vomito: Tw("vômito"),
  vier: Tw("vier"),
  desmaio: Tw("desmaio"),
  confusao: Tw("confusão"),
  ps: Tw("pronto-socorro"),
  porisso: Tw("por") - 6,
  diminui: Tw("diminui"),
  religando: Tw("religando"),
  agora: Tw("agora") - 6,
  desligada: Tw("desligada"),
  figado: Tw("fígado"),
  transforma: Tw("transforma"),
  predl2: Tw("prednisolona", 2),
  trabalha: Tw("trabalha"),
  mesmo: Tw("mesmo"),
  serio: Tw("sério"),
  pronta: Tw("pronta"),
  solucao: Tw("solução"),
  crianca: Tw("criança"),
  mas: Tw("mas") - 6,
  troque: Tw("troque"),
  doses: Tw("doses"),
  dia: Tw("dia") - 8,
  manha: Tw("manhã"),
  cafe: Tw("café"),
  produz: Tw("produz"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_PREDNISONA = T.final + 90;
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.tem, TRAVA, 0.3],
  [T.fica, WHOOSH, 0.26],
  [T.bloco, WHOOSH, 0.28],
  [T.pressao, POP, 0.18],
  [T.acucar, POP, 0.18],
  [T.energia, POP, 0.18],
  [T.pred, WHOOSH, 0.24],
  [T.desliga, BIP, 0.24],
  [T.repente, TRAVA, 0.32],
  [T.sinal, WHOOSH, 0.28],
  [T.ps, TRAVA, 0.34],
  [T.porisso, WHOOSH, 0.26],
  [T.agora, WHOOSH, 0.28],
  [T.transforma, PLIM, 0.22],
  [T.troque, TRAVA, 0.3],
  [T.dia, WHOOSH, 0.26],
  [T.salva, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
  [T.final + 6, K + "logo-stings/sting-airy-long.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz; sobe na tela final, sem voz
const FALANDO = (() => {
  const a = new Array(DURATION_PREDNISONA + 1).fill(0);
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
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0) +
  0.2 * P(fr, T.final, T.final + 20);

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

// escada de doses descendo (redução gradual)
const Escada: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <div
    style={{
      position: "absolute",
      left: 190,
      top: 620,
      width: 700,
      height: 420,
      display: "flex",
      alignItems: "flex-end",
      gap: 36,
    }}
  >
    {[1, 0.75, 0.5, 0.3, 0.15].map((h, i) => {
      const k = it(f, at + i * 8, at + i * 8 + 10, 0, 1, OUT);
      return (
        <div
          key={i}
          style={{
            flex: 1,
            height: 400 * h * k,
            borderRadius: 14,
            background: rgba(VERDE, 0.25 + 0.15 * (1 - h)),
            border: `4px solid ${VERDE}`,
            boxShadow: `0 0 24px ${rgba(VERDE, 0.35)}`,
          }}
        />
      );
    })}
  </div>
);

// fundo verde mais claro atrás do 3D (o canvas é transparente)
const Brilho3D: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse 900px 900px at 50% 52%, rgba(46,160,110,.42), rgba(46,160,110,0) 75%), linear-gradient(180deg, rgba(8,48,36,.55) 0%, rgba(8,48,36,0) 30%)",
    }}
  />
);

export const VideoPrednisona: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= T.sinal && f < T.porisso
      ? VERM
      : f >= T.mas && f < T.dia
        ? AMBAR
        : VERDE;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[T.tem, T.repente, T.ps, T.troque, T.final]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.fica}>
        <Title
          f={f}
          at={0}
          y={220}
          size={80}
          font={SANS}
          weight={900}
          from={VERDE}
        >
          PAROU DE
          <br />
          <span style={{ color: VERDE }}>REPENTE?</span>
        </Title>
        <Emoji f={f} at={6} x={380} y={760} size={200}>
          💊
        </Emoji>
        <Emoji f={f} at={T.tonto - 14} x={700} y={760} size={200}>
          😵‍💫
        </Emoji>
        <Pill
          x={540}
          y={990}
          text="prednisona: fraco e tonto?"
          color={AMBAR}
          size={42}
          k={P(f, T.tonto - 16, T.tonto + 2)}
        />
        <Carimbo f={f} at={T.tem} y={1230} cor={VERM} size={66}>
          TEM EXPLICAÇÃO
        </Carimbo>
      </Part>

      {/* 2. promessa: a diferença */}
      <Part from={T.fica} to={T.bloco}>
        <Grande f={f} at={T.fica + 6} y={300} cor={C.ink} size={60}>
          e no final:
        </Grande>
        <Pill
          x={540}
          y={560}
          text="PREDNISONA"
          color={VERDE}
          size={64}
          k={P(f, T.pred1 - 6, T.pred1 + 6)}
        />
        <Grande f={f} at={T.predl1 - 10} y={640} cor={AMBAR} size={90}>
          ×
        </Grande>
        <Pill
          x={540}
          y={860}
          text="PREDNISOLONA"
          color={AMBAR}
          size={64}
          k={P(f, T.predl1 - 6, T.predl1 + 6)}
        />
        <Grande f={f} at={T.confunde - 6} y={1080} cor={C.ink} size={52}>
          quase todo mundo confunde
        </Grande>
      </Part>

      {/* 3 a 5. adrenais em 3D */}
      <Sequence
        from={T.bloco}
        durationInFrames={T.sinal - T.bloco + 6}
        layout="none"
      >
        <AbsoluteFill>
          <Brilho3D />
          <Adrenal3D
            f={f}
            t={{
              ini: T.bloco,
              pred: T.pred,
              desliga: T.desliga,
              para: T.repente,
            }}
          />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.bloco} to={T.sinal}>
        {f < T.pred && (
          <Grande f={f} at={T.fabrica - 4} y={230} cor={AMBAR} size={58}>
            a fábrica de cortisol
          </Grande>
        )}
        {f < T.cortisol2 && (
          <Pill
            x={540}
            y={1460}
            text="glândulas adrenais, em cima dos rins"
            color={AMBAR}
            size={40}
            k={P(f, T.adrenais - 14, T.adrenais + 2)}
          />
        )}
        {f >= T.cortisol2 - 4 && f < T.pred && (
          <>
            <Pill
              x={250}
              y={1460}
              text="pressão"
              color={AMBAR}
              size={42}
              k={P(f, T.pressao - 6, T.pressao + 4)}
            />
            <Pill
              x={540}
              y={1460}
              text="açúcar"
              color={AMBAR}
              size={42}
              k={P(f, T.acucar - 6, T.acucar + 4)}
            />
            <Pill
              x={830}
              y={1460}
              text="energia"
              color={AMBAR}
              size={42}
              k={P(f, T.energia - 6, T.energia + 4)}
            />
            <Pill
              x={540}
              y={1570}
              text="principalmente quando você está doente"
              color={C.ink}
              size={34}
              k={P(f, T.doente - 12, T.doente)}
            />
          </>
        )}
        {f >= T.pred && f < T.pensa && (
          <Grande f={f} at={T.pred} y={230} cor={VERDE} size={56}>
            a prednisona imita o cortisol
          </Grande>
        )}
        {f >= T.pred && f < T.pensa && (
          <Pill
            x={540}
            y={1460}
            text="💪 só que bem mais forte"
            color={VERDE}
            size={42}
            k={P(f, T.forte - 8, T.forte + 4)}
          />
        )}
        {f >= T.pensa && f < T.depois && (
          <Grande f={f} at={T.pensa} y={230} cor={C.ink} size={52}>
            “já tem cortisol de sobra”
          </Grande>
        )}
        {f >= T.pensa && f < T.depois && (
          <Pill
            x={540}
            y={1460}
            text="🏭 e a fábrica vai desligando"
            color={AMBAR}
            size={42}
            k={P(f, T.desliga - 26, T.desliga - 14)}
          />
        )}
        {f >= T.depois && (
          <Grande f={f} at={T.depois} y={230} cor={AMBAR} size={60}>
            depois de ~3 semanas
          </Grande>
        )}
        {f >= T.depois && f < T.repente - 4 && (
          <Pill
            x={540}
            y={1460}
            text="⏳ pode demorar MESES para voltar"
            color={AMBAR}
            size={42}
            k={P(f, T.meses - 8, T.meses + 4)}
          />
        )}
        {f >= T.repente - 4 && (
          <Carimbo f={f} at={T.repente} y={1470} cor={VERM} size={52}>
            PAROU DE REPENTE = SEM CORTISOL
          </Carimbo>
        )}
      </Part>

      {/* 6. sinais de alerta */}
      <Part from={T.sinal} to={T.porisso}>
        <Title
          f={f}
          at={T.sinal + 4}
          y={230}
          size={66}
          weight={600}
          from={VERM}
        >
          o sinal
        </Title>
        <Pill
          x={310}
          y={450}
          text="fraqueza forte"
          color={VERM}
          size={44}
          k={P(f, T.fraqueza - 6, T.fraqueza + 4)}
        />
        <Pill
          x={770}
          y={450}
          text="tontura"
          color={VERM}
          size={44}
          k={P(f, T.tontura - 6, T.tontura + 4)}
        />
        <Pill
          x={330}
          y={580}
          text="enjoo"
          color={VERM}
          size={44}
          k={P(f, T.enjoo - 6, T.enjoo + 4)}
        />
        <Pill
          x={740}
          y={580}
          text="vômito"
          color={VERM}
          size={44}
          k={P(f, T.vomito - 6, T.vomito + 4)}
        />
        <Linha f={f} at={T.vier - 6} y={720} cor={VERM} emoji="🚨" h={200}>
          vômito que não para, desmaio ou confusão
        </Linha>
        <Carimbo f={f} at={T.ps} y={1060} cor={VERM} size={56}>
          PRONTO-SOCORRO NA HORA
        </Carimbo>
      </Part>

      {/* 7. redução aos poucos */}
      <Part from={T.porisso} to={T.agora}>
        <Title
          f={f}
          at={T.porisso + 6}
          y={240}
          size={62}
          weight={600}
          from={VERDE}
        >
          o médico diminui a dose aos poucos
        </Title>
        <Escada f={f} at={T.diminui} />
        <Pill
          x={540}
          y={1160}
          text="🏭 a fábrica religando devagar"
          color={VERDE}
          size={44}
          k={P(f, T.religando - 12, T.religando + 2)}
        />
      </Part>

      {/* 8 e 9. fígado em 3D: a diferença */}
      <Sequence
        from={T.agora}
        durationInFrames={T.mas - T.agora + 6}
        layout="none"
      >
        <AbsoluteFill>
          <Brilho3D />
          <Figado3D f={f} t={{ ini: T.agora, transforma: T.transforma }} />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.agora} to={T.mas}>
        {f < T.figado && (
          <Grande f={f} at={T.agora + 6} y={230} cor={AMBAR} size={64}>
            agora, a diferença
          </Grande>
        )}
        {f >= T.figado && f < T.serio - 6 && (
          <Grande f={f} at={T.figado} y={230} cor={C.ink} size={56}>
            o fígado transforma
          </Grande>
        )}
        {f < T.serio - 6 && (
          <>
            <Pill
              x={300}
              y={1470}
              text="prednisona (desligada)"
              color={CINZA}
              size={36}
              k={P(f, T.desligada - 10, T.desligada + 2)}
            />
            <Pill
              x={790}
              y={1470}
              text="prednisolona ✓"
              color={VERDE}
              size={40}
              k={P(f, T.predl2 - 8, T.predl2 + 4)}
            />
            <Pill
              x={540}
              y={1580}
              text="no fim, o efeito é o mesmo"
              color={C.ink}
              size={36}
              k={P(f, T.mesmo - 14, T.mesmo)}
            />
          </>
        )}
        {f >= T.serio - 6 && (
          <>
            <Linha
              f={f}
              at={T.serio - 6}
              y={1250}
              cor={AMBAR}
              emoji="🩺"
              h={150}
            >
              fígado com problema sério → prednisolona
            </Linha>
            <Linha
              f={f}
              at={T.solucao - 8}
              y={1430}
              cor={VERDE}
              emoji="🧒"
              h={150}
            >
              existe em solução oral, muito usada em criança
            </Linha>
          </>
        )}
      </Part>

      {/* 10. não trocar */}
      <Part from={T.mas} to={T.dia}>
        <Carimbo f={f} at={T.troque} y={420} cor={AMBAR} size={52}>
          NÃO TROQUE POR CONTA PRÓPRIA
        </Carimbo>
        <Emoji f={f} at={T.troque} x={320} y={720} size={170}>
          💊
        </Emoji>
        <Emoji f={f} at={T.troque + 4} x={540} y={720} size={150}>
          🔁
        </Emoji>
        <Emoji f={f} at={T.troque + 8} x={760} y={720} size={170}>
          💊
        </Emoji>
        <Linha f={f} at={T.doses - 6} y={920} cor={AMBAR} emoji="⚖️" h={170}>
          as doses e as apresentações mudam
        </Linha>
      </Part>

      {/* 11. dia a dia */}
      <Part from={T.dia} to={T.siga}>
        <Title f={f} at={T.dia + 4} y={260} size={72} weight={600} from={VERDE}>
          no dia a dia
        </Title>
        <Linha f={f} at={T.manha - 10} y={460} cor={VERDE} emoji="🌅" h={160}>
          tome de manhã
        </Linha>
        <Linha f={f} at={T.cafe - 10} y={640} cor={VERDE} emoji="☕" h={160}>
          depois do café
        </Linha>
        <Pill
          x={540}
          y={880}
          text="a hora em que o corpo produz mais cortisol"
          color={AMBAR}
          size={36}
          k={P(f, T.produz - 10, T.produz + 2)}
        />
        <Pill
          x={540}
          y={1010}
          text="📌 salva e manda para quem toma corticoide"
          color={AMBAR}
          size={40}
          k={P(f, T.salva - 4, T.salva + 8)}
        />
      </Part>

      {/* 12. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("prednisona/logo.jpg")}
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

      {/* 13. tela final */}
      <Part from={T.final - 4} to={DURATION_PREDNISONA} inY={100} outDur={1}>
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
      <Audio src={staticFile("prednisona/narracao.mp3")} />
      <Audio
        src={staticFile("prednisona/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          (1 - P(fr, DURATION_PREDNISONA - 60, DURATION_PREDNISONA))
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
export const CapaPrednisona: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 330,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 84,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      PAROU A
      <br />
      <span
        style={{ color: VERDE, textShadow: `0 0 30px ${rgba(VERDE, 0.5)}` }}
      >
        PREDNISONA
      </span>
      <br />
      DE REPENTE?
    </div>
    <div
      style={{
        position: "absolute",
        top: 700,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 210,
        lineHeight: 1,
      }}
    >
      💊😵‍💫
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1080,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${VERM}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 60,
        letterSpacing: 2,
        color: VERM,
        background: rgba(VERM, 0.08),
        whiteSpace: "nowrap",
      }}
    >
      TEM EXPLICAÇÃO
    </div>
    <div
      style={{
        position: "absolute",
        top: 1240,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 56,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      e a diferença entre
      <br />
      <span style={{ color: VERDE }}>prednisona</span> e{" "}
      <span style={{ color: AMBAR }}>prednisolona</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
