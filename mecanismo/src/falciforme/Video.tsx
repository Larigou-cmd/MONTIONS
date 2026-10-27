import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import {
  Background,
  EASE,
  Grain,
  OUT,
  P,
  Part,
  Pill,
  SNAP,
  W,
  bornColor,
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Title } from "../aas/ui";

// "Doença falciforme: o que é, os perigos e o que o SUS oferece" no modelo "aula elegante",
// no vermelho do carrossel do Ministério da Saúde (27/10, Dia Nacional de Luta pelos Direitos das Pessoas com Doenças Falciformes).
// Narração gravada pela Larissa (ElevenLabs, Juliana). Tempos: audio/falciforme_palavras.json (quadro = segundos × 30).
const COR = "#ef4444"; // sangue
const VERDE = "#4ade80",
  AMAR = "#fbbf24",
  AZUL = "#60a5fa",
  ESCURO = "#991b1b";

// TEMPOS
const T = {
  voce: 216,
  sus0: 250,
  genetica: 417,
  hemoglobina: 520,
  hemacias: 649,
  redondinhas: 706,
  duras: 759,
  foice: 806,
  nome: 899,
  heranca: 915,
  pai: 993,
  mae: 1007,
  quem: 1028,
  traco: 1099,
  numeros: 1249,
  mil: 1286,
  sessenta: 1387,
  negra: 1540,
  perigos: 1563,
  entopem: 1602,
  anemia: 1740,
  amarelados: 1802,
  dor: 1832,
  maoPe: 1879,
  infeccoes: 2062,
  avc: 2105,
  pulmao: 2187,
  rins: 2227,
  procure: 2277,
  febre: 2340,
  falta: 2380,
  palidez: 2415,
  fraqueza: 2460,
  erecao: 2581,
  crianca: 2642,
  diagnostico: 2856,
  pezinho: 2969,
  terceiro: 3061,
  naoFez: 3115,
  quatro: 3203,
  eletroforese: 3263,
  integral: 3382,
  criancas: 3468,
  penicilina: 3506,
  vacinas: 3604,
  doppler: 3658,
  hidroxiureia: 3793,
  capsula: 3986,
  alfa: 4084,
  transfusoes: 4188,
  ferro: 4243,
  transplante: 4407,
  diaADia: 4614,
  agua: 4678,
  frio: 4709,
  esforco: 4738,
  hemocentro: 4800,
  siga: 4846,
  final: 4980,
};
export const DURATION = 5110; // 170,3 s (narração de 165,8 s + mensagem final)
const PARTES: [number, number][] = [
  [0, 282],
  [276, 921],
  [915, 1255],
  [1249, 1569],
  [1563, 2283],
  [2277, 2862],
  [2856, 3388],
  [3382, 3799],
  [3793, 4620],
  [4614, 4852],
  [4846, 4986],
  [4980, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(([de]) => [de, "whoosh", 0.28] as [number, string, number]),
  [T.duras, "trava", 0.28],
  [T.traco, "pop", 0.2],
  [T.mil, "pop", 0.22],
  [T.sessenta, "pop", 0.22],
  [T.entopem, "trava", 0.3],
  [T.febre, "trava", 0.3],
  [T.crianca, "trava", 0.28],
  [T.terceiro, "plim", 0.22],
  [T.penicilina, "pop", 0.2],
  [T.vacinas, "pop", 0.2],
  [T.doppler, "pop", 0.2],
  [T.hidroxiureia, "plim", 0.24],
  [T.alfa, "pop", 0.2],
  [T.transfusoes, "pop", 0.2],
  [T.transplante, "plim", 0.26],
  [T.final, "plim", 0.3],
];
const MENSAGEM_FINAL = ["Consulte um", "profissional de saúde", "para orientações."];

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// ---------- desenhos ----------
// hemácia: disco bicôncavo (k = 0) que vira foice (k = 1)
const Hemacia: React.FC<{ x: number; y: number; r: number; k?: number; rot?: number; o?: number }> = ({ x, y, r, k = 0, rot = 0, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
    {k < 1 && (
      <g opacity={1 - k} transform={`scale(${1 - 0.25 * k},${1 - 0.5 * k})`}>
        <ellipse rx={r} ry={r * 0.92} fill={COR} />
        <ellipse rx={r * 0.55} ry={r * 0.48} fill={ESCURO} opacity={0.55} />
        <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.3} ry={r * 0.12} fill="#fff" opacity={0.25} />
      </g>
    )}
    {k > 0 && (
      <g opacity={k}>
        <path
          d={`M ${-r * 1.2} ${-r * 0.1} Q 0 ${r * 1.4} ${r * 1.2} ${-r * 0.1} Q 0 ${r * 0.38} ${-r * 1.2} ${-r * 0.1} Z`}
          fill="#b91c1c"
          stroke="#7f1d1d"
          strokeWidth={r * 0.06}
          strokeLinejoin="round"
        />
      </g>
    )}
  </g>
);

// vaso sanguíneo horizontal com hemácias passando; "entope" faz as foices pararem e se amontoarem
const Vaso: React.FC<{ f: number; y: number; foice: number; entope?: number; o?: number }> = ({ f, y, foice, entope = 0, o = 1 }) => {
  const h = 220;
  return (
    <g opacity={o}>
      <rect x={-20} y={y - h / 2} width={W + 40} height={h} fill={rgba(COR, 0.12)} />
      <rect x={-20} y={y - h / 2 - 14} width={W + 40} height={14} fill={rgba(COR, 0.55)} />
      <rect x={-20} y={y + h / 2} width={W + 40} height={14} fill={rgba(COR, 0.55)} />
      {Array.from({ length: 9 }, (_, i) => {
        const livre = ((i * 140 + f * 4) % (W + 280)) - 140;
        const preso = 640 - i * 62;
        const x = livre + (preso - livre) * entope;
        const yy = y + Math.sin(i * 1.7 + f / 20) * 50 * (1 - entope) + ((i % 3) - 1) * 45 * entope;
        return <Hemacia key={i} x={x} y={yy} r={52} k={foice} rot={((i * 37) % 360) * foice + Math.sin(f / 15 + i) * 8} />;
      })}
      {entope > 0 && (
        <text x={720} y={y + 24} fontFamily={EMOJI} fontSize={70} opacity={entope}>
          🚫
        </text>
      )}
    </g>
  );
};

// pessoa com 2 "genes" (bolinhas): vermelha = alterado, cinza = normal
const Pessoa: React.FC<{ x: number; y: number; e: string; genes: [boolean, boolean]; legenda: string; cor?: string; k: number }> = ({
  x,
  y,
  e,
  genes,
  legenda,
  cor = C.ink,
  k,
}) => {
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y,
        width: 300,
        textAlign: "center",
        opacity: Math.min(1, k * 1.5),
        transform: `scale(${0.6 + 0.4 * SNAP(Math.min(1, k))})`,
      }}
    >
      <div style={{ fontFamily: EMOJI, fontSize: 96, lineHeight: 1 }}>{e}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12 }}>
        {genes.map((g, i) => (
          <span key={i} style={{ width: 40, height: 40, borderRadius: 20, background: g ? COR : "#64748b", border: "3px solid rgba(255,255,255,0.7)" }} />
        ))}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: cor, marginTop: 10, lineHeight: 1.2 }}>{legenda}</div>
    </div>
  );
};

const Item: React.FC<{ f: number; at: number; y: number; icone: string; texto: React.ReactNode; cor?: string; h?: number }> = ({
  f,
  at,
  y,
  icone,
  texto,
  cor = COR,
  h = 130,
}) => (
  <Card f={f} at={at} x={60} y={y} w={960} h={h} border={rgba(cor, 0.6)} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}>
    <span style={{ fontFamily: EMOJI, fontSize: 56, flexShrink: 0 }}>{icone}</span>
    <span style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.25, color: bornColor(f, at, C.ink, cor) }}>{texto}</span>
  </Card>
);
const Numero: React.FC<{ f: number; at: number; y: number; valor: string; texto: string; cor?: string }> = ({ f, at, y, valor, texto, cor = COR }) => {
  if (f < at - 2) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div style={{ position: "absolute", top: y, width: W, textAlign: "center", opacity: Math.min(1, k * 1.5), transform: `scale(${0.7 + 0.3 * k})` }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 150, lineHeight: 1, color: cor, textShadow: `0 0 40px ${rgba(cor, 0.5)}` }}>{valor}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.ink, marginTop: 10 }}>{texto}</div>
    </div>
  );
};

// ---------- 1. gancho ----------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <Pill x={540} y={230} text="🩸 27 de outubro" color={COR} size={40} k={P(f, 4, 16)} />
      <div
        style={{
          position: "absolute",
          top: 320,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.05,
          color: C.ink,
          opacity: it(f, 10, 24, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        DOENÇA
        <br />
        <span style={{ color: COR }}>FALCIFORME</span>
      </div>
      <div style={{ position: "absolute", top: 560, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, color: "#94a3b8", opacity: P(f, 30, 44) }}>
        Dia Nacional de Luta pelos Direitos
        <br />
        das Pessoas com Doenças Falciformes
      </div>
      <Tela>
        <Hemacia x={540} y={960} r={190} k={it(f, T.voce, T.voce + 40, 0, 1, EASE)} o={P(f, 40, 60)} rot={-10} />
      </Tela>
      <Pill x={540} y={1300} text="✅ e o SUS tem tratamento" color={VERDE} size={42} k={P(f, T.sus0, T.sus0 + 12)} />
    </Part>
  );
};

// ---------- 2. o que é ----------
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const foice = it(f, T.duras, T.duras + 30, 0, 1, EASE);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={60}>
      <Title f={f} at={R(1)[0] + 4} y={180} size={62} weight={600} from={COR}>
        O que é?
      </Title>
      <Item f={f} at={T.genetica} y={320} icone="🧬" cor={COR} texto={<>doença <b style={{ color: COR }}>genética</b>: passa de pais para filhos</>} />
      <Item f={f} at={T.hemoglobina} y={470} icone="🩸" cor={COR} texto={<>altera a <b style={{ color: COR }}>hemoglobina</b>, que leva o oxigênio</>} />
      <Tela>
        <Vaso f={f} y={880} foice={foice} o={P(f, T.hemacias - 20, T.hemacias)} />
      </Tela>
      <Pill x={540} y={1090} text="hemácias redondas e macias" color={VERDE} size={40} k={P(f, T.redondinhas, T.redondinhas + 12) * (1 - P(f, T.duras, T.duras + 10))} />
      <Pill x={540} y={1090} text="duras, em forma de FOICE" color={COR} size={44} k={P(f, T.foice, T.foice + 12)} />
      <Pill x={540} y={1250} text="foice → falci → FALCIFORME" color={AMAR} size={40} k={P(f, T.nome, T.nome + 12)} />
    </Part>
  );
};

// ---------- 3. herança ----------
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={60}>
      <Title f={f} at={R(2)[0] + 4} y={180} size={60} weight={600} from={COR}>
        Como se herda
      </Title>
      <Pessoa x={330} y={330} e="👨" genes={[true, false]} legenda="pai" k={P(f, T.pai, T.pai + 12)} />
      <Pessoa x={750} y={330} e="👩" genes={[true, false]} legenda="mãe" k={P(f, T.mae, T.mae + 12)} />
      <Tela>
        <g opacity={P(f, T.mae + 10, T.mae + 24)} stroke="#94a3b8" strokeWidth={5} fill="none">
          <path d="M 330 640 L 330 700 L 750 700 L 750 640" />
          <path d="M 540 700 L 540 760 M 300 760 L 780 760 M 300 760 L 300 800 M 780 760 L 780 800" />
        </g>
      </Tela>
      <Pessoa x={300} y={820} e="🧒" genes={[true, true]} legenda="gene do pai E da mãe: tem a doença" cor={COR} k={P(f, T.mae + 20, T.mae + 32)} />
      <Pessoa x={780} y={820} e="👧" genes={[true, false]} legenda="gene de um só: traço falciforme" cor={AMAR} k={P(f, T.traco - 10, T.traco + 2)} />
      <Pill x={540} y={1300} text="o traço não é doença, mas passa o gene" color={AMAR} size={38} k={P(f, T.traco + 30, T.traco + 42)} />
    </Part>
  );
};

// ---------- 4. números ----------
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={60}>
      <Title f={f} at={R(3)[0] + 4} y={180} size={60} weight={600} from={COR}>
        No Brasil
      </Title>
      <Numero f={f} at={T.mil} y={360} valor="~1.100" texto="bebês nascem com a doença por ano" />
      <Numero f={f} at={T.sessenta} y={760} valor="60 a 100 mil" texto="pessoas convivem com ela" />
      <Pill x={540} y={1300} text="mais comum na população negra" color={AMAR} size={40} k={P(f, T.negra - 20, T.negra - 8)} />
    </Part>
  );
};

// ---------- 5. perigos ----------
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const chips: [string, number][] = [
    ["infecções", T.infeccoes],
    ["AVC", T.avc],
    ["pulmão · baço", T.pulmao],
    ["rins · olhos", T.rins],
  ];
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={60}>
      <Title f={f} at={R(4)[0] + 4} y={170} size={60} weight={600} from={COR}>
        Os perigos
      </Title>
      <Tela>
        <Vaso f={f} y={420} foice={1} entope={it(f, T.entopem, T.entopem + 40, 0, 1, EASE)} />
      </Tela>
      <Item f={f} at={T.anemia} y={600} h={110} icone="😮‍💨" texto="anemia" />
      <Item f={f} at={T.amarelados} y={725} h={110} icone="👁️" texto="olhos e pele amarelados" />
      <Item f={f} at={T.dor} y={850} h={110} icone="⚡" texto="crises de dor muito fortes" />
      <Item f={f} at={T.maoPe} y={975} h={110} icone="✋" texto={<>bebês: <b style={{ color: COR }}>síndrome mão-pé</b> (inchaço e dor)</>} />
      <div style={{ position: "absolute", top: 1130, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#94a3b8", opacity: P(f, T.infeccoes - 20, T.infeccoes - 8) }}>
        complicações graves
      </div>
      <div style={{ position: "absolute", top: 1190, left: 40, width: 1000, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {chips.map(([t, at]) => (
          <span
            key={t}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 38,
              color: COR,
              padding: "12px 24px",
              borderRadius: 40,
              border: `2.5px solid ${COR}`,
              background: rgba(COR, 0.14),
              opacity: P(f, at, at + 10),
              transform: `scale(${0.7 + 0.3 * it(f, at, at + 12, 0, 1, SNAP)})`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </Part>
  );
};

// ---------- 6. sinais de alerta ----------
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={60}>
      <Title f={f} at={T.procure} y={170} size={58} weight={600} from={COR}>
        <span style={{ fontFamily: EMOJI }}>🚨</span> Emergência na hora
      </Title>
      <Item f={f} at={T.febre} y={320} h={115} icone="🌡️" texto={<b style={{ color: COR }}>febre</b>} />
      <Item f={f} at={T.falta} y={450} h={115} icone="🫁" texto="falta de ar ou dor no peito" />
      <Item f={f} at={T.palidez} y={580} h={115} icone="😶" texto="palidez forte com a barriga inchada" />
      <Item f={f} at={T.fraqueza} y={710} h={140} icone="🧠" texto="fraqueza de um lado, dificuldade para falar ou convulsão" />
      <Item f={f} at={T.erecao} y={865} h={115} icone="⚠️" texto="ereção dolorosa que não passa" />
      <Card
        f={f}
        at={T.crianca}
        x={60}
        y={1030}
        w={960}
        h={190}
        border={COR}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: rgba(COR, 0.18) }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 48, color: C.ink }}>
          <span style={{ fontFamily: EMOJI }}>👶</span> criança com febre = <span style={{ color: COR }}>URGÊNCIA</span>
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: "#cbd5e1", marginTop: 8 }}>infecção é a principal causa de morte</span>
      </Card>
    </Part>
  );
};

// ---------- 7. diagnóstico ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={60}>
      <Title f={f} at={R(6)[0] + 4} y={170} size={58} weight={600} from={VERDE}>
        Diagnóstico <b style={{ color: VERDE }}>precoce</b>
      </Title>
      <Card
        f={f}
        at={T.pezinho - 20}
        x={60}
        y={320}
        w={960}
        h={420}
        border={rgba(VERDE, 0.7)}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 130 }}>👣</span>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 58, color: C.ink }}>Teste do pezinho</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, color: VERDE, opacity: P(f, T.terceiro, T.terceiro + 10) }}>do 3º ao 5º dia de vida</span>
      </Card>
      <Card
        f={f}
        at={T.naoFez}
        x={60}
        y={800}
        w={960}
        h={300}
        border={rgba(AMAR, 0.7)}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px", gap: 10 }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: AMAR }}>Não fez o teste?</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, color: C.ink, opacity: P(f, T.eletroforese - 10, T.eletroforese) }}>🧪 eletroforese de hemoglobina</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: "#cbd5e1", opacity: P(f, T.quatro, T.quatro + 10) }}>a partir dos 4 meses de idade</span>
      </Card>
      <Pill x={540} y={1250} text="✅ de graça no SUS" color={VERDE} size={44} k={P(f, T.pezinho + 30, T.pezinho + 42)} />
    </Part>
  );
};

// ---------- 8 e 9. o que o SUS oferece ----------
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={60}>
      <Title f={f} at={T.integral} y={170} size={54} weight={600} from={AZUL}>
        Direito ao <b style={{ color: AZUL }}>cuidado integral</b> no SUS
      </Title>
      <div style={{ position: "absolute", top: 380, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#94a3b8", opacity: P(f, T.criancas, T.criancas + 10) }}>
        <span style={{ fontFamily: EMOJI }}>👶</span> para as crianças
      </div>
      <Item f={f} at={T.penicilina} y={450} icone="💊" cor={AZUL} h={140} texto={<><b style={{ color: AZUL }}>penicilina</b> para prevenir infecções, até os 5 anos</>} />
      <Item f={f} at={T.vacinas} y={615} icone="💉" cor={AZUL} texto={<><b style={{ color: AZUL }}>vacinas especiais</b> nos CRIEs</>} />
      <Item f={f} at={T.doppler} y={770} icone="🧠" cor={AZUL} h={140} texto={<><b style={{ color: AZUL }}>Doppler transcraniano</b>: mostra o risco de AVC</>} />
    </Part>
  );
};
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={60}>
      <Title f={f} at={R(8)[0] + 2} y={170} size={54} weight={600} from={AZUL}>
        Tratamentos no <b style={{ color: AZUL }}>SUS</b>
      </Title>
      <Card
        f={f}
        at={T.hidroxiureia}
        x={60}
        y={300}
        w={960}
        h={240}
        border={rgba(VERDE, 0.7)}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 36px", gap: 8 }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: VERDE }}>
          <span style={{ fontFamily: EMOJI }}>💊</span> hidroxiureia
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.ink }}>o principal remédio: menos crises de dor e internações</span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: AMAR, opacity: P(f, T.capsula, T.capsula + 10) }}>novo: cápsula de 100 mg, a partir dos 9 meses</span>
      </Card>
      <Item f={f} at={T.alfa} y={575} icone="🫘" cor={AZUL} texto={<><b style={{ color: AZUL }}>alfaepoetina</b>: problema nos rins + anemia</>} />
      <Item f={f} at={T.transfusoes} y={725} icone="🩸" cor={AZUL} h={150} texto={<><b style={{ color: AZUL }}>transfusões</b> + remédios que tiram o excesso de ferro</>} />
      <Card
        f={f}
        at={T.transplante}
        x={60}
        y={910}
        w={960}
        h={240}
        border={COR}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 36px", gap: 8, background: rgba(COR, 0.14) }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.ink }}>
          <span style={{ fontFamily: EMOJI }}>🧬</span> transplante de medula
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: COR }}>a única chance de cura</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#cbd5e1", opacity: P(f, T.transplante + 60, T.transplante + 72) }}>
          casos selecionados, com doador compatível da família
        </span>
      </Card>
    </Part>
  );
};

// ---------- 10. dia a dia ----------
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const dicas: [string, string, number][] = [
    ["💧", "beba bastante água", T.agua],
    ["🥶", "evite frio intenso", T.frio],
    ["🏃", "sem esforço exagerado", T.esforco],
    ["🏥", "acompanhamento no hemocentro", T.hemocentro],
  ];
  return (
    <Part from={R(9)[0]} to={R(9)[1]} inY={60}>
      <Title f={f} at={R(9)[0] + 4} y={200} size={60} weight={600} from={VERDE}>
        No dia a dia
      </Title>
      {dicas.map(([e, t, at], i) => (
        <Item key={t} f={f} at={at - 6} y={380 + i * 160} icone={e} cor={VERDE} texto={t} />
      ))}
    </Part>
  );
};

// ---------- 11. me siga ----------
const S11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(10)[0]} to={R(10)[1]} inY={100}>
      <Card
        f={f}
        at={T.siga}
        x={110}
        y={700}
        w={860}
        h={300}
        border={rgba(COR, 0.7)}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center", boxShadow: `0 0 34px ${rgba(COR, 0.25)}` }}
      >
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 78 }}>
          <span style={{ fontFamily: EMOJI }}>👩‍⚕️</span> Me siga
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34 }}>
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área
        </span>
      </Card>
    </Part>
  );
};

// ---------- 12. mensagem final ----------
const S12: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(11)[0]} to={R(11)[1]} inY={100} outDur={1}>
      {MENSAGEM_FINAL.map((l, i) => {
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
              color: i === 1 ? bornColor(f, at, COR, "#fef2f2", 20) : bornColor(f, at, C.ink, COR),
              textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none",
              opacity: k,
              transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, DURATION, 0, 1, (x) => x)})`,
              filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
            }}
          >
            {l}
          </div>
        );
      })}
    </Part>
  );
};

export const VideoFalciforme: React.FC = () => {
  const f = useCurrentFrame();
  const cor = f >= R(6)[0] && f < R(7)[0] ? VERDE : f >= R(7)[0] && f < R(9)[0] ? AZUL : f >= R(9)[0] && f < R(10)[0] ? VERDE : COR;
  return (
    <AbsoluteFill>
      <Background color={cor} pulses={[T.duras, T.entopem, T.febre, T.crianca, T.terceiro, T.hidroxiureia, T.transplante, T.final]} />
      <S1 />
      <S2 />
      <S3 />
      <S4 />
      <S5 />
      <S6 />
      <S7 />
      <S8 />
      <S9 />
      <S10 />
      <S11 />
      <S12 />
      <Grain />
      <Audio src={staticFile("falciforme/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio src={staticFile("falciforme/musica.wav")} volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): hemácia comum × em foice. Os 20% de baixo ficam livres (contador do TikTok).
export const CapaFalciforme: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <Pill x={540} y={190} text="🩸 27 de outubro" color={COR} size={40} k={1} />
    <div
      style={{
        position: "absolute",
        top: 270,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 100,
        lineHeight: 1.03,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      DOENÇA
      <br />
      <span style={{ color: COR }}>FALCIFORME</span>
    </div>
    <Tela>
      <Hemacia x={320} y={820} r={150} k={0} rot={-10} />
      <Hemacia x={770} y={800} r={150} k={1} rot={-15} />
      <text x={320} y={1030} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={C.ink}>
        comum
      </text>
      <text x={770} y={1030} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={COR}>
        em foice
      </text>
    </Tela>
    <div style={{ position: "absolute", top: 1130, width: W, display: "flex", justifyContent: "center", gap: 14 }}>
      {["⚠️ perigos", "🚨 sinais de alerta", "✅ o que o SUS oferece"].map((t) => (
        <span
          key={t}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: C.ink,
            padding: "12px 18px",
            borderRadius: 30,
            border: `2px solid ${rgba(COR, 0.7)}`,
            background: rgba(COR, 0.14),
          }}
        >
          {t}
        </span>
      ))}
    </div>
    <Grain />
  </AbsoluteFill>
);
