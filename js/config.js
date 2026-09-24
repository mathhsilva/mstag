/*
 * Configuração da loja — edite aqui sem mexer no resto do site.
 * Preços, número do WhatsApp e textos principais ficam todos neste arquivo.
 */
window.LOJA = {
  nome: "MS Tag",
  // Número com DDI + DDD, só dígitos. Ex.: 5511987654321
  whatsapp: "5511999999999",
  instagram: "mstag",
  email: "contato@mstag.com.br",
  cidade: "Enviamos para todo o Brasil",
  frete: "Frete calculado no WhatsApp conforme o seu CEP",
  prazo: "Produção em até 3 dias úteis",
};

window.PRODUTOS = [
  {
    id: "google",
    nome: "Plaquinha Avaliação Google",
    resumo: "O cliente aproxima o celular e já cai na tela de 5 estrelas do seu perfil.",
    preco: 59.9,
    selo: "Mais vendida",
    medida: "10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "google", cor: "dark" },
  },
  {
    id: "instagram",
    nome: "Plaquinha Instagram",
    resumo: "Um toque abre seu perfil pronto para seguir. Ideal para balcão e provador.",
    preco: 54.9,
    medida: "10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "instagram", cor: "light" },
  },
  {
    id: "whatsapp",
    nome: "Plaquinha WhatsApp",
    resumo: "Abre a conversa com uma mensagem já escrita. Seu cliente só aperta enviar.",
    preco: 54.9,
    medida: "10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "whatsapp", cor: "dark" },
  },
  {
    id: "multilink",
    nome: "Display de Mesa Multi-link",
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
    nome: "Kit Negócio · 3 plaquinhas",
    resumo: "Google + Instagram + WhatsApp com o mesmo visual. O combo que mais gira no balcão.",
    preco: 149.9,
    precoDe: 169.7,
    selo: "Economize R$ 19,80",
    medida: "3 × 10 × 10 cm · acrílico 3 mm",
    visual: { modelo: "kit", cor: "dark" },
  },
];
