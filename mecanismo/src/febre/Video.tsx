import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OUT, P, SNAP, it } from "../lib";
import { EMOJI } from "../aas/ui";
import { JORNAL, MAO, SANS } from "../fonts";
import { Kicker, Marca, Nota, Traco, V } from "../sarampo/Vox";
import falaJson from "./fala.json";

// "Por que a gente sente frio quando está com febre?" no estilo Vox (peças de papel do sarampo/Vox.tsx),
// com o gráfico do termostato, partículas do sistema de defesa, o mostrador do termostato e o tremor de calor.
// Fundo escuro (quadro escuro com recortes de papel claro), a pedido da usuária.
// Roteiro e fontes: roteiros/frio_na_febre.md. Narração feita pela usuária (OpenArt); tempos em fala.json.
type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  tremendo: Tw("tremendo"),
  pelando: Tw("pelando"),
  cerebro: Tw("cérebro"),
  hipotalamo: Tw("hipotálamo"),
  termostato: Tw("termostato"),
  temperatura: Tw("temperatura"),
  infeccao: Tw("infecção"),
  substancias: Tw("substâncias"),
  hipotalamo2: Tw("hipotálamo", 2),
  prosta: Tw("prostaglandina"),
  sobe: Tw("sobe"),
  ainda: Tw("ainda"),
  frio: Tw("frio", 2),
  aperta: Tw("aperta"),
  gelada: Tw("gelada"),
  tremerem: Tw("tremerem"),
  calafrio: Tw("calafrio"),
  cobertor: Tw("cobertor"),
  valor: Tw("valor"),
  passa: Tw("passa"),
  antitermico: Tw("antitérmico"),
  paracetamol: Tw("paracetamol"),
  dipirona: Tw("dipirona"),
  ibuprofeno: Tw("ibuprofeno"),
  diminui: Tw("diminui"),
  baixo: Tw("baixo"),
  calor: Tw("calor"),
  abrem: Tw("abrem"),
  suar: Tw("suar"),
  embora: Tw("embora"),
  procure: Tw("procure"),
  bebe: Tw("bebê"),
  baixar: Tw("baixar"),
  manchas: Tw("manchas"),
  nuca: Tw("nuca"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_FEBRE = T.final + 90;
// [início, fim] de cada cena
const PARTES: [number, number][] = [
  [0, Tw("lá") - 6],
  [Tw("lá") - 6, Tw("quando") - 6],
  [Tw("quando") - 6, Tw("só") - 6],
  [Tw("só") - 6, Tw("mas", 2) - 6],
  [Tw("mas", 2) - 6, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_FEBRE],
];
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.tremendo, "pop", 0.18],
  [PARTES[1][0], "whoosh", 0.25],
  [T.termostato, "bip", 0.2],
  [PARTES[2][0], "whoosh", 0.25],
  [T.prosta, "plim", 0.22],
  [T.sobe, "trava", 0.28],
  [PARTES[3][0], "whoosh", 0.25],
  [T.gelada, "pop", 0.18],
  [T.calafrio, "pop", 0.18],
  [T.antitermico, "plim", 0.22],
  [T.baixo, "trava", 0.28],
  [T.suar, "pop", 0.18],
  [PARTES[4][0], "whoosh", 0.25],
  [T.bebe, "bip", 0.2],
  [T.manchas, "bip", 0.2],
  [T.siga, "whoosh", 0.25],
  [T.final - 4, "final", 0.5],
];

const W = 1080;
// efeitos do SFX Kit (Wyzowl, licença CC0), baixado em public/sfxkit
export const KIT: Record<string, string> = {
  whoosh: "sfxkit/sfx-kit-main/sounds/whooshes/whoosh-medium-soft.wav",
  pop: "sfxkit/sfx-kit-main/sounds/pops/pop-medium-in.wav",
  plim: "sfxkit/sfx-kit-main/sounds/notifications/notification-attention-clear.wav",
  bip: "sfxkit/sfx-kit-main/sounds/interface/click-tap-medium.wav",
  trava: "sfxkit/sfx-kit-main/sounds/impacts/impact-medium-firm.wav",
  final: "sfxkit/sfx-kit-main/sounds/logo-stings/sting-airy-short.wav",
};
// trilha mais presente (a revisão do Earshot mostrou que em 0,07 ela quase não era ouvida):
// 0,22 nas pausas e 0,09 enquanto a narração fala, com subida e descida suaves
const FALANDO = (() => {
  const v = new Float32Array(DURATION_FEBRE + 1);
  FALA.forEach((p, i) => {
    const fim = i + 1 < FALA.length && FALA[i + 1].f - p.f < 20 ? FALA[i + 1].f : p.f + 12;
    for (let fr = Math.max(0, p.f - 4); fr <= Math.min(DURATION_FEBRE, fim + 6); fr++) v[fr] = 1;
  });
  const suave = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    suave[fr] = acc;
  }
  return suave;
})();
const musica = (fr: number) => 0.22 - 0.13 * (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0);

// ---------- versão de fundo escuro (pedido da usuária): recortes de papel claro sobre um quadro escuro ----------
export const E = {
  fundo: "#111827",
  texto: "#f3efe6",
  azul: "#7aa2ff",
  vermelho: "#ff5a6e",
  verde: "#4ade80",
  cartao: "#1c2638",
  cinza: "#9aa4b5",
};
// recorte de papel escuro (borda rasgada), combinando com o fundo
const rasgo = (seed: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) pts.push(`${(i / 24) * 100}% ${(Math.abs(Math.sin(seed * 7 + i * 3.1)) * 1.6).toFixed(2)}%`);
  for (let i = 24; i >= 0; i--) pts.push(`${(i / 24) * 100}% ${(100 - Math.abs(Math.sin(seed * 5 + i * 2.3)) * 2.4).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
};
export const Recorte: React.FC<{ f: number; at: number; x: number; y: number; w: number; rot?: number; seed?: number; children: React.ReactNode }> = ({
  f,
  at,
  x,
  y,
  w,
  rot = -1.5,
  seed = 1,
  children,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 16, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: Math.min(1, k * 1.6),
        transform: `translateY(${(1 - k) * 90}px) rotate(${rot}deg)`,
        filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.55))",
      }}
    >
      <div style={{ background: E.cartao, border: "1px solid rgba(122,162,255,0.25)", clipPath: rasgo(seed), padding: "44px 40px 50px", boxSizing: "border-box" }}>
        {children}
      </div>
      <div style={{ position: "absolute", top: -18, left: w / 2 - 80, width: 160, height: 46, background: "rgba(122,162,255,0.35)", transform: "rotate(-4deg)" }} />
    </div>
  );
};
export const Manchete: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 54 }) => (
  <div style={{ fontFamily: JORNAL, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: E.texto, marginTop: 14 }}>{children}</div>
);
export const Fundo: React.FC = () => (
  <AbsoluteFill style={{ background: E.fundo }}>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <filter id="papelEscuro">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} />
        <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.78  0 0 0 0 0.85  0 0 0 0.12 0" />
      </filter>
      <rect width={W} height={1920} filter="url(#papelEscuro)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 1100px at 50% 40%, rgba(80,110,200,0.16), rgba(0,0,0,0) 70%)" }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 280px rgba(0,0,0,0.6)" }} />
  </AbsoluteFill>
);
// marca-texto amarelo com letra escura (para ler bem em cima do fundo escuro)
export const MarcaE: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => (
  <Marca f={f} at={at}>
    <span style={{ color: f >= at ? V.tinta : E.texto }}>{children}</span>
  </Marca>
);
export const Capitulo: React.FC<{ f: number; at: number; kicker: string; children: React.ReactNode; top?: number; size?: number }> = ({
  f,
  at,
  kicker,
  children,
  top = 150,
  size = 76,
}) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: 70, width: 940, top, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
      <Kicker cor={E.vermelho}>{kicker}</Kicker>
      <div style={{ fontFamily: JORNAL, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: E.texto, marginTop: 10 }}>{children}</div>
    </div>
  );
};
export const Carimbo: React.FC<{ f: number; at: number; x: number; y: number; texto: string; cor?: string; size?: number; rot?: number }> = ({
  f,
  at,
  x,
  y,
  texto,
  cor = E.vermelho,
  size = 40,
  rot = -9,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${1.6 - 0.6 * k})`,
        opacity: Math.min(1, k * 1.3),
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        color: cor,
        border: `6px solid ${cor}`,
        borderRadius: 10,
        padding: "8px 22px",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        background: "rgba(17,24,39,0.75)",
      }}
    >
      {texto}
    </div>
  );
};
const Cena: React.FC<{ f: number; i: number; children: React.ReactNode }> = ({
  f,
  i,
  children,
}) => {
  const [a, b] = PARTES[i];
  if (f < a || f >= b) return null;
  const p = (f - a) / (b - a);
  const o = Math.min(it(f, a, a + 10, 0, 1, OUT), 1 - P(f, b - 8, b));
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        transform: `scale(${1 + 0.04 * p})`,
        transformOrigin: "540px 820px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- valores da temperatura ao longo do vídeo ----------
// termostato do cérebro (ponto de ajuste) e temperatura do corpo
const termostato = (f: number) =>
  37 +
  2 * it(f, T.sobe, T.sobe + 24, 0, 1, OUT) -
  2 * it(f, T.baixo, T.baixo + 24, 0, 1, OUT);
const corpo = (f: number) =>
  37 +
  2 * it(f, T.aperta - 20, T.valor, 0, 1) -
  2 * it(f, T.baixo + 10, T.embora, 0, 1);

// tremor de calor: distorce levemente o que estiver dentro quando a febre está alta
const Calor: React.FC<{
  f: number;
  forca: number;
  children: React.ReactNode;
}> = ({ f, forca, children }) => (
  <AbsoluteFill
    style={{ filter: forca > 0.02 ? "url(#calorFebre)" : undefined }}
  >
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="calorFebre">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={`0.012 ${0.03 + 0.004 * Math.sin(f / 6)}`}
          numOctaves={2}
          seed={Math.floor(f / 2)}
        />
        <feDisplacementMap in="SourceGraphic" scale={10 * forca} />
      </filter>
    </svg>
    {children}
  </AbsoluteFill>
);

// mostrador do termostato (35 a 41 °C) com ponteiro
const Mostrador: React.FC<{
  f: number;
  x: number;
  y: number;
  r: number;
  valor: number;
  at: number;
}> = ({ f, x, y, r, valor, at }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  const ang = (v: number) => Math.PI * (1 - (v - 35) / 6); // 35 °C à esquerda, 41 °C à direita
  const ponto = (v: number, rr: number) => [
    x + Math.cos(ang(v)) * rr,
    y - Math.sin(ang(v)) * rr,
  ];
  const [nx, ny] = ponto(valor, r * 0.78);
  const quente = valor > 38;
  return (
    <svg
      width={W}
      height={1920}
      style={{ position: "absolute", opacity: Math.min(1, k * 1.5) }}
    >
      <g
        transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * k}) translate(${-x} ${-y})`}
      >
        <path
          d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`}
          fill={E.cartao}
          stroke={E.texto}
          strokeWidth={6}
          filter="drop-shadow(6px 10px 10px rgba(60,40,10,0.3))"
        />
        {/* faixa normal (36–37,5) em verde e febre (38+) em vermelho */}
        {[
          [36, 37.5, E.verde],
          [38, 41, E.vermelho],
        ].map(([a, b, cor], i) => {
          const [ax, ay] = ponto(a as number, r * 0.92);
          const [bx, by] = ponto(b as number, r * 0.92);
          return (
            <path
              key={i}
              d={`M ${ax} ${ay} A ${r * 0.92} ${r * 0.92} 0 0 1 ${bx} ${by}`}
              stroke={cor as string}
              strokeWidth={18}
              fill="none"
              opacity={0.75}
            />
          );
        })}
        {[35, 36, 37, 38, 39, 40, 41].map((v) => {
          const [ax, ay] = ponto(v, r * 0.82);
          const [tx, ty] = ponto(v, r * 0.66);
          return (
            <g key={v}>
              <line
                x1={ax}
                y1={ay}
                x2={ponto(v, r * 0.74)[0]}
                y2={ponto(v, r * 0.74)[1]}
                stroke={E.texto}
                strokeWidth={4}
              />
              <text
                x={tx}
                y={ty + 12}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={800}
                fontSize={34}
                fill={E.cinza}
              >
                {v}
              </text>
            </g>
          );
        })}
        <line
          x1={x}
          y1={y}
          x2={nx}
          y2={ny}
          stroke={quente ? E.vermelho : E.texto}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <circle cx={x} cy={y} r={20} fill={quente ? E.vermelho : E.texto} />
        <text
          x={x}
          y={y + 90}
          textAnchor="middle"
          fontFamily={JORNAL}
          fontWeight={900}
          fontSize={84}
          fill={quente ? E.vermelho : E.texto}
        >
          {valor.toFixed(1).replace(".", ",")} °C
        </text>
      </g>
    </svg>
  );
};

// partículas: vírus/bactérias (vermelhos) cercados por células de defesa (brancas) que soltam mensageiros até o cérebro
const Defesa: React.FC<{ f: number }> = ({ f }) => {
  const a = PARTES[2][0];
  const cx = 540,
    cy = 1180;
  const virus = Array.from({ length: 12 }, (_, i) => {
    const ang = (i / 12) * Math.PI * 2 + i;
    const rr = 70 + (i % 4) * 34;
    return [
      cx + Math.cos(ang) * rr + Math.sin(f / 20 + i) * 8,
      cy + Math.sin(ang) * rr * 0.8 + Math.cos(f / 17 + i) * 8,
    ];
  });
  const celulas = Array.from({ length: 10 }, (_, i) => {
    const ang = (i / 10) * Math.PI * 2;
    const longe = 420 - 220 * it(f, a + 10, T.substancias, 0, 1, OUT);
    return [
      cx + Math.cos(ang) * longe + Math.sin(f / 13 + i) * 10,
      cy + Math.sin(ang) * longe * 0.75,
    ];
  });
  // mensageiros que sobem até o cérebro (de "substâncias" até "hipotálamo")
  const msgs = Array.from({ length: 14 }, (_, i) => {
    const ini = T.substancias + i * 3;
    const u = it(f, ini, ini + 40, 0, 1);
    const [sx, sy] = celulas[i % 10];
    return {
      x: sx + (540 - sx) * u + Math.sin(u * 9 + i) * 30,
      y: sy + (560 - sy) * u,
      o: u > 0 && u < 1 ? 1 : 0,
    };
  });
  return (
    <>
      {virus.map(([x, y], i) => (
        <span
          key={`v${i}`}
          style={{
            position: "absolute",
            left: x - 34,
            top: y - 34,
            fontFamily: EMOJI,
            fontSize: 64,
          }}
        >
          🦠
        </span>
      ))}
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {celulas.map(([x, y], i) => (
          <g key={`c${i}`}>
            <circle
              cx={x}
              cy={y}
              r={40}
              fill="#ffffff"
              stroke={E.azul}
              strokeWidth={5}
            />
            <circle cx={x + 8} cy={y - 6} r={15} fill={E.azul} opacity={0.5} />
          </g>
        ))}
        {msgs.map((m, i) => (
          <circle
            key={`m${i}`}
            cx={m.x}
            cy={m.y}
            r={13}
            fill={V.amarelo}
            stroke={E.texto}
            strokeWidth={3}
            opacity={m.o}
          />
        ))}
      </svg>
    </>
  );
};

// gráfico: termostato (tracejado) x temperatura do corpo (linha cheia); a diferença vira FRIO ou CALOR
const Grafico: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = PARTES[3];
  const X0 = 110,
    X1 = 990,
    Y0 = 1130,
    Y1 = 560;
  const tx = (fr: number) => X0 + ((fr - a) / (b - a)) * (X1 - X0);
  const ty = (v: number) => Y0 - ((v - 36) / 4) * (Y0 - Y1);
  const fim = Math.min(f, b);
  const pts: [number, number, number][] = [];
  for (let fr = a; fr <= fim; fr += 4)
    pts.push([fr, termostato(fr), corpo(fr)]);
  pts.push([fim, termostato(fim), corpo(fim)]);
  const linha = (j: 1 | 2) =>
    pts.map((p, i) => `${i ? "L" : "M"} ${tx(p[0])} ${ty(p[j])}`).join(" ");
  const area = (cond: (p: [number, number, number]) => boolean) => {
    const sel = pts.filter(cond);
    if (sel.length < 2) return "";
    return (
      sel.map((p, i) => `${i ? "L" : "M"} ${tx(p[0])} ${ty(p[1])}`).join(" ") +
      " " +
      [...sel]
        .reverse()
        .map((p) => `L ${tx(p[0])} ${ty(p[2])}`)
        .join(" ") +
      " Z"
    );
  };
  const sp = termostato(f),
    bt = corpo(f);
  const k = it(f, a, a + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k }}>
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 500,
          width: 986,
          height: 700,
          background: E.cartao,
          boxShadow: "6px 10px 18px rgba(60,40,10,0.3)",
          transform: "rotate(-0.6deg)",
        }}
      />
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {[36, 37, 38, 39, 40].map((v) => (
          <g key={v}>
            <line
              x1={X0}
              x2={X1}
              y1={ty(v)}
              y2={ty(v)}
              stroke="rgba(243,239,230,0.14)"
              strokeWidth={2}
            />
            <text
              x={X0 - 14}
              y={ty(v) + 10}
              textAnchor="end"
              fontFamily={SANS}
              fontWeight={700}
              fontSize={28}
              fill={E.cinza}
            >
              {v}°
            </text>
          </g>
        ))}
        <path
          d={area((p) => p[1] - p[2] > 0.15)}
          fill={E.azul}
          opacity={0.18}
        />
        <path
          d={area((p) => p[2] - p[1] > 0.15)}
          fill={E.vermelho}
          opacity={0.18}
        />
        <path
          d={linha(1)}
          stroke={E.vermelho}
          strokeWidth={7}
          strokeDasharray="18 12"
          fill="none"
        />
        <path
          d={linha(2)}
          stroke={E.azul}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={tx(fim)} cy={ty(bt)} r={14} fill={E.azul} />
      </svg>
      {/* legenda do gráfico */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 520,
          display: "flex",
          gap: 34,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
        }}
      >
        <span style={{ color: E.vermelho }}>- - termostato do cérebro</span>
        <span style={{ color: E.azul }}>— seu corpo</span>
      </div>
      {sp - bt > 0.4 && (
        <div
          style={{
            position: "absolute",
            left: Math.max(140, tx(fim) - 330),
            top: ty((sp + bt) / 2) - 40,
            fontFamily: MAO,
            fontWeight: 700,
            fontSize: 72,
            color: E.azul,
          }}
        >
          FRIO 🥶
        </div>
      )}
      {bt - sp > 0.4 && (
        <div
          style={{
            position: "absolute",
            left: Math.max(140, tx(fim) - 380),
            top: ty((sp + bt) / 2) - 40,
            fontFamily: MAO,
            fontWeight: 700,
            fontSize: 72,
            color: E.vermelho,
          }}
        >
          CALOR 🥵
        </div>
      )}
    </div>
  );
};

// gotas de suor caindo
const Suor: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.suar - 6) return null;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const t = (f - T.suar + 6 + i * 7) % 40;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 140 + i * 95,
              top: 1690 + t * 4,
              fontFamily: EMOJI,
              fontSize: 44,
              opacity: 1 - t / 40,
            }}
          >
            💧
          </span>
        );
      })}
    </>
  );
};

export const Item: React.FC<{
  f: number;
  at: number;
  y: number;
  emoji: string;
  children: React.ReactNode;
}> = ({ f, at, y, emoji, children }) => {
  if (f < at) return null;
  const k = it(f, at - 4, at + 10, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: y,
        width: 900,
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: k,
        transform: `translateX(${(1 - k) * 60}px)`,
      }}
    >
      <span style={{ fontFamily: EMOJI, fontSize: 70 }}>{emoji}</span>
      <span
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 52,
          lineHeight: 1.1,
          color: E.texto,
        }}
      >
        {children}
      </span>
    </div>
  );
};

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Capitulo f={f} at={2} kicker="Curiosidade do corpo" size={90}>
      Por que a febre{" "}
      <MarcaE f={f} at={20}>
        dá frio
      </MarcaE>
      ?
    </Capitulo>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 650,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 260,
        transform: `translateX(${Math.sin(f * 1.7) * (f > T.tremendo ? 6 : 0)}px)`,
      }}
    >
      🥶
    </div>
    <Recorte f={f} at={T.pelando - 10} x={600} y={560} w={380} rot={5} seed={2}>
      <Manchete size={84}>
        <span style={{ color: E.vermelho }}>39 °C</span>
      </Manchete>
    </Recorte>
    <Nota f={f} at={T.tremendo} x={120} y={1060} w={860} size={68} cor={E.vermelho}>
      corpo pelando… e você tremendo de frio?
    </Nota>
    <Nota
      f={f}
      at={T.cerebro - 6}
      x={240}
      y={1260}
      w={700}
      size={72}
      cor={E.azul}
      rot={2}
    >
      a resposta está no cérebro 🧠
    </Nota>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Capitulo f={f} at={PARTES[1][0] + 4} kicker="No cérebro">
      O{" "}
      <MarcaE f={f} at={T.hipotalamo}>
        hipotálamo
      </MarcaE>{" "}
      é o termostato do corpo
    </Capitulo>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 500,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 200,
      }}
    >
      🧠
    </div>
    <Mostrador
      f={f}
      x={540}
      y={1180}
      r={360}
      valor={37}
      at={T.termostato - 6}
    />
    <Nota
      f={f}
      at={T.temperatura}
      x={180}
      y={1420}
      w={760}
      size={64}
      cor={E.verde}
      rot={-2}
    >
      normal: perto de 36 a 37 °C
    </Nota>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Capitulo
      f={f}
      at={PARTES[2][0] + 4}
      kicker="Quando entra uma infecção"
      size={70}
    >
      O sistema de defesa manda um recado ao cérebro
    </Capitulo>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 470,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 130,
        opacity: f < T.prosta - 10 ? 1 : 0,
      }}
    >
      🧠
    </div>
    {f < T.prosta - 10 ? (
      <Defesa f={f} />
    ) : (
      <>
        <Recorte
          f={f}
          at={T.prosta - 10}
          x={110}
          y={520}
          w={860}
          rot={-1.5}
          seed={5}
        >
          <Kicker>a molécula</Kicker>
          <Manchete size={70}>
            <MarcaE f={f} at={T.prosta + 6}>
              prostaglandina E2
            </MarcaE>
          </Manchete>
        </Recorte>
        <Mostrador
          f={f}
          x={540}
          y={1240}
          r={330}
          valor={termostato(f)}
          at={T.prosta - 6}
        />
        <Nota f={f} at={T.sobe} x={560} y={800} w={460} size={64} rot={6} cor={E.vermelho}>
          sobe o termostato ↑
        </Nota>
      </>
    )}
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => {
  const febreAlta = it(corpo(f), 38, 39, 0, 1);
  return (
    <Cena f={f} i={3}>
      <Calor f={f} forca={f > T.antitermico ? 0 : febreAlta * 0.6}>
        <Capitulo
          f={f}
          at={PARTES[3][0] + 4}
          kicker={
            f < T.antitermico
              ? "O cérebro pede 39 °C… o corpo está a 37"
              : "O termostato volta para 37 °C"
          }
          size={66}
        >
          {f < T.antitermico ? (
            <>
              Para o cérebro, você está com{" "}
              <span style={{ color: E.azul }}>frio</span>
            </>
          ) : (
            <>
              O antitérmico{" "}
              <span style={{ color: E.vermelho }}>baixa o termostato</span>
            </>
          )}
        </Capitulo>
        <Grafico f={f} />
        {f < T.antitermico ? (
          <>
            <Item f={f} at={T.gelada - 8} y={1280} emoji="🖐️">
              vasos da pele apertam: mão gelada e pálida
            </Item>
            <Item f={f} at={T.calafrio - 10} y={1420} emoji="🥶">
              músculos tremem: o calafrio
            </Item>
            <Item f={f} at={T.cobertor - 8} y={1560} emoji="🛏️">
              e você só quer um cobertor
            </Item>
          </>
        ) : (
          <>
            <Item f={f} at={T.antitermico} y={1280} emoji="💊">
              <span style={{ fontSize: 46 }}>
                {[
                  [T.paracetamol, "paracetamol"],
                  [T.dipirona, " · dipirona"],
                  [T.ibuprofeno, " · ibuprofeno"],
                ]
                  .map(([at, s]) => (f >= (at as number) - 4 ? s : ""))
                  .join("")}
              </span>
            </Item>
            <Item f={f} at={T.diminui} y={1420} emoji="✂️">
              menos prostaglandina
            </Item>
            <Item f={f} at={T.abrem - 6} y={1560} emoji="🥵">
              vasos se abrem, vem o suor
            </Item>
            <Suor f={f} />
          </>
        )}
      </Calor>
      <Carimbo
        f={f}
        at={T.passa - 4}
        x={770}
        y={1070}
        texto="o frio passa"
        cor={E.verde}
        size={34}
        rot={-6}
      />
    </Cena>
  );
};

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Capitulo f={f} at={PARTES[4][0] + 4} kicker="Guarda essa" size={80}>
      Procure atendimento se:
    </Capitulo>
    <Item f={f} at={T.bebe - 6} y={560} emoji="👶">
      febre em bebê com menos de 3 meses
    </Item>
    <Item f={f} at={T.baixar - 6} y={760} emoji="📆">
      a febre não baixa ou dura vários dias
    </Item>
    <Item f={f} at={T.manchas - 6} y={960} emoji="🟣">
      manchas roxas que não somem ao apertar
    </Item>
    <Item f={f} at={T.nuca - 6} y={1160} emoji="⚠️">
      nuca dura, confusão ou falta de ar
    </Item>
    <Carimbo
      f={f}
      at={T.procure}
      x={760}
      y={1460}
      texto="atenção"
      size={60}
      rot={-8}
    />
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 520,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 150,
      }}
    >
      👩‍⚕️
    </div>
    <Recorte f={f} at={T.siga} x={110} y={760} w={860} rot={-1} seed={7}>
      <Manchete size={84}>Me siga</Manchete>
      <div
        style={{
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 54,
          color: E.texto,
          marginTop: 8,
        }}
      >
        para mais dicas de farmacologia e{" "}
        <MarcaE f={f} at={T.siga + 20}>
          curiosidades sobre a área
        </MarcaE>
      </div>
    </Recorte>
  </Cena>
);

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 640,
        width: 900,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: JORNAL, fontWeight: 900, fontSize: 86, lineHeight: 1.12, color: E.texto }}>
        Consulte um{" "}
        <MarcaE f={f} at={T.final + 12}>
          profissional de saúde
        </MarcaE>{" "}
        para orientações.
      </div>
    </div>
    <Traco
      f={f}
      at={T.final + 30}
      d="M 10 20 C 200 4 500 30 790 10"
      x={150}
      y={1120}
      w={800}
      h={40}
      cor={E.vermelho}
    />
  </Cena>
);

export const VideoFebre: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <Audio src={staticFile("febre/narracao.mp3")} />
      <Audio
        src={staticFile("febre/musica.wav")}
        volume={(fr) => musica(fr) * (1 - P(fr, DURATION_FEBRE - 60, DURATION_FEBRE))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(KIT[name])} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920). Tudo entre y≈300 e 1620 (recorte 3:4 do TikTok e do Instagram).
export const CapaFebre: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", left: 70, top: 330, width: 940 }}>
      <Kicker size={32} cor={E.vermelho}>Curiosidade do corpo</Kicker>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 112,
          lineHeight: 1.02,
          color: E.texto,
          marginTop: 14,
        }}
      >
        Por que a febre{" "}
        <MarcaE f={100} at={0}>
          dá frio
        </MarcaE>
        ?
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 560,
        top: 830,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 280,
      }}
    >
      🥶
    </div>
    <Recorte f={100} at={0} x={620} y={800} w={380} rot={6} seed={2}>
      <Manchete size={88}>
        <span style={{ color: E.vermelho }}>39 °C</span>
      </Manchete>
    </Recorte>
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 1250,
        width: 860,
        fontFamily: MAO,
        fontWeight: 700,
        fontSize: 76,
        color: E.vermelho,
        transform: "rotate(-3deg)",
        textAlign: "center",
      }}
    >
      a culpa é do seu cérebro 🧠
    </div>
  </AbsoluteFill>
);
