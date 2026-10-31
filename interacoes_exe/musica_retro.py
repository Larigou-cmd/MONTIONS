# Trilha retrô (synthwave suave, 96 bpm) para o Modelo 2: baixo pulsando, arpejo, pad, bumbo e chimbal leves.
# Uso: python musica_retro.py <segundos> <saida.wav>
import sys, wave
import numpy as np

SR = 44100
dur = float(sys.argv[1])
out = sys.argv[2]
BPM = 96
beat = 60 / BPM
n = int(dur * SR)
mix = np.zeros(n)

def nota(m):
    return 440 * 2 ** ((m - 69) / 12)

def env(N, a=0.005, r=0.2):
    e = np.ones(N)
    A = max(1, int(a * SR))
    e[:A] = np.linspace(0, 1, A)
    R = min(N, int(r * SR))
    e[-R:] *= np.linspace(1, 0, R)
    return e

def put(sig, t):
    i = int(t * SR)
    if i >= n:
        return
    sig = sig[: n - i]
    mix[i : i + len(sig)] += sig

def saw(f, N):
    t = np.arange(N) / SR
    return 2 * ((t * f) % 1) - 1

def lowpass(x, k=0.08):
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += k * (x[i] - acc)
        y[i] = acc
    return y

# Lá menor – Fá – Dó – Sol (um acorde por compasso de 4 tempos)
ACORDES = [(57, [69, 72, 76]), (53, [65, 69, 72]), (48, [67, 72, 76]), (55, [67, 71, 74])]
compasso = 4 * beat
cache = {}
t = 0.0
c = 0
while t < dur:
    raiz, tri = ACORDES[c % 4]
    # pad (ondas suaves) o compasso inteiro
    N = int(compasso * SR)
    tt = np.arange(N) / SR
    pad = sum(np.sin(2 * np.pi * nota(m) * tt) + 0.3 * np.sin(2 * np.pi * nota(m) * 1.003 * tt) for m in tri)
    put(0.05 * pad * env(N, 0.4, 0.6), t)
    # baixo em colcheias
    for k in range(8):
        key = ("b", raiz)
        if key not in cache:
            Nb = int(beat / 2 * SR * 0.9)
            cache[key] = lowpass(saw(nota(raiz - 12), Nb), 0.06) * env(Nb, 0.003, 0.08)
        put(0.22 * cache[key], t + k * beat / 2)
    # arpejo em semicolcheias (a partir do 3º compasso)
    if c >= 2:
        seq = tri + [tri[1] + 12] + tri[::-1]
        for k in range(16):
            m = seq[k % len(seq)] + 12
            key = ("a", m)
            if key not in cache:
                Na = int(beat / 4 * SR * 0.8)
                ta = np.arange(Na) / SR
                cache[key] = np.sign(np.sin(2 * np.pi * nota(m) * ta)) * env(Na, 0.002, 0.1)
            put(0.025 * cache[key], t + k * beat / 4)
    # bumbo nos tempos 1 e 3, chimbal nos contratempos (a partir do 2º compasso)
    if c >= 1:
        for k in (0, 2):
            Nk = int(0.25 * SR)
            tk = np.arange(Nk) / SR
            kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-tk * 30)) * tk) * np.exp(-tk * 12)
            put(0.35 * kick, t + k * beat)
        for k in range(4):
            Nh = int(0.05 * SR)
            hat = np.random.default_rng(k).standard_normal(Nh) * np.exp(-np.arange(Nh) / SR * 80)
            put(0.04 * np.diff(hat, prepend=0), t + k * beat + beat / 2)
    t += compasso
    c += 1

# entrada e saída suaves; normaliza
fi = int(2 * SR)
mix[:fi] *= np.linspace(0, 1, fi)
fo = int(3 * SR)
mix[-fo:] *= np.linspace(1, 0, fo)
mix = mix / (np.abs(mix).max() + 1e-9) * 0.9
pcm = (mix * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", out)
