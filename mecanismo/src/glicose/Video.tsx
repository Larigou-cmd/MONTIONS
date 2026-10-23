import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import {
  Background,
  Grain,
  OUT,
  P,
  Part,
  Pill,
  SNAP,
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "O que acontece no corpo quando a glicose sobe?" — Modelo 1 com fotos do OpenArt (Kling 3 Omni) animadas em código.
// Roteiro e fontes: glicose/roteiro.md. Narração da Juliana; tempos alinhados em fala.json.
const OURO = "#fbbf24",
  AZUL = "#60a5fa",
  VERM = "#ef4444",
  VERDE = "#4ade80";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  pao: Tw("pão"),
  glicose: Tw("glicose"),
  subir: Tw("subir"),
  pancreas: Tw("quem") - 4,
  beta: Tw("lá") - 4,
  insulina: Tw("insulina"),
  chave: Tw("a", 3) - 4,
  chaveW: Tw("chave"),
  musculo: Tw("músculo"),
  gordura: Tw("gordura"),
  portas: Tw("portas"),
  figado: Tw("no") - 4,
  glicogenio: Tw("glicogênio"),
  estoque: Tw("estoque"),
  horas: Tw("em", 3) - 4,
  normal: Tw("normal"),
  cair: Tw("cair"),
  glucagon: Tw("glucagon"),
  diabetes: Tw("no", 2) - 4,
  fechadura: Tw("fechadura"),
  resistencia: Tw("resistência"),
  sobrando: Tw("sobrando"),
  metformina: Tw("é", 3) - 4,
  metforminaW: Tw("metformina"),
  freia: Tw("freia"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_GLICOSE = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.glicose, "pop", 0.2],
  [T.pancreas, "whoosh", 0.25],
  [T.beta, "whoosh", 0.25],
  [T.insulina, "plim", 0.25],
  [T.chave, "whoosh", 0.25],
  [T.chaveW, "trava", 0.3],
  [T.portas, "pop", 0.22],
  [T.figado, "whoosh", 0.25],
  [T.glicogenio, "pop", 0.22],
  [T.horas, "whoosh", 0.25],
  [T.glucagon, "plim", 0.25],
  [T.diabetes, "whoosh", 0.25],
  [T.fechadura, "trava", 0.35],
  [T.metformina, "whoosh", 0.25],
  [T.freia, "trava", 0.3],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];
const ESCURO: React.CSSProperties = { background: "rgba(5,8,20,0.88)" };

// foto do OpenArt em tela cheia, com zoom lento e escurecida em cima/embaixo para os textos
const Foto: React.FC<{
  src: string;
  de: number;
  ate: number;
  zoom?: [number, number];
  origem?: string;
  filtro?: string;
}> = ({ src, de, ate, zoom = [1.04, 1.16], origem = "50% 50%", filtro }) => {
  const f = useCurrentFrame();
  if (f < de - 2 || f > ate + 2) return null;
  const k = Math.min(
    it(f, de - 2, de + 10, 0, 1, OUT),
    1 - it(f, ate - 8, ate + 2, 0, 1, OUT),
  );
  const z = zoom[0] + (zoom[1] - zoom[0]) * P(f, de, ate);
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <Img
        src={staticFile(`glicose/img/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${z})`,
          transformOrigin: origem,
          filter: filtro,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(rgba(5,8,20,0.8), rgba(5,8,20,0) 26%, rgba(5,8,20,0) 64%, rgba(5,8,20,0.88))",
        }}
      />
    </AbsoluteFill>
  );
};

// partículas douradas de glicose subindo por cima da foto
const Glicose: React.FC<{ de: number; ate: number; n?: number }> = ({
  de,
  ate,
  n = 26,
}) => {
  const f = useCurrentFrame();
  if (f < de || f > ate) return null;
  const mais = P(f, de, de + 90);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: Math.round(n * (0.3 + 0.7 * mais)) }, (_, i) => {
        const x = 120 + ((i * 197) % 840) + Math.sin(f / 20 + i) * 18;
        const y = 1700 - ((f * (1.2 + (i % 5) * 0.3) + i * 140) % 1500);
        return (
          <polygon
            key={i}
            points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7"
            transform={`translate(${x},${y})`}
            fill={OURO}
            opacity={0.75}
            style={{ filter: `drop-shadow(0 0 10px ${OURO})` }}
          />
        );
      })}
    </svg>
  );
};

const Faixa: React.FC<{
  de: number;
  ate: number;
  children: React.ReactNode;
}> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  if (f < de - 2 || f > ate) return null;
  const k = Math.min(
    it(f, de, de + 10, 0, 1, OUT),
    1 - it(f, ate - 10, ate, 0, 1, OUT),
  );
  return (
    <AbsoluteFill
      style={{ opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

// gráfico da glicose: sobe depois de comer e volta em ~2 h; depois mostra a queda e o glucagon
const Grafico: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 140,
    x1 = 940,
    y0 = 1100,
    alt = 420;
  const desenha = P(f, T.horas, T.normal + 10);
  const curva = (u: number) => {
    const sobe = Math.exp(-Math.pow((u - 0.3) / 0.16, 2));
    return 0.25 + 0.6 * sobe;
  };
  const pts = Array.from({ length: 61 }, (_, i) => {
    const u = i / 60;
    if (u > desenha) return null;
    return `${x0 + (x1 - x0) * u},${y0 - alt * curva(u)}`;
  }).filter(Boolean);
  const queda = P(f, T.cair, T.cair + 20);
  const sobeGlucagon = P(f, T.glucagon, T.glucagon + 30);
  const yFim = y0 - alt * (0.25 - 0.17 * queda + 0.17 * sobeGlucagon);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.dim} strokeWidth={4} />
      <line
        x1={x0}
        y1={y0}
        x2={x0}
        y2={y0 - alt - 40}
        stroke={C.dim}
        strokeWidth={4}
      />
      <line
        x1={x0}
        y1={y0 - alt * 0.25}
        x2={x1}
        y2={y0 - alt * 0.25}
        stroke={rgba(VERDE, 0.5)}
        strokeWidth={3}
        strokeDasharray="12 10"
      />
      <text
        x={x1}
        y={y0 - alt * 0.25 - 14}
        textAnchor="end"
        fontFamily={SANS}
        fontWeight={700}
        fontSize={28}
        fill={VERDE}
      >
        normal
      </text>
      <text
        x={x0}
        y={y0 + 50}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={30}
        fill={C.dim}
      >
        refeição
      </text>
      <text
        x={x0 + (x1 - x0) * 0.62}
        y={y0 + 50}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={800}
        fontSize={34}
        fill={OURO}
        opacity={P(f, T.normal - 30, T.normal - 10)}
      >
        ~2 h
      </text>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={OURO}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 12px ${OURO})` }}
      />
      {f >= T.cair - 6 && (
        <g>
          <line
            x1={x0 + (x1 - x0)}
            y1={y0 - alt * 0.25}
            x2={x1 + 30}
            y2={yFim}
            stroke={queda > 0.5 && sobeGlucagon < 0.5 ? VERM : AZUL}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <circle
            cx={x1 + 30}
            cy={yFim}
            r={16}
            fill={sobeGlucagon > 0.5 ? AZUL : VERM}
          />
        </g>
      )}
    </svg>
  );
};

// comprimido de metformina com um "freio"
const Metformina: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.metforminaW - 6) return null;
  const k = it(f, T.metforminaW - 6, T.metforminaW + 8, 0, 1, SNAP);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(540,1180) rotate(-12) scale(${k})`}>
        <ellipse
          rx={210}
          ry={90}
          fill="#f8fafc"
          style={{ filter: `drop-shadow(0 0 30px ${rgba(AZUL, 0.6)})` }}
        />
        <line
          x1={-150}
          y1={0}
          x2={150}
          y2={0}
          stroke="#cbd5e1"
          strokeWidth={8}
        />
        <text
          y={-22}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={44}
          fill="#1e3a8a"
        >
          metformina
        </text>
      </g>
    </svg>
  );
};

export const VideoGlicose: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background
        color={f >= T.horas && f < T.diabetes ? OURO : AZUL}
        pulses={[T.insulina, T.chaveW, T.glucagon, T.fechadura, T.final]}
      />
      {/* fotos */}
      <Foto src="f1_pao.png" de={0} ate={T.glicose - 6} zoom={[1.02, 1.14]} />
      <Foto src="f2_sangue.png" de={T.glicose - 10} ate={T.pancreas} />
      <Glicose de={T.glicose - 10} ate={T.pancreas} />
      <Foto src="f4_beta.png" de={T.pancreas} ate={T.chave} zoom={[1.0, 1.3]} origem="55% 45%" />
      <Foto
        src="f5_chave.png"
        de={T.chave}
        ate={T.figado}
        zoom={[1.15, 1.02]}
        origem="60% 45%"
      />
      <Foto src="f6_figado.png" de={T.figado} ate={T.horas} />
      <Foto
        src="f7_fechadura.png"
        de={T.diabetes}
        ate={T.metformina}
        zoom={[1.02, 1.18]}
      />
      <Foto
        src="f6_figado.png"
        de={T.metformina}
        ate={T.siga}
        zoom={[1.18, 1.05]}
        filtro="saturate(0.7) brightness(0.8)"
      />

      {/* 1. gancho */}
      <Faixa de={0} ate={T.pancreas}>
        <Title
          f={f}
          at={4}
          y={180}
          size={64}
          font={SANS}
          weight={900}
          color={C.ink}
          from={OURO}
        >
          VOCÊ COMEU UM PÃO…
        </Title>
        <Pill
          x={540}
          y={1560}
          text="🩸 a glicose do sangue sobe"
          color={OURO}
          size={42}
          k={P(f, T.glicose, T.glicose + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 2. pâncreas */}
      <Faixa de={T.pancreas} ate={T.beta}>
        <Title
          f={f}
          at={T.pancreas + 4}
          y={190}
          size={70}
          weight={600}
          from={OURO}
        >
          o pâncreas percebe
        </Title>
      </Faixa>
      {/* 3. células beta */}
      <Faixa de={T.beta} ate={T.chave}>
        <Title f={f} at={T.beta + 4} y={190} size={64} weight={600} from={OURO}>
          células beta
        </Title>
        <Pill
          x={540}
          y={1560}
          text="✨ liberam INSULINA"
          color={OURO}
          size={46}
          k={P(f, T.insulina, T.insulina + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 4. a chave */}
      <Faixa de={T.chave} ate={T.figado}>
        <Title
          f={f}
          at={T.chaveW}
          y={180}
          size={64}
          font={SANS}
          weight={900}
          color={C.ink}
          from={OURO}
        >
          INSULINA = CHAVE <span style={{ fontFamily: EMOJI }}>🔑</span>
        </Title>
        <Pill
          x={330}
          y={1480}
          text="💪 músculo"
          color={OURO}
          size={40}
          k={P(f, T.musculo, T.musculo + 12)}
          style={ESCURO}
        />
        <Pill
          x={750}
          y={1480}
          text="🧈 gordura"
          color={OURO}
          size={40}
          k={P(f, T.gordura, T.gordura + 12)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1600}
          text="abre a porta → a glicose entra"
          color={VERDE}
          size={40}
          k={P(f, T.portas, T.portas + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 5. fígado */}
      <Faixa de={T.figado} ate={T.horas}>
        <Title
          f={f}
          at={T.figado + 4}
          y={190}
          size={66}
          weight={600}
          from={OURO}
        >
          no fígado, a sobra vira reserva
        </Title>
        <Pill
          x={540}
          y={1560}
          text="🔋 GLICOGÊNIO: estoque de energia"
          color={OURO}
          size={40}
          k={P(f, T.glicogenio, T.glicogenio + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 6. gráfico: volta ao normal; glucagon */}
      <Part from={T.horas} to={T.diabetes + 6} inY={100}>
        <Title
          f={f}
          at={T.horas + 4}
          y={300}
          size={60}
          weight={600}
          from={OURO}
        >
          em cerca de 2 horas, volta ao normal
        </Title>
        <Grafico />
        <Card
          f={f}
          at={T.glucagon - 6}
          x={140}
          y={1240}
          w={800}
          h={170}
          border={rgba(AZUL, 0.7)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 34px",
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 64 }}>🔵</span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: bornColor(f, T.glucagon, AZUL, AZUL),
              }}
            >
              GLUCAGON
            </span>
            <span style={{ fontSize: 34, fontWeight: 600 }}>
              se cair demais, solta o estoque
            </span>
          </span>
        </Card>
      </Part>
      {/* 7. resistência */}
      <Faixa de={T.diabetes} ate={T.metformina}>
        <Title
          f={f}
          at={T.diabetes + 4}
          y={180}
          size={64}
          font={SANS}
          weight={900}
          color={C.ink}
          from={VERM}
        >
          DIABETES TIPO 2
        </Title>
        <Pill
          x={540}
          y={1440}
          text="🔒 a fechadura emperra"
          color={VERM}
          size={42}
          k={P(f, T.fechadura, T.fechadura + 12)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1540}
          text="resistência à insulina"
          color={VERM}
          size={42}
          k={P(f, T.resistencia, T.resistencia + 12)}
          style={ESCURO}
        />
        <Pill
          x={540}
          y={1640}
          text="🩸 glicose sobrando no sangue"
          color={OURO}
          size={40}
          k={P(f, T.sobrando, T.sobrando + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 8. metformina */}
      <Faixa de={T.metformina} ate={T.siga}>
        <Title
          f={f}
          at={T.metformina + 4}
          y={190}
          size={62}
          weight={600}
          from={AZUL}
        >
          aí entram os remédios
        </Title>
        <Metformina />
        <Pill
          x={540}
          y={1560}
          text="🛑 freia a produção de glicose no fígado"
          color={AZUL}
          size={38}
          k={P(f, T.freia, T.freia + 12)}
          style={ESCURO}
        />
      </Faixa>
      {/* 9. me siga */}
      <Part from={T.siga} to={T.final + 2} inY={100}>
        <Emoji f={f} at={T.siga - 4} x={540} y={600} size={170}>
          👩‍⚕️
        </Emoji>
        <Card
          f={f}
          at={T.siga}
          x={110}
          y={760}
          w={860}
          h={300}
          border={rgba(OURO, 0.7)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 84,
              color: bornColor(f, T.siga, C.ink, OURO),
            }}
          >
            Me siga
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.3,
            }}
          >
            para mais dicas de farmacologia e curiosidades sobre a área
          </span>
        </Card>
      </Part>
      {/* 10. tela final */}
      <Part from={T.final - 4} to={DURATION_GLICOSE} inY={100} outDur={1}>
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
                      ? bornColor(f, at, OURO, "#fffbeb", 20)
                      : bornColor(f, at, C.ink, OURO),
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
      <Audio src={staticFile("glicose/narracao.mp3")} />
      <Audio
        src={staticFile("glicose/musica.wav")}
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_GLICOSE - 60, DURATION_GLICOSE))
        }
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
