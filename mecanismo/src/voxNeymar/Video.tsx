import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
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
  Traco,
  Cena,
} from "../voxNvidia/Completo";

// "Neymar e a tigrinha" — @historicodebusca, colagem de papel (mesma base do caso Nvidia).
// Boato de coluna, negado pelos dois: tudo atribuído, nada afirmado como fato.
// Sem fotos (nenhuma baixada) e sem marcas: nada de logo do Metrópoles, do Instagram, de casas de apostas
// nem do personagem do "jogo do tigrinho". Todos os desenhos são originais.
// Tempos medidos nas pausas da narração do Nassif (+0,3 s).

// ================= desenhos originais =================
const Recorte: React.FC<{
  x: number;
  y: number;
  ini: number;
  rot?: number;
  cor?: string;
  children: React.ReactNode;
}> = ({ x, y, ini, rot = 0, cor = AZUL, children }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        filter: adesivo(cor, 7),
      }}
    >
      {children}
    </div>
  );
};

const Bola: React.FC<{ tam?: number }> = ({ tam = 120 }) => (
  <svg viewBox="0 0 100 100" width={tam} height={tam}>
    <circle cx={50} cy={50} r={44} fill="#fff" stroke={TINTA} strokeWidth={5} />
    <path d="M50 30 L66 42 L60 61 L40 61 L34 42 Z" fill={TINTA} />
    {[
      [50, 30, 50, 8],
      [66, 42, 88, 36],
      [60, 61, 74, 82],
      [40, 61, 26, 82],
      [34, 42, 12, 36],
    ].map(([a, b, c, d], i) => (
      <line
        key={i}
        x1={a}
        y1={b}
        x2={c}
        y2={d}
        stroke={TINTA}
        strokeWidth={4}
      />
    ))}
  </svg>
);

const AroDeLuz: React.FC<{ tam?: number }> = ({ tam = 120 }) => (
  <svg viewBox="0 0 100 100" width={tam} height={tam}>
    <circle
      cx={50}
      cy={42}
      r={34}
      fill="none"
      stroke="#fff6c8"
      strokeWidth={12}
    />
    <circle cx={50} cy={42} r={34} fill="none" stroke={TINTA} strokeWidth={3} />
    <circle cx={50} cy={42} r={40} fill="none" stroke={TINTA} strokeWidth={3} />
    <rect x={40} y={28} width={20} height={30} rx={4} fill={TINTA} />
    <line x1={50} y1={82} x2={50} y2={96} stroke={TINTA} strokeWidth={5} />
  </svg>
);

const Plaquinha: React.FC<{
  nome: string;
  icone: React.ReactNode;
  foto?: string;
  posicao?: string;
  x: number;
  y: number;
  ini: number;
  rot: number;
  cor: string;
  semente: number;
}> = ({ nome, icone, foto, posicao = "50% 20%", x, y, ini, rot, cor, semente }) => (
  <Recorte x={x} y={y} ini={ini} rot={rot} cor={cor}>
    <div
      style={{
        width: 380,
        padding: "22px 18px 18px",
        clipPath: rasgado(semente, 16, 1.4),
        background: "#f8f4ea",
        textAlign: "center",
      }}
    >
      {foto ? (
        <div style={{ width: 344, height: 300, overflow: "hidden", background: KRAFT }}>
          <Img
            src={staticFile(foto)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: posicao,
              filter: "grayscale(1) contrast(1.3) brightness(1.05)",
              mixBlendMode: "multiply",
            }}
          />
        </div>
      ) : (
        icone
      )}
      <div
        style={{
          marginTop: 8,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: "0.06em",
          color: TINTA,
          lineHeight: 1.05,
        }}
      >
        {nome}
      </div>
    </div>
  </Recorte>
);

const CRED = "Fotos: Meghdad Madadi (CC BY 4.0) · Multishow (CC BY 3.0) · Wikimedia Commons";

const ColunaJornal: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 560,
        transform: `rotate(-3deg) scale(${v})`,
        filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
      }}
    >
      <div
        style={{
          width: 600,
          padding: "30px 38px 40px",
          background: "#f4efe2",
          clipPath: rasgado(41, 22, 1.2),
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "0.18em",
            color: TINTA,
            borderBottom: `3px solid ${TINTA}`,
            paddingBottom: 8,
          }}
        >
          COLUNA DE FOFOCA
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.05,
            color: TINTA,
          }}
        >
          Teriam trocado beijos em festa reservada
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              marginTop: 14,
              height: 12,
              width: `${92 - (i % 3) * 14}%`,
              background: "rgba(23,19,14,0.22)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Bandeirada: React.FC = () => (
  <svg viewBox="0 0 160 140" width={140} height={122}>
    <line
      x1={20}
      y1={10}
      x2={20}
      y2={134}
      stroke={TINTA}
      strokeWidth={8}
      strokeLinecap="round"
    />
    {Array.from({ length: 4 }).map((_, r) =>
      Array.from({ length: 5 }).map((__, c) => (
        <rect
          key={`${r}-${c}`}
          x={24 + c * 24}
          y={14 + r * 20 + Math.sin(c * 0.9) * 6}
          width={24}
          height={20}
          fill={(r + c) % 2 ? "#fff" : TINTA}
        />
      )),
    )}
  </svg>
);

const Celular: React.FC<{ troca: number; ini: number }> = ({ troca, ini }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  const virou = emDois(frame) >= troca;
  const dedo = linear(frame, troca - 10, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 300,
        top: 780,
        transform: `rotate(4deg) scale(${v})`,
        filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
      }}
    >
      <div
        style={{
          width: 440,
          height: 560,
          borderRadius: 52,
          background: TINTA,
          padding: 22,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 34,
            background: "#f8f4ea",
            padding: "56px 34px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: KRAFT,
              border: `5px solid ${TINTA}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AroDeLuz tam={90} />
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 34,
              color: TINTA,
            }}
          >
            perfil da Virginia
          </div>
          <div
            style={{
              margin: "34px auto 0",
              width: 300,
              padding: "18px 0",
              borderRadius: 16,
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 40,
              background: virou ? AZUL : "#d9d2c1",
              color: TINTA,
              border: `4px solid ${TINTA}`,
            }}
          >
            {virou ? "Seguir" : "Seguindo"}
          </div>
        </div>
      </div>
      {/* dedo que aperta o botão */}
      <svg
        width={140}
        height={170}
        style={{
          position: "absolute",
          left: 300 - dedo * 40,
          top: 470 - dedo * 40,
        }}
      >
        <path
          d="M40 160 L40 60 Q40 36 60 36 Q80 36 80 60 L80 100 L110 104 Q130 108 128 132 L120 160 Z"
          fill="#f2c9a4"
          stroke={TINTA}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Risadas: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  const baloes = [
    { x: 80, y: 650, t: "kkkkk", r: -8 },
    { x: 760, y: 700, t: "e o unfollow??", r: 6 },
    { x: 70, y: 1240, t: "👀", r: 4 },
    { x: 780, y: 1250, t: "kkkk", r: -5 },
  ];
  return (
    <>
      {baloes.map((b, i) => {
        const v = estalo(frame, ini + i * 6, 6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              transform: `rotate(${b.r}deg) scale(${v})`,
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
            {b.t}
          </div>
        );
      })}
    </>
  );
};

const DocumentoCPI: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 560,
        transform: `rotate(-4deg) scale(${v})`,
        filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
      }}
    >
      <div
        style={{
          width: 560,
          padding: "32px 40px 40px",
          background: "#f8f4ea",
          clipPath: rasgado(57, 20, 1.2),
          fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
          color: TINTA,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 26 }}>SENADO FEDERAL</div>
        <div style={{ fontWeight: 800, fontSize: 34, marginTop: 6 }}>
          CPI DAS BETS
        </div>
        <div style={{ fontSize: 26, marginTop: 18 }}>
          Depoimento: Virginia Fonseca
        </div>
        <div style={{ fontSize: 26 }}>Data: 13/05/2025</div>
        <div style={{ fontSize: 26 }}>Tema: propaganda de apostas</div>
      </div>
    </div>
  );
};

const Fichas: React.FC = () => (
  <svg viewBox="0 0 160 120" width={220} height={165}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${20 + i * 40} ${70 - i * 18})`}>
        <ellipse
          cx={30}
          cy={20}
          rx={30}
          ry={14}
          fill={i === 1 ? VERMELHO : i === 2 ? AZUL : LARANJA}
          stroke={TINTA}
          strokeWidth={5}
        />
        <ellipse
          cx={30}
          cy={20}
          rx={14}
          ry={6}
          fill="#fff"
          stroke={TINTA}
          strokeWidth={3}
        />
      </g>
    ))}
  </svg>
);

// tigrinho de pelúcia triste (personagem original, redondinho, sem moedas nem marca)
const TigrinhoTriste: React.FC<{ tam?: number }> = ({ tam = 320 }) => (
  <svg viewBox="0 0 220 220" width={tam} height={tam}>
    <circle
      cx={58}
      cy={58}
      r={26}
      fill={LARANJA}
      stroke={TINTA}
      strokeWidth={6}
    />
    <circle
      cx={162}
      cy={58}
      r={26}
      fill={LARANJA}
      stroke={TINTA}
      strokeWidth={6}
    />
    <circle cx={58} cy={58} r={11} fill="#f8d6b4" />
    <circle cx={162} cy={58} r={11} fill="#f8d6b4" />
    <ellipse
      cx={110}
      cy={118}
      rx={88}
      ry={80}
      fill={LARANJA}
      stroke={TINTA}
      strokeWidth={6}
    />
    {/* listras */}
    <path d="M110 40 L102 70 L118 70 Z" fill={TINTA} />
    <path d="M30 110 L60 104 L58 120 Z" fill={TINTA} />
    <path d="M190 110 L160 104 L162 120 Z" fill={TINTA} />
    <ellipse
      cx={110}
      cy={152}
      rx={44}
      ry={32}
      fill="#fbe9d3"
      stroke={TINTA}
      strokeWidth={4}
    />
    {/* olhos tristes */}
    <path
      d="M72 104 Q84 96 96 104"
      fill="none"
      stroke={TINTA}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <path
      d="M124 104 Q136 96 148 104"
      fill="none"
      stroke={TINTA}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <circle cx={84} cy={116} r={8} fill={TINTA} />
    <circle cx={136} cy={116} r={8} fill={TINTA} />
    <path
      d="M78 128 Q74 140 80 146 Q86 140 82 128 Z"
      fill={AZUL}
      stroke={TINTA}
      strokeWidth={2}
    />
    <ellipse cx={110} cy={140} rx={10} ry={7} fill={TINTA} />
    <path
      d="M96 166 Q110 156 124 166"
      fill="none"
      stroke={TINTA}
      strokeWidth={5}
      strokeLinecap="round"
    />
  </svg>
);

const PratoDeTrigo: React.FC<{ tam?: number }> = ({ tam = 300 }) => (
  <svg viewBox="0 0 220 140" width={tam} height={tam * (140 / 220)}>
    <ellipse
      cx={110}
      cy={96}
      rx={100}
      ry={34}
      fill="#fff"
      stroke={TINTA}
      strokeWidth={6}
    />
    <ellipse
      cx={110}
      cy={90}
      rx={70}
      ry={20}
      fill="#efe2b5"
      stroke={TINTA}
      strokeWidth={4}
    />
    {Array.from({ length: 5 }).map((_, i) => {
      const x = 70 + i * 20;
      return (
        <g key={i}>
          <line
            x1={x}
            y1={90}
            x2={x + (i - 2) * 6}
            y2={20}
            stroke="#b8862f"
            strokeWidth={5}
            strokeLinecap="round"
          />
          {[0, 1, 2].map((k) => (
            <ellipse
              key={k}
              cx={x + (i - 2) * 6 * ((40 - k * 12) / 70)}
              cy={30 + k * 12}
              rx={6}
              ry={10}
              fill="#e0b54a"
              stroke={TINTA}
              strokeWidth={2}
            />
          ))}
        </g>
      );
    })}
  </svg>
);

// cartão do trava-língua, com a troca riscada
const TravaLingua: React.FC<{
  ini: number;
  risca: number;
  nova: number;
  y?: number;
}> = ({ ini, risca, nova, y = 620 }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  const r = linear(frame, risca, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: y,
        transform: `rotate(-2deg) scale(${v})`,
        filter: adesivo(LARANJA, 7),
      }}
    >
      <div
        style={{
          width: 880,
          padding: "40px 46px 48px",
          background: "#f8f4ea",
          clipPath: rasgado(63, 22, 1.1),
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 72,
          lineHeight: 1.1,
          color: TINTA,
        }}
      >
        Três pratos de trigo para{" "}
        <span style={{ position: "relative", whiteSpace: "nowrap" }}>
          três tigres tristes
          <svg
            width={620}
            height={60}
            style={{
              position: "absolute",
              left: -10,
              top: 30,
              overflow: "visible",
            }}
          >
            <path
              d="M0 24 C 120 10, 260 40, 400 18 S 560 30, 600 20"
              fill="none"
              stroke={VERMELHO}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={700}
              strokeDashoffset={700 * (1 - r)}
            />
          </svg>
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: "100%",
          marginTop: 14,
          transform: `rotate(-4deg) scale(${estalo(frame, nova, 8)})`,
          transformOrigin: "left top",
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 60,
          color: VERMELHO,
          whiteSpace: "nowrap",
        }}
      >
        um prato… pra uma tigrinha triste
      </div>
    </div>
  );
};

const Bilhete: React.FC<{
  x: number;
  y: number;
  ini: number;
  texto: string;
  cor: string;
  rot: number;
  semente: number;
  tam: number;
}> = ({ x, y, ini, texto, cor, rot, semente, tam }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        filter: adesivo(cor, 7),
      }}
    >
      <div
        style={{
          padding: "50px 40px",
          clipPath: rasgado(semente, 18, 1.4),
          background: "#f8f4ea",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: tam,
          color: TINTA,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const Hashtags: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  const tags = [
    { x: 70, y: 1210, r: -6 },
    { x: 560, y: 1250, r: 5 },
    { x: 300, y: 1320, r: -2 },
  ];
  return (
    <>
      {tags.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            transform: `rotate(${t.r}deg) scale(${estalo(frame, ini + i * 5, 6)})`,
            background: AZUL,
            border: `4px solid ${TINTA}`,
            padding: "6px 18px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 34,
            color: TINTA,
            whiteSpace: "nowrap",
          }}
        >
          #tigrinhatriste
        </div>
      ))}
    </>
  );
};

// ================= as 6 cenas =================
const C1Gancho: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA · FOFOCA DA SEMANA" />
    <Titulo
      antes="A internet mudou o "
      marca="trava-língua."
      marcaIni={30}
      tam={88}
    />
    <TravaLingua ini={10} risca={133} nova={148} />
    <Recorte x={620} y={1080} ini={140} rot={8} cor={AZUL}>
      <div
        style={{
          background: "#f8f4ea",
          padding: 10,
          clipPath: rasgado(71, 12, 2),
        }}
      >
        <Bola tam={150} />
      </div>
    </Recorte>
    <NotaMao x={330} y={1150} ini={150} tam={46} rot={-6}>
      culpa dele →
    </NotaMao>
    <Legenda
      falas={[
        {
          de: 0,
          ate: 133,
          a: "A internet mudou o trava-língua dos ",
          k: "três tigres tristes",
          b: ".",
        },
        { de: 133, ate: 189, a: "E a culpa é do ", k: "Neymar", b: "." },
      ]}
    />
    <Rodape />
  </Cena>
);

const C2Coluna: React.FC = () => (
  <Cena>
    <Kicker texto="SEGUNDO UMA COLUNA" />
    <Titulo
      antes="Tudo começou com uma "
      marca="coluna."
      marcaIni={24}
      tam={88}
    />
    <ColunaJornal ini={8} />
    <Plaquinha
      nome="NEYMAR"
      icone={<Bola tam={100} />}
      foto="voxneymar/neymar.jpg"
      posicao="50% 15%"
      x={70}
      y={990}
      ini={88}
      rot={-5}
      cor={AZUL}
      semente={73}
    />
    <Plaquinha
      nome="VIRGINIA FONSECA"
      icone={<AroDeLuz tam={100} />}
      foto="voxneymar/virginia.jpg"
      posicao="50% 30%"
      x={610}
      y={980}
      ini={100}
      rot={5}
      cor={LARANJA}
      semente={79}
    />
    <NotaMao x={760} y={560} ini={211} tam={64} rot={8}>
      boato!
    </NotaMao>
    <Traco
      ini={211}
      d="M780 650 C 740 680, 720 720, 700 760"
      ponta="M690 732 L700 762 L726 744"
    />
    <Recorte x={820} y={760} ini={294} rot={-6} cor={LARANJA}>
      <div
        style={{
          background: "#f8f4ea",
          padding: 8,
          clipPath: rasgado(83, 12, 2),
        }}
      >
        <Bandeirada />
      </div>
    </Recorte>
    <Legenda
      falas={[
        {
          de: 0,
          ate: 88,
          a: "Tudo começou com uma ",
          k: "coluna do Metrópoles",
          b: ".",
        },
        {
          de: 88,
          ate: 211,
          a: "Segundo a colunista, o jogador e a influenciadora ",
          k: "Virginia Fonseca",
        },
        {
          de: 211,
          ate: 294,
          a: "teriam trocado ",
          k: "beijos",
          b: " numa festa reservada,",
        },
        {
          de: 294,
          ate: 370,
          a: "antes do GP de ",
          k: "Fórmula 1",
          b: " em São Paulo.",
        },
      ]}
    />
    <Rodape credito={CRED} />
  </Cena>
);

const C3Unfollow: React.FC = () => {
  const frame = useCurrentFrame();
  const sai = interpolate(emDois(frame), [150, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Cena>
      <Kicker texto="OS DOIS NEGARAM" />
      <Titulo antes="Os dois " marca="negaram." marcaIni={10} tam={96} />
      <div style={{ opacity: 1 - sai }}>
        <Plaquinha
          nome="VIRGINIA FONSECA"
          icone={<AroDeLuz tam={100} />}
      foto="voxneymar/virginia.jpg"
      posicao="50% 30%"
          x={80}
          y={640}
          ini={4}
          rot={-4}
          cor={LARANJA}
          semente={79}
        />
        <Plaquinha
          nome="NEYMAR"
          icone={<Bola tam={100} />}
      foto="voxneymar/neymar.jpg"
      posicao="50% 15%"
          x={600}
          y={660}
          ini={8}
          rot={5}
          cor={AZUL}
          semente={73}
        />
        <Carimbo texto="NEGOU" x={110} y={900} ini={42} rot={-10} tam={64} />
        <Carimbo texto="NEGOU" x={640} y={920} ini={100} rot={8} tam={64} />
      </div>
      {frame >= 150 ? <Celular ini={158} troca={215} /> : null}
      {frame >= 205 ? (
        <NotaMao x={90} y={1060} ini={220} tam={50} rot={-6}>
          domingo:
          <br />
          unfollow
        </NotaMao>
      ) : null}
      <Risadas ini={290} />
      <Legenda
        falas={[
          { de: 0, ate: 42, a: "Os dois ", k: "negaram", b: "." },
          {
            de: 42,
            ate: 100,
            a: "A equipe da Virginia ",
            k: "desmentiu",
            b: ",",
          },
          { de: 100, ate: 158, a: "e o Neymar ", k: "negou nas redes", b: "." },
          { de: 158, ate: 205, a: "Só que, no ", k: "domingo", b: "," },
          {
            de: 205,
            ate: 290,
            a: "ele ",
            k: "deixou de seguir",
            b: " a Virginia no Instagram.",
          },
          {
            de: 290,
            ate: 355,
            a: "E aí a internet ",
            k: "não perdoou",
            b: ".",
          },
        ]}
      />
      <Rodape credito={CRED} />
    </Cena>
  );
};

const C4Tigrinha: React.FC = () => {
  const frame = useCurrentFrame();
  const fase2 = emDois(frame) >= 238;
  return (
    <Cena>
      <Kicker texto="DE ONDE VEM O APELIDO" />
      {!fase2 ? (
        <>
          <Titulo
            antes="O apelido: "
            marca="tigrinha."
            marcaIni={150}
            tam={96}
          />
          <DocumentoCPI ini={8} />
          <Recorte x={700} y={640} ini={30} rot={10} cor={LARANJA}>
            <div
              style={{
                background: "#f8f4ea",
                padding: 10,
                clipPath: rasgado(91, 12, 2),
              }}
            >
              <Fichas />
            </div>
          </Recorte>
          <Plaquinha
            nome="VIRGINIA FONSECA"
            icone={<AroDeLuz tam={90} />}
            foto="voxneymar/virginia.jpg"
            posicao="50% 30%"
            x={330}
            y={860}
            ini={148}
            rot={-3}
            cor={LARANJA}
            semente={79}
          />
          <NotaMao x={150} y={1352} ini={160} tam={52} rot={-2}>
            "tigrinha", nas redes
          </NotaMao>
        </>
      ) : (
        <>
          <Titulo antes="Virou " marca="bordão." marcaIni={130} tam={96} />
          <Recorte x={90} y={600} ini={240} rot={-6} cor={LARANJA}>
            <div
              style={{
                background: "#f8f4ea",
                padding: 14,
                clipPath: rasgado(97, 12, 2),
              }}
            >
              <TigrinhoTriste tam={330} />
            </div>
          </Recorte>
          <Recorte x={560} y={760} ini={248} rot={6} cor={AZUL}>
            <div
              style={{
                background: "#f8f4ea",
                padding: 14,
                clipPath: rasgado(103, 12, 2),
              }}
            >
              <PratoDeTrigo tam={330} />
            </div>
          </Recorte>
          <NotaMao x={140} y={1040} ini={262} tam={58} rot={-4}>
            "um prato de trigo
            <br />
            pra uma tigrinha triste"
          </NotaMao>
          <Hashtags ini={367} />
        </>
      )}
      <Legenda
        falas={[
          {
            de: 0,
            ate: 148,
            a: "Por causa das propagandas de apostas, que levaram a Virginia até a ",
            k: "CPI das Bets",
            b: ",",
          },
          {
            de: 148,
            ate: 238,
            a: "ela ganhou nas redes o apelido de ",
            k: "tigrinha",
            b: ".",
          },
          {
            de: 238,
            ate: 367,
            a: "Pronto: virou ",
            k: "um prato de trigo para uma tigrinha triste",
            b: ".",
          },
          {
            de: 367,
            ate: 428,
            a: "Em poucas horas, era ",
            k: "bordão",
            b: ".",
          },
        ]}
      />
      <Rodape credito={CRED} />
    </Cena>
  );
};

const C5Mensagem: React.FC = () => {
  const frame = useCurrentFrame();
  const v = estalo(frame, 6, 8);
  return (
    <Cena>
      <Kicker texto="TERÇA-FEIRA" />
      <Titulo antes="A mensagem " marca="enigmática" marcaIni={20} tam={92} />
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 620,
          transform: `rotate(-3deg) scale(${v})`,
          filter: "drop-shadow(10px 12px 0 rgba(23,19,14,0.22))",
        }}
      >
        <div
          style={{
            width: 540,
            height: 720,
            borderRadius: 56,
            background: TINTA,
            padding: 22,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 38,
              background: KRAFT,
              padding: "70px 40px",
              boxSizing: "border-box",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 22,
                  marginTop: 22,
                  width: `${90 - (i % 3) * 18}%`,
                  background: "rgba(23,19,14,0.35)",
                  filter: "blur(2px)",
                }}
              />
            ))}
            <div
              style={{
                marginTop: 50,
                textAlign: "center",
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 200,
                color: TINTA,
                lineHeight: 1,
              }}
            >
              ?
            </div>
          </div>
        </div>
      </div>
      <NotaMao x={40} y={1180} ini={60} tam={46} rot={-6}>
        por que ficou
        <br />
        calada?
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 167,
            a: "Na terça, a Virginia postou uma ",
            k: "mensagem enigmática",
            b: ", explicando por que ficou calada.",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C6Final: React.FC = () => (
  <Cena>
    <Kicker texto="E VOCÊ?" />
    <Titulo antes="Boato ou " marca="verdade?" marcaIni={14} tam={110} />
    <Bilhete
      x={70}
      y={700}
      ini={8}
      texto="BOATO"
      cor={AZUL}
      rot={-6}
      semente={111}
      tam={110}
    />
    <Bilhete
      x={520}
      y={820}
      ini={14}
      texto="VERDADE"
      cor={LARANJA}
      rot={5}
      semente={121}
      tam={92}
    />
    <NotaMao x={330} y={1110} ini={59} tam={60} rot={-4}>
      comenta aí ↓
    </NotaMao>
    <TiraRasgada
      texto="SIGA @HISTORICODEBUSCA"
      x={90}
      y={1250}
      ini={87}
      rot={-3}
      tam={46}
    />
    <Legenda
      falas={[
        { de: 0, ate: 59, a: "Boato ou ", k: "verdade", b: "?" },
        { de: 59, ate: 87, a: "", k: "Comenta aí", b: "." },
        {
          de: 87,
          ate: 203,
          a: "E me siga para mais ",
          k: "buscas aleatórias",
          b: ".",
        },
      ]}
    />
    <Rodape />
  </Cena>
);

// ================= montagem =================
const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 189, el: <C1Gancho /> },
  { dur: 370, el: <C2Coluna /> },
  { dur: 355, el: <C3Unfollow /> },
  { dur: 428, el: <C4Tigrinha /> },
  { dur: 167, el: <C5Mensagem /> },
  { dur: 203, el: <C6Final /> },
];
export const DURACAO_NEYMAR = CENAS.reduce((s, c) => s + c.dur, 0);

const TrocaDeFolha: React.FC<{ cortes: number[] }> = ({ cortes }) => {
  const frame = useCurrentFrame();
  const c = cortes.find((t) => Math.abs(frame - t) <= 7);
  if (c === undefined) return null;
  const p = interpolate(emDois(frame - c), [-7, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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

export const VideoNeymarTigrinha: React.FC = () => {
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
      <Audio src={staticFile("voxneymar/mix_final.wav")} />
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};
