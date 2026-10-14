import React from "react";
import { useCurrentFrame } from "remotion";
import { IBP, TI } from "./config";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { OUT, P, Part, SNAP, W, bornColor, bornGlow, it, rgba } from "../lib";
import { Capsule } from "./shapes";

const CX = 540, CY = 470;
const STARTS: [number, number][] = [[-60, 260], [1140, -60], [1140, 1300], [-60, 1500]];
const arc = (s: [number, number], u: number) => {
  const [x0, y0] = s; const mx = (x0 + CX) / 2, my = (y0 + CY) / 2;
  const dx = CX - x0, dy = CY - y0; const cx = mx - dy * 0.35, cy = my + dx * 0.35;
  const a = 1 - u;
  return [a * a * x0 + 2 * a * u * cx + u * u * CX, a * a * y0 + 2 * a * u * cy + u * u * CY];
};

export const Part1: React.FC = () => {
  const f = useCurrentFrame();
  const tailFade = 1 - P(f, 24, 33);
  const capK = it(f, 22, 40, 0, 1, SNAP);
  const glow = Math.max(0, 1 - Math.abs(f - TI.prazol - 6) / 14);
  return (
    <Part from={0} to={302} outDur={12}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {tailFade > 0 && STARTS.map((s, i) => {
          if (f < i * 0.8) return null;
          const u = P(f, i * 0.8, 24);
          const pts = Array.from({ length: 22 }, (_, j) => arc(s, Math.max(0, u - (21 - j) * 0.018)));
          const [hx, hy] = arc(s, u);
          return (
            <g key={i} opacity={tailFade}>
              {pts.slice(1).map((p, j) => <line key={j} x1={pts[j][0]} y1={pts[j][1]} x2={p[0]} y2={p[1]} stroke={IBP.cor} strokeWidth={1 + j * 0.45} strokeLinecap="round" opacity={(j / 21) * 0.9} />)}
              <circle cx={hx} cy={hy} r={34} fill={rgba(IBP.cor, 0.35)} style={{ filter: "blur(10px)" }} />
              <circle cx={hx} cy={hy} r={9} fill="#f0fff8" />
            </g>
          );
        })}
        {f >= 22 && f <= 36 && <circle cx={CX} cy={CY} r={120 + 400 * it(f, 22, 36, 0, 1, OUT)} fill={rgba(IBP.cor, 0.25)} opacity={1 - P(f, 26, 36)} style={{ filter: "blur(30px)" }} />}
        {f >= 22 && <Capsule x={CX} y={CY} w={330 * capK} open={(1 - P(f, 22, 40)) * 120} rot={-25 + Math.sin(f / 30) * 6} />}
      </svg>
      {IBP.nomes.map((n, i) => {
        const at = TI.nomes[i];
        const k = it(f, at, at + 12, 0, 1, SNAP);
        if (f < at) return null;
        const base = n.slice(0, n.length - 6), suf = n.slice(-6);
        return (
          <div key={i} style={{ position: "absolute", top: 720 + i * 96, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 72, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * -60}px)`, color: bornColor(f, at, C.ink, IBP.cor) }}>
            {base}
            <span style={{ color: IBP.cor, fontWeight: 600, textShadow: `0 0 ${10 + 30 * glow}px ${rgba(IBP.cor, 0.3 + 0.6 * glow)}`, display: "inline-block", transform: `scale(${1 + 0.12 * glow})` }}>{suf}</span>
          </div>
        );
      })}
      {f >= TI.pergunta[0] - 6 && (
        <div style={{ position: "absolute", left: 90, top: 1150, width: 900, height: 190, borderRadius: 34, background: C.box, border: `1.5px solid ${C.boxBorder}`, boxShadow: "0 18px 50px rgba(0,0,0,.35)", opacity: it(f, TI.pergunta[0] - 6, TI.pergunta[0] + 6, 0, 1, OUT), display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px", fontFamily: SANS, fontSize: 46, lineHeight: "64px" }}>
          {IBP.pergunta.map((l, i) => {
            const at = TI.pergunta[i];
            if (f < at) return <div key={i} style={{ height: 64 }} />;
            const letters = Math.min(l.length, Math.floor((f - at) * 1.1) + 1);
            return <div key={i} style={{ color: bornColor(f, at + letters / 1.1 - 4, C.ink, IBP.cor), textShadow: bornGlow(f, at + letters / 1.1 - 4, IBP.cor) }}>{l.slice(0, letters)}{i === 1 || f < TI.pergunta[1] ? <span style={{ display: "inline-block", width: 3, height: 48, marginLeft: 4, verticalAlign: "middle", background: IBP.cor, opacity: (i === 1 ? letters < l.length : letters < l.length) ? 1 : Math.floor(f / 15) % 2 }} /> : null}</div>;
          })}
        </div>
      )}
    </Part>
  );
};
