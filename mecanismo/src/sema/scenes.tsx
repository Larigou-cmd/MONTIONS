import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, IN, OUT, P, SNAP, it, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { CENAS, PAL, STEP1, T } from "./config";
import { Character, FULL, PORTRAIT } from "./Character";

export const PIX = "'Press Start TwoP', monospace";
export const VT = "'VTThreeTwoThree', monospace";
const LIN = (x: number) => x;

// ---------- fundo: chuva de 0 e 1, scanlines ----------
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1300px at 50% 40%, #06233a 0%, ${PAL.bg} 70%)` }}>
      {Array.from({ length: 22 }, (_, c) => {
        const speed = 2 + ((c * 37) % 5);
        const off = (c * 211) % 1920;
        return (
          <div key={c} style={{ position: "absolute", left: c * 50 + 8, top: ((f * speed + off) % 2400) - 1200, fontFamily: VT, fontSize: 34, lineHeight: "34px", color: PAL.cyan, opacity: 0.12 + 0.08 * ((c * 7) % 3), whiteSpace: "pre" }}>
            {Array.from({ length: 36 }, (_, r) => ((c * 13 + r * 7 + Math.floor(f / 6)) % 3 === 0 ? "1" : "0")).join("\n")}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
export const CRT: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.16) 2px, rgba(0,0,0,0.16) 4px)", boxShadow: "inset 0 0 220px rgba(0,0,0,0.7)" }} />
);

// janela de terminal
const Janela: React.FC<{ x: number; y: number; w: number; h: number; titulo: string; k?: number; children?: React.ReactNode; glow?: number }> = ({ x, y, w, h, titulo, k = 1, children, glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, k * 1.4), transform: `scale(${0.92 + 0.08 * k})`, border: `3px solid ${PAL.cyan}`, background: PAL.panel, boxShadow: `0 0 ${18 + 30 * glow}px ${rgba(PAL.cyan, 0.35 + 0.3 * glow)}, inset 0 0 30px rgba(103,232,249,0.08)`, boxSizing: "border-box" }}>
    <div style={{ height: 46, borderBottom: `3px solid ${PAL.cyan}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontFamily: PIX, fontSize: 20, color: PAL.cyan }}>
      <span>C:\&gt; {titulo}</span>
      <span style={{ display: "flex", gap: 8 }}>{["_", "□", "×"].map((c, i) => <span key={i} style={{ width: 26, height: 26, border: `2px solid ${PAL.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{c}</span>)}</span>
    </div>
    <div style={{ position: "absolute", left: 0, top: 46, right: 0, bottom: 0 }}>{children}</div>
  </div>
);

// texto que vai sendo "digitado"
const Tipo: React.FC<{ f: number; at: number; text: string; cps?: number; style?: React.CSSProperties; cursor?: boolean }> = ({ f, at, text, cps = 40, style, cursor = false }) => {
  if (f < at) return null;
  const n = Math.min(text.length, Math.floor(((f - at) / 30) * cps) + 1);
  return <div style={style}>{text.slice(0, n)}{cursor && <span style={{ opacity: Math.floor(f / 12) % 2 }}>█</span>}</div>;
};

// ---------- a personagem: tela cheia ↔ janelinha ----------
export const Apresentadora: React.FC = () => {
  const f = useCurrentFrame();
  const toWin = it(f, T.encolhe, T.encolhe + 26, 0, 1, EASE);
  const toFull = it(f, T.consulte - 14, T.consulte + 14, 0, 1, EASE);
  const k = toWin * (1 - toFull);
  const full = { x: 0, y: -8, w: 1080, h: 1935 };
  const win = { x: 44, y: 1152, w: 440, h: 430 };
  const L = (a: number, b: number) => a + (b - a) * k;
  const crop = { sx: L(FULL.sx, PORTRAIT.sx), sy: L(FULL.sy, PORTRAIT.sy), sw: L(FULL.sw, PORTRAIT.sw), sh: L(FULL.sh, PORTRAIT.sh) };
  const box = { x: L(full.x, win.x), y: L(full.y, win.y), w: L(full.w, win.w), h: L(full.h, win.h) };
  return (
    <>
      {k > 0.98 && (
        <div style={{ position: "absolute", left: 40, top: 1106, width: 448, height: 480, border: `3px solid ${PAL.cyan}`, boxShadow: `0 0 26px ${rgba(PAL.cyan, 0.45)}`, background: PAL.bg, boxSizing: "border-box" }}>
          <div style={{ height: 40, borderBottom: `3px solid ${PAL.cyan}`, fontFamily: PIX, fontSize: 15, color: PAL.cyan, display: "flex", alignItems: "center", paddingLeft: 12 }}>PHARMACIST.EXE</div>
        </div>
      )}
      <Character f={f} {...box} crop={crop} />
    </>
  );
};

// ---------- abertura ----------
export const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  if (f > T.encolhe + 8) return null;
  const out = it(f, T.encolhe - 6, T.encolhe + 8, 0, 1, IN);
  const tk = it(f, T.titulo, T.titulo + 12, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: 70, top: 1140, width: 940, height: 330, border: `3px solid ${PAL.cyan}`, background: "rgba(2,11,20,0.9)", boxShadow: `0 0 30px ${rgba(PAL.cyan, 0.5)}`, opacity: Math.min(it(f, 4, 14, 0, 1, OUT), 1 - out), padding: "26px 34px", boxSizing: "border-box" }}>
      <Tipo f={f} at={8} text="C:\> semaglutida.exe" cps={26} cursor={f < T.titulo} style={{ fontFamily: VT, fontSize: 52, color: PAL.dim }} />
      {f >= T.titulo && <div style={{ fontFamily: PIX, fontSize: 64, color: PAL.cyan, marginTop: 26, textShadow: `0 0 18px ${PAL.cyan}`, transform: `scale(${0.7 + 0.3 * tk})`, transformOrigin: "left center" }}>SEMAGLUTIDA</div>}
      <Tipo f={f} at={T.marcas} text="Ozempic® · Wegovy® · Rybelsus®" cps={40} style={{ fontFamily: VT, fontSize: 48, color: PAL.white, marginTop: 22 }} />
    </div>
  );
};

// ---------- registro (log) ao lado da personagem ----------
const LOG: [number, string][] = [
  [T.glp, "> imita o GLP-1"], [T.semana, "> dura ~7 dias"], [T.semanal, "> 1x por semana"],
  [T.pancreas, "> pâncreas: ok"], [T.estomago, "> estômago: ok"], [T.cerebro, "> cérebro: ok"],
  [T.perda, "> perda: -14,9%"], [T.comuns[0], "> efeitos: GI"], [T.raros, "> raros: vesícula"],
  [T.ozempic, "> off-label: ⚠"], [T.indicacao, "> só c/ médico"], [T.parar, "> parar = reganho"],
];
export const Log: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, T.encolhe + 20, T.encolhe + 34, 0, 1, OUT) * (1 - it(f, T.consulte - 14, T.consulte, 0, 1, IN));
  if (k <= 0) return null;
  const vis = LOG.filter(([t]) => f >= t).slice(-7);
  return (
    <Janela x={510} y={1106} w={530} h={480} titulo="LOG.TXT" k={k}>
      <div style={{ padding: "14px 20px", fontFamily: VT, fontSize: 40, lineHeight: "54px", color: PAL.green }}>
        {vis.map(([t, s], i) => <Tipo key={t} f={f} at={t} text={s} cps={45} style={{ opacity: i === vis.length - 1 ? 1 : 0.65 }} />)}
        <span style={{ opacity: Math.floor(f / 12) % 2 }}>█</span>
      </div>
    </Janela>
  );
};

// ---------- cenas de conteúdo (janela grande no alto) ----------
const Cena: React.FC<{ i: number; children: (f: number) => React.ReactNode }> = ({ i, children }) => {
  const f = useCurrentFrame();
  const c = CENAS[i];
  if (f < c.de || f > c.ate) return null;
  const k = Math.min(it(f, c.de, c.de + 12, 0, 1, OUT), 1 - it(f, c.ate - 10, c.ate, 0, 1, IN));
  return <Janela x={40} y={230} w={1000} h={850} titulo={c.titulo} k={k}>{children(f)}</Janela>;
};

const Linha: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, children, style }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return <div style={{ opacity: k, transform: `translateX(${(1 - k) * -30}px)`, ...style }}>{children}</div>;
};

export const CenaGLP: React.FC = () => (
  <Cena i={0}>{(f) => {
    const nat = 1 - it(f, T.minutos + 10, T.minutos + 70, 0, 1, OUT);
    const sem = it(f, T.semana, T.semana + 30, 0, 1, OUT);
    return (
      <div style={{ padding: "34px 44px", fontFamily: VT, color: PAL.white }}>
        <Linha f={f} at={T.glp}><div style={{ fontFamily: PIX, fontSize: 40, color: PAL.cyan }}>GLP-1</div></Linha>
        <Linha f={f} at={T.glp + 10}><div style={{ fontSize: 50, marginTop: 12 }}>hormônio do intestino que a semaglutida imita</div></Linha>
        <Linha f={f} at={T.minutos} style={{ marginTop: 40 }}>
          <div style={{ fontSize: 46 }}>GLP-1 natural <span style={{ color: PAL.red }}>· dura ~2 minutos</span></div>
          <div style={{ height: 40, border: `3px solid ${PAL.red}`, marginTop: 8 }}><div style={{ width: `${nat * 100}%`, height: "100%", background: PAL.red }} /></div>
        </Linha>
        <Linha f={f} at={T.semana} style={{ marginTop: 30 }}>
          <div style={{ fontSize: 46 }}>Semaglutida <span style={{ color: PAL.green }}>· dura ~7 dias</span></div>
          <div style={{ height: 40, border: `3px solid ${PAL.green}`, marginTop: 8 }}><div style={{ width: `${sem * 100}%`, height: "100%", background: PAL.green }} /></div>
          <div style={{ fontSize: 34, color: PAL.dim, marginTop: 8 }}>modificada para resistir à enzima DPP-4 e se prender à albumina</div>
        </Linha>
        {f >= T.semanal && (
          <div style={{ display: "flex", gap: 12, marginTop: 40, alignItems: "center" }}>
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <div key={i} style={{ width: 70, height: 70, border: `3px solid ${PAL.cyan}`, background: i === 0 ? PAL.cyan : "transparent", color: i === 0 ? PAL.bg : PAL.cyan, fontFamily: PIX, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", opacity: P(f, T.semanal + i * 2, T.semanal + 6 + i * 2) }}>{d}</div>)}
            <div style={{ fontSize: 46, marginLeft: 16, color: PAL.cyan, opacity: P(f, T.semanal + 14, T.semanal + 24) }}>1x por semana</div>
          </div>
        )}
      </div>
    );
  }}</Cena>
);

export const CenaMecanismo: React.FC = () => (
  <Cena i={1}>{(f) => {
    const rows: [number, string, string, [number, string, string][]][] = [
      [T.pancreas, "🩸", "PÂNCREAS", [[T.pancreas + 20, "insulina ↑ só com glicose alta", PAL.green], [T.glucagon, "glucagon ↓", PAL.amber]]],
      [T.estomago, "🍽️", "ESTÔMAGO", [[T.estomago + 15, "a comida sai mais devagar", PAL.green]]],
      [T.cerebro, "🧠", "CÉREBRO", [[T.cerebro + 15, "fome ↓  vontade de comer ↓", PAL.green]]],
    ];
    return (
      <div style={{ padding: "26px 34px", display: "flex", flexDirection: "column", gap: 22 }}>
        {rows.map(([at, e, nome, linhas], i) => f < at ? <div key={i} style={{ height: 230 }} /> : (
          <div key={i} style={{ height: 230, border: `3px solid ${rgba(PAL.cyan, 0.6)}`, display: "flex", alignItems: "center", gap: 26, padding: "0 26px", opacity: it(f, at, at + 10, 0, 1, OUT), transform: `translateY(${(1 - it(f, at, at + 12, 0, 1, SNAP)) * 40}px)` }}>
            <span style={{ fontFamily: EMOJI, fontSize: 90 }}>{e}</span>
            <div>
              <div style={{ fontFamily: VT, fontSize: 58, lineHeight: "58px", color: PAL.cyan, letterSpacing: 2 }}>{nome}</div>
              {linhas.map(([t, s, c], j) => <Tipo key={j} f={f} at={t} text={s} cps={40} style={{ fontFamily: VT, fontSize: 48, color: c, marginTop: 10 }} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }}</Cena>
);

export const CenaStep: React.FC = () => (
  <Cena i={2}>{(f) => {
    const v = 14.9 * it(f, T.perda - 40, T.perda, 0, 1, OUT);
    const pulse = Math.max(0, 1 - Math.abs(f - T.perda - 5) / 6) * 0.08;
    return (
      <div style={{ padding: "26px 40px", fontFamily: VT, color: PAL.white }}>
        <Linha f={f} at={T.step}><div style={{ fontFamily: PIX, fontSize: 34, color: PAL.cyan }}>ESTUDO STEP 1</div></Linha>
        <Linha f={f} at={T.step + 10}><div style={{ fontSize: 40, color: PAL.dim, marginTop: 8 }}>2,4 mg por semana · 68 semanas · adultos com obesidade</div></Linha>
        {f >= T.perda - 40 && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 20 }}>
            <div style={{ fontFamily: PIX, fontSize: 104, color: PAL.green, textShadow: `0 0 24px ${PAL.green}`, transform: `scale(${1 + pulse})`, transformOrigin: "left center" }}>-{v.toFixed(1).replace(".", ",")}%</div>
            <div style={{ fontSize: 40, color: PAL.dim }}>peso médio<br />placebo: -2,4%</div>
          </div>
        )}
        {f >= T.metade - 20 && STEP1.map((b, i) => {
          const k = it(f, T.metade - 20 + i * 6, T.metade + 20 + i * 6, 0, 1, OUT);
          const hot = (i === 2 && f >= T.metade && f < T.terco) || (i === 3 && f >= T.terco);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18 }}>
              <div style={{ width: 150, fontSize: 44, color: hot ? PAL.amber : PAL.white }}>{b.faixa}</div>
              <div style={{ flex: 1, height: 52, border: `3px solid ${hot ? PAL.amber : PAL.cyanD}` }}>
                <div style={{ width: `${b.pct * k}%`, height: "100%", background: hot ? PAL.amber : PAL.cyan, boxShadow: hot ? `0 0 20px ${PAL.amber}` : "none" }} />
              </div>
              <div style={{ width: 110, fontSize: 44, color: hot ? PAL.amber : PAL.white, textAlign: "right" }}>{Math.round(b.pct * k)}%</div>
            </div>
          );
        })}
        {f >= T.metade && <div style={{ fontSize: 38, color: PAL.amber, marginTop: 14, opacity: P(f, T.metade, T.metade + 10) }}>{f < T.terco ? "▲ metade perdeu 15% ou mais" : "▲ 1 em cada 3 perdeu 20% ou mais"}</div>}
      </div>
    );
  }}</Cena>
);

export const CenaEfeitos: React.FC = () => (
  <Cena i={3}>{(f) => {
    const comuns: [string, string][] = [["🤢", "Náusea"], ["💧", "Diarreia"], ["🤮", "Vômito"], ["⏳", "Prisão de ventre"]];
    return (
      <div style={{ padding: "26px 40px", fontFamily: VT, color: PAL.white }}>
        <Linha f={f} at={T.efeitos}><div style={{ fontFamily: PIX, fontSize: 32, color: PAL.cyan }}>MAIS COMUNS</div></Linha>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 20 }}>
          {comuns.map(([e, n], i) => f < T.comuns[i] ? <div key={i} style={{ height: 130 }} /> : (
            <div key={i} style={{ height: 130, border: `3px solid ${PAL.cyan}`, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", transform: `scale(${0.8 + 0.2 * it(f, T.comuns[i], T.comuns[i] + 10, 0, 1, SNAP)})` }}>
              <span style={{ fontFamily: EMOJI, fontSize: 60 }}>{e}</span><span style={{ fontSize: 50 }}>{n}</span>
            </div>
          ))}
        </div>
        <Linha f={f} at={T.raros} style={{ marginTop: 40 }}>
          <div style={{ fontFamily: PIX, fontSize: 32, color: PAL.amber }}>MAIS RAROS</div>
          <div style={{ display: "flex", gap: 18, marginTop: 20 }}>
            {["Pedra na vesícula", "Pancreatite"].map((n, i) => <div key={i} style={{ flex: 1, height: 120, border: `3px solid ${PAL.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: PAL.amber, opacity: P(f, T.raros + i * 12, T.raros + 10 + i * 12) }}>⚠ {n}</div>)}
          </div>
        </Linha>
      </div>
    );
  }}</Cena>
);

export const CenaOff: React.FC = () => (
  <Cena i={4}>{(f) => {
    const card = (at: number, titulo: string, sub: string, cor: string) => f < at ? null : (
      <div style={{ border: `3px solid ${cor}`, padding: "18px 24px", marginTop: 20, opacity: it(f, at, at + 10, 0, 1, OUT), transform: `translateX(${(1 - it(f, at, at + 12, 0, 1, SNAP)) * -40}px)` }}>
        <div style={{ fontSize: 50, color: PAL.white }}>{titulo}</div>
        <div style={{ fontSize: 36, color: cor, marginTop: 6 }}>{sub}</div>
      </div>
    );
    return (
      <div style={{ padding: "26px 40px", fontFamily: VT }}>
        <Linha f={f} at={T.offlabel}><div style={{ fontFamily: PIX, fontSize: 34, color: PAL.cyan }}>USOS OFF-LABEL</div><div style={{ fontSize: 38, color: PAL.dim, marginTop: 6 }}>= fora da bula</div></Linha>
        {card(T.ozempic, "Ozempic só para emagrecer, sem diabetes", "na obesidade, a versão aprovada é o Wegovy", PAL.amber)}
        {card(T.sop, "Síndrome dos ovários policísticos (SOP)", "uso fora da bula", PAL.cyan)}
        {card(T.prediab, "Pré-diabetes", "uso fora da bula", PAL.cyan)}
        {f >= T.indicacao && <div style={{ marginTop: 26, padding: "16px 0", textAlign: "center", border: `3px solid ${PAL.red}`, background: rgba(PAL.red, 0.12), fontFamily: VT, fontSize: 52, color: PAL.red, letterSpacing: 2, opacity: P(f, T.indicacao, T.indicacao + 8) }}>⚠ SÓ COM INDICAÇÃO MÉDICA</div>}
      </div>
    );
  }}</Cena>
);

export const CenaAviso: React.FC = () => (
  <Cena i={5}>{(f) => {
    const k = it(f, T.parar, T.cresce + 50, 0, 1, LIN);
    const pts = Array.from({ length: 41 }, (_, i) => {
      const u = i / 40; const y = u < 0.55 ? 1 - 0.85 * Math.sin((u / 0.55) * Math.PI / 2) : 0.15 + 0.55 * Math.sin(((u - 0.55) / 0.45) * Math.PI / 2);
      return [60 + u * 820, 120 + y * 420];
    }).filter((_, i) => i / 40 <= k);
    return (
      <div style={{ padding: "26px 40px", fontFamily: VT, color: PAL.white }}>
        <Linha f={f} at={T.parar}><div style={{ fontFamily: PIX, fontSize: 32, color: PAL.amber }}>E SE PARAR?</div></Linha>
        <svg width={920} height={600} style={{ marginTop: 10 }}>
          <line x1={60} y1={560} x2={900} y2={560} stroke={PAL.cyanD} strokeWidth={3} />
          <line x1={60} y1={100} x2={60} y2={560} stroke={PAL.cyanD} strokeWidth={3} />
          <line x1={511} y1={100} x2={511} y2={560} stroke={PAL.red} strokeWidth={3} strokeDasharray="10 8" opacity={P(f, T.cresce - 20, T.cresce)} />
          <text x={520} y={130} fill={PAL.red} fontFamily="'VTThreeTwoThree'" fontSize={38} opacity={P(f, T.cresce - 20, T.cresce)}>parou o remédio</text>
          <polyline points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={PAL.cyan} strokeWidth={8} strokeLinejoin="miter" />
          <text x={80} y={600} fill={PAL.dim} fontFamily="'VTThreeTwoThree'" fontSize={34}>peso ao longo do tempo</text>
        </svg>
        <Linha f={f} at={T.cresce}><div style={{ fontSize: 50, color: PAL.amber }}>parte do peso costuma voltar</div></Linha>
      </div>
    );
  }}</Cena>
);

// ---------- final ----------
export const Final: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.consulte + 6) return null;
  const k = it(f, T.consulte + 6, T.consulte + 20, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: 70, top: 1140, width: 940, height: 330, border: `3px solid ${PAL.cyan}`, background: "rgba(2,11,20,0.92)", boxShadow: `0 0 30px ${rgba(PAL.cyan, 0.5)}`, padding: "26px 34px", boxSizing: "border-box", opacity: Math.min(1, k * 1.4), transform: `scale(${0.9 + 0.1 * k})` }}>
      <Tipo f={f} at={T.consulte + 8} text="C:\> consulte_um_profissional.exe" cps={34} style={{ fontFamily: VT, fontSize: 44, color: PAL.dim }} />
      <div style={{ fontFamily: VT, fontSize: 84, lineHeight: "80px", color: PAL.cyan, marginTop: 18, letterSpacing: 2, textShadow: `0 0 14px ${PAL.cyan}`, opacity: P(f, T.consulte + 40, T.consulte + 52) }}>CONSULTE UM<br />PROFISSIONAL DE SAÚDE!</div>
    </div>
  );
};
