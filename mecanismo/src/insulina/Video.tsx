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

// "Onde guardar a insulina?" no modelo "aula elegante": a geladeira em corte mostra o lugar certo (meio/gaveta)
// e os errados (porta/congelador); depois a caneta em uso, o carro, a viagem e o aspecto.
// Narração gravada pela Larissa (ElevenLabs, Juliana). Tempos: audio/insulina_palavras.json (quadro = segundos × 30).
const COR = "#22d3ee"; // frio / insulina
const VERDE = "#4ade80",
  VERM = "#ef4444",
  AMAR = "#fbbf24",
  GELO = "#bae6fd";

// TEMPOS
const T = {
  porta0: 44,
  paraTudo: 85,
  fechada: 192,
  geladeira: 288,
  doisOito: 316,
  porta: 382,
  temperatura: 407,
  congelador: 502,
  congelar: 553,
  jogada: 622,
  lugarCerto: 649,
  prateleira: 682,
  gaveta: 724,
  emUso: 812,
  trinta: 919,
  sol: 975,
  vinteOito: 1033,
  algumas: 1111,
  bula: 1165,
  dica: 1200,
  data: 1262,
  prazo: 1358,
  carro: 1431,
  portaLuvas: 1449,
  solCarro: 1481,
  calor: 1505,
  viajar: 1561,
  bolsa: 1640,
  gelo: 1672,
  semEncostar: 1694,
  aviao: 1771,
  mao: 1803,
  porao: 1850,
  gelado: 1904,
  receita: 1955,
  aspecto: 2033,
  grumos: 2064,
  turva: 2099,
  naoUse: 2141,
  farmaceutico: 2181,
  siga: 2211,
  final: 2345,
};
export const DURATION = 2475; // 82,5 s (narração de 77,8 s + mensagem final)
const PARTES: [number, number][] = [
  [0, 178],
  [172, 366],
  [360, 771],
  [765, 1206],
  [1200, 1383],
  [1377, 1567],
  [1561, 1995],
  [1989, 2217],
  [2211, 2351],
  [2345, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const SFX: [number, string, number][] = [
  [T.porta0 + 10, "trava", 0.3],
  [R(1)[0], "whoosh", 0.3],
  [T.doisOito, "plim", 0.25],
  [R(2)[0], "whoosh", 0.3],
  [T.porta, "trava", 0.3],
  [T.congelador, "trava", 0.3],
  [T.prateleira, "plim", 0.25],
  [T.gaveta, "plim", 0.22],
  [R(3)[0], "whoosh", 0.3],
  [T.trinta, "pop", 0.22],
  [T.vinteOito, "pop", 0.22],
  [T.bula, "pop", 0.2],
  [R(4)[0], "whoosh", 0.3],
  [T.data, "pop", 0.22],
  [R(5)[0], "whoosh", 0.3],
  [T.carro, "trava", 0.3],
  [R(6)[0], "whoosh", 0.3],
  [T.bolsa, "pop", 0.22],
  [T.mao, "plim", 0.22],
  [T.porao, "trava", 0.3],
  [T.receita, "pop", 0.2],
  [R(7)[0], "whoosh", 0.3],
  [T.turva, "trava", 0.3],
  [R(8)[0], "whoosh", 0.3],
  [R(9)[0], "whoosh", 0.3],
  [T.final, "plim", 0.3],
];
const MENSAGEM_FINAL = [
  "Consulte um",
  "profissional de saúde",
  "para orientações.",
];

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={1920} style={{ position: "absolute" }}>
    {children}
  </svg>
);

// ---------- desenhos ----------
// caneta de insulina genérica (horizontal, centrada na origem, 260 de comprimento)
const Caneta: React.FC<{
  x: number;
  y: number;
  ang?: number;
  s?: number;
  o?: number;
  congelada?: number;
}> = ({ x, y, ang = 0, s = 1, o = 1, congelada = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang}) scale(${s})`} opacity={o}>
    <rect
      x={-130}
      y={-22}
      width={260}
      height={44}
      rx={20}
      fill="#e2e8f0"
      stroke="#94a3b8"
      strokeWidth={3}
    />
    <rect x={-130} y={-22} width={86} height={44} rx={20} fill={COR} />
    <rect x={-56} y={-22} width={14} height={44} fill={COR} />
    <rect
      x={0}
      y={-12}
      width={64}
      height={24}
      rx={8}
      fill="#e0f2fe"
      stroke="#7dd3fc"
      strokeWidth={2}
    />
    <rect
      x={8}
      y={-6}
      width={30}
      height={12}
      rx={4}
      fill="#fbbf24"
      opacity={0.85}
    />
    <rect x={130} y={-16} width={22} height={32} rx={6} fill="#64748b" />
    {congelada > 0 && (
      <g opacity={congelada}>
        <rect
          x={-140}
          y={-32}
          width={300}
          height={64}
          rx={24}
          fill={rgba(GELO, 0.55)}
          stroke="#ffffff"
          strokeWidth={3}
        />
        {[-100, -40, 30, 100].map((cx, i) => (
          <path
            key={i}
            d={`M ${cx} -18 l 0 36 M ${cx - 15} -9 l 30 18 M ${cx - 15} 9 l 30 -18`}
            stroke="#ffffff"
            strokeWidth={4}
          />
        ))}
      </g>
    )}
  </g>
);

// selo ✓ / ✕
const Marca: React.FC<{
  x: number;
  y: number;
  k: number;
  ok: boolean;
  r?: number;
}> = ({ x, y, k, ok, r = 46 }) => {
  if (k <= 0) return null;
  const sc = 0.4 + 0.6 * SNAP(Math.min(1, k));
  const cor = ok ? VERDE : VERM;
  return (
    <g
      transform={`translate(${x},${y}) scale(${sc})`}
      opacity={Math.min(1, k * 1.5)}
    >
      <circle r={r} fill={cor} stroke="#ffffff" strokeWidth={5} />
      {ok ? (
        <path
          d={`M ${-r * 0.45} 0 L ${-r * 0.12} ${r * 0.32} L ${r * 0.48} ${-r * 0.32}`}
          stroke="#ffffff"
          strokeWidth={r * 0.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d={`M ${-r * 0.36} ${-r * 0.36} L ${r * 0.36} ${r * 0.36} M ${r * 0.36} ${-r * 0.36} L ${-r * 0.36} ${r * 0.36}`}
          stroke="#ffffff"
          strokeWidth={r * 0.2}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// geladeira em corte, porta aberta à direita (coordenadas locais: corpo 520 × 1000)
type Marcas = {
  porta?: number;
  freezer?: number;
  meio?: number;
  gaveta?: number;
};
const Geladeira: React.FC<{
  x: number;
  y: number;
  s: number;
  canetaParaMeio?: number; // 0 = na porta, 1 = na prateleira do meio
  congelada?: number;
  marcas?: Marcas;
  brilho?: Marcas;
}> = ({
  x,
  y,
  s,
  canetaParaMeio = 0,
  congelada = 0,
  marcas = {},
  brilho = {},
}) => {
  const m = canetaParaMeio;
  const cx = 620 + (260 - 620) * m;
  const cy = 520 + (590 - 520) * m;
  const ang = 90 * (1 - m);
  const destaque = (y0: number, h: number, k = 0, cor = VERDE) =>
    k > 0 ? (
      <rect
        x={18}
        y={y0}
        width={484}
        height={h}
        rx={14}
        fill={rgba(cor, 0.22 * k)}
        stroke={rgba(cor, 0.9 * k)}
        strokeWidth={5}
      />
    ) : null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* corpo */}
      <rect x={0} y={0} width={520} height={1000} rx={34} fill="#cbd5e1" />
      <rect x={18} y={18} width={484} height={200} rx={16} fill="#e0f2fe" />
      <rect x={18} y={238} width={484} height={744} rx={16} fill="#f1f5f9" />
      {/* gelo no congelador */}
      {Array.from({ length: 9 }, (_, i) => {
        const px = 50 + i * 52;
        return (
          <path
            key={i}
            d={`M ${px} 40 l 0 30 M ${px - 12} 48 l 24 14 M ${px - 12} 62 l 24 -14`}
            stroke="#7dd3fc"
            strokeWidth={4}
            opacity={0.8}
          />
        );
      })}
      <rect x={18} y={196} width={484} height={22} fill="#bfdbfe" />
      {destaque(18, 200, brilho.freezer, VERM)}
      {/* prateleiras */}
      {destaque(450, 190, brilho.meio)}
      <rect x={18} y={440} width={484} height={12} fill="#94a3b8" />
      <rect x={18} y={640} width={484} height={12} fill="#94a3b8" />
      {/* gaveta */}
      <rect
        x={34}
        y={780}
        width={452}
        height={186}
        rx={18}
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth={4}
      />
      <rect x={200} y={800} width={120} height={16} rx={8} fill="#94a3b8" />
      {destaque(780, 186, brilho.gaveta)}
      {/* porta aberta */}
      <polygon
        points="520,0 720,50 720,950 520,1000"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth={4}
      />
      {[300, 600, 860].map((py, i) => (
        <polygon
          key={i}
          points={`530,${py} 710,${py - 10} 710,${py + 40} 530,${py + 54}`}
          fill="#cbd5e1"
          stroke="#94a3b8"
          strokeWidth={3}
        />
      ))}
      {brilho.porta ? (
        <polygon
          points="520,0 720,50 720,950 520,1000"
          fill={rgba(VERM, 0.2 * brilho.porta)}
          stroke={rgba(VERM, 0.9 * brilho.porta)}
          strokeWidth={6}
        />
      ) : null}
      {/* caneta no congelador (quando congela) */}
      {congelada > 0 && (
        <Caneta
          x={260}
          y={120}
          s={0.9}
          o={Math.min(1, congelada * 2)}
          congelada={congelada}
        />
      )}
      {/* a caneta */}
      <Caneta x={cx} y={cy} ang={ang} s={0.85} />
      <Marca x={620} y={250} k={marcas.porta ?? 0} ok={false} />
      <Marca x={430} y={110} k={marcas.freezer ?? 0} ok={false} />
      <Marca x={440} y={520} k={marcas.meio ?? 0} ok />
      <Marca x={430} y={880} k={marcas.gaveta ?? 0} ok />
    </g>
  );
};

// termômetro vertical de -5 a 35 °C
const Termometro: React.FC<{
  x: number;
  y0: number;
  y1: number;
  valor: number;
  faixa?: [number, number, number];
}> = ({ x, y0, y1, valor, faixa }) => {
  const yv = (v: number) => y1 - ((v + 5) / 40) * (y1 - y0);
  return (
    <g>
      <rect
        x={x - 40}
        y={y0 - 30}
        width={80}
        height={y1 - y0 + 60}
        rx={40}
        fill="#1e293b"
        stroke="#64748b"
        strokeWidth={5}
      />
      {faixa && faixa[2] > 0 && (
        <rect
          x={x - 70}
          y={yv(faixa[1])}
          width={140}
          height={yv(faixa[0]) - yv(faixa[1])}
          rx={10}
          fill={rgba(VERDE, 0.25 * faixa[2])}
          stroke={rgba(VERDE, faixa[2])}
          strokeWidth={4}
        />
      )}
      <rect
        x={x - 16}
        y={yv(valor)}
        width={32}
        height={y1 - yv(valor) + 40}
        rx={16}
        fill={COR}
      />
      <circle
        cx={x}
        cy={y1 + 60}
        r={62}
        fill={COR}
        stroke="#64748b"
        strokeWidth={5}
      />
      {[0, 10, 20, 30].map((v) => (
        <g key={v}>
          <line
            x1={x + 40}
            y1={yv(v)}
            x2={x + 62}
            y2={yv(v)}
            stroke="#94a3b8"
            strokeWidth={4}
          />
          <text
            x={x + 72}
            y={yv(v) + 10}
            fontFamily={SANS}
            fontWeight={700}
            fontSize={28}
            fill="#94a3b8"
          >
            {v}°
          </text>
        </g>
      ))}
    </g>
  );
};

// frasco-ampola de insulina (transparente ou turvo com grumos)
const Ampola: React.FC<{ x: number; y: number; turva: number }> = ({
  x,
  y,
  turva,
}) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-56} y={-210} width={112} height={50} rx={10} fill="#f97316" />
    <rect x={-40} y={-165} width={80} height={45} fill="#cbd5e1" />
    <rect
      x={-110}
      y={-125}
      width={220}
      height={330}
      rx={36}
      fill={rgba("#e0f2fe", 0.25)}
      stroke="#e0f2fe"
      strokeWidth={6}
    />
    <rect
      x={-100}
      y={-60}
      width={200}
      height={255}
      rx={30}
      fill={rgba("#e0f2fe", 0.35)}
    />
    {turva > 0 && (
      <g opacity={turva}>
        <rect
          x={-100}
          y={-60}
          width={200}
          height={255}
          rx={30}
          fill="#e2e8f0"
          opacity={0.8}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={i}
            cx={-70 + ((i * 47) % 140)}
            cy={-20 + ((i * 61) % 200)}
            r={8 + (i % 4) * 4}
            fill="#94a3b8"
          />
        ))}
      </g>
    )}
    <rect
      x={-85}
      y={-100}
      width={18}
      height={270}
      rx={9}
      fill="#ffffff"
      opacity={0.3}
    />
  </g>
);

const Item: React.FC<{
  f: number;
  at: number;
  y: number;
  icone: string;
  texto: React.ReactNode;
  cor?: string;
  h?: number;
}> = ({ f, at, y, icone, texto, cor = COR, h = 130 }) => (
  <Card
    f={f}
    at={at}
    x={60}
    y={y}
    w={960}
    h={h}
    border={rgba(cor, 0.6)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "0 32px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 56, flexShrink: 0 }}>
      {icone}
    </span>
    <span
      style={{
        fontSize: 38,
        fontWeight: 600,
        lineHeight: 1.25,
        color: bornColor(f, at, C.ink, cor),
      }}
    >
      {texto}
    </span>
  </Card>
);

// ---------- 1. gancho ----------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <div
        style={{
          position: "absolute",
          top: 170,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 70,
          lineHeight: 1.08,
          color: C.ink,
          opacity: it(f, 2, 14, 0, 1, OUT),
          textShadow: `0 0 30px ${rgba(COR, 0.45)}`,
        }}
      >
        VOCÊ GUARDA A <span style={{ color: COR }}>INSULINA</span>
        <br />
        NA PORTA DA GELADEIRA?
      </div>
      <Tela>
        <Geladeira
          x={250}
          y={480}
          s={0.78}
          marcas={{ porta: P(f, T.porta0 + 10, T.porta0 + 22) }}
          brilho={{ porta: P(f, T.porta0, T.porta0 + 12) }}
        />
      </Tela>
      <Pill
        x={540}
        y={1390}
        text="✋ então para tudo!"
        color={VERM}
        size={46}
        k={P(f, T.paraTudo, T.paraTudo + 12)}
      />
    </Part>
  );
};

// ---------- 2. fechada: geladeira, 2 a 8 °C ----------
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const valor = it(f, T.geladeira, T.doisOito + 10, 24, 5, EASE);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={60}>
      <Title f={f} at={T.fechada} y={190} size={60} weight={600} from={COR}>
        Insulina <b style={{ color: COR }}>fechada</b>
      </Title>
      <div
        style={{
          position: "absolute",
          top: 290,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 36,
          fontWeight: 600,
          color: "#94a3b8",
          opacity: P(f, T.fechada + 10, T.fechada + 24),
        }}
      >
        (a que você ainda não começou a usar)
      </div>
      <Tela>
        <g opacity={P(f, T.fechada, T.fechada + 14)}>
          <Termometro
            x={330}
            y0={520}
            y1={1300}
            valor={valor}
            faixa={[2, 8, P(f, T.doisOito, T.doisOito + 14)]}
          />
        </g>
      </Tela>
      <Pill
        x={760}
        y={720}
        text="❄️ na geladeira"
        color={COR}
        size={44}
        k={P(f, T.geladeira, T.geladeira + 12)}
      />
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 900,
          width: 480,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 110,
          color: VERDE,
          textShadow: `0 0 30px ${rgba(VERDE, 0.5)}`,
          opacity: P(f, T.doisOito, T.doisOito + 10),
          transform: `scale(${0.7 + 0.3 * it(f, T.doisOito, T.doisOito + 14, 0, 1, SNAP)})`,
        }}
      >
        2 a 8 °C
      </div>
    </Part>
  );
};

// ---------- 3. onde na geladeira ----------
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const fase =
    f >= T.lugarCerto ? 3 : f >= T.congelar ? 2 : f >= T.congelador ? 1 : 0;
  const textos: [string, string][] = [
    ["🚪 porta: a temperatura muda toda hora", VERM],
    ["🧊 nem encostada no congelador", VERM],
    ["congelou? perdeu o efeito: jogue fora 🗑️", VERM],
    ["✅ prateleira do meio ou gaveta de baixo", VERDE],
  ];
  const inicioFase = [T.porta, T.congelador, T.congelar, T.lugarCerto][fase];
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={60}>
      <Title f={f} at={R(2)[0] + 4} y={170} size={60} weight={600} from={COR}>
        Na geladeira, mas <b style={{ color: AMAR }}>onde?</b>
      </Title>
      <Tela>
        <Geladeira
          x={170}
          y={330}
          s={0.98}
          canetaParaMeio={it(f, T.lugarCerto, T.prateleira, 0, 1, EASE)}
          congelada={
            P(f, T.congelar, T.congelar + 16) *
            (1 - P(f, T.lugarCerto - 10, T.lugarCerto))
          }
          marcas={{
            porta: P(f, T.porta, T.porta + 12),
            freezer: P(f, T.congelador, T.congelador + 12),
            meio: P(f, T.prateleira, T.prateleira + 12),
            gaveta: P(f, T.gaveta, T.gaveta + 12),
          }}
          brilho={{
            porta:
              P(f, T.porta - 6, T.porta + 6) *
              (1 - 0.6 * P(f, T.congelador, T.congelador + 10)),
            freezer:
              P(f, T.congelador - 6, T.congelador + 6) *
              (1 - 0.6 * P(f, T.lugarCerto, T.lugarCerto + 10)),
            meio: P(f, T.prateleira - 6, T.prateleira + 6),
            gaveta: P(f, T.gaveta - 6, T.gaveta + 6),
          }}
        />
      </Tela>
      <Pill
        key={fase}
        x={540}
        y={1440}
        text={textos[fase][0]}
        color={textos[fase][1]}
        size={36}
        k={P(f, inicioFase, inicioFase + 12)}
      />
    </Part>
  );
};

// ---------- 4. em uso ----------
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.floor(it(f, T.vinteOito, T.vinteOito + 40, 0, 28, (x) => x));
  const extra = P(f, T.algumas, T.algumas + 14);
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={60}>
      <Title f={f} at={T.emUso - 30} y={170} size={58} weight={600} from={AMAR}>
        Em uso: <b style={{ color: AMAR }}>fora da geladeira</b>
      </Title>
      <Tela>
        <Caneta x={540} y={360} s={1.3} o={P(f, T.emUso - 30, T.emUso - 10)} />
      </Tela>
      <Item
        f={f}
        at={T.trinta}
        y={460}
        icone="🌡️"
        cor={AMAR}
        texto={
          <>
            temperatura ambiente, <b style={{ color: AMAR }}>até 30 °C</b>
          </>
        }
      />
      <Item
        f={f}
        at={T.sol}
        y={610}
        icone="🌤️"
        cor={AMAR}
        texto={
          <>
            lugar fresco, <b style={{ color: AMAR }}>longe do sol</b>
          </>
        }
      />
      {f >= T.vinteOito - 4 && (
        <div
          style={{
            position: "absolute",
            top: 790,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 44,
            color: C.ink,
            opacity: P(f, T.vinteOito - 4, T.vinteOito + 8),
          }}
        >
          a maioria dura{" "}
          <span style={{ color: COR }}>{Math.max(1, n)} dias</span> depois de
          aberta
        </div>
      )}
      <Tela>
        {Array.from({ length: 28 }, (_, i) => {
          const col = i % 7,
            row = Math.floor(i / 7);
          const on = i < n;
          return (
            <g key={i} opacity={P(f, T.vinteOito - 4, T.vinteOito + 8)}>
              <rect
                x={113 + col * 124}
                y={870 + row * 112}
                width={106}
                height={96}
                rx={14}
                fill={on ? rgba(COR, 0.3) : "rgba(255,255,255,0.05)"}
                stroke={on ? COR : "#475569"}
                strokeWidth={3}
              />
              <text
                x={113 + col * 124 + 53}
                y={870 + row * 112 + 60}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={700}
                fontSize={34}
                fill={on ? C.ink : "#64748b"}
              >
                {i + 1}
              </text>
            </g>
          );
        })}
        {extra > 0 &&
          [0, 1, 2].map((i) => (
            <g key={i} opacity={extra}>
              <rect
                x={113 + i * 124}
                y={870 + 4 * 112}
                width={106}
                height={96}
                rx={14}
                fill="none"
                stroke={AMAR}
                strokeWidth={3}
                strokeDasharray="10 8"
              />
              <text
                x={113 + i * 124 + 53}
                y={870 + 4 * 112 + 60}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={800}
                fontSize={34}
                fill={AMAR}
              >
                +
              </text>
            </g>
          ))}
      </Tela>
      <Pill
        x={760}
        y={1366}
        text="algumas duram mais"
        color={AMAR}
        size={32}
        k={extra}
      />
      <Pill
        x={540}
        y={1520}
        text="📄 confira na bula"
        color={COR}
        size={42}
        k={P(f, T.bula, T.bula + 12)}
      />
    </Part>
  );
};

// ---------- 5. dica: anote a data ----------
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const escrito = "aberta em: 20/10";
  const n = Math.floor(it(f, T.data, T.data + 34, 0, escrito.length, (x) => x));
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={60}>
      <Title f={f} at={T.dica} y={220} size={68} weight={600} from={AMAR}>
        <span style={{ fontFamily: EMOJI }}>💡</span> Dica
      </Title>
      <div
        style={{
          position: "absolute",
          top: 350,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 42,
          color: C.ink,
          opacity: P(f, T.dica + 8, T.dica + 20),
        }}
      >
        anote a <span style={{ color: AMAR }}>data em que abriu</span>
      </div>
      <Tela>
        <Caneta x={540} y={760} s={2.6} o={P(f, T.dica, T.dica + 14)} />
        {/* etiqueta */}
        <g opacity={P(f, T.data - 14, T.data)} transform="rotate(-4,540,980)">
          <rect
            x={220}
            y={910}
            width={640}
            height={130}
            rx={18}
            fill="#fef9c3"
            stroke={AMAR}
            strokeWidth={5}
          />
          <text
            x={260}
            y={995}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={58}
            fill="#1e293b"
          >
            {escrito.slice(0, n)}
            {n < escrito.length && f % 16 < 8 ? "|" : ""}
          </text>
        </g>
      </Tela>
      <Pill
        x={540}
        y={1240}
        text="assim você não se perde no prazo"
        color={VERDE}
        size={38}
        k={P(f, T.prazo, T.prazo + 12)}
      />
    </Part>
  );
};

// ---------- 6. carro ----------
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const sol = P(f, T.solCarro, T.solCarro + 14);
  const calor = P(f, T.calor, T.calor + 14);
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={60}>
      <Title f={f} at={R(5)[0] + 6} y={190} size={62} weight={600} from={VERM}>
        <b style={{ color: VERM }}>Nunca</b> no carro
      </Title>
      <Tela>
        {/* sol */}
        <g opacity={sol} transform={`translate(840,470) rotate(${f * 0.6})`}>
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1={0}
              y1={-95}
              x2={0}
              y2={-130}
              stroke={AMAR}
              strokeWidth={10}
              strokeLinecap="round"
              transform={`rotate(${i * 30})`}
            />
          ))}
          <circle r={78} fill={AMAR} />
        </g>
        {/* carro */}
        <g
          opacity={P(f, R(5)[0] + 4, R(5)[0] + 18)}
          transform="translate(0,40)"
        >
          <path
            d="M 150 900 L 230 760 Q 250 730 290 730 L 690 730 Q 730 730 760 760 L 850 860 L 930 880 Q 960 890 960 930 L 960 1000 L 120 1000 L 120 940 Q 120 905 150 900 Z"
            fill="#475569"
            stroke="#94a3b8"
            strokeWidth={5}
          />
          <path
            d="M 260 880 L 310 780 L 500 780 L 500 880 Z"
            fill="#7dd3fc"
            opacity={0.6}
          />
          <path
            d="M 530 880 L 530 780 L 700 780 L 790 880 Z"
            fill="#7dd3fc"
            opacity={0.6}
          />
          <circle
            cx={290}
            cy={1000}
            r={64}
            fill="#1e293b"
            stroke="#94a3b8"
            strokeWidth={6}
          />
          <circle
            cx={790}
            cy={1000}
            r={64}
            fill="#1e293b"
            stroke="#94a3b8"
            strokeWidth={6}
          />
          <Caneta x={620} y={850} s={0.55} />
          {/* calor */}
          {calor > 0 &&
            [0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M ${330 + i * 130} ${690 - ((f * 2 + i * 15) % 40)} q 18 -25 0 -50 q -18 -25 0 -50`}
                stroke={VERM}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
                opacity={calor * 0.85}
              />
            ))}
        </g>
        <Marca
          x={420}
          y={640}
          r={70}
          k={P(f, T.carro, T.carro + 12)}
          ok={false}
        />
      </Tela>
      <div
        style={{
          position: "absolute",
          top: 1170,
          width: W,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {(
          [
            ["🚗 carro", T.carro],
            ["🧤 porta-luvas", T.portaLuvas],
            ["☀️ sol", T.solCarro],
          ] as [string, number][]
        ).map(([t, at]) => (
          <span
            key={t}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 38,
              color: VERM,
              padding: "14px 24px",
              borderRadius: 40,
              border: `2.5px solid ${VERM}`,
              background: rgba(VERM, 0.14),
              opacity: P(f, at, at + 10),
              transform: `scale(${0.7 + 0.3 * it(f, at, at + 12, 0, 1, SNAP)})`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <Pill
        x={540}
        y={1370}
        text="🔥 o calor estraga a insulina"
        color={AMAR}
        size={42}
        k={calor}
      />
    </Part>
  );
};

// ---------- 7. viagem ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const bolsa = P(f, T.bolsa - 10, T.bolsa + 6);
  const gelo = P(f, T.gelo, T.gelo + 12);
  const pano = P(f, T.semEncostar, T.semEncostar + 12);
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={60}>
      <Title f={f} at={T.viajar} y={170} size={62} weight={600} from={COR}>
        Vai viajar? <span style={{ fontFamily: EMOJI }}>✈️</span>
      </Title>
      <Tela>
        <g opacity={bolsa} transform={`translate(0,${(1 - bolsa) * 40})`}>
          {/* alça */}
          <path
            d="M 400 380 Q 400 310 540 310 Q 680 310 680 380"
            stroke="#64748b"
            strokeWidth={22}
            fill="none"
          />
          {/* bolsa térmica */}
          <rect
            x={200}
            y={370}
            width={680}
            height={420}
            rx={46}
            fill="#334155"
            stroke="#64748b"
            strokeWidth={6}
          />
          <rect
            x={232}
            y={402}
            width={616}
            height={356}
            rx={30}
            fill="#cbd5e1"
            opacity={0.25}
          />
          <line
            x1={210}
            y1={400}
            x2={870}
            y2={400}
            stroke="#94a3b8"
            strokeWidth={6}
            strokeDasharray="14 10"
          />
          {/* gelo em gel */}
          <g opacity={gelo}>
            {[262, 728].map((gx) => (
              <g key={gx}>
                <rect
                  x={gx}
                  y={440}
                  width={90}
                  height={280}
                  rx={22}
                  fill={rgba(COR, 0.7)}
                  stroke="#e0f2fe"
                  strokeWidth={4}
                />
                <path
                  d={`M ${gx + 45} 540 l 0 60 M ${gx + 20} 555 l 50 30 M ${gx + 20} 585 l 50 -30`}
                  stroke="#ffffff"
                  strokeWidth={5}
                />
              </g>
            ))}
          </g>
          {/* pano separando */}
          <rect
            x={380}
            y={500}
            width={320}
            height={160}
            rx={24}
            fill="none"
            stroke={AMAR}
            strokeWidth={5}
            strokeDasharray="12 10"
            opacity={pano}
          />
          <Caneta x={540} y={580} s={0.95} />
        </g>
      </Tela>
      <Pill
        x={540}
        y={880}
        text="❄️ gelo em gel, sem encostar na insulina"
        color={COR}
        size={34}
        k={pano}
      />
      {f >= T.aviao - 4 && f < T.mao && (
        <div
          style={{
            position: "absolute",
            top: 1080,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 48,
            color: C.ink,
            opacity: P(f, T.aviao - 4, T.aviao + 8),
          }}
        >
          e no avião?
        </div>
      )}
      <Card
        f={f}
        at={T.mao}
        x={60}
        y={990}
        w={470}
        h={260}
        border={rgba(VERDE, 0.8)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 80 }}>🎒</span>
        <span style={{ fontSize: 38, fontWeight: 800, color: VERDE }}>
          bagagem de mão ✓
        </span>
      </Card>
      <Card
        f={f}
        at={T.porao}
        x={550}
        y={990}
        w={470}
        h={260}
        border={rgba(VERM, 0.8)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 80 }}>🧳</span>
        <span style={{ fontSize: 38, fontWeight: 800, color: VERM }}>
          porão ✕
        </span>
        <span
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#94a3b8",
            opacity: P(f, T.gelado, T.gelado + 12),
          }}
        >
          pode gelar demais
        </span>
      </Card>
      <Pill
        x={540}
        y={1380}
        text="📝 leve a receita junto"
        color={AMAR}
        size={42}
        k={P(f, T.receita, T.receita + 12)}
      />
    </Part>
  );
};

// ---------- 8. aspecto ----------
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={60}>
      <Title f={f} at={R(7)[0] + 4} y={170} size={58} weight={600} from={AMAR}>
        Mudou de <b style={{ color: AMAR }}>aspecto?</b>
      </Title>
      <Tela>
        <g opacity={P(f, T.aspecto - 20, T.aspecto)}>
          <Ampola x={300} y={720} turva={0} />
          <text
            x={300}
            y={1010}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={36}
            fill={VERDE}
          >
            transparente
          </text>
          <Marca x={300} y={470} k={P(f, T.aspecto, T.aspecto + 12)} ok />
        </g>
        <g opacity={P(f, T.grumos - 16, T.grumos)}>
          <Ampola x={780} y={720} turva={P(f, T.grumos, T.turva + 10)} />
          <text
            x={780}
            y={1010}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={36}
            fill={VERM}
          >
            turva / com grumos
          </text>
          <Marca x={780} y={470} k={P(f, T.turva, T.turva + 12)} ok={false} />
        </g>
      </Tela>
      <Pill
        x={540}
        y={1170}
        text="🚫 não use"
        color={VERM}
        size={52}
        k={P(f, T.naoUse, T.naoUse + 12)}
      />
      <Pill
        x={540}
        y={1320}
        text="👩‍⚕️ fale com o farmacêutico"
        color={VERDE}
        size={42}
        k={P(f, T.farmaceutico, T.farmaceutico + 12)}
      />
    </Part>
  );
};

// ---------- 9. me siga ----------
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(8)[0]} to={R(8)[1]} inY={100}>
      <Card
        f={f}
        at={T.siga}
        x={110}
        y={700}
        w={860}
        h={300}
        border={rgba(COR, 0.7)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          textAlign: "center",
          boxShadow: `0 0 34px ${rgba(COR, 0.25)}`,
        }}
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

// ---------- 10. mensagem final ----------
const S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(9)[0]} to={R(9)[1]} inY={100} outDur={1}>
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
              color:
                i === 1
                  ? bornColor(f, at, COR, "#ecfeff", 20)
                  : bornColor(f, at, C.ink, COR),
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

export const VideoInsulina: React.FC = () => {
  const f = useCurrentFrame();
  const cor =
    f >= R(3)[0] && f < R(5)[0]
      ? AMAR
      : f >= R(5)[0] && f < R(6)[0]
        ? VERM
        : COR;
  return (
    <AbsoluteFill>
      <Background
        color={cor}
        pulses={[
          T.porta0 + 10,
          T.doisOito,
          T.porta,
          T.prateleira,
          T.carro,
          T.turva,
          T.final,
        ]}
      />
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
      <Grain />
      <Audio src={staticFile("insulina/narracao.mp3")} />
      {/* trilha calma (scripts/musica_calma.py), bem baixa embaixo da voz */}
      <Audio
        src={staticFile("insulina/musica.wav")}
        volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): a geladeira com ✕ na porta/congelador e ✓ no meio/gaveta. Os 20% de baixo ficam livres (contador do TikTok).
export const CapaInsulina: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 130,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.05,
        color: C.ink,
        textShadow: `0 0 40px ${rgba(COR, 0.5)}`,
      }}
    >
      ONDE GUARDAR A
      <br />
      <span style={{ color: COR }}>INSULINA?</span>
    </div>
    <Tela>
      <Geladeira
        x={280}
        y={400}
        s={0.84}
        canetaParaMeio={1}
        marcas={{ porta: 1, freezer: 1, meio: 1, gaveta: 1 }}
        brilho={{ meio: 1 }}
      />
    </Tela>
    <div
      style={{
        position: "absolute",
        top: 1300,
        width: W,
        display: "flex",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {["🚪 porta ✕", "🧊 congelador ✕", "✅ meio"].map((t) => (
        <span
          key={t}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            color: C.ink,
            padding: "12px 20px",
            borderRadius: 30,
            border: `2px solid ${rgba(COR, 0.7)}`,
            background: rgba(COR, 0.14),
          }}
        >
          {t}
        </span>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        top: 1410,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 38,
        color: AMAR,
      }}
    >
      + em uso, no carro e na viagem
    </div>
    <Grain />
  </AbsoluteFill>
);
