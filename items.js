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
    fotos: ['images/pasta-do-item/1.jpg'],   // opcional, uma pasta por item
    linkMercado: 'https://…',          // opcional, anúncio de referência do preço de mercado
    es: { titulo: '', desc: '' },
    pt: { titulo: '', desc: '' },
  },
  ---------------------------- */
];
