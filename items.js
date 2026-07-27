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
    fotos: ['images/geladeira/1.webp', 'images/geladeira/2.jpeg', 'images/geladeira/3.jpeg'],
    linkMercado: 'https://www.mercadolibre.com.ar/heladera-no-frost-420-lts-blanca-drean-hdr420n30b-blanco/p/MLA22452572',
    es: {
      titulo: 'Heladera No Frost 420 Lts Blanca',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Geladeira No Frost 420 Lts Branca',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'mesa-de-luz-blanca',
    preco: 170,                     // por unidade
    qtd: 2,
    precoCombo: 300,                // as duas juntas
    precoMercado: 333,              // AR$ 100.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    medidas: { f: 43, p: 37 },
    fotos: [
      'images/mesas-de-luz/1.png',
      'images/mesas-de-luz/2.png',
      'images/mesas-de-luz/3.png',
    ],
    linkMercado: 'https://www.mercadolibre.com.ar/mesa-de-luz-con-desayunador-centro-estant-blanca-color-blanco/p/MLA22649299',
    es: {
      titulo: 'Mesa de luz blanca con desayunador',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Mesa de cabeceira branca com bandeja',
      desc: 'Em perfeito estado.',
    },
  },

  /* ---- MODELO PARA COPIAR ----
  {
    id: 'identificador-unico',
    modelo: 'Marca Modelo',            // opcional
    preco: 0,                          // BRL, obrigatório
    qtd: 1,                            // opcional, unidades idênticas nesta entrada
    precoCombo: 0,                     // opcional, preço levando todas as unidades
    precoMercado: 0,                   // BRL, opcional
    ano: 2024,                         // opcional
    categoria: 'outros',               // ver CATEGORIAS acima
    vendido: false,
    medidas: { f: 0, p: 0, a: 0 },     // cm, opcional
    fotos: ['images/pasta-do-item/1.jpg'],   // opcional, uma pasta por item
    linkMercado: 'https://…',          // opcional, anúncio de referência do preço de mercado
    es: { titulo: '', desc: '' },
    pt: { titulo: '', desc: '' },
  },
  ---------------------------- */
];
