import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { SANS } from "../fonts";

// Capa horizontal do YouTube (1280×720) do Ep. 1 da Lei 8.080, no estilo verde da RDC 1.000.
for (const sub of ["latin", "latin-ext"] as const)
  loadFont({
    family: "Instrument Serif",
    url: staticFile(`fonts/InstrumentSerif-400-normal-${sub}.woff2`),
    weight: "400",
    format: "woff2",
    unicodeRange: sub === "latin-ext" ? "U+0100-024F" : undefined,
  });
const SERIF = "'Instrument Serif', serif";
const NEON = "#3dff8f";
const YEL = "#f2e52e";
const MINT = "#8fc4ae";
const INK = "#f7f3df";
const BG0 = "#04120f";
const BG1 = "#0a2a22";
const VERM = "#ff6b6b";

export const CapaLei8080Ep1Verde: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle 1000px at 370px 210px, ${BG1} 0%, ${BG0} 100%)`,
      fontFamily: SANS,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 92,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: 4,
        color: MINT,
      }}
    >
      LEI SECA · SUS · EP. 1
    </div>
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 128,
        fontWeight: 800,
        fontSize: 132,
        lineHeight: 1,
        color: NEON,
        letterSpacing: -2,
      }}
    >
      LEI 8.080
    </div>
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 290,
        fontFamily: SERIF,
        fontSize: 64,
        lineHeight: 1.08,
        color: INK,
      }}
    >
      Lei seca, pegadinhas
      <br />e questões
    </div>
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 460,
        padding: "8px 22px",
        borderRadius: 999,
        background: NEON,
        color: BG0,
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: 1,
      }}
    >
      ARTS. 1º AO 4º · CONCURSOS DA SAÚDE
    </div>
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 530,
        fontFamily: SERIF,
        fontSize: 34,
        color: MINT,
      }}
    >
      o que é saúde e o que é o SUS
    </div>

    {/* trecho da lei com a pegadinha */}
    <div
      style={{
        position: "absolute",
        left: 790,
        top: 150,
        width: 430,
        boxSizing: "border-box",
        padding: "26px 30px 30px",
        borderRadius: 22,
        border: `4px solid ${NEON}`,
        background: "rgba(61,255,143,0.05)",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: 3,
          color: MINT,
          marginBottom: 12,
        }}
      >
        ART. 2º, § 2º
      </div>
      <div
        style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1.12, color: INK }}
      >
        O dever do Estado <span style={{ color: YEL }}>não exclui</span> o das
        pessoas, da família, das empresas e da sociedade.
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 1005,
        top: 540,
        transform: "translate(-50%,-50%) rotate(-7deg)",
        padding: "6px 26px",
        border: `5px solid ${VERM}`,
        borderRadius: 14,
        color: VERM,
        fontWeight: 900,
        fontSize: 50,
        letterSpacing: 4,
        background: "rgba(255,107,107,0.08)",
        whiteSpace: "nowrap",
      }}
    >
      ✗ ERRADO?
    </div>
  </AbsoluteFill>
);
