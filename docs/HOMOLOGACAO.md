# Homologação final — Café Aurora

Este checklist é manual. Não marque um teste como aprovado sem executá-lo. Em caso de erro, anote navegador, largura, comportamento esperado, comportamento observado e imagem do problema no Pull Request.

## 1. Preparação (pessoa 1)

Use Node.js compatível com o `package.json` e execute, na raiz do repositório:

```bash
git switch main
git pull --ff-only origin main
npm ci
npm test
npm run build
npm run dev
```

**Atenção:** antes do merge do PR de homologação, os comandos `npm ci` e o deploy dependem da branch do PR, porque o lockfile ainda não está na `main`. Para testar esse PR, faça checkout da branch `chore/homologacao-ci-pages-20261108` depois de `git fetch origin`.

- [ ] `npm ci` termina sem erros.
- [ ] `npm test` passa.
- [ ] `npm run build` gera `dist/index.html`.
- [ ] A URL exibida por `npm run dev` abre normalmente no navegador.

## 2. Layout responsivo (pessoa 2)

Abra DevTools (F12) e use o modo de dispositivo com as larguras abaixo. Confira também a altura da tela; teste rolagem e não apenas a primeira dobra.

- [ ] 360 px: menu, títulos, imagens, preços e botões cabem na área visível, sem conteúdo cortado.
- [ ] 768 px: cards, navegação e imagens permanecem legíveis.
- [ ] 1440 px: hero e Sobre apresentam composição adequada, sem espaços excessivos ou sobreposição.
- [ ] Não há elementos inacessíveis por `overflow-x: hidden`. Se algo estiver cortado, investigar a largura real antes de esconder o overflow.
- [ ] A página não exibe imagens distorcidas ou quebradas.

## 3. Filtros e acessibilidade básica (pessoa 2)

Com JavaScript habilitado:
- [ ] **Todos** mostra 6 produtos.
- [ ] **Cafés** mostra 2 produtos.
- [ ] **Gelados** mostra 2 produtos.
- [ ] **Sobremesas** mostra 2 produtos.
- [ ] Alternar filtros mantém apenas o botão selecionado como ativo; a contagem anunciada acompanha o resultado.
- [ ] `Tab` navega por links e filtros em ordem lógica; `Enter` ou `Espaço` ativam os filtros.
- [ ] O link **Pular para o conteúdo** aparece ao receber foco e funciona.
- [ ] No DevTools, aba Console, nenhum erro JavaScript.
- [ ] Na aba Network, não há requisições 404 para CSS, JS ou imagens.

Para testar **sem JavaScript** no Chrome/Edge: abra DevTools, pressione Ctrl+Shift+P (ou Cmd+Shift+P no macOS), procure **Disable JavaScript**, selecione e recarregue a página. Reative após o teste.

- [ ] Sem JS, os 6 produtos continuam visíveis e os filtros não aparecem.
- [ ] Links internos e conteúdo principal funcionam sem JS.

## 4. Segurança e publicação (pessoa 1)

- [ ] A branch `main` exige PR e revisão por outra conta GitHub; ninguém faz push direto.
- [ ] O status check `build-and-test` está definido como obrigatório, depois que seu nome estiver estável na `main`.
- [ ] Settings → Pages → Build and deployment → Source está em **GitHub Actions**.
- [ ] Após integrar e publicar, o workflow `Publicar Café Aurora no GitHub Pages` conclui com sucesso.
- [ ] A URL pública abre em HTTPS e carrega oito imagens, cardápio e filtros, sem 404.
- [ ] O README contém o link definitivo da página publicada, depois de confirmada.
- [ ] Nenhuma senha, token, chave de API ou dado pessoal foi commitado.

## 5. Registro final

Anotem no PR:
- Data e responsável por cada teste.
- Navegador(es) e sistema operacional testados.
- Link da execução de CI e, quando existir, do deploy.
- Erros encontrados e PRs que os corrigiram.
- Decisão final: **Aprovado** ou **Reprovado**, com justificativa.

A integração da branch na `main` é uma etapa distinta; não substitui os testes manuais.
