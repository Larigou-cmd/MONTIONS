import fs from "node:fs";
import { execFileSync } from "node:child_process";
const sets = [["Caveat", ["700"]], ["PlayfairDisplay", ["800", "900"]]];
const out = JSON.parse(fs.readFileSync("src/fontfiles.json", "utf8"));
for (const [name, weights] of sets) {
  const { getInfo } = await import(`@remotion/google-fonts/${name}`);
  const info = getInfo();
  for (const w of weights) for (const sub of ["latin", "latin-ext"]) {
    const url = info.fonts.normal?.[w]?.[sub];
    if (!url) continue;
    const file = `${name}-${w}-${sub}.woff2`;
    execFileSync("curl", ["-sS", "-f", "-o", `public/fonts/${file}`, url]);
    if (!out.find((o) => o.file === file)) out.push({ family: info.fontFamily, weight: w, file, unicodeRange: info.unicodeRanges[sub] });
  }
}
fs.writeFileSync("src/fontfiles.json", JSON.stringify(out, null, 1));
console.log(out.length, "arquivos");
