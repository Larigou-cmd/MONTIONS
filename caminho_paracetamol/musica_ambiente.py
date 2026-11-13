# Trilha ambiente de documentário médico (sem melodia marcante): pad de acordes longos, baixo grave suave,
# pulso lento tipo batimento e brilho de notas altas espaçadas. Feita em código, sem direitos autorais.
# Depois mistura com a trilha retrô (musica.wav, Modelo 2) só nas telas em pixel, com fades.
# Uso: python musica_ambiente.py  -> musica_ambiente.wav e musica_mix.wav
import json, wave, os
import numpy as np

SR = 44100
here = os.path.dirname(os.path.abspath(__file__))
END = json.load(open(os.path.join(here, "timeline.json"), encoding="utf-8"))["END"]
n = int(END * SR) + SR
t = np.arange(n) / SR
rng = np.random.default_rng(7)
nota = lambda m: 440 * 2 ** ((m - 69) / 12)

def lowpass(x, fc):
    # filtro simples de 1 polo, aplicado 2 vezes
    a = np.exp(-2 * np.pi * fc / SR)
    for _ in range(2):
        y = np.empty_like(x); acc = 0.0
        for i in range(0, len(x), 4096):
            seg = x[i:i + 4096]
            out = np.empty_like(seg)
            for j, v in enumerate(seg):
                acc = (1 - a) * v + a * acc; out[j] = acc
            y[i:i + 4096] = out
        x = y
    return x

# acordes (Am9 - Fmaj7 - Cmaj7 - Em7), 8 s cada, troca suave
ACORDES = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 59, 64, 67], [52, 55, 59, 62, 67]]
DUR_AC = 8.0
pad = np.zeros(n)
for i in range(int(END / DUR_AC) + 2):
    t0 = i * DUR_AC; ac = ACORDES[i % 4]
    a, b = int(max(0, t0 - 1.5) * SR), min(n, int((t0 + DUR_AC + 1.5) * SR))
    if a >= n: break
    tt = t[a:b] - t0
    env = np.clip((tt + 1.5) / 2.5, 0, 1) * np.clip((DUR_AC + 1.5 - tt) / 2.5, 0, 1)
    for m in ac:
        f = nota(m)
        for det in (-0.12, 0.0, 0.11):   # três vozes levemente desafinadas = pad largo
            pad[a:b] += env * np.sin(2 * np.pi * f * (1 + det / 100) * t[a:b] + rng.uniform(0, 6.28)) * 0.05
    # baixo grave
    fb = nota(ac[0] - 12)
    pad[a:b] += env * np.sin(2 * np.pi * fb * t[a:b]) * 0.16

# pulso lento tipo batimento (60 bpm), bem baixo
pulso = np.zeros(n)
for k in np.arange(0, END, 1.0):
    for d, amp in ((0, 1.0), (0.28, 0.6)):
        a = int((k + d) * SR); L = int(0.25 * SR)
        if a + L >= n: continue
        e = np.exp(-np.arange(L) / (0.05 * SR))
        pulso[a:a + L] += np.sin(2 * np.pi * 52 * np.arange(L) / SR) * e * 0.18 * amp

# brilho: notas altas soltas, a cada ~3 s, com eco
brilho = np.zeros(n)
for k in np.arange(2.0, END, 3.2):
    ac = ACORDES[int(k // DUR_AC) % 4]; m = ac[rng.integers(1, 5)] + 24
    a = int(k * SR); L = int(2.5 * SR)
    if a + L >= n: continue
    e = np.exp(-np.arange(L) / (0.6 * SR))
    tone = np.sin(2 * np.pi * nota(m) * np.arange(L) / SR) * e * 0.035
    for eco, g in ((0, 1.0), (0.42, 0.45), (0.84, 0.2)):
        b = a + int(eco * SR)
        if b + L < n: brilho[b:b + L] += tone * g

amb = pad + pulso + brilho
amb = amb[: int(END * SR)]
fade = int(2 * SR); amb[:fade] *= np.linspace(0, 1, fade); amb[-fade * 2:] *= np.linspace(1, 0, fade * 2)
amb /= np.max(np.abs(amb)) + 1e-9

def salvar(nome, x):
    x = np.clip(x, -1, 1); w = wave.open(os.path.join(here, nome), "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
salvar("musica_ambiente.wav", amb * 0.9)

# mistura: retrô só nas telas em pixel (com 0,6 s de fade), ambiente no resto (abaixa nessas telas)
w = wave.open(os.path.join(here, "musica.wav")); retro = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32767; w.close()
retro = np.pad(retro, (0, max(0, len(amb) - len(retro))))[: len(amb)]
retro /= np.max(np.abs(retro)) + 1e-9
PIXEL = [[15.7, 31.4], [131.9, 144.8], [225.5, 242.4], [257.2, END]]
mask = np.zeros(len(amb)); tt = np.arange(len(amb)) / SR
for a, b in PIXEL:
    mask = np.maximum(mask, np.clip((tt - a + 0.3) / 0.6, 0, 1) * np.clip((b - tt + 0.3) / 0.6, 0, 1))
mix = amb * (1 - 0.85 * mask) * 1.0 + retro * mask * 0.75
salvar("musica_mix.wav", mix / (np.max(np.abs(mix)) + 1e-9) * 0.9)
print("ok", round(len(amb) / SR, 1), "s")
