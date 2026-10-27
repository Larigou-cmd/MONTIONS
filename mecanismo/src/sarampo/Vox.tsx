import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OUT, P, SNAP, it } from "../lib";
import { EMOJI } from "../aas/ui";
import { JORNAL, MAO, SANS } from "../fonts";
import { DURATION, PARTES, T } from "./Video";

// "Notícias da Farmácia" #2 (sarampo) no estilo Vox: papel bege com textura, recortes de jornal,
// marca-texto amarelo, círculos e setas à mão em vermelho e a câmera se aproximando devagar. Sem legenda.
// Mesma narração e mesmos tempos do sarampo/Video.tsx.
export const V = {
  papel: "#efe9dc",
  creme: "#fbf8f1",
  tinta: "#1b1b1b",
  cinza: "#6f6a60",
  amarelo: "#ffd84d",
  vermelho: "#d7263d",
  azul: "#2b59c3",
  verde: "#2a9d55",
};
const R = (i: number) => PARTES[i];
const W = 1080;

// ---------- fundo de papel (peças exportadas: reaproveitadas pelos outros vídeos no estilo Vox) ----------
export const Fundo: React.FC = () => (
  <AbsoluteFill style={{ background: V.papel }}>
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      <filter id="papel">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={3}
          seed={4}
        />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.35 0" />
      </filter>
      <rect width={W} height={1920} filter="url(#papel)" opacity={0.55} />
    </svg>
    <AbsoluteFill
      style={{ boxShadow: "inset 0 0 260px rgba(90,70,40,0.28)" }}
    />
  </AbsoluteFill>
);

// cada cena entra com fade e a câmera se aproxima devagar
const Cena: React.FC<{ f: number; i: number; children: React.ReactNode }> = ({
  f,
  i,
  children,
}) => {
  const [a, b] = R(i);
  if (f < a || f >= b) return null;
  const p = (f - a) / (b - a);
  const o = Math.min(it(f, a, a + 10, 0, 1, OUT), 1 - P(f, b - 8, b));
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        transform: `scale(${1 + 0.045 * p})`,
        transformOrigin: "540px 820px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- peças ----------
// borda rasgada (polígono com serrilhado fixo)
const rasgo = (seed: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++)
    pts.push(
      `${(i / 24) * 100}% ${(Math.abs(Math.sin(seed * 7 + i * 3.1)) * 1.6).toFixed(2)}%`,
    );
  for (let i = 24; i >= 0; i--)
    pts.push(
      `${(i / 24) * 100}% ${(100 - Math.abs(Math.sin(seed * 5 + i * 2.3)) * 2.4).toFixed(2)}%`,
    );
  return `polygon(${pts.join(",")})`;
};
export const Recorte: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w: number;
  rot?: number;
  seed?: number;
  fita?: boolean;
  children: React.ReactNode;
}> = ({ f, at, x, y, w, rot = -1.5, seed = 1, fita = true, children }) => {
  if (f < at) return null;
  const k = it(f, at, at + 16, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: Math.min(1, k * 1.6),
        transform: `translateY(${(1 - k) * 90}px) rotate(${rot}deg)`,
        filter: "drop-shadow(6px 10px 12px rgba(60,40,10,0.35))",
      }}
    >
      <div
        style={{
          background: V.creme,
          clipPath: rasgo(seed),
          padding: "44px 40px 50px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
      {fita && (
        <div
          style={{
            position: "absolute",
            top: -18,
            left: w / 2 - 80,
            width: 160,
            height: 46,
            background: "rgba(255,236,170,0.65)",
            transform: "rotate(-4deg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      )}
    </div>
  );
};
// cartão de papel liso (sem borda rasgada)
export const Cartao: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  fundo?: string;
  children: React.ReactNode;
}> = ({ f, at, x, y, w, h, rot = 0, fundo = V.creme, children }) => {
  if (f < at) return null;
  const k = it(f, at, at + 16, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: fundo,
        borderRadius: 6,
        boxShadow: "6px 10px 18px rgba(60,40,10,0.3)",
        opacity: Math.min(1, k * 1.6),
        transform: `translateY(${(1 - k) * 80}px) rotate(${rot}deg)`,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
export const Kicker: React.FC<{
  children: React.ReactNode;
  cor?: string;
  size?: number;
}> = ({ children, cor = V.vermelho, size = 26 }) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: cor,
    }}
  >
    {children}
  </div>
);
export const Manchete: React.FC<{
  children: React.ReactNode;
  size?: number;
}> = ({ children, size = 54 }) => (
  <div
    style={{
      fontFamily: JORNAL,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.12,
      color: V.tinta,
      marginTop: 14,
    }}
  >
    {children}
  </div>
);
// linhas cinzas de "texto de jornal"
export const Corpo: React.FC<{ n?: number }> = ({ n = 3 }) => (
  <div
    style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}
  >
    {Array.from({ length: n }, (_, i) => (
      <div
        key={i}
        style={{
          height: 12,
          width: `${i === n - 1 ? 62 : 96 - (i % 2) * 6}%`,
          background: "rgba(27,27,27,0.16)",
          borderRadius: 2,
        }}
      />
    ))}
  </div>
);
// marca-texto que passa da esquerda para a direita
export const Marca: React.FC<{
  f: number;
  at: number;
  children: React.ReactNode;
  cor?: string;
}> = ({ f, at, children, cor = V.amarelo }) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${cor}, ${cor})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${k * 100}% 62%`,
        backgroundPosition: "0 78%",
        padding: "0 4px",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
};
// traço à mão que se desenha (círculo, seta, sublinhado, check, X)
export const Traco: React.FC<{
  f: number;
  at: number;
  d: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cor?: string;
  esp?: number;
  dur?: number;
}> = ({ f, at, d, x, y, w, h, cor = V.vermelho, esp = 7, dur = 16 }) => {
  if (f < at) return null;
  const k = it(f, at, at + dur, 0, 1, OUT);
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
    >
      <path
        d={d}
        pathLength={1}
        stroke={cor}
        strokeWidth={esp}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - k}
      />
    </svg>
  );
};
export const circulo = (w: number, h: number) =>
  `M ${w * 0.55} ${h * 0.04} C ${w * 0.95} ${h * 0.02} ${w * 1.02} ${h * 0.7} ${w * 0.6} ${h * 0.96} C ${w * 0.2} ${h * 1.04} ${-w * 0.04} ${h * 0.55} ${w * 0.1} ${h * 0.25} C ${w * 0.2} ${h * 0.04} ${w * 0.42} ${h * 0.0} ${w * 0.7} ${h * 0.1}`;
export const xis = (s: number) =>
  `M 4 4 L ${s - 4} ${s - 4} M ${s - 6} 6 L 6 ${s - 6}`;
export const check = (s: number) =>
  `M 4 ${s * 0.55} L ${s * 0.38} ${s - 6} L ${s - 4} 6`;
// nota escrita à mão
export const Nota: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  children: React.ReactNode;
  rot?: number;
  cor?: string;
  size?: number;
  w?: number;
}> = ({
  f,
  at,
  x,
  y,
  children,
  rot = -4,
  cor = V.vermelho,
  size = 58,
  w = 600,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        fontFamily: MAO,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color: cor,
        opacity: k,
        transform: `rotate(${rot}deg) translateY(${(1 - k) * 14}px)`,
        clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`,
      }}
    >
      {children}
    </div>
  );
};
export const Carimbo: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  texto: string;
  cor?: string;
  size?: number;
  rot?: number;
}> = ({ f, at, x, y, texto, cor = V.vermelho, size = 40, rot = -9 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${1.6 - 0.6 * k})`,
        opacity: Math.min(1, k * 1.3) * 0.9,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        color: cor,
        border: `6px solid ${cor}`,
        borderRadius: 10,
        padding: "8px 22px",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        mixBlendMode: "multiply",
      }}
    >
      {texto}
    </div>
  );
};
// título grande de capítulo
export const Capitulo: React.FC<{
  f: number;
  at: number;
  kicker: string;
  children: React.ReactNode;
  top?: number;
  size?: number;
}> = ({ f, at, kicker, children, top = 150, size = 76 }) => {
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        width: 940,
        top,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      <Kicker>{kicker}</Kicker>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.05,
          color: V.tinta,
          marginTop: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 170,
        width: 940,
        opacity: it(f, 2, 14, 0, 1, OUT),
      }}
    >
      <Kicker>Notícias da Farmácia #2</Kicker>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.04,
          color: V.tinta,
          marginTop: 14,
        }}
      >
        Preciso tomar a vacina do sarampo{" "}
        <Marca f={f} at={40}>
          de novo?
        </Marca>
      </div>
    </div>
    <Recorte
      f={f}
      at={T.alerta - 8}
      x={110}
      y={640}
      w={860}
      rot={-2.5}
      seed={2}
    >
      <Kicker cor={V.cinza} size={22}>
        Ministério da Saúde · outubro de 2026
      </Kicker>
      <Manchete size={52}>
        Saúde faz{" "}
        <Marca f={f} at={T.alerta + 10}>
          alerta
        </Marca>{" "}
        para o risco de sarampo no Brasil
      </Manchete>
      <Corpo n={3} />
    </Recorte>
    <Nota f={f} at={T.vem - 30} x={560} y={1100} rot={-6}>
      vem entender! ↓
    </Nota>
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={1}>
    <Recorte f={f} at={T.eua} x={70} y={170} w={900} rot={-2} seed={3}>
      <Kicker cor={V.cinza} size={22}>
        Estados Unidos
      </Kicker>
      <Manchete size={54}>
        Casos de sarampo chegam ao maior número em{" "}
        <Marca f={f} at={T.anos35}>
          mais de 35 anos
        </Marca>
      </Manchete>
      <Corpo n={2} />
    </Recorte>
    <Nota f={f} at={T.noventa} x={500} y={640} rot={-5} size={64}>
      90% não estavam vacinados!
    </Nota>
    <Traco
      f={f}
      at={T.noventa + 6}
      d="M 10 10 C 40 60 30 90 70 120"
      x={430}
      y={560}
      w={90}
      h={130}
    />
    <Recorte f={f} at={T.brasil} x={110} y={820} w={860} rot={2} seed={6}>
      <Kicker cor={V.cinza} size={22}>
        Brasil · até outubro de 2026
      </Kicker>
      <div
        style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 6 }}
      >
        <div
          style={{
            position: "relative",
            fontFamily: JORNAL,
            fontWeight: 900,
            fontSize: 170,
            lineHeight: 1,
            color: V.tinta,
          }}
        >
          52
          <Traco
            f={f}
            at={T.casos52 + 8}
            d={circulo(230, 180)}
            x={-30}
            y={4}
            w={230}
            h={180}
          />
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: V.tinta,
            lineHeight: 1.2,
          }}
        >
          casos,
          <br />
          <Marca f={f} at={T.casos52 + 30}>
            todos vindos de fora
          </Marca>
        </div>
      </div>
    </Recorte>
    <Carimbo
      f={f}
      at={T.circulando}
      x={540}
      y={1260}
      texto="sem circulação no Brasil"
      cor={V.verde}
      size={36}
      rot={-4}
    />
    <Nota f={f} at={T.chegar} x={240} y={1360} rot={-3} w={700}>
      …mas o risco de chegar existe
    </Nota>
  </Cena>
);

const S3: React.FC<{ f: number }> = ({ f }) => {
  const k = P(f, T.nove - 20, T.nove + 20);
  return (
    <Cena f={f} i={2}>
      <Capitulo f={f} at={R(2)[0]} kicker="Por que preocupa">
        Uma das doenças{" "}
        <Marca f={f} at={T.contagiosas}>
          mais contagiosas
        </Marca>
      </Capitulo>
      <div
        style={{
          position: "absolute",
          top: 560,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 38,
          color: V.cinza,
          opacity: P(f, T.nove - 30, T.nove - 16),
        }}
      >
        1 doente → 10 pessoas próximas sem vacina
      </div>
      <svg width={W} height={500} style={{ position: "absolute", top: 640 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const x = 200 + (i % 5) * 170;
          const y = 120 + Math.floor(i / 5) * 200;
          const vac = i === 7;
          const pega = !vac && k > i / 10;
          const cor = vac ? V.azul : pega ? V.vermelho : "#bdb6a8";
          const o = P(f, T.nove - 30 + i * 2, T.nove - 20 + i * 2);
          return (
            <g key={i} opacity={o}>
              <circle cx={x} cy={y - 36} r={26} fill={cor} />
              <path
                d={`M ${x - 44} ${y + 50} Q ${x - 44} ${y - 4} ${x} ${y - 4} Q ${x + 44} ${y - 4} ${x + 44} ${y + 50} Z`}
                fill={cor}
              />
            </g>
          );
        })}
      </svg>
      <Nota
        f={f}
        at={T.nove + 24}
        x={430}
        y={1150}
        rot={-3}
        cor={V.azul}
        size={54}
      >
        ↑ só quem é vacinado escapa
      </Nota>
      <div
        style={{
          position: "absolute",
          top: 1290,
          width: W,
          display: "flex",
          justifyContent: "center",
          gap: 26,
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 52,
          color: V.vermelho,
        }}
      >
        {(
          [
            ["pneumonia", T.pneumonia],
            ["encefalite", T.cerebro],
            ["morte", T.morte],
          ] as [string, number][]
        ).map(([t, at]) => (
          <span
            key={t}
            style={{
              opacity: P(f, at, at + 8),
              transform: `translateY(${(1 - it(f, at, at + 12, 0, 1, OUT)) * 20}px)`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </Cena>
  );
};

const Linha4: React.FC<{
  f: number;
  at: number;
  icone: string;
  texto: string;
  doses: number;
  cor?: string;
}> = ({ f, at, icone, texto, doses, cor = V.azul }) => {
  const k = it(f, at, at + 12, 0, 1, OUT);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        height: 150,
        borderBottom: "3px dashed rgba(27,27,27,0.2)",
        opacity: k,
        transform: `translateX(${(1 - k) * -40}px)`,
      }}
    >
      <span style={{ fontFamily: EMOJI, fontSize: 60 }}>{icone}</span>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 40,
          color: V.tinta,
          flex: 1,
        }}
      >
        {texto}
      </span>
      <span style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: doses }, (_, i) => (
          <span
            key={i}
            style={{ width: 40, height: 40, borderRadius: 20, background: cor }}
          />
        ))}
      </span>
      <span
        style={{
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 52,
          color: cor,
          width: 150,
        }}
      >
        {doses} {doses > 1 ? "doses" : "dose"}
      </span>
    </div>
  );
};
const S4: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={3}>
    <Capitulo f={f} at={R(3)[0]} kicker="Tríplice viral">
      Quem está{" "}
      <Marca f={f} at={T.emDia}>
        em dia
      </Marca>
    </Capitulo>
    <Nota f={f} at={T.triplice + 30} x={70} y={330} rot={-2} size={52} w={700}>
      sarampo + caxumba + rubéola
    </Nota>
    <Cartao f={f} at={T.emDia - 10} x={60} y={430} w={960} h={700} rot={-0.8}>
      <div style={{ padding: "20px 36px" }}>
        {f >= T.doze && (
          <Linha4
            f={f}
            at={T.doze}
            icone="👶"
            texto="criança: 12 e 15 meses"
            doses={2}
          />
        )}
        {f >= T.ate29 && (
          <Linha4
            f={f}
            at={T.ate29}
            icone="🧑"
            texto="de 1 a 29 anos"
            doses={2}
          />
        )}
        {f >= T.ate59 && (
          <Linha4
            f={f}
            at={T.ate59}
            icone="🧔"
            texto="de 30 a 59 anos"
            doses={1}
          />
        )}
        {f >= T.profissionais && (
          <Linha4
            f={f}
            at={T.profissionais}
            icone="🩺"
            texto="profissional de saúde (qualquer idade)"
            doses={2}
            cor={V.verde}
          />
        )}
      </div>
    </Cartao>
  </Cena>
);

const S5: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={4}>
    <Capitulo f={f} at={R(4)[0]} kicker="Já tem as doses?">
      Então você está{" "}
      <Marca f={f} at={T.protegido}>
        protegido
      </Marca>
    </Capitulo>
    <Cartao
      f={f}
      at={R(4)[0] + 8}
      x={150}
      y={470}
      w={780}
      h={620}
      rot={2}
      fundo="#f6e7b8"
    >
      <div style={{ padding: 34 }}>
        <Kicker cor={V.tinta} size={24}>
          Caderneta de vacinação
        </Kicker>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
            marginTop: 26,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 200,
                border: "3px solid rgba(27,27,27,0.35)",
                position: "relative",
              }}
            >
              {i < 2 && (
                <div
                  style={{
                    position: "absolute",
                    left: 40,
                    top: 30,
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    border: `5px solid ${V.azul}`,
                    color: V.azul,
                    fontFamily: SANS,
                    fontWeight: 900,
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    transform: `rotate(${-12 + i * 9}deg)`,
                    opacity:
                      0.8 * P(f, R(4)[0] + 20 + i * 8, R(4)[0] + 28 + i * 8),
                  }}
                >
                  TRÍPLICE
                  <br />
                  VIRAL
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Cartao>
    <Traco
      f={f}
      at={T.protegido - 6}
      d={check(240)}
      x={680}
      y={380}
      w={240}
      h={240}
      cor={V.verde}
      esp={20}
    />
    <div
      style={{
        position: "absolute",
        top: 1180,
        width: W,
        textAlign: "center",
        fontFamily: JORNAL,
        fontWeight: 900,
        fontSize: 60,
        color: V.tinta,
        opacity: P(f, T.protegido + 20, T.protegido + 32),
      }}
    >
      <Marca f={f} at={T.protegido + 30}>
        não precisa tomar de novo
      </Marca>
    </div>
  </Cena>
);

const S6: React.FC<{ f: number }> = ({ f }) => {
  const itens: [string, number][] = [
    ["não tem as doses", T.agora + 20],
    ["perdeu a caderneta", T.perdeu],
    ["não lembra", T.perdeu + 40],
  ];
  return (
    <Cena f={f} i={5}>
      <Capitulo f={f} at={R(5)[0]} kicker="Vá ao posto se…" size={72}>
        Quem{" "}
        <Marca f={f} at={T.vacine}>
          deve tomar
        </Marca>
      </Capitulo>
      <Cartao f={f} at={T.agora + 10} x={80} y={400} w={920} h={420} rot={-1.2}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(transparent 0 78px, rgba(43,89,195,0.25) 78px 81px)",
            backgroundPosition: "0 30px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 0,
            bottom: 0,
            width: 3,
            background: "rgba(215,38,61,0.5)",
          }}
        />
        {itens.map(([t, at], i) => (
          <div
            key={t}
            style={{
              position: "absolute",
              left: 140,
              top: 52 + i * 81,
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: MAO,
              fontWeight: 700,
              fontSize: 62,
              color: V.tinta,
              opacity: P(f, at, at + 8),
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                border: `4px solid ${V.tinta}`,
                position: "relative",
              }}
            >
              <Traco
                f={f}
                at={at + 6}
                d={check(44)}
                x={0}
                y={-6}
                w={44}
                h={44}
                cor={V.vermelho}
                esp={7}
              />
            </span>
            {t}
          </div>
        ))}
        <Nota
          f={f}
          at={T.malNao}
          x={480}
          y={300}
          rot={-5}
          cor={V.verde}
          size={50}
          w={430}
        >
          dose a mais não faz mal
        </Nota>
      </Cartao>
      <Cartao
        f={f}
        at={T.viajar}
        x={80}
        y={900}
        w={920}
        h={380}
        rot={1.2}
        fundo="#ffffff"
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 920,
            height: 70,
            background: V.azul,
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 4,
            display: "flex",
            alignItems: "center",
            paddingLeft: 30,
          }}
        >
          ✈️ CARTÃO DE EMBARQUE
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 100,
            fontFamily: SANS,
            fontSize: 22,
            letterSpacing: 3,
            color: V.cinza,
          }}
        >
          DESTINO
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 130,
            fontFamily: JORNAL,
            fontWeight: 900,
            fontSize: 52,
            color: V.tinta,
            opacity: P(f, T.paises, T.paises + 10),
          }}
        >
          EUA · México · Canadá
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 230,
            width: 920,
            borderTop: "4px dashed rgba(27,27,27,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 262,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 44,
            color: V.tinta,
            opacity: P(f, T.antes15, T.antes15 + 8),
          }}
        >
          <Marca f={f} at={T.antes15}>
            vacine 15 dias antes
          </Marca>
        </div>
      </Cartao>
    </Cena>
  );
};

const S7: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={6}>
    <Capitulo f={f} at={R(6)[0]} kicker="A exceção">
      Bloqueio vacinal
    </Capitulo>
    <Traco
      f={f}
      at={T.bloqueio}
      d={`M 0 10 C 200 0 400 18 640 6`}
      x={70}
      y={330}
      w={640}
      h={20}
      esp={8}
    />
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 400,
        width: 940,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 44,
        lineHeight: 1.35,
        color: V.tinta,
      }}
    >
      <div style={{ opacity: P(f, T.casosRegiao, T.casosRegiao + 10) }}>
        Quando aparecem casos numa região:
      </div>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 64,
          marginTop: 10,
          opacity: P(f, T.extra - 6, T.extra + 4),
        }}
      >
        <Marca f={f} at={T.extra}>
          dose extra para todos
        </Marca>
      </div>
    </div>
    <Nota f={f} at={T.extra + 30} x={440} y={600} rot={-4} size={56} w={600}>
      mesmo quem já está em dia!
    </Nota>
    <Recorte f={f} at={T.sp} x={90} y={740} w={900} rot={-1.5} seed={9}>
      <Kicker cor={V.cinza} size={22}>
        gov.br · julho de 2026
      </Kicker>
      <Manchete size={48}>
        Ministério amplia vacinação contra o sarampo em três municípios de SP
      </Manchete>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 34,
        }}
      >
        {["São Paulo", "Guarulhos", "São Bernardo do Campo"].map((c, i) => (
          <span
            key={c}
            style={{
              opacity: P(f, T.sp + 50 + i * 12, T.sp + 58 + i * 12),
              color: V.tinta,
            }}
          >
            📍 {c}
          </span>
        ))}
      </div>
    </Recorte>
    <Carimbo
      f={f}
      at={T.doseZero}
      x={540}
      y={1330}
      texto="dose zero · bebês de 6 a 11 meses"
      cor={V.azul}
      size={32}
      rot={-3}
    />
  </Cena>
);

const S8: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={7}>
    <Capitulo f={f} at={R(7)[0]} kicker="Atenção">
      Quem{" "}
      <Marca f={f} at={R(7)[0] + 20} cor="#ffb3b3">
        não pode
      </Marca>{" "}
      tomar
    </Capitulo>
    <Nota
      f={f}
      at={T.vivo}
      x={80}
      y={370}
      rot={-2}
      size={56}
      w={900}
      cor={V.tinta}
    >
      é feita com vírus vivo enfraquecido
    </Nota>
    <Cartao
      f={f}
      at={T.gestantes - 10}
      x={80}
      y={480}
      w={920}
      h={400}
      rot={-0.6}
    >
      {(
        [
          ["🤰", "gestantes", T.gestantes],
          ["🛡️", "imunidade muito baixa", T.imunidade],
        ] as [string, string, number][]
      ).map(([e, t, at], i) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: 40,
            top: 50 + i * 170,
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: P(f, at, at + 8),
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 80 }}>{e}</span>
          <span
            style={{
              fontFamily: JORNAL,
              fontWeight: 900,
              fontSize: 52,
              color: V.tinta,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </span>
          <span style={{ position: "relative", width: 90, height: 90 }}>
            <Traco
              f={f}
              at={at + 8}
              d={xis(90)}
              x={0}
              y={0}
              w={90}
              h={90}
              esp={12}
            />
          </span>
        </div>
      ))}
    </Cartao>
    <Cartao
      f={f}
      at={T.engravidar}
      x={300}
      y={950}
      w={480}
      h={420}
      rot={3}
      fundo="#ffffff"
    >
      <div
        style={{
          height: 90,
          background: V.vermelho,
          color: "#fff",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: 4,
        }}
      >
        CALENDÁRIO
      </div>
      <div
        style={{
          textAlign: "center",
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 1.1,
          color: V.tinta,
        }}
      >
        30
      </div>
      <div
        style={{
          textAlign: "center",
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 50,
          color: V.vermelho,
          lineHeight: 1,
        }}
      >
        dias sem engravidar
        <br />
        depois da vacina
      </div>
    </Cartao>
  </Cena>
);

const S9: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={8}>
    <Capitulo f={f} at={R(8)[0]} kicker="Como conferir">
      Olhe a sua{" "}
      <Marca f={f} at={T.caderneta}>
        caderneta
      </Marca>
    </Capitulo>
    <Cartao
      f={f}
      at={T.caderneta}
      x={70}
      y={470}
      w={420}
      h={560}
      rot={-4}
      fundo="#f6e7b8"
    >
      <div style={{ padding: 30 }}>
        <Kicker cor={V.tinta} size={20}>
          Caderneta de vacinação
        </Kicker>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 70,
              borderBottom: "3px solid rgba(27,27,27,0.25)",
            }}
          />
        ))}
      </div>
    </Cartao>
    {f >= T.app && (
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 420,
          width: 400,
          height: 700,
          borderRadius: 50,
          background: V.tinta,
          padding: 16,
          boxSizing: "border-box",
          boxShadow: "8px 14px 24px rgba(60,40,10,0.35)",
          transform: `translateY(${(1 - it(f, T.app, T.app + 14, 0, 1, SNAP)) * 100}px) rotate(3deg)`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 36,
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 110,
              background: V.azul,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 34,
              display: "flex",
              alignItems: "flex-end",
              padding: "0 0 18px 26px",
            }}
          >
            Meu SUS Digital
          </div>
          {["Vacinas", "Tríplice viral ✓", "Tríplice viral ✓"].map((t, i) => (
            <div
              key={i}
              style={{
                padding: "26px",
                borderBottom: "2px solid #e5e5e5",
                fontFamily: SANS,
                fontWeight: i === 0 ? 800 : 600,
                fontSize: i === 0 ? 30 : 28,
                color: i === 0 ? V.tinta : V.verde,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    )}
    <Nota
      f={f}
      at={T.app + 10}
      x={520}
      y={1150}
      rot={-4}
      cor={V.azul}
      size={52}
      w={500}
    >
      ou no app ↑
    </Nota>
    <Carimbo
      f={f}
      at={T.gratis + 10}
      x={540}
      y={1330}
      texto="grátis no SUS"
      cor={V.verde}
      size={52}
    />
  </Cena>
);

const S10: React.FC<{ f: number }> = ({ f }) => {
  const itens: [string, string, number][] = [
    ["🌡️", "febre alta", T.febre],
    ["🔴", "manchas vermelhas pelo corpo", T.manchas],
    ["😷", "tosse", T.tosse],
    ["🤧", "nariz escorrendo", T.nariz],
    ["👁️", "olhos vermelhos", T.olhos],
  ];
  return (
    <Cena f={f} i={9}>
      <Capitulo f={f} at={R(9)[0]} kicker="Fique de olho">
        Os sintomas
      </Capitulo>
      <Recorte
        f={f}
        at={T.sintomas + 10}
        x={80}
        y={390}
        w={920}
        rot={-1}
        seed={12}
      >
        {itens.map(([e, t, at]) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              height: 120,
              borderBottom: "2px solid rgba(27,27,27,0.12)",
              opacity: P(f, at, at + 8),
              position: "relative",
            }}
          >
            <span style={{ fontFamily: EMOJI, fontSize: 56 }}>{e}</span>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 46,
                color: V.tinta,
              }}
            >
              {t}
            </span>
            {t.startsWith("manchas") && (
              <Traco
                f={f}
                at={at + 10}
                d={circulo(700, 110)}
                x={80}
                y={4}
                w={700}
                h={110}
              />
            )}
          </div>
        ))}
      </Recorte>
      <div
        style={{
          position: "absolute",
          top: 1240,
          width: W,
          textAlign: "center",
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 60,
          color: V.tinta,
          opacity: P(f, T.atendimento, T.atendimento + 10),
        }}
      >
        🏥{" "}
        <Marca f={f} at={T.atendimento + 6}>
          procure atendimento
        </Marca>
      </div>
      <Nota
        f={f}
        at={T.atendimento + 50}
        x={300}
        y={1350}
        rot={-3}
        size={50}
        w={700}
      >
        e evite contato com outras pessoas
      </Nota>
    </Cena>
  );
};

const S11: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={10}>
    <div
      style={{
        position: "absolute",
        top: 640,
        width: W,
        textAlign: "center",
        opacity: it(f, T.siga, T.siga + 14, 0, 1, OUT),
      }}
    >
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 110,
          color: V.tinta,
        }}
      >
        <Marca f={f} at={T.siga + 10}>
          Me siga
        </Marca>
      </div>
      <div
        style={{
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 64,
          color: V.vermelho,
          marginTop: 20,
        }}
      >
        para mais dicas de farmacologia
        <br />e curiosidades sobre a área
      </div>
    </div>
  </Cena>
);

const S12: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={11}>
    <div
      style={{
        position: "absolute",
        top: 700,
        left: 90,
        width: 900,
        textAlign: "center",
        fontFamily: JORNAL,
        fontWeight: 900,
        fontSize: 80,
        lineHeight: 1.15,
        color: V.tinta,
        opacity: it(f, T.final, T.final + 14, 0, 1, OUT),
      }}
    >
      Consulte um{" "}
      <Marca f={f} at={T.final + 10}>
        profissional de saúde
      </Marca>{" "}
      para orientações.
    </div>
  </Cena>
);

const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(
    ([de]) => [de, "whoosh", 0.22] as [number, string, number],
  ),
  [T.alerta - 8, "pop", 0.2],
  [T.eua, "pop", 0.18],
  [T.brasil, "pop", 0.18],
  [T.circulando, "trava", 0.28],
  [T.emDia - 10, "pop", 0.18],
  [T.protegido - 6, "plim", 0.25],
  [T.viajar, "pop", 0.18],
  [T.sp, "pop", 0.18],
  [T.doseZero, "trava", 0.28],
  [T.engravidar, "pop", 0.18],
  [T.gratis + 10, "trava", 0.28],
  [T.sintomas + 10, "pop", 0.18],
  [T.final, "plim", 0.3],
];

export const VideoSarampoVox: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S9 f={f} />
      <S10 f={f} />
      <S11 f={f} />
      <S12 f={f} />
      <Audio src={staticFile("sarampo/narracao.mp3")} />
      <Audio
        src={staticFile("sarampo/musica.wav")}
        volume={(fr) => 0.07 * (1 - P(fr, DURATION - 60, DURATION))}
      />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920) no estilo Vox. Os 20% de baixo ficam livres por causa do contador do TikTok.
export const CapaSarampoVox: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", left: 70, top: 150, width: 940 }}>
      <Kicker size={30}>Notícias da Farmácia #2</Kicker>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1.02,
          color: V.tinta,
          marginTop: 16,
        }}
      >
        Preciso tomar a vacina do sarampo{" "}
        <Marca f={100} at={0}>
          de novo?
        </Marca>
      </div>
    </div>
    <Recorte f={100} at={0} x={110} y={680} w={860} rot={-2.5} seed={2}>
      <Kicker cor={V.cinza} size={22}>
        Ministério da Saúde · outubro de 2026
      </Kicker>
      <Manchete size={52}>
        Saúde faz{" "}
        <Marca f={100} at={0}>
          alerta
        </Marca>{" "}
        para o risco de sarampo no Brasil
      </Manchete>
      <Corpo n={2} />
    </Recorte>
    <Nota f={100} at={0} x={300} y={1120} rot={-5} size={66} w={720}>
      quem precisa e quem não ✓
    </Nota>
  </AbsoluteFill>
);
