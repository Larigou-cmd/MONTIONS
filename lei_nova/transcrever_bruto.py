# Transcreve uma narração inteira (faster-whisper small) e guarda o texto e as palavras com tempo.
# Uso: python transcrever_bruto.py <audio.mp3> <prefixo_saida>  -> prefixo.txt e prefixo.json
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
mp3, pre = sys.argv[1:3]
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", mp3, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
segs, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(audio, language="pt", word_timestamps=True)
segs = list(segs)
open(pre + ".txt", "w", encoding="utf-8").write("\n".join(f"[{s.start:7.1f}] {s.text.strip()}" for s in segs))
json.dump([{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for s in segs for w in s.words], open(pre + ".json", "w", encoding="utf-8"), ensure_ascii=False)
print("ok", pre)
