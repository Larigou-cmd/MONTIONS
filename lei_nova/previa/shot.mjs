import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const n of (process.argv[2] || 'papel,quadro').split(',')) {
  await p.goto(pathToFileURL(path.join(dir, n + '.html')).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(dir, n + '.png') });
}
await b.close(); console.log('ok');
