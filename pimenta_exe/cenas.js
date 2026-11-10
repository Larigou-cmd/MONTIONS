// ---------- tempos: procurados na transcrição (palavra, ocorrência) ----------
const norm = w => w.toLowerCase().replace(/[.,!?:;"]/g, '');
function T(word, n = 1) {
  let c = 0;
  for (const w of WORDS) if (norm(w.w) === word && ++c === n) return w.s;
  console.warn('tempo não achado', word, n); return 1e9;
}
const S = {
  agua: T('água'), espalhou: T('espalhou'), fogo: T('fogo'),
  c2: T('pimenta', 2) - 0.25, queima: T('queima'), caps: T('capsaicina'), encaixa: T('encaixa'), sensor: T('sensor'),
  c3: T('esse') - 0.15, avisar: T('avisar'), quarenta: T('quarenta'), graus: T('graus'), liga: T('liga'), sem: T('sem'), alarme: T('alarme'), cerebro: T('cérebro', 2), fogo2: T('fogo', 2),
  c4: T('resolve') - 1.0, porque: T('porque'), gordura: T('gordura'), naoagua: T('água', 4), leva: T('leva'), resto: T('resto'),
  c5: T('ajuda') - 0.35, leite: T('leite'), gord2: T('gordura', 2), caseina: T('caseína'), gruda: T('gruda'), embora: T('embora'),
  c6: T('curioso') - 0.6, remedio: T('remédio'), dor: T('dor'), dose: T('dose'), cansa: T('cansa'), sinal: T('sinal'),
  c7: T('manda') - 0.15, amigo: T('amigo'), aguenta: T('aguenta'),
  siga: NARR + 0.25, consulte: NARR + 3.6,
};
const CENAS = [0, S.c2, S.c3, S.c4, S.c5, S.c6, S.c7, S.siga, S.consulte - 0.05];
const vis = (t, a, b, fi = 0.25, fo = 0.25) => Math.min(cl((t - a) / fi), cl((b - t) / fo));

// ---------- peças em pixel art ----------
// pimenta dedo-de-moça: corpo vermelho curvo e cabinho verde
function pimenta(x, y, s, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.shadowColor = R; g.shadowBlur = 26;
  const corpo = [[-30, -96, 60, 36], [-42, -66, 78, 42], [-42, -30, 72, 42], [-30, 6, 66, 42], [-12, 42, 54, 36], [12, 72, 42, 30], [36, 96, 24, 24]];
  corpo.forEach(([a, b, w, h]) => px(a, b, w, h, '#ff3b4f'));
  g.shadowBlur = 0;
  px(-30, -84, 18, 60, 'rgba(255,255,255,0.35)');
  px(-18, -120, 36, 30, '#3ecf5a'); px(0, -150, 18, 36, '#3ecf5a'); px(12, -162, 24, 18, '#3ecf5a');
  g.restore();
}
// chama que treme
function chama(x, y, s, t, i = 0) {
  const f = 1 + 0.14 * Math.sin(t * 13 + i * 2.1), w = 1 + 0.08 * Math.sin(t * 9 + i);
  g.save(); g.translate(x, y); g.scale(s * w, s * f);
  g.shadowColor = '#ff7a1a'; g.shadowBlur = 22;
  px(-36, -30, 72, 30, '#ff5a1f'); px(-30, -60, 60, 36, '#ff5a1f'); px(-18, -90, 36, 36, '#ff5a1f'); px(-6, -114, 18, 30, '#ff5a1f');
  g.shadowBlur = 0;
  px(-18, -24, 36, 24, A); px(-12, -48, 24, 30, A); px(-6, -66, 12, 24, '#fff3c4');
  g.restore();
}
function copo(x, y, s, cor = CY) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = cor; g.shadowBlur = 18;
  px(-54, -90, 108, 12, WH); px(-54, -90, 12, 180, WH); px(42, -90, 12, 180, WH); px(-54, 78, 108, 12, WH);
  g.shadowBlur = 0; px(-42, -48, 84, 126, rgba(cor, 0.75)); px(-30, -36, 12, 60, 'rgba(255,255,255,0.45)');
  g.restore();
}
function caixaLeite(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = WH; g.shadowBlur = 22;
  px(-66, -66, 132, 174, '#f4fbff'); px(-48, -102, 96, 42, '#f4fbff'); px(-30, -126, 60, 30, '#dfeef5');
  g.shadowBlur = 0; px(-66, 6, 132, 48, CY);
  text('LEITE', 0, 44, 34, { font: SILK, color: BG, bold: true, align: 'center' });
  g.restore();
}
// bolinha de capsaicina
function cap(x, y, r = 16, a = 1) {
  if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.shadowColor = R; g.shadowBlur = 14;
  px(x - r, y - r * 0.6, r * 2, r * 1.2, '#ff3b4f'); px(x - r * 0.6, y - r, r * 1.2, r * 2, '#ff3b4f');
  g.restore();
}
function chip(s, x, y, t, at, cor, size = 36) {
  if (t < at) return;
  const u = back(k(t, at, 0.3));
  g.save(); g.translate(x, y); g.scale(u, u);
  g.font = `700 ${size}px ${SILK}`; const w = g.measureText(s).width + 50;
  box(-w / 2, -size * 0.95, w, size * 1.9, cor, { lit: 0.5, lw: 3 });
  text(s, 0, size * 0.36, size, { font: SILK, color: cor, bold: true, align: 'center' });
  g.restore();
}
// linha de comando no alto de cada cena
function comando(t, at, s, cor = G) {
  typed('C:\\> ' + s, t, at + 0.05, 80, 280, 54, { color: cor, glow: 10, cps: 26 });
}
// barra de "ardor" (0 a 1)
function ardor(x, y, w, v, rotulo = 'ARDOR') {
  box(x, y, w, 96, R, { lit: 0.3 * v, lw: 3 });
  px(x + 18, y + 54, (w - 36) * cl(v), 24, v > 0.5 ? R : v > 0.25 ? A : G);
  text(rotulo, x + 22, y + 40, 30, { font: SILK, color: WH, bold: true });
  text(Math.round(cl(v) * 100) + '%', x + w - 22, y + 40, 34, { color: WH, align: 'right' });
}

// ---------- cenas ----------
// 1) gancho: pimenta + água = o fogo se espalha
function cena1(t) {
  const a = vis(t, -1, S.c2 + 0.05);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  typed('COMEU PIMENTA', t, 0.1, 540, 300, 88, { font: SILK, color: R, glow: 22, bold: true, align: 'center', cps: 22 });
  typed('E BEBEU ÁGUA?', t, 1.0, 540, 410, 88, { font: SILK, color: CY, glow: 22, bold: true, align: 'center', cps: 22 });
  const p1 = back(k(t, 0.2, 0.5));
  if (p1 > 0) pimenta(330, 720 + Math.sin(t * 2) * 8, p1 * 1.5, -0.25);
  const p2 = back(k(t, S.agua - 0.35, 0.45));
  if (p2 > 0) { text('+', 540, 750, 110, { font: SILK, color: WH, bold: true, align: 'center', glow: 14, alpha: cl(p2) }); copo(760, 720 + Math.cos(t * 2) * 8, p2 * 1.5); }
  // a "boca": o fogo começa num ponto e se espalha
  if (t >= S.espalhou - 0.5) {
    const u = eo(k(t, S.espalhou - 0.3, 1.5));
    box(70, 960, 940, 300, R, { lit: 0.4 + 0.4 * u, alpha: cl((t - S.espalhou + 0.5) / 0.3) });
    text('BOCA.SYS', 100, 1010, 30, { font: SILK, color: rgba(WH, 0.8), bold: true });
    const n = 1 + Math.floor(u * 8);
    for (let i = 0; i < n; i++) {
      const pos = [540, 420, 660, 300, 780, 200, 880, 140, 940][i];
      chama(pos, 1215, 0.9 + 0.35 * rnd(i), t, i);
    }
  }
  stamp('SÓ ESPALHOU', t, S.fogo - 0.15, 540, 1335, R, { rot: -5, size: 60 });
  g.restore();
}

// 2) capsaicina: a chave que encaixa no sensor
function cena2(t) {
  const a = vis(t, S.c2, S.c3);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  comando(t, S.c2, 'scan pimenta.exe');
  stamp('NÃO QUEIMA DE VERDADE', t, S.queima + 0.3, 540, 420, G, { rot: -4, size: 46 });
  slide(t, S.caps - 0.5, -1, () => {
    box(70, 530, 940, 230, R, { lit: t < S.encaixa ? 0.8 : 0.25 });
    text('SUBSTÂNCIA DETECTADA', 540, 600, 36, { font: SILK, color: R, bold: true, align: 'center' });
    typed('CAPSAICINA', t, S.caps - 0.1, 540, 710, 96, { font: SILK, color: WH, glow: 16, bold: true, align: 'center', cps: 18 });
  });
  // sensor (fechadura) e a capsaicina (chave) entrando
  if (t >= S.encaixa - 0.6) {
    const al = cl((t - S.encaixa + 0.6) / 0.3), u = eo(k(t, S.encaixa - 0.2, 0.9));
    g.save(); g.globalAlpha *= al;
    const lit = u >= 1 ? 0.6 + 0.4 * Math.sin(t * 8) : 0.2;
    box(560, 860, 380, 400, u >= 1 ? A : CY, { lit });
    px(560, 1010, 150, 100, BG);                       // o encaixe
    g.strokeStyle = u >= 1 ? A : CY; g.lineWidth = 4; g.strokeRect(558, 1008, 152, 104);
    text('SENSOR', 760, 930, 40, { font: SILK, color: u >= 1 ? A : CY, bold: true, align: 'center' });
    text('da língua', 760, 1210, 44, { color: WH, align: 'center' });
    const kx = lerp(170, 578, u);
    g.shadowColor = R; g.shadowBlur = 20; px(kx, 1024, 126, 72, '#ff3b4f'); px(kx - 60, 1042, 66, 36, '#ff3b4f'); px(kx - 96, 1018, 42, 84, '#ff3b4f'); g.shadowBlur = 0;
    text('capsaicina', lerp(190, 300, u), 1180, 48, { color: R, align: 'center', alpha: 1 - u * 0.2 });
    g.restore();
    if (u >= 1) stamp('ENCAIXOU', t, S.encaixa + 0.75, 300, 950, A, { rot: -8, size: 50 });
  }
  g.restore();
}

// 3) o sensor é um alarme de calor (43 °C); a capsaicina dispara sem calor: alarme falso
function cena3(t) {
  const a = vis(t, S.c3, S.c4);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  comando(t, S.c3, 'sensor --info');
  slide(t, S.c3 + 0.3, -1, () => {
    box(70, 340, 940, 130, CY, { lit: 0.4 });
    text('SENSOR TRPV1 = ALARME DE CALOR', 540, 422, 34, { font: SILK, color: CY, bold: true, align: 'center' });
  });
  // termômetro
  const u = eo(k(t, S.avisar, S.graus - S.avisar + 0.2));
  const falso = t >= S.sem - 0.2;
  box(110, 520, 190, 620, falso ? G : R, { lit: 0.3 });
  px(170, 560, 72, 540, 'rgba(255,255,255,0.08)');
  const nivel = falso ? lerp(1, 0.12, eo(k(t, S.sem - 0.2, 0.8))) : u;
  px(170, 1100 - 540 * nivel, 72, 540 * nivel, falso ? G : nivel > 0.8 ? R : A);
  text('°C', 205, 1185, 44, { color: WH, align: 'center' });
  if (t >= S.quarenta - 0.3) {
    const p = back(k(t, S.quarenta - 0.3, 0.4));
    g.save(); g.translate(660, 700); g.scale(p, p);
    text('43 °C', 0, 0, 200, { color: falso ? rgba(WH, 0.35) : WH, bold: true, align: 'center', glow: falso ? 0 : 22 });
    text('avisa o cérebro', 0, 70, 46, { color: A, align: 'center' });
    g.restore();
  }
  if (t >= S.liga - 0.2) {
    typed('> capsaicina: LIGOU', t, S.liga - 0.1, 350, 880, 50, { color: R, glow: 8, cps: 30 });
    typed('> fonte de calor: NENHUMA', t, S.sem - 0.1, 350, 950, 50, { color: G, glow: 8, cps: 34 });
  }
  if (t >= S.alarme - 0.1 && (t >= S.cerebro - 0.3 || Math.floor(t * 5) % 2 === 0 || t > S.alarme + 1))
    stamp('ALARME FALSO', t, S.alarme - 0.1, 680, 1090, A, { rot: -5, size: 62 });
  slide(t, S.cerebro - 0.3, 1, () => {
    box(70, 1200, 940, 150, R, { lit: 0.5 + 0.4 * Math.sin(t * 7) });
    text('CÉREBRO:', 110, 1262, 34, { font: SILK, color: R, bold: true });
    text('"a boca está pegando fogo!"', 110, 1322, 50, { color: WH });
    chama(930, 1330, 0.75, t, 2);
  });
  g.restore();
}

// 4) a capsaicina se dissolve em gordura, e não em água; a água só espalha
function cena4(t) {
  const a = vis(t, S.c4, S.c5);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  comando(t, S.c4, 'agua.exe', CY);
  stamp('FALHA', t, S.c4 + 1.1, 800, 262, R, { rot: 6, size: 50 });
  // dois tanques
  const tanque = (x, nome, cor, at, mistura) => {
    if (t < at - 0.5) return;
    const al = cl((t - at + 0.5) / 0.3), u = eo(k(t, at, 1.1));
    g.save(); g.globalAlpha *= al;
    box(x, 400, 430, 470, cor, { lit: t < at + 1.4 ? 0.7 : 0.2 });
    px(x + 18, 540, 394, 312, rgba(cor, 0.28));
    text(nome, x + 215, 465, 40, { font: SILK, color: cor, bold: true, align: 'center' });
    for (let i = 0; i < 9; i++) {
      const bx = x + 70 + (i % 3) * 145, by0 = 500;
      if (mistura) cap(bx + Math.sin(t * 2 + i) * 10, lerp(by0, 600 + Math.floor(i / 3) * 90, u) + Math.cos(t * 2 + i) * 8, 15, 1 - 0.55 * u);
      else cap(x + 150 + (i % 3) * 62 + Math.sin(t * 3 + i) * 4, 500 + Math.floor(i / 3) * 14 - Math.abs(Math.sin(t * 4 + i)) * 10, 15);
    }
    g.restore();
  };
  tanque(70, 'GORDURA', A, S.gordura - 0.3, true);
  tanque(580, 'ÁGUA', CY, S.naoagua - 0.5, false);
  if (t >= S.gordura + 0.5) text('dissolve ✓', 285, 925, 46, { color: G, align: 'center', glow: 8 });
  if (t >= S.naoagua + 0.2) text('não mistura ✗', 795, 925, 46, { color: R, align: 'center', glow: 8 });
  // a boca: a água carrega as bolinhas para todo lado
  if (t >= S.leva - 0.5) {
    const al = cl((t - S.leva + 0.5) / 0.3), u = eo(k(t, S.leva - 0.2, 1.6));
    g.save(); g.globalAlpha *= al;
    box(70, 990, 940, 250, R, { lit: 0.3 + 0.4 * u });
    text('BOCA.SYS', 100, 1040, 30, { font: SILK, color: rgba(WH, 0.8), bold: true });
    px(88, 1150, 904 * u, 30, rgba(CY, 0.45));
    for (let i = 0; i < 10; i++) cap(lerp(540 + (rnd(i) - 0.5) * 70, 130 + i * 91, u), 1120 + Math.sin(t * 4 + i) * 14, 15);
    g.restore();
    stamp('SÓ ESPALHA', t, S.resto, 540, 1310, R, { rot: -4, size: 56 });
  }
  g.restore();
}

// 5) o leite: a gordura dissolve e a caseína gruda e leva embora
function cena5(t) {
  const a = vis(t, S.c5, S.c6);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  comando(t, S.c5, 'leite.exe', WH);
  const p = back(k(t, S.leite - 0.4, 0.5));
  if (p > 0) caixaLeite(230, 560 + Math.sin(t * 2) * 6, p * 1.45);
  chip('GORDURA: dissolve', 690, 480, t, S.gord2 - 0.2, A, 38);
  chip('CASEÍNA: gruda e leva', 690, 620, t, S.caseina - 0.3, G, 34);
  // a caseína (come-come) limpando a boca
  if (t >= S.gord2 - 0.3) {
    const al = cl((t - S.gord2 + 0.3) / 0.3);
    const u = cl((t - S.gruda + 0.4) / (S.embora - S.gruda + 1.2));
    g.save(); g.globalAlpha *= al;
    box(70, 800, 940, 250, G, { lit: 0.3 + 0.3 * u });
    text('BOCA.SYS', 100, 850, 30, { font: SILK, color: rgba(WH, 0.8), bold: true });
    const cx = lerp(120, 980, u);
    for (let i = 0; i < 9; i++) { const bx = 190 + i * 92; if (bx > cx + 20) cap(bx, 950 + Math.sin(t * 4 + i) * 6, 15); }
    if (t >= S.caseina - 0.3) {
      const ab = 0.25 + 0.2 * Math.abs(Math.sin(t * 12));
      g.save(); g.translate(cx, 950); g.fillStyle = '#f4fbff'; g.shadowColor = WH; g.shadowBlur = 20;
      g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 52, ab, Math.PI * 2 - ab); g.closePath(); g.fill(); g.restore();
      text('caseína', cx, 1030, 30, { color: WH, align: 'center' });
    }
    g.restore();
    const v = lerp(1, 0.15, eo(cl((t - S.gord2) / (S.embora - S.gord2 + 1.0))));
    ardor(70, 1100, 940, v);
  }
  stamp('ALÍVIO', t, S.embora + 0.3, 540, 1300, G, { rot: -5, size: 66 });
  g.restore();
}

// 6) a virada: a mesma substância é usada em remédio para dor
function cena6(t) {
  const a = vis(t, S.c6, S.c7);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  comando(t, S.c6, 'abrir capsaicina.med', A);
  slide(t, S.c6 + 0.4, -1, () => {
    box(70, 340, 940, 120, A, { lit: 0.5 + 0.3 * Math.sin(t * 5) });
    text('ARQUIVO SECRETO', 540, 420, 50, { font: SILK, color: A, bold: true, align: 'center', glow: 8 });
  });
  // pele com o adesivo
  if (t >= S.remedio - 0.5) {
    const al = cl((t - S.remedio + 0.5) / 0.3), d = back(k(t, S.remedio - 0.2, 0.5));
    g.save(); g.globalAlpha *= al;
    px(70, 800, 940, 60, '#e2a77c'); px(70, 860, 940, 24, '#c98a61');
    text('pele', 110, 936, 40, { color: rgba(WH, 0.7) });
    g.save(); g.translate(330, 800 - 30 * d); g.scale(d, d);
    g.shadowColor = R; g.shadowBlur = 20; px(-150, -24, 300, 48, '#fff3ea'); g.shadowBlur = 0; px(-90, -12, 180, 24, '#ff3b4f');
    g.restore();
    text('adesivo de capsaicina', 330, 715, 40, { color: WH, align: 'center', alpha: cl(d) });
    g.restore();
  }
  stamp('REMÉDIO PARA DOR', t, S.dor - 0.25, 540, 555, CY, { rot: -4, size: 54 });
  chip('DOSE ALTA', 800, 720, t, S.dose - 0.1, R, 40);
  // o nervo: o sinal de dor vai sumindo
  if (t >= S.dose - 0.3) {
    const al = cl((t - S.dose + 0.3) / 0.3);
    const forca = 1 - eo(cl((t - S.cansa + 0.2) / (S.sinal - S.cansa + 0.6)));
    g.save(); g.globalAlpha *= al;
    box(70, 960, 940, 300, forca > 0.1 ? R : G, { lit: 0.3 });
    text('NERVO  →  CÉREBRO', 100, 1015, 32, { font: SILK, color: rgba(WH, 0.85), bold: true });
    px(110, 1126, 860, 12, rgba(WH, 0.35));
    for (let i = 0; i < 5; i++) {
      const pos = ((t * 0.55 + i / 5) % 1);
      const h = 90 * forca * (0.7 + 0.3 * Math.sin(i * 2));
      if (h > 4) px(110 + pos * 840, 1132 - h, 24, h, R);
    }
    text('sinal de dor: ' + Math.round(forca * 100) + '%', 540, 1225, 50, { color: forca > 0.1 ? WH : G, align: 'center', glow: 8 });
    g.restore();
  }
  stamp('O NERVO CANSA', t, S.sinal - 0.2, 540, 1330, G, { rot: 4, size: 50 });
  g.restore();
}

// 7) chamada
function cena7(t) {
  const a = vis(t, S.c7, S.siga);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  comando(t, S.c7, 'enviar.exe');
  box(70, 420, 940, 640, G, { lit: 0.5 + 0.3 * Math.sin(t * 5) });
  typed('MANDA PARA', t, S.c7 + 0.1, 540, 540, 84, { font: SILK, color: G, bold: true, align: 'center', glow: 18, cps: 20 });
  typed('aquele amigo que', t, S.amigo - 0.4, 540, 650, 62, { color: WH, align: 'center', cps: 34 });
  typed('NÃO AGUENTA PIMENTA', t, S.aguenta - 0.3, 540, 750, 54, { font: SILK, color: A, bold: true, align: 'center', glow: 12, cps: 30 });
  const p = back(k(t, S.c7 + 0.3, 0.5));
  pimenta(430, 920, p * 0.95, -0.25); chama(650, 990, p * 1.3, t, 1);
  g.restore();
}

// Me siga (com o logo do Farma.exe) e tela final
const LOGO = new Image(); LOGO.src = 'logo.jpg';
function cena10(t) {
  const a = vis(t, S.siga, S.consulte - 0.05);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  box(70, 380, 940, 800, G, { lit: 0.6 + 0.3 * Math.sin(t * 5) });
  text('C:\\> seguir.exe', 110, 450, 36, { color: rgba(G, 0.7) });
  const p = back(k(t, S.siga + 0.05, 0.45));
  if (p > 0 && LOGO.complete) {
    g.save(); g.translate(540, 640); g.scale(p, p);
    g.shadowColor = G; g.shadowBlur = 34; g.fillStyle = G; g.beginPath(); g.arc(0, 0, 158, 0, 7); g.fill(); g.shadowBlur = 0;
    g.beginPath(); g.arc(0, 0, 150, 0, 7); g.clip(); g.drawImage(LOGO, -150, -150, 300, 300);
    g.restore();
  }
  typed('ME SIGA', t, S.siga + 0.3, 540, 930, 104, { font: SILK, color: G, bold: true, align: 'center', glow: 22, cps: 14 });
  typed('para mais dicas de farmacologia', t, S.siga + 0.9, 540, 1030, 50, { color: WH, align: 'center', cps: 40 });
  typed('e curiosidades sobre a área', t, S.siga + 1.6, 540, 1100, 50, { color: A, align: 'center', cps: 40, cursor: true });
  g.restore();
}
function cena11(t) {
  const a = cl((t - S.consulte + 0.05) / 0.3);
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  box(70, 560, 940, 560, G, { lit: 0.6 + 0.3 * Math.sin(t * 4) });
  text('C:\\> encerrar.exe', 110, 630, 36, { color: rgba(G, 0.7) });
  ['CONSULTE UM', 'PROFISSIONAL', 'DE SAÚDE PARA', 'ORIENTAÇÕES.'].forEach((l, i) =>
    typed(l, t, S.consulte + i * 0.35, 540, 770 + i * 95, 66, { font: SILK, color: i === 1 ? A : G, bold: true, align: 'center', glow: 16, cps: 30 }));
  text('Ref.: Caterina e Julius, Nature 1997 · Nobel de Medicina 2021', 540, 1330, 26, { color: rgba(WH, 0.65), align: 'center', alpha: cl((t - S.consulte - 1.2) / 0.4) });
  g.restore();
}

// glitch rápido na troca de cena
function glitch(t) {
  const c = CENAS.find(s => s > 0 && t >= s && t < s + 0.22);
  if (c === undefined) return;
  const u = 1 - (t - c) / 0.22;
  for (let i = 0; i < 9; i++) {
    const y = Math.floor(rnd(i + Math.floor(t * 30)) * H), h = 20 + rnd(i + 7) * 90;
    const dx = (rnd(i + 3 + Math.floor(t * 60)) - 0.5) * 120 * u;
    g.drawImage(cv, 0, y, W, h, dx, y, W, h);
  }
  g.fillStyle = rgba(R, 0.12 * u); g.fillRect(0, 0, W, H);
  g.fillStyle = rgba(CY, 0.08 * u); g.fillRect(8 * u, 0, W, H);
}

window.draw = function (t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0;
  fundo(t);
  cena1(t); cena2(t); cena3(t); cena4(t); cena5(t); cena6(t); cena7(t); cena10(t); cena11(t);
  legenda(t);
  barra(t);
  glitch(t);
  crt();
};
window.render = window.draw;
// capa vertical 1080x1920 (gerada por capa.mjs): tudo entre y 300 e 1620
window.capa = function () {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0;
  const t = 2;
  fundo(t);
  text('POR QUE A', 540, 430, 96, { font: SILK, color: WH, glow: 18, bold: true, align: 'center' });
  text('PIMENTA', 540, 570, 150, { font: SILK, color: R, glow: 30, bold: true, align: 'center' });
  text('ARDE?', 540, 710, 150, { font: SILK, color: A, glow: 30, bold: true, align: 'center' });
  pimenta(330, 1010, 1.9, -0.25);
  chama(700, 1150, 2.3, t, 1); chama(860, 1130, 1.5, t, 3);
  stamp('ÁGUA NÃO RESOLVE', 9, 0, 540, 1400, CY, { rot: -5, size: 62 });
  text('e o que ajuda de verdade', 540, 1560, 56, { color: WH, align: 'center', glow: 8 });
  barra(t);
  crt();
};
window.S = S;

const faces = [
  ['Silk', 'fonts/silk400.woff2', '400'], ['Silk', 'fonts/silk400ext.woff2', '400', 'U+0100-024F'],
  ['Silk', 'fonts/silk700.woff2', '700'], ['Silk', 'fonts/silk700ext.woff2', '700', 'U+0100-024F'],
  ['VT', 'fonts/vt.woff2', '400'], ['VT', 'fonts/vtext.woff2', '400', 'U+0100-024F'],
];
Promise.all([LOGO.decode().catch(() => {}), ...faces.map(([f, u, w, r]) => new FontFace(f, `url(${u})`, r ? { weight: w, unicodeRange: r } : { weight: w }).load().then(ff => document.fonts.add(ff)))])
  .then(() => { draw(0); window.ready = true; });
