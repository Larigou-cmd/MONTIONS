// Gera fotos de conferência: node scripts/stills.mjs 20 120 520 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// na nuvem (Linux) usa o Chromium já instalado; no Windows/Mac o Remotion baixa o navegador sozinho
const linuxChrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = fs.existsSync(linuxChrome) ? linuxChrome : undefined;
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "Video", browserExecutable });
for (const fr of process.argv.slice(2).map(Number)) {
  await renderStill({ serveUrl, composition, frame: fr, output: path.join(root, "out/stills", `${process.env.COMP || "Video"}-${String(fr).padStart(4, "0")}.png`), browserExecutable });
  console.log("foto", fr);
}
