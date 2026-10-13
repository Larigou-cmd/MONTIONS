import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, T, config } from "../config";
import { SANS, SERIF } from "../fonts";
import { IN, MED, OUT, P, Part, SNAP, bornColor, bornGlow, fmt, it, rgba } from "../lib";

const TOPS = [300, 640, 980];
const CH = 300;

const Pancreas: React.FC<{ f: number; at: number; gl: number }> = ({ f, at, gl }) => (
  <g>
    <path d="M20,120 C40,70 110,60 150,75 C190,90 215,70 228,90 C240,110 215,140 180,140 C140,140 120,165 80,168 C40,170 10,150 20,120Z" fill="rgba(251,191,36,.18)" stroke="#fbbf24" strokeWidth={4} />
    {[[70, 125], [120, 110], [170, 112], [95, 148]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="rgba(253,224,71,.5)" />)}
    {Array.from({ length: 12 }, (_, i) => {
      const st = at + 8 + i * 6; const k = P(f, st, st + 40);
      if (k <= 0 || k >= 1) return null;
      return <circle key={i} cx={60 + ((i * 47) % 140)} cy={110 - k * 100} r={7} fill={C.num} opacity={1 - k * 0.6} style={{ filter: `drop-shadow(0 0 5px ${C.num})` }} />;
    })}
    {Array.from({ length: 8 }, (_, i) => i < Math.round(8 - 6 * gl) && (
      <circle key={`g${i}`} cx={200 + Math.cos(i * 0.8 + f / 20) * 22} cy={190 + Math.sin(i * 0.8 + f / 20) * 22} r={5} fill="#60a5fa" />
    ))}
  </g>
);

const Stomach: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const lvl = -60 + 200 * it(f, at, at + 240, 0, 1);
  const path = "M-40,-250 L-40,-150 C-40,-90 -200,-110 -220,20 C-240,170 -90,250 40,230 C150,215 210,150 230,100 L290,120 L300,70 L240,50 C250,-60 120,-60 60,-90 C30,-110 30,-150 30,-250Z";
  return (
    <g transform="translate(118,128) scale(0.42)">
      <clipPath id="stc"><path d={path} /></clipPath>
      <g clipPath="url(#stc)">
        <path d={`M-260,${lvl} ` + Array.from({ length: 60 }, (_, i) => `L${-260 + i * 10},${lvl + Math.sin(i * 0.3 + f / 6) * 6}`).join(" ") + " L340,320 L-260,320Z"} fill="rgba(251,146,60,.45)" />
      </g>
      <path d={path} fill="none" stroke="#fdba74" strokeWidth={9} />
    </g>
  );
};

const Brain: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const h = P(f, at + 6, at + 18);
  return (
    <g transform="translate(120,125)">
      <ellipse cx={0} cy={0} rx={105} ry={78} fill="rgba(196,181,253,.1)" stroke="#c4b5fd" strokeWidth={4} />
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={Array.from({ length: 21 }, (_, j) => `${j ? "L" : "M"}${-85 + j * 8.5},${-52 + i * 24 + Math.sin(j * 0.6 + i) * 6}`).join(" ")} fill="none" stroke="rgba(196,181,253,.55)" strokeWidth={2.5} />
      ))}
      <circle cx={0} cy={40} r={14 + 3 * Math.sin(f / 4) * h} fill={MED} opacity={0.3 + 0.7 * h} style={{ filter: `drop-shadow(0 0 ${16 * h}px ${MED})` }} />
    </g>
  );
};

export const Part4: React.FC = () => {
  const f = useCurrentFrame();
  const back = it(f, T.resultados - 8, T.resultados + 6, 0, 1, IN);
  return (
    <Part from={1040} to={1556} inY={120} outDur={10}>
      {back < 1 && (
        <AbsoluteFill style={{ opacity: 1 - back * 0.9, filter: back > 0 ? `blur(${back * 14}px)` : undefined, transform: `scale(${1 - back * 0.05})` }}>
          {config.orgaos.map((o, i) => {
            const at = T.orgaos[i];
            if (f < at) return null;
            const k = it(f, at, at + 14, 0, 1, SNAP);
            const gl = P(f, T.glucagon, T.glucagon + 20);
            return (
              <div key={i} style={{ position: "absolute", left: 70, top: TOPS[i], width: 940, height: CH, borderRadius: 34, background: C.box, border: `1.5px solid ${C.boxBorder}`, boxShadow: "0 18px 50px rgba(0,0,0,.35)", opacity: Math.min(1, k * 1.3), transform: `translateY(${(1 - k) * 80}px) rotate(${[-1, 0.8, -0.5][i]}deg)`, display: "flex", alignItems: "center" }}>
                <svg width={250} height={250} style={{ marginLeft: 20, flexShrink: 0 }}>
                  {o.tipo === "pancreas" && <Pancreas f={f} at={at} gl={gl} />}
                  {o.tipo === "estomago" && <Stomach f={f} at={at} />}
                  {o.tipo === "cerebro" && <Brain f={f} at={at} />}
                </svg>
                <div style={{ marginLeft: 20 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 58, color: bornColor(f, at), textShadow: bornGlow(f, at) }}>{o.nome}</div>
                  {o.efeitos.map((e, j) => {
                    const ek = it(f, at + 10 + j * (o.tipo === "pancreas" ? T.glucagon - at - 10 : 12), at + 22 + j * (o.tipo === "pancreas" ? T.glucagon - at - 10 : 12), 0, 1, OUT);
                    const up = e.includes("↑");
                    return (
                      <div key={j} style={{ fontFamily: SANS, fontSize: 36, fontWeight: 500, color: C.ink, opacity: ek, transform: `translateX(${(1 - ek) * 20}px)`, marginTop: 8 }}>
                        {e.replace(/[↑↓]/, "")}
                        <span style={{ color: up ? "#34d399" : C.alert, fontWeight: 800 }}>{up ? "↑" : "↓"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      {f >= T.resultados && <Results f={f} />}
    </Part>
  );
};

const Results: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    {config.resultados.map((r, i) => {
      const [a, b] = T.numeros[i];
      const top = i === 0 ? 300 : 800;
      const ek = it(f, a - 18, a - 4, 0, 1, OUT);
      const v = r.valor * it(f, a, b, 0, 1, OUT);
      const pulse = Math.max(0, 1 - Math.abs(f - b - 6) / 6) * 0.07;
      const bar = it(f, a, b, 0, 1, OUT);
      return (
        <div key={i} style={{ position: "absolute", left: 70, top, width: 940, height: 440, opacity: ek, transform: `translateY(${(1 - ek) * 50}px)` }}>
          <div style={{ fontFamily: SANS, fontSize: 44, fontWeight: 700, color: C.ink }}>{r.rotulo}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 190, lineHeight: "220px", color: r.cor, transform: `scale(${1 + pulse})`, transformOrigin: "left center", textShadow: `0 0 40px ${rgba(r.cor, 0.35)}`, whiteSpace: "nowrap" }}>
            −{fmt(v, r.casas)}<span style={{ fontSize: 80 }}>{r.unidade}</span>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 30, color: C.dim, fontWeight: 500 }}>{r.fonte}</div>
          <div style={{ position: "absolute", right: 0, top: 10, width: 70, height: 380, borderRadius: 18, background: "rgba(255,255,255,.06)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: 380 * bar, borderRadius: 18, background: r.cor, boxShadow: `0 0 30px ${rgba(r.cor, 0.5)}` }} />
            <div style={{ position: "absolute", left: 0, bottom: -44, width: 70, textAlign: "center", fontFamily: SANS, fontSize: 34, color: r.cor, fontWeight: 800 }}>↓</div>
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);
