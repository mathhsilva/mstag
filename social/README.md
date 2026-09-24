# Posts do Instagram · mstag

16 posts prontos para o @mstagbr, 4 por semana (segunda, quarta, sexta e sábado), cobrindo 4 semanas (28/09 a 24/10), todos com o mesmo objetivo: vender as plaquinhas.
Esta pasta **não** vai para a Hostinger (veja "Publicar na Hostinger" no README principal).

- `posts/`: as artes em 1080 × 1350 (formato retrato 4:5 do feed).
- `legendas.md`: a legenda de cada post, pronta para colar.
- `gerador/`: o código que desenha as artes, para mudar texto ou preço.

## Calendário

| # | Data (Brasília) | Formato | Tema | Produto em destaque |
| --- | --- | --- | --- | --- |
| 01 | Seg 28/09 · 11:30 | Foto + preço | "Seu cliente adorou. Agora avaliar é um toque." | Cartão NFC Google + base · R$ 19,90 |
| 02 | Qua 30/09 · 11:30 | Carrossel (5) educativo | Por que o cliente feliz não te avalia | Placa Avaliação Google · R$ 69,90 (exclusivo do site) |
| 03 | Sex 02/10 · 11:30 | Celular + placa | Cardápio plastificado? Aproxime o celular | Display de mesa · R$ 79,90 |
| 04 | Sáb 03/10 · 10:00 | Conversa (humor) | O "faço em casa" nunca chega | Avaliação Google (a partir de R$ 19,90) |
| 05 | Seg 05/10 · 11:30 | Carrossel (5) | Uma plaquinha, um minisite inteiro | Display de mesa multi-link · R$ 79,90 |
| 06 | Qua 07/10 · 11:30 | Tabela comparativa | QR na folha A4 x plaquinha mstag | Linha toda (a partir de R$ 19,90) |
| 07 | Sex 09/10 · 11:30 | Carrossel (4) com fotos | Serve pro seu negócio? | Tabela de preços |
| 08 | Sáb 10/10 · 10:00 | Oferta | Google + Instagram + WhatsApp | Kit Negócio · R$ 159,90 |
| 09 | Seg 12/10 · 11:30 | Celular + placa | Quem entra na loja, sai seguindo | Plaquinha Instagram · R$ 54,90 (exclusivo do site) |
| 10 | Qua 14/10 · 11:30 | Carrossel (6) FAQ | As 5 dúvidas antes de comprar | Todos |
| 11 | Sex 16/10 · 11:30 | Celular + placa | Pedido no WhatsApp sem digitar número | Plaquinha WhatsApp · R$ 54,90 (exclusivo do site) |
| 12 | Sáb 17/10 · 10:00 | Enquete (comenta 1, 2 ou 3) | Qual combina com o seu balcão? | Placa Avaliação Google · R$ 69,90 (exclusivo do site) |
| 13 | Seg 19/10 · 11:30 | Duas fotos | Um cartão, dois visuais | Cartão NFC Google + base · R$ 19,90 |
| 14 | Qua 21/10 · 11:30 | Carrossel (3) passo a passo | Do clique ao balcão em 4 passos | Todos |
| 15 | Sex 23/10 · 11:30 | Carrossel (5) de dicas | 3 jeitos de ganhar mais avaliações | Cartão R$ 19,90 e Placa R$ 69,90 |
| 16 | Sáb 24/10 · 10:00 | Tipográfico | Custa menos que um almoço | Cartão NFC Google + base · R$ 19,90 |

A ordem alterna estilos (foto, carrossel, humor, oferta) e produtos (avaliação, cardápio, minisite, Instagram) para o feed não ficar repetitivo.

## Mudar texto ou preço de uma arte

1. Edite o post na lista `POSTS` em `gerador/gerar.mjs`.
2. Rode `node social/gerador/gerar.mjs 05` (troque `05` pelo número do post, ou deixe sem número para gerar todos). Precisa do Playwright: `npm i -D playwright && npx playwright install chromium`.
3. Atualize a legenda correspondente em `legendas.md`.

O "Café Aurora" das artes é um negócio de exemplo. O QR code das plaquinhas desenhadas leva de verdade para `https://mstag.com.br`.
