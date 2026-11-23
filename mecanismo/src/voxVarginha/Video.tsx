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
import {
  UFS,
  MUNICIPIOS_MG,
  VARGINHA,
  VARGINHA_CENTRO,
  MG_CAIXA,
} from "./mapaDados";

// "O ET de Varginha" — @historicodebusca. Colagem de papel + mapa do IBGE com zoom.
// Narração Nassif (79 s). Tempos tirados da transcrição (+0,3 s de atraso do áudio).
// A criatura é desenho original, feita a partir do relato (pele escura, olhos vermelhos).
// O morador citado no inquérito aparece só como silhueta cinza, sem rosto e sem nome.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NOITE = "#141a2b";
const OLHO = "#ff3b2f";
const PELE = "#5b4636";
const OLIVA = "#5d6b3a";

const CRED_CAIXA = "Foto: Paulo JC Nogueira · CC BY-SA 3.0 · Wikimedia Commons";
const CRED_MEMORIAL = "Foto: Então Vamo! · CC BY-SA 4.0 · Wikimedia Commons";
const CRED_MAPA = "Mapa: malhas territoriais do IBGE";

// ---------- peças ----------
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
}> = ({ src, w, h, x, y, ini, rot = -2, cor = "#fff", semente = 11, posicao = "50% 50%", filtro }) => {
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
      <div style={{ width: w, height: h, clipPath: rasgado(semente), background: KRAFT, overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: posicao, filter: filtro }}
        />
      </div>
    </div>
  );
};

const Adesivo: React.FC<{ x: number; y: number; ini: number; rot?: number; cor?: string; children: React.ReactNode }> = ({
  x,
  y,
  ini,
  rot = 0,
  cor = "#fff",
  children,
}) => {
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

// fundo de noite com estrelas paradas (o papel continua por baixo)
const Noite: React.FC<{ forca?: number }> = ({ forca = 1 }) => (
  <AbsoluteFill style={{ background: NOITE, opacity: 0.9 * forca }}>
    <svg width={1080} height={1920}>
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 397) % 1080;
        const y = (i * 241) % 1300;
        return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 3 : 1.6} fill="#f4f1e6" opacity={0.6} />;
      })}
    </svg>
  </AbsoluteFill>
);

// chuva em tiras de papel, no ritmo "em dois"
const Chuva: React.FC<{ forca?: number }> = ({ forca = 1 }) => {
  const frame = emDois(useCurrentFrame());
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.55 * forca }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const x = (i * 157 + frame * 6) % 1180 - 50;
        const y = ((i * 263 + frame * 38) % 2000) - 100;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 60} stroke="#9fb4d6" strokeWidth={4} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// a criatura do relato: desenho original, agachada, olhos vermelhos
const Criatura: React.FC<{ tam?: number; olhos?: number; cinza?: number }> = ({ tam = 420, olhos = 1, cinza = 0 }) => (
  <svg viewBox="0 0 300 300" width={tam} height={tam} style={{ overflow: "visible", filter: `grayscale(${cinza})` }}>
    {/* corpo agachado */}
    <path
      d="M90 290 Q70 230 100 190 Q120 165 150 168 Q180 165 200 190 Q230 230 210 290 Z"
      fill={PELE}
      stroke={TINTA}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    {/* bracinhos abraçando os joelhos */}
    <path d="M105 215 Q150 250 195 215" fill="none" stroke={TINTA} strokeWidth={9} strokeLinecap="round" />
    {/* cabeça grande com as três saliências do relato */}
    <path
      d="M80 120 Q78 60 150 52 Q222 60 220 120 Q216 170 150 178 Q84 170 80 120 Z"
      fill={PELE}
      stroke={TINTA}
      strokeWidth={7}
    />
    <path d="M115 60 Q118 30 130 52" fill={PELE} stroke={TINTA} strokeWidth={6} />
    <path d="M142 54 Q150 20 158 54" fill={PELE} stroke={TINTA} strokeWidth={6} />
    <path d="M170 52 Q182 30 185 60" fill={PELE} stroke={TINTA} strokeWidth={6} />
    {/* olhos vermelhos */}
    <g opacity={olhos}>
      <ellipse cx={120} cy={118} rx={24} ry={17} fill={OLHO} stroke={TINTA} strokeWidth={5} transform="rotate(14 120 118)" />
      <ellipse cx={180} cy={118} rx={24} ry={17} fill={OLHO} stroke={TINTA} strokeWidth={5} transform="rotate(-14 180 118)" />
      <circle cx={114} cy={113} r={5} fill="#ffd9d0" />
      <circle cx={174} cy={113} r={5} fill="#ffd9d0" />
    </g>
  </svg>
);

// silhueta de um homem agachado: cinza, sem rosto
const HomemSilhueta: React.FC<{ tam?: number }> = ({ tam = 420 }) => (
  <svg viewBox="0 0 300 300" width={tam} height={tam}>
    <path
      d="M95 292 Q85 240 110 205 Q125 185 150 186 Q175 185 190 205 Q215 240 205 292 Z"
      fill="#7d7a74"
      stroke={TINTA}
      strokeWidth={6}
    />
    <path d="M112 225 Q150 255 188 225" fill="none" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />
    <circle cx={150} cy={150} r={40} fill="#7d7a74" stroke={TINTA} strokeWidth={6} />
  </svg>
);

const Muro: React.FC<{ w?: number }> = ({ w = 1000 }) => (
  <svg viewBox={`0 0 ${w} 300`} width={w} height={300}>
    {Array.from({ length: 6 }).map((_, r) =>
      Array.from({ length: Math.ceil(w / 120) + 1 }).map((__, c) => (
        <rect
          key={`${r}-${c}`}
          x={c * 120 - (r % 2 ? 60 : 0)}
          y={r * 50}
          width={116}
          height={46}
          fill={r % 2 ? "#a35a3c" : "#b3684a"}
          stroke={TINTA}
          strokeWidth={3}
        />
      )),
    )}
  </svg>
);

const Caminhao: React.FC<{ tam?: number }> = ({ tam = 520 }) => (
  <svg viewBox="0 0 400 200" width={tam} height={tam / 2}>
    <rect x={10} y={40} width={250} height={110} rx={6} fill={OLIVA} stroke={TINTA} strokeWidth={7} />
    <path d="M20 40 Q135 0 250 40" fill="#6f7d46" stroke={TINTA} strokeWidth={6} />
    <path d="M260 70 L340 70 L380 110 L380 150 L260 150 Z" fill={OLIVA} stroke={TINTA} strokeWidth={7} strokeLinejoin="round" />
    <rect x={290} y={82} width={40} height={30} fill="#cfe3ef" stroke={TINTA} strokeWidth={4} />
    {[70, 200, 330].map((x) => (
      <g key={x}>
        <circle cx={x} cy={160} r={28} fill={TINTA} />
        <circle cx={x} cy={160} r={11} fill="#888" />
      </g>
    ))}
  </svg>
);

const Disco: React.FC<{ tam?: number }> = ({ tam = 300 }) => (
  <svg viewBox="0 0 300 140" width={tam} height={tam * 0.47}>
    <ellipse cx={150} cy={50} rx={60} ry={40} fill="#cfe3ef" stroke={TINTA} strokeWidth={6} />
    <ellipse cx={150} cy={80} rx={140} ry={34} fill="#b9bec4" stroke={TINTA} strokeWidth={7} />
    {[60, 105, 150, 195, 240].map((x) => (
      <circle key={x} cx={x} cy={84} r={7} fill="#ffd34d" stroke={TINTA} strokeWidth={3} />
    ))}
  </svg>
);

// ---------- mapa do IBGE com zoom ----------
// Caixas no sistema de coordenadas de mapaDados (equiretangular, 100 unid. por grau).
type Caixa = [number, number, number];
const CX_BRASIL: Caixa = [1930, 1960, 4300]; // centro x, centro y, largura
const CX_MG: Caixa = [MG_CAIXA[0] + MG_CAIXA[2] / 2, MG_CAIXA[1] + MG_CAIXA[3] / 2, MG_CAIXA[2] * 1.35];
const CX_VARGINHA: Caixa = [VARGINHA_CENTRO[0], VARGINHA_CENTRO[1], 110];
const MAPA_W = 960;
const MAPA_H = 960;

const Mapa: React.FC<{ caixa: Caixa; destaque?: number; alfinete?: number; noite?: boolean }> = ({
  caixa,
  destaque = 1,
  alfinete = 0,
  noite = false,
}) => {
  const frame = useCurrentFrame();
  const [cx, cy, w] = caixa;
  const h = w * (MAPA_H / MAPA_W);
  const mostraMunicipios = w < 1500;
  const pulso = 1 + 0.25 * Math.abs(Math.sin(emDois(frame) / 6));
  const escala = w / MAPA_W; // unidades de mapa por pixel
  return (
    <div style={{ position: "absolute", left: 60, top: 430, filter: adesivo("#fff", 8) }}>
      <div style={{ width: MAPA_W, height: MAPA_H, clipPath: rasgado(141, 30, 0.9), background: noite ? "#22304d" : "#bcd9e6" }}>
        <svg viewBox={`${cx - w / 2} ${cy - h / 2} ${w} ${h}`} width={MAPA_W} height={MAPA_H}>
          {Object.entries(UFS).map(([cod, d]) => (
            <path
              key={cod}
              d={d}
              fill={cod === "31" ? `rgba(242,106,27,${0.25 + 0.6 * destaque})` : noite ? "#3a4660" : "#efe9dc"}
              stroke={TINTA}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {mostraMunicipios ? (
            <path d={MUNICIPIOS_MG} fill="none" stroke={TINTA} strokeOpacity={0.35} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ) : null}
          <path d={VARGINHA} fill={VERMELHO} stroke={TINTA} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={alfinete > 0 ? 1 : 0} />
          {alfinete > 0 ? (
            <g transform={`translate(${VARGINHA_CENTRO[0]} ${VARGINHA_CENTRO[1]}) scale(${escala * alfinete})`}>
              <circle r={26 * pulso} fill="none" stroke={OLHO} strokeWidth={5} opacity={0.7} />
              <path d="M0 0 L-16 -40 A20 20 0 1 1 16 -40 Z" fill={OLHO} stroke={TINTA} strokeWidth={5} />
              <circle cx={0} cy={-52} r={8} fill="#fff" />
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
};

// interpolação geométrica entre caixas (zoom suave, em degraus de 2 quadros)
const entre = (a: Caixa, b: Caixa, p: number): Caixa => [
  a[0] + (b[0] - a[0]) * p,
  a[1] + (b[1] - a[1]) * p,
  Math.exp(Math.log(a[2]) + (Math.log(b[2]) - Math.log(a[2])) * p),
];
const zoom = (f: number, ini: number, dur: number) =>
  interpolate(emDois(f), [ini, ini + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

const Rotulo: React.FC<{ texto: string; ini: number; x: number; y: number; rot?: number; cor?: string; fundo?: string }> = ({
  texto,
  ini,
  x,
  y,
  rot = -3,
  cor = PAPEL,
  fundo = TINTA,
}) => <TiraRasgada texto={texto} x={x} y={y} ini={ini} rot={rot} tam={46} fundo={fundo} cor={cor} />;

// rodapé claro para as cenas de noite
const RodapeClaro: React.FC<{ credito?: string }> = ({ credito }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1568, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: PAPEL, opacity: 0.8 }}>
      @HISTORICODEBUSCA
    </div>
    {credito ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1598, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 19, color: PAPEL, opacity: 0.75 }}>
        {credito}
      </div>
    ) : null}
  </>
);

// ================= cenas =================

// 1) gancho: a caixa d'água em disco voador, à noite
const C1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const olhos = linear(frame, 170, 10);
  return (
    <Cena>
      <Noite />
      <div style={{ position: "absolute", left: 70, top: 322, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: PAPEL }}>
        HISTÓRICO DE BUSCA · MISTÉRIOS
      </div>
      <Foto src="voxVarginha/caixa_disco.jpg" w={900} h={760} x={90} y={420} ini={4} rot={-2} semente={21} posicao="30% 40%" />
      <Carimbo texto="CAIXA D'ÁGUA" x={520} y={1100} ini={60} rot={7} tam={46} cor={AZUL} />
      {/* olhos acendendo no escuro, embaixo da foto */}
      <div style={{ position: "absolute", left: 370, top: 1230, opacity: olhos }}>
        <svg width={340} height={90}>
          <ellipse cx={90} cy={45} rx={56} ry={26} fill={OLHO} transform="rotate(12 90 45)" />
          <ellipse cx={250} cy={45} rx={56} ry={26} fill={OLHO} transform="rotate(-12 250 45)" />
        </svg>
      </div>
      <Legenda
        falas={[
          { de: 0, ate: 170, a: "Tem uma cidade em Minas com caixa d'água em forma de ", k: "disco voador", b: "." },
          { de: 170, ate: 245, a: "E a culpa é de um ", k: "ET", b: "." },
        ]}
      />
      <RodapeClaro credito={CRED_CAIXA} />
    </Cena>
  );
};

// 2) bordão: a busca
const C2Busca: React.FC = () => {
  const frame = useCurrentFrame();
  const termo = "et de varginha";
  const n = Math.floor(interpolate(emDois(frame), [8, 50], [0, termo.length], clamp));
  return (
    <Cena>
      <Kicker texto="NO MEU HISTÓRICO DE BUSCA DE HOJE" />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 640,
          transform: `rotate(-1.5deg) scale(${estalo(frame, 0, 8)})`,
          background: "#fff",
          border: `6px solid ${TINTA}`,
          borderRadius: 60,
          boxShadow: `10px 10px 0 ${TINTA}`,
          padding: "26px 34px",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 54,
          color: TINTA,
          minHeight: 70,
        }}
      >
        🔍 {termo.slice(0, n)}
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>|</span>
      </div>
      <Adesivo x={330} y={860} ini={56} rot={-6}>
        <Disco tam={420} />
      </Adesivo>
      <Legenda falas={[{ de: 0, ate: 127, a: "No meu ", k: "histórico de busca", b: " de hoje: o ET de Varginha." }]} />
      <Rodape />
    </Cena>
  );
};

// 3) o mapa: Brasil -> Minas -> Varginha
const C3Mapa: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = zoom(frame, 30, 60);
  const p2 = zoom(frame, 110, 70);
  const caixa = p2 > 0 ? entre(CX_MG, CX_VARGINHA, p2) : entre(CX_BRASIL, CX_MG, p1);
  const alfinete = estalo(frame, 175, 10);
  return (
    <Cena>
      <Kicker texto="20 DE JANEIRO DE 1996" />
      <Mapa caixa={caixa} destaque={p1} alfinete={alfinete} />
      {p1 > 0.6 && p2 < 0.4 ? <Rotulo texto="MINAS GERAIS" ini={70} x={120} y={1290} /> : null}
      {alfinete > 0 ? <Rotulo texto="VARGINHA · SUL DE MINAS" ini={175} x={110} y={1290} fundo={VERMELHO} /> : null}
      <Legenda
        falas={[
          { de: 0, ate: 110, a: "", k: "20 de janeiro de 1996", b: "." },
          { de: 110, ate: 219, a: "Bairro Jardim Andere, ", k: "Varginha", b: ", sul de Minas." },
        ]}
      />
      <Rodape credito={CRED_MAPA} />
    </Cena>
  );
};

// 4) a criatura atrás do muro
const C4Criatura: React.FC = () => {
  const frame = useCurrentFrame();
  const sobe = interpolate(emDois(frame), [120, 170], [140, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const olhos = linear(frame, 209, 6);
  const treme = olhos > 0 ? Math.sin(emDois(frame)) * 2 : 0;
  return (
    <Cena>
      <Noite />
      <Chuva />
      <div style={{ position: "absolute", left: 70, top: 322, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: PAPEL }}>
        TERRENO BALDIO · JARDIM ANDERE
      </div>
      {/* três jovens em silhueta, à esquerda */}
      <div style={{ position: "absolute", left: 70, top: 620, opacity: linear(frame, 10, 10) }}>
        <svg width={300} height={420}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 90} ${i === 1 ? 0 : 20})`}>
              <circle cx={40} cy={60} r={30} fill="#0b0f1a" />
              <path d="M5 400 Q0 150 40 100 Q80 150 75 400 Z" fill="#0b0f1a" />
            </g>
          ))}
        </svg>
      </div>
      {/* a criatura surge atrás do muro */}
      <div style={{ position: "absolute", left: 460, top: 680 + sobe, transform: `translateX(${treme}px)` }}>
        <Criatura tam={480} olhos={0.25 + 0.75 * olhos} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 1080, clipPath: rasgado(171, 26, 1.2) }}>
        <Muro w={1000} />
      </div>
      <NotaMao x={540} y={500} ini={172} tam={48} rot={4} cor={PAPEL}>
        pele escura
      </NotaMao>
      <NotaMao x={540} y={570} ini={209} tam={50} rot={3} cor={OLHO}>
        olhos vermelhos ↓
      </NotaMao>
      <Legenda
        falas={[
          { de: 0, ate: 172, a: "Três jovens veem uma ", k: "criatura agachada", b: " perto de um muro." },
          { de: 172, ate: 209, a: "", k: "Pele escura", b: "." },
          { de: 209, ate: 270, a: "Olhos ", k: "grandes e vermelhos", b: "." },
        ]}
      />
      <RodapeClaro />
    </Cena>
  );
};

// 5) o caso corre o mundo
const C5Mundo: React.FC = () => {
  const frame = useCurrentFrame();
  const anda = interpolate(emDois(frame), [60, 170], [-620, 1100], clamp);
  const luz = Math.sin(emDois(frame) / 10) * 30;
  return (
    <Cena>
      <Noite forca={0.7} />
      {/* manchetes inventadas, sem jornal real */}
      <Adesivo x={80} y={360} ini={0} rot={-5}>
        <div style={{ background: "#f8f4ea", padding: "22px 30px", fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: TINTA, width: 820, clipPath: rasgado(181, 18, 1.4) }}>
          “ET em Minas?”
        </div>
      </Adesivo>
      <Adesivo x={180} y={560} ini={14} rot={4}>
        <div style={{ background: "#f8f4ea", padding: "18px 28px", fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: TINTA, width: 760, clipPath: rasgado(191, 18, 1.4) }}>
          “Criatura vista em Varginha”
        </div>
      </Adesivo>
      {/* lanterna varrendo */}
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 760,
          width: 0,
          height: 0,
          borderLeft: "180px solid transparent",
          borderRight: "180px solid transparent",
          borderBottom: "520px solid rgba(255,240,170,0.22)",
          transform: `rotate(${luz}deg)`,
          transformOrigin: "50% 0%",
          opacity: linear(frame, 50, 10),
        }}
      />
      <div style={{ position: "absolute", left: anda, top: 1060 }}>
        <Caminhao tam={560} />
      </div>
      <NotaMao x={120} y={1330} ini={70} tam={46} rot={-3} cor={PAPEL}>
        relatos, sem prova
      </NotaMao>
      <Legenda
        falas={[
          { de: 0, ate: 55, a: "O caso ", k: "corre o mundo", b: "." },
          { de: 55, ate: 182, a: "Surgem relatos de ", k: "caminhões do Exército", b: " e de uma captura." },
        ]}
      />
      <RodapeClaro />
    </Cena>
  );
};

// 6) o inquérito
const C6Inquerito: React.FC = () => {
  const frame = useCurrentFrame();
  const troca = linear(frame, 233, 30); // criatura vira silhueta de homem
  return (
    <Cena>
      <Kicker texto="INQUÉRITO POLICIAL MILITAR · 1997" />
      {/* pasta */}
      <Adesivo x={80} y={400} ini={0} rot={-3}>
        <div style={{ width: 900, height: 760, background: "#d8b46a", border: `6px solid ${TINTA}`, borderRadius: 12, position: "relative" }}>
          <div style={{ position: "absolute", left: 30, top: -50, width: 280, height: 60, background: "#d8b46a", border: `6px solid ${TINTA}`, borderBottom: "none", borderRadius: "12px 12px 0 0" }} />
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: TINTA, letterSpacing: "0.06em" }}>
            INQUÉRITO · 1997
          </div>
          <div style={{ position: "absolute", left: 220, top: 160, opacity: 1 - troca }}>
            <Criatura tam={460} olhos={1} />
          </div>
          <div style={{ position: "absolute", left: 220, top: 160, opacity: troca }}>
            <HomemSilhueta tam={460} />
          </div>
        </div>
      </Adesivo>
      <Carimbo texto="SEM OPERAÇÃO MILITAR" x={110} y={1170} ini={165} rot={-6} tam={50} cor={VERMELHO} />
      <NotaMao x={600} y={1290} ini={384} tam={44} rot={-3} cor={TINTA}>
        lama + chuva
      </NotaMao>
      <Legenda
        falas={[
          { de: 0, ate: 165, a: "Um inquérito militar, de 1997, ", k: "concluiu outra coisa", b: ":" },
          { de: 165, ate: 233, a: "", k: "não houve operação nenhuma", b: "." },
          { de: 233, ate: 384, a: "A “criatura” seria um ", k: "morador da cidade", b: ", agachado perto dos muros," },
          { de: 384, ate: 459, a: "", k: "sujo de lama", b: " depois da chuva." },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// 7) STM 2026
const C7Stm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Cena>
      <Kicker texto="SUPERIOR TRIBUNAL MILITAR · JAN/2026" />
      <Adesivo x={110} y={420} ini={0} rot={2}>
        <div style={{ width: 860, height: 720, background: "#fbf8f0", border: `5px solid ${TINTA}`, padding: 50, boxSizing: "border-box" }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 22,
                marginBottom: 32,
                width: `${60 + ((i * 37) % 40)}%`,
                background: i % 3 === 1 ? TINTA : "rgba(23,19,14,0.18)",
                transform: i % 3 === 1 ? `scaleX(${linear(frame, 20 + i * 2, 8)})` : undefined,
                transformOrigin: "left",
              }}
            />
          ))}
        </div>
      </Adesivo>
      <Carimbo texto="LIBERADO · JAN/2026" x={300} y={900} ini={60} rot={-8} tam={54} cor={VERMELHO} />
      <NotaMao x={760} y={1060} ini={171} tam={200} rot={10} cor={AZUL}>
        ?
      </NotaMao>
      <NotaMao x={110} y={1260} ini={171} tam={48} rot={-3} cor={TINTA}>
        os ufólogos não aceitam
      </NotaMao>
      <Legenda
        falas={[
          { de: 0, ate: 171, a: "Em janeiro de 2026, o STM ", k: "liberou esses documentos", b: "." },
          { de: 171, ate: 289, a: "Mesmo assim, os ufólogos ", k: "não aceitam", b: " essa explicação." },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

// 8) a cidade abraçou o ET
const C8Cidade: React.FC = () => (
  <Cena>
    <Kicker texto="E VARGINHA?" />
    <Titulo antes="Abraçou o " marca="ET." marcaIni={20} tam={110} />
    <Foto src="voxVarginha/memorial.jpg" w={920} h={520} x={80} y={600} ini={71} rot={-3} semente={31} posicao="40% 50%" />
    <Carimbo texto="MEMORIAL DO ET" x={420} y={1040} ini={90} rot={5} tam={46} cor={AZUL} />
    <Adesivo x={120} y={1130} ini={179} rot={-6}>
      <div style={{ width: 300, height: 220, overflow: "hidden", clipPath: rasgado(41) }}>
        <Img src={staticFile("voxVarginha/caixa_disco.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% 30%" }} />
      </div>
    </Adesivo>
    <NotaMao x={460} y={1210} ini={179} tam={50} rot={-4}>
      ← aquela caixa d'água
    </NotaMao>
    <Legenda
      falas={[
        { de: 0, ate: 71, a: "E Varginha? ", k: "Abraçou o ET", b: "." },
        { de: 71, ate: 179, a: "Ponto de ônibus de nave, um ", k: "Memorial do ET", b: "..." },
        { de: 179, ate: 248, a: "e ", k: "aquela caixa d'água", b: "." },
      ]}
    />
    <Rodape credito={CRED_MEMORIAL} />
  </Cena>
);

// 9) fecho: mapa afasta e carimbo "capital do ET"
const C9Final: React.FC = () => {
  const frame = useCurrentFrame();
  const p = zoom(frame, 0, 60);
  const caixa = entre(CX_VARGINHA, [CX_MG[0], CX_MG[1], CX_MG[2] * 0.55], p);
  return (
    <Cena>
      <Kicker texto="OU SEJA" />
      <Mapa caixa={caixa} destaque={1} alfinete={1} />
      <Carimbo texto="CAPITAL DO ET" x={200} y={700} ini={87} rot={-8} tam={84} cor={VERMELHO} />
      <NotaMao x={300} y={1180} ini={184} tam={58} rot={-4}>
        você acredita? comenta ↓
      </NotaMao>
      <TiraRasgada texto="SIGA @HISTORICODEBUSCA" x={90} y={1290} ini={250} rot={-3} tam={46} />
      <Legenda
        falas={[
          { de: 0, ate: 87, a: "O Exército diz que ", k: "não era ET", b: "." },
          { de: 87, ate: 184, a: "Mas a cidade virou a ", k: "capital do ET", b: "." },
          { de: 184, ate: 250, a: "E você, acredita? ", k: "Comenta aí", b: "." },
          { de: 250, ate: 351, a: "E me siga para mais ", k: "buscas aleatórias", b: "." },
        ]}
      />
      <Rodape credito={CRED_MAPA} />
    </Cena>
  );
};

// ===== montagem =====
const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 245, el: <C1Gancho /> },
  { dur: 127, el: <C2Busca /> },
  { dur: 219, el: <C3Mapa /> },
  { dur: 270, el: <C4Criatura /> },
  { dur: 182, el: <C5Mundo /> },
  { dur: 459, el: <C6Inquerito /> },
  { dur: 289, el: <C7Stm /> },
  { dur: 248, el: <C8Cidade /> },
  { dur: 351, el: <C9Final /> },
];
export const DURACAO_VARGINHA = CENAS.reduce((s, c) => s + c.dur, 0);

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

export const VideoVarginha: React.FC<{ semAudio?: boolean }> = ({ semAudio }) => {
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
      {semAudio ? null : <Audio src={staticFile("voxVarginha/mix_final.wav")} />}
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};

// capa: olhos vermelhos atrás do muro + pergunta
export const CapaVarginha: React.FC = () => (
  <Cena>
    <Noite />
    <Chuva />
    <div style={{ position: "absolute", left: 70, top: 330, right: 60, fontFamily: SERIF, fontWeight: 700, fontSize: 112, lineHeight: 1.25, color: PAPEL, transform: "rotate(-1.5deg)" }}>
      O que viram em <span style={{ background: OLHO, color: TINTA, padding: "0 12px", fontStyle: "italic", display: "inline-block", marginTop: 14 }}>Varginha?</span>
    </div>
    <div style={{ position: "absolute", left: 300, top: 760 }}>
      <Criatura tam={520} olhos={1} />
    </div>
    <div style={{ position: "absolute", left: 40, top: 1200, clipPath: rasgado(171, 26, 1.2) }}>
      <Muro w={1000} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1568, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: PAPEL, opacity: 0.8 }}>
      @HISTORICODEBUSCA
    </div>
  </Cena>
);
