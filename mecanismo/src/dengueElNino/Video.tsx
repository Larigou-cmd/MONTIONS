import React, { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import falaJson from "./fala.json";

// Dengue × El Niño: por que a dengue pode voltar com força no verão — estilo gibi antigo (base: src/adrenalina).
// Roteiro e fontes: roteiros/dengue_el_nino.md. Canvas 720×1280 (escala 1,5 → 1080×1920), a 12 quadros por segundo.

type Pal = { w: string; f: number | null };
const FALA = (falaJson as Pal[]).map((p, i, a) => {
  if (p.f != null) return { w: p.w, f: p.f };
  // palavra que a transcrição não achou: fica no meio das vizinhas
  let j = i - 1,
    k = i + 1;
  while (j >= 0 && a[j].f == null) j--;
  while (k < a.length && a[k].f == null) k++;
  const fa = j >= 0 ? (a[j].f as number) : 0;
  const fb = k < a.length ? (a[k].f as number) : fa + 20;
  return { w: p.w, f: Math.round(fa + ((fb - fa) * (i - j)) / (k - j)) };
});


// frame (30 fps) de cada momento, tirado da narração (fala.json)
const T = {
  caiu: 126,
  relaxar: 242,
  queda: 365,
  alerta: 477,
  chegando: 563,
  aquece: 656,
  ajuda: 830,
  chove: 921,
  seco: 1021,
  nos: 1114,
  vezes: 1207,
  previsao: 1457,
  agir: 1670,
  tampe: 1783,
  febre: 1917,
  manda: 2021,
  siga: 2080,
  final: 2223,
};
export const DURATION_DENGUE_ELNINO = T.final + 90;
const W = 720,
  H = 1280,
  TAU = Math.PI * 2;
const K = "#141210",
  PAPER = "#f4ead2",
  RED = "#e3202b",
  YEL = "#f1e4c4",
  BLUE = "#c3cfd2",
  NAVY = "#7d7a72",
  WHITE = "#fffaf0",
  PINK = "#f7a3a6",
  BROWN = "#b9ab95",
  ICE = "#f4ead2",
  GREEN = "#9b988c";
const IMPACT = 'Impact, "Arial Black", sans-serif';
const COMIC = '"Comic Sans MS", "Comic Sans", sans-serif';

const h = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const h2 = (a: number, b: number) => h(a * 57.31 + b * 131.73 + 7.7);
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const P = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const pop = (t: number, d = 7) => {
  const x = cl(t / d);
  if (x <= 0) return 0;
  const y = x - 1;
  return 1 + 2.4 * y * y * y + 1.4 * y * y;
};

let ctx: CanvasRenderingContext2D;
let rx = 0,
  ry = 0;
let PAT: Record<string, CanvasPattern> = {};
let patCtx: CanvasRenderingContext2D | null = null;

function dots(spacing: number, r: number, color: string) {
  const o = document.createElement("canvas");
  o.width = o.height = spacing;
  const g = o.getContext("2d")!;
  g.fillStyle = color;
  [
    [0, 0],
    [spacing, 0],
    [0, spacing],
    [spacing, spacing],
    [spacing / 2, spacing / 2],
  ].forEach((p) => {
    g.beginPath();
    g.arc(p[0], p[1], r, 0, TAU);
    g.fill();
  });
  return ctx.createPattern(o, "repeat")!;
}
let grain: HTMLCanvasElement | null = null;
function init() {
  if (patCtx === ctx) return;
  patCtx = ctx;
  PAT = {
    white: dots(18, 4, WHITE),
    white2: dots(18, 5.6, WHITE),
    shade: dots(12, 3.3, K),
    red: dots(14, 3.6, RED),
    blue: dots(14, 2.8, BLUE),
    yel: dots(16, 4, YEL),
  };
  grain = document.createElement("canvas");
  grain.width = W;
  grain.height = H;
  const g = grain.getContext("2d")!;
  let s = 1961;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = r() < 0.5 ? "rgba(90,60,20,0.07)" : "rgba(255,255,255,0.08)";
    g.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2);
  }
}

// cor deslocada + contorno preto no lugar (impressão "fora de registro")
function ink(path: () => void, fill: string | CanvasPattern | null, lw = 8) {
  if (fill) {
    ctx.save();
    ctx.translate(rx, ry);
    path();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
  }
  if (lw) {
    path();
    ctx.lineWidth = lw;
    ctx.strokeStyle = K;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }
}
const circ = (x: number, y: number, r: number) => () => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
};
const ell = (x: number, y: number, a: number, b: number) => () => {
  ctx.beginPath();
  ctx.ellipse(x, y, a, b, 0, 0, TAU);
};
const rect = (x: number, y: number, w: number, hh: number) => () => {
  ctx.beginPath();
  ctx.rect(x, y, w, hh);
};
function line(pts: number[][], color: string, lw: number) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}
function tube(pts: number[][], color: string, lw: number) {
  line(pts, K, lw + 12);
  line(pts, color, lw);
}

// ---------- fundos ----------
const PX = 28,
  PY = 150,
  PW = 664,
  PH = 700; // quadrinho principal
const CX = 360,
  CY = PY + PH / 2;
function rays(_c1: string, _c2: string, f12: number, n = 16, cx = CX, cy = CY, speed = 1) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(PX, PY, PW, PH);
  const rot = (f12 / 72) * (TAU / (n / 2)) * speed;
  ctx.fillStyle = "rgba(120,95,60,0.09)";
  for (let i = 0; i < n; i += 2) {
    const a0 = rot + (i / n) * TAU,
      a1 = rot + ((i + 1) / n) * TAU;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * 1100, cy + Math.sin(a0) * 1100);
    ctx.lineTo(cx + Math.cos(a1) * 1100, cy + Math.sin(a1) * 1100);
    ctx.closePath();
    ctx.fill();
  }
}
function halftone(_color: string, _pat: string, f12: number, _alpha = 0.85) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(PX, PY, PW, PH);
  ctx.save();
  const sh = (f12 % 36) * 0.5;
  ctx.translate(-sh, sh * 0.5);
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = PAT.shade;
  ctx.fillRect(0, 0, W + 40, H);
  ctx.restore();
}
function speedLines(
  f12: number,
  cx = CX,
  cy = CY,
  rin = 250,
  colorA = WHITE,
  colorB = K,
) {
  const N = 44,
    k = f12 % 6;
  for (let i = 0; i < N; i++) {
    const a = ((i + (h2(i, k) - 0.5) * 0.7) / N) * TAU;
    const black = i % 3 === 0;
    const dw = (black ? 0.012 : 0.03) + h2(i + 50, k) * 0.022;
    const r0 = rin + h2(i + 99, k) * 200;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a - dw) * 1100, cy + Math.sin(a - dw) * 1100);
    ctx.lineTo(cx + Math.cos(a + dw) * 1100, cy + Math.sin(a + dw) * 1100);
    ctx.closePath();
    ctx.fillStyle = black ? colorB : colorA;
    ctx.fill();
  }
}

// ---------- balão estourado com onomatopeia ----------
function burstPath(
  a: number,
  b: number,
  n: number,
  seed: number,
  boil: number,
) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const out = i % 2 === 0;
    const an = (i / (n * 2)) * TAU + (h2(i + seed, boil) - 0.5) * 0.09;
    const m = out
      ? 1 + h2(i + seed * 3, boil) * 0.2
      : 0.66 + h2(i + seed * 5, boil) * 0.07;
    const x = Math.cos(an) * a * m,
      y = Math.sin(an) * b * m;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}
function letters(
  text: string,
  maxW: number,
  size: number,
  f12: number,
  fill: string,
  shake = 1,
) {
  const fontOf = (s: number) => `900 ${s}px ${IMPACT}`;
  const sizes: number[] = [],
    widths: number[] = [];
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const s = size * (1 + (i / Math.max(1, text.length - 1)) * 0.35);
    ctx.font = fontOf(s);
    const w = ctx.measureText(text[i] === " " ? "n" : text[i]).width + 2;
    sizes.push(s);
    widths.push(w);
    total += w;
  }
  const gap = size * 0.07;
  total += gap * (text.length - 1);
  const fit = Math.min(1, maxW / total);
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
  for (let pass = 0; pass < 3; pass++) {
    let x = (-total * fit) / 2;
    for (let i = 0; i < text.length; i++) {
      const s = sizes[i] * fit, w = widths[i] * fit, ch = text[i];
      if (ch !== " ") {
        const lx = x + w / 2 + (h2(i, f12) - 0.5) * 5 * shake;
        const ly = (h2(i + 20, f12) - 0.5) * 8 * shake + (i % 2 ? 6 : -5) * fit;
        const rot = (h(i * 7.3) - 0.5) * 0.2 + (h2(i + 40, f12) - 0.5) * 0.06 * shake;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(rot);
        ctx.font = fontOf(s);
        const o = Math.max(7, s * 0.1);
        if (pass === 0) { ctx.fillStyle = K; ctx.strokeStyle = K; ctx.lineWidth = o * 1.9; ctx.strokeText(ch, o * 0.5, o * 0.55); ctx.fillText(ch, o * 0.5, o * 0.55); }
        if (pass === 1) { ctx.strokeStyle = WHITE; ctx.lineWidth = o * 1.9; ctx.strokeText(ch, 0, 0); }
        if (pass === 2) { ctx.strokeStyle = K; ctx.lineWidth = o; ctx.strokeText(ch, 0, 0); ctx.fillStyle = fill; ctx.fillText(ch, rx * 0.6, ry * 0.6); }
        ctx.restore();
      }
      x += w + gap * fit;
    }
  }
}
function boom(
  text: string,
  x: number,
  y: number,
  a: number,
  b: number,
  t: number,
  f12: number,
  o: {
    outer?: string;
    inner?: string;
    fill?: string;
    rot?: number;
    size?: number;
  } = {},
) {
  const s = pop(t);
  if (s <= 0) return;
  const beat = (f12 % 12) / 12;
  const pulse = 1 + 0.07 * Math.exp(-beat * 5);
  const boil = Math.floor(f12 / 2) % 3;
  ctx.save();
  ctx.translate(x + (h(f12 * 3 + 1) - 0.5) * 7, y + (h(f12 * 3 + 2) - 0.5) * 7);
  ctx.rotate((o.rot ?? -0.06) + Math.sin((f12 / 72) * TAU * 3) * 0.03);
  ctx.scale(s * pulse, s * pulse);
  ctx.save();
  ctx.translate(12, 14);
  burstPath(a, b, 17, 1, boil);
  ctx.fillStyle = K;
  ctx.fill();
  ctx.restore();
  ink(() => burstPath(a, b, 17, 1, boil), o.outer ?? RED, 10);
  ink(() => burstPath(a * 0.81, b * 0.78, 15, 9, boil), o.inner ?? YEL, 7);
  letters(text, a * 1.75, o.size ?? b * 0.72, f12, o.fill ?? RED);
  ctx.restore();
}
// etiqueta de quadrinho (caixa de recordatório)
function tag(
  text: string,
  x: number,
  y: number,
  size: number,
  t: number,
  bg = YEL,
  rot = -0.04,
  fg = K,
) {
  const s = pop(t, 5);
  if (s <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.font = `900 ${size}px ${IMPACT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const w = ctx.measureText(text).width + size * 0.9,
    hh = size * 1.5;
  ctx.fillStyle = K;
  ctx.fillRect(-w / 2 + 7, -hh / 2 + 8, w, hh);
  ink(rect(-w / 2, -hh / 2, w, hh), bg, 6);
  ctx.fillStyle = fg;
  ctx.fillText(text, 0, size * 0.06);
  ctx.restore();
}

type Mood = "susto" | "frio" | "alivio";
function face(
  cx: number,
  cy: number,
  s: number,
  f12: number,
  mood: Mood,
  pale = 0,
) {
  const shake = mood === "alivio" ? 1 : mood === "frio" ? 12 : 7;
  ctx.save();
  ctx.translate(
    cx + (h(f12 * 5 + 3) - 0.5) * shake,
    cy + (h(f12 * 5 + 4) - 0.5) * shake,
  );
  ctx.scale(s, s);
  const R = 232,
    head = circ(0, 0, R),
    skin = pale > 0.5 ? ICE : PAPER;
  ink(head, skin, 0);
  if (pale < 0.5)
    [
      [-150, 70],
      [150, 70],
    ].forEach((c) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(c[0], c[1], 46, 0, TAU);
      ctx.clip();
      ctx.fillStyle = PAT.red;
      ctx.fillRect(c[0] - 50, c[1] - 50, 100, 100);
      ctx.restore();
    });
  else
    [
      [-150, 70],
      [150, 70],
    ].forEach((c) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(c[0], c[1], 46, 0, TAU);
      ctx.clip();
      ctx.fillStyle = PAT.blue;
      ctx.fillRect(c[0] - 50, c[1] - 50, 100, 100);
      ctx.restore();
    });
  ctx.save();
  head();
  ctx.clip();
  ink(rect(-260, -260, 520, 148), RED, 0);
  ink(rect(-30, -260, 60, 148), WHITE, 6);
  line(
    [
      [-260, -112],
      [260, -112],
    ],
    K,
    12,
  );
  ctx.restore();
  ink(head, null, 12);
  [-78, 78].forEach((dx) => {
    ink(ell(dx, -158, 58, 34), BLUE, 9);
    line(
      [
        [dx - 28, -166],
        [dx - 8, -176],
      ],
      WHITE,
      7,
    );
  });
  const beat = (f12 % 12) / 12;
  if (mood === "alivio") {
    [-92, 92].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(dx, -10, 56, Math.PI * 1.1, Math.PI * 1.9);
      ctx.strokeStyle = K;
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(0, 86, 60, Math.PI * 0.15, Math.PI * 0.85);
    ctx.strokeStyle = K;
    ctx.lineWidth = 12;
    ctx.stroke();
  } else {
    const eyeR = 80 + 7 * Math.exp(-beat * 5),
      pupR = mood === "frio" ? 12 : 15 - 5 * Math.exp(-beat * 5);
    [-92, 92].forEach((dx, i) => {
      ink(circ(dx, -22, eyeR), WHITE, 11);
      for (let k = 0; k < 3; k++) {
        const a = (i ? -0.5 : Math.PI + 0.5) + (k - 1) * 0.32 * (i ? 1 : -1);
        line(
          [
            [dx + Math.cos(a) * (eyeR + 12), -22 + Math.sin(a) * (eyeR + 12)],
            [dx + Math.cos(a) * (eyeR + 30), -22 + Math.sin(a) * (eyeR + 30)],
          ],
          K,
          6,
        );
      }
      const px = dx + (h2(i, f12) - 0.5) * 12,
        py = -30 + (h2(i + 5, f12) - 0.5) * 12;
      ctx.fillStyle = K;
      ctx.beginPath();
      ctx.arc(px, py, pupR, 0, TAU);
      ctx.fill();
    });
    ctx.fillStyle = K;
    ctx.beginPath();
    ctx.moveTo(-13, 62);
    ctx.lineTo(13, 62);
    ctx.lineTo(0, 78);
    ctx.closePath();
    ctx.fill();
    if (mood === "frio") {
      const z: number[][] = [];
      for (let i = 0; i <= 8; i++)
        z.push([-56 + i * 14, 116 + (i % 2 ? -10 : 10) * (f12 % 2 ? 1 : -1)]);
      line(z, K, 9);
    } else {
      const mw = 30 + (f12 % 2) * 5,
        mh = 22 + ((f12 + 1) % 2) * 6;
      ink(ell(0, 112, mw, mh), K, 0);
      ink(ell(0, 112 + mh * 0.45, mw * 0.55, mh * 0.4), RED, 0);
    }
  }
  ctx.restore();
}
function drops(cx: number, cy: number, f12: number, color = WHITE, r0 = 250) {
  const angs = [-2.75, -0.38, 2.9, 0.22, -2.35, -0.8];
  angs.forEach((a, i) => {
    const ph = (f12 / 18 + i / angs.length) % 1;
    const r = r0 + ph * 90,
      s = (1 - ph * 0.6) * 15;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 0.7);
    ctx.rotate(a + Math.PI / 2);
    ink(
      () => {
        ctx.beginPath();
        ctx.moveTo(0, -s * 2.1);
        ctx.quadraticCurveTo(s * 1.2, 0, 0, s);
        ctx.quadraticCurveTo(-s * 1.2, 0, 0, -s * 2.1);
        ctx.closePath();
      },
      color,
      6,
    );
    ctx.restore();
  });
}

// ---------- desenhos novos: dengue e El Niño ----------
const GRAY = "#b9b4a6",
  DIRT = "#d8c7a6";

// mosquito da dengue (corpo preto com listras brancas), de lado, virado para a esquerda
function mosquito(x: number, y: number, s: number, f12: number, seed = 0, mean = true) {
  const fl = (f12 + seed) % 2 ? 1 : -1;
  ctx.save();
  ctx.translate(x + (h(f12 * 3.3 + seed) - 0.5) * 8, y + Math.sin(f12 * 1.3 + seed) * 7);
  ctx.scale(s, s);
  // pernas listradas
  for (let i = 0; i < 6; i++) {
    const lx = -26 + i * 14;
    const pts = [
      [lx, 14],
      [lx - 26 + i * 9, 62],
      [lx - 44 + i * 18, 128],
    ];
    line(pts, K, 7);
    line([pts[1], [pts[1][0] + (pts[2][0] - pts[1][0]) * 0.3, pts[1][1] + 20]], WHITE, 4);
    line([[pts[1][0] + (pts[2][0] - pts[1][0]) * 0.6, pts[1][1] + 40], [pts[1][0] + (pts[2][0] - pts[1][0]) * 0.75, pts[1][1] + 50]], WHITE, 4);
  }
  // asas batendo
  ctx.save();
  ctx.translate(6, -20);
  ctx.rotate(-0.55 + fl * 0.22);
  ink(ell(26, -58, 26, 72), "rgba(255,250,240,0.95)", 6);
  ctx.restore();
  ctx.save();
  ctx.translate(6, -20);
  ctx.rotate(0.15 + fl * 0.22);
  ink(ell(26, -50, 22, 60), "rgba(255,250,240,0.95)", 6);
  ctx.restore();
  // abdômen listrado
  const abd = () => {
    ctx.beginPath();
    ctx.ellipse(92, 16, 82, 28, 0.28, 0, TAU);
  };
  ink(abd, K, 7);
  ctx.save();
  abd();
  ctx.clip();
  for (let k = 0; k < 4; k++) {
    ctx.save();
    ctx.translate(58 + k * 34, 6 + k * 10);
    ctx.rotate(0.28);
    ctx.fillStyle = WHITE;
    ctx.fillRect(-5, -40, 10, 80);
    ctx.restore();
  }
  ctx.restore();
  ink(abd, null, 7);
  // tórax com a marca de "lira"
  ink(circ(0, 0, 38), K, 7);
  ctx.beginPath();
  ctx.arc(-4, 2, 20, Math.PI * 0.6, Math.PI * 1.4);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(6, 2, 20, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();
  // cabeça, olho e ferrão
  line([[-80, 4], [-158, 30]], K, 7);
  ink(circ(-58, -4, 27), K, 7);
  ink(circ(-64, -12, 12), WHITE, 4);
  ctx.fillStyle = K;
  ctx.beginPath();
  ctx.arc(-67, -11, 5, 0, TAU);
  ctx.fill();
  if (mean) line([[-82, -30], [-50, -20]], K, 7);
  ctx.restore();
}

function calendar(x: number, y: number, s: number, top: string, big: string, t: number, bigSize = 150) {
  const k = pop(t, 6);
  if (k <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.04);
  ctx.scale(s * k, s * k);
  ctx.fillStyle = K;
  ctx.fillRect(-140, -150, 296, 316);
  ink(rect(-150, -160, 300, 320), WHITE, 9);
  ink(rect(-150, -160, 300, 90), RED, 9);
  [-80, 80].forEach((dx) => ink(rect(dx - 9, -184, 18, 50), GRAY, 6));
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 62px ${IMPACT}`;
  ctx.fillStyle = WHITE;
  ctx.fillText(top, 0, -112);
  ctx.font = `900 ${bigSize}px ${IMPACT}`;
  ctx.fillStyle = K;
  ctx.fillText(big, 0, 50);
  ctx.restore();
}

// sol com cara de vilão (o El Niño)
function sunVillain(x: number, y: number, s: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const rot = (f12 / 24) * TAU * 0.25;
  for (let i = 0; i < 14; i++) {
    const a = rot + (i / 14) * TAU,
      r0 = 150,
      r1 = 225 + (i % 2) * 30;
    ink(
      () => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.12) * r0, Math.sin(a - 0.12) * r0);
        ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a + 0.12) * r0, Math.sin(a + 0.12) * r0);
        ctx.closePath();
      },
      i % 2 ? RED : YEL,
      7,
    );
  }
  ink(circ(0, 0, 160), YEL, 11);
  ctx.save();
  circ(0, 0, 160)();
  ctx.clip();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = PAT.red;
  ctx.fillRect(40, -170, 140, 340);
  ctx.restore();
  // sobrancelhas bravas, olhos e sorriso torto
  line([[-100, -78], [-28, -44]], K, 16);
  line([[100, -78], [28, -44]], K, 16);
  [-62, 62].forEach((dx) => {
    ink(circ(dx, -12, 26), WHITE, 8);
    ctx.fillStyle = K;
    ctx.beginPath();
    ctx.arc(dx + (dx < 0 ? 8 : -8), -6, 11, 0, TAU);
    ctx.fill();
  });
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-74, 52);
      ctx.quadraticCurveTo(0, 116, 80, 40);
      ctx.quadraticCurveTo(0, 82, -74, 52);
      ctx.closePath();
    },
    WHITE,
    9,
  );
  ctx.restore();
}

function sunSmall(x: number, y: number, s: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const rot = (f12 / 24) * TAU * 0.25;
  ctx.strokeStyle = K;
  for (let i = 0; i < 10; i++) {
    const a = rot + (i / 10) * TAU;
    line([[Math.cos(a) * 70, Math.sin(a) * 70], [Math.cos(a) * 104, Math.sin(a) * 104]], K, 16);
    line([[Math.cos(a) * 72, Math.sin(a) * 72], [Math.cos(a) * 100, Math.sin(a) * 100]], YEL, 8);
  }
  ink(circ(0, 0, 62), YEL, 9);
  ctx.restore();
}

function cloud(x: number, y: number, s: number, f12: number, rain = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  if (rain > 0)
    for (let i = 0; i < 9; i++) {
      const ph = (f12 / 6 + h(i * 3.1)) % 1;
      const dx = -120 + i * 30,
        dy = 40 + ph * 220;
      line([[dx, dy], [dx - 10, dy + 30]], K, 11);
      line([[dx, dy], [dx - 10, dy + 30]], BLUE, 6);
    }
  const puffs = [
    [-90, 10, 60],
    [-30, -30, 78],
    [50, -20, 70],
    [110, 16, 52],
    [10, 30, 66],
  ];
  puffs.forEach((p) => ink(circ(p[0], p[1], p[2] + 6), K, 0));
  puffs.forEach((p) => ink(circ(p[0], p[1], p[2]), WHITE, 0));
  ctx.save();
  ctx.globalAlpha = 0.35;
  puffs.forEach((p) => {
    ctx.save();
    circ(p[0], p[1] + 18, p[2])();
    ctx.clip();
    ctx.fillStyle = PAT.shade;
    ctx.fillRect(p[0] - 90, p[1], 180, 120);
    ctx.restore();
  });
  ctx.restore();
  ctx.restore();
}

function thermo(x: number, y: number, s: number, level: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ink(rect(-26, -200, 52, 230), WHITE, 9);
  ink(circ(0, 52, 48), RED, 10);
  ink(rect(-12, 20 - 210 * level, 24, 210 * level + 20), RED, 0);
  for (let i = 0; i < 6; i++) line([[8, -170 + i * 34], [24, -170 + i * 34]], K, 5);
  ctx.restore();
}

function waves(top: number, f12: number, color: string, amp = 18) {
  ctx.beginPath();
  ctx.moveTo(PX - 10, PY + PH + 10);
  for (let x = PX - 10; x <= PX + PW + 10; x += 12) ctx.lineTo(x, top + Math.sin(x / 46 + f12 * 0.7) * amp);
  ctx.lineTo(PX + PW + 10, PY + PH + 10);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 9;
  ctx.strokeStyle = K;
  ctx.stroke();
}

// pneu com água dentro
function tire(x: number, y: number, s: number, water: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ink(ell(0, 0, 120, 70), K, 0);
  ink(ell(0, -6, 64, 30), GRAY, 6);
  if (water > 0) {
    ink(ell(0, -4, 60 * water, 24 * water), BLUE, 0);
    line([[-24 * water, -10], [-6 * water, -14]], WHITE, 5);
    larvae(0, -4, 34 * water, f12, 3);
  }
  ink(ell(0, 0, 120, 70), null, 9);
  ctx.restore();
}

// vaso de planta com pratinho
function vase(x: number, y: number, s: number, water: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // folhas
  [[-40, -170, -0.5], [0, -190, 0], [40, -170, 0.5]].forEach(([lx, ly, r]) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(r);
    ink(ell(0, 0, 22, 60), GREEN, 7);
    ctx.restore();
  });
  ink(ell(0, 40, 118, 30), WHITE, 8);
  if (water > 0) {
    ink(ell(0, 38, 104 * water, 18 * water), BLUE, 0);
    larvae(-70, 38, 20 * water, f12, 2);
    larvae(70, 38, 20 * water, f12 + 1, 2);
  }
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-80, -110);
      ctx.lineTo(80, -110);
      ctx.lineTo(56, 32);
      ctx.lineTo(-56, 32);
      ctx.closePath();
    },
    BROWN,
    9,
  );
  ink(rect(-90, -130, 180, 30), BROWN, 9);
  ctx.restore();
}

// caixa d'água azul com tampa
function tank(x: number, y: number, s: number, lid: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-110, -60);
      ctx.lineTo(110, -60);
      ctx.lineTo(90, 90);
      ctx.quadraticCurveTo(0, 120, -90, 90);
      ctx.closePath();
    },
    BLUE,
    9,
  );
  ink(ell(0, -60, 110, 30), K, 0);
  ink(ell(0, -60, 98, 22), "#d9e2e3", 0);
  larvae(0, -60, 50 * (1 - lid), f12, 3);
  // tampa caindo de cima
  const ly = -60 - (1 - lid) * 150,
    lr = (1 - lid) * -0.5;
  ctx.save();
  ctx.translate(lid < 1 ? -40 * (1 - lid) : 0, ly);
  ctx.rotate(lr);
  ink(ell(0, 0, 118, 34), NAVY, 9);
  ink(ell(0, -12, 30, 12), BLUE, 6);
  ctx.restore();
  ctx.restore();
}

// calha com folhas
function gutter(x: number, y: number, s: number, clean: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ink(rect(-130, -70, 260, 40), BROWN, 8); // beiral do telhado
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-130, -30);
      ctx.lineTo(130, -30);
      ctx.lineTo(120, 30);
      ctx.lineTo(-120, 30);
      ctx.closePath();
    },
    GRAY,
    9,
  );
  ink(rect(80, 30, 34, 120), GRAY, 8); // cano
  const n = Math.round(6 * (1 - clean));
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.translate(-100 + i * 36, -32);
    ctx.rotate(-0.5 + h(i) * 1);
    ink(ell(0, 0, 22, 12), i % 2 ? GREEN : DIRT, 6);
    ctx.restore();
  }
  if (clean < 1) ink(ell(-10, -26, 90 * (1 - clean), 8), BLUE, 0);
  ctx.restore();
}

// larvas se mexendo na água
function larvae(x: number, y: number, r: number, f12: number, n: number) {
  if (r < 4) return;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + f12 * 0.4,
      lx = x + Math.cos(a) * r * 0.55,
      ly = y + Math.sin(a) * r * 0.25;
    const pts: number[][] = [];
    for (let k = 0; k <= 4; k++) pts.push([lx - 12 + k * 6, ly + (k % 2 ? 4 : -4) * (f12 % 2 ? 1 : -1)]);
    line(pts, K, 4);
  }
}

// tambor aberto com água guardada
function drum(x: number, y: number, s: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ink(rect(-110, -100, 220, 230), BLUE, 9);
  [-40, 50].forEach((yy) => line([[-110, yy], [110, yy]], K, 8));
  ink(ell(0, -100, 110, 32), K, 0);
  ink(ell(0, -100, 96, 24), "#d9e2e3", 0);
  larvae(0, -100, 60, f12, 4);
  ctx.restore();
}

function alarm(x: number, y: number, s: number, f12: number) {
  ctx.save();
  ctx.translate(x + (h(f12 * 7) - 0.5) * 16, y + (h(f12 * 9) - 0.5) * 10);
  ctx.rotate((f12 % 2 ? 1 : -1) * 0.06);
  ctx.scale(s, s);
  [-1, 1].forEach((d) => ink(circ(d * 110, -130, 52), YEL, 9));
  line([[-80, 150], [-110, 200]], K, 14);
  line([[80, 150], [110, 200]], K, 14);
  ink(circ(0, 0, 165), RED, 11);
  ink(circ(0, 0, 130), WHITE, 9);
  line([[0, 0], [0, -96]], K, 12);
  line([[0, 0], [62, 30]], K, 12);
  ink(circ(0, 0, 14), K, 0);
  ctx.restore();
}

// mapa do Brasil por regiões (esquema simplificado), coordenadas 0–100
const REG: { id: string; pts: number[][]; c: number[] }[] = [
  { id: "N", pts: [[5, 22], [18, 9], [38, 4], [55, 7], [63, 17], [60, 34], [50, 41], [30, 44], [12, 42], [3, 32]], c: [32, 24] },
  { id: "NE", pts: [[63, 17], [76, 19], [93, 29], [97, 40], [89, 52], [80, 60], [70, 55], [62, 45], [60, 34]], c: [78, 37] },
  { id: "CO", pts: [[30, 44], [50, 41], [60, 34], [62, 45], [64, 58], [58, 68], [46, 70], [36, 64], [32, 55]], c: [47, 55] },
  { id: "SE", pts: [[58, 68], [64, 58], [70, 55], [80, 60], [83, 68], [75, 76], [63, 81], [56, 76]], c: [69, 67] },
  { id: "S", pts: [[46, 70], [58, 68], [56, 76], [63, 81], [57, 90], [49, 97], [42, 89], [44, 78]], c: [51, 83] },
];
function brMap(x0: number, y0: number, size: number, fills: Record<string, string>, pops: Record<string, number>) {
  const P2 = (p: number[]) => [x0 + (p[0] / 100) * size, y0 + (p[1] / 100) * size];
  REG.forEach((r) => {
    const k = pops[r.id] ?? 1;
    const c = P2(r.c);
    ctx.save();
    ctx.translate(c[0], c[1]);
    const sc = 1 + 0.12 * Math.max(0, 1 - Math.abs(k - 0.6) * 2.5);
    ctx.scale(sc, sc);
    ctx.translate(-c[0], -c[1]);
    ink(
      () => {
        ctx.beginPath();
        r.pts.forEach((p, i) => {
          const q = P2(p);
          i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        });
        ctx.closePath();
      },
      k > 0 ? fills[r.id] : PAPER,
      8,
    );
    ctx.restore();
  });
}
function mapLabel(text: string, x: number, y: number, size: number, t: number, bg: string, fg = K) {
  tag(text, x, y, size, t, bg, -0.03, fg);
}

// ================= CENAS (desenham dentro do quadrinho principal) =================
type S = { t: number; fr: number; f12: number };
const CENAS: [number, (s: S) => void][] = [
  // 0 — 21 de novembro, Dia Nacional de Combate à Dengue
  [
    0,
    ({ t, f12 }) => {
      rays(YEL, RED, f12);
      calendar(CX - 70, CY - 10, 1.15, "NOV", "21", t - 2);
      mosquito(CX + 170, CY + 250, 0.7, f12, 3);
    },
  ],
  // 1 — caiu mais de 70% em 2026
  [
    T.caiu,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      const base = PY + 600;
      const g1 = P(t, 4, 18),
        g2 = P(t, 30, 44);
      ctx.fillStyle = K;
      ctx.fillRect(PX + 60, base, PW - 120, 10);
      ink(rect(CX - 230, base - 400 * g1, 170, 400 * g1), RED, g1 > 0 ? 9 : 0);
      ink(rect(CX + 60, base - 108 * g2, 170, 108 * g2), GREEN, g2 > 0 ? 9 : 0);
      tag("2025", CX - 145, base + 50, 46, t - 6, WHITE, -0.03);
      tag("2026", CX + 145, base + 50, 46, t - 32, YEL, 0.03);
      boom("-73%", CX + 145, PY + 230, 165, 100, t - 44, f12, { size: 96 });
    },
  ],
  // 2 — não pode relaxar neste verão
  [
    T.relaxar,
    ({ t, f12 }) => {
      rays(BLUE, NAVY, f12);
      face(CX - 30, CY + 110, 0.92, f12, "susto");
      mosquito(CX + 200, CY - 120, 0.75, f12, 5);
      boom("NÃO RELAXA!", CX, PY + 110, 290, 90, t - 74, f12, { size: 70 });
    },
  ],
  // 3 — a queda foi no 1º semestre, comparando com 2025
  [
    T.queda,
    ({ t, f12 }) => {
      halftone(PAPER, "yel", f12, 0.5);
      const M = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
      M.forEach((m, i) => {
        const row = Math.floor(i / 6),
          col = i % 6;
        const x = CX - 300 + col * 100 + 5,
          y = CY - 150 + row * 120;
        const on = row === 0 && t > 20 + col * 4;
        ink(rect(x, y, 90, 96), on ? GREEN : WHITE, 8);
        ctx.font = `900 32px ${IMPACT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = K;
        ctx.fillText(m, x + 45, y + 50);
      });
      tag("1º SEMESTRE", CX, PY + 90, 54, t - 26, YEL, -0.03);
    },
  ],
  // 4 — o Ministério da Saúde publicou um alerta
  [
    T.alerta,
    ({ t, f12 }) => {
      rays(RED, YEL, f12, 18);
      const k = pop(t, 6);
      if (k > 0) {
        ctx.save();
        ctx.translate(CX, CY + 200);
        ctx.rotate(0.04);
        ctx.scale(k, k);
        ctx.fillStyle = K;
        ctx.fillRect(-160, -200, 330, 400);
        ink(rect(-170, -210, 330, 400), WHITE, 9);
        ctx.font = `900 34px ${IMPACT}`;
        ctx.textAlign = "center";
        ctx.fillStyle = K;
        ctx.fillText("NOTA Nº 10/2026", -5, -150);
        for (let i = 0; i < 6; i++) line([[-130, -90 + i * 40], [110 - (i % 3) * 40, -90 + i * 40]], GRAY, 10);
        ctx.restore();
      }
      boom("ALERTA!", CX, PY + 140, 250, 110, t - 56, f12, { size: 96 });
    },
  ],
  // 5 — está chegando um El Niño de moderado a forte
  [
    T.chegando,
    ({ t, f12 }) => {
      halftone(NAVY, "blue", f12, 0.9);
      const rise = P(t, 0, 22);
      sunVillain(CX, CY + 340 - rise * 380, 1.05, f12);
      tag("EL NIÑO", CX, PY + 560, 70, t - 26, YEL, -0.04);
    },
  ],
  // 6 — aquecimento do Oceano Pacífico que bagunça a chuva e o calor
  [
    T.aquece,
    ({ t, f12 }) => {
      ctx.fillStyle = ICE;
      ctx.fillRect(PX, PY, PW, PH);
      sunSmall(CX + 210, PY + 150, 1.1, f12);
      if (t > 100) cloud(CX - 160, PY + 140, 0.85, f12, 1);
      waves(PY + 380, f12, BLUE, 16);
      ctx.save();
      ctx.globalAlpha = P(t, 20, 80);
      waves(PY + 380, f12, RED, 16);
      ctx.restore();
      waves(PY + 470, f12 + 3, ctx.globalAlpha ? NAVY : NAVY, 12);
      ctx.save();
      ctx.globalAlpha = P(t, 30, 90) * 0.85;
      waves(PY + 470, f12 + 3, BROWN, 12);
      ctx.restore();
      thermo(PX + 90, PY + 440, 1.0, 0.25 + 0.65 * P(t, 10, 90));
      tag("OCEANO PACÍFICO", CX + 40, PY + 620, 46, t - 70, WHITE, -0.03);
    },
  ],
  // 7 — isso ajuda o mosquito de dois jeitos
  [
    T.ajuda,
    ({ t, f12 }) => {
      rays(YEL, RED, f12);
      mosquito(CX + 20, CY - 10, 2.0, f12, 1);
      tag("2 JEITOS", CX, PY + 600, 64, t - 52, WHITE, -0.04);
    },
  ],
  // 8 — onde chove e esquenta mais, sobra água parada
  [
    T.chove,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12, 0.45);
      ctx.fillStyle = DIRT;
      ctx.fillRect(PX, PY + 470, PW, PH - 470);
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = PAT.shade;
      ctx.fillRect(PX, PY + 470, PW, PH - 470);
      ctx.restore();
      line([[PX, PY + 470], [PX + PW, PY + 470]], K, 9);
      cloud(CX - 90, PY + 130, 1.05, f12, 1);
      if (t > 22) sunSmall(CX + 220, PY + 120, 0.9, f12);
      const w = P(t, 30, 70);
      tire(CX - 150, PY + 560, 1.05, w, f12);
      vase(CX + 150, PY + 520, 0.95, w, f12);
      boom("SPLASH!", CX - 70, PY + 345, 165, 70, t - 54, f12, { size: 72 });
    },
  ],
  // 9 — onde fica seco, as pessoas guardam água em casa
  [
    T.seco,
    ({ t, f12 }) => {
      rays(YEL, "#f6b73c", f12, 16, CX, PY + 120);
      ctx.fillStyle = DIRT;
      ctx.fillRect(PX, PY + 500, PW, PH - 500);
      for (let i = 0; i < 8; i++) {
        const x = PX + 40 + i * 82;
        line([[x, PY + 520], [x + 20, PY + 570], [x - 6, PY + 620], [x + 14, PY + 680]], K, 6);
      }
      line([[PX, PY + 500], [PX + PW, PY + 500]], K, 9);
      sunSmall(CX + 210, PY + 130, 1.0, f12);
      drum(CX - 30, PY + 470, 1.15, f12);
      tag("SECA", CX - 190, PY + 110, 60, t - 12, WHITE, -0.05);
    },
  ],
  // 10 — nos dois casos, aparecem mais criadouros
  [
    T.nos,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      ink(ell(CX, PY + 520, 280, 110), "#d9e2e3", 10);
      for (let i = 0; i < 9; i++) larvae(CX - 200 + (i % 5) * 100, PY + 490 + Math.floor(i / 5) * 60, 30, f12 + i, 1);
      const n = Math.floor(P(t, 20, 90) * 7);
      for (let i = 0; i < n; i++)
        mosquito(PX + 110 + (i % 4) * 150 + (i > 3 ? 70 : 0), PY + 270 + Math.floor(i / 4) * 130 - P(t, 20 + i * 8, 60 + i * 8) * 60, 0.5, f12, i * 3);
      boom("CRIADOUROS!", CX, PY + 110, 290, 90, t - 58, f12, { size: 66 });
    },
  ],
  // 11 — 2015 e 2023: grandes epidemias
  [
    T.vezes,
    ({ t, f12 }) => {
      halftone(PAPER, "red", f12, 0.35);
      calendar(CX - 160, CY - 20, 0.85, "EL NIÑO", "2015", t - 82, 110);
      calendar(CX + 160, CY - 20, 0.85, "EL NIÑO", "2023", t - 116, 110);
      if (t > 176)
        for (let i = 0; i < 6; i++) mosquito(PX + 70 + i * 105, PY + 640 - (i % 2) * 60, 0.42, f12, i * 7);
      boom("EPIDEMIA!", CX, PY + 560, 270, 95, t - 180, f12, { size: 84 });
    },
  ],
  // 12 — a previsão: Sudeste o dobro, Sul +20% (e a dengue existe no Brasil inteiro)
  [
    T.previsao,
    ({ t, f12 }) => {
      halftone(PAPER, "yel", f12, 0.45);
      const k = (a: number) => P(t, a, a + 8);
      brMap(PX + 14, PY + 130, 400, { N: "#d9d2c3", NE: WHITE, CO: WHITE, SE: RED, S: "#d9d2c3" }, { N: k(150), NE: 1, CO: 1, SE: k(68), S: k(142) });
      mapLabel("SUDESTE ×2", CX + 190, PY + 240, 42, t - 72, RED, WHITE);
      mapLabel("SUL +20%", CX + 190, PY + 340, 42, t - 146, WHITE);
      mapLabel("NORTE +10%", CX + 190, PY + 440, 38, t - 156, WHITE);
      tag("DENGUE TEM NO BRASIL INTEIRO", CX, PY + 630, 36, t - 168, K, 0.02, WHITE);
    },
  ],
  // 13 — a hora de agir é agora, antes do pico
  [
    T.agir,
    ({ t, f12 }) => {
      rays(RED, YEL, f12);
      alarm(CX, CY + 50, 1.25, f12);
      boom("AGORA!", CX, PY + 120, 220, 95, t - 60, f12, { size: 96 });
    },
  ],
  // 14 — tampe, esvazie vasos e pneus, limpe as calhas
  [
    T.tampe,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12, 0.6);
      tank(CX - 160, CY - 140, 0.95, P(t, 8, 22), f12);
      vase(CX + 165, CY - 100, 0.72, 1 - P(t, 46, 60), f12);
      tire(CX - 160, CY + 180, 0.95, 1 - P(t, 78, 92), f12);
      gutter(CX + 165, CY + 150, 0.95, P(t, 100, 116));
      tag("TAMPE", CX - 160, CY + 0, 40, t - 4, YEL, -0.03);
      tag("ESVAZIE", CX + 165, CY + 0, 40, t - 42, YEL, 0.03);
      tag("ESVAZIE", CX - 160, CY + 300, 40, t - 72, YEL, -0.03);
      tag("LIMPE", CX + 165, CY + 300, 40, t - 96, YEL, 0.03);
    },
  ],
  // 15 — se a febre vier, procure atendimento logo no começo
  [
    T.febre,
    ({ t, f12 }) => {
      rays(BLUE, NAVY, f12, 20);
      face(CX - 70, CY + 80, 0.82, f12, "frio");
      thermo(CX + 230, CY + 40, 1.15, 0.9);
      tag("FEBRE?", CX - 170, PY + 80, 58, t - 6, YEL, -0.05);
    },
  ],
  // 16 — manda para quem mora no Sudeste
  [
    T.manda,
    ({ t, f12 }) => {
      rays(YEL, RED, f12);
      const u = P(t, 4, 40);
      ctx.save();
      ctx.translate(PX + 90 + u * 480, PY + 330 - Math.sin(u * Math.PI) * 140);
      ctx.rotate(-0.35 + u * 0.3);
      ctx.scale(1.5, 1.5);
      ink(
        () => {
          ctx.beginPath();
          ctx.moveTo(-70, -30);
          ctx.lineTo(80, 0);
          ctx.lineTo(-70, 40);
          ctx.lineTo(-40, 4);
          ctx.closePath();
        },
        WHITE,
        8,
      );
      line([[-40, 4], [80, 0]], K, 6);
      ctx.restore();
      boom("MANDA!", CX, PY + 130, 200, 90, t - 2, f12, { size: 84 });
    },
  ],
  // 17 — me siga (o logo entra por cima, em React)
  [
    T.siga,
    ({ f12 }) => {
      rays(BLUE, NAVY, f12, 20);
      const boil = Math.floor(f12 / 2) % 3;
      ctx.save();
      ctx.translate(CX, CY - 60);
      ctx.rotate(Math.sin((f12 / 72) * TAU * 3) * 0.03);
      ink(() => burstPath(300, 300, 19, 4, boil), YEL, 11);
      ctx.restore();
    },
  ],
  // 18 — tela final
  [
    T.final,
    ({ t, f12 }) => {
      halftone(PAPER, "yel", f12, 0.5);
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(-0.02);
      ctx.scale(pop(t), pop(t));
      ctx.fillStyle = K;
      ctx.fillRect(-282, -212, 580, 440);
      ink(rect(-290, -220, 580, 440), WHITE, 10);
      ctx.font = `900 60px ${IMPACT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ["CONSULTE UM", "PROFISSIONAL DE", "SAÚDE PARA", "ORIENTAÇÕES."].forEach((l, i) => {
        ctx.fillStyle = i === 1 || i === 2 ? RED : K;
        ctx.fillText(l, 0, -126 + i * 84);
      });
      ctx.restore();
    },
  ],
];
// ---------- legenda em caixa de quadrinho ----------
// números escritos por extenso na fala viram algarismos na legenda
const NUM: [string[], string][] = [
  [["vinte", "e", "um", "de", "novembro"], "21 de novembro"],
  [["dois", "mil", "e", "vinte", "e", "seis"], "2026"],
  [["dois", "mil", "e", "vinte", "e", "três"], "2023"],
  [["dois", "mil", "e", "quinze"], "2015"],
  [["setenta", "por", "cento"], "70%"],
  [["vinte", "por", "cento"], "20%"],
];
const CAP = (() => {
  const nw = (w: string) => w.toLowerCase().replace(/[.,:;!?]/g, "");
  const out: { w: string; f: number }[] = [];
  for (let i = 0; i < FALA.length; i++) {
    const m = NUM.find(([ws]) => ws.every((x, j) => FALA[i + j] && nw(FALA[i + j].w) === x));
    if (m) {
      const last = FALA[i + m[0].length - 1].w;
      out.push({ w: m[1] + (last.match(/[.,:;!?]$/)?.[0] ?? ""), f: FALA[i].f });
      i += m[0].length - 1;
    } else out.push(FALA[i]);
  }
  return out;
})();
const FRASES: { de: number; texto: string }[] = (() => {
  const out: { de: number; texto: string }[] = []; let cur: { w: string; f: number }[] = [];
  const push = (ws: { w: string; f: number }[]) => out.push({ de: ws[0].f, texto: ws.map((w) => w.w).join(" ") });
  CAP.forEach((w, i) => {
    cur.push(w);
    if (/[.?!]$/.test(w.w) || (/[,:]$/.test(w.w) && cur.length >= 4) || i === CAP.length - 1) {
      if (cur.length > 9) { const m = Math.ceil(cur.length / 2); push(cur.slice(0, m)); push(cur.slice(m)); } else push(cur);
      cur = [];
    }
  });
  return out;
})();
function wrap(text: string, maxW: number) {
  const lines: string[] = [];
  let cur = "";
  text.split(" ").forEach((w) => {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  });
  if (cur) lines.push(cur);
  return lines;
}
function caption(fr: number) {
  const y0 = PY + PH + 22,
    hh = 190;
  ctx.fillStyle = K;
  ctx.fillRect(PX + 8, y0 + 10, PW, hh);
  ink(rect(PX, y0, PW, hh), YEL, 10);
  if (fr >= T.final) { ctx.font = `900 64px ${IMPACT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = K; ctx.fillText("FIM", CX, y0 + hh / 2 + 4); return; }
  let f = FRASES[0];
  for (const x of FRASES) if (x.de <= fr + 2) f = x;
  const txt = f.texto.toUpperCase();
  let size = 44,
    lines: string[] = [];
  for (; size >= 30; size -= 2) {
    ctx.font = `bold ${size}px ${COMIC}`;
    lines = wrap(txt, PW - 56);
    if (lines.length <= 3) break;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = K;
  const lh = size * 1.22,
    top = y0 + hh / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, CX, top + i * lh + 2));
}

function render(fr: number) {
  init();
  const f12 = Math.floor((fr * 12) / 30);
  const q = (f12 * 30) / 12; // tempo "impresso" a 12 quadros por segundo
  rx = (h(f12 * 1.7 + 0.3) - 0.5) * 6;
  ry = (h(f12 * 2.9 + 0.8) - 0.5) * 6;
  ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.translate((h(f12 * 4.1) - 0.5) * 2, (h(f12 * 6.3) - 0.5) * 2);

  // quadrinho principal
  let idx = 0;
  for (let i = 0; i < CENAS.length; i++) if (CENAS[i][0] <= q) idx = i;
  const t = q - CENAS[idx][0];
  ctx.save();
  ctx.beginPath();
  ctx.rect(PX, PY, PW, PH);
  ctx.clip();
  const z = 1.06 - 0.06 * P(t, 0, 5) + 0.03 * P(t, 5, 150);
  ctx.translate(CX, CY);
  ctx.scale(z, z);
  ctx.translate(-CX, -CY);
  CENAS[idx][1]({ t, fr: q, f12 });
  ctx.restore();
  ctx.beginPath();
  ctx.rect(PX, PY, PW, PH);
  ctx.lineWidth = 12;
  ctx.strokeStyle = K;
  ctx.lineJoin = "miter";
  ctx.stroke();
  if (t < 3 && idx > 0) {
    ctx.fillStyle = "rgba(255,250,240,0.55)";
    ctx.fillRect(PX, PY, PW, PH);
  }

  caption(fr);

  ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
  if (grain) ctx.drawImage(grain, 0, 0);
}

// ---------- som ----------
const KIT = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [4, KIT + "pops/pop-medium-in.wav", 0.4],
  [100, KIT + "whooshes/whoosh-fast-medium.wav", 0.35],
  [T.caiu + 44, KIT + "impacts/impact-medium-firm.wav", 0.4],
  [T.relaxar + 74, KIT + "impacts/impact-light-hard.wav", 0.4],
  [T.queda + 26, KIT + "pops/pop-small-in.wav", 0.35],
  [T.alerta + 56, KIT + "impacts/impact-heavy-hard.wav", 0.4],
  [T.chegando, KIT + "whooshes/whoosh-slow-soft.wav", 0.4],
  [T.aquece + 104, KIT + "impacts/impact-medium-hard.wav", 0.35],
  [T.ajuda + 24, KIT + "swishes-and-zips/swish-soft.wav", 0.35],
  [T.chove + 54, KIT + "pops/pop-large-bubble.wav", 0.4],
  [T.seco + 12, KIT + "pops/pop-medium-out.wav", 0.35],
  [T.nos + 58, KIT + "impacts/impact-deep-firm.wav", 0.4],
  [T.vezes + 82, KIT + "pops/pop-medium-in.wav", 0.35],
  [T.vezes + 116, KIT + "pops/pop-medium-in.wav", 0.35],
  [T.vezes + 180, KIT + "impacts/impact-deep-hard.wav", 0.4],
  [T.previsao + 72, KIT + "impacts/impact-medium-firm.wav", 0.4],
  [T.previsao + 146, KIT + "pops/pop-small-in.wav", 0.35],
  [T.agir + 60, KIT + "impacts/impact-heavy-hard.wav", 0.4],
  [T.tampe + 20, KIT + "interface/click-latch-medium.wav", 0.5],
  [T.tampe + 46, KIT + "pops/pop-medium-out.wav", 0.35],
  [T.tampe + 78, KIT + "pops/pop-medium-out.wav", 0.35],
  [T.tampe + 100, KIT + "swishes-and-zips/swish-soft.wav", 0.35],
  [T.febre + 6, KIT + "pops/pop-medium-in.wav", 0.35],
  [T.manda, KIT + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.siga, KIT + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, KIT + "logo-stings/sting-bright-short.wav", 0.5],
];
const FALANDO = (() => {
  const v = new Float32Array(DURATION_DENGUE_ELNINO + 1);
  FALA.forEach((p, i) => {
    const fim = i + 1 < FALA.length && FALA[i + 1].f - p.f < 20 ? FALA[i + 1].f : p.f + 12;
    for (let fr = Math.max(0, p.f - 4); fr <= Math.min(DURATION_DENGUE_ELNINO, fim + 6); fr++) v[fr] = 1;
  });
  const s = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    s[fr] = acc;
  }
  return s;
})();
const musica = (fr: number) => 0.22 - 0.13 * (FALANDO[cl(Math.round(fr), 0, FALANDO.length - 1)] ?? 0);

export const VideoDengueElNino: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    ctx = c.getContext("2d")!;
    render(frame);
  }, [frame]);
  const f12 = Math.floor((frame * 12) / 30);
  const ts = frame - T.siga;
  const logoS = frame >= T.siga && frame < T.final ? pop(Math.floor((ts * 12) / 30) * 2.5, 8) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <canvas ref={ref} width={1080} height={1920} style={{ width: 1080, height: 1920 }} />
      {logoS > 0 && (
        <Img
          src={staticFile("dengueElNino/logo.jpg")}
          style={{
            position: "absolute",
            left: 540 - 250,
            top: (CY - 60) * 1.5 - 250,
            width: 500,
            height: 500,
            borderRadius: "50%",
            border: `14px solid ${K}`,
            boxSizing: "border-box",
            objectFit: "cover",
            transform: `scale(${logoS}) rotate(${(h(f12) - 0.5) * 3}deg)`,
            boxShadow: `14px 16px 0 ${K}`,
          }}
        />
      )}
      <Audio src={staticFile("dengueElNino/narracao.mp3")} />
      <Audio src={staticFile("dengueElNino/musica.wav")} volume={(fr) => musica(fr) * (1 - P(fr, DURATION_DENGUE_ELNINO - 50, DURATION_DENGUE_ELNINO))} />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={Math.max(0, fr)}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------- capa (1080×1920; tudo entre y≈300 e 1620, o recorte 3:4 das redes) ----------
function renderCapa() {
  init();
  const f12 = 3;
  rx = 3;
  ry = 2;
  ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(120,95,60,0.09)";
  for (let i = 0; i < 20; i += 2) {
    const a0 = 0.1 + (i / 20) * TAU,
      a1 = 0.1 + ((i + 1) / 20) * TAU;
    ctx.beginPath();
    ctx.moveTo(360, 700);
    ctx.lineTo(360 + Math.cos(a0) * 1600, 700 + Math.sin(a0) * 1600);
    ctx.lineTo(360 + Math.cos(a1) * 1600, 700 + Math.sin(a1) * 1600);
    ctx.closePath();
    ctx.fill();
  }
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = PAT.shade;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  sunVillain(500, 560, 0.62, f12);
  mosquito(300, 700, 1.45, f12, 2);
  boom("DENGUE", 360, 330, 270, 110, 99, f12, { size: 100, rot: -0.05 });
  tag("O EL NIÑO VEM AÍ", 360, 935, 58, 99, WHITE, -0.03);
  tag("21/11 · DIA NACIONAL CONTRA A DENGUE", 360, 1035, 32, 99, K, 0.02, WHITE);
  if (grain) ctx.drawImage(grain, 0, 0);
}
export const CapaDengueElNino: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    ctx = c.getContext("2d")!;
    renderCapa();
  }, []);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <canvas ref={ref} width={1080} height={1920} style={{ width: 1080, height: 1920 }} />
    </AbsoluteFill>
  );
};
