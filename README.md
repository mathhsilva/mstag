# MS Tag · site de vendas das plaquinhas NFC

Site estático (HTML + CSS + JS puro, sem build). É só abrir o `index.html` ou publicar a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Hostinger).

## O que tem no site

- **Demonstração interativa no topo**: o celular encosta na plaquinha e a tela abre Google, Instagram, WhatsApp, cardápio, Wi-Fi ou Pix.
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
| Produtos, preços, selos e medidas | `PRODUTOS` |

Textos das seções ficam no `index.html`, e as cores e fontes no topo do `css/styles.css` (variáveis `--cobalt`, `--ink`, etc.).

> Os preços e o número do WhatsApp que vieram de exemplo precisam ser trocados pelos seus antes de publicar.

## Estrutura

```
index.html        páginas e textos
css/styles.css    visual
js/config.js      dados da loja e produtos
js/main.js        demo, carrinho, personalizador
assets/favicon.svg
```
