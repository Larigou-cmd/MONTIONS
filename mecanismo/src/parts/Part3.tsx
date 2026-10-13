import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T, config } from "../config";
import { SANS } from "../fonts";
import { Check, MED, OUT, P, Part, SNAP, W, bornColor, bornGlow, it, rgba } from "../lib";
import { Membrane, Receptor } from "./Part2";

const XS = config.alvos.length > 1 ? [290, 790] : [540];
const CARD_Y = [560, 790, 1020];
const CARD_H = 150;

export const Part3: React.FC = () => {
  const f = useCurrentFrame();
  const steps = config.cascata.slice(0, 3);
  const finalPulse = Math.max(0, 1 - Math.abs(f - (T.passos[2] + 10)) / 10);
  return (
    <Part from={826} to={1046} inScale={1.4} outDur={10} outY={-140}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {/* vista de dentro: membrana no alto, receptores acesos */}
        <g transform="translate(0,-540)">
          <Membrane y={MY_IN} f={f} />
          {XS.map((x, i) => (
            <Receptor key={i} x={x} y={MY_IN - 10} color={config.alvos[i].cor} on={0.85 + 0.15 * Math.sin(f / 6 + i)} />
          ))}
        </g>
        {/* setas entre os passos */}
        {steps.map((_, i) => {
          if (i === 0) {
            const k = it(f, T.passos[0] - 14, T.passos[0], 0, 1, OUT);
            return <line key={i} x1={540} y1={490} x2={540} y2={490 + (CARD_Y[0] - 490) * k} stroke={MED} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-f} opacity={k} />;
          }
          const y0 = CARD_Y[i - 1] + CARD_H, y1 = CARD_Y[i];
          const k = it(f, T.passos[i] - 12, T.passos[i], 0, 1, OUT);
          return (
            <g key={i} opacity={k}>
              <line x1={540} y1={y0} x2={540} y2={y0 + (y1 - y0 - 8) * k} stroke={MED} strokeWidth={4} strokeLinecap="round" />
              <path d={`M528,${y0 + (y1 - y0 - 8) * k - 10} L540,${y0 + (y1 - y0 - 8) * k + 4} L552,${y0 + (y1 - y0 - 8) * k - 10}`} fill="none" stroke={MED} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {/* mensageiro se espalhando */}
        {f >= T.passos[1] && Array.from({ length: 18 }, (_, j) => {
          const ph = (((f - T.passos[1]) / 40 + j / 18) % 1);
          const a = (j / 18) * Math.PI * 2 + j;
          const r = 120 + ph * 380;
          return <circle key={j} cx={540 + Math.cos(a) * r} cy={CARD_Y[1] + 75 + Math.sin(a) * r * 0.5} r={7} fill={C.num} opacity={(1 - ph) * 0.8 * P(f, T.passos[1], T.passos[1] + 8)} style={{ filter: `drop-shadow(0 0 6px ${C.num})` }} />;
        })}
        {/* fios de luz para os órgãos */}
        {f >= T.passos[2] + 14 && [-1, 0, 1].map((d, i) => {
          const k = it(f, T.passos[2] + 14 + i * 3, T.passos[2] + 34 + i * 3, 0, 1, OUT);
          const y0 = CARD_Y[2] + CARD_H, y1 = 1300;
          return <path key={i} d={`M540,${y0} Q${540 + d * 60},${(y0 + y1) / 2} ${540 + d * 330},${y1}`} fill="none" stroke={MED} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} style={{ filter: `drop-shadow(0 0 8px ${MED})` }} />;
        })}
      </svg>
      {steps.map((s, i) => {
        const at = T.passos[i];
        const k = it(f, at, at + 14, 0, 1, SNAP);
        if (f < at) return null;
        const isMsg = s.includes("↑");
        const glow = i === 2 ? finalPulse : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 110, top: CARD_Y[i], width: 860, height: CARD_H, borderRadius: 30, background: C.box, border: `1.5px solid ${i === 2 ? rgba(MED, 0.4 + 0.5 * glow) : C.boxBorder}`, boxShadow: `0 16px 40px rgba(0,0,0,.35), 0 0 ${40 * glow}px ${rgba(MED, 0.5 * glow)}`, opacity: Math.min(1, k * 1.3), transform: `translateX(${(1 - k) * -80}px) rotate(${[-1, 0.8, -0.5][i] * (1 - Math.min(1, k)) + [-0.6, 0.4, -0.3][i]}deg)`, display: "flex", alignItems: "center", gap: 30, padding: "0 40px", fontFamily: SANS }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: rgba(MED, 0.18), border: `2px solid ${MED}`, color: MED, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {i === 2 ? <Check size={70} /> : i + 1}
            </div>
            <div style={{ fontWeight: 500, fontSize: 50, color: bornColor(f, at), textShadow: bornGlow(f, at) }}>
              {isMsg ? (
                <span style={{ padding: "6px 22px", borderRadius: 999, background: rgba(C.num, 0.15 + 0.1 * Math.sin(f / 5)), border: `2px solid ${C.num}`, color: C.num, fontWeight: 700 }}>{s}</span>
              ) : s}
            </div>
          </div>
        );
      })}
    </Part>
  );
};

const MY_IN = 900;
