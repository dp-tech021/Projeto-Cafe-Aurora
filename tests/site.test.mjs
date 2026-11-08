import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/script.js', import.meta.url), 'utf8');

test('página mantém seções e navegação principais', () => {
  for (const id of ['inicio', 'cardapio', 'sobre', 'contato']) {
    assert.match(html, new RegExp('id="' + id + '"'));
    assert.match(html, new RegExp('href="#' + id + '"'));
  }
  assert.match(html, /lang="pt-BR"/);
});

test('ano do rodapé é atualizado pelo script', () => {
  const node = { textContent: '' };
  runInNewContext(js, {
    document: { querySelector: (selector) => selector === '#ano-atual' ? node : null },
    Date,
  });
  assert.equal(String(node.textContent), String(new Date().getFullYear()));
});
