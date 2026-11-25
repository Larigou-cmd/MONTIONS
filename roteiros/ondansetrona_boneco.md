# Para que serve a ondansetrona? (boneco de palito, estilo quadrinho)

Formato: curto vertical, ~60 s. Narração gravada por ela no ElevenLabs depois (os clipes saem sem a voz; o som que o Flow gera é tirado na montagem).
Visual aprovado em 25/11/2026: Flow, Omni 1.2 Flash, 720p, 10 s, 9:16, modo Elementos, com `ref_pixverse.jpg` incluída no comando como referência de estilo (já está no projeto do Flow "nov. 02 - 21:57").
Custo: 30 créditos do Flow por clipe. Saldo em 25/11: 840.

## Gancho escolhido (1)
"Esse remédio não acalma o seu estômago. Ele desliga o alarme do enjoo."
Outras opções: (2) "Tomou ondansetrona e o intestino travou? Tem explicação." (3) "A ondansetrona foi feita para quem faz quimioterapia. Sabe por quê?"

## Narração (para gravar no ElevenLabs, ~140 palavras, ~60 s)
Esse remédio não acalma o seu estômago. Ele desliga o alarme do enjoo. É a ondansetrona.
Quando algo irrita o seu intestino, ele solta serotonina. A serotonina avisa o cérebro, e o cérebro manda vomitar.
A ondansetrona bloqueia esse aviso, no intestino e no cérebro.
Por isso ela nasceu para quem faz quimioterapia e radioterapia, e também é usada antes e depois de cirurgia.
Só que esse bloqueio tem um preço. A serotonina também ajuda o intestino a andar. Por isso a ondansetrona pode prender o intestino e dar dor de cabeça.
E tem dois cuidados que pouca gente conhece. Ela pode mexer no ritmo do coração: avise o médico se você tem arritmia ou toma remédio para o coração. E na gravidez, só com orientação médica.
Ela é vendida com receita. Salva para quando alguém da sua casa precisar.

(Telas do Remotion no fim, sem clipe: "Me siga para mais dicas de farmacologia e curiosidades sobre a área" com o logo, e "Consulte um profissional de saúde para orientações.")

## Cenas e prompts do Flow
Todo prompt vai com a imagem `ref_pixverse.jpg` incluída. Começo fixo de todo prompt:
"Use the reference image only as the visual style guide: the same comic illustration style with thick black ink outlines, flat colors with soft shading, grungy beige-gray painted background. Vertical 9:16, no text, no letters."
Fim fixo: "Each character has exactly two arms and two hands. No brand names, no blood, no vomit."

| # | Fala | Rótulo lilás (Remotion) | Clipe |
|---|---|---|---|
| 1 | Esse remédio não acalma o seu estômago. Ele desliga o alarme do enjoo. | alarme do enjoo | novo |
| 2 | É a ondansetrona. | ONDANSETRONA | já existe (teste da farmácia) |
| 3 | Quando algo irrita o seu intestino... o cérebro manda vomitar. | serotonina = mensageira | novo |
| 4 | A ondansetrona bloqueia esse aviso, no intestino e no cérebro. | bloqueia o aviso | novo |
| 5 | Por isso ela nasceu para quem faz quimioterapia... cirurgia. | quimio · rádio · cirurgia | novo |
| 6 | Só que esse bloqueio tem um preço... dor de cabeça. | intestino preso · dor de cabeça | novo |
| 7 | E tem dois cuidados... coração... gravidez, só com orientação médica. | coração · gravidez | novo |
| 8 | Ela é vendida com receita. Salva para quando... precisar. | com receita | novo |

Prompt 1 (gancho): Close shot, slow push in. A cartoon stomach character with two dot eyes sits inside a simple body outline, a big red alarm siren on top of it flashes and rings, wavy lilac purple nausea lines pulse around it. A small round white pill character with tiny arms and legs walks in, climbs up and presses a big switch on the siren; the siren turns off, the lilac waves fade and the stomach smiles relieved.

Prompt 3 (serotonina): Inside-the-body cut-away view, slow pan upward. A simple pink cartoon intestine at the bottom gets irritated (little red zigzag lines) and releases many tiny glowing lilac messenger dots. The lilac dots run up a long nerve drawn as a cable to a cartoon brain at the top of the frame; the brain frowns and slams a big red button. Simple, clear, no gore.

Prompt 4 (bloqueio): Inside-the-body split view, static camera: the same cartoon intestine at the bottom and the same cartoon brain at the top, each with small lilac round doors (receptors). Small round white pill characters with tiny arms run to each lilac door and close it with a padlock. The tiny lilac messenger dots bounce off the locked doors and fade away; the brain relaxes and smiles.

Prompt 5 (quimio e cirurgia): Medium shot, slow pan from left to right across a calm hospital room. On the left, a bald adult patient sits in a reclining treatment chair with an IV drip bag on a stand (seen from a distance, no needle close-up), calm and smiling. On the right, another adult patient lies in a hospital bed after surgery, resting peacefully. Behind them, the pharmacist with brown skin, curly hair in a high ponytail and a white lab coat with a neon green badge gives a thumbs up.

Prompt 6 (efeitos): Medium shot, static camera, a simple bathroom at home. The man in a gray t-shirt and dark jeans from the reference sits on a closed toilet lid looking bored and stuck, a small cartoon clock on the wall spins fast; then he stands up and holds his forehead with one hand, little pain dash lines around his head. Inset bubble: a tiny conveyor belt inside a cartoon intestine slows down and stops.

Prompt 7 (cuidados): Medium shot, slow push in, a doctor's office. The pharmacist with brown skin, curly hair in a high ponytail and a white lab coat with a neon green badge stands next to a big cartoon heart drawing on the wall whose heartbeat line goes irregular and turns red with a warning triangle. Then a pregnant woman with a round belly sits in a chair and talks calmly with the pharmacist, who nods and listens with a caring smile.

Prompt 8 (receita): Medium shot, slow push in, the same pharmacy counter as the reference. The man in a gray t-shirt and dark jeans holds up a white prescription paper with both hands; the pharmacist behind the counter with brown skin, curly hair in a high ponytail and a white lab coat with a neon green badge looks at the paper, nods and smiles. A small blank white medicine box with no writing sits on the counter. The pharmacist never touches the paper.

## Checagem (fontes)
- Usos aprovados pela Anvisa: náusea e vômito de quimioterapia e radioterapia; prevenção e tratamento de náusea e vômito pós-operatórios (nota técnica do Ministério da Saúde).
- Mecanismo: antagonista seletivo dos receptores 5-HT3 de serotonina (bula Blau).
- Reações muito comuns (>1/10): cefaleia e constipação (bula de comprimido; conferir na bula oficial antes do vídeo final).
- Intervalo QT: a bula traz estudo de QT e cuidado maior em idosos e em quem tem risco de arritmia.
- Gravidez: risco pequeno de fenda oral no 1º trimestre (MHRA, Reino Unido; Medsafe), ~3 casos a mais por 10 mil (NICHD).

Fontes:
- https://www.gov.br/saude/pt-br/composicao/conjur/demandas-judiciais/notas-tecnicas/notas-tecnicas-medicamentos/o/ondansetrona.pdf
- https://www.blau.com/media/leaflet/725825fe-47bd-423f-b6d6-05eef6650b25-d9ce9dd6-2dd7-443f-b534-b9816404dc27/Bula_O_lLDlib8.pdf
- https://fresenius-kabi.com/br/documents/2.Bula_Profissional_de_sa%C3%BAde_cl.ondansetrona.pdf
- https://www.gov.uk/drug-safety-update/ondansetron-small-increased-risk-of-oral-clefts-following-use-in-the-first-12-weeks-of-pregnancy
- https://www.nichd.nih.gov/newsroom/news/122018-anti-nausea
