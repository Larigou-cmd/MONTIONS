// Vídeo "Semaglutida" com a personagem farmacêutica (estilo PHARMACIST.EXE).
// Tempos medidos nas pausas de audio/sema_narracao.mp3 (30 quadros = 1 s).
export const DURATION = 2400; // 80 s

export const PAL = {
  bg: "#020b14", cyan: "#67e8f9", cyanD: "#0e7490", green: "#4ade80", amber: "#fbbf24",
  red: "#fb7185", white: "#e0f2fe", dim: "#7dd3fc", panel: "rgba(3,20,32,0.92)",
};

export const T = {
  titulo: 60, marcas: 125, encolhe: 168,
  glp: 180, minutos: 290, semana: 420, semanal: 533,
  pancreas: 605, glucagon: 700, estomago: 775, cerebro: 860,
  step: 973, perda: 1110, metade: 1200, terco: 1320,
  efeitos: 1385, comuns: [1470, 1492, 1512, 1532], raros: 1557,
  offlabel: 1665, ozempic: 1712, sop: 1870, prediab: 1955, indicacao: 2001,
  parar: 2094, cresce: 2150, consulte: 2217,
};

export const CENAS = [
  { de: 168, ate: 600, titulo: "GLP-1.SYS" },
  { de: 590, ate: 966, titulo: "MECANISMO.EXE" },
  { de: 956, ate: 1388, titulo: "STEP1.DAT" },
  { de: 1378, ate: 1668, titulo: "EFEITOS.LOG" },
  { de: 1658, ate: 2096, titulo: "OFF_LABEL.TXT" },
  { de: 2086, ate: 2222, titulo: "AVISO.TXT" },
];

export const STEP1 = [
  { faixa: "≥ 5%", pct: 86 }, { faixa: "≥ 10%", pct: 69 }, { faixa: "≥ 15%", pct: 50 }, { faixa: "≥ 20%", pct: 32 },
];

export const SFX: [number, string, number][] = [
  [10, "bip", 0.18], [60, "pop", 0.25], [168, "whoosh", 0.3],
  [590, "whoosh", 0.25], [605, "bip", 0.15], [775, "bip", 0.15], [860, "bip", 0.15],
  [956, "whoosh", 0.25], [1110, "plim", 0.22],
  [1378, "whoosh", 0.25], [1470, "pop", 0.2], [1492, "pop", 0.2], [1512, "pop", 0.2], [1532, "pop", 0.2], [1557, "bip", 0.15],
  [1658, "whoosh", 0.25], [1712, "pop", 0.2], [1870, "pop", 0.2], [1955, "pop", 0.2], [2001, "trava", 0.3],
  [2086, "whoosh", 0.25], [2217, "plim", 0.25],
];
