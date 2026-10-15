// Protótipo "Por que a dipirona é proibida nos EUA?" — sem narração, só textos na tela e efeitos.
export const COR = "#f59e0b";
export const DURATION = 2520; // 84 s
export const VOZ_INICIO = 105; // a narração começa depois que a caixa é algemada e olha para a câmera

// tempos medidos nas pausas de audio/dipirona_narracao.mp3 (+ 105 quadros de atraso da voz)
export const T = {
  agentes: 15, algema: 86, olha: 100, fala: 105,
  ano: 224, fda: 270,
  motivo: 456, agranulo: 560, neutro: 615, some: 660, bacteria: 797,
  polemica: 918, lado1: 1064, lado2: 1185, discutido: 1268,
  paises: 1370, proibida: 1450, liberada: 1534, anvisa: 1674,
  age: 1771, chips: 1890,
  alerta: 2078, sinais: [2133, 2160, 2193], pare: 2245,
  final: 2350,
};

export const PARTES = [[0, 226], [214, 456], [446, 918], [908, 1370], [1360, 1771], [1762, 2078], [2068, 2350], [2340, 2520]];

export const REFERENCIAS = "FDA 1977 · IAAAS, JAMA 1986 · Hedenmalm & Spigset 2002 · Anvisa 2001";

export const SFX: [number, string, number][] = [
  [15, "whoosh", 0.3], [86, "trava", 0.5], [105, "pop", 0.25],
  [214, "whoosh", 0.3], [224, "plim", 0.2],
  [446, "whoosh", 0.3], [560, "pop", 0.22], [660, "pop", 0.2], [797, "pop", 0.2],
  [908, "whoosh", 0.3], [1064, "pop", 0.25], [1185, "pop", 0.25],
  [1360, "whoosh", 0.3], [1450, "pop", 0.22], [1534, "pop", 0.22], [1674, "plim", 0.2],
  [1762, "whoosh", 0.3], [1890, "pop", 0.22],
  [2068, "whoosh", 0.3], [2133, "pop", 0.25], [2160, "pop", 0.25], [2193, "pop", 0.25], [2245, "trava", 0.3],
  [2340, "whoosh", 0.25], [2350, "plim", 0.25],
];
