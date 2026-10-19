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
import { SANS } from "../fonts";
import { Reporter } from "../noticias/Reporter";
import { DURATION, PARTES, T } from "./Video";
import boca from "./boca.json";
import palavras from "../../audio/noticiaBotox_palavras.json";

// "Notícias da Farmácia" #1 no estilo explicadora: fundo claro quadriculado, título pixel com palavra colorida,
// janelinhas de computador, legenda palavra por palavra e a repórter no canto de baixo falando.
// Mesma narração e mesmos tempos do vídeo noticiaBotox/Video.tsx.
const PIX = "'Press Start TwoP', monospace";
const VT = "'VTThreeTwoThree', monospace";
const K = {
  claro: "#e9ecf8",
  azul: "#2f5bff",
  tinta: "#16161a",
  laranja: "#ff7a1a",
  verde: "#16a34a",
  vermelho: "#e5383b",
  amarelo: "#ffd23f",
  branco: "#ffffff",
  cinza: "#6b6b73",
};
const R = (i: number) => PARTES[i];

// ---------- fundo claro quadriculado ----------
const Fundo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: K.claro }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(47,91,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(47,91,255,0.08) 2px, transparent 2px)",
        backgroundSize: "54px 54px",
        backgroundPosition: `0 ${(f * 0.5) % 54}px`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.05) 1.5px, transparent 1.5px)",
        backgroundSize: "7px 7px",
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(47,91,255,0.12)" }} />
  </AbsoluteFill>
);

// ---------- peças ----------
// A fonte pixel não tem maiúsculas acentuadas: desenha a letra sem acento e o acento em blocos por cima.
const ACENTOS: Record<string, [string, "agudo" | "til" | "circ"]> = {
  Á: ["A", "agudo"],
  É: ["E", "agudo"],
  Í: ["I", "agudo"],
  Ó: ["O", "agudo"],
  Ú: ["U", "agudo"],
  Ã: ["A", "til"],
  Õ: ["O", "til"],
  Â: ["A", "circ"],
  Ê: ["E", "circ"],
  Ô: ["O", "circ"],
};
const BLOCOS_ACENTO = {
  agudo: [
    [2, 0],
    [1, 1],
  ],
  til: [
    [0, 1],
    [1, 0],
    [2, 1],
    [3, 0],
  ],
  circ: [
    [1, 0],
    [0, 1],
    [2, 1],
  ],
};
const Pixelado: React.FC<{ texto: string; size: number }> = ({
  texto,
  size,
}) => (
  <>
    {texto.split("").map((c, i) => {
      const a = ACENTOS[c];
      if (!a) return <React.Fragment key={i}>{c}</React.Fragment>;
      const q = size / 8;
      const blocos = BLOCOS_ACENTO[a[1]];
      const larg = (a[1] === "til" ? 4 : 3) * q;
      return (
        <span key={i} style={{ position: "relative", display: "inline-block" }}>
          {a[0]}
          {blocos.map(([bx, by], j) => (
            <span
              key={j}
              style={{
                position: "absolute",
                left: `calc(50% - ${larg / 2}px + ${bx * q}px)`,
                top: -size * 0.08 + by * q,
                width: q,
                height: q,
                background: "currentColor",
              }}
            />
          ))}
        </span>
      );
    })}
  </>
);
type Pal = { t: string; cor?: string };
const Titulo: React.FC<{
  f: number;
  at: number;
  linhas: Pal[][];
  size?: number;
  top?: number;
}> = ({ f, at, linhas, size = 60, top = 230 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      width: 1080,
      top,
      textAlign: "center",
      fontFamily: PIX,
      fontSize: size,
      lineHeight: `${size * 1.4}px`,
      color: K.tinta,
    }}
  >
    {linhas.map((l, i) => {
      const k = it(f, at + i * 6, at + i * 6 + 14, 0, 1, SNAP);
      return (
        <div
          key={i}
          style={{
            opacity: Math.min(1, k * 2),
            transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})`,
            whiteSpace: "nowrap",
          }}
        >
          {l.map((p, j) => (
            <span
              key={j}
              style={{ color: p.cor, textShadow: "5px 5px 0 rgba(22,22,26,0.12)" }}
            >
              <Pixelado texto={p.t} size={size} />
            </span>
          ))}
        </div>
      );
    })}
  </div>
);
// janelinha de computador com barra de título
const Janela: React.FC<{
  f: number;
  at: number;
  y: number;
  h: number;
  titulo: string;
  children: React.ReactNode;
  x?: number;
  w?: number;
}> = ({ f, at, y, h, titulo, children, x = 90, w = 900 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: K.branco,
        border: `5px solid ${K.tinta}`,
        boxShadow: `10px 10px 0 ${K.tinta}`,
        opacity: Math.min(1, k * 1.5),
        transform: `translateY(${(1 - k) * 60}px) scale(${0.92 + 0.08 * k})`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: 54,
          borderBottom: `5px solid ${K.tinta}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          fontFamily: VT,
          fontSize: 34,
          color: K.tinta,
        }}
      >
        {[K.vermelho, K.amarelo, K.verde].map((c) => (
          <span
            key={c}
            style={{
              width: 18,
              height: 18,
              background: c,
              border: `3px solid ${K.tinta}`,
            }}
          />
        ))}
        <span style={{ marginLeft: 10 }}>{titulo}</span>
      </div>
      <div style={{ position: "relative", height: h - 64 }}>{children}</div>
    </div>
  );
};
// linha de texto dentro da janela, que aparece no tempo da fala
const Linha: React.FC<{
  f: number;
  at: number;
  children: React.ReactNode;
  size?: number;
  cor?: string;
  fundo?: string;
}> = ({ f, at, children, size = 40, cor = K.tinta, fundo }) => {
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        color: cor,
        opacity: k,
        transform: `translateX(${(1 - k) * -30}px)`,
        background: fundo,
        padding: fundo ? "6px 16px" : undefined,
        alignSelf: "flex-start",
      }}
    >
      {children}
    </div>
  );
};
const Selo: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  texto: string;
  cor?: string;
  size?: number;
}> = ({ f, at, x, y, texto, cor = K.vermelho, size = 34 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(-8deg) scale(${1.5 - 0.5 * k})`,
        opacity: Math.min(1, k * 1.4),
        fontFamily: PIX,
        fontSize: size,
        color: cor,
        border: `5px solid ${cor}`,
        padding: "10px 18px",
        background: "rgba(255,255,255,0.85)",
        whiteSpace: "nowrap",
      }}
    >
      <Pixelado texto={texto} size={size} />
    </div>
  );
};
// frasco em pixel (blocos)
const FrascoPix: React.FC<{ x: number; y: number; px?: number; falso?: boolean }> = ({
  x,
  y,
  px = 14,
  falso,
}) => {
  const mapa = [
    "..TTTTTT..",
    "..TTTTTT..",
    "...GGGG...",
    ".VVVVVVVV.",
    "VLLLLLLLLV",
    "VLRRRRRRLV",
    "VLLLLLLLLV",
    "V........V",
    "VPPPPPPPPV",
    ".VVVVVVVV.",
  ];
  const cores: Record<string, string> = {
    T: falso ? "#a855f7" : "#94a3b8",
    G: "#cbd5e1",
    V: K.tinta,
    L: K.branco,
    R: falso ? "#a855f7" : K.azul,
    P: "#e2e8f0",
  };
  return (
    <svg
      style={{ position: "absolute", left: x, top: y }}
      width={10 * px}
      height={10 * px}
    >
      {mapa.flatMap((l, j) =>
        l.split("").map((c, i) =>
          c === "." ? null : (
            <rect
              key={`${i}-${j}`}
              x={i * px}
              y={j * px}
              width={px}
              height={px}
              fill={cores[c]}
            />
          ),
        ),
      )}
    </svg>
  );
};

// ---------- legenda palavra por palavra ----------
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
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  if (f >= T.final - 4) return null;
  const b = BLOCOS.find(
    (bl, i) =>
      t >= bl[0].start - 0.05 &&
      (i === BLOCOS.length - 1 || t < BLOCOS[i + 1][0].start - 0.05),
  );
  if (!b || t > b[b.length - 1].end + 0.6) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        width: 760,
        top: 1240,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 14px",
        fontFamily: VT,
        fontSize: 68,
        lineHeight: 1,
      }}
    >
      {b.map((w, i) => {
        const ativa = t >= w.start - 0.03 && t < (b[i + 1]?.start ?? w.end + 0.6);
        return (
          <span
            key={i}
            style={{
              color: ativa ? K.tinta : K.branco,
              background: ativa ? K.amarelo : "transparent",
              padding: "0 8px",
              textShadow: ativa
                ? "none"
                : `-3px -3px 0 ${K.tinta}, 3px -3px 0 ${K.tinta}, -3px 3px 0 ${K.tinta}, 3px 3px 0 ${K.tinta}, 0 5px 0 ${K.tinta}`,
              border: ativa ? `3px solid ${K.tinta}` : "3px solid transparent",
            }}
          >
            {w.text.replace(/[.,:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// ---------- a repórter no canto de baixo ----------
const Canto: React.FC<{ f: number }> = ({ f }) => {
  if (f >= R(8)[0] + 10) return null;
  const k = it(f, 4, 22, 0, 1, OUT);
  const s = 0.56;
  return (
    <div
      style={{
        position: "absolute",
        left: 1080 - 419 * s + 10 + (1 - k) * 260,
        top: 1250 + Math.sin(f / 24) * 4,
        transform: `scale(${s})`,
        transformOrigin: "0 0",
        opacity: 1 - P(f, R(8)[0], R(8)[0] + 10),
        filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))",
      }}
    >
      <Reporter f={f} boca={boca as number[]} />
    </div>
  );
};

// ---------- cenas ----------
const cena = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];

const S1: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 0) ? null : (
    <>
      <div
        style={{
          position: "absolute",
          top: 140,
          width: 1080,
          textAlign: "center",
          fontFamily: PIX,
          fontSize: 26,
          color: K.vermelho,
          opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 9)),
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 22,
            height: 22,
            background: K.vermelho,
            marginRight: 16,
          }}
        />
        <Pixelado texto="PLANTÃO" size={26} />
      </div>
      <Titulo
        f={f}
        at={T.noticias - 10}
        linhas={[[{ t: "NOTÍCIAS DA" }], [{ t: "FARMÁCIA", cor: K.vermelho }]]}
      />
      <Janela f={f} at={T.anvisa} y={520} h={520} titulo="anvisa · alerta">
        <FrascoPix x={340} y={60} px={22} />
        <Selo f={f} at={T.falsificado} x={450} y={250} texto="LOTE FALSIFICADO" size={30} />
        <div
          style={{
            position: "absolute",
            top: 330,
            width: 810,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 44,
            color: K.tinta,
            opacity: P(f, T.botulinica, T.botulinica + 10),
          }}
        >
          toxina botulínica{" "}
          <span style={{ color: K.vermelho, opacity: P(f, T.botox, T.botox + 10) }}>
            (o “botox”)
          </span>
        </div>
      </Janela>
    </>
  );

const S2: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 1) ? null : (
    <>
      <Titulo
        f={f}
        at={R(1)[0]}
        linhas={[[{ t: "SAIU NO" }], [{ t: "DIÁRIO OFICIAL", cor: K.azul }]]}
        size={52}
      />
      <Janela f={f} at={T.diario} y={500} h={560} titulo="diário oficial · 19/10/2026">
        <div
          style={{
            position: "absolute",
            inset: 36,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <Linha f={f} at={T.dysport}>
            Produto: Dysport
          </Linha>
          <Linha f={f} at={T.dysport + 6} size={32} cor={K.cinza}>
            (toxina botulínica)
          </Linha>
          <Linha f={f} at={T.lote} size={62} fundo={K.amarelo}>
            LOTE 025155
          </Linha>
          <Linha f={f} at={T.alerta} size={36}>
            📣 alerta: a própria fabricante
          </Linha>
          <Linha f={f} at={T.falsas} size={36} cor={K.vermelho}>
            ⚠️ unidades falsas circulando
          </Linha>
        </div>
        <Selo f={f} at={T.lote + 20} x={640} y={370} texto="APREENSÃO" size={30} />
      </Janela>
    </>
  );

const S3: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 2)) return null;
  const linhas: [string, string, number, string, number][] = [
    ["validade", "jun/2027", T.original, "jun/2028", T.v2028],
    ["frasco", "padrão", T.frasco + 8, "outro formato", T.frasco + 14],
    ["cód. barras", "lote certo", T.codigo + 10, "OUTRO lote", T.outroLote],
  ];
  return (
    <>
      <Titulo
        f={f}
        at={T.como}
        linhas={[[{ t: "COMO" }], [{ t: "DESCOBRIRAM?", cor: K.laranja }]]}
        size={56}
      />
      <Janela f={f} at={T.detalhes} y={500} h={600} titulo="original × falso">
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 0,
            width: 810,
            display: "flex",
            fontFamily: PIX,
            fontSize: 24,
          }}
        >
          <div style={{ width: 250 }} />
          <div style={{ width: 280, textAlign: "center", color: K.verde }}>ORIGINAL</div>
          <div style={{ width: 280, textAlign: "center", color: K.vermelho }}>FALSO</div>
        </div>
        {linhas.map(([rot, ok, atOk, ruim, atRuim], i) => (
          <div
            key={rot}
            style={{
              position: "absolute",
              top: 90 + i * 150,
              left: 0,
              width: 810,
              height: 120,
              display: "flex",
              alignItems: "center",
              borderTop: `4px dashed rgba(22,22,26,0.2)`,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 36,
              opacity: P(f, atOk - 8, atOk),
            }}
          >
            <div style={{ width: 250, paddingLeft: 24, fontFamily: VT, fontSize: 40, color: K.cinza }}>
              {rot}
            </div>
            <div style={{ width: 280, textAlign: "center", color: K.verde }}>✓ {ok}</div>
            <div
              style={{
                width: 280,
                textAlign: "center",
                color: K.vermelho,
                opacity: P(f, atRuim, atRuim + 8),
              }}
            >
              ✕ {ruim}
            </div>
          </div>
        ))}
      </Janela>
    </>
  );
};

const S4: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 3)) return null;
  const sint: [string, string, number][] = [
    ["😑", "pálpebra caída", T.palpebra],
    ["👀", "visão dupla", T.visao],
    ["😣", "dificuldade p/ engolir", T.engolir],
    ["🫁", "dificuldade p/ respirar", T.respirar],
  ];
  return (
    <>
      <Titulo
        f={f}
        at={T.preocupa}
        linhas={[[{ t: "POR QUE" }], [{ t: "PREOCUPA?", cor: K.vermelho }]]}
      />
      <Janela f={f} at={T.ninguem} y={500} h={620} titulo="falsificado = ???">
        <FrascoPix x={40} y={40} px={12} falso />
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 50,
            width: 590,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 36,
            color: K.tinta,
          }}
        >
          ninguém sabe o que tem dentro
          <div
            style={{
              marginTop: 10,
              fontFamily: VT,
              fontSize: 36,
              color: K.cinza,
              opacity: P(f, T.eua, T.eua + 10),
            }}
          >
            EUA, 2024: botox falsificado causou:
          </div>
        </div>
        {sint.map(([e, txt, at], i) => (
          <div
            key={txt}
            style={{
              position: "absolute",
              left: 40 + (i % 2) * 380,
              top: 250 + Math.floor(i / 2) * 140,
              width: 350,
              height: 110,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 14px",
              border: `4px solid ${K.vermelho}`,
              background: "rgba(229,56,59,0.08)",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 28,
              lineHeight: 1.1,
              boxSizing: "border-box",
              opacity: P(f, at, at + 8),
              transform: `scale(${0.9 + 0.1 * it(f, at, at + 12, 0, 1, SNAP)})`,
            }}
          >
            <span style={{ fontFamily: EMOJI, fontSize: 46 }}>{e}</span>
            {txt}
          </div>
        ))}
      </Janela>
    </>
  );
};

const S5: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 4) ? null : (
    <>
      <Titulo
        f={f}
        at={T.entao}
        linhas={[[{ t: "ANTES DE" }], [{ t: "APLICAR", cor: K.verde }]]}
      />
      <Janela f={f} at={T.entao + 10} y={500} h={560} titulo="checklist.txt">
        <div
          style={{
            position: "absolute",
            inset: 36,
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
        >
          <Linha f={f} at={T.profissional}>
            ✅ profissional habilitado
          </Linha>
          <Linha f={f} at={T.caixa}>
            ✅ ver a caixa e o lote
          </Linha>
          <Linha f={f} at={T.preco} cor={K.laranja}>
            ⚠️ preço baixo demais?
          </Linha>
          <Linha f={f} at={T.preco + 10} size={52} fundo={K.amarelo}>
            DESCONFIE!
          </Linha>
        </div>
      </Janela>
    </>
  );

const S6: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 5) ? null : (
    <>
      <Titulo
        f={f}
        at={T.seDepois}
        linhas={[[{ t: "DEPOIS DA" }], [{ t: "APLICAÇÃO", cor: K.vermelho }]]}
      />
      <Janela f={f} at={T.seDepois + 10} y={500} h={600} titulo="sinais de alerta">
        <div
          style={{
            position: "absolute",
            inset: 36,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <Linha f={f} at={T.visao2}>
            👀 visão dupla
          </Linha>
          <Linha f={f} at={T.engolir2}>
            😣 dificuldade p/ engolir
          </Linha>
          <Linha f={f} at={T.respirar2}>
            🫁 dificuldade p/ respirar
          </Linha>
        </div>
        {f >= T.emergencia && (
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 40,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              background: K.vermelho,
              border: `5px solid ${K.tinta}`,
              boxShadow: `8px 8px 0 ${K.tinta}`,
              fontFamily: PIX,
              fontSize: 34,
              color: K.branco,
              transform: `scale(${0.8 + 0.2 * it(f, T.emergencia, T.emergencia + 12, 0, 1, SNAP)})`,
            }}
          >
            <span style={{ fontFamily: EMOJI, fontSize: 52 }}>🚑</span>
            <Pixelado texto="EMERGÊNCIA!" size={34} />
          </div>
        )}
      </Janela>
    </>
  );

const S7: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 6) ? null : (
    <>
      <Titulo
        f={f}
        at={T.outros}
        linhas={[[{ t: "SÓ ESSE" }], [{ t: "LOTE", cor: K.verde }]]}
      />
      <Janela f={f} at={T.outros + 6} y={500} h={420} titulo="status dos lotes">
        <div
          style={{
            position: "absolute",
            inset: 40,
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
        >
          <Linha f={f} at={T.outros + 10} cor={K.verde} size={44}>
            ✓ outros lotes: OK
          </Linha>
          <Linha f={f} at={T.so} cor={K.vermelho} size={44}>
            ✕ lote 025155: proibido
          </Linha>
        </div>
      </Janela>
    </>
  );

const S8: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 7) ? null : (
    <>
      <Titulo f={f} at={T.siga} linhas={[[{ t: "ME SIGA", cor: K.azul }]]} size={84} top={560} />
      <div
        style={{
          position: "absolute",
          top: 720,
          width: 1080,
          textAlign: "center",
          fontFamily: VT,
          fontSize: 56,
          color: K.tinta,
          opacity: P(f, T.siga + 10, T.siga + 22),
        }}
      >
        para mais notícias e dicas
        <br />
        de farmacologia 💊
      </div>
    </>
  );

const S9: React.FC<{ f: number }> = ({ f }) =>
  f < R(8)[0] ? null : (
    <div
      style={{
        position: "absolute",
        top: 720,
        width: 1080,
        textAlign: "center",
        fontFamily: PIX,
        fontSize: 44,
        lineHeight: "80px",
        color: K.tinta,
        opacity: it(f, T.final, T.final + 14, 0, 1, OUT),
      }}
    >
      Consulte um
      <br />
      <span style={{ color: K.azul }}>profissional</span>
      <br />
      <span style={{ color: K.azul }}>de saúde</span>
      <br />
      para orientações.
    </div>
  );

const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(([de]) => [de, "whoosh", 0.25] as [number, string, number]),
  [T.falsificado, "trava", 0.35],
  [T.lote, "pop", 0.25],
  [T.lote + 20, "trava", 0.32],
  [T.v2028, "pop", 0.2],
  [T.outroLote, "plim", 0.22],
  [T.palpebra, "pop", 0.18],
  [T.visao, "pop", 0.18],
  [T.engolir, "pop", 0.18],
  [T.respirar, "pop", 0.18],
  [T.profissional, "pop", 0.2],
  [T.caixa, "pop", 0.2],
  [T.preco, "pop", 0.2],
  [T.emergencia, "trava", 0.35],
  [T.so, "plim", 0.25],
  [T.final, "plim", 0.3],
];

export const NoticiaBotoxExplicadora: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S9 f={f} />
      <Canto f={f} />
      <Legenda f={f} />
      <Audio src={staticFile("noticiaBotox/narracao.mp3")} />
      <Audio
        src={staticFile("noticiaBotox/musica.wav")}
        volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920) no mesmo estilo. Os 20% de baixo ficam livres por causa do contador do TikTok.
export const CapaNoticiaBotoxExplicadora: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <div
      style={{
        position: "absolute",
        top: 120,
        width: 1080,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: PIX,
          fontSize: 28,
          color: K.branco,
          background: K.vermelho,
          border: `5px solid ${K.tinta}`,
          boxShadow: `8px 8px 0 ${K.tinta}`,
          padding: "16px 26px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ width: 20, height: 20, background: K.branco }} />
        <span>
          <Pixelado texto="NOTÍCIAS DA FARMÁCIA #1" size={28} />
        </span>
      </span>
    </div>
    <Titulo
      f={100}
      at={0}
      top={290}
      size={92}
      linhas={[[{ t: "BOTOX" }], [{ t: "FALSIFICADO", cor: K.vermelho }]]}
    />
    <Janela f={100} at={0} x={50} y={600} w={640} h={560} titulo="anvisa · alerta">
      <FrascoPix x={220} y={50} px={20} falso />
      <Selo f={100} at={0} x={315} y={240} texto="LOTE 025155" size={32} />
      <div
        style={{
          position: "absolute",
          top: 330,
          width: 630,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.15,
          color: K.tinta,
        }}
      >
        Anvisa manda
        <br />
        <span style={{ background: K.amarelo, padding: "0 12px" }}>apreender</span>
      </div>
    </Janela>
    <div
      style={{
        position: "absolute",
        left: 715,
        top: 680,
        transform: "scale(0.56)",
        transformOrigin: "0 0",
        filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))",
      }}
    >
      <Reporter f={1} boca={[2, 2]} />
    </div>
    <div
      style={{
        position: "absolute",
        top: 1250,
        width: 1080,
        textAlign: "center",
        fontFamily: VT,
        fontSize: 64,
        color: K.tinta,
      }}
    >
      <span
        style={{
          background: K.branco,
          border: `4px solid ${K.tinta}`,
          boxShadow: `6px 6px 0 ${K.tinta}`,
          padding: "6px 24px",
        }}
      >
        como identificar e se proteger
      </span>
    </div>
  </AbsoluteFill>
);
