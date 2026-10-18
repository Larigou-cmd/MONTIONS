import {Composition} from 'remotion';
import {Intro} from './Intro';
import {VideoGLP1, DURACAO_TOTAL} from './Video';
import {VideoParacetamol, DURACAO_PARACETAMOL} from './videos/Paracetamol';
import {VideoNaloxona, DURACAO_NALOXONA} from './videos/Naloxona';
import {VideoSufixos, DURACAO_SUFIXOS} from './videos/Sufixos';
import {LARGURA, ALTURA} from './theme';

// Videos curtos para o TikTok (~60s), todos verticais 1080x1920.
const curtos = [
  {id: 'Paracetamol', component: VideoParacetamol, dur: DURACAO_PARACETAMOL},
  {id: 'Naloxona', component: VideoNaloxona, dur: DURACAO_NALOXONA},
  {id: 'Sufixos', component: VideoSufixos, dur: DURACAO_SUFIXOS},
];

export const Root: React.FC = () => {
  return (
    <>
      {/* Video principal: mecanismo do GLP-1 e semaglutida vs tirzepatida. Vertical. */}
      <Composition
        id="GLP1"
        component={VideoGLP1}
        durationInFrames={DURACAO_TOTAL}
        fps={30}
        width={LARGURA}
        height={ALTURA}
      />

      {curtos.map((v) => (
        <Composition
          key={v.id}
          id={v.id}
          component={v.component}
          durationInFrames={v.dur}
          fps={30}
          width={LARGURA}
          height={ALTURA}
        />
      ))}

      {/* Exemplo minimo que sobrou do teste de setup. */}
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titulo: 'Seu título aqui',
          subtitulo: 'motion graphics com Remotion',
        }}
      />
    </>
  );
};
