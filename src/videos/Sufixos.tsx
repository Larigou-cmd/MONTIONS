import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Rotulo, Cartao, Forte, Sobe} from '../ui';
import {Gancho, Encerramento, VideoEmSerie, duracaoDe, Etapa} from '../comum';
import {cores} from '../theme';

// Sufixos: cardiovascular = azul, outros = ambar. A cor so agrupa; o texto carrega a informacao.

type Sufixo = {suf: string; classe: string; ex: string; mec: string; cor: string; borda: string};

const bloco1: Sufixo[] = [
  {
    suf: '-olol',
    classe: 'Betabloqueador',
    ex: 'propranolol, atenolol',
    mec: 'Bloqueia receptores β: baixa frequência cardíaca e pressão.',
    cor: cores.glp1Claro,
    borda: cores.glp1,
  },
  {
    suf: '-pril',
    classe: 'IECA',
    ex: 'captopril, enalapril',
    mec: 'Inibe a ECA: menos angiotensina II. Efeito típico: tosse seca.',
    cor: cores.glp1Claro,
    borda: cores.glp1,
  },
  {
    suf: '-sartana',
    classe: 'BRA',
    ex: 'losartana, valsartana',
    mec: 'Bloqueia o receptor AT1 da angiotensina II. Quase não dá tosse.',
    cor: cores.glp1Claro,
    borda: cores.glp1,
  },
];

const bloco2: Sufixo[] = [
  {
    suf: '-statina',
    classe: 'Estatina',
    ex: 'sinvastatina, atorvastatina',
    mec: 'Inibe a HMG-CoA redutase: baixa o colesterol LDL.',
    cor: cores.gipClaro,
    borda: cores.gip,
  },
  {
    suf: '-prazol',
    classe: 'Inibidor da bomba de prótons',
    ex: 'omeprazol, pantoprazol',
    mec: 'Desliga a bomba de ácido do estômago.',
    cor: cores.gipClaro,
    borda: cores.gip,
  },
  {
    suf: '-dipino',
    classe: 'Bloqueador de canal de cálcio',
    ex: 'anlodipino, nifedipino',
    mec: 'Relaxa as artérias e baixa a pressão. Pode inchar o tornozelo.',
    cor: cores.glp1Claro,
    borda: cores.glp1,
  },
];

const Abertura: React.FC<{dur: number}> = ({dur}) => (
  <Gancho
    dur={dur}
    rotulo="Macete de prova"
    cor={cores.roxoClaro}
    frase={
      <>
        Descubra a classe do remédio só pelo{' '}
        <span style={{color: cores.roxoClaro}}>final do nome</span>.
      </>
    }
    apoio="6 sufixos que caem em toda prova."
  />
);

const Bloco: React.FC<{dur: number; itens: Sufixo[]; rotulo: string; titulo: string}> = ({
  dur,
  itens,
  rotulo,
  titulo,
}) => {
  const frame = useCurrentFrame();
  const passo = 175;
  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto={rotulo} cor={cores.roxoClaro} />
        <Titulo atraso={6}>{titulo}</Titulo>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 14}}>
          {itens.map((s, i) => {
            const entra = 20 + i * passo;
            const foco = interpolate(
              frame,
              [entra, entra + 25, entra + passo, entra + passo + 30],
              [0, 1, 1, 0.4],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            );
            return (
              <Cartao key={s.suf} atraso={entra} corBorda={foco > 0.6 ? s.borda : cores.linha}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.45 + foco * 0.55}}>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: 22, flexWrap: 'wrap'}}>
                    <div style={{fontSize: 70, fontWeight: 800, color: s.cor, letterSpacing: -2}}>
                      {s.suf}
                    </div>
                    <div style={{fontSize: 40, fontWeight: 800, color: cores.tinta}}>{s.classe}</div>
                  </div>
                  <div style={{fontSize: 32, color: cores.tintaMuda, fontStyle: 'italic'}}>{s.ex}</div>
                  <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.32}}>{s.mec}</div>
                </div>
              </Cartao>
            );
          })}
        </div>
      </div>
    </Cena>
  );
};

const Bloco1: React.FC<{dur: number}> = ({dur}) => (
  <Bloco dur={dur} itens={bloco1} rotulo="1 · pressão e coração" titulo="Os três da hipertensão" />
);

const Bloco2: React.FC<{dur: number}> = ({dur}) => (
  <Bloco dur={dur} itens={bloco2} rotulo="2 · mais três" titulo="Colesterol, estômago e cálcio" />
);

const perguntas = [
  {nome: 'valsartana', resp: 'BRA', cor: cores.glp1Claro},
  {nome: 'rosuvastatina', resp: 'Estatina', cor: cores.gipClaro},
];

const Quiz: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="3 · teste rápido" cor={cores.roxoClaro} />
        <Titulo atraso={6}>Qual é a classe?</Titulo>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 20}}>
          {perguntas.map((p, i) => {
            const entra = 20 + i * 130;
            const revela = interpolate(frame, [entra + 70, entra + 90], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <Cartao key={p.nome} atraso={entra} corBorda={revela > 0.5 ? p.cor : cores.linha}>
                <div style={{flex: 1, fontSize: 52, fontWeight: 800, color: cores.tinta}}>{p.nome}</div>
                <div style={{position: 'relative', minWidth: 260, textAlign: 'right'}}>
                  <div style={{fontSize: 52, fontWeight: 800, color: cores.tintaMuda, opacity: 1 - revela}}>
                    ?
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      fontSize: 46,
                      fontWeight: 800,
                      color: p.cor,
                      opacity: revela,
                    }}
                  >
                    {p.resp}
                  </div>
                </div>
              </Cartao>
            );
          })}
        </div>
        <Sobe atraso={180} dist={20}>
          <div style={{fontSize: 36, color: cores.tintaSec, lineHeight: 1.4, marginTop: 20}}>
            Acertou as duas? Então você já lê <Forte cor={cores.roxoClaro}>a receita pelo sufixo</Forte>.
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};

const Fecho: React.FC<{dur: number}> = ({dur}) => (
  <Encerramento
    dur={dur}
    cor={cores.roxoClaro}
    pontos={[
      {t: '-olol · -pril · -sartana · -dipino', d: 'pressão e coração'},
      {t: '-statina', d: 'colesterol'},
      {t: '-prazol', d: 'ácido do estômago'},
    ]}
    aviso="O sufixo ajuda a estudar, mas tem exceções. Nunca troque ou comece um remédio sem orientação profissional."
    fontes="Fontes: Rang & Dale, 9ª ed. · Farmacologia Ilustrada, 6ª ed. · Katzung, 13ª ed."
  />
);

export const roteiroSufixos: Etapa[] = [
  {nome: 'Abertura', dur: 120, Comp: Abertura}, // 4s
  {nome: 'Bloco1', dur: 600, Comp: Bloco1}, // 20s
  {nome: 'Bloco2', dur: 600, Comp: Bloco2}, // 20s
  {nome: 'Quiz', dur: 300, Comp: Quiz}, // 10s
  {nome: 'Fecho', dur: 240, Comp: Fecho}, // 8s
];

export const DURACAO_SUFIXOS = duracaoDe(roteiroSufixos);

export const VideoSufixos: React.FC = () => <VideoEmSerie roteiro={roteiroSufixos} />;
