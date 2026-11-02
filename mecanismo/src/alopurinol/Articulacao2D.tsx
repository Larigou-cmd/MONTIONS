import React from "react";
import { interpolate } from "remotion";
import { EMOJI } from "../aas/ui";
import type { TemposArt } from "./Articulacao3D";

// Mesma explicação da Articulacao3D, desenhada em 2D no estilo do Modelo 1:
// pé, articulação com mapa de calor, cristais em agulha e partículas de ácido úrico.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const mix = (a: number[], b: number[], k: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * k));
const cor = (k: number) => {
  const frio = [61, 255, 143],
    morno = [255, 176, 32],
    quente = [255, 59, 47];
  const c =
    k > 0.5 ? mix(morno, quente, (k - 0.5) * 2) : mix(frio, morno, k * 2);
  return `rgb(${c.join(",")})`;
};

export const Articulacao2D: React.FC<{ f: number; t: TemposArt }> = ({
  f,
  t,
}) => {
  const nasce = interpolate(f - t.ini, [0, 14], [0, 1], clamp);
  const forma = interpolate(
    f,
    [t.cristais - 30, t.cristais + 50],
    [0, 1],
    clamp,
  );
  const some = interpolate(
    f,
    [t.dissolve - 10, t.dissolve + 90],
    [0, 1],
    clamp,
  );
  const k = Math.max(0, forma - some * 1.05);
  const fabrica = 1 - interpolate(f, [t.trava, t.trava + 30], [0, 0.85], clamp);
  const c = cor(Math.min(1, k * 1.1));
  const pulso = 1 + 0.04 * Math.sin(f / 5) * k;
  const cx = 540,
    cy = 860,
    R = 230;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: nasce }}>
      {/* pé ao fundo, para situar a articulação do dedão */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          textAlign: "center",
          fontFamily: EMOJI,
          fontSize: 120,
          opacity: 0.9,
        }}
      >
        🦶
      </div>
      {/* partículas de ácido úrico no sangue */}
      {Array.from({ length: 46 }, (_, i) => {
        const u =
          (rnd(i + 200) + (f - t.ini) * 0.004 * (0.7 + rnd(i + 220) * 0.6)) % 1;
        const lado = i % 2 ? 1 : -1;
        const x = cx + lado * (300 + rnd(i + 240) * 150);
        const y = 560 + u * 640;
        const vis = rnd(i + 260) < fabrica ? 1 : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 11,
              top: y - 11,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#ffd54a",
              boxShadow: "0 0 14px #ffb300",
              opacity: vis,
            }}
          />
        );
      })}
      {/* articulação com mapa de calor */}
      <div
        style={{
          position: "absolute",
          left: cx - R * pulso,
          top: cy - R * pulso,
          width: 2 * R * pulso,
          height: 2 * R * pulso,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c} 0%, ${c}99 45%, ${c}22 75%, transparent 100%)`,
          boxShadow: `0 0 ${60 + 80 * k}px ${c}`,
        }}
      />
      {/* cristais em agulha */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = rnd(i) * Math.PI * 2;
        const r = 30 + rnd(i + 40) * 150;
        const cres = Math.max(
          0,
          Math.min(1, forma * 1.3 - rnd(i + 60) * 0.3) -
            some * (0.6 + rnd(i + 80) * 0.6),
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * r - 4,
              top: cy + Math.sin(a) * r - 45,
              width: 8,
              height: 90,
              borderRadius: 4,
              background: "linear-gradient(#fffbe0, #f2c94c)",
              boxShadow: "0 0 10px #ffe082",
              transform: `rotate(${rnd(i + 100) * 180}deg) scale(${cres})`,
            }}
          />
        );
      })}
    </div>
  );
};
