import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { Caixa } from "./Video";

// Capa (thumbnail vertical 1080×1920) do vídeo da metformina.
// Os 20% de baixo ficam livres: o TikTok cobre essa faixa com o contador de visualizações.
const COR = "#2dd4bf";
const VERM = "#ef4444";

export const CapaMetformina: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 150,
        width: W,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 4,
          color: COR,
          padding: "12px 30px",
          borderRadius: 40,
          border: `2px solid ${rgba(COR, 0.6)}`,
          background: rgba("#0f172a", 0.6),
        }}
      >
        COMEÇOU A TOMAR… E SENTIU…?
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 250,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.02,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      COMEÇOU A TOMAR
      <br />
      <span style={{ color: COR }}>METFORMINA?</span>
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <Caixa x={400} y={800} s={0.95} rot={-6} />
      <text
        x={860}
        y={800}
        textAnchor="middle"
        fontFamily={EMOJI}
        fontSize={190}
      >
        🚽
      </text>
      <text
        x={780}
        y={660}
        textAnchor="middle"
        fontFamily={EMOJI}
        fontSize={110}
      >
        ⚡
      </text>
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1050,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 78,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      …e começou a{" "}
      <span style={{ color: VERM, textShadow: `0 0 26px ${rgba(VERM, 0.5)}` }}>
        diarreia
      </span>
      ?
    </div>
    <div
      style={{
        position: "absolute",
        top: 1250,
        width: W,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 40,
          color: C.ink,
          padding: "16px 32px",
          borderRadius: 40,
          border: `2px solid ${rgba(COR, 0.7)}`,
          background: rgba(COR, 0.14),
        }}
      >
        Por que acontece e <span style={{ color: COR }}>o que ajuda</span>
      </span>
    </div>
    <Grain />
  </AbsoluteFill>
);
