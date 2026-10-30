import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { rgba } from "../lib";

// Capa horizontal do YouTube (1280×720) — "7 remédios que não combinam".
const EMOJI = "'Noto Color Emoji','Segoe UI Emoji',sans-serif";
const VERM = "#ef4444",
  AMBAR = "#fbbf24",
  AZUL = "#60a5fa";

const Pilula: React.FC<{ txt: string; cor: string; rot: number }> = ({
  txt,
  cor,
  rot,
}) => (
  <div
    style={{
      padding: "16px 34px",
      borderRadius: 999,
      border: `4px solid ${cor}`,
      background: rgba(cor, 0.16),
      color: cor,
      fontWeight: 900,
      fontSize: 36,
      whiteSpace: "nowrap",
      transform: `rotate(${rot}deg)`,
      boxShadow: `0 0 30px ${rgba(cor, 0.35)}`,
    }}
  >
    {txt}
  </div>
);

export const CapaInteracoes: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: SANS }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 900px 600px at 25% 35%, ${C.bg2} 0%, rgba(7,11,26,0) 70%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 700px 500px at 80% 50%, ${rgba(VERM, 0.25)} 0%, rgba(7,11,26,0) 70%)`,
      }}
    />

    {/* número grande + título */}
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 40,
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 300,
        lineHeight: 1,
        color: AMBAR,
        textShadow: `0 0 50px ${rgba(AMBAR, 0.5)}`,
      }}
    >
      7
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 345,
        fontWeight: 900,
        fontSize: 80,
        lineHeight: 1.02,
        color: C.ink,
      }}
    >
      REMÉDIOS QUE
      <br />
      <span style={{ color: VERM, textShadow: `0 0 30px ${rgba(VERM, 0.5)}` }}>
        NÃO COMBINAM
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 62,
        top: 545,
        fontWeight: 700,
        fontSize: 34,
        lineHeight: 1.3,
        color: C.dim,
      }}
    >
      e o que fazer em cada caso
    </div>

    {/* duas pílulas se chocando */}
    <div
      style={{
        position: "absolute",
        left: 760,
        top: 110,
        width: 480,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 130,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      💊⚡💊
    </div>
    <div
      style={{
        position: "absolute",
        left: 760,
        top: 330,
        width: 480,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
      }}
    >
      <Pilula txt="corta o efeito ✂️" cor={AZUL} rot={-3} />
      <Pilula txt="soma o perigo ⚠️" cor={VERM} rot={2} />
    </div>
  </AbsoluteFill>
);
