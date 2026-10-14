import React from "react";
import { IBP } from "./config";
import { mix, rgba } from "../lib";

// cápsula de remédio (duas metades)
export const Capsule: React.FC<{ x: number; y: number; w: number; open?: number; rot?: number }> = ({ x, y, w, open = 0, rot = 0 }) => {
  const h = w * 0.42, half = w / 2;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <g transform={`translate(${-open},0)`}>
        <path d={`M0,${-h / 2} L${-half + h / 2},${-h / 2} A${h / 2},${h / 2} 0 0 0 ${-half + h / 2},${h / 2} L0,${h / 2} Z`} fill={IBP.cor} style={{ filter: `drop-shadow(0 0 ${w * 0.08}px ${rgba(IBP.cor, 0.6)})` }} />
      </g>
      <g transform={`translate(${open},0)`}>
        <path d={`M0,${-h / 2} L${half - h / 2},${-h / 2} A${h / 2},${h / 2} 0 0 1 ${half - h / 2},${h / 2} L0,${h / 2} Z`} fill="#e8f7f0" />
      </g>
      <rect x={-half + h * 0.35} y={-h * 0.32} width={w * 0.55} height={h * 0.12} rx={h * 0.06} fill="rgba(255,255,255,.45)" />
    </g>
  );
};

// bomba de prótons (H+/K+-ATPase) atravessando a membrana
export const Pump: React.FC<{ x: number; y: number; on: number; locked: number; s?: number }> = ({ x, y, on, locked, s = 1 }) => {
  const col = mix("#3b4a6b", IBP.bomba, on * (1 - 0.6 * locked));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-48} y={-75} width={96} height={150} rx={34} fill={col} style={{ filter: `drop-shadow(0 0 ${6 + 22 * on * (1 - locked)}px ${rgba(IBP.bomba, 0.5 * on * (1 - locked))})` }} />
      <rect x={-9} y={-75} width={18} height={150} rx={9} fill="#0b1226" opacity={0.85} />
      {locked > 0 && <Lock x={0} y={-6} k={locked} />}
    </g>
  );
};

export const Lock: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x},${y}) scale(${0.4 + 0.6 * k})`} opacity={Math.min(1, k * 1.5)}>
    <path d="M-15,-6 L-15,-18 A15,15 0 0 1 15,-18 L15,-6" fill="none" stroke="#f5f0ff" strokeWidth={6} strokeLinecap="round" />
    <rect x={-24} y={-8} width={48} height={40} rx={9} fill={IBP.cor} stroke="#f5f0ff" strokeWidth={3} style={{ filter: `drop-shadow(0 0 10px ${IBP.cor})` }} />
    <circle cx={0} cy={10} r={5} fill="#0b1226" />
  </g>
);

export const Ion: React.FC<{ x: number; y: number; o?: number; r?: number }> = ({ x, y, o = 1, r = 20 }) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <circle r={r} fill={IBP.acido} style={{ filter: `drop-shadow(0 0 8px ${IBP.acido})` }} />
    <text y={r * 0.36} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={r * 0.95} fill="#fff">H⁺</text>
  </g>
);

// molécula do prazol (dois anéis); inativa = cinza, ativa = verde brilhante
export const Drug: React.FC<{ x: number; y: number; active: number; s?: number }> = ({ x, y, active, s = 1 }) => {
  const col = mix("#7c8aa8", IBP.cor, active);
  const hex = (cx: number) => Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${i ? "L" : "M"}${cx + Math.cos(a) * 16},${Math.sin(a) * 16}`;
  }).join(" ") + "Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ filter: active > 0.1 ? `drop-shadow(0 0 ${14 * active}px ${IBP.cor})` : undefined }}>
      <path d={hex(-14)} fill={rgba("#0b1226", 0.6)} stroke={col} strokeWidth={4} strokeLinejoin="round" />
      <path d={hex(14)} fill={rgba("#0b1226", 0.6)} stroke={col} strokeWidth={4} strokeLinejoin="round" />
      <line x1={30} y1={0} x2={46} y2={-10} stroke={col} strokeWidth={4} strokeLinecap="round" />
      <circle cx={50} cy={-12} r={6} fill={col} />
    </g>
  );
};

export const STOMACH = "M-40,-250 L-40,-150 C-40,-90 -200,-110 -220,20 C-240,170 -90,250 40,230 C150,215 210,150 230,100 L290,120 L300,70 L240,50 C250,-60 120,-60 60,-90 C30,-110 30,-150 30,-250Z";

export const Cup: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x},${y})`}>
    {[-18, 0, 18].map((dx, i) => (
      <path key={i} d={`M${dx},-58 C${dx + 10},-72 ${dx - 10},-84 ${dx},-98`} fill="none" stroke="#cfc7c0" strokeWidth={4} strokeLinecap="round" opacity={0.4 + 0.3 * Math.sin(f / 8 + i)} />
    ))}
    <path d="M-44,-44 L44,-44 L36,30 Q34,44 20,44 L-20,44 Q-34,44 -36,30 Z" fill="rgba(253,186,116,.18)" stroke="#fdba74" strokeWidth={5} strokeLinejoin="round" />
    <path d="M44,-24 Q72,-22 66,4 Q60,22 38,18" fill="none" stroke="#fdba74" strokeWidth={5} strokeLinecap="round" />
  </g>
);
