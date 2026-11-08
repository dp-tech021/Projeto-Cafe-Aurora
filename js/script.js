const elementoAno = document.querySelector("#ano-atual");
const filtrosCardapio = document.querySelector(".filtros-cardapio");
const resultadoCardapio = document.querySelector(".resultado-cardapio");
const produtosCardapio = [...document.querySelectorAll(".itens-cardapio article")];

if (elementoAno) {
  elementoAno.textContent = new Date().getFullYear();
}

function criarMensagemResultado(quantidade) {
  return quantidade === 1
    ? "1 produto exibido."
    : `${quantidade} produtos exibidos.`;
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

iniciarFiltrosCardapio();
