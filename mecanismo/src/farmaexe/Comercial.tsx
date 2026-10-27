import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Easing } from "remotion";
import { OUT, SNAP, it } from "../lib";
import { SANS } from "../fonts";
import { Bolha, CardResposta, Celular, Digitando, Fundo, Logo, TINTA, VERDE, b } from "./ui";

// Comercial Farma.exe (Modelo 7), 9:16, 45 s a 120 bpm. Roteiro e mapa de som: roteiros/comercial_pergunte_farmaceutica.md.
// Tudo começa e termina numa batida: b(n) = quadro da batida n (15 quadros cada).
// As cenas são feitas uma por vez, com aprovação das fotos antes do render (sem som; o som entra no fim).
export const DURATION_FARMA = b(90);

// movimento de câmera: arranca devagar, acelera, freia; o borrão é máximo no meio
const SUAVE = Easing.bezier(0.65, 0, 0.35, 1);
const mov = (f: number, de: number, ate: number) => it(f, de, ate, 0, 1, SUAVE);
const borrao = (f: number, de: number, ate: number, max: number) =>
  f > de && f < ate ? Math.sin(Math.PI * ((f - de) / (ate - de))) * max : 0;

// idas e voltas da câmera entre o celular e o card de resposta: [vai, volta] em batidas
const PANS: [number, number][] = [
  [16, 24],
  [32, 40],
  [48, 56],
];
const panX = (f: number) =>
  PANS.reduce(
    (acc, [vai, volta]) =>
      acc + mov(f, b(vai), b(vai + 1)) - mov(f, b(volta), b(volta + 1)),
    0,
  );
const panBlur = (f: number) =>
  PANS.reduce(
    (acc, [vai, volta]) =>
      acc +
      borrao(f, b(vai), b(vai + 1), 12) +
      borrao(f, b(volta), b(volta + 1), 12),
    0,
  );

// câmera sobre o celular: posição, escala e borrão
const camCelular = (f: number) => {
  const entra = mov(f, b(4), b(6)); // b4→b6 o celular sobe da parte de baixo
  const zoom = mov(f, b(10), b(12)); // b10→b12 zoom no chat
  return {
    x: 540 - 1300 * panX(f),
    y: 2700 - (2700 - 1010) * entra + 1700 * mov(f, b(66), b(68)), // b66→b68 a câmera se afasta e o celular sai por baixo
    s: 1 + 0.32 * zoom - 0.6 * mov(f, b(66), b(68)),
    blur: borrao(f, b(4), b(6), 10) + borrao(f, b(10), b(12), 8) + panBlur(f) + borrao(f, b(66), b(68), 12),
  };
};

// marca-texto que passa por cima de um trecho na batida
const Marca: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const f = useCurrentFrame();
  const k = mov(f, at, at + 8);
  return (
    <span
      style={{
        backgroundImage: "linear-gradient(#fde68a, #fde68a)",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${k * 100}% 100%`,
        borderRadius: 6,
        padding: "0 4px",
      }}
    >
      {children}
    </span>
  );
};

// card que entra da direita quando a câmera vai e sai quando ela volta
const CardNaCamera: React.FC<{
  vai: number;
  volta: number;
  children: React.ReactNode;
}> = ({ vai, volta, children }) => {
  const f = useCurrentFrame();
  if (f < b(vai) || f > b(volta + 1)) return null;
  const x =
    1300 * (1 - mov(f, b(vai), b(vai + 1))) +
    1300 * mov(f, b(volta), b(volta + 1));
  const blur =
    borrao(f, b(vai), b(vai + 1), 12) + borrao(f, b(volta), b(volta + 1), 12);
  const flutua = Math.sin((f / b(2)) * Math.PI) * 8;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${x}px, ${flutua}px)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export const FarmaComercial: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camCelular(f);
  // logo: digita b0→b4 (uma letra a cada meia batida), sobe b4→b6, some no zoom b10→b12
  const sobe = mov(f, b(4), b(6));
  const some = mov(f, b(10), b(12));
  const flutua = Math.sin((f / b(2)) * Math.PI) * 6; // respira a cada 2 batidas
  // o chat rola para cima antes de cada pergunta nova (meia batida antes)
  const rolagem = 680 * mov(f, b(27), b(28)) + 395 * mov(f, b(43), b(44));
  return (
    <AbsoluteFill>
      <Fundo />
      {/* CENA 1 (0–6 s): logo e abertura do chat */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - some,
          transform: `translateY(${-90 * some}px)`,
        }}
      >
        <Logo
          y={900 - 690 * sobe + flutua * (1 - sobe)}
          size={92 - 30 * sobe}
          at={b(0)}
          passo={b(0.5)}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: cam.blur > 0.3 ? `blur(${cam.blur}px)` : undefined,
        }}
      >
        <Celular x={cam.x} y={cam.y + flutua * 0.5} s={cam.s}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, transform: `translateY(${-rolagem}px)` }}>
          <Bolha
            at={b(6)}
            dela
            texto="Oi! Posso tirar umas dúvidas de remédio?"
            hora="14:01"
          />
          <Digitando de={b(7)} ate={b(9)} />
          <Bolha at={b(9)} texto="Claro, manda! 💊" hora="14:01" />
          {/* CENA 2 (6–14 s): a pílula esquecida */}
          <Bolha
            at={b(12)}
            dela
            texto="Esqueci a pílula ontem 😰 e agora?"
            hora="14:02"
          />
          <Digitando de={b(14)} ate={b(16)} />
          <Bolha
            at={b(26)}
            texto="Tome assim que lembrar e siga no horário 💊 Esqueceu 2 ou mais? Camisinha por 7 dias ✅"
            hora="14:02"
          />
          {/* CENA 3 (14–22 s): antibiótico e anticoncepcional */}
          <Bolha
            at={b(28)}
            dela
            texto="Antibiótico corta o efeito do anticoncepcional? 🤔"
            hora="14:03"
          />
          <Digitando de={b(30)} ate={b(32)} />
          <Bolha
            at={b(42)}
            texto="A maioria não corta ✅ A exceção é a rifampicina (e a rifabutina): com elas, use outro método junto 🛡️"
            hora="14:03"
          />
          {/* CENA 4 (22–30 s): partir o comprimido */}
          <Bolha
            at={b(44)}
            dela
            texto="Posso partir o comprimido pra engolir melhor? ✂️"
            hora="14:04"
          />
          <Digitando de={b(46)} ate={b(48)} />
          <Bolha
            at={b(58)}
            texto="Depende! Liberação prolongada não pode ser partida ❌ Me manda a foto da caixa que eu confiro 📸"
            hora="14:04"
          />
          {/* CENA 5 (30–38 s): pronto e o agradecimento */}
          <Bolha at={b(60)} texto="Pronto." hora="14:05" />
          <Bolha at={b(62)} dela texto="Obrigada!! ❤️" hora="14:05" />
          </div>
        </Celular>
      </div>
      <CardNaCamera vai={16} volta={24}>
        <CardResposta
          at={b(16)}
          titulo="Esqueceu a pílula?"
          itens={[
            {
              at: b(17),
              icone: "💊",
              txt: (
                <>
                  Tome assim que lembrar,{" "}
                  <Marca at={b(22)}>mesmo que sejam 2 no mesmo dia</Marca>
                </>
              ),
            },
            { at: b(19), icone: "⏰", txt: "Siga no horário de sempre" },
            {
              at: b(21),
              icone: "⚠️",
              txt: (
                <>
                  Esqueceu 2 ou mais?{" "}
                  <Marca at={b(23)}>Use camisinha por 7 dias</Marca>
                </>
              ),
            },
          ]}
        />
      </CardNaCamera>
      <CardNaCamera vai={32} volta={40}>
        <CardResposta
          at={b(32)}
          titulo="Antibiótico corta a pílula?"
          itens={[
            { at: b(33), icone: "✅", txt: "A maioria dos antibióticos não corta o efeito" },
            {
              at: b(35),
              icone: "⚠️",
              txt: (
                <>
                  A exceção: <Marca at={b(38)}>rifampicina</Marca> (e rifabutina, em menor grau)
                </>
              ),
            },
            {
              at: b(37),
              icone: "🛡️",
              txt: (
                <>
                  Com elas, <Marca at={b(39)}>use outro método junto</Marca>
                </>
              ),
            },
          ]}
        />
      </CardNaCamera>
      <CardNaCamera vai={48} volta={56}>
        <CardResposta
          at={b(48)}
          titulo="Posso partir o comprimido?"
          itens={[
            { at: b(49), icone: "🤔", txt: "Depende do remédio" },
            {
              at: b(51),
              icone: "❌",
              txt: (
                <>
                  Liberação prolongada <Marca at={b(54)}>não pode</Marca>: soltaria a dose toda de uma vez
                </>
              ),
            },
            {
              at: b(53),
              icone: "📸",
              txt: (
                <>
                  Manda a <Marca at={b(55)}>foto da caixa</Marca> que eu confiro
                </>
              ),
            },
          ]}
        />
      </CardNaCamera>
      <Coracao />
      <Assinatura />
      <TelaFinal />
    </AbsoluteFill>
  );
};

// coração que pula do agradecimento e bate na batida (b64→b66)
const Coracao: React.FC = () => {
  const f = useCurrentFrame();
  if (f < b(64) || f > b(67)) return null;
  const k = it(f, b(64), b(64.6), 0, 1, SNAP);
  const bate = 1 + 0.15 * Math.max(0, Math.cos(((f - b(64)) / b(1)) * Math.PI * 2));
  const sai = mov(f, b(66), b(67));
  return (
    <div style={{ position: "absolute", left: 640, top: 1180 - 200 * k, transform: `translate(-50%,-50%) scale(${k * bate * (1 - sai)})`, fontFamily: "'Noto Color Emoji', sans-serif", fontSize: 260 }}>
      ❤️
    </div>
  );
};

// assinatura: logo FARMA.EXE e "Pergunte à Farmacêutica" (b68), frase (b72); sobe na tela final (b76→b77)
const Assinatura: React.FC = () => {
  const f = useCurrentFrame();
  if (f < b(68)) return null;
  const k = it(f, b(68), b(69), 0, 1, SNAP);
  const sobe = mov(f, b(76), b(77));
  const flutua = Math.sin((f / b(2)) * Math.PI) * 6;
  const linha = (at: number) => it(f, at, at + 10, 0, 1, OUT);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-470 * sobe + flutua}px) scale(${1 - 0.25 * sobe})` }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.4) }}>
        <Logo y={860} size={100} at={b(68) - 200} />
      </div>
      <div style={{ position: "absolute", top: 960, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 52, color: VERDE, opacity: linha(b(69)), transform: `translateY(${(1 - linha(b(69))) * 30}px)` }}>
        Pergunte à Farmacêutica
      </div>
      <div style={{ position: "absolute", top: 1060, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: TINTA, opacity: linha(b(72)) * (1 - sobe), transform: `translateY(${(1 - linha(b(72))) * 30}px)` }}>
        Tire suas dúvidas com quem entende de remédio 💊
      </div>
    </div>
  );
};

// tela final (b76–b90): uma linha por batida
const TelaFinal: React.FC = () => {
  const f = useCurrentFrame();
  if (f < b(76)) return null;
  const linhas = ["Consulte um", "profissional de saúde", "para orientações."];
  return (
    <>
      {linhas.map((l, i) => {
        const k = it(f, b(76 + i), b(76 + i) + 10, 0, 1, OUT);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 820 + i * 110,
              width: "100%",
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: i === 1 ? 800 : 600,
              fontSize: i === 1 ? 84 : 70,
              color: i === 1 ? VERDE : TINTA,
              opacity: k,
              transform: `translateY(${(1 - k) * 40}px)`,
            }}
          >
            {l}
          </div>
        );
      })}
    </>
  );
};
