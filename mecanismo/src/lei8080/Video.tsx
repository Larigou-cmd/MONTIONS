import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { IN, OUT, P, SNAP, it, mix, rgba, tri } from "../lib";

// "Lei 8.080 para concursos — Episódio 1" (Arts. 1º ao 4º), vídeo longo HORIZONTAL 1920×1080.
// Narração gravada pela Larissa no ElevenLabs (public/lei8080/narracao_usuaria.mp3).
// public/lei8080/narracao.mp3 = mesma narração com 5 s de silêncio antes de cada "Gabarito" (pause e responda).
// Tempos em SEGUNDOS da narração original (transcrição com faster-whisper); fr() converte para quadros já somando as pausas.
export const W = 1920;
export const H = 1080;
const FPS = 30;
const PAUSA = 5;
const CORTES = [271.9, 289.84, 304.85, 326.68, 357.8]; // onde entram as pausas (s, narração original)
const fr = (s: number) =>
  Math.round((s + PAUSA * CORTES.filter((c) => s >= c).length) * FPS);
const inicioPausa = (i: number) => Math.round((CORTES[i] + PAUSA * i) * FPS);

const OURO = "#f5c451"; // lei
const AZUL = "#60a5fa"; // SUS
const VERM = "#fb7185"; // pegadinha / errado
const VERDE = "#4ade80"; // certo
const EMOJI = "'Noto Color Emoji','Segoe UI Emoji',sans-serif";

const FIM_FALA = fr(411.8);
export const DURATION = FIM_FALA + 170; // ≈ 442 s

const PARTES: [number, string][] = [
  [0, "ABERTURA"],
  [19.3, "QUE LEI É ESSA?"],
  [54.4, "ART. 1º"],
  [80.4, "ART. 2º"],
  [128.2, "ART. 3º"],
  [194.5, "ART. 4º"],
  [252.7, "QUESTÕES"],
  [368.2, "RESUMO"],
  [408.3, "ATÉ O PRÓXIMO"],
];

// ---------- fundo horizontal ----------
const Fundo: React.FC<{ cor: string; pulsos: number[] }> = ({
  cor,
  pulsos,
}) => {
  const f = useCurrentFrame();
  const pulse = pulsos.reduce((s, p) => Math.max(s, tri(f, p, 15)), 0);
  const force = 0.3 + 0.05 * Math.sin((f / 240) * Math.PI * 2) + 0.16 * pulse;
  const rh = 520 + 40 * Math.sin((f / 330) * Math.PI * 2) + 100 * pulse;
  const [r, g, b] = [
    parseInt(cor.slice(1, 3), 16),
    parseInt(cor.slice(3, 5), 16),
    parseInt(cor.slice(5, 7), 16),
  ];
  const stops = Array.from({ length: 11 }, (_, i) => {
    const d = i / 10;
    return `rgba(${r},${g},${b},${(force * Math.pow(1 - d, 1.9)).toFixed(4)}) ${d * 100}%`;
  }).join(",");
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1500px 900px at 50% 30%, ${C.bg2} 0%, rgba(7,11,26,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1800px ${rh}px at 50% ${H + 140}px, ${stops})`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 80 }, (_, i) => {
          const x0 = random(`x${i}`) * W,
            y0 = random(`y${i}`) * H;
          const sp = 0.2 + random(`s${i}`) * 0.5,
            r0 = 1 + random(`r${i}`) * 2.2;
          const y = (((y0 - f * sp) % H) + H) % H;
          return (
            <circle
              key={i}
              cx={x0 + Math.sin(f / 40 + i) * 10}
              cy={y}
              r={r0}
              fill="rgb(170,185,255)"
              opacity={0.1 + 0.07 * Math.sin(f / 25 + i)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Grao: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill
      style={{ mixBlendMode: "multiply", opacity: 0.2, pointerEvents: "none" }}
    >
      <svg width={W} height={H}>
        <filter id={`g${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={seed}
          />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 1.08" />
        </filter>
        <rect width={W} height={H} filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

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
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily: SANS }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 52,
          display: "flex",
          gap: 16,
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            color: OURO,
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: 3,
          }}
        >
          LEI 8.080/1990
        </span>
        <span
          style={{
            color: C.dim,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2,
            opacity: k,
            transform: `translateY(${(1 - k) * 10}px)`,
            display: "inline-block",
          }}
        >
          · {PARTES[idx][1]}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 46,
          padding: "8px 18px",
          borderRadius: 999,
          border: `2px solid ${rgba(OURO, 0.6)}`,
          color: OURO,
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        EPISÓDIO 1
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: W,
          height: 5,
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: (W * f) / FIM_FALA,
          height: 5,
          background: OURO,
        }}
      />
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
        boxShadow: "0 16px 44px rgba(0,0,0,.35)",
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

// título de artigo no topo
const Cabeca: React.FC<{
  at: number;
  titulo: string;
  sub?: string;
  cor?: string;
}> = ({ at, titulo, sub, cor = OURO }) => {
  const k = useK(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 110,
        opacity: k,
        transform: `translateX(${(1 - k) * -30}px)`,
        display: "flex",
        alignItems: "baseline",
        gap: 26,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 78,
          color: cor,
          textShadow: `0 0 30px ${rgba(cor, 0.35)}`,
        }}
      >
        {titulo}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 34,
            color: C.dim,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
};

// trecho da lei grifado no tempo da fala
const G: React.FC<{ at: number; cor?: string; children: React.ReactNode }> = ({
  at,
  cor = OURO,
  children,
}) => {
  const f = useCurrentFrame();
  const k = it(f, fr(at), fr(at) + 14, 0, 1, OUT);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${rgba(cor, 0.3)},${rgba(cor, 0.3)})`,
        backgroundSize: `${k * 100}% 100%`,
        backgroundRepeat: "no-repeat",
        borderRadius: 6,
        padding: "0 4px",
        margin: "0 -4px",
        color: mix(C.ink, "#ffffff", k),
        boxShadow: k > 0 ? `inset 0 -3px 0 ${rgba(cor, 0.9 * k)}` : "none",
      }}
    >
      {children}
    </span>
  );
};

// cartão "lei seca"
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
  x = 100,
  y = 230,
  w = 1020,
  size = 36,
  rotulo = "LEI SECA",
  children,
}) => {
  // a lei é "digitada": as palavras aparecem em sequência (o espaço já fica reservado, o texto não pula)
  const f = useCurrentFrame();
  const n = Math.max(1, contaPalavras(children));
  const ini = fr(at) + 8;
  const dur = Math.min(80, Math.max(24, n * 1.1));
  const vis = (i: number) =>
    it(f, ini + (i * dur) / n, ini + (i * dur) / n + 5, 0, 1, OUT);
  return (
    <Box
      at={at}
      x={x}
      y={y}
      w={w}
      borda={rgba(OURO, 0.35)}
      style={{
        padding: "34px 44px 38px 52px",
        borderLeft: `8px solid ${OURO}`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: 4,
          color: OURO,
          marginBottom: 16,
        }}
      >
        📜 {rotulo}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: size,
          lineHeight: 1.55,
          color: C.ink,
        }}
      >
        {digita(children, { i: 0 }, vis)}
      </div>
    </Box>
  );
};

const contaPalavras = (n: React.ReactNode): number => {
  if (typeof n === "string") return n.split(/\s+/).filter((w) => w).length;
  if (Array.isArray(n))
    return n.reduce((s: number, c: React.ReactNode) => s + contaPalavras(c), 0);
  if (React.isValidElement(n))
    return contaPalavras((n.props as { children?: React.ReactNode }).children);
  return 0;
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
        background: "rgba(5,8,20,0.88)",
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

// ========== CENAS ==========

// mapa da lei inteira: reaproveitar nos próximos episódios (muda EP_DE / EP_ATE e o texto da chave)
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
  const foco = it(f, fr(6.12), fr(6.12) + 18, 0, 1, OUT); // acende o episódio de hoje
  const chave = it(f, fr(6.5), fr(6.5) + 24, 0, 1, OUT);
  const x0 = mapaX(0),
    x1 = mapaX(2) + MW * 0.42;
  return (
    <>
      <Cabeca at={5.06} titulo="Mapa da lei" sub="onde estamos hoje" />
      {MAPA.map(([tit, nome, arts], i) => {
        const at = 5.2 + i * 0.12;
        const k = useK(at, 14, SNAP);
        if (f < fr(at)) return null;
        const hoje = i <= 2;
        const cor = i === 2 ? AZUL : OURO;
        const op = hoje ? 1 : 1 - 0.55 * foco;
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
              background: hoje ? mix("#141a33", "#1d2547", foco) : C.box,
              border: `2px solid ${hoje ? rgba(cor, 0.35 + 0.5 * foco) : C.boxBorder}`,
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
            <span
              style={{
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: 2,
                color: cor,
              }}
            >
              {tit}
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 25,
                lineHeight: 1.15,
                color: C.ink,
              }}
            >
              {nome}
            </span>
            <span
              style={{
                marginTop: "auto",
                fontWeight: 600,
                fontSize: 21,
                color: C.dim,
              }}
            >
              {arts}
            </span>
            {i === 2 && (
              // só o começo do Título II entra hoje
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: MW * 0.42,
                  height: "100%",
                  background: rgba(AZUL, 0.16 * foco),
                  borderRight: `2px dashed ${rgba(AZUL, 0.7 * foco)}`,
                }}
              />
            )}
          </div>
        );
      })}
      {/* chave "episódio 1" embaixo dos blocos de hoje */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", left: 0, top: 0, opacity: chave }}
      >
        <path
          d={`M${x0},${MY + MH + 22} v18 H${x1} v-18 M${(x0 + x1) / 2},${MY + MH + 40} v18`}
          fill="none"
          stroke={OURO}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - chave)}
        />
      </svg>
      <Texto
        at={6.5}
        x={(x0 + x1) / 2 - 300}
        w={600}
        y={MY + MH + 76}
        size={32}
        cor={OURO}
        weight={800}
      >
        EPISÓDIO 1 · Arts. 1º ao 4º
      </Texto>
      <Chip at={9.18} x={mapaX(1) + MW / 2} y={MY - 40} cor={OURO} size={28}>
        O que é saúde?
      </Chip>
      <Chip
        at={10.48}
        x={mapaX(2) + MW / 2 + 40}
        y={MY - 40}
        cor={AZUL}
        size={28}
      >
        O que é o SUS?
      </Chip>
    </>
  );
};

const Abertura: React.FC = () => (
  <>
    <Fase de={0} ate={5.0}>
      <Texto at={0} y={300} size={34} cor={C.dim} weight={700}>
        LEGISLAÇÃO DO SUS PARA CONCURSOS
      </Texto>
      <Texto at={0.3} y={360} size={150} font={SERIF} weight={600} cor={OURO}>
        Lei 8.080/1990
      </Texto>
      <Texto at={2.3} y={560} size={44} cor={C.ink} weight={500} font={SERIF}>
        Lei Orgânica da Saúde
      </Texto>
    </Fase>
    <Fase de={5.06} ate={12.6}>
      <Mapa />
    </Fase>
    <Fase de={12.64} ate={19.3}>
      <Cabeca at={12.64} titulo="Como vai ser a aula" />
      <Linha at={12.74} x={290} y={420} w={420} icone="📜">
        Lei seca
      </Linha>
      <Linha at={13.66} x={750} y={420} w={420} icone="💡">
        Explicação
      </Linha>
      <Linha at={16.22} x={1210} y={420} w={420} icone="✍️">
        Questões
      </Linha>
      <Texto at={17.84} y={640} size={40} cor={C.dim}>
        <span style={{ fontFamily: EMOJI }}>✏️</span> Pega papel e caneta
      </Texto>
    </Fase>
  </>
);

const Marco: React.FC<{
  at: number;
  x: number;
  ano: string;
  nome: string;
  cor: string;
  children?: React.ReactNode;
}> = ({ at, x, ano, nome, cor, children }) => {
  const k = useK(at, 16, SNAP);
  const f = useCurrentFrame();
  if (f < fr(at)) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 22,
          top: 498,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: cor,
          boxShadow: `0 0 30px ${cor}`,
          transform: `scale(${k})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 260,
          top: 360,
          width: 520,
          textAlign: "center",
          opacity: k,
          fontFamily: SANS,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 52, color: cor }}>{ano}</div>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 38,
            color: C.ink,
          }}
        >
          {nome}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: x - 250,
          top: 580,
          width: 500,
          opacity: k,
          transform: `translateY(${(1 - k) * 30}px)`,
        }}
      >
        {children}
      </div>
    </>
  );
};

const QueLei: React.FC = () => {
  const f = useCurrentFrame();
  const linha = it(f, fr(19.4), fr(21.0), 0, 1, OUT);
  return (
    <Fase de={19.3} ate={54.4}>
      <Cabeca at={19.38} titulo="Que lei é essa?" />
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 518,
          width: 1400 * linha,
          height: 4,
          background: `linear-gradient(90deg, ${AZUL}, ${OURO}, ${VERDE})`,
          borderRadius: 2,
          opacity: 0.6,
        }}
      />
      <Marco
        at={29.62}
        x={420}
        ano="1988"
        nome="Constituição Federal"
        cor={AZUL}
      >
        <Box
          at={33.3}
          x={0}
          y={0}
          w={500}
          borda={rgba(AZUL, 0.6)}
          style={{
            position: "relative",
            padding: "22px 26px",
            fontSize: 30,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Saúde é <span style={{ color: AZUL }}>direito de todos</span> e{" "}
          <span style={{ color: AZUL }}>dever do Estado</span>
        </Box>
      </Marco>
      <Marco at={21.0} x={960} ano="19/09/1990" nome="Lei 8.080" cor={OURO}>
        <Chip at={26.4} x={250} y={40} size={30}>
          Lei Orgânica da Saúde
        </Chip>
        <Chip at={37.62} x={250} y={130} size={28} cor={VERDE}>
          promoção
        </Chip>
        <Chip at={38.58} x={250} y={205} size={28} cor={VERDE}>
          proteção
        </Chip>
        <Chip at={39.62} x={250} y={280} size={28} cor={VERDE}>
          recuperação
        </Chip>
      </Marco>
      <Marco at={46.3} x={1500} ano="1990" nome="Lei 8.142" cor={"#c084fc"}>
        <Chip at={49.06} x={250} y={40} size={28} cor={"#c084fc"}>
          participação da comunidade
        </Chip>
        <Chip at={51.02} x={250} y={120} size={28} cor={"#c084fc"}>
          recursos financeiros
        </Chip>
        <Texto at={52.68} x={0} y={180} w={500} size={26} cor={C.dim}>
          (fica para outro vídeo)
        </Texto>
      </Marco>
    </Fase>
  );
};

const Art1: React.FC = () => (
  <>
    <Fase de={54.4} ate={71.2}>
      <Cabeca at={54.46} titulo="Art. 1º" sub="o alcance da lei" />
      <LeiSeca at={55.68} size={40}>
        Art. 1º Esta Lei regula, em <G at={59.6}>todo o território nacional</G>,
        as ações e serviços de saúde, executados{" "}
        <G at={63.34}>isolada ou conjuntamente</G>, em caráter{" "}
        <G at={65.5}>permanente ou eventual</G>, por pessoas{" "}
        <G at={67.88}>naturais ou jurídicas</G> de direito{" "}
        <G at={69.5}>Público ou privado</G>.
      </LeiSeca>
      <Linha at={59.6} y={240} icone="🗺️">
        todo o território nacional
      </Linha>
      <Linha at={63.34} y={380} icone="🧩">
        sozinha ou em conjunto
      </Linha>
      <Linha at={65.5} y={520} icone="⏳">
        permanente ou eventual
      </Linha>
      <Linha at={67.58} y={660} icone="👤">
        pessoa física ou jurídica
      </Linha>
      <Linha at={69.5} y={800} icone="🏥" cor={AZUL}>
        pública <b style={{ color: AZUL }}>ou privada</b>
      </Linha>
    </Fase>
    <Fase de={71.3} ate={80.4}>
      <Pegadinha
        at={71.3}
        frase="A Lei 8.080 regula só os serviços prestados pelo poder público."
        errado={76.84}
        correcao="Também regula os serviços privados."
        corrAt={77.74}
      />
    </Fase>
  </>
);

const Art2: React.FC = () => (
  <>
    <Fase de={80.4} ate={110.7}>
      <Cabeca at={80.46} titulo="Art. 2º" sub="saúde é direito fundamental" />
      <LeiSeca at={81.98} size={31} y={220}>
        Art. 2º A saúde é um <G at={84.18}>direito fundamental do ser humano</G>
        , devendo o <G at={86.58}>Estado</G> prover as condições indispensáveis
        ao seu pleno exercício.
        <div style={{ height: 14 }} />
        <G at={90.5} cor={AZUL}>
          § 1º
        </G>{" "}
        O dever do Estado de garantir a saúde consiste na formulação e execução
        de <G at={94.58}>políticas econômicas e sociais</G> que visem à{" "}
        <G at={100.02}>redução de riscos</G> de doenças e de outros agravos e no
        estabelecimento de condições que assegurem{" "}
        <G at={103.56}>acesso universal e igualitário</G> às ações e aos
        serviços para a sua{" "}
        <G at={107.94} cor={VERDE}>
          promoção
        </G>
        ,{" "}
        <G at={109.06} cor={VERDE}>
          proteção
        </G>{" "}
        e{" "}
        <G at={109.98} cor={VERDE}>
          recuperação
        </G>
        .
      </LeiSeca>
      <Linha at={94.58} y={230} icone="📈">
        políticas econômicas e sociais
      </Linha>
      <Linha at={97.64} y={350} icone="🏥" cor={VERM}>
        não só hospital e remédio
      </Linha>
      <Linha at={100.02} y={470} icone="🛡️">
        reduzir riscos de doenças
      </Linha>
      <Linha at={103.56} y={590} icone="🤝">
        acesso universal e igualitário
      </Linha>
      <Texto
        at={106.22}
        x={1190}
        y={740}
        w={630}
        size={28}
        cor={C.dim}
        weight={700}
      >
        GRAVE AS 3 PALAVRAS
      </Texto>
      <Chip at={107.94} x={1300} y={830} size={28} cor={VERDE}>
        promoção
      </Chip>
      <Chip at={109.06} x={1505} y={830} size={28} cor={VERDE}>
        proteção
      </Chip>
      <Chip at={109.98} x={1505} y={920} size={28} cor={VERDE}>
        recuperação
      </Chip>
    </Fase>
    <Fase de={110.78} ate={122.4}>
      <Cabeca
        at={110.78}
        titulo="Art. 2º, § 2º"
        sub="o queridinho das bancas"
      />
      <LeiSeca at={110.9} size={44} y={290} w={900}>
        § 2º O dever do Estado{" "}
        <G at={115.3} cor={VERM}>
          não exclui
        </G>{" "}
        o das pessoas, da família, das empresas e da sociedade.
      </LeiSeca>
      <Emo at={116.44} x={1260} y={360} size={110}>
        🧑
      </Emo>
      <Texto at={116.44} x={1110} y={440} w={300} size={30}>
        pessoas
      </Texto>
      <Emo at={117.4} x={1600} y={360} size={110}>
        👨‍👩‍👧
      </Emo>
      <Texto at={117.4} x={1450} y={440} w={300} size={30}>
        família
      </Texto>
      <Emo at={118.24} x={1260} y={620} size={110}>
        🏢
      </Emo>
      <Texto at={118.24} x={1110} y={700} w={300} size={30}>
        empresas
      </Texto>
      <Emo at={119.18} x={1600} y={620} size={110}>
        🌎
      </Emo>
      <Texto at={119.18} x={1450} y={700} w={300} size={30}>
        sociedade
      </Texto>
      <Texto
        at={120.22}
        x={1080}
        y={840}
        w={700}
        size={40}
        cor={OURO}
        font={SERIF}
      >
        Todo mundo tem responsabilidade.
      </Texto>
    </Fase>
    <Fase de={122.56} ate={128.2}>
      <Pegadinha
        at={122.56}
        frase="O dever de garantir a saúde é exclusivo do Estado."
        errado={127.16}
      />
    </Fase>
  </>
);

const DETERMINANTES: [number, string, string][] = [
  [143.0, "🍎", "alimentação"],
  [144.0, "🏠", "moradia"],
  [144.84, "🚰", "saneamento básico"],
  [146.22, "🌳", "meio ambiente"],
  [147.26, "💼", "trabalho"],
  [148.04, "💰", "renda"],
  [148.74, "📚", "educação"],
  [149.68, "🏃", "atividade física"],
  [151.02, "🚌", "transporte"],
  [151.96, "🎡", "lazer"],
  [152.78, "🛒", "bens e serviços essenciais"],
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

const Art3: React.FC = () => (
  <>
    <Fase de={128.2} ate={138.7}>
      <Cabeca
        at={128.26}
        titulo="Art. 3º"
        sub="determinantes e condicionantes"
      />
      <LeiSeca at={129.78} size={36} y={240}>
        Art. 3º Os níveis de saúde expressam a{" "}
        <G at={136.48}>organização social e econômica</G> do País, tendo a saúde
        como determinantes e condicionantes, <G at={159.88}>entre outros</G>, a
        alimentação, a moradia, o saneamento básico, o meio ambiente, o
        trabalho, a renda, a educação, a atividade física, o transporte, o lazer
        e o acesso aos bens e serviços essenciais.
      </LeiSeca>
      <Linha at={131.34} y={300} icone="🩺" cor={AZUL}>
        saúde não é só ausência de doença
      </Linha>
      <Linha at={136.48} y={460} icone="🏙️">
        reflete a organização social e econômica do país
      </Linha>
    </Fase>
    <Fase de={138.78} ate={155.4}>
      <Cabeca at={138.78} titulo="Art. 3º" sub="o que determina a saúde" />
      {DETERMINANTES.map(([at, ic, nome], i) => {
        const row = i < 6 ? 0 : 1;
        const col = row === 0 ? i : i - 6;
        const x = row === 0 ? 120 + col * 285 : 262 + col * 285;
        return (
          <Tile
            key={i}
            at={at}
            x={x}
            y={row === 0 ? 300 : 540}
            icone={ic}
            nome={nome}
            cor={nome === "atividade física" ? VERDE : OURO}
          />
        );
      })}
      <Texto at={152.78} y={800} size={34} cor={C.dim}>
        + “entre outros”
      </Texto>
    </Fase>
    <Fase de={155.52} ate={174.6}>
      <Cabeca at={155.52} titulo="Atenção a 2 detalhes" />
      <Box
        at={157.52}
        x={120}
        y={290}
        w={800}
        h={520}
        borda={rgba(OURO, 0.6)}
        style={{ padding: "40px 46px" }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 3,
            color: OURO,
          }}
        >
          DETALHE 1
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 52,
            marginTop: 24,
            lineHeight: 1.2,
          }}
        >
          A lista termina com{" "}
          <span style={{ color: OURO }}>“entre outros”</span>
        </div>
        <Texto
          at={161.8}
          x={46}
          y={300}
          w={710}
          size={40}
          align="left"
          cor={VERDE}
          weight={800}
        >
          → rol EXEMPLIFICATIVO
        </Texto>
        <Texto
          at={163.56}
          x={46}
          y={370}
          w={710}
          size={36}
          align="left"
          cor={VERM}
          weight={700}
        >
          ✗ não é taxativo
        </Texto>
      </Box>
      <Box
        at={164.5}
        x={1000}
        y={290}
        w={800}
        h={520}
        borda={rgba(VERDE, 0.6)}
        style={{ padding: "40px 46px" }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 3,
            color: VERDE,
          }}
        >
          DETALHE 2
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 52,
            marginTop: 24,
            lineHeight: 1.2,
          }}
        >
          <span style={{ fontFamily: EMOJI }}>🏃</span> Atividade física entrou
          em <span style={{ color: VERDE }}>2013</span>
        </div>
        <Texto
          at={167.66}
          x={46}
          y={300}
          w={710}
          size={36}
          align="left"
          cor={C.dim}
        >
          pela Lei 12.864/2013
        </Texto>
        <Texto
          at={172.94}
          x={46}
          y={370}
          w={710}
          size={38}
          align="left"
          cor={OURO}
          weight={800}
        >
          prova nova cobra!
        </Texto>
      </Box>
    </Fase>
    <Fase de={174.72} ate={184.5}>
      <Cabeca
        at={174.72}
        titulo="Macete"
        sub="para lembrar dos determinantes"
      />
      {(
        [
          [177.86, "🏠", "casa"],
          [178.58, "🍽️", "comida"],
          [179.28, "🎓", "escola"],
          [180.12, "💼", "emprego"],
          [180.84, "🎡", "lazer"],
          [181.6, "🌳", "ambiente limpo"],
        ] as [number, string, string][]
      ).map(([at, ic, nome], i) => (
        <Tile
          key={i}
          at={at}
          x={120 + i * 285}
          y={400}
          icone={ic}
          nome={nome}
          cor={VERDE}
        />
      ))}
      <Texto at={182.9} y={680} size={44} font={SERIF} cor={OURO}>
        Está quase tudo ali.
      </Texto>
    </Fase>
    <Fase de={184.58} ate={194.4}>
      <Cabeca at={184.58} titulo="Art. 3º, parágrafo único" />
      <LeiSeca at={184.7} size={40} y={260}>
        Parágrafo único. Dizem respeito também à saúde as ações que [...] se
        destinam a garantir às pessoas e à coletividade condições de{" "}
        <G at={191.18}>bem-estar físico, mental e social</G>.
      </LeiSeca>
      <Chip at={192.04} x={1500} y={330} cor={AZUL}>
        físico
      </Chip>
      <Chip at={192.94} x={1500} y={470} cor={"#c084fc"}>
        mental
      </Chip>
      <Chip at={193.68} x={1500} y={610} cor={VERDE}>
        social
      </Chip>
    </Fase>
  </>
);

// círculo do SUS
const Sus: React.FC<{ at: number; x: number; y: number; r: number }> = ({
  at,
  x,
  y,
  r,
}) => {
  const k = useK(at, 18, SNAP);
  const f = useCurrentFrame();
  if (f < fr(at)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: r,
        border: `4px solid ${AZUL}`,
        background: rgba(AZUL, 0.08),
        boxShadow: `0 0 60px ${rgba(AZUL, 0.3)}, inset 0 0 60px ${rgba(AZUL, 0.12)}`,
        transform: `scale(${k})`,
        opacity: Math.min(1, k * 1.3),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 26,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 54,
          color: AZUL,
          letterSpacing: 6,
        }}
      >
        SUS
      </div>
    </div>
  );
};

const Art4: React.FC = () => {
  const f = useCurrentFrame();
  const seta = it(f, fr(231.36), fr(231.36) + 20, 0, 1, OUT);
  return (
    <>
      <Fase de={194.5} ate={213.2}>
        <Cabeca at={194.54} titulo="Art. 4º" sub="o que é o SUS" cor={AZUL} />
        <LeiSeca at={196.6} size={37}>
          Art. 4º O{" "}
          <G at={199.22} cor={AZUL}>
            conjunto de ações e serviços de saúde
          </G>
          , prestados por órgãos e instituições{" "}
          <G at={203.52} cor={AZUL}>
            públicas federais, estaduais e municipais
          </G>
          , da{" "}
          <G at={208.26} cor={AZUL}>
            Administração direta e indireta
          </G>{" "}
          e das{" "}
          <G at={210.84} cor={AZUL}>
            fundações mantidas pelo Poder Público
          </G>
          , constitui o Sistema Único de Saúde - SUS.
        </LeiSeca>
        <Sus at={198.52} x={1500} y={500} r={250} />
        <Chip at={205.62} x={1500} y={430} size={30} cor={AZUL}>
          Federal
        </Chip>
        <Chip at={206.42} x={1500} y={515} size={30} cor={AZUL}>
          Estadual
        </Chip>
        <Chip at={207.16} x={1500} y={600} size={30} cor={AZUL}>
          Municipal
        </Chip>
        <Chip at={208.82} x={1300} y={830} size={26} cor={OURO}>
          adm. direta
        </Chip>
        <Chip at={209.76} x={1560} y={830} size={26} cor={OURO}>
          adm. indireta
        </Chip>
        <Chip at={210.84} x={1440} y={910} size={26} cor={OURO}>
          fundações públicas
        </Chip>
      </Fase>
      <Fase de={213.26} ate={226.3}>
        <Cabeca
          at={213.26}
          titulo="Art. 4º, § 1º"
          sub="também fazem parte do SUS"
          cor={AZUL}
        />
        <LeiSeca at={213.4} size={36} y={250} w={980}>
          § 1º Estão incluídas no disposto neste artigo as instituições públicas
          federais, estaduais e municipais de{" "}
          <G at={216.88} cor={AZUL}>
            controle de qualidade
          </G>
          ,{" "}
          <G at={218.46} cor={AZUL}>
            pesquisa
          </G>{" "}
          e{" "}
          <G at={219.44} cor={AZUL}>
            produção de insumos, medicamentos
          </G>
          , inclusive de{" "}
          <G at={222.78} cor={VERM}>
            sangue e hemoderivados
          </G>
          , e de{" "}
          <G at={224.86} cor={AZUL}>
            equipamentos para saúde
          </G>
          .
        </LeiSeca>
        <Linha
          at={216.88}
          x={1170}
          w={650}
          y={230}
          icone="🔬"
          cor={AZUL}
          size={30}
        >
          controle de qualidade
        </Linha>
        <Linha
          at={218.46}
          x={1170}
          w={650}
          y={345}
          icone="📊"
          cor={AZUL}
          size={30}
        >
          pesquisa
        </Linha>
        <Linha
          at={219.44}
          x={1170}
          w={650}
          y={460}
          icone="🏭"
          cor={AZUL}
          size={30}
        >
          produção de insumos
        </Linha>
        <Linha
          at={221.1}
          x={1170}
          w={650}
          y={575}
          icone="💊"
          cor={AZUL}
          size={30}
        >
          medicamentos
        </Linha>
        <Linha
          at={222.78}
          x={1170}
          w={650}
          y={690}
          icone="🩸"
          cor={VERM}
          size={30}
        >
          sangue e hemoderivados
        </Linha>
        <Linha
          at={224.86}
          x={1170}
          w={650}
          y={805}
          icone="🩺"
          cor={AZUL}
          size={30}
        >
          equipamentos para saúde
        </Linha>
      </Fase>
      <Fase de={226.44} ate={237.2}>
        <Cabeca
          at={226.44}
          titulo="Art. 4º, § 2º"
          sub="e a iniciativa privada?"
          cor={AZUL}
        />
        <LeiSeca at={226.56} size={42} y={230} x={160} w={1600}>
          § 2º A iniciativa privada <G at={229.04}>poderá</G> participar do
          Sistema Único de Saúde - SUS, em caráter{" "}
          <G at={231.36} cor={VERDE}>
            complementar
          </G>
          .
        </LeiSeca>
        <Sus at={226.6} x={620} y={690} r={200} />
        <Texto at={226.6} x={420} y={700} w={400} size={28} cor={C.dim}>
          rede pública
        </Texto>
        <Box
          at={227.96}
          x={1240}
          y={590}
          w={460}
          h={200}
          borda={rgba(OURO, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 64 }}>🏨</span>
          <span style={{ fontWeight: 700, fontSize: 34 }}>
            iniciativa privada
          </span>
        </Box>
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <line
            x1={1240}
            y1={690}
            x2={1240 - (1240 - 830) * seta}
            y2={690}
            stroke={VERDE}
            strokeWidth={6}
            strokeDasharray="18 12"
          />
          {seta > 0.95 && (
            <polygon points="830,690 862,672 862,708" fill={VERDE} />
          )}
        </svg>
        <Texto
          at={231.36}
          x={830}
          y={610}
          w={410}
          size={34}
          cor={VERDE}
          weight={800}
        >
          complementar
        </Texto>
        <Texto at={233.54} y={930} size={38}>
          entra quando o público{" "}
          <span style={{ color: OURO }}>não dá conta</span> —{" "}
          <span style={{ color: VERM }}>não no lugar dele</span>
        </Texto>
      </Fase>
      <Fase de={237.32} ate={252.6}>
        <Cabeca at={237.32} titulo="Duas pegadinhas" cor={VERM} />
        <Pegadinha
          at={238.82}
          x={110}
          y={280}
          w={820}
          size={42}
          frase="A iniciativa privada participa do SUS em caráter substitutivo."
          errado={243.36}
          correcao="é complementar"
          corrAt={243.92}
        />
        <Pegadinha
          at={245.48}
          x={990}
          y={280}
          w={820}
          size={42}
          frase="A iniciativa privada deverá participar do SUS."
          errado={250.16}
          correcao="a lei diz “poderá”"
          corrAt={250.92}
        />
      </Fase>
    </>
  );
};

// ---------- questões ----------
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
                  color: certaK ? "#052e16" : OURO,
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
    <Fase de={252.7} ate={260.3}>
      <Texto
        at={252.74}
        y={300}
        size={120}
        font={SERIF}
        weight={600}
        cor={OURO}
      >
        Questões
      </Texto>
      <Texto at={253.72} y={470} size={46}>
        Agora é a sua vez <span style={{ fontFamily: EMOJI }}>✍️</span>
      </Texto>
      <Chip at={255.68} x={560} y={680} size={34}>
        1. leia a questão
      </Chip>
      <Chip at={256.74} x={960} y={680} size={34} cor={AZUL}>
        2. pause
      </Chip>
      <Chip at={257.82} x={1340} y={680} size={34} cor={VERDE}>
        3. responda
      </Chip>
      <Texto at={258.58} y={800} size={34} cor={C.dim}>
        depois eu dou o gabarito
      </Texto>
    </Fase>
    <Questao
      de={260.36}
      ate={279.6}
      n={1}
      ce
      pausa={0}
      gabAt={273.03}
      ok={false}
      enunciado="De acordo com a Lei 8.080/1990, o dever do Estado de garantir a saúde exclui o das pessoas, da família, das empresas e da sociedade."
      explicacao="Art. 2º, § 2º: o dever do Estado NÃO exclui o dos demais."
      explAt={273.96}
    />
    <Questao
      de={279.64}
      ate={294.9}
      n={2}
      ce
      pausa={1}
      gabAt={290.9}
      ok
      enunciado="A atividade física é citada expressamente na Lei 8.080/1990 como determinante e condicionante da saúde."
      explicacao="Art. 3º — incluída pela Lei 12.864/2013."
      explAt={291.84}
    />
    <Questao
      de={294.94}
      ate={311.6}
      n={3}
      ce
      pausa={2}
      gabAt={305.95}
      ok={false}
      enunciado="O art. 3º da Lei 8.080/1990 traz uma lista taxativa dos determinantes e condicionantes da saúde."
      explicacao="A lista é exemplificativa: a lei usa “entre outros”."
      explAt={306.82}
    />
    <Questao
      de={311.7}
      ate={332.0}
      n={4}
      pausa={3}
      gabAt={327.74}
      certa="B"
      enunciado="Segundo a Lei 8.080/1990, a iniciativa privada poderá participar do SUS em caráter:"
      opcoes={[
        ["A", "substitutivo", 318.68],
        ["B", "complementar", 320.38],
        ["C", "obrigatório", 322.02],
        ["D", "exclusivo", 323.66],
        ["E", "prioritário", 325.26],
      ]}
      explicacao="✓ Letra B — Art. 4º, § 2º"
      explAt={329.76}
    />
    <Questao
      de={332.1}
      ate={368.1}
      n={5}
      pausa={4}
      gabAt={358.99}
      certa="E"
      enunciado="Qual destas opções NÃO faz parte do SUS, segundo o art. 4º da Lei 8.080/1990?"
      opcoes={[
        ["A", "instituição pública municipal que produz medicamentos", 337.52],
        ["B", "fundação mantida pelo Poder Público", 341.66],
        ["C", "órgão da administração indireta de um estado", 345.22],
        ["D", "instituição pública federal que produz hemoderivados", 349.02],
        ["E", "hospital privado sem contrato ou convênio com o SUS", 353.44],
      ]}
      explicacao="✓ Letra E — o setor privado só participa de forma complementar, por contrato ou convênio."
      explAt={359.82}
    />
  </>
);

const RESUMO: [number, string][] = [
  [370.38, "A lei vale para ações de saúde públicas e privadas."],
  [
    374.66,
    "O dever do Estado não exclui o das pessoas, família, empresas e sociedade.",
  ],
  [
    383.4,
    "Determinantes: lista exemplificativa — atividade física desde 2013.",
  ],
  [390.66, "SUS = instituições públicas das três esferas."],
  [395.5, "Iniciativa privada: só em caráter complementar."],
];

const Resumo: React.FC = () => (
  <>
    <Fase de={368.2} ate={400.8}>
      <Cabeca at={368.24} titulo="Resumo" sub="em 30 segundos" />
      {RESUMO.map(([at, txt], i) => (
        <Box
          key={i}
          at={at}
          x={160}
          y={240 + i * 150}
          w={1600}
          h={124}
          borda={rgba(OURO, 0.4)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "0 40px",
          }}
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
              color: "#1a1405",
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
    <Fase de={400.92} ate={408.3}>
      <Texto at={400.92} y={300} size={36} cor={C.dim} weight={700}>
        NO PRÓXIMO EPISÓDIO
      </Texto>
      <Texto at={401.46} y={370} size={90} font={SERIF} weight={600} cor={OURO}>
        Arts. 5º e 6º
      </Texto>
      <Texto at={402.58} y={510} size={46}>
        Objetivos e campo de atuação do SUS
      </Texto>
      <Chip at={406.14} x={720} y={700} cor={AZUL}>
        vigilância sanitária
      </Chip>
      <Chip at={407.1} x={1220} y={700} cor={VERDE}>
        vigilância epidemiológica
      </Chip>
    </Fase>
  </>
);

const Final: React.FC = () => (
  <>
    <Fase de={408.42} ate={411.8 + 0.6}>
      <Box
        at={408.42}
        x={460}
        y={330}
        w={1000}
        h={380}
        borda={rgba(OURO, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          textAlign: "center",
          boxShadow: `0 0 40px ${rgba(OURO, 0.25)}`,
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 90 }}>⚖️</span>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84 }}>
          Me siga
        </span>
        <span style={{ fontWeight: 700, fontSize: 40, color: OURO }}>
          para mais dicas sobre leis
        </span>
      </Box>
    </Fase>
    <Sequence from={FIM_FALA + 12}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <BonsEstudos />
      </AbsoluteFill>
    </Sequence>
  </>
);

const BonsEstudos: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, 0, 18, 0, 1, OUT);
  const k2 = it(f, 14, 32, 0, 1, OUT);
  return (
    <>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 130,
          color: OURO,
          opacity: k,
          transform: `translateY(${(1 - k) * 40}px)`,
          filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
          textShadow: `0 0 40px ${rgba(OURO, 0.4)}`,
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

// câmera: aproxima no trecho grifado e volta [segundos, quanto tempo fica perto, x, y do ponto]
const ZOOMS: [number, number, number, number][] = [
  [69.5, 1.6, 520, 600], // "Público ou privado"
  [84.18, 2.0, 360, 330], // "direito fundamental do ser humano"
  [115.3, 1.2, 700, 400], // "não exclui"
  [231.36, 1.8, 900, 406], // "complementar"
];
// ---------- efeitos sonoros ----------
const SFX: [number, string, number][] = [
  ...[19.3, 54.4, 80.4, 128.2, 194.5, 252.7, 368.2, 408.3].map(
    (s) => [fr(s), "whoosh", 0.28] as [number, string, number],
  ),
  ...[71.3, 122.56, 237.32].map(
    (s) => [fr(s), "plim", 0.22] as [number, string, number],
  ),
  // carimbo: trava + pop juntos para dar peso à batida
  ...[76.84, 127.16, 243.36, 250.16, 273.03, 305.95].flatMap((s) => [
    [fr(s), "trava", 0.5] as [number, string, number],
    [fr(s), "pop", 0.35] as [number, string, number],
  ]),
  ...MAPA.map(
    (_, i) => [fr(5.2 + i * 0.12), "pop", 0.1] as [number, string, number],
  ),
  ...ZOOMS.map(([s]) => [fr(s), "whoosh", 0.12] as [number, string, number]),
  ...[290.9, 327.74, 358.99].map(
    (s) => [fr(s), "plim", 0.3] as [number, string, number],
  ),
  ...DETERMINANTES.map(
    ([s]) => [fr(s), "pop", 0.18] as [number, string, number],
  ),
  ...CORTES.flatMap((_, i) =>
    [0, 1, 2, 3, 4].map(
      (j) =>
        [inicioPausa(i) + j * FPS, "bip", 0.16] as [number, string, number],
    ),
  ),
];

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
const CARIMBOS = [76.84, 127.16, 243.36, 250.16, 273.03, 305.95];
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

export const VideoLei8080: React.FC = () => {
  const f = useCurrentFrame();
  const cor = f >= fr(194.5) && f < fr(252.7) ? AZUL : OURO;
  const cam = camera(f);
  const [dx, dy] = tremida(f);
  return (
    <AbsoluteFill>
      <Fundo
        cor={cor}
        pulsos={[
          76.84, 127.16, 243.36, 250.16, 273.03, 290.9, 305.95, 327.74, 358.99,
        ].map(fr)}
      />
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px,${dy}px) scale(${cam.s})`,
          transformOrigin: `${cam.ox}px ${cam.oy}px`,
        }}
      >
        <Abertura />
        <QueLei />
        <Art1 />
        <Art2 />
        <Art3 />
        <Art4 />
        <Questoes />
        <Resumo />
        <Final />
      </AbsoluteFill>
      <div style={{ opacity: 1 - cam.z }}>
        <Hud />
      </div>
      <Grao />
      <Audio src={staticFile("lei8080/narracao.mp3")} />
      <Audio
        src={staticFile("lei8080/musica.wav")}
        volume={(x) => 0.07 * (1 - P(x, DURATION - 60, DURATION))}
      />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
