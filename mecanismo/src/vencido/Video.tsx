import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, OUT, P, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// "Remédio vencido vira veneno?" — Modelo 1, tudo desenhado em código.
// Roteiro e fontes: roteiros/remedio_vencido.md. Narração da Juliana; tempos alinhados em fala.json.
const VERM = "#ef4444",
  AMBAR = "#fbbf24",
  VERDE = "#4ade80",
  AZUL = "#60a5fa";

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
  vencido: Tw("vencido"),
  veneno: Tw("veneno"),
  nao: Tw("não"),
  tomar: Tw("tomar"),
  forca: Tw("acontece") - 10,
  perdendo: Tw("perdendo"),
  validade: Tw("validade"),
  fabricante: Tw("fabricante"),
  certa: Tw("certa"),
  fraco: Tw("e") - 4,
  perigoso: Tw("perigoso"),
  insulina: Tw("insulina"),
  antibiotico: Tw("antibiótico"),
  continua: Tw("continua"),
  resistente: Tw("resistente"),
  liquidos: Tw("os") - 6,
  xaropes: Tw("xaropes"),
  colirios: Tw("colírios"),
  suspensao: Tw("suspensão"),
  fungos: Tw("fungos"),
  aberto: Tw("aberto"),
  menor: Tw("menor"),
  bula: Tw("bula"),
  caso: Tw("já") - 6,
  verdade: Tw("verdade"),
  tetraciclina: Tw("tetraciclina"),
  anos: Tw("anos"),
  nem: Tw("nem"),
  entao: Tw("então") - 6,
  naoTome: Tw("tome") - 4,
  lixo: Tw("lixo"),
  pia: Tw("pia"),
  coleta: Tw("coleta"),
  farmacias: Tw("farmácias"),
  siga: Tw("me") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_VENCIDO = T.final + 90;
// FIM TEMPOS
const SFX: [number, string, number][] = [
  [T.vencido + 4, "trava", 0.3],
  [T.nao, "pop", 0.22],
  [T.forca, "whoosh", 0.25],
  [T.validade, "pop", 0.2],
  [T.fraco, "whoosh", 0.25],
  [T.insulina, "pop", 0.2],
  [T.antibiotico, "pop", 0.2],
  [T.resistente, "trava", 0.28],
  [T.liquidos, "whoosh", 0.25],
  [T.fungos, "pop", 0.2],
  [T.aberto, "plim", 0.22],
  [T.caso, "whoosh", 0.25],
  [T.nem + 6, "trava", 0.3],
  [T.entao, "whoosh", 0.25],
  [T.naoTome, "trava", 0.3],
  [T.coleta, "plim", 0.25],
  [T.siga, "whoosh", 0.25],
  [T.final, "plim", 0.3],
];

// carimbo inclinado
const Carimbo: React.FC<{ f: number; at: number; x: number; y: number; texto: string; cor?: string; size?: number; rot?: number }> = ({
  f,
  at,
  x,
  y,
  texto,
  cor = VERM,
  size = 76,
  rot = -12,
}) => {
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
        letterSpacing: 5,
        color: cor,
        background: rgba(cor, 0.08),
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// risco vermelho por cima de algo
const Risco: React.FC<{ f: number; at: number; x: number; y: number; w: number }> = ({ f, at, x, y, w }) => {
  if (f < at) return null;
  const k = it(f, at, at + 8, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w * k,
        height: 14,
        borderRadius: 7,
        background: VERM,
        transform: "rotate(-18deg)",
        transformOrigin: "left center",
        boxShadow: `0 0 18px ${rgba(VERM, 0.6)}`,
      }}
    />
  );
};

// caixa de remédio com a data de validade
const Caixa: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, 0, 14, 0, 1, SNAP);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(540,1180) scale(${0.6 + 0.4 * k}) rotate(-6)`}>
        <path d="M-300,-170 L-210,-250 L330,-250 L240,-170 Z" fill="#cbd5e1" />
        <path d="M240,-170 L330,-250 L330,130 L240,210 Z" fill="#94a3b8" />
        <rect x={-300} y={-170} width={540} height={380} rx={8} fill="#f1f5f9" />
        <rect x={-300} y={-170} width={540} height={90} fill={AZUL} />
        <text x={-30} y={-110} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={50} fill="#fff">
          REMÉDIO
        </text>
        <text x={-30} y={-10} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={40} fill="#334155">
          20 comprimidos
        </text>
        <rect x={-250} y={60} width={440} height={100} rx={10} fill="#e2e8f0" />
        <text x={-30} y={127} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={52} fill="#0f172a">
          VAL 03/2025
        </text>
      </g>
    </svg>
  );
};

// barra de potência que vai caindo depois da data
const Potencia: React.FC<{ f: number }> = ({ f }) => {
  const cai = it(f, T.perdendo - 4, T.perdendo + 60, 0, 1, OUT);
  const v = Math.round(100 - 45 * cai);
  const cor = cai > 0.5 ? AMBAR : VERDE;
  return (
    <div style={{ position: "absolute", left: 140, top: 560, width: 800 }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink, display: "flex", justifyContent: "space-between" }}>
        <span>💊 força do remédio</span>
        <span style={{ color: cor }}>{v}%</span>
      </div>
      <div style={{ marginTop: 18, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.25)", overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", borderRadius: 32, background: cor, boxShadow: `0 0 24px ${rgba(cor, 0.6)}` }} />
      </div>
    </div>
  );
};

// cartão com emoji grande, título e linha de efeito
const Cartao: React.FC<{ f: number; at: number; y: number; emoji: string; titulo: string; efeito: string; efeitoAt: number; cor: string }> = ({
  f,
  at,
  y,
  emoji,
  titulo,
  efeito,
  efeitoAt,
  cor,
}) => (
  <Card f={f} at={at} x={110} y={y} w={860} h={300} border={rgba(cor, 0.7)} style={{ display: "flex", alignItems: "center", gap: 36, padding: "0 50px" }}>
    <span style={{ fontFamily: EMOJI, fontSize: 130 }}>{emoji}</span>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: bornColor(f, at, C.ink, cor) }}>{titulo}</span>
      <span style={{ fontWeight: 700, fontSize: 40, color: cor, opacity: P(f, efeitoAt, efeitoAt + 10) }}>{efeito}</span>
    </div>
  </Card>
);

// frasco com micróbios que aparecem
const Frasco: React.FC<{ f: number; at: number; x: number; emoji: string; nome: string }> = ({ f, at, x, emoji, nome }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", left: x, top: 1060, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * k})`, opacity: Math.min(1, k * 1.5), textAlign: "center" }}>
      <div style={{ fontFamily: EMOJI, fontSize: 150, lineHeight: 1 }}>{emoji}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.ink, marginTop: 14 }}>{nome}</div>
    </div>
  );
};

const Microbios: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at) return null;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const a = at + i * 4;
        if (f < a) return null;
        const k = it(f, a, a + 12, 0, 1, SNAP);
        const x = 200 + (i % 3) * 340 + Math.sin(f / 15 + i) * 18;
        const y = 900 + Math.floor(i / 3) * 110 + Math.cos(f / 18 + i) * 14;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, fontFamily: EMOJI, fontSize: 64 }}>
            🦠
          </div>
        );
      })}
    </>
  );
};

// cápsula antiga
const Capsula: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <g transform={`translate(540,1020) rotate(${-25 + Math.sin(f / 25) * 3}) scale(${k})`} style={{ filter: "sepia(0.6)" }}>
        <path d="M-260,-90 L0,-90 L0,90 L-260,90 A90,90 0 0 1 -260,-90 Z" fill="#f59e0b" />
        <path d="M0,-90 L260,-90 A90,90 0 0 1 260,90 L0,90 Z" fill="#fde68a" />
        <rect x={-300} y={-60} width={520} height={22} rx={11} fill="rgba(255,255,255,0.35)" />
      </g>
    </svg>
  );
};

// ícone riscado ou aprovado
const Destino: React.FC<{ f: number; at: number; x: number; emoji: string; nome: string; ok?: boolean }> = ({ f, at, x, emoji, nome, ok = false }) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  const marca = it(f, at + 6, at + 14, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", left: x, top: 1240, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * k})`, opacity: Math.min(1, k * 1.5), textAlign: "center" }}>
      <div style={{ position: "relative", fontFamily: EMOJI, fontSize: ok ? 180 : 150, lineHeight: 1, opacity: ok ? 1 : 1 - 0.45 * marca }}>
        {emoji}
        <div style={{ position: "absolute", right: -30, bottom: -20, fontSize: 70, transform: `scale(${marca})` }}>{ok ? "✅" : "❌"}</div>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: ok ? 44 : 36, color: ok ? VERDE : C.ink, marginTop: 18 }}>{nome}</div>
    </div>
  );
};

export const VideoVencido: React.FC = () => {
  const f = useCurrentFrame();
  const corFundo = f < T.forca ? VERM : f < T.fraco ? VERDE : f < T.caso ? AMBAR : f < T.entao ? AMBAR : VERDE;
  return (
    <AbsoluteFill>
      <Background color={corFundo} pulses={[T.vencido, T.nao, T.resistente, T.aberto, T.nem, T.naoTome, T.coleta, T.final]} />

      {/* 1. gancho: remédio vencido vira veneno? */}
      <Part from={0} to={T.forca}>
        <Title f={f} at={2} y={200} size={84} font={SANS} weight={900} from={VERM}>
          REMÉDIO VENCIDO
          <br />
          VIRA VENENO?
        </Title>
        <Caixa f={f} />
        <Carimbo f={f} at={T.vencido + 4} x={600} y={1090} texto="VENCIDO" />
        <Emoji f={f} at={T.veneno} x={860} y={700} size={150}>
          ☠️
        </Emoji>
        <Risco f={f} at={T.nao} x={860} y={690} w={240} />
        <Pill x={540} y={1560} text="na maioria das vezes, NÃO" color={VERDE} size={46} k={P(f, T.nao, T.nao + 12)} />
        <Pill x={540} y={1690} text="…mas também não pode tomar ✋" color={AMBAR} size={42} k={P(f, T.tomar - 4, T.tomar + 8)} />
      </Part>

      {/* 2. perde a força */}
      <Part from={T.forca} to={T.fraco}>
        <Title f={f} at={T.forca + 4} y={240} size={78} weight={600} from={VERDE}>
          ele vai perdendo a força
        </Title>
        <Potencia f={f} />
        <Card f={f} at={T.validade - 4} x={110} y={900} w={860} h={300} border={rgba(AZUL, 0.7)} style={{ display: "flex", alignItems: "center", gap: 36, padding: "0 50px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 120 }}>📅</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64 }}>validade</span>
            <span style={{ fontWeight: 700, fontSize: 40, color: AZUL, opacity: P(f, T.fabricante, T.fabricante + 10) }}>= garantia do fabricante</span>
          </div>
        </Card>
        <Pill x={540} y={1400} text="até a data: dose certa ✅" color={VERDE} size={46} k={P(f, T.certa - 4, T.certa + 8)} />
      </Part>

      {/* 3. remédio fraco pode ser perigoso */}
      <Part from={T.fraco} to={T.liquidos}>
        <Title f={f} at={T.fraco + 4} y={220} size={78} weight={600} from={AMBAR}>
          remédio fraco = <span style={{ color: VERM }}>perigo</span>
        </Title>
        <Cartao f={f} at={T.insulina - 4} y={560} emoji="💉" titulo="insulina" efeito="a glicose continua alta 🩸" efeitoAt={T.insulina + 24} cor={AMBAR} />
        <Cartao f={f} at={T.antibiotico - 4} y={920} emoji="🦠" titulo="antibiótico" efeito="a infecção continua" efeitoAt={T.continua - 4} cor={VERM} />
        <Pill x={540} y={1400} text="🛡️ e a bactéria fica mais resistente" color={VERM} size={42} k={P(f, T.resistente - 6, T.resistente + 6)} />
      </Part>

      {/* 4. os líquidos */}
      <Part from={T.liquidos} to={T.caso}>
        <Title f={f} at={T.liquidos + 4} y={220} size={74} weight={600} from={AMBAR}>
          os líquidos são os mais delicados
        </Title>
        {f < T.aberto - 6 ? (
          <>
            <Frasco f={f} at={T.xaropes - 12} x={230} emoji="🧴" nome="xarope" />
            <Frasco f={f} at={T.colirios - 4} x={540} emoji="💧" nome="colírio" />
            <Frasco f={f} at={T.suspensao - 4} x={850} emoji="🧪" nome="suspensão" />
            <Microbios f={f} at={T.fungos - 4} />
            <Pill x={540} y={1420} text="podem se contaminar" color={VERM} size={44} k={P(f, T.fungos - 4, T.fungos + 8)} />
          </>
        ) : (
          <>
            <Emoji f={f} at={T.aberto - 6} x={540} y={820} size={190}>
              🔓
            </Emoji>
            <Card f={f} at={T.aberto} x={110} y={1000} w={860} h={250} border={rgba(AMBAR, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 46 }}>depois de aberto ou preparado</span>
              <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: AMBAR, opacity: P(f, T.menor - 6, T.menor + 6) }}>validade MENOR</span>
            </Card>
            <Pill x={540} y={1420} text="📄 está escrito na bula" color={AZUL} size={44} k={P(f, T.bula - 6, T.bula + 6)} />
          </>
        )}
      </Part>

      {/* 5. a exceção histórica */}
      <Part from={T.caso} to={T.entao}>
        <Title f={f} at={T.caso + 4} y={220} size={74} weight={600} from={VERM}>
          o caso que fez mal de verdade
        </Title>
        <Capsula f={f} at={T.verdade} />
        <Pill x={540} y={1320} text="tetraciclina · anos 60" color={AMBAR} size={48} k={P(f, T.tetraciclina - 4, T.tetraciclina + 8)} />
        <Carimbo f={f} at={T.nem + 6} x={540} y={1530} texto="NÃO EXISTE MAIS" size={58} rot={-6} />
      </Part>

      {/* 6. o que fazer */}
      <Part from={T.entao} to={T.siga}>
        <Title f={f} at={T.entao + 4} y={220} size={84} font={SANS} weight={900} from={VERM}>
          VENCEU?
        </Title>
        <Emoji f={f} at={T.naoTome - 2} x={540} y={600} size={170}>
          ✋
        </Emoji>
        <Pill x={540} y={810} text="não tome" color={VERM} size={56} k={P(f, T.naoTome, T.naoTome + 10)} />
        {f < T.coleta - 6 ? (
          <>
            <Destino f={f} at={T.lixo - 6} x={230} emoji="🗑️" nome="lixo" />
            <Destino f={f} at={T.pia - 4} x={540} emoji="🚰" nome="pia" />
            <Destino f={f} at={T.pia + 4} x={850} emoji="🚽" nome="vaso" />
          </>
        ) : (
          <Destino f={f} at={T.coleta - 6} x={540} emoji="🏥" nome="ponto de coleta" ok />
        )}
        <Pill x={540} y={1560} text="muitas farmácias têm 💊" color={VERDE} size={44} k={P(f, T.farmacias - 4, T.farmacias + 8)} />
      </Part>

      {/* 7. me siga */}
      <Part from={T.siga} to={T.final}>
        <Emoji f={f} at={T.siga + 4} x={540} y={620} size={150}>
          👩‍⚕️
        </Emoji>
        <Card f={f} at={T.siga} x={110} y={760} w={860} h={300} border={rgba(VERDE, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "0 40px" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: bornColor(f, T.siga, C.ink, VERDE) }}>Me siga</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>para mais dicas de farmacologia e curiosidades sobre a área</span>
        </Card>
      </Part>

      {/* 8. tela final */}
      <Part from={T.final - 4} to={DURATION_VENCIDO} inY={100} outDur={1}>
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
                color: i === 1 ? bornColor(f, at, VERDE, "#f0fdf4", 20) : bornColor(f, at, C.ink, VERDE),
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
      <Audio src={staticFile("vencido/narracao.mp3")} />
      <Audio src={staticFile("vencido/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION_VENCIDO - 60, DURATION_VENCIDO))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
