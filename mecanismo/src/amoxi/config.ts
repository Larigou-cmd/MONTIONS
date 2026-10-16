// Vídeo "Amoxicilina + clavulanato" (modelo aula elegante): cores, textos e tempos.
// Tempos em quadros (30 fps), tirados da transcrição palavra a palavra de public/amoxi/narracao.mp3
// (audio/amoxi_palavras.json: quadro = segundos × 30).
export const AMOX = "#60a5fa"; // amoxicilina
export const CLAV = "#fbbf24"; // clavulanato
export const LACT = "#fb7185"; // betalactamase
export const PBP = "#a78bfa"; // enzimas PBP
export const BAC = "#4ade80"; // bactéria
export const ANEL = "#fde047"; // anel betalactâmico

export const DURATION = 3420; // 114 s (narração de 110,5 s + mensagem final)

export const T = {
  // abertura
  amox: 24,
  clav: 55,
  junta: 96,
  porque: 185,
  sozinha: 258,
  // amoxicilina
  titAmox: 310,
  penicilina: 386,
  beta: 437,
  bacterias: 490,
  parede: 540,
  constroem: 569,
  enzimas: 632,
  pbps: 662,
  encaixa: 703,
  trava: 782,
  semParede: 828,
  rompe: 888,
  morre: 911,
  // resistência
  problema: 938,
  defender: 998,
  produzem: 1058,
  lactamase: 1109,
  quebra: 1157,
  anel: 1183,
  quebrado: 1310,
  perde: 1358,
  alvo: 1418,
  // clavulanato
  titClav: 1476,
  anel2: 1543,
  quase: 1596,
  prende: 1668,
  inativada: 1747,
  sempre: 1790,
  escudo: 1829,
  sacrifica: 1854,
  protege: 1884,
  // juntos
  livre: 1963,
  destruir: 2016,
  funciona: 2110,
  sinusite: 2233,
  otite: 2261,
  pele: 2285,
  // atenção
  atencao: 2362,
  naoVence: 2395,
  virus: 2508,
  gripe: 2561,
  resfriado: 2584,
  causados: 2635,
  // cuidados
  cuidados: [2712, 2786, 2880, 2976, 3094],
  final: 3230,
};

export const PARTES: [number, number][] = [
  [0, 306],
  [300, 936],
  [930, 1448],
  [1442, 1944],
  [1938, 2358],
  [2352, 2666],
  [2660, 3232],
  [3226, DURATION],
];

export const CUIDADOS = [
  {
    icone: "🤢",
    texto: "Diarreia, náusea e vômito são os efeitos mais comuns",
  },
  { icone: "🍽️", texto: "Tome no início da refeição" },
  { icone: "⚠️", texto: "Alergia a penicilina: não use" },
  { icone: "📅", texto: "Tome pelo tempo indicado, mesmo se melhorar antes" },
  { icone: "📋", texto: "Receita retida na farmácia · vale 10 dias" },
];

export const MENSAGEM_FINAL = [
  "Consulte um",
  "profissional de saúde",
  "para orientações.",
];

// efeitos sonoros: [quadro, arquivo, volume]
export const SFX: [number, string, number][] = [
  [20, "pop", 0.3],
  [52, "pop", 0.3],
  [185, "plim", 0.22],
  [300, "whoosh", 0.3],
  [437, "pop", 0.25],
  [490, "pop", 0.25],
  [632, "pop", 0.22],
  [703, "whoosh", 0.25],
  [782, "trava", 0.45],
  [888, "trava", 0.4],
  [930, "whoosh", 0.3],
  [998, "plim", 0.2],
  [1109, "pop", 0.3],
  [1310, "trava", 0.45],
  [1358, "pop", 0.25],
  [1442, "whoosh", 0.3],
  [1543, "pop", 0.25],
  [1709, "trava", 0.4],
  [1790, "plim", 0.25],
  [1829, "whoosh", 0.25],
  [1938, "whoosh", 0.3],
  [2030, "trava", 0.4],
  [2110, "plim", 0.22],
  [2233, "pop", 0.25],
  [2261, "pop", 0.25],
  [2285, "pop", 0.25],
  [2352, "whoosh", 0.3],
  [2395, "pop", 0.25],
  [2508, "pop", 0.25],
  [2635, "trava", 0.35],
  [2660, "whoosh", 0.3],
  [2712, "pop", 0.22],
  [2786, "pop", 0.22],
  [2880, "pop", 0.22],
  [2976, "pop", 0.22],
  [3094, "pop", 0.22],
  [3226, "whoosh", 0.3],
  [3230, "plim", 0.3],
];
