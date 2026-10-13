# Tirzepatida — vídeo motion do mecanismo de ação

- `tirzepatida_mecanismo.mp4`: vídeo final (1920×1080, 30 fps, ~1 min 45 s), com narração e legendas
- `roteiro.md`: roteiro com as cenas e as falas
- `narracao.mp3`: narração gerada na ElevenLabs (plano gratuito; voz "Henrique", modelo `eleven_flash_v2_5`, ~687 créditos)
- `scene.html`: animação em canvas; `draw(t)` desenha o quadro do instante `t`
- `render.mjs`: captura os quadros com Playwright e monta o MP4 com ffmpeg

## Re-renderizar

```bash
mkdir -p node_modules && ln -s /opt/node22/lib/node_modules/playwright node_modules/playwright
node render.mjs                     # gera tirzepatida_mecanismo.mp4
STILLS="5,30,60" node render.mjs    # só gera prévias em PNG
```

Os tempos das cenas (`SCENES`) e das legendas (`CAPS`) em `scene.html` seguem as pausas da narração.

Conteúdo educativo; não substitui orientação médica.
