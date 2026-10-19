import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (thumbnail vertical 1080×1920) do vídeo "Por que alguns remédios devem ser tomados em jejum?".
const COR = "#fbbf24";
const VERDE = "#4ade80";
const VERM = "#ef4444";

export const CapaJejum: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 170,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 112,
        lineHeight: 1.02,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      VOCÊ TOMA
      <br />
      REMÉDIO
      <br />
      ASSIM?
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <text
        x={330}
        y={930}
        textAnchor="middle"
        fontFamily={EMOJI}
        fontSize={260}
      >
        ☕
      </text>
      <text
        x={540}
        y={880}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={120}
        fill={C.dim}
      >
        +
      </text>
      <g transform="translate(770,840) rotate(-20) scale(1.35)">
        <rect x={-90} y={-38} width={180} height={76} rx={38} fill={COR} />
        <rect x={0} y={-38} width={90} height={76} rx={38} fill="#fef3c7" />
        <rect x={0} y={-38} width={40} height={76} fill="#fef3c7" />
        <rect
          x={-70}
          y={-26}
          width={60}
          height={12}
          rx={6}
          fill="#ffffff"
          opacity={0.45}
        />
      </g>
      {/* bateria pela metade */}
      <rect
        x={240}
        y={1020}
        width={560}
        height={120}
        rx={22}
        fill="none"
        stroke={C.ink}
        strokeWidth={8}
      />
      <rect x={806} y={1055} width={26} height={50} rx={8} fill={C.ink} />
      <rect
        x={256}
        y={1036}
        width={264}
        height={88}
        rx={14}
        fill={COR}
        style={{ filter: `drop-shadow(0 0 16px ${COR})` }}
      />
      <text
        x={520}
        y={1104}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={60}
        fill="#ffffff"
        stroke="#0f172a"
        strokeWidth={8}
        paintOrder="stroke"
      >
        50%
      </text>
      <text
        x={900}
        y={720}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={120}
        fill={VERM}
        style={{ filter: `drop-shadow(0 0 18px ${VERM})` }}
      >
        ✕
      </text>
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1200,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 70,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      Por que alguns remédios
      <br />
      são tomados em{" "}
      <span
        style={{ color: VERDE, textShadow: `0 0 26px ${rgba(VERDE, 0.5)}` }}
      >
        JEJUM
      </span>
      ?
    </div>
    <div
      style={{
        position: "absolute",
        top: 1420,
        width: W,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 38,
          color: C.ink,
          padding: "14px 30px",
          borderRadius: 40,
          border: `2px solid ${rgba(VERDE, 0.7)}`,
          background: rgba(VERDE, 0.14),
        }}
      >
        <span style={{ fontFamily: EMOJI }}>⏰</span> 30–60 min ANTES de comer
      </span>
    </div>
    <Grain />
  </AbsoluteFill>
);
