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

// "3 remédios que não combinam com álcool", Modelo 8 (lista neon): fundo preto com verde-limão neon,
// visual de interface, lista 01/02/03 com cadeados que destravam um a um e legenda curta no centro.
// Roteiro e fontes: roteiros/remedios_alcool.md. Narração feita pela usuária (OpenArt); tempos em fala.json.
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
  tudo: Tw("tudo"),
  tres: Tw("três"),
  n1: Tw("número", 1) - 6,
  antibiotico: Tw("antibiótico"),
  reacao: Tw("reação"),
  vermelhidao: Tw("vermelhidão"),
  vomito: Tw("vômito"),
  coracao: Tw("coração"),
  bula: Tw("bula"),
  depois: Tw("depois"),
  n2: Tw("número", 2) - 6,
  figado: Tw("fígado"),
  doses: Tw("três", 2),
  medico: Tw("médico"),
  passa: Tw("passa"),
  n3: Tw("número", 3) - 6,
  clonazepam: Tw("clonazepam"),
  diazepam: Tw("diazepam"),
  zolpidem: Tw("zolpidem"),
  somam: Tw("somam"),
  sono: Tw("sono"),
  respiracao: Tw("respiração"),
  perigosa: Tw("perigosa"),
  outros: Tw("outros") - 10,
  maioria: Tw("maioria"),
  ajuda: Tw("ajuda"),
  guarda: Tw("então") - 6,
  pergunta: Tw("pergunta"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_REMALCOOL = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.n1],
  [T.n1, T.n2],
  [T.n2, T.n3],
  [T.n3, T.outros],
  [T.outros, T.guarda],
  [T.guarda, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_REMALCOOL],
];
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [T.tudo, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.tres, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.n1, K + "interface/click-latch-medium.wav", 0.6],
  [T.vermelhidao, K + "pops/pop-small-in.wav", 0.35],
  [T.vomito, K + "pops/pop-small-in.wav", 0.35],
  [T.coracao, K + "pops/pop-small-in.wav", 0.35],
  [T.bula, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n2, K + "interface/click-latch-medium.wav", 0.6],
  [T.doses, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.passa, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.n3, K + "interface/click-latch-medium.wav", 0.6],
  [T.clonazepam, K + "pops/pop-small-in.wav", 0.35],
  [T.diazepam, K + "pops/pop-small-in.wav", 0.35],
  [T.zolpidem, K + "pops/pop-small-in.wav", 0.35],
  [T.perigosa, K + "impacts/impact-medium-hard.wav", 0.45],
  [T.outros, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.guarda, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.siga, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha retrô abaixando sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_REMALCOOL + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_REMALCOOL, fim + 6);
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
    farmacia <span style={{ color: LIMA }}>/</span> alcool-e-remedio.exe
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
  { n: "01", t: "METRONIDAZOL", at: T.n1 },
  { n: "02", t: "PARACETAMOL", at: T.n2 },
  { n: "03", t: "CALMANTES E SONÍFEROS", at: T.n3 },
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
              {ab > 0.5 ? "SEM ÁLCOOL" : "BLOQUEADO"}
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
    <Titulo f={f} at={2} y={180} size={82}>
      VAI <L>BEBER</L>
      <br />E TOMAR REMÉDIO?
    </Titulo>
    <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: EMOJI, fontSize: 180, transform: `translateX(${f > T.tudo && f < T.tudo + 14 ? Math.sin(f * 2) * 12 : 0}px)` }}>
      🍺⚡💊
    </div>
    {f >= T.tres - 6 && <Lista f={f - (T.tres - 6) + 8} y={880} />}
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Cabeca f={f} i={0} />
    <Titulo f={f} at={T.antibiotico - 6} y={410} size={48}>
      um <L>antibiótico</L> bem comum
    </Titulo>
    <Titulo f={f} at={T.reacao - 6} y={530} size={54}>
      com álcool: <span style={{ color: VERM }}>reação forte</span>
    </Titulo>
    <div style={{ position: "absolute", top: 660, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.vermelhidao} cor={VERM}>vermelhidão</Chip>
      <Chip f={f} at={T.vomito} cor={VERM}>vômito</Chip>
      <br />
      <Chip f={f} at={T.coracao} cor={VERM}>coração acelerado</Chip>
    </div>
    <Aviso f={f} at={T.bula - 6} top={1020}>
      a bula manda evitar
      <br />
      <L>durante o tratamento</L>
      <br />e por pelo menos <L>1 dia depois</L>
    </Aviso>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Cabeca f={f} i={1} />
    <Titulo f={f} at={T.n2 + 40} y={410} size={50}>
      em quem bebe com frequência
    </Titulo>
    <Medidor rot="> peso no fígado" valor={it(f, T.figado - 30, T.figado + 10, 0.25, 0.85)} cor={VERM} top={540} />
    <Aviso f={f} at={T.doses - 6} top={780}>
      <span style={{ fontFamily: DISPLAY, fontSize: 96, color: AMBAR }}>3+</span>
      <br />
      doses de bebida por dia?
      <br />
      <L>fale com o médico antes</L>
    </Aviso>
    <Aviso f={f} at={T.passa - 6} top={1240} cor={VERM} size={54}>
      nunca passe da dose
    </Aviso>
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Cabeca f={f} i={2} />
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.clonazepam}>clonazepam</Chip>
      <Chip f={f} at={T.diazepam}>diazepam</Chip>
      <br />
      <Chip f={f} at={T.zolpidem}>zolpidem</Chip>
    </div>
    {f >= T.somam - 10 && (
      <>
        <Titulo f={f} at={T.somam - 10} y={700} size={54}>
          juntos, os efeitos <L>se somam</L>
        </Titulo>
        <Medidor rot="> sono" valor={it(f, T.sono - 6, T.sono + 20, 0.4, 0.97, OUT)} cor={AMBAR} top={830} />
        <Medidor rot="> respiração" valor={it(f, T.respiracao - 4, T.respiracao + 24, 0.85, 0.22, OUT)} cor={VERM} top={1010} />
      </>
    )}
    <Aviso f={f} at={T.perigosa - 8} top={1220} cor={VERM} size={52}>
      combinação perigosa
    </Aviso>
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Titulo f={f} at={T.outros + 4} y={220} size={76}>
      E OS <L>OUTROS</L>
      <br />
      ANTIBIÓTICOS?
    </Titulo>
    <Aviso f={f} at={T.maioria - 6} top={620} cor={LIMA}>
      com a maioria, uma dose pequena
      <br />
      <L>não corta o efeito</L>
    </Aviso>
    <Aviso f={f} at={T.ajuda - 10} top={960} cor={AMBAR}>
      mas a bebida não ajuda
      <br />
      na recuperação
    </Aviso>
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <Titulo f={f} at={T.guarda + 4} y={260} size={96}>
      GUARDA <L>ESSA</L>
    </Titulo>
    <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: EMOJI, fontSize: 170, opacity: it(f, T.guarda + 10, T.guarda + 24, 0, 1) }}>👩‍⚕️</div>
    <Aviso f={f} at={T.pergunta - 10} top={800} cor={LIMA} size={56}>
      vai beber e está tomando remédio?
      <br />
      <L>pergunte antes ao farmacêutico</L>
    </Aviso>
  </Cena>
);

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

export const VideoRemAlcool: React.FC = () => {
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
      <Audio src={staticFile("remalcool/narracao.mp3")} />
      <Audio src={staticFile("remalcool/musica.wav")} volume={(fr) => musica(fr) * (1 - P(fr, DURATION_REMALCOOL - 60, DURATION_REMALCOOL))} />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaRemAlcool: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <Titulo f={100} at={0} y={330} size={84}>
      3 REMÉDIOS QUE
      <br />
      <L>NÃO COMBINAM</L>
      <br />
      COM ÁLCOOL
    </Titulo>
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: EMOJI, fontSize: 170 }}>🍺⚡💊</div>
    <div style={{ position: "absolute", top: 1000, left: 0, right: 0 }}>
      <Lista f={200} y={0} />
    </div>
  </AbsoluteFill>
);
