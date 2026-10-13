// Todos os textos, números e tempos do vídeo ficam aqui.
// Para trocar de remédio: mude estes dados e gere a narração nova (os tempos em T e CAPTIONS seguem a voz).

export const FPS = 30;
export const DURATION = 1860; // 62 s (a narração da Juliana tem 57 s; os últimos segundos são a assinatura)

export const config = {
  medicamento: "Tirzepatida",
  nomeComercial: "Mounjaro®",
  classe: ["Agonista duplo dos receptores", "de GIP e GLP-1"],
  pergunta: "Como ela age no corpo?",
  corMedicamento: "#a78bfa",
  alvos: [
    { hormonio: "GIP", receptor: "Receptor de GIP", cor: "#f5a524" },
    { hormonio: "GLP-1", receptor: "Receptor de GLP-1", cor: "#2dd4bf" },
  ],
  molecula: "Peptídeo de 39 aminoácidos + ácido graxo",
  aminoacidos: 39,
  temAlbumina: true,
  chips: ["Meia-vida ≈ 5 dias", "1 aplicação por semana"],
  cascata: ["Receptor ativado", "AMPc ↑", "A célula responde"],
  orgaos: [
    { tipo: "pancreas", nome: "Pâncreas", efeitos: ["Insulina ↑ só com glicose alta", "Glucagon ↓"] },
    { tipo: "estomago", nome: "Estômago", efeitos: ["Esvaziamento mais lento"] },
    { tipo: "cerebro", nome: "Cérebro", efeitos: ["Saciedade ↑", "Apetite ↓"] },
  ],
  resultados: [
    { rotulo: "HbA1c", valor: 2.3, casas: 2, unidade: " p.p.", fonte: "SURPASS-2 · 15 mg · 40 semanas", cor: "#2dd4bf" },
    { rotulo: "Peso corporal", valor: 20.9, casas: 1, unidade: "%", fonte: "SURMOUNT-1 · 15 mg · 72 semanas", cor: "#f5a524" },
  ],
  adversos: ["Náuseas", "Diarreia", "Vômitos"],
  aviso: ["Conteúdo educativo.", "Use somente com prescrição", "e acompanhamento médico."],
  resumoEfeitos: ["Glicose ↓", "Apetite ↓", "Peso ↓"],
  referencias: "Coskun 2018 · Willard 2020 · Frías 2021 · Jastreboff 2022",
  perfil: "@ssupernova.studio",
  palavra: "MECANISMO",
  conviteAntes: "Comenta",
  conviteDepois: "que eu te mando o resumo",
  nomeFinal: "SUPERNOVA STUDIO",
};

export const C = {
  bg: "#070b1a",
  bg2: "#101a3a",
  ink: "#eef2ff",
  dim: "#94a3c8",
  alert: "#fb7185",
  num: "#fde047",
  box: "rgba(20,24,44,0.92)",
  boxBorder: "rgba(255,255,255,0.10)",
};

// Quadros-chave, medidos nas pausas da narração (audio/narracao.mp3)
export const T = {
  // parte 1
  pergunta: [170, 178, 187, 194, 202, 208],
  // parte 2
  gip: 333,
  glp: 348,
  receptores: 450,
  encaixe: [546, 576],
  chaveFechadura: 610,
  cauda: 681,
  albumina: 729,
  semana: 792,
  // parte 3
  passos: [870, 956, 991],
  // parte 4
  orgaos: [1041, 1201, 1289],
  glucagon: 1164,
  resultados: 1358,
  numeros: [
    [1380, 1450],
    [1462, 1530],
  ],
  // parte 5
  adversos: 1559,
  aviso: 1654,
  convite: 1716,
  assinatura: 1782,
};

export const PULSES = [546, 576, 956, 1450, 1530];

export const PARTS = [
  { n: "01", nome: "ABERTURA", from: 0 },
  { n: "02", nome: "O ALVO", from: 236 },
  { n: "03", nome: "A CASCATA", from: 826 },
  { n: "04", nome: "OS EFEITOS", from: 1040 },
  { n: "05", nome: "RESUMO", from: 1554 },
];

export const CAPTIONS: [number, number, string][] = [
  [0, 30, "Tirzepatida."],
  [44, 157, "Uma única molécula que controla a glicose e reduz o peso."],
  [170, 220, "Mas como ela age no corpo?"],
  [235, 372, "Ela imita dois hormônios do intestino, o GIP e o GLP-1."],
  [387, 506, "Na superfície das células existem receptores para cada um deles."],
  [519, 654, "A tirzepatida encaixa nos dois, como uma chave que abre duas fechaduras."],
  [666, 753, "Uma cauda de ácido graxo a prende à albumina,"],
  [761, 812, "e o efeito dura uma semana."],
  [828, 983, "Quando ela encaixa, o receptor liga um sinal dentro da célula, o AMP cíclico,"],
  [991, 1027, "e a célula responde."],
  [1041, 1186, "No pâncreas, libera insulina só quando a glicose está alta, e reduz o glucagon."],
  [1201, 1277, "No estômago, a comida sai mais devagar."],
  [1289, 1342, "No cérebro, a fome diminui."],
  [1358, 1544, "Nos estudos, a hemoglobina glicada caiu mais de dois pontos, e o peso, cerca de vinte por cento."],
  [1559, 1643, "Os efeitos mais comuns são náuseas e diarreia."],
  [1654, 1712, "Use só com orientação médica."],
];
