# Prompt: quadro "Notícias da Farmácia"

> Quando sair uma notícia nova, cole este arquivo numa conversa com o Claude e escreva embaixo:
> **"Notícias da Farmácia #N: [link ou texto da notícia]"**.
> Se você já tiver gravado a narração no ElevenLabs, anexe o MP3 junto.

---

## O que o Claude deve fazer, nesta ordem

1. **Conferir a notícia** em fontes confiáveis: Anvisa, Diário Oficial, Agência Brasil, Ministério da Saúde e jornais grandes. Anotar data, produto, lote, quem identificou, o que foi determinado e as orientações. Separar o que é **fato oficial** do que é **suspeita**, e nunca inventar dados. Citar as fontes.
2. **Escrever o roteiro** no formato abaixo, com cerca de 1 min a 1 min 20 s (máximo 3 min). Mandar para aprovação.
3. **Narração:**
   - Se a Larissa mandar o MP3, usar o dela e transcrever no ElevenLabs Scribe para pegar o tempo de cada palavra.
   - Se não mandar, gerar com a **Juliana** (`voice_id nczLZ6GvJGozyc3FlLte`, modelo `eleven_v4`) em **tom de repórter**, com as etiquetas `[confident]`, `[serious]` e `[warmly]` (veja abaixo).
4. **Montar o vídeo** no estilo explicadora, usando como modelo `mecanismo/src/noticiaBotox/Explicadora.tsx`. Copiar para `src/noticiaXxx/` e trocar só o conteúdo.
5. **Prévias:** mandar as fotos das cenas e um vídeo de prévia sem áudio (`--muted --scale=0.5`). **Esperar a Larissa dizer "aprovado".**
6. **Renderizar o final** com áudio, fazer a **capa** e escrever a **legenda do TikTok** e o **título e a descrição do YouTube**, com o link da matéria.

---

## Formato do roteiro (estrutura fixa)

| Cena | O que diz | O que aparece |
|---|---|---|
| 1. Vinheta | "Notícias da Farmácia. Hoje: [manchete em 1 frase]." | "■ PLANTÃO", título pixel "NOTÍCIAS DA **FARMÁCIA**", janelinha do órgão (ex.: "anvisa · alerta") com carimbo |
| 2. O que aconteceu | Onde saiu (Diário Oficial ou site da Anvisa), produto, lote, quem deu o alerta | Janelinha "diário oficial · data", com o lote em destaque amarelo e o carimbo "APREENSÃO" ou "SUSPENSÃO" |
| 3. Como identificar | Os detalhes que diferenciam o original do falso ou do irregular | Janelinha "original × falso" em tabela (✓ verde × ✕ vermelho) |
| 4. Por que preocupa | O risco, com dado real e fonte (ex.: um caso documentado) | Janelinha com ícones dos sintomas ou riscos |
| 5. O que fazer antes | 2 ou 3 cuidados práticos | Janelinha "checklist.txt" com ✅ |
| 6. Sinal de alerta | Quando procurar atendimento | Janelinha "sinais de alerta" com o botão vermelho "EMERGÊNCIA!" |
| 7. Tranquilizar | O que NÃO foi afetado (outros lotes, outras marcas) | Janelinha "status" com ✓ OK × ✕ proibido |
| 8. Me siga | "Me siga para mais notícias e dicas de farmacologia." | "ME SIGA" em azul |
| 9. Tela final | (sem fala) | "Consulte um profissional de saúde para orientações." |

Regras do texto:
- frases curtas e diretas, como repórter;
- números escritos por extenso na narração quando ajudar ("lote zero dois cinco um cinco cinco");
- não citar livros;
- produto com marca só no texto da notícia, e os **desenhos sempre genéricos, sem marca**.

---

## Visual (estilo explicadora: já pronto no código)

- **Fundo claro quadriculado.** Títulos na fonte pixel (Press Start 2P) com **uma palavra colorida**: vermelho para alerta, azul para fonte oficial, laranja para "como", verde para "o que fazer".
- **Acentos nas maiúsculas:** a fonte pixel não tem maiúsculas acentuadas, então usar o componente `Pixelado`, que desenha o acento em pixels.
- **Janelinhas de computador:** borda preta, sombra dura, três quadradinhos coloridos e título na fonte VT323.
- **Legenda palavra por palavra:** a palavra falada fica destacada em amarelo. Ela é gerada sozinha a partir do JSON de palavras da transcrição.
- **A repórter:** a farmacêutica pixel de jaleco e microfone (`public/noticias/reporter_recorte.png`, componente `src/noticias/Reporter.tsx`) fica no **canto de baixo à direita** durante todo o vídeo, com a boca sincronizada com a voz:
  ```
  python3 scripts/boca.py <narracao.mp3> src/noticiaXxx/boca.json
  ```
- **Trilha:** música calma bem baixa (volume 0.07), gerada com `python3 scripts/musica_calma.py <segundos> <saida.wav>`, e efeitos (whoosh na troca de cena; pop, trava e plim nos destaques).

### Capa
- Mesmo fundo quadriculado.
- Faixa vermelha no topo: "■ NOTÍCIAS DA FARMÁCIA #N".
- Título pixel em 2 linhas, por exemplo: "BOTOX" / "**FALSIFICADO**".
- Janelinha com desenho genérico e carimbo do lote.
- A repórter à direita.
- Uma frase curta embaixo, por exemplo: "como identificar e se proteger".
- **Deixar os 20% de baixo livres**, porque o TikTok cobre essa faixa com o contador.

---

## Voz de repórter (para gravar no ElevenLabs)

- **Modelo:** Eleven v4. **Voz:** Juliana.
- **Etiquetas no texto** (valem até a próxima):
  - `[confident] [news anchor tone]` no começo;
  - `[serious]` na parte do risco;
  - `[warmly]` no fechamento.
- **Ajustes:** Stability 60–70%, Speed 1.0–1.05, Style baixo.
- **Ênfase:** MAIÚSCULAS em poucas palavras ("lote FALSIFICADO", "NA HORA").

---

## Textos de postagem (modelo)

**TikTok:**
> 🚨 NOTÍCIAS DA FARMÁCIA #N: [manchete curta]. Veja [o que a pessoa aprende] 👇 Manda pra quem [público]!
> 📰 Fonte: [veículo / órgão] ([data])
> ⚠️ Conteúdo educativo. Não substitui orientação médica ou farmacêutica.
> #[produto] #anvisa #noticiasdafarmacia #farmacia #estudantedefarmacia
>
> Marcar **"Conteúdo gerado por IA"**.

**YouTube Shorts:**
- **Título:** 🚨 [MANCHETE EM CAIXA ALTA]: [complemento] | Notícias da Farmácia #N #shorts
- **Descrição:** resumo do fato, data, lote, como identificar, o que fazer, o que não foi afetado e **📰 Matéria: [link]**. Depois a frase "⚠️ Conteúdo educativo… Narração gerada com voz sintética." e as hashtags.
- Marcar **"conteúdo alterado ou sintético: Sim"**.

Dica: postar **no mesmo dia** da notícia e fixar um comentário com uma pergunta ("Você confere o lote antes de aplicar?").

---

## Episódios já feitos
| # | Notícia | Arquivos |
|---|---|---|
| 1 | Anvisa manda apreender o lote 025155 do Dysport falsificado (19/10/2026) | `mecanismo/src/noticiaBotox/` (versão escura `Video.tsx` e versão explicadora `Explicadora.tsx`), vídeo `out/noticias_farmacia_01_botox.mp4`, capa `youtube/capas/capa_noticias_01_botox.png` |
