const elementoAno = document.querySelector("#ano-atual");
const filtrosCardapio = document.querySelector(".filtros-cardapio");
const resultadoCardapio = document.querySelector(".resultado-cardapio");
const carrosselCardapio = document.querySelector(".carrossel-cardapio");
const listaCardapio = document.querySelector(".itens-cardapio");
const controlesCarrossel = document.querySelector(".controles-carrossel");
const botaoAnterior = document.querySelector(".controle-anterior");
const botaoProximo = document.querySelector(".controle-proximo");
const produtosCardapio = [...document.querySelectorAll(".itens-cardapio article")];

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

function rolarPara(posicao) {
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

  if (produtosVisiveis.length === 0) {
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

  rolarPara(obterPosicaoProduto(produtosVisiveis[novoIndice]));
}

function reiniciarCarrossel() {
  if (!listaCardapio) {
    return;
  }

  rolarPara(0);
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

iniciarFiltrosCardapio();
iniciarCarrosselCardapio();
