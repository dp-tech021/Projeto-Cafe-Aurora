# Café Aurora

Site demonstrativo de uma cafeteria fictícia, desenvolvido como projeto de
portfólio com HTML5, CSS3 e JavaScript puro.

**Versão publicada:** https://dp-tech021.github.io/Projeto-Cafe-Aurora/


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
├── docs/
│   └── HOMOLOGACAO.md
├── MANIFESTO.json
├── MAPA_IMAGENS.md
├── package.json
├── package-lock.json
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
- `MANIFESTO.json` e `MAPA_IMAGENS.md`: origem e associação das novas fotos.
- `js/script.js`: carrossel, galerias, filtros e atualização do ano do rodapé.

## Como abrir localmente

Instale Node.js 20.19+ ou 22.12+, npm e Git. Em um terminal:

```bash
git clone https://github.com/dp-tech021/Projeto-Cafe-Aurora.git
cd Projeto-Cafe-Aurora
npm ci
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
  mantém a grade do cardápio sem JavaScript e distribui a seção de contato.
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

As oito fotografias originais e as 12 imagens complementares são recursos
locais em WebP e têm finalidade meramente ilustrativa, sem depender de CDN ou
servidores externos. As imagens abaixo da dobra usam carregamento tardio; cada
galeria começa apenas com a foto original e carrega a foto selecionada sob
demanda. Depois de uma interação, a próxima foto é pré-carregada quando existe.

As fontes, autores, links originais e condições de uso estão registrados em
[`assets/IMAGES.md`](assets/IMAGES.md). As 12 fotos complementares são imagens
geradas por IA e estão documentadas separadamente, sem atribuição de licença
Pexels. Nenhuma imagem representa um produto ou estabelecimento real.

## Carrossel, galerias e filtros do cardápio

O cardápio contém seis produtos demonstrativos distribuídos entre cafés,
bebidas geladas e sobremesas. Os botões **Todos**, **Cafés**, **Gelados** e
**Sobremesas** filtram os cards no navegador, sem recarregar a página.

Com JavaScript disponível, os seis produtos formam um carrossel horizontal com
rolagem nativa, `scroll-snap` e botões **Anterior** e **Próximo**. Cada comando
avança um produto; as setas ficam desabilitadas nos extremos. O layout mostra
um card no celular, até dois no tablet e até três no desktop e também aceita o
gesto horizontal em telas sensíveis ao toque.

Cada produto possui uma galeria independente de três fotos, limitada por código
a no máximo cinco. Seus botões circulares navegam apenas as fotos daquele card,
mostram a posição atual e não alteram o carrossel ou outra galeria. O quadro tem
proporção estável e usa `object-fit: contain` e `object-position: center` para
exibir a foto inteira, sem deformação ou corte.

O JavaScript identifica cada produto pelo atributo `data-categoria`, alterna o
atributo `hidden` dos cards e atualiza `aria-pressed` para comunicar qual botão
está ativo. Uma região com `aria-live` também informa quantos produtos estão
visíveis após cada seleção. Ao trocar de categoria, o carrossel retorna ao
primeiro produto e recalcula os estados das setas; cards ocultos não participam
do espaço nem dos cálculos de navegação.

Os seis produtos e suas primeiras fotos fazem parte do HTML. Filtros, setas do
carrossel e controles das galerias começam ocultos e só aparecem após o
JavaScript inicializar. Sem o script, o cardápio completo permanece disponível
em uma grade responsiva, com uma foto, nome, preço e descrição por produto.

## Como testar o cardápio

1. Execute `npm ci`, `npm test` e `npm run build`.
2. Inicie com `npm run dev` e abra a URL indicada pelo Vite.
3. Confira o layout e a ausência de rolagem horizontal da página em 375, 768 e
   1440 px; devem aparecer respectivamente um, até dois e até três cards.
4. Navegue o carrossel e cada galeria até os extremos e confirme os estados
   desabilitados, indicadores e independência entre controles.
5. Teste as categorias e as contagens 6, 2, 2 e 2; toda troca deve reposicionar
   o carrossel no início.
6. Use Tab, Enter e Espaço, ative `prefers-reduced-motion`, teste o gesto de
   deslizar, confira Console/Network e desabilite JavaScript para validar a
   alternativa progressiva.

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

O build utiliza caminhos relativos para funcionar em hospedagem sob subdiretórios, como GitHub Pages. As verificações de teste e build também são executadas pelo workflow em `.github/workflows/validate.yml` quando habilitado. Consultem `AGENTS.md` para o fluxo em dupla.

O arquivo `package-lock.json` foi gerado com npm no GitHub Actions e versionado, fixando as dependências transitivas. Para instalações reproduzíveis, utilize `npm ci`, inclusive na CI. Se alterar dependências, execute `npm install` e inclua a atualização do lockfile no mesmo PR.

## CI e publicação

- `.github/workflows/validate.yml`: valida pushes na `main`, branches de trabalho e PRs, executando `npm ci`, `npm test` e `npm run build`.
- `.github/workflows/deploy-pages.yml`: após integração na `main`, executa testes, gera `dist/` e publica pelo GitHub Pages.
- A instalação e o build não exigem credenciais, serviços pagos ou variáveis secretas.

**Para habilitar a publicação**, um administrador deve acessar [Settings → Pages](https://github.com/dp-tech021/Projeto-Cafe-Aurora/settings/pages), selecionar **GitHub Actions** como fonte e conferir as permissões do Actions. Um PR não publica o site automaticamente: o deploy inicia após merge na `main`.

O workflow do GitHub Pages [concluiu com sucesso](https://github.com/dp-tech021/Projeto-Cafe-Aurora/actions/runs/42519211564) em 08/11/2026 e informou o endereço público indicado no início deste README. Verifiquem manualmente no navegador se as imagens, links e filtros funcionam na versão publicada.

## Homologação e colaboração

Sigam [docs/HOMOLOGACAO.md](docs/HOMOLOGACAO.md) para validar visualmente as larguras 360/768/1440 px, filtros, navegação por teclado, imagens, console e página pública. O checklist manual deve registrar evidências antes de considerar o site concluído.

**Importante:** a `main` precisa ser protegida manualmente em [Settings → Branches](https://github.com/dp-tech021/Projeto-Cafe-Aurora/settings/branches), com exigência de PR, status de CI e aprovação da outra pessoa. Cada desenvolvedor deve usar sua própria conta GitHub para que a revisão seja independente.

