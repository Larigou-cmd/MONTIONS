import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background, Grain } from "../lib";
import { COR, SFX, T, VOZ_INICIO } from "./config";
import { S1, S2, S3, S4, S5, S6, S7, S8 } from "./scenes";

export const VideoDipirona: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[T.algema, T.ano, T.some, T.anvisa, T.pare, T.final]} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 />
    <Grain />
    <Audio src={staticFile("musica_dipirona.wav")} volume={(f) => (f < VOZ_INICIO ? 0.32 : 0.14)} />
    <Sequence from={VOZ_INICIO}>
      <Audio src={staticFile("dipirona_narracao.mp3")} />
    </Sequence>
    {SFX.map(([fr, name, vol], i) => (
      <Sequence key={i} from={fr} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
