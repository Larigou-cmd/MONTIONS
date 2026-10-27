# Trilha de fundo leve e animada (sem direitos autorais) para narrações alegres, como a da Juliana:
# acordes macios em tom maior + um dedilhado suave em colcheias, ~88 bpm. Uso: python3 scripts/musica_leve.py <segundos> <saida.wav>
import numpy as np, wave, sys
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(SR * dur); t = np.arange(n) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
BPM = 88
beat = 60 / BPM
bar = 4 * beat  # um acorde por compasso
# progressão Dó – Sol – Lá menor – Fá (pop calmo e otimista)
prog = [[48, 55, 64, 67], [43, 55, 59, 62], [45, 52, 60, 64], [41, 53, 57, 60]]
arp = [[60, 64, 67, 72], [59, 62, 67, 71], [57, 60, 64, 69], [57, 60, 65, 69]]
y = np.zeros(n)
# acordes de fundo (pad)
for i in range(int(dur / bar) + 1):
    st = int(i * bar * SR); en = min(n, int((i + 1) * bar * SR + SR * 1.5))
    if st >= n: break
    tt = np.arange(en - st) / SR
    env = np.minimum(1, tt / 0.8) * np.exp(-np.maximum(0, tt - bar) * 2.0)
    for j, m in enumerate(prog[i % 4]):
        f = note(m)
        vib = 1 + 0.002 * np.sin(2 * np.pi * 0.3 * tt + j)
        y[st:en] += (np.sin(2 * np.pi * f * vib * tt) + 0.1 * np.sin(2 * np.pi * f * 2 * tt)) * env * (0.12 if j == 0 else 0.07)
# dedilhado: colcheias que sobem e descem pelo acorde, com ataque suave (tipo kalimba/piano macio)
padrao = [0, 1, 2, 3, 2, 1, 2, 1]
for i in range(int(dur / (beat / 2)) + 1):
    st = int(i * beat / 2 * SR)
    if st >= n: break
    c = (i // 8) % 4
    m = arp[c][padrao[i % 8]]
    f = note(m)
    L = min(n - st, int(SR * 1.2))
    tt = np.arange(L) / SR
    env = np.minimum(1, tt / 0.012) * np.exp(-tt * 4.5)
    acento = 1.0 if i % 2 == 0 else 0.7
    y[st:st + L] += (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2 * tt) + 0.08 * np.sin(2 * np.pi * f * 3 * tt)) * env * 0.075 * acento
# baixo suave no primeiro tempo de cada compasso
for i in range(int(dur / bar) + 1):
    st = int(i * bar * SR)
    if st >= n: break
    f = note(prog[i % 4][0] - 12)
    L = min(n - st, int(SR * bar)); tt = np.arange(L) / SR
    y[st:st + L] += np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / 0.03) * np.exp(-tt * 1.2) * 0.16
# eco leve
d = int(beat * 0.75 * SR); y[d:] += 0.18 * y[:-d]
# suaviza os agudos (média móvel)
k = 16; y = np.convolve(y, np.ones(k) / k, mode="same")
fade = np.minimum(1, t / 2.0) * np.minimum(1, (dur - t) / 4.0)
y = y * fade
y = y / (np.abs(y).max() + 1e-9) * 0.8
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print("ok", out)
