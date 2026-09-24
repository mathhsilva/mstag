#!/usr/bin/env node
/*
 * Gera as imagens de compartilhamento (1200 × 630) de cada página de busca em assets/og/.
 * Opcional: só precisa rodar quando mudar o título (h1) de uma página.
 * Ordem: rode   node tools/seo.mjs   (gera as páginas), depois   node tools/og.mjs   e de novo   node tools/seo.mjs
 * Requer o Playwright:   npm i -D playwright && npx playwright install chromium
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PAGINAS } from "./paginas.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arquivo = (p) => pathToFileURL(path.join(raiz, p)).href;
const { chromium } = await import("playwright");


const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
// OG_FONTS_CSS=/caminho/fontes.css usa fontes locais quando o Google Fonts não está acessível
if (process.env.OG_FONTS_CSS) {
  await pagina.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ contentType: "text/css", body: fs.readFileSync(process.env.OG_FONTS_CSS, "utf8") }));
}
fs.mkdirSync(path.join(raiz, "assets/og"), { recursive: true });

for (const p of PAGINAS) {
  // 1) fotografa a arte do topo da própria página (já gerada por tools/seo.mjs)
  const arte = path.join(os.tmpdir(), `mstag-og-arte-${p.slug}.png`);
  await pagina.setViewportSize({ width: 1100, height: 900 });
  await pagina.goto(arquivo(`${p.slug}/index.html`), { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(300);
  await (await pagina.$(".lp-visual")).screenshot({ path: arte });
  await pagina.setViewportSize({ width: 1200, height: 630 });
  const titulo = p.h1.replace(/<em>/g, '<em>').replace(/<\/em>/g, "</em>");
  const temp = path.join(os.tmpdir(), `mstag-og-${p.slug}.html`);
  fs.writeFileSync(temp, `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Unbounded:wght@600&display=swap">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#0B1220;font-family:Manrope,sans-serif;color:#fff;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 80% 55%,rgba(48,71,255,.55),transparent 55%),radial-gradient(circle at 1px 1px,rgba(255,255,255,.07) 1px,transparent 0) 0 0/22px 22px}
.copy{position:absolute;left:72px;top:64px;bottom:64px;width:640px;display:flex;flex-direction:column;gap:26px}
.logo{height:42px;width:auto;align-self:flex-start}
.k{font-size:20px;font-weight:700;color:#8C9BFF;letter-spacing:.06em;text-transform:uppercase}
h1{font-family:Unbounded,sans-serif;font-weight:600;font-size:50px;line-height:1.08;letter-spacing:-.03em}
h1 em{font-style:normal;color:#6B7CFF}
.url{margin-top:auto;font-size:22px;font-weight:700;color:#B8C1D9}
.photo{position:absolute;right:56px;top:50%;width:420px;margin-top:-193px;border-radius:26px;box-shadow:0 30px 60px -10px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08)}
</style></head><body><div class="bg"></div>
<div class="copy">
<img class="logo" src="${arquivo("assets/logo/mstag-branco-azul.png")}">
<span class="k">${p.kicker}</span>
<h1>${titulo}</h1>
<span class="url">mstag.com.br/${p.slug}</span>
</div>
<img class="photo" src="${pathToFileURL(arte).href}">
</body></html>`);
  await pagina.goto(pathToFileURL(temp).href, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: path.join(raiz, `assets/og/${p.slug}.jpg`), type: "jpeg", quality: 86 });
  fs.rmSync(temp);
  fs.rmSync(arte);
  console.log(`assets/og/${p.slug}.jpg`);
}
await navegador.close();
