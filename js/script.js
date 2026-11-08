const elementoAno = document.querySelector("#ano-atual");
const filtrosCardapio = document.querySelector(".filtros-cardapio");
const resultadoCardapio = document.querySelector(".resultado-cardapio");
const carrosselCardapio = document.querySelector(".carrossel-cardapio");
const listaCardapio = document.querySelector(".itens-cardapio");
const controlesCarrossel = document.querySelector(".controles-carrossel");
const botaoAnterior = document.querySelector(".controle-anterior");
const botaoProximo = document.querySelector(".controle-proximo");
const produtosCardapio = [...document.querySelectorAll(".itens-cardapio article")];
const galeriasProdutos = [...document.querySelectorAll(".galeria-produto")];
const imagensComplementares = {
  "assets/images/cafe-coado-02.webp": new URL("../assets/images/cafe-coado-02.webp", import.meta.url).href,
  "assets/images/cafe-coado-03.webp": new URL("../assets/images/cafe-coado-03.webp", import.meta.url).href,
  "assets/images/cappuccino-02.webp": new URL("../assets/images/cappuccino-02.webp", import.meta.url).href,
  "assets/images/cappuccino-03.webp": new URL("../assets/images/cappuccino-03.webp", import.meta.url).href,
  "assets/images/cold-brew-02.webp": new URL("../assets/images/cold-brew-02.webp", import.meta.url).href,
  "assets/images/cold-brew-03.webp": new URL("../assets/images/cold-brew-03.webp", import.meta.url).href,
  "assets/images/chocolate-gelado-02.webp": new URL("../assets/images/chocolate-gelado-02.webp", import.meta.url).href,
  "assets/images/chocolate-gelado-03.webp": new URL("../assets/images/chocolate-gelado-03.webp", import.meta.url).href,
  "assets/images/bolo-cenoura-02.webp": new URL("../assets/images/bolo-cenoura-02.webp", import.meta.url).href,
  "assets/images/bolo-cenoura-03.webp": new URL("../assets/images/bolo-cenoura-03.webp", import.meta.url).href,
  "assets/images/torta-cacau-02.webp": new URL("../assets/images/torta-cacau-02.webp", import.meta.url).href,
  "assets/images/torta-cacau-03.webp": new URL("../assets/images/torta-cacau-03.webp", import.meta.url).href
};

if (elementoAno) {
  elementoAno.textContent = new Date().getFullYear();
}

function criarMensagemResultado(quantidade) {
  return quantidade === 1
    ? "1 produto exibido."
    : `${quantidade} produtos exibidos.`;
}

function obterProdutosVisiveis() {
  return produtosCardapio.filter((produto) => !produto.hidden);
}

function obterPosicaoProduto(produto) {
  if (
    typeof produto.getBoundingClientRect === "function" &&
    typeof listaCardapio.getBoundingClientRect === "function"
  ) {
    return (
      listaCardapio.scrollLeft +
      produto.getBoundingClientRect().left -
      listaCardapio.getBoundingClientRect().left
    );
  }

  return produto.offsetLeft - listaCardapio.offsetLeft;
}

function atualizarControlesCarrossel() {
  if (!listaCardapio || !botaoAnterior || !botaoProximo) {
    return;
  }

  const limiteFinal = Math.max(0, listaCardapio.scrollWidth - listaCardapio.clientWidth);
  const tolerancia = 1;

  botaoAnterior.disabled = listaCardapio.scrollLeft <= tolerancia;
  botaoProximo.disabled = listaCardapio.scrollLeft >= limiteFinal - tolerancia;
}

function rolarCarrosselPara(posicao) {
  if (!listaCardapio) {
    return;
  }

  const limiteFinal = Math.max(0, listaCardapio.scrollWidth - listaCardapio.clientWidth);
  const destino = Math.min(Math.max(0, posicao), limiteFinal);

  if (typeof listaCardapio.scrollTo === "function") {
    listaCardapio.scrollTo({ left: destino });
  } else {
    listaCardapio.scrollLeft = destino;
  }
}

function navegarCarrossel(direcao) {
  const produtosVisiveis = obterProdutosVisiveis();

  if (!listaCardapio || produtosVisiveis.length === 0) {
    return;
  }

  const indiceAtual = produtosVisiveis.reduce((indiceMaisProximo, produto, indice) => {
    const distanciaAtual = Math.abs(obterPosicaoProduto(produto) - listaCardapio.scrollLeft);
    const distanciaMaisProxima = Math.abs(
      obterPosicaoProduto(produtosVisiveis[indiceMaisProximo]) - listaCardapio.scrollLeft
    );

    return distanciaAtual < distanciaMaisProxima ? indice : indiceMaisProximo;
  }, 0);
  const novoIndice = Math.min(
    Math.max(0, indiceAtual + direcao),
    produtosVisiveis.length - 1
  );

  rolarCarrosselPara(obterPosicaoProduto(produtosVisiveis[novoIndice]));
}

function reiniciarCarrossel() {
  if (!listaCardapio) {
    return;
  }

  rolarCarrosselPara(0);
  atualizarControlesCarrossel();
}

function aplicarFiltro(categoria, botaoAtivo) {
  let quantidadeVisivel = 0;

  produtosCardapio.forEach((produto) => {
    const deveExibir =
      categoria === "todos" || produto.dataset.categoria === categoria;

    produto.hidden = !deveExibir;

    if (deveExibir) {
      quantidadeVisivel += 1;
    }
  });

  filtrosCardapio.querySelectorAll("button[data-filtro]").forEach((botao) => {
    const estaAtivo = botao === botaoAtivo;

    botao.classList.toggle("ativo", estaAtivo);
    botao.setAttribute("aria-pressed", String(estaAtivo));
  });

  resultadoCardapio.textContent = criarMensagemResultado(quantidadeVisivel);
  reiniciarCarrossel();
}

function iniciarFiltrosCardapio() {
  if (!filtrosCardapio || !resultadoCardapio || produtosCardapio.length === 0) {
    return;
  }

  filtrosCardapio.hidden = false;
  resultadoCardapio.hidden = false;
  resultadoCardapio.textContent = criarMensagemResultado(produtosCardapio.length);

  filtrosCardapio.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-filtro]");

    if (!botao || !filtrosCardapio.contains(botao)) {
      return;
    }

    aplicarFiltro(botao.dataset.filtro, botao);
  });
}

function iniciarCarrosselCardapio() {
  if (
    !carrosselCardapio ||
    !listaCardapio ||
    !controlesCarrossel ||
    !botaoAnterior ||
    !botaoProximo ||
    produtosCardapio.length === 0
  ) {
    return;
  }

  carrosselCardapio.classList.add("carrossel-ativo");
  controlesCarrossel.hidden = false;

  botaoAnterior.addEventListener("click", () => navegarCarrossel(-1));
  botaoProximo.addEventListener("click", () => navegarCarrossel(1));
  listaCardapio.addEventListener("scroll", atualizarControlesCarrossel, {
    passive: true
  });

  if (typeof ResizeObserver !== "undefined") {
    const observadorTamanho = new ResizeObserver(atualizarControlesCarrossel);
    observadorTamanho.observe(listaCardapio);
  } else {
    globalThis.addEventListener?.("resize", atualizarControlesCarrossel);
  }

  atualizarControlesCarrossel();
}

function preCarregarImagem(caminho) {
  if (!caminho || typeof Image === "undefined") {
    return;
  }

  const imagem = new Image();
  imagem.src = caminho;
}

function iniciarGaleria(galeria) {
  const imagem = galeria.querySelector(".produto-imagem");
  const controles = galeria.querySelector(".controles-galeria");
  const anterior = galeria.querySelector(".galeria-anterior");
  const proxima = galeria.querySelector(".galeria-proxima");
  const indicador = galeria.querySelector(".indicador-galeria");
  const caminhos = (galeria.dataset.imagens || "")
    .split("|")
    .filter(Boolean)
    .slice(0, 5)
    .map((caminho, indice) => {
      // O Vite resolve o src inicial do HTML para o asset gerado no build.
      // Não sobrescreva esse URL por um caminho de desenvolvimento.
      if (indice === 0) {
        return imagem.src || caminho;
      }
      return imagensComplementares[caminho] || caminho;
    });
  const textosAlternativos = (galeria.dataset.alts || "").split("|").slice(0, 5);
  let indiceAtual = 0;

  if (
    !imagem ||
    !controles ||
    !anterior ||
    !proxima ||
    !indicador ||
    caminhos.length <= 1 ||
    caminhos.length !== textosAlternativos.length
  ) {
    return;
  }

  function atualizarGaleria(devePreCarregar = true) {
    imagem.src = caminhos[indiceAtual];
    imagem.alt = textosAlternativos[indiceAtual];
    indicador.textContent = `${indiceAtual + 1} de ${caminhos.length}`;
    anterior.disabled = indiceAtual === 0;
    proxima.disabled = indiceAtual === caminhos.length - 1;

    if (devePreCarregar) {
      preCarregarImagem(caminhos[indiceAtual + 1]);
    }
  }

  controles.hidden = false;
  anterior.addEventListener("click", () => {
    indiceAtual = Math.max(0, indiceAtual - 1);
    atualizarGaleria();
  });
  proxima.addEventListener("click", () => {
    indiceAtual = Math.min(caminhos.length - 1, indiceAtual + 1);
    atualizarGaleria();
  });

  atualizarGaleria(false);
}

function iniciarGaleriasProdutos() {
  galeriasProdutos.forEach(iniciarGaleria);
}

iniciarFiltrosCardapio();
iniciarCarrosselCardapio();
iniciarGaleriasProdutos();
