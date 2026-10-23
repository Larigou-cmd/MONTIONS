import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OUT, P, it } from "../lib";
import { EMOJI } from "../aas/ui";
import { JORNAL, MAO, SANS } from "../fonts";
import {
  Capitulo,
  Carimbo,
  Cartao,
  Fundo,
  Kicker,
  Manchete,
  Marca,
  Nota,
  Recorte,
  Traco,
  V,
  check,
  circulo,
  xis,
} from "../sarampo/Vox";

// Antídotos que todo farmacêutico deve saber: flumazenil e N-acetilcisteína, no estilo Vox
// (mesmas peças de papel do sarampo/Vox.tsx). Sem legenda. Roteiro: roteiros/antidotos_vox.md.
// Narração: ElevenLabs, Juliana (take 1). Tempos: audio/antidotos_palavras.json (quadro = segundos × 30).
const s = (seg: number) => Math.round(seg * 30);

// TEMPOS
export const T = {
  flumazenil: s(8.8),
  nac: s(9.96),
  benzo: s(13.7),
  diazepam: s(15.44),
  clonazepam: s(16.28),
  midazolam: s(17.36),
  receptor: s(19.82),
  lento: s(22.28),
  sono: s(23.36),
  relaxam: s(24.14),
  semAcordar: s(27.16),
  encaixa: s(29.48),
  empurra: s(31.64),
  semAtivar: s(34.14),
  minutos: s(35.88),
  acordar: s(38.1),
  duraPouco: s(39.22),
  umaHora: s(40.54),
  voltarDormir: s(44.16),
  abstinencia: s(48.32),
  antidepressivos: s(52.44),
  convulsao: s(54.68),
  hospital: s(57.3),
  paracetamol: s(62.44),
  figado: s(63.84),
  toxica: s(67.52),
  napqi: s(68.9),
  glutationa: s(72.66),
  neutraliza: s(73.6),
  doseAlta: s(75.72),
  acaba: s(77.82),
  destruir: s(80.08),
  repoe: s(83.74),
  materia: s(84.5),
  volta: s(87.02),
  neutralizar: s(88.66),
  oito: s(92.94),
  ingestao: s(94.3),
  procure: s(98.14),
  pareca: s(100.76),
  naloxona2: s(102.86),
  flumazenil2: s(104.76),
  nac2: s(107.2),
  siga: s(109.68),
  final: s(114.22),
};
export const DURATION = s(118.8);

// [início, fim] de cada cena
export const PARTES: [number, number][] = [
  [0, s(11.8)],
  [s(11.8), s(28.05)],
  [s(28.05), s(38.8)],
  [s(38.8), s(59.55)],
  [s(59.55), s(81.85)],
  [s(81.85), s(90.45)],
  [s(90.45), s(101.75)],
  [s(101.75), s(109.6)],
  [s(109.6), s(114.15)],
  [s(114.15), DURATION],
];
const R = (i: number) => PARTES[i];
const W = 1080;

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

// ---------- peças deste vídeo ----------
// caixinha de remédio recortada
const Caixinha: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  nome: string;
  rot: number;
}> = ({ f, at, x, y, nome, rot }) => (
  <Cartao f={f} at={at} x={x} y={y} w={290} h={170} rot={rot} fundo="#ffffff">
    <div style={{ height: 34, background: V.azul }} />
    <div
      style={{
        fontFamily: JORNAL,
        fontWeight: 900,
        fontSize: 40,
        color: V.tinta,
        textAlign: "center",
        marginTop: 26,
      }}
    >
      {nome}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 14,
        background: V.vermelho,
      }}
    />
  </Cartao>
);

// receptor GABA desenhado: bloco com um "encaixe" em cima; a peça que está encaixada
// e a que chega podem ser animadas por fora (x/y em px do svg)
const Receptor: React.FC<{
  w: number;
  pecas: { cor: string; x: number; y: number; rot?: number; o?: number }[];
}> = ({ w, pecas }) => (
  <svg width={w} height={460} viewBox="0 0 600 460">
    {pecas.map((p, i) => (
      <g
        key={i}
        opacity={p.o ?? 1}
        transform={`translate(${p.x} ${p.y}) rotate(${p.rot ?? 0} 60 50)`}
      >
        <path
          d="M 0 0 L 120 0 L 120 40 L 90 40 L 90 100 L 30 100 L 30 40 L 0 40 Z"
          fill={p.cor}
          stroke={V.tinta}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </g>
    ))}
    <path
      d="M 60 200 L 240 200 L 240 140 L 270 140 L 270 200 L 330 200 L 330 140 L 360 140 L 360 200 L 540 200 L 540 420 Q 540 440 520 440 L 80 440 Q 60 440 60 420 Z"
      fill="#e9d8b4"
      stroke={V.tinta}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <text
      x={300}
      y={340}
      textAnchor="middle"
      fontFamily={JORNAL}
      fontWeight={900}
      fontSize={54}
      fill={V.tinta}
    >
      receptor GABA
    </text>
  </svg>
);

// barra que enche/esvazia (escudo da glutationa)
const Barra: React.FC<{ k: number; cor: string }> = ({ k, cor }) => (
  <div
    style={{
      width: 700,
      height: 70,
      border: `5px solid ${V.tinta}`,
      borderRadius: 14,
      background: V.creme,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, k)) * 100}%`,
        height: "100%",
        background: cor,
      }}
    />
  </div>
);

// fígado desenhado à mão
const Figado: React.FC<{ cor: string; w?: number }> = ({ cor, w = 420 }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 420 260">
    <path
      d="M 20 90 C 30 30 120 10 220 20 C 330 30 410 40 400 90 C 392 140 330 170 260 200 C 200 228 150 250 110 236 C 60 220 12 160 20 90 Z"
      fill={cor}
      stroke={V.tinta}
      strokeWidth={6}
    />
    <path
      d="M 230 30 C 220 90 230 150 210 214"
      stroke={V.tinta}
      strokeWidth={4}
      fill="none"
      opacity={0.5}
    />
  </svg>
);

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={0}>
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 160,
        width: 940,
        opacity: it(f, 2, 14, 0, 1, OUT),
      }}
    >
      <Kicker>Farmácia de emergência</Kicker>
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
        Antídotos que todo farmacêutico{" "}
        <Marca f={f} at={40}>
          deve saber
        </Marca>
      </div>
    </div>
    <Recorte f={f} at={10} x={110} y={640} w={860} rot={-2.5} seed={2}>
      <Kicker cor={V.cinza} size={22}>
        Já vimos no canal
      </Kicker>
      <Manchete size={56}>
        <Marca f={f} at={30}>
          Naloxona
        </Marca>{" "}
        reverte a overdose de opioides
      </Manchete>
    </Recorte>
    <Traco
      f={f}
      at={45}
      d={check(120)}
      x={830}
      y={600}
      w={120}
      h={120}
      cor={V.verde}
      esp={14}
    />
    {(
      [
        ["Flumazenil", T.flumazenil, 110, -3],
        ["N-acetilcisteína", T.nac, 560, 2.5],
      ] as [string, number, number, number][]
    ).map(([nome, at, x, rot]) => {
      const vira = it(f, at, at + 12, 0, 1, OUT);
      return (
        <Cartao
          key={nome}
          f={f}
          at={s(7.0)}
          x={x}
          y={1000}
          w={410}
          h={300}
          rot={rot}
          fundo={vira > 0.5 ? V.creme : V.tinta}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 20,
              boxSizing: "border-box",
              transform: `scaleX(${Math.abs(1 - 2 * vira)})`,
              fontFamily: JORNAL,
              fontWeight: 900,
              fontSize: vira > 0.5 ? 52 : 150,
              color: vira > 0.5 ? V.tinta : V.amarelo,
            }}
          >
            {vira > 0.5 ? nome : "?"}
          </div>
        </Cartao>
      );
    })}
  </Cena>
);

const S2: React.FC<{ f: number }> = ({ f }) => {
  const encaixe = it(f, T.receptor, T.receptor + 18, 0, 1, OUT);
  return (
    <Cena f={f} i={1}>
      <Capitulo f={f} at={R(1)[0]} kicker="Antídoto nº 1">
        Flumazenil
      </Capitulo>
      <Nota f={f} at={T.benzo} x={70} y={320} rot={-2} size={54} w={940}>
        reverte os benzodiazepínicos ↓
      </Nota>
      <Caixinha f={f} at={T.diazepam} x={60} y={430} nome="diazepam" rot={-4} />
      <Caixinha
        f={f}
        at={T.clonazepam}
        x={395}
        y={450}
        nome="clonazepam"
        rot={2}
      />
      <Caixinha
        f={f}
        at={T.midazolam}
        x={730}
        y={425}
        nome="midazolam"
        rot={-1.5}
      />
      {f >= T.receptor - 10 && (
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 680,
            opacity: P(f, T.receptor - 10, T.receptor),
          }}
        >
          <Receptor
            w={600}
            pecas={[{ cor: V.azul, x: 240, y: 100 - (1 - encaixe) * 120 + 0 }]}
          />
        </div>
      )}
      <Nota
        f={f}
        at={T.receptor + 14}
        x={660}
        y={700}
        rot={-6}
        size={46}
        w={360}
      >
        ← benzodiazepínico
      </Nota>
      <div
        style={{
          position: "absolute",
          top: 1180,
          width: W,
          textAlign: "center",
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 62,
          color: V.tinta,
          opacity: P(f, T.lento - 6, T.lento + 4),
        }}
      >
        cérebro{" "}
        <Marca f={f} at={T.lento}>
          mais lento
        </Marca>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          width: W,
          display: "flex",
          justifyContent: "center",
          gap: 34,
          fontFamily: MAO,
          fontWeight: 700,
          fontSize: 58,
        }}
      >
        {(
          [
            ["sono", T.sono, V.tinta],
            ["relaxa", T.relaxam, V.tinta],
            ["não acorda", T.semAcordar, V.vermelho],
          ] as [string, number, string][]
        ).map(([t, at, cor]) => (
          <span
            key={t}
            style={{
              color: cor,
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

const S3: React.FC<{ f: number }> = ({ f }) => {
  // flumazenil (verde) desce no encaixe e o benzodiazepínico (azul) sai para a esquerda
  const chega = it(f, T.encaixa, T.encaixa + 20, 0, 1, OUT);
  const empurra = it(f, T.empurra, T.empurra + 24, 0, 1, OUT);
  return (
    <Cena f={f} i={2}>
      <Capitulo f={f} at={R(2)[0]} kicker="Como ele age">
        Empurra o benzo{" "}
        <Marca f={f} at={T.empurra}>
          para fora
        </Marca>
      </Capitulo>
      <div style={{ position: "absolute", left: 240, top: 480 }}>
        <Receptor
          w={600}
          pecas={[
            {
              cor: V.azul,
              x: 240 - empurra * 230,
              y: 100 - empurra * 90,
              rot: -empurra * 25,
              o: 1 - P(f, T.empurra + 30, T.empurra + 50) * 0.6,
            },
            {
              cor: V.verde,
              x: 240 + (1 - chega) * 300 - (1 - empurra) * 0,
              y:
                empurra > 0
                  ? 100 - (1 - empurra) * 100
                  : -20 - (1 - chega) * 60,
              o: chega,
            },
          ]}
        />
      </div>
      <Nota
        f={f}
        at={T.encaixa + 10}
        x={660}
        y={420}
        rot={-5}
        size={46}
        w={380}
        cor={V.verde}
      >
        flumazenil ↓
      </Nota>
      <Nota f={f} at={T.semAtivar} x={120} y={1000} rot={-3} size={60} w={860}>
        encaixa, mas não ativa nada!
      </Nota>
      <Cartao
        f={f}
        at={T.minutos - 6}
        x={150}
        y={1120}
        w={360}
        h={260}
        rot={-3}
        fundo="#ffffff"
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: EMOJI,
            fontSize: 80,
            marginTop: 20,
          }}
        >
          ⏱️
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: JORNAL,
            fontWeight: 900,
            fontSize: 54,
            color: V.tinta,
          }}
        >
          1 a 2 min
        </div>
      </Cartao>
      <Nota
        f={f}
        at={T.acordar - 10}
        x={560}
        y={1200}
        rot={-6}
        size={70}
        w={460}
        cor={V.verde}
      >
        acorda! ✓
      </Nota>
    </Cena>
  );
};

const S4: React.FC<{ f: number }> = ({ f }) => {
  const curta = it(f, T.umaHora - 10, T.umaHora + 20, 0, 1, OUT);
  const longa = it(f, T.voltarDormir - 40, T.voltarDormir + 10, 0, 1, OUT);
  return (
    <Cena f={f} i={3}>
      <Capitulo f={f} at={R(3)[0]} kicker="O cuidado">
        Ele{" "}
        <Marca f={f} at={T.duraPouco} cor="#ffb3b3">
          dura pouco
        </Marca>
      </Capitulo>
      <Cartao f={f} at={T.duraPouco} x={70} y={350} w={940} h={360} rot={-0.8}>
        <div style={{ padding: "34px 40px" }}>
          {(
            [
              ["flumazenil", V.verde, curta * 0.32, "≈ 1 hora"],
              ["benzodiazepínico", V.azul, longa * 0.92, "horas…"],
            ] as [string, string, number, string][]
          ).map(([nome, cor, k, rot], i) => (
            <div key={nome} style={{ marginBottom: 34 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 32,
                  color: V.tinta,
                  opacity:
                    i === 0
                      ? 1
                      : P(f, T.voltarDormir - 40, T.voltarDormir - 30),
                }}
              >
                {nome}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    width: `${k * 100}%`,
                    height: 50,
                    background: cor,
                    borderRadius: 8,
                  }}
                />
                <span
                  style={{
                    fontFamily: MAO,
                    fontWeight: 700,
                    fontSize: 46,
                    color: cor,
                    opacity: k > 0.05 ? 1 : 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {rot}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Cartao>
      <Nota
        f={f}
        at={T.voltarDormir}
        x={380}
        y={720}
        rot={-4}
        size={56}
        w={640}
      >
        pode voltar a dormir 😴
      </Nota>
      <Recorte
        f={f}
        at={T.abstinencia - 8}
        x={80}
        y={840}
        w={920}
        rot={1.2}
        seed={5}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: V.tinta,
            lineHeight: 1.35,
          }}
        >
          <div>
            usa há muito tempo →{" "}
            <Marca f={f} at={T.abstinencia}>
              abstinência forte
            </Marca>
          </div>
          <div
            style={{
              marginTop: 22,
              position: "relative",
              opacity: P(f, T.antidepressivos - 10, T.antidepressivos),
            }}
          >
            misturou com outras substâncias
            <br />
            (ex.: antidepressivos) →{" "}
            <span
              style={{
                position: "relative",
                display: "table",
                margin: "22px 0 0 40px",
                color: V.vermelho,
                fontWeight: 900,
                fontSize: 50,
              }}
            >
              convulsão
              <Traco
                f={f}
                at={T.convulsao + 6}
                d={circulo(330, 96)}
                x={-36}
                y={-12}
                w={330}
                h={96}
              />
            </span>
          </div>
        </div>
      </Recorte>
      <Carimbo
        f={f}
        at={T.hospital}
        x={540}
        y={1330}
        texto="só no hospital"
        size={56}
      />
    </Cena>
  );
};

const S5: React.FC<{ f: number }> = ({ f }) => {
  const gasta = it(f, T.acaba - 40, T.acaba + 10, 1, 0, OUT);
  const doente = P(f, T.destruir, T.destruir + 30);
  return (
    <Cena f={f} i={4}>
      <Capitulo f={f} at={R(4)[0]} kicker="Antídoto nº 2" size={70}>
        N-acetilcisteína
      </Capitulo>
      <Nota f={f} at={T.paracetamol} x={70} y={290} rot={-2} size={54} w={900}>
        o antídoto do paracetamol
      </Nota>
      {f >= T.figado - 6 && (
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 380,
            opacity: P(f, T.figado - 6, T.figado + 4),
          }}
        >
          <Figado
            cor={
              doente > 0
                ? `rgb(${170 + 50 * doente},${110 - 50 * doente},${90 - 40 * doente})`
                : "#b8735e"
            }
          />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 680,
          width: W,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 54,
          color: V.tinta,
          opacity: P(f, T.figado + 10, T.figado + 20),
        }}
      >
        <span>💊 paracetamol</span>
        <span style={{ opacity: P(f, T.toxica - 10, T.toxica) }}>→</span>
        <span
          style={{
            color: V.vermelho,
            opacity: P(f, T.napqi, T.napqi + 8),
            position: "relative",
          }}
        >
          ☠️ NAPQI
          <Traco
            f={f}
            at={T.napqi + 8}
            d={circulo(300, 100)}
            x={-30}
            y={-14}
            w={300}
            h={100}
          />
        </span>
      </div>
      {f >= T.glutationa - 6 && (
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 850,
            opacity: P(f, T.glutationa - 6, T.glutationa + 4),
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 36,
              color: V.tinta,
              marginBottom: 12,
            }}
          >
            🛡️ glutationa (a defesa do fígado)
          </div>
          <Barra k={gasta} cor={V.verde} />
        </div>
      )}
      <Nota
        f={f}
        at={T.neutraliza}
        x={200}
        y={1030}
        rot={-3}
        size={50}
        w={760}
        cor={V.verde}
      >
        neutraliza o NAPQI ✓
      </Nota>
      <Nota f={f} at={T.doseAlta} x={300} y={1110} rot={-4} size={54} w={700}>
        dose muito alta → acaba!
      </Nota>
      <div
        style={{
          position: "absolute",
          top: 1230,
          width: W,
          display: "flex",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: 120,
              height: 120,
              opacity: P(f, T.destruir - 10 + i * 3, T.destruir + i * 3),
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                border: `5px solid ${V.tinta}`,
                background: `rgba(215,38,61,${0.15 + 0.5 * P(f, T.destruir + 10 + i * 6, T.destruir + 24 + i * 6)})`,
                boxSizing: "border-box",
              }}
            />
            <Traco
              f={f}
              at={T.destruir + 14 + i * 6}
              d={xis(120)}
              x={0}
              y={0}
              w={120}
              h={120}
              esp={10}
            />
          </div>
        ))}
      </div>
      <Nota
        f={f}
        at={T.destruir + 30}
        x={300}
        y={1380}
        rot={-2}
        size={46}
        w={700}
        cor={V.tinta}
      >
        células do fígado
      </Nota>
    </Cena>
  );
};

const S6: React.FC<{ f: number }> = ({ f }) => {
  const enche = it(f, T.repoe, T.volta, 0, 1, OUT);
  return (
    <Cena f={f} i={5}>
      <Capitulo f={f} at={R(5)[0]} kicker="Como ela age">
        Repõe a{" "}
        <Marca f={f} at={T.repoe}>
          defesa
        </Marca>
      </Capitulo>
      <div style={{ position: "absolute", left: 330, top: 380 }}>
        <Figado
          cor={`rgb(${220 - 50 * enche},${60 + 55 * enche},${50 + 40 * enche})`}
        />
      </div>
      <div style={{ position: "absolute", left: 190, top: 720 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 36,
            color: V.tinta,
            marginBottom: 12,
          }}
        >
          🛡️ glutationa
        </div>
        <Barra k={enche} cor={V.verde} />
      </div>
      <Nota
        f={f}
        at={T.materia}
        x={160}
        y={900}
        rot={-3}
        size={54}
        w={800}
        cor={V.azul}
      >
        N-acetilcisteína = matéria-prima ↑
      </Nota>
      <Traco
        f={f}
        at={T.volta}
        d={check(200)}
        x={780}
        y={620}
        w={200}
        h={200}
        cor={V.verde}
        esp={18}
      />
      <div
        style={{
          position: "absolute",
          top: 1100,
          width: W,
          textAlign: "center",
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 64,
          color: V.tinta,
          opacity: P(f, T.neutralizar - 6, T.neutralizar + 4),
        }}
      >
        <Marca f={f} at={T.neutralizar}>
          NAPQI neutralizado
        </Marca>
      </div>
    </Cena>
  );
};

const S7: React.FC<{ f: number }> = ({ f }) => {
  const k = it(f, T.oito - 30, T.oito + 10, 0, 1, OUT);
  const ang = k * (8 / 12) * Math.PI * 2;
  const r = 200;
  const cx = 260;
  const cy = 260;
  const x = cx + r * Math.sin(ang);
  const y = cy - r * Math.cos(ang);
  return (
    <Cena f={f} i={6}>
      <Capitulo f={f} at={R(6)[0]} kicker="O tempo importa">
        As primeiras{" "}
        <Marca f={f} at={T.oito}>
          8 horas
        </Marca>
      </Capitulo>
      <svg
        width={520}
        height={520}
        style={{ position: "absolute", left: 280, top: 400 }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={240}
          fill={V.creme}
          stroke={V.tinta}
          strokeWidth={8}
        />
        {k > 0 && (
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${ang > Math.PI ? 1 : 0} 1 ${x} ${y} Z`}
            fill={V.amarelo}
            opacity={0.85}
          />
        )}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <text
              key={i}
              x={cx + 205 * Math.sin(a)}
              y={cy - 205 * Math.cos(a) + 14}
              textAnchor="middle"
              fontFamily={JORNAL}
              fontWeight={900}
              fontSize={38}
              fill={V.tinta}
            >
              {i === 0 ? 12 : i}
            </text>
          );
        })}
        <line
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke={V.vermelho}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={14} fill={V.tinta} />
      </svg>
      <Traco
        f={f}
        at={T.oito + 12}
        d={circulo(130, 110)}
        x={300}
        y={710}
        w={130}
        h={110}
      />
      <Nota f={f} at={T.ingestao} x={120} y={950} rot={-3} size={54} w={840}>
        contando da hora que tomou
      </Nota>
      <Carimbo
        f={f}
        at={T.procure}
        x={540}
        y={1140}
        texto="procure atendimento já"
        size={48}
        rot={-5}
      />
      <Nota f={f} at={T.pareca} x={220} y={1260} rot={-2} size={58} w={760}>
        mesmo que pareça bem!
      </Nota>
    </Cena>
  );
};

const S8: React.FC<{ f: number }> = ({ f }) => {
  const linhas: [string, string, number, string][] = [
    ["Naloxona", "opioides", T.naloxona2, V.azul],
    ["Flumazenil", "benzodiazepínicos", T.flumazenil2, V.verde],
    ["N-acetilcisteína", "paracetamol", T.nac2, V.vermelho],
  ];
  return (
    <Cena f={f} i={7}>
      <Capitulo f={f} at={R(7)[0]} kicker="Resumindo">
        Cada antídoto, seu alvo
      </Capitulo>
      <Recorte f={f} at={R(7)[0] + 6} x={70} y={420} w={940} rot={-1} seed={11}>
        {linhas.map(([a, b, at, cor]) => (
          <div
            key={a}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 170,
              borderBottom: "3px dashed rgba(27,27,27,0.2)",
              opacity: P(f, at - 4, at + 6),
              transform: `translateX(${(1 - it(f, at - 4, at + 10, 0, 1, OUT)) * -40}px)`,
            }}
          >
            <span
              style={{
                fontFamily: JORNAL,
                fontWeight: 900,
                fontSize: 54,
                color: cor,
              }}
            >
              {a}
            </span>
            <span
              style={{
                fontFamily: MAO,
                fontWeight: 700,
                fontSize: 56,
                color: V.tinta,
              }}
            >
              →{" "}
              <Marca f={f} at={at + 10}>
                {b}
              </Marca>
            </span>
          </div>
        ))}
      </Recorte>
    </Cena>
  );
};

const S9: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={8}>
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

const S10: React.FC<{ f: number }> = ({ f }) => (
  <Cena f={f} i={9}>
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
  [10, "pop", 0.18],
  [T.flumazenil, "plim", 0.22],
  [T.nac, "plim", 0.22],
  [T.diazepam, "pop", 0.16],
  [T.clonazepam, "pop", 0.16],
  [T.midazolam, "pop", 0.16],
  [T.empurra, "whoosh", 0.18],
  [T.acordar - 10, "plim", 0.22],
  [T.hospital, "trava", 0.28],
  [T.napqi, "pop", 0.18],
  [T.destruir + 14, "trava", 0.22],
  [T.volta, "plim", 0.25],
  [T.procure, "trava", 0.28],
  [T.naloxona2, "pop", 0.18],
  [T.flumazenil2, "pop", 0.18],
  [T.nac2, "pop", 0.18],
  [T.final, "plim", 0.3],
];

export const VideoAntidotos: React.FC = () => {
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
      <Audio src={staticFile("antidotos/narracao.mp3")} />
      <Audio
        src={staticFile("antidotos/musica.wav")}
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
export const CapaAntidotos: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", left: 70, top: 150, width: 940 }}>
      <Kicker size={30}>Farmácia de emergência</Kicker>
      <div
        style={{
          fontFamily: JORNAL,
          fontWeight: 900,
          fontSize: 108,
          lineHeight: 1.02,
          color: V.tinta,
          marginTop: 16,
        }}
      >
        Antídotos que todo farmacêutico{" "}
        <Marca f={100} at={0}>
          deve saber
        </Marca>
      </div>
    </div>
    {(
      [
        ["Flumazenil", "benzodiazepínicos", 110, 720, -3, V.verde],
        ["N-acetilcisteína", "paracetamol", 150, 1040, 2, V.vermelho],
      ] as [string, string, number, number, number, string][]
    ).map(([a, b, x, y, rot, cor], i) => (
      <Recorte
        key={a}
        f={100}
        at={0}
        x={x}
        y={y}
        w={820}
        rot={rot}
        seed={3 + i}
      >
        <Manchete size={64}>
          <span style={{ color: cor }}>{a}</span>
        </Manchete>
        <div
          style={{
            fontFamily: MAO,
            fontWeight: 700,
            fontSize: 54,
            color: V.tinta,
            marginTop: 6,
          }}
        >
          →{" "}
          <Marca f={100} at={0}>
            {b}
          </Marca>
        </div>
      </Recorte>
    ))}
  </AbsoluteFill>
);
