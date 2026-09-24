#!/usr/bin/env node
/*
 * Gera os arquivos de SEO a partir de js/config.js e das perguntas do index.html.
 * Rode sempre que mudar preços, produtos ou perguntas:   node tools/seo.mjs
 *
 * Atualiza:
 *   index.html   dados estruturados (JSON-LD) e a tabela "Quanto custa"
 *   sitemap.xml  robots.txt  llms.txt
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ler = (f) => fs.readFileSync(path.join(raiz, f), "utf8");
const gravar = (f, txt) => fs.writeFileSync(path.join(raiz, f), txt);

// Carrega a configuração da loja como o navegador carregaria
const ctx = { window: {} };
vm.runInNewContext(ler("js/config.js"), ctx);
const { LOJA, CLASSICA, CARTAO_GOOGLE: CARTAO, PRODUTOS } = ctx.window;
const SITE = LOJA.site.replace(/\/$/, "");
const url = (p) => SITE + "/" + p.replace(/^\//, "");
const hoje = new Date().toISOString().slice(0, 10);
const brl = (v) => "R$ " + v.toFixed(2).replace(".", ",");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const telefone = "+55" + LOJA.whatsapp.replace(/^55/, "");

/* ---------- Catálogo em formato único ---------- */
const catalogo = [];
if (CARTAO) {
  catalogo.push({
    id: CARTAO.id, nome: CARTAO.nome + " com base de madeira", detalhe: CARTAO.inclui || "",
    descricao: CARTAO.resumo, preco: CARTAO.preco, imagem: CARTAO.fotos[0].src,
  });
}
for (const t of CLASSICA.tamanhos) {
  const imgs = CLASSICA.imagens[t.id];
  catalogo.push({
    id: `${CLASSICA.id}-${t.id}`, nome: `Placa NFC Avaliação Google ${t.rotulo} · Linha Clássica`,
    detalhe: `Acrílico com NFC e QR code · ${Object.keys(imgs).length} cores`,
    descricao: CLASSICA.resumo, preco: t.preco, imagem: imgs[Object.keys(imgs)[0]],
  });
}
for (const p of PRODUTOS) {
  catalogo.push({
    // no catálogo de busca, todo nome leva "NFC" (é assim que as pessoas pesquisam)
    id: p.id, nome: /NFC/.test(p.nome) ? p.nome : /^(Plaquinha|Display|Kit)/.test(p.nome) ? p.nome.replace(/^(\S+)/, "$1 NFC") : "Plaquinha NFC " + p.nome,
    detalhe: p.medida, descricao: p.resumo, preco: p.preco, imagem: null,
  });
}
catalogo.sort((a, b) => a.preco - b.preco);
const menor = catalogo[0].preco;
const maior = catalogo[catalogo.length - 1].preco;

/* ---------- Perguntas do FAQ (lidas do próprio HTML) ---------- */
let html = ler("index.html");
const faq = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
  .map((m) => ({ q: m[1].trim(), a: m[2].replace(/<[^>]+>/g, "").trim() }));

/* ---------- JSON-LD ---------- */
const org = {
  "@type": "Organization",
  "@id": url("#empresa"),
  name: LOJA.nome,
  url: url(""),
  logo: url("assets/logo/mstag-preto-azul.png"),
  description: "A mstag vende plaquinhas e cartões NFC com QR code para avaliação no Google, Instagram, WhatsApp, cardápio, Wi-Fi e Pix, com envio para todo o Brasil.",
  sameAs: [`https://instagram.com/${LOJA.instagram}`],
  contactPoint: {
    "@type": "ContactPoint", contactType: "vendas", telephone: telefone,
    areaServed: "BR", availableLanguage: "pt-BR",
  },
  ...(LOJA.empresa ? { parentOrganization: { "@type": "Organization", name: LOJA.empresa.nome, url: LOJA.empresa.site } } : {}),
};
const produtos = catalogo.map((c) => ({
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
}));
const grafo = {
  "@context": "https://schema.org",
  "@graph": [
    org,
    { "@type": "WebSite", "@id": url("#site"), url: url(""), name: LOJA.nome, inLanguage: "pt-BR", publisher: { "@id": url("#empresa") } },
    {
      "@type": "WebPage", "@id": url("#pagina"), url: url(""), inLanguage: "pt-BR",
      name: "Plaquinha NFC para avaliação no Google e Instagram",
      isPartOf: { "@id": url("#site") }, about: { "@id": url("#empresa") }, dateModified: hoje,
    },
    { "@type": "ItemList", name: "Plaquinhas e cartões NFC da mstag", itemListElement: produtos.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: p })) },
    { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};
const jsonld = `  <script type="application/ld+json">\n${JSON.stringify(grafo, null, 2).replace(/</g, "\\u003c")}\n  </script>\n`;

/* ---------- Tabela de preços visível ---------- */
const tabela =
  '          <table class="price-table">\n' +
  '            <thead><tr><th scope="col">Produto</th><th scope="col">Preço</th></tr></thead>\n' +
  "            <tbody>\n" +
  catalogo.map((c) => `              <tr><th scope="row">${esc(c.nome)}${c.detalhe ? `<small>${esc(c.detalhe)}</small>` : ""}</th><td>${brl(c.preco)}</td></tr>\n`).join("") +
  "            </tbody>\n          </table>\n";

function trocarEntre(texto, inicio, fim, novo) {
  const i = texto.indexOf(inicio), j = texto.indexOf(fim);
  if (i < 0 || j < 0) throw new Error(`Marcador não encontrado: ${inicio}`);
  const iFim = texto.indexOf("-->", i) + 3;
  return texto.slice(0, iFim) + "\n" + novo + texto.slice(texto.lastIndexOf("\n", j) + 1);
}
html = trocarEntre(html, "<!--SEO-JSONLD-START", "<!--SEO-JSONLD-END-->", jsonld);
html = trocarEntre(html, "<!--SEO-PRECOS-START", "<!--SEO-PRECOS-END-->", tabela);
gravar("index.html", html);

/* ---------- sitemap, robots, llms ---------- */
gravar("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url("")}</loc>
    <lastmod>${hoje}</lastmod>
${catalogo.filter((c) => c.imagem).map((c) => `    <image:image><image:loc>${url(c.imagem)}</image:loc></image:image>`).join("\n")}
  </url>
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

> A ${LOJA.nome} vende plaquinhas e cartões NFC com QR code para negócios: avaliação no Google, Instagram, WhatsApp, cardápio digital, Wi-Fi e Pix. O cliente aproxima o celular (ou aponta a câmera) e o link abre na hora, sem aplicativo. Preços de ${brl(menor)} a ${brl(maior)}, com envio para todo o Brasil. A ${LOJA.nome} é um produto da ${LOJA.empresa ? LOJA.empresa.nome + " (" + LOJA.empresa.site + ")" : ""}.

## Contato e compra

- Site: ${url("")}
- WhatsApp (pedidos e dúvidas): ${LOJA.whatsappExibicao || telefone} · https://wa.me/${LOJA.whatsapp}
- Instagram: https://instagram.com/${LOJA.instagram}
- Como comprar: monte o carrinho no site e finalize pelo WhatsApp. Frete calculado pelo CEP. Pagamento por Pix ou cartão.

## Produtos e preços

${catalogo.map((c) => `- **${c.nome}**: ${brl(c.preco)}.${c.detalhe ? " " + c.detalhe + "." : ""} ${c.descricao}`).join("\n")}

## Perguntas frequentes

${faq.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}
`);

console.log(`SEO atualizado: ${catalogo.length} produtos, ${faq.length} perguntas, site ${SITE}`);
