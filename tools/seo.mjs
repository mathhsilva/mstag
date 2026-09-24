#!/usr/bin/env node
/*
 * Gera tudo que é de SEO a partir de js/config.js, do FAQ do index.html e de tools/paginas.mjs.
 * Rode sempre que mudar preços, produtos, perguntas ou páginas:   node tools/seo.mjs
 *
 * Atualiza:
 *   index.html           dados estruturados (JSON-LD), tabela "Quanto custa" e links dos guias no rodapé
 *   <slug>/index.html    uma página de busca para cada item de tools/paginas.mjs
 *   sitemap.xml  robots.txt  llms.txt
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { PAGINAS } from "./paginas.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ler = (f) => fs.readFileSync(path.join(raiz, f), "utf8");
const gravar = (f, txt) => {
  fs.mkdirSync(path.dirname(path.join(raiz, f)), { recursive: true });
  fs.writeFileSync(path.join(raiz, f), txt);
};

// Carrega a configuração da loja como o navegador carregaria
const ctx = { window: {} };
vm.runInNewContext(ler("js/config.js"), ctx);
const { LOJA, CLASSICA, CARTAO_GOOGLE: CARTAO, PRODUTOS } = ctx.window;
const SITE = LOJA.site.replace(/\/$/, "");
const url = (p) => SITE + "/" + p.replace(/^\//, "");
const hoje = new Date().toISOString().slice(0, 10);
const brl = (v) => "R$ " + v.toFixed(2).replace(".", ",");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const semTags = (s) => String(s).replace(/<[^>]+>/g, "");
const telefone = "+55" + LOJA.whatsapp.replace(/^55/, "");

/* ---------- Catálogo em formato único ---------- */
// "grupo" é a chave usada em PAGINAS[].mostrar e no data-mostrar do site
const catalogo = [];
if (CARTAO) {
  catalogo.push({
    id: CARTAO.id, grupo: CARTAO.id, nome: CARTAO.nome + " com base de madeira", detalhe: CARTAO.inclui || "",
    descricao: CARTAO.resumo, preco: CARTAO.preco, imagem: CARTAO.fotos[0].src,
  });
}
for (const t of CLASSICA.tamanhos) {
  const imgs = CLASSICA.imagens[t.id];
  catalogo.push({
    id: `${CLASSICA.id}-${t.id}`, grupo: "classica", nome: `Placa NFC Avaliação Google ${t.rotulo} · Linha Clássica`,
    detalhe: `Acrílico com NFC e QR code · ${Object.keys(imgs).length} cores`,
    descricao: CLASSICA.resumo, preco: t.preco, imagem: imgs[Object.keys(imgs)[0]],
  });
}
for (const p of PRODUTOS) {
  catalogo.push({
    // no catálogo de busca, todo nome leva "NFC" (é assim que as pessoas pesquisam)
    id: p.id, grupo: p.id, nome: /NFC/.test(p.nome) ? p.nome : /^(Plaquinha|Display|Kit)/.test(p.nome) ? p.nome.replace(/^(\S+)/, "$1 NFC") : "Plaquinha NFC " + p.nome,
    detalhe: p.medida, descricao: p.resumo, preco: p.preco, imagem: null,
  });
}
catalogo.sort((a, b) => a.preco - b.preco);
const menor = catalogo[0].preco;
const maior = catalogo[catalogo.length - 1].preco;
const doGrupo = (grupos) => catalogo.filter((c) => grupos.includes(c.grupo));

/* ---------- Blocos reutilizados ---------- */
function produtoLD(c) {
  return {
    "@type": "Product",
    "@id": url(`#produto-${c.id}`),
    name: c.nome,
    description: c.descricao,
    ...(c.imagem ? { image: url(c.imagem) } : {}),
    brand: { "@type": "Brand", name: LOJA.nome },
    category: "Plaquinha NFC",
    offers: {
      "@type": "Offer", price: c.preco.toFixed(2), priceCurrency: "BRL",
      availability: "https://schema.org/InStock", url: url("#produtos"),
      seller: { "@id": url("#empresa") },
      shippingDetails: { "@type": "OfferShippingDetails", shippingDestination: { "@type": "DefinedRegion", addressCountry: "BR" } },
    },
  };
}
const listaLD = (nome, itens) => ({ "@type": "ItemList", name: nome, itemListElement: itens.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: produtoLD(c) })) });
const faqLD = (faq) => ({ "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
const scriptLD = (grafo) => `  <script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": grafo }, null, 2).replace(/</g, "\\u003c")}\n  </script>\n`;

function tabelaPrecos(itens, recuo = "          ") {
  return `${recuo}<table class="price-table">\n` +
    `${recuo}  <thead><tr><th scope="col">Produto</th><th scope="col">Preço</th></tr></thead>\n` +
    `${recuo}  <tbody>\n` +
    itens.map((c) => `${recuo}    <tr><th scope="row">${esc(c.nome)}${c.detalhe ? `<small>${esc(c.detalhe)}</small>` : ""}</th><td>${brl(c.preco)}</td></tr>\n`).join("") +
    `${recuo}  </tbody>\n${recuo}</table>\n`;
}

function trocarEntre(texto, inicio, fim, novo) {
  const i = texto.indexOf(inicio), j = texto.indexOf(fim);
  if (i < 0 || j < 0) throw new Error(`Marcador não encontrado: ${inicio}`);
  const iFim = texto.indexOf("-->", i) + 3;
  return texto.slice(0, iFim) + "\n" + novo + texto.slice(texto.lastIndexOf("\n", j) + 1);
}
function entre(texto, inicio, fim) {
  const i = texto.indexOf(inicio), j = texto.indexOf(fim);
  if (i < 0 || j < 0) throw new Error(`Marcador não encontrado: ${inicio}`);
  return texto.slice(texto.indexOf("\n", i) + 1, j);
}

/* ---------- Página principal ---------- */
let html = ler("index.html");
const faqHome = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
  .map((m) => ({ q: m[1].trim(), a: semTags(m[2]).trim() }));

const org = {
  "@type": "Organization",
  "@id": url("#empresa"),
  name: LOJA.nome,
  url: url(""),
  logo: url("assets/logo/mstag-preto-azul.png"),
  description: "A mstag vende plaquinhas e cartões NFC com QR code para avaliação no Google, Instagram, WhatsApp, cardápio, Wi-Fi e Pix, com envio para todo o Brasil.",
  sameAs: [`https://instagram.com/${LOJA.instagram}`],
  contactPoint: { "@type": "ContactPoint", contactType: "vendas", telephone: telefone, areaServed: "BR", availableLanguage: "pt-BR" },
  ...(LOJA.empresa ? { parentOrganization: { "@type": "Organization", name: LOJA.empresa.nome, url: LOJA.empresa.site } } : {}),
};
html = trocarEntre(html, "<!--SEO-JSONLD-START", "<!--SEO-JSONLD-END-->", scriptLD([
  org,
  { "@type": "WebSite", "@id": url("#site"), url: url(""), name: LOJA.nome, inLanguage: "pt-BR", publisher: { "@id": url("#empresa") } },
  {
    "@type": "WebPage", "@id": url("#pagina"), url: url(""), inLanguage: "pt-BR",
    name: "Plaquinha NFC para avaliação no Google e Instagram",
    isPartOf: { "@id": url("#site") }, about: { "@id": url("#empresa") }, dateModified: hoje,
    hasPart: PAGINAS.map((p) => ({ "@type": "WebPage", url: url(p.slug + "/"), name: p.menu })),
  },
  listaLD("Plaquinhas e cartões NFC da mstag", catalogo),
  faqLD(faqHome),
]));
html = trocarEntre(html, "<!--SEO-PRECOS-START", "<!--SEO-PRECOS-END-->", tabelaPrecos(catalogo));
html = trocarEntre(html, "<!--SEO-GUIAS-START", "<!--SEO-GUIAS-END-->",
  "        <ul>\n" + PAGINAS.map((p) => `          <li><a href="${p.slug}/">${esc(p.menu)}</a></li>\n`).join("") + "        </ul>\n");
gravar("index.html", html);

/* ---------- Páginas de busca ---------- */
const cabeca = html.slice(0, html.lastIndexOf("\n", html.indexOf("<title>")) + 1); // doctype, charset, viewport
const fontes = (html.match(/  <link rel="preconnect"[\s\S]*?<link rel="stylesheet" href="https:\/\/fonts[^>]*>\n/) || [""])[0];
const topo = entre(html, "<!--PARCIAL-TOPO-START", "<!--PARCIAL-TOPO-END-->");
const rodape = entre(html, "<!--PARCIAL-RODAPE-START", "<!--PARCIAL-RODAPE-END-->");
const faixaSpecs = (html.match(/    <section class="specs"[\s\S]*?<\/section>\n/) || [""])[0];

// Ajusta caminhos para uma página que mora numa subpasta
function paraSubpasta(trecho, slug) {
  return trecho
    .replace(/(src|href)="(?!https?:|#|\.\.\/|mailto:|tel:|data:)([^"]+)"/g, '$1="../$2"')
    .replace(/href="#(topo)"/g, 'href="../"')
    .replace(/href="#personalize"/g, 'href="../#personalize"')
    .replace(new RegExp(`href="\\.\\./${slug}/"`, "g"), `href="../${slug}/" aria-current="page"`);
}

// QR ilustrativo (mesmo desenho do site) e placa Clássica com logo por cima dos marcadores
function qr(seed) {
  let s = 0, cells = "";
  for (let k = 0; k < seed.length; k++) s = (s * 31 + seed.charCodeAt(k)) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0B1220"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0B1220"/>`;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const f = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!f && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="0 0 21 21" shape-rendering="crispEdges" aria-hidden="true"><g fill="#0B1220">${cells}</g>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
}
const G = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#fff"/><path d="M35.5 24.3c0-.9-.1-1.7-.2-2.5H24v4.8h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.9Z" fill="#4285F4"/><path d="M24 36c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5h-4v3.1A12 12 0 0 0 24 36Z" fill="#34A853"/><path d="M17.3 26.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1Z" fill="#FBBC05"/><path d="M24 16.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 13.3 18.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" fill="#EA4335"/></svg>';
function placaClassica() {
  const tam = CLASSICA.tamanhos[0], cor = CLASSICA.cores[0];
  const src = CLASSICA.imagens[tam.id][cor.id];
  return `<div class="pc pc--square"><img src="../${src}" alt="Placa NFC de avaliação Google, Linha Clássica, ${tam.rotulo}, ${cor.rotulo.toLowerCase()}" width="800" height="800" decoding="async"><span class="pc__logo">${G}</span><span class="pc__qr">${qr("classica" + tam.id)}</span></div>`;
}
function visual(v) {
  if (v.tipo === "classica") {
    return `<div class="lp-visual lp-visual--classica" aria-hidden="false">
          <div class="lp-visual__glow" aria-hidden="true"></div>
          <div class="lp-visual__placa">${placaClassica()}</div>
          <img class="lp-visual__foto" src="../${v.foto}" alt="Cartão NFC de avaliação Google em pé na base de madeira" width="900" height="900" decoding="async">
        </div>`;
  }
  if (v.tipo === "duo") {
    return `<div class="lp-visual lp-visual--duo">
          <div class="lp-visual__glow" aria-hidden="true"></div>
          <div class="lp-visual__placa">${placaClassica()}</div>
          <div class="lp-visual__tech" data-plate="${v.placa.modelo}" data-cor="${v.placa.cor}" aria-hidden="true"></div>
        </div>`;
  }
  if (v.tipo === "fotos") {
    return `<div class="lp-visual lp-visual--fotos">
          <div class="lp-visual__glow" aria-hidden="true"></div>
          <img class="lp-visual__f1" src="../${v.fotos[0]}" alt="Cartão NFC de avaliação Google, face preta, na base de madeira" width="900" height="900" decoding="async">
          <img class="lp-visual__f2" src="../${v.fotos[1]}" alt="Cartão NFC de avaliação Google, face branca, na base de madeira" width="900" height="900" decoding="async">
        </div>`;
  }
  return `<div class="lp-visual lp-visual--solo">
          <div class="lp-visual__glow" aria-hidden="true"></div>
          <div class="lp-visual__tech${v.modelo === "multilink" ? " is-tall" : ""}" data-plate="${v.modelo}" data-cor="${v.cor}" aria-hidden="true"></div>
        </div>`;
}

const CHECK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SETA = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function gerarPagina(p) {
  const itens = doGrupo(p.mostrar);
  const min = Math.min(...itens.map((c) => c.preco));
  const sub = (t) => t.replace(/\{PRECO_MIN\}/g, brl(min));
  const endereco = url(p.slug + "/");
  const og = fs.existsSync(path.join(raiz, `assets/og/${p.slug}.jpg`)) ? `assets/og/${p.slug}.jpg` : "assets/og-image.jpg";
  const faq = p.faq.map(([q, a]) => ({ q: sub(q), a: sub(a) }));
  const tituloOg = semTags(p.h1);

  const ld = scriptLD([
    {
      "@type": "WebPage", "@id": endereco + "#pagina", url: endereco, name: p.titulo, description: sub(p.descricao),
      inLanguage: "pt-BR", isPartOf: { "@id": url("#site") }, about: { "@id": url("#empresa") },
      breadcrumb: { "@id": endereco + "#migalhas" }, primaryImageOfPage: url(og), dateModified: hoje,
    },
    {
      "@type": "BreadcrumbList", "@id": endereco + "#migalhas",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: url("") },
        { "@type": "ListItem", position: 2, name: p.menu, item: endereco },
      ],
    },
    listaLD(p.menu, itens),
    faqLD(faq),
  ]);

  const relacionados = p.relacionados.map((s) => PAGINAS.find((x) => x.slug === s)).filter(Boolean);

  const corpo = `${cabeca}  <title>${esc(p.titulo)}</title>
  <meta name="description" content="${esc(sub(p.descricao))}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${endereco}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${esc(LOJA.nome)}">
  <meta property="og:url" content="${endereco}">
  <meta property="og:title" content="${esc(tituloOg)} | ${esc(LOJA.nome)}">
  <meta property="og:description" content="${esc(sub(p.descricao))}">
  <meta property="og:image" content="${url(og)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(tituloOg)}">
  <meta name="twitter:description" content="${esc(sub(p.descricao))}">
  <meta name="twitter:image" content="${url(og)}">
  <meta name="theme-color" content="#0B1220">
  <link rel="icon" href="../assets/logo/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="../assets/logo/favicon.png">
${fontes}  <link rel="stylesheet" href="../css/styles.css">
${ld}</head>
<!-- Página gerada por tools/seo.mjs a partir de tools/paginas.mjs. Edite lá e rode: node tools/seo.mjs -->
<body data-home="../">
${paraSubpasta(topo, p.slug)}
  <main>
    <nav class="crumbs wrap" aria-label="Você está em">
      <ol>
        <li><a href="../">Início</a></li>
        <li aria-current="page">${esc(p.menu)}</li>
      </ol>
    </nav>

    <section class="hero lp-hero">
      <div class="wrap hero__in">
        <div class="hero__copy">
          <h1 class="hero__title">
            <span class="eyebrow hero__kicker"><span class="pulse" aria-hidden="true"></span> ${esc(p.kicker)}</span>
            <span class="hero__big lp-big">${p.h1}</span>
          </h1>
          <p class="hero__lead">${p.lead}</p>
          <div class="hero__ctas">
            <a class="btn btn--primary" href="#produtos">Ver modelos e preços ${SETA}</a>
            <a class="btn btn--ghost" data-whats="Olá! Vim pela página &quot;${esc(p.menu)}&quot; e quero saber mais." href="#" target="_blank" rel="noopener">Falar no WhatsApp</a>
          </div>
          <ul class="hero__proof">
${p.destaques.map((d) => `            <li>${CHECK}${esc(d)}</li>`).join("\n")}
          </ul>
        </div>
        ${visual(p.visual)}
      </div>
    </section>

${faixaSpecs}
    <section class="section" id="como-funciona">
      <div class="wrap">
        <header class="section__head">
          <p class="eyebrow">Como funciona</p>
          <h2>Do pedido ao balcão em três passos</h2>
        </header>
        <ol class="steps steps--text">
${p.passos.map(([t, d], i) => `          <li class="step"><span class="step__n mono">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ol>
      </div>
    </section>

${p.secoes.map((s, i) => `    <section class="section${i % 2 === 0 ? " section--alt" : ""}">
      <div class="wrap lp-sec">
        <header class="section__head">
          <p class="eyebrow">${esc(s.eyebrow)}</p>
          <h2>${esc(s.titulo)}</h2>
        </header>
        <div class="prose">
${s.html.split("\n").map((l) => "          " + l).join("\n")}
        </div>
      </div>
    </section>
`).join("\n")}
    <section class="section" id="produtos">
      <div class="wrap">
        <header class="section__head section__head--row">
          <div>
            <p class="eyebrow">Modelos</p>
            <h2>Modelos e preços</h2>
          </div>
          <p class="section__lead">Todos chegam com o seu link gravado e testado. Monte o carrinho e finalize pelo WhatsApp.</p>
        </header>
        <div class="grid-products" id="listaProdutos" data-mostrar="${p.mostrar.join(",")}"></div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap guide">
        <div class="guide__text">
          <p class="eyebrow">Preços</p>
          <h2>Quanto custa</h2>
          <p class="guide__answer">Os modelos desta página vão de ${brl(min)} a ${brl(Math.max(...itens.map((c) => c.preco)))} por unidade, já com o seu link gravado no NFC e no QR code.</p>
          <p>O frete é calculado pelo seu CEP no atendimento pelo WhatsApp, e o pagamento pode ser feito por Pix ou cartão. Enviamos para todo o Brasil.</p>
        </div>
        <aside class="price-card" aria-label="Tabela de preços">
${tabelaPrecos(itens)}          <a class="btn btn--primary btn--block" href="#produtos">Escolher o meu modelo</a>
        </aside>
      </div>
    </section>

    <section class="section" id="duvidas">
      <div class="wrap faq">
        <header class="section__head">
          <p class="eyebrow">Dúvidas</p>
          <h2>Perguntas frequentes</h2>
          <p class="section__lead">Não achou a sua? Chame a gente no WhatsApp e respondemos rapidinho.</p>
          <a class="btn btn--ghost" data-whats="Olá! Tenho uma dúvida sobre: ${esc(p.menu)}." href="#" target="_blank" rel="noopener">Falar no WhatsApp</a>
        </header>
        <div class="faq__list">
${faq.map((f, i) => `          <details${i === 0 ? " open" : ""}>
            <summary>${esc(f.q)}</summary>
            <p>${esc(f.a)}</p>
          </details>`).join("\n")}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <header class="section__head">
          <p class="eyebrow">Veja também</p>
          <h2>Outros guias</h2>
        </header>
        <div class="related">
${relacionados.map((r) => `          <a class="related__card" href="../${r.slug}/"><b>${esc(r.menu)}</b><span>${esc(r.resumo)}</span>${SETA}</a>`).join("\n")}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <div class="final">
          <div class="final__waves" aria-hidden="true"><i></i><i></i><i></i></div>
          <img class="final__logo" src="../assets/logo/mstag-branco-azul.png" alt="mstag" width="608" height="160" loading="lazy">
          <h2>Pronto para colocar no balcão?</h2>
          <p>Escolha o modelo, mande o seu link e receba a plaquinha gravada e testada.</p>
          <div class="hero__ctas">
            <a class="btn btn--light btn--lg" href="#produtos">Comprar agora</a>
            <a class="btn btn--outline-light btn--lg" href="../">Ver todos os produtos</a>
          </div>
        </div>
      </div>
    </section>
  </main>

${paraSubpasta(rodape, p.slug)}
  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
  gravar(`${p.slug}/index.html`, corpo);
  return { ...p, endereco, min, itens, faq, descricaoFinal: sub(p.descricao) };
}
const geradas = PAGINAS.map(gerarPagina);

/* ---------- sitemap, robots, llms ---------- */
gravar("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url("")}</loc>
    <lastmod>${hoje}</lastmod>
${catalogo.filter((c) => c.imagem).map((c) => `    <image:image><image:loc>${url(c.imagem)}</image:loc></image:image>`).join("\n")}
  </url>
${geradas.map((g) => `  <url>
    <loc>${g.endereco}</loc>
    <lastmod>${hoje}</lastmod>
  </url>`).join("\n")}
</urlset>
`);

gravar("robots.txt", `# Buscadores e assistentes de IA são bem-vindos
User-agent: *
Allow: /

# Assistentes de IA (liberados de forma explícita)
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${url("sitemap.xml")}
`);

gravar("llms.txt", `# ${LOJA.nome}

> A ${LOJA.nome} vende plaquinhas e cartões NFC com QR code para negócios: avaliação no Google, Instagram, WhatsApp, cardápio digital, Wi-Fi e Pix. O cliente aproxima o celular (ou aponta a câmera) e o link abre na hora, sem aplicativo. Preços de ${brl(menor)} a ${brl(maior)}, com envio para todo o Brasil.${LOJA.empresa ? ` A ${LOJA.nome} é um produto da ${LOJA.empresa.nome} (${LOJA.empresa.site}).` : ""}

## Contato e compra

- Site: ${url("")}
- WhatsApp (pedidos e dúvidas): ${LOJA.whatsappExibicao || telefone} · https://wa.me/${LOJA.whatsapp}
- Instagram: https://instagram.com/${LOJA.instagram}
- Como comprar: monte o carrinho no site e finalize pelo WhatsApp. Frete calculado pelo CEP. Pagamento por Pix ou cartão.

## Guias

${geradas.map((g) => `- [${g.menu}](${g.endereco}): ${g.descricaoFinal}`).join("\n")}

## Produtos e preços

${catalogo.map((c) => `- **${c.nome}**: ${brl(c.preco)}.${c.detalhe ? " " + c.detalhe + "." : ""} ${c.descricao}`).join("\n")}

## Perguntas frequentes

${faqHome.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}
`);

console.log(`SEO atualizado: ${catalogo.length} produtos, ${faqHome.length} perguntas na página principal, ${geradas.length} páginas de busca (${SITE})`);
