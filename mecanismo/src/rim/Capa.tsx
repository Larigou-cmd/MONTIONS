import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Grain, W, rgba } from "../lib";

// Capa (thumbnail vertical 1080×1920) de "O rim e os diuréticos" — fundo: quadro do clipe do rim (Google Vids).
const AZUL = "#60a5fa";

export const CapaRim: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Img src={staticFile("rim/capa_fundo.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(rgba(5,8,20,0.93), rgba(5,8,20,0.35) 34%, rgba(5,8,20,0) 52%, rgba(5,8,20,0.9))" }} />
    <div style={{ position: "absolute", top: 170, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1.05, color: C.ink, textShadow: `0 0 40px ${rgba(AZUL, 0.6)}` }}>
      SEUS RINS FILTRAM
      <br />
      <span style={{ color: AZUL, fontSize: 170, textShadow: `0 0 40px ${rgba(AZUL, 0.8)}` }}>180 L</span>
      <br />
      POR DIA
    </div>
    <div style={{ position: "absolute", top: 1540, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 64, lineHeight: 1.15, color: C.ink }}>
      e onde age cada
      <br />
      <span style={{ color: AZUL }}>diurético</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
