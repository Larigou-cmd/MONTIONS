import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import dados from "./codeina.json";

// Molécula de bolinhas e varetas (estilo "molécula neon"). A codeína vem do PubChem (3D, CID 5284371).
// "corte" de 0 a 1: o metil (CH3) do oxigênio sai voando e entra um H no lugar -> morfina.
type Atomo = [string, number, number, number];
const ATOMOS = dados.atoms as Atomo[];
const LIGACOES = dados.bonds as [number, number, number][];
const METIL = [dados.metilC, ...dados.metilH];
const OX = dados.oxigenio;

const COR: Record<string, string> = {
  C: "#33463f",
  H: "#e9e6f2",
  O: "#ff4d6d",
  N: "#5b8cff",
};
const RAIO: Record<string, number> = { C: 0.34, H: 0.2, O: 0.36, N: 0.36 };

export type Destaque = { atomos: number[]; cor: string; forca: number };

const Halo: React.FC<{
  p: THREE.Vector3;
  r: number;
  cor: string;
  forca: number;
}> = ({ p, r, cor, forca }) => (
  <group position={p}>
    {[1.45, 1.9].map((k, i) => (
      <mesh key={i}>
        <sphereGeometry args={[r * k, 24, 24]} />
        <meshBasicMaterial
          color={cor}
          transparent
          opacity={(i === 0 ? 0.35 : 0.14) * forca}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    ))}
  </group>
);

const Cena: React.FC<{
  rot: number;
  corte: number;
  destaques: Destaque[];
  zoom: number;
  fundo: string;
  desloc: [number, number];
}> = ({ rot, corte, destaques, zoom, fundo, desloc }) => {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.7;
    scene.background = null;
  }, [gl, scene, fundo]);
  useLayoutEffect(() => {
    camera.position.set(0, 0, 15 / zoom);
    camera.lookAt(0, 0, 0);
  }, [camera, zoom]);

  // posição de cada átomo; o metil se afasta do oxigênio quando "corte" sobe
  const pos = useMemo(() => {
    const base = ATOMOS.map(([, x, y, z]) => new THREE.Vector3(x, y, z));
    const o = base[OX];
    const c = base[dados.metilC];
    const dir = c.clone().sub(o).normalize();
    const saida = dir
      .clone()
      .multiplyScalar(corte * 7)
      .add(new THREE.Vector3(0, corte * 2.5, 0));
    METIL.forEach((i) => base[i].add(saida));
    return { base, hNovo: o.clone().add(dir.clone().multiplyScalar(0.98)) };
  }, [corte]);

  const brilho = (i: number) => destaques.find((d) => d.atomos.includes(i));
  const opMetil = 1 - Math.max(0, (corte - 0.55) / 0.45);
  const temH = corte > 0.45;
  const escH = Math.min(1, Math.max(0, (corte - 0.45) / 0.25));

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      <pointLight position={[-6, -3, 6]} intensity={30} color="#3dffb0" />
      <group
        position={[0.75 + desloc[0], desloc[1], 0]}
        rotation={[0.25, rot, 0.05]}
      >
        {ATOMOS.map(([el], i) => {
          const d = brilho(i);
          const metil = METIL.includes(i);
          const op = metil ? opMetil : 1;
          if (op <= 0.01) return null;
          return (
            <group key={i}>
              <mesh position={pos.base[i]}>
                <sphereGeometry args={[RAIO[el] ?? 0.3, 32, 32]} />
                <meshStandardMaterial
                  color={COR[el] ?? "#888"}
                  roughness={0.25}
                  metalness={0.1}
                  emissive={d ? d.cor : el === "O" ? "#ff1f4b" : "#000"}
                  emissiveIntensity={d ? 0.9 * d.forca : el === "O" ? 0.35 : 0}
                  transparent={op < 1}
                  opacity={op}
                />
              </mesh>
              {d && (
                <Halo
                  p={pos.base[i]}
                  r={RAIO[el] ?? 0.3}
                  cor={d.cor}
                  forca={d.forca * op}
                />
              )}
            </group>
          );
        })}
        {LIGACOES.map(([a, b, ordem], k) => {
          const metil = METIL.includes(a) && METIL.includes(b);
          const quebra =
            (METIL.includes(a) && b === OX) || (METIL.includes(b) && a === OX);
          if (quebra && corte > 0.08) return null;
          const op = metil ? opMetil : 1;
          if (op <= 0.01) return null;
          const p1 = pos.base[a];
          const p2 = pos.base[b];
          const meio = p1.clone().add(p2).multiplyScalar(0.5);
          const v = p2.clone().sub(p1);
          const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            v.clone().normalize(),
          );
          const d = brilho(a) && brilho(b) ? brilho(a) : undefined;
          const lado = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(q)
            .multiplyScalar(0.09);
          const linhas =
            ordem === 2 ? [lado, lado.clone().negate()] : [new THREE.Vector3()];
          return linhas.map((off, j) => (
            <mesh
              key={k + "-" + j}
              position={meio.clone().add(off)}
              quaternion={q}
            >
              <cylinderGeometry
                args={[
                  ordem === 2 ? 0.055 : 0.075,
                  ordem === 2 ? 0.055 : 0.075,
                  v.length(),
                  12,
                ]}
              />
              <meshStandardMaterial
                color={d ? d.cor : "#d2ece0"}
                emissive={d ? d.cor : "#000"}
                emissiveIntensity={d ? 0.8 * d.forca : 0}
                roughness={0.4}
                transparent={op < 1}
                opacity={op}
              />
            </mesh>
          ));
        })}
        {temH && (
          <group>
            <mesh position={pos.hNovo} scale={escH}>
              <sphereGeometry args={[RAIO.H, 32, 32]} />
              <meshStandardMaterial
                color={COR.H}
                emissive="#3dff8f"
                emissiveIntensity={0.9}
                roughness={0.25}
              />
            </mesh>
            <Halo p={pos.hNovo} r={RAIO.H * escH} cor="#3dff8f" forca={escH} />
          </group>
        )}
      </group>
    </>
  );
};

export const Molecula3D: React.FC<{
  width: number;
  height: number;
  rot: number;
  corte?: number;
  destaques?: Destaque[];
  zoom?: number;
  desloc?: [number, number];
}> = ({
  width,
  height,
  rot,
  corte = 0,
  destaques = [],
  zoom = 1,
  desloc = [0, 0],
}) => (
  <ThreeCanvas
    width={width}
    height={height}
    camera={{ fov: 32, position: [0, 0, 15] }}
    gl={{ alpha: true, antialias: true }}
  >
    <Cena
      rot={rot}
      corte={corte}
      destaques={destaques}
      zoom={zoom}
      fundo=""
      desloc={desloc}
    />
  </ThreeCanvas>
);

export const IDX = { metil: METIL, oxigenio: OX };
