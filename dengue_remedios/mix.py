# Troca só a trilha: junta o vídeo já gravado (dengue_remedios.mp4) com narração, a trilha escolhida e os efeitos.
# Uso: python mix.py <trilha.wav> <volume> <saida.mp4>
import json, subprocess, sys
mus, vol, out = sys.argv[1], sys.argv[2], sys.argv[3]
END = 77.0
sfx = json.load(open('sfx.json', encoding='utf-8'))
inp = ['-i', 'dengue_remedios.mp4', '-i', 'fala.mp3', '-i', mus]
for _, f, _v in sfx: inp += ['-i', f'sfx/{f}.wav']
parts = ['[1:a]apad[nar]', f'[2:a]volume={vol},afade=t=out:st={END-2}:d=2[mus]']
for i, (t, _f, v) in enumerate(sfx): parts.append(f'[{i+3}:a]volume={v},adelay={round(t*1000)}|{round(t*1000)}[s{i}]')
parts.append('[nar][mus]' + ''.join(f'[s{i}]' for i in range(len(sfx))) + f'amix=inputs={len(sfx)+2}:normalize=0:duration=first,loudnorm=I=-13:TP=-1.5:LRA=11[a]')
subprocess.run(['ffmpeg', '-y', '-v', 'error', *inp, '-filter_complex', ';'.join(parts), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', str(END), '-movflags', '+faststart', out], check=True)
print('ok', out)
