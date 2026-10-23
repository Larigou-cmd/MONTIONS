import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
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

// "O rim e os diuréticos" — clipes gerados no Google Vids (Veo), baixados em public/rim/vids.mp4 (8 cenas de 10 s),
// montados aqui no Modelo 1 com a narração da Juliana. Roteiro e fontes: roteiros/google_vids_rim_diureticos.md.
const AZUL = "#60a5fa",
  OURO = "#fbbf24",
  VERM = "#f87171",
  LARANJA = "#fb923c",
  VERDE = "#4ade80",
  ROXO = "#c084fc";

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
  litros: Tw("litros"),
  xixi: Tw("xixi"),
  cada: Tw("cada") - 6,
  nefrons: Tw("néfrons"),
  glomerulo: Tw("glomérulo"),
  depois: Tw("depois") - 6,
  noventa: Tw("noventa"),
  urina: Tw("urina"),
  diuretico: Tw("diurético") - 8,
  sal: Tw("sal", 2),
  agua: Tw("água", 3),
  pressao: Tw("cai"),
  furo: Tw("furosemida") - 8,
  alca: Tw("alça"),
  forte: Tw("forte"),
  hctz: Tw("hidroclorotiazida") - 24,
  distal: Tw("distal"),
  controlar: Tw("controlar"),
  espiro: Tw("espironolactona") - 8,
  coletor: Tw("coletor"),
  aldosterona: Tw("aldosterona"),
  potassio: Tw("potássio"),
  cuidado: Tw("por", 3) - 4,
  baixar: Tw("baixar"),
  aumentar: Tw("aumentar"),
  exame: Tw("exame"),
  consulte: Tw("consulte") - 6,
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_RIM = T.final + 90;
// [início no vids.mp4 (s), de, até]: cada cena do Vids esticada ou encurtada até caber no trecho da fala
const CENAS: [number, number, number][] = [
  [0, 0, T.cada + 6],
  [10, T.cada, T.depois + 6],
  [20, T.depois, T.diuretico + 6],
  [30, T.diuretico, T.furo + 6],
  [40, T.furo, T.hctz + 6],
  [50, T.hctz, T.espiro + 6],
  [60, T.espiro, T.cuidado + 6],
  [70, T.cuidado, T.consulte + 6],
];
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.litros, "pop", 0.25],
  [T.nefrons, "pop", 0.2],
  [T.noventa, "plim", 0.22],
  [T.sal, "pop", 0.2],
  [T.alca, "trava", 0.3],
  [T.distal, "trava", 0.3],
  [T.coletor, "trava", 0.3],
  [T.baixar, "pop", 0.22],
  [T.aumentar, "pop", 0.22],
  [T.final, "plim", 0.3],
  ...CENAS.slice(1).map(
    ([, de]) => [de, "whoosh", 0.22] as [number, string, number],
  ),
];
const ESCURO: React.CSSProperties = { background: "rgba(5,8,20,0.88)" };

// fundo: as 8 cenas do Vids já cortadas e esticadas no tempo da fala (public/rim/fundo.mp4, feito com ffmpeg a partir de CENAS)
const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= T.consulte + 6) return null;
  const op = 1 - it(f, T.consulte - 4, T.consulte + 6, 0, 1, OUT);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <OffthreadVideo src={staticFile("rim/fundo.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(5,8,20,0.8), rgba(5,8,20,0) 26%, rgba(5,8,20,0) 62%, rgba(5,8,20,0.88))" }} />
    </AbsoluteFill>
  );
};

const Faixa: React.FC<{
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  if (f < de - 2 || f > ate) return null;
  const k = Math.min(
    it(f, de, de + 10, 0, 1, OUT),
    1 - it(f, ate - 10, ate, 0, 1, OUT),
  );
  return (
    <AbsoluteFill
      style={{ opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

// número grande que conta até o valor
const Numero: React.FC<{
  at: number;
  ate: number;
  valor: number;
  sufixo: string;
  cor: string;
  y: number;
}> = ({ at, ate, valor, sufixo, cor, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const v = Math.round(valor * it(f, at, Math.min(ate, at + 40), 0, 1, OUT));
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 150,
        color: cor,
        textShadow: `0 0 40px ${rgba(cor, 0.7)}`,
        opacity: P(f, at, at + 8),
      }}
    >
      {v}
      <span style={{ fontSize: 80 }}>{sufixo}</span>
    </div>
  );
};

export const VideoRim: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background
        color={f >= T.consulte ? AZUL : VERM}
        pulses={[T.litros, T.final]}
      />
      <Fundo />

      {/* 1. 180 L por dia */}
      <Faixa de={0} ate={T.cada}>
        <Title
          f={f}
          at={4}
          y={170}
          size={58}
          font={SANS}
          weight={900}
          color={C.ink}
          from={AZUL}
        >
          SEUS RINS FILTRAM…
        </Title>
        <Numero
          at={T.litros - 20}
          ate={T.xixi}
          valor={180}
          sufixo=" L/dia"
          cor={AZUL}
          y={1300}
        />
        <Pill
          x={540}
          y={1620}
          text="💧 e só ~1 L vira xixi"
          color={AZUL}
          size={42}
          k={P(f, T.xixi, T.xixi + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 2. néfrons e glomérulo */}
      <Faixa de={T.cada} ate={T.depois}>
        <Title
          f={f}
          at={T.cada + 4}
          y={170}
          size={60}
          font={SANS}
          weight={900}
          color={C.ink}
          from={AZUL}
        >
          1 MILHÃO DE NÉFRONS
        </Title>
        <Title
          f={f}
          at={T.cada + 14}
          y={260}
          size={42}
          weight={600}
          color={C.dim}
          from={AZUL}
        >
          em cada rim
        </Title>
        <Pill
          x={540}
          y={1600}
          text="🧺 GLOMÉRULO = uma peneira"
          color={AZUL}
          size={44}
          k={P(f, T.glomerulo, T.glomerulo + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 3. 99% volta */}
      <Faixa de={T.depois} ate={T.diuretico}>
        <Title
          f={f}
          at={T.depois + 4}
          y={170}
          size={56}
          weight={600}
          from={AZUL}
        >
          ao longo do tubo…
        </Title>
        <Numero
          at={T.noventa - 10}
          ate={T.urina}
          valor={99}
          sufixo="%"
          cor={OURO}
          y={1250}
        />
        <Pill
          x={540}
          y={1530}
          text="🔄 volta para o sangue"
          color={OURO}
          size={42}
          k={P(f, T.noventa + 20, T.noventa + 32)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1640}
          text="o que sobra vira urina"
          color={AZUL}
          size={38}
          k={P(f, T.urina, T.urina + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 4. o diurético */}
      <Faixa de={T.diuretico} ate={T.furo}>
        <Title
          f={f}
          at={T.diuretico + 4}
          y={170}
          size={66}
          font={SANS}
          weight={900}
          color={C.ink}
          from={OURO}
        >
          DIURÉTICO <span style={{ fontFamily: EMOJI }}>💊</span>
        </Title>
        <Pill
          x={540}
          y={1420}
          text="menos sal volta para o sangue"
          color={OURO}
          size={40}
          k={P(f, T.sal - 20, T.sal - 8)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1530}
          text="💧 onde vai o sal, vai a água"
          color={AZUL}
          size={40}
          k={P(f, T.agua - 10, T.agua + 2)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1640}
          text="🩺 pressão ↓"
          color={VERDE}
          size={46}
          k={P(f, T.pressao - 10, T.pressao + 2)}
          style={ESCURO}
        />
      </Faixa>
      {/* 5. furosemida */}
      <Faixa de={T.furo} ate={T.hctz}>
        <Title
          f={f}
          at={T.furo + 4}
          y={170}
          size={70}
          font={SANS}
          weight={900}
          color={C.ink}
          from={VERM}
        >
          FUROSEMIDA
        </Title>
        <Pill
          x={540}
          y={1480}
          text="📍 alça de Henle"
          color={VERM}
          size={46}
          k={P(f, T.alca, T.alca + 12)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1600}
          text="💪 o diurético mais forte"
          color={VERM}
          size={42}
          k={P(f, T.forte - 6, T.forte + 6)}
          style={ESCURO}
        />
      </Faixa>
      {/* 6. hidroclorotiazida */}
      <Faixa de={T.hctz} ate={T.espiro}>
        <Title
          f={f}
          at={T.hctz + 4}
          y={170}
          size={58}
          font={SANS}
          weight={900}
          color={C.ink}
          from={LARANJA}
        >
          HIDROCLOROTIAZIDA
        </Title>
        <Pill
          x={540}
          y={1480}
          text="📍 túbulo distal"
          color={LARANJA}
          size={46}
          k={P(f, T.distal, T.distal + 12)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1600}
          text="🩺 muito usada na pressão alta"
          color={LARANJA}
          size={40}
          k={P(f, T.controlar - 6, T.controlar + 6)}
          style={ESCURO}
        />
      </Faixa>
      {/* 7. espironolactona */}
      <Faixa de={T.espiro} ate={T.cuidado}>
        <Title
          f={f}
          at={T.espiro + 4}
          y={170}
          size={60}
          font={SANS}
          weight={900}
          color={C.ink}
          from={VERDE}
        >
          ESPIRONOLACTONA
        </Title>
        <Pill
          x={540}
          y={1420}
          text="📍 ducto coletor"
          color={VERDE}
          size={46}
          k={P(f, T.coletor, T.coletor + 12)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1530}
          text="🛡️ bloqueia a aldosterona"
          color={VERDE}
          size={40}
          k={P(f, T.aldosterona - 6, T.aldosterona + 6)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1640}
          text="🍌 poupa potássio"
          color={VERDE}
          size={42}
          k={P(f, T.potassio - 6, T.potassio + 6)}
          style={ESCURO}
        />
      </Faixa>
      {/* 8. o cuidado com o potássio */}
      <Faixa de={T.cuidado} ate={T.consulte}>
        <Title
          f={f}
          at={T.cuidado + 4}
          y={170}
          size={60}
          font={SANS}
          weight={900}
          color={C.ink}
          from={ROXO}
        >
          E O POTÁSSIO?
        </Title>
        <Card
          f={f}
          at={T.baixar - 10}
          x={110}
          y={1300}
          w={860}
          h={130}
          border={rgba(VERM, 0.6)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 30px",
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 50 }}>🔻</span>
          <span>
            furosemida e HCTZ: <b style={{ color: VERM }}>podem baixar</b>
          </span>
        </Card>
        <Card
          f={f}
          at={T.aumentar - 10}
          x={110}
          y={1460}
          w={860}
          h={130}
          border={rgba(VERDE, 0.6)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 30px",
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 50 }}>🔺</span>
          <span>
            espironolactona: <b style={{ color: VERDE }}>pode aumentar</b>
          </span>
        </Card>
        <Pill
          x={540}
          y={1680}
          text="🩸 exame de sangue em dia!"
          color={ROXO}
          size={42}
          k={P(f, T.exame, T.exame + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 9. consulte e me siga */}
      <Part from={T.consulte} to={T.final + 2} inY={100}>
        <Emoji f={f} at={T.consulte + 2} x={540} y={560} size={170}>
          👩‍⚕️
        </Emoji>
        <Title
          f={f}
          at={T.consulte + 6}
          y={700}
          size={52}
          weight={600}
          color={C.ink}
          from={AZUL}
        >
          consulte sempre um profissional de saúde
        </Title>
        <Card
          f={f}
          at={T.siga}
          x={110}
          y={900}
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
      {/* 10. tela final */}
      <Part from={T.final - 4} to={DURATION_RIM} inY={100} outDur={1}>
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
      <Audio src={staticFile("rim/narracao.mp3")} />
      <Audio
        src={staticFile("rim/musica.wav")}
        volume={(fr) => 0.07 * (1 - P(fr, DURATION_RIM - 60, DURATION_RIM))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
