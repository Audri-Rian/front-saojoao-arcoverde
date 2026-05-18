# Offline-First — Estratégia e Plano de Implementação

> Status: **planejado, não implementado**. As libs já estão no `package.json`. Este documento descreve a arquitetura acordada para quando a feature for implementada.

## 1. Princípio norteador

Este app é **offline-first por obrigação de negócio**, não por capricho técnico. O São João de Arcoverde acontece em ambiente de evento de massa, com rede móvel saturada, e o app precisa responder como se estivesse offline o tempo todo — qualquer dependência de rede no caminho crítico é bug de UX.

**Regra prática:** se uma tela só funciona com internet, ela está errada. Rede é _enhancement_, não requisito.

## 2. Stack escolhida

| Plataforma  | Storage local                    | Sync com backend                    |
| ----------- | -------------------------------- | ----------------------------------- |
| iOS/Android | **WatermelonDB** (SQLite)        | Pull/Push custom contra Firestore   |
| Web         | **Firestore offline** (IndexedDB)| Nativo do SDK do Firebase (automático) |
| Todos       | **MMKV / AsyncStorage**          | Preferências, flags, tokens de sync |

### Por que WatermelonDB no mobile

- SQLite por baixo → listas de 5k+ shows/artistas rodam em 60 FPS sem suor.
- **Lazy loading** por padrão: só carrega o que a tela pede.
- Reativo via observables (`withObservables`) — combina bem com React 19 + React Compiler.
- Protocolo de sync bem definido (`synchronize({ pullChanges, pushChanges })`).

### Por que Firestore offline no Web

- WatermelonDB **não suporta Web oficialmente**.
- Firestore já fornece persistência offline via IndexedDB com uma flag (`enableIndexedDbPersistence`).
- O app Web é secundário (uso principal é no evento, presencial, mobile). Aceitamos uma stack diferente nessa plataforma em troca de não manter dois adapters customizados.

### Alternativas descartadas (e por quê)

- **RxDB** — suporta Web, mas performance inferior ao SQLite em listas grandes no mobile; curva de aprendizado maior; stack menos madura no RN.
- **PowerSync** — excelente, mas desenhada pra Postgres; pagar licença / rodar replicação só pra isso não faz sentido aqui.
- **Só Firestore offline (em todas plataformas)** — funciona, mas mobile fica caro em memória e sem lazy loading real em listas grandes. Perderíamos a principal vantagem de perf.
- **expo-sqlite + Drizzle** — viável, mas sync teria que ser escrito do zero. WatermelonDB já resolve.

## 3. Arquitetura em camadas

```
┌────────────────────────────────────────────────────────┐
│  UI (Expo Router + NativeWind)                         │
│    ↕ observables                                       │
├────────────────────────────────────────────────────────┤
│  Repositórios (hooks: useEvents, useArtists, ...)      │
│    ↕                                                   │
├────────────────────────────────────────────────────────┤
│  WatermelonDB (mobile)   |   Firestore cache (web)     │
│    ↕ sync engine         |     ↕ automático            │
├────────────────────────────────────────────────────────┤
│  Firebase Firestore (fonte da verdade)                 │
└────────────────────────────────────────────────────────┘
```

**Regra de ouro**: UI **nunca** fala com Firestore direto. Sempre via repositório, sempre via DB local. Isso garante:

1. Tela não trava esperando rede.
2. Troca de backend futura (se acontecer) não vira refactor gigante.
3. Testes ficam simples — mocka o repositório, não a rede.

## 4. Modelo de dados (WatermelonDB schema)

Baseado em [Projeto São João em Arcoverde - DOCUMENTACAO.md](Projeto São João em Arcoverde - DOCUMENTACAO.md#9-modelo-de-dados-resumo):

| Tabela         | Campos principais                                         | Observações                             |
| -------------- | --------------------------------------------------------- | --------------------------------------- |
| `events`       | `id`, `name`, `date`, `time`, `poloId`, `description`     | Show individual                         |
| `polos`        | `id`, `name`, `lat`, `lng`, `address`                     | Local de animação                       |
| `artists`      | `id`, `name`, `type` (`banda`/`cantor`), `bio`, `photoUrl`| Artista                                 |
| `event_artists`| `eventId`, `artistId`                                     | Many-to-many (um show, vários artistas) |
| `tourism`      | `id`, `title`, `description`, `category`, `imageUrl`      | Ponto turístico / conteúdo cultural     |
| `favorites`    | `id`, `entityType`, `entityId`, `userId`                  | Local (user-specific, sync por usuário) |
| `sync_metadata`| `lastPulledAt`, `lastPushedAt`                            | Uma linha só, usada pelo sync engine    |

**Índices críticos** (perf em listas):

- `events.date` — ordenação por dia
- `events.poloId` — filtro por local
- `tourism.category` — filtro por categoria

## 5. Sync Strategy: **Last-Write-Wins** (LWW)

### Decisão

Adotamos **Last-Write-Wins** como estratégia padrão. **Não** faremos merge manual.

### Justificativa

- **99% do conteúdo é read-only pro usuário final** (eventos, polos, artistas, turismo). Só admin escreve.
- Admin não edita concorrente — mesmo se editasse, "última edição ganha" é exatamente o comportamento esperado.
- **Favoritos** são user-specific: sem conflito entre usuários. Entre dispositivos do mesmo usuário, LWW também resolve (escolher último é aceitável).
- Merge manual exigiria UI de resolução de conflito, testes caros, e não traria valor real pro caso de uso.

### Como funciona

Cada registro carrega:

- `updated_at` (timestamp do servidor, `serverTimestamp()` do Firestore)
- `deleted_at` (soft delete — nunca deletamos fisicamente antes do sync)
- `_status` (local-only: `created`, `updated`, `deleted`, `synced`)

**Pull (servidor → local):**

1. Query no Firestore: `where('updatedAt', '>', lastPulledAt)`.
2. Para cada doc: se `remote.updatedAt > local.updatedAt`, sobrescreve local.
3. Atualiza `lastPulledAt` com timestamp do servidor (não do cliente — evita drift).

**Push (local → servidor):**

1. Seleciona registros com `_status != 'synced'`.
2. Envia em batch (max 500/batch, limite do Firestore).
3. Servidor carimba `updatedAt` com `serverTimestamp()`.
4. Local atualiza `_status = 'synced'`.

**Caso de conflito real** (cliente editou offline, servidor também foi editado):

- Servidor sempre ganha (LWW usa timestamp do servidor). Aceitamos perda de edição offline do admin — é raro e aceitável.
- Se quisermos no futuro preservar edits admin offline → mudamos pra merge por campo. Por agora, **não**.

### Cadência de sync

- **Pull**: ao abrir app (se online) + a cada 15 min em foreground + ao voltar de background.
- **Push**: a cada mutação local + retry com backoff exponencial (1s, 2s, 4s, ... max 60s).
- **Reconnect** (de offline pra online): pull + push imediato.

## 6. Performance — metas não-negociáveis

| Métrica                                      | Alvo       | Como medir              |
| -------------------------------------------- | ---------- | ----------------------- |
| Cold start até primeira tela interativa      | < 2s       | Flashlight / Perfetto   |
| Scroll em lista de shows (500+ items)        | 60 FPS     | RN Perf Monitor         |
| Tap em item → tela de detalhes (cache hit)   | < 100ms    | Cronometrado em release |
| Query "shows de hoje"                        | < 50ms     | `console.time` em DB    |
| Sync completo incremental                    | < 3s em 4G | Telemetria              |
| Memória em uso contínuo                      | < 200MB    | Xcode Instruments       |

### Regras de perf específicas do offline

1. **Nunca** fazer query síncrona grande no boot. Use observables + `React.Suspense` onde fizer sentido.
2. **Nunca** carregar listas completas. Sempre paginar / lazy / `FlatList` com `windowSize`.
3. **Nunca** ler imagem de `photoUrl` direto da rede — sempre via `expo-image` (tem cache disco nativo).
4. Queries de listagem devem usar índices (ver tabela acima). Se uma query não usa índice, é bug.
5. Writes em batch. Nunca `create()` em loop — sempre `batch()`.

## 7. Fluxos chave

### Primeiro uso (fresh install, online)

1. Splash.
2. Sync inicial (full pull) em background, mostra skeleton.
3. Assim que primeira tabela (events) chega → libera home.
4. Demais tabelas continuam populando em background, telas se atualizam via observables.

### Primeiro uso (fresh install, offline)

1. Splash.
2. DB vazio → tela de "baixe os dados do evento" (sem redirecionar pra erro).
3. Usuário entra numa tela → mostra empty state informativo, não crash, não loading infinito.

### Uso no evento (sem sinal, DB populado)

1. Todas telas funcionam normal.
2. Indicador discreto de "modo offline" no header (não bloqueante).
3. Favoritar → escreve local, marca `_status = created`, fila de push.
4. Sinal volta → push automático, indicador some.

### Admin publicou novo show durante o evento

1. Device com sinal → pull pega o novo show em no máx 15 min (ou ao reabrir app).
2. Observable atualiza lista → UI reflete sem refresh manual.

## 8. Setup necessário quando a feature for implementada

### 8.1. Babel (já instalado o plugin)

Em `babel.config.js`, adicionar:

```js
plugins: [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  // demais plugins existentes
],
```

### 8.2. Entry point

Em `app/_layout.tsx` (ou em um polyfill file importado antes), adicionar:

```ts
import 'react-native-get-random-values'; // precisa vir antes de qualquer import do Watermelon
```

### 8.3. Dev Client (obrigatório)

WatermelonDB tem código nativo → **não roda em Expo Go**. Passos:

```bash
npx expo install expo-dev-client
npx expo prebuild       # gera ios/ e android/
eas build --profile development --platform ios
eas build --profile development --platform android
```

Quem rodar só Web **não precisa** do Dev Client — Watermelon nem carrega nessa plataforma (ver próximo passo).

### 8.4. Platform split

Criar adapter com sufixos de plataforma:

- `db/index.ts` — exporta interface comum `db.events.list()`, etc.
- `db/index.native.ts` — implementação WatermelonDB.
- `db/index.web.ts` — implementação Firestore (usa cache offline do SDK).

Metro já resolve `.native.ts` / `.web.ts` automaticamente. UI consome só `@/db` e não sabe qual tá rodando.

### 8.5. Firestore offline no Web

No bootstrap do Firebase (quando adicionarmos):

```ts
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
```

## 9. Estrutura de pastas proposta

```
db/
  index.native.ts           # Database + adapter WatermelonDB
  index.web.ts              # Wrapper Firestore
  index.ts                  # types e interface compartilhada
  schema.ts                 # schema WatermelonDB
  migrations.ts             # migrations (sempre adicionar, nunca editar antigas)
  models/
    event.ts
    polo.ts
    artist.ts
    tourism.ts
    favorite.ts
  sync/
    pull.ts                 # pullChanges contra Firestore
    push.ts                 # pushChanges contra Firestore
    index.ts                # synchronize() orquestrador
    metadata.ts             # lastPulledAt / lastPushedAt
hooks/
  use-events.ts             # wrapper de observable
  use-artists.ts
  ...
```

## 10. Riscos conhecidos

| Risco                                                     | Mitigação                                                      |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| WatermelonDB em New Architecture (Fabric/TurboModules)    | Usar ≥ 0.27. Testar em Dev Client antes de abrir feature.      |
| Migrations destrutivas (schema v2 quebra device v1)       | Migrations são **append-only**. Nunca editar migration antiga. |
| Time skew entre dispositivos                              | Usar **sempre** `serverTimestamp()` do Firestore, nunca `Date.now()` local, em `updatedAt`. |
| Web divergir de mobile (bug só no web)                    | Teste de sync rodar nas 3 plataformas no CI.                   |
| Favoritos perdidos após logout/login                      | Favoritos são linkados a `userId`. Sync por usuário.           |
| Usuário com DB corrompido                                 | Botão "limpar cache e ressincronizar" em Configurações.        |

## 11. Roadmap de implementação (quando sair do papel)

1. **Fase 1 — Read-only offline (evento)**: schema + models + pull sync de events/polos/artists/tourism. Sem push. Sem favoritos. Release primeiro pra validar perf no evento real.
2. **Fase 2 — Favoritos offline**: favorites model + push sync.
3. **Fase 3 — Auth + sync por usuário**: integra Firebase Auth, escopo de favorites por `userId`.
4. **Fase 4 — Web parity**: adapter web com Firestore offline persistence.
5. **Fase 5 — Telemetria de sync**: métricas de tempo de pull/push, falhas, tamanho de payload. Sentry breadcrumbs.

## 12. Checklist pra abrir a feature

Antes de começar a implementar, confirmar:

- [ ] Firestore provisionado com as coleções planejadas
- [ ] Índices compostos criados no Firestore (`updatedAt` + filtros)
- [ ] EAS Build configurado com profile `development`
- [ ] Dev Client distribuído pro time
- [ ] Decisão final de LWW referendada (este documento)
- [ ] Meta de perf combinada com produto (ver §6)
