import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import grade from "./grade.json";
import { SANS, JORNAL } from "../fonts";

// "De vampiro a 007" completo, no estilo Halftone Dossier (lemo-opuscar, MIT), recriado em Remotion.
// Canal @historicodebusca. Vertical 1080x1920; tudo que importa entre y 300 e 1620.
// Foto: Robert Pattinson, Comic-Con 2012, por Gage Skidmore (CC BY-SA 3.0, Wikimedia Commons).
// Ícones desenhados do zero. Tempos provisórios (estimados pela narração a 2,3 palavras/s).

const PAPEL = "#EFE6CF";
const TINTA = "#171D45";
const COBALTO = "#2B4FD6";
const ROSA = "#F2578C";
const AMARELO = "#F7C531";
const VERMELHO = "#D8342B";
const HUD = "'JetBrains Mono', 'Consolas', 'Courier New', monospace";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const salto = (frame: number, inicio: number, dur = 12) =>
  interpolate(frame, [inicio, inicio + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.9)),
  });

// ================= base de impressão =================
const Reticula: React.FC<{
  passo: number;
  angulo: number;
  cor: string;
  densidade: (x: number, y: number) => number;
  k?: number;
}> = ({ passo, angulo, cor, densidade, k = 0.66 }) => {
  const pts = React.useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    const a = (angulo * Math.PI) / 180;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const R = Math.hypot(1080, 1920);
    for (let i = -R; i < R; i += passo) {
      for (let j = -R; j < R; j += passo) {
        const x = 540 + i * c - j * s;
        const y = 960 + i * s + j * c;
        if (x < -passo || y < -passo || x > 1080 + passo || y > 1920 + passo)
          continue;
        const r = Math.max(0, Math.min(1, densidade(x, y))) * passo * k;
        if (r > 1.2) out.push({ x, y, r });
      }
    }
    return out;
  }, [passo, angulo, densidade, k]);
  return (
    <svg
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        mixBlendMode: "multiply",
      }}
    >
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={cor} />
      ))}
    </svg>
  );
};
const borda = (x: number, y: number) => {
  const dx = Math.min(x, 1080 - x) / 300;
  const dy = Math.min(y, 1920 - y) / 520;
  return 0.44 * (1 - Math.min(1, Math.min(dx, dy) * 1.25));
};
const haloEm =
  (cx: number, cy: number, raio: number) => (x: number, y: number) => {
    const d = Math.hypot(x - cx, y - cy) / raio;
    return 1 - d * d;
  };
const HALO_CENTRO = haloEm(540, 960, 560);
const HALO_FOTO = haloEm(540, 930, 520);

const Papel: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply" }}>
    <svg width={1080} height={1920}>
      <filter id="c007-papel">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012"
          numOctaves={3}
          seed={7}
        />
        <feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.54  0 0 0 0 0.40  0 0 0 0.34 0" />
      </filter>
      <filter id="c007-grao">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          seed={3}
        />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 0.22 0" />
      </filter>
      <rect width={1080} height={1920} filter="url(#c007-papel)" />
      <rect width={1080} height={1920} filter="url(#c007-grao)" />
      <rect
        x={539}
        y={0}
        width={2}
        height={1920}
        fill="rgba(120,100,70,0.20)"
      />
    </svg>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(110,85,50,0.30) 100%)",
      }}
    />
  </AbsoluteFill>
);

// filtros e padrões usados por várias cenas (definidos uma vez só)
const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="c007-carimbo">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves={2}
          seed={11}
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={5} result="d" />
        <feColorMatrix
          in="n"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.8 1.3"
          result="m"
        />
        <feComposite in="d" in2="m" operator="in" />
      </filter>
      <pattern
        id="c007-pontos"
        width={22}
        height={22}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(18)"
      >
        <rect width={22} height={22} fill={AMARELO} />
        <circle cx={11} cy={11} r={6.5} fill={ROSA} />
      </pattern>
    </defs>
  </svg>
);

// ================= peças =================
const Cabecalho: React.FC<{ chip: string }> = ({ chip }) => {
  const frame = useCurrentFrame();
  const s = salto(frame, 2, 10);
  const rec = Math.floor(frame / 15) % 2 === 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 66,
          top: 312,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: HUD,
            fontWeight: 800,
            fontSize: 30,
            color: TINTA,
          }}
        >
          CASO Nº 2026-007
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 26,
            color: AMARELO,
            background: TINTA,
            borderRadius: 8,
            padding: "6px 14px",
            transform: `scale(${s})`,
            transformOrigin: "left center",
          }}
        >
          {chip}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 66,
          top: 306,
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: `4px solid ${TINTA}`,
          borderRadius: 10,
          padding: "6px 14px",
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 28,
          color: TINTA,
          background: PAPEL,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: VERMELHO,
            opacity: rec ? 1 : 0.2,
          }}
        />
        16.11.2026
      </div>
    </>
  );
};

const Manchete: React.FC<{
  linhas: string[];
  inicio?: number;
  top?: number;
  tam?: number;
  cor?: string;
  sombra?: string;
  centro?: boolean;
  ritmo?: number;
}> = ({
  linhas,
  inicio = 4,
  top = 392,
  tam = 128,
  cor = TINTA,
  sombra = ROSA,
  centro = false,
  ritmo = 1.6,
}) => {
  const frame = useCurrentFrame();
  let n = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: centro ? 0 : 66,
        right: centro ? 0 : undefined,
        top,
        textAlign: centro ? "center" : "left",
        fontFamily: JORNAL,
        fontWeight: 900,
        fontSize: tam,
        lineHeight: 1.0,
        color: cor,
      }}
    >
      {linhas.map((l, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {l.split("").map((ch, ci) => {
            const t0 = inicio + n * ritmo;
            n += 1;
            const v = interpolate(frame, [t0, t0 + 10], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(2.2)),
            });
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  transform: `translateY(${(1 - v) * -70}px) scale(${0.6 + 0.4 * v}, ${0.5 + 0.5 * v})`,
                  opacity: frame < t0 ? 0 : 1,
                  textShadow: `8px 8px 0 ${sombra}`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

type Fala = { de: number; ate: number; a: string; k?: string; b?: string };
const Legenda: React.FC<{ falas: Fala[] }> = ({ falas }) => {
  const frame = useCurrentFrame();
  const f = falas.find((x) => frame >= x.de && frame < x.ate);
  if (!f) return null;
  const v = salto(frame, f.de, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1444,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - v) * 120}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          background: TINTA,
          borderRadius: 36,
          boxShadow: `8px 8px 0 ${ROSA}`,
          padding: "16px 34px 18px",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 42,
          lineHeight: 1.18,
          color: PAPEL,
          textAlign: "center",
        }}
      >
        {f.a}
        {f.k ? <span style={{ color: AMARELO }}>{f.k}</span> : null}
        {f.b ?? ""}
      </div>
    </div>
  );
};

const Rodape: React.FC<{ credito?: boolean }> = ({ credito }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 1584,
      textAlign: "center",
      fontFamily: credito ? SANS : HUD,
      fontWeight: credito ? 600 : 800,
      fontSize: credito ? 21 : 26,
      color: TINTA,
      opacity: 0.82,
    }}
  >
    {credito
      ? "Foto: Gage Skidmore · CC BY-SA 3.0 · Wikimedia Commons"
      : "@historicodebusca"}
  </div>
);

const Carimbo: React.FC<{
  inicio: number;
  texto: string;
  x: number;
  y: number;
  rot?: number;
  tam?: number;
  cor?: string;
}> = ({ inicio, texto, x, y, rot = -9, tam = 56, cor = VERMELHO }) => {
  const frame = useCurrentFrame() - inicio;
  if (frame < 0) return null;
  const queda = interpolate(frame, [0, 3], [2.6, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const q =
    frame > 3
      ? 1 + 0.07 * Math.exp(-(frame - 3) / 4) * Math.cos((frame - 3) * 1.3)
      : queda;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${q})`,
        opacity: 0.93,
      }}
    >
      <div
        style={{
          filter: "url(#c007-carimbo)",
          border: `9px solid ${cor}`,
          borderRadius: 18,
          padding: 8,
        }}
      >
        <div
          style={{
            border: `4px solid ${cor}`,
            borderRadius: 11,
            padding: "8px 22px 10px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: tam,
            letterSpacing: 3,
            color: cor,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {texto}
        </div>
      </div>
    </div>
  );
};

// número gigante preenchido de retícula, sangrando pela borda
const Numeral: React.FC<{ n: string; x?: number; y?: number }> = ({
  n,
  x = -40,
  y = 1240,
}) => {
  const frame = useCurrentFrame();
  const v = salto(frame, 0, 14);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y + (1 - v) * 300})`}>
        <text
          x={0}
          y={0}
          fontFamily="Inter, sans-serif"
          fontWeight={900}
          fontSize={760}
          fill="url(#c007-pontos)"
          opacity={0.55}
        >
          {n}
        </text>
      </g>
    </svg>
  );
};

// cartão de prova com um ícone desenhado
const Prova: React.FC<{
  rotulo: string;
  children: React.ReactNode;
  inicio?: number;
  fundo?: string;
  x?: number;
  y?: number;
  tam?: number;
}> = ({
  rotulo,
  children,
  inicio = 10,
  fundo = "#FFFDF4",
  x = 290,
  y = 640,
  tam = 500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - inicio,
    fps,
    config: { damping: 11, stiffness: 120 },
  });
  const flutua = Math.sin(frame / 18) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - s) * 900 + flutua,
        width: tam,
        height: tam,
        transform: `rotate(2deg) scale(${1 / (0.9 + 0.1 * s)}, ${0.9 + 0.1 * s})`,
        transformOrigin: "50% 100%",
        background: fundo,
        border: `8px solid ${TINTA}`,
        borderRadius: 16,
        boxShadow: `14px 14px 0 ${ROSA}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* fita adesiva */}
      <div
        style={{
          position: "absolute",
          top: -26,
          left: tam / 2 - 80,
          width: 160,
          height: 46,
          background: "rgba(247,197,49,0.75)",
          transform: "rotate(-4deg)",
          border: `3px solid rgba(23,29,69,0.35)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 24,
          color: TINTA,
          background: AMARELO,
          border: `3px solid ${TINTA}`,
          borderRadius: 6,
          padding: "2px 10px",
        }}
      >
        {rotulo}
      </div>
      <svg viewBox="0 0 200 200" width={tam * 0.78} height={tam * 0.78}>
        {children}
      </svg>
    </div>
  );
};

const Etiqueta: React.FC<{
  texto: string;
  x: number;
  y: number;
  inicio: number;
  rot?: number;
  tam?: number;
  escura?: boolean;
}> = ({ texto, x, y, inicio, rot = -3, tam = 40, escura }) => {
  const frame = useCurrentFrame();
  const v = salto(frame, inicio, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        transformOrigin: "left center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: tam,
        color: escura ? AMARELO : TINTA,
        background: escura ? TINTA : AMARELO,
        border: `5px solid ${TINTA}`,
        borderRadius: 10,
        boxShadow: `7px 7px 0 ${ROSA}`,
        padding: "6px 20px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// ================= ícones originais (viewBox 200) =================
const L = {
  stroke: TINTA,
  strokeWidth: 8,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};
const Varinha = () => (
  <g>
    <line
      x1={46}
      y1={158}
      x2={136}
      y2={68}
      stroke={TINTA}
      strokeWidth={18}
      strokeLinecap="round"
    />
    <line
      x1={48}
      y1={156}
      x2={84}
      y2={120}
      stroke="#8B5A2B"
      strokeWidth={8}
      strokeLinecap="round"
    />
    {[
      [152, 48, 24],
      [112, 32, 11],
      [168, 94, 11],
    ].map(([x, y, r], i) => (
      <path
        key={i}
        d={`M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z`}
        fill={AMARELO}
        {...L}
        strokeWidth={5}
      />
    ))}
  </g>
);
const Presas = () => (
  <g>
    <path
      d="M24 90 Q100 40 176 90 Q100 176 24 90 Z"
      fill={VERMELHO}
      {...L}
      strokeWidth={9}
    />
    <path d="M44 92 Q100 72 156 92 Q100 140 44 92 Z" fill={TINTA} />
    <path d="M68 88 L86 88 L77 130 Z" fill="#fff" {...L} strokeWidth={5} />
    <path d="M114 88 L132 88 L123 130 Z" fill="#fff" {...L} strokeWidth={5} />
  </g>
);
const Farol = () => (
  <g>
    <path d="M18 56 L84 70 L84 82 L18 98 Z" fill={AMARELO} opacity={0.9} />
    <path d="M182 56 L116 70 L116 82 L182 98 Z" fill={AMARELO} opacity={0.9} />
    <path d="M84 92 L116 92 L128 172 L72 172 Z" fill="#fff" {...L} />
    <path d="M81 112 L119 112 L122 132 L78 132 Z" fill={VERMELHO} />
    <path d="M76 150 L124 150 L127 170 L73 170 Z" fill={VERMELHO} />
    <rect x={80} y={62} width={40} height={30} fill={AMARELO} {...L} />
    <path d="M74 62 L100 40 L126 62 Z" fill={TINTA} />
    <rect x={54} y={170} width={92} height={12} rx={4} fill={TINTA} />
  </g>
);
const Mascara = () => (
  <g>
    <path
      d="M20 92 Q40 54 84 68 Q100 74 116 68 Q160 54 180 92 Q172 138 126 130 Q108 126 100 112 Q92 126 74 130 Q28 138 20 92 Z"
      fill={TINTA}
    />
    <ellipse
      cx={66}
      cy={96}
      rx={21}
      ry={12}
      fill="#fff"
      transform="rotate(8 66 96)"
    />
    <ellipse
      cx={134}
      cy={96}
      rx={21}
      ry={12}
      fill="#fff"
      transform="rotate(-8 134 96)"
    />
  </g>
);
const Martini = () => (
  <g>
    <path d="M34 42 L166 42 L100 112 Z" fill="#CFEFFF" {...L} strokeWidth={9} />
    <line
      x1={100}
      y1={112}
      x2={100}
      y2={164}
      stroke={TINTA}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <line
      x1={64}
      y1={166}
      x2={136}
      y2={166}
      stroke={TINTA}
      strokeWidth={11}
      strokeLinecap="round"
    />
    <line
      x1={70}
      y1={28}
      x2={118}
      y2={86}
      stroke={TINTA}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <circle
      cx={97}
      cy={63}
      r={14}
      fill="#7CB342"
      stroke={TINTA}
      strokeWidth={6}
    />
    <circle cx={100} cy={61} r={4} fill={VERMELHO} />
  </g>
);

// ================= foto de ficha =================
const FotoFicha: React.FC<{ w?: number; h?: number; rotulo: string }> = ({
  w = 460,
  h = 532,
  rotulo,
}) => {
  const passo = w / grade.w;
  const pontos = React.useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    for (let y = 0; y < grade.h; y++) {
      for (let x = 0; x < grade.w; x++) {
        const d = Math.pow(1 - grade.g[y][x] / 255, 1.35);
        const r = d * passo * 0.66;
        if (r > 1)
          out.push({
            x: (x + 0.5 + (y % 2) * 0.5) * passo,
            y: (y + 0.5) * (h / grade.h),
            r,
          });
      }
    }
    return out;
  }, [passo, h]);
  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        overflow: "hidden",
        border: `8px solid ${TINTA}`,
        borderRadius: 10,
        boxShadow: `12px 12px 0 ${ROSA}`,
        background: PAPEL,
      }}
    >
      <Img
        src={staticFile("dossie007/foto_duo.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <svg
        width={w}
        height={h}
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "multiply",
          opacity: 0.32,
        }}
      >
        {pontos.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={COBALTO} />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 14,
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 22,
          color: TINTA,
          background: AMARELO,
          border: `3px solid ${TINTA}`,
          borderRadius: 6,
          padding: "2px 10px",
        }}
      >
        {rotulo}
      </div>
    </div>
  );
};

const Placa: React.FC<{
  inicio: number;
  nome: string;
  linha1: string;
  linha2: string;
  y?: number;
}> = ({ inicio, nome, linha1, linha2, y = 1196 }) => {
  const frame = useCurrentFrame();
  const v = salto(frame, inicio, 13);
  return (
    <div
      style={{
        position: "absolute",
        left: 190,
        top: y,
        width: 700,
        transform: `rotate(-2.5deg) scale(${v})`,
        background: TINTA,
        borderRadius: 14,
        boxShadow: `9px 9px 0 ${ROSA}`,
        padding: "18px 20px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 56,
          letterSpacing: 4,
          color: PAPEL,
          lineHeight: 1.05,
        }}
      >
        {nome}
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 28,
          color: "#B9BFE6",
        }}
      >
        {linha1}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 38,
          color: AMARELO,
          lineHeight: 1.1,
        }}
      >
        {linha2}
      </div>
    </div>
  );
};

const FotoQueSobe: React.FC<{ inicio: number; rotulo: string }> = ({
  inicio,
  rotulo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - inicio,
    fps,
    config: { damping: 11, stiffness: 120 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 310,
        top: 668 + (1 - s) * 900,
        transform: `rotate(1.5deg) scale(${1 / (0.9 + 0.1 * s)}, ${0.9 + 0.1 * s})`,
        transformOrigin: "50% 100%",
      }}
    >
      <FotoFicha rotulo={rotulo} />
    </div>
  );
};

const Regua: React.FC = () => (
  <>
    {[0, 40, 80, 120, 160, 200].map((m, i) => {
      const y = 1290 - i * 124;
      return (
        <React.Fragment key={m}>
          <div
            style={{
              position: "absolute",
              left: 96,
              right: 96,
              top: y,
              height: 4,
              background: "rgba(23,29,69,0.42)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 22,
              top: y - 15,
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 24,
              color: TINTA,
              opacity: 0.8,
            }}
          >
            {m}
          </div>
          <div
            style={{
              position: "absolute",
              right: 22,
              top: y - 15,
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 24,
              color: TINTA,
              opacity: 0.8,
            }}
          >
            {m}
          </div>
        </React.Fragment>
      );
    })}
  </>
);

// ================= cena (papel, retículas, tremor e flash) =================
const Cena: React.FC<{
  batidas?: number[];
  flashes?: number[];
  halo?: (x: number, y: number) => number;
  escura?: boolean;
  children: React.ReactNode;
}> = ({ batidas = [], flashes = [], halo = HALO_CENTRO, escura, children }) => {
  const frame = useCurrentFrame();
  let tremor = 0;
  let flash = 0;
  for (const b of batidas) {
    if (frame >= b)
      tremor = Math.max(
        tremor,
        18 * Math.pow(Math.max(0, 1 - (frame - b) / 14), 2),
      );
    flash = Math.max(
      flash,
      interpolate(frame, [b, b + 1, b + 9], [0, 0.45, 0], clamp),
    );
  }
  for (const f of flashes)
    flash = Math.max(
      flash,
      interpolate(frame, [f, f + 1, f + 8], [0, 0.32, 0], clamp),
    );
  const zoom = 1 + frame * 0.00012;
  const cresce = interpolate(frame, [4, 40], [0.2, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: escura ? TINTA : PAPEL, overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          transform: `translate(${Math.sin(frame * 2.7) * tremor}px, ${Math.cos(frame * 3.1) * tremor}px) scale(${zoom})`,
        }}
      >
        <Reticula
          passo={26}
          angulo={18}
          cor={escura ? "#2A3470" : ROSA}
          densidade={borda}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${cresce})`,
            transformOrigin: "540px 960px",
          }}
        >
          <Reticula
            passo={24}
            angulo={-32}
            cor={escura ? "#24306A" : COBALTO}
            densidade={halo}
            k={0.7}
          />
        </div>
        {children}
      </AbsoluteFill>
      <Papel />
      <AbsoluteFill
        style={{ background: "#fff", opacity: flash, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};

// ================= as 10 cenas =================
const C1Gancho: React.FC = () => (
  <Cena batidas={[84]}>
    <Cabecalho chip="ABERTURA" />
    <Manchete linhas={["O vampiro que", "brilhava no sol"]} tam={112} />
    <Prova rotulo="PROVA 0" inicio={14} fundo="#FFFDF4">
      <Presas />
    </Prova>
    <Carimbo
      inicio={84}
      texto="LICENÇA PARA MATAR"
      x={110}
      y={1196}
      rot={-6}
      tam={54}
    />
    <Legenda
      falas={[
        {
          de: 0,
          ate: 156,
          a: "O vampiro que brilhava no sol agora tem ",
          k: "licença para matar",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C2Noticia: React.FC = () => (
  <Cena flashes={[22]} halo={HALO_FOTO}>
    <Cabecalho chip="NOTÍCIA DE HOJE" />
    <Manchete linhas={["Novo James Bond"]} tam={112} />
    <Regua />
    <FotoQueSobe inicio={6} rotulo="SUSPEITO · 2012" />
    <Placa
      inicio={26}
      nome="PATTINSON, R."
      linha1="ANÚNCIO OFICIAL"
      linha2="sucede Daniel Craig"
    />
    <Legenda
      falas={[
        {
          de: 0,
          ate: 128,
          a: "Robert Pattinson foi anunciado hoje como o ",
          k: "novo James Bond",
        },
      ]}
    />
    <Rodape credito />
  </Cena>
);

const C3Potter: React.FC = () => (
  <Cena>
    <Cabecalho chip="PROVA 1" />
    <Numeral n="1" x={-30} />
    <Manchete linhas={["Harry Potter"]} tam={120} />
    <Etiqueta texto="2005" x={70} y={540} inicio={20} />
    <Prova rotulo="PROVA 1" inicio={12}>
      <Varinha />
    </Prova>
    <Etiqueta
      texto="papel: Cedrico"
      x={560}
      y={1196}
      inicio={95}
      rot={3}
      tam={44}
      escura
    />
    <Legenda
      falas={[
        {
          de: 0,
          ate: 95,
          a: "Só que a história dele começa em ",
          k: "outra franquia",
          b: ".",
        },
        {
          de: 95,
          ate: 186,
          a: "Em 2005, ele era o ",
          k: "Cedrico",
          b: ", de Harry Potter.",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C4Crepusculo: React.FC = () => {
  const frame = useCurrentFrame();
  const v = salto(frame, 75, 12);
  return (
    <Cena batidas={[75]}>
      <Cabecalho chip="PROVA 2" />
      <Numeral n="2" x={-30} />
      <Manchete linhas={["Crepúsculo"]} tam={128} />
      <Etiqueta texto="2008 a 2012" x={70} y={540} inicio={20} />
      <Prova rotulo="PROVA 2" inicio={12}>
        <Presas />
      </Prova>
      {/* contador de filmes */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 1110,
          transform: `rotate(4deg) scale(${v})`,
          background: PAPEL,
          border: `5px solid ${TINTA}`,
          borderRadius: 14,
          boxShadow: `7px 7px 0 ${ROSA}`,
          padding: "8px 22px 12px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: HUD,
            fontWeight: 800,
            fontSize: 24,
            color: AMARELO,
            background: TINTA,
            borderRadius: 6,
            padding: "2px 10px",
          }}
        >
          FILMES
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 130,
            lineHeight: 0.95,
            color: TINTA,
          }}
        >
          5
        </div>
      </div>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 75,
            a: "Três anos depois veio ",
            k: "Crepúsculo",
            b: ".",
          },
          {
            de: 75,
            ate: 156,
            a: "Foram ",
            k: "cinco filmes",
            b: " como o vampiro Edward,",
          },
          {
            de: 156,
            ate: 268,
            a: "e uma fama da qual ele mesmo ",
            k: "já fez piada",
            b: ".",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// tarjas pretas que se levantam uma a uma
const C5Tarja: React.FC = () => {
  const frame = useCurrentFrame();
  const linhas = ["E aí ele fez", "o que quase", "ninguém", "esperava."];
  return (
    <Cena escura halo={haloEm(540, 960, 480)}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 640 }}>
        {linhas.map((l, i) => {
          const t0 = 12 + i * 16;
          const sobe = interpolate(frame, [t0, t0 + 8], [0, 1], {
            ...clamp,
            easing: Easing.in(Easing.quad),
          });
          return (
            <div
              key={i}
              style={{ position: "relative", height: 150, marginBottom: 10 }}
            >
              <div
                style={{
                  fontFamily: JORNAL,
                  fontWeight: 900,
                  fontSize: 118,
                  lineHeight: 1.2,
                  color: PAPEL,
                  textShadow: `7px 7px 0 ${ROSA}`,
                  whiteSpace: "nowrap",
                }}
              >
                {l}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: -14,
                  top: 10,
                  height: 128,
                  width: 900,
                  background: "#05070F",
                  transform: `translateY(${-sobe * 40}px) rotate(${-sobe * 4}deg)`,
                  opacity: 1 - sobe,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 66,
          top: 330,
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 30,
          color: AMARELO,
        }}
      >
        DOCUMENTO SIGILOSO · LIBERADO
      </div>
    </Cena>
  );
};

const C6Pequenos: React.FC = () => (
  <Cena batidas={[182]}>
    <Cabecalho chip="PROVA 3" />
    <Numeral n="3" x={-30} />
    <Manchete linhas={["Filmes pequenos", "e estranhos"]} tam={104} />
    <Etiqueta texto="2017 a 2019" x={70} y={636} inicio={20} tam={36} />
    <Prova rotulo="PROVA 3" inicio={12} y={720} tam={460} x={310}>
      <Farol />
    </Prova>
    <Etiqueta
      texto="Bom Comportamento"
      x={60}
      y={1226}
      inicio={109}
      rot={-4}
      tam={38}
      escura
    />
    <Etiqueta
      texto="O Farol"
      x={700}
      y={1316}
      inicio={125}
      rot={3}
      tam={38}
      escura
    />
    <Carimbo
      inicio={182}
      texto="APROVADO PELA CRÍTICA"
      x={120}
      y={880}
      rot={-10}
      tam={44}
    />
    <Legenda
      falas={[
        {
          de: 0,
          ate: 109,
          a: "Largou os filmes gigantes e foi para os ",
          k: "pequenos e estranhos",
          b: ",",
        },
        {
          de: 109,
          ate: 182,
          a: "como ",
          k: "Bom Comportamento",
          b: " e O Farol.",
        },
        {
          de: 182,
          ate: 258,
          a: "Foi ali que a crítica passou a ",
          k: "levá-lo a sério",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C7Faltava: React.FC = () => {
  const frame = useCurrentFrame();
  const v = salto(frame, 18, 10);
  return (
    <Cena halo={haloEm(540, 1000, 520)}>
      <Manchete
        linhas={["Só que ainda", "faltava uma", "coisa."]}
        top={560}
        tam={124}
        centro
        inicio={0}
        ritmo={0.75}
      />
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 1050,
          width: 200,
          height: 200,
          transform: `rotate(12deg) scale(${v})`,
        }}
      >
        <svg viewBox="0 0 200 200" width={200} height={200}>
          <path
            d={
              Array.from({ length: 24 })
                .map((_, i) => {
                  const a = (i / 24) * Math.PI * 2;
                  const r = i % 2 ? 66 : 96;
                  return `${i ? "L" : "M"}${100 + Math.cos(a) * r} ${100 + Math.sin(a) * r}`;
                })
                .join(" ") + " Z"
            }
            fill={AMARELO}
            stroke={TINTA}
            strokeWidth={8}
            strokeLinejoin="round"
          />
          <text
            x={100}
            y={128}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={900}
            fontSize={88}
            fill={TINTA}
          >
            ?
          </text>
        </svg>
      </div>
      <Rodape />
    </Cena>
  );
};

const C8Batman: React.FC = () => (
  <Cena>
    <Cabecalho chip="PROVA 4" />
    <Numeral n="4" x={-30} />
    <Manchete linhas={["Batman"]} tam={140} />
    <Etiqueta texto="2022" x={70} y={560} inicio={14} />
    <Prova rotulo="PROVA 4" inicio={8}>
      <Mascara />
    </Prova>
    <Legenda
      falas={[
        {
          de: 0,
          ate: 110,
          a: "Em 2022, ele voltou ao cinemão como ",
          k: "Batman",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C9Veredito: React.FC = () => {
  const frame = useCurrentFrame();
  const m = salto(frame, 136, 12);
  return (
    <Cena batidas={[66]} flashes={[22]} halo={HALO_FOTO}>
      <Cabecalho chip="VEREDITO" />
      <Manchete linhas={["Veredito: 007"]} tam={112} />
      <Regua />
      <FotoQueSobe inicio={6} rotulo="PROVA A · 2012" />
      <Placa
        inicio={26}
        nome="PATTINSON, R."
        linha1="7º ATOR NO PAPEL"
        linha2="40 anos · dir. Denis Villeneuve"
      />
      <Carimbo inicio={66} texto="CONTRATADO" x={468} y={700} />
      {/* taça como selo do agente */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 900,
          transform: `rotate(-6deg) scale(${m})`,
        }}
      >
        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: "50%",
            background: AMARELO,
            border: `7px solid ${TINTA}`,
            boxShadow: `8px 8px 0 ${ROSA}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 200 200" width={150} height={150}>
            <Martini />
          </svg>
        </div>
      </div>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 136,
            a: "E hoje, aos 40 anos, virou o ",
            k: "sétimo ator",
            b: " a viver o 007,",
          },
          {
            de: 136,
            ate: 209,
            a: "em um filme dirigido por ",
            k: "Denis Villeneuve",
            b: ".",
          },
        ]}
      />
      <Rodape credito />
    </Cena>
  );
};

const C10Final: React.FC = () => {
  const frame = useCurrentFrame();
  const itens = [
    { n: "Cedrico", i: <Varinha />, x: 110, y: 590 },
    { n: "Edward", i: <Presas />, x: 580, y: 590 },
    { n: "Batman", i: <Mascara />, x: 110, y: 920 },
    { n: "Bond", i: <Martini />, x: 580, y: 920 },
  ];
  const fio = interpolate(frame, [40, 70], [0, 1], clamp);
  return (
    <Cena batidas={[141]}>
      <Cabecalho chip="QUADRO DE PROVAS" />
      <Manchete linhas={["Qual é o seu preferido?"]} tam={78} />
      {/* fios ligando as provas */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {[
          [305, 705, 775, 705],
          [305, 705, 305, 1035],
          [775, 705, 775, 1035],
          [305, 1035, 775, 1035],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x1 + (x2 - x1) * fio}
            y2={y1 + (y2 - y1) * fio}
            stroke={VERMELHO}
            strokeWidth={6}
            strokeDasharray="2 0"
          />
        ))}
      </svg>
      {itens.map((it, k) => {
        const v = salto(frame, 6 + k * 7, 12);
        return (
          <div
            key={it.n}
            style={{
              position: "absolute",
              left: it.x,
              top: it.y,
              width: 390,
              transform: `rotate(${k % 2 ? 3 : -3}deg) scale(${v})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                margin: "0 auto",
                width: 230,
                height: 230,
                background: it.n === "Bond" ? AMARELO : "#FFFDF4",
                border: `7px solid ${TINTA}`,
                borderRadius: 14,
                boxShadow: `9px 9px 0 ${ROSA}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 200 200" width={180} height={180}>
                {it.i}
              </svg>
            </div>
            <div
              style={{
                marginTop: 12,
                display: "inline-block",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 40,
                color: PAPEL,
                background: TINTA,
                borderRadius: 10,
                padding: "4px 18px",
              }}
            >
              {it.n}
            </div>
          </div>
        );
      })}
      <Carimbo
        inicio={141}
        texto="SIGA @historicodebusca"
        x={110}
        y={1268}
        rot={-5}
        tam={46}
        cor={TINTA}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: 100,
            a: "Cedrico, Edward, Batman ou Bond: ",
            k: "qual é o seu preferido?",
          },
          { de: 100, ate: 141, a: "", k: "Comenta aí", b: "." },
          {
            de: 141,
            ate: 290,
            a: "E me siga para mais ",
            k: "buscas aleatórias",
            b: ".",
          },
        ]}
      />
    </Cena>
  );
};

// ================= montagem com cortina de pontos =================
const CENAS: { dur: number; el: React.ReactNode; cor: string }[] = [
  { dur: 156, el: <C1Gancho />, cor: TINTA },
  { dur: 128, el: <C2Noticia />, cor: COBALTO },
  { dur: 186, el: <C3Potter />, cor: ROSA },
  { dur: 268, el: <C4Crepusculo />, cor: TINTA },
  { dur: 91, el: <C5Tarja />, cor: AMARELO },
  { dur: 258, el: <C6Pequenos />, cor: COBALTO },
  { dur: 65, el: <C7Faltava />, cor: ROSA },
  { dur: 110, el: <C8Batman />, cor: TINTA },
  { dur: 209, el: <C9Veredito />, cor: VERMELHO },
  { dur: 290, el: <C10Final />, cor: TINTA },
];
export const DURATION_COMPLETO = CENAS.reduce((s, c) => s + c.dur, 0);

const CortinaDePontos: React.FC<{ cortes: { t: number; cor: string }[] }> = ({
  cortes,
}) => {
  const frame = useCurrentFrame();
  const corte = cortes.find((c) => Math.abs(frame - c.t) <= 9);
  if (!corte) return null;
  const PASSO = 120;
  const cols = Math.ceil(1080 / PASSO) + 1;
  const rows = Math.ceil(1920 / PASSO) + 1;
  const maxR = PASSO * 0.75;
  const circ: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const atraso = (c + r) * 0.28 - 4; // diagonal
      const t = frame - corte.t - atraso;
      // cresce de -7 a 0 (cobre no corte) e encolhe de 0 a +7
      const v = interpolate(t, [-7, -1, 1, 7], [0, 1, 1, 0], clamp);
      if (v > 0)
        circ.push(
          <circle
            key={`${r}-${c}`}
            cx={c * PASSO}
            cy={r * PASSO}
            r={v * maxR}
            fill={corte.cor}
          />,
        );
    }
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {circ}
    </svg>
  );
};

export const VideoDossie007Completo: React.FC = () => {
  let inicio = 0;
  const cortes: { t: number; cor: string }[] = [];
  const seqs = CENAS.map((c, i) => {
    const from = inicio;
    inicio += c.dur;
    if (i > 0) cortes.push({ t: from, cor: c.cor });
    return (
      <Sequence key={i} from={from} durationInFrames={c.dur}>
        {c.el}
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      <Defs />
      <Audio src={staticFile("dossie007/mix_final.wav")} />
      {seqs}
      <CortinaDePontos cortes={cortes} />
    </AbsoluteFill>
  );
};

// ================= capa (1 quadro) =================
export const CapaDossie007: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PAPEL }}>
    <Defs />
    <Cena halo={HALO_FOTO}>
      <Cabecalho chip="CASO ENCERRADO" />
      <Manchete linhas={["De vampiro", "a 007"]} tam={150} top={380} />
      <Regua />
      <FotoQueSobe inicio={0} rotulo="SUSPEITO · 2012" />
      <Carimbo inicio={0} texto="CONTRATADO" x={360} y={1090} rot={-8} tam={76} />
      <Legenda
        falas={[
          { de: 0, ate: 999, a: "Robert Pattinson é o ", k: "novo James Bond" },
        ]}
      />
      <Rodape credito />
    </Cena>
  </AbsoluteFill>
);
