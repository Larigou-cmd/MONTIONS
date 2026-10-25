// Exporta todas as fotos de um carrossel (cada quadro = uma foto):
//   node scripts/carrossel.mjs <IdDaComposicao> <pasta de saída> <prefixo>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const linuxChrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = fs.existsSync(linuxChrome) ? linuxChrome : undefined;
const [id, saida, prefixo] = process.argv.slice(2);
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (let fr = 0; fr < composition.durationInFrames; fr++) {
  await renderStill({ serveUrl, composition, frame: fr, output: path.join(saida, `${prefixo}_${fr + 1}.png`), browserExecutable });
}
console.log(id, composition.durationInFrames, "fotos");
