# Trilha ORIGINAL de "mistério leve" para "Fechadura" (@historicodebusca).
# Pizzicato + celesta em lá menor, 100 bpm. Gera trilha.wav e efeitos.wav (efeitos sintetizados).
import sys, wave
import numpy as np
SR = 44100
DUR = (round((72.16 + 0.3) * 30) + 30) / 30
N = int(SR * DUR)
rng = np.random.default_rng(9)
mus = np.zeros(N); sfx = np.zeros(N)
def add(buf, t0, sig, g=1.0):
    i0 = int(t0 * SR)
    if i0 >= N or i0 < 0: return
    n = min(len(sig), N - i0); buf[i0:i0+n] += sig[:n] * g
nota = lambda m: 440 * 2 ** ((m - 69) / 12)
def pluck(m, dur=0.45, dec=0.12):
    n = int(dur*SR); t = np.arange(n)/SR; f = nota(m)
    s = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t) + 0.1*np.sin(2*np.pi*3*f*t)
    return s*np.exp(-t/dec)*np.minimum(1, t/0.002)
def celesta(m, dur=0.9):
    n = int(dur*SR); t = np.arange(n)/SR; f = nota(m)
    return (np.sin(2*np.pi*f*t) + 0.3*np.sin(2*np.pi*4*f*t)*np.exp(-t/0.05))*np.exp(-t/0.35)*np.minimum(1,t/0.003)
B = 60/100
prog = [(45,[60,64,69]),(41,[60,65,69]),(43,[62,67,71]),(40,[59,64,68])]
mel = [76,None,74,72, 71,None,72,74, 76,79,77,76, 74,None,71,None]
k, c = 0.2, 0
while k < DUR - 1.5:
    raiz, tri = prog[c % 4]
    for i in range(8):
        add(mus, k + i*B/2, pluck(raiz if i % 4 == 0 else raiz+12 if i % 4 == 2 else raiz+7, dec=0.1), 0.45)
        add(mus, k + i*B/2 + B/4, pluck(tri[i % 3]+12, dec=0.06), 0.15)
    if c % 8 >= 2:
        for j in range(4):
            m = mel[(c % 4)*4 + j]
            if m: add(mus, k + j*B, celesta(m), 0.26)
    k += 4*B; c += 1
mus *= np.minimum(1, (N - np.arange(N))/(1.5*SR))
def ruido_lp(n, a):
    x = rng.uniform(-1,1,n); y = np.zeros(n); acc = 0.0
    for i in range(n): acc += a*(x[i]-acc); y[i] = acc
    return y
def vupt(t0):
    n = int(0.32*SR); p = np.arange(n)/n
    add(sfx, t0, ruido_lp(n,0.08)*np.sin(np.pi*p)*1.6, 0.45)
def pop(t0, g=0.3):
    n = int(0.12*SR); t = np.arange(n)/SR; f = 300+900*np.exp(-t/0.02)
    add(sfx, t0, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.04), g)
def clique(t0, g=0.4, f0=3200):
    n = int(0.05*SR); t = np.arange(n)/SR
    add(sfx, t0, (np.sin(2*np.pi*f0*t)*0.6 + ruido_lp(n,0.6)*2)*np.exp(-t/0.006), g)
def raspa(t0, t1, g=0.12):  # chave metálica deslizando
    n = int((t1-t0)*SR); t = np.arange(n)/SR
    s = (rng.uniform(-1,1,n) - ruido_lp(n,0.25)) * (0.6+0.4*np.sin(2*np.pi*13*t))
    add(sfx, t0, s*np.minimum(1,t/0.05)*np.minimum(1,(t1-t0-t)/0.05), g)
def destrava(t0, g=0.6):
    n = int(0.25*SR); t = np.arange(n)/SR; f = 120+300*np.exp(-t/0.02)
    add(sfx, t0, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.06) + ruido_lp(n,0.4)*np.exp(-t/0.015)*2, g)
    clique(t0+0.05, 0.5, 2400)
def rangido(t0, dur=0.9):
    n = int(dur*SR); t = np.arange(n)/SR; f = 180 + 120*np.sin(np.pi*t/dur)
    s = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.3*(0.5+0.5*np.sin(2*np.pi*31*t))
    add(sfx, t0, s*np.sin(np.pi*t/dur), 0.12)
def chacoalha(t0, t1):
    t = t0
    while t < t1: clique(t, 0.3, 2000 + rng.uniform(0, 1500)); t += rng.uniform(0.07, 0.13)
def boing(t0):
    n = int(0.5*SR); t = np.arange(n)/SR; f = 300 + 80*np.sin(2*np.pi*12*t)*np.exp(-t/0.2)
    add(sfx, t0, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.15), 0.18)
def ding(t0):
    for d, m in ((0, 84), (0.1, 91)):
        add(sfx, t0+d, celesta(m, 1.2), 0.3)
def buzz(t0, dur=0.5):
    n = int(dur*SR); t = np.arange(n)/SR
    add(sfx, t0, np.sign(np.sin(2*np.pi*110*t))*0.4*np.minimum(1,(dur-t)/0.05), 0.12)
def madeira(t0, g=0.45):
    n = int(0.15*SR); t = np.arange(n)/SR
    add(sfx, t0, (np.sin(2*np.pi*420*t)+0.5*np.sin(2*np.pi*930*t))*np.exp(-t/0.03), g)
def arrasta(t0, dur):
    n = int(dur*SR); t = np.arange(n)/SR
    add(sfx, t0, ruido_lp(n,0.05)*np.sin(np.pi*t/dur)*3, 0.25)
T = lambda t: t + 0.3
for t in (2.9, 7.54, 12.34, 18.8, 29.56, 34.34, 37.42, 51.52, 55.36, 60.38, 65.8): vupt(T(t) - 0.2); clique(T(t), 0.25)
raspa(T(0.2), T(2.4)); [clique(T(0.6 + i*0.38), 0.3) for i in range(5)]; ding(T(2.2))
raspa(T(4.3), T(4.95), 0.1); destrava(T(5.76)); rangido(T(6.66))
raspa(T(9.5), T(9.95), 0.1); chacoalha(T(10.46), T(11.4))
arrasta(T(13.08), 0.9)
for t in (15.26, 17.84, 21.08, 22.08, 25.58, 34.34, 45.68, 46.96, 53.4, 59.08, 64.22, 68.62, 69.64): pop(T(t))
boing(T(23.4)); chacoalha(T(28.76), T(29.3))
raspa(T(38.38), T(41.6)); [clique(T(38.6 + i*0.6), 0.35) for i in range(6)]
ding(T(45.86)); destrava(T(50.1), 0.8)
raspa(T(52.04), T(53.3)); buzz(T(53.4)); chacoalha(T(55.0), T(55.4))
madeira(T(57.8)); madeira(T(58.1)); madeira(T(58.4)); arrasta(T(59.0), 0.9); madeira(T(59.9), 0.6)
ding(T(60.38))
def salvar(buf, nome):
    k = 0.89/max(1e-9, np.abs(buf).max())
    pcm = (np.clip(buf*k,-1,1)*32767).astype("<i2")
    with wave.open(nome,"wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
salvar(mus, sys.argv[1]+"/trilha.wav"); salvar(sfx, sys.argv[1]+"/efeitos.wav"); print("ok")
