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

// "A origem dos remédios #5: a varfarina, do veneno de rato ao remédio" em boneco de palito.
// 9 clipes do Google Flow (prompts em origens/varfarina/prompts_flow.md) + narração da
// Juliana (ElevenLabs, 97,6 s). Mesma montagem da metformina: cada clipe é esticado até o
// trecho da fala; se sobrar tempo, o último quadro congela com zoom lento.
// A narração termina em "Manda para quem toma varfarina" (97,4 s); o Me siga entra depois.
const FPS = 30;
const s = (seg: number) => Math.round(seg * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PAL = fala as [number, number, string][];

const INICIO_SIGA = 97.8;
const SIGA = 90;
const FINAL = 80;
export const DURATION_VARFARINA_ORIGEM = s(INICIO_SIGA) + SIGA + FINAL;

const VERDE = "#3dff8f";
const FUNDO = "#04120f";
const CREME = "#f7f3df";
const K = "sfxkit/sfx-kit-main/sounds/";

// trecho da fala -> clipe (de, ate em segundos do clipe), velocidade mínima 0,5
type Trecho = {
  de: number;
  ate: number;
  clipe: number | string;
  c0: number;
  c1: number;
};
// tempos da fala (s): anos 1920 5,7 · veterinários 14,5 · 1933 24,9 · Lá, Link 37,1 ·
// parte estranha 48,5 · 1951 62,3 · médicos 70,8 · ela age 84,1 · fim 97,4
const TRECHOS: Trecho[] = [
  { de: 0, ate: 5.7, clipe: 1, c0: 0, c1: 10 },
  // o clipe 2 saiu junto com o prompt do 3: só a parte da vaca (0 a 6,4 s)
  { de: 5.7, ate: 14.5, clipe: 2, c0: 0, c1: 6.4 },
  { de: 14.5, ate: 24.9, clipe: 3, c0: 0, c1: 10 },
  // clipe 4 refeito no Flow (c4b): caminhão virado para a direita, andando para a frente.
  // O primeiro (c4) parecia de ré. Só até 8 s: em 8,7 s o caminhão dá uma tremida
  { de: 24.9, ate: 37.1, clipe: "4b", c0: 0, c1: 8.0 },
  // clipe 5 sem o começo (0-3,4 s: o químico derrama o líquido; ela não quer):
  // o químico com a lâmpada (6-10 s) em "Karl Paul Link", depois a lupa (3,5-5,4 s) em "o mofo..."
  { de: 37.1, ate: 41.7, clipe: 5, c0: 6.0, c1: 10 },
  { de: 41.7, ate: 48.5, clipe: 5, c0: 3.5, c1: 5.4 },
  { de: 48.5, ate: 62.3, clipe: 6, c0: 0, c1: 10 },
  // clipe 7 a partir de 4,5 s: antes disso as pernas do marinheiro saem do lençol
  { de: 62.3, ate: 70.8, clipe: 7, c0: 4.5, c1: 10 },
  { de: 70.8, ate: 84.1, clipe: 8, c0: 0, c1: 10 },
  // clipe 9 a partir de 5 s: antes disso o calendário se redesenha sozinho
  { de: 84.1, ate: INICIO_SIGA, clipe: 9, c0: 5.0, c1: 10 },
];

// 4º valor: altura do rótulo (padrão 150); 5º: "e" = canto esquerdo (para fugir do desenho)
const ROTULOS: [number, number, string, number?, string?][] = [
  // gancho escrito na tela (quem assiste sem som)
  [0.1, 5.6, "VENENO DE RATO\nVIROU REMÉDIO?", 230],
  [5.9, 10.0, "1920 · EUA E CANADÁ"],
  [17.1, 20.6, "TREVO-DOCE"],
  [20.6, 24.8, "FENO MOFADO = VENENO"],
  [25.0, 31.0, "1933 · WISCONSIN", 210],
  [37.9, 41.6, "KARL PAUL LINK"],
  [41.8, 44.1, "O MOFO MUDA A MOLÉCULA"],
  [44.2, 48.4, "ANTICOAGULANTE"],
  [53.0, 56.2, "VENENO DE RATO"],
  [56.3, 62.2, "WARF + (cum)ARINA\n= VARFARINA"],
  [62.4, 64.3, "1951"],
  [64.3, 69.4, "RECRUTA DA MARINHA"],
  [69.5, 70.8, "VITAMINA K"],
  [75.8, 80.6, "1954\nVIRA\nREMÉDIO", 150, "e"],
  [80.7, 84.0, "TROMBOSE · EMBOLIA · AVC"],
  [85.2, 89.2, "VITAMINA K"],
  [89.3, 92.4, "NÃO CORTE A VERDURA"],
  [92.5, 96.5, "MESMA QUANTIDADE\nTODO DIA"],
  [96.5, 97.8, "MANDA PARA QUEM TOMA"],
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
      src={staticFile(`varfarinaOrigem/c${t.clipe}.mp4`)}
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
        src={staticFile("varfarinaOrigem/logo.jpg")}
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

// 1 quando a voz está falando (suavizado): serve para abaixar efeitos sob a voz
export const FALANDO = (() => {
  const a = new Array(DURATION_VARFARINA_ORIGEM + 1).fill(0);
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

// efeitos: [início s, arquivo, volume, duração s, a partir de s do arquivo]
const SFX: [number, string, number, number, number?][] = [
  [4.3, "rato_guincho", 0.3, 0.6], // rato olha para a câmera
  [8.8, "gota", 0.22, 0.8], // gotas lilás da vaca
  [10.6, "gota", 0.18, 0.8],
  [13.6, "vaca_mugido", 0.2, 2.2], // na pausa depois de "e não param mais"
  [24.6, "vento_nevasca", 0.14, 12.6, 3], // nevasca
  [24.9, "motor_antigo", 0.1, 12.2, 30], // caminhão antigo (trecho liso do motor)
  [37.2, "ding", 0.2, 1.2], // lâmpada do químico
  [39.4, "vidro_tilintar", 0.14, 1.9], // tubo de ensaio
  [55.6, "rato_guincho", 0.26, 0.6], // rato foge da prateleira
  [69.6, "ding", 0.16, 1.2], // marinheiro fica bem
];

export const VideoVarfarinaOrigem: React.FC = () => {
  const f = useCurrentFrame();
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
      <Audio src={staticFile("varfarinaOrigem/narracao.mp3")} />
      {/* sem música de fundo (pedido dela na prévia 1). Efeitos reais CC0 do Openverse
          (public/sfx_openverse/*.json), baixos e abaixando sob a voz */}
      {SFX.map(([ini, arq, vol, dur, desde], i) => (
        <Sequence key={"sfx" + i} from={s(ini)} durationInFrames={s(dur)}>
          <Audio
            src={staticFile("sfx_openverse/" + arq + ".mp3")}
            startFrom={s(desde ?? 0)}
            volume={(fr) => {
              const g = s(ini) + fr;
              // entrada/saída suaves proporcionais (efeitos curtos têm menos de 1 s)
              const d = s(dur);
              const e = Math.min(12, Math.floor(d / 4));
              const fade = interpolate(
                fr,
                [0, e + 1, d - e - 1, d],
                [0, 1, 1, 0],
                clamp,
              );
              return vol * fade * (1 - 0.6 * (FALANDO[g] ?? 0));
            }}
          />
        </Sequence>
      ))}
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
      {/* Earshot: 3,2 s de silêncio no Me siga e 7 s de cauda no fim. Agora: pop no
          logo, ding no texto e um sting curto na tela final (sem o sting longo) */}
      <Sequence from={CORTE + 3} durationInFrames={30}>
        <Audio src={staticFile("sfx_openverse/pop.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={CORTE + 20} durationInFrames={45}>
        <Audio src={staticFile("sfx_openverse/ding.mp3")} volume={0.18} />
      </Sequence>
      <Sequence from={CORTE + SIGA + 2} durationInFrames={FINAL - 2}>
        <Audio
          src={staticFile(K + "logo-stings/sting-bright-short.wav")}
          volume={0.7}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// capa: o comprimido com o coração saindo da caixa de veneno (clipe 1, 7,5 s), com as
// bordas apagadas no papel (o quadro tem vinheta e não bate com a cor lisa da capa);
// título escrito à mão em lilás no alto; tudo entre y 300 e 1620 (área que o TikTok não corta)
const PAPEL_CAPA = "rgb(246,233,209)";
const HALO = "0 0 4px " + PAPEL_CAPA + ", 0 0 10px " + PAPEL_CAPA;
export const CapaVarfarinaOrigem: React.FC = () => (
  <AbsoluteFill style={{ background: PAPEL_CAPA }}>
    <Img
      src={staticFile("varfarinaOrigem/capa_fundo.png")}
      style={{
        position: "absolute",
        width: 760,
        height: 1351,
        left: (1080 - 760) / 2,
        top: 420,
        WebkitMaskImage:
          "radial-gradient(ellipse 48% 38% at 50% 55%, black 62%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 48% 38% at 50% 55%, black 62%, transparent 100%)",
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
      A origem dos remédios #5
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
      O remédio do coração
      <br />
      que começou como
      <br />
      <span style={{ color: "#8a5cc4", fontSize: 128 }}>VENENO DE RATO</span>
    </div>
  </AbsoluteFill>
);
