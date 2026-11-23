import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

// "Como um palitinho sabe que você está grávida?" — pixel art feito em código.
// Desenho numa tela de 270×480 ampliada 4× (pixels de verdade). Roteiro: roteiros/teste_gravidez_pixel.md.
// Versão SEM ÁUDIO: tempos estimados no ritmo da fala (~2,5 palavras/s).

loadFont({
  family: "Pixelify Sans",
  url: staticFile("fonts/PixelifySans-latin.woff2"),
  weight: "400 700",
  format: "woff2",
});
const PIX = "'Pixelify Sans', monospace";

const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const T = {
  ut: 3,
  fita: 12.5,
  micro: 17,
  tline: 21,
  listra: 26,
  sem: 29,
  cline: 32,
  tres: 36,
  dicas: 41.5,
  rev: 53,
  siga: 56,
  fim: 61,
};
export const DURATION_GRAVIDEZ_PIXEL = S(64);

// ---------- pixels ----------
const W = 270;
const H = 480;
const K = 4;
type RGB = [number, number, number];
const c = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const claro = (x: RGB, a = 0.45): RGB => [
  x[0] + (255 - x[0]) * a,
  x[1] + (255 - x[1]) * a,
  x[2] + (255 - x[2]) * a,
];

const NAVY = c("#0f1b2a");
const NAVY2 = c("#0a121d");
const CREME = c("#efe4c8");
const CREME_B = c("#c8b88e");
const OUT = c("#15121a");
const ROSA = c("#e2477a");
const ROSA_CL = c("#ff9dbd");
const OURO = c("#f2b33d");
const OURO_CL = c("#ffe08a");
const CIANO = c("#4fd0e6");
const VIOLETA = c("#a67bf0");
const VERDE = c("#6fdc8c");
const VINHO = c("#1c0a12");
const VINHO2 = c("#341626");
const URINA = c("#f5d33f");
const VERM = c("#d8343f");
const BRANCO = c("#f7f6f0");
const CINZA = c("#2b3440");
const CINZA_CL = c("#c9ced6");
const UTERO = c("#e8798e");
const UTERO_E = c("#b8405e");
const SANGUE = c("#b3283f");

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const cl = (x: number) => Math.max(0, Math.min(1, x));
const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

class Px {
  d = new Uint8ClampedArray(W * H * 4);
  set(x: number, y: number, col: RGB, a = 1) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    const d = this.d;
    if (a >= 1) {
      d[i] = col[0];
      d[i + 1] = col[1];
      d[i + 2] = col[2];
    } else {
      d[i] = d[i] + (col[0] - d[i]) * a;
      d[i + 1] = d[i + 1] + (col[1] - d[i + 1]) * a;
      d[i + 2] = d[i + 2] + (col[2] - d[i + 2]) * a;
    }
    d[i + 3] = 255;
  }
  rect(x: number, y: number, w: number, h: number, col: RGB, a = 1) {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const x1 = Math.round(x + w);
    const y1 = Math.round(y + h);
    for (let yy = y0; yy < y1; yy++)
      for (let xx = x0; xx < x1; xx++) this.set(xx, yy, col, a);
  }
  // retângulo com cantos "mordidos" (arredondado em pixel)
  rrect(x: number, y: number, w: number, h: number, col: RGB, r = 2) {
    this.rect(x + r, y, w - 2 * r, h, col);
    this.rect(x, y + r, w, h - 2 * r, col);
    if (r > 1) {
      this.rect(x + 1, y + 1, w - 2, h - 2, col);
    }
  }
  fill(col: RGB) {
    this.rect(0, 0, W, H, col);
  }
  circle(cx: number, cy: number, r: number, col: RGB, a = 1) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    const R = Math.ceil(r);
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++)
        if (dx * dx + dy * dy <= r * r + r * 0.6)
          this.set(cx + dx, cy + dy, col, a);
  }
  ring(cx: number, cy: number, r: number, th: number, col: RGB, a = 1) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    const R = Math.ceil(r);
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const q = dx * dx + dy * dy;
        if (q <= r * r + r * 0.6 && q > (r - th) * (r - th) + (r - th) * 0.6)
          this.set(cx + dx, cy + dy, col, a);
      }
  }
  line(x0: number, y0: number, x1: number, y1: number, col: RGB, th = 1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n);
      const y = Math.round(y0 + ((y1 - y0) * i) / n);
      this.rect(x - Math.floor(th / 2), y - Math.floor(th / 2), th, th, col);
    }
  }
  hexa(cx: number, cy: number, r: number, col: RGB) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    const R = Math.ceil(r);
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        if (ay <= r * 0.866 && ax + ay * 0.577 <= r)
          this.set(cx + dx, cy + dy, col);
      }
  }
  sprite(
    rows: string[],
    map: Record<string, RGB>,
    cx: number,
    cy: number,
    k: number,
    flip = false,
    outline?: RGB,
  ) {
    const h = rows.length;
    const w = rows[0].length;
    const x0 = Math.round(cx - (w * k) / 2);
    const y0 = Math.round(cy - (h * k) / 2);
    const cell = (i: number, j: number) =>
      (flip ? rows[h - 1 - j] : rows[j])[i];
    if (outline)
      for (let j = 0; j < h; j++)
        for (let i = 0; i < w; i++)
          if (cell(i, j) !== ".")
            this.rect(x0 + i * k - 1, y0 + j * k - 1, k + 2, k + 2, outline);
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const ch = cell(i, j);
        if (ch !== ".") this.rect(x0 + i * k, y0 + j * k, k, k, map[ch]);
      }
  }
}

// ---------- personagens ----------
const Y_ROWS = [
  "la.......al",
  "laa.....aal",
  ".laa...aal.",
  "..laa.aal..",
  "...laaaa...",
  "....laa....",
  "....laa....",
  "....laa....",
  "....laa....",
];
// anticorpo em "Y"; braços para cima ou para baixo; tinta rosa na ponta da haste
const anticorpo = (
  p: Px,
  x: number,
  y: number,
  k: number,
  cor: RGB,
  bracos: "cima" | "baixo",
  tinta: boolean,
) => {
  p.sprite(Y_ROWS, { a: cor, l: claro(cor) }, x, y, k, bracos === "baixo", OUT);
  if (tinta) {
    const sy = bracos === "cima" ? y + 4.5 * k : y - 4.5 * k;
    p.circle(x, sy, 1.6 * k + 1, OUT);
    p.circle(x, sy, 1.6 * k, ROSA);
    p.rect(
      x - 0.8 * k,
      sy - 0.8 * k,
      Math.max(1, 0.6 * k),
      Math.max(1, 0.6 * k),
      ROSA_CL,
    );
  }
};
const hcg = (p: Px, x: number, y: number, r: number) => {
  p.hexa(x, y, r + 1.5, OUT);
  p.hexa(x, y, r, OURO);
  p.hexa(x - r * 0.25, y - r * 0.25, r * 0.4, OURO_CL);
};

// teste de gravidez (cassete) — centro (cx,cy), escala s; tK/cK = quanto das linhas já apareceu (0..1)
const cassete = (
  p: Px,
  cx: number,
  cy: number,
  s: number,
  tK: number,
  cK: number,
) => {
  const w = 190 * s;
  const h = 76 * s;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  p.rrect(x0 + 4, y0 + 5, w, h, NAVY2, 4);
  p.rrect(x0 - 2, y0 - 2, w + 4, h + 4, OUT, 5);
  p.rrect(x0, y0, w, h, BRANCO, 4);
  p.rect(x0 + 3, y0 + h - 5, w - 6, 3, CINZA_CL);
  // poço da amostra
  p.circle(x0 + 30 * s, cy, 13 * s + 1, OUT);
  p.circle(x0 + 30 * s, cy, 13 * s, CINZA_CL);
  p.circle(x0 + 30 * s, cy, 8 * s, c("#9aa3ae"));
  // ranhuras
  for (let i = 0; i < 4; i++)
    p.rect(x0 + w - 22 * s + i * 4 * s, cy - 14 * s, 2, 28 * s, CINZA_CL);
  // janela
  const wx = x0 + 70 * s;
  const ww = 90 * s;
  const wh = 26 * s;
  p.rect(wx - 2, cy - wh / 2 - 2, ww + 4, wh + 4, OUT);
  p.rect(wx, cy - wh / 2, ww, wh, c("#fbfbf7"));
  const linha = (lx: number, k: number, seed: number) => {
    const lw = Math.max(3, Math.round(4 * s));
    const lh = Math.round(22 * s);
    const ly = Math.round(cy - lh / 2);
    for (let yy = 0; yy < lh; yy++)
      for (let xx = 0; xx < lw; xx++) {
        const r = rnd(seed + yy * 13 + xx * 7);
        if (r < k)
          p.set(
            Math.round(lx) + xx,
            ly + yy,
            xx === 0 ? claro(ROSA, 0.3) : ROSA,
          );
      }
  };
  linha(cx - 2 * s, tK, 11);
  linha(cx + 33 * s, cK, 57);
};
// posições das letras C e T (em unidades da tela pequena)
const posT = (cx: number, cy: number, s: number) => ({
  x: cx - 2 * s,
  y: cy - 13 * s - 4,
});
const posC = (cx: number, cy: number, s: number) => ({
  x: cx + 33 * s,
  y: cy - 13 * s - 4,
});

const fundoMicro = (p: Px, t: number) => {
  p.fill(VINHO);
  for (let i = 0; i < 70; i++) {
    const x = rnd(i) * W;
    const y = (rnd(i + 99) * H + t * 10 * (0.4 + rnd(i + 7))) % H;
    p.rect(x, y, 2, 2, VINHO2);
  }
};
const cartao = (p: Px, x: number, y: number, w: number, h: number) => {
  p.rect(x + 4, y + 5, w, h, NAVY2);
  p.rect(x - 2, y - 2, w + 4, h + 4, CREME_B);
  p.rect(x, y, w, h, CREME);
  p.rect(x + 18, y + 10, w - 26, 4, ROSA);
  p.circle(x + 10, y + 12, 3, ROSA);
  p.rect(x + 9, y + 7, 2, 3, ROSA);
};

// ---------- cenas desenhadas ----------
const desenha = (p: Px, f: number) => {
  const t = f / FPS;

  // 0) gancho: o palitinho com uma pergunta
  if (t < T.ut) {
    p.fill(NAVY);
    const pisca = Math.floor(f / 9) % 2 === 0 ? 1 : 0;
    cassete(p, 135, 260, 1.25, pisca, 1);
    return;
  }

  // 1) útero, embrião, hCG → sangue → urina
  if (t < T.fita) {
    const tt = t - T.ut;
    p.fill(NAVY);
    cartao(p, 18, 60, 234, 372);
    // trompas
    p.line(97, 162, 52, 130, OUT, 9);
    p.line(97, 162, 52, 130, UTERO, 6);
    p.line(173, 162, 218, 130, OUT, 9);
    p.line(173, 162, 218, 130, UTERO, 6);
    p.circle(48, 127, 9, OUT);
    p.circle(48, 127, 8, UTERO);
    p.circle(222, 127, 9, OUT);
    p.circle(222, 127, 8, UTERO);
    // corpo do útero
    for (let y = 175; y <= 252; y++) {
      const hw = lerp(50, 16, (y - 175) / 77) + 2;
      p.rect(135 - hw, y, hw * 2, 1, OUT);
    }
    p.circle(135, 178, 52, OUT);
    for (let y = 175; y <= 250; y++) {
      const hw = lerp(48, 14, (y - 175) / 75);
      p.rect(135 - hw, y, hw * 2, 1, UTERO);
    }
    p.circle(135, 178, 50, UTERO);
    p.rect(122, 250, 26, 16, OUT);
    p.rect(124, 250, 22, 14, UTERO);
    // cavidade
    for (let y = 158; y <= 228; y++) {
      const hw = lerp(30, 3, (y - 158) / 70);
      p.rect(135 - hw, y, hw * 2, 1, UTERO_E);
    }
    p.rect(108, 150, 10, 4, claro(UTERO, 0.4));
    // vaso de sangue: do útero para a direita e para baixo
    const vaso = (k: number) => {
      p.rect(183, 186, 40, 12, OUT);
      p.rect(211, 186, 12, 150, OUT);
      p.rect(184, 188, 38, 8, SANGUE);
      p.rect(213, 188, 8, 146, SANGUE);
      for (let i = 0; i < 9; i++) {
        const q = (i / 9 + tt * 0.35) % 1;
        const L = 38 + 146;
        const d = q * L;
        const [x, y] = d < 38 ? [185 + d, 191] : [216, 189 + (d - 38)];
        p.rect(x, y, 2, 2, claro(SANGUE, 0.35 * k));
      }
    };
    vaso(1);
    // gota de urina
    const gy = 372;
    p.circle(217, gy, 18, OUT);
    for (let i = 0; i < 18; i++)
      p.rect(217 - i / 2 - 1, gy - 36 + i, i + 2, 1, OUT);
    p.circle(217, gy, 16, URINA);
    for (let i = 0; i < 17; i++) p.rect(217 - i / 2, gy - 34 + i, i, 1, URINA);
    p.rect(208, gy - 6, 3, 5, claro(URINA, 0.6));
    // embrião
    const ek = eo((tt - 0.4) / 2.4);
    const caminho: [number, number][] = [
      [52, 130],
      [97, 162],
      [128, 172],
    ];
    const seg = ek < 0.5 ? 0 : 1;
    const kk = ek < 0.5 ? ek / 0.5 : (ek - 0.5) / 0.5;
    const ex = lerp(caminho[seg][0], caminho[seg + 1][0], kk);
    const ey = lerp(caminho[seg][1], caminho[seg + 1][1], kk);
    if (tt > 2.9) p.ring(ex, ey, 9 + ((f % 20) / 20) * 6, 1, OURO_CL, 0.7);
    p.circle(ex, ey, 6, OUT);
    p.circle(ex, ey, 5, c("#ffe0b0"));
    p.rect(ex - 2, ey - 2, 2, 2, BRANCO);
    // hormônios
    for (let i = 0; i < 16; i++) {
      const nasce = 3.3 + i * 0.32;
      const q = (tt - nasce) / 2.6;
      if (q < 0) continue;
      const pts: [number, number][] = [
        [128, 172],
        [190, 192],
        [217, 192],
        [217, 340],
        [217 + (rnd(i) - 0.5) * 16, 366 + (rnd(i + 3) - 0.5) * 14],
      ];
      const L = [0.25, 0.1, 0.5, 0.15];
      let qq = Math.min(q, 0.999);
      let s = 0;
      while (s < 3 && qq > L[s]) {
        qq -= L[s];
        s++;
      }
      const k2 = Math.min(1, qq / L[s]);
      const hx = lerp(pts[s][0], pts[s + 1][0], k2);
      const hy = lerp(pts[s][1], pts[s + 1][1], k2);
      hcg(p, hx, hy, q >= 1 ? 3 : 4);
    }
    return;
  }

  // 2) a fita por dentro: a urina sobe
  if (t < T.micro) {
    const tt = t - T.fita;
    p.fill(NAVY);
    const y0 = 210;
    const h = 52;
    p.rect(10, y0 - 2, 250, h + 4, OUT);
    p.rect(12, y0, 48, h, c("#e6d6b0"));
    for (let i = 0; i < 40; i++)
      p.rect(
        14 + rnd(i) * 44,
        y0 + 2 + rnd(i + 5) * (h - 4),
        2,
        1,
        c("#cdbb8f"),
      );
    p.rect(60, y0, 42, h, c("#f2c6d6"));
    p.rect(102, y0, 118, h, c("#fbfaf4"));
    p.rect(220, y0, 38, h, c("#d4c8ae"));
    p.rect(60, y0, 1, h, OUT);
    p.rect(102, y0, 1, h, OUT);
    p.rect(220, y0, 1, h, OUT);
    // zonas das linhas (ainda vazias)
    for (let yy = y0 + 4; yy < y0 + h - 4; yy += 3) {
      p.rect(150, yy, 4, 1, c("#e3ddd0"));
      p.rect(196, yy, 4, 1, c("#e3ddd0"));
    }
    // gota caindo
    const gk = cl(tt / 0.5);
    if (gk < 1) {
      p.circle(36, lerp(110, 204, gk * gk), 6, OUT);
      p.circle(36, lerp(110, 204, gk * gk), 5, URINA);
    }
    // frente da urina
    const fx = 12 + 246 * eo((tt - 0.4) / 3.8);
    for (let yy = y0; yy < y0 + h; yy++) {
      const fr = fx + Math.sin(yy * 0.5 + tt * 8) * 2;
      for (let xx = 12; xx < Math.min(fr, 258); xx++)
        p.set(xx, yy, URINA, 0.32);
    }
    // anticorpos com tinta, levados pela urina
    for (let i = 0; i < 7; i++) {
      const x0 = 66 + (i % 4) * 10;
      const yy = y0 + 12 + (i % 3) * 14 + (i > 3 ? 6 : 0);
      const x = x0 + Math.max(0, fx - x0 - 6) * (0.75 + rnd(i) * 0.2);
      if (x > 252) continue;
      anticorpo(p, x, yy, 1, CIANO, i % 2 ? "baixo" : "cima", true);
    }
    return;
  }

  // 3) zoom: o anticorpo agarra o hCG
  if (t < T.tline) {
    const tt = t - T.micro;
    fundoMicro(p, t);
    for (let i = 0; i < 6; i++) {
      const x = (rnd(i + 20) * W + tt * 12 * (rnd(i) - 0.5) * 2 + W) % W;
      const y = 60 + rnd(i + 40) * 380;
      if (Math.abs(x - 150) < 50 && Math.abs(y - 230) < 70) continue;
      if (i % 2) hcg(p, x, y, 4);
      else anticorpo(p, x, y, 1, CIANO, "baixo", true);
    }
    const bob = Math.sin(tt * 3) * 3;
    const hx = 150;
    const hy = 262 + bob;
    const k = eo((tt - 0.2) / 1.8);
    const ax = lerp(50, hx, k);
    const ay = lerp(80, hy - 16 - 15, k) + (k < 1 ? Math.sin(tt * 6) * 4 : 0);
    if (tt > 2 && tt < 2.6)
      p.ring(hx, hy - 16, 10 + (tt - 2) * 50, 2, OURO_CL, 1 - (tt - 2) / 0.6);
    hcg(p, hx, hy, 16);
    anticorpo(p, ax, ay, 4, CIANO, "baixo", true);
    return;
  }

  // 4) linha T por dentro: sanduíche preso na fita
  if (t < T.listra) {
    const tt = t - T.tline;
    fundoMicro(p, t);
    const fy = 330;
    p.rect(0, fy - 1, W, 18, OUT);
    p.rect(0, fy, W, 16, c("#efe8d8"));
    for (let x = 4; x < W; x += 9) p.rect(x, fy + 6, 4, 1, c("#d8cfbc"));
    const xs = [35, 85, 135, 185, 235];
    xs.forEach((x, i) => {
      anticorpo(p, x, fy - 14, 3, VIOLETA, "cima", false);
      const q = eo((tt - 0.5 - i * 0.65) / 1.1);
      const hy = lerp(-40, fy - 29, q);
      const wob = q < 1 ? Math.sin(tt * 5 + i) * 8 * (1 - q) : 0;
      hcg(p, x + wob, hy, 8);
      anticorpo(p, x + wob, hy - 8 - 14, 3, CIANO, "baixo", true);
      if (q >= 1) {
        const g = ((f + i * 7) % 24) / 24;
        p.ring(x, hy - 36, 6 + g * 8, 1, ROSA_CL, 1 - g);
      }
    });
    return;
  }

  // 5) muitos juntos = a listra
  if (t < T.sem) {
    const tt = t - T.listra;
    p.fill(NAVY);
    cassete(p, 135, 250, 1.25, eo((tt - 0.3) / 1.8), 0);
    return;
  }

  // 6) sem hCG: nada gruda
  if (t < T.cline) {
    const tt = t - T.sem;
    fundoMicro(p, t);
    const fy = 330;
    p.rect(0, fy - 1, W, 18, OUT);
    p.rect(0, fy, W, 16, c("#efe8d8"));
    [35, 85, 135, 185, 235].forEach((x) =>
      anticorpo(p, x, fy - 14, 3, VIOLETA, "cima", false),
    );
    for (let i = 0; i < 6; i++) {
      const x = -30 + ((tt * 110 + i * 60) % (W + 60));
      const y = 200 + Math.sin(tt * 3 + i * 2) * 14 + (i % 2) * 36;
      anticorpo(p, x, y, 3, CIANO, "baixo", true);
    }
    return;
  }

  // 7) linha C: pega a tinta que sobrou
  if (t < T.tres) {
    const tt = t - T.cline;
    fundoMicro(p, t);
    const fy = 330;
    p.rect(0, fy - 1, W, 18, OUT);
    p.rect(0, fy, W, 16, c("#e3f2e2"));
    const xs = [35, 85, 135, 185, 235];
    xs.forEach((x, i) => {
      anticorpo(p, x, fy - 14, 3, VERDE, "cima", false);
      const q = eo((tt - 0.4 - i * 0.4) / 1.0);
      const y = lerp(-40, fy - 14 - 27 + 4, q);
      const wob = q < 1 ? Math.sin(tt * 5 + i) * 8 * (1 - q) : 0;
      anticorpo(p, x + wob, y, 3, CIANO, "cima", true);
      if (q >= 1) {
        const g = ((f + i * 5) % 24) / 24;
        p.ring(x, y + 13.5, 6 + g * 8, 1, ROSA_CL, 1 - g);
      }
    });
    return;
  }

  // 8) três resultados
  if (t < T.dicas) {
    const tt = t - T.tres;
    p.fill(NAVY);
    const ys = [130, 245, 360];
    const tem = [
      [1, 1],
      [0, 1],
      [1, 0],
    ];
    ys.forEach((y, i) => {
      const k = tt > 0.3 + i * 1.5 ? 1 : 0;
      if (tt < 0.3 + i * 1.5 - 0.01) return;
      cassete(p, 92, y, 0.8, tem[i][0] * k, tem[i][1] * k);
      if (i === 2 && tt > 0.3 + i * 1.5 + 0.5) {
        p.line(30, y - 26, 154, y + 26, OUT, 9);
        p.line(30, y + 26, 154, y - 26, OUT, 9);
        p.line(30, y - 26, 154, y + 26, VERM, 6);
        p.line(30, y + 26, 154, y - 26, VERM, 6);
      }
    });
    return;
  }

  // 9) dicas
  if (t < T.rev) {
    const tt = t - T.dicas;
    p.fill(NAVY);
    cartao(p, 16, 70, 238, 360);
    const rows = [120, 205, 290, 375];
    const at = [0.3, 3.6, 6.8, 9.3];
    rows.forEach((y, i) => {
      if (tt < at[i]) return;
      const x = 50;
      if (i === 0) {
        p.rect(x - 19, y - 17, 38, 36, OUT);
        p.rect(x - 17, y - 15, 34, 32, BRANCO);
        p.rect(x - 17, y - 15, 34, 8, VERM);
        for (let r = 0; r < 3; r++)
          for (let q = 0; q < 4; q++) {
            const hl = r === 1 && q === 2;
            p.rect(
              x - 14 + q * 8,
              y - 4 + r * 7,
              5,
              4,
              hl ? (Math.floor(f / 10) % 2 ? ROSA : ROSA_CL) : CINZA_CL,
            );
          }
      } else if (i === 1) {
        const k = eo((tt - at[i]) / 1.2);
        p.circle(x, y + 12 - 10 * k, 13, OUT);
        p.circle(x, y + 12 - 10 * k, 12, OURO);
        for (let a = 0; a < 5; a++) {
          const ang = Math.PI + (a / 4) * Math.PI;
          const r1 = 16;
          const r2 = 22;
          p.line(
            x + Math.cos(ang) * r1,
            y + 2 - 10 * k + Math.sin(ang) * r1,
            x + Math.cos(ang) * r2,
            y + 2 - 10 * k + Math.sin(ang) * r2,
            OURO_CL,
            2,
          );
        }
        p.rect(x - 22, y + 12, 44, 10, CREME);
        p.rect(x - 22, y + 12, 44, 2, OUT);
      } else if (i === 2) {
        p.rect(x - 20, y - 6, 40, 14, OUT);
        p.rect(x - 18, y - 4, 36, 10, BRANCO);
        p.rect(x - 18, y - 4, 6, 10, VERM);
        hcg(p, x - 12, y - 16, 5);
        if (Math.floor(f / 8) % 2) {
          p.rect(x + 13, y - 24, 4, 11, VERM);
          p.rect(x + 13, y - 11, 4, 3, VERM);
        }
      } else {
        p.rect(x - 7, y - 22, 14, 42, OUT);
        p.rect(x - 5, y - 20, 10, 38, BRANCO);
        p.rect(x - 5, y - 4, 10, 22, SANGUE);
        p.rect(x - 9, y - 26, 18, 7, OUT);
        p.rect(x - 7, y - 24, 14, 4, VIOLETA);
        p.rect(x - 3, y - 2, 2, 12, claro(SANGUE, 0.4));
      }
    });
    return;
  }

  // 10) revelação
  if (t < T.siga) {
    p.fill(NAVY);
    const tt = t - T.rev;
    for (let i = 0; i < 24; i++) {
      const g = (((tt * 0.6 + rnd(i)) % 1) + 1) % 1;
      const x = rnd(i + 3) * W;
      const y = H - g * H;
      p.rect(x, y, 2, 2, i % 3 ? ROSA_CL : OURO_CL);
    }
    cassete(p, 135, 250, 1.25, 1, 1);
    return;
  }

  // 11) me siga / 12) final
  p.fill(NAVY);
  for (let i = 0; i < 30; i++) {
    const g = (((t * 0.3 + rnd(i)) % 1) + 1) % 1;
    p.rect(rnd(i + 3) * W, H - g * H, 2, 2, i % 3 ? VINHO2 : CINZA);
  }
};

// ---------- tela em pixel ----------
const Tela: React.FC<{ f: number; clip?: string }> = ({ f, clip }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const p = new Px();
    desenha(p, f);
    const img = ctx.createImageData(W, H);
    img.data.set(p.d);
    ctx.putImageData(img, 0, 0);
  });
  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W * K,
        height: H * K,
        imageRendering: "pixelated",
        clipPath: clip,
      }}
    />
  );
};

// ---------- textos ----------
const Etiqueta: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  text: string;
  size?: number;
  cor?: string;
  largura?: number;
  linha?: [number, number, number, number];
}> = ({ f, at, x, y, text, size = 36, cor = "#f4ecd8", largura, linha }) => {
  const t = f / FPS;
  if (t < at) return null;
  const n = Math.floor((t - at) * FPS * 1.6);
  const vis = text.slice(0, n);
  const resto = text.slice(n);
  const digitando = n < text.length;
  return (
    <>
      {linha && (
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <line
            x1={linha[0] * K}
            y1={linha[1] * K}
            x2={linha[2] * K}
            y2={linha[3] * K}
            stroke="#f4ecd8"
            strokeWidth={4}
            strokeDasharray="4 8"
            shapeRendering="crispEdges"
          />
          <rect
            x={linha[2] * K - 6}
            y={linha[3] * K - 6}
            width={12}
            height={12}
            fill="#f4ecd8"
          />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: x * K,
          top: y * K,
          maxWidth: largura ? largura * K : undefined,
          background: "#0b0b0f",
          border: "4px solid #4b4538",
          boxShadow: "8px 8px 0 rgba(0,0,0,0.45)",
          padding: "8px 16px 6px",
          fontFamily: PIX,
          fontWeight: 400,
          fontSynthesis: "none",
          fontSize: size,
          lineHeight: 1.2,
          color: cor,
          letterSpacing: 1,
        }}
      >
        {vis}
        {digitando && Math.floor(f / 4) % 2 === 0 && (
          <span style={{ color: "#f2b33d" }}>█</span>
        )}
        <span style={{ visibility: "hidden" }}>{resto}</span>
      </div>
    </>
  );
};

const Titulo: React.FC<{
  f: number;
  at: number;
  y: number;
  text: string;
  size: number;
  cor?: string;
  sombra?: string;
  digita?: boolean;
}> = ({
  f,
  at,
  y,
  text,
  size,
  cor = "#f4ecd8",
  sombra = "#000",
  digita = true,
}) => {
  const t = f / FPS;
  if (t < at) return null;
  const n = digita ? Math.floor((t - at) * FPS * 1.4) : text.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: y,
        textAlign: "center",
        fontFamily: PIX,
        fontWeight: 400,
        fontSynthesis: "none",
        fontSize: size,
        lineHeight: 1.15,
        color: cor,
        textShadow: `6px 6px 0 ${sombra}`,
      }}
    >
      {text.slice(0, n)}
      <span style={{ visibility: "hidden" }}>{text.slice(n)}</span>
    </div>
  );
};

const Letra: React.FC<{ x: number; y: number; ch: string; size?: number }> = ({
  x,
  y,
  ch,
  size = 34,
}) => (
  <div
    style={{
      position: "absolute",
      left: x * K - 40,
      width: 80,
      top: y * K - size - 4,
      textAlign: "center",
      fontFamily: PIX,
      fontWeight: 400,
      fontSynthesis: "none",
      fontSize: size,
      color: "#f4ecd8",
      textShadow: "4px 4px 0 #000",
    }}
  >
    {ch}
  </div>
);

// ---------- vídeo ----------
export const VideoGravidezPixel: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const irisK = (t - T.micro) * FPS;
  const iris = irisK >= 0 && irisK < 14;

  return (
    <AbsoluteFill style={{ background: "#0f1b2a" }}>
      {iris ? (
        <>
          <Tela f={S(T.micro) - 1} />
          <Tela
            f={f}
            clip={`circle(${(irisK / 14) * 130}% at ${80 * K}px ${236 * K}px)`}
          />
        </>
      ) : (
        <Tela f={f} />
      )}

      {/* 0) gancho */}
      {t < T.ut && (
        <>
          <Titulo
            f={f}
            at={0.1}
            y={300}
            size={74}
            text="Como um palitinho sabe que você está grávida?"
          />
          <Letra {...posT(135, 260, 1.25)} ch="T" />
          <Letra {...posC(135, 260, 1.25)} ch="C" />
          <Titulo
            f={f}
            at={1.2}
            y={1220}
            size={170}
            cor="#f2b33d"
            sombra="#7a4e00"
            digita={false}
            text={Math.floor(f / 10) % 2 ? "?" : " "}
          />
        </>
      )}

      {/* 1) útero */}
      {t >= T.ut && t < T.fita && (
        <>
          <Etiqueta
            f={f}
            at={T.ut + 0.5}
            x={26}
            y={78}
            text="O embrião se fixa no útero"
            linha={[60, 92, 120, 170]}
          />
          <Etiqueta
            f={f}
            at={T.ut + 3.4}
            x={26}
            y={292}
            largura={170}
            text="hCG = hormônio da gravidez"
            cor="#f2b33d"
            linha={[150, 292, 205, 240]}
          />
          <Etiqueta
            f={f}
            at={T.ut + 6.2}
            x={26}
            y={358}
            text="sangue → urina"
            linha={[130, 365, 196, 372]}
          />
        </>
      )}

      {/* 2) fita */}
      {t >= T.fita && t < T.micro && (
        <>
          <Etiqueta
            f={f}
            at={T.fita + 0.5}
            x={14}
            y={150}
            text="A urina sobe pela fita →"
          />
          <Letra x={152} y={204} ch="T" />
          <Letra x={198} y={204} ch="C" />
          <Etiqueta
            f={f}
            at={T.fita + 1.8}
            x={30}
            y={292}
            largura={200}
            text="anticorpos com tinta rosa"
            cor="#ff9dbd"
            linha={[80, 292, 80, 248]}
          />
        </>
      )}

      {/* 3) micro */}
      {t >= T.micro && t < T.tline && irisK >= 14 && (
        <>
          <Etiqueta
            f={f}
            at={T.micro + 0.6}
            x={14}
            y={130}
            text="anticorpo"
            cor="#4fd0e6"
            linha={[50, 142, 120, 210]}
          />
          <Etiqueta
            f={f}
            at={T.micro + 1.2}
            x={170}
            y={318}
            text="hCG"
            cor="#f2b33d"
            linha={[185, 318, 162, 272]}
          />
          <Etiqueta
            f={f}
            at={T.micro + 1.8}
            x={170}
            y={92}
            text="tinta"
            cor="#ff9dbd"
            linha={[190, 108, 152, 200]}
          />
          <Etiqueta
            f={f}
            at={T.micro + 2.3}
            x={30}
            y={380}
            size={40}
            text="Agarrou o hCG!"
            cor="#f2b33d"
          />
        </>
      )}

      {/* 4) linha T */}
      {t >= T.tline && t < T.listra && (
        <>
          <Etiqueta
            f={f}
            at={T.tline + 0.2}
            x={14}
            y={362}
            text="Linha T: anticorpos presos"
            cor="#a67bf0"
            linha={[40, 362, 35, 346]}
          />
          <Etiqueta
            f={f}
            at={T.tline + 3.2}
            x={14}
            y={80}
            largura={240}
            size={34}
            text="preso + hCG + tinta = sanduíche"
          />
        </>
      )}

      {/* 5) listra */}
      {t >= T.listra && t < T.sem && (
        <>
          <Letra {...posT(135, 250, 1.25)} ch="T" />
          <Letra {...posC(135, 250, 1.25)} ch="C" />
          <Etiqueta
            f={f}
            at={T.listra + 0.4}
            x={20}
            y={110}
            largura={230}
            size={36}
            text="Muitos juntos = a listra"
            cor="#ff9dbd"
            linha={[100, 140, 132, 222]}
          />
        </>
      )}

      {/* 6) sem hCG */}
      {t >= T.sem && t < T.cline && (
        <>
          <Etiqueta
            f={f}
            at={T.sem + 0.1}
            x={14}
            y={80}
            size={40}
            text="Sem hCG..."
            cor="#f2b33d"
          />
          <Etiqueta
            f={f}
            at={T.sem + 1.1}
            x={14}
            y={362}
            largura={240}
            text="nada gruda: a linha fica em branco"
          />
        </>
      )}

      {/* 7) linha C */}
      {t >= T.cline && t < T.tres && (
        <>
          <Etiqueta
            f={f}
            at={T.cline + 0.1}
            x={14}
            y={80}
            size={36}
            text="Linha de controle (C)"
            cor="#6fdc8c"
          />
          <Etiqueta
            f={f}
            at={T.cline + 1.8}
            x={14}
            y={362}
            largura={240}
            text="pega a tinta que sobrou: aparece sempre"
          />
        </>
      )}

      {/* 8) três resultados */}
      {t >= T.tres && t < T.dicas && (
        <>
          <Titulo
            f={f}
            at={T.tres}
            y={190}
            size={50}
            cor="#6fdc8c"
            text="C = o teste funcionou"
          />
          {[130, 245, 360].map((y, i) =>
            t >= T.tres + 0.3 + i * 1.5 ? (
              <React.Fragment key={i}>
                <Letra {...posT(92, y, 0.8)} ch="T" size={26} />
                <Letra {...posC(92, y, 0.8)} ch="C" size={26} />
              </React.Fragment>
            ) : null,
          )}
          <Etiqueta
            f={f}
            at={T.tres + 0.4}
            x={176}
            y={118}
            size={30}
            text="C + T"
            cor="#ff9dbd"
          />
          <Etiqueta
            f={f}
            at={T.tres + 1.9}
            x={176}
            y={233}
            size={30}
            text="só C"
          />
          <Etiqueta
            f={f}
            at={T.tres + 3.6}
            x={176}
            y={340}
            size={30}
            largura={88}
            text="sem C: não vale"
            cor="#ff6b6b"
          />
        </>
      )}

      {/* 9) dicas */}
      {t >= T.dicas && t < T.rev && (
        <>
          <Etiqueta
            f={f}
            at={T.dicas + 0.4}
            x={82}
            y={108}
            largura={164}
            text="a partir do 1º dia de atraso"
          />
          <Etiqueta
            f={f}
            at={T.dicas + 3.7}
            x={82}
            y={196}
            largura={164}
            text="1ª urina da manhã"
          />
          <Etiqueta
            f={f}
            at={T.dicas + 6.9}
            x={82}
            y={276}
            largura={164}
            text="cedo demais: falso negativo"
            cor="#ff6b6b"
          />
          <Etiqueta
            f={f}
            at={T.dicas + 9.4}
            x={82}
            y={362}
            largura={164}
            text="na dúvida: exame de sangue"
            cor="#f2b33d"
          />
        </>
      )}

      {/* 10) revelação */}
      {t >= T.rev && t < T.siga && (
        <>
          <Titulo
            f={f}
            at={T.rev}
            y={330}
            size={130}
            cor="#f2b33d"
            sombra="#7a4e00"
            digita={false}
            text="2 listras"
          />
          <Titulo
            f={f}
            at={T.rev + 0.5}
            y={490}
            size={52}
            text="= hCG detectado"
          />
          <Letra {...posT(135, 250, 1.25)} ch="T" />
          <Letra {...posC(135, 250, 1.25)} ch="C" />
          <Titulo
            f={f}
            at={T.rev + 1}
            y={1260}
            size={44}
            cor="#ff9dbd"
            text="Manda para quem vive com medo de ler esse teste"
          />
        </>
      )}

      {/* 11) me siga */}
      {t >= T.siga && t < T.fim && (
        <>
          <div
            style={{
              position: "absolute",
              left: 340,
              top: 420,
              width: 400,
              height: 400,
              border: "12px solid #f4ecd8",
              boxShadow: "12px 12px 0 #000",
              imageRendering: "pixelated",
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile("gravidezPixel/logo.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <Titulo
            f={f}
            at={T.siga}
            y={900}
            size={110}
            cor="#f2b33d"
            sombra="#7a4e00"
            digita={false}
            text="Me siga"
          />
          <Titulo
            f={f}
            at={T.siga + 0.4}
            y={1050}
            size={48}
            text="para mais dicas de farmacologia e curiosidades sobre a área"
          />
        </>
      )}

      {/* 12) final */}
      {t >= T.fim && (
        <Titulo
          f={f}
          at={T.fim}
          y={820}
          size={60}
          text="Consulte um profissional de saúde para orientações."
        />
      )}

      <div
        style={{
          position: "absolute",
          left: 30,
          bottom: 30,
          fontFamily: PIX,
          fontSize: 26,
          color: "#f4ecd8",
          background: "rgba(0,0,0,0.6)",
          padding: "6px 12px",
        }}
      >
        PRÉVIA SEM ÁUDIO
      </div>
    </AbsoluteFill>
  );
};
