#!/usr/bin/env node
/*
 * Gera as artes dos posts do Instagram (1080 × 1350, formato 4:5) em instagram/.
 * Cada post é uma lista de slides em HTML; carrosséis saem como 01.png, 02.png...
 * Uso:   node tools/posts.mjs            (todos)
 *        node tools/posts.mjs p03 p07    (só alguns)
 * Requer o Playwright (o mesmo do tools/og.mjs). CHROMIUM_PATH aponta outro Chromium, se precisar.
 * Preços e textos fixos daqui conferem com o js/config.js de outubro/2026: confira antes de gerar de novo.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arquivo = (p) => pathToFileURL(path.join(raiz, p)).href;
const saida = path.join(raiz, "instagram");

async function carregaPlaywright() {
  try { return await import("playwright"); } catch {
    const global = execSync("npm root -g").toString().trim();
    return createRequire(path.join(global, "noop.js"))("playwright");
  }
}

/* ------------------------------------------------------------
   Peças (mesmos desenhos do site, ver js/main.js)
   ------------------------------------------------------------ */
const ICON = {
  google: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#fff"/><path d="M35.5 24.3c0-.9-.1-1.7-.2-2.5H24v4.8h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.9Z" fill="#4285F4"/><path d="M24 36c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5h-4v3.1A12 12 0 0 0 24 36Z" fill="#34A853"/><path d="M17.3 26.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1Z" fill="#FBBC05"/><path d="M24 16.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 13.3 18.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" fill="#EA4335"/></svg>',
  instagram: '<svg viewBox="0 0 48 48"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect x="2" y="2" width="44" height="44" rx="13" fill="url(#igg)"/><rect x="12" y="12" width="24" height="24" rx="7.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="24" r="5.6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31" cy="17" r="1.8" fill="#fff"/></svg>',
  whatsapp: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#25D366"/><path d="M24 11.5a12.5 12.5 0 0 0-10.8 18.8L11.5 36.5l6.4-1.7A12.5 12.5 0 1 0 24 11.5Z" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><path d="M19.6 18.6c.3-.6.6-.6 1-.6h.8c.2 0 .5 0 .7.6l1 2.4c.1.3 0 .6-.1.8l-.7.9c-.2.2-.2.5 0 .8.5.9 1.9 2.6 3.8 3.3.3.1.5 0 .7-.2l.9-1.1c.2-.3.5-.3.8-.2l2.3 1.1c.3.2.5.3.5.5 0 .6-.2 1.6-1 2.2-.9.7-2.3.8-4.2 0-3.4-1.5-5.6-4.7-6.1-5.6-.5-.8-1.3-2.6-.4-4.9Z" fill="#fff"/></svg>',
  cardapio: '<svg viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="13" fill="#FF6A3D"/><path d="M17 12v9a3 3 0 0 0 6 0v-9M20 12v24M30 36V12c-3 2-4 6-4 10 0 2 1.5 3 4 3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wifi: '<svg viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="13" fill="#3047FF"/><path d="M12 20a17 17 0 0 1 24 0M16 25a11 11 0 0 1 16 0M20 30a5 5 0 0 1 8 0" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><circle cx="24" cy="34.5" r="2" fill="#fff"/></svg>',
  pix: '<svg viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="13" fill="#32BCAD"/><path d="m24 11 6 6-6 6-6-6zM24 25l6 6-6 6-6-6zM11 24l6-6 6 6-6 6zM25 24l6-6 6 6-6 6z" fill="#fff" opacity=".95"/></svg>',
  link: '<svg viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="13" fill="#3047FF"/><path d="M21 27a5 5 0 0 0 7 0l5-5a5 5 0 0 0-7-7l-1.5 1.5M27 21a5 5 0 0 0-7 0l-5 5a5 5 0 0 0 7 7l1.5-1.5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>',
  nfc: '<svg viewBox="0 0 48 48"><path d="M15 16c3.6 4.4 3.6 11.6 0 16M22 11c6 7 6 19 0 26M29 6c8.4 9.6 8.4 26.4 0 36" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="#FBBC05"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  seta: '<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  troca: '<svg viewBox="0 0 48 48"><path d="M10 20a14 14 0 0 1 25-6l3 3M38 10v7h-7M38 28a14 14 0 0 1-25 6l-3-3M10 38v-7h7" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const estrelas = (n = 5) => `<span class="stars">${ICON.star.repeat(n)}</span>`;

/* QR decorativo determinístico (igual ao do site) */
function qr(seed) {
  const n = 21; let cells = "", s = 0;
  for (let k = 0; k < seed.length; k++) s = (s * 31 + seed.charCodeAt(k)) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0B1220"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0B1220"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!inFinder && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="0 0 21 21" shape-rendering="crispEdges"><g fill="#0B1220">${cells}</g>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
}

const MODELOS = {
  google: { head: "Avalie a gente no Google", icon: "google", stars: true },
  instagram: { head: "Siga a gente no Instagram", icon: "instagram" },
  whatsapp: { head: "Fale com a gente no WhatsApp", icon: "whatsapp" },
};
function plate({ modelo = "google", cor = "dark", nome = "Seu negócio" }) {
  const cls = `plate plate--${cor}`;
  if (modelo === "multilink") {
    return `<div class="${cls} plate--tall"><div class="plate__top"><span class="plate__brand">${ICON.link}</span><div><div class="plate__head">Tudo num toque</div><div class="plate__name">${nome}</div></div></div>
<div class="plate__links">${["Cardápio", "Wi-Fi", "Pix", "Instagram", "WhatsApp"].map((t) => `<span class="plate__link"><i></i>${t}</span>`).join("")}</div>
<div class="plate__mid"><span class="plate__nfc">${ICON.nfc}</span><span class="plate__qr">${qr(nome + "multi")}</span></div></div>`;
  }
  const m = MODELOS[modelo];
  return `<div class="${cls}"><div class="plate__top"><span class="plate__brand">${ICON[m.icon]}</span><div><div class="plate__head">${m.head}</div><div class="plate__name">${nome}</div></div></div>
<div class="plate__mid"><span class="plate__nfc">${ICON.nfc}</span><span class="plate__qr">${qr(nome + modelo)}</span></div>
<div class="plate__foot"><span>Aproxime o celular</span>${m.stars ? `<div class="plate__stars">${ICON.star.repeat(5)}</div>` : ""}</div></div>`;
}
/* Linha Clássica: foto real com o logo e o QR por cima dos marcadores */
function classica(tam, cor) {
  const alto = tam === "10x15";
  return `<div class="pc pc--${alto ? "tall" : "square"}"><img src="${arquivo(`assets/placas/google-${tam}-${cor}.webp`)}"><span class="pc__logo">${ICON.google}</span><span class="pc__qr">${qr("classica" + tam)}</span></div>`;
}
const foto = (p, cls = "") => `<img class="foto ${cls}" src="${arquivo(p)}">`;

/* Celular com uma tela dentro */
const celular = (tela, cls = "") => `<div class="phone ${cls}"><div class="phone__screen"><span class="phone__notch"></span>${tela}</div></div>`;
const telaGoogle = (nome) => `<div class="scr scr--g"><div class="scr__bar">${ICON.google}<b>Google</b></div>
<div class="scr__avatar">${nome.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div><div class="scr__nome">${nome}</div><div class="scr__mute">Avalie sua experiência</div>
<div class="scr__stars">${ICON.star.repeat(5)}</div><div class="scr__box"><i></i><i></i><i style="width:55%"></i></div><div class="scr__btn">Publicar</div></div>`;
const telaApp = () => `<div class="scr scr--app"><div class="scr__url">app.mstag.com.br</div><div class="scr__tag"><span>Plaquinha</span><b>MS-000123</b></div>
<div class="scr__label">Destino do link</div><div class="scr__opts"><span class="on">${ICON.google}Google</span><span>${ICON.instagram}Instagram</span><span>${ICON.whatsapp}WhatsApp</span></div>
<div class="scr__label">Link</div><div class="scr__input">g.page/r/cafe-aurora/review</div><div class="scr__btn">Salvar e testar</div><div class="scr__ok">${ICON.check} Plaquinha configurada</div></div>`;

/* Moldura padrão de cada slide */
function slide({ tema = "paper", conteudo, pagina, total, rodape = "", onda = false }) {
  const logo = tema === "paper" || tema === "white" ? "mstag-preto-azul.png" : tema === "blue" ? "mstag-branco.png" : "mstag-branco-azul.png";
  const dots = total > 1 ? `<span class="dots">${Array.from({ length: total }, (_, i) => `<i class="${i + 1 === pagina ? "on" : ""}"></i>`).join("")}</span>` : "";
  return `<div class="post t-${tema}">${onda ? '<svg class="onda" viewBox="0 0 1080 260" preserveAspectRatio="none"><path d="M0 120C200 40 380 40 560 110s380 90 520 10V260H0Z" fill="currentColor" opacity=".18"/><path d="M0 170C220 90 420 100 600 160s340 70 480 0V260H0Z" fill="currentColor"/></svg>' : ""}
<header class="topo"><img class="logo" src="${arquivo("assets/logo/" + logo)}">${dots}</header>
${conteudo}
<footer class="rodape">${rodape || "<span></span>"}<span class="url">mstag.com.br</span></footer></div>`;
}
const arraste = '<span class="arraste">Arraste ' + ICON.seta + "</span>";
const pill = (t, cls = "") => `<span class="pill ${cls}">${t}</span>`;

/* ------------------------------------------------------------
   Os posts
   ------------------------------------------------------------ */
const POSTS = [];
const post = (id, slides) => POSTS.push({ id, slides });

/* P01 · carrossel · Funciona no iPhone? */
post("p01-funciona-no-iphone", [
  { tema: "ink", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker">A dúvida nº 1 do balcão</span>
  <h1 class="h-xl">Funciona no <em>iPhone?</em></h1>
  <p class="sub">Funciona. E no Android também. Sem baixar nada.<br>Arrasta que a gente mostra onde encostar.</p>
</div>
<div class="cena cena--duo">
  <div class="mini-phone mini-phone--ios"><span class="cam"></span><span class="zona zona--topo"></span></div>
  <div class="mini-phone mini-phone--and"><span class="cam cam--and"></span><span class="zona zona--meio"></span></div>
  <div class="cena__plate">${plate({ modelo: "google", cor: "light", nome: "Café Aurora" })}</div>
</div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">iPhone · do XS em diante</span>
  <h2 class="h-lg">Encoste a <em>parte de cima.</em></h2>
</div>
<div class="duas">
  <div class="diagrama"><div class="mini-phone mini-phone--ios grande"><span class="cam"></span><span class="zona zona--topo"></span><span class="rot rot--topo">antena<br>aqui</span></div></div>
  <ul class="lista">
    <li>${ICON.check}<div><b>Perto da câmera</b><span>É ali que fica a antena NFC do iPhone.</span></div></li>
    <li>${ICON.check}<div><b>Tela desbloqueada</b><span>O link abre sozinho, numa notificação.</span></div></li>
    <li>${ICON.check}<div><b>Nada de aplicativo</b><span>O iPhone já lê NFC de fábrica.</span></div></li>
  </ul>
</div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">Android</span>
  <h2 class="h-lg">Encoste o <em>meio das costas.</em></h2>
</div>
<div class="duas">
  <div class="diagrama"><div class="mini-phone mini-phone--and grande"><span class="cam cam--and"></span><span class="zona zona--meio"></span><span class="rot rot--meio">antena<br>aqui</span></div></div>
  <ul class="lista">
    <li>${ICON.check}<div><b>NFC ligado</b><span>Já vem ativado na maioria dos aparelhos.</span></div></li>
    <li>${ICON.check}<div><b>De 1 a 4 cm</b><span>Nem precisa encostar de verdade.</span></div></li>
    <li>${ICON.check}<div><b>Com capinha</b><span>Funciona normalmente, sem tirar nada.</span></div></li>
  </ul>
</div>` },
  { tema: "blue", onda: true, rodape: pill("Plaquinhas NFC + QR a partir de R$ 79,99", "pill--branca"), conteudo: `
<div class="bloco">
  <span class="kicker kicker--claro">E se o celular não tiver NFC?</span>
  <h2 class="h-lg">Tem QR code.<br><em>Sempre.</em></h2>
  <p class="sub">Toda plaquinha mstag vem com QR code impresso. O cliente aponta a câmera e cai no mesmo link.</p>
</div>
<div class="cena cena--qr">${classica("10x10", "azul")}<span class="qr-anel"></span></div>` },
]);

/* P02 · post único · 10×10 ou 10×15 em L */
post("p02-quadrada-ou-em-l", [
  { tema: "paper", rodape: `<span class="nota">Linha Clássica · acrílico 3 mm · NFC + QR dinâmico</span>`, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">Linha Clássica · Avaliação Google</span>
  <h1 class="h-lg">Quadrada ou <em>em L?</em></h1>
  <p class="sub sub--escuro">O design mais pedido da mstag, em dois tamanhos.</p>
</div>
<div class="tamanhos">
  <figure><div class="tam__img tam__img--q">${classica("10x10", "preto-azul")}</div>
    <figcaption><b>10 × 10 cm</b><span>Deitada no caixa e no balcão</span><strong>R$ 79,99</strong></figcaption></figure>
  <figure><div class="tam__img tam__img--l">${classica("10x15", "azul")}</div>
    <figcaption><b>10 × 15 cm em L</b><span>Em pé no balcão e na mesa</span><strong>R$ 89,99</strong></figcaption></figure>
</div>` },
]);

/* P03 · post único · Sem bateria, sem tomada, sem app */
post("p03-sem-bateria", [
  { tema: "blue", onda: true, rodape: "", conteudo: `
<div class="bloco">
  <span class="kicker kicker--claro">Como a plaquinha funciona</span>
  <h1 class="h-xl h-xl--3">Sem bateria.<br>Sem tomada.<br><em>Sem app.</em></h1>
  <p class="sub">O chip é ativado pelo próprio celular na hora da leitura. Não tem nada pra carregar, ligar ou atualizar.</p>
</div>
<div class="chip-cena"><div class="chip"><span></span></div><div class="ondas">${ICON.nfc}</div><div class="mini-phone mini-phone--deitado"><span class="cam"></span></div></div>
<div class="numeros">
  <div><b>0</b><span>baterias pra trocar</span></div>
  <div><b>1–4 cm</b><span>de distância do celular</span></div>
  <div><b>QR</b><span>de reserva em toda placa</span></div>
</div>` },
]);

/* P04 · carrossel · 5 lugares */
const lugares = [
  ["01", "No caixa", "O cliente já está com o celular na mão pra pagar. É o momento perfeito pra pedir a avaliação.", "Plaquinha Avaliação Google", `<div class="lugar__vis lugar__vis--q">${classica("10x10", "preto-azul")}</div>`],
  ["02", "Na mesa", "Cardápio, Wi-Fi e Pix sem ninguém precisar chamar o garçom.", "Display de mesa multi-link", `<div class="lugar__vis lugar__vis--t">${plate({ modelo: "multilink", cor: "light", nome: "Café Aurora" })}</div>`],
  ["03", "No provador", "Gostou da peça? Segue a loja antes de sair e vê a coleção nova primeiro.", "Plaquinha NFC Instagram", `<div class="lugar__vis">${plate({ modelo: "instagram", cor: "light", nome: "Ateliê Lume" })}</div>`],
  ["04", "Na recepção", "Quem está esperando tem tempo. Deixa o WhatsApp a um toque pra marcar o próximo horário.", "Plaquinha NFC WhatsApp", `<div class="lugar__vis">${plate({ modelo: "whatsapp", cor: "dark", nome: "Studio Bela" })}</div>`],
  ["05", "Na mão do atendente", "Serviço entregue, cliente sorrindo: o atendente oferece o cartão e a avaliação sai na hora.", "Cartão NFC Google · R$ 19,90", `<div class="lugar__vis lugar__vis--foto">${foto("assets/cartao/cartao-google-balcao.webp")}</div>`],
];
post("p04-cinco-lugares", [
  { tema: "white", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">Guia rápido</span>
  <h1 class="h-xl">5 lugares onde a plaquinha <em>trabalha sozinha.</em></h1>
  <p class="sub sub--escuro">Não é só no caixa. Veja onde cada uma rende mais.</p>
</div>
<div class="mapa">${lugares.map(([n, t]) => `<div class="mapa__item"><b>${n}</b><span>${t}</span></div>`).join("")}</div>` },
  ...lugares.map(([n, t, d, prod, vis], i) => ({
    tema: i % 2 ? "ink" : "paper",
    rodape: i === lugares.length - 1 ? pill("Salve pra mostrar pro seu sócio", i % 2 ? "pill--branca" : "pill--azul") : arraste,
    conteudo: `
<div class="lugar">
  <span class="lugar__n">${n}</span>
  <h2 class="h-lg">${t}</h2>
  <p class="sub ${i % 2 ? "" : "sub--escuro"}">${d}</p>
  ${pill(prod, i % 2 ? "pill--escura" : "pill--clara")}
</div>
${vis}`,
  })),
]);

/* P05 · post único · barbearias e salões */
post("p05-barbearia", [
  { tema: "ink", rodape: pill("Plaquinha Avaliação Google · R$ 79,99", "pill--branca"), conteudo: `
<div class="bloco">
  <span class="kicker">Para barbearias e salões</span>
  <h1 class="h-lg">Corte aprovado no espelho.<br><em>5 estrelas no Google.</em></h1>
  <p class="sub">Na hora de pagar, o cliente encosta o celular e avalia antes de levantar da cadeira.</p>
</div>
<div class="cena cena--barber">
  <div class="cena__plate">${plate({ modelo: "google", cor: "dark", nome: "Navalha Barbearia" })}</div>
  ${celular(telaGoogle("Navalha Barbearia"), "phone--dir")}
</div>` },
]);

/* P06 · carrossel · QR dinâmico */
post("p06-mudou-o-link", [
  { tema: "paper", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">QR dinâmico</span>
  <h1 class="h-xl">Mudou o link?<br><em>A placa fica.</em></h1>
  <p class="sub sub--escuro">Nada de jogar acrílico fora porque o @ do Instagram mudou.</p>
</div>
<div class="cena cena--troca"><div class="troca__placa">${classica("10x15", "preto-cinza")}</div><span class="troca__icone">${ICON.troca}</span></div>` },
  { tema: "ink", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker">Acontece com todo negócio</span>
  <h2 class="h-lg">O link muda.<br><em>Sempre muda.</em></h2>
</div>
<div class="trocas">
  <div class="troca"><span class="velho">@cafeaurora</span>${ICON.seta}<span class="novo">@cafeaurora.oficial</span></div>
  <div class="troca"><span class="velho">cardápio de verão</span>${ICON.seta}<span class="novo">cardápio de inverno</span></div>
  <div class="troca"><span class="velho">WhatsApp antigo</span>${ICON.seta}<span class="novo">WhatsApp Business</span></div>
  <div class="troca"><span class="velho">promo de outubro</span>${ICON.seta}<span class="novo">promo de novembro</span></div>
</div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">Como a mstag resolve</span>
  <h2 class="h-lg">Cada placa tem <em>o seu jeito.</em></h2>
</div>
<div class="linhas">
  <div class="linha"><span class="linha__ic">${ICON.troca}</span><div><b>Linha Clássica</b><span>O QR é dinâmico: o destino troca sem imprimir outra placa.</span></div></div>
  <div class="linha"><span class="linha__ic">${ICON.link}</span><div><b>Display de mesa multi-link</b><span>Você mesmo troca os links quando quiser.</span></div></div>
  <div class="linha"><span class="linha__ic linha__ic--nfc">${ICON.nfc}</span><div><b>Demais plaquinhas</b><span>A gente regrava o chip pra você.</span></div></div>
</div>` },
  { tema: "blue", onda: true, rodape: pill("Linha Clássica a partir de R$ 79,99", "pill--branca"), conteudo: `
<div class="bloco">
  <h2 class="h-xl">Uma placa que <em>acompanha</em> o seu negócio.</h2>
  <p class="sub">Compra uma vez, muda o destino quando precisar.</p>
</div>
<div class="cena cena--final">${classica("10x15", "preto-azul")}</div>` },
]);

/* P07 · post único · display de mesa */
post("p07-garcom", [
  { tema: "paper", rodape: pill("Display de mesa NFC · R$ 89,99", "pill--escura"), conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">Para restaurantes e cafés</span>
  <h1 class="h-lg">Seu garçom ouve isso <em>a noite inteira.</em></h1>
</div>
<div class="cena cena--chat">
  <div class="baloes">
    <span class="balao">Qual a senha do Wi-Fi?</span>
    <span class="balao">Tem cardápio?</span>
    <span class="balao">Aceita Pix?</span>
    <span class="balao">Qual o Insta de vocês?</span>
    <span class="balao balao--resp">Tá tudo aqui na mesa 👇</span>
  </div>
  <div class="chat__plate">${plate({ modelo: "multilink", cor: "light", nome: "Café Aurora" })}</div>
</div>
<p class="sub sub--escuro sub--baixo">Um toque no display abre cardápio, Wi-Fi, Pix, Instagram e WhatsApp.</p>` },
]);

/* P08 · carrossel · como responder avaliações */
const review = (nome, nota, texto, resposta) => `<div class="review"><div class="review__topo"><span class="review__av">${nome[0]}</span><div><b>${nome}</b>${estrelas(nota)}${nota < 5 ? `<span class="stars stars--off">${ICON.star.repeat(5 - nota)}</span>` : ""}</div></div><p>${texto}</p>${resposta ? `<div class="review__resp"><b>Resposta do proprietário</b><p>${resposta}</p></div>` : ""}</div>`;
post("p08-responder-avaliacoes", [
  { tema: "blue", onda: true, rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--claro">Dica de Perfil da Empresa no Google</span>
  <h1 class="h-xl">Chegou avaliação.<br><em>E agora, responde?</em></h1>
  <p class="sub">Responde. E tem jeito certo de fazer: 4 regras rápidas.</p>
</div>
<div class="cena cena--review">${review("Mariana", 5, "Melhor cappuccino da região, e o atendimento é um carinho.", "")}</div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="regra">
  <span class="lugar__n">1</span>
  <h2 class="h-lg">Responda <em>todas.</em></h2>
  <p class="sub sub--escuro">As boas e as ruins. Quem pesquisa o seu negócio lê as respostas também, e percebe quem está cuidando da casa.</p>
</div>
<div class="contador"><div><b>${estrelas(5)}</b><span>Respondida</span>${ICON.check}</div><div><b>${estrelas(4)}</b><span>Respondida</span>${ICON.check}</div><div><b>${estrelas(2)}</b><span>Respondida</span>${ICON.check}</div></div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="regra">
  <span class="lugar__n">2</span>
  <h2 class="h-lg">Use o nome e <em>cite o detalhe.</em></h2>
  <p class="sub sub--escuro">Mostra que uma pessoa leu, e não um robô.</p>
</div>
<div class="cena cena--review">${review("Mariana", 5, "Melhor cappuccino da região, e o atendimento é um carinho.", "Obrigado, Mariana! O cappuccino é receita da casa. Volta pra provar o de canela que chegou essa semana ☕")}<span class="exemplo">exemplo</span></div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="regra">
  <span class="lugar__n">3</span>
  <h2 class="h-lg">Nota baixa? <em>Calma.</em></h2>
  <p class="sub sub--escuro">Agradeça, reconheça o problema e chame pra conversar no privado. Nunca discuta em público.</p>
</div>
<div class="cena cena--review">${review("Rafael", 2, "Demorou bastante pra sair o pedido.", "Rafael, obrigado por avisar e desculpa pela espera. Sábado foi corrido e erramos na fila. Chama a gente no WhatsApp que o próximo café é por nossa conta.")}<span class="exemplo">exemplo</span></div>` },
  { tema: "ink", rodape: pill("Plaquinhas e cartão NFC a partir de R$ 19,90", "pill--branca"), conteudo: `
<div class="regra">
  <span class="lugar__n lugar__n--claro">4</span>
  <h2 class="h-lg">Nada de <em>resposta pronta.</em></h2>
  <p class="sub">"Obrigado pela avaliação!" igual em todas parece automático. Duas frases sinceras valem mais.</p>
</div>
<div class="fecho"><span class="kicker">E pra ter muita avaliação pra responder?</span><p class="fecho__t">A plaquinha pede por você, todo dia, no balcão.</p></div>` },
]);

/* P09 · carrossel · revenda */
post("p09-revenda", [
  { tema: "ink", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker">Programa de revenda mstag</span>
  <h1 class="h-lg">Revenda plaquinhas NFC. <em>Você define o preço.</em></h1>
  <p class="sub">Compre um lote a partir de 6 unidades e venda pros negócios da sua região.</p>
</div>
<div class="lote">${["google", "instagram", "whatsapp", "google", "instagram", "whatsapp"].map((m, i) => `<div class="lote__p">${plate({ modelo: m, cor: i % 3 === 1 ? "light" : "dark", nome: "Seu cliente" })}</div>`).join("")}</div>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">Preço de revenda</span>
  <h2 class="h-lg">Quanto mais compra, <em>menor o preço.</em></h2>
</div>
<div class="faixas">
  <div class="faixa"><b>6 a 14</b><span>unidades por pedido</span><em>pra começar</em></div>
  <div class="faixa"><b>15 a 29</b><span>unidades por pedido</span><em>preço menor</em></div>
  <div class="faixa faixa--top"><b>30 ou mais</b><span>unidades por pedido</span><em>o menor preço</em></div>
</div>
<p class="sub sub--escuro sub--baixo">Vale pra placa 10 × 10 cm e pra 10 × 15 cm em L. Os valores de cada faixa a gente passa no WhatsApp.</p>` },
  { tema: "paper", rodape: arraste, conteudo: `
<div class="bloco">
  <span class="kicker kicker--azul">O app mstag</span>
  <h2 class="h-lg">Configura na frente <em>do cliente.</em></h2>
</div>
<div class="duas duas--app">
  <ol class="passos">
    <li><b>Escaneie a plaquinha</b><span>com o seu celular</span></li>
    <li><b>O painel abre</b><span>direto naquela placa</span></li>
    <li><b>Coloque o link</b><span>Google, Insta, WhatsApp...</span></li>
    <li><b>O cliente testa</b><span>ali mesmo, com você</span></li>
  </ol>
  ${celular(telaApp(), "phone--app")}
</div>` },
  { tema: "blue", onda: true, rodape: pill("WhatsApp (41) 98469-9726", "pill--branca"), conteudo: `
<div class="bloco">
  <span class="kicker kicker--claro">Pra quem é</span>
  <h2 class="h-lg">Pra quem já vende <em>pra negócio local.</em></h2>
</div>
<div class="quem">
  <div><b>Agências e social media</b><span>Mais um serviço pros clientes que você já atende.</span></div>
  <div><b>Gráficas</b><span>Combina com cartão, banner e cardápio.</span></div>
  <div><b>Representantes</b><span>Leva na visita e fecha ali mesmo.</span></div>
  <div><b>Porta a porta</b><span>O cliente aproxima o celular e entende.</span></div>
</div>` },
]);

/* P10 · post único · Black Friday */
const dias = Array.from({ length: 35 }, (_, i) => i); // 24/10 a 27/11: 34 dias + o dia da Black
post("p10-black-friday", [
  { tema: "ink", rodape: pill("Cartão NFC Google + base · R$ 19,90", "pill--branca"), conteudo: `
<div class="bloco">
  <span class="kicker">Black Friday · 27 de novembro</span>
  <h1 class="h-lg">5 semanas.<br><em>Dá tempo de encher o Google de estrelas.</em></h1>
  <p class="sub">Quem pesquisa antes de comprar olha as estrelas. Comece a pedir agora.</p>
</div>
<div class="calendario">${dias.map((i) => `<span class="${i < 34 ? "on" : "bf"}">${i < 34 ? ICON.star : "BF"}</span>`).join("")}</div>` },
]);

/* ------------------------------------------------------------
   Estilo das artes
   ------------------------------------------------------------ */
const CSS = `
*{box-sizing:border-box}
html,body{margin:0;background:#000}
.post{--cob:#3047FF;--cob2:#6B7CFF;--ink:#0B1220;--paper:#EEF1F6;
  position:relative;width:1080px;height:1350px;overflow:hidden;padding:72px 76px 64px;display:flex;flex-direction:column;
  font-family:Manrope,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.t-paper{background:var(--paper);color:var(--ink)}
.t-white{background:#fff;color:var(--ink)}
.t-ink{background:radial-gradient(circle at 85% 70%,rgba(48,71,255,.32),transparent 55%),var(--ink);color:#fff}
.t-blue{background:linear-gradient(160deg,#3B55FF 0%,#2A3FE6 60%,#2237D0 100%);color:#fff}
.onda{position:absolute;left:0;right:0;bottom:0;height:260px;width:100%;color:#fff}
.t-blue .onda path:last-child{fill:#F2F4FF}
.topo{display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2}
.logo{height:34px;width:auto}
.dots{display:flex;gap:8px;align-items:center}.dots i{width:10px;height:10px;border-radius:99px;background:currentColor;opacity:.25}.dots i.on{width:34px;opacity:1}
.t-paper .dots i.on,.t-white .dots i.on{background:var(--cob)}
.rodape{margin-top:auto;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2;font-weight:700;font-size:22px}
.url{opacity:.7}
.t-blue .rodape .url{color:var(--ink);opacity:.75}
.arraste{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:24px}.arraste svg{width:26px}
.t-paper .arraste,.t-white .arraste{color:var(--cob)}
.t-blue .rodape .arraste{color:var(--cob)}
.pill{display:inline-flex;align-items:center;gap:10px;padding:14px 26px;border-radius:99px;font-weight:800;font-size:23px}
.pill--branca{background:#fff;color:var(--ink)}
.t-blue .pill--branca{background:var(--ink);color:#fff}
.pill--azul{background:var(--cob);color:#fff}
.pill--escura{background:var(--ink);color:#fff}
.pill--clara{background:#fff;color:var(--ink);box-shadow:0 0 0 2px #D3DAE6 inset}
.nota{font-size:20px;font-weight:700;opacity:.65}
.bloco{position:relative;z-index:2;margin-top:64px;display:flex;flex-direction:column;gap:26px}
.kicker{font-family:"JetBrains Mono",monospace;font-size:22px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#8C9BFF}
.kicker--azul{color:var(--cob)}.kicker--claro{color:#CDD4FF}
h1,h2{margin:0;font-family:"Space Grotesk",sans-serif;font-weight:600;letter-spacing:-.035em;text-wrap:balance}
.h-xl{font-size:104px;line-height:.98}.h-xl--3{font-size:112px}
.h-lg{font-size:84px;line-height:1.02}
h1 em,h2 em{font-style:normal;color:var(--cob)}
.t-ink h1 em,.t-ink h2 em{color:var(--cob2)}
.t-blue h1 em,.t-blue h2 em{color:#C3CCFF}
.sub{margin:0;font-size:31px;line-height:1.4;font-weight:500;opacity:.85;max-width:860px}
.sub--escuro{color:#3A465F;opacity:1}
.sub--baixo{position:relative;z-index:2;margin-top:28px}
.stars{display:inline-flex;gap:3px}.stars svg{width:26px;height:26px}
.stars--off svg path{fill:#CBD2DE}
/* --- peças do site --- */
.plate{--f-display:"Space Grotesk",Manrope,sans-serif;--f-mono:"JetBrains Mono",monospace;--cobalt-2:#5B6DFF}
.foto{display:block;width:100%;height:100%;object-fit:cover}
/* --- cenas --- */
.cena{position:relative;flex:1;z-index:1}
.cena--duo .mini-phone--ios{position:absolute;left:40px;top:60px;transform:rotate(-12deg)}
.cena--duo .mini-phone--and{position:absolute;left:250px;top:110px;transform:rotate(6deg)}
.cena--duo .cena__plate{position:absolute;right:20px;top:90px;width:360px;transform:rotate(5deg)}
.mini-phone{width:190px;height:390px;border-radius:38px;background:linear-gradient(160deg,#2A3348,#141B2B);box-shadow:0 0 0 3px rgba(255,255,255,.14) inset,0 30px 50px -20px rgba(0,0,0,.6);position:relative}
.t-paper .mini-phone{background:linear-gradient(160deg,#1F2740,#0B1220)}
.mini-phone.grande{width:250px;height:515px;border-radius:50px}
.cam{position:absolute;left:18%;top:5%;width:30%;aspect-ratio:1;border-radius:24%;background:#0B1220;box-shadow:0 0 0 2px rgba(255,255,255,.12)}
.cam--and{left:50%;transform:translateX(-50%);width:22%;aspect-ratio:.6;border-radius:99px}
.zona{position:absolute;left:50%;transform:translateX(-50%);width:64%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(91,109,255,.95) 0 22%,rgba(91,109,255,.35) 23% 45%,rgba(91,109,255,.12) 46% 70%,transparent 71%)}
.zona--topo{top:-2%}.zona--meio{top:34%}
.rot{position:absolute;left:calc(100% + 90px);font-family:"JetBrains Mono",monospace;font-size:22px;font-weight:500;color:var(--cob);text-transform:uppercase;letter-spacing:.06em;line-height:1.2;transform:translateY(-50%)}
.rot::before{content:"";position:absolute;right:calc(100% + 10px);top:50%;width:76px;border-top:2px dashed var(--cob)}
.rot--topo{top:13%}.rot--meio{top:50%}
.duas{position:relative;z-index:2;flex:1;display:grid;grid-template-columns:500px 1fr;gap:20px;align-items:center}
.diagrama{display:grid;place-items:center start;padding-left:30px}
.lista{list-style:none;margin:0;padding:0;display:grid;gap:34px}
.lista li{display:grid;grid-template-columns:52px 1fr;gap:18px;align-items:start}
.lista li>svg{width:52px;height:52px;padding:10px;border-radius:50%;background:var(--cob);color:#fff}
.lista b{display:block;font-size:32px;font-family:"Space Grotesk";letter-spacing:-.02em}
.lista span{display:block;font-size:24px;color:#4A5670;line-height:1.35;margin-top:4px}
.cena--qr{display:grid;place-items:center}
.cena--qr .pc{width:520px;transform:rotate(-4deg);margin-top:-40px}
.qr-anel{position:absolute;left:50%;top:50%;width:236px;height:236px;margin:-12px 0 0 28px;border:5px solid #FBBC05;border-radius:28px;transform:rotate(-4deg);box-shadow:0 0 0 12px rgba(251,188,5,.25)}
.tamanhos{position:relative;z-index:2;flex:1;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:end;padding-bottom:30px}
.tamanhos figure{margin:0;display:flex;flex-direction:column;gap:26px;align-items:center}
.tam__img--q{width:420px}.tam__img--l{width:380px}
.tamanhos figcaption{display:grid;justify-items:center;gap:4px;text-align:center}
.tamanhos figcaption b{font-family:"Space Grotesk";font-size:38px;letter-spacing:-.02em}
.tamanhos figcaption span{font-size:23px;color:#4A5670}
.tamanhos figcaption strong{margin-top:10px;font-family:"Space Grotesk";font-size:34px;background:var(--cob);color:#fff;padding:6px 20px;border-radius:12px}
.chip-cena{position:relative;z-index:2;height:300px;display:flex;align-items:center;justify-content:center;gap:40px;margin-top:20px}
.chip{width:170px;height:170px;border-radius:30px;background:#F2F4FF;display:grid;place-items:center;box-shadow:0 20px 40px -14px rgba(0,0,0,.45)}
.chip span{width:90px;height:90px;border-radius:14px;background:linear-gradient(135deg,#FFD66B,#E2A93B);box-shadow:inset 0 0 0 6px rgba(255,255,255,.35)}
.ondas svg{width:150px;height:150px;color:#fff}
.mini-phone--deitado{width:170px;height:330px;transform:rotate(90deg)}
.numeros{position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:10px}
.numeros div{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:24px;padding:24px 24px}
.numeros b{display:block;font-family:"Space Grotesk";font-size:52px;letter-spacing:-.03em;line-height:1}
.numeros span{display:block;font-size:21px;margin-top:8px;opacity:.85}
.mapa{position:relative;z-index:2;margin-top:auto;margin-bottom:40px;display:grid;gap:14px}
.mapa__item{display:flex;align-items:center;gap:26px;padding:22px 30px;border-radius:22px;background:var(--paper);font-size:34px;font-weight:700;font-family:"Space Grotesk";letter-spacing:-.02em}
.mapa__item b{font-family:"JetBrains Mono";font-size:26px;color:var(--cob);font-weight:500}
.lugar,.regra{position:relative;z-index:2;margin-top:56px;display:flex;flex-direction:column;align-items:flex-start;gap:24px}
.lugar__n{font-family:"Space Grotesk";font-weight:600;font-size:140px;line-height:.85;color:var(--cob);letter-spacing:-.05em}
.t-ink .lugar__n{color:var(--cob2)}
.lugar .pill{margin-top:8px}
.pill--escura{background:rgba(255,255,255,.1);color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.18) inset}
.t-paper .pill--escura{background:var(--ink);box-shadow:none}
.lugar__vis{position:absolute;right:76px;bottom:150px;width:400px;transform:rotate(4deg);z-index:1}
.lugar__vis--q{width:390px}
.lugar__vis--t{width:300px;bottom:130px}
.lugar__vis--foto{width:470px;height:470px;border-radius:32px;overflow:hidden;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}
.cena--barber{margin-top:40px}
.cena--barber .cena__plate{position:absolute;left:10px;top:70px;width:430px;transform:rotate(-6deg)}
.phone{width:330px;aspect-ratio:9/19;border-radius:54px;background:#05070D;padding:12px;box-shadow:0 0 0 3px #2A3348,0 40px 70px -24px rgba(0,0,0,.7)}
.phone__screen{position:relative;width:100%;height:100%;border-radius:44px;background:#fff;overflow:hidden;color:#0B1220}
.phone__notch{position:absolute;left:50%;top:12px;transform:translateX(-50%);width:96px;height:28px;border-radius:99px;background:#05070D;z-index:3}
.phone--dir{position:absolute;right:30px;top:-40px;width:270px;transform:rotate(5deg)}
.scr{position:absolute;inset:0;padding:64px 24px 24px;display:flex;flex-direction:column;align-items:center;gap:12px;font-size:16px}
.scr__bar{align-self:stretch;display:flex;align-items:center;gap:8px;padding-bottom:12px;border-bottom:1px solid #E6EAF2;font-size:20px}.scr__bar svg{width:26px}
.scr__avatar{margin-top:14px;width:78px;height:78px;border-radius:50%;background:var(--cob);color:#fff;display:grid;place-items:center;font-weight:800;font-size:28px}
.scr__nome{font-weight:800;font-size:21px;text-align:center}
.scr__mute{color:#5A6480;font-size:16px}
.scr__stars{display:flex;gap:6px;margin:10px 0}.scr__stars svg path{fill:#FBBC05}.scr__stars svg{width:42px;height:42px}
.scr__box{align-self:stretch;border:1.5px solid #D3DAE6;border-radius:14px;padding:16px;display:grid;gap:10px}.scr__box i{height:9px;border-radius:9px;background:#E3E8F0}
.scr__btn{align-self:stretch;margin-top:auto;background:#1A73E8;color:#fff;text-align:center;padding:14px;border-radius:99px;font-weight:800;font-size:18px}
.scr--app{align-items:stretch;gap:10px}
.scr__url{font-family:"JetBrains Mono";font-size:14px;text-align:center;color:#5A6480;background:#EEF1F6;border-radius:99px;padding:6px}
.scr__tag{margin-top:8px;background:var(--ink);color:#fff;border-radius:16px;padding:14px 16px;display:grid}.scr__tag span{font-size:13px;opacity:.7}.scr__tag b{font-family:"JetBrains Mono";font-size:20px}
.scr__label{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#5A6480;margin-top:8px}
.scr__opts{display:grid;gap:8px}.scr__opts span{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid #D3DAE6;border-radius:12px;font-weight:700;font-size:16px}.scr__opts svg{width:24px}.scr__opts .on{border-color:var(--cob);background:#E4E7FF}
.scr__input{border:1.5px solid #D3DAE6;border-radius:12px;padding:10px 12px;font-family:"JetBrains Mono";font-size:12.5px}
.scr--app .scr__btn{background:var(--cob);margin-top:6px}
.scr__ok{display:flex;align-items:center;justify-content:center;gap:6px;color:#1FA855;font-weight:800;font-size:15px}.scr__ok svg{width:20px}
.cena--troca{display:grid;place-items:center}
.troca__placa{width:330px;transform:rotate(-5deg)}
.troca__icone{position:absolute;right:170px;top:40px;width:130px;height:130px;border-radius:50%;background:var(--cob);color:#fff;display:grid;place-items:center;box-shadow:0 20px 40px -12px rgba(48,71,255,.6)}.troca__icone svg{width:76px}
.trocas{position:relative;z-index:2;margin-top:70px;display:grid;gap:22px}
.troca{display:grid;grid-template-columns:1fr 50px 1fr;align-items:center;gap:20px;padding:28px 30px;border-radius:24px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);font-size:29px;font-weight:700}
.troca svg{width:44px;color:var(--cob2)}
.velho{text-decoration:line-through;text-decoration-thickness:3px;opacity:.5}
.novo{color:#fff}
.linhas{position:relative;z-index:2;margin-top:90px;display:grid;gap:30px}
.linha{display:grid;grid-template-columns:100px 1fr;gap:28px;align-items:center;padding:40px 34px;background:#fff;border-radius:28px;box-shadow:0 1px 0 #D3DAE6}
.linha__ic{width:100px;height:100px;border-radius:26px;background:var(--cob);color:#fff;display:grid;place-items:center}.linha__ic svg{width:60px}
.linha__ic:has(svg rect){background:none}.linha__ic:has(svg rect) svg{width:100px}
.linha__ic--nfc{background:var(--ink)}
.linha b{display:block;font-family:"Space Grotesk";font-size:36px;letter-spacing:-.02em}
.linha div span{display:block;font-size:25px;color:#4A5670;margin-top:6px;line-height:1.35}
.cena--final{display:grid;place-items:center}.cena--final .pc{width:330px;transform:rotate(4deg);margin-top:-20px}
.cena--chat{margin-top:56px;display:grid;grid-template-columns:1fr 330px;gap:30px;align-items:center}
.baloes{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.balao{background:#fff;padding:20px 28px;border-radius:28px 28px 28px 8px;font-size:30px;font-weight:700;box-shadow:0 10px 24px -14px rgba(11,18,32,.35)}
.balao:nth-child(2){margin-left:40px}.balao:nth-child(3){margin-left:10px}.balao:nth-child(4){margin-left:60px}
.balao--resp{align-self:flex-end;background:var(--cob);color:#fff;border-radius:28px 28px 8px 28px}
.chat__plate{transform:rotate(4deg)}
.cena--review{display:grid;place-items:start center;padding-top:80px}
.review{width:820px;background:#fff;color:#0B1220;border-radius:30px;padding:34px 38px;box-shadow:0 30px 60px -28px rgba(11,18,32,.45);display:grid;gap:16px;transform:rotate(-1.5deg)}
.review__topo{display:flex;gap:18px;align-items:center}.review__topo b{display:block;font-size:28px;margin-bottom:4px}
.review__av{width:66px;height:66px;border-radius:50%;background:#FF6A3D;color:#fff;display:grid;place-items:center;font-weight:800;font-size:30px}
.review>p{margin:0;font-size:28px;line-height:1.4}
.review__resp{border-left:5px solid var(--cob);background:#F2F4FF;border-radius:0 18px 18px 0;padding:18px 22px}
.review__resp b{font-size:19px;text-transform:uppercase;letter-spacing:.06em;color:var(--cob)}
.review__resp p{margin:8px 0 0;font-size:25px;line-height:1.4}
.exemplo{position:absolute;right:110px;top:52px;z-index:3;font-family:"JetBrains Mono";font-size:19px;text-transform:uppercase;letter-spacing:.08em;background:#FBBC05;color:#0B1220;padding:6px 14px;border-radius:8px;transform:rotate(3deg)}
.contador{position:relative;z-index:2;margin-top:auto;margin-bottom:60px;display:grid;gap:16px}
.contador div{display:grid;grid-template-columns:auto 1fr 46px;align-items:center;gap:22px;background:#fff;border-radius:22px;padding:22px 28px;font-size:26px;font-weight:700}
.contador div>svg{width:46px;height:46px;padding:8px;border-radius:50%;background:#1FA855;color:#fff}
.contador .stars svg{width:32px;height:32px}
.fecho{position:relative;z-index:2;margin-top:auto;margin-bottom:40px;padding:40px;border-radius:32px;background:var(--cob)}
.fecho .kicker{color:#CDD4FF}.fecho__t{margin:14px 0 0;font-family:"Space Grotesk";font-weight:600;font-size:52px;line-height:1.08;letter-spacing:-.03em}
.lote{position:relative;z-index:1;flex:1;display:grid;grid-template-columns:repeat(3,250px);gap:26px;justify-content:center;align-content:center;margin-bottom:40px;transform:rotate(-4deg)}
.lote__p:nth-child(even){transform:translateY(40px)}
.faixas{position:relative;z-index:2;margin-top:70px;display:grid;gap:20px}
.faixa{display:grid;grid-template-columns:300px 1fr auto;align-items:center;gap:20px;padding:34px 36px;background:#fff;border-radius:28px}
.faixa b{font-family:"Space Grotesk";font-size:56px;letter-spacing:-.03em;color:var(--cob)}
.faixa span{font-size:26px;color:#4A5670;font-weight:600}
.faixa em{font-style:normal;font-weight:800;font-size:22px;padding:8px 18px;border-radius:99px;background:#E4E7FF;color:var(--cob)}
.faixa--top{background:var(--ink)}.faixa--top b{color:#fff}.faixa--top span{color:#B8C1D9}.faixa--top em{background:var(--cob);color:#fff}
.duas--app{grid-template-columns:1fr 330px;margin-top:20px}
.passos{list-style:none;margin:0;padding:0;display:grid;gap:22px;counter-reset:p}
.passos li{counter-increment:p;display:grid;grid-template-columns:64px 1fr;column-gap:22px;align-items:center}
.passos li::before{content:counter(p);grid-row:span 2;width:64px;height:64px;border-radius:50%;background:var(--cob);color:#fff;display:grid;place-items:center;font-family:"Space Grotesk";font-weight:600;font-size:32px}
.passos b{font-family:"Space Grotesk";font-size:34px;letter-spacing:-.02em}
.passos span{font-size:24px;color:#4A5670}
.quem{position:relative;z-index:2;margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.quem div{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.25);border-radius:26px;padding:30px}
.quem b{display:block;font-family:"Space Grotesk";font-size:34px;letter-spacing:-.02em;line-height:1.1}
.quem span{display:block;font-size:23px;margin-top:10px;opacity:.88;line-height:1.35}
.calendario{position:relative;z-index:2;margin:auto auto 36px;width:720px;display:grid;grid-template-columns:repeat(7,1fr);gap:12px}
.calendario span{aspect-ratio:1;border-radius:18px;display:grid;place-items:center;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1)}
.calendario span svg{width:46%}
.calendario .bf{background:var(--cob);border:0;font-family:"Space Grotesk";font-weight:700;font-size:34px;color:#fff}
`;

/* ------------------------------------------------------------
   Renderização
   ------------------------------------------------------------ */
const filtro = process.argv.slice(2);
const lista = POSTS.filter((p) => !filtro.length || filtro.some((f) => p.id.startsWith(f)));
const { chromium } = await carregaPlaywright();
const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1350 } });

for (const p of lista) {
  const pasta = path.join(saida, p.id);
  fs.rmSync(pasta, { recursive: true, force: true });
  fs.mkdirSync(pasta, { recursive: true });
  for (const [i, s] of p.slides.entries()) {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Unbounded:wght@600&display=swap">
<link rel="stylesheet" href="${arquivo("css/styles.css")}"><style>${CSS}</style></head>
<body>${slide({ ...s, pagina: i + 1, total: p.slides.length })}</body></html>`;
    const temp = path.join(os.tmpdir(), `mstag-post-${p.id}-${i}.html`);
    fs.writeFileSync(temp, html);
    await pagina.goto(pathToFileURL(temp).href, { waitUntil: "networkidle" });
    await pagina.evaluate(() => document.fonts.ready);
    const nome = p.slides.length > 1 ? `${String(i + 1).padStart(2, "0")}.png` : "post.png";
    await (await pagina.$(".post")).screenshot({ path: path.join(pasta, nome) });
  }
  console.log("ok", p.id, p.slides.length === 1 ? "(post único)" : `(${p.slides.length} slides)`);
}
await navegador.close();
