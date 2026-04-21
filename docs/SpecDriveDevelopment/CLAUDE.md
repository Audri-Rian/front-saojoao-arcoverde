# CLAUDE.md — Instruções para agentes de IA

Este repositório segue **Spec-Driven Development (SDD)**. Leia estas instruções antes de executar qualquer tarefa.

## Regra fundamental

**Nunca comece a codar sem uma spec validada.** O fluxo obrigatório é:

```
Ideia → Spec (feature) → Gate 1 → Specs filhas → Gate 2 → Código
```

## Antes de implementar qualquer feature

1. **Verifique se a spec existe:** procure em `docs/specs/features/<slug>.md`.
2. **Se não existir:** crie usando o template `docs/template/feature.md`. Preencha TODAS as seções como questionário (respondendo as perguntas), não como texto livre.
3. **Valide o Gate 1:** a seção "Gate 1 — Checklist de validação" no final do feature.md deve ter todos os itens marcados como "Sim" antes de avançar.
4. **Expanda em artefatos filhos** (só após Gate 1 aprovado):
   - Flow → `docs/template/flow.md`
   - API → `docs/template/api.md`
   - Page → `docs/template/page.md`
   - UI Component → `docs/template/uiComponent.md`
   - Modal → `docs/template/modal.md`
   - Backend Structure → `docs/template/backsctructure.md`
5. **Valide o Gate 2:** use o template `docs/template/gate2.md` para verificar consistência entre todos os artefatos.
6. **Só então implemente.**

## Estrutura de pastas para specs

```
docs/specs/
├── features/    → specs de feature (ponto de partida)
├── flows/       → jornadas e fluxos
├── api/         → contratos de API
├── pages/       → specs de tela
├── ui/          → componentes de UI
├── modals/      → specs de modais
└── backend/     → estrutura de backend
```

## Como preencher templates

- Cada template é um **questionário**. Responda em **Resposta:** abaixo de cada bloco de perguntas.
- Não deixe seções em branco. Se não souber, escreva a dúvida em "Dúvidas em aberto".
- Texto vago = spec inválida. Seja específico: tipos, valores, mensagens de erro exatas.
- Todo artefato filho deve referenciar a feature pai no topo (`slug_da_feature`).

## Convenção de branches e PRs

- Branch: `feature/<slug>` (ex: `feature/criar-pedido`)
- Commits e PRs devem referenciar o slug da feature
- PR deve listar quais specs foram criadas/alteradas

## Ciclo de vida das specs

- Specs são **documentos vivos**: se a realidade muda, atualize a spec PRIMEIRO, depois o código.
- Nunca altere código sem atualizar a spec correspondente.
- Specs obsoletas devem ser marcadas com `> **Status:** Deprecada — substituída por [novo-slug]` no topo.

## Referências

- Documentação completa: `docs/contexto-geral/contexto-geral.md`
- Fluxo detalhado: `docs/targeting/direcionamento-sdd.md`
- Templates: `docs/template/`
- Exemplo preenchido: `docs/exemplos/`
