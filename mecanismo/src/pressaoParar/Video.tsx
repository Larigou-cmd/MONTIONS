import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OUT, P, SNAP, it } from "../lib";
import { EMOJI } from "../aas/ui";
import { DISPLAY, SANS } from "../fonts";
import falaJson from "./fala.json";

// "Sua pressão melhorou: pode parar o remédio?", Modelo 8 (lista neon, 3 erros).
// Roteiro e fontes: roteiros/pressao_parar_remedio.md. Narração feita pela usuária (OpenArt); tempos em fala.json.
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
  errado: Tw("errado"),
  primeiro: Tw("primeiro"),
  terceiro: Tw("terceiro"),
  n1: Tw("erro", 1) - 6,
  normalizou: Tw("normalizou"),
  agindo: Tw("agindo"),
  parou: Tw("parou"),
  subir: Tw("subir"),
  repente: Tw("repente"),
  disparar: Tw("disparar"),
  n2: Tw("erro", 2) - 6,
  cabeca: Tw("cabeça"),
  sintoma: Tw("sintoma"),
  coracao: Tw("coração"),
  rins: Tw("rins"),
  vasos: Tw("vasos"),
  silencio: Tw("silêncio"),
  todo: Tw("todo", 2),
  n3: Tw("erro", 3) - 6,
  duas: Tw("duas"),
  derrubar: Tw("derrubar"),
  tontura: Tw("tontura"),
  desmaio: Tw("desmaio"),
  esqueceu: Tw("esqueceu", 2),
  pule: Tw("pule"),
  nunca: Tw("nunca", 2),
  quer: Tw("quer") - 8,
  medico: Tw("médico"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_PRESSAO = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.n1],
  [T.n1, T.n2],
  [T.n2, T.n3],
  [T.n3, T.quer],
  [T.quer, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_PRESSAO],
];
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [T.errado, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.terceiro, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n1, K + "interface/click-latch-medium.wav", 0.6],
  [T.subir, K + "pops/pop-small-in.wav", 0.35],
  [T.disparar, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.n2, K + "interface/click-latch-medium.wav", 0.6],
  [T.coracao, K + "pops/pop-small-in.wav", 0.35],
  [T.rins, K + "pops/pop-small-in.wav", 0.35],
  [T.vasos, K + "pops/pop-small-in.wav", 0.35],
  [T.todo, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n3, K + "interface/click-latch-medium.wav", 0.6],
  [T.desmaio, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.nunca, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.quer, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.siga, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
  [T.final + 6, K + "logo-stings/sting-airy-long.wav", 0.55],
];

// trilha retrô abaixando sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_PRESSAO + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_PRESSAO, fim + 6);
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
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0) +
  // na tela final, sem voz, a trilha sobe para o fim não ficar baixo demais
  0.2 * Math.min(1, Math.max(0, (fr - T.final) / 20));

// ---------- visual ----------
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
    farmacia <span style={{ color: LIMA }}>/</span> pressao.exe
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
  { n: "01", t: "PARAR QUANDO MELHORA", at: T.n1 },
  { n: "02", t: "SÓ COM DOR DE CABEÇA", at: T.n2 },
  { n: "03", t: "DOBRAR A DOSE", at: T.n3 },
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
                fontSize: ab > 0.5 ? 36 : 34,
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
              {ab > 0.5 ? "ERRO" : "BLOQUEADO"}
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

const Aviso: React.FC<{ f: number; at: number; top: number; cor?: string; children: React.ReactNode; size?: number }> = ({ f, at, top, cor = AMBAR, children, size = 50 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        borderRadius: 24,
        border: `4px solid ${cor}`,
        background: `${cor}14`,
        padding: "32px 40px",
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.2,
        color: TEXTO,
        transform: `scale(${0.85 + 0.15 * k})`,
        opacity: Math.min(1, k * 1.5),
      }}
    >
      {children}
    </div>
  );
};

// ---------- cenas ----------
const Emo: React.FC<{ top: number; size?: number; children: React.ReactNode }> = ({ top, size = 150, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: EMOJI, fontSize: size }}>{children}</div>
);

// carimbo vermelho torto
const Carimbo: React.FC<{ f: number; at: number; top: number; children: React.ReactNode }> = ({ f, at, top, children }) => {
  if (f < at - 2) return null;
  const k = it(f, at - 2, at + 6, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 120,
          color: VERM,
          border: `8px solid ${VERM}`,
          borderRadius: 18,
          padding: "0 40px",
          transform: `rotate(-8deg) scale(${2 - k})`,
          opacity: k,
          textShadow: `0 0 30px ${VERM}88`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// a linha da pressão: estável com o remédio, sobe quando ele é parado
const Grafico: React.FC<{ f: number; top: number }> = ({ f, top }) => {
  const W = 840,
    H = 300,
    n = 60;
  const cresce = it(f, T.normalizou - 10, T.agindo + 10, 0, 1, OUT);
  const corte = it(f, T.parou - 4, T.subir + 20, 0, 1, OUT);
  const visiveis = Math.max(2, Math.round((n + 1) * (corte > 0 ? 0.56 + 0.44 * corte : 0.56 * cresce)));
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const fase = i / n;
    let y = 0.55 + 0.03 * Math.sin(i * 1.3);
    if (fase > 0.55) y -= ((fase - 0.55) / 0.45) * 0.5;
    return [fase * W, y * H] as const;
  }).slice(0, visiveis);
  const caminho = (lista: (readonly [number, number])[]) =>
    lista.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const meio = Math.round(n * 0.55);
  const antes = caminho(pts.slice(0, meio + 1));
  const depois = pts.length > meio + 1 ? caminho(pts.slice(meio)) : "";
  return (
    <div style={{ position: "absolute", left: 120, top }}>
      <svg width={W} height={H + 60} viewBox={`0 -20 ${W} ${H + 60}`} style={{ overflow: "visible" }}>
        <line x1={0} y1={H * 0.55} x2={W} y2={H * 0.55} stroke="rgba(200,255,61,0.25)" strokeDasharray="10 10" strokeWidth={3} />
        <line x1={W * 0.55} y1={-10} x2={W * 0.55} y2={H + 20} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
        <path d={antes} fill="none" stroke={LIMA} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${LIMA})` }} />
        {depois && (
          <path d={depois} fill="none" stroke={VERM} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${VERM})` }} />
        )}
        <text x={W * 0.27} y={H + 40} fill={LIMA} fontFamily={MONO} fontSize={38} textAnchor="middle">com remédio</text>
        {corte > 0 && (
          <text x={W * 0.78} y={H + 40} fill={VERM} fontFamily={MONO} fontSize={38} textAnchor="middle" opacity={corte}>parou</text>
        )}
      </svg>
    </div>
  );
};

const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Titulo f={f} at={0} y={190} size={78}>
      SUA <L>PRESSÃO</L>
      <br />
      MELHOROU?
    </Titulo>
    {f < T.primeiro - 4 && <Emo top={470} size={170}>🩺💊</Emo>}
    {f < T.primeiro - 4 && (
      <Titulo f={f} at={18} y={720} size={56}>
        pode parar o remédio?
      </Titulo>
    )}
    {f < T.primeiro - 4 && <Carimbo f={f} at={T.errado} top={930}>ERRADO</Carimbo>}
    {f >= T.primeiro - 4 && <Lista f={f - (T.primeiro - 4) + 8} y={440} />}
    <Aviso f={f} at={T.terceiro - 2} top={1180} cor={AMBAR} size={44}>
      o <L>terceiro</L>, quase todo mundo já cometeu
    </Aviso>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Cabeca f={f} i={0} />
    <Titulo f={f} at={T.normalizou - 8} y={400} size={48}>
      ela está boa <L>porque o remédio está agindo</L>
    </Titulo>
    <Grafico f={f} top={560} />
    <Aviso f={f} at={T.repente - 10} top={1000} cor={VERM} size={46}>
      com alguns remédios, parar de repente
      <br />
      faz a pressão <span style={{ color: VERM }}>disparar</span>
    </Aviso>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Cabeca f={f} i={1} />
    <Emo top={380}>🤕</Emo>
    <Titulo f={f} at={T.sintoma - 12} y={570} size={52}>
      pressão alta <L>quase nunca dá sintoma</L>
    </Titulo>
    <div style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.coracao} cor={VERM}>coração</Chip>
      <Chip f={f} at={T.rins} cor={VERM}>rins</Chip>
      <Chip f={f} at={T.vasos} cor={VERM}>vasos</Chip>
    </div>
    <Titulo f={f} at={T.silencio - 4} y={900} size={50}>
      em <L>silêncio</L>
    </Titulo>
    <Aviso f={f} at={T.todo - 10} top={1040} cor={LIMA} size={52}>
      remédio <L>todo dia</L>, mesmo se sentindo bem
    </Aviso>
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Cabeca f={f} i={2} />
    <Emo top={380}>💊💊</Emo>
    <Titulo f={f} at={T.derrubar - 8} y={570} size={52}>
      pode <L>derrubar</L> a pressão
    </Titulo>
    <div style={{ position: "absolute", top: 680, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.tontura} cor={VERM}>tontura</Chip>
      <Chip f={f} at={T.desmaio} cor={VERM}>desmaio</Chip>
    </div>
    <Aviso f={f} at={T.esqueceu - 6} top={900} cor={AMBAR} size={48}>
      esqueceu? perto da próxima, <L>pule</L>
    </Aviso>
    <Aviso f={f} at={T.nunca - 6} top={1120} cor={VERM} size={64}>
      NUNCA DOBRE
    </Aviso>
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Titulo f={f} at={T.quer + 4} y={300} size={64}>
      QUER MUDAR OU
      <br />
      <L>PARAR O REMÉDIO?</L>
    </Titulo>
    <Emo top={560} size={170}>👩‍⚕️</Emo>
    <Aviso f={f} at={T.medico - 8} top={820} cor={LIMA} size={60}>
      fale com o <L>seu médico</L>
    </Aviso>
    <Titulo f={f} at={T.salva - 4} y={1100} size={50}>
      📌 salva e manda para quem
      <br />
      <L>toma remédio de pressão</L>
    </Titulo>
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <Img
      src={staticFile("pressaoParar/logo.jpg")}
      style={{ position: "absolute", left: 350, top: 360, width: 380, height: 380, borderRadius: "50%", boxShadow: "0 0 50px rgba(200,255,61,.35)" }}
    />
    <Titulo f={f} at={T.siga + 2} y={790} size={110}>
      ME <L>SIGA</L>
    </Titulo>
    <Titulo f={f} at={T.siga + 10} y={950} size={46}>
      para mais dicas de farmacologia
      <br />e <L>curiosidades sobre a área</L>
    </Titulo>
  </Cena>
);

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <Titulo f={f} at={T.final + 4} y={720} size={70}>
      CONSULTE UM
      <br />
      <L>PROFISSIONAL DE SAÚDE</L>
      <br />
      PARA ORIENTAÇÕES.
    </Titulo>
  </Cena>
);

export const VideoPressaoParar: React.FC = () => {
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
      <Legenda f={f} />
      <Audio src={staticFile("pressaoParar/narracao.mp3")} />
      <Audio src={staticFile("pressaoParar/musica.wav")} volume={(fr) => musica(fr) * (1 - P(fr, DURATION_PRESSAO - 60, DURATION_PRESSAO))} />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaPressaoParar: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <Titulo f={100} at={0} y={330} size={72}>
      SUA <L>PRESSÃO</L> MELHOROU?
      <br />
      PODE PARAR O REMÉDIO?
    </Titulo>
    <Emo top={680} size={140}>🩺💊</Emo>
    <div style={{ position: "absolute", top: 900, left: 0, right: 0 }}>
      <Lista f={200} y={0} />
    </div>
  </AbsoluteFill>
);
