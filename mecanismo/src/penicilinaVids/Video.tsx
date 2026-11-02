import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import fala from "./fala.json";
import "../fonts";

// Vídeo da penicilina feito no Google Vids, com o final trocado:
// corta antes do "salvo ou imune?" e entra o Me siga com o logo, a tela final
// e uma trilha retrô por baixo de tudo (mais baixa sob a voz).
const FPS = 30;
const CORTE = 2692; // 89,73 s: troca de cena depois de "remédio de verdade."
const SIGA = 120;
const FINAL = 105;
export const DURATION_PENICILINA_VIDS = CORTE + SIGA + FINAL;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";
const K = "sfxkit/sfx-kit-main/sounds/";

const FALANDO = (() => {
  const a = new Array(DURATION_PENICILINA_VIDS + 1).fill(0);
  (fala as [number, number, string][]).forEach(([ini, fim]) => {
    for (let fr = Math.round(ini * FPS); fr < Math.round(fim * FPS) + 6; fr++)
      if (fr < CORTE) a[fr] = 1;
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
// no final, sem voz, a trilha sobe para o fim não ficar mais baixo que o resto
const musica = (fr: number) =>
  0.22 -
  0.13 * (FALANDO[fr] ?? 0) +
  interpolate(fr, [CORTE, CORTE + 20], [0, 0.2], clamp);

const Moldura: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: FUNDO }}>
    <div
      style={{
        position: "absolute",
        inset: 40,
        border: `4px solid ${VERDE}`,
        borderRadius: 34,
        boxShadow: `0 0 40px rgba(61,255,143,.35), inset 0 0 40px rgba(61,255,143,.15)`,
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
        src={staticFile("penicilinaVids/logo.jpg")}
        style={{
          position: "absolute",
          left: 340,
          top: 430,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `6px solid ${VERDE}`,
          boxShadow: `0 0 50px rgba(61,255,143,.5)`,
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

export const VideoPenicilinaVids: React.FC = () => {
  const total = DURATION_PENICILINA_VIDS;
  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <Sequence durationInFrames={CORTE}>
        <OffthreadVideo
          src={staticFile("penicilinaVids/base.mp4")}
          volume={(fr) => interpolate(fr, [CORTE - 12, CORTE], [1, 0], clamp)}
        />
      </Sequence>
      <Sequence from={CORTE} durationInFrames={SIGA}>
        <MeSiga />
      </Sequence>
      <Sequence from={CORTE + SIGA} durationInFrames={FINAL}>
        <TelaFinal />
      </Sequence>
      <Audio
        src={staticFile("penicilinaVids/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          interpolate(fr, [0, 20], [0, 1], clamp) *
          interpolate(fr, [total - 50, total], [1, 0], clamp)
        }
      />
      <Sequence from={CORTE} durationInFrames={60}>
        <Audio
          src={staticFile(K + "whooshes/whoosh-medium-soft.wav")}
          volume={0.3}
        />
      </Sequence>
      <Sequence from={CORTE + 6} durationInFrames={120}>
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

// capa: o Fleming com a placa de mofo, título no alto e faixa embaixo
// (tudo entre y 300 e 1620, a área que o TikTok não corta)
export const CapaPenicilinaVids: React.FC = () => (
  <AbsoluteFill style={{ background: FUNDO }}>
    <Img
      src={staticFile("penicilinaVids/capa_fundo.png")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "translateY(-40px) scale(1.12)",
        transformOrigin: "50% 0%",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1600,
        bottom: 0,
        background: `linear-gradient(rgba(4,18,15,0), ${FUNDO} 18%)`,
      }}
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
        gap: 14,
      }}
    >
      {["O MOFO QUE", "SALVOU A", "HUMANIDADE"].map((l) => (
        <div
          key={l}
          style={{
            fontFamily: "VTThreeTwoThree, monospace",
            fontSize: 112,
            lineHeight: 1,
            color: VERDE,
            background: "#000",
            padding: "4px 26px",
            textShadow: "0 0 22px rgba(61,255,143,.7)",
          }}
        >
          {l}
        </div>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        top: 1500,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 62,
          color: CREME,
          background: "rgba(4,18,15,.94)",
          border: `4px solid ${VERDE}`,
          borderRadius: 26,
          padding: "16px 40px",
        }}
      >
        1928 · a história da penicilina
      </div>
    </div>
  </AbsoluteFill>
);
