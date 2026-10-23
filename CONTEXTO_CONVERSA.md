# Contexto da conversa — vídeos de farmacologia

> Cole este arquivo no começo de uma nova conversa com o Claude para ele continuar de onde parou.

## Quem sou e o que faço
- Farmacêutica, falo português do Brasil e não sou programadora: preciso de explicações simples.
- Faço vídeos verticais educativos de farmacologia para Shorts, Reels e TikTok, além de pins para o Pinterest.
- Projeto no GitHub: **larigou-cmd/montions**, branch `claude/wonderful-gates-z0qam0`.

## Regras fixas de trabalho
1. **Voz:** ElevenLabs, voz **Juliana**, `voice_id nczLZ6GvJGozyc3FlLte`.
   - Modelo `eleven_v4`, texto puro, **sem audio tags**, velocidade natural.
   - O tom aprovado é o do vídeo da sinvastatina à noite.
2. **Fatos:** sempre conferidos na internet, com fontes citadas.
3. **Aprovação:** mandar prévias (stills) e esperar eu dizer **"aprovado"** antes de renderizar o vídeo final.
4. **Tela final:** "Consulte um profissional de saúde para orientações." Antes dela vem a cena "Me siga para mais dicas de farmacologia e curiosidades sobre a área".
5. **Entrega:**
   - Mandar o MP4 no chat.
   - Quando o vídeo estiver realmente finalizado (depois do "aprovado"), salvar uma cópia do MP4 em `C:\Users\laris\Downloads\Videos\videos reels\`, com o nome do tema.
   - Mandar título, descrição e legenda para o YouTube, o TikTok, o Kwai e o Instagram.
   - Lembrar de marcar a voz de IA: no TikTok, "Conteúdo gerado por IA"; no YouTube, "conteúdo alterado ou sintético: Sim"; no Instagram, "Rótulo de IA"; no Kwai, a opção de IA se aparecer.
6. **Duração:** no máximo **3 minutos** (limite de Shorts e Reels).
7. **Música de fundo:** suave, com acordes calmos, em volume baixo (0.07).
   - Gerar com `python3 mecanismo/scripts/musica_calma.py <segundos> <saida.wav>`.
8. **Capa:** sempre fazer uma thumbnail vertical de 1080×1920.
9. **Modelo do vídeo:** se o roteiro tiver ".exe" ou "ERRO", perguntar qual modelo usar. Prefiro o **Modelo 1**.
10. **Minha própria narração:** às vezes eu mando uma narração em MP3 gravada por mim no ElevenLabs.
    - Alinhar as cenas com essa narração.
    - Se passar de 3 min, perguntar. Da última vez escolhi encurtar as pausas e acelerar um pouco.
11. **Livros:** livros de farmacologia (ex.: Farmacologia Ilustrada) servem **só como referência**. Não citar o livro no vídeo.

## Modelos de vídeo
- **Modelo 1:** Remotion, pasta `mecanismo/`, visual escuro e elegante.
  - Composições registradas em `mecanismo/src/Root.tsx`.
- **PHARMACIST.EXE:** visual de terminal retrô.

## Vídeos já feitos (pasta `mecanismo/src/`)
| Vídeo | Pasta | Observação |
|---|---|---|
| Sinvastatina à noite | `sinvaNoite/` | Tom de voz de referência; termina com a cena "Me siga" |
| Seu remédio está te dando tosse? (v1) | `tosse/` | Remédios de pressão IECA |
| Tosse que não passa? Pode ser o seu remédio (v2) | `tosse2/` | Com a minha narração; capa em `tosse2/Capa.tsx` |
| Por que alguns remédios devem ser tomados em jejum? | `jejum/` | Com a minha narração, pausas encurtadas, 179,6 s; capa em `jejum/Capa.tsx` |

- **Próximo vídeo (em andamento):** pílula do dia seguinte. O roteiro foi aprovado e está em `pilula_dia_seguinte/roteiro.md`. Falta a narração; depois vêm as prévias, o vídeo, a capa e o pin.
- **Metformina e diarreia** (série "Começou a tomar X e sentiu Y?"): `src/metformina/`, vídeo `out/metformina_diarreia.mp4`.
- **Quadro "Notícias da Farmácia":** estilo explicadora (fundo claro, títulos pixel, legenda palavra por palavra) com a repórter pixel de microfone no canto. O passo a passo para novos episódios está em `prompts/prompt_noticias_da_farmacia.md`. O episódio #1 (botox falsificado) está em `src/noticiaBotox/`.
- Capas prontas: `youtube/capas/` (nome `capa_<tema>.png`).
- Textos de postagem: um arquivo por vídeo em `youtube/textos/NN_<tema>.md`, com índice em `youtube/README.md`. Vídeo novo = arquivo novo com o próximo número + linha no índice.
- **Antídotos** (flumazenil e N-acetilcisteína, estilo Vox): `src/antidotos/Video.tsx` (Id `Antidotos`), reaproveita as peças exportadas de `src/sarampo/Vox.tsx`.

## Pinterest
- 5 pins de 1000×1500 em `pinterest/`: jejum, tosse, sinvastatina à noite, sinvastatina e dor muscular, amoxicilina.
- Código: `mecanismo/src/pins/Pins.tsx`. Textos: `pinterest/descricoes.md`.
- Ideias oferecidas que ainda não foram feitas:
  - Pins sobre Forxiga, compras na farmácia, dipirona e semaglutida.
  - Capa horizontal de 1280×720.
- **Monetização no Pinterest:** no Brasil não há pagamento por visualização. Dá para ganhar com afiliados e parcerias pagas, respeitando as regras da Anvisa e do CFF sobre propaganda de medicamentos.

## Parte técnica (para o Claude)
- **Renderizar:**
  ```
  cd mecanismo && npx remotion render <Id> out/<arquivo>.mp4 --crf=22
  ```
  - Na nuvem, acrescentar `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- **Prévias:** `COMP=<Id> node scripts/stills.mjs <frames>`.
- **Tempo:** frames = segundos × 30. Cada vídeo tem:
  - um objeto `T` com o frame de cada palavra-chave;
  - um array `PARTES` com as cenas;
  - `SFX` com os efeitos sonoros.
- **Narração do ElevenLabs:**
  - `creative_generate_speech` (eleven_v4, voz Juliana).
  - Depois `creative_transcribe_audio` (scribe) para pegar o tempo de cada palavra.
- **Narração enviada por mim:** quando não der para transcrever, gerar a mesma fala com a Juliana e alinhar as duas por DTW (MFCC).
  - Conferir o resultado com as pausas encontradas pelo `silencedetect` do ffmpeg.
- **Encurtar pausas:** cortar cada silêncio para 0,32 s e depois aplicar `atempo` do ffmpeg até caber em 3 min.
- **Arquivos fora do GitHub:** a pasta `out/` (MP4s) está no `.gitignore`.

## Série "Lei 8.080 para concursos" (YouTube, vídeo LONGO horizontal)
- Formato: 1920×1080, 7 a 15 min. Estrutura: mapa da lei → lei seca "digitada" com grifos no tempo da fala → explicação → pegadinha (carimbo ERRADO com tremida) → questões inéditas com 5 s de "pause e responda" → resumo → "Me siga para mais dicas sobre leis" → "Bons estudos!".
- Mesmo canal da farmacologia. Plano da série e roteiros: `concurso_lei8080/` (plano_serie.md, roteiro_ep01.md, narracao_ep01.txt).
- Código: `mecanismo/src/lei8080/Video.tsx` (Id `Lei8080Ep1`) e `Capa.tsx` (Id `Lei8080Ep1Capa`, capa 1280×720 em `youtube/capas/`). Textos: `youtube/textos/lei8080.md`.
- Tempos: em SEGUNDOS da narração original; `fr()` soma as pausas de 5 s (lista `CORTES`). A narração com pausas é gerada por ffmpeg (`public/lei8080/narracao.mp3`).
- Transcrição local: faster-whisper (modelo small), lendo o áudio convertido pelo ffmpeg para 16 kHz (o PyAV do Python 3.14 falha).
- Episódio 1 (Arts. 1º ao 4º): FINALIZADO. Próximo: Ep. 2, Arts. 5º e 6º (conferir na internet as Leis 15.390/2026 e 15.471/2026 antes).
- Ideias aprovadas para depois: linha do tempo das alterações da lei; Shorts verticais de 30 s com cada pegadinha, levando para a aula completa.

## VoiceStudio (voz local, testado em 2026-10-20/21)
- Instalado (v0.5.6), driver NVIDIA atualizado para 617.42 (GTX 1650, 4 GB). API local em http://127.0.0.1:3900 (`POST /generate`, campos `text`, `language=Portuguese`, `instruct="female, young adult, moderate pitch"`, `seed=42`).
- Resultado: pronúncia boa na maior parte, mas com tropeços (~2 por minuto). Gera ~7 min por minuto de áudio. Por enquanto NÃO usar para vídeos publicados; a usuária decidiu não seguir com nenhuma opção.
- Existe um perfil "Juliana" (clone) no VoiceStudio: não usar (voz do ElevenLabs licenciada só lá).
- Texto da Lei 8.080 pronto para audiolivro, em 16 partes: `concurso_lei8080/audiolivro/*.txt` (~64 min). Amostra: `audiolivro/audio/01_titulo_i_amostra.mp3`.
- Microfone interno estava mudo (captava -91 dB); provável tecla F4 de mudo do Lenovo.
