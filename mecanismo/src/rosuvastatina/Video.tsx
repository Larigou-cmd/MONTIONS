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

// "Rosuvastatina não é igual à sinvastatina", Modelo 8 (lista neon, 3 coisas).
// Roteiro e fontes: roteiros/rosuvastatina_3_coisas.md. Narração: Juliana (ElevenLabs v4); tempos em fala.json.
type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
const T = {
  isso: Tw("isso"),
  n1: Tw("número", 1) - 6,
  noite: Tw("noite", 1),
  sinva2: Tw("sinvastatina", 2),
  precisa: Tw("precisa"),
  tempo: Tw("tempo"),
  manha: Tw("manhã"),
  tarde: Tw("tarde"),
  noite2: Tw("noite", 2),
  segredo: Tw("segredo"),
  n2: Tw("número", 2) - 6,
  azia: Tw("azia"),
  aluminio: Tw("alumínio"),
  magnesio: Tw("magnésio"),
  metade: Tw("metade"),
  tome: Tw("tome"),
  horas: Tw("horas"),
  n3: Tw("número", 3) - 6,
  dor: Tw("dor"),
  fraqueza: Tw("fraqueza"),
  urina: Tw("urina"),
  procure: Tw("procure"),
  raro: Tw("raro"),
  nunca: Tw("nunca"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ROSUVA = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.n1],
  [T.n1, T.n2],
  [T.n2, T.n3],
  [T.n3, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_ROSUVA],
];


// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [T.isso, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.n1, K + "interface/click-latch-medium.wav", 0.6],
  [T.noite, K + "pops/pop-small-in.wav", 0.35],
  [T.precisa, K + "pops/pop-small-in.wav", 0.35],
  [T.manha, K + "pops/pop-small-in.wav", 0.3],
  [T.tarde, K + "pops/pop-small-in.wav", 0.3],
  [T.noite2, K + "pops/pop-small-in.wav", 0.3],
  [T.segredo, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n2, K + "interface/click-latch-medium.wav", 0.6],
  [T.aluminio, K + "pops/pop-small-in.wav", 0.35],
  [T.metade, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.tome, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n3, K + "interface/click-latch-medium.wav", 0.6],
  [T.urina, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.nunca, K + "pops/pop-small-in.wav", 0.35],
  [T.siga, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
  [T.final + 6, K + "logo-stings/sting-airy-long.wav", 0.55],
];

// trilha retrô abaixando sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_ROSUVA + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_ROSUVA, fim + 6);
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
    farmacia <span style={{ color: LIMA }}>/</span> rosuvastatina.exe
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
  { n: "01", t: "O HORÁRIO", at: T.n1 },
  { n: "02", t: "O ANTIÁCIDO", at: T.n2 },
  { n: "03", t: "O SINAL DE ALERTA", at: T.n3 },
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
                background: ab > 0.5 ? LIMA : CINZA,
                borderRadius: 999,
                padding: "8px 16px",
              }}
            >
              {ab > 0.5 ? "ABERTO" : "BLOQUEADO"}
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

// coluna do "versus" (sinvastatina × rosuvastatina)
const Coluna: React.FC<{ f: number; at: number; x: number; nome: string; emo: string; quando: string; cor: string }> = ({ f, at, x, nome, emo, quando, cor }) => {
  if (f < at - 4) return null;
  const k = it(f, at - 4, at + 8, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 400,
        width: 450,
        height: 430,
        borderRadius: 26,
        border: `3px solid ${cor}`,
        background: `${cor}12`,
        boxShadow: `0 0 36px ${cor}33`,
        textAlign: "center",
        opacity: k,
        transform: `scale(${0.85 + 0.15 * k})`,
      }}
    >
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: TEXTO, marginTop: 34 }}>{nome}</div>
      <div style={{ fontFamily: EMOJI, fontSize: 140, marginTop: 20 }}>{emo}</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, color: cor, marginTop: 16 }}>{quando}</div>
    </div>
  );
};

// barra "no sangue" que cai pela metade
const BarraSangue: React.FC<{ f: number; at: number; top: number }> = ({ f, at, top }) => {
  if (f < at - 30) return null;
  const k = it(f, at, at + 18, 0, 1, OUT);
  const pct = 100 - 50 * k;
  const cor = k > 0.5 ? VERM : LIMA;
  return (
    <div style={{ position: "absolute", left: 100, right: 100, top }}>
      <div style={{ fontFamily: MONO, fontSize: 42, color: CINZA, marginBottom: 12 }}>
        ROSUVASTATINA NO SANGUE <span style={{ color: cor }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 46, borderRadius: 23, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: cor, boxShadow: `0 0 24px ${cor}` }} />
      </div>
    </div>
  );
};

const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Titulo f={f} at={0} y={200} size={74}>
      <L>ROSUVASTATINA</L>
      <br />≠ SINVASTATINA
    </Titulo>
    {f < T.isso - 4 && <Emo top={560} size={190}>💊 ≠ 💊</Emo>}
    {f >= T.isso - 4 && <Lista f={f - (T.isso - 4) + 8} y={460} />}
    <Aviso f={f} at={T.isso - 2} top={1190} cor={LIMA} size={46}>
      e isso muda <L>como você toma</L>
    </Aviso>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Cabeca f={f} i={0} />
    {f < T.sinva2 - 4 && (
      <Titulo f={f} at={T.n1 + 14} y={560} size={70}>
        <L>quando</L> tomar?
      </Titulo>
    )}
    <Coluna f={f} at={T.sinva2} x={60} nome="sinvastatina" emo="🌙" quando="à noite" cor={AMBAR} />
    <Coluna f={f} at={T.precisa - 4} x={570} nome="rosuvastatina" emo="🕒" quando="qualquer hora" cor={LIMA} />
    <div style={{ position: "absolute", top: 870, left: 0, right: 0, textAlign: "center" }}>
      <Chip f={f} at={T.manha}>manhã</Chip>
      <Chip f={f} at={T.tarde}>tarde</Chip>
      <Chip f={f} at={T.noite2}>noite</Chip>
    </div>
    <Titulo f={f} at={T.tempo - 6} y={1000} size={44}>
      ela fica <L>muito tempo</L> no corpo
    </Titulo>
    <Aviso f={f} at={T.segredo - 4} top={1140} cor={LIMA} size={52}>
      segredo: <L>sempre no mesmo horário</L>
    </Aviso>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Cabeca f={f} i={1} />
    <Emo top={380} size={130}>💊 + 🔥</Emo>
    <Titulo f={f} at={T.azia - 6} y={560} size={48}>
      remédio para <L>azia</L>
    </Titulo>
    <div style={{ position: "absolute", top: 650, left: 0, right: 0, textAlign: "center" }}>
      <Chip f={f} at={T.aluminio} cor={AMBAR}>alumínio</Chip>
      <Chip f={f} at={T.magnesio} cor={AMBAR}>magnésio</Chip>
    </div>
    <BarraSangue f={f} at={T.metade - 4} top={800} />
    <Aviso f={f} at={T.tome - 4} top={1060} cor={LIMA} size={50}>
      💊 rosuvastatina <L>→ 2 h →</L> antiácido
    </Aviso>
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Cabeca f={f} i={2} />
    {f < T.dor - 6 && (
      <Titulo f={f} at={T.n3 + 10} y={600} size={70}>
        o <L>mais importante</L>
      </Titulo>
    )}
    {f >= T.dor - 6 && <Emo top={380} size={130}>💪⚡</Emo>}
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <Chip f={f} at={T.dor} cor={AMBAR}>dor</Chip>
      <Chip f={f} at={T.fraqueza} cor={AMBAR}>fraqueza</Chip>
    </div>
    <Aviso f={f} at={T.urina - 4} top={700} cor={VERM} size={50}>
      + urina <span style={{ color: VERM }}>escura, cor de chá</span>
    </Aviso>
    <Aviso f={f} at={T.procure - 4} top={900} cor={AMBAR} size={50}>
      procure atendimento <span style={{ color: AMBAR }}>logo</span>
      {f >= T.raro - 4 && <div style={{ fontSize: 34, color: CINZA, marginTop: 8 }}>é raro, mas pode ser lesão no músculo</div>}
    </Aviso>
    <Aviso f={f} at={T.nunca - 4} top={1160} cor={LIMA} size={46}>
      nunca pare sozinho: <L>fale com seu médico</L>
    </Aviso>
    {f >= T.salva - 4 && (
      <Titulo f={f} at={T.salva - 4} y={1390} size={46}>
        📌 salva para <L>não esquecer</L>
      </Titulo>
    )}
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Img
      src={staticFile("rosuvastatina/logo.jpg")}
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

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <Titulo f={f} at={T.final + 4} y={720} size={70}>
      CONSULTE UM
      <br />
      <L>PROFISSIONAL DE SAÚDE</L>
      <br />
      PARA ORIENTAÇÕES.
    </Titulo>
  </Cena>
);

export const VideoRosuvastatina: React.FC = () => {
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
      <Legenda f={f} />
      <Audio src={staticFile("rosuvastatina/narracao.mp3")} />
      <Audio src={staticFile("ressaca/musica.wav")} volume={(fr) => musica(fr) * (1 - P(fr, DURATION_ROSUVA - 60, DURATION_ROSUVA))} />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaRosuvastatina: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <Titulo f={100} at={0} y={330} size={70}>
      <L>ROSUVASTATINA</L>
      <br />≠ SINVASTATINA
    </Titulo>
    <div style={{ position: "absolute", top: 620, left: 0, right: 0 }}>
      <Lista f={9999} y={0} />
    </div>
    <Titulo f={100} at={0} y={1340} size={52}>
      3 coisas que <L>mudam como você toma</L>
    </Titulo>
  </AbsoluteFill>
);
