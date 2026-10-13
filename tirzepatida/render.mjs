// Renderiza scene.html quadro a quadro e mixa com a narração via ffmpeg.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const FPS = Number(process.env.FPS || 30);
const ONLY = process.env.STILLS; // ex.: "5,30,45" gera PNGs de prévia
const SCENE = process.env.SCENE || 'scene.html';
const OUT = process.env.OUT || 'tirzepatida_reels.mp4';
const [VW, VH] = (process.env.SIZE || '1080x1920').split('x').map(Number);
const dir = path.dirname(new URL(import.meta.url).pathname);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VW, height: VH } });
await page.goto(pathToFileURL(path.join(dir, SCENE)).href);
await page.waitForFunction(() => window.ready === true);
const END = await page.evaluate(() => window.END);

if (ONLY) {
  for (const t of ONLY.split(',').map(Number)) {
    await page.evaluate(t => window.draw(t), t);
    await page.locator('canvas').screenshot({ path: path.join(dir, `preview_${t}.png`) });
  }
  await browser.close(); process.exit(0);
}

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-i', path.join(dir, 'narracao.mp3'),
  '-filter_complex', '[1:a]adelay=0|0,apad[a]', '-map', '0:v', '-map', '[a]',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20',
  '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart',
  path.join(dir, OUT)], { stdio: ['pipe', 'inherit', 'inherit'] });

const total = Math.ceil(END * FPS);
for (let i = 0; i < total; i++) {
  const b64 = await page.evaluate(t => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, i / FPS);
  if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 300 === 0) console.log(`quadro ${i}/${total}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('ok');
