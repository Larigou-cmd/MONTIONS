// Vídeo "Os prazóis": textos, dados e tempos (medidos na narração audio/ibp_narracao.mp3).

export const DURATION = 1760; // 58,7 s (narração de 53,5 s + mensagem final)

export const IBP = {
  cor: "#34d399", // cor do remédio
  acido: "#fb7185",
  bomba: "#60a5fa",
  nomes: ["Omeprazol", "Pantoprazol", "Esomeprazol", "Lansoprazol"],
  pergunta: ["Qual é a diferença?", "E como agem no estômago?"],
  familia: [
    { nome: "Omeprazol", traco: "O primeiro da família (1989)", quando: "Escolha inicial comum: barato e muito estudado" },
    { nome: "Esomeprazol", traco: "A metade mais ativa do omeprazol", quando: "Esofagite mais intensa ou quando o omeprazol não basta" },
    { nome: "Pantoprazol", traco: "Menos interações · tem versão injetável", quando: "Quem usa muitos remédios (ex.: clopidogrel)" },
    { nome: "Lansoprazol", traco: "Boa absorção oral", quando: "Alternativa quando outro não foi bem tolerado" },
    { nome: "Rabeprazol", traco: "Ativa mais rápido", quando: "Quando se busca um efeito mais previsível" },
    { nome: "Dexlansoprazol", traco: "Liberação em duas fases", quando: "Rotina de refeições irregular" },
  ],
  equivalente: "Em doses equivalentes, o efeito é parecido",
  cuidados: [
    { nome: "Vitamina B12", seta: "↓" },
    { nome: "Magnésio", seta: "↓" },
  ],
  mensagemFinal: ["Consulte um", "profissional de saúde", "para orientações."],
  referencias: "Shin & Sachs 2008 · Strand et al. 2017 · FDA 2009 (clopidogrel)",
};

export const TI = {
  nomes: [4, 34, 66, 98],
  prazol: 142,
  pergunta: [197, 236],
  estomago: 302,
  parietal: 360,
  bombas: 414,
  acido: 450,
  sangue: 547,
  inativo: 612,
  ativa: 660,
  encaixa: 700,
  trava: 748,
  porIsso: 792,
  jejum: 860,
  cafe: 900,
  acordam: 952,
  diferenca: 989,
  familia: [1000, 1030, 1098, 1206, 1236, 1262],
  equivalente: 1340,
  prolongado: 1426,
  cuidados: [1485, 1515],
  aviso: 1543,
  final: 1610,
};

export const PULSES_IBP = [142, 748, 952, 1340];
