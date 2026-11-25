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

// "Figurinha com som no WhatsApp" — @historicodebusca. Colagem de papel.
// Narração Nassif (70,6 s). Tempos da transcrição (+0,3 s de atraso do áudio).
// Interface desenhada: nada de logo nem tela real do aplicativo.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#2f9e57";
const VERDE_BALAO = "#d6f5c9";
const AMARELO = "#ffd23f";

// ---------- peças desenhadas ----------

// bichinho original da figurinha (bola laranja com olhos e boca)
const Bichinho: React.FC<{
  tam?: number;
  boca?: "aberta" | "fechada";
  cor?: string;
  falando?: boolean;
}> = ({ tam = 220, boca = "aberta", cor = LARANJA, falando = true }) => {
  const frame = useCurrentFrame();
  const a = boca === "aberta" && falando ? 0.6 + 0.4 * Math.abs(Math.sin(emDois(frame) * 0.35)) : 0;
  return (
    <svg viewBox="0 0 200 200" width={tam} height={tam} style={{ overflow: "visible" }}>
      <ellipse cx={100} cy={108} rx={84} ry={78} fill={cor} stroke={TINTA} strokeWidth={7} />
      <ellipse cx={46} cy={40} rx={18} ry={26} fill={cor} stroke={TINTA} strokeWidth={6} transform="rotate(-25 46 40)" />
      <ellipse cx={154} cy={40} rx={18} ry={26} fill={cor} stroke={TINTA} strokeWidth={6} transform="rotate(25 154 40)" />
      <ellipse cx={100} cy={108} rx={84} ry={78} fill={cor} stroke={TINTA} strokeWidth={7} />
      <circle cx={72} cy={92} r={15} fill="#fff" stroke={TINTA} strokeWidth={5} />
      <circle cx={128} cy={92} r={15} fill="#fff" stroke={TINTA} strokeWidth={5} />
      <circle cx={75} cy={95} r={6} fill={TINTA} />
      <circle cx={131} cy={95} r={6} fill={TINTA} />
      <circle cx={52} cy={124} r={10} fill="#ff9d8a" opacity={0.8} />
      <circle cx={148} cy={124} r={10} fill="#ff9d8a" opacity={0.8} />
      {boca === "aberta" ? (
        <ellipse cx={100} cy={136} rx={24} ry={6 + 18 * a} fill={TINTA} />
      ) : (
        <path d="M80 136 Q100 128 120 136" stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};

// ondas de som saindo para a direita
const Ondas: React.FC<{ tam?: number; ini?: number; cor?: string }> = ({
  tam = 120,
  ini = 0,
  cor = TINTA,
}) => {
  const frame = useCurrentFrame();
  const f = emDois(frame) - ini;
  if (f < 0) return null;
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam}>
      {[0, 1, 2].map((i) => {
        const p = ((f / 18 + i / 3) % 1);
        return (
          <path
            key={i}
            d={`M${20 + i * 22} 20 Q${44 + i * 22} 50 ${20 + i * 22} 80`}
            stroke={cor}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            opacity={1 - p * 0.8}
          />
        );
      })}
    </svg>
  );
};

const AltoFalante: React.FC<{ tam?: number; mudo?: boolean }> = ({ tam = 70, mudo = false }) => (
  <svg viewBox="0 0 100 100" width={tam} height={tam}>
    <circle cx={50} cy={50} r={46} fill="#fff" stroke={TINTA} strokeWidth={6} />
    <path d="M24 40 H38 L56 24 V76 L38 60 H24 Z" fill={TINTA} />
    {mudo ? (
      <path d="M64 38 L82 62 M82 38 L64 62" stroke={VERMELHO} strokeWidth={8} strokeLinecap="round" />
    ) : (
      <>
        <path d="M64 38 Q72 50 64 62" stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M72 30 Q86 50 72 70" stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const Sino: React.FC<{ tam?: number }> = ({ tam = 160 }) => (
  <svg viewBox="0 0 120 120" width={tam} height={tam}>
    <path d="M60 14 Q30 16 30 52 V76 L18 90 H102 L90 76 V52 Q90 16 60 14 Z" fill={AMARELO} stroke={TINTA} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={60} cy={100} r={10} fill={TINTA} />
    <line x1={14} y1={110} x2={106} y2={10} stroke={VERMELHO} strokeWidth={11} strokeLinecap="round" />
  </svg>
);

// celular de papel (genérico)
const Celular: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  ini: number;
  rot?: number;
  aceso?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w = 520, h = 760, ini, rot = -3, aceso = true, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${estalo(frame, ini, 10)})`,
        transformOrigin: "50% 80%",
        filter: adesivo("#fff", 8),
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          background: "#2a2622",
          borderRadius: w * 0.12,
          padding: w * 0.05,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: w * 0.08,
            background: aceso ? "#f3efe4" : "#4a443d",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {aceso ? (
            <div style={{ height: h * 0.1, background: "#3d7a55", display: "flex", alignItems: "center", paddingLeft: w * 0.06, gap: w * 0.04 }}>
              <div style={{ width: h * 0.06, height: h * 0.06, borderRadius: "50%", background: KRAFT }} />
              <div style={{ width: w * 0.4, height: h * 0.022, borderRadius: 8, background: "rgba(255,255,255,0.7)" }} />
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
};

// figurinha com contorno branco de adesivo, pode ter alto-falante no canto
const Figurinha: React.FC<{
  x: number;
  y: number;
  ini: number;
  tam?: number;
  rot?: number;
  falante?: boolean;
  falanteIni?: number;
  mudo?: boolean;
  ondasIni?: number | null;
  boca?: "aberta" | "fechada";
  cor?: string;
}> = ({
  x,
  y,
  ini,
  tam = 220,
  rot = -4,
  falante = true,
  falanteIni = 0,
  mudo = false,
  ondasIni = null,
  boca = "aberta",
  cor,
}) => {
  const frame = useCurrentFrame();
  const v = estalo(frame, ini, 9);
  if (v <= 0) return null;
  const falandoAgora = ondasIni !== null && frame >= ondasIni && !mudo;
  const pulso = 1 + 0.08 * Math.max(0, Math.sin(emDois(frame - falanteIni) * 0.25));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${v})`,
        filter: adesivo("#fff", 9),
      }}
    >
      <div style={{ position: "relative" }}>
        <Bichinho tam={tam} boca={falandoAgora ? "aberta" : boca === "aberta" && ondasIni === null ? "aberta" : "fechada"} falando={falandoAgora || (ondasIni === null && boca === "aberta")} cor={cor} />
        {falante && frame >= falanteIni ? (
          <div
            style={{
              position: "absolute",
              right: -tam * 0.08,
              bottom: -tam * 0.04,
              transform: `scale(${estalo(frame, falanteIni, 6) * pulso})`,
            }}
          >
            <AltoFalante tam={tam * 0.34} mudo={mudo} />
          </div>
        ) : null}
        {falandoAgora ? (
          <div style={{ position: "absolute", left: tam * 0.95, top: tam * 0.15 }}>
            <Ondas tam={tam * 0.55} ini={ondasIni ?? 0} />
          </div>
        ) : null}
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
      padding: "30px 26px",
      boxSizing: "border-box",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const Dedo: React.FC<{ x: number; y: number; ini: number; toque: number }> = ({ x, y, ini, toque }) => {
  const frame = useCurrentFrame();
  const v = linear(frame, ini, 10);
  if (v <= 0) return null;
  const desce = interpolate(emDois(frame), [toque - 8, toque, toque + 8], [0, 26, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - v) * 200 + desce,
        fontSize: 150,
        opacity: v,
        transform: "rotate(-12deg)",
      }}
    >
      👆
    </div>
  );
};

const Texto: React.FC<{ tam?: number; cor?: string; peso?: number; serif?: boolean; children: React.ReactNode }> = ({
  tam = 40,
  cor = TINTA,
  peso = 900,
  serif = false,
  children,
}) => (
  <div style={{ fontFamily: serif ? SERIF : SANS, fontWeight: peso, fontSize: tam, color: cor, lineHeight: 1.1 }}>
    {children}
  </div>
);

// ---------- cenas ----------

const C1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const termo = "figurinha com som";
  const n = Math.floor(interpolate(emDois(frame), [8, 48], [0, termo.length], clamp));
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
          fontSize: 56,
          color: TINTA,
          minHeight: 70,
        }}
      >
        🔍 {termo.slice(0, n)}
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>|</span>
      </div>
      <Figurinha x={250} y={700} ini={52} tam={420} rot={-5} falanteIni={60} ondasIni={64} />
      <NotaMao x={600} y={1210} ini={100} tam={64} rot={-6}>
        já chegou
        <br />
        pra você?
      </NotaMao>
      <Legenda
        falas={[
          { de: 0, ate: 100, a: "No meu histórico de busca de hoje: ", k: "figurinha com som", b: "." },
          { de: 100, ate: 160, a: "Já chegou ", k: "pra você?" },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C2Novidade: React.FC = () => (
  <Cena>
    <Kicker texto="NOVIDADE NO WHATSAPP" />
    <Titulo antes="Figurinha " marca="com som" marcaIni={14} tam={104} />
    <Celular x={90} y={620} ini={4} rot={-4} w={500} h={740}>
      <div style={{ position: "absolute", left: 24, top: 110, background: "#fff", borderRadius: 18, padding: "14px 18px", width: 260 }}>
        <div style={{ height: 14, borderRadius: 7, background: "#cfc8b8", width: "90%" }} />
        <div style={{ height: 14, borderRadius: 7, background: "#cfc8b8", width: "60%", marginTop: 10 }} />
      </div>
      <div style={{ position: "absolute", right: 24, top: 220, background: VERDE_BALAO, borderRadius: 18, padding: "14px 18px", width: 230 }}>
        <div style={{ height: 14, borderRadius: 7, background: "#a8cf9a", width: "80%" }} />
      </div>
    </Celular>
    <Figurinha x={250} y={930} ini={40} tam={260} rot={6} falanteIni={46} ondasIni={52} />
    <Carimbo texto="DESDE 24/11" x={620} y={700} ini={20} rot={8} tam={50} cor={VERDE} />
    <TiraRasgada texto="CHEGANDO AOS POUCOS" x={330} y={1250} ini={154} rot={-4} tam={46} />
    <Legenda
      falas={[
        { de: 0, ate: 154, a: "Desde ontem, o WhatsApp começou a liberar figurinhas que ", k: "tocam um áudio", b: "." },
        { de: 154, ate: 243, a: "Não é para todo mundo ainda: ", k: "está chegando aos poucos", b: "." },
      ]}
    />
    <Rodape />
  </Cena>
);

const C3Funciona: React.FC = () => (
  <Cena>
    <Kicker texto="COMO FUNCIONA" />
    <Titulo antes="Só toca " marca="se você tocar" marcaIni={150} tam={100} />
    <Figurinha x={240} y={660} ini={6} tam={460} rot={-3} falanteIni={80} ondasIni={196} boca="fechada" />
    <NotaMao x={110} y={1190} ini={86} tam={52} rot={-5}>
      alto-falante ↗
    </NotaMao>
    <Carimbo texto="NÃO TOCA SOZINHA" x={90} y={600} ini={141} rot={-7} tam={44} />
    <Dedo x={560} y={1050} ini={180} toque={194} />
    <Legenda
      falas={[
        { de: 0, ate: 141, a: "A figurinha chega com um ", k: "alto-falante", b: " pequenininho." },
        { de: 141, ate: 187, a: "Ela ", k: "não toca sozinha", b: "." },
        { de: 187, ate: 249, a: "Você só ouve ", k: "se tocar nele", b: "." },
      ]}
    />
    <Rodape />
  </Cena>
);

const Passo: React.FC<{ n: string; texto: React.ReactNode; icone: React.ReactNode; cor?: string }> = ({ n, texto, icone, cor = AZUL }) => (
  <Cartao largura={300} semente={Number(n) * 31}>
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        background: cor,
        border: `5px solid ${TINTA}`,
        margin: "0 auto 12px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 44,
        lineHeight: "62px",
        color: TINTA,
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 90, lineHeight: 1.1 }}>{icone}</div>
    <Texto tam={36}>{texto}</Texto>
  </Cartao>
);

const C4FacaSua: React.FC = () => (
  <Cena>
    <Kicker texto="PASSO A PASSO" />
    <Titulo antes="Dá para fazer " marca="a sua" marcaIni={14} tam={100} />
    <Adesivo x={50} y={700} ini={113} rot={-5}>
      <Passo n="1" icone="➕" texto={<>toque em<br />CRIAR</>} />
    </Adesivo>
    <Adesivo x={390} y={800} ini={141} rot={3} cor={AMARELO}>
      <Passo n="2" icone="🖼️" texto={<>foto ou<br />vídeo</>} cor={AMARELO} />
    </Adesivo>
    <Adesivo x={730} y={700} ini={192} rot={-3} cor={VERDE}>
      <Passo n="3" icone="🎙️" texto={<>sua voz ou<br />um áudio</>} cor="#8fd98a" />
    </Adesivo>
    <NotaMao x={120} y={1250} ini={62} tam={48} rot={-3}>
      no painel de figurinhas
    </NotaMao>
    <Legenda
      falas={[
        { de: 0, ate: 57, a: "E dá para ", k: "fazer a sua", b: "." },
        { de: 57, ate: 141, a: "No painel de figurinhas, toca em ", k: "Criar", b: "," },
        { de: 141, ate: 192, a: "escolhe uma ", k: "foto ou um vídeo" },
        { de: 192, ate: 279, a: "e grava ", k: "a sua voz", b: " ou escolhe um áudio." },
      ]}
    />
    <Rodape />
  </Cena>
);

const Cronometro: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  const p = interpolate(emDois(frame), [ini, ini + 100], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const seg = Math.round(p * 10);
  const r = 150;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 400 440" width={440} height={484}>
      <rect x={175} y={4} width={50} height={36} rx={8} fill={TINTA} />
      <circle cx={200} cy={240} r={180} fill="#fbf8f0" stroke={TINTA} strokeWidth={12} />
      <circle
        cx={200}
        cy={240}
        r={r}
        fill="none"
        stroke={VERDE}
        strokeWidth={40}
        strokeDasharray={`${c * p} ${c}`}
        transform="rotate(-90 200 240)"
      />
      <text x={200} y={275} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={110} fill={TINTA}>
        {seg} s
      </text>
    </svg>
  );
};

const C5Limite: React.FC = () => (
  <Cena>
    <Kicker texto="O LIMITE" />
    <Titulo antes="Até " marca="10 segundos" marcaIni={58} tam={104} />
    <Adesivo x={60} y={640} ini={8} rot={-3}>
      <Cronometro ini={58} />
    </Adesivo>
    <Carimbo texto="NOS TESTES" x={600} y={660} ini={14} rot={8} tam={46} cor={LARANJA} />
    <Figurinha x={620} y={880} ini={110} tam={260} rot={5} falanteIni={110} ondasIni={182} />
    <NotaMao x={540} y={1200} ini={182} tam={54} rot={-5}>
      seu bordão
      <br />
      vira figurinha!
    </NotaMao>
    <Legenda
      falas={[
        { de: 0, ate: 109, a: "Nos testes, o limite era de ", k: "10 segundos", b: " de som." },
        { de: 109, ate: 238, a: "Pouco, mas o suficiente para o seu ", k: "bordão", b: " virar figurinha." },
      ]}
    />
    <Rodape />
  </Cena>
);

const C6Silencioso: React.FC = () => (
  <Cena>
    <Kicker texto="E NO SILENCIOSO?" />
    <Titulo antes="Celular no " marca="silencioso" marcaIni={20} tam={104} />
    <Adesivo x={90} y={680} ini={16} rot={-8} cor={AMARELO}>
      <Sino tam={240} />
    </Adesivo>
    <Figurinha x={470} y={720} ini={60} tam={400} rot={4} falanteIni={60} mudo boca="fechada" />
    <Carimbo texto="FICA MUDA" x={130} y={1080} ini={96} rot={-6} tam={66} />
    <NotaMao x={600} y={1200} ini={106} tam={42} rot={-4} cor={LARANJA}>
      (nos testes)
    </NotaMao>
    <Legenda
      falas={[
        { de: 0, ate: 92, a: "E se o celular estiver no ", k: "silencioso", b: "?" },
        { de: 92, ate: 195, a: "Nos testes, a figurinha simplesmente ", k: "fica muda", b: "." },
      ]}
    />
    <Rodape />
  </Cena>
);

const FilaCelulares: React.FC<{ ini: number }> = ({ ini }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const acende = frame >= ini + i * 22;
        return (
          <Celular key={i} x={40 + i * 200} y={820 + (i % 2) * 40} w={170} h={290} ini={20 + i * 4} rot={i % 2 ? 4 : -4} aceso={acende}>
            {acende ? (
              <div style={{ position: "absolute", left: 18, top: 56, transform: `scale(${estalo(frame, ini + i * 22, 6)})` }}>
                <Bichinho tam={100} falando={false} />
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#8c857a" }}>
                …
              </div>
            )}
          </Celular>
        );
      })}
    </>
  );
};

const C7Calma: React.FC = () => (
  <Cena>
    <Kicker texto="AINDA NÃO APARECEU?" />
    <Titulo antes="Calma, " marca="está chegando" marcaIni={133} tam={100} />
    <Carimbo texto="NÃO É DEFEITO" x={540} y={640} ini={70} rot={7} tam={46} cor={VERDE} />
    <FilaCelulares ini={133} />
    <NotaMao x={90} y={1200} ini={234} tam={54} rot={-4}>
      deixe o app atualizado ✓
    </NotaMao>
    <TiraRasgada texto="SEM DATA OFICIAL" x={420} y={1290} ini={325} rot={-3} tam={44} fundo={LARANJA} cor={TINTA} />
    <Legenda
      falas={[
        { de: 0, ate: 60, a: "Ainda não ", k: "apareceu pra você", b: "?" },
        { de: 60, ate: 133, a: "Calma, ", k: "não é defeito", b: " no seu celular." },
        { de: 133, ate: 234, a: "Está chegando ", k: "aos poucos", b: ", uma pessoa de cada vez." },
        { de: 234, ate: 325, a: "Deixa o WhatsApp ", k: "atualizado", b: " e espera," },
        { de: 325, ate: 422, a: "porque a Meta ainda ", k: "não deu data", b: " para chegar a todo mundo." },
      ]}
    />
    <Rodape />
  </Cena>
);

const C8Familia: React.FC = () => {
  const cores = [LARANJA, AMARELO, "#8fd98a", AZUL, "#f5a3c7", LARANJA, "#c9a4f5", AMARELO, "#8fd98a"];
  return (
    <Cena>
      <Kicker texto="SE PREPARA" />
      <Titulo antes="Grupo da " marca="família" marcaIni={68} tam={108} />
      {cores.map((c, i) => (
        <Figurinha
          key={i}
          x={70 + (i % 3) * 320 + (Math.floor(i / 3) % 2) * 40}
          y={630 + Math.floor(i / 3) * 230}
          ini={64 + i * 5}
          tam={190}
          rot={(i % 2 ? 6 : -6) + i}
          cor={c}
          falante={false}
          ondasIni={70 + i * 5}
        />
      ))}
      <Legenda
        falas={[
          { de: 0, ate: 68, a: "Mas pode ", k: "se preparar", b: ":" },
          { de: 68, ate: 166, a: "o grupo da família nunca mais vai ser ", k: "silencioso", b: "." },
        ]}
      />
      <Rodape />
    </Cena>
  );
};

const C9Final: React.FC = () => (
  <Cena>
    <Kicker texto="E VOCÊ?" />
    <Titulo antes="Qual som " marca="você colocaria?" marcaIni={12} tam={96} />
    <Figurinha x={300} y={680} ini={8} tam={400} rot={-4} falanteIni={8} ondasIni={14} />
    <NotaMao x={330} y={1130} ini={85} tam={62} rot={-4}>
      comenta aí ↓
    </NotaMao>
    <TiraRasgada texto="SIGA @HISTORICODEBUSCA" x={90} y={1260} ini={103} rot={-3} tam={46} />
    <Legenda
      falas={[
        { de: 0, ate: 85, a: "Qual som você colocaria ", k: "na sua", b: "?" },
        { de: 85, ate: 103, a: "", k: "Comenta aí", b: "." },
        { de: 103, ate: 211, a: "E me siga para mais ", k: "buscas aleatórias", b: "." },
      ]}
    />
    <Rodape />
  </Cena>
);

const CENAS: { dur: number; el: React.ReactNode }[] = [
  { dur: 160, el: <C1Gancho /> },
  { dur: 243, el: <C2Novidade /> },
  { dur: 249, el: <C3Funciona /> },
  { dur: 279, el: <C4FacaSua /> },
  { dur: 238, el: <C5Limite /> },
  { dur: 195, el: <C6Silencioso /> },
  { dur: 422, el: <C7Calma /> },
  { dur: 166, el: <C8Familia /> },
  { dur: 211, el: <C9Final /> },
];
export const DURACAO_WHATSAPP_SOM = CENAS.reduce((s, c) => s + c.dur, 0);

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

export const VideoWhatsappSom: React.FC<{ semAudio?: boolean }> = ({ semAudio }) => {
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
      {semAudio ? null : <Audio src={staticFile("voxWhatsappSom/mix_final.wav")} />}
      {seqs}
      <TrocaDeFolha cortes={cortes} />
    </AbsoluteFill>
  );
};

export const CapaWhatsappSom: React.FC = () => (
  <Cena>
    <Kicker texto="HISTÓRICO DE BUSCA" />
    <Titulo antes="Figurinha " marca="com som" depois=" chegou?" ini={-20} marcaIni={-20} tam={112} />
    <Figurinha x={230} y={720} ini={-20} tam={520} rot={-5} falanteIni={-20} ondasIni={-20} />
    <TiraRasgada texto="NO WHATSAPP · AOS POUCOS" x={70} y={1330} ini={-20} rot={-4} tam={52} fundo={VERDE} cor={PAPEL} />
    <Rodape />
  </Cena>
);
