import React from "react";
import { Img, staticFile } from "remotion";
import boca from "./boca.json";

// A personagem (imagem 768×1376) com boca animada pela voz, piscadas e leve respiração.
const IW = 768, IH = 1376;
const SKIN = "repeating-linear-gradient(180deg, rgb(199,157,141) 0px, rgb(199,157,141) 2.6px, rgb(174,131,116) 2.6px, rgb(174,131,116) 4px)";
export type Crop = { sx: number; sy: number; sw: number; sh: number };
export const FULL: Crop = { sx: 0, sy: 0, sw: IW, sh: IH };
export const PORTRAIT: Crop = { sx: 250, sy: 175, sw: 330, sh: 322 };

const Rect: React.FC<{ x: number; y: number; w: number; h: number; bg: string }> = ({ x, y, w, h, bg }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg }} />
);

export const Character: React.FC<{ f: number; x: number; y: number; w: number; h: number; crop: Crop; talking?: boolean }> = ({ f, x, y, w, h, crop, talking = true }) => {
  const s = w / crop.sw;
  const L = talking ? (boca as number[])[f] ?? 0 : 0;
  const blink = f % 128 >= 120 && f % 128 < 125;
  const glow = 0.35 + 0.25 * Math.sin(f / 9);
  const bob = Math.sin(f / 22) * 1.5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -crop.sx * s, top: -crop.sy * s + bob, width: IW, height: IH, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <Img src={staticFile("sema/personagem.jpg")} style={{ position: "absolute", left: 0, top: 0, width: IW, height: IH, imageRendering: "pixelated" }} />
        {/* brilho do frasco */}
        <div style={{ position: "absolute", left: 560, top: 380, width: 120, height: 150, borderRadius: "50%", background: `radial-gradient(circle, rgba(103,232,249,${glow}) 0%, rgba(103,232,249,0) 70%)`, mixBlendMode: "screen" }} />
        {/* piscada */}
        {blink && (
          <>
            <Rect x={342} y={244} w={56} h={33} bg={SKIN} />
            <Rect x={423} y={244} w={41} h={33} bg={SKIN} />
            <Rect x={346} y={262} w={48} h={5} bg="#1c0f14" />
            <Rect x={426} y={262} w={34} h={5} bg="#1c0f14" />
          </>
        )}
        {/* boca falando */}
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
    </div>
  );
};
