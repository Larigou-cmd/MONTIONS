import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { Background, EASE, Grain, IN, OUT, P, Part, Pill, SNAP, Txt, W, bornColor, it, rgba } from "../lib";
import { Card, EMOJI, Emoji, Title } from "../aas/ui";
import { AMOX, ANEL, CLAV, CUIDADOS, DURATION, LACT, MENSAGEM_FINAL, PARTES, PBP, SFX, T } from "./config";
import { Bacteria, Capsula, Escudo, Lactamase, Mol, Pbp, pontoParede } from "./shapes";

// Amoxicilina + clavulanato no modelo "aula elegante" (o do vídeo dos prazóis):
// fundo escuro com brilho, títulos em serifa, cartões arredondados, sem legenda e sem referências na tela.
export { DURATION };
const R = (i: number) => PARTES[i];
const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={W} height={1920} style={{ position: "absolute" }}>{children}</svg>;
// valor que vai de a até b entre os quadros i e j
const mov = (f: number, i: number, j: number, a: number, b: number) => interpolate(f, [i, j], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

// 1. abertura
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const k = it(f, 4, 30, 0, 1, SNAP);
  return (
    <Part from={R(0)[0]} to={R(0)[1]}>
      <Tela>{k > 0 && <Capsula x={540} y={580} s={k} rot={-22 + Math.sin(f / 30) * 5} clav={P(f, T.clav, T.clav + 16)} />}</Tela>
      <Title f={f} at={T.amox} y={820} size={88} weight={600} from={AMOX}>Amoxicilina</Title>
      <Title f={f} at={T.clav} y={935} size={62} font={SANS} weight={600} color={CLAV} from={CLAV}>+ clavulanato</Title>
      <Pill x={540} y={1080} text="1 antibiótico · 2 substâncias" color={AMOX} size={36} k={P(f, T.junta, T.junta + 12)} />
      <Title f={f} at={T.porque} y={1170} size={64} from={CLAV}>Por que juntar as duas?</Title>
      <Title f={f} at={T.sozinha} y={1270} size={40} font={SANS} color={C.dim} from={AMOX}>e não usar a amoxicilina sozinha?</Title>
    </Part>
  );
};

// posições das 4 enzimas PBP em volta da bactéria
const PBPS = [200, 340, 20, 160];
const pbpXY = (cx: number, cy: number, a: number, b: number) => PBPS.map((ang) => pontoParede(cx, cy, a, b, ang, 64));
const dirPara = (x: number, y: number, cx: number, cy: number) => (Math.atan2(cy - y, cx - x) * 180) / Math.PI;

// 2. amoxicilina: trava as PBPs e a parede se rompe
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const fase1 = 1 - it(f, T.bacterias - 14, T.bacterias, 0, 1, IN);
  const cx = 540, cy = 690, a = 300, b = 170;
  const tijolos = mov(f, T.constroem, T.constroem + 60, 0.72, 1);
  const falhas = mov(f, T.semParede, T.rompe, 0, 0.45);
  const estouro = it(f, T.rompe, T.rompe + 26, 0, 1, OUT);
  const trava = P(f, T.trava - 4, T.trava + 8);
  const pos = pbpXY(cx, cy, a, b);
  return (
    <Part from={R(1)[0]} to={R(1)[1]} inY={100}>
      <Title f={f} at={T.titAmox} y={235} size={68} weight={600} from={AMOX}>Amoxicilina</Title>
      {fase1 > 0 && (
        <AbsoluteFill style={{ opacity: fase1, filter: fase1 < 1 ? `blur(${(1 - fase1) * 12}px)` : undefined }}>
          <Tela>{f >= T.titAmox && <Mol x={570} y={600} s={1.7 * it(f, T.titAmox, T.titAmox + 16, 0, 1, SNAP)} tipo="amox" anel={P(f, T.beta, T.beta + 14)} rot={Math.sin(f / 30) * 4} />}</Tela>
          <Pill x={540} y={840} text="uma penicilina" color={AMOX} size={40} k={P(f, T.penicilina, T.penicilina + 12)} />
          <Pill x={540} y={950} text="família dos betalactâmicos" color={ANEL} size={40} k={P(f, T.beta, T.beta + 12)} />
          <Title f={f} at={T.beta + 20} y={1030} size={34} font={SANS} color={C.dim} from={ANEL}>o quadrado é o anel betalactâmico</Title>
        </AbsoluteFill>
      )}
      {f >= T.bacterias - 6 && (
        <AbsoluteFill style={{ opacity: it(f, T.bacterias - 6, T.bacterias + 8, 0, 1, OUT) }}>
          <Tela>
            <Bacteria x={cx} y={cy} a={a} b={b} f={f} tijolos={tijolos} falhas={falhas} estouro={estouro} />
            {pos.map(([x, y], i) => {
              const at = T.enzimas + i * 5;
              if (f < at || estouro >= 1) return null;
              const s = it(f, at, at + 12, 0, 1, SNAP);
              const d = dirPara(x, y, cx, cy) + 180;
              const chegou = T.encaixa + 40 + i * 4;
              const amx = mov(f, T.encaixa + i * 4, chegou, x < 540 ? -150 : 1230, x + Math.cos((d * Math.PI) / 180) * 30);
              const amy = mov(f, T.encaixa + i * 4, chegou, y, y + Math.sin((d * Math.PI) / 180) * 30);
              return (
                <g key={i} opacity={1 - estouro}>
                  <g transform={`translate(${x},${y}) scale(${s}) translate(${-x},${-y})`}><Pbp x={x} y={y} dir={d} f={f + i * 7} cinza={trava} /></g>
                  {f >= T.encaixa + i * 4 && <Mol x={amx} y={amy} s={0.36} tipo="amox" />}
                  {trava > 0 && <text x={x} y={y - 62} textAnchor="middle" fontFamily={EMOJI} fontSize={44 * SNAP(Math.min(1, trava))}>🔒</text>}
                </g>
              );
            })}
          </Tela>
          <Pill x={540} y={410} text="a parede da bactéria" color="#86efac" size={36} k={P(f, T.parede, T.parede + 12) * (1 - P(f, T.enzimas - 8, T.enzimas))} />
          <Pill x={540} y={410} text="as enzimas PBP constroem a parede" color={PBP} size={34} k={P(f, T.pbps - 20, T.pbps - 8) * (1 - P(f, T.trava - 8, T.trava))} />
          <Title f={f} at={T.encaixa + 10} y={985} size={46} font={SANS} weight={600} color={AMOX} from={AMOX}>a amoxicilina encaixa nas PBPs…</Title>
          <Title f={f} at={T.trava} y={1065} size={56} weight={600} from={PBP}>…e trava a construção</Title>
          <Title f={f} at={T.rompe} y={1170} size={52} font={SANS} weight={700} color={C.alert} from={C.alert}>a bactéria se rompe e morre</Title>
        </AbsoluteFill>
      )}
    </Part>
  );
};

// 3. resistência: a betalactamase quebra o anel
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 540, cy = 560;
  const sai = (i: number) => mov(f, T.produzem + i * 8, T.produzem + 40 + i * 8, 0, 1);
  const lugares: [number, number][] = [[230, 470], [850, 470], [540, 360]];
  // a terceira betalactamase desce até o anel da amoxicilina (anel em 540,1100)
  const desce = mov(f, T.quebra - 10, T.anel + 30, 0, 1);
  const quebra = mov(f, T.quebrado - 8, T.quebrado + 10, 0, 1);
  const cinza = P(f, T.perde, T.perde + 20);
  return (
    <Part from={R(2)[0]} to={R(2)[1]} inY={100}>
      <Title f={f} at={T.problema} y={235} size={64} weight={600} color="#fda4af" from={C.alert}>O problema</Title>
      <Tela>
        <Bacteria x={cx} y={cy} a={200} b={110} f={f} escudo={P(f, T.defender, T.defender + 20)} />
        {f >= T.produzem && lugares.map(([lx, ly], i) => {
          let x = cx + (lx - cx) * sai(i), y = cy + (ly - cy) * sai(i);
          let dir = i === 0 ? 0 : i === 1 ? 180 : 90;
          let abre: number | undefined;
          if (i === 2) {
            x = x + (540 - x) * desce; y = y + (1100 - 92 - y) * desce;
            if (f >= T.quebrado - 8) abre = 1 - quebra;
          }
          if (i !== 2) dir += Math.sin(f / 20 + i) * 8;
          return <Lactamase key={i} x={x} y={y} r={46} dir={dir} f={f + i * 9} abre={abre} />;
        })}
        {f >= T.quebra - 30 && <Mol x={mov(f, T.quebra - 30, T.quebra, -200, 540)} y={1100} s={1.35} tipo="amox" anel={P(f, T.anel, T.anel + 12)} quebra={quebra} cinza={cinza} />}
        {cinza > 0 && <text x={760} y={1120} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={110 * SNAP(Math.min(1, cinza * 2))} fill={C.alert}>✗</text>}
      </Tela>
      <Pill x={540} y={760} text="muitas bactérias aprenderam a se defender" color={LACT} size={32} k={P(f, T.defender, T.defender + 12) * (1 - P(f, T.lactamase - 8, T.lactamase))} />
      <Title f={f} at={T.lactamase} y={735} size={76} weight={600} color="#fda4af" from={LACT}>Betalactamase</Title>
      <Title f={f} at={T.quebra} y={835} size={40} font={SANS} color={C.dim} from={LACT}>uma enzima que quebra o anel</Title>
      <Pill x={540} y={1250} text="anel betalactâmico" color={ANEL} size={36} k={P(f, T.anel, T.anel + 12) * (1 - P(f, T.perde - 8, T.perde))} />
      <Title f={f} at={T.perde} y={1225} size={50} font={SANS} weight={700} color={C.alert} from={C.alert}>a amoxicilina perde o efeito</Title>
      <Title f={f} at={T.alvo} y={1305} size={38} font={SANS} color={C.dim} from={C.alert}>antes de chegar ao alvo</Title>
    </Part>
  );
};

// 4. clavulanato: a betalactamase se prende nele e fica inativada (o escudo)
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const fase1 = 1 - it(f, T.escudo - 12, T.escudo, 0, 1, IN);
  const chega = mov(f, T.prende - 6, T.prende + 36, 0, 1);
  const cinza = P(f, T.inativada, T.inativada + 20);
  const quebra = 0.45 * P(f, T.prende + 34, T.prende + 46);
  const esc = it(f, T.escudo, T.escudo + 16, 0, 1, SNAP);
  return (
    <Part from={R(3)[0]} to={R(3)[1]} inY={100}>
      <Title f={f} at={T.titClav} y={235} size={68} weight={600} from={CLAV}>Clavulanato</Title>
      {fase1 > 0 && (
        <AbsoluteFill style={{ opacity: fase1, filter: fase1 < 1 ? `blur(${(1 - fase1) * 12}px)` : undefined }}>
          <Tela>
            {f >= T.titClav && <Mol x={560} y={560} s={1.6 * it(f, T.titClav, T.titClav + 16, 0, 1, SNAP)} tipo="clav" anel={P(f, T.anel2, T.anel2 + 12)} quebra={quebra} cinza={cinza * 0.5} rot={Math.sin(f / 30) * 3 * (1 - chega)} />}
            {f >= T.prende - 6 && <Lactamase x={mov(f, T.prende - 6, T.prende + 36, -120, 560 - 45 * 1.6 - 50)} y={560} r={58} dir={0} f={f} cinza={cinza} abre={chega >= 1 ? 0.15 : undefined} />}
            {f >= T.sempre && <text x={470} y={455} textAnchor="middle" fontFamily={EMOJI} fontSize={70 * SNAP(Math.min(1, P(f, T.sempre, T.sempre + 12)))}>🔒</text>}
          </Tela>
          <Pill x={540} y={760} text="também tem o anel betalactâmico" color={ANEL} size={34} k={P(f, T.anel2, T.anel2 + 12) * (1 - P(f, T.prende - 8, T.prende))} />
          <Pill x={540} y={860} text="quase não mata bactéria sozinho" color={CLAV} size={34} k={P(f, T.quase, T.quase + 12) * (1 - P(f, T.prende - 8, T.prende))} />
          <Title f={f} at={T.prende} y={760} size={44} font={SANS} weight={600} color={C.ink} from={LACT}>a betalactamase se prende nele…</Title>
          <Title f={f} at={T.inativada} y={845} size={60} weight={600} color="#fda4af" from={LACT}>…e fica inativada</Title>
          <Title f={f} at={T.sempre} y={945} size={46} font={SANS} weight={700} color={ANEL} from={ANEL}>para sempre</Title>
        </AbsoluteFill>
      )}
      {f >= T.escudo - 2 && (
        <AbsoluteFill style={{ opacity: it(f, T.escudo - 2, T.escudo + 10, 0, 1, OUT) }}>
          <Tela>
            <Escudo x={540} y={640} s={1.9 * esc} f={f} />
            {esc > 0 && <Mol x={560} y={650} s={0.85 * esc} tipo="amox" />}
            {[[-1, 0], [1, 1]].map(([lado, i]) => {
              const at = T.sacrifica + i * 8;
              if (f < at - 30) return null;
              const x = mov(f, at - 30, at, 540 + lado * 640, 540 + lado * 230);
              const g = P(f, at, at + 14);
              return (
                <g key={i}>
                  <Lactamase x={x} y={600 + i * 120} r={50} dir={lado < 0 ? 0 : 180} f={f} cinza={g} abre={g > 0 ? 0.12 : undefined} />
                  {g > 0 && <Mol x={x + lado * -70} y={600 + i * 120} s={0.42} tipo="clav" cinza={g * 0.5} quebra={0.45} />}
                </g>
              );
            })}
          </Tela>
          <Title f={f} at={T.escudo} y={960} size={66} weight={600} from={CLAV}>Um escudo</Title>
          <Title f={f} at={T.sacrifica} y={1060} size={46} font={SANS} weight={600} color={CLAV} from={CLAV}>que se sacrifica</Title>
          <Title f={f} at={T.protege} y={1140} size={46} font={SANS} weight={600} color={AMOX} from={AMOX}>para proteger a amoxicilina</Title>
        </AbsoluteFill>
      )}
    </Part>
  );
};

// 5. juntas: a amoxicilina fica livre e a bactéria se rompe
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 540, cy = 640, a = 280, b = 160;
  const pos = pbpXY(cx, cy, a, b);
  const trava = P(f, T.livre + 44, T.livre + 52);
  const falhas = mov(f, T.destruir - 10, T.destruir + 14, 0, 0.5);
  const estouro = it(f, T.destruir + 14, T.destruir + 40, 0, 1, OUT);
  const cards: [number, string, string][] = [[T.sinusite, "👃", "Sinusite"], [T.otite, "👂", "Otite"], [T.pele, "🐕", "Pele (mordidas)"]];
  return (
    <Part from={R(4)[0]} to={R(4)[1]} inY={100}>
      <Title f={f} at={T.livre - 14} y={235} size={64} weight={600} color={C.ink} from={AMOX}>Juntas, funcionam</Title>
      <Tela>
        <Bacteria x={cx} y={cy} a={a} b={b} f={f} falhas={falhas} estouro={estouro} />
        {[[110, 330], [970, 330]].map(([x, y], i) => (
          <g key={`l${i}`} opacity={1 - estouro}>
            <Lactamase x={x} y={y + Math.sin(f / 25 + i) * 6} r={34} dir={i ? 180 : 0} f={f} cinza={1} abre={0.12} />
            <Mol x={x + (i ? -54 : 54)} y={y + Math.sin(f / 25 + i) * 6} s={0.3} tipo="clav" cinza={0.5} quebra={0.45} />
          </g>
        ))}
        {pos.map(([x, y], i) => {
          if (estouro >= 1) return null;
          const d = dirPara(x, y, cx, cy) + 180;
          const at = T.livre + i * 3;
          return (
            <g key={i} opacity={1 - estouro}>
              <Pbp x={x} y={y} dir={d} f={f + i * 7} cinza={trava} />
              {f >= at && <Mol x={mov(f, at, at + 40, x < 540 ? -150 : 1230, x + Math.cos((d * Math.PI) / 180) * 30)} y={y + mov(f, at, at + 40, 0, Math.sin((d * Math.PI) / 180) * 30)} s={0.36} tipo="amox" />}
            </g>
          );
        })}
      </Tela>
      {f >= T.destruir + 40 && <Tela><Capsula x={540} y={640} s={0.9 * it(f, T.destruir + 40, T.destruir + 60, 0, 1, SNAP)} rot={-22 + Math.sin(f / 30) * 5} clav={1} /></Tela>}
      {f >= T.destruir + 50 && <Txt x={900} y={760} size={110} color={C.ink} font={SANS} weight={800} style={{ opacity: P(f, T.destruir + 50, T.destruir + 62), color: "#4ade80", textShadow: "0 0 30px rgba(74,222,128,.6)" }}>✓</Txt>}
      <Pill x={540} y={360} text="amoxicilina livre ✓" color={AMOX} size={36} k={P(f, T.livre, T.livre + 12) * (1 - P(f, T.funciona, T.funciona + 10))} />
      <Title f={f} at={T.funciona} y={920} size={48} font={SANS} weight={600} from={AMOX}>funciona contra bactérias</Title>
      <Title f={f} at={T.funciona + 12} y={985} size={48} font={SANS} weight={700} color={CLAV} from={CLAV}>que seriam resistentes</Title>
      {cards.map(([at, e, l], i) => (
        <Card key={i} f={f} at={at} x={50 + i * 335} y={1090} w={310} h={210} tilt={[-1, 0.8, -0.6][i]} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontFamily: EMOJI, fontSize: 72 }}>{e}</span>
          <span style={{ fontWeight: 700, fontSize: i === 2 ? 32 : 38 }}>{l}</span>
        </Card>
      ))}
    </Part>
  );
};

// 6. atenção: não vence toda resistência e não trata vírus
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const x = it(f, T.causados, T.causados + 14, 0, 1, SNAP);
  return (
    <Part from={R(5)[0]} to={R(5)[1]} inY={100}>
      <Title f={f} at={T.atencao} y={235} size={68} weight={600} color="#fda4af" from={C.alert}>Atenção</Title>
      <Card f={f} at={T.naoVence} x={60} y={360} w={960} h={200} border={rgba(CLAV, 0.6)} style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 38px" }}>
        <span style={{ fontFamily: EMOJI, fontSize: 72 }}>🛡️</span>
        <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.25 }}>O clavulanato <b style={{ color: CLAV }}>não vence</b> todo tipo de resistência</span>
      </Card>
      <Emoji f={f} at={T.virus} x={540} y={790} size={200}>🦠</Emoji>
      {x > 0 && (
        <svg width={W} height={1920} style={{ position: "absolute" }}>
          <g transform={`translate(540,790) scale(${x})`} stroke={C.alert} strokeWidth={14} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${C.alert})` }}>
            <circle r={150} />
            <line x1={-106} y1={-106} x2={106} y2={106} />
          </g>
        </svg>
      )}
      <Title f={f} at={T.virus} y={980} size={52} font={SANS} weight={700} from={C.alert}>Antibiótico não trata vírus</Title>
      <Pill x={370} y={1130} text="🤧 gripe" color={C.alert} size={40} k={P(f, T.gripe, T.gripe + 12)} />
      <Pill x={710} y={1130} text="🥶 resfriado" color={C.alert} size={40} k={P(f, T.resfriado, T.resfriado + 12)} />
    </Part>
  );
};

// 7. cuidados
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(6)[0]} to={R(6)[1]} inY={100}>
      <Title f={f} at={T.cuidados[0] - 40} y={235} size={60} weight={600} color="#fda4af" from={C.alert}>Cuidados</Title>
      {CUIDADOS.map((c, i) => {
        const at = T.cuidados[i];
        const next = T.cuidados[i + 1] ?? T.final;
        const hot = f >= at && f < next;
        return (
          <Card key={i} f={f} at={at} x={50} y={340 + i * 196} w={980} h={176} border={hot ? rgba(AMOX, 0.75) : C.boxBorder} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 34px", boxShadow: hot ? `0 0 30px ${rgba(AMOX, 0.25)}` : undefined }}>
            <span style={{ fontFamily: EMOJI, fontSize: 64, flexShrink: 0 }}>{c.icone}</span>
            <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.25, color: bornColor(f, at, C.ink, AMOX) }}>{c.texto}</span>
          </Card>
        );
      })}
    </Part>
  );
};

// 8. mensagem final
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Part from={R(7)[0]} to={R(7)[1]} inY={100} outDur={1}>
      {MENSAGEM_FINAL.map((l, i) => {
        const at = T.final + 4 + i * 8;
        const k = it(f, at, at + 14, 0, 1, OUT);
        return <div key={i} style={{ position: "absolute", top: 700 + i * 110, width: W, textAlign: "center", fontFamily: SERIF, fontWeight: i === 1 ? 600 : 400, fontSize: i === 1 ? 92 : 80, color: i === 1 ? bornColor(f, at, AMOX, "#f0f7ff", 20) : bornColor(f, at, C.ink, AMOX), textShadow: i === 1 ? `0 0 30px ${rgba(AMOX, 0.45)}` : "none", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.98 + 0.04 * it(f, T.final, DURATION, 0, 1, (x) => x)})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}>{l}</div>;
      })}
    </Part>
  );
};

export const VideoAmoxi: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background color={f >= T.titClav && f < T.livre ? CLAV : AMOX} pulses={[T.trava, T.rompe, T.quebrado, T.sempre, T.destruir + 14, T.causados, T.final]} />
      <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 />
      <Grain />
      <Audio src={staticFile("amoxi/narracao.mp3")} />
      <Audio src={staticFile("sema/musica_longa.wav")} volume={(fr) => 0.11 * (1 - P(fr, DURATION - 60, DURATION))} />
      {SFX.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
