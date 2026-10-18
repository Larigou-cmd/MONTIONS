import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Cartao, Forte, Sobe} from '../ui';
import {Gancho, Encerramento, VideoEmSerie, duracaoDe, Etapa} from '../comum';
import {Receptor, Cerebro} from '../orgaos';
import {cores, tipo} from '../theme';

// Naloxona: vermelho = opioide (agonista), verde = naloxona (antagonista).

const c = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Abertura: React.FC<{dur: number}> = ({dur}) => (
  <Gancho
    dur={dur}
    rotulo="Farmacologia · opioides"
    cor={cores.protecaoClaro}
    frase={
      <>
        O remédio que traz alguém de volta de uma{' '}
        <span style={{color: cores.alertaClaro}}>overdose</span> em minutos.
      </>
    }
    apoio={
      <>
        Ele se chama <Forte cor={cores.protecaoClaro}>naloxona</Forte>.
      </>
    }
  />
);

const Mi: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const ocupa = interpolate(frame, [50, 90], [0, 1], c);
  const resp = interpolate(frame, [110, 220], [16, 4], c);
  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="1 · o que o opioide faz" cor={cores.alertaClaro} />
        <Titulo atraso={6}>Ele encaixa no receptor μ</Titulo>
        <div style={{display: 'flex', justifyContent: 'center', gap: 60, alignItems: 'center', marginTop: 10}}>
          <div style={{transform: 'scale(1.6)', margin: '60px 40px'}}>
            <Receptor cor={cores.alertaClaro} ocupado={ocupa} rotulo="receptor μ" />
          </div>
          <Cerebro tam={260} cor={cores.alertaClaro} ativo={ocupa} />
        </div>
        <Corpo atraso={30}>
          Morfina, fentanil e outros opioides ativam o receptor μ — inclusive no{' '}
          <Forte cor={cores.alertaClaro}>tronco cerebral</Forte>, que comanda a respiração.
        </Corpo>
        <Sobe atraso={110} dist={20}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
            <div
              style={{
                fontSize: 110,
                fontWeight: 800,
                color: resp < 8 ? cores.alertaClaro : cores.tinta,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: -4,
              }}
            >
              {Math.round(resp)}
            </div>
            <div style={{fontSize: 40, color: cores.tintaSec, fontWeight: 700}}>
              respirações por minuto
            </div>
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};

const sinais = [
  {titulo: 'Pupila puntiforme', texto: 'Miose: a pupila vira um ponto.'},
  {titulo: 'Respiração lenta', texto: 'Ou ausente. É isso que mata na overdose.'},
  {titulo: 'Não acorda', texto: 'Rebaixamento da consciência, não responde a estímulos.'},
];

const Triade: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="2 · como reconhecer" cor={cores.alertaClaro} />
      <Titulo atraso={6}>A tríade da overdose</Titulo>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14}}>
        {sinais.map((s, i) => (
          <Cartao key={s.titulo} atraso={24 + i * 45} corBorda={cores.alerta}>
            <div style={{fontSize: 56, fontWeight: 800, color: cores.alertaClaro, minWidth: 60}}>
              {i + 1}
            </div>
            <div>
              <div style={{fontSize: 40, fontWeight: 800, color: cores.tinta, marginBottom: 6}}>
                {s.titulo}
              </div>
              <div style={{fontSize: 33, color: cores.tintaSec, lineHeight: 1.32}}>{s.texto}</div>
            </div>
          </Cartao>
        ))}
      </div>
    </div>
  </Cena>
);

const Antagonista: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const troca = interpolate(frame, [90, 150], [0, 1], c);
  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="3 · o antídoto" cor={cores.protecaoClaro} />
        <Titulo atraso={6}>Uma chave que entra, mas não gira</Titulo>
        <div style={{position: 'relative', height: 420, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{position: 'absolute', transform: 'scale(1.7)', opacity: 1 - troca}}>
            <Receptor cor={cores.alertaClaro} ocupado={1} rotulo="opioide" />
          </div>
          <div style={{position: 'absolute', transform: 'scale(1.7)', opacity: troca}}>
            <Receptor cor={cores.protecaoClaro} ocupado={1} rotulo="naloxona" />
          </div>
        </div>
        <Corpo atraso={30}>
          A naloxona é um <Forte cor={cores.protecaoClaro}>antagonista competitivo</Forte>: ocupa o
          mesmo receptor, com mais afinidade, e não o ativa.
        </Corpo>
        <Corpo atraso={160} cor={cores.tinta}>
          Ela <Forte cor={cores.protecaoClaro}>expulsa o opioide</Forte> do receptor — e a
          respiração volta.
        </Corpo>
      </div>
    </Cena>
  );
};

const vias = [
  {via: 'Intravenosa', tempo: '~2 min'},
  {via: 'Intramuscular', tempo: 'poucos min'},
  {via: 'Spray nasal', tempo: 'poucos min'},
];

const Rapida: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="4 · velocidade" cor={cores.protecaoClaro} />
      <Titulo atraso={6}>Em quanto tempo age</Titulo>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14}}>
        {vias.map((v, i) => (
          <Cartao key={v.via} atraso={24 + i * 35} corBorda={cores.protecao}>
            <div style={{flex: 1, fontSize: 42, fontWeight: 800, color: cores.tinta}}>{v.via}</div>
            <div style={{fontSize: 42, fontWeight: 800, color: cores.protecaoClaro}}>{v.tempo}</div>
          </Cartao>
        ))}
      </div>
      <Sobe atraso={150} dist={20}>
        <div style={{fontSize: tipo.legenda, color: cores.tintaSec, lineHeight: 1.4, marginTop: 20}}>
          Se a pessoa não melhora, a dose pode ser{' '}
          <Forte cor={cores.tinta}>repetida</Forte> — fentanil às vezes exige mais de uma.
        </div>
      </Sobe>
    </div>
  </Cena>
);

const Pegadinha: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [40, 130], [0, 1], c);
  const TRILHA = 820;
  const barras = [
    {nome: 'Naloxona', valor: '30–90 min', frac: 0.14, cor: cores.protecao},
    {nome: 'Muitos opioides', valor: 'várias horas', frac: 1, cor: cores.alerta},
  ];
  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="5 · a pegadinha" cor={cores.gipClaro} />
        <Titulo atraso={6}>O antídoto acaba antes</Titulo>
        <div style={{display: 'flex', flexDirection: 'column', gap: 36, marginTop: 20}}>
          {barras.map((b) => (
            <div key={b.nome} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
                <div style={{width: 20, height: 20, borderRadius: 6, background: b.cor}} />
                <div style={{fontSize: 40, fontWeight: 800, color: cores.tinta}}>{b.nome}</div>
                <div style={{fontSize: 32, color: cores.tintaSec}}>{b.valor}</div>
              </div>
              <div style={{width: TRILHA, height: 52, background: cores.superficie, borderRadius: 8}}>
                <div style={{width: TRILHA * b.frac * t, height: 52, background: b.cor, borderRadius: 8}} />
              </div>
            </div>
          ))}
        </div>
        <Corpo atraso={150}>
          Quando a naloxona sai, o opioide que ainda está no corpo pode{' '}
          <Forte cor={cores.alertaClaro}>voltar a deprimir a respiração</Forte>.
        </Corpo>
        <Corpo atraso={200} cor={cores.tinta}>
          Por isso a pessoa precisa de atendimento e observação, mesmo depois de acordar.
        </Corpo>
      </div>
    </Cena>
  );
};

const Fecho: React.FC<{dur: number}> = ({dur}) => (
  <Encerramento
    dur={dur}
    cor={cores.protecaoClaro}
    pontos={[
      {t: 'Opioide deprime a respiração', d: 'via receptor μ no tronco cerebral'},
      {t: 'Naloxona disputa o receptor', d: 'antagonista competitivo, age em minutos'},
      {t: 'Efeito curto', d: 'pode precisar repetir e a pessoa deve ser observada'},
    ]}
    aviso={
      <>
        A naloxona só reverte opioides — não age sobre álcool ou benzodiazepínicos — e pode causar
        abstinência súbita em quem usa opioide todo dia. Emergência:{' '}
        <Forte cor={cores.tinta}>SAMU 192</Forte>.
      </>
    }
    fontes="Fontes: Goodman & Gilman, 12ª ed. · Rang & Dale, 9ª ed. · Katzung, 13ª ed."
  />
);

export const roteiroNaloxona: Etapa[] = [
  {nome: 'Abertura', dur: 150, Comp: Abertura}, // 5s
  {nome: 'Mi', dur: 330, Comp: Mi}, // 11s
  {nome: 'Triade', dur: 270, Comp: Triade}, // 9s
  {nome: 'Antagonista', dur: 330, Comp: Antagonista}, // 11s
  {nome: 'Rapida', dur: 240, Comp: Rapida}, // 8s
  {nome: 'Pegadinha', dur: 330, Comp: Pegadinha}, // 11s
  {nome: 'Fecho', dur: 300, Comp: Fecho}, // 10s
];

export const DURACAO_NALOXONA = duracaoDe(roteiroNaloxona);

export const VideoNaloxona: React.FC = () => <VideoEmSerie roteiro={roteiroNaloxona} />;
