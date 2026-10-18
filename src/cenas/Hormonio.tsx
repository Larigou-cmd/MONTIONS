import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Forte} from '../ui';
import {Intestino, Particulas} from '../orgaos';
import {cores} from '../theme';

export const Hormonio: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const aceso = interpolate(frame, [30, 70], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 36, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="1 · o hormônio natural" cor={cores.glp1Claro} />
        <Titulo atraso={6}>De onde vem o GLP-1</Titulo>

        <div
          style={{
            position: 'relative',
            height: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Particulas qtd={16} cor={cores.glp1Claro} inicio={40} area={{w: 920, h: 600}} />
          <div style={{transform: 'scale(1.45)'}}>
            <Intestino tam={340} ativo={aceso} />
          </div>
        </div>

        <Corpo atraso={20}>
          Depois de uma refeição, as <Forte cor={cores.glp1Claro}>células L</Forte> do íleo e
          do cólon liberam GLP-1 na circulação.
        </Corpo>

        <Corpo atraso={54}>
          É uma <Forte cor={cores.glp1Claro}>incretina</Forte>: um hormônio intestinal que
          avisa o corpo de que comida chegou.
        </Corpo>
      </div>
    </Cena>
  );
};
