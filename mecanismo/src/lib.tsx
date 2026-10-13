import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { C, CAPTIONS, PARTS, PULSES, DURATION, config } from "./config";
import { SANS, SERIF } from "./fonts";

export const W = 1080;
export const H = 1920;

export const EASE = Easing.bezier(0.45, 0, 0.2, 1);
export const OUT = Easing.out(Easing.cubic);
export const IN = Easing.in(Easing.cubic);
export const SNAP = Easing.out(Easing.back(1.6));
export const SNAP2 = Easing.out(Easing.back(2.2));
export const LIN = (x: number) => x;

export const it = (f: number, a: number, b: number, v0: number, v1: number, e: (x: number) => number = EASE) =>
  interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const P = (f: number, a: number, b: number) => it(f, a, b, 0, 1, LIN);
// sobe em linha reta até o pico e desce igual
export const tri = (f: number, peak: number, half: number) => Math.max(0, 1 - Math.abs(f - peak) / half);

export const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, k: number) => {
  const x = hexToRgb(a), y = hexToRgb(b), t = Math.max(0, Math.min(1, k));
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
};
export const rgba = (h: string, a: number) => `rgba(${hexToRgb(h).join(",")},${a})`;

export const MED = config.corMedicamento;

// ---------- fundo: brilho, poeira e grão ----------
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = PULSES.reduce((s, p) => Math.max(s, tri(f, p, 15)), 0);
  const force = 0.35 + 0.05 * Math.sin((f / 240) * Math.PI * 2) + 0.18 * pulse;
  const rh = 700 + 60 * Math.sin((f / 330) * Math.PI * 2) + 140 * pulse;
  const [r, g, b] = hexToRgb(MED);
  const stops = Array.from({ length: 11 }, (_, i) => {
    const d = i / 10;
    return `rgba(${r},${g},${b},${(force * Math.pow(1 - d, 1.9)).toFixed(4)}) ${d * 100}%`;
  }).join(",");
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 1300px 1100px at 50% 38%, ${C.bg2} 0%, rgba(7,11,26,0) 70%)` }}
      />
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 1100px ${rh}px at 50% ${H + 120}px, ${stops})` }}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 70 }, (_, i) => {
          const x0 = random(`x${i}`) * W, y0 = random(`y${i}`) * H;
          const sp = 0.25 + random(`s${i}`) * 0.6, r0 = 1 + random(`r${i}`) * 2.4;
          const y = (((y0 - f * sp) % H) + H) % H;
          const x = x0 + Math.sin(f / 40 + i) * 10;
          return <circle key={i} cx={x} cy={y} r={r0} fill="rgb(170,185,255)" opacity={0.1 + 0.08 * Math.sin(f / 25 + i)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.22, pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 1.08" />
        </filter>
        <rect width={W} height={H} filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- topo (progresso e parte) e legendas ----------
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  PARTS.forEach((p, i) => { if (f >= p.from) idx = i; });
  const p = PARTS[idx];
  const k = it(f, p.from, p.from + 14, 0, 1, OUT);
  const endFade = 1 - P(f, 1712, 1724);
  return (
    <AbsoluteFill style={{ opacity: endFade }}>
      <div style={{ position: "absolute", left: 70, top: 130, width: W - 140, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", left: 70, top: 130, width: (W - 140) * Math.min(1, f / DURATION), height: 6, borderRadius: 3, background: MED }} />
      <div style={{ position: "absolute", left: 70, top: 168, display: "flex", gap: 14, alignItems: "baseline", opacity: k, transform: `translateY(${(1 - k) * 12}px)`, fontFamily: SANS }}>
        <span style={{ color: MED, fontWeight: 800, fontSize: 32 }}>{p.n}</span>
        <span style={{ color: C.dim, fontWeight: 700, fontSize: 28, letterSpacing: 2 }}>{p.nome}</span>
      </div>
      <div style={{ position: "absolute", left: 70, top: 214, width: 70 * k, height: 4, background: MED, borderRadius: 2 }} />
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPTIONS.find(([a, b]) => f >= a && f < b + 10);
  if (!c) return null;
  const [a, b, s] = c;
  const k = Math.min(it(f, a, a + 7, 0, 1, OUT), 1 - it(f, b, b + 10, 0, 1, IN));
  return (
    <div style={{ position: "absolute", top: 1330, left: 0, width: W, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
      <div style={{ maxWidth: 820, padding: "16px 30px", borderRadius: 22, background: "rgba(5,8,20,0.8)", color: C.ink, fontFamily: SANS, fontWeight: 600, fontSize: 44, lineHeight: "58px", textAlign: "center" }}>
        {s}
      </div>
    </div>
  );
};

// ---------- peças ----------
// texto que nasce na cor do medicamento e esfria para o creme
export const bornColor = (f: number, at: number, to: string = C.ink, from: string = MED, dur = 16) => mix(from, to, P(f, at, at + dur));
export const bornGlow = (f: number, at: number, from: string = MED, dur = 16) => {
  const k = 1 - P(f, at, at + dur);
  return k > 0 ? `0 0 ${24 * k}px ${rgba(from, 0.8 * k)}` : "none";
};

export const Pill: React.FC<{ x: number; y: number; text: string; color: string; size: number; k: number; style?: React.CSSProperties }> = ({ x, y, text, color, size, k, style }) => {
  if (k <= 0) return null;
  const sc = 0.7 + 0.3 * SNAP(Math.min(1, k));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: Math.min(1, k * 1.4), padding: `${size * 0.42}px ${size * 0.75}px`, borderRadius: 999, border: `2.5px solid ${color}`, background: rgba(color, 0.15), color, fontFamily: SANS, fontWeight: 700, fontSize: size, whiteSpace: "nowrap", boxShadow: `0 0 ${18 * k}px ${rgba(color, 0.25)}`, ...style }}>
      {text}
    </div>
  );
};

// texto centrado num ponto
export const Txt: React.FC<{ x: number; y: number; children: React.ReactNode; size: number; color?: string; weight?: number; font?: string; style?: React.CSSProperties; align?: "center" | "left" }> = ({ x, y, children, size, color = C.ink, weight = 600, font = SANS, style, align = "center" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: align === "center" ? "translate(-50%,-50%)" : "translate(0,-50%)", fontFamily: font, fontSize: size, fontWeight: weight, color, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

// molécula: colar de contas em onda
export const beadPoints = (n: number, len: number, amp: number, phase: number) =>
  Array.from({ length: n }, (_, i) => {
    const u = n === 1 ? 0 : i / (n - 1);
    return [-len / 2 + u * len, Math.sin(u * Math.PI * 3 + phase) * amp] as [number, number];
  });

export const beadColor = (i: number, n: number) => {
  const [a, b] = config.alvos.length > 1 ? [config.alvos[0].cor, config.alvos[1].cor] : [config.alvos[0].cor, MED];
  const u = i / Math.max(1, n - 1);
  return u < 0.5 ? mix(a, MED, u * 2) : mix(MED, b, (u - 0.5) * 2);
};

export const Beads: React.FC<{ n: number; len: number; k?: number; phase: number; r?: number; amp?: number; tail?: number }> = ({ n, len, k = 1, phase, r = 11, amp = 34, tail = 0 }) => {
  const pts = beadPoints(n, len, amp, phase);
  const shown = k * n;
  const vis = pts.filter((_, i) => shown - i > 0);
  const mid = Math.floor(n / 2);
  const tailPts: string[] = [];
  if (tail > 0) {
    const [x0, y0] = pts[mid];
    const m = 10 * tail;
    tailPts.push(`${x0},${y0}`);
    for (let s = 1; s <= Math.floor(m); s++) tailPts.push(`${x0 + (s % 2 ? 14 : -14) * (r / 11)},${y0 + s * 17 * (r / 11)}`);
  }
  return (
    <g>
      {tail > 0 && <polyline points={tailPts.join(" ")} fill="none" stroke="#fcd34d" strokeWidth={5 * (r / 11)} strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(252,211,77,.7))" }} />}
      <polyline points={vis.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={rgba(MED, 0.45)} strokeWidth={4 * (r / 11)} />
      {pts.map(([x, y], i) => {
        const lk = Math.max(0, Math.min(1, shown - i));
        if (lk <= 0) return null;
        const col = beadColor(i, n);
        return <circle key={i} cx={x} cy={y} r={r * SNAP(lk)} fill={col} style={{ filter: `drop-shadow(0 0 ${r * 0.8}px ${col})` }} />;
      })}
    </g>
  );
};

// ponta da cauda (para a albumina se encaixar)
export const tailTip = (n: number, len: number, amp: number, phase: number, r = 11) => {
  const [x0, y0] = beadPoints(n, len, amp, phase)[Math.floor(n / 2)];
  return [x0, y0 + 10 * 17 * (r / 11)];
};

export const Check: React.FC<{ size: number; color?: string }> = ({ size, color = MED }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="20" fill={color} />
    <path d="M11,20.5 L17.5,27 L29,14" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// casca de cada parte: entra e sai sem corte seco
export const Part: React.FC<{ from: number; to: number; inDur?: number; outDur?: number; inY?: number; outY?: number; outScale?: number; inScale?: number; children: React.ReactNode }> = ({ from, to, inDur = 12, outDur = 10, inY = 0, outY = -160, outScale = 1, inScale = 1, children }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const ki = from === 0 ? 1 : it(f, from, from + inDur, 0, 1, OUT);
  const ko = it(f, to - outDur, to, 0, 1, IN);
  const op = Math.min(ki, 1 - ko);
  const y = (1 - ki) * inY + ko * outY;
  const sc = (1 - (1 - ki)) * 1 + (1 - ki) * inScale + ko * (outScale - 1);
  const blur = (1 - ki) * 12 + ko * 14;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translateY(${y}px) scale(${sc})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const fmt = (v: number, casas: number) => v.toFixed(casas).replace(".", ",");
export const SerifFont = SERIF;
