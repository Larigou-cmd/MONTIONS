# Mecanismo de ação — vídeo em Remotion (Reels 9:16)

- Vídeo final: `out/video.mp4` (1080×1920, 30 fps, 62 s, com narração, sem legendas)
- Textos, números e tempos: `src/config.ts`
- Narração: `audio/narracao.mp3` (ElevenLabs, voz Juliana, modelo eleven_v4, plano gratuito)
- Cenas: `src/parts/Part1.tsx` a `Part5.tsx`

Para renderizar de novo: `npx remotion render Video out/video.mp4 --crf=20`
Fotos de conferência: `node scripts/stills.mjs 120 520 880`
