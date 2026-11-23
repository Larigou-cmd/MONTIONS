import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS } from "../fonts";
import { loadFont } from "@remotion/fonts";
import PAL from "../lei8080Ep2_palavras.json";

// Instrument Serif (mesma letra da lei seca da RDC 1.000)
for (const [st, sub] of [
  ["normal", "latin"],
  ["normal", "latin-ext"],
  ["italic", "latin"],
  ["italic", "latin-ext"],
] as const)
  loadFont({
    family: "Instrument Serif",
    url: staticFile(`fonts/InstrumentSerif-400-${st}-${sub}.woff2`),
    style: st,
    weight: "400",
    format: "woff2",
    unicodeRange: sub === "latin-ext" ? "U+0100-024F" : undefined,
  });
const SERIF = "'Instrument Serif', serif";
import { IN, OUT, P, SNAP, it, mix, rgba } from "../lib";

// "Lei 8.080 para concursos — Episódio 2" (Arts. 5º, 6º e 6º-A), vídeo longo HORIZONTAL 1920×1080, estilo verde da RDC.
// Narração: voz Juliana (ElevenLabs v4), gerada em 2 partes e unida (public/lei8080ep2/narracao_usuaria.mp3).
// public/lei8080ep2/narracao.mp3 = mesma narração com 5 s de silêncio antes de cada "Gabarito" (pause e responda).
// Tempos em SEGUNDOS da narração original (transcrição com faster-whisper); fr() converte para quadros já somando as pausas.
export const W = 1920;
export const H = 1080;
const FPS = 30;
const PAUSA = 5;
const CORTES = [459.1, 476.0, 492.55, 515.0, 550.7]; // onde entram as pausas (s, narração original)
const fr = (s: number) =>
  Math.round((s + PAUSA * CORTES.filter((c) => s >= c).length) * FPS);
const inicioPausa = (i: number) => Math.round((CORTES[i] + PAUSA * i) * FPS);

// paleta "verde" da RDC 1.000
const NEON = "#3dff8f";
const YEL = "#f2e52e";
const MINT = "#8fc4ae";
const BG0 = "#04120f";
const BG1 = "#0a2a22";
const OURO = NEON; // títulos e destaques
const AZUL = YEL; // SUS
const VERM = "#ff6b6b"; // pegadinha / errado
const VERDE = NEON; // certo
const EMOJI = "'Noto Color Emoji','Segoe UI Emoji',sans-serif";

const FIM_FALA = fr(604.6);
export const DURATION = FIM_FALA + 170; // ≈ 636 s

const PARTES: [number, string][] = [
  [0, "ABERTURA"],
  [21.6, "ART. 5º"],
  [73.1, "ART. 6º"],
  [205.4, "VIGILÂNCIAS"],
  [281.2, "SAÚDE DO TRABALHADOR"],
  [352.4, "DEFINIÇÕES NOVAS"],
  [409.7, "ART. 6º-A"],
  [435.1, "QUESTÕES"],
  [556.2, "RESUMO"],
  [594.9, "ATÉ O PRÓXIMO"],
];

// ---------- fundo horizontal (igual à RDC: verde-escuro radial) ----------
const Fundo: React.FC<{ cor: string; pulsos: number[] }> = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle 1500px at 560px 320px, ${BG1} 0%, ${BG0} 100%)`,
    }}
  />
);

// ---------- topo e barra de progresso ----------
const Hud: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  PARTES.forEach(([s], i) => {
    if (f >= fr(s)) idx = i;
  });
  const from = fr(PARTES[idx][0]);
  const k = it(f, from, from + 14, 0, 1, OUT);
  const fade = 1 - P(f, FIM_FALA, FIM_FALA + 12);
  const x0 = 120,
    x1 = W - 120,
    y = 1018;
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily: SANS }}>
      <div
        style={{
          position: "absolute",
          left: x0,
          top: 64,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 3,
          color: MINT,
          whiteSpace: "nowrap",
        }}
      >
        LEI Nº 8.080/1990 · EPISÓDIO 2
        <span style={{ opacity: k }}> · {PARTES[idx][1]}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y,
          width: x1 - x0,
          height: 6,
          borderRadius: 3,
          background: "rgba(255,255,255,.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y,
          width: (x1 - x0) * Math.min(1, f / FIM_FALA),
          height: 6,
          borderRadius: 3,
          background: NEON,
        }}
      />
      {PARTES.slice(1).map(([s0]) => (
        <div
          key={s0}
          style={{
            position: "absolute",
            left: x0 + ((x1 - x0) * fr(s0)) / FIM_FALA - 1,
            top: y - 6,
            width: 2,
            height: 18,
            background: "rgba(143,196,174,.7)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ---------- peças ----------
// trecho que entra e sai com desfoque (de/ate em segundos da narração)
const Fase: React.FC<{
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  const a0 = fr(de),
    b0 = fr(ate);
  if (f < a0 - 2 || f > b0) return null;
  const a = Math.min(
    it(f, a0 - 2, a0 + 12, 0, 1, OUT),
    1 - it(f, b0 - 12, b0, 0, 1, IN),
  );
  return (
    <AbsoluteFill
      style={{
        opacity: a,
        filter: a < 1 ? `blur(${(1 - a) * 12}px)` : undefined,
        transform: `translateY(${(1 - a) * 20}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// aparece em "at" (segundos)
const useK = (at: number, dur = 14, e = OUT) => {
  const f = useCurrentFrame();
  return it(f, fr(at), fr(at) + dur, 0, 1, e);
};

const Box: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  borda?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, x, y, w, h, borda = C.boxBorder, children, style }) => {
  const k = useK(at, 14, SNAP);
  const f = useCurrentFrame();
  if (f < fr(at)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: 26,
        background: C.box,
        border: `2px solid ${borda}`,
        boxShadow: "none",
        opacity: Math.min(1, k * 1.3),
        transform: `translateY(${(1 - k) * 40}px)`,
        fontFamily: SANS,
        color: C.ink,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// título no topo (Inter 800 neon + rótulo menta, como "Art. 2º  DISPOSIÇÕES GERAIS" da RDC)
const Cabeca: React.FC<{
  at: number;
  titulo: string;
  sub?: string;
  cor?: string;
}> = ({ at, titulo, sub }) => {
  const cor = NEON;
  const k = useK(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 112,
        opacity: k,
        transform: `translateX(${(1 - k) * -30}px)`,
        display: "flex",
        alignItems: "baseline",
        gap: 36,
        fontFamily: SANS,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 96, color: cor }}>
        {titulo}
      </span>
      {sub && (
        <span
          style={{
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 2,
            color: MINT,
            textTransform: "uppercase",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
};

// trecho destacado: fica amarelo quando é lido (vermelho nas pegadinhas), sem marca-texto
const G: React.FC<{ at: number; cor?: string; children: React.ReactNode }> = ({
  at,
  cor,
  children,
}) => {
  const f = useCurrentFrame();
  const k = it(f, fr(at), fr(at) + 8, 0, 1, OUT);
  const c = cor === VERM ? VERM : YEL;
  return <span style={{ color: mix(C.ink, c, k) }}>{children}</span>;
};

// lei seca solta na tela (sem cartão): palavras apagadas que acendem no tempo da narração
type Pal = { w: string; s: number };
const PALAVRAS = PAL as Pal[];
const nrm = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
// tempo (s, narração original) de cada palavra do trecho, procurando na transcrição a partir de "at"
const tempos = (at: number, ws: string[]): number[] => {
  let j = PALAVRAS.findIndex((p) => p.s >= at - 1.2);
  if (j < 0) j = PALAVRAS.length;
  const t: (number | null)[] = ws.map(() => null);
  ws.forEach((w, i) => {
    const n = nrm(w);
    if (!n) return;
    for (let k = j; k < Math.min(PALAVRAS.length, j + 6); k++) {
      if (nrm(PALAVRAS[k].w) === n) {
        t[i] = PALAVRAS[k].s;
        j = k + 1;
        return;
      }
    }
  });
  // palavras que o whisper ouviu diferente: interpola entre as vizinhas
  const out: number[] = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== null) {
      out.push(t[i] as number);
      continue;
    }
    let a = i - 1;
    while (a >= 0 && t[a] === null) a--;
    let b = i + 1;
    while (b < t.length && t[b] === null) b++;
    const ta = a >= 0 ? (t[a] as number) : at;
    const tb = b < t.length ? (t[b] as number) : ta + 0.35 * (b - a);
    out.push(ta + ((tb - ta) * (i - a)) / (b - a));
  }
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1]);
  return out;
};
const listaPalavras = (n: React.ReactNode, out: string[] = []): string[] => {
  if (typeof n === "string")
    n.split(/\s+/)
      .filter((w) => w)
      .forEach((w) => out.push(w));
  else if (Array.isArray(n)) n.forEach((c) => listaPalavras(c, out));
  else if (React.isValidElement(n))
    listaPalavras((n.props as { children?: React.ReactNode }).children, out);
  return out;
};

const LeiSeca: React.FC<{
  at: number;
  x?: number;
  y?: number;
  w?: number;
  size?: number;
  rotulo?: string;
  children: React.ReactNode;
}> = ({
  at,
  x = 120,
  y = 250,
  w = 1000,
  size = 36,
  rotulo = "LEI SECA",
  children,
}) => {
  const f = useCurrentFrame();
  const ts = React.useMemo(
    () => tempos(at, listaPalavras(children)),
    [at, children],
  );
  const k = useK(at, 12);
  if (f < fr(at) - 1) return null;
  const vis = (i: number) =>
    0.28 + 0.72 * it(f, fr(ts[i] ?? at) - 2, fr(ts[i] ?? at) + 4, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: Math.max(120, x),
        top: Math.max(262, y),
        width: w + 40,
        opacity: k,
        transform: `translateY(${(1 - k) * 20}px)`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: 4,
          color: MINT,
          marginBottom: 18,
        }}
      >
        {rotulo}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: Math.round(size * 1.3),
          lineHeight: 1.36,
          color: C.ink,
        }}
      >
        {digita(children, { i: 0 }, vis)}
      </div>
    </div>
  );
};

const digita = (
  n: React.ReactNode,
  ctx: { i: number },
  vis: (i: number) => number,
): React.ReactNode => {
  if (typeof n === "string")
    return n.split(/(\s+)/).map((w, j) =>
      w.trim() ? (
        <span key={j} style={{ opacity: vis(ctx.i++) }}>
          {w}
        </span>
      ) : (
        w
      ),
    );
  if (Array.isArray(n))
    return n.map((c, j) => (
      <React.Fragment key={j}>{digita(c, ctx, vis)}</React.Fragment>
    ));
  if (React.isValidElement(n)) {
    const el = n as React.ReactElement<{ children?: React.ReactNode }>;
    if (el.props.children === undefined) return el;
    return React.cloneElement(
      el,
      undefined,
      digita(el.props.children, ctx, vis),
    );
  }
  return n;
};

// linha com emoji + texto (painel da direita)
const Linha: React.FC<{
  at: number;
  x?: number;
  y: number;
  w?: number;
  icone: string;
  cor?: string;
  size?: number;
  children: React.ReactNode;
}> = ({ at, x = 1190, y, w = 630, icone, cor = OURO, size = 32, children }) => (
  <Box
    at={at}
    x={x}
    y={y}
    w={w}
    borda={rgba(cor, 0.55)}
    style={{
      padding: "20px 26px",
      display: "flex",
      alignItems: "center",
      gap: 20,
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: size * 1.3, lineHeight: 1 }}>
      {icone}
    </span>
    <span style={{ fontWeight: 600, fontSize: size, lineHeight: 1.25 }}>
      {children}
    </span>
  </Box>
);

const Chip: React.FC<{
  at: number;
  x: number;
  y: number;
  cor?: string;
  size?: number;
  children: React.ReactNode;
}> = ({ at, x, y, cor = OURO, size = 34, children }) => {
  const k = useK(at, 14, SNAP);
  const f = useCurrentFrame();
  if (f < fr(at)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`,
        opacity: Math.min(1, k * 1.4),
        padding: `${size * 0.4}px ${size * 0.8}px`,
        borderRadius: 999,
        border: `2.5px solid ${cor}`,
        background: rgba(cor, 0.14),
        color: cor,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: "nowrap",
        boxShadow: `0 0 ${18 * k}px ${rgba(cor, 0.25)}`,
      }}
    >
      {children}
    </div>
  );
};

const Emo: React.FC<{
  at: number;
  x: number;
  y: number;
  size: number;
  children: string;
}> = ({ at, x, y, size, children }) => {
  const f = useCurrentFrame();
  const k = useK(at, 14, SNAP);
  if (f < fr(at)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin(f / 22) * 5,
        transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * k})`,
        opacity: Math.min(1, k * 1.5),
        fontFamily: EMOJI,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
};

const Texto: React.FC<{
  at: number;
  x?: number;
  y: number;
  w?: number;
  size?: number;
  cor?: string;
  font?: string;
  weight?: number;
  align?: "center" | "left";
  children: React.ReactNode;
}> = ({
  at,
  x = 0,
  y,
  w = W,
  size = 40,
  cor = C.ink,
  font = SANS,
  weight = 600,
  align = "center",
  children,
}) => {
  const f = useCurrentFrame();
  const k = useK(at, 14);
  if (f < fr(at) - 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        textAlign: align,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color: cor,
        lineHeight: 1.3,
        opacity: k,
        transform: `translateY(${(1 - k) * 24}px)`,
        filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// carimbo CERTO / ERRADO
const Carimbo: React.FC<{
  at: number;
  x: number;
  y: number;
  ok: boolean;
  size?: number;
}> = ({ at, x, y, ok, size = 64 }) => {
  const f = useCurrentFrame();
  if (f < fr(at)) return null;
  const k = it(f, fr(at), fr(at) + 10, 0, 1, OUT);
  const cor = ok ? VERDE : VERM;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(-8deg) scale(${1.8 - 0.8 * k})`,
        opacity: k,
        padding: `${size * 0.18}px ${size * 0.5}px`,
        border: `${size * 0.09}px solid ${cor}`,
        borderRadius: 16,
        color: cor,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 6,
        whiteSpace: "nowrap",
        background: rgba(cor, 0.1),
        boxShadow: `0 0 40px ${rgba(cor, 0.35)}`,
      }}
    >
      {ok ? "✓ CERTO" : "✗ ERRADO"}
    </div>
  );
};

// pegadinha: frase falsa → riscada + ERRADO → correção
const Pegadinha: React.FC<{
  at: number;
  x?: number;
  y?: number;
  w?: number;
  frase: string;
  errado: number;
  correcao?: string;
  corrAt?: number;
  size?: number;
}> = ({
  at,
  x = 260,
  y = 300,
  w = 1400,
  frase,
  errado,
  correcao,
  corrAt,
  size = 50,
}) => {
  const f = useCurrentFrame();
  const risco = it(f, fr(errado), fr(errado) + 12, 0, 1, OUT);
  return (
    <>
      <Box
        at={at}
        x={x}
        y={y}
        w={w}
        borda={rgba(VERM, 0.75)}
        style={{
          padding: "40px 56px 46px",
          boxShadow: `0 0 40px ${rgba(VERM, 0.2)}`,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: 4,
            color: VERM,
            marginBottom: 20,
          }}
        >
          <span style={{ fontFamily: EMOJI }}>⚠️</span> PEGADINHA DE BANCA
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: size,
            lineHeight: 1.35,
            color: mix(C.ink, C.dim, risco),
          }}
        >
          “{frase}”
          {risco > 0 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "52%",
                width: `${risco * 100}%`,
                height: 5,
                background: VERM,
                borderRadius: 3,
                boxShadow: `0 0 12px ${VERM}`,
              }}
            />
          )}
        </div>
      </Box>
      <Carimbo at={errado} x={x + w - 150} y={y - 18} ok={false} size={44} />
      {correcao && corrAt !== undefined && (
        <Texto
          at={corrAt}
          x={x}
          y={y + 330}
          w={w}
          size={46}
          cor={VERDE}
          weight={700}
        >
          ✓ {correcao}
        </Texto>
      )}
    </>
  );
};

// contador "pause e responda" (5 s)
const Pausa: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const a = inicioPausa(i),
    b = a + PAUSA * FPS;
  if (f < a || f > b + 8) return null;
  const k = Math.min(
    it(f, a, a + 10, 0, 1, OUT),
    1 - it(f, b - 2, b + 8, 0, 1, IN),
  );
  const prog = P(f, a, b);
  const n = Math.max(1, Math.ceil(PAUSA - (f - a) / FPS));
  const R = 46,
    circ = 2 * Math.PI * R;
  return (
    <div
      style={{
        position: "absolute",
        left: W / 2,
        top: 960,
        transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * k})`,
        opacity: k,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "14px 40px 14px 18px",
        borderRadius: 999,
        background: "rgba(4,18,15,0.92)",
        border: `2px solid ${rgba(OURO, 0.7)}`,
        fontFamily: SANS,
      }}
    >
      <svg width={110} height={110}>
        <circle
          cx={55}
          cy={55}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={8}
        />
        <circle
          cx={55}
          cy={55}
          r={R}
          fill="none"
          stroke={OURO}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * prog}
          transform="rotate(-90 55 55)"
        />
        <text
          x={55}
          y={70}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={800}
          fontSize={44}
          fill={C.ink}
        >
          {n}
        </text>
      </svg>
      <span
        style={{ fontWeight: 800, fontSize: 40, letterSpacing: 3, color: OURO }}
      >
        ⏸ PAUSE E RESPONDA
      </span>
    </div>
  );
};

// ========== CENAS (Ep. 2: arts. 5º, 6º e 6º-A) ==========

// mapa da lei: hoje acende o começo do Título II (arts. 5º ao 6º-A)
const MAPA: [string, string, string][] = [
  ["DISPOSIÇÃO", "Preliminar", "Art. 1º"],
  ["TÍTULO I", "Disposições gerais", "Arts. 2º e 3º"],
  ["TÍTULO II", "Do SUS", "Arts. 4º a 19-Z"],
  ["TÍTULO III", "Serviços privados", "Arts. 20 a 26"],
  ["TÍTULO III-A", "Telessaúde", "Arts. 26-A a 26-H"],
  ["TÍTULO IV", "Recursos humanos", "Arts. 27 a 30"],
  ["TÍTULO V", "Financiamento", "Arts. 31 a 38"],
  ["FINAIS", "Disposições finais", "Arts. 39 a 55"],
];
const MX = 97,
  MW = 200,
  MG = 18,
  MY = 330,
  MH = 260;
const mapaX = (i: number) => MX + i * (MW + MG);

const Mapa: React.FC = () => {
  const f = useCurrentFrame();
  const foco = it(f, fr(10.7), fr(10.7) + 18, 0, 1, OUT);
  return (
    <>
      <Cabeca at={9.1} titulo="Mapa da lei" sub="onde estamos hoje" />
      {MAPA.map(([tit, nome, arts], i) => {
        const at = 9.2 + i * 0.12;
        const k = useK(at, 14, SNAP);
        if (f < fr(at)) return null;
        const hoje = i === 2;
        const cor = hoje ? YEL : NEON;
        const op = hoje ? 1 : i < 2 ? 1 - 0.65 * foco : 1 - 0.5 * foco;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mapaX(i),
              top: MY,
              width: MW,
              height: MH,
              boxSizing: "border-box",
              borderRadius: 22,
              padding: "22px 14px",
              background: hoje ? "rgba(14,52,40,0.95)" : C.box,
              border: `2px solid ${hoje ? rgba(cor, 0.35 + 0.55 * foco) : C.boxBorder}`,
              boxShadow: hoje ? `0 0 ${30 * foco}px ${rgba(cor, 0.3)}` : "none",
              opacity: Math.min(1, k * 1.3) * op,
              transform: `translateY(${(1 - k) * 40}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: SANS,
              overflow: "hidden",
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2, color: cor }}>
              {tit}
            </span>
            <span style={{ fontFamily: SERIF, fontSize: 28, lineHeight: 1.1, color: C.ink }}>
              {nome}
            </span>
            <span style={{ marginTop: "auto", fontWeight: 600, fontSize: 21, color: C.dim }}>
              {arts}
            </span>
            {hoje && (
              <div
                style={{
                  position: "absolute",
                  left: MW * 0.18,
                  top: 0,
                  width: MW * 0.26,
                  height: "100%",
                  background: rgba(YEL, 0.16 * foco),
                  borderLeft: `2px dashed ${rgba(YEL, 0.7 * foco)}`,
                  borderRight: `2px dashed ${rgba(YEL, 0.7 * foco)}`,
                }}
              />
            )}
          </div>
        );
      })}
      <Texto at={10.7} x={mapaX(2) + MW / 2 - 300} w={600} y={MY + MH + 40} size={32} cor={YEL} weight={800}>
        EPISÓDIO 2 · Arts. 5º ao 6º-A
      </Texto>
      <Chip at={13.5} x={760} y={MY + MH + 190} cor={NEON} size={30}>
        objetivos do SUS
      </Chip>
      <Chip at={16.0} x={1160} y={MY + MH + 190} cor={YEL} size={30}>
        campo de atuação
      </Chip>
    </>
  );
};

const Abertura: React.FC = () => (
  <>
    <Fase de={0} ate={9.0}>
      <Texto at={0} y={200} size={30} cor={MINT} weight={600}>
        LEI Nº 8.080/1990 · EPISÓDIO 2
      </Texto>
      <Texto at={0.2} y={260} size={120} weight={800} cor={NEON}>
        O SUS não é só hospital
      </Texto>
      <Emo at={2.9} x={460} y={560} size={130}>
        💧
      </Emo>
      <Texto at={2.9} x={240} w={440} y={650} size={36}>
        a água que você bebe
      </Texto>
      <Emo at={4.3} x={960} y={560} size={130}>
        💊
      </Emo>
      <Texto at={4.3} x={740} w={440} y={650} size={36}>
        o remédio da farmácia
      </Texto>
      <Emo at={6.3} x={1460} y={560} size={130}>
        👷
      </Emo>
      <Texto at={6.3} x={1240} w={440} y={650} size={36}>
        o seu trabalho
      </Texto>
      <Texto at={7.3} y={800} size={54} font={SERIF} weight={400} cor={YEL}>
        e isso cai em concurso
      </Texto>
    </Fase>
    <Fase de={9.1} ate={21.5}>
      <Mapa />
    </Fase>
  </>
);

const Art5: React.FC = () => (
  <>
    <Fase de={21.6} ate={64.1}>
      <Cabeca at={21.6} titulo="Art. 5º" sub="os objetivos do SUS" />
      <LeiSeca at={21.7} size={34}>
        Art. 5º São objetivos do Sistema Único de Saúde SUS: I - a{" "}
        <G at={26.8}>identificação e divulgação</G> dos fatores condicionantes e
        determinantes da saúde; II - a <G at={35.0}>formulação de política</G> de
        saúde destinada a promover, nos campos econômico e social, a observância do
        disposto no § 1º do art. 2º desta lei; III - a <G at={49.5}>assistência</G>{" "}
        às pessoas por intermédio de ações de promoção, proteção e recuperação da
        saúde, com a realização integrada das ações assistenciais e das atividades
        preventivas.
      </LeiSeca>
      <Linha at={26.7} y={270} icone="🔎">
        identificar e divulgar os determinantes
      </Linha>
      <Linha at={32.4} y={400} icone="↩️" cor={MINT} size={28}>
        aqueles do art. 3º
      </Linha>
      <Linha at={34.9} y={510} icone="📝">
        formular a política de saúde
      </Linha>
      <Linha at={49.4} y={640} icone="🩺">
        assistir: promoção, proteção e recuperação
      </Linha>
      <Texto at={60.5} x={1190} w={630} y={790} size={28} cor={C.dim} weight={700}>
        MACETE
      </Texto>
      <Chip at={61.4} x={1300} y={880} size={30}>
        identificar
      </Chip>
      <Chip at={62.5} x={1505} y={880} size={30} cor={YEL}>
        formular
      </Chip>
      <Chip at={63.3} x={1710} y={880} size={30}>
        assistir
      </Chip>
    </Fase>
    <Fase de={64.2} ate={73.0}>
      <Pegadinha
        at={64.2}
        frase="O SUS tem como objetivo apenas as ações curativas."
        errado={68.9}
        correcao="O inciso III junta assistência e prevenção."
        corrAt={69.9}
      />
    </Fase>
  </>
);

const TILES: [number, string, string][] = [
  [79.1, "🏪", "vigilância sanitária"],
  [80.9, "📈", "vigilância epidemiológica"],
  [82.9, "👷", "saúde do trabalhador"],
  [84.0, "💊", "assistência terapêutica e farmacêutica"],
  [88.0, "🦷", "saúde bucal"],
  [89.3, "🏭", "Ceis (complexo industrial)"],
];

const Tile: React.FC<{
  at: number;
  x: number;
  y: number;
  icone: string;
  nome: string;
  cor?: string;
  selo?: string;
  seloAt?: number;
}> = ({ at, x, y, icone, nome, cor = OURO, selo, seloAt }) => (
  <>
    <Box
      at={at}
      x={x}
      y={y}
      w={250}
      h={190}
      borda={rgba(cor, 0.5)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        textAlign: "center",
        padding: 10,
      }}
    >
      <span style={{ fontFamily: EMOJI, fontSize: 70, lineHeight: 1 }}>
        {icone}
      </span>
      <span style={{ fontWeight: 700, fontSize: 25, lineHeight: 1.15 }}>
        {nome}
      </span>
    </Box>
    {selo && seloAt !== undefined && (
      <Chip at={seloAt} x={x + 225} y={y + 10} size={22} cor={VERDE}>
        {selo}
      </Chip>
    )}
  </>
);

const Art6I: React.FC = () => (
  <Fase de={73.1} ate={117.1}>
    <Cabeca at={73.1} titulo="Art. 6º, I" sub="o SUS executa ações de" />
    <LeiSeca at={73.2} size={34} w={960}>
      Art. 6º Estão incluídas ainda no campo de atuação do Sistema Único de Saúde
      (SUS): I - a execução de ações: a) de vigilância sanitária; b) de vigilância
      epidemiológica; c) de saúde do trabalhador; d) de assistência terapêutica
      integral, <G at={112.8}>inclusive farmacêutica</G>; e){" "}
      <G at={100.3}>de saúde bucal</G>; f) de promoção do desenvolvimento
      produtivo, tecnológico e da inovação do{" "}
      <G at={105.5}>Complexo Econômico-Industrial da Saúde (Ceis)</G>;
    </LeiSeca>
    {TILES.map(([at, ic, nome], i) => (
      <Tile
        key={i}
        at={at}
        x={1230 + (i % 2) * 290}
        y={250 + Math.floor(i / 2) * 230}
        icone={ic}
        nome={nome}
        selo={i === 4 ? "2023" : i === 5 ? "2026" : undefined}
        seloAt={i === 4 ? 100.3 : i === 5 ? 105.5 : undefined}
      />
    ))}
  </Fase>
);

// incisos II a XIII: lista que vai acendendo
const INCISOS: [number, string, string, string?][] = [
  [118.7, "II", "saneamento básico", "participa"],
  [124.9, "III", "formação de recursos humanos"],
  [128.5, "IV", "vigilância nutricional e alimentar"],
  [131.9, "V", "proteção do meio ambiente", "colabora"],
  [135.8, "VI", "medicamentos e insumos"],
  [143.5, "VII", "serviços, produtos e substâncias"],
  [148.9, "VIII", "alimentos, água e bebidas"],
  [153.9, "IX", "psicoativos, tóxicos e radioativos"],
  [160.5, "X", "ciência e tecnologia"],
  [163.9, "XI", "sangue e derivados"],
  [170.2, "XII", "assistência toxicológica · 2023"],
  [178.0, "XIII", "instrumentos para o Ceis · 2026"],
];

const Inciso: React.FC<{
  at: number;
  x: number;
  y: number;
  num: string;
  txt: string;
  verbo?: string;
  verboAt?: number;
}> = ({ at, x, y, num, txt, verbo, verboAt }) => {
  const f = useCurrentFrame();
  const k = useK(at, 12, SNAP);
  if (f < fr(at)) return null;
  const vk = verboAt !== undefined ? it(f, fr(verboAt), fr(verboAt) + 10, 0, 1, OUT) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: Math.min(1, k * 1.3),
        transform: `translateX(${(1 - k) * -24}px)`,
        fontFamily: SANS,
      }}
    >
      <span
        style={{
          minWidth: 84,
          height: 46,
          borderRadius: 23,
          background: NEON,
          color: BG0,
          fontWeight: 800,
          fontSize: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 14px",
          boxSizing: "border-box",
        }}
      >
        {num}
      </span>
      <span style={{ fontFamily: SERIF, fontSize: 44, color: C.ink, whiteSpace: "nowrap" }}>
        {txt}
        {verbo && (
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 26,
              marginLeft: 16,
              padding: "4px 14px",
              borderRadius: 999,
              border: `2px solid ${mix(MINT, YEL, vk)}`,
              color: mix(MINT, YEL, vk),
              verticalAlign: "middle",
            }}
          >
            {verbo}
          </span>
        )}
      </span>
    </div>
  );
};

const Art6Lista: React.FC = () => (
  <>
    <Fase de={117.2} ate={193.9}>
      <Cabeca at={117.2} titulo="Art. 6º, II a XIII" sub="a lista continua" />
      {INCISOS.map(([at, num, txt, verbo], i) => (
        <Inciso
          key={i}
          at={at}
          x={i < 6 ? 120 : 1000}
          y={280 + (i % 6) * 112}
          num={num}
          txt={txt}
          verbo={verbo}
          verboAt={verbo === "participa" ? 187.3 : verbo === "colabora" ? 190.0 : undefined}
        />
      ))}
      <Texto at={192.4} y={958} size={34} cor={YEL} weight={700}>
        não é o SUS sozinho
      </Texto>
    </Fase>
    <Fase de={194.0} ate={205.3}>
      <Pegadinha
        at={194.0}
        frase="Compete ao SUS executar, com exclusividade, as ações de saneamento básico."
        errado={200.5}
        correcao="Ele participa da formulação da política e da execução."
        corrAt={201.5}
      />
    </Fase>
  </>
);

const Vigilancias: React.FC = () => (
  <>
    <Fase de={205.4} ate={253.7}>
      <Cabeca at={205.4} titulo="§§ 1º e 2º" sub="a dupla que mais confunde" />
      <LeiSeca at={208.2} size={27} w={760} rotulo="§ 1º · VIGILÂNCIA SANITÁRIA">
        § 1º Entende-se por vigilância sanitária um conjunto de ações capaz de{" "}
        <G at={212.8}>eliminar, diminuir ou prevenir riscos</G> à saúde e de
        intervir nos problemas sanitários decorrentes do meio ambiente, da produção
        e circulação de bens e da prestação de serviços de interesse da saúde,
        abrangendo: I - o controle de bens de consumo [...], da produção ao
        consumo; e II - o controle da prestação de serviços [...].
      </LeiSeca>
      <LeiSeca at={232.7} x={1000} size={27} w={760} rotulo="§ 2º · VIGILÂNCIA EPIDEMIOLÓGICA">
        § 2º Entende-se por vigilância epidemiológica um conjunto de ações que
        proporcionam o{" "}
        <G at={238.1}>
          conhecimento, a detecção ou prevenção de qualquer mudança nos fatores
          determinantes e condicionantes
        </G>{" "}
        de saúde individual ou coletiva, com a finalidade de recomendar e adotar as
        medidas de prevenção e controle das doenças ou agravos.
      </LeiSeca>
    </Fase>
    <Fase de={253.8} ate={281.0}>
      <Cabeca at={253.8} titulo="Macete" sub="coisas × doenças" />
      <Box at={254.8} x={120} y={250} w={800} h={330} borda={rgba(NEON, 0.6)} style={{ padding: "30px 40px" }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: NEON, letterSpacing: 1 }}>SANITÁRIA</div>
        <div style={{ fontFamily: SERIF, fontSize: 50, marginTop: 10 }}>cuida das coisas</div>
        <div style={{ fontWeight: 600, fontSize: 32, color: C.dim, marginTop: 8 }}>
          produto · serviço · ambiente
        </div>
        <div style={{ fontFamily: EMOJI, fontSize: 64, marginTop: 18 }}>💊 🍽️ 🏪</div>
      </Box>
      <Box at={262.9} x={1000} y={250} w={800} h={330} borda={rgba(YEL, 0.6)} style={{ padding: "30px 40px" }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: YEL, letterSpacing: 1 }}>EPIDEMIOLÓGICA</div>
        <div style={{ fontFamily: SERIF, fontSize: 50, marginTop: 10 }}>acompanha as doenças</div>
        <div style={{ fontWeight: 600, fontSize: 32, color: C.dim, marginTop: 8 }}>
          notificação · surto · vacinação
        </div>
        <div style={{ fontFamily: EMOJI, fontSize: 64, marginTop: 18 }}>📊 🦠 💉</div>
      </Box>
      <Texto at={268.8} y={640} size={30} cor={VERM} weight={800}>
        ⚠️ PEGADINHA: A BANCA TROCA AS DEFINIÇÕES
      </Texto>
      <Texto at={272.1} y={720} size={44} font={SERIF} weight={400}>
        “eliminar, diminuir ou prevenir riscos” → <span style={{ color: NEON }}>sanitária</span>
      </Texto>
      <Texto at={276.0} y={810} size={44} font={SERIF} weight={400}>
        “detectar mudanças nos determinantes” → <span style={{ color: YEL }}>epidemiológica</span>
      </Texto>
    </Fase>
  </>
);

const Trabalhador: React.FC = () => (
  <>
    <Fase de={281.2} ate={328.0}>
      <Cabeca at={281.2} titulo="§ 3º" sub="saúde do trabalhador" />
      <LeiSeca at={281.3} size={33} w={960}>
        § 3º Entende-se por saúde do trabalhador, para fins desta lei, um conjunto de
        atividades que se destina,{" "}
        <G at={286.4}>
          através das ações de vigilância epidemiológica e vigilância sanitária
        </G>
        , à promoção e proteção da saúde dos trabalhadores, assim como visa à
        recuperação e reabilitação da saúde dos trabalhadores submetidos aos riscos e
        agravos advindos das condições de trabalho, abrangendo:
      </LeiSeca>
      <Linha at={301.9} y={270} icone="🚑">
        vítima de acidente ou doença do trabalho
      </Linha>
      <Linha at={306.8} y={400} icone="🔍">
        riscos no processo de trabalho
      </Linha>
      <Linha at={310.3} y={530} icone="⚙️">
        impacto das tecnologias na saúde
      </Linha>
      <Linha at={314.4} y={660} icone="📢">
        informar trabalhador, sindicato e empresas
      </Linha>
      <Linha at={321.7} y={790} icone="📋">
        lista oficial de doenças do trabalho
      </Linha>
    </Fase>
    <Fase de={328.1} ate={343.9}>
      <Cabeca at={328.1} titulo="§ 3º, VIII" sub="esse cai muito" />
      <LeiSeca at={328.2} size={42} x={160} w={1440}>
        VIII - a garantia ao sindicato dos trabalhadores de{" "}
        <G at={332.4}>requerer ao órgão competente</G> a interdição de máquina, de
        setor de serviço ou de todo ambiente de trabalho, quando houver exposição a
        risco iminente para a vida ou saúde dos trabalhadores.
      </LeiSeca>
    </Fase>
    <Fase de={344.0} ate={352.3}>
      <Pegadinha
        at={344.0}
        frase="O sindicato pode interditar a máquina."
        errado={347.7}
        correcao="Ele REQUER a interdição ao órgão competente."
        corrAt={348.6}
      />
    </Fase>
  </>
);

const DEFS: [number, string, string, string, string][] = [
  [
    355.8,
    "🦷",
    "Saúde bucal",
    "2023",
    "promoção, prevenção, recuperação e reabilitação odontológica, individual e coletiva",
  ],
  [
    372.1,
    "☠️",
    "Assistência toxicológica",
    "2023",
    "prevenção, diagnóstico e tratamento de intoxicações: químicos, remédios, animais peçonhentos, plantas",
  ],
  [
    389.2,
    "🏭",
    "Ceis",
    "2026",
    "base produtiva e tecnológica da saúde: medicamentos, vacinas, soros, hemoderivados, IFA",
  ],
];

const Definicoes: React.FC = () => (
  <Fase de={352.4} ate={409.6}>
    <Cabeca at={352.4} titulo="§§ 4º, 5º e 6º" sub="definições novas" />
    {DEFS.map(([at, ic, nome, ano, txt], i) => (
      <Box
        key={i}
        at={at}
        x={120}
        y={250 + i * 230}
        w={1680}
        h={200}
        borda={rgba(i === 2 ? YEL : NEON, 0.45)}
        style={{ display: "flex", alignItems: "center", gap: 34, padding: "0 40px" }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 86, lineHeight: 1 }}>{ic}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontWeight: 800, fontSize: 44, color: i === 2 ? YEL : NEON }}>{nome}</span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 24,
                padding: "4px 16px",
                borderRadius: 999,
                background: i === 2 ? YEL : NEON,
                color: BG0,
              }}
            >
              desde {ano}
            </span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.15, marginTop: 8 }}>{txt}</div>
        </div>
      </Box>
    ))}
  </Fase>
);

const Art6A: React.FC = () => (
  <>
    <Fase de={409.7} ate={428.0}>
      <Cabeca at={409.7} titulo="Art. 6º-A" sub="estoque de remédios na internet" />
      <LeiSeca at={409.8} size={38} w={1000}>
        Art. 6º-A. As diferentes instâncias gestoras do Sistema Único de Saúde (SUS)
        ficam obrigadas a disponibilizar nas respectivas páginas eletrônicas na
        internet os estoques de medicamentos das farmácias públicas que estiverem
        sob sua gestão, com <G at={423.7}>atualização quinzenal</G>, de forma
        acessível ao cidadão comum.
      </LeiSeca>
      <Emo at={418.6} x={1500} y={380} size={150}>
        💊
      </Emo>
      <Texto at={418.6} x={1200} w={600} y={480} size={36}>
        estoque das farmácias públicas
      </Texto>
      <Emo at={423.7} x={1500} y={680} size={150}>
        📅
      </Emo>
      <Chip at={424.3} x={1500} y={800} size={36} cor={YEL}>
        a cada 15 dias
      </Chip>
    </Fase>
    <Fase de={428.1} ate={435.0}>
      <Pegadinha
        at={428.1}
        frase="A atualização dos estoques na internet é mensal."
        errado={432.2}
        correcao="É quinzenal: a cada 15 dias."
        corrAt={433.1}
      />
    </Fase>
  </>
);

type Opcao = [string, string, number];
const Questao: React.FC<{
  de: number;
  ate: number;
  n: number;
  ce?: boolean;
  enunciado: string;
  opcoes?: Opcao[];
  pausa: number;
  gabAt: number;
  ok?: boolean;
  certa?: string;
  explicacao: string;
  explAt: number;
}> = ({
  de,
  ate,
  n,
  ce,
  enunciado,
  opcoes,
  pausa,
  gabAt,
  ok,
  certa,
  explicacao,
  explAt,
}) => {
  const f = useCurrentFrame();
  const revel = f >= fr(gabAt);
  return (
    <Fase de={de} ate={ate}>
      <Cabeca
        at={de}
        titulo={`Questão ${n}`}
        sub={ce ? "Certo ou errado?" : "Múltipla escolha"}
      />
      <Box
        at={de + 1.5}
        x={160}
        y={240}
        w={1600}
        borda={rgba(OURO, 0.4)}
        style={{ padding: "36px 50px" }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: opcoes ? 42 : 50,
            lineHeight: 1.4,
          }}
        >
          {enunciado}
        </div>
      </Box>
      {opcoes?.map(([l, txt, at], i) => {
        const certaK = revel && l === certa;
        const apaga = revel && l !== certa;
        return (
          <div key={l} style={{ opacity: apaga ? 0.35 : 1 }}>
            <Box
              at={at}
              x={160}
              y={(enunciado.length > 70 ? 450 : 400) + i * 92}
              w={1600}
              h={78}
              borda={certaK ? VERDE : C.boxBorder}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "0 30px",
                background: certaK ? rgba(VERDE, 0.16) : C.box,
              }}
            >
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: certaK ? VERDE : rgba(OURO, 0.18),
                  color: certaK ? BG0 : OURO,
                  fontWeight: 800,
                  fontSize: 30,
                }}
              >
                {l}
              </span>
              <span style={{ fontSize: 34, fontWeight: 600 }}>{txt}</span>
            </Box>
          </div>
        );
      })}
      <Pausa i={pausa} />
      {ce && <Carimbo at={gabAt} x={W / 2} y={650} ok={!!ok} size={80} />}
      <Texto
        at={explAt}
        y={ce ? 790 : 935}
        x={160}
        w={1600}
        size={ce ? 40 : 34}
        cor={ce ? C.ink : VERDE}
        weight={600}
      >
        {explicacao}
      </Texto>
    </Fase>
  );
};


const Questoes: React.FC = () => (
  <>
    <Fase de={435.1} ate={441.3}>
      <Texto at={435.1} y={300} size={130} weight={800} cor={OURO}>
        Questões
      </Texto>
      <Texto at={435.5} y={470} size={46}>
        Agora é a sua vez <span style={{ fontFamily: EMOJI }}>✍️</span>
      </Texto>
      <Chip at={437.0} x={560} y={680} size={34}>
        1. leia a questão
      </Chip>
      <Chip at={438.1} x={960} y={680} size={34} cor={AZUL}>
        2. pause
      </Chip>
      <Chip at={439.0} x={1340} y={680} size={34} cor={VERDE}>
        3. responda
      </Chip>
      <Texto at={440.1} y={800} size={34} cor={C.dim}>
        depois eu dou o gabarito
      </Texto>
    </Fase>
    <Questao
      de={441.4}
      ate={466.3}
      n={1}
      ce
      pausa={0}
      gabAt={460.6}
      ok={false}
      enunciado="Segundo a Lei 8.080/1990, a vigilância epidemiológica é o conjunto de ações capaz de eliminar, diminuir ou prevenir riscos à saúde decorrentes da produção e circulação de bens e da prestação de serviços."
      explicacao="Essa é a vigilância SANITÁRIA (art. 6º, § 1º)."
      explAt={461.5}
    />
    <Questao
      de={466.4}
      ate={481.1}
      n={2}
      ce
      pausa={1}
      gabAt={477.2}
      ok
      enunciado="A assistência terapêutica integral, inclusive farmacêutica, está incluída no campo de atuação do SUS."
      explicacao="Art. 6º, I, “d”."
      explAt={478.2}
    />
    <Questao
      de={481.2}
      ate={499.3}
      n={3}
      ce
      pausa={2}
      gabAt={494.2}
      ok={false}
      enunciado="Pela Lei 8.080/1990, o sindicato dos trabalhadores pode interditar diretamente uma máquina quando houver risco iminente à saúde dos trabalhadores."
      explicacao="O sindicato REQUER a interdição ao órgão competente (§ 3º, VIII)."
      explAt={495.4}
    />
    <Questao
      de={499.4}
      ate={519.3}
      n={4}
      pausa={3}
      gabAt={515.2}
      certa="C"
      enunciado="Os gestores do SUS devem divulgar na internet os estoques de medicamentos das farmácias públicas, com atualização:"
      opcoes={[
        ["A", "diária", 507.7],
        ["B", "semanal", 509.1],
        ["C", "quinzenal", 510.6],
        ["D", "mensal", 512.3],
        ["E", "trimestral", 513.7],
      ]}
      explicacao="✓ Letra C — Art. 6º-A"
      explAt={516.3}
    />
    <Questao
      de={519.4}
      ate={556.1}
      n={5}
      pausa={4}
      gabAt={550.9}
      certa="E"
      enunciado="Qual destas opções NÃO é objetivo do SUS, segundo o art. 5º da Lei 8.080/1990?"
      opcoes={[
        ["A", "identificar e divulgar os fatores condicionantes e determinantes da saúde", 525.7],
        ["B", "formular política de saúde nos campos econômico e social", 530.9],
        ["C", "dar assistência com ações de promoção, proteção e recuperação da saúde", 535.5],
        ["D", "integrar as ações assistenciais e as atividades preventivas", 541.5],
        ["E", "fixar o preço dos medicamentos vendidos nas farmácias privadas", 546.5],
      ]}
      explicacao="✓ Letra E — isso não está entre os objetivos do art. 5º."
      explAt={552.0}
    />
  </>
);

const RESUMO: [number, string][] = [
  [557.3, "Objetivos do SUS: identificar, formular e assistir."],
  [563.0, "O campo de atuação vai muito além do hospital."],
  [573.5, "Sanitária cuida das coisas; epidemiológica acompanha as doenças."],
  [583.5, "O sindicato requer a interdição. Ele não interdita."],
  [588.2, "Estoque das farmácias públicas na internet, a cada 15 dias."],
];

const Resumo: React.FC = () => (
  <>
    <Fase de={556.2} ate={594.8}>
      <Cabeca at={556.2} titulo="Resumo" sub="em 40 segundos" />
      {RESUMO.map(([at, txt], i) => (
        <Box
          key={i}
          at={at}
          x={160}
          y={240 + i * 150}
          w={1600}
          h={124}
          borda={rgba(OURO, 0.4)}
          style={{ display: "flex", alignItems: "center", gap: 32, padding: "0 40px" }}
        >
          <span
            style={{
              width: 70,
              height: 70,
              flexShrink: 0,
              borderRadius: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: OURO,
              color: BG0,
              fontWeight: 900,
              fontSize: 38,
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontSize: 40, fontWeight: 600 }}>{txt}</span>
        </Box>
      ))}
    </Fase>
    <Fase de={594.9} ate={601.8}>
      <Texto at={594.9} y={300} size={36} cor={C.dim} weight={700}>
        NO PRÓXIMO EPISÓDIO
      </Texto>
      <Texto at={596.6} y={370} size={100} weight={800} cor={OURO}>
        Art. 7º
      </Texto>
      <Texto at={597.9} y={510} size={46}>
        Princípios e diretrizes do SUS
      </Texto>
      <Chip at={600.2} x={960} y={700} cor={AZUL}>
        o artigo mais cobrado da lei
      </Chip>
    </Fase>
  </>
);

const Final: React.FC = () => (
  <>
    <Fase de={601.9} ate={604.6 + 0.6}>
      <Img
        src={staticFile("lei8080/logo.jpg")}
        style={{
          position: "absolute",
          left: W / 2 - 170,
          top: 230,
          width: 340,
          height: 340,
          borderRadius: "50%",
          border: `6px solid ${NEON}`,
          boxSizing: "border-box",
        }}
      />
      <Texto at={601.9} y={620} size={96} weight={800}>
        ME SIGA
      </Texto>
      <Texto at={602.3} y={750} size={54} font={SERIF} weight={400} cor={MINT}>
        para mais dicas sobre leis
      </Texto>
    </Fase>
    <Sequence from={FIM_FALA + 12}>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}
      >
        <BonsEstudos />
      </AbsoluteFill>
    </Sequence>
  </>
);

// câmera: aproxima no trecho grifado e volta [segundos, quanto tempo fica perto, x, y do ponto]
const ZOOMS: [number, number, number, number][] = [
  [332.4, 1.8, 760, 330], // "requerer ao órgão competente"
  [423.7, 1.5, 600, 560], // "atualização quinzenal"
];
// ---------- efeitos sonoros ----------
const PEGAS = [64.2, 194.0, 268.8, 344.0, 428.1];
const ERRADOS = [68.9, 200.5, 347.7, 432.2, 460.6, 477.2, 494.2];
const SFX: [number, string, number][] = [
  ...[9.1, 21.6, 73.1, 117.2, 205.4, 253.8, 281.2, 328.1, 352.4, 409.7, 435.1, 556.2, 594.9].map(
    (s) => [fr(s), "whoosh", 0.28] as [number, string, number],
  ),
  ...PEGAS.map((s) => [fr(s), "plim", 0.12] as [number, string, number]),
  ...ERRADOS.map((s) => [fr(s), "carimbo", 0.6] as [number, string, number]),
  [FIM_FALA + 12, "sting", 0.7],
  ...MAPA.map((_, i) => [fr(9.2 + i * 0.12), "pop", 0.1] as [number, string, number]),
  ...ZOOMS.map(([s]) => [fr(s), "whoosh", 0.12] as [number, string, number]),
  ...[516.3, 552.0].map((s) => [fr(s), "plim", 0.15] as [number, string, number]),
  ...TILES.map(([s]) => [fr(s), "pop", 0.18] as [number, string, number]),
  ...INCISOS.map(([s]) => [fr(s), "pop", 0.14] as [number, string, number]),
  ...DEFS.map(([s]) => [fr(s), "pop", 0.18] as [number, string, number]),
  ...CORTES.flatMap((_, i) =>
    [0, 1, 2, 3, 4].map((j) => [inicioPausa(i) + j * FPS, "bip", 0.16] as [number, string, number]),
  ),
];

const BonsEstudos: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, 0, 18, 0, 1, OUT);
  const k2 = it(f, 14, 32, 0, 1, OUT);
  return (
    <>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 130,
          color: OURO,
          opacity: k,
          transform: `translateY(${(1 - k) * 40}px)`,
          filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
        }}
      >
        Bons estudos!
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          color: C.dim,
          opacity: k2,
        }}
      >
        Fonte: Lei nº 8.080/1990, texto atualizado
      </div>
    </>
  );
};

// efeitos reais do Openverse (todos CC0)
const ARQ: Record<string, string> = {
  whoosh: "whoosh",
  plim: "ding",
  pop: "pop",
  carimbo: "carimbo",
  bip: "tique",
  sting: "sting",
};

// trilha só nos respiros: some enquanto ela fala e volta na abertura, nas pausas
// de "pause e responda", nos silêncios de 1,5 s ou mais e no final.
const FALA_FR = PALAVRAS.map((p) => fr(p.s));
const BLOCOS_FALA: [number, number][] = [];
FALA_FR.forEach((f) => {
  const ult = BLOCOS_FALA[BLOCOS_FALA.length - 1];
  if (ult && f - ult[1] < 45) ult[1] = f;
  else BLOCOS_FALA.push([f, f]);
});
const falando = (f: number) =>
  BLOCOS_FALA.some(([a, b]) => f >= a - 10 && f <= b + 20);
const NIVEL: number[] = [];
for (let f = 0, v = 0.22; f < DURATION + 30; f++) {
  const alvo = f > FIM_FALA ? 0.4 : falando(f) ? 0 : 0.22;
  v += (alvo - v) * (alvo < v ? 0.2 : 0.07);
  NIVEL.push(v);
}

const camera = (f: number) => {
  for (const [s, hold, x, y] of ZOOMS) {
    const a = fr(s),
      b = fr(s + hold);
    if (f >= a - 1 && f <= b + 24) {
      const z = it(f, a, a + 16, 0, 1, OUT) * (1 - it(f, b, b + 22, 0, 1, IN));
      return { s: 1 + 0.12 * z, ox: x, oy: y, z };
    }
  }
  return { s: 1, ox: W / 2, oy: H / 2, z: 0 };
};
// tremida curta quando o carimbo bate
const CARIMBOS = ERRADOS;
const tremida = (f: number) => {
  for (const s of CARIMBOS) {
    const d = f - fr(s);
    if (d >= 0 && d < 14) {
      const amp = 11 * (1 - d / 14);
      return [amp * Math.sin(d * 2.3), amp * 0.6 * Math.cos(d * 3.1)];
    }
  }
  return [0, 0];
};

export const VideoLei8080Ep2: React.FC = () => {
  const f = useCurrentFrame();
  const cor = f >= fr(194.5) && f < fr(252.7) ? AZUL : OURO;
  const cam = camera(f);
  const [dx, dy] = tremida(f);
  return (
    <AbsoluteFill>
      <Fundo
        cor={cor}
        pulsos={[]}
      />
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px,${dy}px) scale(${cam.s})`,
          transformOrigin: `${cam.ox}px ${cam.oy}px`,
        }}
      >
        <Abertura />
        <Art5 />
        <Art6I />
        <Art6Lista />
        <Vigilancias />
        <Trabalhador />
        <Definicoes />
        <Art6A />
        <Questoes />
        <Resumo />
        <Final />
      </AbsoluteFill>
      <div style={{ opacity: 1 - cam.z }}>
        <Hud />
      </div>
      <Audio src={staticFile("lei8080ep2/narracao.mp3")} />
      <Audio
        src={staticFile("lei8080/musica_deepstudy_longa.wav")}
        volume={(x) => (NIVEL[x] ?? 0.22) * (1 - P(x, DURATION - 40, DURATION))}
      />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={60}>
          <Audio
            src={staticFile(`sfx_openverse/${ARQ[name]}.mp3`)}
            volume={vol * 0.6}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
