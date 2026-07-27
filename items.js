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

  {
    id: 'perchero-oliver',
    modelo: 'Oliver',
    preco: 300,
    precoMercado: 963,              // AR$ 289.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    medidas: { f: 62, a: 160 },
    fotos: [
      'images/cabideiro/1.webp',
      'images/cabideiro/2.jpeg',
      'images/cabideiro/3.webp',
    ],
    linkMercado: 'https://articulo.mercadolibre.com.ar/MLA-1137845696-perchero-de-pie-oliver-escandinavo-moderno-melamina-roble-_JM',
    es: {
      titulo: 'Perchero de pie escandinavo',
      desc: 'Melamina roble. En perfecto estado.',
    },
    pt: {
      titulo: 'Cabideiro de pé escandinavo',
      desc: 'Melamina carvalho. Em perfeito estado.',
    },
  },

  {
    id: 'apoya-pies',
    preco: 80,
    precoMercado: 150,
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: fotos, medidas e link de referência
    fotos: [],
    es: {
      titulo: 'Apoyapiés ergonómico para escritorio',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Apoio de pés ergonômico para escritório',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'impressora-epson-m1180',
    modelo: 'Epson EcoTank M1180',
    preco: 875,
    precoMercado: 1333,             // AR$ 400.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletronicos',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/impresora-epson-ecotank-m1180-monocromatica-11k-color-blanconegro/p/MLA28464465',
    es: {
      titulo: 'Impresora monocromática EcoTank',
      desc: 'En perfecto estado de funcionamiento. Ya viene con tinta.',
    },
    pt: {
      titulo: 'Impressora monocromática EcoTank',
      desc: 'Em perfeito estado de funcionamento. Já vem com tinta.',
    },
  },

  {
    id: 'escritorio-hierro-madera',
    preco: 300,
    precoMercado: 533,              // AR$ 160.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    medidas: { f: 120, p: 50, a: 75 },
    // FALTA: fotos
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/escritorio-muebles-hierro-y-madera-natural-120cmx55cmx76cm/up/MLAU3827890139',
    es: {
      titulo: 'Escritorio de hierro y madera natural',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Escrivaninha de ferro e madeira natural',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'rack-tv-delos',
    modelo: 'Delos Steel DST03',
    preco: 350,
    precoMercado: 667,              // AR$ 200.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos. Altura veio do anúncio; frente e profundidade foram medidas.
    medidas: { f: 166, p: 37, a: 60 },
    fotos: [],
    linkMercado: 'https://www.megatone.net/producto/rack-para-tv-steel-dst03-dst03rnn-delos_RAC3031DEL/',
    es: {
      titulo: 'Rack de TV industrial hasta 65"',
      desc: 'Una puerta, dos estantes y dos cajones. En perfecto estado.',
    },
    pt: {
      titulo: 'Rack de TV industrial até 65"',
      desc: 'Uma porta, duas prateleiras e duas gavetas. Em perfeito estado.',
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
