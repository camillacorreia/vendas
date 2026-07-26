# Site de Vendas (desapego) — Design

Data: 2026-07-26

## Objetivo

Site estático hospedado no GitHub Pages para vender itens usados pessoais.
Público principal: Argentina (idioma padrão espanhol), com versão em português.
Sem banco de dados, sem backend, sem build step. Contato e negociação acontecem
fora do site, via WhatsApp.

## Escopo

- 15 a 50 itens.
- Bilíngue: espanhol (padrão) e português.
- Preços em BRL, com conversão para ARS calculada por uma cotação editável na página.
- Filtro por categoria, busca textual e ordenação.
- Itens vendidos permanecem visíveis, marcados e movidos para o fim da lista.
- Fotos versionadas no próprio repositório.

### Fora de escopo

- Carrinho, checkout, pagamento online.
- Autenticação, painel administrativo, geração automatizada de dados.
- Cotação em tempo real via API.
- Analytics, SEO avançado, sitemap.

## Arquitetura

Vanilla HTML + CSS + JavaScript. Nenhuma dependência externa, nenhum CDN,
nenhum framework, nenhum passo de build. O site funciona abrindo `index.html`
direto do sistema de arquivos (`file://`), o que permite preview local sem servidor.

```
vendas/
├── index.html          # estrutura da página
├── style.css           # estilos (variáveis CSS para cores)
├── app.js              # render, filtro, busca, ordenação, i18n, cotação, lightbox
├── i18n.js             # strings de interface em pt e es
├── items.js            # DADOS — único arquivo editado no dia a dia
├── images/             # fotos dos itens
├── README.md           # receita de manutenção
└── docs/superpowers/specs/
```

### Por que `items.js` e não `items.json`

`fetch()` não funciona sob `file://`, o que obrigaria a rodar um servidor local
para qualquer preview. Um arquivo `.js` declarando um array global é carregado
por `<script>` e funciona em qualquer contexto. Além disso, sintaxe JS aceita
comentários e vírgula sobrando — mais tolerante para edição manual, que é o
fluxo escolhido.

### Unidades e responsabilidades

| Arquivo | Responsabilidade | Depende de |
|---|---|---|
| `items.js` | Declara `CONFIG` e `ITEMS`. Só dados. | nada |
| `i18n.js` | Declara `I18N` com strings de interface por idioma. Só dados. | nada |
| `app.js` | Estado da UI, render, eventos. | `CONFIG`, `ITEMS`, `I18N` |
| `style.css` | Apresentação. | nada |
| `index.html` | Esqueleto e pontos de montagem. | os acima |

`app.js` é o único arquivo com lógica. Se passar de ~400 linhas, dividir em
`render.js` (monta DOM) e `state.js` (filtro/ordenação/idioma/cotação).

## Modelo de dados

`items.js`:

```js
const CONFIG = {
  whatsapp: "5493415827248",   // DDI + 9 (AR) + área + número, só dígitos
  cotacaoPadrao: 300,          // 1 BRL = N ARS
};

const CATEGORIAS = ["eletrodomesticos", "moveis", "eletronicos", "casa", "outros"];

const ITEMS = [
  {
    id: "heladera-drean",              // string única, uso interno
    modelo: "Drean HDR420N30B",        // opcional, não traduzido
    preco: 3100,                       // BRL, obrigatório
    precoMercado: 5000,                // BRL, opcional (referência de mercado)
    ano: 2024,                         // opcional
    categoria: "eletrodomesticos",     // deve existir em CATEGORIAS
    vendido: false,
    medidas: { f: 70, p: 74, a: 160 }, // cm, opcional
    fotos: ["images/heladera-1.jpg"],  // opcional; vazio => placeholder
    pt: { titulo: "Geladeira No Frost 420 Lts Branca", desc: "..." },
    es: { titulo: "Heladera No Frost 420 Lts Blanca",  desc: "..." },
  },
];
```

Regras:

- `preco` sempre em BRL. Valores em ARS nunca são digitados — sempre calculados.
- Campos opcionais ausentes simplesmente não renderizam. Nenhum campo aparece vazio.
- `desconto` é derivado: `round((1 - preco / precoMercado) * 100)`. Só renderiza
  se `precoMercado > preco`.
- Rótulos de categoria vivem em `i18n.js`, não em `items.js`.

## Comportamento

### Idioma

Padrão espanhol. Botão `ES | PT` no header. A troca reescreve todos os textos
sem recarregar a página, incluindo título/descrição dos itens, rótulos de
categoria, bloco de aviso e mensagem do WhatsApp. A escolha é persistida em
`localStorage` sob a chave `lang`.

### Cotação

Input numérico no bloco de aviso, inicializado com `CONFIG.cotacaoPadrao`.
Alterar o valor recalcula todos os valores em ARS imediatamente. Botão
"resetar" volta ao padrão. Valor persistido em `localStorage` sob a chave
`cotacao`. Entrada inválida (vazio, zero, negativo, não numérico) é ignorada:
mantém o último valor válido e marca o input com estado de erro.

### Formatação de moeda

- BRL: `R$ 3.100` — `pt-BR`, sem centavos.
- ARS: `AR$ 930.000` — `es-AR`, sem centavos, arredondado ao inteiro.

Usa `Intl.NumberFormat`.

### Lista

- **Busca**: campo texto, filtra ao vivo por título, modelo e descrição do
  idioma ativo. Case-insensitive e insensível a acento.
- **Filtro de categoria**: chips de seleção única, com "Todos" como padrão.
  Só aparecem chips de categorias que possuem ao menos um item.
- **Ordenação**: menor preço, maior preço, maior desconto. Padrão: menor preço.
- **Vendidos**: sempre no fim da lista, independentemente da ordenação escolhida.
  A ordenação escolhida vale dentro de cada grupo (disponíveis, vendidos).
- **Estado vazio**: quando busca ou filtro não retorna nada, exibe mensagem
  traduzida "Nada encontrado" com botão para limpar filtros.

### Card

```
[foto]
Heladera No Frost 420 Lts Blanca            [−38%]
Drean HDR420N30B
R$ 3.100  ≈ AR$ 930.000
Mercado: R$ 5.000 (AR$ 1.500.000)     <- riscado, cinza
Comprada en 2024 · F 70 × P 74 × A 160 cm
[ Consultar por WhatsApp ]
```

Card vendido: foto dessaturada, faixa diagonal "VENDIDO" (mesma palavra nos dois
idiomas), botão de WhatsApp removido.

### Fotos

Clique abre lightbox em tela cheia. Setas navegam entre fotos do mesmo item
(escondidas quando há só uma). Fecha com ESC, clique no fundo ou botão X.
Navegação por teclado: ← → ESC. Item sem foto usa um placeholder CSS
(bloco cinza com ícone), nunca uma imagem quebrada.

### WhatsApp

Link `https://wa.me/<CONFIG.whatsapp>?text=<mensagem>`, com mensagem
pré-preenchida no idioma ativo:

- ES: `Hola! Me interesa: <titulo> (R$ 3.100)`
- PT: `Olá! Tenho interesse em: <titulo> (R$ 3.100)`

Abre em nova aba (`target="_blank" rel="noopener"`).

## Bloco de aviso

Texto fixo no topo, traduzido. O número da cotação é o input editável.

**ES:**

> **Cotización de referencia (sujeta a variación): [300]**
> ✅ Acepto únicamente pagos en **reales brasileños (BRL)** mediante **PIX**.
> 💳 También acepto **PIX crédito**, con opción de **pago en cuotas**.
> 🇦🇷 Para compradores en Argentina, es posible pagar por PIX usando la app de **Mercado Pago**.
> 📅 Todos los ítems fueron comprados en **2024**.

**PT:**

> **Cotação de referência (sujeita a variação): [300]**
> ✅ Aceito apenas pagamentos em **reais (BRL)** via **PIX**.
> 💳 Também aceito **PIX crédito**, com opção de **parcelamento**.
> 🇦🇷 Para compradores na Argentina, dá pra pagar por PIX pelo app do **Mercado Pago**.
> 📅 Todos os itens foram comprados em **2024**.

## Estilo visual

Direção "clean editorial":

- Fundo `#FAFAF9`, cards brancos, cantos 12px, sombra suave.
- Cor de destaque: verde WhatsApp `#25D366`, usada apenas nos botões de contato.
- Selo de desconto: pill vermelho.
- Tipografia: system font stack (zero request externo).
- Preço em destaque; preço de mercado riscado em cinza menor.
- Variáveis CSS para todas as cores, num bloco `:root`.

Responsivo mobile-first: 1 coluna no celular, 2 no tablet, 3 no desktop.
Header sticky.

Animações discretas: fade-in dos cards ao carregar, elevação de 2px no hover,
transição suave ao filtrar. Todas respeitam `prefers-reduced-motion`.

Acessibilidade: contraste AA, `alt` nas fotos usando o título do item no idioma
ativo, foco visível em elementos interativos, lightbox fecha com ESC,
`aria-label` nos botões de idioma e no input de cotação, `lang` do `<html>`
atualizado na troca de idioma.

## Erros e casos-limite

| Situação | Comportamento |
|---|---|
| Item sem foto | Placeholder CSS |
| Foto com caminho quebrado | `onerror` troca pelo placeholder |
| `precoMercado` ≤ `preco` | Não mostra selo nem linha de mercado |
| Cotação inválida | Ignora, mantém último valor válido, marca erro no input |
| `ITEMS` vazio | Mensagem "Nenhum item no momento" |
| Categoria fora de `CATEGORIAS` | Cai em "outros" e loga aviso no console |
| Todos os itens vendidos | Lista renderiza normal, todos com selo |

## Testes

Sem framework de testes. Verificação manual documentada num checklist no README:

1. Abrir `index.html` direto no navegador — renderiza sem servidor.
2. Trocar idioma — todos os textos mudam, incluindo mensagem do WhatsApp.
3. Recarregar — idioma e cotação persistem.
4. Alterar cotação para 500 — todos os ARS recalculam.
5. Cotação vazia ou `abc` — não quebra.
6. Buscar termo com acento sem acento — encontra.
7. Filtrar categoria — só itens dela; chips vazios não aparecem.
8. Ordenar por maior preço — vendidos continuam no fim.
9. Clicar foto — lightbox abre, setas e ESC funcionam.
10. Clicar WhatsApp — abre `wa.me` com texto correto.
11. Redimensionar para 375px — 1 coluna, sem scroll horizontal.

## Deploy

1. `git push` para o GitHub.
2. Settings → Pages → Source: branch `main`, pasta `/` (root).
3. Publicado em `https://<usuario>.github.io/vendas/`.

Nenhum arquivo especial necessário: sem diretórios iniciados por underscore,
o Jekyll padrão do Pages não interfere.

## Manutenção (README)

O README documenta, passo a passo:

- Adicionar item: copiar bloco de exemplo em `items.js`, preencher campos.
- Marcar vendido: trocar `vendido: false` para `true`.
- Subir foto: upload em `images/` pela interface web do GitHub, referenciar o caminho.
- Mudar cotação padrão: editar `CONFIG.cotacaoPadrao`.
- Mudar WhatsApp: editar `CONFIG.whatsapp`.
- Checklist de verificação manual acima.

## Contato

Número de WhatsApp: `+54 341 5827248` (Rosario, Argentina).

Formato para `wa.me`: `5493415827248` — país `54`, o `9` obrigatório que a
WhatsApp exige para celulares argentinos, área `341`, número `5827248`.
Este é o valor de `CONFIG.whatsapp`.
