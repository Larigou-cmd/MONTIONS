import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background, Grain } from "../lib";
import { COR, SFX, T } from "./config";
import { S1, S2, S3, S4, S5, S6, S7, S8, S9 } from "./scenes";

export const VideoAAS: React.FC = () => (
  <AbsoluteFill>
    <Background color={COR} pulses={[T.trava, T.irreversivel, T.rompe, T.comAAS, T.bloqueia, T.final]} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 />
    <Grain />
    <Audio src={staticFile("aas_narracao.mp3")} />
    {SFX.map(([fr, name, vol], i) => (
      <Sequence key={i} from={fr} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
