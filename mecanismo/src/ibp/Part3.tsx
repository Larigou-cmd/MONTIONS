import React from "react";
import { useCurrentFrame } from "remotion";
import { IBP, TI } from "./config";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { OUT, P, Part, SNAP, Txt, W, bornColor, bornGlow, it, rgba } from "../lib";
import { Capsule, Cup, Pump } from "./shapes";

// quando tomar: em jejum, antes do café (as bombas ligam com a refeição)
export const Part3: React.FC = () => {
  const f = useCurrentFrame();
  const line = it(f, TI.porIsso + 10, TI.jejum, 0, 1, OUT);
  const clock = it(f, TI.cafe - 10, TI.cafe + 30, 0, 1);
  const wake = P(f, TI.acordam, TI.acordam + 14);
  return (
    <Part from={790} to={996} inScale={0.9} outDur={10}>
      <div style={{ position: "absolute", top: 330, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 84, color: bornColor(f, TI.jejum, C.ink, IBP.cor), textShadow: bornGlow(f, TI.jejum, IBP.cor), opacity: it(f, TI.jejum - 4, TI.jejum + 10, 0, 1, OUT), transform: `translateY(${(1 - it(f, TI.jejum - 4, TI.jejum + 10, 0, 1, OUT)) * 30}px)` }}>Em jejum</div>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        <line x1={190} y1={760} x2={190 + (890 - 190) * line} y2={760} stroke={IBP.cor} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
        <g opacity={it(f, TI.porIsso, TI.porIsso + 12, 0, 1, OUT)}><Capsule x={160} y={760} w={150} rot={-20} /></g>
        <g opacity={it(f, TI.cafe - 6, TI.cafe + 8, 0, 1, OUT)} transform={`translate(0,${(1 - it(f, TI.cafe - 6, TI.cafe + 8, 0, 1, SNAP)) * 40})`}><Cup x={910} y={760} f={f} /></g>
        {f >= TI.cafe - 10 && (
          <g transform="translate(540,640)" opacity={it(f, TI.cafe - 10, TI.cafe, 0, 1, OUT)}>
            <circle r={58} fill="rgba(20,24,44,.9)" stroke={C.dim} strokeWidth={4} />
            <path d={`M0,0 L0,-58 A58,58 0 ${clock > 0.5 ? 1 : 0} 1 ${Math.sin(clock * Math.PI) * 58},${-Math.cos(clock * Math.PI) * 58} Z`} fill={rgba(IBP.cor, 0.35)} />
            <line x1={0} y1={0} x2={Math.sin(clock * Math.PI) * 44} y2={-Math.cos(clock * Math.PI) * 44} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
            <circle r={6} fill={C.ink} />
          </g>
        )}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} opacity={it(f, TI.cafe + 20 + i * 3, TI.cafe + 34 + i * 3, 0, 1, OUT)}>
            <Pump x={270 + i * 180} y={1130} on={0.15 + 0.85 * P(f, TI.acordam + i * 4, TI.acordam + 12 + i * 4)} locked={0} s={0.8} />
          </g>
        ))}
      </svg>
      <Txt x={160} y={860} size={34} color={IBP.cor} weight={700} style={{ opacity: it(f, TI.porIsso + 6, TI.porIsso + 18, 0, 1, OUT) }}>prazol</Txt>
      <Txt x={910} y={860} size={34} color="#fdba74" weight={700} style={{ opacity: it(f, TI.cafe, TI.cafe + 12, 0, 1, OUT) }}>café</Txt>
      <Txt x={540} y={520} size={46} weight={700} color={C.ink} style={{ opacity: it(f, TI.cafe, TI.cafe + 12, 0, 1, OUT) }}>30 a 60 min antes</Txt>
      <div style={{ position: "absolute", top: 1260, width: W, textAlign: "center", fontFamily: SANS, fontSize: 42, fontWeight: 600, color: bornColor(f, TI.acordam, C.ink, IBP.bomba), opacity: wake }}>a refeição liga as bombas</div>
      <div style={{ position: "absolute", top: 1320, width: W, textAlign: "center", fontFamily: SANS, fontSize: 32, color: C.dim, opacity: P(f, TI.acordam + 10, TI.acordam + 22) }}>e o prazol só trava bomba ligada</div>
    </Part>
  );
};
