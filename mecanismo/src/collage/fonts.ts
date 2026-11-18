// Fontes da biblioteca de colagem (copiada de SousekiL/vox-style-video, MIT), reduzida às fontes latinas.
// No Farma.exe não usamos chinês: os papéis "cjk*" apontam para as mesmas fontes latinas.
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import { loadFont as loadArchitects } from "@remotion/google-fonts/ArchitectsDaughter";
import { loadFont as loadLibreFranklin } from "@remotion/google-fonts/LibreFranklin";
import { loadFont as loadLibreBaskerville } from "@remotion/google-fonts/LibreBaskerville";
import { continueRender, delayRender, staticFile } from "remotion";

const grotesk = loadInterTight("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
const serif = loadPlayfair("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
const mono = loadRobotoMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
const hand = loadArchitects("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

export const FONT = {
  grotesk,
  heroSerif: serif,
  heroSerifItalic: serif,
  titleSerif: serif,
  meta: grotesk,
  quirky: grotesk,
  mono,
  hand,
  ransom: serif,
  annotation: hand,
};

const franklin = loadLibreFranklin("normal", {
  weights: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
const baskerville = loadLibreBaskerville("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;

export const VOX_FONT = {
  sans: franklin,
  serif: baskerville,
  mono,
  cjkSans: franklin,
  cjkSerif: baskerville,
  cjkFangsong: baskerville,
};

export const VOX_FONT_TC = {
  sans: franklin,
  serif: baskerville,
  kai: baskerville,
};

/** Load a self-hosted font file from public/ and block rendering until ready. */
export const loadLocalFont = (family: string, file: string, weight = "400") => {
  if (typeof document === "undefined") return family;
  const handle = delayRender(`font ${family}`);
  const fmt = file.endsWith(".woff2")
    ? "woff2"
    : file.endsWith(".woff")
      ? "woff"
      : file.endsWith(".otf")
        ? "opentype"
        : "truetype";
  const face = new FontFace(
    family,
    `url(${staticFile(file)}) format('${fmt}')`,
    { weight },
  );
  face
    .load()
    .then((f) => {
      (document.fonts as unknown as { add: (font: FontFace) => void }).add(f);
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
  return family;
};
