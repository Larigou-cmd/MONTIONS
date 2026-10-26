import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (1080×1920) de "Por que bebida alcoólica faz fazer tanto xixi?".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const AMBAR = "#fbbf24",
  AZUL = "#60a5fa";

export const CapaAlcool: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={AMBAR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 330,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 88,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      POR QUE A
      <br />
      <span
        style={{
          color: AMBAR,
          fontSize: 124,
          textShadow: `0 0 30px ${rgba(AMBAR, 0.5)}`,
        }}
      >
        CERVEJA
      </span>
      <br />
      DÁ TANTO XIXI?
    </div>
    <div
      style={{
        position: "absolute",
        top: 820,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 250,
        lineHeight: 1,
      }}
    >
      🍺➡️🚽
    </div>
    <div
      style={{
        position: "absolute",
        top: 1180,
        width: W,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "18px 40px",
          borderRadius: 999,
          border: `4px solid ${AZUL}`,
          background: rgba(AZUL, 0.15),
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 64,
          color: AZUL,
        }}
      >
        ADH ↓
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 1360,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 60,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      o álcool desliga um <span style={{ color: AMBAR }}>hormônio</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
