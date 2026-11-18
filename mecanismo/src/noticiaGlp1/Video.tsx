import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OUT, P, SNAP, it } from "../lib";
import { EMOJI } from "../aas/ui";
import { SANS } from "../fonts";
import { Reporter } from "../noticias/Reporter";
import {
  Fundo,
  Janela,
  K,
  Linha,
  PIX,
  Pixelado,
  Selo,
  Titulo,
  VT,
} from "../noticiaBotox/Explicadora";
import boca from "./boca.json";
import falaJson from "./fala.json";

// "Notícias da Farmácia" #3: o aviso novo das canetas de GLP-1 sobre a visão (FDA, 09/11/2026).
// Mesmo estilo explicadora do #1 e do #2, agora com fotos livres (Wikimedia Commons) dentro das janelinhas.
// Narração: Juliana (ElevenLabs v4), take 1. Tempos: fala.json (quadro = segundos × 30).
// Créditos das fotos: public/noticiaGlp1/brutas/CREDITOS.md

const FALA: { w: string; f: number }[] = falaJson;

// TEMPOS (quadros a 30 fps)
export const T = {
  canetas: 89,
  olho: 203,
  noticias: 232,
  fda: 331,
  alerta: 431,
  diabetes: 501,
  emagrecer: 535,
  sema: 586,
  tirz: 616,
  lira: 646,
  outras: 680,
  noiana: 736,
  derrame: 785,
  falta: 830,
  nervo: 887,
  cai: 919,
  calma: 976,
  raro: 1003,
  seis: 1103,
  quatro: 1231,
  possivel: 1305,
  comprovada: 1351,
  brasil: 1394,
  bula: 1424,
  ano2025: 1504,
  anvisa: 1553,
  treze: 1580,
  sinal: 1694,
  perda: 1706,
  umOlho: 1777,
  semDor: 1804,
  acordar: 1849,
  mancha: 1886,
  parte: 1918,
  cores: 1967,
  isso: 2010,
  oftalmo: 2036,
  mesmoDia: 2066,
  naoPare: 2164,
  converse: 2263,
  problema: 2351,
  manda: 2401,
  siga: 2453,
  final: 2542,
};
export const DURATION = 2720; // narração de 88,1 s + tela final
export const PARTES: [number, number][] = [
  [0, 286],
  [286, 703],
  [703, 971],
  [971, 1394],
  [1394, 1648],
  [1648, 2010],
  [2010, 2159],
  [2159, 2401],
  [2401, 2542],
  [2542, DURATION],
];
// FIM TEMPOS

const R = (i: number) => PARTES[i];
const cena = (f: number, i: number) => f >= R(i)[0] && f < R(i)[1];
const foto = (n: string) => staticFile(`noticiaGlp1/brutas/${n}`);

// ---------- peças ----------
const Icone: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  e: string;
  size?: number;
}> = ({ f, at, x, y, e, size = 90 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * k})`,
        opacity: Math.min(1, k * 1.5),
        fontFamily: EMOJI,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      {e}
    </div>
  );
};

// foto que preenche a área da janela, com zoom lento e crédito no canto
const Foto: React.FC<{
  f: number;
  at: number;
  src: string;
  credito: string;
  w: number;
  h: number;
  x?: number;
  y?: number;
  pos?: string;
  filtro?: string;
  zoom?: number;
}> = ({
  f,
  at,
  src,
  credito,
  w,
  h,
  x = 0,
  y = 0,
  pos = "center",
  filtro,
  zoom = 0.06,
}) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, OUT);
  const z = 1 + zoom * P(f, at, at + 300);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        overflow: "hidden",
        opacity: k,
        background: K.tinta,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          transform: `scale(${z})`,
          filter: filtro,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 17,
          color: K.branco,
          background: "rgba(22,22,26,0.72)",
          padding: "4px 10px",
        }}
      >
        {credito}
      </div>
    </div>
  );
};

const Chip: React.FC<{
  f: number;
  at: number;
  texto: string;
  cor?: string;
  fg?: string;
  size?: number;
}> = ({ f, at, texto, cor = K.amarelo, fg = K.tinta, size = 40 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 10, 0, 1, SNAP);
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        color: fg,
        background: cor,
        border: `4px solid ${K.tinta}`,
        boxShadow: `5px 5px 0 ${K.tinta}`,
        padding: "6px 18px",
        opacity: Math.min(1, k * 1.5),
        transform: `scale(${0.7 + 0.3 * k})`,
      }}
    >
      {texto}
    </span>
  );
};

// ---------- legenda palavra por palavra ----------
type Pw = { text: string; start: number; end: number };
const PAL: Pw[] = FALA.map((p, i) => ({
  text: p.w,
  start: p.f / 30,
  end: (i + 1 < FALA.length ? FALA[i + 1].f : p.f + 15) / 30,
}));
const BLOCOS: Pw[][] = (() => {
  const out: Pw[][] = [];
  let cur: Pw[] = [];
  PAL.forEach((w) => {
    cur.push(w);
    if (cur.length >= 4 || /[.?!:,]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  if (f >= T.siga - 4) return null;
  const b = BLOCOS.find(
    (bl, i) =>
      t >= bl[0].start - 0.05 &&
      (i === BLOCOS.length - 1 || t < BLOCOS[i + 1][0].start - 0.05),
  );
  if (!b || t > b[b.length - 1].end + 0.6) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        width: 760,
        top: 1250,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 14px",
        fontFamily: VT,
        fontSize: 68,
        lineHeight: 1,
      }}
    >
      {b.map((w, i) => {
        const ativa =
          t >= w.start - 0.03 && t < (b[i + 1]?.start ?? w.end + 0.6);
        return (
          <span
            key={i}
            style={{
              color: ativa ? K.tinta : K.branco,
              background: ativa ? K.amarelo : "transparent",
              padding: "0 8px",
              textShadow: ativa
                ? "none"
                : `-3px -3px 0 ${K.tinta}, 3px -3px 0 ${K.tinta}, -3px 3px 0 ${K.tinta}, 3px 3px 0 ${K.tinta}, 0 5px 0 ${K.tinta}`,
              border: ativa ? `3px solid ${K.tinta}` : "3px solid transparent",
            }}
          >
            {w.text.replace(/[.,:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// ---------- a repórter no canto de baixo ----------
const Canto: React.FC<{ f: number }> = ({ f }) => {
  if (f >= R(9)[0] + 10) return null;
  const k = it(f, 4, 22, 0, 1, OUT);
  const s = 0.56;
  return (
    <div
      style={{
        position: "absolute",
        left: 1080 - 419 * s + 10 + (1 - k) * 260,
        top: 1250 + Math.sin(f / 24) * 4,
        transform: `scale(${s})`,
        transformOrigin: "0 0",
        opacity: 1 - P(f, R(9)[0], R(9)[0] + 10),
        filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))",
      }}
    >
      <Reporter f={f} boca={boca as number[]} />
    </div>
  );
};

const Plantao: React.FC<{ f: number }> = ({ f }) => (
  <div
    style={{
      position: "absolute",
      top: 140,
      width: 1080,
      textAlign: "center",
      fontFamily: PIX,
      fontSize: 26,
      color: K.vermelho,
      opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 9)),
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 22,
        height: 22,
        background: K.vermelho,
        marginRight: 16,
      }}
    />
    <Pixelado texto="NOTÍCIAS DA FARMÁCIA #3" size={26} />
  </div>
);

// caneta genérica desenhada (sem marca)
const Caneta: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  esc?: number;
}> = ({ f, at, x, y, esc = 1 }) => {
  if (f < at) return null;
  const k = it(f, at, at + 14, 0, 1, SNAP);
  return (
    <svg
      width={520 * esc}
      height={120 * esc}
      viewBox="0 0 520 120"
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: Math.min(1, k * 1.5),
        transform: `rotate(${-12 + 12 * k}deg) scale(${0.8 + 0.2 * k})`,
      }}
    >
      <rect
        x={10}
        y={30}
        width={360}
        height={60}
        rx={26}
        fill={K.azul}
        stroke={K.tinta}
        strokeWidth={6}
      />
      <rect
        x={150}
        y={44}
        width={120}
        height={32}
        rx={6}
        fill={K.branco}
        stroke={K.tinta}
        strokeWidth={5}
      />
      <rect
        x={370}
        y={38}
        width={110}
        height={44}
        rx={14}
        fill={K.claro}
        stroke={K.tinta}
        strokeWidth={6}
      />
      <rect
        x={480}
        y={52}
        width={30}
        height={16}
        rx={4}
        fill={K.cinza}
        stroke={K.tinta}
        strokeWidth={4}
      />
      <circle
        cx={60}
        cy={60}
        r={14}
        fill={K.amarelo}
        stroke={K.tinta}
        strokeWidth={5}
      />
    </svg>
  );
};

// ---------- cenas ----------
const S1: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 0) ? null : (
    <>
      <Plantao f={f} />
      <Titulo
        f={f}
        at={4}
        linhas={[
          [{ t: "BULA NOVA" }],
          [{ t: "NAS CANETAS" }],
          [{ t: "DE GLP-1", cor: K.vermelho }],
        ]}
        size={60}
      />
      <Janela
        f={f}
        at={T.canetas - 6}
        y={560}
        h={560}
        titulo="fda · estados unidos"
      >
        <Caneta f={f} at={T.canetas} x={180} y={70} esc={1} />
        <Icone f={f} at={T.olho - 2} x={445} y={330} e="👁️" size={170} />
        <Selo
          f={f}
          at={T.olho + 12}
          x={445}
          y={440}
          texto="ALERTA NA BULA"
          size={34}
        />
      </Janela>
    </>
  );

const S2: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 1) ? null : (
    <>
      <Titulo
        f={f}
        at={R(1)[0]}
        top={200}
        linhas={[[{ t: "O QUE" }], [{ t: "ACONTECEU", cor: K.azul }]]}
        size={58}
      />
      <Janela f={f} at={T.fda - 10} y={400} h={470} titulo="fda · 09/11/2026">
        <Foto
          f={f}
          at={T.fda - 6}
          src={foto("fda_entrada.jpg")}
          credito="Foto: FDA, domínio público"
          w={890}
          h={406}
        />
        <Selo
          f={f}
          at={T.alerta}
          x={445}
          y={330}
          texto="ALERTA NA BULA"
          size={34}
        />
      </Janela>
      <Janela
        f={f}
        at={T.diabetes - 8}
        y={900}
        h={320}
        titulo="vale para todas"
      >
        <div
          style={{
            position: "absolute",
            inset: 22,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignContent: "flex-start",
          }}
        >
          <Chip
            f={f}
            at={T.diabetes}
            texto="🩸 diabetes"
            cor={K.claro}
            size={34}
          />
          <Chip
            f={f}
            at={T.emagrecer}
            texto="⚖️ emagrecer"
            cor={K.claro}
            size={34}
          />
          <Chip f={f} at={T.sema} texto="semaglutida" size={34} />
          <Chip f={f} at={T.tirz} texto="tirzepatida" size={34} />
          <Chip f={f} at={T.lira} texto="liraglutida" size={34} />
          <Chip
            f={f}
            at={T.outras}
            texto="+ as outras"
            cor={K.azul}
            fg={K.branco}
            size={34}
          />
        </div>
      </Janela>
    </>
  );

const S3: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 2)) return null;
  // o disco óptico fica a ~17 % da largura e ~46 % da altura da foto do fundo de olho
  const lado = 560;
  const dx = 0.17 * lado + 165;
  const dy = 0.46 * lado + 20;
  const kAnel = it(f, T.nervo - 6, T.nervo + 8, 0, 1, SNAP);
  const escurece = P(f, T.cai, T.cai + 30);
  return (
    <>
      <Titulo
        f={f}
        at={R(2)[0]}
        top={200}
        linhas={[[{ t: "O QUE É" }], [{ t: "NOIANA", cor: K.vermelho }]]}
        size={58}
      />
      <Janela
        f={f}
        at={T.noiana - 10}
        y={400}
        h={820}
        titulo="fundo do olho · foto real"
      >
        <Foto
          f={f}
          at={T.noiana - 6}
          src={foto("fundo_olho.jpg")}
          credito="Foto: M. Häggström, CC0"
          w={lado}
          h={lado}
          x={165}
          y={20}
          zoom={0.03}
          filtro={`brightness(${1 - 0.45 * escurece})`}
        />
        {f >= T.nervo - 6 && (
          <>
            <div
              style={{
                position: "absolute",
                left: dx - 60,
                top: dy - 60,
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: `7px solid ${K.amarelo}`,
                boxShadow: `0 0 0 4px ${K.tinta}`,
                transform: `scale(${0.6 + 0.4 * kAnel})`,
                opacity: kAnel,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                top: dy + 70,
                opacity: kAnel,
              }}
            >
              <Chip
                f={f}
                at={T.nervo - 6}
                texto="entrada do nervo óptico"
                size={28}
              />
            </div>
          </>
        )}
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 600,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Linha f={f} at={T.derrame} size={40}>
            🧠 uma espécie de derrame no nervo do olho
          </Linha>
          <Linha f={f} at={T.falta} size={40} fundo={K.amarelo}>
            🩸 falta sangue → a visão cai de repente
          </Linha>
        </div>
      </Janela>
    </>
  );
};

const Barra: React.FC<{
  f: number;
  at: number;
  x: number;
  valor: number;
  rotulo: string;
  numero: string;
  cor: string;
}> = ({ f, at, x, valor, rotulo, numero, cor }) => {
  if (f < at) return null;
  const k = it(f, at, at + 18, 0, 1, OUT);
  const hMax = 230;
  const h = (valor / 6.4) * hMax * k;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 40,
        width: 260,
        height: 460,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 30,
          width: 200,
          height: h,
          background: cor,
          border: `5px solid ${K.tinta}`,
          boxShadow: `6px 6px 0 ${K.tinta}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 120 + h,
          width: 260,
          textAlign: "center",
          fontFamily: PIX,
          fontSize: 44,
          color: K.tinta,
          opacity: k,
        }}
      >
        {numero}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          width: 260,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          color: K.tinta,
          lineHeight: 1.15,
        }}
      >
        {rotulo}
      </div>
    </div>
  );
};

const S4: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 3) ? null : (
    <>
      <Titulo
        f={f}
        at={R(3)[0]}
        top={200}
        linhas={[[{ t: "MAS CALMA:" }], [{ t: "É RARO", cor: K.verde }]]}
        size={58}
      />
      <Janela f={f} at={T.raro + 10} y={400} h={820} titulo="126 estudos · fda">
        <div
          style={{
            position: "absolute",
            top: 20,
            width: 890,
            textAlign: "center",
            fontFamily: VT,
            fontSize: 40,
            color: K.cinza,
            opacity: P(f, T.seis - 10, T.seis),
          }}
        >
          casos a cada 100 mil pessoas por ano
        </div>
        <Barra
          f={f}
          at={T.seis}
          x={140}
          valor={6.4}
          numero="6,4"
          rotulo="com a caneta"
          cor={K.vermelho}
        />
        <Barra
          f={f}
          at={T.quatro}
          x={490}
          valor={3.8}
          numero="3,8"
          rotulo="sem a caneta"
          cor="#94a3b8"
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 560,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Chip f={f} at={T.possivel} texto="risco possível" size={40} />
          <Chip
            f={f}
            at={T.comprovada}
            texto="sem causa comprovada"
            cor={K.verde}
            fg={K.branco}
            size={40}
          />
        </div>
        <Selo
          f={f}
          at={T.raro + 16}
          x={760}
          y={110}
          texto="RARO"
          cor={K.verde}
          size={40}
        />
      </Janela>
    </>
  );

const S5: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 4) ? null : (
    <>
      <Titulo
        f={f}
        at={R(4)[0]}
        top={200}
        linhas={[[{ t: "E NO" }], [{ t: "BRASIL?", cor: K.verde }]]}
        size={58}
      />
      <Janela
        f={f}
        at={T.bula - 6}
        y={400}
        h={360}
        titulo="anvisa · bula da semaglutida"
      >
        <Icone f={f} at={T.bula} x={130} y={150} e="📄" size={130} />
        <div
          style={{
            position: "absolute",
            left: 250,
            top: 50,
            width: 600,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Linha f={f} at={T.bula + 4} size={40}>
            aviso na bula
          </Linha>
          <Linha f={f} at={T.ano2025} size={40} fundo={K.amarelo}>
            desde 2025
          </Linha>
          <Linha f={f} at={T.ano2025 + 10} size={32} cor={K.cinza}>
            reação adversa muito rara
          </Linha>
        </div>
      </Janela>
      <Janela f={f} at={T.anvisa - 6} y={800} h={410} titulo="anvisa · vigimed">
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: PIX,
            fontSize: 150,
            color: K.laranja,
            opacity: P(f, T.treze, T.treze + 8),
            transform: `scale(${0.6 + 0.4 * it(f, T.treze, T.treze + 12, 0, 1, SNAP)})`,
            transformOrigin: "left center",
          }}
        >
          13
        </div>
        <div
          style={{
            position: "absolute",
            left: 380,
            top: 60,
            width: 470,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 40,
            color: K.tinta,
            lineHeight: 1.2,
            opacity: P(f, T.treze + 6, T.treze + 16),
          }}
        >
          notificações de suspeita
        </div>
        <Selo
          f={f}
          at={T.treze + 24}
          x={590}
          y={250}
          texto="EM ANÁLISE"
          cor={K.azul}
          size={30}
        />
      </Janela>
    </>
  );

const S6: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 5)) return null;
  const etapa =
    f >= T.cores
      ? "cores"
      : f >= T.parte
        ? "parte"
        : f >= T.mancha
          ? "mancha"
          : f >= T.perda
            ? "perda"
            : "normal";
  const img =
    etapa === "perda"
      ? "visao_noiana_simulada.jpg"
      : etapa === "mancha"
        ? "visao_mancha.jpg"
        : etapa === "parte"
          ? "visao_glaucoma.jpg"
          : "visao_normal.jpg";
  const filtro =
    etapa === "cores"
      ? "hue-rotate(70deg) saturate(0.55) contrast(0.9)"
      : undefined;
  const inicio =
    etapa === "perda"
      ? T.perda
      : etapa === "mancha"
        ? T.mancha
        : etapa === "parte"
          ? T.parte
          : etapa === "cores"
            ? T.cores
            : T.sinal;
  return (
    <>
      <Titulo
        f={f}
        at={R(5)[0]}
        top={200}
        linhas={[[{ t: "SINAL DE" }], [{ t: "ALERTA", cor: K.vermelho }]]}
        size={58}
      />
      <Janela
        f={f}
        at={T.sinal - 6}
        y={400}
        h={560}
        titulo="simulação ilustrativa"
      >
        <Foto
          key={etapa}
          f={f}
          at={inicio}
          src={foto(img)}
          credito="Simulação: National Eye Institute (NIH), domínio público"
          w={890}
          h={496}
          pos={etapa === "perda" ? "center 78%" : "center 35%"}
          filtro={filtro}
          zoom={0.03}
        />
      </Janela>
      <div
        style={{
          position: "absolute",
          left: 90,
          width: 900,
          top: 1000,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        <Chip f={f} at={T.perda} texto="⚡ de repente" size={36} />
        <Chip f={f} at={T.umOlho} texto="👁️ um olho só" size={36} />
        <Chip f={f} at={T.semDor} texto="sem dor" size={36} />
        <Chip f={f} at={T.acordar} texto="🌅 ao acordar" size={36} />
      </div>
    </>
  );
};

const S6b: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 6)) return null;
  const pisca = 0.75 + 0.25 * Math.abs(Math.sin(f / 6));
  return (
    <>
      <Titulo
        f={f}
        at={R(6)[0]}
        top={200}
        linhas={[[{ t: "OFTALMO" }], [{ t: "NO MESMO DIA", cor: K.vermelho }]]}
        size={56}
      />
      <Janela
        f={f}
        at={T.oftalmo - 20}
        y={400}
        h={560}
        titulo="sinal de alerta"
      >
        <Foto
          f={f}
          at={T.oftalmo - 16}
          src={foto("lampada_fenda.jpg")}
          credito="Foto: JeevaMuthuramalingam, CC BY-SA 4.0"
          w={890}
          h={496}
          pos="center 30%"
        />
      </Janela>
      {f >= T.mesmoDia && (
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 1010,
            width: 700,
            textAlign: "center",
            fontFamily: PIX,
            fontSize: 38,
            color: K.branco,
            background: K.vermelho,
            border: `6px solid ${K.tinta}`,
            boxShadow: `10px 10px 0 ${K.tinta}`,
            padding: "26px 0",
            opacity: pisca,
            transform: `scale(${0.7 + 0.3 * it(f, T.mesmoDia, T.mesmoDia + 12, 0, 1, SNAP)})`,
          }}
        >
          <Pixelado texto="NÃO ESPERE!" size={38} />
        </div>
      )}
    </>
  );
};

const S7: React.FC<{ f: number }> = ({ f }) =>
  !cena(f, 7) ? null : (
    <>
      <Titulo
        f={f}
        at={R(7)[0]}
        top={200}
        linhas={[[{ t: "NÃO PARE" }], [{ t: "SOZINHO", cor: K.vermelho }]]}
        size={58}
      />
      <Janela f={f} at={T.naoPare} y={460} h={560} titulo="status">
        <Caneta f={f} at={T.naoPare + 4} x={185} y={30} esc={1} />
        <div
          style={{
            position: "absolute",
            inset: "200px 30px 30px 30px",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <Linha f={f} at={T.naoPare + 10} size={42} cor={K.vermelho}>
            ✕ parar por conta própria
          </Linha>
          <Linha f={f} at={T.converse} size={42} cor={K.verde}>
            ✓ conversar com quem receitou
          </Linha>
          <Linha f={f} at={T.problema} size={36} fundo={K.amarelo}>
            👁️ já teve isso em um olho? conte ao médico
          </Linha>
        </div>
      </Janela>
    </>
  );

const S8: React.FC<{ f: number }> = ({ f }) => {
  if (!cena(f, 8)) return null;
  const kLogo = it(f, T.siga - 4, T.siga + 10, 0, 1, SNAP);
  return (
    <>
      <Titulo
        f={f}
        at={T.manda}
        top={260}
        linhas={[
          [{ t: "MANDA PARA QUEM" }],
          [{ t: "USA CANETA", cor: K.laranja }],
        ]}
        size={46}
      />
      {f >= T.siga - 4 && (
        <Img
          src={staticFile("noticiaGlp1/logo.jpg")}
          style={{
            position: "absolute",
            left: 390,
            top: 520,
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: `8px solid ${K.tinta}`,
            boxShadow: `10px 10px 0 ${K.tinta}`,
            transform: `scale(${0.5 + 0.5 * kLogo})`,
            opacity: kLogo,
          }}
        />
      )}
      <Titulo
        f={f}
        at={T.siga}
        linhas={[[{ t: "ME SIGA", cor: K.azul }]]}
        size={84}
        top={880}
      />
      <div
        style={{
          position: "absolute",
          top: 1020,
          width: 1080,
          textAlign: "center",
          fontFamily: VT,
          fontSize: 54,
          color: K.tinta,
          opacity: P(f, T.siga + 10, T.siga + 22),
        }}
      >
        para mais notícias e
        <br />
        dicas de farmacologia 💊
      </div>
    </>
  );
};

const S9: React.FC<{ f: number }> = ({ f }) =>
  f < R(9)[0] ? null : (
    <div
      style={{
        position: "absolute",
        top: 720,
        width: 1080,
        textAlign: "center",
        fontFamily: PIX,
        fontSize: 44,
        lineHeight: "80px",
        color: K.tinta,
        opacity: it(f, T.final, T.final + 14, 0, 1, OUT),
      }}
    >
      <Pixelado texto="Consulte um" size={44} />
      <br />
      <span style={{ color: K.azul }}>
        <Pixelado texto="profissional" size={44} />
      </span>
      <br />
      <span style={{ color: K.azul }}>
        <Pixelado texto="de saúde" size={44} />
      </span>
      <br />
      <Pixelado texto="para orientações." size={44} />
    </div>
  );

// ---------- som ----------
const SFX: [number, string, number][] = [
  ...PARTES.slice(1).map(
    ([de]) => [de, "whoosh", 0.25] as [number, string, number],
  ),
  [T.olho + 12, "trava", 0.32],
  [T.alerta, "trava", 0.3],
  [T.sema, "pop", 0.18],
  [T.tirz, "pop", 0.18],
  [T.lira, "pop", 0.18],
  [T.nervo - 6, "bip", 0.22],
  [T.raro + 16, "plim", 0.25],
  [T.seis, "pop", 0.2],
  [T.quatro, "pop", 0.2],
  [T.treze, "pop", 0.22],
  [T.treze + 24, "trava", 0.28],
  [T.umOlho, "pop", 0.18],
  [T.semDor, "pop", 0.18],
  [T.acordar, "pop", 0.18],
  [T.mesmoDia, "trava", 0.32],
  [T.converse, "plim", 0.25],
  [T.final, "plim", 0.3],
];
// trilha: 0,22 nas pausas e 0,09 sob a voz
const FALANDO = (() => {
  const v = new Float32Array(DURATION + 1);
  FALA.forEach((p, i) => {
    const fim =
      i + 1 < FALA.length && FALA[i + 1].f - p.f < 20
        ? FALA[i + 1].f
        : p.f + 12;
    for (let fr = Math.max(0, p.f - 4); fr <= Math.min(DURATION, fim + 6); fr++)
      v[fr] = 1;
  });
  const suave = new Float32Array(v.length);
  let acc = 0;
  for (let fr = 0; fr < v.length; fr++) {
    acc += (v[fr] - acc) * (v[fr] > acc ? 0.25 : 0.08);
    suave[fr] = acc;
  }
  return suave;
})();
const musica = (fr: number) =>
  (0.22 -
    0.13 * (FALANDO[Math.max(0, Math.min(DURATION, Math.round(fr)))] ?? 0)) *
  (1 - P(fr, DURATION - 45, DURATION));

export const VideoNoticiaGlp1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo f={f} />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S6b f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S9 f={f} />
      <Canto f={f} />
      <Legenda f={f} />
      <Audio src={staticFile("noticiaGlp1/narracao.mp3")} />
      <Audio src={staticFile("noticiaGlp1/musica.wav")} volume={musica} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Capa (1080×1920). Tudo entre y≈300 e 1620 (recorte 3:4 do TikTok e do Instagram).
export const CapaNoticiaGlp1: React.FC = () => (
  <AbsoluteFill>
    <Fundo f={0} />
    <div
      style={{
        position: "absolute",
        top: 330,
        width: 1080,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: PIX,
          fontSize: 28,
          color: K.branco,
          background: K.vermelho,
          border: `5px solid ${K.tinta}`,
          boxShadow: `8px 8px 0 ${K.tinta}`,
          padding: "16px 26px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ width: 20, height: 20, background: K.branco }} />
        <span>
          <Pixelado texto="NOTÍCIAS DA FARMÁCIA #3" size={28} />
        </span>
      </span>
    </div>
    <Titulo
      f={100}
      at={0}
      top={450}
      size={64}
      linhas={[
        [{ t: "CANETAS GLP-1" }],
        [{ t: "E A VISÃO", cor: K.vermelho }],
      ]}
    />
    <Janela f={100} at={0} x={60} y={690} w={640} h={560} titulo="aviso novo na bula">
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 630,
          height: 496,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("noticiaGlp1/brutas/visao_noiana_simulada.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 70%" }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 15,
            color: K.branco,
            background: "rgba(22,22,26,0.72)",
            padding: "3px 8px",
          }}
        >
          Simulação a partir de foto do NEI (NIH), domínio público
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 315,
          top: 80,
          transform: "translate(-50%,-50%) rotate(-8deg)",
          fontFamily: PIX,
          fontSize: 34,
          color: K.vermelho,
          border: `5px solid ${K.vermelho}`,
          padding: "10px 18px",
          background: "rgba(255,255,255,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        <Pixelado texto="ALERTA FDA" size={34} />
      </div>
    </Janela>
    <div
      style={{
        position: "absolute",
        left: 720,
        top: 760,
        transform: "scale(0.62)",
        transformOrigin: "0 0",
        filter: "drop-shadow(8px 8px 0 rgba(22,22,26,0.25))",
      }}
    >
      <Reporter f={1} boca={[2, 2]} />
    </div>
    <div
      style={{
        position: "absolute",
        top: 1330,
        left: 60,
        width: 960,
        textAlign: "center",
        fontFamily: VT,
        fontSize: 58,
        color: K.tinta,
      }}
    >
      <span
        style={{
          background: K.amarelo,
          border: `4px solid ${K.tinta}`,
          boxShadow: `6px 6px 0 ${K.tinta}`,
          padding: "6px 24px",
        }}
      >
        o sinal que não dá para ignorar 👁️
      </span>
    </div>
  </AbsoluteFill>
);
