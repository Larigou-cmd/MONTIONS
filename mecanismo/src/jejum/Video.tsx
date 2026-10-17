import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Grain, IN, OUT, P, Part, Pill, SNAP, W, bornColor, it, mix, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";

// "Por que alguns remédios devem ser tomados em jejum?" no modelo "aula elegante" (roteiro da Larissa).
// Tempos em quadros (30 fps), tirados de audio/jejum_palavras.json (quadro = segundos × 30).
const COR = "#fbbf24"; // café da manhã
const M1 = "#60a5fa"; // motivo 1: ímã / quelação
const M2 = "#f472b6"; // motivo 2: porta
const M3 = "#fb923c"; // motivo 3: bombas de ácido
const VERDE = "#4ade80", VERM = "#ef4444", CAFE = "#b45309";

// TEMPOS
const T = {
  cafe: 50,
  metade: 154,
  bula: 187,
  horas: 302,
  antes: 451,
  depois: 509,
  importa: 552,
  tres: 650,
  motivo1: 730,
  grudam: 816,
  leite: 917,
  queijo: 948,
  ferro: 989,
  antiacidos: 1006,
  bolinha: 1079,
  quelacao: 1193,
  tetra: 1229,
  cipro: 1346,
  estudo: 1392,
  terco: 1519,
  embora: 1603,
  motivo2: 1759,
  vazio: 1872,
  levo: 1956,
  pegadinha: 2208,
  cafePreto: 2256,
  captopril: 2407,
  alendronato: 2496,
  absorvido: 2609,
  agua: 2753,
  deitar: 2804,
  esofago: 2904,
  motivo3: 2933,
  omeprazol: 3023,
  bombinhas: 3088,
  ligam: 3221,
  desligar: 3310,
  refeicao: 3372,
  forca: 3624,
  atrasado: 3658,
  cuidado: 3757,
  comComida: 3835,
  ibuprofeno: 3905,
  litio: 4086,
  itraconazol: 4183,
  regra: 4351,
  fazAssim: 4471,
  bula2: 4507,
  farmaceutico: 4589,
  agua2: 4716,
  varios: 4807,
  mudar: 4942,
  manda: 5074,
  segue: 5196,
  final: 5299,
};
export const DURATION = 5384; // 179.5 s (narração de 176,2 s + mensagem final; abaixo de 3 min)
const PARTES: [number, number][] = [
  [0, 185],
  [179, 730],
  [724, 1759],
  [1753, 2933],
  [2927, 3757],
  [3751, 4471],
  [4465, 5074],
  [5068, 5301],
  [5295, DURATION],
];
// FIM TEMPOS

const SFX: [number, string, number][] = [
  [T.cafe, "pop", 0.25], [T.metade, "trava", 0.35],
  [R0(1), "whoosh", 0.3], [T.horas, "pop", 0.2], [T.antes, "pop", 0.22], [T.depois, "pop", 0.22], [T.tres, "plim", 0.22],
  [R0(2), "whoosh", 0.3], [T.grudam, "pop", 0.22], [T.bolinha, "trava", 0.35], [T.quelacao, "plim", 0.25], [T.cipro, "pop", 0.22], [T.terco, "trava", 0.35],
  [R0(3), "whoosh", 0.3], [T.levo, "pop", 0.25], [T.cafePreto, "trava", 0.35], [T.captopril, "pop", 0.22], [T.alendronato, "pop", 0.25], [T.deitar, "trava", 0.32],
  [R0(4), "whoosh", 0.3], [T.ligam, "pop", 0.25], [T.desligar, "trava", 0.38], [T.forca, "plim", 0.25], [T.atrasado, "pop", 0.22],
  [R0(5), "whoosh", 0.3], [T.cuidado, "trava", 0.4], [T.ibuprofeno, "pop", 0.22], [T.litio, "pop", 0.22], [T.itraconazol, "pop", 0.22], [T.regra, "plim", 0.28],
  [R0(6), "whoosh", 0.3], [T.bula2, "pop", 0.22], [T.farmaceutico, "pop", 0.22], [T.agua2, "pop", 0.22], [T.varios, "pop", 0.22],
  [R0(7), "whoosh", 0.3], [T.manda, "pop", 0.25], [T.segue, "plim", 0.25],
  [R0(8), "whoosh", 0.3], [T.final, "plim", 0.3],
];
function R0(i: number) { return PARTES[i][0]; }
const MENSAGEM_FINAL = ["Consulte um", "profissional de saúde", "para orientações."];

const R = (i: number) => PARTES[i];
const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={W} height={1920} style={{ position: "absolute" }}>{children}</svg>;
// trecho dentro de uma parte: entra e sai com desfoque
const Fase: React.FC<{ f: number; de: number; ate?: number; children: React.ReactNode }> = ({ f, de, ate, children }) => {
  if (f < de - 2 || (ate !== undefined && f > ate)) return null;
  const a = Math.min(it(f, de - 2, de + 10, 0, 1, OUT), ate === undefined ? 1 : 1 - it(f, ate - 12, ate, 0, 1, IN));
  return <AbsoluteFill style={{ opacity: a, filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};
const Item: React.FC<{ f: number; at: number; y: number; icone: string; texto: React.ReactNode; cor?: string; h?: number }> = ({ f, at, y, icone, texto, cor, h = 140 }) => (
  <Card f={f} at={at} x={60} y={y} w={960} h={h} border={cor ? rgba(cor, 0.6) : C.boxBorder} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}>
    <span style={{ fontFamily: EMOJI, fontSize: 58, flexShrink: 0 }}>{icone}</span>
    <span style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.25, color: bornColor(f, at, C.ink, cor ?? COR) }}>{texto}</span>
  </Card>
);
const Marca: React.FC<{ x: number; y: number; k: number; ok: boolean; size?: number }> = ({ x, y, k, ok, size = 100 }) =>
  k <= 0 ? null : (
    <text x={x} y={y} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={size * SNAP(Math.min(1, k))} fill={ok ? VERDE : C.alert} style={{ filter: `drop-shadow(0 0 16px ${ok ? VERDE : C.alert})` }}>{ok ? "✓" : "✕"}</text>
  );
// selo "MOTIVO n" no topo
const Motivo: React.FC<{ f: number; at: number; n: number; icone: string; cor: string; titulo: string }> = ({ f, at, n, icone, cor, titulo }) => (
  <>
    <Pill x={540} y={225} text={`MOTIVO ${n} ${icone}`} color={cor} size={40} k={P(f, at, at + 12)} />
    <Title f={f} at={at + 8} y={300} size={50} weight={600} color={C.ink} from={cor}>{titulo}</Title>
  </>
);
// comprimido (cápsula) desenhado
const Capsula: React.FC<{ x: number; y: number; s?: number; cor?: string; rot?: number }> = ({ x, y, s = 1, cor = COR, rot = -20 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={-38} width={180} height={76} rx={38} fill={cor} />
    <rect x={0} y={-38} width={90} height={76} rx={38} fill="#fef3c7" />
    <rect x={0} y={-38} width={40} height={76} fill="#fef3c7" />
    <rect x={-70} y={-26} width={60} height={12} rx={6} fill="#ffffff" opacity={0.45} />
  </g>
);

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const nivel = 1 - 0.5 * it(f, T.metade, T.metade + 30, 0, 1, OUT);
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <div style={{ position: "absolute", top: 210, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 80, lineHeight: 1.08, color: C.ink, opacity: it(f, 2, 14, 0, 1, OUT), textShadow: `0 0 30px ${rgba(COR, 0.45)}` }}>
        VOCÊ TOMA<br />REMÉDIO ASSIM? <span style={{ fontFamily: EMOJI }}>☕💊</span>
      </div>
      <Emoji f={f} at={6} x={330} y={760} size={240}>☕</Emoji>
      <Tela>
        <text x={540} y={800} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={110} fill={C.dim} opacity={P(f, 10, 20)}>+</text>
        <g opacity={P(f, 12, 24)}><Capsula x={760} y={760} s={1.2} /></g>
        {/* bateria do remédio */}
        {f >= T.metade - 20 && (
          <g opacity={P(f, T.metade - 20, T.metade - 6)}>
            <rect x={220} y={1000} width={600} height={120} rx={22} fill="none" stroke={C.ink} strokeWidth={7} />
            <rect x={826} y={1035} width={26} height={50} rx={8} fill={C.ink} />
            <rect x={236} y={1016} width={568 * nivel} height={88} rx={14} fill={mix(VERDE, COR, 1 - nivel)} style={{ filter: `drop-shadow(0 0 14px ${mix(VERDE, COR, 1 - nivel)})` }} />
            <text x={520} y={1082} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={54} fill="#ffffff" stroke="#0f172a" strokeWidth={8} paintOrder="stroke">{Math.round(nivel * 100)}%</text>
          </g>
        )}
      </Tela>
      <Title f={f} at={T.metade} y={1180} size={50} weight={600} color={C.ink} from={COR}>funcionando pela metade?</Title>
    </Part>
  );
};

// 2. o que é "jejum" para o remédio
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 100, x1 = 980, ly = 720;
  const zona = (a: number, b: number, at: number, cor: string, txt: string) => {
    const k = P(f, at, at + 14);
    return k <= 0 ? null : (
      <g opacity={k}>
        <rect x={a} y={ly - 70} width={(b - a) * k} height={140} rx={20} fill={rgba(cor, 0.22)} stroke={cor} strokeWidth={4} />
        <text x={(a + b) / 2} y={ly + 120} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={cor}>{txt}</text>
      </g>
    );
  };
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title f={f} at={T.bula} y={225} size={62} weight={600} from={COR}>“Tomar em jejum”</Title>
      <Pill x={540} y={345} text="🙅 não precisa ficar horas sem comer" color={COR} size={34} k={P(f, T.horas, T.horas + 12)} />
      <Tela>
        <g opacity={P(f, T.antes - 16, T.antes - 4)}>
          <line x1={x0} y1={ly} x2={x1} y2={ly} stroke={C.dim} strokeWidth={5} />
          <text x={540} y={ly + 34} textAnchor="middle" fontFamily={EMOJI} fontSize={110}>🍽️</text>
          <text x={540} y={ly - 90} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={C.dim}>refeição</text>
        </g>
        {zona(130, 450, T.antes, VERDE, "30–60 min ANTES")}
        {zona(630, 950, T.depois, VERDE, "2 h DEPOIS")}
      </Tela>
      <div style={{ position: "absolute", top: 940, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, lineHeight: 1.25, color: C.ink, opacity: P(f, T.depois + 10, T.depois + 24) }}>
        JEJUM = <span style={{ fontFamily: EMOJI }}>⏰</span> <span style={{ color: VERDE }}>30–60 min ANTES</span><br />ou <span style={{ color: VERDE }}>2 h DEPOIS</span> de comer
      </div>
      <Title f={f} at={T.importa} y={1110} size={40} font={SANS} weight={600} color={C.dim} from={COR}>a comida atrapalha de 3 jeitos:</Title>
      {[["🧲", M1], ["🚪", M2], ["🏭", M3]].map(([e, c], i) => (
        <Card key={e} f={f} at={T.tres + i * 6} x={120 + i * 290} y={1190} w={260} h={170} tilt={[-1.5, 0.8, -0.6][i]} border={rgba(c, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <span style={{ fontFamily: EMOJI, fontSize: 70 }}>{e}</span>
          <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 34, color: c }}>{i + 1}</span>
        </Card>
      ))}
    </Part>
  );
};

// 3. motivo 1: quelação (o cálcio "sequestra" o remédio)
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const g = it(f, T.grudam, T.grudam + 40, 0, 1, OUT); // íons grudando
  const cai = it(f, T.bolinha, T.bolinha + 30, 0, 1, OUT); // bolinha desce até o intestino
  const px = 540, py = 600 + 170 * cai;
  const ions = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const fromX = i % 2 === 0 ? 120 : 960, fromY = 560 + (i % 4) * 50;
    const tx = px + Math.cos(a) * 120, ty = py + Math.sin(a) * 75;
    return { x: fromX + (tx - fromX) * g, y: fromY + (ty - fromY) * g };
  });
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Motivo f={f} at={T.motivo1} n={1} icone="🧲" cor={M1} titulo="a comida “sequestra” o remédio" />
      <Fase f={f} de={T.motivo1} ate={T.tetra}>
        <Tela>
          {/* intestino */}
          <g opacity={P(f, T.grudam, T.grudam + 12)}>
            <rect x={80} y={880} width={920} height={34} rx={17} fill={rgba("#f9a8d4", 0.5)} stroke="#f9a8d4" strokeWidth={3} />
            <text x={540} y={960} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={28} fill={C.dim}>parede do intestino</text>
          </g>
          <g opacity={P(f, T.grudam - 6, T.grudam + 6)}>
            <text x={120} y={540} textAnchor="middle" fontFamily={EMOJI} fontSize={90}>🥛</text>
            <text x={960} y={540} textAnchor="middle" fontFamily={EMOJI} fontSize={90}>🧀</text>
          </g>
          <Capsula x={px} y={py} s={0.9} />
          {f >= T.grudam &&
            ions.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={30} fill={M1} style={{ filter: `drop-shadow(0 0 10px ${M1})` }} />
                <text x={p.x} y={p.y + 10} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#0f172a">Ca</text>
              </g>
            ))}
          <Marca x={800} y={860} k={P(f, T.bolinha + 24, T.bolinha + 36)} ok={false} />
        </Tela>
        <Pill x={300} y={1040} text="🥛 leite" color={M1} size={30} k={P(f, T.leite, T.leite + 10)} />
        <Pill x={540} y={1040} text="🥣 iogurte" color={M1} size={30} k={P(f, T.leite + 8, T.leite + 18)} />
        <Pill x={780} y={1040} text="🧀 queijo" color={M1} size={30} k={P(f, T.queijo, T.queijo + 10)} />
        <Pill x={400} y={1120} text="🔩 ferro" color={M1} size={30} k={P(f, T.ferro, T.ferro + 10)} />
        <Pill x={680} y={1120} text="💊 antiácidos" color={M1} size={30} k={P(f, T.antiacidos, T.antiacidos + 10)} />
        <Pill x={540} y={1210} text="forma uma bolinha que o intestino não absorve" color={VERM} size={30} k={P(f, T.bolinha, T.bolinha + 12)} />
        <Title f={f} at={T.quelacao} y={1290} size={86} weight={600} color={M1} from={M1}>QUELAÇÃO</Title>
      </Fase>
      <Fase f={f} de={T.tetra}>
        <Title f={f} at={T.tetra} y={420} size={40} font={SANS} weight={600} color={C.dim} from={M1}>exemplo clássico: antibióticos</Title>
        <Card f={f} at={T.tetra} x={60} y={500} w={465} h={130} tilt={-1} border={rgba(M1, 0.6)} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 44 }}>tetraciclina</Card>
        <Card f={f} at={T.cipro} x={555} y={500} w={465} h={130} tilt={1} border={rgba(M1, 0.6)} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 42 }}>ciprofloxacino</Card>
        <Title f={f} at={T.estudo} y={700} size={38} font={SANS} weight={600} color={C.ink} from={M1}>ciprofloxacino no sangue:</Title>
        <Tela>
          {f >= T.estudo + 6 && (
            <g opacity={P(f, T.estudo + 6, T.estudo + 18)}>
              <text x={100} y={830} fontFamily={SANS} fontWeight={700} fontSize={34} fill={C.ink}>💧 com água</text>
              <rect x={380} y={795} width={600 * P(f, T.estudo + 6, T.estudo + 26)} height={56} rx={14} fill={VERDE} />
              <text x={100} y={950} fontFamily={SANS} fontWeight={700} fontSize={34} fill={C.ink}>🥛 com leite</text>
              <rect x={380} y={915} width={600 * (1 - 0.33 * P(f, T.terco, T.terco + 20)) * P(f, T.estudo + 10, T.estudo + 30)} height={56} rx={14} fill={mix(VERDE, VERM, P(f, T.terco, T.terco + 20))} />
              <text x={980} y={1010} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={36} fill={VERM} opacity={P(f, T.terco + 10, T.terco + 22)}>≈ 1/3 a menos</text>
            </g>
          )}
        </Tela>
        <Item f={f} at={T.embora} y={1110} icone="🥛" texto={<>uma parte do antibiótico <b style={{ color: "#fca5a5" }}>vai embora</b> com o leite</>} cor={VERM} />
      </Fase>
    </Part>
  );
};

// porta do intestino: livre (jejum) ou lotada de comida
const Porta: React.FC<{ f: number; x: number; y: number; lotada: boolean; at: number }> = ({ f, x, y, lotada, at }) => {
  const k = P(f, at, at + 14);
  const cor = lotada ? VERM : VERDE;
  return (
    <g opacity={k} transform={`translate(${x},${y})`}>
      <rect x={-200} y={60} width={400} height={30} rx={15} fill={rgba("#f9a8d4", 0.5)} stroke="#f9a8d4" strokeWidth={3} />
      <rect x={-50} y={50} width={100} height={50} rx={8} fill="#0f172a" stroke={cor} strokeWidth={5} />
      {lotada &&
        Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={-150 + (i % 7) * 50 + Math.sin(f / 9 + i) * 4} cy={10 - Math.floor(i / 7) * 46} r={20} fill={["#a3e635", "#fde68a", "#fca5a5", "#d6d3d1"][i % 4]} />
        ))}
      {/* comprimidos tentando passar */}
      {Array.from({ length: 3 }, (_, i) => {
        const p = ((f - at) / 50 + i / 3) % 1;
        const yy = lotada ? -60 + Math.min(p, 0.4) * 60 : -60 + p * 200;
        return f >= at ? <circle key={i} cx={-10 + i * 10} cy={yy} r={14} fill={COR} opacity={lotada ? 1 : 1 - p * 0.6} /> : null;
      })}
      <text x={0} y={170} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={cor}>{lotada ? "com comida ✕" : "estômago vazio ✓"}</text>
    </g>
  );
};

// 4. motivo 2: a comida atrapalha a absorção
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Motivo f={f} at={T.motivo2} n={2} icone="🚪" cor={M2} titulo="a comida atrapalha a absorção" />
      <Fase f={f} de={T.motivo2} ate={T.captopril}>
        <Tela>
          <Porta f={f} x={290} y={470} lotada={false} at={T.vazio - 20} />
          <Porta f={f} x={790} y={470} lotada at={T.vazio + 10} />
        </Tela>
        <Card f={f} at={T.levo} x={60} y={760} w={960} h={190} border={rgba(M2, 0.7)} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 34px", boxShadow: `0 0 26px ${rgba(M2, 0.25)}` }}>
          <span style={{ fontFamily: EMOJI, fontSize: 80 }}>🦋</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: M2 }}>levotiroxina</span>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32 }}>tireoide • 30–60 min antes do café da manhã</span>
          </span>
        </Card>
        <Pill x={540} y={1040} text="⚠️ pegadinha:" color={COR} size={32} k={P(f, T.pegadinha, T.pegadinha + 12)} />
        <Item f={f} at={T.cafePreto} y={1100} icone="☕" texto={<>até o <b style={{ color: "#fca5a5" }}>café preto</b> atrapalha a absorção</>} cor={CAFE} />
      </Fase>
      <Fase f={f} de={T.captopril}>
        <Card f={f} at={T.captopril} x={60} y={420} w={960} h={130} border={rgba(M2, 0.6)} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 60 }}>🩺</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: M2 }}>captopril</span>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.dim }}>pressão</span>
        </Card>
        <Card f={f} at={T.alendronato} x={60} y={600} w={960} h={170} border={rgba(M2, 0.8)} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px", boxShadow: `0 0 30px ${rgba(M2, 0.3)}` }}>
          <span style={{ fontFamily: EMOJI, fontSize: 70 }}>🦴</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: M2 }}>alendronato</span>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.dim }}>osteoporose • o mais exigente de todos</span>
          </span>
        </Card>
        <Item f={f} at={T.absorvido} y={820} icone="📉" texto={<>menos de <b style={{ color: M2 }}>1%</b> é absorvido</>} cor={M2} h={120} />
        <Item f={f} at={T.agua} y={965} icone="💧" texto="em jejum, só com água pura" cor={M2} h={120} />
        <Item f={f} at={T.deitar} y={1110} icone="🚫" texto={<>não deitar por <b style={{ color: M2 }}>30 min</b></>} cor={VERM} h={120} />
        <Pill x={540} y={1290} text="pode machucar o esôfago" color={VERM} size={32} k={P(f, T.esofago, T.esofago + 12)} />
      </Fase>
    </Part>
  );
};

// 5. motivo 3: as bombas de ácido e o omeprazol
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const on = P(f, T.ligam, T.ligam + 20);
  const bloq = P(f, T.desligar + 10, T.desligar + 30);
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Motivo f={f} at={T.motivo3} n={3} icone="🏭" cor={M3} titulo="o remédio precisa chegar antes" />
      <Title f={f} at={T.omeprazol} y={380} size={60} weight={600} color={VERDE} from={VERDE}>omeprazol</Title>
      <Tela>
        <g opacity={P(f, T.bombinhas, T.bombinhas + 12)}>
          <text x={540} y={455} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={30} fill={C.dim}>bombas de ácido do estômago</text>
          {Array.from({ length: 6 }, (_, i) => {
            const x = 140 + i * 160, y = 640;
            const acesa = on * (1 - bloq);
            const cor = mix("#475569", M3, acesa);
            return (
              <g key={i}>
                <rect x={x - 60} y={y - 70} width={120} height={140} rx={24} fill={rgba(cor, 0.25)} stroke={cor} strokeWidth={5} style={{ filter: acesa > 0.5 ? `drop-shadow(0 0 14px ${M3})` : undefined }} />
                <text x={x} y={y + 18} textAnchor="middle" fontFamily={EMOJI} fontSize={56} opacity={0.6 + 0.4 * acesa}>⚙️</text>
                {acesa > 0.05 && Array.from({ length: 3 }, (_, k) => {
                  const p = ((f / 30) + k / 3 + i * 0.1) % 1;
                  return <text key={k} x={x - 20 + k * 20} y={y - 80 - p * 50} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill={M3} opacity={(1 - p) * acesa}>H⁺</text>;
                })}
                {bloq > 0 && (
                  <g opacity={bloq}>
                    <circle cx={x + 44} cy={y + 52} r={26} fill={VERDE} />
                    <text x={x + 44} y={y + 62} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill="#0f172a">✕</text>
                  </g>
                )}
              </g>
            );
          })}
          <text x={540} y={790} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={mix("#94a3b8", M3, on)}>{f < T.ligam ? "em jejum: quase todas desligadas" : bloq > 0.5 ? "omeprazol desliga as bombas ligadas" : "🍽️ você come: elas LIGAM"}</text>
        </g>
      </Tela>
      <Card f={f} at={T.refeicao} x={60} y={880} w={960} h={170} border={rgba(VERDE, 0.7)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 30px" }}>
        <span style={{ fontFamily: EMOJI, fontSize: 64 }}>💊</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: VERDE }}>30–60 min antes</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.dim }}>→</span>
        <span style={{ fontFamily: EMOJI, fontSize: 64 }}>🍽️</span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34 }}>1ª refeição</span>
      </Card>
      <Title f={f} at={T.forca} y={1110} size={48} font={SANS} weight={800} color={VERDE} from={VERDE}>força total 💪</Title>
      <Item f={f} at={T.atrasado} y={1210} icone="🎉" texto={<>tomar depois de comer = <b style={{ color: M3 }}>chegar atrasado na festa</b></>} cor={M3} />
    </Part>
  );
};

// 6. plot twist: remédios que são tomados com comida
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <div style={{ position: "absolute", top: 200, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 46, lineHeight: 1.2, color: "#fecaca", opacity: P(f, T.cuidado - 6, T.cuidado + 6), textShadow: `0 0 18px ${rgba(VERM, 0.8)}` }}>
        <span style={{ fontFamily: EMOJI }}>⚠️</span> ATENÇÃO:<br />NEM TODO REMÉDIO É EM JEJUM
      </div>
      <Emoji f={f} at={T.comComida} x={540} y={470} size={150}>🍽️</Emoji>
      <Title f={f} at={T.comComida} y={580} size={44} font={SANS} weight={700} color={C.ink} from={VERDE}>alguns são tomados COM comida</Title>
      <Item f={f} at={T.ibuprofeno} y={670} icone="💊" texto={<><b style={{ color: VERDE }}>ibuprofeno</b> e anti-inflamatórios: irritam menos o estômago</>} cor={VERDE} h={150} />
      <Item f={f} at={T.litio} y={840} icone="🧂" texto={<><b style={{ color: VERDE }}>lítio</b>: com alimento, dá menos enjoo</>} cor={VERDE} />
      <Item f={f} at={T.itraconazol} y={1000} icone="🍄" texto={<><b style={{ color: VERDE }}>itraconazol</b> (cápsulas): absorve melhor com comida</>} cor={VERDE} h={150} />
      <Card f={f} at={T.regra} x={60} y={1190} w={960} h={170} border={COR} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, boxShadow: `0 0 34px ${rgba(COR, 0.35)}` }}>
        <span style={{ fontFamily: EMOJI, fontSize: 70 }}>🏆</span>
        <span style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COR, letterSpacing: 2 }}>REGRA DE OURO</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 48 }}>cada remédio tem o seu horário</span>
        </span>
      </Card>
    </Part>
  );
};

// 7. o que fazer
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.fazAssim} y={225} size={60} weight={600} from={COR}>Então faz assim</Title>
      <Item f={f} at={T.bula2} y={320} icone="✅" texto="leia na bula: jejum ou com alimento?" />
      <Item f={f} at={T.farmaceutico} y={480} icone="✅" texto={<>pergunte ao <b style={{ color: COR }}>farmacêutico</b> 👩‍⚕️</>} />
      <Item f={f} at={T.agua2} y={640} icone="✅" texto={<>tome com <b style={{ color: "#7dd3fc" }}>água</b> 💧, não com café, leite ou suco</>} h={150} />
      <Item f={f} at={T.varios} y={810} icone="✅" texto="toma vários? peça ajuda pra montar os horários ⏰" h={150} />
      <Pill x={540} y={1040} text="só mudar o horário pode fazer o remédio funcionar melhor" color={VERDE} size={28} k={P(f, T.mudar, T.mudar + 12)} />
    </Part>
  );
};

// 8. fechamento
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Emoji f={f} at={T.manda} x={540} y={420} size={170}>📤</Emoji>
      <Title f={f} at={T.manda + 6} y={560} size={48} font={SANS} weight={700} color={C.ink} from={COR}>Manda pra quem toma remédio</Title>
      <Title f={f} at={T.manda + 30} y={630} size={44} font={SANS} weight={600} color={COR} from={COR}>junto com o café da manhã ☕</Title>
      <Card f={f} at={T.segue} x={110} y={780} w={860} h={260} border={rgba(COR, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", boxShadow: `0 0 34px ${rgba(COR, 0.25)}` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 74 }}><span style={{ fontFamily: EMOJI }}>👩‍⚕️</span> Me segue</span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36 }}>pra mais curiosidades sobre medicamentos</span>
      </Card>
    </Part>
  );
};

// 9. mensagem final
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100} outDur={1}>
      {MENSAGEM_FINAL.map((l, i) => {
        const at = T.final + 4 + i * 8;
        const k = it(f, at, at + 14, 0, 1, OUT);
        return <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, COR, "#fffbeb", 20) : bornColor(f, at, C.ink, COR), textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, DURATION, 0, 1, (x) => x)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>;
      })}
    </Part>
  );
};

export const VideoJejum: React.FC = () => {
  const f = useCurrentFrame();
  const cor = f >= R0(2) && f < R0(3) ? M1 : f >= R0(3) && f < R0(4) ? M2 : f >= R0(4) && f < R0(5) ? M3 : f >= R0(5) && f < T.regra ? VERM : COR;
  return (
    <AbsoluteFill>
      <Background color={cor} pulses={[T.metade, T.quelacao, T.terco, T.cafePreto, T.desligar, T.cuidado, T.regra, T.final]} />
      <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 />
      <Grain />
      <Audio src={staticFile("jejum/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio src={staticFile("jejum/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
