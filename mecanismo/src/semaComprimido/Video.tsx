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
import palavras from "../../audio/semaComprimido_palavras.json";

// "Notícias da Farmácia" #3: Anvisa aprova a semaglutida em comprimido para obesidade (04/11/2026).
// Mesmo estilo reportagem do #1 e #2 (fundo quadriculado, título pixel, janelinhas, legenda e a repórter no canto),
// com pergunta para os comentários no final ("caneta ou comprimido?").
// Narração: Juliana (ElevenLabs v4, tom de repórter). Tempos: audio/semaComprimido_palavras.json (quadro = segundos × 30).

// TEMPOS
export const T = {
  hoje: 35,
  comprimido: 143,
  mesma: 211,
  fica: 346,
  wegovy: 497,
  primeiro: 593,
  ja: 788,
  primeiraVez: 922,
  obesidade: 1021,
  sobrepeso: 1051,
  receita: 1221,
  imita: 1291,
  saciedade: 1408,
  estomago: 1441,
  fome: 1519,
  caneta: 1605,
  comp: 1678,
  dose: 1737,
  d4: 1858,
  d9: 1879,
  d25: 1902,
  dica: 2000,
  jejum: 2110,
  agua: 2138,
  trinta: 2204,
  quase: 2356,
  estudo: 2429,
  treze: 2584,
  efeitos: 2737,
  enjoo: 2809,
  vomito: 2828,
  diarreia: 2844,
  intestino: 2875,
  comeco: 2930,
  preco: 2993,
  previsao: 3024,
  retencao: 3255,
  internet: 3424,
  desconfie: 3464,
  falsificada: 3510,
  rotina: 3605,
  injecao: 3626,
  comp2: 3672,
  comenta: 3735,
  conta: 3872,
  siga: 3920,
  final: 4060,
};
export const DURATION = 4190; // 139,7 s (narração de 134,7 s + mensagem final)
export const PARTES: [number, number][] = [
  [0, 488],
  [488, 963],
  [963, 1262],
  [1262, 1539],
  [1539, 2000],
  [2000, 2429],
  [2429, 2737],
  [2737, 2971],
  [2971, 3297],
  [3297, 3544],
  [3544, 3920],
  [3920, 4060],
  [4060, DURATION],
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
  if (f >= R(12)[0] + 10) return null;
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
        opacity: 1 - P(f, R(12)[0], R(12)[0] + 10),
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
    <Pixelado texto="NOTÍCIAS DA FARMÁCIA #3" size={26} />
  </div>
);

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 0) ? null : (
    <>
      <Plantao f={f} />
      <Titulo f={f} at={4} linhas={[[{ t: "SEMAGLUTIDA" }], [{ t: "EM COMPRIMIDO", cor: K.azul }]]} size={60} />
      <Janela f={f} at={T.hoje} y={520} h={500} titulo="anvisa · 04/11/2026">
        <Icone f={f} at={T.hoje + 6} x={250} y={170} e="💉" size={130} />
        <Icone f={f} at={T.comprimido - 10} x={445} y={170} e="➡️" size={80} />
        <Icone f={f} at={T.comprimido} x={640} y={170} e="💊" size={130} />
        <Selo f={f} at={T.comprimido + 20} x={445} y={350} texto="APROVADO" size={40} cor={K.verde} />
      </Janela>
      <Selo f={f} at={T.fica} x={540} y={1110} texto="FICA ATÉ O FINAL" size={26} cor={K.laranja} />
    </>
  );

const S2: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 1) ? null : (
    <>
      <Titulo f={f} at={R(1)[0]} linhas={[[{ t: "O QUE FOI" }], [{ t: "APROVADO", cor: K.azul }]]} size={60} />
      <Janela f={f} at={T.wegovy - 6} y={500} h={600} titulo="registro · anvisa">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 26 }}>
          <Linha f={f} at={T.wegovy} size={54} fundo={K.amarelo}>
            Wegovy em comprimido
          </Linha>
          <Linha f={f} at={T.primeiro} size={38}>
            💊 1º GLP-1 em comprimido para obesidade no Brasil
          </Linha>
          <Linha f={f} at={T.ja} size={34} cor={K.cinza}>
            já existia: semaglutida oral para diabetes tipo 2
          </Linha>
        </div>
        <Selo f={f} at={T.primeiraVez} x={600} y={460} texto="1ª VEZ P/ OBESIDADE" size={24} />
      </Janela>
    </>
  );

const S3: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 2) ? null : (
    <>
      <Titulo f={f} at={R(2)[0]} linhas={[[{ t: "PARA QUEM?", cor: K.azul }]]} size={72} />
      <Janela f={f} at={T.obesidade - 10} y={440} h={560} titulo="indicação">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 30 }}>
          <Linha f={f} at={T.obesidade} size={44}>
            👤 adultos com obesidade
          </Linha>
          <Linha f={f} at={T.sobrepeso} size={40}>
            ou sobrepeso + uma doença ligada ao peso
          </Linha>
          <Linha f={f} at={T.sobrepeso + 60} size={34} cor={K.cinza}>
            (pressão alta, diabetes…)
          </Linha>
        </div>
        <Selo f={f} at={T.receita} x={445} y={420} texto="SÓ COM RECEITA" size={34} />
      </Janela>
    </>
  );

const S4: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 3) ? null : (
    <>
      <Titulo f={f} at={R(3)[0]} linhas={[[{ t: "COMO" }], [{ t: "FUNCIONA", cor: K.azul }]]} size={64} />
      <Janela f={f} at={T.imita - 6} y={480} h={620} titulo="GLP-1 · hormônio do intestino">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 30 }}>
          <Linha f={f} at={T.imita} size={40}>
            🧬 imita o GLP-1
          </Linha>
          <Linha f={f} at={T.saciedade} size={44} cor={K.verde}>
            😌 mais saciedade
          </Linha>
          <Linha f={f} at={T.estomago} size={44} cor={K.verde}>
            🐢 estômago esvazia devagar
          </Linha>
          <Linha f={f} at={T.fome} size={44} cor={K.verde}>
            🍽️ menos fome
          </Linha>
        </div>
      </Janela>
    </>
  );

const S5: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 4)) return null;
  const doses: [string, number][] = [
    ["1,5", T.dose],
    ["4", T.d4],
    ["9", T.d9],
    ["25 mg", T.d25],
  ];
  return (
    <>
      <Titulo f={f} at={R(4)[0]} linhas={[[{ t: "CANETA" }], [{ t: "× COMPRIMIDO", cor: K.azul }]]} size={60} />
      <Janela f={f} at={T.caneta - 6} x={60} w={460} y={480} h={360} titulo="caneta">
        <Icone f={f} at={T.caneta} x={225} y={110} e="💉" size={110} />
        <div style={{ position: "absolute", top: 210, width: 450, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: K.tinta, opacity: P(f, T.caneta, T.caneta + 10) }}>
          1x por SEMANA
        </div>
      </Janela>
      <Janela f={f} at={T.comp - 6} x={560} w={460} y={480} h={360} titulo="comprimido">
        <Icone f={f} at={T.comp} x={225} y={110} e="💊" size={110} />
        <div style={{ position: "absolute", top: 210, width: 450, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: K.azul, opacity: P(f, T.comp, T.comp + 10) }}>
          1x por DIA
        </div>
      </Janela>
      <div style={{ position: "absolute", top: 900, width: 1080, textAlign: "center", fontFamily: VT, fontSize: 44, color: K.tinta, opacity: P(f, T.dose - 10, T.dose) }}>
        a dose sobe aos poucos:
      </div>
      <div style={{ position: "absolute", top: 970, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
        {doses.map(([t, at], i) => (
          <React.Fragment key={t}>
            {i > 0 && <span style={{ fontFamily: PIX, fontSize: 30, color: K.cinza, opacity: P(f, at, at + 8) }}>→</span>}
            <span
              style={{
                fontFamily: PIX,
                fontSize: 30,
                color: K.branco,
                background: i === 3 ? K.verde : K.azul,
                border: `4px solid ${K.tinta}`,
                padding: "14px 16px",
                opacity: P(f, at, at + 8),
                transform: `scale(${0.6 + 0.4 * it(f, at, at + 12, 0, 1, SNAP)})`,
              }}
            >
              {t}
            </span>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const S6: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 5) ? null : (
    <>
      <Titulo f={f} at={R(5)[0]} linhas={[[{ t: "DICA DE" }], [{ t: "FARMACÊUTICA", cor: K.verde }]]} size={60} />
      <Janela f={f} at={T.jejum - 20} y={480} h={600} titulo="como tomar o comprimido">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 28 }}>
          <Linha f={f} at={T.jejum} size={46}>
            🌅 em jejum
          </Linha>
          <Linha f={f} at={T.agua} size={46}>
            💧 com pouca água
          </Linha>
          <Linha f={f} at={T.trinta} size={40} fundo={K.amarelo}>
            ⏱️ 30 min sem comer, beber ou outro remédio
          </Linha>
        </div>
        <Selo f={f} at={T.quase} x={445} y={450} texto="SENÃO PERDE O EFEITO" size={26} />
      </Janela>
    </>
  );

const S7: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 6) ? null : (
    <>
      <Titulo f={f} at={R(6)[0]} linhas={[[{ t: "RESULTADO" }]]} size={72} />
      <Janela f={f} at={T.estudo + 10} y={440} h={560} titulo="estudo OASIS 4">
        <div
          style={{
            position: "absolute",
            top: 70,
            width: 890,
            textAlign: "center",
            fontFamily: PIX,
            fontSize: 110,
            color: K.verde,
            opacity: P(f, T.treze, T.treze + 8),
            transform: `scale(${0.6 + 0.4 * it(f, T.treze, T.treze + 14, 0, 1, SNAP)})`,
          }}
        >
          -13,6%
        </div>
        <div style={{ position: "absolute", top: 260, width: 890, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.tinta, lineHeight: 1.3, opacity: P(f, T.treze + 20, T.treze + 32) }}>
          do peso, em média
          <br />
          <span style={{ color: K.cinza, fontSize: 34 }}>em cerca de 1 ano e 3 meses</span>
        </div>
      </Janela>
    </>
  );

const S8: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 7) ? null : (
    <>
      <Titulo f={f} at={R(7)[0]} linhas={[[{ t: "EFEITOS" }], [{ t: "COLATERAIS", cor: K.laranja }]]} size={62} />
      <Janela f={f} at={T.efeitos + 10} y={480} h={560} titulo="parecidos com a caneta">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 22 }}>
          <Linha f={f} at={T.enjoo} size={46}>🤢 enjoo</Linha>
          <Linha f={f} at={T.vomito} size={46}>🤮 vômito</Linha>
          <Linha f={f} at={T.diarreia} size={46}>🚽 diarreia</Linha>
          <Linha f={f} at={T.intestino} size={46}>🧱 intestino preso</Linha>
          <Linha f={f} at={T.comeco} size={34} cor={K.cinza}>
            principalmente no começo
          </Linha>
        </div>
      </Janela>
    </>
  );

const S9: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 8) ? null : (
    <>
      <Titulo f={f} at={R(8)[0]} linhas={[[{ t: "QUANDO" }], [{ t: "CHEGA?", cor: K.azul }]]} size={64} />
      <Janela f={f} at={T.preco - 10} y={480} h={560} titulo="farmácias">
        <div style={{ position: "absolute", inset: 34, display: "flex", flexDirection: "column", gap: 30 }}>
          <Linha f={f} at={T.preco} size={42}>
            💰 preço: ainda não definido
          </Linha>
          <Linha f={f} at={T.previsao} size={42}>
            📅 previsão: próximo trimestre
          </Linha>
        </div>
        <Selo f={f} at={T.retencao} x={445} y={390} texto="RECEITA RETIDA" size={36} />
      </Janela>
    </>
  );

const S10: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 9) ? null : (
    <>
      <Titulo f={f} at={R(9)[0]} linhas={[[{ t: "CUIDADO!", cor: K.vermelho }]]} size={76} />
      <Janela f={f} at={T.internet - 20} y={440} h={600} titulo="à venda na internet?">
        <Icone f={f} at={T.internet} x={445} y={170} e="🛒" size={140} />
        <Selo f={f} at={T.desconfie} x={445} y={330} texto="DESCONFIE" size={52} />
        <div style={{ position: "absolute", top: 440, width: 890, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.vermelho, opacity: P(f, T.falsificada, T.falsificada + 10) }}>
          pode ser falsificada
        </div>
      </Janela>
    </>
  );

const Escolha: React.FC<{ f: number; at: number; x: number; e: string; t: string; sub: string; cor: string }> = ({ f, at, x, e, t, sub, cor }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  const pulso = 1 + 0.04 * Math.sin((f - at) / 6) * P(f, T.comenta, T.comenta + 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 470,
        width: 440,
        height: 460,
        background: K.branco,
        border: `6px solid ${K.tinta}`,
        boxShadow: `12px 12px 0 ${cor}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: Math.min(1, k * 1.5),
        transform: `translateY(${(1 - k) * 60}px) scale(${(0.85 + 0.15 * k) * pulso})`,
      }}
    >
      <span style={{ fontFamily: EMOJI, fontSize: 150, lineHeight: 1 }}>{e}</span>
      <span style={{ fontFamily: PIX, fontSize: 36, color: cor }}>
        <Pixelado texto={t} size={36} />
      </span>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: K.tinta }}>{sub}</span>
    </div>
  );
};
const S11: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 10) ? null : (
    <>
      <Titulo f={f} at={R(10)[0]} linhas={[[{ t: "E VOCÊ?" }], [{ t: "QUAL COMBINA?", cor: K.laranja }]]} size={60} />
      <Escolha f={f} at={T.injecao} x={60} e="💉" t="CANETA" sub="1x por semana" cor={K.vermelho} />
      <Escolha f={f} at={T.comp2} x={580} e="💊" t="COMPRIMIDO" sub="1x por dia, em jejum" cor={K.azul} />
      <Selo f={f} at={T.comenta} x={540} y={1020} texto="COMENTA AÍ!" size={40} cor={K.laranja} />
      <div style={{ position: "absolute", top: 1090, width: 1080, textAlign: "center", fontFamily: VT, fontSize: 46, color: K.tinta, opacity: P(f, T.conta, T.conta + 10) }}>
        já usa? conta como está sendo 👇
      </div>
    </>
  );

const S12: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 11) ? null : (
    <>
      <Titulo f={f} at={T.siga} linhas={[[{ t: "ME SIGA", cor: K.azul }]]} size={84} top={560} />
      <div style={{ position: "absolute", top: 720, width: 1080, textAlign: "center", fontFamily: VT, fontSize: 56, color: K.tinta, opacity: P(f, T.siga + 10, T.siga + 22) }}>
        para mais dicas de farmacologia
        <br />e curiosidades sobre a área 💊
      </div>
    </>
  );

const S13: React.FC<{ f: number }> = ({ f }) =>
  f < R(12)[0] ? null : (
    <div style={{ position: "absolute", top: 720, width: 1080, textAlign: "center", fontFamily: PIX, fontSize: 44, lineHeight: "80px", color: K.tinta, opacity: it(f, T.final, T.final + 14, 0, 1, OUT) }}>
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
  [T.comprimido + 20, "plim", 0.28],
  [T.fica, "pop", 0.2],
  [T.primeiraVez, "trava", 0.28],
  [T.receita, "trava", 0.28],
  [T.caneta, "pop", 0.2],
  [T.comp, "pop", 0.2],
  [T.d25, "plim", 0.22],
  [T.trinta, "pop", 0.22],
  [T.quase, "trava", 0.28],
  [T.treze, "plim", 0.26],
  [T.retencao, "trava", 0.28],
  [T.desconfie, "trava", 0.32],
  [T.injecao, "pop", 0.22],
  [T.comp2, "pop", 0.22],
  [T.comenta, "plim", 0.28],
  [T.final, "plim", 0.3],
];

export const VideoSemaComprimido: React.FC = () => {
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
      <S13 f={f} />
      <Canto f={f} />
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

// Capa (1080×1920) no mesmo estilo. Os 20% de baixo ficam livres por causa do contador do TikTok.
export const CapaSemaComprimido: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <div style={{ position: "absolute", top: 120, width: 1080, display: "flex", justifyContent: "center" }}>
      <span style={{ fontFamily: PIX, fontSize: 28, color: K.branco, background: K.vermelho, border: `5px solid ${K.tinta}`, boxShadow: `8px 8px 0 ${K.tinta}`, padding: "16px 26px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 20, height: 20, background: K.branco }} />
        <span>
          <Pixelado texto="NOTÍCIAS DA FARMÁCIA #3" size={28} />
        </span>
      </span>
    </div>
    <Titulo f={100} at={0} top={290} size={68} linhas={[[{ t: "SEMAGLUTIDA" }], [{ t: "EM COMPRIMIDO", cor: K.azul }], [{ t: "APROVADA!" }]]} />
    <Janela f={100} at={0} x={50} y={700} w={640} h={460} titulo="caneta ou comprimido?">
      <div style={{ position: "absolute", top: 40, width: 630, textAlign: "center", fontFamily: EMOJI, fontSize: 130 }}>💉 💊</div>
      <div style={{ position: "absolute", top: 230, width: 630, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.2, color: K.tinta }}>
        1x por semana
        <br />
        <span style={{ background: K.amarelo, padding: "0 12px" }}>ou 1x por dia?</span>
      </div>
    </Janela>
    <div style={{ position: "absolute", left: 715, top: 740, transform: "scale(0.56)", transformOrigin: "0 0", filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))" }}>
      <Reporter f={1} boca={[2, 2]} />
    </div>
    <div style={{ position: "absolute", top: 1240, left: 50, width: 640, textAlign: "center", fontFamily: VT, fontSize: 54, color: K.tinta }}>
      <span style={{ background: K.branco, border: `4px solid ${K.tinta}`, boxShadow: `6px 6px 0 ${K.tinta}`, padding: "6px 24px" }}>anvisa · 04/11 🔵</span>
    </div>
  </AbsoluteFill>
);
