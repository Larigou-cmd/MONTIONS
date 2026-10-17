# Trilha de fundo calma (sem direitos autorais) para ficar embaixo da narração: só acordes lentos em tom maior,
# sem arpejo nem melodia, timbre macio. Uso: python3 scripts/musica_calma.py <segundos> <saida.wav>
import numpy as np, wave, sys
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(SR * dur); t = np.arange(n) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
# progressão Dó – Lá menor – Fá – Sol (6 s cada acorde), vozes graves e médias
prog = [[48, 55, 64, 67], [45, 52, 60, 64], [41, 53, 57, 60], [43, 50, 59, 62]]
bar = 6.0
y = np.zeros(n)
for i in range(int(dur / bar) + 1):
    st = int(i * bar * SR); en = min(n, int((i + 1) * bar * SR + SR * 2.5))
    if st >= n: break
    tt = np.arange(en - st) / SR
    env = np.minimum(1, tt / 2.5) * np.exp(-np.maximum(0, tt - bar) * 1.5)  # entra devagar e se funde no próximo acorde
    for j, m in enumerate(prog[i % 4]):
        f = note(m)
        vib = 1 + 0.002 * np.sin(2 * np.pi * 0.25 * tt + j)
        y[st:en] += (np.sin(2 * np.pi * f * vib * tt) + 0.12 * np.sin(2 * np.pi * f * 2 * tt)) * env * (0.14 if j == 0 else 0.09)
# eco leve
d = int(0.45 * SR); y[d:] += 0.2 * y[:-d]
# suaviza os agudos (média móvel)
k = 24; y = np.convolve(y, np.ones(k) / k, mode="same")
fade = np.minimum(1, t / 3.0) * np.minimum(1, (dur - t) / 4.0)
y = y * fade
y = y / (np.abs(y).max() + 1e-9) * 0.8
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print("ok", out)
