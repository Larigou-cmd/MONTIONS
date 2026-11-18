import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { SERIF, SANS, MAO } from "../fonts";

// Teste do estilo "colagem de papel" à la Vox (base: Vox Explainer do Herk Edit Kit, MIT),
// vertical 1080x1920 para o @historicodebusca. Tema: a queda do CEO da Nvidia.
// Recortes de papel com contorno de adesivo, retícula, uma forma azul de destaque por vez,
// setas e anotações à mão. Movimento "em dois" (stop-motion), nada desliza suave.

const PAPEL = "#efe9dc";
const KRAFT = "#e6dcc4";
const TINTA = "#17130e";
const AZUL = "#37BDF8";
const VERMELHO = "#e23b2e";
const LARANJA = "#f26a1b";

// troque para true quando a foto (CC BY-SA, Wikimedia Commons) estiver em public/voxnvidia/huang.jpg
const TEM_FOTO = true;

export const DURACAO_VOX = 180;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// tudo anda "em dois": o quadro só muda a cada 2 frames, como animação de recorte
const emDois = (f: number) => Math.floor(f / 2) * 2;
const estalo = (f: number, ini: number, dur = 8) =>
  interpolate(emDois(f), [ini, ini + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2.2)),
  });

// borda rasgada determinística
const rasgado = (semente: number, pontos = 26, amp = 1.6) => {
  let s = semente;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const lado = (de: [number, number], ate: [number, number]) =>
    Array.from({ length: pontos }, (_, i) => {
      const t = i / pontos;
      const x = de[0] + (ate[0] - de[0]) * t;
      const y = de[1] + (ate[1] - de[1]) * t;
      const j = (rnd() - 0.5) * amp * 2;
      return de[0] === ate[0] ? `${x + j}% ${y}%` : `${x}% ${y + j}%`;
    });
  return `polygon(${[...lado([0, 0], [100, 0]), ...lado([100, 0], [100, 100]), ...lado([100, 100], [0, 100]), ...lado([0, 100], [0, 0])].join(",")})`;
};

const Papel: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 4) % 6; // grão que tremula em degraus
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      {/* grade de papel milimetrado bem leve */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(40,90,140,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(40,90,140,0.07) 2px, transparent 2px)",
          backgroundSize: "54px 54px",
        }}
      />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, mixBlendMode: "multiply" }}
      >
        <filter id="vox-fibra">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014"
            numOctaves={3}
            seed={2}
          />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.47  0 0 0 0 0.33  0 0 0 0.30 0" />
        </filter>
        <filter id={`vox-grao-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed + 5}
          />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.26  0 0 0 0 0.2  0 0 0 0.18 0" />
        </filter>
        <rect width={1080} height={1920} filter="url(#vox-fibra)" />
        <rect width={1080} height={1920} filter={`url(#vox-grao-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(90,70,40,0.28) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// contorno de adesivo (traço grosso colorido em volta do recorte)
const adesivo = (cor: string, e = 7) =>
  `drop-shadow(${e}px 0 0 ${cor}) drop-shadow(-${e}px 0 0 ${cor}) drop-shadow(0 ${e}px 0 ${cor}) drop-shadow(0 -${e}px 0 ${cor}) drop-shadow(10px 12px 0 rgba(23,19,14,0.22))`;

// retrato recortado: foto real (quando houver) ou silhueta em retícula como reserva
const Retrato: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 560,
      height: 680,
      clipPath: rasgado(11),
      background: KRAFT,
      overflow: "hidden",
    }}
  >
    {TEM_FOTO ? (
      <Img
        src={staticFile("voxnvidia/huang.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(1) contrast(1.35) brightness(1.05)",
          mixBlendMode: "multiply",
        }}
      />
    ) : (
      <svg viewBox="0 0 560 680" width={560} height={680}>
        <defs>
          <pattern
            id="vox-pontos"
            width={14}
            height={14}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <circle cx={7} cy={7} r={4.2} fill={TINTA} />
          </pattern>
        </defs>
        {/* silhueta genérica de cabeça e ombros (reserva até a foto chegar) */}
        <path
          d="M280 120 C205 120 175 180 178 245 C181 315 220 372 280 376 C340 372 379 315 382 245 C385 180 355 120 280 120 Z"
          fill="url(#vox-pontos)"
        />
        <path
          d="M70 680 C82 520 170 430 280 420 C390 430 478 520 490 680 Z"
          fill="url(#vox-pontos)"
        />
        <text
          x={280}
          y={640}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={800}
          fontSize={22}
          fill={TINTA}
          opacity={0.6}
        >
          FOTO ENTRA AQUI
        </text>
      </svg>
    )}
  </div>
);

// chip genérico desenhado (sem logo de empresa)
const Chip: React.FC = () => (
  <svg viewBox="0 0 220 220" width={250} height={250}>
    {Array.from({ length: 6 }).map((_, i) => (
      <React.Fragment key={i}>
        <rect x={52 + i * 22} y={14} width={10} height={30} fill={TINTA} />
        <rect x={52 + i * 22} y={176} width={10} height={30} fill={TINTA} />
        <rect x={14} y={52 + i * 22} width={30} height={10} fill={TINTA} />
        <rect x={176} y={52 + i * 22} width={30} height={10} fill={TINTA} />
      </React.Fragment>
    ))}
    <rect
      x={40}
      y={40}
      width={140}
      height={140}
      rx={10}
      fill="#3b3a36"
      stroke={TINTA}
      strokeWidth={6}
    />
    <rect
      x={70}
      y={70}
      width={80}
      height={80}
      rx={4}
      fill="#8f8a7d"
      stroke={TINTA}
      strokeWidth={4}
    />
    <text
      x={110}
      y={118}
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={30}
      fill={TINTA}
    >
      IA
    </text>
  </svg>
);

// seta à mão (traço que se desenha)
const SetaMao: React.FC<{
  ini: number;
  d: string;
  ponta: string;
  cor?: string;
}> = ({ ini, d, ponta, cor = VERMELHO }) => {
  const frame = useCurrentFrame();
  const p = interpolate(emDois(frame), [ini, ini + 10], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={1000}
        strokeDashoffset={1000 * (1 - p)}
      />
      {p > 0.95 ? (
        <path
          d={ponta}
          fill="none"
          stroke={cor}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
};

export const VoxNvidiaTeste: React.FC = () => {
  const frame = useCurrentFrame();
  const f = emDois(frame);
  // empurrão lento de câmera, também em degraus
  const zoom = 1 + f * 0.00035;

  const kicker = estalo(frame, 0, 6);
  const titulo = estalo(frame, 6, 8);
  const marcador = interpolate(f, [26, 34], [0, 1], clamp);
  const retrato = estalo(frame, 14, 10);
  const chip = estalo(frame, 40, 8);
  const tira = estalo(frame, 70, 8);
  const nota = estalo(frame, 96, 8);
  const circulo = interpolate(f, [84, 96], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Papel />
      <AbsoluteFill
        style={{ transform: `scale(${zoom})`, transformOrigin: "50% 55%" }}
      >
        {/* kicker */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 322,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: "0.16em",
            color: TINTA,
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 20}px)`,
          }}
        >
          HISTÓRICO DE BUSCA · CASO NVIDIA
        </div>

        {/* manchete em serifa, com o marcador azul atrás de "caiu" */}
        <div
          style={{
            position: "absolute",
            left: 66,
            right: 60,
            top: 372,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 92,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: TINTA,
            transform: `rotate(-1.2deg) scale(${0.9 + 0.1 * titulo})`,
            transformOrigin: "left top",
            opacity: Math.min(1, titulo * 1.5),
          }}
        >
          O homem mais poderoso da IA{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontStyle: "italic",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: -12,
                right: -14,
                top: 14,
                bottom: 2,
                background: AZUL,
                transform: `scaleX(${marcador}) rotate(-1.5deg)`,
                transformOrigin: "left center",
                zIndex: -1,
              }}
            />
            caiu.
          </span>
        </div>

        {/* retrato recortado com contorno laranja */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 640,
            transform: `rotate(-3deg) scale(${retrato})`,
            transformOrigin: "50% 80%",
            filter: adesivo(LARANJA, 8),
          }}
        >
          <Retrato />
        </div>

        {/* chip recortado com contorno azul */}
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 760,
            transform: `rotate(9deg) scale(${chip})`,
            filter: adesivo(AZUL, 7),
          }}
        >
          <Chip />
        </div>

        {/* tira de papel rasgada */}
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 1262,
            transform: `rotate(-4deg) translateX(${(1 - tira) * 300}px)`,
            opacity: tira > 0 ? 1 : 0,
          }}
        >
          <div
            style={{
              clipPath: rasgado(23, 14, 3),
              background: TINTA,
              padding: "18px 44px 22px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 54,
              letterSpacing: "0.08em",
              color: PAPEL,
            }}
          >
            RENUNCIOU
          </div>
        </div>

        {/* círculo vermelho à mão em volta do chip */}
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M820 742 C 930 735, 990 820, 972 920 C 955 1015, 860 1060, 770 1035 C 680 1010, 650 920, 690 840 C 715 790, 770 752, 840 748"
            fill="none"
            stroke={VERMELHO}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={1200}
            strokeDashoffset={1200 * (1 - circulo)}
          />
        </svg>

        {/* anotação à mão + seta */}
        <SetaMao
          ini={100}
          d="M800 1112 C 818 1094, 834 1080, 850 1062"
          ponta="M826 1066 L852 1058 L852 1086"
        />
        <div
          style={{
            position: "absolute",
            left: 748,
            top: 1124,
            fontFamily: MAO,
            fontWeight: 700,
            fontSize: 52,
            lineHeight: 1.02,
            color: VERMELHO,
            transform: `rotate(-6deg) scale(${nota})`,
            transformOrigin: "left top",
          }}
        >
          espionagem?
          <br />
          <span style={{ fontSize: 38 }}>(suspeita,<br />não comprovada)</span>
        </div>

        {/* legenda */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1452,
            display: "flex",
            justifyContent: "center",
            opacity: f >= 8 ? 1 : 0,
          }}
        >
          <div
            style={{
              background: PAPEL,
              border: `5px solid ${TINTA}`,
              padding: "16px 30px 18px",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1.2,
              color: TINTA,
              textAlign: "center",
              transform: "rotate(0.8deg)",
              boxShadow: `8px 8px 0 ${TINTA}`,
            }}
          >
            E o motivo parece{" "}
            <span style={{ background: AZUL, padding: "0 6px" }}>
              filme de espião
            </span>
            .
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1556,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.12em",
            color: TINTA,
            opacity: 0.75,
          }}
        >
          @HISTORICODEBUSCA
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1590,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 20,
            color: TINTA,
            opacity: 0.7,
          }}
        >
          Foto: Anderseidesvik · CC BY-SA 4.0 · Wikimedia Commons
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
