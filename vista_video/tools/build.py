# Gera index.html e compositions/ de "Por que você levanta rápido e a vista escurece?".
# Tempos em segundos, tirados de fala.json. Uso: python tools/build.py
import json, random, os
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FALA = json.load(open(os.path.join(AQUI, "fala.json"), encoding="utf-8"))
def norm(w): return w.lower().strip('.,:;!?…"')
def t(w, n=1):
    c = 0
    for p in FALA:
        if norm(p["w"]) == w:
            c += 1
            if c == n: return round(p["f"] / 30, 2)
    raise KeyError(w)
VERM, CIANO, AMB, TINTA = "#ff3b47", "#33d6ff", "#ffc83d", "#f4f7ff"

# cenas: id, início; a duração vai até a seguinte
CENAS = [("gancho", 0), ("intro", t("por") - .2), ("gravidade", t("quando") - .2), ("alarme", t("só") - .1),
         ("resposta", t("no", 2) - .1), ("atraso", t("quando", 2) - .1), ("quem", t("quem") - .2),
         ("chamada", t("então") + .3), ("siga", t("me") - .1), ("final", FALA[-1]["f"] / 30 + 1.0)]
FIM = round(CENAS[-1][1] + 3.2, 2)

CSS = """
.a{position:absolute}
.tit{font-family:"Archivo Black",sans-serif;line-height:1.04;color:#f4f7ff;text-align:center;left:70px;width:940px;letter-spacing:-.01em}
.sub{font-family:Inter,sans-serif;font-weight:700;line-height:1.22;color:#f4f7ff;text-align:center;left:90px;width:900px}
.stamp{font-family:"Archivo Black",sans-serif;text-align:center;border:7px solid;border-radius:12px;padding:10px 24px;background:rgba(0,0,0,.45);white-space:nowrap}
.card{box-sizing:border-box;left:90px;width:900px;height:124px;border-radius:20px;background:#121b30;border:3px solid #2c3c60;display:flex;align-items:center;padding:0 36px;font:700 54px Inter,sans-serif;color:#f4f7ff;gap:28px}
.n{font-family:"Archivo Black",sans-serif;font-size:50px}
.bar{left:140px;width:800px;height:44px;border-radius:22px;background:#1a2540;overflow:hidden}
.fill{width:100%;height:100%;transform-origin:0 50%;background:#33d6ff;border-radius:22px}
.lab{font:700 34px Inter,sans-serif;letter-spacing:.1em;color:#9fb0d0;left:140px}
.pt{width:20px;height:20px;border-radius:50%;background:#ff3b47}
.anel{border:6px solid #ff3b47;border-radius:50%}
"""

def corpo(prefixo, x=340, y=540, alto=790):
    e = alto / 800
    return f'''<svg id="{prefixo}-corpo" class="a" style="left:{x}px;top:{y}px" width="{400*e:.0f}" height="{alto}" viewBox="0 0 400 800" fill="#16223a" stroke="#41567f" stroke-width="5">
<circle cx="200" cy="72" r="58"/><rect x="172" y="124" width="56" height="44" rx="10"/>
<path d="M118 170q82-26 164 0l18 250q-100 30-200 0z"/><rect x="62" y="176" width="46" height="280" rx="23"/><rect x="292" y="176" width="46" height="280" rx="23"/>
<rect x="122" y="420" width="72" height="364" rx="30"/><rect x="206" y="420" width="72" height="364" rx="30"/></svg>'''

def comp(id, dur, html, js):
    return f'''<!doctype html>
<html><head><meta charset="UTF-8" /></head><body>
<template>
<link rel="stylesheet" href="assets/film.css" />
<style>#root{{position:absolute;inset:0;overflow:hidden}}</style>
<div id="root" data-composition-id="{id}" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
{html}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{js}
window.__timelines["{id}"] = tl;
</script>
</template>
</body></html>
'''
ENT = 'opacity:0,y:34},{opacity:1,y:0,duration:.34,ease:"power3.out"'
def ent(s, at): return f'tl.fromTo("{s}",{{{ENT}}},{at:.2f});\n'
def pop(s, at): return f'tl.fromTo("{s}",{{opacity:0,scale:1.9,rotation:-4}},{{opacity:1,scale:1,rotation:-4,duration:.24,ease:"power4.in"}},{at:.2f});\n'
def sai(s, at): return f'tl.to("{s}",{{opacity:0,duration:.2}},{at:.2f});\n'
def vinheta(id): return f'<div id="{id}" class="a" style="inset:0;opacity:0;background:radial-gradient(circle at 50% 42%,rgba(0,0,0,0) 8%,rgba(0,0,0,.96) 46%,#000 70%)"></div>'

def gancho(ini, d):
    h = f'''<div id="g1" class="a tit" style="top:270px;font-size:124px">LEVANTOU RÁPIDO?</div>
<div id="g2" class="a tit" style="top:560px;font-size:130px;color:{VERM}">A VISTA ESCURECE?</div>
{vinheta("gv")}
<div id="g3" class="a sub" style="top:980px;font-size:60px">seu corpo acabou de perder</div>
<div id="g4" class="a tit" style="top:1070px;font-size:112px;color:{AMB}">UMA CORRIDA</div>'''
    # o gancho já aparece no quadro 0
    js = ent("#g2", t("vista") - ini)
    js += f'tl.fromTo("#gv",{{opacity:0}},{{opacity:.97,duration:.7,ease:"power2.in"}},{t("escurece")-ini:.2f});\n'
    js += f'tl.to("#gv",{{opacity:.35,duration:.4}},{t("seu")-ini-.1:.2f});\n'
    js += ent("#g3", t("seu") - ini) + pop("#g4", t("corrida") - ini - .1)
    return h, js

def intro(ini, d):
    h = f'''<div id="i1" class="a sub" style="top:230px;font-size:58px">por alguns segundos</div>
<div id="i2" class="a tit" style="top:320px;font-size:104px">FALTA SANGUE NA CABEÇA</div>
<div id="i3" class="a" style="left:360px;top:690px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,{VERM},rgba(255,59,71,0) 70%)"></div>
<svg class="a" style="left:430px;top:760px" width="220" height="220" viewBox="0 0 220 220" fill="#16223a" stroke="#41567f" stroke-width="6"><circle cx="110" cy="110" r="96"/></svg>
<div id="i4" class="a stamp" style="left:300px;top:1090px;font-size:58px;color:{AMB};border-color:{AMB}">GUARDA ISSO</div>
<div id="i5" class="a sub" style="top:1210px;font-size:46px">no final, um sinal que você não pode ignorar</div>'''
    js = ent("#i1", .1) + ent("#i2", t("falta") - ini)
    js += f'tl.fromTo("#i3",{{opacity:1,scale:1}},{{opacity:.35,scale:.72,duration:1.2,ease:"power2.out"}},{t("sangue")-ini:.2f});\n'
    js += pop("#i4", t("guarda") - ini) + ent("#i5", t("sinal") - ini - .3)
    return h, js

def gravidade(ini, d):
    r = random.Random(11)
    pts, js = "", ""
    t0 = t("gravidade") - ini
    for i in range(30):
        x = 470 + r.randint(0, 130)
        y0 = 560 + r.randint(0, 160)
        y1 = 1000 + r.randint(0, 300)
        x1 = (440 + r.randint(0, 50)) if i % 2 else (570 + r.randint(0, 50))
        pts += f'<div id="gp{i}" class="a pt" style="left:{x}px;top:{y0}px"></div>\n'
        js += f'tl.fromTo("#gp{i}",{{x:0,y:0}},{{x:{x1-x},y:{y1-y0},duration:{1.5+r.random():.2f},ease:"power2.in"}},{t0+r.random()*1.4:.2f});\n'
    h = f'''<div id="v1" class="a tit" style="top:200px;font-size:78px">A GRAVIDADE PUXA</div>
<div id="v2" class="a sub" style="top:300px;font-size:46px;color:{VERM}">o sangue vai para as pernas e a barriga</div>
<div id="v3" class="a sub" style="top:300px;font-size:46px;color:{AMB}">volta menos sangue ao coração</div>
<div id="v4" class="a lab" style="top:430px">PRESSÃO</div>
<div class="a bar" style="top:476px"><div id="vf" class="fill"></div></div>
{corpo("v",350,540,770)}
{pts}'''
    js = ent("#v1", t0 - .1) + js + ent("#v2", t("puxa") - ini)
    js += sai("#v2", t("volta") - ini - .2) + ent("#v3", t("volta") - ini)
    js += f'tl.to("#vf",{{scaleX:.34,background:"{VERM}",duration:.7,ease:"power2.in"}},{t("pressão")-ini-.2:.2f});\n'
    return h, js

def alarme(ini, d):
    h = f'''<div id="al" class="a" style="inset:0;background:{VERM};opacity:0"></div>
<div id="a1" class="a anel" style="left:290px;top:560px;width:500px;height:500px"></div>
<div id="a2" class="a anel" style="left:290px;top:560px;width:500px;height:500px"></div>
<div id="a3" class="a tit" style="top:690px;font-size:150px">ALARME</div>
<div id="a4" class="a sub" style="top:440px;font-size:60px">só que o seu corpo tem um</div>'''
    js = ent("#a4", .05) + pop("#a3", t("alarme") - ini - .1).replace("rotation:-4", "rotation:0")
    js += 'tl.fromTo("#al",{opacity:0},{opacity:.5,duration:.14,repeat:5,yoyo:true},.1);\n'
    js += 'tl.fromTo("#a1",{scale:.5,opacity:1},{scale:1.6,opacity:0,duration:1,repeat:1},.1);\n'
    js += 'tl.fromTo("#a2",{scale:.5,opacity:1},{scale:1.6,opacity:0,duration:1},.6);\n'
    return h, js

def resposta(ini, d):
    h = f'''<div id="r1" class="a tit" style="top:230px;font-size:68px">SENSORES DE PRESSÃO</div>
<div id="r2" class="a tit" style="top:230px;font-size:68px;color:{CIANO}">AVISAM O CÉREBRO</div>
<div id="r3" class="a tit" style="top:230px;font-size:68px;color:{VERM}">O CORAÇÃO ACELERA</div>
<div id="r4" class="a tit" style="top:230px;font-size:68px;color:{AMB}">OS VASOS APERTAM</div>
<div id="r5" class="a tit" style="top:230px;font-size:68px;color:#5dffa0">A PRESSÃO VOLTA</div>
<div class="a lab" style="top:340px">PRESSÃO</div>
<div class="a bar" style="top:390px"><div id="rf" class="fill" style="background:{VERM}"></div></div>
{corpo("r",345,480,780)}
<svg class="a" style="left:0;top:0" width="1080" height="1920" fill="none">
<path id="rl1" d="M540 625 C 590 610, 590 570, 540 552" stroke="{CIANO}" stroke-width="10" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
<path id="rl2" d="M570 740 C 680 690, 660 590, 556 552" stroke="{CIANO}" stroke-width="10" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
<div id="rs1" class="a" style="left:518px;top:604px;width:44px;height:44px;border-radius:50%;background:{CIANO}"></div>
<div id="rs2" class="a" style="left:548px;top:718px;width:44px;height:44px;border-radius:50%;background:{CIANO}"></div>
<div id="rb" class="a" style="left:490px;top:500px;width:100px;height:100px;border-radius:50%;background:{CIANO};opacity:0"></div>
<div id="rc" class="a" style="left:520px;top:690px;width:90px;height:90px;border-radius:50%;background:{VERM};opacity:0"></div>
<div id="rv0" class="a" style="left:740px;top:820px;width:260px;height:260px;border-radius:50%;border:7px solid {AMB};background:#0a0f1c;opacity:0"></div>
<div id="rv1" class="a" style="left:760px;top:890px;width:220px;height:120px;background:{VERM};opacity:0"></div>'''
    tav, tac, tap, tre = t("avisam") - ini, t("acelera") - ini, t("apertam") - ini, t("em") - ini
    tre = t("recupera") - ini - 1.3
    js = 'tl.set("#rf",{scaleX:.34},0);\n' + ent("#r1", .05)
    js += 'tl.fromTo("#rs1,#rs2",{scale:0},{scale:1,duration:.3,ease:"back.out(3)"},%.2f);\n' % (t("sensores") - ini - .9)
    js += 'tl.to("#rs1,#rs2",{scale:1.35,duration:.3,repeat:5,yoyo:true},%.2f);\n' % (t("sensores") - ini)
    js += sai("#r1", tav - .25) + ent("#r2", tav)
    js += f'tl.to("#rl1,#rl2",{{strokeDashoffset:0,duration:.6,ease:"none"}},{tav+.1:.2f});\n'
    js += f'tl.fromTo("#rb",{{opacity:0,scale:.6}},{{opacity:.8,scale:1.1,duration:.4}},{tav+.7:.2f});\n'
    js += sai("#r2", tac - .3) + ent("#r3", tac)
    js += f'tl.set("#rc",{{opacity:1}},{tac:.2f});\ntl.fromTo("#rc",{{scale:.8}},{{scale:1.3,duration:.16,repeat:11,yoyo:true,ease:"sine.inOut"}},{tac:.2f});\n'
    js += sai("#r3", tap - .3) + ent("#r4", tap)
    js += f'tl.set("#rv0,#rv1",{{opacity:1}},{tap-.2:.2f});\n'
    js += f'tl.to("#rv1",{{scaleY:.42,duration:.7,ease:"power2.inOut"}},{tap:.2f});\n'
    js += sai("#r4", tre - .25) + ent("#r5", tre)
    js += f'tl.to("#rf",{{scaleX:.92,background:"#5dffa0",duration:1.1,ease:"power2.out"}},{tre:.2f});\n'
    return h, js

def atraso(ini, d):
    h = f'''<div id="t1" class="a tit" style="top:220px;font-size:96px">QUANDO A RESPOSTA ATRASA</div>
<div id="t2" class="a sub" style="top:560px;font-size:50px">o sangue demora a chegar na cabeça</div>
<div class="a" style="left:120px;top:800px;width:840px;height:10px;background:#2c3c60"></div>
<div class="a" style="left:950px;top:760px;width:10px;height:90px;background:{TINTA}"></div>
<div id="t3" class="a pt" style="left:120px;top:740px;width:56px;height:56px;background:{AMB}"></div>
<div id="t4" class="a pt" style="left:120px;top:820px;width:56px;height:56px"></div>
<div class="a sub" style="top:910px;font-size:40px;color:#9fb0d0"><span style="color:{AMB}">queda da pressão</span> &nbsp;x&nbsp; <span style="color:{VERM}">resposta do corpo</span></div>
{vinheta("tv")}
<div id="tn" class="a" style="inset:0;background:#000;opacity:0"></div>
<div id="t5" class="a tit" style="top:620px;font-size:118px">A VISTA ESCURECE</div>'''
    js = ent("#t1", .05) + ent("#t2", t("sangue", 4) - ini if False else 2.0)
    js += 'tl.fromTo("#t3",{x:0},{x:780,duration:1.3,ease:"power2.out"},.5);\ntl.fromTo("#t4",{x:0},{x:400,duration:3.2,ease:"none"},.8);\n'
    js += f'tl.fromTo("#tv",{{opacity:0}},{{opacity:1,duration:.8,ease:"power2.in"}},{t("escurece",2)-ini-.2:.2f});\n'
    js += f'tl.to("#tn",{{opacity:.93,duration:.5}},{t("escurece",2)-ini+.1:.2f});\n' + ent("#t5", t("escurece", 2) - ini + .25)
    return h, js

def quem(ini, d):
    itens = [("desidratado", t("desidratado")), ("quem bebeu", t("bebeu")), ("mais idade", t("idade")), ("alguns remédios", t("toma"))]
    h = '<div id="q0" class="a tit" style="top:210px;font-size:92px">QUEM PERDE ESSA CORRIDA?</div>\n'
    js = ""
    for i, (x, at) in enumerate(itens):
        h += f'<div id="q{i+1}" class="a card" style="top:{450+i*142}px"><span class="n" style="color:{AMB}">{i+1}</span>{x}</div>\n'
        js += ent(f"#q{i+1}", at - ini - .15)
    h += f'<div id="q5" class="a sub" style="top:1020px;font-size:46px;color:{AMB}">como diuréticos e outros remédios de pressão</div>\n'
    h += f'<div id="q6" class="a stamp" style="left:170px;top:1170px;font-size:42px;color:{VERM};border-color:{VERM}">NÃO PARE POR CONTA PRÓPRIA</div>'
    js = ent("#q0", .05) + js + ent("#q5", t("diuréticos") - ini - .1) + pop("#q6", t("pare") - ini)
    return h, js

def chamada(ini, d):
    h = f'''<div id="c1" class="a tit" style="top:230px;font-size:128px;color:#5dffa0">LEVANTE DEVAGAR</div>
<div id="c2" class="a card" style="top:600px;height:170px;font-size:52px">Acontece sempre? Avise seu médico</div>
<div id="c3" class="a card" style="top:800px;height:170px;font-size:52px;border-color:{VERM}">Desmaiou? Procure atendimento</div>
<div id="c4" class="a sub" style="top:1060px;font-size:56px;color:{AMB}">Manda para quem vive levantando tonto</div>'''
    js = pop("#c1", t("levante") - ini - .1).replace("rotation:-4", "rotation:0")
    js += ent("#c2", t("acontece") - ini - .1) + ent("#c3", t("desmaiar") - ini - .1) + ent("#c4", t("manda") - ini - .1)
    return h, js

def siga(ini, d):
    h = '''<img id="s1" class="a" src="assets/logo.jpg" alt="" style="left:340px;top:330px;width:400px;height:400px;border-radius:50%" />
<div id="s2" class="a tit" style="top:790px;font-size:130px">ME SIGA</div>
<div id="s3" class="a sub" style="top:950px;font-size:50px">para mais dicas de farmacologia e curiosidades sobre a área</div>'''
    return h, 'tl.fromTo("#s1",{opacity:0,scale:.8},{opacity:1,scale:1,duration:.35,ease:"back.out(2)"},.05);\n' + ent("#s2", .15) + ent("#s3", .5)

def final(ini, d):
    h = f'''<div id="f1" class="a sub" style="top:640px;font-size:78px;font-weight:500">Consulte um</div>
<div id="f2" class="a tit" style="top:750px;font-size:92px;color:{CIANO}">PROFISSIONAL DE SAÚDE</div>
<div id="f3" class="a sub" style="top:980px;font-size:78px;font-weight:500">para orientações.</div>'''
    return h, ent("#f1", .1) + ent("#f2", .3) + ent("#f3", .5)

F = dict(gancho=gancho, intro=intro, gravidade=gravidade, alarme=alarme, resposta=resposta, atraso=atraso, quem=quem, chamada=chamada, siga=siga, final=final)
os.makedirs(os.path.join(AQUI, "compositions"), exist_ok=True)
open(os.path.join(AQUI, "assets", "film.css"), "w", encoding="utf-8").write('''@font-face{font-family:"Archivo Black";src:url("fonts/archivo-black.woff2");font-weight:400}
''' + CSS)
hosts = ""
for i, (id, ini) in enumerate(CENAS):
    fim = CENAS[i + 1][1] if i + 1 < len(CENAS) else FIM
    d = round(fim - ini, 2)
    h, js = F[id](ini, d)
    open(os.path.join(AQUI, "compositions", id + ".html"), "w", encoding="utf-8").write(comp(id, d, h, js))
    hosts += f'      <div id="{id}" class="clip" data-composition-id="{id}" data-composition-src="compositions/{id}.html" data-start="{ini}" data-duration="{d}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>\n'

# efeitos: [quando, arquivo, volume]
SFX = [(c[1], "whoosh-medium-soft", .3) for c in CENAS[1:9]]
SFX += [(t("escurece"), "impact-medium-firm", .3), (t("corrida") - .1, "impact-medium-firm", .3), (t("guarda"), "pop-medium-in", .25),
        (t("pressão"), "impact-medium-firm", .3), (t("sensores"), "pop-medium-in", .22), (t("avisam"), "pop-medium-in", .22),
        (t("escurece", 2), "impact-medium-firm", .32), (t("desidratado"), "pop-medium-in", .22), (t("bebeu"), "pop-medium-in", .22),
        (t("idade"), "pop-medium-in", .22), (t("toma"), "pop-medium-in", .22), (t("pare"), "impact-medium-firm", .32),
        (t("levante"), "notification-attention-clear", .25), (CENAS[-1][1] - .1, "sting-bright-short", .5)]
sfx = ""
for i, (at, nome, v) in enumerate(SFX):
    sfx += f'      <audio id="sfx{i}" class="clip" src="assets/sfx/{nome}.wav" data-start="{at:.2f}" data-duration="1.5" data-track-index="{5+i%3}" data-volume="{v}"></audio>\n'
voz = round(FALA[-1]["f"] / 30 + 1, 2)
open(os.path.join(AQUI, "index.html"), "w", encoding="utf-8").write(f'''<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Vista escurece ao levantar</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/film.css" />
    <style>
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #0a0f1c; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; background: radial-gradient(circle at 50% 38%, #16213c, #0a0f1c 70%); }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{FIM}" data-width="1080" data-height="1920">
{hosts}      <audio id="voz" class="clip" src="assets/narracao.mp3" data-start="0" data-duration="{voz}" data-track-index="3" data-volume="1"></audio>
      <audio id="trilha" class="clip" src="assets/musica.wav" data-start="0" data-duration="{FIM}" data-track-index="4" data-volume="1"></audio>
{sfx}    </div>
    <script>window.__timelines = window.__timelines || {{}}; const tl = gsap.timeline({{ paused: true }}); window.__timelines["main"] = tl;</script>
  </body>
</html>
''')
print("cenas", [(c[0], c[1]) for c in CENAS], "fim", FIM)
