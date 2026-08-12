/* Painel do dono. Português apenas — esta página não é para o comprador.
   A senha roda no navegador e não protege nada de verdade; ver o aviso no
   rodapé de admin.html. */
(function () {

  var SENHA = '050775';
  var SS_ABERTO = 'vendas:painel';

  var el = {};

  function $(id) { return document.getElementById(id); }

  function cacheEls() {
    ['gate', 'gate-form', 'gate-senha', 'gate-erro', 'painel', 'resumo',
     'admin-cotacao', 'tabela-corpo'].forEach(function (id) {
      el[id] = $(id);
    });
  }

  /* ---------- porta ---------- */

  function jaEntrou() {
    try { return sessionStorage.getItem(SS_ABERTO) === '1'; } catch (e) { return false; }
  }

  function lembrarEntrada() {
    try { sessionStorage.setItem(SS_ABERTO, '1'); } catch (e) { /* ignora */ }
  }

  function abrirPainel() {
    el['gate'].hidden = true;
    el['painel'].hidden = false;
    render();
  }

  function bindGate() {
    el['gate-form'].addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (el['gate-senha'].value === SENHA) {
        el['gate-erro'].hidden = true;
        lembrarEntrada();
        abrirPainel();
      } else {
        el['gate-erro'].hidden = false;
        el['gate-senha'].value = '';
        el['gate-senha'].focus();
      }
    });
  }

  /* ---------- render ---------- */

  function cotacao() {
    return Core.parseCotacao(el['admin-cotacao'].value, CONFIG.cotacaoPadrao);
  }

  function cartao(rotulo, valor, sub) {
    var div = document.createElement('div');
    div.className = 'resumo__cartao';

    var r = document.createElement('p');
    r.className = 'resumo__rotulo';
    r.textContent = rotulo;
    div.appendChild(r);

    var v = document.createElement('p');
    v.className = 'resumo__valor';
    v.textContent = valor;
    div.appendChild(v);

    if (sub) {
      var s = document.createElement('p');
      s.className = 'resumo__sub';
      s.textContent = sub;
      div.appendChild(s);
    }
    return div;
  }

  function renderResumo(t, taxa) {
    el['resumo'].innerHTML = '';
    el['resumo'].appendChild(cartao(
      'A vender', Core.formatBRL(t.aVender),
      Core.formatARS(t.aVender, taxa) + ' · ' + (t.qtd - t.qtdVendida) + ' item(ns)'));
    el['resumo'].appendChild(cartao(
      'Já vendido', Core.formatBRL(t.vendido),
      Core.formatARS(t.vendido, taxa) + ' · ' + t.qtdVendida + ' item(ns)'));
    el['resumo'].appendChild(cartao(
      'Total do acervo', Core.formatBRL(t.bruto),
      Core.formatARS(t.bruto, taxa) + ' · ' + t.qtd + ' item(ns)'));
    el['resumo'].appendChild(cartao(
      'Valor de mercado', Core.formatBRL(t.mercado),
      Core.formatARS(t.mercado, taxa)));

    var reservados = ITEMS.filter(function (i) {
      return !i.vendido && (i.reservado === true ||
        (typeof RESERVAS === 'object' && RESERVAS[i.id]));
    });
    if (reservados.length) {
      var tr_ = Core.totais(reservados);
      el['resumo'].appendChild(cartao(
        'Reservado', Core.formatBRL(tr_.bruto),
        Core.formatARS(tr_.bruto, taxa) + ' · ' + tr_.qtd + ' item(ns)'));
    }

    var abatimento = t.mercado > 0 ? Math.round((t.economia / t.mercado) * 100) : 0;
    el['resumo'].appendChild(cartao(
      'Abaixo do mercado', Core.formatBRL(t.economia),
      '−' + abatimento + '% no total'));
  }

  function celula(texto, classe) {
    var td = document.createElement('td');
    if (classe) td.className = classe;
    td.textContent = texto;
    return td;
  }

  function linha(item, taxa) {
    var tr = document.createElement('tr');
    if (item.vendido) tr.className = 'tabela__vendido';

    var nome = celula(item.pt.titulo, 'tabela__nome');
    if (item.modelo) nome.title = item.modelo;
    tr.appendChild(nome);

    tr.appendChild(celula(item.categoria));

    var unidades = unidadesDe(item);
    tr.appendChild(celula(String(unidades), 'num'));

    /* Só em BRL: você pagou em reais, converter para ARS não diria nada. */
    tr.appendChild(celula(
      typeof item.precoCompra === 'number'
        ? Core.formatBRL(item.precoCompra * unidades)
        : '—', 'num'));

    var temPreco = Core.temPreco(item);
    tr.appendChild(celula(temPreco ? Core.formatBRL(item.preco * unidades) : '—', 'num'));
    tr.appendChild(celula(temPreco ? Core.formatARS(item.preco * unidades, taxa) : '—', 'num'));

    var desconto = Core.calcDesconto(item.preco, item.precoMercado);
    tr.appendChild(celula(
      item.precoMercado ? Core.formatBRL(item.precoMercado * unidades) : '—', 'num'));
    tr.appendChild(celula(
      item.precoMercado ? Core.formatARS(item.precoMercado * unidades, taxa) : '—', 'num'));
    tr.appendChild(celula(desconto === null ? '—' : '−' + desconto + '%', 'num'));

    var reserva = typeof RESERVAS === 'object' ? RESERVAS[item.id] : null;
    var reservado = !!reserva || item.reservado === true;

    var td = document.createElement('td');
    var selo = document.createElement('span');
    var estado = item.vendido ? 'vendido' : (reservado ? 'reservado' : 'disponivel');
    selo.className = 'selo selo--' + estado;
    selo.textContent = item.vendido ? 'Vendido' : (reservado ? 'Reservado' : 'Disponível');
    td.appendChild(selo);

    if (reserva) {
      var quem = document.createElement('span');
      quem.className = 'reserva__quem';
      quem.textContent = reserva.por + (reserva.em ? ' · ' + reserva.em : '');
      if (reserva.nota) quem.title = reserva.nota;
      td.appendChild(quem);
    } else if (item.reservado && !item.vendido) {
      /* Flag no items.js sem linha correspondente em reservas.js: o selo
         aparece pro comprador mas você não sabe de quem é. */
      var semNome = document.createElement('span');
      semNome.className = 'reserva__quem';
      semNome.textContent = 'sem nome registrado';
      td.appendChild(semNome);
    }
    tr.appendChild(td);

    return tr;
  }

  function unidadesDe(item) {
    return typeof item.qtd === 'number' && item.qtd > 0 ? item.qtd : 1;
  }

  /* A tabela mostra o total da linha, então ordena por total — não por preço
     unitário, senão uma linha de 2 unidades aparece fora de lugar. */
  function porTotalDesc(a, b) {
    if (a.vendido !== b.vendido) return a.vendido ? 1 : -1;
    return (b.preco * unidadesDe(b)) - (a.preco * unidadesDe(a));
  }

  function render() {
    var taxa = cotacao();
    var lista = ITEMS.slice().sort(porTotalDesc);

    renderResumo(Core.totais(ITEMS), taxa);

    el['tabela-corpo'].innerHTML = '';
    lista.forEach(function (item) {
      el['tabela-corpo'].appendChild(linha(item, taxa));
    });
  }

  /* ---------- init ---------- */

  function init() {
    cacheEls();
    bindGate();
    el['admin-cotacao'].value = CONFIG.cotacaoPadrao;
    el['admin-cotacao'].addEventListener('input', render);
    if (jaEntrou()) abrirPainel();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
