import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./config";
import { Video } from "./Video";
import { VideoIBP } from "./ibp/Video";
import { DURATION as DURATION_IBP } from "./ibp/config";
import { VideoAAS } from "./aas/Video";
import { VideoSema } from "./sema/Video";
import { DURATION as DURATION_SEMA } from "./sema/config";
import { VideoSema2, DURATION as DURATION_SEMA2 } from "./sema2/Video";
import { VideoSemaIBP, DURATION as DURATION_SEMA_IBP } from "./semaIbp/Video";
import { VideoDipirona } from "./dipirona/Video";
import { DURATION as DURATION_DIP } from "./dipirona/config";
import { DURATION as DURATION_AAS } from "./aas/config";
import { VideoAmoxi, DURATION as DURATION_AMOXI } from "./amoxi/Video";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="Dipirona" component={VideoDipirona} durationInFrames={DURATION_DIP} fps={FPS} width={1080} height={1920} />
    <Composition id="Semaglutida" component={VideoSema} durationInFrames={DURATION_SEMA} fps={FPS} width={1080} height={1920} />
    <Composition id="Semaglutida2" component={VideoSema2} durationInFrames={DURATION_SEMA2} fps={FPS} width={1080} height={1920} />
    <Composition id="SemaglutidaIBP" component={VideoSemaIBP} durationInFrames={DURATION_SEMA_IBP} fps={FPS} width={1080} height={1920} />
    <Composition id="AAS" component={VideoAAS} durationInFrames={DURATION_AAS} fps={FPS} width={1080} height={1920} />
    <Composition id="Amoxi" component={VideoAmoxi} durationInFrames={DURATION_AMOXI} fps={FPS} width={1080} height={1920} />
    <Composition id="IBP" component={VideoIBP} durationInFrames={DURATION_IBP} fps={FPS} width={1080} height={1920} />
  </>
);
