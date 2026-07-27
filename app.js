/* Estado da UI + render. Toda lógica pura vive em core.js. */
var App = (function () {

  var LS_LANG = 'vendas:lang';
  var LS_COTACAO = 'vendas:cotacao';

  var state = {
    lang: 'es',
    cotacao: CONFIG.cotacaoPadrao,
    query: '',
    categoria: 'todos',
    ordem: 'preco-desc',
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
    el['lang-es'].setAttribute('aria-label', dict.trocarIdioma + ': ' + dict.idiomaEs);
    el['lang-pt'].setAttribute('aria-label', dict.trocarIdioma + ': ' + dict.idiomaPt);

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
        var ph = document.createElement('div');
        ph.className = 'card__placeholder';
        ph.textContent = '🖼';
        media.replaceChild(ph, img);
      };
      media.appendChild(img);

      var count = null;
      if (fotos.length > 1) {
        count = document.createElement('span');
        count.className = 'card__count';
        count.textContent = '1 / ' + fotos.length;
        media.appendChild(count);
      }

      if (!item.vendido) {
        media.dataset.lightbox = item.id;
        media.dataset.idx = '0';

        if (fotos.length > 1) {
          media.appendChild(botaoFoto('prev', '‹', dict.fotoAnterior));
          media.appendChild(botaoFoto('next', '›', dict.fotoSeguinte));
        }
        media.appendChild(botaoFoto('full', '⛶', dict.verFull));
      }
    }

    if (item.vendido) media.dataset.vendido = dict.vendido;
    return media;
  }

  function botaoFoto(acao, glifo, rotulo) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'card__ctrl card__ctrl--' + acao;
    b.dataset.foto = acao;
    b.textContent = glifo;
    b.setAttribute('aria-label', rotulo);
    return b;
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

    if (item.reservado && !item.vendido) {
      var res = document.createElement('span');
      res.className = 'badge badge--reservado';
      res.textContent = dict.reservado;
      head.appendChild(res);
    }

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
    if (Core.temPreco(item)) {
      preco.textContent = Core.formatBRL(item.preco) + ' ';
      var ars = document.createElement('span');
      ars.className = 'preco__ars';
      ars.textContent = '≈ ' + Core.formatARS(item.preco, state.cotacao);
      preco.appendChild(ars);
    } else {
      preco.classList.add('preco--aberto');
      preco.textContent = dict.aConsultar;
    }
    body.appendChild(preco);

    if (desconto !== null) {
      var mercado = document.createElement('p');
      mercado.className = 'mercado';
      mercado.textContent = dict.mercado + ' ';
      var valores = document.createElement('span');
      valores.textContent = Core.formatBRL(item.precoMercado) +
        ' (' + Core.formatARS(item.precoMercado, state.cotacao) + ')';
      mercado.appendChild(valores);
      body.appendChild(mercado);

      if (item.linkMercado) {
        var ref = document.createElement('a');
        ref.className = 'mercado__ref';
        ref.href = item.linkMercado;
        ref.target = '_blank';
        ref.rel = 'noopener';
        ref.textContent = dict.referencia + ' ↗';
        ref.setAttribute('aria-label',
          dict.referencia + ' (' + (item.modelo || texto.titulo || '') + ')');
        body.appendChild(ref);
      }
    }

    if (item.qtd > 1) {
      var combo = document.createElement('p');
      combo.className = 'combo';
      var partes = [item.qtd + ' ' + dict.unidades];
      if (item.precoCombo) {
        partes.push(dict.combo.replace('{n}', item.qtd) + ' ' +
          Core.formatBRL(item.precoCombo) + ' ≈ ' +
          Core.formatARS(item.precoCombo, state.cotacao));
      }
      combo.textContent = partes.join(' · ');
      body.appendChild(combo);
    }

    /* O ano de compra não vai no card: o aviso do topo já diz que tudo
       foi comprado em 2024. O campo `ano` segue nos dados. */
    var metaPartes = [];
    /* `medidasTexto` sobrescreve o formato padrão quando o item pede
       outra redação (ex: metros em vez de centímetros). */
    var med = item.medidasTexto || Core.medidasText(item.medidas);
    if (med) metaPartes.push(dict.medidasRotulo + ' ' + med);
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

  /* ---------- prefs & eventos ---------- */

  function loadPrefs() {
    try {
      var lang = localStorage.getItem(LS_LANG);
      if (lang === 'es' || lang === 'pt') state.lang = lang;

      var cot = localStorage.getItem(LS_COTACAO);
      if (cot !== null) state.cotacao = Core.parseCotacao(cot, CONFIG.cotacaoPadrao);
    } catch (e) {
      /* Safari em modo privado pode barrar localStorage. Segue no padrão. */
    }
  }

  function savePref(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (e) { /* ignora */ }
  }

  function bindEvents() {
    el['lang-es'].addEventListener('click', function () { setLang('es'); });
    el['lang-pt'].addEventListener('click', function () { setLang('pt'); });

    el['cotacao'].addEventListener('input', function () {
      var bruto = el['cotacao'].value;
      var valor = Core.parseCotacao(bruto, null);
      var valida = valor !== null;
      el['cotacao'].classList.toggle('is-invalid', !valida);
      if (!valida) return;
      state.cotacao = valor;
      savePref(LS_COTACAO, valor);
      render();
    });

    el['cotacao-reset'].addEventListener('click', function () {
      state.cotacao = CONFIG.cotacaoPadrao;
      el['cotacao'].value = CONFIG.cotacaoPadrao;
      el['cotacao'].classList.remove('is-invalid');
      savePref(LS_COTACAO, CONFIG.cotacaoPadrao);
      render();
    });

    el['busca'].addEventListener('input', function () {
      state.query = el['busca'].value;
      render();
    });

    el['chips'].addEventListener('click', function (ev) {
      var chip = ev.target.closest('.chip');
      if (!chip) return;
      state.categoria = chip.dataset.cat;
      render();
    });

    el['ordem'].addEventListener('change', function () {
      state.ordem = el['ordem'].value;
      render();
    });

    el['limpar'].addEventListener('click', function () {
      state.query = '';
      state.categoria = 'todos';
      el['busca'].value = '';
      render();
    });
  }

  function setLang(lang) {
    if (state.lang === lang) return;
    state.lang = lang;
    savePref(LS_LANG, lang);
    render();
  }

  /* ---------- lightbox ---------- */

  var lightbox = { fotos: [], idx: 0, origem: null };

  function abrirLightbox(fotos, idx, origem) {
    lightbox.fotos = fotos;
    lightbox.idx = idx || 0;
    lightbox.origem = origem || null;
    el['lightbox'].hidden = false;
    document.body.classList.add('is-locked');
    var sozinha = fotos.length < 2;
    el['lightbox-prev'].hidden = sozinha;
    el['lightbox-next'].hidden = sozinha;
    mostrarFoto();
    el['lightbox-close'].focus();
  }

  function fecharLightbox() {
    el['lightbox'].hidden = true;
    document.body.classList.remove('is-locked');

    var origem = lightbox.origem;
    lightbox.origem = null;
    if (origem && document.contains(origem) && origem.focus) origem.focus();
  }

  function mostrarFoto() {
    el['lightbox-img'].src = lightbox.fotos[lightbox.idx];
  }

  function passarFoto(delta) {
    var n = lightbox.fotos.length;
    lightbox.idx = (lightbox.idx + delta + n) % n;
    mostrarFoto();
  }

  /* Mantém o Tab preso dentro do lightbox enquanto ele está aberto. */
  function prenderFoco(ev) {
    var focaveis = [el['lightbox-close'], el['lightbox-prev'], el['lightbox-next']]
      .filter(function (b) { return !b.hidden; });
    if (focaveis.length === 0) return;

    var primeiro = focaveis[0];
    var ultimo = focaveis[focaveis.length - 1];
    var atual = document.activeElement;

    if (ev.shiftKey && (atual === primeiro || !el['lightbox'].contains(atual))) {
      ev.preventDefault();
      ultimo.focus();
    } else if (!ev.shiftKey && (atual === ultimo || !el['lightbox'].contains(atual))) {
      ev.preventDefault();
      primeiro.focus();
    }
  }

  function passarFotoNoCard(media, fotos, delta) {
    var n = fotos.length;
    var idx = ((Number(media.dataset.idx) || 0) + delta + n) % n;
    media.dataset.idx = String(idx);

    var img = media.querySelector('.card__img');
    if (img) img.src = fotos[idx];

    var count = media.querySelector('.card__count');
    if (count) count.textContent = (idx + 1) + ' / ' + n;
  }

  function bindLightbox() {
    el['grid'].addEventListener('click', function (ev) {
      var media = ev.target.closest('.card__media');
      if (!media || !media.dataset.lightbox) return;
      var item = ITEMS.filter(function (i) { return i.id === media.dataset.lightbox; })[0];
      if (!item || !item.fotos || item.fotos.length === 0) return;

      var botao = ev.target.closest('.card__ctrl');
      var acao = botao && botao.dataset.foto;

      if (acao === 'prev' || acao === 'next') {
        ev.stopPropagation();
        passarFotoNoCard(media, item.fotos, acao === 'next' ? 1 : -1);
        return;
      }

      abrirLightbox(item.fotos, Number(media.dataset.idx) || 0, ev.target);
    });

    el['lightbox-close'].addEventListener('click', fecharLightbox);
    el['lightbox-prev'].addEventListener('click', function () { passarFoto(-1); });
    el['lightbox-next'].addEventListener('click', function () { passarFoto(1); });

    el['lightbox'].addEventListener('click', function (ev) {
      if (ev.target === el['lightbox']) fecharLightbox();
    });

    document.addEventListener('keydown', function (ev) {
      if (el['lightbox'].hidden) return;
      if (ev.key === 'Escape') fecharLightbox();
      if (ev.key === 'Tab') prenderFoco(ev);
      if (ev.key === 'ArrowLeft' && lightbox.fotos.length > 1) passarFoto(-1);
      if (ev.key === 'ArrowRight' && lightbox.fotos.length > 1) passarFoto(1);
    });
  }

  /* ---------- init ---------- */

  function init() {
    cacheEls();
    loadPrefs();

    var problemas = Core.validateItems(ITEMS, CATEGORIAS);
    if (problemas.length) console.warn('items.js com problemas:\n' + problemas.join('\n'));

    el['cotacao'].value = state.cotacao;
    bindEvents();
    bindLightbox();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { state: state, render: render, el: el };
})();
