# Tempo (quadro a 30 fps) de cada palavra do texto oficial, alinhando com a transcrição da narração.
import json, re, unicodedata, difflib
B = json.load(open('blocos.json', encoding='utf-8'))
W = json.load(open('palavras_brutas.json', encoding='utf-8'))
def nz(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', w)
toks = []
for bi, b in enumerate(B):
    for w in b['s'].split(): toks.append({'b': bi, 'w': w, 'n': nz(w)})
a = [t['n'] for t in toks]; c = [nz(w['w']) for w in W]
sm = difflib.SequenceMatcher(None, a, c, autojunk=False)
for blk in sm.get_matching_blocks():
    for k in range(blk.size): toks[blk.a + k]['f'] = W[blk.b + k]['f']
idx = [i for i, t in enumerate(toks) if 'f' in t]
print('casadas', len(idx), 'de', len(toks))
# preencher as que faltam entre vizinhas
for i, t in enumerate(toks):
    if 'f' in t: continue
    j = max([k for k in idx if k < i], default=None); k2 = min([k for k in idx if k > i], default=None)
    fa = toks[j]['f'] if j is not None else 0; fb = toks[k2]['f'] if k2 is not None else fa + 20
    ja = j if j is not None else -1; kb = k2 if k2 is not None else i + 1
    t['f'] = round(fa + (fb - fa) * (i - ja) / (kb - ja))
for i in range(1, len(toks)): toks[i]['f'] = max(toks[i]['f'], toks[i - 1]['f'])
json.dump([{'b': t['b'], 'w': t['w'], 'f': t['f']} for t in toks], open('palavras.json', 'w', encoding='utf-8'), ensure_ascii=False)
# início de cada bloco
for bi, b in enumerate(B):
    f = next(t['f'] for t in toks if t['b'] == bi); print(f"{f/30:7.1f}s", b['t'], b.get('a', ''), b['s'][:60])
