import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Forte, Contador} from '../ui';
import {Peptideo} from '../orgaos';
import {cores, tipo} from '../theme';

export const Degradacao: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const corte = interpolate(frame, [60, 110], [1, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tesoura = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 32, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="3 · o problema" cor={cores.gipClaro} />
        <Titulo atraso={6}>Por que o hormônio puro não vira remédio</Titulo>

        <div
          style={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <Peptideo n={11} cor={cores.glp1Claro} largura={660} recorte={corte} />
          <div
            style={{
              opacity: tesoura,
              fontSize: 36,
              fontWeight: 800,
              color: cores.alerta,
              border: `2px solid ${cores.alerta}`,
              borderRadius: 999,
              padding: '12px 30px',
            }}
          >
            DPP-4 cliva aqui
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            justifyContent: 'center',
          }}
        >
          <Contador
            para={2}
            atraso={120}
            dur={30}
            style={{
              fontSize: 160,
              fontWeight: 800,
              color: cores.alerta,
              letterSpacing: -6,
            }}
          />
          <div style={{fontSize: 50, color: cores.tintaSec, fontWeight: 700}}>minutos</div>
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: tipo.micro,
            color: cores.tintaMuda,
            marginTop: -18,
          }}
        >
          meia-vida do GLP-1 nativo na circulação
        </div>

        <Corpo atraso={150}>
          A enzima <Forte cor={cores.alerta}>DPP-4</Forte> degrada o GLP-1 quase
          imediatamente. Injetar o hormônio natural seria inútil.
        </Corpo>

        <Corpo atraso={180} cor={cores.tinta}>
          A solução não foi copiar o hormônio, foi{' '}
          <Forte cor={cores.glp1Claro}>reprojetá-lo</Forte>.
        </Corpo>
      </div>
    </Cena>
  );
};
