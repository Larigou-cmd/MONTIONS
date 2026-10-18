import React from "react";
import { AbsoluteFill } from "remotion";
import { SANS, SERIF } from "../fonts";
import { rgba } from "../lib";
import { EMOJI } from "../aas/ui";

// Pins para o Pinterest (1000×1500, vertical 2:3) inspirados nos vídeos do modelo "aula elegante".
// Imagens estáticas: fundo escuro com brilho na cor do tema, títulos em serifa e cartões arredondados.
const PW = 1000;
const INK = "#f1f5f9",
  DIM = "#94a3b8",
  BG = "#0b1020";
const VERDE = "#4ade80",
  VERM = "#ef4444";

// moldura comum: fundo, selo do topo, título, subtítulo e rodapé com o aviso
const Pin: React.FC<{
  cor: string;
  selo: string;
  titulo: React.ReactNode;
  sub?: React.ReactNode;
  children: React.ReactNode;
}> = ({ cor, selo, titulo, sub, children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 0%, ${rgba(cor, 0.28)} 0%, transparent 55%), radial-gradient(ellipse at 50% 110%, ${rgba(cor, 0.18)} 0%, transparent 50%), ${BG}`,
      fontFamily: SANS,
      color: INK,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 60,
        width: PW,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 4,
          color: cor,
          padding: "10px 26px",
          borderRadius: 40,
          border: `2px solid ${rgba(cor, 0.6)}`,
          background: rgba("#0f172a", 0.6),
        }}
      >
        {selo}
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 130,
        width: PW,
        padding: "0 60px",
        boxSizing: "border-box",
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 64,
        lineHeight: 1.12,
        textShadow: `0 0 30px ${rgba(cor, 0.35)}`,
      }}
    >
      {titulo}
    </div>
    {sub && (
      <div
        style={{
          position: "absolute",
          top: 300,
          width: PW,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 30,
          color: DIM,
        }}
      >
        {sub}
      </div>
    )}
    <div style={{ position: "absolute", top: 370, left: 50, width: PW - 100 }}>
      {children}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 40,
        width: PW,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 600,
        color: DIM,
      }}
    >
      Conteúdo educativo • Consulte um profissional de saúde para orientações.
    </div>
  </AbsoluteFill>
);
const Cartao: React.FC<{
  cor: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ cor, children, style }) => (
  <div
    style={{
      borderRadius: 26,
      border: `2px solid ${rgba(cor, 0.55)}`,
      background: "rgba(15,23,42,0.75)",
      padding: "22px 28px",
      boxShadow: `0 0 28px ${rgba(cor, 0.12)}`,
      ...style,
    }}
  >
    {children}
  </div>
);
const Linha: React.FC<{
  icone: string;
  children: React.ReactNode;
  cor?: string;
}> = ({ icone, children, cor }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      fontSize: 31,
      fontWeight: 600,
      lineHeight: 1.25,
      color: cor ?? INK,
      margin: "10px 0",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 40, flexShrink: 0 }}>
      {icone}
    </span>
    <span>{children}</span>
  </div>
);
const Rotulo: React.FC<{ cor: string; children: React.ReactNode }> = ({
  cor,
  children,
}) => (
  <div
    style={{
      fontWeight: 800,
      fontSize: 26,
      letterSpacing: 3,
      color: cor,
      marginBottom: 6,
    }}
  >
    {children}
  </div>
);

// 1. Jejum ou com comida?
export const PinJejum: React.FC = () => {
  const COR = "#fbbf24";
  return (
    <Pin
      cor={COR}
      selo="GUIA RÁPIDO ☕💊"
      titulo={
        <>
          Remédio em jejum
          <br />
          ou com comida?
        </>
      }
      sub="jejum = 30–60 min antes ou 2 h depois de comer"
    >
      <Cartao cor={VERDE}>
        <Rotulo cor={VERDE}>⏰ EM JEJUM</Rotulo>
        <Linha icone="🦋">
          <b>Levotiroxina</b>: 30–60 min antes do café (nem café preto!)
        </Linha>
        <Linha icone="🔥">
          <b>Omeprazol</b>: 30–60 min antes da 1ª refeição
        </Linha>
        <Linha icone="🦴">
          <b>Alendronato</b>: só com água e sem deitar por 30 min
        </Linha>
        <Linha icone="🩺">
          <b>Captopril</b>: antes das refeições
        </Linha>
      </Cartao>
      <div style={{ height: 22 }} />
      <Cartao cor={COR}>
        <Rotulo cor={COR}>🍽️ COM COMIDA</Rotulo>
        <Linha icone="💊">
          <b>Ibuprofeno</b> e anti-inflamatórios: irritam menos o estômago
        </Linha>
        <Linha icone="🧂">
          <b>Lítio</b>: menos enjoo
        </Linha>
        <Linha icone="🍄">
          <b>Itraconazol</b> (cápsulas): absorve melhor
        </Linha>
      </Cartao>
      <div style={{ height: 22 }} />
      <Cartao cor={VERM}>
        <Rotulo cor={VERM}>🥛 LONGE DO LEITE, FERRO E ANTIÁCIDOS</Rotulo>
        <Linha icone="🧲">
          <b>Tetraciclina</b> e <b>ciprofloxacino</b>: o cálcio "sequestra" o
          remédio
        </Linha>
      </Cartao>
    </Pin>
  );
};

// 2. Tosse seca e remédio de pressão
export const PinTosse: React.FC = () => {
  const COR = "#38bdf8",
    BRADI = "#c084fc";
  return (
    <Pin
      cor={COR}
      selo="REMÉDIO DE PRESSÃO × TOSSE SECA"
      titulo={
        <>
          Tosse que não passa?
          <br />
          Pode ser o seu remédio
        </>
      }
      sub="enalapril • captopril • lisinopril (inibidores da ECA)"
    >
      <Cartao cor={COR}>
        <Rotulo cor={COR}>✂️ A "TESOURA" ECA TEM 2 TRABALHOS</Rotulo>
        <Linha icone="1️⃣">
          fazer <b>angiotensina II</b>, que aperta os vasos
        </Linha>
        <Linha icone="2️⃣">
          destruir a <b style={{ color: BRADI }}>bradicinina</b>
        </Linha>
        <Linha icone="💊">
          o remédio bloqueia a tesoura → a bradicinina acumula e{" "}
          <b>irrita as vias aéreas</b>
        </Linha>
      </Cartao>
      <div style={{ height: 20 }} />
      <Cartao cor={BRADI}>
        <Rotulo cor={BRADI}>✅ COMO RECONHECER</Rotulo>
        <Linha icone="🫁">tosse seca, sem catarro</Linha>
        <Linha icone="🌙">piora à noite ou ao deitar</Linha>
        <Linha icone="🍯">xarope não resolve • ≈ 1 em cada 10</Linha>
      </Cartao>
      <div style={{ height: 20 }} />
      <Cartao cor={VERM} style={{ background: rgba(VERM, 0.12) }}>
        <Linha icone="🚨" cor="#fecaca">
          inchaço de lábios, língua ou garganta = <b>pronto-socorro</b>
        </Linha>
        <Linha icone="✋">
          não pare por conta própria: o médico pode trocar pela{" "}
          <b style={{ color: VERDE }}>família da losartana</b>
        </Linha>
      </Cartao>
    </Pin>
  );
};

// 3. Por que a sinvastatina é à noite?
export const PinSinvaNoite: React.FC = () => {
  const COR = "#2dd4bf",
    NOITE = "#818cf8",
    GORD = "#fbbf24",
    LONGA = "#c084fc";
  // curva de produção de colesterol (6 h → 6 h) com pico de madrugada
  const pts = Array.from({ length: 61 }, (_, i) => {
    const h = 6 + (24 * i) / 60;
    const v = 0.22 + 0.78 * Math.exp(-((h - 26) ** 2) / (2 * 3.2 ** 2));
    return `${40 + (820 * i) / 60},${230 - 190 * v}`;
  }).join(" ");
  return (
    <Pin
      cor={NOITE}
      selo="🌙 SINVASTATINA"
      titulo={
        <>
          Por que a sinvastatina
          <br />é tomada à noite?
        </>
      }
    >
      <Cartao cor={GORD} style={{ padding: "18px 20px" }}>
        <Rotulo cor={GORD}>
          🏭 O FÍGADO PRODUZ MAIS COLESTEROL DE MADRUGADA
        </Rotulo>
        <svg width={880} height={270} style={{ overflow: "visible" }}>
          <rect
            x={40 + (820 * 13) / 24}
            y={20}
            width={(820 * 11) / 24}
            height={210}
            rx={14}
            fill={rgba(NOITE, 0.16)}
          />
          <polyline
            points={pts}
            fill="none"
            stroke={GORD}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <line
            x1={40}
            y1={230}
            x2={860}
            y2={230}
            stroke={DIM}
            strokeWidth={3}
          />
          {[6, 12, 18, 0, 6].map((h, i) => (
            <text
              key={i}
              x={40 + 205 * i}
              y={262}
              textAnchor="middle"
              fontSize={24}
              fontWeight={600}
              fill={DIM}
              fontFamily={SANS}
            >
              {h}h
            </text>
          ))}
          <text
            x={40 + (820 * 18.5) / 24}
            y={62}
            textAnchor="middle"
            fontFamily={EMOJI}
            fontSize={36}
          >
            🌙
          </text>
          <text
            x={40 + (820 * 6) / 24}
            y={62}
            textAnchor="middle"
            fontFamily={EMOJI}
            fontSize={36}
          >
            ☀️
          </text>
        </svg>
      </Cartao>
      <div style={{ height: 20 }} />
      <Cartao cor={COR}>
        <Linha icone="⏱️">
          <b style={{ color: COR }}>Sinvastatina</b>: meia-vida curta, dura
          poucas horas
        </Linha>
        <Linha icone="🌙">
          tomando à noite, o remédio está no auge quando o fígado mais produz
        </Linha>
      </Cartao>
      <div style={{ height: 20 }} />
      <Cartao cor={LONGA}>
        <Linha icone="🕐">
          <b style={{ color: LONGA }}>Atorvastatina</b> e{" "}
          <b style={{ color: LONGA }}>rosuvastatina</b>: meia-vida longa,
          qualquer horário, <b>sempre o mesmo</b>
        </Linha>
      </Cartao>
    </Pin>
  );
};

// 4. Sinvastatina e dor na perna
export const PinSinvaDor: React.FC = () => {
  const COR = "#2dd4bf",
    AMAR = "#facc15";
  const niveis: [string, string, string, string][] = [
    [VERDE, "1", "Dor muscular", "CK normal • a mais comum"],
    [AMAR, "2", "Lesão muscular", "CK alta no exame de sangue"],
    [VERM, "3", "Rabdomiólise (rara)", "fraqueza forte + xixi escuro → PS"],
  ];
  return (
    <Pin
      cor={COR}
      selo="ESTATINAS × DOR MUSCULAR"
      titulo={
        <>
          Sinvastatina e<br />
          dor na perna
        </>
      }
      sub="panturrilha, coxa, quadril ou ombro"
    >
      <Rotulo cor={COR}>OS 3 NÍVEIS</Rotulo>
      {niveis.map(([c, n, t, d]) => (
        <Cartao
          key={n}
          cor={c}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: 56,
              color: c,
              width: 50,
              textAlign: "center",
            }}
          >
            {n}
          </span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 38 }}>
              {t}
            </span>
            <span style={{ fontSize: 27, fontWeight: 600, color: DIM }}>
              {d}
            </span>
          </span>
        </Cartao>
      ))}
      <div style={{ height: 8 }} />
      <Cartao cor={AMAR}>
        <Rotulo cor={AMAR}>⚠️ MAIS RISCO COM</Rotulo>
        <Linha icone="➕">
          doses altas, idade, hipotireoidismo, problema nos rins
        </Linha>
        <Linha icone="🍊">
          claritromicina, alguns antifúngicos, amiodarona e toranja
        </Linha>
      </Cartao>
      <div style={{ height: 16 }} />
      <Cartao cor={VERDE}>
        <Linha icone="✋">
          sentiu dor? <b>não pare sozinho</b>: fale com o médico (exame de CK,
          ajuste de dose ou troca)
        </Linha>
      </Cartao>
    </Pin>
  );
};

// 5. Amoxicilina + clavulanato
export const PinAmoxi: React.FC = () => {
  const COR = "#60a5fa",
    ESC = "#fbbf24",
    BAC = "#f87171";
  return (
    <Pin
      cor={COR}
      selo="ANTIBIÓTICOS"
      titulo={
        <>
          Amoxicilina + clavulanato:
          <br />
          por que juntos?
        </>
      }
    >
      <Cartao cor={COR}>
        <Rotulo cor={COR}>💊 AMOXICILINA</Rotulo>
        <Linha icone="🧱">
          ataca a parede da bactéria, e a bactéria estoura
        </Linha>
      </Cartao>
      <div style={{ height: 18 }} />
      <Cartao cor={BAC}>
        <Rotulo cor={BAC}>🦠 O TRUQUE DA BACTÉRIA</Rotulo>
        <Linha icone="✂️">
          algumas produzem <b style={{ color: BAC }}>beta-lactamase</b>, uma
          enzima que destrói a amoxicilina antes de ela agir
        </Linha>
      </Cartao>
      <div style={{ height: 18 }} />
      <Cartao cor={ESC} style={{ boxShadow: `0 0 34px ${rgba(ESC, 0.25)}` }}>
        <Rotulo cor={ESC}>🛡️ CLAVULANATO = ESCUDO</Rotulo>
        <Linha icone="🔒">trava a beta-lactamase</Linha>
        <Linha icone="✅">
          e a amoxicilina volta a funcionar contra bactérias resistentes
        </Linha>
      </Cartao>
      <div style={{ height: 18 }} />
      <Cartao cor={VERDE}>
        <Linha icone="🍽️">
          tome no início da refeição: ajuda a incomodar menos o estômago
        </Linha>
        <Linha icone="📅">
          use pelo tempo indicado, mesmo se melhorar antes
        </Linha>
      </Cartao>
    </Pin>
  );
};
