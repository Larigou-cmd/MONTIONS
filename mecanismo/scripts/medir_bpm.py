# Mede o andamento (BPM) de um .wav por dois métodos independentes, só com numpy:
#  1) autocorrelação da curva de ataques (energia que sobe de um quadro para o outro);
#  2) intervalo entre os golpes do bumbo (picos de energia grave), pela mediana.
# Uso: python scripts/medir_bpm.py <arquivo.wav>
import numpy as np, wave, sys
with wave.open(sys.argv[1]) as w:
    sr = w.getframerate(); ch = w.getnchannels()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
if ch > 1: x = x.reshape(-1, ch).mean(axis=1)
x /= np.abs(x).max() + 1e-9
hop = 512
fr = len(x) // hop
energia = np.array([np.sum(x[i * hop:(i + 1) * hop] ** 2) for i in range(fr)])
ataque = np.maximum(0, np.diff(energia, prepend=energia[0]))
ataque -= ataque.mean()
# método 1: autocorrelação entre 60 e 200 bpm
ac = np.correlate(ataque, ataque, mode="full")[len(ataque) - 1:]
fps = sr / hop
lags = np.arange(len(ac))
ok = (lags >= fps * 60 / 200) & (lags <= fps * 60 / 60)
lag = lags[ok][np.argmax(ac[ok])]
# refina com interpolação parabólica
a, b, c = ac[lag - 1], ac[lag], ac[lag + 1]
lag_f = lag + 0.5 * (a - c) / (a - 2 * b + c)
bpm1 = 60 * fps / lag_f
# método 2: picos de energia grave (média móvel curta funciona como passa-baixa)
k = 200
grave = np.convolve(x, np.ones(k) / k, mode="same")
eg = np.array([np.sum(grave[i * hop:(i + 1) * hop] ** 2) for i in range(fr)])
lim = 0.5 * eg.max()
picos = [i for i in range(1, fr - 1) if eg[i] > lim and eg[i] >= eg[i - 1] and eg[i] > eg[i + 1]]
# junta picos muito próximos (mesmo golpe)
golpes = []
for p in picos:
    if not golpes or p - golpes[-1] > fps * 0.2: golpes.append(p)
bpm2 = 60 / (np.median(np.diff(golpes)) / fps)
print(f"método 1 (autocorrelação dos ataques): {bpm1:.1f} bpm")
print(f"método 2 (intervalo entre bumbos, {len(golpes)} golpes): {bpm2:.1f} bpm")
print(f"primeiro golpe em {golpes[0] / fps:.3f} s")
