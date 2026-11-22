import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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
  it,
  rgba,
} from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import falaJson from "./fala.json";

// Short "A receita azul agora pode chegar pelo celular" — RDC 1.000/2025 no Modelo 1 (paleta verde).
// Roteiro e checagem: roteiros/rdc_1000_short.md. Narração: Juliana (ElevenLabs), enviada por ela. Tempos em fala.json.
const VERDE = "#3dff8f",
  AMBAR = "#f2e52e",
  VERM = "#ff4d4d",
  AZUL = "#5aa9ff";

type Pal = { w: string; f: number };
const FALA: Pal[] = falaJson;
const norm = (w: string) => w.toLowerCase().replace(/[.,:;!?…"]/g, "");
const Tw = (w: string, n = 1) => {
  let c = 0;
  for (const p of FALA) if (norm(p.w) === w && ++c === n) return p.f;
  return 99999;
};
// TEMPOS
const T = {
  azul: Tw("azul"),
  celular: Tw("celular"),
  sabe: Tw("sabe"),
  rdc: Tw("rdc") - 6,
  anvisa: Tw("anvisa"),
  balcao: Tw("balcão"),
  tipos: Tw("notificação") - 8,
  nA: Tw("notificação") + 20,
  nB: Tw("b"),
  nB2: Tw("b2"),
  rce: Tw("receita", 3),
  retida: Tw("retida"),
  meio: Tw("meio"),
  pdf: Tw("mas") - 6,
  basta: Tw("basta"),
  erra: Tw("erra"),
  sncr: Tw("cada") - 6,
  numeracao: Tw("numeração"),
  sistema: Tw("sistema"),
  assin: Tw("notificação", 2) - 6,
  qualificada: Tw("qualificada"),
  icp: Tw("certificado"),
  papel: Tw("e", 6) - 4,
  escaneada: Tw("escaneada"),
  muda: Tw("dispensação") - 26,
  iti: Tw("validador"),
  prescritor: Tw("daquele"),
  registra: Tw("registra"),
  unico: Tw("depois"),
  guarda: Tw("guarda") - 4,
  data4: Tw("4"),
  ce: Tw("controle", 4),
  so: Tw("só"),
  lei: Tw("quer") - 6,
  artigo: Tw("artigo"),
  youtube: Tw("youtube"),
  siga: Tw("me") - 4,
  bons: Tw("bons") - 4,
  final: FALA[FALA.length - 1].f + 30,
};
export const DURATION_RDC_SHORT = T.final + 75;
// FIM TEMPOS

const K = "sfxkit/sfx-kit-main/sounds/";
const WHOOSH = K + "whooshes/whoosh-medium-soft.wav",
  POP = K + "pops/pop-medium-in.wav",
  PLIM = K + "notifications/notification-attention-clear.wav",
  BIP = K + "interface/click-tap-medium.wav",
  TRAVA = K + "impacts/impact-medium-firm.wav";
const SFX: [number, string, number][] = [
  [T.azul - 4, PLIM, 0.22],
  [T.rdc, WHOOSH, 0.26],
  [T.tipos, WHOOSH, 0.26],
  [T.nA, POP, 0.18],
  [T.nB, POP, 0.18],
  [T.nB2, POP, 0.18],
  [T.rce, POP, 0.18],
  [T.retida, POP, 0.18],
  [T.basta, TRAVA, 0.32],
  [T.sncr, WHOOSH, 0.26],
  [T.numeracao, BIP, 0.24],
  [T.assin, WHOOSH, 0.26],
  [T.qualificada, BIP, 0.24],
  [T.escaneada, TRAVA, 0.3],
  [T.muda, WHOOSH, 0.26],
  [T.iti, BIP, 0.24],
  [T.prescritor, BIP, 0.24],
  [T.registra, BIP, 0.24],
  [T.unico, TRAVA, 0.3],
  [T.guarda, WHOOSH, 0.26],
  [T.data4, TRAVA, 0.3],
  [T.lei, WHOOSH, 0.26],
  [T.youtube, PLIM, 0.24],
  [T.siga, WHOOSH, 0.26],
  [T.final - 10, K + "logo-stings/sting-bright-short.wav", 0.5],
];

// trilha mais alta nas pausas e mais baixa sob a voz
const FALANDO = (() => {
  const a = new Array(DURATION_RDC_SHORT + 1).fill(0);
  FALA.forEach((p, i) => {
    const fim = Math.min(FALA[i + 1]?.f ?? p.f + 24, p.f + 24);
    for (let fr = p.f; fr < fim; fr++) a[fr] = 1;
  });
  return a.map((_, i) => {
    let s = 0,
      n = 0;
    for (let j = i - 8; j <= i + 8; j++)
      if (a[j] !== undefined) {
        s += a[j];
        n++;
      }
    return s / n;
  });
})();
const musica = (fr: number) =>
  0.22 -
  0.13 *
    (FALANDO[Math.max(0, Math.min(FALANDO.length - 1, Math.round(fr)))] ?? 0);

const Carimbo: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 72, children }) =>
  f >= at ? (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%,-50%) rotate(-5deg) scale(${2.2 - 1.2 * it(f, at, at + 7, 0, 1, OUT)})`,
        opacity: it(f, at, at + 7, 0, 1, OUT),
        border: `8px solid ${cor}`,
        borderRadius: 14,
        padding: "6px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        color: cor,
        background: rgba("#000000", 0.55),
        whiteSpace: "nowrap",
        textAlign: "center",
        lineHeight: 1.15,
      }}
    >
      {children}
    </div>
  ) : null;

const Grande: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  size?: number;
  children: React.ReactNode;
}> = ({ f, at, y, cor, size = 96, children }) => {
  const k = it(f, at - 6, at + 6, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 60,
        width: W - 120,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.1,
        color: cor,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

// linha de lista com emoji
const Linha: React.FC<{
  f: number;
  at: number;
  y: number;
  cor: string;
  emoji: string;
  children: React.ReactNode;
  h?: number;
  size?: number;
}> = ({ f, at, y, cor, emoji, children, h = 150, size = 48 }) => (
  <Card
    f={f}
    at={at}
    x={110}
    y={y}
    w={860}
    h={h}
    border={rgba(cor, 0.75)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 30,
      padding: "0 42px",
    }}
  >
    <span style={{ fontFamily: EMOJI, fontSize: 72 }}>{emoji}</span>
    <span
      style={{
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  </Card>
);

// item de checklist que ganha o "visto"
const Check: React.FC<{
  f: number;
  at: number;
  y: number;
  show?: number;
  children: React.ReactNode;
}> = ({ f, at, y, show = at - 10, children }) => {
  if (f < show) return null;
  const k = it(f, show, show + 14, 0, 1, OUT);
  const v = it(f, at + 4, at + 14, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: y,
        width: 860,
        height: 150,
        borderRadius: 30,
        background: C.box,
        border: `2px solid ${rgba(VERDE, 0.4 + 0.4 * v)}`,
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "0 40px",
        boxSizing: "border-box",
        opacity: k,
        transform: `translateX(${(1 - k) * 80}px)`,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          flex: "0 0 76px",
          borderRadius: 18,
          border: `5px solid ${VERDE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={56}
          height={56}
          viewBox="0 0 40 40"
          style={{ transform: `scale(${v})` }}
        >
          <path
            d="M8,21 L16.5,29 L32,12"
            fill="none"
            stroke={VERDE}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.2,
          color: C.ink,
        }}
      >
        {children}
      </span>
    </div>
  );
};

// celular com a notificação azul chegando
const Celular: React.FC<{ f: number }> = ({ f }) => {
  const kIn = it(f, 0, 16, 0, 1, OUT);
  const kN = it(f, T.azul - 6, T.azul + 10, 0, 1, SNAP);
  const vib = f > T.azul - 6 && f < T.azul + 14 ? Math.sin(f * 2.4) * 4 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 900,
        transform: `translate(-50%,-50%) translateY(${(1 - kIn) * 120}px) rotate(${vib * 0.4}deg)`,
        opacity: kIn,
        width: 460,
        height: 820,
        borderRadius: 64,
        background: "#06140f",
        border: `6px solid ${rgba(VERDE, 0.55)}`,
        boxShadow: `0 0 60px ${rgba(VERDE, 0.18)}, 0 30px 60px rgba(0,0,0,.5)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 22,
          width: 120,
          height: 26,
          borderRadius: 13,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 90,
          width: 400,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 26,
          color: C.dim,
          letterSpacing: 2,
        }}
      >
        RECEITA RECEBIDA
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 140,
          width: 400,
          height: 430,
          borderRadius: 26,
          background: "#eaf3ff",
          transform: `scale(${0.6 + 0.4 * kN}) translateY(${(1 - kN) * 80}px)`,
          opacity: Math.min(1, kN * 1.5),
          boxShadow: `0 0 40px ${rgba(AZUL, 0.5)}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: AZUL,
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 34,
            padding: "18px 24px",
            lineHeight: 1.1,
          }}
        >
          NOTIFICAÇÃO DE RECEITA B
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              margin: "26px 24px 0",
              height: 18,
              width: [320, 260, 300, 200, 280][i],
              borderRadius: 9,
              background: "#c9dcf3",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 24,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 24,
            color: "#36618f",
          }}
        >
          assinada eletronicamente
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 610,
          width: 400,
          height: 84,
          borderRadius: 42,
          background: rgba(VERDE, 0.15),
          border: `3px solid ${VERDE}`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 32,
          color: VERDE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: P(f, T.sabe - 6, T.sabe + 4),
        }}
      >
        conferir? 🤔
      </div>
    </div>
  );
};

// número do SNCR "sorteando" até travar
const NumeroSncr: React.FC<{ f: number }> = ({ f }) => {
  const trava = T.numeracao + 18;
  const final = "0012 4587 31";
  const txt =
    f >= trava
      ? final
      : final
          .split("")
          .map((c, i) =>
            c === " " || /[A-Z]/.test(c)
              ? c
              : String((Math.floor(f / 2) * 7 + i * 3) % 10),
          )
          .join("");
  const k = it(f, T.numeracao - 8, T.numeracao + 4, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 640,
        width: 860,
        height: 230,
        borderRadius: 30,
        background: C.box,
        border: `3px solid ${f >= trava ? VERDE : rgba(AMBAR, 0.8)}`,
        opacity: k,
        transform: `scale(${0.85 + 0.15 * k})`,
        boxShadow: f >= trava ? `0 0 40px ${rgba(VERDE, 0.3)}` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 26,
          width: 860,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 4,
          color: C.dim,
        }}
      >
        NUMERAÇÃO INDIVIDUAL
      </div>
      <div
        style={{
          position: "absolute",
          top: 80,
          width: 860,
          textAlign: "center",
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 92,
          letterSpacing: 6,
          color: f >= trava ? VERDE : AMBAR,
        }}
      >
        {txt}
      </div>
    </div>
  );
};

export const VideoRdcShort: React.FC = () => {
  const f = useCurrentFrame();
  const fundo =
    f >= T.pdf && f < T.sncr
      ? VERM
      : f >= T.guarda && f < T.lei
        ? AMBAR
        : VERDE;
  return (
    <AbsoluteFill>
      <Background
        color={fundo}
        pulses={[T.azul, T.basta, T.escaneada, T.unico, T.data4, T.final]}
      />

      {/* 1. gancho: o celular com a notificação azul */}
      <Part from={0} to={T.rdc}>
        <Title
          f={f}
          at={0}
          y={210}
          size={74}
          font={SANS}
          weight={900}
          from={AZUL}
        >
          A RECEITA <span style={{ color: AZUL }}>AZUL</span>
          <br />
          PELO CELULAR 📱
        </Title>
        <Celular f={f} />
        <Grande f={f} at={T.sabe - 4} y={1400} cor={AMBAR} size={70}>
          VOCÊ SABE CONFERIR?
        </Grande>
      </Part>

      {/* 2. a norma */}
      <Part from={T.rdc} to={T.tipos}>
        <Pill
          x={540}
          y={330}
          text="🏛️ Anvisa · lei seca"
          color={VERDE}
          size={40}
          k={P(f, T.rdc + 4, T.rdc + 16)}
        />
        <Grande f={f} at={T.rdc + 6} y={440} cor={VERDE} size={150}>
          RDC 1.000
        </Grande>
        <Grande f={f} at={T.rdc + 12} y={620} cor={C.ink} size={64}>
          de 2025
        </Grande>
        <Grande f={f} at={T.anvisa + 10} y={790} cor={C.ink} size={58}>
          receita eletrônica de <span style={{ color: AMBAR }}>controlado</span>
        </Grande>
        <Emoji f={f} at={T.balcao - 10} x={540} y={1130} size={190}>
          🏪
        </Emoji>
        <Pill
          x={540}
          y={1330}
          text="muda o que você confere no balcão"
          color={AMBAR}
          size={42}
          k={P(f, T.balcao - 10, T.balcao + 2)}
        />
      </Part>

      {/* 3. o que pode ser eletrônico */}
      <Part from={T.tipos} to={T.pdf}>
        <Title
          f={f}
          at={T.tipos + 4}
          y={230}
          size={66}
          weight={600}
          from={VERDE}
        >
          pode chegar em meio eletrônico
        </Title>
        <Card
          f={f}
          at={T.nA - 8}
          x={110}
          y={440}
          w={860}
          h={150}
          border={rgba(AZUL, 0.75)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "0 42px",
          }}
        >
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 48 }}>
            Notificação
          </span>
          {[
            ["A", AMBAR, T.nA],
            ["B", AZUL, T.nB],
            ["B2", AZUL, T.nB2],
          ].map(([l, c, at]) => (
            <span
              key={l as string}
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 50,
                padding: "4px 22px",
                borderRadius: 14,
                background: rgba(c as string, 0.2),
                border: `3px solid ${c}`,
                color: c as string,
                opacity: P(f, (at as number) - 6, (at as number) + 2),
                transform: `scale(${0.6 + 0.4 * it(f, (at as number) - 6, (at as number) + 4, 0, 1, SNAP)})`,
              }}
            >
              {l}
            </span>
          ))}
        </Card>
        <Linha f={f} at={T.rce - 8} y={620} cor={VERDE} emoji="📄">
          Receita de Controle Especial
        </Linha>
        <Linha f={f} at={T.retida - 8} y={800} cor={VERDE} emoji="💊" h={170}>
          receita retida
          <br />
          <span style={{ fontSize: 38, color: C.dim }}>
            como a de antibiótico
          </span>
        </Linha>
        <Pill
          x={540}
          y={1100}
          text="✅ em meio eletrônico"
          color={VERDE}
          size={46}
          k={P(f, T.meio - 6, T.meio + 6)}
        />
      </Part>

      {/* 4. PDF não basta */}
      <Part from={T.pdf} to={T.sncr}>
        <Emoji f={f} at={T.pdf + 2} x={540} y={620} size={230}>
          📄
        </Emoji>
        <Grande f={f} at={T.pdf + 6} y={790} cor={C.ink} size={74}>
          PDF ASSINADO?
        </Grande>
        <Carimbo f={f} at={T.basta} y={1010} cor={VERM} size={76}>
          NÃO BASTA
        </Carimbo>
        <Grande f={f} at={T.erra - 14} y={1190} cor={AMBAR} size={54}>
          é aqui que muita gente erra
        </Grande>
      </Part>

      {/* 5. numeração do SNCR */}
      <Part from={T.sncr} to={T.assin}>
        <Title
          f={f}
          at={T.sncr + 4}
          y={250}
          size={64}
          weight={600}
          from={VERDE}
        >
          cada receita precisa ter
        </Title>
        <Grande f={f} at={T.numeracao - 10} y={420} cor={VERDE} size={110}>
          Nº do SNCR
        </Grande>
        <NumeroSncr f={f} />
        <Grande f={f} at={T.sistema - 6} y={960} cor={C.ink} size={50}>
          Sistema Nacional de
          <br />
          Controle de Receituários
        </Grande>
      </Part>

      {/* 6. assinatura qualificada */}
      <Part from={T.assin} to={T.papel}>
        <Title
          f={f}
          at={T.assin + 4}
          y={250}
          size={60}
          weight={600}
          from={VERDE}
        >
          Notificação e Controle Especial
        </Title>
        <Emoji f={f} at={T.assin + 16} x={540} y={600} size={220}>
          🔐
        </Emoji>
        <Grande f={f} at={T.qualificada - 16} y={790} cor={VERDE} size={76}>
          ASSINATURA
          <br />
          QUALIFICADA
        </Grande>
        <Pill
          x={540}
          y={1090}
          text="certificado ICP-Brasil"
          color={AMBAR}
          size={48}
          k={P(f, T.icp - 8, T.icp + 4)}
        />
      </Part>

      {/* 7. papel escaneado */}
      <Part from={T.papel} to={T.muda}>
        <Emoji f={f} at={T.papel + 4} x={400} y={640} size={200}>
          🧾
        </Emoji>
        <Emoji f={f} at={T.papel + 14} x={690} y={640} size={200}>
          🖨️
        </Emoji>
        <Grande f={f} at={T.papel + 10} y={820} cor={C.ink} size={66}>
          papel escaneado
        </Grande>
        <Carimbo f={f} at={T.escaneada + 20} y={1080} cor={VERM} size={56}>
          NÃO É RECEITA
          <br />
          ELETRÔNICA
        </Carimbo>
      </Part>

      {/* 8. na dispensação: checklist */}
      <Part from={T.muda} to={T.guarda}>
        <Title
          f={f}
          at={T.muda + 4}
          y={230}
          size={70}
          weight={900}
          font={SANS}
          from={AMBAR}
        >
          NA SUA DISPENSAÇÃO
        </Title>
        <Check f={f} at={T.iti} y={440} show={T.muda + 16 + 0}>
          assinatura no validador do <span style={{ color: VERDE }}>ITI</span>
        </Check>
        <Check f={f} at={T.prescritor} y={620} show={T.muda + 16 + 8}>
          numeração é daquele prescritor
        </Check>
        <Check f={f} at={T.registra} y={800} show={T.muda + 16 + 16}>
          registra o uso no <span style={{ color: VERDE }}>SNCR</span>
        </Check>
        <Carimbo f={f} at={T.unico + 6} y={1110} cor={AMBAR} size={70}>
          USO ÚNICO
        </Carimbo>
        <Grande f={f} at={T.unico + 30} y={1250} cor={C.ink} size={46}>
          depois disso, não pode ser usada de novo
        </Grande>
      </Part>

      {/* 9. a data */}
      <Part from={T.guarda} to={T.lei}>
        <Carimbo f={f} at={T.guarda + 4} y={320} cor={AMBAR} size={70}>
          GUARDA ESSA DATA
        </Carimbo>
        <Card
          f={f}
          at={T.data4 - 10}
          x={290}
          y={470}
          w={500}
          h={460}
          border={rgba(AMBAR, 0.8)}
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              background: AMBAR,
              color: "#0a1a12",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            MARÇO 2027
          </div>
          <div
            style={{
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 250,
              lineHeight: 1.25,
              color: C.ink,
            }}
          >
            4
          </div>
        </Card>
        <Grande f={f} at={T.ce - 6} y={990} cor={C.ink} size={50}>
          Controle Especial e receita retida eletrônicas
        </Grande>
        <Pill
          x={540}
          y={1210}
          text="só com numeração do SNCR"
          color={VERDE}
          size={50}
          k={P(f, T.so - 8, T.so + 4)}
        />
      </Part>

      {/* 10. chamada para a lei seca no YouTube */}
      <Part from={T.lei} to={T.siga}>
        <Title
          f={f}
          at={T.lei + 4}
          y={230}
          size={70}
          weight={900}
          font={SANS}
          from={VERDE}
        >
          LEI SECA COMPLETA
        </Title>
        <Grande f={f} at={T.artigo - 4} y={340} cor={AMBAR} size={52}>
          artigo por artigo
        </Grande>
        {f >= T.artigo && (
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 470,
              width: 900,
              height: 506,
              borderRadius: 26,
              overflow: "hidden",
              border: `4px solid ${VERDE}`,
              boxShadow: `0 0 50px ${rgba(VERDE, 0.3)}`,
              opacity: it(f, T.artigo, T.artigo + 14, 0, 1, OUT),
              transform: `scale(${0.85 + 0.15 * it(f, T.artigo, T.artigo + 14, 0, 1, SNAP)})`,
            }}
          >
            <Img
              src={staticFile("rdcShort/capa_parte1.png")}
              style={{ width: 900, height: 506 }}
            />
            <div
              style={{
                position: "absolute",
                left: 360,
                top: 163,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(0,0,0,.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: P(f, T.youtube - 10, T.youtube),
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "40px solid transparent",
                  borderBottom: "40px solid transparent",
                  borderLeft: `66px solid #fff`,
                  marginLeft: 16,
                }}
              />
            </div>
          </div>
        )}
        <Pill
          x={540}
          y={1090}
          text="▶ videoaula no YouTube do Farma.exe"
          color={VERM}
          size={42}
          k={P(f, T.youtube - 10, T.youtube + 2)}
        />
        <Grande f={f} at={T.youtube + 10} y={1190} cor={C.ink} size={44}>
          Partes 1, 2 e 3 na playlist
        </Grande>
      </Part>

      {/* 11. me siga */}
      <Part from={T.siga} to={T.bons}>
        <Img
          src={staticFile("rdcShort/logo.jpg")}
          style={{
            position: "absolute",
            left: 350,
            top: 420,
            width: 380,
            height: 380,
            borderRadius: "50%",
          }}
        />
        <Grande f={f} at={T.siga + 4} y={840} cor={C.ink} size={120}>
          ME SIGA
        </Grande>
        <div
          style={{
            position: "absolute",
            top: 990,
            left: 110,
            width: 860,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 48,
            lineHeight: 1.3,
            color: C.ink,
          }}
        >
          para mais dicas sobre leis
        </div>
      </Part>

      {/* 12. bons estudos + fonte */}
      <Part from={T.bons} to={DURATION_RDC_SHORT} inY={80} outDur={1}>
        <div
          style={{
            position: "absolute",
            top: 640,
            width: W,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 112,
            color: bornColor(f, T.bons + 4, C.ink, VERDE, 24),
            opacity: it(f, T.bons, T.bons + 14, 0, 1, OUT),
          }}
        >
          Bons estudos!
        </div>
        <div
          style={{
            position: "absolute",
            top: 860,
            left: 110,
            width: 860,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.4,
            color: C.dim,
            opacity: P(f, T.bons + 20, T.bons + 34),
          }}
        >
          Fonte: RDC nº 1.000/2025
          <br />
          (DOU de 15/12/2025), com a redação
          <br />
          da RDC nº 1.046/2026.
        </div>
      </Part>

      <Grain />
      <Audio src={staticFile("rdcShort/narracao.mp3")} />
      <Audio
        src={staticFile("rdcShort/musica.wav")}
        volume={(fr) =>
          musica(fr) * (1 - P(fr, DURATION_RDC_SHORT - 45, DURATION_RDC_SHORT))
        }
      />
      {SFX.map(([fr, src, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={90}>
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920): tudo entre y≈300 e y≈1620 (recorte 3:4).
export const CapaRdcShort: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background color={VERDE} pulses={[]} />
    <div
      style={{
        position: "absolute",
        top: 340,
        width: W,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 96,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      A RECEITA{" "}
      <span style={{ color: AZUL, textShadow: `0 0 30px ${rgba(AZUL, 0.5)}` }}>
        AZUL
      </span>
      <br />
      PELO CELULAR
    </div>
    <div
      style={{
        position: "absolute",
        top: 600,
        width: W,
        textAlign: "center",
        fontFamily: EMOJI,
        fontSize: 230,
        lineHeight: 1,
      }}
    >
      📱📄
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1020,
        transform: "translate(-50%,-50%) rotate(-5deg)",
        border: `9px solid ${AMBAR}`,
        borderRadius: 16,
        padding: "8px 28px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 60,
        letterSpacing: 2,
        color: AMBAR,
        background: rgba(AMBAR, 0.08),
        whiteSpace: "nowrap",
      }}
    >
      VOCÊ SABE CONFERIR?
    </div>
    <div
      style={{
        position: "absolute",
        top: 1180,
        width: W,
        textAlign: "center",
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: 62,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      RDC 1.000/2025
      <br />
      <span style={{ color: VERDE }}>receita eletrônica de controlado</span>
    </div>
    <Grain />
  </AbsoluteFill>
);

// mantém IN importado para ajustes de saída
void IN;
