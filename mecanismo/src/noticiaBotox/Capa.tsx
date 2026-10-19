import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, W, rgba } from "../lib";
import { Carimbo, Frasco } from "./Video";

// Capa (thumbnail vertical 1080×1920) do quadro "Notícias da Farmácia" #1.
// Os 20% de baixo ficam livres: o TikTok cobre essa faixa com o contador de visualizações.
const COR = "#f43f5e";
const AMAR = "#fbbf24";

export const CapaNoticiaBotox: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 60,
        width: 960,
        height: 150,
        borderRadius: 24,
        background: `linear-gradient(90deg, ${COR}, ${rgba(COR, 0.75)})`,
        boxShadow: `0 0 50px ${rgba(COR, 0.5)}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 44,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 6,
          color: "#fff1f2",
        }}
      >
        ● PLANTÃO · 19/10/2026
      </span>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 60,
          color: "#ffffff",
        }}
      >
        NOTÍCIAS DA FARMÁCIA
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 360,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 104,
        lineHeight: 1.02,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      BOTOX
      <br />
      <span style={{ color: COR }}>FALSIFICADO</span>
    </div>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <Frasco x={540} y={830} s={1.3} falso />
    </svg>
    <Carimbo f={100} at={0} x={540} y={850} texto="LOTE 025155" size={62} />
    <div
      style={{
        position: "absolute",
        top: 1080,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 70,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      Anvisa manda <span style={{ color: AMAR }}>apreender</span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 1250,
        width: W,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 38,
          color: C.ink,
          padding: "14px 30px",
          borderRadius: 40,
          border: `2px solid ${rgba(COR, 0.7)}`,
          background: rgba(COR, 0.14),
        }}
      >
        Como identificar e se proteger
      </span>
    </div>
    <Grain />
  </AbsoluteFill>
);
