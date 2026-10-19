import React from "react";
import { Img, staticFile } from "remotion";

// A repórter do quadro "Notícias da Farmácia" (public/noticias/reporter_recorte.png, 419×1448, pixel art ampliado 4×),
// com a boca seguindo a narração (lista de 0 a 3 por quadro, de scripts/boca.py) e piscadas.
export const RW = 419,
  RH = 1448;
const PELE = "rgb(183,140,92)";

const Ret: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
}> = ({ x, y, w, h, bg }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
    }}
  />
);

export const Reporter: React.FC<{ f: number; boca: number[] }> = ({
  f,
  boca,
}) => {
  const L = boca[f] ?? 0;
  const pisca = f % 140 >= 132 && f % 140 < 137;
  return (
    <div style={{ position: "relative", width: RW, height: RH }}>
      <Img
        src={staticFile("noticias/reporter_recorte.png")}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: RW,
          height: RH,
          imageRendering: "pixelated",
        }}
      />
      {pisca && (
        <>
          <Ret x={160} y={120} w={32} h={20} bg={PELE} />
          <Ret x={226} y={120} w={34} h={20} bg={PELE} />
          <Ret x={162} y={130} w={28} h={4} bg="#2a1608" />
          <Ret x={228} y={130} w={30} h={4} bg="#2a1608" />
        </>
      )}
      {/* a boca original já é um sorriso aberto: cobre com pele e redesenha conforme a fala */}
      <Ret x={186} y={180} w={46} h={30} bg={PELE} />
      {L === 0 ? (
        <>
          <Ret x={194} y={190} w={30} h={4} bg="rgb(116,53,9)" />
          <Ret x={190} y={188} w={4} h={4} bg="rgb(116,53,9)" />
          <Ret x={224} y={188} w={4} h={4} bg="rgb(116,53,9)" />
        </>
      ) : (
        <>
          <Ret
            x={195 - 2 * L}
            y={186}
            w={28 + 4 * L}
            h={6 + 5 * L}
            bg="rgb(169,118,79)"
          />
          <Ret
            x={198 - 2 * L}
            y={188}
            w={22 + 4 * L}
            h={2 + 5 * L}
            bg="rgb(70,25,15)"
          />
          {L >= 2 && (
            <Ret x={199 - 2 * L} y={188} w={20 + 4 * L} h={4} bg="#efe7e2" />
          )}
        </>
      )}
    </div>
  );
};
