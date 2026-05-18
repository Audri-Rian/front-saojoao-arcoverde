---
name: commit-message
description: Padrão simples de mensagens de commit. Use ao final de QUALQUER implementação para gerar a mensagem de commit que o dev vai copiar/colar. Valida apenas que a mensagem começa com um tipo válido seguido de ':' e uma descrição não vazia.
---

# Padrão de Mensagens de Commit

## Formato

```
<tipo>: <descrição>
```

O escopo `(escopo)` é **opcional**. Qualquer descrição não vazia é aceita — não há regras de caixa, pontuação, idioma ou comprimento.

## Tipos Válidos

| Tipo       | Uso                      |
| ---------- | ------------------------ |
| `feat`     | Nova funcionalidade      |
| `fix`      | Correção de bug          |
| `refactor` | Refatoração              |
| `perf`     | Performance              |
| `style`    | Formatação               |
| `test`     | Testes                   |
| `docs`     | Documentação             |
| `chore`    | Dependências, configs    |
| `ci`       | CI/CD                    |
| `build`    | Build                    |
| `revert`   | Reverter commit anterior |

## Exemplos válidos

```
feat: adiciona login
fix: corrige timeout
refactor: simplifica hook
chore: atualiza dependências
feat(auth): login com Google
```

## Corpo (opcional)

Separado da descrição por uma linha em branco. Use para explicar o **porquê** quando não for óbvio.

## Output esperado ao final de uma task

Sempre termine retornando um bloco assim:

```
## Mensagem de commit

<bloco de código com a mensagem>

## Comando

git add <arquivos>
git commit -m "<mensagem>"
```
