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

// "Exagerou nesse fim de semana? 3 erros que pioram a ressaca", Modelo 8 (lista neon, 3 erros + o que ajuda).
// Roteiro e fontes: roteiros/ressaca_3_erros.md. Narração da usuária (ElevenLabs v4); tempos em fala.json.
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
  erros: Tw("erros"),
  ajuda: Tw("ajuda"),
  n1: Tw("erro", 1) - 6,
  comida: Tw("comida"),
  dica: Tw("dica"),
  n2: Tw("erro", 2) - 6,
  agua: Tw("água", 1),
  acet: Tw("acetaldeído"),
  infl: Tw("inflamação"),
  sono: Tw("sono"),
  escura: Tw("escura"),
  n3: Tw("erro", 3) - 6,
  para: Tw("paracetamol"),
  anti: Tw("anti-inflamatório"),
  duvida: Tw("dúvida"),
  agora: Tw("agora") - 6,
  agua2: Tw("água", 2),
  comida2: Tw("comida", 2),
  descanso: Tw("descanso"),
  esquece: Tw("esquece"),
  adia: Tw("adia"),
  nenhum: Tw("nenhum") - 6,
  funciona: Tw("funciona"),
  manda: Tw("manda"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_RESSACA = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.n1],
  [T.n1, T.n2],
  [T.n2, T.n3],
  [T.n3, T.agora],
  [T.agora, T.nenhum],
  [T.nenhum, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_RESSACA],
];
// FIM TEMPOS

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [T.erros, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.ajuda, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n1, K + "interface/click-latch-medium.wav", 0.6],
  [T.dica, K + "pops/pop-small-in.wav", 0.35],
  [T.n2, K + "interface/click-latch-medium.wav", 0.6],
  [T.acet, K + "pops/pop-small-in.wav", 0.35],
  [T.infl, K + "pops/pop-small-in.wav", 0.35],
  [T.sono, K + "pops/pop-small-in.wav", 0.35],
  [T.escura, K + "notifications/notification-alert-soft.wav", 0.35],
  [T.n3, K + "interface/click-latch-medium.wav", 0.6],
  [T.anti, K + "impacts/impact-medium-hard.wav", 0.35],
  [T.agora, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.agua2, K + "pops/pop-small-in.wav", 0.35],
  [T.comida2, K + "pops/pop-small-in.wav", 0.35],
  [T.descanso, K + "pops/pop-small-in.wav", 0.35],
  [T.adia, K + "impacts/impact-medium-hard.wav", 0.4],
  [T.nenhum, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.siga, K + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
  [T.final + 6, K + "logo-stings/sting-airy-long.wav", 0.55],
];

// trilha retrô abaixando sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_RESSACA + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_RESSACA, fim + 6);
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
    farmacia <span style={{ color: LIMA }}>/</span> ressaca.exe
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
  { n: "01", t: "ESTÔMAGO VAZIO", at: T.n1 },
  { n: "02", t: "ACHAR QUE É SÓ ÁGUA", at: T.n2 },
  { n: "03", t: "O REMÉDIO ERRADO", at: T.n3 },
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

// carimbo vermelho torto (não usado neste vídeo)
export const Carimbo: React.FC<{ f: number; at: number; top: number; children: React.ReactNode }> = ({ f, at, top, children }) => {
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

const Check: React.FC<{ f: number; at: number; top: number; children: React.ReactNode }> = ({ f, at, top, children }) => {
  if (f < at - 4) return null;
  const k = it(f, at - 4, at + 6, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: 140, right: 100, top, display: "flex", alignItems: "center", gap: 28, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
      <span style={{ width: 70, height: 70, borderRadius: 18, background: LIMA, color: PRETO, fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${LIMA}88` }}>✓</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 58, color: TEXTO }}>{children}</span>
    </div>
  );
};

const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Titulo f={f} at={0} y={190} size={80}>
      EXAGEROU NO
      <br />
      <L>FIM DE SEMANA?</L>
    </Titulo>
    {f < T.erros - 4 && <Emo top={520} size={190}>🍻😵</Emo>}
    {f >= T.erros - 4 && <Lista f={f - (T.erros - 4) + 8} y={440} />}
    <Aviso f={f} at={T.ajuda - 4} top={1180} cor={LIMA} size={46}>
      + o que <L>ajuda de verdade</L>
    </Aviso>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Cabeca f={f} i={0} />
    <Emo top={390}>🍽️🍸</Emo>
    <Titulo f={f} at={T.comida - 6} y={600} size={54}>
      com comida, o álcool
      <br />
      <L>entra mais devagar</L> no sangue
    </Titulo>
    <Aviso f={f} at={T.dica - 4} top={960} cor={LIMA} size={54}>
      coma <L>antes</L> de beber
    </Aviso>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Cabeca f={f} i={1} />
    <Emo top={380} size={130}>💧</Emo>
    <Titulo f={f} at={T.agua - 8} y={560} size={52}>
      não é <L>só falta de água</L>
    </Titulo>
    <div style={{ position: "absolute", top: 680, left: 0, right: 0, textAlign: "center", lineHeight: 2.1 }}>
      <Chip f={f} at={T.acet} cor={AMBAR}>acetaldeído</Chip>
      <Chip f={f} at={T.infl} cor={AMBAR}>inflamação</Chip>
      <br />
      <Chip f={f} at={T.sono} cor={AMBAR}>sono ruim</Chip>
    </div>
    <Aviso f={f} at={T.escura - 6} top={1020} cor={VERM} size={48}>
      bebida <span style={{ color: VERM }}>escura</span> costuma piorar
    </Aviso>
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Cabeca f={f} i={2} />
    <Emo top={380}>💊</Emo>
    <Aviso f={f} at={T.para - 6} top={570} cor={AMBAR} size={46}>
      paracetamol → <span style={{ color: AMBAR }}>fígado</span> que acabou de trabalhar com o álcool
    </Aviso>
    <Aviso f={f} at={T.anti - 6} top={820} cor={VERM} size={46}>
      anti-inflamatório → <span style={{ color: VERM }}>estômago</span> ainda mais irritado
    </Aviso>
    <Aviso f={f} at={T.duvida - 6} top={1070} cor={LIMA} size={54}>
      na dúvida, <L>pergunte ao farmacêutico</L>
    </Aviso>
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Titulo f={f} at={T.agora + 4} y={200} size={84}>
      O QUE <L>AJUDA</L>
    </Titulo>
    <Check f={f} at={T.agua2} top={420}>água ou soro</Check>
    <Check f={f} at={T.comida2} top={560}>comida leve</Check>
    <Check f={f} at={T.descanso} top={700}>descanso</Check>
    <Aviso f={f} at={T.esquece - 4} top={900} cor={VERM} size={50}>
      cerveja no dia seguinte?
      <br />
      <span style={{ color: VERM }}>só adia a ressaca</span>
    </Aviso>
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <Titulo f={f} at={T.nenhum + 4} y={240} size={70}>
      NENHUM REMÉDIO
      <br />
      <L>CURA RESSACA</L>
    </Titulo>
    <Aviso f={f} at={T.funciona - 4} top={560} cor={LIMA} size={56}>
      menos · devagar · <L>com água</L>
    </Aviso>
    <Titulo f={f} at={T.manda - 4} y={900} size={50}>
      📌 manda para aquele amigo
      <br />
      <L>que exagerou ontem</L>
    </Titulo>
  </Cena>
);

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <Img
      src={staticFile("ressaca/logo.jpg")}
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

export const VideoRessaca: React.FC = () => {
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
      <Audio src={staticFile("ressaca/narracao.mp3")} />
      <Audio src={staticFile("ressaca/musica.wav")} volume={(fr) => musica(fr) * (1 - P(fr, DURATION_RESSACA - 60, DURATION_RESSACA))} />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaRessaca: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <Titulo f={100} at={0} y={330} size={76}>
      EXAGEROU NO
      <br />
      <L>FIM DE SEMANA?</L>
    </Titulo>
    <Emo top={600} size={140}>🍻😵</Emo>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0 }}>
      <Lista f={9999} y={0} />
    </div>
    <Titulo f={100} at={0} y={1460} size={52}>
      3 erros que <L>pioram a ressaca</L>
    </Titulo>
  </AbsoluteFill>
);
