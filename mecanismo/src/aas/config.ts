// Vídeo "Como funciona o AAS": cores, textos e tempos (medidos nas pausas de audio/aas_narracao.mp3).
export const COR = "#60a5fa"; // cor do remédio
export const ACETIL = "#fb923c";
export const DURATION = 4810; // 160 s

export const T = {
  nome: 90, usados: 180, como: 285,
  salgueiro: 338, milhares: 400, ano: 498, hoje: 600,
  cox: 672, gordura: 720, dor: 847, tromboxano: 943,
  cola: 1089, trava: 1170, irreversivel: 1239, estrutura: 1382, recupera: 1568, nova: 1690,
  horas: 1757, plaquetas: 1847, dias: 1978,
  afinar: 2166, menosGrud: 2272,
  protege: 2443, placas: 2492, rompe: 2615, coracao: 2760, cerebro: 2875, comAAS: 2969, stent: 3102,
  cox12: 3315, bloqueia: 3566, doseAlta: 3642,
  cuidados: [3722, 3918, 4029, 4166, 4343, 4434],
  orientacao: 4584, final: 4660,
};

export const PARTES = [
  [0, 340], [330, 676], [666, 1094], [1084, 2170], [2160, 2447], [2437, 3320], [3310, 3727], [3717, 4594], [4584, 4810],
];

export const CUIDADOS = [
  { icone: "🩸", texto: "Estômago mais exposto e mais risco de sangramento" },
  { icone: "💊", texto: "Ibuprofeno tomado antes pode atrapalhar o efeito" },
  { icone: "🦷", texto: "Antes de cirurgia ou dentista, avise o médico" },
  { icone: "⚖️", texto: "Sem infarto ou AVC prévio, o risco pode superar o benefício" },
  { icone: "🚫", texto: "Não comece a tomar por conta própria" },
  { icone: "🦟", texto: "Não use com suspeita de dengue, nem em crianças e adolescentes com virose" },
];

export const MENSAGEM_FINAL = ["Consulte um", "profissional de saúde", "para orientações."];
export const REFERENCIAS = "Vane 1971 · Patrono et al. 2005 · ATT Collaboration 2009 · USPSTF 2022";

// efeitos sonoros: [quadro, arquivo, volume]
export const SFX: [number, string, number][] = [
  [8, "pop", 0.35], [90, "pop", 0.3], [285, "plim", 0.22],
  [330, "whoosh", 0.35], [498, "pop", 0.3],
  [666, "whoosh", 0.35], [847, "pop", 0.25], [859, "pop", 0.25], [871, "pop", 0.25], [943, "pop", 0.3],
  [1084, "whoosh", 0.3], [1160, "trava", 0.55], [1239, "plim", 0.25], [1600, "whoosh", 0.25], [1690, "pop", 0.3],
  [1750, "whoosh", 0.3], [1847, "pop", 0.3], [1978, "pop", 0.3],
  [2160, "whoosh", 0.35], [2272, "plim", 0.25],
  [2437, "whoosh", 0.35], [2615, "trava", 0.4], [2760, "pop", 0.3], [2875, "pop", 0.3], [2969, "plim", 0.25], [3102, "pop", 0.3],
  [3310, "whoosh", 0.35], [3566, "trava", 0.45], [3642, "pop", 0.3],
  [3717, "whoosh", 0.35], [3722, "pop", 0.25], [3918, "pop", 0.25], [4029, "pop", 0.25], [4166, "pop", 0.25], [4343, "pop", 0.25], [4434, "pop", 0.25],
  [4584, "whoosh", 0.3], [4660, "plim", 0.3],
];
