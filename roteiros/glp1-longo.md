# Roteiro de narração — GLP-1 (2min24)

Tempos retirados de `src/Video.tsx`. O ritmo previsto é de ~140 palavras por minuto,
que é a velocidade confortável para conteúdo didático em português.

A narração **não repete** o texto da tela: ela conduz e conecta, enquanto a tela
mostra os termos técnicos e os números. Ler em voz alta exatamente o que está escrito
deixa o vídeo redundante.

---

## 1 · Abertura — 0:00 a 0:08 (19 palavras)

> Dois medicamentos dominam hoje o tratamento da obesidade e do diabetes tipo dois.
> Eles não funcionam do mesmo jeito.

---

## 2 · O hormônio natural — 0:08 a 0:23 (33 palavras)

> Tudo começa no intestino. Depois que você come, as células L liberam GLP um.
> É uma incretina: um hormônio que avisa o corpo de que o alimento chegou,
> antes mesmo de a glicose subir.

---

## 3 · As quatro ações — 0:23 a 0:49 (50 palavras)

> E esse aviso age em quatro frentes ao mesmo tempo.
> No pâncreas, estimula a insulina — mas só quando a glicemia está alta,
> e é por isso que o risco de hipoglicemia é baixo.
> Ainda no pâncreas, reduz o glucagon.
> No estômago, retarda o esvaziamento.
> E no cérebro, aumenta a saciedade.

Pausa de ~1s entre as quatro frentes: a tela acende um órgão por vez.

---

## 4 · O problema — 0:49 a 1:02 (25 palavras)

> Só que existe um problema. A enzima DPP quatro degrada o GLP um em cerca de dois minutos.
> Injetar o hormônio natural não serviria de nada.

---

## 5 · A engenharia — 1:02 a 1:20 (43 palavras)

> A solução foi reprojetar a molécula. Primeiro, trocar um aminoácido na posição oito,
> para a enzima não reconhecer mais o ponto de corte.
> Depois, acrescentar uma cauda de ácido graxo que se prende à albumina do sangue.
> De dois minutos para uma semana.

A última frase é o ponto alto da cena — vale desacelerar nela.

---

## 6 · Semaglutida — 1:20 a 1:34 (27 palavras)

> A semaglutida nasceu assim. É um análogo do GLP um humano e ativa um único receptor:
> o de GLP um. Meia-vida de cerca de sete dias, aplicação semanal.

---

## 7 · Tirzepatida — 1:34 a 1:52 (36 palavras)

> A tirzepatida mudou a lógica. Ela foi construída sobre o GIP, a outra incretina,
> e ativa os dois receptores. Isso soma um segundo estímulo à insulina
> e acrescenta uma ação no tecido adiposo, melhorando a sensibilidade.

"E ativa os dois receptores" cai junto com o segundo receptor acendendo na tela.
Se der para sincronizar uma coisa só no vídeo inteiro, sincronize esta.

---

## 8 · Comparação — 1:52 a 2:14 (50 palavras)

> E isso aparece no resultado. No SURMOUNT cinco, que comparou os dois diretamente,
> a semaglutida levou a uma perda média de treze vírgula sete por cento do peso
> em setenta e duas semanas. A tirzepatida, vinte vírgula dois.
> Quase metade dos pacientes em uso de tirzepatida perdeu vinte por cento ou mais.

---

## 9 · Fecho — 2:14 a 2:24 (18 palavras)

> Dois caminhos diferentes para o mesmo sistema.
> Lembrando: a escolha é individual e depende de avaliação clínica.

---

## Se for gravar com a sua voz

- Grave em ambiente sem eco (um armário de roupas funciona surpreendentemente bem).
- Grave **cena a cena**, em arquivos separados, nomeados `01.wav`, `02.wav` e assim por
  diante. É muito mais fácil refazer uma cena do que o vídeo inteiro.
- Não force o tempo: se uma cena ficar mais longa, a duração dela é ajustada no array
  `roteiro` de `src/Video.tsx` e todas as cenas seguintes se reposicionam sozinhas.
- Formato ideal: WAV, 48 kHz. MP3 também serve.

## Se for por síntese de voz

Os números e siglas acima **já estão escritos como se fala** (GLP um, DPP quatro,
treze vírgula sete por cento), porque sintetizador lê "GLP-1" como "GLP menos um"
e "13,7%" de formas imprevisíveis. É só copiar e colar bloco a bloco.

Gerar **um arquivo por cena** vale igualmente aqui: facilita o encaixe e permite
refazer um trecho isolado.
