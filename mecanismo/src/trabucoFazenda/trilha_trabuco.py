# Trilha ORIGINAL de noticiário curioso para "Trabuco na Fazenda" (@historicodebusca).
# Pizzicato + baixo em ré menor, 104 bpm. Gera trilha.wav e efeitos.wav (efeitos sintetizados).
import sys, wave
import numpy as np
SR = 44100
DUR = 2050 / 30
N = int(SR * DUR)
rng = np.random.default_rng(7)
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
def baixo(m, dur=0.5):
    n = int(dur*SR); t = np.arange(n)/SR; f = nota(m)
    return (np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*2*f*t))*np.exp(-t/0.25)*np.minimum(1,t/0.005)
B = 60/104
prog = [(38,[62,65,69]),(46,[62,65,70]),(43,[62,67,70]),(45,[61,64,69])]
mel = [74,None,72,74, 77,76,74,None, 74,72,70,69, 69,None,70,69]
k, c = 0.2, 0
while k < DUR - 1.5:
    raiz, tri = prog[c % 4]
    for i in range(4): add(mus, k + i*B, baixo(raiz), 0.5)
    for i in range(8): add(mus, k + i*B/2 + B/4, pluck(tri[i % 3]+12, dec=0.06), 0.18)
    if c % 8 >= 2:
        for j in range(4):
            m = mel[(c % 4)*4 + j]
            if m: add(mus, k + j*B, pluck(m, dur=0.6, dec=0.18), 0.28)
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
def carimbo(t0, g=0.7):
    n = int(0.3*SR); t = np.arange(n)/SR; f = 70+120*np.exp(-t/0.02)
    add(sfx, t0, np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.08) + ruido_lp(n,0.3)*np.exp(-t/0.02)*1.5, g)
def assobio(t0, dur=0.9):  # pedra voando
    n = int(dur*SR); t = np.arange(n)/SR; f = 500 + 900*np.sin(np.pi*t/dur)
    add(sfx, t0, (np.sin(2*np.pi*np.cumsum(f)/SR)*0.4 + ruido_lp(n,0.15))*np.sin(np.pi*t/dur), 0.3)
def toque(t0, dur):  # telefone antigo (campainha)
    n = int(dur*SR); t = np.arange(n)/SR
    s = np.sin(2*np.pi*1100*t)*0.5+np.sin(2*np.pi*1650*t)*0.3
    am = (np.sin(2*np.pi*22*t) > 0).astype(float)
    liga = ((t % 1.2) < 0.7).astype(float)
    add(sfx, t0, s*am*liga*np.minimum(1,t/0.01), 0.16)
def papel(t0, dur=1.2):
    n = int(dur*SR); t = np.arange(n)/SR
    env = np.abs(np.sin(2*np.pi*5*t))*np.exp(-t/0.8)
    add(sfx, t0, (rng.uniform(-1,1,n) - ruido_lp(n,0.2))*env, 0.12)
def risco(t0):
    n = int(0.25*SR); t = np.arange(n)/SR
    add(sfx, t0, (rng.uniform(-1,1,n)-ruido_lp(n,0.1))*np.sin(np.pi*t/0.25), 0.18)
def sino(t0):  # "plim" de caixa registradora
    for f0, d in ((1568, 0), (2093, 0.09)):
        n = int(1.0*SR); t = np.arange(n)/SR
        add(sfx, t0+d, (np.sin(2*np.pi*f0*t)+0.4*np.sin(2*np.pi*2.76*f0*t))*np.exp(-t/0.35), 0.18)
def degrau(t0, m):
    n = int(0.12*SR); t = np.arange(n)/SR
    add(sfx, t0, np.sin(2*np.pi*nota(m)*t)*np.exp(-t/0.05), 0.16)
T = lambda t: t + 0.3
cortes = (4.0, 10.6, 15.52, 20.36, 28.4, 36.38, 44.08, 49.24, 54.5, 60.42)
for t in cortes: vupt(T(t) - 0.2); clique(T(t), 0.35); pop(T(t), 0.18)
for t in (1.74, 2.5, 3.16, 6.38, 6.52, 7.3, 9.1, 10.78, 12.36, 13.14, 17.46, 19.38, 21.26, 23.56, 24.98, 26.94,
          30.88, 32.16, 33.4, 39.9, 40.74, 46.08, 48.2, 51.38, 51.71, 52.46, 54.5, 57.86, 60.72, 61.6, 63.02, 63.62):
    pop(T(t))
for t in (5.52, 35.54, 43.24, 59.48): carimbo(T(t))
assobio(T(5.0), 1.0); carimbo(T(6.0), 0.35)
toque(T(32.52), 2.6); toque(T(37.68), 1.4)
papel(T(14.2), 1.3)
risco(T(21.94))
sino(T(46.78))
for i, m in enumerate((60, 62, 64, 65, 67, 69)): degrau(T(15.6) + i*0.28, m+12)
def salvar(buf, nome):
    k = 0.89/max(1e-9, np.abs(buf).max())
    pcm = (np.clip(buf*k,-1,1)*32767).astype("<i2")
    with wave.open(nome,"wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
salvar(mus, sys.argv[1]+"/trilha.wav"); salvar(sfx, sys.argv[1]+"/efeitos.wav"); print("ok")
