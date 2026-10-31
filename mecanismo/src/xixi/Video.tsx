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
import { JORNAL, MAO, SANS } from "../fonts";
import { Kicker, Nota } from "../sarampo/Vox";
import {
  Capitulo,
  Carimbo,
  E,
  Fundo,
  Item,
  KIT,
  Manchete,
  MarcaE,
  Recorte,
} from "../febre/Video";
import falaJson from "./fala.json";

// "Por que o frio dá vontade de fazer xixi?" no estilo Vox escuro (mesmas peças do febre/Video.tsx):
// corpo em silhueta com os vasos da pele apertando, o sangue indo para o centro, rins e bexiga enchendo.
// Roteiro e fontes: roteiros/frio_xixi.md. Narração feita pela usuária (OpenArt); tempos em fala.json.
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
  banheiro: Tw("banheiro"),
  impressao: Tw("impressão"),
  diurese: Tw("diurese"),
  aperta: Tw("aperta"),
  vasos: Tw("vasos"),
  mao: Tw("mão"),
  gelados: Tw("gelados"),
  centro: Tw("centro"),
  pressao: Tw("pressão"),
  sobe: Tw("sobe"),
  rins: Tw("rins"),
  sobrou: Tw("sobrou"),
  urina: Tw("urina"),
  estudos: Tw("estudos"),
  hormonio: Tw("hormônio"),
  antidiuretico: Tw("antidiurético"),
  menos: Tw("menos"),
  sair: Tw("sair"),
  sua: Tw("sua"),
  suor: Tw("suor"),
  xixi: Tw("xixi"),
  sede: Tw("sede"),
  beber: Tw("beber"),
  ardencia: Tw("ardência"),
  sangue: Tw("sangue", 3),
  semFrio: Tw("sem"),
  procure: Tw("procure"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_XIXI = T.final + 90;
const PARTES: [number, number][] = [
  [0, Tw("lembra") - 6],
  [Tw("lembra") - 6, Tw("só") - 6],
  [Tw("só") - 6, Tw("os", 2) - 6],
  [Tw("os", 2) - 6, Tw("estudos") - 40],
  [Tw("estudos") - 40, Tw("quase") - 40],
  [Tw("quase") - 40, Tw("mas") - 6],
  [Tw("mas") - 6, T.siga],
  [T.siga, T.final],
  [T.final, DURATION_XIXI],
];
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.banheiro, "pop", 0.18],
  [T.diurese, "plim", 0.2],
  [PARTES[1][0], "whoosh", 0.25],
  [T.aperta, "trava", 0.25],
  [PARTES[2][0], "whoosh", 0.25],
  [T.sobe, "bip", 0.2],
  [PARTES[3][0], "whoosh", 0.25],
  [T.sobrou, "pop", 0.2],
  [PARTES[4][0], "whoosh", 0.25],
  [T.menos, "trava", 0.25],
  [PARTES[5][0], "whoosh", 0.25],
  [T.xixi, "pop", 0.2],
  [PARTES[6][0], "whoosh", 0.25],
  [T.beber, "pop", 0.18],
  [T.procure, "trava", 0.25],
  [T.siga, "whoosh", 0.25],
  [T.final - 4, "final", 0.5],
];
// trilha que abaixa sob a voz (0,22 nas pausas, 0,09 com fala)
const FALANDO = (() => {
  const v = new Float32Array(DURATION_XIXI + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_XIXI, fim + 6);
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

const W = 1080;
const Cena: React.FC<{ f: number; i: number; children: React.ReactNode }> = ({
  f,
  i,
  children,
}) => {
  const [a, b] = PARTES[i];
  if (f < a || f >= b) return null;
  const p = (f - a) / (b - a);
  const o = Math.min(it(f, a, a + 10, 0, 1, OUT), 1 - P(f, b - 8, b));
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        transform: `scale(${1 + 0.04 * p})`,
        transformOrigin: "540px 820px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- corpo em silhueta ----------
// aperto: 0 = vasos da pele abertos (vermelho), 1 = apertados (finos, azuis); centro: sangue indo para o tronco
const Corpo: React.FC<{
  f: number;
  aperto: number;
  centro: number;
  x?: number;
  y?: number;
  s?: number;
}> = ({ f, aperto, centro, x = 540, y = 1030, s = 1 }) => {
  const vaso = (d: string, k: number) => (
    <path
      key={k}
      d={d}
      stroke={aperto > 0.5 ? E.azul : E.vermelho}
      strokeWidth={14 - 9 * aperto}
      strokeLinecap="round"
      fill="none"
      opacity={0.9}
    />
  );
  // pontinhos de sangue saindo dos braços e pernas para o tronco
  const caminhos: [number, number][] = [
    [-230, -40],
    [230, -40],
    [-95, 380],
    [95, 380],
  ];
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* silhueta */}
        <circle
          cx={0}
          cy={-330}
          r={78}
          fill={E.cartao}
          stroke={E.texto}
          strokeWidth={5}
        />
        <rect
          x={-120}
          y={-235}
          width={240}
          height={330}
          rx={80}
          fill={E.cartao}
          stroke={E.texto}
          strokeWidth={5}
        />
        <path
          d="M -120 -200 L -250 40"
          stroke={E.texto}
          strokeWidth={56}
          strokeLinecap="round"
          opacity={0.25}
        />
        <path
          d="M 120 -200 L 250 40"
          stroke={E.texto}
          strokeWidth={56}
          strokeLinecap="round"
          opacity={0.25}
        />
        <path
          d="M -60 90 L -100 420"
          stroke={E.texto}
          strokeWidth={64}
          strokeLinecap="round"
          opacity={0.25}
        />
        <path
          d="M 60 90 L 100 420"
          stroke={E.texto}
          strokeWidth={64}
          strokeLinecap="round"
          opacity={0.25}
        />
        {/* vasos da pele */}
        {[
          "M -120 -190 L -245 30",
          "M 120 -190 L 245 30",
          "M -60 100 L -98 405",
          "M 60 100 L 98 405",
        ].map((d, i) => vaso(d, i))}
        {/* mãos e pés: ficam azuis no frio */}
        {[
          [-255, 55],
          [255, 55],
          [-102, 440],
          [102, 440],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={34}
            fill={aperto > 0.5 ? E.azul : "#e9b9a0"}
            opacity={0.9}
          />
        ))}
        {/* tronco ficando mais "cheio" de sangue */}
        <rect
          x={-95}
          y={-200}
          width={190}
          height={270}
          rx={60}
          fill={E.vermelho}
          opacity={0.12 + 0.4 * centro}
        />
        {centro > 0 &&
          caminhos.flatMap(([sx, sy], i) =>
            Array.from({ length: 3 }, (_, j) => {
              const u = ((f / 24 + j / 3 + i * 0.13) % 1) * centro;
              return (
                <circle
                  key={`${i}-${j}`}
                  cx={sx * (1 - u)}
                  cy={sy + (-60 - sy) * u}
                  r={11}
                  fill={E.vermelho}
                  opacity={centro * (1 - u * 0.6)}
                />
              );
            }),
          )}
      </g>
    </svg>
  );
};

// mostrador de pressão simples (meia-lua)
const Pressao: React.FC<{
  f: number;
  at: number;
  valor: number;
  x: number;
  y: number;
}> = ({ f, at, valor, x, y }) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  const r = 120;
  const ang = Math.PI * (1 - valor);
  return (
    <svg width={W} height={1920} style={{ position: "absolute", opacity: k }}>
      <path
        d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`}
        fill={E.cartao}
        stroke={E.texto}
        strokeWidth={5}
      />
      <line
        x1={x}
        y1={y}
        x2={x + Math.cos(ang) * r * 0.8}
        y2={y - Math.sin(ang) * r * 0.8}
        stroke={E.vermelho}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={14} fill={E.vermelho} />
      <text
        x={x}
        y={y + 54}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={34}
        fill={E.texto}
      >
        pressão
      </text>
    </svg>
  );
};

// rins e bexiga enchendo
const Rins: React.FC<{ f: number; nivel: number; brilho: number }> = ({
  f,
  nivel,
  brilho,
}) => {
  const rim = (dx: number, flip: number) => (
    <path
      d="M 0 -110 C 70 -110 95 -40 80 10 C 70 45 30 40 30 0 C 30 -30 -10 -30 -10 10 C -10 60 30 110 -20 115 C -90 120 -100 -110 0 -110 Z"
      transform={`translate(${540 + dx} 640) scale(${flip} 1)`}
      fill="#b04a5a"
      stroke={E.texto}
      strokeWidth={4}
      style={{ filter: `drop-shadow(0 0 ${18 * brilho}px ${E.vermelho})` }}
    />
  );
  const bx = 540,
    by = 1060,
    bw = 260,
    bh = 240;
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      {rim(-190, 1)}
      {rim(190, -1)}
      {/* ureteres */}
      <path
        d={`M 370 740 C 420 880 470 920 ${bx - 60} ${by - bh / 2 + 20}`}
        stroke={"#ffd84d"}
        strokeWidth={10}
        fill="none"
        opacity={0.7}
      />
      <path
        d={`M 710 740 C 660 880 610 920 ${bx + 60} ${by - bh / 2 + 20}`}
        stroke={"#ffd84d"}
        strokeWidth={10}
        fill="none"
        opacity={0.7}
      />
      {/* gotas descendo */}
      {nivel > 0 &&
        Array.from({ length: 6 }, (_, i) => {
          const u = (f / 30 + i / 6) % 1;
          const lado = i % 2 ? 1 : -1;
          return (
            <circle
              key={i}
              cx={540 + lado * (170 - 110 * u)}
              cy={740 + 200 * u}
              r={9}
              fill="#ffd84d"
              opacity={0.9}
            />
          );
        })}
      <clipPath id="bexiga">
        <ellipse cx={bx} cy={by} rx={bw / 2} ry={bh / 2} />
      </clipPath>
      <ellipse
        cx={bx}
        cy={by}
        rx={bw / 2}
        ry={bh / 2}
        fill={E.cartao}
        stroke={E.texto}
        strokeWidth={5}
      />
      <rect
        x={bx - bw / 2}
        y={by + bh / 2 - bh * nivel}
        width={bw}
        height={bh}
        fill="#ffd84d"
        opacity={0.75}
        clipPath="url(#bexiga)"
      />
      <text
        x={bx}
        y={by + bh / 2 + 60}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={36}
        fill={E.texto}
      >
        bexiga
      </text>
    </svg>
  );
};

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <Capitulo f={f} at={2} kicker="Curiosidade do corpo" size={88}>
      Por que o frio dá vontade de{" "}
      <MarcaE f={f} at={T.banheiro}>
        fazer xixi
      </MarcaE>
      ?
    </Capitulo>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 640,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 230,
      }}
    >
      🥶<span style={{ fontSize: 180 }}>🚽</span>
    </div>
    <Nota
      f={f}
      at={T.impressao - 6}
      x={150}
      y={1010}
      w={800}
      size={66}
      cor={E.vermelho}
    >
      não é impressão sua…
    </Nota>
    <Recorte
      f={f}
      at={T.diurese - 8}
      x={170}
      y={1150}
      w={740}
      rot={-2}
      seed={3}
    >
      <Kicker cor={E.vermelho}>isso tem nome</Kicker>
      <Manchete size={78}>diurese do frio</Manchete>
    </Recorte>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Capitulo f={f} at={PARTES[1][0] + 4} kicker="Para não perder calor">
      O corpo <span style={{ color: E.azul }}>aperta os vasos</span> da pele
    </Capitulo>
    <Corpo f={f} aperto={it(f, T.aperta, T.vasos + 20, 0, 1, OUT)} centro={0} />
    <Nota
      f={f}
      at={T.mao - 4}
      x={600}
      y={1470}
      w={440}
      size={58}
      cor={E.azul}
      rot={-3}
    >
      mão e pé gelados 🧊
    </Nota>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={2}>
    <Capitulo f={f} at={PARTES[2][0] + 4} kicker="O sangue não some">
      Ele vai para o <span style={{ color: E.vermelho }}>centro do corpo</span>
    </Capitulo>
    <Corpo
      f={f}
      aperto={1}
      centro={it(f, T.centro - 20, T.centro + 30, 0, 1, OUT)}
      x={420}
    />
    <Pressao
      f={f}
      at={T.pressao - 6}
      valor={0.45 + 0.2 * it(f, T.sobe, T.sobe + 20, 0, 1, OUT)}
      x={860}
      y={760}
    />
    <Nota
      f={f}
      at={T.sobe}
      x={700}
      y={860}
      w={360}
      size={52}
      cor={E.vermelho}
      rot={4}
    >
      sobe um pouco ↑
    </Nota>
  </Cena>
);

const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Capitulo f={f} at={PARTES[3][0] + 4} kicker="Os rins percebem">
      “Sobrou líquido!”
    </Capitulo>
    <Rins
      f={f}
      nivel={it(f, T.sobrou, T.urina + 30, 0.2, 0.75)}
      brilho={it(f, T.rins, T.rins + 15, 0, 1)}
    />
    <Carimbo
      f={f}
      at={T.urina - 4}
      x={540}
      y={1480}
      texto="sai pela urina"
      cor={E.verde}
      size={50}
      rot={-5}
    />
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => {
  const nivel = 1 - 0.75 * it(f, T.menos - 10, T.menos + 20, 0, 1, OUT);
  return (
    <Cena f={f} i={4}>
      <Capitulo f={f} at={PARTES[4][0] + 4} kicker="E tem mais" size={70}>
        O{" "}
        <MarcaE f={f} at={T.antidiuretico}>
          hormônio antidiurético
        </MarcaE>{" "}
        diminui
      </Capitulo>
      <div style={{ position: "absolute", left: 120, right: 120, top: 640 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 38,
            color: E.cinza,
            marginBottom: 14,
          }}
        >
          hormônio que segura a água
        </div>
        <div
          style={{
            height: 70,
            borderRadius: 35,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${nivel * 100}%`,
              background: E.azul,
              borderRadius: 35,
              boxShadow: `0 0 24px ${E.azul}`,
            }}
          />
        </div>
      </div>
      {f >= T.sair - 10 &&
        Array.from({ length: 10 }, (_, i) => {
          const t = (f - T.sair + 10 + i * 6) % 50;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: 160 + i * 78,
                top: 900 + t * 9,
                fontFamily: EMOJI,
                fontSize: 52,
                opacity: 1 - t / 50,
              }}
            >
              💧
            </span>
          );
        })}
      <Nota
        f={f}
        at={T.sair - 4}
        x={200}
        y={1380}
        w={700}
        size={66}
        cor={E.azul}
        rot={-2}
      >
        → sai ainda mais água
      </Nota>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1500,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 30,
          color: E.cinza,
          opacity: it(f, T.estudos, T.estudos + 10, 0, 1),
        }}
      >
        segundo estudos sobre exposição ao frio
      </div>
    </Cena>
  );
};

const S6: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={5}>
    <Capitulo f={f} at={PARTES[5][0] + 4} kicker="No frio, quase não suamos">
      A água sai por outro caminho
    </Capitulo>
    <Item f={f} at={T.sua - 6} y={650} emoji="💦">
      suor:{" "}
      <span style={{ color: E.vermelho, textDecoration: "line-through" }}>
        quase nada
      </span>
    </Item>
    <Item f={f} at={T.xixi - 10} y={860} emoji="🚽">
      xixi: <span style={{ color: E.verde }}>leva a água extra</span>
    </Item>
    <Carimbo
      f={f}
      at={T.xixi}
      x={540}
      y={1250}
      texto="diurese do frio"
      cor={E.azul}
      size={54}
      rot={-6}
    />
  </Cena>
);

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <Capitulo f={f} at={PARTES[6][0] + 4} kicker="Guarda essa" size={74}>
      No frio, a <span style={{ color: E.azul }}>sede</span> também diminui
    </Capitulo>
    <Item f={f} at={T.beber - 8} y={560} emoji="🥤">
      não pare de beber água
    </Item>
    {f >= T.ardencia - 10 && (
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 800,
          borderRadius: 24,
          border: `4px solid ${E.vermelho}`,
          background: "rgba(255,90,110,0.08)",
          padding: "34px 40px",
          opacity: it(f, T.ardencia - 10, T.ardencia, 0, 1),
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            color: E.vermelho,
            letterSpacing: 3,
            marginBottom: 14,
          }}
        >
          PROCURE UM MÉDICO SE VIER COM:
        </div>
        {[
          [T.ardencia, "🔥 ardência"],
          [Tw("dor"), "⚡ dor"],
          [T.sangue, "🩸 sangue na urina"],
          [T.semFrio, "☀️ ou acontecer mesmo sem frio"],
        ].map(([at, txt], i) => (
          <div
            key={i}
            style={{
              fontFamily: JORNAL,
              fontWeight: 900,
              fontSize: 50,
              color: E.texto,
              opacity: f >= (at as number) - 4 ? 1 : 0.15,
              marginTop: 8,
            }}
          >
            {txt}
          </div>
        ))}
      </div>
    )}
  </Cena>
);

const S8: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={7}>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 520,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 150,
      }}
    >
      👩‍⚕️
    </div>
    <Recorte f={f} at={T.siga} x={110} y={760} w={860} rot={-1} seed={7}>
      <Manchete size={84}>Me siga</Manchete>
      <div
        style={{
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 54,
          color: E.texto,
          marginTop: 8,
        }}
      >
        para mais dicas de farmacologia e{" "}
        <MarcaE f={f} at={T.siga + 20}>
          curiosidades sobre a área
        </MarcaE>
      </div>
    </Recorte>
  </Cena>
);

const S9: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={8}>
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 640,
        width: 900,
        textAlign: "center",
        fontFamily: JORNAL,
        fontWeight: 900,
        fontSize: 86,
        lineHeight: 1.12,
        color: E.texto,
      }}
    >
      Consulte um{" "}
      <MarcaE f={f} at={T.final + 12}>
        profissional de saúde
      </MarcaE>{" "}
      para orientações.
    </div>
  </Cena>
);

export const VideoXixi: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S9 f={f} />
      <Audio src={staticFile("xixi/narracao.mp3")} />
      <Audio
        src={staticFile("xixi/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_XIXI - 60, DURATION_XIXI))
        }
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(KIT[name])} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e 1620
export const CapaXixi: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", left: 70, top: 330, width: 940 }}>
      <Kicker size={32} cor={E.vermelho}>
        Curiosidade do corpo
      </Kicker>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1.02,
          color: E.texto,
          marginTop: 14,
        }}
      >
        Por que o frio dá vontade de{" "}
        <MarcaE f={100} at={0}>
          fazer xixi
        </MarcaE>
        ?
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: 930,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 240,
      }}
    >
      🥶<span style={{ fontSize: 190 }}>🚽</span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 1300,
        width: 860,
        fontFamily: MAO,
        fontWeight: 700,
        fontSize: 72,
        color: E.azul,
        transform: "rotate(-3deg)",
        textAlign: "center",
      }}
    >
      a culpa é dos seus vasos 🩸
    </div>
  </AbsoluteFill>
);
