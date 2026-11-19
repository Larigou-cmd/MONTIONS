// Notícias da Farmácia #5 (canetas de GLP-1 e a visão) refeito no estilo colagem Vox do vídeo 80.
// Mesma narração (Juliana, take 1, 88 s) e mesmas fotos livres do Wikimedia Commons (créditos em
// public/noticiaGlp1/brutas/CREDITOS.md). Peças andam "em 2" (12 desenhos/s a 24 fps).
import React from "react";
import falaJson from "./fala.json";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Annotate,
  ColorField,
  CollageFilters,
  CutLetters,
  FilmLook,
  HeadlineStrip,
  PrintCutout,
  STAMP,
  Scraps,
  SourceLine,
  Tape,
  VOX_COLLAGE as C,
  VOX_FONT,
  VoxCamera,
  table,
  type ChipStyle,
} from "../collage";

export const FPS_GLP1_VOX = 24;
const sec = (t: number) => Math.round(t * FPS_GLP1_VOX);
const cut = (n: string) => staticFile(`noticiaGlp1/cut/${n}`);
const foto = (n: string) => staticFile(`noticiaGlp1/brutas/${n}`);

const CHIP = VOX_FONT.sans;
const chips = (offset = 0): ChipStyle[] => {
  const base = [
    { bg: C.ink, fg: C.paper },
    { bg: C.paper, fg: C.red },
    { bg: C.yellow, fg: C.ink },
    { bg: C.red, fg: C.paper },
  ];
  return base.map((_, i) => ({
    ...base[(i + offset) % base.length],
    font: CHIP,
    weight: 900,
  }));
};

/** início de cada cena, em segundos da narração */
const T = [
  0, 5.5, 7.6, 9.4, 18.7, 23.3, 32.2, 42.3, 46.4, 54.8, 62.6, 66.9, 71.9, 79.9,
  84.6,
];
const FIM = 87.9 + 2.6;
export const DUR_GLP1_VOX = sec(FIM);

const useCena = (i: number) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const at = (t: number) => sec(t - T[i]);
  return {
    f,
    fps,
    u: Math.min(width, height),
    s: Math.floor(f / 2),
    at,
    sAt: (t: number) => Math.floor(at(t) / 2),
  };
};

const NEI = "Simulação: National Eye Institute (NIH), domínio público";

// ---------- peças ----------
/** foto colorida colada como figurinha (borda branca, sombra, entra batendo) */
const FotoCor: React.FC<{
  src: string;
  step: number;
  x: number;
  y: number;
  w: number; // % da largura
  aspect: number; // largura / altura da área
  rot?: number;
  pos?: string;
  filtro?: string;
  children?: React.ReactNode;
}> = ({
  src,
  step,
  x,
  y,
  w,
  aspect,
  rot = 0,
  pos = "center",
  filtro,
  children,
}) => {
  const { width, height } = useVideoConfig();
  if (step < 0) return null;
  const wp = (w / 100) * width;
  const sc = table([1.3, 1.08, 0.97, 1.0], step, 0) || 1;
  const borda = height * 0.008;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: wp,
        height: wp / aspect,
        background: C.paper,
        padding: borda,
        boxSizing: "content-box",
        boxShadow: `0 ${height * 0.008}px ${height * 0.014}px rgba(0,0,0,.45)`,
        transform: `rotate(${rot}deg) scale(${sc})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos,
            filter: filtro,
          }}
        />
        {children}
      </div>
    </div>
  );
};

/** bilhetinho de papel com texto (bula, rótulos) */
const Papel: React.FC<{
  step: number;
  x: number;
  y: number;
  w: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ step, x, y, w, rot = -2, children }) => {
  const { width, height } = useVideoConfig();
  if (step < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: (w / 100) * width,
        padding: height * 0.022,
        background: "#FBFAF6",
        boxShadow: "0 12px 30px rgba(0,0,0,.35)",
        transform: `rotate(${rot}deg) translateY(${table([-120, -20, 6, 0], step)}px)`,
        fontFamily: VOX_FONT.serif,
        color: C.ink,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

/** carimbo redondo/retangular que bate */
const Carimbo: React.FC<{
  step: number;
  x: number;
  y: number;
  text: string;
  size: number;
  rot?: number;
  color?: string;
}> = ({ step, x, y, text, size, rot = -8, color = C.red }) => {
  const { height } = useVideoConfig();
  if (step < 0) return null;
  const fs = (size / 100) * height;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        fontFamily: CHIP,
        fontWeight: 900,
        fontSize: fs,
        color,
        border: `${fs * 0.12}px solid ${color}`,
        padding: `${fs * 0.08}px ${fs * 0.3}px`,
        borderRadius: fs * 0.15,
        transform: `rotate(${rot}deg) scale(${table(STAMP, step)})`,
        mixBlendMode: "multiply",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** barra de dado colada: cresce de baixo para cima */
const Barra: React.FC<{
  step: number;
  x: number;
  base: number; // % da altura (linha de baixo)
  valor: number;
  max: number;
  cor: string;
  numero: string;
  rotulo: string;
}> = ({ step, x, base, valor, max, cor, numero, rotulo }) => {
  const { width, height } = useVideoConfig();
  if (step < 0) return null;
  const k = Math.min(1, step / 6);
  const hMax = height * 0.3;
  const h = hMax * (valor / max) * (1 - Math.pow(1 - k, 3));
  const w = width * 0.26;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: (base / 100) * height - h,
          width: w,
          height: h,
          background: cor,
          border: `${height * 0.004}px solid ${C.paper}`,
          boxShadow: "0 10px 18px rgba(0,0,0,.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          width: w,
          top: (base / 100) * height - h - height * 0.07,
          textAlign: "center",
          fontFamily: CHIP,
          fontWeight: 900,
          fontSize: height * 0.05,
          color: C.ink,
          opacity: k,
        }}
      >
        {numero}
      </div>
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          width: w,
          top: (base / 100) * height + height * 0.012,
          textAlign: "center",
          fontFamily: CHIP,
          fontWeight: 800,
          fontSize: height * 0.02,
          color: C.ink,
        }}
      >
        {rotulo}
      </div>
    </>
  );
};

// ---------- cenas ----------
// ① 0–5,5 s · os EUA mandaram mudar a bula de todas as canetas de GLP-1
const S1: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(0);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.yellow}
        dots="br"
        seed={1}
        disc={{ x: 50, y: 52, r: 24, color: "#E2D30B" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.03}>
        <CutLetters
          text="EUA"
          step={s}
          perChar={1}
          sizePctH={7.4}
          styles={chips()}
          x={10}
          y={12}
          seed="t1"
        />
        <HeadlineStrip
          text="MANDARAM MUDAR A BULA"
          step={s - sAt(0.9)}
          sizePctH={3.2}
          x={9}
          y={24}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <PrintCutout
          src={cut("caneta.png")}
          aspect={1000 / 260}
          widthPx={u * 0.82}
          x={9}
          y={35}
          rot={-8}
          step={s - sAt(2.2)}
          enter="slide"
        />
        <PrintCutout
          src={cut("caneta.png")}
          aspect={1000 / 260}
          widthPx={u * 0.82}
          x={12}
          y={44}
          rot={4}
          step={s - sAt(2.6)}
          enter="slide"
        />
        <PrintCutout
          src={cut("caneta.png")}
          aspect={1000 / 260}
          widthPx={u * 0.82}
          x={8}
          y={53}
          rot={-3}
          step={s - sAt(3.0)}
          enter="slide"
        />
        <HeadlineStrip
          text="DE TODAS AS CANETAS DE"
          step={s - sAt(2.2)}
          sizePctH={3}
          x={10}
          y={66}
          rot={2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <CutLetters
          text="GLP-1"
          step={s - sAt(4.4)}
          perChar={1}
          sizePctH={7.6}
          styles={chips(3)}
          x={22}
          y={72}
          seed="t1b"
        />
        <Scraps
          step={s}
          appearStep={4}
          seed="s1"
          items={[
            { kind: "zigzag", x: 76, y: 12, size: 5, rot: -12, color: C.red },
            { kind: "star", x: 82, y: 70, size: 5, rot: 8, color: C.blue },
          ]}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ② 5,5–7,6 s · o motivo é o olho
const S2: React.FC = () => {
  const { f, fps, s, sAt } = useCena(1);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.red}
        dots="tr"
        seed={2}
        disc={{ x: 50, y: 50, r: 22, color: "#A80F10" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.04}
        keys={[
          { at: 0, cx: 50, cy: 50, scale: 1.1 },
          { at: sec(2), cx: 50, cy: 50, scale: 1.0 },
        ]}
      >
        <HeadlineStrip
          text="O MOTIVO É"
          step={s}
          sizePctH={4.6}
          x={18}
          y={30}
          rot={-4}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <CutLetters
          text="O OLHO"
          step={s - sAt(6.7)}
          perChar={1}
          sizePctH={9}
          styles={chips(2)}
          x={8}
          y={42}
          seed="t2"
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ③ 7,6–9,4 s · Notícias da Farmácia
const S3: React.FC = () => {
  const { f, fps, s } = useCena(2);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.ink}
        dots="none"
        seed={3}
        disc={{ x: 50, y: 46, r: 22, color: "#262626" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.05}>
        <HeadlineStrip
          text="■ PLANTÃO"
          step={s}
          sizePctH={3}
          x={14}
          y={30}
          rot={-3}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
        <CutLetters
          text="NOTÍCIAS"
          step={s}
          perChar={1}
          sizePctH={5.8}
          styles={chips(1)}
          x={6}
          y={38}
          seed="t3"
        />
        <HeadlineStrip
          text="DA FARMÁCIA #5"
          step={s - 5}
          sizePctH={4}
          x={22}
          y={51}
          rot={3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ④ 9,4–18,7 s · 9 de novembro · FDA · alerta em todas as canetas · diabetes ou emagrecer
const S4: React.FC = () => {
  const { f, fps, s, sAt } = useCena(3);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.blue}
        dots="tr"
        seed={4}
        disc={{ x: 50, y: 42, r: 24, color: "#3A7DB0" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.02 },
          { at: sec(9.3), cx: 50, cy: 52, scale: 1.02 },
        ]}
      >
        <CutLetters
          text="09/11"
          step={s}
          perChar={1}
          sizePctH={6}
          styles={chips(2)}
          x={9}
          y={13}
          seed="t4"
        />
        <PrintCutout
          src={foto("fda_entrada.jpg")}
          aspect={1920 / 1278}
          widthPx={1080 * 0.82}
          x={9}
          y={21}
          rot={-2}
          step={s - sAt(10.9)}
          enter="slap"
        />
        <Tape
          x={12}
          y={21}
          w={14}
          h={1.8}
          rot={-28}
          color="rgba(236,226,196,.9)"
          seed={4}
        />
        <HeadlineStrip
          text="FDA: A ANVISA DE LÁ"
          step={s - sAt(11.9)}
          sizePctH={3}
          x={18}
          y={47}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="ALERTA EM TODAS AS CANETAS"
          step={s - sAt(14.4)}
          sizePctH={2.8}
          x={7}
          y={57}
          rot={-2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="DIABETES"
          step={s - sAt(16.7)}
          sizePctH={3.6}
          x={10}
          y={66}
          rot={-4}
          bg={C.paper}
          fg={C.red}
          font={CHIP}
        />
        <HeadlineStrip
          text="EMAGRECER"
          step={s - sAt(17.8)}
          sizePctH={3.6}
          x={46}
          y={72}
          rot={3}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(10.9) * 2}
        top
        onDark
        font={CHIP}
        text="Foto: FDA, domínio público (Wikimedia Commons) · Comunicado de segurança de 09/11/2026"
      />
    </AbsoluteFill>
  );
};

// ⑤ 18,7–23,3 s · semaglutida, tirzepatida, liraglutida e as outras
const S5: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(4);
  return (
    <AbsoluteFill>
      <ColorField color={C.pink} dots="bl" seed={5} />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={-0.02}
        keys={[
          { at: 0, cx: 50, cy: 46, scale: 1.04 },
          { at: sec(4.6), cx: 50, cy: 54, scale: 1.04 },
        ]}
      >
        <HeadlineStrip
          text="VALE PARA"
          step={s}
          sizePctH={4}
          x={10}
          y={12}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <PrintCutout
          src={cut("caneta.png")}
          aspect={1000 / 260}
          widthPx={u * 0.6}
          x={36}
          y={18}
          rot={10}
          step={s - 2}
          enter="drop"
        />
        <HeadlineStrip
          text="SEMAGLUTIDA"
          step={s - sAt(19.5)}
          sizePctH={4.2}
          x={8}
          y={33}
          rot={-2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="TIRZEPATIDA"
          step={s - sAt(20.5)}
          sizePctH={4.2}
          x={20}
          y={44}
          rot={2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="LIRAGLUTIDA"
          step={s - sAt(21.5)}
          sizePctH={4.2}
          x={10}
          y={55}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="E AS OUTRAS"
          step={s - sAt(22.5)}
          sizePctH={3.4}
          x={34}
          y={67}
          rot={3}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ⑥ 23,3–32,2 s · NOIANA · derrame no nervo do olho · falta sangue na entrada do nervo óptico
const S6: React.FC = () => {
  const { f, fps, s, at, sAt } = useCena(5);
  const escurece = Math.min(1, Math.max(0, (f - at(30.6)) / sec(1)));
  return (
    <AbsoluteFill>
      <ColorField
        color={C.purple}
        dots="br"
        seed={6}
        disc={{ x: 50, y: 54, r: 26, color: "#B357DA" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.0 },
          { at: sec(8.9), cx: 50, cy: 52, scale: 1.03 },
        ]}
      >
        <CutLetters
          text="NOIANA"
          step={s - sAt(24.4)}
          perChar={1}
          sizePctH={6.4}
          styles={chips()}
          x={12}
          y={12}
          seed="t6"
        />
        <HeadlineStrip
          text="UM DERRAME NO NERVO DO OLHO"
          step={s - sAt(25.6)}
          sizePctH={2.3}
          x={6}
          y={22.5}
          rot={-2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <FotoCor
          src={foto("fundo_olho.jpg")}
          step={s - sAt(26.6)}
          x={14}
          y={29}
          w={72}
          aspect={1}
          rot={2}
          filtro={`brightness(${1 - 0.5 * escurece})`}
        />
        <Annotate
          frame={f}
          at={at(28.9)}
          dur={8}
          kind="circle"
          box={{ x: 19, y: 41, w: 18, h: 11 }}
          widthPctH={0.7}
          color={C.yellow}
          seed="c6"
        />
        <HeadlineStrip
          text="FALTA SANGUE AQUI"
          step={s - sAt(28.3)}
          sizePctH={2.8}
          x={30}
          y={66}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="A VISÃO CAI DE REPENTE"
          step={s - sAt(30.6)}
          sizePctH={3.2}
          x={8}
          y={74}
          rot={-2}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(26.6) * 2}
        onDark
        font={CHIP}
        text="Foto: fundo de olho normal, M. Häggström, CC0 (Wikimedia Commons)"
      />
    </AbsoluteFill>
  );
};

// ⑦ 32,2–42,3 s · mas calma: é raro · 6 casos × quase 4 a cada 100 mil por ano
const S7: React.FC = () => {
  const { f, fps, s, sAt } = useCena(6);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.paper}
        dots="bl"
        seed={7}
        disc={{ x: 50, y: 60, r: 24, color: "#E8E1CF" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.012}
        keys={[
          { at: 0, cx: 50, cy: 46, scale: 1.05 },
          { at: sec(10), cx: 50, cy: 52, scale: 1.0 },
        ]}
      >
        <HeadlineStrip
          text="MAS CALMA"
          step={s}
          sizePctH={3.6}
          x={10}
          y={9}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <CutLetters
          text="É RARO"
          step={s - sAt(33.2)}
          perChar={1}
          sizePctH={7}
          styles={chips(1)}
          x={18}
          y={15}
          seed="t7"
        />
        <HeadlineStrip
          text="A CADA 100 MIL PESSOAS POR ANO"
          step={s - sAt(37.6)}
          sizePctH={2.4}
          x={7}
          y={29}
          rot={-1.5}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <Barra
          step={s - sAt(36.6)}
          x={14}
          base={72}
          valor={6.4}
          max={6.4}
          cor={C.red}
          numero="≈ 6"
          rotulo="COM A CANETA"
        />
        <Barra
          step={s - sAt(40.6)}
          x={58}
          base={72}
          valor={3.8}
          max={6.4}
          cor={C.ink}
          numero="≈ 4"
          rotulo="SEM A CANETA"
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(36.6) * 2}
        top
        font={CHIP}
        text="FDA, 09/11/2026: 126 estudos, 134.253 pessoas · 6,4 × 3,8 casos por 100 mil pessoas-ano"
      />
    </AbsoluteFill>
  );
};

// ⑧ 42,3–46,4 s · risco possível, sem causa comprovada
const S8: React.FC = () => {
  const { f, fps, s, sAt } = useCena(7);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.ink}
        dots="none"
        seed={8}
        disc={{ x: 50, y: 46, r: 22, color: "#262626" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.03}>
        <HeadlineStrip
          text="A FDA FALA EM"
          step={s}
          sizePctH={3.2}
          x={14}
          y={28}
          rot={-3}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <CutLetters
          text="RISCO"
          step={s - sAt(43.4)}
          perChar={1}
          sizePctH={7}
          styles={chips(2)}
          x={10}
          y={36}
          seed="t8a"
        />
        <HeadlineStrip
          text="POSSÍVEL"
          step={s - sAt(43.8)}
          sizePctH={5}
          x={36}
          y={48}
          rot={3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <Carimbo
          step={s - sAt(44.9)}
          x={7}
          y={60}
          size={2.7}
          text="SEM CAUSA COMPROVADA"
          rot={-6}
          color="#FF4A3D"
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ⑨ 46,4–54,8 s · no Brasil: bula da semaglutida desde 2025 · Anvisa analisa 13 notificações
const S9: React.FC = () => {
  const { f, fps, s, sAt } = useCena(8);
  const { height } = useVideoConfig();
  const fs = height * 0.017;
  return (
    <AbsoluteFill>
      <ColorField
        color={C.yellow}
        dots="tl"
        seed={9}
        disc={{ x: 54, y: 46, r: 24, color: "#E2D30B" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.02 },
          { at: sec(8.4), cx: 50, cy: 52, scale: 1.02 },
        ]}
      >
        <CutLetters
          text="NO BRASIL"
          step={s}
          perChar={1}
          sizePctH={6}
          styles={chips()}
          x={8}
          y={13}
          seed="t9"
        />
        <Papel step={s - sAt(47.4)} x={10} y={24} w={80}>
          <div
            style={{
              fontSize: fs * 0.8,
              letterSpacing: "0.1em",
              fontFamily: CHIP,
              fontWeight: 700,
              opacity: 0.6,
            }}
          >
            BULA · SEMAGLUTIDA
          </div>
          <div
            style={{ fontSize: fs * 1.3, fontWeight: 700, marginTop: fs * 0.5 }}
          >
            Reações adversas muito raras
          </div>
          <div
            style={{
              fontSize: fs * 1.05,
              marginTop: fs * 0.5,
              lineHeight: 1.35,
            }}
          >
            <span style={{ background: C.yellow, padding: "0 4px" }}>
              neuropatia óptica isquêmica anterior não arterítica (NOIANA)
            </span>
          </div>
          <div
            style={{
              fontSize: fs * 0.7,
              marginTop: fs * 0.7,
              fontFamily: CHIP,
              opacity: 0.55,
            }}
          >
            (trecho resumido para o vídeo)
          </div>
        </Papel>
        <Carimbo
          step={s - sAt(50.0)}
          x={52}
          y={41}
          size={3}
          text="DESDE 2025"
          rot={-8}
        />
        <CutLetters
          text="13"
          step={s - sAt(52.6)}
          perChar={1}
          sizePctH={10}
          styles={chips(3)}
          x={10}
          y={53}
          seed="t9b"
        />
        <HeadlineStrip
          text="NOTIFICAÇÕES"
          step={s - sAt(53.1)}
          sizePctH={3.2}
          x={44}
          y={56}
          rot={2}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="EM ANÁLISE NA ANVISA"
          step={s - sAt(53.9)}
          sizePctH={3}
          x={14}
          y={70}
          rot={-2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(47.4) * 2}
        font={CHIP}
        text="Anvisa: bula da semaglutida (jun. 2025) · notificações no VigiMed (2026)"
      />
    </AbsoluteFill>
  );
};

// ⑩ 54,8–62,6 s · fica de olho neste sinal: de repente, um olho só, sem dor, ao acordar
const S10: React.FC = () => {
  const { f, fps, s, sAt } = useCena(9);
  const img = s >= sAt(56.9) ? "visao_noiana_simulada.jpg" : "visao_normal.jpg";
  return (
    <AbsoluteFill>
      <ColorField
        color={C.red}
        dots="br"
        seed={10}
        disc={{ x: 50, y: 40, r: 24, color: "#A80F10" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.02 },
          { at: sec(7.8), cx: 50, cy: 52, scale: 1.06 },
        ]}
      >
        <HeadlineStrip
          text="FIQUE DE OLHO NESTE SINAL"
          step={s}
          sizePctH={2.8}
          x={8}
          y={12}
          rot={-2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <FotoCor
          key={img}
          src={foto(img)}
          step={s - sAt(56.0)}
          x={8}
          y={19.5}
          w={84}
          aspect={1280 / 1067}
          rot={-1.5}
          pos="center 78%"
        />
        <HeadlineStrip
          text="DE REPENTE"
          step={s - sAt(58.1)}
          sizePctH={3.6}
          x={8}
          y={60}
          rot={-3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="UM OLHO SÓ"
          step={s - sAt(59.2)}
          sizePctH={3.6}
          x={48}
          y={64}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="SEM DOR"
          step={s - sAt(60.1)}
          sizePctH={3.6}
          x={12}
          y={70}
          rot={2}
          bg={C.paper}
          fg={C.red}
          font={CHIP}
        />
        <HeadlineStrip
          text="AO ACORDAR"
          step={s - sAt(61.6)}
          sizePctH={3.6}
          x={44}
          y={76}
          rot={-2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(56.0) * 2}
        top
        onDark
        font={CHIP}
        text={`${NEI} · simulação ilustrativa`}
      />
    </AbsoluteFill>
  );
};

// ⑪ 62,6–66,9 s · mancha escura · parte da imagem sumindo · cores estranhas
const S11: React.FC = () => {
  const { f, fps, s, sAt } = useCena(10);
  const etapa = s >= sAt(65.5) ? 2 : s >= sAt(63.8) ? 1 : 0;
  const img = ["visao_mancha.jpg", "visao_glaucoma.jpg", "visao_normal.jpg"][
    etapa
  ];
  const inicio = [sAt(62.8), sAt(63.8), sAt(65.5)][etapa];
  return (
    <AbsoluteFill>
      <ColorField
        color={C.ink}
        dots="none"
        seed={11}
        disc={{ x: 50, y: 44, r: 26, color: "#262626" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.02}>
        <FotoCor
          key={img}
          src={foto(img)}
          step={s - inicio}
          x={8}
          y={22}
          w={84}
          aspect={1280 / 853}
          rot={etapa === 1 ? 2 : -2}
          pos="center 35%"
          filtro={
            etapa === 2
              ? "hue-rotate(70deg) saturate(0.55) contrast(0.9)"
              : undefined
          }
        />
        <HeadlineStrip
          text="MANCHA ESCURA"
          step={s - sAt(62.8)}
          sizePctH={3.4}
          x={10}
          y={60}
          rot={-3}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="PARTE SUMINDO"
          step={s - sAt(63.8)}
          sizePctH={3.4}
          x={34}
          y={67}
          rot={2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="CORES ESTRANHAS"
          step={s - sAt(65.5)}
          sizePctH={3.4}
          x={12}
          y={74}
          rot={-2}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={0}
        top
        onDark
        font={CHIP}
        text={`${NEI} · simulação ilustrativa`}
      />
    </AbsoluteFill>
  );
};

// ⑫ 66,9–71,9 s · oftalmologista no mesmo dia, sem esperar a próxima consulta
const S12: React.FC = () => {
  const { f, fps, s, sAt } = useCena(11);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.yellow}
        dots="br"
        seed={12}
        disc={{ x: 50, y: 40, r: 24, color: "#E2D30B" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 50, cy: 50, scale: 1.08 },
          { at: sec(5), cx: 50, cy: 50, scale: 1.0 },
        ]}
      >
        <FotoCor
          src={foto("lampada_fenda.jpg")}
          step={s}
          x={9}
          y={12}
          w={82}
          aspect={1920 / 1275}
          rot={2}
          pos="center 30%"
        />
        <CutLetters
          text="OFTALMO"
          step={s - sAt(67.8)}
          perChar={1}
          sizePctH={6.8}
          styles={chips(3)}
          x={8}
          y={47}
          seed="t12"
        />
        <HeadlineStrip
          text="NO MESMO DIA"
          step={s - sAt(68.8)}
          sizePctH={4.4}
          x={22}
          y={59}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="SEM ESPERAR A PRÓXIMA CONSULTA"
          step={s - sAt(70.0)}
          sizePctH={2.4}
          x={7}
          y={70}
          rot={-2}
          bg={C.paper}
          fg={C.red}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={6}
        top
        font={CHIP}
        text="Foto: exame com lâmpada de fenda, JeevaMuthuramalingam, CC BY-SA 4.0 (Wikimedia Commons)"
      />
    </AbsoluteFill>
  );
};

// ⑬ 71,9–79,9 s · não pare a caneta por conta própria · converse com quem receitou
const S13: React.FC = () => {
  const { f, fps, u, s, at, sAt } = useCena(12);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.blue}
        dots="bl"
        seed={13}
        disc={{ x: 50, y: 36, r: 22, color: "#3A7DB0" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 50, cy: 46, scale: 1.04 },
          { at: sec(8), cx: 50, cy: 54, scale: 1.04 },
        ]}
      >
        <PrintCutout
          src={cut("caneta.png")}
          aspect={1000 / 260}
          widthPx={u * 0.8}
          x={10}
          y={14}
          rot={-6}
          step={s}
          enter="slap"
        />
        <HeadlineStrip
          text="NÃO PARE POR CONTA PRÓPRIA"
          step={s - sAt(72.3)}
          sizePctH={2.7}
          x={7}
          y={30}
          rot={-2}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
        <Annotate
          frame={f}
          at={at(73.4)}
          dur={6}
          kind="strike"
          box={{ x: 12, y: 13, w: 74, h: 10 }}
          widthPctH={0.8}
          color={C.red}
          seed="x13"
        />
        <CutLetters
          text="CONVERSE"
          step={s - sAt(75.3)}
          perChar={1}
          sizePctH={5.4}
          styles={chips()}
          x={8}
          y={42}
          seed="t13"
        />
        <HeadlineStrip
          text="COM QUEM RECEITOU"
          step={s - sAt(75.8)}
          sizePctH={3.6}
          x={18}
          y={53}
          rot={3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="PRINCIPALMENTE SE JÁ TEVE"
          step={s - sAt(77.0)}
          sizePctH={2.8}
          x={8}
          y={66}
          rot={-2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="ESSE PROBLEMA EM UM OLHO"
          step={s - sAt(78.4)}
          sizePctH={2.8}
          x={12}
          y={72}
          rot={2}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ⑭ 79,9–84,6 s · manda para alguém que usa caneta · me siga (logo Farma.exe)
const S14: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(13);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.wine}
        dots="tl"
        seed={14}
        disc={{ x: 50, y: 46, r: 21, color: "#B85563" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.01}>
        <HeadlineStrip
          text="MANDA PARA QUEM"
          step={s}
          sizePctH={3.4}
          x={10}
          y={12}
          rot={-3}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="USA CANETA"
          step={s - sAt(80.8)}
          sizePctH={3.8}
          x={30}
          y={19}
          rot={2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <div
          style={{
            position: "absolute",
            left: "28%",
            top: "30%",
            width: u * 0.44,
            height: u * 0.44,
            borderRadius: "50%",
            overflow: "hidden",
            border: `${u * 0.012}px solid ${C.paper}`,
            boxShadow: "0 12px 26px rgba(0,0,0,.45)",
            transform: `scale(${s - sAt(81.7) < 0 ? 0 : table(STAMP, s - sAt(81.7))})`,
          }}
        >
          <Img
            src={cut("logo.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <CutLetters
          text="ME SIGA"
          step={s - sAt(81.8)}
          perChar={1}
          sizePctH={6}
          styles={chips(1)}
          x={14}
          y={58}
          seed="t14"
        />
        <HeadlineStrip
          text="NOTÍCIAS E DICAS"
          step={s - sAt(82.8)}
          sizePctH={3.2}
          x={14}
          y={69}
          rot={-2}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="DE FARMACOLOGIA"
          step={s - sAt(83.6)}
          sizePctH={3.2}
          x={24}
          y={75}
          rot={2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ⑮ 84,6 s–fim · consulte um profissional de saúde
const S15: React.FC = () => {
  const { f, fps, s } = useCena(14);
  return (
    <AbsoluteFill>
      <ColorField color={C.rice} dots="none" seed={15} />
      <VoxCamera frame={f} fps={fps} drift={0.006}>
        <HeadlineStrip
          text="CONSULTE UM PROFISSIONAL"
          step={s}
          sizePctH={2.6}
          x={7}
          y={42}
          rot={-2}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="DE SAÚDE PARA ORIENTAÇÕES."
          step={s - 3}
          sizePctH={2.6}
          x={9}
          y={48}
          rot={1.5}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

const CENAS = [
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  S13,
  S14,
  S15,
];

// ---------- som ----------
const SYN = (n: string) => `audio/sfx/synth/${n}.wav`;
const SFX: [number, string, number][] = [
  ...T.slice(1).map((t, i): [number, string, number] => [
    t - 0.05,
    SYN(["paper_1", "pageTurn_1", "paper_2", "swish_1"][i % 4]),
    0.22,
  ]),
  [2.2, SYN("pop-soft_1"), 0.22], // canetas
  [6.7, SYN("slam_1"), 0.3], // O OLHO
  [28.9, SYN("marker_1"), 0.3], // círculo no nervo
  [33.2, SYN("pop-soft_2"), 0.25], // É RARO
  [44.9, SYN("stamp_1"), 0.4], // SEM CAUSA COMPROVADA
  [50.0, SYN("stamp_2"), 0.35], // DESDE 2025
  [52.6, SYN("pop-soft_3"), 0.25], // 13
  [56.9, SYN("glitch_1"), 0.18], // visão cai
  [68.8, SYN("pop_1"), 0.25], // NO MESMO DIA
  [73.4, SYN("marker_2"), 0.3], // risca a caneta
  [81.7, SYN("pop_2"), 0.25], // logo
  [
    FIM - 1.5,
    "sfxkit/sfx-kit-main/sounds/logo-stings/sting-warm-short.wav",
    0.45,
  ],
];

// trilha: 0,22 nas pausas e 0,09 sob a voz (fala.json está em 30 fps)
const FALA: { w: string; f: number }[] = falaJson;
const FALANDO = (() => {
  const n = DUR_GLP1_VOX + 1;
  const v = new Float32Array(n);
  FALA.forEach((p, i) => {
    const ini = (p.f / 30) * FPS_GLP1_VOX;
    const prox =
      i + 1 < FALA.length ? (FALA[i + 1].f / 30) * FPS_GLP1_VOX : ini + 10;
    const fim = prox - ini < 16 ? prox : ini + 10;
    for (
      let fr = Math.max(0, Math.floor(ini - 3));
      fr <= Math.min(n - 1, Math.ceil(fim + 5));
      fr++
    )
      v[fr] = 1;
  });
  const suave = new Float32Array(n);
  let acc = 0;
  for (let fr = 0; fr < n; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    suave[fr] = acc;
  }
  return suave;
})();
const volMusica = (fr: number) => {
  const i = Math.max(0, Math.min(DUR_GLP1_VOX, Math.round(fr)));
  const fade = Math.min(1, Math.max(0, (DUR_GLP1_VOX - fr) / sec(1.2)));
  return (0.22 - 0.13 * FALANDO[i]) * fade;
};

export const VideoNoticiaGlp1Vox: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <CollageFilters scale={height / 1080} seed={3} />
      <Audio src={staticFile("noticiaGlp1/narracao.mp3")} />
      <Audio src={staticFile("noticiaGlp1/musica.wav")} volume={volMusica} />
      {SFX.map(([t, src, vol], i) => (
        <Sequence
          key={`sfx${i}`}
          from={Math.max(0, sec(t))}
          durationInFrames={sec(2.5)}
        >
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
      {CENAS.map((Cena, i) => {
        const from = sec(T[i]);
        const to = i + 1 < T.length ? sec(T[i + 1]) : DUR_GLP1_VOX;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <Cena />
          </Sequence>
        );
      })}
      <FilmLook frame={frame} grain={0.08} vignette={0.3} />
    </AbsoluteFill>
  );
};

// Capa (1080×1920). Tudo que importa entre y≈300 e 1620.
export const CapaNoticiaGlp1Vox: React.FC = () => {
  const { width, height } = useVideoConfig();
  const fim = 999;
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <CollageFilters scale={height / 1080} seed={3} />
      <ColorField
        color={C.red}
        dots="br"
        seed={2}
        disc={{ x: 52, y: 44, r: 26, color: "#A80F10" }}
      />
      <HeadlineStrip
        text="NOTÍCIAS DA FARMÁCIA #5"
        step={fim}
        sizePctH={2.6}
        x={10}
        y={17}
        rot={-2}
        bg={C.paper}
        fg={C.ink}
        font={CHIP}
      />
      <CutLetters
        text="CANETAS"
        step={fim}
        perChar={1}
        sizePctH={6.4}
        styles={chips(2)}
        x={9}
        y={22.5}
        seed="capa1"
      />
      <HeadlineStrip
        text="DE GLP-1 E A VISÃO"
        step={fim}
        sizePctH={3.6}
        x={14}
        y={33}
        rot={2}
        bg={C.ink}
        fg={C.paper}
        font={CHIP}
      />
      <FotoCor
        src={foto("visao_noiana_simulada.jpg")}
        step={fim}
        x={11}
        y={41}
        w={78}
        aspect={1280 / 1067}
        rot={-2}
        pos="center 78%"
      />
      <Carimbo
        step={fim}
        x={46}
        y={42}
        size={3}
        text="ALERTA FDA"
        rot={8}
        color={C.yellow}
      />
      <HeadlineStrip
        text="O SINAL QUE NÃO DÁ PARA IGNORAR"
        step={fim}
        sizePctH={2.3}
        x={7}
        y={78}
        rot={-2}
        bg={C.yellow}
        fg={C.ink}
        font={CHIP}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width,
          top: height * 0.825,
          textAlign: "center",
          fontFamily: CHIP,
          fontWeight: 600,
          fontSize: 22,
          color: "rgba(255,255,255,.75)",
        }}
      >
        {NEI} · simulação ilustrativa
      </div>
      <FilmLook frame={0} grain={0.08} vignette={0.3} />
    </AbsoluteFill>
  );
};
