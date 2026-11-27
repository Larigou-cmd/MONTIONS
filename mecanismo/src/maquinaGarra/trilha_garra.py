# Trilha ORIGINAL de fliperama leve para "Máquina de pegar bichinho" (@historicodebusca).
# Pizzicato + marimba em dó maior, 112 bpm. Gera trilha.wav e efeitos.wav (efeitos sintetizados).
import sys, wave
import numpy as np
SR = 44100
DUR = (round((71.3 + 0.3) * 30) + 30) / 30
N = int(SR * DUR)
rng = np.random.default_rng(5)
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
def marimba(m, dur=0.6):
    n = int(dur*SR); t = np.arange(n)/SR; f = nota(m)
    return (np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*4*f*t)*np.exp(-t/0.03))*np.exp(-t/0.2)*np.minimum(1,t/0.003)
B = 60/112
prog = [(48,[64,67,72]),(45,[64,69,72]),(41,[65,69,72]),(43,[62,67,71])]
mel = [76,79,76,72, 74,72,69,None, 72,74,77,76, 74,71,67,None]
k, c = 0.2, 0
while k < DUR - 1.5:
    raiz, tri = prog[c % 4]
    for i in range(8):
        add(mus, k + i*B/2, pluck(raiz if i % 4 == 0 else raiz+12 if i % 4 == 2 else raiz+7, dec=0.09), 0.45)
        add(mus, k + i*B/2 + B/4, pluck(tri[i % 3]+12, dec=0.06), 0.16)
    if c % 8 >= 2:
        for j in range(4):
            m = mel[(c % 4)*4 + j]
            if m: add(mus, k + j*B, marimba(m), 0.3)
    k += 4*B; c += 1
mus *= np.minimum(1, (N - np.arange(N))/(1.5*SR))
# ---- efeitos ----
def ruido_lp(n, a):
    x = rng.uniform(-1,1,n); y = np.zeros(n); acc = 0.0
    for i in range(n): acc += a*(x[i]-acc); y[i] = acc
    return y
def vupt(t0):
    n = int(0.32*SR); p = np.arange(n)/n
    add(sfx, t0, ruido_lp(n,0.08)*np.sin(np.pi*p)*1.6, 0.45)
def pop(t0, g=0.35):
    n = int(0.12*SR); t = np.arange(n)/SR; f = 300+900*np.exp(-t/0.02)
    add(sfx, t0, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.04), g)
def clique(t0, g=0.4):
    n = int(0.04*SR); t = np.arange(n)/SR
    add(sfx, t0, ruido_lp(n,0.5)*np.exp(-t/0.006)*3, g)
def moeda(t0):
    for d, f0 in ((0, 2600), (0.09, 3300), (0.2, 2900)):
        n = int(0.35*SR); t = np.arange(n)/SR
        add(sfx, t0+d, (np.sin(2*np.pi*f0*t)+0.5*np.sin(2*np.pi*f0*1.5*t))*np.exp(-t/0.07), 0.14)
def motor(t0, t1, g=0.12):
    n = int((t1-t0)*SR)
    if n <= 0: return
    t = np.arange(n)/SR
    s = np.sign(np.sin(2*np.pi*95*t))*0.4 + np.sin(2*np.pi*190*t)*0.4 + ruido_lp(n,0.1)*0.6
    add(sfx, t0, s*np.minimum(1,t/0.05)*np.minimum(1,(t1-t0-t)/0.05), g)
def clac(t0, g=0.4):
    n = int(0.09*SR); t = np.arange(n)/SR
    add(sfx, t0, (np.sin(2*np.pi*1400*t)*np.exp(-t/0.012) + ruido_lp(n,0.5)*np.exp(-t/0.01)*1.5), g)
def plof(t0, g=0.5):
    n = int(0.25*SR); t = np.arange(n)/SR; f = 90+120*np.exp(-t/0.03)
    add(sfx, t0, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.07) + ruido_lp(n,0.15)*np.exp(-t/0.04), g)
def womp(t0):
    for i, m in enumerate((67, 66, 65, 62)):
        n = int((0.5 if i == 3 else 0.28)*SR); t = np.arange(n)/SR; f = nota(m)
        s = np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*2*f*t)
        add(sfx, t0 + i*0.26, s*np.exp(-t/0.25)*np.minimum(1,t/0.01), 0.1)
def zumbido(t0, t1, g0, g1):
    n = int((t1-t0)*SR); t = np.arange(n)/SR; k = t/(t1-t0)
    f = 110 + 60*k
    s = np.sin(2*np.pi*np.cumsum(f)/SR) + 0.5*np.sin(2*np.pi*np.cumsum(2*f)/SR)
    add(sfx, t0, s*(g0 + (g1-g0)*k)*np.minimum(1,t/0.2)*np.minimum(1,(t1-t0-t)/0.2), 1.0)
def bipe(t0, f0=1800, g=0.12):
    n = int(0.08*SR); t = np.arange(n)/SR
    add(sfx, t0, np.sign(np.sin(2*np.pi*f0*t))*np.minimum(1,(0.08-t)/0.01), g)
def vitoria(t0):
    for i, m in enumerate((72, 76, 79, 84, 88)):
        add(sfx, t0 + i*0.09, marimba(m, 0.5), 0.22)
T = lambda t: t + 0.3
for t in (4.26, 12.68, 21.28, 28.36, 35.28, 44.82, 53.94, 58.08, 66.06): vupt(T(t) - 0.2); clique(T(t), 0.3)
for t in (3.0, 15.36, 19.38, 25.16, 31.88, 33.9, 50.46, 60.28, 61.26, 62.6, 67.9, 68.94, 53.94, 58.08, 66.06): pop(T(t))
moeda(T(5.0))
for a, b in ((0, 0.6), (0.9, 1.9), (5.76, 6.9), (7.12, 7.9), (8.86, 10.0), (10.0, 10.75), (11.9, 12.6),
             (16.66, 18.7), (19.8, 20.9), (44.7, 45.8), (46.1, 46.8), (47.3, 47.65), (48.0, 48.7),
             (49.4, 52.3), (52.3, 52.75), (53.0, 54.4)):
    motor(T(a), T(b), 0.07 if 49.4 <= a < 52 else 0.11)
for t in (0.9, 8.12, 46.1, 48.0): clac(T(t))
clac(T(53.0), 0.6); clac(T(22.6), 0.25); clac(T(27.9), 0.35)
for t in (2.6, 10.75, 47.15, 49.1): plof(T(t) + 0.3)
womp(T(10.9))
zumbido(T(21.76), T(25.4), 0.05, 0.06); zumbido(T(25.4), T(28.3), 0.06, 0.14)
for t in (30.98, 38.14, 39.72, 41.54, 42.0): bipe(T(t))
bipe(T(43.58), 2400, 0.14); bipe(T(43.7), 3000, 0.14)
for i in range(24): bipe(T(49.4) + i*0.12, 1500, 0.05)
vitoria(T(54.6)); plof(T(55.0), 0.35)
def salvar(buf, nome):
    k = 0.89/max(1e-9, np.abs(buf).max())
    pcm = (np.clip(buf*k,-1,1)*32767).astype("<i2")
    with wave.open(nome,"wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
salvar(mus, sys.argv[1]+"/trilha.wav"); salvar(sfx, sys.argv[1]+"/efeitos.wav"); print("ok")
