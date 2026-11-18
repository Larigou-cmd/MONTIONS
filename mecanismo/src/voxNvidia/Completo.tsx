import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { SERIF, SANS, MAO } from "../fonts";

// "A queda do CEO da Nvidia" — @historicodebusca, colagem de papel à la Vox
// (base: Vox Explainer do Herk Edit Kit, MIT), vertical 1080x1920, área segura y 300–1620.
// Fotos: Jensen Huang por Anderseidesvik (CC BY-SA 4.0) e Colette Kress por SiliconANGLE theCUBE (CC BY 4.0),
// ambas do Wikimedia Commons. Ícones e recortes desenhados do zero. Pessoas não públicas só como silhueta.
// Tempos medidos nas pausas da narração do Nassif (+0,3 s de entrada).

export const PAPEL = "#efe9dc";
export const KRAFT = "#e6dcc4";
export const TINTA = "#17130e";
export const AZUL = "#37BDF8";
export const VERMELHO = "#e23b2e";
export const LARANJA = "#f26a1b";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const emDois = (f: number) => Math.floor(f / 2) * 2;
export const estalo = (f: number, ini: number, dur = 8) =>
  interpolate(emDois(f), [ini, ini + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2.2)),
  });
export const linear = (f: number, ini: number, dur: number) =>
  interpolate(emDois(f), [ini, ini + dur], [0, 1], clamp);

export const rasgado = (semente: number, pontos = 26, amp = 1.6) => {
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
export const adesivo = (cor: string, e = 7) =>
  `drop-shadow(${e}px 0 0 ${cor}) drop-shadow(-${e}px 0 0 ${cor}) drop-shadow(0 ${e}px 0 ${cor}) drop-shadow(0 -${e}px 0 ${cor}) drop-shadow(10px 12px 0 rgba(23,19,14,0.22))`;

// ================= base =================
export const Papel: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 4) % 6;
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
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
        <filter id="vc-fibra">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014"
            numOctaves={3}
            seed={2}
          />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.47  0 0 0 0 0.33  0 0 0 0.30 0" />
        </filter>
        <filter id={`vc-grao-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed + 5}
          />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.26  0 0 0 0 0.2  0 0 0 0.18 0" />
        </filter>
        <rect width={1080} height={1920} filter="url(#vc-fibra)" />
        <rect width={1080} height={1920} filter={`url(#vc-grao-${seed})`} />
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

export const Kicker: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, 0, 6);
  return (
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
        opacity: v,
        transform: `translateY(${(1 - v) * 20}px)`,
      }}
    >
      {texto}
    </div>
  );
};

// manchete em serifa com marcador azul atrás de uma palavra
export const Titulo: React.FC<{
  antes: string;
  marca?: string;
  depois?: string;
  ini?: number;
  marcaIni?: number;
  tam?: number;
  top?: number;
  italico?: boolean;
}> = ({
  antes,
  marca,
  depois = "",
  ini = 4,
  marcaIni = 18,
  tam = 92,
  top = 372,
  italico = true,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  const m = linear(frame, marcaIni, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 66,
        right: 60,
        top,
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: tam,
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
        color: TINTA,
        transform: `rotate(-1.2deg) scale(${0.9 + 0.1 * v})`,
        transformOrigin: "left top",
        opacity: Math.min(1, v * 1.5),
      }}
    >
      {antes}
      {marca ? (
        <span
          style={{
            position: "relative",
            display: "inline-block",
            fontStyle: italico ? "italic" : "normal",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -12,
              right: -14,
              top: tam * 0.16,
              bottom: 2,
              background: AZUL,
              transform: `scaleX(${m}) rotate(-1.5deg)`,
              transformOrigin: "left center",
              zIndex: -1,
            }}
          />
          {marca}
        </span>
      ) : null}
      {depois}
    </div>
  );
};

export type Fala = { de: number; ate: number; a: string; k?: string; b?: string };
export const Legenda: React.FC<{ falas: Fala[] }> = ({ falas }) => {
  const frame = useCurrentFrame();
  const f = falas.find((x) => frame >= x.de && frame < x.ate);
  if (!f) return null;
  const v = estalo(frame, f.de, 6);
  const longo = (f.a + (f.k ?? "") + (f.b ?? "")).length > 52;
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        right: 56,
        top: 1440,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 968,
          background: PAPEL,
          border: `5px solid ${TINTA}`,
          padding: "14px 28px 16px",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: longo ? 33 : 37,
          lineHeight: 1.18,
          color: TINTA,
          textAlign: "center",
          transform: `rotate(0.8deg) scale(${0.92 + 0.08 * v})`,
          boxShadow: `8px 8px 0 ${TINTA}`,
        }}
      >
        {f.a}
        {f.k ? (
          <span style={{ background: AZUL, padding: "0 6px" }}>{f.k}</span>
        ) : null}
        {f.b ?? ""}
      </div>
    </div>
  );
};

export const Rodape: React.FC<{ credito?: string }> = ({ credito }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1568,
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
    {credito ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1598,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 19,
          color: TINTA,
          opacity: 0.7,
        }}
      >
        {credito}
      </div>
    ) : null}
  </>
);
const CRED_HUANG = "Foto: Anderseidesvik · CC BY-SA 4.0 · Wikimedia Commons";
const CRED_KRESS = "Foto: SiliconANGLE theCUBE · CC BY 4.0 · Wikimedia Commons";

// recorte de foto com borda rasgada e contorno de adesivo
const Recorte: React.FC<{
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rot?: number;
  cor?: string;
  ini: number;
  semente?: number;
  posicao?: string;
}> = ({
  src,
  w,
  h,
  x,
  y,
  rot = -3,
  cor = LARANJA,
  ini,
  semente = 11,
  posicao = "50% 30%",
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        transformOrigin: "50% 80%",
        filter: adesivo(cor, 8),
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          clipPath: rasgado(semente),
          background: KRAFT,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: posicao,
            filter: "grayscale(1) contrast(1.35) brightness(1.05)",
            mixBlendMode: "multiply",
          }}
        />
      </div>
    </div>
  );
};

// silhueta anônima em retícula (para quem não é figura pública)
const Silhueta: React.FC<{
  x: number;
  y: number;
  ini: number;
  rotulo: string;
}> = ({ x, y, ini, rotulo }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(4deg) scale(${v})`,
        filter: adesivo(AZUL, 7),
      }}
    >
      <div
        style={{
          width: 340,
          height: 420,
          clipPath: rasgado(37),
          background: KRAFT,
          position: "relative",
        }}
      >
        <svg viewBox="0 0 340 420" width={340} height={420}>
          <defs>
            <pattern
              id="vc-pontos-s"
              width={13}
              height={13}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(30)"
            >
              <circle cx={6.5} cy={6.5} r={3.8} fill={TINTA} />
            </pattern>
          </defs>
          <path
            d="M170 70 C125 70 106 108 108 146 C110 190 134 222 170 224 C206 222 230 190 232 146 C234 108 215 70 170 70 Z"
            fill="url(#vc-pontos-s)"
          />
          <path
            d="M40 420 C48 320 100 262 170 256 C240 262 292 320 300 420 Z"
            fill="url(#vc-pontos-s)"
          />
          <text
            x={170}
            y={175}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={900}
            fontSize={110}
            fill={PAPEL}
            stroke={TINTA}
            strokeWidth={6}
          >
            ?
          </text>
        </svg>
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 40,
          color: VERMELHO,
          transform: "rotate(-3deg)",
          textAlign: "center",
          width: 340,
        }}
      >
        {rotulo}
      </div>
    </div>
  );
};

export const TiraRasgada: React.FC<{
  texto: string;
  x: number;
  y: number;
  ini: number;
  rot?: number;
  tam?: number;
  fundo?: string;
  cor?: string;
  semente?: number;
}> = ({
  texto,
  x,
  y,
  ini,
  rot = -4,
  tam = 54,
  fundo = TINTA,
  cor = PAPEL,
  semente = 23,
}) => {
  const frame = useCurrentFrame();
  const v = linear(frame, ini, 8);
  if (v <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) translateX(${(1 - v) * 300}px)`,
      }}
    >
      <div
        style={{
          clipPath: rasgado(semente, 14, 3),
          background: fundo,
          padding: "16px 40px 20px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: tam,
          letterSpacing: "0.08em",
          color: cor,
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const Carimbo: React.FC<{
  texto: string;
  x: number;
  y: number;
  ini: number;
  rot?: number;
  tam?: number;
  cor?: string;
}> = ({ texto, x, y, ini, rot = -8, tam = 56, cor = VERMELHO }) => {
  const frame = useCurrentFrame();
  const f = emDois(frame) - ini;
  if (f < 0) return null;
  const q =
    f < 4
      ? interpolate(f, [0, 4], [2.4, 1])
      : 1 + 0.05 * Math.exp(-(f - 4) / 4) * Math.cos((f - 4) * 1.2);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${q})`,
        opacity: 0.92,
      }}
    >
      <div style={{ border: `8px solid ${cor}`, borderRadius: 14, padding: 7 }}>
        <div
          style={{
            border: `3px solid ${cor}`,
            borderRadius: 9,
            padding: "6px 20px 8px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: tam,
            letterSpacing: 3,
            color: cor,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {texto}
        </div>
      </div>
    </div>
  );
};

export const NotaMao: React.FC<{
  x: number;
  y: number;
  ini: number;
  children: React.ReactNode;
  tam?: number;
  rot?: number;
  cor?: string;
}> = ({ x, y, ini, children, tam = 50, rot = -5, cor = VERMELHO }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: MAO,
        fontWeight: 700,
        fontSize: tam,
        lineHeight: 1.02,
        color: cor,
        transform: `rotate(${rot}deg) scale(${v})`,
        transformOrigin: "left top",
      }}
    >
      {children}
    </div>
  );
};

export const Traco: React.FC<{
  ini: number;
  d: string;
  dur?: number;
  cor?: string;
  largura?: number;
  ponta?: string;
}> = ({ ini, d, dur = 10, cor = VERMELHO, largura = 8, ponta }) => {
  const frame = useCurrentFrame();
  const p = linear(frame, ini, dur);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth={largura}
        strokeLinecap="round"
        strokeDasharray={1600}
        strokeDashoffset={1600 * (1 - p)}
      />
      {ponta && p > 0.95 ? (
        <path
          d={ponta}
          fill="none"
          stroke={cor}
          strokeWidth={largura}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
};

// ================= desenhos originais =================
const Chip: React.FC<{ tam?: number }> = ({ tam = 250 }) => (
  <svg viewBox="0 0 220 220" width={tam} height={tam}>
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
const Jaqueta: React.FC = () => (
  <svg viewBox="0 0 240 240" width={260} height={260}>
    <path
      d="M70 40 L120 62 L170 40 L222 70 L206 132 L184 124 L184 222 L56 222 L56 124 L34 132 L18 70 Z"
      fill="#26231f"
      stroke={TINTA}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path
      d="M120 62 L100 120 L120 222"
      fill="none"
      stroke="#5c574f"
      strokeWidth={5}
    />
    <path
      d="M120 62 L140 120 L120 222"
      fill="none"
      stroke="#5c574f"
      strokeWidth={5}
    />
    <path
      d="M70 40 L96 104 L120 62"
      fill="#3a3630"
      stroke={TINTA}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path
      d="M170 40 L144 104 L120 62"
      fill="#3a3630"
      stroke={TINTA}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <line
      x1={126}
      y1={130}
      x2={126}
      y2={214}
      stroke="#a8a294"
      strokeWidth={4}
      strokeDasharray="6 5"
    />
  </svg>
);
const Lupa: React.FC = () => (
  <svg viewBox="0 0 200 200" width={220} height={220}>
    <line
      x1={128}
      y1={128}
      x2={180}
      y2={180}
      stroke={TINTA}
      strokeWidth={22}
      strokeLinecap="round"
    />
    <circle
      cx={86}
      cy={86}
      r={62}
      fill="rgba(55,189,248,0.25)"
      stroke={TINTA}
      strokeWidth={12}
    />
    <path
      d="M52 70 Q62 50 84 46"
      fill="none"
      stroke="#fff"
      strokeWidth={8}
      strokeLinecap="round"
    />
  </svg>
);
const Envelope: React.FC = () => (
  <svg viewBox="0 0 300 210" width={330} height={231}>
    <rect
      x={8}
      y={8}
      width={284}
      height={194}
      rx={6}
      fill="#f6f1e4"
      stroke={TINTA}
      strokeWidth={6}
    />
    <path
      d="M8 14 L150 120 L292 14"
      fill="none"
      stroke={TINTA}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <rect x={150} y={150} width={128} height={36} fill={VERMELHO} />
    <text
      x={214}
      y={176}
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={20}
      fill={PAPEL}
    >
      INTERNA
    </text>
  </svg>
);
const Cadeira: React.FC = () => (
  <svg viewBox="0 0 220 260" width={220} height={260}>
    <path
      d="M60 20 L160 20 Q176 20 176 36 L176 140 L44 140 L44 36 Q44 20 60 20 Z"
      fill="#26231f"
      stroke={TINTA}
      strokeWidth={6}
    />
    <rect
      x={34}
      y={140}
      width={152}
      height={30}
      rx={8}
      fill="#3a3630"
      stroke={TINTA}
      strokeWidth={6}
    />
    <line x1={110} y1={170} x2={110} y2={220} stroke={TINTA} strokeWidth={10} />
    <path
      d="M50 236 L110 220 L170 236"
      fill="none"
      stroke={TINTA}
      strokeWidth={8}
      strokeLinecap="round"
    />
    <circle cx={50} cy={240} r={9} fill={TINTA} />
    <circle cx={170} cy={240} r={9} fill={TINTA} />
  </svg>
);

// papel de comunicado datilografado
const Comunicado: React.FC<{ ini: number; tarja: number }> = ({
  ini,
  tarja,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  const t = linear(frame, tarja, 6);
  const linhas = [
    "NVIDIA CORPORATION",
    "COMUNICADO OFICIAL",
    "",
    "O conselho aceitou a renúncia",
    "do presidente e CEO, com",
    "efeito imediato.",
    "",
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 600,
        transform: `rotate(-2.5deg) scale(${v})`,
        filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
      }}
    >
      <div
        style={{
          width: 620,
          padding: "40px 46px 50px",
          background: "#f8f4ea",
          clipPath: rasgado(51, 20, 1.2),
          fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
          fontSize: 30,
          lineHeight: 1.45,
          color: TINTA,
        }}
      >
        {linhas.map((l, i) => (
          <div key={i} style={{ fontWeight: i < 2 ? 800 : 400, minHeight: 20 }}>
            {l}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontWeight: 800,
          }}
        >
          MOTIVO:
          <div
            style={{
              width: 300,
              height: 38,
              background: TINTA,
              transform: `scaleX(${t})`,
              transformOrigin: "left center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Contador: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  const p = interpolate(emDois(frame), [ini + 4, ini + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const n = Math.round(p * 180000);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 1112,
        transform: `rotate(-2deg) scale(${v})`,
        transformOrigin: "left top",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: "0.16em",
          color: TINTA,
        }}
      >
        PETIÇÃO PELA VOLTA
      </div>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 150,
          letterSpacing: "-0.03em",
          color: TINTA,
          lineHeight: 1,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: -10,
            right: -10,
            top: 30,
            bottom: 6,
            background: AZUL,
            zIndex: -1,
            transform: "rotate(-1.5deg)",
          }}
        />
        {n.toLocaleString("pt-BR")}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          color: TINTA,
        }}
      >
        assinaturas
      </div>
    </div>
  );
};

const Balao: React.FC<{ x: number; y: number; ini: number; texto: string }> = ({
  x,
  y,
  ini,
  texto,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(5deg) scale(${v})`,
        transformOrigin: "left bottom",
        filter: "drop-shadow(8px 10px 0 rgba(23,19,14,0.22))",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: `6px solid ${TINTA}`,
          borderRadius: 40,
          padding: "18px 30px",
          fontFamily: SERIF,
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: 54,
          color: TINTA,
        }}
      >
        {texto}
      </div>
      <svg
        width={80}
        height={60}
        style={{ position: "absolute", left: 30, top: "100%", marginTop: -6 }}
      >
        <path
          d="M6 0 L40 0 L4 54 Z"
          fill="#fff"
          stroke={TINTA}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <rect x={9} y={0} width={28} height={8} fill="#fff" />
      </svg>
    </div>
  );
};

export const Bilhete: React.FC<{
  x: number;
  y: number;
  ini: number;
  texto: string;
  cor: string;
  rot: number;
  semente: number;
}> = ({ x, y, ini, texto, cor, rot, semente }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        filter: adesivo(cor, 7),
      }}
    >
      <div
        style={{
          width: 380,
          height: 280,
          clipPath: rasgado(semente, 18, 1.4),
          background: "#f8f4ea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 150,
          color: TINTA,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// câmera: empurrão lento em degraus
export const Cena: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const zoom = 1 + emDois(frame) * 0.00028;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Papel />
      <AbsoluteFill
        style={{ transform: `scale(${zoom})`, transformOrigin: "50% 55%" }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================= as 7 cenas =================
const C1Gancho: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA · CASO NVIDIA" />
    <Titulo antes="O homem mais poderoso da IA " marca="caiu." marcaIni={40} />
    <Recorte
      src="voxnvidia/huang.jpg"
      w={560}
      h={680}
      x={120}
      y={640}
      ini={10}
    />
    <div
      style={{
        position: "absolute",
        left: 690,
        top: 760,
        transform: `rotate(9deg)`,
        filter: adesivo(AZUL, 7),
      }}
    >
      <ChipEntra ini={124} />
    </div>
    <TiraRasgada texto="RENUNCIOU" x={130} y={1262} ini={62} />
    <Traco
      ini={140}
      d="M820 742 C 930 735, 990 820, 972 920 C 955 1015, 860 1060, 770 1035 C 680 1010, 650 920, 690 840 C 715 790, 770 752, 840 748"
      dur={12}
    />
    <Traco
      ini={150}
      d="M800 1112 C 818 1094, 834 1080, 850 1062"
      ponta="M826 1066 L852 1058 L852 1086"
    />
    <NotaMao x={748} y={1124} ini={154}>
      espionagem?
      <br />
      <span style={{ fontSize: 38 }}>
        (suspeita,
        <br />
        não comprovada)
      </span>
    </NotaMao>
    <Legenda
      falas={[
        {
          de: 0,
          ate: 123,
          a: "O homem mais poderoso da inteligência artificial ",
          k: "caiu",
          b: ".",
        },
        {
          de: 123,
          ate: 191,
          a: "E o motivo parece ",
          k: "filme de espião",
          b: ".",
        },
      ]}
    />
    <Rodape credito={CRED_HUANG} />
  </Cena>
);
const ChipEntra: React.FC<{ ini: number; tam?: number }> = ({ ini, tam }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  return (
    <div style={{ transform: `scale(${v})` }}>
      <Chip tam={tam} />
    </div>
  );
};

const C2Carreira: React.FC = () => {
  const frame = useCurrentFrame();
  const anos = estalo(frame, 170, 8);
  const linha = linear(frame, 178, 14);
  return (
    <Cena>
      <Kicker texto="QUEM É ELE" />
      <Titulo
        antes="Jensen Huang, o CEO da "
        marca="jaqueta de couro"
        ini={2}
        marcaIni={20}
        tam={84}
      />
      <Recorte
        src="voxnvidia/huang.jpg"
        w={400}
        h={480}
        x={90}
        y={640}
        ini={6}
        rot={-4}
        posicao="50% 25%"
      />
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 640,
          transform: "rotate(7deg)",
          filter: adesivo(LARANJA, 7),
        }}
      >
        <JaquetaEntra ini={30} />
      </div>
      <NotaMao x={600} y={930} ini={40} rot={-4}>
        a marca registrada
        <br />
        dele
      </NotaMao>
      {/* 33 anos com linha do tempo */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1150,
          transform: `rotate(-2deg) scale(${anos})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 168,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            color: TINTA,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -12,
              right: -12,
              top: 30,
              bottom: 4,
              background: AZUL,
              zIndex: -1,
              transform: "rotate(-1.5deg)",
            }}
          />
          33 anos
        </div>
      </div>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <line
          x1={110}
          y1={1350}
          x2={110 + 480 * linha}
          y2={1350}
          stroke={TINTA}
          strokeWidth={8}
          strokeLinecap="round"
        />
        {linha > 0 ? <circle cx={110} cy={1350} r={13} fill={TINTA} /> : null}
        {linha > 0.98 ? (
          <circle cx={590} cy={1350} r={13} fill={VERMELHO} />
        ) : null}
      </svg>
      {linha > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 1372,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: TINTA,
          }}
        >
          1993
        </div>
      ) : null}
      {linha > 0.98 ? (
        <div
          style={{
            position: "absolute",
            left: 552,
            top: 1372,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: VERMELHO,
          }}
        >
          2026
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 790,
          top: 1180,
          transform: "rotate(-8deg)",
          filter: adesivo(AZUL, 6),
        }}
      >
        <ChipEntra ini={249} tam={150} />
      </div>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 170,
            a: "Jensen Huang, o CEO da jaqueta de couro, ",
            k: "renunciou",
            b: " na semana passada,",
          },
          {
            de: 170,
            ate: 249,
            a: "depois de ",
            k: "33 anos",
            b: " no comando da Nvidia,",
          },
          {
            de: 249,
            ate: 340,
            a: "a empresa dos ",
            k: "chips que movem a IA",
            b: ".",
          },
        ]}
      />
      <Rodape credito={CRED_HUANG} />
    </Cena>
  );
};
const JaquetaEntra: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ transform: `scale(${estalo(frame, ini, 8)})` }}>
      <Jaqueta />
    </div>
  );
};

const C3Investigacao: React.FC = () => {
  const frame = useCurrentFrame();
  const lupa = estalo(frame, 76, 8);
  return (
    <Cena>
      <Kicker texto="O COMUNICADO" />
      <Titulo
        antes="A Nvidia "
        marca="não deu motivo."
        ini={2}
        marcaIni={14}
        tam={88}
      />
      <Comunicado ini={4} tarja={24} />
      <Carimbo
        texto="INVESTIGAÇÃO"
        x={420}
        y={990}
        ini={70}
        rot={-9}
        tam={60}
      />
      <div
        style={{
          position: "absolute",
          left: 740,
          top: 560,
          transform: `rotate(-12deg) scale(${lupa})`,
        }}
      >
        <Lupa />
      </div>
      {/* manchete grande na hora da "inteligência estrangeira" */}
      <TiraRasgada
        texto="ALVO DE"
        x={90}
        y={1150}
        ini={209}
        rot={-3}
        tam={44}
        fundo={PAPEL}
        cor={TINTA}
        semente={61}
      />
      <TiraRasgada
        texto="INTELIGÊNCIA ESTRANGEIRA?"
        x={70}
        y={1240}
        ini={215}
        rot={-2}
        tam={52}
        fundo={TINTA}
        cor={PAPEL}
        semente={71}
      />
      <Legenda
        falas={[
          { de: 0, ate: 70, a: "O comunicado ", k: "não deu motivo", b: "." },
          {
            de: 70,
            ate: 209,
            a: "Só que, antes disso, a própria Nvidia tinha aberto uma ",
            k: "investigação",
            b: ":",
          },
          {
            de: 209,
            ate: 328,
            a: "o CEO teria sido alvo de uma ",
            k: "operação de inteligência estrangeira",
            b: ".",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C4Caso: React.FC = () => {
  const frame = useCurrentFrame();
  const envelope = estalo(frame, 216, 8);
  return (
    <Cena>
      <Kicker texto="SEGUNDO A IMPRENSA AMERICANA" />
      <Titulo
        antes="O caso "
        marca="extraconjugal"
        ini={2}
        marcaIni={60}
        tam={88}
      />
      <Recorte
        src="voxnvidia/huang.jpg"
        w={380}
        h={460}
        x={70}
        y={600}
        ini={8}
        rot={-5}
        posicao="50% 25%"
        semente={17}
      />
      <Silhueta x={640} y={590} ini={56} rotulo="executiva (sem nome)" />
      {/* fio vermelho ligando os dois */}
      <Traco
        ini={66}
        d="M440 820 C 520 760, 580 860, 650 790"
        dur={10}
        largura={7}
      />
      <NotaMao x={470} y={700} ini={80} tam={38} rot={-8}>
        ligação com
        <br />a China?
      </NotaMao>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 1140,
          transform: `rotate(-6deg) scale(${envelope})`,
          filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
        }}
      >
        <Envelope />
      </div>
      <NotaMao x={470} y={1170} ini={236} tam={46} rot={-4} cor={TINTA}>
        "admitiu ter sido
        <br />
        infiel à esposa"
      </NotaMao>
      <Carimbo
        texto="CHINA NEGA"
        x={580}
        y={1300}
        ini={341}
        rot={-8}
        tam={50}
      />
      <Legenda
        falas={[
          { de: 0, ate: 56, a: "Segundo a ", k: "imprensa americana", b: "," },
          {
            de: 56,
            ate: 216,
            a: "tudo passa por um caso extraconjugal com uma executiva ",
            k: "suspeita de ligação com a China",
            b: ".",
          },
          {
            de: 216,
            ate: 341,
            a: "Em mensagem aos funcionários, ele admitiu ter sido ",
            k: "infiel à esposa",
            b: ".",
          },
          {
            de: 341,
            ate: 406,
            a: "A China ",
            k: "nega",
            b: " qualquer espionagem.",
          },
        ]}
      />
      <Rodape credito={CRED_HUANG} />
    </Cena>
  );
};

const C5Kress: React.FC = () => {
  const frame = useCurrentFrame();
  const cadeira = estalo(frame, 2, 8);
  return (
    <Cena>
      <Kicker texto="QUEM ASSUMIU" />
      <Titulo
        antes="Colette Kress, "
        marca="CEO interina"
        ini={2}
        marcaIni={30}
        tam={84}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 760,
          transform: `rotate(-6deg) scale(${cadeira})`,
          opacity: 0.9,
        }}
      >
        <Cadeira />
      </div>
      <Recorte
        src="voxnvidia/kress.jpg"
        w={460}
        h={600}
        x={420}
        y={600}
        ini={14}
        rot={4}
        cor={AZUL}
        semente={29}
        posicao="50% 20%"
      />
      <NotaMao x={90} y={1060} ini={40} tam={44} rot={-6}>
        era a diretora
        <br />
        financeira
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 121,
            a: "No lugar dele, assumiu a diretora financeira, ",
            k: "Colette Kress",
            b: ".",
          },
        ]}
      />
      <Rodape credito={CRED_KRESS} />
    </Cena>
  );
};

const C6Reviravolta: React.FC = () => (
  <Cena>
    <Kicker texto="A REVIRAVOLTA" />
    <Titulo antes="E se ele " marca="voltar?" ini={2} marcaIni={20} tam={96} />
    <Recorte
      src="voxnvidia/huang.jpg"
      w={420}
      h={500}
      x={110}
      y={560}
      ini={44}
      rot={-3}
      posicao="50% 25%"
      semente={43}
    />
    <Balao x={560} y={620} ini={60} texto="Voltaria." />
    <NotaMao x={580} y={790} ini={70} tam={38} rot={-4}>
      se o conselho
      <br />
      quisesse
    </NotaMao>
    <Contador ini={164} dur={90} />
    <Carimbo
      texto="NVIDIA: NÃO PRETENDE"
      x={420}
      y={1250}
      ini={303}
      rot={-7}
      tam={40}
    />
    <Legenda
      falas={[
        { de: 0, ate: 52, a: "E a ", k: "reviravolta", b: "?" },
        {
          de: 52,
          ate: 164,
          a: "Agora, Huang diz que ",
          k: "voltaria",
          b: ", se o conselho quisesse.",
        },
        {
          de: 164,
          ate: 303,
          a: "Uma petição pela volta dele já passou de ",
          k: "180 mil assinaturas",
          b: ".",
        },
        {
          de: 303,
          ate: 364,
          a: "A Nvidia diz que ",
          k: "não pretende",
          b: ".",
        },
      ]}
    />
    <Rodape credito={CRED_HUANG} />
  </Cena>
);

const C7Final: React.FC = () => (
  <Cena>
    <Kicker texto="E VOCÊ?" />
    <Titulo
      antes="Ele deveria "
      marca="voltar?"
      ini={2}
      marcaIni={16}
      tam={110}
    />
    <Bilhete
      x={70}
      y={700}
      ini={10}
      texto="SIM"
      cor={AZUL}
      rot={-6}
      semente={81}
    />
    <Bilhete
      x={600}
      y={760}
      ini={16}
      texto="NÃO"
      cor={LARANJA}
      rot={5}
      semente={91}
    />
    <NotaMao x={330} y={1090} ini={49} tam={60} rot={-4}>
      comenta aí ↓
    </NotaMao>
    <TiraRasgada
      texto="SIGA @HISTORICODEBUSCA"
      x={90}
      y={1250}
      ini={76}
      rot={-3}
      tam={46}
    />
    <Legenda
      falas={[
        { de: 0, ate: 49, a: "Ele deveria ", k: "voltar", b: "?" },
        { de: 49, ate: 76, a: "", k: "Comenta aí", b: "." },
        {
          de: 76,
          ate: 190,
          a: "E me siga para mais ",
          k: "buscas aleatórias",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

// ================= montagem com troca de folha =================
const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 191, el: <C1Gancho /> },
  { dur: 340, el: <C2Carreira /> },
  { dur: 328, el: <C3Investigacao /> },
  { dur: 406, el: <C4Caso /> },
  { dur: 121, el: <C5Kress /> },
  { dur: 364, el: <C6Reviravolta /> },
  { dur: 190, el: <C7Final /> },
];
export const DURACAO_VOX_COMPLETO = CENAS.reduce((s, c) => s + c.dur, 0);

// uma folha kraft rasgada atravessa a tela "em dois" em cada corte
const TrocaDeFolha: React.FC<{ cortes: number[] }> = ({ cortes }) => {
  const frame = useCurrentFrame();
  const c = cortes.find((t) => Math.abs(frame - t) <= 7);
  if (c === undefined) return null;
  const p = interpolate(emDois(frame - c), [-7, 7], [0, 1], clamp);
  const x = interpolate(p, [0, 1], [1180, -1300]);
  return (
    <div
      style={{
        position: "absolute",
        top: -40,
        left: x,
        width: 1240,
        height: 2000,
        transform: "rotate(-4deg)",
        clipPath: rasgado(5, 30, 1.2),
        background: KRAFT,
        boxShadow: "inset 0 0 120px rgba(90,70,40,0.35)",
      }}
    />
  );
};

export const VideoVoxNvidia: React.FC = () => {
  let inicio = 0;
  const cortes: number[] = [];
  const seqs = CENAS.map((c, i) => {
    const from = inicio;
    inicio += c.dur;
    if (i > 0) cortes.push(from);
    return (
      <Sequence key={i} from={from} durationInFrames={c.dur}>
        {c.el}
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      <Audio src={staticFile("voxnvidia/mix_final.wav")} />
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};
