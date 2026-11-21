// Ibuprofeno, estilo "uma molécula só": a câmera segue UMA molécula, sem cortes,
// do estômago até o rim. Tempos em quadros (30 fps), medidos em ibuprofeno_molecula/fala.json.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { SANS } from "../fonts";

export const DURATION_IBUPROFENO = 1800;

const K = {
  bg: "#09080f",
  bg2: "#1b1730",
  ink: "#f1eef7",
  dim: "#a8a2c4",
  faint: "#3d3858",
  lime: "#ff3b4e", // protagonista (vermelho, como na referência)
  yellow: "#f2c14e",
  red: "#ff9a3c", // risco no estômago (âmbar)
  blood: "#6e2f45",
};

const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const cl = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const it = (
  f: number,
  a: number,
  b: number,
  v0: number,
  v1: number,
  e = EASE,
) => interpolate(f, [a, b], [v0, v1], { ...cl, easing: e });
const P = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], cl);
const fade = (f: number, a: number, b: number, d = 12) =>
  Math.min(P(f, a, a + d), 1 - P(f, b - d, b));
const lerpPts = (f: number, keys: [number, number, number][]) => {
  const fs = keys.map((k) => k[0]);
  return [
    interpolate(
      f,
      fs,
      keys.map((k) => k[1]),
      { ...cl, easing: EASE },
    ),
    interpolate(
      f,
      fs,
      keys.map((k) => k[2]),
      { ...cl, easing: EASE },
    ),
  ];
};

// ---------- tempos ----------
const T = {
  siga: 1544,
  final: 1672,
  dock: 575,
  solta: 760,
  docaParede: 960,
  soltaParede: 1094,
  corte: 1120,
  zoomOut: 1272,
};

const LEGENDAS: [number, number, string][] = [
  [0, 68, "Uma molécula de ibuprofeno."],
  [70, 122, "Ela não cura a sua dor:"],
  [124, 183, "ela desliga o alarme."],
  [185, 252, "Do estômago, ela cai no sangue."],
  [254, 325, "Em uma a duas horas, chega ao pico."],
  [327, 359, "No lugar que dói,"],
  [361, 432, "as células fabricam prostaglandinas."],
  [434, 537, "É o alarme que acende a dor, o inchaço e a febre."],
  [539, 631, "O ibuprofeno trava a máquina que faz esse alarme:"],
  [633, 679, "a enzima COX."],
  [681, 745, "Só que ele não escolhe onde trava."],
  [747, 801, "No estômago, essa mesma enzima"],
  [803, 881, "mantém a camada que protege a parede do ácido."],
  [883, 959, "Por isso, tomar com comida ajuda,"],
  [961, 1017, "mas não zera o risco."],
  [1019, 1092, "Parte do efeito chega pelo sangue."],
  [1094, 1153, "Depois, o fígado desmonta a molécula"],
  [1155, 1194, "e o rim leva embora."],
  [1196, 1270, "A cada duas horas, cai pela metade."],
  [1272, 1344, "Use a menor dose pelo menor tempo."],
  [1346, 1425, "Tem gastrite ou úlcera? Pergunte antes."],
  [1427, 1517, "E você, toma com comida ou de estômago vazio?"],
  [1519, 1543, "Conta aqui."],
];

// caminho da molécula protagonista (quadro, x, y) no "mundo"
const CAMINHO: [number, number, number][] = [
  [0, 20, -170],
  [150, 70, -60],
  [200, 330, 190],
  [250, 1150, 0],
  [320, 1900, 10],
  [380, 2600, -10],
  [440, 3150, -60],
  [500, 3650, -40],
  [T.dock, 3985, 52],
  [745, 3985, 52],
  [790, 4300, 330],
  [880, 4900, 380],
  [940, 5060, 250],
  [T.docaParede, 5085, 152],
  [1085, 5085, 152],
  [1110, 5500, 380],
  [T.corte, 6700, 40],
  [1155, 6800, 20],
  [1200, 7500, 120],
  [1270, 8350, 40],
  [1400, 8560, 20],
  [1540, 8750, 520],
];

// relógio da história: quadro -> minutos desde que tomou
const RELOGIO: [number, number][] = [
  [0, 0],
  [185, 5],
  [254, 20],
  [290, 45],
  [305, 90],
  [540, 100],
  [1090, 120],
  [1196, 210],
  [1246, 330],
  [1400, 450],
  [1540, 480],
];
const minutos = (f: number) =>
  interpolate(
    f,
    RELOGIO.map((r) => r[0]),
    RELOGIO.map((r) => r[1]),
    cl,
  );
const pctDe = (m: number) => {
  if (m <= 90)
    return interpolate(m, [0, 5, 20, 45, 90], [0, 4, 45, 85, 100], cl);
  return 100 * Math.pow(0.5, (m - 90) / 120);
};
const fmtTempo = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = Math.round(m % 60);
  return h > 0 ? `${h} h ${String(mm).padStart(2, "0")}` : `${mm} min`;
};

// ---------- peças desenhadas ----------
const Ibuprofeno: React.FC<{
  x: number;
  y: number;
  s?: number;
  cor?: string;
  glow?: number;
  rot?: number;
  quebra?: number;
}> = ({ x, y, s = 1, cor = K.lime, glow = 1, rot = 0, quebra = 0 }) => {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return [Math.cos(a) * 26, Math.sin(a) * 26];
  });
  const d =
    hex.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ") + "Z";
  const sep = quebra * 46;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {glow > 0 && (
        <circle r={70} fill={cor} opacity={0.18 * glow} filter="url(#blur)" />
      )}
      <g
        stroke={cor}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* lado isobutil */}
        <g transform={`translate(${-sep},${-sep * 0.4})`}>
          <path d="M-22.5,13 L-48,28 L-72,14 M-72,14 L-96,28 M-72,14 L-72,-14" />
        </g>
        {/* anel */}
        <path d={d} />
        <path d="M-13,-8 L0,-16 M13,-8 L13,8" opacity={0.7} />
        {/* lado ácido */}
        <g transform={`translate(${sep},${sep * 0.5})`}>
          <path d="M22.5,-13 L48,-28 L48,-56 M48,-28 L72,-14 L72,14 M72,-14 L96,-28" />
          <circle cx={72} cy={14} r={6} fill={cor} stroke="none" />
        </g>
      </g>
    </g>
  );
};

const Prostaglandina: React.FC<{
  x: number;
  y: number;
  rot: number;
  op: number;
}> = ({ x, y, rot, op }) => (
  <g
    transform={`translate(${x},${y}) rotate(${rot})`}
    opacity={op}
    stroke={K.ink}
    strokeWidth={3}
    fill="none"
    strokeLinecap="round"
  >
    <path d="M-30,-8 L-16,4 L0,-8 L16,4 L30,-8" />
    <path d="M-30,10 L-14,20 L4,10 L22,20" opacity={0.7} />
    <circle cx={-30} cy={-8} r={4} fill={K.ink} />
  </g>
);

const Cox: React.FC<{
  x: number;
  y: number;
  ativa: number;
  travada: number;
  s?: number;
}> = ({ x, y, ativa, travada, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path
      d="M-70,30 C-90,-20 -60,-60 -20,-55 L-12,-18 L12,-18 L20,-55 C60,-60 90,-20 70,30 C50,60 -50,60 -70,30 Z"
      fill="#2a2445"
      stroke={travada > 0 ? K.lime : K.dim}
      strokeWidth={4}
      opacity={0.95}
    />
    <circle
      cx={-38}
      cy={14}
      r={7}
      fill={K.yellow}
      opacity={0.25 + 0.75 * ativa}
    />
    <circle
      cx={38}
      cy={14}
      r={7}
      fill={K.yellow}
      opacity={0.25 + 0.75 * ativa}
    />
    {travada > 0 && (
      <circle
        r={60 + 50 * travada}
        fill="none"
        stroke={K.lime}
        strokeWidth={4}
        opacity={1 - travada}
      />
    )}
  </g>
);

const Celula: React.FC<{
  x: number;
  y: number;
  r: number;
  seed: number;
  cor?: string;
}> = ({ x, y, r, seed, cor = K.dim }) => {
  const pts = Array.from({ length: 9 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 9;
    const rr = r * (0.86 + 0.22 * random(`c${seed}-${i}`));
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  });
  return (
    <g>
      <polygon
        points={pts.join(" ")}
        fill={K.bg2}
        stroke={cor}
        strokeWidth={3}
        opacity={0.75}
        strokeLinejoin="round"
      />
      <circle
        cx={x + r * 0.25}
        cy={y - r * 0.2}
        r={r * 0.22}
        fill="none"
        stroke={cor}
        strokeWidth={2}
        opacity={0.5}
      />
    </g>
  );
};

const Rotulo: React.FC<{
  x: number;
  y: number;
  t: string;
  op: number;
  cor?: string;
  size?: number;
}> = ({ x, y, t, op, cor = K.dim, size = 30 }) => (
  <text
    x={x}
    y={y}
    fill={cor}
    opacity={op}
    fontFamily={SANS}
    fontWeight={600}
    fontSize={size}
    textAnchor="middle"
    letterSpacing={1}
  >
    {t}
  </text>
);

// vaso de sangue horizontal
const Vaso: React.FC<{
  x0: number;
  x1: number;
  y: number;
  h: number;
  f: number;
  seed: string;
}> = ({ x0, x1, y, h, f, seed }) => {
  const n = Math.floor((x1 - x0) / 120);
  return (
    <g>
      <rect
        x={x0}
        y={y - h / 2}
        width={x1 - x0}
        height={h}
        fill="#1a0f14"
        opacity={0.55}
      />
      <line
        x1={x0}
        x2={x1}
        y1={y - h / 2}
        y2={y - h / 2}
        stroke={K.blood}
        strokeWidth={6}
      />
      <line
        x1={x0}
        x2={x1}
        y1={y + h / 2}
        y2={y + h / 2}
        stroke={K.blood}
        strokeWidth={6}
      />
      {Array.from({ length: n }, (_, i) => {
        const span = x1 - x0;
        const xx =
          x0 + ((i * 120 + f * 3.2 + random(`${seed}${i}`) * 80) % span);
        const yy = y + (random(`${seed}y${i}`) - 0.5) * (h - 40);
        return (
          <ellipse
            key={i}
            cx={xx}
            cy={yy}
            rx={22}
            ry={11}
            fill="none"
            stroke={K.blood}
            strokeWidth={4}
            opacity={0.8}
          />
        );
      })}
    </g>
  );
};

// ---------- o mundo ----------
const Mundo: React.FC<{ f: number; mx: number; my: number }> = ({
  f,
  mx,
  my,
}) => {
  // dor: os alarmes acendem até a COX ser travada
  const alarme = (1 - P(f, T.dock, T.dock + 30)) * P(f, 300, 340);
  const travouDor = P(f, T.dock, T.dock + 24);
  const travouParede = P(f, T.docaParede, T.docaParede + 24);
  const camada = 1 - 0.65 * P(f, 990, 1080);
  const quebra = P(f, T.corte, T.corte + 30);

  return (
    <g>
      {/* Z1 estômago (luz do estômago) */}
      <ellipse
        cx={0}
        cy={-60}
        rx={1100}
        ry={520}
        fill="url(#g4a2a14)"
        opacity={0.95}
      />
      <ellipse
        cx={1900}
        cy={0}
        rx={1300}
        ry={420}
        fill="url(#g3a1f3a)"
        opacity={0.95}
      />
      <ellipse
        cx={3900}
        cy={0}
        rx={1000}
        ry={520}
        fill="url(#g2a2552)"
        opacity={0.95}
      />
      <ellipse
        cx={5100}
        cy={0}
        rx={1000}
        ry={520}
        fill="url(#g4a2a14)"
        opacity={0.95}
      />
      <ellipse
        cx={6800}
        cy={20}
        rx={800}
        ry={480}
        fill="url(#g3b2a18)"
        opacity={0.95}
      />
      <ellipse
        cx={8400}
        cy={150}
        rx={900}
        ry={600}
        fill="url(#g2a2552)"
        opacity={0.95}
      />
      {Array.from({ length: 26 }, (_, i) => {
        const x = -700 + random(`a${i}`) * 1300;
        const y = -380 + random(`b${i}`) * 420 + Math.sin(f / 20 + i) * 8;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4 + random(`r${i}`) * 6}
            fill={K.red}
            opacity={0.18}
          />
        );
      })}
      {/* comprimido se desfazendo */}
      <g
        opacity={1 - P(f, 60, 170)}
        transform={`translate(-40,-210) rotate(-18) scale(${1 - 0.5 * P(f, 0, 170)})`}
      >
        <rect
          x={-90}
          y={-36}
          width={180}
          height={72}
          rx={36}
          fill={K.ink}
          opacity={0.9}
        />
        <line x1={0} x2={0} y1={-36} y2={36} stroke={K.bg} strokeWidth={4} />
      </g>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        const k = P(f, 20 + i * 6, 170);
        return (
          <Ibuprofeno
            key={i}
            x={-40 + Math.cos(a) * 260 * k}
            y={-210 + Math.sin(a) * 140 * k}
            s={0.55}
            glow={0}
            cor={K.lime}
            rot={i * 50 + f}
          />
        );
      })}
      {/* parede do estômago até o vaso */}
      {Array.from({ length: 7 }, (_, i) => (
        <Celula key={i} x={-300 + i * 160} y={250} r={80} seed={i} />
      ))}

      {/* Z2 sangue */}
      <Vaso x0={700} x1={3150} y={0} h={240} f={f} seed="v" />
      {Array.from({ length: 6 }, (_, i) => (
        <Ibuprofeno
          key={i}
          x={900 + ((i * 420 + f * 4) % 2200)}
          y={(random(`iv${i}`) - 0.5) * 140}
          s={0.45}
          glow={0}
          cor={K.lime}
          rot={f * 2 + i * 60}
        />
      ))}

      {/* Z3 local da dor */}
      {[
        [3500, -200, 130],
        [3800, 170, 150],
        [4250, -150, 120],
        [4450, 230, 110],
      ].map(([x, y, r], i) => (
        <Celula
          key={i}
          x={x}
          y={y}
          r={r}
          seed={20 + i}
          cor={alarme > 0.05 ? K.yellow : K.dim}
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <circle
          key={i}
          cx={3900}
          cy={-20}
          r={150 + ((f * 4 + i * 90) % 360)}
          fill="none"
          stroke={K.yellow}
          strokeWidth={5}
          opacity={alarme * (1 - ((f * 4 + i * 90) % 360) / 360) * 0.8}
        />
      ))}
      <Cox
        x={3985}
        y={70}
        ativa={1 - travouDor}
        travada={P(f, T.dock, T.dock + 26) * (f < T.dock + 26 ? 1 : 0)}
      />
      <Cox x={3600} y={-180} ativa={1 - travouDor} travada={0} s={0.7} />
      {Array.from({ length: 10 }, (_, i) => {
        const t0 = 330 + i * 22;
        const k = ((f - t0) % 120) / 120;
        const vivo = f > t0 ? 1 - travouDor : 0;
        const a = random(`pg${i}`) * Math.PI * 2;
        return (
          <Prostaglandina
            key={i}
            x={3985 + Math.cos(a) * 320 * k}
            y={70 + Math.sin(a) * 260 * k}
            rot={a * 57}
            op={vivo * (1 - k)}
          />
        );
      })}

      {/* Z4 de volta ao estômago: parede em corte */}
      <g>
        {Array.from({ length: 18 }, (_, i) => {
          const x = 4500 + random(`ac${i}`) * 1200;
          const y = -380 + random(`ay${i}`) * 220 + Math.sin(f / 15 + i) * 6;
          return (
            <circle key={i} cx={x} cy={y} r={7} fill={K.red} opacity={0.55} />
          );
        })}
        {/* camada protetora */}
        <rect
          x={4450}
          y={-120 + 70 * (1 - camada)}
          width={1300}
          height={80 * camada}
          fill="#cfe9d9"
          opacity={0.28}
        />
        <line
          x1={4450}
          x2={5750}
          y1={-40}
          y2={-40}
          stroke={K.ink}
          strokeWidth={3}
          opacity={0.5}
        />
        {/* parede com risco */}
        <rect
          x={4450}
          y={-70}
          width={1300}
          height={60}
          fill={K.red}
          opacity={0.75 * P(f, 961, 1000)}
          filter="url(#blur)"
        />
        <line
          x1={4450}
          x2={5750}
          y1={-40}
          y2={-40}
          stroke={K.red}
          strokeWidth={5}
          opacity={P(f, 961, 990)}
        />
        {Array.from({ length: 8 }, (_, i) => (
          <Celula key={i} x={4560 + i * 165} y={110} r={78} seed={40 + i} />
        ))}
        <Cox
          x={5085}
          y={160}
          ativa={1 - travouParede}
          travada={
            P(f, T.docaParede, T.docaParede + 26) *
            (f < T.docaParede + 26 ? 1 : 0)
          }
          s={0.9}
        />
        <Vaso x0={4300} x1={5900} y={380} h={160} f={f} seed="w" />
        {/* comida em cima: protege do contato direto */}
        <g opacity={fade(f, 883, 1100)}>
          {Array.from({ length: 11 }, (_, i) => (
            <ellipse
              key={i}
              cx={4520 + i * 120}
              cy={-150 - 60 * (1 - P(f, 883 + i * 2, 915 + i * 2))}
              rx={62}
              ry={30}
              fill="#e9d9b8"
              opacity={0.85}
            />
          ))}
        </g>
        <g opacity={0} transform="translate(5050,-300)">
          <path
            d="M-120,0 A120,60 0 0 0 120,0 Z"
            fill="none"
            stroke={K.ink}
            strokeWidth={5}
          />
          <circle
            cx={-40}
            cy={-22}
            r={20}
            fill="none"
            stroke={K.ink}
            strokeWidth={4}
          />
          <circle
            cx={10}
            cy={-30}
            r={24}
            fill="none"
            stroke={K.ink}
            strokeWidth={4}
          />
          <circle
            cx={55}
            cy={-18}
            r={16}
            fill="none"
            stroke={K.ink}
            strokeWidth={4}
          />
        </g>
        {/* seta: pelo sangue */}
        <g opacity={fade(f, 1019, 1100)}>
          <path
            d="M5300,330 C5300,260 5200,220 5130,200"
            fill="none"
            stroke={K.lime}
            strokeWidth={6}
            strokeDasharray="14 12"
            strokeDashoffset={-f * 2}
          />
        </g>
      </g>

      {/* Z5 fígado */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (Math.PI / 3) * i;
        const cx = 6800 + (i === 6 ? 0 : Math.cos(a) * 190);
        const cy = 30 + (i === 6 ? 0 : Math.sin(a) * 190);
        return (
          <Celula key={i} x={cx} y={cy} r={95} seed={60 + i} cor="#b6a37a" />
        );
      })}
      <circle
        cx={6800}
        cy={20}
        r={120 + 120 * quebra}
        fill="none"
        stroke={K.ink}
        strokeWidth={4}
        opacity={(1 - quebra) * P(f, T.corte - 6, T.corte)}
      />

      {/* Z6 rim */}
      <path
        d="M7950,-120 C8150,-120 8150,120 8350,120 C8550,120 8550,-120 8750,-120 L8750,650"
        fill="none"
        stroke={K.dim}
        strokeWidth={70}
        opacity={0.25}
        strokeLinecap="round"
      />
      <path
        d="M7950,-120 C8150,-120 8150,120 8350,120 C8550,120 8550,-120 8750,-120 L8750,650"
        fill="none"
        stroke={K.dim}
        strokeWidth={4}
        opacity={0.6}
      />

      {/* protagonista */}
      <Ibuprofeno
        x={mx}
        y={my}
        s={1.15}
        cor={interpolate(quebra, [0, 1], [0, 1]) > 0.6 ? K.dim : K.lime}
        glow={1 - quebra}
        rot={
          f < T.dock
            ? Math.sin(f / 18) * 14
            : f < T.solta
              ? 0
              : f < T.docaParede
                ? Math.sin(f / 18) * 14
                : f < T.soltaParede
                  ? 0
                  : (f - T.soltaParede) * 1.5
        }
        quebra={quebra}
      />
    </g>
  );
};

// ---------- overlays ----------
const Cabecalho: React.FC<{ f: number }> = ({ f }) => {
  const troca = P(f, T.zoomOut, T.zoomOut + 20);
  const op = 1 - P(f, T.siga - 10, T.siga);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 120,
        opacity: op,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          color: K.dim,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 2,
        }}
      >
        <span style={{ color: K.lime }}>■</span> FARMA.EXE · UMA MOLÉCULA SÓ
      </div>
      <div style={{ position: "relative", height: 150, marginTop: 14 }}>
        <div style={{ position: "absolute", opacity: 1 - troca }}>
          <div
            style={{
              color: K.ink,
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.12,
            }}
          >
            Uma molécula de ibuprofeno.
          </div>
          <div
            style={{
              color: K.lime,
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.12,
            }}
          >
            Ela desliga o alarme da dor.
          </div>
        </div>
        <div style={{ position: "absolute", opacity: troca }}>
          <div
            style={{
              color: K.ink,
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.12,
            }}
          >
            Comida ajuda.
          </div>
          <div
            style={{
              color: K.red,
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.12,
            }}
          >
            Não zera o risco.
          </div>
        </div>
      </div>
    </div>
  );
};

const Contador: React.FC<{ f: number }> = ({ f }) => {
  const m = minutos(f);
  const pct = pctDe(m);
  const op = P(f, 170, 200) * (1 - P(f, T.siga - 10, T.siga));
  const W0 = 300,
    H0 = 170;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const mm = (m * i) / 60;
    pts.push(`${(mm / 480) * W0},${H0 - (pctDe(mm) / 100) * H0}`);
  }
  const cx = (m / 480) * W0;
  const cy = H0 - (pct / 100) * H0;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 330,
        opacity: op,
        display: "flex",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <svg width={W0 + 10} height={H0 + 10} style={{ overflow: "visible" }}>
        <line x1={0} x2={W0} y1={H0} y2={H0} stroke={K.faint} strokeWidth={2} />
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={K.lime}
          strokeWidth={4}
        />
        <circle cx={cx} cy={cy} r={8} fill={K.lime} />
      </svg>
      <div style={{ marginLeft: 26, display: "flex", alignItems: "baseline" }}>
        <span
          style={{
            color: K.lime,
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(pct)}
        </span>
        <span
          style={{
            color: K.lime,
            fontSize: 64,
            fontWeight: 800,
            marginLeft: 4,
          }}
        >
          %
        </span>
        <div style={{ marginLeft: 18, lineHeight: 1.25 }}>
          <div style={{ color: K.ink, fontSize: 34, fontWeight: 700 }}>
            do pico no sangue
          </div>
          <div style={{ color: K.dim, fontSize: 32 }}>
            {fmtTempo(m)} desde que tomou
          </div>
          <div style={{ color: K.dim, opacity: 0.7, fontSize: 21 }}>
            valores ilustrativos
          </div>
        </div>
      </div>
    </div>
  );
};

const ETAPAS = ["estômago", "sangue", "dor", "estômago", "fígado", "rim"];
const Rota: React.FC<{ f: number }> = ({ f }) => {
  const op = fade(f, T.zoomOut + 10, T.siga, 14);
  if (op <= 0) return null;
  const y0 = 720,
    dy = 108;
  const k = it(f, T.zoomOut + 10, T.zoomOut + 120, 0, 5);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        opacity: op,
        fontFamily: SANS,
      }}
    >
      <svg width={1080} height={1400} style={{ position: "absolute" }}>
        <line
          x1={330}
          x2={330}
          y1={y0}
          y2={y0 + dy * 5}
          stroke={K.faint}
          strokeWidth={4}
        />
        <line
          x1={330}
          x2={330}
          y1={y0}
          y2={y0 + dy * k}
          stroke={K.lime}
          strokeWidth={6}
        />
        {ETAPAS.map((_, i) => (
          <circle
            key={i}
            cx={330}
            cy={y0 + dy * i}
            r={14}
            fill={k >= i ? K.lime : K.bg}
            stroke={i === 3 ? K.red : K.lime}
            strokeWidth={4}
          />
        ))}
        <g transform={`translate(330,${y0 + dy * k})`}>
          <circle r={34} fill={K.lime} opacity={0.25} />
        </g>
      </svg>
      {ETAPAS.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 380,
            top: y0 + dy * i - 24,
            fontSize: 40,
            fontWeight: 700,
            color: i === 3 ? K.red : k >= i - 0.3 ? K.ink : K.dim,
          }}
        >
          {t}
          <span
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: K.dim,
              marginLeft: 16,
            }}
          >
            {
              [
                "onde se dissolve",
                "pico em 1 a 2 h",
                "trava a COX",
                "também trava a COX",
                "desmonta",
                "leva embora",
              ][i]
            }
          </span>
        </div>
      ))}
    </div>
  );
};

const Legenda: React.FC<{ f: number }> = ({ f }) => {
  const l = LEGENDAS.find(([a, b]) => f >= a && f <= b + 1);
  if (!l) return null;
  const [a] = l;
  const k = P(f, a, a + 6);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1420,
        textAlign: "center",
        color: K.ink,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 50,
        lineHeight: 1.22,
        opacity: k,
        transform: `translateY(${(1 - k) * 12}px)`,
        textShadow: "0 3px 18px rgba(0,0,0,.9)",
      }}
    >
      {l[2]}
    </div>
  );
};

const MeSiga: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.siga, T.siga + 14, 0, 1);
  const op = fade(f, T.siga, T.final, 10);
  return (
    <AbsoluteFill
      style={{
        background: K.bg,
        opacity: op,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
      }}
    >
      <Img
        src={staticFile("ibuprofeno/logo.jpg")}
        style={{
          width: 420,
          height: 420,
          borderRadius: "50%",
          objectFit: "cover",
          border: `8px solid ${K.lime}`,
          transform: `scale(${0.85 + 0.15 * k})`,
          boxShadow: `0 0 80px ${K.lime}55`,
        }}
      />
      <div
        style={{
          marginTop: 70,
          width: 860,
          textAlign: "center",
          color: K.ink,
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        Me siga para mais dicas de{" "}
        <span style={{ color: K.lime }}>farmacologia</span> e curiosidades sobre
        a área
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill
    style={{
      background: K.bg,
      opacity: P(f, T.final - 2, T.final + 12),
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
    }}
  >
    <div
      style={{
        width: 820,
        textAlign: "center",
        color: K.ink,
        fontSize: 64,
        fontWeight: 800,
        lineHeight: 1.2,
      }}
    >
      Consulte um <span style={{ color: K.lime }}>profissional de saúde</span>{" "}
      para orientações.
    </div>
  </AbsoluteFill>
);


// ---------- som (poucos efeitos, como na referência; reais CC0 do Freesound via Openverse) ----------
const OV = "sfx_openverse/";
const SFX: [number, string, number][] = [
  [6, OV + "pop.mp3", 0.3],
  [185, OV + "whoosh.mp3", 0.28],
  [T.dock, OV + "portao.mp3", 0.4],
  [T.docaParede, OV + "portao.mp3", 0.3],
  [1094, OV + "whoosh.mp3", 0.28],
  [1155, OV + "pop.mp3", 0.25],
  [T.zoomOut, OV + "ding.mp3", 0.35],
  [T.siga, OV + "whoosh.mp3", 0.28],
  [T.final - 4, OV + "sting.mp3", 0.55],
];
const FALANDO_IBU = (() => {
  const v = new Float32Array(DURATION_IBUPROFENO + 1);
  LEGENDAS.forEach(([a, b]) => {
    for (let fr = Math.max(0, a - 4); fr <= Math.min(DURATION_IBUPROFENO, b + 6); fr++) v[fr] = 1;
  });
  const out = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    out[fr] = acc;
  }
  return out;
})();
const musicaIbu = (fr: number) =>
  (0.22 - 0.13 * (FALANDO_IBU[Math.max(0, Math.min(FALANDO_IBU.length - 1, Math.round(fr)))] ?? 0)) *
  interpolate(fr, [DURATION_IBUPROFENO - 12, DURATION_IBUPROFENO], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const VideoIbuprofeno: React.FC<{ capa?: boolean }> = ({ capa }) => {
  const frameAtual = useCurrentFrame();
  const f = capa ? 640 : frameAtual; // capa: molécula encaixada na COX
  const [mx, my] = lerpPts(f, CAMINHO);
  // a câmera segue a molécula com um leve atraso (sensação de tomada única)
  const [cx1, cy1] = lerpPts(f - 4, CAMINHO);
  const [cx2, cy2] = lerpPts(f - 8, CAMINHO);
  let camX = (mx + cx1 + cx2) / 3;
  let camY = (my + cy1 + cy2) / 3 + 40;
  let s = 1.15 * (1 + 0.035 * Math.sin(f / 22));
  s *= 1 + 0.4 * fade(f, 560, 770, 30);
  const parede = fade(f, 800, 1100, 50);
  camY = camY + (20 - camY) * parede;
  camX = camX + (5100 - camX) * parede * 0.6;
  s *= 1 - 0.08 * parede;
  const z = 0;
  // fim: a câmera abre devagar sobre o rim enquanto os pedaços vão embora
  const abre = it(f, T.zoomOut, T.siga, 0, 1);
  camX = camX + (8550 - camX) * abre;
  camY = camY + (250 - camY) * abre;
  s *= 1 - 0.35 * abre;
  const tx = 540 - camX * s;
  const ty = 1040 - camY * s;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 55%, ${K.bg2} 0%, ${K.bg} 70%)`,
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <radialGradient id="g2a2552">
            <stop offset="0" stopColor="#2a2552" stopOpacity={1} />
            <stop offset="1" stopColor="#2a2552" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g3a1f3a">
            <stop offset="0" stopColor="#3a1f3a" stopOpacity={1} />
            <stop offset="1" stopColor="#3a1f3a" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g3b2a18">
            <stop offset="0" stopColor="#3b2a18" stopOpacity={1} />
            <stop offset="1" stopColor="#3b2a18" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g4a2a14">
            <stop offset="0" stopColor="#4a2a14" stopOpacity={1} />
            <stop offset="1" stopColor="#4a2a14" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="topo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={K.bg} stopOpacity={1} />
            <stop offset="1" stopColor={K.bg} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="baixo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={K.bg} stopOpacity={0} />
            <stop offset="1" stopColor={K.bg} stopOpacity={1} />
          </linearGradient>
        </defs>
        {/* poeira de fundo, com leve paralaxe */}
        {Array.from({ length: 40 }, (_, i) => {
          const x =
            (((random(`p${i}`) * 1400 - camX * 0.15 * s) % 1080) + 1080) % 1080;
          const y = 520 + random(`q${i}`) * 900;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.5 + random(`z${i}`) * 2.5}
              fill={K.dim}
              opacity={0.25}
            />
          );
        })}
        <g
          transform={`rotate(${Math.sin(f / 40) * 2.2} 540 1000) translate(${tx},${ty}) scale(${s})`}
          opacity={1 - z}
        >
          <Mundo f={f} mx={mx} my={my} />
        </g>
        <rect x={0} y={0} width={1080} height={640} fill="url(#topo)" />
        <rect x={0} y={1230} width={1080} height={690} fill="url(#baixo)" />
      </svg>
      {capa ? <TituloCapa /> : (<>
      <Cabecalho f={f} />
      <Contador f={f} />
      <Legenda f={f} />
      </>)}
      {f >= T.siga - 2 && <MeSiga f={f} />}
      {f >= T.final - 2 && <Final f={f} />}
      {!capa && <Audio src={staticFile("ibuprofeno/fala.mp3")} />}
      {!capa && <Audio src={staticFile("ibuprofeno/musica.wav")} volume={(fr) => musicaIbu(fr)} />}
      {!capa && SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={Math.max(0, fr)}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------- capa (1080×1920; tudo entre y≈300 e 1620, o recorte 3:4 das redes) ----------
const TituloCapa: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 60, right: 60, top: 330, textAlign: "center", fontFamily: SANS,
      fontWeight: 900, fontSize: 96, lineHeight: 1.02, color: K.ink, textShadow: "0 6px 30px rgba(0,0,0,.8)" }}>
      COMO O IBUPROFENO <span style={{ color: K.lime }}>DESLIGA A DOR</span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1440, textAlign: "center", fontFamily: SANS,
      fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: K.ink, textShadow: "0 6px 30px rgba(0,0,0,.8)" }}>
      e por que ele mexe com o <span style={{ color: K.red }}>estômago</span>
    </div>
  </>
);
export const CapaIbuprofeno: React.FC = () => <VideoIbuprofeno capa />;
