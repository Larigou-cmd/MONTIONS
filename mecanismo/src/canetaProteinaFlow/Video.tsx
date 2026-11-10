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

// "Tá usando caneta? Por que você precisa de mais proteína", boneco de palito (Shorts), formato "você dentro da cena".
// 9 clipes do Google Flow (prompts em roteiros/caneta_proteina_musculo.md) + narração do OpenArt
// (tempos de cada palavra em fala.json, em quadros). Mesma montagem da cafeína: cada clipe
// é esticado ou acelerado até caber no trecho da fala; se sobrar tempo, congela com zoom lento.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PAL = fala as { w: string; f: number }[];

// a voz termina em 79,4 s; o "Me siga" é só tela, com a trilha
const FIM_FALA = 79.4;
const INICIO_SIGA = 79.7;
const SIGA = s(3.2);
const FINAL = 105;
export const DURATION_CANETA_PROTEINA_FLOW = s(INICIO_SIGA) + SIGA + FINAL;

const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";
const K = "sfxkit/sfx-kit-main/sounds/";

type Trecho = {
  de: number;
  ate: number;
  clipe: number;
  c0: number;
  c1: number;
};
// início de cada trecho = primeira palavra dele na fala
const TRECHOS: Trecho[] = [
  { de: 0, ate: 5.47, clipe: 1, c0: 0, c1: 10 }, // a canetinha e o prato pequeno
  { de: 5.47, ate: 12.97, clipe: 2, c0: 0, c1: 10 }, // sem fome, o peso cai
  { de: 12.97, ate: 23.83, clipe: 3, c0: 0, c1: 10 }, // 1 de cada 4 kg é massa magra
  { de: 23.83, ate: 31.93, clipe: 4, c0: 0, c1: 10 }, // falta proteína: o corpo busca no músculo
  { de: 31.93, ate: 42.77, clipe: 5, c0: 0, c1: 10 }, // mais fraca + os dois pratos
  { de: 42.77, ate: 52.4, clipe: 6, c0: 0, c1: 10 }, // proteína em toda refeição
  { de: 52.4, ate: 62.23, clipe: 7, c0: 0, c1: 10 }, // treino de força
  { de: 62.23, ate: 70.03, clipe: 8, c0: 0, c1: 10 }, // comece pela proteína (pagamento do prato)
  { de: 70.03, ate: INICIO_SIGA, clipe: 9, c0: 0, c1: 10 }, // a farmacêutica e o médico ou nutricionista
];

// [início, fim, texto, altura (padrão 150), "e" = canto esquerdo]
const ROTULOS: [number, number, string, number?, string?][] = [
  [17.4, 23.6, "1 de cada 4 kg\n= massa magra", 110],
  [27.5, 31.7, "pode faltar\nproteína", 110],
  [39.5, 42.6, "comer menos ou\nmudar o prato?", 110],
  [46.0, 52.2, "proteína em\ntoda refeição", 110],
  [53.3, 62.0, "treino de força:\n2x por semana ou mais", 110],
  [64.9, 69.9, "comece pela\nproteína", 1500],
];

const Clipe: React.FC<{ t: Trecho }> = ({ t }) => {
  const f = useCurrentFrame();
  const dur = t.ate - t.de;
  const len = t.c1 - t.c0;
  const rate = Math.max(0.5, len / dur);
  const tocando = len / rate;
  const parado = f >= s(tocando);
  const zoom = 1 + interpolate(f, [0, s(dur)], [0, parado ? 0.1 : 0.04], clamp);
  const entra = interpolate(f, [0, 6], [0, 1], clamp);
  const video = (
    <OffthreadVideo
      src={staticFile(`canetaProteinaFlow/c${t.clipe}.mp4`)}
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

// rótulo sem fundo: letra à mão (Caveat) em lilás escuro com halo creme da cor do papel
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
      <div
        style={{
          fontFamily: "Caveat, cursive",
          fontWeight: 700,
          fontSize: r[4] === "e" ? 90 : r[2].length > 18 ? 84 : 96,
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
        src={staticFile("canetaProteinaFlow/logo.jpg")}
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
  const a = new Array(DURATION_CANETA_PROTEINA_FLOW + 1).fill(0);
  PAL.forEach((p, i) => {
    const fim =
      i + 1 < PAL.length ? Math.min(PAL[i + 1].f, p.f + 24) : p.f + 18;
    for (let fr = p.f; fr < fim + 6; fr++) a[fr] = 1;
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

export const VideoCanetaProteinaFlow: React.FC = () => {
  const f = useCurrentFrame();
  const total = DURATION_CANETA_PROTEINA_FLOW;
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
      <Audio src={staticFile("canetaProteinaFlow/narracao.mp3")} />
      <Audio
        src={staticFile("canetaProteinaFlow/musica.wav")}
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

// capa: quadro de um clipe (escolhido depois de ver os clipes), reduzido e
// encaixado embaixo; título à mão em lilás no alto; tudo entre y 300 e 1620
const PAPEL_CAPA = "rgb(243,231,204)";
const HALO = "0 0 4px " + PAPEL_CAPA + ", 0 0 10px " + PAPEL_CAPA;
export const CapaCanetaProteinaFlow: React.FC = () => (
  <AbsoluteFill style={{ background: PAPEL_CAPA }}>
    <Img
      src={staticFile("canetaProteinaFlow/capa_fundo.png")}
      style={{
        position: "absolute",
        width: 640,
        height: 1138,
        left: (1080 - 640) / 2,
        top: 560,
        // bordas esfumadas para o quadro sumir no papel
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 14%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 90%, transparent 100%)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
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
      Tá usando caneta para emagrecer?
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
      Você precisa de
      <br />
      <span style={{ color: "#8a5cc4" }}>mais proteína</span>
    </div>
  </AbsoluteFill>
);
