import {Cena, Titulo, Rotulo, Sobe, Forte} from '../ui';
import {cores, tipo} from '../theme';

const pontos = [
  {t: 'O GLP-1 é uma incretina', d: 'liberada pelo intestino depois da refeição'},
  {t: 'Age em quatro frentes', d: 'insulina, glucagon, estômago e saciedade'},
  {t: 'Semaglutida ativa uma via', d: 'apenas o receptor de GLP-1'},
  {
    t: 'Tirzepatida ativa duas',
    d: 'GIP somado ao GLP-1 — e entregou mais perda de peso na comparação direta',
  },
];

export const Fecho: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 28, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="resumo" cor={cores.tintaSec} />
      <Titulo atraso={6}>Em quatro linhas</Titulo>

      <div style={{display: 'flex', flexDirection: 'column', gap: 28, marginTop: 24}}>
        {pontos.map((p, i) => (
          <Sobe key={i} atraso={20 + i * 26} dist={30}>
            <div style={{display: 'flex', gap: 24, alignItems: 'flex-start'}}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: i === 3 ? cores.gipClaro : cores.glp1Claro,
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

      <Sobe atraso={150} dist={20} style={{marginTop: 44}}>
        <div
          style={{
            background: cores.fundoAlt,
            border: `2px solid ${cores.linha}`,
            borderRadius: 20,
            padding: 30,
          }}
        >
          <div style={{fontSize: 31, color: cores.tintaSec, lineHeight: 1.45}}>
            <Forte cor={cores.tinta}>Conteúdo educativo.</Forte> Escolha, dose e
            acompanhamento são individuais e dependem de avaliação clínica. Os dois têm
            contraindicações e efeitos adversos — os gastrointestinais são os mais comuns.
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
          Fontes: SURMOUNT-5 e SURPASS-2
        </div>
      </Sobe>
    </div>
  </Cena>
);
