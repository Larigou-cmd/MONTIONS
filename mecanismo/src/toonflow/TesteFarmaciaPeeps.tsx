// Teste 3: personagens desenhados à mão do Open Peeps (desenhos CC0, react-peeps MIT).
// Os Peeps não têm esqueleto: a animação troca poses e rostos e desliza o corpo.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import Peep from "react-peeps";
import { Enjoo, R, gen, op } from "./TesteFarmaciaRough";

export const DURATION_PEEPS = 300;

const PAPEL = "#f4ecdb";
const LILAS = "#a77bdc";
const CHAO = 1450;
const VB = { x: "0", y: "0", width: "1500", height: "2700" };
const W = 400; // largura do peep na tela
const H = (W * 2700) / 1500;

const PeepEm: React.FC<{
  x: number;
  y: number;
  flip?: boolean;
  rot?: number;
  children: React.ReactNode;
}> = ({ x, y, flip, rot = 0, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - W / 2,
      top: y - H,
      width: W,
      height: H,
      transform: `${flip ? "scaleX(-1)" : ""} rotate(${rot}deg)`,
      transformOrigin: "50% 100%",
    }}
  >
    {children}
  </div>
);

export const TesteFarmaciaPeeps: React.FC = () => {
  const f = useCurrentFrame();
  const seed = 1 + Math.floor(f / 4);
  const tAponta = 45,
    tAnda = 80,
    tPega = 125,
    tBoca = 160,
    tEngole = 178,
    tAlivio = 205;

  const xPac = interpolate(f, [tAnda, tPega - 12], [250, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const andando = f >= tAnda && f < tPega - 12;
  const bob = andando ? -Math.abs(Math.sin(f * 0.35)) * 12 : 0;
  const balanco = f < tAlivio ? Math.sin(f * 0.12) * 2.5 : 0;
  const pulo =
    f >= tAlivio && f < tAlivio + 16
      ? -Math.sin(((f - tAlivio) / 16) * Math.PI) * 30
      : 0;

  const corpoPac = andando ? "WalkingBW" : "ShirtBW";
  const rostoPac =
    f >= tAlivio ? "SmileBig" : f >= tBoca ? "EatingHappy" : "Tired";
  const rostoFar =
    f >= tAlivio ? "SmileBig" : f >= tAponta ? "Explaining" : "Calm";

  const oEnjoo = interpolate(f, [tEngole, tAlivio + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // comprimido: balcão -> mão -> boca
  const BX = 540,
    BY = 1240;
  const pilBalcao: [number, number] = [575, BY - 10];
  const pilBoca: [number, number] = [xPac - 40, CHAO - H * 0.8];
  const k = interpolate(f, [tPega, tBoca], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pil: [number, number] = [
    pilBalcao[0] + (pilBoca[0] - pilBalcao[0]) * k,
    pilBalcao[1] +
      (pilBoca[1] - pilBalcao[1]) * k -
      Math.sin(k * Math.PI) * 120,
  ];

  const cabecaPac: [number, number] = [xPac - 55, CHAO - H * 0.86 + bob];
  const barrigaPac: [number, number] = [xPac - 40, CHAO - H * 0.5 + bob];

  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute" }}
      >
        <R
          d={gen.line(
            40,
            CHAO + 4,
            1040,
            CHAO + 4,
            op(seed + 40, { strokeWidth: 3 }),
          )}
        />
        <R d={gen.rectangle(560, 640, 440, 480, op(seed + 41))} />
        {[760, 880, 1000].map((y, i) => (
          <R
            key={y}
            d={gen.line(560, y, 1000, y, op(seed + 42 + i, { strokeWidth: 4 }))}
          />
        ))}
        {[0, 1, 2, 3].map((rw) =>
          [0, 1, 2, 3, 4].map((c) => (
            <R
              key={`${rw}${c}`}
              d={gen.rectangle(
                585 + c * 82,
                670 + rw * 120 + (c % 2) * 14,
                46,
                74 - (c % 2) * 14,
                op(seed + 50 + rw * 5 + c, { strokeWidth: 3 }),
              )}
            />
          )),
        )}
      </svg>

      {/* farmacêutica: jaleco com estetoscópio, cabelo cacheado preso */}
      <PeepEm x={790} y={CHAO} flip rot={Math.sin(f * 0.1) * 1.2}>
        <Peep
          viewBox={VB}
          style={{ width: W, height: H }}
          body="DocStethoscope"
          face={rostoFar}
          hair="BunCurly"
          strokeColor="#1d1a16"
          backgroundColor="#ffffff"
        />
      </PeepEm>

      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute" }}
      >
        <R
          d={gen.rectangle(
            BX,
            BY,
            440,
            CHAO - BY,
            op(seed + 70, { fill: PAPEL, fillStyle: "solid" }),
          )}
        />
        <R
          d={gen.rectangle(
            BX - 18,
            BY - 18,
            476,
            26,
            op(seed + 71, { fill: "#e9dfc8", fillStyle: "solid" }),
          )}
        />
        {f >= tAponta && f < tPega && (
          <R
            d={gen.linearPath(
              [
                [700, 1130],
                [640, 1180],
                [600, 1205],
              ],
              op(seed + 74, { stroke: LILAS, strokeWidth: 5 }),
            )}
          />
        )}
        {f < tPega && (
          <R
            d={gen.ellipse(
              pilBalcao[0],
              pilBalcao[1],
              64,
              34,
              op(seed + 73, { stroke: LILAS, strokeWidth: 4 }),
            )}
          />
        )}
      </svg>

      {/* paciente */}
      <PeepEm x={xPac} y={CHAO + 8 + bob + pulo} rot={balanco}>
        <Peep
          viewBox={VB}
          style={{ width: W, height: H }}
          body={corpoPac === "ShirtBW" ? "ShirtPantsBW" : corpoPac}
          face={rostoPac}
          hair="ShortMessy"
          strokeColor="#1d1a16"
          backgroundColor="#ffffff"
        />
      </PeepEm>

      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute" }}
      >
        {f < tEngole && (
          <R
            d={gen.ellipse(
              pil[0],
              pil[1],
              34,
              18,
              op(seed + 72, {
                fill: "#ffffff",
                fillStyle: "solid",
                strokeWidth: 3.5,
              }),
            )}
          />
        )}
        <Enjoo
          f={f}
          x={cabecaPac[0]}
          y={cabecaPac[1]}
          r={95}
          o={oEnjoo}
          seed={seed}
        />
        <Enjoo
          f={f + 30}
          x={barrigaPac[0]}
          y={barrigaPac[1]}
          r={80}
          o={oEnjoo}
          seed={seed + 5}
        />
      </svg>
    </AbsoluteFill>
  );
};
