import React from "react";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { OUT, SNAP, W, bornColor, bornGlow, it, mix, rgba } from "../lib";
import { ACETIL, COR } from "./config";

export const EMOJI = "'Noto Color Emoji', sans-serif";

// título centrado que nasce na cor do remédio
export const Title: React.FC<{ f: number; at: number; y: number; size?: number; weight?: number; color?: string; from?: string; font?: string; children: React.ReactNode }> = ({ f, at, y, size = 72, weight = 400, color = C.ink, from = COR, font = SERIF, children }) => {
  if (f < at - 2) return null;
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", top: y, left: 40, width: W - 80, textAlign: "center", fontFamily: font, fontSize: size, fontWeight: weight, lineHeight: 1.2, color: bornColor(f, at, color, from), textShadow: bornGlow(f, at, from), opacity: k, transform: `translateY(${(1 - k) * 30}px)`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined }}>
      {children}
    </div>
  );
};

export const Emoji: React.FC<{ f: number; at: number; x: number; y: number; size: number; children: string; float?: boolean }> = ({ f, at, x, y, size, children, float = true }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: x, top: y + (float ? Math.sin(f / 22) * 6 : 0), transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * k})`, opacity: Math.min(1, k * 1.5), fontFamily: EMOJI, fontSize: size, lineHeight: 1 }}>{children}</div>
  );
};

export const Card: React.FC<{ f: number; at: number; x: number; y: number; w: number; h: number; border?: string; tilt?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, x, y, w, h, border = C.boxBorder, tilt = 0, children, style }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, background: C.box, border: `2px solid ${border}`, boxShadow: "0 16px 44px rgba(0,0,0,.35)", opacity: Math.min(1, k * 1.3), transform: `translateY(${(1 - k) * 60}px) rotate(${tilt}deg)`, boxSizing: "border-box", fontFamily: SANS, color: C.ink, ...style }}>
      {children}
    </div>
  );
};

// comprimido de AAS
export const Tablet: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <circle r={r} fill="#f8fafc" style={{ filter: `drop-shadow(0 0 ${r * 0.25}px ${rgba(COR, 0.6)})` }} />
    <circle r={r * 0.9} fill="none" stroke="#dbe4f0" strokeWidth={r * 0.04} />
    <line x1={-r * 0.75} y1={0} x2={r * 0.75} y2={0} stroke="#cbd5e1" strokeWidth={r * 0.06} strokeLinecap="round" />
    <text y={-r * 0.22} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={r * 0.42} fill={COR}>AAS</text>
  </g>
);

// a enzima COX como uma "máquina" com engrenagens
export const Cox: React.FC<{ x: number; y: number; s?: number; f: number; off?: number; label?: string; color?: string }> = ({ x, y, s = 1, f, off = 0, label = "COX", color = "#a78bfa" }) => {
  const col = mix(color, "#475569", off);
  const spin = (f / 3) * (1 - off);
  const gear = (gx: number, gy: number, r: number, dir: number) => (
    <g transform={`translate(${gx},${gy}) rotate(${spin * dir})`}>
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-r * 0.16} y={-r * 1.25} width={r * 0.32} height={r * 0.4} rx={3} fill={col} transform={`rotate(${i * 36})`} />)}
      <circle r={r} fill={col} />
      <circle r={r * 0.4} fill="#0b1226" />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-250} y={-170} width={500} height={340} rx={70} fill={rgba(color, 0.1 * (1 - off) + 0.04)} stroke={col} strokeWidth={5} style={{ filter: `drop-shadow(0 0 ${24 * (1 - off)}px ${rgba(color, 0.5)})` }} />
      {gear(-120, 20, 52, 1)}
      {gear(-28, -55, 34, -1.5)}
      <rect x={60} y={-30} width={130} height={60} rx={14} fill="#0b1226" stroke={col} strokeWidth={4} />
      <text x={0} y={-110} textAnchor="middle" fontFamily="'Source Serif Four', serif" fontWeight={600} fontSize={58} fill={mix(C.ink, "#94a3b8", off)}>{label}</text>
    </g>
  );
};

// molécula de AAS com o grupo acetil (laranja) que vai grudar na COX
export const AasMol: React.FC<{ x: number; y: number; s?: number; acetyl?: boolean }> = ({ x, y, s = 1, acetyl = true }) => {
  const hex = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${i ? "L" : "M"}${Math.cos(a) * 36},${Math.sin(a) * 36}`; }).join(" ") + "Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={hex} fill={rgba("#0b1226", 0.7)} stroke={COR} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${COR})` }} />
      <line x1={-36} y1={0} x2={-70} y2={-20} stroke={COR} strokeWidth={6} strokeLinecap="round" />
      <circle cx={-76} cy={-24} r={10} fill={COR} />
      {acetyl && <Acetyl x={56} y={18} />}
    </g>
  );
};
export const Acetyl: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <line x1={-22} y1={-8} x2={6} y2={8} stroke={ACETIL} strokeWidth={7} strokeLinecap="round" />
    <circle cx={14} cy={12} r={16} fill={ACETIL} style={{ filter: `drop-shadow(0 0 12px ${ACETIL})` }} />
  </g>
);

export const Platelet: React.FC<{ x: number; y: number; r?: number; color?: string; o?: number }> = ({ x, y, r = 16, color = "#c084fc", o = 1 }) => (
  <g opacity={o}>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill={rgba(color, 0.55)} stroke={color} strokeWidth={2.5} />
  </g>
);
export const RedCell: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 26 }) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.55} fill="rgba(239,68,68,.75)" />
    <ellipse cx={x} cy={y} rx={r * 0.5} ry={r * 0.22} fill="rgba(127,29,29,.6)" />
  </g>
);
