import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { SANS, SERIF } from "../fonts";
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

// "A volta do CEO da Nvidia" (parte 2) — @historicodebusca. Colagem de papel.
// Narração Nassif (82 s). Tempos tirados da transcrição (+0,3 s de atraso do áudio).
// Mercado só narrado: nada de recomendação de compra ou venda.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#2f9e57";
const CRED_HUANG = "Foto: Anderseidesvik · CC BY-SA 4.0 · Wikimedia Commons";
const CRED_KRESS = "Foto: SiliconANGLE theCUBE · CC BY 4.0 · Wikimedia Commons";

const Foto: React.FC<{
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  ini: number;
  rot?: number;
  cor?: string;
  semente?: number;
  posicao?: string;
  filtro?: string;
}> = ({
  src,
  w,
  h,
  x,
  y,
  ini,
  rot = -2,
  cor = LARANJA,
  semente = 11,
  posicao = "50% 30%",
  filtro,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        transformOrigin: "50% 80%",
        filter: adesivo(cor, 8),
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          clipPath: rasgado(semente),
          background: KRAFT,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: posicao,
            filter: filtro,
          }}
        />
      </div>
    </div>
  );
};

const Adesivo: React.FC<{
  x: number;
  y: number;
  ini: number;
  rot?: number;
  cor?: string;
  children: React.ReactNode;
}> = ({ x, y, ini, rot = 0, cor = "#fff", children }) => {
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
      {children}
    </div>
  );
};

const Cartao: React.FC<{
  largura?: number;
  fundo?: string;
  semente?: number;
  children: React.ReactNode;
}> = ({ largura = 440, fundo = "#f8f4ea", semente = 71, children }) => (
  <div
    style={{
      width: largura,
      background: fundo,
      clipPath: rasgado(semente, 18, 1.4),
      padding: "34px 30px",
      boxSizing: "border-box",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

// maçã genérica desenhada (não é o logo de nenhuma empresa)
const Maca: React.FC<{ tam?: number }> = ({ tam = 150 }) => (
  <svg viewBox="0 0 120 130" width={tam} height={tam * 1.08}>
    <path
      d="M60 34 Q30 18 16 48 Q4 86 34 118 Q48 128 60 120 Q72 128 86 118 Q116 86 104 48 Q90 18 60 34 Z"
      fill={VERMELHO}
      stroke={TINTA}
      strokeWidth={5}
    />
    <path
      d="M60 34 Q58 16 66 6"
      stroke={TINTA}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M66 18 Q86 6 94 20 Q78 28 66 18 Z"
      fill={VERDE}
      stroke={TINTA}
      strokeWidth={4}
    />
  </svg>
);

const Chip: React.FC<{ tam?: number; cor?: string }> = ({
  tam = 150,
  cor = "#3a3a3a",
}) => (
  <svg viewBox="0 0 120 120" width={tam} height={tam}>
    {[30, 50, 70, 90].map((p) => (
      <g key={p} stroke={TINTA} strokeWidth={6}>
        <line x1={p} y1={4} x2={p} y2={20} />
        <line x1={p} y1={100} x2={p} y2={116} />
        <line x1={4} y1={p} x2={20} y2={p} />
        <line x1={100} y1={p} x2={116} y2={p} />
      </g>
    ))}
    <rect
      x={18}
      y={18}
      width={84}
      height={84}
      rx={8}
      fill={cor}
      stroke={TINTA}
      strokeWidth={6}
    />
    <rect
      x={38}
      y={38}
      width={44}
      height={44}
      rx={4}
      fill="#9aa3ad"
      stroke={TINTA}
      strokeWidth={4}
    />
  </svg>
);

const Cadeira: React.FC<{ tam?: number }> = ({ tam = 360 }) => (
  <svg viewBox="0 0 200 240" width={tam} height={tam * 1.2}>
    <rect
      x={40}
      y={10}
      width={120}
      height={120}
      rx={22}
      fill="#2b2b2b"
      stroke={TINTA}
      strokeWidth={7}
    />
    <rect
      x={30}
      y={125}
      width={140}
      height={34}
      rx={12}
      fill="#3a3a3a"
      stroke={TINTA}
      strokeWidth={7}
    />
    <line x1={100} y1={159} x2={100} y2={205} stroke={TINTA} strokeWidth={10} />
    <path
      d="M50 225 L100 205 L150 225"
      fill="none"
      stroke={TINTA}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <circle cx={50} cy={228} r={8} fill={TINTA} />
    <circle cx={150} cy={228} r={8} fill={TINTA} />
  </svg>
);

// gráfico de papel: linha que cai (escândalo) e salta (volta)
const Grafico: React.FC<{
  ini: number;
  mostraAntes?: boolean;
  antesIni?: number;
}> = ({ ini, mostraAntes = false, antesIni = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(emDois(frame), [ini, ini + 50], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  // pontos: antes (alto), escândalo (queda), volta (salto, mas abaixo do antes)
  const pts = [
    [60, 170],
    [180, 160],
    [300, 175],
    [420, 330],
    [540, 360],
    [660, 345],
    [780, 210],
  ];
  const n = 1 + p * (pts.length - 1);
  const vis = pts.slice(0, Math.floor(n) + 1).map((q, i) => {
    if (i < Math.floor(n)) return q;
    const a = pts[i - 1] ?? q;
    const f = n - Math.floor(n);
    return [a[0] + (q[0] - a[0]) * f, a[1] + (q[1] - a[1]) * f];
  });
  const d = vis.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
  const ult = vis[vis.length - 1];
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 640,
        filter: adesivo("#fff", 8),
      }}
    >
      <div
        style={{
          width: 960,
          height: 480,
          background: "#fbf8f0",
          clipPath: rasgado(211, 24, 1),
        }}
      >
        <svg width={960} height={480}>
          {[100, 200, 300, 400].map((y) => (
            <line
              key={y}
              x1={30}
              x2={930}
              y1={y}
              y2={y}
              stroke="rgba(23,19,14,0.12)"
              strokeWidth={2}
            />
          ))}
          {mostraAntes ? (
            <g opacity={linear(frame, antesIni, 8)}>
              <line
                x1={30}
                x2={930}
                y1={165}
                y2={165}
                stroke={VERMELHO}
                strokeWidth={5}
                strokeDasharray="18 12"
              />
              <text
                x={380}
                y={150}
                fontFamily="Inter, sans-serif"
                fontWeight={900}
                fontSize={30}
                fill={VERMELHO}
              >
                PREÇO ANTES DO ESCÂNDALO
              </text>
            </g>
          ) : null}
          <path
            d={d}
            fill="none"
            stroke={TINTA}
            strokeWidth={12}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={d}
            fill="none"
            stroke={VERDE}
            strokeWidth={6}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle
            cx={ult[0]}
            cy={ult[1]}
            r={14}
            fill={VERDE}
            stroke={TINTA}
            strokeWidth={5}
          />
          <text
            x={420}
            y={420}
            fontFamily="Inter, sans-serif"
            fontWeight={800}
            fontSize={26}
            fill={TINTA}
            opacity={0.6}
          >
            renúncia
          </text>
          <text
            x={660}
            y={190}
            fontFamily="Inter, sans-serif"
            fontWeight={800}
            fontSize={26}
            fill={TINTA}
            opacity={p > 0.95 ? 0.7 : 0}
          >
            volta
          </text>
        </svg>
      </div>
    </div>
  );
};

// ================= cenas =================
const C1Gancho: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA · PARTE 2" />
    <Titulo antes="12 anos " marca="× 12 dias" marcaIni={120} tam={110} />
    <Adesivo x={70} y={640} ini={8} rot={-5}>
      <Cartao semente={71}>
        <Maca tam={150} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 40,
            color: TINTA,
            marginTop: 14,
          }}
        >
          STEVE JOBS
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 96,
            color: TINTA,
          }}
        >
          12 anos
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 28,
            color: TINTA,
            opacity: 0.7,
          }}
        >
          1985 → 1997
        </div>
      </Cartao>
    </Adesivo>
    <Adesivo x={570} y={740} ini={120} rot={5} cor={VERDE}>
      <Cartao semente={81}>
        <Chip tam={150} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 40,
            color: TINTA,
            marginTop: 14,
          }}
        >
          CEO DA NVIDIA
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 96,
            color: VERDE,
          }}
        >
          12 dias
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 28,
            color: TINTA,
            opacity: 0.7,
          }}
        >
          nov/2026
        </div>
      </Cartao>
    </Adesivo>
    <Legenda
      falas={[
        {
          de: 0,
          ate: 120,
          a: "Steve Jobs levou ",
          k: "12 anos",
          b: " para voltar à Apple.",
        },
        {
          de: 120,
          ate: 256,
          a: "O CEO da Nvidia levou ",
          k: "12 dias",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C2Busca: React.FC = () => {
  const frame = useCurrentFrame();
  const termo = "ceo da nvidia voltou";
  const n = Math.floor(
    interpolate(emDois(frame), [6, 46], [0, termo.length], clamp),
  );
  return (
    <Cena>
      <Kicker texto="NO MEU HISTÓRICO DE BUSCA DE HOJE" />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 420,
          transform: `rotate(-1.5deg) scale(${estalo(frame, 0, 8)})`,
          background: "#fff",
          border: `6px solid ${TINTA}`,
          borderRadius: 60,
          boxShadow: `10px 10px 0 ${TINTA}`,
          padding: "26px 34px",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 50,
          color: TINTA,
          minHeight: 70,
        }}
      >
        🔍 {termo.slice(0, n)}
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>|</span>
      </div>
      <Foto
        src="voxNvidiaVolta/huang.jpg"
        w={560}
        h={680}
        x={260}
        y={600}
        ini={40}
        rot={3}
        semente={91}
      />
      <Carimbo
        texto="VOLTOU"
        x={500}
        y={1180}
        ini={60}
        rot={-8}
        tam={70}
        cor={VERDE}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: 119,
            a: "No meu histórico de busca de hoje: ",
            k: "Jensen Huang voltou",
            b: ".",
          },
        ]}
      />
      <Rodape credito={CRED_HUANG} />
    </Cena>
  );
};

const C3Lembra: React.FC = () => (
  <Cena>
    <Kicker texto="LEMBRA? · O CASO" />
    <Adesivo x={90} y={420} ini={0} rot={-3}>
      <div
        style={{
          width: 880,
          height: 600,
          background: "#d8b46a",
          border: `6px solid ${TINTA}`,
          borderRadius: 12,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 30,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
            color: TINTA,
          }}
        >
          CASO Nº 2026-NVDA
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 110,
            right: 40,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 50,
            lineHeight: 1.15,
            color: TINTA,
          }}
        >
          Renunciou após admitir casos extraconjugais.
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 330,
            width: 420,
            height: 26,
            background: TINTA,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 380,
            width: 600,
            height: 26,
            background: TINTA,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 430,
            width: 320,
            height: 26,
            background: TINTA,
          }}
        />
      </div>
    </Adesivo>
    <Carimbo
      texto="SUSPEITA, NÃO COMPROVADA"
      x={90}
      y={1090}
      ini={120}
      rot={-5}
      tam={48}
      cor={VERMELHO}
    />
    <NotaMao x={140} y={1240} ini={120} tam={46} rot={-3}>
      segundo a imprensa americana
    </NotaMao>
    <Legenda
      falas={[
        {
          de: 0,
          ate: 120,
          a: "Lembra? Ele renunciou depois de admitir ",
          k: "casos extraconjugais",
          b: ".",
        },
        {
          de: 120,
          ate: 288,
          a: "Um deles com uma mulher ligada à ",
          k: "espionagem chinesa",
          b: ", diz a imprensa.",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C4Conselho: React.FC = () => {
  const frame = useCurrentFrame();
  const risca = linear(frame, 96, 10);
  return (
    <Cena>
      <Kicker texto="O CONSELHO DA NVIDIA" />
      <Adesivo x={70} y={400} ini={0} rot={-3}>
        <div
          style={{
            position: "relative",
            background: "#f8f4ea",
            padding: "20px 34px",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 52,
            color: TINTA,
            clipPath: rasgado(101, 18, 1.4),
          }}
        >
          “Não vamos trazê-lo de volta.”
          <div
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              height: 10,
              width: `${risca * 94}%`,
              background: VERMELHO,
              transform: "rotate(-2deg)",
            }}
          />
        </div>
      </Adesivo>
      <div style={{ position: "absolute", left: 340, top: 640 }}>
        <Cadeira tam={400} />
      </div>
      <Foto
        src="voxNvidiaVolta/huang.jpg"
        w={300}
        h={340}
        x={390}
        y={560}
        ini={222}
        rot={-2}
        semente={111}
      />
      <Carimbo
        texto="VOLTOU · UNÂNIME"
        x={70}
        y={1110}
        ini={171}
        rot={-6}
        tam={50}
        cor={VERDE}
      />
      <Foto
        src="voxNvidiaVolta/kress.jpg"
        w={210}
        h={260}
        x={790}
        y={1000}
        ini={291}
        rot={6}
        semente={121}
        cor={AZUL}
      />
      <NotaMao x={560} y={1290} ini={291} tam={42} rot={-3}>
        Kress volta a ser CFO →
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 96,
            a: "O conselho disse que ",
            k: "não ia trazer ele de volta",
            b: ".",
          },
          {
            de: 96,
            ate: 171,
            a: "Só que, nesta segunda, ",
            k: "mudou de ideia",
            b: ":",
          },
          { de: 171, ate: 222, a: "", k: "votação unânime", b: "." },
          { de: 222, ate: 291, a: "Huang é ", k: "CEO de novo", b: "," },
          {
            de: 291,
            ate: 396,
            a: "e Colette Kress volta para a ",
            k: "diretoria financeira",
            b: ".",
          },
        ]}
      />
      <Rodape credito="Fotos: Anderseidesvik (CC BY-SA 4.0) e SiliconANGLE (CC BY 4.0) · Commons" />
    </Cena>
  );
};

const C5Porque: React.FC = () => (
  <Cena>
    <Kicker texto="E POR QUE MUDOU?" />
    <Titulo antes="Segundo a " marca="CNBC:" marcaIni={40} tam={104} />
    <Adesivo x={90} y={700} ini={35} rot={-2}>
      <div
        style={{
          width: 900,
          background: "#fbf8f0",
          border: `5px solid ${TINTA}`,
          padding: "40px 44px",
          boxSizing: "border-box",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 56,
          lineHeight: 1.2,
          color: TINTA,
        }}
      >
        Trump garantiu ao conselho que Huang{" "}
        <span style={{ background: AZUL, padding: "0 8px" }}>não violou</span>{" "}
        leis de segurança nacional.
      </div>
    </Adesivo>
    <NotaMao x={140} y={1180} ini={120} tam={44} rot={-3}>
      fonte: pessoas a par da decisão
    </NotaMao>
    <Legenda
      falas={[
        { de: 0, ate: 35, a: "E ", k: "por que mudou", b: "?" },
        {
          de: 35,
          ate: 234,
          a: "Segundo a CNBC, Trump garantiu que Huang ",
          k: "não violou leis",
          b: " de segurança.",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const C6Mercado: React.FC = () => {
  const frame = useCurrentFrame();
  const tri = interpolate(emDois(frame), [262, 330], [0, 1], clamp);
  return (
    <Cena>
      <Kicker texto="E O MERCADO?" />
      <Titulo antes="Fez " marca="festa." marcaIni={30} tam={110} />
      <Grafico ini={60} />
      <TiraRasgada
        texto="+31% EM UM DIA"
        x={110}
        y={1150}
        ini={71}
        rot={-4}
        tam={64}
        fundo={VERDE}
        cor={PAPEL}
      />
      <NotaMao x={560} y={1260} ini={140} tam={44} rot={-3}>
        melhor dia desde 2003
      </NotaMao>
      {tri > 0 ? (
        <Adesivo x={620} y={430} ini={260} rot={6} cor={VERDE}>
          <div
            style={{
              background: "#fbf8f0",
              padding: "16px 26px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 54,
              color: VERDE,
              clipPath: rasgado(131, 14, 2),
            }}
          >
            +US$ {(tri * 1).toFixed(1).replace(".", ",")} TRI
          </div>
        </Adesivo>
      ) : null}
      <Legenda
        falas={[
          { de: 0, ate: 71, a: "E o mercado? ", k: "Fez festa", b: "." },
          {
            de: 71,
            ate: 260,
            a: "A ação fechou em alta de ",
            k: "uns 31%",
            b: ", o melhor dia desde 2003.",
          },
          {
            de: 260,
            ate: 413,
            a: "Quase ",
            k: "1 trilhão de dólares",
            b: " a mais, em um dia.",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C7Embalo: React.FC = () => {
  const frame = useCurrentFrame();
  const sobe = (i: number) =>
    interpolate(emDois(frame), [111 + i * 10, 150 + i * 10], [140, 0], {
      ...clamp,
      easing: Easing.out(Easing.back(1.6)),
    });
  return (
    <Cena>
      <Kicker texto="NO EMBALO" />
      <Adesivo x={90} y={400} ini={0} rot={-2}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: TINTA,
            color: PAPEL,
            padding: "18px 34px",
            borderRadius: 14,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 64,
            boxShadow: `8px 8px 0 ${VERDE}`,
          }}
        >
          NASDAQ <span style={{ color: VERDE }}>▲</span>
        </div>
      </Adesivo>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 110 + i * 300,
            top: 640 + sobe(i),
            opacity: frame > 111 + i * 10 ? 1 : 0,
            filter: adesivo("#fff", 6),
          }}
        >
          <Chip tam={200} cor={["#3a3a3a", "#5a4a8a", "#8a4a3a"][i]} />
          <div
            style={{
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 60,
              color: VERDE,
            }}
          >
            ▲
          </div>
        </div>
      ))}
      <NotaMao x={140} y={940} ini={130} tam={44} rot={-3}>
        outras fabricantes de chips
      </NotaMao>
      <Adesivo x={90} y={1060} ini={199} rot={-3}>
        <div
          style={{
            width: 900,
            background: "#fbf8f0",
            padding: "26px 34px",
            boxSizing: "border-box",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 52,
            color: TINTA,
            clipPath: rasgado(141, 18, 1.4),
          }}
        >
          “Saiu o maior peso que havia.”
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 26,
              opacity: 0.7,
              marginTop: 8,
            }}
          >
            — analista de Wall Street
          </div>
        </div>
      </Adesivo>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 111,
            a: "A ",
            k: "Nasdaq",
            b: ", a bolsa das empresas de tecnologia, subiu junto,",
          },
          {
            de: 111,
            ate: 199,
            a: "e as outras fabricantes de chips ",
            k: "foram no embalo",
            b: ".",
          },
          {
            de: 199,
            ate: 371,
            a: "Para um analista, saiu ",
            k: "o maior peso",
            b: " de cima do mercado.",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C8Desconfiados: React.FC = () => (
  <Cena>
    <Kicker texto="SÓ QUE..." />
    <Titulo antes="Tem gente " marca="desconfiada." marcaIni={20} tam={96} />
    <Grafico ini={-60} mostraAntes antesIni={76} />
    <Adesivo x={160} y={1170} ini={190} rot={-4}>
      <div
        style={{
          width: 760,
          background: "#d8b46a",
          border: `6px solid ${TINTA}`,
          borderRadius: 10,
          padding: "26px 30px",
          boxSizing: "border-box",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 42,
          color: TINTA,
          textAlign: "center",
        }}
      >
        INVESTIGAÇÃO EM ANDAMENTO
      </div>
    </Adesivo>
    <Legenda
      falas={[
        { de: 0, ate: 76, a: "Só que tem gente ", k: "desconfiada", b: ":" },
        {
          de: 76,
          ate: 190,
          a: "a ação ainda ",
          k: "não voltou ao preço",
          b: " de antes do escândalo.",
        },
        { de: 190, ate: 251, a: "E a ", k: "investigação continua", b: "." },
      ]}
    />
    <Rodape />
  </Cena>
);

const C9Final: React.FC = () => (
  <Cena>
    <Kicker texto="E VOCÊ?" />
    <Titulo antes="Foi justo " marca="ele voltar?" marcaIni={10} tam={100} />
    <Adesivo x={90} y={700} ini={8} rot={-6} cor={VERDE}>
      <Cartao largura={400} semente={151}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 96,
            color: VERDE,
          }}
        >
          SIM
        </div>
      </Cartao>
    </Adesivo>
    <Adesivo x={560} y={780} ini={14} rot={5} cor={VERMELHO}>
      <Cartao largura={400} semente={161}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 96,
            color: VERMELHO,
          }}
        >
          NÃO
        </div>
      </Cartao>
    </Adesivo>
    <NotaMao x={330} y={1080} ini={40} tam={60} rot={-4}>
      comenta aí ↓
    </NotaMao>
    <TiraRasgada
      texto="SIGA @HISTORICODEBUSCA"
      x={90}
      y={1250}
      ini={75}
      rot={-3}
      tam={46}
    />
    <Legenda
      falas={[
        {
          de: 0,
          ate: 75,
          a: "Foi justo ele voltar? ",
          k: "Comenta aí",
          b: ".",
        },
        {
          de: 75,
          ate: 153,
          a: "E me siga para mais ",
          k: "buscas aleatórias",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 256, el: <C1Gancho /> },
  { dur: 119, el: <C2Busca /> },
  { dur: 288, el: <C3Lembra /> },
  { dur: 396, el: <C4Conselho /> },
  { dur: 234, el: <C5Porque /> },
  { dur: 413, el: <C6Mercado /> },
  { dur: 371, el: <C7Embalo /> },
  { dur: 251, el: <C8Desconfiados /> },
  { dur: 153, el: <C9Final /> },
];
export const DURACAO_NVIDIA_VOLTA = CENAS.reduce((s, c) => s + c.dur, 0);

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

export const VideoNvidiaVolta: React.FC<{ semAudio?: boolean }> = ({
  semAudio,
}) => {
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
      {semAudio ? null : (
        <Audio src={staticFile("voxNvidiaVolta/mix_final.wav")} />
      )}
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};

export const CapaNvidiaVolta: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA · PARTE 2" />
    <Titulo
      antes="O CEO da Nvidia "
      marca="voltou."
      ini={-20}
      marcaIni={-20}
      tam={112}
    />
    <Foto
      src="voxNvidiaVolta/huang.jpg"
      w={600}
      h={720}
      x={240}
      y={660}
      ini={-20}
      rot={3}
      semente={91}
    />
    <TiraRasgada
      texto="+31% EM UM DIA"
      x={110}
      y={1290}
      ini={-20}
      rot={-4}
      tam={64}
      fundo={VERDE}
      cor={PAPEL}
    />
    <Rodape credito={CRED_HUANG} />
  </Cena>
);
