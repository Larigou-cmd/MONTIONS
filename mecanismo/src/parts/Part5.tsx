import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, T, config } from "../config";
import { SANS, SERIF } from "../fonts";
import { IN, MED, OUT, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";

export const Part5: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1554;
  const out1 = it(f, T.final - 8, T.final + 2, 0, 1, IN);
  const eq: { t: string; c: string }[] = [];
  config.alvos.forEach((a, i) => { if (i) eq.push({ t: "+", c: C.ink }); eq.push({ t: a.hormonio, c: a.cor }); });
  return (
    <Part from={s} to={1860} inY={100} outDur={1}>
      {out1 < 1 && (
        <AbsoluteFill style={{ opacity: 1 - out1, transform: `translateY(${-120 * out1}px)`, filter: out1 > 0 ? `blur(${out1 * 14}px)` : undefined }}>
          {/* resumo */}
          <div style={{ position: "absolute", top: 300, width: W, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
            {eq.map((e, i) => {
              const k = it(f, s + 4 + i * 5, s + 16 + i * 5, 0, 1, SNAP);
              return e.t === "+" ? (
                <div key={i} style={{ fontFamily: SANS, fontSize: 64, fontWeight: 800, color: C.ink, opacity: k }}>+</div>
              ) : (
                <div key={i} style={{ position: "relative", width: 230, height: 90 }}><Pill x={115} y={45} text={e.t} color={e.c} size={46} k={k} /></div>
              );
            })}
          </div>
          <div style={{ position: "absolute", top: 392, width: W, textAlign: "center", fontFamily: SANS, fontSize: 64, fontWeight: 800, color: C.ink, opacity: it(f, s + 18, s + 26, 0, 1, OUT) }}>=</div>
          <Pill x={540} y={540} text={config.medicamento} color={MED} size={54} k={it(f, s + 22, s + 36, 0, 1, (x) => x)} />
          {config.resumoEfeitos.map((e, i) => {
            const k = it(f, s + 30 + i * 6, s + 44 + i * 6, 0, 1, SNAP);
            const col = [config.alvos[config.alvos.length - 1].cor, MED, config.alvos[0].cor][i % 3];
            return (
              <div key={i} style={{ position: "absolute", left: 50 + i * 335, top: 660, width: 310, height: 120, borderRadius: 26, border: `2px solid ${col}`, background: rgba(col, 0.12), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: col, opacity: Math.min(1, k * 1.3), transform: `scale(${0.8 + 0.2 * k})` }}>{e}</div>
            );
          })}
          {/* efeitos adversos e aviso */}
          <div style={{ position: "absolute", top: 850, width: W, textAlign: "center", fontFamily: SANS, fontSize: 38, fontWeight: 600, color: C.ink, opacity: it(f, T.adversos, T.adversos + 12, 0, 1, OUT) }}>Efeitos mais comuns</div>
          <div style={{ position: "absolute", top: 920, width: W, display: "flex", justifyContent: "center", gap: 20 }}>
            {config.adversos.map((a, i) => {
              const k = it(f, T.adversos + 8 + i * 8, T.adversos + 22 + i * 8, 0, 1, SNAP);
              return <div key={i} style={{ padding: "14px 30px", borderRadius: 999, border: `2px solid ${C.alert}`, background: rgba(C.alert, 0.12), color: C.alert, fontFamily: SANS, fontWeight: 700, fontSize: 38, opacity: Math.min(1, k * 1.3), transform: `scale(${0.7 + 0.3 * k})` }}>{a}</div>;
            })}
          </div>
          {config.aviso.map((l, i) => {
            const k = it(f, T.aviso + i * 5, T.aviso + 14 + i * 5, 0, 1, OUT);
            return <div key={i} style={{ position: "absolute", top: 1080 + i * 52, width: W, textAlign: "center", fontFamily: SANS, fontSize: 38, fontWeight: i ? 700 : 500, color: i ? bornColor(f, T.aviso + i * 5, C.ink, C.alert) : C.dim, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>{l}</div>;
          })}
        </AbsoluteFill>
      )}
      {/* mensagem final */}
      {f >= T.final && (
        <AbsoluteFill style={{ opacity: it(f, T.final, T.final + 12, 0, 1, OUT) }}>
          {config.mensagemFinal.map((l, i) => {
            const at = T.final + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, MED, "#f5f0ff", 20) : bornColor(f, at), textShadow: i === 1 ? `0 0 30px ${rgba(MED, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, 1860, 0, 1, (x) => x)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>
            );
          })}
          <div style={{ position: "absolute", top: 1150, width: W, textAlign: "center", fontFamily: SANS, fontSize: 24, color: C.dim, opacity: it(f, T.final + 30, T.final + 42, 0, 1, OUT) * 0.85 }}>{config.aviso[0]} Ref.: {config.referencias}</div>
        </AbsoluteFill>
      )}
    </Part>
  );
};
