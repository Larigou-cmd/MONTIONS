import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import fala from "./fala.json";
import "../fonts";
import { MeSiga, TelaFinal } from "../ondansetronaFlow/Video";
import { Fundo, Legenda, Titulo } from "./Estilo";
import { IDX, Molecula3D } from "./Molecula3D";

// "A codeína vira morfina no seu fígado" — estilo molécula neon (aprovado em 26/11/2026).
// PRÉVIA SEM VOZ: os tempos de cada cena são estimados pelo número de palavras (2,6 por segundo).
// Quando a narração chegar, INICIOS passa a vir do fala.json.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AMARELO = "#ffc94d";
const VERDE = "#3dff8f";
const VERMELHO = "#ff4d6d";
const LILAS = "#c6ff3d";
const BRANCO = "#f3f0fa";

// Cada cena começa na palavra da narração dela (fala.json, 30 fps; voz "Laris" no ElevenLabs v4, 70,7 s):
// Olha 215 · Com 536 · Só que 751 · E é aqui 1038 · Em algumas 1225 · Por isso 1546 · Se a codeína 1743 · Me siga 1985
const INICIOS = [0, 210, 530, 745, 1032, 1220, 1540, 1738];
const CORTE = 1980;
const SIGA = 145; // o "Me siga" falado vai até ~2121
const FINAL = 90;
const durCena = (i: number) => (i + 1 < INICIOS.length ? INICIOS[i + 1] : CORTE) - INICIOS[i];
export const DURATION_CODEINA_PREVIA = CORTE + SIGA + FINAL;

const MOL_TOP = 380;
const MOL_H = 1040;
const ent = (f: number, a = 0, b = 12) => interpolate(f, [a, b], [0, 1], clamp);

// 1 · gancho (refeito em 27/11/2026 depois do Virality Predictor: gancho 32/100, visual 38%).
// Tudo se mexe desde o 1º quadro, sem 3D: o comprimido salta, "NÃO TIRA" bate com tremida,
// e em "morfina" o comprimido racha e a palavra MORFINA sai de dentro dele.
// Palavras: A 0 · codeína 4 · não 45 · tira 57 · a sua dor 72 · Quem tira 94 · morfina 131 · fígado 160
const pulo = (f: number, ini: number, dur = 10) => {
  const t = interpolate(f, [ini, ini + dur * 0.6, ini + dur], [0, 1.18, 1], clamp);
  return f < ini ? 0 : t;
};
const Capsula: React.FC<{ metade: "esq" | "dir" }> = ({ metade }) => (
  <g clipPath={`url(#corte-${metade})`}>
    <rect
      x={-170}
      y={-62}
      width={340}
      height={124}
      rx={62}
      fill={metade === "esq" ? "#e9e6f2" : "#0f2e22"}
      stroke={metade === "esq" ? "none" : LILAS}
      strokeWidth={6}
    />
    {metade === "esq" && (
      <ellipse cx={-90} cy={-30} rx={50} ry={12} fill="#fff" opacity={0.7} />
    )}
  </g>
);

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  // tremida curta quando bate o "NÃO TIRA" e quando o comprimido racha
  const tremida = (ini: number) =>
    f >= ini && f < ini + 12 ? Math.sin((f - ini) * 2.6) * 14 * (1 - (f - ini) / 12) : 0;
  const dx = tremida(45) + tremida(128);
  const zoom = 1 + 0.06 * interpolate(f, [0, 210], [0, 1], clamp);
  const kA = pulo(f, 2, 9);
  const kNao = pulo(f, 45, 9);
  const kDor = pulo(f, 72, 9);
  const flash = interpolate(f, [45, 47, 58], [0, 0.35, 0], clamp);
  const kCap = pulo(f, 0, 10);
  const racha = interpolate(f, [126, 140], [0, 1], clamp);
  const kMorf = pulo(f, 131, 12);
  const brilho = interpolate(f, [128, 134, 175], [0, 1, 0.25], clamp);
  const kQuem = ent(f, 94, 102);
  const kFig = ent(f, 158, 168);
  const balanco = Math.sin(f * 0.12) * 8;
  return (
    <AbsoluteFill style={{ transform: `translateX(${dx}px) scale(${zoom})` }}>
      <AbsoluteFill style={{ background: VERMELHO, opacity: flash }} />
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1.05,
          letterSpacing: -2,
          color: BRANCO,
        }}
      >
        <div style={{ transform: `scale(${kA})`, opacity: Math.min(1, kA * 2) }}>A CODEÍNA</div>
        <div
          style={{
            color: VERMELHO,
            textShadow: `0 0 36px ${VERMELHO}aa`,
            whiteSpace: "nowrap",
            fontSize: 128,
            transform: `scale(${kNao})`,
            opacity: Math.min(1, kNao * 2),
          }}
        >
          NÃO TIRA
        </div>
        <div style={{ transform: `scale(${kDor})`, opacity: Math.min(1, kDor * 2) }}>A SUA DOR</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <clipPath id="corte-esq">
            <rect x={-200} y={-100} width={200} height={200} />
          </clipPath>
          <clipPath id="corte-dir">
            <rect x={0} y={-100} width={200} height={200} />
          </clipPath>
          <radialGradient id="estouro">
            <stop offset="0%" stopColor={VERDE} stopOpacity={0.9} />
            <stop offset="100%" stopColor={VERDE} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={540} cy={920} r={120 + 380 * racha} fill="url(#estouro)" opacity={brilho} />
        <g transform={`translate(540 920) scale(${kCap}) rotate(${-18 + balanco * (1 - racha)})`}>
          <g opacity={1 - interpolate(racha, [0.4, 1], [0, 1], clamp)} transform={`translate(${-460 * racha} ${260 * racha}) rotate(${-70 * racha})`}>
            <Capsula metade="esq" />
          </g>
          <g opacity={1 - interpolate(racha, [0.4, 1], [0, 1], clamp)} transform={`translate(${460 * racha} ${260 * racha}) rotate(${70 * racha})`}>
            <Capsula metade="dir" />
          </g>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: -3,
          color: VERDE,
          textShadow: `0 0 40px ${VERDE}, 0 0 80px ${VERDE}88`,
          transform: `scale(${kMorf})`,
          opacity: Math.min(1, kMorf * 2),
        }}
      >
        MORFINA
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 60,
          color: BRANCO,
          opacity: kQuem,
          transform: `translateY(${(1 - kQuem) * 24}px)`,
        }}
      >
        quem tira é a morfina
        <div
          style={{
            fontSize: 50,
            fontWeight: 600,
            marginTop: 14,
            color: "#cfe8dc",
            opacity: kFig,
          }}
        >
          que o seu <span style={{ color: LILAS }}>fígado</span> fabrica com ela
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · a codeína com o metil aceso
const Metil: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ top: MOL_TOP, height: MOL_H, opacity: ent(f, 0, 14) }}
      >
        <Molecula3D
          width={1080}
          height={MOL_H}
          rot={0.35 + 0.25 * Math.sin(f * 0.02)}
          zoom={0.74}
          destaques={[
            {
              atomos: [...IDX.metil, IDX.oxigenio],
              cor: AMARELO,
              forca: ent(f, 170, 194), // "um carbono com três hidrogênios"
            },
          ]}
        />
      </AbsoluteFill>
      <Titulo a="CODEÍNA" b="≈ MORFINA" cor={AMARELO} />
      <Legenda texto="a diferença é um pedacinho só: o metil" chave="o metil" />
    </AbsoluteFill>
  );
};

// 3 · tenta entrar no receptor e não encaixa
const Receptor: React.FC = () => {
  const f = useCurrentFrame();
  const tentativa = (t: number) => {
    const ida = interpolate(t, [0, 26], [0, 1], clamp);
    const volta = interpolate(t, [26, 44], [0, 1], clamp);
    return ida * (1 - 0.75 * volta);
  };
  const y = -2.6 * Math.max(tentativa(f - 45), tentativa(f - 155));
  const batida = [71, 181] // "encaixa mal" · "quase não alivia".some((b) => f >= b && f < b + 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ top: MOL_TOP - 120, height: MOL_H }}>
        <Molecula3D
          width={1080}
          height={MOL_H}
          rot={0.35 + 0.2 * Math.sin(f * 0.02)}
          zoom={0.62}
          desloc={[0, y]}
          destaques={[
            { atomos: [...IDX.metil, IDX.oxigenio], cor: AMARELO, forca: 1 },
          ]}
        />
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path
          d="M250,1170 L250,1330 Q250,1400 320,1400 L760,1400 Q830,1400 830,1330 L830,1170"
          fill="none"
          stroke={batida ? VERMELHO : LILAS}
          strokeWidth={14}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 18px ${batida ? VERMELHO : LILAS})`,
          }}
        />
        <text
          x={540}
          y={1370}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          fontSize={40}
          fill="#cfe8dc"
        >
          receptor da dor
        </text>
      </svg>
      <Titulo a="ENCAIXA" b="MAL" cor={VERMELHO} />
      <Legenda
        texto="sozinha, ela quase não alivia nada"
        chave="quase não alivia"
      />
    </AbsoluteFill>
  );
};

// 4 · o fígado (CYP2D6) arranca o metil: virou morfina
const Troca: React.FC = () => {
  const f = useCurrentFrame();
  const corte = interpolate(f, [140, 200], [0, 1], clamp); // "arranca esse metil"
  const virou = ent(f, 250, 262); // "virou morfina"
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ top: MOL_TOP, height: MOL_H }}>
        <Molecula3D
          width={1080}
          height={MOL_H}
          rot={0.35 + 0.25 * Math.sin((f + 300) * 0.02)}
          zoom={0.74}
          corte={corte}
          destaques={
            corte < 0.3
              ? [
                  {
                    atomos: [...IDX.metil, IDX.oxigenio],
                    cor: AMARELO,
                    forca: 1,
                  },
                ]
              : [
                  {
                    atomos: [IDX.oxigenio],
                    cor: VERDE,
                    forca: ent(f, 190, 215),
                  },
                ]
          }
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: ent(f, 55, 65) * (1 - virou),
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 46,
            color: "#04120f",
            background: AMARELO,
            padding: "10px 28px",
            borderRadius: 40,
            boxShadow: `0 0 30px ${AMARELO}99`,
          }}
        >
          enzima do fígado · CYP2D6
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: virou,
          transform: `scale(${0.7 + 0.3 * virou})`,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: 64,
            color: VERDE,
            border: `4px solid ${VERDE}`,
            padding: "6px 34px",
            borderRadius: 50,
            textShadow: `0 0 24px ${VERDE}`,
            boxShadow: `0 0 30px ${VERDE}66`,
          }}
        >
          MORFINA
        </div>
      </div>
      <Titulo a="O FÍGADO" b="TROCA A PEÇA" cor={VERDE} />
      <Legenda texto="arranca o metil e deixa só o OH" chave="só o OH" />
    </AbsoluteFill>
  );
};

// 5 · três velocidades da enzima
const Velocidades: React.FC = () => {
  const f = useCurrentFrame();
  const linhas = [
    { nome: "lenta", vel: 0.25, cor: AMARELO },
    { nome: "normal", vel: 0.6, cor: LILAS },
    { nome: "rápida demais", vel: 1, cor: VERMELHO },
  ];
  return (
    <AbsoluteFill>
      {linhas.map((l, i) => {
        const k = ent(f, 8 + i * 10, 20 + i * 10);
        const y = 560 + i * 250;
        const larg =
          620 *
          l.vel *
          interpolate(f, [20 + i * 10, 70 + i * 10], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: 130,
              right: 130,
              opacity: k,
            }}
          >
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 48,
                color: l.cor,
                marginBottom: 16,
              }}
            >
              {l.nome}
            </div>
            <div
              style={{ height: 36, borderRadius: 18, background: "#ffffff14" }}
            >
              <div
                style={{
                  width: larg,
                  height: 36,
                  borderRadius: 18,
                  background: l.cor,
                  boxShadow: `0 0 24px ${l.cor}aa`,
                }}
              />
            </div>
          </div>
        );
      })}
      <Titulo a="NÃO É IGUAL EM" b="TODO MUNDO" cor={LILAS} />
      <Legenda
        texto="a enzima muda de pessoa para pessoa"
        chave="de pessoa para pessoa"
      />
    </AbsoluteFill>
  );
};

// 6 · pouca morfina × morfina demais
const Bolinhas: React.FC<{
  n: number;
  x: number;
  cor: string;
  f: number;
  semente: number;
}> = ({ n, x, cor, f, semente }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: number) => {
        const v = Math.sin((i + semente) * 91.7 + k * 13.3) * 43758.5453;
        return v - Math.floor(v);
      };
      const k = ent(f, 10 + i * 2, 20 + i * 2);
      const px = x + (r(1) - 0.5) * 300 + Math.sin(f * 0.05 + i) * 8;
      const py = 760 + r(2) * 440 + Math.cos(f * 0.04 + i) * 8;
      return (
        <circle
          key={i}
          cx={px}
          cy={py}
          r={16 * k}
          fill={cor}
          style={{ filter: `drop-shadow(0 0 10px ${cor})` }}
        />
      );
    })}
  </>
);
const PoucaMuita: React.FC = () => {
  const f = useCurrentFrame();
  const alerta = f > 200; // "sobra morfina"
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <line
          x1={540}
          x2={540}
          y1={640}
          y2={1300}
          stroke="#ffffff22"
          strokeWidth={3}
        />
        <Bolinhas n={4} x={290} cor={VERDE} f={f} semente={1} />
        {f > s(4.5) && (
          <Bolinhas
            n={34}
            x={790}
            cor={alerta ? VERMELHO : VERDE}
            f={f - s(4.5)}
            semente={7}
          />
        )}
      </svg>
      {[
        {
          x: 60,
          t: "ENZIMA LENTA",
          sub: "quase sem efeito",
          cor: AMARELO,
          k: ent(f, 6, 16),
        },
        {
          x: 560,
          t: "RÁPIDA DEMAIS",
          sub: "sono pesado · respiração fraca",
          cor: VERMELHO,
          k: ent(f, s(4.5), s(4.5) + 12),
        },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            width: 460,
            top: 600,
            textAlign: "center",
            opacity: c.k,
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 46,
              color: c.cor,
            }}
          >
            {c.t}
          </div>
          <div
            style={{
              position: "absolute",
              top: 640,
              left: 0,
              right: 0,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 40,
              color: BRANCO,
            }}
          >
            {c.sub}
          </div>
        </div>
      ))}
      <Titulo a="POUCA MORFINA ×" b="MORFINA DEMAIS" cor={VERMELHO} />
      <Legenda
        texto="em algumas pessoas, sobra morfina no sangue"
        chave="sobra morfina"
      />
    </AbsoluteFill>
  );
};

// 7 · para quem não é indicada
const NaoIndicada: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {["crianças menores\nde 12 anos", "quem está\namamentando"].map(
        (t, i) => {
          const k = ent(f, 75 + i * 90, 89 + i * 90); // "crianças" · "amamentando"
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 600 + i * 330,
                left: 140,
                right: 140,
                height: 250,
                border: `5px solid ${VERMELHO}`,
                borderRadius: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                whiteSpace: "pre-line",
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: 60,
                lineHeight: 1.1,
                color: BRANCO,
                background: "#ff4d6d14",
                boxShadow: `0 0 34px ${VERMELHO}55`,
                opacity: k,
                transform: `scale(${0.9 + 0.1 * k})`,
              }}
            >
              {t}
            </div>
          );
        },
      )}
      <Titulo a="NÃO É" b="INDICADA" cor={VERMELHO} />
      <Legenda
        texto="por isso a codeína não é indicada para"
        chave="não é indicada"
      />
    </AbsoluteFill>
  );
};

// 8 · chamada
const Chamada: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ top: MOL_TOP + 200, height: 760, opacity: ent(f, 0, 14) }}
      >
        <Molecula3D
          width={1080}
          height={760}
          rot={0.35 + 0.25 * Math.sin(f * 0.02)}
          zoom={0.62}
          corte={1}
          destaques={[{ atomos: [IDX.oxigenio], cor: VERDE, forca: 0.8 }]}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 110,
          right: 110,
          padding: "26px 34px",
          borderRadius: 34,
          background: "#ffffff10",
          border: `3px solid ${LILAS}`,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 48,
          lineHeight: 1.25,
          color: BRANCO,
          textAlign: "center",
          opacity: ent(f, 14, 26),
        }}
      >
        "a codeína nunca funcionou em mim"
        <br />
        ou "ela me derrubou"
      </div>
      <Titulo a="CONTE AO" b="MÉDICO" cor={VERDE} c="E AO FARMACÊUTICO" />
      <Legenda texto="manda pra quem toma remédio com codeína" chave="manda" />
    </AbsoluteFill>
  );
};

const CENAS = [
  Gancho,
  Metil,
  Receptor,
  Troca,
  Velocidades,
  PoucaMuita,
  NaoIndicada,
  Chamada,
];

export const VideoCodeinaPrevia: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    {CENAS.map((C, i) => (
      <Sequence key={i} from={INICIOS[i]} durationInFrames={durCena(i)}>
        <C />
      </Sequence>
    ))}
    <Sequence from={CORTE} durationInFrames={SIGA}>
      <MeSiga />
    </Sequence>
    <Sequence from={CORTE + SIGA} durationInFrames={FINAL}>
      <TelaFinal />
    </Sequence>
  </AbsoluteFill>
);

// ===== VERSÃO COM A NARRAÇÃO =====
const K = "sfxkit/sfx-kit-main/sounds/";
const FALANDO = (() => {
  const w = fala as { w: string; f: number }[];
  const a = new Array(DURATION_CODEINA_PREVIA + 1).fill(0);
  w.forEach((p, i) => {
    const fim = i + 1 < w.length && w[i + 1].f - p.f < 15 ? w[i + 1].f : p.f + 14;
    for (let fr = p.f; fr < fim + 4; fr++) a[fr] = 1;
  });
  return a.map((_, i) => {
    let soma = 0,
      n = 0;
    for (let j = i - 8; j <= i + 8; j++)
      if (a[j] !== undefined) {
        soma += a[j];
        n++;
      }
    return soma / n;
  });
})();

// [segundo, arquivo do Openverse, volume, duração] — baixos e abaixando sob a voz
const SFX: [number, string, number, number][] = [
  [0.0, "pop", 0.3, 0.4], // o comprimido salta
  [1.5, "grave_curto", 0.24, 1.2], // "NÃO TIRA" bate
  [4.25, "pop", 0.34, 0.4], // o comprimido racha
  [4.35, "ding", 0.18, 1.2], // MORFINA sai de dentro
  [12.7, "ding", 0.14, 1.0], // o metil acende
  [20.0, "grave_curto", 0.16, 0.9], // bate no receptor
  [23.7, "grave_curto", 0.14, 0.9], // bate de novo
  [29.5, "pop", 0.2, 0.4], // a enzima arranca o metil
  [33.2, "ding", 0.16, 1.2], // virou morfina
  [47.3, "grave_curto", 0.14, 1.4], // sobra morfina
  [53.8, "carimbo", 0.22, 0.6], // crianças
  [56.8, "carimbo", 0.22, 0.6], // amamentando
];

export const VideoCodeina: React.FC = () => (
  <AbsoluteFill>
    <VideoCodeinaPrevia />
    <Audio src={staticFile("codeinaMolecula/narracao.mp3")} />
    {SFX.map(([ini, arq, vol, dur], i) => (
      <Sequence key={"sfx" + i} from={s(ini)} durationInFrames={s(dur)}>
        <Audio
          src={staticFile("sfx_openverse/" + arq + ".mp3")}
          volume={(fr) => {
            const d = s(dur);
            const e = Math.min(12, Math.floor(d / 4));
            const fade = interpolate(fr, [0, e + 1, d - e - 1, d], [0, 1, 1, 0], clamp);
            return vol * fade * (1 - 0.6 * (FALANDO[s(ini) + fr] ?? 0));
          }}
        />
      </Sequence>
    ))}
    {INICIOS.slice(1).map((de, i) => (
      <Sequence key={"w" + i} from={de - 4} durationInFrames={30}>
        <Audio src={staticFile(K + "whooshes/whoosh-medium-soft.wav")} volume={0.12} />
      </Sequence>
    ))}
    <Sequence from={CORTE + SIGA + 2} durationInFrames={FINAL - 2}>
      <Audio src={staticFile(K + "logo-stings/sting-bright-short.wav")} volume={0.7} />
    </Sequence>
  </AbsoluteFill>
);

// ===== CAPA 1080×1920 (tudo entre y≈300 e 1620, recorte 3:4 do TikTok/Instagram) =====
export const CapaCodeina: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontWeight: 900,
        fontSize: 118,
        lineHeight: 1.02,
        letterSpacing: -3,
        color: BRANCO,
      }}
    >
      A CODEÍNA
      <br />
      <span style={{ color: VERDE, textShadow: `0 0 40px ${VERDE}aa` }}>VIRA MORFINA</span>
      <br />
      <span style={{ fontSize: 76, letterSpacing: -1.5 }}>no seu fígado</span>
    </div>
    <AbsoluteFill style={{ top: 700, height: 820 }}>
      <Molecula3D
        width={1080}
        height={820}
        rot={0.45}
        zoom={0.72}
        corte={0}
        destaques={[{ atomos: [...IDX.metil, IDX.oxigenio], cor: AMARELO, forca: 1 }]}
      />
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: 1480,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
        fontWeight: 800,
        fontSize: 62,
        color: BRANCO,
      }}
    >
      e nem todo mundo <span style={{ color: VERMELHO }}>reage igual</span>
    </div>
  </AbsoluteFill>
);
