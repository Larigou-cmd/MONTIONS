# Junta o som do comercial Farma.exe ao vídeo mudo (o som entra só no fim, como pede o Modelo 7):
# música de 120 bpm limpa até b80 (40 s), depois abafada (passa-baixa) com eco, apagando sem corte seco;
# efeitos na batida: whoosh nas idas e voltas da câmera, pop nas mensagens, plim na assinatura.
# Uso: python scripts/som_farma.py <video_mudo.mp4> <musica.wav> <saida.mp4>
import subprocess, sys, os

mudo, musica, saida = sys.argv[1:4]
sfx_dir = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
B = 0.5  # 1 batida = 0,5 s
efeitos = (
    [(n, "whoosh", 0.22) for n in (4, 10, 16, 24, 32, 40, 48, 56, 66)]
    + [(n, "pop", 0.2) for n in (6, 9, 12, 26, 28, 42, 44, 58, 60, 62)]
    + [(68, "plim", 0.28), (76, "plim", 0.18)]
)
entradas = ["-i", mudo, "-i", musica]
for _, nome, _ in efeitos:
    entradas += ["-i", os.path.join(sfx_dir, nome + ".wav")]
partes = [
    # música: 0–40 s normal; 40–45 s abafada com eco, com meia batida de transição entre as duas
    "[1:a]atrim=0:46,asetpts=PTS-STARTPTS,asplit=2[m1][m2]",
    "[m1]atrim=0:40.25[limpa]",
    "[m2]atrim=40:46,asetpts=PTS-STARTPTS,lowpass=f=700,aecho=0.8:0.7:250|500:0.45|0.3,volume=1.1,afade=t=out:st=2.2:d=2.8[abafada]",
    # acrossfade emenda as duas partes com meia batida de transição (sem corte seco)
    "[limpa][abafada]acrossfade=d=0.25,volume=0.55[mus]",
]
for i, (n, _, vol) in enumerate(efeitos):
    ms = int(n * B * 1000)
    partes.append(f"[{i + 2}:a]volume={vol},adelay={ms}|{ms}[s{i}]")
partes.append("[mus]" + "".join(f"[s{i}]" for i in range(len(efeitos))) + f"amix=inputs={len(efeitos) + 1}:normalize=0:duration=first[a]")
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", ";".join(partes),
     "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", "45", "-movflags", "+faststart", saida],
    check=True,
)
print("ok", saida)
