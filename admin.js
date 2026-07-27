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

    var unidades = typeof item.qtd === 'number' && item.qtd > 0 ? item.qtd : 1;
    tr.appendChild(celula(String(unidades), 'num'));

    tr.appendChild(celula(Core.formatBRL(item.preco * unidades), 'num'));
    tr.appendChild(celula(Core.formatARS(item.preco * unidades, taxa), 'num'));

    var td = document.createElement('td');
    var selo = document.createElement('span');
    selo.className = 'selo selo--' + (item.vendido ? 'vendido' : 'disponivel');
    selo.textContent = item.vendido ? 'Vendido' : 'Disponível';
    td.appendChild(selo);
    tr.appendChild(td);

    return tr;
  }

  function render() {
    var taxa = cotacao();
    var lista = Core.sortItems(ITEMS, 'preco-desc');

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
