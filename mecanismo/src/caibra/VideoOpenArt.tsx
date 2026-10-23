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
import { SANS } from "../fonts";
import {
  Background,
  Grain,
  OUT,
  P,
  Pill,
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Title } from "../aas/ui";
import {
  AMAR,
  COR,
  DURATION_CAIBRA,
  S6,
  S8,
  S9,
  SFX_CAIBRA,
  T,
  VERDE,
  VERM,
} from "./Video";

// "Por que dá cãibra de madrugada?" — versão com clipes 3D do OpenArt (Kling 3.0, public/caibra/clips) e a mesma narração.
// Cada trecho da fala mostra um clipe, esticado em câmera lenta até caber no tempo; textos por cima no estilo do Modelo 1.
// [arquivo, início no clipe (s), fim no clipe (s), de, até] — startFrom conta em quadros de 30 qps
const CLIPES: [string, number, number, number, number][] = [
  ["c1_zoom.mp4", 0, 2.4, 0, T.acontece + 6],
  ["c1_zoom.mp4", 2.4, 5.0, T.acontece, T.culpado + 6],
  ["c2_nervo.mp4", 0, 5.0, T.culpado, T.nervo + 92],
  ["c3_sarcomero.mp4", 0, 5.0, T.nervo + 86, T.madrugada + 6],
  ["c4_cama.mp4", 0, 5.0, T.madrugada, T.truque + 6],
  ["c5_alonga.mp4", 0, 5.0, T.truque, T.magnesio + 6],
  ["c6_volta.mp4", 0, 5.0, T.sempre, T.siga + 6],
];

// fundo escuro nas pílulas para ler bem por cima do vídeo
const FUNDO: React.CSSProperties = { background: "rgba(5,8,20,0.88)" };

const Clipe: React.FC<{
  src: string;
  a: number;
  b: number;
  de: number;
  ate: number;
}> = ({ src, a, b, de, ate }) => {
  const f = useCurrentFrame();
  if (f < de || f >= ate) return null;
  const dur = ate - de;
  const rate = ((b - a) * 30) / dur;
  const op = Math.min(
    it(f, de, de + 8, 0, 1, OUT),
    1 - it(f, ate - 8, ate, 0, 1, OUT),
  );
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Sequence from={de} durationInFrames={dur}>
        <OffthreadVideo
          src={staticFile(`caibra/clips/${src}`)}
          startFrom={Math.round(a * 30)}
          playbackRate={rate}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
      {/* escurece em cima e embaixo para os textos */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(rgba(5,8,20,0.75), rgba(5,8,20,0) 28%, rgba(5,8,20,0) 62%, rgba(5,8,20,0.85))",
        }}
      />
    </AbsoluteFill>
  );
};

const Faixa: React.FC<{
  f: number;
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ f, de, ate, children }) => {
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

export const VideoCaibraOpenArt: React.FC = () => {
  const f = useCurrentFrame();
  const fimMinerais = T.nervo + 92;
  return (
    <AbsoluteFill>
      <Background
        color={f >= T.magnesio && f < T.sempre ? AMAR : COR}
        pulses={[T.previne, T.final]}
      />
      {CLIPES.map(([src, a, b, de, ate], i) => (
        <Clipe key={i} src={src} a={a} b={b} de={de} ate={ate} />
      ))}

      {/* 1. gancho */}
      <Faixa f={f} de={0} ate={T.acontece}>
        <div
          style={{
            position: "absolute",
            top: 170,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 70,
            color: C.ink,
            textShadow: `0 0 26px ${rgba(COR, 0.7)}`,
          }}
        >
          <span style={{ fontFamily: EMOJI }}>🌙</span> 03:00
        </div>
        <Title
          f={f}
          at={T.caibra}
          y={1380}
          size={140}
          font={SANS}
          weight={900}
          color={C.ink}
          from={VERM}
        >
          CÃIBRA
        </Title>
        <Pill
          x={540}
          y={1600}
          text="+ da metade dos adultos já teve"
          color={COR}
          size={40}
          k={P(f, T.metade, T.metade + 12)}
          style={FUNDO}
        />
      </Faixa>
      {/* 2. o músculo trava */}
      <Faixa f={f} de={T.acontece} ate={T.culpado}>
        <Title
          f={f}
          at={T.acontece + 4}
          y={190}
          size={58}
          weight={600}
          from={VERM}
        >
          dentro da panturrilha
        </Title>
        <Pill
          x={540}
          y={1500}
          text="o músculo contrai sozinho"
          color={VERM}
          size={42}
          k={P(f, T.contrai, T.contrai + 12)}
          style={FUNDO}
        />
        <Pill
          x={540}
          y={1600}
          text="🔒 e não solta"
          color={VERM}
          size={42}
          k={P(f, T.solta, T.solta + 12)}
          style={FUNDO}
        />
      </Faixa>
      {/* 3. o nervo agitado */}
      <Faixa f={f} de={T.culpado} ate={fimMinerais}>
        <Card
          f={f}
          at={T.culpado + 4}
          x={140}
          y={170}
          w={800}
          h={110}
          border={rgba(AMAR, 0.5)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          <span style={{ position: "relative" }}>
            só falta de minerais?
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "52%",
                height: 6,
                width: `${P(f, T.minerais + 10, T.minerais + 24) * 100}%`,
                background: VERM,
                borderRadius: 3,
              }}
            />
          </span>
        </Card>
        <Pill
          x={540}
          y={1520}
          text="⚡ o nervo motor fica agitado"
          color={AMAR}
          size={42}
          k={P(f, T.nervo, T.nervo + 12)}
          style={FUNDO}
        />
      </Faixa>
      <Faixa f={f} de={fimMinerais - 6} ate={T.madrugada}>
        <Title
          f={f}
          at={fimMinerais}
          y={190}
          size={54}
          weight={600}
          from={AMAR}
        >
          dispara sinais sem parar
        </Title>
        <Pill
          x={540}
          y={1560}
          text="o cálcio inunda a fibra → ela trava"
          color={COR}
          size={38}
          k={P(f, fimMinerais + 10, fimMinerais + 22)}
          style={FUNDO}
        />
      </Faixa>
      {/* 4. por que de madrugada */}
      <Faixa f={f} de={T.madrugada} ate={T.truque}>
        <Title
          f={f}
          at={T.madrugada + 4}
          y={190}
          size={62}
          weight={600}
          from={COR}
        >
          por que de madrugada?
        </Title>
        <Pill
          x={540}
          y={1170}
          text="👇 pé esticado = panturrilha encurtada"
          color={COR}
          size={34}
          k={P(f, T.pe, T.pe + 12)}
          style={FUNDO}
        />
        {[
          [T.cansaco, "😮‍💨", "cansaço do dia"],
          [T.agua, "💧", "pouca água"],
          [T.remedios, "💊", "alguns remédios"],
        ].map(([at, ic, tx], i) => (
          <Card
            key={i}
            f={f}
            at={at as number}
            x={190}
            y={1260 + i * 120}
            w={700}
            h={100}
            border={rgba(AMAR, 0.5)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 30px",
            }}
          >
            <span style={{ fontFamily: EMOJI, fontSize: 50 }}>{ic}</span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: bornColor(f, at as number, C.ink, AMAR),
              }}
            >
              {tx}
            </span>
          </Card>
        ))}
      </Faixa>
      {/* 5. o truque */}
      <Faixa f={f} de={T.truque} ate={T.magnesio}>
        <Title
          f={f}
          at={T.truque + 4}
          y={190}
          size={58}
          weight={600}
          from={VERDE}
        >
          o truque na hora da dor
        </Title>
        <Pill
          x={540}
          y={1440}
          text="puxe a ponta do pé na sua direção"
          color={VERDE}
          size={40}
          k={P(f, T.puxar, T.puxar + 12)}
          style={FUNDO}
        />
        <Pill
          x={540}
          y={1540}
          text="🟢 sensor do tendão"
          color={VERDE}
          size={40}
          k={P(f, T.sensor, T.sensor + 12)}
          style={FUNDO}
        />
        <Title
          f={f}
          at={T.relaxar}
          y={1610}
          size={70}
          font={SANS}
          weight={900}
          color={VERDE}
          from={VERDE}
        >
          RELAXA ✓
        </Title>
      </Faixa>
      {/* 6. o magnésio (animação em código) */}
      <S6 />
      {/* 7. procure ajuda */}
      <Faixa f={f} de={T.sempre} ate={T.siga}>
        <Title
          f={f}
          at={T.sempre + 4}
          y={190}
          size={60}
          weight={600}
          from={COR}
        >
          acontece sempre?
        </Title>
        <Card
          f={f}
          at={T.profissional - 4}
          x={140}
          y={1300}
          w={800}
          h={300}
          border={rgba(COR, 0.6)}
          style={{
            padding: "26px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 800, color: COR }}>
            <span style={{ fontFamily: EMOJI }}>👩‍⚕️</span> procure um
            profissional
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              opacity: P(f, T.lista, T.lista + 10),
            }}
          >
            <span style={{ fontFamily: EMOJI }}>📋</span> leve a lista dos seus
            remédios
          </span>
        </Card>
      </Faixa>
      <S8 />
      <S9 />
      <Grain />
      <Audio src={staticFile("caibra/narracao.mp3")} />
      <Audio
        src={staticFile("caibra/musica.wav")}
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_CAIBRA - 60, DURATION_CAIBRA))
        }
      />
      {SFX_CAIBRA.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
