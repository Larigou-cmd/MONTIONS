// Protótipo "Por que a dipirona é proibida nos EUA?" — sem narração, só textos na tela e efeitos.
export const COR = "#f59e0b";
export const DURATION = 1960; // 65 s

export const T = {
  agentes: 15, algema: 86, olha: 104, fala: 112,
  ano: 215, fda: 250,
  motivo: 425, neutro: 470, some: 540, bacteria: 600,
  polemica: 725, lado1: 770, lado2: 820, discutido: 880,
  paises: 965, proibida: 990, liberada: 1050, anvisa: 1140,
  age: 1235, chips: 1300,
  alerta: 1505, sinais: [1550, 1585, 1620], pare: 1680,
  final: 1775,
};

export const PARTES = [[0, 222], [212, 432], [422, 732], [722, 972], [962, 1242], [1232, 1512], [1502, 1782], [1772, 1960]];

export const REFERENCIAS = "FDA 1977 · IAAAS, JAMA 1986 · Hedenmalm & Spigset 2002 · Anvisa 2001";

export const SFX: [number, string, number][] = [
  [15, "whoosh", 0.35], [86, "trava", 0.55], [112, "pop", 0.3],
  [212, "whoosh", 0.35], [215, "plim", 0.25],
  [422, "whoosh", 0.35], [540, "pop", 0.25], [600, "pop", 0.25],
  [722, "whoosh", 0.35], [770, "pop", 0.3], [820, "pop", 0.3],
  [962, "whoosh", 0.35], [990, "pop", 0.25], [1050, "pop", 0.25], [1140, "plim", 0.25],
  [1232, "whoosh", 0.35], [1300, "pop", 0.25],
  [1502, "whoosh", 0.35], [1550, "pop", 0.3], [1585, "pop", 0.3], [1620, "pop", 0.3], [1680, "trava", 0.35],
  [1772, "whoosh", 0.3], [1775, "plim", 0.3],
];
