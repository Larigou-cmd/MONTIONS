import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Rotulo, Cartao, Forte} from '../ui';
import {Pancreas, Estomago, Cerebro} from '../orgaos';
import {cores, tipo} from '../theme';

type Icone = 'pancreas' | 'estomago' | 'cerebro';

const itens: {icone: Icone; titulo: string; texto: string}[] = [
  {
    icone: 'pancreas',
    titulo: 'Insulina sob demanda',
    texto:
      'Estimula as células beta, mas só quando a glicemia está alta. Essa dependência da glicose é o que mantém baixo o risco de hipoglicemia.',
  },
  {
    icone: 'pancreas',
    titulo: 'Menos glucagon',
    texto:
      'Reduz a secreção das células alfa, diminuindo a produção hepática de glicose.',
  },
  {
    icone: 'estomago',
    titulo: 'Estômago mais lento',
    texto:
      'Retarda o esvaziamento gástrico: a glicose entra de forma gradual e a saciedade dura mais.',
  },
  {
    icone: 'cerebro',
    titulo: 'Saciedade central',
    texto:
      'Age no hipotálamo e em áreas de recompensa, reduzindo apetite e vontade de comer.',
  },
];

const IconeOrgao: React.FC<{nome: Icone; ativo: number}> = ({nome, ativo}) => {
  if (nome === 'estomago') return <Estomago tam={112} ativo={ativo} />;
  if (nome === 'cerebro') return <Cerebro tam={112} ativo={ativo} />;
  return <Pancreas tam={112} ativo={ativo} />;
};

export const Acoes: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const passo = 150;

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 28, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="2 · as quatro ações" cor={cores.glp1Claro} />
        <Titulo atraso={6}>O que o GLP-1 faz</Titulo>

        <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 14}}>
          {itens.map((it, i) => {
            const entra = 24 + i * passo;
            const foco = interpolate(
              frame,
              [entra, entra + 30, entra + passo, entra + passo + 40],
              [0, 1, 1, 0.35],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            );
            return (
              <Cartao
                key={i}
                atraso={entra}
                corBorda={foco > 0.6 ? cores.glp1 : cores.linha}
              >
                <div style={{flexShrink: 0, opacity: 0.4 + foco * 0.6}}>
                  <IconeOrgao nome={it.icone} ativo={foco} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 800,
                      color: cores.tinta,
                      marginBottom: 8,
                    }}
                  >
                    {it.titulo}
                  </div>
                  <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.32}}>
                    {it.texto}
                  </div>
                </div>
              </Cartao>
            );
          })}
        </div>

        <div style={{marginTop: 44, fontSize: tipo.legenda, color: cores.tintaMuda}}>
          <Forte cor={cores.glp1Claro}>Quatro frentes ao mesmo tempo</Forte> — é por isso que
          um hormônio intestinal trata glicemia e peso.
        </div>
      </div>
    </Cena>
  );
};
