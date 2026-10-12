#!/usr/bin/env node
/*
 * Gera as fotos dos produtos da Linha Tech (e do Kit) em assets/produtos/<id>.webp.
 * Essas plaquinhas são desenhadas pelo site, então não têm foto: sem esta imagem o
 * Google acusa "O campo 'image' não foi encontrado" nos dados estruturados (Product).
 * Rode quando mudar o visual ou criar um produto novo, e depois   node tools/seo.mjs
 * Requer o Playwright:   npm i -D playwright && npx playwright install chromium
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(raiz, "js/config.js"), "utf8"), ctx);
const { PRODUTOS } = ctx.window;
const { chromium } = await import("playwright");

const LADO = 800; // imagem final quadrada, 800 × 800 px
const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
// OG_FONTS_CSS=/caminho/fontes.css usa fontes locais quando o Google Fonts não está acessível
if (process.env.OG_FONTS_CSS) {
  await pagina.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ contentType: "text/css", body: fs.readFileSync(process.env.OG_FONTS_CSS, "utf8") }));
}
await pagina.goto(pathToFileURL(path.join(raiz, "index.html")).href, { waitUntil: "load" });
await pagina.evaluate(() => document.fonts.ready);
fs.mkdirSync(path.join(raiz, "assets/produtos"), { recursive: true });

for (const p of PRODUTOS) {
  if (p.indisponivel) continue;
  // Palco quadrado só com a arte do card do catálogo, sem selo de desconto
  await pagina.evaluate(({ id, lado }) => {
    const art = document.querySelector(`[data-add="${id}"]`).closest(".product").querySelector(".product__art");
    const clone = art.cloneNode(true);
    clone.querySelectorAll(".product__badge").forEach((b) => b.remove());
    let palco = document.getElementById("palco-produto");
    if (!palco) {
      palco = document.createElement("div");
      palco.id = "palco-produto";
      palco.style.cssText = `position:fixed;inset:0 auto auto 0;width:${lado}px;height:${lado}px;z-index:99999;display:grid`;
      document.body.appendChild(palco);
    }
    clone.style.width = clone.style.height = "100%";
    clone.style.aspectRatio = "auto";
    clone.style.borderRadius = "0";
    // margem menor que a do card, para a plaquinha ocupar boa parte da foto
    clone.style.padding = id === "multilink" ? "7% 25%" : "9%";
    palco.replaceChildren(clone);
  }, { id: p.id, lado: LADO / 2 });
  await pagina.waitForTimeout(200);
  const png = await (await pagina.$("#palco-produto")).screenshot({ type: "png" });
  // Converte para WebP no próprio navegador (sem dependências extras)
  const webp = await pagina.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    return c.toDataURL("image/webp", 0.9).split(",")[1];
  }, png.toString("base64"));
  const destino = `assets/produtos/${p.id}.webp`;
  fs.writeFileSync(path.join(raiz, destino), Buffer.from(webp, "base64"));
  console.log("ok", destino);
}
await navegador.close();
