import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (1080×1920) de "Descongestionante nasal vicia?".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const AZUL = "#60a5fa",
  VERM = "#ef4444";

export const CapaNasal: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={AZUL} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 330,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 82,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      <span style={{ color: AZUL, textShadow: `0 0 30px ${rgba(AZUL, 0.5)}` }}>
        DESCONGESTIONANTE
      </span>
      <br />
      NASAL
      <br />
      <span
        style={{
          fontSize: 130,
          color: VERM,
          textShadow: `0 0 30px ${rgba(VERM, 0.5)}`,
        }}
      >
        VICIA?
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 830,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 260,
        lineHeight: 1,
      }}
    >
      👃💧
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1240,
        transform: "translate(-50%,-50%) rotate(-7deg)",
        border: `9px solid ${VERM}`,
        borderRadius: 16,
        padding: "8px 38px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 92,
        letterSpacing: 6,
        color: VERM,
        background: rgba(VERM, 0.1),
      }}
    >
      REBOTE
    </div>
    <div
      style={{
        position: "absolute",
        top: 1400,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 60,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      o nariz <span style={{ color: AZUL }}>se acostuma</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
