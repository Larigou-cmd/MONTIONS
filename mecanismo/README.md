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
