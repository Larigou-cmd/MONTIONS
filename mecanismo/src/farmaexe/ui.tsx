import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { OUT, SNAP, W, it, rgba } from "../lib";

// Peças do Modelo 7 ("Comercial WhatsApp") com a marca Farma.exe: um mundo só, fundo claro,
// mesma luz e mesmas fontes. O chat é desenhado em código (sem logo de aplicativo).
export const PIXEL = "'Press Start TwoP', monospace";
export const VERDE = "#16a34a",
  VERDE_CLARO = "#dcfce7",
  TINTA = "#0f172a",
  CINZA = "#64748b",
  FUNDO = "#f3f6f1",
  BOLHA_ELA = "#d9fdd3",
  CHAT = "#efeae2";

// 120 bpm: 1 batida = 15 quadros, 1 compasso = 60 quadros
export const BATIDA = 15;
export const b = (n: number) => Math.round(n * BATIDA);

export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: FUNDO }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${rgba(VERDE, 0.13)} 2.5px, transparent 2.5px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: `${(f * 0.4) % 44}px ${(f * 0.25) % 44}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 900px 1200px at 50% 45%, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

// logo FARMA.EXE em letra de pixel, com cursor piscando
export const Logo: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  at?: number;
  cursor?: boolean;
  passo?: number; // quadros por letra
}> = ({ x = 540, y = 900, size = 92, at = 0, cursor = true, passo = 2 }) => {
  const f = useCurrentFrame();
  const txt = "FARMA.EXE";
  const n = Math.max(0, Math.min(txt.length, Math.floor((f - at) / passo) + 1));
  const pisca = cursor && Math.floor(f / 15) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%,-50%)",
        display: "flex",
        alignItems: "center",
        gap: size * 0.3,
      }}
    >
      <div
        style={{
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: size * 0.22,
          background: VERDE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${size * 0.12}px ${size * 0.3}px ${rgba(VERDE, 0.35)}`,
        }}
      >
        <div
          style={{
            width: size * 0.55,
            height: size * 0.26,
            borderRadius: size,
            background: "#fff",
            transform: "rotate(-35deg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              right: 0,
              background: "#bbf7d0",
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontFamily: PIXEL,
          fontSize: size * 0.62,
          color: TINTA,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        {/* as letras ainda não digitadas ficam invisíveis, para o logo não andar enquanto digita */}
        {txt.split("").map((c, i) => (
          <React.Fragment key={i}>
            {i === n && (
              <span style={{ color: VERDE, opacity: pisca ? 1 : 0 }}>█</span>
            )}
            <span
              style={{ color: i >= 5 ? VERDE : TINTA, opacity: i < n ? 1 : 0 }}
            >
              {c}
            </span>
          </React.Fragment>
        ))}
        {n >= txt.length && (
          <span style={{ color: VERDE, opacity: pisca ? 1 : 0 }}>█</span>
        )}
      </span>
    </div>
  );
};

// celular com o chat
export const Celular: React.FC<{
  x?: number;
  y?: number;
  s?: number;
  children?: React.ReactNode;
}> = ({ x = 540, y = 960, s = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 640,
      height: 1300,
      transform: `translate(-50%,-50%) scale(${s})`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 86,
        background: TINTA,
        boxShadow: "0 40px 90px rgba(15,23,42,0.28)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 18,
        borderRadius: 70,
        overflow: "hidden",
        background: CHAT,
      }}
    >
      {/* barra do chat */}
      <div
        style={{
          height: 170,
          background: "#ffffff",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 30px 22px",
          gap: 20,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 39,
            background: VERDE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: PIXEL,
            fontSize: 30,
            color: "#fff",
          }}
        >
          F
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 34,
              color: TINTA,
            }}
          >
            Farma.exe
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 24,
              color: VERDE,
            }}
          >
            online
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "0 26px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {children}
      </div>
    </div>
    {/* câmera */}
    <div
      style={{
        position: "absolute",
        top: 34,
        left: "50%",
        width: 120,
        height: 30,
        marginLeft: -60,
        borderRadius: 15,
        background: TINTA,
      }}
    />
  </div>
);

// bolha de mensagem que entra com mola
export const Bolha: React.FC<{
  at: number;
  texto: string;
  dela?: boolean;
  hora?: string;
}> = ({ at, texto, dela = false, hora = "14:02" }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 9, 0, 1, SNAP);
  return (
    <div
      style={{
        alignSelf: dela ? "flex-end" : "flex-start",
        maxWidth: 470,
        transform: `scale(${0.6 + 0.4 * k}) translateY(${(1 - k) * 30}px)`,
        transformOrigin: dela ? "bottom right" : "bottom left",
        opacity: Math.min(1, k * 1.5),
        background: dela ? BOLHA_ELA : "#ffffff",
        borderRadius: dela ? "26px 26px 6px 26px" : "26px 26px 26px 6px",
        padding: "18px 24px 12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        fontFamily: SANS,
        fontSize: 32,
        lineHeight: 1.3,
        color: TINTA,
      }}
    >
      {texto}
      <div
        style={{ textAlign: "right", fontSize: 20, color: CINZA, marginTop: 4 }}
      >
        {hora} {dela ? <span style={{ color: "#3b82f6" }}>✓✓</span> : null}
      </div>
    </div>
  );
};

// três pontinhos de "digitando"
export const Digitando: React.FC<{ de: number; ate: number }> = ({
  de,
  ate,
}) => {
  const f = useCurrentFrame();
  if (f < de || f >= ate) return null;
  const k = it(f, de, de + 6, 0, 1, OUT);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        background: "#fff",
        borderRadius: "26px 26px 26px 6px",
        padding: "22px 28px",
        display: "flex",
        gap: 12,
        opacity: k,
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: CINZA,
            transform: `translateY(${-8 * Math.max(0, Math.sin((f - de) / 3 - i * 0.9))}px)`,
          }}
        />
      ))}
    </div>
  );
};

// card de resposta da farmacêutica (aparece item por item)
export const CardResposta: React.FC<{
  x?: number;
  y?: number;
  titulo: string;
  itens: { at: number; txt: React.ReactNode; icone: string }[];
  at: number;
}> = ({ x = 540, y = 960, titulo, itens, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = it(f, at, at + 12, 0, 1, SNAP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: W - 140,
        transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * k})`,
        opacity: Math.min(1, k * 1.4),
        background: "#ffffff",
        borderRadius: 40,
        border: `4px solid ${VERDE}`,
        boxShadow: `0 30px 70px ${rgba(VERDE, 0.18)}`,
        padding: "44px 50px",
        fontFamily: SANS,
        color: TINTA,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 26,
        }}
      >
        <span
          style={{
            fontFamily: PIXEL,
            fontSize: 22,
            color: "#fff",
            background: VERDE,
            padding: "10px 14px",
            borderRadius: 10,
          }}
        >
          FARMA.EXE
        </span>
        <span style={{ fontWeight: 800, fontSize: 40 }}>{titulo}</span>
      </div>
      {itens.map((item, i) => {
        if (f < item.at) return null;
        const u = it(f, item.at, item.at + 8, 0, 1, OUT);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              marginTop: 20,
              opacity: u,
              transform: `translateX(${(1 - u) * 40}px)`,
            }}
          >
            <span
              style={{
                fontSize: 46,
                lineHeight: 1.1,
                fontFamily: "'Noto Color Emoji', sans-serif",
              }}
            >
              {item.icone}
            </span>
            <span style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.3 }}>
              {item.txt}
            </span>
          </div>
        );
      })}
    </div>
  );
};
