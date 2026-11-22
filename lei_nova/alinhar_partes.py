# Tempo (quadro a 30 fps) de cada palavra do texto oficial das Partes 2 e 3, alinhando com a transcrição da narração.
# Uso: python alinhar_partes.py 2  → parte2/dados.js (BLOCOS, UNID, PALAVRAS)
import json, re, sys, unicodedata, difflib
P = sys.argv[1]
D = json.load(open(f'parte{P}/blocos.json', encoding='utf-8')); B = D['blocos']
W = json.load(open(f'parte{P}/palavras_brutas.json', encoding='utf-8'))
def nz(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', w)
toks = []
for bi, b in enumerate(B):
    for w in b['s'].split(): toks.append({'b': bi, 'w': w, 'n': nz(w)})
a = [t['n'] for t in toks]; c = [nz(w['w']) for w in W]
sm = difflib.SequenceMatcher(None, a, c, autojunk=False)
for blk in sm.get_matching_blocks():
    for k in range(blk.size): toks[blk.a + k]['f'] = round(W[blk.b + k]['s'] * 30)
idx = [i for i, t in enumerate(toks) if 'f' in t]
print('casadas', len(idx), 'de', len(toks))
for i, t in enumerate(toks):
    if 'f' in t: continue
    j = max([k for k in idx if k < i], default=None); k2 = min([k for k in idx if k > i], default=None)
    fa = toks[j]['f'] if j is not None else 0; fb = toks[k2]['f'] if k2 is not None else fa + 20
    ja = j if j is not None else -1; kb = k2 if k2 is not None else i + 1
    t['f'] = round(fa + (fb - fa) * (i - ja) / (kb - ja))
for i in range(1, len(toks)): toks[i]['f'] = max(toks[i]['f'], toks[i - 1]['f'])
fim = round(W[-1]['e'] * 30)
pal = [{'b': t['b'], 'w': t['w'], 'f': t['f']} for t in toks]
open(f'parte{P}/dados.js', 'w', encoding='utf-8').write(
    'window.BLOCOS = ' + json.dumps(B, ensure_ascii=False) + ';\nwindow.UNID = ' + json.dumps(D['unid'], ensure_ascii=False) +
    ';\nwindow.PALAVRAS = ' + json.dumps(pal, ensure_ascii=False) + f';\nwindow.FIM_FALA = {fim};\n')
# blocos com muitas palavras sem par (onde a narração pode ter lido diferente)
for bi, b in enumerate(B):
    ts = [t for t in toks if t['b'] == bi]; sem = sum(1 for t in ts if t['n'] and 'f' not in t)
    # recalcula: marca quem não casou
for t in toks: t['ok'] = False
for blk in sm.get_matching_blocks():
    for k in range(blk.size): toks[blk.a + k]['ok'] = True
for bi, b in enumerate(B):
    ts = [t for t in toks if t['b'] == bi]; sem = [t['w'] for t in ts if not t['ok'] and t['n']]
    lab = D['unid'][b['u']]['lab'] if b['u'] >= 0 else b['t']
    print(f"{ts[0]['f']/30:7.1f}s {lab:9} {b.get('tag',''):8} sem par {len(sem):3}/{len(ts):3} {' '.join(sem[:12])}")
