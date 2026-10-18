import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Rotulo, Cartao, Forte, Sobe} from '../ui';
import {Peptideo} from '../orgaos';
import {cores, tipo} from '../theme';

export const Engenharia: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const mostraAcido = interpolate(frame, [150, 185], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="4 · a engenharia" cor={cores.glp1Claro} />
        <Titulo atraso={6}>Duas modificações mudaram tudo</Titulo>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 10,
            opacity: 0.35 + mostraAcido * 0.65,
          }}
        >
          <Peptideo
            n={10}
            cor={cores.glp1Claro}
            corFim={cores.gipClaro}
            largura={560}
            acido={mostraAcido > 0.5}
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          <Cartao atraso={40} corBorda={cores.glp1}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: cores.glp1Claro,
                width: 90,
                flexShrink: 0,
                textAlign: 'center',
              }}
            >
              1
            </div>
            <div>
              <div
                style={{fontSize: 40, fontWeight: 800, color: cores.tinta, marginBottom: 8}}
              >
                Blindagem contra a DPP-4
              </div>
              <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.32}}>
                Troca de um aminoácido na posição 8. A enzima deixa de reconhecer o sítio de
                clivagem e a molécula sobrevive.
              </div>
            </div>
          </Cartao>

          <Cartao atraso={150} corBorda={cores.gip}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: cores.gipClaro,
                width: 90,
                flexShrink: 0,
                textAlign: 'center',
              }}
            >
              2
            </div>
            <div>
              <div
                style={{fontSize: 40, fontWeight: 800, color: cores.tinta, marginBottom: 8}}
              >
                Cauda de ácido graxo
              </div>
              <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.32}}>
                Essa cauda se liga à <Forte cor={cores.gipClaro}>albumina</Forte> do sangue. A
                molécula fica ancorada, escapa da filtração renal e circula por dias.
              </div>
            </div>
          </Cartao>
        </div>

        <Sobe atraso={280} dist={24} style={{marginTop: 44}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            <span style={{color: cores.alerta}}>2 minutos</span>
            <span style={{color: cores.tintaMuda, fontSize: 40}}>para</span>
            <span style={{color: cores.glp1Claro}}>1 semana</span>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: tipo.micro,
              color: cores.tintaMuda,
              marginTop: 12,
            }}
          >
            uma aplicação subcutânea semanal
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};
