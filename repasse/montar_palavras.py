# Junta as transcrições (corpo + exemplo da cidade + frase final) em words.js,
# com os mesmos cortes/pausas usados para montar narracao.mp3, e escreve os números com algarismos.
import json
CORTE, PAUSA, CONTA, CORPO, FIM_PAUSA = 58.44, 0.35, 29.231, 109.4008, 0.6
ler = lambda f: [{'w': x['text'], 's': x['start'], 'e': x['end']} for x in json.load(open(f))['words'] if x['type'] == 'word']
desl = lambda ws, d: [{'w': w['w'], 's': round(w['s'] + d, 3), 'e': round(w['e'] + d, 3)} for w in ws]
corpo, conta = ler('words_raw.json'), ler('words_conta.json')
extra = CONTA + 2 * PAUSA
fim = [("Consulte", 0, 0.507), ("um", 0.533, 0.56), ("profissional", 0.68, 1.12), ("de", 1.2, 1.28), ("saúde", 1.36, 1.84), ("para", 1.92, 2), ("orientações.", 2.08, 3.2)]
ws = [w for w in corpo if w['s'] < CORTE] + desl(conta, CORTE + PAUSA) + desl([w for w in corpo if w['s'] >= CORTE], extra) \
   + desl([{'w': a, 's': b, 'e': c} for a, b, c in fim], CORPO + extra + FIM_PAUSA)
merges = [("oito mil e oitenta", "8.080"), ("e oito mil cento e quarenta e dois,", "e 8.142,"), ("mil novecentos e noventa,", "1990,"),
  ("dois mil e vinte e seis,", "2026,"), ("oito reais e vinte centavos", "R$ 8,20"), ("nove reais e cinco centavos", "R$ 9,05"),
  ("três reais e um centavo", "R$ 3,01"), ("cento e quarenta e um,", "141,"), ("dois mil e doze,", "2012,"), ("quinze por cento", "15%"), ("doze por cento.", "12%."),
  ("cinquenta mil", "50 MIL"), ("quatrocentos e dez mil reais", "R$ 410 MIL"), ("cento e cinquenta mil e quinhentos reais,", "R$ 150.500,"),
  ("cento e cinquenta mil e quinhentos.", "R$ 150.500."), ("setecentos e onze mil reais", "R$ 711 MIL"), ("cinquenta e nove mil reais", "R$ 59 MIL")]
out, i = [], 0
while i < len(ws):
  for src, dst in merges:
    p = src.split()
    if [w['w'].lower() for w in ws[i:i + len(p)]] == p:
      if dst.startswith('e '):  # mantém o "e" separado
        out += [ws[i], {'w': dst[2:], 's': ws[i + 1]['s'], 'e': ws[i + len(p) - 1]['e']}]
      else:
        out.append({'w': dst, 's': ws[i]['s'], 'e': ws[i + len(p) - 1]['e']})
      i += len(p); break
  else:
    out.append(ws[i]); i += 1
open('words.js', 'w').write('window.WORDS=' + json.dumps(out, ensure_ascii=False) + ';\n')
print(' '.join(w['w'] for w in out[150:240]))
print(out[-7])
