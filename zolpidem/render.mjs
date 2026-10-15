// Grava scene.html quadro a quadro (window.draw(t)) e junta com a narração, música e efeitos.
// Prévia:  STILLS="5,20,40" node render.mjs   → previas/quadro_5.png ...
// Vídeo:   node render.mjs                    → zolpidem_reels.mp4
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const FPS = 30;
const dir = path.dirname(new URL(import.meta.url).pathname);
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(dir, 'scene.html')).href);
await page.waitForFunction(() => window.ready === true);
const END = await page.evaluate(() => window.END);
const frame = t => page.evaluate(t => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', 0.94).split(',')[1]; }, t);

if (process.env.STILLS) {
  fs.mkdirSync(path.join(dir, 'previas'), { recursive: true });
  for (const t of process.env.STILLS.split(',').map(Number)) {
    fs.writeFileSync(path.join(dir, 'previas', `quadro_${t}.jpg`), Buffer.from(await frame(t), 'base64'));
  }
  await browser.close(); process.exit(0);
}

const run = (args, stdin) => new Promise((ok, bad) => {
  const p = spawn('ffmpeg', args, { stdio: [stdin ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('close', c => (c === 0 ? ok() : bad(new Error('ffmpeg ' + c))));
  if (stdin) stdin(p.stdin);
});

// 1) vídeo mudo
const mudo = path.join(dir, 'video_mudo.mp4');
await run(['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', mudo], async stdin => {
  const total = Math.ceil(END * FPS);
  for (let i = 0; i < total; i++) {
    if (!stdin.write(Buffer.from(await frame(i / FPS), 'base64'))) await new Promise(r => stdin.once('drain', r));
    if (i % 300 === 0) console.log(`quadro ${i}/${total}`);
  }
  stdin.end();
});
await browser.close();

// 2) áudio: narração sem alteração + música baixinha + efeitos nos carimbos
const sfx = JSON.parse(fs.readFileSync(path.join(dir, 'sfx.json'), 'utf8'));
const inputs = ['-i', mudo, '-i', path.join(dir, 'narracao.mp3'), '-i', path.join(dir, 'musica.wav')];
sfx.forEach(([, f]) => inputs.push('-i', path.join(dir, 'sfx', f + '.wav')));
const parts = ['[1:a]apad[nar]', `[2:a]volume=0.10,afade=t=out:st=${(END - 2).toFixed(2)}:d=2[mus]`];
sfx.forEach(([t, , v], i) => parts.push(`[${i + 3}:a]volume=${v},adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)}[s${i}]`));
parts.push(`[nar][mus]${sfx.map((_, i) => `[s${i}]`).join('')}amix=inputs=${sfx.length + 2}:normalize=0:duration=first[a]`);
await run(['-y', '-loglevel', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', END.toFixed(2), '-movflags', '+faststart', path.join(dir, 'zolpidem_reels.mp4')]);
fs.unlinkSync(mudo);
console.log('ok');
