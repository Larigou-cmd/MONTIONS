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
import { Objeto3D, Tipo3D } from "./Objetos3D";
import palavras from "../../audio/semaComprimido_palavras.json";

// Versão "painel 3D" do Notícias da Farmácia #3 (semaglutida em comprimido), no clima das referências do
// jato e do Claude/YouTube: cenas em 3D feitas em código (sem imagens geradas) alternando com instrumentos
// de cabine (cronômetro, altímetro, rádio, radar) e legenda curta com a palavra-chave na caixa azul.

export { DURATION };
const W = 1080;
const VT = "'VTThreeTwoThree', monospace";
const N = { neon: "#22c55e", ambar: "#f59e0b", verm: "#ef4444", azul: "#60a5fa", sel: "#3b82f6", txt: "#e9edf2", cinza: "#7d8590", painel: "#0f1216" };
const R = (i: number) => PARTES[i];
const ativa = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];

// ---------- fundo ----------
const Fundo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 1100px 900px at 50% 35%, #0e1a14 0%, #050607 70%)" }}>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 19 }, (_, i) => (
        <line key={`v${i}`} x1={540} y1={1040} x2={-900 + i * 160} y2={1920} stroke="#ffffff" strokeOpacity={0.07} strokeWidth={2} />
      ))}
      {Array.from({ length: 10 }, (_, i) => {
        const t = ((i + ((f / 90) % 1)) / 10) ** 2;
        return <line key={`h${i}`} x1={0} y1={1040 + t * 880} x2={W} y2={1040 + t * 880} stroke="#ffffff" strokeOpacity={0.02 + 0.08 * t} strokeWidth={2} />;
      })}
      {Array.from({ length: 50 }, (_, i) => {
        const y = (((random(`y${i}`) * 1920 - f * (0.2 + random(`s${i}`) * 0.5)) % 1920) + 1920) % 1920;
        return <circle key={`p${i}`} cx={random(`x${i}`) * W} cy={y} r={1 + random(`r${i}`) * 1.5} fill="#fff" opacity={0.07} />;
      })}
    </svg>
  </AbsoluteFill>
);

// ---------- moldura de cabine (cantos, rótulos e relógio da cena) ----------
const Moldura: React.FC<{ f: number; i: number; rotulo: string; tag: string }> = ({ f, i, rotulo, tag }) => {
  if (!ativa(f, i)) return null;
  const k = it(f, R(i)[0], R(i)[0] + 12, 0, 1, OUT);
  const s = Math.floor((f - R(i)[0]) / 30);
  const canto = (x: number, y: number, rx: number, ry: number) => <path d={`M ${x} ${y + 40 * ry} L ${x} ${y} L ${x + 40 * rx} ${y}`} stroke={rgba(N.neon, 0.7)} strokeWidth={4} fill="none" />;
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {canto(40, 150, 1, 1)}
        {canto(1040, 150, -1, 1)}
        {canto(40, 1030, 1, -1)}
        {canto(1040, 1030, -1, -1)}
      </svg>
      <div style={{ position: "absolute", left: 70, top: 170, display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ fontFamily: VT, fontSize: 30, color: N.neon, border: `2px solid ${rgba(N.neon, 0.6)}`, padding: "2px 12px" }}>00:{String(s).padStart(2, "0")}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: N.txt }}>{rotulo}</span>
      </div>
      <div style={{ position: "absolute", right: 70, top: 176, fontFamily: VT, fontSize: 28, color: N.cinza }}>{tag}</div>
    </AbsoluteFill>
  );
};
const Chip: React.FC<{ f: number; at: number; cor: string; children: React.ReactNode; x?: number; y: number; centro?: boolean }> = ({ f, at, cor, children, x = 70, y, centro }) =>
  f < at ? null : (
    <div style={{ position: "absolute", left: centro ? 0 : x, width: centro ? W : undefined, top: y, display: "flex", justifyContent: centro ? "center" : "flex-start" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 32,
          color: cor,
          background: rgba(cor, 0.12),
          border: `2px solid ${rgba(cor, 0.5)}`,
          borderRadius: 999,
          padding: "10px 22px",
          transform: `scale(${0.6 + 0.4 * it(f, at, at + 12, 0, 1, SNAP)})`,
          boxShadow: `0 0 20px ${rgba(cor, 0.25)}`,
        }}
      >
        {children}
      </span>
    </div>
  );
const Carimbo: React.FC<{ f: number; at: number; texto: string; cor: string; x: number; y: number; size?: number }> = ({ f, at, texto, cor, x, y, size = 64 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(-7deg) scale(${1.6 - 0.6 * k})`, opacity: k, fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 4, color: cor, border: `7px solid ${cor}`, borderRadius: 12, padding: "6px 26px", whiteSpace: "nowrap", background: "rgba(0,0,0,0.6)", textShadow: `0 0 18px ${cor}`, boxShadow: `0 0 30px ${rgba(cor, 0.5)}` }}>
      {texto}
    </div>
  );
};
const Titulo: React.FC<{ f: number; at: number; y: number; children: React.ReactNode; size?: number }> = ({ f, at, y, children, size = 76 }) => (
  <div style={{ position: "absolute", top: y, width: W, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: size, color: N.txt, opacity: P(f, at, at + 12), textShadow: `0 0 30px ${rgba(N.neon, 0.4)}` }}>{children}</div>
);
const Cena3D: React.FC<{ f: number; i: number; tipo: Tipo3D; marcos?: number[] }> = ({ f, i, tipo, marcos }) => (
  <Sequence from={R(i)[0]} durationInFrames={R(i)[1] - R(i)[0]} layout="none">
    <div style={{ position: "absolute", left: 0, top: 140, width: W, height: 900, opacity: Math.min(P(f, R(i)[0], R(i)[0] + 10), 1 - P(f, R(i)[1] - 8, R(i)[1])) }}>
      <Objeto3D f={f} ini={R(i)[0]} tipo={tipo} marcos={marcos} h={900} />
    </div>
  </Sequence>
);
const Painel: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; o?: number }> = ({ x, y, w, h, children, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, background: N.painel, border: "2px solid #23282f", boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)", opacity: o, overflow: "hidden" }}>{children}</div>
);

// ---------- instrumentos ----------
// régua de IMC com marcador
const ReguaIMC: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const v = it(f, at, at + 40, 0.15, 0.82, EASE);
  const zonas: [string, string][] = [
    ["normal", "#22c55e"],
    ["sobrepeso", "#f59e0b"],
    ["obesidade", "#ef4444"],
  ];
  return (
    <div style={{ position: "relative", width: 900, height: 160 }}>
      <div style={{ display: "flex", height: 60, borderRadius: 12, overflow: "hidden" }}>
        {zonas.map(([t, c]) => (
          <div key={t} style={{ flex: 1, background: rgba(c, 0.35), borderRight: "2px solid #0f1216", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: VT, fontSize: 32, color: N.txt }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: v * 900 - 3, top: -20, width: 6, height: 100, background: N.txt, boxShadow: `0 0 16px ${N.txt}` }} />
    </div>
  );
};
// cronômetro de cabine
const Cronometro: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const min = it(f, at, at + 80, 0, 30, (x) => x);
  const a = (min / 60) * 360 - 90;
  const r = 230;
  return (
    <svg width={560} height={660}>
      <circle cx={280} cy={280} r={r + 30} fill="#0b0d10" stroke="#2a2f37" strokeWidth={6} />
      {min > 0.05 && <path d={`M 280 280 L 280 ${280 - r} A ${r} ${r} 0 0 1 ${280 + r * Math.cos((a * Math.PI) / 180)} ${280 + r * Math.sin((a * Math.PI) / 180)} Z`} fill={rgba(N.neon, 0.18)} />}
      {Array.from({ length: 60 }, (_, j) => {
        const aa = (j * 6 * Math.PI) / 180 - Math.PI / 2;
        const L = j % 5 === 0 ? 26 : 12;
        return <line key={j} x1={280 + Math.cos(aa) * r} y1={280 + Math.sin(aa) * r} x2={280 + Math.cos(aa) * (r - L)} y2={280 + Math.sin(aa) * (r - L)} stroke={j % 5 === 0 ? N.txt : N.cinza} strokeWidth={j % 5 === 0 ? 4 : 2} />;
      })}
      {[0, 15, 30, 45].map((m) => {
        const aa = (m * 6 * Math.PI) / 180 - Math.PI / 2;
        return (
          <text key={m} x={280 + Math.cos(aa) * (r - 60)} y={280 + Math.sin(aa) * (r - 60) + 14} textAnchor="middle" fontFamily={VT} fontSize={40} fill={N.txt}>
            {m}
          </text>
        );
      })}
      <line x1={280} y1={280} x2={280 + Math.cos((a * Math.PI) / 180) * (r - 20)} y2={280 + Math.sin((a * Math.PI) / 180) * (r - 20)} stroke={N.neon} strokeWidth={8} strokeLinecap="round" />
      <circle cx={280} cy={280} r={16} fill={N.neon} />
      <text x={280} y={640} textAnchor="middle" fontFamily={VT} fontSize={64} fill={N.neon}>
        {String(Math.floor(min)).padStart(2, "0")}:00
      </text>
    </svg>
  );
};
// fita de "altitude" do peso descendo até -13,6%
const Altimetro: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const v = it(f, at - 40, at + 10, 0, 13.6, EASE);
  const px = 26;
  return (
    <div style={{ position: "relative", width: 960, height: 640 }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 260, height: 640, background: "#0b0d10", border: "2px solid #2a2f37", borderRadius: 12, overflow: "hidden" }}>
        {Array.from({ length: 41 }, (_, j) => {
          const val = j - 5;
          const y = 320 + (val - v) * px;
          return (
            <div key={j} style={{ position: "absolute", left: 0, top: y, width: 260, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: val % 5 === 0 ? 40 : 20, height: 3, background: N.cinza }} />
              {val % 5 === 0 && <span style={{ fontFamily: VT, fontSize: 34, color: N.cinza }}>-{val}%</span>}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: 290, width: 260, height: 60, border: `3px solid ${N.neon}`, background: rgba(N.neon, 0.12) }} />
      </div>
      <div style={{ position: "absolute", left: 330, top: 200 }}>
        <div style={{ fontFamily: VT, fontSize: 170, color: N.neon, lineHeight: 1, textShadow: `0 0 30px ${rgba(N.neon, 0.6)}` }}>-{v.toFixed(1).replace(".", ",")}%</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: N.txt, marginTop: 10 }}>do peso, em média</div>
        <div style={{ fontFamily: VT, fontSize: 30, color: N.cinza, marginTop: 6 }}>OASIS 4 · ~1 ano e 3 meses</div>
      </div>
    </div>
  );
};
// rádio com onda (efeitos colaterais diminuindo)
const Radio: React.FC<{ f: number; amp: number }> = ({ f, amp }) => (
  <svg width={900} height={220}>
    {Array.from({ length: 90 }, (_, j) => {
      const h = (8 + Math.abs(Math.sin(j * 0.7 + f / 3) * Math.sin(j * 0.13 + f / 11)) * 180) * amp + 4;
      return <rect key={j} x={j * 10} y={110 - h / 2} width={6} height={h} rx={3} fill={N.neon} opacity={0.85} />;
    })}
  </svg>
);
// radar com pontos acendendo
const Radar: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const a = (f * 4) % 360;
  return (
    <svg width={520} height={520}>
      {[240, 170, 100].map((r) => (
        <circle key={r} cx={260} cy={260} r={r} fill="none" stroke={rgba(N.neon, 0.3)} strokeWidth={3} />
      ))}
      <line x1={20} y1={260} x2={500} y2={260} stroke={rgba(N.neon, 0.2)} strokeWidth={2} />
      <line x1={260} y1={20} x2={260} y2={500} stroke={rgba(N.neon, 0.2)} strokeWidth={2} />
      <path d={`M 260 260 L ${260 + 240 * Math.cos((a * Math.PI) / 180)} ${260 + 240 * Math.sin((a * Math.PI) / 180)} A 240 240 0 0 0 ${260 + 240 * Math.cos(((a - 40) * Math.PI) / 180)} ${260 + 240 * Math.sin(((a - 40) * Math.PI) / 180)} Z`} fill={rgba(N.neon, 0.25)} />
      {Array.from({ length: 14 }, (_, j) => {
        const r = 40 + random(`rr${j}`) * 190;
        const aa = random(`ra${j}`) * Math.PI * 2;
        const k = P(f, at + j * 4, at + j * 4 + 8);
        return <circle key={j} cx={260 + r * Math.cos(aa)} cy={260 + r * Math.sin(aa)} r={8} fill={N.neon} opacity={k} />;
      })}
    </svg>
  );
};
// contador de placas
const Odometro: React.FC<{ f: number; de: number; ate: number; valores: string[] }> = ({ f, de, ate, valores }) => {
  const idx = Math.min(valores.length - 1, Math.floor(it(f, de, ate, 0, valores.length - 1, (x) => x) + 0.0001));
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {valores[idx].split("").map((ch, j) => (
        <span key={j} style={{ width: 60, height: 92, borderRadius: 10, background: "#1c1c1e", border: "3px solid #3a3a3c", color: "#f6e7c1", fontFamily: VT, fontSize: 78, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {ch}
        </span>
      ))}
    </div>
  );
};
// medidor semicircular
const Medidor: React.FC<{ v: number }> = ({ v }) => {
  const r = 130,
    cx = 150,
    cy = 160;
  const ang = -180 + 180 * v;
  return (
    <svg width={300} height={190}>
      {Array.from({ length: 30 }, (_, j) => {
        const a = ((-180 + j * 6.2) * Math.PI) / 180;
        return <line key={j} x1={cx + Math.cos(a) * (r - 26)} y1={cy + Math.sin(a) * (r - 26)} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={j < 10 ? N.verm : j < 20 ? N.ambar : N.neon} strokeWidth={7} />;
      })}
      <line x1={cx} y1={cy} x2={cx + Math.cos((ang * Math.PI) / 180) * (r - 36)} y2={cy + Math.sin((ang * Math.PI) / 180) * (r - 36)} stroke={N.txt} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={10} fill={N.txt} />
    </svg>
  );
};

// ---------- legenda (palavra-chave em itálico na caixa azul de seleção) ----------
const Sel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, padding: "0 8px", background: rgba(N.sel, 0.22), border: `2px solid ${rgba(N.sel, 0.9)}`, color: "#e8f0ff" }}>
    <span style={{ position: "absolute", left: -6, top: -6, width: 10, height: 10, borderRadius: 5, background: N.sel }} />
    <span style={{ position: "absolute", right: -6, bottom: -6, width: 10, height: 10, borderRadius: 5, background: N.sel }} />
    {children}
  </span>
);
type Pw = { text: string; start: number; end: number };
const PAL = (palavras as { words: Pw[] }).words;
const CHAVE = new Set(
  "anvisa comprimido semaglutida canetas opinião wegovy glp-1 obesidade diabetes receita hormônio intestino saciedade estômago fome caneta semana dia miligramas farmacêutica jejum água trinta absorvido efeito estudo treze peso enjoo vômito diarreia preso preço trimestre retenção internet desconfie falsificada rotina comenta".split(" "),
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
    <div style={{ position: "absolute", top: 1120, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 62, color: "#f2f2f2", lineHeight: 1.3 }}>
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

// ---------- cenas ----------
const Cenas: React.FC<{ f: number }> = ({ f }) => (
  <>
    {/* 0. abertura: a caneta sai e o comprimido entra (3D) */}
    <Cena3D f={f} i={0} tipo="abertura" marcos={[T.comprimido]} />
    <Moldura f={f} i={0} rotulo="Anvisa · aprovação" tag="04/11/2026" />
    {ativa(f, 0) && (
      <>
        <Carimbo f={f} at={T.comprimido + 24} texto="APROVADO" cor={N.neon} x={540} y={880} />
        <Chip f={f} at={T.fica} cor={N.ambar} y={960} centro>
          👀 fica até o final
        </Chip>
      </>
    )}

    {/* 1. cartela 3D */}
    <Cena3D f={f} i={1} tipo="cartela" marcos={[T.wegovy]} />
    <Moldura f={f} i={1} rotulo="Registro" tag="GLP-1 · nº 01" />
    {ativa(f, 1) && (
      <>
        <Titulo f={f} at={T.wegovy} y={240}>
          Wegovy comprimido
        </Titulo>
        <Chip f={f} at={T.primeiro} cor={N.neon} y={880} centro>
          🥇 1º GLP-1 em comprimido para obesidade
        </Chip>
        <Chip f={f} at={T.ja} cor={N.cinza} y={950} centro>
          já existia: oral para diabetes tipo 2
        </Chip>
      </>
    )}

    {/* 2. para quem: régua de IMC */}
    <Moldura f={f} i={2} rotulo="Indicação" tag="adultos" />
    {ativa(f, 2) && (
      <>
        <Titulo f={f} at={R(2)[0] + 4} y={260}>
          Para quem?
        </Titulo>
        <div style={{ position: "absolute", left: 90, top: 440, opacity: P(f, T.obesidade - 10, T.obesidade) }}>
          <ReguaIMC f={f} at={T.obesidade} />
        </div>
        <Chip f={f} at={T.sobrepeso} cor={N.ambar} y={640} centro>
          ou sobrepeso + doença ligada ao peso
        </Chip>
        <Chip f={f} at={T.sobrepeso + 50} cor={N.verm} y={720} centro>
          pressão alta · diabetes
        </Chip>
        <Carimbo f={f} at={T.receita} texto="SÓ COM RECEITA" cor={N.verm} x={540} y={900} size={56} />
      </>
    )}

    {/* 3. estômago 3D + medidores */}
    <Cena3D f={f} i={3} tipo="estomago" marcos={[T.estomago, T.imita]} />
    <Moldura f={f} i={3} rotulo="O que o GLP-1 faz" tag="hormônio do intestino" />
    {ativa(f, 3) && (
      <>
        <Chip f={f} at={T.imita} cor={N.neon} y={240} centro>
          🧬 imita o hormônio GLP-1
        </Chip>
        <Chip f={f} at={T.estomago} cor={N.azul} y={320} centro>
          🐢 estômago esvazia devagar
        </Chip>
        <Painel x={70} y={760} w={320} h={250} o={P(f, T.saciedade - 10, T.saciedade)}>
          <div style={{ textAlign: "center", fontFamily: VT, fontSize: 30, color: N.txt, marginTop: 10 }}>SACIEDADE</div>
          <div style={{ marginLeft: 10 }}>
            <Medidor v={it(f, T.saciedade, T.saciedade + 40, 0.15, 0.9, EASE)} />
          </div>
        </Painel>
        <Painel x={690} y={760} w={320} h={250} o={P(f, T.fome - 10, T.fome)}>
          <div style={{ textAlign: "center", fontFamily: VT, fontSize: 30, color: N.txt, marginTop: 10 }}>FOME</div>
          <div style={{ margin: "50px 30px 0", height: 30, borderRadius: 15, background: "#1f242b", overflow: "hidden" }}>
            <div style={{ width: `${it(f, T.fome, T.fome + 40, 0.9, 0.2, EASE) * 100}%`, height: "100%", background: N.ambar }} />
          </div>
          <div style={{ textAlign: "center", fontFamily: VT, fontSize: 34, color: N.ambar, marginTop: 30 }}>menos fome</div>
        </Painel>
      </>
    )}

    {/* 4. semana 3D + contador de dose */}
    <Cena3D f={f} i={4} tipo="semana" marcos={[T.caneta, T.comp]} />
    <Moldura f={f} i={4} rotulo="Uma semana de uso" tag="caneta × comprimido" />
    {ativa(f, 4) && (
      <>
        <Chip f={f} at={T.caneta} cor={N.verm} y={250} x={70}>
          💉 caneta: 1 por semana
        </Chip>
        <Chip f={f} at={T.comp} cor={N.azul} y={330} x={70}>
          💊 comprimido: 1 por dia
        </Chip>
        <Painel x={70} y={820} w={940} h={190} o={P(f, T.dose - 10, T.dose)}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%", padding: "0 30px" }}>
            <span style={{ fontFamily: VT, fontSize: 34, color: N.txt, width: 230 }}>DOSE SOBE AOS POUCOS</span>
            <Odometro f={f} de={T.dose} ate={T.d25 + 10} valores={["1,5", "4", "9", "25"]} />
            <span style={{ fontFamily: VT, fontSize: 50, color: "#f6e7c1" }}>mg</span>
          </div>
        </Painel>
      </>
    )}

    {/* 5. como tomar: cronômetro */}
    <Moldura f={f} i={5} rotulo="Como tomar" tag="dica de farmacêutica" />
    {ativa(f, 5) && (
      <>
        <Chip f={f} at={T.jejum} cor={N.ambar} y={250} x={70}>
          🌅 em jejum
        </Chip>
        <Chip f={f} at={T.agua} cor={N.azul} y={330} x={70}>
          💧 pouca água
        </Chip>
        <div style={{ position: "absolute", left: 260, top: 300, opacity: P(f, T.trinta - 10, T.trinta), transform: `scale(${0.9 + 0.1 * it(f, T.trinta - 10, T.trinta + 6, 0, 1, OUT)})` }}>
          <Cronometro f={f} at={T.trinta} />
        </div>
        <Carimbo f={f} at={T.quase} texto="SENÃO PERDE O EFEITO" cor={N.verm} x={540} y={1010} size={42} />
      </>
    )}

    {/* 6. resultado: altímetro */}
    <Moldura f={f} i={6} rotulo="Estudo principal" tag="OASIS 4 · 64 semanas" />
    {ativa(f, 6) && (
      <div style={{ position: "absolute", left: 60, top: 300, opacity: P(f, R(6)[0] + 4, R(6)[0] + 16) }}>
        <Altimetro f={f} at={T.treze} />
      </div>
    )}

    {/* 7. efeitos: rádio */}
    <Moldura f={f} i={7} rotulo="Efeitos mais comuns" tag="parecidos com a caneta" />
    {ativa(f, 7) && (
      <>
        <Painel x={70} y={260} w={940} h={300}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 28px", fontFamily: VT, fontSize: 32 }}>
            <span style={{ color: N.neon }}>● sintomas</span>
            <span style={{ color: N.cinza }}>{f >= T.comeco ? "diminuindo" : "no começo"}</span>
          </div>
          <div style={{ marginLeft: 20 }}>
            <Radio f={f} amp={it(f, T.comeco, T.comeco + 50, 1, 0.25, EASE) * P(f, T.enjoo - 10, T.enjoo)} />
          </div>
        </Painel>
        <div style={{ position: "absolute", left: 70, top: 610, display: "flex", flexWrap: "wrap", gap: 14, width: 940 }}>
          {(
            [
              ["🤢 enjoo", T.enjoo],
              ["🤮 vômito", T.vomito],
              ["🚽 diarreia", T.diarreia],
              ["🧱 intestino preso", T.intestino],
            ] as [string, number][]
          ).map(([t, at]) => (
            <span key={t} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: N.txt, background: "#161a20", border: "2px solid #2a2f37", borderRadius: 999, padding: "10px 22px", opacity: P(f, at, at + 8) }}>
              {t}
            </span>
          ))}
        </div>
        <Chip f={f} at={T.comeco} cor={N.neon} y={800} centro>
          📉 principalmente no começo
        </Chip>
      </>
    )}

    {/* 8. quando chega: radar */}
    <Moldura f={f} i={8} rotulo="Quando chega" tag="farmácias" />
    {ativa(f, 8) && (
      <>
        <div style={{ position: "absolute", left: 280, top: 240, opacity: P(f, R(8)[0] + 4, R(8)[0] + 16) }}>
          <Radar f={f} at={T.previsao} />
        </div>
        <Chip f={f} at={T.preco} cor={N.ambar} y={780} x={70}>
          💰 preço: ainda não definido
        </Chip>
        <Chip f={f} at={T.previsao} cor={N.neon} y={860} x={70}>
          🗓️ previsão: próximo trimestre
        </Chip>
        <Carimbo f={f} at={T.retencao} texto="RECEITA RETIDA" cor={N.verm} x={760} y={960} size={42} />
      </>
    )}

    {/* 9. alerta: caixa 3D */}
    <Cena3D f={f} i={9} tipo="caixa" />
    <Moldura f={f} i={9} rotulo="Compra pela internet" tag="anúncio suspeito" />
    {ativa(f, 9) && (
      <>
        <div style={{ position: "absolute", top: 240, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 96, color: N.verm, letterSpacing: 6, opacity: f >= T.internet ? (Math.floor(f / 8) % 2 ? 1 : 0.35) : 0, textShadow: `0 0 30px ${N.verm}` }}>ALERTA</div>
        <Carimbo f={f} at={T.desconfie} texto="DESCONFIE" cor={N.verm} x={540} y={640} size={90} />
        <Chip f={f} at={T.falsificada} cor={N.verm} y={900} centro>
          ⚠️ pode ser falsificada
        </Chip>
      </>
    )}

    {/* 10. enquete: caneta × comprimido em 3D */}
    <Cena3D f={f} i={10} tipo="duelo" />
    <Moldura f={f} i={10} rotulo="Enquete" tag="comenta aí 👇" />
    {ativa(f, 10) && (
      <>
        <Titulo f={f} at={R(10)[0] + 4} y={240} size={64}>
          Qual combina com você?
        </Titulo>
        {(
          [
            ["💉 CANETA", "1x por semana", N.verm, T.injecao, 0.52, 120],
            ["💊 COMPRIMIDO", "1x por dia, em jejum", N.azul, T.comp2, 0.48, 580],
          ] as [string, string, string, number, number, number][]
        ).map(([t, sub, cor, at, v, x]) => (
          <Painel key={t} x={x} y={800} w={400} h={200} o={P(f, at - 6, at + 6)}>
            <div style={{ position: "absolute", left: 0, bottom: 0, width: `${it(f, T.comenta, T.comenta + 60, 0, v, EASE) * 100}%`, height: 10, background: cor }} />
            <div style={{ padding: "26px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: cor }}>{t}</div>
            <div style={{ padding: "0 26px", fontFamily: VT, fontSize: 32, color: N.txt }}>{sub}</div>
          </Painel>
        ))}
        <Carimbo f={f} at={T.comenta} texto="COMENTA AÍ!" cor={N.ambar} x={540} y={720} size={52} />
      </>
    )}

    {/* 11 e 12 */}
    {ativa(f, 11) && (
      <>
        <Titulo f={f} at={T.siga} y={560} size={110}>
          Me siga
        </Titulo>
        <div style={{ position: "absolute", top: 720, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: N.cinza, opacity: P(f, T.siga + 10, T.siga + 22) }}>
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área <span style={{ fontFamily: EMOJI }}>💊</span>
        </div>
      </>
    )}
    {f >= R(12)[0] && (
      <div style={{ position: "absolute", top: 760, left: 80, width: 920, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 70, lineHeight: 1.35, color: "#f2f2f2", opacity: it(f, T.final, T.final + 14, 0, 1, OUT) }}>
        Consulte um <Sel>profissional de saúde</Sel> para orientações.
      </div>
    )}
  </>
);

const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(([de]) => [de, "whoosh", 0.2] as [number, string, number]),
  [T.comprimido + 24, "trava", 0.26],
  [T.receita, "trava", 0.24],
  [T.quase, "trava", 0.24],
  [T.treze, "plim", 0.24],
  [T.retencao, "trava", 0.24],
  [T.desconfie, "trava", 0.3],
  [T.comenta, "plim", 0.24],
  [T.final, "plim", 0.28],
];

export const VideoSemaPainel3D: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Cenas f={f} />
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
