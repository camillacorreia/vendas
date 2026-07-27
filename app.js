/* Estado da UI + render. Toda lógica pura vive em core.js. */
var App = (function () {

  var LS_LANG = 'vendas:lang';
  var LS_COTACAO = 'vendas:cotacao';

  var state = {
    lang: 'es',
    cotacao: CONFIG.cotacaoPadrao,
    query: '',
    categoria: 'todos',
    ordem: 'preco-asc',
  };

  var el = {};

  function $(id) { return document.getElementById(id); }

  function cacheEls() {
    ['lang-es', 'lang-pt', 'cotacao', 'cotacao-reset', 'busca', 'chips', 'ordem',
     'grid', 'vazio', 'limpar', 'lightbox', 'lightbox-img', 'lightbox-prev',
     'lightbox-next', 'lightbox-close'].forEach(function (id) {
      el[id] = $(id);
    });
  }

  function t() { return I18N[state.lang]; }

  /* ---------- i18n ---------- */

  function applyI18n() {
    var dict = t();
    document.documentElement.lang = dict.htmlLang;
    document.title = dict.tituloPagina;

    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      if (dict[key] !== undefined) node.textContent = dict[key];
    });

    el['busca'].placeholder = dict.buscarPlaceholder;
    el['busca'].setAttribute('aria-label', dict.buscarLabel);
    el['cotacao'].setAttribute('aria-label', dict.avisoCotacao);
    el['lightbox-close'].setAttribute('aria-label', dict.fecharFoto);
    el['lightbox-prev'].setAttribute('aria-label', dict.fotoAnterior);
    el['lightbox-next'].setAttribute('aria-label', dict.fotoSeguinte);
    el['lang-es'].setAttribute('aria-label', dict.trocarIdioma + ': español');
    el['lang-pt'].setAttribute('aria-label', dict.trocarIdioma + ': português');

    var opts = el['ordem'].options;
    opts[0].textContent = dict.ordPrecoAsc;
    opts[1].textContent = dict.ordPrecoDesc;
    opts[2].textContent = dict.ordDescontoDesc;

    el['lang-es'].classList.toggle('is-active', state.lang === 'es');
    el['lang-pt'].classList.toggle('is-active', state.lang === 'pt');
  }

  /* ---------- chips ---------- */

  function renderChips() {
    var dict = t();
    var usadas = Core.categoriasUsadas(ITEMS);
    el['chips'].innerHTML = '';

    [{ id: 'todos', label: dict.todos }].concat(
      usadas.map(function (c) { return { id: c, label: dict.cat[c] || c }; })
    ).forEach(function (cat) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.categoria === cat.id ? ' is-active' : '');
      b.textContent = cat.label;
      b.setAttribute('aria-pressed', String(state.categoria === cat.id));
      b.dataset.cat = cat.id;
      el['chips'].appendChild(b);
    });
  }

  /* ---------- card ---------- */

  function cardMedia(item, dict) {
    var media = document.createElement('div');
    media.className = 'card__media';

    var fotos = item.fotos || [];
    if (fotos.length === 0) {
      var ph = document.createElement('div');
      ph.className = 'card__placeholder';
      ph.textContent = '🖼';
      media.appendChild(ph);
    } else {
      var img = document.createElement('img');
      img.className = 'card__img';
      img.src = fotos[0];
      img.alt = (item[state.lang] || {}).titulo || '';
      img.loading = 'lazy';
      img.onerror = function () {
        media.innerHTML = '<div class="card__placeholder">🖼</div>';
      };
      media.appendChild(img);

      if (fotos.length > 1) {
        var count = document.createElement('span');
        count.className = 'card__count';
        count.textContent = '1 / ' + fotos.length;
        media.appendChild(count);
      }
      if (!item.vendido) media.dataset.lightbox = item.id;
    }

    if (item.vendido) media.dataset.vendido = dict.vendido;
    return media;
  }

  function cardBody(item, dict) {
    var body = document.createElement('div');
    body.className = 'card__body';
    var texto = item[state.lang] || {};

    var head = document.createElement('div');
    head.className = 'card__head';

    var h2 = document.createElement('h2');
    h2.className = 'card__titulo';
    h2.textContent = texto.titulo || '';
    head.appendChild(h2);

    var desconto = Core.calcDesconto(item.preco, item.precoMercado);
    if (desconto !== null) {
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = '−' + desconto + '%';
      head.appendChild(badge);
    }
    body.appendChild(head);

    if (item.modelo) {
      var modelo = document.createElement('p');
      modelo.className = 'card__modelo';
      modelo.textContent = item.modelo;
      body.appendChild(modelo);
    }

    if (texto.desc) {
      var desc = document.createElement('p');
      desc.className = 'card__desc';
      desc.textContent = texto.desc;
      body.appendChild(desc);
    }

    var preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = Core.formatBRL(item.preco) + ' ';
    var ars = document.createElement('span');
    ars.className = 'preco__ars';
    ars.textContent = '≈ ' + Core.formatARS(item.preco, state.cotacao);
    preco.appendChild(ars);
    body.appendChild(preco);

    if (desconto !== null) {
      var mercado = document.createElement('p');
      mercado.className = 'mercado';
      mercado.textContent = dict.mercado + ' ';
      var s = document.createElement('s');
      s.textContent = Core.formatBRL(item.precoMercado) +
        ' (' + Core.formatARS(item.precoMercado, state.cotacao) + ')';
      mercado.appendChild(s);
      body.appendChild(mercado);
    }

    var metaPartes = [];
    if (item.ano) metaPartes.push(dict.comprado + ' ' + item.ano);
    var med = Core.medidasText(item.medidas);
    if (med) metaPartes.push(med);
    if (metaPartes.length) {
      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = metaPartes.join(' · ');
      if (med) meta.title = dict.medidasTitulo;
      body.appendChild(meta);
    }

    if (!item.vendido) {
      var a = document.createElement('a');
      a.className = 'btn-whats';
      a.href = Core.waLink(item, state.lang, CONFIG.whatsapp);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = dict.contato;
      body.appendChild(a);
    }

    return body;
  }

  function renderCard(item) {
    var dict = t();
    var card = document.createElement('article');
    card.className = 'card' + (item.vendido ? ' card--vendido' : '');
    card.dataset.id = item.id;
    card.appendChild(cardMedia(item, dict));
    card.appendChild(cardBody(item, dict));
    return card;
  }

  /* ---------- render ---------- */

  function render() {
    var dict = t();
    applyI18n();
    renderChips();
    el['ordem'].value = state.ordem;

    var lista = Core.sortItems(
      Core.filterItems(ITEMS, {
        query: state.query,
        categoria: state.categoria,
        lang: state.lang,
      }),
      state.ordem
    );

    el['grid'].innerHTML = '';
    lista.forEach(function (item) { el['grid'].appendChild(renderCard(item)); });

    var semNada = lista.length === 0;
    el['vazio'].hidden = !semNada;
    if (semNada) {
      el['vazio'].querySelector('[data-i18n="vazio"]').textContent =
        ITEMS.length === 0 ? dict.semItens : dict.vazio;
      el['limpar'].hidden = ITEMS.length === 0;
    }
  }

  /* ---------- init ---------- */

  function init() {
    cacheEls();

    var problemas = Core.validateItems(ITEMS, CATEGORIAS);
    if (problemas.length) console.warn('items.js com problemas:\n' + problemas.join('\n'));

    el['cotacao'].value = state.cotacao;
    render();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { state: state, render: render, el: el };
})();
