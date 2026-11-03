import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import fala from "./fala.json";
import "../fonts";

// "Como se constrói a insulina": 5 clipes feitos pela usuária no Google Flow
// + narração dela (ElevenLabs). Aqui só a montagem: cada clipe é esticado
// (câmera lenta) até o trecho da fala; se sobrar tempo, o último quadro fica
// parado com um zoom lento. Por cima: rótulos, trilha, Me siga e tela final.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PAL = fala as [number, number, string][];

const FIM_FALA = 137.0;
const SIGA = 120;
const FINAL = 105;
export const DURATION_INSULINA_FLOW = s(FIM_FALA) + 15 + SIGA + FINAL;

const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";
const K = "sfxkit/sfx-kit-main/sounds/";

// trecho da fala -> clipe (de, ate em segundos do clipe), velocidade mínima 0,5
type Trecho = {
  de: number;
  ate: number;
  clipe: number;
  c0: number;
  c1: number;
};
const TRECHOS: Trecho[] = [
  { de: 0, ate: 25.2, clipe: 1, c0: 0, c1: 9.96 },
  { de: 25.2, ate: 39.6, clipe: 2, c0: 0, c1: 5 },
  { de: 39.6, ate: 47.2, clipe: 2, c0: 5, c1: 9.96 },
  { de: 47.2, ate: 64.0, clipe: 6, c0: 0, c1: 10 },
  { de: 64.0, ate: 70.4, clipe: 3, c0: 0, c1: 2.2 },
  { de: 70.4, ate: 89.8, clipe: 3, c0: 2.2, c1: 9.96 },
  { de: 89.8, ate: 98.6, clipe: 7, c0: 0, c1: 10 },
  { de: 98.6, ate: 108.3, clipe: 4, c0: 0, c1: 5 },
  { de: 108.3, ate: 116.0, clipe: 4, c0: 5, c1: 9.96 },
  { de: 116.0, ate: FIM_FALA + 0.5, clipe: 5, c0: 0, c1: 9.96 },
];

// o 4º valor, quando existe, é a altura do rótulo (padrão 230)
const ROTULOS: [number, number, string, number?][] = [
  [15.2, 25.2, "INSULINA = CHAVE"],
  [28.4, 39.5, "PROTEÍNA DELICADA"],
  [39.8, 47.2, "INJEÇÃO SOB A PELE"],
  [50.0, 57.2, "1921"],
  [59.3, 63.9, "MILHARES DE PÂNCREAS"],
  [64.0, 70.4, "ALERGIA"],
  [70.5, 87.1, "ANOS 70 · BACTÉRIA"],
  [87.2, 89.8, "INSULINA RECOMBINANTE"],
  [89.9, 98.6, "INSULINA COMUM", 1570],
  [116.2, 120.3, "CANETA COM CLIQUE"],
  [120.4, 124.3, "GELADEIRA: PRATELEIRA DO MEIO"],
  [124.4, 128.0, "NUNCA NA PORTA"],
  [128.1, 130.9, "PARABÉNS!"],
];

const Clipe: React.FC<{ t: Trecho }> = ({ t }) => {
  const f = useCurrentFrame();
  const dur = t.ate - t.de;
  const len = t.c1 - t.c0;
  const rate = Math.max(0.5, len / dur);
  const tocando = len / rate; // segundos de vídeo em movimento
  const parado = f >= s(tocando);
  // zoom lento o tempo todo; mais forte quando o quadro congela
  const zoom = 1 + interpolate(f, [0, s(dur)], [0, parado ? 0.1 : 0.04], clamp);
  const entra = interpolate(f, [0, 6], [0, 1], clamp);
  const video = (
    <OffthreadVideo
      src={staticFile(`insulinaFlow/c${t.clipe}.mp4`)}
      startFrom={s(t.c0)}
      playbackRate={rate}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
  return (
    <AbsoluteFill style={{ opacity: entra, transform: `scale(${zoom})` }}>
      {parado ? <Freeze frame={s(tocando) - 2}>{video}</Freeze> : video}
    </AbsoluteFill>
  );
};

const Rotulo: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const r = ROTULOS.find(([a, b]) => t >= a && t < b);
  if (!r) return null;
  const pop = interpolate(t - r[0], [0, 0.12, 0.22], [0.6, 1.08, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: r[3] ?? 230,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "VTThreeTwoThree, monospace",
          fontSize: r[2].length > 18 ? 78 : 100,
          color: VERDE,
          background: "#04120f",
          padding: "2px 24px",
          borderRadius: 10,
          textAlign: "center",
          textShadow: "0 0 18px rgba(61,255,143,.7)",
          transform: `scale(${pop})`,
        }}
      >
        {r[2]}
      </div>
    </div>
  );
};

const Moldura: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: FUNDO }}>
    <div
      style={{
        position: "absolute",
        inset: 40,
        border: `4px solid ${VERDE}`,
        borderRadius: 34,
        boxShadow:
          "0 0 40px rgba(61,255,143,.35), inset 0 0 40px rgba(61,255,143,.15)",
      }}
    />
    {children}
  </AbsoluteFill>
);

const MeSiga: React.FC = () => {
  const f = useCurrentFrame();
  const logo = interpolate(f, [0, 10, 16], [0.4, 1.08, 1], clamp);
  const t1 = interpolate(f, [8, 20], [0, 1], clamp);
  const t2 = interpolate(f, [16, 30], [0, 1], clamp);
  return (
    <Moldura>
      <Img
        src={staticFile("insulinaFlow/logo.jpg")}
        style={{
          position: "absolute",
          left: 340,
          top: 430,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `6px solid ${VERDE}`,
          boxShadow: "0 0 50px rgba(61,255,143,.5)",
          transform: `scale(${logo})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 900,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "VTThreeTwoThree, monospace",
          fontSize: 150,
          color: VERDE,
          textShadow: "0 0 24px rgba(61,255,143,.7)",
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
        }}
      >
        ME SIGA
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 120,
          right: 120,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.3,
          color: CREME,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 30}px)`,
        }}
      >
        para mais dicas de farmacologia e curiosidades sobre a área
      </div>
    </Moldura>
  );
};

const TelaFinal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Moldura>
      {["Consulte um", "profissional de saúde", "para orientações."].map(
        (l, i) => {
          const k = interpolate(f, [4 + i * 8, 18 + i * 8], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 760 + i * 110,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "Source Serif Four, serif",
                fontWeight: i === 1 ? 600 : 400,
                fontSize: i === 1 ? 90 : 78,
                color: i === 1 ? VERDE : CREME,
                opacity: k,
                transform: `translateY(${(1 - k) * 40}px)`,
              }}
            >
              {l}
            </div>
          );
        },
      )}
    </Moldura>
  );
};

// trilha: 0,22 nas pausas, 0,09 sob a voz; sobe no final sem voz
const FALANDO = (() => {
  const a = new Array(DURATION_INSULINA_FLOW + 1).fill(0);
  PAL.forEach(([ini, fim]) => {
    for (let fr = s(ini); fr < s(fim) + 6; fr++) a[fr] = 1;
  });
  return a.map((_, i) => {
    let soma = 0,
      n = 0;
    for (let j = i - 8; j <= i + 8; j++)
      if (a[j] !== undefined) {
        soma += a[j];
        n++;
      }
    return soma / n;
  });
})();
const CORTE = s(FIM_FALA) + 15;
const musica = (fr: number) =>
  0.22 -
  0.13 * (FALANDO[fr] ?? 0) +
  interpolate(fr, [CORTE, CORTE + 20], [0, 0.32], clamp);

export const VideoInsulinaFlow: React.FC = () => {
  const f = useCurrentFrame();
  const total = DURATION_INSULINA_FLOW;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {TRECHOS.map((t, i) => (
        <Sequence
          key={i}
          from={s(t.de)}
          durationInFrames={
            i === TRECHOS.length - 1 ? CORTE - s(t.de) : s(t.ate) - s(t.de)
          }
        >
          <Clipe t={t} />
        </Sequence>
      ))}
      <Sequence from={CORTE} durationInFrames={SIGA}>
        <MeSiga />
      </Sequence>
      <Sequence from={CORTE + SIGA} durationInFrames={FINAL}>
        <TelaFinal />
      </Sequence>
      <Rotulo f={f} />
      <Audio src={staticFile("insulinaFlow/narracao.mp3")} />
      <Audio
        src={staticFile("insulinaFlow/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          interpolate(fr, [0, 20], [0, 1], clamp) *
          interpolate(fr, [total - 50, total], [1, 0], clamp)
        }
      />
      {TRECHOS.slice(1).map((t, i) => (
        <Sequence key={i} from={s(t.de) - 4} durationInFrames={60}>
          <Audio
            src={staticFile(K + "whooshes/whoosh-medium-soft.wav")}
            volume={0.14}
          />
        </Sequence>
      ))}
      <Sequence from={CORTE} durationInFrames={120}>
        <Audio
          src={staticFile(K + "logo-stings/sting-bright-short.wav")}
          volume={0.5}
        />
      </Sequence>
      <Sequence from={CORTE + SIGA + 2} durationInFrames={FINAL}>
        <Audio
          src={staticFile(K + "logo-stings/sting-airy-long.wav")}
          volume={0.55}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// capa: o comprimido derretendo no estômago, título no alto e faixa embaixo
// (tudo entre y 300 e 1620, a área que o TikTok não corta)
export const CapaInsulinaFlow: React.FC = () => (
  <AbsoluteFill style={{ background: FUNDO }}>
    <Img
      src={staticFile("insulinaFlow/capa_fundo.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {["POR QUE NÃO", "EXISTE INSULINA", "EM COMPRIMIDO?"].map((l) => (
        <div
          key={l}
          style={{
            fontFamily: "VTThreeTwoThree, monospace",
            fontSize: 108,
            lineHeight: 1,
            color: VERDE,
            background: "#04120f",
            padding: "4px 24px",
            borderRadius: 10,
            textShadow: "0 0 22px rgba(61,255,143,.7)",
          }}
        >
          {l}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", top: 1470, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 58,
          color: CREME,
          background: "rgba(4,18,15,.94)",
          border: `4px solid ${VERDE}`,
          borderRadius: 26,
          padding: "16px 40px",
        }}
      >
        e como ela é feita hoje
      </div>
    </div>
  </AbsoluteFill>
);
