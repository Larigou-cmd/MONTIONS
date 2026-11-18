import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import grade from "./grade.json";
import { SANS, JORNAL } from "../fonts";

// Teste do estilo "Halftone Dossier" (lemo-opuscar, MIT) em vertical 1080x1920,
// recriado em Remotion para o canal @historicodebusca. Tema: "De vampiro a 007".
// Personagem original (não é retrato de ninguém). Tudo dentro da área segura y 300–1620.

const PAPEL = "#EFE6CF";
const TINTA = "#171D45"; // tinta escura: contornos, texto, barra de legenda
const COBALTO = "#2B4FD6"; // retícula
const ROSA = "#F2578C"; // sombra de impressão fora de registro
const AMARELO = "#F7C531"; // destaque
const VERMELHO = "#D8342B"; // carimbo

export const DURATION = 210;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// entrada com "overshoot" (nada aparece em fade)
const useSalto = (inicio: number, dur = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [inicio, inicio + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.9)),
  });
};

// ---------- retícula: pontos cujo tamanho segue um campo de densidade ----------
const Reticula: React.FC<{
  w: number;
  h: number;
  passo: number;
  angulo: number;
  cor: string;
  densidade: (x: number, y: number) => number;
  k?: number;
}> = ({ w, h, passo, angulo, cor, densidade, k = 0.66 }) => {
  const pts = React.useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    const a = (angulo * Math.PI) / 180;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const R = Math.hypot(w, h);
    for (let i = -R; i < R; i += passo) {
      for (let j = -R; j < R; j += passo) {
        const x = w / 2 + i * c - j * s;
        const y = h / 2 + i * s + j * c;
        if (x < -passo || y < -passo || x > w + passo || y > h + passo)
          continue;
        const d = Math.max(0, Math.min(1, densidade(x, y)));
        const r = d * passo * k;
        if (r > 1.2) out.push({ x, y, r });
      }
    }
    return out;
  }, [w, h, passo, angulo, densidade, k]);
  return (
    <svg
      width={w}
      height={h}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        mixBlendMode: "multiply",
      }}
    >
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={cor} />
      ))}
    </svg>
  );
};

const halo = (x: number, y: number) => {
  const d = Math.hypot(x - 540, y - 960) / 560;
  return 1 - d * d;
};
const borda = (x: number, y: number) => {
  const dx = Math.min(x, 1080 - x) / 300;
  const dy = Math.min(y, 1920 - y) / 520;
  return 0.44 * (1 - Math.min(1, Math.min(dx, dy) * 1.25));
};

// ---------- papel ----------
const Papel: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply" }}>
    <svg width={1080} height={1920}>
      <filter id="dossie-papel">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012"
          numOctaves={3}
          seed={7}
        />
        <feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.54  0 0 0 0 0.40  0 0 0 0.34 0" />
      </filter>
      <filter id="dossie-grao">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          seed={3}
        />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 0.22 0" />
      </filter>
      <rect width={1080} height={1920} filter="url(#dossie-papel)" />
      <rect width={1080} height={1920} filter="url(#dossie-grao)" />
      {/* dobra central */}
      <rect
        x={539}
        y={0}
        width={2}
        height={1920}
        fill="rgba(120,100,70,0.20)"
      />
    </svg>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(110,85,50,0.30) 100%)",
      }}
    />
  </AbsoluteFill>
);

// ---------- personagem original: vampiro de smoking ----------
// Personagem original do primeiro teste (fora de uso desde a troca pela foto)
export const Suspeito: React.FC = () => {
  const frame = useCurrentFrame();
  const semente = Math.floor(frame / 3); // traço "fervendo" a ~10 quadros por segundo
  const pisca = frame % 70 > 64 ? 0.12 : 1;
  const respira = 1 + Math.sin(frame / 16) * 0.008;
  return (
    <svg
      viewBox="0 0 600 640"
      width={640}
      height={683}
      style={{ overflow: "visible" }}
    >
      <filter id="dossie-fervura">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.03"
          numOctaves={2}
          seed={semente}
        />
        <feDisplacementMap in="SourceGraphic" scale={5} />
      </filter>
      <g
        filter="url(#dossie-fervura)"
        stroke={TINTA}
        strokeWidth={9}
        strokeLinejoin="round"
        strokeLinecap="round"
        transform={`translate(300 640) scale(${respira}) translate(-300 -640)`}
      >
        {/* gola alta da capa */}
        <path d="M150 330 L92 150 L236 300 Z" fill={VERMELHO} />
        <path d="M450 330 L508 150 L364 300 Z" fill={VERMELHO} />
        {/* corpo de smoking */}
        <path
          d="M118 640 Q112 420 210 372 L390 372 Q488 420 482 640 Z"
          fill="#2A3A8C"
        />
        {/* camisa */}
        <path d="M246 374 L300 520 L354 374 Z" fill="#FFFDF4" />
        {/* lapelas */}
        <path d="M210 372 L246 374 L300 520 L236 470 Z" fill={TINTA} />
        <path d="M390 372 L354 374 L300 520 L364 470 Z" fill={TINTA} />
        {/* gravata-borboleta */}
        <path d="M300 396 L246 368 L246 424 Z" fill={AMARELO} />
        <path d="M300 396 L354 368 L354 424 Z" fill={AMARELO} />
        <circle cx={300} cy={396} r={13} fill={AMARELO} />
        {/* cabeça */}
        <path
          d="M168 220 Q168 76 300 76 Q432 76 432 220 Q432 348 300 356 Q168 348 168 220 Z"
          fill="#F8DCC6"
        />
        {/* cabelo com bico de viúva */}
        <path
          d="M164 214 Q150 60 300 60 Q450 60 436 214 Q410 132 348 128 L300 176 L252 128 Q190 132 164 214 Z"
          fill={TINTA}
        />
        {/* orelhas pontudas */}
        <path d="M168 214 L132 176 L160 258 Z" fill="#F8DCC6" />
        <path d="M432 214 L468 176 L440 258 Z" fill="#F8DCC6" />
      </g>
      {/* rosto: sem fervura para ficar nítido */}
      <g>
        <ellipse cx={216} cy={270} rx={24} ry={15} fill={ROSA} opacity={0.75} />
        <ellipse cx={384} cy={270} rx={24} ry={15} fill={ROSA} opacity={0.75} />
        {/* olhos brilhantes */}
        <g transform={`translate(0 ${232 * (1 - pisca)}) scale(1 ${pisca})`}>
          <ellipse cx={248} cy={232} rx={22} ry={27} fill={TINTA} />
          <ellipse cx={352} cy={232} rx={22} ry={27} fill={TINTA} />
          <circle cx={256} cy={222} r={8} fill="#fff" />
          <circle cx={360} cy={222} r={8} fill="#fff" />
          <circle cx={241} cy={242} r={4} fill="#fff" />
          <circle cx={345} cy={242} r={4} fill="#fff" />
        </g>
        {/* sobrancelha levantada */}
        <path
          d="M222 190 Q250 172 276 186"
          fill="none"
          stroke={TINTA}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M324 176 Q352 158 380 178"
          fill="none"
          stroke={TINTA}
          strokeWidth={9}
          strokeLinecap="round"
        />
        {/* sorriso de canto com presas */}
        <path
          d="M258 296 Q304 326 348 290"
          fill="#fff"
          stroke={TINTA}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        <path
          d="M276 304 L286 304 L281 324 Z"
          fill="#fff"
          stroke={TINTA}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path
          d="M318 304 L328 302 L324 322 Z"
          fill="#fff"
          stroke={TINTA}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

// ---------- carimbo ----------
const Carimbo: React.FC<{ inicio: number; texto: string }> = ({
  inicio,
  texto,
}) => {
  const frame = useCurrentFrame() - inicio;
  if (frame < 0) return null;
  const queda = interpolate(frame, [0, 3], [2.6, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const quique =
    frame > 3
      ? 1 + 0.07 * Math.exp(-(frame - 3) / 4) * Math.cos((frame - 3) * 1.3)
      : queda;
  return (
    <div
      style={{
        position: "absolute",
        left: 468,
        top: 700,
        transform: `rotate(-9deg) scale(${quique})`,
        opacity: 0.93,
      }}
    >
      <svg width={0} height={0}>
        <filter id="dossie-carimbo">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={2}
            seed={11}
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={5} result="d" />
          <feColorMatrix
            in="n"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55"
            result="m"
          />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
      </svg>
      <div
        style={{
          filter: "url(#dossie-carimbo)",
          border: `9px solid ${VERMELHO}`,
          borderRadius: 18,
          padding: 8,
        }}
      >
        <div
          style={{
            border: `4px solid ${VERMELHO}`,
            borderRadius: 11,
            padding: "8px 24px 10px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 56,
            letterSpacing: 3,
            color: VERMELHO,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {texto}
        </div>
      </div>
    </div>
  );
};

// ---------- manchete: cada letra cai e amassa ----------
const Manchete: React.FC<{ linhas: string[]; inicio: number }> = ({
  linhas,
  inicio,
}) => {
  const frame = useCurrentFrame();
  let n = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 66,
        top: 392,
        fontFamily: JORNAL,
        fontWeight: 900,
        fontSize: 138,
        lineHeight: 0.98,
        color: TINTA,
      }}
    >
      {linhas.map((l, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {l.split("").map((ch, ci) => {
            const t0 = inicio + n * 2;
            n += 1;
            const v = interpolate(frame, [t0, t0 + 10], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(2.2)),
            });
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  transform: `translateY(${(1 - v) * -70}px) scale(${0.6 + 0.4 * v}, ${0.5 + 0.5 * v})`,
                  opacity: frame < t0 ? 0 : 1,
                  textShadow: `8px 8px 0 ${ROSA}`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const HUD = "'JetBrains Mono', 'Consolas', 'Courier New', monospace";

// ---------- foto impressa: duas cores + retícula calculada a partir da própria foto ----------
const FOTO_W = 460;
const FOTO_H = 532;
const FotoFicha: React.FC = () => {
  const passo = FOTO_W / grade.w;
  const pontos = React.useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    for (let y = 0; y < grade.h; y++) {
      for (let x = 0; x < grade.w; x++) {
        const v = grade.g[y][x] / 255;
        const d = Math.pow(1 - v, 1.35); // mais escuro = ponto maior
        const r = d * passo * 0.66;
        if (r > 1)
          out.push({
            x: (x + 0.5 + (y % 2) * 0.5) * passo,
            y: (y + 0.5) * (FOTO_H / grade.h),
            r,
          });
      }
    }
    return out;
  }, [passo]);
  return (
    <div
      style={{
        width: FOTO_W,
        height: FOTO_H,
        position: "relative",
        overflow: "hidden",
        border: `8px solid ${TINTA}`,
        borderRadius: 10,
        boxShadow: `12px 12px 0 ${ROSA}`,
        background: PAPEL,
      }}
    >
      <Img
        src={staticFile("dossie007/foto_duo.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <svg
        width={FOTO_W}
        height={FOTO_H}
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "multiply",
          opacity: 0.32,
        }}
      >
        {pontos.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={COBALTO} />
        ))}
      </svg>
      {/* etiqueta de evidência no canto */}
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 14,
          fontFamily: HUD,
          fontWeight: 800,
          fontSize: 22,
          color: TINTA,
          background: AMARELO,
          border: `3px solid ${TINTA}`,
          borderRadius: 6,
          padding: "2px 10px",
        }}
      >
        PROVA A · 2012
      </div>
    </div>
  );
};

export const VideoDossie007: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T_CARIMBO = 118;
  // tremor de câmera no carimbo e leve aproximação contínua
  const tremor =
    frame >= T_CARIMBO
      ? 18 * Math.pow(Math.max(0, 1 - (frame - T_CARIMBO) / 14), 2)
      : 0;
  const tx = Math.sin(frame * 2.7) * tremor;
  const ty = Math.cos(frame * 3.1) * tremor;
  const zoom = interpolate(frame, [0, DURATION], [1, 1.05]);
  // flash de "foto de ficha" quando a foto pousa, e flash maior no carimbo
  const flash =
    interpolate(
      frame,
      [T_CARIMBO, T_CARIMBO + 1, T_CARIMBO + 9],
      [0, 0.45, 0],
      clamp,
    ) + interpolate(frame, [46, 47, 54], [0, 0.32, 0], clamp);

  const sobe = spring({
    frame: frame - 34,
    fps,
    config: { damping: 11, stiffness: 120 },
  });
  const placa = useSalto(52, 13);
  const dadoE = useSalto(72);
  const dadoD = useSalto(80);
  const barra = useSalto(138, 12);
  const chip = useSalto(4, 10);
  const rec = Math.floor(frame / 15) % 2 === 0;
  const haloCresce = interpolate(frame, [20, 60], [0.2, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const marcas = [0, 40, 80, 120, 160, 200];

  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL, overflow: "hidden" }}>
      <AbsoluteFill
        style={{ transform: `translate(${tx}px, ${ty}px) scale(${zoom})` }}
      >
        {/* retícula das bordas (rosa) e halo central (cobalto), sobreimpressas */}
        <Reticula
          w={1080}
          h={1920}
          passo={26}
          angulo={18}
          cor={ROSA}
          densidade={borda}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${haloCresce})`,
            transformOrigin: "540px 960px",
          }}
        >
          <Reticula
            w={1080}
            h={1920}
            passo={24}
            angulo={-32}
            cor={COBALTO}
            densidade={halo}
            k={0.7}
          />
        </div>

        {/* régua de altura */}
        {marcas.map((m, i) => {
          const y = 1290 - i * 124;
          return (
            <React.Fragment key={m}>
              <div
                style={{
                  position: "absolute",
                  left: 96,
                  right: 96,
                  top: y,
                  height: 4,
                  background: "rgba(23,29,69,0.42)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: y - 15,
                  fontFamily: HUD,
                  fontWeight: 800,
                  fontSize: 24,
                  color: TINTA,
                  opacity: 0.8,
                }}
              >
                {m}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 22,
                  top: y - 15,
                  fontFamily: HUD,
                  fontWeight: 800,
                  fontSize: 24,
                  color: TINTA,
                  opacity: 0.8,
                  textAlign: "right",
                }}
              >
                {m}
              </div>
            </React.Fragment>
          );
        })}

        {/* cabeçalho do processo */}
        <div
          style={{
            position: "absolute",
            left: 66,
            top: 312,
            transform: `scale(${chip})`,
            transformOrigin: "left center",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 30,
              color: TINTA,
            }}
          >
            CASO Nº 2026-007
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 26,
              color: AMARELO,
              background: TINTA,
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            SUSPEITO <span style={{ color: PAPEL }}>FICHA</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 66,
            top: 306,
            transform: `scale(${chip})`,
            transformOrigin: "right center",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: `4px solid ${TINTA}`,
            borderRadius: 10,
            padding: "6px 14px",
            fontFamily: HUD,
            fontWeight: 800,
            fontSize: 28,
            color: TINTA,
            background: PAPEL,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: VERMELHO,
              opacity: rec ? 1 : 0.2,
            }}
          />
          16.11.2026
        </div>

        <Manchete linhas={["De vampiro", "a 007"]} inicio={10} />

        {/* foto de ficha: Robert Pattinson, Comic-Con 2012, por Gage Skidmore (CC BY-SA 3.0, Wikimedia Commons) */}
        <div
          style={{
            position: "absolute",
            left: 310,
            top: 668 + (1 - sobe) * 900,
            transform: `rotate(1.5deg) scale(${1 / (0.9 + 0.1 * sobe)}, ${0.9 + 0.1 * sobe})`,
            transformOrigin: "50% 100%",
          }}
        >
          <FotoFicha />
        </div>

        {/* dados laterais */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 930,
            transform: `scale(${dadoE})`,
            transformOrigin: "left top",
            background: PAPEL,
            border: `4px solid ${TINTA}`,
            borderRadius: 14,
            boxShadow: `6px 6px 0 ${ROSA}`,
            padding: "12px 20px 14px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 24,
              color: AMARELO,
              background: TINTA,
              borderRadius: 6,
              padding: "2px 10px",
            }}
          >
            ANTECEDENTES
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 120,
              lineHeight: 0.95,
              color: TINTA,
            }}
          >
            4
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 32,
              color: TINTA,
            }}
          >
            franquias
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 930,
            textAlign: "center",
            transform: `scale(${dadoD})`,
            transformOrigin: "right top",
            background: PAPEL,
            border: `4px solid ${TINTA}`,
            borderRadius: 14,
            boxShadow: `6px 6px 0 ${ROSA}`,
            padding: "12px 20px 14px",
          }}
        >
          <div
            style={{
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 24,
              color: AMARELO,
              background: TINTA,
              borderRadius: 6,
              padding: "2px 10px",
            }}
          >
            IDADE
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 120,
              lineHeight: 0.95,
              color: TINTA,
            }}
          >
            40
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 32,
              color: TINTA,
            }}
          >
            anos
          </div>
        </div>

        {/* placa de identificação */}
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 1196,
            width: 700,
            transform: `rotate(-2.5deg) scale(${placa})`,
            background: TINTA,
            borderRadius: 14,
            boxShadow: `9px 9px 0 ${ROSA}`,
            padding: "20px 20px 22px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 60,
              letterSpacing: 4,
              color: PAPEL,
              lineHeight: 1.05,
            }}
          >
            PATTINSON, R.
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: HUD,
              fontWeight: 800,
              fontSize: 30,
              color: "#B9BFE6",
            }}
          >
            ACUSAÇÃO
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 40,
              color: AMARELO,
              lineHeight: 1.1,
            }}
          >
            trocar as presas pelo smoking
          </div>
        </div>

        <Carimbo inicio={T_CARIMBO} texto="CONTRATADO" />

        {/* barra de legenda: palavra-chave na tinta de destaque */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1452,
            display: "flex",
            justifyContent: "center",
            transform: `translateY(${(1 - barra) * 160}px)`,
            opacity: frame < 138 ? 0 : 1,
          }}
        >
          <div
            style={{
              background: TINTA,
              borderRadius: 44,
              boxShadow: `8px 8px 0 ${ROSA}`,
              padding: "20px 38px 22px",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 46,
              color: PAPEL,
              whiteSpace: "nowrap",
            }}
          >
            Agora ele tem{" "}
            <span style={{ color: AMARELO }}>licença para matar</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1554,
            textAlign: "center",
            fontFamily: HUD,
            fontWeight: 800,
            fontSize: 26,
            color: TINTA,
            opacity: 0.85,
          }}
        >
          @historicodebusca
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1590,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 21,
            color: TINTA,
            opacity: 0.8,
          }}
        >
          Foto: Gage Skidmore · CC BY-SA 3.0 · Wikimedia Commons
        </div>
      </AbsoluteFill>

      <Papel />
      <AbsoluteFill
        style={{ background: "#fff", opacity: flash, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
