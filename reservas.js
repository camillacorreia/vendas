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
  'comedor-escandinavo':      { por: 'Ivan', em: '2026-07-27' },
  'freidora-kanji-kjhaf1404': { por: 'Ivan', em: '2026-07-27' },
  'planta-4':                 { por: 'Gladys', em: '2026-07-27' },
  'rack-tv-delos':            { por: 'Amanda', em: '2026-07-30' },
  'babyliss':                 { por: 'Amanda', em: '2026-07-30' },
  'pava-electrica':           { por: 'Amanda', em: '2026-07-30' },
};
