import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { SANS } from "../fonts";
import { OUT, P, SNAP, W, it } from "../lib";
import fontes from "./instrumentserif.json";
import falaJson from "./captopril_fala.json";

// Série "A origem dos remédios" #1 — Captopril e a jararaca. Modelo 6 ("Origens"): colagem de papel,
// fotos antigas recortadas em preto e branco, uma cor de destaque e texto serifado palavra por palavra.
// Roteiro e fontes: origens/captopril/roteiro.md. Imagens: public/captopril/img (Wikimedia Commons).
for (const f of fontes) {
  loadFont({
    family: "Instrument Serif",
    url: staticFile(`fonts/${f.file}`),
    style: f.style,
    weight: "400",
    unicodeRange: f.unicodeRange,
    format: "woff2",
  });
}
export const SERIF = "'Instrument Serif', serif";
export const PAPEL = "#ebe6dc",
  TINTA = "#1d1b18",
  CINZA = "#6b665e",
  VERM = "#c8102e", // cor de destaque: sangue / pressão / remédio
  OURO = "#b8913a";

// ---------- fala: palavra e quadro em que ela começa ----------
export const TEXTO_CAPTOPRIL = `Um dos remédios de pressão mais famosos do mundo nasceu do veneno de uma cobra brasileira.
A jararaca. Quando ela pica, a pressão da vítima despenca.
Nos anos sessenta, em Ribeirão Preto, um jovem cientista quis entender por quê: Sérgio Henrique Ferreira.
No veneno, ele encontrou pequenas moléculas que faziam a pressão cair.
Em Londres, no laboratório de John Vane, veio a virada: elas bloqueavam a ECA, uma enzima que faz a pressão subir.
A farmacêutica Squibb seguiu essa pista. E, em 1975, transformou o veneno em comprimido: o captopril.
O remédio rodou o mundo. Mas a patente ficou com a empresa.
O mundo lembra do captopril. Poucos lembram da jararaca... e do brasileiro que começou tudo.
Me siga para mais dicas de farmacologia e curiosidades sobre a área.`;
type Pal = { w: string; f: number };
// tempos medidos na narração da Juliana (audio/captopril_palavras.json, alinhados ao texto acima)
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…]/g, "");
const T = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
const FIM_FALA = FALA[FALA.length - 1].f + 24;
const S = {
  jararaca: T("jararaca"),
  quando: T("quando"),
  despenca: T("despenca"),
  anos: T("anos"),
  sergio: T("sérgio"),
  noVeneno: T("no"),
  moleculas: T("moléculas"),
  londres: T("londres"),
  vane: T("vane"),
  virada: T("virada"),
  eca: T("eca"),
  subir: T("subir"),
  squibb: T("squibb"),
  ano1975: T("1975"),
  comprimido: T("comprimido"),
  captopril: T("captopril"),
  rodou: T("rodou"),
  patente: T("patente"),
  lembra: T("lembra"),
  poucos: T("poucos"),
  brasileiro: T("brasileiro"),
  siga: T("siga") - 4,
  final: FIM_FALA + 6,
};
export const DURATION_CAPTOPRIL = S.final + 96;
const SFX: [number, string, number][] = [];
const CENAS = [
  0,
  S.jararaca - 6,
  S.quando - 4,
  S.anos - 6,
  S.noVeneno - 4,
  T("em", 2) - 4,
  S.squibb - 10,
  S.rodou - 6,
  T("o", 5) - 6,
  S.siga - 6,
  S.final,
];
CENAS.slice(1).forEach((c) => SFX.push([c - 2, "whoosh", 0.22]));
SFX.push([S.despenca, "trava", 0.3], [S.eca + 4, "trava", 0.32], [S.patente, "trava", 0.35], [S.ano1975, "pop", 0.22], [S.captopril - 4, "pop", 0.22], [S.final + 4, "plim", 0.28]);
// FIM TEMPOS

// grupos de 1 a 4 palavras, quebrando na pontuação (como nas referências)
const GRUPOS = (() => {
  const gs: Pal[][] = [];
  let cur: Pal[] = [];
  FALA.forEach((p, i) => {
    cur.push(p);
    if (
      /[.,:?]$|\.\.\.$/.test(p.w) ||
      cur.length >= 3 ||
      i === FALA.length - 1
    ) {
      gs.push(cur);
      cur = [];
    }
  });
  return gs;
})();
const DESTAQUES = [
  "veneno",
  "cobra",
  "brasileira",
  "jararaca",
  "despenca",
  "ferreira",
  "moléculas",
  "eca",
  "captopril",
  "patente",
  "brasileiro",
  "1975",
  "subir",
  "cair",
];

// ---------- peças ----------
export const Papel: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 3);
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 900px 1300px at 50% 45%, rgba(255,255,255,0.55), rgba(0,0,0,0) 70%)",
        }}
      />
      <svg
        width={W}
        height={1920}
        style={{ position: "absolute", opacity: 0.5, mixBlendMode: "multiply" }}
      >
        <filter id={`p${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            seed={seed}
          />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0.35 0" />
        </filter>
        <rect width={W} height={1920} filter={`url(#p${seed})`} />
      </svg>
      <AbsoluteFill
        style={{ boxShadow: "inset 0 0 220px rgba(60,45,25,0.35)" }}
      />
    </AbsoluteFill>
  );
};

// texto central palavra por palavra, em serifada itálica
const Legenda: React.FC<{ y?: number; cor?: string; ate?: number }> = ({
  y = 960,
  cor = TINTA,
  ate = S.final,
}) => {
  const f = useCurrentFrame();
  if (f >= ate) return null;
  const g = GRUPOS.find(
    (gr, i) =>
      f >= gr[0].f - 2 &&
      f < (GRUPOS[i + 1] ? GRUPOS[i + 1][0].f - 2 : FIM_FALA),
  );
  if (!g) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 60,
        width: W - 120,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: 96,
        lineHeight: 1.05,
        color: cor,
      }}
    >
      {g.map((p, j) => {
        const k = it(f, p.f - 2, p.f + 6, 0, 1, OUT);
        const dest = DESTAQUES.includes(norm(p.w));
        return (
          <span
            key={j}
            style={{
              display: "inline-block",
              marginRight: 22,
              opacity: k,
              transform: `translateY(${(1 - k) * 18}px)`,
              filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined,
              color: dest ? VERM : undefined,
            }}
          >
            {p.w.replace(/[,:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// foto impressa recortada (borda branca, sombra, leve rotação) que entra caindo no papel
export const Foto: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  rot?: number;
  cor?: boolean;
  pos?: string;
  zoom?: number;
  borda?: number;
}> = ({
  src,
  x,
  y,
  w,
  h,
  at,
  rot = 0,
  cor = false,
  pos = "center",
  zoom = 0.06,
  borda = 18,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  const z = 1 + zoom * P(f, at, at + 150);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        padding: borda,
        background: "#f7f4ee",
        boxShadow: "0 18px 40px rgba(40,30,15,0.35)",
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.85 + 0.15 * k})`,
        opacity: Math.min(1, k * 1.5),
      }}
    >
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos,
            filter: cor
              ? "contrast(1.05)"
              : "grayscale(1) contrast(1.15) sepia(0.15)",
            transform: `scale(${z})`,
          }}
        />
      </div>
    </div>
  );
};

// fita adesiva
export const Fita: React.FC<{ x: number; y: number; rot?: number; w?: number }> = ({
  x,
  y,
  rot = -8,
  w = 170,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 46,
      background: "rgba(232,222,196,0.82)",
      transform: `translate(-50%,-50%) rotate(${rot}deg)`,
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    }}
  />
);

// etiqueta datilografada
export const Etiqueta: React.FC<{
  x: number;
  y: number;
  at: number;
  children: React.ReactNode;
  rot?: number;
  cor?: string;
}> = ({ x, y, at, children, rot = -2, cor = TINTA }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg)`,
        opacity: k,
        background: "#fbf8f1",
        padding: "10px 22px",
        fontFamily: "'Courier New', monospace",
        fontSize: 34,
        fontWeight: 700,
        color: cor,
        letterSpacing: 1,
        boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// carimbo
const Carimbo: React.FC<{
  x: number;
  y: number;
  at: number;
  texto: string;
  rot?: number;
  size?: number;
}> = ({ x, y, at, texto, rot = -10, size = 70 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const u = it(f, at, at + 7, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * u})`,
        opacity: u * 0.88,
        border: `7px solid ${VERM}`,
        borderRadius: 10,
        padding: "4px 26px",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 4,
        color: VERM,
        mixBlendMode: "multiply",
      }}
    >
      {texto}
    </div>
  );
};

const Cena: React.FC<{
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  if (f < de || f >= ate) return null;
  // corte seco com um "tranco" de 3 quadros, como nas referências
  const tr = 1 - P(f, de, de + 4);
  return (
    <AbsoluteFill
      style={{ transform: `scale(${1 + 0.04 * tr}) translateY(${tr * 10}px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

// medidor de pressão (esfigmomanômetro) desenhado
const Medidor: React.FC = () => {
  const f = useCurrentFrame();
  const cai = it(
    f,
    S.despenca - 4,
    S.despenca + 16,
    0,
    1,
    (x) => 1 - Math.pow(1 - x, 4),
  );
  const ang =
    -130 + 260 * ((160 - 120 * cai) / 260) + Math.sin(f / 3) * 2 * (1 - cai);
  const a = ((ang - 90) * Math.PI) / 180;
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform="translate(540,1180)">
        <circle
          r={300}
          fill="#f7f4ee"
          stroke={TINTA}
          strokeWidth={10}
          style={{ filter: "drop-shadow(0 18px 30px rgba(40,30,15,.3))" }}
        />
        <circle r={270} fill="none" stroke={CINZA} strokeWidth={2} />
        {Array.from({ length: 27 }, (_, i) => {
          const t = ((-130 + i * 10 - 90) * Math.PI) / 180;
          const big = i % 2 === 0;
          return (
            <line
              key={i}
              x1={Math.cos(t) * (big ? 220 : 240)}
              y1={Math.sin(t) * (big ? 220 : 240)}
              x2={Math.cos(t) * 265}
              y2={Math.sin(t) * 265}
              stroke={TINTA}
              strokeWidth={big ? 6 : 3}
            />
          );
        })}
        {[0, 4, 8, 12, 16, 20, 24].map((i) => {
          const t = ((-130 + i * 10 - 90) * Math.PI) / 180;
          return (
            <text
              key={i}
              x={Math.cos(t) * 180}
              y={Math.sin(t) * 180 + 14}
              textAnchor="middle"
              fontFamily={SERIF}
              fontSize={40}
              fill={TINTA}
            >
              {i * 10}
            </text>
          );
        })}
        <text
          y={110}
          textAnchor="middle"
          fontFamily={SERIF}
          fontStyle="italic"
          fontSize={44}
          fill={CINZA}
        >
          mmHg
        </text>
        <line
          x1={0}
          y1={0}
          x2={Math.cos(a) * 235}
          y2={Math.sin(a) * 235}
          stroke={VERM}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <circle r={22} fill={TINTA} />
      </g>
    </svg>
  );
};

// silhueta do cientista (não há foto livre de Sérgio Henrique Ferreira)
const Retrato: React.FC<{ x: number; y: number; at: number; s?: number }> = ({
  x,
  y,
  at,
  s = 1,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${(0.85 + 0.15 * k) * s})`,
        opacity: Math.min(1, k * 1.5),
      }}
    >
      <svg width={460} height={580} viewBox="0 0 460 580">
        <rect x={0} y={0} width={460} height={580} fill={OURO} />
        <rect x={14} y={14} width={432} height={552} fill="#8a6a26" />
        <rect x={30} y={30} width={400} height={520} fill="#d9d1c2" />
        <rect x={30} y={30} width={400} height={520} fill="url(#luz)" />
        <defs>
          <radialGradient id="luz" cx="50%" cy="35%" r="70%">
            <stop offset="0" stopColor="#f3eee4" />
            <stop offset="1" stopColor="#b9ae9c" />
          </radialGradient>
        </defs>
        {/* busto */}
        <ellipse cx={230} cy={225} rx={78} ry={96} fill="#2b2824" />
        <path
          d="M150,205 Q160,120 235,118 Q310,122 312,205 Q300,160 232,158 Q165,160 150,205 Z"
          fill="#1b1916"
        />
        <path d="M70,550 Q80,380 230,350 Q380,380 390,550 Z" fill="#2b2824" />
        <path d="M200,350 L230,420 L260,350 Z" fill="#e9e3d6" />
        <path d="M222,372 L230,470 L238,372 Z" fill={VERM} />
        {/* óculos */}
        <circle
          cx={203}
          cy={228}
          r={22}
          fill="none"
          stroke="#9c958a"
          strokeWidth={5}
        />
        <circle
          cx={258}
          cy={228}
          r={22}
          fill="none"
          stroke="#9c958a"
          strokeWidth={5}
        />
        <line
          x1={225}
          y1={228}
          x2={236}
          y2={228}
          stroke="#9c958a"
          strokeWidth={5}
        />
      </svg>
    </div>
  );
};

// tubo de ensaio com o veneno e as moléculas que saem dele
const Tubo: React.FC = () => {
  const f = useCurrentFrame();
  const sai = P(f, S.moleculas - 8, S.moleculas + 40);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform="translate(540,1250) rotate(-12)">
        <rect
          x={-70}
          y={-330}
          width={140}
          height={430}
          rx={10}
          fill="rgba(255,255,255,0.55)"
          stroke={TINTA}
          strokeWidth={8}
        />
        <path
          d={`M-62,${-40 + 10 * Math.sin(f / 10)} Q0,${-60} 62,${-40 - 10 * Math.sin(f / 10)} L62,92 Q0,140 -62,92 Z`}
          fill="#d8c27a"
          opacity={0.9}
        />
        <rect x={-95} y={-345} width={190} height={30} rx={8} fill={TINTA} />
      </g>
      {Array.from({ length: 9 }, (_, i) => {
        const u = Math.max(0, Math.min(1, sai * 1.6 - i * 0.07));
        if (u <= 0) return null;
        const x = 540 + (i - 4) * 70 * u + Math.sin(f / 12 + i) * 10;
        const y = 1000 - 380 * u - (i % 3) * 40 * u;
        return (
          <g
            key={i}
            transform={`translate(${x},${y})`}
            opacity={Math.min(1, u * 2)}
          >
            <circle r={18} fill={VERM} />
            <circle cx={26} cy={-6} r={12} fill={TINTA} />
            <line
              x1={10}
              y1={-3}
              x2={18}
              y2={-5}
              stroke={TINTA}
              strokeWidth={5}
            />
          </g>
        );
      })}
    </svg>
  );
};

// a enzima ECA como um cadeado que é travado
const Cadeado: React.FC<{ at: number; trava: number }> = ({ at, trava }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  const t = it(f, trava, trava + 8, 0, 1, OUT);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g
        transform={`translate(760,1320) scale(${0.8 + 0.2 * k})`}
        opacity={Math.min(1, k * 1.5)}
      >
        <path
          d={`M-70,-40 L-70,${-120 + 30 * t} A70,70 0 0 1 70,${-120 + 30 * t} L70,-40`}
          fill="none"
          stroke={TINTA}
          strokeWidth={22}
        />
        <rect x={-120} y={-50} width={240} height={190} rx={22} fill={TINTA} />
        <text
          y={70}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={64}
          fill={PAPEL}
        >
          ECA
        </text>
        {t > 0 && (
          <g opacity={t} stroke={VERM} strokeWidth={22} strokeLinecap="round">
            <line x1={-150} y1={-170} x2={150} y2={170} />
            <line x1={150} y1={-170} x2={-150} y2={170} />
          </g>
        )}
      </g>
    </svg>
  );
};

const Comprimido: React.FC<{
  x: number;
  y: number;
  at: number;
  r?: number;
}> = ({ x, y, at, r = 120 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(${x},${y}) scale(${k})`}>
        <circle
          r={r}
          fill="#fbfaf7"
          stroke={TINTA}
          strokeWidth={6}
          style={{ filter: "drop-shadow(0 14px 24px rgba(40,30,15,.35))" }}
        />
        <line
          x1={-r * 0.8}
          y1={0}
          x2={r * 0.8}
          y2={0}
          stroke="#c9c2b4"
          strokeWidth={8}
        />
        <text
          y={-r * 0.25}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={r * 0.34}
          fill={VERM}
        >
          25 mg
        </text>
      </g>
    </svg>
  );
};

// globo de linhas (o remédio rodou o mundo)
const Globo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g
        transform="translate(540,1220)"
        stroke={TINTA}
        strokeWidth={5}
        fill="none"
      >
        <circle r={300} fill="#f7f4ee" />
        {Array.from({ length: 6 }, (_, i) => {
          const ph = (f / 40 + i / 6) % 1;
          return (
            <ellipse
              key={i}
              rx={Math.abs(Math.cos(ph * Math.PI)) * 300}
              ry={300}
              opacity={0.6}
            />
          );
        })}
        {[-200, -100, 0, 100, 200].map((y) => (
          <line
            key={y}
            x1={-Math.sqrt(300 * 300 - y * y)}
            y1={y}
            x2={Math.sqrt(300 * 300 - y * y)}
            y2={y}
            opacity={0.5}
          />
        ))}
      </g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = random(`g${i}`) * Math.PI * 2,
          r = random(`r${i}`) * 240;
        const on = f >= S.rodou + i * 3;
        return on ? (
          <circle
            key={i}
            cx={540 + Math.cos(a) * r}
            cy={1220 + Math.sin(a) * r}
            r={14}
            fill={VERM}
          />
        ) : null;
      })}
    </svg>
  );
};

export const OrigemCaptopril: React.FC = () => {
  const f = useCurrentFrame();
  const C = CENAS;
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <Papel />
      {/* 1. gancho: jararaca em tela cheia */}
      <Cena de={C[0]} ate={C[1]}>
        <AbsoluteFill>
          <Img
            src={staticFile("captopril/img/jararaca.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "28% 50%",
              filter: "grayscale(1) contrast(1.2) brightness(0.8)",
              transform: `scale(${1.15 + 0.1 * P(f, 0, C[1])})`,
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(rgba(10,8,6,0.55), rgba(10,8,6,0.15) 45%, rgba(10,8,6,0.6))",
            }}
          />
        </AbsoluteFill>
        <Legenda y={420} cor="#f4efe6" />
      </Cena>
      {/* 2. a jararaca recortada */}
      <Cena de={C[1]} ate={C[2]}>
        <Foto
          src="captopril/img/jararaca.jpg"
          x={540}
          y={1150}
          w={860}
          h={640}
          at={C[1]}
          rot={-3}
          pos="25% 50%"
        />
        <Fita x={300} y={830} rot={-14} />
        <Fita x={800} y={830} rot={10} />
        <Etiqueta x={700} y={1500} at={C[1] + 8} rot={3}>
          Bothrops jararaca
        </Etiqueta>
        <Legenda y={420} />
      </Cena>
      {/* 3. a pressão despenca */}
      <Cena de={C[2]} ate={C[3]}>
        <Medidor />
        <Legenda y={420} />
      </Cena>
      {/* 4. o cientista */}
      <Cena de={C[3]} ate={C[4]}>
        <Retrato x={540} y={1180} at={C[3] + 2} />
        <Etiqueta x={540} y={1530} at={S.sergio} rot={-2}>
          Sérgio Henrique Ferreira (1934–2016)
        </Etiqueta>
        <Etiqueta x={290} y={820} at={C[3] + 10} rot={-6} cor={VERM}>
          Ribeirão Preto · anos 60
        </Etiqueta>
        <Legenda y={400} />
      </Cena>
      {/* 5. as moléculas do veneno */}
      <Cena de={C[4]} ate={C[5]}>
        <Tubo />
        <Legenda y={420} />
      </Cena>
      {/* 6. Londres, John Vane e a ECA */}
      <Cena de={C[5]} ate={C[6]}>
        <Foto
          src="captopril/img/vane.jpg"
          x={330}
          y={1130}
          w={480}
          h={620}
          at={C[5]}
          rot={-4}
          pos="50% 25%"
        />
        <Fita x={330} y={830} rot={-6} />
        <Etiqueta x={330} y={1490} at={S.vane} rot={2}>
          John Vane · Londres
        </Etiqueta>
        <Cadeado at={S.eca - 6} trava={S.eca + 4} />
        <Legenda y={400} />
      </Cena>
      {/* 7. Squibb, 1975, o comprimido */}
      <Cena de={C[6]} ate={C[7]}>
        <Foto
          src="captopril/img/squibb_1923.png"
          x={330}
          y={1120}
          w={460}
          h={690}
          at={C[6]}
          rot={3}
          pos="50% 0%"
          zoom={0.02}
        />
        {f >= S.ano1975 && (
          <div
            style={{
              position: "absolute",
              left: 790,
              top: 900,
              transform: "translate(-50%,-50%)",
              fontFamily: SERIF,
              fontSize: 170,
              color: VERM,
              opacity: P(f, S.ano1975, S.ano1975 + 8),
            }}
          >
            1975
          </div>
        )}
        {f >= S.comprimido - 6 && (
          <Img
            src={staticFile("captopril/img/captopril.png")}
            style={{
              position: "absolute",
              left: 590,
              top: 1060,
              width: 420,
              mixBlendMode: "multiply",
              opacity: P(f, S.comprimido - 6, S.comprimido + 6),
            }}
          />
        )}
        <Comprimido x={790} y={1560} at={S.captopril - 4} r={100} />
        <Legenda y={400} />
      </Cena>
      {/* 8. rodou o mundo; a patente */}
      <Cena de={C[7]} ate={C[8]}>
        <Globo />
        <Carimbo
          x={540}
          y={1240}
          at={S.patente}
          texto="PATENTE"
          rot={-12}
          size={90}
        />
        <Legenda y={420} />
      </Cena>
      {/* 9. fechamento: o mundo lembra do remédio, poucos lembram de onde ele veio */}
      <Cena de={C[8]} ate={C[9]}>
        <Comprimido x={540} y={860} at={C[8]} r={120} />
        {f >= S.poucos && (
          <>
            <Foto
              src="captopril/img/jararaca.jpg"
              x={310}
              y={1300}
              w={440}
              h={340}
              at={S.poucos}
              rot={-6}
              pos="25% 50%"
            />
            <Retrato x={790} y={1300} at={S.brasileiro - 10} s={0.6} />
          </>
        )}
        <Legenda y={420} />
      </Cena>
      {/* 10. me siga */}
      <Cena de={C[9]} ate={C[10]}>
        <Legenda y={860} />
        <Etiqueta x={540} y={1120} at={S.siga + 10} rot={-2} cor={VERM}>
          A origem dos remédios · #1
        </Etiqueta>
      </Cena>
      <Audio src={staticFile("captopril/narracao.mp3")} />
      {/* trilha "Documentary Piano" de leberch (Pixabay, licença de conteúdo do Pixabay), baixa embaixo da voz */}
      <Audio src={staticFile("captopril/musica_piano.mp3")} volume={(fr) => 0.12 * (1 - P(fr, DURATION_CAPTOPRIL - 60, DURATION_CAPTOPRIL))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      {/* 11. tela final */}
      <Cena de={S.final} ate={DURATION_CAPTOPRIL}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
            const k = it(
              f,
              S.final + 4 + i * 8,
              S.final + 18 + i * 8,
              0,
              1,
              OUT,
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 760 + i * 120,
                  width: W,
                  textAlign: "center",
                  fontFamily: SERIF,
                  fontStyle: i === 1 ? "italic" : "normal",
                  fontSize: i === 1 ? 110 : 90,
                  color: i === 1 ? VERM : TINTA,
                  opacity: k,
                  transform: `translateY(${(1 - k) * 30}px)`,
                }}
              >
                {l}
              </div>
            );
          },
        )}
      </Cena>
    </AbsoluteFill>
  );
};
