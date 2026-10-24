import React from "react";
import { AbsoluteFill } from "remotion";
import { SANS } from "../fonts";
import { W } from "../lib";
import { Etiqueta, Fita, Foto, Papel, SERIF, TINTA, VERM } from "./Captopril";

// Capa (thumbnail vertical 1080×1920) de "A origem dos remédios #2 — A aspirina e o salgueiro".
export const CapaAspirina: React.FC = () => (
  <AbsoluteFill>
    <Papel />
    <div
      style={{
        position: "absolute",
        top: 170,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 8,
        color: VERM,
      }}
    >
      A ORIGEM DOS REMÉDIOS · #2
    </div>
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 60,
        width: W - 120,
        textAlign: "center",
        fontFamily: SERIF,
        fontSize: 112,
        lineHeight: 1.0,
        color: TINTA,
      }}
    >
      O remédio que
      <br />
      começou na
      <br />
      <span style={{ fontStyle: "italic", color: VERM, fontSize: 150 }}>
        casca
      </span>
      <br />
      de uma árvore
    </div>
    <Foto
      src="aspirina/img/salgueiro2.jpg"
      x={540}
      y={1250}
      w={880}
      h={600}
      at={-30}
      rot={-3}
      pos="62% 50%"
      zoom={0}
    />
    <Fita x={290} y={960} rot={-14} />
    <Fita x={800} y={960} rot={10} />
    <Etiqueta x={700} y={1585} at={-30} rot={3}>
      Salix alba · salgueiro
    </Etiqueta>
    <div
      style={{
        position: "absolute",
        top: 1680,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: 76,
        color: TINTA,
      }}
    >
      e virou a <span style={{ color: VERM }}>aspirina</span>
    </div>
  </AbsoluteFill>
);
