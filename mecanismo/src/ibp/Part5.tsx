import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { IBP, TI } from "./config";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { IN, OUT, Part, SNAP, W, bornColor, bornGlow, it, mix, rgba } from "../lib";

export const Part5: React.FC = () => {
  const f = useCurrentFrame();
  const out1 = it(f, TI.final - 8, TI.final + 2, 0, 1, IN);
  return (
    <Part from={1420} to={DUR} inY={100} outDur={1}>
      {out1 < 1 && (
        <AbsoluteFill style={{ opacity: 1 - out1, transform: `translateY(${-120 * out1}px)`, filter: out1 > 0 ? `blur(${out1 * 14}px)` : undefined }}>
          <div style={{ position: "absolute", top: 400, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 80, color: bornColor(f, TI.prolongado, C.ink, IBP.cor), textShadow: bornGlow(f, TI.prolongado, IBP.cor), opacity: it(f, TI.prolongado, TI.prolongado + 12, 0, 1, OUT) }}>Uso prolongado</div>
          {IBP.cuidados.map((c, i) => {
            const at = TI.cuidados[i];
            const k = it(f, at, at + 14, 0, 1, SNAP);
            if (f < at) return null;
            return (
              <div key={i} style={{ position: "absolute", left: 70 + i * 480, top: 600, width: 460, height: 300, borderRadius: 34, background: C.box, border: `2px solid ${rgba(C.alert, 0.6)}`, boxShadow: "0 18px 50px rgba(0,0,0,.35)", opacity: Math.min(1, k * 1.3), transform: `translateY(${(1 - k) * 70}px) rotate(${i ? 0.8 : -1}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ width: 96, height: 96, borderRadius: i ? 18 : 48, border: `3px solid ${mix(C.alert, C.ink, 0.3)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink }}>{i ? "Mg" : "B12"}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: C.ink }}>{c.nome}</div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: C.alert, lineHeight: "54px" }}>{c.seta}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", top: 1010, width: W, textAlign: "center", fontFamily: SANS, fontSize: 46, fontWeight: 700, color: bornColor(f, TI.aviso, C.ink, C.alert), opacity: it(f, TI.aviso, TI.aviso + 12, 0, 1, OUT) }}>Use só com orientação médica.</div>
          <div style={{ position: "absolute", top: 1080, width: W, textAlign: "center", fontFamily: SANS, fontSize: 32, color: C.dim, opacity: it(f, TI.aviso + 12, TI.aviso + 24, 0, 1, OUT) }}>A escolha do remédio e da dose é do médico.</div>
        </AbsoluteFill>
      )}
      {f >= TI.final && (
        <AbsoluteFill style={{ opacity: it(f, TI.final, TI.final + 12, 0, 1, OUT) }}>
          {IBP.mensagemFinal.map((l, i) => {
            const at = TI.final + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, IBP.cor, "#f0fff8", 20) : bornColor(f, at, C.ink, IBP.cor), textShadow: i === 1 ? `0 0 30px ${rgba(IBP.cor, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, TI.final, DUR, 0, 1, (x) => x)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>
            );
          })}
          <div style={{ position: "absolute", top: 1150, width: W, textAlign: "center", fontFamily: SANS, fontSize: 24, color: C.dim, opacity: it(f, TI.final + 30, TI.final + 42, 0, 1, OUT) * 0.85 }}>Conteúdo educativo. Ref.: {IBP.referencias}</div>
        </AbsoluteFill>
      )}
    </Part>
  );
};

const DUR = 1760;
