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

  runSuites([suiteFormat, suiteDesconto, suiteMedidas, suiteCotacao]);
})();
