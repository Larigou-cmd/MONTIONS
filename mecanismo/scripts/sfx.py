# Gera efeitos sonoros simples por código (sem baixar nada): whoosh, pop, clique, plim.
import numpy as np, wave, os
SR = 44100
def save(name, x):
    x = np.clip(x / (np.abs(x).max() + 1e-9) * 0.9, -1, 1)
    with wave.open(os.path.join("public/sfx", name), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
def t(d): return np.arange(int(SR * d)) / SR
rng = np.random.default_rng(7)

# whoosh: ruído filtrado com corte subindo e descendo
d = 0.7; n = rng.standard_normal(len(t(d)))
cut = 300 + 3500 * np.sin(np.linspace(0, np.pi, len(n))) ** 2
y = np.zeros_like(n); a = 0.0
for i in range(len(n)):
    k = 1 - np.exp(-2 * np.pi * cut[i] / SR); a += k * (n[i] - a); y[i] = a
env = np.sin(np.linspace(0, np.pi, len(n))) ** 1.5
save("whoosh.wav", y * env)

# pop: bolha curta subindo de tom
tt = t(0.14); f = 520 + 700 * tt / 0.14
save("pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 32))

# clique de trava: estalo agudo + batida grave
tt = t(0.35)
click = rng.standard_normal(len(tt)) * np.exp(-tt * 260)
thump = np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 18)
click2 = np.zeros_like(tt); s = int(0.07 * SR); click2[s:] = rng.standard_normal(len(tt) - s) * np.exp(-tt[: len(tt) - s] * 300) * 0.7
save("trava.wav", click + thump * 0.8 + click2)

# plim: sino suave
tt = t(1.4)
bell = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dcy) for f, a, dcy in [(880, 1, 3.2), (1320, .5, 4.5), (1760, .3, 6), (2640, .15, 8)])
save("plim.wav", bell * (1 - np.exp(-tt * 400)))
print("ok")
