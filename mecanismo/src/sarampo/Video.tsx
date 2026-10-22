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
import {
  Fundo,
  Janela,
  K,
  Linha,
  PIX,
  Pixelado,
  Selo,
  Titulo,
  VT,
} from "../noticiaBotox/Explicadora";
import boca from "./boca.json";
import palavras from "../../audio/sarampo_palavras.json";

// "Notícias da Farmácia" #2: preciso tomar a vacina do sarampo de novo? Mesmo estilo explicadora do #1
// (fundo quadriculado, título pixel, janelinhas, legenda palavra por palavra e a repórter no canto).
// Narração gravada pela Larissa (ElevenLabs, Juliana). Tempos: audio/sarampo_palavras.json (quadro = segundos × 30).

// TEMPOS
export const T = {
  alerta: 112,
  vem: 235,
  eua: 284,
  anos35: 436,
  noventa: 502,
  brasil: 611,
  casos52: 688,
  circulando: 816,
  chegar: 916,
  contagiosas: 1004,
  nove: 1123,
  pneumonia: 1274,
  cerebro: 1319,
  morte: 1363,
  triplice: 1458,
  emDia: 1571,
  doze: 1642,
  quinze: 1678,
  ate29: 1706,
  ate59: 1805,
  profissionais: 1921,
  protegido: 2097,
  agora: 2202,
  perdeu: 2265,
  vacine: 2359,
  malNao: 2409,
  viajar: 2468,
  paises: 2545,
  antes15: 2614,
  excecao: 2734,
  casosRegiao: 2786,
  bloqueio: 2900,
  extra: 2993,
  sp: 3077,
  doseZero: 3211,
  atencao: 3367,
  vivo: 3468,
  gestantes: 3530,
  imunidade: 3580,
  engravidar: 3660,
  conferir: 3788,
  caderneta: 3862,
  app: 3911,
  gratis: 3966,
  sintomas: 4068,
  febre: 4125,
  manchas: 4146,
  tosse: 4211,
  nariz: 4223,
  olhos: 4262,
  atendimento: 4302,
  siga: 4446,
  final: 4596,
};
export const DURATION = 4726; // 157,5 s (narração de 152,3 s + mensagem final)
export const PARTES: [number, number][] = [
  [0, 277],
  [277, 942],
  [942, 1434],
  [1434, 2042],
  [2042, 2202],
  [2202, 2734],
  [2734, 3367],
  [3367, 3788],
  [3788, 4068],
  [4068, 4446],
  [4446, 4596],
  [4596, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const cena = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];

// ---------- peças ----------
// emoji grande que "salta" no tempo da fala
const Icone: React.FC<{ f: number; at: number; x: number; y: number; e: string; size?: number }> = ({
  f,
  at,
  x,
  y,
  e,
  size = 90,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * k})`,
        opacity: Math.min(1, k * 1.5),
        fontFamily: EMOJI,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      {e}
    </div>
  );
};
// número grande dentro da janela
const Numero: React.FC<{ f: number; at: number; x: number; y: number; texto: string; legenda: string; cor?: string }> = ({
  f,
  at,
  x,
  y,
  texto,
  legenda,
  cor = K.vermelho,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 320,
        textAlign: "center",
        opacity: Math.min(1, k * 1.5),
        transform: `scale(${0.7 + 0.3 * k})`,
      }}
    >
      <div style={{ fontFamily: PIX, fontSize: 64, color: cor, lineHeight: "84px" }}>{texto}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: K.tinta, lineHeight: 1.2 }}>{legenda}</div>
    </div>
  );
};
// cartão de faixa etária
const Faixa: React.FC<{ f: number; at: number; y: number; icone: string; idade: string; doses: string; cor?: string }> = ({
  f,
  at,
  y,
  icone,
  idade,
  doses,
  cor = K.azul,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        top: y,
        width: 830,
        height: 104,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "0 22px",
        boxSizing: "border-box",
        border: `4px solid ${K.tinta}`,
        background: K.branco,
        boxShadow: `6px 6px 0 ${K.tinta}`,
        opacity: Math.min(1, k * 1.5),
        transform: `translateX(${(1 - k) * -60}px)`,
      }}
    >
      <span style={{ fontFamily: EMOJI, fontSize: 52 }}>{icone}</span>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: K.tinta, flex: 1 }}>{idade}</span>
      <span style={{ fontFamily: PIX, fontSize: 26, color: K.branco, background: cor, padding: "12px 14px", border: `3px solid ${K.tinta}` }}>
        <Pixelado texto={doses} size={26} />
      </span>
    </div>
  );
};

// pessoas: um doente no centro passa o vírus para 9 de 10 não vacinadas
const Contagio: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const k = P(f, at, at + 40);
  return (
    <svg width={890} height={500} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 10 }, (_, i) => {
        const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const x = 445 + Math.cos(ang) * 300;
        const y = 240 + Math.sin(ang) * 190;
        const vac = i === 3;
        const pega = !vac && k > i / 10;
        const cor = vac ? K.azul : pega ? K.vermelho : "#94a3b8";
        return (
          <g key={i}>
            {f >= at && (
              <line x1={445} y1={240} x2={x} y2={y} stroke={vac ? "#cbd5e1" : K.vermelho} strokeWidth={4} strokeDasharray="10 10" opacity={vac ? 0.5 : 0.5 * Math.max(0, Math.min(1, k * 10 - i))} />
            )}
            <circle cx={x} cy={y - 22} r={18} fill={cor} stroke={K.tinta} strokeWidth={4} />
            <rect x={x - 22} y={y - 2} width={44} height={40} rx={12} fill={cor} stroke={K.tinta} strokeWidth={4} />
            {vac && f >= at + 10 && <text x={x + 26} y={y - 30} fontFamily={EMOJI} fontSize={36}>🛡️</text>}
          </g>
        );
      })}
      <circle cx={445} cy={212} r={26} fill={K.vermelho} stroke={K.tinta} strokeWidth={5} />
      <rect x={415} y={244} width={60} height={56} rx={14} fill={K.vermelho} stroke={K.tinta} strokeWidth={5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={430 + (i % 3) * 15} cy={200 + Math.floor(i / 3) * 18} r={4} fill={K.amarelo} />
      ))}
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
  if (f >= T.siga - 4) return null;
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
  if (f >= R(11)[0] + 10) return null;
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
        opacity: 1 - P(f, R(11)[0], R(11)[0] + 10),
        filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))",
      }}
    >
      <Reporter f={f} boca={boca as number[]} />
    </div>
  );
};

const Plantao: React.FC<{ f: number }> = ({ f }) => (
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
    <span style={{ display: "inline-block", width: 22, height: 22, background: K.vermelho, marginRight: 16 }} />
    <Pixelado texto="NOTÍCIAS DA FARMÁCIA #2" size={26} />
  </div>
);

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 0) ? null : (
    <>
      <Plantao f={f} />
      <Titulo f={f} at={4} linhas={[[{ t: "VACINA DO" }], [{ t: "SARAMPO", cor: K.vermelho }], [{ t: "DE NOVO?" }]]} size={64} />
      <Janela f={f} at={T.alerta - 10} y={600} h={480} titulo="ministério da saúde · alerta">
        <Icone f={f} at={T.alerta - 4} x={445} y={150} e="💉" size={140} />
        <Selo f={f} at={T.alerta + 14} x={445} y={330} texto="ALERTA" size={40} />
      </Janela>
    </>
  );

const S2: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 1) ? null : (
    <>
      <Titulo f={f} at={R(1)[0]} linhas={[[{ t: "SARAMPO NAS" }], [{ t: "AMÉRICAS", cor: K.vermelho }]]} size={56} />
      <Janela f={f} at={T.eua} y={480} h={330} titulo="estados unidos">
        <Icone f={f} at={T.eua + 4} x={110} y={120} e="🇺🇸" size={110} />
        <Numero f={f} at={T.anos35} x={200} y={20} texto="+35" legenda="anos sem tantos casos" />
        <Numero f={f} at={T.noventa} x={545} y={20} texto="90%" legenda="dos doentes não estavam vacinados" />
      </Janela>
      <Janela f={f} at={T.brasil} y={850} h={330} titulo="brasil · 2026">
        <Icone f={f} at={T.brasil + 4} x={110} y={120} e="🇧🇷" size={110} />
        <Numero f={f} at={T.casos52} x={200} y={20} texto="52" legenda="casos, todos vindos de fora" cor={K.laranja} />
        <Numero f={f} at={T.circulando} x={545} y={20} texto="0" legenda="circulação do vírus aqui" cor={K.verde} />
      </Janela>
      <Selo f={f} at={T.chegar} x={540} y={830} texto="RISCO DE CHEGAR" size={30} cor={K.laranja} />
    </>
  );

const S3: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 2) ? null : (
    <>
      <Titulo f={f} at={R(2)[0]} linhas={[[{ t: "SUPER" }], [{ t: "CONTAGIOSO", cor: K.vermelho }]]} size={60} />
      <Janela f={f} at={T.contagiosas - 20} y={500} h={560} titulo="1 doente → 9 de 10 sem vacina">
        {f >= T.contagiosas && <Contagio f={f} at={T.nove - 20} />}
      </Janela>
      <div
        style={{
          position: "absolute",
          top: 1090,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {(
          [
            ["pneumonia", T.pneumonia],
            ["encefalite", T.cerebro],
            ["morte", T.morte],
          ] as [string, number][]
        ).map(([t, at]) => (
          <span
            key={t}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 36,
              color: K.branco,
              background: K.vermelho,
              border: `4px solid ${K.tinta}`,
              padding: "8px 18px",
              opacity: P(f, at, at + 8),
              transform: `scale(${0.6 + 0.4 * it(f, at, at + 12, 0, 1, SNAP)})`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );

const S4: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 3) ? null : (
    <>
      <Titulo f={f} at={R(3)[0]} linhas={[[{ t: "TRÍPLICE" }], [{ t: "VIRAL", cor: K.azul }]]} size={60} />
      <div style={{ position: "absolute", top: 450, width: 1080, textAlign: "center", fontFamily: VT, fontSize: 44, color: K.tinta, opacity: P(f, T.triplice + 30, T.triplice + 44) }}>
        sarampo + caxumba + rubéola
      </div>
      <Janela f={f} at={T.emDia} y={530} h={630} titulo="quem está em dia ✓">
        <Faixa f={f} at={T.doze} y={20} icone="👶" idade="criança: 12 e 15 meses" doses="2 DOSES" />
        <Faixa f={f} at={T.ate29} y={150} icone="🧑" idade="de 1 a 29 anos" doses="2 DOSES" />
        <Faixa f={f} at={T.ate59} y={280} icone="🧔" idade="de 30 a 59 anos" doses="1 DOSE" />
        <Faixa f={f} at={T.profissionais} y={410} icone="🩺" idade="profissional de saúde" doses="2 DOSES" cor={K.verde} />
      </Janela>
    </>
  );

const S5: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 4) ? null : (
    <>
      <Titulo f={f} at={R(4)[0]} linhas={[[{ t: "JÁ ESTÁ" }], [{ t: "EM DIA?", cor: K.verde }]]} size={64} />
      <Janela f={f} at={R(4)[0] + 10} y={520} h={560} titulo="caderneta de vacinação">
        <Icone f={f} at={R(4)[0] + 16} x={445} y={170} e="📒" size={170} />
        <Icone f={f} at={T.protegido - 10} x={560} y={110} e="✅" size={90} />
        <div style={{ position: "absolute", top: 320, width: 890, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Linha f={f} at={T.protegido} size={48} cor={K.verde}>
            protegido!
          </Linha>
          <Linha f={f} at={T.protegido + 24} size={40} fundo={K.amarelo}>
            não precisa tomar de novo
          </Linha>
        </div>
      </Janela>
    </>
  );

const S6: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 5) ? null : (
    <>
      <Titulo f={f} at={R(5)[0]} linhas={[[{ t: "QUEM DEVE" }], [{ t: "TOMAR", cor: K.laranja }]]} size={64} />
      <Janela f={f} at={T.agora + 10} y={500} h={340} titulo="vá ao posto se…">
        <div style={{ position: "absolute", inset: 30, display: "flex", flexDirection: "column", gap: 16 }}>
          <Linha f={f} at={T.agora + 20}>❌ não tem as doses</Linha>
          <Linha f={f} at={T.perdeu}>📒 perdeu a caderneta</Linha>
          <Linha f={f} at={T.perdeu + 40}>🤔 não lembra</Linha>
        </div>
        <Selo f={f} at={T.malNao} x={680} y={200} texto="DOSE A MAIS: OK" size={22} cor={K.verde} />
      </Janela>
      <Janela f={f} at={T.viajar} y={880} h={300} titulo="vai viajar? ✈️">
        <div style={{ position: "absolute", inset: 26, display: "flex", flexDirection: "column", gap: 14 }}>
          <Linha f={f} at={T.paises} size={38}>🇺🇸 EUA · 🇲🇽 México · 🇨🇦 Canadá</Linha>
          <Linha f={f} at={T.antes15} size={42} fundo={K.amarelo}>
            vacine 15 dias antes
          </Linha>
        </div>
      </Janela>
    </>
  );

const S7: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 6) ? null : (
    <>
      <Titulo f={f} at={R(6)[0]} linhas={[[{ t: "A EXCEÇÃO:" }], [{ t: "BLOQUEIO", cor: K.vermelho }]]} size={60} />
      <Janela f={f} at={T.casosRegiao} y={500} h={360} titulo="casos na região 📍">
        <div style={{ position: "absolute", inset: 30, display: "flex", flexDirection: "column", gap: 16 }}>
          <Linha f={f} at={T.bloqueio} size={44}>bloqueio vacinal</Linha>
          <Linha f={f} at={T.extra} size={40} fundo={K.amarelo}>
            dose extra para todos
          </Linha>
          <Linha f={f} at={T.extra + 30} size={34} cor={K.cinza}>
            mesmo quem já está em dia
          </Linha>
        </div>
      </Janela>
      <Janela f={f} at={T.sp} y={900} h={290} titulo="2026 · são paulo">
        <div style={{ position: "absolute", inset: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <Linha f={f} at={T.sp + 30} size={34}>São Paulo · Guarulhos · S. Bernardo</Linha>
          <Linha f={f} at={T.doseZero} size={36} cor={K.azul}>
            👶 6 a 11 meses: dose zero
          </Linha>
        </div>
      </Janela>
    </>
  );

const S8: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 7) ? null : (
    <>
      <Titulo f={f} at={R(7)[0]} linhas={[[{ t: "QUEM NÃO" }], [{ t: "PODE TOMAR", cor: K.vermelho }]]} size={60} />
      <Janela f={f} at={T.vivo - 10} y={500} h={620} titulo="vírus vivo enfraquecido 🦠">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 26 }}>
          <Linha f={f} at={T.gestantes} size={48} cor={K.vermelho}>
            🤰 gestantes
          </Linha>
          <Linha f={f} at={T.imunidade} size={48} cor={K.vermelho}>
            🛡️ imunidade muito baixa
          </Linha>
          <Linha f={f} at={T.engravidar} size={40} fundo={K.amarelo}>
            📅 30 dias sem engravidar
          </Linha>
          <Linha f={f} at={T.engravidar + 20} size={32} cor={K.cinza}>
            depois de tomar a vacina
          </Linha>
        </div>
      </Janela>
    </>
  );

const S9: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 8) ? null : (
    <>
      <Titulo f={f} at={R(8)[0]} linhas={[[{ t: "COMO" }], [{ t: "CONFERIR", cor: K.azul }]]} size={64} />
      <Janela f={f} at={T.caderneta - 10} y={500} h={560} titulo="onde ver suas vacinas">
        <Icone f={f} at={T.caderneta} x={260} y={180} e="📒" size={150} />
        <Icone f={f} at={T.app} x={620} y={180} e="📱" size={150} />
        <div style={{ position: "absolute", top: 300, left: 0, width: 890, display: "flex", justifyContent: "space-around", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: K.tinta }}>
          <span style={{ opacity: P(f, T.caderneta, T.caderneta + 10) }}>caderneta</span>
          <span style={{ opacity: P(f, T.app, T.app + 10) }}>Meu SUS Digital</span>
        </div>
        <Selo f={f} at={T.gratis + 10} x={445} y={430} texto="GRÁTIS NO SUS" size={34} cor={K.verde} />
      </Janela>
    </>
  );

const S10: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 9) ? null : (
    <>
      <Titulo f={f} at={R(9)[0]} linhas={[[{ t: "SINTOMAS" }]]} size={68} />
      <Janela f={f} at={T.sintomas + 10} y={420} h={700} titulo="fique de olho 👀">
        <div style={{ position: "absolute", inset: 30, display: "flex", flexDirection: "column", gap: 18 }}>
          <Linha f={f} at={T.febre} size={44}>🌡️ febre alta</Linha>
          <Linha f={f} at={T.manchas} size={44}>🔴 manchas vermelhas</Linha>
          <Linha f={f} at={T.tosse} size={44}>😷 tosse</Linha>
          <Linha f={f} at={T.nariz} size={44}>🤧 nariz escorrendo</Linha>
          <Linha f={f} at={T.olhos} size={44}>👁️ olhos vermelhos</Linha>
          <Linha f={f} at={T.atendimento} size={40} fundo={K.amarelo}>
            🏥 procure atendimento
          </Linha>
        </div>
      </Janela>
    </>
  );

const S11: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 10) ? null : (
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
        para mais dicas de farmacologia
        <br />e curiosidades sobre a área 💊
      </div>
    </>
  );

const S12: React.FC<{ f: number }> = ({ f }) =>
  f < R(11)[0] ? null : (
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
  [T.alerta + 14, "trava", 0.32],
  [T.anos35, "pop", 0.2],
  [T.noventa, "pop", 0.2],
  [T.casos52, "pop", 0.2],
  [T.chegar, "trava", 0.3],
  [T.doze, "pop", 0.18],
  [T.ate29, "pop", 0.18],
  [T.ate59, "pop", 0.18],
  [T.profissionais, "pop", 0.18],
  [T.protegido - 10, "plim", 0.25],
  [T.malNao, "pop", 0.2],
  [T.antes15, "pop", 0.2],
  [T.extra, "trava", 0.3],
  [T.engravidar, "pop", 0.2],
  [T.gratis + 10, "plim", 0.25],
  [T.final, "plim", 0.3],
];

export const VideoSarampo: React.FC = () => {
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
      <S10 f={f} />
      <S11 f={f} />
      <S12 f={f} />
      <Canto f={f} />
      <Legenda f={f} />
      <Audio src={staticFile("sarampo/narracao.mp3")} />
      <Audio src={staticFile("sarampo/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920) no mesmo estilo. Os 20% de baixo ficam livres por causa do contador do TikTok.
export const CapaSarampo: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <div style={{ position: "absolute", top: 120, width: 1080, display: "flex", justifyContent: "center" }}>
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
          <Pixelado texto="NOTÍCIAS DA FARMÁCIA #2" size={28} />
        </span>
      </span>
    </div>
    <Titulo f={100} at={0} top={290} size={80} linhas={[[{ t: "SARAMPO:" }], [{ t: "VACINA", cor: K.vermelho }], [{ t: "DE NOVO?" }]]} />
    <Janela f={100} at={0} x={50} y={680} w={640} h={500} titulo="ministério da saúde">
      <div style={{ position: "absolute", top: 40, width: 630, textAlign: "center", fontFamily: EMOJI, fontSize: 130 }}>💉</div>
      <div style={{ position: "absolute", top: 230, width: 630, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.2, color: K.tinta }}>
        quem precisa
        <br />
        <span style={{ background: K.amarelo, padding: "0 12px" }}>tomar e quem não</span>
      </div>
    </Janela>
    <div
      style={{
        position: "absolute",
        left: 715,
        top: 720,
        transform: "scale(0.56)",
        transformOrigin: "0 0",
        filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))",
      }}
    >
      <Reporter f={1} boca={[2, 2]} />
    </div>
    <div style={{ position: "absolute", top: 1240, left: 50, width: 640, textAlign: "center", fontFamily: VT, fontSize: 56, color: K.tinta }}>
      <span style={{ background: K.branco, border: `4px solid ${K.tinta}`, boxShadow: `6px 6px 0 ${K.tinta}`, padding: "6px 24px" }}>
        alerta nas Américas 🔴
      </span>
    </div>
  </AbsoluteFill>
);
