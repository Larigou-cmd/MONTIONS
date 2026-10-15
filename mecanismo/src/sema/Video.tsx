import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SFX } from "./config";
import { Abertura, Apresentadora, CRT, CenaAviso, CenaEfeitos, CenaGLP, CenaMecanismo, CenaOff, CenaStep, Final, Fundo, Log } from "./scenes";

export const VideoSema: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <CenaGLP /><CenaMecanismo /><CenaStep /><CenaEfeitos /><CenaOff /><CenaAviso />
    <Log />
    <Apresentadora />
    <Abertura />
    <Final />
    <CRT />
    <Audio src={staticFile("sema/narracao.mp3")} />
    <Audio src={staticFile("sema/musica.wav")} volume={0.11} />
    {SFX.map(([fr, name, vol], i) => (
      <Sequence key={i} from={fr} durationInFrames={60}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>
    ))}
  </AbsoluteFill>
);
