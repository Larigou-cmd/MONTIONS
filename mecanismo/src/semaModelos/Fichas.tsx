import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { EASE, OUT, P, SNAP, it, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { SANS, SERIF } from "../fonts";
import { DURATION, PARTES, T } from "../semaComprimido/Video";
import palavras from "../../audio/semaComprimido_palavras.json";

// Modelo "Fichas" (referência enviada pela usuária em 04/11/2026): fundo preto com piso quadriculado em perspectiva,
// uma ficha creme estilo app por cena (ícone + título + etiqueta mono no cabeçalho) com dados animados
// (contadores, calendários, medidores) e legenda curta no centro, com a palavra-chave em itálico serifado
// dentro de uma caixa azul de "seleção". Mesma narração do Notícias da Farmácia #3 (semaglutida em comprimido).

export { DURATION };
const W = 1080;
const VT = "'VTThreeTwoThree', monospace";
const F = {
  papel: "#f4efe4",
  papel2: "#e9e2d3",
  tinta: "#1d1d1f",
  cinza: "#8b867c",
  laranja: "#f07a2a",
  azul: "#2f6bff",
  verde: "#2fa35a",
  vermelho: "#e0443a",
  sel: "#3b82f6",
};
const R = (i: number) => PARTES[i];

// ---------- fundo: preto com piso em perspectiva ----------
const Fundo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "#050506" }}>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="piso" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      {Array.from({ length: 19 }, (_, i) => {
        const x = -900 + i * 160;
        return <line key={`v${i}`} x1={540} y1={980} x2={x} y2={1920} stroke="url(#piso)" strokeWidth={2} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const t = ((i + ((f / 90) % 1)) / 12) ** 2;
        const y = 980 + t * 940;
        return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#ffffff" strokeOpacity={0.03 + 0.09 * t} strokeWidth={2} />;
      })}
      {Array.from({ length: 40 }, (_, i) => {
        const x = random(`px${i}`) * W;
        const y = (((random(`py${i}`) * 1920 - f * (0.2 + random(`ps${i}`) * 0.4)) % 1920) + 1920) % 1920;
        return <circle key={`p${i}`} cx={x} cy={y} r={1 + random(`pr${i}`) * 1.6} fill="#fff" opacity={0.08} />;
      })}
    </svg>
    <AbsoluteFill style={{ boxShadow: "inset 0 0 300px rgba(0,0,0,0.9)" }} />
  </AbsoluteFill>
);

// ---------- a ficha ----------
const Ficha: React.FC<{ f: number; i: number; icone: string; corIcone: string; titulo: string; tag: string; h?: number; children: React.ReactNode }> = ({
  f,
  i,
  icone,
  corIcone,
  titulo,
  tag,
  h = 820,
  children,
}) => {
  const [a, b] = R(i);
  if (f < a || f >= b) return null;
  const k = it(f, a, a + 16, 0, 1, OUT);
  const s = P(f, b - 10, b);
  const blur = (1 - k) * 18 + s * 18;
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 170,
        width: 980,
        height: h,
        borderRadius: 30,
        background: `linear-gradient(180deg, ${F.papel} 0%, ${F.papel2} 100%)`,
        border: `2px solid ${rgba(F.laranja, 0.45)}`,
        boxShadow: `0 0 40px ${rgba(F.laranja, 0.18)}, 0 30px 60px rgba(0,0,0,0.6)`,
        overflow: "hidden",
        opacity: Math.min(k, 1 - s),
        transform: `translateY(${(1 - k) * 40 - s * 30}px) scale(${0.96 + 0.04 * k})`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div style={{ height: 86, display: "flex", alignItems: "center", gap: 16, padding: "0 30px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <span style={{ width: 44, height: 44, borderRadius: 10, background: corIcone, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EMOJI, fontSize: 26 }}>{icone}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: F.tinta, flex: 1 }}>{titulo}</span>
        <span style={{ fontFamily: VT, fontSize: 30, color: F.cinza }}>{tag}</span>
      </div>
      <div style={{ position: "relative", height: h - 86 }}>{children}</div>
    </div>
  );
};
const Box: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; escura?: boolean; style?: React.CSSProperties }> = ({ x, y, w, h, children, escura, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: escura ? "#202329" : "rgba(255,255,255,0.65)", border: `1px solid ${escura ? "#2e3239" : "rgba(0,0,0,0.07)"}`, ...style }}>{children}</div>
);
const Rotulo: React.FC<{ children: React.ReactNode; cor?: string; size?: number }> = ({ children, cor = F.cinza, size = 26 }) => (
  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, color: cor }}>{children}</div>
);
const Chip: React.FC<{ f: number; at: number; cor: string; children: React.ReactNode }> = ({ f, at, cor, children }) =>
  f < at ? null : (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 28,
        color: cor,
        background: rgba(cor, 0.12),
        border: `2px solid ${rgba(cor, 0.4)}`,
        borderRadius: 999,
        padding: "8px 18px",
        transform: `scale(${0.6 + 0.4 * it(f, at, at + 12, 0, 1, SNAP)})`,
        transformOrigin: "left center",
      }}
    >
      {children}
    </span>
  );
// contador estilo "placas que viram"
const Odometro: React.FC<{ f: number; de: number; ate: number; valores: string[]; size?: number }> = ({ f, de, ate, valores, size = 90 }) => {
  const idx = Math.min(valores.length - 1, Math.floor(it(f, de, ate, 0, valores.length - 1, (x) => x) + 0.0001));
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {valores[idx].split("").map((ch, j) => (
        <span key={j} style={{ width: size * 0.7, height: size * 1.15, borderRadius: 10, background: "#1c1c1e", border: "3px solid #3a3a3c", color: "#f6e7c1", fontFamily: VT, fontSize: size, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.4)" }}>
          {ch}
        </span>
      ))}
    </div>
  );
};
// medidor semicircular
const Medidor: React.FC<{ v: number; w?: number }> = ({ v, w = 300 }) => {
  const r = w / 2 - 20;
  const ang = -180 + 180 * v;
  const cx = w / 2,
    cy = w / 2 + 10;
  return (
    <svg width={w} height={w / 2 + 40}>
      {Array.from({ length: 30 }, (_, j) => {
        const a = ((-180 + j * 6.2) * Math.PI) / 180;
        const cor = j < 10 ? "#e0443a" : j < 20 ? "#f0b52a" : "#2fa35a";
        return <line key={j} x1={cx + Math.cos(a) * (r - 30)} y1={cy + Math.sin(a) * (r - 30)} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={cor} strokeWidth={8} />;
      })}
      <line x1={cx} y1={cy} x2={cx + Math.cos((ang * Math.PI) / 180) * (r - 40)} y2={cy + Math.sin((ang * Math.PI) / 180) * (r - 40)} stroke={F.vermelho} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={F.tinta} />
    </svg>
  );
};
// carimbo
const Carimbo: React.FC<{ f: number; at: number; texto: string; cor?: string; x: number; y: number; size?: number }> = ({ f, at, texto, cor = F.vermelho, x, y, size = 56 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(-8deg) scale(${1.6 - 0.6 * k})`, opacity: k, fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 3, color: cor, border: `7px solid ${cor}`, borderRadius: 12, padding: "6px 24px", whiteSpace: "nowrap", mixBlendMode: "multiply" }}>
      {texto}
    </div>
  );
};
const Barra: React.FC<{ v: number; cor: string }> = ({ v, cor }) => (
  <div style={{ height: 26, borderRadius: 13, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: "100%", background: cor, borderRadius: 13 }} />
  </div>
);
// caixa azul de "seleção" (palavra-chave em itálico)
const Sel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, padding: "0 8px", background: rgba(F.sel, 0.22), border: `2px solid ${rgba(F.sel, 0.9)}`, color: "#e8f0ff" }}>
    <span style={{ position: "absolute", left: -6, top: -6, width: 10, height: 10, borderRadius: 5, background: F.sel }} />
    <span style={{ position: "absolute", right: -6, bottom: -6, width: 10, height: 10, borderRadius: 5, background: F.sel }} />
    {children}
  </span>
);

// ---------- cenas ----------
const S0: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={0} icone="🏛️" corIcone="#fde2cf" titulo="Anvisa · aprovação" tag="04/11/2026">
    <Box x={60} y={60} w={340} h={330} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <span style={{ fontFamily: EMOJI, fontSize: 150 }}>💉</span>
      <Rotulo>caneta</Rotulo>
    </Box>
    <div style={{ position: "absolute", left: 445, top: 170, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: F.laranja, opacity: P(f, T.comprimido - 20, T.comprimido) }}>→</div>
    <Box x={580} y={60} w={340} h={330} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: P(f, T.comprimido - 6, T.comprimido + 6), transform: `scale(${0.7 + 0.3 * it(f, T.comprimido, T.comprimido + 14, 0, 1, SNAP)})` }}>
      <span style={{ fontFamily: EMOJI, fontSize: 150 }}>💊</span>
      <Rotulo>comprimido</Rotulo>
    </Box>
    <div style={{ position: "absolute", top: 440, left: 60, right: 60, fontFamily: SERIF, fontStyle: "italic", fontSize: 80, color: F.tinta, opacity: P(f, T.mesma, T.mesma + 14) }}>
      Semaglutida <span style={{ fontStyle: "normal", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: F.cinza }}>para obesidade</span>
    </div>
    <div style={{ position: "absolute", top: 580, left: 60, display: "flex", gap: 14 }}>
      <Chip f={f} at={T.mesma + 20} cor={F.azul}>
        mesma substância das canetas
      </Chip>
      <Chip f={f} at={T.fica} cor={F.laranja}>
        👀 até o final
      </Chip>
    </div>
    <Carimbo f={f} at={T.comprimido + 24} texto="APROVADO" cor={F.verde} x={770} y={480} />
  </Ficha>
);

const S1: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={1} icone="🗂️" corIcone="#dbe7ff" titulo="Ficha do remédio" tag="GLP-1 · nº 01">
    <Box x={40} y={40} w={900} h={280} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
      {[0, 1, 2, 3, 4, 5, 6].map((j) => (
        <span key={j} style={{ fontFamily: EMOJI, fontSize: 70, opacity: P(f, T.wegovy + j * 4, T.wegovy + 10 + j * 4), transform: `rotate(${j * 25}deg)` }}>
          💊
        </span>
      ))}
    </Box>
    <div style={{ position: "absolute", top: 360, left: 40, fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: F.tinta, background: `linear-gradient(transparent 60%, ${rgba("#ffd84d", 0.8 * P(f, T.wegovy + 10, T.wegovy + 24))} 60%)` }}>Wegovy comprimido</div>
    <div style={{ position: "absolute", top: 510, left: 40, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <Chip f={f} at={T.primeiro} cor={F.azul}>
        🥇 1º GLP-1 em comprimido para obesidade
      </Chip>
      <Chip f={f} at={T.ja} cor={F.cinza}>
        já existia: oral para diabetes tipo 2
      </Chip>
      <Chip f={f} at={T.primeiraVez} cor={F.laranja}>
        1ª vez para obesidade
      </Chip>
    </div>
  </Ficha>
);

const Check: React.FC<{ f: number; at: number; y: number; t: string }> = ({ f, at, y, t }) => {
  const k = P(f, at, at + 10);
  return (
    <div style={{ position: "absolute", left: 60, top: y, display: "flex", alignItems: "center", gap: 24, opacity: 0.35 + 0.65 * k }}>
      <span style={{ width: 56, height: 56, borderRadius: 14, border: `4px solid ${F.tinta}`, background: k > 0.5 ? F.verde : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40 }}>{k > 0.5 ? "✓" : ""}</span>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: F.tinta }}>{t}</span>
    </div>
  );
};
const S2: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={2} icone="👤" corIcone="#e4f5e9" titulo="Para quem é" tag="indicação">
    <Check f={f} at={T.obesidade} y={60} t="adultos com obesidade" />
    <Check f={f} at={T.sobrepeso} y={170} t="ou sobrepeso + doença ligada ao peso" />
    <div style={{ position: "absolute", left: 140, top: 260, display: "flex", gap: 12 }}>
      <Chip f={f} at={T.sobrepeso + 50} cor={F.vermelho}>
        pressão alta
      </Chip>
      <Chip f={f} at={T.sobrepeso + 70} cor={F.laranja}>
        diabetes
      </Chip>
    </div>
    <Box x={40} y={370} w={900} h={300} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 40px", boxSizing: "border-box" }}>
      <span style={{ fontFamily: EMOJI, fontSize: 120 }}>📄</span>
      <div>
        <Rotulo size={30}>receita médica</Rotulo>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: F.tinta, opacity: P(f, T.receita, T.receita + 10) }}>obrigatória</div>
      </div>
    </Box>
  </Ficha>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={3} icone="🧬" corIcone="#e5dcff" titulo="O que o GLP-1 faz" tag="hormônio do intestino">
    <Box x={40} y={40} w={430} h={430} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Rotulo cor={F.tinta} size={32}>
        Saciedade
      </Rotulo>
      <Medidor v={it(f, T.saciedade - 10, T.saciedade + 30, 0.15, 0.9, EASE)} w={360} />
      <span style={{ fontFamily: EMOJI, fontSize: 60 }}>🍽️</span>
    </Box>
    <Box x={510} y={40} w={430} h={430} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <Rotulo cor={F.tinta} size={32}>
        Estômago
      </Rotulo>
      <span style={{ fontFamily: EMOJI, fontSize: 120, display: "inline-block", transform: `rotate(${it(f, T.estomago, T.estomago + 60, 0, 180, EASE)}deg)` }}>⏳</span>
      <Rotulo>esvazia devagar</Rotulo>
    </Box>
    <div style={{ position: "absolute", top: 510, left: 40, right: 40 }}>
      <Rotulo cor={F.tinta} size={32}>
        Fome
      </Rotulo>
      <div style={{ marginTop: 14 }}>
        <Barra v={it(f, T.fome - 10, T.fome + 30, 0.9, 0.25, EASE)} cor={F.laranja} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 640, left: 40 }}>
      <Chip f={f} at={T.imita} cor={F.azul}>
        imita o hormônio GLP-1
      </Chip>
    </div>
  </Ficha>
);

const DIAS = ["S", "T", "Q", "Q", "S", "S", "D"];
const Semana: React.FC<{ f: number; at: number; todos: boolean; e: string; cor: string }> = ({ f, at, todos, e, cor }) => (
  <div style={{ display: "flex", gap: 12 }}>
    {DIAS.map((d, j) => {
      const on = todos ? P(f, at + j * 5, at + j * 5 + 6) : j === 0 ? P(f, at, at + 6) : 0;
      return (
        <div key={j} style={{ width: 114, height: 120, borderRadius: 14, background: on > 0.5 ? rgba(cor, 0.15) : "rgba(0,0,0,0.05)", border: `2px solid ${on > 0.5 ? cor : "rgba(0,0,0,0.08)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: VT, fontSize: 30, color: F.cinza }}>{d}</span>
          <span style={{ fontFamily: EMOJI, fontSize: 44, opacity: on }}>{e}</span>
        </div>
      );
    })}
  </div>
);
const S4: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={4} icone="📆" corIcone="#fde2cf" titulo="Uma semana de uso" tag="caneta × comprimido">
    <div style={{ position: "absolute", top: 40, left: 40 }}>
      <Rotulo cor={F.tinta} size={30}>
        💉 caneta · 1 por semana
      </Rotulo>
      <div style={{ marginTop: 12 }}>
        <Semana f={f} at={T.caneta} todos={false} e="💉" cor={F.vermelho} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 260, left: 40 }}>
      <Rotulo cor={F.tinta} size={30}>
        💊 comprimido · 1 por dia
      </Rotulo>
      <div style={{ marginTop: 12 }}>
        <Semana f={f} at={T.comp} todos e="💊" cor={F.azul} />
      </div>
    </div>
    <Box x={40} y={490} w={900} h={210} escura style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 30px", boxSizing: "border-box", opacity: P(f, T.dose - 10, T.dose) }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#cfcfcf", width: 220 }}>dose sobe aos poucos</div>
      <Odometro f={f} de={T.dose} ate={T.d25 + 10} valores={["1,5", "4", "9", "25"]} size={80} />
      <span style={{ fontFamily: VT, fontSize: 50, color: "#f6e7c1" }}>mg</span>
    </Box>
  </Ficha>
);

const S5: React.FC<{ f: number }> = ({ f }) => {
  const seg = Math.floor(it(f, T.trinta, T.trinta + 70, 0, 30, (x) => x));
  return (
    <Ficha f={f} i={5} icone="💡" corIcone="#fff3c4" titulo="Como tomar" tag="dica de farmacêutica">
      <Box x={40} y={50} w={430} h={240} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: P(f, T.jejum - 6, T.jejum + 6) }}>
        <span style={{ fontFamily: EMOJI, fontSize: 100 }}>🌅</span>
        <Rotulo cor={F.tinta} size={36}>
          em jejum
        </Rotulo>
      </Box>
      <Box x={510} y={50} w={430} h={240} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: P(f, T.agua - 6, T.agua + 6) }}>
        <span style={{ fontFamily: EMOJI, fontSize: 100 }}>💧</span>
        <Rotulo cor={F.tinta} size={36}>
          pouca água
        </Rotulo>
      </Box>
      <Box x={40} y={330} w={900} h={260} escura style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, opacity: P(f, T.trinta - 10, T.trinta) }}>
        <span style={{ fontFamily: EMOJI, fontSize: 110 }}>⏱️</span>
        <div>
          <div style={{ fontFamily: VT, fontSize: 130, color: "#f6e7c1", lineHeight: 1 }}>{String(seg).padStart(2, "0")}:00</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#cfcfcf" }}>sem comer, beber ou outro remédio</div>
        </div>
      </Box>
      <Carimbo f={f} at={T.quase} texto="SENÃO PERDE O EFEITO" x={490} y={670} size={40} />
    </Ficha>
  );
};

const S6: React.FC<{ f: number }> = ({ f }) => {
  const v = it(f, T.treze - 30, T.treze + 10, 0, 13.6, EASE);
  return (
    <Ficha f={f} i={6} icone="🔬" corIcone="#dbe7ff" titulo="Estudo principal" tag="OASIS 4 · 64 semanas">
      <Box x={40} y={50} w={900} h={360} escura style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontFamily: VT, fontSize: 200, color: "#f6e7c1", lineHeight: 1 }}>-{v.toFixed(1).replace(".", ",")}%</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#cfcfcf" }}>do peso, em média</div>
      </Box>
      <div style={{ position: "absolute", top: 460, left: 40, right: 40 }}>
        <Rotulo cor={F.tinta} size={30}>
          tempo de estudo · ~1 ano e 3 meses
        </Rotulo>
        <div style={{ marginTop: 14 }}>
          <Barra v={it(f, R(6)[0] + 10, T.treze + 20, 0, 1, EASE)} cor={F.verde} />
        </div>
      </div>
    </Ficha>
  );
};

const S7: React.FC<{ f: number }> = ({ f }) => {
  const itens: [string, string, number, number][] = [
    ["🤢", "enjoo", T.enjoo, 0.9],
    ["🤮", "vômito", T.vomito, 0.6],
    ["🚽", "diarreia", T.diarreia, 0.7],
    ["🧱", "intestino preso", T.intestino, 0.5],
  ];
  const cai = it(f, T.comeco, T.comeco + 40, 1, 0.35, EASE);
  return (
    <Ficha f={f} i={7} icone="⚠️" corIcone="#ffe0dc" titulo="Efeitos mais comuns" tag="parecidos com a caneta">
      {itens.map(([e, t, at, v], j) => (
        <div key={t} style={{ position: "absolute", left: 40, right: 40, top: 50 + j * 130, display: "flex", alignItems: "center", gap: 24, opacity: P(f, at, at + 8) }}>
          <span style={{ fontFamily: EMOJI, fontSize: 60 }}>{e}</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: F.tinta, width: 320 }}>{t}</span>
          <div style={{ flex: 1 }}>
            <Barra v={v * cai * P(f, at, at + 14)} cor={F.vermelho} />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 40, top: 600 }}>
        <Chip f={f} at={T.comeco} cor={F.verde}>
          📉 principalmente no começo
        </Chip>
      </div>
    </Ficha>
  );
};

const MESES = ["NOV", "DEZ", "JAN", "FEV", "MAR", "ABR"];
const S8: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={8} icone="🗓️" corIcone="#fde2cf" titulo="Quando chega" tag="farmácias">
    <div style={{ position: "absolute", top: 50, left: 40, display: "flex", gap: 14 }}>
      {MESES.map((m, j) => {
        const tri = j >= 2 && j <= 4 ? P(f, T.previsao + (j - 2) * 6, T.previsao + 8 + (j - 2) * 6) : 0;
        return (
          <div key={m} style={{ width: 138, height: 170, borderRadius: 16, background: tri > 0.5 ? rgba(F.laranja, 0.18) : "rgba(255,255,255,0.65)", border: `2px solid ${tri > 0.5 ? F.laranja : "rgba(0,0,0,0.08)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontFamily: VT, fontSize: 40, color: j === 0 ? F.vermelho : F.tinta }}>{m}</span>
            <span style={{ fontFamily: EMOJI, fontSize: 40, opacity: tri }}>💊</span>
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", top: 250, left: 40 }}>
      <Chip f={f} at={T.previsao} cor={F.laranja}>
        previsão: próximo trimestre
      </Chip>
    </div>
    <Box x={40} y={350} w={430} h={300} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: P(f, T.preco - 6, T.preco + 6) }}>
      <Rotulo size={30}>preço</Rotulo>
      <div style={{ fontFamily: VT, fontSize: 100, color: F.tinta }}>R$ --,--</div>
      <Rotulo size={26}>ainda não definido</Rotulo>
    </Box>
    <Box x={510} y={350} w={430} h={300} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: P(f, T.retencao - 10, T.retencao) }}>
      <span style={{ fontFamily: EMOJI, fontSize: 100 }}>📄</span>
      <Rotulo cor={F.tinta} size={34}>
        receita retida
      </Rotulo>
    </Box>
  </Ficha>
);

const S9: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={9} icone="🛒" corIcone="#ffe0dc" titulo="Loja online" tag="anúncio suspeito">
    <Box x={40} y={40} w={900} h={460} style={{ overflow: "hidden" }}>
      <div style={{ height: 50, background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
        ))}
        <span style={{ marginLeft: 20, fontFamily: VT, fontSize: 26, color: F.cinza }}>www.oferta-imperdivel.???</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40, padding: 40 }}>
        <span style={{ fontFamily: EMOJI, fontSize: 160 }}>💊</span>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: F.tinta }}>Semaglutida comprimido</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: F.verde, marginTop: 10 }}>sem receita! 🔥</div>
          <div style={{ marginTop: 20, display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: F.verde, borderRadius: 12, padding: "10px 24px" }}>COMPRAR</div>
        </div>
      </div>
    </Box>
    <Carimbo f={f} at={T.desconfie} texto="DESCONFIE" x={490} y={280} size={90} />
    <div style={{ position: "absolute", top: 560, left: 40 }}>
      <Chip f={f} at={T.falsificada} cor={F.vermelho}>
        ⚠️ pode ser falsificada
      </Chip>
    </div>
  </Ficha>
);

const Opcao: React.FC<{ f: number; y: number; e: string; t: string; sub: string; at: number; v: number; cor: string }> = ({ f, y, e, t, sub, at, v, cor }) => (
  <Box x={40} y={y} w={900} h={210} style={{ overflow: "hidden", opacity: P(f, at - 6, at + 6), transform: `scale(${0.9 + 0.1 * it(f, at, at + 12, 0, 1, SNAP)})` }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v * 100}%`, background: rgba(cor, 0.16) }} />
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, height: "100%", padding: "0 34px" }}>
      <span style={{ fontFamily: EMOJI, fontSize: 90 }}>{e}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: cor }}>{t}</div>
        <Rotulo size={28}>{sub}</Rotulo>
      </div>
      <span style={{ fontFamily: VT, fontSize: 60, color: F.tinta, opacity: P(f, T.comenta, T.comenta + 10) }}>?</span>
    </div>
  </Box>
);
const S10: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={10} icone="💬" corIcone="#dbe7ff" titulo="Enquete" tag="comenta aí 👇">
    <div style={{ position: "absolute", top: 30, left: 40, fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: F.tinta }}>Qual combina com você?</div>
    <Opcao f={f} y={140} e="💉" t="CANETA" sub="1 injeção por semana" at={T.injecao} v={it(f, T.comenta, T.comenta + 60, 0, 0.52, EASE)} cor={F.vermelho} />
    <Opcao f={f} y={380} e="💊" t="COMPRIMIDO" sub="1 por dia, em jejum" at={T.comp2} v={it(f, T.comenta, T.comenta + 60, 0, 0.48, EASE)} cor={F.azul} />
    <div style={{ position: "absolute", top: 620, left: 40 }}>
      <Chip f={f} at={T.conta} cor={F.laranja}>
        já usa? conta como está sendo
      </Chip>
    </div>
  </Ficha>
);

const S11: React.FC<{ f: number }> = ({ f }) => (
  <Ficha f={f} i={11} icone="👩‍⚕️" corIcone="#e4f5e9" titulo="Me siga" tag="farmacologia" h={520}>
    <div style={{ position: "absolute", top: 70, width: 980, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 84, color: F.tinta }}>Me siga</div>
    <div style={{ position: "absolute", top: 220, width: 980, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 38, color: F.cinza }}>
      para mais dicas de farmacologia
      <br />e curiosidades sobre a área
    </div>
  </Ficha>
);
const S12: React.FC<{ f: number }> = ({ f }) =>
  f < R(12)[0] ? null : (
    <div style={{ position: "absolute", top: 760, left: 80, width: 920, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 70, lineHeight: 1.35, color: "#f2f2f2", opacity: it(f, T.final, T.final + 14, 0, 1, OUT) }}>
      Consulte um <Sel>profissional de saúde</Sel> para orientações.
    </div>
  );

// ---------- legenda: 2 a 3 palavras, palavra-chave em itálico com caixa azul de seleção ----------
type Pw = { text: string; start: number; end: number };
const PAL = (palavras as { words: Pw[] }).words;
const CHAVE = new Set(
  "anvisa comprimido semaglutida canetas opinião wegovy glp-1 obesidade diabetes receita hormônio intestino saciedade estômago fome caneta semana dia miligramas farmacêutica jejum água trinta absorvido efeito estudo treze peso enjoo vômito diarreia preso preço trimestre retenção internet desconfie falsificada rotina comenta farmacologia".split(
    " ",
  ),
);
const norm = (s: string) => s.toLowerCase().replace(/[^\wà-ú-]/g, "");
const GRUPOS: Pw[][] = (() => {
  const out: Pw[][] = [];
  let cur: Pw[] = [];
  PAL.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[.?!:,;]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  if (f >= T.siga - 4) return null;
  const g = GRUPOS.find((gr, i) => t >= gr[0].start - 0.05 && (i === GRUPOS.length - 1 || t < GRUPOS[i + 1][0].start - 0.05));
  if (!g || t > g[g.length - 1].end + 0.5) return null;
  return (
    <div style={{ position: "absolute", top: 1100, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 62, color: "#f2f2f2", lineHeight: 1.3 }}>
      {g.map((w, i) => {
        const txt = w.text.replace(/[.,:;!?]$/, "");
        const k = t >= w.start - 0.03 ? it(f, w.start * 30 - 1, w.start * 30 + 5, 0, 1, OUT) : 0;
        return (
          <span key={i} style={{ opacity: 0.25 + 0.75 * k, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined, marginRight: 16, display: "inline-block" }}>
            {CHAVE.has(norm(txt)) ? <Sel>{txt}</Sel> : txt}
          </span>
        );
      })}
    </div>
  );
};

const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(([de]) => [de, "whoosh", 0.2] as [number, string, number]),
  [T.comprimido + 24, "trava", 0.26],
  [T.treze, "plim", 0.24],
  [T.desconfie, "trava", 0.3],
  [T.comenta, "plim", 0.24],
  [T.final, "plim", 0.28],
];

export const VideoSemaFichas: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <S0 f={f} />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S9 f={f} />
      <S10 f={f} />
      <S11 f={f} />
      <S12 f={f} />
      <Legenda f={f} />
      <Audio src={staticFile("semaComprimido/narracao.mp3")} />
      <Audio src={staticFile("semaComprimido/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
