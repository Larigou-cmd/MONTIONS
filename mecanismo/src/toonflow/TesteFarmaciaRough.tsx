// Teste 2: esqueleto e poses do ToonFlow (MIT) desenhados com o traço à mão do Rough.js (MIT).
// Mesma cena da farmácia. O traço "treme" trocando a semente a cada 4 quadros.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import rough from "roughjs";
import {
  Joints,
  Key,
  P,
  Pose,
  SMOOTH,
  STAND,
  groundY,
  poseAt,
  solve,
} from "./stickman/stick";

export const DURATION_TOON_ROUGH = 300;

const INK = "#1d1a16";
const PAPEL = "#f4ecdb";
const LILAS = "#a77bdc";
const PELE = "#8d5a3b";
const S = 2.3;
const CHAO = 1450;
const GY = groundY(S, CHAO);

export const gen = rough.generator();

// Desenha um "drawable" do Rough.js como <path>
export const R: React.FC<{ d: ReturnType<typeof gen.line> }> = ({ d }) => (
  <>
    {gen.toPaths(d).map((p, i) => (
      <path
        key={i}
        d={p.d}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fill={p.fill ?? "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </>
);

export const op = (seed: number, extra: object = {}) => ({
  seed,
  roughness: 1.3,
  bowing: 1.2,
  stroke: INK,
  strokeWidth: 5,
  ...extra,
});

type Rosto = "triste" | "neutro" | "feliz";

const Boneco: React.FC<{
  j: Joints;
  seed: number;
  facing: number;
  rosto: Rosto;
  tipo: "paciente" | "farma";
  mao?: boolean;
}> = ({ j, seed, facing, rosto, tipo, mao }) => {
  const [hx, hy] = j.headC;
  const r = j.headR;
  const corpo = [j.neck, j.hip];
  const braco = (
    o: [number, number],
    e: [number, number],
    h: [number, number],
  ) => gen.linearPath([o, e, h], op(seed + 3));
  const olhoX = facing * r * 0.28;
  return (
    <g>
      {/* pernas */}
      <R d={gen.linearPath([j.lFoot, j.lKnee, j.hip], op(seed + 1))} />
      <R d={gen.linearPath([j.rFoot, j.rKnee, j.hip], op(seed + 2))} />
      {/* roupa */}
      {tipo === "paciente" ? (
        <R
          d={gen.polygon(
            [
              [j.shoulder[0] - 22, j.shoulder[1] - 6],
              [j.shoulder[0] + 22, j.shoulder[1] - 6],
              [j.hip[0] + 20, j.hip[1] + 4],
              [j.hip[0] - 20, j.hip[1] + 4],
            ],
            op(seed + 4, {
              fill: "#8f8a84",
              fillStyle: "hachure",
              hachureGap: 7,
              fillWeight: 2.5,
            }),
          )}
        />
      ) : (
        <>
          <R
            d={gen.polygon(
              [
                [j.shoulder[0] - 26, j.shoulder[1] - 8],
                [j.shoulder[0] + 26, j.shoulder[1] - 8],
                [j.hip[0] + 40, j.hip[1] + 70],
                [j.hip[0] - 40, j.hip[1] + 70],
              ],
              op(seed + 4, { fill: "#ffffff", fillStyle: "solid" }),
            )}
          />
          <R
            d={gen.line(
              j.shoulder[0],
              j.shoulder[1] + 10,
              j.hip[0],
              j.hip[1] + 70,
              op(seed + 5, { strokeWidth: 3 }),
            )}
          />
          <R
            d={gen.rectangle(
              j.shoulder[0] - facing * 26 - 10,
              j.shoulder[1] + 30,
              22,
              15,
              op(seed + 6, {
                fill: "#39ff7a",
                fillStyle: "solid",
                strokeWidth: 3,
              }),
            )}
          />
        </>
      )}
      <R d={gen.linearPath(corpo, op(seed + 7))} />
      {/* braços */}
      <R d={braco(j.shoulder, j.lElbow, j.lHand)} />
      <R d={braco(j.shoulder, j.rElbow, j.rHand)} />
      {mao && (
        <R
          d={gen.ellipse(
            j.rHand[0],
            j.rHand[1] - 6,
            30,
            16,
            op(seed + 8, {
              fill: "#ffffff",
              fillStyle: "solid",
              strokeWidth: 3.5,
            }),
          )}
        />
      )}
      {/* cabelo de trás da farmacêutica */}
      {tipo === "farma" && (
        <>
          <R
            d={gen.circle(
              hx - facing * r * 0.9,
              hy - r * 0.9,
              r * 1.1,
              op(seed + 9, { fill: "#2a1a12", fillStyle: "solid" }),
            )}
          />
          <R
            d={gen.circle(
              hx - facing * r * 1.25,
              hy - r * 0.45,
              r * 0.75,
              op(seed + 10, { fill: "#2a1a12", fillStyle: "solid" }),
            )}
          />
        </>
      )}
      {/* cabeça */}
      <R
        d={gen.circle(
          hx,
          hy,
          r * 2,
          op(seed + 11, {
            fill: tipo === "farma" ? PELE : "#fbf6ea",
            fillStyle: "solid",
          }),
        )}
      />
      {tipo === "farma" && (
        <R
          d={gen.arc(
            hx,
            hy,
            r * 2.1,
            r * 2.1,
            Math.PI * 1.05,
            Math.PI * 1.95,
            true,
            op(seed + 12, { fill: "#2a1a12", fillStyle: "solid" }),
          )}
        />
      )}
      {tipo === "paciente" && (
        <R
          d={gen.linearPath(
            [
              [hx - r * 0.7, hy - r * 0.7],
              [hx - r * 0.2, hy - r * 1.05],
              [hx + r * 0.3, hy - r * 0.8],
              [hx + r * 0.7, hy - r * 1.0],
            ],
            op(seed + 12, { strokeWidth: 4 }),
          )}
        />
      )}
      {/* rosto */}
      <circle cx={hx + olhoX - 9} cy={hy - 3} r={4.5} fill={INK} />
      <circle cx={hx + olhoX + 9} cy={hy - 3} r={4.5} fill={INK} />
      {rosto === "triste" && (
        <R
          d={gen.arc(
            hx + olhoX,
            hy + 18,
            26,
            16,
            Math.PI * 1.15,
            Math.PI * 1.85,
            false,
            op(seed + 13, { strokeWidth: 3.5 }),
          )}
        />
      )}
      {rosto === "feliz" && (
        <R
          d={gen.arc(
            hx + olhoX,
            hy + 6,
            28,
            20,
            Math.PI * 0.15,
            Math.PI * 0.85,
            false,
            op(seed + 13, { strokeWidth: 3.5 }),
          )}
        />
      )}
      {rosto === "neutro" && (
        <R
          d={gen.line(
            hx + olhoX - 8,
            hy + 12,
            hx + olhoX + 8,
            hy + 12,
            op(seed + 13, { strokeWidth: 3.5 }),
          )}
        />
      )}
    </g>
  );
};

export const Enjoo: React.FC<{
  f: number;
  x: number;
  y: number;
  r: number;
  o: number;
  seed: number;
}> = ({ f, x, y, r, o, seed }) => (
  <g opacity={o}>
    {[0, 1].map((i) => {
      const rr = r + i * 20 + Math.sin(f * 0.15 + i) * 5;
      return (
        <g
          key={i}
          transform={`rotate(${Math.sin((f + i * 25) * 0.08) * 14} ${x} ${y})`}
        >
          <R
            d={gen.ellipse(
              x,
              y,
              rr * 2,
              rr * 0.75,
              op(seed + 20 + i, {
                stroke: LILAS,
                strokeWidth: 5,
                roughness: 2,
              }),
            )}
          />
        </g>
      );
    })}
  </g>
);

export const TesteFarmaciaRough: React.FC = () => {
  const f = useCurrentFrame();
  const seed = 1 + Math.floor(f / 4);

  const tAponta = 45,
    tAnda = 80,
    tPega = 125,
    tBoca = 160,
    tEngole = 178,
    tAlivio = 205;
  const enjoado = {
    lean: 16,
    head: 16,
    la1: 25,
    la2: -105,
    ra1: 32,
    ra2: -112,
  };
  const pac: Key[] = [
    { f: 0, p: { ...P.stand, ...enjoado, x: 230, y: GY } },
    { f: tAnda, p: { ...P.stand, ...enjoado, x: 230, y: GY } },
    {
      f: tPega - 12,
      p: { ...P.stand, ...enjoado, x: 410, y: GY },
      e: SMOOTH,
      dur: 32,
    },
    {
      f: tPega,
      p: {
        ...P.stand,
        lean: 8,
        head: 8,
        la1: 25,
        la2: -105,
        ra1: 92,
        ra2: 0,
        x: 410,
        y: GY,
      },
      e: SMOOTH,
      dur: 12,
    },
    {
      f: tBoca,
      p: { ...P.think, lean: 2, la1: 25, la2: -105, x: 410, y: GY },
      e: SMOOTH,
      dur: 20,
    },
    { f: tAlivio, p: { ...P.cheer, x: 410, y: GY }, e: SMOOTH, dur: 14 },
    { f: tAlivio + 40, p: { ...P.stand, x: 410, y: GY }, e: SMOOTH, dur: 20 },
  ];
  const farma: Key[] = [
    { f: 0, p: { ...P.stand, x: 760, y: GY } },
    { f: tAponta, p: { ...P.pointR, x: 760, y: GY }, e: SMOOTH, dur: 14 },
    { f: tPega, p: { ...P.stand, x: 760, y: GY }, e: SMOOTH, dur: 16 },
    { f: tAlivio, p: { ...P.cheer, x: 760, y: GY }, e: SMOOTH, dur: 14 },
    { f: tAlivio + 40, p: { ...P.stand, x: 760, y: GY }, e: SMOOTH, dur: 20 },
  ];
  const balanco = (p: Pose, a: number) => ({
    ...p,
    head: p.head + Math.sin(f * 0.12 + a) * 3,
  });
  const pPac = balanco(poseAt(f, pac, { ...STAND, y: GY }), 0);
  const pFar = balanco(poseAt(f, farma, { ...STAND, y: GY }), 2);
  const jPac = solve(pPac, S, 1);
  const jFar = solve(pFar, S, -1);
  const oEnjoo = interpolate(f, [tEngole, tAlivio + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const BX = 540,
    BY = 1240;
  const pilula: [number, number] = [575, BY - 10];

  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {/* chão */}
        <R
          d={gen.line(
            40,
            CHAO + 4,
            1040,
            CHAO + 4,
            op(seed + 40, { strokeWidth: 3 }),
          )}
        />
        {/* prateleiras */}
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
        <Boneco
          j={jFar}
          seed={seed + 100}
          facing={-1}
          rosto={f >= tAlivio ? "feliz" : "neutro"}
          tipo="farma"
        />
        {/* balcão */}
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
        {f < tPega && (
          <>
            <R
              d={gen.ellipse(
                pilula[0],
                pilula[1],
                34,
                18,
                op(seed + 72, {
                  fill: "#ffffff",
                  fillStyle: "solid",
                  strokeWidth: 3.5,
                }),
              )}
            />
            <R
              d={gen.ellipse(
                pilula[0],
                pilula[1],
                64,
                34,
                op(seed + 73, { stroke: LILAS, strokeWidth: 4 }),
              )}
            />
          </>
        )}
        <Boneco
          j={jPac}
          seed={seed + 200}
          facing={1}
          rosto={f >= tAlivio ? "feliz" : f >= tEngole ? "neutro" : "triste"}
          tipo="paciente"
          mao={f >= tPega && f < tEngole}
        />
        <Enjoo
          f={f}
          x={jPac.headC[0]}
          y={jPac.headC[1] - 12}
          r={66}
          o={oEnjoo}
          seed={seed}
        />
        <Enjoo
          f={f + 30}
          x={(jPac.shoulder[0] + jPac.hip[0]) / 2}
          y={(jPac.shoulder[1] + jPac.hip[1]) / 2 + 20}
          r={52}
          o={oEnjoo}
          seed={seed + 5}
        />
      </svg>
    </AbsoluteFill>
  );
};
