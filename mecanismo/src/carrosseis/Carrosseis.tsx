import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Carrosséis de fotos para o feed do Instagram (1080×1350, 4:5), um por vídeo.
// Cada quadro da composição é uma foto. Os vídeos do Modelo 1 usam o visual escuro; o de genéricos usa o PHARMACIST.EXE.
// Textos tirados dos roteiros aprovados (roteiros/*.md), sem informação nova.
export const W4 = 1080,
  H4 = 1350;
const VERM = "#ef4444",
  AMBAR = "#fbbf24",
  AZUL = "#60a5fa",
  VERDE = "#4ade80",
  ROXO = "#a78bfa",
  CINZA = "#94a3b8";

type Item = { e: string; t: React.ReactNode };
type Foto =
  | {
      tipo: "capa";
      cor: string;
      topo: string;
      titulo: React.ReactNode;
      destaque: React.ReactNode;
      sub: string;
    }
  | {
      tipo: "lista";
      cor: string;
      emoji: string;
      titulo: React.ReactNode;
      itens: Item[];
      nota?: string;
    }
  | { tipo: "final"; cor: string };

const Hi: React.FC<{ c: string; children: React.ReactNode }> = ({
  c,
  children,
}) => <span style={{ color: c }}>{children}</span>;

// ---------- visual escuro (Modelo 1) ----------
const FundoEscuro: React.FC<{ cor: string }> = ({ cor }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 1200px 900px at 50% 30%, ${C.bg2} 0%, rgba(7,11,26,0) 70%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 1000px 520px at 50% ${H4 + 80}px, ${rgba(cor, 0.45)} 0%, rgba(0,0,0,0) 70%)`,
      }}
    />
  </AbsoluteFill>
);

const Rodape: React.FC<{ n: number; total: number; cor: string }> = ({
  n,
  total,
  cor,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        bottom: 56,
        left: 80,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 28,
        color: rgba("#ffffff", 0.5),
      }}
    >
      {n}/{total}
    </div>
    {n < total && (
      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 80,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 32,
          color: cor,
        }}
      >
        arrasta ➜
      </div>
    )}
  </>
);

const FotoEscura: React.FC<{
  foto: Foto;
  n: number;
  total: number;
  serie: string;
}> = ({ foto, n, total, serie }) => {
  if (foto.tipo === "capa")
    return (
      <AbsoluteFill>
        <FundoEscuro cor={foto.cor} />
        <div
          style={{
            position: "absolute",
            top: 120,
            width: "100%",
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 6,
            color: foto.cor,
          }}
        >
          {foto.topo}
        </div>
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 70,
            right: 70,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 1.05,
            color: C.ink,
          }}
        >
          {foto.titulo}
        </div>
        <div
          style={{
            position: "absolute",
            top: 560,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {foto.destaque}
        </div>
        <div
          style={{
            position: "absolute",
            top: 1060,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 50,
            lineHeight: 1.25,
            color: C.ink,
          }}
        >
          {foto.sub}
        </div>
        <Rodape n={n} total={total} cor={foto.cor} />
      </AbsoluteFill>
    );
  if (foto.tipo === "final")
    return (
      <AbsoluteFill>
        <FundoEscuro cor={foto.cor} />
        <div
          style={{
            position: "absolute",
            top: 200,
            width: "100%",
            textAlign: "center",
            fontFamily: EMOJI,
            fontSize: 150,
          }}
        >
          👩‍⚕️
        </div>
        <div
          style={{
            position: "absolute",
            top: 420,
            left: 110,
            right: 110,
            padding: "50px 40px",
            borderRadius: 34,
            background: C.box,
            border: `2px solid ${rgba(foto.cor, 0.7)}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 90,
              color: foto.cor,
            }}
          >
            Me siga
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1.3,
              color: C.ink,
              marginTop: 10,
            }}
          >
            para mais dicas de farmacologia e curiosidades sobre a área
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 880,
            width: "100%",
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: C.ink,
          }}
        >
          Salva e manda para alguém 📌
        </div>
        <div
          style={{
            position: "absolute",
            top: 1010,
            left: 100,
            right: 100,
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 40,
            lineHeight: 1.3,
            color: rgba("#ffffff", 0.75),
          }}
        >
          Conteúdo educativo. Consulte um profissional de saúde para
          orientações.
        </div>
        <Rodape n={n} total={total} cor={foto.cor} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <FundoEscuro cor={foto.cor} />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 80,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 5,
          color: rgba(foto.cor, 0.85),
        }}
      >
        {serie}
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          fontFamily: EMOJI,
          fontSize: 130,
          lineHeight: 1,
        }}
      >
        {foto.emoji}
      </div>
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 74,
          lineHeight: 1.12,
          color: C.ink,
        }}
      >
        {foto.titulo}
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 80,
          right: 80,
          padding: "40px 46px",
          borderRadius: 34,
          background: C.box,
          border: `2px solid ${rgba(foto.cor, 0.6)}`,
          boxShadow: "0 16px 44px rgba(0,0,0,.35)",
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {foto.itens.map((it, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
          >
            <span style={{ fontFamily: EMOJI, fontSize: 52, lineHeight: 1.1 }}>
              {it.e}
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 44,
                lineHeight: 1.3,
                color: C.ink,
              }}
            >
              {it.t}
            </span>
          </div>
        ))}
      </div>
      {foto.nota && (
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 38,
            color: rgba("#ffffff", 0.7),
          }}
        >
          {foto.nota}
        </div>
      )}
      <Rodape n={n} total={total} cor={foto.cor} />
    </AbsoluteFill>
  );
};

// disco de glóbulo vermelho para a capa
const Disco: React.FC<{ txt: string; sub: string }> = ({ txt, sub }) => (
  <div
    style={{
      width: 440,
      height: 440,
      borderRadius: 220,
      background:
        "radial-gradient(circle at 45% 40%, #ff8a8a, #dc2626 55%, #7f1d1d)",
      boxShadow: `0 0 90px ${rgba(VERM, 0.55)}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      fontWeight: 900,
      color: "#fff",
    }}
  >
    <span style={{ fontSize: 190, lineHeight: 0.95 }}>{txt}</span>
    <span style={{ fontSize: 64 }}>{sub}</span>
  </div>
);
const EmojiGrande: React.FC<{ e: string }> = ({ e }) => (
  <div style={{ fontFamily: EMOJI, fontSize: 300, lineHeight: 1.3 }}>{e}</div>
);

export const GLOBULO: Foto[] = [
  {
    tipo: "capa",
    cor: VERM,
    topo: "VOCÊ SABIA?",
    titulo: <>Seu glóbulo vermelho vive só</>,
    destaque: <Disco txt="120" sub="DIAS" />,
    sub: "e o fim dele acontece no baço",
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "🦴",
    titulo: (
      <>
        Ele nasce na <Hi c={VERM}>medula óssea</Hi>
      </>
    ),
    itens: [
      {
        e: "📍",
        t: "Dentro de ossos como as vértebras, o esterno, as costelas e a bacia",
      },
      {
        e: "⚡",
        t: (
          <>
            O corpo fabrica <Hi c={VERM}>milhões</Hi> deles a cada segundo
          </>
        ),
      },
    ],
  },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "🫘",
    titulo: (
      <>
        Quem dá a ordem são os <Hi c={AMBAR}>rins</Hi>
      </>
    ),
    itens: [
      { e: "⚠️", t: "Quando falta oxigênio..." },
      {
        e: "💌",
        t: (
          <>
            eles liberam um hormônio, a <Hi c={AZUL}>eritropoetina</Hi>
          </>
        ),
      },
      { e: "🏭", t: "que manda a medula produzir mais" },
    ],
  },
  {
    tipo: "lista",
    cor: ROXO,
    emoji: "🔴",
    titulo: (
      <>
        Ele abre mão do <Hi c={ROXO}>núcleo</Hi>
      </>
    ),
    itens: [
      { e: "📦", t: "Assim cabe em tudo quanto é lugar" },
      {
        e: "💿",
        t: (
          <>
            Vira um disco cheio de <Hi c={VERM}>hemoglobina</Hi>
          </>
        ),
      },
      { e: "🫁", t: "que carrega o oxigênio" },
    ],
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "💥",
    titulo: (
      <>
        O fim acontece no <Hi c={VERM}>baço</Hi>
      </>
    ),
    itens: [
      { e: "⏳", t: "Com o tempo, ele vai ficando frágil" },
      {
        e: "📏",
        t: (
          <>
            Precisa se espremer por espaços de <Hi c={AMBAR}>3 µm</Hi>, sendo
            que ele mede <Hi c={AMBAR}>8 µm</Hi>
          </>
        ),
      },
      { e: "💔", t: "O velho não aguenta e se rompe" },
    ],
  },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "♻️",
    titulo: <>Nada se perde</>,
    itens: [
      {
        e: "🧲",
        t: (
          <>
            O <Hi c={AMBAR}>ferro</Hi> volta para a medula e vira glóbulo novo
          </>
        ),
      },
      {
        e: "🟡",
        t: (
          <>
            O resto da hemoglobina vira <Hi c={AMBAR}>bilirrubina</Hi>, que dá a
            cor marrom das fezes
          </>
        ),
      },
    ],
  },
  {
    tipo: "lista",
    cor: ROXO,
    emoji: "🧪",
    titulo: <>E é por isso que...</>,
    itens: [
      {
        e: "🩸",
        t: (
          <>
            a <Hi c={ROXO}>hemoglobina glicada</Hi> (HbA1c)
          </>
        ),
      },
      {
        e: "📅",
        t: (
          <>
            mostra a média da glicose dos <Hi c={ROXO}>últimos 3 meses</Hi>
          </>
        ),
      },
    ],
  },
  { tipo: "final", cor: VERM },
];

export const FUMACA: Foto[] = [
  {
    tipo: "capa",
    cor: CINZA,
    topo: "VOCÊ SABIA?",
    titulo: (
      <>
        Por que a fumaça faz <Hi c={VERM}>desmaiar</Hi>?
      </>
    ),
    destaque: <EmojiGrande e="💨" />,
    sub: "num incêndio, muita gente não se machuca pelo fogo, e sim pela fumaça",
  },
  {
    tipo: "lista",
    cor: CINZA,
    emoji: "☠️",
    titulo: (
      <>
        O culpado: <Hi c={VERM}>monóxido de carbono</Hi>
      </>
    ),
    itens: [
      { e: "👁️", t: "Você não vê" },
      { e: "👃", t: "e nem sente o cheiro" },
    ],
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "🔴",
    titulo: (
      <>
        Ele rouba o lugar do <Hi c={AZUL}>oxigênio</Hi>
      </>
    ),
    itens: [
      {
        e: "🧩",
        t: "Se encaixa na hemoglobina, exatamente no mesmo lugar do oxigênio",
      },
      {
        e: "🧲",
        t: (
          <>
            Gruda cerca de <Hi c={VERM}>250 vezes</Hi> mais forte
          </>
        ),
      },
      {
        e: "🧠",
        t: "O oxigênio não chega aos tecidos, e o cérebro é um dos primeiros a sentir",
      },
    ],
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "😵",
    titulo: (
      <>
        O corpo <Hi c={VERM}>não percebe</Hi>
      </>
    ),
    itens: [
      { e: "🩸", t: "O sangue continua vermelho" },
      { e: "🟣", t: "A pessoa não fica roxa" },
      { e: "🫁", t: "A respiração nem acelera" },
      { e: "💤", t: "Ela fica confusa e desmaia antes de entender o perigo" },
    ],
  },
  {
    tipo: "lista",
    cor: ROXO,
    emoji: "🧪",
    titulo: (
      <>
        E tem o <Hi c={ROXO}>cianeto</Hi>
      </>
    ),
    itens: [
      { e: "🔥", t: "Sai quando plástico e espuma queimam" },
      { e: "🚫", t: "Impede as células de usar o oxigênio que ainda resta" },
      {
        e: "📟",
        t: "Até o oxímetro de dedo pode enganar e mostrar um valor normal",
      },
    ],
  },
  {
    tipo: "lista",
    cor: AZUL,
    emoji: "💉",
    titulo: <>O tratamento</>,
    itens: [
      {
        e: "😷",
        t: (
          <>
            <Hi c={AZUL}>Oxigênio puro</Hi>, que empurra o monóxido para fora da
            hemoglobina
          </>
        ),
      },
      {
        e: "🏥",
        t: (
          <>
            Para o cianeto existe antídoto: a{" "}
            <Hi c={VERDE}>hidroxocobalamina</Hi>, uma forma de vitamina B12
          </>
        ),
      },
    ],
  },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "🚒",
    titulo: <>Num incêndio</>,
    itens: [
      {
        e: "🧎",
        t: (
          <>
            Saia <Hi c={AMBAR}>abaixado</Hi>, longe da fumaça
          </>
        ),
      },
      {
        e: "📞",
        t: (
          <>
            Ligue para os bombeiros: <Hi c={VERM}>193</Hi>
          </>
        ),
      },
    ],
  },
  { tipo: "final", cor: AZUL },
];

export const VENCIDO: Foto[] = [
  {
    tipo: "capa",
    cor: VERM,
    topo: "MITO OU VERDADE?",
    titulo: (
      <>
        Remédio <Hi c={VERM}>vencido</Hi> vira veneno?
      </>
    ),
    destaque: <EmojiGrande e="💊☠️" />,
    sub: "na maioria das vezes, não. Mas isso não quer dizer que pode tomar",
  },
  {
    tipo: "lista",
    cor: VERDE,
    emoji: "📉",
    titulo: (
      <>
        Ele vai <Hi c={VERDE}>perdendo a força</Hi>
      </>
    ),
    itens: [
      { e: "📅", t: "A data de validade é o limite que o fabricante garante" },
      { e: "✅", t: "Até ali, a dose está certa" },
    ],
  },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "⚠️",
    titulo: (
      <>
        Remédio fraco = <Hi c={VERM}>perigo</Hi>
      </>
    ),
    itens: [
      { e: "💉", t: "Uma insulina que não baixa a glicose" },
      {
        e: "🦠",
        t: "Um antibiótico que não mata a bactéria: a infecção continua",
      },
      { e: "🛡️", t: "e a bactéria pode ficar mais resistente" },
    ],
  },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "💧",
    titulo: (
      <>
        Os <Hi c={AMBAR}>líquidos</Hi> são os mais delicados
      </>
    ),
    itens: [
      {
        e: "🧴",
        t: "Xaropes, colírios e antibióticos em suspensão podem se contaminar com fungos e bactérias",
      },
      {
        e: "🔓",
        t: (
          <>
            Depois de aberto ou preparado, muitos têm validade{" "}
            <Hi c={AMBAR}>bem menor</Hi>
          </>
        ),
      },
      { e: "📄", t: "Está escrito na bula" },
    ],
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "📜",
    titulo: <>O caso que fez mal de verdade</>,
    itens: [
      {
        e: "💊",
        t: (
          <>
            Um antibiótico antigo, a <Hi c={AMBAR}>tetraciclina</Hi>
          </>
        ),
      },
      { e: "🕰️", t: "Numa fórmula dos anos 60 que nem é mais vendida" },
    ],
  },
  {
    tipo: "lista",
    cor: VERDE,
    emoji: "✋",
    titulo: (
      <>
        Venceu? <Hi c={VERM}>Não tome</Hi>
      </>
    ),
    itens: [
      { e: "🚫", t: "Não jogue no lixo, na pia nem no vaso" },
      {
        e: "♻️",
        t: (
          <>
            Leve a um <Hi c={VERDE}>ponto de coleta</Hi>: muitas farmácias têm
          </>
        ),
      },
    ],
  },
  { tipo: "final", cor: VERDE },
];

export const ALCOOL: Foto[] = [
  { tipo: "capa", cor: AMBAR, topo: "VOCÊ SABIA?", titulo: <>Por que a <Hi c={AMBAR}>cerveja</Hi> dá tanto xixi?</>, destaque: <EmojiGrande e="🍺🚽" />, sub: "não é só por causa do líquido: tem um hormônio nessa história" },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "🫘",
    titulo: <>Lembra dos <Hi c={AMBAR}>rins</Hi>?</>,
    itens: [
      { e: "🧽", t: "Eles filtram o sangue e devolvem quase toda a água" },
      { e: "🎛️", t: <>Quem decide quanta água volta é o <Hi c={AZUL}>ADH</Hi>, o hormônio antidiurético (vasopressina)</> },
    ],
  },
  {
    tipo: "lista",
    cor: ROXO,
    emoji: "🧠",
    titulo: <>Ele vem do <Hi c={ROXO}>cérebro</Hi></>,
    itens: [
      { e: "🏭", t: <>Fabricado no <Hi c={ROXO}>hipotálamo</Hi></> },
      { e: "📤", t: <>Liberado pela <Hi c={AZUL}>hipófise</Hi>, na base do cérebro</> },
    ],
  },
  {
    tipo: "lista",
    cor: AZUL,
    emoji: "🚪",
    titulo: <>Ele abre <Hi c={AZUL}>portas de água</Hi></>,
    itens: [
      { e: "📍", t: "No fim do caminho dentro do rim, no ducto coletor" },
      { e: "💧", t: <>Abre canais de água, as <Hi c={AZUL}>aquaporinas</Hi>, e a água volta para o sangue</> },
    ],
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "🍺",
    titulo: <>O álcool <Hi c={VERM}>desliga</Hi> o ADH</>,
    itens: [
      { e: "🚫", t: "O álcool inibe a liberação desse hormônio" },
      { e: "🚪", t: "Sem ADH, os canais ficam fechados" },
      { e: "➡️", t: <>A água não volta e segue direto para a <Hi c={AMBAR}>bexiga</Hi></> },
    ],
  },
  {
    tipo: "lista",
    cor: AZUL,
    emoji: "🚽",
    titulo: <>Resultado</>,
    itens: [
      { e: "🚻", t: <>Mais xixi, e <Hi c={AMBAR}>mais claro</Hi></> },
      { e: "🥵", t: "A perda de água pode deixar a boca seca e dar mais sede no dia seguinte" },
      { e: "💧", t: <>Dica: <Hi c={AZUL}>intercale a bebida com água</Hi></> },
    ],
  },
  {
    tipo: "lista",
    cor: VERDE,
    emoji: "💊",
    titulo: <>Toma remédio?</>,
    itens: [
      { e: "🩺", t: "Para pressão ou diurético?" },
      { e: "💬", t: <>Converse com o <Hi c={VERDE}>médico ou o farmacêutico</Hi> antes de beber</> },
    ],
  },
  { tipo: "final", cor: AMBAR },
];

export const NASAL: Foto[] = [
  { tipo: "capa", cor: AZUL, topo: "MITO OU VERDADE?", titulo: <>Descongestionante nasal <Hi c={VERM}>vicia</Hi>?</>, destaque: <EmojiGrande e="👃💧" />, sub: "para quem pinga todo dia e, sem ele, não respira" },
  {
    tipo: "lista",
    cor: AZUL,
    emoji: "💧",
    titulo: <>Como ele <Hi c={AZUL}>desentope</Hi></>,
    itens: [
      { e: "🧪", t: <>Nafazolina e oximetazolina <Hi c={AZUL}>apertam os vasos</Hi> do nariz</> },
      { e: "😮‍💨", t: "A mucosa desincha, e o nariz desentope em minutos" },
    ],
  },
  {
    tipo: "lista",
    cor: VERM,
    emoji: "⏳",
    titulo: <>O problema: usar <Hi c={VERM}>todo dia</Hi></>,
    itens: [
      { e: "🎈", t: "Quando o efeito passa, os vasos se abrem ainda mais do que antes" },
      { e: "😤", t: <>É o <Hi c={VERM}>efeito rebote</Hi>: o nariz entope de novo, e pior</> },
    ],
  },
  {
    tipo: "lista",
    cor: ROXO,
    emoji: "🔄",
    titulo: <>Vira um <Hi c={ROXO}>ciclo</Hi></>,
    itens: [
      { e: "💧", t: "A pessoa pinga outra vez..." },
      { e: "⏱️", t: "...e o efeito dura cada vez menos" },
      { e: "🏷️", t: <>Isso tem nome: <Hi c={ROXO}>rinite medicamentosa</Hi></> },
    ],
  },
  {
    tipo: "lista",
    cor: AZUL,
    emoji: "📄",
    titulo: <>Não é vício de droga</>,
    itens: [
      { e: "👃", t: <>É o nariz que <Hi c={AZUL}>se acostuma</Hi> com o remédio</> },
      { e: "📅", t: <>A bula avisa: no máximo <Hi c={AMBAR}>3 a 5 dias seguidos</Hi></> },
    ],
  },
  {
    tipo: "lista",
    cor: AMBAR,
    emoji: "👶",
    titulo: <>Atenção com as <Hi c={AMBAR}>crianças</Hi></>,
    itens: [
      { e: "⚠️", t: <>A nafazolina <Hi c={AMBAR}>não é indicada para menores de 12 anos</Hi></> },
      { e: "☠️", t: "E é uma causa comum de intoxicação nos pequenos" },
    ],
  },
  {
    tipo: "lista",
    cor: VERDE,
    emoji: "🧴",
    titulo: <>E o <Hi c={VERDE}>soro fisiológico</Hi>?</>,
    itens: [
      { e: "✅", t: "Não causa esse efeito, e pode ajudar a limpar o nariz" },
      { e: "🩺", t: <>Preso no ciclo? <Hi c={VERDE}>Procure um médico</Hi>: existem tratamentos para sair dele</> },
    ],
  },
  { tipo: "final", cor: AZUL },
];

// ---------- genéricos: visual PHARMACIST.EXE ----------
const PX = "'Press Start TwoP', monospace",
  VT = "'VTThreeTwoThree', monospace";
const G = "#39ff6a",
  A = "#ffc23d",
  R = "#ff4d6d",
  CY = "#3de0ff",
  BG = "#020c06",
  WH = "#eafff0";
type Gen =
  | { tipo: "capa" }
  | {
      tipo: "mito";
      n: number;
      frase: string;
      verdade: boolean;
      itens: string[];
    }
  | { tipo: "final" };
export const GENERICOS: Gen[] = [
  { tipo: "capa" },
  {
    tipo: "mito",
    n: 1,
    frase: "é mais fraco",
    verdade: false,
    itens: [
      "Mesmo princípio ativo, mesma dose e mesma forma do remédio de marca",
      "Para ser aprovado pela Anvisa, passa no teste de bioequivalência: chega no sangue na mesma quantidade e velocidade",
    ],
  },
  {
    tipo: "mito",
    n: 2,
    frase: "só tem 80% do remédio",
    verdade: false,
    itens: [
      "80% a 125% é uma regra estatística do teste",
      "Não é a quantidade de remédio no comprimido",
    ],
  },
  {
    tipo: "mito",
    n: 3,
    frase: "é mais barato porque é pior",
    verdade: false,
    itens: [
      "Não precisa repetir a pesquisa nem pagar a propaganda da marca",
      "Por lei, o preço máximo é pelo menos 35% menor",
    ],
  },
  {
    tipo: "mito",
    n: 4,
    frase: "o farmacêutico pode trocar",
    verdade: true,
    itens: [
      "Pode trocar o de marca pelo genérico",
      "A não ser que o médico escreva na receita que não autoriza a troca",
    ],
  },
  {
    tipo: "mito",
    n: 5,
    frase: "genérico e similar são iguais",
    verdade: false,
    itens: [
      "O similar tem nome de marca",
      "O genérico tem o nome do princípio ativo e a faixa amarela com a letra G",
    ],
  },
  {
    tipo: "mito",
    n: 6,
    frase: "cor e formato podem mudar",
    verdade: true,
    itens: [
      "Mudam os ingredientes que não são o remédio, como corantes e lactose",
      "Tem alergia ou intolerância? Confira na bula",
    ],
  },
  { tipo: "final" },
];

const Caixa: React.FC<{
  cor: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ cor, children, style }) => (
  <div
    style={{
      border: `5px solid ${cor}`,
      boxShadow: `0 0 26px ${rgba(cor, 0.5)}, inset 0 0 20px ${rgba(cor, 0.12)}`,
      background: "rgba(2,20,10,0.9)",
      padding: "34px 40px",
      ...style,
    }}
  >
    {children}
  </div>
);
const Carimbo: React.FC<{ txt: string; cor: string; rot?: number }> = ({
  txt,
  cor,
  rot = -6,
}) => (
  <div
    style={{
      display: "inline-block",
      transform: `rotate(${rot}deg)`,
      border: `7px solid ${cor}`,
      padding: "18px 34px",
      fontFamily: PX,
      fontSize: 54,
      color: cor,
      textShadow: `0 0 18px ${cor}`,
      boxShadow: `0 0 24px ${rgba(cor, 0.5)}`,
      background: "rgba(0,0,0,0.55)",
    }}
  >
    {txt}
  </div>
);
const FundoExe: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 900px 900px at 50% 40%, #062a14, ${BG})`,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 96,
        background: "rgba(0,10,4,0.92)",
        borderBottom: `4px solid ${G}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 34,
        left: 40,
        fontFamily: PX,
        fontSize: 26,
        color: G,
        textShadow: `0 0 10px ${G}`,
      }}
    >
      C:\&gt; GENERICO.EXE
    </div>
  </AbsoluteFill>
);
const RodapeExe: React.FC<{ n: number; total: number }> = ({ n, total }) => (
  <>
    <div
      style={{
        position: "absolute",
        bottom: 52,
        left: 60,
        fontFamily: PX,
        fontSize: 22,
        color: rgba(G, 0.6),
      }}
    >
      {n}/{total}
    </div>
    {n < total && (
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 60,
          fontFamily: VT,
          fontSize: 46,
          color: A,
        }}
      >
        arrasta &gt;&gt;
      </div>
    )}
  </>
);
const FotoGenerico: React.FC<{ g: Gen; n: number; total: number }> = ({
  g,
  n,
  total,
}) => (
  <AbsoluteFill>
    <FundoExe />
    {g.tipo === "capa" && (
      <>
        <div
          style={{
            position: "absolute",
            top: 190,
            width: "100%",
            textAlign: "center",
            fontFamily: VT,
            fontSize: 200,
            lineHeight: 0.95,
            color: G,
            textShadow: `0 0 26px ${G}`,
          }}
        >
          GENÉRICO
          <br />
          <span style={{ color: A, textShadow: `0 0 26px ${A}` }}>PRESTA?</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 640,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 70,
          }}
        >
          <Carimbo txt="MITO" cor={R} rot={-8} />
          <Carimbo txt="VERDADE" cor={G} rot={6} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 900,
            width: "100%",
            textAlign: "center",
            fontFamily: VT,
            fontSize: 64,
            color: WH,
          }}
        >
          6 dúvidas que todo mundo tem
        </div>
      </>
    )}
    {g.tipo === "mito" && (
      <>
        <div
          style={{
            position: "absolute",
            top: 160,
            width: "100%",
            textAlign: "center",
            fontFamily: PX,
            fontSize: 64,
            color: G,
            textShadow: `0 0 18px ${G}`,
          }}
        >
          #{g.n}
        </div>
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
            textAlign: "center",
            fontFamily: VT,
            fontSize: 70,
            lineHeight: 1.05,
            color: A,
          }}
        >
          &gt; "{g.frase}"
        </div>
        <div
          style={{
            position: "absolute",
            top: 440,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Carimbo
            txt={g.verdade ? "VERDADE" : "MITO"}
            cor={g.verdade ? G : R}
          />
        </div>
        <Caixa
          cor={g.verdade ? G : CY}
          style={{ position: "absolute", top: 640, left: 70, right: 70 }}
        >
          {g.itens.map((t, i) => (
            <div
              key={i}
              style={{
                fontFamily: VT,
                fontSize: 56,
                lineHeight: 1.1,
                color: WH,
                marginTop: i ? 26 : 0,
              }}
            >
              <span style={{ color: g.verdade ? G : CY }}>&gt; </span>
              {t}
            </div>
          ))}
        </Caixa>
      </>
    )}
    {g.tipo === "final" && (
      <>
        <Caixa
          cor={G}
          style={{
            position: "absolute",
            top: 300,
            left: 70,
            right: 70,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: VT,
              fontSize: 40,
              color: rgba(G, 0.7),
              textAlign: "left",
            }}
          >
            C:\&gt; seguir.exe
          </div>
          <div
            style={{
              fontFamily: PX,
              fontSize: 84,
              color: G,
              textShadow: `0 0 22px ${G}`,
              margin: "30px 0",
            }}
          >
            ME SIGA
          </div>
          <div style={{ fontFamily: VT, fontSize: 56, color: WH }}>
            para mais dicas de farmacologia
          </div>
          <div style={{ fontFamily: VT, fontSize: 56, color: A }}>
            e curiosidades sobre a área
          </div>
        </Caixa>
        <div
          style={{
            position: "absolute",
            top: 860,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: VT,
            fontSize: 50,
            lineHeight: 1.1,
            color: WH,
          }}
        >
          Conteúdo educativo. Consulte um profissional de saúde para
          orientações.
        </div>
        <div
          style={{
            position: "absolute",
            top: 1030,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: VT,
            fontSize: 38,
            color: rgba(WH, 0.6),
          }}
        >
          Ref.: Lei 9.787/1999 · RDC Anvisa 16/2007 · Idec · CFF
        </div>
      </>
    )}
    <RodapeExe n={n} total={total} />
  </AbsoluteFill>
);

// ---------- composições ----------
const Escuro = (fotos: Foto[], serie: string) => {
  const Comp: React.FC = () => {
    const f = useCurrentFrame();
    return (
      <FotoEscura
        foto={fotos[f]}
        n={f + 1}
        total={fotos.length}
        serie={serie}
      />
    );
  };
  return Comp;
};
export const CarrosselGlobulo = Escuro(GLOBULO, "FISIOLOGIA CURIOSA");
export const CarrosselFumaca = Escuro(FUMACA, "FISIOLOGIA CURIOSA");
export const CarrosselVencido = Escuro(VENCIDO, "FARMÁCIA SEM MITOS");
export const CarrosselAlcool = Escuro(ALCOOL, "FISIOLOGIA CURIOSA");
export const CarrosselNasal = Escuro(NASAL, "FARMÁCIA SEM MITOS");
export const CarrosselGenericos: React.FC = () => {
  const f = useCurrentFrame();
  return <FotoGenerico g={GENERICOS[f]} n={f + 1} total={GENERICOS.length} />;
};
