# Trilha de fundo própria (sem direitos autorais): pad ambiente + arpejo suave. Uso: python3 scripts/musica.py <segundos> <saida.wav>
import numpy as np, wave, sys
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(SR * dur); t = np.arange(n) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
# progressão Lá menor – Fá – Dó – Sol (4 s cada acorde)
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
bar = 4.0
y = np.zeros(n)
for i in range(int(dur / bar) + 1):
    st = int(i * bar * SR); en = min(n, int((i + 1) * bar * SR + SR * 1.5))
    if st >= n: break
    tt = np.arange(en - st) / SR
    env = np.minimum(1, tt / 1.2) * np.exp(-np.maximum(0, tt - bar) * 2.5)
    for m in prog[i % 4]:
        f = note(m)
        y[st:en] += (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.003 * tt) + 0.15 * np.sin(2 * np.pi * f * 0.5 * tt)) * env * 0.12
    # arpejo suave (oitava acima), uma nota a cada 0,5 s
    for k in range(8):
        a = st + int(k * 0.5 * SR); b = min(n, a + int(1.2 * SR))
        if a >= n: break
        ta = np.arange(b - a) / SR
        m = prog[i % 4][k % 3] + 12
        y[a:b] += np.sin(2 * np.pi * note(m) * ta) * np.exp(-ta * 4) * (1 - np.exp(-ta * 300)) * 0.05
# eco leve
d = int(0.33 * SR); y[d:] += 0.25 * y[:-d]
fade = np.minimum(1, t / 2.0) * np.minimum(1, (dur - t) / 3.0)
y = y * fade
y = y / (np.abs(y).max() + 1e-9) * 0.8
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print("ok", out)
