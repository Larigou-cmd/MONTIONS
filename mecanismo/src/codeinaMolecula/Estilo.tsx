import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import "../fonts";
import { IDX, Molecula3D } from "./Molecula3D";

// Teste do estilo "molécula neon" (referência que ela mandou em 26/11/2026), antes da narração.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const DURATION_CODEINA_ESTILO = 240;
const AMARELO = "#ffc94d";
const VERDE = "#3dff8f";
const LILAS = "#c6ff3d";

export const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 38%, #0f3a2a 0%, #08221a 45%, #04120f 100%)",
    }}
  >
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", opacity: 0.18 }}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <line
          key={"h" + i}
          x1={0}
          x2={1080}
          y1={1380 + i * i * 4}
          y2={1380 + i * i * 4}
          stroke="#3dff8f"
          strokeWidth={1.5}
        />
      ))}
      {Array.from({ length: 19 }).map((_, i) => (
        <line
          key={"v" + i}
          x1={540 + (i - 9) * 40}
          x2={540 + (i - 9) * 160}
          y1={1380}
          y2={1920}
          stroke="#3dff8f"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  </AbsoluteFill>
);

export const Titulo: React.FC<{
  a: string;
  b: string;
  cor: string;
  c?: string;
}> = ({ a, b, cor, c = "" }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontWeight: 800,
        fontSize: 76,
        letterSpacing: -1.5,
        color: "#f3f0fa",
        opacity: k,
        transform: `translateY(${(1 - k) * 20}px)`,
      }}
    >
      {a}{" "}
      <span style={{ color: cor, textShadow: `0 0 28px ${cor}88` }}>{b}</span>{" "}
      {c}
    </div>
  );
};

export const Legenda: React.FC<{ texto: string; chave: string }> = ({
  texto,
  chave,
}) => {
  const partes = texto.split(chave);
  return (
    <div
      style={{
        position: "absolute",
        top: 1440,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: 52,
        lineHeight: 1.25,
        color: "#f3f0fa",
      }}
    >
      {partes[0]}
      <span style={{ color: LILAS }}>{chave}</span>
      {partes[1]}
    </div>
  );
};

export const CodeinaEstilo: React.FC = () => {
  const f = useCurrentFrame();
  const rot = 0.35 + 0.25 * Math.sin(f * 0.02);
  const forca = interpolate(f, [20, 40], [0, 1], clamp);
  const corte = interpolate(f, [130, 190], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ top: 360, height: 1080 }}>
        <Molecula3D
          width={1080}
          height={1080}
          rot={rot}
          corte={corte}
          zoom={0.76}
          destaques={
            f < 120
              ? [{ atomos: [...IDX.metil, IDX.oxigenio], cor: AMARELO, forca }]
              : [
                  {
                    atomos: [IDX.oxigenio],
                    cor: VERDE,
                    forca: interpolate(f, [170, 200], [0, 1], clamp),
                  },
                ]
          }
        />
      </AbsoluteFill>
      <Sequence durationInFrames={120}>
        <Titulo a="CODEÍNA" b="≈ MORFINA" cor={AMARELO} />
        <Legenda
          texto="a diferença é um pedacinho só: o metil"
          chave="o metil"
        />
      </Sequence>
      <Sequence from={120}>
        <Titulo a="O FÍGADO" b="TROCA A PEÇA" cor={VERDE} />
        <Legenda texto="arranca o metil e deixa só o OH" chave="só o OH" />
      </Sequence>
    </AbsoluteFill>
  );
};
