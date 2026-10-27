# Trilha de fundo com clima de documentário histórico (sem direitos autorais), para a série "A origem dos remédios":
# tom menor, cordas lentas, violoncelo grave, notas soltas de piano e um tique-taque de relógio bem leve.
# Uso: python3 scripts/musica_historia.py <segundos> <saida.wav>
import numpy as np, wave, sys
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
n = int(SR * dur); t = np.arange(n) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(7)
BPM = 66
beat = 60 / BPM
bar = 4 * beat
# Ré menor – Si bemol – Sol menor – Lá (a dominante dá o suspense de "história sendo contada")
prog = [[50, 57, 62, 65], [46, 58, 62, 65], [43, 55, 62, 67], [45, 57, 61, 64]]
y = np.zeros(n)

def corda(f, tt, env):
    # timbre de cordas: soma de harmônicos que caem, com vibrato lento
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * tt) * np.minimum(1, tt / 1.5)
    s = np.zeros_like(tt)
    for h, a in [(1, 1.0), (2, 0.45), (3, 0.28), (4, 0.16), (5, 0.1), (6, 0.06)]:
        s += a * np.sin(2 * np.pi * f * h * vib * tt + h)
    return s * env

for i in range(int(dur / bar) + 1):
    st = int(i * bar * SR); en = min(n, int((i + 1) * bar * SR + SR * 2.0))
    if st >= n: break
    tt = np.arange(en - st) / SR
    env = np.minimum(1, tt / 1.8) * np.exp(-np.maximum(0, tt - bar) * 1.6)
    acorde = prog[i % 4]
    for j, m in enumerate(acorde[1:]):
        y[st:en] += corda(note(m), tt, env) * 0.05
    # violoncelo: a nota grave, uma oitava abaixo
    y[st:en] += corda(note(acorde[0] - 12), tt, env) * 0.11

# piano: notas soltas da escala de Ré menor, como quem folheia um arquivo antigo
escala = [62, 64, 65, 67, 69, 70, 72, 74]
for i in range(int(dur / beat)):
    if i % 4 not in (0, 3) or rng.random() < 0.35: continue
    st = int(i * beat * SR)
    if st >= n: break
    acorde = prog[(i // 4) % 4]
    m = acorde[1 + rng.integers(0, 3)] + 12 if rng.random() < 0.6 else escala[rng.integers(0, len(escala))]
    L = min(n - st, int(SR * 3)); tt = np.arange(L) / SR
    f = note(m)
    env = np.minimum(1, tt / 0.006) * np.exp(-tt * 2.2)
    y[st:st + L] += (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 3) + 0.1 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 5)) * env * 0.09

# tique-taque de relógio, bem baixinho (passagem do tempo)
for i in range(int(dur / beat)):
    st = int(i * beat * SR)
    if st >= n: break
    L = min(n - st, int(SR * 0.03)); tt = np.arange(L) / SR
    clique = rng.standard_normal(L) * np.exp(-tt * 300) * (0.05 if i % 2 == 0 else 0.035)
    y[st:st + L] += np.convolve(clique, np.ones(4) / 4, mode="same")

# eco longo e suave (sala grande)
for d, g in [(0.37, 0.25), (0.83, 0.15), (1.4, 0.08)]:
    k = int(d * SR); y[k:] += g * y[:-k]
k = 12; y = np.convolve(y, np.ones(k) / k, mode="same")
fade = np.minimum(1, t / 3.0) * np.minimum(1, (dur - t) / 4.0)
y = y * fade
y = y / (np.abs(y).max() + 1e-9) * 0.8
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print("ok", out)
