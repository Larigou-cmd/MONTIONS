import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (thumbnail vertical 1080×1920) do vídeo "Tosse que não passa? Pode ser o seu remédio".
// Mesmo visual do vídeo: fundo escuro com brilho azul, caixa de remédio sem marca e tesoura ECA.
const COR = "#38bdf8";
const VERM = "#ef4444";

export const CapaTosse2: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    {/* faixa do topo */}
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
        REMÉDIO DE PRESSÃO × TOSSE SECA
      </span>
    </div>
    {/* título */}
    <div
      style={{
        position: "absolute",
        top: 260,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 132,
        lineHeight: 1.0,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      TOSSE QUE
      <br />
      NÃO PASSA?
    </div>
    {/* rosto tossindo + ondas */}
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform="translate(330,900)">
        <text
          x={0}
          y={80}
          textAnchor="middle"
          fontFamily={EMOJI}
          fontSize={300}
        >
          😣
        </text>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${175 + i * 52},-110 q34,70 0,140`}
            fill="none"
            stroke={C.ink}
            strokeWidth={12}
            strokeLinecap="round"
            opacity={1 - i * 0.25}
          />
        ))}
      </g>
      {/* caixa de remédio sem marca, com brilho */}
      <g transform="translate(790,930) rotate(6) scale(0.95)">
        <rect
          x={-200}
          y={-150}
          width={400}
          height={300}
          rx={22}
          fill="#f8fafc"
          stroke={COR}
          strokeWidth={8}
          style={{ filter: `drop-shadow(0 0 40px ${COR})` }}
        />
        <rect x={-200} y={-150} width={400} height={70} rx={22} fill={COR} />
        <rect x={-200} y={-100} width={400} height={20} fill={COR} />
        <text
          x={0}
          y={-104}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={32}
          fill="#0f172a"
        >
          REMÉDIO DE PRESSÃO
        </text>
        <text
          x={0}
          y={-10}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={700}
          fontSize={34}
          fill="#334155"
        >
          comprimidos
        </text>
        <text
          x={0}
          y={40}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={600}
          fontSize={28}
          fill="#64748b"
        >
          uso oral • 30 unidades
        </text>
        <rect
          x={-150}
          y={80}
          width={300}
          height={36}
          rx={18}
          fill={rgba(COR, 0.25)}
        />
      </g>
      {/* lupa sobre a caixa */}
      <text
        x={930}
        y={800}
        textAnchor="middle"
        fontFamily={EMOJI}
        fontSize={130}
      >
        🔍
      </text>
    </svg>
    {/* chamada */}
    <div
      style={{
        position: "absolute",
        top: 1170,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 84,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      Pode ser o seu
      <br />
      <span style={{ color: COR, textShadow: `0 0 30px ${rgba(COR, 0.5)}` }}>
        remédio de pressão
      </span>{" "}
      <span style={{ fontFamily: EMOJI }}>💊</span>
    </div>
    {/* nomes */}
    <div
      style={{
        position: "absolute",
        top: 1420,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 18,
      }}
    >
      {["ENALAPRIL", "CAPTOPRIL", "LISINOPRIL"].map((t) => (
        <span
          key={t}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: 2,
            color: C.ink,
            padding: "14px 22px",
            borderRadius: 18,
            border: `2px solid ${rgba(VERM, 0.7)}`,
            background: rgba(VERM, 0.14),
          }}
        >
          {t}
        </span>
      ))}
    </div>
    <Grain />
  </AbsoluteFill>
);
