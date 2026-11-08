import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import fala from "./fala.json";
import "../fonts";

// "A origem dos remédios #4: a metformina e a flor medieval" em boneco de palito.
// 8 clipes do Google Flow (prompts em origens/metformina/prompts_flow.md) + narração da
// Juliana (ElevenLabs). Mesma montagem do insulinaFlow: cada clipe é esticado até o
// trecho da fala; se sobrar tempo, o último quadro congela com zoom lento.
// A própria narração diz o "Me siga" (a partir de 80,0 s), então a tela do Me siga
// entra junto com a fala, e a trilha só sobe depois que a voz termina.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PAL = fala as [number, number, string][];

const INICIO_SIGA = 79.9;
const FIM_FALA = 84.9;
const SIGA = s(FIM_FALA + 1.6) - s(INICIO_SIGA);
const FINAL = 105;
export const DURATION_METFORMINA_ORIGEM = s(INICIO_SIGA) + SIGA + FINAL;

const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";
const K = "sfxkit/sfx-kit-main/sounds/";

// trecho da fala -> clipe (de, ate em segundos do clipe), velocidade mínima 0,5
type Trecho = {
  de: number;
  ate: number;
  clipe: number;
  c0: number;
  c1: number;
};
// tempos da fala (s): galega 4,8 · 1914 17,7 · 1922 27,0 · Filipinas 40,3 ·
// Sterne 50,9 · primos 63,9 · hoje 70,2 · me siga 80,0
const TRECHOS: Trecho[] = [
  // a flor nasce do comprimido e aparece inteira quando a fala diz "a galega"
  { de: 0, ate: 7.4, clipe: 1, c0: 0, c1: 10 },
  { de: 7.4, ate: 17.7, clipe: 2, c0: 0, c1: 10 },
  { de: 17.7, ate: 27.0, clipe: 3, c0: 0, c1: 10 },
  // clipe 4 reordenado para seguir a fala: criação (0-3,2 s) → "esquecida",
  // a gaveta (5,9-8,6 s; fica preto a partir de 8,8 s) → "a insulina tinha chegado" (3,3-5,9 s)
  { de: 27.0, ate: 34.0, clipe: 4, c0: 0, c1: 3.2 },
  { de: 34.0, ate: 36.5, clipe: 4, c0: 5.9, c1: 8.6 },
  { de: 36.5, ate: 40.3, clipe: 4, c0: 3.3, c1: 5.9 },
  { de: 40.3, ate: 50.9, clipe: 5, c0: 0, c1: 10 },
  { de: 50.9, ate: 63.9, clipe: 6, c0: 0, c1: 10 },
  { de: 63.9, ate: 70.2, clipe: 7, c0: 1, c1: 10 },
  { de: 70.2, ate: INICIO_SIGA, clipe: 8, c0: 0, c1: 10 },
];

// o 4º valor, quando existe, é a altura do rótulo (padrão 230)
// 4º valor: altura do rótulo (padrão 150); 5º: "e" = canto esquerdo (para fugir do desenho)
const ROTULOS: [number, number, string, number?, string?][] = [
  [4.9, 7.3, "GALEGA\n(arruda-\ncaprária)", 230, "e"],
  [7.4, 11.3, "EUROPA MEDIEVAL"],
  [11.4, 12.5, "MUITA SEDE"],
  [12.6, 15.0, "MUITO XIXI"],
  [15.0, 17.6, "= DIABETES"],
  [17.8, 22.0, "1914 · FRANÇA", 545],
  [22.1, 25.4, "GALEGINA"],
  [25.5, 27.0, "TÓXICA!"],
  [27.1, 32.8, "1922 · DUBLIN"],
  [32.9, 34.0, "METFORMINA"],
  [34.0, 36.4, "ESQUECIDA"],
  [36.5, 40.2, "A INSULINA CHEGOU", 1600],
  [44.1, 45.4, "FILIPINAS"],
  [45.4, 48.8, "DR. EUSEBIO GARCIA"],
  [48.9, 50.8, "GLICOSE ↓", 40],
  [52.1, 54.3, "JEAN STERNE"],
  [54.4, 61.1, "1957"],
  // nome francês + tradução juntos (gluco = glicose, phage = que come)
  [61.2, 63.8, "GLUCOPHAGE\n= comedor\nde glicose", 270, "e"],
  [64.0, 66.5, "FENFORMINA · BUFORMINA"],
  [66.6, 68.6, "SAÍRAM DO MERCADO"],
  [68.7, 70.1, "A METFORMINA FICOU"],
  [71.1, 75.9, "ESSENCIAL PARA A OMS"],
  [76.0, 77.8, "GRÁTIS · FARMÁCIA POPULAR"],
  [77.9, 79.8, "TUDO COMEÇOU NUMA FLOR"],
];

const Clipe: React.FC<{ t: Trecho }> = ({ t }) => {
  const f = useCurrentFrame();
  const dur = t.ate - t.de;
  const len = t.c1 - t.c0;
  const rate = Math.max(0.5, len / dur);
  const tocando = len / rate; // segundos de vídeo em movimento
  const parado = f >= s(tocando);
  // zoom lento o tempo todo; mais forte quando o quadro congela
  const zoom = 1 + interpolate(f, [0, s(dur)], [0, parado ? 0.1 : 0.04], clamp);
  const entra = interpolate(f, [0, 6], [0, 1], clamp);
  const video = (
    <OffthreadVideo
      src={staticFile(`metforminaOrigem/c${t.clipe}.mp4`)}
      startFrom={s(t.c0)}
      playbackRate={rate}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
  return (
    <AbsoluteFill style={{ opacity: entra, transform: `scale(${zoom})` }}>
      {parado ? <Freeze frame={s(tocando) - 2}>{video}</Freeze> : video}
    </AbsoluteFill>
  );
};

const Rotulo: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const r = ROTULOS.find(([a, b]) => t >= a && t < b);
  if (!r) return null;
  const pop = interpolate(t - r[0], [0, 0.12, 0.22], [0.6, 1.08, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: r[3] ?? 150,
        left: r[4] === "e" ? 60 : 40,
        right: 40,
        display: "flex",
        justifyContent: r[4] === "e" ? "flex-start" : "center",
      }}
    >
      {/* rótulo sem fundo (pedido dela): só a letra à mão (Caveat) em lilás escuro,
          a cor de destaque dos desenhos, com um contorno creme bem fino, da cor do
          papel, para ler sobre o traço preto sem tampar a cena */}
      <div
        style={{
          fontFamily: "Caveat, cursive",
          fontWeight: 700,
          fontSize: r[4] === "e" ? 70 : r[2].length > 18 ? 80 : 96,
          lineHeight: 1.05,
          color: "#5a3d8a",
          textShadow:
            "0 0 3px #f6f0e2, 0 0 6px #f6f0e2, 0 0 10px #f6f0e2, 0 0 16px #f6f0e2, 0 0 24px rgba(246,240,226,.85)",
          textAlign: r[4] === "e" ? "left" : "center",
          whiteSpace: "pre-line",
          transform: `scale(${pop})`,
        }}
      >
        {r[2]}
      </div>
    </div>
  );
};

const Moldura: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: FUNDO }}>
    <div
      style={{
        position: "absolute",
        inset: 40,
        border: `4px solid ${VERDE}`,
        borderRadius: 34,
        boxShadow:
          "0 0 40px rgba(61,255,143,.35), inset 0 0 40px rgba(61,255,143,.15)",
      }}
    />
    {children}
  </AbsoluteFill>
);

const MeSiga: React.FC = () => {
  const f = useCurrentFrame();
  const logo = interpolate(f, [0, 10, 16], [0.4, 1.08, 1], clamp);
  const t1 = interpolate(f, [8, 20], [0, 1], clamp);
  const t2 = interpolate(f, [16, 30], [0, 1], clamp);
  return (
    <Moldura>
      <Img
        src={staticFile("metforminaOrigem/logo.jpg")}
        style={{
          position: "absolute",
          left: 340,
          top: 430,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `6px solid ${VERDE}`,
          boxShadow: "0 0 50px rgba(61,255,143,.5)",
          transform: `scale(${logo})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 900,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "VTThreeTwoThree, monospace",
          fontSize: 150,
          color: VERDE,
          textShadow: "0 0 24px rgba(61,255,143,.7)",
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
        }}
      >
        ME SIGA
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 120,
          right: 120,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.3,
          color: CREME,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 30}px)`,
        }}
      >
        para mais dicas de farmacologia e curiosidades sobre a área
      </div>
    </Moldura>
  );
};

const TelaFinal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Moldura>
      {["Consulte um", "profissional de saúde", "para orientações."].map(
        (l, i) => {
          const k = interpolate(f, [4 + i * 8, 18 + i * 8], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 760 + i * 110,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "Source Serif Four, serif",
                fontWeight: i === 1 ? 600 : 400,
                fontSize: i === 1 ? 90 : 78,
                color: i === 1 ? VERDE : CREME,
                opacity: k,
                transform: `translateY(${(1 - k) * 40}px)`,
              }}
            >
              {l}
            </div>
          );
        },
      )}
    </Moldura>
  );
};

// trilha: 0,22 nas pausas, 0,09 sob a voz; sobe no final sem voz
const FALANDO = (() => {
  const a = new Array(DURATION_METFORMINA_ORIGEM + 1).fill(0);
  PAL.forEach(([ini, fim]) => {
    for (let fr = s(ini); fr < s(fim) + 6; fr++) a[fr] = 1;
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
const CORTE = s(INICIO_SIGA);
const SOBE = s(FIM_FALA) + 6;
const musica = (fr: number) =>
  0.22 -
  0.13 * (FALANDO[fr] ?? 0) +
  interpolate(fr, [SOBE, SOBE + 20], [0, 0.32], clamp);

export const VideoMetforminaOrigem: React.FC = () => {
  const f = useCurrentFrame();
  const total = DURATION_METFORMINA_ORIGEM;
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {TRECHOS.map((t, i) => (
        <Sequence
          key={i}
          from={s(t.de)}
          durationInFrames={
            i === TRECHOS.length - 1 ? CORTE - s(t.de) : s(t.ate) - s(t.de)
          }
        >
          <Clipe t={t} />
        </Sequence>
      ))}
      <Sequence from={CORTE} durationInFrames={SIGA}>
        <MeSiga />
      </Sequence>
      <Sequence from={CORTE + SIGA} durationInFrames={FINAL}>
        <TelaFinal />
      </Sequence>
      <Rotulo f={f} />
      <Audio src={staticFile("metforminaOrigem/narracao.mp3")} />
      <Audio
        src={staticFile("metforminaOrigem/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          interpolate(fr, [0, 20], [0, 1], clamp) *
          interpolate(fr, [total - 50, total], [1, 0], clamp)
        }
      />
      {TRECHOS.slice(1).map((t, i) => (
        <Sequence key={i} from={s(t.de) - 4} durationInFrames={60}>
          <Audio
            src={staticFile(K + "whooshes/whoosh-medium-soft.wav")}
            volume={0.14}
          />
        </Sequence>
      ))}
      <Sequence from={CORTE} durationInFrames={120}>
        <Audio
          src={staticFile(K + "logo-stings/sting-bright-short.wav")}
          volume={0.3}
        />
      </Sequence>
      <Sequence from={CORTE + SIGA + 2} durationInFrames={FINAL}>
        <Audio
          src={staticFile(K + "logo-stings/sting-airy-long.wav")}
          volume={0.55}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// capa: a galega nascendo do comprimido (quadro do clipe 1) reduzida e encaixada embaixo,
// título escrito à mão em lilás no alto; tudo entre y 300 e 1620 (área que o TikTok não corta)
const PAPEL_CAPA = "rgb(238,231,209)";
const HALO = "0 0 4px " + PAPEL_CAPA + ", 0 0 10px " + PAPEL_CAPA;
export const CapaMetforminaOrigem: React.FC = () => (
  <AbsoluteFill style={{ background: PAPEL_CAPA }}>
    <Img
      src={staticFile("metforminaOrigem/capa_fundo.png")}
      style={{
        position: "absolute",
        width: 640,
        height: 1138,
        left: (1080 - 640) / 2,
        top: 560,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "Caveat, cursive",
        fontWeight: 700,
        color: "#7a62a3",
        fontSize: 58,
        textShadow: HALO,
      }}
    >
      A origem dos remédios #4
    </div>
    <div
      style={{
        position: "absolute",
        top: 372,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: "Caveat, cursive",
        fontWeight: 700,
        color: "#4a2f78",
        fontSize: 108,
        lineHeight: 1.0,
        textShadow: HALO,
      }}
    >
      O remédio do diabetes
      <br />
      que nasceu de uma <span style={{ color: "#8a5cc4" }}>FLOR</span>
    </div>
  </AbsoluteFill>
);
