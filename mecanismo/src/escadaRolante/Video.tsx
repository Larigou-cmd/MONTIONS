import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { Escada3D, faseEm, tf } from "./Escada3D";
import fala from "./fala.json";

// "Como a escada rolante nunca acaba?" — @historicodebusca. 3D low-poly, formato "desmontar".
// Narração Nassif (108 s), áudio com 0,3 s de atraso.

export const DURACAO_ESCADA = tf(108.32) + 45;
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
  for (let k = 0; k < PALAVRAS.length; k++) {
    if (PALAVRAS[k][1] <= t) i = k;
  }
  if (i < 0) return null;
  const [w, ini, fim] = PALAVRAS[i];
  const prox = PALAVRAS[i + 1]?.[1] ?? fim + 0.6;
  if (t > Math.min(prox, fim + 0.5)) return null;
  const s = pop(f, tf(ini), 4);
  const limpa = w.replace(/[.,!?…]+$/g, "");
  const destaque =
    /\d|nunca|círculo|trilho|motor|corrente|pente|corrimão|rodinhas|degraus?|zé/i.test(
      limpa,
    );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1300,
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
}> = ({
  texto,
  ini,
  fim = 1e9,
  cor = "#111",
  y = 420,
  tam = 50,
  fundo = "#fff",
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
          transform: `scale(${pop(f, ini)}) rotate(-2deg)`,
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

const Icone: React.FC<{ simbolo: string; ini: number; fim: number }> = ({
  simbolo,
  ini,
  fim,
}) => {
  const f = useCurrentFrame();
  if (f < ini || f > fim) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        top: 300,
        fontSize: 120,
        color: "#fff",
        textShadow: contorno(4),
        opacity: Math.floor(f / 10) % 2 ? 0.75 : 1,
        transform: `scale(${pop(f, ini)})`,
        fontFamily: SANS,
        fontWeight: 900,
      }}
    >
      {simbolo}
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

const Contador: React.FC<{ ini: number }> = ({ ini }) => {
  const f = useCurrentFrame();
  if (f < ini) return null;
  const k = Math.min(1, (f - ini) / 40);
  const n = Math.round(75000 * (1 - (1 - k) ** 3));
  return (
    <Chip
      texto={`${n.toLocaleString("pt-BR")} PESSOAS`}
      ini={ini}
      y={520}
      tam={70}
      fundo="#3b2a1a"
      cor="#f3e2c3"
    />
  );
};

export const VideoEscada: React.FC<{ semAudio?: boolean }> = ({ semAudio }) => {
  const f = useCurrentFrame();
  const fase = faseEm(f);
  const rebobina = f >= tf(36.8) && f < tf(37.8);
  const filtro =
    fase === "ano1896"
      ? "sepia(0.85) contrast(1.05)"
      : rebobina
        ? "grayscale(1) contrast(1.2)"
        : "none";
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6efe4" }}>
      {semAudio ? null : (
        <Audio src={staticFile("escadaRolante/mix_final.wav")} />
      )}
      <AbsoluteFill style={{ filter: filtro }}>
        <Escada3D f={f} />
      </AbsoluteFill>
      {rebobina ? (
        <AbsoluteFill
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 26px)",
            transform: `translateY(${(f * 37) % 26}px)`,
          }}
        />
      ) : null}
      {fase === "ano1896" ? (
        <AbsoluteFill
          style={{ boxShadow: "inset 0 0 260px rgba(60,35,10,0.65)" }}
        />
      ) : null}

      {/* gancho */}
      <Chip
        texto="NO MEU HISTÓRICO DE BUSCA DE HOJE"
        ini={0}
        fim={tf(5.3)}
        y={310}
        tam={36}
      />
      <Titulo
        linhas={["Para onde somem", "os degraus?"]}
        ini={tf(2.1)}
        fim={tf(5.3)}
        y={420}
      />
      {/* esteira */}
      <Chip texto="IDEIA 1: ESTEIRA" ini={tf(15.0)} fim={tf(23.9)} y={330} />
      <Icone simbolo="❚❚" ini={tf(24.0)} fim={tf(30.9)} />
      <Chip
        texto="1896: UMA RAMPA QUE ANDAVA"
        ini={tf(24.9)}
        fim={tf(30.9)}
        y={330}
        tam={46}
        fundo="#ffd21f"
      />
      {/* tortos */}
      <Chip
        texto="IDEIA 2: DEGRAUS NA ESTEIRA"
        ini={tf(31.3)}
        fim={tf(36.7)}
        y={330}
        tam={44}
      />
      <Chip
        texto="DEGRAUS TORTOS ✗"
        ini={tf(36.0)}
        fim={tf(36.7)}
        y={450}
        cor="#fff"
        fundo="#e23b2e"
      />
      <Icone simbolo="◀◀" ini={tf(36.8)} fim={tf(37.8)} />
      {/* rodinhas */}
      <Chip
        texto="O SEGREDO ESTÁ EMBAIXO"
        ini={tf(38.0)}
        fim={tf(40.2)}
        y={330}
      />
      <Chip texto="4 RODINHAS" ini={tf(41.3)} fim={tf(47.7)} y={330} />
      <Chip
        texto="● FRENTE"
        ini={tf(42.6)}
        fim={tf(47.7)}
        y={450}
        cor="#fff"
        fundo="#2f8cff"
        tam={44}
      />
      <Chip
        texto="● TRÁS"
        ini={tf(43.8)}
        fim={tf(47.7)}
        y={550}
        cor="#111"
        fundo="#ff7a1a"
        tam={44}
      />
      {/* trilhos */}
      <Chip
        texto="NO MEIO: TRILHOS AFASTADOS"
        ini={tf(48.0)}
        fim={tf(53.6)}
        y={330}
        tam={44}
      />
      <Chip
        texto="DEGRAU EM PÉ"
        ini={tf(51.8)}
        fim={tf(53.6)}
        y={450}
        fundo="#ffd21f"
      />
      <Chip
        texto="NAS PONTAS: TRILHOS JUNTOS"
        ini={tf(53.8)}
        fim={tf(60.9)}
        y={330}
        tam={44}
      />
      <Chip
        texto="DEGRAU DEITADO = CHÃO"
        ini={tf(57.5)}
        fim={tf(60.9)}
        y={450}
        fundo="#ffd21f"
      />
      {/* motor */}
      <Chip
        texto="CORRENTE"
        ini={tf(63.2)}
        fim={tf(68.3)}
        y={330}
        cor="#fff"
        fundo="#3b3b40"
      />
      <Chip
        texto="MOTOR + ENGRENAGENS"
        ini={tf(65.9)}
        fim={tf(68.3)}
        y={450}
        cor="#fff"
        fundo="#2e7d4f"
        tam={44}
      />
      {/* círculo */}
      <Icone simbolo="▶▶" ini={tf(68.7)} fim={tf(71.3)} />
      <Chip
        texto="VIRA DE CABEÇA PARA BAIXO"
        ini={tf(73.3)}
        fim={tf(78.6)}
        y={330}
        tam={44}
        fundo="#ffd21f"
      />
      <Titulo
        linhas={["É UM", "CÍRCULO"]}
        ini={tf(78.8)}
        fim={tf(81.7)}
        y={330}
        tam={110}
      />
      {/* pente e corrimão */}
      <Chip
        texto="PENTE DE METAL"
        ini={tf(83.4)}
        fim={tf(88.3)}
        y={330}
        fundo="#ffd21f"
      />
      <Chip
        texto="NADA ENTRA NA FRESTA"
        ini={tf(86.4)}
        fim={tf(88.3)}
        y={450}
        tam={42}
      />
      <Chip
        texto="CORRIMÃO"
        ini={tf(88.7)}
        fim={tf(92.6)}
        y={330}
        cor="#fff"
        fundo="#1d1d1f"
      />
      <Chip
        texto="MESMA VELOCIDADE"
        ini={tf(90.6)}
        fim={tf(92.6)}
        y={450}
        fundo="#ffd21f"
      />
      {/* 1896 */}
      <Chip
        texto="1896 · NOVA YORK"
        ini={tf(93.0)}
        fim={tf(101.7)}
        y={330}
        fundo="#f3e2c3"
        cor="#3b2a1a"
      />
      {f >= tf(96.0) && f < tf(101.7) ? <Contador ini={tf(96.0)} /> : null}
      {/* final */}
      <Titulo
        linhas={["Sobe andando", "ou parado?"]}
        ini={tf(102.1)}
        fim={DURACAO_ESCADA}
        y={330}
      />
      <Chip
        texto="COMENTA AÍ ↓"
        ini={tf(104.7)}
        fim={DURACAO_ESCADA}
        y={560}
        fundo="#ffd21f"
      />
      <Chip
        texto="SIGA @HISTORICODEBUSCA"
        ini={tf(105.7)}
        fim={DURACAO_ESCADA}
        y={1110}
        cor="#fff"
        fundo="#e8553d"
        tam={46}
      />

      {f < tf(105.7) ? <LegendaPalavra /> : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1585,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: "0.14em",
          color: "#fff",
          textShadow: contorno(2),
        }}
      >
        @HISTORICODEBUSCA
      </div>
    </AbsoluteFill>
  );
};

export const CapaEscada: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#f6efe4" }}>
    <Escada3D f={tf(2.5)} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 330,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "6px solid #111",
          boxShadow: "8px 8px 0 #111",
          borderRadius: 18,
          padding: "12px 28px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 40,
        }}
      >
        COMO FUNCIONA?
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 450,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 120,
        lineHeight: 1.02,
        color: "#fff",
        textShadow: contorno(6),
      }}
    >
      Para onde somem
      <div style={{ color: "#ffd21f" }}>os degraus?</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1585,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 24,
        letterSpacing: "0.14em",
        color: "#fff",
        textShadow: contorno(2),
      }}
    >
      @HISTORICODEBUSCA
    </div>
  </AbsoluteFill>
);
