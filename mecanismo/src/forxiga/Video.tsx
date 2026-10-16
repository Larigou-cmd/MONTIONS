import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, Check, EASE, Grain, OUT, P, Part, Pill, SNAP, W, bornColor, it, mix, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { COMP, COR, DURATION, GLI, MENSAGEM_FINAL, NA, PARTES, SANGUE, SFX, SGLT, T } from "./config";

// Forxiga (dapagliflozina) no modelo "aula elegante": fundo escuro com brilho, títulos em serifa,
// cartões arredondados, sem legenda e sem referências na tela.
export { DURATION };
const R = (i: number) => PARTES[i];
const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={W} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const mov = (f: number, i: number, j: number, a: number, b: number) => interpolate(f, [i, j], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
const some = (f: number, at: number) => 1 - P(f, at - 10, at);

// comprimido amarelo em losango (como o do Forxiga 10 mg)
const Comprimido: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle r={250} fill={rgba(COR, 0.12)} style={{ filter: "blur(40px)" }} />
    <rect x={-120} y={-120} width={240} height={240} rx={60} transform="rotate(45)" fill={COMP} style={{ filter: `drop-shadow(0 0 26px ${rgba(COMP, 0.55)})` }} />
    <rect x={-100} y={-100} width={200} height={200} rx={48} transform="rotate(45)" fill="none" stroke="#fde68a" strokeWidth={6} opacity={0.7} />
    <text y={22} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={70} fill="#ca8a04">10</text>
  </g>
);

// 1. abertura
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, 6, 32, 0, 1, SNAP);
  const chips: [number, string][] = [[T.dm2, "Diabetes tipo 2"], [T.ic, "Insuficiência cardíaca"], [T.drc, "Doença renal crônica"]];
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <Tela>{k > 0 && <Comprimido x={540} y={540} s={k} rot={-12 + Math.sin(f / 30) * 5} />}</Tela>
      <Title f={f} at={T.forxiga} y={790} size={96} weight={600} from={COR}>Forxiga®</Title>
      <Title f={f} at={T.dapa} y={920} size={50} font={SANS} weight={600} color={COR} from={COR}>dapagliflozina</Title>
      {chips.map(([at, t], i) => <Pill key={i} x={540} y={1090 + i * 100} text={t} color={COR} size={40} k={P(f, at, at + 12)} />)}
    </Part>
  );
};

// 2. mecanismo: o SGLT2 devolve a glicose; a dapagliflozina bloqueia e a glicose sai na urina
const PORTAS = [330, 470, 610, 750];
const ponto = (pts: [number, number][], d: number): [number, number] | null => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (d <= L) return [x0 + ((x1 - x0) * d) / L, y0 + ((y1 - y0) * d) / L];
    d -= L;
  }
  return null;
};
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const bloq = P(f, T.bloqueia - 6, T.bloqueia + 8);
  const dots: React.ReactNode[] = [];
  for (let s = Math.max(Math.ceil(T.filtrado / 6) * 6, Math.floor((f - 260) / 6) * 6); s <= f; s += 6) {
    const i = s / 6;
    const sai = s >= T.bloqueia - 40;
    const gx = PORTAS[i % 4];
    const caminho: [number, number][] = sai ? [[170, 680], [900, 680], [900, 1010]] : [[170, 680], [gx, 680], [gx, 505], [1060, 505]];
    const p = ponto(caminho, (f - s) * 7);
    if (!p) continue;
    dots.push(<circle key={s} cx={p[0]} cy={p[1] + Math.sin(i) * 10} r={11} fill={GLI} style={{ filter: `drop-shadow(0 0 6px ${GLI})` }} />);
  }
  const vasoK = it(f, T.rins - 10, T.rins + 10, 0, 1, OUT);
  const textoA = some(f, T.dapa2);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title f={f} at={T.como} y={235} size={66} weight={600} from={COR}>Como ele age?</Title>
      <Tela>
        <g opacity={vasoK}>
          {/* vaso de sangue */}
          <rect x={60} y={470} width={960} height={70} rx={35} fill={rgba(SANGUE, 0.14)} stroke={SANGUE} strokeWidth={4} />
          <text x={80} y={455} fontFamily={SANS} fontWeight={700} fontSize={30} fill={SANGUE}>sangue</text>
          {/* glomérulo */}
          {Array.from({ length: 7 }, (_, j) => <circle key={j} cx={150 + Math.cos(j) * 34} cy={600 + Math.sin(j * 1.7) * 26} r={22} fill="none" stroke={SANGUE} strokeWidth={4} opacity={0.8} />)}
          {/* túbulo */}
          <path d="M150,640 L900,640 Q940,640 940,680 L940,1000 L860,1000 L860,720 L150,720 Z" fill={rgba("#94a3b8", 0.1)} stroke="#cbd5e1" strokeWidth={4} strokeLinejoin="round" />
          {/* portas SGLT2 */}
          {PORTAS.map((x, j) => {
            const at = T.dapa2 + j * 5;
            const dk = mov(f, at, at + 32, 0, 1);
            const corPorta = mix(SGLT, "#64748b", bloq);
            return (
              <g key={j}>
                <rect x={x - 26} y={548} width={52} height={92} rx={14} fill={rgba(SGLT, 0.25 * (1 - bloq) + 0.05)} stroke={corPorta} strokeWidth={5} style={{ filter: `drop-shadow(0 0 ${10 * (1 - bloq)}px ${SGLT})` }} />
                {f >= at && <ellipse cx={1120 + (x - 1120) * dk} cy={260 + (594 - 260) * dk} rx={24} ry={14} fill={COR} style={{ filter: `drop-shadow(0 0 10px ${COR})` }} />}
                {bloq > 0 && <text x={x} y={530} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40 * SNAP(Math.min(1, bloq))} fill={C.alert}>✕</text>}
              </g>
            );
          })}
          {dots}
          {/* urina */}
          {f >= T.urina - 10 && (
            <g transform={`translate(900,1090) scale(${it(f, T.urina - 10, T.urina + 6, 0, 1, SNAP)})`}>
              <path d="M0,-60 C30,-20 46,6 46,28 C46,56 24,74 0,74 C-24,74 -46,56 -46,28 C-46,6 -30,-20 0,-60 Z" fill={rgba(GLI, 0.35)} stroke={GLI} strokeWidth={5} />
            </g>
          )}
        </g>
      </Tela>
      <Pill x={330} y={800} text="túbulo proximal" color="#cbd5e1" size={32} k={P(f, T.tubulo, T.tubulo + 12)} />
      <Pill x={590} y={410} text="SGLT2" color={SGLT} size={34} k={P(f, T.sglt2, T.sglt2 + 12)} />
      <div style={{ opacity: textoA }}>
        <Title f={f} at={T.volta} y={1170} size={40} font={SANS} weight={600} color={C.ink} from={GLI}>quase toda a glicose volta para o sangue</Title>
        <Title f={f} at={T.sglt2} y={1240} size={44} font={SANS} weight={700} color={SGLT} from={SGLT}>pelo SGLT2</Title>
      </div>
      <Title f={f} at={T.dapa2} y={1170} size={44} font={SANS} weight={700} color={COR} from={COR}>a dapagliflozina bloqueia o SGLT2</Title>
      <Title f={f} at={T.urina} y={1240} size={40} font={SANS} weight={600} color={C.ink} from={GLI}>e a glicose sai pela urina</Title>
      <Title f={f} at={T.setenta} y={1300} size={76} weight={600} color={GLI} from={GLI}>≈ 70 g por dia</Title>
      <Pill x={540} y={1450} text="glicemia ↓" color={GLI} size={38} k={P(f, T.glicemia, T.glicemia + 12)} />
    </Part>
  );
};

// rim simples
const Rim: React.FC<{ s: number }> = ({ s }) => (
  <svg width={160 * s} height={160 * s} viewBox="-80 -80 160 160">
    <path d="M-10,-62 C-55,-70 -70,-25 -64,10 C-58,48 -26,70 4,60 C24,54 22,32 10,22 C-2,12 -2,-10 12,-20 C26,-30 26,-56 -10,-62 Z" fill={rgba("#f472b6", 0.35)} stroke="#f472b6" strokeWidth={6} style={{ filter: "drop-shadow(0 0 12px rgba(244,114,182,.6))" }} />
  </svg>
);

// 3. junto sai sódio e água: alivia o coração e protege os rins
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const bolhas: [number, string, string, string][] = [[T.junto + 12, "glicose", "G", GLI], [T.sodio, "sódio", "Na⁺", NA], [T.agua, "água", "H₂O", "#67e8f9"]];
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.junto} y={235} size={60} weight={600} from={GLI}>Junto com a glicose…</Title>
      {bolhas.map(([at, nome, sim, cor], i) => {
        if (f < at) return null;
        const k = it(f, at, at + 14, 0, 1, SNAP);
        return (
          <div key={i} style={{ position: "absolute", left: 200 + i * 340 - 85, top: 380 + Math.sin(f / 20 + i) * 8, width: 170, textAlign: "center", transform: `scale(${k})`, opacity: Math.min(1, k * 1.4) }}>
            <div style={{ width: 170, height: 170, borderRadius: 85, border: `4px solid ${cor}`, background: rgba(cor, 0.18), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: cor, boxShadow: `0 0 30px ${rgba(cor, 0.4)}` }}>{sim}</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink, marginTop: 14 }}>{nome}</div>
          </div>
        );
      })}
      <Card f={f} at={T.coracao} x={60} y={680} w={465} h={300} border={rgba(SANGUE, 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <span style={{ fontFamily: EMOJI, fontSize: 96, transform: `scale(${1 + 0.06 * Math.sin(f / 5)})` }}>❤️</span>
        <span style={{ fontWeight: 700, fontSize: 40 }}>Alivia o coração</span>
      </Card>
      <Card f={f} at={T.protege} x={555} y={680} w={465} h={300} border={rgba("#f472b6", 0.6)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Rim s={0.9} />
        <span style={{ fontWeight: 700, fontSize: 40 }}>Protege os rins</span>
      </Card>
      <Title f={f} at={T.tambem} y={1040} size={42} font={SANS} weight={600} color={C.ink} from={COR}>Por isso, também é usado na</Title>
      <Pill x={540} y={1150} text="insuficiência cardíaca" color={SANGUE} size={40} k={P(f, T.icDrc, T.icDrc + 12)} />
      <Pill x={540} y={1245} text="doença renal crônica" color="#f472b6" size={40} k={P(f, T.drc2, T.drc2 + 12)} />
      <Title f={f} at={T.semDiabetes} y={1310} size={56} weight={600} color={COR} from={COR}>mesmo sem diabetes</Title>
    </Part>
  );
};

// 4. off-label
const Linha: React.FC<{ f: number; at: number; y: number; icone: string; texto: React.ReactNode; borda?: string; h?: number }> = ({ f, at, y, icone, texto, borda = C.boxBorder, h = 170 }) => (
  <Card f={f} at={at} x={60} y={y} w={960} h={h} border={borda} style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 38px" }}>
    <span style={{ fontFamily: EMOJI, fontSize: 66, flexShrink: 0 }}>{icone}</span>
    <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.25, color: bornColor(f, at, C.ink, COR) }}>{texto}</span>
  </Card>
);
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const st = it(f, T.fora, T.fora + 12, 0, 1, SNAP);
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.off} y={235} size={66} weight={600} from={COR}>Uso off-label?</Title>
      <Linha f={f} at={T.emagrecer} y={360} icone="⚖️" texto="Para emagrecer, sem diabetes" />
      <Linha f={f} at={T.tipo1} y={560} icone="💉" texto="No diabetes tipo 1" />
      {st > 0 && (
        <div style={{ position: "absolute", top: 790, width: W, display: "flex", justifyContent: "center", opacity: Math.min(1, st * 1.4) }}>
          <div style={{ transform: `rotate(-5deg) scale(${0.6 + 0.4 * st})`, padding: "18px 44px", border: `5px solid ${C.alert}`, borderRadius: 20, fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: 4, color: C.alert, boxShadow: `0 0 30px ${rgba(C.alert, 0.35)}` }}>FORA DA BULA</div>
        </div>
      )}
      <Linha f={f} at={T.ceto} y={990} h={210} borda={rgba(C.alert, 0.7)} icone="⚠️" texto={<>No tipo 1: mais risco de <b style={{ color: "#fda4af" }}>cetoacidose</b>{f >= T.grave ? <span style={{ color: C.dim, fontWeight: 500 }}>, uma complicação grave</span> : null}</>} />
    </Part>
  );
};

// 5. Farmácia Popular
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const crit: [number, string][] = [[T.crDm2, "Diabetes tipo 2"], [T.cr65, "65 anos ou mais"], [T.crDcv, "Doença cardiovascular"]];
  const levar: [number, string, string][] = [[T.receita, "📄", "Receita"], [T.cpf, "🪪", "Documento com CPF"], [T.credenciada, "🏪", "Farmácia credenciada"]];
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.sus - 20} y={235} size={60} weight={600} from={COR}>Como conseguir pelo SUS?</Title>
      <Card f={f} at={T.fp} x={60} y={350} w={960} h={190} border={rgba("#22c55e", 0.6)} style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 38px" }}>
        <span style={{ fontFamily: EMOJI, fontSize: 80 }}>💊</span>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 60 }}>Farmácia Popular</span>
      </Card>
      <Pill x={880} y={350} text="GRÁTIS" color="#22c55e" size={36} k={P(f, T.graca, T.graca + 12)} />
      {f >= T.crDm2 - 6 && <div style={{ position: "absolute", left: 70, top: 580, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.dim, opacity: P(f, T.crDm2 - 6, T.crDm2 + 6) }}>QUEM TEM DIREITO</div>}
      {crit.map(([at, t], i) => {
        if (f < at) return null;
        const k = it(f, at, at + 12, 0, 1, OUT);
        return (
          <div key={i} style={{ position: "absolute", left: 90, top: 640 + i * 90, display: "flex", alignItems: "center", gap: 22, opacity: k, transform: `translateX(${(1 - k) * -60}px)`, fontFamily: SANS, fontWeight: 600, fontSize: 44, color: C.ink }}>
            <Check size={50} color="#22c55e" /> {t}
          </div>
        );
      })}
      {f >= T.receita - 6 && <div style={{ position: "absolute", left: 70, top: 950, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.dim, opacity: P(f, T.receita - 6, T.receita + 6) }}>O QUE LEVAR</div>}
      {levar.map(([at, e, t], i) => (
        <Card key={i} f={f} at={at} x={60 + i * 330} y={1010} w={300} h={220} tilt={[-1, 0.8, -0.6][i]} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center", padding: "0 14px" }}>
          <span style={{ fontFamily: EMOJI, fontSize: 70 }}>{e}</span>
          <span style={{ fontWeight: 700, fontSize: 32, lineHeight: 1.2 }}>{t}</span>
        </Card>
      ))}
    </Part>
  );
};

// 6. Componente Especializado: diagnósticos e CIDs
const Cid: React.FC<{ t: string }> = ({ t }) => (
  <span style={{ padding: "6px 16px", borderRadius: 12, border: `2px solid ${COR}`, background: rgba(COR, 0.15), color: "#ddd6fe", fontWeight: 700, fontSize: 30, whiteSpace: "nowrap" }}>{t}</span>
);
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const crit: [number, string][] = [[T.metformina, "quando a metformina não basta"], [T.quarenta, "≥ 40 anos com doença cardiovascular"], [T.homens, "ou homens ≥ 55 / mulheres ≥ 60 com alto risco cardiovascular"]];
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Title f={f} at={T.menos65} y={235} size={62} weight={600} from={COR}>Menos de 65 anos?</Title>
      <Card f={f} at={T.ceaf} x={60} y={340} w={960} h={190} border={rgba(COR, 0.6)} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 36px" }}>
        <span style={{ fontFamily: EMOJI, fontSize: 76 }}>🏥</span>
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50 }}>Componente Especializado</div>
          <div style={{ fontSize: 34, color: C.dim, opacity: P(f, T.altoCusto, T.altoCusto + 10) }}>farmácia de alto custo do estado</div>
        </div>
      </Card>
      {f >= T.tres && <div style={{ position: "absolute", left: 70, top: 560, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.dim, opacity: P(f, T.tres, T.tres + 10) }}>3 DIAGNÓSTICOS · CID</div>}
      <Card f={f} at={T.dm2c} x={60} y={610} w={960} h={420} border={rgba(GLI, 0.55)} style={{ padding: "26px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: GLI }}>Diabetes tipo 2</span>
          <Cid t="CID E11" />
        </div>
        {crit.map(([at, t], i) => (
          <div key={i} style={{ marginTop: 18, fontSize: 36, fontWeight: 600, lineHeight: 1.25, opacity: P(f, at, at + 10), transform: `translateX(${(1 - P(f, at, at + 10)) * -30}px)` }}>• {t}</div>
        ))}
      </Card>
      <Card f={f} at={T.icc} x={60} y={1055} w={960} h={170} border={rgba(SANGUE, 0.55)} style={{ padding: "22px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 42, color: "#fca5a5" }}>Insuficiência cardíaca (FE reduzida)</span>
        <div style={{ display: "flex", gap: 12 }}><Cid t="I50.0" /><Cid t="I50.1" /><Cid t="I50.9" /></div>
      </Card>
      <Card f={f} at={T.drcc} x={60} y={1245} w={960} h={170} border={rgba("#f472b6", 0.55)} style={{ padding: "22px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 42, color: "#f9a8d4" }}>Doença renal crônica</span>
        <div style={{ display: "flex", gap: 12 }}><Cid t="N18.2" /><Cid t="N18.3" /><Cid t="N18.4" /><Cid t="N18.5" /></div>
      </Card>
    </Part>
  );
};

// 7. o processo
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const passos: [number, string, React.ReactNode][] = [
    [T.medico, "👩‍⚕️", <>O médico preenche o <b style={{ color: COR }}>LME</b> e a receita</>],
    [T.documentos, "📁", "Documentos: cartão do SUS, comprovante de residência e exames do protocolo"],
    [T.entrega, "🏥", "Entrega na farmácia do Componente Especializado"],
    [T.analisa, "🔎", "A Secretaria de Saúde analisa"],
    [T.aprovado, "✅", <>Aprovado: retirada todo mês{f >= T.renovado ? <span style={{ color: C.dim }}> · LME renovado a cada 3 meses</span> : null}</>],
  ];
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.processo} y={235} size={62} weight={600} from={COR}>O processo</Title>
      {passos.map(([at, e, t], i) => {
        const next = passos[i + 1]?.[0] ?? T.efeitos;
        const hot = f >= at && f < next;
        return (
          <Card key={i} f={f} at={at} x={50} y={340 + i * 200} w={980} h={182} border={hot ? rgba(COR, 0.75) : C.boxBorder} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 30px", boxShadow: hot ? `0 0 30px ${rgba(COR, 0.25)}` : undefined }}>
            <span style={{ width: 54, height: 54, borderRadius: 27, background: COR, color: "#1e1b4b", fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontFamily: EMOJI, fontSize: 56, flexShrink: 0 }}>{e}</span>
            <span style={{ fontSize: 35, fontWeight: 600, lineHeight: 1.25 }}>{t}</span>
          </Card>
        );
      })}
    </Part>
  );
};

// 8. efeitos mais comuns
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const fim = (at: number) => ({ opacity: P(f, at, at + 12), transform: `translateY(${(1 - P(f, at, at + 12)) * 20}px)` });
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100}>
      <Title f={f} at={T.efeitos} y={235} size={60} weight={600} color="#fda4af" from={C.alert}>Efeitos mais comuns</Title>
      {["Infecção urinária", "Infecção genital"].map((t, i) => (
        <Card key={t} f={f} at={T.infeccao + i * 14} x={60 + i * 495} y={370} w={465} h={230} border={rgba(C.alert, 0.5)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontFamily: EMOJI, fontSize: 76 }}>🦠</span>
          <span style={{ fontWeight: 700, fontSize: 38 }}>{t}</span>
        </Card>
      ))}
      <Title f={f} at={T.causa} y={650} size={40} font={SANS} color={C.dim} from={GLI}>por causa da glicose na urina</Title>
      <Emoji f={f} at={T.agua2} x={300} y={880} size={130}>💧</Emoji>
      {f >= T.agua2 + 4 && <div style={{ position: "absolute", left: 60, width: 480, top: 980, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 44, color: NA, ...fim(T.agua2 + 4) }}>Beba água</div>}
      <Emoji f={f} at={T.higiene} x={780} y={880} size={130}>🧼</Emoji>
      {f >= T.higiene + 4 && <div style={{ position: "absolute", left: 540, width: 480, top: 980, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 44, color: "#f9a8d4", ...fim(T.higiene + 4) }}>Capriche na higiene</div>}
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
        return <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, COR, "#f5f3ff", 20) : bornColor(f, at, C.ink, COR), textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, DURATION, 0, 1, (x) => x)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>;
      })}
    </Part>
  );
};

export const VideoForxiga: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[T.bloqueia, T.setenta, T.semDiabetes, T.fora, T.graca, T.dm2c, T.aprovado, T.final]} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 />
    <Grain />
    <Audio src={staticFile("forxiga/narracao.mp3")} />
    <Audio src={staticFile("forxiga/musica.wav")} volume={(fr) => 0.11 * (1 - P(fr, DURATION - 60, DURATION))} />
    {SFX.map(([fr, name, vol], i) => (
      <Sequence key={i} from={fr} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
