# Orientações para desenvolvedores e Codex

## Contexto
- Projeto Café Aurora: site institucional fictício de cafeteria para portfólio.
- Stack estabelecida: HTML semântico, CSS e JavaScript; Vite apenas para desenvolvimento e build.
- Não migrar para React/TypeScript sem decisão registrada e revisão da dupla.
- Sem backend, login, pagamento, coleta de dados pessoais ou serviços pagos.

## Trabalho em dupla (inclusive duas sessões Codex)
1. Antes de editar: `git fetch origin`, `git switch main`, `git pull --ff-only origin main`.
2. Cada tarefa usa uma branch própria a partir de `main`: `feat/<resumo>`, `fix/<resumo>` ou `chore/<resumo>`.
3. Nunca trabalhar diretamente em `main`, nunca dar force-push em branch compartilhada.
4. Cada pessoa/Codex trabalha em branch separada, com tarefas e arquivos preferencialmente distintos.
5. Commits pequenos, com motivo claro; revisar `git diff` antes de publicar.
6. Abrir Pull Request para `main`; a outra pessoa revisa o diff e testa antes do merge.
7. Não fazer merge automático. Se houver conflitos, atualizar a branch e resolver com revisão humana.

## Regras de alteração
- Examinar os arquivos existentes antes de modificar, sem recriar o projeto do zero.
- Preservar conteúdo, seções, links, estilos e acessibilidade existentes.
- Preferir mudanças menores; explicar decisões e riscos no PR.
- Não adicionar bibliotecas, APIs, imagens externas ou serviços sem justificativa.
- Nunca inserir tokens, senhas, chaves, dados reais ou arquivos `.env` no repositório ou em prompts.
- Não confiar cegamente em código gerado por IA: inspecionar cada mudança e dependência.
- Manter textos visíveis em português do Brasil e dados da cafeteria explicitamente fictícios.

## Verificações antes do PR
- `npm install` (até existir lockfile; depois usar `npm ci`).
- `npm test`: testes básicos.
- `npm run build`: geração de `dist/` sem erro.
- `npm run dev`: navegar por Início, Cardápio, Sobre e Contato; conferir mobile e console.
- Anotar no PR quais verificações foram de fato executadas e quais ficaram pendentes.
- Não commitar `node_modules/` ou `dist/`.

## Critério de conclusão
PR com resumo, arquivos alterados, evidências de testes, riscos e revisão da outra pessoa. Não modificar `main` sem aprovação.
