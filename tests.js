/* Harness minimalista: sem dependência, roda no navegador. */
(function () {
  var passed = 0;
  var failed = 0;
  var out = document.getElementById('results');

  function line(cls, text) {
    var div = document.createElement('div');
    div.className = cls;
    div.textContent = text;
    out.appendChild(div);
  }

  function eq(name, actual, expected) {
    var a = JSON.stringify(actual);
    var e = JSON.stringify(expected);
    if (a === e) {
      passed++;
      line('pass', 'PASS  ' + name);
    } else {
      failed++;
      line('fail', 'FAIL  ' + name + '\n      esperado: ' + e + '\n      obtido:   ' + a);
    }
  }

  window.eq = eq;

  window.runSuites = function (suites) {
    suites.forEach(function (fn) { fn(); });
    document.getElementById('summary').textContent =
      failed === 0
        ? 'TUDO VERDE — ' + passed + ' testes'
        : failed + ' FALHA(S) de ' + (passed + failed) + ' testes';
    document.getElementById('summary').className = failed === 0 ? 'pass' : 'fail';
  };

  // ---- Suites ----

  function suiteFormat() {
    eq('formatBRL inteiro', Core.formatBRL(3100), 'R$ 3.100');
    eq('formatBRL milhar alto', Core.formatBRL(1500000), 'R$ 1.500.000');
    eq('formatBRL arredonda centavos', Core.formatBRL(99.6), 'R$ 100');
    eq('formatARS converte', Core.formatARS(3100, 300), 'AR$ 930.000');
    eq('formatARS cotacao 500', Core.formatARS(3100, 500), 'AR$ 1.550.000');
  }

  function suiteDesconto() {
    eq('calcDesconto 3100/5000', Core.calcDesconto(3100, 5000), 38);
    eq('calcDesconto sem mercado', Core.calcDesconto(3100, undefined), null);
    eq('calcDesconto mercado igual', Core.calcDesconto(3100, 3100), null);
    eq('calcDesconto mercado menor', Core.calcDesconto(3100, 2000), null);
  }

  function suiteMedidas() {
    eq('medidasText completo', Core.medidasText({ f: 70, p: 74, a: 160 }), 'F 70 × P 74 × A 160 cm');
    eq('medidasText parcial', Core.medidasText({ f: 70, a: 160 }), 'F 70 × A 160 cm');
    eq('medidasText ausente', Core.medidasText(undefined), null);
    eq('medidasText vazio', Core.medidasText({}), null);
  }

  function suiteCotacao() {
    eq('parseCotacao numero', Core.parseCotacao('500', 300), 500);
    eq('parseCotacao decimal', Core.parseCotacao('312.5', 300), 312.5);
    eq('parseCotacao vazio', Core.parseCotacao('', 300), 300);
    eq('parseCotacao texto', Core.parseCotacao('abc', 300), 300);
    eq('parseCotacao zero', Core.parseCotacao('0', 300), 300);
    eq('parseCotacao negativo', Core.parseCotacao('-5', 300), 300);
  }

  function suiteI18n() {
    var keys = Object.keys(I18N.es).sort();
    var keysPt = Object.keys(I18N.pt).sort();
    eq('i18n es e pt tem as mesmas chaves', keysPt, keys);
    eq('i18n tem rotulo pra toda categoria',
      CATEGORIAS.filter(function (c) { return !I18N.es.cat[c] || !I18N.pt.cat[c]; }),
      []);
    eq('i18n aviso es menciona PIX credito',
      I18N.es.avisoCredito.indexOf('PIX crédito') >= 0, true);
    eq('i18n aviso pt menciona PIX credito',
      I18N.pt.avisoCredito.indexOf('PIX crédito') >= 0, true);
  }

  function suiteDados() {
    eq('config whatsapp', CONFIG.whatsapp, '5493415827248');
    eq('config cotacao padrao', CONFIG.cotacaoPadrao, 300);
    eq('items validos', Core.validateItems(ITEMS, CATEGORIAS), []);
    eq('ids unicos',
      ITEMS.length,
      new Set(ITEMS.map(function (i) { return i.id; })).size);
  }

  var FIXTURES = [
    { id: 'a', preco: 100, precoMercado: 200, categoria: 'casa',   vendido: false,
      modelo: 'ACME X1', es: { titulo: 'Silla café', desc: '' }, pt: { titulo: 'Cadeira café', desc: '' } },
    { id: 'b', preco: 300, precoMercado: 350, categoria: 'moveis', vendido: false,
      modelo: '',        es: { titulo: 'Mesa', desc: 'de madera' }, pt: { titulo: 'Mesa', desc: 'de madeira' } },
    { id: 'c', preco: 50,  categoria: 'casa', vendido: true,
      modelo: '',        es: { titulo: 'Lámpara', desc: '' }, pt: { titulo: 'Luminária', desc: '' } },
  ];

  function suiteBusca() {
    eq('normalize tira acento e caixa', Core.normalize('Lámpara CAFÉ'), 'lampara cafe');

    eq('filtro vazio devolve tudo',
      Core.filterItems(FIXTURES, { query: '', categoria: 'todos', lang: 'es' }).map(function (i) { return i.id; }),
      ['a', 'b', 'c']);

    eq('busca sem acento acha com acento',
      Core.filterItems(FIXTURES, { query: 'lampara', categoria: 'todos', lang: 'es' }).map(function (i) { return i.id; }),
      ['c']);

    eq('busca usa titulo do idioma ativo',
      Core.filterItems(FIXTURES, { query: 'luminaria', categoria: 'todos', lang: 'pt' }).map(function (i) { return i.id; }),
      ['c']);

    eq('busca nao acha titulo do outro idioma',
      Core.filterItems(FIXTURES, { query: 'luminaria', categoria: 'todos', lang: 'es' }).map(function (i) { return i.id; }),
      []);

    eq('busca casa com modelo',
      Core.filterItems(FIXTURES, { query: 'acme', categoria: 'todos', lang: 'es' }).map(function (i) { return i.id; }),
      ['a']);

    eq('busca casa com descricao',
      Core.filterItems(FIXTURES, { query: 'madera', categoria: 'todos', lang: 'es' }).map(function (i) { return i.id; }),
      ['b']);

    eq('filtro por categoria',
      Core.filterItems(FIXTURES, { query: '', categoria: 'casa', lang: 'es' }).map(function (i) { return i.id; }),
      ['a', 'c']);

    eq('categoriasUsadas ignora as sem item',
      Core.categoriasUsadas(FIXTURES),
      ['casa', 'moveis']);
  }

  function suiteOrdem() {
    eq('ordena por menor preco, vendido no fim',
      Core.sortItems(FIXTURES, 'preco-asc').map(function (i) { return i.id; }),
      ['a', 'b', 'c']);

    eq('ordena por maior preco, vendido no fim',
      Core.sortItems(FIXTURES, 'preco-desc').map(function (i) { return i.id; }),
      ['b', 'a', 'c']);

    eq('ordena por maior desconto, vendido no fim',
      Core.sortItems(FIXTURES, 'desconto-desc').map(function (i) { return i.id; }),
      ['a', 'b', 'c']);

    eq('sortItems nao muta o array original',
      FIXTURES.map(function (i) { return i.id; }),
      ['a', 'b', 'c']);
  }

  function suiteWhats() {
    var item = { preco: 3100, es: { titulo: 'Heladera No Frost' }, pt: { titulo: 'Geladeira No Frost' } };

    eq('link es',
      Core.waLink(item, 'es', '5493415827248'),
      'https://wa.me/5493415827248?text=' + encodeURIComponent('Hola! Me interesa: Heladera No Frost (R$ 3.100)'));

    eq('link pt',
      Core.waLink(item, 'pt', '5493415827248'),
      'https://wa.me/5493415827248?text=' + encodeURIComponent('Olá! Tenho interesse em: Geladeira No Frost (R$ 3.100)'));
  }

  function suiteConteudo() {
    eq('mercado tem rotulo novo', I18N.es.mercado, 'Valor de mercado:');
    eq('referencia es', I18N.es.referencia, 'Ver referencia');
    eq('referencia pt', I18N.pt.referencia, 'Ver referência');

    eq('medidas rotulo es', I18N.es.medidasRotulo, 'Medidas:');
    eq('descricao da geladeira es',
      ITEMS.filter(function (i) { return i.id === 'heladera-drean-hdr420'; })[0].es.desc,
      'En perfecto estado de funcionamiento.');

    eq('aviso es cita Brubank', I18N.es.avisoMercadoPago.indexOf('Brubank') >= 0, true);
    eq('aviso pt cita Brubank', I18N.pt.avisoMercadoPago.indexOf('Brubank') >= 0, true);

    eq('toda foto e um caminho relativo dentro de images/',
      ITEMS.flatMap(function (i) { return i.fotos || []; })
        .filter(function (f) { return typeof f !== 'string' || f.indexOf('images/') !== 0; }),
      []);

    eq('linkMercado, quando presente, e https',
      ITEMS.filter(function (i) { return i.linkMercado !== undefined; })
        .filter(function (i) { return String(i.linkMercado).indexOf('https://') !== 0; })
        .map(function (i) { return i.id; }),
      []);

    eq('geladeira tem 3 fotos',
      (ITEMS.filter(function (i) { return i.id === 'heladera-drean-hdr420'; })[0].fotos || []).length,
      3);
  }

  function suiteControles() {
    eq('verFull es', I18N.es.verFull, 'Ver en pantalla completa');
    eq('verFull pt', I18N.pt.verFull, 'Ver em tela cheia');
  }

  function suiteTotais() {
    var lote = [
      { id: 'a', preco: 100, vendido: false },
      { id: 'b', preco: 300, vendido: true },
      { id: 'c', preco: 50,  vendido: false, qtd: 2 },
    ];

    eq('totais bruto conta unidades', Core.totais(lote).bruto, 500);
    eq('totais vendido', Core.totais(lote).vendido, 300);
    eq('totais a vender', Core.totais(lote).aVender, 200);
    eq('totais quantidade conta unidades', Core.totais(lote).qtd, 4);
    eq('totais quantidade vendida', Core.totais(lote).qtdVendida, 1);
    eq('qtd ausente vale um', Core.totais([{ id: 'z', preco: 10, vendido: false }]).qtd, 1);
    eq('precoCombo nao entra no total',
      Core.totais([{ id: 'z', preco: 10, qtd: 2, precoCombo: 15, vendido: false }]).bruto, 20);
    eq('bruto e a soma das partes',
      Core.totais(lote).vendido + Core.totais(lote).aVender,
      Core.totais(lote).bruto);
    eq('totais de lista vazia',
      Core.totais([]),
      { qtd: 0, qtdVendida: 0, bruto: 0, vendido: 0, aVender: 0 });
    eq('totais ignora preco invalido', Core.totais([{ id: 'x', vendido: false }]).bruto, 0);
  }

  runSuites([suiteFormat, suiteDesconto, suiteMedidas, suiteCotacao,
             suiteI18n, suiteDados, suiteBusca, suiteOrdem, suiteWhats, suiteConteudo,
             suiteControles, suiteTotais]);
})();
