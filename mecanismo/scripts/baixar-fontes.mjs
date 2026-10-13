// Baixa para public/fonts os arquivos das fontes do @remotion/google-fonts (o navegador do render não acessa a internet direto).
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const sets = [["Inter", ["400", "500", "600", "700", "800"]], ["SourceSerif4", ["400", "600"]], ["Unbounded", ["300"]]];
fs.mkdirSync("public/fonts", { recursive: true });
const out = [];
for (const [name, weights] of sets) {
  const { getInfo } = await import(`@remotion/google-fonts/${name}`);
  const info = getInfo();
  for (const w of weights) for (const sub of ["latin", "latin-ext"]) {
    const url = info.fonts.normal?.[w]?.[sub];
    if (!url) continue;
    const file = `${name}-${w}-${sub}.woff2`;
    execFileSync("curl", ["-sS", "-o", `public/fonts/${file}`, url]);
    out.push({ family: info.fontFamily, weight: w, file, unicodeRange: info.unicodeRanges[sub] });
  }
}
fs.writeFileSync("src/fontfiles.json", JSON.stringify(out, null, 1));
console.log(out.length, "arquivos");
