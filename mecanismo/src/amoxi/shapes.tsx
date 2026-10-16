import React from "react";
import { random } from "remotion";
import { SANS } from "../fonts";
import { mix, rgba } from "../lib";
import { AMOX, ANEL, BAC, CLAV, LACT, PBP } from "./config";

const CINZA = "#64748b";

// molécula: anel betalactâmico (quadrado) + anel vizinho (pentágono) + cadeia lateral
// tipo "amox" tem um hexágono na cadeia lateral; "clav" tem uma caudinha
export const Mol: React.FC<{
  x: number;
  y: number;
  s?: number;
  tipo: "amox" | "clav";
  anel?: number;
  quebra?: number;
  cinza?: number;
  rot?: number;
}> = ({ x, y, s = 1, tipo, anel = 0, quebra = 0, cinza = 0, rot = 0 }) => {
  const base = mix(tipo === "amox" ? AMOX : CLAV, CINZA, cinza);
  const corAnel = mix(base, ANEL, anel * (1 - cinza * 0.6));
  const sw = 7;
  const glow =
    anel > 0
      ? `drop-shadow(0 0 ${14 * anel}px ${rgba(ANEL, 0.9)})`
      : `drop-shadow(0 0 8px ${base})`;
  const a = quebra * 38; // abertura do anel (graus)
  const hex =
    Array.from({ length: 6 }, (_, i) => {
      const t = (Math.PI / 3) * i + Math.PI / 6;
      return `${i ? "L" : "M"}${-112 + Math.cos(t) * 32},${-34 + Math.sin(t) * 32}`;
    }).join(" ") + "Z";
  return (
    <g
      transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      {/* anel vizinho e cadeia lateral */}
      <g
        stroke={base}
        strokeWidth={sw}
        style={{
          filter: `drop-shadow(0 0 8px ${rgba(tipo === "amox" ? AMOX : CLAV, 0.6 * (1 - cinza))})`,
        }}
      >
        <polyline points="28,-28 74,-46 100,0 74,46 28,28" />
        {tipo === "amox" ? (
          <>
            <line x1={-28} y1={-8} x2={-82} y2={-24} />
            <path d={hex} fill={rgba("#0b1226", 0.6)} />
            <line x1={-140} y1={-50} x2={-156} y2={-60} />
            <circle cx={-162} cy={-64} r={8} fill={base} stroke="none" />
          </>
        ) : (
          <>
            <polyline points="100,0 138,-22 166,-4" />
            <circle cx={174} cy={0} r={9} fill={base} stroke="none" />
          </>
        )}
      </g>
      {/* anel betalactâmico (o lado de cima abre quando é quebrado) */}
      <g stroke={corAnel} strokeWidth={sw + 1} style={{ filter: glow }}>
        <line x1={28} y1={-28} x2={28} y2={28} />
        <line x1={28} y1={28} x2={-28} y2={28} />
        <line x1={-28} y1={28} x2={-28} y2={-28} />
        <line
          x1={-28}
          y1={-28}
          x2={0}
          y2={-28}
          transform={`rotate(${-a},-28,-28)`}
        />
        <line
          x1={0}
          y1={-28}
          x2={28}
          y2={-28}
          transform={`rotate(${a},28,-28)`}
        />
      </g>
    </g>
  );
};

// ponto do contorno arredondado da bactéria (superelipse)
const borda = (a: number, b: number, t: number): [number, number] => {
  const c = Math.cos(t),
    s = Math.sin(t),
    n = 0.55;
  return [
    a * Math.sign(c) * Math.pow(Math.abs(c), n),
    b * Math.sign(s) * Math.pow(Math.abs(s), n),
  ];
};
// ponto logo fora da parede, num ângulo em graus (para posicionar as enzimas)
export const pontoParede = (
  cx: number,
  cy: number,
  a: number,
  b: number,
  ang: number,
  folga = 60,
): [number, number] => {
  const [x, y] = borda(a + folga, b + folga, (ang * Math.PI) / 180);
  return [cx + x, cy + y];
};

// bactéria com parede de "tijolos"
// tijolos: fração da parede construída; falhas: fração de tijolos que caíram; estouro: 0→1 explode
export const Bacteria: React.FC<{
  x: number;
  y: number;
  a: number;
  b: number;
  f: number;
  tijolos?: number;
  falhas?: number;
  estouro?: number;
  escudo?: number;
}> = ({ x, y, a, b, f, tijolos = 1, falhas = 0, estouro = 0, escudo = 0 }) => {
  const N = 34;
  const corpo = 1 - Math.min(1, estouro * 1.6);
  return (
    <g transform={`translate(${x},${y})`}>
      {escudo > 0 && (
        <ellipse
          rx={a + 70}
          ry={b + 70}
          fill="none"
          stroke={LACT}
          strokeWidth={4}
          opacity={0.5 * escudo}
          strokeDasharray="14 12"
          style={{ filter: `drop-shadow(0 0 14px ${LACT})` }}
          transform={`rotate(${f * 0.6})`}
        />
      )}
      {corpo > 0 && (
        <g opacity={corpo} transform={`scale(${1 - 0.15 * estouro})`}>
          <path
            d={
              Array.from({ length: 49 }, (_, i) => {
                const [px, py] = borda(a, b, (i / 48) * Math.PI * 2);
                return `${i ? "L" : "M"}${px},${py}`;
              }).join(" ") + "Z"
            }
            fill={rgba(BAC, 0.16)}
            stroke={rgba(BAC, 0.7)}
            strokeWidth={4}
          />
          <path
            d={`M${-a * 0.55},0 ${Array.from({ length: 8 }, (_, i) => `Q${-a * 0.55 + i * a * 0.14 + a * 0.07},${(i % 2 ? 1 : -1) * b * 0.35} ${-a * 0.55 + (i + 1) * a * 0.14},0`).join(" ")}`}
            fill="none"
            stroke={rgba(BAC, 0.55)}
            strokeWidth={5}
            transform={`rotate(${Math.sin(f / 40) * 4})`}
          />
          {Array.from({ length: 7 }, (_, i) => (
            <circle
              key={i}
              cx={(random(`rb${i}`) - 0.5) * a * 1.2}
              cy={(random(`rc${i}`) - 0.5) * b * 1.1}
              r={7}
              fill={rgba(BAC, 0.45)}
            />
          ))}
        </g>
      )}
      {Array.from({ length: N }, (_, i) => {
        if (i / N >= tijolos) return null;
        if (random(`f${i}`) < falhas) return null;
        const t = (i / N) * Math.PI * 2;
        const [px, py] = borda(a + 14, b + 14, t);
        const [qx, qy] = borda(a + 14, b + 14, t + 0.01);
        const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
        const voa = estouro * (260 + random(`v${i}`) * 260);
        const dx = (px / Math.hypot(px, py)) * voa,
          dy = (py / Math.hypot(px, py)) * voa;
        return (
          <rect
            key={i}
            x={px + dx - 20}
            y={py + dy - 10}
            width={40}
            height={20}
            rx={5}
            fill={mix(BAC, "#bbf7d0", 0.3)}
            opacity={1 - estouro}
            transform={`rotate(${ang + estouro * 220 * (random(`r${i}`) - 0.5)},${px + dx},${py + dy})`}
            style={{ filter: `drop-shadow(0 0 5px ${rgba(BAC, 0.6)})` }}
          />
        );
      })}
      {estouro > 0 &&
        estouro < 1 &&
        Array.from({ length: 16 }, (_, i) => {
          const t = (i / 16) * Math.PI * 2,
            r = estouro * (a + 120);
          return (
            <circle
              key={`p${i}`}
              cx={Math.cos(t) * r}
              cy={Math.sin(t) * r * (b / a)}
              r={6}
              fill={BAC}
              opacity={1 - estouro}
            />
          );
        })}
    </g>
  );
};

// boca de "pac-man": enzimas PBP (roxas) e betalactamase (vermelha, com dentes)
const Boca: React.FC<{
  x: number;
  y: number;
  r: number;
  dir: number;
  abre: number;
  cor: string;
  dentes?: boolean;
  rotulo?: string;
}> = ({ x, y, r, dir, abre, cor, dentes, rotulo }) => {
  const m = (0.06 + 0.3 * abre) * Math.PI;
  const d = `M0,0 L${r * Math.cos(m)},${r * Math.sin(m)} A${r},${r} 0 1 1 ${r * Math.cos(m)},${-r * Math.sin(m)} Z`;
  return (
    <g transform={`translate(${x},${y})`}>
      <g transform={`rotate(${dir})`}>
        <path
          d={d}
          fill={rgba(cor, 0.3)}
          stroke={cor}
          strokeWidth={5}
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 10px ${rgba(cor, 0.7)})` }}
        />
        {dentes &&
          [0.45, 0.72].map((u, i) => (
            <g key={i} fill="#fff" opacity={0.9}>
              <path
                d={`M${r * u * Math.cos(m) - 6},${r * u * Math.sin(m) - 2} l6,-11 l6,11 Z`}
              />
              <path
                d={`M${r * u * Math.cos(m) - 6},${-r * u * Math.sin(m) + 2} l6,11 l6,-11 Z`}
              />
            </g>
          ))}
        <circle cx={-r * 0.15} cy={-r * 0.5} r={r * 0.11} fill={cor} />
      </g>
      {rotulo && (
        <text
          y={r + 40}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={700}
          fontSize={28}
          fill={cor}
        >
          {rotulo}
        </text>
      )}
    </g>
  );
};
export const Pbp: React.FC<{
  x: number;
  y: number;
  r?: number;
  dir: number;
  f: number;
  cinza?: number;
}> = ({ x, y, r = 44, dir, f, cinza = 0 }) => (
  <Boca
    x={x}
    y={y}
    r={r}
    dir={dir}
    abre={(0.5 + 0.5 * Math.sin(f / 5)) * (1 - cinza)}
    cor={mix(PBP, CINZA, cinza)}
  />
);
export const Lactamase: React.FC<{
  x: number;
  y: number;
  r?: number;
  dir: number;
  f: number;
  cinza?: number;
  abre?: number;
}> = ({ x, y, r = 56, dir, f, cinza = 0, abre }) => (
  <Boca
    x={x}
    y={y}
    r={r}
    dir={dir}
    abre={abre ?? (0.5 + 0.5 * Math.sin(f / 4)) * (1 - cinza)}
    cor={mix(LACT, CINZA, cinza)}
    dentes
  />
);

export const Escudo: React.FC<{
  x: number;
  y: number;
  s: number;
  f: number;
}> = ({ x, y, s, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path
      d="M0,-110 C60,-100 95,-82 100,-70 L100,10 C100,70 50,104 0,126 C-50,104 -100,70 -100,10 L-100,-70 C-95,-82 -60,-100 0,-110 Z"
      fill={rgba(CLAV, 0.16)}
      stroke={CLAV}
      strokeWidth={7}
      style={{
        filter: `drop-shadow(0 0 ${18 + 6 * Math.sin(f / 10)}px ${rgba(CLAV, 0.8)})`,
      }}
    />
  </g>
);

// cápsula com metade amoxicilina e metade clavulanato
export const Capsula: React.FC<{
  x: number;
  y: number;
  s: number;
  rot: number;
  clav: number;
}> = ({ x, y, s, rot, clav }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle r={260} fill={rgba(AMOX, 0.1)} style={{ filter: "blur(40px)" }} />
    <path
      d="M0,-80 L-170,-80 A80,80 0 0 0 -170,80 L0,80 Z"
      fill={AMOX}
      style={{ filter: `drop-shadow(0 0 20px ${rgba(AMOX, 0.7)})` }}
    />
    <path
      d="M0,-80 L170,-80 A80,80 0 0 1 170,80 L0,80 Z"
      fill={mix("#475569", CLAV, clav)}
      style={{ filter: `drop-shadow(0 0 ${20 * clav}px ${rgba(CLAV, 0.7)})` }}
    />
    <rect
      x={-200}
      y={-58}
      width={150}
      height={20}
      rx={10}
      fill="#fff"
      opacity={0.35}
    />
  </g>
);
