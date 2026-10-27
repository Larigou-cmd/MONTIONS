import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (1080×1920) de "Por que o antialérgico dá sono?".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const ROXO = "#a78bfa",
  VERDE = "#4ade80";

export const CapaAntialergico: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={ROXO} pulses={[]} />
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
      POR QUE O
      <br />
      <span
        style={{
          color: ROXO,
          fontSize: 104,
          textShadow: `0 0 30px ${rgba(ROXO, 0.5)}`,
        }}
      >
        ANTIALÉRGICO
      </span>
      <br />
      DÁ SONO?
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
      💊🥱
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
          border: `4px solid ${ROXO}`,
          background: rgba(ROXO, 0.15),
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          color: ROXO,
        }}
      >
        1ª geração 😴
      </div>
      <div
        style={{
          padding: "16px 34px",
          borderRadius: 999,
          border: `4px solid ${VERDE}`,
          background: rgba(VERDE, 0.15),
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          color: VERDE,
        }}
      >
        2ª geração 😊
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
      a resposta está no <span style={{ color: ROXO }}>cérebro</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
