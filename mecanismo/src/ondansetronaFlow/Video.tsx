import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import fala from "./fala.json";
import "../fonts";

// "Para que serve a ondansetrona?" (boneco de palito, estilo quadrinho do PixVerse feito no Flow Omni 1.2).
// PRÉVIA sem narração: cada clipe ocupa 7,5 s (acelerado para caber). Quando a narração dela chegar,
// os tempos de cada trecho passam a seguir as palavras.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";

const POR_CLIPE = 7.5;
const CENAS: { clipe: string; rotulo: string; top?: number }[] = [
  { clipe: "c1", rotulo: "alarme do enjoo" },
  { clipe: "c2", rotulo: "ONDANSETRONA" },
  { clipe: "c3", rotulo: "serotonina = mensageira" },
  { clipe: "c4", rotulo: "bloqueia o aviso", top: 1030 },
  { clipe: "c5", rotulo: "quimio · rádio · cirurgia" },
  { clipe: "c6", rotulo: "intestino preso\ndor de cabeça" },
  { clipe: "c7", rotulo: "coração · gravidez", top: 170 },
  { clipe: "c8", rotulo: "vendida com receita" },
];
const SIGA = s(3.2);
const FINAL = s(3.5);
const INICIO_SIGA = s(POR_CLIPE * CENAS.length);
export const DURATION_ONDANSETRONA_PREVIA = INICIO_SIGA + SIGA + FINAL;

const Rotulo: React.FC<{ texto: string; top?: number }> = ({ texto, top = 300 }) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [4, 8, 12], [0.6, 1.08, 1], clamp);
  const op = interpolate(f, [4, 7], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: "Caveat, cursive",
          fontWeight: 700,
          fontSize: texto.length > 18 ? 84 : 100,
          lineHeight: 1.0,
          color: "#5a3d8a",
          textShadow: "0 0 3px #f6f0e2, 0 0 6px #f6f0e2, 0 0 10px #f6f0e2, 0 0 16px #f6f0e2, 0 0 24px rgba(246,240,226,.85)",
          textAlign: "center",
          whiteSpace: "pre-line",
          transform: `scale(${pop})`,
          opacity: op,
        }}
      >
        {texto}
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
        boxShadow: "0 0 40px rgba(61,255,143,.35), inset 0 0 40px rgba(61,255,143,.15)",
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
        style={{ position: "absolute", left: 340, top: 430, width: 400, height: 400, borderRadius: "50%", border: `6px solid ${VERDE}`, boxShadow: "0 0 50px rgba(61,255,143,.5)", transform: `scale(${logo})` }}
      />
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", fontFamily: "VTThreeTwoThree, monospace", fontSize: 150, color: VERDE, textShadow: "0 0 24px rgba(61,255,143,.7)", opacity: t1, transform: `translateY(${(1 - t1) * 30}px)` }}>
        ME SIGA
      </div>
      <div style={{ position: "absolute", top: 1080, left: 120, right: 120, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 50, lineHeight: 1.3, color: CREME, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)` }}>
        para mais dicas de farmacologia e curiosidades sobre a área
      </div>
    </Moldura>
  );
};

const TelaFinal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Moldura>
      {["Consulte um", "profissional de saúde", "para orientações."].map((l, i) => {
        const k = interpolate(f, [4 + i * 8, 18 + i * 8], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", top: 760 + i * 110, left: 0, right: 0, textAlign: "center", fontFamily: "Source Serif Four, serif", fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 90 : 78, color: i === 1 ? VERDE : CREME, opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
            {l}
          </div>
        );
      })}
    </Moldura>
  );
};

export const VideoOndansetronaPrevia: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CENAS.map((c, i) => (
      <Sequence key={c.clipe} from={s(i * POR_CLIPE)} durationInFrames={s(POR_CLIPE)}>
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(`ondansetronaFlow/${c.clipe}.mp4`)} muted playbackRate={10 / POR_CLIPE} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        <Rotulo texto={c.rotulo} top={c.top} />
      </Sequence>
    ))}
    <Sequence from={INICIO_SIGA} durationInFrames={SIGA}>
      <MeSiga />
    </Sequence>
    <Sequence from={INICIO_SIGA + SIGA} durationInFrames={FINAL}>
      <TelaFinal />
    </Sequence>
  </AbsoluteFill>
);

// ===== VERSÃO COM A NARRAÇÃO (voz clonada dela "Laris" no ElevenLabs v4, 57,5 s, com o "Me siga" falado) =====
// Cada cena começa na palavra (quadro, 30 fps) tirada do fala.json:
// Esse 0 · É a ondansetrona 155 · Quando 211 · A ondansetrona bloqueia 441 · Por isso 569 ·
// Só que 792 · E tem dois cuidados 1091 · Ela é vendida 1470 · Me siga 1597 · fim da voz ~1724
const INICIOS = [0, 155, 211, 441, 569, 792, 1091, 1470];
const CORTE = 1592;
const SIGA_FALADO = 140; // a tela do Me siga fica até a voz terminar a frase
const FINAL_FALADO = 90; // Earshot: 2,2 s de silêncio no fim com 3,5 s
export const DURATION_ONDANSETRONA = CORTE + SIGA_FALADO + FINAL_FALADO;
const K = "sfxkit/sfx-kit-main/sounds/";

// 1 enquanto a voz fala (palavra até a próxima, se o intervalo for curto), suavizado
const FALANDO = (() => {
  const w = fala as { w: string; f: number }[];
  const a = new Array(DURATION_ONDANSETRONA + 1).fill(0);
  w.forEach((p, i) => {
    const fim = i + 1 < w.length && w[i + 1].f - p.f < 15 ? w[i + 1].f : p.f + 14;
    for (let fr = p.f; fr < fim + 4; fr++) a[fr] = 1;
  });
  return a.map((_, i) => {
    let soma = 0, n = 0;
    for (let j = i - 8; j <= i + 8; j++) if (a[j] !== undefined) { soma += a[j]; n++; }
    return soma / n;
  });
})();

// [segundo, arquivo do Openverse, volume, duração]
const SFX: [number, string, number, number][] = [
  [0.1, "grave_curto", 0.18, 1.6], // abertura: alarme do enjoo
  [3.0, "caneta_clique", 0.22, 0.6], // "desliga" o alarme
  [5.2, "pop", 0.26, 0.4], // ONDANSETRONA
  [13.4, "grave_curto", 0.14, 1.4], // "manda vomitar"
  [15.6, "caneta_clique", 0.2, 0.6], // cadeado na porta
  [17.2, "caneta_clique", 0.18, 0.6], // segundo cadeado
  [27.8, "grave_curto", 0.14, 1.4], // "tem um preço"
  [40.8, "coracao", 0.24, 0.66], // ritmo do coração
  [41.5, "coracao", 0.22, 0.66],
  [46.3, "ding", 0.16, 1.2], // gravidez
  [49.7, "carimbo", 0.24, 0.6], // receita
];

export const VideoOndansetrona: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CENAS.map((c, i) => {
      const de = INICIOS[i];
      const dur = (i + 1 < INICIOS.length ? INICIOS[i + 1] : CORTE) - de;
      const rate = dur > 300 ? 300 / dur : 1; // clipe de 10 s: só desacelera se a fala for mais longa
      return (
        <Sequence key={c.clipe} from={de} durationInFrames={dur}>
          <AbsoluteFill>
            <OffthreadVideo src={staticFile(`ondansetronaFlow/${c.clipe}.mp4`)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
          <Rotulo texto={c.rotulo} top={c.top} />
        </Sequence>
      );
    })}
    <Sequence from={CORTE} durationInFrames={SIGA_FALADO}>
      <MeSiga />
    </Sequence>
    <Sequence from={CORTE + SIGA_FALADO} durationInFrames={FINAL_FALADO}>
      <TelaFinal />
    </Sequence>
    <Audio src={staticFile("ondansetronaFlow/narracao.mp3")} />
    {/* sem música de fundo; efeitos reais do Openverse, baixos e abaixando sob a voz */}
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
    <Sequence from={CORTE + 3} durationInFrames={30}>
      <Audio src={staticFile("sfx_openverse/pop.mp3")} volume={0.3} />
    </Sequence>
    <Sequence from={CORTE + 20} durationInFrames={36}>
      <Audio src={staticFile("sfx_openverse/ding.mp3")} volume={0.1} />
    </Sequence>
    <Sequence from={CORTE + SIGA_FALADO + 2} durationInFrames={FINAL_FALADO - 2}>
      <Audio src={staticFile(K + "logo-stings/sting-bright-short.wav")} volume={0.7} />
    </Sequence>
  </AbsoluteFill>
);

// ===== CAPA (1080x1920; tudo que importa entre y 300 e 1620) =====
export const CapaOndansetrona: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile("ondansetronaFlow/capa_fundo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,18,15,.0) 0%, rgba(4,18,15,.0) 55%, rgba(4,18,15,.85) 78%, rgba(4,18,15,.95) 100%)" }} />
    <div style={{ position: "absolute", top: 330, left: 60, right: 60, textAlign: "center", fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: 120, lineHeight: 1, color: "#5a3d8a", textShadow: "0 0 4px #f6f0e2, 0 0 10px #f6f0e2, 0 0 20px #f6f0e2, 0 0 30px rgba(246,240,226,.9)" }}>
      para que serve a
    </div>
    <div style={{ position: "absolute", top: 1300, left: 60, right: 60, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: 100, letterSpacing: -2, color: VERDE, textShadow: "0 0 30px rgba(61,255,143,.6), 0 4px 0 #04120f" }}>
      ONDANSETRONA?
    </div>
    <div style={{ position: "absolute", top: 1460, left: 60, right: 60, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 52, color: CREME }}>
      o remédio que desliga o enjoo
    </div>
  </AbsoluteFill>
);
