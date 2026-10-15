# Calcula a abertura da boca (0 a 3) em cada quadro, a partir do volume da narração. Uso: python3 scripts/boca.py <audio> <saida.json> [atraso_em_quadros]
import numpy as np, subprocess, json, sys
src, out = sys.argv[1], sys.argv[2]; delay = int(sys.argv[3]) if len(sys.argv) > 3 else 0
SR, FPS = 16000, 30
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
hop = SR // FPS
n = len(x) // hop
rms = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop] ** 2)) for i in range(n)])
db = 20 * np.log10(rms + 1e-6)
ref = np.percentile(db[db > -50], 90) if np.any(db > -50) else -20
lvl = np.clip((db - (ref - 22)) / 22, 0, 1)
lvl = np.convolve(lvl, [0.25, 0.5, 0.25], mode="same")
q = np.zeros(n, int)
q[lvl > 0.18] = 1; q[lvl > 0.45] = 2; q[lvl > 0.72] = 3
# fala picotada: alterna para não ficar boca parada aberta em vogal longa
for i in range(1, n):
    if q[i] >= 2 and q[i] == q[i-1] and i % 4 == 0: q[i] -= 1
json.dump([0] * delay + q.tolist(), open(out, "w"))
print(n, "quadros", "fala em", round((q > 0).mean() * 100), "% do tempo")
