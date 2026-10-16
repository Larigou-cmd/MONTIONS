import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import {
  Background,
  Grain,
  IN,
  OUT,
  P,
  Part,
  Pill,
  SNAP,
  W,
  bornColor,
  bornGlow,
  it,
  rgba,
} from "../lib";
import { EMOJI } from "../aas/ui";
import { SFX, STEP1, T } from "../sema/config";
import {
  M,
  MercadoAtencao,
  MercadoEstudo,
  MercadoFabrica,
  MercadoLista,
} from "./Mercado";

// Semaglutida no mesmo modelo do vídeo dos prazóis (src/ibp): fundo escuro com brilho na cor
// do remédio, títulos em serifa, cartões arredondados e nenhuma personagem.
// Narração, música e tempos são os mesmos do vídeo sema/ (T em sema/config.ts).
// a narração ganhou o trecho das canetas nacionais (48,9 s = 1466 quadros) antes da mensagem final
const EXTRA = 1466;
export const DURATION = 2400 + EXTRA;
const CONSULTE = T.consulte + EXTRA;
const COR = "#38bdf8"; // cor do remédio
const VERDE = "#4ade80";
const PULSOS = [
  T.titulo,
  T.semanal,
  T.perda,
  T.indicacao,
  M.ozivy,
  M.molecula,
  M.efeitos,
];
const SONS: [number, string, number][] = [
  ...SFX.map(
    ([fr, n, v]) =>
      [fr >= T.consulte ? fr + EXTRA : fr, n, v] as [number, string, number],
  ),
  [M.novidade, "whoosh", 0.25],
  [M.patente, "pop", 0.2],
  [M.ozivy, "pop", 0.2],
  [M.molecula, "whoosh", 0.25],
  [M.igual, "whoosh", 0.25],
  [M.efeitos, "plim", 0.2],
  [M.atencao, "whoosh", 0.25],
  [M.receita, "trava", 0.25],
];

const Titulo: React.FC<{
  f: number;
  at: number;
  children: React.ReactNode;
  top?: number;
  size?: number;
}> = ({ f, at, children, top = 250, size = 66 }) => (
  <div
    style={{
      position: "absolute",
      top,
      width: W,
      textAlign: "center",
      fontFamily: SERIF,
      fontSize: size,
      color: bornColor(f, at, C.ink, COR),
      textShadow: bornGlow(f, at, COR),
      opacity: it(f, at, at + 12, 0, 1, OUT),
      transform: `translateY(${(1 - it(f, at, at + 14, 0, 1, OUT)) * 30}px)`,
    }}
  >
    {children}
  </div>
);

const Caixa: React.FC<{
  f: number;
  at: number;
  x?: number;
  y: number;
  w?: number;
  h: number;
  borda?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  de?: "esq" | "baixo";
}> = ({
  f,
  at,
  x = 70,
  y,
  w = 940,
  h,
  borda,
  children,
  style,
  de = "baixo",
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  const mov =
    de === "esq"
      ? `translateX(${(1 - k) * -90}px)`
      : `translateY(${(1 - k) * 70}px)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: 30,
        background: C.box,
        border: `2px solid ${borda ?? C.boxBorder}`,
        boxShadow: borda
          ? `0 0 26px ${rgba(borda, 0.22)}`
          : "0 18px 50px rgba(0,0,0,.35)",
        opacity: Math.min(1, k * 1.3),
        transform: mov,
        fontFamily: SANS,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Barra: React.FC<{ v: number; cor: string; h?: number }> = ({
  v,
  cor,
  h = 26,
}) => (
  <div
    style={{
      height: h,
      borderRadius: h,
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, v)) * 100}%`,
        height: "100%",
        borderRadius: h,
        background: cor,
        boxShadow: `0 0 18px ${rgba(cor, 0.6)}`,
      }}
    />
  </div>
);

// caneta de aplicação semanal desenhada
const Caneta: React.FC<{ f: number; k: number }> = ({ f, k }) => (
  <svg width={W} height={700} style={{ position: "absolute", top: 260 }}>
    <g
      transform={`translate(540 330) rotate(${-28 + Math.sin(f / 30) * 4}) scale(${k})`}
    >
      <circle r={260} fill={rgba(COR, 0.12)} style={{ filter: "blur(40px)" }} />
      <rect x={-300} y={-46} width={470} height={92} rx={46} fill="#e6f4ff" />
      <rect
        x={-120}
        y={-30}
        width={190}
        height={60}
        rx={14}
        fill={rgba(COR, 0.85)}
      />
      <rect
        x={-100}
        y={-16}
        width={150}
        height={32}
        rx={8}
        fill="#0b2540"
        opacity={0.35}
      />
      <rect x={170} y={-40} width={90} height={80} rx={20} fill={COR} />
      <rect x={260} y={-10} width={40} height={20} rx={6} fill="#9fb3c8" />
      <rect x={-340} y={-34} width={44} height={68} rx={12} fill="#9fb3c8" />
      {Array.from({ length: 4 }, (_, i) => (
        <rect
          key={i}
          x={185 + i * 18}
          y={-40}
          width={6}
          height={80}
          fill="#0b2540"
          opacity={0.25}
        />
      ))}
    </g>
  </svg>
);

// ---------- 1. abertura ----------
const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, 6, 30, 0, 1, SNAP);
  return (
    <Part from={0} to={172} outDur={10}>
      <Caneta f={f} k={k} />
      <Titulo f={f} at={T.titulo} top={900} size={110}>
        Semaglutida
      </Titulo>
      {["Ozempic®", "Wegovy®", "Rybelsus®"].map((m, i) => (
        <Pill
          key={m}
          x={230 + i * 310}
          y={1110}
          text={m}
          color={COR}
          size={40}
          k={P(f, T.marcas + i * 7, T.marcas + 12 + i * 7)}
        />
      ))}
    </Part>
  );
};

// ---------- 2. imita o GLP-1 ----------
const ParteGLP: React.FC = () => {
  const f = useCurrentFrame();
  const nat = 1 - it(f, T.minutos + 10, T.minutos + 70, 0, 1, OUT);
  const sem = it(f, T.semana, T.semana + 30, 0, 1, OUT);
  return (
    <Part from={168} to={598} inY={100}>
      <Titulo f={f} at={T.glp}>
        Ela imita o <span style={{ color: COR, fontWeight: 600 }}>GLP-1</span>
      </Titulo>
      <div
        style={{
          position: "absolute",
          top: 350,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 36,
          color: C.dim,
          opacity: P(f, T.glp + 14, T.glp + 26),
        }}
      >
        hormônio do intestino que controla a fome e o açúcar
      </div>
      <Caixa
        f={f}
        at={T.minutos}
        y={470}
        h={190}
        style={{ padding: "28px 40px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 44,
            fontWeight: 600,
            color: C.ink,
          }}
        >
          <span>GLP-1 natural</span>
          <span style={{ color: C.alert }}>~2 minutos</span>
        </div>
        <div style={{ marginTop: 26 }}>
          <Barra v={nat} cor={C.alert} />
        </div>
      </Caixa>
      <Caixa
        f={f}
        at={T.semana}
        y={700}
        h={250}
        borda={COR}
        style={{ padding: "28px 40px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 44,
            fontWeight: 600,
            color: C.ink,
          }}
        >
          <span style={{ fontFamily: SERIF }}>Semaglutida</span>
          <span style={{ color: COR }}>~7 dias</span>
        </div>
        <div style={{ marginTop: 26 }}>
          <Barra v={sem} cor={COR} />
        </div>
        <div style={{ fontSize: 30, color: C.dim, marginTop: 22 }}>
          resiste à enzima DPP-4 e se prende à albumina
        </div>
      </Caixa>
      {f >= T.semanal && (
        <div
          style={{
            position: "absolute",
            top: 1010,
            width: W,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => {
            const k = it(
              f,
              T.semanal + i * 2,
              T.semanal + 12 + i * 2,
              0,
              1,
              SNAP,
            );
            return (
              <div
                key={i}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  border: `2.5px solid ${i === 0 ? COR : C.boxBorder}`,
                  background: i === 0 ? rgba(COR, 0.25) : C.box,
                  color: i === 0 ? COR : C.dim,
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${k})`,
                  boxShadow: i === 0 ? `0 0 24px ${rgba(COR, 0.45)}` : "none",
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      )}
      <Pill
        x={540}
        y={1190}
        text="1x por semana"
        color={COR}
        size={44}
        k={P(f, T.semanal + 18, T.semanal + 30)}
      />
    </Part>
  );
};

// ---------- 3. onde ela age ----------
const ParteMecanismo: React.FC = () => {
  const f = useCurrentFrame();
  const alvos: [number, string, string, [number, string, string][]][] = [
    [
      T.pancreas,
      "🩸",
      "Pâncreas",
      [
        [T.pancreas + 20, "Insulina ↑ só quando a glicose está alta", VERDE],
        [T.glucagon, "Glucagon ↓", C.num],
      ],
    ],
    [
      T.estomago,
      "🍽️",
      "Estômago",
      [[T.estomago + 15, "A comida sai mais devagar", VERDE]],
    ],
    [
      T.cerebro,
      "🧠",
      "Cérebro",
      [[T.cerebro + 15, "Menos fome e menos vontade de comer", VERDE]],
    ],
  ];
  return (
    <Part from={590} to={964} inY={100}>
      <Titulo f={f} at={T.pancreas - 10}>
        Onde ela age
      </Titulo>
      {alvos.map(([at, e, nome, linhas], i) => {
        const ativo = f >= at && (i === 2 || f < alvos[i + 1][0]);
        return (
          <Caixa
            key={i}
            f={f}
            at={at}
            y={390 + i * 270}
            h={240}
            de="esq"
            borda={ativo ? COR : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 36px",
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                background: rgba(COR, 0.14),
                border: `2.5px solid ${rgba(COR, 0.6)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: EMOJI,
                fontSize: 66,
                flexShrink: 0,
              }}
            >
              {e}
            </div>
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 54,
                  color: bornColor(f, at, C.ink, COR),
                }}
              >
                {nome}
              </div>
              {linhas.map(([t, s, cor], j) =>
                f < t ? null : (
                  <div
                    key={j}
                    style={{
                      fontSize: 34,
                      fontWeight: 600,
                      color: cor,
                      marginTop: 8,
                      opacity: P(f, t, t + 10),
                    }}
                  >
                    {s}
                  </div>
                ),
              )}
            </div>
          </Caixa>
        );
      })}
    </Part>
  );
};

// ---------- 4. estudo STEP 1 ----------
const ParteStep: React.FC = () => {
  const f = useCurrentFrame();
  const v = 14.9 * it(f, T.perda - 40, T.perda, 0, 1, OUT);
  const glow = Math.max(0, 1 - Math.abs(f - T.perda - 5) / 14);
  return (
    <Part from={956} to={1386} inY={100}>
      <Titulo f={f} at={T.step}>
        Quanto peso se perde?
      </Titulo>
      <div
        style={{
          position: "absolute",
          top: 350,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 34,
          color: C.dim,
          opacity: P(f, T.step + 14, T.step + 26),
        }}
      >
        Estudo STEP 1 · 2,4 mg por semana · 68 semanas
      </div>
      {f >= T.perda - 40 && (
        <div
          style={{
            position: "absolute",
            top: 430,
            width: W,
            textAlign: "center",
            opacity: P(f, T.perda - 40, T.perda - 28),
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 190,
              lineHeight: "200px",
              color: VERDE,
              textShadow: `0 0 ${20 + 40 * glow}px ${rgba(VERDE, 0.4 + 0.4 * glow)}`,
              transform: `scale(${1 + 0.06 * glow})`,
            }}
          >
            −{v.toFixed(1).replace(".", ",")}%
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 38,
              color: C.ink,
              marginTop: 6,
            }}
          >
            do peso, em média
          </div>
        </div>
      )}
      <Pill
        x={540}
        y={760}
        text="placebo: −2,4%"
        color={C.dim}
        size={34}
        k={P(f, T.perda + 20, T.perda + 32)}
      />
      <Caixa
        f={f}
        at={T.metade - 20}
        y={840}
        h={380}
        style={{ padding: "26px 40px" }}
      >
        <div
          style={{
            fontSize: 30,
            color: C.dim,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Quantos perderam
        </div>
        {STEP1.map((b, i) => {
          const k = it(
            f,
            T.metade - 20 + i * 6,
            T.metade + 20 + i * 6,
            0,
            1,
            OUT,
          );
          const hot =
            (i === 2 && f >= T.metade && f < T.terco) ||
            (i === 3 && f >= T.terco);
          const cor = hot ? C.num : COR;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginTop: 22,
              }}
            >
              <div
                style={{
                  width: 130,
                  fontSize: 38,
                  fontWeight: 700,
                  color: hot ? C.num : C.ink,
                }}
              >
                {b.faixa}
              </div>
              <div style={{ flex: 1 }}>
                <Barra v={(b.pct / 100) * k} cor={cor} h={30} />
              </div>
              <div
                style={{
                  width: 90,
                  textAlign: "right",
                  fontSize: 38,
                  fontWeight: 700,
                  color: hot ? C.num : C.ink,
                }}
              >
                {Math.round(b.pct * k)}%
              </div>
            </div>
          );
        })}
      </Caixa>
      {f >= T.metade && (
        <div
          style={{
            position: "absolute",
            top: 1260,
            width: W,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: C.num,
            opacity: P(f, T.metade, T.metade + 10),
          }}
        >
          {f < T.terco
            ? "Metade perdeu 15% ou mais"
            : "1 em cada 3 perdeu 20% ou mais"}
        </div>
      )}
    </Part>
  );
};

// ---------- 5. efeitos colaterais ----------
const ParteEfeitos: React.FC = () => {
  const f = useCurrentFrame();
  const comuns: [string, string][] = [
    ["🤢", "Náusea"],
    ["💧", "Diarreia"],
    ["🤮", "Vômito"],
    ["⏳", "Prisão de ventre"],
  ];
  return (
    <Part from={1378} to={1666} inY={100}>
      <Titulo f={f} at={T.efeitos}>
        Efeitos colaterais
      </Titulo>
      <div
        style={{
          position: "absolute",
          top: 370,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 3,
          color: COR,
          opacity: P(f, T.efeitos + 10, T.efeitos + 20),
        }}
      >
        MAIS COMUNS
      </div>
      {comuns.map(([e, n], i) => (
        <Caixa
          key={i}
          f={f}
          at={T.comuns[i]}
          x={70 + (i % 2) * 480}
          y={440 + Math.floor(i / 2) * 230}
          w={460}
          h={200}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ fontFamily: EMOJI, fontSize: 64 }}>{e}</span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 44,
              color: C.ink,
            }}
          >
            {n}
          </span>
        </Caixa>
      ))}
      <div
        style={{
          position: "absolute",
          top: 960,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 3,
          color: C.alert,
          opacity: P(f, T.raros, T.raros + 10),
        }}
      >
        MAIS RAROS
      </div>
      {["Pedra na vesícula", "Pancreatite"].map((n, i) => (
        <Caixa
          key={n}
          f={f}
          at={T.raros + i * 12}
          x={70 + i * 480}
          y={1030}
          w={460}
          h={150}
          borda={C.alert}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 42,
            color: C.ink,
          }}
        >
          {n}
        </Caixa>
      ))}
    </Part>
  );
};

// ---------- 6. usos off-label ----------
const ParteOff: React.FC = () => {
  const f = useCurrentFrame();
  const ks = it(f, T.indicacao, T.indicacao + 14, 0, 1, SNAP);
  const cards: [number, string, string, string?][] = [
    [
      T.ozempic,
      "Ozempic só para emagrecer",
      "Na obesidade, a versão aprovada é o Wegovy",
      C.num,
    ],
    [T.sop, "Síndrome dos ovários policísticos", "Uso fora da bula"],
    [T.prediab, "Pré-diabetes", "Uso fora da bula"],
  ];
  return (
    <Part from={1658} to={2094} inY={100}>
      <Titulo f={f} at={T.offlabel}>
        Usos <span style={{ color: COR, fontWeight: 600 }}>off-label</span>
      </Titulo>
      <div
        style={{
          position: "absolute",
          top: 350,
          width: W,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 36,
          color: C.dim,
          opacity: P(f, T.offlabel + 14, T.offlabel + 26),
        }}
      >
        = fora da bula
      </div>
      {cards.map(([at, t, s, cor], i) => (
        <Caixa
          key={i}
          f={f}
          at={at}
          y={440 + i * 200}
          h={175}
          de="esq"
          borda={cor}
          style={{ padding: "26px 40px" }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 46,
              color: C.ink,
            }}
          >
            {t}
          </div>
          <div style={{ fontSize: 31, color: cor ?? C.dim, marginTop: 10 }}>
            {s}
          </div>
        </Caixa>
      ))}
      {f >= T.indicacao && (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 1090,
            width: 900,
            height: 120,
            borderRadius: 60,
            background: rgba(C.alert, 0.14),
            border: `2.5px solid ${C.alert}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 42,
            color: C.ink,
            opacity: Math.min(1, ks * 1.4),
            transform: `scale(${0.8 + 0.2 * ks})`,
            boxShadow: `0 0 40px ${rgba(C.alert, 0.3)}`,
          }}
        >
          Só com indicação médica
        </div>
      )}
    </Part>
  );
};

// ---------- 7. e se parar? ----------
const ParteParar: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, T.parar, T.cresce + 50, 0, 1, (x) => x);
  const pts = Array.from({ length: 41 }, (_, j) => {
    const u = j / 40;
    const y =
      u < 0.55
        ? 1 - 0.85 * Math.sin(((u / 0.55) * Math.PI) / 2)
        : 0.15 + 0.55 * Math.sin((((u - 0.55) / 0.45) * Math.PI) / 2);
    return [60 + u * 800, 60 + y * 380];
  }).filter((_, j) => j / 40 <= k);
  const corte = P(f, T.cresce - 20, T.cresce);
  return (
    <Part from={2086} to={2224} inY={100} outDur={8}>
      <Titulo f={f} at={T.parar}>
        E se parar?
      </Titulo>
      <Caixa
        f={f}
        at={T.parar + 6}
        y={400}
        h={560}
        style={{ padding: "30px 40px" }}
      >
        <svg width={860} height={500}>
          <line
            x1={60}
            y1={460}
            x2={860}
            y2={460}
            stroke={C.dim}
            strokeWidth={3}
            opacity={0.5}
          />
          <line
            x1={60}
            y1={40}
            x2={60}
            y2={460}
            stroke={C.dim}
            strokeWidth={3}
            opacity={0.5}
          />
          <line
            x1={500}
            y1={40}
            x2={500}
            y2={460}
            stroke={C.alert}
            strokeWidth={3}
            strokeDasharray="10 9"
            opacity={corte}
          />
          <text
            x={514}
            y={70}
            fill={C.alert}
            fontFamily="Inter"
            fontWeight={600}
            fontSize={32}
            opacity={corte}
          >
            parou o remédio
          </text>
          <polyline
            points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={COR}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 10px ${rgba(COR, 0.7)})` }}
          />
          <text x={70} y={494} fill={C.dim} fontFamily="Inter" fontSize={28}>
            peso ao longo do tempo
          </text>
        </svg>
      </Caixa>
      <div
        style={{
          position: "absolute",
          top: 1010,
          width: W,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 56,
          color: bornColor(f, T.cresce, C.ink, C.alert),
          opacity: P(f, T.cresce, T.cresce + 12),
        }}
      >
        Parte do peso costuma voltar
      </div>
    </Part>
  );
};

// ---------- 8. mensagem final ----------
const Final: React.FC = () => {
  const f = useCurrentFrame();
  if (f < CONSULTE) return null;
  const linhas = ["Consulte um", "profissional de saúde", "para orientações."];
  return (
    <AbsoluteFill
      style={{ opacity: it(f, CONSULTE, CONSULTE + 12, 0, 1, OUT) }}
    >
      {linhas.map((l, i) => {
        const at = CONSULTE + 4 + i * 8;
        const k = it(f, at, at + 14, 0, 1, OUT);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 760 + i * 110,
              width: W,
              textAlign: "center",
              fontFamily: SERIF,
              fontWeight: i === 1 ? 600 : 400,
              fontSize: i === 1 ? 92 : 80,
              color:
                i === 1
                  ? bornColor(f, at, COR, "#f0f9ff", 20)
                  : bornColor(f, at, C.ink, COR),
              textShadow: i === 1 ? `0 0 30px ${rgba(COR, 0.45)}` : "none",
              opacity: k,
              transform: `translateY(${(1 - k) * 40}px)`,
              filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
            }}
          >
            {l}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const VideoSemaIBP: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background color={COR} pulses={PULSOS} />
      {/* desce o conteúdo para ficar no meio da tela */}
      <AbsoluteFill style={{ transform: "translateY(170px)" }}>
        <Abertura />
        <ParteGLP />
        <ParteMecanismo />
        <ParteStep />
        <ParteEfeitos />
        <ParteOff />
        <ParteParar />
        <MercadoLista />
        <MercadoFabrica />
        <MercadoEstudo />
        <MercadoAtencao />
      </AbsoluteFill>
      <Final />
      <Grain />
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: it(f, DURATION - 12, DURATION, 0, 1, IN),
          pointerEvents: "none",
        }}
      />
      <Audio src={staticFile("sema/narracao_mercado.mp3")} />
      <Audio src={staticFile("sema/musica_longa.wav")} volume={0.11} />
      {SONS.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
