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

// "Trabuco na Fazenda" — @historicodebusca. Colagem de papel com fotos reais
// de licença livre (Wikimedia Commons, créditos em public/trabuco/creditos.txt).
// Narração Nassif (66,2 s). Tempos da transcrição (+0,3 s de atraso do áudio).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#2f9e57";
const AMARELO = "#ffd23f";

const tf = (t: number) => Math.round((t + 0.3) * 30);
const INI = [0, 129, 327, 475, 620, 861, 1100, 1331, 1486, 1644, 1822, 2050];
const rel = (k: number) => (t: number) => tf(t) - INI[k];

// ---------- peças ----------

// foto colorida com borda rasgada, contorno de adesivo e zoom lento
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
  sai?: number;
}> = ({
  src,
  w,
  h,
  x,
  y,
  ini,
  rot = -3,
  cor = PAPEL,
  semente = 11,
  posicao = "50% 30%",
  sai,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  if (frame < ini) return null;
  const s = sai !== undefined ? 1 - linear(frame, sai, 6) : 1;
  const zoom = 1.04 + Math.max(0, emDois(frame) - ini) * 0.0009;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v * s})`,
        transformOrigin: "50% 80%",
        filter: adesivo(cor, 9),
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
            transform: `scale(${zoom})`,
            filter: "saturate(1.15) contrast(1.08)",
          }}
        />
      </div>
    </div>
  );
};

// etiqueta colada
const Etiqueta: React.FC<{
  texto: string;
  x: number;
  y: number;
  ini: number;
  fundo?: string;
  cor?: string;
  tam?: number;
  rot?: number;
}> = ({
  texto,
  x,
  y,
  ini,
  fundo = AMARELO,
  cor = TINTA,
  tam = 46,
  rot = -3,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  if (frame < ini) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        transformOrigin: "left center",
        background: fundo,
        color: cor,
        border: `5px solid ${TINTA}`,
        boxShadow: `7px 7px 0 ${TINTA}`,
        padding: "10px 24px 12px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: tam,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// número enorme em serifa
const Numerao: React.FC<{
  texto: string;
  sub?: string;
  x: number;
  y: number;
  ini: number;
  cor?: string;
  tam?: number;
}> = ({ texto, sub, x, y, ini, cor = TINTA, tam = 300 }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  if (frame < ini) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${v}) rotate(-4deg)`,
        transformOrigin: "left top",
        fontFamily: SERIF,
        fontWeight: 700,
        color: cor,
        lineHeight: 0.85,
      }}
    >
      <div style={{ fontSize: tam, letterSpacing: "-0.04em" }}>{texto}</div>
      {sub ? (
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: tam * 0.2,
            letterSpacing: "0.12em",
            marginTop: 10,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// pedra arremessada pela catapulta
const Pedra: React.FC<{ ini: number; dur?: number; rotulo?: string }> = ({
  ini,
  dur = 34,
  rotulo,
}) => {
  const frame = useCurrentFrame();
  const p = linear(frame, ini, dur);
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [260, 1180]);
  const y = 820 - Math.sin(p * Math.PI) * 520 + p * 120;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 60,
        top: y - 60,
        transform: `rotate(${p * 720}deg)`,
      }}
    >
      <svg width={120} height={120} viewBox="0 0 120 120">
        <path
          d="M20 60 L35 22 L78 14 L106 44 L100 88 L60 106 L22 92 Z"
          fill="#9a8f80"
          stroke={TINTA}
          strokeWidth={6}
        />
        {rotulo ? (
          <text
            x={60}
            y={68}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={18}
            fill={TINTA}
          >
            {rotulo}
          </text>
        ) : null}
      </svg>
    </div>
  );
};

// papéis voando (papelada)
const Papelada: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  if (frame < ini) return null;
  const f = emDois(frame) - ini;
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const x = 90 + ((i * 157) % 860);
        const y = -160 + f * (7 + (i % 3) * 2) - i * 40;
        if (y > 1500) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin((f + i * 9) / 9) * 40,
              top: y,
              width: 130,
              height: 170,
              background: "#fbf8f1",
              border: `4px solid ${TINTA}`,
              transform: `rotate(${(i % 2 ? 1 : -1) * (12 + f * 1.4)}deg)`,
              boxShadow: "5px 5px 0 rgba(23,19,14,0.25)",
            }}
          >
            {[0, 1, 2, 3].map((l) => (
              <div
                key={l}
                style={{
                  margin: "18px 14px 0",
                  height: 6,
                  background: "rgba(23,19,14,0.35)",
                }}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};

// escada da carreira 1969 → 2009
const EscadaCarreira: React.FC<{ ini: number; topo: number }> = ({
  ini,
  topo,
}) => {
  const frame = useCurrentFrame();
  const v = linear(frame, ini, 10);
  const p = interpolate(emDois(frame), [ini, topo], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const degraus = 6;
  return (
    <div style={{ position: "absolute", left: 70, top: 640, opacity: v }}>
      <svg width={940} height={760} viewBox="0 0 940 760">
        {Array.from({ length: degraus }, (_, i) => (
          <rect
            key={i}
            x={i * 140}
            y={640 - i * 110}
            width={940 - i * 140}
            height={120}
            fill={i % 2 ? KRAFT : "#d9ccb0"}
            stroke={TINTA}
            strokeWidth={6}
          />
        ))}
        <text
          x={20}
          y={700}
          fontFamily={SANS}
          fontWeight={900}
          fontSize={52}
          fill={TINTA}
        >
          1969
        </text>
        <text
          x={720}
          y={150}
          fontFamily={SANS}
          fontWeight={900}
          fontSize={52}
          fill={VERMELHO}
        >
          2009
        </text>
        <circle
          cx={70 + p * 700}
          cy={610 - p * 550}
          r={30}
          fill={LARANJA}
          stroke={TINTA}
          strokeWidth={6}
        />
      </svg>
    </div>
  );
};

// diploma enrolado
const Diploma: React.FC<{ x: number; y: number; ini: number }> = ({
  x,
  y,
  ini,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  if (frame < ini) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(4deg) scale(${v})`,
        transformOrigin: "50% 50%",
      }}
    >
      <svg width={520} height={360} viewBox="0 0 520 360">
        <rect
          x={40}
          y={30}
          width={440}
          height={300}
          fill="#fbf3dc"
          stroke={TINTA}
          strokeWidth={7}
        />
        <rect
          x={10}
          y={20}
          width={44}
          height={320}
          rx={22}
          fill="#eadbb3"
          stroke={TINTA}
          strokeWidth={6}
        />
        <rect
          x={466}
          y={20}
          width={44}
          height={320}
          rx={22}
          fill="#eadbb3"
          stroke={TINTA}
          strokeWidth={6}
        />
        <text
          x={260}
          y={110}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={800}
          fontSize={30}
          fill={TINTA}
          letterSpacing={4}
        >
          DIPLOMA
        </text>
        <text
          x={260}
          y={190}
          textAnchor="middle"
          fontFamily={SERIF}
          fontWeight={700}
          fontStyle="italic"
          fontSize={66}
          fill={TINTA}
        >
          Filosofia
        </text>
        <line
          x1={150}
          y1={250}
          x2={370}
          y2={250}
          stroke={TINTA}
          strokeWidth={4}
        />
        <circle
          cx={400}
          cy={280}
          r={34}
          fill={VERMELHO}
          stroke={TINTA}
          strokeWidth={5}
        />
      </svg>
    </div>
  );
};

// telefone antigo tocando
const Telefone: React.FC<{
  x: number;
  y: number;
  ini: number;
  ate?: number;
}> = ({ x, y, ini, ate = 99999 }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 8);
  if (frame < ini) return null;
  const toca = frame < ate;
  const tremor = toca ? Math.sin(emDois(frame) * 1.3) * 8 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${v}) rotate(${tremor}deg)`,
        transformOrigin: "50% 90%",
      }}
    >
      <svg
        width={300}
        height={300}
        viewBox="0 0 300 300"
        style={{ overflow: "visible" }}
      >
        <path
          d="M60 140 L240 140 L270 270 L30 270 Z"
          fill={VERMELHO}
          stroke={TINTA}
          strokeWidth={7}
        />
        <circle
          cx={150}
          cy={205}
          r={42}
          fill={PAPEL}
          stroke={TINTA}
          strokeWidth={6}
        />
        <circle cx={150} cy={205} r={12} fill={TINTA} />
        <path
          d="M30 110 Q30 60 80 60 L220 60 Q270 60 270 110 L240 125 L215 100 L85 100 L60 125 Z"
          fill={VERMELHO}
          stroke={TINTA}
          strokeWidth={7}
          transform={toca ? `translate(0 ${-Math.abs(tremor)})` : undefined}
        />
        {toca ? (
          <text
            x={150}
            y={20}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={44}
            fill={TINTA}
          >
            TRIM!
          </text>
        ) : null}
      </svg>
    </div>
  );
};

// gráfico subindo
const Grafico: React.FC<{ ini: number; dur: number }> = ({ ini, dur }) => {
  const frame = useCurrentFrame();
  if (frame < ini) return null;
  const p = linear(frame, ini, dur);
  const comp = 1400;
  return (
    <div style={{ position: "absolute", left: 90, top: 700 }}>
      <svg
        width={900}
        height={520}
        viewBox="0 0 900 520"
        style={{ overflow: "visible" }}
      >
        <polyline
          points="0,440 150,400 260,420 380,330 500,350 640,200 780,120 880,40"
          fill="none"
          stroke={TINTA}
          strokeWidth={34}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={comp}
          strokeDashoffset={comp * (1 - p)}
        />
        <polyline
          points="0,440 150,400 260,420 380,330 500,350 640,200 780,120 880,40"
          fill="none"
          stroke={VERDE}
          strokeWidth={20}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={comp}
          strokeDashoffset={comp * (1 - p)}
        />
        {p > 0.95 ? (
          <path
            d="M840 20 L900 30 L870 85 Z"
            fill={VERDE}
            stroke={TINTA}
            strokeWidth={6}
          />
        ) : null}
      </svg>
    </div>
  );
};

// balança pendendo
const Balanca: React.FC<{ ini: number; pende: number }> = ({ ini, pende }) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 10);
  if (frame < ini) return null;
  const a = interpolate(emDois(frame), [pende, pende + 14], [0, -12], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  const rad = (a * Math.PI) / 180;
  const dy = Math.sin(rad) * 300;
  const prato = (cx: number, cy: number, txt: string, cor: string) => (
    <g>
      <line
        x1={cx}
        y1={cy}
        x2={cx - 110}
        y2={cy + 170}
        stroke={TINTA}
        strokeWidth={4}
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx + 110}
        y2={cy + 170}
        stroke={TINTA}
        strokeWidth={4}
      />
      <path
        d={`M${cx - 140} ${cy + 170} L${cx + 140} ${cy + 170} Q${cx} ${cy + 250} ${cx - 140} ${cy + 170} Z`}
        fill={cor}
        stroke={TINTA}
        strokeWidth={6}
      />
      <text
        x={cx}
        y={cy + 245}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={34}
        fill={TINTA}
      >
        {txt}
      </text>
    </g>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 640,
        transform: `scale(${v})`,
        transformOrigin: "50% 100%",
      }}
    >
      <svg
        width={1000}
        height={700}
        viewBox="0 0 1000 700"
        style={{ overflow: "visible" }}
      >
        <rect
          x={470}
          y={120}
          width={60}
          height={500}
          fill={KRAFT}
          stroke={TINTA}
          strokeWidth={6}
        />
        <rect
          x={340}
          y={600}
          width={320}
          height={50}
          fill={KRAFT}
          stroke={TINTA}
          strokeWidth={6}
        />
        <g transform={`rotate(${a} 500 120)`}>
          <rect x={180} y={105} width={640} height={30} fill={TINTA} />
        </g>
        <circle
          cx={500}
          cy={120}
          r={26}
          fill={AMARELO}
          stroke={TINTA}
          strokeWidth={6}
        />
        {prato(200, 120 - dy * 1.07, "BANQUEIRO", AMARELO)}
        {prato(800, 120 + dy * 1.07, "BANCOS", AZUL)}
      </svg>
    </div>
  );
};

// reticências pensando
const Pensando: React.FC<{
  x: number;
  y: number;
  ini: number;
  ate: number;
}> = ({ x, y, ini, ate }) => {
  const frame = useCurrentFrame();
  if (frame < ini || frame >= ate) return null;
  const f = emDois(frame) - ini;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <svg width={300} height={190} viewBox="0 0 300 190">
        <ellipse
          cx={150}
          cy={80}
          rx={140}
          ry={74}
          fill={PAPEL}
          stroke={TINTA}
          strokeWidth={6}
        />
        <circle
          cx={70}
          cy={168}
          r={14}
          fill={PAPEL}
          stroke={TINTA}
          strokeWidth={5}
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={95 + i * 55}
            cy={80}
            r={16}
            fill={TINTA}
            opacity={Math.floor(f / 8) % 4 > i ? 1 : 0.2}
          />
        ))}
      </svg>
    </div>
  );
};

// ---------- cenas ----------

const C1Gancho: React.FC = () => {
  const o = rel(0);
  return (
    <Cena>
      <Kicker texto="HISTÓRICO DE BUSCA · NOVO MINISTRO" />
      <Titulo
        antes="Um "
        marca="Trabuco"
        depois=" no comando do dinheiro"
        marcaIni={o(1.74)}
        tam={88}
      />
      <Foto
        src="trabuco/fazenda.jpg"
        w={420}
        h={560}
        x={580}
        y={700}
        ini={2}
        rot={4}
        posicao="0% 40%"
        semente={4}
      />
      <Foto
        src="trabuco/trabuco.jpg"
        w={470}
        h={620}
        x={90}
        y={660}
        ini={o(1.74)}
        rot={-4}
        cor={AMARELO}
      />
      <Etiqueta
        texto="R$"
        x={760}
        y={1180}
        ini={o(3.16)}
        fundo={VERDE}
        cor={PAPEL}
        tam={70}
        rot={8}
      />
      <Etiqueta
        texto="MINISTÉRIO DA FAZENDA"
        x={420}
        y={1300}
        ini={o(2.5)}
        tam={34}
        rot={-2}
      />
      <Legenda
        falas={[
          { de: 0, ate: o(1.74), a: "O Brasil acabou de colocar" },
          {
            de: o(1.74),
            ate: 200,
            a: "um ",
            k: "Trabuco",
            b: " no comando do dinheiro.",
          },
        ]}
      />
      <Rodape credito="Fotos: Bradesco (CC BY-SA 3.0) · M. Camargo/Agência Brasil (CC BY 2.0)" />
    </Cena>
  );
};

const C2Catapulta: React.FC = () => {
  const o = rel(1);
  const frame = useCurrentFrame();
  return (
    <Cena>
      <Kicker texto="CALMA" />
      <Titulo antes="Não é a " marca="catapulta" marcaIni={o(4.96)} tam={96} />
      <Foto
        src="trabuco/catapulta.jpg"
        w={900}
        h={600}
        x={90}
        y={640}
        ini={0}
        rot={-2}
        posicao="60% 50%"
        semente={7}
        sai={o(6.3)}
      />
      <Pedra ini={o(5.0)} dur={30} />
      {frame < o(6.38) ? (
        <Carimbo
          texto="NÃO É ESSE!"
          x={240}
          y={1100}
          ini={o(5.52)}
          rot={-10}
          tam={70}
        />
      ) : null}
      <Foto
        src="trabuco/trabuco.jpg"
        w={440}
        h={580}
        x={110}
        y={650}
        ini={o(6.38)}
        rot={-4}
        cor={AMARELO}
      />
      <TiraRasgada
        texto="LUIZ CARLOS"
        x={520}
        y={780}
        ini={o(6.52)}
        rot={-4}
        tam={50}
      />
      <TiraRasgada
        texto="TRABUCO"
        x={560}
        y={900}
        ini={o(7.3)}
        rot={3}
        tam={66}
        fundo={VERMELHO}
      />
      <NotaMao x={570} y={1070} ini={o(9.1)} tam={64} rot={-6}>
        parece filme!
      </NotaMao>
      <Legenda
        falas={[
          {
            de: 0,
            ate: o(6.38),
            a: "Não, não é a ",
            k: "catapulta medieval",
            b: ".",
          },
          {
            de: o(6.38),
            ate: o(8.32),
            a: "É ",
            k: "Luiz Carlos Trabuco",
            b: ".",
          },
          {
            de: o(8.32),
            ate: 400,
            a: "E a história dele ",
            k: "parece filme",
            b: ".",
          },
        ]}
      />
      <Rodape credito="Fotos: Wikimedia Commons (CC BY-SA 3.0) · Bradesco (CC BY-SA 3.0)" />
    </Cena>
  );
};

const C3Escriturario: React.FC = () => {
  const o = rel(2);
  return (
    <Cena>
      <Kicker texto="1969 · O COMEÇO" />
      <Titulo
        antes="Escriturário "
        marca="aos 17"
        marcaIni={o(10.78)}
        tam={92}
      />
      <Numerao
        texto="17"
        sub="ANOS"
        x={70}
        y={640}
        ini={o(10.78)}
        cor={VERMELHO}
        tam={320}
      />
      <Foto
        src="trabuco/agencia.jpg"
        w={560}
        h={360}
        x={450}
        y={640}
        ini={o(12.36)}
        rot={3}
        semente={9}
        posicao="40% 50%"
      />
      <Foto
        src="trabuco/carimbo.jpg"
        w={400}
        h={300}
        x={110}
        y={1030}
        ini={o(13.14)}
        rot={-5}
        cor={AMARELO}
        semente={3}
      />
      <Etiqueta
        texto="ESCRITURÁRIO"
        x={540}
        y={1080}
        ini={o(13.14)}
        tam={48}
        rot={-3}
      />
      <Papelada ini={o(14.2)} />
      <Legenda
        falas={[
          { de: 0, ate: o(11.98), a: "Aos ", k: "17 anos", b: "," },
          {
            de: o(11.98),
            ate: o(14.08),
            a: "ele entra num banco como ",
            k: "escriturário",
            b: ",",
          },
          { de: o(14.08), ate: 300, a: "mexendo com ", k: "papelada", b: "." },
        ]}
      />
      <Rodape credito="Fotos: Alessandro Sil (CC BY-SA 4.0) · Museu Paulista da USP (CC BY-SA 4.0)" />
    </Cena>
  );
};

const C4Presidente: React.FC = () => {
  const o = rel(3);
  return (
    <Cena>
      <Kicker texto="DEGRAU POR DEGRAU" />
      <Titulo antes="40 anos " marca="depois…" marcaIni={o(15.9)} tam={100} />
      <EscadaCarreira ini={0} topo={o(17.3)} />
      <Foto
        src="trabuco/trabuco.jpg"
        w={300}
        h={390}
        x={680}
        y={560}
        ini={o(17.46)}
        rot={5}
        cor={AMARELO}
        semente={5}
      />
      <TiraRasgada
        texto="PRESIDENTE"
        x={300}
        y={980}
        ini={o(17.46)}
        rot={-4}
        tam={64}
        fundo={VERMELHO}
      />
      <TiraRasgada
        texto="DO BRADESCO"
        x={360}
        y={1100}
        ini={o(19.38)}
        rot={2}
        tam={58}
      />
      <Legenda
        falas={[
          { de: 0, ate: o(17.1), a: "", k: "Quarenta anos", b: " depois…" },
          {
            de: o(17.1),
            ate: o(19.26),
            a: "ele é o ",
            k: "presidente",
            b: " desse banco.",
          },
          { de: o(19.26), ate: 300, a: "O ", k: "Bradesco", b: "." },
        ]}
      />
      <Rodape credito="Foto: Bradesco (CC BY-SA 3.0) · Wikimedia Commons" />
    </Cena>
  );
};

const C5Filosofo: React.FC = () => {
  const o = rel(4);
  const frame = useCurrentFrame();
  const risco = linear(frame, o(21.94), 8);
  return (
    <Cena>
      <Kicker texto="O DETALHE" />
      <Titulo
        antes="O banqueiro "
        marca="filósofo"
        marcaIni={o(23.56)}
        tam={100}
      />
      {frame >= o(21.26) ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 660,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 74,
            color: TINTA,
            transform: "rotate(-3deg)",
            opacity: estalo(frame, o(21.26), 8),
          }}
        >
          ECONOMISTA
          <div
            style={{
              position: "absolute",
              left: -10,
              top: 38,
              height: 14,
              width: `${risco * 104}%`,
              background: VERMELHO,
            }}
          />
        </div>
      ) : null}
      <Diploma x={60} y={820} ini={o(23.56)} />
      <Foto
        src="trabuco/trabuco.jpg"
        w={360}
        h={470}
        x={630}
        y={760}
        ini={o(24.98)}
        rot={5}
        cor={AMARELO}
        semente={8}
      />
      <TiraRasgada
        texto="“O FILÓSOFO”"
        x={440}
        y={1260}
        ini={o(26.94)}
        rot={-3}
        tam={60}
        fundo={AZUL}
        cor={TINTA}
      />
      <Legenda
        falas={[
          { de: 0, ate: o(21.26), a: "E o ", k: "detalhe", b: ":" },
          {
            de: o(21.26),
            ate: o(22.92),
            a: "ele ",
            k: "não é economista",
            b: ".",
          },
          {
            de: o(22.92),
            ate: o(24.98),
            a: "É formado em ",
            k: "Filosofia",
            b: ".",
          },
          {
            de: o(24.98),
            ate: 300,
            a: "No mercado, chamam ele de ",
            k: "“o filósofo”",
            b: ".",
          },
        ]}
      />
      <Rodape credito="Foto: Bradesco (CC BY-SA 3.0) · Wikimedia Commons" />
    </Cena>
  );
};

const C6Dilma: React.FC = () => {
  const o = rel(5);
  return (
    <Cena>
      <Kicker texto="A REVIRAVOLTA" />
      <Titulo antes="Ele já disse " marca="não" marcaIni={o(35.54)} tam={100} />
      <TiraRasgada
        texto="2014"
        x={620}
        y={600}
        ini={o(30.88)}
        rot={4}
        tam={90}
        fundo={VERMELHO}
      />
      <Foto
        src="trabuco/dilma.jpg"
        w={440}
        h={580}
        x={80}
        y={660}
        ini={o(32.16)}
        rot={-4}
        cor={AMARELO}
        posicao="50% 25%"
      />
      <Telefone x={620} y={790} ini={o(32.52)} ate={o(35.12)} />
      <Etiqueta
        texto="MINISTRO DA FAZENDA?"
        x={520}
        y={1170}
        ini={o(33.4)}
        tam={38}
        rot={-2}
      />
      <Carimbo
        texto="NÃO"
        x={580}
        y={880}
        ini={o(35.54)}
        rot={-12}
        tam={130}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: o(30.68),
            a: "Só que tem uma ",
            k: "reviravolta",
            b: ".",
          },
          {
            de: o(30.68),
            ate: o(33.02),
            a: "Em ",
            k: "2014",
            b: ", a Dilma chamou ele",
          },
          {
            de: o(33.02),
            ate: o(35.12),
            a: "para ser ",
            k: "ministro da Fazenda",
            b: ".",
          },
          { de: o(35.12), ate: 300, a: "E ele disse ", k: "não", b: "." },
        ]}
      />
      <Rodape credito="Foto: Roberto Stuckert Filho/PR (CC BY 3.0 BR) · Wikimedia Commons" />
    </Cena>
  );
};

const C7Lula: React.FC = () => {
  const o = rel(6);
  return (
    <Cena>
      <Kicker texto="26 DE NOVEMBRO DE 2026" />
      <Titulo
        antes="12 anos depois, "
        marca="o convite volta"
        marcaIni={o(37.8)}
        tam={84}
      />
      <Foto
        src="trabuco/alvorada.jpg"
        w={520}
        h={330}
        x={480}
        y={630}
        ini={0}
        rot={3}
        semente={6}
        posicao="50% 60%"
      />
      <Telefone x={640} y={950} ini={o(37.68)} ate={o(39.1)} />
      <Foto
        src="trabuco/lula.jpg"
        w={440}
        h={560}
        x={80}
        y={700}
        ini={o(39.9)}
        rot={-4}
        cor={AMARELO}
        posicao="50% 20%"
      />
      <Foto
        src="trabuco/trabuco.jpg"
        w={300}
        h={390}
        x={680}
        y={900}
        ini={o(40.74)}
        rot={4}
        cor={AMARELO}
        semente={2}
      />
      <Pensando x={640} y={700} ini={o(41.26)} ate={o(43.08)} />
      <Carimbo
        texto="SIM"
        x={560}
        y={1150}
        ini={o(43.24)}
        rot={-8}
        tam={120}
        cor={VERDE}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: o(39.12),
            a: "Doze anos depois, ",
            k: "o convite volta",
            b: ".",
          },
          { de: o(39.12), ate: o(40.74), a: "Agora é o ", k: "Lula", b: "." },
          {
            de: o(40.74),
            ate: o(43.08),
            a: "Ele pede uns dias ",
            k: "para pensar",
            b: "…",
          },
          { de: o(43.08), ate: 300, a: "e diz ", k: "sim", b: "." },
        ]}
      />
      <Rodape credito="Fotos: Ricardo Stuckert/PR (CC BY 2.0) · Arne Müseler (CC BY-SA 3.0 DE) · Bradesco" />
    </Cena>
  );
};

const C8Bolsa: React.FC = () => {
  const o = rel(7);
  return (
    <Cena>
      <Kicker texto="O EFEITO TRABUCO" />
      <Titulo
        antes="A Bolsa foi "
        marca="arremessada"
        marcaIni={o(46.44)}
        tam={92}
      />
      <Foto
        src="trabuco/bolsa.jpg"
        w={920}
        h={560}
        x={80}
        y={650}
        ini={0}
        rot={-2}
        semente={12}
        posicao="50% 50%"
      />
      <Grafico ini={o(46.08)} dur={o(47.2) - o(46.08)} />
      <Etiqueta
        texto="+6%"
        x={110}
        y={700}
        ini={o(46.78)}
        fundo={PAPEL}
        cor={VERDE}
        tam={150}
        rot={-5}
      />
      <Etiqueta
        texto="DÓLAR ↓"
        x={600}
        y={1180}
        ini={o(48.2)}
        fundo={VERMELHO}
        cor={PAPEL}
        tam={60}
        rot={4}
      />
      <Etiqueta
        texto="IBOVESPA · 26/11/2026"
        x={110}
        y={1240}
        ini={o(46.08)}
        tam={32}
        rot={-2}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: o(46.02),
            a: "No dia em que o ",
            k: "nome dele",
            b: " apareceu,",
          },
          { de: o(46.02), ate: o(47.66), a: "a Bolsa subiu ", k: "6%", b: "" },
          { de: o(47.66), ate: 300, a: "e o ", k: "dólar caiu", b: "." },
        ]}
      />
      <Rodape credito="Foto: Léo Pinheiro (CC BY-SA 3.0) · Wikimedia Commons" />
    </Cena>
  );
};

const C9PorQue: React.FC = () => {
  const o = rel(8);
  return (
    <Cena>
      <Kicker texto="POR QUE O MERCADO GOSTOU" />
      <Titulo antes="Por " marca="quê?" marcaIni={o(49.42)} tam={120} />
      <Foto
        src="trabuco/fazenda.jpg"
        w={420}
        h={600}
        x={590}
        y={620}
        ini={0}
        rot={4}
        posicao="0% 40%"
        semente={4}
      />
      <Etiqueta
        texto="✓ TÉCNICO"
        x={80}
        y={720}
        ini={o(51.38)}
        fundo={AMARELO}
        tam={58}
        rot={-3}
      />
      <Etiqueta
        texto="✓ NÃO É POLÍTICO"
        x={80}
        y={880}
        ini={o(51.38) + 10}
        fundo={PAPEL}
        tam={44}
        rot={2}
      />
      <Etiqueta
        texto="✓ SEGURA OS GASTOS"
        x={80}
        y={1040}
        ini={o(52.46)}
        fundo={VERDE}
        cor={PAPEL}
        tam={46}
        rot={-2}
      />
      <Legenda
        falas={[
          { de: 0, ate: o(50.14), a: "", k: "Por quê", b: "?" },
          {
            de: o(50.14),
            ate: o(52.16),
            a: "O mercado vê nele alguém ",
            k: "técnico",
            b: ",",
          },
          {
            de: o(52.16),
            ate: 300,
            a: "que vai ",
            k: "segurar os gastos",
            b: " do governo.",
          },
        ]}
      />
      <Rodape credito="Foto: Marcelo Camargo/Agência Brasil (CC BY 2.0)" />
    </Cena>
  );
};

const C10Critica: React.FC = () => {
  const o = rel(9);
  return (
    <Cena>
      <Kicker texto="O OUTRO LADO" />
      <Titulo
        antes="Mas tem quem "
        marca="torça o nariz"
        marcaIni={o(55.16)}
        tam={88}
      />
      <Balanca ini={o(54.5)} pende={o(57.34)} />
      <Etiqueta
        texto="CONSELHO QUE REGULA OS BANCOS"
        x={70}
        y={1335}
        ini={o(57.86)}
        tam={34}
        rot={-2}
      />
      <Carimbo
        texto="CONFLITO?"
        x={300}
        y={1090}
        ini={o(59.48)}
        rot={-8}
        tam={80}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: o(56.0),
            a: "Mas tem quem ",
            k: "torça o nariz",
            b: ":",
          },
          {
            de: o(56.0),
            ate: o(58.46),
            a: "um ",
            k: "banqueiro",
            b: " vai mandar no conselho",
          },
          {
            de: o(58.46),
            ate: 300,
            a: "que ",
            k: "regula os próprios bancos",
            b: ".",
          },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C11Final: React.FC = () => {
  const o = rel(10);
  return (
    <Cena>
      <Kicker texto="E VOCÊ?" />
      <Titulo
        antes="Boa escolha ou "
        marca="conflito?"
        marcaIni={o(61.6)}
        tam={92}
      />
      <Foto
        src="trabuco/trabuco.jpg"
        w={380}
        h={500}
        x={350}
        y={630}
        ini={0}
        rot={-3}
        cor={AMARELO}
      />
      <Etiqueta
        texto="BOA ESCOLHA"
        x={70}
        y={1060}
        ini={o(60.72)}
        fundo={VERDE}
        cor={PAPEL}
        tam={50}
        rot={-5}
      />
      <Etiqueta
        texto="CONFLITO"
        x={640}
        y={1060}
        ini={o(61.6)}
        fundo={VERMELHO}
        cor={PAPEL}
        tam={50}
        rot={5}
      />
      <NotaMao x={360} y={1170} ini={o(63.02)} tam={62} rot={-4}>
        comenta aí ↓
      </NotaMao>
      <TiraRasgada
        texto="SIGA @HISTORICODEBUSCA"
        x={90}
        y={1290}
        ini={o(63.62)}
        rot={-3}
        tam={46}
      />
      <Legenda
        falas={[
          {
            de: 0,
            ate: o(63.02),
            a: "Boa escolha ou ",
            k: "conflito de interesse",
            b: "?",
          },
          { de: o(63.02), ate: o(63.62), a: "", k: "Comenta aí", b: "." },
          {
            de: o(63.62),
            ate: 400,
            a: "E me siga para mais ",
            k: "buscas aleatórias",
            b: ".",
          },
        ]}
      />
      <Rodape credito="Foto: Bradesco (CC BY-SA 3.0) · Wikimedia Commons" />
    </Cena>
  );
};

const CENAS: React.ReactNode[] = [
  <C1Gancho key={0} />,
  <C2Catapulta key={1} />,
  <C3Escriturario key={2} />,
  <C4Presidente key={3} />,
  <C5Filosofo key={4} />,
  <C6Dilma key={5} />,
  <C7Lula key={6} />,
  <C8Bolsa key={7} />,
  <C9PorQue key={8} />,
  <C10Critica key={9} />,
  <C11Final key={10} />,
];
export const DURACAO_TRABUCO = INI[INI.length - 1];

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

export const VideoTrabuco: React.FC<{ semAudio?: boolean }> = ({
  semAudio,
}) => (
  <AbsoluteFill style={{ backgroundColor: PAPEL }}>
    {semAudio ? null : <Audio src={staticFile("trabuco/mix_final.wav")} />}
    {CENAS.map((el, i) => (
      <Sequence key={i} from={INI[i]} durationInFrames={INI[i + 1] - INI[i]}>
        {el}
      </Sequence>
    ))}
    <TrocaDeFolha cortes={INI.slice(1, -1)} />
  </AbsoluteFill>
);

export const CapaTrabuco: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA" />
    <Titulo
      antes="Quem é "
      marca="Trabuco?"
      ini={-20}
      marcaIni={-20}
      tam={120}
    />
    <Foto
      src="trabuco/catapulta.jpg"
      w={520}
      h={380}
      x={500}
      y={640}
      ini={-20}
      rot={5}
      posicao="60% 50%"
      semente={7}
    />
    <Foto
      src="trabuco/trabuco.jpg"
      w={460}
      h={600}
      x={80}
      y={700}
      ini={-20}
      rot={-4}
      cor={AMARELO}
    />
    <Carimbo
      texto="+6%"
      x={620}
      y={1080}
      ini={-20}
      rot={-8}
      tam={110}
      cor={VERDE}
    />
    <TiraRasgada
      texto="O NOVO MINISTRO DA FAZENDA"
      x={60}
      y={1340}
      ini={-20}
      rot={-3}
      tam={44}
      fundo={VERMELHO}
    />
    <Rodape />
  </Cena>
);
