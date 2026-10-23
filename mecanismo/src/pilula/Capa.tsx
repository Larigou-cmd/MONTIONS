import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { COR, Comprimido } from "./Video";

// Capa (thumbnail vertical 1080×1920) do vídeo "Você sabe como a pílula do dia seguinte funciona?".
const VERM = "#ef4444";

export const CapaPilula: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 180,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 104,
        lineHeight: 1.04,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      PÍLULA DO
      <br />
      <span style={{ color: COR }}>DIA SEGUINTE</span>
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <Comprimido x={540} y={860} r={190} />
      <text
        x={800}
        y={760}
        textAnchor="middle"
        fontFamily={SERIF}
        fontWeight={700}
        fontSize={300}
        fill={C.ink}
        style={{ filter: `drop-shadow(0 0 24px ${COR})` }}
      >
        ?
      </text>
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1150,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 72,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      Como ela{" "}
      <span style={{ color: COR, textShadow: `0 0 26px ${rgba(COR, 0.5)}` }}>
        realmente
      </span>
      <br />
      funciona?
    </div>
    <div
      style={{
        position: "absolute",
        top: 1380,
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
          padding: "14px 32px",
          borderRadius: 40,
          border: `2px solid ${rgba(VERM, 0.7)}`,
          background: rgba(VERM, 0.14),
        }}
      >
        <span style={{ fontFamily: EMOJI }}>❌</span> 3 mitos que muita gente
        acredita
      </span>
    </div>
    <Grain />
  </AbsoluteFill>
);
