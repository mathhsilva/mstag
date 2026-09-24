/*
 * Configuração da loja — edite aqui sem mexer no resto do site.
 * Preços, número do WhatsApp e textos principais ficam todos neste arquivo.
 */
window.LOJA = {
  nome: "mstag",
  // Endereço oficial do site (usado no SEO: canonical, sitemap, dados estruturados)
  site: "https://mstag.com.br",
  // Número com DDI + DDD, só dígitos. Ex.: 5511987654321
  whatsapp: "5541984699726",
  whatsappExibicao: "(41) 98469-9726",
  instagram: "mstagbr",
  email: "contato@mstag.com.br",
  empresa: { nome: "Hinnovation", site: "https://hinnovation.com.br" },
  cidade: "Enviamos para todo o Brasil",
  frete: "Frete calculado no WhatsApp conforme o seu CEP",
  prazo: "Produção em até 3 dias úteis",
};

/*
 * Linha Clássica: o design próprio da mstag, vendido com fotos reais das placas.
 * Para adicionar uma cor nova, coloque a imagem em assets/placas/ e registre em "imagens".
 */
window.CLASSICA = {
  id: "classica-google",
  nome: "Avaliação Google · Linha Clássica",
  resumo: "O nosso design mais pedido. Aproximou o celular ou apontou a câmera, o cliente cai direto na tela de 5 estrelas do seu perfil.",
  selo: "Mais vendida",
  material: "acrílico 3 mm · NFC + QR dinâmico",
  tamanhos: [
    { id: "10x10", rotulo: "10 × 10 cm", uso: "Balcão e caixa", preco: 59.9 },
    { id: "10x15", rotulo: "10 × 15 cm", uso: "Parede e mesa", preco: 69.9 },
  ],
  cores: [
    { id: "preto-azul", rotulo: "Preto e azul", amostra: ["#121212", "#3057FF"] },
    { id: "azul", rotulo: "Azul", amostra: ["#1E3FD0", "#C9D1F4"] },
    { id: "preto-cinza", rotulo: "Preto e cinza", amostra: ["#121212", "#C2C2C2"] },
  ],
  imagens: {
    "10x10": {
      "preto-azul": "assets/placas/google-10x10-preto-azul.webp",
      "azul": "assets/placas/google-10x10-azul.webp",
    },
    "10x15": {
      "preto-azul": "assets/placas/google-10x15-preto-azul.webp",
      "azul": "assets/placas/google-10x15-azul.webp",
      "preto-cinza": "assets/placas/google-10x15-preto-cinza.webp",
    },
  },
};

/*
 * Cartão NFC Avaliação Google: um cartão só, com uma face preta e outra branca.
 * A primeira foto da lista é a capa do card.
 */
window.CARTAO_GOOGLE = {
  id: "cartao-google",
  nome: "Cartão NFC Avaliação Google",
  resumo: "Um cartão com duas faces, preta de um lado e branca do outro, que já vem com base de madeira para ficar em pé no balcão. Vire para combinar com o seu espaço. Um toque do celular e o cliente já está nas 5 estrelas.",
  preco: 19.9,
  selo: "Novo · base inclusa",
  material: "Cartão NFC dupla face + base de madeira",
  inclui: "Cartão dupla face + base de madeira",
  destaques: [
    "Base de madeira inclusa, sem custo extra",
    "Duas cores no mesmo cartão: preta e branca",
    "Use em pé na base, deitado no balcão ou na mão do atendente",
    "Chega com o link do seu perfil gravado",
  ],
  fotos: [
    { src: "assets/cartao/cartao-google-preto-suporte.webp", alt: "Face preta do cartão em pé na base de madeira que acompanha o produto" },
    { src: "assets/cartao/cartao-google-balcao.webp", alt: "Cartão NFC Avaliação Google, face preta, na mão de um atendente no balcão" },
    { src: "assets/cartao/cartao-google-branco-suporte.webp", alt: "Face branca do cartão em pé na base de madeira que acompanha o produto" },
    { src: "assets/cartao/cartao-google-preto.webp", alt: "Face preta do cartão deitada sobre uma bancada de pedra" },
    { src: "assets/cartao/cartao-google-branco.webp", alt: "Face branca do cartão deitada sobre uma bancada de pedra" },
  ],
};

/* Linha Tech: plaquinhas desenhadas pelo próprio site */
window.PRODUTOS = [
  {
    id: "google",
    nome: "Avaliação Google · Linha Tech",
    resumo: "Visual minimalista com o nome do seu negócio em destaque. Um toque e o cliente já está nas estrelas.",
    preco: 59.9,
    medida: "10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "google", cor: "dark" },
  },
  {
    id: "instagram",
    nome: "Plaquinha NFC Instagram",
    resumo: "Um toque abre seu perfil pronto para seguir. Ideal para balcão e provador.",
    preco: 54.9,
    medida: "10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "instagram", cor: "light" },
  },
  {
    id: "whatsapp",
    nome: "Plaquinha NFC WhatsApp",
    resumo: "Abre a conversa com uma mensagem já escrita. Seu cliente só aperta enviar.",
    preco: 54.9,
    medida: "10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "whatsapp", cor: "dark" },
  },
  {
    id: "multilink",
    nome: "Display de Mesa NFC Multi-link",
    resumo: "Uma página com cardápio, Wi-Fi, Pix, Instagram e WhatsApp. Troque os links quando quiser.",
    preco: 79.9,
    selo: "Para restaurantes",
    medida: "10 × 15 cm · em pé, com base",
    visual: { modelo: "multilink", cor: "clear" },
  },
  {
    id: "cartao",
    nome: "Cartão de Visita NFC",
    resumo: "Seu contato inteiro no celular do cliente com um toque. Nunca mais acaba o estoque.",
    preco: 39.9,
    medida: "8,5 × 5,4 cm · PVC",
    visual: { modelo: "cartao", cor: "dark" },
  },
  {
    id: "kit",
    nome: "Kit Negócio · 3 plaquinhas NFC",
    resumo: "Google + Instagram + WhatsApp com o mesmo visual. O combo que mais gira no balcão.",
    preco: 149.9,
    precoDe: 169.7,
    selo: "Economize R$ 19,80",
    medida: "3 × 10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "kit", cor: "dark" },
  },
];
