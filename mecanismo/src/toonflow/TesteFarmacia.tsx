// Teste do motor ToonFlow (MIT, github.com/ZALPRO/toonflow) no canal Farma.exe.
// Mesma cena dos testes do Flow e do PixVerse: paciente enjoado, farmacêutica aponta o
// comprimido, ele toma e melhora. 10 s, 1080x1920, sem som e sem texto.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Stage } from "./stickman/common";
import { Burst } from "./stickman/fx";
import {
  Actor,
  Joints,
  P,
  SMOOTH,
  V_GROUND_Y,
  groundY,
  idle,
} from "./stickman/stick";

export const DURATION_TOON_TESTE = 300;

const LILAS = "#a77bdc";
const PELE = "#8d5a3b";
const INK = "#1a1a1a";
const SCALE = 1.7;
const GY = groundY(SCALE, V_GROUND_Y);

const BALCAO_X = 560;
const BALCAO_Y = 1085;
const COMPRIMIDO: [number, number] = [590, BALCAO_Y - 9];

// Jaleco branco desenhado por cima do corpo (o motor pinta o corpo inteiro numa cor só)
const Jaleco: React.FC<{ j: Joints }> = ({ j }) => {
  const [sx, sy] = j.shoulder;
  const [hx, hy] = j.hip;
  const w1 = 20 * SCALE;
  const w2 = 27 * SCALE;
  const base = hy + 30 * SCALE;
  const d = `M${sx - w1},${sy - 4} L${sx + w1},${sy - 4} L${hx + w2},${base} L${hx - w2},${base} Z`;
  return (
    <g>
      <path
        d={d}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <line x1={sx} y1={sy} x2={hx} y2={base} stroke={INK} strokeWidth={3} />
      <path
        d={`M${sx - 12},${sy - 4} L${sx},${sy + 22} L${sx + 12},${sy - 4}`}
        fill="none"
        stroke={INK}
        strokeWidth={3}
      />
      <rect
        x={sx - w1 * 0.75}
        y={sy + 26}
        width={22}
        height={15}
        rx={3}
        fill="#39ff7a"
        stroke={INK}
        strokeWidth={3}
      />
    </g>
  );
};

// Ondas lilás do enjoo em volta de um ponto
const Enjoo: React.FC<{
  f: number;
  x: number;
  y: number;
  r: number;
  op: number;
}> = ({ f, x, y, r, op }) => (
  <g opacity={op}>
    {[0, 1, 2].map((i) => {
      const rr = r + i * 16 + Math.sin(f * 0.15 + i) * 4;
      const a = f * 2.4 + i * 120;
      return (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={rr}
          ry={rr * 0.38}
          transform={`rotate(${Math.sin((f + i * 20) * 0.08) * 12} ${x} ${y})`}
          fill="none"
          stroke={LILAS}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${rr * 1.6} ${rr * 0.9}`}
          strokeDashoffset={a}
        />
      );
    })}
  </g>
);

export const TesteFarmaciaToon: React.FC = () => {
  const f = useCurrentFrame();

  const tAponta = 45;
  const tAnda = 80;
  const tPega = 125;
  const tBoca = 160;
  const tEngole = 178;
  const tAlivio = 205;

  // Paciente: enjoado, anda até o balcão, pega, leva à boca, melhora
  const enjoado = { lean: 16, head: 16, la1: 25, la2: -105, ra1: 32, ra2: -112 };
  const pacienteKeys = [
    { f: 0, p: { ...P.stand, ...enjoado, x: 280, y: GY } },
    { f: tAnda, p: { ...P.stand, ...enjoado, x: 280, y: GY } },
    {
      f: tPega - 12,
      p: { ...P.stand, ...enjoado, x: 455, y: GY },
      e: SMOOTH,
      dur: 32,
    },
    {
      f: tPega,
      p: {
        ...P.stand,
        lean: 8,
        head: 8,
        la1: 30,
        la2: 70,
        ra1: 95,
        ra2: 0,
        x: 455,
        y: GY,
      },
      e: SMOOTH,
      dur: 12,
    },
    {
      f: tBoca,
      p: { ...P.think, lean: 2, la1: 25, la2: -105, x: 455, y: GY },
      e: SMOOTH,
      dur: 20,
    },
    { f: tAlivio, p: { ...P.cheer, x: 455, y: GY }, e: SMOOTH, dur: 14 },
    { f: tAlivio + 40, p: { ...P.stand, x: 455, y: GY }, e: SMOOTH, dur: 20 },
  ];

  // Farmacêutica atrás do balcão, de frente para o paciente (facing -1 = olhando para a esquerda)
  const farmaKeys = [
    { f: 0, p: { ...P.stand, x: 760, y: GY } },
    { f: tAponta, p: { ...P.pointR, x: 760, y: GY }, e: SMOOTH, dur: 14 },
    { f: tPega, p: { ...P.stand, x: 760, y: GY }, e: SMOOTH, dur: 16 },
    { f: tAlivio, p: { ...P.cheer, x: 760, y: GY }, e: SMOOTH, dur: 14 },
    { f: tAlivio + 40, p: { ...P.stand, x: 760, y: GY }, e: SMOOTH, dur: 20 },
  ];

  const opEnjoo = interpolate(f, [tEngole, tAlivio + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const naMao = f >= tPega && f < tEngole;
  const noBalcao = f < tPega;

  return (
    <Stage
      hits={[tAlivio]}
      cam={{ x: 45, y: 0, z: 1.5 }}
      power={6}
      theme="default"
      svg={
        <>
          {/* Prateleiras da farmácia */}
          <g stroke={INK} strokeWidth={5} fill="none" opacity={0.85}>
            <rect
              x={600}
              y={600}
              width={320}
              height={380}
              rx={6}
              fill="#f3efe4"
            />
            {[700, 800, 900].map((y) => (
              <line key={y} x1={600} y1={y} x2={920} y2={y} />
            ))}
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={618 + c * 60}
                  y={625 + r * 100 - (c % 2) * 8}
                  width={40}
                  height={60 - ((c + r) % 3) * 10 + (c % 2) * 8}
                  rx={4}
                  fill="#ffffff"
                  strokeWidth={3}
                />
              )),
            )}
          </g>

          <Actor
            f={f}
            keys={farmaKeys}
            color={PELE}
            hat="ponytail"
            scale={SCALE}
            facing={-1}
            face={(t) => (t >= tAlivio ? "happy" : "smirk")}
            extra={idle(f, 3)}
            trails={false}
          >
            {(j) => <Jaleco j={j} />}
          </Actor>

          {/* Balcão (esconde a farmacêutica da cintura para baixo) */}
          <g>
            <rect
              x={BALCAO_X}
              y={BALCAO_Y}
              width={330}
              height={V_GROUND_Y - BALCAO_Y}
              fill="#ffffff"
              stroke={INK}
              strokeWidth={6}
            />
            <rect
              x={BALCAO_X - 14}
              y={BALCAO_Y - 14}
              width={358}
              height={22}
              rx={6}
              fill="#efe9dc"
              stroke={INK}
              strokeWidth={6}
            />
            <line
              x1={BALCAO_X + 40}
              y1={BALCAO_Y + 70}
              x2={BALCAO_X + 300}
              y2={BALCAO_Y + 70}
              stroke={INK}
              strokeWidth={3}
              opacity={0.5}
            />
          </g>

          {/* Comprimido em cima do balcão */}
          {noBalcao && (
            <g>
              <ellipse
                cx={COMPRIMIDO[0]}
                cy={COMPRIMIDO[1]}
                rx={17}
                ry={9}
                fill="#ffffff"
                stroke={INK}
                strokeWidth={4}
              />
              <ellipse
                cx={COMPRIMIDO[0]}
                cy={COMPRIMIDO[1]}
                rx={27}
                ry={15}
                fill="none"
                stroke={LILAS}
                strokeWidth={4}
                opacity={0.5 + 0.5 * Math.sin(f * 0.25)}
              />
            </g>
          )}

          <Actor
            f={f}
            keys={pacienteKeys}
            color="#7d7d86"
            scale={SCALE}
            facing={1}
            face={(t) =>
              t >= tAlivio ? "happy" : t >= tEngole ? "eyes" : "sad"
            }
            extra={f < tAlivio ? { head: Math.sin(f * 0.12) * 4 } : idle(f, 1)}
          >
            {(j) => (
              <>
                {naMao && (
                  <ellipse
                    cx={j.rHand[0]}
                    cy={j.rHand[1] - 6}
                    rx={15}
                    ry={8}
                    fill="#ffffff"
                    stroke={INK}
                    strokeWidth={4}
                  />
                )}
                <Enjoo
                  f={f}
                  x={j.headC[0]}
                  y={j.headC[1] - 10}
                  r={52}
                  op={opEnjoo}
                />
                <Enjoo
                  f={f + 30}
                  x={(j.shoulder[0] + j.hip[0]) / 2}
                  y={(j.shoulder[1] + j.hip[1]) / 2 + 20}
                  r={40}
                  op={opEnjoo}
                />
              </>
            )}
          </Actor>

          <Burst x={455} y={840} at={tAlivio} f={f} color={LILAS} size={150} />
        </>
      }
    />
  );
};
