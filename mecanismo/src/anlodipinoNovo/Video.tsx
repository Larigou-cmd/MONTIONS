import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import {
  Background,
  Grain,
  OUT,
  P,
  Part,
  Pill,
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { Fluxo3D } from "./Fluxo3D";
import { Vaso3D } from "./Vaso3D";
import falaJson from "./fala.json";

// "Começou a tomar anlodipino?" — Modelo 1 com a paleta verde e vaso em 3D (@remotion/three).
// Roteiro e fontes: roteiros/anlodipino_comecou.md. Narração feita pela usuária (OpenArt); tempos em fala.json (scripts/transcrever.py).
const AZUL = "#3dff8f",
  VERM = "#ff4d4d",
  AMBAR = "#f2e52e",
  VERDE = "#3dff8f";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  sabe: Tw("sabe"),
  tornozelo: Tw("tornozelo"),
  guarda: Tw("guarda"),
  fruta: Tw("fruta"),
  bloco: Tw("seus") - 6,
  musculo: Tw("músculo"),
  calcio: Tw("cálcio"),
  aperta: Tw("aperta"),
  fecha: Tw("fecha"),
  abre: Tw("abre"),
  cai: Tw("cai"),
  ponta: Tw("só") - 6,
  art: Tw("ele", 2) - 6,
  arterias: Tw("artérias"),
  veias: Tw("veias"),
  entra: Tw("entra", 2),
  liquido: Tw("líquido"),
  gravidade: Tw("gravidade"),
  pes: Tw("pés"),
  agua: Tw("por", 2) - 6,
  segurando: Tw("segurando"),
  diuretico: Tw("diurético"),
  efeitos: Tw("no", 3) - 6,
  dor: Tw("dor"),
  tontura: Tw("tontura"),
  semana: Tw("primeira"),
  frutaC: Tw("agora") - 6,
  toranja: Tw("toranja"),
  aumentar: Tw("aumentar"),
  nao: Tw("se") - 14,
  pare: Tw("pare"),
  fale: Tw("fale"),
  salva: Tw("salva"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_ANLODIPINO_NOVO = T.final + 90;
// FIM TEMPOS
const VASO = {
  sai: -60,
  fora: -30,
  calcio: T.calcio,
  aperta: T.aperta,
  fecha: T.fecha,
  abre: T.abre,
};

// efeitos do SFX Kit (Wyzowl, licença CC0)
const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.sabe, POP, 0.2],
  [T.tornozelo, POP, 0.2],
  [T.guarda, TRAVA, 0.3],
  [T.bloco, WHOOSH, 0.28],
  [T.calcio, POP, 0.2],
  [T.aperta, TRAVA, 0.3],
  [T.fecha, BIP, 0.25],
  [T.abre, PLIM, 0.25],
  [T.ponta, WHOOSH, 0.28],
  [T.art, WHOOSH, 0.28],
  [T.arterias, POP, 0.2],
  [T.veias, POP, 0.2],
  [T.gravidade, TRAVA, 0.28],
  [T.agua, WHOOSH, 0.28],
  [T.segurando, TRAVA, 0.3],
  [T.efeitos, WHOOSH, 0.28],
  [T.dor, POP, 0.2],
  [T.tontura, POP, 0.2],
  [T.frutaC, WHOOSH, 0.28],
  [T.toranja, PLIM, 0.28],
  [T.nao, WHOOSH, 0.28],
  [T.pare, TRAVA, 0.32],
  [T.salva, PLIM, 0.25],
  [T.siga, WHOOSH, 0.28],
  [T.final - 4, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_ANLODIPINO_NOVO + 1).fill(0);
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
  0.22 -
  0.13 *
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0);

const Carimbo: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 72, children }) =>
  f >= at ? (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%,-50%) rotate(-5deg) scale(${2.2 - 1.2 * it(f, at, at + 7, 0, 1, OUT)})`,
        opacity: it(f, at, at + 7, 0, 1, OUT),
        border: `8px solid ${cor}`,
        borderRadius: 14,
        padding: "6px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        color: cor,
        background: rgba("#000000", 0.55),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  ) : null;

const Linha: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  emoji: string;
  children: React.ReactNode;
  h?: number;
}> = ({ f, at, y, cor, emoji, children, h = 170 }) => (
  <Card
    f={f}
    at={at}
    x={110}
    y={y}
    w={860}
    h={h}
    border={rgba(cor, 0.75)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 34,
      padding: "0 46px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 84 }}>{emoji}</span>
    <span
      style={{
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 50,
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  </Card>
);

// frase grande no centro
const Grande: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 96, children }) => {
  const k = it(f, at - 6, at + 6, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.1,
        color: cor,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const VideoAnlodipinoNovo: React.FC = () => {
  const f = useCurrentFrame();
  const pressao = interpolate(f, [T.aperta - 10, T.aperta + 30, T.abre, T.cai + 20], [0.55, 0.95, 0.95, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Background color={f < T.art || f >= T.siga ? VERDE : f < T.frutaC ? AMBAR : VERM} pulses={[T.guarda, T.aperta, T.abre, T.pare, T.final]} />

      {/* 1 e 2. gancho, sem 3D */}
      <Part from={0} to={T.guarda - 4}>
        <Title f={f} at={0} y={220} size={78} font={SANS} weight={900} from={VERDE}>
          COMEÇOU A TOMAR
          <br />
          <span style={{ color: VERDE }}>ANLODIPINO?</span>
        </Title>
        <Grande f={f} at={T.sabe - 4} y={440} cor={AMBAR} size={68}>
          SABE O QUE ELE FAZ?
        </Grande>
        <Pill x={540} y={590} text="🦶 e por que o tornozelo pode inchar?" color={VERDE} size={42} k={P(f, T.tornozelo - 10, T.tornozelo + 2)} />
        <Emoji f={f} at={6} x={380} y={900} size={210}>
          💊
        </Emoji>
        <Emoji f={f} at={T.tornozelo - 8} x={700} y={900} size={210}>
          🦶
        </Emoji>
      </Part>
      <Part from={T.guarda - 4} to={T.bloco}>
        <Carimbo f={f} at={T.guarda} y={320} cor={AMBAR} size={76}>
          GUARDA ISSO
        </Carimbo>
        <Emoji f={f} at={T.fruta - 16} x={540} y={700} size={230}>
          🍊
        </Emoji>
        <Grande f={f} at={T.fruta - 10} y={870} cor={C.ink} size={64}>
          no final: uma fruta para evitar
        </Grande>
      </Part>

      {/* 3. como ele age: o 3D entra aqui */}
      <Sequence from={T.bloco} durationInFrames={T.ponta - T.bloco + 8} layout="none">
        <AbsoluteFill>
          <Vaso3D f={f} t={VASO} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,18,15,.9) 0%, rgba(4,18,15,.7) 26%, rgba(4,18,15,0) 40%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.bloco} to={T.ponta}>
        {f >= T.bloco + 8 && f < T.calcio - 4 && (
          <Grande f={f} at={T.bloco + 8} y={250} cor={C.ink} size={62}>
            um músculo em volta do vaso
          </Grande>
        )}
        {f >= T.calcio - 2 && f < T.fecha - 12 && (
          <Grande f={f} at={T.calcio - 2} y={250} cor={AMBAR} size={62}>
            o cálcio entra: o vaso aperta
          </Grande>
        )}
        {f >= T.fecha - 10 && f < T.abre - 40 && (
          <Grande f={f} at={T.fecha - 10} y={250} cor={VERDE} size={62}>
            ANLODIPINO FECHA A PORTA
          </Grande>
        )}
        {f >= T.abre - 38 && f < T.ponta && (
          <Grande f={f} at={T.abre - 38} y={250} cor={VERDE} size={62}>
            o músculo relaxa e o vaso abre
          </Grande>
        )}
        <div style={{ position: "absolute", left: 140, top: 480, fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: C.ink, opacity: P(f, T.calcio + 20, T.calcio + 34) }}>
          PRESSÃO
        </div>
        <div style={{ position: "absolute", left: 140, top: 526, width: 800, height: 40, borderRadius: 20, background: "rgba(255,255,255,.1)", overflow: "hidden", opacity: P(f, T.calcio + 20, T.calcio + 34) }}>
          <div style={{ width: `${pressao * 100}%`, height: "100%", borderRadius: 20, background: f > T.fecha + 40 ? VERDE : VERM }} />
        </div>
      </Part>

      {/* 4. ponta solta */}
      <Part from={T.ponta} to={T.art}>
        <Emoji f={f} at={T.ponta + 4} x={540} y={700} size={190}>
          🦶
        </Emoji>
        <Grande f={f} at={T.ponta + 20} y={880} cor={AMBAR} size={82}>
          ATÉ O SEU TORNOZELO
        </Grande>
      </Part>

      {/* 5. por que incha, também em 3D */}
      <Sequence from={T.art} durationInFrames={T.agua - T.art + 8} layout="none">
        <AbsoluteFill>
          <Fluxo3D f={f} t={{ ini: T.art, liquido: T.liquido, pes: T.pes }} />
        </AbsoluteFill>
      </Sequence>
      <Part from={T.art} to={T.agua}>
        <Pill x={300} y={250} text="artéria: abre bem" color={VERM} size={38} k={P(f, T.arterias - 12, T.arterias)} />
        <Pill x={770} y={250} text="veia: abre pouco" color={AZUL} size={38} k={P(f, T.veias - 18, T.veias - 6)} />
        <Grande f={f} at={T.entra - 2} y={330} cor={C.ink} size={66}>
          ENTRA MAIS DO QUE SAI
        </Grande>
        <Pill x={540} y={470} text="💧 um pouco de líquido escapa" color={AZUL} size={40} k={f < T.gravidade - 8 ? P(f, T.liquido - 8, T.liquido + 4) : 0} />
        <Pill x={540} y={470} text="⬇️ a gravidade leva para os pés" color={AMBAR} size={40} k={P(f, T.gravidade - 6, T.gravidade + 6)} />
      </Part>

      {/* 6. não é água */}
      <Part from={T.agua} to={T.efeitos}>
        <Grande f={f} at={T.agua + 6} y={400} cor={C.ink} size={72}>
          NÃO É O CORPO
        </Grande>
        <Carimbo f={f} at={T.segurando} y={600} cor={VERM} size={62}>
          SEGURANDO ÁGUA
        </Carimbo>
        <Linha f={f} at={T.diuretico - 8} y={760} cor={AMBAR} emoji="💊" h={180}>
          diurético costuma ajudar pouco nesse inchaço
        </Linha>
      </Part>

      {/* 7. no começo */}
      <Part from={T.efeitos} to={T.frutaC}>
        <Title f={f} at={T.efeitos + 4} y={250} size={74} weight={600} from={AMBAR}>
          no começo, também pode dar
        </Title>
        <Linha f={f} at={T.dor - 8} y={520} cor={AMBAR} emoji="🤕" h={170}>
          dor de cabeça
        </Linha>
        <Linha f={f} at={T.tontura - 8} y={710} cor={AMBAR} emoji="💫" h={170}>
          tontura
        </Linha>
        <Pill x={540} y={970} text="a dor de cabeça costuma passar na 1ª semana" color={VERDE} size={38} k={P(f, T.semana - 40, T.semana - 28)} />
      </Part>

      {/* 8. a fruta */}
      <Part from={T.frutaC} to={T.nao}>
        <Title f={f} at={T.frutaC + 4} y={250} size={70} weight={600} from={AMBAR}>
          a fruta que eu pedi para guardar
        </Title>
        <Emoji f={f} at={T.toranja - 10} x={540} y={680} size={220}>
          🍊
        </Emoji>
        <Grande f={f} at={T.toranja - 2} y={860} cor={AMBAR} size={116}>
          TORANJA
        </Grande>
        <Grande f={f} at={T.toranja + 26} y={1000} cor={C.ink} size={52}>
          também chamada de grapefruit
        </Grande>
        <Pill x={540} y={1130} text="pode aumentar o remédio no sangue" color={VERM} size={42} k={P(f, T.aumentar - 8, T.aumentar + 4)} />
      </Part>

      {/* 9. não pare */}
      <Part from={T.nao} to={T.siga}>
        <Title f={f} at={T.nao + 4} y={260} size={72} weight={600} from={VERDE}>
          o tornozelo inchou?
        </Title>
        <Carimbo f={f} at={T.pare} y={520} cor={VERM} size={48}>
          NÃO PARE POR CONTA PRÓPRIA
        </Carimbo>
        <Linha f={f} at={T.fale - 8} y={650} cor={VERDE} emoji="🩺" h={190}>
          fale com seu médico: dá para ajustar o tratamento
        </Linha>
        <Pill x={540} y={940} text="📌 salva e manda para quem toma" color={AMBAR} size={46} k={P(f, T.salva - 4, T.salva + 8)} />
      </Part>

      {/* 10. me siga */}
      <Part from={T.siga} to={T.final}>
        <Img
          src={staticFile("anlodipinoNovo/logo.jpg")}
          style={{
            position: "absolute",
            left: 350,
            top: 380,
            width: 380,
            height: 380,
            borderRadius: "50%",
          }}
        />
        <Grande f={f} at={T.siga + 4} y={800} cor={C.ink} size={120}>
          ME SIGA
        </Grande>
        <div
          style={{
            position: "absolute",
            top: 950,
            left: 110,
            width: 860,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1.3,
            color: C.ink,
          }}
        >
          para mais dicas de farmacologia e curiosidades sobre a área
        </div>
      </Part>

      {/* 11. tela final */}
      <Part from={T.final - 4} to={DURATION_ANLODIPINO_NOVO} inY={100} outDur={1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => {
            const at = T.final + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 700 + i * 110,
                  width: W,
                  textAlign: "center",
                  fontFamily: SERIF,
                  fontWeight: i === 1 ? 600 : 400,
                  fontSize: i === 1 ? 92 : 80,
                  color:
                    i === 1
                      ? bornColor(f, at, AZUL, "#eff6ff", 20)
                      : bornColor(f, at, C.ink, AZUL),
                  opacity: k,
                  transform: `translateY(${(1 - k) * 40}px)`,
                }}
              >
                {l}
              </div>
            );
          },
        )}
      </Part>
      <Grain />
      <Audio src={staticFile("anlodipinoNovo/narracao.mp3")} />
      <Audio
        src={staticFile("anlodipinoNovo/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_ANLODIPINO_NOVO - 60, DURATION_ANLODIPINO_NOVO))
        }
      />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e y≈1620, o recorte 3:4 do TikTok e do Instagram.
export const CapaAnlodipinoNovo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div style={{ position: "absolute", top: 340, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: C.ink }}>
      COMEÇOU A TOMAR
      <br />
      <span style={{ color: VERDE, textShadow: `0 0 30px ${rgba(VERDE, 0.5)}` }}>ANLODIPINO?</span>
    </div>
    <div style={{ position: "absolute", top: 620, width: W, textAlign: "center", fontFamily: EMOJI, fontSize: 230, lineHeight: 1 }}>
      💊🦶
    </div>
    <div style={{ position: "absolute", left: 540, top: 1040, transform: "translate(-50%,-50%) rotate(-5deg)", border: `9px solid ${AMBAR}`, borderRadius: 16, padding: "8px 28px", fontFamily: SANS, fontWeight: 900, fontSize: 60, letterSpacing: 2, color: AMBAR, background: rgba(AMBAR, 0.08), whiteSpace: "nowrap" }}>
      O TORNOZELO INCHOU?
    </div>
    <div style={{ position: "absolute", top: 1200, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 58, lineHeight: 1.2, color: C.ink }}>
      e a fruta que você
      <br />
      precisa evitar
    </div>
    <Grain />
  </AbsoluteFill>
);
