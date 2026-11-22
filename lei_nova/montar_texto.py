# Monta o texto consolidado (RDC 1.000/2025 + RDC 1.028/2026 + RDC 1.046/2026), artigos 1 a 20, em blocos para a tela.
import json, re
src = open('rdc_art1a20.txt', encoding='utf-8').read()
lines = [l.strip() for l in src.split('\n') if l.strip()]
# o arquivo começa no Art. 1º; o Capítulo I vem antes
blocos = [{'t': 'titulo', 's': 'Resolução da Diretoria Colegiada - RDC nº 1.000, de 11 de dezembro de 2025'},
          {'t': 'ementa', 's': 'Dispõe sobre os requisitos de controle para Notificações de Receita, Receitas de Controle Especial e Receitas sujeitas à retenção emitidas em meio eletrônico.'},
          {'t': 'parte', 's': 'Parte 1 · Artigos 1 a 20'},
          {'t': 'cap', 's': 'Capítulo I · Disposições Gerais'}]
art = None; i = 0
while i < len(lines):
    l = lines[i]
    if l.startswith('CAPÍTULO'):
        ws = lines[i + 1].lower().split(); nome = ' '.join(w if (k and w in ('de', 'da', 'do', 'das', 'dos')) else w.capitalize() for k, w in enumerate(ws))
        blocos.append({'t': 'cap', 's': f"Capítulo {l.split()[1]} · {nome}"}); i += 2; continue
    m = re.match(r'Art\. (\d+)º?\.? ?(.*)', l)
    if m:
        art = int(m.group(1)); blocos.append({'t': 'caput', 'a': art, 's': l}); i += 1; continue
    if re.match(r'^[IVX]+ - ', l): blocos.append({'t': 'inc', 'a': art, 's': l})
    elif l.startswith('§') or l.startswith('Parágrafo único'): blocos.append({'t': 'par', 'a': art, 's': l})
    else: blocos[-1]['s'] += ' ' + l
    i += 1
# alterações de 2026
for b in blocos:
    if b.get('a') == 16 and b['t'] == 'caput':
        b['s'] = b['s'].replace('até 1º de junho de 2026.', 'até 30 de setembro de 2026.')
        assert '30 de setembro' in b['s']
k = next(j for j, b in enumerate(blocos) if b.get('a') == 16)
blocos.insert(k + 1, {'t': 'nota', 'a': 16, 's': '(Redação dada pela RDC nº 1.028, de 1º de junho de 2026)'})
k = next(j for j, b in enumerate(blocos) if b.get('a') == 18)
blocos[k]['s'] = 'Art. 18. As Receitas de Controle Especial e as Receitas sujeitas à retenção poderão ser emitidas eletronicamente sem a numeração do SNCR até 3 de março de 2027.'
blocos[k + 1:k + 1] = [
  {'t': 'nota', 'a': 18, 's': '(Redação dada pela RDC nº 1.046, de 29 de outubro de 2026)'},
  {'t': 'par', 'a': 18, 's': '§ 1º Os receituários emitidos nos termos do caput poderão ser aceitos pelos estabelecimentos dispensadores durante o respectivo prazo de validade, observadas as disposições da Portaria SVS/MS nº 344, de 12 de maio de 1998, da RDC nº 471, de 23 de fevereiro de 2021, ou de normas que vierem a substituí-las.'},
  {'t': 'nota', 'a': 18, 's': '(Incluído pela RDC nº 1.046, de 29 de outubro de 2026)'},
  {'t': 'par', 'a': 18, 's': '§ 2º A partir de 4 de março de 2027, as Receitas de Controle Especial e as Receitas sujeitas à retenção emitidas em meio eletrônico deverão conter, obrigatoriamente, a numeração fornecida pelo SNCR.'},
  {'t': 'nota', 'a': 18, 's': '(Incluído pela RDC nº 1.046, de 29 de outubro de 2026)'}]
# o Art. 14 termina com vírgula no DOU; o 20 vem cortado no arquivo: completar pelo texto oficial
for b in blocos:
    if b.get('a') == 14 and b['t'] == 'caput': b['s'] = b['s'].rstrip(',') + '.'
json.dump(blocos, open('blocos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for b in blocos: print(b['t'], b.get('a', ''), b['s'][:110])
