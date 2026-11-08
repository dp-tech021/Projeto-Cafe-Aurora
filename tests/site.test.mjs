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

test("estrutura do carrossel preserva os seis produtos e a alternativa sem JavaScript", () => {
  assert.equal([...html.matchAll(/<article\b[^>]*data-categoria=/g)].length, 6);
  assert.match(html, /class="controles-carrossel" hidden/);
  assert.match(html, /class="controle-carrossel controle-anterior"/);
  assert.match(html, /class="controle-carrossel controle-proximo"/);
  assert.match(html, /aria-controls="lista-cardapio"/);
  assert.match(html, /id="lista-cardapio" role="list"/);
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

test("carrossel navega um produto, limita os extremos e reinicia ao filtrar", () => {
  const categorias = ["cafes", "cafes", "gelados", "gelados", "sobremesas", "sobremesas"];
  const lista = {
    clientWidth: 100,
    offsetLeft: 0,
    scrollLeft: 0,
    eventos: {},
    get scrollWidth() {
      return produtos.filter((produto) => !produto.hidden).length * 100;
    },
    addEventListener(evento, callback) { this.eventos[evento] = callback; },
    getBoundingClientRect() { return { left: 0 }; },
    scrollTo({ left }) {
      this.scrollLeft = left;
      this.eventos.scroll?.();
    }
  };
  const produtos = categorias.map((categoria, indice) => ({
    dataset: { categoria },
    hidden: false,
    offsetLeft: indice * 100,
    getBoundingClientRect() { return { left: this.offsetLeft - lista.scrollLeft }; }
  }));
  const botoesFiltro = ["todos", "cafes", "gelados", "sobremesas"].map((filtro) => ({
    dataset: { filtro },
    attributes: {},
    classList: { toggle() {} },
    setAttribute(nome, valor) { this.attributes[nome] = valor; },
    closest() { return this; }
  }));
  const filtros = {
    hidden: true,
    eventos: {},
    contains(botao) { return botoesFiltro.includes(botao); },
    querySelectorAll() { return botoesFiltro; },
    addEventListener(evento, callback) { this.eventos[evento] = callback; }
  };
  const criarControle = () => ({
    disabled: false,
    eventos: {},
    addEventListener(evento, callback) { this.eventos[evento] = callback; }
  });
  const anterior = criarControle();
  const proximo = criarControle();
  const controles = { hidden: true };
  const classesAdicionadas = [];
  const carrossel = { classList: { add(classe) { classesAdicionadas.push(classe); } } };
  const resultado = { hidden: true, textContent: "" };
  const seletores = {
    ".filtros-cardapio": filtros,
    ".resultado-cardapio": resultado,
    ".carrossel-cardapio": carrossel,
    ".itens-cardapio": lista,
    ".controles-carrossel": controles,
    ".controle-anterior": anterior,
    ".controle-proximo": proximo
  };
  const document = {
    querySelector(seletor) { return seletores[seletor] ?? null; },
    querySelectorAll(seletor) {
      return seletor === ".itens-cardapio article" ? produtos : [];
    }
  };

  runInNewContext(js, { document, Date });
  assert.deepEqual(classesAdicionadas, ["carrossel-ativo"]);
  assert.equal(controles.hidden, false);
  assert.equal(anterior.disabled, true);
  assert.equal(proximo.disabled, false);

  proximo.eventos.click();
  assert.equal(lista.scrollLeft, 100);
  assert.equal(anterior.disabled, false);

  const filtroCafes = botoesFiltro[1];
  filtros.eventos.click({ target: filtroCafes });
  assert.equal(produtos.filter((produto) => !produto.hidden).length, 2);
  assert.equal(resultado.textContent, "2 produtos exibidos.");
  assert.equal(lista.scrollLeft, 0);
  assert.equal(anterior.disabled, true);

  proximo.eventos.click();
  assert.equal(lista.scrollLeft, 100);
  assert.equal(proximo.disabled, true);
});
