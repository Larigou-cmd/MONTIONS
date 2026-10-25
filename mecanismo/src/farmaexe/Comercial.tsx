import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Easing } from "remotion";
import { it } from "../lib";
import { Bolha, Celular, Digitando, Fundo, Logo, b } from "./ui";

// Comercial Farma.exe (Modelo 7), 9:16, 45 s a 120 bpm. Roteiro e mapa de som: roteiros/comercial_pergunte_farmaceutica.md.
// Tudo começa e termina numa batida: b(n) = quadro da batida n (15 quadros cada).
// As cenas são feitas uma por vez, com aprovação das fotos antes do render (sem som; o som entra no fim).
export const DURATION_FARMA = b(90);

// movimento de câmera: arranca devagar, acelera, freia; o borrão é máximo no meio
const SUAVE = Easing.bezier(0.65, 0, 0.35, 1);
const mov = (f: number, de: number, ate: number) => it(f, de, ate, 0, 1, SUAVE);
const borrao = (f: number, de: number, ate: number, max: number) => (f > de && f < ate ? Math.sin(Math.PI * ((f - de) / (ate - de))) * max : 0);

// câmera sobre o celular: posição vertical, escala e borrão
const camCelular = (f: number) => {
  const entra = mov(f, b(4), b(6)); // b4→b6 o celular sobe da parte de baixo
  const zoom = mov(f, b(10), b(12)); // b10→b12 zoom no chat
  return {
    y: 2700 - (2700 - 1010) * entra,
    s: 1 + 0.32 * zoom,
    blur: borrao(f, b(4), b(6), 10) + borrao(f, b(10), b(12), 8),
  };
};

export const FarmaComercial: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camCelular(f);
  // logo: digita b0→b4 (uma letra a cada meia batida), sobe b4→b6, some no zoom b10→b12
  const sobe = mov(f, b(4), b(6));
  const some = mov(f, b(10), b(12));
  const flutua = Math.sin((f / b(2)) * Math.PI) * 6; // respira a cada 2 batidas
  return (
    <AbsoluteFill>
      <Fundo />
      {/* CENA 1 (0–6 s) */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - some, transform: `translateY(${-90 * some}px)` }}>
        <Logo y={900 - 690 * sobe + flutua * (1 - sobe)} size={92 - 30 * sobe} at={b(0)} passo={b(0.5)} />
      </div>
      <div style={{ position: "absolute", inset: 0, filter: cam.blur > 0.3 ? `blur(${cam.blur}px)` : undefined }}>
        <Celular y={cam.y + flutua * 0.5} s={cam.s}>
          <Bolha at={b(6)} dela texto="Oi! Posso tirar umas dúvidas de remédio?" hora="14:01" />
          <Digitando de={b(7)} ate={b(9)} />
          <Bolha at={b(9)} texto="Claro, manda! 💊" hora="14:01" />
        </Celular>
      </div>
    </AbsoluteFill>
  );
};
