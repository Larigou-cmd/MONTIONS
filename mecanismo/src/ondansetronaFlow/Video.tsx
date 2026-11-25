import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import "../fonts";

// "Para que serve a ondansetrona?" (boneco de palito, estilo quadrinho do PixVerse feito no Flow Omni 1.2).
// PRÉVIA sem narração: cada clipe ocupa 7,5 s (acelerado para caber). Quando a narração dela chegar,
// os tempos de cada trecho passam a seguir as palavras.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";

const POR_CLIPE = 7.5;
const CENAS: { clipe: string; rotulo: string; top?: number }[] = [
  { clipe: "c1", rotulo: "alarme do enjoo" },
  { clipe: "c2", rotulo: "ONDANSETRONA" },
  { clipe: "c3", rotulo: "serotonina = mensageira" },
  { clipe: "c4", rotulo: "bloqueia o aviso", top: 1030 },
  { clipe: "c5", rotulo: "quimio · rádio · cirurgia" },
  { clipe: "c6", rotulo: "intestino preso\ndor de cabeça" },
  { clipe: "c7", rotulo: "coração · gravidez", top: 170 },
  { clipe: "c8", rotulo: "vendida com receita" },
];
const SIGA = s(3.2);
const FINAL = s(3.5);
const INICIO_SIGA = s(POR_CLIPE * CENAS.length);
export const DURATION_ONDANSETRONA_PREVIA = INICIO_SIGA + SIGA + FINAL;

const Rotulo: React.FC<{ texto: string; top?: number }> = ({ texto, top = 300 }) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [4, 8, 12], [0.6, 1.08, 1], clamp);
  const op = interpolate(f, [4, 7], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: "Caveat, cursive",
          fontWeight: 700,
          fontSize: texto.length > 18 ? 84 : 100,
          lineHeight: 1.0,
          color: "#5a3d8a",
          textShadow: "0 0 3px #f6f0e2, 0 0 6px #f6f0e2, 0 0 10px #f6f0e2, 0 0 16px #f6f0e2, 0 0 24px rgba(246,240,226,.85)",
          textAlign: "center",
          whiteSpace: "pre-line",
          transform: `scale(${pop})`,
          opacity: op,
        }}
      >
        {texto}
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
        boxShadow: "0 0 40px rgba(61,255,143,.35), inset 0 0 40px rgba(61,255,143,.15)",
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
        src={staticFile("metforminaOrigem/logo.jpg")}
        style={{ position: "absolute", left: 340, top: 430, width: 400, height: 400, borderRadius: "50%", border: `6px solid ${VERDE}`, boxShadow: "0 0 50px rgba(61,255,143,.5)", transform: `scale(${logo})` }}
      />
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", fontFamily: "VTThreeTwoThree, monospace", fontSize: 150, color: VERDE, textShadow: "0 0 24px rgba(61,255,143,.7)", opacity: t1, transform: `translateY(${(1 - t1) * 30}px)` }}>
        ME SIGA
      </div>
      <div style={{ position: "absolute", top: 1080, left: 120, right: 120, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 50, lineHeight: 1.3, color: CREME, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)` }}>
        para mais dicas de farmacologia e curiosidades sobre a área
      </div>
    </Moldura>
  );
};

const TelaFinal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Moldura>
      {["Consulte um", "profissional de saúde", "para orientações."].map((l, i) => {
        const k = interpolate(f, [4 + i * 8, 18 + i * 8], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", top: 760 + i * 110, left: 0, right: 0, textAlign: "center", fontFamily: "Source Serif Four, serif", fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 90 : 78, color: i === 1 ? VERDE : CREME, opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
            {l}
          </div>
        );
      })}
    </Moldura>
  );
};

export const VideoOndansetronaPrevia: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CENAS.map((c, i) => (
      <Sequence key={c.clipe} from={s(i * POR_CLIPE)} durationInFrames={s(POR_CLIPE)}>
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(`ondansetronaFlow/${c.clipe}.mp4`)} muted playbackRate={10 / POR_CLIPE} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        <Rotulo texto={c.rotulo} top={c.top} />
      </Sequence>
    ))}
    <Sequence from={INICIO_SIGA} durationInFrames={SIGA}>
      <MeSiga />
    </Sequence>
    <Sequence from={INICIO_SIGA + SIGA} durationInFrames={FINAL}>
      <TelaFinal />
    </Sequence>
  </AbsoluteFill>
);
