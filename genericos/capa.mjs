// Gera a capa vertical (window.capa() em scene.html):  node capa.mjs  → capa_genericos.png
import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(dir, 'scene.html')).href);
await page.waitForFunction(() => window.ready === true);
const png = await page.evaluate(() => { window.capa(); return document.getElementById('c').toDataURL('image/png').split(',')[1]; });
fs.writeFileSync(path.join(dir, 'capa_genericos.png'), Buffer.from(png, 'base64'));
await browser.close();
console.log('ok');
