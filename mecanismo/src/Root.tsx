import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./config";
import { Video } from "./Video";

export const RemotionRoot: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
