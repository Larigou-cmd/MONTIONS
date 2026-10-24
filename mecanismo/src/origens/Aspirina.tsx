import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SANS } from "../fonts";
import { OUT, P, SNAP, W, it } from "../lib";
import {
  CINZA,
  Carimbo,
  Cena,
  Etiqueta,
  Fita,
  Foto,
  OURO,
  PAPEL,
  Papel,
  Retrato,
  SERIF,
  TINTA,
  VERM,
} from "./Captopril";
import falaJson from "./aspirina_fala.json";

// Série "A origem dos remédios" #2 — A aspirina e o salgueiro. Modelo 6 ("Origens"), mesmas peças do #1.
// Roteiro e fontes: origens/aspirina/roteiro.md. Imagens: public/aspirina/img (Wikimedia Commons, créditos em creditos.txt).

// ---------- fala: palavra e quadro em que ela começa ----------
type Pal = { w: string; f: number };
// tempos medidos na narração da Juliana (faster-whisper, alinhados ao texto do roteiro)
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const T = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
const FIM_FALA = FALA[FALA.length - 1].f + 24;
const S = {
  salgueiro: T("salgueiro"),
  folhas: T("folhas"),
  a1763: T("1763"),
  stone: T("stone"),
  sociedade: T("sociedade"),
  a1828: T("1828"),
  salicina: T("salicina"),
  salicilico: T("salicílico"),
  atacava: T("atacava"),
  a1897: T("1897"),
  bayer: T("bayer"),
  hoffmann: T("hoffmann"),
  molecula: T("molécula"),
  acetil: T("acetilsalicílico"),
  a1899: T("1899"),
  aspirina: T("aspirina"),
  spir: T("spir"),
  spiraea: T("spiraea"),
  como: T("como"),
  a1971: T("1971"),
  vane: T("vane"),
  bloqueia: T("bloqueia"),
  dor: T("dor", 2),
  nobel: T("nobel"),
  aoLado: T("ao"),
  conhecido: T("conhecido"),
  sergio: T("sérgio"),
  hoje: T("hoje"),
  quarenta: T("quarenta"),
  tudo: T("tudo", 2),
  siga: T("siga") - 4,
  final: FIM_FALA + 6,
};
export const DURATION_ASPIRINA = S.final + 96;
const CENAS = [
  0,
  S.salgueiro - 6,
  S.a1763 - 10,
  S.a1828 - 10,
  S.a1897 - 10,
  S.a1899 - 10,
  S.como - 12,
  S.aoLado - 6,
  S.hoje - 6,
  S.siga - 6,
  S.final,
];
const SFX: [number, string, number][] = [];
CENAS.slice(1).forEach((c) => SFX.push([c - 2, "whoosh", 0.22]));
SFX.push(
  [S.a1763, "pop", 0.22],
  [S.atacava + 4, "trava", 0.3],
  [S.a1897, "pop", 0.22],
  [S.spir, "pop", 0.22],
  [S.bloqueia + 6, "trava", 0.32],
  [S.nobel, "plim", 0.25],
  [S.sergio, "pop", 0.22],
  [S.final + 4, "plim", 0.28],
);

const GRUPOS = (() => {
  const gs: Pal[][] = [];
  let cur: Pal[] = [];
  FALA.forEach((p, i) => {
    cur.push(p);
    if (/[.,:?]$|\.\.\.$/.test(p.w) || cur.length >= 3 || i === FALA.length - 1) {
      gs.push(cur);
      cur = [];
    }
  });
  return gs;
})();
const DESTAQUES = [
  "árvore",
  "salgueiro",
  "dor",
  "febre",
  "1763",
  "salicina",
  "estômago",
  "acetilsalicílico",
  "aspirina",
  "spir",
  "spiraea",
  "prostaglandinas",
  "nobel",
  "brasileiro",
  "ferreira",
  "toneladas",
];

const Legenda: React.FC<{ y?: number; cor?: string }> = ({
  y = 400,
  cor = TINTA,
}) => {
  const f = useCurrentFrame();
  if (f >= S.final) return null;
  const g = GRUPOS.find(
    (gr, i) =>
      f >= gr[0].f - 2 &&
      f < (GRUPOS[i + 1] ? GRUPOS[i + 1][0].f - 2 : FIM_FALA),
  );
  if (!g) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 60,
        width: W - 120,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: 96,
        lineHeight: 1.05,
        color: cor,
      }}
    >
      {g.map((p, j) => {
        const k = it(f, p.f - 2, p.f + 6, 0, 1, OUT);
        const dest = DESTAQUES.includes(norm(p.w));
        return (
          <span
            key={j}
            style={{
              display: "inline-block",
              marginRight: 22,
              opacity: k,
              transform: `translateY(${(1 - k) * 18}px)`,
              filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined,
              color: dest ? VERM : undefined,
            }}
          >
            {p.w.replace(/[,:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// número grande em serifa (os anos da história)
const Ano: React.FC<{ x: number; y: number; at: number; txt: string; size?: number }> = ({
  x,
  y,
  at,
  txt,
  size = 170,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) translateY(${(1 - k) * 30}px)`,
        fontFamily: SERIF,
        fontSize: size,
        color: VERM,
        opacity: k,
      }}
    >
      {txt}
    </div>
  );
};

// comprimido branco de aspirina
const Comprimido: React.FC<{ x: number; y: number; at: number; r?: number; s?: number }> = ({
  x,
  y,
  at,
  r = 120,
  s = 1,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP) * s;
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(${x},${y}) scale(${k})`}>
        <circle
          r={r}
          fill="#fbfaf7"
          stroke={TINTA}
          strokeWidth={6}
          style={{ filter: "drop-shadow(0 14px 24px rgba(40,30,15,.35))" }}
        />
        <line x1={-r * 0.8} y1={0} x2={r * 0.8} y2={0} stroke="#c9c2b4" strokeWidth={8} />
        <text
          y={-r * 0.25}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={r * 0.34}
          fill={VERM}
        >
          AAS
        </text>
      </g>
    </svg>
  );
};

// folhas de salgueiro caindo
const Folhas: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 12 }, (_, i) => {
        const t = f - at - i * 6;
        if (t < 0) return null;
        const x = 120 + random(`fx${i}`) * 840 + Math.sin(t / 14 + i) * 50;
        const y = 640 + t * (3 + random(`fv${i}`) * 2);
        if (y > 1950) return null;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={44}
            ry={10}
            fill={i % 4 === 0 ? VERM : "#5d6150"}
            opacity={0.85}
            transform={`rotate(${(t * 3 + i * 40) % 360} ${x} ${y})`}
          />
        );
      })}
    </svg>
  );
};

// carta de 1763 com selo de cera
const Carta: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g
        transform={`translate(540,1180) rotate(-4) scale(${0.85 + 0.15 * k})`}
        opacity={Math.min(1, k * 1.5)}
      >
        <rect
          x={-330}
          y={-400}
          width={660}
          height={800}
          fill="#f3ead4"
          style={{ filter: "drop-shadow(0 18px 30px rgba(40,30,15,.35))" }}
        />
        {Array.from({ length: 13 }, (_, i) => {
          const linha = P(f, at + 6 + i * 4, at + 16 + i * 4);
          const w = (i === 12 ? 300 : 520) * linha;
          let d = `M-260,${-300 + i * 50}`;
          for (let x = 0; x < w; x += 20)
            d += ` q10,${(random(`c${i}${x}`) - 0.5) * 16} 20,0`;
          return (
            <path key={i} d={d} fill="none" stroke="#4a3f30" strokeWidth={4} opacity={0.75} />
          );
        })}
        <circle cx={200} cy={300} r={62} fill={VERM} />
        <circle cx={200} cy={300} r={44} fill="none" stroke="#8e0b20" strokeWidth={6} />
        <text x={200} y={316} textAnchor="middle" fontFamily={SERIF} fontSize={46} fill="#8e0b20">
          RS
        </text>
      </g>
    </svg>
  );
};

// estômago desenhado que fica vermelho ("atacava o estômago")
const Estomago: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, SNAP);
  const pulso = 0.5 + 0.5 * Math.sin((f - at) / 3);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(560,1300) scale(${1.1 * k})`}>
        <path d="M-10,-330 L-10,-200" stroke={TINTA} strokeWidth={46} strokeLinecap="round" />
        <path
          d="M-40,-210 C-60,-110 -170,-60 -150,60 C-130,190 60,230 170,140 C250,70 210,-50 110,-40 C40,-35 30,-110 30,-210 Z"
          fill={`rgba(200,16,46,${0.25 + 0.5 * pulso})`}
          stroke={TINTA}
          strokeWidth={10}
        />
        <path d="M150,150 C180,200 230,210 260,190" fill="none" stroke={TINTA} strokeWidth={30} strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <text
            key={i}
            x={-30 + i * 70}
            y={40 + (i % 2) * 40}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={70}
            fill={TINTA}
            opacity={pulso}
          >
            !
          </text>
        ))}
      </g>
    </svg>
  );
};

// molécula (PNG do Wikimedia) que entra com leve giro
const Molecula: React.FC<{ src: string; x: number; y: number; w: number; at: number; rot?: number }> = ({
  src,
  x,
  y,
  w,
  at,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `translate(-50%,-50%) rotate(${rot + (1 - k) * -25}deg) scale(${0.7 + 0.3 * k})`,
        opacity: k,
      }}
    />
  );
};

// a palavra ASPIRIN quebrada em pedaços
const Nome: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.aspirina - 4) return null;
  const separa = it(f, S.spir - 6, S.spir + 6, 0, 1, OUT);
  const pecas = ["A", "SPIR", "IN"];
  const legendas = ["acetil", "spiraea", "sufixo"];
  return (
    <div
      style={{
        position: "absolute",
        top: 740,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 10 + 50 * separa,
        fontFamily: SERIF,
        fontSize: 170,
        color: TINTA,
        opacity: P(f, S.aspirina - 4, S.aspirina + 6),
      }}
    >
      {pecas.map((p, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ color: i === 1 && separa > 0.5 ? VERM : TINTA }}>{p}</div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: 30,
              color: CINZA,
              opacity: separa,
            }}
          >
            {legendas[i]}
          </div>
        </div>
      ))}
    </div>
  );
};

// palavra riscada em vermelho (bloqueia as prostaglandinas)
const Bloqueio: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.bloqueia - 4) return null;
  const k = P(f, S.bloqueia - 4, S.bloqueia + 6);
  const risco = it(f, S.bloqueia + 4, S.bloqueia + 12, 0, 1, OUT);
  const chips = ["dor", "febre", "inflamação"];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 790,
          top: 900,
          transform: "translate(-50%,-50%) rotate(-3deg)",
          opacity: k,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 42,
          letterSpacing: 1,
          color: TINTA,
          background: "#fbf8f1",
          padding: "16px 24px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
        }}
      >
        PROSTAGLANDINAS
        <div
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            height: 12,
            width: `${risco * 95}%`,
            background: VERM,
            transform: "rotate(-4deg)",
          }}
        />
      </div>
      {chips.map((c, i) => {
        const at = S.dor - 4 + i * 12;
        if (f < at) return null;
        const u = it(f, at, at + 8, 0, 1, OUT);
        return (
          <Etiqueta key={c} x={760} y={1040 + i * 100} at={at} rot={i % 2 ? 2 : -2} cor={VERM}>
            <span style={{ opacity: u }}>{c} ↓</span>
          </Etiqueta>
        );
      })}
    </>
  );
};

// medalha do Nobel
const Medalha: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(330,1580) scale(${k}) rotate(${(1 - k) * 40})`}>
        <path d="M-60,-200 L-20,-90 L20,-90 L60,-200" fill={VERM} />
        <circle r={120} fill={OURO} style={{ filter: "drop-shadow(0 10px 20px rgba(40,30,15,.35))" }} />
        <circle r={98} fill="none" stroke="#8a6a26" strokeWidth={6} />
        <text y={-6} textAnchor="middle" fontFamily={SERIF} fontSize={52} fill="#5a4416">
          NOBEL
        </text>
        <text y={48} textAnchor="middle" fontFamily={SERIF} fontSize={44} fill="#5a4416">
          1982
        </text>
      </g>
    </svg>
  );
};

// contador de toneladas por ano
const Contador: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.round(40000 * it(f, S.quarenta - 6, S.quarenta + 30, 0, 1, OUT));
  return (
    <div
      style={{
        position: "absolute",
        top: 1200,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        color: TINTA,
      }}
    >
      <div style={{ fontSize: 210, color: VERM, lineHeight: 1 }}>
        {v.toLocaleString("pt-BR")}
      </div>
      <div style={{ fontStyle: "italic", fontSize: 80 }}>toneladas por ano</div>
    </div>
  );
};

export const OrigemAspirina: React.FC = () => {
  const f = useCurrentFrame();
  const C = CENAS;
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <Papel />
      {/* 1. gancho: o comprimido nasce na árvore */}
      <Cena de={C[0]} ate={C[1]}>
        <AbsoluteFill>
          <Img
            src={staticFile("aspirina/img/salgueiro2.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "62% 50%",
              filter: "grayscale(1) contrast(1.2) brightness(0.8)",
              transform: `scale(${1.6 - 0.45 * P(f, 0, C[1])})`,
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(rgba(10,8,6,0.6), rgba(10,8,6,0.1) 45%, rgba(10,8,6,0.6))",
            }}
          />
        </AbsoluteFill>
        <Comprimido x={540} y={1250} at={0} r={170} s={1 - 0.55 * P(f, 30, C[1])} />
        <Legenda y={420} cor="#f4efe6" />
      </Cena>
      {/* 2. o salgueiro recortado */}
      <Cena de={C[1]} ate={C[2]}>
        <Foto src="aspirina/img/salgueiro2.jpg" x={540} y={1150} w={880} h={640} at={C[1]} rot={-3} pos="62% 50%" />
        <Fita x={300} y={830} rot={-14} />
        <Fita x={800} y={830} rot={10} />
        <Etiqueta x={700} y={1500} at={C[1] + 8} rot={3}>
          Salix alba · salgueiro
        </Etiqueta>
        <Folhas at={S.folhas - 6} />
        <Legenda />
      </Cena>
      {/* 3. a carta de Edward Stone */}
      <Cena de={C[2]} ate={C[3]}>
        <Carta at={C[2] + 2} />
        <Ano x={270} y={720} at={S.a1763} txt="1763" />
        <Etiqueta x={560} y={1640} at={S.stone} rot={-2}>
          Edward Stone · padre inglês
        </Etiqueta>
        <Etiqueta x={760} y={760} at={S.sociedade} rot={5} cor={VERM}>
          Royal Society
        </Etiqueta>
        <Legenda />
      </Cena>
      {/* 4. salicina, ácido salicílico e o estômago */}
      <Cena de={C[3]} ate={C[4]}>
        <Ano x={270} y={720} at={S.a1828} txt="1828" />
        {f < S.atacava - 6 && (
          <>
            <Etiqueta x={560} y={1650} at={S.salicina} rot={-3}>
              salicina → ácido salicílico
            </Etiqueta>
            <Molecula src="aspirina/img/salicilico.png" x={560} y={1180} w={520} at={S.salicilico - 8} rot={-6} />
          </>
        )}
        <Estomago at={S.atacava - 6} />
        <Legenda />
      </Cena>
      {/* 5. Felix Hoffmann, Bayer, 1897 */}
      <Cena de={C[4]} ate={C[5]}>
        <Foto src="aspirina/img/protocolo.jpg" x={760} y={1250} w={460} h={630} at={S.bayer} rot={5} pos="50% 0%" zoom={0.02} cor />
        <Foto src="aspirina/img/hoffmann.jpg" x={320} y={1150} w={460} h={580} at={C[4]} rot={-4} pos="50% 20%" />
        <Fita x={320} y={870} rot={-6} />
        <Ano x={780} y={760} at={S.a1897} txt="1897" />
        <Etiqueta x={320} y={1480} at={S.hoffmann} rot={2}>
          Felix Hoffmann · Bayer
        </Etiqueta>
        <Molecula src="aspirina/img/aas.png" x={560} y={1730} w={340} at={S.acetil - 10} rot={-4} />
        <Legenda />
      </Cena>
      {/* 6. 1899: Aspirin, e o "spir" da spiraea */}
      <Cena de={C[5]} ate={C[6]}>
        {f < S.aspirina - 4 && (
          <Foto src="aspirina/img/anuncio_1918.png" x={540} y={1150} w={520} h={690} at={C[5]} rot={3} pos="50% 0%" zoom={0.02} />
        )}
        <Ano x={540} y={610} at={S.a1899} txt="1899" size={130} />
        <Nome />
        <Foto src="aspirina/img/frasco.jpg" x={290} y={1360} w={360} h={500} at={S.aspirina} rot={-5} pos="50% 50%" cor zoom={0.02} />
        <Foto src="aspirina/img/spiraea.jpg" x={780} y={1360} w={380} h={500} at={S.spiraea - 4} rot={4} pos="50% 40%" />
        <Etiqueta x={780} y={1650} at={S.spiraea} rot={-3} cor={VERM}>
          spiraea
        </Etiqueta>
        <Legenda />
      </Cena>
      {/* 7. John Vane, 1971, as prostaglandinas e o Nobel */}
      <Cena de={C[6]} ate={C[7]}>
        <Ano x={540} y={640} at={S.a1971} txt="1971" size={150} />
        <Foto src="aspirina/img/vane.jpg" x={290} y={1060} w={420} h={560} at={S.vane - 6} rot={-4} pos="50% 25%" />
        <Fita x={290} y={790} rot={-6} />
        <Bloqueio />
        <Medalha at={S.nobel - 4} />
        <Legenda y={360} />
      </Cena>
      {/* 8. e ao lado dele: Sérgio Henrique Ferreira */}
      <Cena de={C[7]} ate={C[8]}>
        <Foto src="aspirina/img/vane.jpg" x={300} y={1150} w={420} h={550} at={C[7]} rot={-5} pos="50% 25%" />
        <Retrato x={790} y={1150} at={S.conhecido - 4} s={0.85} />
        <Etiqueta x={790} y={830} at={S.conhecido + 6} rot={5} cor={VERM}>
          de novo ele!
        </Etiqueta>
        <Etiqueta x={560} y={1560} at={S.sergio} rot={-2}>
          Sérgio Henrique Ferreira · brasileiro
        </Etiqueta>
        <Legenda />
      </Cena>
      {/* 9. hoje: 40 mil toneladas; e tudo começou numa árvore */}
      <Cena de={C[8]} ate={C[9]}>
        {f < S.tudo - 6 ? (
          <>
            <Contador />
            <Carimbo x={540} y={1560} at={S.quarenta + 30} texto="POR ANO" rot={-8} size={70} />
          </>
        ) : (
          <>
            <Foto src="aspirina/img/salgueiro2.jpg" x={540} y={1180} w={820} h={600} at={S.tudo - 6} rot={-2} pos="62% 50%" />
            <Comprimido x={540} y={1180} at={S.tudo + 6} r={110} />
          </>
        )}
        <Legenda />
      </Cena>
      {/* 10. me siga */}
      <Cena de={C[9]} ate={C[10]}>
        <Legenda y={860} />
        <Etiqueta x={540} y={1120} at={S.siga + 10} rot={-2} cor={VERM}>
          A origem dos remédios · #2
        </Etiqueta>
      </Cena>
      <Audio src={staticFile("aspirina/narracao.mp3")} />
      {/* trilha "Documentary Piano" de leberch (Pixabay), a mesma do #1, baixa embaixo da voz */}
      <Audio
        src={staticFile("captopril/musica_piano.mp3")}
        volume={(fr) => 0.07 * (1 - P(fr, DURATION_ASPIRINA - 60, DURATION_ASPIRINA))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      {/* 11. tela final */}
      <Cena de={S.final} ate={DURATION_ASPIRINA}>
        {["Consulte um", "profissional de saúde", "para orientações."].map((l, i) => {
          const k = it(f, S.final + 4 + i * 8, S.final + 18 + i * 8, 0, 1, OUT);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 760 + i * 120,
                width: W,
                textAlign: "center",
                fontFamily: SERIF,
                fontStyle: i === 1 ? "italic" : "normal",
                fontSize: i === 1 ? 110 : 90,
                color: i === 1 ? VERM : TINTA,
                opacity: k,
                transform: `translateY(${(1 - k) * 30}px)`,
              }}
            >
              {l}
            </div>
          );
        })}
      </Cena>
    </AbsoluteFill>
  );
};
