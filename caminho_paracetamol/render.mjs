// Renderiza o vídeo "O caminho do paracetamol": base.mp4 (clipes) + camada de edição (scene.html, PNG com transparência) + narração, música e efeitos.
// Quadros de conferência:  STILLS="20,60,135" node render.mjs   -> previas/quadro_<t>.jpg (camada sobre a base)
// Vídeo:                    node render.mjs                     -> caminho_paracetamol.mp4
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const FPS = 30, dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.join(dir, 'scene.html')).href);
await page.waitForFunction(() => window.ready === true);
const END = await page.evaluate(() => window.END);
const frame = t => page.evaluate(t => { window.draw(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, t);
const run = (args, feed) => new Promise((ok, bad) => { const p = spawn('ffmpeg', args, { stdio: [feed ? 'pipe' : 'ignore', 'inherit', 'inherit'] }); p.on('close', c => c === 0 ? ok() : bad(new Error('ffmpeg ' + c))); if (feed) feed(p.stdin); });
if (process.env.STILLS) {
  fs.mkdirSync(path.join(dir, 'previas'), { recursive: true });
  for (const t of process.env.STILLS.split(',').map(Number)) {
    const png = path.join(dir, 'previas', 'tmp.png'); fs.writeFileSync(png, Buffer.from(await frame(t), 'base64'));
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', path.join(dir, 'base.mp4'), '-i', png, '-filter_complex', '[0:v][1:v]overlay', '-frames:v', '1', path.join(dir, 'previas', `quadro_${t}.jpg`)]);
  }
  await browser.close(); console.log('ok'); process.exit(0);
}
const sfx = JSON.parse(fs.readFileSync(path.join(dir, 'sfx.json'), 'utf8'));
const mudo = path.join(dir, 'video_mudo.mp4');
await run(['-y', '-loglevel', 'error', '-i', path.join(dir, 'base.mp4'), '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-filter_complex', '[0:v]tpad=stop_mode=clone:stop_duration=10[b];[b][1:v]overlay=eof_action=endall', '-t', END.toFixed(2), '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', mudo], async stdin => {
  const total = Math.ceil(END * FPS);
  for (let i = 0; i < total; i++) { if (!stdin.write(Buffer.from(await frame(i / FPS), 'base64'))) await new Promise(r => stdin.once('drain', r)); if (i % 600 === 0) console.log(`quadro ${i}/${total}`); }
  stdin.end();
});
await browser.close();
const inputs = ['-i', mudo, '-i', path.join(dir, 'narracao.mp3'), '-i', path.join(dir, 'musica.wav')];
sfx.forEach(([, f]) => inputs.push('-i', path.join(dir, 'sfx', f + '.wav')));
const parts = ['[1:a]apad[nar]', `[2:a]volume=0.06,afade=t=out:st=${(END - 3).toFixed(2)}:d=3[mus]`];
sfx.forEach(([t, , v], i) => parts.push(`[${i + 3}:a]volume=${v},adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)}[s${i}]`));
parts.push(`[nar][mus]${sfx.map((_, i) => `[s${i}]`).join('')}amix=inputs=${sfx.length + 2}:normalize=0:duration=first[a]`);
await run(['-y', '-loglevel', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', END.toFixed(2), '-movflags', '+faststart', path.join(dir, 'caminho_paracetamol.mp4')]);
fs.unlinkSync(mudo); console.log('ok');
