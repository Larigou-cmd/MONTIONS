import {Series} from 'remotion';
import {Abertura} from './cenas/Abertura';
import {Hormonio} from './cenas/Hormonio';
import {Acoes} from './cenas/Acoes';
import {Degradacao} from './cenas/Degradacao';
import {Engenharia} from './cenas/Engenharia';
import {Semaglutida} from './cenas/Semaglutida';
import {Tirzepatida} from './cenas/Tirzepatida';
import {Comparacao} from './cenas/Comparacao';
import {Fecho} from './cenas/Fecho';

/**
 * Roteiro do video, em frames a 30fps.
 * Mudar uma duracao aqui ja reposiciona todas as cenas seguintes;
 * DURACAO_TOTAL e somada desta lista e usada no Root.
 */
export const roteiro = [
  {nome: 'Abertura', dur: 240, Comp: Abertura}, // 8s
  {nome: 'Hormonio', dur: 450, Comp: Hormonio}, // 15s
  {nome: 'Acoes', dur: 780, Comp: Acoes}, // 26s
  {nome: 'Degradacao', dur: 390, Comp: Degradacao}, // 13s
  {nome: 'Engenharia', dur: 540, Comp: Engenharia}, // 18s
  {nome: 'Semaglutida', dur: 420, Comp: Semaglutida}, // 14s
  {nome: 'Tirzepatida', dur: 540, Comp: Tirzepatida}, // 18s
  {nome: 'Comparacao', dur: 660, Comp: Comparacao}, // 22s
  {nome: 'Fecho', dur: 300, Comp: Fecho}, // 10s
];

export const DURACAO_TOTAL = roteiro.reduce((soma, c) => soma + c.dur, 0);

export const VideoGLP1: React.FC = () => (
  <Series>
    {roteiro.map(({nome, dur, Comp}) => (
      <Series.Sequence key={nome} durationInFrames={dur}>
        <Comp dur={dur} />
      </Series.Sequence>
    ))}
  </Series>
);
