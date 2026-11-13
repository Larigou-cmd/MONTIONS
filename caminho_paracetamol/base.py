# Monta a trilha de imagem do vídeo "O caminho do paracetamol" (1920x1080, 30 fps, sem som) a partir de timeline.json.
# Cada trecho usa um clipe do Flow (desacelerado só quando o trecho passa do que o clipe tem) ou fundo preto nas telas em código.
# Uso: python base.py  -> base.mp4
import json, os, subprocess, sys
CLIPS = r"E:/Downloads/Videos/Videos Flow/caminho_comprimido_flow"
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, "timeline.json"), encoding="utf-8"))
tmp = os.path.join(here, "tmp_base"); os.makedirs(tmp, exist_ok=True)
lista = []
for i, (a, b, nome, src) in enumerate(tl["segs"]):
    dur = round(b - a, 3); out = os.path.join(tmp, f"{i:02d}.mp4"); lista.append(out)
    if nome == "CODE":
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s=1920x1080:r=30:d={dur}", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", out]
    else:
        disp = 10.0 - src
        vel = min(1.0, disp / dur)          # 1 = velocidade normal; menor = câmera lenta
        vf = f"trim=start={src},setpts=(PTS-STARTPTS)/{vel:.4f},fps=30,scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=1,trim=duration={dur}"
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", os.path.join(CLIPS, nome + ".mp4"), "-vf", vf, "-an", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", out]
        print(f"{nome:22s} {dur:5.1f}s  velocidade {vel:.2f}")
    subprocess.run(cmd, check=True)
with open(os.path.join(tmp, "lista.txt"), "w") as f:
    f.writelines(f"file '{p}'\n" for p in lista)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(tmp, "lista.txt"), "-c", "copy", os.path.join(here, "base.mp4")], check=True)
print("ok base.mp4")
