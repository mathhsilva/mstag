#!/usr/bin/env node
/*
 * Gera as artes dos posts da mstag (1080 × 1350) a partir de HTML, com o Playwright.
 * Uso:   node social/gerador/gerar.mjs          (gera todos em social/posts/)
 *        node social/gerador/gerar.mjs 05       (só os posts que começam com "05")
 * Requer o Playwright:   npm i -D playwright && npx playwright install chromium
 * Os textos de cada arte ficam na lista POSTS, mais abaixo.
 */
import fs from "node:fs";
import path from "node:path";
const { chromium } = await import("playwright");

const S = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(S, "..", "posts");
fs.mkdirSync(OUT, { recursive: true });
const f = (p) => "file://" + path.join(S, "assets", p);
const QR = fs.readFileSync(path.join(S, "assets", "qr.svg"), "utf8"); // QR real de https://mstag.com.br

const LOGO = { escuro: f("logos/mstag-logo-principal.svg"), claro: f("logos/mstag-logo-branco.svg"), mono: f("logos/mstag-logo-branco-mono.svg") };
const FOTO = (n) => f("fotos/" + n + ".jpg");

/* ---------- ícones ---------- */
const G = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const STAR = (c = "#FFC928") => `<svg viewBox="0 0 24 24"><path fill="${c}" d="M12 2.2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.1l-6.1 3.5 1.5-6.8L2.2 9.2l6.9-.7z"/></svg>`;
const stars = (n = 5, c) => `<span class="stars">${STAR(c).repeat(n)}</span>`;
const st = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const I = {
  nfc: st('<path d="M6 8.5a5 5 0 0 1 0 7"/><path d="M9.5 6a9 9 0 0 1 0 12"/><path d="M13 3.5a13 13 0 0 1 0 17"/>'),
  menu: st('<path d="M7 3v8a2 2 0 0 0 2 2v8"/><path d="M4 3v5a3 3 0 0 0 3 3"/><path d="M10 3v5a3 3 0 0 1-3 3"/><path d="M17 21V3c-2.2 1.2-3 3.6-3 7v4h3"/>'),
  wifi: st('<path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/>'),
  pix: st('<path d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z"/><path d="M8 12l4-4 4 4-4 4z"/>'),
  insta: st('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>'),
  whats: st('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.6c0 3.3 3 6.4 6.4 6.4l1-1.6-2-1-1 .9c-1-.4-2.3-1.7-2.7-2.7l.9-1-1-2z"/>'),
  check: st('<path d="M4 12.5l5 5L20 6.5"/>', 'stroke-width="3"'),
  x: st('<path d="M6 6l12 12M18 6L6 18"/>', 'stroke-width="3"'),
  phone: st('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>'),
  store: st('<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9"/>'),
  scissors: st('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>'),
  cup: st('<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 2.5v2.5M12 2.5v2.5"/>'),
  health: st('<path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11z"/><path d="M9 11h6M12 8v6"/>'),
  bag: st('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  wrench: st('<path d="M14.7 6.3a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3L17 4l3 3-2.3 2.3"/>'),
  bed: st('<path d="M3 18V6M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-8v3"/><circle cx="7" cy="10.5" r="1.8"/>'),
  arrow: st('<path d="M5 12h14M13 6l6 6-6 6"/>', 'stroke-width="2.4"'),
  link: st('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  truck: st('<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  clock: st('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  card: st('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/>'),
};

/* ---------- componentes ---------- */
// Placa Linha Clássica: arte do kit + logo Google e QR por cima das marcações
const classica = (cor = "preto-azul", w = 420) => `
  <div class="pc" style="width:${w}px"><img src="${f(`placas/placa-10x15-${cor}.png`)}">
    <div class="pc__g">${G}</div><div class="pc__qr">${QR}</div></div>`;

// Plaquinha Linha Tech desenhada aqui (Instagram, WhatsApp, Google, Multi-link)
const TECH = {
  google: { tema: "dark", icon: `<span class="tp__ic tp__ic--g">${G}</span>`, head: "Avalie a gente no Google", extra: stars(5) },
  instagram: { tema: "light", icon: `<span class="tp__ic tp__ic--ig">${I.insta}</span>`, head: "Siga a gente no Instagram" },
  whatsapp: { tema: "dark", icon: `<span class="tp__ic tp__ic--wa">${I.whats}</span>`, head: "Fale com a gente no WhatsApp" },
};
const tech = (k, w = 360, nome = "Café Aurora", rot = 0) => {
  const t = TECH[k];
  return `<div class="tp tp--${t.tema}" style="width:${w}px;--s:${w / 360};transform:rotate(${rot}deg)">
    <div class="tp__top">${t.icon}<div><b>${t.head}</b><small>${nome}</small></div></div>
    ${t.extra ? `<div class="tp__extra">${t.extra}</div>` : ""}
    <div class="tp__mid"><span class="tp__nfc">${I.nfc}</span><span class="tp__qr">${QR}</span></div>
    <div class="tp__foot">APROXIME O CELULAR</div></div>`;
};
const multilink = (w = 380, nome = "Café Aurora") => `
  <div class="ml" style="width:${w}px;--s:${w / 380}">
    <div class="ml__top"><span class="ml__ic">${I.link}</span><div><b>Tudo num toque</b><small>${nome}</small></div></div>
    <div class="ml__links">${[["menu", "Cardápio"], ["wifi", "Wi-Fi"], ["pix", "Pix"], ["insta", "Instagram"], ["whats", "WhatsApp"]].map(([i, t]) => `<span>${I[i]}${t}</span>`).join("")}</div>
    <div class="ml__mid"><span class="tp__nfc">${I.nfc}</span><span class="tp__qr">${QR}</span></div>
    <div class="ml__foot">APROXIME O CELULAR</div></div>`;

// Celular com uma tela
const phone = (tela, w = 360, rot = 0) => `<div class="phone" style="width:${w}px;--s:${w / 360};transform:rotate(${rot}deg)"><div class="phone__screen"><div class="phone__notch"></div>${tela}</div></div>`;

const TELA = {
  review: `<div class="scr scr--rev">
    <div class="rev__bar">${G}<span>Google</span></div>
    <div class="rev__av">CA</div><b class="rev__name">Café Aurora</b><small>Postando publicamente</small>
    <div class="rev__stars">${stars(5)}</div>
    <div class="rev__box">Atendimento incrível e o café é o melhor do bairro!</div>
    <div class="rev__btn">Postar</div></div>`,
  cardapio: `<div class="scr scr--menu">
    <div class="menu__head"><small>CAFÉ AURORA</small><b>Cardápio</b></div>
    <div class="menu__tabs"><span class="on">Cafés</span><span>Doces</span><span>Salgados</span></div>
    ${[["Espresso", "Grão da casa, torra média", "7,00"], ["Cappuccino", "Com canela e cacau", "12,00"], ["Latte gelado", "Leite vaporizado e gelo", "14,00"], ["Pão de queijo", "Porção com 6", "9,50"], ["Bolo do dia", "Pergunte o sabor", "11,00"]]
      .map(([n, d, p]) => `<div class="menu__item"><div><b>${n}</b><small>${d}</small></div><span>R$ ${p}</span></div>`).join("")}
    <div class="menu__btn">Chamar no WhatsApp</div></div>`,
  minisite: `<div class="scr scr--ms">
    <div class="ms__av">CA</div><b class="ms__name">Café Aurora</b><small class="ms__sub">Cafeteria · aberto até 20h</small>
    ${[["menu", "Ver cardápio"], ["wifi", "Conectar no Wi-Fi"], ["pix", "Pagar com Pix"], ["insta", "Seguir no Instagram"], ["whats", "Chamar no WhatsApp"]].map(([i, t]) => `<div class="ms__btn">${I[i]}<span>${t}</span></div>`).join("")}
    <div class="ms__btn ms__btn--g">${G}<span>Avaliar no Google</span></div><small class="ms__sub" style="margin-top:auto">Rua das Flores, 120 · Curitiba</small></div>`,
  instagram: `<div class="scr scr--ig">
    <div class="ig__bar"><b>cafeaurora</b></div>
    <div class="ig__row"><div class="ig__av">CA</div><div class="ig__nums"><div><b>184</b><small>posts</small></div><div><b>2.418</b><small>seguidores</small></div><div><b>312</b><small>seguindo</small></div></div></div>
    <b class="ig__name">Café Aurora</b><small class="ig__bio">Café especial e doces da casa<br>Rua das Flores, 120</small>
    <div class="ig__btns"><span class="ig__follow">Seguir</span><span>Mensagem</span></div>
    <div class="ig__grid">${"<i></i>".repeat(9)}</div></div>`,
};

const selo = (claro) => `<span class="selo ${claro ? "selo--claro" : ""}">${STAR("currentColor")}Preço exclusivo do site</span>`;
const logo = (tipo = "escuro", h = 46) => `<img class="logo" src="${LOGO[tipo]}" style="height:${h}px">`;
const pager = (i, n, claro) => `<div class="pager ${claro ? "pager--claro" : ""}">${Array.from({ length: n }, (_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`;
const rodape = (tema = "escuro", extra = "") => `<div class="foot foot--${tema}">${logo(tema === "escuro" ? "escuro" : "claro", 40)}<span>${extra || "mstag.com.br"}</span></div>`;
const arraste = (claro) => `<div class="swipe ${claro ? "swipe--claro" : ""}">Arraste ${I.arrow}</div>`;
const onda = (cor1 = "#2F5BFF", cor2 = "#C9D1F4") => `<svg class="wave" viewBox="0 0 1080 260" preserveAspectRatio="none"><path fill="${cor2}" d="M0 120 C 240 40 420 60 620 110 S 960 150 1080 70 V260 H0z"/><path fill="${cor1}" d="M0 170 C 260 90 460 120 660 160 S 980 190 1080 120 V260 H0z"/></svg>`;

const CSS = `
${[400,500,600,700].map(w=>`@font-face{font-family:'Space Grotesk';font-weight:${w};src:url(${f('fontes/sg-'+w+'.ttf')})}`).join('')}
*{box-sizing:border-box;margin:0;padding:0}
:root{--azul:#2F5BFF;--prof:#1C3FD1;--tinta:#111111;--estrela:#FFC928;--grafite:#6B6B6B;--nevoa:#F1F3F8;--lav:#C9D1F4}
html,body{width:1080px;height:1350px}
body{font-family:'Space Grotesk',system-ui,sans-serif;font-weight:500;color:var(--tinta);-webkit-font-smoothing:antialiased;overflow:hidden}
.art{position:relative;width:1080px;height:1350px;overflow:hidden;padding:84px 84px 0}
h1,h2,h3{font-weight:700;letter-spacing:-.035em;line-height:.98}
h1{font-size:100px} h2{font-size:78px} h3{font-size:44px;letter-spacing:-.02em;line-height:1.05}
p{font-size:34px;line-height:1.32;letter-spacing:-.01em}
.eyebrow{font-size:24px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
.blue{color:var(--azul)} .muted{color:var(--grafite)}
.stars{display:inline-flex;gap:.18em}.stars svg{width:1em;height:1em}
.logo{display:block}
.foot{position:absolute;left:84px;right:84px;bottom:64px;display:flex;align-items:center;justify-content:space-between;font-size:28px;font-weight:700;z-index:5}
.foot--claro{color:#fff}
.pager{position:absolute;top:64px;right:84px;display:flex;gap:10px;z-index:6}
.pager i{width:12px;height:12px;border-radius:9px;background:rgba(17,17,17,.18)}.pager i.on{width:36px;background:var(--azul)}
.pager--claro i{background:rgba(255,255,255,.35)}.pager--claro i.on{background:#fff}
.swipe{position:absolute;right:84px;bottom:140px;display:flex;align-items:center;gap:12px;font-size:28px;font-weight:700;color:var(--azul);z-index:6}
.swipe svg{width:40px;height:40px}.swipe--claro{color:#fff}
.wave{position:absolute;left:0;bottom:0;width:100%;height:260px}
.pill{display:inline-flex;align-items:center;gap:12px;padding:14px 26px;border-radius:99px;font-size:28px;font-weight:700}
.chip{color:var(--tinta);display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:99px;font-size:24px;font-weight:700;background:var(--nevoa)}
.price{display:flex;align-items:baseline;gap:18px}.price s{font-size:34px;color:var(--grafite)}.price b{font-size:96px;letter-spacing:-.04em;font-weight:700}
.price small{font-size:28px}.price b{white-space:nowrap}
.selo{display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:99px;background:var(--estrela);color:var(--tinta);font-size:22px;font-weight:700;letter-spacing:.02em}.selo svg{width:22px;height:22px}
.selo--claro{background:#fff;color:var(--prof)}.selo--claro svg{color:var(--estrela)}

/* placa clássica */
.pc{position:relative;filter:drop-shadow(0 30px 50px rgba(0,0,0,.28))}.pc img{width:100%;display:block;border-radius:6%/4%}
.pc__g{position:absolute;left:40.5%;top:35.3%;width:19%;aspect-ratio:1;border-radius:50%;background:#fff;display:grid;place-items:center}.pc__g svg{width:62%}
.pc__qr{position:absolute;left:52.6%;top:60.4%;width:40.8%;height:27.2%;background:#fff;display:grid;place-items:center}.pc__qr svg{width:86%;height:auto}

/* plaquinha tech */
.tp{position:relative;border-radius:calc(34px*var(--s));padding:calc(34px*var(--s));aspect-ratio:1;display:flex;flex-direction:column;box-shadow:0 30px 60px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.08)}
.tp--dark{background:linear-gradient(160deg,#23262d,#111);color:#fff}.tp--light{background:linear-gradient(160deg,#fff,#eef0f5);color:var(--tinta)}
.tp__top{display:flex;gap:calc(16px*var(--s));align-items:center}
.tp__top b{display:block;font-size:calc(27px*var(--s));line-height:1.05;letter-spacing:-.02em}.tp__top small{display:block;margin-top:calc(6px*var(--s));font-size:calc(18px*var(--s));opacity:.6;font-weight:700}
.tp__ic{flex:none;width:calc(58px*var(--s));height:calc(58px*var(--s));border-radius:calc(16px*var(--s));display:grid;place-items:center;color:#fff}.tp__ic svg{width:62%}
.tp__ic--g{background:#fff;border-radius:50%}.tp__ic--ig{background:radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)}.tp__ic--wa{background:#25D366}
.tp__extra{margin-top:calc(10px*var(--s));font-size:calc(22px*var(--s))}
.tp__mid{margin-top:auto;display:flex;align-items:center;justify-content:space-between}
.tp__nfc svg{width:calc(78px*var(--s));height:calc(78px*var(--s));stroke-width:2.4}
.tp__qr{width:calc(112px*var(--s));height:calc(112px*var(--s));background:#fff;border-radius:calc(12px*var(--s));padding:calc(10px*var(--s));display:block}.tp__qr svg{width:100%;height:100%;display:block}
.tp__foot{margin-top:calc(16px*var(--s));font-size:calc(14px*var(--s));letter-spacing:.14em;opacity:.55;font-weight:700}
/* multi-link */
.ml{color:var(--tinta);border-radius:calc(30px*var(--s));padding:calc(30px*var(--s));background:linear-gradient(160deg,#fff,#eceff6);box-shadow:0 30px 60px rgba(0,0,0,.28);display:flex;flex-direction:column}
.ml__top{display:flex;gap:calc(14px*var(--s));align-items:center}.ml__top b{display:block;font-size:calc(28px*var(--s));letter-spacing:-.02em}.ml__top small{font-size:calc(18px*var(--s));color:var(--grafite);font-weight:700}
.ml__ic{width:calc(56px*var(--s));height:calc(56px*var(--s));border-radius:calc(16px*var(--s));background:var(--azul);color:#fff;display:grid;place-items:center}.ml__ic svg{width:58%}
.ml__links{margin-top:calc(24px*var(--s));display:grid;gap:calc(10px*var(--s))}
.ml__links span{display:flex;align-items:center;gap:calc(12px*var(--s));padding:calc(12px*var(--s)) calc(16px*var(--s));border-radius:calc(99px*var(--s));background:#fff;border:1px solid #dfe3ee;font-size:calc(20px*var(--s));font-weight:700}
.ml__links svg{width:calc(24px*var(--s));height:calc(24px*var(--s));color:var(--azul)}
.ml__mid{margin-top:calc(26px*var(--s));display:flex;align-items:center;justify-content:space-between}
.ml__foot{margin-top:calc(10px*var(--s));font-size:calc(13px*var(--s));letter-spacing:.14em;color:var(--grafite);font-weight:700}

/* celular */
.phone{position:relative;aspect-ratio:360/740;border-radius:calc(58px*var(--s));background:#0d0d0f;padding:calc(13px*var(--s));box-shadow:0 40px 80px rgba(0,0,0,.35),inset 0 0 0 2px #2a2a2e}
.phone__screen{color:var(--tinta);position:relative;width:100%;height:100%;border-radius:calc(46px*var(--s));overflow:hidden;background:#fff;font-size:calc(16px*var(--s))}
.phone__notch{position:absolute;top:calc(12px*var(--s));left:50%;transform:translateX(-50%);width:calc(100px*var(--s));height:calc(28px*var(--s));border-radius:99px;background:#0d0d0f;z-index:3}
.scr{height:100%;padding:calc(62px*var(--s)) calc(22px*var(--s)) calc(22px*var(--s));display:flex;flex-direction:column}
.scr--rev{align-items:center;text-align:center;background:#fff}
.rev__bar{align-self:stretch;display:flex;align-items:center;gap:.5em;font-size:1.2em;font-weight:700;color:#444;padding-bottom:1em;border-bottom:1px solid #eee}.rev__bar svg{width:1.4em}
.rev__av{margin-top:1.6em;width:4.2em;height:4.2em;border-radius:50%;background:var(--prof);color:#fff;display:grid;place-items:center;font-weight:700;font-size:1.1em}
.rev__name{margin-top:.7em;font-size:1.4em}.scr--rev small{color:#777;font-size:.9em}
.rev__stars{margin-top:1.2em;font-size:2.5em}
.rev__box{margin-top:1.2em;align-self:stretch;text-align:left;border:1px solid #ddd;border-radius:.8em;padding:.9em;font-size:.95em;line-height:1.35;color:#333;min-height:6em}
.rev__btn{margin-top:auto;align-self:stretch;background:#1a73e8;color:#fff;border-radius:99px;padding:.8em;font-weight:700}
.scr--menu{background:#faf7f2}
.menu__head small{font-size:.8em;letter-spacing:.2em;color:#8a7a66;font-weight:700}.menu__head b{display:block;font-size:2em;letter-spacing:-.03em}
.menu__tabs{display:flex;gap:.5em;margin:1em 0}.menu__tabs span{padding:.4em .9em;border-radius:99px;background:#eee6da;font-weight:700;font-size:.9em}.menu__tabs .on{background:var(--tinta);color:#fff}
.menu__item{display:flex;justify-content:space-between;gap:.6em;padding:.75em 0;border-bottom:1px solid #e9e1d4}.menu__item b{display:block;font-size:1.05em}.menu__item small{color:#8a7a66;font-size:.82em}.menu__item span{font-weight:700;white-space:nowrap}
.menu__btn{margin-top:auto;background:#25D366;color:#fff;text-align:center;border-radius:99px;padding:.8em;font-weight:700}
.scr--ms{align-items:center;background:linear-gradient(180deg,#1C3FD1 0 20%,#F1F3F8 20%)}
.ms__av{width:4.6em;height:4.6em;border-radius:50%;background:#fff;color:var(--prof);display:grid;place-items:center;font-weight:700;font-size:1.1em;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.15);margin-top:.6em}
.ms__name{margin-top:.5em;font-size:1.35em}.ms__sub{color:#777;font-size:.85em;margin-bottom:.8em}
.ms__btn{align-self:stretch;display:flex;align-items:center;gap:.7em;background:#fff;border-radius:.9em;padding:.72em .9em;margin-top:.5em;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.06)}
.ms__btn svg{width:1.4em;height:1.4em;color:var(--azul);flex:none}.ms__btn--g{border:2px solid var(--azul)}
.scr--ig{padding-inline:calc(18px*var(--s))}
.ig__bar{font-size:1.2em;padding-bottom:.8em}.ig__row{display:flex;align-items:center;gap:1em}
.ig__av{width:4.6em;height:4.6em;border-radius:50%;background:#1C3FD1;color:#fff;display:grid;place-items:center;font-weight:700;box-shadow:0 0 0 3px #fff,0 0 0 5px #d6249f}
.ig__nums{flex:1;display:flex;justify-content:space-around;text-align:center}.ig__nums b{display:block;font-size:1.05em}.ig__nums small{font-size:.75em;color:#555}
.ig__name{margin-top:.8em}.ig__bio{font-size:.85em;color:#333;line-height:1.35}
.ig__btns{display:flex;gap:.4em;margin-top:.9em}.ig__btns span{flex:1;text-align:center;padding:.55em;border-radius:.6em;background:#efefef;font-weight:700;font-size:.9em}.ig__btns .ig__follow{background:#0095f6;color:#fff}
.ig__grid{margin-top:1em;display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-inline:calc(-18px*var(--s))}
.ig__grid i{aspect-ratio:1;background:linear-gradient(135deg,#d8c3a5,#8e6e53)}.ig__grid i:nth-child(3n+2){background:linear-gradient(135deg,#c9d1f4,#2F5BFF)}.ig__grid i:nth-child(4n){background:linear-gradient(135deg,#f1e3d3,#b98b62)}
`;

const page = (html, bg = "#fff") => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body style="background:${bg}">${html}</body></html>`;

/* ---------- posts ---------- */
const POSTS = [];
const post = (id, slides) => POSTS.push({ id, slides });

/* 01 · Foto + tipografia (cartão R$ 19,90) */
post("01-cartao-19", [
  `<div class="art" style="background:#F3EEE7">
    <img src="${FOTO("01_tag_preta_com_base")}" style="position:absolute;left:-40px;top:400px;width:1160px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 18%)">
    <div style="position:relative;z-index:2">${logo("escuro", 44)}
      <h1 style="margin-top:44px;font-size:92px">Seu cliente adorou.<br><span class="blue">Avaliar agora é um toque.</span></h1></div>
    <div style="position:absolute;left:84px;bottom:230px;z-index:3;background:#fff;border-radius:28px;padding:28px 34px;box-shadow:0 20px 50px rgba(0,0,0,.15);width:400px">
      <div class="eyebrow muted" style="font-size:18px">Cartão NFC Google</div>
      <div style="font-size:24px;margin-top:6px;font-weight:700">com base de madeira</div>
      <div class="price" style="margin-top:6px"><b style="font-size:80px">R$ 19,90</b></div>
      <div style="font-size:20px" class="muted">Aproxime o celular · abre as 5 estrelas</div></div>
    <div class="foot" style="background:rgba(255,255,255,.85);left:0;right:0;bottom:0;padding:26px 84px"><span style="font-weight:500">Cartão dupla face: preto de um lado, branco do outro</span><span>mstag.com.br</span></div>
  </div>`,
]);

/* 02 · Carrossel educativo azul (avaliação Google, Linha Clássica) */
{
  const n = 5;
  const azul = (i, inner) => `<div class="art" style="background:var(--prof);color:#fff">${pager(i, n, true)}${inner}</div>`;
  post("02-por-que-nao-avaliam", [
    azul(0, `${logo("claro", 44)}
      <div style="margin-top:130px;font-size:64px">${stars(5)}</div>
      <h1 style="margin-top:36px;font-size:104px">Seu cliente saiu feliz.</h1>
      <h2 style="margin-top:26px;color:var(--lav);font-size:72px">Então por que ele não te avaliou no Google?</h2>
      <div style="position:absolute;left:84px;top:900px;display:flex;align-items:center;gap:22px;background:#fff;color:var(--tinta);border-radius:28px;padding:24px 32px;box-shadow:0 20px 50px rgba(0,0,0,.2);transform:rotate(-2deg)">
        <span style="width:56px;height:56px;display:block">${G}</span>
        <div><b style="font-size:30px">Nenhuma avaliação nova</b><div class="muted" style="font-size:24px">Última avaliação: há 3 meses</div></div></div>
      ${onda("#fff", "#C9D1F4")}<div class="swipe swipe--claro" style="bottom:300px">Arraste ${I.arrow}</div>`),
    `<div class="art" style="background:#fff">${pager(1, n)}
      <div class="eyebrow blue">O problema</div>
      <h2 style="margin-top:22px">Não é falta de vontade.<br>É caminho demais.</h2>
      <div style="margin-top:56px;display:grid;gap:18px">
        ${["Abrir o Google", "Buscar o nome da loja", "Achar o perfil certo", "Rolar até “Avaliações”", "Tocar em “Escrever avaliação”"].map((t, k) => `<div style="display:flex;align-items:center;gap:24px;padding:22px 28px;border-radius:22px;background:var(--nevoa);font-size:34px;font-weight:700"><span style="width:52px;height:52px;border-radius:50%;background:#fff;display:grid;place-items:center;color:var(--grafite)">${k + 1}</span>${t}</div>`).join("")}
      </div>
      <p style="margin-top:40px" class="muted">Ninguém faz isso na fila do caixa.</p>${rodape()}</div>`,
    `<div class="art" style="background:var(--nevoa)">${pager(2, n)}
      <div class="eyebrow blue">A solução</div>
      <h2 style="margin-top:22px">Com a mstag é<br><span class="blue">1 passo só.</span></h2>
      <div style="position:absolute;left:84px;top:470px">${classica("preto-azul", 400)}</div>
      <div style="position:absolute;right:100px;top:400px">${phone(TELA.review, 320, 6)}</div>
      <div style="position:absolute;left:84px;right:84px;bottom:150px;font-size:32px;font-weight:700">Aproximou o celular → abre direto a tela das estrelas.</div>${rodape()}</div>`,
    `<div class="art" style="background:#fff">${pager(3, n)}
      <div class="eyebrow blue">Por que importa</div>
      <h2 style="margin-top:22px">Quem procura “perto de mim” escolhe pelas estrelas.</h2>
      <div style="margin-top:70px;display:grid;gap:26px">
        ${[["Mais avaliações", "o seu perfil passa mais confiança"], ["Avaliações recentes", "mostram que o negócio está vivo"], ["Mais confiança", "mais gente entra pela porta"]].map(([a, b], k) => `<div style="display:flex;gap:28px;align-items:flex-start"><span style="flex:none;width:76px;height:76px;border-radius:22px;background:var(--azul);color:#fff;display:grid;place-items:center;font-size:36px;font-weight:700">${k + 1}</span><div><h3>${a}</h3><p class="muted" style="margin-top:6px">${b}</p></div></div>`).join("")}
      </div>
      <div style="position:absolute;left:84px;right:84px;top:880px;background:var(--nevoa);border-radius:30px;padding:26px 32px">
        <div class="muted" style="font-size:22px;font-weight:700;letter-spacing:.08em">EXEMPLO · BUSCA “CAFÉ PERTO DE MIM”</div>
        ${[["Café Aurora", "4,9", "312 avaliações", 1], ["Café da Esquina", "4,1", "9 avaliações", 0]].map(([n, r, q, on]) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px;background:#fff;border-radius:20px;padding:20px 26px;${on ? "box-shadow:0 0 0 3px var(--azul)" : "opacity:.7"}"><b style="font-size:30px">${n}</b><span style="display:flex;align-items:center;gap:12px;font-size:26px;font-weight:700">${r} <span style="font-size:24px">${stars(5, on ? "#FFC928" : "#cfd3dd")}</span><span class="muted" style="font-weight:500">(${q})</span></span></div>`).join("")}
      </div>${rodape()}</div>`,
    azul(4, `<div class="eyebrow" style="color:var(--lav)">Placa Avaliação Google · Linha Clássica</div>
      <h2 style="margin-top:22px;font-size:70px">Coloque no balcão hoje. Colha estrelas a semana toda.</h2>
      <div style="position:absolute;right:70px;top:430px;transform:rotate(4deg)">${classica("azul", 360)}</div>
      <div style="position:absolute;left:84px;top:500px;width:520px">
        ${selo(false)}<div class="price" style="color:#fff;margin-top:22px"><s style="color:var(--lav)">R$ 79,90</s></div>
        <div class="price" style="color:#fff"><b style="font-size:110px">R$ 69,90</b></div>
        <div style="display:grid;gap:14px;margin-top:26px;font-size:28px">
          ${["NFC + QR code dinâmico", "Acrílico 3 mm · 10×10 ou 10×15", "Produção em até 3 dias úteis", "Envio para todo o Brasil"].map((t) => `<div style="display:flex;gap:14px;align-items:center"><span style="width:34px;height:34px;color:var(--estrela)">${I.check}</span>${t}</div>`).join("")}
        </div></div>
      <div style="position:absolute;left:84px;right:84px;top:1060px;background:#fff;color:var(--tinta);border-radius:28px;padding:30px 36px;display:flex;justify-content:space-between;align-items:center;font-size:32px;font-weight:700"><span>Peça em mstag.com.br</span><span style="display:flex;align-items:center;gap:10px;color:var(--azul)">ou no WhatsApp <span style="width:36px;height:36px;display:block">${I.arrow}</span></span></div>
      <div class="foot foot--claro">${logo("claro", 40)}<span>mstag.com.br</span></div>`),
  ]);
}

/* 03 · Cardápio digital (fundo escuro, celular) */
post("03-cardapio", [
  `<div class="art" style="background:radial-gradient(circle at 70% 60%,#23305f,#111 60%);color:#fff">
    ${logo("claro", 44)}
    <h1 style="margin-top:50px;font-size:96px">Cardápio<br>plastificado?</h1>
    <h2 style="margin-top:18px;font-size:60px;color:#9fb2ff">Aproxime o celular.</h2>
    <div style="position:absolute;left:90px;top:590px;transform:rotate(-5deg)">${multilink(300)}</div>
    <div style="position:absolute;right:100px;top:470px;transform:rotate(4deg)">${phone(TELA.cardapio, 340)}</div>
    <div style="position:absolute;left:84px;bottom:150px;display:flex;gap:14px;flex-wrap:wrap;width:520px">
      <span class="pill" style="background:#fff;color:var(--tinta)">Display de mesa · R$ 79,90</span></div>
    <div class="foot foot--claro"><span style="font-weight:500;font-size:26px;opacity:.8">Mudou o preço? Troca o link, a placa fica.</span><span>mstag.com.br</span></div>
  </div>`,
]);

/* 04 · Conversa (humor) */
{
  const bolha = (t, eu, extra = "") => `<div style="align-self:${eu ? "flex-end" : "flex-start"};max-width:760px;padding:26px 34px;border-radius:34px;${eu ? "border-bottom-right-radius:8px;background:var(--azul);color:#fff" : "border-bottom-left-radius:8px;background:#fff"};font-size:38px;line-height:1.25;font-weight:500;box-shadow:0 6px 18px rgba(0,0,0,.06)">${t}${extra}</div>`;
  post("04-faco-em-casa", [
    `<div class="art" style="background:var(--nevoa)">
      <div class="eyebrow muted">Todo dia, em todo balcão</div>
      <div style="margin-top:50px;display:flex;flex-direction:column;gap:22px">
        ${bolha("Tudo maravilhoso, voltamos sempre!", false)}
        ${bolha("Que bom! Deixa uma avaliação pra gente no Google?", true)}
        ${bolha("Claro! Faço quando chegar em casa.", false)}
        <div style="align-self:center;margin-top:10px;font-size:26px;color:var(--grafite);font-weight:700;letter-spacing:.04em">3 SEMANAS DEPOIS…</div>
        ${bolha(`Nenhuma avaliação nova. <span style="opacity:.5">${stars(5, "#cfd3dd")}</span>`, false)}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:400px;background:var(--tinta);color:#fff;padding:60px 84px">
        <h2 style="font-size:64px">O “faço em casa” nunca chega.</h2>
        <p style="margin-top:18px;color:#c9d1f4">Peça a avaliação na hora, com um toque no balcão.</p>
      </div>
      <div class="foot foot--claro">${logo("claro", 40)}<span>mstag.com.br</span></div>
    </div>`,
  ]);
}

/* 05 · Carrossel minisite */
{
  const n = 5;
  post("05-minisite", [
    `<div class="art" style="background:var(--tinta);color:#fff">${pager(0, n, true)}${logo("claro", 44)}
      <h1 style="margin-top:60px;font-size:98px">Uma plaquinha.<br><span style="color:#9fb2ff">Um minisite inteiro.</span></h1>
      <div style="position:absolute;left:110px;top:640px;transform:rotate(-6deg)">${multilink(320)}</div>
      <div style="position:absolute;right:110px;top:470px;transform:rotate(5deg)">${phone(TELA.minisite, 350)}</div>
      <div class="swipe swipe--claro" style="left:84px;right:auto;bottom:90px">Arraste ${I.arrow}</div></div>`,
    `<div class="art" style="background:#fff">${pager(1, n)}
      <div class="eyebrow blue">O que abre no celular</div>
      <h2 style="margin-top:22px;font-size:68px">Tudo que o cliente pergunta no balcão, numa tela só.</h2>
      <div style="position:absolute;left:84px;top:360px">${phone(TELA.minisite, 380)}</div>
      <div style="position:absolute;left:540px;right:84px;top:440px;display:grid;gap:26px">
        ${[["menu", "Cardápio", "sempre atualizado"], ["wifi", "Wi-Fi", "sem soletrar senha"], ["pix", "Pix", "sem digitar chave"], ["insta", "Instagram", "vira seguidor"], ["whats", "WhatsApp", "pedido e reserva"]].map(([i, a, b]) => `<div style="display:flex;gap:20px;align-items:center"><span style="flex:none;width:68px;height:68px;border-radius:20px;background:var(--nevoa);color:var(--azul);display:grid;place-items:center"><span style="width:36px;height:36px;display:block">${I[i]}</span></span><div><b style="font-size:32px">${a}</b><div class="muted" style="font-size:24px">${b}</div></div></div>`).join("")}
      </div>${rodape()}</div>`,
    `<div class="art" style="background:var(--nevoa)">${pager(2, n)}
      <div class="eyebrow blue">No dia a dia</div>
      <div style="margin-top:50px;display:grid;gap:36px">
        <div style="background:#fff;border-radius:36px;padding:56px 52px">
          <div style="display:flex;align-items:center;gap:20px"><span style="width:64px;height:64px;color:var(--azul)">${I.wifi}</span><h3>“Qual a senha do Wi-Fi?”</h3></div>
          <p class="muted" style="margin-top:18px">Nunca mais soletrar “maiúsculo, arroba, dois, zero…”. Aproximou, conectou.</p></div>
        <div style="background:#fff;border-radius:36px;padding:56px 52px">
          <div style="display:flex;align-items:center;gap:20px"><span style="width:64px;height:64px;color:var(--azul)">${I.pix}</span><h3>“Qual a chave do Pix?”</h3></div>
          <p class="muted" style="margin-top:18px">A chave já aparece pronta pra copiar. Sem erro de digitação, sem fila parada.</p></div>
        <div style="background:#fff;border-radius:36px;padding:56px 52px">
          <div style="display:flex;align-items:center;gap:20px"><span style="width:64px;height:64px;color:var(--azul)">${I.menu}</span><h3>“Tem cardápio?”</h3></div>
          <p class="muted" style="margin-top:18px">Tem, e está sempre com o preço de hoje.</p></div>
      </div>${rodape()}</div>`,
    `<div class="art" style="background:var(--azul);color:#fff">${pager(3, n, true)}
      <div class="eyebrow" style="color:var(--lav)">O melhor detalhe</div>
      <h1 style="margin-top:30px;font-size:92px">Mudou o cardápio?<br>A placa continua a mesma.</h1>
      <p style="margin-top:40px;font-size:38px;color:#e4e8ff">Você troca os links quando quiser. Nada de reimprimir, nada de plaquinha nova.</p>
      <div style="position:absolute;left:84px;top:720px;display:flex;flex-direction:column;align-items:flex-start;gap:22px;font-size:34px;font-weight:700">
        <span style="background:#fff;color:var(--tinta);padding:18px 28px;border-radius:20px;text-decoration:line-through;opacity:.7">Cappuccino R$ 10</span>
        <span style="width:48px;height:48px;transform:rotate(90deg);margin-left:24px">${I.arrow}</span>
        <span style="background:#fff;color:var(--azul);padding:18px 28px;border-radius:20px">Cappuccino R$ 12</span>
        <span style="font-size:26px;font-weight:500;color:#e4e8ff;margin-top:10px">atualizado em segundos</span></div>
      <div style="position:absolute;right:110px;top:640px;transform:rotate(5deg)">${phone(TELA.cardapio, 280)}</div>
      <div class="foot foot--claro">${logo("mono", 40)}<span>mstag.com.br</span></div></div>`,
    `<div class="art" style="background:#fff">${pager(4, n)}
      <div class="eyebrow blue">Display de Mesa NFC Multi-link</div>
      <h2 style="margin-top:22px;font-size:70px">Pra mesa, balcão ou recepção.</h2>
      <div style="position:absolute;right:100px;top:440px;transform:rotate(4deg)">${multilink(390)}</div>
      <div style="position:absolute;left:84px;top:540px;width:470px">
        <div class="price"><b style="font-size:104px">R$ 79,90</b></div><div class="muted" style="font-size:28px">ou 3× de R$ 26,63</div>
        <div style="display:grid;gap:16px;margin-top:40px;font-size:28px">
          ${["10 × 15 cm, em pé com base", "NFC + QR code", "Links trocáveis a qualquer hora", "Envio para todo o Brasil"].map((t) => `<div style="display:flex;gap:14px;align-items:center"><span style="flex:none;width:34px;height:34px;color:var(--azul)">${I.check}</span>${t}</div>`).join("")}
        </div>
        <div class="pill" style="margin-top:44px;background:var(--azul);color:#fff">Peça pelo site ou WhatsApp</div></div>
      ${rodape("escuro", "mstag.com.br")}</div>`,
  ]);
}

/* 06 · Comparativo */
{
  const linhas = [
    ["Abre só aproximando o celular", false, true],
    ["QR code para quem não tem NFC", true, true],
    ["Troca o link sem reimprimir", false, true],
    ["Aguenta sol, água e balcão", false, true],
    ["Cara de negócio profissional", false, true],
  ];
  const cel = (ok) => `<span style="width:58px;height:58px;border-radius:50%;display:grid;place-items:center;${ok ? "background:var(--azul);color:#fff" : "background:#e6e8ef;color:#a3a8b5"}"><span style="width:30px;height:30px;display:block">${ok ? I.check : I.x}</span></span>`;
  post("06-comparativo", [
    `<div class="art" style="background:#fff">
      <div class="eyebrow blue">Comparativo honesto</div>
      <h2 style="margin-top:22px;font-size:80px">QR code na folha A4 <span class="muted">x</span> plaquinha mstag</h2>
      <div style="margin-top:70px;border-radius:36px;overflow:hidden;background:var(--nevoa)">
        <div style="display:grid;grid-template-columns:1fr 170px 170px;padding:26px 36px;font-size:24px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--grafite)"><span></span><span style="text-align:center">Folha A4</span><span style="text-align:center;color:var(--azul)">mstag</span></div>
        ${linhas.map(([t, a, b]) => `<div style="display:grid;grid-template-columns:1fr 170px 170px;align-items:center;padding:30px 36px;border-top:2px solid #fff;font-size:32px;font-weight:700"><span>${t}</span><span style="display:grid;place-items:center">${cel(a)}</span><span style="display:grid;place-items:center">${cel(b)}</span></div>`).join("")}
      </div>
      <div style="margin-top:50px;display:flex;align-items:center;justify-content:space-between;background:var(--tinta);color:#fff;border-radius:28px;padding:30px 36px"><span style="font-size:32px;font-weight:700">Plaquinhas a partir de R$ 19,90</span><span style="font-size:26px;color:#9fb2ff;font-weight:700">NFC + QR code</span></div>
      ${rodape()}</div>`,
  ]);
}

/* 07 · Carrossel para quem é */
{
  const n = 4;
  post("07-para-quem-e", [
    `<div class="art" style="padding:0">
      <div style="position:absolute;inset:0;background:#15110d"></div>
      <img src="${FOTO("05_tag_preta_na_mao")}" style="position:absolute;left:0;top:270px;width:1080px;height:1080px">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#15110d 0,#15110d 20%,rgba(21,17,13,0) 38%,rgba(21,17,13,0) 80%,rgba(21,17,13,.7) 100%)"></div>
      ${pager(0, n, true)}
      <div style="position:absolute;left:84px;right:84px;top:84px;color:#fff">${logo("claro", 44)}
        <h1 style="margin-top:44px;font-size:96px">Serve pro seu negócio?</h1>
        <p style="margin-top:16px;color:#dfe4ff">Spoiler: se tem balcão, serve.</p></div>
      ${arraste(true)}</div>`,
    `<div class="art" style="background:#fff">${pager(1, n)}
      <div class="eyebrow blue">Quem mais usa</div>
      <h2 style="margin-top:22px;font-size:70px">Um toque, o link certo pra cada negócio.</h2>
      <div style="margin-top:50px;display:grid;grid-template-columns:1fr 1fr;gap:22px">
        ${[["cup", "Restaurantes e cafés", "Cardápio + avaliação"], ["scissors", "Salões e barbearias", "Instagram + avaliação"], ["health", "Clínicas e consultórios", "Avaliação + WhatsApp"], ["bag", "Lojas", "Instagram no provador"], ["wrench", "Oficinas e serviços", "Avaliação no balcão"], ["bed", "Pousadas e hotéis", "Wi-Fi + avaliação"]].map(([i, a, b]) => `<div style="background:var(--nevoa);border-radius:30px;padding:32px"><span style="display:block;width:58px;height:58px;color:var(--azul)">${I[i]}</span><b style="display:block;margin-top:18px;font-size:32px;letter-spacing:-.02em">${a}</b><span class="muted" style="font-size:25px">${b}</span></div>`).join("")}
      </div>${rodape()}</div>`,
    `<div class="art" style="padding:0;background:#111">
      <div style="position:absolute;inset:0;background:#3a2414"></div>
      <img src="${FOTO("06_tag_preta_no_balcao")}" style="position:absolute;left:0;top:330px;width:1080px;height:1080px">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#1d130c 0,#1d130c 26%,rgba(29,19,12,0) 44%)"></div>
      ${pager(2, n, true)}
      <div style="position:absolute;left:84px;right:84px;top:84px;color:#fff">
        <div class="eyebrow" style="color:#c9d1f4">Onde colocar</div>
        <h2 style="margin-top:22px;font-size:72px">Onde o cliente para, a plaquinha trabalha.</h2>
        <div style="margin-top:34px;display:flex;flex-wrap:wrap;gap:14px">${["Caixa", "Balcão", "Mesa", "Recepção", "Provador", "Parede"].map((t) => `<span class="chip" style="background:#fff">${t}</span>`).join("")}</div></div>
    </div>`,
    `<div class="art" style="background:var(--prof);color:#fff">${pager(3, n, true)}
      <h2 style="margin-top:40px;font-size:80px">Escolha a sua.</h2>
      <div style="margin-top:56px;display:grid;gap:18px">
        ${[["Cartão NFC Google + base", "19,90"], ["Plaquinha Instagram ou WhatsApp", "54,90", 1], ["Placa Avaliação Google", "69,90", 1, "79,90"], ["Display de mesa multi-link", "79,90"], ["Kit Negócio · 3 plaquinhas", "159,90", 0, "179,70"]].map(([a, b, ex, de]) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:24px 34px;border-radius:24px;background:rgba(255,255,255,.1);font-size:32px;font-weight:700"><span>${a}${ex ? `<small style="display:block;font-size:20px;color:var(--estrela);letter-spacing:.04em;margin-top:4px">★ PREÇO EXCLUSIVO DO SITE</small>` : ""}</span><span style="white-space:nowrap;text-align:right">${de ? `<s style="display:block;font-size:22px;opacity:.6;font-weight:500">R$ ${de}</s>` : ""}R$ ${b}</span></div>`).join("")}
      </div>
      <p style="margin-top:36px;color:#dfe4ff;font-size:30px">Produção em até 3 dias úteis · envio para todo o Brasil</p>
      <div style="margin-top:60px;background:#fff;color:var(--tinta);border-radius:28px;padding:32px 36px;display:flex;justify-content:space-between;align-items:center;font-size:32px;font-weight:700"><span>Monte o pedido em mstag.com.br</span><span style="width:40px;height:40px;color:var(--azul)">${I.arrow}</span></div>
      <div class="foot foot--claro">${logo("claro", 40)}<span>mstag.com.br</span></div></div>`,
  ]);
}

/* 08 · Oferta Kit */
post("08-kit-negocio", [
  `<div class="art" style="background:linear-gradient(170deg,#2F5BFF,#1C3FD1 60%);color:#fff">
    ${logo("mono", 44)}
    <div class="eyebrow" style="margin-top:50px;color:#dfe4ff">Kit Negócio · 3 plaquinhas NFC</div>
    <h1 style="margin-top:18px;font-size:90px">Google + Instagram + WhatsApp.</h1>
    <div style="position:absolute;left:50px;top:560px;z-index:1">${tech("instagram", 320, "Café Aurora", -9)}</div>
    <div style="position:absolute;left:375px;top:500px;z-index:3">${tech("google", 330, "Café Aurora", 0)}</div>
    <div style="position:absolute;left:700px;top:560px;z-index:4">${tech("whatsapp", 320, "Café Aurora", 8)}</div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:#fff;color:var(--tinta);padding:44px 84px;z-index:4;display:flex;align-items:center;justify-content:space-between">
      <div><div class="price"><s>R$ 179,70</s></div><div class="price"><b style="font-size:104px">R$ 159,90</b></div></div>
      <div style="text-align:right"><span class="pill" style="background:var(--estrela);color:var(--tinta)">Economize R$ 19,80</span><div class="muted" style="font-size:26px;margin-top:16px">mstag.com.br</div></div>
    </div>
  </div>`,
]);

/* 09 · Instagram */
post("09-instagram", [
  `<div class="art" style="background:linear-gradient(180deg,#fff 0,#F1F3F8 100%)">
    ${logo("escuro", 44)}
    <h1 style="margin-top:50px;font-size:94px">Quem entra na loja,<br><span class="blue">sai seguindo.</span></h1>
    <div style="position:absolute;left:84px;top:500px">${tech("instagram", 400, "Café Aurora", -4)}</div>
    <div style="position:absolute;right:100px;top:470px">${phone(TELA.instagram, 330, 5)}</div>
    <div style="position:absolute;left:84px;top:960px;width:460px">${selo(false)}
      <div style="margin-top:22px;font-size:30px;line-height:1.3">Aproximou o celular, abriu o perfil com o botão <b class="blue">Seguir</b>. Sem digitar @.</div></div>
    <div class="foot"><span class="pill" style="background:var(--tinta);color:#fff;font-size:26px;white-space:nowrap">Plaquinha Instagram · R$ 54,90</span><span>mstag.com.br</span></div>
  </div>`,
]);

/* 10 · Carrossel FAQ */
{
  const n = 6;
  const faq = (i, q, a, icone) => `<div class="art" style="background:var(--tinta);color:#fff">${pager(i, n, true)}
    <div class="eyebrow" style="color:#9fb2ff">Pergunta ${i}</div>
    <div style="position:absolute;left:84px;right:84px;top:150px;bottom:170px;display:flex;flex-direction:column;justify-content:center">
    <span style="display:grid;place-items:center;width:150px;height:150px;border-radius:44px;background:#1d2233;color:var(--azul)"><span style="display:block;width:84px;height:84px">${I[icone]}</span></span>
    <h2 style="margin-top:56px;font-size:84px">${q}</h2>
    <p style="margin-top:40px;font-size:42px;color:#d6daea">${a}</p></div>
    <div class="foot foot--claro">${logo("claro", 40)}<span>mstag.com.br</span></div></div>`;
  post("10-perguntas", [
    `<div class="art" style="background:var(--tinta);color:#fff">${pager(0, n, true)}${logo("claro", 44)}
      <h1 style="margin-top:120px;font-size:112px">Antes de comprar, todo mundo pergunta.</h1>
      <p style="margin-top:40px;font-size:40px;color:#9fb2ff">As 5 dúvidas mais comuns sobre a plaquinha NFC.</p>
      <div style="position:absolute;right:-60px;bottom:-40px;font-size:620px;font-weight:700;line-height:1;color:#1f2230">?</div>
      <div class="swipe swipe--claro" style="left:84px;right:auto;bottom:90px">Arraste ${I.arrow}</div></div>`,
    faq(1, "Precisa de aplicativo?", "Não. O celular lê a plaquinha sozinho e abre o link no navegador. No iPhone (do XS em diante) e na maioria dos Android.", "phone"),
    faq(2, "E se o celular não tiver NFC?", "Toda plaquinha tem QR code impresso. É só apontar a câmera e cair no mesmo link.", "nfc"),
    faq(3, "Precisa de bateria ou tomada?", "Nenhuma das duas. O chip é ativado pelo próprio celular na hora da leitura.", "clock"),
    faq(4, "Posso trocar o link depois?", "Sim. Na Linha Clássica o QR é dinâmico e no display multi-link você troca quando quiser. Nas outras, a gente regrava pra você.", "link"),
    `<div class="art" style="background:#fff">${pager(5, n)}
      <div class="eyebrow blue">Pergunta 5</div>
      <h2 style="margin-top:22px;font-size:78px">Como eu compro?</h2>
      <div style="margin-top:44px;display:grid;gap:22px">
        ${[["card", "Monte o pedido em mstag.com.br", "e finalize pelo WhatsApp"], ["clock", "Produção em até 3 dias úteis", "já com o seu link gravado"], ["truck", "Envio para todo o Brasil", "frete pelo CEP · Pix ou cartão"]].map(([i, a, b]) => `<div style="display:flex;gap:24px;align-items:center;background:var(--nevoa);border-radius:28px;padding:28px 32px"><span style="flex:none;width:60px;height:60px;color:var(--azul)">${I[i]}</span><div><b style="font-size:32px">${a}</b><div class="muted" style="font-size:26px">${b}</div></div></div>`).join("")}
      </div>
      <img src="${FOTO("02_tag_branca_com_base")}" style="position:absolute;right:84px;bottom:140px;width:440px;border-radius:30px">
      <div style="position:absolute;left:84px;bottom:160px;font-size:34px;font-weight:700;width:420px">Dúvida?<br>Chama no WhatsApp<br><span class="blue">(41) 98469-9726</span></div>
      ${rodape()}</div>`,
  ]);
}

/* ---------- render ---------- */
const only = process.argv[2];
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
for (const p of POSTS) {
  if (only && !p.id.startsWith(only)) continue;
  for (let i = 0; i < p.slides.length; i++) {
    const html = path.join(S, ".tmp.html");
    fs.writeFileSync(html, page(p.slides[i]));
    await pg.goto("file://" + html, { waitUntil: "networkidle" });
    await pg.evaluate(() => document.fonts.ready);
    const nome = p.slides.length > 1 ? `${p.id}-${i + 1}.png` : `${p.id}.png`;
    await pg.screenshot({ path: path.join(OUT, nome) });
    console.log(nome);
  }
}
fs.rmSync(path.join(S, ".tmp.html"), { force: true });
await b.close();
