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

// "3 alimentos para evitar se você toma tirzepatida", Modelo 8 (lista neon).
// Roteiro e fontes: roteiros/tirzepatida_3_evitar.md. Narração feita pela usuária (OpenArt); tempos em fala.json.
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
  passar: Tw("passar"),
  terceiro: Tw("terceiro"),
  guarda: Tw("guarda"),
  lento0: Tw("a") - 8,
  lento: Tw("lento"),
  tempo: Tw("tempo"),
  n1: Tw("número", 1) - 6,
  gordura: Tw("gordura"),
  enjoo: Tw("enjoo"),
  prefira: Tw("prefira"),
  sopa: Tw("sopa"),
  torrada: Tw("torrada"),
  porcoes: Tw("porções"),
  n2: Tw("número", 2) - 6,
  gas: Tw("gás"),
  inchaco: Tw("inchaço"),
  cheio: Tw("cheio"),
  agua: Tw("água"),
  n3: Tw("número", 3) - 6,
  piorar: Tw("piorar"),
  tontura: Tw("tontura"),
  proibida: Tw("proibida"),
  cuidado: Tw("cuidado"),
  alerta: Tw("sinal", 2) - 12,
  dor: Tw("dor"),
  procure: Tw("procure"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_TIRZEP = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.lento0],
  [T.lento0, T.n1],
  [T.n1, T.n2],
  [T.n2, T.n3],
  [T.n3, T.alerta],
  [T.alerta, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_TIRZEP],
];
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [T.passar, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.guarda, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.lento0, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.n1, K + "interface/click-latch-medium.wav", 0.6],
  [T.enjoo, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.sopa, K + "pops/pop-small-in.wav", 0.35],
  [T.torrada, K + "pops/pop-small-in.wav", 0.35],
  [T.n2, K + "interface/click-latch-medium.wav", 0.6],
  [T.gas, K + "pops/pop-small-in.wav", 0.35],
  [T.agua, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n3, K + "interface/click-latch-medium.wav", 0.6],
  [T.tontura, K + "pops/pop-small-in.wav", 0.35],
  [T.alerta, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.dor, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.salva, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.siga, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha retrô abaixando sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_TIRZEP + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_TIRZEP, fim + 6);
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
    farmacia <span style={{ color: LIMA }}>/</span> tirzepatida.exe
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
  { n: "01", t: "FRITURA E GORDURA", at: T.n1 },
  { n: "02", t: "REFRIGERANTE", at: T.n2 },
  { n: "03", t: "BEBIDA ALCOÓLICA", at: T.n3 },
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
              {ab > 0.5 ? "EVITE" : "BLOQUEADO"}
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

// medidor em barra
const Medidor: React.FC<{ rot: string; valor: number; cor: string; top: number }> = ({ rot, valor, cor, top }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top }}>
    <div style={{ fontFamily: MONO, fontSize: 44, color: cor, marginBottom: 10 }}>{rot}</div>
    <div style={{ height: 56, borderRadius: 28, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${valor * 100}%`, background: cor, borderRadius: 28, boxShadow: `0 0 24px ${cor}` }} />
    </div>
  </div>
);
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
const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Titulo f={f} at={0} y={180} size={74}>
      TOMA <L>TIRZEPATIDA?</L>
      <br />
      EVITE ESTES 3
    </Titulo>
    {f < T.terceiro - 4 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: EMOJI, fontSize: 170 }}>🍟🥤🍺</div>
    )}
    {f >= T.terceiro - 4 && <Lista f={f - (T.terceiro - 4) + 8} y={440} />}
    <Aviso f={f} at={T.guarda - 2} top={1140} cor={AMBAR} size={44}>
      guarda isso: no final, <L>um sinal que você não pode ignorar</L>
    </Aviso>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Titulo f={f} at={T.lento0 + 4} y={240} size={62}>
      A TIRZEPATIDA DEIXA O
      <br />
      <L>ESTÔMAGO MAIS LENTO</L>
    </Titulo>
    <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", fontFamily: EMOJI, fontSize: 180 }}>🍽️🐢</div>
    <Medidor rot="> esvaziar o estômago" valor={it(f, T.lento - 20, T.lento + 14, 0.9, 0.28, OUT)} cor={AMBAR} top={800} />
    <Aviso f={f} at={T.tempo - 10} top={1030} cor={LIMA} size={48}>
      a comida fica <L>mais tempo</L> ali
    </Aviso>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Cabeca f={f} i={0} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: EMOJI, fontSize: 150 }}>🍟</div>
    <Titulo f={f} at={T.gordura - 6} y={570} size={50}>
      a gordura demora <L>ainda mais</L> para sair
    </Titulo>
    <Aviso f={f} at={T.enjoo - 8} top={720} cor={VERM} size={64}>
      resultado: enjoo
    </Aviso>
    <Titulo f={f} at={T.prefira - 6} y={930} size={48}>
      prefira
    </Titulo>
    <div style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.sopa}>sopa</Chip>
      <Chip f={f} at={T.torrada}>torrada</Chip>
      <br />
      <Chip f={f} at={T.porcoes}>porções pequenas</Chip>
    </div>
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Cabeca f={f} i={1} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: EMOJI, fontSize: 150 }}>🥤</div>
    <Titulo f={f} at={T.gas - 6} y={570} size={54}>
      o <L>gás</L> aumenta
    </Titulo>
    <div style={{ position: "absolute", top: 670, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.inchaco} cor={VERM}>inchaço</Chip>
      <br />
      <Chip f={f} at={T.cheio - 8} cor={VERM}>estômago cheio</Chip>
    </div>
    <Aviso f={f} at={T.agua - 12} top={980} cor={LIMA} size={54}>
      fique com <L>água</L> e bebidas <L>sem açúcar</L>
    </Aviso>
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Cabeca f={f} i={2} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: EMOJI, fontSize: 150 }}>🍺</div>
    <Titulo f={f} at={T.piorar - 10} y={570} size={54}>
      pode piorar
    </Titulo>
    <div style={{ position: "absolute", top: 670, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.piorar + 8} cor={VERM}>enjoo</Chip>
      <Chip f={f} at={T.tontura} cor={VERM}>tontura</Chip>
    </div>
    <Aviso f={f} at={T.proibida - 10} top={900} cor={AMBAR} size={50}>
      não é proibida para todo mundo,
      <br />
      <L>mas vá com cuidado</L>
    </Aviso>
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <Titulo f={f} at={T.alerta + 4} y={250} size={62}>
      O SINAL QUE EU PEDI
      <br />
      PARA <L>GUARDAR</L>
    </Titulo>
    <Aviso f={f} at={T.dor - 6} top={520} cor={VERM} size={64}>
      dor forte na barriga que não passa
    </Aviso>
    <Aviso f={f} at={T.procure - 6} top={820} cor={LIMA} size={60}>
      <L>procure atendimento</L>
    </Aviso>
    <Titulo f={f} at={T.salva - 4} y={1080} size={52}>
      📌 salva e manda para <L>quem usa caneta</L>
    </Titulo>
  </Cena>
);

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <Img
      src={staticFile("tirzepAlimentos/logo.jpg")}
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

export const VideoTirzepAlimentos: React.FC = () => {
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
      <Audio src={staticFile("tirzepAlimentos/narracao.mp3")} />
      <Audio src={staticFile("tirzepAlimentos/musica.wav")} volume={(fr) => musica(fr) * (1 - P(fr, DURATION_TIRZEP - 60, DURATION_TIRZEP))} />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaTirzepAlimentos: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <Titulo f={100} at={0} y={330} size={74}>
      TOMA <L>TIRZEPATIDA?</L>
      <br />
      EVITE ESTES 3
    </Titulo>
    <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: EMOJI, fontSize: 170 }}>🍟🥤🍺</div>
    <div style={{ position: "absolute", top: 850, left: 0, right: 0 }}>
      <Lista f={200} y={0} />
    </div>
  </AbsoluteFill>
);
