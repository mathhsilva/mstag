# Posts do Instagram · mstag

16 posts para o @mstagbr, um por dia de 24/09 a 09/10, todos com o mesmo objetivo: vender as plaquinhas.
Esta pasta **não** vai para a Hostinger (veja "Publicar na Hostinger" no README principal).

- `posts/`: as artes em 1080 × 1350 (formato retrato 4:5 do feed).
- `legendas.md`: a legenda de cada post, pronta para colar.
- `gerador/`: o código que desenha as artes, para mudar texto ou preço.

## Calendário (agendado no Metricool, @mstagbr)

Um post por dia às 10h (Brasília), menos o primeiro, que saiu às 20h30.

| Data | Post | Formato | Produto em destaque |
| --- | --- | --- | --- |
| Qui 24/09 · 20:30 | 01 · Seu cliente adorou | Foto + preço | Cartão NFC Google + base · R$ 19,90 |
| Sex 25/09 | 02 · Por que o cliente feliz não avalia | Carrossel (5) | Placa Avaliação Google · R$ 69,90 (exclusivo do site) |
| Sáb 26/09 | 04 · "Faço quando chegar em casa" | Humor | Avaliação Google (a partir de R$ 19,90) |
| Dom 27/09 | 03 · Cardápio plastificado? | Celular + placa | Display de mesa · R$ 79,90 |
| Seg 28/09 | 05 · Uma plaquinha, um minisite | Carrossel (5) | Display multi-link · R$ 79,90 |
| Ter 29/09 | 09 · Quem entra, sai seguindo | Celular + placa | Plaquinha Instagram · R$ 54,90 (exclusivo do site) |
| Qua 30/09 | 06 · QR na folha A4 x mstag | Comparativo | Linha toda |
| Qui 01/10 | 07 · Serve pro seu negócio? | Carrossel (4) | Tabela de preços |
| Sex 02/10 | 08 · Kit Negócio | Oferta | Kit · R$ 159,90 |
| Sáb 03/10 | 12 · Qual combina com o seu balcão? | Enquete | Placa Avaliação Google · R$ 69,90 (exclusivo do site) |
| Dom 04/10 | 13 · Um cartão, dois visuais | Duas fotos | Cartão · R$ 19,90 |
| Seg 05/10 | 11 · Pedido no WhatsApp | Celular + placa | Plaquinha WhatsApp · R$ 54,90 (exclusivo do site) |
| Ter 06/10 | 10 · Perguntas frequentes | Carrossel (6) | Todos |
| Qua 07/10 | 15 · 3 jeitos de ganhar avaliações | Carrossel (5) | Cartão e Placa |
| Qui 08/10 | 14 · Do clique ao balcão em 4 passos | Carrossel (3) | Todos |
| Sex 09/10 | 16 · Custa menos que um almoço | Tipográfico | Cartão · R$ 19,90 |

As datas e horários de `legendas.md` são do planejamento original (4 por semana). Vale o que está nesta tabela.

A ordem alterna estilos (foto, carrossel, humor, oferta) e produtos (avaliação, cardápio, minisite, Instagram) para o feed não ficar repetitivo.

## Mudar texto ou preço de uma arte

1. Edite o post na lista `POSTS` em `gerador/gerar.mjs`.
2. Rode `node social/gerador/gerar.mjs 05` (troque `05` pelo número do post, ou deixe sem número para gerar todos). Precisa do Playwright: `npm i -D playwright && npx playwright install chromium`.
3. Atualize a legenda correspondente em `legendas.md`.

O "Café Aurora" das artes é um negócio de exemplo. O QR code das plaquinhas desenhadas leva de verdade para `https://mstag.com.br`.
