import React from "react";
import { TINTA, AZUL, VERMELHO, LARANJA } from "../voxNvidia/Completo";

// Personagens ORIGINAIS do jogo do dólar (@historicodebusca).
// A nota não copia o desenho de nenhuma cédula real: é um retângulo verde com "$" e carinha.

const VERDE = "#5fa86b";
const VERDE_ESC = "#2f6b3d";
const DOURADO = "#e3b341";

// pernas que correm: fase 0..1 alterna as passadas
const Pernas: React.FC<{
  fase: number;
  x: number;
  y: number;
  cor?: string;
}> = ({ fase, x, y, cor = TINTA }) => {
  const a = Math.sin(fase * Math.PI * 2) * 26;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${a})`}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={46}
          stroke={cor}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M-6 44 L18 44 Q22 52 14 54 L-6 54 Z"
          fill={VERMELHO}
          stroke={TINTA}
          strokeWidth={4}
        />
      </g>
      <g transform={`translate(30 0) rotate(${-a})`}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={46}
          stroke={cor}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M-6 44 L18 44 Q22 52 14 54 L-6 54 Z"
          fill={VERMELHO}
          stroke={TINTA}
          strokeWidth={4}
        />
      </g>
    </g>
  );
};

export const NotaDolar: React.FC<{
  tam?: number;
  fase?: number;
  feliz?: boolean;
}> = ({ tam = 260, fase = 0, feliz = true }) => (
  <svg
    viewBox="0 0 200 190"
    width={tam}
    height={tam * 0.95}
    style={{ overflow: "visible" }}
  >
    <Pernas fase={fase} x={70} y={118} />
    {/* bracinho com punho fechado */}
    <line
      x1={160}
      y1={70}
      x2={190}
      y2={40 + Math.sin(fase * Math.PI * 2) * 8}
      stroke={TINTA}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <line
      x1={40}
      y1={70}
      x2={12}
      y2={92 - Math.sin(fase * Math.PI * 2) * 8}
      stroke={TINTA}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <rect
      x={20}
      y={20}
      width={160}
      height={100}
      rx={10}
      fill={VERDE}
      stroke={TINTA}
      strokeWidth={6}
    />
    <rect
      x={32}
      y={32}
      width={136}
      height={76}
      rx={6}
      fill="none"
      stroke={VERDE_ESC}
      strokeWidth={4}
      strokeDasharray="8 6"
    />
    <text
      x={42}
      y={58}
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={26}
      fill={VERDE_ESC}
    >
      $
    </text>
    <text
      x={146}
      y={102}
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={26}
      fill={VERDE_ESC}
    >
      $
    </text>
    {/* carinha */}
    <circle
      cx={100}
      cy={70}
      r={30}
      fill="#e9f3e1"
      stroke={TINTA}
      strokeWidth={5}
    />
    <circle cx={90} cy={64} r={5} fill={TINTA} />
    <circle cx={110} cy={64} r={5} fill={TINTA} />
    <path
      d="M84 56 L96 60"
      stroke={TINTA}
      strokeWidth={4}
      strokeLinecap="round"
    />
    <path
      d="M116 56 L104 60"
      stroke={TINTA}
      strokeWidth={4}
      strokeLinecap="round"
    />
    {feliz ? (
      <path
        d="M86 78 Q100 92 114 78"
        fill="#fff"
        stroke={TINTA}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M88 84 Q100 76 112 84"
        fill="none"
        stroke={TINTA}
        strokeWidth={4}
        strokeLinecap="round"
      />
    )}
  </svg>
);

export const MoedaReal: React.FC<{ tam?: number; cansada?: boolean }> = ({
  tam = 200,
  cansada = true,
}) => (
  <svg
    viewBox="0 0 200 220"
    width={tam}
    height={tam * 1.1}
    style={{ overflow: "visible" }}
  >
    {/* luvas de goleiro */}
    <circle
      cx={22}
      cy={120}
      r={20}
      fill={AZUL}
      stroke={TINTA}
      strokeWidth={5}
    />
    <circle
      cx={178}
      cy={120}
      r={20}
      fill={AZUL}
      stroke={TINTA}
      strokeWidth={5}
    />
    <line
      x1={40}
      y1={112}
      x2={60}
      y2={104}
      stroke={TINTA}
      strokeWidth={8}
      strokeLinecap="round"
    />
    <line
      x1={160}
      y1={112}
      x2={140}
      y2={104}
      stroke={TINTA}
      strokeWidth={8}
      strokeLinecap="round"
    />
    <line
      x1={80}
      y1={176}
      x2={74}
      y2={212}
      stroke={TINTA}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <line
      x1={120}
      y1={176}
      x2={126}
      y2={212}
      stroke={TINTA}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <circle
      cx={100}
      cy={100}
      r={80}
      fill={DOURADO}
      stroke={TINTA}
      strokeWidth={6}
    />
    <circle
      cx={100}
      cy={100}
      r={64}
      fill="none"
      stroke="#b8862f"
      strokeWidth={4}
    />
    <text
      x={100}
      y={162}
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight={900}
      fontSize={22}
      fill="#8a6420"
    >
      R$
    </text>
    {/* carinha cansada */}
    <path
      d="M70 84 Q80 78 90 84"
      fill="none"
      stroke={TINTA}
      strokeWidth={5}
      strokeLinecap="round"
    />
    <path
      d="M110 84 Q120 78 130 84"
      fill="none"
      stroke={TINTA}
      strokeWidth={5}
      strokeLinecap="round"
    />
    <circle cx={80} cy={94} r={6} fill={TINTA} />
    <circle cx={120} cy={94} r={6} fill={TINTA} />
    {cansada ? (
      <>
        <path
          d="M82 126 Q100 114 118 126"
          fill="none"
          stroke={TINTA}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M138 70 Q146 82 138 90 Q130 82 138 70 Z"
          fill={AZUL}
          stroke={TINTA}
          strokeWidth={2}
        />
      </>
    ) : (
      <path
        d="M82 118 Q100 132 118 118"
        fill="none"
        stroke={TINTA}
        strokeWidth={5}
        strokeLinecap="round"
      />
    )}
  </svg>
);

// zagueiro "Banco Central": prédio com colunas e pernas, carregando um saco de dinheiro
export const ZagueiroBC: React.FC<{ tam?: number; carrinho?: number }> = ({
  tam = 280,
  carrinho = 0,
}) => (
  <svg
    viewBox="0 0 240 220"
    width={tam}
    height={tam * 0.92}
    style={{ overflow: "visible" }}
  >
    <g transform={`rotate(${-carrinho * 62} 120 200)`}>
      <line
        x1={90}
        y1={160}
        x2={80}
        y2={206}
        stroke={TINTA}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <line
        x1={140}
        y1={160}
        x2={150 + carrinho * 50}
        y2={206 - carrinho * 30}
        stroke={TINTA}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d={`M${144 + carrinho * 50} ${200 - carrinho * 30} l26 0 q6 8 -4 12 l-22 0 z`}
        fill={LARANJA}
        stroke={TINTA}
        strokeWidth={4}
      />
      <path
        d="M50 70 L120 30 L190 70 Z"
        fill="#d9d2c1"
        stroke={TINTA}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <rect
        x={56}
        y={70}
        width={128}
        height={90}
        fill="#efe9dc"
        stroke={TINTA}
        strokeWidth={6}
      />
      {[72, 100, 128, 156].map((x) => (
        <rect
          key={x}
          x={x}
          y={80}
          width={12}
          height={70}
          fill="#d9d2c1"
          stroke={TINTA}
          strokeWidth={3}
        />
      ))}
      <rect
        x={70}
        y={50}
        width={100}
        height={18}
        fill="#efe9dc"
        stroke={TINTA}
        strokeWidth={3}
      />
      <text
        x={120}
        y={64}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight={900}
        fontSize={13}
        fill={TINTA}
      >
        BANCO CENTRAL
      </text>
      {/* olhos determinados */}
      <path
        d="M96 100 L110 106"
        stroke={TINTA}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d="M144 100 L130 106"
        stroke={TINTA}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* saco de dinheiro */}
      <g transform="translate(176 96)">
        <path
          d="M18 0 L34 0 L30 12 Q58 24 50 54 Q44 72 26 72 Q8 72 2 54 Q-6 24 22 12 Z"
          fill={DOURADO}
          stroke={TINTA}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <text
          x={26}
          y={52}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={900}
          fontSize={13}
          fill={TINTA}
        >
          US$1bi
        </text>
      </g>
    </g>
  </svg>
);

export const Campo: React.FC<{ w?: number; h?: number }> = ({
  w = 960,
  h = 620,
}) => (
  <svg viewBox="0 0 960 620" width={w} height={h}>
    <rect
      x={10}
      y={10}
      width={940}
      height={600}
      rx={18}
      fill="#5c9a58"
      stroke={TINTA}
      strokeWidth={8}
    />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect
        key={i}
        x={10 + i * 157}
        y={10}
        width={78}
        height={600}
        fill="rgba(255,255,255,0.08)"
      />
    ))}
    <g fill="none" stroke="#f4f1e6" strokeWidth={6}>
      <rect x={40} y={40} width={880} height={540} />
      <line x1={480} y1={40} x2={480} y2={580} />
      <circle cx={480} cy={310} r={80} />
      <rect x={40} y={190} width={110} height={240} />
      <rect x={810} y={190} width={110} height={240} />
    </g>
  </svg>
);

export const Placar: React.FC<{ real: number; dolar: number }> = ({
  real,
  dolar,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 18,
      background: TINTA,
      color: "#efe9dc",
      padding: "12px 24px",
      borderRadius: 12,
      fontFamily: "Inter, sans-serif",
      fontWeight: 900,
      fontSize: 44,
      letterSpacing: "0.04em",
      boxShadow: `8px 8px 0 ${LARANJA}`,
    }}
  >
    <span>REAL</span>
    <span
      style={{
        background: "#efe9dc",
        color: TINTA,
        padding: "0 14px",
        borderRadius: 6,
      }}
    >
      {real}
    </span>
    <span>×</span>
    <span
      style={{
        background: AZUL,
        color: TINTA,
        padding: "0 14px",
        borderRadius: 6,
      }}
    >
      {dolar}
    </span>
    <span>DÓLAR</span>
  </div>
);

export { VERDE, DOURADO };
