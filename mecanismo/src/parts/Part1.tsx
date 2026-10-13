import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T, config } from "../config";
import { SANS, SERIF } from "../fonts";
import { Beads, MED, OUT, P, Part, W, bornColor, bornGlow, it, rgba } from "../lib";

const CX = 540, CY = 760;
const STARTS: [number, number][] = [[-60, 300], [1140, -60], [1140, 1500], [-60, 1700]];

// ponto do arco (todos curvando para o mesmo lado)
const arc = (s: [number, number], u: number) => {
  const [x0, y0] = s; const mx = (x0 + CX) / 2, my = (y0 + CY) / 2;
  const dx = CX - x0, dy = CY - y0; const cx = mx - dy * 0.35, cy = my + dx * 0.35;
  const a = 1 - u;
  return [a * a * x0 + 2 * a * u * cx + u * u * CX, a * a * y0 + 2 * a * u * cy + u * u * CY];
};

export const Part1: React.FC = () => {
  const f = useCurrentFrame();
  const tailFade = 1 - P(f, 24, 33);
  // molécula: monta no centro e depois sobe
  const mk = P(f, 22, 40);
  const up = it(f, 40, 58, 0, 1);
  const molY = CY + (420 - CY) * up, molS = 1 - 0.32 * up;
  const nameK = it(f, 44, 58, 0, 1, OUT);
  const typed = (i: number) => f >= T.pergunta[i];
  const words = config.pergunta.split(" ");
  const boxK = it(f, 150, 166, 0, 1, OUT);
  const lastWord = T.pergunta[words.length - 1] + 10;
  return (
    <Part from={0} to={244} outDur={12}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {/* riscos de luz */}
        {tailFade > 0 && STARTS.map((s, i) => {
          const u = P(f, i * 0.8, 24);
          if (f < i * 0.8) return null;
          const pts = Array.from({ length: 22 }, (_, j) => arc(s, Math.max(0, u - (21 - j) * 0.018)));
          const [hx, hy] = arc(s, u);
          return (
            <g key={i} opacity={tailFade}>
              {pts.slice(1).map((p, j) => (
                <line key={j} x1={pts[j][0]} y1={pts[j][1]} x2={p[0]} y2={p[1]} stroke={MED} strokeWidth={1 + j * 0.45} strokeLinecap="round" opacity={(j / 21) * 0.9} />
              ))}
              <circle cx={hx} cy={hy} r={34} fill={rgba(MED, 0.35)} style={{ filter: "blur(10px)" }} />
              <circle cx={hx} cy={hy} r={9} fill="#f5f0ff" />
            </g>
          );
        })}
        {/* clarão */}
        {f >= 22 && f <= 36 && (
          <circle cx={CX} cy={CY} r={120 + 400 * it(f, 22, 36, 0, 1, OUT)} fill="url(#flash)" opacity={1 - P(f, 26, 36)} />
        )}
        <defs>
          <radialGradient id="flash">
            <stop offset="0%" stopColor="#fbf8ff" stopOpacity={0.9} />
            <stop offset="45%" stopColor={MED} stopOpacity={0.45} />
            <stop offset="100%" stopColor={MED} stopOpacity={0} />
          </radialGradient>
        </defs>
        {f >= 22 && (
          <g transform={`translate(${CX},${molY}) scale(${molS})`}>
            <Beads n={config.aminoacidos} len={860} k={mk} phase={f / 18} />
          </g>
        )}
      </svg>
      {/* nome */}
      <div style={{ position: "absolute", top: 590, left: 0, width: W, height: 150, overflow: "hidden" }}>
        <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 132, lineHeight: "150px", color: bornColor(f, 50, C.ink, MED, 18), textShadow: bornGlow(f, 50, MED, 18), transform: `translateY(${(1 - nameK) * 150}px)`, filter: nameK < 1 ? `blur(${(1 - nameK) * 8}px)` : undefined }}>
          {config.medicamento}
        </div>
      </div>
      <div style={{ position: "absolute", top: 752, width: W, textAlign: "center", fontFamily: SANS, fontSize: 34, color: C.dim, opacity: it(f, 56, 68, 0, 1, OUT) }}>{config.nomeComercial}</div>
      {config.classe.map((l, i) => {
        const k = it(f, 64 + i * 6, 78 + i * 6, 0, 1, OUT);
        return (
          <div key={i} style={{ position: "absolute", top: 820 + i * 50, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 38, color: MED, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>{l}</div>
        );
      })}
      {/* pergunta digitada */}
      {boxK > 0 && (
        <div style={{ position: "absolute", left: 90, top: 1000, width: 900, height: 124, borderRadius: 34, background: C.box, border: `1.5px solid ${C.boxBorder}`, boxShadow: "0 18px 50px rgba(0,0,0,.35)", opacity: boxK, transform: `translateY(${(1 - boxK) * 46}px)`, display: "flex", alignItems: "center", padding: "0 38px", fontFamily: SANS, fontSize: 46, color: C.ink }}>
          {words.map((w, i) => {
            if (!typed(i)) return null;
            const at = T.pergunta[i];
            const letters = Math.min(w.length, Math.floor((f - at) * (22 / 30)) + 1);
            return (
              <span key={i} style={{ color: bornColor(f, at), textShadow: bornGlow(f, at), whiteSpace: "pre" }}>{w.slice(0, letters) + (i < words.length - 1 ? " " : "")}</span>
            );
          })}
          <span style={{ display: "inline-block", width: 3, height: 50, marginLeft: 4, background: MED, opacity: f < lastWord ? 1 : Math.floor(f / 15) % 2 }} />
        </div>
      )}
    </Part>
  );
};
