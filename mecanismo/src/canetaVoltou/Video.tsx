// "Parou a caneta e o peso voltou?" — 1º vídeo no Modelo 10 · Corpo aceso (25-26/11/2026).
// Roteiro: roteiros/caneta_parou_peso_voltou.md (gancho C). Narração dela (ElevenLabs) em public/canetaVoltou/narracao.mp3.
// Tempos: src/modelo10/caneta_fala.json (quadro de cada palavra, 30 fps). Sem música de fundo: só voz e efeitos baixos.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CartoesFinais } from "../estiloEtiquetas/kit";
import { SANS, SERIF } from "../fonts";
import { IN, OUT, P, W, it, rgba, tri } from "../lib";
import FALA from "../modelo10/caneta_fala.json";
import {
  Camera,
  COR10,
  Corpo,
  Etiqueta10,
  Frase10,
  Fundo10,
  GraficoPeso,
  Legenda10,
  Numero10,
  PONTOS,
  Titulo10,
} from "../modelo10/kit";

const { NEON, LIMAO, VERM, LARANJA, INK, BG0 } = COR10;
const ME_SIGA = 2300;
const FINAL = 2440;
export const DURATION_CANETA_VOLTOU = 2535;

// legenda: frases de até 5 palavras, quebrando na pontuação
const FRASES: Frase10[] = (() => {
  const out: Frase10[] = [];
  let cur: { t: string; f: number }[] = [];
  const ws = (FALA as { w: string; f: number }[]).filter((x) => x.f < ME_SIGA);
  ws.forEach((p, i) => {
    cur.push({ t: p.w.replace("G-L-P", "GLP"), f: p.f });
    if (/[.,?:;!]$/.test(p.w) || cur.length >= 5 || i === ws.length - 1) {
      out.push({ ini: cur[0].f, fim: 0, w: cur });
      cur = [];
    }
  });
  out.forEach((o, i) => {
    const ult = o.w[o.w.length - 1].f;
    o.fim = Math.min(out[i + 1]?.ini ?? ult + 30, ult + 30);
  });
  return out;
})();
const CHAVES = [
  "caneta,",
  "culpou?",
  "explicação.",
  "intestino,",
  "um.",
  "cheio.",
  "estômago",
  "devagar.",
  "embora.",
  "ninguém",
  "antigo:",
  "fome",
  "energia.",
  "terços",
  "manteve.",
  "pressão,",
  "glicose",
  "colesterol",
  "sempre,",
  "vez?",
  "própria.",
  "crônica,",
  "controla,",
  "cura.",
  "poucos,",
  "médico",
  "culpa",
  "corpo,",
  "proteína,",
  "músculo",
  "física.",
].map((c) => c.toLowerCase().replace(/[.,?!:;]/g, ""));

// câmera do corpo: [quadro, zoom, centroX, centroY]
const CAM: [number, number, number, number][] = [
  [200, 0.62, 540, 1080],
  [228, 0.72, 540, 1080],
  [441, 0.72, 540, 1080],
  [468, 1.7, 610, 1000],
  [519, 1.7, 610, 1000],
  [548, 0.72, 540, 1080],
  [1966, 0.72, 540, 1080],
];
const naTela = (f: number, [x, y]: [number, number]): [number, number] => {
  let a = CAM[0],
    b = CAM[0];
  for (let i = 0; i < CAM.length; i++)
    if (f >= CAM[i][0]) {
      a = CAM[i];
      b = CAM[i + 1] ?? CAM[i];
    }
  const t =
    b[0] === a[0] ? 0 : Math.min(1, Math.max(0, (f - a[0]) / (b[0] - a[0])));
  const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  const z = a[1] + (b[1] - a[1]) * e,
    cx = a[2] + (b[2] - a[2]) * e,
    cy = a[3] + (b[3] - a[3]) * e;
  return [W / 2 + (x - cx) * z, 960 + (y - cy) * z];
};

// efeitos (Openverse, CC0): [quadro, nome, volume] — sempre baixos sob a voz
const OV = "sfx_openverse/";
const SFX: [number, string, number][] = [
  [20, "whoosh", 0.2],
  [92, "tique", 0.25],
  [200, "whoosh", 0.18],
  [294, "pop", 0.25],
  [400, "ding", 0.22],
  [441, "whoosh", 0.18],
  [519, "whoosh", 0.15],
  [545, "grave_curto", 0.25],
  [602, "tique", 0.2],
  [842, "pop", 0.22],
  [961, "whoosh", 0.18],
  [1046, "carimbo", 0.3],
  [1234, "tique", 0.2],
  [1258, "tique", 0.2],
  [1282, "tique", 0.2],
  [1416, "pop", 0.2],
  [1458, "pop", 0.2],
  [1501, "carimbo", 0.28],
  [1666, "ding", 0.2],
  [1711, "grave_curto", 0.2],
  [1738, "whoosh", 0.18],
  [1826, "tique", 0.15],
  [1966, "whoosh", 0.18],
  [2032, "coracao", 0.25],
  [2168, "pop", 0.2],
  [2194, "pop", 0.2],
  [2215, "pop", 0.2],
  [2300, "whoosh", 0.2],
  [FINAL, "sting", 0.35],
];

const Pilulas: React.FC<{
  f: number;
  itens: [string, number][];
  ate: number;
  cor: string;
  simbolo: string;
  y: number;
}> = ({ f, itens, ate, cor, simbolo, y }) => {
  const out = 1 - P(f, ate - 8, ate);
  if (out <= 0 || f < itens[0][1] - 4) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 40,
        right: 40,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 18,
        opacity: out,
      }}
    >
      {itens.map(([t, at]) => {
        const k = it(f, at - 4, at + 8, 0, 1, OUT);
        return (
          <div
            key={t}
            style={{
              opacity: k,
              transform: `translateY(${(1 - k) * 30}px) scale(${1 + 0.08 * tri(f, at + 4, 6)})`,
              padding: "16px 28px",
              borderRadius: 999,
              border: `2.5px solid ${cor}`,
              background: rgba(cor, 0.12),
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 40,
              color: INK,
              boxShadow: `0 0 24px ${rgba(cor, 0.25)}`,
            }}
          >
            <span style={{ color: cor }}>{simbolo} </span>
            {t}
          </div>
        );
      })}
    </div>
  );
};

// duas opções lado a lado que levam um X juntas ("pra sempre" / "de uma vez")
const DuasOpcoes: React.FC<{ f: number }> = ({ f }) => {
  const out = 1 - P(f, 1555, 1565);
  if (out <= 0 || f < 1410) return null;
  const x = it(f, 1501, 1512, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: 700,
        left: 0,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 40,
        opacity: out,
      }}
    >
      {(
        [
          ["USAR PRA SEMPRE", 1416],
          ["PARAR DE UMA VEZ", 1458],
        ] as [string, number][]
      ).map(([t, at]) => {
        const k = it(f, at, at + 10, 0, 1, OUT);
        return (
          <div
            key={t}
            style={{
              position: "relative",
              width: 420,
              height: 300,
              borderRadius: 28,
              border: `2.5px solid ${rgba(INK, 0.25)}`,
              background: rgba(BG0, 0.85),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              lineHeight: 1.1,
              color: INK,
              opacity: k,
              transform: `scale(${0.85 + 0.15 * k})`,
            }}
          >
            {t}
            {x > 0 && (
              <svg
                width={420}
                height={300}
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                <path
                  d={`M80 60 L${80 + 260 * x} ${60 + 180 * x} M340 60 L${340 - 260 * x} ${60 + 180 * x}`}
                  stroke={VERM}
                  strokeWidth={16}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

// "controla ✓ / cura ✗"
const ControlaCura: React.FC<{ f: number }> = ({ f }) => {
  const out = 1 - P(f, 1728, 1738);
  if (out <= 0 || f < 1660) return null;
  const a = it(f, 1666, 1678, 0, 1, OUT),
    b = it(f, 1706, 1718, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: 760,
        left: 0,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 120,
        lineHeight: 1.15,
        opacity: out,
      }}
    >
      <div
        style={{
          opacity: a,
          color: NEON,
          textShadow: `0 0 40px ${rgba(NEON, 0.5)}`,
        }}
      >
        CONTROLA ✓
      </div>
      <div
        style={{
          opacity: b,
          color: VERM,
          textDecoration: b > 0.5 ? "line-through" : "none",
          textDecorationThickness: 10,
        }}
      >
        CURA ✗
      </div>
    </div>
  );
};

// a dose diminuindo aos poucos: degraus que descem mês a mês
const Degraus: React.FC<{ f: number }> = ({ f }) => {
  const out = 1 - P(f, 1956, 1966);
  if (out <= 0 || f < 1820) return null;
  const n = 6;
  return (
    <svg
      width={W}
      height={620}
      style={{ position: "absolute", top: 640, left: 0, opacity: out }}
    >
      <line
        x1={120}
        y1={500}
        x2={960}
        y2={500}
        stroke={rgba(INK, 0.25)}
        strokeWidth={2}
      />
      {Array.from({ length: n }, (_, i) => {
        const at = 1826 + i * 14;
        const k = it(f, at, at + 12, 0, 1, OUT);
        const h = 360 * (1 - i / n);
        return (
          <rect
            key={i}
            x={140 + i * 135}
            y={500 - h * k}
            width={100}
            height={h * k}
            rx={14}
            fill={rgba(NEON, 0.2 + 0.5 * (1 - i / n))}
            stroke={NEON}
            strokeWidth={3}
          />
        );
      })}
      <text
        x={120}
        y={550}
        fill={COR10.MINT}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={30}
        letterSpacing={3}
      >
        DOSE
      </text>
      <text
        x={960}
        y={550}
        fill={COR10.MINT}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={30}
        letterSpacing={3}
        textAnchor="end"
      >
        MESES →
      </text>
    </svg>
  );
};

export const VideoCanetaVoltou: React.FC = () => {
  const f = useCurrentFrame();
  const corpo1 = Math.min(P(f, 200, 225), 1 - P(f, 950, 972));
  const corpo2 = Math.min(P(f, 1966, 1990), 1 - P(f, 2078, 2092));
  const corpoOp = Math.max(corpo1, corpo2);
  const [ix, iy] = naTela(f, PONTOS.intestino);
  const [cx, cy] = naTela(f, PONTOS.cerebro);
  const [ex, ey] = naTela(f, PONTOS.estomago);
  const naNarracao = f < ME_SIGA;
  return (
    <AbsoluteFill style={{ background: BG0 }}>
      <Fundo10 f={f} grade={naNarracao ? 1 - 0.6 * corpoOp : 0.4} />

      {/* 1 · gancho (0–200): o peso desce com a caneta e volta a subir */}
      <Titulo10
        f={f}
        at={2}
        ate={150}
        partes={[["A BALANÇA "], ["SUBIU", LIMAO], [" DE NOVO?"]]}
        sub="parou a caneta"
      />
      <Titulo10
        f={f}
        at={150}
        ate={205}
        partes={[["CALMA, TEM "], ["EXPLICAÇÃO", NEON]]}
      />
      <GraficoPeso f={f} at={10} ate={205} y={640} />
      <Etiqueta10
        f={f}
        at={30}
        ate={205}
        texto="parou aqui"
        px={583}
        py={932}
        lx={430}
        ly={1180}
        cor={LIMAO}
      />

      {/* 2 a 5 · o corpo aceso (200–955) e a volta no fim (1966–2090) */}
      {corpoOp > 0 && (
        <Camera f={f} chaves={CAM}>
          <Corpo
            f={f}
            opacity={corpoOp}
            caminho={f < 1900 ? P(f, 294, 390) : 0}
            cerebroAceso={P(f, 400, 425) * (1 - P(f, 533, 573))}
            estomago={P(f, 449, 470) * (1 - P(f, 519, 540))}
            apaga={P(f, 533, 573)}
            fome={
              f < 1900
                ? P(f, 842, 870)
                : P(f, 1975, 2000) * (1 - P(f, 2032, 2060))
            }
          />
        </Camera>
      )}
      <Titulo10
        f={f}
        at={213}
        ate={441}
        partes={[["O AVISO DE "], ["SACIEDADE", NEON]]}
        sub="GLP-1 · hormônio do intestino"
      />
      <Etiqueta10
        f={f}
        at={294}
        ate={436}
        texto="intestino solta GLP-1"
        px={ix}
        py={iy}
        lx={ix - 120}
        ly={iy + 190}
      />
      <Etiqueta10
        f={f}
        at={404}
        ate={436}
        texto="já tá cheio"
        px={cx}
        py={cy}
        lx={cx + 190}
        ly={cy - 10}
      />
      <Titulo10
        f={f}
        at={449}
        ate={519}
        partes={[["ESVAZIA "], ["DEVAGAR", NEON]]}
        sub="estômago"
      />
      <Etiqueta10
        f={f}
        at={470}
        ate={517}
        texto="estômago"
        px={ex}
        py={ey}
        lx={ex + 170}
        ly={ey + 250}
      />
      <Titulo10
        f={f}
        at={525}
        ate={600}
        partes={[["O AVISO "], ["APAGA", VERM]]}
        sub="sem a caneta"
      />
      <Titulo10
        f={f}
        at={602}
        ate={704}
        partes={[["O QUE QUASE "], ["NINGUÉM", LIMAO], [" CONTA"]]}
      />
      <Titulo10
        f={f}
        at={706}
        ate={955}
        partes={[["O CORPO "], ["PEDE", LARANJA], [" DE VOLTA"]]}
        sub="tenta voltar ao peso antigo"
      />
      <Etiqueta10
        f={f}
        at={845}
        ate={950}
        texto="+ hormônio da fome"
        px={ex + 10}
        py={ey - 120}
        lx={ex + 120}
        ly={ey - 260}
        cor={LARANJA}
      />
      <Etiqueta10
        f={f}
        at={905}
        ate={950}
        texto="- gasto de energia"
        px={naTela(f, [470, 880])[0]}
        py={naTela(f, [470, 880])[1]}
        lx={naTela(f, [470, 880])[0] - 90}
        ly={naTela(f, [470, 880])[1] + 330}
        cor={LARANJA}
      />

      {/* 6 · os números (956–1355) */}
      <Titulo10
        f={f}
        at={961}
        ate={1184}
        partes={[["EM "], ["1 ANO", LIMAO]]}
        sub="quem parou a caneta"
      />
      <Numero10
        f={f}
        at={1040}
        ate={1184}
        numero="2/3"
        texto={"do peso perdido\nvoltou"}
        y={600}
      />
      <Pilulas
        f={f}
        itens={[["quem continuou, manteve", 1132]]}
        ate={1184}
        cor={NEON}
        simbolo="✓"
        y={1150}
      />
      <Titulo10
        f={f}
        at={1189}
        ate={1356}
        partes={[["NÃO VOLTOU SÓ O "], ["PESO", LIMAO]]}
        sub="pioraram de novo"
      />
      <Pilulas
        f={f}
        itens={[
          ["pressão", 1234],
          ["glicose", 1258],
          ["colesterol", 1282],
        ]}
        ate={1356}
        cor={VERM}
        simbolo="▲"
        y={820}
      />

      {/* 7 · o que você faria? (1360–1735) */}
      <Titulo10
        f={f}
        at={1362}
        ate={1500}
        partes={[["E VOCÊ, "], ["O QUE FARIA?", LIMAO]]}
      />
      <Titulo10
        f={f}
        at={1501}
        ate={1562}
        partes={[["NENHUM DOS DOIS "], ["POR CONTA PRÓPRIA", VERM]]}
        size={70}
      />
      <DuasOpcoes f={f} />
      <Titulo10
        f={f}
        at={1565}
        ate={1736}
        partes={[["DOENÇA "], ["CRÔNICA", NEON]]}
        sub="como a pressão alta"
      />
      <ControlaCura f={f} />

      {/* 8 · se der pra parar: aos poucos, com o médico (1738–1960) */}
      <Titulo10
        f={f}
        at={1740}
        ate={1962}
        partes={[["PARAR? "], ["AOS POUCOS", NEON]]}
        sub="ao longo de meses"
      />
      <Degraus f={f} />
      <Etiqueta10
        f={f}
        at={1925}
        ate={1960}
        texto="com o médico"
        px={480}
        py={1000}
        lx={620}
        ly={780}
      />

      {/* 9 · a culpa do começo: era o corpo (1966–2080) */}
      <Titulo10
        f={f}
        at={2018}
        ate={2082}
        partes={[["ERA O SEU "], ["CORPO", NEON]]}
        sub="não você"
      />

      {/* 10 · o que segura o resultado (2084–2300) */}
      <Titulo10
        f={f}
        at={2086}
        ate={2300}
        partes={[["O QUE SEGURA O "], ["RESULTADO", NEON]]}
        sub="o plano junto"
      />
      <Pilulas
        f={f}
        itens={[
          ["proteína", 2168],
          ["músculo", 2194],
          ["atividade física", 2215],
        ]}
        ate={2300}
        cor={NEON}
        simbolo="✓"
        y={760}
      />
      {f >= 2250 && f < 2300 && (
        <CartoesFinais
          f={f}
          at={2252}
          itens={[["enviar", "Manda ", "pra quem usa a caneta"]]}
          y={1080}
        />
      )}

      {naNarracao && <Legenda10 f={f} frases={FRASES} chaves={CHAVES} />}

      {/* 11 · me siga com o logo */}
      {f >= ME_SIGA - 4 && f < FINAL && (
        <AbsoluteFill
          style={{
            opacity: Math.min(
              P(f, ME_SIGA - 4, ME_SIGA + 8),
              1 - P(f, FINAL - 6, FINAL),
            ),
          }}
        >
          <Img
            src={staticFile("anlodipinoNovo/logo.jpg")}
            style={{
              position: "absolute",
              left: 350,
              top: 470,
              width: 380,
              height: 380,
              borderRadius: "50%",
              border: `6px solid ${NEON}`,
              boxSizing: "border-box",
              boxShadow: `0 0 60px ${rgba(NEON, 0.45)}`,
              transform: `scale(${it(f, ME_SIGA, ME_SIGA + 14, 0.8, 1, OUT)})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 900,
              width: W,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 120,
              color: INK,
            }}
          >
            ME SIGA
          </div>
          <div
            style={{
              position: "absolute",
              top: 1060,
              left: 110,
              width: 860,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 44,
              lineHeight: 1.3,
              color: INK,
            }}
          >
            para mais dicas de farmacologia e curiosidades sobre a área
          </div>
        </AbsoluteFill>
      )}

      {/* 12 · tela final */}
      {f >= FINAL &&
        ["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
            const at = FINAL + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 760 + i * 110,
                  width: W,
                  textAlign: "center",
                  fontFamily: SERIF,
                  fontWeight: i === 1 ? 600 : 400,
                  fontSize: i === 1 ? 92 : 80,
                  color: i === 1 ? NEON : INK,
                  opacity:
                    k *
                    (1 -
                      it(
                        f,
                        DURATION_CANETA_VOLTOU - 8,
                        DURATION_CANETA_VOLTOU,
                        0,
                        1,
                        IN,
                      )),
                  transform: `translateY(${(1 - k) * 40}px)`,
                }}
              >
                {l}
              </div>
            );
          },
        )}

      <Audio src={staticFile("canetaVoltou/narracao.mp3")} />
      {SFX.map(([x, nome, vol], i) => (
        <Sequence key={i} from={x} durationInFrames={90}>
          <Audio src={staticFile(OV + nome + ".mp3")} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// capa 1080×1920 — tudo importante entre y≈300 e y≈1620 (recorte 3:4 do TikTok/Instagram)
export const CapaCanetaVoltou: React.FC = () => (
  <AbsoluteFill style={{ background: BG0 }}>
    <Fundo10 f={40} grade={0.5} />
    <Camera f={0} chaves={[[0, 0.8, 540, 1110]]}>
      <Corpo f={30} caminho={1} cerebroAceso={0.5} fome={1} />
    </Camera>
    <AbsoluteFill style={{ background: `linear-gradient(${rgba(BG0, 0.95)} 0%, ${rgba(BG0, 0.75)} 30%, ${rgba(BG0, 0)} 46%)` }} />
    <div style={{ position: "absolute", top: 330, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 900, color: INK, lineHeight: 1.02 }}>
      <div style={{ fontSize: 112, letterSpacing: -2 }}>PAROU A</div>
      <div style={{ fontSize: 112, letterSpacing: -2 }}>CANETA?</div>
      <div style={{ marginTop: 22, display: "inline-block", padding: "10px 30px", borderRadius: 18, background: LIMAO, color: BG0, fontSize: 64 }}>O PESO VOLTA</div>
    </div>
    <div style={{ position: "absolute", top: 1530, left: 0, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 50, color: NEON, textShadow: `0 0 24px ${rgba(NEON, 0.5)}` }}>
      e não é culpa sua
    </div>
  </AbsoluteFill>
);
