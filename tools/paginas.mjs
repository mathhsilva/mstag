/*
 * Páginas de busca (landing pages). Cada uma mira um termo que as pessoas pesquisam
 * e é gerada em /<slug>/index.html por tools/seo.mjs, reaproveitando o topo, o rodapé
 * e o carrinho da página principal.
 *
 * Para criar uma página nova: copie um bloco, troque o slug e o conteúdo e rode
 *   node tools/seo.mjs
 *
 * Campos:
 *   mostrar   produtos exibidos: "classica", "cartao-google" ou o id de um produto da Linha Tech
 *   visual    arte do topo: "classica" (placa + foto), "fotos", "duo" ou "placa"
 *   secoes    blocos de conteúdo em HTML simples (h2 é gerado a partir de "titulo")
 *   {PRECO_MIN} vira "R$ xx,xx", o menor preço entre os produtos da página
 */
export const PAGINAS = [
  {
    slug: "plaquinha-avaliacao-google",
    menu: "Plaquinha de avaliação Google",
    titulo: "Plaquinha de Avaliação Google com NFC e QR Code | mstag",
    descricao: "Plaquinha de avaliação Google com NFC e QR code: o cliente aproxima o celular e abre direto a tela de estrelas do seu perfil. A partir de {PRECO_MIN}.",
    resumo: "Como funciona, onde colocar e o que o Google permite na hora de pedir avaliações.",
    kicker: "Placa de avaliação Google · NFC + QR code",
    h1: "Plaquinha de avaliação Google que o cliente usa em <em>um toque</em>",
    lead: "Coloque no balcão e peça a avaliação no melhor momento, logo depois de um bom atendimento. O cliente aproxima o celular ou aponta a câmera e cai direto na tela de estrelas do seu perfil no Google, sem precisar procurar a sua empresa.",
    destaques: ["Abre direto nas estrelas do seu perfil", "NFC e QR code na mesma placa", "Chega gravada e testada"],
    visual: { tipo: "classica", foto: "assets/cartao/cartao-google-preto-suporte.webp" },
    mostrar: ["classica", "cartao-google", "google", "kit"],
    passos: [
      ["Você manda o link do perfil", "Pelo WhatsApp, envie o link do seu Perfil da Empresa no Google. Se não souber onde encontrar, mande o nome e o endereço do negócio que a gente acha."],
      ["Gravamos NFC e QR code", "O link de avaliação vai para o chip NFC e para o QR code impresso. Testamos a leitura antes de enviar."],
      ["O cliente aproxima e avalia", "A tela de avaliação abre com as estrelas prontas. O cliente escolhe a nota, escreve se quiser e publica com a conta Google dele."],
    ],
    secoes: [
      {
        eyebrow: "Por que funciona",
        titulo: "Por que uma placa de avaliação Google traz mais avaliações",
        html: `<p>A maioria dos clientes satisfeitos não avalia porque dá trabalho: abrir o Google, procurar a empresa, achar o perfil certo e encontrar o botão de avaliar. A plaquinha corta esse caminho. Com um toque, a tela de avaliação já está aberta.</p>
<p>O momento também conta. Pedir a avaliação no balcão, enquanto a experiência ainda está fresca, funciona melhor do que mandar um link dias depois.</p>
<p>E avaliações fazem diferença para ser encontrado. Segundo a própria Google, a quantidade de avaliações e a nota do seu perfil fazem parte do que define a posição da empresa nas buscas locais e no Google Maps.</p>`,
      },
      {
        eyebrow: "Onde colocar",
        titulo: "Onde colocar a plaquinha de avaliação",
        html: `<ul class="lp-grid-list">
<li><b>Balcão e caixa</b><span>O lugar clássico: o cliente acabou de pagar e está com o celular na mão.</span></li>
<li><b>Mesa</b><span>Em restaurantes e cafés, a avaliação acontece enquanto a conta chega.</span></li>
<li><b>Recepção</b><span>Clínicas, salões e hotéis: na saída, depois do atendimento.</span></li>
<li><b>Na mão do atendente</b><span>O cartão NFC vai até a mesa ou até o carro, e o cliente não precisa se levantar.</span></li>
<li><b>Junto da entrega</b><span>Lojas online e delivery podem enviar o cartão dentro da embalagem.</span></li>
<li><b>Provador e vitrine</b><span>No varejo, perto de onde o cliente decide a compra.</span></li>
</ul>`,
      },
      {
        eyebrow: "Boas práticas",
        titulo: "Como pedir avaliações sem problemas com o Google",
        html: `<p>O Google tem regras para avaliações. Seguir essas regras protege o seu perfil de avaliações removidas.</p>
<div class="lp-callout">
<b>O que o Google não permite</b>
<ul>
<li>Oferecer desconto, brinde ou qualquer vantagem em troca de avaliação.</li>
<li>Pedir avaliação só para quem gostou, ou desencorajar quem teve uma experiência ruim.</li>
<li>Escrever avaliações pelo cliente ou usar o mesmo aparelho para várias avaliações.</li>
</ul>
</div>
<p>O caminho seguro é pedir para todos os clientes, do mesmo jeito, e responder às avaliações, boas e ruins. A plaquinha ajuda justamente nisso: fica à vista de todo mundo, sem filtro.</p>`,
      },
      {
        eyebrow: "Passo a passo",
        titulo: "Como encontrar o link de avaliação do seu perfil",
        html: `<ol class="lp-ol">
<li>Entre na conta Google que administra a empresa e pesquise o nome do seu negócio no Google.</li>
<li>No painel do seu Perfil da Empresa, toque em <b>Pedir avaliações</b> (ou <b>Receber mais avaliações</b>).</li>
<li>Copie o link que aparece e mande para a gente pelo WhatsApp.</li>
</ol>
<p>Ainda não tem Perfil da Empresa no Google (o antigo Google Meu Negócio)? O cadastro é gratuito em <a href="https://www.google.com/business/" target="_blank" rel="noopener">google.com/business</a>. Sem ele, não há onde receber avaliações.</p>`,
      },
    ],
    faq: [
      ["A plaquinha de avaliação Google funciona em qualquer celular?", "Funciona em celulares com NFC, que são a maioria dos Android e todos os iPhones do XS em diante. Para os outros, a placa tem QR code: basta apontar a câmera."],
      ["Preciso ter um perfil no Google?", "Sim. A plaquinha leva para a tela de avaliação do seu Perfil da Empresa no Google (o antigo Google Meu Negócio). O cadastro é gratuito."],
      ["O cliente precisa ter conta Google para avaliar?", "Sim, o Google só publica avaliações feitas por uma conta Google. Quase todo celular Android já tem uma, e no iPhone o cliente entra com o Gmail."],
      ["A avaliação aparece na hora?", "Normalmente sim. Às vezes o Google leva algum tempo para publicar ou faz uma verificação automática antes de exibir."],
      ["Posso usar a mesma plaquinha em outra unidade?", "Pode. Na Linha Clássica o QR code é dinâmico e o destino pode ser trocado. Nas demais, a gente regrava o chip com o link da outra unidade."],
      ["Qual a diferença entre a placa e o cartão NFC?", "A placa de acrílico fica fixa no balcão ou na parede. O cartão NFC é menor, tem duas faces, vem com base de madeira e também pode ir na mão do atendente até a mesa."],
    ],
    relacionados: ["cartao-nfc-avaliacao-google", "plaquinha-nfc", "cardapio-digital-nfc"],
  },

  {
    slug: "plaquinha-nfc",
    menu: "O que é plaquinha NFC",
    titulo: "Plaquinha NFC: o que é, como funciona e onde comprar | mstag",
    descricao: "Plaquinha NFC para empresas: abre avaliação no Google, Instagram, WhatsApp, cardápio ou Pix com um toque do celular, sem aplicativo. A partir de {PRECO_MIN}.",
    resumo: "O que é NFC, o que dá para fazer com uma placa NFC e como ela se compara ao QR code.",
    kicker: "Plaquinha NFC · placa NFC · tag NFC",
    h1: "Plaquinha NFC: <em>um toque</em> e o link abre no celular",
    lead: "Uma plaquinha NFC guarda um link num chip. Quando o cliente aproxima o celular, o link abre sozinho no navegador. Serve para pedir avaliação no Google, ganhar seguidores no Instagram, abrir o WhatsApp, mostrar o cardápio, liberar o Wi-Fi ou receber Pix.",
    destaques: ["Sem aplicativo e sem bateria", "Funciona em iPhone e Android", "QR code de reserva em toda placa"],
    visual: { tipo: "duo", placa: { modelo: "instagram", cor: "light" } },
    mostrar: ["classica", "cartao-google", "instagram", "whatsapp", "multilink", "kit"],
    passos: [
      ["Escolha o que a placa abre", "Avaliação no Google, perfil do Instagram, conversa no WhatsApp, cardápio ou uma página com vários links."],
      ["A gente grava o chip", "O seu link vai para o chip NFC e para o QR code. A placa chega pronta para usar."],
      ["O cliente aproxima o celular", "A 1 a 4 cm de distância, o link abre sozinho. Quem não tem NFC usa a câmera no QR code."],
    ],
    secoes: [
      {
        eyebrow: "A tecnologia",
        titulo: "O que é NFC",
        html: `<p>NFC (Near Field Communication, ou comunicação por campo próximo) é a mesma tecnologia do pagamento por aproximação. Funciona em 13,56 MHz e só a poucos centímetros de distância.</p>
<p>Dentro da plaquinha há um chip NFC passivo, sem bateria. Ele fica "desligado" até um celular chegar perto: a antena do celular alimenta o chip, que entrega o link gravado. Por isso a placa não precisa de energia, não esquenta e dura anos.</p>
<p>O chip só guarda um link. Ele não lê nada do celular do cliente, não coleta dados e não instala nada.</p>`,
      },
      {
        eyebrow: "Usos",
        titulo: "O que dá para fazer com uma placa NFC",
        html: `<ul class="lp-grid-list">
<li><b>Avaliação no Google</b><span>Abre a tela de estrelas do seu perfil. <a href="../plaquinha-avaliacao-google/">Ver plaquinha de avaliação</a></span></li>
<li><b>Instagram</b><span>Abre o seu perfil pronto para seguir. <a href="../plaquinha-nfc-instagram/">Ver plaquinha Instagram</a></span></li>
<li><b>WhatsApp</b><span>Abre a conversa com uma mensagem já escrita.</span></li>
<li><b>Cardápio digital</b><span>Mostra o cardápio na mesa, sem papel. <a href="../cardapio-digital-nfc/">Ver cardápio NFC</a></span></li>
<li><b>Wi-Fi e Pix</b><span>Rede, senha e chave Pix sem precisar soletrar.</span></li>
<li><b>Cartão de avaliação</b><span>Dupla face, com base de madeira, vai até a mesa do cliente. <a href="../cartao-nfc-avaliacao-google/">Ver cartão NFC</a></span></li>
</ul>`,
      },
      {
        eyebrow: "Comparativo",
        titulo: "Plaquinha NFC ou QR code: qual a diferença?",
        html: `<div class="lp-table-wrap"><table class="lp-table">
<thead><tr><th scope="col"></th><th scope="col">NFC</th><th scope="col">QR code</th></tr></thead>
<tbody>
<tr><th scope="row">Como abre</th><td>Aproximando o celular</td><td>Apontando a câmera</td></tr>
<tr><th scope="row">Distância</th><td>1 a 4 cm</td><td>Até onde a câmera focar</td></tr>
<tr><th scope="row">Celulares</th><td>A maioria dos Android e iPhone XS em diante</td><td>Qualquer celular com câmera</td></tr>
<tr><th scope="row">Velocidade</th><td>Um toque</td><td>Abrir a câmera, enquadrar e tocar no link</td></tr>
</tbody></table></div>
<p>Não é preciso escolher. Toda plaquinha da mstag tem os dois: o NFC para quem quer rapidez e o QR code para quem prefere a câmera ou tem um celular sem NFC.</p>`,
      },
      {
        eyebrow: "Compatibilidade",
        titulo: "Plaquinha NFC funciona em iPhone?",
        html: `<p>Sim. Do iPhone XS em diante, a leitura é automática: basta a tela estar desbloqueada e aproximar a parte de cima do aparelho, perto da câmera. Do iPhone 7 ao iPhone X, o leitor de NFC fica na Central de Controle.</p>
<p>No Android, o NFC vem na maioria dos modelos intermediários e topo de linha. A antena costuma ficar no meio das costas do aparelho, e a leitura funciona mesmo com capinha.</p>`,
      },
    ],
    faq: [
      ["Quanto custa uma plaquinha NFC?", "Na mstag, os modelos vão de {PRECO_MIN} (cartão NFC com base de madeira) até os kits com três plaquinhas. Todos chegam com o seu link gravado e QR code."],
      ["Plaquinha NFC precisa de bateria ou internet?", "Não. O chip é passivo e é alimentado pelo próprio celular no momento da leitura. Quem precisa de internet é o celular do cliente, para abrir o link."],
      ["A plaquinha NFC é segura?", "Sim. O chip só guarda um link e não tem acesso a nada do celular. É o mesmo tipo de leitura do pagamento por aproximação, só que sem dinheiro envolvido."],
      ["Qual a diferença entre plaquinha NFC e tag NFC?", "A tag NFC é o chip, geralmente um adesivo. A plaquinha é o chip já embutido numa placa de acrílico ou num cartão, com arte, QR code e o seu link gravado."],
      ["Posso trocar o link da plaquinha NFC depois?", "Pode. No display multi-link e na Linha Clássica (com QR code dinâmico), o destino é trocado sem trocar a placa. Nas demais, a gente regrava o chip."],
    ],
    relacionados: ["plaquinha-avaliacao-google", "plaquinha-nfc-instagram", "cardapio-digital-nfc"],
  },

  {
    slug: "plaquinha-nfc-instagram",
    menu: "Plaquinha NFC Instagram",
    titulo: "Plaquinha NFC Instagram: ganhe seguidores no balcão | mstag",
    descricao: "Plaquinha NFC para Instagram com QR code: o cliente aproxima o celular e abre o seu perfil pronto para seguir. Para balcão e provador. A partir de {PRECO_MIN}.",
    resumo: "Como transformar quem entra na loja em seguidor, com NFC e QR code.",
    kicker: "Placa NFC para Instagram · NFC + QR code",
    h1: "Plaquinha NFC para Instagram: quem passa pelo balcão <em>vira seguidor</em>",
    lead: "Quem compra na sua loja é o seguidor mais valioso que existe. A plaquinha NFC Instagram abre o seu perfil com um toque, pronto para o cliente tocar em Seguir, sem digitar o @ nem procurar o seu nome.",
    destaques: ["Abre o perfil direto no Instagram", "NFC e QR code na mesma placa", "Chega gravada e testada"],
    visual: { tipo: "placa", modelo: "instagram", cor: "light" },
    mostrar: ["instagram", "kit", "multilink"],
    passos: [
      ["Mande o seu @", "Pelo WhatsApp, envie o @ do Instagram da empresa."],
      ["Gravamos o link do perfil", "O link vai para o chip NFC e para o QR code. Testamos a leitura antes de enviar."],
      ["O cliente aproxima e segue", "O perfil abre no aplicativo do Instagram (ou no navegador, se o cliente não tiver o app) e ele toca em Seguir."],
    ],
    secoes: [
      {
        eyebrow: "Por que funciona",
        titulo: "Por que uma plaquinha de Instagram funciona melhor que só falar o @",
        html: `<p>Falar o @ no caixa depende de o cliente lembrar, digitar certo e achar o perfil entre outros parecidos. Muita gente desiste no meio. Com a plaquinha, são dois toques: aproximar o celular e tocar em Seguir.</p>
<p>Seguidores que já compraram com você voltam a ver seus produtos, promoções e novidades no feed e nos stories. É a forma mais barata de trazer o cliente de volta.</p>`,
      },
      {
        eyebrow: "Onde colocar",
        titulo: "Onde colocar a plaquinha NFC do Instagram",
        html: `<ul class="lp-grid-list">
<li><b>Caixa</b><span>Enquanto o cliente espera o pagamento ou a sacola.</span></li>
<li><b>Provador</b><span>Um momento de pausa, com o celular na mão.</span></li>
<li><b>Mesa</b><span>Em cafés e restaurantes, antes de o prato chegar.</span></li>
<li><b>Espelho do salão</b><span>O cliente acabou de ver o resultado e quer mostrar.</span></li>
<li><b>Vitrine</b><span>Por dentro do vidro, para quem passa na calçada.</span></li>
<li><b>Recepção</b><span>Clínicas e estúdios, enquanto o cliente aguarda.</span></li>
</ul>`,
      },
      {
        eyebrow: "Dica",
        titulo: "Combine Instagram e avaliação no Google",
        html: `<p>O cliente que segue no Instagram é o mesmo que pode avaliar a sua empresa no Google. O <b>Kit Negócio</b> traz Google, Instagram e WhatsApp com o mesmo visual, e o <b>display multi-link</b> reúne tudo numa placa só. Veja também a <a href="../plaquinha-avaliacao-google/">plaquinha de avaliação Google</a>.</p>`,
      },
    ],
    faq: [
      ["A plaquinha abre o aplicativo do Instagram?", "Sim, na maioria dos celulares o link abre direto no aplicativo do Instagram. Se o cliente não tiver o app, o perfil abre no navegador."],
      ["Funciona com perfil comercial e pessoal?", "Funciona com qualquer perfil público. Perfis privados abrem, mas o cliente precisa pedir para seguir."],
      ["Posso trocar o @ depois?", "Pode. Se o seu @ mudar, a gente regrava o chip. No display multi-link você mesmo troca os links quando quiser."],
      ["Qual a diferença para o QR code do próprio Instagram?", "O QR code do Instagram só funciona pela câmera. A plaquinha tem NFC, que abre com um toque, e também tem QR code. E ainda fica bonita no balcão."],
    ],
    relacionados: ["plaquinha-avaliacao-google", "plaquinha-nfc", "cardapio-digital-nfc"],
  },

  {
    slug: "cartao-nfc-avaliacao-google",
    menu: "Cartão NFC avaliação Google",
    titulo: "Cartão NFC Avaliação Google com Base de Madeira | mstag",
    descricao: "Cartão NFC de avaliação Google dupla face (preta e branca) com base de madeira inclusa. O cliente aproxima o celular e avalia na hora. Por {PRECO_MIN}.",
    resumo: "O cartão dupla face que fica em pé no balcão ou vai na mão do atendente.",
    kicker: "Cartão NFC Google · dupla face · base inclusa",
    h1: "Cartão NFC de avaliação Google com <em>base de madeira</em>",
    lead: "Um cartão com duas faces, preta de um lado e branca do outro, que já vem com base de madeira. Deixe em pé no balcão ou entregue na mão do cliente: um toque do celular e a tela de avaliação do seu perfil no Google já está aberta.",
    destaques: ["Base de madeira inclusa", "Face preta e face branca", "Leve até a mesa do cliente"],
    visual: { tipo: "fotos", fotos: ["assets/cartao/cartao-google-preto-suporte.webp", "assets/cartao/cartao-google-branco-suporte.webp"] },
    mostrar: ["cartao-google", "classica"],
    passos: [
      ["Mande o link do seu perfil", "Pelo WhatsApp. Se não souber onde encontrar, a gente ajuda."],
      ["Gravamos o chip NFC", "O link de avaliação do seu perfil no Google vai para o cartão, e testamos a leitura."],
      ["Encaixe na base e pronto", "O cartão chega com a base de madeira. É só colocar no balcão."],
    ],
    secoes: [
      {
        eyebrow: "Dupla face",
        titulo: "Um cartão, duas cores",
        html: `<p>De um lado o cartão é preto, do outro é branco. Vire para a face que combina com o seu balcão, com a parede ou com a identidade da loja. Se mudar a decoração, é só virar o cartão.</p>
<p>A base de madeira mantém o cartão em pé e bem à vista. Ela já vem junto, sem custo extra.</p>`,
      },
      {
        eyebrow: "Comparativo",
        titulo: "Cartão NFC ou placa de acrílico?",
        html: `<div class="lp-table-wrap"><table class="lp-table">
<thead><tr><th scope="col"></th><th scope="col">Cartão NFC</th><th scope="col">Placa Clássica</th></tr></thead>
<tbody>
<tr><th scope="row">Formato</th><td>Cartão, em pé na base de madeira</td><td>Placa de acrílico 10 × 10 ou 10 × 15 cm</td></tr>
<tr><th scope="row">Cores</th><td>Dupla face: preta e branca</td><td>Preto e azul, azul, preto e cinza</td></tr>
<tr><th scope="row">Leitura</th><td>NFC</td><td>NFC e QR code dinâmico</td></tr>
<tr><th scope="row">Melhor para</th><td>Balcão, mesa e atendimento na mão</td><td>Balcão, parede e recepção</td></tr>
</tbody></table></div>
<p>Muita gente usa os dois: a placa fixa no caixa e o cartão circulando com a equipe. Veja a <a href="../plaquinha-avaliacao-google/">plaquinha de avaliação Google</a>.</p>`,
      },
      {
        eyebrow: "Ideias de uso",
        titulo: "Onde o cartão NFC funciona melhor",
        html: `<ul class="lp-grid-list">
<li><b>Garçom na mesa</b><span>Leve o cartão junto com a conta.</span></li>
<li><b>Salão e barbearia</b><span>Apresente o cartão no espelho, no fim do atendimento.</span></li>
<li><b>Entregas e serviços</b><span>O técnico ou entregador mostra o cartão ao terminar.</span></li>
<li><b>Balcão pequeno</b><span>Ocupa pouco espaço e fica em pé na base.</span></li>
</ul>`,
      },
    ],
    faq: [
      ["A base de madeira vem junto?", "Sim. O cartão NFC de avaliação Google vem com a base de madeira, sem custo extra."],
      ["As duas faces funcionam?", "O chip NFC fica dentro do cartão e é lido pelos dois lados. Aproxime o celular de qualquer face."],
      ["Serve para qualquer empresa?", "Serve para qualquer negócio com Perfil da Empresa no Google (o antigo Google Meu Negócio). O cadastro no Google é gratuito."],
      ["Posso comprar vários para a equipe?", "Pode. Adicione a quantidade no carrinho e finalize pelo WhatsApp. Todos saem com o mesmo link gravado."],
    ],
    relacionados: ["plaquinha-avaliacao-google", "plaquinha-nfc", "plaquinha-nfc-instagram"],
  },

  {
    slug: "cardapio-digital-nfc",
    menu: "Cardápio digital NFC para mesa",
    titulo: "Cardápio Digital NFC e QR Code para Mesa de Restaurante | mstag",
    descricao: "Display de mesa com NFC e QR code: cardápio digital, Wi-Fi, Pix, Instagram e avaliação no Google numa placa só, para restaurantes e cafés. A partir de {PRECO_MIN}.",
    resumo: "Cardápio, Wi-Fi, Pix e avaliação na mesa, numa placa só.",
    kicker: "Cardápio digital · display de mesa NFC",
    h1: "Cardápio digital com NFC e QR code <em>direto na mesa</em>",
    lead: "Um display de mesa que abre o seu cardápio digital com um toque do celular. Na mesma placa, o cliente encontra o Wi-Fi, a chave Pix, o Instagram e a avaliação no Google, sem chamar o garçom para perguntar.",
    destaques: ["Cardápio, Wi-Fi, Pix e redes numa placa", "Troque os links quando quiser", "NFC e QR code"],
    visual: { tipo: "placa", modelo: "multilink", cor: "clear" },
    mostrar: ["multilink", "kit", "classica"],
    passos: [
      ["Mande os seus links", "Cardápio (PDF, site ou plataforma de pedidos), Wi-Fi, chave Pix e redes sociais."],
      ["Montamos a sua página", "Os links ficam reunidos numa página só, ligada ao NFC e ao QR code do display."],
      ["O cliente aproxima na mesa", "Tudo abre no celular dele. Mudou o preço ou o prato? Você troca o link sem trocar a placa."],
    ],
    secoes: [
      {
        eyebrow: "Vantagens",
        titulo: "Por que usar cardápio digital na mesa",
        html: `<ul class="lp-grid-list">
<li><b>Preço atualizado sem reimprimir</b><span>Mudou um valor? Atualize o cardápio digital e a mesa já mostra o novo.</span></li>
<li><b>Menos espera</b><span>O cliente olha o cardápio enquanto o garçom atende outra mesa.</span></li>
<li><b>Wi-Fi sem soletrar senha</b><span>Rede e senha aparecem no celular do cliente.</span></li>
<li><b>Pix na mesa</b><span>A chave Pix fica à mão na hora de pagar.</span></li>
<li><b>Mais avaliações</b><span>O botão de avaliar no Google fica na mesma placa.</span></li>
<li><b>Mais seguidores</b><span>O Instagram do restaurante a um toque.</span></li>
</ul>`,
      },
      {
        eyebrow: "Importante",
        titulo: "O display substitui o meu sistema de pedidos?",
        html: `<p>Não. O display abre os links que você já tem: o cardápio em PDF, o seu site ou a página da plataforma de pedidos que você usa. Ele é a porta de entrada na mesa, não um sistema de pedidos.</p>
<p>Se você ainda não tem cardápio digital, um PDF bem feito do cardápio atual já resolve. É só mandar o arquivo junto com os outros links.</p>`,
      },
      {
        eyebrow: "Para quem",
        titulo: "Feito para restaurantes, bares, cafés e hotéis",
        html: `<p>O display de mesa funciona em qualquer lugar em que o cliente fica sentado: restaurantes, bares, cafés, lanchonetes, food parks, quartos de hotel e pousadas. Em hotéis, a mesma placa pode reunir o Wi-Fi, o guia da cidade e o contato da recepção.</p>
<p>Para pedir avaliações no caixa, combine com a <a href="../plaquinha-avaliacao-google/">plaquinha de avaliação Google</a>.</p>`,
      },
    ],
    faq: [
      ["Preciso ter um cardápio digital pronto?", "Não precisa ser nada complexo. Um PDF do cardápio já funciona. Se você usa uma plataforma de pedidos, o display pode abrir essa página."],
      ["Consigo trocar os links depois?", "Sim. No display multi-link você troca os links quando quiser, sem trocar a placa."],
      ["Funciona com QR code também?", "Sim. O display tem NFC e QR code. Quem tem celular sem NFC aponta a câmera."],
      ["Quantos displays preciso?", "O ideal é um por mesa, para ninguém precisar pedir emprestado. Para balcões e caixas, uma plaquinha de avaliação costuma bastar."],
    ],
    relacionados: ["plaquinha-avaliacao-google", "plaquinha-nfc", "plaquinha-nfc-instagram"],
  },
];
