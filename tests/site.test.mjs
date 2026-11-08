import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../js/script.js", import.meta.url), "utf8");

test("navegação e seções principais", () => {
  for (const id of ["inicio", "cardapio", "sobre", "contato"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
    assert.match(html, new RegExp('href="#' + id + '"'));
  }
  assert.match(html, /lang="pt-BR"/);
});

test("as oito imagens possuem alt e arquivo WebP local", () => {
  const imagens = [...html.matchAll(/<img\b[^>]*>/gs)];
  assert.equal(imagens.length, 8);
  for (const imagem of imagens) {
    const src = imagem[0].match(/src="([^"]+)"/)?.[1];
    const alt = imagem[0].match(/alt="([^"]+)"/)?.[1];
    assert.ok(src?.startsWith("assets/images/"));
    assert.ok(alt?.trim());
    const caminho = new URL("../" + src, import.meta.url);
    assert.ok(existsSync(caminho), "Imagem não encontrada: " + src);
    const dados = readFileSync(caminho);
    assert.equal(dados.toString("ascii", 0, 4), "RIFF");
    assert.equal(dados.toString("ascii", 8, 12), "WEBP");
  }
});

test("atualização do ano e filtros sem recarregar a página", () => {
  const categorias = ["cafes", "cafes", "gelados", "gelados", "sobremesas", "sobremesas"];
  const produtos = categorias.map((categoria) => ({ dataset: { categoria }, hidden: false }));
  const botoes = ["todos", "cafes", "gelados", "sobremesas"].map((filtro) => ({
    dataset: { filtro },
    attributes: {},
    classList: { toggle() {} },
    setAttribute(nome, valor) { this.attributes[nome] = valor; },
    closest() { return this; }
  }));
  let aoClicar;
  const grupo = {
    hidden: true,
    contains(botao) { return botoes.includes(botao); },
    querySelectorAll() { return botoes; },
    addEventListener(evento, callback) {
      assert.equal(evento, "click");
      aoClicar = callback;
    }
  };
  const resultado = { hidden: true, textContent: "" };
  const ano = { textContent: "" };
  const document = {
    querySelector(seletor) {
      return {
        "#ano-atual": ano,
        ".filtros-cardapio": grupo,
        ".resultado-cardapio": resultado
      }[seletor] ?? null;
    },
    querySelectorAll(seletor) {
      return seletor === ".itens-cardapio article" ? produtos : [];
    }
  };

  runInNewContext(js, { document, Date });
  assert.equal(String(ano.textContent), String(new Date().getFullYear()));
  assert.equal(grupo.hidden, false);
  assert.equal(resultado.hidden, false);
  assert.equal(resultado.textContent, "6 produtos exibidos.");

  for (const [categoria, esperado] of [["cafes", 2], ["gelados", 2], ["sobremesas", 2], ["todos", 6]]) {
    const botao = botoes.find((b) => b.dataset.filtro === categoria);
    aoClicar({ target: botao });
    assert.equal(produtos.filter((p) => !p.hidden).length, esperado);
    assert.equal(resultado.textContent, esperado + " produtos exibidos.");
    assert.equal(botao.attributes["aria-pressed"], "true");
    assert.equal(botoes.filter((b) => b.attributes["aria-pressed"] === "true").length, 1);
  }
});
