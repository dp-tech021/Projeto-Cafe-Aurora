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
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

- `index.html`: estrutura e conteúdo principal do site.
- `css/style.css`: identidade visual, layout responsivo e estados de interação.
- `js/script.js`: atualização automática do ano exibido no rodapé.

## Como abrir localmente

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` em um navegador moderno.

Não é necessário instalar dependências ou executar um servidor, pois o projeto
utiliza somente recursos nativos do navegador.

## Decisões de design e responsividade

- A interface segue uma abordagem **mobile-first**: os estilos base atendem
  telas pequenas e os breakpoints de `40rem` e `64rem` ampliam o layout de
  forma progressiva.
- A paleta usa tons de café, creme, bege e verde-escuro. As cores, os
  espaçamentos, os raios e as sombras ficam centralizados em variáveis CSS para
  manter consistência e facilitar futuras alterações.
- Flexbox organiza o cabeçalho e a navegação, enquanto CSS Grid distribui os
  cards do cardápio e o conteúdo da seção de contato em telas maiores.
- Os títulos usam uma pilha de fontes serifadas do sistema e o texto usa fontes
  sem serifa, sem baixar arquivos ou depender de serviços externos.
- Links possuem foco visível e a página oferece um atalho “Pular para o
  conteúdo” para facilitar a navegação por teclado.
- Rolagem suave e transições são aplicadas apenas quando o navegador informa
  que o usuário não solicitou redução de movimento.
- Elementos flexíveis, quebras de texto e colunas com largura mínima zero
  evitam rolagem horizontal em telas estreitas.

## Aviso

O Café Aurora é um projeto fictício criado exclusivamente para fins de estudo e
portfólio. Os nomes, o endereço e os dados de contato são demonstrativos.
