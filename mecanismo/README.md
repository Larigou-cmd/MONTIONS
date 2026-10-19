# Mecanismo de ação — vídeo em Remotion (Reels 9:16)

- Vídeo final: `out/video.mp4` (1080×1920, 30 fps, 62 s, com narração, sem legendas)
- Textos, números e tempos: `src/config.ts`
- Narração: `audio/narracao.mp3` (ElevenLabs, voz Juliana, modelo eleven_v4, plano gratuito)
- Cenas: `src/parts/Part1.tsx` a `Part5.tsx`

Para renderizar de novo: `npx remotion render Video out/video.mp4 --crf=20`
Fotos de conferência: `node scripts/stills.mjs 120 520 880`

## Vídeo 2: Os prazóis (omeprazol e família)

- Vídeo final: `out/prazois.mp4` (1080×1920, 58,7 s, voz Juliana, sem legendas)
- Textos e tempos: `src/ibp/config.ts`; cenas em `src/ibp/`
- Narração: `audio/ibp_narracao.mp3`
- Renderizar: `npx remotion render IBP out/prazois.mp4 --crf=20`

## Vídeo 3: Como funciona o AAS

- Vídeo final: `out/aas.mp4` (1080×1920, 2 min 40 s, voz Juliana gerada no site da ElevenLabs, com efeitos sonoros)
- Textos, tempos e efeitos: `src/aas/config.ts`; cenas em `src/aas/`
- Efeitos sonoros feitos por código: `scripts/sfx.py` → `public/sfx/`
- Renderizar: `npx remotion render AAS out/aas.mp4 --crf=21`

## Vídeo 4: Por que a dipirona é proibida nos EUA?

- Vídeo: `out/dipirona.mp4` (1080×1920, 84 s, voz Juliana, com efeitos sonoros)
- Narração: `audio/dipirona_narracao.mp3` (começa no quadro 105)
- Música de fundo própria, feita por código: `scripts/musica.py` → `public/musica_dipirona.wav`
- Textos e tempos: `src/dipirona/config.ts`; cenas em `src/dipirona/scenes.tsx`
- Renderizar: `npx remotion render Dipirona out/dipirona.mp4 --crf=21`

## Vídeo 5: Semaglutida com a personagem farmacêutica

- Vídeo: `out/semaglutida.mp4` (1080×1920, 80 s, voz Juliana, boca da personagem sincronizada com a voz, música e efeitos)
- Personagem: `public/sema/personagem.jpg`; boca e piscadas em `src/sema/Character.tsx`
- Abertura da boca por quadro: `python3 scripts/boca.py audio/sema_narracao.mp3 src/sema/boca.json`
- Textos e tempos: `src/sema/config.ts`; cenas em `src/sema/scenes.tsx`
- Renderizar: `npx remotion render Semaglutida out/semaglutida.mp4 --crf=20`

## Vídeo 6: Semaglutida no estilo "explicadora"

- Vídeo: `out/semaglutida_explicadora.mp4` (1080×1920, 80 s, mesma narração, música e efeitos do vídeo 5)
- Estilo: fundo claro quadriculado (algumas cenas azuis), título pixel com uma palavra colorida, cartões simples, personagem no canto de baixo trocando de "pose" (vira de lado, pulinho, balão com ícone) e indo para o centro no final
- Personagem recortada: `public/sema/personagem_recorte.png`; boca e piscadas em `src/sema2/Personagem.tsx`
- Cenas: `src/sema2/Video.tsx` (tempos de `src/sema/config.ts`)
- Renderizar: `npx remotion render Semaglutida2 out/semaglutida_explicadora.mp4`

## Vídeo 7: Semaglutida no modelo do omeprazol (sem personagem)

- Vídeo: `out/semaglutida_modelo_omeprazol.mp4` (1080×1920, 129 s; narração `audio/sema_narracao_mercado.mp3` = narração original + trecho das canetas nacionais `audio/sema_mercado.mp3`)
- Trecho das canetas nacionais (patente, lista, fabricação, estudo, cuidados): `src/semaIbp/Mercado.tsx`
- Mesmo visual do vídeo dos prazóis: fundo escuro com brilho azul, títulos em serifa, cartões arredondados
- Cenas: `src/semaIbp/Video.tsx` (tempos de `src/sema/config.ts`)
- Renderizar: `npx remotion render SemaglutidaIBP out/semaglutida_modelo_omeprazol.mp4 --crf=24`

## Vídeo 8: Amoxicilina + clavulanato (modelo aula elegante)

- Vídeo: `out/amoxicilina_clavulanato.mp4` (1080×1920, 114 s, voz Juliana, música e efeitos, sem legendas)
- Narração: `public/amoxi/narracao.mp3`; tempos palavra a palavra: `audio/amoxi_palavras.json`
- Textos, tempos e efeitos: `src/amoxi/config.ts`; desenhos (molécula, bactéria, PBP, betalactamase, escudo): `src/amoxi/shapes.tsx`; cenas: `src/amoxi/Video.tsx`
- Renderizar: `npx remotion render Amoxi out/amoxicilina_clavulanato.mp4 --crf=22`

## Vídeo 9: Forxiga (dapagliflozina) (modelo aula elegante)

- Vídeo: `out/forxiga.mp4` (1080×1920, 139 s; LME renovado a cada 6 meses (trecho regravado `public/forxiga/narracao_trecho_6meses.mp3`, versão antiga `narracao_v1_3meses.mp3`), voz Juliana, música própria `public/forxiga/musica.wav` e efeitos, sem legendas)
- Narração: `public/forxiga/narracao.mp3`; tempos palavra a palavra: `audio/forxiga_palavras.json`
- Textos, tempos e efeitos: `src/forxiga/config.ts`; cenas (rim com SGLT2, Farmácia Popular, CEAF com CIDs, processo): `src/forxiga/Video.tsx`
- Renderizar: `npx remotion render Forxiga out/forxiga.mp4 --crf=22`

## Vídeo 10: Sinvastatina e dor na perna (modelo aula elegante, roteiro da Larissa)

- Vídeo: `out/sinvastatina.mp4` (1080×1920, 177 s, voz Juliana, música própria `public/sinva/musica.wav` e efeitos, sem legendas)
- Narração: `public/sinva/narracao.mp3`; tempos palavra a palavra: `audio/sinva_palavras.json`
- Cenas, tempos e efeitos: `src/sinva/Video.tsx`
- Renderizar: `npx remotion render Sinvastatina out/sinvastatina.mp4 --crf=22`

## Vídeo 11: Por que a sinvastatina é tomada à noite? (parte 2, modelo aula elegante)

- Vídeo: `out/sinvastatina_noite.mp4` (1080×1920, 98 s, voz Juliana, termina com "Me siga…", música própria `public/sinvaNoite/musica.wav` e efeitos, sem legendas)
- Narração: `public/sinvaNoite/narracao.mp3` (sem a menção ao livro, cortada de 31,24 s a 34,30 s, + `narracao_siga.mp3` no fim; original em `narracao_v1_com_livro.mp3`); tempos palavra a palavra da versão original: `audio/sinvaNoite_palavras.json` (no vídeo, tudo depois de 34,3 s fica 92 quadros antes)
- Cenas, tempos e efeitos: `src/sinvaNoite/Video.tsx` (gráficos de 24 h esquemáticos: produção de colesterol × remédio no sangue)
- Renderizar: `npx remotion render SinvaNoite out/sinvastatina_noite.mp4 --crf=22`

## Vídeo 12: Seu remédio está te dando tosse? (IECA e tosse seca, modelo aula elegante, roteiro da Larissa)

- Vídeo: `out/tosse_ieca.mp4` (1080×1920, 132 s, voz Juliana, faixa fixa "REMÉDIO DE PRESSÃO × TOSSE SECA", música própria `public/tosse/musica.wav` e efeitos, sem legendas)
- Narração: `public/tosse/narracao.mp3`; tempos palavra a palavra: `audio/tosse_palavras.json`
- Cenas, tempos e efeitos: `src/tosse/Video.tsx` (tesoura ECA com dois trabalhos: angiotensina II e bradicinina)
- Renderizar: `npx remotion render Tosse out/tosse_ieca.mp4 --crf=22`

## Vídeo 13: Tosse que não passa? Pode ser o seu remédio (versão 2 do vídeo da tosse, voz mais calma)

- Vídeo: `out/tosse_que_nao_passa.mp4` (1080×1920, 150 s, voz Juliana com tags [warmly]/[slowly] e desacelerada 10% com `atempo=0.9`)
- Narração: `public/tosse2/narracao.mp3` (original em `narracao_original.mp3`); tempos: `audio/tosse2_palavras_original.json` × 30 ÷ 0,9
- Cenas: `src/tosse2/Video.tsx` (selos "mecanismo.exe ▓▓░░" e "⚠️ ERRO: efeito grave detectado")
- Renderizar: `npx remotion render Tosse2 out/tosse_que_nao_passa.mp4 --crf=22`

## Vídeo 14: Por que alguns remédios devem ser tomados em jejum? (modelo aula elegante, roteiro da Larissa)

- Vídeo: `out/jejum.mp4` (1080×1920, 179,6 s, narração gravada pela Larissa, trilha calma `scripts/musica_calma.py`)
- Narração: `public/jejum/narracao.mp3` (original `narracao_usuaria.mp3` com pausas longas encurtadas para 0,32 s e `atempo=1.0804`, para caber em 3 min); tempos: `audio/jejum_palavras_usuaria.json` (alinhados por DTW com `narracao_gerada_claude.mp3`)
- Cenas: `src/jejum/Video.tsx`; capa: `src/jejum/Capa.tsx` (composição `JejumCapa`) → `youtube/capas/capa_jejum.png`
- Renderizar: `npx remotion render Jejum out/jejum.mp4 --crf=22`

## Vídeo 15: Começou a tomar metformina e veio a diarreia? (modelo aula elegante, série "Começou a tomar X e sentiu Y?")

- Vídeo: `out/metformina_diarreia.mp4` (1080×1920, 92,3 s, narração da Juliana no ElevenLabs, trilha calma `scripts/musica_calma.py`)
- Narração: `public/metformina/narracao.mp3`; tempos: `audio/metformina_palavras.json` (transcrição Scribe)
- Cenas: `src/metformina/Video.tsx`; capa: `src/metformina/Capa.tsx` (composição `MetforminaCapa`, 20% de baixo livres por causa do contador do TikTok) → `youtube/capas/capa_metformina.png`
- Renderizar: `npx remotion render Metformina out/metformina_diarreia.mp4 --crf=22`
