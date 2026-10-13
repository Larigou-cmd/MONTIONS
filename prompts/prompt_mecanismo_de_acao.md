Quero que você crie um vídeo de motion graphics com o Remotion, do zero, nesta pasta, explicando o **mecanismo de ação de um medicamento**. Eu não sou programador: não me peça para escrever código, editar arquivo nem digitar comando. Instale o que precisar, escreva a narração, gere a voz, monte cada cena, confira o resultado e me entregue o arquivo pronto em MP4. Fale comigo em português simples e só me pergunte algo se for impossível continuar.

O vídeo é vertical, para Reels, e tem 62 segundos. Ele conta, como numa aula curta e bonita, o caminho do remédio no corpo: abre com o nome do medicamento nascendo de riscos de luz, mostra o alvo na célula (a "fechadura"), o remédio encaixando (a "chave"), a reação em cadeia dentro da célula, o que muda em cada órgão, os resultados dos estudos, um resumo com os efeitos adversos e termina com a frase "Consulte um profissional de saúde para orientações.". Sem legendas, sem barra de progresso e sem títulos de parte na tela.

## Meus dados (os textos do vídeo)

Guarde tudo isto num arquivo só de configuração (`src/config.ts`), para eu poder pedir depois "troca o remédio", "muda os números" ou "troca o perfil". Para trocar de remédio deve bastar mudar esse arquivo e a narração.

- Medicamento: Tirzepatida
- Nome comercial (aparece pequeno, embaixo): Mounjaro®
- Classe: Agonista duplo dos receptores de GIP e GLP-1
- Pergunta da abertura: Como ela age no corpo?
- Alvos (1 ou 2; cada um com nome curto e cor):
  - Receptor de GIP — âmbar #f5a524
  - Receptor de GLP-1 — turquesa #2dd4bf
- Cor do medicamento: lilás #a78bfa
- Molécula (frase curta): Peptídeo de 39 aminoácidos + ácido graxo
- Detalhe farmacocinético (dois chips): Meia-vida ≈ 5 dias · 1 aplicação por semana
- Cascata dentro da célula (3 a 4 passos, em ordem): Receptor ativado → AMPc ↑ → Sinal para a célula responder
- Órgãos e efeitos (exatamente 3, cada um com ícone desenhado, nome e efeito):
  - Pâncreas — Insulina ↑ só com glicose alta · Glucagon ↓
  - Estômago — Esvaziamento mais lento
  - Cérebro — Saciedade ↑ · Apetite ↓
- Resultados (exatamente 2 números, com a fonte embaixo):
  - HbA1c −2,30 pontos — SURPASS-2 · 15 mg · 40 semanas
  - Peso −20,9% — SURMOUNT-1 · 15 mg · 72 semanas
- Efeitos adversos mais comuns (3 chips): Náuseas · Diarreia · Vômitos
- Aviso fixo: Conteúdo educativo. Use somente com prescrição e acompanhamento médico.
- Referências (rodapé do fim): Coskun 2018 · Willard 2020 · Frías 2021 · Jastreboff 2022
- Mensagem final (três linhas, a do meio em destaque): Consulte um / profissional de saúde / para orientações.

**Regra de segurança dos dados:** antes de montar, confira cada afirmação farmacológica e cada número em fonte confiável (bula oficial, artigo original ou diretriz). Se algum dado meu estiver errado ou sem fonte, corrija no arquivo de configuração e me avise no fim, em uma frase. Nunca invente número, estudo ou dose. Não mostre dose como recomendação.

## Antes de começar

1. Confira se o Node está instalado (`node --version`, 18 ou mais novo). Se não estiver, pare e me diga em uma frase como instalar pelo site nodejs.org.
2. Crie nesta pasta um projeto Remotion em branco com TypeScript (`npx create-video@latest --yes --blank .`). Se a pasta não estiver vazia, crie numa subpasta provisória, traga os arquivos para cá e apague a subpasta (sem apagar a pasta `audio`, se existir). Apague a composição de exemplo. Se falhar, monte o projeto na mão. Na primeira foto o Remotion baixa um navegador de uns 170 MB; é normal, espere.
3. Instale `@remotion/google-fonts` na mesma versão exata do pacote `remotion`.
4. Não use imagem, vídeo, música ou fonte de fora. Tudo é desenhado por código (SVG e HTML): moléculas, receptores, células, órgãos e ícones. Os emojis são os do sistema.
5. **Narração:**
   - Se já existir `audio/narracao.mp3`, use ela.
   - Se não existir, escreva a narração a partir da configuração (modelo abaixo) e gere a voz na ElevenLabs no **plano gratuito**: voz feminina **"Juliana - Bright and Encouraging"** (português do Brasil), modelo **`eleven_v4`** (o mais natural), **uma única geração**. Antes de gerar, faça uma estimativa de custo e só siga se couber nos créditos grátis (a narração inteira gasta uns 800 créditos). Salve em `audio/narracao.mp3`.
   - Se existir `audio/efeitos.mp3`, toque-o junto, inteiro, no volume 1. Se não existir, não crie efeitos nem música.
   - Copie os áudios para `public` e toque do quadro 0 até o fim, sem cortar, acelerar nem deslocar.
6. **Sincronia:** depois de ter a narração, meça onde cada frase começa (pausas de silêncio com o ffmpeg). Guarde esses tempos no arquivo de configuração e use-os para tudo que "nasce junto com a fala" (palavras digitadas, etiquetas, números). As janelas de cada parte, abaixo, são o ponto de partida: ajuste-as à voz real. A voz da Juliana fala por uns 57 segundos; deixe uns 5 segundos de folga no fim para a mensagem final aparecer sozinha (por isso o vídeo tem 62 segundos).
7. **Fontes:** se o navegador do render não conseguir baixar as fontes do Google (erro de certificado), baixe os mesmos arquivos de fonte do `@remotion/google-fonts` para `public/fonts` e carregue-os de lá com `@remotion/fonts`.
8. A composição se chama `Video` e o arquivo final é `out/video.mp4`.
9. Construa e confira uma parte de cada vez (são cinco), cada uma no seu arquivo, e só junte no fim. Todas recebem o número de quadro do vídeo inteiro.

## Narração (modelo para a tirzepatida)

Escreva no mesmo ritmo se trocar o remédio (cerca de 135 palavras no total; com a Juliana dá uns 57 segundos). Cada bloco deve caber na janela da sua parte.

- **Parte 1 (0 a 8 s):** "Tirzepatida. Uma única molécula que controla a glicose e reduz o peso. Mas como ela age no corpo?"
- **Parte 2 (8 a 27,5 s):** "Ela imita dois hormônios do intestino, o GIP e o GLP-1. Na superfície das células existem receptores para cada um deles. A tirzepatida encaixa nos dois, como uma chave que abre duas fechaduras. Uma cauda de ácido graxo a prende à albumina, e o efeito dura uma semana."
- **Parte 3 (27,5 a 34,5 s):** "Quando ela encaixa, o receptor liga um sinal dentro da célula, o AMP cíclico, e a célula responde."
- **Parte 4 (34,5 a 51,5 s):** "No pâncreas, libera insulina só quando a glicose está alta, e reduz o glucagon. No estômago, a comida sai mais devagar. No cérebro, a fome diminui. Nos estudos, a hemoglobina glicada caiu mais de dois pontos, e o peso, cerca de vinte por cento."
- **Parte 5 (51,5 a 57 s):** "Os efeitos mais comuns são náuseas e diarreia. Use só com orientação médica."

## O vídeo

Formato: **1080 de largura por 1920 de altura**, 30 quadros por segundo, **1860 quadros (62 segundos)**. Tempos em quadros do vídeo inteiro. Medidas em px da tela de 1080 por 1920 (x da esquerda, y do topo).

**Áreas seguras do Reels:** nada importante acima de y = 220 nem abaixo de y = 1560, e nada importante à direita de x = 940 entre y = 1000 e 1560 (onde ficam os botões do Instagram).

### Aparência que vale para o vídeo inteiro

- Fundo quase preto azulado (#070b1a), nunca preto puro.
- Brilho: uma luz difusa na cor do medicamento que sobe de baixo, como luz atrás do horizonte (elipse com centro 120 px abaixo da borda de baixo, raio horizontal 1100, raio vertical 700; opacidade 0,35 no centro caindo até zero). Ela respira devagar (±0,05 a cada 8 segundos) e dá um pulso curto (sobe e volta em 1 segundo) em cada momento de "encaixe": quando a molécula encaixa no receptor, quando a cascata acende e quando os números chegam ao valor final.
- Poeira de partículas bem leve subindo devagar no fundo, e grão de filme quase imperceptível que só escurece.
- Cores: texto creme #eef2ff, texto de apoio #94a3c8, medicamento lilás (da configuração), cores dos alvos (da configuração), alerta #fb7185, destaque de número #fde047. Caixas escuras rgba(20,24,44,0.92) com borda de 1,5 px rgba(255,255,255,0.10).
- Fontes: **Source Serif 4** (400 e 600) para títulos e números grandes; **Inter** para rótulos e interface.
- Movimento: nada é linear, a não ser quando eu disser. Curva padrão bezier (0.45, 0, 0.2, 1). O que chega freia no fim; o que sai acelera. "Com estalo" = `Easing.out(Easing.back(1.6))`. Borrões proporcionais ao movimento, zerados quando a peça para. Sombras e halos sempre fracos.
- Um mundo só: não existe corte seco. Uma parte sai (apagando, com borrão) enquanto a outra entra; os quadros de início e fim se sobrepõem.
- Texto que nasce na tela nasce na cor do medicamento, com um brilho em volta, e esfria para o creme em uns 16 quadros.
- **Sem legendas, sem barra de progresso e sem títulos de parte:** a tela mostra só a animação; quem explica é a voz.

### As peças (todas desenhadas por código)

- **Molécula do medicamento:** um colar de contas em onda (uma conta por "unidade"; para peptídeos, use o número de aminoácidos da configuração, até 40), em degradê das cores dos alvos passando pela cor do medicamento, com brilho suave. Uma versão pequena (13 contas) é a "chave" que encaixa nos receptores.
- **Receptor:** forma de U atravessando a membrana, cinza azulado, que acende na cor do alvo quando a chave encaixa.
- **Membrana:** duas fileiras de bolinhas com "caudinhas" (bicamada lipídica), ondulando de leve.
- **Albumina** (se a configuração falar dela): bolha azul-clara translúcida que "abraça" a cauda da molécula.
- **Órgãos:** pâncreas (forma alongada com ilhotas), estômago (bolsa em J que esvazia), cérebro (elipse com sulcos e o hipotálamo aceso), em traço fino e preenchimento translúcido. Se eu trocar os órgãos, desenhe os novos no mesmo estilo (coração, rim, fígado, vaso, pulmão, intestino etc.).
- **Seringa/caneta, cápsula e comprimido:** ícones simples, para a via de uso da configuração.
- **Check:** bolinha na cor do medicamento com visto branco.

---

## Parte 1 (quadros 0 a 244): abertura

1. **0 a 24. Riscos de luz.** Quatro riscos na cor do medicamento saem de fora da tela (de cada canto) e viajam em arco até o centro (540, 760), onde chegam juntos no quadro 24, com a ponta quase branca e cauda que afina.
2. **22 a 40. A molécula nasce.** Clarão curto no encontro e o colar de contas se monta conta por conta da esquerda para a direita, em onda, no centro (largura 860).
3. **40 a 70. O nome.** A molécula sobe e diminui; o nome do medicamento (Source Serif 600, 132 px, creme) sobe de baixo de uma máscara, centralizado em y = 660. Embaixo, o nome comercial (Inter 34 px, apoio) e a classe em uma ou duas linhas (Inter 38 px, na cor do medicamento).
4. **Na fala da pergunta.** A pergunta da abertura é digitada palavra por palavra numa caixa escura de cantos arredondados (900 de largura, centrada em y = 1050), Inter 46 px, com cursor piscando, cada palavra no quadro em que é falada.
5. **232 a 244.** Tudo sobe 160 px e some com borrão, enquanto a parte 2 entra.

## Parte 2 (quadros 236 a 834): o alvo e o encaixe

Uma câmera passeia por um desenho grande (1080 por 2400) e aproxima: comece em visão geral, aproxime no receptor na hora do encaixe e volte. Movimentos de câmera com a curva padrão e borrão leve no meio; entre eles, deriva lenta em linha reta.

1. **Os hormônios naturais (início da fala):** à esquerda, um intestino estilizado; dele saem bolinhas nas cores dos alvos com o nome de cada hormônio em pílulas.
2. **A membrana e os receptores:** a câmera desce até a membrana (horizontal, no meio da tela). Os receptores sobem de dentro dela com estalo, cada um com o seu nome em pílula colorida acima.
3. **O encaixe:** a chave (molécula pequena) desce girando e encaixa em cada receptor, no quadro em que a voz diz "encaixa" (se houver dois alvos, uma chave em cada, com 1 segundo de diferença). No encaixe: o receptor acende, pulso do brilho, e um anel fino abre e some.
4. **Duração do efeito:** a câmera sobe para a molécula inteira; a cauda de ácido graxo cresce em zigue-zague e a albumina entra e a abraça. Aparecem os dois chips da configuração (meia-vida e frequência), o segundo com um mini calendário de 7 dias e só o primeiro dia aceso.
5. **822 a 834.** A parte sai apagando e crescendo 20% com borrão.

## Parte 3 (quadros 826 a 1046): a cascata dentro da célula

1. A câmera atravessa a membrana para dentro da célula (zoom com borrão). O receptor ativado fica no alto.
2. Os passos da cascata aparecem em fila vertical, ligados por setas que se desenham, cada um acendendo no quadro em que a voz o cita: cartões escuros arredondados (860 de largura, Inter 500, 44 px), com ícones simples (bolinhas do mensageiro se espalhando, um "interruptor" ligando, uma onda de sinal). O nome do mensageiro (por exemplo AMPc ↑) ganha uma pílula amarela que pulsa.
3. No último passo, a célula inteira dá um pulso e três "fios de luz" saem para baixo, cada um na direção de um órgão: é a ponte para a parte 4.
4. **1036 a 1046.** Saída apagando com borrão.

## Parte 4 (quadros 1040 a 1556): os efeitos e os números

1. **Os três órgãos**, um de cada vez, no ritmo da fala, empilhados verticalmente (topos em y = 300, 640 e 980), cada um num cartão escuro de 940 de largura com o desenho do órgão à esquerda (200 px) e, à direita, o nome (Source Serif 600, 52 px) e os efeitos (Inter 36 px), cada efeito com uma setinha ↑ ou ↓ colorida. Cada cartão entra com estalo, levemente torto (-1°, 0,8°, -0,5°), e o órgão faz a sua animação: o pâncreas solta grânulos amarelos de insulina subindo; o estômago esvazia devagar; o cérebro acende o hipotálamo e uma barra de saciedade enche.
2. **Os resultados.** Os cartões vão para trás (apagam 75% e borram) e os dois números tomam a tela, um em cima do outro: valor em Source Serif 600 de 200 px, na cor do alvo correspondente, contando de zero até o valor final freando no fim, os dois chegando juntos com um pulso de 7%; o rótulo em Inter 42 px embaixo e a fonte do estudo em Inter 28 px apagado. Ao lado de cada número, uma barra vertical que enche junto.
3. **1546 a 1556.** Tudo sobe e some com borrão.

## Parte 5 (quadros 1554 a 1860): resumo, segurança e mensagem final

1. **Resumo:** pílulas "GIP + GLP-1 = Tirzepatida" (montadas a partir da configuração: alvos + medicamento) e, embaixo, três cartões pequenos com os efeitos principais (por exemplo Glicose ↓ · Apetite ↓ · Peso ↓), entrando com estalo.
2. **Efeitos adversos e aviso (na fala):** o título "Efeitos mais comuns" e os chips dos efeitos adversos entram com estalo (cor de alerta, contorno fino); embaixo, o aviso fixo em Inter 38 px, em três linhas, a segunda e a terceira nascendo na cor de alerta.
3. **Mensagem final (quando a voz termina, até o fim):** tudo sobe e some com borrão, e a mensagem final aparece sozinha no centro, linha por linha, subindo e saindo do borrão: "Consulte um" e "para orientações." em Source Serif 400 de 80 px, creme; "profissional de saúde" no meio, em Source Serif 600 de 92 px, na cor do medicamento, com brilho. O conjunto cresce bem devagar (de 98% a 102%). Embaixo, pequeno e apagado (Inter 24 px): "Conteúdo educativo. Ref.:" e as referências. O vídeo termina com a mensagem nítida por pelo menos 3 segundos. Não coloque nome, perfil nem convite para comentar.

---

## Como conferir antes de me entregar

1. Renderize quadros parados e olhe você mesmo cada um: 20, 45, 120, 200, 330, 470, 560, 620, 760, 880, 1000, 1060, 1230, 1320, 1420, 1545, 1680, 1760 e 1850.
2. Corrija se: algum texto sair cortado, torto ou ilegível com a câmera parada; algo importante cair fora das áreas seguras do Reels; duas partes aparecerem misturadas fora das passagens; a tela ficar toda preta sem nada em cima; dois textos ficarem um em cima do outro; a molécula passar por cima de uma etiqueta; a chave não encaixar exatamente no receptor; a fala e a animação estiverem fora de sincronia (mais de meio segundo).
3. Olhe em tamanho real (1080 por 1920) pelo menos os quadros 120, 520, 880, 1200 e 1420.
4. Confira que o vídeo tem 62 segundos (1860 quadros), que o arquivo tem faixa de áudio e que ela não está em silêncio. O arquivo deve ter menos de 60 MB.
5. Renderize o final em `out/video.mp4`.
6. No fim, me diga só três coisas, sem nenhum comando: onde está o arquivo (e me mande ele aqui para eu assistir), quantos créditos da ElevenLabs foram usados, e uma frase com o que posso pedir para mudar (por exemplo: "troca o remédio para metformina", "muda os números", "troca a voz", "muda a mensagem final").
