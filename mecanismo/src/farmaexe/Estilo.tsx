import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Bolha, CardResposta, Celular, Digitando, Fundo, Logo, VERDE } from "./ui";

// Foto de estilo para aprovação (antes da cena 1): quadro 0 = logo, 1 = chat, 2 = card de resposta.
export const FarmaEstilo: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Sequence from={0} durationInFrames={1}>
      <Logo y={900} at={-40} />
      <div style={{ position: "absolute", top: 1010, width: "100%", textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: 40, color: VERDE }}>
        Pergunte à Farmacêutica
      </div>
    </Sequence>
    <Sequence from={1} durationInFrames={1}>
      <Celular>
        <Bolha at={-20} dela texto="Oi! Posso tirar umas dúvidas de remédio?" hora="14:01" />
        <Bolha at={-20} texto="Claro, manda! 💊" hora="14:01" />
        <Bolha at={-20} dela texto="Esqueci a pílula ontem 😰 e agora?" hora="14:02" />
        <Digitando de={-20} ate={100} />
      </Celular>
    </Sequence>
    <Sequence from={2} durationInFrames={1}>
      <CardResposta
        at={-20}
        titulo="Esqueceu a pílula?"
        itens={[
          { at: -20, icone: "💊", txt: "Tome assim que lembrar, mesmo que sejam 2 no mesmo dia" },
          { at: -20, icone: "⏰", txt: "Siga no horário de sempre" },
          { at: -20, icone: "⚠️", txt: "Esqueceu 2 ou mais? Use camisinha por 7 dias" },
        ]}
      />
    </Sequence>
  </AbsoluteFill>
);
