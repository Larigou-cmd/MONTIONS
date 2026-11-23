import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { SERIF, SANS, MAO } from "../fonts";
import {
  PAPEL,
  KRAFT,
  TINTA,
  AZUL,
  VERMELHO,
  LARANJA,
  emDois,
  estalo,
  linear,
  rasgado,
  adesivo,
  Kicker,
  Titulo,
  Legenda,
  Rodape,
  TiraRasgada,
  Carimbo,
  NotaMao,
  Cena,
} from "../voxNvidia/Completo";
import { NotaDolar, MoedaReal, ZagueiroBC, Campo, Placar } from "./Personagens";

// "O dólar vai pro ataque" — @historicodebusca. Partida animada em colagem de papel,
// narrada pelo Nassif como locutor de futebol. Personagens originais. Fatos de 19/11/2026.
// Tempos medidos nas pausas da narração (+0,3 s).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const passo = (f: number) => (emDois(f) / 14) % 1; // ciclo das passadas

// campo recortado ocupando o meio da tela
const Gramado: React.FC<{ y?: number }> = ({ y = 640 }) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      top: y,
      filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
      clipPath: rasgado(131, 30, 0.8),
    }}
  >
    <Campo w={960} h={620} />
  </div>
);

// ===== cena 1: a busca =====
const C1Busca: React.FC = () => {
  const frame = useCurrentFrame();
  const termo = "por que o dólar não para de subir";
  const n = Math.floor(
    interpolate(emDois(frame), [82, 128], [0, termo.length], clamp),
  );
  const barra = estalo(frame, 4, 8);
  return (
    <Cena>
      <Kicker texto="NO MEU HISTÓRICO DE BUSCA DE HOJE" />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 520,
          transform: `rotate(-1.5deg) scale(${barra})`,
          background: "#fff",
          border: `6px solid ${TINTA}`,
          borderRadius: 60,
          boxShadow: `10px 10px 0 ${TINTA}`,
          padding: "26px 34px",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 46,
          color: TINTA,
          minHeight: 70,
        }}
      >
        🔍 {termo.slice(0, n)}
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>|</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 760,
          transform: `rotate(-8deg) scale(${estalo(frame, 30, 8)})`,
          filter: adesivo(AZUL, 7),
        }}
      >
        <NotaDolar tam={330} fase={passo(frame)} />
      </div>
      <NotaMao x={90} y={1180} ini={100} tam={54} rot={-5}>
        ele não para quieto →
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 82,
            a: "No meu ",
            k: "histórico de busca",
            b: " de hoje:",
          },
          {
            de: 82,
            ate: 145,
            a: "por que o dólar ",
            k: "não para de subir",
            b: "?",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 2: começa a partida =====
const C2Pontape: React.FC = () => {
  const frame = useCurrentFrame();
  const corre = interpolate(emDois(frame), [60, 140], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <Cena>
      <Kicker texto="TRANSMISSÃO AO VIVO · NOVEMBRO 2026" />
      <Titulo antes="Começa a " marca="partida!" marcaIni={60} tam={100} />
      <Gramado />
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 560,
          transform: `scale(${estalo(frame, 6, 8)})`,
          transformOrigin: "left center",
        }}
      >
        <Placar real={0} dolar={0} />
      </div>
      <div style={{ position: "absolute", left: 850, top: 860 }}>
        <MoedaReal tam={150} cansada={false} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 140 + corre * 470,
          top: 850 - corre * 40,
          transform: "rotate(-4deg)",
        }}
      >
        <NotaDolar tam={250} fase={passo(frame)} />
      </div>
      <NotaMao x={90} y={1290} ini={10} tam={50} rot={-4}>
        piiiii!
      </NotaMao>
      <Legenda
        falas={[
          { de: 0, ate: 52, a: "Então ", k: "vamos narrar", b: "!" },
          {
            de: 52,
            ate: 142,
            a: "Começa a partida, e o dólar ",
            k: "parte pro ataque",
            b: "!",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 3: seis jogos seguidos =====
const C3Seis: React.FC = () => {
  const frame = useCurrentFrame();
  const gols = Math.min(
    6,
    Math.floor(interpolate(emDois(frame), [6, 60], [0, 6.99], clamp)),
  );
  const linha = linear(frame, 60, 40);
  const pts = [
    [120, 1260],
    [260, 1215],
    [400, 1180],
    [540, 1120],
    [680, 1080],
    [820, 1020],
    [950, 940],
  ];
  const ate = 1 + Math.floor(linha * (pts.length - 1));
  return (
    <Cena>
      <Kicker texto="O PLACAR" />
      <Titulo
        antes="Seis jogos "
        marca="subindo"
        depois="!"
        marcaIni={20}
        tam={96}
      />
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 560,
          transform: `rotate(-2deg) scale(${estalo(frame, 2, 8)})`,
        }}
      >
        <Placar real={0} dolar={gols} />
      </div>
      {/* gráfico desenhado à mão */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <polyline
          points={pts
            .slice(0, ate)
            .map((p) => p.join(","))
            .join(" ")}
          fill="none"
          stroke={VERMELHO}
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.slice(0, ate).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={11} fill={TINTA} />
        ))}
      </svg>
      {linha > 0.95 ? (
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 780,
            transform: `rotate(-6deg) scale(${estalo(frame, 100, 8)})`,
            filter: adesivo(LARANJA, 6),
          }}
        >
          <div
            style={{
              background: "#f8f4ea",
              clipPath: rasgado(141, 12, 2),
              padding: "14px 26px",
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 84,
              color: TINTA,
            }}
          >
            R$ 5,93
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 830,
          top: 860,
          transform: "rotate(8deg)",
        }}
      >
        <NotaDolar tam={170} fase={passo(frame)} />
      </div>
      <Carimbo
        texto="MAIOR DESDE ABR/2025"
        x={110}
        y={1300}
        ini={155}
        rot={-8}
        tam={42}
      />
      <Legenda
        falas={[
          { de: 0, ate: 66, a: "Seis jogos seguidos ", k: "subindo", b: "!" },
          {
            de: 66,
            ate: 155,
            a: "Fechou a quinta-feira perto de ",
            k: "R$ 5,93",
            b: ",",
          },
          {
            de: 155,
            ate: 242,
            a: "o maior placar desde ",
            k: "abril do ano passado",
            b: "!",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 4: quem comanda o ataque =====
const Camisa: React.FC<{ numero: string; nome: string }> = ({
  numero,
  nome,
}) => (
  <svg viewBox="0 0 240 240" width={300} height={300}>
    <path
      d="M70 30 L100 20 Q120 40 140 20 L170 30 L220 70 L196 110 L176 98 L176 226 L64 226 L64 98 L44 110 L20 70 Z"
      fill={VERMELHO}
      stroke={TINTA}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <text
      x={120}
      y={150}
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={70}
      fill="#fff"
      stroke={TINTA}
      strokeWidth={3}
    >
      {numero}
    </text>
    <text
      x={120}
      y={198}
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={17}
      fill="#fff"
    >
      {nome}
    </text>
  </svg>
);

const Balaozinho: React.FC<{
  x: number;
  y: number;
  ini: number;
  texto: string;
  rot: number;
}> = ({ x, y, ini, texto, rot }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${estalo(frame, ini, 6)})`,
        background: "#fff",
        border: `5px solid ${TINTA}`,
        borderRadius: 30,
        padding: "10px 24px",
        fontFamily: MAO,
        fontWeight: 700,
        fontSize: 46,
        color: TINTA,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

const C4Ataque: React.FC = () => {
  const frame = useCurrentFrame();
  const doc = estalo(frame, 112, 8);
  return (
    <Cena>
      <Kicker texto="O CAMISA 10" />
      <Titulo antes="Quem comanda o " marca="ataque?" marcaIni={10} tam={92} />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 600,
          transform: `rotate(-6deg) scale(${estalo(frame, 46, 8)})`,
          filter: adesivo(LARANJA, 7),
        }}
      >
        <div
          style={{
            background: "#f8f4ea",
            clipPath: rasgado(151, 12, 2),
            padding: 12,
          }}
        >
          <Camisa numero="10" nome="MEDO FISCAL" />
        </div>
      </div>
      <NotaMao x={470} y={660} ini={60} tam={44} rot={-4}>
        medo com as contas
        <br />
        do governo
      </NotaMao>
      <div
        style={{
          position: "absolute",
          left: 470,
          top: 860,
          transform: `rotate(3deg) scale(${doc})`,
          filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
        }}
      >
        <div
          style={{
            width: 460,
            padding: "26px 32px 30px",
            background: "#f8f4ea",
            clipPath: rasgado(161, 18, 1.2),
            fontFamily:
              "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
            color: TINTA,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 26 }}>SENADO FEDERAL</div>
          <div style={{ fontWeight: 800, fontSize: 30, marginTop: 6 }}>
            PLP 299/2026
          </div>
          <div style={{ fontSize: 24, marginTop: 12 }}>
            Ajuste fiscal para 2027
          </div>
          <div style={{ fontSize: 24 }}>Votação concluída: 18/11</div>
        </div>
      </div>
      <Carimbo
        texto="APROVADO"
        x={560}
        y={1060}
        ini={112}
        rot={-8}
        tam={54}
        cor={AZUL}
      />
      <Balaozinho x={70} y={1120} ini={172} texto="uuuuh!" rot={-6} />
      <Balaozinho x={300} y={1230} ini={180} texto="não convenceu…" rot={4} />
      <Legenda
        falas={[
          { de: 0, ate: 46, a: "Quem comanda esse ", k: "ataque", b: "?" },
          {
            de: 46,
            ate: 112,
            a: "O ",
            k: "medo com as contas do governo",
            b: "!",
          },
          {
            de: 112,
            ate: 172,
            a: "O Senado ",
            k: "aprovou o ajuste fiscal",
            b: "…",
          },
          {
            de: 172,
            ate: 244,
            a: "mas a torcida do mercado ",
            k: "não acreditou",
            b: "!",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 5: reforço de fora =====
const C5Reforco: React.FC = () => {
  const frame = useCurrentFrame();
  const placa = estalo(frame, 6, 8);
  const notas = Array.from({ length: 6 }, (_, i) => {
    const t = interpolate(
      emDois(frame),
      [60 + i * 10, 120 + i * 10],
      [0, 1],
      clamp,
    );
    return {
      x: 120 + t * 900,
      y: 1000 + i * 34 - Math.sin(t * Math.PI) * 120,
      o: t > 0 && t < 1 ? 1 : 0,
    };
  });
  return (
    <Cena>
      <Kicker texto="SUBSTITUIÇÃO" />
      <Titulo
        antes="Reforço "
        marca="lá de fora"
        depois="!"
        marcaIni={30}
        tam={92}
      />
      {/* placa de substituição */}
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 600,
          transform: `rotate(-3deg) scale(${placa})`,
        }}
      >
        <div
          style={{
            width: 700,
            background: TINTA,
            borderRadius: 18,
            padding: "20px 26px",
            boxShadow: `10px 10px 0 ${LARANJA}`,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 30,
              letterSpacing: "0.14em",
              color: "#7ee08a",
            }}
          >
            ▲ ENTRA
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 64,
              color: "#efe9dc",
              lineHeight: 1.05,
            }}
          >
            JUROS DOS EUA
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 28,
              color: "#e9b3ad",
              marginTop: 6,
            }}
          >
            altos por mais tempo
          </div>
        </div>
      </div>
      {/* dinheiro voando para fora */}
      {notas.map((nt, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: nt.x,
            top: nt.y,
            opacity: nt.o,
            transform: `rotate(${i * 20}deg)`,
          }}
        >
          <svg viewBox="0 0 80 44" width={110} height={60}>
            <rect
              x={2}
              y={2}
              width={76}
              height={40}
              rx={5}
              fill="#5fa86b"
              stroke={TINTA}
              strokeWidth={4}
            />
            <text
              x={40}
              y={31}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight={900}
              fontSize={24}
              fill="#2f6b3d"
            >
              $
            </text>
          </svg>
        </div>
      ))}
      <NotaMao x={650} y={1260} ini={80} tam={50} rot={-6}>
        → pros EUA
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 155,
            a: "E lá de fora vem reforço: ",
            k: "juros altos nos Estados Unidos",
            b: ", puxando o dinheiro pra lá!",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 6: o carrinho do Banco Central =====
const C6Carrinho: React.FC = () => {
  const frame = useCurrentFrame();
  const f = emDois(frame);
  // dólar avança, cai no carrinho (156) e levanta (222)
  const xDolar = interpolate(
    f,
    [0, 150, 222, 274],
    [120, 480, 500, 900],
    clamp,
  );
  const queda = interpolate(f, [150, 160, 222, 230], [0, 1, 1, 0], clamp);
  const pulo =
    f >= 222 ? Math.max(0, Math.sin(((f - 222) / 30) * Math.PI)) * 140 : 0;
  const xBC = interpolate(f, [32, 140, 160], [1000, 640, 560], clamp);
  const carrinho = interpolate(f, [120, 150], [0, 1], clamp);
  const bcCaido = f >= 222;
  return (
    <Cena>
      <Kicker texto="LANCE POLÊMICO" />
      <Titulo antes="Entra o " marca="Banco Central!" marcaIni={32} tam={84} />
      <Gramado />
      <div
        style={{
          position: "absolute",
          left: xBC,
          top: 870,
          opacity: f >= 32 ? 1 : 0,
          transform: bcCaido ? "rotate(-10deg)" : undefined,
        }}
      >
        <ZagueiroBC tam={260} carrinho={carrinho} />
      </div>
      <div
        style={{
          position: "absolute",
          left: xDolar,
          top: 850 + queda * 90 - pulo,
          transform: `rotate(${queda * 70 - (pulo > 0 ? 8 : 0)}deg)`,
        }}
      >
        <NotaDolar tam={230} fase={passo(frame)} feliz={queda < 0.5} />
      </div>
      {f >= 156 && f < 222 ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 560,
            transform: `rotate(-4deg) scale(${estalo(frame, 156, 6)})`,
            filter: adesivo(AZUL, 6),
          }}
        >
          <div
            style={{
              background: "#f8f4ea",
              clipPath: rasgado(171, 12, 2),
              padding: "10px 24px",
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 70,
              color: TINTA,
            }}
          >
            caiu pra R$ 5,85…
          </div>
        </div>
      ) : null}
      {f >= 222 ? (
        <TiraRasgada
          texto="MAS LEVANTA!"
          x={110}
          y={560}
          ini={222}
          rot={-4}
          tam={74}
          fundo={VERMELHO}
          cor="#fff"
        />
      ) : null}
      <Legenda
        falas={[
          { de: 0, ate: 32, a: "", k: "Atenção", b: "!" },
          {
            de: 32,
            ate: 156,
            a: "Entra o Banco Central! Vem de carrinho com ",
            k: "um bilhão de dólares",
            b: "…",
          },
          { de: 156, ate: 222, a: "o dólar cai pra ", k: "R$ 5,85", b: "…" },
          { de: 222, ate: 252, a: "", k: "MAS LEVANTA", b: "!" },
          { de: 252, ate: 274, a: "E ", k: "segue", b: "!" },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 7: placar final =====
const C7Placar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Cena>
      <Kicker texto="PLACAR DE NOVEMBRO" />
      <Carimbo
        texto="+9% EM NOVEMBRO"
        x={110}
        y={420}
        ini={6}
        rot={-6}
        tam={66}
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 640,
          transform: `rotate(-2deg) scale(${1.25 * estalo(frame, 76, 10)})`,
          transformOrigin: "left top",
        }}
      >
        <Placar real={0} dolar={6} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 860,
          transform: `scale(${estalo(frame, 20, 8)})`,
        }}
      >
        <MoedaReal tam={260} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 840,
          transform: `rotate(6deg) scale(${estalo(frame, 30, 8)})`,
        }}
      >
        <NotaDolar tam={300} fase={passo(frame)} />
      </div>
      <NotaMao x={130} y={1180} ini={90} tam={46} rot={-5}>
        o real tá cansado…
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 80,
            a: "Só em novembro, ",
            k: "mais de nove por cento",
            b: "!",
          },
          { de: 80, ate: 141, a: "", k: "Real zero, dólar seis", b: "!" },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 8: final =====
const Ingresso: React.FC<{
  x: number;
  y: number;
  ini: number;
  texto: string;
  cor: string;
  rot: number;
  semente: number;
}> = ({ x, y, ini, texto, cor, rot, semente }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${estalo(frame, ini, 8)})`,
        filter: adesivo(cor, 7),
      }}
    >
      <div
        style={{
          padding: "44px 40px",
          clipPath: rasgado(semente, 18, 1.4),
          background: "#f8f4ea",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 92,
          color: TINTA,
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const C8Final: React.FC = () => (
  <Cena>
    <Kicker texto="E VOCÊ?" />
    <Titulo antes="O real " marca="vira o jogo?" marcaIni={14} tam={96} />
    <Ingresso
      x={70}
      y={700}
      ini={8}
      texto="VIRA"
      cor={AZUL}
      rot={-6}
      semente={181}
    />
    <Ingresso
      x={500}
      y={800}
      ini={14}
      texto="NÃO VIRA"
      cor={LARANJA}
      rot={5}
      semente={191}
    />
    <NotaMao x={330} y={1080} ini={73} tam={60} rot={-4}>
      comenta aí ↓
    </NotaMao>
    <TiraRasgada
      texto="SIGA @HISTORICODEBUSCA"
      x={90}
      y={1250}
      ini={101}
      rot={-3}
      tam={46}
    />
    <Legenda
      falas={[
        { de: 0, ate: 73, a: "E aí, o real ", k: "vira esse jogo", b: "?" },
        { de: 73, ate: 101, a: "", k: "Comenta aí", b: "." },
        {
          de: 101,
          ate: 218,
          a: "E me siga para mais ",
          k: "buscas aleatórias",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

// ===== montagem =====
const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 145, el: <C1Busca /> },
  { dur: 142, el: <C2Pontape /> },
  { dur: 242, el: <C3Seis /> },
  { dur: 244, el: <C4Ataque /> },
  { dur: 155, el: <C5Reforco /> },
  { dur: 274, el: <C6Carrinho /> },
  { dur: 141, el: <C7Placar /> },
  { dur: 218, el: <C8Final /> },
];
export const DURACAO_DOLAR = CENAS.reduce((s, c) => s + c.dur, 0);

const TrocaDeFolha: React.FC<{ cortes: number[] }> = ({ cortes }) => {
  const frame = useCurrentFrame();
  const c = cortes.find((t) => Math.abs(frame - t) <= 7);
  if (c === undefined) return null;
  const p = interpolate(emDois(frame - c), [-7, 7], [0, 1], clamp);
  const x = interpolate(p, [0, 1], [1180, -1300]);
  return (
    <div
      style={{
        position: "absolute",
        top: -40,
        left: x,
        width: 1240,
        height: 2000,
        transform: "rotate(-4deg)",
        clipPath: rasgado(5, 30, 1.2),
        background: KRAFT,
        boxShadow: "inset 0 0 120px rgba(90,70,40,0.35)",
      }}
    />
  );
};

export const VideoDolarAtaque: React.FC = () => {
  let inicio = 0;
  const cortes: number[] = [];
  const seqs = CENAS.map((c, i) => {
    const from = inicio;
    inicio += c.dur;
    if (i > 0) cortes.push(from);
    return (
      <Sequence key={i} from={from} durationInFrames={c.dur}>
        {c.el}
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      <Audio src={staticFile("voxdolar/mix_final.wav")} />
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};
