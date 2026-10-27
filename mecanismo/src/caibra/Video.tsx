import React from "react";
import {
  AbsoluteFill,
  Audio,
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
  mix,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Por que dá cãibra de madrugada?" no Modelo 1, todo animado em código (roteiro e fontes: caibra/roteiro.md).
// Narração da Juliana (ElevenLabs, eleven_v4). Tempos: audio/caibra_palavras.json, alinhados ao texto em fala.json.
export const COR = "#60a5fa"; // noite
export const VERM = "#ef4444",
  VERDE = "#4ade80",
  AMAR = "#fbbf24",
  MUSC = "#f87171";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
export const T = {
  caibra: Tw("cãibra"),
  metade: Tw("metade"),
  acontece: Tw("ela") - 6,
  contrai: Tw("contrai"),
  solta: Tw("solta"),
  culpado: Tw("culpado") - 14,
  minerais: Tw("minerais"),
  nervo: Tw("nervo"),
  dispara: Tw("dispara"),
  madrugada: Tw("mas") - 6,
  pe: Tw("pé"),
  horas: Tw("horas"),
  cansaco: Tw("cansaço"),
  agua: Tw("água"),
  remedios: Tw("remédios"),
  truque: Tw("na") - 6,
  puxar: Tw("puxar"),
  sensor: Tw("sensor"),
  relaxar: Tw("relaxar"),
  magnesio: Tw("magnésio") - 10,
  previne: Tw("previne"),
  sempre: Tw("se", 2) - 6,
  profissional: Tw("profissional"),
  lista: Tw("lista"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_CAIBRA = T.final + 90;
const PARTES: [number, number][] = [
  [0, T.acontece + 6],
  [T.acontece, T.culpado + 6],
  [T.culpado, T.madrugada + 6],
  [T.madrugada, T.truque + 6],
  [T.truque, T.magnesio + 6],
  [T.magnesio, T.sempre + 6],
  [T.sempre, T.siga + 6],
  [T.siga, T.final + 2],
  [T.final - 4, DURATION_CAIBRA],
];
// FIM TEMPOS
const R = (i: number) => PARTES[i];
export const SFX_CAIBRA: [number, string, number][] = [
  [T.caibra, "trava", 0.32],
  [T.metade, "pop", 0.22],
  [T.contrai, "trava", 0.35],
  [T.minerais, "pop", 0.2],
  [T.dispara, "bip", 0.22],
  [T.pe, "pop", 0.2],
  [T.cansaco, "pop", 0.2],
  [T.agua, "pop", 0.2],
  [T.remedios, "pop", 0.2],
  [T.puxar, "whoosh", 0.25],
  [T.relaxar, "plim", 0.28],
  [T.previne, "trava", 0.35],
  [T.profissional, "pop", 0.22],
  [T.final, "plim", 0.3],
  ...PARTES.slice(1).map(
    ([a]) => [a, "whoosh", 0.25] as [number, string, number],
  ),
];

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// perna vista de lado (joelho em cima, pé embaixo apontando para a esquerda).
// pe: ângulo do pé em graus (positivo = ponta para baixo; negativo = ponta para cima). trava: 0..1 contração da panturrilha.
const Perna: React.FC<{
  x: number;
  y: number;
  s?: number;
  pe: number;
  trava: number;
  f: number;
  sensor?: number;
}> = ({ x, y, s = 1, pe, trava, f, sensor = 0 }) => {
  const treme = trava > 0.5 ? Math.sin(f * 2.3) * 3 * trava : 0;
  const cor = mix("#b9a2a2", VERM, trava);
  const fibras = Array.from({ length: 7 }, (_, i) => i);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* coxa cortada e joelho */}
      <path
        d="M-62,-430 Q-80,-350 -68,-300 Q-60,-270 -45,-262 L50,-262 Q66,-280 70,-320 Q74,-380 62,-430 Z"
        fill="#cbb6a6"
      />
      <ellipse cx={-48} cy={-300} rx={22} ry={30} fill="#d9c4b4" />
      {/* canela */}
      <path d="M-55,-290 L-40,170 L25,170 L55,-290 Z" fill="#d9c4b4" />
      {/* panturrilha (músculo) atrás da perna */}
      <g transform={`translate(${treme},0)`}>
        <path
          d={`M30,-270 Q${150 + 30 * trava},${-120 + 40 * trava} ${85 + 10 * trava},${30 + 30 * trava} Q60,140 30,170 L30,-270 Z`}
          fill={cor}
          stroke={mix("#8a6f6f", "#7f1d1d", trava)}
          strokeWidth={4}
          style={{
            filter:
              trava > 0.3
                ? `drop-shadow(0 0 ${30 * trava}px ${rgba(VERM, 0.7)})`
                : undefined,
          }}
        />
        {fibras.map((i) => {
          const u = (i + 1) / 8;
          return (
            <path
              key={i}
              d={`M38,${-250 + u * 30} Q${70 + u * (70 + 25 * trava)},${-110 + 30 * trava} ${40 + u * 30},${120 + 10 * trava}`}
              fill="none"
              stroke={rgba("#ffffff", 0.18 + 0.2 * trava)}
              strokeWidth={3}
            />
          );
        })}
      </g>
      {/* tendão de Aquiles */}
      <path
        d="M30,140 L38,215"
        stroke="#e8d6c6"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {sensor > 0 && (
        <g opacity={sensor}>
          <circle
            cx={36}
            cy={185}
            r={16 + 4 * Math.sin(f / 4)}
            fill={VERDE}
            style={{ filter: `drop-shadow(0 0 16px ${VERDE})` }}
          />
        </g>
      )}
      {/* pé, gira no tornozelo */}
      <g transform={`translate(0,200) rotate(${-pe})`}>
        <path
          d="M-40,-30 L40,-30 Q55,10 40,40 L-150,40 Q-185,30 -180,5 Q-170,-15 -130,-15 Z"
          fill="#d9c4b4"
        />
        <ellipse cx={-172} cy={20} rx={14} ry={10} fill="#cbb6a6" />
      </g>
      <circle cx={0} cy={200} r={34} fill="#cbb6a6" />
    </g>
  );
};

// raios saindo do nervo
const Nervo: React.FC<{ f: number; de: number; rapido: number }> = ({
  f,
  de,
  rapido,
}) => {
  if (f < de) return null;
  const k = P(f, de, de + 16);
  const pts = "540,330 600,420 520,520 610,620 560,720";
  return (
    <g opacity={k}>
      <polyline
        points={pts}
        fill="none"
        stroke={AMAR}
        strokeWidth={8}
        strokeLinejoin="round"
        opacity={0.5}
      />
      {Array.from({ length: 6 }, (_, i) => {
        const v = 0.02 + 0.06 * rapido;
        const ph = (f * v + i / 6) % 1;
        const seg = [
          [540, 330],
          [600, 420],
          [520, 520],
          [610, 620],
          [560, 720],
        ];
        const pos = ph * 4,
          j = Math.min(3, Math.floor(pos)),
          u = pos - j;
        const px = seg[j][0] + (seg[j + 1][0] - seg[j][0]) * u,
          py = seg[j][1] + (seg[j + 1][1] - seg[j][1]) * u;
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={14}
            fill={AMAR}
            style={{ filter: `drop-shadow(0 0 14px ${AMAR})` }}
          />
        );
      })}
      <text
        x={680}
        y={330}
        fontFamily={SANS}
        fontWeight={800}
        fontSize={34}
        fill={AMAR}
      >
        nervo motor
      </text>
    </g>
  );
};

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const trava = it(f, T.caibra - 10, T.caibra + 6, 0, 1, OUT);
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <Emoji f={f} at={2} x={210} y={300} size={120}>
        🌙
      </Emoji>
      <div
        style={{
          position: "absolute",
          top: 250,
          right: 120,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 90,
          color: C.ink,
          opacity: P(f, 4, 16),
          textShadow: `0 0 26px ${rgba(COR, 0.6)}`,
        }}
      >
        03:00
      </div>
      <Tela>
        <g opacity={P(f, 6, 20)}>
          <Perna x={540} y={900} s={0.95} pe={28} trava={trava} f={f} />
        </g>
      </Tela>
      <Title
        f={f}
        at={T.caibra}
        y={1300}
        size={130}
        font={SANS}
        weight={900}
        color={C.ink}
        from={VERM}
      >
        CÃIBRA
      </Title>
      <Pill
        x={540}
        y={1490}
        text="+ da metade dos adultos já teve"
        color={COR}
        size={40}
        k={P(f, T.metade, T.metade + 12)}
      />
    </Part>
  );
};

// 2. o músculo trava
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const trava = it(f, T.contrai, T.contrai + 14, 0, 1, OUT);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title f={f} at={R(1)[0] + 6} y={230} size={56} weight={600} from={MUSC}>
        o músculo da panturrilha
      </Title>
      <Tela>
        <Perna
          x={500}
          y={880}
          s={1.05}
          pe={10 + 18 * trava}
          trava={trava}
          f={f}
        />
      </Tela>
      <Pill
        x={800}
        y={720}
        text="contrai sozinho"
        color={VERM}
        size={38}
        k={P(f, T.contrai, T.contrai + 12)}
      />
      <Pill
        x={800}
        y={820}
        text="🔒 e não solta"
        color={VERM}
        size={38}
        k={P(f, T.solta, T.solta + 12)}
      />
    </Part>
  );
};

// 3. o nervo agitado
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const risca = P(f, T.minerais + 10, T.minerais + 24);
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Card
        f={f}
        at={R(2)[0] + 4}
        x={140}
        y={180}
        w={800}
        h={110}
        border={rgba(AMAR, 0.5)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        <span style={{ position: "relative" }}>
          só falta de minerais?
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 6,
              width: `${risca * 100}%`,
              background: VERM,
              borderRadius: 3,
            }}
          />
        </span>
      </Card>
      <Tela>
        <Nervo
          f={f}
          de={T.nervo - 6}
          rapido={P(f, T.dispara - 4, T.dispara + 10)}
        />
        <Perna
          x={540}
          y={1160}
          s={0.7}
          pe={30}
          trava={0.8 + 0.2 * Math.sin(f / 5)}
          f={f}
        />
      </Tela>
      <Pill
        x={540}
        y={1540}
        text="⚡ dispara sinais sem parar"
        color={AMAR}
        size={42}
        k={P(f, T.dispara, T.dispara + 12)}
      />
    </Part>
  );
};

// 4. por que de madrugada
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={R(3)[0] + 4} y={210} size={64} weight={600} from={COR}>
        por que de madrugada?
      </Title>
      <Tela>
        {/* cama */}
        <g opacity={P(f, R(3)[0] + 6, R(3)[0] + 20)}>
          <rect x={90} y={760} width={900} height={60} rx={20} fill="#334155" />
          <rect x={90} y={820} width={30} height={90} fill="#1e293b" />
          <rect x={960} y={820} width={30} height={90} fill="#1e293b" />
          <rect
            x={120}
            y={700}
            width={220}
            height={64}
            rx={30}
            fill="#e2e8f0"
            opacity={0.85}
          />
        </g>
        {/* perna deitada (girada) com o pé apontando para baixo */}
        <g
          transform="translate(640,700) rotate(90)"
          opacity={P(f, T.pe - 10, T.pe + 4)}
        >
          <Perna
            x={0}
            y={0}
            s={0.6}
            pe={it(f, T.pe, T.pe + 20, 10, 40, OUT)}
            trava={0.35 * P(f, T.horas, T.horas + 30)}
            f={f}
          />
        </g>
      </Tela>
      <Pill
        x={540}
        y={950}
        text="👇 pé esticado para baixo = panturrilha encurtada"
        color={COR}
        size={30}
        k={P(f, T.pe + 8, T.pe + 20)}
      />
      {[
        [T.cansaco, "😮‍💨", "cansaço do dia"],
        [T.agua, "💧", "pouca água"],
        [T.remedios, "💊", "alguns remédios"],
      ].map(([at, ic, tx], i) => (
        <Card
          key={i}
          f={f}
          at={at as number}
          x={140}
          y={1050 + i * 150}
          w={800}
          h={120}
          border={rgba(AMAR, 0.5)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 34px",
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 56 }}>{ic}</span>
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: bornColor(f, at as number, C.ink, AMAR),
            }}
          >
            {tx}
          </span>
        </Card>
      ))}
    </Part>
  );
};

// 5. o truque: puxar a ponta do pé
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const puxa = it(f, T.puxar, T.puxar + 30, 0, 1, OUT);
  const relaxa = P(f, T.relaxar, T.relaxar + 30);
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={R(4)[0] + 4} y={210} size={64} weight={600} from={VERDE}>
        o truque na hora da dor
      </Title>
      <Tela>
        <Perna
          x={560}
          y={860}
          s={1}
          pe={30 - 50 * puxa}
          trava={1 - relaxa}
          f={f}
          sensor={P(f, T.sensor, T.sensor + 10)}
        />
        {puxa > 0 && (
          <path
            d="M260,1150 Q230,1000 330,960"
            fill="none"
            stroke={VERDE}
            strokeWidth={10}
            strokeLinecap="round"
            markerEnd="url(#seta)"
            opacity={puxa}
          />
        )}
        <defs>
          <marker
            id="seta"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={VERDE} />
          </marker>
        </defs>
        {f >= T.sensor + 10 && (
          <g opacity={P(f, T.sensor + 10, T.sensor + 22)}>
            <line
              x1={600}
              y1={1045}
              x2={800}
              y2={1120}
              stroke={VERDE}
              strokeWidth={4}
              strokeDasharray="10 8"
            />
            <text
              x={810}
              y={1130}
              fontFamily={SANS}
              fontWeight={800}
              fontSize={32}
              fill={VERDE}
            >
              sensor do tendão
            </text>
          </g>
        )}
      </Tela>
      <Pill
        x={540}
        y={1380}
        text="puxe a ponta do pé na sua direção"
        color={VERDE}
        size={38}
        k={P(f, T.puxar, T.puxar + 12)}
      />
      <Title
        f={f}
        at={T.relaxar}
        y={1450}
        size={64}
        font={SANS}
        weight={900}
        color={VERDE}
        from={VERDE}
      >
        RELAXA ✓
      </Title>
    </Part>
  );
};

// 6. o magnésio
export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const sk = it(f, T.previne, T.previne + 10, 0, 1, SNAP);
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Title f={f} at={R(5)[0] + 4} y={230} size={64} weight={600} from={AMAR}>
        e o magnésio?
      </Title>
      <Tela>
        <g
          opacity={P(f, R(5)[0] + 6, R(5)[0] + 20)}
          transform="translate(540,760) rotate(-15)"
        >
          <rect
            x={-200}
            y={-80}
            width={400}
            height={160}
            rx={80}
            fill="#f8fafc"
            style={{ filter: `drop-shadow(0 0 30px ${rgba(AMAR, 0.5)})` }}
          />
          <rect x={0} y={-80} width={200} height={160} rx={80} fill={AMAR} />
          <rect x={0} y={-80} width={80} height={160} fill={AMAR} />
          <text
            x={-100}
            y={22}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={70}
            fill="#0f172a"
          >
            Mg
          </text>
        </g>
      </Tela>
      {f >= T.previne && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 1000,
            width: W,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, sk * 1.5),
          }}
        >
          <div
            style={{
              transform: `rotate(-5deg) scale(${2 - sk})`,
              border: `7px solid ${VERM}`,
              borderRadius: 18,
              padding: "8px 34px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 70,
              color: VERM,
              textShadow: `0 0 20px ${rgba(VERM, 0.6)}`,
            }}
          >
            NÃO PREVINE
          </div>
        </div>
      )}
      <Title
        f={f}
        at={T.previne + 14}
        y={1180}
        size={42}
        font={SANS}
        weight={600}
        color={C.dim}
        from={AMAR}
      >
        para a maioria das pessoas
      </Title>
    </Part>
  );
};

// 7. procure ajuda
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={R(6)[0] + 4} y={250} size={60} weight={600} from={COR}>
        acontece sempre?
      </Title>
      <Emoji f={f} at={T.profissional - 6} x={540} y={600} size={190}>
        👩‍⚕️
      </Emoji>
      <Card
        f={f}
        at={T.lista - 4}
        x={140}
        y={820}
        w={800}
        h={300}
        border={rgba(COR, 0.6)}
        style={{
          padding: "26px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 800, color: COR }}>
          📋 meus remédios
        </span>
        {["remédio de pressão", "remédio de colesterol", "outros…"].map(
          (t, i) => (
            <span
              key={i}
              style={{
                fontSize: 36,
                fontWeight: 600,
                opacity: P(f, T.lista + 4 + i * 6, T.lista + 14 + i * 6),
              }}
            >
              • {t}
            </span>
          ),
        )}
      </Card>
    </Part>
  );
};

// 8. me siga
export const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
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
        border={rgba(COR, 0.7)}
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
            color: bornColor(f, T.siga, C.ink, COR),
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
  );
};

// 9. tela final
export const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100} outDur={1}>
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
                    ? bornColor(f, at, COR, "#eff6ff", 20)
                    : bornColor(f, at, C.ink, COR),
                opacity: k,
                transform: `translateY(${(1 - k) * 40}px)`,
                filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
              }}
            >
              {l}
            </div>
          );
        },
      )}
    </Part>
  );
};

export const VideoCaibra: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(1)[0] && f < R(2)[0]
      ? VERM
      : f >= R(2)[0] && f < R(3)[0]
        ? AMAR
        : f >= R(4)[0] && f < R(5)[0]
          ? VERDE
          : f >= R(5)[0] && f < R(6)[0]
            ? AMAR
            : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[T.caibra, T.contrai, T.dispara, T.relaxar, T.previne, T.final]}
      />
      <S1 />
      <S2 />
      <S3 />
      <S4 />
      <S5 />
      <S6 />
      <S7 />
      <S8 />
      <S9 />
      <Grain />
      <Audio src={staticFile("caibra/narracao.mp3")} />
      <Audio
        src={staticFile("caibra/musica.wav")}
        volume={(fr) =>
          0.07 * (1 - P(fr, DURATION_CAIBRA - 60, DURATION_CAIBRA))
        }
      />
      {SFX_CAIBRA.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
