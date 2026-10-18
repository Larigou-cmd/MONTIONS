import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Forte, Sobe} from '../ui';
import {Receptor} from '../orgaos';
import {cores, tipo} from '../theme';

export const Semaglutida: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const ocupa = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 32, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="5 · primeiro medicamento" cor={cores.glp1Claro} />
        <Titulo atraso={6} tamanho={76}>
          Semaglutida
        </Titulo>
        <div style={{fontSize: 40, color: cores.glp1Claro, fontWeight: 700, marginTop: -16}}>
          agonista único do receptor de GLP-1
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 60,
            margin: '30px 0',
            alignItems: 'flex-end',
          }}
        >
          <div style={{transform: 'scale(1.3)'}}>
            <Receptor cor={cores.glp1Claro} ocupado={ocupa} rotulo="receptor GLP-1" />
          </div>
          <div style={{transform: 'scale(1.3)', opacity: 0.25}}>
            <Receptor cor={cores.tintaMuda} ocupado={0} rotulo="receptor GIP" />
          </div>
        </div>

        <Corpo atraso={30}>
          É um <Forte cor={cores.glp1Claro}>análogo do GLP-1 humano</Forte>, com cerca de 94%
          de homologia. Ativa uma única via: a do GLP-1.
        </Corpo>

        <Sobe atraso={70} dist={24}>
          <div style={{display: 'flex', gap: 60, marginTop: 20}}>
            <div>
              <div style={{fontSize: tipo.micro, color: cores.tintaMuda, letterSpacing: 2}}>
                MEIA-VIDA
              </div>
              <div style={{fontSize: 68, fontWeight: 800, color: cores.tinta}}>~7 dias</div>
            </div>
            <div>
              <div style={{fontSize: tipo.micro, color: cores.tintaMuda, letterSpacing: 2}}>
                APLICAÇÃO
              </div>
              <div style={{fontSize: 68, fontWeight: 800, color: cores.tinta}}>semanal</div>
            </div>
          </div>
        </Sobe>

        <Sobe atraso={100} dist={20} style={{marginTop: 44}}>
          <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.4}}>
            No mercado como Ozempic e Wegovy (injetável) e Rybelsus (via oral).
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};
