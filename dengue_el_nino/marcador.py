# Som de marcador no quadro branco: cada traço vira um chiado de feltro no vidro, no ritmo da velocidade do traço.
# Uso: python marcador.py strokes.json <segundos> marcador.wav   (strokes.json = [[t0, dur, vermelho], ...] tirado de scene.html)
import json, sys, wave
import numpy as np

SR = 44100
st = json.load(open(sys.argv[1])); dur = float(sys.argv[2]); out = sys.argv[3]
n = int(SR * dur)
rng = np.random.default_rng(7)
env = np.zeros(n); tick = np.zeros(n)
for t0, d, red in st:
    i0 = int(t0 * SR); m = max(8, int(d * SR))
    if i0 >= n: continue
    u = np.arange(m) / m
    e = (1 - 0.8 * np.cos(2 * np.pi * u)) / 1.8           # velocidade do traço (devagar-rápido-devagar)
    e *= np.minimum(1, u / 0.04) * np.minimum(1, (1 - u) / 0.08)
    e *= 0.9 + 0.2 * rng.random()
    j = min(n, i0 + m); env[i0:j] = np.maximum(env[i0:j], e[: j - i0])
    k = min(n, i0 + 220); tick[i0:k] += np.exp(-np.arange(k - i0) / 40) * 0.5   # toque da ponta
noise = rng.standard_normal(n)
# grãos de "agarra e solta" do feltro
grain = 0.7 + 0.3 * np.sign(np.sin(2 * np.pi * 37 * np.arange(n) / SR + rng.standard_normal(n) * 0.3))
x = noise * env * grain
F = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
band = np.exp(-((f - 4200) / 1700) ** 2) * 1.0 + np.exp(-((f - 1000) / 450) ** 2) * 0.55
y = np.fft.irfft(F * band, n)
T = np.fft.rfft(tick * rng.standard_normal(n)); y += np.fft.irfft(T * np.exp(-((f - 2500) / 1500) ** 2), n) * 0.6
y = y / (np.abs(y).max() + 1e-9) * 0.8
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print('ok', out)
