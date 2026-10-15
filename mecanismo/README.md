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
