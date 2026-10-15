import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { EASE, OUT, P, Part, Pill, SNAP, W, bornColor, it, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { COR, PARTES, T } from "./config";

const R = (i: number) => PARTES[i];
const LIN = (x: number) => x;

// ---------- personagens ----------
const Box: React.FC<{ f: number }> = ({ f }) => {
  const bob = Math.sin(f / 8) * 4;
  const together = it(f, T.algema - 18, T.algema, 0, 1, EASE);
  const look = it(f, T.olha - 6, T.olha + 6, 0, 1, EASE);
  const px = -8 * (1 - look), py = 4 * (1 - look);
  const cuffed = f >= T.algema;
  const hl = [-170 + 120 * together, 20 + 190 * together], hr = [170 - 120 * together, 20 + 190 * together];
  return (
    <g transform={`translate(540,${980 + bob})`}>
      <line x1={-50} y1={170} x2={-60 + Math.sin(f / 6) * 4} y2={290} stroke="#e2e8f0" strokeWidth={16} strokeLinecap="round" />
      <line x1={50} y1={170} x2={60 - Math.sin(f / 6) * 4} y2={290} stroke="#e2e8f0" strokeWidth={16} strokeLinecap="round" />
      <ellipse cx={-66} cy={296} rx={30} ry={12} fill="#1e293b" />
      <ellipse cx={66} cy={296} rx={30} ry={12} fill="#1e293b" />
      <path d={`M-130,-10 Q${-175 - 10 * together},${60 + 90 * together} ${hl[0]},${hl[1]}`} fill="none" stroke="#e2e8f0" strokeWidth={14} strokeLinecap="round" />
      <path d={`M130,-10 Q${175 + 10 * together},${60 + 90 * together} ${hr[0]},${hr[1]}`} fill="none" stroke="#e2e8f0" strokeWidth={14} strokeLinecap="round" />
      <rect x={-135} y={-175} width={270} height={350} rx={22} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={4} />
      <rect x={-135} y={60} width={270} height={70} fill="#2563eb" />
      <rect x={-135} y={130} width={270} height={14} fill={COR} />
      <text x={0} y={106} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={40} fill="#fff" letterSpacing={2}>DIPIRONA</text>
      <text x={0} y={166} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={22} fill="#64748b">500 mg · comprimidos</text>
      <path d="M-82,-118 L-34,-104" stroke="#334155" strokeWidth={7} strokeLinecap="round" />
      <path d="M82,-118 L34,-104" stroke="#334155" strokeWidth={7} strokeLinecap="round" />
      <circle cx={-56} cy={-72} r={28} fill="#fff" stroke="#334155" strokeWidth={4} />
      <circle cx={56} cy={-72} r={28} fill="#fff" stroke="#334155" strokeWidth={4} />
      <circle cx={-56 + px} cy={-70 + py} r={12} fill="#0f172a" />
      <circle cx={56 + px} cy={-70 + py} r={12} fill="#0f172a" />
      <path d={cuffed ? "M-40,0 Q0,-26 40,0" : "M-36,-6 Q0,10 36,-6"} fill="none" stroke="#334155" strokeWidth={7} strokeLinecap="round" />
      {cuffed && <path d="M108,-150 q12,22 0,32 q-12,-10 0,-32Z" fill="#7dd3fc" opacity={0.9} />}
      <circle cx={hl[0]} cy={hl[1]} r={18} fill="#e2e8f0" />
      <circle cx={hr[0]} cy={hr[1]} r={18} fill="#e2e8f0" />
      {cuffed && (
        <g opacity={P(f, T.algema, T.algema + 4)}>
          <circle cx={hl[0]} cy={hl[1]} r={24} fill="none" stroke="#cbd5e1" strokeWidth={7} />
          <circle cx={hr[0]} cy={hr[1]} r={24} fill="none" stroke="#cbd5e1" strokeWidth={7} />
          <line x1={hl[0] + 22} y1={hl[1]} x2={hr[0] - 22} y2={hr[1]} stroke="#94a3b8" strokeWidth={6} strokeDasharray="8 5" />
        </g>
      )}
    </g>
  );
};

const Agent: React.FC<{ x: number; f: number; flip?: boolean }> = ({ x, f, flip }) => {
  const step = Math.abs(Math.sin(f / 5)) * 8;
  return (
    <g transform={`translate(${x},${880 - step})`}>
      <g transform={`scale(${flip ? -1 : 1},1)`}>
        <circle cx={0} cy={-150} r={58} fill="#1f2937" />
        <rect x={-64} y={-206} width={128} height={30} rx={10} fill="#0f172a" />
        <rect x={-90} y={-90} width={180} height={300} rx={40} fill="#111827" />
        <rect x={-78} y={-70} width={156} height={200} rx={20} fill="#1f2937" stroke="#374151" strokeWidth={3} />
        <rect x={-70} y={205} width={50} height={190} rx={20} fill="#0f172a" />
        <rect x={20} y={205} width={50} height={190} rx={20} fill="#0f172a" />
        <rect x={70} y={-70} width={40} height={200} rx={20} fill="#111827" transform="rotate(-18,90,-70)" />
      </g>
      <text x={0} y={30} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={54} fill="#fde047">FDA</text>
    </g>
  );
};

// 1. a prisão
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const red = Math.floor(f / 8) % 2 === 0;
  const walk = it(f, T.agentes, T.agentes + 45, 0, 1, OUT);
  const q = "Você sabe por que a dipirona é proibida nos EUA?";
  const n = Math.min(q.length, Math.max(0, Math.floor((f - T.fala) * 0.5)));
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 700px 900px at ${red ? "10%" : "90%"} 45%, ${red ? "rgba(239,68,68,.32)" : "rgba(59,130,246,.34)"}, rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(30,41,59,.85) 70%, rgba(15,23,42,.95) 100%)" }} />
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        <ellipse cx={540} cy={1300} rx={480} ry={40} fill={red ? "rgba(239,68,68,.18)" : "rgba(59,130,246,.18)"} />
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 137) % W, y = ((i * 211 + f * 22) % 1500) + 120;
          return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 30} stroke="rgba(148,163,184,.25)" strokeWidth={2} />;
        })}
        <Agent x={-220 + 440 * walk} f={f} />
        <Agent x={1300 - 440 * walk} f={f} flip />
        <Box f={f} />
      </svg>
      {f >= T.fala && (
        <div style={{ position: "absolute", left: 90, top: 300, width: 900, minHeight: 200, borderRadius: 40, background: "#f8fafc", boxShadow: "0 20px 60px rgba(0,0,0,.45)", padding: "34px 40px", boxSizing: "border-box", fontFamily: SANS, fontWeight: 800, fontSize: 52, lineHeight: 1.2, color: "#0f172a", transform: `scale(${0.7 + 0.3 * it(f, T.fala, T.fala + 10, 0, 1, SNAP)})`, transformOrigin: "50% 100%" }}>
          {q.slice(0, n)}<span style={{ opacity: n < q.length ? 1 : 0 }}>|</span>
          <div style={{ position: "absolute", left: 440, bottom: -40, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "44px solid #f8fafc" }} />
        </div>
      )}
    </Part>
  );
};

// 2. 1977
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const yk = it(f, T.ano, T.ano + 30, 0, 1, OUT);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Emoji f={f} at={T.ano} x={540} y={440} size={150}>🇺🇸</Emoji>
      <div style={{ position: "absolute", top: 560, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 230, color: COR, textShadow: `0 0 50px ${rgba(COR, 0.4)}`, opacity: yk }}>{Math.round(1900 + 77 * yk)}</div>
      <Title f={f} at={T.fda} y={880} size={58} weight={600} from={COR}>A FDA retira a dipirona</Title>
      <Title f={f} at={T.fda + 14} y={960} size={58} weight={600} from={COR}>do mercado americano</Title>
      <Title f={f} at={T.fda + 40} y={1080} size={36} font={SANS} color={C.dim} from={COR}>FDA = agência que controla os remédios nos EUA</Title>
    </Part>
  );
};

// 3. agranulocitose
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const gone = it(f, T.some, T.some + 50, 0, 1, EASE);
  const bact = it(f, T.bacteria, T.bacteria + 60, 0, 1, OUT);
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.motivo} y={250} size={46} font={SANS} color={C.dim} from={COR}>O motivo:</Title>
      <Title f={f} at={T.agranulo} y={310} size={84} weight={600} color="#fda4af" from={C.alert}>Agranulocitose</Title>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        <rect x={-20} y={520} width={W + 40} height={420} rx={210} fill="rgba(239,68,68,.07)" stroke="#f87171" strokeWidth={5} opacity={P(f, T.neutro - 10, T.neutro)} />
        {Array.from({ length: 10 }, (_, i) => {
          const x = ((i * 113 + f * 3) % 1200) - 60, y = 600 + ((i * 71) % 260);
          return <ellipse key={`r${i}`} cx={x} cy={y} rx={26} ry={14} fill="rgba(239,68,68,.7)" />;
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 120 + i * 170, y = 700 + (i % 2 ? 60 : -40);
          const o = (1 - gone * (i < 5 ? 1 : 0.6)) * P(f, T.neutro, T.neutro + 12);
          return (
            <g key={`n${i}`} opacity={o} transform={`translate(${x},${y + Math.sin(f / 12 + i) * 6}) scale(${1 - gone * 0.4})`}>
              <circle r={44} fill="rgba(241,245,249,.9)" stroke="#e2e8f0" strokeWidth={3} />
              {[-16, 0, 16].map((dx, j) => <circle key={j} cx={dx} cy={j === 1 ? -8 : 6} r={11} fill="#a78bfa" />)}
            </g>
          );
        })}
        {bact > 0 && Array.from({ length: 12 }, (_, i) => {
          const k = P(bact, i / 16, i / 16 + 0.3);
          const bx = 80 + ((i * 89) % 900), by = 580 + ((i * 53) % 300);
          return <rect key={`b${i}`} x={bx} y={by} width={46 * k} height={20 * k} rx={10} fill="#4ade80" opacity={k * 0.9} transform={`rotate(${i * 37},${bx},${by})`} />;
        })}
      </svg>
      <Pill x={540} y={1020} text="neutrófilos = células de defesa" color="#e2e8f0" size={36} k={it(f, T.neutro + 10, T.neutro + 22, 0, 1, LIN)} />
      <Title f={f} at={T.some} y={1090} size={46} font={SANS} weight={700} color="#fda4af" from={C.alert}>quase somem do sangue ↓</Title>
      <Title f={f} at={T.bacteria} y={1170} size={40} font={SANS} color={C.dim} from={C.alert}>e uma infecção simples pode ficar grave</Title>
    </Part>
  );
};

// 4. a polêmica do risco
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = Math.sin((f - T.lado1) / 22) * 12 * P(f, T.lado2, T.lado2 + 20);
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.polemica} y={250} size={76} weight={600} from={COR}>A polêmica</Title>
      <Title f={f} at={T.polemica + 14} y={355} size={40} font={SANS} color={C.dim} from={COR}>qual é o risco de verdade?</Title>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        <g opacity={P(f, T.polemica + 10, T.polemica + 24)}>
          <path d="M540,640 L500,1060 L580,1060 Z" fill="#475569" />
          <rect x={420} y={1060} width={240} height={26} rx={10} fill="#475569" />
          <g transform={`rotate(${tilt},540,640)`}>
            <rect x={160} y={630} width={760} height={18} rx={9} fill="#94a3b8" />
            <circle cx={540} cy={640} r={22} fill={COR} />
            <line x1={210} y1={648} x2={210} y2={760} stroke="#94a3b8" strokeWidth={4} />
            <line x1={870} y1={648} x2={870} y2={760} stroke="#94a3b8" strokeWidth={4} />
            <path d="M90,760 Q210,850 330,760 Z" fill="rgba(251,113,133,.25)" stroke={C.alert} strokeWidth={4} />
            <path d="M750,760 Q870,850 990,760 Z" fill="rgba(52,211,153,.2)" stroke="#34d399" strokeWidth={4} />
          </g>
        </g>
      </svg>
      <Card f={f} at={T.lado1} x={50} y={870} w={470} h={190} border={rgba(C.alert, 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: "#fda4af" }}>1 em milhares</span>
        <span style={{ fontSize: 28, color: C.dim }}>alguns estudos</span>
      </Card>
      <Card f={f} at={T.lado2} x={560} y={870} w={470} h={190} border={rgba("#34d399", 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: "#6ee7b7" }}>1 em 1 milhão</span>
        <span style={{ fontSize: 28, color: C.dim }}>outros estudos</span>
      </Card>
      <Title f={f} at={T.discutido} y={1130} size={38} font={SANS} color={C.ink} from={COR}>a diferença pode vir da genética de cada população</Title>
    </Part>
  );
};

// 5. países
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const col = (at: number, x: number, title: string, color: string, items: [string, string][]) => (
    <Card f={f} at={at} x={x} y={380} w={470} h={620} border={rgba(color, 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34, gap: 22 }}>
      <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, color }}>{title}</span>
      {items.map(([e, n], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 38, fontWeight: 600, opacity: P(f, at + 10 + i * 8, at + 20 + i * 8) }}>
          <span style={{ fontFamily: EMOJI, fontSize: 54 }}>{e}</span>{n}
        </div>
      ))}
    </Card>
  );
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.paises} y={250} size={58} weight={600} from={COR}>Cada país decidiu de um jeito</Title>
      {col(T.proibida, 50, "Proibida", "#fda4af", [["🇺🇸", "EUA"], ["🇬🇧", "Reino Unido"], ["🌍", "e outros"]])}
      {col(T.liberada, 560, "Liberada", "#6ee7b7", [["🇧🇷", "Brasil"], ["🇩🇪", "Alemanha"], ["🇪🇸", "Espanha"], ["🇲🇽", "México"]])}
      <Pill x={540} y={1110} text="Anvisa reavaliou em 2001 e manteve" color={COR} size={38} k={it(f, T.anvisa, T.anvisa + 12, 0, 1, LIN)} />
    </Part>
  );
};

// 6. como age
export const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Title f={f} at={T.age} y={250} size={70} weight={600} from={COR}>E como ela age?</Title>
      <Emoji f={f} at={T.age + 10} x={540} y={560} size={230}>🧠</Emoji>
      <Title f={f} at={T.age + 24} y={740} size={42} font={SANS} weight={600} from={COR}>reduz as substâncias que causam</Title>
      <Title f={f} at={T.age + 32} y={800} size={42} font={SANS} weight={600} from={COR}>dor e febre, principalmente no sistema nervoso</Title>
      <div style={{ position: "absolute", top: 960, width: W, display: "flex", justifyContent: "center", gap: 22 }}>
        {[["⚡", "Dor ↓"], ["🌡️", "Febre ↓"], ["🌀", "Cólica ↓"]].map(([e, t], i) => (
          <div key={i} style={{ position: "relative", width: 300, height: 130 }}>
            <Card f={f} at={T.chips + i * 14} x={0} y={0} w={290} h={130} border={rgba(COR, 0.6)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 40, fontWeight: 700 }}>
              <span style={{ fontFamily: EMOJI, fontSize: 52 }}>{e}</span>{t}
            </Card>
          </div>
        ))}
      </div>
    </Part>
  );
};

// 7. sinais de alerta
export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const sinais: [string, string][] = [["🌡️", "Febre"], ["😣", "Dor de garganta"], ["👄", "Feridas na boca"]];
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.alerta} y={250} size={64} weight={600} color="#fda4af" from={C.alert}>Sinais de alerta</Title>
      <Title f={f} at={T.alerta + 14} y={345} size={38} font={SANS} color={C.dim} from={C.alert}>durante o uso da dipirona</Title>
      {sinais.map(([e, t], i) => (
        <Card key={i} f={f} at={T.sinais[i]} x={140} y={450 + i * 190} w={800} h={160} border={rgba(C.alert, 0.6)} tilt={[-1, 0.8, -0.5][i]} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 76 }}>{e}</span><span style={{ fontSize: 50, fontWeight: 700 }}>{t}</span>
        </Card>
      ))}
      <div style={{ position: "absolute", top: 1060, left: 90, width: 900, padding: "26px 0", borderRadius: 999, background: rgba(C.alert, 0.15), border: `3px solid ${C.alert}`, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: bornColor(f, T.pare, C.ink, C.alert), opacity: it(f, T.pare, T.pare + 10, 0, 1, OUT), transform: `scale(${0.85 + 0.15 * it(f, T.pare, T.pare + 12, 0, 1, SNAP)})` }}>Pare o remédio e procure atendimento</div>
    </Part>
  );
};

// 8. final
export const S8: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ["Consulte um", "profissional de saúde", "para orientações."];
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={60} outDur={1}>
      {lines.map((l, i) => {
        const at = T.final + 4 + i * 8;
        const k = it(f, at, at + 14, 0, 1, OUT);
        return <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, COR, "#fff7e6", 20) : bornColor(f, at, C.ink, COR), textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, 2520, 0, 1, LIN)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>;
      })}
    </Part>
  );
};
