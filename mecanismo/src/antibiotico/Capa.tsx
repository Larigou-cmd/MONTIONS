import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (1080×1920) de "Antibiótico: por que não pode parar quando melhora?".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const AZUL = "#60a5fa",
  VERM = "#ef4444",
  VERDE = "#4ade80";

export const CapaAntibiotico: React.FC = () => (
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
        fontSize: 92,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      MELHOROU,
      <br />
      <span style={{ color: AZUL, textShadow: `0 0 30px ${rgba(AZUL, 0.5)}` }}>
        PODE PARAR O
        <br />
        ANTIBIÓTICO?
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 720,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 250,
        lineHeight: 1,
      }}
    >
      💊🦠
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1150,
        transform: "translate(-50%,-50%) rotate(-6deg)",
        border: `9px solid ${VERM}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 58,
        letterSpacing: 3,
        color: VERM,
        background: rgba(VERM, 0.1),
        whiteSpace: "nowrap",
      }}
    >
      A RESPOSTA SURPREENDE
    </div>
    <div
      style={{
        position: "absolute",
        top: 1330,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 60,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      melhorar <span style={{ color: VERM }}>≠</span>{" "}
      <span style={{ color: VERDE }}>curar</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
