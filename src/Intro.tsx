import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  titulo: string;
  subtitulo: string;
};

export const Intro: React.FC<Props> = ({titulo, subtitulo}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entradaTitulo = spring({frame, fps, config: {damping: 14}});
  const entradaSub = spring({
    frame: frame - 12,
    fps,
    config: {damping: 16},
  });

  const brilho = interpolate(frame, [0, 150], [0, 40]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${40 + brilho}%, #1e2a4a 0%, #0a0e1a 70%)`,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(entradaTitulo, [0, 1], [60, 0])}px)`,
          opacity: entradaTitulo,
          fontSize: 120,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: -2,
        }}
      >
        {titulo}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(entradaSub, [0, 1], [40, 0])}px)`,
          opacity: entradaSub,
          marginTop: 24,
          fontSize: 44,
          color: '#7dd3fc',
        }}
      >
        {subtitulo}
      </div>
    </AbsoluteFill>
  );
};
