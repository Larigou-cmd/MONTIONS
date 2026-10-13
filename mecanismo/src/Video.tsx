import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Background, Grain } from "./lib";
import { Part1 } from "./parts/Part1";
import { Part2 } from "./parts/Part2";
import { Part3 } from "./parts/Part3";
import { Part4 } from "./parts/Part4";
import { Part5 } from "./parts/Part5";

export const Video: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Part1 />
    <Part2 />
    <Part3 />
    <Part4 />
    <Part5 />
    <Grain />
    <Audio src={staticFile("narracao.mp3")} />
  </AbsoluteFill>
);
