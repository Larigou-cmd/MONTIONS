# Catálogo do kit (`mecanismo/src/estiloEtiquetas/kit.tsx`)

Tudo recebe `f` (quadro atual, de `useCurrentFrame()`) e os quadros de entrada (`at`). Converta segundos da fala em quadros com uma função `fr(s)` (30 fps; some a pausa inserida se houver). Medidas em px do quadro 1080×1920.

| Peça | Para quê | Recebe |
|---|---|---|
| `COR` | paleta: `NEON`, `LIMAO`, `VERM`, `MINT`, `BG0`, `INK`, `CARTAO` | — |
| `Abas` | etiquetas fixas no topo; a da vez cheia, as vistas contornadas | `abas: [nome, quadro][]`, `de`, `ate` (quando somem), `y=262` |
| `SeloEpisodio` | selo verde no canto ("#1 · BCG") | `at`, `texto` |
| `montarFrases` + `LegendaPilula` | legenda embaixo com a palavra falada acesa | `montarFrases(palavras, fr, max=5)`; `LegendaPilula` recebe `frases`, `ate` (esconder no "Me siga"), `y=1478` |
| `Cabeca` + `G` | título da cena à esquerda; `G` pinta a palavra-chave (verde por padrão, `c={COR.LIMAO}` para atenção) | `at`, `y=360`, `size=66`, filhos |
| `TituloGigante` | abertura de ficha: nome enorme brilhando + subtítulo + pílulas (a 1ª cheia) | `at`, `sobre`, `nome`, `sub`, `pilulas[]`, `y=330`, `size=200` |
| `NumeroGrande` | "15°" grande + rótulo/título/detalhe ao lado | `at`, `numero`, `rotulo`, `titulo`, `detalhe`, `y=345` |
| `Pila` | pílula de apoio que entra e sai | `at`, `ate`, `x=540`, `y`, `cor`, `size=40`, texto |
| `Ico` | ícones desenhados: `nao`, `cuidado`, `ok`, `escudo`, `salvar`, `enviar`, `comentar`, `seguir` | `tipo`, `size`, `cor` |
| `EscudoGrande` | escudo com check brilhando ("O que ela protege") | `at`, `y=520`, `size=220` |
| `ListaCartoes` | cartões em lista; tipo `nao` (vermelho, põe "NÃO FAÇA"), `cuidado` (amarelo, "ATENÇÃO"), `ok`/`escudo` (verde) | `itens: {at, texto, sub?, tipo}[]`, `y`, `gap=18`, `titulo?` |
| `LinhaDoTempo` | linha vertical que cresce entre marcos ("Ao nascer" → "Limite") | `marcos: {at, rotulo, texto}[]`, `y=520`, `altura=520`, `x=120` |
| `CartaoInfo` | bloco LOCAL / AGULHA etc., com imagem opcional à esquerda e pílulas | `at`, `y`, `campos: [rótulo, texto][]`, `imagem?`, `pilulas?` |
| `Aviso` | caixa amarela de atenção ou verde de EXCEÇÃO | `at`, `y`, `titulo`, `texto?`, `tipo` (`cuidado`/`excecao`) |
| `Evolucao` | círculos com setas (pápula → lesão → cicatriz) | `etapas: {at, rotulo, desenho?}[]`, `y=900`, `r=120` |
| `TabelaGravaAi` | resumo final que acende linha a linha | `at`, `linhas: [rótulo, texto][]`, `y=520`, `passo=30` quadros |
| `CartoesFinais` | "Salva esse vídeo / Manda pra quem precisa / Comenta…" | `at`, `itens?: [ícone, parte branca, parte verde][]`, `y=420` |
| `ProximoEpisodio` | "PRÓXIMO EPISÓDIO · #2" + título grande | `at`, `numero`, `titulo`, `y=960` |
| `Pele` | corte da pele (pele, gordura, músculo); acende uma camada; faz prega ou caroço com `bump`; rótulos à direita | `luz`, `luzCor`, `luzK`, `bump`, `bumpX`, `bumpW`, `rotulos: [camada, quadro][]`, `nomes?`, `caroco` (contorno tracejado 0..1), filhos SVG |
| `Caneta` | caneta/seringa desenhada; `ang` 90 reto, 45, 15 | `x`, `y` (ponta da agulha), `ang`, `agulha=130`, `corpo=170`, `op` |
| `Gota` | depósito brilhando na ponta da agulha; `irregular` = manchas | `x`, `y`, `k` (0..1), `cor`, `irregular` |
| `SY` etc. | medidas do corte da pele (`SX=90`, `SW=900`, `SY=850`, `HP=70`, `HG=180`, `HM=200`) para posicionar caneta e gota | — |

Peças que ficaram só no vídeo da insulina (copiar de `src/insulinaAplicacao/Video.tsx` se precisar): `Corpo` (boneco frente/costas com regiões que acendem e X no umbigo), `Glicose` (linha sobe-e-desce sobre a faixa do alvo), `Rodizio` (mapa da barriga com pontos acendendo e caroço com X), relógio de contagem do botão.

## Envoltório de cena

Use `Part` de `src/lib.tsx` para cada cena (`from`, `to` em quadros): entra e sai com desfoque suave, sem corte seco. Fundo: `Background color={COR.NEON}`; em trecho de alerta, `COR.LIMAO`. `Grain` por cima de tudo.

## Armadilhas já vistas

- Caneta com agulha longa entra por cima e bate no título: ponha a entrada em x≈800 ou encurte `corpo`.
- Texto da `NumeroGrande` com rótulo longo quebra em 2 linhas: use `whiteSpace: nowrap` já embutido e encurte o rótulo.
- Rótulo de gráfico em cima da linha: deixe fora da área do traço.
- Nomes de export que já existem no `Root.tsx` (ex.: `DURATION_INSULINA`): importe com `as` para não dar conflito.
