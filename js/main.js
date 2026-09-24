(function () {
  "use strict";

  var LOJA = window.LOJA || {};
  var PRODUTOS = window.PRODUTOS || [];
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function preco(v) { return brl.format(v).replace(/ /g, " "); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------
     Ícones
     ------------------------------------------------------------ */
  var ICON = {
    google:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#fff"/>' +
      '<path d="M35.5 24.3c0-.9-.1-1.7-.2-2.5H24v4.8h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.9Z" fill="#4285F4"/>' +
      '<path d="M24 36c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5h-4v3.1A12 12 0 0 0 24 36Z" fill="#34A853"/>' +
      '<path d="M17.3 26.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1Z" fill="#FBBC05"/>' +
      '<path d="M24 16.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 13.3 18.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" fill="#EA4335"/></svg>',
    instagram:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs>' +
      '<rect x="2" y="2" width="44" height="44" rx="13" fill="url(#igg)"/><rect x="12" y="12" width="24" height="24" rx="7.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="24" r="5.6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31" cy="17" r="1.8" fill="#fff"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#25D366"/><path d="M24 11.5a12.5 12.5 0 0 0-10.8 18.8L11.5 36.5l6.4-1.7A12.5 12.5 0 1 0 24 11.5Z" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><path d="M19.6 18.6c.3-.6.6-.6 1-.6h.8c.2 0 .5 0 .7.6l1 2.4c.1.3 0 .6-.1.8l-.7.9c-.2.2-.2.5 0 .8.5.9 1.9 2.6 3.8 3.3.3.1.5 0 .7-.2l.9-1.1c.2-.3.5-.3.8-.2l2.3 1.1c.3.2.5.3.5.5 0 .6-.2 1.6-1 2.2-.9.7-2.3.8-4.2 0-3.4-1.5-5.6-4.7-6.1-5.6-.5-.8-1.3-2.6-.4-4.9Z" fill="#fff"/></svg>',
    cardapio:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="44" height="44" rx="13" fill="#FF6A3D"/><path d="M17 12v9a3 3 0 0 0 6 0v-9M20 12v24M30 36V12c-3 2-4 6-4 10 0 2 1.5 3 4 3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wifi:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="44" height="44" rx="13" fill="#3047FF"/><path d="M12 20a17 17 0 0 1 24 0M16 25a11 11 0 0 1 16 0M20 30a5 5 0 0 1 8 0" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><circle cx="24" cy="34.5" r="2" fill="#fff"/></svg>',
    pix:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="44" height="44" rx="13" fill="#32BCAD"/><path d="m24 11 6 6-6 6-6-6zM24 25l6 6-6 6-6-6zM11 24l6-6 6 6-6 6zM25 24l6-6 6 6-6 6z" fill="#fff" transform="rotate(0 24 24)" opacity=".95"/></svg>',
    link:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="44" height="44" rx="13" fill="#3047FF"/><path d="M21 27a5 5 0 0 0 7 0l5-5a5 5 0 0 0-7-7l-1.5 1.5M27 21a5 5 0 0 0-7 0l-5 5a5 5 0 0 0 7 7l1.5-1.5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>',
    nfc:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 16c3.6 4.4 3.6 11.6 0 16M22 11c6 7 6 19 0 26M29 6c8.4 9.6 8.4 26.4 0 36" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
    plus:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  };

  /* QR decorativo determinístico (as plaquinhas reais saem com o QR do seu link) */
  function qr(seed) {
    var n = 21, cells = "", s = 0;
    for (var k = 0; k < seed.length; k++) s = (s * 31 + seed.charCodeAt(k)) >>> 0;
    function rnd() { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }
    function finder(x, y) {
      return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#0B1220"/>' +
        '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/>' +
        '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#0B1220"/>';
    }
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        if (!inFinder && rnd() > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
    return '<svg viewBox="0 0 21 21" shape-rendering="crispEdges" aria-hidden="true"><g fill="#0B1220">' + cells + "</g>" +
      finder(0, 0) + finder(14, 0) + finder(0, 14) + "</svg>";
  }

  /* ------------------------------------------------------------
     Plaquinhas desenhadas
     ------------------------------------------------------------ */
  var MODELOS = {
    google: { head: "Avalie a gente no Google", icon: "google", stars: true },
    instagram: { head: "Siga a gente no Instagram", icon: "instagram" },
    whatsapp: { head: "Fale com a gente no WhatsApp", icon: "whatsapp" },
    cardapio: { head: "Veja o nosso cardápio", icon: "cardapio" },
    wifi: { head: "Wi-Fi grátis para você", icon: "wifi" },
    pix: { head: "Pague com Pix por aqui", icon: "pix" },
  };

  function plate(opts) {
    var cor = opts.cor || "dark";
    var nome = opts.nome || "Seu negócio";
    var cls = "plate plate--" + cor;

    if (opts.modelo === "multilink") {
      return '<div class="' + cls + ' plate--tall">' +
        '<div class="plate__top"><span class="plate__brand">' + ICON.link + '</span><div><div class="plate__head">Tudo num toque</div><div class="plate__name">' + esc(nome) + "</div></div></div>" +
        '<div class="plate__links">' +
          ["Cardápio", "Wi-Fi", "Pix", "Instagram", "WhatsApp"].map(function (t) { return '<span class="plate__link"><i></i>' + t + "</span>"; }).join("") +
        "</div>" +
        '<div class="plate__mid"><span class="plate__nfc">' + ICON.nfc + '</span><span class="plate__qr">' + qr(nome + "multi") + "</span></div>" +
        "</div>";
    }

    if (opts.modelo === "cartao") {
      return '<div class="' + cls + ' plate--card">' +
        '<div class="plate__top" style="justify-content:space-between"><div><div class="plate__head">' + esc(opts.nome || "Ana Souza") + '</div><div class="plate__role">Corretora de imóveis</div></div></div>' +
        '<div class="plate__mid"><div class="plate__contact"><span>(11) 9 0000-0000</span><span>@anasouza.imoveis</span></div><span class="plate__nfc">' + ICON.nfc + "</span></div>" +
        "</div>";
    }

    if (opts.modelo === "kit") {
      return '<div class="kit-stack">' +
        plate({ modelo: "instagram", cor: "light", nome: nome }) +
        plate({ modelo: "google", cor: cor, nome: nome }) +
        plate({ modelo: "whatsapp", cor: cor, nome: nome }) +
        "</div>";
    }

    var m = MODELOS[opts.modelo] || MODELOS.google;
    var stars = m.stars
      ? '<div class="plate__stars">' + new Array(6).join(ICON.star).replace(/<path /g, '<path fill="#FBBC05" ') + "</div>"
      : "";
    return '<div class="' + cls + '">' +
      '<div class="plate__top"><span class="plate__brand">' + ICON[m.icon] + '</span><div><div class="plate__head">' + m.head + '</div><div class="plate__name">' + esc(nome) + "</div></div></div>" +
      '<div class="plate__mid"><span class="plate__nfc">' + ICON.nfc + '</span><span class="plate__qr">' + qr(nome + opts.modelo) + "</span></div>" +
      '<div class="plate__foot"><span>Aproxime o celular</span>' + stars + "</div>" +
      "</div>";
  }

  /* Linha Clássica: foto real da placa, com o logo e um QR por cima dos marcadores do arquivo */
  var CLASSICA = window.CLASSICA;
  function placaClassica(tam, cor, eager) {
    var imgs = CLASSICA.imagens[tam] || CLASSICA.imagens[Object.keys(CLASSICA.imagens)[0]];
    var src = imgs[cor] || imgs[Object.keys(imgs)[0]];
    var alto = tam === "10x15";
    var t = CLASSICA.tamanhos.find(function (x) { return x.id === tam; });
    var c = CLASSICA.cores.find(function (x) { return x.id === cor; });
    var alt = "Placa Avaliação Google, Linha Clássica, " + (t ? t.rotulo : tam) + ", " + (c ? c.rotulo.toLowerCase() : cor);
    return '<div class="pc pc--' + (alto ? "tall" : "square") + '">' +
      '<img src="' + src + '" alt="' + esc(alt) + '" width="800" height="' + (alto ? 1200 : 800) + '"' + (eager ? "" : ' loading="lazy"') + ' decoding="async">' +
      '<span class="pc__logo">' + ICON.google + "</span>" +
      '<span class="pc__qr">' + qr("classica" + tam) + "</span></div>";
  }

  /* ------------------------------------------------------------
     Demonstração do hero
     ------------------------------------------------------------ */
  var CENAS = [
    { id: "google", rotulo: "Google" },
    { id: "instagram", rotulo: "Instagram" },
    { id: "whatsapp", rotulo: "WhatsApp" },
    { id: "cardapio", rotulo: "Cardápio" },
    { id: "wifi", rotulo: "Wi-Fi" },
    { id: "pix", rotulo: "Pix" },
  ];
  var NEGOCIO = "Café da Praça";

  function tela(id) {
    var url = '<div class="scr__url">';
    switch (id) {
      case "google":
        return '<div class="scr">' + url + "g.page/cafedapraca/review</div>" +
          '<div class="scr__card"><div class="scr__bar"><span style="width:18px;height:18px;display:block">' + ICON.google + '</span>' + NEGOCIO + '</div>' +
          '<div class="scr__sub">Postando publicamente</div>' +
          '<div class="scr__stars">' + new Array(6).join(ICON.star) + "</div>" +
          '<div class="scr__lines"><i></i><i></i><i></i></div></div>' +
          '<div class="scr__sub">Compartilhe detalhes da sua experiência</div>' +
          '<div class="scr__btn">Postar</div></div>';
      case "instagram":
        return '<div class="scr">' + url + "instagram.com/cafedapraca</div>" +
          '<div style="display:flex;align-items:center;gap:10px"><div class="scr__avatar"><span>CP</span></div>' +
          '<div class="scr__stats" style="flex:1"><span><b>312</b>posts</span><span><b>4,8 mil</b>seguidores</span></div></div>' +
          '<div class="scr__title">cafedapraca</div><div class="scr__sub">Café especial e pão na chapa desde 2014</div>' +
          '<div class="scr__btn" style="margin-top:0;background:#0095F6">Seguir</div>' +
          '<div class="scr__grid"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>';
      case "whatsapp":
        return '<div class="scr scr--wa"><div class="wa-head"><i></i>' + NEGOCIO + "</div>" +
          '<div class="wa-bubble">Olá! Seja bem-vindo ao ' + NEGOCIO + ".</div>" +
          '<div class="wa-input"><span>Oi! Vim pela plaquinha e quero fazer um pedido</span><i></i></div></div>';
      case "cardapio":
        return '<div class="scr">' + url + "cafedapraca.menu</div>" +
          '<div class="scr__title">Cardápio</div>' +
          '<div class="menu-tabs"><span>Cafés</span><span>Lanches</span><span>Doces</span></div>' +
          '<div><div class="menu-row"><span>Espresso</span><b>R$ 7,00</b></div>' +
          '<div class="menu-row"><span>Cappuccino</span><b>R$ 12,00</b></div>' +
          '<div class="menu-row"><span>Pão na chapa</span><b>R$ 9,50</b></div>' +
          '<div class="menu-row"><span>Pão de queijo</span><b>R$ 6,00</b></div></div></div>';
      case "wifi":
        return '<div class="scr scr--center"><div class="big-icon">' + ICON.wifi.replace('fill="#3047FF"', 'fill="none"').replace(/stroke="#fff"/g, 'stroke="currentColor"').replace('fill="#fff"', 'fill="currentColor"') + "</div>" +
          '<div class="scr__title">CafeDaPraca_Clientes</div><span class="ok-pill">Conectado</span>' +
          '<div class="scr__sub">Sem digitar senha</div></div>';
      case "pix":
        return '<div class="scr scr--center"><div class="scr__sub">Pagar para</div><div class="scr__title">' + NEGOCIO + "</div>" +
          '<div class="pix-val">R$ 38,50</div><div class="pix-key">chave: cafedapraca@pix</div>' +
          '<div class="scr__btn" style="background:#32BCAD;align-self:stretch;margin-top:8px">Pagar com Pix</div></div>';
    }
    return "";
  }
  function telaInicial() {
    return '<div class="scr scr--idle"><span class="idle__nfc">' + ICON.nfc + "</span><div>Aproxime da plaquinha</div></div>";
  }

  function iniciarDemo() {
    var demo = $("#demo");
    if (!demo) return;
    var elPlate = $("#demoPlate"), elScreen = $("#demoScreen"), elTabs = $("#demoTabs");
    var atual = 0, timers = [], auto = true;

    elTabs.innerHTML = CENAS.map(function (c, i) {
      return '<button class="demo__tab" type="button" role="tab" data-i="' + i + '" aria-selected="false">' +
        '<span style="width:16px;height:16px;display:block">' + ICON[c.id] + "</span>" + c.rotulo + "</button>";
    }).join("");

    function limpar() { timers.forEach(clearTimeout); timers = []; }
    function depois(ms, fn) { timers.push(setTimeout(fn, ms)); }

    function trocarTela(html) {
      var wrap = document.createElement("div");
      wrap.innerHTML = html;
      var novo = wrap.firstElementChild;
      // Tudo que já está no celular fica por baixo, parado, até a tela nova cobrir; depois sai do DOM.
      $all(".scr", elScreen).forEach(function (velho) {
        velho.classList.add("is-leaving");
        setTimeout(function () { if (velho.parentNode) velho.parentNode.removeChild(velho); }, 320);
      });
      novo.classList.add("is-entering");
      elScreen.appendChild(novo);
      void novo.offsetWidth;
      novo.classList.remove("is-entering");
      var st = novo.querySelector(".scr__stars");
      if (st) setTimeout(function () { st.classList.add("on"); }, 250);
    }

    function tocar(i) {
      limpar();
      atual = i;
      var cena = CENAS[i];
      $all(".demo__tab", elTabs).forEach(function (b, j) { b.setAttribute("aria-selected", j === i ? "true" : "false"); });
      demo.classList.remove("is-tapped", "is-approach");
      elPlate.innerHTML = cena.id === "google"
        ? placaClassica("10x10", "preto-azul", true)
        : plate({ modelo: cena.id, cor: cena.id === "instagram" || cena.id === "wifi" ? "light" : "dark", nome: NEGOCIO });

      if (reduzMovimento) {
        trocarTela(tela(cena.id));
        demo.classList.add("is-tapped");
      } else {
        trocarTela(telaInicial());
        depois(120, function () { demo.classList.add("is-approach"); });
        depois(760, function () { demo.classList.add("is-tapped"); trocarTela(tela(cena.id)); });
        depois(2300, function () { demo.classList.remove("is-approach"); });
        depois(2700, function () { demo.classList.remove("is-tapped"); });
      }
      if (auto) depois(4600, function () { tocar((atual + 1) % CENAS.length); });
    }

    elTabs.addEventListener("click", function (e) {
      var b = e.target.closest(".demo__tab");
      if (!b) return;
      auto = false;
      tocar(Number(b.dataset.i));
    });
    elTabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      auto = false;
      var n = (atual + (e.key === "ArrowRight" ? 1 : -1) + CENAS.length) % CENAS.length;
      tocar(n);
      elTabs.children[n].focus();
    });

    // Pausa o ciclo automático quando o hero sai da tela
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) limpar();
          else if (auto && !timers.length) tocar(atual);
        });
      }, { threshold: 0.2 }).observe(demo);
    }

    // Estado inicial já com uma tela preenchida
    elPlate.innerHTML = placaClassica("10x10", "preto-azul", true);
    elScreen.innerHTML = tela("google");
    elTabs.children[0].setAttribute("aria-selected", "true");
    var st = elScreen.querySelector(".scr__stars"); if (st) st.classList.add("on");
    depois(1800, function () { tocar(1); });
  }

  /* ------------------------------------------------------------
     Carrinho
     ------------------------------------------------------------ */
  var CHAVE = "mstag-carrinho-v1";
  var carrinho = [];
  try { carrinho = JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { carrinho = []; }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch (e) {} }

  var NOMES_COR = { dark: "Preto fosco", light: "Branco", clear: "Cristal" };

  function rotulo(lista, id) {
    var o = lista.find(function (x) { return x.id === id; });
    return o ? o.rotulo : id;
  }
  // Linhas de detalhe de um item: [rótulo, valor]
  function detalhes(c) {
    var d = c.estilo === "classica"
      ? [["Tamanho", rotulo(CLASSICA.tamanhos, c.tam)], ["Cor", rotulo(CLASSICA.cores, c.cor)]]
      : c.estilo === "cartao-google"
        ? [["Faces", "preta e branca"]]
        : [["Acabamento", NOMES_COR[c.cor]]];
    if (c.nome) d.push(["Nome", c.nome]);
    if (c.link) d.push(["Link", c.link]);
    return d;
  }
  function miniatura(c) {
    if (c.estilo === "classica") return placaClassica(c.tam, c.cor);
    if (c.estilo === "cartao-google") return '<img class="line__photo" src="' + CARTAO.fotos[0].src + '" alt="">';
    return plate({ modelo: c.modelo, cor: c.cor, nome: c.nome });
  }

  function adicionar(item) {
    var chave = [item.id, item.tam || "", item.cor, item.nome || "", item.link || ""].join("|");
    var existente = carrinho.find(function (c) { return c.chave === chave; });
    if (existente) existente.qtd += 1;
    else carrinho.push(Object.assign({ chave: chave, qtd: 1 }, item));
    salvar();
    renderCarrinho();
    var cont = $("#contadorCarrinho");
    cont.classList.remove("bump"); void cont.offsetWidth; cont.classList.add("bump");
    toast(item.titulo + " no carrinho", "Ver carrinho", abrirCarrinho);
  }

  function total() { return carrinho.reduce(function (s, c) { return s + c.preco * c.qtd; }, 0); }

  function renderCarrinho() {
    var qtd = carrinho.reduce(function (s, c) { return s + c.qtd; }, 0);
    var cont = $("#contadorCarrinho");
    cont.textContent = qtd;
    cont.dataset.zero = qtd === 0 ? "true" : "false";
    $("#abrirCarrinho").setAttribute("aria-label", "Abrir carrinho, " + qtd + (qtd === 1 ? " item" : " itens"));

    var body = $("#itensCarrinho");
    $("#rodapeCarrinho").hidden = carrinho.length === 0;
    if (!carrinho.length) {
      body.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "<b>Seu carrinho está vazio</b><span>Escolha uma plaquinha para começar.</span>" +
        '<a class="btn btn--primary" href="#produtos" data-fechar>Ver produtos</a></div>';
      return;
    }
    body.innerHTML = carrinho.map(function (c, i) {
      var det = detalhes(c).map(function (d) { return esc(d[0] + ": " + d[1]); });
      return '<div class="line"><div class="line__art">' + miniatura(c) + "</div>" +
        '<div class="line__info"><b>' + esc(c.titulo) + "</b><small>" + det.join(" · ") + "</small>" +
        '<div class="line__row"><div class="qty"><button type="button" data-menos="' + i + '" aria-label="Diminuir quantidade">−</button><span>' + c.qtd + '</span><button type="button" data-mais="' + i + '" aria-label="Aumentar quantidade">+</button></div>' +
        '<span class="line__price">' + preco(c.preco * c.qtd) + "</span></div></div></div>";
    }).join("");
    $("#totalCarrinho").textContent = preco(total());
    atualizarLinkPedido();
  }

  function atualizarLinkPedido() {
    var nome = ($("#clienteNome").value || "").trim();
    var linhas = ["Olá! Quero fazer um pedido pelo site da " + (LOJA.nome || "loja") + ":", ""];
    carrinho.forEach(function (c) {
      linhas.push("• " + c.qtd + "× " + c.titulo + " = " + preco(c.preco * c.qtd));
      var det = detalhes(c).map(function (d) { return d[0] + ": " + d[1]; });
      linhas.push("   " + det.join(" | "));
    });
    linhas.push("", "Subtotal: " + preco(total()));
    if (nome) linhas.push("Meu nome: " + nome);
    linhas.push("", "Pode calcular o frete para o meu CEP?");
    $("#finalizar").href = whatsLink(linhas.join("\n"));
  }

  var drawer, ultimoFoco;
  function abrirCarrinho() {
    ultimoFoco = document.activeElement;
    drawer.hidden = false;
    drawer.classList.remove("is-closing");
    requestAnimationFrame(function () { requestAnimationFrame(function () { drawer.classList.add("is-open"); }); });
    document.body.style.overflow = "hidden";
    setTimeout(function () { var b = $(".drawer__head .icon-btn"); if (b) b.focus(); }, 60);
  }
  function fecharCarrinho() {
    drawer.classList.add("is-closing");
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { if (!drawer.classList.contains("is-open")) drawer.hidden = true; }, 240);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  function iniciarCarrinho() {
    drawer = $("#carrinho");
    $("#abrirCarrinho").addEventListener("click", abrirCarrinho);
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-fechar]")) { fecharCarrinho(); return; }
      var mais = e.target.closest("[data-mais]"), menos = e.target.closest("[data-menos]");
      if (mais) { carrinho[+mais.dataset.mais].qtd++; }
      else if (menos) {
        var i = +menos.dataset.menos;
        carrinho[i].qtd--;
        if (carrinho[i].qtd <= 0) carrinho.splice(i, 1);
      } else return;
      salvar(); renderCarrinho();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) fecharCarrinho();
    });
    $("#clienteNome").addEventListener("input", atualizarLinkPedido);
    renderCarrinho();
  }

  /* ------------------------------------------------------------
     Produtos
     ------------------------------------------------------------ */
  var PERSONALIZAVEIS = { google: 1, instagram: 1, whatsapp: 1, multilink: 1 };
  var sel = { tam: CLASSICA.tamanhos[0].id, cor: CLASSICA.cores[0].id };

  function tamanhoAtual() { return CLASSICA.tamanhos.find(function (t) { return t.id === sel.tam; }); }
  function corDisponivel(tam, cor) { return !!(CLASSICA.imagens[tam] && CLASSICA.imagens[tam][cor]); }
  function outroTamanhoCom(cor) {
    var t = CLASSICA.tamanhos.find(function (x) { return corDisponivel(x.id, cor); });
    return t ? t.rotulo : "";
  }
  function amostra(c) {
    return '<span class="dot2" style="--a:' + c.amostra[0] + ";--b:" + c.amostra[1] + '"></span>';
  }

  function cardClassica() {
    return '<article class="product product--featured" id="cardClassica">' +
      '<div class="product__art product__art--photo">' + (CLASSICA.selo ? '<span class="product__badge">' + esc(CLASSICA.selo) + "</span>" : "") +
        '<div class="photo-slot" id="fotoClassica"></div></div>' +
      '<div class="product__body">' +
        '<span class="product__meta">Linha Clássica · ' + esc(CLASSICA.material) + "</span>" +
        "<h3>" + esc(CLASSICA.nome) + "</h3>" +
        "<p>" + esc(CLASSICA.resumo) + "</p>" +
        '<div class="opts">' +
          '<div class="opt"><span class="opt__label">Tamanho</span><div class="seg" role="group" aria-label="Tamanho">' +
            CLASSICA.tamanhos.map(function (t) {
              return '<button type="button" data-tam="' + t.id + '"><b>' + t.rotulo + "</b><small>" + esc(t.uso) + "</small></button>";
            }).join("") + "</div></div>" +
          '<div class="opt"><span class="opt__label">Cor · <b id="nomeCorClassica"></b></span><div class="colors" role="group" aria-label="Cor">' +
            CLASSICA.cores.map(function (c) {
              return '<button type="button" class="color" data-ccor="' + c.id + '" aria-label="' + esc(c.rotulo) + '">' + amostra(c) + "</button>";
            }).join("") + '</div><span class="opt__note" id="notaCorClassica"></span></div>' +
        "</div>" +
        '<div class="product__buy"><div class="price"><b id="precoClassica"></b><small id="parcelaClassica"></small></div>' +
          '<button class="btn btn--primary add-btn" type="button" data-add-classica>' + ICON.plus + "Adicionar</button></div>" +
        '<a class="muted small" href="#personalize" data-personalizar="classica" style="font-weight:700">Adicionar o meu link e nome</a>' +
      "</div></article>";
  }

  var CARTAO = window.CARTAO_GOOGLE;
  function cardCartao() {
    var f = CARTAO.fotos;
    return '<article class="product product--featured product--flip" id="cardCartao">' +
      '<div class="product__art product__art--gallery">' + (CARTAO.selo ? '<span class="product__badge">' + esc(CARTAO.selo) + "</span>" : "") +
        '<div class="gallery">' +
          '<div class="gallery__main"><img id="fotoCartao" src="' + f[0].src + '" alt="' + esc(f[0].alt) + '" width="900" height="900" loading="lazy" decoding="async"></div>' +
          '<div class="gallery__thumbs" role="group" aria-label="Fotos do cartão">' +
            f.map(function (x, i) {
              return '<button type="button" data-foto="' + i + '" aria-label="Ver foto ' + (i + 1) + '" aria-pressed="' + (i ? "false" : "true") + '">' +
                '<img src="' + x.src + '" alt="" width="900" height="900" loading="lazy" decoding="async"></button>';
            }).join("") +
          "</div></div></div>" +
      '<div class="product__body">' +
        '<span class="product__meta">' + esc(CARTAO.material) + "</span>" +
        "<h3>" + esc(CARTAO.nome) + "</h3>" +
        "<p>" + esc(CARTAO.resumo) + "</p>" +
        '<div class="faces" aria-hidden="true"><span class="faces__card faces__card--dark">' + ICON.google + '</span><span class="faces__flip">' +
          '<svg viewBox="0 0 24 24"><path d="M4 9h13l-3-3M20 15H7l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
          '<span class="faces__card faces__card--light">' + ICON.google + "</span><small>Frente e verso</small></div>" +
        '<ul class="ticks">' + CARTAO.destaques.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" +
        '<div class="product__buy"><div class="price"><b>' + preco(CARTAO.preco) + "</b><small>no Pix ou no cartão</small></div>" +
          '<button class="btn btn--primary add-btn" type="button" data-add-cartao>' + ICON.plus + "Adicionar</button></div>" +
      "</div></article>";
  }
  function mostrarFotoCartao(i) {
    var img = $("#fotoCartao"), foto = CARTAO.fotos[i];
    if (!img || img.getAttribute("src") === foto.src) return;
    $all("#cardCartao [data-foto]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.foto === i ? "true" : "false"); });
    function trocar() { img.src = foto.src; img.alt = foto.alt; img.classList.remove("is-fading"); }
    if (reduzMovimento) { trocar(); return; }
    img.classList.add("is-fading");
    var pre = new Image();
    pre.onload = pre.onerror = function () { setTimeout(trocar, 120); };
    pre.src = foto.src;
  }

  function atualizarCardClassica(animar) {
    var card = $("#cardClassica");
    if (!card) return;
    $all("[data-tam]", card).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.tam === sel.tam ? "true" : "false"); });
    $all("[data-ccor]", card).forEach(function (b) {
      var ok = corDisponivel(sel.tam, b.dataset.ccor);
      b.setAttribute("aria-pressed", b.dataset.ccor === sel.cor ? "true" : "false");
      b.classList.toggle("is-off", !ok);
      b.title = ok ? rotulo(CLASSICA.cores, b.dataset.ccor) : "Disponível em " + outroTamanhoCom(b.dataset.ccor);
    });
    $("#nomeCorClassica").textContent = rotulo(CLASSICA.cores, sel.cor);
    $("#notaCorClassica").textContent = "";
    var t = tamanhoAtual();
    $("#precoClassica").textContent = preco(t.preco);
    $("#parcelaClassica").textContent = "ou 3× de " + preco(t.preco / 3);
    var slot = $("#fotoClassica");
    slot.innerHTML = placaClassica(sel.tam, sel.cor, true);
    if (animar && !reduzMovimento) { slot.classList.remove("swap"); void slot.offsetWidth; slot.classList.add("swap"); }
  }

  function iniciarProdutos() {
    var lista = $("#listaProdutos");
    lista.innerHTML = cardClassica() + (CARTAO ? cardCartao() : "") + PRODUTOS.map(function (p) {
      var wide = p.visual.modelo === "cartao" || p.visual.modelo === "kit";
      var artCls = "product__art" + (wide ? " product__art--wide" : "");
      var artStyle = p.visual.modelo === "multilink" ? ' style="padding-inline:28%"' : "";
      return '<article class="product">' +
        '<div class="' + artCls + '"' + artStyle + ">" + (p.selo ? '<span class="product__badge">' + esc(p.selo) + "</span>" : "") +
          "<div>" + plate({ modelo: p.visual.modelo, cor: p.visual.cor, nome: "Seu negócio" }) + "</div></div>" +
        '<div class="product__body">' +
          '<span class="product__meta">Linha Tech · ' + esc(p.medida) + "</span>" +
          "<h3>" + esc(p.nome) + "</h3>" +
          "<p>" + esc(p.resumo) + "</p>" +
          '<div class="product__buy"><div class="price">' +
            (p.precoDe ? "<s>" + preco(p.precoDe) + "</s>" : "") +
            "<b>" + preco(p.preco) + "</b>" +
            "<small>ou 3× de " + preco(p.preco / 3) + "</small></div>" +
            '<button class="btn btn--primary add-btn" type="button" data-add="' + p.id + '">' + ICON.plus + "Adicionar</button>" +
          "</div>" +
          (PERSONALIZAVEIS[p.id] ? '<a class="muted small" href="#personalize" data-personalizar="' + p.id + '" style="font-weight:700">Personalizar com o meu nome</a>' : "") +
        "</div></article>";
    }).join("");
    atualizarCardClassica(false);

    lista.addEventListener("click", function (e) {
      var tam = e.target.closest("[data-tam]");
      if (tam) {
        sel.tam = tam.dataset.tam;
        if (!corDisponivel(sel.tam, sel.cor)) sel.cor = Object.keys(CLASSICA.imagens[sel.tam])[0];
        atualizarCardClassica(true);
        return;
      }
      var cc = e.target.closest("[data-ccor]");
      if (cc) {
        if (!corDisponivel(sel.tam, cc.dataset.ccor)) {
          // cor só existe no outro tamanho: troca o tamanho junto
          var t = CLASSICA.tamanhos.find(function (x) { return corDisponivel(x.id, cc.dataset.ccor); });
          if (!t) return;
          sel.tam = t.id;
          sel.cor = cc.dataset.ccor;
          atualizarCardClassica(true);
          $("#notaCorClassica").textContent = rotulo(CLASSICA.cores, sel.cor) + " só existe em " + t.rotulo + ". Trocamos o tamanho para você.";
          return;
        }
        sel.cor = cc.dataset.ccor;
        atualizarCardClassica(true);
        return;
      }
      var foto = e.target.closest("[data-foto]");
      if (foto) { mostrarFotoCartao(+foto.dataset.foto); return; }
      if (e.target.closest("[data-add-cartao]")) {
        adicionar({ id: CARTAO.id, estilo: "cartao-google", titulo: CARTAO.nome, preco: CARTAO.preco });
        return;
      }
      if (e.target.closest("[data-add-classica]")) {
        adicionar({ id: CLASSICA.id, estilo: "classica", titulo: CLASSICA.nome, preco: tamanhoAtual().preco, tam: sel.tam, cor: sel.cor });
        return;
      }
      var add = e.target.closest("[data-add]");
      if (add) {
        var p = PRODUTOS.find(function (x) { return x.id === add.dataset.add; });
        adicionar({ id: p.id, estilo: "tech", titulo: p.nome, preco: p.preco, modelo: p.visual.modelo, cor: p.visual.cor });
        return;
      }
      var per = e.target.closest("[data-personalizar]");
      if (per) {
        var alvo = per.dataset.personalizar;
        if (alvo === "classica") {
          marcar("estilo", "classica");
          marcar("tam", sel.tam);
          marcar("ccor", sel.cor);
        } else {
          marcar("estilo", "tech");
          marcar("modelo", alvo);
        }
        atualizarPrevia(true);
      }
    });
  }

  /* ------------------------------------------------------------
     Personalizador
     ------------------------------------------------------------ */
  var ultimaPrevia;
  function marcar(nome, valor) {
    var r = $('#formConfig input[name="' + nome + '"][value="' + valor + '"]');
    if (r) r.checked = true;
  }
  function marcado(nome) {
    var r = $('#formConfig input[name="' + nome + '"]:checked');
    return r ? r.value : "";
  }
  function valoresConfig() {
    return {
      estilo: marcado("estilo"),
      modelo: marcado("modelo"),
      cor: marcado("cor"),
      tam: marcado("tam"),
      ccor: marcado("ccor"),
      nome: $("#cfgNome").value.trim(),
      link: $("#cfgLink").value.trim(),
    };
  }
  function atualizarPrevia(animar) {
    var v = valoresConfig();
    var classica = v.estilo === "classica";
    $("#grupoTech").hidden = classica;
    $("#grupoClassica").hidden = !classica;

    var box = $("#previewPlate"), valor, legenda, chavePrevia;
    if (classica) {
      if (!corDisponivel(v.tam, v.ccor)) {
        v.ccor = Object.keys(CLASSICA.imagens[v.tam])[0];
        marcar("ccor", v.ccor);
      }
      $all('#cfgCCor input').forEach(function (r) {
        var ok = corDisponivel(v.tam, r.value);
        r.disabled = !ok;
        r.closest(".swatch").title = ok ? "" : "Disponível em " + outroTamanhoCom(r.value);
      });
      var t = CLASSICA.tamanhos.find(function (x) { return x.id === v.tam; });
      box.innerHTML = placaClassica(v.tam, v.ccor);
      box.classList.toggle("is-tall", v.tam === "10x15");
      valor = t.preco;
      legenda = "Linha Clássica · " + t.rotulo + " · logo e QR finais na produção";
      chavePrevia = "c" + v.tam + v.ccor;
    } else {
      var p = PRODUTOS.find(function (x) { return x.id === v.modelo; });
      box.innerHTML = plate({ modelo: v.modelo, cor: v.cor, nome: v.nome || "Seu negócio" });
      box.classList.toggle("is-tall", v.modelo === "multilink");
      valor = p.preco;
      legenda = "Linha Tech · prévia ilustrativa · " + p.medida;
      chavePrevia = "t" + v.modelo + v.cor;
    }
    if (animar && !reduzMovimento && ultimaPrevia !== undefined && ultimaPrevia !== chavePrevia) {
      box.classList.remove("swap"); void box.offsetWidth; box.classList.add("swap");
    }
    ultimaPrevia = chavePrevia;
    $("#cfgPreco").textContent = preco(valor);
    $("#previewCaption").textContent = legenda;
    var ph = { google: "Ex.: link do seu perfil no Google", instagram: "Ex.: @cafedapraca", whatsapp: "Ex.: (11) 98765-4321", multilink: "Ex.: seus links, a gente monta a página" };
    $("#cfgLink").placeholder = classica ? ph.google : ph[v.modelo];
  }
  function iniciarConfig() {
    var f = $("#formConfig");
    $("#cfgTam").innerHTML = CLASSICA.tamanhos.map(function (t, i) {
      return '<label class="chip"><input type="radio" name="tam" value="' + t.id + '"' + (i ? "" : " checked") + "><span>" + t.rotulo + "</span></label>";
    }).join("");
    $("#cfgCCor").innerHTML = CLASSICA.cores.map(function (c, i) {
      return '<label class="swatch"><input type="radio" name="ccor" value="' + c.id + '"' + (i ? "" : " checked") + ">" + amostra(c) + "<span>" + esc(c.rotulo) + "</span></label>";
    }).join("");
    f.addEventListener("change", function (e) { atualizarPrevia(e.target.type === "radio"); });
    $("#cfgNome").addEventListener("input", function () { atualizarPrevia(false); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = valoresConfig();
      if (v.estilo === "classica") {
        var t = CLASSICA.tamanhos.find(function (x) { return x.id === v.tam; });
        adicionar({ id: CLASSICA.id, estilo: "classica", titulo: CLASSICA.nome, preco: t.preco, tam: v.tam, cor: v.ccor, nome: v.nome, link: v.link });
        return;
      }
      var p = PRODUTOS.find(function (x) { return x.id === v.modelo; });
      adicionar({ id: p.id, estilo: "tech", titulo: p.nome, preco: p.preco, modelo: v.modelo, cor: v.cor, nome: v.nome, link: v.link });
    });
    atualizarPrevia(false);
  }

  /* ------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------ */
  function whatsLink(msg) {
    return "https://wa.me/" + String(LOJA.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
  }

  var toastTimer;
  function toast(msg, acao, fn) {
    var t = $("#toast");
    t.innerHTML = "<span>" + esc(msg) + "</span>" + (acao ? '<button type="button">' + esc(acao) + "</button>" : "");
    if (acao) t.querySelector("button").addEventListener("click", function () { t.classList.remove("is-on"); fn(); });
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  function iniciarLoja() {
    $all("[data-whats]").forEach(function (a) { a.href = whatsLink(a.dataset.whats); });
    var ig = $("#linkInstagram");
    if (ig && LOJA.instagram) { ig.href = "https://instagram.com/" + LOJA.instagram; ig.textContent = "Instagram @" + LOJA.instagram; }
    $all("[data-loja]").forEach(function (el) { if (LOJA[el.dataset.loja]) el.textContent = LOJA[el.dataset.loja]; });
    var ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();

    var topbar = $(".topbar");
    function onScroll() { topbar.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Realce ao rolar: só para o que está abaixo da dobra; o resto já está visível */
  function iniciarReveal() {
    if (reduzMovimento || !("IntersectionObserver" in window)) return;
    var alvos = $all(".product, .step, .use, .perk, .compare__col, .faq details, .final");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.remove("is-pre");
        io.unobserve(el);
        setTimeout(function () { el.classList.remove("reveal"); el.style.transitionDelay = ""; }, 900);
      });
    }, { rootMargin: "0px 0px -60px 0px" });
    alvos.forEach(function (el, i) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add("reveal", "is-pre");
      el.style.transitionDelay = (i % 3) * 60 + "ms";
      io.observe(el);
    });
  }

  iniciarLoja();
  iniciarDemo();
  iniciarProdutos();
  iniciarCarrinho();
  iniciarConfig();
  iniciarReveal();
})();
