import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./config";
import { Video } from "./Video";
import { VideoIBP } from "./ibp/Video";
import { DURATION as DURATION_IBP } from "./ibp/config";
import { VideoAAS } from "./aas/Video";
import { DURATION as DURATION_AAS } from "./aas/config";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="AAS" component={VideoAAS} durationInFrames={DURATION_AAS} fps={FPS} width={1080} height={1920} />
    <Composition id="IBP" component={VideoIBP} durationInFrames={DURATION_IBP} fps={FPS} width={1080} height={1920} />
  </>
);
