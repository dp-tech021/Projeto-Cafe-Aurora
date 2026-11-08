# Café Aurora

Site demonstrativo de uma cafeteria fictícia, desenvolvido como projeto de portfólio com HTML5, CSS3 e JavaScript puro. O Vite é usado somente como servidor de desenvolvimento e ferramenta de build. Não há React nem TypeScript nesta etapa porque o site já existia nessa stack.

## Pré-requisitos

- Node.js 20.19+ ou 22.12+ (recomendado Node 22 atual).
- npm (distribuído com o Node.js).
- Git.

## Instalação e execução

```bash
git clone https://github.com/dp-tech021/Projeto-Cafe-Aurora.git
cd Projeto-Cafe-Aurora
npm install
npm run dev
```

Abra o endereço local indicado pelo Vite (normalmente `http://localhost:5173`).

## Testes e build

```bash
npm test
npm run build
npm run preview
```

- `npm test`: verifica a navegação básica e a atualização do ano do rodapé.
- `npm run build`: gera a versão estática em `dist/`.
- `npm run preview`: permite conferir localmente a saída de produção.
- `dist/` e `node_modules/` não devem ser enviados ao Git.
- Ainda não há lockfile porque não foi possível instalar dependências no ambiente que preparou esta alteração. Execute `npm install` em um ambiente com acesso ao npm, revise e versione o `package-lock.json` em PR antes de substituir `npm install` por `npm ci` na CI.

## Estrutura

```text
Projeto-Cafe-Aurora/
├── .github/workflows/validate.yml  # Testes e build no GitHub Actions
├── css/style.css                  # Aparência da página
├── js/script.js                   # Comportamento simples
├── tests/site.test.mjs            # Testes automáticos com Node
├── index.html                     # Estrutura da página
├── package.json                   # Scripts e Vite
├── .gitignore                     # Arquivos locais ignorados
├── AGENTS.md                      # Regras para a dupla e os Codex
└── README.md
```

## Objetivo e conteúdo

Página institucional simples com apresentação, cardápio, seção Sobre e contato fictício. As informações da cafeteria são demonstrativas e não há serviço real.

## Fluxo de colaboração

Cada desenvolvedor utiliza sua própria branch e sessão Codex. Abrir Pull Request para `main`, solicitar revisão do outro desenvolvedor e verificar testes e build antes de integrar. Consultar [AGENTS.md](AGENTS.md) para regras completas.

## Próximas evoluções

A dupla pode avaliar React + TypeScript futuramente caso haja uma necessidade concreta de componentes interativos e estado complexo. Evitar migrar apenas por preferência tecnológica.
