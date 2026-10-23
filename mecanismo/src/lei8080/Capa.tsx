import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../config";
import { SANS, SERIF } from "../fonts";
import { rgba } from "../lib";

// Capa horizontal do YouTube (1280×720) — "Lei 8.080 para concursos, Episódio 1".
const OURO = "#f5c451";
const VERM = "#fb7185";
const AZUL = "#60a5fa";

export const CapaLei8080Ep1: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: SANS }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 900px 600px at 25% 35%, ${C.bg2} 0%, rgba(7,11,26,0) 70%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 1300px 380px at 50% 800px, ${rgba(OURO, 0.32)} 0%, rgba(7,11,26,0) 70%)`,
      }}
    />

    {/* selo */}
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 48,
        padding: "10px 22px",
        borderRadius: 999,
        background: OURO,
        color: "#1a1405",
        fontWeight: 900,
        fontSize: 26,
        letterSpacing: 2,
      }}
    >
      CONCURSOS DA SAÚDE
    </div>
    <div
      style={{
        position: "absolute",
        right: 56,
        top: 48,
        padding: "8px 20px",
        borderRadius: 999,
        border: `3px solid ${OURO}`,
        color: OURO,
        fontWeight: 900,
        fontSize: 26,
        letterSpacing: 2,
      }}
    >
      EP. 1
    </div>

    {/* título */}
    <div
      style={{
        position: "absolute",
        left: 52,
        top: 130,
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 138,
        lineHeight: 1,
        color: OURO,
        textShadow: `0 0 40px ${rgba(OURO, 0.45)}`,
      }}
    >
      LEI 8.080
    </div>
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 300,
        fontWeight: 900,
        fontSize: 62,
        lineHeight: 1.05,
        color: C.ink,
      }}
    >
      ARTS. 1º AO 4º
    </div>
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 390,
        fontWeight: 800,
        fontSize: 40,
        lineHeight: 1.2,
        color: C.ink,
      }}
    >
      Lei seca + <span style={{ color: VERM }}>pegadinhas</span>
      <br />+ <span style={{ color: "#4ade80" }}>questões</span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 520,
        fontWeight: 700,
        fontSize: 30,
        color: C.dim,
      }}
    >
      O que é saúde e o que é o <span style={{ color: AZUL }}>SUS</span>
    </div>

    {/* cartão da lei com o grifo e o carimbo */}
    <div
      style={{
        position: "absolute",
        left: 765,
        top: 160,
        width: 470,
        padding: "28px 30px",
        boxSizing: "border-box",
        borderRadius: 24,
        background: C.box,
        border: `2px solid ${rgba(OURO, 0.45)}`,
        borderLeft: `8px solid ${OURO}`,
        boxShadow: "0 20px 50px rgba(0,0,0,.45)",
        transform: "rotate(2deg)",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: 4,
          color: OURO,
          marginBottom: 14,
        }}
      >
        📜 ART. 2º, § 2º
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 35,
          lineHeight: 1.4,
          color: C.ink,
        }}
      >
        O dever do Estado{" "}
        <span
          style={{
            background: rgba(VERM, 0.3),
            boxShadow: `inset 0 -4px 0 ${VERM}`,
            borderRadius: 6,
            padding: "0 6px",
          }}
        >
          não exclui
        </span>{" "}
        o das pessoas, da família, das empresas e da sociedade.
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 785,
        top: 480,
        transform: "rotate(-8deg)",
        padding: "8px 26px",
        border: `7px solid ${VERM}`,
        borderRadius: 16,
        color: VERM,
        fontWeight: 900,
        fontSize: 54,
        letterSpacing: 5,
        whiteSpace: "nowrap",
        background: "rgba(7,11,26,0.85)",
        boxShadow: `0 0 40px ${rgba(VERM, 0.45)}`,
      }}
    >
      ✗ ERRADO?
    </div>
  </AbsoluteFill>
);
