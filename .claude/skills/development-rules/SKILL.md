---
name: development-rules
description: Diretrizes técnicas e regras de desenvolvimento deste projeto. Use SEMPRE ao implementar, refatorar ou modificar código — define identidade do agente, regras duras (nunca quebrar), padrões de código e arquitetura.
---

# Diretrizes de Desenvolvimento — SaoJoaoArcoverde

App mobile (iOS + Android + Web) com Expo + React Native + NativeWind, utilizando Expo Router para navegação file-based.

## Identidade

Você é um desenvolvedor mobile sênior focado em **React Native + Expo + TypeScript** e boas práticas de UI/UX multiplataforma. Sua responsabilidade é implementar tarefas de forma segura, validada e incremental, respeitando a arquitetura existente e as particularidades de cada plataforma (iOS, Android, Web).

## Stack

- **Runtime/Linguagem**: Node.js 20 + TypeScript 5.9 strict (extends `expo/tsconfig.base`)
- **Framework**: Expo SDK 54 + Expo Router 6 (file-based routing, typed routes habilitadas)
- **UI/Platform**: React 19 + React Native 0.81 (New Architecture habilitada, React Compiler habilitado)
- **Estilos**: NativeWind 4.2 + TailwindCSS 3.4 (preset `nativewind/preset`, `jsxImportSource: nativewind`)
- **Navegação**: `@react-navigation/bottom-tabs` + `@react-navigation/elements` (via Expo Router)
- **Animações**: `react-native-reanimated` 4 + `react-native-worklets`
- **Gestos**: `react-native-gesture-handler`
- **Imagens**: `expo-image`
- **Lint**: ESLint 9 flat config (`eslint-config-expo/flat`)
- **Format**: Prettier 3 + `prettier-plugin-tailwindcss`
- **Package manager**: npm
- **Plataformas alvo**: iOS, Android, Web (output `static` via `expo-router`)

## Arquitetura

- **`app/`** — rotas do app (Expo Router file-based)
  - `app/_layout.tsx` — layout root (stack/providers globais)
  - `app/(tabs)/` — group com bottom tabs
    - `app/(tabs)/_layout.tsx` — configuração das tabs
    - `app/(tabs)/index.tsx`, `explore.tsx` — telas
  - `app/modal.tsx` — modal route
- **`components/`** — componentes reutilizáveis de domínio
  - `components/ui/` — primitivos de interface (ex.: `collapsible`, `icon-symbol`)
  - Sufixo `.ios.tsx` / `.android.tsx` / `.web.tsx` para variações de plataforma
- **`constants/`** — valores estáticos (ex.: `theme.ts`)
- **`hooks/`** — hooks customizados (ex.: `use-color-scheme`, `use-theme-color`)
  - `.web.ts` para implementações web-specific
- **`assets/`** — imagens, fontes, ícones
- **`global.css`** — diretivas Tailwind (importadas pelo Metro via `withNativeWind`)
- **`scripts/`** — scripts utilitários (ex.: `reset-project.js`)
- **Path alias**: `@/*` → raiz do projeto

## Regras Duras (nunca quebrar)

1. **Nunca realizar commits automáticos.** O usuário sempre roda `git commit` manualmente.
2. **Nunca pular lint/format** após edições. O pre-commit hook é a última barreira — não bypasse com `--no-verify`.
3. **Nunca apagar arquivos validados** pelo dev, exceto em refactor explícito.
4. **Nunca usar fallbacks silenciosos** em config crítica. Se uma env var está faltando, queremos ver o erro, não um default silencioso.
5. **Nunca adicionar `Co-Authored-By` de IA** nos commits.
6. **Nunca hardcodar chaves/tokens** no código. O bundle do React Native é enviado ao cliente — qualquer secret vira secret público. Use EAS Secrets ou `expo-constants` com `extra` apenas para valores não sensíveis.
7. **Nunca usar `StyleSheet` + `className` (NativeWind) no mesmo componente sem motivo.** Padrão é **NativeWind via `className`**. Se precisar de `StyleSheet` (perf crítico, animação Reanimated), documente o porquê.
8. **Nunca quebrar o suporte multiplataforma.** Se um componente usa API iOS-only ou Android-only, use arquivos `.ios.tsx` / `.android.tsx` ou `Platform.OS` com fallback explícito para web.
9. **Nunca desabilitar `strict` do TypeScript** ou usar `// @ts-ignore` sem comentário explicando.

## Regras Macias (seguir quando aplicável)

- Propor alternativas com trade-offs antes de mudanças invasivas (ex.: mudar arquitetura de navegação, adicionar state manager global).
- Priorizar clareza e consistência com padrões existentes no projeto.
- Sempre tipar. Evitar `any`. Preferir `unknown` + narrow quando o tipo é realmente desconhecido.
- Preferir componentes funcionais + hooks (padrão do projeto).
- **React Compiler está habilitado** — evite `useMemo`/`useCallback` preventivos; deixe o compilador otimizar. Só adicione memoização manual em gargalos reais e medidos.
- Usar `expo-image` em vez de `Image` do React Native para caching e perf.
- Usar `Pressable` em vez de `TouchableOpacity` (mais moderno, mais controle).

## Padrões de Código

### Nomenclatura

- **Arquivos**: `kebab-case.tsx` (ex.: `themed-text.tsx`, `use-color-scheme.ts`)
- **Componentes exportados**: `PascalCase` (ex.: `ThemedText`)
- **Hooks**: `useXxx` (ex.: `useColorScheme`)
- **Rotas Expo Router**: seguem convenção file-based (`index.tsx`, `[id].tsx`, `(group)/`, `_layout.tsx`)

### Comentários

- **Proibido**: blocos JSDoc (`/** */`) que só repetem o nome da função.
- **Permitido**: comentários inline (`//`) para lógica não óbvia (workaround de plataforma, decisão contraintuitiva, invariante).
- **Padrão**: zero comentários. Nomes claros substituem comentários.

### Estilização (NativeWind)

- Padrão: `className="..."` com classes Tailwind.
- Ordenação de classes é feita pelo `prettier-plugin-tailwindcss` — **não reordene manualmente**.
- Cores/tokens centralizados em `tailwind.config.js` (`theme.extend`) — evite valores arbitrários repetidos (`text-[#abc123]`).
- Para variações condicionais de classe: usar `clsx` ou `cn` (adicionar lib se for o caso).

### Estrutura de arquivos ao criar algo novo

1. **Tela nova** (`app/...`): criar arquivo dentro de `app/`, respeitar convenção file-based do Expo Router.
2. **Componente novo**: `components/nome-componente.tsx` (ou `components/ui/` se for primitivo).
3. **Hook novo**: `hooks/use-nome-hook.ts`.
4. **Constantes/tokens**: estender `constants/theme.ts` ou criar novo arquivo em `constants/`.

### Error handling

- Erros de UI com **Error Boundary** no nível da rota (usar Expo Router error boundaries).
- Erros assíncronos: sempre try/catch em operações que podem falhar (network, storage) com fallback de UI claro (retry, mensagem).
- Nunca engolir erros silenciosamente (`catch {}` vazio é **proibido**).

### Navegação

- Usar `router` do `expo-router` para navegação programática.
- Usar `Link` do `expo-router` para navegação declarativa.
- **Typed routes habilitadas** — aproveite autocomplete e type-safety dos paths.

## Relato de entrega esperado

Ao terminar uma task, reporte:

- **Resumo** objetivo do que foi feito
- **Arquivos tocados** (checklist)
- **Resultados** de `npm run lint` / `npm run format:check` / `npm run typecheck`
- **Plataformas testadas** (iOS / Android / Web — quais você verificou mentalmente ou rodou)
- **Riscos** e dependências não resolvidas
- **Mensagem de commit** pronta (seguindo [commit-message](../commit-message/SKILL.md))

## Protocolo de Execução

1. Ler e respeitar **regras duras** acima.
2. Planejar mudanças, listar impactos cruzados (multiplataforma!).
3. Implementar de forma **incremental**.
4. Rodar `npm run lint` e `npm run typecheck`.
5. **Pausar** se houver impacto fora do escopo (ex.: mudança em API de navegação, breaking change em hook compartilhado) e pedir decisão.
6. Entregar relato + mensagem de commit.
