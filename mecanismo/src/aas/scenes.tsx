import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { EASE, IN, OUT, P, Part, Pill, SNAP, W, bornColor, it, mix, rgba } from "../lib";
import { ACETIL, COR, CUIDADOS, MENSAGEM_FINAL, PARTES, REFERENCIAS, T } from "./config";
import { AasMol, Acetyl, Card, Cox, EMOJI, Emoji, Platelet, RedCell, Tablet, Title } from "./ui";

const LIN = (x: number) => x;
const R = (i: number) => PARTES[i];

// 1. abertura
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const q = "Você conhece alguém que toma AAS?";
  const letters = Math.min(q.length, Math.floor(f * 0.55) + 1);
  const tk = it(f, 6, 26, 0, 1, SNAP);
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <div style={{ position: "absolute", left: 70, top: 250, width: 940, height: 120, borderRadius: 34, background: C.box, border: `1.5px solid ${C.boxBorder}`, display: "flex", alignItems: "center", padding: "0 36px", boxSizing: "border-box", fontFamily: SANS, fontSize: 44, color: C.ink, opacity: it(f, 0, 6, 0, 1, OUT) }}>
        <span style={{ color: bornColor(f, letters / 0.55 - 6, C.ink, COR) }}>{q.slice(0, letters)}</span>
        <span style={{ display: "inline-block", width: 3, height: 48, marginLeft: 4, background: COR, opacity: letters < q.length ? 1 : Math.floor(f / 15) % 2 }} />
      </div>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        {tk > 0 && <Tablet x={540} y={640} r={170 * tk} rot={-20 + 20 * tk + Math.sin(f / 30) * 4} />}
      </svg>
      <Title f={f} at={T.nome} y={880} size={72} weight={600}>Ácido acetilsalicílico</Title>
      <Title f={f} at={T.nome + 24} y={980} size={44} font={SANS} color={COR}>a famosa aspirina</Title>
      <Emoji f={f} at={T.usados} x={540} y={1120} size={80}>🌍</Emoji>
      <Title f={f} at={T.usados + 6} y={1180} size={38} font={SANS} color={C.dim}>um dos remédios mais usados do mundo</Title>
      <Title f={f} at={T.como} y={1290} size={64}>Mas como ele funciona?</Title>
    </Part>
  );
};

// 2. história
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const a = 1 - it(f, T.ano - 10, T.ano, 0, 1, IN);
  const yearK = it(f, T.ano, T.ano + 30, 0, 1, OUT);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      {a > 0 && (
        <AbsoluteFill style={{ opacity: a, filter: a < 1 ? `blur(${(1 - a) * 12}px)` : undefined }}>
          <Emoji f={f} at={T.salgueiro} x={540} y={620} size={330}>🌳</Emoji>
          <Title f={f} at={T.salgueiro + 8} y={880} size={76} weight={600}>Casca do salgueiro</Title>
          <Title f={f} at={T.milhares} y={990} size={42} font={SANS} color={C.dim}>usada há milhares de anos</Title>
          <div style={{ position: "absolute", top: 1100, width: W, display: "flex", justifyContent: "center", gap: 24 }}>
            {["contra dor", "contra febre"].map((t, i) => <div key={i} style={{ position: "relative", width: 300, height: 90 }}><Pill x={150} y={45} text={t} color={COR} size={36} k={it(f, T.milhares + 30 + i * 10, T.milhares + 44 + i * 10, 0, 1, LIN)} /></div>)}
          </div>
        </AbsoluteFill>
      )}
      {f >= T.ano && (
        <AbsoluteFill style={{ opacity: it(f, T.ano, T.ano + 10, 0, 1, OUT) }}>
          <div style={{ position: "absolute", top: 420, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 230, color: COR, textShadow: `0 0 50px ${rgba(COR, 0.4)}` }}>{Math.round(1800 + 97 * yearK)}</div>
          <Emoji f={f} at={T.ano + 20} x={540} y={830} size={120}>⚗️</Emoji>
          <Title f={f} at={T.ano + 26} y={930} size={48} font={SANS} weight={600}>um químico da Bayer cria o AAS</Title>
          <Title f={f} at={T.hoje} y={1030} size={40} font={SANS} color={C.dim}>a mesma molécula usada até hoje</Title>
        </AbsoluteFill>
      )}
    </Part>
  );
};

// 3. a COX e os mensageiros
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const outs = [["⚡", "Dor"], ["🌡️", "Febre"], ["🔥", "Inflamação"]];
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.cox} y={250} size={56}>A enzima <b style={{ color: "#a78bfa" }}>COX</b></Title>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        <g opacity={it(f, T.cox, T.cox + 14, 0, 1, OUT)}><Cox x={540} y={620} f={f} /></g>
        {f >= T.gordura && Array.from({ length: 8 }, (_, i) => {
          const k = ((f - T.gordura) / 70 + i / 8) % 1;
          return <circle key={i} cx={-40 + k * 420} cy={620 + Math.sin(k * 8) * 10} r={13} fill="#fcd34d" opacity={k < 0.85 ? 1 : (1 - k) * 6} style={{ filter: "drop-shadow(0 0 6px #fcd34d)" }} />;
        })}
        {f >= T.tromboxano + 20 && Array.from({ length: 9 }, (_, i) => {
          const k = it(f, T.tromboxano + 20 + i * 3, T.tromboxano + 60 + i * 3, 0, 1, EASE);
          const a = (i / 9) * Math.PI * 2;
          const r0 = 260, r1 = 34 + (i % 3) * 14;
          return <Platelet key={i} x={540 + Math.cos(a) * (r0 + (r1 - r0) * k)} y={1420 + Math.sin(a) * (r0 + (r1 - r0) * k) * 0.45} r={22} />;
        })}
      </svg>
      <Title f={f} at={T.gordura} y={345} size={34} font={SANS} color="#fcd34d" weight={600}>gordura das células → mensageiros</Title>
      {outs.map(([e, l], i) => (
        <Card key={i} f={f} at={T.dor + i * 12} x={60 + i * 330} y={880} w={300} h={190} tilt={[-1.2, 0.8, -0.6][i]} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontFamily: EMOJI, fontSize: 70 }}>{e}</span>
          <span style={{ fontWeight: 700, fontSize: 38 }}>{l}</span>
        </Card>
      ))}
      <Card f={f} at={T.tromboxano} x={110} y={1120} w={860} h={140} border={rgba("#c084fc", 0.6)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <span style={{ fontFamily: EMOJI, fontSize: 60 }}>🩸</span>
        <span style={{ fontSize: 40, fontWeight: 600 }}><b style={{ color: "#c084fc" }}>Tromboxano</b> → plaquetas grudam</span>
      </Card>
    </Part>
  );
};

// 4. trava para sempre, enzima nova, plaquetas sem núcleo
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const fly = it(f, T.cola, T.cola + 40, 0, 1, EASE);
  const stick = it(f, T.cola + 44, T.trava - 10, 0, 1, EASE);
  const off = it(f, T.trava - 6, T.trava + 8, 0, 1, OUT);
  const aOut = it(f, T.recupera + 20, T.recupera + 40, 0, 1, IN); // velha se desfaz
  const newK = it(f, T.nova - 10, T.nova + 10, 0, 1, SNAP);
  const sub1 = 1 - it(f, T.horas - 12, T.horas, 0, 1, IN);
  const sub2 = it(f, T.horas - 4, T.horas + 10, 0, 1, OUT);
  // slot da COX (centro x=540, y=620): slot em x 540+125
  const sx = 540 + 125, sy = 620;
  const mx = 1300 + (sx + 60 - 1300) * fly, my = 1300 + (sy + 120 - 1300) * fly;
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      {sub1 > 0 && (
        <AbsoluteFill style={{ opacity: sub1, filter: sub1 < 1 ? `blur(${(1 - sub1) * 12}px)` : undefined }}>
          <svg width={W} height={1920} style={{ position: "absolute" }}>
            {aOut < 1 && (
              <g opacity={1 - aOut} transform={`translate(${aOut * 0},${aOut * 60}) rotate(${aOut * 8},540,620)`}>
                <Cox x={540} y={620} f={f} off={off} />
                {stick > 0 && <Acetyl x={mx - 56 + (sx - (mx - 56)) * stick - 4} y={my + 18 + (sy - 12 - (my + 18)) * stick} s={1.4} />}
                {off > 0 && <text x={540} y={810} textAnchor="middle" fontFamily="'Noto Color Emoji'" fontSize={110 * (0.5 + 0.5 * SNAP(off))} opacity={Math.min(1, off * 1.5)}>🔒</text>}
              </g>
            )}
            {aOut > 0 && aOut < 1 && Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2;
              return <rect key={i} x={540 + Math.cos(a) * 300 * aOut} y={620 + Math.sin(a) * 260 * aOut} width={30} height={18} rx={5} fill="#64748b" opacity={1 - aOut} transform={`rotate(${aOut * 300 + i * 40},${540 + Math.cos(a) * 300 * aOut},${620 + Math.sin(a) * 260 * aOut})`} />;
            })}
            {f >= T.cola && f < T.cola + 60 && <AasMol x={mx} y={my} s={1.2} acetyl={stick <= 0} />}
            {f >= T.cola + 44 && f < T.trava + 10 && <g opacity={1 - P(f, T.trava - 10, T.trava + 10)}><AasMol x={mx + 30 * stick} y={my + 140 * stick} s={1.2} acetyl={false} /></g>}
            {newK > 0 && <g opacity={Math.min(1, newK * 1.4)} transform={`translate(540,620) scale(${0.6 + 0.4 * newK}) translate(-540,-620)`}><Cox x={540} y={620} f={f} label="COX nova" color="#34d399" /></g>}
          </svg>
          <div style={{ opacity: 1 - P(f, T.recupera, T.recupera + 12) }}><Title f={f} at={T.trava} y={250} size={64} weight={600}>Trava para sempre</Title></div>
          <div style={{ position: "absolute", top: 960, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 110, letterSpacing: 2, color: bornColor(f, T.irreversivel, "#fdba74", ACETIL), textShadow: `0 0 40px ${rgba(ACETIL, 0.4)}`, opacity: it(f, T.irreversivel, T.irreversivel + 12, 0, 1, OUT) * (1 - P(f, T.recupera, T.recupera + 12)), transform: `scale(${0.9 + 0.1 * it(f, T.irreversivel, T.irreversivel + 12, 0, 1, SNAP)})` }}>IRREVERSÍVEL</div>
          <div style={{ position: "absolute", top: 1110, width: W, textAlign: "center", fontFamily: SANS, fontSize: 40, color: C.dim, opacity: it(f, T.estrutura, T.estrutura + 12, 0, 1, OUT) * (1 - P(f, T.recupera, T.recupera + 12)) }}>a estrutura da enzima muda de vez</div>
          <Title f={f} at={T.recupera} y={1000} size={46} font={SANS} weight={600}>o corpo destrói a enzima velha…</Title>
          <Title f={f} at={T.nova} y={1080} size={46} font={SANS} weight={600} color="#34d399" from="#34d399">…e fabrica uma COX nova</Title>
        </AbsoluteFill>
      )}
      {sub2 > 0 && (
        <AbsoluteFill style={{ opacity: sub2 }}>
          <Card f={f} at={T.horas} x={60} y={280} w={460} h={560} border={rgba("#34d399", 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <svg width={220} height={220}><circle cx={110} cy={110} r={96} fill="rgba(96,165,250,.12)" stroke="#93c5fd" strokeWidth={4} /><circle cx={110} cy={110} r={38} fill="rgba(167,139,250,.5)" stroke="#a78bfa" strokeWidth={3} /></svg>
            <span style={{ fontSize: 40, fontWeight: 700 }}>Célula com núcleo</span>
            <span style={{ fontSize: 34, color: "#34d399", fontWeight: 600 }}>✓ COX nova em horas</span>
          </Card>
          <Card f={f} at={T.plaquetas} x={560} y={280} w={460} h={560} border={rgba(C.alert, 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <svg width={220} height={220}><ellipse cx={110} cy={110} rx={96} ry={60} fill="rgba(192,132,252,.25)" stroke="#c084fc" strokeWidth={4} /></svg>
            <span style={{ fontSize: 40, fontWeight: 700 }}>Plaqueta</span>
            <span style={{ fontSize: 34, color: C.alert, fontWeight: 600 }}>✗ sem núcleo</span>
            <span style={{ fontSize: 30, color: C.dim }}>não fabrica enzima nova</span>
          </Card>
          {f >= T.dias && (
            <div style={{ position: "absolute", left: 60, top: 920, width: 960, opacity: it(f, T.dias, T.dias + 12, 0, 1, OUT) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 92, textAlign: "center", color: COR }}>7 a 10 dias</div>
              <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                {Array.from({ length: 10 }, (_, i) => {
                  const on = P(f, T.dias + 10 + i * 6, T.dias + 16 + i * 6);
                  return <div key={i} style={{ flex: 1, height: 70, borderRadius: 12, background: mix("#1e293b", i < 7 ? COR : "#93c5fd", on), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: on > 0.5 ? "#0b1226" : C.dim }}>{i + 1}</div>;
                })}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 36, color: C.dim, textAlign: "center", marginTop: 24, opacity: P(f, T.dias + 50, T.dias + 62) }}>até nascerem plaquetas novas</div>
            </div>
          )}
        </AbsoluteFill>
      )}
    </Part>
  );
};

// vaso com sangue correndo (usado nas cenas 5 e 6)
const Flow: React.FC<{ f: number; y0: number; y1: number; speed: number; platColor: string; stopX?: number }> = ({ f, y0, y1, speed, platColor }) => (
  <g>
    {Array.from({ length: 12 }, (_, i) => {
      const x = (((i * 97 + f * speed) % 1260) + 1260) % 1260 - 90;
      const y = y0 + 40 + ((i * 53) % (y1 - y0 - 80));
      return i % 3 === 0 ? <Platelet key={i} x={x} y={y} r={16} color={platColor} /> : <RedCell key={i} x={x} y={y} />;
    })}
  </g>
);

// 5. "afinar o sangue"
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const slip = P(f, T.menosGrud, T.menosGrud + 20);
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.afinar} y={260} size={72} weight={600}>“Afinar o sangue”</Title>
      <svg width={W} height={1920} style={{ position: "absolute" }}>
        <rect x={-20} y={520} width={W + 40} height={300} rx={150} fill="rgba(239,68,68,.08)" stroke="#f87171" strokeWidth={5} />
        <Flow f={f} y0={520} y1={820} speed={6} platColor={mix("#c084fc", COR, slip)} />
      </svg>
      {f >= T.menosGrud && (
        <>
          <div style={{ position: "absolute", top: 940, width: W, textAlign: "center", fontFamily: SANS, fontSize: 44, color: C.dim, opacity: it(f, T.menosGrud, T.menosGrud + 10, 0, 1, OUT) }}>
            <span style={{ textDecoration: `line-through ${C.alert} 5px` }}>o sangue fica mais fino</span> <span style={{ color: C.alert }}>✗</span>
          </div>
          <Title f={f} at={T.menosGrud + 16} y={1030} size={56} weight={600} color={COR}>as plaquetas ficam menos grudentas ✓</Title>
        </>
      )}
    </Part>
  );
};

// 6. a placa, o coágulo, infarto e AVC
export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const plaque = it(f, T.placas, T.placas + 60, 0, 1, EASE);
  const rupt = P(f, T.rompe, T.rompe + 10);
  const aas = it(f, T.comAAS, T.comAAS + 40, 0, 1, EASE);
  const clot = it(f, T.rompe + 6, T.rompe + 90, 0, 1, EASE) * (1 - aas);
  const blocked = clot;
  const speed = 6 * (1 - 0.85 * blocked);
  const sub2 = it(f, T.stent - 8, T.stent + 8, 0, 1, IN);
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      {sub2 < 1 && (
        <AbsoluteFill style={{ opacity: 1 - sub2, filter: sub2 > 0 ? `blur(${sub2 * 12}px)` : undefined }}>
          <Title f={f} at={T.protege} y={250} size={60}>E por que isso protege?</Title>
          <svg width={W} height={1920} style={{ position: "absolute" }}>
            <rect x={-20} y={480} width={W + 40} height={360} fill="rgba(239,68,68,.06)" />
            <line x1={0} y1={480} x2={W} y2={480} stroke="#f87171" strokeWidth={8} />
            <line x1={0} y1={840} x2={W} y2={840} stroke="#f87171" strokeWidth={8} />
            <Flow f={f} y0={480} y1={840 - 130 * plaque} speed={speed} platColor={aas > 0.5 ? COR : "#c084fc"} />
            {/* placa de gordura */}
            <path d={`M300,840 C380,${840 - 170 * plaque} 700,${840 - 170 * plaque} 780,840 Z`} fill="#fcd34d" stroke="#f59e0b" strokeWidth={4} />
            {rupt > 0 && <path d={`M510,${840 - 165 * plaque} L530,${840 - 130 * plaque} L515,${840 - 110 * plaque} L540,${840 - 80 * plaque}`} fill="none" stroke={C.alert} strokeWidth={6} opacity={rupt} />}
            {/* coágulo de plaquetas */}
            {clot > 0 && Array.from({ length: 26 }, (_, i) => {
              const a = (i / 26) * Math.PI;
              const k = P(clot, i / 40, i / 40 + 0.35);
              const cx = 540 + Math.cos(a) * (40 + (i % 5) * 26) * k;
              const cy = 840 - 165 * plaque - Math.sin(a) * (30 + (i % 4) * 30) * k;
              return <Platelet key={i} x={cx} y={cy} r={20} color="#c084fc" o={k} />;
            })}
            {clot > 0.6 && <ellipse cx={540} cy={840 - 165 * plaque - 60} rx={170 * clot} ry={110 * clot} fill="rgba(153,27,27,.35)" />}
          </svg>
          <Title f={f} at={T.placas} y={880} size={36} font={SANS} color="#fcd34d" weight={600}>placa de gordura na artéria</Title>
          <Title f={f} at={T.rompe} y={940} size={36} font={SANS} color={C.alert} weight={600}>a placa se rompe → coágulo</Title>
          <Card f={f} at={T.coracao} x={60} y={1030} w={460} h={200} border={rgba(C.alert, 0.5)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <span style={{ fontFamily: EMOJI, fontSize: 80 }}>🫀</span><span style={{ fontSize: 42, fontWeight: 700 }}>Infarto</span>
          </Card>
          <Card f={f} at={T.cerebro} x={560} y={1030} w={460} h={200} border={rgba(C.alert, 0.5)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <span style={{ fontFamily: EMOJI, fontSize: 80 }}>🧠</span><span style={{ fontSize: 42, fontWeight: 700 }}>AVC</span>
          </Card>
          {f >= T.comAAS && <Pill x={540} y={1330} text="Com AAS: o coágulo não se forma" color={COR} size={40} k={it(f, T.comAAS + 10, T.comAAS + 24, 0, 1, LIN)} />}
        </AbsoluteFill>
      )}
      {sub2 > 0 && (
        <AbsoluteFill style={{ opacity: sub2 }}>
          <Title f={f} at={T.stent} y={300} size={60} weight={600}>Quem costuma tomar</Title>
          {[["🫀", "Já teve infarto"], ["🧠", "Já teve AVC"], ["🩺", "Colocou stent"]].map(([e, l], i) => (
            <Card key={i} f={f} at={T.stent + 20 + i * 14} x={140} y={460 + i * 190} w={800} h={160} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 50px" }}>
              <span style={{ fontFamily: EMOJI, fontSize: 70 }}>{e}</span><span style={{ fontSize: 46, fontWeight: 600 }}>{l}</span>
            </Card>
          ))}
          <Title f={f} at={T.stent + 80} y={1080} size={44} font={SANS} weight={700} color={COR}>dose baixa, todos os dias</Title>
          <Title f={f} at={T.stent + 100} y={1150} size={34} font={SANS} color={C.dim}>sempre com indicação médica</Title>
        </AbsoluteFill>
      )}
    </Part>
  );
};

// 7. COX-1 e COX-2
export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const lock = it(f, T.bloqueia, T.bloqueia + 12, 0, 1, SNAP);
  const box = (i: number, title: string, items: [string, string][], col: string) => (
    <Card f={f} at={T.cox12 + 10 + i * 40} x={60 + i * 500} y={380} w={460} h={560} border={rgba(col, 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 26 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 70, color: col }}>{title}</div>
      {items.map(([e, l], j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 600 }}><span style={{ fontFamily: EMOJI, fontSize: 52 }}>{e}</span>{l}</div>)}
      {lock > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: `rgba(7,11,26,${0.55 * lock})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EMOJI, fontSize: 130 * (0.5 + 0.5 * lock), opacity: Math.min(1, lock * 1.5) }}>🔒</div>}
    </Card>
  );
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.cox12} y={250} size={56}>Duas versões da enzima</Title>
      {box(0, "COX-1", [["🛡️", "protege o estômago"], ["🩸", "ajuda as plaquetas"]], "#a78bfa")}
      {box(1, "COX-2", [["🔥", "inflamação"]], "#f472b6")}
      <Title f={f} at={T.bloqueia} y={1000} size={50} font={SANS} weight={700} color={COR}>O AAS bloqueia as duas</Title>
      {f >= T.doseAlta && (
        <div style={{ position: "absolute", top: 1100, width: W, display: "flex", justifyContent: "center", gap: 22 }}>
          {["Dose alta:", "⚡ dor ↓", "🌡️ febre ↓"].map((t, i) => (
            <div key={i} style={{ padding: "14px 26px", borderRadius: 999, border: i ? `2px solid ${COR}` : "none", background: i ? rgba(COR, 0.12) : "transparent", fontFamily: SANS, fontWeight: 700, fontSize: 38, color: i ? C.ink : C.dim, opacity: it(f, T.doseAlta + i * 8, T.doseAlta + 12 + i * 8, 0, 1, OUT) }}>
              {t.split(" ").map((w, j) => /[☀-➿\u{1F300}-\u{1FAFF}]/u.test(w) ? <span key={j} style={{ fontFamily: EMOJI }}>{w} </span> : <span key={j}>{w} </span>)}
            </div>
          ))}
        </div>
      )}
    </Part>
  );
};

// 8. cuidados
export const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Title f={f} at={T.cuidados[0] - 4} y={235} size={56} weight={600} color="#fda4af" from={C.alert}>Cuidados</Title>
      {CUIDADOS.map((c, i) => {
        const at = T.cuidados[i];
        const next = T.cuidados[i + 1] ?? T.orientacao;
        const hot = f >= at && f < next;
        return (
          <Card key={i} f={f} at={at} x={50} y={330 + i * 182} w={980} h={164} border={hot ? rgba(C.alert, 0.75) : C.boxBorder} tilt={0} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 34px", boxShadow: hot ? `0 0 30px ${rgba(C.alert, 0.25)}` : undefined }}>
            <span style={{ fontFamily: EMOJI, fontSize: 64, flexShrink: 0 }}>{c.icone}</span>
            <span style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.25, color: bornColor(f, at, C.ink, C.alert) }}>{c.texto}</span>
          </Card>
        );
      })}
    </Part>
  );
};

// 9. orientação e mensagem final
export const S9: React.FC = () => {
  const f = useCurrentFrame();
  const out1 = it(f, T.final - 8, T.final + 2, 0, 1, IN);
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100} outDur={1}>
      {out1 < 1 && (
        <AbsoluteFill style={{ opacity: 1 - out1, filter: out1 > 0 ? `blur(${out1 * 14}px)` : undefined }}>
          <Emoji f={f} at={T.orientacao} x={540} y={720} size={150}>🩺</Emoji>
          <Title f={f} at={T.orientacao + 4} y={860} size={64} weight={600} color={C.ink} from={C.alert}>Use só com orientação médica.</Title>
        </AbsoluteFill>
      )}
      {f >= T.final && (
        <AbsoluteFill style={{ opacity: it(f, T.final, T.final + 12, 0, 1, OUT) }}>
          {MENSAGEM_FINAL.map((l, i) => {
            const at = T.final + 4 + i * 8;
            const k = it(f, at, at + 14, 0, 1, OUT);
            return <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, COR, "#f0f7ff", 20) : bornColor(f, at, C.ink, COR), textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, 4810, 0, 1, LIN)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>;
          })}
          <div style={{ position: "absolute", top: 1150, width: W, textAlign: "center", fontFamily: SANS, fontSize: 24, color: C.dim, opacity: it(f, T.final + 30, T.final + 42, 0, 1, OUT) * 0.85 }}>Conteúdo educativo. Ref.: {REFERENCIAS}</div>
        </AbsoluteFill>
      )}
    </Part>
  );
};
