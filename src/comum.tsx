import {interpolate, Series, useCurrentFrame} from 'remotion';
import {Cena, Rotulo, Sobe, Forte, useEntrada} from './ui';
import {cores, tipo} from './theme';

/**
 * Pecas compartilhadas pelos videos curtos (TikTok, ~60s).
 * Cada video define um `roteiro` igual ao de Video.tsx e usa VideoEmSerie.
 */
export type Etapa = {nome: string; dur: number; Comp: React.FC<{dur: number}>};

export const duracaoDe = (roteiro: Etapa[]) =>
  roteiro.reduce((soma, c) => soma + c.dur, 0);

export const VideoEmSerie: React.FC<{roteiro: Etapa[]}> = ({roteiro}) => (
  <Series>
    {roteiro.map(({nome, dur, Comp}) => (
      <Series.Sequence key={nome} durationInFrames={dur}>
        <Comp dur={dur} />
      </Series.Sequence>
    ))}
  </Series>
);

/** Abertura de 3-5s: rotulo pequeno + frase de impacto grande. */
export const Gancho: React.FC<{
  dur: number;
  rotulo: string;
  cor: string;
  frase: React.ReactNode;
  apoio?: React.ReactNode;
}> = ({dur, rotulo, cor, frase, apoio}) => {
  const frame = useCurrentFrame();
  const e = useEntrada(4, 12);
  const halo = interpolate(frame, [0, dur], [0, 1]);
  return (
    <Cena dur={dur}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% ${36 + halo * 8}%, ${cor}2e 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 44,
        }}
      >
        <Rotulo texto={rotulo} cor={cor} />
        <div
          style={{
            opacity: e,
            transform: `translateY(${interpolate(e, [0, 1], [60, 0])}px) scale(${interpolate(e, [0, 1], [0.96, 1])})`,
            fontSize: 104,
            fontWeight: 800,
            color: cores.tinta,
            letterSpacing: -3,
            lineHeight: 1.02,
          }}
        >
          {frase}
        </div>
        {apoio ? (
          <Sobe atraso={34} dist={20}>
            <div style={{fontSize: tipo.corpo, color: cores.tintaSec, lineHeight: 1.35}}>
              {apoio}
            </div>
          </Sobe>
        ) : null}
      </div>
    </Cena>
  );
};

/** Fecho: resumo em topicos + caixa de aviso + fontes. */
export const Encerramento: React.FC<{
  dur: number;
  cor: string;
  pontos: {t: string; d: string}[];
  aviso: React.ReactNode;
  fontes: string;
}> = ({dur, cor, pontos, aviso, fontes}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="resumo" cor={cores.tintaSec} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 10}}>
        {pontos.map((p, i) => (
          <Sobe key={i} atraso={8 + i * 18} dist={30}>
            <div style={{display: 'flex', gap: 24, alignItems: 'flex-start'}}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: cor,
                  marginTop: 16,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{fontSize: 42, fontWeight: 800, color: cores.tinta}}>{p.t}</div>
                <div style={{fontSize: 33, color: cores.tintaSec, marginTop: 6, lineHeight: 1.35}}>
                  {p.d}
                </div>
              </div>
            </div>
          </Sobe>
        ))}
      </div>

      <Sobe atraso={20 + pontos.length * 18} dist={20} style={{marginTop: 36}}>
        <div
          style={{
            background: cores.fundoAlt,
            border: `2px solid ${cores.linha}`,
            borderRadius: 20,
            padding: 30,
          }}
        >
          <div style={{fontSize: 31, color: cores.tintaSec, lineHeight: 1.45}}>
            <Forte cor={cores.tinta}>Conteúdo educativo.</Forte> {aviso}
          </div>
        </div>
        <div
          style={{
            fontSize: tipo.micro,
            color: cores.tintaMuda,
            marginTop: 18,
            textAlign: 'center',
          }}
        >
          {fontes}
        </div>
      </Sobe>
    </div>
  </Cena>
);

/** Numero grande com legenda, para "8 horas", "4 g" etc. */
export const NumeroGrande: React.FC<{
  valor: React.ReactNode;
  unidade: string;
  cor: string;
  legenda?: string;
  atraso?: number;
}> = ({valor, unidade, cor, legenda, atraso = 0}) => (
  <Sobe atraso={atraso}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 18, justifyContent: 'center'}}>
      <div style={{fontSize: 170, fontWeight: 800, color: cor, letterSpacing: -6, lineHeight: 1}}>
        {valor}
      </div>
      <div style={{fontSize: 52, color: cores.tintaSec, fontWeight: 700}}>{unidade}</div>
    </div>
    {legenda ? (
      <div style={{textAlign: 'center', fontSize: tipo.micro, color: cores.tintaMuda, marginTop: 8}}>
        {legenda}
      </div>
    ) : null}
  </Sobe>
);
