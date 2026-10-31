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
import { DISPLAY, SANS } from "../fonts";
import falaJson from "./fala.json";

// "Pode partir o comprimido?" no estilo do vídeo de referência da usuária: fundo preto com verde-limão neon,
// visual de interface, lista 01/02/03 com cadeados que destravam um a um e legenda curta no centro.
// Roteiro e fontes: roteiros/partir_comprimido.md. Narração feita pela usuária (OpenArt); tempos em fala.json.
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
  depende: Tw("depende"),
  tres: Tw("três"),
  bula: Tw("bula"),
  n1: Tw("número", 1) - 6,
  retard: Tw("retard"),
  lp: Tw("lp"),
  xr: Tw("xr"),
  poucos: Tw("poucos"),
  partido: Tw("partido"),
  tudo: Tw("tudo"),
  n2: Tw("número", 2) - 6,
  capinha: Tw("capinha"),
  acido: Tw("ácido"),
  partiu: Tw("partiu"),
  n3: Tw("número", 3) - 6,
  finasterida: Tw("finasterida"),
  gestantes: Tw("gestantes"),
  bebe: Tw("bebê"),
  linha: Tw("linha") - 10,
  engolir: Tw("engolir"),
  metades: Tw("metades"),
  dose: Tw("dose"),
  guarda: Tw("então") - 6,
  bula2: Tw("bula", 2),
  farmaceutico: Tw("farmacêutico"),
  cortador: Tw("cortador"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_PARTIR = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.n1],
  [T.n1, T.n2],
  [T.n2, T.n3],
  [T.n3, T.linha],
  [T.linha, T.guarda],
  [T.guarda, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_PARTIR],
];
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [T.depende, K + "pops/pop-small-in.wav", 0.4],
  [T.tres, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.n1, K + "interface/click-latch-medium.wav", 0.6],
  [T.retard, K + "pops/pop-small-in.wav", 0.35],
  [T.lp, K + "pops/pop-small-in.wav", 0.35],
  [T.xr, K + "pops/pop-small-in.wav", 0.35],
  [T.tudo, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.n2, K + "interface/click-latch-medium.wav", 0.6],
  [T.partiu, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.n3, K + "interface/click-latch-medium.wav", 0.6],
  [T.gestantes, K + "notifications/notification-alert-soft.wav", 0.4],
  [T.linha, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.metades, K + "pops/pop-small-in.wav", 0.35],
  [T.guarda, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.bula2, K + "pops/pop-small-in.wav", 0.35],
  [T.farmaceutico, K + "pops/pop-small-in.wav", 0.35],
  [T.cortador, K + "pops/pop-small-in.wav", 0.35],
  [T.siga, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha retrô abaixando sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_PARTIR + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_PARTIR, fim + 6);
      fr++
    )
      v[fr] = 1;
  });
  const s = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    s[fr] = acc;
  }
  return s;
})();
const musica = (fr: number) =>
  0.22 -
  0.13 *
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0);

// ---------- visual ----------
const W = 1080;
const LIMA = "#c8ff3d",
  PRETO = "#07090a",
  CINZA = "#7b8577",
  TEXTO = "#eef5e6",
  VERM = "#ff4d5e",
  AMBAR = "#ffcf3d";
const MONO = "'VTThreeTwoThree', monospace";

const Fundo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: PRETO }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(rgba(200,255,61,0.10) 2px, transparent 2px)`,
        backgroundSize: "40px 40px",
        backgroundPosition: `0 ${(f * 0.3) % 40}px`,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 700px 900px at 50% 38%, rgba(155,226,43,0.16), rgba(0,0,0,0) 70%)",
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.85)" }} />
  </AbsoluteFill>
);

// barra de cima tipo aplicativo
const Barra: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 40,
      right: 40,
      top: 60,
      height: 64,
      borderRadius: 14,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(200,255,61,0.18)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 22px",
      fontFamily: MONO,
      fontSize: 34,
      color: CINZA,
    }}
  >
    <span
      style={{ width: 14, height: 14, borderRadius: 7, background: VERM }}
    />
    farmacia <span style={{ color: LIMA }}>/</span> pode-partir.exe
  </div>
);

const Cena: React.FC<{ f: number; i: number; children: React.ReactNode }> = ({
  f,
  i,
  children,
}) => {
  const [a, b] = PARTES[i];
  if (f < a || f >= b) return null;
  const o = Math.min(it(f, a, a + 8, 0, 1, OUT), 1 - P(f, b - 6, b));
  const z = 1 + 0.03 * ((f - a) / (b - a));
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        transform: `scale(${z})`,
        transformOrigin: "540px 900px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Cadeado: React.FC<{ aberto: number; s?: number }> = ({
  aberto,
  s = 1,
}) => (
  <svg width={60 * s} height={70 * s} viewBox="0 0 60 70">
    <path
      d={`M 16 32 V 20 a 14 14 0 0 1 28 0 V ${32 - 14 * aberto}`}
      fill="none"
      stroke={aberto > 0.5 ? LIMA : CINZA}
      strokeWidth={6}
      transform={`translate(${aberto * 14} ${-aberto * 4})`}
    />
    <rect
      x={8}
      y={30}
      width={44}
      height={36}
      rx={8}
      fill={aberto > 0.5 ? LIMA : "#2a3029"}
    />
  </svg>
);

const ITENS = [
  { n: "01", t: "LIBERAÇÃO PROLONGADA", at: T.n1 },
  { n: "02", t: "GASTRORRESISTENTE", at: T.n2 },
  { n: "03", t: "FINASTERIDA", at: T.n3 },
];
// lista com os três cadeados
const Lista: React.FC<{ f: number; y: number; ativo?: number }> = ({
  f,
  y,
  ativo = -1,
}) => {
  const abertos = ITENS.filter((x) => f >= x.at).length;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y }}>
      {ITENS.map((x, i) => {
        const k = it(f, 8 + i * 6, 22 + i * 6, 0, 1, SNAP);
        const ab = it(f, x.at, x.at + 10, 0, 1, OUT);
        const destaque = i === ativo;
        return (
          <div
            key={x.n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              height: 150,
              marginBottom: 18,
              padding: "0 30px",
              borderRadius: 20,
              border: `3px solid ${destaque ? LIMA : ab > 0.5 ? "rgba(200,255,61,0.45)" : "rgba(255,255,255,0.10)"}`,
              background: destaque
                ? "rgba(200,255,61,0.10)"
                : "rgba(255,255,255,0.03)",
              boxShadow: destaque ? `0 0 40px rgba(200,255,61,0.25)` : "none",
              opacity: k,
              transform: `translateX(${(1 - k) * 80}px)`,
            }}
          >
            <Cadeado aberto={ab} />
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 64,
                color: ab > 0.5 ? LIMA : TEXTO,
              }}
            >
              {x.n}
            </span>
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: ab > 0.5 ? 40 : 34,
                color: ab > 0.5 ? TEXTO : CINZA,
                flex: 1,
              }}
            >
              {ab > 0.5 ? x.t : "? ? ?"}
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 26,
                color: PRETO,
                background: ab > 0.5 ? VERM : CINZA,
                borderRadius: 999,
                padding: "8px 16px",
              }}
            >
              {ab > 0.5 ? "NÃO PARTA" : "BLOQUEADO"}
            </span>
          </div>
        );
      })}
      <div
        style={{ fontFamily: MONO, fontSize: 40, color: CINZA, marginTop: 10 }}
      >
        DESBLOQUEADOS <span style={{ color: LIMA }}>{abertos}/3</span>
      </div>
      <div
        style={{
          height: 12,
          borderRadius: 6,
          background: "rgba(255,255,255,0.08)",
          marginTop: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(abertos / 3) * 100}%`,
            background: LIMA,
            boxShadow: `0 0 20px ${LIMA}`,
          }}
        />
      </div>
    </div>
  );
};

const Titulo: React.FC<{
  f: number;
  at: number;
  y: number;
  children: React.ReactNode;
  size?: number;
}> = ({ f, at, y, children, size = 92 }) => {
  const k = it(f, at, at + 12, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        color: TEXTO,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};
const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: LIMA, textShadow: `0 0 30px rgba(200,255,61,0.55)` }}>
    {children}
  </span>
);
const Chip: React.FC<{
  f: number;
  at: number;
  children: React.ReactNode;
  cor?: string;
}> = ({ f, at, children, cor = LIMA }) => {
  if (f < at - 4) return null;
  const k = it(f, at - 4, at + 6, 0, 1, SNAP);
  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 10px",
        padding: "14px 30px",
        borderRadius: 999,
        border: `3px solid ${cor}`,
        color: cor,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 48,
        transform: `scale(${k})`,
        boxShadow: `0 0 24px ${cor}55`,
      }}
    >
      {children}
    </span>
  );
};
// cabeçalho de cada item destravado
const Cabeca: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const x = ITENS[i];
  const k = it(f, x.at, x.at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 170,
        height: 170,
        borderRadius: 24,
        border: `3px solid ${LIMA}`,
        background: "rgba(200,255,61,0.10)",
        boxShadow: `0 0 50px rgba(200,255,61,0.3)`,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 34px",
        transform: `scale(${0.9 + 0.1 * k})`,
        opacity: k,
      }}
    >
      <Cadeado aberto={it(f, x.at + 6, x.at + 16, 0, 1, OUT)} s={1.2} />
      <span
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 80,
          color: LIMA,
        }}
      >
        {x.n}
      </span>
      <span
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: x.t.length > 16 ? 44 : 58,
          color: TEXTO,
        }}
      >
        {x.t}
      </span>
    </div>
  );
};

// comprimido desenhado (com linha no meio e, se pedido, uma "capinha" brilhante em volta)
const Comprimido: React.FC<{
  x: number;
  y: number;
  s?: number;
  capa?: number;
  parte?: number;
  linha?: boolean;
  desigual?: number;
}> = ({ x, y, s = 1, capa = 0, parte = 0, linha = true, desigual = 0 }) => {
  const w = 360,
    h = 200;
  const corte = w / 2 + desigual * 60;
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {capa > 0 && (
          <rect
            x={-w / 2 - 22}
            y={-h / 2 - 22}
            width={w + 44}
            height={h + 44}
            rx={(h + 44) / 2}
            fill="none"
            stroke={LIMA}
            strokeWidth={10}
            opacity={capa}
            style={{ filter: `drop-shadow(0 0 14px ${LIMA})` }}
          />
        )}
        <g transform={`translate(${-parte * 50} 0) rotate(${-parte * 8})`}>
          <path
            d={`M ${-w / 2 + h / 2} ${-h / 2} H ${-w / 2 + corte} V ${h / 2} H ${-w / 2 + h / 2} A ${h / 2} ${h / 2} 0 0 1 ${-w / 2 + h / 2} ${-h / 2} Z`}
            fill="#f4f7ef"
          />
        </g>
        <g transform={`translate(${parte * 50} 0) rotate(${parte * 8})`}>
          <path
            d={`M ${-w / 2 + corte} ${-h / 2} H ${w / 2 - h / 2} A ${h / 2} ${h / 2} 0 0 1 ${w / 2 - h / 2} ${h / 2} H ${-w / 2 + corte} Z`}
            fill="#f4f7ef"
          />
        </g>
        {linha && parte < 0.05 && (
          <line
            x1={-w / 2 + corte}
            x2={-w / 2 + corte}
            y1={-h / 2 + 18}
            y2={h / 2 - 18}
            stroke="#aab3a2"
            strokeWidth={8}
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
};

// liberação: barras subindo aos poucos (inteiro) x tudo de uma vez (partido)
const Liberacao: React.FC<{ f: number }> = ({ f }) => {
  const kInt = it(f, T.poucos - 20, T.partido, 0, 1);
  const kPart = it(f, T.tudo - 6, T.tudo + 8, 0, 1, OUT);
  const barras = (pico: boolean, k: number, cor: string) =>
    Array.from({ length: 12 }, (_, i) => {
      const alvo = pico ? (i < 2 ? 1 : 0.05) : 0.38 + 0.04 * Math.sin(i);
      const hh =
        300 * alvo * Math.min(1, Math.max(0, k * 12 - i * (pico ? 0 : 0.9)));
      return (
        <div
          key={i}
          style={{
            width: 52,
            height: Math.max(4, hh),
            background: cor,
            borderRadius: 6,
            boxShadow: `0 0 16px ${cor}88`,
          }}
        />
      );
    });
  const bloco = (
    titulo: string,
    cor: string,
    pico: boolean,
    k: number,
    top: number,
  ) => (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        opacity: Math.min(1, k * 3),
      }}
    >
      <div
        style={{ fontFamily: MONO, fontSize: 42, color: cor, marginBottom: 12 }}
      >
        {titulo}
      </div>
      <div
        style={{
          height: 310,
          display: "flex",
          alignItems: "flex-end",
          gap: 18,
          borderBottom: `3px solid rgba(255,255,255,0.15)`,
        }}
      >
        {barras(pico, k, cor)}
      </div>
    </div>
  );
  return (
    <>
      {bloco("> inteiro: aos poucos, durante horas", LIMA, false, kInt, 760)}
      {f >= T.partido - 6 &&
        bloco("> partido: tudo de uma vez", VERM, true, kPart, 1160)}
    </>
  );
};

// legenda curta no centro-baixo (uma frase por vez, palavra em destaque)
const GRUPOS = (() => {
  const out: Pal[][] = [];
  let cur: Pal[] = [];
  FALA.forEach((w, i) => {
    cur.push(w);
    if (/[.?!:,]$/.test(w.w) || cur.length >= 4 || i === FALA.length - 1) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
})();
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  if (f >= T.siga) return null;
  const gi = GRUPOS.findIndex(
    (g, i) =>
      f >= g[0].f - 2 && (i + 1 >= GRUPOS.length || f < GRUPOS[i + 1][0].f - 2),
  );
  if (gi < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1630,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 52,
        color: TEXTO,
      }}
    >
      {GRUPOS[gi].map((w, j) => (
        <span
          key={j}
          style={{
            color: f >= w.f ? TEXTO : "rgba(238,245,230,0.25)",
            marginRight: 14,
          }}
        >
          {w.w.toLowerCase()}
        </span>
      ))}
    </div>
  );
};

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Titulo f={f} at={2} y={180} size={86}>
      PODE <L>PARTIR</L>
      <br />O COMPRIMIDO?
    </Titulo>
    <Comprimido
      x={540}
      y={680}
      s={1.1}
      parte={it(f, T.depende - 6, T.depende + 10, 0, 1, OUT)}
    />
    {f >= T.tres - 6 && <Lista f={f - (T.tres - 6) + 8} y={880} />}
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Cabeca f={f} i={0} />
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 0,
        right: 0,
        textAlign: "center",
      }}
    >
      <Chip f={f} at={T.retard}>
        retard
      </Chip>
      <Chip f={f} at={T.lp}>
        LP
      </Chip>
      <Chip f={f} at={T.xr}>
        XR
      </Chip>
    </div>
    <div
      style={{
        position: "absolute",
        top: 560,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 42,
        color: CINZA,
        opacity: it(f, T.xr + 10, T.xr + 22, 0, 1),
      }}
    >
      procure na caixa 📦
    </div>
    <Liberacao f={f} />
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => {
  const quebra = it(f, T.partiu - 4, T.partiu + 10, 0, 1, OUT);
  return (
    <Cena f={f} i={2}>
      <Cabeca f={f} i={1} />
      <Comprimido
        x={540}
        y={760}
        s={1.25}
        capa={it(f, T.capinha - 6, T.capinha + 10, 0, 1) * (1 - quebra)}
        parte={quebra}
        linha={false}
      />
      {/* gotas de ácido */}
      {f >= T.acido - 8 &&
        Array.from({ length: 7 }, (_, i) => {
          const t = (f - T.acido + 8 + i * 9) % 50;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: 250 + i * 95,
                top: 470 + t * 6,
                fontFamily: MONO,
                fontSize: 48,
                color: AMBAR,
                opacity: 1 - t / 50,
              }}
            >
              H⁺
            </span>
          );
        })}
      <Titulo f={f} at={T.capinha} y={1020} size={58}>
        a <L>capinha</L> protege
        <br />o estômago e o remédio
      </Titulo>
      {f >= T.partiu - 4 && (
        <Titulo f={f} at={T.partiu - 4} y={1250} size={64}>
          <span style={{ color: VERM }}>partiu = sem proteção</span>
        </Titulo>
      )}
    </Cena>
  );
};

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Cabeca f={f} i={2} />
    <Comprimido
      x={540}
      y={620}
      s={0.9}
      parte={it(f, T.finasterida + 10, T.finasterida + 26, 0, 1, OUT) * 0.7}
      linha={false}
    />
    {f >= T.gestantes - 6 && (
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 860,
          borderRadius: 24,
          border: `4px solid ${AMBAR}`,
          background: "rgba(255,207,61,0.08)",
          padding: "40px 44px",
          display: "flex",
          gap: 30,
          alignItems: "center",
          opacity: it(f, T.gestantes - 6, T.gestantes + 6, 0, 1),
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 120 }}>🤰</span>
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 48,
            color: TEXTO,
            lineHeight: 1.2,
          }}
        >
          gestante <span style={{ color: AMBAR }}>não manuseia</span> comprimido
          partido ou esmagado
        </span>
      </div>
    )}
    {f >= T.bebe - 6 && (
      <Titulo f={f} at={T.bebe - 6} y={1260} size={50}>
        pode afetar o <L>bebê menino</L> 👶
      </Titulo>
    )}
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Titulo f={f} at={T.linha + 4} y={200} size={84}>
      E A <L>LINHA</L>
      <br />
      NO MEIO?
    </Titulo>
    <Comprimido
      x={540}
      y={700}
      s={1.2}
      desigual={it(f, T.metades - 10, T.metades + 6, 0, 1)}
      parte={it(f, T.metades - 4, T.metades + 10, 0, 1, OUT)}
    />
    {f >= T.engolir - 10 && (
      <Titulo f={f} at={T.engolir - 10} y={950} size={50}>
        às vezes é só para
        <br />
        <L>facilitar engolir</L>
      </Titulo>
    )}
    {f >= T.dose - 10 && (
      <Titulo f={f} at={T.dose - 10} y={1200} size={58}>
        <span style={{ color: VERM }}>metades ≠ mesma dose</span>
      </Titulo>
    )}
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => {
  const passos: [number, string, string][] = [
    [T.bula2, "📄", "confere na bula"],
    [T.farmaceutico, "👩‍⚕️", "pergunta ao farmacêutico"],
    [T.cortador, "✂️", "usa cortador de comprimidos"],
  ];
  return (
    <Cena f={f} i={5}>
      <Titulo f={f} at={T.guarda + 4} y={200} size={96}>
        GUARDA <L>ESSA</L>
      </Titulo>
      {passos.map(([at, em, txt], i) => {
        if (f < at - 6) return null;
        const k = it(f, at - 6, at + 6, 0, 1, SNAP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 480 + i * 230,
              height: 190,
              borderRadius: 24,
              border: `3px solid ${LIMA}`,
              background: "rgba(200,255,61,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 40px",
              transform: `scale(${k})`,
            }}
          >
            <span style={{ fontFamily: EMOJI, fontSize: 90 }}>{em}</span>
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 48,
                color: TEXTO,
              }}
            >
              {txt}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 56,
                color: LIMA,
              }}
            >
              ✓
            </span>
          </div>
        );
      })}
    </Cena>
  );
};

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <Titulo f={f} at={T.siga + 2} y={640} size={110}>
      ME <L>SIGA</L>
    </Titulo>
    <Titulo f={f} at={T.siga + 10} y={800} size={46}>
      para mais dicas de farmacologia
      <br />e <L>curiosidades sobre a área</L>
    </Titulo>
  </Cena>
);

const S8: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={7}>
    <Titulo f={f} at={T.final + 4} y={720} size={70}>
      CONSULTE UM
      <br />
      <L>PROFISSIONAL DE SAÚDE</L>
      <br />
      PARA ORIENTAÇÕES.
    </Titulo>
  </Cena>
);

export const VideoPartir: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Barra />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <Legenda f={f} />
      <Audio src={staticFile("partir/narracao.mp3")} />
      <Audio
        src={staticFile("partir/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_PARTIR - 60, DURATION_PARTIR))
        }
      />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaPartir: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <Titulo f={100} at={0} y={330} size={88}>
      PODE <L>PARTIR</L>
      <br />O COMPRIMIDO?
    </Titulo>
    <Comprimido x={540} y={860} s={1.3} parte={0.6} />
    <div style={{ position: "absolute", top: 1100, left: 0, right: 0 }}>
      <Lista f={200} y={0} />
    </div>
  </AbsoluteFill>
);
