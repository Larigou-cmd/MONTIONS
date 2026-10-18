import {interpolate, useCurrentFrame} from 'remotion';
import {Cena, Titulo, Rotulo, Sobe} from '../ui';
import {cores} from '../theme';

// SURMOUNT-5: comparacao direta, 72 semanas, 751 adultos com obesidade sem diabetes.
const series = [
  {nome: 'Semaglutida', dose: '2,4 mg', valor: 13.7, cor: cores.glp1, atraso: 30},
  {nome: 'Tirzepatida', dose: '10-15 mg', valor: 20.2, cor: cores.gip, atraso: 70},
];

const MAX = 25; // escala do eixo, em % de perda de peso
const TRILHA = 790;

const Barra: React.FC<{
  nome: string;
  dose: string;
  valor: number;
  cor: string;
  atraso: number;
}> = ({nome, dose, valor, cor, atraso}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [atraso, atraso + 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const larg = (valor / MAX) * TRILHA * t;
  const mostrado = valor * t;

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
        {/* swatch: a identidade nao fica so na cor da barra */}
        <div style={{width: 20, height: 20, borderRadius: 6, background: cor}} />
        <div style={{fontSize: 40, fontWeight: 800, color: cores.tinta}}>{nome}</div>
        <div style={{fontSize: 30, color: cores.tintaMuda}}>{dose}</div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <div
          style={{
            width: TRILHA,
            height: 52,
            background: cores.superficie,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: larg,
              height: 52,
              background: cor,
              borderRadius: '8px 4px 4px 8px',
            }}
          />
        </div>
        {/* rotulo direto em tinta de texto, nao na cor da serie */}
        <div
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: cores.tinta,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {mostrado.toFixed(1).replace('.', ',')}%
        </div>
      </div>
    </div>
  );
};

export const Comparacao: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const segunda = interpolate(frame, [300, 340], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Cena dur={dur}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 24, height: '100%', justifyContent: 'center'}}>
        <Rotulo texto="7 · comparação direta" cor={cores.tintaSec} />
        <Titulo atraso={6}>Quanto isso muda no resultado</Titulo>

        <div style={{fontSize: 34, color: cores.tintaSec, lineHeight: 1.35}}>
          Perda de peso média em 72 semanas
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 40, marginTop: 18}}>
          {series.map((s) => (
            <Barra key={s.nome} {...s} />
          ))}
        </div>

        <div
          style={{
            height: 2,
            background: cores.linha,
            margin: '30px 0 6px',
            opacity: segunda,
          }}
        />

        <div style={{opacity: segunda}}>
          <div style={{fontSize: 34, color: cores.tintaSec, marginBottom: 22}}>
            Proporção que perdeu 20% ou mais do peso
          </div>
          <div style={{display: 'flex', gap: 36}}>
            {[
              {nome: 'Semaglutida', v: '27,3%', cor: cores.glp1},
              {nome: 'Tirzepatida', v: '48,4%', cor: cores.gip},
            ].map((d) => (
              <div
                key={d.nome}
                style={{
                  flex: 1,
                  background: cores.superficie,
                  border: `2px solid ${cores.linha}`,
                  borderRadius: 20,
                  padding: '24px 26px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div style={{width: 16, height: 16, borderRadius: 5, background: d.cor}} />
                  <div style={{fontSize: 28, color: cores.tintaSec, fontWeight: 700}}>
                    {d.nome}
                  </div>
                </div>
                <div style={{fontSize: 68, fontWeight: 800, color: cores.tinta}}>{d.v}</div>
              </div>
            ))}
          </div>
        </div>

        <Sobe atraso={420} dist={16} style={{marginTop: 44}}>
          <div style={{fontSize: 27, color: cores.tintaMuda, lineHeight: 1.45}}>
            SURMOUNT-5 · ensaio aberto · 751 adultos com obesidade e sem diabetes · 72 semanas
            · doses máximas toleradas
          </div>
        </Sobe>
      </div>
    </Cena>
  );
};
