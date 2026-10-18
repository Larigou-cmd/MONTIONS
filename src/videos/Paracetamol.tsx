import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Corpo, Rotulo, Cartao, Forte, Sobe, Contador} from '../ui';
import {Gancho, Encerramento, NumeroGrande, VideoEmSerie, duracaoDe, Etapa} from '../comum';
import {cores, tipo} from '../theme';

// Paracetamol: verde = via segura / glutationa, vermelho = NAPQI.

const Abertura: React.FC<{dur: number}> = ({dur}) => (
  <Gancho
    dur={dur}
    rotulo="Toxicologia · paracetamol"
    cor={cores.alertaClaro}
    frase={
      <>
        O remédio mais comum da farmácia pode{' '}
        <span style={{color: cores.alertaClaro}}>destruir o fígado</span>.
      </>
    }
    apoio="E o antídoto existe — mas tem hora certa."
  />
);

const Via: React.FC<{
  pct: string;
  titulo: string;
  texto: React.ReactNode;
  cor: string;
  atraso: number;
}> = ({pct, titulo, texto, cor, atraso}) => (
  <Cartao atraso={atraso} corBorda={cor}>
    <div style={{fontSize: 64, fontWeight: 800, color: cor, minWidth: 190, letterSpacing: -2}}>
      {pct}
    </div>
    <div>
      <div style={{fontSize: 40, fontWeight: 800, color: cores.tinta, marginBottom: 8}}>
        {titulo}
      </div>
      <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.32}}>{texto}</div>
    </div>
  </Cartao>
);

const Metabolismo: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 28, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="1 · na dose certa" cor={cores.protecaoClaro} />
      <Titulo atraso={6}>Para onde vai o paracetamol</Titulo>
      <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 14}}>
        <Via
          pct="~90%"
          titulo="Via segura"
          texto="O fígado conjuga a molécula (glicuronidação e sulfatação) e ela sai pela urina."
          cor={cores.protecaoClaro}
          atraso={24}
        />
        <Via
          pct="5–10%"
          titulo="Via perigosa"
          texto={
            <>
              A enzima CYP2E1 forma o <Forte cor={cores.alertaClaro}>NAPQI</Forte>, um metabólito
              tóxico.
            </>
          }
          cor={cores.alertaClaro}
          atraso={90}
        />
      </div>
      <Corpo atraso={170}>
        Em dose normal, a <Forte cor={cores.protecaoClaro}>glutationa</Forte> do fígado neutraliza
        esse NAPQI na hora.
      </Corpo>
    </div>
  </Cena>
);

const Overdose: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const nivel = interpolate(frame, [60, 230], [100, 22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const corNivel = nivel > 30 ? cores.protecao : cores.alerta;
  const ALT = 640;

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="2 · na overdose" cor={cores.alertaClaro} />
        <Titulo atraso={6}>A via segura satura</Titulo>
        <Corpo atraso={18}>
          Sobra mais remédio para a CYP2E1, e o NAPQI vai{' '}
          <Forte cor={cores.alertaClaro}>consumindo a glutationa</Forte>.
        </Corpo>

        <div style={{display: 'flex', alignItems: 'flex-end', gap: 50, marginTop: 20, justifyContent: 'center'}}>
          <div
            style={{
              position: 'relative',
              width: 240,
              height: ALT,
              background: cores.superficie,
              border: `3px solid ${cores.linha}`,
              borderRadius: 32,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: (nivel / 100) * ALT,
                background: corNivel,
                opacity: 0.85,
              }}
            />
            {/* limiar de ~30%: abaixo dele o NAPQI comeca a lesar o hepatocito */}
            <div
              style={{
                position: 'absolute',
                left: -4,
                right: -4,
                bottom: 0.3 * ALT,
                borderTop: `4px dashed ${cores.tinta}`,
              }}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 0.3 * ALT - 40}}>
            <div style={{fontSize: 36, color: cores.tintaSec, fontWeight: 700}}>glutationa</div>
            <div
              style={{
                fontSize: 120,
                fontWeight: 800,
                color: corNivel === cores.alerta ? cores.alertaClaro : cores.tinta,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: -4,
                lineHeight: 1,
              }}
            >
              {Math.round(nivel)}%
            </div>
            <div style={{fontSize: 32, color: cores.tinta, fontWeight: 700}}>
              - - limiar ~30%
            </div>
          </div>
        </div>

        <Sobe atraso={240} dist={20}>
          <div style={{fontSize: tipo.legenda, color: cores.tintaSec, lineHeight: 1.4}}>
            Abaixo de ~30%, o <Forte cor={cores.alertaClaro}>NAPQI</Forte> sobra livre e ataca
            as células do fígado.
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};

const fases = [
  {quando: '0–24 h', titulo: 'Parece que nada aconteceu', texto: 'Náusea e mal-estar, ou nenhum sintoma.'},
  {quando: '24–72 h', titulo: 'O fígado começa a sofrer', texto: 'Transaminases sobem, dor no lado direito da barriga.'},
  {quando: '72–96 h', titulo: 'Pico da lesão', texto: 'Necrose hepática: pode evoluir para insuficiência.'},
];

const Lesao: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="3 · a armadilha" cor={cores.alertaClaro} />
      <Titulo atraso={6}>Os primeiros dias enganam</Titulo>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14}}>
        {fases.map((f, i) => (
          <Cartao key={f.quando} atraso={24 + i * 50} corBorda={i === 2 ? cores.alerta : cores.linha}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: i === 2 ? cores.alertaClaro : cores.gipClaro,
                minWidth: 190,
              }}
            >
              {f.quando}
            </div>
            <div>
              <div style={{fontSize: 38, fontWeight: 800, color: cores.tinta, marginBottom: 6}}>
                {f.titulo}
              </div>
              <div style={{fontSize: 32, color: cores.tintaSec, lineHeight: 1.32}}>{f.texto}</div>
            </div>
          </Cartao>
        ))}
      </div>
    </div>
  </Cena>
);

const Antidoto: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 34, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="4 · o antídoto" cor={cores.protecaoClaro} />
      <Titulo atraso={6}>N-acetilcisteína</Titulo>
      <Corpo atraso={20}>
        Ela fornece cisteína para o fígado{' '}
        <Forte cor={cores.protecaoClaro}>repor a glutationa</Forte> e voltar a neutralizar o NAPQI.
      </Corpo>
      <div style={{marginTop: 30}}>
        <NumeroGrande
          valor={<Contador para={8} atraso={70} dur={30} />}
          unidade="horas"
          cor={cores.protecaoClaro}
          legenda="melhor janela: iniciada até 8 h após a ingestão"
          atraso={60}
        />
      </div>
      <Corpo atraso={130} cor={cores.tinta}>
        Por isso, suspeita de overdose é <Forte cor={cores.alertaClaro}>emergência</Forte> — mesmo
        sem sintomas.
      </Corpo>
    </div>
  </Cena>
);

const riscos = [
  {titulo: 'Álcool todo dia', texto: 'Aumenta a CYP2E1 e reduz a glutationa.'},
  {titulo: 'Jejum ou desnutrição', texto: 'Menos glutationa de reserva.'},
  {titulo: 'Dose escondida', texto: 'Antigripais e analgésicos combinados também têm paracetamol.'},
];

const Riscos: React.FC<{dur: number}> = ({dur}) => (
  <Cena dur={dur}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, height: '100%', justifyContent: 'center'}}>
      <Rotulo texto="5 · quem corre mais risco" cor={cores.gipClaro} />
      <Titulo atraso={6}>O que encurta a margem</Titulo>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14}}>
        {riscos.map((r, i) => (
          <Cartao key={r.titulo} atraso={24 + i * 45} corBorda={cores.gip}>
            <div style={{fontSize: 56, fontWeight: 800, color: cores.gipClaro, minWidth: 60}}>
              {i + 1}
            </div>
            <div>
              <div style={{fontSize: 40, fontWeight: 800, color: cores.tinta, marginBottom: 6}}>
                {r.titulo}
              </div>
              <div style={{fontSize: 33, color: cores.tintaSec, lineHeight: 1.32}}>{r.texto}</div>
            </div>
          </Cartao>
        ))}
      </div>
    </div>
  </Cena>
);

const Fecho: React.FC<{dur: number}> = ({dur}) => (
  <Encerramento
    dur={dur}
    cor={cores.protecaoClaro}
    pontos={[
      {t: 'Na dose certa, é seguro', d: 'quase tudo sai pela via de conjugação'},
      {t: 'Na overdose, vira NAPQI', d: 'a glutationa acaba e o fígado é lesado'},
      {t: 'Antídoto: N-acetilcisteína', d: 'quanto antes, melhor — idealmente em até 8 h'},
    ]}
    aviso={
      <>
        Respeite a dose máxima da bula e some todos os produtos que contêm paracetamol. Suspeita de
        intoxicação: <Forte cor={cores.tinta}>Disque-Intoxicação 0800 722 6001</Forte> ou SAMU 192.
      </>
    }
    fontes="Fontes: Goodman & Gilman, 12ª ed. · Katzung, 13ª ed. · Fundamentos de Toxicologia"
  />
);

export const roteiroParacetamol: Etapa[] = [
  {nome: 'Abertura', dur: 150, Comp: Abertura}, // 5s
  {nome: 'Metabolismo', dur: 300, Comp: Metabolismo}, // 10s
  {nome: 'Overdose', dur: 330, Comp: Overdose}, // 11s
  {nome: 'Lesao', dur: 270, Comp: Lesao}, // 9s
  {nome: 'Antidoto', dur: 300, Comp: Antidoto}, // 10s
  {nome: 'Riscos', dur: 270, Comp: Riscos}, // 9s
  {nome: 'Fecho', dur: 300, Comp: Fecho}, // 10s
];

export const DURACAO_PARACETAMOL = duracaoDe(roteiroParacetamol);

export const VideoParacetamol: React.FC = () => <VideoEmSerie roteiro={roteiroParacetamol} />;
