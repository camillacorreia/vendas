/* ============================================================
   RESERVAS — quem já pediu cada item.

   Só o painel (admin.html) carrega este arquivo. O site público
   não sabe que ele existe, então o comprador nunca vê estes nomes.

   ATENÇÃO: o repositório é público. Este arquivo fica acessível
   para quem souber a URL. Use primeiro nome ou iniciais — nunca
   nome completo, telefone ou endereço.

   Para reservar: acrescente uma linha com o id do item.
   Para liberar: apague a linha.
   Item vendido continua marcado como vendido no items.js; a
   reserva é o passo anterior à venda.
   ============================================================ */

var RESERVAS = {
  // 'id-do-item': { por: 'Nome', em: '2026-07-27', nota: '' },
  'microondas-bgh-b120ds20i': { por: 'Sarah', em: '2026-07-27' },
  'respaldo-de-cama':         { por: 'Nanda', em: '2026-07-27' },
  'floreros-vidrio':          { por: 'Nanda', em: '2026-07-27' },
  'licuadora-top-house-l900fb': { por: 'Itauana', em: '2026-07-27' },
  'aire-bgh-bs35wcat':        { por: 'Ivan', em: '2026-07-27' },
  'comedor-escandinavo':      { por: 'Anuah', em: '2026-08-24', nota: 'Ivan reservou antes e não levou' },
  'freidora-kanji-kjhaf1404': { por: 'Bianca', em: '2026-08-20', nota: 'Ivan reservou antes e não levou' },
  'planta-4':                 { por: 'Gladys', em: '2026-07-27' },
  'rack-tv-delos':            { por: 'Amanda', em: '2026-07-30' },
  'babyliss':                 { por: 'Amanda', em: '2026-07-30' },
  'pava-electrica':           { por: 'Amanda', em: '2026-07-30' },
  'planchita-pelo':           { por: 'Nanda', em: '2026-07-30' },
  'bowl':                     { por: 'Nanda', em: '2026-07-30' },
  'pratos-vajilla':           { por: 'Nanda', em: '2026-07-30' },
  'tostadora':                { por: 'Nanda', em: '2026-08-17' },
  'loiros-mio-capelli-vendido': { por: 'Nanda', em: '2026-08-17', nota: '1 das 3 unidades' },
  'porta-bolo':               { por: 'Nanda', em: '2026-08-20' },
  'huevera-mir':              { por: 'Nanda', em: '2026-08-20' },
  'escritorio-hierro-madera': { por: 'Nanda', em: '2026-08-20' },
  'smart-tv-tcl-l43s5400':    { por: 'Thomas', em: '2026-08-21' },
  'mesa-de-luz-blanca':       { por: 'Joab', em: '2026-08-22' },
  'planta-1':                 { por: 'Anielly', em: '2026-08-26' },
  'esfera-bluetooth-ditron-speack5': { por: 'Joab', em: '2026-08-26' },
  'gaveteiro-3-gavetas-avariado':    { por: 'Joab', em: '2026-08-26' },
  'mural-fotos-grade':               { por: 'Joab', em: '2026-08-26' },
  'kit-mesa-4-pecas':                { por: 'Joab', em: '2026-08-26' },
  'abajur-mesa-madeira-vendido': { por: 'Joab', em: '2026-08-24' },
};

/* ============================================================
   PAGAMENTOS PENDENTES — vendido, mas o dinheiro não entrou.

   Estar nesta lista é a dívida: quando pagar, apague a linha.
   `valor` é opcional e só serve quando a entrada do items.js
   junta várias unidades e só parte delas está em aberto.
   ============================================================ */

var PAGAMENTOS = {
  // 'id-do-item': { quem: 'Nome', valor: 0, nota: '' },
  'escritorio-hierro-madera':   { quem: 'Nanda' },
  'huevera-mir':                { quem: 'Nanda' },
  'abajur-mesa-madeira-vendido': { quem: 'Joab', valor: 35, nota: 'saldo do que levou' },
  'porta-bolo':                 { quem: 'Nanda' },
};
