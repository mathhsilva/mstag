# mstag · site de vendas das plaquinhas NFC

Site estático (HTML + CSS + JS puro, sem build). É só abrir o `index.html` ou publicar a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Hostinger).

## O que tem no site

- **Demonstração interativa no topo**: o celular encosta na plaquinha e a tela abre Google, Instagram, WhatsApp, cardápio, Wi-Fi ou Pix.
- **Duas linhas de produto**: a **Clássica** (fotos reais das placas da mstag, com escolha de tamanho 10 × 10 / 10 × 15 e cor) e a **Tech** (plaquinhas desenhadas pelo próprio site).
- **Catálogo** com preço, parcelamento e botão de adicionar ao carrinho.
- **Personalizador** com prévia ao vivo (modelo, acabamento, nome do negócio e link).
- **Carrinho** salvo no navegador, que fecha o pedido pelo **WhatsApp** com a mensagem já montada (itens, detalhes, subtotal e nome do cliente).
- Seções de como funciona, comparação, para quem é, garantias, perguntas frequentes e CTA final.
- Responsivo, acessível pelo teclado e respeita "reduzir movimento".

## Onde editar

Tudo que muda com frequência está em **`js/config.js`**:

| O quê | Campo |
| --- | --- |
| Número do WhatsApp (DDI + DDD, só dígitos; hoje (41) 98469-9726) | `LOJA.whatsapp` e `LOJA.whatsappExibicao` |
| Empresa por trás da marca (Hinnovation) | `LOJA.empresa` |
| Instagram (hoje @mstagbr), e-mail, prazo, frete | `LOJA.*` |
| Linha Clássica: tamanhos, preços, cores e fotos | `CLASSICA` |
| Cartão NFC Google (dupla face): preço, textos e fotos | `CARTAO_GOOGLE` |
| Linha Tech: produtos, preços, selos e medidas | `PRODUTOS` |

### Adicionar uma cor ou tamanho na Linha Clássica

1. Salve a arte em `assets/placas/` (de preferência `.webp`, 800 px de largura).
2. Registre a imagem em `CLASSICA.imagens[tamanho][cor]` e, se a cor for nova, inclua em `CLASSICA.cores` (as duas cores da bolinha ficam em `amostra`).

As artes usam os marcadores "logo oficial Google" e "QR dinâmico". O site coloca o logo e um QR ilustrativo por cima deles (posições em `.pc__logo` e `.pc__qr` no CSS). Se o layout da arte mudar, ajuste essas porcentagens.

Textos das seções ficam no `index.html`, e as cores e fontes no topo do `css/styles.css` (variáveis `--cobalt`, `--ink`, etc.).

> Confira os preços antes de publicar: alguns ainda são valores de exemplo.

## SEO e busca por IA

O site já sai preparado para aparecer em buscas como "plaquinha NFC", "plaquinha de avaliação Google" e "placa NFC Instagram", e para ser citado por assistentes de IA (ChatGPT, Gemini, Perplexity, Claude).

- Título, descrição, canonical e imagem de compartilhamento (`assets/og-image.jpg`) no `<head>`.
- Dados estruturados (JSON-LD) com a empresa, os produtos com preço e as perguntas frequentes.
- Bloco "Guia rápido" com explicação e tabela de preços em texto, que buscadores e IAs leem sem precisar rodar JavaScript.
- `robots.txt` (libera buscadores e robôs de IA), `sitemap.xml` e `llms.txt` (resumo da loja para IAs).

**Sempre que mudar preços, produtos ou perguntas**, rode:

```bash
node tools/seo.mjs
```

Ele regenera os dados estruturados, a tabela de preços, o `sitemap.xml`, o `robots.txt` e o `llms.txt` a partir do `js/config.js` e do FAQ do `index.html`.

**Domínio:** o SEO usa `https://mstag.com.br`. Se o endereço for outro, troque em `LOJA.site` (`js/config.js`) e nas tags `canonical`, `og:url`, `og:image`, `twitter:image` e `llms.txt` do `<head>` do `index.html`, e rode o gerador.

## Estrutura

```
index.html        páginas e textos
css/styles.css    visual
js/config.js      dados da loja e produtos
js/main.js        demo, carrinho, personalizador
assets/logo/       logos (preto, preto+azul, azul, branco+azul, branco) e favicon
tools/seo.mjs     gerador de SEO (node tools/seo.mjs)
robots.txt  sitemap.xml  llms.txt
assets/placas/    fotos da Linha Clássica
assets/cartao/    fotos do Cartão NFC Google
```
