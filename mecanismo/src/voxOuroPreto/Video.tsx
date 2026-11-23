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
import { SANS } from "../fonts";
import {
  PAPEL,
  KRAFT,
  TINTA,
  AZUL,
  VERMELHO,
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

// "Por que Ouro Preto se chama Ouro Preto?" — @historicodebusca. Colagem de papel.
// Narração Nassif (64,6 s). Tempos tirados da transcrição (+0,3 s de atraso do áudio).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OURO = "#e8b923";
const OURO_ESC = "#a87a12";
const PRETO_PEDRA = "#2a2622";

const CRED_PANO = "Foto: Alvesgaspar · CC BY-SA 3.0 · Wikimedia Commons";
const CRED_PILAR = "Foto: Ricardo André Frantz · CC BY 3.0 · Wikimedia Commons";
const CRED_PRACA = "Foto: Heitornlmo · CC0 · Wikimedia Commons";

// recorte de foto com borda rasgada e contorno de adesivo
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
  cor = "#fff",
  semente = 11,
  posicao = "50% 50%",
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

// pepita desenhada: "ouro" vai de 0 (preta) a 1 (dourada)
const Pepita: React.FC<{ tam?: number; ouro?: number; brilho?: boolean }> = ({
  tam = 300,
  ouro = 0,
  brilho = false,
}) => {
  const forma =
    "M40 110 Q30 60 80 42 Q120 20 160 40 Q210 46 218 96 Q232 150 186 176 Q140 204 88 186 Q40 170 40 110 Z";
  return (
    <svg
      viewBox="0 0 260 220"
      width={tam}
      height={tam * 0.85}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={`pep-${tam}`}>
          <path d={forma} />
        </clipPath>
      </defs>
      <path
        d={forma}
        fill={PRETO_PEDRA}
        stroke={TINTA}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <g clipPath={`url(#pep-${tam})`}>
        <circle cx={130} cy={112} r={ouro * 130} fill={OURO} />
        <path
          d="M70 80 Q100 60 130 66"
          stroke="#fff6c8"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          opacity={ouro}
        />
        <circle cx={168} cy={140} r={10} fill={OURO_ESC} opacity={ouro} />
        <circle cx={96} cy={140} r={7} fill={OURO_ESC} opacity={ouro} />
        {/* manchas de ferrugem quando ainda é preta */}
        <circle cx={90} cy={90} r={14} fill="#5a3b24" opacity={1 - ouro} />
        <circle cx={170} cy={120} r={18} fill="#4a3020" opacity={1 - ouro} />
      </g>
      <path
        d={forma}
        fill="none"
        stroke={TINTA}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      {brilho ? (
        <g stroke={OURO} strokeWidth={8} strokeLinecap="round">
          <path d="M236 30 L236 62 M220 46 L252 46" />
          <path d="M20 180 L20 204 M8 192 L32 192" />
        </g>
      ) : null}
    </svg>
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

// ===== cena 1: o gancho =====
const C1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const balanca = Math.sin(emDois(frame) / 9) * 3;
  return (
    <Cena>
      <Kicker texto="HISTÓRICO DE BUSCA · CIDADES" />
      <Titulo
        antes="Ouro é "
        marca="amarelo,"
        depois=" né?"
        ini={2}
        marcaIni={14}
        tam={104}
      />
      <Adesivo x={90} y={690} ini={6} rot={-8 + balanca}>
        <Pepita tam={360} ouro={1} brilho />
      </Adesivo>
      <Adesivo x={560} y={760} ini={48} rot={7 - balanca}>
        <Pepita tam={360} ouro={0} />
      </Adesivo>
      <NotaMao x={900} y={640} ini={60} tam={130} rot={8}>
        ?
      </NotaMao>
      <TiraRasgada
        texto="OURO PRETO?"
        x={150}
        y={1220}
        ini={120}
        rot={-3}
        tam={70}
      />
      <Legenda
        falas={[
          { de: 0, ate: 48, a: "Ouro é ", k: "amarelo", b: ", né?" },
          {
            de: 48,
            ate: 194,
            a: "Então por que uma cidade se chama ",
            k: "Ouro Preto",
            b: "?",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 2: a busca =====
const C2Busca: React.FC = () => {
  const frame = useCurrentFrame();
  const termo = "ouro preto mg";
  const n = Math.floor(
    interpolate(emDois(frame), [6, 40], [0, termo.length], clamp),
  );
  return (
    <Cena>
      <Kicker texto="NO MEU HISTÓRICO DE BUSCA DE HOJE" />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 400,
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
        src="voxOuroPreto/panorama.jpg"
        w={960}
        h={620}
        x={60}
        y={640}
        ini={44}
        rot={2}
        semente={31}
      />
      <Carimbo
        texto="MINAS GERAIS"
        x={420}
        y={1170}
        ini={70}
        rot={-6}
        tam={50}
        cor={AZUL}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: 47,
            a: "No meu ",
            k: "histórico de busca",
            b: " de hoje:",
          },
          { de: 47, ate: 134, a: "", k: "Ouro Preto", b: ", em Minas Gerais." },
        ]}
      />
      <Rodape credito={CRED_PANO} />
    </Cena>
  );
};

// ===== cena 3: 1698, o ouro escuro =====
const C3Riacho: React.FC = () => {
  const frame = useCurrentFrame();
  const onda = emDois(frame) * 2;
  const sobe = interpolate(emDois(frame), [150, 190], [0, 1], clamp);
  return (
    <Cena>
      <Kicker texto="MINAS GERAIS · 1698" />
      <Titulo
        antes="O ouro saía da água "
        marca="escuro."
        marcaIni={170}
        tam={92}
      />
      {/* riacho em tiras de papel */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -60,
            top: 900 + i * 90,
            width: 1200,
            height: 70,
            background: i % 2 ? "#7cc6e6" : AZUL,
            clipPath: rasgado(60 + i, 30, 8),
            transform: `translateX(${((onda + i * 40) % 80) - 40}px) rotate(${i % 2 ? 1.5 : -1.5}deg)`,
            opacity: linear(frame, 4 + i * 4, 8),
          }}
        />
      ))}
      {/* bateia com a pepita escura subindo da água */}
      <Adesivo x={300} y={780 - sobe * 120} ini={40} rot={-4}>
        <svg viewBox="0 0 480 220" width={480} height={220}>
          <ellipse
            cx={240}
            cy={110}
            rx={226}
            ry={96}
            fill="#8a5a32"
            stroke={TINTA}
            strokeWidth={8}
          />
          <ellipse
            cx={240}
            cy={100}
            rx={170}
            ry={62}
            fill="#6d4426"
            stroke={TINTA}
            strokeWidth={5}
          />
        </svg>
        <div style={{ position: "absolute", left: 140, top: -30 }}>
          <Pepita tam={200} ouro={0} />
        </div>
      </Adesivo>
      <NotaMao x={90} y={1210} ini={210} tam={54} rot={-4}>
        óxido de ferro por cima ↑
      </NotaMao>
      <Carimbo
        texto="PEDRA SUJA?"
        x={520}
        y={1270}
        ini={304}
        rot={6}
        tam={52}
        cor={VERMELHO}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: 154,
            a: "Em 1698, uma expedição achou ",
            k: "ouro",
            b: " nos riachos da região.",
          },
          {
            de: 154,
            ate: 304,
            a: "Só que saía ",
            k: "escuro",
            b: ", coberto por óxido de ferro.",
          },
          { de: 304, ate: 370, a: "Parecia ", k: "pedra suja", b: "." },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 4: por baixo, era ouro =====
const C4Revela: React.FC = () => {
  const frame = useCurrentFrame();
  const ouro = interpolate(emDois(frame), [8, 40], [0, 1], clamp);
  return (
    <Cena>
      <Kicker texto="RASPANDO A CASCA" />
      <Titulo antes="Por baixo, era " marca="ouro." marcaIni={28} tam={110} />
      <Adesivo x={190} y={700} ini={0} rot={-5}>
        <Pepita tam={700} ouro={ouro} brilho={ouro > 0.9} />
      </Adesivo>
      <TiraRasgada
        texto="MUITO OURO"
        x={250}
        y={1260}
        ini={50}
        rot={-4}
        tam={68}
        fundo={OURO}
        cor={TINTA}
      />
      <Legenda
        falas={[
          { de: 0, ate: 46, a: "Por baixo, era ", k: "ouro", b: "." },
          { de: 46, ate: 115, a: "E era ", k: "muito ouro", b: "." },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== cena 5: a igreja dos 400 kg =====
const C5Pilar: React.FC = () => {
  const frame = useCurrentFrame();
  const kg =
    Math.round(interpolate(emDois(frame), [60, 130], [0, 400], clamp) / 10) *
    10;
  return (
    <Cena>
      <Kicker texto="MATRIZ DE NOSSA SENHORA DO PILAR" />
      <Foto
        src="voxOuroPreto/pilar_nave.jpg"
        w={960}
        h={720}
        x={60}
        y={420}
        ini={0}
        rot={-2}
        cor={OURO}
        semente={41}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1110,
          transform: `rotate(-4deg) scale(${estalo(frame, 56, 8)})`,
          filter: adesivo("#fff", 7),
        }}
      >
        <div
          style={{
            background: OURO,
            clipPath: rasgado(77, 16, 2),
            padding: "18px 44px 22px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            color: TINTA,
            letterSpacing: "-0.02em",
          }}
        >
          ~{kg} kg
        </div>
      </div>
      <NotaMao x={600} y={1250} ini={100} tam={50} rot={4} cor={TINTA}>
        de ouro nos altares
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 164,
            a: "A Matriz do Pilar tem uns ",
            k: "400 quilos de ouro",
            b: " nos altares.",
          },
        ]}
      />
      <Rodape credito={CRED_PILAR} />
    </Cena>
  );
};

// gaiola vazia desenhada (sem nada dentro, sem violência)
const Gaiola: React.FC<{ tam?: number }> = ({ tam = 300 }) => (
  <svg viewBox="0 0 200 260" width={tam} height={tam * 1.3}>
    <line x1={100} y1={0} x2={100} y2={30} stroke={TINTA} strokeWidth={6} />
    <circle
      cx={100}
      cy={36}
      r={10}
      fill="none"
      stroke={TINTA}
      strokeWidth={6}
    />
    <path
      d="M30 100 Q100 20 170 100"
      fill="none"
      stroke={TINTA}
      strokeWidth={7}
    />
    {[30, 58, 86, 114, 142, 170].map((x) => (
      <line
        key={x}
        x1={x}
        y1={100}
        x2={x}
        y2={240}
        stroke={TINTA}
        strokeWidth={6}
      />
    ))}
    <rect x={20} y={236} width={160} height={14} fill={TINTA} />
    <rect x={24} y={96} width={152} height={8} fill={TINTA} />
  </svg>
);

// ===== cena 6: o lado sombrio =====
const C6Sombrio: React.FC = () => {
  const frame = useCurrentFrame();
  const escuro = linear(frame, 0, 20);
  return (
    <Cena>
      <AbsoluteFill style={{ background: `rgba(23,19,14,${0.55 * escuro})` }} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 322,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: "0.16em",
          color: PAPEL,
        }}
      >
        O LADO SOMBRIO
      </div>
      <Foto
        src="voxOuroPreto/praca.jpg"
        w={760}
        h={900}
        x={160}
        y={400}
        ini={40}
        rot={3}
        semente={53}
        posicao="50% 60%"
        filtro="grayscale(1) contrast(1.15) brightness(0.85)"
      />
      <Carimbo
        texto="1792"
        x={90}
        y={420}
        ini={87}
        rot={-10}
        tam={80}
        cor={VERMELHO}
      />
      <Adesivo x={620} y={760} ini={202} rot={6}>
        <div style={{ background: PAPEL, padding: 16 }}>
          <Gaiola tam={240} />
        </div>
      </Adesivo>
      <NotaMao x={560} y={330} ini={210} tam={48} rot={-3} cor={OURO}>
        exposta na praça ↓
      </NotaMao>
      <TiraRasgada
        texto="ROUBADA"
        x={300}
        y={1260}
        ini={305}
        rot={-5}
        tam={74}
        fundo={VERMELHO}
        cor={PAPEL}
      />
      <NotaMao x={820} y={1040} ini={384} tam={170} rot={10} cor={OURO}>
        ?
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: 87,
            a: "Só que essa riqueza teve um ",
            k: "lado sombrio",
            b: ".",
          },
          {
            de: 87,
            ate: 202,
            a: "Em 1792, depois da ",
            k: "execução de Tiradentes",
            b: ",",
          },
          {
            de: 202,
            ate: 305,
            a: "a cabeça dele foi ",
            k: "exposta na praça",
            b: " da cidade.",
          },
          {
            de: 305,
            ate: 384,
            a: "Pouco tempo depois, alguém ",
            k: "roubou",
            b: ".",
          },
          { de: 384, ate: 456, a: "E ela ", k: "nunca mais apareceu", b: "." },
        ]}
      />
      <Rodape credito={CRED_PRACA} />
    </Cena>
  );
};

// ===== cena 7: UNESCO =====
const C7Unesco: React.FC = () => (
  <Cena>
    <Kicker texto="1980" />
    <Titulo
      antes="O primeiro do Brasil na lista da "
      marca="UNESCO."
      marcaIni={110}
      tam={86}
    />
    <Foto
      src="voxOuroPreto/panorama.jpg"
      w={960}
      h={620}
      x={60}
      y={680}
      ini={0}
      rot={-2}
      semente={61}
      posicao="40% 50%"
    />
    <Carimbo
      texto="PATRIMÔNIO MUNDIAL"
      x={150}
      y={1150}
      ini={40}
      rot={-7}
      tam={56}
      cor={VERMELHO}
    />
    <TiraRasgada
      texto="1º DO BRASIL"
      x={330}
      y={1290}
      ini={90}
      rot={3}
      tam={56}
      fundo={OURO}
      cor={TINTA}
    />
    <Legenda
      falas={[
        {
          de: 0,
          ate: 106,
          a: "Em 1980, Ouro Preto virou o ",
          k: "primeiro do Brasil",
          b: "",
        },
        {
          de: 106,
          ate: 208,
          a: "na lista de ",
          k: "Patrimônio Mundial",
          b: " da UNESCO.",
        },
      ]}
    />
    <Rodape credito={CRED_PANO} />
  </Cena>
);

// ===== cena 8: fecho =====
const C8Final: React.FC = () => {
  const frame = useCurrentFrame();
  const ouro = interpolate(emDois(frame), [78, 110], [0, 1], clamp);
  return (
    <Cena>
      <Kicker texto="OU SEJA" />
      <Titulo
        antes="O ouro saía preto, mas a cidade virou "
        marca="ouro pra história."
        marcaIni={90}
        tam={84}
      />
      <Adesivo x={330} y={760} ini={6} rot={-6}>
        <Pepita tam={420} ouro={ouro} brilho={ouro > 0.9} />
      </Adesivo>
      <NotaMao x={300} y={1140} ini={160} tam={60} rot={-4}>
        já foi lá? comenta ↓
      </NotaMao>
      <TiraRasgada
        texto="SIGA @HISTORICODEBUSCA"
        x={90}
        y={1260}
        ini={243}
        rot={-3}
        tam={46}
      />
      <Legenda
        falas={[
          { de: 0, ate: 78, a: "Ou seja: o ouro ", k: "saía preto", b: "," },
          {
            de: 78,
            ate: 160,
            a: "mas a cidade virou ",
            k: "ouro pra história",
            b: ".",
          },
          {
            de: 160,
            ate: 243,
            a: "Você já foi a Ouro Preto? ",
            k: "Comenta aí",
            b: ".",
          },
          {
            de: 243,
            ate: 319,
            a: "E me siga para mais ",
            k: "buscas aleatórias",
            b: ".",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// ===== montagem =====
const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 194, el: <C1Gancho /> },
  { dur: 134, el: <C2Busca /> },
  { dur: 370, el: <C3Riacho /> },
  { dur: 115, el: <C4Revela /> },
  { dur: 164, el: <C5Pilar /> },
  { dur: 456, el: <C6Sombrio /> },
  { dur: 208, el: <C7Unesco /> },
  { dur: 319, el: <C8Final /> },
];
export const DURACAO_OURO_PRETO = CENAS.reduce((s, c) => s + c.dur, 0);

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

export const VideoOuroPreto: React.FC<{ semAudio?: boolean }> = ({
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
        <Audio src={staticFile("voxOuroPreto/mix_final.wav")} />
      )}
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};

// capa: pepita preta virando ouro + pergunta
export const CapaOuroPreto: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA · CIDADES" />
    <Titulo
      antes="Por que se chama "
      marca="Ouro Preto?"
      ini={-20}
      marcaIni={-20}
      tam={112}
    />
    <Adesivo x={110} y={820} ini={-20} rot={-8}>
      <Pepita tam={400} ouro={1} brilho />
    </Adesivo>
    <Adesivo x={540} y={900} ini={-20} rot={7}>
      <Pepita tam={400} ouro={0} />
    </Adesivo>
    <Rodape />
  </Cena>
);
