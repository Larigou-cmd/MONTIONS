import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {cores, tipo, MARGEM} from './theme';

/** Fade de entrada e saida para cada cena. `dur` e a duracao da cena em frames. */
export const Cena: React.FC<{dur: number; children: React.ReactNode}> = ({
  dur,
  children,
}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10, dur - 12, dur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: cores.fundo,
        fontFamily: tipo.familia,
        padding: MARGEM,
        opacity: op,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Mola de entrada padrao, com atraso em frames. */
export const useEntrada = (atraso = 0, damping = 16) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - atraso, fps, config: {damping}});
};

/** Sobe e aparece. */
export const Sobe: React.FC<{
  atraso?: number;
  dist?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({atraso = 0, dist = 40, children, style}) => {
  const e = useEntrada(atraso);
  return (
    <div
      style={{
        opacity: e,
        transform: `translateY(${interpolate(e, [0, 1], [dist, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Numero que conta de 0 ate `para`. */
export const Contador: React.FC<{
  para: number;
  atraso?: number;
  dur?: number;
  casas?: number;
  sufixo?: string;
  prefixo?: string;
  style?: React.CSSProperties;
}> = ({para, atraso = 0, dur = 45, casas = 0, sufixo = '', prefixo = '', style}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [atraso, atraso + dur], [0, para], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {prefixo}
      {v.toFixed(casas).replace('.', ',')}
      {sufixo}
    </span>
  );
};

export const Rotulo: React.FC<{
  texto: string;
  cor?: string;
  atraso?: number;
}> = ({texto, cor = cores.tintaMuda, atraso = 0}) => (
  <Sobe atraso={atraso} dist={16}>
    <div
      style={{
        fontSize: tipo.micro,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: cor,
        fontWeight: 700,
      }}
    >
      {texto}
    </div>
  </Sobe>
);

export const Titulo: React.FC<{
  children: React.ReactNode;
  atraso?: number;
  tamanho?: number;
}> = ({children, atraso = 0, tamanho = tipo.subtitulo}) => (
  <Sobe atraso={atraso}>
    <div
      style={{
        fontSize: tamanho,
        fontWeight: 800,
        color: cores.tinta,
        lineHeight: 1.12,
        letterSpacing: -1,
      }}
    >
      {children}
    </div>
  </Sobe>
);

export const Corpo: React.FC<{
  children: React.ReactNode;
  atraso?: number;
  cor?: string;
}> = ({children, atraso = 0, cor = cores.tintaSec}) => (
  <Sobe atraso={atraso} dist={24}>
    <div
      style={{
        fontSize: tipo.corpo,
        color: cor,
        lineHeight: 1.4,
        fontWeight: 400,
      }}
    >
      {children}
    </div>
  </Sobe>
);

/** Destaque colorido inline, para amarrar palavra-chave a cor da entidade. */
export const Forte: React.FC<{cor: string; children: React.ReactNode}> = ({
  cor,
  children,
}) => <strong style={{color: cor, fontWeight: 700}}>{children}</strong>;

/** Cartao com borda, usado nas listas de acoes. */
export const Cartao: React.FC<{
  atraso?: number;
  corBorda?: string;
  children: React.ReactNode;
}> = ({atraso = 0, corBorda = cores.linha, children}) => {
  const e = useEntrada(atraso, 18);
  return (
    <div
      style={{
        opacity: e,
        transform: `translateX(${interpolate(e, [0, 1], [-50, 0])}px)`,
        background: cores.superficie,
        border: `2px solid ${corBorda}`,
        borderRadius: 24,
        padding: '32px 36px',
        display: 'flex',
        gap: 28,
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
};
