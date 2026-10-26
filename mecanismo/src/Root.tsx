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
import {
  NoticiaBotoxExplicadora,
  CapaNoticiaBotoxExplicadora,
} from "./noticiaBotox/Explicadora";

import {
  VideoMetforminaMec,
  CapaMetforminaMec,
  DURATION as DURATION_METFORMINA_MEC,
} from "./metforminaMec/Video";

import {
  VideoLosartana,
  CapaLosartana,
  DURATION as DURATION_LOSARTANA,
} from "./losartana/Video";

import {
  VideoAmoxiPreparo,
  CapaAmoxiPreparo,
  DURATION as DURATION_AMOXI_PREPARO,
} from "./amoxiPreparo/Video";

import {
  VideoInsulina,
  CapaInsulina,
  DURATION as DURATION_INSULINA,
} from "./insulina/Video";

import {
  VideoSarampo,
  CapaSarampo,
  DURATION as DURATION_SARAMPO,
} from "./sarampo/Video";

import { VideoSarampoVox, CapaSarampoVox } from "./sarampo/Vox";

import { VideoPilula, DURATION as DURATION_PILULA } from "./pilula/Video";
import { CapaPilula } from "./pilula/Capa";
import { OrigemCaptopril, DURATION_CAPTOPRIL } from "./origens/Captopril";
import { CapaCaptopril } from "./origens/CapaCaptopril";
import { OrigemAspirina, DURATION_ASPIRINA } from "./origens/Aspirina";
import { CapaAspirina } from "./origens/CapaAspirina";
import { VideoVencido, DURATION_VENCIDO } from "./vencido/Video";
import { CapaVencido } from "./vencido/Capa";
import { VideoGlobulo, DURATION_GLOBULO } from "./globulo/Video";
import { CapaGlobulo } from "./globulo/Capa";
import { VideoFumaca, DURATION_FUMACA } from "./fumaca/Video";
import { CapaFumaca } from "./fumaca/Capa";
import { VideoAlcool, DURATION_ALCOOL } from "./alcool/Video";
import { CapaAlcool } from "./alcool/Capa";
import { VideoNasal, DURATION_NASAL } from "./nasal/Video";
import { CapaNasal } from "./nasal/Capa";
import { FarmaEstilo } from "./farmaexe/Estilo";
import { FarmaComercial, DURATION_FARMA } from "./farmaexe/Comercial";
import { CapaFarma } from "./farmaexe/Capa";
import { FarmaCarrossel } from "./farmaexe/Carrossel";
import { CarrosselGlobulo, CarrosselFumaca, CarrosselVencido, CarrosselGenericos, CarrosselAlcool, ALCOOL, CarrosselNasal, NASAL, GLOBULO, FUMACA, VENCIDO, GENERICOS } from "./carrosseis/Carrosseis";
import { VideoCaibra, DURATION_CAIBRA } from "./caibra/Video";
import { VideoCaibraOpenArt } from "./caibra/VideoOpenArt";
import { CapaCaibra } from "./caibra/Capa";
import { VideoGlicose, DURATION_GLICOSE } from "./glicose/Video";
import { CapaGlicose } from "./glicose/Capa";
import { VideoRim, DURATION_RIM } from "./rim/Video";
import { CapaRim } from "./rim/Capa";
import { VideoLei8080, DURATION as DURATION_LEI8080 } from "./lei8080/Video";
import { CapaLei8080Ep1 } from "./lei8080/Capa";

import {
  VideoAntidotos,
  CapaAntidotos,
  DURATION as DURATION_ANTIDOTOS,
} from "./antidotos/Video";

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
      id="NoticiaBotoxExplicadora"
      component={NoticiaBotoxExplicadora}
      durationInFrames={DURATION_NOTICIA_BOTOX}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="NoticiaBotoxExplicadoraCapa"
      component={CapaNoticiaBotoxExplicadora}
      durationInFrames={1}
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
    <Composition
      id="MetforminaMecanismo"
      component={VideoMetforminaMec}
      durationInFrames={DURATION_METFORMINA_MEC}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="MetforminaMecanismoCapa"
      component={CapaMetforminaMec}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Losartana"
      component={VideoLosartana}
      durationInFrames={DURATION_LOSARTANA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="LosartanaCapa"
      component={CapaLosartana}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="AmoxiPreparo"
      component={VideoAmoxiPreparo}
      durationInFrames={DURATION_AMOXI_PREPARO}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="AmoxiPreparoCapa"
      component={CapaAmoxiPreparo}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Insulina"
      component={VideoInsulina}
      durationInFrames={DURATION_INSULINA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="InsulinaCapa"
      component={CapaInsulina}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Sarampo"
      component={VideoSarampo}
      durationInFrames={DURATION_SARAMPO}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SarampoCapa"
      component={CapaSarampo}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SarampoVox"
      component={VideoSarampoVox}
      durationInFrames={DURATION_SARAMPO}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SarampoVoxCapa"
      component={CapaSarampoVox}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Pilula"
      component={VideoPilula}
      durationInFrames={DURATION_PILULA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="PilulaCapa"
      component={CapaPilula}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="OrigemCaptopril"
      component={OrigemCaptopril}
      durationInFrames={DURATION_CAPTOPRIL}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="CarrosselNasal"
      component={CarrosselNasal}
      durationInFrames={NASAL.length}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="NasalCapa"
      component={CapaNasal}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="CarrosselAlcool"
      component={CarrosselAlcool}
      durationInFrames={ALCOOL.length}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="CarrosselGlobulo"
      component={CarrosselGlobulo}
      durationInFrames={GLOBULO.length}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="CarrosselFumaca"
      component={CarrosselFumaca}
      durationInFrames={FUMACA.length}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="CarrosselVencido"
      component={CarrosselVencido}
      durationInFrames={VENCIDO.length}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="CarrosselGenericos"
      component={CarrosselGenericos}
      durationInFrames={GENERICOS.length}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="FarmaCarrossel"
      component={FarmaCarrossel}
      durationInFrames={5}
      fps={FPS}
      width={1080}
      height={1350}
    />
    <Composition
      id="FarmaCapa"
      component={CapaFarma}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="FarmaComercial"
      component={FarmaComercial}
      durationInFrames={DURATION_FARMA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="FarmaEstilo"
      component={FarmaEstilo}
      durationInFrames={3}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="FumacaCapa"
      component={CapaFumaca}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Nasal"
      component={VideoNasal}
      durationInFrames={DURATION_NASAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="AlcoolCapa"
      component={CapaAlcool}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Alcool"
      component={VideoAlcool}
      durationInFrames={DURATION_ALCOOL}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Fumaca"
      component={VideoFumaca}
      durationInFrames={DURATION_FUMACA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="GlobuloCapa"
      component={CapaGlobulo}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Globulo"
      component={VideoGlobulo}
      durationInFrames={DURATION_GLOBULO}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Vencido"
      component={VideoVencido}
      durationInFrames={DURATION_VENCIDO}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="VencidoCapa"
      component={CapaVencido}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="OrigemAspirina"
      component={OrigemAspirina}
      durationInFrames={DURATION_ASPIRINA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="OrigemAspirinaCapa"
      component={CapaAspirina}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="OrigemCaptoprilCapa"
      component={CapaCaptopril}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Caibra"
      component={VideoCaibra}
      durationInFrames={DURATION_CAIBRA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="CaibraOpenArt"
      component={VideoCaibraOpenArt}
      durationInFrames={DURATION_CAIBRA}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="CaibraCapa"
      component={CapaCaibra}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Glicose"
      component={VideoGlicose}
      durationInFrames={DURATION_GLICOSE}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="GlicoseCapa"
      component={CapaGlicose}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Rim"
      component={VideoRim}
      durationInFrames={DURATION_RIM}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="RimCapa"
      component={CapaRim}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Lei8080Ep1"
      component={VideoLei8080}
      durationInFrames={DURATION_LEI8080}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Lei8080Ep1Capa"
      component={CapaLei8080Ep1}
      durationInFrames={1}
      fps={FPS}
      width={1280}
      height={720}
    />
    <Composition
      id="Antidotos"
      component={VideoAntidotos}
      durationInFrames={DURATION_ANTIDOTOS}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="AntidotosCapa"
      component={CapaAntidotos}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
