import React from "react";
import { useCurrentFrame } from "remotion";
import { IBP, TI } from "./config";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { OUT, Part, SNAP, W, bornColor, it, rgba } from "../lib";

// a família: o que muda em cada um e quando costuma ser escolhido
export const Part4: React.FC = () => {
  const f = useCurrentFrame();
  const eq = it(f, TI.equivalente, TI.equivalente + 14, 0, 1, OUT);
  const titleK = it(f, TI.diferenca, TI.diferenca + 12, 0, 1, OUT);
  return (
    <Part from={984} to={1428} inY={100} outDur={10}>
      <div style={{ position: "absolute", top: 228, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 56, color: C.ink, opacity: titleK }}>E a diferença?</div>
      {IBP.familia.map((d, i) => {
        const at = TI.familia[i];
        if (f < at) return null;
        const k = it(f, at, at + 14, 0, 1, SNAP);
        const next = TI.familia[i + 1] ?? TI.equivalente;
        const hot = (f >= at && f < next) || eq > 0 ? 1 : 0;
        const base = d.nome.slice(0, d.nome.length - 6), suf = d.nome.slice(-6);
        return (
          <div key={i} style={{ position: "absolute", left: 50, top: 310 + i * 158, width: 980, height: 146, borderRadius: 28, background: C.box, border: `2px solid ${hot ? rgba(IBP.cor, 0.75) : C.boxBorder}`, boxShadow: hot ? `0 0 26px ${rgba(IBP.cor, 0.25)}` : "0 12px 30px rgba(0,0,0,.3)", opacity: Math.min(1, k * 1.3), transform: `translateX(${(1 - k) * -90}px)`, padding: "14px 30px", boxSizing: "border-box", fontFamily: SANS }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: bornColor(f, at, C.ink, IBP.cor) }}>{base}<span style={{ color: IBP.cor }}>{suf}</span></span>
              <span style={{ fontSize: 30, color: C.ink, fontWeight: 500 }}>{d.traco}</span>
            </div>
            <div style={{ fontSize: 29, color: C.dim, marginTop: 6 }}><span style={{ color: IBP.cor, fontWeight: 700 }}>Quando: </span>{d.quando}</div>
          </div>
        );
      })}
      {eq > 0 && (
        <div style={{ position: "absolute", left: 90, top: 1290, width: 900, height: 120, borderRadius: 60, background: rgba(IBP.cor, 0.14), border: `2.5px solid ${IBP.cor}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: eq, transform: `scale(${0.8 + 0.2 * SNAP(eq)})`, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, boxShadow: `0 0 40px ${rgba(IBP.cor, 0.3)}` }}>
          <span style={{ fontSize: 60, color: IBP.cor, lineHeight: "60px" }}>≈</span>{IBP.equivalente}
        </div>
      )}
    </Part>
  );
};
