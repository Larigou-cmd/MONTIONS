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
import { Card, EMOJI, Title } from "../aas/ui";
import { Coagulo3D } from "./Coagulo3D";
import falaJson from "./fala.json";

// "Toma anticoncepcional? Se uma perna inchar e doer, não espera passar" — Modelo 1 com coágulo em 3D (@remotion/three).
// Roteiro e fontes: roteiros/anticoncepcional_perna.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
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
  perna: Tw("perna"),
  passar: Tw("passar"),
  coagulo: Tw("coágulo"),
  guarda: Tw("guarda"),
  emerg: Tw("emergência"),
  fim3d: Tw("o") - 6,
  combinado: Tw("combinado"),
  estrogenio: Tw("estrogênio"),
  sangue: Tw("sangue"),
  risco: Tw("risco"),
  calma: Tw("mas", 2) - 6,
  baixo: Tw("baixo"),
  numeros: Tw("sem") - 6,
  duas: Tw("duas"),
  cinco: Tw("cinco"),
  primeiro: Tw("primeiro"),
  trinta: Tw("trinta"),
  fuma: Tw("fuma"),
  peso: Tw("acima"),
  como: Tw("então") - 6,
  alerta: Tw("alerta") - 8,
  perna2: Tw("perna", 2),
  inchaco: Tw("inchaço"),
  dor: Tw("dor"),
  calor: Tw("calor"),
  vermelhidao: Tw("vermelhidão"),
  procure: Tw("procure"),
  agora: Tw("agora") - 6,
  falta: Tw("falta"),
  dor2: Tw("dor", 2),
  tosse: Tw("tosse"),
  pronto: Tw("pronto-socorro"),
  avise: Tw("avise"),
  sem: Tw("sem", 2) - 6,
  pare: Tw("pare"),
  fale: Tw("fale"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ANTICONCEPCIONAL = T.final + 90;
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.perna, POP, 0.2],
  [T.coagulo, TRAVA, 0.32],
  [T.guarda, POP, 0.22],
  [T.fim3d, WHOOSH, 0.28],
  [T.estrogenio, PLIM, 0.25],
  [T.risco, TRAVA, 0.3],
  [T.calma, WHOOSH, 0.28],
  [T.numeros, WHOOSH, 0.28],
  [T.duas, BIP, 0.25],
  [T.cinco, BIP, 0.25],
  [T.primeiro, POP, 0.2],
  [T.trinta, POP, 0.2],
  [T.fuma, POP, 0.2],
  [T.peso, POP, 0.2],
  [T.como, WHOOSH, 0.28],
  [T.alerta, WHOOSH, 0.28],
  [T.inchaco, POP, 0.2],
  [T.dor, POP, 0.2],
  [T.calor, POP, 0.2],
  [T.vermelhidao, POP, 0.2],
  [T.agora, WHOOSH, 0.28],
  [T.falta, TRAVA, 0.32],
  [T.pronto, TRAVA, 0.32],
  [T.sem, WHOOSH, 0.28],
  [T.pare, TRAVA, 0.3],
  [T.salva, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_ANTICONCEPCIONAL + 1).fill(0);
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

export const VideoAnticoncepcional: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo =
    f < T.calma
      ? ROXO
      : f < T.numeros
        ? VERDE
        : f < T.alerta
          ? AZUL
          : f < T.sem
            ? VERM
            : f < T.siga
              ? AMBAR
              : AZUL;
  return (
    <AbsoluteFill>
      <Background color={corFundo} pulses={[T.risco, T.calma, T.falta, T.pare, T.final]} />

      {/* 1 e 2. gancho em 3D: dentro da veia */}
      <Sequence from={0} durationInFrames={T.fim3d + 8} layout="none">
        <AbsoluteFill>
          <Coagulo3D f={f} ate={T.fim3d} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,6,12,.86) 0%, rgba(5,6,12,.72) 38%, rgba(5,6,12,0) 56%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>
      <Part from={0} to={T.coagulo - 8}>
        <Title f={f} at={0} y={230} size={80} font={SANS} weight={900} from={VERM}>
          TOMA
          <br />
          ANTICONCEPCIONAL?
        </Title>
        <Grande f={f} at={T.perna - 4} y={470} cor={AMBAR} size={74}>
          UMA PERNA INCHOU E DOEU?
        </Grande>
        <Grande f={f} at={T.passar - 12} y={680} cor={C.ink} size={58}>
          não espera passar
        </Grande>
      </Part>
      <Part from={T.coagulo - 8} to={T.fim3d}>
        <Carimbo f={f} at={T.coagulo} y={330} cor={VERM} size={64}>
          PODE SER UM COÁGULO
        </Carimbo>
        <Pill x={540} y={470} text="👀 guarda isso: no final, um sinal de emergência" color={AMBAR} size={36} k={P(f, T.guarda - 4, T.guarda + 8)} />
      </Part>

      {/* 3. estrogênio */}
      <Part from={T.fim3d} to={T.calma}>
        <Title f={f} at={T.fim3d + 4} y={230} size={70} weight={600} from={ROXO}>
          o anticoncepcional <span style={{ color: ROXO }}>combinado</span> tem
        </Title>
        <Grande f={f} at={T.estrogenio - 6} y={430} cor={ROXO} size={118}>
          ESTROGÊNIO
        </Grande>
        <Linha f={f} at={T.sangue - 10} y={640} cor={ROXO} emoji="🩸" h={200}>
          o sangue fica mais fácil de coagular
        </Linha>
        <Carimbo f={f} at={T.risco} y={980} cor={VERM} size={58}>
          RISCO DE TROMBOSE SOBE
        </Carimbo>
      </Part>

      {/* 4. calma */}
      <Part from={T.calma} to={T.numeros}>
        <Grande f={f} at={T.calma + 6} y={620} cor={C.ink} size={150}>
          CALMA
        </Grande>
        <Grande f={f} at={T.baixo - 26} y={830} cor={VERDE} size={72}>
          o risco ainda é baixo
        </Grande>
      </Part>

      {/* 5. números */}
      <Part from={T.numeros} to={T.como}>
        <Title f={f} at={T.numeros + 4} y={220} size={62} weight={600} from={AZUL}>
          por ano, em <span style={{ color: AZUL }}>10 mil mulheres</span>
        </Title>
        <Linha f={f} at={T.duas - 14} y={380} cor={AZUL} emoji="💧" h={170}>
          sem esse remédio: cerca de 2
        </Linha>
        <Linha f={f} at={T.cinco - 14} y={570} cor={AMBAR} emoji="💊" h={170}>
          com o combinado: 5 a 12, conforme o tipo
        </Linha>
        <Pill x={540} y={830} text="pesa mais no 1º ano" color={VERM} size={44} k={P(f, T.primeiro - 8, T.primeiro + 4)} />
        <Pill x={540} y={930} text="depois dos 35" color={VERM} size={44} k={P(f, T.trinta - 8, T.trinta + 4)} />
        <Pill x={540} y={1030} text="em quem fuma" color={VERM} size={44} k={P(f, T.fuma - 8, T.fuma + 4)} />
        <Pill x={540} y={1130} text="bem acima do peso" color={VERM} size={44} k={P(f, T.peso - 8, T.peso + 4)} />
      </Part>

      {/* 6. ponta solta */}
      <Part from={T.como} to={T.alerta}>
        <Grande f={f} at={T.como + 8} y={680} cor={AZUL} size={110}>
          É SÓ CANSAÇO?
        </Grande>
      </Part>

      {/* 7. alerta */}
      <Part from={T.alerta} to={T.agora}>
        <Title f={f} at={T.alerta + 4} y={230} size={66} weight={600} from={AMBAR}>
          o alerta costuma ser em
        </Title>
        <Grande f={f} at={T.perna2 - 8} y={340} cor={AMBAR} size={108}>
          UMA PERNA SÓ
        </Grande>
        <Pill x={300} y={580} text="inchaço" color={VERM} size={48} k={P(f, T.inchaco - 8, T.inchaco + 4)} />
        <Pill x={760} y={580} text="dor" color={VERM} size={48} k={P(f, T.dor - 8, T.dor + 4)} />
        <Pill x={300} y={700} text="calor" color={VERM} size={48} k={P(f, T.calor - 8, T.calor + 4)} />
        <Pill x={740} y={700} text="vermelhidão" color={VERM} size={48} k={P(f, T.vermelhidao - 8, T.vermelhidao + 4)} />
        <Linha f={f} at={T.procure - 8} y={860} cor={VERDE} emoji="🩺" h={170}>
          procure atendimento
        </Linha>
      </Part>

      {/* 8. emergência */}
      <Part from={T.agora} to={T.sem}>
        <Title f={f} at={T.agora + 4} y={230} size={62} weight={600} from={VERM}>
          o sinal que eu pedi para guardar
        </Title>
        <Linha f={f} at={T.falta - 6} y={400} cor={VERM} emoji="🫁" h={150}>
          falta de ar de repente
        </Linha>
        <Linha f={f} at={T.dor2 - 6} y={570} cor={VERM} emoji="💔" h={150}>
          dor no peito
        </Linha>
        <Linha f={f} at={T.tosse - 6} y={740} cor={VERM} emoji="🩸" h={150}>
          tosse com sangue
        </Linha>
        <Carimbo f={f} at={T.pronto} y={1000} cor={VERM} size={82}>
          PRONTO-SOCORRO
        </Carimbo>
        <Pill x={540} y={1130} text="avise que toma anticoncepcional" color={AMBAR} size={42} k={P(f, T.avise - 8, T.avise + 4)} />
      </Part>

      {/* 9. sem sintomas */}
      <Part from={T.sem} to={T.siga}>
        <Title f={f} at={T.sem + 4} y={260} size={74} weight={600} from={AMBAR}>
          sem nenhum sintoma?
        </Title>
        <Carimbo f={f} at={T.pare} y={520} cor={VERM} size={48}>
          NÃO PARE POR CONTA PRÓPRIA
        </Carimbo>
        <Linha f={f} at={T.fale - 8} y={650} cor={AZUL} emoji="🩺" h={170}>
          fale com quem prescreveu
        </Linha>
        <Pill x={540} y={920} text="📌 salva e manda para quem toma" color={AMBAR} size={46} k={P(f, T.salva - 4, T.salva + 8)} />
      </Part>

      {/* 10. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("anticoncepcional/logo.jpg")}
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
      <Part from={T.final - 4} to={DURATION_ANTICONCEPCIONAL} inY={100} outDur={1}>
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
      <Audio src={staticFile("anticoncepcional/narracao.mp3")} />
      <Audio
        src={staticFile("anticoncepcional/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          (1 - P(fr, DURATION_ANTICONCEPCIONAL - 60, DURATION_ANTICONCEPCIONAL))
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
export const CapaAnticoncepcional: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERM} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 84,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      TOMA
      <br />
      ANTICONCEPCIONAL?
    </div>
    <div
      style={{
        position: "absolute",
        top: 620,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 104,
        lineHeight: 1.05,
        color: AMBAR,
      }}
    >
      UMA PERNA
      <br />
      INCHOU E DOEU?
    </div>
    <div
      style={{
        position: "absolute",
        top: 900,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 200,
        lineHeight: 1,
      }}
    >
      💊🦵
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1250,
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
      NÃO ESPERA PASSAR
    </div>
    <div
      style={{
        position: "absolute",
        top: 1400,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 54,
        color: C.ink,
      }}
    >
      o sinal que é emergência
    </div>
    <Grain />
  </AbsoluteFill>
);
