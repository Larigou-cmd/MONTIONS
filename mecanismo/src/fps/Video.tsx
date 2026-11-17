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

// "FPS 30 ou FPS 70: qual a diferença de verdade?" — Modelo 1 com a paleta verde, sem 3D.
// Roteiro e fontes: roteiros/fps_30_ou_70.md. Narração da usuária (ElevenLabs v4, Juliana); tempos em fala.json.
const VERDE = "#3dff8f",
  VERM = "#ff4d4d",
  AMBAR = "#f2e52e",
  MENTA = "#9ff5d0",
  PELE = "#e3b08c",
  PELE2 = "#c98f6c";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
const T = {
  caro: Tw("caro"),
  olha: Tw("olha"),
  mostra: Tw("mostra") - 14,
  queima: Tw("queima"),
  consegue: Tw("consegue"),
  comp: Tw("trinta") - 18,
  trinta: Tw("trinta"),
  n97: Tw("noventa"),
  setenta: Tw("setenta"),
  n99: Tw("noventa", 2),
  dobro: Tw("dobro"),
  dois: Tw("dois"),
  detalhe: Tw("só"),
  teste: Tw("teste"),
  grossa: Tw("grossa"),
  vida: Tw("vida"),
  metade: Tw("metade"),
  nenhum: Tw("nenhum"),
  conta: Tw("conta") - 33,
  uvb: Tw("uvb", 2),
  uva: Tw("uva"),
  mancha: Tw("mancha"),
  envelhece: Tw("envelhece"),
  brasil: Tw("brasil"),
  terco: Tw("terço"),
  vale: Tw("então"),
  minimo: Tw("trinta", 2),
  colher: Tw("colher"),
  reaplicar: Tw("reaplicar"),
  suar: Tw("suar"),
  praia: Tw("praia"),
  melhor: Tw("melhor") - 3,
  maior: Tw("maior"),
  certa: Tw("quantidade"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_FPS = T.final + 90;

const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.caro, POP, 0.2],
  [T.olha, TRAVA, 0.26],
  [T.mostra, WHOOSH, 0.26],
  [T.queima, POP, 0.2],
  [T.comp, WHOOSH, 0.26],
  [T.n97, BIP, 0.24],
  [T.n99, BIP, 0.24],
  [T.dois, TRAVA, 0.32],
  [T.detalhe, WHOOSH, 0.28],
  [T.teste, POP, 0.2],
  [T.vida, POP, 0.2],
  [T.metade, TRAVA, 0.28],
  [T.conta, WHOOSH, 0.28],
  [T.uvb, POP, 0.2],
  [T.uva, POP, 0.2],
  [T.terco, PLIM, 0.25],
  [T.vale, WHOOSH, 0.28],
  [T.minimo, POP, 0.2],
  [T.colher, POP, 0.2],
  [T.reaplicar, POP, 0.2],
  [T.praia, BIP, 0.22],
  [T.melhor, WHOOSH, 0.28],
  [T.certa, TRAVA, 0.32],
  [T.salva, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

const FALANDO = (() => {
  const a = new Array(DURATION_FPS + 1).fill(0);
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
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0);

const Carimbo: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  x?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 72, x = 540, children }) =>
  f >= at ? (
    <div
      style={{
        position: "absolute",
        left: x,
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
    x={90}
    y={y}
    w={860}
    h={h}
    border={rgba(cor, 0.75)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 34,
      padding: "0 44px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 84 }}>{emoji}</span>
    <span
      style={{
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 52,
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
        left: 60,
        width: W - 120,
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

// frasco genérico de protetor, sem marca
const Frasco: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  s?: number;
  n: string;
  cor?: string;
}> = ({ f, at, x, y, s = 1, n, cor = VERDE }) => {
  const k = it(f, at, at + 12, 0, 1, SNAP);
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${s * k})`,
        opacity: Math.min(1, k * 1.5),
      }}
    >
      <svg width={260} height={460} viewBox="0 0 260 460">
        <rect x={85} y={0} width={90} height={62} rx={14} fill={cor} />
        <rect x={100} y={56} width={60} height={26} fill={rgba(cor, 0.7)} />
        <rect x={20} y={78} width={220} height={376} rx={46} fill="#f7f3df" />
        <rect
          x={20}
          y={78}
          width={220}
          height={376}
          rx={46}
          fill="none"
          stroke={cor}
          strokeWidth={6}
        />
        <circle cx={130} cy={170} r={34} fill={AMBAR} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={130 + Math.cos(a) * 44}
              y1={170 + Math.sin(a) * 44}
              x2={130 + Math.cos(a) * 58}
              y2={170 + Math.sin(a) * 58}
              stroke={AMBAR}
              strokeWidth={7}
              strokeLinecap="round"
            />
          );
        })}
        <text
          x={130}
          y={300}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={44}
          fill="#0a2a22"
        >
          FPS
        </text>
        <text
          x={130}
          y={410}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={118}
          fill="#0a2a22"
        >
          {n}
        </text>
      </svg>
    </div>
  );
};

// 100 raios: os que passam ficam em amarelo
const Raios: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  passam: number[];
}> = ({ f, at, x, y, passam }) => {
  const shown = it(f, at, at + 40, 0, 100, (v) => v);
  return (
    <svg
      width={380}
      height={380}
      style={{ position: "absolute", left: x - 190, top: y }}
    >
      {Array.from({ length: 100 }, (_, i) => {
        if (i > shown) return null;
        const cx = 19 + (i % 10) * 38,
          cy = 19 + Math.floor(i / 10) * 38;
        const pass = passam.includes(i);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={pass ? 15 : 11}
            fill={pass ? AMBAR : rgba(VERDE, 0.42)}
            style={
              pass ? { filter: `drop-shadow(0 0 10px ${AMBAR})` } : undefined
            }
          />
        );
      })}
    </svg>
  );
};

const Numero: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  alvo: number;
  cor: string;
}> = ({ f, at, x, y, alvo, cor }) => {
  if (f < at - 8) return null;
  const v = Math.round(it(f, at - 8, at + 22, 0, alvo, OUT));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%,-50%)",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 150,
        color: cor,
        opacity: P(f, at - 8, at),
        textShadow: `0 0 26px ${rgba(cor, 0.45)}`,
      }}
    >
      {v}%
    </div>
  );
};

// pedaço de pele com a camada de protetor em cima
const Pele: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  camada: number;
  rotulo: string;
  cor: string;
}> = ({ f, at, x, y, camada, rotulo, cor }) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  if (f < at) return null;
  const h = camada * it(f, at + 6, at + 26, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 200,
        top: y,
        width: 400,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 46,
          letterSpacing: 2,
          color: cor,
          textAlign: "center",
          marginBottom: 18,
        }}
      >
        {rotulo}
      </div>
      <svg width={400} height={330}>
        <rect
          x={10}
          y={110 - h}
          width={380}
          height={h}
          rx={Math.min(16, h / 2)}
          fill="#f7f3df"
        />
        <rect x={10} y={110} width={380} height={90} fill={PELE} />
        <rect x={10} y={200} width={380} height={120} rx={0} fill={PELE2} />
        <rect
          x={10}
          y={110}
          width={380}
          height={210}
          fill="none"
          stroke={rgba("#ffffff", 0.25)}
          strokeWidth={3}
        />
      </svg>
    </div>
  );
};

export const VideoFps: React.FC = () => {
  const f = useCurrentFrame();
  const entrega = it(f, T.nenhum - 6, T.nenhum + 40, 1, 0.42, OUT);
  return (
    <AbsoluteFill>
      <Background
        color={f >= T.detalhe && f < T.vale ? AMBAR : VERDE}
        pulses={[T.olha, T.dois, T.metade, T.terco, T.certa, T.final]}
      />

      {/* 1. gancho */}
      <Part from={0} to={T.mostra}>
        <Title
          f={f}
          at={0}
          y={230}
          size={84}
          font={SANS}
          weight={900}
          from={VERDE}
        >
          VOCÊ PAGA MAIS CARO
          <br />
          NO <span style={{ color: VERDE }}>FPS MAIS ALTO?</span>
        </Title>
        <Frasco f={f} at={4} x={320} y={830} n="30" />
        <Frasco f={f} at={12} x={740} y={830} n="70" cor={AMBAR} />
        <Pill
          x={320}
          y={1120}
          text="R$"
          color={VERDE}
          size={50}
          k={P(f, T.caro - 8, T.caro + 4)}
        />
        <Pill
          x={740}
          y={1120}
          text="R$ R$ R$"
          color={AMBAR}
          size={50}
          k={P(f, T.caro - 2, T.caro + 10)}
        />
        <Grande f={f} at={T.olha} y={1230} cor={C.ink} size={66}>
          o que esse número
          <br />
          <span style={{ color: AMBAR }}>quer dizer de verdade</span>
        </Grande>
      </Part>

      {/* 2. o que o FPS mostra */}
      <Part from={T.mostra} to={T.comp}>
        <Title
          f={f}
          at={T.mostra + 4}
          y={230}
          size={84}
          font={SANS}
          weight={900}
          from={VERDE}
        >
          O QUE O <span style={{ color: VERDE }}>FPS</span> MOSTRA
        </Title>
        <Emoji f={f} at={T.mostra + 8} x={540} y={560} size={230}>
          ☀️
        </Emoji>
        <svg width={W} height={1920} style={{ position: "absolute" }}>
          {[330, 470, 610, 750].map((x, i) => {
            const k = it(
              f,
              T.queima - 20 + i * 4,
              T.queima + 16 + i * 4,
              0,
              1,
              OUT,
            );
            const bloqueia = i !== 2;
            const y1 = 720,
              yFim = bloqueia ? 985 : 1100;
            return k > 0 ? (
              <line
                key={i}
                x1={x}
                y1={y1}
                x2={x}
                y2={y1 + (yFim - y1) * k}
                stroke={AMBAR}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray="26 18"
                opacity={0.95}
              />
            ) : null;
          })}
          <rect
            x={190}
            y={1000}
            width={700}
            height={it(f, T.consegue - 14, T.consegue + 4, 0, 34, OUT)}
            rx={14}
            fill="#f7f3df"
          />
          <rect x={190} y={1034} width={700} height={70} fill={PELE} />
          <rect x={190} y={1104} width={700} height={90} fill={PELE2} />
        </svg>
        <Pill
          x={540}
          y={1265}
          text="UVB = o raio que queima a pele"
          color={AMBAR}
          size={44}
          k={P(f, T.queima - 8, T.queima + 4)}
        />
        <Grande f={f} at={T.consegue} y={1340} cor={C.ink} size={64}>
          quanto desse raio
          <br />
          <span style={{ color: VERDE }}>o protetor segura</span>
        </Grande>
      </Part>

      {/* 3. 97% e 99% */}
      <Part from={T.comp} to={T.detalhe}>
        <Title
          f={f}
          at={T.comp + 4}
          y={210}
          size={64}
          weight={600}
          from={VERDE}
        >
          de cada 100 raios UVB
        </Title>
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 400,
            transform: "translate(-50%,-50%)",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 66,
            color: VERDE,
            opacity: P(f, T.trinta - 10, T.trinta),
          }}
        >
          FPS 30
        </div>
        <div
          style={{
            position: "absolute",
            left: 790,
            top: 400,
            transform: "translate(-50%,-50%)",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 66,
            color: AMBAR,
            opacity: P(f, T.setenta - 10, T.setenta),
          }}
        >
          FPS 70
        </div>
        {f >= T.trinta - 4 && (
          <Raios
            f={f}
            at={T.trinta - 4}
            x={290}
            y={470}
            passam={[13, 47, 82]}
          />
        )}
        {f >= T.setenta - 4 && (
          <Raios f={f} at={T.setenta - 4} x={790} y={470} passam={[47]} />
        )}
        <Numero f={f} at={T.n97} x={290} y={960} alvo={97} cor={VERDE} />
        <Numero f={f} at={T.n99} x={790} y={960} alvo={99} cor={AMBAR} />
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 1070,
            transform: "translate(-50%,-50%)",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 38,
            color: C.ink,
            opacity: P(f, T.n97 + 10, T.n97 + 22),
          }}
        >
          passam 3
        </div>
        <div
          style={{
            position: "absolute",
            left: 790,
            top: 1070,
            transform: "translate(-50%,-50%)",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 38,
            color: C.ink,
            opacity: P(f, T.n99 + 10, T.n99 + 22),
          }}
        >
          passa 1
        </div>
        <Pill
          x={540}
          y={1190}
          text="o número é mais que o dobro"
          color={C.ink}
          size={42}
          k={P(f, T.dobro - 22, T.dobro - 10)}
        />
        <Carimbo f={f} at={T.dois - 4} y={1350} cor={AMBAR} size={62}>
          DIFERENÇA: 2 PONTOS
        </Carimbo>
      </Part>

      {/* 4 e 5. o teste e a vida real */}
      <Part from={T.detalhe} to={T.conta}>
        <Carimbo f={f} at={T.detalhe + 2} y={280} cor={AMBAR} size={60}>
          SÓ QUE TEM UM DETALHE
        </Carimbo>
        <Pele
          f={f}
          at={T.teste - 6}
          x={290}
          y={470}
          camada={84}
          rotulo="NO TESTE"
          cor={VERDE}
        />
        <Pele
          f={f}
          at={T.vida - 6}
          x={790}
          y={470}
          camada={34}
          rotulo="NA VIDA REAL"
          cor={AMBAR}
        />
        <Pill
          x={290}
          y={900}
          text="camada bem grossa"
          color={VERDE}
          size={36}
          k={P(f, T.grossa - 20, T.grossa - 8)}
        />
        <Pill
          x={790}
          y={900}
          text="menos da metade"
          color={AMBAR}
          size={36}
          k={P(f, T.metade - 16, T.metade - 4)}
        />
        <div style={{ opacity: P(f, T.nenhum - 10, T.nenhum + 2) }}>
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 1010,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: 2,
              color: C.ink,
            }}
          >
            O QUE O RÓTULO PROMETE
          </div>
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 1064,
              width: 820,
              height: 44,
              borderRadius: 22,
              background: rgba(VERDE, 0.9),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 1150,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: 2,
              color: AMBAR,
            }}
          >
            O QUE CHEGA NA SUA PELE
          </div>
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 1204,
              width: 820,
              height: 44,
              borderRadius: 22,
              background: "rgba(255,255,255,.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${entrega * 100}%`,
                height: "100%",
                borderRadius: 22,
                background: AMBAR,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 1270,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              color: C.dim,
            }}
          >
            esquema, sem escala
          </div>
        </div>
      </Part>

      {/* 6. UVB e UVA */}
      <Part from={T.conta} to={T.vale}>
        <Title
          f={f}
          at={T.conta + 4}
          y={220}
          size={78}
          font={SANS}
          weight={900}
          from={AMBAR}
        >
          O FPS <span style={{ color: AMBAR }}>NÃO CONTA TUDO</span>
        </Title>
        <svg
          width={W}
          height={1920}
          style={{
            position: "absolute",
            opacity: P(f, T.uvb - 30, T.uvb - 16),
          }}
        >
          <rect x={150} y={720} width={780} height={110} fill={PELE} />
          <rect x={150} y={830} width={780} height={210} fill={PELE2} />
          <text
            x={410}
            y={790}
            fontFamily={SANS}
            fontWeight={700}
            fontSize={30}
            fill="#5a3a26"
          >
            camada de cima
          </text>
          <text
            x={410}
            y={1010}
            fontFamily={SANS}
            fontWeight={700}
            fontSize={30}
            fill="#f7f3df"
          >
            camada mais funda
          </text>
          {f >= T.uvb - 10 && (
            <line
              x1={300}
              y1={480}
              x2={300}
              y2={480 + 300 * it(f, T.uvb - 10, T.uvb + 14, 0, 1, OUT)}
              stroke={AMBAR}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray="30 18"
            />
          )}
          {f >= T.uva - 6 && (
            <line
              x1={760}
              y1={480}
              x2={760}
              y2={480 + 470 * it(f, T.uva - 6, T.uva + 24, 0, 1, OUT)}
              stroke={MENTA}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray="60 22"
            />
          )}
        </svg>
        <Pill
          x={290}
          y={430}
          text="UVB: queima"
          color={AMBAR}
          size={40}
          k={P(f, T.uvb - 12, T.uvb)}
        />
        <Pill
          x={720}
          y={430}
          text="UVA: outra medida"
          color={MENTA}
          size={40}
          k={P(f, T.uva - 8, T.uva + 4)}
        />
        <Pill
          x={400}
          y={1110}
          text="mancha"
          color={MENTA}
          size={44}
          k={P(f, T.mancha - 8, T.mancha + 4)}
        />
        <Pill
          x={690}
          y={1110}
          text="envelhece"
          color={MENTA}
          size={44}
          k={P(f, T.envelhece - 8, T.envelhece + 4)}
        />
        <Card
          f={f}
          at={T.brasil - 6}
          x={90}
          y={1200}
          w={860}
          h={250}
          border={rgba(VERDE, 0.75)}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 2,
              color: C.dim,
            }}
          >
            REGRA NO BRASIL
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 56,
              color: C.ink,
            }}
          >
            UVA: pelo menos <span style={{ color: VERDE }}>1/3 do FPS</span>
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 36,
              color: C.ink,
              opacity: P(f, T.terco, T.terco + 12),
            }}
          >
            ex.: FPS 30 → UVA 10 ou mais
          </span>
        </Card>
      </Part>

      {/* 7. o que vale */}
      <Part from={T.vale} to={T.melhor}>
        <Title
          f={f}
          at={T.vale + 4}
          y={220}
          size={82}
          font={SANS}
          weight={900}
          from={VERDE}
        >
          O QUE VALE
          <br />
          <span style={{ color: VERDE }}>DE VERDADE</span>
        </Title>
        <Linha f={f} at={T.minimo - 8} y={470} cor={VERDE} emoji="✅">
          FPS 30 no mínimo
        </Linha>
        <Linha f={f} at={T.colher - 8} y={670} cor={VERDE} emoji="🥄" h={190}>
          1 colher de chá para rosto e pescoço
        </Linha>
        <Linha f={f} at={T.reaplicar - 8} y={890} cor={VERDE} emoji="⏰">
          reaplicar a cada 2 horas
        </Linha>
        <Pill
          x={520}
          y={1150}
          text="💦 e depois de suar ou entrar na água"
          color={C.ink}
          size={40}
          k={P(f, T.suar - 14, T.suar - 2)}
        />
        <Pill
          x={520}
          y={1280}
          text="🏖️ praia e piscina: FPS mais alto dá folga"
          color={AMBAR}
          size={40}
          k={P(f, T.praia - 4, T.praia + 8)}
        />
      </Part>

      {/* 8. frase final */}
      <Part from={T.melhor} to={T.siga}>
        <Grande f={f} at={T.melhor + 6} y={330} cor={C.ink} size={84}>
          O MELHOR PROTETOR
        </Grande>
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 60,
            width: W - 120,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 64,
            color: C.dim,
            opacity: P(f, T.maior - 30, T.maior - 18),
          }}
        >
          <span
            style={{
              textDecoration: f > T.maior + 6 ? "line-through" : "none",
              textDecorationColor: VERM,
            }}
          >
            não é o de número maior
          </span>
        </div>
        <Grande f={f} at={T.certa - 20} y={700} cor={VERDE} size={80}>
          É O QUE VOCÊ PASSA
          <br />
          NA QUANTIDADE CERTA
        </Grande>
        <Emoji f={f} at={T.certa - 10} x={540} y={1080} size={170}>
          🥄
        </Emoji>
        <Pill
          x={540}
          y={1300}
          text="📌 salva para a hora de comprar o seu"
          color={AMBAR}
          size={44}
          k={P(f, T.salva - 4, T.salva + 8)}
        />
      </Part>

      {/* 9. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("anlodipinoNovo/logo.jpg")}
          style={{
            position: "absolute",
            left: 350,
            top: 380,
            width: 380,
            height: 380,
            borderRadius: "50%",
          }}
        />
        <Grande f={f} at={T.siga + 4} y={800} cor={C.ink} size={120}>
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
            color: C.ink,
          }}
        >
          para mais dicas de farmacologia e curiosidades sobre a área
        </div>
      </Part>

      {/* 10. tela final */}
      <Part from={T.final - 4} to={DURATION_FPS} inY={100} outDur={1}>
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
                      ? bornColor(f, at, VERDE, "#eff6ff", 20)
                      : bornColor(f, at, C.ink, VERDE),
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
      <Audio src={staticFile("fps/narracao.mp3")} />
      <Audio
        src={staticFile("fps/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_FPS - 60, DURATION_FPS))
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

// Capa (1080×1920): tudo entre y≈300 e y≈1620, o recorte 3:4 do TikTok e do Instagram.
export const CapaFps: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 124,
        lineHeight: 1.02,
        color: C.ink,
      }}
    >
      FPS{" "}
      <span
        style={{ color: VERDE, textShadow: `0 0 30px ${rgba(VERDE, 0.5)}` }}
      >
        30
      </span>{" "}
      OU{" "}
      <span
        style={{ color: AMBAR, textShadow: `0 0 30px ${rgba(AMBAR, 0.5)}` }}
      >
        70
      </span>
      ?
    </div>
    <Frasco f={100} at={0} x={320} y={830} n="30" />
    <Frasco f={100} at={0} x={760} y={830} n="70" cor={AMBAR} />
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1200,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${AMBAR}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 60,
        letterSpacing: 2,
        color: AMBAR,
        background: rgba("#000000", 0.55),
        whiteSpace: "nowrap",
      }}
    >
      SÓ 2 PONTOS DE DIFERENÇA
    </div>
    <div
      style={{
        position: "absolute",
        top: 1340,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 58,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      o que o número do protetor
      <br />
      quer dizer de verdade
    </div>
    <Grain />
  </AbsoluteFill>
);
