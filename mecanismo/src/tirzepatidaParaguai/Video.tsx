import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OUT, P, SNAP, it, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { SANS, SERIF } from "../fonts";
import {
  Carimbo,
  Chip,
  Fundo,
  N,
  Painel,
  Sel,
  Titulo,
  VT,
} from "../semaModelos/Painel3D";
import { Objeto3D, Tipo3D } from "../semaModelos/Objetos3D";
import { Molecula3D } from "./Molecula3D";
import falaJson from "./fala.json";

// "A caneta do Paraguai é Mounjaro?" — as 4 canetas de tirzepatida. Modelo 9 (Painel 3D) com fichas de foto.
// Roteiro e fontes: roteiros/tirzepatida_original_paraguai.md. Narração: ElevenLabs, Juliana (eleven_v4).
// Fotos: só de fontes oficiais (sites dos fabricantes, alerta da DINAVISA, site de verificação da fabricante),
// sempre com o crédito na tela. A original não tem foto da caixa (decisão da usuária): selo + QR code oficial.
const W = 1080;
const D = "tirzepatidaParaguai/";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  throw new Error(`palavra não encontrada: ${w} (${n})`);
};

// INÍCIO TEMPOS (quadros, a 30 fps)
const T = {
  nao: Tw("não"),
  falsif: Tw("falsificada"),
  coment: Tw("nos") - 6,
  quatro: Tw("quatro"),
  uma: Tw("uma"),
  so1: Tw("só"),
  antes: Tw("antes") - 6,
  tirz: Tw("tirzepatida"),
  marca: Tw("marca"),
  dipirona: Tw("dipirona"),
  varios: Tw("vários"),
  registrada: Tw("registrada"),
  um: Tw("um") - 6,
  a2023: Tw("diabetes"),
  a2025: Tw("obesidade") - 10,
  patente: Tw("patente"),
  farmacia: Tw("farmácia"),
  receita: Tw("receita"),
  dois: Tw("dois", 5) - 6,
  patente2: Tw("patente", 2),
  concedida: Tw("concedida"),
  seis: Tw("seis", 2),
  tg: Tw("tg"),
  lipoless: Tw("lipoless"),
  tirzec: Tw("tirzec"),
  registroPy: Tw("registro", 2),
  naoVale: Tw("vale", 2),
  mas: Tw("mas") - 6,
  unicamp: Tw("unicamp"),
  cinco: Tw("cinco", 2),
  sessenta: Tw("sessenta"),
  impureza: Tw("impureza"),
  contaminacao: Tw("contaminação"),
  seguranca: Tw("segurança"),
  inspecionou: Tw("inspecionou"),
  porisso: Tw("por", 3) - 6,
  proibiu: Tw("proibiu"),
  venda: Tw("venda"),
  entrada: Tw("entrada"),
  uso: Tw("uso"),
  mala: Tw("mala"),
  contrabando: Tw("contrabando"),
  geladeira: Tw("geladeira"),
  graus: Tw("dois", 6),
  olha: Tw("olha") - 8,
  vigilancia: Tw("vigilância"),
  fronteira: Tw("fronteira"),
  nome: Tw("nome"),
  tres: Tw("três", 2) - 6,
  copia: Tw("cópia"),
  lote: Tw("lote"),
  rotulo: Tw("rótulo"),
  dose: Tw("dose"),
  nenhum: Tw("nenhum"),
  falei: Tw("falei"),
  quatro2: Tw("quatro", 2) - 6,
  permitida: Tw("permitida"),
  paciente: Tw("paciente"),
  individual: Tw("receita", 2),
  frasco: Tw("frasco"),
  irregular: Tw("irregular"),
  interditou: Tw("interditou"),
  vinte3: Tw("vinte", 3),
  estoque: Tw("estoque"),
  resumindo: Tw("resumindo") - 6,
  unica: Tw("única"),
  farmacia3: Tw("farmácia", 4),
  retida: Tw("receita", 3),
  nota: Tw("nota"),
  conferir: Tw("conferir"),
  qr: Tw("qr"),
  caixa: Tw("caixa"),
  caneta: Tw("caneta", 2),
  site: Tw("site"),
  vendendo: Tw("vendendo"),
  semMarca: Tw("marca", 3),
  comenta: Tw("comenta") - 6,
  jaViu: Tw("viu"),
  fora: Tw("fora"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 36,
};
export const DURATION = T.final + 90;
// FIM TEMPOS

const PARTES: [number, number][] = [
  [0, T.coment],
  [T.coment, T.antes],
  [T.antes, T.um],
  [T.um, T.dois],
  [T.dois, T.mas],
  [T.mas, T.porisso],
  [T.porisso, T.olha],
  [T.olha, T.tres],
  [T.tres, T.quatro2],
  [T.quatro2, T.resumindo],
  [T.resumindo, T.comenta],
  [T.comenta, T.siga],
  [T.siga, T.final],
  [T.final, DURATION],
];
const R = (i: number) => PARTES[i];
const ativa = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];

// ---------- moldura de cabine ----------
const Moldura: React.FC<{
  f: number;
  i: number;
  rotulo: string;
  tag: string;
  cor?: string;
}> = ({ f, i, rotulo, tag, cor = N.neon }) => {
  if (!ativa(f, i)) return null;
  const k = it(f, R(i)[0], R(i)[0] + 12, 0, 1, OUT);
  const seg = Math.floor((f - R(i)[0]) / 30);
  const canto = (x: number, y: number, rx: number, ry: number) => (
    <path
      d={`M ${x} ${y + 40 * ry} L ${x} ${y} L ${x + 40 * rx} ${y}`}
      stroke={rgba(cor, 0.7)}
      strokeWidth={4}
      fill="none"
    />
  );
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {canto(40, 150, 1, 1)}
        {canto(1040, 150, -1, 1)}
        {canto(40, 1060, 1, -1)}
        {canto(1040, 1060, -1, -1)}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 170,
          display: "flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: VT,
            fontSize: 30,
            color: cor,
            border: `2px solid ${rgba(cor, 0.6)}`,
            padding: "2px 12px",
          }}
        >
          00:{String(seg).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: N.txt,
          }}
        >
          {rotulo}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 176,
          fontFamily: VT,
          fontSize: 28,
          color: N.cinza,
        }}
      >
        {tag}
      </div>
    </AbsoluteFill>
  );
};
const Cena3D: React.FC<{
  f: number;
  i: number;
  tipo: Tipo3D;
  top?: number;
  h?: number;
  zoom?: number;
}> = ({ f, i, tipo, top = 160, h = 900, zoom = 1 }) => (
  <Sequence from={R(i)[0]} durationInFrames={R(i)[1] - R(i)[0]} layout="none">
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: W,
        height: h,
        opacity: Math.min(
          P(f, R(i)[0], R(i)[0] + 10),
          1 - P(f, R(i)[1] - 8, R(i)[1]),
        ),
      }}
    >
      <Objeto3D f={f} ini={R(i)[0]} tipo={tipo} h={h} zoom={zoom} />
    </div>
  </Sequence>
);
const E: React.FC<{ children: string; size?: number }> = ({
  children,
  size,
}) => <span style={{ fontFamily: EMOJI, fontSize: size }}>{children}</span>;

// ---------- ficha com foto (a "evidência" presa no painel) ----------
const Ficha: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  num?: string;
  titulo: string;
  cor?: string;
  src?: string;
  credito?: string;
  rot?: number;
  apagada?: boolean;
  children?: React.ReactNode;
}> = ({
  f,
  at,
  x,
  y,
  w,
  h,
  num,
  titulo,
  cor = N.neon,
  src,
  credito,
  rot = 0,
  apagada,
  children,
}) => {
  if (f < at - 2) return null;
  const k = it(f, at - 2, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 22,
        background: N.painel,
        border: `3px solid ${rgba(cor, apagada ? 0.2 : 0.75)}`,
        boxShadow: apagada ? "none" : `0 0 30px ${rgba(cor, 0.3)}`,
        opacity: k * (apagada ? 0.35 : 1),
        transform: `translateY(${(1 - k) * 50}px) rotate(${rot}deg) scale(${0.85 + 0.15 * k})`,
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        filter: apagada ? "grayscale(1)" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 20px",
          borderBottom: `2px solid ${rgba(cor, 0.35)}`,
        }}
      >
        {num && (
          <span
            style={{
              fontFamily: VT,
              fontSize: 36,
              color: "#050607",
              background: cor,
              borderRadius: 8,
              padding: "0 12px",
            }}
          >
            {num}
          </span>
        )}
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 34,
            color: N.txt,
            letterSpacing: 1,
          }}
        >
          {titulo}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          background: src ? "#f4f4f2" : undefined,
        }}
      >
        {src && (
          <Img
            src={staticFile(D + src)}
            style={{
              position: "absolute",
              inset: 10,
              width: "calc(100% - 20px)",
              height: "calc(100% - 20px)",
              objectFit: "contain",
            }}
          />
        )}
        {children}
      </div>
      {credito && (
        <div
          style={{
            fontFamily: VT,
            fontSize: 22,
            color: N.cinza,
            padding: "4px 18px 6px",
            background: N.painel,
          }}
        >
          {credito}
        </div>
      )}
    </div>
  );
};

// selo verde da original (sem foto da caixa)
const Selo: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10 * size,
    }}
  >
    <div
      style={{
        width: 150 * size,
        height: 150 * size,
        borderRadius: "50%",
        border: `${8 * size}px solid ${N.neon}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 90 * size,
        color: N.neon,
        boxShadow: `0 0 30px ${rgba(N.neon, 0.5)}`,
      }}
    >
      ✓
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 30 * size,
        color: N.neon,
        letterSpacing: 2,
        textAlign: "center",
      }}
    >
      REGISTRADA
      <br />
      NA ANVISA
    </div>
  </div>
);
const Icone: React.FC<{ e: string; txt: string; cor: string }> = ({
  e,
  txt,
  cor,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    }}
  >
    <E size={110}>{e}</E>
    <div style={{ fontFamily: VT, fontSize: 30, color: cor }}>{txt}</div>
  </div>
);

// as 4 fichas em grade (promessa e resumo)
const Grade: React.FC<{ f: number; at: number; acende: number }> = ({
  f,
  at,
  acende,
}) => {
  const so1 = f >= acende;
  const fichas: [string, string, string, React.ReactNode, string?][] = [
    ["1", "ORIGINAL", N.neon, <Selo key="s" size={0.8} />],
    ["2", "PARAGUAI", N.ambar, null, "tg_15_indufar.jpg"],
    [
      "3",
      "FALSIFICADA",
      N.verm,
      <Icone key="i" e="🎭" txt="finge ser a original" cor={N.verm} />,
    ],
    [
      "4",
      "MANIPULADA",
      N.azul,
      <Icone key="i" e="🧪" txt="frasco em série?" cor={N.azul} />,
    ],
  ];
  return (
    <>
      {fichas.map(([num, tit, cor, filho, src], i) => (
        <Ficha
          key={num}
          f={f}
          at={at + i * 6}
          x={i % 2 ? 560 : 80}
          y={i < 2 ? 280 : 650}
          w={440}
          h={340}
          num={num}
          titulo={tit}
          cor={cor}
          src={src}
          apagada={so1 && i > 0}
        >
          {filho}
        </Ficha>
      ))}
    </>
  );
};

// ---------- linha de checklist ----------
const Linha: React.FC<{
  f: number;
  at: number;
  ok: boolean;
  y: number;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, ok, y, size = 48, children }) =>
  f < at ? null : (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: y,
        width: 880,
        display: "flex",
        alignItems: "center",
        gap: 24,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        color: ok ? N.txt : rgba(N.txt, 0.75),
        opacity: P(f, at, at + 8),
        transform: `translateX(${it(f, at, at + 10, -40, 0, OUT)}px)`,
      }}
    >
      <span
        style={{
          width: 72,
          height: 72,
          flex: "none",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
          fontWeight: 900,
          color: "#050607",
          background: ok ? N.neon : N.verm,
          transform: `scale(${it(f, at + 2, at + 12, 0.4, 1, SNAP)})`,
        }}
      >
        {ok ? "✓" : "✕"}
      </span>
      <span
        style={{
          textDecoration: ok ? "none" : "line-through",
          textDecorationColor: N.verm,
        }}
      >
        {children}
      </span>
    </div>
  );

// ---------- legenda ----------
const CHAVE = new Set(
  "paraguai mounjaro não falsificada quatro uma tirzepatida substância marca registrada original anvisa patente receita retida laboratórios vale unicamp sessenta impureza contaminação segurança proibiu contrabando geladeira fronteira cópia falsos manipulada individual irregular interditou registro qr caixa comenta".split(
    " ",
  ),
);
const GRUPOS: { w: string; s: number }[][] = (() => {
  const out: { w: string; s: number }[][] = [];
  let cur: { w: string; s: number }[] = [];
  FALA.forEach((p) => {
    cur.push({ w: p.w, s: p.f });
    if (cur.length >= 3 || /[.?!:,;]$/.test(p.w)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  if (f >= T.siga - 4) return null;
  const gi = GRUPOS.findIndex(
    (g, i) =>
      f >= g[0].s - 2 &&
      (i === GRUPOS.length - 1 || f < GRUPOS[i + 1][0].s - 2),
  );
  if (gi < 0) return null;
  const g = GRUPOS[gi];
  if (f > g[g.length - 1].s + 30) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1150,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 300,
        fontSize: 62,
        color: "#f2f2f2",
        lineHeight: 1.3,
      }}
    >
      {g.map((w, i) => {
        const txt = w.w.replace(/[.,:;!?]+$/, "").replace(/^"|"$/g, "");
        const k = f >= w.s - 1 ? it(f, w.s - 1, w.s + 5, 0, 1, OUT) : 0;
        return (
          <span
            key={i}
            style={{
              opacity: 0.25 + 0.75 * k,
              filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined,
              marginRight: 16,
              display: "inline-block",
            }}
          >
            {CHAVE.has(norm(txt)) ? <Sel>{txt}</Sel> : txt}
          </span>
        );
      })}
    </div>
  );
};

// ---------- mapa simples da fronteira ----------
const Fronteira: React.FC<{ f: number; ini: number; corta: number }> = ({
  f,
  ini,
  corta,
}) => {
  const k = P(f, ini, ini + 14);
  const xF = 600; // linha da fronteira
  const kc = it(f, corta, corta + 16, 0, 1, OUT);
  return (
    <svg
      width={W}
      height={1100}
      style={{ position: "absolute", top: 0, opacity: k }}
    >
      <defs>
        <pattern id="pont" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="2" fill={rgba(N.neon, 0.35)} />
        </pattern>
      </defs>
      <rect
        x={80}
        y={260}
        width={xF - 80}
        height={330}
        rx={24}
        fill="url(#pont)"
        stroke={rgba(N.neon, 0.5)}
        strokeWidth={3}
      />
      <rect
        x={xF}
        y={260}
        width={1000 - xF}
        height={330}
        rx={24}
        fill={rgba(N.ambar, 0.06)}
        stroke={rgba(N.ambar, 0.5)}
        strokeWidth={3}
      />
      <line
        x1={xF}
        y1={240}
        x2={xF}
        y2={610}
        stroke={N.txt}
        strokeWidth={5}
        strokeDasharray="16 12"
      />
      <text
        x={(80 + xF) / 2}
        y={320}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={44}
        fill={N.neon}
      >
        BRASIL
      </text>
      <text
        x={(xF + 1000) / 2}
        y={320}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={44}
        fill={N.ambar}
      >
        PARAGUAI
      </text>
      {/* a patente: um escudo que cobre o Brasil e para na fronteira */}
      <g
        transform={`translate(${(80 + xF) / 2}, 450) scale(${0.6 + 0.4 * kc})`}
        opacity={kc}
      >
        <path
          d="M 0 -95 L 80 -60 L 70 30 Q 40 85 0 100 Q -40 85 -70 30 L -80 -60 Z"
          fill={rgba(N.neon, 0.18)}
          stroke={N.neon}
          strokeWidth={6}
        />
        <text
          y={-5}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={30}
          fill={N.neon}
        >
          PATENTE
        </text>
        <text
          y={34}
          textAnchor="middle"
          fontFamily={VT}
          fontSize={34}
          fill={N.txt}
        >
          até 2036
        </text>
      </g>
      <g opacity={kc}>
        <text
          x={(xF + 1000) / 2}
          y={470}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={88}
          fill={N.verm}
        >
          ✕
        </text>
        <text
          x={(xF + 1000) / 2}
          y={530}
          textAnchor="middle"
          fontFamily={VT}
          fontSize={30}
          fill={N.txt}
        >
          sem patente lá
        </text>
      </g>
    </svg>
  );
};

// ---------- termômetro da geladeira ----------
const Termometro: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at - 4) return null;
  const k = P(f, at - 4, at + 8);
  // a temperatura "na mala" sobe e sai da faixa segura
  const temp = 5 + 25 * it(f, at + 20, at + 70, 0, 1, OUT);
  const y = (c: number) => 960 - c * 9;
  return (
    <svg
      width={W}
      height={1100}
      style={{ position: "absolute", top: 0, opacity: k }}
    >
      <rect
        x={780}
        y={y(35)}
        width={60}
        height={35 * 9}
        rx={30}
        fill={N.painel}
        stroke={N.txt}
        strokeWidth={4}
      />
      <rect
        x={780}
        y={y(8)}
        width={60}
        height={6 * 9}
        fill={rgba(N.neon, 0.35)}
      />
      <rect
        x={796}
        y={y(temp)}
        width={28}
        height={temp * 9}
        rx={14}
        fill={temp > 8 ? N.verm : N.neon}
      />
      <text x={860} y={y(8) + 6} fontFamily={VT} fontSize={30} fill={N.neon}>
        8 °C
      </text>
      <text x={860} y={y(2) + 6} fontFamily={VT} fontSize={30} fill={N.neon}>
        2 °C
      </text>
      <text
        x={860}
        y={y(temp) + 10}
        fontFamily={VT}
        fontSize={40}
        fill={temp > 8 ? N.verm : N.txt}
      >
        {Math.round(temp)} °C
      </text>
    </svg>
  );
};

// ---------- cenas ----------
const Cenas: React.FC<{ f: number }> = ({ f }) => (
  <>
    {/* 0. gancho: a caneta do Paraguai (foto oficial) é a original? NÃO */}
    <Moldura f={f} i={0} rotulo="Original × Paraguai" tag="tirzepatida" />
    {ativa(f, 0) && (
      <>
        <Ficha
          f={f}
          at={2}
          x={240}
          y={250}
          w={600}
          h={520}
          num="?"
          titulo="CANETA DO PARAGUAI"
          cor={N.ambar}
          src="tg_15_indufar.jpg"
          credito="foto: site do fabricante (Paraguai)"
          rot={-2}
        />
        <Chip f={f} at={Tw("mounjaro") - 2} cor={N.txt} y={810} centro>
          = a original?
        </Chip>
        <Carimbo
          f={f}
          at={T.nao}
          texto="NÃO"
          cor={N.verm}
          x={540}
          y={520}
          size={150}
        />
        <Chip f={f} at={T.falsif} cor={N.verm} y={900} centro>
          ≠ e também não é a falsificada
        </Chip>
      </>
    )}

    {/* 1. promessa: 4 canetas, só 1 com registro */}
    <Moldura f={f} i={1} rotulo="Vamos separar" tag="4 canetas" />
    {ativa(f, 1) && (
      <>
        <Titulo f={f} at={R(1)[0] + 4} y={200} size={60}>
          São <Sel>4 canetas</Sel> diferentes
        </Titulo>
        <Grade f={f} at={T.quatro - 4} acende={T.uma} />
        <Chip f={f} at={T.uma} cor={N.neon} y={1020} centro>
          ✅ só 1 tem registro no Brasil
        </Chip>
      </>
    )}

    {/* 2. princípio ativo × marca (molécula em 3D) */}
    <Sequence from={R(2)[0]} durationInFrames={R(2)[1] - R(2)[0]} layout="none">
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 320,
          width: W,
          height: 680,
          opacity: Math.min(
            P(f, R(2)[0], R(2)[0] + 10),
            1 - P(f, R(2)[1] - 8, R(2)[1]),
          ),
        }}
      >
        <Molecula3D
          f={f}
          ini={R(2)[0]}
          etiquetas={T.dipirona}
          uma={T.registrada - 12}
          h={680}
        />
      </div>
    </Sequence>
    <Moldura f={f} i={2} rotulo="Substância × marca" tag="princípio ativo" />
    {ativa(f, 2) && (
      <>
        <Chip f={f} at={T.tirz} cor={N.neon} x={70} y={240}>
          🧬 tirzepatida = a substância
        </Chip>
        <Chip f={f} at={T.marca} cor={N.azul} x={590} y={240}>
          🏷️ Mounjaro = a marca
        </Chip>
        <Chip f={f} at={T.dipirona} cor={N.txt} y={930} centro>
          💊 como a dipirona: 1 substância, vários nomes
        </Chip>
        <Carimbo
          f={f}
          at={T.registrada}
          texto="NO BRASIL: SÓ 1 MARCA"
          cor={N.neon}
          x={540}
          y={830}
          size={54}
        />
      </>
    )}

    {/* 3. ficha 1: a original */}
    <Cena3D f={f} i={3} tipo="real" top={560} h={480} zoom={1.1} />
    <Moldura f={f} i={3} rotulo="Nº 1 · a original" tag="registrada" />
    {ativa(f, 3) && (
      <>
        <Ficha
          f={f}
          at={R(3)[0] + 4}
          x={80}
          y={250}
          w={400}
          h={340}
          num="1"
          titulo="ORIGINAL"
        >
          <Selo size={0.85} />
        </Ficha>
        <Chip f={f} at={T.a2023} cor={N.neon} x={520} y={270}>
          2023 · diabetes tipo 2
        </Chip>
        <Chip f={f} at={T.a2025} cor={N.neon} x={520} y={350}>
          2025 · obesidade
        </Chip>
        <Chip f={f} at={T.patente} cor={N.azul} x={520} y={430}>
          🛡️ patente até 2036
        </Chip>
        <Chip f={f} at={T.farmacia} cor={N.txt} x={520} y={510}>
          🏥 farmácia + receita retida
        </Chip>
      </>
    )}

    {/* 4. ficha 2: a do Paraguai (patente na fronteira + fotos oficiais) */}
    <Moldura
      f={f}
      i={4}
      rotulo="Nº 2 · a do Paraguai"
      tag="registro de lá"
      cor={N.ambar}
    />
    {ativa(f, 4) && (
      <>
        {f < T.tg - 8 && (
          <Fronteira f={f} ini={R(4)[0]} corta={T.patente2 + 6} />
        )}
        {f < T.tg - 8 && (
          <Chip f={f} at={T.seis} cor={N.ambar} y={680} centro>
            🏭 pelo menos 6 laboratórios no Paraguai
          </Chip>
        )}
        {f >= T.tg - 8 && (
          <>
            <Ficha
              f={f}
              at={T.tg - 6}
              x={50}
              y={250}
              w={320}
              h={360}
              titulo="T.G."
              cor={N.ambar}
              src="tg_15_indufar.jpg"
              credito="foto: site do fabricante"
              rot={-3}
            />
            <Ficha
              f={f}
              at={T.lipoless - 4}
              x={380}
              y={230}
              w={320}
              h={360}
              titulo="Lipoless"
              cor={N.ambar}
              src="lipoless_md_pen_15_eticos.jpg"
              credito="foto: site do fabricante"
            />
            <Ficha
              f={f}
              at={T.tirzec - 4}
              x={710}
              y={250}
              w={320}
              h={360}
              titulo="Tirzec"
              cor={N.ambar}
              src="tirzec_15_quimfa.png"
              credito="foto: site do fabricante"
              rot={3}
            />
            <Chip f={f} at={T.registroPy} cor={N.ambar} y={660} centro>
              📄 registro do Paraguai
            </Chip>
            <Carimbo
              f={f}
              at={T.naoVale}
              texto="NÃO VALE AQUI"
              cor={N.verm}
              x={540}
              y={860}
              size={84}
            />
          </>
        )}
      </>
    )}

    {/* 5. a análise da Unicamp */}
    <Moldura
      f={f}
      i={5}
      rotulo="Tem tirzepatida dentro?"
      tag="análise · Unicamp"
      cor={N.ambar}
    />
    {ativa(f, 5) && (
      <>
        <Titulo f={f} at={R(5)[0] + 4} y={210} size={58}>
          “Mas tem <Sel>tirzepatida</Sel> dentro?”
        </Titulo>
        {Array.from({ length: 5 }, (_, i) => {
          const at = T.unicamp + i * 4;
          const alto = i === 2;
          const nivel = alto
            ? it(f, T.sessenta - 6, T.sessenta + 14, 0.55, 0.88, OUT)
            : 0.55;
          return f < at ? null : (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 150 + i * 165,
                top: 340,
                width: 120,
                height: 300,
                opacity: P(f, at, at + 8),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 30,
                  top: 0,
                  width: 60,
                  height: 30,
                  borderRadius: 6,
                  background: "#64748b",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  top: 30,
                  width: 100,
                  height: 260,
                  borderRadius: 18,
                  border: `4px solid ${rgba(N.txt, 0.8)}`,
                  overflow: "hidden",
                  background: rgba("#ffffff", 0.04),
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${nivel * 100}%`,
                    background:
                      alto && f >= T.sessenta
                        ? rgba(N.verm, 0.7)
                        : rgba(N.neon, 0.55),
                  }}
                />
              </div>
              {f >= T.cinco && (
                <div
                  style={{
                    position: "absolute",
                    top: 300,
                    width: 120,
                    textAlign: "center",
                    fontFamily: SANS,
                    fontWeight: 900,
                    fontSize: 40,
                    color: N.neon,
                  }}
                >
                  ✓
                </div>
              )}
              {alto && f >= T.sessenta && (
                <div
                  style={{
                    position: "absolute",
                    top: -60,
                    width: 120,
                    textAlign: "center",
                    fontFamily: VT,
                    fontSize: 52,
                    color: N.verm,
                    textShadow: `0 0 16px ${N.verm}`,
                  }}
                >
                  +60%
                </div>
              )}
            </div>
          );
        })}
        <Chip f={f} at={T.cinco} cor={N.neon} y={700} centro>
          ✓ achou o princípio ativo em 5 marcas
        </Chip>
        <Chip f={f} at={T.impureza} cor={N.ambar} x={90} y={790}>
          ? impureza
        </Chip>
        <Chip f={f} at={T.contaminacao} cor={N.ambar} x={350} y={790}>
          ? contaminação
        </Chip>
        <Chip f={f} at={T.seguranca} cor={N.ambar} x={700} y={790}>
          ? segurança
        </Chip>
        <Chip f={f} at={T.inspecionou} cor={N.verm} y={890} centro>
          🏭 fábricas não inspecionadas pela Anvisa
        </Chip>
      </>
    )}

    {/* 6. proibição e transporte */}
    <Moldura
      f={f}
      i={6}
      rotulo="Anvisa · proibição"
      tag="contrabando"
      cor={N.verm}
    />
    {ativa(f, 6) && (
      <>
        <Carimbo
          f={f}
          at={T.proibiu}
          texto="PROIBIDAS"
          cor={N.verm}
          x={540}
          y={330}
          size={110}
        />
        <Chip f={f} at={T.venda} cor={N.cinza} x={110} y={470}>
          🚫 venda
        </Chip>
        <Chip f={f} at={T.entrada} cor={N.cinza} x={380} y={470}>
          🚫 entrada
        </Chip>
        <Chip f={f} at={T.uso} cor={N.cinza} x={700} y={470}>
          🚫 uso
        </Chip>
        {f >= T.mala - 4 && (
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 600,
              opacity: P(f, T.mala - 4, T.mala + 6),
              transform: `translateX(${it(f, T.mala - 4, T.mala + 60, -60, 120, OUT)}px)`,
            }}
          >
            <E size={170}>🧳</E>
          </div>
        )}
        <Chip f={f} at={T.contrabando} cor={N.verm} x={90} y={830}>
          ⚠️ mesmo para você = contrabando
        </Chip>
        <Termometro f={f} at={T.geladeira} />
        <Chip f={f} at={T.graus} cor={N.neon} x={560} y={1000}>
          ❄️ precisa ficar entre 2 e 8 °C
        </Chip>
      </>
    )}

    {/* 7. a virada: alerta da vigilância do próprio Paraguai */}
    <Moldura
      f={f}
      i={7}
      rotulo="Alerta no Paraguai"
      tag="DINAVISA"
      cor={N.ambar}
    />
    {ativa(f, 7) && (
      <>
        <Titulo f={f} at={R(7)[0] + 4} y={210} size={56}>
          E olha que <Sel>curioso</Sel>…
        </Titulo>
        <Ficha
          f={f}
          at={T.vigilancia}
          x={140}
          y={310}
          w={800}
          h={560}
          titulo="⚠ ALERTA SANITÁRIO · PARAGUAI"
          cor={N.ambar}
          src="paraguai_caixas_irregulares_dinavisa.jpg"
          credito="foto: alerta 15/2025 da DINAVISA, a vigilância sanitária do Paraguai"
        />
        <Carimbo
          f={f}
          at={T.fronteira}
          texto="SEM REGISTRO"
          cor={N.verm}
          x={540}
          y={600}
          size={80}
        />
        <Chip f={f} at={T.nome} cor={N.ambar} y={910} centro>
          ⚠️ vendidas na fronteira, até com o nome da original
        </Chip>
      </>
    )}

    {/* 8. ficha 3: a falsificada */}
    <Cena3D f={f} i={8} tipo="falsa" top={330} h={620} />
    <Moldura
      f={f}
      i={8}
      rotulo="Nº 3 · a falsificada"
      tag="lote falso"
      cor={N.verm}
    />
    {ativa(f, 8) && (
      <>
        <Titulo f={f} at={R(8)[0] + 4} y={210} size={60}>
          Finge ser a <Sel>original</Sel>
        </Titulo>
        <Chip f={f} at={T.lote} cor={N.verm} x={80} y={360}>
          ✕ lote falso
        </Chip>
        <Chip f={f} at={T.rotulo} cor={N.verm} x={700} y={360}>
          ✕ rótulo falso
        </Chip>
        <Chip f={f} at={T.dose} cor={N.ambar} x={80} y={880}>
          ⚠️ dose errada
        </Chip>
        <Chip f={f} at={T.nenhum} cor={N.verm} x={560} y={880}>
          ⚠️ ou nenhum remédio
        </Chip>
        <Chip f={f} at={T.falei} cor={N.cinza} y={980} centro>
          📺 do vídeo dos lotes
        </Chip>
      </>
    )}

    {/* 9. ficha 4: a manipulada */}
    <Moldura
      f={f}
      i={9}
      rotulo="Nº 4 · a manipulada"
      tag="regra da Anvisa"
      cor={N.azul}
    />
    {ativa(f, 9) && (
      <>
        <Titulo f={f} at={R(9)[0] + 4} y={210} size={60}>
          Só é <Sel>permitida</Sel> assim:
        </Titulo>
        <Linha f={f} at={T.permitida} ok y={330}>
          Farmácia de manipulação
        </Linha>
        <Linha f={f} at={T.paciente - 4} ok y={430}>
          Para um paciente
        </Linha>
        <Linha f={f} at={T.individual} ok y={530}>
          Com receita individual
        </Linha>
        <Linha f={f} at={T.frasco} ok={false} y={650}>
          Frasco em série, vendido por aí
        </Linha>
        {f >= T.vinte3 - 6 && (
          <div
            style={{
              position: "absolute",
              top: 770,
              width: W,
              textAlign: "center",
              fontFamily: VT,
              fontSize: 120,
              color: N.ambar,
              textShadow: `0 0 24px ${rgba(N.ambar, 0.6)}`,
              opacity: P(f, T.vinte3 - 6, T.vinte3 + 2),
            }}
          >
            {Math.round(
              23000 * it(f, T.vinte3 - 6, T.estoque, 0, 1, OUT),
            ).toLocaleString("pt-BR")}{" "}
            frascos
          </div>
        )}
        <Carimbo
          f={f}
          at={T.estoque + 6}
          texto="INTERDITADA"
          cor={N.verm}
          x={540}
          y={960}
          size={70}
        />
      </>
    )}

    {/* 10. resumo: só a original acende + como conferir */}
    <Moldura f={f} i={10} rotulo="Resumindo" tag="como conferir" />
    {ativa(f, 10) && f < T.qr - 8 && (
      <>
        <Grade f={f} at={R(10)[0] + 2} acende={T.unica} />
        <Chip f={f} at={T.farmacia3} cor={N.neon} x={80} y={1020}>
          ✓ farmácia
        </Chip>
        <Chip f={f} at={T.retida} cor={N.neon} x={330} y={1020}>
          ✓ receita retida
        </Chip>
        <Chip f={f} at={T.nota} cor={N.neon} x={690} y={1020}>
          ✓ nota fiscal
        </Chip>
      </>
    )}
    {ativa(f, 10) && f >= T.qr - 8 && (
      <>
        <Titulo f={f} at={T.qr - 8} y={210} size={58}>
          Escaneie o <Sel>QR code da caixa</Sel>
        </Titulo>
        <Ficha
          f={f}
          at={T.qr - 6}
          x={140}
          y={320}
          w={800}
          h={470}
          titulo="📦 CAIXA · exemplo oficial"
          cor={N.neon}
          src="lilly_exemplo_qrcode.png"
          credito="imagem: site de verificação da fabricante"
        />
        <Chip f={f} at={T.caixa} cor={N.neon} x={150} y={820}>
          ✓ o da caixa
        </Chip>
        <Chip f={f} at={T.caneta} cor={N.verm} x={600} y={820}>
          ✕ não o da caneta
        </Chip>
        <Chip f={f} at={T.vendendo} cor={N.ambar} y={920} centro>
          ⚠️ só “tirzepatida”, sem a marca = não é a original
        </Chip>
      </>
    )}

    {/* 11. pergunta para os comentários */}
    <Moldura f={f} i={11} rotulo="Enquete" tag="comenta aí 👇" />
    {ativa(f, 11) && (
      <>
        <Titulo f={f} at={R(11)[0] + 4} y={260} size={58}>
          Já viu caneta sendo vendida
          <br />
          fora da farmácia?
        </Titulo>
        {(
          [
            ["👀 JÁ VI", N.ambar, T.jaViu, 120],
            ["🙅 NUNCA VI", N.azul, T.fora, 580],
          ] as [string, string, number, number][]
        ).map(([t, cor, at, x]) => (
          <Painel
            key={t}
            x={x}
            y={600}
            w={380}
            h={170}
            o={P(f, at - 6, at + 6)}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 50,
                color: cor,
              }}
            >
              {t}
            </div>
          </Painel>
        ))}
        <Carimbo
          f={f}
          at={T.comenta + 10}
          texto="COMENTA AÍ!"
          cor={N.ambar}
          x={540}
          y={880}
          size={56}
        />
      </>
    )}

    {/* 12. me siga, com o logo Farma.exe */}
    {ativa(f, 12) && (
      <>
        <Img
          src={staticFile(D + "logo.jpg")}
          style={{
            position: "absolute",
            left: 540 - 160,
            top: 330,
            width: 320,
            height: 320,
            borderRadius: 160,
            border: `5px solid ${N.neon}`,
            boxShadow: `0 0 40px ${rgba(N.neon, 0.6)}`,
            opacity: P(f, T.siga - 4, T.siga + 8),
            transform: `scale(${0.7 + 0.3 * it(f, T.siga - 4, T.siga + 12, 0, 1, SNAP)})`,
          }}
        />
        <Titulo f={f} at={T.siga} y={690} size={110}>
          Me siga
        </Titulo>
        <div
          style={{
            position: "absolute",
            top: 850,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: N.cinza,
            opacity: P(f, T.siga + 10, T.siga + 22),
          }}
        >
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área <E>💊</E>
        </div>
      </>
    )}
    {/* 13. tela final */}
    {f >= R(13)[0] && (
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 80,
          width: 920,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 70,
          lineHeight: 1.35,
          color: "#f2f2f2",
          opacity: it(f, T.final, T.final + 14, 0, 1, OUT),
        }}
      >
        Consulte um <Sel>profissional de saúde</Sel> para orientações.
      </div>
    )}
  </>
);

// ---------- som ----------
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  ...PARTES.slice(1, 13).map(
    ([de]) => [de, WHOOSH, 0.13] as [number, string, number],
  ),
  [T.nao, TRAVA, 0.32],
  [T.uma, PLIM, 0.15],
  [T.registrada, TRAVA, 0.16],
  [T.tg - 6, POP, 0.11],
  [T.lipoless - 4, POP, 0.11],
  [T.tirzec - 4, POP, 0.11],
  [T.naoVale, TRAVA, 0.3],
  [T.sessenta, POP, 0.11],
  [T.proibiu, TRAVA, 0.32],
  [T.fronteira, TRAVA, 0.16],
  [T.estoque + 6, TRAVA, 0.16],
  [T.unica, PLIM, 0.15],
  [T.comenta + 10, PLIM, 0.15],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
  [T.final + 6, K + "logo-stings/sting-airy-long.wav", 0.5],
];
// trilha mais alta nas pausas e mais baixa sob a voz; sobe na tela final, sem voz
const FALANDO = (() => {
  const a = new Array(DURATION + 1).fill(0);
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
  0.2 -
  0.12 *
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0) +
  0.2 * P(fr, T.final, T.final + 20) -
  0.4 * P(fr, DURATION - 40, DURATION);

export const VideoTirzepatidaParaguai: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Cenas f={f} />
      <Legenda f={f} />
      <Audio src={staticFile(D + "narracao.mp3")} />
      <Audio
        src={staticFile(D + "musica.wav")}
        volume={(fr) => Math.max(0, musica(fr))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(name)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920, tudo entre y≈300 e 1620 por causa do corte 3:4 do TikTok)
export const CapaTirzepatidaParaguai: React.FC = () => {
  const f = 0;
  return (
    <AbsoluteFill>
      <Fundo f={0} />
      <div
        style={{
          position: "absolute",
          top: 320,
          width: W,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: VT,
            fontSize: 40,
            color: N.ambar,
            border: `3px solid ${rgba(N.ambar, 0.7)}`,
            padding: "4px 20px",
          }}
        >
          ● ORIGINAL × PARAGUAI × FALSIFICADA
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 410,
          width: W,
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 86,
          lineHeight: 1.1, whiteSpace: "nowrap",
          color: N.txt,
          textShadow: `0 0 40px ${rgba(N.neon, 0.4)}`,
        }}
      >
        A caneta do Paraguai
        <br />é <Sel>Mounjaro</Sel>?
      </div>
      <Ficha
        f={30}
        at={0}
        x={300}
        y={660}
        w={480}
        h={500}
        titulo="CANETA DO PARAGUAI"
        cor={N.ambar}
        src="tg_15_indufar.jpg"
        credito="foto: site do fabricante"
        rot={-3}
      />
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 930,
          transform: "translate(-50%,-50%) rotate(-8deg)",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 170,
          letterSpacing: 6,
          color: N.verm,
          border: `10px solid ${N.verm}`,
          borderRadius: 16,
          padding: "0 40px",
          background: "rgba(0,0,0,0.6)",
          textShadow: `0 0 24px ${N.verm}`,
          boxShadow: `0 0 40px ${rgba(N.verm, 0.5)}`,
        }}
      >
        NÃO
      </div>
      <div
        style={{
          position: "absolute",
          top: 1240,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 60,
          color: "#f2f2f2",
          lineHeight: 1.3,
        }}
      >
        as <Sel>4 canetas</Sel> de tirzepatida
        <br />e só 1 tem registro
      </div>
      {f < 0 && null}
    </AbsoluteFill>
  );
};
