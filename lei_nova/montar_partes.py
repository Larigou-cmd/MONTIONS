# Monta os blocos de tela das Partes 2 (art. 21) e 3 (arts. 22 a 27) da RDC 1.000/2025, a partir do texto oficial do DOU.
# Cada "unidade" é uma tela: um artigo da RDC (kind "rdc") ou um "novo texto" de artigo da norma alterada (kind "novo").
# Linhas só de pontos (dispositivo não alterado) não vão para a tela, como na narração.
# Uso: python montar_partes.py 2   ou   python montar_partes.py 3   → parteN/blocos.json
import json, re, sys, os
P = int(sys.argv[1])
L = [l.strip() for l in open('rdc_oficial.txt', encoding='utf-8').read().split('\n')]
ini = next(i for i, l in enumerate(L) if l.startswith('Art. 21.' if P == 2 else 'Art. 22.'))
fim = next(i for i, l in enumerate(L) if l.startswith('Art. 22.' if P == 2 else 'Art. 27.')) + (0 if P == 2 else 1)
linhas = L[ini:fim]

NORMA = {21: 'Portaria SVS/MS nº 344/1998', 22: 'Portaria SVS/MS nº 6/1999', 23: 'RDC nº 58/2007', 24: 'RDC nº 11/2011'}
CTX_RDC = {21: 'altera a Portaria 344/1998', 22: 'altera a Portaria 6/1999', 23: 'altera a RDC 58/2007', 24: 'altera a RDC 11/2011',
           25: 'revogações', 26: 'infração sanitária', 27: 'vigência'}
if P == 2:
    abertura = [('parte', 'Parte 2 · Artigo 21'), ('sub', 'Mudanças na Portaria SVS/MS nº 344/1998'),
                ('aviso', 'Quando aparecer "Novo texto do artigo", é a nova redação de um artigo da Portaria 344, e não um artigo desta RDC.')]
else:
    abertura = [('parte', 'Parte 3 · Artigos 22 a 27'), ('sub', 'Mudanças na Portaria nº 6/1999 e em outras resoluções, revogações e vigência'),
                ('aviso', 'Quando aparecer "Novo texto do artigo", é a nova redação de um artigo da norma alterada.')]
blocos = [{'t': 'titulo', 'u': -1, 's': 'Resolução da Diretoria Colegiada da Anvisa - RDC nº 1.000, de 11 de dezembro de 2025'}]
blocos += [{'t': t, 'u': -1, 's': s} for t, s in abertura]
unid = []

def limpa(s):
    s = s.replace('(NR)', '').replace('“', '"').replace('”', '"')
    s = re.sub(r'\.{4,}', '', s).strip()
    s = s.strip('"').strip()
    s = re.sub(r'^"|"$', '', s).strip()
    s = s.rstrip('"').strip()
    return re.sub(r'\s+', ' ', s)
so_pontos = lambda s: limpa(s) in ('', '.', '"', '".')

norma = None; ali = None
for raw in linhas:
    if not raw: continue
    m = re.match(r'^Art\. (2\d)\. (.*)', raw)
    if m:                                     # artigo da própria RDC
        a = int(m.group(1)); norma = NORMA.get(a, norma)
        unid.append({'lab': f'Art. {a}', 'kind': 'rdc', 'ctx': CTX_RDC[a], 'a': a})
        blocos.append({'t': 'caput', 'u': len(unid) - 1, 's': limpa(m.group(2))}); continue
    s = raw.lstrip('"').strip()
    m = re.match(r'^(4\.1\.1\.\d)\. (.*)', s)
    if m:                                     # título de seção da Portaria 6
        unid.append({'lab': m.group(1), 'kind': 'novo', 'ctx': norma})
        blocos.append({'t': 'secao', 'u': len(unid) - 1, 's': limpa(m.group(2)).rstrip('"').strip()}); continue
    m = re.match(r'^Art\. ?(\d+(?:-[A-Z])?)º?\.? ?(.*)', s)
    if m:                                     # novo texto de artigo da norma alterada
        unid.append({'lab': f'Art. {m.group(1)}', 'kind': 'novo', 'ctx': norma}); ali = None
        corpo = m.group(2)
        if so_pontos(corpo): blocos.append({'t': 'mant', 'u': len(unid) - 1, 's': '(caput mantido como está)'})
        else: blocos.append({'t': 'caput', 'u': len(unid) - 1, 's': limpa(corpo)})
        continue
    u = len(unid) - 1
    m = re.match(r'^([a-m])\) ?(.*)', s)
    if m:
        ali = m.group(1)
        if not so_pontos(m.group(2)): blocos.append({'t': 'inc', 'u': u, 'tag': f'{ali})', 's': limpa(m.group(2))})
        continue
    m = re.match(r'^(\d)\. (.*)', s)
    if m:
        if not so_pontos(m.group(2)): blocos.append({'t': 'inc', 'u': u, 'tag': f'{ali}) {m.group(1)}.', 's': limpa(m.group(2)).lstrip('- ').strip()})
        continue
    m = re.match(r'^§ ?(\d+)º\.?( - A\.)? ?(.*)', s)
    if m:
        if not so_pontos(m.group(3)): blocos.append({'t': 'par', 'u': u, 'tag': f'§ {m.group(1)}º' + ('-A' if m.group(2) else ''), 's': limpa(m.group(3))})
        continue
    m = re.match(r'^Parágrafo único\. (.*)', s)
    if m: blocos.append({'t': 'par', 'u': u, 'tag': 'Parágrafo único', 's': limpa(m.group(1))}); continue
    m = re.match(r'^([IVX]+) ?- (.*)', s)
    if m: blocos.append({'t': 'inc', 'u': u, 'tag': m.group(1), 's': limpa(m.group(2))}); continue
    if so_pontos(s): continue
    raise SystemExit('linha não reconhecida: ' + raw[:80])

# destaques (trechos exatos do texto oficial)
HL = {
 2: {'Art. 34-B': ['entrega remota'], 'Art. 35': ['acompanhado de receita'], 'Art. 36': ['CPF', 'passaporte'], 'Art. 37': ['uso indevido'],
     'Art. 40': ['de cor amarela', 'assinatura reconhecida em cartório', 'formato eletrônico', 'por meio eletrônico'], 'Art. 42': ['encaminhadas em meio eletrônico'],
     'Art. 45': ['de cor azul', '30 (trinta) dias'], 'Art. 50': ['emitido e assinado em meio eletrônico'], 'Art. 55': ['CPF', 'não se aplica'],
     'Art. 72': ['encaminhadas em meio eletrônico']},
 3: {'Art. 69': ['por meio eletrônico', 'comprovante gerado pelo SNCR'], 'Art. 70': ['portador autorizado', 'comprovante gerado pelo SNCR'],
     'Art. 71': ['diretor clínico'], 'Art. 75': ['por meio eletrônico'], 'Art. 77': ['dispensando o comparecimento presencial'],
     'Art. 80': ['comprovante gerado pelo SNCR'], 'Art. 82': ['dispensando anotação manual'], 'Art. 84': ['2 (duas) vias', '"C1"', '"C5"'],
     'Art. 85': ['CPF'], 'Art. 107': ['encaminhadas em meio eletrônico'], 'Art. 1º': ['"B2"', 'encaminhadas em meio eletrônico'],
     'Art. 20': ['emitido e assinado em meio eletrônico'], 'Art. 21': ['RDC nº 1.000'], 'Art. 22': ['dispensando anotação manual'],
     'Art. 23': ['na cor branca', 'SNCR'], 'Art. 26': ['uso indevido', 'infração sanitária'], 'Art. 27': ['60 dias após a data da sua publicação'],
     'Art. 25': ['Ficam revogados']},
}[P]
for b in blocos:
    if b['u'] >= 0:
        un = unid[b['u']]; key = un['lab'] if not (un['kind'] == 'novo' and un['lab'] == 'Art. 1') else 'Art. 1º'
        b['hl'] = [f for f in HL.get(key, []) if f in b['s']]
# os rótulos "Art. 1" da RDC 58 aparecem como "Art. 1º"
for un in unid:
    n = re.match(r'Art\. (\d+)$', un['lab'])
    if n and int(n.group(1)) < 10: un['lab'] += 'º'
os.makedirs(f'parte{P}', exist_ok=True)
json.dump({'blocos': blocos, 'unid': unid}, open(f'parte{P}/blocos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for b in blocos:
    lab = unid[b['u']]['lab'] if b['u'] >= 0 else ''
    print(f"{b['t']:6} {lab:9} {b.get('tag',''):16} {b['s'][:90]}")
print(len(unid), 'telas')
