/* Funções puras. Sem DOM, sem estado global. Testadas em tests.html. */
var Core = (function () {
  var brlFmt = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  var arsFmt = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  /* Intl usa espaço inquebrável entre símbolo e número; normaliza pra
     espaço comum para o texto ficar previsível em teste e em busca. */
  function nbsp(s) {
    return s.replace(/\u00A0/g, ' ');
  }

  function formatBRL(brl) {
    return nbsp(brlFmt.format(Math.round(brl)));
  }

  function formatARS(brl, cotacao) {
    return 'AR$ ' + nbsp(arsFmt.format(Math.round(brl * cotacao)));
  }

  function calcDesconto(preco, precoMercado) {
    if (typeof precoMercado !== 'number' || precoMercado <= preco) return null;
    return Math.round((1 - preco / precoMercado) * 100);
  }

  function medidasText(medidas) {
    if (!medidas) return null;
    var partes = [];
    if (typeof medidas.f === 'number') partes.push('F ' + medidas.f);
    if (typeof medidas.p === 'number') partes.push('P ' + medidas.p);
    if (typeof medidas.a === 'number') partes.push('A ' + medidas.a);
    if (partes.length === 0) return null;
    return partes.join(' × ') + ' cm';
  }

  function parseCotacao(raw, fallback) {
    var n = parseFloat(String(raw).replace(',', '.'));
    if (!isFinite(n) || n <= 0) return fallback;
    return n;
  }

  return {
    formatBRL: formatBRL,
    formatARS: formatARS,
    calcDesconto: calcDesconto,
    medidasText: medidasText,
    parseCotacao: parseCotacao,
  };
})();
