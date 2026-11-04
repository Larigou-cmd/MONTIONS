import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background, EASE, OUT, P, SNAP, it, mix, rgba } from "../lib";
import { C } from "../config";
import { EMOJI } from "../aas/ui";
import { JORNAL, MAO, SANS, SERIF } from "../fonts";
import { DURATION, PARTES, T } from "../semaComprimido/Video";
import { PW, Personagem } from "../sema2/Personagem";
import * as Vx from "../sarampo/Vox";
import boca from "../semaComprimido/boca.json";
import palavras from "../../audio/semaComprimido_palavras.json";

// A mesma narração do Notícias da Farmácia #3 (semaglutida em comprimido) montada em cada modelo da usuária,
// para ela comparar: Modelo 1 (escuro e elegante), 2 (PHARMACIST.EXE), 3 (personagem farmacêutica),
// 4 (explicadora sem personagem), 6 (Origens / colagem de papel) e 8 (lista neon).
// O conteúdo das cenas fica em CENAS; cada modelo só muda o visual. Tempos de semaComprimido/Video.tsx.

export { DURATION };
const W = 1080;
const PIX = "'Press Start TwoP', monospace";
const VT = "'VTThreeTwoThree', monospace";

// ---------- conteúdo ----------
type ItemC = { at: number; e: string; t: string };
type CenaC = {
  kicker: string;
  titulo: string;
  destaque?: string; // parte do título em cor de destaque
  itens?: ItemC[];
  selo?: { at: number; t: string; ruim?: boolean };
  grande?: { at: number; t: string; sub: string };
  especial?: "siga" | "final";
};
const CENAS: CenaC[] = [
  {
    kicker: "Notícias da Farmácia #3",
    titulo: "Semaglutida em",
    destaque: "comprimido",
    itens: [
      { at: T.hoje, e: "🏛️", t: "Anvisa · 4 de novembro" },
      { at: T.comprimido, e: "💊", t: "a mesma substância das canetas, para engolir" },
      { at: T.fica, e: "👀", t: "fica até o final!" },
    ],
    selo: { at: T.comprimido + 20, t: "APROVADO" },
  },
  {
    kicker: "O que foi aprovado",
    titulo: "Wegovy em",
    destaque: "comprimido",
    itens: [
      { at: T.wegovy, e: "🏷️", t: "da Novo Nordisk" },
      { at: T.primeiro, e: "🥇", t: "1º GLP-1 em comprimido para obesidade no Brasil" },
      { at: T.ja, e: "🩸", t: "já existia o oral para diabetes tipo 2" },
    ],
    selo: { at: T.primeiraVez, t: "1ª VEZ P/ OBESIDADE" },
  },
  {
    kicker: "Indicação",
    titulo: "Para",
    destaque: "quem?",
    itens: [
      { at: T.obesidade, e: "👤", t: "adultos com obesidade" },
      { at: T.sobrepeso, e: "⚖️", t: "ou sobrepeso + doença ligada ao peso" },
      { at: T.sobrepeso + 60, e: "🫀", t: "como pressão alta ou diabetes" },
    ],
    selo: { at: T.receita, t: "SÓ COM RECEITA", ruim: true },
  },
  {
    kicker: "GLP-1",
    titulo: "Como",
    destaque: "funciona",
    itens: [
      { at: T.imita, e: "🧬", t: "imita um hormônio do intestino" },
      { at: T.saciedade, e: "😌", t: "mais saciedade" },
      { at: T.estomago, e: "🐢", t: "estômago esvazia devagar" },
      { at: T.fome, e: "🍽️", t: "menos fome" },
    ],
  },
  {
    kicker: "A diferença",
    titulo: "Caneta ×",
    destaque: "comprimido",
    itens: [
      { at: T.caneta, e: "💉", t: "caneta: 1 injeção por semana" },
      { at: T.comp, e: "💊", t: "comprimido: 1 por dia" },
      { at: T.dose, e: "📈", t: "dose sobe aos poucos: 1,5 → 4 → 9 → 25 mg" },
    ],
  },
  {
    kicker: "Dica de farmacêutica",
    titulo: "Como",
    destaque: "tomar",
    itens: [
      { at: T.jejum, e: "🌅", t: "em jejum" },
      { at: T.agua, e: "💧", t: "com pouca água" },
      { at: T.trinta, e: "⏱️", t: "30 min sem comer, beber ou outro remédio" },
    ],
    selo: { at: T.quase, t: "SENÃO PERDE O EFEITO", ruim: true },
  },
  {
    kicker: "Estudo principal",
    titulo: "O",
    destaque: "resultado",
    grande: { at: T.treze, t: "-13,6%", sub: "do peso, em média, em ~1 ano e 3 meses" },
  },
  {
    kicker: "Parecidos com a caneta",
    titulo: "Efeitos",
    destaque: "colaterais",
    itens: [
      { at: T.enjoo, e: "🤢", t: "enjoo" },
      { at: T.vomito, e: "🤮", t: "vômito" },
      { at: T.diarreia, e: "🚽", t: "diarreia" },
      { at: T.intestino, e: "🧱", t: "intestino preso (mais no começo)" },
    ],
  },
  {
    kicker: "Farmácias",
    titulo: "Quando",
    destaque: "chega?",
    itens: [
      { at: T.preco, e: "💰", t: "preço: ainda não definido" },
      { at: T.previsao, e: "🗓️", t: "previsão: próximo trimestre" },
    ],
    selo: { at: T.retencao, t: "RECEITA RETIDA", ruim: true },
  },
  {
    kicker: "Atenção",
    titulo: "",
    destaque: "Cuidado!",
    itens: [
      { at: T.internet, e: "🛒", t: "à venda na internet antes disso?" },
      { at: T.falsificada, e: "⚠️", t: "pode ser falsificada" },
    ],
    selo: { at: T.desconfie, t: "DESCONFIE", ruim: true },
  },
  {
    kicker: "Comenta aí",
    titulo: "E você?",
    destaque: "Qual combina?",
    itens: [
      { at: T.injecao, e: "💉", t: "CANETA · 1x por semana" },
      { at: T.comp2, e: "💊", t: "COMPRIMIDO · 1x por dia" },
      { at: T.conta, e: "👇", t: "já usa? conta como está sendo" },
    ],
    selo: { at: T.comenta, t: "COMENTA AÍ!" },
  },
  { kicker: "", titulo: "Me siga", especial: "siga" },
  { kicker: "", titulo: "", especial: "final" },
];
const R = (i: number) => PARTES[i];
const cenaDe = (f: number) => {
  let i = 0;
  PARTES.forEach(([a], j) => {
    if (f >= a) i = j;
  });
  return i;
};

// legenda: blocos de até 4 palavras
type Pw = { text: string; start: number; end: number };
const PAL = (palavras as { words: Pw[] }).words;
const BLOCOS: Pw[][] = (() => {
  const out: Pw[][] = [];
  let cur: Pw[] = [];
  PAL.forEach((w) => {
    cur.push(w);
    if (cur.length >= 4 || /[.?!:,]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const blocoAtual = (f: number) => {
  const t = f / 30;
  if (f >= T.siga - 4) return null;
  const b = BLOCOS.find((bl, i) => t >= bl[0].start - 0.05 && (i === BLOCOS.length - 1 || t < BLOCOS[i + 1][0].start - 0.05));
  if (!b || t > b[b.length - 1].end + 0.6) return null;
  return { b, t };
};
const limpa = (s: string) => s.replace(/[.,:;]$/, "");

// ---------- tema ----------
type Tema = {
  Fundo: React.FC<{ f: number }>;
  Cena: React.FC<{ f: number; i: number; c: CenaC }>;
  Legenda?: React.FC<{ f: number }>;
  Extra?: React.FC<{ f: number }>;
};

// cada cena entra com fade/deslize
const Entra: React.FC<{ f: number; i: number; children: React.ReactNode; dy?: number }> = ({ f, i, children, dy = 50 }) => {
  const [a, b] = R(i);
  if (f < a || f >= b) return null;
  const k = Math.min(it(f, a, a + 12, 0, 1, OUT), 1 - P(f, b - 8, b));
  return <AbsoluteFill style={{ opacity: k, transform: `translateY(${(1 - it(f, a, a + 14, 0, 1, OUT)) * dy}px)` }}>{children}</AbsoluteFill>;
};
const kIn = (f: number, at: number, d = 12) => it(f, at, at + d, 0, 1, SNAP);

// =============== MODELO 1: escuro e elegante ===============
const M1C = { cor: "#38bdf8", ruim: "#f87171", ok: "#4ade80" };
const M1Siga: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", top: 720, left: 110, width: 860, height: 300, borderRadius: 30, background: C.box, border: `2px solid ${rgba(M1C.cor, 0.7)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: P(f, T.siga, T.siga + 14) }}>
    <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 78, color: C.ink }}>
      <span style={{ fontFamily: EMOJI }}>👩‍⚕️</span> Me siga
    </span>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink, textAlign: "center" }}>
      para mais dicas de farmacologia
      <br />e curiosidades sobre a área
    </span>
  </div>
);
const FinalSerif: React.FC<{ f: number; cor: string; claro?: boolean; font?: string }> = ({ f, cor, claro, font = SERIF }) => (
  <div style={{ position: "absolute", top: 720, left: 80, width: 920, textAlign: "center", fontFamily: font, fontWeight: 600, fontSize: 80, lineHeight: 1.2, color: claro ? C.ink : "#1b1b1b", opacity: it(f, T.final, T.final + 14, 0, 1, OUT) }}>
    Consulte um <span style={{ color: cor }}>profissional de saúde</span> para orientações.
  </div>
);
const M1: Tema = {
  Fundo: ({ f }) => <Background color={cenaDe(f) === 9 ? M1C.ruim : M1C.cor} pulses={[T.comprimido + 20, T.treze, T.desconfie, T.comenta, T.final]} />,
  Cena: ({ f, i, c }) => (
    <Entra f={f} i={i}>
      {c.especial === "siga" ? (
        <M1Siga f={f} />
      ) : c.especial === "final" ? (
        <FinalSerif f={f} cor={M1C.cor} claro />
      ) : (
        <>
          <div style={{ position: "absolute", top: 190, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 5, textTransform: "uppercase", color: M1C.cor, opacity: P(f, R(i)[0] + 4, R(i)[0] + 16) }}>
            {c.kicker}
          </div>
          <div style={{ position: "absolute", top: 250, left: 50, width: W - 100, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 76, lineHeight: 1.1, color: C.ink, opacity: P(f, R(i)[0] + 6, R(i)[0] + 20), textShadow: `0 0 30px ${rgba(M1C.cor, 0.35)}` }}>
            {c.titulo} <span style={{ color: i === 9 ? M1C.ruim : M1C.cor }}>{c.destaque}</span>
          </div>
          {c.itens?.map((x, j) => {
            if (f < x.at) return null;
            const k = kIn(f, x.at, 14);
            return (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: 60,
                  top: 470 + j * 160,
                  width: 960,
                  height: 132,
                  borderRadius: 30,
                  background: C.box,
                  border: `2px solid ${rgba(M1C.cor, 0.55)}`,
                  boxShadow: "0 16px 44px rgba(0,0,0,.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "0 32px",
                  boxSizing: "border-box",
                  opacity: Math.min(1, k * 1.3),
                  transform: `translateY(${(1 - k) * 50}px)`,
                }}
              >
                <span style={{ fontFamily: EMOJI, fontSize: 54 }}>{x.e}</span>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, color: C.ink }}>{x.t}</span>
              </div>
            );
          })}
          {c.selo && f >= c.selo.at && (
            <div style={{ position: "absolute", top: 1170, width: W, display: "flex", justifyContent: "center" }}>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 44,
                  color: c.selo.ruim ? M1C.ruim : M1C.ok,
                  border: `3px solid ${c.selo.ruim ? M1C.ruim : M1C.ok}`,
                  background: rgba(c.selo.ruim ? M1C.ruim : M1C.ok, 0.14),
                  borderRadius: 999,
                  padding: "16px 34px",
                  transform: `scale(${0.7 + 0.3 * kIn(f, c.selo.at)})`,
                  boxShadow: `0 0 30px ${rgba(c.selo.ruim ? M1C.ruim : M1C.ok, 0.3)}`,
                }}
              >
                {c.selo.t}
              </span>
            </div>
          )}
          {c.grande && f >= c.grande.at && (
            <div style={{ position: "absolute", top: 600, width: W, textAlign: "center", transform: `scale(${0.7 + 0.3 * kIn(f, c.grande.at, 16)})` }}>
              <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 200, color: M1C.ok, textShadow: `0 0 50px ${rgba(M1C.ok, 0.5)}` }}>{c.grande.t}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink, marginTop: 10 }}>{c.grande.sub}</div>
            </div>
          )}
        </>
      )}
    </Entra>
  ),
};

// =============== MODELO 2: PHARMACIST.EXE (terminal retrô) ===============
const VERDEF = "#39ff14",
  AMBAR = "#ffb000",
  VERM2 = "#ff4d4d";
const digita = (s: string, f: number, at: number, cps = 1.4) => s.slice(0, Math.max(0, Math.floor((f - at) * cps)));
const M2: Tema = {
  Fundo: ({ f }) => (
    <AbsoluteFill style={{ background: "#050805" }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(57,255,20,0.05) 0 2px, transparent 2px 5px)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(57,255,20,0.12)" }} />
      <div style={{ position: "absolute", top: 70, left: 40, right: 40, height: 70, border: `3px solid ${VERDEF}`, display: "flex", alignItems: "center", padding: "0 24px", fontFamily: PIX, fontSize: 24, color: VERDEF, justifyContent: "space-between" }}>
        <span>PHARMACIST.EXE</span>
        <span style={{ opacity: f % 30 < 15 ? 1 : 0.3 }}>● REC</span>
      </div>
    </AbsoluteFill>
  ),
  Cena: ({ f, i, c }) => (
    <Entra f={f} i={i} dy={0}>
      {c.especial === "siga" ? (
        <div style={{ position: "absolute", top: 760, width: W, textAlign: "center", fontFamily: VT, fontSize: 70, color: VERDEF }}>
          {">"} {digita("ME SIGA", f, T.siga)}
          <div style={{ fontSize: 48, marginTop: 20 }}>{digita("para mais dicas de farmacologia", f, T.siga + 10, 2)}</div>
        </div>
      ) : c.especial === "final" ? (
        <div style={{ position: "absolute", top: 760, left: 80, width: 920, textAlign: "center", fontFamily: VT, fontSize: 64, lineHeight: 1.2, color: VERDEF }}>
          {digita("Consulte um profissional de saúde para orientações.", f, T.final, 2)}
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", top: 200, left: 60, fontFamily: VT, fontSize: 38, color: AMBAR }}>C:\NOTICIAS\{c.kicker.toUpperCase().replace(/ /g, "_")}</div>
          <div style={{ position: "absolute", top: 260, left: 60, right: 60, fontFamily: PIX, fontSize: 54, lineHeight: 1.4, color: VERDEF, textShadow: `0 0 18px ${rgba(VERDEF, 0.6)}` }}>
            {digita(`${c.titulo} ${c.destaque ?? ""}`.trim().toUpperCase(), f, R(i)[0] + 4, 1.2)}
            <span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>_</span>
          </div>
          {c.itens?.map((x, j) =>
            f < x.at ? null : (
              <div key={j} style={{ position: "absolute", left: 60, right: 60, top: 520 + j * 120, fontFamily: VT, fontSize: 50, color: VERDEF, display: "flex", gap: 18 }}>
                <span style={{ color: AMBAR }}>{">"}</span>
                <span>{digita(x.t, f, x.at, 2)}</span>
              </div>
            ),
          )}
          {c.selo && f >= c.selo.at && (
            <div style={{ position: "absolute", top: 1100, width: W, textAlign: "center" }}>
              <span style={{ fontFamily: PIX, fontSize: 34, color: "#050805", background: c.selo.ruim ? VERM2 : VERDEF, padding: "16px 26px", opacity: f - c.selo.at < 24 && f % 8 < 4 ? 0.3 : 1 }}>
                [ {c.selo.ruim ? "!!" : "OK"} ] {c.selo.t}
              </span>
            </div>
          )}
          {c.grande && f >= c.grande.at && (
            <div style={{ position: "absolute", top: 600, width: W, textAlign: "center", fontFamily: PIX, color: VERDEF }}>
              <div style={{ fontSize: 130, textShadow: `0 0 30px ${rgba(VERDEF, 0.7)}` }}>{digita(c.grande.t, f, c.grande.at, 0.8)}</div>
              <div style={{ fontFamily: VT, fontSize: 48, marginTop: 30 }}>{digita(c.grande.sub, f, c.grande.at + 10, 2)}</div>
            </div>
          )}
        </>
      )}
    </Entra>
  ),
  Legenda: ({ f }) => {
    const a = blocoAtual(f);
    if (!a) return null;
    return (
      <div style={{ position: "absolute", top: 1450, left: 40, right: 40, borderTop: `3px solid ${VERDEF}`, paddingTop: 20, fontFamily: VT, fontSize: 56, color: VERDEF, textAlign: "center" }}>
        {a.b.map((w, i) => (
          <span key={i} style={{ color: a.t >= w.start - 0.03 ? VERDEF : rgba(VERDEF, 0.35), marginRight: 14 }}>
            {limpa(w.text)}
          </span>
        ))}
      </div>
    );
  },
};

// =============== MODELOS 3 e 4: explicadora clara (com e sem personagem) ===============
const K4 = { claro: "#ecebe5", azul: "#2f5bff", tinta: "#16161a", amarelo: "#ffe14d", verde: "#16a34a", vermelho: "#e5383b", branco: "#ffffff" };
const AZUIS = [0, 3, 6, 10];
const ehAzul = (i: number) => AZUIS.includes(i);
const FundoClaro: React.FC<{ f: number }> = ({ f }) => {
  const i = cenaDe(f);
  const antes = i > 0 && ehAzul(i - 1) ? 1 : 0;
  const k = antes + ((ehAzul(i) ? 1 : 0) - antes) * it(f, R(i)[0], R(i)[0] + 10, 0, 1, EASE);
  const linha = k > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(22,22,26,0.06)";
  return (
    <AbsoluteFill style={{ background: mix(K4.claro, K4.azul, k) }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${linha} 2px, transparent 2px), linear-gradient(90deg, ${linha} 2px, transparent 2px)`, backgroundSize: "60px 60px", backgroundPosition: `0 ${(f * 0.6) % 60}px` }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.18)" }} />
    </AbsoluteFill>
  );
};
const CenaClara = (comPersonagem: boolean): React.FC<{ f: number; i: number; c: CenaC }> =>
  function CenaClaraInner({ f, i, c }) {
    const azul = ehAzul(i);
    const tinta = azul ? K4.branco : K4.tinta;
    const larg = comPersonagem ? 640 : 980;
    return (
      <Entra f={f} i={i}>
        {c.especial === "siga" ? (
          <div style={{ position: "absolute", top: comPersonagem ? 300 : 620, left: 50, fontFamily: PIX, fontSize: 70, color: K4.tinta, opacity: P(f, T.siga, T.siga + 12) }}>
            ME SIGA
            <div style={{ fontFamily: VT, fontSize: 52, marginTop: 30, lineHeight: 1 }}>
              para mais dicas de
              <br />
              farmacologia 💊
            </div>
          </div>
        ) : c.especial === "final" ? (
          <div style={{ position: "absolute", top: comPersonagem ? 300 : 700, left: 50, width: 980, fontFamily: PIX, fontSize: 44, lineHeight: "78px", color: K4.tinta, textAlign: comPersonagem ? "left" : "center", opacity: it(f, T.final, T.final + 14, 0, 1, OUT) }}>
            Consulte um <span style={{ color: K4.azul }}>profissional de saúde</span> para orientações.
          </div>
        ) : (
          <>
            <div style={{ position: "absolute", top: 170, left: 50, fontFamily: VT, fontSize: 40, color: azul ? K4.amarelo : K4.azul, opacity: P(f, R(i)[0], R(i)[0] + 10) }}>{c.kicker.toUpperCase()}</div>
            <div style={{ position: "absolute", top: 230, left: 50, right: 50, fontFamily: PIX, fontSize: 56, lineHeight: "78px", color: tinta, textShadow: "5px 5px 0 rgba(22,22,26,0.15)", opacity: P(f, R(i)[0] + 4, R(i)[0] + 16) }}>
              {c.titulo.toUpperCase()} <span style={{ color: azul ? K4.amarelo : K4.azul }}>{(c.destaque ?? "").toUpperCase()}</span>
            </div>
            {c.itens?.map((x, j) => {
              if (f < x.at) return null;
              const k = kIn(f, x.at, 14);
              return (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    left: 50,
                    top: 450 + j * 165,
                    width: larg,
                    minHeight: 130,
                    boxSizing: "border-box",
                    background: K4.branco,
                    border: `5px solid ${K4.tinta}`,
                    borderRadius: 18,
                    boxShadow: `10px 10px 0 ${K4.tinta}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "14px 26px",
                    opacity: Math.min(1, k * 2),
                    transform: `translateY(${(1 - k) * 50}px) scale(${0.9 + 0.1 * k})`,
                  }}
                >
                  <span style={{ fontFamily: EMOJI, fontSize: 54 }}>{x.e}</span>
                  <span style={{ fontFamily: VT, fontSize: 50, lineHeight: "48px", color: K4.tinta }}>{x.t}</span>
                </div>
              );
            })}
            {c.selo && f >= c.selo.at && (
              <div
                style={{
                  position: "absolute",
                  left: 50,
                  top: 1130,
                  padding: "16px 24px",
                  background: c.selo.ruim ? K4.vermelho : K4.amarelo,
                  color: c.selo.ruim ? K4.branco : K4.tinta,
                  fontFamily: PIX,
                  fontSize: 32,
                  border: `4px solid ${K4.tinta}`,
                  borderRadius: 12,
                  boxShadow: `6px 6px 0 ${K4.tinta}`,
                  transform: `scale(${kIn(f, c.selo.at, 10)}) rotate(-3deg)`,
                  transformOrigin: "left center",
                  whiteSpace: "nowrap",
                }}
              >
                {c.selo.t}
              </div>
            )}
            {c.grande && f >= c.grande.at && (
              <div style={{ position: "absolute", top: 520, left: 50, width: larg, transform: `scale(${0.7 + 0.3 * kIn(f, c.grande.at, 16)})`, transformOrigin: "left center" }}>
                <div style={{ fontFamily: PIX, fontSize: comPersonagem ? 96 : 140, color: K4.amarelo, textShadow: "8px 8px 0 rgba(0,0,0,0.3)" }}>{c.grande.t}</div>
                <div style={{ fontFamily: VT, fontSize: 56, color: K4.branco, marginTop: 30, lineHeight: 1 }}>{c.grande.sub}</div>
              </div>
            )}
          </>
        )}
      </Entra>
    );
  };
const LegendaClara: React.FC<{ f: number }> = ({ f }) => {
  const a = blocoAtual(f);
  if (!a) return null;
  return (
    <div style={{ position: "absolute", top: 1380, left: 40, right: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", fontFamily: VT, fontSize: 70, lineHeight: 1 }}>
      {a.b.map((w, i) => {
        const ativa = a.t >= w.start - 0.03 && a.t < (a.b[i + 1]?.start ?? w.end + 0.6);
        return (
          <span key={i} style={{ color: ativa ? K4.tinta : K4.branco, background: ativa ? K4.amarelo : "transparent", padding: "0 8px", border: ativa ? `3px solid ${K4.tinta}` : "3px solid transparent", textShadow: ativa ? "none" : `-3px -3px 0 ${K4.tinta}, 3px -3px 0 ${K4.tinta}, -3px 3px 0 ${K4.tinta}, 3px 3px 0 ${K4.tinta}` }}>
            {limpa(w.text)}
          </span>
        );
      })}
    </div>
  );
};
const ICONES = ["💊", "📢", "👤", "🧬", "💉", "⏱️", "📉", "🤢", "📅", "⚠️", "💬", "💙", "🩺"];
const Apresentadora: React.FC<{ f: number }> = ({ f }) => {
  const i = cenaDe(f);
  const de = R(i)[0];
  const fim = it(f, T.final - 6, T.final + 18, 0, 1, EASE);
  const w = 380 + 120 * fim;
  const x = 680 + (290 - 680) * fim;
  const y = 700 + (900 - 700) * fim;
  const pulo = i === 0 ? (1 - it(f, 0, 18, 0, 1, SNAP)) * 700 : -Math.sin(Math.min(1, (f - de) / 14) * Math.PI) * 40;
  const respira = Math.sin(f / 20) * 4;
  const ki = it(f, de + 6, de + 16, 0, 1, SNAP);
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y + pulo + respira, width: w, filter: "drop-shadow(10px 10px 0 rgba(22,22,26,0.22))" }}>
        <div style={{ transform: `scale(${w / PW})`, transformOrigin: "0 0", width: PW }}>
          <Personagem f={f} boca={boca as number[]} />
        </div>
      </div>
      <div style={{ position: "absolute", left: x + w - 150, top: y - 50 + respira, width: 116, height: 116, borderRadius: 26, background: K4.branco, border: `5px solid ${K4.tinta}`, boxShadow: `6px 6px 0 ${K4.tinta}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EMOJI, fontSize: 62, transform: `scale(${ki}) rotate(${-8 + 4 * Math.sin(f / 15)}deg)` }}>
        {ICONES[i]}
      </div>
    </>
  );
};
const M3: Tema = { Fundo: FundoClaro, Cena: CenaClara(true), Extra: Apresentadora };
const M4: Tema = { Fundo: FundoClaro, Cena: CenaClara(false), Legenda: LegendaClara };

// =============== MODELO 6: Origens / colagem de papel ===============
const M6: Tema = {
  Fundo: () => <Vx.Fundo />,
  Cena: ({ f, i, c }) => (
    <Entra f={f} i={i} dy={0}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * P(f, R(i)[0], R(i)[1])})`, transformOrigin: "540px 820px" }}>
        {c.especial === "siga" ? (
          <div style={{ position: "absolute", top: 640, width: W, textAlign: "center" }}>
            <div style={{ fontFamily: JORNAL, fontWeight: 900, fontSize: 110, color: Vx.V.tinta }}>
              <Vx.Marca f={f} at={T.siga + 10}>Me siga</Vx.Marca>
            </div>
            <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 64, color: Vx.V.vermelho, marginTop: 20 }}>
              para mais dicas de farmacologia
              <br />e curiosidades sobre a área
            </div>
          </div>
        ) : c.especial === "final" ? (
          <FinalSerif f={f} cor={Vx.V.vermelho} font={JORNAL} />
        ) : (
          <>
            <Vx.Capitulo f={f} at={R(i)[0]} kicker={c.kicker}>
              {c.titulo} <Vx.Marca f={f} at={R(i)[0] + 16}>{c.destaque}</Vx.Marca>
            </Vx.Capitulo>
            {c.itens && (
              <Vx.Recorte f={f} at={c.itens[0].at - 10} x={80} y={420} w={920} rot={i % 2 ? 1.2 : -1.2} seed={i + 2}>
                {c.itens.map((x, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 20, minHeight: 110, borderBottom: j < (c.itens?.length ?? 0) - 1 ? "2px solid rgba(27,27,27,0.12)" : "none", opacity: P(f, x.at, x.at + 8) }}>
                    <span style={{ fontFamily: EMOJI, fontSize: 52 }}>{x.e}</span>
                    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: Vx.V.tinta }}>{x.t}</span>
                  </div>
                ))}
              </Vx.Recorte>
            )}
            {c.selo && <Vx.Carimbo f={f} at={c.selo.at} x={540} y={1260} texto={c.selo.t} cor={c.selo.ruim ? Vx.V.vermelho : Vx.V.verde} size={44} />}
            {c.grande && f >= c.grande.at && (
              <div style={{ position: "absolute", top: 560, width: W, textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", fontFamily: JORNAL, fontWeight: 900, fontSize: 210, color: Vx.V.tinta }}>
                  {c.grande.t}
                  <Vx.Traco f={f} at={c.grande.at + 10} d={Vx.circulo(660, 230)} x={20} y={30} w={660} h={230} />
                </div>
                <Vx.Nota f={f} at={c.grande.at + 30} x={140} y={300} w={800} rot={-3} cor={Vx.V.vermelho} size={58}>
                  {c.grande.sub}
                </Vx.Nota>
              </div>
            )}
          </>
        )}
      </AbsoluteFill>
    </Entra>
  ),
};

// =============== MODELO 8: lista neon ===============
const LIMA = "#c8ff3d",
  PRETO = "#060606",
  CINZA8 = "#8a8a8a";
const M8: Tema = {
  Fundo: ({ f }) => (
    <AbsoluteFill style={{ background: PRETO }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${rgba(LIMA, 0.08)} 1.5px, transparent 1.5px)`, backgroundSize: "36px 36px", backgroundPosition: `0 ${(f * 0.4) % 36}px` }} />
      <div style={{ position: "absolute", top: 80, left: 50, right: 50, height: 74, borderRadius: 40, border: `2px solid ${rgba(LIMA, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontFamily: VT, fontSize: 36, color: LIMA }}>
        <span>● notícias da farmácia</span>
        <span>#3</span>
      </div>
    </AbsoluteFill>
  ),
  Cena: ({ f, i, c }) => (
    <Entra f={f} i={i} dy={30}>
      {c.especial === "siga" ? (
        <div style={{ position: "absolute", top: 700, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 100, color: LIMA, textShadow: `0 0 30px ${rgba(LIMA, 0.6)}` }}>
          ME SIGA
          <div style={{ fontFamily: VT, fontSize: 52, color: "#fff", marginTop: 20, fontWeight: 400, textShadow: "none" }}>para mais dicas de farmacologia</div>
        </div>
      ) : c.especial === "final" ? (
        <FinalSerif f={f} cor={LIMA} claro font={SANS} />
      ) : (
        <>
          <div style={{ position: "absolute", top: 210, left: 60, fontFamily: VT, fontSize: 40, color: CINZA8 }}>{c.kicker.toLowerCase()}</div>
          <div style={{ position: "absolute", top: 260, left: 60, right: 60, fontFamily: SANS, fontWeight: 900, fontSize: 82, lineHeight: 1.05, color: "#fff", textTransform: "uppercase", opacity: P(f, R(i)[0] + 2, R(i)[0] + 14) }}>
            {c.titulo} <span style={{ color: LIMA, textShadow: `0 0 26px ${rgba(LIMA, 0.6)}` }}>{c.destaque}</span>
          </div>
          {c.itens?.map((x, j) => {
            const ab = P(f, x.at, x.at + 10);
            return (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: 60,
                  right: 60,
                  top: 520 + j * 150,
                  height: 124,
                  borderRadius: 24,
                  border: `2px solid ${ab > 0 ? LIMA : "#2a2a2a"}`,
                  background: ab > 0 ? rgba(LIMA, 0.08) : "#111",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "0 28px",
                  boxShadow: ab > 0 ? `0 0 24px ${rgba(LIMA, 0.25)}` : "none",
                  opacity: P(f, R(i)[0] + 8 + j * 4, R(i)[0] + 18 + j * 4),
                }}
              >
                <span style={{ fontFamily: VT, fontSize: 50, color: ab > 0 ? LIMA : CINZA8 }}>{String(j + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: EMOJI, fontSize: 46 }}>{ab > 0 ? x.e : "🔒"}</span>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: ab > 0 ? "#fff" : "#444", filter: ab > 0 ? "none" : "blur(6px)" }}>{x.t}</span>
              </div>
            );
          })}
          {c.selo && f >= c.selo.at && (
            <div style={{ position: "absolute", top: 1130, width: W, textAlign: "center" }}>
              <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: PRETO, background: c.selo.ruim ? "#ff5a5a" : LIMA, padding: "16px 34px", borderRadius: 999, display: "inline-block", transform: `scale(${0.7 + 0.3 * kIn(f, c.selo.at)})` }}>{c.selo.t}</span>
            </div>
          )}
          {c.grande && f >= c.grande.at && (
            <div style={{ position: "absolute", top: 600, width: W, textAlign: "center", transform: `scale(${0.7 + 0.3 * kIn(f, c.grande.at, 16)})` }}>
              <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 210, color: LIMA, textShadow: `0 0 50px ${rgba(LIMA, 0.6)}` }}>{c.grande.t}</div>
              <div style={{ fontFamily: VT, fontSize: 50, color: "#fff" }}>{c.grande.sub}</div>
            </div>
          )}
        </>
      )}
    </Entra>
  ),
  Legenda: ({ f }) => {
    const a = blocoAtual(f);
    if (!a) return null;
    return (
      <div style={{ position: "absolute", top: 1420, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: "#fff" }}>
        {a.b.map((w, i) => {
          const ativa = a.t >= w.start - 0.03 && a.t < (a.b[i + 1]?.start ?? w.end + 0.6);
          return (
            <span key={i} style={{ color: ativa ? LIMA : "#fff", marginRight: 12 }}>
              {limpa(w.text)}
            </span>
          );
        })}
      </div>
    );
  },
};

// ---------- motor ----------
const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(([de]) => [de, "whoosh", 0.22] as [number, string, number]),
  [T.comprimido + 20, "plim", 0.26],
  [T.receita, "trava", 0.26],
  [T.quase, "trava", 0.26],
  [T.treze, "plim", 0.26],
  [T.retencao, "trava", 0.26],
  [T.desconfie, "trava", 0.3],
  [T.comenta, "plim", 0.26],
  [T.final, "plim", 0.3],
];
const Motor: React.FC<{ tema: Tema }> = ({ tema }) => {
  const f = useCurrentFrame();
  const { Fundo, Cena, Legenda, Extra } = tema;
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      {CENAS.map((c, i) => (
        <Cena key={i} f={f} i={i} c={c} />
      ))}
      {Extra && <Extra f={f} />}
      {Legenda && <Legenda f={f} />}
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

export const SemaM1: React.FC = () => <Motor tema={M1} />;
export const SemaM2: React.FC = () => <Motor tema={M2} />;
export const SemaM3: React.FC = () => <Motor tema={M3} />;
export const SemaM4: React.FC = () => <Motor tema={M4} />;
export const SemaM6: React.FC = () => <Motor tema={M6} />;
export const SemaM8: React.FC = () => <Motor tema={M8} />;
