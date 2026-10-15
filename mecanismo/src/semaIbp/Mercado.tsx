import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { OUT, P, Part, Pill, SNAP, W, bornColor, bornGlow, it, rgba } from "../lib";

// Trecho "canetas nacionais de semaglutida" (narração audio/sema_mercado.mp3, inserida no quadro 2217).
// Tempos medidos nas pausas dessa narração: quadro = 2217 + segundos × 30.
export const COR = "#38bdf8";
const VERDE = "#4ade80";
const AMARELO = C.num;
const s = (seg: number) => Math.round(2217 + seg * 30);
export const M = {
  novidade: s(0.2), patente: s(2.6),
  agora: s(6.5), nacionais: s(9.4), ozivy: s(11.3), outras: s(13.2),
  molecula: s(16.4), fabrica: s(18), original: s(20.3), sintese: s(22.6),
  igual: s(24.9), estudo: s(26.6), barras: s(30), efeitos: s(32.6),
  atencao: s(35.7), diabetes: s(37), troca: s(40.2), receita: s(44.5),
  fim: s(48.3),
};
// os aprovados pela Anvisa em 2026 citados nas reportagens (exemplos, out/2026)
const NACIONAIS: [string, string][] = [
  ["Ozivy", "EMS"], ["Semavy", "Cosmed"], ["Owozy", "Ávita Care"], ["Zempneo", "Brainfarma"],
  ["Seemasun", "Sun"], ["Orsema", "Ranbaxy"], ["Semaclique", "Germed"], ["Yluméc", "EMS"],
];

const Titulo: React.FC<{ f: number; at: number; children: React.ReactNode; top?: number }> = ({ f, at, children, top = 250 }) => (
  <div style={{ position: "absolute", top, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 66, color: bornColor(f, at, C.ink, COR), textShadow: bornGlow(f, at, COR), opacity: it(f, at, at + 12, 0, 1, OUT), transform: `translateY(${(1 - it(f, at, at + 14, 0, 1, OUT)) * 30}px)` }}>{children}</div>
);
const Sub: React.FC<{ f: number; at: number; top: number; children: React.ReactNode; cor?: string }> = ({ f, at, top, children, cor = C.dim }) => (
  <div style={{ position: "absolute", top, width: W, textAlign: "center", fontFamily: SANS, fontSize: 34, color: cor, opacity: P(f, at, at + 12) }}>{children}</div>
);
const Caixa: React.FC<{ f: number; at: number; x?: number; y: number; w?: number; h: number; borda?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, x = 70, y, w = 940, h, borda, children, style }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: 30, background: C.box, border: `2px solid ${borda ?? C.boxBorder}`, boxShadow: borda ? `0 0 26px ${rgba(borda, 0.22)}` : "0 18px 50px rgba(0,0,0,.35)", opacity: Math.min(1, k * 1.3), transform: `translateY(${(1 - k) * 70}px)`, fontFamily: SANS, ...style }}>{children}</div>
  );
};

// 1. a patente caiu: originais × nacionais
export const MercadoLista: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={2222} to={M.molecula - 4} inY={100}>
      <Titulo f={f} at={M.novidade}>Novidade no Brasil</Titulo>
      <Pill x={540} y={385} text="Patente caiu em março de 2026" color={AMARELO} size={36} k={P(f, M.patente, M.patente + 12)} />
      <Caixa f={f} at={M.agora} y={460} h={170} style={{ padding: "22px 36px" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 3, color: C.dim }}>ORIGINAIS · NOVO NORDISK</div>
        <div style={{ display: "flex", gap: 22, marginTop: 16 }}>
          {["Ozempic®", "Wegovy®"].map((n) => <span key={n} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: C.ink }}>{n}</span>)}
        </div>
      </Caixa>
      <Caixa f={f} at={M.nacionais} y={660} h={560} borda={COR} style={{ padding: "22px 36px" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 3, color: COR }}>NACIONAIS · APROVADAS PELA ANVISA</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
          {NACIONAIS.map(([n, lab], i) => {
            const at = i === 0 ? M.ozivy : M.outras + (i - 1) * 5;
            if (f < at) return <div key={n} style={{ height: 98 }} />;
            const k = it(f, at, at + 12, 0, 1, SNAP);
            const destaque = i === 0;
            return (
              <div key={n} style={{ height: 98, borderRadius: 22, border: `2px solid ${destaque ? COR : C.boxBorder}`, background: destaque ? rgba(COR, 0.14) : "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 22px", transform: `scale(${0.8 + 0.2 * k})`, opacity: Math.min(1, k * 1.4) }}>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 38, color: C.ink }}>{n}</span>
                <span style={{ fontSize: 24, color: C.dim }}>{lab}</span>
              </div>
            );
          })}
        </div>
      </Caixa>
      <Sub f={f} at={M.outras + 40} top={1240}>Alguns exemplos · lista de outubro de 2026</Sub>
    </Part>
  );
};

// 2. mesma molécula, fabricação diferente
const Molecula: React.FC<{ cor: string; f: number }> = ({ cor, f }) => (
  <svg width={260} height={120} viewBox="-130 -60 260 120">
    <polyline points={Array.from({ length: 9 }, (_, i) => `${-104 + i * 26},${Math.sin(i * 1.1 + f / 20) * 22}`).join(" ")} fill="none" stroke={rgba(cor, 0.5)} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-104 + i * 26} cy={Math.sin(i * 1.1 + f / 20) * 22} r={11} fill={cor} style={{ filter: `drop-shadow(0 0 8px ${cor})` }} />)}
  </svg>
);
export const MercadoFabrica: React.FC = () => {
  const f = useCurrentFrame();
  const eq = it(f, M.molecula, M.molecula + 14, 0, 1, SNAP);
  const lado = (at: number, x: number, titulo: string, como: string, cor: string) => (
    <Caixa f={f} at={at} x={x} y={760} w={460} h={330} borda={cor} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: C.ink }}>{titulo}</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: cor, lineHeight: "42px" }}>{como}</div>
    </Caixa>
  );
  return (
    <Part from={M.molecula - 6} to={M.igual - 4} inY={100}>
      <Titulo f={f} at={M.molecula}>A molécula é a mesma</Titulo>
      <div style={{ position: "absolute", top: 400, width: W, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: Math.min(1, eq * 1.4), transform: `scale(${0.8 + 0.2 * eq})` }}>
        <Molecula cor={COR} f={f} />
        <span style={{ fontFamily: SERIF, fontSize: 90, color: C.ink }}>=</span>
        <Molecula cor={VERDE} f={f} />
      </div>
      <Sub f={f} at={M.fabrica} top={660} cor={C.ink}>O que muda é a <b style={{ color: AMARELO }}>fabricação</b></Sub>
      {lado(M.original, 70, "Original", "Biotecnologia", COR)}
      {lado(M.sintese, 550, "Nacionais", "Síntese química", VERDE)}
    </Part>
  );
};

// 3. funciona igual?
export const MercadoEstudo: React.FC = () => {
  const f = useCurrentFrame();
  const barra = (at: number, nome: string, v: number, cor: string, y: number) => {
    const k = it(f, at, at + 30, 0, 1, OUT);
    return (
      <div style={{ position: "absolute", left: 40, right: 40, top: y }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 38, fontWeight: 700, color: C.ink }}><span>{nome}</span><span style={{ color: cor }}>−{(v * k).toFixed(2).replace(".", ",")}</span></div>
        <div style={{ height: 30, borderRadius: 30, background: "rgba(255,255,255,0.08)", marginTop: 12, overflow: "hidden" }}>
          <div style={{ width: `${(v / 2.3) * 100 * k}%`, height: "100%", borderRadius: 30, background: cor, boxShadow: `0 0 18px ${rgba(cor, 0.6)}` }} />
        </div>
      </div>
    );
  };
  return (
    <Part from={M.igual - 6} to={M.atencao - 4} inY={100}>
      <Titulo f={f} at={M.igual}>Funciona igual?</Titulo>
      <Caixa f={f} at={M.estudo} y={400} h={520}>
        <div style={{ position: "absolute", left: 40, top: 30, fontSize: 30, fontWeight: 700, letterSpacing: 2, color: C.dim }}>ESTUDO · DIABETES TIPO 2</div>
        <div style={{ position: "absolute", left: 40, top: 80, fontSize: 32, color: C.ink }}>Queda da hemoglobina glicada (pontos)</div>
        {f >= M.barras && barra(M.barras, "Semaglutida sintética", 2.04, VERDE, 180)}
        {f >= M.barras + 12 && barra(M.barras + 12, "Ozempic®", 1.95, COR, 330)}
      </Caixa>
      {f >= M.efeitos && (
        <div style={{ position: "absolute", left: 90, top: 980, width: 900, height: 120, borderRadius: 60, background: rgba(VERDE, 0.12), border: `2.5px solid ${VERDE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 35, color: C.ink, opacity: P(f, M.efeitos, M.efeitos + 10), transform: `scale(${0.8 + 0.2 * it(f, M.efeitos, M.efeitos + 14, 0, 1, SNAP)})` }}>≈ mesmo efeito · efeitos colaterais parecidos</div>
      )}
    </Part>
  );
};

// 4. atenção
export const MercadoAtencao: React.FC = () => {
  const f = useCurrentFrame();
  const itens: [number, string, string][] = [
    [M.diabetes, "🩺", "A maioria foi aprovada para diabetes tipo 2"],
    [M.troca, "🔁", "A farmácia só troca uma pela outra com prescrição do médico"],
    [M.receita, "📋", "Receita obrigatória, retida na farmácia"],
  ];
  return (
    <Part from={M.atencao - 6} to={M.fim + 8} inY={100} outDur={10}>
      <Titulo f={f} at={M.atencao}><span style={{ color: C.alert }}>Atenção</span></Titulo>
      {itens.map(([at, e, t], i) => (
        <Caixa key={i} f={f} at={at} y={400 + i * 240} h={210} borda={i === 1 ? C.alert : undefined} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 40px" }}>
          <span style={{ fontFamily: "'Noto Color Emoji', sans-serif", fontSize: 64 }}>{e}</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, lineHeight: "54px", color: C.ink }}>{t}</span>
        </Caixa>
      ))}
    </Part>
  );
};
