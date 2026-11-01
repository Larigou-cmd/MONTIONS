// Gera compositions/*.html e index.html do vídeo da Lei 8.142. Uso: node tools/build.mjs
// Tempos em segundos da narração (fala.json). Depois de gerar, Studio edita os HTML normalmente.
import fs from "node:fs";

const FIM = 478; // fim do vídeo
const FIM_FALA = 471.84;
const OURO = "#ffd92e", VERM = "#c62f1e", VERDE = "#0e6b52", TINTA = "#1b1a17", CINZA = "#6b6557";
const cenas = [];
const sfx = [];
const sons = (t, nome, vol) => sfx.push([t, nome, vol]);

function esc(s) { return s; }

class Cena {
  constructor(id, ini, fim, parte) {
    Object.assign(this, { id, ini, fim, parte, html: [], tw: [], n: 0 });
    sons(ini, "whoosh-medium-soft", 0.26);
    cenas.push(this);
  }
  rel(at) { return +(at - this.ini).toFixed(2); }
  nid() { return `${this.id}-e${++this.n}`; }
  entra(id, at, como = "sobe") {
    const t = this.rel(at);
    const a = {
      sobe: [`{opacity:0,y:26}`, `{opacity:1,y:0,duration:.4,ease:"power3.out"}`],
      lado: [`{opacity:0,x:-40}`, `{opacity:1,x:0,duration:.4,ease:"power3.out"}`],
      pop: [`{opacity:0,scale:.7}`, `{opacity:1,scale:1,duration:.35,ease:"back.out(2)"}`],
      nada: [`{opacity:0}`, `{opacity:1,duration:.3}`],
    }[como];
    this.tw.push(`tl.fromTo("#${id}",${a[0]},${a[1]},${t});`);
  }
  // texto solto
  t(html, { x = 120, y, w = 1680, size = 44, font = "corpo", cor = TINTA, at = this.ini + 0.1, como = "sobe", align = "left", extra = "" }) {
    const id = this.nid();
    this.html.push(`<div id="${id}" class="txt f-${font}" style="left:${x}px;top:${y}px;width:${w}px;font-size:${size}px;color:${cor};text-align:${align};${extra}">${html}</div>`);
    this.entra(id, at, como);
    return id;
  }
  // caixa de papel
  caixa(html, { x, y, w, h, at, fundo = "#fffdf7", borda = TINTA, como = "sobe", extra = "", som = false }) {
    const id = this.nid();
    this.html.push(`<div id="${id}" class="caixa" style="left:${x}px;top:${y}px;width:${w}px;${h ? `height:${h}px;` : ""}background:${fundo};border-color:${borda};${extra}">${html}</div>`);
    this.entra(id, at, como);
    if (som) sons(at, "pop-medium-in", 0.14);
    return id;
  }
  // lei seca: use [[trecho|tempo]] ou [[trecho|tempo|v]] para grifo (v = vermelho)
  lei(texto, { x = 120, y = 150, w = 1680, size = 44, at = this.ini + 0.3, rot = "LEI SECA" }) {
    const id = this.nid(), cw = `${id}-w`;
    const palavras = (s) => s.split(/(\s+)/).map((p) => (p.trim() ? `<span class="${cw} pal">${p}</span>` : p)).join("");
    let corpo = "", i = 0, m;
    const re = /\[\[(.+?)\|([\d.]+)(\|v)?\]\]/g;
    let ult = 0, g = 0;
    while ((m = re.exec(texto))) {
      corpo += palavras(texto.slice(ult, m.index));
      const gid = `${id}-g${++g}`;
      const cls = m[3] ? "grifo gv" : "grifo";
      corpo += `<span id="${gid}" class="${cls}">${palavras(m[1])}</span>`;
      this.tw.push(`tl.fromTo("#${gid}",{backgroundSize:"0% 100%"},{backgroundSize:"100% 100%",duration:.45,ease:"power2.out"},${this.rel(+m[2])});`);
      ult = m.index + m[0].length;
    }
    corpo += palavras(texto.slice(ult));
    corpo = corpo.replace(/\n/g, '<div class="vao"></div>');
    this.html.push(`<div id="${id}" class="lei" style="left:${x}px;top:${y}px;width:${w}px;"><div class="rot">${rot}</div><div class="f-lei" style="font-size:${size}px">${corpo}</div></div>`);
    this.tw.push(`tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:.2},${this.rel(at)});`);
    this.tw.push(`tl.fromTo(".${cw}",{opacity:0},{opacity:1,duration:.1,stagger:.022},${this.rel(at + 0.05)});`);
    return id;
  }
  // carimbo
  carimbo(texto, { x, y, at, cor = VERM, size = 72, rot = -7 }) {
    const id = this.nid();
    this.html.push(`<div id="${id}" class="carimbo" style="left:${x}px;top:${y}px;font-size:${size}px;color:${cor};border-color:${cor};">${texto}</div>`);
    this.tw.push(`tl.fromTo("#${id}",{opacity:0,scale:1.9,rotation:${rot}},{opacity:1,scale:1,rotation:${rot},duration:.16,ease:"power4.in"},${this.rel(at) - 0.12});`);
    this.tw.push(`tl.fromTo("#${this.id}-palco",{x:0,y:0},{immediateRender:false,keyframes:[{x:7,y:-4,duration:.04},{x:-5,y:3,duration:.05},{x:3,y:-1,duration:.05},{x:0,y:0,duration:.06}]},${this.rel(at) + 0.04});`);
    sons(at, "impact-medium-firm", 0.3);
  }
  // pegadinha: frase falsa, risco, carimbo e correção
  peg({ y = 340, frase, at, err, fix, certo, size = 74, h = 300 }) {
    this.t(`<span class="selo">Pegadinha de banca</span>`, { y: y - 72, size: 30, at: at - 0.05, font: "tit" });
    const id = this.nid();
    this.html.push(`<div id="${id}" class="f-falsa" style="left:120px;top:${y}px;width:1270px;font-size:${size}px;"><span id="${id}-r" class="risco">“${frase}”</span></div>`);
    this.entra(id, at);
    this.tw.push(`tl.fromTo("#${id}-r",{backgroundSize:"0% 6px"},{backgroundSize:"100% 6px",duration:.35,ease:"power2.inOut"},${this.rel(err)});`);
    this.carimbo("ERRADO", { x: 1440, y: y - 70, at: err, size: 62 });
    if (certo) this.t(`✓ ${certo}`, { y: y + h - 70, size: 50, cor: VERDE, font: "cheio", at: fix });
  }
  // seta horizontal
  seta(x, y, len, at, cor = TINTA) {
    const id = this.nid();
    this.html.push(`<div id="${id}" class="seta" style="left:${x}px;top:${y}px;width:${len}px;background:${cor};color:${cor}"></div>`);
    this.tw.push(`tl.fromTo("#${id}",{scaleX:0},{scaleX:1,duration:.35,ease:"power2.out"},${this.rel(at)});`);
  }
  // barra que cresce
  barra({ x, y, w, h, at, cor, html = "", ink = "#fff", size = 44 }) {
    const id = this.nid();
    this.html.push(`<div id="${id}" class="barra f-cheio" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${cor};color:${ink};font-size:${size}px;">${html}</div>`);
    this.tw.push(`tl.fromTo("#${id}",{scaleX:0},{scaleX:1,duration:.55,ease:"power3.out"},${this.rel(at)});`);
  }
  arquivo() {
    const dur = +(this.fim - this.ini).toFixed(2);
    return `<!doctype html>
<html><head><meta charset="UTF-8" /></head><body>
<template>
<link rel="stylesheet" href="assets/film.css" />
<style>#root{position:absolute;inset:0;overflow:hidden}</style>
<div id="root" data-composition-id="${this.id}" data-start="0" data-duration="${dur}" data-width="1920" data-height="1080">
<div id="${this.id}-camera" class="camera"><div id="${this.id}-palco" class="palco">
${this.html.join("\n")}
</div></div>
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.fromTo("#${this.id}-camera",{scale:1},{scale:1.022,duration:${dur},ease:"none"},0);
tl.fromTo("#${this.id}-palco",{opacity:0},{opacity:1,duration:.18},0);
${this.tw.join("\n")}
window.__timelines["${this.id}"] = tl;
</script>
</template>
</body></html>
`;
  }
}

// ---------- CENAS ----------
let s;

s = new Cena("abertura", 0, 19.3, "ABERTURA");
s.t("Legislação do SUS para concursos", { y: 130, size: 36, font: "tit", cor: CINZA, at: 0.05 });
s.t("Lei 8.142", { y: 190, size: 260, font: "tit", at: 0.2, extra: "letter-spacing:-.03em;line-height:1;" });
s.t("só 7 artigos", { y: 470, size: 84, font: "lei", at: 2.6 });
for (let i = 0; i < 7; i++) s.caixa(`<b>${i + 1}º</b>`, { x: 700 + i * 150, y: 462, w: 130, h: 120, at: 2.7 + i * 0.09, como: "pop", extra: "display:grid;place-items:center;font:900 44px Inter;" });
s.t("cheia de <span class='m'>números</span> e <span class='m'>palavras</span> que a banca adora trocar", { y: 640, size: 56, font: "cheio", at: 8.2 });
s.t("Hoje: lei seca + cada detalhe", { y: 790, size: 50, font: "lei", at: 13.5 });
s.carimbo("PEGA PAPEL E CANETA", { x: 900, y: 860, at: 17.2, cor: VERDE, size: 52, rot: -3 });

s = new Cena("mapa", 19.3, 48.8, "QUE LEI É ESSA?");
s.t("19 set 1990", { x: 180, y: 170, w: 500, size: 50, font: "tit", at: 26.0 });
s.t("Lei 8.080", { x: 180, y: 240, w: 500, size: 72, font: "lei", at: 26.7 });
s.seta(620, 262, 480, 24.5);
s.t("3 meses depois", { x: 640, y: 192, w: 440, size: 34, font: "cheio", cor: CINZA, at: 24.6, align: "center" });
s.t("28 dez 1990", { x: 1160, y: 170, w: 640, size: 50, font: "tit", at: 21.9 });
s.t("Lei 8.142", { x: 1160, y: 240, w: 640, size: 72, font: "lei", at: 20.5 });
s.caixa(`<div class="ct">participação da comunidade</div><div class="cs">na gestão do SUS</div>`, { x: 120, y: 450, w: 820, h: 300, at: 32.6, fundo: OURO, extra: "padding:44px;" });
s.caixa(`<div class="ct">transferências de recursos</div><div class="cs">entre os governos</div>`, { x: 980, y: 450, w: 820, h: 300, at: 35.8, extra: "padding:44px;" });
s.t("Art. 1º → quem participa", { x: 120, y: 800, w: 820, size: 46, font: "cheio", at: 41.7 });
s.t("Arts. 2º a 4º → o dinheiro", { x: 980, y: 800, w: 820, size: 46, font: "cheio", at: 44.7 });

s = new Cena("art1", 48.8, 74.7, "ART. 1º");
s.lei("Art. 1º O Sistema Único de Saúde (SUS) [...] contará, [[em cada esfera de governo|56.5]], [[sem prejuízo das funções do Poder Legislativo|65.6]], com as seguintes instâncias colegiadas:\nI - a [[Conferência de Saúde|52.7]]; e\nII - o [[Conselho de Saúde|54.5]].", { w: 1060, size: 44, at: 49.0 });
for (const [i, [n, t]] of [["União", 59.3], ["Estados", 60.3], ["Distrito Federal", 61.2], ["Municípios", 62.8]].entries())
  s.caixa(`<div class="ct" style="font-size:44px">${n}</div>`, { x: 1270, y: 170 + i * 118, w: 530, h: 98, at: t, como: "lado", som: true, extra: "padding:18px 30px;" });
s.t("Conferência e Conselho <b>não tiram</b> nenhuma função do Legislativo.", { x: 1270, y: 680, w: 530, size: 40, font: "corpo", at: 71.5 });

s = new Cena("peg1", 74.7, 83.6, "PEGADINHA");
s.peg({ frase: "As instâncias colegiadas existem apenas na esfera federal.", at: 76.0, err: 80.1, fix: 81.1, certo: "Existem em cada esfera de governo.", h: 400 });

s = new Cena("conf", 83.6, 105.7, "ART. 1º, § 1º");
s.lei("§ 1º A Conferência de Saúde reunir-se-á [[a cada quatro anos|85.6]] com a representação dos vários segmentos sociais, para [[avaliar|88.6]] a situação de saúde e [[propor as diretrizes|90.8]] para a formulação da política de saúde nos níveis correspondentes, convocada pelo [[Poder Executivo|96.8]] ou, [[extraordinariamente|99.2]], [[por esta|102.7]] ou [[pelo Conselho de Saúde|104.0]].", { w: 1120, size: 42, at: 83.8 });
s.t("4", { x: 1340, y: 130, w: 460, size: 300, font: "tit", at: 85.7, align: "center", como: "pop", extra: "line-height:1;" });
s.t("anos", { x: 1340, y: 430, w: 460, size: 60, font: "cheio", at: 86.0, align: "center" });
s.caixa(`<div class="ct" style="font-size:52px">propõe</div><div class="cs">não decide</div>`, { x: 1340, y: 560, w: 460, h: 190, at: 94.4, fundo: OURO, extra: "padding:24px 34px;" });

s = new Cena("peg2", 105.7, 122, "PEGADINHAS");
s.peg({ y: 200, size: 56, frase: "A Conferência se reúne a cada dois anos.", at: 107.3, err: 110.3, fix: 111.2, certo: "A cada quatro anos.", h: 210 });
s.peg({ y: 590, size: 56, frase: "A Conferência é convocada somente pelo Poder Executivo.", at: 112.4, err: 116.6, fix: 117.9, certo: "Extraordinariamente, também por ela mesma ou pelo Conselho.", h: 290 });

s = new Cena("conselho1", 122, 141.5, "ART. 1º, § 2º");
s.t("Conselho é o oposto da Conferência", { y: 130, size: 64, font: "tit", at: 122.2 });
s.caixa(`<div class="cs">Conferência</div><div class="ct" style="font-size:54px">a cada 4 anos</div><div class="cs" style="margin-top:14px">avalia e propõe</div>`, { x: 120, y: 260, w: 820, h: 280, at: 124.0, extra: "padding:36px 44px;" });
s.caixa(`<div class="cs" style="color:#3a3200">Conselho</div><div class="ct" style="font-size:54px">permanente</div>`, { x: 980, y: 260, w: 820, h: 140, at: 126.9, fundo: OURO, extra: "padding:18px 44px;" });
s.caixa(`<div class="ct" style="font-size:54px">deliberativo: decide</div>`, { x: 980, y: 420, w: 820, h: 120, at: 131.4, fundo: OURO, extra: "padding:26px 44px;" });
for (const [i, [n, t]] of [["governo", 136.5], ["prestadores de serviço", 137.5], ["profissionais de saúde", 139.1], ["usuários", 140.7]].entries())
  s.t(n, { x: 120 + [0, 300, 860, 1420][i], y: 660, w: [280, 540, 540, 380][i], size: 42, font: "cheio", at: t, como: "pop" });
s.t("4 segmentos", { y: 590, size: 40, font: "tit", cor: CINZA, at: 134.9 });

s = new Cena("conselho2", 141.5, 160.4, "ART. 1º, § 2º");
s.lei("§ 2º O Conselho de Saúde, em caráter permanente e deliberativo, [...] atua na [[formulação de estratégias|142.6]] e no [[controle da execução|144.5]] da política de saúde na instância correspondente, [[inclusive nos aspectos econômicos e financeiros|147.4]], cujas decisões serão [[homologadas pelo chefe do poder legalmente constituído|152.8]] em cada esfera do governo.", { w: 1680, size: 46, at: 141.7 });
s.t("No município:", { x: 120, y: 640, w: 500, size: 50, font: "cheio", at: 157.6 });
s.carimbo("O PREFEITO", { x: 560, y: 620, at: 159.3, cor: VERDE, size: 70, rot: -3 });

s = new Cena("peg3", 160.4, 169.1, "PEGADINHA");
s.peg({ frase: "O Conselho de Saúde tem caráter temporário e consultivo.", at: 161.7, err: 165.8, fix: 166.8, certo: "Permanente e deliberativo.", h: 400 });

s = new Cena("conass", 169.1, 179.5, "ART. 1º, § 3º");
s.t("Quem mais tem cadeira?", { y: 110, size: 62, font: "tit", at: 169.2 });
s.t("Conselho Nacional de Saúde", { x: 120, y: 700, w: 1680, size: 74, font: "tit", at: 177.6, align: "center" });
s.caixa(`<div class="ct">Conass</div><div class="cs">secretários estaduais</div>`, { x: 200, y: 230, w: 700, h: 240, at: 171.3, fundo: OURO, extra: "padding:40px 48px;" });
s.caixa(`<div class="ct">Conasems</div><div class="cs">secretários municipais</div>`, { x: 1020, y: 230, w: 700, h: 240, at: 173.9, extra: "padding:40px 48px;" });
s.t("têm representação no", { y: 550, size: 50, font: "lei", at: 176.0, align: "center" });

s = new Cena("paridade", 179.5, 220.5, "ART. 1º, § 4º");
s.lei("§ 4º A representação dos [[usuários|183.8]] [...] será [[paritária|184.6]] em relação ao [[conjunto dos demais segmentos|186.3]].", { y: 130, size: 46, at: 179.7 });
s.barra({ x: 120, y: 500, w: 836, h: 220, at: 190.5, cor: TINTA, html: "usuários", size: 58 });
s.barra({ x: 964, y: 500, w: 416, h: 220, at: 192.1, cor: VERDE, html: "trabalhadores", size: 40 });
s.barra({ x: 1388, y: 500, w: 412, h: 220, at: 192.6, cor: "#7a6a2c", html: "governo e prestadores", size: 38 });
s.t("metade das vagas", { x: 120, y: 410, w: 836, size: 48, font: "cheio", at: 196.5 });
s.t("Não está na lei → Resolução CNS 453/2012", { y: 330, w: 1680, size: 40, font: "cheio", cor: VERM, at: 198.6 });
s.t("50%", { x: 120, y: 730, w: 836, size: 110, font: "tit", at: 207.4, align: "center", como: "pop" });
s.t("25%", { x: 964, y: 730, w: 416, size: 110, font: "tit", cor: VERDE, at: 209.6, align: "center", como: "pop" });
s.t("25%", { x: 1388, y: 730, w: 412, size: 110, font: "tit", cor: "#7a6a2c", at: 212.7, align: "center", como: "pop" });
s.t("Vale para Conselhos <span class='m'>e Conferências</span>", { y: 900, size: 46, font: "cheio", at: 217.1 });

s = new Cena("regimento", 220.5, 229.1, "ART. 1º, § 5º");
s.lei("§ 5º As Conferências de Saúde e os Conselhos de Saúde terão sua organização e normas de funcionamento definidas em [[regimento próprio|224.8]], [[aprovadas pelo respectivo conselho|226.1]].", { y: 240, size: 54, at: 220.7 });

s = new Cena("peg4", 229.1, 249.7, "PEGADINHAS");
s.peg({ y: 200, size: 52, frase: "Paritária em relação a cada um dos demais segmentos.", at: 230.9, err: 234.9, fix: 235.9, certo: "Em relação ao conjunto.", h: 260 });
s.peg({ y: 620, size: 52, frase: "A Lei 8.142 fixa em 50% a representação dos usuários.", at: 238.0, err: 244.0, fix: 245.2, certo: "A lei fala em paridade; o percentual está na resolução.", h: 270 });

s = new Cena("art2", 249.7, 289.1, "ART. 2º");
s.t("Agora, o dinheiro", { y: 120, size: 60, font: "tit", at: 249.8 });
s.caixa(`<div style="font:900 96px Inter">FNS</div><div class="cs">Fundo Nacional de Saúde</div>`, { x: 120, y: 330, w: 460, h: 300, at: 254.8, fundo: TINTA, borda: TINTA, extra: "color:#fff;padding:60px 36px;text-align:center;" });
for (const [i, [rom, txt, t]] of [["I", "custeio e capital do Ministério da Saúde", 256.8], ["II", "investimentos previstos em lei orçamentária", 260.6], ["III", "investimentos do Plano Quinquenal do Ministério", 264.4], ["IV", "cobertura das ações e serviços de saúde de Municípios, Estados e DF", 269.1]].entries()) {
  s.seta(590, 268 + i * 142, 120, t);
  s.caixa(`<span class="rom">${rom}</span><span>${txt}</span>`, { x: 730, y: 212 + i * 142, w: 1070, h: 124, at: t, fundo: i === 3 ? OURO : "#fffdf7", como: "lado", extra: "display:flex;gap:26px;align-items:center;padding:0 28px;font:700 36px Inter;" });
}
s.t("Grave o inciso IV", { x: 120, y: 690, w: 460, size: 44, font: "cheio", cor: VERM, at: 276.0 });
s.t("rede de serviços · ambulatorial e hospitalar · demais ações", { x: 120, y: 860, w: 1680, size: 40, font: "corpo", at: 281.5 });

s = new Cena("art3", 289.1, 310.7, "ART. 3º");
s.lei("Art. 3º Os recursos referidos no inciso IV do art. 2º [...] serão repassados de forma [[regular e automática|289.9]] para os Municípios, Estados e Distrito Federal [...].\n§ 2º [...] [[pelo menos setenta por cento|296.9]], aos Municípios, afetando-se o restante aos Estados.", { y: 130, size: 42, at: 289.3 });
s.barra({ x: 120, y: 540, w: 1176, h: 170, at: 297.3, cor: VERDE, html: "≥ 70% Municípios", size: 58 });
s.barra({ x: 1304, y: 540, w: 496, h: 170, at: 300.4, cor: TINTA, html: "restante: Estados", size: 36 });
s.t("<span class='m'>Pelo menos</span>: é um mínimo", { y: 730, size: 46, font: "cheio", at: 302.4 });
s.t("§ 3º Municípios <b>poderão</b> formar consórcio e remanejar recursos entre si", { y: 830, size: 42, font: "corpo", at: 305.6 });

s = new Cena("cuidado", 310.7, 343.1, "ATENÇÃO");
s.t("Um cuidado", { y: 120, size: 60, font: "tit", cor: VERM, at: 310.8 });
s.caixa(`<div class="cs">Lei 8.142</div><div class="ct" style="font-size:44px">art. 3º, § 1º</div>`, { x: 120, y: 260, w: 460, h: 200, at: 312.8, extra: "padding:34px;" });
s.seta(590, 354, 130, 318.0);
s.caixa(`<div class="cs">Lei 8.080</div><div class="ct" style="font-size:44px">art. 35, § 1º</div>`, { x: 730, y: 260, w: 460, h: 200, at: 319.5, extra: "padding:34px;" });
s.carimbo("REVOGADO", { x: 770, y: 400, at: 323.6, size: 54 });
s.seta(1200, 354, 130, 325.0, VERDE);
s.caixa(`<div class="cs">LC 141/2012</div><div class="ct" style="font-size:44px">art. 17: rateio</div>`, { x: 1340, y: 260, w: 460, h: 200, at: 325.4, fundo: OURO, extra: "padding:34px;" });
s.t("Prova de lei seca → texto da 8.142", { y: 610, size: 54, font: "cheio", at: 331.2 });
s.t("Regras atuais de rateio → LC 141", { y: 720, size: 54, font: "cheio", cor: VERDE, at: 336.6 });

s = new Cena("peg5", 343.1, 354.5, "PEGADINHAS");
s.peg({ y: 200, size: 60, frase: "No máximo setenta por cento.", at: 344.9, err: 347.0, fix: 348.2, certo: "Pelo menos.", h: 230 });
s.peg({ y: 600, size: 60, frase: "Os Municípios deverão formar consórcio.", at: 349.7, err: 352.6, fix: 353.5, certo: "Poderão.", h: 230 });

// macete FCP RCC
const REQ = [["F", "Fundo de Saúde", 360.0, 364.8], ["C", "Conselho de Saúde", 361.0, 365.6], ["P", "Plano de saúde", 361.7, 366.5], ["R", "Relatórios de gestão", 362.9, 368.1], ["C", "Contrapartida", 363.9, 369.9], ["C", "Comissão do PCCS", 364.2, 371.1]];
s = new Cena("art4", 354.5, 375.8, "ART. 4º");
s.t("Para receber: 6 requisitos", { y: 120, size: 62, font: "tit", at: 355.0 });
REQ.forEach(([l, n, a, b], i) => {
  s.t(l, { x: 120 + i * 283, y: 270, w: 270, size: 200, font: "tit", at: a, align: "center", como: "pop", cor: i < 3 ? TINTA : VERDE, extra: "line-height:1;" });
  s.t(n, { x: 120 + i * 283, y: 500, w: 270, size: 36, font: "cheio", at: b, align: "center" });
  sons(a, "pop-medium-in", 0.14);
});
s.carimbo("PCCS: 2 ANOS", { x: 1280, y: 720, at: 373.8, cor: VERDE, size: 56, rot: -3 });

s = new Cena("naocumpre", 375.8, 395.7, "ART. 4º, PARÁGRAFO ÚNICO");
s.t("E se não cumprir?", { y: 120, size: 72, font: "tit", at: 375.9 });
s.t("O dinheiro não some: outro ente administra.", { y: 240, size: 48, font: "lei", at: 381.8 });
s.caixa(`<div class="ct">Município</div>`, { x: 120, y: 430, w: 500, h: 150, at: 388.2, extra: "padding:42px;text-align:center;" });
s.seta(630, 500, 200, 389.9);
s.caixa(`<div class="ct">Estado</div>`, { x: 840, y: 430, w: 500, h: 150, at: 390.9, fundo: OURO, extra: "padding:42px;text-align:center;", som: true });
s.caixa(`<div class="ct">Estado ou DF</div>`, { x: 120, y: 690, w: 500, h: 150, at: 392.5, extra: "padding:42px;text-align:center;" });
s.seta(630, 760, 200, 393.9);
s.caixa(`<div class="ct">União</div>`, { x: 840, y: 690, w: 500, h: 150, at: 394.7, fundo: OURO, extra: "padding:42px;text-align:center;", como: "pop", som: true });

s = new Cena("peg6", 395.7, 403.5, "PEGADINHA");
s.peg({ frase: "Se o Município não cumprir, os recursos serão administrados pela União.", at: 396.0, err: 401.2, fix: 402.2, certo: "Pelo Estado.", h: 400, size: 66 });

s = new Cena("trio", 403.5, 423.7, "PARA IR ALÉM");
s.t("Lei Complementar 141/2012", { y: 120, size: 60, font: "tit", at: 405.9 });
s.t("Condicionar repasses regulares e automáticos: só a", { y: 215, size: 42, font: "corpo", at: 407.8 });
REQ.forEach(([l, n], i) => {
  const trio = i < 3;
  s.t(l, { x: 120 + i * 283, y: 330, w: 270, size: 200, font: "tit", at: trio ? [412.5, 413.4, 414.4][i] : 415.9, align: "center", como: "pop", cor: trio ? TINTA : "#cbc3ae", extra: "line-height:1;" });
  s.t(n, { x: 120 + i * 283, y: 560, w: 270, size: 34, font: "cheio", at: trio ? [412.5, 413.4, 414.4][i] : 415.9, align: "center", cor: trio ? TINTA : "#8d8672" });
});
s.t("Questão pede a letra da Lei 8.142? <span class='m'>Continue com os seis.</span>", { y: 780, size: 50, font: "cheio", at: 418.2 });

s = new Cena("art5", 423.7, 436.8, "ARTS. 5º A 7º");
s.lei("Art. 5º É o [[Ministério da Saúde|426.5]], mediante [[portaria do Ministro de Estado|430.6]], autorizado a estabelecer condições para aplicação desta lei.", { y: 170, size: 54, at: 424.9 });
s.t("Art. 6º vigência · Art. 7º revogação", { y: 560, size: 50, font: "cheio", cor: CINZA, at: 432.6 });

s = new Cena("resumo", 436.8, 469.3, "RESUMO");
s.t("Resumindo", { y: 110, size: 62, font: "tit", at: 436.9 });
[["Conferência: a cada 4 anos, avalia e propõe", 437.8], ["Conselho: permanente, deliberativo, homologado pelo chefe do poder", 442.9], ["Usuários: paritários ao conjunto dos demais segmentos", 449.6], ["Repasse regular e automático: pelo menos 70% aos Municípios", 454.7], ["6 requisitos: quem não cumpre, Estado ou União administra", 461.3]].forEach(([tx, t], i) => {
  s.t(String(i + 1), { x: 120, y: 240 + i * 150, w: 110, size: 104, font: "tit", at: t, como: "pop", cor: VERDE, extra: "line-height:1.05;" });
  s.t(tx, { x: 250, y: 256 + i * 150, w: 1550, size: 46, font: "cheio", at: t + 0.15 });
  sons(t, "pop-medium-in", 0.12);
});

s = new Cena("final", 469.3, FIM, "ATÉ O PRÓXIMO");
s.t("Me siga", { y: 240, size: 170, font: "tit", at: 469.4, align: "center" });
s.t("para mais dicas sobre leis", { y: 450, size: 66, font: "lei", at: 470.0, align: "center" });
s.t("Bons estudos!", { y: 640, size: 110, font: "lei", cor: VERDE, at: 473.0, align: "center" });
s.t("Fonte: Lei nº 8.142/1990; LC nº 141/2012; Resolução CNS nº 453/2012.", { y: 830, size: 32, font: "corpo", cor: CINZA, at: 473.6, align: "center" });
sons(475.3, "sting-airy-short", 1);

// ---------- HUD (faixa do topo e progresso) ----------
const hudHtml = cenas.map((c, i) => `<div id="hud-p${i}" class="clip hud-parte" data-start="${c.ini}" data-duration="${+(c.fim - c.ini).toFixed(2)}" data-track-index="1">Lei 8.142/1990 · ${c.parte}</div>`).join("\n");
const hud = `<!doctype html>
<html><head><meta charset="UTF-8" /></head><body>
<template>
<link rel="stylesheet" href="assets/film.css" />
<style>#root{position:absolute;inset:0;overflow:hidden}</style>
<div id="root" data-composition-id="hud" data-start="0" data-duration="${FIM_FALA}" data-width="1920" data-height="1080">
${hudHtml}
<div id="hud-trilho"></div><div id="hud-barra"></div>
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.fromTo("#hud-barra",{scaleX:0},{scaleX:1,duration:${FIM_FALA},ease:"none"},0);
window.__timelines["hud"] = tl;
</script>
</template>
</body></html>
`;

// ---------- escrita ----------
fs.mkdirSync("compositions", { recursive: true });
for (const f of fs.readdirSync("compositions")) fs.unlinkSync(`compositions/${f}`);
for (const c of cenas) fs.writeFileSync(`compositions/${c.id}.html`, c.arquivo());
fs.writeFileSync("compositions/hud.html", hud);

const hosts = cenas.map((c) => `      <div id="${c.id}" data-composition-id="${c.id}" data-composition-src="compositions/${c.id}.html" data-start="${c.ini}" data-duration="${+(c.fim - c.ini).toFixed(2)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:2"></div>`).join("\n");
const audios = sfx.sort((a, b) => a[0] - b[0]).map(([t, n, v], i) => `      <audio id="sfx${i}" class="clip" src="assets/sfx/${n}.wav" data-start="${Math.max(0, t).toFixed(2)}" data-duration="${n.startsWith("sting") ? 2.7 : 1.5}" data-track-index="${5 + (i % 3)}" data-volume="${v}"></audio>`).join("\n");

fs.writeFileSync("index.html", `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Lei 8.142 para concursos</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/film.css" />
    <style>
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #f3ecdd; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${FIM}" data-width="1920" data-height="1080">
      <img id="papel" class="clip" src="assets/papel.jpg" alt="" data-start="0" data-duration="${FIM}" data-track-index="0" style="position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:1" />
${hosts}
      <div id="hud" data-composition-id="hud" data-composition-src="compositions/hud.html" data-start="0" data-duration="${FIM_FALA}" data-track-index="2" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:3"></div>
      <audio id="voz" class="clip" src="assets/narracao.mp3" data-start="0" data-duration="${FIM_FALA}" data-track-index="3" data-volume="1"></audio>
      <audio id="trilha" class="clip" src="assets/musica.wav" data-start="0" data-duration="${FIM}" data-track-index="4" data-volume="1"></audio>
${audios}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
console.log("cenas:", cenas.length, "sfx:", sfx.length);
