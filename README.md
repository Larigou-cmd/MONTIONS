# MONTIONS

Vídeos educativos de farmacologia em motion graphics (Remotion), verticais 1080×1920 para TikTok/Reels.

## Vídeos

| Composição | Tema | Duração | Roteiro |
|---|---|---|---|
| `GLP1` | GLP-1: semaglutida vs tirzepatida | 2min24 | `roteiros/glp1-longo.md` |
| `Paracetamol` | Paracetamol e o fígado | ~64 s | `roteiros/paracetamol.md` |
| `Naloxona` | Naloxona e overdose de opioides | ~65 s | `roteiros/naloxona.md` |
| `Sufixos` | Macete dos sufixos dos fármacos | ~62 s | `roteiros/sufixos.md` |

Cada roteiro traz a narração cena a cena (pronta para o Gemini TTS) e a legenda do post com hashtags.

## Como usar

```bash
npm ci
npm run dev                                   # abre o Remotion Studio
npx remotion render Paracetamol out/Paracetamol.mp4
```

## Estrutura

- `src/theme.ts`, `src/ui.tsx`, `src/orgaos.tsx`: visual compartilhado (cores, componentes, ícones).
- `src/comum.tsx`: peças dos vídeos curtos (gancho, encerramento, sequência de cenas).
- `src/cenas/`: cenas do vídeo GLP-1.
- `src/videos/`: um arquivo por vídeo curto. Para criar um novo, copie um deles e registre em `src/Root.tsx`.

Os MP4 renderizados ficam em `out/` (fora do git).

Conteúdo educativo, com base em Goodman & Gilman, Rang & Dale, Katzung e Fundamentos de Toxicologia.
Não substitui orientação profissional.
