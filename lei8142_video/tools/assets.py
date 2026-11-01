# Gera assets/papel.jpg (papel com grão) e assets/musica.wav (trilha estéreo que abaixa sob a voz).
# Regra do canal: 0,22 nas pausas e 0,09 enquanto a narração fala. Uso: python tools/assets.py
import json, wave
import numpy as np
from PIL import Image

rng = np.random.default_rng(8142)
W, H = 1920, 1080
base = np.array([243, 236, 221], dtype=np.float32)
fino = rng.normal(0, 2.2, (H, W, 1))
grosso = np.array(Image.fromarray(rng.normal(128, 40, (H // 12, W // 12)).astype(np.uint8)).resize((W, H), Image.BICUBIC), dtype=np.float32)[..., None]
img = np.clip(base + fino + (grosso - 128) * 0.05, 0, 255).astype(np.uint8)
Image.fromarray(img).save("assets/papel.jpg", quality=90)

with wave.open("assets/musica_base.wav") as w:
    sr = w.getframerate()
    y = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
n = len(y)
pico = np.max(np.abs(y)) or 1
y = y / pico
fala = json.load(open("fala.json", encoding="utf-8"))
alvo = np.full(n, 0.22, dtype=np.float32)
tempos = [p["f"] / 30 for p in fala]
for a, b in zip(tempos, tempos[1:] + [tempos[-1] + 0.5]):
    fim = min(b, a + 0.8)
    alvo[int(max(0, a - 0.1) * sr):int((fim + 0.1) * sr)] = 0.09
# suaviza a subida e a descida (~250 ms)
env = np.zeros(n, dtype=np.float32)
k = 1 - np.exp(-1 / (0.25 * sr))
v = 0.09
for i in range(n):
    v += (alvo[i] - v) * k
    env[i] = v
# abre em estéreo com um atraso curto de um canal
d = int(0.012 * sr)
l = y * env
r = np.concatenate([np.zeros(d, dtype=np.float32), l[:-d]])
s = (np.clip(np.stack([l, r], 1), -1, 1) * 32767).astype(np.int16)
with wave.open("assets/musica.wav", "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(s.tobytes())
print("ok", n / sr)
