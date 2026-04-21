# Quality Pipeline — Kit de Qualidade de Código

> **O que é isso?** Um conjunto de arquivos prontos que você joga em qualquer projeto para garantir que **todo commit** passa por lint, formatação e validação de mensagem — funcione com qualquer IA que você usa (Claude Code, Cursor, ChatGPT, Gemini, Copilot, etc.).

---

## 🎯 Pra que serve

```
Você escreve código
       ↓
Salva arquivo        → VS Code formata automaticamente
       ↓
git commit           → Hooks validam lint + format + mensagem
       ↓              (se algo falha, commit é bloqueado)
Revisão pela IA      → /review-full analisa segurança e performance
       ↓
git push             → Hook valida TypeScript
       ↓
Código vai pro repo limpo ✨
```

Em uma frase: **você nunca mais commita código quebrado, mal-formatado ou com mensagem ruim.**

---

## 📦 O que vem no kit

| Arquivo                     | Pra que serve                                          |
| --------------------------- | ------------------------------------------------------ |
| `.husky/pre-commit`         | Roda lint + format antes de cada commit                |
| `.husky/commit-msg`         | Valida se a mensagem de commit segue o padrão          |
| `.husky/pre-push`           | Valida TypeScript antes de push                        |
| `.husky/post-commit`        | Lembrete visual pra usar os reviewers da IA            |
| `.prettierrc`               | Regras de formatação (aspas, indentação, etc.)         |
| `.lintstagedrc.json`        | Aplica prettier só nos arquivos modificados            |
| `commitlint.config.js`      | Regras de mensagem de commit (feat/fix/chore etc.)     |
| `.editorconfig`             | Configuração universal de editor                       |
| `.vscode/`                  | Settings + extensões recomendadas                      |
| `.claude/agents/`           | Revisores automáticos (security + performance)         |
| `.claude/commands/`         | Comandos `/review-full`, `/review-security` etc.       |
| `.claude/skills/`           | Regras do projeto que a IA lê automaticamente          |
| `AGENT.md` _(gerado)_       | Versão universal das regras (pra Cursor/ChatGPT/etc.)  |

---

## 🚀 Instalação (3 passos)

### 1. Abra um terminal dentro do seu projeto

```bash
cd ~/Github/meu-projeto
```

> ⚠️ O projeto precisa ser um **repositório git** (`git init`) e ter `package.json` (`npm init -y`).

### 2. Rode o instalador

```bash
bash docs/claude-quality-pipeline/install.sh
```

O script vai:

1. ✅ Detectar seu package manager (npm, pnpm ou yarn)
2. ✅ Instalar as dependências necessárias
3. ✅ Copiar todos os arquivos de configuração
4. ✅ Inicializar o Husky e ativar os hooks

### 3. Adicione estes scripts no `package.json`

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "lint:fix-safe": "eslint . --fix --fix-type directive",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc --noEmit"
}
```

> 💡 Se for um projeto Expo/React Native, troque `eslint .` por `expo lint`.

**Pronto.** Faça `git commit --allow-empty -m "chore: testa hooks"` pra confirmar que funcionou.

---

## 🔁 Como usar no dia-a-dia

```
┌───────────────────────────────────────────────────────────────┐
│  1. CODIFICAR                                                  │
│     Escreve código. Salva arquivo (VS Code formata sozinho).   │
├───────────────────────────────────────────────────────────────┤
│  2. COMMIT                                                     │
│     git add .                                                  │
│     git commit -m "feat(tela): adiciona login"                 │
│     → Hook valida lint, format e mensagem                      │
│     → Se falhar, conserta e tenta de novo                      │
├───────────────────────────────────────────────────────────────┤
│  3. REVISAR (opcional, mas recomendado)                        │
│     No Claude Code:  /review-full                              │
│     Nas outras IAs:  peça "revise segurança e performance"     │
├───────────────────────────────────────────────────────────────┤
│  4. PUSH                                                       │
│     git push                                                   │
│     → Hook valida TypeScript                                   │
└───────────────────────────────────────────────────────────────┘
```

---

## 🤖 Funciona com qualquer IA?

**Sim.** O que muda é só como você "apresenta" o projeto pra ela.

A pasta `.claude/` só funciona no **Claude Code** (lê automaticamente). Pra outras IAs, use o arquivo **`AGENT.md`** que o instalador gera — copie o conteúdo no system prompt/instruções da sua IA.

| Ferramenta               | Como usar                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**          | Plug-and-play. Detecta `.claude/` automaticamente. Use `/review-full`, `/review-security`, `/review-performance`.             |
| **Cursor**               | Renomeie `AGENT.md` pra `.cursorrules` na raiz (ou aponte em Settings → Rules for AI).                                        |
| **ChatGPT / Gemini**     | Cole o conteúdo de `AGENT.md` como **Custom Instruction** ou no primeiro prompt da conversa.                                  |
| **GitHub Copilot Chat**  | Crie `.github/copilot-instructions.md` com o conteúdo de `AGENT.md`.                                                          |
| **Windsurf / Cody / etc.** | Qualquer IA aceita texto — cole `AGENT.md` no local de "instruções do projeto".                                             |

> 💡 **Regra geral:** toda IA de código moderna tem um slot de "regras do projeto". Joga o `AGENT.md` lá.

### Pedindo revisão em IAs que não são Claude Code

Nos reviewers (security / performance) são só **prompts estruturados**. Copie o conteúdo de `.claude/agents/security-reviewer.md` ou `performance-reviewer.md` e cole na sua IA pedindo pra analisar os arquivos staged:

```
git diff --cached | pbcopy   # copia o diff
```

Cole o diff + o conteúdo do agente → a IA faz a revisão igual.

---

## 📖 Referência rápida de comandos

```bash
# Dia-a-dia
npm run lint              # checa erros de código
npm run lint:fix          # conserta o que dá pra consertar sozinho
npm run format            # formata todos os arquivos
npm run format:check      # só verifica (não altera)
npm run typecheck         # valida TypeScript

# Hooks (rodam automaticamente, mas dá pra forçar)
npx lint-staged           # format nos arquivos staged
npx commitlint --edit     # valida mensagem de commit
```

---

## ❓ Perguntas frequentes

**"E se o hook bloquear meu commit?"**
Leia a mensagem de erro. Normalmente é lint ou formatação — rode `npm run lint:fix` e `npm run format`, aí commit de novo.

**"Preciso bypassar o hook num commit de emergência?"**
`git commit --no-verify -m "..."` — mas **evite**. Se fizer, abre uma task pra corrigir depois.

**"Como formato a mensagem de commit?"**
```
<tipo>(<escopo>): <descrição em pt-BR, minúscula, sem ponto>

feat(auth): adiciona login com google
fix(api): corrige timeout em /users
chore: atualiza dependências
```
Tipos válidos: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `chore`, `ci`, `build`, `revert`.

**"Posso customizar as regras?"**
Sim. Edite `.prettierrc`, `commitlint.config.js`, `.husky/*`. Os agents em `.claude/agents/` também são só markdown — mude o que quiser.

**"Como adapto o `AGENT.md` pro meu projeto?"**
Abra o Claude Code (ou qualquer IA) no projeto e peça:
> "Lê meu código e preenche o `AGENT.md` com a stack real, arquitetura e regras deste projeto."

---

## 🗂️ Estrutura do kit

```
docs/claude-quality-pipeline/
├── install.sh          ← o instalador
├── README.md           ← este arquivo
├── AGENT.md            ← template universal de instruções pra IA
└── templates/          ← tudo que é copiado pro seu projeto
    ├── .husky/         ← git hooks
    ├── .claude/        ← integração Claude Code
    ├── .vscode/        ← settings + extensões
    ├── .editorconfig
    ├── .prettierrc
    ├── .prettierignore
    ├── .lintstagedrc.json
    └── commitlint.config.js
```
