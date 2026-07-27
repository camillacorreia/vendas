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

  {
    id: 'aire-bgh-bs35wcat',
    modelo: 'BGH BS35WCAT',
    preco: 1500,
    precoMercado: 2667,             // AR$ 800.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/aire-acondicionado-bgh-split-frio-y-calor-bs35wcat-blanco/p/MLA18705457',
    es: {
      titulo: 'Aire acondicionado split frío/calor',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Ar-condicionado split quente/frio',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'lavarropas-drean-next-709',
    modelo: 'Drean Next 7.09 Eco',
    preco: 1500,
    precoMercado: 2667,             // AR$ 800.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: fotos
    medidas: { f: 62, p: 49, a: 86 },
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/lavarropas-carga-frontal-7-kg-blanco-drean-next-709-eco-blanco/p/MLA72845638',
    es: {
      titulo: 'Lavarropas carga frontal 7 kg',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Máquina de lavar frontal 7 kg',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'silla-delphi-premium',
    modelo: 'Delphi Premium',
    preco: 380,
    precoMercado: 667,              // AR$ 200.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/silla-de-oficina-para-escritorio-ergonomica-delphi-premium-ejecutiva-color-negro-material-del-tapizado-mesh/p/MLA35729287',
    es: {
      titulo: 'Silla de oficina ergonómica negra',
      desc: 'Ejecutiva, tapizado mesh. En perfecto estado.',
    },
    pt: {
      titulo: 'Cadeira de escritório ergonômica preta',
      desc: 'Executiva, encosto em tela. Em perfeito estado.',
    },
  },

  {
    id: 'microondas-bgh-b120ds20i',
    modelo: 'BGH B120DS20I',
    preco: 400,
    precoMercado: 667,              // AR$ 200.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.cetrogar.com.ar/microondas-bgh-digital-b120ds20i-20lt-700w-lb3891/p',
    es: {
      titulo: 'Microondas digital 20 L plata',
      desc: '700 W, modo eco. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Micro-ondas digital 20 L prata',
      desc: '700 W, modo eco. Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'smart-tv-tcl-43s5k',
    modelo: 'TCL 43S5K',
    preco: 1200,
    precoMercado: 1833,             // AR$ 550.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletronicos',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.cetrogar.com.ar/smart-tv-tcl-qled-43-43s5k-google-tv-tv3261/p',
    es: {
      titulo: 'Smart TV QLED 43" Google TV',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Smart TV QLED 43" Google TV',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'sofa-cama',
    preco: 250,
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    es: {
      titulo: 'Sofá cama de dos plazas',
      desc: 'Atención: el tapizado tiene dos agujeros en el medio. Como cama está perfecto y se abre en una cama de dos plazas amplia. Incluye 5 almohadones.',
    },
    pt: {
      titulo: 'Sofá-cama de casal',
      desc: 'Atenção: o estofado tem dois furos no meio. Como cama está perfeito e vira uma cama de casal espaçosa. Inclui 5 almofadas.',
    },
  },

  {
    id: 'espelho',
    preco: 200,
    precoMercado: 500,
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: fotos, medidas e link de referência
    fotos: [],
    es: {
      titulo: 'Espejo',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Espelho',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'lampara-de-pie',
    preco: 250,
    precoMercado: 400,
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: fotos, medidas e link de referência
    fotos: [],
    es: {
      titulo: 'Lámpara de pie',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Luminária de piso',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'respaldo-de-cama',
    preco: 100,
    precoMercado: 300,
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos, medidas e link de referência
    fotos: [],
    es: {
      titulo: 'Respaldo de cama',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Cabeceira de cama',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'mueble-columna-cocina',
    preco: 480,
    precoMercado: 1000,             // AR$ 300.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/mueble-columna-de-cocina-despensero-blanco-10155-color-10155-blanco/p/MLA26320551',
    es: {
      titulo: 'Mueble columna de cocina blanco',
      desc: 'Despensero. En perfecto estado.',
    },
    pt: {
      titulo: 'Armário coluna de cozinha branco',
      desc: 'Tipo despenseiro. Em perfeito estado.',
    },
  },

  {
    id: 'lampara-colgante-jaula',
    preco: 55,
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: fotos, medidas, valor de mercado e link de referência
    fotos: [],
    es: {
      titulo: 'Lámpara colgante vintage jaula diamante',
      desc: 'Ya viene con la lámpara. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Luminária pendente vintage gaiola diamante',
      desc: 'Já vem com a lâmpada. Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'comedor-escandinavo',
    preco: 350,
    precoMercado: 1000,             // AR$ 300.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos. Os 120 cm vieram do anúncio de referência — conferir.
    fotos: [],
    linkMercado: 'https://articulo.mercadolibre.com.ar/MLA-1384569291-juego-comedor-nordico-mesa-escandinava-120-4-sillas-eames-_JM',
    es: {
      titulo: 'Juego de comedor escandinavo: mesa + 4 sillas',
      desc: 'Blanco, mesa de 120 cm, sillas Eames. Atención: las sillas están un poco desgastadas.',
    },
    pt: {
      titulo: 'Conjunto de jantar escandinavo: mesa + 4 cadeiras',
      desc: 'Branco, mesa de 120 cm, cadeiras Eames. Atenção: as cadeiras estão um pouco desgastadas.',
    },
  },

  {
    id: 'floreros-vidrio',
    preco: 30,                      // por unidade
    qtd: 2,
    precoCombo: 50,                 // os dois juntos
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: fotos, medidas, valor de mercado e link de referência
    fotos: [],
    es: {
      titulo: 'Florero de vidrio',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Vaso de vidro',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'freidora-kanji-kjhaf1404',
    modelo: 'Kanji Home KJHAF1404',
    preco: 95,
    precoMercado: 233,              // AR$ 70.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: fotos e medidas
    fotos: [],
    linkMercado: 'https://www.mercadolibre.com.ar/freidora-de-aire-4-litros-digital-kanjihome-kjhaf1404/p/MLA57822248',
    es: {
      titulo: 'Freidora de aire digital 4 L',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Air fryer digital 4 L',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'licuadora-top-house-l900fb',
    modelo: 'Top House L-900FB',
    preco: 75,
    precoMercado: 133,              // AR$ 40.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: fotos, medidas e link de referência
    fotos: [],
    es: {
      titulo: 'Licuadora 900 W, jarra de 1,75 L',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Liquidificador 900 W, copo de 1,75 L',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'cafeteira-mondial-15-max',
    modelo: 'Mondial 15 Max',
    preco: 55,
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: fotos, medidas, valor de mercado e link de referência
    fotos: [],
    es: {
      titulo: 'Cafetera eléctrica 15 tazas',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Cafeteira elétrica 15 xícaras',
      desc: 'Em perfeito estado de funcionamento.',
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
