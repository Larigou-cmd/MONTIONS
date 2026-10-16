import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { EASE, IN, OUT, P, SNAP, SNAP2, it, mix } from "../lib";
import { EMOJI } from "../aas/ui";
import { SANS } from "../fonts";
import { SFX, STEP1, T } from "../sema/config";
import { Personagem, PW } from "./Personagem";

// Semaglutida no estilo "explicador": fundo claro, título pixel com palavra colorida,
// cartões simples e a personagem no canto de baixo explicando (boca segue a voz).
// Usa a mesma narração e os mesmos tempos do vídeo sema/ (T em sema/config.ts).
export const DURATION = 2400;
const PIX = "'Press Start TwoP', monospace";
const VT = "'VTThreeTwoThree', monospace";
const C = {
  claro: "#ecebe5",
  azul: "#2f5bff",
  tinta: "#16161a",
  laranja: "#ff7a1a",
  azulT: "#2f5bff",
  verde: "#16a34a",
  vermelho: "#e5383b",
  amarelo: "#ffe14d",
  branco: "#ffffff",
  cinza: "#6b6b73",
};

// cenas: início, fim e se o fundo é azul
const CENAS: { de: number; ate: number; azul?: boolean }[] = [
  { de: 0, ate: 172, azul: true },
  { de: 168, ate: 596 },
  { de: 590, ate: 962 },
  { de: 956, ate: 1384, azul: true },
  { de: 1378, ate: 1664 },
  { de: 1658, ate: 2092 },
  { de: 2086, ate: 2222 },
  { de: 2217, ate: DURATION + 10, azul: true },
];
const cenaAtual = (f: number) => {
  let i = 0;
  CENAS.forEach((c, j) => {
    if (f >= c.de) i = j;
  });
  return i;
};

// ---------- fundo claro com quadriculado e textura ----------
const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const i = cenaAtual(f);
  const antes = i > 0 ? +!!CENAS[i - 1].azul : +!!CENAS[0].azul;
  const k =
    antes +
    (+!!CENAS[i].azul - antes) *
      it(f, CENAS[i].de, CENAS[i].de + 10, 0, 1, EASE); // 0 claro, 1 azul
  const linha = k > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(22,22,26,0.06)";
  return (
    <AbsoluteFill style={{ background: mix(C.claro, C.azul, k) }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${linha} 2px, transparent 2px), linear-gradient(90deg, ${linha} 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `0 ${(f * 0.6) % 60}px`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.05) 1.5px, transparent 1.5px)",
          backgroundSize: "7px 7px",
          opacity: 0.7,
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.18)" }} />
    </AbsoluteFill>
  );
};

// ---------- peças ----------
type Pal = { t: string; cor?: string };
const Titulo: React.FC<{
  f: number;
  at: number;
  linhas: Pal[][];
  azul?: boolean;
  size?: number;
  top?: number;
}> = ({ f, at, linhas, azul, size = 62, top = 250 }) => (
  <div
    style={{
      position: "absolute",
      left: 50,
      right: 50,
      top,
      fontFamily: PIX,
      fontSize: size,
      lineHeight: `${size * 1.35}px`,
      color: azul ? C.branco : C.tinta,
    }}
  >
    {linhas.map((l, i) => {
      const k = it(f, at + i * 6, at + i * 6 + 14, 0, 1, SNAP);
      return (
        <div
          key={i}
          style={{
            opacity: Math.min(1, k * 2),
            transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})`,
            transformOrigin: "left center",
            whiteSpace: "nowrap",
          }}
        >
          {l.map((p, j) => (
            <span
              key={j}
              style={{
                color: p.cor,
                textShadow: azul
                  ? "5px 5px 0 rgba(0,0,0,0.25)"
                  : "5px 5px 0 rgba(22,22,26,0.12)",
              }}
            >
              {p.t}
            </span>
          ))}
        </div>
      );
    })}
  </div>
);

const Cartao: React.FC<{
  f: number;
  at: number;
  x?: number;
  y: number;
  w?: number;
  h?: number;
  cor?: string;
  bg?: string;
  rot?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  f,
  at,
  x = 50,
  y,
  w = 980,
  h,
  cor = C.tinta,
  bg = C.branco,
  rot = 0,
  children,
  style,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        background: bg,
        border: `5px solid ${cor}`,
        borderRadius: 18,
        boxShadow: `10px 10px 0 ${C.tinta}`,
        opacity: Math.min(1, k * 2),
        transform: `translateY(${(1 - k) * 50}px) scale(${0.9 + 0.1 * k}) rotate(${rot}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Selo: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  cor: string;
  texto: string;
  fg?: string;
  size?: number;
  rot?: number;
}> = ({ f, at, x, y, cor, texto, fg = C.tinta, size = 30, rot = -3 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, SNAP2);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "14px 22px",
        background: cor,
        color: fg,
        fontFamily: PIX,
        fontSize: size,
        border: `4px solid ${C.tinta}`,
        borderRadius: 12,
        boxShadow: `6px 6px 0 ${C.tinta}`,
        transform: `scale(${k}) rotate(${rot}deg)`,
        transformOrigin: "left center",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// marca-texto amarelo atrás de uma palavra
const Marca: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({
  f,
  at,
  children,
}) => {
  const k = it(f, at, at + 12, 0, 1, OUT);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${C.amarelo}, ${C.amarelo})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${k * 100}% 70%`,
        backgroundPosition: "0 70%",
        padding: "0 6px",
      }}
    >
      {children}
    </span>
  );
};

const Barra: React.FC<{ v: number; cor: string; h?: number }> = ({
  v,
  cor,
  h = 46,
}) => (
  <div
    style={{
      height: h,
      border: `4px solid ${C.tinta}`,
      borderRadius: 10,
      background: "#f3f3f0",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, v)) * 100}%`,
        height: "100%",
        background: cor,
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 14px, transparent 14px 28px)",
      }}
    />
  </div>
);

// cada cena entra e sai deslizando
const Cena: React.FC<{
  i: number;
  children: (f: number) => React.ReactNode;
}> = ({ i, children }) => {
  const f = useCurrentFrame();
  const c = CENAS[i];
  if (f < c.de || f > c.ate) return null;
  const sai = it(f, c.ate - 10, c.ate, 0, 1, IN);
  return (
    <AbsoluteFill
      style={{ opacity: 1 - sai, transform: `translateX(${-sai * 160}px)` }}
    >
      {children(f)}
    </AbsoluteFill>
  );
};

const txt = (size: number, cor: string = C.tinta): React.CSSProperties => ({
  fontFamily: VT,
  fontSize: size,
  lineHeight: `${size * 0.95}px`,
  color: cor,
});

// ---------- cenas ----------
const Abertura: React.FC = () => (
  <Cena i={0}>
    {(f) => (
      <>
        <Selo
          f={f}
          at={8}
          x={50}
          y={300}
          cor={C.amarelo}
          texto="VOCE SABE COMO"
          size={34}
          rot={-2}
        />
        <Selo
          f={f}
          at={22}
          x={50}
          y={390}
          cor={C.branco}
          texto="FUNCIONA A..."
          size={34}
          rot={1}
        />
        <Titulo
          f={f}
          at={T.titulo}
          azul
          top={540}
          size={78}
          linhas={[
            [{ t: "SEMAGLU" }],
            [{ t: "TIDA", cor: C.amarelo }, { t: "?" }],
          ]}
        />
        {["Ozempic®", "Wegovy®", "Rybelsus®"].map((m, j) => (
          <Cartao
            key={m}
            f={f}
            at={T.marcas + j * 7}
            x={50 + j * 330}
            y={830}
            w={300}
            h={110}
            rot={[-3, 2, -1][j]}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={txt(54)}>{m}</span>
          </Cartao>
        ))}
      </>
    )}
  </Cena>
);

const CenaGLP: React.FC = () => (
  <Cena i={1}>
    {(f) => {
      const nat = 1 - it(f, T.minutos + 10, T.minutos + 70, 0, 1, OUT);
      const sem = it(f, T.semana, T.semana + 30, 0, 1, OUT);
      return (
        <>
          <Titulo
            f={f}
            at={T.glp}
            linhas={[
              [{ t: "ELA IMITA" }],
              [{ t: "O " }, { t: "GLP-1", cor: C.laranja }],
            ]}
          />
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 455,
              ...txt(46, C.cinza),
              opacity: P(f, T.glp + 16, T.glp + 26),
            }}
          >
            hormônio do intestino que controla a fome e o açúcar
          </div>
          <Cartao
            f={f}
            at={T.minutos}
            y={560}
            h={200}
            style={{ padding: "22px 30px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                ...txt(54),
              }}
            >
              <span>GLP-1 natural</span>
              <span style={{ color: C.vermelho }}>~2 min</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <Barra v={nat} cor={C.vermelho} />
            </div>
          </Cartao>
          <Cartao
            f={f}
            at={T.semana}
            y={800}
            h={250}
            cor={C.azulT}
            style={{ padding: "22px 30px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                ...txt(54),
              }}
            >
              <span>Semaglutida</span>
              <span style={{ color: C.azulT }}>~7 dias</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <Barra v={sem} cor={C.azulT} />
            </div>
            <div style={{ ...txt(38, C.cinza), marginTop: 16 }}>
              resiste à enzima DPP-4 e se prende à albumina
            </div>
          </Cartao>
          {f >= T.semanal && (
            <div
              style={{
                position: "absolute",
                left: 50,
                top: 1100,
                display: "flex",
                gap: 10,
              }}
            >
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, j) => {
                const k = it(
                  f,
                  T.semanal + j * 2,
                  T.semanal + 10 + j * 2,
                  0,
                  1,
                  SNAP,
                );
                return (
                  <div
                    key={j}
                    style={{
                      width: 70,
                      height: 70,
                      border: `4px solid ${C.tinta}`,
                      borderRadius: 10,
                      background: j === 0 ? C.laranja : C.branco,
                      color: j === 0 ? C.branco : C.tinta,
                      fontFamily: PIX,
                      fontSize: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${k})`,
                    }}
                  >
                    {j === 0 && f > T.semanal + 20 ? "✓" : d}
                  </div>
                );
              })}
            </div>
          )}
          <Selo
            f={f}
            at={T.semanal + 20}
            x={50}
            y={1210}
            cor={C.amarelo}
            texto="1x POR SEMANA"
            size={30}
          />
        </>
      );
    }}
  </Cena>
);

const CenaMecanismo: React.FC = () => (
  <Cena i={2}>
    {(f) => {
      const alvos: [number, string, string, [number, string, string][]][] = [
        [
          T.pancreas,
          "🩸",
          "Pâncreas",
          [
            [T.pancreas + 20, "insulina ↑ só com glicose alta", C.verde],
            [T.glucagon, "glucagon ↓", C.laranja],
          ],
        ],
        [
          T.estomago,
          "🍽️",
          "Estômago",
          [[T.estomago + 15, "a comida sai mais devagar", C.verde]],
        ],
        [
          T.cerebro,
          "🧠",
          "Cérebro",
          [[T.cerebro + 15, "menos fome e menos vontade de comer", C.verde]],
        ],
      ];
      return (
        <>
          <Titulo
            f={f}
            at={T.pancreas - 10}
            linhas={[[{ t: "ONDE ELA " }, { t: "AGE", cor: C.azulT }]]}
          />
          {alvos.map(([at, e, nome, linhas], j) => (
            <Cartao
              key={j}
              f={f}
              at={at}
              y={400 + j * 260}
              h={230}
              rot={j === 1 ? 0.6 : -0.4}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 30px",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 18,
                  background:
                    j === 0 ? "#ffe4e4" : j === 1 ? "#fff1d6" : "#e3e9ff",
                  border: `4px solid ${C.tinta}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: EMOJI,
                  fontSize: 80,
                  flexShrink: 0,
                }}
              >
                {e}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={txt(62)}>{nome}</span>
                  <span
                    style={{
                      fontFamily: PIX,
                      fontSize: 18,
                      background: C.tinta,
                      color: C.branco,
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    ALVO {j + 1}/3
                  </span>
                </div>
                {linhas.map(([t, s, cor], q) =>
                  f < t ? null : (
                    <div
                      key={q}
                      style={{
                        ...txt(44, cor),
                        marginTop: 10,
                        opacity: P(f, t, t + 8),
                        transform: `translateX(${(1 - it(f, t, t + 10, 0, 1, OUT)) * -20}px)`,
                      }}
                    >
                      {s}
                    </div>
                  ),
                )}
              </div>
            </Cartao>
          ))}
        </>
      );
    }}
  </Cena>
);

const CenaStep: React.FC = () => (
  <Cena i={3}>
    {(f) => {
      const v = 14.9 * it(f, T.perda - 40, T.perda, 0, 1, OUT);
      const pulse = Math.max(0, 1 - Math.abs(f - T.perda - 5) / 6) * 0.08;
      return (
        <>
          <Titulo
            f={f}
            at={T.step - 6}
            azul
            linhas={[[{ t: "QUANTO" }], [{ t: "SE PERDE?", cor: C.amarelo }]]}
          />
          <Selo
            f={f}
            at={T.step + 10}
            x={50}
            y={470}
            cor={C.branco}
            texto="ESTUDO STEP 1"
            size={26}
            rot={-2}
          />
          <div
            style={{
              position: "absolute",
              left: 490,
              top: 482,
              ...txt(40, C.branco),
              opacity: P(f, T.step + 20, T.step + 30),
            }}
          >
            2,4 mg/semana · 68 semanas
          </div>
          <Cartao
            f={f}
            at={T.perda - 40}
            y={580}
            h={240}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 36px",
            }}
          >
            <div
              style={{
                fontFamily: PIX,
                fontSize: 96,
                color: C.verde,
                transform: `scale(${1 + pulse})`,
                transformOrigin: "left center",
              }}
            >
              -{v.toFixed(1).replace(".", ",")}%
            </div>
            <div style={txt(44, C.cinza)}>
              do peso
              <br />
              em média
            </div>
          </Cartao>
          <Selo
            f={f}
            at={T.perda + 30}
            x={640}
            y={545}
            cor={C.amarelo}
            texto="placebo: -2,4%"
            size={20}
            rot={4}
          />
          <Cartao
            f={f}
            at={T.metade - 20}
            y={860}
            h={340}
            style={{ padding: "16px 30px" }}
          >
            <div
              style={{
                fontFamily: PIX,
                fontSize: 20,
                color: C.cinza,
                marginBottom: 10,
              }}
            >
              QUANTOS PERDERAM
            </div>
            {STEP1.map((b, j) => {
              const k = it(
                f,
                T.metade - 20 + j * 6,
                T.metade + 20 + j * 6,
                0,
                1,
                OUT,
              );
              const hot =
                (j === 2 && f >= T.metade && f < T.terco) ||
                (j === 3 && f >= T.terco);
              return (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginTop: j ? 12 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 140,
                      ...txt(50, hot ? C.laranja : C.tinta),
                    }}
                  >
                    {b.faixa}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Barra
                      v={(b.pct / 100) * k}
                      cor={hot ? C.laranja : C.azulT}
                      h={46}
                    />
                  </div>
                  <div
                    style={{
                      width: 100,
                      textAlign: "right",
                      ...txt(50, hot ? C.laranja : C.tinta),
                    }}
                  >
                    {Math.round(b.pct * k)}%
                  </div>
                </div>
              );
            })}
          </Cartao>
          {f >= T.metade && (
            <Selo
              f={f}
              at={T.metade}
              x={50}
              y={1230}
              cor={C.laranja}
              fg={C.branco}
              texto={
                f < T.terco ? "METADE: -15% OU MAIS" : "1 EM 3: -20% OU MAIS"
              }
              size={22}
              rot={-2}
            />
          )}
        </>
      );
    }}
  </Cena>
);

const CenaEfeitos: React.FC = () => (
  <Cena i={4}>
    {(f) => {
      const comuns = ["Náusea", "Diarreia", "Vômito", "Prisão de ventre"];
      return (
        <>
          <Titulo
            f={f}
            at={T.efeitos}
            linhas={[[{ t: "EFEITOS" }], [{ t: "COLATERAIS", cor: C.laranja }]]}
          />
          <Cartao
            f={f}
            at={T.efeitos + 30}
            y={470}
            h={480}
            style={{ padding: "24px 34px" }}
          >
            <div style={{ fontFamily: PIX, fontSize: 24, color: C.cinza }}>
              OS MAIS COMUNS
            </div>
            {comuns.map((n, j) => {
              const on = f >= T.comuns[j];
              const k = it(f, T.comuns[j], T.comuns[j] + 8, 0, 1, SNAP2);
              return (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    marginTop: 22,
                  }}
                >
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      border: `5px solid ${C.tinta}`,
                      borderRadius: 10,
                      background: on ? C.laranja : C.branco,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.branco,
                      fontFamily: PIX,
                      fontSize: 30,
                    }}
                  >
                    {on && <span style={{ transform: `scale(${k})` }}>✓</span>}
                  </div>
                  <span style={{ ...txt(62), opacity: on ? 1 : 0.35 }}>
                    {n}
                  </span>
                </div>
              );
            })}
          </Cartao>
          <Cartao
            f={f}
            at={T.raros}
            y={990}
            h={200}
            cor={C.vermelho}
            bg="#fff0f0"
            rot={-1}
            style={{ padding: "20px 34px" }}
          >
            <div style={{ fontFamily: PIX, fontSize: 24, color: C.vermelho }}>
              ⚠ MAIS RAROS
            </div>
            <div style={{ ...txt(56), marginTop: 18 }}>
              pedra na vesícula · pancreatite
            </div>
          </Cartao>
        </>
      );
    }}
  </Cena>
);

const CenaOff: React.FC = () => (
  <Cena i={5}>
    {(f) => {
      const card = (
        at: number,
        titulo: string,
        sub: string,
        j: number,
        cor = C.tinta,
      ) => (
        <Cartao
          f={f}
          at={at}
          y={470 + j * 200}
          h={175}
          cor={cor}
          rot={[-0.6, 0.5, -0.3][j]}
          style={{ padding: "18px 30px" }}
        >
          <div style={txt(52)}>{titulo}</div>
          <div
            style={{
              ...txt(38, cor === C.tinta ? C.cinza : cor),
              marginTop: 10,
            }}
          >
            {sub}
          </div>
        </Cartao>
      );
      const ks = it(f, T.indicacao, T.indicacao + 10, 0, 1, OUT);
      return (
        <>
          <Titulo
            f={f}
            at={T.offlabel}
            linhas={[[{ t: "USO " }, { t: "OFF-LABEL", cor: C.azulT }]]}
          />
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 375,
              ...txt(48),
              opacity: P(f, T.offlabel + 14, T.offlabel + 24),
            }}
          >
            ={" "}
            <Marca f={f} at={T.offlabel + 24}>
              fora da bula
            </Marca>
          </div>
          {card(
            T.ozempic,
            "Ozempic só para emagrecer",
            "na obesidade, a versão aprovada é o Wegovy",
            0,
            C.laranja,
          )}
          {card(T.sop, "Ovários policísticos (SOP)", "uso fora da bula", 1)}
          {card(T.prediab, "Pré-diabetes", "uso fora da bula", 2)}
          {f >= T.indicacao && (
            <div
              style={{
                position: "absolute",
                left: 60,
                top: 1090,
                padding: "18px 30px",
                border: `7px solid ${C.vermelho}`,
                borderRadius: 14,
                color: C.vermelho,
                background: "rgba(255,255,255,0.88)",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 50,
                letterSpacing: 1,
                transform: `scale(${2.2 - 1.2 * ks}) rotate(-6deg)`,
                opacity: Math.min(1, ks * 2),
                whiteSpace: "nowrap",
              }}
            >
              SÓ COM INDICAÇÃO MÉDICA
            </div>
          )}
        </>
      );
    }}
  </Cena>
);

const CenaParar: React.FC = () => (
  <Cena i={6}>
    {(f) => {
      const k = it(f, T.parar, T.cresce + 50, 0, 1, (x) => x);
      const pts = Array.from({ length: 41 }, (_, j) => {
        const u = j / 40;
        const y =
          u < 0.55
            ? 1 - 0.85 * Math.sin(((u / 0.55) * Math.PI) / 2)
            : 0.15 + 0.55 * Math.sin((((u - 0.55) / 0.45) * Math.PI) / 2);
        return [50 + u * 820, 60 + y * 360];
      }).filter((_, j) => j / 40 <= k);
      const corte = P(f, T.cresce - 20, T.cresce);
      return (
        <>
          <Titulo
            f={f}
            at={T.parar}
            linhas={[[{ t: "E SE " }, { t: "PARAR?", cor: C.laranja }]]}
          />
          <Cartao
            f={f}
            at={T.parar + 6}
            y={400}
            h={540}
            style={{ padding: "20px 30px" }}
          >
            <svg width={910} height={470}>
              <line
                x1={50}
                y1={440}
                x2={890}
                y2={440}
                stroke={C.tinta}
                strokeWidth={4}
              />
              <line
                x1={50}
                y1={40}
                x2={50}
                y2={440}
                stroke={C.tinta}
                strokeWidth={4}
              />
              <line
                x1={501}
                y1={40}
                x2={501}
                y2={440}
                stroke={C.vermelho}
                strokeWidth={4}
                strokeDasharray="12 10"
                opacity={corte}
              />
              <text
                x={515}
                y={70}
                fill={C.vermelho}
                fontFamily="'VTThreeTwoThree'"
                fontSize={40}
                opacity={corte}
              >
                parou o remédio
              </text>
              <polyline
                points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="none"
                stroke={C.azulT}
                strokeWidth={10}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <text
                x={60}
                y={468}
                fill={C.cinza}
                fontFamily="'VTThreeTwoThree'"
                fontSize={32}
              >
                peso ao longo do tempo
              </text>
            </svg>
          </Cartao>
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 990,
              ...txt(56),
              opacity: P(f, T.cresce, T.cresce + 10),
            }}
          >
            parte do peso{" "}
            <Marca f={f} at={T.cresce + 8}>
              costuma voltar
            </Marca>
          </div>
        </>
      );
    }}
  </Cena>
);

const Final: React.FC = () => (
  <Cena i={7}>
    {(f) => (
      <Cartao
        f={f}
        at={T.consulte + 4}
        y={300}
        h={420}
        rot={-1.5}
        style={{
          padding: "40px 46px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: PIX, fontSize: 26, color: C.azulT }}>
          LEMBRETE
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 70,
            lineHeight: "82px",
            color: C.tinta,
            marginTop: 18,
          }}
        >
          Consulte um profissional de saúde para orientações.
        </div>
      </Cartao>
    )}
  </Cena>
);

// ---------- a personagem no canto, mudando de "pose" a cada cena ----------
const POSES: { rot: number; flip: boolean; icone: string }[] = [
  { rot: 0, flip: false, icone: "👋" },
  { rot: -4, flip: true, icone: "💡" },
  { rot: 3, flip: false, icone: "👉" },
  { rot: -2, flip: true, icone: "📉" },
  { rot: 4, flip: false, icone: "⚠️" },
  { rot: -3, flip: true, icone: "🤔" },
  { rot: 2, flip: false, icone: "❗" },
  { rot: 0, flip: false, icone: "💙" },
];
const Apresentadora: React.FC = () => {
  const f = useCurrentFrame();
  const i = cenaAtual(f);
  const c = CENAS[i];
  const pose = POSES[i];
  const prev = POSES[Math.max(0, i - 1)];
  const t = it(f, c.de, c.de + 12, 0, 1, EASE);
  const rot = prev.rot + (pose.rot - prev.rot) * t;
  // virada de lado (espelha) com um "giro" achatando no meio
  const a = prev.flip ? -1 : 1,
    b = pose.flip ? -1 : 1;
  const virar = a === b ? a : a * Math.cos(t * Math.PI);
  // pulinho na troca de cena e entrada de baixo no início
  const pulo =
    i === 0
      ? (1 - it(f, 0, 18, 0, 1, SNAP)) * 700
      : -Math.sin(Math.min(1, (f - c.de) / 14) * Math.PI) * 50;
  const squash = 1 + 0.04 * Math.sin(Math.min(1, (f - c.de) / 10) * Math.PI);
  const respira = Math.sin(f / 20) * 4;
  // no final ela vai para o centro e fica maior
  const fim = it(f, T.consulte - 6, T.consulte + 18, 0, 1, EASE);
  const w = 430 + 230 * fim;
  const x = 630 + (210 - 630) * fim;
  const y = 1225 + (790 - 1225) * fim;
  const ki = it(f, c.de + 6, c.de + 16, 0, 1, SNAP2);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + pulo + respira,
          width: w,
          transform: `rotate(${rot}deg) scaleX(${squash}) scaleY(${2 - squash})`,
          transformOrigin: "50% 100%",
          filter: "drop-shadow(10px 10px 0 rgba(22,22,26,0.22))",
        }}
      >
        <div style={{ width: w, transform: `scaleX(${virar})` }}>
          <div
            style={{
              transform: `scale(${w / PW})`,
              transformOrigin: "0 0",
              width: PW,
            }}
          >
            <Personagem f={f} />
          </div>
        </div>
      </div>
      {/* balãozinho com ícone, ao lado da cabeça */}
      <div
        style={{
          position: "absolute",
          left: x - 70 + 40 * fim,
          top: y - 60 + respira,
          width: 120,
          height: 120,
          borderRadius: 26,
          background: C.branco,
          border: `5px solid ${C.tinta}`,
          boxShadow: `6px 6px 0 ${C.tinta}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: EMOJI,
          fontSize: 64,
          transform: `scale(${ki}) rotate(${-8 + 4 * Math.sin(f / 15)}deg)`,
        }}
      >
        {pose.icone}
      </div>
    </>
  );
};

export const VideoSema2: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Abertura />
    <CenaGLP />
    <CenaMecanismo />
    <CenaStep />
    <CenaEfeitos />
    <CenaOff />
    <CenaParar />
    <Final />
    <Apresentadora />
    <Audio src={staticFile("sema/narracao.mp3")} />
    <Audio src={staticFile("sema/musica.wav")} volume={0.11} />
    {SFX.map(([fr, name, vol], i) => (
      <Sequence key={i} from={fr} durationInFrames={60}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
