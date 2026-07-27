/* ============================================================
   ÚNICO ARQUIVO QUE VOCÊ EDITA NO DIA A DIA.
   Instruções completas no README.md.
   ============================================================ */

var CONFIG = {
  whatsapp: '5493415827248',  // DDI 54 + 9 (celular AR) + área 341 + número
  cotacaoPadrao: 310,         // 1 BRL = N ARS
};

var CATEGORIAS = ['eletrodomesticos', 'moveis', 'eletronicos', 'casa', 'plantas', 'outros'];

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
    preco: 45,
    precoMercado: 150,
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: medidas e link de referência
    fotos: [
      'images/apoio-de-pes/1.jpeg',
    ],
    es: {
      titulo: 'Apoyapiés ergonómico para escritorio',
      desc: '',
    },
    pt: {
      titulo: 'Apoio de pés ergonômico para escritório',
      desc: '',
    },
  },

  {
    id: 'impressora-epson-m1180',
    modelo: 'Epson EcoTank M1120',
    preco: 875,
    precoMercado: 1347,             // AR$ 404.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletronicos',
    vendido: false,
    // FALTA: medidas
    fotos: [
      'images/impressora/1.jpeg',
    ],
    linkMercado: 'https://www.mercadolibre.com.ar/impresora-monocromatica-epson-ecotank-m1120-con-wi-fi/p/MLA44409423',
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
    fotos: [
      'images/mesa-escritorio/1.jpeg',
    ],
    linkMercado: 'https://www.mercadolibre.com.ar/escritorio-muebles-hierro-y-madera-natural-120cmx55cmx76cm/up/MLAU3827890139',
    es: {
      titulo: 'Escritorio de hierro y madera natural',
      desc: '',
    },
    pt: {
      titulo: 'Escrivaninha de ferro e madeira natural',
      desc: '',
    },
  },

  {
    id: 'rack-tv-delos',
    modelo: 'Delos Steel DST03',
    preco: 350,
    precoMercado: 767,              // AR$ 230.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: fotos. Altura veio do anúncio; frente e profundidade foram medidas.
    medidas: { f: 166, p: 37, a: 60 },
    fotos: [
      'images/rack/1.jpeg',
    ],
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
    modelo: 'BGH Silent Air BSE35WCCR',
    preco: 1650,
    precoMercado: 2667,             // AR$ 800.000 na cotação de referência de 300
                                // (mercado em jul/2026: AR$ 700.000 a 895.000)
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    reservado: true,
    // FALTA: medidas
    fotos: [
      'images/ar-condicionado/1.jpeg',
      'images/ar-condicionado/2.jpeg',
      'images/ar-condicionado/3.jpeg',
    ],
    linkMercado: 'https://www.fravega.com/p/aire-acondicionado-bgh-silent-air-3450w-f-c-bse35wccr-21198160/',
    es: {
      titulo: 'Aire acondicionado split frío/calor',
      desc: '12.000 BTU (3000 frigorías, 3450 W), clase A. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Ar-condicionado split quente/frio',
      desc: '12.000 BTU (3000 frigorias, 3450 W), classe A. Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'lavarropas-drean-next-709',
    modelo: 'Drean Next 7.09 Eco',
    preco: 1650,
    precoMercado: 2667,             // AR$ 800.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    medidas: { f: 62, p: 49, a: 86 },
    fotos: [
      'images/maquina-de-lavar/1.jpeg',
    ],
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
    preco: 380,
    precoMercado: 667,              // AR$ 200.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    // FALTA: medidas
    fotos: [
      'images/cadeira-escritorio/1.jpeg',
    ],
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
    reservado: true,
    // FALTA: medidas
    fotos: [
      'images/microondas/1.jpeg',
    ],
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
    // FALTA: medidas
    fotos: [
      'images/smart-tv/1.jpeg',
    ],
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
    preco: 500,
    precoMercado: 1200,
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    medidas: { f: 200, p: 90 },
    medidasTexto: '2 metros × 90 cm',
    fotos: [
      'images/sofa-cama/1.jpeg',
    ],
    es: {
      titulo: 'Sofá cama de dos plazas',
      desc: 'Atención: el tapizado tiene dos agujeros en el medio. Como cama está perfecto y se abre en una cama de dos plazas amplia. Incluye 5 almohadones. Precio negociable.',
    },
    pt: {
      titulo: 'Sofá-cama de casal',
      desc: 'Atenção: o estofado tem dois furos no meio. Como cama está perfeito e vira uma cama de casal espaçosa. Inclui 5 almofadas. Preço negociável.',
    },
  },

  {
    id: 'espelho',
    preco: 200,
    precoMercado: 500,
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: link de referência
    medidas: { f: 62, a: 155 },
    fotos: [
      'images/espelho/1.jpeg',
    ],
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
    // FALTA: link de referência
    medidas: { a: 165 },
    fotos: [
      'images/abajur-de-pe/1.jpeg',
      'images/abajur-de-pe/2.jpeg',
    ],
    es: {
      titulo: 'Lámpara de pie',
      desc: 'Ya viene con la lámpara. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Luminária de piso',
      desc: 'Já vem com a lâmpada. Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'respaldo-de-cama',
    preco: 100,
    precoMercado: 300,
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    reservado: true,
    // FALTA: link de referência
    medidas: { f: 145, a: 120 },
    fotos: [
      'images/respaldo/1.jpeg',
    ],
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
    precoMercado: 833,              // AR$ 250.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'moveis',
    vendido: false,
    medidas: { f: 57, a: 200 },
    fotos: [
      'images/armario-cozinha/1.jpeg',
    ],
    linkMercado: 'https://www.mercadolibre.com.ar/mueble-columna-de-cocina-despensero-blanco-10155-color-10155-blanco/p/MLA26320551',
    es: {
      titulo: 'Mueble columna de cocina blanco',
      desc: 'Despensero. Profundidad entre 53 y 57 cm. En perfecto estado.',
    },
    pt: {
      titulo: 'Armário coluna de cozinha branco',
      desc: 'Tipo despenseiro. Profundidade entre 53 e 57 cm. Em perfeito estado.',
    },
  },

  {
    id: 'lampara-colgante-jaula',
    preco: 55,
    precoMercado: 90,               // AR$ 27.000: 20.000 da luminária + ~7.000 da lâmpada
                                // de filamento, na cotação de referência de 300
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: medidas e link de referência
    fotos: [
      'images/lampara-colgador/1.jpeg',
      'images/lampara-colgador/2.jpeg',
    ],
    es: {
      titulo: 'Lámpara colgante vintage jaula diamante + lámpara de filamento',
      desc: 'Ya viene con la lámpara. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Luminária pendente vintage gaiola diamante + lâmpada de filamento',
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
    reservado: true,
    // FALTA: fotos. Os 120 cm vieram do anúncio de referência — conferir.
    fotos: [
      'images/mesa-com-4-cadeiras/1.jpeg',
      'images/mesa-com-4-cadeiras/2.jpeg',
      'images/mesa-com-4-cadeiras/3.jpeg',
      'images/mesa-com-4-cadeiras/4.jpeg',
      'images/mesa-com-4-cadeiras/5.jpeg',
    ],
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
    reservado: true,
    // FALTA: medidas, valor de mercado e link de referência
    fotos: [
      'images/vaso-de-vidro/1.jpeg',
    ],
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
    reservado: true,
    // FALTA: medidas
    fotos: [
      'images/air-fryer/1.jpeg',
      'images/air-fryer/2.jpeg',
    ],
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
    reservado: true,
    // FALTA: medidas e link de referência
    fotos: [
      'images/liquificador/1.jpeg',
    ],
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
    modelo: 'Electrolux ECM10',
    preco: 55,
    precoMercado: 133,              // AR$ 40.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: medidas
    linkMercado: 'https://www.tienda.electrolux.com.ar/cafetera-electrica-electrolux-inox-ecm10-600ml-1/p',
    fotos: [
      'images/cafeteira/1.jpeg',
      'images/cafeteira/2.jpeg',
    ],
    es: {
      titulo: 'Cafetera eléctrica inox 600 ml',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Cafeteira elétrica inox 600 ml',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'plancha-atma',
    modelo: 'Atma PAS1217N',
    preco: 35,
    precoMercado: 123,              // AR$ 37.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: true,
    // FALTA: medidas
    linkMercado: 'https://www.fravega.com/p/plancha-seca-con-rociador-1200w-suela-ceramica-atma-pas1217n--22841812/',
    fotos: [
      'images/ferro-de-passar/1.jpeg',
      'images/ferro-de-passar/2.jpeg',
    ],
    es: {
      titulo: 'Plancha seca con suela de cerámica',
      desc: '1200 W, con rociador. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Ferro de passar a seco com base cerâmica',
      desc: '1200 W, com borrifador. Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'pava-electrica',
    preco: 30,
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: medidas, valor de mercado e link de referência
    fotos: [
      'images/chaleira-eletrica/1.jpeg',
    ],
    es: {
      titulo: 'Pava eléctrica',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Chaleira elétrica',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'tostadora',
    preco: 25,
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: medidas, valor de mercado e link de referência
    fotos: [
      'images/torradeira/1.jpeg',
    ],
    es: {
      titulo: 'Tostadora',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Torradeira',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'planta-1',
    preco: 70,
    ano: 2024,
    categoria: 'plantas',
    vendido: false,
    // FALTA: altura (do chão até a folha mais alta)
    fotos: [
      'images/planta-1/1.jpeg',
      'images/planta-1/2.jpeg',
    ],
    es: {
      titulo: 'Sansevieria Laurentii adulta, con maceta',
      desc: 'Variedad Laurentii, la de bordes amarillos. Es un ejemplar adulto: una planta chica tarda años en llegar a este porte y adultas casi no se consiguen. Va con la maceta.',
    },
    pt: {
      titulo: 'Espada-de-são-jorge Laurentii adulta, com vaso',
      desc: 'Variedade Laurentii, a de bordas amarelas. É um exemplar adulto: uma planta pequena leva anos para chegar nesse porte e adultas quase não se acham. Vai com o vaso.',
    },
  },
  {
    id: 'planta-2',
    preco: 40,                      // AR$ 12.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'plantas',
    vendido: false,
    fotos: [
      'images/planta-2/1.jpeg',
    ],
    es: {
      titulo: 'Potus en maceta blanca',
      desc: 'Frondosa y bien tupida. Va con la maceta.',
    },
    pt: {
      titulo: 'Jiboia em vaso branco',
      desc: 'Cheia e bem fechada. Vai com o vaso.',
    },
  },
  {
    id: 'planta-3',
    preco: 40,                      // AR$ 12.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'plantas',
    vendido: false,
    fotos: [
      'images/planta-3/1.jpeg',
    ],
    es: {
      titulo: 'Potus con guías largas',
      desc: 'Guías largas, ya lista para colgar o guiar por la pared. Va con la maceta.',
    },
    pt: {
      titulo: 'Jiboia com ramos longos',
      desc: 'Ramos longos, já pronta para pendurar ou guiar pela parede. Vai com o vaso.',
    },
  },
  {
    id: 'planta-4',
    preco: 20,                      // AR$ 6.000 na cotação de referência de 300
    ano: 2024,
    categoria: 'plantas',
    vendido: true,
    fotos: [
      'images/planta-4/1.jpeg',
    ],
    es: {
      titulo: 'Palo de agua (Dracaena fragrans)',
      desc: 'También conocido como tronco de Brasil. Va con la maceta y el trípode de madera. Algunas puntas de las hojas están secas.',
    },
    pt: {
      titulo: "Pau-d'água (Dracaena fragrans)",
      desc: 'Vai com o vaso e o tripé de madeira. Algumas pontas das folhas estão secas.',
    },
  },
  {
    id: 'planta-5',
    preco: 95,
    ano: 2024,
    categoria: 'plantas',
    vendido: false,
    medidas: { a: 100 },
    fotos: [
      'images/planta-5/1.jpeg',
    ],
    es: {
      titulo: 'Gomero variegado (Ficus elastica Tineke)',
      desc: 'Se reconoce por los bordes crema anchos, el centro en tonos verde grisáceo y la vaina rojiza de la hoja nueva asomando arriba. Va con la maceta.',
    },
    pt: {
      titulo: 'Seringueira variegada (Ficus elastica Tineke)',
      desc: 'Reconhece-se pelas bordas creme largas, o miolo em tons de verde-acinzentado e a bainha avermelhada da folha nova saindo no topo. Vai com o vaso.',
    },
  },
  {
    id: 'planta-6',
    preco: 95,
    ano: 2024,
    categoria: 'plantas',
    vendido: false,
    medidas: { a: 90 },
    fotos: [
      'images/planta-6/1.jpeg',
    ],
    es: {
      titulo: 'Gomero Ruby, el rosado (Ficus elastica Ruby)',
      desc: 'Hojas verdes con variegación rosa y crema en estilo camuflaje y nervaduras rojizas, como se ve en las hojas nuevas de arriba. Va con la maceta.',
    },
    pt: {
      titulo: 'Seringueira Ruby, a rosada (Ficus elastica Ruby)',
      desc: 'Folhas verdes com variegação rosa e creme em estilo camuflagem e nervuras avermelhadas, como aparece nas folhas novas do topo. Vai com o vaso.',
    },
  },
  {
    id: 'planta-7',
    preco: 20,
    ano: 2024,
    categoria: 'plantas',
    vendido: true,
    fotos: [
      'images/planta-7/1.jpeg',
      'images/planta-7/2.jpeg',
      'images/planta-7/3.jpeg',
    ],
    es: {
      titulo: 'Malvón florecido (Pelargonium hortorum)',
      desc: 'La planta de balcón más clásica que hay. Se reconoce por la mancha oscura en forma de herradura en las hojas. Florecida en rojo. Va con la maceta.',
    },
    pt: {
      titulo: 'Gerânio florido (Pelargonium hortorum)',
      desc: 'Na Argentina chamam de malvón, e é a planta de sacada mais clássica que existe por lá. Reconhece-se pela mancha escura em forma de ferradura nas folhas. Florida em vermelho. Vai com o vaso.',
    },
  },

  {
    id: 'assadeira-marinex',
    modelo: 'Marinex',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/assadeira-marinex/1.jpeg',
    ],
    es: {
      titulo: 'Fuente de vidrio para horno',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Assadeira de vidro',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'tacas-de-vinho',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/tacas-de-vinho/1.jpeg',
    ],
    es: {
      titulo: '8 copas de vino',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: '8 taças de vinho',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'pratos-vajilla',
    modelo: 'Camicado',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/pratos/1.jpeg',
    ],
    es: {
      titulo: 'Juego de tazas y platos, 24 piezas',
      desc: '4 tazas, 3 pocillos, 4 platitos, 4 platitos de café, 3 platos playos, 3 platos hondos y 3 platos de postre. Tiene algunas marcas de uso.',
    },
    pt: {
      titulo: 'Jogo de xícaras e pratos, 24 peças',
      desc: '4 xícaras, 3 xícaras pequenas, 4 pires, 4 pires de cafezinho, 3 pratos rasos, 3 pratos fundos e 3 pratos de sobremesa. Tem algumas marcas de uso.',
    },
  },

  {
    id: 'pratos-brancos',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/pratos-2/1.jpeg',
    ],
    es: {
      titulo: 'Platos blancos, playos y hondos',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Pratos brancos, rasos e fundos',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'bowl',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/bowl/1.jpeg',
    ],
    es: {
      titulo: 'Bowl',
      desc: 'En perfecto estado.',
    },
    pt: {
      titulo: 'Bowl',
      desc: 'Em perfeito estado.',
    },
  },

  {
    id: 'plafon-led',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/plafon-de-led/1.jpeg',
    ],
    es: {
      titulo: 'Plafón LED de techo',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Plafon de LED de teto',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'balanza-digital',
    ano: 2024,
    categoria: 'casa',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/balanca/1.jpeg',
    ],
    es: {
      titulo: 'Balanza digital de baño, vidrio',
      desc: 'Hasta 180 kg. En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Balança digital de banheiro, vidro',
      desc: 'Até 180 kg. Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'secador-pelo',
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/secador/1.jpeg',
    ],
    es: {
      titulo: 'Secador de pelo',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Secador de cabelo',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'planchita-pelo',
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/prancha/1.jpeg',
    ],
    es: {
      titulo: 'Planchita de pelo',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Prancha de cabelo',
      desc: 'Em perfeito estado de funcionamento.',
    },
  },

  {
    id: 'babyliss',
    modelo: 'Babyliss',
    ano: 2024,
    categoria: 'eletrodomesticos',
    vendido: false,
    // FALTA: preço, medidas, valor de mercado e link de referência
    fotos: [
      'images/babyliss/1.jpeg',
      'images/babyliss/2.jpeg',
    ],
    es: {
      titulo: 'Rizador de pelo',
      desc: 'En perfecto estado de funcionamiento.',
    },
    pt: {
      titulo: 'Modelador de cachos',
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
    reservado: false,                  // opcional, mostra o selo RESERVADO
    medidas: { f: 0, p: 0, a: 0 },     // cm, opcional
    medidasTexto: '',                  // opcional, sobrescreve o texto das medidas
    fotos: ['images/pasta-do-item/1.jpg'],   // opcional, uma pasta por item
    linkMercado: 'https://…',          // opcional, anúncio de referência do preço de mercado
    es: { titulo: '', desc: '' },
    pt: { titulo: '', desc: '' },
  },
  ---------------------------- */
];
