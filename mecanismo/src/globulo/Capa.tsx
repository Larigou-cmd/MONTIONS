import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";

// Capa (thumbnail vertical 1080×1920) de "Seu glóbulo vermelho vive só 120 dias".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const VERM = "#ef4444";

export const CapaGlobulo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERM} pulses={[]} />
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
      SEU GLÓBULO
      <br />
      VERMELHO VIVE SÓ
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="capaHem" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset="0.55" stopColor="#dc2626" />
          <stop offset="1" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      <g transform="translate(540,960)">
        <circle r={300} fill="url(#capaHem)" style={{ filter: `drop-shadow(0 0 80px ${rgba(VERM, 0.6)})` }} />
        <circle r={150} fill="rgba(255,190,190,0.25)" />
      </g>
    </svg>
    <div
      style={{
        position: "absolute",
        top: 960,
        width: W,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        color: "#fff",
        textShadow: "0 6px 30px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ fontSize: 230, lineHeight: 0.95 }}>120</div>
      <div style={{ fontSize: 76 }}>DIAS</div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 1330,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 62,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      e o fim dele acontece
      <br />
      no <span style={{ color: VERM }}>baço</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
