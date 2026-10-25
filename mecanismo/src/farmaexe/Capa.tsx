import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SANS } from "../fonts";
import { Fundo, Logo, TINTA, VERDE, BOLHA_ELA, PIXEL } from "./ui";

// Capa (1080×1920) do comercial Farma.exe "Pergunte à Farmacêutica".
// Tudo fica entre y≈300 e y≈1620, o recorte 3:4 que o TikTok e o Instagram mostram.
export const CapaFarma: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Logo y={360} size={84} at={-200} cursor={false} />
    <div style={{ position: "absolute", top: 450, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1.05, color: TINTA }}>
      Tem dúvida
      <br />
      de <span style={{ color: VERDE }}>remédio</span>?
    </div>
    <Img
      src={staticFile("farmaexe/avatar.png")}
      style={{ position: "absolute", left: 540 - 230, top: 720, width: 460, height: 460, borderRadius: 230, boxShadow: `0 0 0 10px ${VERDE}, 0 30px 70px rgba(22,163,74,0.35)` }}
    />
    {/* balões de chat em volta da foto */}
    <div style={{ position: "absolute", left: 90, top: 760, background: BOLHA_ELA, borderRadius: "26px 26px 6px 26px", padding: "16px 24px", fontFamily: SANS, fontSize: 36, color: TINTA, boxShadow: "0 6px 16px rgba(0,0,0,0.12)", transform: "rotate(-5deg)" }}>
      Esqueci a pílula 😰
    </div>
    <div style={{ position: "absolute", right: 80, top: 1090, background: "#fff", borderRadius: "26px 26px 26px 6px", padding: "16px 24px", fontFamily: SANS, fontSize: 36, color: TINTA, boxShadow: "0 6px 16px rgba(0,0,0,0.12)", transform: "rotate(4deg)" }}>
      Pode partir? ✂️
    </div>
    <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: VERDE }}>
      Pergunte à Farmacêutica
    </div>
    <div style={{ position: "absolute", top: 1350, width: "100%", display: "flex", justifyContent: "center" }}>
      <span style={{ fontFamily: PIXEL, fontSize: 30, color: "#fff", background: TINTA, padding: "18px 26px", borderRadius: 14 }}>3 DÚVIDAS · 45 s</span>
    </div>
  </AbsoluteFill>
);
