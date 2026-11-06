import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { OUT, P, SNAP, it, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { SANS, SERIF } from "../fonts";
import { Carimbo, Chip, Fundo, N, Painel, Sel, Titulo, VT } from "../semaModelos/Painel3D";
import { Objeto3D, Tipo3D } from "../semaModelos/Objetos3D";
import palavras from "../../audio/mounjaroLotes_palavras.json";

// Notícias da Farmácia #4: Anvisa proíbe lotes falsificados de Mounjaro (06/11/2026), no Modelo 9 (Painel 3D).
// Caneta genérica em 3D, sem logo nem cores da marca. Os lotes aparecem escritos na hora em que são falados.
const W = 1080;
const s = (x: number) => Math.round(x * 30);
// marcos da narração (segundos -> quadros), tirados de audio/mounjaroLotes_palavras.json
const T = {
  falsif: s(2.86),
  lista: s(5.54),
  apreender: s(11.44),
  cinco: s(12.06),
  l1: s(13.18),
  l1a: s(16.43),
  l1b: s(20.1),
  l2: s(20.24),
  l2a: s(22.68),
  l2b: s(24.8),
  l3: s(24.9),
  l3a: s(27.48),
  l3b: s(30.1),
  l4a: s(30.31),
  l4b: s(32.9),
  l5a: s(33.06),
  l5b: s(35.6),
  reconhecidos: s(37.58),
  rotulo: s(39.63),
  venda: s(41.52),
  distrib: s(42.03),
  uso: s(43.28),
  proibidos: s(44.15),
  atencao: s(45.32),
  so: s(48.87),
  dose: s(52.61),
  nenhum: s(53.62),
  dentro: s(56.03),
  farmacia: s(59.79),
  receita: s(60.72),
  nota: s(60.95),
  preco: s(62.48),
  redes: s(64.87),
  naoUse: s(69.09),
  fabricante: s(71.06),
  anvisa: s(72.79),
  comenta: s(77.26),
  siga: s(80.87),
  final: s(85.4),
};
export const DURATION = s(88.6);
const PARTES: [number, number][] = [
  [0, s(8.0)],
  [s(8.0), s(13.0)],
  [s(13.0), s(35.7)],
  [s(35.7), s(45.2)],
  [s(45.2), s(50.5)],
  [s(50.5), s(57.8)],
  [s(57.8), s(66.4)],
  [s(66.4), s(73.3)],
  [s(73.3), s(80.7)],
  [s(80.7), T.final],
  [T.final, DURATION],
];
const R = (i: number) => PARTES[i];
const ativa = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];

const Moldura: React.FC<{ f: number; i: number; rotulo: string; tag: string }> = ({ f, i, rotulo, tag }) => {
  if (!ativa(f, i)) return null;
  const k = it(f, R(i)[0], R(i)[0] + 12, 0, 1, OUT);
  const seg = Math.floor((f - R(i)[0]) / 30);
  const canto = (x: number, y: number, rx: number, ry: number) => (
    <path d={`M ${x} ${y + 40 * ry} L ${x} ${y} L ${x + 40 * rx} ${y}`} stroke={rgba(N.verm, 0.7)} strokeWidth={4} fill="none" />
  );
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {canto(40, 150, 1, 1)}
        {canto(1040, 150, -1, 1)}
        {canto(40, 1030, 1, -1)}
        {canto(1040, 1030, -1, -1)}
      </svg>
      <div style={{ position: "absolute", left: 70, top: 170, display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ fontFamily: VT, fontSize: 30, color: N.verm, border: `2px solid ${rgba(N.verm, 0.6)}`, padding: "2px 12px", opacity: f % 30 < 20 ? 1 : 0.4 }}>
          ● 00:{String(seg).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: N.txt }}>{rotulo}</span>
      </div>
      <div style={{ position: "absolute", right: 70, top: 176, fontFamily: VT, fontSize: 28, color: N.cinza }}>{tag}</div>
    </AbsoluteFill>
  );
};
const Cena3D: React.FC<{ f: number; i: number; tipo: Tipo3D; top?: number; h?: number; zoom?: number }> = ({ f, i, tipo, top = 140, h = 900, zoom = 1 }) => (
  <Sequence from={R(i)[0]} durationInFrames={R(i)[1] - R(i)[0]} layout="none">
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: W,
        height: h,
        opacity: Math.min(P(f, R(i)[0], R(i)[0] + 10), 1 - P(f, R(i)[1] - 8, R(i)[1])),
      }}
    >
      <Objeto3D f={f} ini={R(i)[0]} tipo={tipo} h={h} zoom={zoom} />
    </div>
  </Sequence>
);

// ---------- legenda ----------
type Pw = { text: string; start: number; end: number };
const PAL = (palavras as { words: Pw[] }).words;
const CHAVE = new Set(
  "alerta anvisa falsificados falsificada mounjaro tirzepatida lista apreender lotes fabricante rótulo padrão proibidos proibido falsos dose nenhum farmácia receita nota fiscal desconfie redes use comenta".split(" "),
);
const norm = (x: string) => x.toLowerCase().replace(/[^\wà-ú-]/g, "");
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
  // na cena dos lotes a própria tela mostra os números; na saída, o "Me siga" tem o próprio texto
  if (ativa(f, 2) || f >= T.siga - 4) return null;
  const g = GRUPOS.find((gr, i) => t >= gr[0].start - 0.05 && (i === GRUPOS.length - 1 || t < GRUPOS[i + 1][0].start - 0.05));
  if (!g || t > g[g.length - 1].end + 0.5) return null;
  return (
    <div style={{ position: "absolute", top: 1120, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 62, color: "#f2f2f2", lineHeight: 1.3 }}>
      {g.map((w, i) => {
        const txt = w.text.replace(/[.,:;!?]+$/, "");
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

// ---------- lote sendo "digitado" na tela enquanto é falado ----------
const Lote: React.FC<{ f: number; cod: string; a: number; b: number; size?: number }> = ({ f, cod, a, b, size = 84 }) => {
  if (f < a - 4) return <div style={{ height: size * 1.15 }} />;
  const n = Math.round(it(f, a, b, 1, cod.length));
  const falando = f < b + 6;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, height: size * 1.15 }}>
      <span style={{ fontFamily: VT, fontSize: size, letterSpacing: 6, color: falando ? N.ambar : N.txt, textShadow: falando ? `0 0 20px ${rgba(N.ambar, 0.6)}` : "none" }}>
        {cod.slice(0, n)}
        {falando && f % 16 < 9 ? "▌" : ""}
      </span>
      {!falando && (
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 28, color: N.verm, border: `3px solid ${N.verm}`, borderRadius: 8, padding: "2px 10px", transform: `scale(${it(f, b + 6, b + 14, 1.5, 1, OUT)})` }}>
          FALSO
        </span>
      )}
    </div>
  );
};
const Cartao: React.FC<{ f: number; at: number; fim: number; y: number; h: number; dose: string; children: React.ReactNode }> = ({ f, at, fim, y, h, dose, children }) => {
  const atual = f >= at && f < fim;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: y,
        width: 940,
        height: h,
        borderRadius: 22,
        background: N.painel,
        border: `3px solid ${atual ? N.ambar : f >= fim ? rgba(N.verm, 0.6) : "#23282f"}`,
        boxShadow: atual ? `0 0 30px ${rgba(N.ambar, 0.35)}` : "inset 0 0 40px rgba(0,0,0,0.6)",
        opacity: P(f, at - 8, at + 4),
        transform: `translateY(${it(f, at - 8, at + 8, 40, 0, OUT)}px)`,
        padding: "18px 34px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: N.cinza }}>
        <span>
          dose <span style={{ color: N.txt }}>{dose}</span>
        </span>
        <span style={{ fontFamily: VT, fontSize: 30 }}>LOTE</span>
      </div>
      {children}
    </div>
  );
};

// ---------- linha de checklist ----------
const Linha: React.FC<{ f: number; at: number; ok: boolean; y: number; children: React.ReactNode }> = ({ f, at, ok, y, children }) =>
  f < at ? null : (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: y,
        width: 840,
        display: "flex",
        alignItems: "center",
        gap: 26,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 52,
        color: ok ? N.txt : rgba(N.txt, 0.75),
        opacity: P(f, at, at + 8),
        transform: `translateX(${it(f, at, at + 10, -40, 0, OUT)}px)`,
      }}
    >
      <span
        style={{
          width: 78,
          height: 78,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: 900,
          color: "#050607",
          background: ok ? N.neon : N.verm,
          transform: `scale(${it(f, at + 2, at + 12, 0.4, 1, SNAP)})`,
        }}
      >
        {ok ? "✓" : "✕"}
      </span>
      <span style={{ textDecoration: ok ? "none" : "line-through", textDecorationColor: N.verm }}>{children}</span>
    </div>
  );

// ---------- cenas ----------
const Cenas: React.FC<{ f: number }> = ({ f }) => (
  <>
    {/* 0. gancho: caneta genérica com luz de alerta */}
    <Cena3D f={f} i={0} tipo="falsa" />
    <Moldura f={f} i={0} rotulo="Alerta Anvisa" tag="06/11/2026" />
    {ativa(f, 0) && (
      <>
        <Chip f={f} at={4} cor={N.verm} y={240} centro>
          ⚠️ ALERTA · NOTÍCIAS DA FARMÁCIA #4
        </Chip>
        <Carimbo f={f} at={T.falsif} texto="FALSIFICADO" cor={N.verm} x={540} y={800} size={84} />
        <Chip f={f} at={T.lista} cor={N.ambar} y={930} centro>
          🔎 confere se o seu está na lista
        </Chip>
      </>
    )}

    {/* 1. data e apreensão */}
    <Moldura f={f} i={1} rotulo="Anvisa · apreensão" tag="sexta-feira" />
    {ativa(f, 1) && (
      <>
        <div
          style={{
            position: "absolute",
            left: 540 - 190,
            top: 290,
            width: 380,
            height: 400,
            borderRadius: 28,
            overflow: "hidden",
            background: "#f2f2f2",
            boxShadow: `0 0 50px ${rgba(N.verm, 0.35)}`,
            transform: `scale(${it(f, R(1)[0], R(1)[0] + 14, 0.6, 1, SNAP)}) rotate(-3deg)`,
          }}
        >
          <div style={{ height: 110, background: N.verm, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 4 }}>
            NOV 2026
          </div>
          <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 210, lineHeight: 1.1, color: "#111" }}>6</div>
          <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: "#555" }}>sexta-feira</div>
        </div>
        <Carimbo f={f} at={T.apreender} texto="APREENSÃO" cor={N.verm} x={540} y={800} size={78} />
        <Chip f={f} at={T.cinco} cor={N.ambar} y={920} centro>
          📦 5 lotes falsificados
        </Chip>
      </>
    )}

    {/* 2. os lotes, escritos na hora em que são falados */}
    <Moldura f={f} i={2} rotulo="Lotes proibidos" tag="confira a caixa" />
    {ativa(f, 2) && (
      <>
        <Titulo f={f} at={R(2)[0] + 2} y={240} size={66}>
          Confira o lote da sua caneta
        </Titulo>
        <Cartao f={f} at={T.l1} fim={T.l2} y={360} h={220} dose="2,5 mg">
          <Lote f={f} cod="KUSTR43969410" a={T.l1a} b={T.l1b} size={80} />
        </Cartao>
        <Cartao f={f} at={T.l2} fim={T.l3} y={610} h={220} dose="5 mg">
          <Lote f={f} cod="B55010" a={T.l2a} b={T.l2b} />
        </Cartao>
        <Cartao f={f} at={T.l3} fim={R(2)[1]} y={860} h={420} dose="15 mg">
          <Lote f={f} cod="D810042" a={T.l3a} b={T.l3b} />
          <Lote f={f} cod="D838889" a={T.l4a} b={T.l4b} />
          <Lote f={f} cod="2138737" a={T.l5a} b={T.l5b} />
        </Cartao>
        <div style={{ position: "absolute", top: 1310, width: W, textAlign: "center", fontFamily: VT, fontSize: 32, color: N.cinza, opacity: P(f, T.l3, T.l3 + 10) }}>
          fonte: Anvisa · 06/11/2026
        </div>
      </>
    )}

    {/* 3. o motivo */}
    <Moldura f={f} i={3} rotulo="Por que foram proibidos" tag="rótulo × padrão" />
    {ativa(f, 3) && (
      <>
        <Painel x={240} y={260} w={600} h={380} o={P(f, R(3)[0], R(3)[0] + 10)}>
          <div style={{ padding: "34px 40px", fontFamily: VT, fontSize: 40, color: N.txt, lineHeight: 1.6 }}>
            <div style={{ height: 22, width: 360, background: "#2a3038", borderRadius: 6, marginBottom: 24 }} />
            <div style={{ height: 22, width: 460, background: "#2a3038", borderRadius: 6, marginBottom: 30 }} />
            <div>
              LOTE: <span style={{ color: f >= T.reconhecidos ? N.verm : N.txt }}>??????</span>
            </div>
            <div>
              VAL.: <span style={{ color: N.cinza }}>--/----</span>
            </div>
          </div>
        </Painel>
        {/* lupa passando sobre o rótulo */}
        <svg width={W} height={1920} style={{ position: "absolute", opacity: P(f, R(3)[0] + 6, R(3)[0] + 16) }}>
          {(() => {
            const cx = 420 + 220 * Math.sin((f - R(3)[0]) / 30);
            const cy = 470 + 40 * Math.cos((f - R(3)[0]) / 22);
            return (
              <g>
                <circle cx={cx} cy={cy} r={90} fill={rgba("#ffffff", 0.06)} stroke={N.txt} strokeWidth={10} />
                <line x1={cx + 64} y1={cy + 64} x2={cx + 150} y2={cy + 150} stroke={N.txt} strokeWidth={22} strokeLinecap="round" />
              </g>
            );
          })()}
        </svg>
        <Chip f={f} at={T.reconhecidos} cor={N.verm} y={690} centro>
          ✕ lote não reconhecido pela fabricante
        </Chip>
        <Chip f={f} at={T.rotulo} cor={N.verm} y={770} centro>
          ✕ rótulo fora do padrão
        </Chip>
        <Chip f={f} at={T.venda} cor={N.cinza} x={140} y={860}>
          🚫 venda
        </Chip>
        <Chip f={f} at={T.distrib} cor={N.cinza} x={360} y={860}>
          🚫 distribuição
        </Chip>
        <Chip f={f} at={T.uso} cor={N.cinza} x={740} y={860}>
          🚫 uso
        </Chip>
        <Carimbo f={f} at={T.proibidos} texto="PROIBIDOS" cor={N.verm} x={540} y={1000} size={76} />
      </>
    )}

    {/* 4. não é o remédio todo */}
    <Cena3D f={f} i={4} tipo="real" />
    <Moldura f={f} i={4} rotulo="Atenção" tag="não é tudo" />
    {ativa(f, 4) && (
      <>
        <Titulo f={f} at={T.atencao} y={240} size={64}>
          Não é o remédio todo
        </Titulo>
        <Chip f={f} at={T.so} cor={N.neon} y={930} centro>
          ✅ só esses 5 lotes falsos
        </Chip>
      </>
    )}

    {/* 5. o risco */}
    <Cena3D f={f} i={5} tipo="vazia" />
    <Moldura f={f} i={5} rotulo="O risco" tag="conteúdo desconhecido" />
    {ativa(f, 5) && (
      <>
        <div
          style={{
            position: "absolute",
            top: 330,
            width: W,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 300,
            color: N.ambar,
            opacity: P(f, T.dentro - 12, T.dentro) * (0.75 + 0.25 * Math.sin(f / 6)),
            textShadow: `0 0 50px ${rgba(N.ambar, 0.7)}`,
          }}
        >
          ?
        </div>
        <Chip f={f} at={T.dose} cor={N.ambar} y={850} centro>
          ⚠️ dose errada
        </Chip>
        <Chip f={f} at={T.nenhum} cor={N.verm} y={930} centro>
          ⚠️ ou nenhum remédio
        </Chip>
      </>
    )}

    {/* 6. como se proteger */}
    <Moldura f={f} i={6} rotulo="Como se proteger" tag="checklist" />
    {ativa(f, 6) && (
      <>
        <Titulo f={f} at={R(6)[0] + 2} y={240} size={70}>
          Compre com segurança
        </Titulo>
        <Linha f={f} at={T.farmacia} ok y={400}>
          Só em farmácia
        </Linha>
        <Linha f={f} at={T.receita} ok y={510}>
          Com receita
        </Linha>
        <Linha f={f} at={T.nota} ok y={620}>
          Com nota fiscal
        </Linha>
        <Linha f={f} at={T.preco} ok={false} y={760}>
          Preço baixo demais
        </Linha>
        <Linha f={f} at={T.redes} ok={false} y={870}>
          Venda em rede social
        </Linha>
      </>
    )}

    {/* 7. se o lote está na lista */}
    <Moldura f={f} i={7} rotulo="Se o seu lote está na lista" tag="o que fazer" />
    {ativa(f, 7) && (
      <>
        <Titulo f={f} at={R(7)[0] + 2} y={240} size={66}>
          O seu lote está na lista?
        </Titulo>
        <Carimbo f={f} at={T.naoUse} texto="NÃO USE" cor={N.verm} x={540} y={520} size={130} />
        <Chip f={f} at={T.fabricante} cor={N.azul} y={740} centro>
          📞 fale com a fabricante
        </Chip>
        <Chip f={f} at={T.anvisa} cor={N.azul} y={830} centro>
          🏛️ e com a Anvisa
        </Chip>
      </>
    )}

    {/* 8. pergunta para os comentários */}
    <Cena3D f={f} i={8} tipo="falsa" top={350} h={420} zoom={1.15} />
    <Moldura f={f} i={8} rotulo="Enquete" tag="comenta aí 👇" />
    {ativa(f, 8) && (
      <>
        <Titulo f={f} at={R(8)[0] + 4} y={230} size={58}>
          Já viu caneta sendo vendida
          <br />
          fora da farmácia?
        </Titulo>
        {(
          [
            ["👀 JÁ VI", N.ambar, T.comenta + 20, 120],
            ["🙅 NUNCA VI", N.azul, T.comenta + 34, 580],
          ] as [string, string, number, number][]
        ).map(([t, cor, at, x]) => (
          <Painel key={t} x={x} y={820} w={380} h={170} o={P(f, at - 6, at + 6)}>
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 50, color: cor }}>{t}</div>
          </Painel>
        ))}
        <Carimbo f={f} at={T.comenta} texto="COMENTA AÍ!" cor={N.ambar} x={540} y={720} size={56} />
      </>
    )}

    {/* 9. me siga, com a foto do perfil */}
    {ativa(f, 9) && (
      <>
        <Img
          src={staticFile("mounjaroLotes/logo.jpg")}
          style={{
            position: "absolute",
            left: 540 - 160,
            top: 210,
            width: 320,
            height: 320,
            borderRadius: 160,
            border: `5px solid ${N.neon}`,
            boxShadow: `0 0 40px ${rgba(N.neon, 0.6)}`,
            opacity: P(f, T.siga - 4, T.siga + 8),
            transform: `scale(${0.7 + 0.3 * it(f, T.siga - 4, T.siga + 12, 0, 1, SNAP)})`,
          }}
        />
        <Titulo f={f} at={T.siga} y={560} size={110}>
          Me siga
        </Titulo>
        <div style={{ position: "absolute", top: 720, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: N.cinza, opacity: P(f, T.siga + 10, T.siga + 22) }}>
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área <span style={{ fontFamily: EMOJI }}>💊</span>
        </div>
      </>
    )}
    {/* 10. tela final */}
    {f >= R(10)[0] && (
      <div style={{ position: "absolute", top: 760, left: 80, width: 920, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 70, lineHeight: 1.35, color: "#f2f2f2", opacity: it(f, T.final, T.final + 14, 0, 1, OUT) }}>
        Consulte um <Sel>profissional de saúde</Sel> para orientações.
      </div>
    )}
  </>
);

const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(([de]) => [de, "whoosh", 0.2] as [number, string, number]),
  [T.falsif, "trava", 0.28],
  [T.apreender, "trava", 0.26],
  [T.l1b + 6, "plim", 0.2],
  [T.l2b + 6, "plim", 0.2],
  [T.l3b + 6, "plim", 0.2],
  [T.l4b + 6, "plim", 0.2],
  [T.l5b + 6, "plim", 0.2],
  [T.proibidos, "trava", 0.28],
  [T.naoUse, "trava", 0.3],
  [T.comenta, "plim", 0.24],
  [T.final, "plim", 0.28],
];

export const VideoMounjaroLotes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Cenas f={f} />
      <Legenda f={f} />
      <Audio src={staticFile("mounjaroLotes/narracao.mp3")} />
      <Audio src={staticFile("mounjaroLotes/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa no Modelo 9 (serve em 1080×1920 e em 3:4, 1080×1440): tudo entre y≈90 e 1380,
// então os 20% de baixo ficam livres no TikTok e nada é cortado no 3:4. Caneta genérica, sem marca.
export const CapaMounjaroLotes: React.FC = () => {
  const canto = (x: number, y: number, rx: number, ry: number) => (
    <path d={`M ${x} ${y + 50 * ry} L ${x} ${y} L ${x + 50 * rx} ${y}`} stroke={rgba(N.verm, 0.85)} strokeWidth={5} fill="none" />
  );
  return (
    <AbsoluteFill>
      <Fundo f={0} />
      <svg width={W} height={1440} style={{ position: "absolute" }}>
        {canto(40, 90, 1, 1)}
        {canto(1040, 90, -1, 1)}
        {canto(40, 1380, 1, -1)}
        {canto(1040, 1380, -1, -1)}
      </svg>
      <div style={{ position: "absolute", top: 130, width: W, display: "flex", justifyContent: "center" }}>
        <span style={{ fontFamily: VT, fontSize: 40, color: N.verm, border: `3px solid ${rgba(N.verm, 0.7)}`, padding: "4px 20px", boxShadow: `0 0 20px ${rgba(N.verm, 0.4)}` }}>● NOTÍCIAS DA FARMÁCIA #4</span>
      </div>
      <div style={{ position: "absolute", top: 220, width: W, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 130, lineHeight: 1, color: N.txt, textShadow: `0 0 40px ${rgba(N.verm, 0.4)}` }}>Mounjaro</div>
      <div style={{ position: "absolute", top: 370, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 104, lineHeight: 1, color: N.verm, letterSpacing: 2, textShadow: `0 0 36px ${rgba(N.verm, 0.7)}` }}>LOTES FALSOS</div>
      <div style={{ position: "absolute", left: 0, top: 480, width: W, height: 660 }}>
        <Objeto3D f={40} ini={0} tipo="falsa" h={660} zoom={1.1} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 1180, transform: "translate(-50%,-50%) rotate(-6deg)", fontFamily: SANS, fontWeight: 900, fontSize: 62, letterSpacing: 4, color: N.verm, border: `7px solid ${N.verm}`, borderRadius: 12, padding: "6px 28px", whiteSpace: "nowrap", background: "rgba(0,0,0,0.6)", textShadow: `0 0 18px ${N.verm}`, boxShadow: `0 0 30px ${rgba(N.verm, 0.5)}` }}>
        PROIBIDOS PELA ANVISA
      </div>
      <div style={{ position: "absolute", top: 1275, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 56, color: "#f2f2f2" }}>
        confira o <Sel>seu lote</Sel>
      </div>
    </AbsoluteFill>
  );
};
