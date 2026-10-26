# Tempo de cada palavra de uma narração (faster-whisper, modelo small) e alinhamento com o texto do roteiro.
# Lê o MP3 pelo ffmpeg (áudio cru 16 kHz) porque o PyAV falha com alguns MP3.
# Uso (com o Python do ambiente montions-whisper em %LOCALAPPDATA%):
#   python scripts/transcrever.py <narracao.mp3> <roteiro.md> <saida fala.json>
# O roteiro precisa ter as seções "## Texto da fala" e "## Cenas". Saída: [{"w": palavra, "f": quadro a 30 fps}].
import difflib, json, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

mp3, roteiro, saida = sys.argv[1:4]
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", mp3, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
segs, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(audio, language="pt", word_timestamps=True)
ws = [{"w": w.word.strip(), "s": w.start} for s in segs for w in s.words]

texto = open(roteiro, encoding="utf-8").read().split("## Texto da fala")[1].split("## Cenas")[0].split("\n", 1)[1].strip()
toks = texto.replace('"', "").split()
n = lambda s: re.sub(r"[^\wà-ú]", "", s.lower())
a, b = [n(t) for t in toks], [n(w["w"]) for w in ws]
f = [None] * len(toks)
for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
    for k in range(blk.size):
        f[blk.a + k] = round(ws[blk.b + k]["s"] * 30)
# palavras que o whisper escreveu diferente (números etc.): interpola entre as vizinhas
for i in range(len(f)):
    if f[i] is None:
        j = i
        while j < len(f) and f[j] is None:
            j += 1
        ant = f[i - 1] if i > 0 else 0
        prox = f[j] if j < len(f) else ant + 10
        for k in range(i, j):
            f[k] = ant + round((prox - ant) * (k - i + 1) / (j - i + 1))
json.dump([{"w": t, "f": x} for t, x in zip(toks, f)], open(saida, "w", encoding="utf-8"), ensure_ascii=False)
print("faltaram:", [toks[i] for i in range(len(toks)) if a[i] not in b])
print(" ".join(f"{t}:{x}" for t, x in zip(toks, f)))
