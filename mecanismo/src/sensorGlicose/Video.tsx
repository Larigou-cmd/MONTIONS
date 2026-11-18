// Vídeo: o sensor de glicose do braço (o que é, quanto custa, SUS, plano, anéis).
// Estilo colagem Vox (biblioteca src/collage, copiada de SousekiL/vox-style-video, MIT):
// recortes impressos com retícula sobre UMA cor forte por cena, letras recortadas, câmera sempre se mexendo.
// Peças da colagem andam "em 2" (12 desenhos/s a 24 fps); a câmera anda suave.
// Tempos tirados de public/sensorGlicose/fala.json (narração da Juliana, 100,64 s).
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

export const FPS_SENSOR = 24;
const sec = (t: number) => Math.round(t * FPS_SENSOR);
const img = (n: string) => staticFile(`sensorGlicose/cut/${n}`);

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
  0, 4.0, 7.2, 14.4, 20.3, 30.9, 39.4, 41.3, 48.2, 54.4, 61.4, 69.9, 76.9, 84.6,
  90.9, 97.7,
];
const FIM = 100.64 + 1.6;
export const DUR_SENSOR = sec(FIM);

/** frame local da cena para um instante da narração */
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

const FONTE_FAB = "Foto: site do fabricante (Abbott)";

// ① 0–4 s · o disquinho no braço acaba com as picadas
const S1: React.FC = () => {
  const { f, fps, u, s, at, sAt } = useCena(0);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.yellow}
        dots="br"
        seed={1}
        disc={{ x: 50, y: 50, r: 22, color: "#E2D30B" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.03}>
        <PrintCutout
          src={img("correndo.png")}
          aspect={1}
          widthPx={u * 0.86}
          x={7}
          y={24}
          rot={-2}
          step={s}
          enter="slap"
        />
        <Scraps
          step={s}
          appearStep={3}
          seed="s1"
          items={[
            { kind: "zigzag", x: 74, y: 20, size: 5, rot: -12, color: C.red },
            { kind: "star", x: 6, y: 66, size: 6, rot: 8, color: C.blue },
          ]}
        />
        <CutLetters
          text="ADEUS"
          step={s - sAt(1.3)}
          perChar={1}
          sizePctH={6.8}
          styles={chips()}
          x={10}
          y={9}
          seed="t1"
        />
        <PrintCutout
          src={img("medidor.png")}
          aspect={1}
          widthPx={u * 0.48}
          x={50}
          y={54}
          rot={8}
          step={s - sAt(2.6)}
          enter="drop"
        />
        <Annotate
          frame={f}
          at={at(3.2)}
          dur={6}
          kind="strike"
          box={{ x: 50, y: 58, w: 44, h: 20 }}
          widthPctH={0.8}
          color={C.red}
          seed="x1"
        />
        <HeadlineStrip
          text="PICADAS NO DEDO"
          step={s - sAt(2.9)}
          sizePctH={3.2}
          x={8}
          y={66}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine frame={f} at={6} top font={CHIP} text={FONTE_FAB} />
    </AbsoluteFill>
  );
};

// ② 4–7,2 s · mas custa mais de 600 por mês
const S2: React.FC = () => {
  const { f, fps, s, sAt } = useCena(1);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.wine}
        dots="tl"
        seed={2}
        disc={{ x: 50, y: 46, r: 20, color: "#B85563" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 50, cy: 50, scale: 1.08 },
          { at: 60, cx: 50, cy: 50, scale: 1.0 },
        ]}
      >
        <HeadlineStrip
          text="MAS CUSTA"
          step={s}
          sizePctH={4.2}
          x={14}
          y={22}
          rot={-4}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <CutLetters
          text="+R$600"
          step={s - sAt(5.4)}
          perChar={1}
          sizePctH={8.4}
          styles={chips(1)}
          x={8}
          y={36}
          seed="t2"
        />
        <HeadlineStrip
          text="POR MÊS"
          step={s - sAt(5.9)}
          sizePctH={5.4}
          x={30}
          y={56}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <Scraps
          step={s}
          appearStep={4}
          seed="s2"
          items={[
            {
              kind: "triangle",
              x: 80,
              y: 14,
              size: 5,
              rot: 18,
              color: C.yellow,
            },
            { kind: "dot", x: 10, y: 72, size: 4, color: C.paper },
            { kind: "bar", x: 66, y: 72, size: 8, rot: -20, color: C.ink },
          ]}
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ③ 7,2–14,4 s · é um sensor de glicose contínuo · o mais conhecido é o FreeStyle Libre
const S3: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(2);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.blue}
        dots="tr"
        seed={3}
        disc={{ x: 50, y: 56, r: 24, color: "#3A7DB0" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 46, cy: 52, scale: 1.04 },
          { at: sec(7.2), cx: 54, cy: 48, scale: 1.04 },
        ]}
      >
        <HeadlineStrip
          text="SENSOR DE GLICOSE"
          step={s}
          sizePctH={3.4}
          x={11}
          y={12}
          rot={-3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <CutLetters
          text="CONTÍNUO"
          step={s - sAt(8.4)}
          perChar={1}
          sizePctH={5.6}
          styles={chips(2)}
          x={10}
          y={18}
          seed="t3"
        />
        <PrintCutout
          src={img("caixa.png")}
          aspect={1100 / 850}
          widthPx={u * 0.82}
          x={9}
          y={33}
          rot={-3}
          step={s - sAt(10.5)}
          enter="slap"
        />
        <Tape
          x={14}
          y={33}
          w={14}
          h={1.8}
          rot={-28}
          color="rgba(236,226,196,.9)"
          seed={3}
        />
        <HeadlineStrip
          text="+ OUTRAS MARCAS"
          step={s - sAt(12.5)}
          sizePctH={3.2}
          x={36}
          y={70}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(10.5) * 2}
        top
        onDark
        font={CHIP}
        text={FONTE_FAB}
      />
    </AbsoluteFill>
  );
};

// ④ 14,4–20,3 s · aplica no braço · fio fino e flexível logo abaixo da pele
const Pele: React.FC<{ step: number }> = ({ step }) => {
  const { height, width } = useVideoConfig();
  if (step < 0) return null;
  const fio = Math.min(1, Math.max(0, (step - 3) / 4));
  const top = height * 0.6;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width,
        height: height * 0.2,
        transform: `translateY(${table([40, 10, -2, 0], step)}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: 0,
          height: height * 0.03,
          background: "#E7B49A",
          boxShadow: "0 6px 10px rgba(0,0,0,.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: height * 0.03,
          height: height * 0.11,
          background: "#F3D6C4",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "7.5%",
          top: height * 0.006,
          fontFamily: VOX_FONT.sans,
          fontWeight: 800,
          fontSize: height * 0.017,
          color: C.ink,
        }}
      >
        PELE
      </div>
      <div
        style={{
          position: "absolute",
          left: "7.5%",
          top: height * 0.115,
          fontFamily: VOX_FONT.sans,
          fontWeight: 700,
          fontSize: height * 0.014,
          color: "rgba(20,20,20,.75)",
        }}
      >
        líquido entre as células
      </div>
      <div
        style={{
          position: "absolute",
          left: width / 2 - 3,
          top: -height * 0.005,
          width: 6,
          height: height * 0.075 * fio,
          background: C.ink,
          borderRadius: 3,
        }}
      />
    </div>
  );
};
const S4: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(3);
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      <ColorField color={C.pink} dots="bl" seed={4} />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.03 },
          { at: sec(5.9), cx: 50, cy: 52, scale: 1.03 },
        ]}
      >
        <PrintCutout
          src={img("aplicando.png")}
          aspect={1.5}
          widthPx={u * 0.84}
          x={8}
          y={13}
          rot={2}
          step={s}
          enter="drop"
        />
        <HeadlineStrip
          text="NO BRAÇO"
          step={s - sAt(15.1)}
          sizePctH={4}
          x={50}
          y={36}
          rot={4}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <Pele step={s - sAt(16.8)} />
        <PrintCutout
          src={img("sensor.png")}
          aspect={1}
          widthPx={u * 0.22}
          x={(100 * (width / 2 - u * 0.11)) / width}
          y={54.5}
          step={s - sAt(16.8)}
          enter="slap"
          border={false}
          wobble={0.4}
        />
        <HeadlineStrip
          text="FIO FINO E FLEXÍVEL"
          step={s - sAt(17.6)}
          sizePctH={3}
          x={14}
          y={46}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={6}
        top
        font={CHIP}
        text={`${FONTE_FAB} · esquema ilustrativo`}
      />
    </AbsoluteFill>
  );
};

// ⑤ 20,3–30,9 s · dia e noite · número no leitor ou no celular · setinha sobe ou cai
const Seta: React.FC<{
  step: number;
  x: number;
  y: number;
  size: number;
  down?: boolean;
}> = ({ step, x, y, size, down }) => {
  const { height } = useVideoConfig();
  if (step < 0) return null;
  const s = height * (size / 100);
  return (
    <svg
      viewBox="0 0 100 100"
      width={s}
      height={s}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${down ? 45 : -45}deg) scale(${table(STAMP, step)})`,
        filter: "drop-shadow(0 6px 6px rgba(0,0,0,.4))",
      }}
    >
      <polygon
        points="8,40 62,40 62,18 96,50 62,82 62,60 8,60"
        fill={down ? C.red : C.ink}
        stroke={C.paper}
        strokeWidth={5}
      />
    </svg>
  );
};
const S5: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(4);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.yellow}
        dots="tl"
        seed={5}
        disc={{ x: 50, y: 48, r: 26, color: "#E2D30B" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={-0.012}
        keys={[
          { at: 0, cx: 50, cy: 50, scale: 1.1 },
          { at: sec(10.6), cx: 50, cy: 50, scale: 1.0 },
        ]}
      >
        <CutLetters
          text="DIA"
          step={s - sAt(21.3)}
          perChar={1}
          sizePctH={6}
          styles={chips()}
          x={8}
          y={9}
          seed="t5a"
        />
        <HeadlineStrip
          text="E NOITE"
          step={s - sAt(21.9)}
          sizePctH={4.6}
          x={42}
          y={10}
          rot={4}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="SEM FURAR O DEDO"
          step={s - sAt(22.6)}
          sizePctH={3}
          x={12}
          y={19}
          rot={-2}
          bg={C.paper}
          fg={C.red}
          font={CHIP}
        />
        <PrintCutout
          src={img("celular.png")}
          aspect={1}
          widthPx={u * 0.92}
          x={4}
          y={26}
          rot={-2}
          step={s - sAt(24.4)}
          enter="slap"
        />
        <Seta step={s - sAt(28.6)} x={70} y={58} size={10} />
        <Seta step={s - sAt(29.9)} x={70} y={70} size={10} down />
        <HeadlineStrip
          text="SOBE OU CAI?"
          step={s - sAt(28.6)}
          sizePctH={3.4}
          x={10}
          y={74}
          rot={-3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(24.4) * 2}
        top
        font={CHIP}
        text={FONTE_FAB}
      />
    </AbsoluteFill>
  );
};

// ⑥ 30,9–39,4 s · insulina · muda tudo · madrugada inteira · alarme quando cai demais
const S6: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(5);
  const noite = s >= sAt(33.9);
  return (
    <AbsoluteFill>
      <ColorField
        color={noite ? "#1E2A4A" : C.blue}
        dots={noite ? "none" : "br"}
        seed={6}
        disc={noite ? { x: 70, y: 22, r: 9, color: "#F2EBDA" } : undefined}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 48, cy: 50, scale: 1.04 },
          { at: sec(8.5), cx: 52, cy: 50, scale: 1.04 },
        ]}
      >
        {!noite ? (
          <>
            <HeadlineStrip
              text="QUEM USA INSULINA"
              step={s}
              sizePctH={3.6}
              x={8}
              y={18}
              rot={-3}
              bg={C.yellow}
              fg={C.ink}
              font={CHIP}
            />
            <CutLetters
              text="MUDA"
              step={s - sAt(32.4)}
              perChar={1}
              sizePctH={8}
              styles={chips(3)}
              x={14}
              y={32}
              seed="t6a"
            />
            <CutLetters
              text="TUDO"
              step={s - sAt(33.0)}
              perChar={1}
              sizePctH={8}
              styles={chips(1)}
              x={26}
              y={46}
              seed="t6b"
            />
          </>
        ) : (
          <>
            <HeadlineStrip
              text="A MADRUGADA INTEIRA"
              step={s - sAt(33.9)}
              sizePctH={3.3}
              x={11}
              y={36}
              rot={-3}
              bg={C.paper}
              fg={C.ink}
              font={CHIP}
            />
            <PrintCutout
              src={img("sensor.png")}
              aspect={1}
              widthPx={u * 0.34}
              x={33}
              y={46}
              step={s - sAt(34.5)}
              enter="slap"
              border={false}
            />
            <CutLetters
              text="ALARME"
              step={s - sAt(37.0)}
              perChar={1}
              sizePctH={5.8}
              styles={chips(3)}
              x={13}
              y={66}
              seed="t6c"
            />
            <Scraps
              step={s}
              appearStep={sAt(37.0)}
              seed="s6"
              items={[
                { kind: "star", x: 74, y: 62, size: 7, color: C.red },
                { kind: "star", x: 12, y: 58, size: 4, color: C.yellow },
              ]}
            />
          </>
        )}
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ⑦ 39,4–41,3 s · só que tem o preço
const S7: React.FC = () => {
  const { f, fps, s } = useCena(6);
  return (
    <AbsoluteFill>
      <ColorField color={C.red} dots="tr" seed={7} />
      <VoxCamera frame={f} fps={fps} drift={0.05}>
        <HeadlineStrip
          text="SÓ QUE TEM"
          step={s}
          sizePctH={4.4}
          x={14}
          y={30}
          rot={-4}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <CutLetters
          text="O PREÇO"
          step={s - 4}
          perChar={1}
          sizePctH={6.8}
          styles={chips(2)}
          x={8}
          y={42}
          seed="t7"
        />
      </VoxCamera>
    </AbsoluteFill>
  );
};

// ⑧ 41,3–48,2 s · R$ 330 cada · dura 15 dias · dois por mês
const S8: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(7);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.paper}
        dots="bl"
        seed={8}
        disc={{ x: 50, y: 40, r: 22, color: "#E8E1CF" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 52, cy: 46, scale: 1.05 },
          { at: sec(6.9), cx: 48, cy: 54, scale: 1.05 },
        ]}
      >
        <PrintCutout
          src={img("sensor.png")}
          aspect={1}
          widthPx={u * 0.3}
          x={9}
          y={19}
          step={s}
          enter="slap"
          border={false}
        />
        <CutLetters
          text="R$330"
          step={s - sAt(42.9)}
          perChar={1}
          sizePctH={6.4}
          styles={chips(1)}
          x={10}
          y={34}
          seed="t8a"
        />
        <HeadlineStrip
          text="DURA 15 DIAS"
          step={s - sAt(45.4)}
          sizePctH={3.4}
          x={14}
          y={46}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <PrintCutout
          src={img("sensor.png")}
          aspect={1}
          widthPx={u * 0.3}
          x={59}
          y={20}
          step={s - sAt(46.8)}
          enter="slap"
          border={false}
        />
        <CutLetters
          text="2×"
          step={s - sAt(47.0)}
          perChar={1}
          sizePctH={8}
          styles={chips(3)}
          x={58}
          y={52}
          seed="t8b"
        />
        <HeadlineStrip
          text="POR MÊS ≈ R$ 660"
          step={s - sAt(47.3)}
          sizePctH={3.6}
          x={9}
          y={66}
          rot={-2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(42.9) * 2}
        top
        font={CHIP}
        text="Preços de 18/11/2026: Drogasil, Droga Raia, Panvel e Pague Menos (R$ 329,80 a R$ 330,99)"
      />
    </AbsoluteFill>
  );
};

// ⑨ 48,2–54,4 s · celular não compatível · leitor à parte ≈ R$ 350
const S9: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(8);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.purple}
        dots="br"
        seed={9}
        disc={{ x: 56, y: 50, r: 24, color: "#B357DA" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 50, cy: 50, scale: 1.0 },
          { at: sec(6.2), cx: 50, cy: 50, scale: 1.04 },
        ]}
      >
        <HeadlineStrip
          text="CELULAR NÃO COMPATÍVEL?"
          step={s}
          sizePctH={2.7}
          x={9}
          y={16}
          rot={-3}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <PrintCutout
          src={img("celular.png")}
          aspect={1}
          widthPx={u * 0.86}
          x={8}
          y={24}
          rot={2}
          step={s - sAt(48.8)}
          enter="slide"
        />
        <HeadlineStrip
          text="LEITOR À PARTE"
          step={s - sAt(50.7)}
          sizePctH={3.8}
          x={30}
          y={66}
          rot={3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <CutLetters
          text="+R$350"
          step={s - sAt(52.9)}
          perChar={1}
          sizePctH={6.4}
          styles={chips(2)}
          x={14}
          y={73}
          seed="t9"
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={6}
        top
        onDark
        font={CHIP}
        text={`${FONTE_FAB} · leitor: R$ 349,90 (Panvel, 18/11/2026)`}
      />
    </AbsoluteFill>
  );
};

// ⑩ 54,4–61,4 s · e o SUS? ainda não fornece · em 2025 decidiu não incluir
const Documento: React.FC<{ step: number }> = ({ step }) => {
  const { height, width } = useVideoConfig();
  if (step < 0) return null;
  const w = width * 0.8;
  const fs = height * 0.017;
  return (
    <div
      style={{
        position: "absolute",
        left: width * 0.1,
        top: height * 0.34,
        width: w,
        padding: fs * 1.4,
        background: "#FBFAF6",
        boxShadow: "0 12px 30px rgba(0,0,0,.35)",
        transform: `rotate(-2deg) translateY(${table([-120, -20, 6, 0], step)}px)`,
        fontFamily: VOX_FONT.serif,
        color: C.ink,
      }}
    >
      <div
        style={{
          fontSize: fs * 0.8,
          letterSpacing: "0.1em",
          fontFamily: VOX_FONT.sans,
          fontWeight: 700,
          opacity: 0.6,
        }}
      >
        DIÁRIO OFICIAL DA UNIÃO · 03/02/2025
      </div>
      <div
        style={{ fontSize: fs * 1.25, fontWeight: 700, marginTop: fs * 0.6 }}
      >
        PORTARIA SECTICS/MS Nº 2, DE 31 DE JANEIRO DE 2025
      </div>
      <div style={{ fontSize: fs, marginTop: fs * 0.6, lineHeight: 1.35 }}>
        Torna pública a decisão de{" "}
        <span style={{ background: C.yellow, padding: "0 4px" }}>
          não incorporar
        </span>
        , no âmbito do SUS, o sistema flash de monitorização da glicose...
      </div>
      <div
        style={{
          fontSize: fs * 0.7,
          marginTop: fs * 0.8,
          fontFamily: VOX_FONT.sans,
          opacity: 0.55,
        }}
      >
        (trecho resumido para o vídeo)
      </div>
    </div>
  );
};
const S10: React.FC = () => {
  const { f, fps, s, sAt } = useCena(9);
  return (
    <AbsoluteFill>
      <ColorField color={C.rice} dots="tl" seed={10} />
      <VoxCamera frame={f} fps={fps} drift={0.025}>
        <CutLetters
          text="E O SUS?"
          step={s}
          perChar={1}
          sizePctH={6.4}
          styles={chips()}
          x={9}
          y={13}
          seed="t10"
        />
        <HeadlineStrip
          text="AINDA NÃO FORNECE"
          step={s - sAt(56.1)}
          sizePctH={3.6}
          x={12}
          y={24}
          rot={-3}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
        <Documento step={s - sAt(57.6)} />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(57.6) * 2}
        top
        font={CHIP}
        text="Fonte: Portaria SECTICS/MS nº 2/2025, Diário Oficial da União"
      />
    </AbsoluteFill>
  );
};

// ⑪ 61,4–69,9 s · este ano voltou · +22 mil na consulta · decisão final ainda não saiu
const S11: React.FC = () => {
  const { f, fps, s, at, sAt } = useCena(10);
  const sealAt = at(67.4);
  const sc = f < sealAt ? 0 : table(STAMP, Math.floor((f - sealAt) / 2));
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <ColorField
        color={C.ink}
        dots="none"
        seed={11}
        disc={{ x: 50, y: 44, r: 22, color: "#262626" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.015}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.0 },
          { at: sec(8.5), cx: 50, cy: 52, scale: 1.08 },
        ]}
      >
        <HeadlineStrip
          text="EM 2026, A DISCUSSÃO VOLTOU"
          step={s}
          sizePctH={2.5}
          x={10}
          y={18}
          rot={-2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <CutLetters
          text="+22 MIL"
          step={s - sAt(63.7)}
          perChar={1}
          sizePctH={7.6}
          styles={chips(1)}
          x={8}
          y={28}
          seed="t11"
        />
        <HeadlineStrip
          text="NA CONSULTA PÚBLICA"
          step={s - sAt(65.9)}
          sizePctH={3.4}
          x={14}
          y={44}
          rot={3}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        {sc > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "14%",
              top: "58%",
              transform: `rotate(-8deg) scale(${sc})`,
              border: `${height * 0.006}px solid ${C.red}`,
              padding: `${height * 0.01}px ${height * 0.02}px`,
              color: C.red,
              fontFamily: CHIP,
              fontWeight: 900,
              fontSize: height * 0.034,
              letterSpacing: "0.04em",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            SEM DECISÃO
            <br />
            FINAL
          </div>
        ) : null}
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(63.7) * 2}
        top
        onDark
        font={CHIP}
        text="Fonte: Conitec, Consulta Pública nº 63/2026 · sem decisão final até 18/11/2026"
      />
    </AbsoluteFill>
  );
};

// ⑫ 69,9–76,9 s · plano: fora da lista obrigatória · muita gente consegue na Justiça
const S12: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(11);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.blue}
        dots="bl"
        seed={12}
        disc={{ x: 50, y: 56, r: 22, color: "#3A7DB0" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 54, cy: 50, scale: 1.05 },
          { at: sec(7), cx: 46, cy: 50, scale: 1.05 },
        ]}
      >
        <HeadlineStrip
          text="PLANO DE SAÚDE"
          step={s}
          sizePctH={4}
          x={9}
          y={17}
          rot={-3}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="FORA DA LISTA OBRIGATÓRIA"
          step={s - sAt(71.9)}
          sizePctH={2.5}
          x={8}
          y={25}
          rot={2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <PrintCutout
          src={img("martelo.png")}
          aspect={1400 / 896}
          widthPx={u * 0.8}
          x={10}
          y={34}
          rot={-6}
          step={s - sAt(73.2)}
          enter="slap"
        />
        <CutLetters
          text="JUSTIÇA"
          step={s - sAt(74.7)}
          perChar={1}
          sizePctH={6.2}
          styles={chips(3)}
          x={12}
          y={62}
          seed="t12"
        />
        <HeadlineStrip
          text="COM O PEDIDO DO MÉDICO"
          step={s - sAt(75.4)}
          sizePctH={2.9}
          x={14}
          y={73}
          rot={-2}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(73.2) * 2}
        top
        onDark
        font={CHIP}
        text="Há decisões a favor (TJRN, TJAL) e contra · foto: Wikimedia Commons, CC0"
      />
    </AbsoluteFill>
  );
};

// ⑬ 76,9–84,6 s · cuidado com o atalho barato · Anvisa: nenhum anel ou relógio autorizado
const S13: React.FC = () => {
  const { f, fps, u, s, at, sAt } = useCena(12);
  return (
    <AbsoluteFill>
      <ColorField color={C.pink} dots="tr" seed={13} />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={-0.015}
        keys={[
          { at: 0, cx: 50, cy: 50, scale: 1.1 },
          { at: sec(7.7), cx: 50, cy: 50, scale: 1.0 },
        ]}
      >
        <CutLetters
          text="CUIDADO"
          step={s}
          perChar={1}
          sizePctH={6.2}
          styles={chips()}
          x={7}
          y={10}
          seed="t13"
        />
        <PrintCutout
          src={img("anel_claro.png")}
          aspect={900 / 762}
          widthPx={u * 0.78}
          x={11}
          y={24}
          rot={3}
          step={s - sAt(78.0)}
          enter="drop"
        />
        <Annotate
          frame={f}
          at={at(80.8)}
          dur={8}
          kind="strike"
          box={{ x: 11, y: 26, w: 76, h: 34 }}
          widthPctH={0.9}
          color={C.red}
          seed="x13"
        />
        <HeadlineStrip
          text="ANVISA:"
          step={s - sAt(79.3)}
          sizePctH={3.6}
          x={9}
          y={62}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="NENHUM ANEL OU RELÓGIO"
          step={s - sAt(80.4)}
          sizePctH={3.1}
          x={9}
          y={69}
          rot={2}
          bg={C.yellow}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="ESTÁ AUTORIZADO"
          step={s - sAt(82.1)}
          sizePctH={3.1}
          x={22}
          y={75}
          rot={-2}
          bg={C.paper}
          fg={C.red}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(79.3) * 2}
        top
        font={CHIP}
        text="Fonte: alerta da Anvisa, 27/08/2026 · foto do anel: Wikimedia Commons, CC0 (ilustrativa)"
      />
    </AbsoluteFill>
  );
};

// ⑭ 84,6–90,9 s · número não combina com o que sente → confirme na ponta do dedo
const S14: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(13);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.yellow}
        dots="bl"
        seed={14}
        disc={{ x: 56, y: 52, r: 24, color: "#E2D30B" }}
      />
      <VoxCamera
        frame={f}
        fps={fps}
        drift={0.02}
        keys={[
          { at: 0, cx: 50, cy: 48, scale: 1.03 },
          { at: sec(6.3), cx: 50, cy: 52, scale: 1.03 },
        ]}
      >
        <HeadlineStrip
          text="O NÚMERO NÃO COMBINA"
          step={s - sAt(86.5)}
          sizePctH={3.1}
          x={8}
          y={19}
          rot={-3}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="COM O QUE VOCÊ SENTE?"
          step={s - sAt(87.9)}
          sizePctH={3.1}
          x={12}
          y={26}
          rot={2}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <PrintCutout
          src={img("medidor.png")}
          aspect={1}
          widthPx={u * 0.6}
          x={20}
          y={34}
          rot={-4}
          step={s - sAt(89.1)}
          enter="slap"
        />
        <CutLetters
          text="CONFIRME"
          step={s - sAt(89.1)}
          perChar={1}
          sizePctH={5.6}
          styles={chips(2)}
          x={8}
          y={66}
          seed="t14"
        />
        <HeadlineStrip
          text="NA PONTA DO DEDO"
          step={s - sAt(89.8)}
          sizePctH={3.6}
          x={20}
          y={75}
          rot={-2}
          bg={C.red}
          fg={C.paper}
          font={CHIP}
        />
      </VoxCamera>
      <SourceLine
        frame={f}
        at={sAt(89.1) * 2}
        top
        font={CHIP}
        text={`${FONTE_FAB} · Sociedade Brasileira de Diabetes, 2025`}
      />
    </AbsoluteFill>
  );
};

// ⑮ 90,9–97,7 s · manda para alguém · me siga (logo Farma.exe)
const S15: React.FC = () => {
  const { f, fps, u, s, sAt } = useCena(14);
  return (
    <AbsoluteFill>
      <ColorField
        color={C.wine}
        dots="tl"
        seed={15}
        disc={{ x: 50, y: 46, r: 21, color: "#B85563" }}
      />
      <VoxCamera frame={f} fps={fps} drift={0.01}>
        <HeadlineStrip
          text="MANDA PARA QUEM VIVE"
          step={s}
          sizePctH={3.2}
          x={8}
          y={12}
          rot={-3}
          bg={C.paper}
          fg={C.ink}
          font={CHIP}
        />
        <HeadlineStrip
          text="FURANDO O DEDO"
          step={s - sAt(92.2)}
          sizePctH={3.6}
          x={20}
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
            transform: `scale(${s - sAt(93.5) < 0 ? 0 : table(STAMP, s - sAt(93.5))})`,
          }}
        >
          <Img
            src={img("logo.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <CutLetters
          text="ME SIGA"
          step={s - sAt(93.5)}
          perChar={1}
          sizePctH={6}
          styles={chips(1)}
          x={14}
          y={58}
          seed="t15"
        />
        <HeadlineStrip
          text="DICAS DE FARMACOLOGIA"
          step={s - sAt(94.5)}
          sizePctH={2.9}
          x={12}
          y={69}
          rot={-2}
          bg={C.ink}
          fg={C.paper}
          font={CHIP}
        />
        <HeadlineStrip
          text="E CURIOSIDADES DA ÁREA"
          step={s - sAt(96.3)}
          sizePctH={2.9}
          x={16}
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

// ⑯ 97,7 s–fim · consulte um profissional de saúde
const S16: React.FC = () => {
  const { f, fps, s } = useCena(15);
  return (
    <AbsoluteFill>
      <ColorField color={C.rice} dots="none" seed={16} />
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
  S16,
];

// ---------- som ----------
// efeitos: kit sintetizado da vox-style-video (public/audio/sfx/synth) + sting do SFX Kit (CC0)
const SYN = (n: string) => `audio/sfx/synth/${n}.wav`;
const SFX: [number, string, number][] = [
  // troca de cena: papel / virada de página, alternando
  ...T.slice(1).map((t, i): [number, string, number] => [
    t - 0.05,
    SYN(["paper_1", "pageTurn_1", "paper_2", "swish_1"][i % 4]),
    0.22,
  ]),
  [3.2, SYN("marker_1"), 0.3], // risca o medidor
  [4.2, SYN("pop-soft_1"), 0.25], // +R$600
  [47.3, SYN("pop-soft_2"), 0.25], // ≈ R$ 660
  [52.9, SYN("pop-soft_3"), 0.25], // +R$350
  [57.6, SYN("pageTurn_2"), 0.28], // portaria
  [67.4, SYN("stamp_1"), 0.4], // carimbo SEM DECISÃO FINAL
  [80.8, SYN("marker_2"), 0.3], // risca o anel
  [93.5, SYN("pop_1"), 0.25], // logo
  [
    FIM - 1.5,
    "sfxkit/sfx-kit-main/sounds/logo-stings/sting-warm-short.wav",
    0.45,
  ],
];

// trilha: 0,22 nas pausas e 0,09 sob a voz (fala.json está em 30 fps)
const FALA_SG: { w: string; f: number }[] = falaJson;
const FALANDO_SG = (() => {
  const n = DUR_SENSOR + 1;
  const v = new Float32Array(n);
  FALA_SG.forEach((p, i) => {
    const ini = (p.f / 30) * FPS_SENSOR;
    const prox =
      i + 1 < FALA_SG.length ? (FALA_SG[i + 1].f / 30) * FPS_SENSOR : ini + 10;
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
  const i = Math.max(0, Math.min(DUR_SENSOR, Math.round(fr)));
  const fade = Math.min(1, Math.max(0, (DUR_SENSOR - fr) / sec(1.2)));
  return (0.22 - 0.13 * FALANDO_SG[i]) * fade;
};

export const VideoSensorGlicose: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <CollageFilters scale={height / 1080} seed={2} />
      <Audio src={staticFile("sensorGlicose/narracao.mp3")} />
      <Audio src={staticFile("sensorGlicose/musica.wav")} volume={volMusica} />
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
        const to = i + 1 < T.length ? sec(T[i + 1]) : DUR_SENSOR;
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

// Capa (1080×1920). Tudo que importa entre y≈300 e 1620 (recorte 3:4 do TikTok e do Instagram).
export const CapaSensorGlicose: React.FC = () => {
  const { width, height } = useVideoConfig();
  const u = Math.min(width, height);
  const fim = 999;
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <CollageFilters scale={height / 1080} seed={2} />
      <ColorField
        color={C.yellow}
        dots="br"
        seed={1}
        disc={{ x: 52, y: 42, r: 26, color: "#E2D30B" }}
      />
      <HeadlineStrip
        text="O DISQUINHO NO BRAÇO"
        step={fim}
        sizePctH={3.4}
        x={8}
        y={17}
        rot={-3}
        bg={C.ink}
        fg={C.paper}
        font={CHIP}
      />
      <PrintCutout
        src={img("celular.png")}
        aspect={1}
        widthPx={u * 0.6}
        x={20}
        y={23.5}
        rot={2}
        step={fim}
        enter="slap"
      />
      <Scraps
        step={fim}
        appearStep={0}
        seed="capa"
        items={[
          { kind: "star", x: 82, y: 22, size: 6, rot: 10, color: C.red },
          { kind: "zigzag", x: 8, y: 40, size: 5, rot: -10, color: C.blue },
        ]}
      />
      <CutLetters
        text="+R$600"
        step={fim}
        perChar={1}
        sizePctH={8.2}
        styles={chips(1)}
        x={10}
        y={59.5}
        seed="capa1"
      />
      <HeadlineStrip
        text="POR MÊS"
        step={fim}
        sizePctH={5}
        x={46}
        y={70}
        rot={3}
        bg={C.red}
        fg={C.paper}
        font={CHIP}
      />
      <HeadlineStrip
        text="E O SUS AINDA NÃO DÁ"
        step={fim}
        sizePctH={3.3}
        x={10}
        y={78}
        rot={-2}
        bg={C.paper}
        fg={C.ink}
        font={CHIP}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * 0.825,
          textAlign: "center",
          fontFamily: CHIP,
          fontWeight: 600,
          fontSize: 22,
          color: "rgba(20,20,20,.7)",
        }}
      >
        {FONTE_FAB}
      </div>
      <FilmLook frame={0} grain={0.08} vignette={0.3} />
    </AbsoluteFill>
  );
};
