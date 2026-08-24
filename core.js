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

  /* Item sem preço definido ainda: o card mostra "a combinar" em vez de um
     valor, e ele vale zero em qualquer soma ou ordenação. */
  function temPreco(item) {
    return typeof item.preco === 'number' && item.preco > 0;
  }

  function precoDe(item) {
    return temPreco(item) ? item.preco : 0;
  }

  function validateItems(items, categorias) {
    var problemas = [];
    items.forEach(function (item, i) {
      var onde = 'item[' + i + '] ' + (item.id || '(sem id)');
      if (!item.id) problemas.push(onde + ': falta id');
      if (item.preco !== undefined && (typeof item.preco !== 'number' || item.preco <= 0)) {
        problemas.push(onde + ': preco inválido');
      }
      if (categorias.indexOf(item.categoria) === -1) problemas.push(onde + ': categoria desconhecida "' + item.categoria + '"');
      if (typeof item.vendido !== 'boolean') problemas.push(onde + ': vendido precisa ser true/false');
      if (item.qtd !== undefined &&
          (typeof item.qtd !== 'number' || item.qtd < 1 || item.qtd % 1 !== 0)) {
        problemas.push(onde + ': qtd precisa ser um inteiro >= 1');
      }
      if (item.precoCombo !== undefined && !(item.qtd > 1)) {
        problemas.push(onde + ': precoCombo só faz sentido com qtd > 1');
      }
      /* precoCompra é por unidade, como preco — a tabela do painel multiplica
         pela quantidade para mostrar o total da linha. */
      if (item.precoCompra !== undefined &&
          (typeof item.precoCompra !== 'number' || item.precoCompra <= 0)) {
        problemas.push(onde + ': precoCompra inválido');
      }
      ['es', 'pt'].forEach(function (lang) {
        if (!item[lang] || !item[lang].titulo) problemas.push(onde + ': falta titulo em ' + lang);
      });
    });
    return problemas;
  }

  function normalize(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function filterItems(items, opts) {
    var q = normalize(opts.query);
    var cat = opts.categoria || 'todos';
    var lang = opts.lang;
    return items.filter(function (item) {
      if (cat !== 'todos' && item.categoria !== cat) return false;
      if (!q) return true;
      var t = item[lang] || {};
      var haystack = normalize([t.titulo, t.desc, item.modelo].join(' '));
      return haystack.indexOf(q) !== -1;
    });
  }

  /* Disponível, reservado, vendido — nessa ordem, antes de qualquer
     ordenação. Reservado fica no meio porque quem reservou pode desistir:
     ainda vale mostrar antes do que já saiu. */
  function faixa(item) {
    if (item.vendido) return 2;
    return item.reservado ? 1 : 0;
  }

  function sortItems(items, mode) {
    var copia = items.slice();
    copia.sort(function (a, b) {
      var fa = faixa(a);
      var fb = faixa(b);
      if (fa !== fb) return fa - fb;
      if (mode === 'preco-desc') return precoDe(b) - precoDe(a);
      if (mode === 'desconto-desc') {
        var da = calcDesconto(a.preco, a.precoMercado) || 0;
        var db = calcDesconto(b.preco, b.precoMercado) || 0;
        return db - da;
      }
      return precoDe(a) - precoDe(b); // 'preco-asc' é o padrão
    });
    return copia;
  }

  function categoriasUsadas(items) {
    var vistas = [];
    items.forEach(function (item) {
      if (vistas.indexOf(item.categoria) === -1) vistas.push(item.categoria);
    });
    return vistas.sort();
  }

  function waLink(item, lang, phone) {
    var t = I18N[lang];
    var titulo = (item[lang] || {}).titulo || '';
    var msg = t.msgWhats + titulo;
    if (temPreco(item)) msg += ' (' + formatBRL(item.preco) + ')';
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  /* Pagamento pendente. O mapa em reservas.js lista o que ainda não entrou:
     estar lá é a dívida, e quitar é apagar a linha. `valor` cobre o caso de
     uma linha vendida em parcelas — as taças saíram 2 avulsas e 6 no combo,
     mas viraram uma entrada só. */
  function faltaPagar(item, pagamentos) {
    var p = pagamentos && pagamentos[item.id];
    if (!p) return 0;
    if (typeof p.valor === 'number') return p.valor;
    var unidades = typeof item.qtd === 'number' && item.qtd > 0 ? item.qtd : 1;
    return precoDe(item) * unidades;
  }

  function totalEmAberto(items, pagamentos) {
    return items.reduce(function (soma, item) {
      return soma + faltaPagar(item, pagamentos);
    }, 0);
  }

  function totais(items) {
    var t = { qtd: 0, qtdVendida: 0, bruto: 0, vendido: 0, aVender: 0, mercado: 0, economia: 0 };
    items.forEach(function (item) {
      var preco = precoDe(item);
      var unidades = typeof item.qtd === 'number' && item.qtd > 0 ? item.qtd : 1;
      var valor = preco * unidades;
      /* Item sem valor de mercado conta pelo próprio preço, então não infla
         a economia com um desconto que ninguém mediu. */
      var mercado = typeof item.precoMercado === 'number' ? item.precoMercado : preco;
      t.qtd += unidades;
      t.bruto += valor;
      t.mercado += mercado * unidades;
      if (item.vendido) {
        t.qtdVendida += unidades;
        t.vendido += valor;
      } else {
        t.aVender += valor;
      }
    });
    t.economia = t.mercado - t.bruto;
    return t;
  }

  return {
    formatBRL: formatBRL,
    formatARS: formatARS,
    calcDesconto: calcDesconto,
    medidasText: medidasText,
    parseCotacao: parseCotacao,
    validateItems: validateItems,
    temPreco: temPreco,
    precoDe: precoDe,
    normalize: normalize,
    filterItems: filterItems,
    sortItems: sortItems,
    categoriasUsadas: categoriasUsadas,
    waLink: waLink,
    faltaPagar: faltaPagar,
    totalEmAberto: totalEmAberto,
    totais: totais,
  };
})();
