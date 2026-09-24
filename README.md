# MS Tag · site de vendas das plaquinhas NFC

Site estático (HTML + CSS + JS puro, sem build). É só abrir o `index.html` ou publicar a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Hostinger).

## O que tem no site

- **Demonstração interativa no topo**: o celular encosta na plaquinha e a tela abre Google, Instagram, WhatsApp, cardápio, Wi-Fi ou Pix.
- **Duas linhas de produto**: a **Clássica** (fotos reais das placas da MS Tag, com escolha de tamanho 10 × 10 / 10 × 15 e cor) e a **Tech** (plaquinhas desenhadas pelo próprio site).
- **Catálogo** com preço, parcelamento e botão de adicionar ao carrinho.
- **Personalizador** com prévia ao vivo (modelo, acabamento, nome do negócio e link).
- **Carrinho** salvo no navegador, que fecha o pedido pelo **WhatsApp** com a mensagem já montada (itens, detalhes, subtotal e nome do cliente).
- Seções de como funciona, comparação, para quem é, garantias, perguntas frequentes e CTA final.
- Responsivo, acessível pelo teclado e respeita "reduzir movimento".

## Onde editar

Tudo que muda com frequência está em **`js/config.js`**:

| O quê | Campo |
| --- | --- |
| Número do WhatsApp (DDI + DDD, só dígitos) | `LOJA.whatsapp` |
| Instagram, e-mail, prazo, frete | `LOJA.*` |
| Linha Clássica: tamanhos, preços, cores e fotos | `CLASSICA` |
| Linha Tech: produtos, preços, selos e medidas | `PRODUTOS` |

### Adicionar uma cor ou tamanho na Linha Clássica

1. Salve a arte em `assets/placas/` (de preferência `.webp`, 800 px de largura).
2. Registre a imagem em `CLASSICA.imagens[tamanho][cor]` e, se a cor for nova, inclua em `CLASSICA.cores` (as duas cores da bolinha ficam em `amostra`).

As artes usam os marcadores "logo oficial Google" e "QR dinâmico". O site coloca o logo e um QR ilustrativo por cima deles (posições em `.pc__logo` e `.pc__qr` no CSS). Se o layout da arte mudar, ajuste essas porcentagens.

Textos das seções ficam no `index.html`, e as cores e fontes no topo do `css/styles.css` (variáveis `--cobalt`, `--ink`, etc.).

> Os preços e o número do WhatsApp que vieram de exemplo precisam ser trocados pelos seus antes de publicar.

## Estrutura

```
index.html        páginas e textos
css/styles.css    visual
js/config.js      dados da loja e produtos
js/main.js        demo, carrinho, personalizador
assets/favicon.svg
assets/placas/    fotos da Linha Clássica
```
