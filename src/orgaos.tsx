import {interpolate, useCurrentFrame, random} from 'remotion';
import {cores} from './theme';

type OrgaoProps = {
  tam?: number;
  cor?: string;
  ativo?: number; // 0 a 1: quanto o orgao esta "aceso"
};

const traco = (ativo: number) => ({
  strokeWidth: 7,
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  opacity: interpolate(ativo, [0, 1], [0.45, 1]),
});

/** Alca intestinal: onde as celulas L liberam o GLP-1. */
export const Intestino: React.FC<OrgaoProps> = ({
  tam = 300,
  cor = cores.glp1Claro,
  ativo = 1,
}) => (
  <svg width={tam} height={tam} viewBox="0 0 200 200">
    <path
      d="M40 36 H150 Q172 36 172 58 Q172 78 150 78 H52 Q30 78 30 100 Q30 122 52 122 H150 Q172 122 172 144 Q172 166 150 166 H40"
      stroke={cor}
      style={traco(ativo)}
    />
    <circle cx="150" cy="58" r="6" fill={cor} opacity={ativo} />
    <circle cx="52" cy="100" r="6" fill={cor} opacity={ativo} />
    <circle cx="150" cy="144" r="6" fill={cor} opacity={ativo} />
  </svg>
);

/** Pancreas: celulas beta (insulina) e alfa (glucagon). */
export const Pancreas: React.FC<OrgaoProps> = ({
  tam = 300,
  cor = cores.glp1Claro,
  ativo = 1,
}) => (
  <svg width={tam} height={tam} viewBox="0 0 200 200">
    <path
      d="M24 72 Q58 44 100 58 Q138 70 160 94 Q178 114 168 132 Q156 150 136 138 Q112 122 86 112 Q50 98 24 96 Z"
      stroke={cor}
      style={{...traco(ativo), fill: cor, fillOpacity: 0.12}}
    />
    <circle cx="62" cy="82" r="7" fill={cor} opacity={ativo} />
    <circle cx="100" cy="92" r="7" fill={cor} opacity={ativo} />
    <circle cx="136" cy="110" r="7" fill={cor} opacity={ativo} />
  </svg>
);

/** Estomago: esvaziamento gastrico. */
export const Estomago: React.FC<OrgaoProps> = ({
  tam = 300,
  cor = cores.glp1Claro,
  ativo = 1,
}) => (
  <svg width={tam} height={tam} viewBox="0 0 200 200">
    <path
      d="M74 26 Q74 54 84 66 Q126 70 144 104 Q158 136 132 158 Q102 178 76 158 Q54 140 58 112"
      stroke={cor}
      style={{...traco(ativo), fill: cor, fillOpacity: 0.12}}
    />
    <path d="M132 158 Q148 168 162 160" stroke={cor} style={traco(ativo)} />
  </svg>
);

/** Cerebro: hipotalamo, sinal de saciedade. */
export const Cerebro: React.FC<OrgaoProps> = ({
  tam = 300,
  cor = cores.glp1Claro,
  ativo = 1,
}) => (
  <svg width={tam} height={tam} viewBox="0 0 200 200">
    <path
      d="M100 34 Q62 34 48 60 Q28 72 32 98 Q24 120 44 134 Q52 160 80 160 L80 174 L124 174 L124 158 Q152 158 160 132 Q180 118 170 94 Q176 68 152 58 Q138 34 100 34 Z"
      stroke={cor}
      style={{...traco(ativo), fill: cor, fillOpacity: 0.12}}
    />
    <path d="M100 44 V150" stroke={cor} style={{...traco(ativo), strokeWidth: 4}} />
    <path d="M74 70 Q92 84 74 100" stroke={cor} style={{...traco(ativo), strokeWidth: 4}} />
    <path d="M128 70 Q110 84 128 100" stroke={cor} style={{...traco(ativo), strokeWidth: 4}} />
    <circle cx="100" cy="122" r="9" fill={cor} opacity={ativo} />
  </svg>
);

/** Cadeia peptidica: n esferas ligadas. Base visual das duas moleculas. */
export const Peptideo: React.FC<{
  n?: number;
  cor?: string;
  corFim?: string;
  largura?: number;
  recorte?: number; // 0 a 1: fracao visivel (para animar a clivagem)
  acido?: boolean; // desenha a cauda de acido graxo
}> = ({
  n = 12,
  cor = cores.glp1Claro,
  corFim,
  largura = 760,
  recorte = 1,
  acido = false,
}) => {
  const passo = largura / (n - 1);
  const visiveis = Math.max(1, Math.round(n * recorte));
  return (
    <svg width={largura + 150} height={200} viewBox={`0 0 ${largura + 150} 200`}>
      <path
        d={`M20 100 H${20 + passo * (visiveis - 1)}`}
        stroke={cor}
        strokeWidth={6}
        opacity={0.5}
      />
      {Array.from({length: n}).map((_, i) => {
        const vis = i < visiveis;
        const y = 100 + Math.sin(i * 1.1) * 14;
        return (
          <circle
            key={i}
            cx={20 + passo * i}
            cy={y}
            r={i === n - 1 && corFim ? 20 : 16}
            fill={i === n - 1 && corFim ? corFim : cor}
            opacity={vis ? 1 : 0.08}
          />
        );
      })}
      {acido ? (
        <>
          <path
            d={`M${20 + passo * (n - 1)} 100 q 46 0 62 -30 q 18 -32 56 -18`}
            stroke={cores.gipClaro}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
          <circle cx={20 + passo * (n - 1) + 124} cy={52} r={14} fill={cores.gipClaro} />
        </>
      ) : null}
    </svg>
  );
};

/** Receptor na membrana celular. */
export const Receptor: React.FC<{
  cor?: string;
  ocupado?: number;
  rotulo?: string;
}> = ({cor = cores.glp1Claro, ocupado = 0, rotulo}) => (
  <svg width={220} height={200} viewBox="0 0 220 200">
    <path d="M10 150 H210" stroke={cores.linha} strokeWidth={10} strokeLinecap="round" />
    <path
      d="M78 150 V96 Q78 70 110 70 Q142 70 142 96 V150"
      stroke={cor}
      strokeWidth={8}
      fill={cor}
      fillOpacity={interpolate(ocupado, [0, 1], [0.08, 0.3])}
      strokeLinecap="round"
    />
    <circle
      cx={110}
      cy={62}
      r={26}
      fill={cor}
      opacity={ocupado}
    />
    {rotulo ? (
      <text
        x={110}
        y={186}
        textAnchor="middle"
        fill={cores.tintaSec}
        fontSize={26}
        fontWeight={700}
        fontFamily='"Segoe UI", system-ui, sans-serif'
      >
        {rotulo}
      </text>
    ) : null}
  </svg>
);

/** Particulas subindo: hormonio entrando na circulacao. */
export const Particulas: React.FC<{
  qtd?: number;
  cor?: string;
  inicio?: number;
  area?: {w: number; h: number};
}> = ({qtd = 18, cor = cores.glp1Claro, inicio = 0, area = {w: 900, h: 620}}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={area.w} height={area.h} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: qtd}).map((_, i) => {
        const atraso = inicio + i * 4;
        const t = Math.max(0, frame - atraso);
        const ciclo = 70;
        const fase = (t % ciclo) / ciclo;
        const x = random(`x${i}`) * area.w;
        const y = area.h - fase * area.h;
        const op = t <= 0 ? 0 : Math.sin(fase * Math.PI) * 0.85;
        return <circle key={i} cx={x} cy={y} r={9} fill={cor} opacity={op} />;
      })}
    </svg>
  );
};
