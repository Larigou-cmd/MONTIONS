# Copia efeitos e fontes e aplica o ducking na trilha: 0.22 nas pausas, 0.09 sob a voz.
import json, os, shutil, wave
import numpy as np
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(AQUI, "..", "mecanismo", "public", "sfxkit", "sfx-kit-main", "sounds")
os.makedirs(os.path.join(AQUI, "assets", "sfx"), exist_ok=True)
for c, n in [("whooshes", "whoosh-medium-soft"), ("pops", "pop-medium-in"), ("impacts", "impact-medium-firm"),
             ("notifications", "notification-attention-clear"), ("logo-stings", "sting-bright-short")]:
    shutil.copy(os.path.join(M, c, n + ".wav"), os.path.join(AQUI, "assets", "sfx", n + ".wav"))
shutil.copy(os.path.join(AQUI, "..", "lei8142_video", "assets", "fonts", "archivo-black.woff2"), os.path.join(AQUI, "assets", "fonts"))
shutil.copy(os.path.join(AQUI, "..", "youtube", "capas", "logo_farma_exe.jpg"), os.path.join(AQUI, "assets", "logo.jpg"))
FALA = json.load(open(os.path.join(AQUI, "fala.json"), encoding="utf-8"))
b = os.path.join(AQUI, "assets", "musica_base.wav")
w = wave.open(b)
sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32).reshape(-1, ch)
w.close()
env = np.zeros(n)
for i, p in enumerate(FALA):
    ini = p["f"] / 30
    fim = min(FALA[i + 1]["f"] / 30 if i + 1 < len(FALA) else ini + .8, ini + .8)
    env[int(ini * sr):int(fim * sr)] = 1
k = int(.28 * sr)
env = np.convolve(env, np.ones(k) / k, mode="same")
g = .22 - .13 * env
fade = np.ones(n)
L = int(float(os.environ.get("FIM", "79")) * sr)
fade[max(0, L - 2 * sr):L] = np.linspace(1, 0, min(L, n) - max(0, L - 2 * sr))
fade[L:] = 0
y = (x * (g * fade)[:, None]).astype(np.int16)
o = wave.open(os.path.join(AQUI, "assets", "musica.wav"), "wb")
o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(y.tobytes()); o.close()
print("ok")
