# Trilha de telejornal (sem direitos autorais), feita em código: 120 bpm, tom menor (Lá menor), cordas em colcheias
# (tônica, quinta, oitava), baixo pinçado no tempo, pad suave, bumbo leve no 1 e no 3 e caixa abafada no 2 e no 4.
# Uso: python musica_jornal.py <segundos> <saida.wav>
import sys, wave
import numpy as np

SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(SR * dur); t = np.arange(n) / SR
L = np.zeros(n); R = np.zeros(n)
beat = 0.5
note = lambda m: 440 * 2 ** ((m - 69) / 12)
# Am - F - C - G, um acorde por compasso (4 tempos)
prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]

def env(length, a=0.005, d=0.25):
    k = np.arange(int(length * SR)) / SR
    return np.minimum(1, k / a) * np.exp(-k / d)

def add(sig, start, pan=0.0):
    i = int(start * SR)
    if i >= n: return
    s = sig[: n - i]
    L[i:i + len(s)] += s * (1 - pan) * 0.5
    R[i:i + len(s)] += s * (1 + pan) * 0.5

bar = 4 * beat
nbars = int(dur / bar) + 1
for b in range(nbars):
    root, chord = prog[b % 4]
    t0 = b * bar
    # pad
    k = np.arange(int(bar * SR)) / SR
    pad = sum(np.sin(2 * np.pi * note(m) * k) + 0.3 * np.sin(2 * np.pi * note(m) * 2.003 * k) for m in chord)
    pad *= 0.035 * np.minimum(1, k / 0.25) * np.minimum(1, (bar - k) / 0.25)
    add(pad, t0, -0.3); add(pad * 0.9, t0 + 0.01, 0.3)
    for e in range(8):  # cordas em colcheias: tônica, quinta, oitava
        m = [root + 12, root + 19, root + 24, root + 19][e % 4]
        k = np.arange(int(0.22 * SR)) / SR
        s = (np.sign(np.sin(2 * np.pi * note(m) * k)) * 0.25 + np.sin(2 * np.pi * note(m) * k)) * env(0.22, 0.004, 0.06)
        add(s * 0.07, t0 + e * beat / 2, 0.25 if e % 2 else -0.25)
    for q in range(4):
        k = np.arange(int(0.4 * SR)) / SR
        bass = np.sin(2 * np.pi * note(root - 12) * k) * env(0.4, 0.003, 0.12)
        add(bass * 0.22, t0 + q * beat)
        if q in (0, 2):
            kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-k * 30)) * k) * np.exp(-k * 12)
            add(kick * 0.28, t0 + q * beat)
        else:
            sn = np.random.default_rng(b * 4 + q).standard_normal(len(k)) * np.exp(-k * 28)
            add(sn * 0.05, t0 + q * beat)

mx = max(np.abs(L).max(), np.abs(R).max())
fade = np.minimum(1, t / 1.0) * np.minimum(1, (dur - t) / 2.0)
st = np.stack([L, R], 1) / mx * 0.8 * fade[:, None]
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print('ok', out)
