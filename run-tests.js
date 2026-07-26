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
