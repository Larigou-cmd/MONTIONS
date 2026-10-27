import React from "react";
import { AbsoluteFill, random } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";

// Capa (thumbnail vertical 1080×1920) de "Por que a fumaça de incêndio faz desmaiar?".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
const VERM = "#ef4444",
  CINZA = "#94a3b8";

export const CapaFumaca: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={CINZA} pulses={[]} />
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 22 }, (_, i) => (
        <circle
          key={i}
          cx={60 + random(`cx${i}`) * 960}
          cy={1000 + random(`cy${i}`) * 900}
          r={80 + random(`cr${i}`) * 120}
          fill={CINZA}
          opacity={0.18 + random(`co${i}`) * 0.2}
          style={{ filter: "blur(22px)" }}
        />
      ))}
    </svg>
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
      POR QUE A
      <br />
      <span style={{ fontSize: 132, color: CINZA }}>FUMAÇA</span>
      <br />
      FAZ{" "}
      <span style={{ color: VERM, textShadow: `0 0 30px ${rgba(VERM, 0.6)}` }}>
        DESMAIAR?
      </span>
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform="translate(540,1090)">
        <circle
          r={190}
          fill="#dc2626"
          style={{ filter: `drop-shadow(0 0 50px ${rgba(VERM, 0.6)})` }}
        />
        <text
          y={18}
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight={600}
          fontSize={40}
          fill="#fff"
        >
          hemoglobina
        </text>
        {[
          [0, -230],
          [262, 0],
          [0, 230],
          [-262, 0],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(1.7)`}>
            <circle
              cx={-20}
              r={30}
              fill="#334155"
              stroke={CINZA}
              strokeWidth={3}
            />
            <circle cx={20} r={28} fill={VERM} />
            <text
              y={10}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={900}
              fontSize={28}
              fill="#fff"
            >
              CO
            </text>
          </g>
        ))}
      </g>
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1420,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 64,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      um gás que gruda <span style={{ color: VERM }}>250× mais</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
