import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../js/script.js", import.meta.url), "utf8");
const jsExecutavel = js.replaceAll(
  "import.meta.url",
  JSON.stringify(new URL("../js/script.js", import.meta.url).href)
);
const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");
const manifesto = JSON.parse(
  readFileSync(new URL("../MANIFESTO.json", import.meta.url), "utf8")
);

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

test("as seis galerias declaram três imagens locais na ordem do manifesto", () => {
  const galerias = [...html.matchAll(/<div\s+class="galeria-produto"[\s\S]*?data-imagens="([^"]+)"[\s\S]*?data-alts="([^"]+)"/g)];
  assert.equal(galerias.length, 6);
  assert.equal(manifesto.produtos.length, 6);

  galerias.forEach((galeria, indice) => {
    const caminhos = galeria[1].split("|");
    const textosAlternativos = galeria[2].split("|");
    assert.deepEqual(caminhos, manifesto.produtos[indice].imagens);
    assert.equal(caminhos.length, 3);
    assert.ok(caminhos.length <= 5);
    assert.equal(textosAlternativos.length, caminhos.length);
    assert.ok(textosAlternativos.every((texto) => texto.trim().length > 0));

    caminhos.forEach((src) => {
      assert.ok(!/-0[45]\.webp$/.test(src));
      const caminho = new URL("../" + src, import.meta.url);
      assert.ok(existsSync(caminho), "Imagem de galeria não encontrada: " + src);
      const dados = readFileSync(caminho);
      assert.equal(dados.toString("ascii", 0, 4), "RIFF");
      assert.equal(dados.toString("ascii", 8, 12), "WEBP");
    });
  });

  const novasImagens = manifesto.produtos.flatMap((produto) => produto.imagens.slice(1));
  assert.equal(new Set(novasImagens).size, 12);
  assert.doesNotMatch(html, /assets\/images\/[^"|]*-0[45]\.webp/);
});

test("imagens das galerias são centralizadas e exibidas sem corte", () => {
  assert.match(css, /\.galeria-quadro \.produto-imagem\s*\{[\s\S]*?object-fit:\s*contain;/);
  assert.match(css, /\.galeria-quadro \.produto-imagem\s*\{[\s\S]*?object-position:\s*center;/);
});

test("estrutura progressiva mantém controles dinâmicos ocultos sem JavaScript", () => {
  assert.equal([...html.matchAll(/<article\b[^>]*data-categoria=/g)].length, 6);
  assert.match(html, /class="controles-carrossel" hidden/);
  assert.equal([...html.matchAll(/class="controles-galeria" hidden/g)].length, 6);
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

  runInNewContext(jsExecutavel, { document, Date, URL });
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

  runInNewContext(jsExecutavel, { document, Date, URL });
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

test("galerias navegam de forma independente, sob demanda e sem ultrapassar limites", () => {
  const preCarregadas = [];
  class ImagemPreCarregada {
    set src(caminho) { preCarregadas.push(caminho); }
  }
  const criarGaleria = (prefixo) => {
    const imagem = { src: prefixo === "primeira" ? "https://example.test/Projeto-Cafe-Aurora/assets/primeira-hash.webp" : "", alt: "" };
    const controles = { hidden: true };
    const anterior = { disabled: false, eventos: {}, addEventListener(evento, callback) { this.eventos[evento] = callback; } };
    const proxima = { disabled: false, eventos: {}, addEventListener(evento, callback) { this.eventos[evento] = callback; } };
    const indicador = { textContent: "" };
    const elementos = {
      ".produto-imagem": imagem,
      ".controles-galeria": controles,
      ".galeria-anterior": anterior,
      ".galeria-proxima": proxima,
      ".indicador-galeria": indicador
    };
    return {
      dataset: {
        imagens: `${prefixo}-01.webp|${prefixo}-02.webp|${prefixo}-03.webp`,
        alts: `Foto um de ${prefixo}|Foto dois de ${prefixo}|Foto três de ${prefixo}`
      },
      querySelector(seletor) { return elementos[seletor] ?? null; },
      elementos
    };
  };
  const primeira = criarGaleria("primeira");
  const segunda = criarGaleria("segunda");
  const document = {
    querySelector() { return null; },
    querySelectorAll(seletor) {
      return seletor === ".galeria-produto" ? [primeira, segunda] : [];
    }
  };

  runInNewContext(jsExecutavel, { document, Date, Image: ImagemPreCarregada, URL });
  assert.equal(primeira.elementos[".controles-galeria"].hidden, false);
  // Regressão: o build do Vite troca o src do HTML por uma URL processada.
  // A inicialização da galeria precisa preservar essa URL, sem criar um 404.
  assert.equal(
    primeira.elementos[".produto-imagem"].src,
    "https://example.test/Projeto-Cafe-Aurora/assets/primeira-hash.webp"
  );
  assert.equal(primeira.elementos[".indicador-galeria"].textContent, "1 de 3");
  assert.equal(primeira.elementos[".galeria-anterior"].disabled, true);
  assert.equal(preCarregadas.length, 0);

  primeira.elementos[".galeria-proxima"].eventos.click();
  assert.equal(primeira.elementos[".produto-imagem"].src, "primeira-02.webp");
  assert.equal(primeira.elementos[".produto-imagem"].alt, "Foto dois de primeira");
  assert.equal(primeira.elementos[".indicador-galeria"].textContent, "2 de 3");
  assert.deepEqual(preCarregadas, ["primeira-03.webp"]);
  assert.equal(segunda.elementos[".produto-imagem"].src, "segunda-01.webp");

  primeira.elementos[".galeria-proxima"].eventos.click();
  assert.equal(primeira.elementos[".produto-imagem"].src, "primeira-03.webp");
  assert.equal(primeira.elementos[".galeria-proxima"].disabled, true);

  primeira.elementos[".galeria-anterior"].eventos.click();
  assert.equal(primeira.elementos[".produto-imagem"].src, "primeira-02.webp");
});
