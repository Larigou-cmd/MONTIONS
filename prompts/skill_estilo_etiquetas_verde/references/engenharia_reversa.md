# Engenharia reversa dos 2 vídeos de referência

Vídeos enviados por ela pelo WhatsApp em 23/11/2026 (chegaram sem som; a fala foi lida pelas legendas da tela). Quadros a cada 3 s em `assets/ref_tecnicas_1..4.jpg` (vídeo A) e `assets/ref_ficha_1..3.jpg` (vídeo B). Desmontagem automática do rea-video em `E:\Downloads\Videos\ferramentas\rea-video-saidas\vacina_angulos` e `\vacina_bcg` (se existir). O original é de outra marca: estudar e recriar o jeito, nunca copiar logo, texto ou imagem.

## Medidas comuns aos dois

- Vertical 9:16. Fundo verde quase preto, entre #00140b e #002113, com brilho verde difuso nos cantos e linhas diagonais finas bem apagadas no alto (decoração). No nosso kit: `Background` com `COR.NEON` dá o mesmo efeito.
- Verde de destaque neon-menta (≈ #3dff8f / #5af0a0), texto branco-creme, rótulos pequenos em verde em CAIXA ALTA com letra espaçada.
- Fonte sem serifa pesada (tipo Inter/Gilroy 800–900). Títulos à esquerda, com 1 ou 2 palavras em verde.
- Topo: logo à esquerda + etiquetas/selo à direita (nós trocamos o logo deles pelas nossas etiquetas centralizadas; o logo Farma.exe aparece só no "Me siga").
- Legenda em pílula escura no terço de baixo, 3 a 5 palavras, a palavra falada com fundo verde (efeito karaokê).
- Ritmo: troca grande de tela a cada **2 a 5 s** (medido por diferença de quadros): vídeo A teve 26 trocas em 84 s; o B, 12 trocas grandes em 75 s, mas com elementos entrando dentro de cada tela a cada ~1 s.
- Elementos entram com leve subida + aparecer, cartões em sequência (um após o outro), nada pisca.
- Duração: 75–84 s.

## Vídeo A — "Técnicas de aplicação #1" (84 s): formato técnica

| Tempo | Tela | O que acontece |
|---|---|---|
| 0–3 s | Gancho | "15° 45° 90°" gigante, os números acendendo um a um; "Qual é o ângulo certo?"; corte da pele já com seringas; frase "Errar o ângulo da agulha" |
| 6–10 s | "A pele **por dentro**" | corte da pele grande (epiderme rosa, subcutâneo amarelo com células, músculo vermelho listrado); rótulos aparecem nas camadas; "Cada via mira uma camada." |
| 12–24 s | 15° · VIA ID · Intradérmica | número grande à esquerda + nome; seringa quase deitada entra; forma a pápula; cartão LOCAL / AGULHA com figura anatômica do braço; pílula "BCG" |
| 27–42 s | 45° · VIA SC · Subcutânea | seringa a 45° entra até a gordura (camada acende); variação "Magro · 30°" e "Obeso · até 90°"; cartão LOCAL / AGULHA; pílulas com exemplos |
| 45–50 s | 90° · VIA IM · Intramuscular | seringa reta até o músculo; AGULHA; aviso com ícone amarelo ("Escolha do local: idade, tecido adiposo, nervos e vasos") |
| 51–60 s | "Onde aplicar a **IM**" | lista com miniaturas anatômicas: Vasto lateral (bebês), Deltoide (crianças maiores e adultos), Ventroglúteo (alternativa segura); pílulas de exemplos; crédito das imagens 3D no rodapé |
| 63–70 s | VIA VO · Oral | foto de bebê em cartão; ícone de seringa cortada "Sem agulha. Sem ângulo."; círculo marcando a bochecha; aviso amarelo "Regurgitou? Não repete a dose." |
| 72–77 s | "Grava **aí**." | corte da pele pequeno + tabela ID/SC/IM/VO × ângulo × camada × exemplo, linhas acendendo uma a uma |
| 78–84 s | Chamada | 3 cartões grandes com ícone: Salva esse vídeo / Manda pra sua equipe / Comenta a próxima vacina; logo + "Técnicas de aplicação · #1" |

Etiquetas do topo: ID · SC · IM · VO (a da vez cheia de verde). Esse é o nosso componente `Abas`.

## Vídeo B — "Vacina por vacina #1 · BCG" (75 s): formato ficha

| Tempo | Tela | O que acontece |
|---|---|---|
| 0–6 s | Abertura | "VACINA POR VACINA · #1" em cima; "BCG" enorme brilhando; nome por extenso; 3 pílulas (Dose única cheia, Intradérmica, Ao nascer) |
| 6–9 s | Frase-gancho | "A técnica mais delicada **da sala de vacina**." (2ª metade em verde) |
| 9–15 s | "O que ela **protege**" | escudo grande com check; cartões com mini-escudo: Tuberculose meníngea, Tuberculose miliar |
| 18–27 s | "Quando **aplicar**" | linha do tempo vertical: INDICAÇÃO Ao nascer → LIMITE 4 anos, 11 meses e 29 dias; caixa EXCEÇÃO (contato de hanseníase) |
| 27–48 s | 15° · VIA ID | reaproveita o corte da pele do vídeo A; cartão LOCAL (braço direito, figura) / AGULHA; pílulas de dose (0,05 mL < 1 ano · 0,1 mL ≥ 1 ano) |
| 48–57 s | "CONTRAINDICAÇÕES E PRECAUÇÕES · Antes de aplicar" | rótulo vermelho NÃO APLIQUE + cartões vermelhos escuros com ícone de proibido; rótulo amarelo ADIE OU TENHA CAUTELA + cartão amarelo com triângulo |
| 57–66 s | "Depois da **aplicação**" | cartões vermelhos "Não massagear / Não comprimir"; evolução em 3 círculos com setas: Pápula → Lesão → Cicatriz; "É esperado" |
| 66–75 s | Final | pílulas Salva / Manda pra equipe / Segue a série (a última cheia); "PRÓXIMO EPISÓDIO · #2 Hepatite B"; logo + "Vacina por vacina" |

Selo no canto superior direito: "#1 · BCG" (nosso `SeloEpisodio`).

## O que adaptamos para o Farma.exe (e por quê)

- Etiquetas **centralizadas** e sem o logo deles no topo (canal anônimo; o logo Farma.exe fica no "Me siga").
- Paleta já aprovada do Modelo 1 (`config.ts`): mesmo efeito, com o amarelo-limão do canal para atenção.
- Ícones desenhados em vez de emoji.
- Pausa de leitura no "Grava aí" (eles cortam rápido porque a fala é rápida; nossa narração pede respiro).
- Telas obrigatórias do canal no fim: "Me siga para mais dicas de farmacologia e curiosidades sobre a área" com o logo e "Consulte um profissional de saúde para orientações." (leis: "Me siga para mais dicas sobre leis" + "Bons estudos!").
- Fotos de pessoas (o bebê do vídeo A) não entram: sem rosto real e sem imagem de banco; usar desenho.

## O que o rea-video mediu (desmontagem automática, 24/11/2026)

Relatórios completos: `E:\Downloads\Videos\ferramentas\rea-video-saidas\vacina_angulos` e `\vacina_bcg` (`VIDEO.md`, `report.html`, `storyboard.jpg`). Rodou sem modelo de visão, então a parte "como foi feito" é palpite por estatística de pixel (chamou as figuras anatômicas de "3D" e a foto do bebê de "IA"): vale o que é medido.

- **Câmera sempre parada.** Nada de zoom ou movimento de câmera: o movimento é dos elementos entrando.
- **Transições:** quase todas um **desfoque rápido de 0,1 a 0,4 s** (algumas um corte seco ou uma cortina de 0,3 s). Nosso `Part` já faz esse desfoque na entrada e na saída.
- **Duração das telas:** vídeo A com 13 tomadas de 1,8 a 12,5 s (média ~6,5 s); vídeo B com 7 tomadas de 8 a 15 s. Dentro de cada tomada, os elementos entram um a um, a cada ~1 s, e é isso que segura o olho.
- **Legenda:** 91 linhas no A e 79 no B, ou seja, uma legenda nova a cada ~1 s.
- **Som:** os arquivos chegaram sem áudio, então não há medida de trilha ou efeitos.
