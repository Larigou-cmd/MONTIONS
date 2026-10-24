import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (thumbnail vertical 1080×1920) de "Remédio vencido vira veneno?".
const VERM = "#ef4444";

export const CapaVencido: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERM} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 190,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 110,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      REMÉDIO
      <br />
      <span
        style={{
          color: VERM,
          fontSize: 150,
          textShadow: `0 0 40px ${rgba(VERM, 0.6)}`,
        }}
      >
        VENCIDO
      </span>
      <br />
      VIRA VENENO?
    </div>
    <div
      style={{
        position: "absolute",
        top: 820,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 300,
        lineHeight: 1,
      }}
    >
      💊☠️
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1300,
        transform: "translate(-50%,-50%) rotate(-8deg)",
        border: `9px solid ${VERM}`,
        borderRadius: 16,
        padding: "8px 36px",
        fontFamily: "'Courier New', monospace",
        fontWeight: 900,
        fontSize: 84,
        color: VERM,
        background: rgba(VERM, 0.1),
        whiteSpace: "nowrap",
      }}
    >
      VAL 03/2025
    </div>
    <div
      style={{
        position: "absolute",
        top: 1560,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 64,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      a resposta <span style={{ color: VERM }}>não é tão simples</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
