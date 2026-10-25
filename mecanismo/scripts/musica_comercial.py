# Trilha animada para comerciais (sem direitos autorais): 120 bpm, bumbo em todo tempo, palma no 2 e no 4,
# chimbal no contratempo, acordes curtos e baixo. A 30 fps cada batida dura 15 quadros (um compasso = 60 quadros).
# Uso: python scripts/musica_comercial.py <segundos> <saida.wav>
import numpy as np, wave, sys
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(SR * dur); t = np.arange(n) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
BPM = 120
beat = 60 / BPM
bar = 4 * beat
rng = np.random.default_rng(7)
y = np.zeros(n)
def put(st, sig):
    st = int(st * SR)
    if st >= n: return
    L = min(len(sig), n - st); y[st:st + L] += sig[:L]
# bumbo: seno que cai de 120 Hz para 45 Hz
L = int(SR * 0.35); tt = np.arange(L) / SR
kick = np.sin(2 * np.pi * (45 * tt + 75 * (1 - np.exp(-tt * 30)) / 30)) * np.exp(-tt * 9) * 0.55
# palma: ruído curto
L = int(SR * 0.18); tt = np.arange(L) / SR
clap = rng.standard_normal(L) * np.exp(-tt * 28) * 0.16
# chimbal: ruído bem curto e "fino" (diferença de amostras corta os graves)
L = int(SR * 0.05); tt = np.arange(L) / SR
hat = np.diff(rng.standard_normal(L + 1)) * np.exp(-tt * 90) * 0.05
# progressão Fá – Sol – Mi menor – Lá menor (pop otimista)
prog = [[53, 57, 60, 65], [55, 59, 62, 67], [52, 55, 59, 64], [57, 60, 64, 69]]
nbeats = int(dur / beat) + 1
for b in range(nbeats):
    tb = b * beat
    put(tb, kick)
    if b % 4 in (1, 3): put(tb, clap)
    put(tb + beat / 2, hat)
    c = prog[(b // 4) % 4]
    # acorde curto (stab) no contratempo
    L = int(SR * 0.22); tt = np.arange(L) / SR
    env = np.minimum(1, tt / 0.005) * np.exp(-tt * 14)
    stab = sum(np.sin(2 * np.pi * note(m + 12) * tt) + 0.3 * np.sin(2 * np.pi * note(m + 24) * tt) for m in c) * env * 0.045
    put(tb + beat / 2, stab)
    # baixo em colcheias
    for h in (0, 0.5):
        L = int(SR * beat * 0.45); tt = np.arange(L) / SR
        f = note(c[0] - 24)
        put(tb + h * beat, (np.sin(2 * np.pi * f * tt) + 0.3 * np.sign(np.sin(2 * np.pi * f * tt))) * np.minimum(1, tt / 0.004) * np.exp(-tt * 6) * 0.12)
# pad baixinho por compasso
for i in range(int(dur / bar) + 1):
    L = int(SR * bar); tt = np.arange(L) / SR
    env = np.minimum(1, tt / 0.3) * np.minimum(1, (bar - tt) / 0.3)
    put(i * bar, sum(np.sin(2 * np.pi * note(m) * tt) for m in prog[i % 4]) * env * 0.025)
fade = np.minimum(1, t / 0.05) * np.minimum(1, (dur - t) / 1.0)
y = y * fade
y = y / (np.abs(y).max() + 1e-9) * 0.85
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print("ok", out)
