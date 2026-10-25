import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { Bolha, CardResposta, Fundo, Logo, PIXEL, TINTA, VERDE } from "./ui";

// Carrossel de fotos para o feed do Instagram (1080×1350, 4:5) com o mesmo conteúdo do comercial Farma.exe.
// Cada quadro da composição é uma foto: 0 = capa, 1–3 = as dúvidas, 4 = convite para comentar.
const TOTAL = 5;

const Marca: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: "#fde68a", borderRadius: 6, padding: "0 4px" }}>{children}</span>
);

const Rodape: React.FC<{ n: number }> = ({ n }) => (
  <>
    <div style={{ position: "absolute", bottom: 60, left: 70, fontFamily: PIXEL, fontSize: 22, color: TINTA, opacity: 0.6 }}>
      {n}/{TOTAL}
    </div>
    {n < TOTAL && (
      <div style={{ position: "absolute", bottom: 52, right: 70, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: VERDE }}>
        arrasta ➜
      </div>
    )}
  </>
);

const Duvida: React.FC<{ n: number; pergunta: string; titulo: string; itens: { icone: string; txt: React.ReactNode }[] }> = ({ n, pergunta, titulo, itens }) => (
  <>
    <Logo y={110} size={56} at={-200} cursor={false} />
    <div style={{ position: "absolute", top: 210, left: 70, right: 70, display: "flex", flexDirection: "column", transform: "scale(1.4)", transformOrigin: "top right" }}>
      <Bolha at={-30} dela texto={pergunta} hora="14:02" />
    </div>
    <CardResposta at={-30} y={830} titulo={titulo} itens={itens.map((it) => ({ ...it, at: -30 }))} />
    <Rodape n={n} />
  </>
);

export const FarmaCarrossel: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo />
      {f === 0 && (
        <>
          <Logo y={170} size={76} at={-200} cursor={false} />
          <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: TINTA }}>
            Tem dúvida
            <br />
            de <span style={{ color: VERDE }}>remédio</span>?
          </div>
          <Img
            src={staticFile("farmaexe/avatar.png")}
            style={{ position: "absolute", left: 540 - 200, top: 470, width: 400, height: 400, borderRadius: 200, boxShadow: `0 0 0 10px ${VERDE}, 0 30px 70px rgba(22,163,74,0.35)` }}
          />
          <div style={{ position: "absolute", top: 935, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 72, color: VERDE }}>
            Pergunte à Farmacêutica
          </div>
          <div style={{ position: "absolute", top: 1040, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 40, color: TINTA }}>
            3 dúvidas que todo mundo tem 💊
          </div>
          <Rodape n={1} />
        </>
      )}
      {f === 1 && (
        <Duvida
          n={2}
          pergunta="Esqueci a pílula ontem 😰 e agora?"
          titulo="Esqueceu a pílula?"
          itens={[
            { icone: "💊", txt: <>Tome assim que lembrar, <Marca>mesmo que sejam 2 no mesmo dia</Marca></> },
            { icone: "⏰", txt: "Siga no horário de sempre" },
            { icone: "⚠️", txt: <>Esqueceu 2 ou mais? <Marca>Use camisinha por 7 dias</Marca></> },
          ]}
        />
      )}
      {f === 2 && (
        <Duvida
          n={3}
          pergunta="Antibiótico corta o efeito do anticoncepcional? 🤔"
          titulo="Antibiótico corta a pílula?"
          itens={[
            { icone: "✅", txt: "A maioria dos antibióticos não corta o efeito" },
            { icone: "⚠️", txt: <>A exceção: <Marca>rifampicina</Marca> (e rifabutina, em menor grau)</> },
            { icone: "🛡️", txt: <>Com elas, <Marca>use outro método junto</Marca></> },
          ]}
        />
      )}
      {f === 3 && (
        <Duvida
          n={4}
          pergunta="Posso partir o comprimido pra engolir melhor? ✂️"
          titulo="Posso partir o comprimido?"
          itens={[
            { icone: "🤔", txt: "Depende do remédio" },
            { icone: "❌", txt: <>Liberação prolongada <Marca>não pode</Marca>: soltaria a dose toda de uma vez</> },
            { icone: "📸", txt: <>Na dúvida, <Marca>mostre a caixa</Marca> para o farmacêutico</> },
          ]}
        />
      )}
      {f === 4 && (
        <>
          <Logo y={200} size={76} at={-200} cursor={false} />
          <Img
            src={staticFile("farmaexe/avatar.png")}
            style={{ position: "absolute", left: 540 - 160, top: 300, width: 320, height: 320, borderRadius: 160, boxShadow: `0 0 0 8px ${VERDE}` }}
          />
          <div style={{ position: "absolute", top: 690, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 76, lineHeight: 1.1, color: TINTA }}>
            Qual é a <span style={{ color: VERDE }}>sua</span> dúvida?
          </div>
          <div style={{ position: "absolute", top: 820, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 42, color: TINTA }}>
            Deixa nos comentários 💬
            <br />
            que ela pode virar o próximo post
          </div>
          <div style={{ position: "absolute", top: 1030, left: 90, right: 90, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 30, color: "#475569" }}>
            Conteúdo educativo. Consulte um profissional de saúde para orientações.
          </div>
          <Rodape n={5} />
        </>
      )}
    </AbsoluteFill>
  );
};
