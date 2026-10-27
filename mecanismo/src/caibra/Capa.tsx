import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { COR, VERM } from "./Video";

// Capa (thumbnail vertical 1080×1920) de "Por que dá cãibra de madrugada?" — fundo: quadro do clipe 3D do OpenArt.
export const CapaCaibra: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Img
      src={staticFile("caibra/capa_fundo.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(rgba(5,8,20,0.92), rgba(5,8,20,0.35) 34%, rgba(5,8,20,0) 55%, rgba(5,8,20,0.9))",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 170,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 100,
        lineHeight: 1.04,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.6)}`,
      }}
    >
      POR QUE DÁ
      <br />
      <span
        style={{
          color: VERM,
          fontSize: 150,
          textShadow: `0 0 40px ${rgba(VERM, 0.7)}`,
        }}
      >
        CÃIBRA
      </span>
      <br />
      DE MADRUGADA?
    </div>
    <div
      style={{
        position: "absolute",
        top: 1560,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 64,
        lineHeight: 1.15,
        color: C.ink,
      }}
    >
      o que acontece
      <br />
      dentro do músculo <span style={{ fontFamily: EMOJI }}>🔬</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
