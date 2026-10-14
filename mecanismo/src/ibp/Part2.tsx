import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { IBP, TI } from "./config";
import { C } from "../config";
import { SERIF } from "../fonts";
import { EASE, IN, OUT, P, Part, Pill, SNAP, Txt, W, it, rgba } from "../lib";
import { Membrane } from "../parts/Part2";
import { Drug, Ion, Pump, STOMACH } from "./shapes";

const MY = 760;
const PX = [180, 410, 640, 870];
const LIN = (x: number) => x;

export const Part2: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = it(f, TI.parietal - 14, TI.parietal + 8, 0, 1, IN);
  const cellIn = it(f, TI.parietal - 4, TI.parietal + 14, 0, 1, OUT);
  return (
    <Part from={296} to={800} inY={100} outDur={10}>
      {/* o estômago cheio de ácido */}
      {zoom < 1 && (
        <AbsoluteFill style={{ opacity: 1 - zoom, transform: `scale(${1 + zoom * 2.2})`, transformOrigin: "300px 760px", filter: zoom > 0 ? `blur(${zoom * 14}px)` : undefined }}>
          <svg width={W} height={1920} style={{ position: "absolute" }}>
            <g transform="translate(500,780) scale(1.55)">
              <clipPath id="ibpst"><path d={STOMACH} /></clipPath>
              <g clipPath="url(#ibpst)">
                <path d={`M-260,20 ` + Array.from({ length: 60 }, (_, i) => `L${-260 + i * 10},${20 + Math.sin(i * 0.3 + f / 6) * 6}`).join(" ") + " L340,320 L-260,320Z"} fill={rgba(IBP.acido, 0.35)} />
                {Array.from({ length: 14 }, (_, i) => {
                  const ph = ((f / 50 + i / 14) % 1);
                  return <circle key={i} cx={-180 + ((i * 53) % 380)} cy={220 - ph * 200} r={5 + (i % 3) * 2} fill="none" stroke={IBP.acido} strokeWidth={2} opacity={1 - ph} />;
                })}
              </g>
              <path d={STOMACH} fill="none" stroke="#fda4af" strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - it(f, 298, 330, 0, 1, OUT)} />
            </g>
          </svg>
          <Txt x={540} y={330} size={64} font={SERIF} color="#fda4af" style={{ opacity: it(f, TI.estomago, TI.estomago + 14, 0, 1, OUT) }}>Estômago</Txt>
          <Txt x={560} y={1200} size={40} color={C.dim} weight={500} style={{ opacity: it(f, 320, 334, 0, 1, OUT) }}>a parede produz ácido</Txt>
        </AbsoluteFill>
      )}

      {/* dentro da parede: a célula parietal e as bombas */}
      {cellIn > 0 && (
        <AbsoluteFill style={{ opacity: cellIn, transform: `scale(${0.85 + 0.15 * cellIn})`, filter: cellIn < 1 ? `blur(${(1 - cellIn) * 12}px)` : undefined }}>
          <CellScene f={f} />
        </AbsoluteFill>
      )}
    </Part>
  );
};

const lockAt = (i: number) => TI.trava + i * 5;

const CellScene: React.FC<{ f: number }> = ({ f }) => (
  <>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="lumen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={IBP.acido} stopOpacity={0.02} />
          <stop offset="100%" stopColor={IBP.acido} stopOpacity={0.16} />
        </linearGradient>
      </defs>
      <rect x={0} y={240} width={W} height={MY - 240} fill="url(#lumen)" />
      <rect x={0} y={MY + 50} width={W} height={420} fill="rgba(96,165,250,.05)" />
      <Membrane y={MY} f={f} />
      {/* vaso sanguíneo */}
      {f >= TI.sangue - 30 && (
        <g opacity={it(f, TI.sangue - 30, TI.sangue - 10, 0, 1, OUT)}>
          <rect x={-20} y={1270} width={W + 40} height={110} rx={55} fill="rgba(239,68,68,.16)" stroke="#f87171" strokeWidth={4} />
          {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={((i * 140 + f * 3) % (W + 140)) - 70} cy={1325 + (i % 2 ? 16 : -16)} rx={26} ry={14} fill="rgba(248,113,113,.45)" />)}
        </g>
      )}
      {/* íons de ácido saindo das bombas */}
      {PX.map((x, i) =>
        Array.from({ length: 6 }, (_, j) => {
          const t0 = TI.acido + j * 16 + i * 4;
          const out: React.ReactNode[] = [];
          for (let c = 0; c < 6; c++) {
            const st = t0 + c * 96;
            if (st >= lockAt(i)) break;
            const k = P(f, st, st + 70);
            if (k <= 0 || k >= 1) continue;
            out.push(<Ion key={`${j}-${c}`} x={x + Math.sin(k * 6 + j) * 30} y={MY - 80 - k * 420} o={1 - k} r={20} />);
          }
          return <g key={`${i}-${j}`}>{out}</g>;
        })
      )}
      {PX.map((x, i) => {
        const k = it(f, TI.bombas + i * 5, TI.bombas + 14 + i * 5, 0, 1, SNAP);
        const on = P(f, TI.acido - 6, TI.acido + 6);
        const locked = it(f, lockAt(i), lockAt(i) + 10, 0, 1, SNAP);
        return <g key={i} opacity={Math.min(1, k * 1.5)} transform={`translate(0,${(1 - k) * 80})`}><Pump x={x} y={MY + 20} on={0.4 + 0.6 * on} locked={locked} /></g>;
      })}
      {/* moléculas do prazol: sangue -> célula -> ativa -> encaixa */}
      {f >= TI.sangue && PX.map((x, i) => {
        const enter = it(f, TI.sangue + i * 6, TI.sangue + 40 + i * 6, 0, 1, EASE);
        const rise = it(f, TI.inativo + 4 + i * 3, TI.ativa - 6 + i * 3, 0, 1, EASE);
        const dock = it(f, TI.encaixa - 4 + i * 4, TI.encaixa + 18 + i * 4, 0, 1, EASE);
        const active = P(f, TI.ativa + i * 3, TI.ativa + 14 + i * 3);
        const x0 = -80 - i * 60 + (x + 80 + i * 60) * enter;
        const y0 = 1325, y1 = 960, y2 = MY + 20;
        const y = dock > 0 ? y1 + (y2 - y1) * dock : y0 + (y1 - y0) * rise;
        const o = 1 - P(f, lockAt(i) + 2, lockAt(i) + 10);
        return <g key={i} opacity={o}><Drug x={x0 - 18} y={y} active={active} s={1.1} /></g>;
      })}
    </svg>
    <Txt x={60} y={290} size={32} color="#fda4af" weight={600} align="left" style={{ opacity: it(f, TI.parietal + 10, TI.parietal + 24, 0, 1, OUT) }}>Dentro do estômago</Txt>
    <Txt x={60} y={1180} size={32} color="#93c5fd" weight={600} align="left" style={{ opacity: it(f, TI.parietal + 4, TI.parietal + 18, 0, 1, OUT) }}>Célula parietal</Txt>
    <Pill x={540} y={600} text="Bombas de prótons" color={IBP.bomba} size={40} k={it(f, TI.bombas + 8, TI.bombas + 20, 0, 1, LIN) * (1 - P(f, TI.trava - 4, TI.trava))} />
    <Pill x={540} y={600} text="Bombas travadas" color={IBP.cor} size={40} k={it(f, TI.trava + 4, TI.trava + 16, 0, 1, LIN)} />
    <Txt x={540} y={430} size={44} font={SERIF} color={IBP.acido} weight={600} style={{ opacity: it(f, TI.acido + 10, TI.acido + 24, 0, 1, OUT) * (1 - P(f, TI.trava + 10, TI.trava + 24)) }}>ácido (H⁺)</Txt>
    <Txt x={60} y={1425} size={30} color="#fca5a5" weight={600} align="left" style={{ opacity: it(f, TI.sangue - 20, TI.sangue - 6, 0, 1, OUT) }}>Sangue</Txt>
    <Pill x={720} y={1440} text="prazol inativo" color="#94a3c8" size={30} k={it(f, TI.inativo - 6, TI.inativo + 6, 0, 1, LIN) * (1 - P(f, TI.ativa, TI.ativa + 8))} />
    <Pill x={540} y={1070} text="ativado pelo ácido" color={IBP.cor} size={34} k={it(f, TI.ativa + 4, TI.ativa + 16, 0, 1, LIN) * (1 - P(f, TI.trava - 4, TI.trava + 4))} />
  </>
);
