import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SANS, SERIF } from "../fonts";
import { Grain, OUT, P, Part, Pill, W, H, it, mix, rgba, tri } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { Prostata3D } from "./Prostata3D";
import falaJson from "./fala.json";

// "Novembro Azul: os remédios do câncer de próstata". Modelo 1 em versão AZUL (pedido dela, só para
// o Novembro Azul); 3D só no mecanismo. Roteiro e fontes: roteiros/novembro_azul_prostata.md.
// fala.json começou ESTIMADA (o vídeo foi feito antes do áudio); com a narração dela, rodar
// scripts/transcrever.py e trocar TEM_NARRACAO para true.
const TEM_NARRACAO = true;

const AZUL = "#3da9ff",
  AZUL2 = "#9fd4ff",
  AMBAR = "#f2e52e",
  INK = "#eef4ff",
  BG = "#050d1f",
  BG2 = "#0b2347",
  CAIXA = "rgba(8,22,48,0.92)";

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
  sabe: Tw("sabe"),
  testo1: Tw("testosterona"),
  na: Tw("na") - 6,
  celulas: Tw("células"),
  crescer: Tw("crescer"),
  avancada: Tw("avançada"),
  cortar: Tw("cortar"),
  bloco3d: Tw("tem") - 6,
  desliga: Tw("desliga"),
  gosse: Tw("gosserrelina"),
  leupro: Tw("leuprorrelina"),
  testiculos: Tw("testículos"),
  fecha: Tw("tem", 2),
  fechadura: Tw("fechadura"),
  bical: Tw("bicalutamida"),
  enza: Tw("enzalutamida"),
  abira: Tw("abiraterona"),
  trava: Tw("trava"),
  predni: Tw("prednisona"),
  so: Tw("só") - 6,
  detalhe: Tw("detalhe"),
  finas: Tw("finasterida") - 4,
  aumentada: Tw("aumentada"),
  cabelo: Tw("cabelo"),
  psa: Tw("psa"),
  metade: Tw("metade"),
  avise: Tw("avise"),
  falar: Tw("falar") - 8,
  cinquenta: Tw("cinquenta"),
  quarenta: Tw("quarenta"),
  converse: Tw("converse"),
  toque: Tw("toque"),
  ja: Tw("já") - 8,
  comenta: Tw("comenta"),
  manda: Tw("manda"),
  // a narração não fala o "Me siga": a tela entra logo depois da última palavra
  siga: FALA[FALA.length - 1].f + 24,
  final: FALA[FALA.length - 1].f + 24 + 96,
};
export const DURATION_NOVEMBRO_AZUL = T.final + 90;
// FIM TEMPOS

const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.testo1, TRAVA, 0.28],
  [T.na, WHOOSH, 0.24],
  [T.cortar, TRAVA, 0.28],
  [T.bloco3d, WHOOSH, 0.26],
  [T.desliga, BIP, 0.22],
  [T.fechadura, BIP, 0.22],
  [T.trava, BIP, 0.24],
  [T.so, WHOOSH, 0.26],
  [T.metade, POP, 0.2],
  [T.avise, TRAVA, 0.3],
  [T.falar, WHOOSH, 0.26],
  [T.ja, WHOOSH, 0.26],
  [T.comenta, PLIM, 0.2],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
  [T.final + 6, K + "logo-stings/sting-airy-long.wav", 0.5],
];

const FALANDO = (() => {
  const a = new Array(DURATION_NOVEMBRO_AZUL + 1).fill(0);
  FALA.forEach((p, i) => {
    const fim = Math.min(FALA[i + 1]?.f ?? p.f + 24, p.f + 24);
    for (let fr = p.f; fr < fim; fr++) a[fr] = 1;
  });
  return a.map((_, i) => {
    let s = 0,
      n = 0;
    for (let j = i - 8; j <= i + 8; j++)
      if (a[j] !== undefined) {
        s += a[j];
        n++;
      }
    return s / n;
  });
})();
const musica = (fr: number) =>
  0.22 -
  0.13 *
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0) +
  0.2 * P(fr, T.final, T.final + 20);

// fundo azul (mesma ideia do Background do Modelo 1, com a paleta azul)
const Fundo: React.FC<{ color: string; pulses: number[] }> = ({
  color,
  pulses,
}) => {
  const f = useCurrentFrame();
  const pulse = pulses.reduce((s, p) => Math.max(s, tri(f, p, 15)), 0);
  const force = 0.35 + 0.05 * Math.sin((f / 240) * Math.PI * 2) + 0.18 * pulse;
  const rh = 700 + 60 * Math.sin((f / 330) * Math.PI * 2) + 140 * pulse;
  const c = color.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
  const stops = Array.from({ length: 11 }, (_, i) => {
    const d = i / 10;
    return `rgba(${r},${g},${b},${(force * Math.pow(1 - d, 1.9)).toFixed(4)}) ${d * 100}%`;
  }).join(",");
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1300px 1100px at 50% 38%, ${BG2} 0%, rgba(5,13,31,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1100px ${rh}px at 50% ${H + 120}px, ${stops})`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 70 }, (_, i) => {
          const x0 = random(`x${i}`) * W,
            y0 = random(`y${i}`) * H;
          const sp = 0.25 + random(`s${i}`) * 0.6,
            r0 = 1 + random(`r${i}`) * 2.4;
          const y = (((y0 - f * sp) % H) + H) % H;
          const x = x0 + Math.sin(f / 40 + i) * 10;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r0}
              fill="rgb(160,205,255)"
              opacity={0.1 + 0.08 * Math.sin(f / 25 + i)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Carimbo: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 72, children }) =>
  f >= at ? (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%,-50%) rotate(-5deg) scale(${2.2 - 1.2 * it(f, at, at + 7, 0, 1, OUT)})`,
        opacity: it(f, at, at + 7, 0, 1, OUT),
        border: `8px solid ${cor}`,
        borderRadius: 14,
        padding: "6px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        color: cor,
        background: rgba("#000000", 0.55),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  ) : null;

const Linha: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  emoji: string;
  children: React.ReactNode;
  h?: number;
}> = ({ f, at, y, cor, emoji, children, h = 170 }) => (
  <Card
    f={f}
    at={at}
    x={110}
    y={y}
    w={860}
    h={h}
    border={rgba(cor, 0.75)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 34,
      padding: "0 46px",
      background: CAIXA,
      color: INK,
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 84 }}>{emoji}</span>
    <span
      style={{
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 48,
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  </Card>
);

const Grande: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 96, children }) => {
  const k = it(f, at - 6, at + 6, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 50,
        width: W - 100,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.1,
        color: cor,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

// laço do Novembro Azul desenhado (sem emoji, que sai amarelo)
const Laco: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  s: number;
}> = ({ f, at, x, y, s }) => {
  const k = it(f, at, at + 16, 0, 1, OUT);
  const len = 900;
  return (
    <svg
      width={300 * s}
      height={420 * s}
      viewBox="0 0 300 420"
      style={{
        position: "absolute",
        left: x - 150 * s,
        top: y - 210 * s,
        filter: `drop-shadow(0 0 ${24 * k}px ${rgba(AZUL, 0.7)})`,
      }}
    >
      <path
        d="M95 400 L205 180 C240 110 215 40 150 40 C85 40 60 110 95 180 L205 400"
        fill="none"
        stroke={AZUL}
        strokeWidth={46}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - k)}
      />
    </svg>
  );
};

// célula 2D recebendo gotas de combustível (testosterona)
const Celula2D: React.FC<{ f: number; at: number; corta: number }> = ({
  f,
  at,
  corta,
}) => {
  const k = it(f, at, at + 16, 0, 1, OUT);
  const fluxo = 1 - P(f, corta, corta + 18);
  const cresce = 1 + 0.08 * P(f, at + 20, corta) * fluxo;
  return (
    <svg
      width={W}
      height={760}
      style={{ position: "absolute", left: 0, top: 560, opacity: k }}
    >
      <defs>
        <radialGradient id="cel" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#5d84c4" />
          <stop offset="100%" stopColor="#1b3566" />
        </radialGradient>
      </defs>
      <g transform={`translate(640,380) scale(${cresce})`}>
        <circle r={210} fill="url(#cel)" stroke={AZUL2} strokeWidth={5} />
        <circle cx={30} cy={10} r={70} fill="#13284f" />
      </g>
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((f - at) / 40 + i / 6) % 1;
        const x = 120 + u * 330,
          y = 380 + Math.sin(u * Math.PI) * -120 + (i % 2) * 30;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={24}
            fill={AMBAR}
            opacity={fluxo * (u < 0.95 ? 1 : 0)}
            style={{ filter: `drop-shadow(0 0 10px ${rgba(AMBAR, 0.7)})` }}
          />
        );
      })}
      {f >= corta && (
        <g transform="translate(290,330)" opacity={P(f, corta, corta + 8)}>
          <line
            x1={-90}
            y1={-90}
            x2={90}
            y2={90}
            stroke="#ff4d4d"
            strokeWidth={22}
            strokeLinecap="round"
          />
          <line
            x1={90}
            y1={-90}
            x2={-90}
            y2={90}
            stroke="#ff4d4d"
            strokeWidth={22}
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
};

// medidor do PSA caindo pela metade
const Medidor: React.FC<{ f: number; at: number; cai: number }> = ({
  f,
  at,
  cai,
}) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  const nivel = 1 - 0.5 * it(f, cai, cai + 24, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 390,
        top: 650,
        width: 300,
        height: 520,
        opacity: k,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 40,
          border: `5px solid ${AZUL2}`,
          background: CAIXA,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: `${nivel * 100}%`,
            background: `linear-gradient(180deg, ${AZUL}, #1d5fae)`,
            boxShadow: `0 0 30px ${rgba(AZUL, 0.6)}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            borderTop: `4px dashed ${AMBAR}`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: -90,
          width: 300,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 64,
          color: INK,
        }}
      >
        PSA
      </div>
      <div
        style={{
          position: "absolute",
          left: 330,
          top: 230,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 50,
          color: AMBAR,
          whiteSpace: "nowrap",
          opacity: P(f, cai + 10, cai + 20),
        }}
      >
        ÷ 2
      </div>
    </div>
  );
};

export const VideoNovembroAzul: React.FC = () => {
  const f = useCurrentFrame();
  const cor = f >= T.so && f < T.falar ? AMBAR : AZUL;
  return (
    <AbsoluteFill>
      <Fundo color={cor} pulses={[T.testo1, T.cortar, T.avise, T.final]} />

      {/* 1. gancho */}
      <Part from={0} to={T.na}>
        <Laco f={f} at={0} x={540} y={520} s={0.9} />
        <Title
          f={f}
          at={4}
          y={790}
          size={92}
          font={SANS}
          weight={900}
          from={AZUL}
          color={AZUL}
        >
          NOVEMBRO AZUL
        </Title>
        <Grande f={f} at={T.sabe} y={960} cor={INK} size={58}>
          qual é o combustível do
          <br />
          câncer de próstata?
        </Grande>
        <Carimbo f={f} at={T.testo1} y={1300} cor={AMBAR} size={78}>
          TESTOSTERONA
        </Carimbo>
      </Part>

      {/* 2. o combustível */}
      <Part from={T.na} to={T.bloco3d}>
        <Grande f={f} at={T.na + 8} y={260} cor={INK} size={56}>
          as células usam o
          <br />
          <span style={{ color: AMBAR }}>hormônio masculino</span> para crescer
        </Grande>
        <Celula2D f={f} at={T.na + 6} corta={T.cortar} />
        <Pill
          x={540}
          y={1390}
          text="principalmente na doença avançada"
          color={AZUL2}
          size={40}
          k={P(f, T.avancada - 12, T.avancada)}
        />
        <Carimbo f={f} at={T.cortar} y={1530} cor={AZUL} size={64}>
          CORTAR O COMBUSTÍVEL
        </Carimbo>
      </Part>

      {/* 3. mecanismo em 3D */}
      <Sequence
        from={T.bloco3d}
        durationInFrames={T.so - T.bloco3d + 6}
        layout="none"
      >
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 900px 900px at 50% 48%, rgba(46,110,200,.40), rgba(46,110,200,0) 75%)",
            }}
          />
          <Prostata3D
            f={f}
            t={{
              ini: T.bloco3d,
              desliga: T.desliga,
              fecha: T.fecha,
              trava: T.trava,
            }}
          />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.bloco3d} to={T.so}>
        {f < T.fecha - 6 && (
          <>
            <Grande f={f} at={T.bloco3d + 8} y={200} cor={AMBAR} size={60}>
              1. desliga a fábrica
            </Grande>
            <Pill
              x={540}
              y={1460}
              text="GOSSERRELINA"
              color={AZUL}
              size={46}
              k={P(f, T.gosse - 8, T.gosse + 4)}
            />
            <Pill
              x={540}
              y={1570}
              text="LEUPRORRELINA"
              color={AZUL}
              size={46}
              k={P(f, T.leupro - 8, T.leupro + 4)}
            />
            <Pill
              x={540}
              y={330}
              text="os testículos param de produzir"
              color={AZUL2}
              size={36}
              k={P(f, T.testiculos - 8, T.testiculos + 4)}
            />
          </>
        )}
        {f >= T.fecha - 6 && f < T.abira - 6 && (
          <>
            <Grande f={f} at={T.fecha} y={200} cor={AMBAR} size={60}>
              2. tapa a fechadura
            </Grande>
            <Pill
              x={540}
              y={1460}
              text="BICALUTAMIDA"
              color={AZUL}
              size={46}
              k={P(f, T.bical - 8, T.bical + 4)}
            />
            <Pill
              x={540}
              y={1570}
              text="ENZALUTAMIDA"
              color={AZUL}
              size={46}
              k={P(f, T.enza - 8, T.enza + 4)}
            />
          </>
        )}
        {f >= T.abira - 6 && (
          <>
            <Grande f={f} at={T.abira} y={200} cor={AMBAR} size={60}>
              3. trava a produção
            </Grande>
            <Pill
              x={540}
              y={1460}
              text="ABIRATERONA"
              color={AZUL}
              size={46}
              k={P(f, T.abira - 8, T.abira + 4)}
            />
            <Pill
              x={540}
              y={1570}
              text="+ prednisona"
              color={AZUL2}
              size={42}
              k={P(f, T.predni - 8, T.predni + 4)}
            />
          </>
        )}
      </Part>

      {/* 4. virada */}
      <Part from={T.so} to={T.finas}>
        <Emoji f={f} at={T.so + 4} x={540} y={720} size={240}>
          🤫
        </Emoji>
        <Grande f={f} at={T.detalhe - 4} y={950} cor={AMBAR} size={74}>
          um detalhe que
          <br />
          pouca gente sabe
        </Grande>
      </Part>

      {/* 5. finasterida e o PSA */}
      <Part from={T.finas} to={T.falar}>
        <Pill
          x={540}
          y={260}
          text="FINASTERIDA"
          color={AMBAR}
          size={64}
          k={P(f, T.finas, T.finas + 10)}
        />
        <Pill
          x={330}
          y={420}
          text="próstata aumentada"
          color={AZUL2}
          size={36}
          k={P(f, T.aumentada - 8, T.aumentada + 4)}
        />
        <Pill
          x={770}
          y={420}
          text="queda de cabelo"
          color={AZUL2}
          size={36}
          k={P(f, T.cabelo - 8, T.cabelo + 4)}
        />
        <Medidor f={f} at={T.psa - 10} cai={T.metade - 4} />
        <Carimbo f={f} at={T.avise} y={1360} cor={AMBAR} size={50}>
          AVISE O MÉDICO ANTES DO EXAME
        </Carimbo>
      </Part>

      {/* 6. o exame */}
      <Part from={T.falar} to={T.ja}>
        <Title
          f={f}
          at={T.falar + 6}
          y={250}
          size={76}
          weight={700}
          font={SANS}
          from={AZUL}
          color={AZUL}
        >
          e o exame?
        </Title>
        <Linha f={f} at={T.cinquenta - 8} y={460} cor={AZUL} emoji="🎂" h={160}>
          a partir dos 50 anos
        </Linha>
        <Linha f={f} at={T.quarenta - 8} y={650} cor={AZUL} emoji="👨🏾" h={200}>
          dos 45, se você é negro ou tem pai ou irmão com a doença
        </Linha>
        <Linha f={f} at={T.converse - 8} y={880} cor={AMBAR} emoji="🩺" h={200}>
          converse com seu médico sobre o PSA e o toque
        </Linha>
      </Part>

      {/* 7. pergunta */}
      <Part from={T.ja} to={T.siga}>
        <Laco f={f} at={T.ja} x={540} y={470} s={0.6} />
        <Grande f={f} at={T.ja + 6} y={720} cor={AZUL} size={96}>
          Você já fez
          <br />o seu?
        </Grande>
        <Pill
          x={540}
          y={1060}
          text="💬 comenta aqui"
          color={AZUL2}
          size={46}
          k={P(f, T.comenta - 6, T.comenta + 6)}
        />
        <Pill
          x={540}
          y={1200}
          text="📲 manda para um homem que precisa ver"
          color={AMBAR}
          size={38}
          k={P(f, T.manda - 6, T.manda + 6)}
        />
      </Part>

      {/* 8. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("novembroAzul/logo.jpg")}
          style={{
            position: "absolute",
            left: 350,
            top: 380,
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: `6px solid ${AZUL}`,
            boxShadow: `0 0 50px ${rgba(AZUL, 0.5)}`,
          }}
        />
        <Grande f={f} at={T.siga + 4} y={800} cor={INK} size={120}>
          ME SIGA
        </Grande>
        <div
          style={{
            position: "absolute",
            top: 950,
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
      </Part>

      {/* 9. tela final */}
      <Part from={T.final - 4} to={DURATION_NOVEMBRO_AZUL} inY={100} outDur={1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
            const at = T.final + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 700 + i * 110,
                  width: W,
                  textAlign: "center",
                  fontFamily: SERIF,
                  fontWeight: i === 1 ? 600 : 400,
                  fontSize: i === 1 ? 92 : 80,
                  color:
                    i === 1
                      ? mix(AZUL, "#eaf4ff", P(f, at, at + 20))
                      : mix(AZUL, INK, P(f, at, at + 16)),
                  opacity: k,
                  transform: `translateY(${(1 - k) * 40}px)`,
                }}
              >
                {l}
              </div>
            );
          },
        )}
      </Part>
      <Grain />
      {TEM_NARRACAO && <Audio src={staticFile("novembroAzul/narracao.mp3")} />}
      <Audio
        src={staticFile("novembroAzul/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          (1 - P(fr, DURATION_NOVEMBRO_AZUL - 60, DURATION_NOVEMBRO_AZUL))
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

// Capa (1080×1920): tudo entre y≈300 e y≈1620 (recorte 3:4 do TikTok e do Instagram).
export const CapaNovembroAzul: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Fundo color={AZUL} pulses={[]} />
    <Laco f={100} at={0} x={540} y={560} s={0.8} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 64,
        letterSpacing: 4,
        color: AZUL,
        textShadow: `0 0 30px ${rgba(AZUL, 0.5)}`,
      }}
    >
      NOVEMBRO AZUL
    </div>
    <div
      style={{
        position: "absolute",
        top: 800,
        left: 60,
        width: W - 120,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 84,
        lineHeight: 1.08,
        color: INK,
      }}
    >
      O COMBUSTÍVEL DO
      <br />
      <span style={{ color: AZUL }}>CÂNCER DE PRÓSTATA</span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1150,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${AMBAR}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 64,
        letterSpacing: 2,
        color: AMBAR,
        background: rgba(AMBAR, 0.08),
        whiteSpace: "nowrap",
      }}
    >
      E OS REMÉDIOS
    </div>
    <div
      style={{
        position: "absolute",
        top: 1320,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 54,
        lineHeight: 1.2,
        color: INK,
      }}
    >
      + o que pode
      <br />
      <span style={{ color: AMBAR }}>esconder o PSA</span>
    </div>
    <Grain />
  </AbsoluteFill>
);
