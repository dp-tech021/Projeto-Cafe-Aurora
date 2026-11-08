# Café Aurora

Site demonstrativo de uma cafeteria fictícia, desenvolvido como projeto de
portfólio com HTML5, CSS3 e JavaScript puro.

## Objetivo

Apresentar uma página institucional simples e semântica com informações sobre
a cafeteria, sugestões de cardápio, uma breve apresentação e dados de contato
demonstrativos.

## Estrutura do projeto

```text
Projeto-Cafe-Aurora/
├── assets/
│   ├── images/
│   └── IMAGES.md
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

- `index.html`: estrutura e conteúdo principal do site.
- `assets/images/`: fotografias locais otimizadas no formato WebP.
- `assets/IMAGES.md`: créditos, origem e licença de cada fotografia.
- `css/style.css`: identidade visual, layout responsivo e estados de interação.
- `js/script.js`: carrossel, filtros do cardápio e atualização automática do ano do rodapé.

## Como abrir localmente

Instale Node.js 20.19+ ou 22.12+, npm e Git. Em um terminal:

```bash
git clone https://github.com/dp-tech021/Projeto-Cafe-Aurora.git
cd Projeto-Cafe-Aurora
npm install
npm run dev
```

Abra a URL exibida no terminal (normalmente `http://localhost:5173`). Como o JavaScript é carregado como módulo, não use `file://` para conferir a versão com Vite.

## Decisões de design e responsividade

- A interface segue uma abordagem **mobile-first**: os estilos base atendem
  telas pequenas e os breakpoints de `40rem` e `64rem` ampliam o layout de
  forma progressiva.
- A paleta usa tons de café, creme, bege e verde-escuro. As cores, os
  espaçamentos, os raios e as sombras ficam centralizados em variáveis CSS para
  manter consistência e facilitar futuras alterações.
- Flexbox organiza o cabeçalho, a navegação e o carrossel, enquanto CSS Grid
  mantém a lista do cardápio sem JavaScript e distribui o conteúdo da seção de
  contato em telas maiores.
- Os títulos usam uma pilha de fontes serifadas do sistema e o texto usa fontes
  sem serifa, sem baixar arquivos ou depender de serviços externos.
- Links possuem foco visível e a página oferece um atalho “Pular para o
  conteúdo” para facilitar a navegação por teclado.
- Rolagem suave e transições são aplicadas apenas quando o navegador informa
  que o usuário não solicitou redução de movimento.
- Elementos flexíveis, quebras de texto e colunas com largura mínima zero
  evitam rolagem horizontal em telas estreitas.
- O hero e a seção Sobre usam duas colunas apenas em telas amplas. Em telas
  menores, texto e fotografia são empilhados para preservar a leitura.

## Imagens

As oito fotografias são recursos locais em WebP e têm finalidade meramente
ilustrativa. Elas foram redimensionadas e comprimidas para reduzir o tempo de
carregamento, sem depender de servidores externos. As imagens abaixo da dobra
usam carregamento tardio; a imagem principal é priorizada por fazer parte do
conteúdo inicial da página.

As fontes, autores, links originais e condições de uso estão registrados em
[`assets/IMAGES.md`](assets/IMAGES.md). As fotografias não representam um
estabelecimento, produtos ou instalações reais do Café Aurora, que é fictício.

## Carrossel e filtros do cardápio

O cardápio contém seis produtos demonstrativos distribuídos entre cafés,
bebidas geladas e sobremesas. Os botões **Todos**, **Cafés**, **Gelados** e
**Sobremesas** filtram os cards no navegador, sem recarregar a página.

Com JavaScript disponível, os produtos formam um carrossel horizontal com
rolagem nativa, `scroll-snap` e botões **Anterior** e **Próximo**. Cada comando
avança um produto; as setas ficam desabilitadas nos extremos. A largura dos
cards permite visualizar um item no celular, dois no tablet e três no desktop.
Em telas sensíveis ao toque, a própria área do cardápio aceita o gesto de
deslizar. O carrossel não usa rotação automática nem bibliotecas externas e
respeita a preferência por movimento reduzido do sistema.

O JavaScript identifica cada produto pelo atributo `data-categoria`, alterna o
atributo `hidden` dos cards e atualiza `aria-pressed` para comunicar qual botão
está ativo. Uma região com `aria-live` também informa quantos produtos estão
visíveis após cada seleção. Ao trocar de categoria, o carrossel retorna ao
primeiro produto e recalcula os estados das setas; cards ocultos deixam de
ocupar espaço e não participam da navegação. Os eventos dos filtros ficam
centralizados no grupo de botões para evitar repetição de código.

Os seis produtos fazem parte do HTML. Os controles de filtro começam ocultos e
só aparecem depois que o JavaScript é inicializado; o mesmo vale para os
controles do carrossel. Assim, se o script não carregar, o cardápio completo
continua disponível e legível em uma lista ou grade responsiva.

## Como testar o cardápio

1. Execute `npm install`, `npm test` e `npm run build`.
2. Inicie o site com `npm run dev` e abra a URL indicada pelo Vite.
3. Em aproximadamente 1440 px, 768 px e 375 px, confira respectivamente até
   três, dois e um card por vez; navegue até os dois extremos.
4. Teste todas as categorias, conferindo as contagens 6, 2, 2 e 2 e o retorno
   ao primeiro item depois de cada troca.
5. Em uma tela sensível ao toque ou na emulação móvel do navegador, deslize a
   lista horizontalmente. Use também Tab, Enter e Espaço nos controles.
6. Ative `prefers-reduced-motion`, confira o console e desabilite o JavaScript
   para verificar a grade completa como alternativa progressiva.

## Aviso

O Café Aurora é um projeto fictício criado exclusivamente para fins de estudo e
portfólio. Os nomes, o endereço e os dados de contato são demonstrativos.


## Ferramentas de desenvolvimento e colaboração

O site continua em HTML, CSS e JavaScript puro; **Vite 8.3.6** serve apenas para desenvolver e gerar a versão estática. Não há React ou TypeScript. Não são necessários serviços pagos.

```bash
npm test        # testes de navegação, imagens e filtros
npm run build   # gera a pasta dist/ com os arquivos para publicação
npm run preview # abre a versão de produção localmente
```

O build utiliza caminhos relativos para funcionar em hospedagem sob subdiretórios, como GitHub Pages. As verificações de teste e build também são executadas pelo workflow em `.github/workflows/validate.yml` quando habilitado. Consultem `AGENTS.md` para o fluxo em dupla. O `package-lock.json` versionado fixa as dependências transitivas; em ambientes de CI, prefira `npm ci`.
