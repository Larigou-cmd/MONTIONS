// Modelo 10 · "Corpo aceso" (proposta de 25/11/2026).
// Engenharia reversa de 4 vídeos de referência que ela mandou:
//  1. pixel de laboratório  -> etiquetas pequenas em letra de terminal, ligadas ao desenho por uma linha fina
//  2. anatomia escura acesa -> corpo escuro com o caminho do sinal brilhando; câmera que entra no órgão (quase sem corte seco)
//  3. etiquetas verdes      -> número grande, pílulas, legenda com a palavra acesa, cartões finais
//  4. moléculas em neon     -> título grande no alto com a palavra-chave colorida; contorno neon no pedaço que importa; piso de grade
// Tudo em código (sem créditos), na paleta verde do canal. Área segura: conteúdo entre y≈300 e y≈1620.
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { SANS } from "../fonts";
import { H, IN, OUT, P, W, it, rgba, tri } from "../lib";

export const COR10 = {
  BG0: "#03100d",
  BG1: "#072019",
  NEON: "#3dff8f", // caminho aceso, certo, solução
  LIMAO: "#f2e52e", // atenção
  LARANJA: "#ff9d3d", // fome (grelina)
  VERM: "#ff5a5a", // só alerta real
  CORPO: "#0f3a2f",
  CORPO2: "#082a22",
  INK: "#f7f3df",
  MINT: "#8fc4ae",
};
const { BG0, BG1, NEON, INK, MINT } = COR10;
export const MONO = "VTThreeTwoThree, monospace";

// ---------------- fundo: verde escuro, vinheta, poeira de luz e piso de grade (ref. 4) ----------------
export const Fundo10: React.FC<{ f: number; grade?: number }> = ({
  f,
  grade = 1,
}) => (
  <AbsoluteFill style={{ background: BG0 }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 1100px 1300px at 50% 42%, ${BG1} 0%, ${rgba(BG0, 0)} 72%)`,
      }}
    />
    {grade > 0 && (
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", opacity: 0.55 * grade }}
      >
        <defs>
          <linearGradient id="gradeFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={NEON} stopOpacity="0" />
            <stop offset="1" stopColor={NEON} stopOpacity="0.32" />
          </linearGradient>
        </defs>
        {/* linhas de fuga */}
        {Array.from({ length: 17 }, (_, i) => {
          const x = -600 + i * 142.5;
          return (
            <line
              key={`v${i}`}
              x1={W / 2}
              y1={1380}
              x2={x}
              y2={H + 40}
              stroke="url(#gradeFade)"
              strokeWidth={1.5}
            />
          );
        })}
        {/* linhas horizontais que andam devagar para a frente */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = ((i + ((f / 90) % 1)) / 9) ** 2;
          const y = 1380 + t * (H - 1380 + 40);
          return (
            <line
              key={`h${i}`}
              x1={0}
              y1={y}
              x2={W}
              y2={y}
              stroke={NEON}
              strokeOpacity={0.05 + 0.25 * t}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    )}
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {Array.from({ length: 46 }, (_, i) => {
        const x0 = random(`px${i}`) * W,
          y0 = random(`py${i}`) * H;
        const sp = 0.2 + random(`ps${i}`) * 0.5;
        const y = (((y0 - f * sp) % H) + H) % H;
        return (
          <circle
            key={i}
            cx={x0 + Math.sin(f / 45 + i) * 8}
            cy={y}
            r={1 + random(`pr${i}`) * 2}
            fill={NEON}
            opacity={0.06 + 0.06 * Math.sin(f / 22 + i)}
          />
        );
      })}
    </svg>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 900px 1250px at 50% 46%, transparent 55%, ${rgba("#000000", 0.55)} 100%)`,
      }}
    />
  </AbsoluteFill>
);

// ---------------- título grande no alto, palavra-chave colorida (ref. 4) ----------------
// partes: [texto, cor?]. Ex.: [["A BALANÇA "], ["SUBIU", LIMAO], [" DE NOVO"]]
export const Titulo10: React.FC<{
  f: number;
  at: number;
  ate?: number;
  partes: [string, string?][];
  sub?: string;
  y?: number;
  size?: number;
}> = ({ f, at, ate = Infinity, partes, sub, y = 330, size = 78 }) => {
  const k = Math.min(
    it(f, at, at + 12, 0, 1, OUT),
    1 - it(f, ate - 8, ate, 0, 1, IN),
  );
  if (k <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: y + 260,
          opacity: k,
          background: `linear-gradient(${rgba(BG0, 0.92)} 55%, ${rgba(BG0, 0)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: y,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: k,
          transform: `translateY(${(1 - k) * 22}px)`,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.05,
            letterSpacing: -1,
            color: INK,
          }}
        >
          {partes.map(([t, c], i) => (
            <span
              key={i}
              style={
                c
                  ? { color: c, textShadow: `0 0 28px ${rgba(c, 0.55)}` }
                  : undefined
              }
            >
              {t}
            </span>
          ))}
        </div>
        {sub && (
          <div
            style={{
              marginTop: 14,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 4,
              color: MINT,
              textTransform: "uppercase",
              opacity: P(f, at + 8, at + 20),
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </>
  );
};

// ---------------- etiqueta de laboratório com linha fina até o ponto (ref. 1) ----------------
export const Etiqueta10: React.FC<{
  f: number;
  at: number;
  ate?: number;
  texto: string;
  px: number; // ponto do desenho
  py: number;
  lx: number; // onde fica a etiqueta
  ly: number;
  cor?: string;
}> = ({ f, at, ate = Infinity, texto, px, py, lx, ly, cor = NEON }) => {
  const k = Math.min(P(f, at, at + 10), 1 - P(f, ate - 6, ate));
  if (k <= 0) return null;
  const linha = it(f, at, at + 10, 0, 1, OUT);
  const ex = px + (lx - px) * linha,
    ey = py + (ly - py) * linha;
  const letras = Math.round(texto.length * it(f, at + 6, at + 18, 0, 1));
  return (
    <>
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", left: 0, top: 0, opacity: k }}
      >
        <circle cx={px} cy={py} r={7} fill={cor} />
        <circle
          cx={px}
          cy={py}
          r={7 + (14 * ((f - at) % 30)) / 30}
          fill="none"
          stroke={cor}
          strokeOpacity={1 - ((f - at) % 30) / 30}
          strokeWidth={2}
        />
        <line
          x1={px}
          y1={py}
          x2={ex}
          y2={ey}
          stroke={cor}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: lx,
          top: ly,
          transform: `translate(${lx > px ? "0" : "-100%"}, -50%)`,
          opacity: k * P(f, at + 6, at + 10),
          padding: "6px 14px 4px",
          background: rgba(BG0, 0.9),
          border: `2px solid ${cor}`,
          borderRadius: 4,
          fontFamily: MONO,
          fontSize: 40,
          color: cor,
          whiteSpace: "nowrap",
          letterSpacing: 1,
        }}
      >
        {texto.slice(0, letras).toUpperCase()}
        <span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>▌</span>
      </div>
    </>
  );
};

// ---------------- câmera: aproxima e passeia pelo corpo sem corte seco (ref. 2) ----------------
// chaves: [quadro, zoom, centroX, centroY] — o ponto (cx, cy) do desenho vai para o meio da área útil
export const Camera: React.FC<{
  f: number;
  chaves: [number, number, number, number][];
  children: React.ReactNode;
}> = ({ f, chaves, children }) => {
  let a = chaves[0],
    b = chaves[0];
  for (let i = 0; i < chaves.length; i++) {
    if (f >= chaves[i][0]) {
      a = chaves[i];
      b = chaves[i + 1] ?? chaves[i];
    }
  }
  const t = b[0] === a[0] ? 0 : it(f, a[0], b[0], 0, 1);
  const z = a[1] + (b[1] - a[1]) * t,
    cx = a[2] + (b[2] - a[2]) * t,
    cy = a[3] + (b[3] - a[3]) * t;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${W / 2 - cx * z}px, ${960 - cy * z}px) scale(${z})`,
        transformOrigin: "0 0",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------------- corpo escuro com órgãos e o caminho aceso (ref. 2, na paleta do canal) ----------------
// Coordenadas no quadro 1080×1920 (sem câmera). Pontos úteis para etiquetas:
export const PONTOS = {
  cerebro: [540, 560] as [number, number],
  estomago: [620, 1010] as [number, number],
  intestino: [600, 1190] as [number, number],
};
export const Corpo: React.FC<{
  f: number;
  caminho: number; // 0..1: quanto do caminho intestino -> cérebro está aceso
  apaga?: number; // 0..1: o aviso apagando (parou a caneta)
  cerebroAceso?: number; // 0..1
  estomago?: number; // 0..1 destaque com contorno neon
  fome?: number; // 0..1 bolinhas laranja (hormônio da fome) subindo do estômago
  opacity?: number;
}> = ({
  f,
  caminho,
  apaga = 0,
  cerebroAceso = 0,
  estomago = 0,
  fome = 0,
  opacity = 1,
}) => {
  const luz = caminho * (1 - apaga);
  const CAM =
    "M540 1175 C 528 1100, 520 1010, 528 930 S 548 760, 540 690 S 540 630, 540 600";
  const LEN = 590;
  return (
    <svg width={W} height={H} style={{ position: "absolute", opacity }}>
      <defs>
        <linearGradient id="pele10" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14493b" />
          <stop offset="1" stopColor={COR10.CORPO2} />
        </linearGradient>
        <filter id="brilho10" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="aura10" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={NEON} stopOpacity="0.55" />
          <stop offset="1" stopColor={NEON} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* silhueta */}
      {/* silhueta numa peça só, com luz de recorte na borda (ref. 2) */}
      <g
        fill="url(#pele10)"
        stroke={rgba(NEON, 0.4)}
        strokeWidth={3}
        strokeLinejoin="round"
      >
        <ellipse cx={540} cy={545} rx={102} ry={122} />
        <path d="M470 720 Q420 735 380 750 Q330 770 315 830 L285 1050 Q270 1170 262 1260 Q258 1300 285 1300 Q305 1295 310 1260 L335 1060 L352 920 L362 1000 Q370 1150 380 1270 L395 1690 Q420 1720 455 1695 L520 1340 Q540 1320 560 1340 L625 1695 Q660 1720 685 1690 L700 1270 Q710 1150 718 1000 L728 920 L745 1060 L770 1260 Q775 1295 795 1300 Q822 1300 818 1260 Q810 1170 795 1050 L765 830 Q750 770 700 750 Q660 735 610 720 L585 700 L585 655 L495 655 L495 700 Z" />
      </g>
      <ellipse
        cx={540}
        cy={545}
        rx={102}
        ry={122}
        fill="none"
        stroke={rgba(NEON, 0.1)}
        strokeWidth={16}
      />
      <ellipse
        cx={540}
        cy={950}
        rx={150}
        ry={230}
        fill="url(#aura10)"
        opacity={0.18}
      />
      {/* cérebro */}
      <ellipse
        cx={540}
        cy={525}
        rx={74}
        ry={60}
        fill={rgba(NEON, 0.08 + 0.28 * cerebroAceso)}
        stroke={rgba(NEON, 0.35 + 0.6 * cerebroAceso)}
        strokeWidth={3}
      />
      <path
        d="M478 525 Q505 490 540 512 Q575 490 602 525 M495 548 Q540 528 585 548 M540 470 L540 580"
        fill="none"
        stroke={rgba(NEON, 0.28 + 0.5 * cerebroAceso)}
        strokeWidth={3}
      />
      {cerebroAceso > 0 && (
        <circle
          cx={540}
          cy={525}
          r={160}
          fill="url(#aura10)"
          opacity={cerebroAceso * (0.7 + 0.3 * Math.sin(f / 6))}
        />
      )}
      {/* estômago (em forma de J, do lado esquerdo da pessoa) */}
      <path
        d="M572 905 Q585 905 590 925 Q600 950 640 960 Q675 975 668 1030 Q655 1085 590 1080 Q545 1075 548 1040 Q552 1015 585 1015 Q610 1012 605 985 Q598 960 575 950 Q560 935 572 905 Z"
        fill={rgba("#2c7a62", 0.92)}
        stroke={rgba(NEON, 0.45 + 0.55 * estomago)}
        strokeWidth={3 + 4 * estomago}
        filter={estomago > 0 ? "url(#brilho10)" : undefined}
      />
      {/* intestino: um novelo com as voltas desenhadas */}
      <rect
        x={445}
        y={1120}
        width={190}
        height={140}
        rx={60}
        fill={rgba("#245f4e", 0.95)}
        stroke={rgba(NEON, 0.45)}
        strokeWidth={3}
      />
      <path
        d="M470 1150 Q500 1135 530 1150 T590 1150 T612 1170 M470 1190 Q500 1175 530 1190 T590 1190 T612 1210 M470 1230 Q500 1215 530 1230 T590 1230"
        fill="none"
        stroke={rgba(NEON, 0.3)}
        strokeWidth={3}
      />
      {/* caminho aceso: intestino -> cérebro */}
      <path
        d={CAM}
        fill="none"
        stroke={rgba(NEON, 0.12)}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {luz > 0 && (
        <path
          d={CAM}
          fill="none"
          stroke={NEON}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={LEN * (1 - caminho)}
          opacity={1 - apaga}
          filter="url(#brilho10)"
        />
      )}
      {/* pulsos de luz correndo no caminho */}
      {luz > 0.98 &&
        [0, 1, 2].map((i) => {
          const t = (f / 40 + i / 3) % 1;
          return (
            <path
              key={i}
              d={CAM}
              fill="none"
              stroke="#eafff3"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={`18 ${LEN}`}
              strokeDashoffset={-t * LEN}
              filter="url(#brilho10)"
              opacity={(1 - apaga) * tri(t, 0.5, 0.5)}
            />
          );
        })}
      {/* hormônio da fome subindo do estômago */}
      {fome > 0 &&
        Array.from({ length: 14 }, (_, i) => {
          const t = (f / 55 + random(`g${i}`)) % 1;
          const x =
            590 + (random(`gx${i}`) - 0.5) * 90 + Math.sin(f / 12 + i) * 10;
          const y = 990 - t * 420;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={9}
              fill={COR10.LARANJA}
              opacity={fome * tri(t, 0.5, 0.5)}
              filter="url(#brilho10)"
            />
          );
        })}
    </svg>
  );
};

// ---------------- gráfico do peso: desce com a caneta, sobe quando para ----------------
export const GraficoPeso: React.FC<{
  f: number;
  at: number;
  ate?: number;
  y?: number;
  parouEm?: number;
}> = ({ f, at, ate = Infinity, y = 620, parouEm = 0.55 }) => {
  const k = Math.min(P(f, at, at + 10), 1 - P(f, ate - 8, ate));
  if (k <= 0) return null;
  const pts = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const desce = Math.min(t / parouEm, 1);
    const v =
      1 -
      0.6 * (1 - (1 - desce) ** 2) +
      (t > parouEm ? 0.4 * ((t - parouEm) / (1 - parouEm)) ** 0.8 : 0);
    return [110 + t * 860, 420 - v * 320] as [number, number];
  });
  const prog = it(f, at + 6, at + 70, 0, 1);
  const n = Math.max(2, Math.round(prog * pts.length));
  const px = 110 + parouEm * 860;
  const corte = pts.findIndex((p) => p[0] >= px);
  const linha = (a: [number, number][]) =>
    a.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  const d = linha(pts.slice(0, Math.min(n, corte + 1)));
  const d2 = n > corte + 1 ? linha(pts.slice(corte, n)) : "";
  const fim = pts[n - 1];
  const subiu = fim[0] > px;
  return (
    <svg
      width={W}
      height={500}
      style={{ position: "absolute", top: y, left: 0, opacity: k }}
    >
      <line
        x1={110}
        y1={440}
        x2={970}
        y2={440}
        stroke={rgba(INK, 0.25)}
        strokeWidth={2}
      />
      <text
        x={110}
        y={480}
        fill={MINT}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={26}
        letterSpacing={3}
      >
        COM A CANETA
      </text>
      <text
        x={970}
        y={480}
        fill={MINT}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={26}
        letterSpacing={3}
        textAnchor="end"
      >
        SEM A CANETA
      </text>
      <line
        x1={px}
        y1={60}
        x2={px}
        y2={440}
        stroke={rgba(INK, 0.35)}
        strokeWidth={2}
        strokeDasharray="8 8"
      />
      <path
        d={d}
        fill="none"
        stroke={NEON}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 14px ${rgba(NEON, 0.7)})` }}
      />
      {d2 && (
        <path
          d={d2}
          fill="none"
          stroke={COR10.LIMAO}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 14px ${rgba(COR10.LIMAO, 0.7)})` }}
        />
      )}
      <circle
        cx={fim[0]}
        cy={fim[1]}
        r={16}
        fill={subiu ? COR10.LIMAO : NEON}
      />
    </svg>
  );
};

// ---------------- legenda embaixo, palavra a palavra, com a palavra da vez acesa (refs. 3 e 4) ----------------
export type Frase10 = {
  ini: number;
  fim: number;
  w: { t: string; f: number }[];
};
export const Legenda10: React.FC<{
  f: number;
  frases: Frase10[];
  y?: number;
  chaves?: string[];
}> = ({ f, frases, y = 1470, chaves = [] }) => {
  const c = frases.find((o) => f >= o.ini - 2 && f < o.fim);
  if (!c) return null;
  const k = Math.min(
    it(f, c.ini - 2, c.ini + 4, 0, 1, OUT),
    1 - it(f, c.fim - 4, c.fim, 0, 1, IN),
  );
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "4px 14px",
        opacity: k,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 50,
        lineHeight: "66px",
      }}
    >
      {c.w.map((w, i) => {
        const dita = f >= w.f;
        const chave = chaves.includes(
          w.t.toLowerCase().replace(/[.,?!:;]/g, ""),
        );
        return (
          <span
            key={i}
            style={{
              padding: "0 8px",
              borderRadius: 8,
              color: chave && dita ? BG0 : dita ? INK : rgba(INK, 0.35),
              background: chave && dita ? NEON : "transparent",
              outline: chave && dita ? `2px solid ${rgba(NEON, 0.6)}` : "none",
              textShadow:
                dita && !chave ? `0 2px 12px ${rgba("#000000", 0.8)}` : "none",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
export const frasesDeTexto = (
  texto: string,
  ini: number,
  porPalavra = 11,
  maxPalavras = 5,
): Frase10[] => {
  const ws = texto.split(" ");
  const out: Frase10[] = [];
  let cur: { t: string; f: number }[] = [];
  ws.forEach((w, i) => {
    cur.push({ t: w, f: ini + i * porPalavra });
    if (
      /[.,?:;!]$/.test(w) ||
      cur.length >= maxPalavras ||
      i === ws.length - 1
    ) {
      out.push({
        ini: cur[0].f,
        fim: cur[cur.length - 1].f + porPalavra + 8,
        w: cur,
      });
      cur = [];
    }
  });
  out.forEach((o, i) => (o.fim = Math.min(o.fim, out[i + 1]?.ini ?? o.fim)));
  return out;
};

// ---------------- número grande com setas (ref. 3) ----------------
export const Numero10: React.FC<{
  f: number;
  at: number;
  ate?: number;
  numero: string;
  texto: string;
  y?: number;
}> = ({ f, at, ate = Infinity, numero, texto, y = 560 }) => {
  const k = Math.min(P(f, at, at + 10), 1 - P(f, ate - 8, ate));
  if (k <= 0) return null;
  const s = it(f, at, at + 14, 0.6, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: k,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 260,
          lineHeight: 1,
          color: COR10.LIMAO,
          transform: `scale(${s})`,
          textShadow: `0 0 60px ${rgba(COR10.LIMAO, 0.45)}`,
        }}
      >
        {numero}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 44,
          color: INK,
          lineHeight: 1.25,
          whiteSpace: "pre-line",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// pílulas com seta para cima (exames que pioram)
export const PilulasSobe: React.FC<{
  f: number;
  at: number;
  ate?: number;
  itens: string[];
  y?: number;
}> = ({ f, at, ate = Infinity, itens, y = 1020 }) => {
  const out = 1 - P(f, ate - 8, ate);
  if (out <= 0 || f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 18,
        opacity: out,
      }}
    >
      {itens.map((t, i) => {
        const k = it(f, at + i * 8, at + i * 8 + 10, 0, 1, OUT);
        return (
          <div
            key={t}
            style={{
              opacity: k,
              transform: `translateY(${(1 - k) * 30}px)`,
              padding: "14px 26px",
              borderRadius: 999,
              border: `2px solid ${COR10.VERM}`,
              background: rgba(COR10.VERM, 0.12),
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 36,
              color: INK,
            }}
          >
            <span style={{ color: COR10.VERM }}>▲ </span>
            {t}
          </div>
        );
      })}
    </div>
  );
};
