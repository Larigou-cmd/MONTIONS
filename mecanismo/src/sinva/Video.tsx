import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, EASE, Grain, IN, OUT, P, Part, Pill, SNAP, W, bornColor, it, mix, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";

// "Sinvastatina e dor na perna" no modelo "aula elegante" (roteiro da Larissa):
// fundo escuro com brilho, títulos em serifa, cartões arredondados, sem legenda e sem referências na tela.
// Tempos em quadros (30 fps), tirados de audio/sinva_palavras.json (quadro = segundos × 30).
const COR = "#2dd4bf"; // cor do remédio
const DOR = "#f87171";
const GORD = "#fbbf24"; // colesterol / LDL
const FIG = "#c2410c"; // fígado
const VERDE = "#4ade80", AMAR = "#facc15", VERM = "#ef4444";
export const DURATION = 5300; // 176,7 s (narração de 173,8 s + mensagem final)

const T = {
  perna: 79, fica: 127, serio: 220,
  sinva: 250, brasil: 335, estatinas: 398, colesterol: 444, figado: 523, hmg: 572, fabrica: 650, desliga: 730, puxar: 874, ldl: 926,
  resultado: 989, arterias: 1050, infarto: 1101, avc: 1120,
  efeito: 1164, mialgia: 1315, cinco: 1394, lados: 1514, panturrilha: 1595, coxa: 1625, quadril: 1645, ombro: 1673,
  cansaco: 1726, peso: 1763, fraqueza: 1780, caibra: 1807, semanas: 1866, dose: 1940,
  porque: 1978, ciencia: 2035, via: 2165, energia: 2285, bloqueia: 2392, sofrer: 2453,
  niveis: 2489, n1: 2566, normal: 2650, n2: 2719, ck: 2878, n3: 2957, rins: 3170, raro: 3199,
  guarda: 3274, forte: 3307, piora: 3352, xixi: 3391, ps: 3480, espera: 3535,
  risco: 3581, doses: 3652, idade: 3684, hipo: 3725, rim: 3766, exercicio: 3800,
  pegadinha: 3905, clari: 4034, antif: 4085, amio: 4123, grape: 4183, acumula: 4274, musculo: 4355,
  sentiu: 4382, naoPara: 4416, perigoso: 4534, medico: 4565, exameCk: 4637, diminuir: 4670, trocar: 4709, muita: 4769,
  salva: 4894, manda: 4931, parte2: 5015, final: 5126,
};
const PARTES: [number, number][] = [
  [0, 248], [242, 1162], [1156, 1976], [1970, 2487], [2481, 3272], [3266, 3579], [3573, 4380], [4374, 4892], [4886, 5128], [5122, DURATION],
];
const SFX: [number, string, number][] = [
  [79, "trava", 0.35], [220, "pop", 0.25],
  [242, "whoosh", 0.3], [444, "pop", 0.25], [572, "pop", 0.22], [730, "trava", 0.4], [926, "pop", 0.22], [1101, "pop", 0.22], [1120, "pop", 0.22],
  [1156, "whoosh", 0.3], [1315, "plim", 0.22], [1394, "pop", 0.25], [1595, "pop", 0.2], [1625, "pop", 0.2], [1645, "pop", 0.2], [1673, "pop", 0.2],
  [1970, "whoosh", 0.3], [2392, "trava", 0.4],
  [2481, "whoosh", 0.3], [2566, "pop", 0.25], [2719, "pop", 0.25], [2957, "trava", 0.35],
  [3266, "whoosh", 0.3], [3307, "pop", 0.25], [3352, "pop", 0.25], [3391, "pop", 0.25], [3480, "trava", 0.45],
  [3573, "whoosh", 0.3], [3652, "pop", 0.2], [3684, "pop", 0.2], [3725, "pop", 0.2], [3766, "pop", 0.2], [3800, "pop", 0.2],
  [3905, "plim", 0.22], [4034, "pop", 0.22], [4085, "pop", 0.22], [4123, "pop", 0.22], [4183, "pop", 0.22],
  [4374, "whoosh", 0.3], [4416, "trava", 0.35], [4637, "pop", 0.22], [4670, "pop", 0.22], [4709, "pop", 0.22], [4769, "plim", 0.22],
  [4886, "whoosh", 0.3], [4894, "pop", 0.25], [4931, "pop", 0.25], [5015, "plim", 0.25],
  [5122, "whoosh", 0.3], [5126, "plim", 0.3],
];
const MENSAGEM_FINAL = ["Consulte um", "profissional de saúde", "para orientações."];

const R = (i: number) => PARTES[i];
const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={W} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const mov = (f: number, i: number, j: number, a: number, b: number) => interpolate(f, [i, j], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
// trecho dentro de uma parte: entra e sai com desfoque
const Fase: React.FC<{ f: number; de: number; ate?: number; children: React.ReactNode }> = ({ f, de, ate, children }) => {
  if (f < de - 2 || (ate !== undefined && f > ate)) return null;
  const a = Math.min(it(f, de - 2, de + 10, 0, 1, OUT), ate === undefined ? 1 : 1 - it(f, ate - 12, ate, 0, 1, IN));
  return <AbsoluteFill style={{ opacity: a, filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};
const Item: React.FC<{ f: number; at: number; y: number; icone: string; texto: React.ReactNode; cor?: string; h?: number }> = ({ f, at, y, icone, texto, cor, h = 150 }) => (
  <Card f={f} at={at} x={60} y={y} w={960} h={h} border={cor ? rgba(cor, 0.6) : C.boxBorder} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}>
    <span style={{ fontFamily: EMOJI, fontSize: 60, flexShrink: 0 }}>{icone}</span>
    <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.25, color: bornColor(f, at, C.ink, cor ?? COR) }}>{texto}</span>
  </Card>
);

// perna de perfil com a panturrilha doendo
const Perna: React.FC<{ f: number; dor: number }> = ({ f, dor }) => {
  const pulso = dor * (0.6 + 0.4 * Math.sin(f / 4));
  return (
    <g>
      <path d="M470,430 C430,560 450,700 500,800 C540,880 560,960 540,1060 C530,1120 520,1160 520,1190 L640,1210 C660,1215 660,1240 640,1245 L470,1245 C455,1200 450,1140 455,1080 C460,980 420,900 400,820 C360,700 380,560 400,430 Z" fill={rgba("#e2e8f0", 0.12)} stroke="#cbd5e1" strokeWidth={5} strokeLinejoin="round" />
      {dor > 0 && (
        <>
          <ellipse cx={480} cy={960} rx={70} ry={120} fill={rgba(DOR, 0.35 * pulso)} style={{ filter: "blur(18px)" }} />
          <ellipse cx={480} cy={960} rx={50} ry={90} fill="none" stroke={DOR} strokeWidth={5} opacity={pulso} style={{ filter: `drop-shadow(0 0 14px ${DOR})` }} />
          {[[-1, -30], [1, 10], [-1, 60]].map(([lado, dy], i) => (
            <polyline key={i} points={`${480 + lado * 95},${940 + dy} ${480 + lado * 125},${925 + dy} ${480 + lado * 115},${955 + dy} ${480 + lado * 150},${940 + dy}`} fill="none" stroke={DOR} strokeWidth={6} strokeLinecap="round" opacity={dor * (0.5 + 0.5 * Math.sin(f / 3 + i))} />
          ))}
        </>
      )}
    </g>
  );
};

// 1. gancho
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <Title f={f} at={2} y={230} size={56} weight={600} from={COR}>Começou a tomar sinvastatina…</Title>
      <Title f={f} at={T.perna - 20} y={320} size={44} font={SANS} weight={600} color={DOR} from={DOR}>…e a batata da perna começou a doer?</Title>
      <Tela><g opacity={it(f, 10, 30, 0, 1, OUT)} transform="translate(60,0)"><Perna f={f} dor={P(f, T.perna, T.perna + 10)} /></g></Tela>
      <Pill x={540} y={1340} text="Fica até o final 👀" color={COR} size={38} k={P(f, T.fica, T.fica + 12)} />
      <Title f={f} at={T.serio - 30} y={1410} size={40} font={SANS} color={C.dim} from={COR}>esse vídeo pode evitar um problema sério</Title>
    </Part>
  );
};

// engrenagem da "fábrica" de colesterol
const Engrenagem: React.FC<{ x: number; y: number; r: number; giro: number; cor: string }> = ({ x, y, r, giro, cor }) => (
  <g transform={`translate(${x},${y}) rotate(${giro})`}>
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-r * 0.16} y={-r * 1.28} width={r * 0.32} height={r * 0.42} rx={4} fill={cor} transform={`rotate(${i * 36})`} />)}
    <circle r={r} fill={cor} />
    <circle r={r * 0.4} fill="#1c1917" />
  </g>
);

// 2. para que serve e como age
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const off = P(f, T.desliga, T.desliga + 20);
  // a engrenagem desacelera até parar quando a fábrica é desligada
  const giro = f < T.desliga ? f * 2.5 : T.desliga * 2.5 + (Math.min(f, T.desliga + 20) - T.desliga) * 1.2;
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Fase f={f} de={T.sinva - 6} ate={T.figado}>
        <Title f={f} at={T.sinva} y={240} size={70} weight={600} from={COR}>Sinvastatina</Title>
        <Pill x={540} y={360} text="um dos remédios mais usados no Brasil" color={COR} size={34} k={P(f, T.brasil, T.brasil + 12)} />
        <Pill x={540} y={460} text="família das estatinas" color={COR} size={36} k={P(f, T.estatinas, T.estatinas + 12)} />
        <Emoji f={f} at={T.colesterol} x={540} y={700} size={220}>🫀</Emoji>
        <Title f={f} at={T.colesterol} y={860} size={84} weight={600} color={GORD} from={GORD}>COLESTEROL ↓</Title>
      </Fase>
      <Fase f={f} de={T.figado} ate={T.resultado}>
        <Title f={f} at={T.figado} y={235} size={60} weight={600} from={FIG}>No fígado…</Title>
        <Tela>
          <path d="M210,470 C250,380 520,360 760,400 C900,420 900,520 820,600 C720,700 560,760 420,740 C260,720 170,580 210,470 Z" fill={rgba(FIG, 0.35)} stroke="#fb923c" strokeWidth={5} style={{ filter: "drop-shadow(0 0 20px rgba(251,146,60,.35))" }} />
          <Engrenagem x={500} y={560} r={70} giro={giro} cor={mix("#fbbf24", "#64748b", off)} />
          <Engrenagem x={610} y={500} r={42} giro={-giro * 1.6} cor={mix("#fbbf24", "#64748b", off)} />
          {f < T.desliga + 20 && Array.from({ length: 6 }, (_, i) => {
            const p = (f / 50 + i / 6) % 1;
            return <circle key={i} cx={560 + Math.sin(i * 2) * 60} cy={460 - p * 120} r={12} fill={GORD} opacity={(1 - p) * (1 - off)} />;
          })}
          {off > 0 && <text x={700} y={640} fontFamily={SANS} fontWeight={800} fontSize={120 * SNAP(Math.min(1, off))} fill={C.alert}>✕</text>}
          {/* vaso de sangue com o LDL sendo puxado para o fígado */}
          {f >= T.puxar - 20 && (
            <g opacity={P(f, T.puxar - 20, T.puxar)}>
              <rect x={60} y={960} width={960} height={110} rx={55} fill={rgba(DOR, 0.12)} stroke={DOR} strokeWidth={4} />
              <text x={80} y={945} fontFamily={SANS} fontWeight={700} fontSize={30} fill={DOR}>sangue</text>
              {Array.from({ length: 10 }, (_, i) => {
                const at = T.puxar + i * 8;
                const k = mov(f, at, at + 60, 0, 1);
                const x0 = 120 + i * 85, y0 = 1015;
                const cx = x0 + (500 - x0) * k, cy = y0 + (620 - y0) * k;
                return <g key={i} opacity={1 - P(f, at + 50, at + 60)}><circle cx={cx} cy={cy} r={24} fill={rgba(GORD, 0.4)} stroke={GORD} strokeWidth={4} /><text x={cx} y={cy + 7} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill={GORD}>LDL</text></g>;
              })}
            </g>
          )}
        </Tela>
        <Pill x={540} y={820} text="HMG-CoA redutase" color={GORD} size={36} k={P(f, T.hmg, T.hmg + 12)} />
        <Title f={f} at={T.fabrica} y={870} size={36} font={SANS} color={C.dim} from={GORD}>a fábrica do colesterol</Title>
        <Title f={f} at={T.desliga} y={1150} size={46} font={SANS} weight={700} color={COR} from={COR}>a sinvastatina desliga a fábrica</Title>
        <Title f={f} at={T.ldl} y={1230} size={40} font={SANS} weight={600} color={C.ink} from={GORD}>e o fígado puxa o LDL do sangue</Title>
      </Fase>
      <Fase f={f} de={T.resultado}>
        <Title f={f} at={T.resultado} y={240} size={66} weight={600} from={COR}>Resultado</Title>
        <Tela>
          <g opacity={it(f, T.resultado, T.resultado + 14, 0, 1, OUT)}>
            <rect x={80} y={520} width={920} height={220} rx={110} fill={rgba(DOR, 0.12)} stroke={DOR} strokeWidth={6} />
            <path d={`M300,520 Q540,${520 + 110 * (1 - P(f, T.arterias, T.arterias + 40))} 780,520 Z`} fill={rgba(GORD, 0.7)} />
            {Array.from({ length: 8 }, (_, i) => { const x = ((f * 6 + i * 130) % 1000) + 40; return <ellipse key={i} cx={x} cy={630 + Math.sin(i) * 40} rx={26} ry={14} fill="rgba(239,68,68,.8)" />; })}
          </g>
        </Tela>
        <Title f={f} at={T.arterias} y={800} size={40} font={SANS} color={C.dim} from={GORD}>menos gordura entupindo as artérias</Title>
        <Pill x={360} y={960} text="❤️ infarto ↓" color={DOR} size={40} k={P(f, T.infarto, T.infarto + 12)} />
        <Pill x={720} y={960} text="🧠 AVC ↓" color={DOR} size={40} k={P(f, T.avc, T.avc + 12)} />
      </Fase>
    </Part>
  );
};

// corpo de frente com os músculos grandes acendendo dos dois lados
const Corpo: React.FC<{ f: number; acende: number[] }> = ({ f, acende }) => {
  const membro = (d: string) => <path d={d} fill="none" stroke="#94a3b8" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />;
  const grupos: [number, [number, number][]][] = [
    [0, [[470, 1050], [610, 1050]]], // panturrilha
    [1, [[475, 850], [605, 850]]], // coxa
    [2, [[480, 730], [600, 730]]], // quadril
    [3, [[430, 470], [650, 470]]], // ombro
  ];
  return (
    <g>
      <circle cx={540} cy={360} r={56} fill="none" stroke="#94a3b8" strokeWidth={8} opacity={0.6} />
      <rect x={460} y={430} width={160} height={300} rx={60} fill={rgba("#94a3b8", 0.15)} stroke="#94a3b8" strokeWidth={6} opacity={0.7} />
      {membro("M450,460 L390,620 L380,760")}
      {membro("M630,460 L690,620 L700,760")}
      {membro("M500,730 L475,900 L470,1120")}
      {membro("M580,730 L605,900 L610,1120")}
      {grupos.map(([i, pts]) => {
        const k = acende[i] ?? 0;
        if (k <= 0) return null;
        const pul = 0.65 + 0.35 * Math.sin(f / 5 + i);
        return pts.map(([x, y], j) => <ellipse key={`${i}${j}`} cx={x} cy={y} rx={34} ry={50} fill={rgba(DOR, 0.5 * k * pul)} stroke={DOR} strokeWidth={4} opacity={k} style={{ filter: `drop-shadow(0 0 14px ${DOR})` }} />);
      })}
    </g>
  );
};

// 3. o efeito colateral: mialgia
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const sens: [number, string][] = [[T.cansaco, "cansaço"], [T.peso, "peso"], [T.fraqueza, "fraqueza"], [T.caibra, "cãibra"]];
  const musc: [number, string, number, number][] = [[T.panturrilha, "panturrilha", 250, 1050], [T.coxa, "coxa", 250, 850], [T.quadril, "quadril", 830, 730], [T.ombro, "ombro", 830, 470]];
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Fase f={f} de={T.efeito - 4} ate={T.lados}>
        <Title f={f} at={T.efeito} y={240} size={58} weight={600} color="#fda4af" from={DOR}>Efeito colateral conhecido</Title>
        <Title f={f} at={T.efeito + 60} y={340} size={44} font={SANS} weight={600} color={C.ink} from={DOR}>dor muscular</Title>
        <Emoji f={f} at={T.mialgia} x={540} y={600} size={200}>🦵</Emoji>
        <Title f={f} at={T.mialgia} y={740} size={96} weight={600} color={DOR} from={DOR}>MIALGIA</Title>
        {f >= T.cinco && (
          <div style={{ position: "absolute", top: 930, width: W, textAlign: "center", opacity: P(f, T.cinco, T.cinco + 12) }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 130, color: GORD, textShadow: `0 0 40px ${rgba(GORD, 0.4)}` }}>5 a 10%</div>
            <div style={{ fontFamily: SANS, fontSize: 38, color: C.dim }}>de quem toma</div>
          </div>
        )}
      </Fase>
      <Fase f={f} de={T.lados}>
        <Title f={f} at={T.lados} y={200} size={44} font={SANS} weight={700} color={C.ink} from={DOR}>dos dois lados · músculos grandes</Title>
        <Tela><Corpo f={f} acende={[P(f, T.panturrilha, T.panturrilha + 8), P(f, T.coxa, T.coxa + 8), P(f, T.quadril, T.quadril + 8), P(f, T.ombro, T.ombro + 8)]} /></Tela>
        {musc.map(([at, t, x, y]) => <Pill key={t} x={x} y={y} text={t} color={DOR} size={32} k={P(f, at, at + 10)} />)}
        <div style={{ position: "absolute", top: 1200, width: W, display: "flex", justifyContent: "center", gap: 16 }}>
          {sens.map(([at, t]) => <div key={t} style={{ position: "relative", width: 230, height: 80 }}><Pill x={115} y={40} text={t} color={GORD} size={32} k={P(f, at, at + 10)} /></div>)}
        </div>
        <Pill x={540} y={1340} text="📅 primeiras semanas de uso" color={COR} size={34} k={P(f, T.semanas, T.semanas + 12)} />
        <Pill x={540} y={1430} text="⬆️ ou quando a dose aumenta" color={COR} size={34} k={P(f, T.dose, T.dose + 12)} />
      </Fase>
    </Part>
  );
};

// 4. por que dói: a mesma via faz colesterol e substâncias de energia do músculo
const Caixa: React.FC<{ f: number; at: number; x: number; y: number; w: number; t: React.ReactNode; cor: string }> = ({ f, at, x, y, w, t, cor }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, padding: "20px 10px", boxSizing: "border-box", borderRadius: 24, border: `3px solid ${cor}`, background: rgba(cor, 0.13), textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, transform: `scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.4) }}>{t}</div>;
};
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const bl = it(f, T.bloqueia, T.bloqueia + 14, 0, 1, SNAP);
  const seta = (x1: number, y1: number, x2: number, y2: number, at: number) => f >= at && <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * P(f, at, at + 14)} y2={y1 + (y2 - y1) * P(f, at, at + 14)} stroke="#cbd5e1" strokeWidth={6} strokeLinecap="round" />;
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.porque} y={235} size={60} weight={600} from={DOR}>Por que o músculo dói?</Title>
      <Pill x={540} y={360} text="a ciência ainda não sabe totalmente" color="#94a3c8" size={32} k={P(f, T.ciencia, T.ciencia + 12)} />
      <Tela>
        {seta(540, 535, 540, 620, T.via + 6)}
        {seta(540, 705, 300, 800, T.via + 24)}
        {seta(540, 705, 780, 800, T.energia - 6)}
        {bl > 0 && <g transform={`translate(540,578) scale(${bl})`}><circle r={44} fill={rgba(C.alert, 0.2)} stroke={C.alert} strokeWidth={6} /><text y={18} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={52} fill={C.alert}>✕</text></g>}
      </Tela>
      <Caixa f={f} at={T.via - 10} x={540} y={450} w={420} t="HMG-CoA" cor={GORD} />
      <Caixa f={f} at={T.via + 10} x={540} y={620} w={420} t="mevalonato" cor={GORD} />
      <Caixa f={f} at={T.via + 24} x={290} y={800} w={400} t="colesterol" cor={GORD} />
      <Caixa f={f} at={T.energia} x={790} y={800} w={400} t={<>energia do músculo<br /><span style={{ fontSize: 28, color: C.dim }}>(ex.: coenzima Q10)</span></>} cor={COR} />
      <Pill x={810} y={578} text="sinvastatina" color={C.alert} size={30} k={P(f, T.bloqueia, T.bloqueia + 12)} />
      <Emoji f={f} at={T.sofrer} x={540} y={1130} size={150}>💪</Emoji>
      <Title f={f} at={T.sofrer} y={1240} size={48} font={SANS} weight={700} color={DOR} from={DOR}>o músculo pode sofrer junto</Title>
    </Part>
  );
};

// 5. os 3 níveis (escada)
const Degrau: React.FC<{ f: number; at: number; x: number; y: number; cor: string; bola: string; nome: string; linhas: [number, string][] }> = ({ f, at, x, y, cor, bola, nome, linhas }) => (
  <Card f={f} at={at} x={x} y={y} w={700} h={230} border={rgba(cor, 0.7)} style={{ padding: "22px 30px", boxShadow: `0 0 30px ${rgba(cor, 0.18)}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontFamily: EMOJI, fontSize: 52 }}>{bola}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: cor }}>{nome}</span>
    </div>
    {linhas.map(([la, t], i) => <div key={i} style={{ marginTop: 10, fontSize: 32, fontWeight: 600, opacity: P(f, la, la + 10) }}>{t}</div>)}
  </Card>
);
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.niveis} y={235} size={62} weight={600} from={DOR}>3 níveis</Title>
      <Degrau f={f} at={T.n1} x={60} y={1050} cor={VERDE} bola="🟢" nome="Mialgia" linhas={[[T.n1 + 30, "só dor · exame normal"], [T.normal + 40, "o mais comum"]]} />
      <Degrau f={f} at={T.n2} x={200} y={780} cor={AMAR} bola="🟡" nome="Miosite" linhas={[[T.n2 + 30, "dor + CK alta"], [T.ck + 10, "aparece no exame de sangue"]]} />
      <Degrau f={f} at={T.n3} x={320} y={510} cor={VERM} bola="🔴" nome="Rabdomiólise" linhas={[[T.n3 + 40, "o músculo se destrói"], [T.rins, "pode lesar os rins"]]} />
      <Pill x={300} y={420} text="raro, mas grave" color={VERM} size={34} k={P(f, T.raro, T.raro + 12)} />
    </Part>
  );
};

// 6. alerta
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const st = it(f, T.ps, T.ps + 12, 0, 1, SNAP);
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1200px at 50% 45%, rgba(239,68,68,${0.22 + 0.06 * Math.sin(f / 6)}) 0%, rgba(0,0,0,0) 75%)` }} />
      <Emoji f={f} at={T.guarda - 4} x={540} y={250} size={110}>⚠️</Emoji>
      <Title f={f} at={T.guarda} y={340} size={58} weight={600} color="#fecaca" from={VERM}>Guarda essa</Title>
      <Item f={f} at={T.forte} y={470} icone="😣" texto="Dor muito forte" cor={VERM} />
      <Item f={f} at={T.piora} y={640} icone="🦵" texto="Fraqueza que piora" cor={VERM} />
      <Item f={f} at={T.xixi} y={810} icone="🥤" texto={<>Xixi escuro, <b style={{ color: "#fca5a5" }}>cor de Coca-Cola</b></>} cor={VERM} />
      {st > 0 && (
        <div style={{ position: "absolute", top: 1030, width: W, display: "flex", justifyContent: "center", opacity: Math.min(1, st * 1.4) }}>
          <div style={{ transform: `rotate(-4deg) scale(${0.6 + 0.4 * st})`, padding: "18px 40px", border: `6px solid ${VERM}`, borderRadius: 22, background: rgba(VERM, 0.15), fontFamily: SANS, fontWeight: 800, fontSize: 56, color: "#fecaca", textAlign: "center", boxShadow: `0 0 40px ${rgba(VERM, 0.45)}` }}><span style={{ fontFamily: EMOJI }}>🏥</span> PRONTO-SOCORRO<br />NA HORA</div>
        </div>
      )}
      <Title f={f} at={T.espera} y={1290} size={44} font={SANS} weight={700} color="#fecaca" from={VERM}>Não espera passar.</Title>
    </Part>
  );
};

// 7. quem tem mais risco + interações
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const riscos: [number, string, string][] = [[T.doses, "💊", "Doses altas"], [T.idade, "👵", "Idade avançada"], [T.hipo, "🦋", "Hipotireoidismo"], [T.rim, "🩺", "Problema nos rins"], [T.exercicio, "🏋️", "Exercício muito pesado"]];
  const inter: [number, string, string][] = [[T.clari, "💊", "Claritromicina"], [T.antif, "🍄", "Alguns antifúngicos"], [T.amio, "❤️", "Amiodarona"], [T.grape, "🍊", "Suco de grapefruit"]];
  const nivel = mov(f, T.acumula, T.acumula + 50, 0.35, 0.95);
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Fase f={f} de={T.risco - 4} ate={T.pegadinha}>
        <Title f={f} at={T.risco} y={235} size={58} weight={600} from={GORD}>Aumentam o risco</Title>
        {riscos.map(([at, e, t], i) => <Item key={t} f={f} at={at} y={360 + i * 175} icone={e} texto={t} cor={GORD} />)}
      </Fase>
      <Fase f={f} de={T.pegadinha}>
        <Title f={f} at={T.pegadinha} y={235} size={58} weight={600} from={GORD}>A pegadinha: interações</Title>
        {inter.map(([at, e, t], i) => (
          <Card key={t} f={f} at={at} x={60 + (i % 2) * 495} y={360 + Math.floor(i / 2) * 260} w={465} h={230} border={rgba(GORD, 0.55)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", padding: "0 16px" }}>
            <span style={{ fontFamily: EMOJI, fontSize: 70 }}>{e}</span>
            <span style={{ fontWeight: 700, fontSize: 34 }}>{t}</span>
          </Card>
        ))}
        {f >= T.acumula - 6 && (
          <div style={{ position: "absolute", left: 90, top: 940, width: 900, opacity: P(f, T.acumula - 6, T.acumula + 6) }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink }}>o remédio acumula no corpo</div>
            <div style={{ marginTop: 18, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${nivel * 100}%`, height: "100%", borderRadius: 22, background: `linear-gradient(90deg, ${COR}, ${VERM})`, boxShadow: `0 0 20px ${rgba(VERM, 0.5)}` }} />
            </div>
          </div>
        )}
        <Pill x={540} y={1150} text="⚠️ mais risco pro músculo" color={VERM} size={38} k={P(f, T.musculo, T.musculo + 12)} />
      </Fase>
    </Part>
  );
};

// 8. o que fazer
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const ops: [number, string, string][] = [[T.exameCk, "🧪", "Exame de CK"], [T.diminuir, "⬇️", "Diminuir a dose"], [T.trocar, "🔄", "Trocar de estatina"]];
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Title f={f} at={T.sentiu} y={235} size={62} weight={600} from={COR}>Sentiu dor?</Title>
      <Item f={f} at={T.naoPara} y={350} icone="✋" texto={<>Não pare o remédio <b style={{ color: "#fca5a5" }}>por conta própria</b></>} cor={VERM} h={170} />
      <Title f={f} at={T.perigoso} y={545} size={36} font={SANS} color={C.dim} from={VERM}>o colesterol alto também é perigoso</Title>
      <Item f={f} at={T.medico} y={630} icone="👩‍⚕️" texto="Fale com o seu médico" cor={COR} h={160} />
      {ops.map(([at, e, t], i) => (
        <Card key={t} f={f} at={at} x={60 + i * 330} y={830} w={300} h={220} tilt={[-1, 0.8, -0.6][i]} border={rgba(COR, 0.5)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", padding: "0 12px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 64 }}>{e}</span>
          <span style={{ fontWeight: 700, fontSize: 32, lineHeight: 1.2 }}>{t}</span>
        </Card>
      ))}
      <Title f={f} at={T.muita} y={1110} size={42} font={SANS} weight={600} color={COR} from={COR}>muita gente se dá bem com outra ✓</Title>
    </Part>
  );
};

// 9. fechamento
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100}>
      <Emoji f={f} at={T.salva} x={330} y={420} size={150}>🔖</Emoji>
      <Emoji f={f} at={T.manda} x={750} y={420} size={150}>📤</Emoji>
      <Title f={f} at={T.salva} y={560} size={48} font={SANS} weight={700} color={C.ink} from={COR}>Salva e manda pra quem toma</Title>
      <Card f={f} at={T.parte2} x={60} y={760} w={960} h={300} border={rgba(COR, 0.7)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", boxShadow: `0 0 34px ${rgba(COR, 0.25)}` }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: COR }}>PARTE 2</span>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, lineHeight: 1.2 }}><span style={{ fontFamily: EMOJI }}>🌙</span> Por que a sinvastatina é tomada à noite?</span>
      </Card>
    </Part>
  );
};

// 10. mensagem final
const S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(9)[0]} to={R(9)[1]} inY={100} outDur={1}>
      {MENSAGEM_FINAL.map((l, i) => {
        const at = T.final + 4 + i * 8;
        const k = it(f, at, at + 14, 0, 1, OUT);
        return <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, COR, "#f0fdfa", 20) : bornColor(f, at, C.ink, COR), textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, DURATION, 0, 1, (x) => x)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>;
      })}
    </Part>
  );
};

export const VideoSinva: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background color={f >= T.guarda - 10 && f < T.risco - 10 ? VERM : COR} pulses={[T.perna, T.desliga, T.mialgia, T.bloqueia, T.n3, T.ps, T.naoPara, T.final]} />
      <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 />
      <Grain />
      <Audio src={staticFile("sinva/narracao.mp3")} />
      <Audio src={staticFile("sinva/musica.wav")} volume={(fr) => 0.11 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
