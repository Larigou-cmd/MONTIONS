import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { OUT, P, SNAP, it, rgba } from "../lib";
import { EMOJI } from "../aas/ui";
import { SANS } from "../fonts";
import { Carimbo, Chip, Fundo, N, Sel, Titulo, VT } from "../semaModelos/Painel3D";
import { TipoViagem, Viagem3D } from "./Viagem3D";

// Vídeo longo "O caminho do remédio dentro do corpo, da boca até o xixi (animação 3D)".
// Roteiro: roteiros/caminho_do_remedio_paracetamol.md. PRÉVIA SEM ÁUDIO: os tempos são estimados
// (~2,6 palavras/s) e a fala aparece como legenda provisória. Quando a narração chegar, os tempos
// passam a vir da transcrição palavra a palavra, como no Notícias #4.
const W = 1080;
const s = (x: number) => Math.round(x * 30);
export const DURATION = s(395);

type Parte = { de: number; ate: number; etapa: number; relogio?: string; fala: string[] };
const PARTES: Parte[] = [
  {
    de: 0,
    ate: 22,
    etapa: 0,
    relogio: "+0 min",
    fala: [
      "Você engole um comprimido de paracetamol. Em meia hora, a dor começa a passar.",
      "Mas como um comprimidinho que caiu no estômago sabe que a dor está na sua cabeça?",
      "A resposta é uma viagem.",
    ],
  },
  {
    de: 22,
    ate: 40,
    etapa: 0,
    fala: [
      "E toda viagem de remédio tem quatro etapas, que a farmacologia chama de farmacocinética:",
      "absorção, distribuição, metabolismo e excreção.",
      "Hoje a gente vai seguir esse comprimido do primeiro gole de água até ele sair do seu corpo, no xixi.",
    ],
  },
  {
    de: 40,
    ate: 75,
    etapa: 1,
    relogio: "+5 min",
    fala: [
      "Primeira parada: o estômago. O comprimido cai num ambiente muito ácido e começa a se desmanchar.",
      "O remédio só funciona se dissolver. Um comprimido que não se desfaz passa direto e não faz efeito nenhum.",
      "Mas aqui vem a primeira surpresa: o estômago quase não absorve o paracetamol. Ele é só a sala de espera.",
    ],
  },
  {
    de: 75,
    ate: 120,
    etapa: 1,
    relogio: "+20 min",
    fala: [
      "Quando o estômago esvazia, o remédio dissolvido passa para o intestino delgado.",
      "A parede dele é cheia de dobrinhas, as vilosidades, que juntas formam uma área enorme.",
      "As moléculas de paracetamol atravessam essa parede e entram nos vasos de sangue.",
      "Por isso, tomar o remédio com o estômago muito cheio pode atrasar o efeito. Isso é a absorção, a etapa um.",
    ],
  },
  {
    de: 120,
    ate: 170,
    etapa: 1,
    relogio: "+25 min",
    fala: [
      "O sangue que sai do intestino não vai direto para o corpo todo. Ele passa primeiro pela veia porta, que leva tudo para o fígado.",
      "O fígado funciona como uma alfândega: tudo o que você engole passa por ele antes.",
      "Ele já transforma uma parte do remédio nessa primeira passagem. Nem todo o paracetamol chega à circulação.",
      "É por causa dessa alfândega que alguns remédios precisam ser injetados, ou colocados embaixo da língua.",
    ],
  },
  {
    de: 170,
    ate: 200,
    etapa: 2,
    relogio: "+35 min",
    fala: [
      "Quem passou pela alfândega cai na circulação. Etapa dois: a distribuição.",
      "O coração bombeia, e em pouco tempo o paracetamol está espalhado pelo corpo inteiro.",
      "Muitos remédios viajam grudados em proteínas do sangue, de carona. O paracetamol quase não pega carona: viaja solto.",
    ],
  },
  {
    de: 200,
    ate: 215,
    etapa: 2,
    relogio: "+40 min",
    fala: ["E ele consegue atravessar a barreira que protege o cérebro.", "É lá, no sistema nervoso, que ele diminui a dor e baixa a febre."],
  },
  {
    de: 215,
    ate: 230,
    etapa: 2,
    relogio: "+45 min",
    fala: ["Entre meia hora e uma hora depois de você engolir, a quantidade de remédio no sangue chega ao ponto mais alto.", "É o pico. E é mais ou menos aí que a dor passa."],
  },
  {
    de: 230,
    ate: 300,
    etapa: 3,
    relogio: "+2 h",
    fala: [
      "Mas o corpo não quer guardar remédio para sempre. A cada volta do sangue, o paracetamol passa de novo pelo fígado. Etapa três: o metabolismo.",
      "A maior parte recebe uma etiqueta, que transforma o remédio em algo que se dissolve na água e pode ir embora.",
      "Uma parte pequena vira uma substância tóxica, o NAPQI. Nas doses certas, a glutationa, o segurança do fígado, neutraliza na hora.",
      "O problema é a dose alta: a glutationa acaba, e a substância tóxica ataca o fígado.",
      "Remédio comum não quer dizer remédio sem risco: respeite a dose da bula e da receita.",
    ],
  },
  {
    de: 300,
    ate: 335,
    etapa: 4,
    relogio: "+6 h",
    fala: [
      "Última etapa: a saída. A excreção.",
      "Cada rim tem cerca de um milhão de filtrinhos, os néfrons, que filtram o sangue o tempo todo.",
      "A etiqueta que o fígado colocou faz o remédio escapar pelo filtro. Ele vai para a bexiga e sai no xixi.",
    ],
  },
  {
    de: 335,
    ate: 350,
    etapa: 4,
    relogio: "+24 h",
    fala: ["A cada duas a três horas, mais ou menos, a quantidade no sangue cai pela metade: é a meia-vida.", "E em cerca de um dia, quase tudo já saiu do corpo."],
  },
  {
    de: 350,
    ate: 385,
    etapa: 5,
    fala: [
      "Recapitulando: se desmancha no estômago, é absorvido no intestino, passa pela alfândega do fígado,",
      "se espalha pelo corpo, é transformado no fígado e sai pelos rins.",
      "Cada remédio faz essa viagem do seu jeito: por isso uns são de oito em oito horas, outros uma vez por dia.",
      "Me conta nos comentários: qual remédio você quer ver fazendo essa viagem no próximo vídeo?",
    ],
  },
  { de: 385, ate: 391, etapa: 6, fala: [] },
  { de: 391, ate: 395, etapa: 7, fala: [] },
];
const R = (i: number) => [s(PARTES[i].de), s(PARTES[i].ate)] as const;
const ativa = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];
const ETAPAS = ["ABSORÇÃO", "DISTRIBUIÇÃO", "METABOLISMO", "EXCREÇÃO"];
const COR_ETAPA = [N.azul, N.neon, N.ambar, "#f472b6"];

// ---------- painel fixo: as 4 etapas e o relógio da viagem ----------
const Hud: React.FC<{ f: number }> = ({ f }) => {
  const i = PARTES.findIndex((_, k) => ativa(f, k));
  if (i < 0) return null;
  const p = PARTES[i];
  if (p.etapa < 1 || p.etapa > 4) return null;
  const k = P(f, s(40), s(40) + 15);
  return (
    <div style={{ position: "absolute", top: 130, left: 40, right: 40, opacity: k }}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {ETAPAS.map((e, n) => {
          const on = n + 1 === p.etapa;
          const feito = n + 1 < p.etapa;
          const cor = COR_ETAPA[n];
          return (
            <div
              key={e}
              style={{
                fontFamily: VT,
                fontSize: on ? 30 : 24,
                padding: "6px 14px",
                borderRadius: 10,
                color: on ? "#050607" : feito ? cor : N.cinza,
                background: on ? cor : rgba(cor, feito ? 0.12 : 0.04),
                border: `2px solid ${on ? cor : rgba(cor, feito ? 0.5 : 0.2)}`,
                boxShadow: on ? `0 0 24px ${rgba(cor, 0.6)}` : "none",
              }}
            >
              {feito ? "✓ " : `${n + 1} `}
              {e}
            </div>
          );
        })}
      </div>
      {p.relogio && (
        <div style={{ position: "absolute", right: 10, top: 66, fontFamily: VT, fontSize: 36, color: N.ambar, border: `2px solid ${rgba(N.ambar, 0.6)}`, padding: "2px 14px", borderRadius: 8 }}>
          ⏱ {p.relogio}
        </div>
      )}
    </div>
  );
};

// ---------- legenda provisória (texto do roteiro, distribuído pelo tempo da cena) ----------
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  const i = PARTES.findIndex((_, k) => ativa(f, k));
  if (i < 0 || !PARTES[i].fala.length) return null;
  const [a, b] = R(i);
  const frases = PARTES[i].fala;
  const pesos = frases.map((x) => x.split(" ").length);
  const tot = pesos.reduce((x, y) => x + y, 0);
  let acc = a;
  for (let n = 0; n < frases.length; n++) {
    const fim = acc + ((b - a) * pesos[n]) / tot;
    if (f < fim) {
      const k = Math.min(P(f, acc, acc + 8), 1 - P(f, fim - 6, fim));
      return (
        <div style={{ position: "absolute", top: 1110, left: 70, right: 70, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 46, lineHeight: 1.3, color: "#f2f2f2", opacity: k }}>
          {frases[n]}
          <div style={{ fontFamily: VT, fontSize: 22, color: N.cinza, marginTop: 14 }}>legenda provisória · prévia sem áudio</div>
        </div>
      );
    }
    acc = fim;
  }
  return null;
};

const Cena3D: React.FC<{ f: number; i: number; tipo: TipoViagem; marcos?: number[]; top?: number; h?: number; zoom?: number }> = ({ f, i, tipo, marcos, top = 230, h = 860, zoom = 1 }) => (
  <Sequence from={R(i)[0]} durationInFrames={R(i)[1] - R(i)[0]} layout="none">
    <div style={{ position: "absolute", left: 0, top, width: W, height: h, opacity: Math.min(P(f, R(i)[0], R(i)[0] + 12), 1 - P(f, R(i)[1] - 10, R(i)[1])) }}>
      <Viagem3D f={f} ini={R(i)[0]} tipo={tipo} marcos={marcos} h={h} zoom={zoom} />
    </div>
  </Sequence>
);

// ---------- mapa do corpo (abertura e recapitulação): o caminho acende órgão por órgão ----------
const ORGAOS: { nome: string; x: number; y: number; r: number; cor: string; etapa: number; lado: 1 | -1 }[] = [
  { nome: "boca", x: 540, y: 125, r: 14, cor: "#f2f2f2", etapa: 1, lado: 1 },
  { nome: "estômago", x: 600, y: 400, r: 40, cor: "#fb7185", etapa: 1, lado: 1 },
  { nome: "intestino", x: 540, y: 620, r: 52, cor: "#f472b6", etapa: 1, lado: 1 },
  { nome: "fígado", x: 465, y: 415, r: 46, cor: "#b45309", etapa: 1, lado: -1 },
  { nome: "coração", x: 560, y: 290, r: 34, cor: "#dc2626", etapa: 2, lado: 1 },
  { nome: "cérebro", x: 540, y: 65, r: 40, cor: "#f9a8d4", etapa: 2, lado: 1 },
  { nome: "fígado", x: 465, y: 415, r: 46, cor: "#f59e0b", etapa: 3, lado: -1 },
  { nome: "rins", x: 620, y: 520, r: 26, cor: "#9a3412", etapa: 4, lado: 1 },
  { nome: "bexiga", x: 540, y: 745, r: 28, cor: "#fde047", etapa: 4, lado: 1 },
];
const MapaCorpo: React.FC<{ f: number; ini: number; dur: number }> = ({ f, ini, dur }) => {
  const prog = it(f, ini + 15, ini + dur * 0.8, 0, ORGAOS.length, OUT);
  const pts = ORGAOS.map((o) => `${o.x},${o.y}`).join(" ");
  const etapaAtual = ORGAOS[Math.min(ORGAOS.length - 1, Math.floor(prog))]?.etapa ?? 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 260, width: W, height: 860 }}>
      <svg width={W} height={860} viewBox="0 0 1080 860">
        {/* silhueta */}
        <g fill="none" stroke={rgba("#ffffff", 0.25)} strokeWidth={4}>
          <circle cx={540} cy={90} r={70} />
          <path d="M 470 165 L 610 165 Q 700 190 700 300 L 680 640 Q 660 760 600 800 L 480 800 Q 420 760 400 640 L 380 300 Q 380 190 470 165 Z" />
          <path d="M 395 230 L 300 520 M 685 230 L 780 520" />
        </g>
        <polyline points={pts} fill="none" stroke={rgba(N.neon, 0.15)} strokeWidth={6} strokeDasharray="10 12" />
        <polyline points={pts} fill="none" stroke={N.neon} strokeWidth={6} pathLength={ORGAOS.length - 1} strokeDasharray={`${Math.max(0, prog - 1)} ${ORGAOS.length}`} style={{ filter: `drop-shadow(0 0 8px ${N.neon})` }} />
        {ORGAOS.map((o, n) => {
          const on = prog >= n + 0.5;
          return (
            <g key={n} opacity={on ? 1 : 0.3}>
              <circle cx={o.x} cy={o.y} r={o.r} fill={rgba(o.cor, on ? 0.55 : 0.15)} stroke={o.cor} strokeWidth={3} />
              {on && n !== 6 && (
                <text x={o.x + o.lado * (o.r + 14)} y={o.y + 10} textAnchor={o.lado > 0 ? "start" : "end"} fontFamily={SANS} fontWeight={700} fontSize={30} fill={N.txt}>
                  {o.nome}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 40, top: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {ETAPAS.map((e, n) => (
          <div key={e} style={{ fontFamily: VT, fontSize: 30, color: n + 1 <= etapaAtual ? COR_ETAPA[n] : rgba(N.cinza, 0.5), opacity: P(f, ini + 20 + n * 25, ini + 32 + n * 25) }}>
            {n + 1}. {e}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- gráficos ----------
const GraficoPico: React.FC<{ f: number; ini: number }> = ({ f, ini }) => {
  const k = it(f, ini + 10, ini + 200, 0, 1, OUT);
  const pts = Array.from({ length: 61 }, (_, n) => {
    const x = n / 60; // 0 a 3 h
    const h = x < 0.25 ? x / 0.25 : Math.exp(-(x - 0.25) * 2.2);
    return [120 + x * 840, 760 - h * 460] as const;
  }).filter((_, n) => n / 60 <= k);
  return (
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <line x1={120} y1={760} x2={980} y2={760} stroke={N.cinza} strokeWidth={3} />
      <line x1={120} y1={760} x2={120} y2={260} stroke={N.cinza} strokeWidth={3} />
      <text x={120} y={810} fontFamily={VT} fontSize={30} fill={N.cinza}>
        0
      </text>
      <text x={890} y={810} fontFamily={VT} fontSize={30} fill={N.cinza}>
        3 h
      </text>
      <text x={140} y={250} fontFamily={VT} fontSize={30} fill={N.cinza}>
        remédio no sangue
      </text>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={N.neon} strokeWidth={8} style={{ filter: `drop-shadow(0 0 10px ${N.neon})` }} />
      {k > 0.3 && (
        <g opacity={P(f, ini + 90, ini + 110)}>
          <line x1={330} y1={300} x2={330} y2={760} stroke={N.ambar} strokeWidth={3} strokeDasharray="10 8" />
          <text x={350} y={330} fontFamily={SANS} fontWeight={900} fontSize={44} fill={N.ambar}>
            PICO
          </text>
          <text x={350} y={378} fontFamily={VT} fontSize={32} fill={N.txt}>
            30 a 60 min
          </text>
        </g>
      )}
    </svg>
  );
};
const GraficoMeiaVida: React.FC<{ f: number; ini: number }> = ({ f, ini }) => (
  <div style={{ position: "absolute", top: 330, left: 90, right: 90, display: "flex", alignItems: "flex-end", gap: 26, height: 480 }}>
    {[100, 50, 25, 12.5, 6].map((v, n) => (
      <div key={n} style={{ flex: 1, textAlign: "center", opacity: P(f, ini + 10 + n * 40, ini + 22 + n * 40) }}>
        <div style={{ fontFamily: VT, fontSize: 34, color: N.txt, marginBottom: 8 }}>{v}%</div>
        <div style={{ height: v * 3.6, background: `linear-gradient(${N.neon}, ${rgba(N.neon, 0.3)})`, borderRadius: 10, boxShadow: `0 0 20px ${rgba(N.neon, 0.4)}` }} />
        <div style={{ fontFamily: VT, fontSize: 26, color: N.cinza, marginTop: 10 }}>{n === 0 ? "pico" : `+${n} meia-vida`}</div>
      </div>
    ))}
  </div>
);

// ---------- cenas ----------
const Cenas: React.FC<{ f: number }> = ({ f }) => (
  <>
    {/* 0. abertura: o comprimido cai no copo */}
    <Cena3D f={f} i={0} tipo="copo" top={300} h={800} />
    {ativa(f, 0) && (
      <>
        <Titulo f={f} at={8} y={130} size={70}>
          O caminho do remédio
        </Titulo>
        <div style={{ position: "absolute", top: 225, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: N.neon, letterSpacing: 2, opacity: P(f, 30, 45), textShadow: `0 0 26px ${rgba(N.neon, 0.6)}` }}>
          DA BOCA ATÉ O XIXI
        </div>
        <Chip f={f} at={s(12)} cor={N.ambar} y={1010} centro>
          🤔 como ele sabe onde está a dor?
        </Chip>
      </>
    )}

    {/* 1. mapa da viagem */}
    {ativa(f, 1) && (
      <>
        <Titulo f={f} at={R(1)[0] + 4} y={130} size={62}>
          As 4 etapas da <Sel>farmacocinética</Sel>
        </Titulo>
        <MapaCorpo f={f} ini={R(1)[0]} dur={R(1)[1] - R(1)[0]} />
      </>
    )}

    {/* 2. estômago */}
    <Cena3D f={f} i={2} tipo="estomago" marcos={[s(62)]} />
    {ativa(f, 2) && (
      <>
        <Chip f={f} at={s(43)} cor={N.verm} x={70} y={300}>
          🧪 pH ácido
        </Chip>
        <Chip f={f} at={s(52)} cor={N.azul} y={1000} centro>
          💧 precisa dissolver para funcionar
        </Chip>
        <Carimbo f={f} at={s(63)} texto="QUASE NÃO ABSORVE AQUI" cor={N.ambar} x={540} y={880} size={50} />
      </>
    )}

    {/* 3. intestino */}
    <Cena3D f={f} i={3} tipo="intestino" />
    {ativa(f, 3) && (
      <>
        <Chip f={f} at={s(84)} cor="#f472b6" x={70} y={300}>
          🌊 vilosidades
        </Chip>
        <Chip f={f} at={s(94)} cor={N.verm} x={600} y={300}>
          🩸 entra no sangue
        </Chip>
        <Chip f={f} at={s(104)} cor={N.ambar} y={1000} centro>
          🍽️ estômago cheio = efeito mais lento
        </Chip>
        <Carimbo f={f} at={s(113)} texto="✓ ABSORÇÃO" cor={N.azul} x={540} y={900} size={60} />
      </>
    )}

    {/* 4. a alfândega do fígado (primeira passagem) */}
    <Cena3D f={f} i={4} tipo="figado" />
    {ativa(f, 4) && (
      <>
        <Chip f={f} at={s(124)} cor="#a78bfa" x={70} y={980}>
          ⬆ veia porta
        </Chip>
        <Carimbo f={f} at={s(133)} texto="🛃 ALFÂNDEGA" cor={N.ambar} x={540} y={330} size={64} />
        <Chip f={f} at={s(145)} cor="#facc15" x={560} y={980}>
          ⚠ uma parte fica aqui
        </Chip>
        <Chip f={f} at={s(158)} cor={N.azul} y={1050} centro>
          💉 por isso alguns são injetáveis ou sublinguais
        </Chip>
      </>
    )}

    {/* 5. distribuição: coração e circulação */}
    <Cena3D f={f} i={5} tipo="coracao" />
    {ativa(f, 5) && (
      <>
        <Chip f={f} at={s(180)} cor={N.verm} x={70} y={300}>
          ❤️ o coração espalha
        </Chip>
        <Chip f={f} at={s(188)} cor="#a78bfa" x={70} y={1000}>
          🟣 de carona na proteína
        </Chip>
        <Chip f={f} at={s(193)} cor={N.txt} x={620} y={1000}>
          ⚪ paracetamol: solto
        </Chip>
      </>
    )}
    {/* 6. barreira do cérebro */}
    <Cena3D f={f} i={6} tipo="cerebro" />
    {ativa(f, 6) && (
      <>
        <Chip f={f} at={s(202)} cor="#22d3ee" y={300} centro>
          🛡️ barreira do cérebro
        </Chip>
        <Chip f={f} at={s(208)} cor={N.neon} y={1000} centro>
          🤕 menos dor · 🌡️ menos febre
        </Chip>
      </>
    )}
    {/* 7. gráfico do pico */}
    {ativa(f, 7) && (
      <>
        <Titulo f={f} at={R(7)[0] + 4} y={240} size={60}>
          O pico no sangue
        </Titulo>
        <GraficoPico f={f} ini={R(7)[0]} />
      </>
    )}

    {/* 8. metabolismo: linha de produção no fígado */}
    <Cena3D f={f} i={8} tipo="metabolismo" marcos={[s(270)]} />
    {ativa(f, 8) && (
      <>
        <Chip f={f} at={s(245)} cor={N.neon} x={70} y={300}>
          🏷️ ganha uma etiqueta
        </Chip>
        <Chip f={f} at={s(252)} cor={N.azul} x={560} y={300}>
          💧 sai pela água
        </Chip>
        <Chip f={f} at={s(258)} cor={N.verm} x={70} y={1000}>
          ☠️ NAPQI (tóxico)
        </Chip>
        <Chip f={f} at={s(262)} cor={N.neon} x={560} y={1000}>
          🛡️ glutationa
        </Chip>
        <Carimbo f={f} at={s(272)} texto="DOSE ALTA" cor={N.verm} x={540} y={640} size={72} />
        <Carimbo f={f} at={s(290)} texto="RESPEITE A DOSE" cor={N.ambar} x={540} y={880} size={66} />
      </>
    )}

    {/* 9. excreção: rins e bexiga */}
    <Cena3D f={f} i={9} tipo="rim" top={330} h={760} zoom={0.85} />
    {ativa(f, 9) && (
      <>
        <Chip f={f} at={s(306)} cor="#f472b6" y={290} centro>
          🫘 ~1 milhão de filtros por rim
        </Chip>
        <Chip f={f} at={s(320)} cor={N.neon} x={560} y={1000}>
          🏷️ etiqueta = passa no filtro
        </Chip>
        <Chip f={f} at={s(326)} cor="#fde047" x={70} y={1000}>
          🚽 bexiga
        </Chip>
      </>
    )}
    {/* 10. meia-vida */}
    {ativa(f, 10) && (
      <>
        <Titulo f={f} at={R(10)[0] + 4} y={240} size={60}>
          Meia-vida: <Sel>~2 a 3 h</Sel>
        </Titulo>
        <GraficoMeiaVida f={f} ini={R(10)[0]} />
        <Chip f={f} at={s(345)} cor={N.ambar} y={900} centro>
          ⏱ em ~1 dia, quase tudo saiu
        </Chip>
      </>
    )}

    {/* 11. recapitulação + pergunta */}
    {ativa(f, 11) && (
      <>
        <Titulo f={f} at={R(11)[0] + 4} y={130} size={62}>
          A viagem completa
        </Titulo>
        {f < s(374) && <MapaCorpo f={f} ini={R(11)[0]} dur={s(22)} />}
        {f >= s(374) && (
          <>
            <Titulo f={f} at={s(374)} y={420} size={70}>
              Qual remédio na
              <br />
              próxima viagem?
            </Titulo>
            <Carimbo f={f} at={s(376)} texto="COMENTA AÍ! 👇" cor={N.ambar} x={540} y={780} size={64} />
          </>
        )}
      </>
    )}

    {/* 12. me siga */}
    {ativa(f, 12) && (
      <>
        <Img
          src={staticFile("mounjaroLotes/logo.jpg")}
          style={{
            position: "absolute",
            left: 540 - 160,
            top: 210,
            width: 320,
            height: 320,
            borderRadius: 160,
            border: `5px solid ${N.neon}`,
            boxShadow: `0 0 40px ${rgba(N.neon, 0.6)}`,
            opacity: P(f, R(12)[0], R(12)[0] + 10),
            transform: `scale(${0.7 + 0.3 * it(f, R(12)[0], R(12)[0] + 14, 0, 1, SNAP)})`,
          }}
        />
        <Titulo f={f} at={R(12)[0] + 4} y={560} size={110}>
          Me siga
        </Titulo>
        <div style={{ position: "absolute", top: 720, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: N.cinza, opacity: P(f, R(12)[0] + 14, R(12)[0] + 26) }}>
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área <span style={{ fontFamily: EMOJI }}>💊</span>
        </div>
      </>
    )}
    {/* 13. tela final */}
    {f >= R(13)[0] && (
      <div style={{ position: "absolute", top: 760, left: 80, width: 920, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 70, lineHeight: 1.35, color: "#f2f2f2", opacity: it(f, R(13)[0], R(13)[0] + 14, 0, 1, OUT) }}>
        Consulte um <Sel>profissional de saúde</Sel> para orientações.
      </div>
    )}
  </>
);

export const VideoCaminhoRemedio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <Cenas f={f} />
      <Hud f={f} />
      <Legenda f={f} />
    </AbsoluteFill>
  );
};
