import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import files from "./fontfiles.json";

// Mesmas fontes do @remotion/google-fonts, servidas da pasta public/fonts
for (const f of files) {
  loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, unicodeRange: f.unicodeRange, format: "woff2" });
}

export const SERIF = "'Source Serif Four', serif";
export const SANS = "Inter, sans-serif";
export const DISPLAY = "Unbounded, sans-serif";
export const MAO = "Caveat, cursive"; // letra à mão (estilo Vox)
export const JORNAL = "'Playfair Display', serif"; // manchete de jornal (estilo Vox)
