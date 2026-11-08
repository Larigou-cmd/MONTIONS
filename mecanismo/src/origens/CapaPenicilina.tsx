import React from "react";
import { AbsoluteFill } from "remotion";
import { SANS } from "../fonts";
import { W } from "../lib";
import { Etiqueta, Fita, Foto, Papel, SERIF, TINTA, VERM } from "./Captopril";

// Capa (thumbnail vertical 1080×1920) de "A origem dos remédios #3 — A penicilina e o mofo esquecido".
// Mesmo desenho das capas #1 (captopril) e #2 (aspirina); a foto é um quadro do vídeo (Fleming com a placa),
// cortado acima da legenda do Google Vids e em cores, para o verde do mofo aparecer.
export const CapaPenicilina: React.FC = () => (
  <AbsoluteFill>
    <Papel />
    <div
      style={{
        position: "absolute",
        top: 310,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 8,
        color: VERM,
      }}
    >
      A ORIGEM DOS REMÉDIOS · #3
    </div>
    <div
      style={{
        position: "absolute",
        top: 370,
        left: 60,
        width: W - 120,
        textAlign: "center",
        fontFamily: SERIF,
        fontSize: 96,
        lineHeight: 1.0,
        color: TINTA,
      }}
    >
      O remédio que
      <br />
      nasceu de um
      <br />
      <span style={{ fontStyle: "italic", color: VERM, fontSize: 128 }}>
        mofo
      </span>
      <br />
      esquecido
    </div>
    <Foto
      src="penicilinaVids/capa_fundo.png"
      x={540}
      y={1150}
      w={800}
      h={460}
      at={-30}
      rot={-3}
      pos="50% 42%"
      zoom={0}
      cor
    />
    <Fita x={330} y={925} rot={-14} />
    <Fita x={760} y={925} rot={10} />
    <Etiqueta x={680} y={1395} at={-30} rot={3}>
      Alexander Fleming · 1928
    </Etiqueta>
    <div
      style={{
        position: "absolute",
        top: 1470,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: 76,
        color: TINTA,
      }}
    >
      e virou a <span style={{ color: VERM }}>penicilina</span>
    </div>
  </AbsoluteFill>
);
