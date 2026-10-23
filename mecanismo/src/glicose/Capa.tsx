import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Grain, W, rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Capa (thumbnail vertical 1080×1920) de "O que acontece no corpo quando a glicose sobe?" — fundo: foto da chave (OpenArt).
const OURO = "#fbbf24";

export const CapaGlicose: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Img
      src={staticFile("glicose/img/f5_chave.png")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "scale(1.12)",
        transformOrigin: "60% 45%",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(rgba(5,8,20,0.93), rgba(5,8,20,0.4) 33%, rgba(5,8,20,0) 52%, rgba(5,8,20,0.9))",
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
        fontSize: 96,
        lineHeight: 1.05,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(OURO, 0.5)}`,
      }}
    >
      O QUE ACONTECE
      <br />
      QUANDO A
      <br />
      <span
        style={{
          color: OURO,
          fontSize: 140,
          textShadow: `0 0 40px ${rgba(OURO, 0.7)}`,
        }}
      >
        GLICOSE
      </span>
      <br />
      SOBE?
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
      a insulina é a <span style={{ color: OURO }}>chave</span>{" "}
      <span style={{ fontFamily: EMOJI }}>🔑</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
