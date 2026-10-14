import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Background, Grain } from "../lib";
import { IBP, PULSES_IBP } from "./config";
import { Part1 } from "./Part1";
import { Part2 } from "./Part2";
import { Part3 } from "./Part3";
import { Part4 } from "./Part4";
import { Part5 } from "./Part5";

export const VideoIBP: React.FC = () => (
  <AbsoluteFill>
    <Background color={IBP.cor} pulses={PULSES_IBP} />
    <Part1 />
    <Part2 />
    <Part3 />
    <Part4 />
    <Part5 />
    <Grain />
    <Audio src={staticFile("ibp_narracao.mp3")} />
  </AbsoluteFill>
);
