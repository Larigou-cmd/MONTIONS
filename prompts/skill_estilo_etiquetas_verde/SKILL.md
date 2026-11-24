---
name: estilo-etiquetas-verde
description: Estilo visual "Etiquetas verdes" do canal Farma.exe — fundo verde bem escuro, verde neon, etiquetas fixas no topo que acendem por parte, número grande ao lado do título, corte da pele em camadas, legenda em pílula com a palavra falada acesa, listas vermelha/amarela, linha do tempo, tabela "Grava aí" e cartões finais "Salva / Manda / Comenta". Engenharia reversa de 2 vídeos de referência (técnicas de aplicação e ficha "vacina por vacina") com kit pronto em Remotion. Usar SEMPRE que ela pedir "esse estilo", "estilo das vacinas", "estilo da insulina", "estilo das etiquetas", "igual ao vídeo da insulina", "copiar o estilo daquele vídeo", "série remédio por remédio", "ficha de remédio", "técnica de aplicação", "vias de administração", "passo a passo com ângulo", ou quiser um vídeo de checklist/ficha/como fazer no Modelo 1 verde, mesmo sem dizer o nome da skill.
---

# Estilo "Etiquetas verdes"

Ela é farmacêutica, não programa e acompanha tudo pelo chat. Este estilo nasceu de 2 vídeos de referência que ela mandou em 23/11/2026 (uma empresa de vacinas: "Técnicas de aplicação #1" e "Vacina por vacina #1 – BCG") e foi aprovado no vídeo 90, "Insulina: ângulo e local de aplicação". Copiamos o **jeito de montar**, nunca a marca, o conteúdo ou as imagens deles.

Esta skill cuida só do visual e do ritmo. O resto do processo (tema, checagem, 3 ganchos, narração, prévias, "aprovado", capa, textos das 4 redes, GitHub) segue a skill `video-farma-exe`. Quando as duas valerem, leia as duas.

## Onde está o código

Projeto: `E:\Progamas\MONTIONS\mecanismo`.
- **Kit de peças:** `src/estiloEtiquetas/kit.tsx`. Importe daqui; não copie o código de novo.
- **Demonstração com todas as peças:** `src/estiloEtiquetas/Demo.tsx` (Id `EstiloEtiquetasDemo`). Sirva-se dela como modelo de montagem.
- **Vídeo aprovado completo** (com áudio, pausa e capa): `src/insulinaAplicacao/Video.tsx`.
- **Catálogo das peças e do que cada uma recebe:** `references/pecas.md`.
- **Engenharia reversa dos 2 vídeos** (cena por cena, tempos, cores, medidas): `references/engenharia_reversa.md`.
- **Quadros dos vídeos de referência** para olhar: `assets/ref_tecnicas_*.jpg`, `assets/ref_ficha_*.jpg`. A prova do kit: `assets/kit_demo.jpg`.

## Os dois formatos

1. **Técnica / como fazer** (vídeo 1 da referência): uma ilustração-base que se repete o vídeo todo (o corte da pele) e muda só o que acende. As etiquetas do topo são as partes da técnica (ex.: ÂNGULO · LOCAL · CAROÇO · RODÍZIO). Cada parte abre com **número grande + título** (90°, 45°, 15°).
2. **Ficha / série "X por X"** (vídeo 2 da referência): abre com o **nome gigante brilhando + pílulas**, selo do episódio no canto (`#1 · NOME`) e seções com o mesmo jeito de título ("O que ele **protege**", "Quando **tomar**", "Antes de **usar**", "Depois do **uso**"). Fecha com "Próximo episódio".

Pergunte qual dos dois só se o pedido não deixar claro; lista de cuidados/ficha de remédio → formato 2; técnica com ângulo, local, passo a passo → formato 1.

## Regras do estilo (o que faz ele funcionar)

- **Uma ideia de tela por vez, trocando a cada 2 a 5 s.** Os vídeos de referência mudam a tela nesse ritmo; tela parada mais que isso cansa.
- **Etiquetas no topo sempre visíveis** depois da abertura: dizem onde a pessoa está e quanto falta. 3 a 5 etiquetas, palavras curtas em maiúsculas.
- **Uma ilustração-base reaproveitada** (corte da pele, corpo, mapa da barriga). Quem assiste aprende o desenho uma vez e depois só acompanha o que acende.
- **Cor tem função fixa:** verde neon = informação/certo; amarelo-limão = atenção/adie; vermelho = só "não faça" e erro real. Fundo verde bem escuro, texto creme.
- **Título à esquerda, com a palavra-chave em verde** ("A pele **por dentro**"). Número grande quando houver número (ângulo, dose, dias).
- **Legenda em pílula embaixo** (y≈1478), palavra falada acesa em verde, até 5 palavras por vez. Use `montarFrases` com os tempos da transcrição.
- **Listas de cuidados em cartões:** vermelho com ícone de proibido (NÃO FAÇA), amarelo com triângulo (ATENÇÃO), verde com escudo (protege/faça). Sempre com palavra escrita, nunca só a cor.
- **"Grava aí" no fim:** tabela-resumo que acende linha a linha. Dê tempo de ler: se a fala for rápida, insira 2 a 2,5 s de pausa na narração antes do "Me siga". **Corte a narração no meio de um silêncio medido** (`silencedetect`), nunca no tempo do whisper: um corte 0,3 s cedo já virou uma "travada" que ela ouviu.
- **Cartões finais** "Salva / Manda / Comenta" só quando ela quiser os três; o guia do canal prefere um pedido só. O "Me siga" com o logo Farma.exe e a tela "Consulte um profissional de saúde" continuam obrigatórios (ver `video-farma-exe`).
- **Área segura vertical:** conteúdo entre y≈300 e y≈1620; etiquetas em y=262, título em y≈360, ilustração entre 520 e 1320, pílulas de apoio em ~1365, legenda em 1478.
- **Ícones desenhados** (`Ico`), não emoji, nos cartões: emoji muda de cara entre computadores.
- Sem 3D (o estilo é 2D plano com brilho). Sem marca de remédio. Imagens anatômicas só desenhadas por nós ou de fonte livre com crédito (a referência usou BodyParts3D, CC BY-SA, com crédito no rodapé).

## Som neste estilo

- No vídeo 90 ela pediu **sem música de fundo**: só a voz e efeitos. Pergunte se quer trilha antes de colocar; se quiser, só nos respiros ou bem baixa.
- Efeitos reais do Openverse em `public/sfx_openverse/` (whoosh nas trocas de parte, pop baixo nas pílulas, carimbo no X vermelho, `grave_curto` nas revelações, `caneta_clique` quando aparece caneta/seringa, tique em contagem, sting no fim). Volumes baixos: a voz manda.
- Masterizar em −14 LUFS e rodar o Earshot. Sem música, ele vai reclamar de "music presence" e contar sílabas da voz como batidas: escolha dela, aceito.

## Passo a passo para um vídeo novo neste estilo

1. Roteiro e checagem pela skill `video-farma-exe` (3 ganchos no chat, ela escolhe).
2. Narração → transcrição com tempos (`$TEMP/ep1/transc.py` ou `scripts/transcrever.py`) → `src/<tema>_palavras.json`.
3. Escolher o formato (1 ou 2) e as 3–5 etiquetas do topo, uma por parte do roteiro.
4. Copiar `src/estiloEtiquetas/Demo.tsx` para `src/<tema>/Video.tsx`, trocar textos e tempos (marcar cada entrada pela palavra falada), registrar no `Root.tsx`.
5. Fotos das cenas (`node scripts/stills.mjs`, com `COMP=<Id>` e TEMP/TMP em `E:\remotion-temp`), conferir texto cortado, caneta em cima de título, pílula em cima de desenho; mandar no chat com o que você mudaria.
6. Prévia em vídeo, Earshot, "aprovado", capa (mesmo estilo: pergunta grande em cima, ilustração-base no meio, carimbo amarelo embaixo), entrega pela `video-farma-exe`.
