import React from "react";
import { Img, staticFile } from "remotion";
import boca from "../sema/boca.json";

// A personagem recortada do fundo (517×1174), com boca seguindo a voz e piscadas.
// As posições da boca e dos olhos são as mesmas de sema/Character.tsx, menos o recorte (156, 110).
export const PW = 517, PH = 1174;
const OX = 156, OY = 110;
const SKIN = "repeating-linear-gradient(180deg, rgb(199,157,141) 0px, rgb(199,157,141) 2.6px, rgb(174,131,116) 2.6px, rgb(174,131,116) 4px)";

const Rect: React.FC<{ x: number; y: number; w: number; h: number; bg: string }> = ({ x, y, w, h, bg }) => (
  <div style={{ position: "absolute", left: x - OX, top: y - OY, width: w, height: h, background: bg }} />
);

export const Personagem: React.FC<{ f: number }> = ({ f }) => {
  const L = (boca as number[])[f] ?? 0;
  const blink = f % 128 >= 120 && f % 128 < 125;
  const glow = 0.35 + 0.25 * Math.sin(f / 9);
  return (
    <div style={{ position: "relative", width: PW, height: PH }}>
      <Img src={staticFile("sema/personagem_recorte.png")} style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, imageRendering: "pixelated" }} />
      <div style={{ position: "absolute", left: 560 - OX, top: 380 - OY, width: 120, height: 150, borderRadius: "50%", background: `radial-gradient(circle, rgba(103,232,249,${glow}) 0%, rgba(103,232,249,0) 70%)` }} />
      {blink && (
        <>
          <Rect x={342} y={244} w={56} h={33} bg={SKIN} />
          <Rect x={423} y={244} w={41} h={33} bg={SKIN} />
          <Rect x={346} y={262} w={48} h={5} bg="#1c0f14" />
          <Rect x={426} y={262} w={34} h={5} bg="#1c0f14" />
        </>
      )}
      {L > 0 && (
        <>
          <Rect x={377} y={318} w={56} h={29} bg={SKIN} />
          <Rect x={388 - L} y={323} w={34 + 2 * L} h={6 + 6 * L} bg="#b6939c" />
          <Rect x={392 - L} y={326} w={26 + 2 * L} h={6 * L} bg="#45202a" />
          {L >= 2 && <Rect x={393 - L} y={326} w={24 + 2 * L} h={4} bg="#efe2e2" />}
          {L >= 2 && <Rect x={397} y={326 + 6 * L - 5} w={16} h={3} bg="#c4626f" />}
        </>
      )}
    </div>
  );
};
