// Kit do estilo "Etiquetas verdes" (Modelo 1 verde + formato dos vídeos de referência de 23/11/2026).
// Peças prontas para vídeos verticais 1080×1920 em Remotion. Todas recebem `f` (quadro atual) e os quadros
// em que entram (`at`). Catálogo e regras: skill "estilo-etiquetas-verde" (~/.claude/skills).
// Vídeo que originou o kit: src/insulinaAplicacao/Video.tsx. Demonstração: Id "EstiloEtiquetasDemo".
import React from "react";
import { random } from "remotion";
import { C } from "../config";
import { SANS } from "../fonts";
import { IN, OUT, P, Pill, W, it, rgba, tri } from "../lib";

export const COR = {
  NEON: "#3dff8f", // marca, certo, solução
  LIMAO: "#f2e52e", // atenção
  VERM: "#ff5a5a", // só alerta real / "não faça"
  MINT: "#8fc4ae", // rótulos pequenos
  BG0: "#04120f",
  INK: "#f7f3df",
  CARTAO: "rgba(9,32,26,0.92)",
};
const { NEON, LIMAO, VERM, MINT, BG0 } = COR;

// ---------------- etiquetas fixas no topo ----------------
// abas: [nome, quadro em que a parte começa]. A da vez fica cheia; as já vistas, contornadas.
export const Abas: React.FC<{ f: number; abas: [string, number][]; de: number; ate: number; y?: number }> = ({ f, abas, de, ate, y = 262 }) => {
  const k = Math.min(it(f, de, de + 12, 0, 1, OUT), 1 - it(f, ate, ate + 10, 0, 1, IN));
  if (k <= 0) return null;
  let atual = -1;
  abas.forEach(([, q], i) => {
    if (f >= q) atual = i;
  });
  const fonte = abas.length > 4 ? 24 : 28;
  return (
    <div style={{ position: "absolute", top: y, left: 0, width: W, display: "flex", justifyContent: "center", gap: 12, opacity: k }}>
      {abas.map(([n, q], i) => {
        const on = i === atual;
        return (
          <div
            key={n}
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: fonte,
              letterSpacing: 2,
              border: `2px solid ${i <= atual ? NEON : rgba("#f7f3df", 0.18)}`,
              background: on ? NEON : i < atual ? rgba(NEON, 0.1) : "transparent",
              color: on ? BG0 : i < atual ? NEON : rgba("#f7f3df", 0.4),
              transform: `scale(${1 + 0.12 * tri(f, q + 4, 8)})`,
              boxShadow: on ? `0 0 22px ${rgba(NEON, 0.45)}` : "none",
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

// selo do episódio no canto (ex.: "#1 · BCG")
export const SeloEpisodio: React.FC<{ f: number; at: number; texto: string }> = ({ f, at, texto }) => (
  <div style={{ position: "absolute", top: 200, right: 70, opacity: P(f, at, at + 10), padding: "6px 18px", borderRadius: 999, background: NEON, color: BG0, fontFamily: SANS, fontWeight: 900, fontSize: 24, letterSpacing: 2 }}>{texto}</div>
);

// ---------------- legenda em pílula com a palavra falada acesa ----------------
export type Palavra = { w: string; s: number }; // saída do transcrever (segundos)
export type Frase = { ini: number; fim: number; w: { t: string; f: number }[] };
// fr converte segundos da narração em quadro (pode incluir pausas inseridas)
export const montarFrases = (palavras: Palavra[], fr: (s: number) => number, maxPalavras = 5): Frase[] => {
  const out: Frase[] = [];
  let cur: { t: string; f: number }[] = [];
  palavras.forEach((p, i) => {
    cur.push({ t: p.w, f: fr(p.s) });
    if (/[.,?:;!]$/.test(p.w) || cur.length >= maxPalavras || i === palavras.length - 1) {
      out.push({ ini: cur[0].f, fim: 0, w: cur });
      cur = [];
    }
  });
  out.forEach((o, i) => {
    const ult = o.w[o.w.length - 1].f;
    o.fim = Math.min(out[i + 1]?.ini ?? ult + 40, ult + 40);
  });
  return out;
};
export const LegendaPilula: React.FC<{ f: number; frases: Frase[]; ate?: number; y?: number }> = ({ f, frases, ate = Infinity, y = 1478 }) => {
  if (f >= ate) return null;
  const c = frases.find((o) => f >= o.ini - 2 && f < o.fim);
  if (!c) return null;
  const k = Math.min(it(f, c.ini - 2, c.ini + 4, 0, 1, OUT), 1 - it(f, c.fim - 4, c.fim, 0, 1, IN));
  let ativa = -1;
  c.w.forEach((w, i) => {
    if (f >= w.f) ativa = i;
  });
  return (
    <div style={{ position: "absolute", top: y, left: 0, width: W, display: "flex", justifyContent: "center", opacity: k }}>
      <div style={{ maxWidth: 900, padding: "14px 26px", borderRadius: 20, background: "rgba(4,18,15,0.82)", border: `1.5px solid ${rgba(NEON, 0.22)}`, fontFamily: SANS, fontWeight: 800, fontSize: 46, lineHeight: "60px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 12px", color: C.ink }}>
        {c.w.map((w, i) => (
          <span key={i} style={{ padding: "0 8px", borderRadius: 10, background: i === ativa ? NEON : "transparent", color: i === ativa ? BG0 : i < ativa ? C.ink : rgba("#f7f3df", 0.45) }}>
            {w.t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------------- títulos ----------------
export const G: React.FC<{ c?: string; children: React.ReactNode }> = ({ c = NEON, children }) => <span style={{ color: c }}>{children}</span>;

// título da cena, alinhado à esquerda ("A pele <G>por dentro</G>")
export const Cabeca: React.FC<{ f: number; at: number; y?: number; size?: number; children: React.ReactNode }> = ({ f, at, y = 360, size = 66, children }) => {
  const k = it(f, at, at + 12, 0, 1, OUT);
  return <div style={{ position: "absolute", left: 80, right: 80, top: y, fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.12, color: C.ink, opacity: k, transform: `translateY(${(1 - k) * 24}px)` }}>{children}</div>;
};

// abertura de ficha: nome gigante brilhando + subtítulo + pílulas ("BCG", "Bacilo Calmette-Guérin", [Dose única, ...])
export const TituloGigante: React.FC<{ f: number; at: number; sobre?: string; nome: string; sub?: string; pilulas?: string[]; y?: number; size?: number }> = ({ f, at, sobre, nome, sub, pilulas = [], y = 330, size = 200 }) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", top: y, width: W, textAlign: "center", fontFamily: SANS, opacity: k, transform: `scale(${0.92 + 0.08 * k})` }}>
      {sobre && <div style={{ color: NEON, fontWeight: 800, fontSize: 30, letterSpacing: 5 }}>{sobre}</div>}
      <div style={{ color: NEON, fontWeight: 900, fontSize: size, lineHeight: 1.05, textShadow: `0 0 40px ${rgba(NEON, 0.55)}` }}>{nome}</div>
      {sub && <div style={{ color: C.ink, fontWeight: 700, fontSize: 44 }}>{sub}</div>}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 30 }}>
        {pilulas.map((p, i) => {
          const kp = P(f, at + 10 + i * 6, at + 18 + i * 6);
          return (
            <span key={p} style={{ opacity: kp, padding: "10px 24px", borderRadius: 999, fontWeight: 800, fontSize: 32, border: `2px solid ${NEON}`, background: i === 0 ? NEON : rgba(NEON, 0.08), color: i === 0 ? BG0 : C.ink }}>
              {p}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// número grande à esquerda + rótulo / título / detalhe ao lado ("15°  VIA ID · Intradérmica · 10° a 15°")
export const NumeroGrande: React.FC<{ f: number; at: number; numero: string; rotulo?: string; titulo: string; detalhe?: string; y?: number; size?: number }> = ({ f, at, numero, rotulo, titulo, detalhe, y = 345, size = 168 }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top: y, opacity: P(f, at, at + 12), display: "flex", alignItems: "center", gap: 26, fontFamily: SANS }}>
    <div style={{ fontWeight: 900, fontSize: size, lineHeight: 1, color: NEON, textShadow: `0 0 30px ${rgba(NEON, 0.45)}` }}>{numero}</div>
    <div>
      {rotulo && <div style={{ color: MINT, fontWeight: 800, fontSize: 26, letterSpacing: 2, whiteSpace: "nowrap" }}>{rotulo}</div>}
      <div style={{ color: C.ink, fontWeight: 800, fontSize: 54, lineHeight: 1.1 }}>{titulo}</div>
      {detalhe && <div style={{ color: rgba("#f7f3df", 0.6), fontWeight: 600, fontSize: 28 }}>{detalhe}</div>}
    </div>
  </div>
);

// pílula que entra num quadro e (opcional) sai em outro
export const Pila: React.FC<{ f: number; at: number; x?: number; y: number; cor?: string; size?: number; ate?: number; children: string }> = ({ f, at, x = 540, y, cor = NEON, size = 40, ate, children }) => {
  const kOut = ate ? 1 - P(f, ate - 6, ate) : 1;
  return <Pill x={x} y={y} text={children} color={cor} size={size} k={P(f, at - 6, at + 4) * kOut} />;
};

// ---------------- ícones desenhados (sem depender da fonte de emoji) ----------------
type Icone = "nao" | "cuidado" | "ok" | "escudo" | "salvar" | "enviar" | "comentar" | "seguir";
export const Ico: React.FC<{ tipo: Icone; size?: number; cor?: string }> = ({ tipo, size = 40, cor }) => {
  const c = cor ?? (tipo === "nao" ? VERM : tipo === "cuidado" ? LIMAO : NEON);
  const s = { width: size, height: size, flexShrink: 0 } as const;
  const p = { fill: "none", stroke: c, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" style={s}>
      {tipo === "nao" && (
        <>
          <circle cx={20} cy={20} r={15} {...p} />
          <line x1={9.5} y1={9.5} x2={30.5} y2={30.5} {...p} />
        </>
      )}
      {tipo === "cuidado" && (
        <>
          <path d="M20 5 L36 33 L4 33 Z" {...p} />
          <line x1={20} y1={15} x2={20} y2={24} {...p} />
          <circle cx={20} cy={28.5} r={1.6} fill={c} />
        </>
      )}
      {tipo === "ok" && <path d="M8 21 L16 29 L32 11" {...p} strokeWidth={4} />}
      {tipo === "escudo" && (
        <>
          <path d="M20 4 L34 9 L34 20 C34 29 27 34 20 37 C13 34 6 29 6 20 L6 9 Z" {...p} />
          <path d="M13 20 L18 25 L27 15" {...p} />
        </>
      )}
      {tipo === "salvar" && <path d="M11 6 L29 6 L29 34 L20 27 L11 34 Z" {...p} />}
      {tipo === "enviar" && <path d="M5 19 L35 6 L26 35 L19 22 Z M19 22 L35 6" {...p} />}
      {tipo === "comentar" && <path d="M20 7 C29 7 35 12 35 19 C35 26 29 31 20 31 C17 31 15 30.5 13 29.5 L6 33 L8 26.5 C6 24.5 5 22 5 19 C5 12 11 7 20 7 Z" {...p} />}
      {tipo === "seguir" && (
        <>
          <circle cx={16} cy={14} r={6} {...p} />
          <path d="M5 33 C5 26 10 22 16 22 C22 22 27 26 27 33" {...p} />
          <line x1={32} y1={12} x2={32} y2={22} {...p} />
          <line x1={27} y1={17} x2={37} y2={17} {...p} />
        </>
      )}
    </svg>
  );
};

// escudo grande ("O que ela protege")
export const EscudoGrande: React.FC<{ f: number; at: number; y?: number; size?: number }> = ({ f, at, y = 520, size = 220 }) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: W / 2 - size / 2, top: y, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, filter: `drop-shadow(0 0 24px ${rgba(NEON, 0.6)})` }}>
      <Ico tipo="escudo" size={size} />
    </div>
  );
};

// ---------------- listas ----------------
// tipo "nao" = vermelho (não aplique / não faça), "cuidado" = amarelo (adie / atenção), "ok" = verde (protege / faça)
export type ItemLista = { at: number; texto: string; sub?: string; tipo?: "nao" | "cuidado" | "ok" | "escudo" };
export const ListaCartoes: React.FC<{ f: number; itens: ItemLista[]; y: number; gap?: number; titulo?: { at: number; texto: string; cor?: string } }> = ({ f, itens, y, gap = 18, titulo }) => {
  let top = y;
  const linhas: React.ReactNode[] = [];
  let ultimoTipo: string | undefined;
  itens.forEach((it0, i) => {
    const tipo = it0.tipo ?? "ok";
    const cor = tipo === "nao" ? VERM : tipo === "cuidado" ? LIMAO : NEON;
    const k = it(f, it0.at, it0.at + 10, 0, 1, OUT);
    const h = it0.sub ? 116 : 92;
    if (tipo !== ultimoTipo && tipo !== "ok" && tipo !== "escudo") {
      const rot = tipo === "nao" ? "NÃO FAÇA" : "ATENÇÃO";
      if (i > 0 || !titulo) {
        linhas.push(
          <div key={`r${i}`} style={{ position: "absolute", left: 80, top, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: cor, opacity: k }}>
            {rot}
          </div>,
        );
        top += 40;
      }
    }
    ultimoTipo = tipo;
    linhas.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: 80,
          width: 920,
          top,
          height: h,
          borderRadius: 18,
          background: tipo === "nao" ? "rgba(60,14,14,0.85)" : tipo === "cuidado" ? "rgba(52,48,10,0.85)" : COR.CARTAO,
          border: `2px solid ${rgba(cor, 0.55)}`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 28px",
          opacity: k,
          transform: `translateX(${(1 - k) * 40}px)`,
          fontFamily: SANS,
          boxSizing: "border-box",
        }}
      >
        <Ico tipo={tipo} size={44} />
        <div>
          <div style={{ color: C.ink, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>{it0.texto}</div>
          {it0.sub && <div style={{ color: rgba("#f7f3df", 0.6), fontWeight: 600, fontSize: 26 }}>{it0.sub}</div>}
        </div>
      </div>,
    );
    top += h + gap;
  });
  return (
    <>
      {titulo && (
        <div style={{ position: "absolute", left: 80, top: y - 46, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: titulo.cor ?? VERM, opacity: P(f, titulo.at, titulo.at + 8) }}>
          {titulo.texto}
        </div>
      )}
      {linhas}
    </>
  );
};

// ---------------- linha do tempo vertical ----------------
// marcos: { at, rotulo (pequeno, em verde), texto (grande) }. O 1º fica no alto, o último no fim da linha.
export const LinhaDoTempo: React.FC<{ f: number; marcos: { at: number; rotulo: string; texto: string }[]; y?: number; altura?: number; x?: number }> = ({ f, marcos, y = 520, altura = 520, x = 120 }) => {
  const n = marcos.length;
  const posY = (i: number) => y + (n === 1 ? 0 : (altura * i) / (n - 1));
  const kLinha = n > 1 ? P(f, marcos[0].at, marcos[n - 1].at) : 1;
  return (
    <>
      <div style={{ position: "absolute", left: x - 4, top: posY(0), width: 8, height: altura, borderRadius: 4, background: rgba("#f7f3df", 0.12) }} />
      <div style={{ position: "absolute", left: x - 4, top: posY(0), width: 8, height: altura * kLinha, borderRadius: 4, background: NEON, boxShadow: `0 0 16px ${NEON}` }} />
      {marcos.map((m, i) => {
        const k = it(f, m.at, m.at + 10, 0, 1, OUT);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 20, top: posY(i) - 20, width: 40, height: 40, borderRadius: 20, background: k > 0 ? NEON : BG0, border: `3px solid ${NEON}`, boxShadow: k > 0 ? `0 0 18px ${NEON}` : "none", opacity: 0.4 + 0.6 * k }} />
            <div style={{ position: "absolute", left: x + 50, right: 70, top: posY(i) - 34, opacity: k, fontFamily: SANS }}>
              <div style={{ color: NEON, fontWeight: 800, fontSize: 24, letterSpacing: 3 }}>{m.rotulo}</div>
              <div style={{ color: C.ink, fontWeight: 800, fontSize: 46, lineHeight: 1.12 }}>{m.texto}</div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// cartão de informação com rótulos (LOCAL / AGULHA ...), com espaço opcional para imagem à esquerda
export const CartaoInfo: React.FC<{ f: number; at: number; y: number; campos: [string, string][]; imagem?: React.ReactNode; pilulas?: string[]; cor?: string }> = ({ f, at, y, campos, imagem, pilulas = [], cor = NEON }) => {
  const k = it(f, at, at + 12, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: 80, width: 920, top: y, display: "flex", gap: 26, opacity: k, transform: `translateY(${(1 - k) * 20}px)`, fontFamily: SANS }}>
      {imagem && <div style={{ width: 220, height: 220, borderRadius: 18, overflow: "hidden", border: `2px solid ${rgba(cor, 0.6)}`, background: "#e9efec", flexShrink: 0 }}>{imagem}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {campos.map(([r, t]) => (
          <div key={r}>
            <div style={{ color: cor, fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>{r}</div>
            <div style={{ color: C.ink, fontWeight: 700, fontSize: 34, lineHeight: 1.2 }}>{t}</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pilulas.map((p) => (
            <span key={p} style={{ padding: "6px 18px", borderRadius: 999, background: cor, color: BG0, fontWeight: 800, fontSize: 26 }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// caixa de aviso (amarela) ou exceção (verde contornada)
export const Aviso: React.FC<{ f: number; at: number; y: number; titulo: string; texto?: string; tipo?: "cuidado" | "excecao" }> = ({ f, at, y, titulo, texto, tipo = "cuidado" }) => {
  const cor = tipo === "cuidado" ? LIMAO : NEON;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: 80, width: 920, top: y, boxSizing: "border-box", padding: "20px 28px", borderRadius: 18, border: `2px solid ${rgba(cor, 0.6)}`, background: tipo === "cuidado" ? "rgba(52,48,10,0.85)" : COR.CARTAO, display: "flex", gap: 20, alignItems: "center", opacity: k, fontFamily: SANS }}>
      {tipo === "cuidado" && <Ico tipo="cuidado" size={52} />}
      <div>
        {tipo === "excecao" && <div style={{ color: NEON, fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>EXCEÇÃO</div>}
        <div style={{ color: C.ink, fontWeight: 800, fontSize: 38 }}>{titulo}</div>
        {texto && <div style={{ color: rgba("#f7f3df", 0.65), fontWeight: 600, fontSize: 28 }}>{texto}</div>}
      </div>
    </div>
  );
};

// ---------------- evolução em círculos com setas (pápula → lesão → cicatriz) ----------------
export const Evolucao: React.FC<{ f: number; etapas: { at: number; rotulo: string; desenho?: React.ReactNode }[]; y?: number; r?: number }> = ({ f, etapas, y = 900, r = 120 }) => {
  const n = etapas.length;
  const gap = (W - 160 - n * 2 * r) / Math.max(1, n - 1);
  return (
    <>
      {etapas.map((e, i) => {
        const cx = 80 + r + i * (2 * r + gap);
        const k = it(f, e.at, e.at + 10, 0, 1, OUT);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: cx - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, overflow: "hidden", border: `4px solid ${NEON}`, background: "#e8c0a8", opacity: k, transform: `scale(${0.7 + 0.3 * k})`, boxShadow: `0 0 20px ${rgba(NEON, 0.4)}` }}>{e.desenho}</div>
            <div style={{ position: "absolute", left: cx - 160, width: 320, top: y + r + 18, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.ink, opacity: k }}>{e.rotulo}</div>
            {i < n - 1 && <div style={{ position: "absolute", left: cx + r + gap / 2 - 18, top: y - 26, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: NEON, opacity: P(f, etapas[i + 1].at - 6, etapas[i + 1].at) }}>→</div>}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------- tabela "Grava aí" ----------------
export const TabelaGravaAi: React.FC<{ f: number; at: number; linhas: [string, string][]; y?: number; passo?: number; extra?: string[] }> = ({ f, at, linhas, y = 520, passo = 30 }) => (
  <>
    {linhas.map(([a, b], i) => {
      const t = at + i * passo;
      const k = it(f, t, t + 10, 0, 1, OUT);
      return (
        <div key={a} style={{ position: "absolute", left: 80, width: 920, top: y + i * 150, height: 124, boxSizing: "border-box", borderRadius: 22, background: COR.CARTAO, border: `2.5px solid ${rgba(NEON, 0.2 + 0.5 * k)}`, display: "flex", alignItems: "center", gap: 28, padding: "0 32px", opacity: 0.25 + 0.75 * k, transform: `translateX(${(1 - k) * 40}px)`, fontFamily: SANS }}>
          <span style={{ width: 210, color: NEON, fontWeight: 900, fontSize: 32, letterSpacing: 2 }}>{a}</span>
          <span style={{ color: C.ink, fontWeight: 700, fontSize: 40 }}>{b}</span>
        </div>
      );
    })}
  </>
);

// ---------------- cartões finais (Salva / Manda / Comenta) ----------------
export const CartoesFinais: React.FC<{ f: number; at: number; itens?: [Icone, string, string][]; y?: number; passo?: number }> = ({
  f,
  at,
  itens = [
    ["salvar", "Salva ", "esse vídeo"],
    ["enviar", "Manda ", "pra quem precisa"],
    ["comentar", "Comenta ", "o próximo tema"],
  ],
  y = 420,
  passo = 18,
}) => (
  <>
    {itens.map(([ic, a, b], i) => {
      const t = at + i * passo;
      const k = it(f, t, t + 10, 0, 1, OUT);
      return (
        <div key={i} style={{ position: "absolute", left: 100, width: 880, top: y + i * 170, height: 140, boxSizing: "border-box", borderRadius: 22, background: COR.CARTAO, border: `2.5px solid ${rgba(NEON, 0.5)}`, display: "flex", alignItems: "center", gap: 30, padding: "0 38px", opacity: k, transform: `translateY(${(1 - k) * 30}px)`, fontFamily: SANS, boxShadow: `0 0 30px ${rgba(NEON, 0.12)}` }}>
          <Ico tipo={ic} size={58} />
          <span style={{ fontWeight: 900, fontSize: 56, color: C.ink }}>
            {a}
            <span style={{ color: NEON }}>{b}</span>
          </span>
        </div>
      );
    })}
  </>
);

// "PRÓXIMO EPISÓDIO · #2  Hepatite B"
export const ProximoEpisodio: React.FC<{ f: number; at: number; numero: string; titulo: string; y?: number }> = ({ f, at, numero, titulo, y = 960 }) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", top: y, width: W, textAlign: "center", fontFamily: SANS, opacity: k }}>
      <div style={{ color: NEON, fontWeight: 800, fontSize: 30, letterSpacing: 5 }}>PRÓXIMO EPISÓDIO · {numero}</div>
      <div style={{ color: NEON, fontWeight: 900, fontSize: 110, textShadow: `0 0 30px ${rgba(NEON, 0.5)}` }}>{titulo}</div>
    </div>
  );
};

// ---------------- corte da pele em camadas ----------------
export const SX = 90,
  SW = 900,
  SY = 850,
  HP = 70,
  HG = 180,
  HM = 200;
const g = (x: number, cx: number, bw: number) => Math.exp(-(((x - cx) / bw) ** 2));
export type Camada = "pele" | "gordura" | "musculo";
export const Pele: React.FC<{
  f: number;
  bump?: number;
  bumpX?: number;
  bumpW?: number;
  luz?: Camada | null;
  luzCor?: string;
  luzK?: number;
  rotulos?: [Camada, number][];
  nomes?: Partial<Record<Camada, string>>;
  caroco?: number;
  children?: React.ReactNode;
}> = ({ f, bump = 0, bumpX = 540, bumpW = 150, luz = null, luzCor = NEON, luzK = 1, rotulos = [], nomes: nomesIn = {}, caroco = 0, children }) => {
  const N = 90;
  const xs = Array.from({ length: N + 1 }, (_, i) => SX + (SW * i) / N);
  const top = (x: number) => SY - bump * g(x, bumpX, bumpW);
  const b1 = (x: number) => SY + HP - bump * 0.88 * g(x, bumpX, bumpW * 0.95);
  const b2 = () => SY + HP + HG;
  const bot = () => SY + HP + HG + HM;
  const poly = (a: (x: number) => number, b: (x: number) => number) => [...xs.map((x) => `${x},${a(x)}`), ...[...xs].reverse().map((x) => `${x},${b(x)}`)].join(" ");
  const regs: [Camada, string][] = [
    ["pele", poly(top, b1)],
    ["gordura", poly(b1, b2)],
    ["musculo", poly(b2, bot)],
  ];
  const fill: Record<Camada, string> = { pele: "url(#kit-pele)", gordura: "url(#kit-gord)", musculo: "url(#kit-musc)" };
  const nomes: Record<Camada, string> = { pele: "pele", gordura: "gordura", musculo: "músculo", ...nomesIn };
  const meio: Record<Camada, number> = { pele: SY + HP / 2, gordura: SY + HP + HG / 2, musculo: SY + HP + HG + HM / 2 };
  return (
    <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="kit-pele" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0b9ae" />
          <stop offset="1" stopColor="#c97f78" />
        </linearGradient>
        <pattern id="kit-gord" width="46" height="40" patternUnits="userSpaceOnUse">
          <rect width="46" height="40" fill="#cdb56a" />
          <circle cx="12" cy="11" r="11" fill="#f1dc95" stroke="#b89c52" strokeWidth="1.5" />
          <circle cx="35" cy="14" r="10" fill="#ecd48a" stroke="#b89c52" strokeWidth="1.5" />
          <circle cx="23" cy="31" r="10" fill="#f3e0a0" stroke="#b89c52" strokeWidth="1.5" />
          <circle cx="2" cy="33" r="7" fill="#ead28a" stroke="#b89c52" strokeWidth="1.5" />
          <circle cx="44" cy="35" r="7" fill="#ead28a" stroke="#b89c52" strokeWidth="1.5" />
        </pattern>
        <pattern id="kit-musc" width="40" height="12" patternUnits="userSpaceOnUse">
          <rect width="40" height="12" fill="#8e2a33" />
          <line x1="0" y1="3" x2="40" y2="4" stroke="#b5404a" strokeWidth="3" />
          <line x1="0" y1="9" x2="40" y2="8.5" stroke="#6e1e26" strokeWidth="2" />
        </pattern>
        <clipPath id="kit-clip">
          <rect x={SX} y={SY - 260} width={SW} height={HP + HG + HM + 260} rx={28} />
        </clipPath>
      </defs>
      <g clipPath="url(#kit-clip)">
        {regs.map(([n, pts]) => (
          <g key={n}>
            <polygon points={pts} fill={fill[n]} />
            {luz && luz !== n && <polygon points={pts} fill={BG0} opacity={0.5 * luzK} />}
          </g>
        ))}
      </g>
      {luz && <polygon points={regs.find(([n]) => n === luz)![1]} fill="none" stroke={luzCor} strokeWidth={6} opacity={luzK} clipPath="url(#kit-clip)" style={{ filter: `drop-shadow(0 0 14px ${luzCor})` }} />}
      {caroco > 0 && <ellipse cx={bumpX} cy={SY + HP + HG / 2 - bump * 0.45} rx={bumpW * 1.15} ry={HG / 2 + bump * 0.55} fill="none" stroke={LIMAO} strokeWidth={5} strokeDasharray="16 12" opacity={caroco} />}
      {children}
      {rotulos.map(([n, at]) => {
        const k = P(f, at - 4, at + 6);
        if (k <= 0) return null;
        return (
          <g key={n} opacity={k} transform={`translate(${SX + SW - 30},${meio[n]})`}>
            <rect x={-200} y={-28} width={200} height={56} rx={28} fill="rgba(4,18,15,0.85)" stroke={luz === n ? luzCor : rgba("#f7f3df", 0.3)} strokeWidth={2.5} />
            <text x={-100} y={11} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill={luz === n ? luzCor : C.ink}>
              {nomes[n]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// seringa/caneta desenhada apontando para baixo; ang = 90 é reto, 45 inclinada, 15 quase deitada
export const Caneta: React.FC<{ x: number; y: number; ang?: number; agulha?: number; corpo?: number; op?: number }> = ({ x, y, ang = 90, agulha = 130, corpo = 170, op = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang - 90})`} opacity={op}>
    <line x1={0} y1={0} x2={0} y2={-agulha} stroke="#e8eef0" strokeWidth={5} strokeLinecap="round" />
    <rect x={-14} y={-agulha - 22} width={28} height={24} rx={5} fill="#b9c4c8" />
    <rect x={-30} y={-agulha - 22 - corpo} width={60} height={corpo} rx={22} fill="#dfe7ea" stroke="#9fb0b5" strokeWidth={3} />
    <rect x={-18} y={-agulha - 22 - corpo * 0.62} width={36} height={corpo * 0.36} rx={8} fill={rgba(NEON, 0.75)} />
    <rect x={-22} y={-agulha - 22 - corpo - 26} width={44} height={30} rx={10} fill="#9fb0b5" />
  </g>
);

// gota/depósito brilhando na ponta da agulha (irregular = manchas espalhadas)
export const Gota: React.FC<{ x: number; y: number; k: number; cor?: string; irregular?: boolean }> = ({ x, y, k, cor = NEON, irregular }) => {
  if (k <= 0) return null;
  if (irregular)
    return (
      <g opacity={k}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={x + (random(`gx${i}`) - 0.5) * 150} cy={y + (random(`gy${i}`) - 0.5) * 70} rx={14 + 22 * random(`gr${i}`) * k} ry={10 + 12 * random(`gq${i}`) * k} fill={rgba(cor, 0.75)} />
        ))}
      </g>
    );
  return <ellipse cx={x} cy={y} rx={70 * k} ry={30 * k} fill={rgba(cor, 0.8)} stroke={cor} strokeWidth={3} style={{ filter: `drop-shadow(0 0 16px ${cor})` }} />;
};
