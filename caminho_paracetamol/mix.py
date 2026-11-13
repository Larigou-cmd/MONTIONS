# Refaz só o áudio de caminho_paracetamol.mp4 (imagem copiada): narração + musica_mix.wav + efeitos de sfx.json, e masteriza em -14 LUFS.
# Uso: python mix.py  -> caminho_paracetamol_audio_novo.mp4
import json, subprocess, os
here = os.path.dirname(os.path.abspath(__file__)); j = lambda *p: os.path.join(here, *p)
END = json.load(open(j("timeline.json"), encoding="utf-8"))["END"]; sfx = json.load(open(j("sfx.json")))
ins = ["-i", j("caminho_paracetamol.mp4"), "-i", j("narracao.mp3"), "-i", j("musica_mix.wav")]
for _, f, _ in sfx: ins += ["-i", j("sfx", f + ".wav")]
parts = ["[1:a]apad[nar]", f"[2:a]volume=0.07,afade=t=out:st={END-3:.2f}:d=3[mus]"]
for i, (t, _, v) in enumerate(sfx): parts.append(f"[{i+3}:a]volume={v},adelay={int(t*1000)}|{int(t*1000)}[s{i}]")
parts.append("[nar][mus]" + "".join(f"[s{i}]" for i in range(len(sfx))) + f"amix=inputs={len(sfx)+2}:normalize=0:duration=first,loudnorm=I=-13.2:TP=-1.5:LRA=11[a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{END:.2f}", "-movflags", "+faststart", j("caminho_paracetamol_audio_novo.mp4")], check=True)
print("ok")
