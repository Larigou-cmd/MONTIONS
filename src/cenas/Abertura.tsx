import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Sobe, useEntrada, Forte} from '../ui';
import {cores, tipo} from '../theme';

export const Abertura: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const e = useEntrada(8, 13);
  const halo = interpolate(frame, [0, dur], [0, 1]);

  return (
    <Cena dur={dur}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% ${
            34 + halo * 8
          }%, ${cores.glp1}22 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <Rotulo texto="Farmacologia · incretinas" cor={cores.glp1Claro} atraso={0} />

        <div
          style={{
            opacity: e,
            transform: `translateY(${interpolate(e, [0, 1], [70, 0])}px)`,
            fontSize: 190,
            fontWeight: 800,
            color: cores.tinta,
            letterSpacing: -8,
            lineHeight: 0.95,
          }}
        >
          GLP-1
        </div>

        <Titulo atraso={26} tamanho={60}>
          Como funciona o mecanismo de ação
        </Titulo>

        <div style={{height: 2, background: cores.linha, margin: '18px 0'}} />

        <Corpo atraso={44}>
          E por que a <Forte cor={cores.glp1Claro}>semaglutida</Forte> e a{' '}
          <Forte cor={cores.gipClaro}>tirzepatida</Forte> não são a mesma coisa.
        </Corpo>

        <Sobe atraso={62} dist={20}>
          <div style={{fontSize: tipo.micro, color: cores.tintaMuda, marginTop: 30}}>
            Conteúdo educativo · dados de ensaios fase 3
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};
