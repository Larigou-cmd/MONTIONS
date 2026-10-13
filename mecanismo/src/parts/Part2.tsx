import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, T, config } from "../config";
import { SANS, SERIF } from "../fonts";
import { Beads, IN, MED, OUT, P, Part, Pill, SNAP, Txt, W, bornColor, bornGlow, it, mix, rgba, tailTip } from "../lib";

const MY = 1000; // membrana
const XS = config.alvos.length > 1 ? [290, 790] : [540];

export const Membrane: React.FC<{ y: number; f: number }> = ({ y, f }) => (
  <g>
    {[0, 1].map((row) =>
      Array.from({ length: 43 }, (_, i) => {
        const x = i * 26;
        const yy = y + row * 46 + Math.sin(x * 0.01 + f / 30) * 4;
        const d = row ? -1 : 1;
        return (
          <g key={`${row}-${i}`}>
            <line x1={x - 3} y1={yy + 11 * d} x2={x - 3} y2={yy + 24 * d} stroke="#2a3d66" strokeWidth={3} />
            <line x1={x + 3} y1={yy + 11 * d} x2={x + 3} y2={yy + 24 * d} stroke="#2a3d66" strokeWidth={3} />
            <circle cx={x} cy={yy} r={11} fill={row ? "#334a7a" : "#3f5a92"} />
          </g>
        );
      })
    )}
  </g>
);

export const Receptor: React.FC<{ x: number; y: number; color: string; on: number }> = ({ x, y, color, on }) => {
  const fill = mix("#334155", color, 0.35 + 0.65 * on);
  const glow = `drop-shadow(0 0 ${8 + 26 * on}px ${rgba(color, 0.35 + 0.45 * on)})`;
  return (
    <g style={{ filter: glow }}>
      <rect x={x - 70} y={y - 90} width={40} height={190} rx={18} fill={fill} />
      <rect x={x + 30} y={y - 90} width={40} height={190} rx={18} fill={fill} />
      <rect x={x - 70} y={y + 60} width={140} height={40} rx={18} fill={fill} />
    </g>
  );
};

const intestine = Array.from({ length: 161 }, (_, i) => {
  const u = i / 160;
  return [140 + u * 800, 600 + Math.sin(u * Math.PI * 4) * 140];
});
const intestineD = intestine.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

export const Part2: React.FC = () => {
  const f = useCurrentFrame();
  // sub-cenas: A (intestino), B (membrana), C (molécula e albumina)
  const aOut = it(f, 395, 415, 0, 1, IN);
  const bIn = it(f, 400, 422, 0, 1, OUT);
  const bOut = it(f, 650, 666, 0, 1, IN);
  const cIn = it(f, 654, 672, 0, 1, OUT);
  return (
    <Part from={236} to={834} inY={90} outY={0} outScale={1.2} outDur={12}>
      {/* A: o intestino libera os hormônios */}
      {aOut < 1 && (
        <AbsoluteFill style={{ opacity: 1 - aOut, transform: `translateY(${-520 * aOut}px)`, filter: aOut > 0 ? `blur(${aOut * 12}px)` : undefined }}>
          <svg width={W} height={1920} style={{ position: "absolute" }}>
            <path d={intestineD} fill="none" stroke="rgba(244,114,182,.33)" strokeWidth={80} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - it(f, 236, 272, 0, 1, OUT)} />
            <path d={intestineD} fill="none" stroke="#f472b6" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - it(f, 236, 272, 0, 1, OUT)} />
            {Array.from({ length: 6 }, (_, i) => {
              const u = (f - 262) * 0.006 + i * 0.09;
              if (f < 262 || u < 0 || u > 1) return null;
              const [x, y] = intestine[Math.floor(u * 160)];
              return <circle key={i} cx={x} cy={y} r={14} fill="#fb923c" style={{ filter: "drop-shadow(0 0 6px #fb923c)" }} />;
            })}
            {Array.from({ length: 16 }, (_, i) => {
              const isA = i % 2 === 0;
              const st = (isA ? T.gip : T.glp) - 34 + Math.floor(i / 2) * 3;
              const k = it(f, st, st + 34, 0, 1);
              if (f < st) return null;
              const src = intestine[20 + ((i * 37) % 120)];
              const tx = (XS[isA ? 0 : XS.length - 1]) + ((i * 53) % 120) - 60, ty = 960 + ((i * 29) % 40);
              const x = src[0] + (tx - src[0]) * k, y = src[1] + (ty - src[1]) * k - Math.sin(k * Math.PI) * 90;
              const col = config.alvos[isA ? 0 : config.alvos.length - 1].cor;
              return <circle key={i} cx={x} cy={y} r={14} fill={col} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />;
            })}
          </svg>
          <Txt x={540} y={350} size={56} font={SERIF} color="#f9a8d4" style={{ opacity: it(f, 244, 258, 0, 1, OUT) }}>Intestino</Txt>
          {config.alvos.map((a, i) => (
            <Pill key={i} x={XS[i]} y={1060} text={a.hormonio} color={a.cor} size={50} k={it(f, i === 0 ? T.gip : T.glp, (i === 0 ? T.gip : T.glp) + 12, 0, 1, LINEAR)} />
          ))}
          <Txt x={540} y={1190} size={40} color={C.dim} weight={500} style={{ opacity: it(f, T.glp + 10, T.glp + 24, 0, 1, OUT) }}>hormônios naturais</Txt>
        </AbsoluteFill>
      )}

      {/* B: a membrana, os receptores e o encaixe */}
      {bIn > 0 && bOut < 1 && (
        <AbsoluteFill style={{ opacity: Math.min(bIn, 1 - bOut), transform: `translateY(${(1 - bIn) * 520}px) scale(${1 + bOut * 0.5})`, transformOrigin: "540px 700px", filter: bIn < 1 || bOut > 0 ? `blur(${(1 - bIn) * 12 + bOut * 14}px)` : undefined }}>
          <svg width={W} height={1920} style={{ position: "absolute" }}>
            <Membrane y={MY} f={f} />
            {XS.map((x, i) => {
              const rk = it(f, T.receptores + i * 8, T.receptores + i * 8 + 14, 0, 1, SNAP);
              const on = P(f, T.encaixe[i] + 2, T.encaixe[i] + 14);
              return (
                <g key={i} opacity={Math.min(1, rk * 1.5)} transform={`translate(0,${(1 - rk) * 160})`}>
                  <Receptor x={x} y={MY - 10} color={config.alvos[i].cor} on={on} />
                </g>
              );
            })}
            {XS.map((x, i) => {
              const at = T.encaixe[i];
              if (f < at - 40) return null;
              const dk = it(f, at - 40, at, 0, 1);
              const sx = x + (i ? 130 : -130), sy = 470;
              const kx = sx + (x - sx) * dk, ky = sy + (MY - 110 - sy) * dk;
              const ring = P(f, at, at + 16);
              return (
                <g key={i}>
                  <g transform={`translate(${kx},${ky}) rotate(${(1 - dk) * 35 * (i ? -1 : 1)})`}>
                    <Beads n={13} len={150} phase={f / 9} r={6.5} amp={18} />
                  </g>
                  {f >= at && ring < 1 && <circle cx={x} cy={MY - 100} r={40 + 160 * ring} fill="none" stroke={config.alvos[i].cor} strokeWidth={3} opacity={1 - ring} />}
                </g>
              );
            })}
          </svg>
          <Txt x={70} y={600} size={32} color={C.dim} weight={600} align="left" style={{ opacity: it(f, 410, 425, 0, 1, OUT) }}>Meio extracelular</Txt>
          <Txt x={70} y={1260} size={32} color={C.dim} weight={600} align="left" style={{ opacity: it(f, 416, 431, 0, 1, OUT) }}>Interior da célula</Txt>
          {config.alvos.map((a, i) => (
            <Pill key={i} x={XS[i]} y={1170} text={a.receptor} color={a.cor} size={32} k={it(f, T.receptores + 10 + i * 8, T.receptores + 22 + i * 8, 0, 1, LINEAR)} />
          ))}
          <Pill x={540} y={330} text={config.medicamento} color={MED} size={46} k={it(f, 519, 531, 0, 1, LINEAR)} />
          <div style={{ position: "absolute", top: 400, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 54, color: bornColor(f, T.chaveFechadura), textShadow: bornGlow(f, T.chaveFechadura), opacity: it(f, T.chaveFechadura, T.chaveFechadura + 12, 0, 1, OUT), transform: `translateY(${(1 - it(f, T.chaveFechadura, T.chaveFechadura + 12, 0, 1, OUT)) * 24}px)` }}>
            uma chave · {config.alvos.length > 1 ? "duas fechaduras" : "uma fechadura"}
          </div>
        </AbsoluteFill>
      )}

      {/* C: a molécula, a cauda e a albumina */}
      {cIn > 0 && <MoleculeScene f={f} k={cIn} />}
    </Part>
  );
};

const LINEAR = (x: number) => x;

const MoleculeScene: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const cy = 520, phase = f / 18;
  const tail = config.temAlbumina ? P(f, T.cauda, T.cauda + 24) : 0;
  const [tx, ty] = tailTip(config.aminoacidos, 860, 34, phase);
  const ak = it(f, T.albumina - 22, T.albumina, 0, 1, OUT);
  const ax = 540 + tx + (1 - ak) * 600, ay = cy + ty + 110 + (1 - ak) * 300;
  const hk = it(f, T.semana - 6, T.semana + 8, 0, 1, OUT);
  const days = ["D", "S", "T", "Q", "Q", "S", "S"];
  return (
    <AbsoluteFill style={{ opacity: k, transform: `scale(${0.8 + 0.2 * k})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {config.temAlbumina && ak > 0 && (
          <g opacity={Math.min(1, ak * 1.4)}>
            <defs>
              <radialGradient id="alb" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.08} />
              </radialGradient>
            </defs>
            <path
              d={Array.from({ length: 64 }, (_, i) => {
                const a = (i / 64) * Math.PI * 2;
                const r = 125 + Math.sin(a * 3 + f / 30) * 9 + Math.sin(a * 5 - f / 45) * 5;
                return `${i ? "L" : "M"}${ax + Math.cos(a) * r * 1.3},${ay + Math.sin(a) * r * 0.75}`;
              }).join(" ") + "Z"}
              fill="url(#alb)" stroke="#7dd3fc" strokeWidth={3}
            />
          </g>
        )}
        <g transform={`translate(540,${cy})`}>
          <Beads n={config.aminoacidos} len={860} phase={phase} tail={tail} />
        </g>
      </svg>
      <Txt x={540} y={330} size={50} font={SERIF} style={{ opacity: it(f, 664, 678, 0, 1, OUT) }}>{config.molecula.split(" + ")[0]}</Txt>
      {tail > 0 && <Txt x={540 + tx - 50} y={cy + 110} size={32} color="#fcd34d" weight={700} align="left" style={{ transform: "translate(-100%,-50%)", opacity: P(f, T.cauda + 8, T.cauda + 20) }}>ácido graxo</Txt>}
      {ak > 0.6 && <Txt x={ax} y={ay + 10} size={40} color="#7dd3fc" weight={700} style={{ opacity: P(f, T.albumina, T.albumina + 10) }}>Albumina</Txt>}
      {hk > 0 && (
        <>
          <div style={{ position: "absolute", left: 60, top: 1010, width: 420, height: 150, borderRadius: 24, border: `2px solid ${MED}`, background: rgba(MED, 0.12), opacity: hk, transform: `translateY(${(1 - hk) * 40}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
            <div style={{ fontSize: 30, color: C.dim, fontWeight: 600 }}>{config.chips[0].split("≈")[0].trim()}</div>
            <div style={{ fontFamily: SERIF, fontSize: 60, fontWeight: 600, color: C.ink }}>≈ {config.chips[0].split("≈")[1]?.trim()}</div>
          </div>
          <div style={{ position: "absolute", left: 520, top: 1010, opacity: it(f, T.semana + 4, T.semana + 16, 0, 1, OUT), transform: `translateY(${(1 - it(f, T.semana + 4, T.semana + 16, 0, 1, OUT)) * 40}px)` }}>
            <div style={{ display: "flex", gap: 10 }}>
              {days.map((d, i) => (
                <div key={i} style={{ width: 60, height: 76, borderRadius: 12, background: i === 0 ? MED : "rgba(255,255,255,.07)", color: i === 0 ? "#0b1020" : C.dim, fontFamily: SANS, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{d}</div>
              ))}
            </div>
            <div style={{ width: 480, textAlign: "center", marginTop: 16, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink }}>{config.chips[1]}</div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
