import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { MAO, SANS } from "../fonts";
import { OUT, P, SNAP, it } from "../lib";
import {
  AMARELO,
  AZUL,
  Bacteria,
  Boneco,
  Calendario,
  Cartela,
  Coletor,
  Comprimido,
  EM_PE,
  Gaveta,
  INK,
  LILAS,
  Lixeira,
  PAPEL,
  Pose,
  Receita,
  Sacola,
  Termometro,
  VERDE,
  VERM,
  Vaso,
  Virus,
  Visto,
  XVermelho,
  andar,
  poseAt,
} from "./Boneco";

// "Sobrou antibiótico? Não guarda para a próxima" — teste do boneco de palito feito em código.
// Versão SEM ÁUDIO: tempos estimados no ritmo da fala (~2,3 palavras/s). Roteiro: roteiros/antibiotico_sobra_gaveta.md.
const S = (s: number) => Math.round(s * 30);
const T = {
  gripe: S(4.5),
  virus: S(9.5),
  naoPara: S(17),
  bact: S(19.5),
  fortes: S(27),
  falha: S(32.5),
  sobra: S(38),
  coleta: S(40.5),
  siga: S(50.5),
  fim: S(55.5),
};
export const DURATION_BONECO_CODIGO = S(59);
const CHAO = 1420;

// tremidinha de traço feito à mão (muda a cada 4 quadros)
const Papel: React.FC<{ f: number; children: React.ReactNode }> = ({
  f,
  children,
}) => {
  const seed = Math.floor(f / 4) % 7;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <filter id={`mao${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <g filter={`url(#mao${seed})`}>{children}</g>
    </svg>
  );
};

// rótulo à mão, lilás, sem fundo (halo creme)
const Rotulo: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  size?: number;
  cor?: string;
  children: React.ReactNode;
  rot?: number;
  ate?: number;
}> = ({ f, at, x, y, size = 64, cor = LILAS, children, rot = -2, ate }) => {
  if (f < at || (ate !== undefined && f > ate)) return null;
  const k = it(f, at, at + 14, 0, 1, OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg)`,
        fontFamily: MAO,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.05,
        color: cor,
        textAlign: "center",
        whiteSpace: "nowrap",
        clipPath: `inset(-20% ${(1 - k) * 115 - 15}% -20% -15%)`,
        textShadow: `0 0 6px ${PAPEL}, 0 0 12px ${PAPEL}, 0 0 18px ${PAPEL}`,
      }}
    >
      {children}
    </div>
  );
};

const Cena: React.FC<{
  f: number;
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ f, from, to, children }) => {
  if (f < from || f >= to) return null;
  const op = Math.min(
    from === 0 ? 1 : P(f, from, from + 8),
    1 - P(f, to - 8, to),
  );
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Chao: React.FC = () => (
  <path
    d={`M60,${CHAO} q260,-8 480,0 t480,0`}
    fill="none"
    stroke={INK}
    strokeWidth={5}
    strokeLinecap="round"
    opacity={0.6}
  />
);

const pop = (f: number, at: number) =>
  f < at ? 0 : it(f, at, at + 12, 0, 1, SNAP);

// poses prontas
const DEDO_NAO = (f: number): Pose => ({
  ...EM_PE,
  ra: [160, 178 + Math.sin(f / 3) * 14],
});
const SEGURA: Pose = { ...EM_PE, ra: [55, 110] };
const SEGURA_ALTO: Pose = { ...EM_PE, ra: [120, 150] };
const GUARDA: Pose = { ...EM_PE, ra: [75, 95] };
const MAO_QUEIXO: Pose = { ...EM_PE, ra: [40, 200] };
const BRACOS_ABERTOS: Pose = { ...EM_PE, la: [-120, -130], ra: [120, 130] };
const OMBROS: Pose = { ...EM_PE, la: [-60, -150], ra: [60, 150] };

export const VideoBonecoCodigo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      {/* textura leve de papel */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 900px 1300px at 50% 45%, rgba(255,255,255,.55), rgba(0,0,0,0) 70%)",
        }}
      />

      {/* 1. gancho: guardando a sobra na gaveta */}
      <Cena f={f} from={0} to={T.gripe}>
        <Papel f={f}>
          <Chao />
          <Gaveta
            x={800}
            y={CHAO}
            abre={f < S(1.6) ? 1 : 1 - P(f, S(1.6), S(2.1))}
          />
          <Boneco
            f={f}
            x={500}
            y={CHAO}
            dir={1}
            cara={f < S(2.2) ? "feliz" : "surpreso"}
            pose={poseAt(f, [
              [0, SEGURA],
              [S(1.0), GUARDA],
              [S(1.8), EM_PE],
            ])}
            maoD={(x, y) =>
              f < S(1.4) ? (
                <Cartela x={x + 30} y={y} s={0.9} rot={-10} restam={3} />
              ) : null
            }
          />
          {f >= S(2.2) && (
            <g
              transform={`translate(${it(f, S(2.2), S(3.2), -250, 0, OUT)},0)`}
            >
              <Boneco
                f={f}
                x={200}
                y={CHAO}
                dir={1}
                farma
                cara="bravo"
                pose={f < S(3.2) ? andar(f) : DEDO_NAO(f)}
              />
            </g>
          )}
        </Papel>
        <Rotulo f={f} at={0} x={540} y={300} size={92} cor={INK}>
          Sobrou antibiótico?
        </Rotulo>
        <Rotulo f={f} at={S(2.6)} x={540} y={430} size={110} cor={VERM}>
          Não guarda!
        </Rotulo>
        <Rotulo f={f} at={S(0.8)} x={860} y={1050} size={50}>
          a sobra
        </Rotulo>
      </Cena>

      {/* 2. meses depois, a gripe */}
      <Cena f={f} from={T.gripe} to={T.virus}>
        <Papel f={f}>
          <Chao />
          <Calendario
            x={540}
            y={330}
            s={0.9}
            texto={f < T.gripe + 20 ? "+1" : f < T.gripe + 40 ? "+2" : "+3"}
          />
          <Gaveta x={800} y={CHAO} abre={P(f, S(7.4), S(8.0))} />
          <Boneco
            f={f}
            x={480}
            y={CHAO}
            dir={1}
            cara={f < S(7.6) ? "doente" : "feliz"}
            pose={{
              ...poseAt(f, [
                [T.gripe, EM_PE],
                [S(7.2), EM_PE],
                [S(7.8), { ...EM_PE, ra: [80, 90] }],
                [S(8.4), SEGURA_ALTO],
              ]),
              tilt:
                f > S(5.6) && f < S(6.4)
                  ? -10 * Math.sin(((f - S(5.6)) / 24) * Math.PI)
                  : 0,
            }}
            maoE={() =>
              f < S(7.2) ? (
                <Termometro x={-20} y={-470} rot={170} s={1} />
              ) : null
            }
            maoD={(x, y) =>
              f >= S(8.0) ? (
                <Cartela x={x + 10} y={y - 30} s={1} rot={-10} restam={3} />
              ) : null
            }
          />
          {f > S(5.7) && f < S(6.6) && (
            <g fill="#7fb7e8" opacity={1 - P(f, S(6.2), S(6.6))}>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx={560 + i * 26 + (f - S(5.7)) * 3}
                  cy={860 + (i % 2) * 22 - i * 8}
                  r={8}
                />
              ))}
            </g>
          )}
        </Papel>
        <Rotulo f={f} at={T.gripe + 6} x={540} y={520} size={64}>
          3 meses depois...
        </Rotulo>
        <Rotulo f={f} at={S(5.6)} x={250} y={760} size={70} cor={INK}>
          Atchim!
        </Rotulo>
        <Rotulo f={f} at={S(8.2)} x={540} y={640} size={60}>
          "eu tenho o remédio aqui!"
        </Rotulo>
      </Cena>

      {/* 3. gripe é vírus */}
      <Cena f={f} from={T.virus} to={T.naoPara}>
        <Papel f={f}>
          {f >= T.virus && (
            <g transform={`translate(0,${(1 - pop(f, T.virus)) * 80})`}>
              <Virus
                f={f}
                x={620}
                y={820}
                r={150}
                cara={f < S(12.5) ? "neutro" : "feliz"}
              />
            </g>
          )}
          {f >= S(11.5) && (
            <g>
              <Comprimido
                x={it(f, S(11.5), S(13.2), -80, 1180, (x) => x)}
                y={820 + Math.sin(f / 4) * 10}
                s={2}
                rot={f * 8}
              />
            </g>
          )}
          {f >= S(13.8) && (
            <g transform={`translate(0,${(1 - pop(f, S(13.8))) * 60})`}>
              <Boneco
                f={f}
                x={210}
                y={CHAO + 60}
                s={0.75}
                dir={1}
                cara="doente"
                pose={OMBROS}
                maoE={() => <Termometro x={-20} y={-470} rot={170} />}
              />
            </g>
          )}
        </Papel>
        <Rotulo f={f} at={T.virus + 8} x={540} y={330} size={84} cor={INK}>
          Gripe = vírus
        </Rotulo>
        <Rotulo f={f} at={S(11.6)} x={540} y={450} size={62}>
          antibiótico não mata vírus
        </Rotulo>
        <Rotulo f={f} at={S(14.2)} x={700} y={1250} size={58}>
          ...e a gripe continua
        </Rotulo>
      </Cena>

      {/* 4. ponta solta */}
      <Cena f={f} from={T.naoPara} to={T.bact}>
        <Papel f={f}>
          <Chao />
          <Boneco
            f={f}
            x={320}
            y={CHAO}
            farma
            dir={1}
            cara="pensando"
            pose={SEGURA_ALTO}
          />
          <g
            transform={`translate(640,${700 + (1 - pop(f, T.naoPara + 4)) * 60}) rotate(-4)`}
          >
            <rect
              x={-230}
              y={-130}
              width={460}
              height={260}
              rx={14}
              fill="#ffffff"
              stroke={INK}
              strokeWidth={7}
            />
            <line
              x1={-150}
              y1={130}
              x2={-260}
              y2={420}
              stroke={INK}
              strokeWidth={9}
              strokeLinecap="round"
            />
          </g>
        </Papel>
        <Rotulo
          f={f}
          at={T.naoPara + 10}
          x={640}
          y={700}
          size={78}
          cor={VERM}
          rot={-4}
        >
          E NÃO PARA AÍ...
        </Rotulo>
      </Cena>

      {/* 5. as bactérias e a sobra */}
      <Cena f={f} from={T.bact} to={T.falha}>
        <Papel f={f}>
          {[
            [300, 760, 0],
            [560, 700, 1],
            [800, 790, 2],
            [380, 960, 3],
            [660, 940, 4],
            [870, 1020, 5],
            [250, 1140, 6],
            [560, 1170, 7],
          ].map(([x, y, i]) => {
            const forte = i === 4;
            const some = forte ? 0 : P(f, S(24) + i * 3, S(24.6) + i * 3);
            if (some >= 1 || f < T.bact + i * 3) return null;
            return (
              <g key={i} opacity={1 - some}>
                <Bacteria
                  f={f}
                  x={x}
                  y={y}
                  s={
                    (forte ? 1 + 0.35 * P(f, S(25), S(26)) : 0.8) *
                    (0.4 + 0.6 * pop(f, T.bact + i * 3)) *
                    (1 + some)
                  }
                  rot={((i * 37) % 60) - 30}
                  forte={forte && f > S(24.5)}
                  seed={i}
                />
              </g>
            );
          })}
          {/* mais cópias da forte */}
          {[
            [330, 800],
            [840, 820],
            [380, 1150],
            [860, 1150],
            [600, 1240],
          ].map(([x, y], i) =>
            f >= T.fortes + 10 + i * 8 ? (
              <Bacteria
                key={i}
                f={f}
                x={x}
                y={y}
                s={0.9 * pop(f, T.fortes + 10 + i * 8)}
                rot={i * 25 - 40}
                forte
                seed={i + 10}
              />
            ) : null,
          )}
          {f >= S(21) && f < S(24.5) && (
            <g>
              <Cartela x={540} y={420} s={1.6} restam={3} />
              {f >= S(23.2) &&
                [0, 1, 2].map((i) => (
                  <Comprimido
                    key={i}
                    x={it(
                      f,
                      S(23.2) + i * 4,
                      S(24.2) + i * 4,
                      540,
                      [380, 640, 300][i],
                    )}
                    y={it(
                      f,
                      S(23.2) + i * 4,
                      S(24.2) + i * 4,
                      420,
                      [760, 700, 1140][i],
                    )}
                    s={1}
                    rot={f * 10}
                  />
                ))}
            </g>
          )}
        </Papel>
        <Rotulo
          f={f}
          at={T.bact + 4}
          x={540}
          y={250}
          size={78}
          cor={INK}
          ate={S(26.8)}
        >
          Mesmo se for bactéria...
        </Rotulo>
        <Rotulo f={f} at={S(21.6)} x={540} y={560} size={54} ate={S(24.4)}>
          remédio errado · poucos dias
        </Rotulo>
        <Rotulo f={f} at={T.fortes} x={540} y={250} size={70} cor={INK}>
          as mais fortes sobrevivem
        </Rotulo>
        <Rotulo f={f} at={T.fortes + 26} x={540} y={360} size={62} cor={VERM}>
          e se espalham
        </Rotulo>
      </Cena>

      {/* 6. um dia ele não funciona */}
      <Cena f={f} from={T.falha} to={T.sobra}>
        <Papel f={f}>
          <Chao />
          <Boneco
            f={f}
            x={330}
            y={CHAO}
            dir={1}
            cara="triste"
            pose={SEGURA}
            maoD={(x, y) => <Comprimido x={x + 30} y={y} s={1.1} rot={-20} />}
            maoE={() => <Termometro x={-20} y={-470} rot={170} />}
          />
          {[
            [760, 760],
            [880, 920],
            [700, 1000],
          ].map(([x, y], i) => (
            <Bacteria
              key={i}
              f={f}
              x={x}
              y={y}
              s={0.85 * pop(f, T.falha + 6 + i * 6)}
              forte
              seed={i + 20}
              rot={i * 20 - 20}
            />
          ))}
          <XVermelho x={790} y={880} s={1.6} k={P(f, S(35), S(35.8))} />
        </Papel>
        <Rotulo f={f} at={T.falha + 8} x={540} y={330} size={78} cor={INK}>
          Um dia você precisa...
        </Rotulo>
        <Rotulo f={f} at={S(35)} x={540} y={450} size={78} cor={VERM}>
          ...e ele não funciona
        </Rotulo>
      </Cena>

      {/* 7. e a sobra? */}
      <Cena f={f} from={T.sobra} to={T.coleta}>
        <Papel f={f}>
          <Chao />
          <Boneco
            f={f}
            x={540}
            y={CHAO}
            farma
            dir={0}
            cara="pensando"
            pose={MAO_QUEIXO}
          />
        </Papel>
        <Rotulo f={f} at={T.sobra + 6} x={540} y={520} size={100} cor={INK}>
          E a sobra?
        </Rotulo>
        <Rotulo
          f={f}
          at={T.sobra + 14}
          x={820}
          y={680}
          size={140}
          cor={LILAS}
          rot={8}
        >
          ?
        </Rotulo>
      </Cena>

      {/* 8. ponto de coleta */}
      <Cena f={f} from={T.coleta} to={T.siga}>
        <Papel f={f}>
          <Chao />
          <Coletor x={820} y={CHAO} />
          {(() => {
            const chega = S(43);
            const x = it(f, T.coleta, chega, 150, 560, (k) => k);
            const solta = S(43.6);
            return (
              <g>
                <Boneco
                  f={f}
                  x={x}
                  y={CHAO}
                  dir={1}
                  cara={f < solta ? "neutro" : "feliz"}
                  pose={
                    f < chega
                      ? andar(f, SEGURA)
                      : poseAt(f, [
                          [chega, SEGURA],
                          [solta, { ...EM_PE, ra: [110, 120] }],
                          [S(44.4), EM_PE],
                        ])
                  }
                  maoD={(hx, hy) =>
                    f < solta ? (
                      <Sacola x={hx + 10} y={hy - 10} s={0.8} />
                    ) : null
                  }
                />
                {f >= solta && f < S(44.4) && (
                  <Sacola
                    x={it(f, solta, S(44.2), 760, 820)}
                    y={it(f, solta, S(44.2), 1060, 1170)}
                    s={0.5 * (1 - P(f, S(44), S(44.4)))}
                  />
                )}
              </g>
            );
          })()}
          <Visto x={940} y={920} s={1} k={P(f, S(44.2), S(44.8))} />
          {f >= S(45.2) && (
            <g>
              <Lixeira x={200} y={720} s={0.75 * pop(f, S(45.2))} />
              <Vaso x={430} y={720} s={0.75 * pop(f, S(45.6))} />
              <XVermelho x={200} y={640} s={1} k={P(f, S(46), S(46.6))} />
              <XVermelho x={430} y={640} s={1} k={P(f, S(46.4), S(47))} />
            </g>
          )}
          {f >= S(47.6) && (
            <Receita x={760} y={560} s={pop(f, S(47.6))} rot={6} />
          )}
        </Papel>
        <Rotulo f={f} at={T.coleta + 6} x={540} y={230} size={74} cor={INK}>
          Leve à farmácia
        </Rotulo>
        <Rotulo f={f} at={S(45.4)} x={320} y={850} size={50} cor={VERM}>
          nada de lixo ou vaso
        </Rotulo>
        <Rotulo f={f} at={S(47.8)} x={720} y={740} size={50}>
          antibiótico: só com receita
        </Rotulo>
      </Cena>

      {/* 9. me siga */}
      <Cena f={f} from={T.siga} to={T.fim}>
        <Papel f={f}>
          <Chao />
          <Boneco
            f={f}
            x={180}
            y={CHAO}
            s={0.8}
            farma
            dir={1}
            cara="feliz"
            pose={BRACOS_ABERTOS}
          />
        </Papel>
        <Img
          src={staticFile("rdcShort/logo.jpg")}
          style={{
            position: "absolute",
            left: 390,
            top: 330,
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: `6px solid ${INK}`,
            transform: `scale(${pop(f, T.siga + 4)})`,
          }}
        />
        <Rotulo f={f} at={T.siga + 10} x={620} y={820} size={120} cor={INK}>
          Me siga
        </Rotulo>
        <Rotulo f={f} at={T.siga + 22} x={640} y={960} size={48} rot={0}>
          para mais dicas de farmacologia
          <br />e curiosidades sobre a área
        </Rotulo>
        <Rotulo
          f={f}
          at={T.siga + 40}
          x={720}
          y={1160}
          size={46}
          cor={VERDE}
          rot={0}
        >
          manda para quem tem
          <br />
          uma gaveta cheia de remédio
        </Rotulo>
      </Cena>

      {/* 10. tela final */}
      <Cena f={f} from={T.fim} to={DURATION_BONECO_CODIGO + 1}>
        {["Consulte um", "profissional de saúde", "para orientações."].map(
          (l, i) => (
            <Rotulo
              key={i}
              f={f}
              at={T.fim + 4 + i * 8}
              x={540}
              y={760 + i * 120}
              size={i === 1 ? 96 : 84}
              cor={i === 1 ? VERDE : INK}
              rot={0}
            >
              {l}
            </Rotulo>
          ),
        )}
      </Cena>

      {/* selo de teste */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 1700,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 3,
          color: "rgba(31,29,26,.35)",
        }}
      >
        PRÉVIA SEM ÁUDIO
      </div>
      {void AZUL}
      {void AMARELO}
    </AbsoluteFill>
  );
};
