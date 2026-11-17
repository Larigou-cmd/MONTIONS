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

// Adrenalina, o hormônio do susto — estilo história em quadrinhos antiga.
// Tudo é desenhado num canvas 720×1280 (escala 1,5 → 1080×1920), a 12 quadros por segundo.

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

// frame (30 fps) do começo de cada cena, tirado da narração
const T = {
  rins: 73,
  freada: 125,
  cerebro: 230,
  supra: 377,
  despeja: 398,
  muda: 470,
  coracao: 549,
  pulmao: 628,
  abrem: 692,
  figado: 747,
  pupila: 844,
  dilata: 871,
  preco: 904,
  sangue: 961,
  palida: 1052,
  gelada: 1101,
  treme: 1136,
  curioso: 1169,
  remedio: 1228,
  anafi: 1304,
  primeira: 1382,
  abre: 1442,
  pressao: 1471,
  susto: 1510,
  minutos: 1542,
  passa: 1631,
  disparado: 1670,
  merece: 1818,
  manda: 1858,
  siga: 1921,
  final: 2052,
};
export const DURATION_ADRENALINA = T.final + 90;

const W = 720,
  H = 1280,
  TAU = Math.PI * 2;
const K = "#141210",
  PAPER = "#f4ead2",
  RED = "#e3202b",
  YEL = "#ffd21f",
  BLUE = "#2f8fe6",
  NAVY = "#1c4fb5",
  WHITE = "#fffaf0",
  PINK = "#f7a3a6",
  BROWN = "#a8322a",
  ICE = "#d7efff",
  GREEN = "#3bb54a";
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
  PY = 128,
  PW = 664,
  PH = 680; // quadrinho principal
const CX = 360,
  CY = PY + PH / 2;
function rays(
  c1: string,
  c2: string,
  f12: number,
  n = 16,
  cx = CX,
  cy = CY,
  speed = 1,
) {
  ctx.fillStyle = c1;
  ctx.fillRect(PX, PY, PW, PH);
  const rot = (f12 / 72) * (TAU / (n / 2)) * speed;
  ctx.fillStyle = c2;
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
function halftone(color: string, pat: string, f12: number, alpha = 0.85) {
  ctx.fillStyle = color;
  ctx.fillRect(PX, PY, PW, PH);
  ctx.save();
  const sh = (f12 % 36) * 0.5;
  ctx.translate(-sh, sh * 0.5);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = PAT[pat];
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

// ---------- desenhos ----------
function kidney(x: number, y: number, s: number, flip: boolean, glow: number, f12: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s);
  tube([[-30, 0], [-62, 30], [-66, 120]], WHITE, 10);
  const body = () => {
    ctx.beginPath(); ctx.moveTo(10, -78);
    ctx.bezierCurveTo(96, -90, 110, 66, 26, 84); ctx.bezierCurveTo(-30, 96, -64, 62, -44, 30);
    ctx.bezierCurveTo(-26, 8, -26, -10, -44, -30); ctx.bezierCurveTo(-64, -62, -40, -74, 10, -78); ctx.closePath();
  };
  ink(body, BROWN, 0);
  ctx.save(); body(); ctx.clip(); ctx.globalAlpha = 0.45; ctx.fillStyle = PAT.shade; ctx.fillRect(40, -100, 80, 200); ctx.restore();
  ink(body, null, 9);
  line([[60, -44], [72, -10]], WHITE, 9);
  const cap = () => { ctx.beginPath(); ctx.moveTo(-34, -66); ctx.lineTo(-6, -108); ctx.lineTo(52, -72); ctx.quadraticCurveTo(10, -58, -34, -66); ctx.closePath(); };
  if (glow > 0) {
    ctx.strokeStyle = YEL; ctx.lineWidth = 8; ctx.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI * 0.95 + (i / 5) * Math.PI * 0.9, r0 = 50 + (f12 % 2) * 8, r1 = r0 + 26 * glow;
      ctx.beginPath(); ctx.moveTo(6 + Math.cos(a) * r0, -84 + Math.sin(a) * r0); ctx.lineTo(6 + Math.cos(a) * r1, -84 + Math.sin(a) * r1); ctx.stroke();
    }
  }
  ink(cap, glow > 0 && f12 % 2 ? WHITE : YEL, 8);
  ctx.restore();
}
function brain(x: number, y: number, s: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const lobes = [
    [-70, 0, 62],
    [-20, -34, 66],
    [44, -30, 62],
    [84, 8, 54],
    [20, 22, 62],
    [-40, 30, 52],
  ];
  ink(rect(-4, 50, 34, 60), PINK, 8);
  lobes.forEach((l) => {
    ctx.beginPath();
    ctx.arc(l[0], l[1], l[2] + 5, 0, TAU);
    ctx.fillStyle = K;
    ctx.fill();
  });
  ctx.save();
  ctx.translate(rx, ry);
  lobes.forEach((l) => {
    ctx.beginPath();
    ctx.arc(l[0], l[1], l[2] - 4, 0, TAU);
    ctx.fillStyle = PINK;
    ctx.fill();
  });
  ctx.restore();
  [
    [
      [-96, -8],
      [-64, -30],
      [-40, -4],
      [-14, -30],
    ],
    [
      [0, -70],
      [22, -40],
      [52, -58],
      [70, -30],
    ],
    [
      [-60, 44],
      [-30, 24],
      [0, 46],
      [34, 22],
      [70, 40],
    ],
    [
      [40, -8],
      [70, 4],
      [104, -8],
    ],
  ].forEach((p) => line(p, K, 5));
  ctx.restore();
}
function heart(x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const p = () => {
    ctx.beginPath();
    ctx.moveTo(0, 90);
    ctx.bezierCurveTo(-170, -20, -100, -150, 0, -60);
    ctx.bezierCurveTo(100, -150, 170, -20, 0, 90);
    ctx.closePath();
  };
  ctx.save();
  ctx.translate(10, 12);
  p();
  ctx.fillStyle = K;
  ctx.fill();
  ctx.restore();
  ink(p, RED, 0);
  ctx.save();
  p();
  ctx.clip();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = PAT.shade;
  ctx.fillRect(20, -20, 160, 140);
  ctx.restore();
  ink(p, null, 11);
  line(
    [
      [-70, -62],
      [-88, -40],
    ],
    WHITE,
    12,
  );
  ctx.restore();
}
function lungs(x: number, y: number, s: number, open: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const lobe = () => {
    ctx.beginPath();
    ctx.moveTo(-26, -70);
    ctx.bezierCurveTo(-130, -110, -190, 60, -164, 138);
    ctx.bezierCurveTo(-110, 160, -44, 134, -26, 100);
    ctx.closePath();
  };
  [1, -1].forEach((m) => {
    ctx.save();
    ctx.scale(m, 1);
    ink(lobe, PINK, 0);
    ctx.save();
    lobe();
    ctx.clip();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = PAT.red;
    ctx.fillRect(-200, 40, 200, 140);
    ctx.restore();
    ink(lobe, null, 10);
    const w = 7 + open * 17;
    tube(
      [
        [-10, -92],
        [-70, -20],
        [-112, 70],
      ],
      WHITE,
      w,
    );
    tube(
      [
        [-70, -20],
        [-52, 70],
      ],
      WHITE,
      w * 0.8,
    );
    line(
      [
        [-10, -92],
        [-70, -20],
        [-112, 70],
      ],
      open > 0.5 ? ICE : WHITE,
      w,
    );
    ctx.restore();
  });
  ink(rect(-17, -190, 34, 104), WHITE, 9);
  [-166, -142, -118].forEach((yy) =>
    line(
      [
        [-17, yy],
        [17, yy],
      ],
      K,
      5,
    ),
  );
  ctx.restore();
}
function liver(x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const p = () => {
    ctx.beginPath();
    ctx.moveTo(-170, -40);
    ctx.bezierCurveTo(-130, -124, 90, -112, 170, -54);
    ctx.bezierCurveTo(192, -20, 136, 24, 68, 46);
    ctx.bezierCurveTo(0, 68, -90, 124, -146, 80);
    ctx.bezierCurveTo(-186, 44, -186, -10, -170, -40);
    ctx.closePath();
  };
  ctx.save();
  ctx.translate(10, 12);
  p();
  ctx.fillStyle = K;
  ctx.fill();
  ctx.restore();
  ink(p, BROWN, 0);
  ctx.save();
  p();
  ctx.clip();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = PAT.shade;
  ctx.fillRect(-200, 10, 400, 140);
  ctx.restore();
  ink(p, null, 11);
  line(
    [
      [-20, -90],
      [-8, -20],
      [-30, 40],
    ],
    K,
    6,
  );
  line(
    [
      [-120, -50],
      [-96, -70],
    ],
    WHITE,
    11,
  );
  ctx.restore();
}
function cube(x: number, y: number, s: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-22, -10);
      ctx.lineTo(0, -26);
      ctx.lineTo(26, -14);
      ctx.lineTo(26, 16);
      ctx.lineTo(2, 28);
      ctx.lineTo(-22, 16);
      ctx.closePath();
    },
    WHITE,
    6,
  );
  line(
    [
      [-22, -10],
      [2, 0],
      [26, -14],
    ],
    K,
    5,
  );
  line(
    [
      [2, 0],
      [2, 28],
    ],
    K,
    5,
  );
  ctx.restore();
}
function eye(x: number, y: number, s: number, pupil: number, f12: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const alm = () => {
    ctx.beginPath();
    ctx.moveTo(-260, 0);
    ctx.quadraticCurveTo(0, -230, 260, 0);
    ctx.quadraticCurveTo(0, 230, -260, 0);
    ctx.closePath();
  };
  ink(alm, WHITE, 0);
  ctx.save();
  alm();
  ctx.clip();
  ink(circ(0, 0, 122), BLUE, 9);
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 5;
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * TAU;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (pupil + 6), Math.sin(a) * (pupil + 6));
    ctx.lineTo(Math.cos(a) * 112, Math.sin(a) * 112);
    ctx.stroke();
  }
  ctx.fillStyle = K;
  ctx.beginPath();
  ctx.arc((h(f12) - 0.5) * 4, (h(f12 + 3) - 0.5) * 4, pupil, 0, TAU);
  ctx.fill();
  ctx.fillStyle = WHITE;
  ctx.beginPath();
  ctx.arc(-38, -44, 20, 0, TAU);
  ctx.fill();
  ctx.restore();
  ink(alm, null, 12);
  for (let i = 0; i < 7; i++) {
    const u = (i + 0.5) / 7,
      xx = -260 + u * 520,
      yy = -2 * 115 * u * (1 - u) * 2;
    line(
      [
        [xx, yy - 6],
        [xx + (u - 0.5) * 60, yy - 46],
      ],
      K,
      8,
    );
  }
  ctx.restore();
}
function arm(x: number, y: number, s: number, flex: number, redness: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  line(
    [
      [-230, 120],
      [30, 120],
      [30, -110],
    ],
    K,
    126,
  );
  line(
    [
      [-230, 120],
      [30, 120],
      [30, -110],
    ],
    PAPER,
    108,
  );
  const br = 50 + flex * 24;
  ink(ell(-96, 62 - flex * 14, 112, br), redness > 0.5 ? RED : PAPER, 9);
  if (redness > 0.5) {
    ctx.save();
    ell(-96, 62 - flex * 14, 112, br)();
    ctx.clip();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = PAT.shade;
    ctx.fillRect(-80, 60, 120, 120);
    ctx.restore();
  }
  ink(circ(30, -130, 70), PAPER, 9);
  [
    [-6, -176],
    [24, -186],
    [54, -176],
  ].forEach((p) =>
    line(
      [
        [p[0], p[1]],
        [p[0], p[1] + 34],
      ],
      K,
      6,
    ),
  );
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
function car(cx: number, cy: number, f12: number, braking: number) {
  ctx.save();
  ctx.translate(cx, cy + (f12 % 2 ? -3 : 0) * (1 - braking));
  ctx.rotate(-0.03 + braking * 0.09);
  if (braking < 0.2) {
    const fl = 60 + h2(1, f12 % 6) * 50;
    ink(
      () => {
        ctx.beginPath();
        ctx.moveTo(-108, -40);
        ctx.lineTo(-108 - fl * 0.5, -34);
        ctx.lineTo(-108 - fl * 0.35, -24);
        ctx.lineTo(-108 - fl, -18);
        ctx.lineTo(-108 - fl * 0.4, -10);
        ctx.lineTo(-108 - fl * 0.6, 0);
        ctx.lineTo(-108, -2);
        ctx.closePath();
      },
      YEL,
      6,
    );
  }
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-108, -40);
      ctx.lineTo(-140, -92);
      ctx.lineTo(-66, -56);
      ctx.closePath();
    },
    YEL,
    8,
  );
  ink(
    () => {
      ctx.beginPath();
      ctx.arc(-4, -56, 36, Math.PI, 0);
      ctx.closePath();
    },
    WHITE,
    8,
  );
  ink(circ(-2, -62, 15), PAPER, 5);
  ink(
    () => {
      ctx.beginPath();
      ctx.arc(-2, -62, 15, Math.PI * 0.95, Math.PI * 2.05);
      ctx.closePath();
    },
    RED,
    5,
  );
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-110, 0);
      ctx.lineTo(-110, -42);
      ctx.lineTo(-60, -58);
      ctx.lineTo(34, -58);
      ctx.lineTo(112, -24);
      ctx.lineTo(124, 0);
      ctx.closePath();
    },
    RED,
    9,
  );
  ink(
    () => {
      ctx.beginPath();
      ctx.moveTo(-104, -30);
      ctx.lineTo(84, -30);
      ctx.lineTo(100, -18);
      ctx.lineTo(-104, -18);
      ctx.closePath();
    },
    YEL,
    5,
  );
  const rot = braking > 0.5 ? 0.4 : (f12 * TAU * 7) / 72;
  [-64, 72].forEach((wx) => {
    ink(circ(wx, 4, 27), K, 0);
    ink(circ(wx, 4, 13), PAPER, 0);
    for (let s = 0; s < 3; s++) {
      const a = rot + (s * TAU) / 3;
      line(
        [
          [wx, 4],
          [wx + Math.cos(a) * 13, 4 + Math.sin(a) * 13],
        ],
        K,
        5,
      );
    }
  });
  ctx.restore();
}
const BUILD = (() => {
  let s = 42;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out: { x: number; w: number; h: number; c: number; lit: boolean[] }[] =
    [];
  let x = 0;
  while (x < W) {
    let w = Math.round(84 + r() * 56);
    if (W - (x + w) < 84) w = W - x;
    out.push({
      x,
      w,
      h: Math.round(150 + r() * 200),
      c: out.length,
      lit: Array.from({ length: 40 }, () => r() < 0.3),
    });
    x += w;
  }
  return out;
})();
function city(ground: number, scroll: number) {
  const cols = [RED, YEL, PAPER, BLUE];
  for (let o = -1; o <= 1; o++)
    BUILD.forEach((b) => {
      const x = b.x - (((scroll % W) + W) % W) + o * W;
      if (x > W + 10 || x + b.w < -10) return;
      const y = ground - b.h,
        col = cols[b.c % 4];
      ink(rect(x, y, b.w, b.h + 10), col, 0);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + b.w * 0.62, y, b.w * 0.38, b.h + 10);
      ctx.clip();
      ctx.fillStyle = PAT.shade;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(x, y, b.w, b.h + 10);
      ctx.restore();
      const nc = Math.max(1, Math.floor((b.w - 26) / 28)),
        nr = Math.max(1, Math.floor((b.h - 34) / 38)),
        gx = (b.w - nc * 28 + 12) / 2;
      let n = 0;
      for (let rr = 0; rr < nr; rr++)
        for (let c = 0; c < nc; c++) {
          const wx = x + gx + c * 28,
            wy = y + 22 + rr * 38;
          ctx.fillStyle = K;
          ctx.fillRect(wx, wy, 16, 22);
          if (b.lit[n++ % 40]) {
            ctx.fillStyle = col === YEL ? WHITE : YEL;
            ctx.fillRect(wx + 3 + rx, wy + 3 + ry, 10, 16);
          }
        }
      ink(rect(x, y, b.w, b.h + 10), null, 8);
    });
}

// ================= CENAS (desenham dentro do quadrinho principal) =================
type S = { t: number; fr: number; f12: number };
const CENAS: [number, (s: S) => void][] = [
  // 0 — botão de turbo
  [
    0,
    ({ t, f12 }) => {
      rays(YEL, RED, f12);
      const press = P(t, 39, 43) - P(t, 46, 52);
      ctx.save();
      ctx.translate(CX, CY + 110);
      ink(
        () => {
          ctx.beginPath();
          ctx.moveTo(-230, 60);
          ctx.lineTo(230, 60);
          ctx.lineTo(190, -40);
          ctx.lineTo(-190, -40);
          ctx.closePath();
        },
        K,
        0,
      );
      ink(rect(-230, 60, 460, 70), NAVY, 10);
      ink(
        () => {
          ctx.beginPath();
          ctx.moveTo(-230, 60);
          ctx.lineTo(230, 60);
          ctx.lineTo(190, -40);
          ctx.lineTo(-190, -40);
          ctx.closePath();
        },
        BLUE,
        10,
      );
      const hh = 150 - press * 70;
      ink(
        () => {
          ctx.beginPath();
          ctx.ellipse(0, 0, 150, 46, 0, 0, Math.PI);
          ctx.ellipse(0, -hh * 0.2, 150, hh, 0, Math.PI, TAU);
          ctx.closePath();
        },
        RED,
        11,
      );
      line(
        [
          [-92, -hh * 0.75],
          [-112, -hh * 0.5],
        ],
        WHITE,
        14,
      );
      ctx.restore();
      tag("TURBO", CX, CY + 215, 54, t - 28, YEL, 0);
      boom("CLIC!", CX, CY - 190, 250, 130, t - 41, f12);
    },
  ],
  // 1 — em cima dos rins
  [
    T.rins,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      const g = P(t, 12, 20);
      kidney(CX - 150, CY + 60, 1.7, false, g, f12);
      kidney(CX + 150, CY + 60, 1.7, true, g, f12);
      tag("SUPRARRENAIS", CX, CY - 250, 50, t - 14, YEL, -0.05);
      tag("RINS", CX, CY + 285, 44, t - 24, WHITE, 0.04);
    },
  ],
  // 2 — freada
  [
    T.freada,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      const brake = P(t, 18, 34);
      const ground = PY + PH - 150;
      city(ground, t < 34 ? t * 22 - brake * brake * 190 : 34 * 22 - 190);
      ctx.fillStyle = K;
      ctx.fillRect(0, ground, W, 200);
      ctx.fillStyle = YEL;
      for (let x = 20; x < W; x += 120) ctx.fillRect(x, ground + 78, 70, 12);
      const cx = -160 + P(t, 0, 34) * 560 - Math.pow(P(t, 0, 34), 2) * 60;
      if (brake > 0.1) {
        line(
          [
            [cx - 110 - brake * 220, ground + 36],
            [cx - 60, ground + 36],
          ],
          PAPER,
          9,
        );
        line(
          [
            [cx - 60 - brake * 220, ground + 52],
            [cx + 60, ground + 52],
          ],
          PAPER,
          9,
        );
      }
      car(cx, ground + 26, f12, brake);
      if (brake > 0.3)
        for (let i = 0; i < 3; i++) {
          const ph = (f12 / 12 + i / 3) % 1;
          ink(
            circ(cx + 110 + ph * 60, ground + 20 - ph * 50, 12 + ph * 26),
            PAPER,
            6,
          );
        }
      boom("SCREECH!", CX, PY + 190, 300, 140, t - 20, f12);
    },
  ],
  // 3 — cérebro → nervos → suprarrenais
  [
    T.cerebro,
    ({ t, f12 }) => {
      halftone(NAVY, "blue", f12, 0.9);
      const nerve = [
        [CX, PY + 250],
        [CX, PY + 380],
        [CX - 120, PY + 440],
        [CX - 120, PY + 470],
      ];
      const nerve2 = [
        [CX, PY + 380],
        [CX + 120, PY + 440],
        [CX + 120, PY + 470],
      ];
      tube(nerve, YEL, 12);
      tube(nerve2, YEL, 12);
      kidney(CX - 130, PY + 548, 1.05, false, P(t, 140, 150), f12);
      kidney(CX + 130, PY + 548, 1.05, true, P(t, 140, 150), f12);
      brain(CX - 10, PY + 150, 1.25, f12);
      // sinal descendo
      const u = P(t, 30, 140);
      if (u > 0 && u < 1) {
        const yy = PY + 250 + u * 220,
          xo = u > 0.6 ? ((u - 0.6) / 0.4) * 120 : 0;
        [-1, 1].forEach((m) => {
          if (xo === 0 && m === 1) return;
          ink(
            () => {
              ctx.beginPath();
              const x = CX + m * xo,
                y = Math.min(yy, PY + 470);
              ctx.moveTo(x - 6, y - 34);
              ctx.lineTo(x + 20, y - 6);
              ctx.lineTo(x + 2, y - 2);
              ctx.lineTo(x + 12, y + 30);
              ctx.lineTo(x - 22, y - 2);
              ctx.lineTo(x - 2, y - 6);
              ctx.closePath();
            },
            WHITE,
            6,
          );
        });
      }
      tag("CÉREBRO", CX + 190, PY + 60, 38, t - 4, WHITE, 0.05);
      tag("NERVOS", CX + 150, PY + 330, 38, t - 40, WHITE, -0.04);
      boom("ZAP!", CX - 180, PY + 330, 150, 90, t - 147, f12, { outer: YEL, inner: WHITE, size: 80 });
    },
  ],
  // 4 — despejam adrenalina no sangue
  [
    T.despeja,
    ({ t, f12 }) => {
      rays(YEL, WHITE, f12);
      ctx.fillStyle = K;
      ctx.fillRect(PX, PY + 440, PW, 250);
      ctx.fillStyle = RED;
      ctx.fillRect(PX, PY + 452, PW, 226);
      ctx.save();
      ctx.beginPath();
      ctx.rect(PX, PY + 452, PW, 226);
      ctx.clip();
      ctx.fillStyle = PAT.shade;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(PX, PY + 600, PW, 90);
      ctx.globalAlpha = 1;
      for (let i = 0; i < 7; i++) {
        const x = ((i * 130 + f12 * 26) % 900) - 80,
          y = PY + 500 + (i % 3) * 62;
        ink(ell(x, y, 40, 24), BROWN, 6);
        ink(ell(x, y, 16, 9), RED, 0);
      }
      ctx.restore();
      kidney(CX - 150, PY + 270, 1.5, false, 1, f12);
      kidney(CX + 150, PY + 270, 1.5, true, 1, f12);
      for (let i = 0; i < 6; i++) {
        const ph = (f12 / 10 + i / 6) % 1,
          x = CX + (i % 2 ? 150 : -150) + Math.sin(i * 3) * 40,
          y = PY + 130 + ph * 400;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ph * 6 + i);
        ink(
          () => {
            ctx.beginPath();
            for (let k = 0; k < 10; k++) {
              const a = (k / 10) * TAU,
                r = k % 2 ? 9 : 22;
              k
                ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
                : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.closePath();
          },
          YEL,
          5,
        );
        ctx.restore();
      }
      tag("ADRENALINA", CX, PY + 60, 50, t - 20, YEL, -0.03);
      tag("SANGUE", CX - 210, PY + 640, 40, t - 40, WHITE, -0.04);
    },
  ],
  // 5 — o corpo muda em instantes
  [
    T.muda,
    ({ t, f12 }) => {
      halftone(BLUE, "white2", f12);
      speedLines(f12);
      boom("TURBO!", CX, CY, 310, 200, t - 2, f12, { size: 150 });
    },
  ],
  // 6 — coração
  [
    T.coracao,
    ({ t, f12 }) => {
      rays(YEL, WHITE, f12, 20);
      const b = (f12 % 6) / 6,
        s =
          1 +
          0.16 * Math.exp(-b * 6) +
          0.1 * Math.exp(-Math.abs(b - 0.33) * 14);
      for (let i = 0; i < 3; i++) {
        const ph = (f12 / 6 + i / 3) % 1;
        ctx.beginPath();
        ctx.arc(CX, CY + 60, 190 + ph * 150, 0, TAU);
        ctx.strokeStyle = RED;
        ctx.lineWidth = 10 * (1 - ph);
        ctx.stroke();
      }
      heart(CX, CY + 80, 1.55 * s * pop(t));
      boom("TUM-TUM!", CX, PY + 130, 300, 110, t - 8, f12, { size: 96 });
    },
  ],
  // 7 — pulmão / brônquios
  [
    T.pulmao,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      const open = P(t, T.abrem - T.pulmao, T.abrem - T.pulmao + 10);
      lungs(CX, CY + 110, 1.6 + open * 0.12, open);
      for (let i = 0; i < 4; i++) {
        const ph = (f12 / 9 + i / 4) % 1,
          x = CX + (i - 1.5) * 70,
          y = PY + 20 + ph * 130;
        ink(
          () => {
            ctx.beginPath();
            ctx.moveTo(x - 16, y);
            ctx.lineTo(x + 16, y);
            ctx.lineTo(x + 16, y + 40);
            ctx.lineTo(x + 32, y + 40);
            ctx.lineTo(x, y + 76);
            ctx.lineTo(x - 32, y + 40);
            ctx.lineTo(x - 16, y + 40);
            ctx.closePath();
          },
          WHITE,
          6,
        );
      }
      tag("BRÔNQUIOS", CX - 190, PY + 300, 40, t - 16, YEL, -0.06);
      if (open > 0)
        boom(
          "FUUUU!",
          CX + 130,
          PY + 560,
          220,
          100,
          t - (T.abrem - T.pulmao),
          f12,
          { outer: WHITE, inner: ICE, fill: BLUE, size: 90, rot: 0.06 },
        );
    },
  ],
  // 8 — fígado solta açúcar
  [
    T.figado,
    ({ t, f12 }) => {
      rays(YEL, RED, f12);
      liver(CX - 30, CY - 40, 1.45);
      for (let i = 0; i < 6; i++) {
        const st = 14 + i * 9,
          u = P(t, st, st + 26);
        if (u <= 0) continue;
        const a = -0.5 + i * 0.36,
          r = u * 300;
        cube(
          CX + 60 + Math.cos(a) * r,
          CY + 60 + Math.sin(a) * r * 0.9 + u * u * 60,
          1.5,
          u * 3 + i,
        );
      }
      tag("FÍGADO", CX - 190, PY + 80, 44, t - 4, WHITE, -0.05);
      tag("AÇÚCAR = COMBUSTÍVEL", CX, PY + 610, 44, t - 40, YEL, 0.03);
      boom("PLOC!", CX + 180, PY + 130, 180, 90, t - 16, f12, {
        size: 80,
        rot: 0.08,
      });
    },
  ],
  // 9 — pupila dilata
  [
    T.pupila,
    ({ t, f12 }) => {
      rays(WHITE, YEL, f12);
      const d = P(t, T.dilata - T.pupila, T.dilata - T.pupila + 6);
      eye(CX, CY + 20, 1.15, 34 + d * 62, f12);
      tag("PUPILA", CX, PY + 90, 48, t - 2, YEL, -0.04);
    },
  ],
  // 10 — só que isso tem um preço
  [
    T.preco,
    ({ t, f12 }) => {
      ctx.fillStyle = K;
      ctx.fillRect(PX, PY, PW, PH);
      speedLines(f12, CX, CY, 330, RED, NAVY);
      ctx.save();
      ctx.translate(CX, CY);
      ctx.scale(pop(t), pop(t));
      ctx.rotate(-0.05);
      letters("SÓ QUE...", 560, 150, f12, YEL);
      ctx.restore();
    },
  ],
  // 11 — sangue vai para os músculos
  [
    T.sangue,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      const u = P(t, 20, 40);
      arm(CX + 60, CY + 60, 1.25, u, u);
      for (let i = 0; i < 3; i++) {
        const ph = (f12 / 8 + i / 3) % 1,
          x = PX + 30 + ph * 210,
          y = CY + 210;
        ink(
          () => {
            ctx.beginPath();
            ctx.moveTo(x, y - 30);
            ctx.lineTo(x + 40, y);
            ctx.lineTo(x, y + 30);
            ctx.lineTo(x + 12, y);
            ctx.closePath();
          },
          RED,
          6,
        );
      }
      tag("SANGUE", PX + 130, CY + 130, 42, t - 2, WHITE, -0.05);
      tag("MÚSCULO", CX + 40, PY + 70, 46, t - 22, YEL, 0.04);
    },
  ],
  // 12 — pálida, mão gelada, treme
  [
    T.palida,
    ({ t, f12 }) => {
      const pale = P(t, 18, 22);
      halftone(pale > 0.5 ? NAVY : BLUE, pale > 0.5 ? "blue" : "white", f12);
      face(CX, CY + 60, 1.15, f12, pale > 0.5 ? "frio" : "susto", pale);
      if (t > T.gelada - T.palida) {
        for (let i = 0; i < 5; i++) {
          const x = PX + 70 + i * 135,
            y = PY + 70 + (i % 2) * 60 + ((f12 * 6) % 40);
          ctx.save();
          ctx.translate(x, y);
          for (let k = 0; k < 3; k++) {
            ctx.rotate(Math.PI / 3);
            line(
              [
                [-20, 0],
                [20, 0],
              ],
              WHITE,
              7,
            );
          }
          ctx.restore();
        }
        tag(
          "MÃO GELADA",
          CX + 170,
          PY + 600,
          40,
          t - (T.gelada - T.palida),
          ICE,
          0.05,
        );
      }
      tag("PELE PÁLIDA", CX - 170, PY + 80, 40, t - 24, WHITE, -0.05);
      boom("BRRR!", CX, PY + 200, 230, 105, t - (T.treme - T.palida), f12, {
        outer: NAVY,
        inner: ICE,
        fill: BLUE,
        size: 96,
      });
    },
  ],
  // 13 — e o mais curioso vem agora
  [
    T.curioso,
    ({ t, f12 }) => {
      rays(RED, YEL, f12, 20, CX, CY, 2);
      boom("E TEM MAIS!", CX, CY, 320, 190, t - 2, f12, {
        outer: K,
        inner: WHITE,
        size: 96,
      });
    },
  ],
  // 14 — essa mesma adrenalina é remédio
  [
    T.remedio,
    ({ t, f12 }) => {
      halftone(BLUE, "white2", f12);
      const s = pop(t);
      ctx.save();
      ctx.translate(CX - 110, CY + 40);
      ctx.rotate(-0.12);
      ctx.scale(s * 1.5, s * 1.5);
      ctx.save();
      ctx.translate(8, 10);
      ctx.fillStyle = K;
      ctx.beginPath();
      ctx.rect(-50, -40, 100, 190);
      ctx.fill();
      ctx.restore();
      ink(
        () => {
          ctx.beginPath();
          ctx.moveTo(-50, 150);
          ctx.lineTo(-50, -40);
          ctx.quadraticCurveTo(-50, -80, -16, -92);
          ctx.lineTo(-16, -112);
          ctx.quadraticCurveTo(-30, -150, 0, -176);
          ctx.quadraticCurveTo(30, -150, 16, -112);
          ctx.lineTo(16, -92);
          ctx.quadraticCurveTo(50, -80, 50, -40);
          ctx.lineTo(50, 150);
          ctx.closePath();
        },
        WHITE,
        9,
      );
      ink(rect(-50, 30, 100, 120), YEL, 0);
      ink(rect(-50, -30, 100, 50), WHITE, 6);
      ctx.font = `900 17px ${IMPACT}`;
      ctx.fillStyle = K;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ADRENALINA", 0, -4);
      line(
        [
          [-34, -70],
          [-34, 130],
        ],
        WHITE,
        7,
      );
      ink(
        () => {
          ctx.beginPath();
          ctx.moveTo(-50, 150);
          ctx.lineTo(-50, -40);
          ctx.quadraticCurveTo(-50, -80, -16, -92);
          ctx.lineTo(-16, -112);
          ctx.quadraticCurveTo(-30, -150, 0, -176);
          ctx.quadraticCurveTo(30, -150, 16, -112);
          ctx.lineTo(16, -92);
          ctx.quadraticCurveTo(50, -80, 50, -40);
          ctx.lineTo(50, 150);
          ctx.closePath();
        },
        null,
        9,
      );
      ctx.restore();
      // seringa
      ctx.save();
      ctx.translate(CX + 150, CY + 90);
      ctx.rotate(0.6);
      ctx.scale(s * 1.3, s * 1.3);
      line(
        [
          [0, 120],
          [0, 190],
        ],
        K,
        6,
      );
      ink(rect(-26, -90, 52, 210), WHITE, 8);
      ink(rect(-26, 10, 52, 110), YEL, 0);
      ink(rect(-26, -90, 52, 210), null, 8);
      [-50, -10, 30, 70].forEach((y) =>
        line(
          [
            [-26, y],
            [-6, y],
          ],
          K,
          5,
        ),
      );
      ink(rect(-9, -170, 18, 84), PAPER, 7);
      ink(rect(-36, -186, 72, 20), RED, 7);
      ink(rect(-40, -98, 80, 16), RED, 7);
      ctx.restore();
      boom("PLIM!", CX + 110, PY + 120, 190, 95, t - 10, f12, {
        outer: YEL,
        inner: WHITE,
        size: 84,
        rot: 0.07,
      });
      tag("É REMÉDIO", CX - 150, PY + 610, 46, t - 44, YEL, -0.04);
    },
  ],
  // 15 — anafilaxia: primeira escolha na emergência
  [
    T.anafi,
    ({ t, f12 }) => {
      rays(RED, WHITE, f12, 16, CX, PY + 250, 3);
      ctx.save();
      ctx.translate(CX, PY + 250);
      ink(rect(-90, 60, 180, 46), K, 0);
      ink(
        () => {
          ctx.beginPath();
          ctx.arc(0, 60, 82, Math.PI, 0);
          ctx.closePath();
        },
        f12 % 2 ? RED : YEL,
        10,
      );
      line(
        [
          [-44, 10],
          [-30, -14],
        ],
        WHITE,
        10,
      );
      ctx.restore();
      tag("ANAFILAXIA", CX, PY + 70, 60, t - 36, K, -0.03, YEL);
      tag("= ALERGIA GRAVE", CX, PY + 395, 44, t - 44, WHITE, 0.03);
      const tt = t - (T.primeira - T.anafi);
      boom("1ª ESCOLHA", CX, PY + 565, 300, 100, tt, f12, { size: 80 });
    },
  ],
  // 16 — abre o pulmão e segura a pressão
  [
    T.abre,
    ({ t, f12 }) => {
      halftone(BLUE, "white", f12);
      lungs(CX - 150, PY + 330, 0.95, 1);
      tag("ABRE O PULMÃO", CX - 150, PY + 90, 34, t - 2, YEL, -0.04);
      const u = P(t, T.pressao - T.abre, T.pressao - T.abre + 14);
      ctx.save();
      ctx.translate(CX + 170, PY + 500);
      ink(
        () => {
          ctx.beginPath();
          ctx.arc(0, 0, 140, Math.PI, 0);
          ctx.closePath();
        },
        WHITE,
        10,
      );
      [
        [RED, Math.PI, Math.PI * 1.3],
        [GREEN, Math.PI * 1.3, Math.PI * 1.7],
        [RED, Math.PI * 1.7, TAU],
      ].forEach((z) => {
        ctx.beginPath();
        ctx.arc(0, 0, 118, z[1] as number, z[2] as number);
        ctx.strokeStyle = z[0] as string;
        ctx.lineWidth = 26;
        ctx.lineCap = "butt";
        ctx.stroke();
      });
      const a = Math.PI * (1.12 + u * 0.38) + (h(f12) - 0.5) * 0.04;
      line(
        [
          [0, 0],
          [Math.cos(a) * 110, Math.sin(a) * 110],
        ],
        K,
        10,
      );
      ink(circ(0, 0, 16), K, 0);
      ctx.restore();
      tag(
        "SEGURA A PRESSÃO",
        CX + 150,
        PY + 590,
        34,
        t - (T.pressao - T.abre),
        YEL,
        0.04,
      );
    },
  ],
  // 17 — e o susto? em poucos minutos passa
  [
    T.susto,
    ({ t, f12 }) => {
      const calm = t > T.passa - T.susto;
      halftone(calm ? YEL : BLUE, "white", f12);
      if (!calm) {
        ctx.save();
        ctx.translate(CX, CY + 30);
        ctx.scale(pop(t), pop(t));
        ctx.save();
        ctx.translate(10, 12);
        ctx.fillStyle = K;
        ctx.beginPath();
        ctx.arc(0, 0, 220, 0, TAU);
        ctx.fill();
        ctx.restore();
        ink(circ(0, 0, 220), WHITE, 14);
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * TAU;
          line(
            [
              [Math.cos(a) * 180, Math.sin(a) * 180],
              [Math.cos(a) * 200, Math.sin(a) * 200],
            ],
            K,
            i % 3 ? 6 : 12,
          );
        }
        const m = (f12 / 12) * TAU * 0.9 - Math.PI / 2;
        line(
          [
            [0, 0],
            [Math.cos(m) * 160, Math.sin(m) * 160],
          ],
          RED,
          12,
        );
        line(
          [
            [0, 0],
            [Math.cos(m / 12 - 1) * 100, Math.sin(m / 12 - 1) * 100],
          ],
          K,
          16,
        );
        ink(circ(0, 0, 18), K, 0);
        ctx.restore();
        tag(
          "POUCOS MINUTOS",
          CX,
          PY + 70,
          48,
          t - (T.minutos - T.susto),
          YEL,
          -0.04,
        );
      } else {
        const tt = t - (T.passa - T.susto);
        face(CX, CY + 80, 1.1 * pop(tt), f12, "alivio");
        boom("UFA...", CX + 120, PY + 130, 200, 95, tt - 6, f12, {
          outer: WHITE,
          inner: ICE,
          fill: BLUE,
          size: 84,
          rot: 0.06,
        });
      }
    },
  ],
  // 18 — coração disparado sem motivo → merece consulta
  [
    T.disparado,
    ({ t, f12 }) => {
      rays(WHITE, YEL, f12, 20);
      const b = (f12 % 4) / 4,
        s = 1 + 0.14 * Math.exp(-b * 5);
      heart(CX, CY + 30, 1.2 * s);
      ctx.save();
      ctx.translate(CX + 4, CY + 10);
      ctx.scale(s, s);
      letters("?", 200, 170, f12, WHITE, 0.4);
      ctx.restore();
      tag("SEM MOTIVO?", CX - 160, PY + 80, 44, t - 54, WHITE, -0.05);
      tag("SE REPETE?", CX + 170, PY + 150, 44, t - 86, WHITE, 0.05);
      boom(
        "CONSULTA!",
        CX,
        PY + 570,
        300,
        110,
        t - (T.merece - T.disparado) - 8,
        f12,
        { size: 86 },
      );
    },
  ],
  // 19 — manda para quem leva susto com tudo
  [
    T.manda,
    ({ t, f12 }) => {
      rays(YEL, RED, f12);
      face(CX - 40, CY + 110, 1.0, f12, "susto");
      drops(CX - 40, CY + 110, f12);
      const u = P(t, 6, 40);
      ctx.save();
      ctx.translate(PX + 80 + u * 520, PY + 250 - Math.sin(u * Math.PI) * 130);
      ctx.rotate(-0.35 + u * 0.3);
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
      line(
        [
          [-40, 4],
          [80, 0],
        ],
        K,
        6,
      );
      ctx.restore();
      boom("BU!", CX + 190, PY + 120, 150, 90, t - 2, f12, {
        size: 90,
        rot: 0.08,
      });
    },
  ],
  // 20 — me siga (o logo entra por cima, em React)
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
  // 21 — tela final
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
      ["CONSULTE UM", "PROFISSIONAL DE", "SAÚDE PARA", "ORIENTAÇÕES."].forEach(
        (l, i) => {
          ctx.fillStyle = i === 1 || i === 2 ? RED : K;
          ctx.fillText(l, 0, -126 + i * 84);
        },
      );
      ctx.restore();
    },
  ],
];

// ---------- legenda em caixa de quadrinho ----------
const FRASES: { de: number; texto: string }[] = (() => {
  const out: { de: number; texto: string }[] = []; let cur: { w: string; f: number }[] = [];
  const push = (ws: { w: string; f: number }[]) => out.push({ de: ws[0].f, texto: ws.map((w) => w.w).join(" ") });
  FALA.forEach((w, i) => {
    cur.push(w);
    if (/[.?!]$/.test(w.w) || (/[,:]$/.test(w.w) && cur.length >= 4) || i === FALA.length - 1) {
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
  const y0 = 826,
    hh = 190;
  ctx.fillStyle = K;
  ctx.fillRect(PX + 8, y0 + 10, PW, hh);
  ink(rect(PX, y0, PW, hh), YEL, 10);
  if (fr >= T.final) { ctx.font = `900 64px ${IMPACT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = K; ctx.fillText("FARMA.EXE", CX, y0 + hh / 2 + 4); return; }
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

  // cabeçalho de gibi
  ctx.fillStyle = K;
  ctx.fillRect(PX + 6, 36, PW, 76);
  ink(rect(PX, 28, PW, 76), RED, 10);
  ink(rect(PX + 12, 40, 190, 52), YEL, 6);
  ctx.font = `900 34px ${IMPACT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = K;
  ctx.fillText("FARMA.EXE", PX + 107, 68);
  ctx.fillStyle = WHITE;
  ctx.font = `900 38px ${IMPACT}`;
  ctx.fillText("O HORMÔNIO DO SUSTO", PX + 440, 68);

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

  // tira de baixo: o mascote espiando
  ctx.save();
  ctx.beginPath();
  ctx.rect(PX, 1040, PW, 212);
  ctx.clip();
  ctx.fillStyle = BLUE;
  ctx.fillRect(PX, 1040, PW, 212);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = PAT.white;
  ctx.fillRect(PX, 1040, PW, 212);
  ctx.globalAlpha = 1;
  const calm = q >= T.passa && q < T.disparado;
  face(
    CX,
    1290,
    0.95,
    f12,
    calm ? "alivio" : q >= T.palida + 20 && q < T.curioso ? "frio" : "susto",
    q >= T.palida + 20 && q < T.curioso ? 1 : 0,
  );
  ctx.restore();
  ctx.beginPath();
  ctx.rect(PX, 1040, PW, 212);
  ctx.lineWidth = 12;
  ctx.strokeStyle = K;
  ctx.stroke();

  ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
  if (grain) ctx.drawImage(grain, 0, 0);
}

// ---------- som ----------
const KIT = "sfxkit/sfx-kit-main/sounds/";
const SFX: [number, string, number][] = [
  [41, KIT + "interface/click-latch-medium.wav", 0.6],
  [T.rins, KIT + "pops/pop-medium-in.wav", 0.4],
  [T.freada + 16, KIT + "whooshes/whoosh-fast-hard.wav", 0.4],
  [T.supra, KIT + "impacts/impact-light-hard.wav", 0.4],
  [T.despeja, KIT + "pops/pop-large-bubble.wav", 0.35],
  [T.muda, KIT + "impacts/impact-heavy-hard.wav", 0.4],
  [T.coracao + 8, KIT + "impacts/impact-deep-firm.wav", 0.4],
  [T.abrem, KIT + "whooshes/whoosh-medium-soft.wav", 0.4],
  [T.figado + 16, KIT + "pops/pop-medium-out.wav", 0.4],
  [T.dilata, KIT + "pops/pop-small-in.wav", 0.4],
  [T.preco, KIT + "impacts/impact-deep-hard.wav", 0.4],
  [T.treme, KIT + "swishes-and-zips/swish-soft.wav", 0.35],
  [T.curioso, KIT + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.remedio + 10, KIT + "pops/pop-large-in.wav", 0.4],
  [T.primeira, KIT + "impacts/impact-medium-hard.wav", 0.4],
  [T.passa, KIT + "whooshes/whoosh-slow-soft.wav", 0.35],
  [T.merece + 8, KIT + "impacts/impact-medium-firm.wav", 0.4],
  [T.manda, KIT + "pops/pop-medium-in.wav", 0.4],
  [T.siga, KIT + "whooshes/whoosh-fast-medium.wav", 0.4],
  [T.final - 4, KIT + "logo-stings/sting-bright-short.wav", 0.5],
];
const FALANDO = (() => {
  const v = new Float32Array(DURATION_ADRENALINA + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (
      let fr = Math.max(0, p.f - 4);
      fr <= Math.min(DURATION_ADRENALINA, fim + 6);
      fr++
    )
      v[fr] = 1;
  });
  const s = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    s[fr] = acc;
  }
  return s;
})();
const musica = (fr: number) =>
  0.22 - 0.13 * (FALANDO[cl(Math.round(fr), 0, FALANDO.length - 1)] ?? 0);

export const VideoAdrenalina: React.FC = () => {
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
  const logoS =
    frame >= T.siga && frame < T.final
      ? pop(Math.floor((ts * 12) / 30) * 2.5, 8)
      : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <canvas
        ref={ref}
        width={1080}
        height={1920}
        style={{ width: 1080, height: 1920 }}
      />
      {logoS > 0 && (
        <Img
          src={staticFile("adrenalina/logo.jpg")}
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
      <Audio src={staticFile("adrenalina/narracao.mp3")} />
      <Audio
        src={staticFile("adrenalina/musica.wav")}
        volume={(fr) =>
          musica(fr) *
          (1 - P(fr, DURATION_ADRENALINA - 50, DURATION_ADRENALINA))
        }
      />
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
  rx = 3; ry = 2;
  ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
  ctx.fillStyle = YEL; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = RED;
  for (let i = 0; i < 20; i += 2) {
    const a0 = 0.1 + (i / 20) * TAU, a1 = 0.1 + ((i + 1) / 20) * TAU;
    ctx.beginPath(); ctx.moveTo(360, 700);
    ctx.lineTo(360 + Math.cos(a0) * 1600, 700 + Math.sin(a0) * 1600);
    ctx.lineTo(360 + Math.cos(a1) * 1600, 700 + Math.sin(a1) * 1600);
    ctx.closePath(); ctx.fill();
  }
  ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = PAT.shade; ctx.fillRect(0, 900, W, 400); ctx.restore();
  face(360, 730, 0.92, f12, "susto");
  drops(360, 730, f12, WHITE, 235);
  boom("ADRENALINA", 360, 345, 296, 128, 99, f12, { size: 104, rot: -0.05 });
  tag("O BOTÃO DE TURBO", 360, 948, 60, 99, WHITE, -0.03);
  tag("DO SEU CORPO", 360, 1050, 60, 99, K, 0.02, YEL);
  if (grain) ctx.drawImage(grain, 0, 0);
}
export const CapaAdrenalina: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current; if (!c) return;
    ctx = c.getContext("2d")!;
    renderCapa();
  }, []);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <canvas ref={ref} width={1080} height={1920} style={{ width: 1080, height: 1920 }} />
    </AbsoluteFill>
  );
};
