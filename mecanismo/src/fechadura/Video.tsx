import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SANS } from "../fonts";
import fala from "./fala.json";

// "Por que só a sua chave abre a sua porta?" — @historicodebusca.
// Fundo renderizado no Blender (fechadura.blend), por cima legenda palavra por palavra e títulos.
// Narração Nassif (72,2 s), áudio com 0,3 s de atraso.

export const tf = (t: number) => Math.round((t + 0.3) * 30);
export const DURACAO_FECHADURA = tf(72.16) + 30;
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
    /\d|chave|porta|zé|vizinho|cilindro|pin|mola|trava|dente|altura|tamanho|certa|exata|linha|gira|errada|egito|madeira|yale|dezenove|mil/i.test(
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
  tam?: number;
  fundo?: string;
  rot?: number;
}> = ({
  texto,
  ini,
  fim = 1e9,
  cor = "#111",
  y = 420,
  tam = 50,
  fundo = "#fff",
  rot = -2,
}) => {
  const f = useCurrentFrame();
  if (f < ini || f > fim) return null;
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

const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30 - 0.3;
  const egito = t >= 55.36 && t < 60.38;
  return (
    <AbsoluteFill
      style={{
        filter: egito
          ? "sepia(0.75) contrast(1.15) brightness(0.92)"
          : undefined,
      }}
    >
      <OffthreadVideo src={staticFile("fechadura/blender.mp4")} muted />
    </AbsoluteFill>
  );
};

export const VideoFechadura: React.FC<{ semAudio?: boolean }> = ({
  semAudio,
}) => {
  const f = useCurrentFrame();
  const flash = [
    2.9, 7.54, 12.34, 18.8, 29.56, 34.34, 37.42, 51.52, 55.36, 60.38, 65.8,
  ].some((c) => f >= tf(c) && f < tf(c) + 3);
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {semAudio ? null : <Audio src={staticFile("fechadura/mix_final.wav")} />}
      <Fundo />
      {flash ? (
        <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.5 }} />
      ) : null}

      <Titulo
        linhas={["POR QUE SÓ A SUA CHAVE", "ABRE A SUA PORTA?"]}
        ini={tf(0)}
        fim={tf(2.9)}
        tam={80}
      />

      <Chip
        texto="CHAVE CERTA ✓"
        ini={tf(6.66)}
        fim={tf(7.5)}
        y={400}
        fundo="#2bd47a"
        tam={60}
      />
      <Chip
        texto="CHAVE DO VIZINHO"
        ini={tf(8.38)}
        fim={tf(10.4)}
        y={400}
        fundo="#ff9a2e"
        tam={56}
      />
      <Chip
        texto="NÃO GIRA ✗"
        ini={tf(10.46)}
        fim={tf(12.3)}
        y={400}
        fundo="#ff3b30"
        cor="#fff"
        tam={64}
      />

      <Titulo
        linhas={["VAMOS CORTAR", "AO MEIO"]}
        ini={tf(12.34)}
        fim={tf(15.2)}
      />
      <Chip
        texto="CILINDRO QUE GIRA"
        ini={tf(15.26)}
        fim={tf(17.8)}
        y={380}
        fundo="#ffcc22"
        tam={52}
      />
      <Chip
        texto="FILEIRA DE PINOS"
        ini={tf(17.84)}
        fim={tf(18.75)}
        y={380}
        fundo="#ffcc22"
        tam={52}
      />

      <Chip
        texto="PINO DE BAIXO"
        ini={tf(21.08)}
        fim={tf(22.0)}
        y={380}
        fundo="#ff3b30"
        cor="#fff"
        tam={56}
      />
      <Chip
        texto="PINO DE CIMA"
        ini={tf(22.08)}
        fim={tf(22.75)}
        y={380}
        fundo="#2f6fff"
        cor="#fff"
        tam={56}
      />
      <Chip
        texto="MOLA EMPURRA ↓"
        ini={tf(23.16)}
        fim={tf(25.5)}
        y={380}
        fundo="#fff"
        tam={56}
      />
      <Chip
        texto="SEM CHAVE = TRAVADO"
        ini={tf(25.58)}
        fim={tf(29.4)}
        y={380}
        fundo="#ff3b30"
        cor="#fff"
        tam={50}
      />

      <Titulo
        linhas={["CADA DENTE,", "UMA ALTURA"]}
        ini={tf(29.56)}
        fim={tf(34.3)}
      />
      <Chip
        texto="CADA PINO, UM TAMANHO"
        ini={tf(34.34)}
        fim={tf(37.3)}
        y={380}
        fundo="#ff3b30"
        cor="#fff"
        tam={50}
      />

      <Titulo linhas={["A CHAVE", "CERTA"]} ini={tf(37.42)} fim={tf(42.7)} />
      <Chip
        texto="LINHA DO CILINDRO"
        ini={tf(45.68)}
        fim={tf(48.2)}
        y={380}
        fundo="#ffcc22"
        tam={54}
      />
      <Chip
        texto="TODOS DE UMA VEZ"
        ini={tf(46.96)}
        fim={tf(48.2)}
        y={500}
        fundo="#fff"
        tam={50}
      />
      <Chip
        texto="GIROU!"
        ini={tf(50.1)}
        fim={tf(51.45)}
        y={400}
        fundo="#2bd47a"
        tam={66}
      />

      <Titulo linhas={["A CHAVE", "ERRADA"]} ini={tf(51.52)} fim={tf(53.35)} />
      <Chip
        texto="1 PINO FORA DA LINHA"
        ini={tf(53.4)}
        fim={tf(55.3)}
        y={380}
        fundo="#ff3b30"
        cor="#fff"
        tam={50}
      />

      <Titulo
        linhas={["EGITO", "HÁ 4 MIL ANOS"]}
        ini={tf(55.36)}
        fim={tf(60.3)}
        tam={88}
      />
      <Chip
        texto="PINOS DE MADEIRA"
        ini={tf(59.08)}
        fim={tf(60.3)}
        y={560}
        fundo="#c79a5a"
        tam={50}
      />

      <Titulo
        linhas={["LINUS YALE", "PAI E FILHO"]}
        ini={tf(61.62)}
        fim={tf(65.7)}
        tam={88}
      />
      <Chip
        texto="SÉCULO 19 · EUA"
        ini={tf(64.22)}
        fim={tf(65.7)}
        y={560}
        fundo="#fff"
        tam={50}
      />

      <Titulo
        linhas={["E VOCÊ?", "JÁ FICOU TRANCADO?"]}
        ini={tf(65.8)}
        fim={DURACAO_FECHADURA}
        tam={76}
      />
      <Chip
        texto="COMENTA AÍ ↓"
        ini={tf(68.62)}
        y={600}
        tam={56}
        fundo="#ffcc22"
      />
      <Chip
        texto="SIGA @HISTORICODEBUSCA"
        ini={tf(69.64)}
        y={720}
        tam={46}
        fundo="#111"
        cor="#fff"
      />

      <LegendaPalavra />
    </AbsoluteFill>
  );
};

export const CapaFechadura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#111" }}>
    <Img
      src={staticFile("fechadura/capa_fundo.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Titulo
      linhas={["POR QUE SÓ A SUA", "CHAVE ABRE?"]}
      ini={-99}
      fim={1e9}
      y={330}
      tam={100}
    />
    <Chip
      texto="POR DENTRO DA FECHADURA"
      ini={-99}
      y={1350}
      fundo="#ffcc22"
      tam={56}
    />
  </AbsoluteFill>
);
