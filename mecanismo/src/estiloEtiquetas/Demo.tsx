// Demonstração de todas as peças do kit "Etiquetas verdes" (Id "EstiloEtiquetasDemo", 30 s, sem som).
// Serve para conferir o kit e como modelo de montagem. Textos são de exemplo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background, Grain, Part } from "../lib";
import {
  Abas,
  Aviso,
  Cabeca,
  Caneta,
  CartaoInfo,
  CartoesFinais,
  COR,
  EscudoGrande,
  Evolucao,
  G,
  Gota,
  LegendaPilula,
  LinhaDoTempo,
  ListaCartoes,
  montarFrases,
  NumeroGrande,
  Pele,
  ProximoEpisodio,
  SeloEpisodio,
  SY,
  TabelaGravaAi,
  TituloGigante,
} from "./kit";

const s = (x: number) => Math.round(x * 30);
export const DURATION_ETIQUETAS_DEMO = s(31);
const FALA = "Remédio por remédio. O que ele faz. Quando tomar. Como aplicar. O que não fazer. O que é esperado. Grava aí. Salva esse vídeo."
  .split(" ")
  .map((w, i) => ({ w, s: i * 1.35 }));
const FRASES = montarFrases(FALA, (x) => s(x));

export const EstiloEtiquetasDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background color={COR.NEON} pulses={[]} />
      <Part from={0} to={s(4)}>
        <TituloGigante f={f} at={0} sobre="REMÉDIO POR REMÉDIO · #1" nome="Nome" sub="classe do remédio" pilulas={["1x ao dia", "comprimido", "uso contínuo"]} />
      </Part>
      <Part from={s(4)} to={s(8)}>
        <Cabeca f={f} at={s(4)}>
          O que ele <G>faz</G>
        </Cabeca>
        <EscudoGrande f={f} at={s(4.2)} y={500} size={200} />
        <ListaCartoes f={f} y={800} itens={[{ at: s(5), texto: "Benefício principal", tipo: "escudo" }, { at: s(5.8), texto: "Segundo benefício", tipo: "escudo" }]} />
      </Part>
      <Part from={s(8)} to={s(12)}>
        <Cabeca f={f} at={s(8)}>
          Quando <G>tomar</G>
        </Cabeca>
        <LinhaDoTempo f={f} y={560} altura={420} marcos={[{ at: s(8.4), rotulo: "INDICAÇÃO", texto: "Ao acordar, em jejum" }, { at: s(9.6), rotulo: "ESPERE", texto: "30 a 60 minutos" }]} />
        <Aviso f={f} at={s(10.6)} y={1140} tipo="excecao" titulo="Exceção" texto="texto curto da exceção" />
      </Part>
      <Part from={s(12)} to={s(16)}>
        <NumeroGrande f={f} at={s(12)} numero="45°" rotulo="VIA SC" titulo="Subcutânea" detalhe="detalhe pequeno" />
        <Pele f={f} luz="gordura" luzK={1} rotulos={[["gordura", s(12.5)]]}>
          <Caneta x={760} y={SY + 110} ang={45} />
          <Gota x={760} y={SY + 110} k={1} />
        </Pele>
        <CartaoInfo f={f} at={s(13.5)} y={1330} campos={[["LOCAL", "braço ou coxa"]]} pilulas={["exemplo"]} />
      </Part>
      <Part from={s(16)} to={s(20)}>
        <Cabeca f={f} at={s(16)}>
          <span style={{ color: COR.VERM, fontSize: 26, letterSpacing: 3, display: "block" }}>CONTRAINDICAÇÕES</span>Antes de usar
        </Cabeca>
        <ListaCartoes
          f={f}
          y={560}
          itens={[
            { at: s(16.5), texto: "Não faça isso", tipo: "nao" },
            { at: s(17.1), texto: "Nem isso", tipo: "nao" },
            { at: s(17.9), texto: "Cuidado com isso", sub: "explicação curta", tipo: "cuidado" },
          ]}
        />
      </Part>
      <Part from={s(20)} to={s(23)}>
        <Cabeca f={f} at={s(20)}>
          Depois: o que é <G>esperado</G>
        </Cabeca>
        <Evolucao f={f} y={860} r={130} etapas={[{ at: s(20.4), rotulo: "Etapa 1" }, { at: s(21.1), rotulo: "Etapa 2" }, { at: s(21.8), rotulo: "Etapa 3" }]} />
      </Part>
      <Part from={s(23)} to={s(26.5)}>
        <Cabeca f={f} at={s(23)}>
          <G>Grava aí.</G>
        </Cabeca>
        <TabelaGravaAi f={f} at={s(23.3)} passo={18} linhas={[["QUANDO", "ao acordar"], ["COMO", "com água"], ["EVITE", "café junto"]]} />
      </Part>
      <Part from={s(26.5)} to={DURATION_ETIQUETAS_DEMO}>
        <CartoesFinais f={f} at={s(26.6)} y={420} />
        <ProximoEpisodio f={f} at={s(28)} numero="#2" titulo="Próximo" y={1000} />
      </Part>
      <SeloEpisodio f={f} at={s(4)} texto="#1 · NOME" />
      <Abas f={f} de={s(4)} ate={s(26.3)} abas={[["FAZ", s(4)], ["QUANDO", s(8)], ["COMO", s(12)], ["CUIDADOS", s(16)]]} />
      <LegendaPilula f={f} frases={FRASES} ate={s(26.5)} />
      <Grain />
    </AbsoluteFill>
  );
};
