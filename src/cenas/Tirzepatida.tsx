import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Forte, Sobe} from '../ui';
import {Receptor} from '../orgaos';
import {cores, tipo} from '../theme';

export const Tirzepatida: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const ocupaGlp = interpolate(frame, [40, 76], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ocupaGip = interpolate(frame, [76, 112], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="6 · a segunda geração" cor={cores.gipClaro} />
        <Titulo atraso={6} tamanho={76}>
          Tirzepatida
        </Titulo>
        <div style={{fontSize: 40, color: cores.gipClaro, fontWeight: 700, marginTop: -16}}>
          agonista duplo: GIP + GLP-1
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 60,
            margin: '24px 0',
            alignItems: 'flex-end',
          }}
        >
          <div style={{transform: 'scale(1.3)'}}>
            <Receptor cor={cores.glp1Claro} ocupado={ocupaGlp} rotulo="receptor GLP-1" />
          </div>
          <div style={{transform: 'scale(1.3)'}}>
            <Receptor cor={cores.gipClaro} ocupado={ocupaGip} rotulo="receptor GIP" />
          </div>
        </div>

        <Corpo atraso={30}>
          Tem 39 aminoácidos e foi construída sobre a sequência do{' '}
          <Forte cor={cores.gipClaro}>GIP</Forte> — a outra incretina — e não sobre a do
          GLP-1.
        </Corpo>

        <Corpo atraso={100}>
          Ativa as <Forte cor={cores.gipClaro}>duas vias incretínicas</Forte>: soma um segundo
          estímulo à secreção de insulina e age também no tecido adiposo, melhorando o manejo
          de lipídios e a sensibilidade à insulina.
        </Corpo>

        <Sobe atraso={140} dist={24}>
          <div style={{display: 'flex', gap: 60, marginTop: 10}}>
            <div>
              <div style={{fontSize: tipo.micro, color: cores.tintaMuda, letterSpacing: 2}}>
                MEIA-VIDA
              </div>
              <div style={{fontSize: 68, fontWeight: 800, color: cores.tinta}}>~5 dias</div>
            </div>
            <div>
              <div style={{fontSize: tipo.micro, color: cores.tintaMuda, letterSpacing: 2}}>
                APLICAÇÃO
              </div>
              <div style={{fontSize: 68, fontWeight: 800, color: cores.tinta}}>semanal</div>
            </div>
          </div>
        </Sobe>

        <Sobe atraso={170} dist={20} style={{marginTop: 44}}>
          <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.4}}>
            No mercado como Mounjaro e Zepbound.
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};
