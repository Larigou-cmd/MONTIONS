import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { Garra3D, faseEmT, forcaEm, tf } from "./Garra3D";
import fala from "./fala.json";

// "Máquina de pegar bichinho" — @historicodebusca. 3D low-poly, formato "desmontar".
// Narração Nassif (71,4 s), áudio com 0,3 s de atraso.

export const DURACAO_GARRA = tf(71.3) + 30;
const PALAVRAS = fala as [string, number, number][];

const pop = (f: number, ini: number, dur = 7) => {
  if (f < ini) return 0;
  const k = (f - ini) / dur;
  if (k >= 1) return 1;
  return 0.55 + 0.45 * k + 0.22 * Math.sin(k * Math.PI);
};
const contorno = (px: number) =>
  `${px}px ${px}px 0 #111, -${px}px ${px}px 0 #111, ${px}px -${px}px 0 #111, -${px}px -${px}px 0 #111, 0 ${px}px 0 #111, 0 -${px}px 0 #111, ${px}px 0 0 #111, -${px}px 0 0 #111, 0 ${px * 2}px 0 #111`;

const LegendaPalavra: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30 - 0.3;
  let i = -1;
  for (let k = 0; k < PALAVRAS.length; k++) if (PALAVRAS[k][1] <= t) i = k;
  if (i < 0) return null;
  const [w, ini, fim] = PALAVRAS[i];
  const prox = PALAVRAS[i + 1]?.[1] ?? fim + 0.6;
  if (t > Math.min(prox, fim + 0.5)) return null;
  const s = pop(f, tf(ini), 4);
  const limpa = w.replace(/[.,!?…]+$/g, "");
  const destaque =
    /\d|garra|fraca|propósito|solta|eletroímã|ímã|energia|placa|cérebro|segredo|lucro|bichinho|total|vez|vidro|prêmio|zé|pegou/i.test(
      limpa,
    );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1320,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 104,
        color: destaque ? "#ffd21f" : "#fff",
        textShadow: contorno(5),
        transform: `scale(${s})`,
        letterSpacing: "-0.01em",
      }}
    >
      {limpa.charAt(0).toUpperCase() + limpa.slice(1)}
    </div>
  );
};

const Chip: React.FC<{
  texto: string;
  ini: number;
  fim?: number;
  cor?: string;
  y?: number;
  x?: number;
  tam?: number;
  fundo?: string;
  rot?: number;
}> = ({
  texto,
  ini,
  fim = 1e9,
  cor = "#111",
  y = 420,
  x,
  tam = 50,
  fundo = "#fff",
  rot = -2,
}) => {
  const f = useCurrentFrame();
  if (f < ini || f > fim) return null;
  const caixa = (
    <div
      style={{
        transform: `scale(${pop(f, ini)}) rotate(${rot}deg)`,
        background: fundo,
        color: cor,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: tam,
        padding: "14px 30px",
        borderRadius: 18,
        border: "6px solid #111",
        boxShadow: "8px 8px 0 #111",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
  if (x !== undefined)
    return <div style={{ position: "absolute", left: x, top: y }}>{caixa}</div>;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {caixa}
    </div>
  );
};

const Titulo: React.FC<{
  linhas: string[];
  ini: number;
  fim: number;
  y?: number;
  tam?: number;
}> = ({ linhas, ini, fim, y = 330, tam = 92 }) => {
  const f = useCurrentFrame();
  if (f < ini || f > fim) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: tam,
        lineHeight: 1.05,
        color: "#fff",
        textShadow: contorno(5),
        transform: `scale(${pop(f, ini, 8)})`,
      }}
    >
      {linhas.map((l, i) => (
        <div
          key={i}
          style={{ color: i === linhas.length - 1 ? "#ffd21f" : "#fff" }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

// medidor de energia do eletroímã
const Medidor: React.FC<{ ini: number; fim: number }> = ({ ini, fim }) => {
  const f = useCurrentFrame();
  if (f < ini || f > fim) return null;
  const t = f / 30 - 0.3;
  const v = forcaEm(t);
  const total = v >= 0.99;
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        right: 140,
        top: 560,
        transform: `scale(${pop(f, ini)})`,
        fontFamily: SANS,
        fontWeight: 900,
      }}
    >
      <div
        style={{
          fontSize: 40,
          color: "#fff",
          textShadow: contorno(3),
          marginBottom: 10,
        }}
      >
        ENERGIA NO ÍMÃ
      </div>
      <div
        style={{
          height: 56,
          border: "6px solid #111",
          borderRadius: 14,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${v * 100}%`,
            background: total ? "#ffb800" : v > 0.6 ? "#ff9a2e" : "#9aa3ad",
          }}
        />
      </div>
    </div>
  );
};

// os três números que o dono digita
const Campos: React.FC = () => {
  const f = useCurrentFrame();
  const itens = [
    { rot: "JOGADA", v: "R$ 5", ini: tf(37.98), cor: "#7fd0ff" },
    { rot: "BICHINHO", v: "R$ 25", ini: tf(39.44), cor: "#ff8fb8" },
    { rot: "LUCRO", v: "R$ ???", ini: tf(40.94), cor: "#b6e36b" },
  ];
  if (f < tf(37.98) || f > tf(44.8)) return null;
  const calc = f >= tf(42.68);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 520 }}>
      {itens.map((it, i) =>
        f >= it.ini ? (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 22,
              transform: `scale(${pop(f, it.ini)})`,
              background: "#14261c",
              border: "6px solid #111",
              borderRadius: 16,
              padding: "14px 28px",
              boxShadow: "8px 8px 0 #111",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 54,
            }}
          >
            <span style={{ color: it.cor }}>{it.rot}</span>
            <span
              style={{ color: "#e9ffe9", fontVariantNumeric: "tabular-nums" }}
            >
              {it.v}
            </span>
          </div>
        ) : null,
      )}
      {calc ? (
        <div
          style={{
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 60,
            color: "#ffd21f",
            textShadow: contorno(4),
            transform: `scale(${pop(f, tf(42.68))})`,
          }}
        >
          = A MÁQUINA DECIDE
        </div>
      ) : null}
    </div>
  );
};

// contador de jogadas na sequência "fraca, fraca, fraca... forte"
const Contador: React.FC = () => {
  const f = useCurrentFrame();
  const ini = tf(44.82);
  if (f < ini || f > tf(53.93)) return null;
  const t = f / 30 - 0.3;
  const n =
    t < 47.3
      ? 1
      : t < 49.4
        ? 2
        : t < 52.3
          ? 3 + Math.floor(((t - 49.4) / 2.9) * 17)
          : 20;
  const forte = t >= 52.4;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 520,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${pop(f, ini)})`,
      }}
    >
      <div
        style={{
          background: forte ? "#ffb800" : "#fff",
          border: "6px solid #111",
          borderRadius: 18,
          boxShadow: "8px 8px 0 #111",
          padding: "12px 32px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 58,
          color: "#111",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        JOGADA {n} · {forte ? "FORÇA TOTAL" : "FRACA"}
      </div>
    </div>
  );
};

export const VideoGarra: React.FC<{ semAudio?: boolean }> = ({ semAudio }) => {
  const f = useCurrentFrame();
  const t = f / 30 - 0.3;
  const fase = faseEmT(t);
  const flash = [
    0, 4.26, 12.68, 21.28, 28.36, 35.28, 44.82, 53.94, 58.08, 66.06,
  ].some((c) => f >= tf(c) && f < tf(c) + 3);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6efe4" }}>
      {semAudio ? null : <Audio src={staticFile("garra/mix_final.wav")} />}
      <Garra3D f={f} />
      {flash ? (
        <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.55 }} />
      ) : null}

      <Titulo
        linhas={["VOCÊ NÃO É RUIM", "A GARRA É FRACA"]}
        ini={tf(0)}
        fim={tf(4.2)}
      />
      <Chip
        texto="DE PROPÓSITO"
        ini={tf(3.0)}
        fim={tf(4.2)}
        y={560}
        fundo="#ff3b30"
        cor="#fff"
        tam={60}
      />

      <Chip
        texto="PEGOU!"
        ini={tf(8.12)}
        fim={tf(10.6)}
        y={420}
        fundo="#2bd47a"
        tam={70}
      />
      <Chip
        texto="SOLTOU!"
        ini={tf(10.68)}
        fim={tf(12.6)}
        y={420}
        fundo="#ff3b30"
        cor="#fff"
        tam={70}
      />

      <Titulo
        linhas={["VAMOS ABRIR", "A MÁQUINA"]}
        ini={tf(12.68)}
        fim={tf(15.3)}
      />
      <Chip
        texto="TRILHOS: FRENTE · TRÁS · LADOS"
        ini={tf(15.36)}
        fim={tf(19.3)}
        y={420}
        tam={44}
        fundo="#ffcc22"
      />
      <Chip
        texto="FIO: DESCE E SOBE"
        ini={tf(19.38)}
        fim={tf(21.2)}
        y={420}
        tam={50}
        fundo="#ffcc22"
      />

      <Titulo
        linhas={["A GARRA É UM", "ELETROÍMÃ"]}
        ini={tf(21.28)}
        fim={tf(25.1)}
      />
      <Medidor ini={tf(21.76)} fim={tf(28.3)} />
      <Chip
        texto="MAIS ENERGIA = APERTA MAIS"
        ini={tf(25.16)}
        fim={tf(28.3)}
        y={380}
        tam={46}
        fundo="#ff9a2e"
      />

      <Titulo
        linhas={["QUEM CONTROLA?", "A PLACA"]}
        ini={tf(28.36)}
        fim={tf(35.2)}
      />
      <Chip
        texto="O CÉREBRO DA MÁQUINA"
        ini={tf(31.88)}
        fim={tf(35.2)}
        y={580}
        tam={46}
        fundo="#2bd47a"
      />
      <Chip
        texto="O SEGREDO"
        ini={tf(33.9)}
        fim={tf(35.2)}
        y={700}
        tam={50}
        fundo="#111"
        cor="#ffd21f"
      />

      <Titulo
        linhas={["O DONO DIGITA", "3 NÚMEROS"]}
        ini={tf(35.28)}
        fim={tf(44.8)}
        y={300}
        tam={80}
      />
      <Campos />

      <Contador />
      <Chip
        texto="PEGA… E SOLTA"
        ini={tf(47.86)}
        fim={tf(49.8)}
        y={660}
        tam={52}
        fundo="#ff3b30"
        cor="#fff"
      />
      <Chip
        texto="ENTROU DINHEIRO SUFICIENTE"
        ini={tf(50.46)}
        fim={tf(53.9)}
        y={660}
        tam={44}
        fundo="#fff"
      />

      <Titulo
        linhas={["NÃO É SÓ MIRA", "É A VEZ"]}
        ini={tf(53.94)}
        fim={tf(58.0)}
      />

      <Titulo
        linhas={["SE FOR JOGAR"]}
        ini={tf(58.08)}
        fim={tf(66.0)}
        y={300}
        tam={84}
      />
      <Chip
        texto="✔ BICHINHO SOLTO"
        ini={tf(60.28)}
        fim={tf(66.0)}
        y={430}
        x={90}
        tam={46}
        fundo="#2bd47a"
        rot={-3}
      />
      <Chip
        texto="✘ LONGE DO VIDRO"
        ini={tf(61.26)}
        fim={tf(66.0)}
        y={540}
        x={150}
        tam={46}
        fundo="#ff3b30"
        cor="#fff"
        rot={2}
      />
      <Chip
        texto="MUITO TEMPO SEM PRÊMIO?"
        ini={tf(62.6)}
        fim={tf(66.0)}
        y={650}
        x={70}
        tam={42}
        fundo="#ffcc22"
        rot={-2}
      />

      <Titulo
        linhas={["E VOCÊ?", "JÁ GANHOU ALGUMA?"]}
        ini={tf(66.06)}
        fim={tf(71.3) + 30}
        tam={72}
      />
      <Chip
        texto="COMENTA AÍ ↓"
        ini={tf(67.9)}
        y={600}
        tam={56}
        fundo="#ffcc22"
      />
      <Chip
        texto="SIGA @HISTORICODEBUSCA"
        ini={tf(68.94)}
        y={720}
        tam={46}
        fundo="#111"
        cor="#fff"
      />

      {fase !== "final" || t < 70.9 ? <LegendaPalavra /> : null}
    </AbsoluteFill>
  );
};

export const CapaGarra: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6efe4" }}>
      <Garra3D f={tf(1.3)} />
      <Titulo
        linhas={["POR QUE A GARRA", "SOLTA?"]}
        ini={-99}
        fim={1e9}
        y={330}
        tam={104}
      />
      <Chip
        texto="É DE PROPÓSITO"
        ini={-99}
        y={1350}
        fundo="#ff3b30"
        cor="#fff"
        tam={72}
      />
    </AbsoluteFill>
  );
};
