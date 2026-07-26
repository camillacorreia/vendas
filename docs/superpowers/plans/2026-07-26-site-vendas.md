# Site de Vendas Bilíngue — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static GitHub Pages site listing used items for sale, bilingual ES/PT, with BRL prices converted to ARS through a visitor-editable exchange rate.

**Architecture:** Plain HTML/CSS/JS, no build step, no dependencies, no CDN. Pure logic lives in `core.js` and is unit-tested by a zero-dependency browser harness (`tests.html`). DOM work lives in `app.js`. Data lives in `items.js` and `i18n.js` as plain global consts, loaded via `<script>` so the site works from `file://`.

**Tech Stack:** HTML5, CSS3 (custom properties, grid), vanilla ES2020, `Intl.NumberFormat`, `localStorage`. No package manager, no node_modules.

## Global Constraints

- No external dependencies, no CDN, no build step. Everything must work by opening `index.html` from `file://`.
- No ES modules (`type="module"` breaks under `file://`). Use classic `<script>` tags and globals.
- Prices are stored in BRL only. Every ARS figure is computed as `brl * cotacao`.
- Default language is **es**. Second language is **pt**. No other languages.
- `CONFIG.whatsapp` is exactly `"5493415827248"`.
- `CONFIG.cotacaoPadrao` is exactly `300`.
- Sold items always render last, regardless of the selected sort.
- BRL format: `R$ 3.100` (pt-BR, no decimals). ARS format: `AR$ 930.000` (es-AR grouping, no decimals).
- Every optional item field that is absent must not render an empty element.
- Spec of record: `docs/superpowers/specs/2026-07-26-site-vendas-design.md`.

---

### Task 1: Test harness + pure formatting/derivation functions

**Files:**
- Create: `core.js`
- Create: `tests.js`
- Create: `tests.html`
- Create: `run-tests.js`

**Interfaces:**
- Consumes: nothing.
- Produces: global `Core` object with `formatBRL(brl) -> string`, `formatARS(brl, cotacao) -> string`, `calcDesconto(preco, precoMercado) -> number|null`, `medidasText(medidas) -> string|null`, `parseCotacao(raw, fallback) -> number`.

- [ ] **Step 1: Write the failing test**

Create `tests.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Testes — core.js</title>
  <style>
    body { font-family: ui-monospace, monospace; padding: 24px; background: #111; color: #eee; }
    .pass { color: #4ade80; }
    .fail { color: #f87171; font-weight: bold; }
    #summary { font-size: 20px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div id="summary">rodando…</div>
  <div id="results"></div>

  <script src="i18n.js"></script>
  <script src="items.js"></script>
  <script src="core.js"></script>
  <script src="tests.js"></script>
</body>
</html>
```

Create `tests.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Also create `run-tests.js`, so the same suite runs headlessly from a terminal.
It stubs the handful of DOM calls `tests.js` makes; the site itself never
loads it and stays dependency-free.

```js
#!/usr/bin/env node
/* Roda a mesma suíte de tests.html fora do navegador, com um stub mínimo
   de DOM. Só para desenvolvimento — o site não usa Node em momento algum.
   Uso: node run-tests.js   (sai com código 1 se algum teste falhar) */
const fs = require('fs');
const vm = require('vm');

function makeNode() {
  return {
    className: '',
    textContent: '',
    children: [],
    appendChild(child) { this.children.push(child); },
  };
}

const nodes = { results: makeNode(), summary: makeNode() };
const linhas = [];

const documentStub = {
  getElementById: (id) => nodes[id],
  createElement: () => {
    const n = makeNode();
    linhas.push(n);
    return n;
  },
};

const sandbox = { document: documentStub, console };
sandbox.window = sandbox;
vm.createContext(sandbox);

const arquivos = ['i18n.js', 'items.js', 'core.js', 'tests.js'];
for (const f of arquivos) {
  if (!fs.existsSync(f)) {
    console.error('faltando: ' + f);
    process.exit(1);
  }
  vm.runInContext(fs.readFileSync(f, 'utf8'), sandbox, { filename: f });
}

for (const n of linhas) console.log(n.textContent);
console.log(nodes.summary.textContent);
process.exit(nodes.summary.className === 'fail' ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node run-tests.js`
Expected: exits non-zero. Because `i18n.js`, `items.js` and `core.js` do not
exist yet, the output is `faltando: i18n.js`.

To keep the loop unblocked until Task 2 lands the data files, create two
temporary stubs now and delete them at the start of Task 2:

```bash
printf 'var I18N = {};\n' > i18n.js
printf 'var CONFIG = {}; var CATEGORIAS = []; var ITEMS = [];\n' > items.js
node run-tests.js
```

Expected now: `ReferenceError: Core is not defined` thrown from `tests.js`.

- [ ] **Step 3: Write minimal implementation**

Create `core.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node run-tests.js`
Expected: exit code 0, 19 lines prefixed `PASS`, last line `TUDO VERDE — 19 testes`.

Then confirm the browser harness agrees: `open tests.html`
Expected: green summary with the same 19 tests.

- [ ] **Step 5: Commit**

```bash
git add core.js tests.js tests.html run-tests.js i18n.js items.js
git commit -m "feat: add pure formatting helpers and test harness"
```

---

### Task 2: Data files — i18n strings and item catalog

**Files:**
- Create: `i18n.js`
- Create: `items.js`
- Modify: `tests.js` (add data-integrity suite)
- Modify: `core.js` (add `validateItems`)

**Interfaces:**
- Consumes: `Core` from Task 1.
- Produces: globals `I18N` (keyed `es`/`pt`), `CONFIG` (`{ whatsapp, cotacaoPadrao }`), `CATEGORIAS` (array of category ids), `ITEMS` (array of item objects). Adds `Core.validateItems(items, categorias) -> string[]` returning a list of problem descriptions (empty array when clean).

- [ ] **Step 1: Write the failing test**

Append to `tests.js`, immediately before the `runSuites([...])` call, and add the two new suite names to that call:

```js
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
```

The `runSuites` call becomes:

```js
  runSuites([suiteFormat, suiteDesconto, suiteMedidas, suiteCotacao, suiteI18n, suiteDados]);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node run-tests.js`
Expected: exit code 1. With the Task 1 stub files still in place, the failures
are `i18n es e pt tem as mesmas chaves` and the rest of the two new suites.

- [ ] **Step 3: Write minimal implementation**

Create `i18n.js`:

```js
/* Textos de interface. Só dados — nenhuma lógica aqui. */
var I18N = {
  es: {
    htmlLang: 'es',
    tituloPagina: 'Ventas',
    subtitulo: 'Artículos usados en excelente estado',
    avisoCotacao: 'Cotización de referencia (sujeta a variación):',
    avisoResetar: 'Restablecer',
    avisoPix: 'Acepto únicamente pagos en reales brasileños (BRL) mediante PIX.',
    avisoCredito: 'También acepto PIX crédito, con opción de pago en cuotas.',
    avisoMercadoPago: 'Para compradores en Argentina, es posible pagar por PIX usando la app de Mercado Pago.',
    avisoAno: 'Todos los ítems fueron comprados en 2024.',
    buscarPlaceholder: 'Buscar…',
    buscarLabel: 'Buscar artículos',
    todos: 'Todos',
    ordenar: 'Orden:',
    ordPrecoAsc: 'Menor precio',
    ordPrecoDesc: 'Mayor precio',
    ordDescontoDesc: 'Mayor descuento',
    mercado: 'Mercado:',
    comprado: 'Comprado en',
    vendido: 'VENDIDO',
    contato: 'Consultar por WhatsApp',
    vazio: 'No se encontró nada.',
    limpar: 'Limpiar filtros',
    semItens: 'No hay artículos por el momento.',
    medidasTitulo: 'Frente × Profundidad × Altura',
    fecharFoto: 'Cerrar',
    fotoAnterior: 'Foto anterior',
    fotoSeguinte: 'Foto siguiente',
    trocarIdioma: 'Cambiar idioma',
    msgWhats: 'Hola! Me interesa: ',
    cat: {
      eletrodomesticos: 'Electrodomésticos',
      moveis: 'Muebles',
      eletronicos: 'Electrónica',
      casa: 'Hogar',
      outros: 'Otros',
    },
  },
  pt: {
    htmlLang: 'pt-BR',
    tituloPagina: 'Vendas',
    subtitulo: 'Itens usados em ótimo estado',
    avisoCotacao: 'Cotação de referência (sujeita a variação):',
    avisoResetar: 'Restaurar',
    avisoPix: 'Aceito apenas pagamentos em reais (BRL) via PIX.',
    avisoCredito: 'Também aceito PIX crédito, com opção de parcelamento.',
    avisoMercadoPago: 'Para compradores na Argentina, dá pra pagar por PIX pelo app do Mercado Pago.',
    avisoAno: 'Todos os itens foram comprados em 2024.',
    buscarPlaceholder: 'Buscar…',
    buscarLabel: 'Buscar itens',
    todos: 'Todos',
    ordenar: 'Ordenar:',
    ordPrecoAsc: 'Menor preço',
    ordPrecoDesc: 'Maior preço',
    ordDescontoDesc: 'Maior desconto',
    mercado: 'Mercado:',
    comprado: 'Comprado em',
    vendido: 'VENDIDO',
    contato: 'Falar no WhatsApp',
    vazio: 'Nada encontrado.',
    limpar: 'Limpar filtros',
    semItens: 'Nenhum item no momento.',
    medidasTitulo: 'Frente × Profundidade × Altura',
    fecharFoto: 'Fechar',
    fotoAnterior: 'Foto anterior',
    fotoSeguinte: 'Próxima foto',
    trocarIdioma: 'Trocar idioma',
    msgWhats: 'Olá! Tenho interesse em: ',
    cat: {
      eletrodomesticos: 'Eletrodomésticos',
      moveis: 'Móveis',
      eletronicos: 'Eletrônicos',
      casa: 'Casa',
      outros: 'Outros',
    },
  },
};
```

Create `items.js`:

```js
/* ============================================================
   ÚNICO ARQUIVO QUE VOCÊ EDITA NO DIA A DIA.
   Instruções completas no README.md.
   ============================================================ */

var CONFIG = {
  whatsapp: '5493415827248',  // DDI 54 + 9 (celular AR) + área 341 + número
  cotacaoPadrao: 300,         // 1 BRL = N ARS
};

var CATEGORIAS = ['eletrodomesticos', 'moveis', 'eletronicos', 'casa', 'outros'];

var ITEMS = [
  {
    id: 'heladera-drean-hdr420',
    modelo: 'Drean HDR420N30B',
    preco: 3100,
    precoMercado: 5000,
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    medidas: { f: 70, p: 74, a: 160 },
    fotos: ['images/heladera-drean-1.jpg'],
    es: {
      titulo: 'Heladera No Frost 420 Lts Blanca',
      desc: 'Comprada en 2024, en perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Geladeira No Frost 420 Lts Branca',
      desc: 'Comprada em 2024, em perfeito estado de funcionamento.',
    },
  },

  /* ---- MODELO PARA COPIAR ----
  {
    id: 'identificador-unico',
    modelo: 'Marca Modelo',            // opcional
    preco: 0,                          // BRL, obrigatório
    precoMercado: 0,                   // BRL, opcional
    ano: 2024,                         // opcional
    categoria: 'outros',               // ver CATEGORIAS acima
    vendido: false,
    medidas: { f: 0, p: 0, a: 0 },     // cm, opcional
    fotos: ['images/arquivo.jpg'],     // opcional
    es: { titulo: '', desc: '' },
    pt: { titulo: '', desc: '' },
  },
  ---------------------------- */
];
```

Add `validateItems` to `core.js`, inside the IIFE before the `return`:

```js
  function validateItems(items, categorias) {
    var problemas = [];
    items.forEach(function (item, i) {
      var onde = 'item[' + i + '] ' + (item.id || '(sem id)');
      if (!item.id) problemas.push(onde + ': falta id');
      if (typeof item.preco !== 'number' || item.preco <= 0) problemas.push(onde + ': preco inválido');
      if (categorias.indexOf(item.categoria) === -1) problemas.push(onde + ': categoria desconhecida "' + item.categoria + '"');
      if (typeof item.vendido !== 'boolean') problemas.push(onde + ': vendido precisa ser true/false');
      ['es', 'pt'].forEach(function (lang) {
        if (!item[lang] || !item[lang].titulo) problemas.push(onde + ': falta titulo em ' + lang);
      });
    });
    return problemas;
  }
```

and add it to the returned object:

```js
    validateItems: validateItems,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node run-tests.js`
Expected: exit code 0, last line `TUDO VERDE — 27 testes`.

- [ ] **Step 5: Commit**

```bash
git add i18n.js items.js core.js tests.js
git commit -m "feat: add i18n strings, item catalog and data validation"
```

---

### Task 3: Search, filter and sort logic

**Files:**
- Modify: `core.js`
- Modify: `tests.js`

**Interfaces:**
- Consumes: `Core`, `ITEMS`, `CATEGORIAS` from Tasks 1-2.
- Produces: `Core.normalize(s) -> string`, `Core.filterItems(items, {query, categoria, lang}) -> item[]`, `Core.sortItems(items, mode) -> item[]` where `mode` is one of `'preco-asc' | 'preco-desc' | 'desconto-desc'`, `Core.categoriasUsadas(items) -> string[]`.

- [ ] **Step 1: Write the failing test**

Append to `tests.js` before `runSuites`, and add `suiteBusca` and `suiteOrdem` to the `runSuites` array:

```js
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
```

The `runSuites` call becomes:

```js
  runSuites([suiteFormat, suiteDesconto, suiteMedidas, suiteCotacao,
             suiteI18n, suiteDados, suiteBusca, suiteOrdem]);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node run-tests.js`
Expected: exit code 1, `TypeError: Core.normalize is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `core.js`, inside the IIFE before the `return`:

```js
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

  function sortItems(items, mode) {
    var copia = items.slice();
    copia.sort(function (a, b) {
      /* Vendido sempre por último, qualquer que seja a ordenação. */
      if (a.vendido !== b.vendido) return a.vendido ? 1 : -1;
      if (mode === 'preco-desc') return b.preco - a.preco;
      if (mode === 'desconto-desc') {
        var da = calcDesconto(a.preco, a.precoMercado) || 0;
        var db = calcDesconto(b.preco, b.precoMercado) || 0;
        return db - da;
      }
      return a.preco - b.preco; // 'preco-asc' é o padrão
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
```

and extend the returned object:

```js
    normalize: normalize,
    filterItems: filterItems,
    sortItems: sortItems,
    categoriasUsadas: categoriasUsadas,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node run-tests.js`
Expected: exit code 0, last line `TUDO VERDE — 40 testes`.

- [ ] **Step 5: Commit**

```bash
git add core.js tests.js
git commit -m "feat: add accent-insensitive search, category filter and sorting"
```

---

### Task 4: WhatsApp link builder

**Files:**
- Modify: `core.js`
- Modify: `tests.js`

**Interfaces:**
- Consumes: `Core`, `I18N`, `CONFIG`.
- Produces: `Core.waLink(item, lang, phone) -> string`.

- [ ] **Step 1: Write the failing test**

Append to `tests.js` before `runSuites`, and add `suiteWhats` to the array:

```js
  function suiteWhats() {
    var item = { preco: 3100, es: { titulo: 'Heladera No Frost' }, pt: { titulo: 'Geladeira No Frost' } };

    eq('link es',
      Core.waLink(item, 'es', '5493415827248'),
      'https://wa.me/5493415827248?text=' + encodeURIComponent('Hola! Me interesa: Heladera No Frost (R$ 3.100)'));

    eq('link pt',
      Core.waLink(item, 'pt', '5493415827248'),
      'https://wa.me/5493415827248?text=' + encodeURIComponent('Olá! Tenho interesse em: Geladeira No Frost (R$ 3.100)'));
  }
```

The `runSuites` call becomes:

```js
  runSuites([suiteFormat, suiteDesconto, suiteMedidas, suiteCotacao,
             suiteI18n, suiteDados, suiteBusca, suiteOrdem, suiteWhats]);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node run-tests.js`
Expected: exit code 1, `TypeError: Core.waLink is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `core.js`, inside the IIFE before the `return`:

```js
  function waLink(item, lang, phone) {
    var t = I18N[lang];
    var titulo = (item[lang] || {}).titulo || '';
    var msg = t.msgWhats + titulo + ' (' + formatBRL(item.preco) + ')';
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }
```

and add to the returned object:

```js
    waLink: waLink,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node run-tests.js`
Expected: exit code 0, last line `TUDO VERDE — 42 testes`.

- [ ] **Step 5: Commit**

```bash
git add core.js tests.js
git commit -m "feat: build prefilled WhatsApp links per item and language"
```

---

### Task 5: Page shell — HTML structure and stylesheet

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `images/.gitkeep`

**Interfaces:**
- Consumes: nothing at runtime yet (scripts load, but `app.js` comes in Task 6).
- Produces: DOM contract used by every later task — element ids `#lang-es`, `#lang-pt`, `#cotacao`, `#cotacao-reset`, `#busca`, `#chips`, `#ordem`, `#grid`, `#vazio`, `#limpar`, `#lightbox`, `#lightbox-img`, `#lightbox-prev`, `#lightbox-next`, `#lightbox-close`, and the `data-i18n` attribute convention (`<span data-i18n="avisoPix"></span>` gets its `textContent` from `I18N[lang].avisoPix`).

- [ ] **Step 1: Write the failing test**

This task's deliverable is markup and styling; the assertion is visual. Write down the acceptance criteria first, then build to them:

1. Opening `index.html` from `file://` shows header, notice block, controls and an empty grid area — no JS errors in the console.
2. At 375px wide there is no horizontal scrollbar.
3. The notice block shows the five lines of text and a number input pre-filled with `300`.

- [ ] **Step 2: Run test to verify it fails**

Run: `open index.html`
Expected: the file does not exist — macOS shows "The file … does not exist."

- [ ] **Step 3: Write minimal implementation**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ventas</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="header">
    <div class="header__inner">
      <h1 class="header__title" data-i18n="tituloPagina">Ventas</h1>
      <nav class="langs" aria-label="Idioma">
        <button id="lang-es" class="lang is-active" type="button" lang="es">ES</button>
        <button id="lang-pt" class="lang" type="button" lang="pt">PT</button>
      </nav>
    </div>
  </header>

  <main class="wrap">

    <p class="subtitulo" data-i18n="subtitulo">Artículos usados en excelente estado</p>

    <section class="aviso" aria-live="polite">
      <p class="aviso__cotacao">
        <strong data-i18n="avisoCotacao">Cotización de referencia (sujeta a variación):</strong>
        <input id="cotacao" class="aviso__input" type="number" inputmode="decimal"
               min="1" step="1" value="300" aria-label="Cotización BRL a ARS">
        <button id="cotacao-reset" class="btn-link" type="button" data-i18n="avisoResetar">Restablecer</button>
      </p>
      <p><span aria-hidden="true">✅</span> <span data-i18n="avisoPix"></span></p>
      <p><span aria-hidden="true">💳</span> <span data-i18n="avisoCredito"></span></p>
      <p><span aria-hidden="true">🇦🇷</span> <span data-i18n="avisoMercadoPago"></span></p>
      <p><span aria-hidden="true">📅</span> <span data-i18n="avisoAno"></span></p>
    </section>

    <section class="controles">
      <input id="busca" class="busca" type="search" autocomplete="off">
      <div id="chips" class="chips" role="group"></div>
      <label class="ordem">
        <span data-i18n="ordenar">Orden:</span>
        <select id="ordem">
          <option value="preco-asc"></option>
          <option value="preco-desc"></option>
          <option value="desconto-desc"></option>
        </select>
      </label>
    </section>

    <div id="grid" class="grid"></div>

    <div id="vazio" class="vazio" hidden>
      <p data-i18n="vazio">No se encontró nada.</p>
      <button id="limpar" class="btn-link" type="button" data-i18n="limpar">Limpiar filtros</button>
    </div>

  </main>

  <div id="lightbox" class="lightbox" hidden role="dialog" aria-modal="true">
    <button id="lightbox-close" class="lightbox__close" type="button">✕</button>
    <button id="lightbox-prev" class="lightbox__nav lightbox__nav--prev" type="button">‹</button>
    <img id="lightbox-img" class="lightbox__img" alt="">
    <button id="lightbox-next" class="lightbox__nav lightbox__nav--next" type="button">›</button>
  </div>

  <script src="i18n.js"></script>
  <script src="items.js"></script>
  <script src="core.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

Create `style.css`:

```css
:root {
  --bg: #fafaf9;
  --surface: #ffffff;
  --border: #e7e5e4;
  --text: #1c1917;
  --muted: #78716c;
  --accent: #25d366;
  --accent-ink: #0b3d1d;
  --danger: #dc2626;
  --radius: 12px;
  --shadow: 0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.06);
  --shadow-hover: 0 2px 4px rgba(0,0,0,.06), 0 12px 24px rgba(0,0,0,.10);
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px 64px; }

/* ---------- header ---------- */
.header {
  position: sticky; top: 0; z-index: 10;
  background: rgba(250,250,249,.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.header__inner {
  max-width: 1100px; margin: 0 auto; padding: 12px 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.header__title { font-size: 20px; margin: 0; letter-spacing: -.01em; }

.langs { display: flex; gap: 4px; }
.lang {
  border: 1px solid var(--border); background: var(--surface); color: var(--muted);
  border-radius: 999px; padding: 4px 12px; font: inherit; font-size: 13px;
  cursor: pointer; transition: background .15s, color .15s;
}
.lang.is-active { background: var(--text); color: #fff; border-color: var(--text); }

.subtitulo { color: var(--muted); margin: 24px 0 16px; }

/* ---------- aviso ---------- */
.aviso {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px 20px; box-shadow: var(--shadow);
  font-size: 14px;
}
.aviso p { margin: 6px 0; }
.aviso__cotacao { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.aviso__input {
  width: 96px; padding: 4px 8px; font: inherit;
  border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
}
.aviso__input.is-invalid { border-color: var(--danger); background: #fef2f2; }

.btn-link {
  background: none; border: none; padding: 0; font: inherit; font-size: 13px;
  color: var(--muted); text-decoration: underline; cursor: pointer;
}

/* ---------- controles ---------- */
.controles {
  display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
  margin: 24px 0 16px;
}
.busca {
  flex: 1 1 220px; min-width: 0;
  padding: 10px 14px; font: inherit;
  border: 1px solid var(--border); border-radius: 999px; background: var(--surface);
}
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  border: 1px solid var(--border); background: var(--surface); color: var(--muted);
  border-radius: 999px; padding: 6px 14px; font: inherit; font-size: 13px;
  cursor: pointer; transition: background .15s, color .15s;
}
.chip.is-active { background: var(--text); color: #fff; border-color: var(--text); }
.ordem { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--muted); }
.ordem select {
  font: inherit; padding: 8px 10px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
}

/* ---------- grid ---------- */
.grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 960px)  { .grid { grid-template-columns: repeat(3, 1fr); } }

.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow);
  display: flex; flex-direction: column;
  animation: fade-in .3s ease both;
  transition: transform .15s, box-shadow .15s;
}
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }

@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.card__media { position: relative; aspect-ratio: 4 / 3; background: #f5f5f4; cursor: zoom-in; }
.card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card__placeholder {
  width: 100%; height: 100%; display: grid; place-items: center;
  color: #d6d3d1; font-size: 40px;
}
.card__count {
  position: absolute; right: 8px; bottom: 8px;
  background: rgba(0,0,0,.6); color: #fff; font-size: 12px;
  padding: 2px 8px; border-radius: 999px;
}

.card__body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.card__titulo { font-size: 16px; font-weight: 600; margin: 0; line-height: 1.3; }
.card__modelo { font-size: 13px; color: var(--muted); margin: 0; }
.card__desc { font-size: 14px; color: var(--muted); margin: 0; }

.badge {
  flex: none; background: var(--danger); color: #fff;
  font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
}

.preco { font-size: 20px; font-weight: 700; margin: 4px 0 0; }
.preco__ars { font-size: 15px; font-weight: 500; color: var(--muted); }
.mercado { font-size: 13px; color: var(--muted); margin: 0; }
.mercado s { opacity: .8; }
.meta { font-size: 12px; color: var(--muted); margin: 0; }

.btn-whats {
  margin-top: auto; display: block; text-align: center; text-decoration: none;
  background: var(--accent); color: var(--accent-ink); font-weight: 600;
  padding: 10px 16px; border-radius: 999px;
  transition: filter .15s;
}
.btn-whats:hover { filter: brightness(.95); }

/* ---------- vendido ---------- */
.card--vendido { opacity: .75; }
.card--vendido .card__media { cursor: default; }
.card--vendido .card__img { filter: grayscale(1); }
.card--vendido .card__media::after {
  content: attr(data-vendido);
  position: absolute; top: 22px; left: -46px;
  transform: rotate(-38deg);
  background: var(--danger); color: #fff;
  font-size: 13px; font-weight: 800; letter-spacing: .08em;
  padding: 6px 60px;
}

/* ---------- vazio ---------- */
.vazio { text-align: center; color: var(--muted); padding: 48px 0; }

/* ---------- lightbox ---------- */
.lightbox {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,.92);
  display: flex; align-items: center; justify-content: center;
}
.lightbox[hidden] { display: none; }
.lightbox__img { max-width: 92vw; max-height: 88vh; object-fit: contain; }
.lightbox__close, .lightbox__nav {
  position: absolute; background: rgba(255,255,255,.12); color: #fff;
  border: none; cursor: pointer; border-radius: 999px;
  width: 44px; height: 44px; font-size: 22px; line-height: 1;
}
.lightbox__close { top: 16px; right: 16px; }
.lightbox__nav--prev { left: 16px; }
.lightbox__nav--next { right: 16px; }

/* ---------- foco visível ---------- */
:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

Create the empty images folder so git tracks it:

```bash
mkdir -p images && touch images/.gitkeep
```

- [ ] **Step 4: Verify the acceptance criteria**

Run: `open index.html`
Expected:
- Header with "Ventas" and ES/PT buttons; notice block with a `300` input; search field, empty chip row, sort dropdown; grid area empty.
- Console shows one error only: `app.js` 404 / `Uncaught` from the missing file. No other errors.
- Resize to 375px: layout stays single column, no horizontal scrollbar.

Note: the notice text lines are blank at this stage — `data-i18n` spans are filled by `app.js` in Task 6. That's expected.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css images/.gitkeep
git commit -m "feat: add page shell and stylesheet"
```

---

### Task 6: Render — cards, i18n application, initial state

**Files:**
- Create: `app.js`

**Interfaces:**
- Consumes: `I18N`, `CONFIG`, `CATEGORIAS`, `ITEMS`, `Core`, and the DOM contract from Task 5.
- Produces: module-level `App` with `App.state = { lang, cotacao, query, categoria, ordem }` and `App.render()`. Later tasks wire events to mutate `App.state` and call `App.render()`.

- [ ] **Step 1: Write the failing test**

Acceptance criteria for this task:

1. Loading `index.html` renders one card for the heladera with title in Spanish.
2. The card shows `R$ 3.100`, `≈ AR$ 930.000`, a `−38%` badge, `Mercado: R$ 5.000 (AR$ 1.500.000)` struck through, and `Comprado en 2024 · F 70 × P 74 × A 160 cm`.
3. All notice lines and control labels show Spanish text.
4. `Core.validateItems` problems, if any, appear as `console.warn`.

- [ ] **Step 2: Run test to verify it fails**

Run: `open index.html`
Expected: grid empty, notice lines blank, console error about missing `app.js`.

- [ ] **Step 3: Write minimal implementation**

Create `app.js`:

```js
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
```

- [ ] **Step 4: Verify the acceptance criteria**

Run: `open index.html`
Expected: one card, Spanish title `Heladera No Frost 420 Lts Blanca`, model `Drean HDR420N30B`, `R$ 3.100 ≈ AR$ 930.000`, badge `−38%`, struck `Mercado: R$ 5.000 (AR$ 1.500.000)`, meta `Comprado en 2024 · F 70 × P 74 × A 160 cm`, green WhatsApp button. Notice lines and control labels in Spanish. No console errors. The photo shows the placeholder 🖼 (no image file yet) — expected.

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: render item cards with localized text and derived prices"
```

---

### Task 7: Interactivity — language, exchange rate, search, filter, sort, persistence

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: `App` from Task 6.
- Produces: event wiring only. No new public API.

- [ ] **Step 1: Write the failing test**

Acceptance criteria:

1. Clicking `PT` switches every text to Portuguese, including the WhatsApp button's `href` message.
2. Reloading keeps the last chosen language.
3. Typing `500` in the rate field turns `AR$ 930.000` into `AR$ 1.550.000` immediately; reload keeps `500`.
4. Clearing the rate field or typing `abc` marks the input red and keeps the last valid rate in the cards.
5. `Restablecer` puts the rate back to `300` and clears the red state.
6. Typing `heladera` keeps the card; typing `zzz` shows the empty state with a working "clear filters" button.
7. Clicking a category chip filters; clicking `Todos` restores.
8. Changing the sort dropdown re-orders the grid.

- [ ] **Step 2: Run test to verify it fails**

Run: `open index.html`, click `PT`.
Expected: nothing happens — no listeners are attached yet.

- [ ] **Step 3: Write minimal implementation**

In `app.js`, add these two functions inside the IIFE, right before `function init()`:

```js
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
```

Then replace the body of `init` with:

```js
  function init() {
    cacheEls();
    loadPrefs();

    var problemas = Core.validateItems(ITEMS, CATEGORIAS);
    if (problemas.length) console.warn('items.js com problemas:\n' + problemas.join('\n'));

    el['cotacao'].value = state.cotacao;
    bindEvents();
    render();
  }
```

`Core.parseCotacao(bruto, null)` returns `null` for invalid input because the fallback is passed through unchanged — no change to `core.js` is needed.

- [ ] **Step 4: Verify the acceptance criteria**

Run: `open index.html` and walk criteria 1-8 above in order.
Expected: every one behaves as written. Confirm criterion 1 by right-clicking the WhatsApp button → Copy Link, and checking the text contains `Olá! Tenho interesse em:` after switching to PT.

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: wire language switch, editable rate, search, filter and sort"
```

---

### Task 8: Lightbox

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: `App`, lightbox DOM from Task 5.
- Produces: event wiring only.

- [ ] **Step 1: Write the failing test**

Acceptance criteria (needs at least one real photo — Step 3 covers adding a throwaway one):

1. Clicking a card photo opens the lightbox with that photo.
2. With a single photo, the ‹ › arrows are hidden.
3. With two or more photos, ‹ › cycle through them and wrap around.
4. `ESC`, the ✕ button, and a click on the dark backdrop all close it.
5. `←` / `→` navigate while open.
6. Sold-item photos do not open the lightbox.
7. Body does not scroll behind an open lightbox.

- [ ] **Step 2: Run test to verify it fails**

Run: `open index.html`, click the card photo.
Expected: nothing happens.

- [ ] **Step 3: Write minimal implementation**

Add to `style.css`:

```css
body.is-locked { overflow: hidden; }
```

Add to `app.js` inside the IIFE, before `init`:

```js
  var lightbox = { fotos: [], idx: 0 };

  function abrirLightbox(fotos, idx) {
    lightbox.fotos = fotos;
    lightbox.idx = idx || 0;
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
  }

  function mostrarFoto() {
    el['lightbox-img'].src = lightbox.fotos[lightbox.idx];
  }

  function passarFoto(delta) {
    var n = lightbox.fotos.length;
    lightbox.idx = (lightbox.idx + delta + n) % n;
    mostrarFoto();
  }

  function bindLightbox() {
    el['grid'].addEventListener('click', function (ev) {
      var media = ev.target.closest('.card__media');
      if (!media || !media.dataset.lightbox) return;
      var item = ITEMS.filter(function (i) { return i.id === media.dataset.lightbox; })[0];
      if (!item || !item.fotos || item.fotos.length === 0) return;
      abrirLightbox(item.fotos, 0);
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
      if (ev.key === 'ArrowLeft' && lightbox.fotos.length > 1) passarFoto(-1);
      if (ev.key === 'ArrowRight' && lightbox.fotos.length > 1) passarFoto(1);
    });
  }
```

Add `bindLightbox();` to `init`, immediately after `bindEvents();`.

To exercise the multi-photo path, temporarily add a second entry to the heladera's `fotos` array and drop two placeholder JPEGs into `images/`:

```bash
curl -sL "https://placehold.co/800x600/jpeg?text=1" -o images/heladera-drean-1.jpg
curl -sL "https://placehold.co/800x600/jpeg?text=2" -o images/heladera-drean-2.jpg
```

If there is no network, any two local JPEGs work. These are throwaway files — replace them with the real photos before publishing, and drop the second `fotos` entry if the real item only has one photo.

- [ ] **Step 4: Verify the acceptance criteria**

Run: `open index.html` and walk criteria 1-7.
Expected: all pass. For criterion 6, temporarily flip the heladera to `vendido: true`, reload, confirm the photo does not open and the diagonal `VENDIDO` band and grayscale render — then flip it back to `false`.

- [ ] **Step 5: Commit**

```bash
git add app.js style.css items.js images/
git commit -m "feat: add fullscreen photo lightbox with keyboard navigation"
```

---

### Task 9: README, manual verification checklist and deploy

**Files:**
- Create: `README.md`
- Modify: `docs/superpowers/specs/2026-07-26-site-vendas-design.md` (only if the build diverged from the spec)

**Interfaces:**
- Consumes: everything above.
- Produces: the maintenance documentation and a live URL.

- [ ] **Step 1: Write the failing test**

Acceptance criteria:

1. `README.md` documents adding an item, marking it sold, uploading a photo through the GitHub web UI, changing the default rate, and changing the WhatsApp number.
2. The full manual checklist runs green in a browser.
3. The site is reachable at the GitHub Pages URL and behaves identically to the local copy.

- [ ] **Step 2: Run test to verify it fails**

Run: `ls README.md`
Expected: `ls: README.md: No such file or directory`.

- [ ] **Step 3: Write minimal implementation**

Create `README.md`:

````markdown
# Ventas / Vendas

Site estático de venda de itens usados. Bilíngue (ES padrão, PT), preços em BRL
com conversão para ARS por cotação editável na própria página.

Sem banco de dados, sem build, sem dependência. Abrir `index.html` no navegador
já funciona.

## Arquivos

| Arquivo | O que é |
|---|---|
| `items.js` | **Os dados.** É o único arquivo que você edita no dia a dia. |
| `i18n.js` | Textos de interface em espanhol e português. |
| `core.js` | Funções puras (formatação, desconto, busca, ordenação). |
| `app.js` | Render e eventos. |
| `style.css` | Estilos. |
| `tests.html` | Abre no navegador e roda os testes de `core.js`. |
| `run-tests.js` | Roda os mesmos testes pelo terminal (`node run-tests.js`). Só dev. |
| `images/` | Fotos dos itens. |

## Adicionar um item

1. Abrir `items.js`.
2. Copiar o bloco comentado `MODELO PARA COPIAR` e colar dentro de `ITEMS`.
3. Preencher os campos:

| Campo | Obrigatório | Observação |
|---|---|---|
| `id` | sim | Único, sem espaço. Ex: `mesa-madeira` |
| `preco` | sim | **Em reais.** Nunca em pesos. |
| `categoria` | sim | Um dos valores de `CATEGORIAS`, no topo do arquivo. |
| `vendido` | sim | `false` enquanto disponível. |
| `es.titulo` / `pt.titulo` | sim | Título nos dois idiomas. |
| `modelo` | não | Marca e modelo. Não é traduzido. |
| `precoMercado` | não | Em reais. Gera o selo de desconto automático. |
| `ano` | não | Ano de compra. |
| `medidas` | não | `{ f: frente, p: profundidade, a: altura }` em cm. |
| `fotos` | não | Lista de caminhos. Sem foto, aparece um placeholder. |
| `es.desc` / `pt.desc` | não | Descrição curta. |

4. Salvar e abrir `index.html` pra conferir.

Valores em pesos **nunca** são digitados — o site calcula tudo a partir do
preço em reais e da cotação.

## Marcar como vendido

Em `items.js`, trocar `vendido: false` por `vendido: true`.

O item continua no site, com foto em preto e branco, faixa `VENDIDO` e sem
botão de WhatsApp. Vendidos vão sempre para o fim da lista.

## Subir foto pelo site do GitHub

1. Abrir o repositório no GitHub → pasta `images`.
2. `Add file` → `Upload files` → arrastar a foto → `Commit changes`.
3. Em `items.js`, referenciar: `fotos: ['images/nome-do-arquivo.jpg']`.

Nome do arquivo sem espaço e sem acento. Fotos na horizontal ficam melhores
(o card usa proporção 4:3).

## Mudar a cotação padrão

Em `items.js`, `CONFIG.cotacaoPadrao`. É o valor que aparece pré-preenchido
para quem entra no site. Quem visita pode alterar no próprio campo, e a
escolha fica salva no navegador da pessoa.

## Mudar o WhatsApp

Em `items.js`, `CONFIG.whatsapp`. Só dígitos, com código do país.
Valor atual: `5493415827248` (= +54 9 341 582-7248). O `9` depois do `54` é
exigido pela WhatsApp para celulares argentinos.

## Testes

Abrir `tests.html` no navegador. Cabeçalho verde `TUDO VERDE` significa tudo
certo. Vermelho lista o que quebrou.

Quem preferir terminal: `node run-tests.js` roda a mesma coisa e sai com
código 1 se algo falhar. O Node é usado só para isso — o site publicado não
depende dele.

Rode depois de mexer em `core.js`, `i18n.js` ou `items.js` — a suíte também
valida os dados (id repetido, categoria inexistente, título faltando).

## Checklist manual

Depois de qualquer mudança maior, abrir `index.html` e conferir:

- [ ] Abre direto pelo arquivo, sem servidor, sem erro no console.
- [ ] Trocar para PT muda todos os textos, inclusive a mensagem do WhatsApp.
- [ ] Recarregar mantém idioma e cotação escolhidos.
- [ ] Cotação `500` recalcula todos os valores em AR$.
- [ ] Cotação vazia ou `abc` fica vermelha e não quebra os preços.
- [ ] Buscar sem acento encontra item com acento.
- [ ] Chips de categoria filtram; só aparecem categorias com item.
- [ ] Ordenar por maior preço mantém vendidos no fim.
- [ ] Clicar na foto abre em tela cheia; setas e ESC funcionam.
- [ ] Botão do WhatsApp abre conversa com a mensagem certa.
- [ ] Em 375px de largura: uma coluna, sem rolagem horizontal.

## Publicar

O site é publicado pelo GitHub Pages a partir da branch `main`:

```bash
git add -A
git commit -m "content: update items"
git push
```

Configuração (uma vez só): repositório → `Settings` → `Pages` →
`Source: Deploy from a branch` → branch `main`, pasta `/ (root)` → `Save`.

Endereço: `https://<usuario>.github.io/vendas/`. Depois do push, leva cerca de
um minuto para atualizar.
````

- [ ] **Step 4: Verify the acceptance criteria**

Run: `node run-tests.js`, then `open tests.html` and `open index.html`, and walk the full checklist in the README.
Expected: green test summary, every checklist line passes.

Then publish:

```bash
git push -u origin main
```

Configure Pages (Settings → Pages → `main` / root), wait ~1 minute, then open
`https://<usuario>.github.io/vendas/`.
Expected: identical behavior to the local copy, photos load, WhatsApp button
opens a chat.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add maintenance guide and manual verification checklist"
git push
```

---

## Notes on divergence from the spec

The spec described a single `app.js` holding all logic. This plan splits it
into `core.js` (pure, unit-tested) and `app.js` (DOM, verified manually),
which is what makes a zero-dependency test harness possible. The spec already
anticipated a split once `app.js` grew; this does it up front for testability.

The spec did not mention `tests.html` / `tests.js` / `run-tests.js`. They add
no runtime dependency and are not loaded by `index.html`. `run-tests.js` exists
so the suite can run headlessly from a terminal; Node is a development
convenience only and the published site never uses it.
