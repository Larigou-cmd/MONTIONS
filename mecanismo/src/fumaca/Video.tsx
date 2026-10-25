import React from "react";
import { AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, OUT, P, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Por que a fumaça de incêndio faz desmaiar?" — Modelo 1, tudo desenhado em código.
// Roteiro e fontes: roteiros/fumaca_incendio_desmaio.md. Narração da Juliana; tempos alinhados em fala.json.
const VERM = "#ef4444",
  AMBAR = "#fbbf24",
  AZUL = "#60a5fa",
  CINZA = "#94a3b8",
  VERDE = "#4ade80",
  ROXO = "#a78bfa";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  fumaca: Tw("fumaça"),
  gas: Tw("gás"),
  ve: Tw("vê"),
  cheiro: Tw("cheiro"),
  monoxido: Tw("monóxido"),
  hemo: Tw("lembra") - 6,
  oxigenio1: Tw("oxigênio"),
  encaixa: Tw("encaixa"),
  duzentas: Tw("duzentas"),
  forte: Tw("forte"),
  ocupada: Tw("resultado") - 6,
  ocupadaW: Tw("ocupada"),
  chega: Tw("chega"),
  cerebro: Tw("cérebro"),
  percebe: Tw("perigoso") - 12,
  vermelho: Tw("vermelho"),
  roxa: Tw("roxa"),
  acelera: Tw("acelera"),
  confusa: Tw("confusa"),
  desmaia: Tw("desmaia"),
  cianetoCena: Tw("tem") - 10,
  plastico: Tw("plástico"),
  cianeto: Tw("cianeto"),
  impede: Tw("impede"),
  oximetro: Tw("até") - 6,
  enganar: Tw("enganar"),
  normal: Tw("normal"),
  tratamento: Tw("por") - 6,
  puro: Tw("puro"),
  empurrando: Tw("empurrando"),
  antidoto: Tw("antídoto"),
  hidroxo: Tw("hidroxocobalamina"),
  b12: Tw("b12"),
  saia: Tw("num", 2) - 6,
  abaixado: Tw("abaixado"),
  bombeiros: Tw("bombeiros"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_FUMACA = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.gas, "pop", 0.2],
  [T.monoxido, "trava", 0.28],
  [T.hemo, "whoosh", 0.25],
  [T.oxigenio1, "pop", 0.2],
  [T.encaixa, "trava", 0.3],
  [T.duzentas, "plim", 0.25],
  [T.ocupada, "whoosh", 0.25],
  [T.cerebro, "bip", 0.2],
  [T.percebe, "whoosh", 0.25],
  [T.vermelho, "pop", 0.18],
  [T.roxa, "pop", 0.18],
  [T.acelera, "pop", 0.18],
  [T.desmaia, "trava", 0.32],
  [T.cianetoCena, "whoosh", 0.25],
  [T.cianeto, "trava", 0.3],
  [T.oximetro, "whoosh", 0.25],
  [T.enganar, "trava", 0.32],
  [T.tratamento, "whoosh", 0.25],
  [T.empurrando, "pop", 0.2],
  [T.antidoto, "plim", 0.25],
  [T.saia, "whoosh", 0.25],
  [T.bombeiros, "bip", 0.25],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    <defs>
      <radialGradient id="hemGradF" cx="45%" cy="40%" r="60%">
        <stop offset="0" stopColor="#ff8a8a" />
        <stop offset="0.55" stopColor="#dc2626" />
        <stop offset="1" stopColor="#7f1d1d" />
      </radialGradient>
    </defs>
    {children}
  </svg>
);

// fumaça: bolas cinzas subindo devagar
const Fumaca: React.FC<{ f: number; n?: number; y0?: number; alpha?: number }> = ({ f, n = 26, y0 = 1900, alpha = 0.45 }) => (
  <Svg>
    {Array.from({ length: n }, (_, i) => {
      const sp = 1.4 + random(`v${i}`) * 1.6;
      const t = (f * sp + random(`o${i}`) * 1400) % 1400;
      const x = 80 + random(`x${i}`) * 920 + Math.sin(f / 30 + i) * 40;
      const r = 60 + random(`r${i}`) * 90 + t * 0.08;
      return <circle key={i} cx={x} cy={y0 - t} r={r} fill={CINZA} opacity={alpha * (1 - t / 1400)} style={{ filter: "blur(18px)" }} />;
    })}
  </Svg>
);

// moléculas
const O2: React.FC<{ x: number; y: number; s?: number; alpha?: number }> = ({ x, y, s = 1.5, alpha = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={alpha}>
    <circle cx={-20} r={28} fill={AZUL} />
    <circle cx={20} r={28} fill={AZUL} />
    <text y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={28} fill="#0b1220">
      O₂
    </text>
  </g>
);
const CO: React.FC<{ x: number; y: number; s?: number; alpha?: number }> = ({ x, y, s = 1.5, alpha = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={alpha}>
    <circle cx={-20} r={30} fill="#334155" stroke={CINZA} strokeWidth={3} />
    <circle cx={20} r={28} fill={VERM} />
    <text y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={28} fill="#fff">
      CO
    </text>
  </g>
);

// hemoglobina com 4 vagas; O2 chega, depois o CO toma o lugar
const VAGAS = [
  [0, -230],
  [230, 0],
  [0, 230],
  [-230, 0],
];
const Hemoglobina: React.FC<{ f: number; cx?: number; cy?: number; s?: number; modo: "troca" | "ocupada" | "solta" }> = ({ f, cx = 540, cy = 1000, s = 1, modo }) => {
  return (
    <Svg>
      <g transform={`translate(${cx},${cy}) scale(${s})`}>
        <circle r={200} fill="url(#hemGradF)" style={{ filter: `drop-shadow(0 0 40px ${rgba(VERM, 0.5)})` }} />
        <text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={48} fill="#fff">
          hemoglobina
        </text>
        {VAGAS.map(([vx, vy], i) => {
          if (modo === "troca") {
            const chegaO2 = it(f, T.oxigenio1 - 6 + i * 4, T.oxigenio1 + 10 + i * 4, 0, 1, OUT);
            const chegaCO = it(f, T.encaixa - 4 + i * 6, T.encaixa + 14 + i * 6, 0, 1, OUT);
            const o2x = vx * (1 + 1.8 * (1 - chegaO2)) + vx * 1.6 * chegaCO;
            const o2y = vy * (1 + 1.8 * (1 - chegaO2)) + vy * 1.6 * chegaCO;
            return (
              <g key={i}>
                <circle cx={vx} cy={vy} r={44} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="8 8" />
                {chegaO2 > 0 && <O2 x={o2x} y={o2y} alpha={1 - 0.6 * chegaCO} />}
                {chegaCO > 0 && <CO x={vx + (vx || 300) * (1 - chegaCO) * 0.0 + (1 - chegaCO) * 500} y={vy - (1 - chegaCO) * 300} />}
              </g>
            );
          }
          if (modo === "ocupada") return <CO key={i} x={vx} y={vy} />;
          // solta: o O2 puro empurra o CO para fora
          const sai = it(f, T.empurrando - 6 + i * 6, T.empurrando + 20 + i * 6, 0, 1, OUT);
          return (
            <g key={i}>
              <CO x={vx * (1 + 2.2 * sai)} y={vy * (1 + 2.2 * sai)} alpha={1 - sai} />
              {sai > 0.4 && <O2 x={vx} y={vy} s={1.5 * it(f, T.empurrando + 4 + i * 6, T.empurrando + 16 + i * 6, 0, 1, SNAP)} />}
            </g>
          );
        })}
      </g>
    </Svg>
  );
};

// cérebro que vai apagando
const Cerebro: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.cerebro - 6, T.cerebro + 8, 0, 1, SNAP);
  const apaga = P(f, T.cerebro, T.cerebro + 60);
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1040,
        transform: `translate(-50%,-50%) scale(${k})`,
        fontFamily: EMOJI,
        fontSize: 260,
        filter: `grayscale(${apaga}) brightness(${1 - 0.55 * apaga})`,
      }}
    >
      🧠
    </div>
  );
};

// card riscado: "o corpo não percebe"
const Risco: React.FC<{ f: number; at: number; y: number; txt: string; ok?: boolean }> = ({ f, at, y, txt }) => {
  if (f < at - 4) return null;
  const k = it(f, at - 4, at + 10, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`,
        opacity: Math.min(1, k * 1.4),
        padding: "22px 40px",
        borderRadius: 26,
        background: C.box,
        border: `2px solid ${rgba(CINZA, 0.6)}`,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 46,
        color: C.ink,
        whiteSpace: "nowrap",
      }}
    >
      {txt}
    </div>
  );
};

// célula com a mitocôndria travada pelo cianeto
const Celula: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.cianeto - 10, T.cianeto + 6, 0, 1, SNAP);
  const trava = it(f, T.impede - 4, T.impede + 8, 0, 1, OUT);
  return (
    <Svg>
      <g transform={`translate(540,1080) scale(${k})`}>
        <ellipse rx={360} ry={260} fill={rgba(ROXO, 0.12)} stroke={ROXO} strokeWidth={5} />
        <ellipse rx={170} ry={90} fill={rgba(AMBAR, 0.25)} stroke={AMBAR} strokeWidth={5} />
        <path d="M-130,0 C-90,-50 -50,50 -10,0 C30,-50 70,50 110,0" fill="none" stroke={AMBAR} strokeWidth={6} />
        <text y={140} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={AMBAR}>
          mitocôndria (a usina)
        </text>
        <g transform={`translate(${200 - 60 * trava},${-150 + 120 * trava})`}>
          <circle r={52} fill="#7c3aed" style={{ filter: "drop-shadow(0 0 16px #7c3aed)" }} />
          <text y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill="#fff">
            CN⁻
          </text>
        </g>
        {trava > 0 && (
          <g opacity={trava} stroke={VERM} strokeWidth={14} strokeLinecap="round">
            <line x1={-150} y1={-110} x2={150} y2={110} />
            <line x1={150} y1={-110} x2={-150} y2={110} />
          </g>
        )}
        {f >= T.impede &&
          [0, 1, 2].map((i) => <O2 key={i} x={-300 + i * 70} y={-200 + Math.sin(f / 10 + i) * 10} s={0.8} alpha={0.8} />)}
      </g>
    </Svg>
  );
};

// oxímetro de dedo
const Oximetro: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.oximetro + 2, T.oximetro + 16, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: 540, top: 950, transform: `translate(-50%,-50%) scale(${k})` }}>
      <div style={{ width: 560, height: 360, borderRadius: 90, background: "#e2e8f0", boxShadow: "0 20px 50px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 400, height: 220, borderRadius: 24, background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 140, color: VERDE, textShadow: `0 0 20px ${VERDE}` }}>98</span>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: VERDE }}>%</span>
        </div>
      </div>
    </div>
  );
};

const Carimbo: React.FC<{ f: number; at: number; x: number; y: number; texto: string; cor?: string; size?: number; rot?: number }> = ({ f, at, x, y, texto, cor = VERM, size = 70, rot = -10 }) => {
  if (f < at) return null;
  const u = it(f, at, at + 7, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * u})`,
        opacity: u,
        border: `8px solid ${cor}`,
        borderRadius: 14,
        padding: "6px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 4,
        color: cor,
        background: rgba(cor, 0.1),
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

export const VideoFumaca: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo = f < T.hemo ? CINZA : f < T.cianetoCena ? VERM : f < T.tratamento ? ROXO : f < T.saia ? AZUL : AMBAR;
  return (
    <AbsoluteFill>
      <Background color={corFundo} pulses={[T.monoxido, T.encaixa, T.forte, T.desmaia, T.cianeto, T.enganar, T.antidoto, T.bombeiros, T.final]} />

      {/* 1. gancho: a fumaça e o gás invisível */}
      <Part from={0} to={T.hemo}>
        <Fumaca f={f} />
        <Title f={f} at={2} y={300} size={74} font={SANS} weight={900} from={CINZA}>
          POR QUE A FUMAÇA
          <br />
          FAZ DESMAIAR?
        </Title>
        <Emoji f={f} at={T.gas - 4} x={540} y={900} size={200}>
          💨
        </Emoji>
        <Emoji f={f} at={T.ve} x={340} y={1150} size={110}>
          👁️
        </Emoji>
        <Emoji f={f} at={T.ve + 6} x={420} y={1200} size={60}>
          ❌
        </Emoji>
        <Emoji f={f} at={T.cheiro} x={720} y={1150} size={110}>
          👃
        </Emoji>
        <Emoji f={f} at={T.cheiro + 6} x={800} y={1200} size={60}>
          ❌
        </Emoji>
        <Pill x={540} y={1420} text="MONÓXIDO DE CARBONO (CO)" color={VERM} size={46} k={P(f, T.monoxido, T.monoxido + 12)} />
      </Part>

      {/* 2. o CO toma o lugar do O2 */}
      <Part from={T.hemo} to={T.ocupada}>
        <Title f={f} at={T.hemo + 4} y={300} size={72} weight={600} from={VERM}>
          o CO rouba o lugar do <span style={{ color: AZUL }}>oxigênio</span>
        </Title>
        <Hemoglobina f={f} modo="troca" />
        {f >= T.duzentas - 4 && (
          <div
            style={{
              position: "absolute",
              top: 1420,
              width: W,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 120,
              color: VERM,
              textShadow: `0 0 30px ${rgba(VERM, 0.6)}`,
              transform: `scale(${it(f, T.duzentas - 4, T.duzentas + 8, 0.5, 1, SNAP) * (1 + 0.04 * Math.sin(f / 4))})`,
            }}
          >
            250× <span style={{ fontSize: 56, color: C.ink }}>mais forte</span>
          </div>
        )}
      </Part>

      {/* 3. hemoglobina ocupada, o cérebro sente */}
      <Part from={T.ocupada} to={T.percebe}>
        <Title f={f} at={T.ocupada + 4} y={300} size={72} weight={600} from={VERM}>
          hemoglobina <span style={{ color: VERM }}>ocupada</span>
        </Title>
        {f < T.cerebro - 6 ? (
          <>
            <Hemoglobina f={f} modo="ocupada" />
            {[0, 1, 2].map((i) => (
              <Svg key={i}>
                <O2 x={260 + i * 280} y={1400 + Math.sin(f / 8 + i) * 12} alpha={0.7} />
              </Svg>
            ))}
            <Pill x={540} y={1540} text="❌ o oxigênio não chega" color={AZUL} size={42} k={P(f, T.chega - 4, T.chega + 8)} />
          </>
        ) : (
          <>
            <Cerebro f={f} />
            <Pill x={540} y={1400} text="o cérebro é um dos primeiros" color={ROXO} size={44} k={P(f, T.cerebro, T.cerebro + 10)} />
          </>
        )}
      </Part>

      {/* 4. o corpo não percebe */}
      <Part from={T.percebe} to={T.cianetoCena}>
        <Title f={f} at={T.percebe + 4} y={300} size={72} weight={600} from={VERM}>
          o corpo <span style={{ color: VERM }}>não percebe</span>
        </Title>
        <Risco f={f} at={T.vermelho} y={620} txt="🩸 o sangue segue vermelho" />
        <Risco f={f} at={T.roxa} y={780} txt="🟣 não fica roxa" />
        <Risco f={f} at={T.acelera} y={940} txt="🫁 a respiração não acelera" />
        <Emoji f={f} at={T.confusa - 4} x={540} y={1230} size={200}>
          😵
        </Emoji>
        <Carimbo f={f} at={T.desmaia} x={540} y={1460} texto="DESMAIA" size={80} rot={-6} />
      </Part>

      {/* 5. o cianeto */}
      <Part from={T.cianetoCena} to={T.oximetro}>
        <Title f={f} at={T.cianetoCena + 4} y={300} size={72} weight={600} from={ROXO}>
          e tem o <span style={{ color: ROXO }}>cianeto</span>
        </Title>
        <Pill x={540} y={520} text="🔥 plástico e espuma queimando" color={AMBAR} size={42} k={P(f, T.plastico - 4, T.plastico + 8)} />
        <Celula f={f} />
        <Pill x={540} y={1450} text="a célula não usa o oxigênio" color={ROXO} size={44} k={P(f, T.impede, T.impede + 10)} />
      </Part>

      {/* 6. o oxímetro engana */}
      <Part from={T.oximetro} to={T.tratamento}>
        <Title f={f} at={T.oximetro + 4} y={300} size={72} weight={600} from={VERDE}>
          até o oxímetro engana
        </Title>
        <Oximetro f={f} />
        <Carimbo f={f} at={T.enganar} x={540} y={1260} texto="PODE ENGANAR" size={72} rot={-8} />
        <Pill x={540} y={1460} text="mostra um valor “normal”" color={AMBAR} size={42} k={P(f, T.normal - 4, T.normal + 8)} />
      </Part>

      {/* 7. o tratamento */}
      <Part from={T.tratamento} to={T.saia}>
        <Title f={f} at={T.tratamento + 4} y={300} size={72} weight={600} from={AZUL}>
          tratamento: <span style={{ color: AZUL }}>oxigênio puro</span>
        </Title>
        {f < T.antidoto - 8 ? (
          <>
            <Hemoglobina f={f} modo="solta" s={0.85} cy={960} />
            <Pill x={540} y={1400} text="O₂ 100% empurra o CO para fora" color={AZUL} size={42} k={P(f, T.puro, T.puro + 10)} />
          </>
        ) : (
          <Card f={f} at={T.antidoto - 8} x={110} y={700} w={860} h={420} border={rgba(VERDE, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, textAlign: "center", padding: "0 40px" }}>
            <span style={{ fontFamily: EMOJI, fontSize: 110 }}>💉</span>
            <span style={{ fontWeight: 700, fontSize: 40 }}>antídoto do cianeto</span>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 70, color: bornColor(f, T.hidroxo, C.ink, VERDE) }}>hidroxocobalamina</span>
            <span style={{ fontWeight: 700, fontSize: 38, color: "#f472b6", opacity: P(f, T.b12 - 10, T.b12 + 2) }}>uma forma de vitamina B12</span>
          </Card>
        )}
      </Part>

      {/* 8. o que fazer */}
      <Part from={T.saia} to={T.siga}>
        <Fumaca f={f} n={18} y0={900} alpha={0.55} />
        <Title f={f} at={T.saia + 4} y={300} size={80} font={SANS} weight={900} from={AMBAR}>
          SAIA ABAIXADO
        </Title>
        <Emoji f={f} at={T.abaixado - 4} x={540} y={1080} size={220}>
          🧎
        </Emoji>
        <Pill x={540} y={1300} text="longe da fumaça ⬇️" color={AMBAR} size={44} k={P(f, T.abaixado + 6, T.abaixado + 18)} />
        <Card f={f} at={T.bombeiros - 6} x={240} y={1390} w={600} h={190} border={rgba(VERM, 0.8)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <span style={{ fontFamily: EMOJI, fontSize: 90 }}>📞</span>
          <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, color: VERM }}>193</span>
        </Card>
      </Part>

      {/* 9. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card f={f} at={T.siga} x={110} y={760} w={860} h={300} border={rgba(AZUL, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "0 40px" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: bornColor(f, T.siga, C.ink, AZUL) }}>Me siga</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>para mais dicas de farmacologia e curiosidades sobre a área</span>
        </Card>
      </Part>

      {/* 10. tela final */}
      <Part from={T.final - 4} to={DURATION_FUMACA} inY={100} outDur={1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map((l, i) => {
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
                color: i === 1 ? bornColor(f, at, AZUL, "#eff6ff", 20) : bornColor(f, at, C.ink, AZUL),
                opacity: k,
                transform: `translateY(${(1 - k) * 40}px)`,
              }}
            >
              {l}
            </div>
          );
        })}
      </Part>
      <Grain />
      <Audio src={staticFile("fumaca/narracao.mp3")} />
      <Audio src={staticFile("fumaca/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION_FUMACA - 60, DURATION_FUMACA))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
