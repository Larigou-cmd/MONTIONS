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
  r?: string;
}> = ({ x, y, w, h, bg, r }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      borderRadius: r,
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
      {/* a boca original vai de x 176 a 240 (y 180 a 206): cobre toda ela, cantos incluídos */}
      <Ret x={172} y={177} w={74} h={31} bg={PELE} />
      {L === 0 ? (
        <>
          <Ret x={184} y={190} w={50} h={4} bg="rgb(116,53,9)" />
          <Ret x={180} y={187} w={4} h={4} bg="rgb(116,53,9)" />
          <Ret x={234} y={187} w={4} h={4} bg="rgb(116,53,9)" />
        </>
      ) : (
        <>
          {/* lábios, abertura e dentes crescem juntos; os cantos acompanham a largura */}
          <Ret
            x={180 - L}
            y={184}
            w={58 + 2 * L}
            h={8 + 5 * L}
            bg="rgb(169,118,79)"
            r={`3px 3px ${10 + 4 * L}px ${10 + 4 * L}px`}
          />
          <Ret
            x={183 - L}
            y={186}
            w={52 + 2 * L}
            h={4 + 5 * L}
            bg="rgb(70,25,15)"
            r={`2px 2px ${8 + 4 * L}px ${8 + 4 * L}px`}
          />
          {L >= 2 && (
            <Ret x={185 - L} y={186} w={48 + 2 * L} h={4} bg="#efe7e2" />
          )}
          <Ret x={177 - L} y={183} w={4} h={4} bg="rgb(116,53,9)" />
          <Ret x={237 + L} y={183} w={4} h={4} bg="rgb(116,53,9)" />
        </>
      )}
    </div>
  );
};
