# Modelo 7 ("Comercial WhatsApp"): comercial "Pergunte à farmacêutica" (PARADO, retomar depois)

Ideia escolhida em 2026-10-23. O comercial vende o atendimento farmacêutico pelo WhatsApp, e não um remédio (a RDC 96/2008 da Anvisa proíbe propaganda de remédio de tarja ao público).
Duração de 45 s. O WhatsApp é desenhado no código, com conversas fictícias.

| Tempo | Cena |
|---|---|
| 0–5 s | Celular vibrando. "Dúvida sobre remédio? Manda no WhatsApp." |
| 5–15 s | Cliente: "Esqueci a pílula ontem 😰 e agora?" Resposta: "Tome assim que lembrar, mesmo que sejam 2 no mesmo dia, e siga no horário de sempre. Esqueceu 2 ou mais? Use camisinha por 7 dias." |
| 15–25 s | Cliente: "Antibiótico corta o efeito do anticoncepcional?" Resposta: "A maioria não corta. A exceção é a rifampicina (e a rifabutina, em menor grau): com elas, use outro método junto." |
| 25–35 s | Cliente: "Posso partir o comprimido pra engolir melhor?" Resposta: "Depende! Comprimido de liberação prolongada não pode ser partido: ele soltaria a dose toda de uma vez. Me manda a foto da caixa que eu confiro 📸" |
| 35–42 s | Cliente aliviada ("Obrigada!! ❤️"), depois o logo e "Pergunte à farmacêutica". |
| 42–45 s | "Consulte um profissional de saúde para orientações." |

## Falta a usuária responder
1. O nome ou logo que aparece no final.
2. O nome da cliente fictícia (sugestão: Ana).
3. O formato: 16:9, como no modelo colado, ou 9:16, para Reels.
4. O som: só música, ou a Juliana narrando? Tem música própria?
5. Se as 3 dúvidas servem.

Regras do modelo de comercial colado pela usuária:
- Mostrar o mapa do som e esperar o "ok" antes da cena 1.
- Fazer uma cena por vez.
- Renderizar sem som.
- Fazer o render completo só depois do "vai".

## Prompt adaptado (versão de 2026-10-24)
Quero um comercial de 45 segundos, 16:9, 30 quadros por segundo, feito no Remotion, mostrando o meu atendimento "Pergunte à Farmacêutica" resolvendo as dúvidas de uma cliente pelo WhatsApp.

Você fala comigo em português simples. Eu não sou programadora: nunca me peça para escrever código nem para abrir terminal. Se precisar instalar algo, instale e me avise em uma frase.

Material que eu dou (se faltar, peça tudo de uma vez, em lista curta):
- Não há prints de ferramenta: o WhatsApp e os cards de resposta são desenhados no código, com conversas fictícias. Nunca use marca de remédio.
- Pasta marca/: o meu logo (se não houver, faça um com o meu nome no estilo dos meus vídeos).
- Pasta musica/: uma música (opcional). Sem música, use uma faixa livre e me diga a fonte.
- Cliente fictícia: Ana.

Antes de qualquer cena (numa única resposta):
1. Meça os BPM da música por dois métodos e me mostre um mapa de som curto: uma linha por cena, com a batida e o tempo de cada ação.
2. Mostre como ficam a conversa e os cards de resposta.
Espere meu "ok" antes de fazer a cena 1.

Estrutura:
- Cena 1 (6 s): abertura com "Pergunte à Farmacêutica" num fundo claro; a Ana manda "Oi! Posso tirar umas dúvidas de remédio?"; três pontinhos de "digitando" e a resposta "Claro, manda!".
- Cena 2: "Esqueci a pílula ontem 😰 e agora?" → card: tome assim que lembrar, mesmo que sejam 2 no mesmo dia, e siga no horário de sempre; esqueceu 2 ou mais, use camisinha por 7 dias.
- Cena 3: "Antibiótico corta o efeito do anticoncepcional?" → card: a maioria não corta; a exceção é a rifampicina (e a rifabutina, em menor grau): com elas, use outro método junto.
- Cena 4: "Posso partir o comprimido pra engolir melhor?" → card: depende! Liberação prolongada não pode ser partida; manda a foto da caixa que eu confiro 📸.
- Cena 5: "Pronto.", a Ana agradece ("Obrigada!! ❤️") e a assinatura com o meu logo. Depois, a tela "Consulte um profissional de saúde para orientações."

Regras:
- Todo movimento começa e termina numa batida da música.
- Um mundo só: mesmo fundo, mesma luz e mesmas fontes. A câmera desliza do celular para o card de resposta e de volta, sem corte seco.
- Todo zoom arranca devagar, acelera, freia e tem borrão no meio; ao fim do zoom a peça continua inteira na tela.
- Entre uma ação e a próxima, no máximo meio segundo parado (exceto os 2 primeiros segundos).
- Sempre tem algo se mexendo na tela.
- Uma cena por vez, de 5 a 8 segundos. Antes de renderizar, me mostre 4 fotos da cena (PNG, em fotos/) e espere meu ok. Renderize sem som e junte o som depois.
- Final com a música abafada e eco, nunca cortando seco.
- Não renderize o vídeo inteiro nem gaste muito processamento sem eu dizer "vai".

## Fontes
- https://www.mdsaude.com/ginecologia/anticoncepcionais/como-tomar-anticoncepcional/
- https://helloclue.com/pt/artigos/sexo/esqueci-de-tomar-a-pilula-anticoncepcional-o-que-fazer
- https://stacks.cdc.gov/view/cdc/159445
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12177323
- https://rfm.pt/atualidade/amp/21828/partir-comprimidos-afinal-podes-ou-nao-podes
- https://www.tuasaude.com/news/?p=115988

## Decisões (2026-10-25)
- Marca: **Farma.exe** (logo em letra de pixel Press Start, verde #16a34a, fundo claro). Formato: **9:16** (1080×1920), 45 s, 30 fps.
- Tema do episódio 1: as 3 dúvidas originais (pílula esquecida, antibiótico × anticoncepcional, partir comprimido).
- Música: `mecanismo/scripts/musica_comercial.py` (própria, sem direitos), 120 bpm. Medida por dois métodos (`scripts/medir_bpm.py`): autocorrelação dos ataques = 120,1 bpm; intervalo entre bumbos = 120,2 bpm. 1 batida = 0,5 s = 15 quadros.
- Peças: `mecanismo/src/farmaexe/ui.tsx`; foto de estilo: composição `FarmaEstilo`.

## Mapa de som (b = batida; b4 = 2,0 s)
| Cena | Tempo | O que acontece, na batida |
|---|---|---|
| 1 | 0–6 s (b0–b12) | b0–b4 logo FARMA.EXE se digita letra a letra, cursor pisca na batida · b4 logo sobe e o celular entra deslizando (b4→b6) · b6 Ana: "Oi! Posso tirar umas dúvidas de remédio?" · b7 digitando · b9 "Claro, manda! 💊" · b10→b12 zoom no chat (arranca devagar, acelera, borrão, freia) |
| 2 | 6–14 s (b12–b28) | b12 Ana: "Esqueci a pílula ontem 😰 e agora?" · b14 digitando · b16 câmera desliza do celular para o card · b17/b19/b21 entram os 3 itens · b24 câmera volta ao celular · b26 a resposta vira bolha no chat ✓✓ |
| 3 | 14–22 s (b28–b44) | mesmo ritmo: b28 pergunta do antibiótico · b30 digitando · b32 card · b33/b35/b37 itens · b40 volta · b42 bolha |
| 4 | 22–30 s (b44–b60) | mesmo ritmo: b44 pergunta do comprimido · b46 digitando · b48 card · b49/b51/b53 itens · b56 volta · b58 bolha |
| 5 | 30–38 s (b60–b76) | b60 "Pronto." · b62 Ana: "Obrigada!! ❤️" · b64 coração pulsa · b66 câmera se afasta e o celular sai · b68 assinatura FARMA.EXE + "Pergunte à Farmacêutica" |
| final | 38–45 s (b76–b90) | b76 "Consulte um profissional de saúde para orientações." · b80→b90 música abafada (passa-baixa) com eco, apagando sem corte seco |
