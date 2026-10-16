// Vídeo "Forxiga (dapagliflozina)" no modelo aula elegante: cores, textos e tempos.
// Tempos em quadros (30 fps), tirados de audio/forxiga_palavras.json (quadro = segundos × 30).
export const COR = "#a78bfa"; // cor do remédio (roxo da caixa)
export const COMP = "#facc15"; // comprimido amarelo
export const GLI = "#fbbf24"; // glicose
export const SGLT = "#34d399"; // transportador SGLT2
export const NA = "#38bdf8"; // sódio e água
export const SANGUE = "#f87171";

export const DURATION = 4180; // 139,3 s (narração de 136,8 s + mensagem final)

export const T = {
  // abertura
  forxiga: 38,
  dapa: 115,
  dm2: 182,
  ic: 228,
  drc: 276,
  // mecanismo
  como: 336,
  rins: 376,
  filtrado: 415,
  volta: 440,
  sglt2: 598,
  tubulo: 653,
  dapa2: 696,
  bloqueia: 727,
  urina: 866,
  setenta: 898,
  glicemia: 953,
  // sódio, água, coração e rins
  junto: 992,
  sodio: 1050,
  agua: 1070,
  coracao: 1114,
  protege: 1139,
  tambem: 1201,
  icDrc: 1229,
  drc2: 1277,
  semDiabetes: 1332,
  // off-label
  off: 1385,
  emagrecer: 1441,
  tipo1: 1508,
  fora: 1558,
  ceto: 1643,
  grave: 1702,
  // Farmácia Popular
  sus: 1751,
  fp: 1814,
  graca: 1891,
  crDm2: 1921,
  cr65: 1967,
  crDcv: 2021,
  receita: 2088,
  cpf: 2118,
  credenciada: 2160,
  // Componente Especializado
  menos65: 2228,
  ceaf: 2321,
  altoCusto: 2374,
  tres: 2458,
  cids: 2501,
  dm2c: 2545,
  metformina: 2596,
  quarenta: 2660,
  homens: 2744,
  icc: 2921,
  drcc: 3029,
  // processo
  processo: 3082,
  medico: 3124,
  lme: 3182,
  documentos: 3277,
  entrega: 3439,
  analisa: 3535,
  aprovado: 3615,
  todoMes: 3677,
  renovado: 3727,
  // efeitos
  efeitos: 3790,
  infeccao: 3833,
  causa: 3892,
  agua2: 3946,
  higiene: 3972,
  final: 4024,
};

export const PARTES: [number, number][] = [
  [0, 326],
  [320, 994],
  [988, 1382],
  [1376, 1730],
  [1724, 2212],
  [2206, 3080],
  [3074, 3788],
  [3782, 4026],
  [4020, DURATION],
];

export const MENSAGEM_FINAL = [
  "Consulte um",
  "profissional de saúde",
  "para orientações.",
];

// efeitos sonoros: [quadro, arquivo, volume]
export const SFX: [number, string, number][] = [
  [30, "pop", 0.3],
  [115, "pop", 0.25],
  [182, "pop", 0.22],
  [228, "pop", 0.22],
  [276, "pop", 0.22],
  [320, "whoosh", 0.3],
  [415, "pop", 0.2],
  [598, "plim", 0.22],
  [727, "trava", 0.45],
  [898, "pop", 0.3],
  [988, "whoosh", 0.3],
  [1050, "pop", 0.22],
  [1070, "pop", 0.22],
  [1114, "pop", 0.25],
  [1139, "pop", 0.25],
  [1332, "plim", 0.22],
  [1376, "whoosh", 0.3],
  [1441, "pop", 0.22],
  [1508, "pop", 0.22],
  [1558, "trava", 0.4],
  [1643, "pop", 0.25],
  [1724, "whoosh", 0.3],
  [1814, "pop", 0.25],
  [1891, "plim", 0.25],
  [1921, "pop", 0.2],
  [1967, "pop", 0.2],
  [2021, "pop", 0.2],
  [2088, "pop", 0.2],
  [2118, "pop", 0.2],
  [2160, "pop", 0.2],
  [2206, "whoosh", 0.3],
  [2321, "pop", 0.25],
  [2545, "pop", 0.25],
  [2921, "pop", 0.25],
  [3029, "pop", 0.25],
  [3074, "whoosh", 0.3],
  [3124, "pop", 0.22],
  [3277, "pop", 0.22],
  [3439, "pop", 0.22],
  [3535, "pop", 0.22],
  [3615, "plim", 0.25],
  [3782, "whoosh", 0.3],
  [3833, "pop", 0.22],
  [3946, "pop", 0.22],
  [3972, "pop", 0.22],
  [4020, "whoosh", 0.3],
  [4024, "plim", 0.3],
];
