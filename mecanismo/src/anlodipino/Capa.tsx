import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (1080×1920) de "O que o anlodipino faz nos seus vasos?".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const ANL = "#2dd4bf",
  AZUL = "#60a5fa",
  VERM = "#f43f5e";

export const CapaAnlodipino: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={ANL} pulses={[]} />
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
      O QUE O
      <br />
      <span
        style={{
          color: ANL,
          fontSize: 112,
          textShadow: `0 0 30px ${rgba(ANL, 0.5)}`,
        }}
      >
        ANLODIPINO
      </span>
      <br />
      FAZ NOS SEUS VASOS?
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
      💊🦶
    </div>
    <div
      style={{
        position: "absolute",
        top: 1170,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          padding: "16px 34px",
          borderRadius: 999,
          border: `4px solid ${VERM}`,
          background: rgba(VERM, 0.15),
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          color: VERM,
        }}
      >
        pressão cai 📉
      </div>
      <div
        style={{
          padding: "16px 34px",
          borderRadius: 999,
          border: `4px solid ${AZUL}`,
          background: rgba(AZUL, 0.15),
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          color: AZUL,
        }}
      >
        tornozelo incha 💧
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
      a explicação está nos <span style={{ color: ANL }}>vasinhos</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
