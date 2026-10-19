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
import { VideoForxiga, DURATION as DURATION_FORXIGA } from "./forxiga/Video";
import { VideoSinva, DURATION as DURATION_SINVA } from "./sinva/Video";
import {
  VideoSinvaNoite,
  DURATION as DURATION_SINVA_NOITE,
} from "./sinvaNoite/Video";
import { VideoTosse, DURATION as DURATION_TOSSE } from "./tosse/Video";
import { VideoTosse2, DURATION as DURATION_TOSSE2 } from "./tosse2/Video";
import { CapaTosse2 } from "./tosse2/Capa";
import { VideoJejum, DURATION as DURATION_JEJUM } from "./jejum/Video";
import { CapaJejum } from "./jejum/Capa";
import {
  PinJejum,
  PinTosse,
  PinSinvaNoite,
  PinSinvaDor,
  PinAmoxi,
} from "./pins/Pins";
import {
  VideoMetformina,
  DURATION as DURATION_METFORMINA,
} from "./metformina/Video";
import { CapaMetformina } from "./metformina/Capa";
import {
  VideoNoticiaBotox,
  DURATION as DURATION_NOTICIA_BOTOX,
} from "./noticiaBotox/Video";
import { CapaNoticiaBotox } from "./noticiaBotox/Capa";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Video"
      component={Video}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Dipirona"
      component={VideoDipirona}
      durationInFrames={DURATION_DIP}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Semaglutida"
      component={VideoSema}
      durationInFrames={DURATION_SEMA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Semaglutida2"
      component={VideoSema2}
      durationInFrames={DURATION_SEMA2}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SemaglutidaIBP"
      component={VideoSemaIBP}
      durationInFrames={DURATION_SEMA_IBP}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="AAS"
      component={VideoAAS}
      durationInFrames={DURATION_AAS}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Amoxi"
      component={VideoAmoxi}
      durationInFrames={DURATION_AMOXI}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Forxiga"
      component={VideoForxiga}
      durationInFrames={DURATION_FORXIGA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Sinvastatina"
      component={VideoSinva}
      durationInFrames={DURATION_SINVA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SinvaNoite"
      component={VideoSinvaNoite}
      durationInFrames={DURATION_SINVA_NOITE}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Tosse"
      component={VideoTosse}
      durationInFrames={DURATION_TOSSE}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Tosse2"
      component={VideoTosse2}
      durationInFrames={DURATION_TOSSE2}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Tosse2Capa"
      component={CapaTosse2}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Jejum"
      component={VideoJejum}
      durationInFrames={DURATION_JEJUM}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="JejumCapa"
      component={CapaJejum}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Metformina"
      component={VideoMetformina}
      durationInFrames={DURATION_METFORMINA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="MetforminaCapa"
      component={CapaMetformina}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="NoticiaBotox"
      component={VideoNoticiaBotox}
      durationInFrames={DURATION_NOTICIA_BOTOX}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="NoticiaBotoxCapa"
      component={CapaNoticiaBotox}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="PinJejum"
      component={PinJejum}
      durationInFrames={1}
      fps={FPS}
      width={1000}
      height={1500}
    />
    <Composition
      id="PinTosse"
      component={PinTosse}
      durationInFrames={1}
      fps={FPS}
      width={1000}
      height={1500}
    />
    <Composition
      id="PinSinvaNoite"
      component={PinSinvaNoite}
      durationInFrames={1}
      fps={FPS}
      width={1000}
      height={1500}
    />
    <Composition
      id="PinSinvaDor"
      component={PinSinvaDor}
      durationInFrames={1}
      fps={FPS}
      width={1000}
      height={1500}
    />
    <Composition
      id="PinAmoxi"
      component={PinAmoxi}
      durationInFrames={1}
      fps={FPS}
      width={1000}
      height={1500}
    />
    <Composition
      id="IBP"
      component={VideoIBP}
      durationInFrames={DURATION_IBP}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
