# Tirzepatida — vídeo motion do mecanismo de ação

- `tirzepatida_reels.mp4`: versão vertical para Reels/TikTok/Shorts (1080×1920, 9:16, 30 fps, ~1 min 45 s)
- `tirzepatida_mecanismo.mp4`: versão horizontal (1920×1080, 16:9)
- `roteiro.md`: roteiro com as cenas e as falas
- `narracao.mp3`: narração gerada na ElevenLabs (plano gratuito; voz "Henrique", modelo `eleven_flash_v2_5`, ~687 créditos)
- `scene.html` / `scene_reels.html`: animação em canvas (horizontal / vertical); `draw(t)` desenha o quadro do instante `t`
- `render.mjs`: captura os quadros com Playwright e monta o MP4 com ffmpeg

## Re-renderizar

```bash
mkdir -p node_modules && ln -s /opt/node22/lib/node_modules/playwright node_modules/playwright
node render.mjs                     # gera tirzepatida_mecanismo.mp4 (16:9)
SCENE=scene_reels.html SIZE=1080x1920 OUT=tirzepatida_reels.mp4 node render.mjs   # Reels (9:16)
STILLS="5,30,60" node render.mjs    # só gera prévias em PNG
```

Os tempos das cenas (`SCENES`) e das legendas (`CAPS`) em `scene.html` seguem as pausas da narração.

Conteúdo educativo; não substitui orientação médica.
