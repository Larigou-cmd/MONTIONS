// Demonstração do Modelo 10 · "Corpo aceso" (Id "Modelo10Demo", 36 s, sem som).
// Trechos do roteiro "Parou a caneta e o peso voltou?" (roteiros/caneta_parou_peso_voltou.md), só para testar o visual.
// A legenda aqui usa tempos de exemplo; no vídeo de verdade ela vem do fala.json da narração.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CartoesFinais } from "../estiloEtiquetas/kit";
import { P, W } from "../lib";
import {
  Camera,
  COR10,
  Corpo,
  Etiqueta10,
  frasesDeTexto,
  Fundo10,
  GraficoPeso,
  Legenda10,
  Numero10,
  PilulasSobe,
  PONTOS,
  Titulo10,
} from "./kit";

export const DURATION_MODELO10_DEMO = 1080;

// câmera do corpo: [quadro, zoom, centroX, centroY]
const CAM: [number, number, number, number][] = [
  [150, 0.62, 540, 1080],
  [175, 0.72, 540, 1080],
  [420, 0.72, 540, 1080],
  [470, 1.7, 610, 1000],
  [560, 1.7, 610, 1000],
  [600, 0.72, 540, 1080],
];
// posição na tela de um ponto do desenho, com a câmera do quadro f
const naTela = (f: number, [x, y]: [number, number]): [number, number] => {
  let a = CAM[0],
    b = CAM[0];
  for (let i = 0; i < CAM.length; i++)
    if (f >= CAM[i][0]) {
      a = CAM[i];
      b = CAM[i + 1] ?? CAM[i];
    }
  const t =
    b[0] === a[0] ? 0 : Math.min(1, Math.max(0, (f - a[0]) / (b[0] - a[0])));
  const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  const z = a[1] + (b[1] - a[1]) * e,
    cx = a[2] + (b[2] - a[2]) * e,
    cy = a[3] + (b[3] - a[3]) * e;
  return [W / 2 + (x - cx) * z, 960 + (y - cy) * z];
};

const FRASES = [
  ...frasesDeTexto(
    "Você parou a caneta, a balança começou a subir de novo e você se culpou?",
    8,
    8,
  ),
  ...frasesDeTexto(
    "Enquanto você usa, a caneta imita um hormônio do intestino, o GLP-1. Ele avisa o cérebro: já tá cheio.",
    165,
    9,
  ),
  ...frasesDeTexto("E faz o estômago esvaziar mais devagar.", 440, 12),
  ...frasesDeTexto(
    "Quando você para, esse aviso vai embora. E o corpo aumenta o hormônio da fome.",
    585,
    10,
  ),
  ...frasesDeTexto(
    "Quem parou recuperou cerca de dois terços do peso perdido em um ano.",
    790,
    9,
  ),
  ...frasesDeTexto(
    "E a pressão, a glicose e o colesterol pioraram de novo.",
    880,
    7,
  ),
];
const CHAVES = [
  "caneta,",
  "culpou?",
  "glp-1.",
  "cérebro:",
  "cheio.",
  "estômago",
  "devagar.",
  "embora.",
  "fome.",
  "terços",
  "pressão,",
  "glicose",
  "colesterol",
];

export const Modelo10Demo: React.FC = () => {
  const f = useCurrentFrame();
  const corpoOp = Math.min(P(f, 150, 170), 1 - P(f, 770, 790));
  const [ix, iy] = naTela(f, PONTOS.intestino);
  const [cx, cy] = naTela(f, PONTOS.cerebro);
  const [ex, ey] = naTela(f, PONTOS.estomago);
  return (
    <AbsoluteFill>
      <Fundo10 f={f} grade={1 - 0.6 * corpoOp} />

      {/* 1 · gancho: o gráfico do peso desce e volta a subir */}
      <Titulo10
        f={f}
        at={4}
        ate={150}
        partes={[["A BALANÇA "], ["SUBIU", COR10.LIMAO], [" DE NOVO?"]]}
        sub="parou a caneta"
      />
      <GraficoPeso f={f} at={10} ate={150} y={640} />
      <Etiqueta10
        f={f}
        at={58}
        ate={150}
        texto="parou aqui"
        px={583}
        py={640 + 292}
        lx={430}
        ly={1180}
        cor={COR10.LIMAO}
      />

      {/* 2 a 4 · o corpo aceso */}
      {corpoOp > 0 && (
        <Camera f={f} chaves={CAM}>
          <Corpo
            f={f}
            opacity={corpoOp}
            caminho={P(f, 185, 265)}
            cerebroAceso={P(f, 262, 285) * (1 - P(f, 585, 640))}
            estomago={P(f, 440, 460) * (1 - P(f, 560, 590))}
            apaga={P(f, 585, 640)}
            fome={P(f, 660, 690)}
          />
        </Camera>
      )}
      <Titulo10
        f={f}
        at={170}
        ate={420}
        partes={[["O AVISO DE "], ["SACIEDADE", COR10.NEON]]}
        sub="GLP-1 · hormônio do intestino"
      />
      <Etiqueta10
        f={f}
        at={190}
        ate={415}
        texto="intestino solta GLP-1"
        px={ix}
        py={iy}
        lx={ix - 120}
        ly={iy + 190}
      />
      <Etiqueta10
        f={f}
        at={268}
        ate={415}
        texto="já tá cheio"
        px={cx}
        py={cy}
        lx={cx + 190}
        ly={cy - 10}
      />

      <Titulo10
        f={f}
        at={430}
        ate={575}
        partes={[["ESVAZIA "], ["DEVAGAR", COR10.NEON]]}
        sub="estômago"
      />
      <Etiqueta10
        f={f}
        at={474}
        ate={570}
        texto="estômago"
        px={ex}
        py={ey}
        lx={ex + 170}
        ly={ey + 250}
      />

      <Titulo10
        f={f}
        at={585}
        ate={655}
        partes={[["O AVISO "], ["APAGA", COR10.VERM]]}
        sub="sem a caneta"
      />
      <Titulo10
        f={f}
        at={660}
        ate={780}
        partes={[["O CORPO "], ["PEDE", COR10.LARANJA], [" DE VOLTA"]]}
        sub="mais fome · menos gasto"
      />
      <Etiqueta10
        f={f}
        at={690}
        ate={775}
        texto="hormônio da fome"
        px={ex + 10}
        py={ey - 120}
        lx={ex + 120}
        ly={ey - 260}
        cor={COR10.LARANJA}
      />

      {/* 5 · os números */}
      <Titulo10
        f={f}
        at={790}
        ate={960}
        partes={[["EM "], ["1 ANO", COR10.LIMAO]]}
        sub="quem parou a caneta"
      />
      <Numero10
        f={f}
        at={796}
        ate={960}
        numero="2/3"
        texto={"do peso perdido\nvoltou"}
        y={560}
      />
      <PilulasSobe
        f={f}
        at={880}
        ate={960}
        itens={["pressão", "glicose", "colesterol"]}
        y={1080}
      />

      {/* 6 · cartões finais */}
      {f >= 960 && (
        <CartoesFinais
          f={f}
          at={962}
          itens={[
            ["salvar", "Salva ", "pra quando for parar"],
            ["enviar", "Manda ", "pra quem usa a caneta"],
            ["comentar", "Comenta ", "o que mais você quer saber"],
          ]}
          y={560}
        />
      )}

      {f < 960 && <Legenda10 f={f} frases={FRASES} chaves={CHAVES} />}
    </AbsoluteFill>
  );
};
