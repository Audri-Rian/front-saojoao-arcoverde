# **Documento de Requisitos**

## **Projeto: Aplicativo de Eventos e Turismo (Arcoverde)**

---

## **1 Visão Geral**

O sistema tem como objetivo fornecer informações sobre eventos (como o São João) e turismo local, com **arquitetura Offline-First** e **alta performance** como pilares centrais do produto.

O São João de Arcoverde acontece em ambiente de evento de massa, com rede móvel saturada — o app precisa responder **como se estivesse offline o tempo todo**. Qualquer dependência de rede no caminho crítico é considerada bug de UX.

O aplicativo deve:

- Exibir programação de eventos (bandas, horários, polos)  
- Apresentar informações turísticas (história, cultura, gastronomia)  
- Funcionar integralmente sem internet, usando cache local
- Entregar experiência fluida (60 FPS, cold start < 2s) mesmo em dispositivos modestos

TIPOGRAFIA:

- MODERNA  
- HIPER-LEGÍVEL  
- ADAPTADA PARA CONTRASTES EM TELAS MOBILE

TELAS DO PROTÓTIPO:

- HOME   
- LISTA DE SHOWS   
- DETALHES DO EVENTO   
- HUB DE TURISMO E FAVORITOS

---

## **2 Objetivos do Sistema**

- Garantir acesso integral à informação mesmo com falha total de rede
- Entregar experiência de baixa latência (cache hit < 100ms, queries locais < 50ms)
- Centralizar dados de eventos e turismo com sincronização automática e transparente
- Oferecer experiência rápida e confiável em ambientes com alta demanda (eventos de massa)

---

## **3 Arquitetura (Baseada nos prints)**

### **Pilar do Evento**

Responsável por:

- Mapeamento dos polos de animação  
- Lista de bandas e cantores  
- Datas e horários precisos

### **Pilar do Turismo (Obrigatório)**

Responsável por:

- Informações gerais de Arcoverde  
- Pontos turísticos  
- História local (ex: São João)  
- Cultura (ex: Samba de Coco)  
- Gastronomia (ex: Carraspana)

### **Pilar Offline-First & Performance**

Pilar transversal que atravessa toda a aplicação:

- UI nunca consulta o backend diretamente — sempre via repositório e banco local
- Sincronização em background, invisível ao usuário
- Observables reativos: telas atualizam sozinhas conforme dados chegam
- Lazy loading por padrão em todas as listas

---

## **4 Requisitos Funcionais**

### **4.1 Eventos**

- RF01: O sistema deve listar todos os eventos  
- RF02: O sistema deve exibir polos de animação  
- RF03: O sistema deve exibir bandas e cantores  
- RF04: O sistema deve exibir datas e horários dos shows  
- RF05: O sistema deve permitir visualizar detalhes do evento

---

### **4.2 Turismo**

- RF06: O sistema deve exibir informações gerais do município  
- RF07: O sistema deve listar pontos turísticos  
- RF08: O sistema deve apresentar conteúdo histórico  
- RF09: O sistema deve exibir informações culturais  
- RF10: O sistema deve apresentar opções gastronômicas

---

### **4.3 Offline-First**

- RF11: O sistema deve funcionar integralmente sem conexão com internet
- RF12: O sistema deve armazenar todos os dados de evento/turismo localmente (SQLite via WatermelonDB no mobile; IndexedDB no web)
- RF13: O sistema deve sincronizar dados automaticamente quando houver conectividade, em background
- RF14: O sistema deve evitar telas de erro, loading infinito ou bloqueio por ausência de conexão
- RF15: O sistema deve exibir indicador discreto de "modo offline" (não bloqueante)
- RF16: O sistema deve permitir favoritar itens mesmo offline, com fila de push posterior
- RF17: O sistema deve oferecer ação de "limpar cache e ressincronizar" para recuperação

---

### **4.4 Performance & Otimização**

- RF18: O sistema deve paginar/lazy-loadear todas as listas de conteúdo
- RF19: O sistema deve servir imagens via cache em disco (expo-image), sem leitura direta da rede em caminho crítico
- RF20: O sistema deve executar writes em batch ao sincronizar com o backend
- RF21: O sistema deve expor métricas de sincronização (tempo de pull/push, falhas, tamanho de payload)

---

## **5 Requisitos Não Funcionais**

### **5.1 Performance (metas não-negociáveis)**

- RNF01: Cold start até primeira tela interativa **< 2s**
- RNF02: Scroll em listas de 500+ itens a **60 FPS**
- RNF03: Navegação para detalhes (cache hit) **< 100ms**
- RNF04: Query no banco local **< 50ms**

### **5.2 Resiliência e Offline**

- RNF05: Sincronização incremental completa em **< 3s em 4G**
- RNF06: Consumo de memória em uso contínuo **< 200MB**
- RNF07: O sistema deve ser resiliente a falhas e intermitência de rede
- RNF08: O app deve suportar uso offline completo, indefinidamente

### **5.3 Usabilidade**

- RNF09: Interface responsiva e intuitiva

---

## **6 Regras de Negócio**

### **6.1 Prioridade de dados e acesso**

- RN01: Banco local é a fonte primária da UI; dados offline têm prioridade sobre rede
- RN02: UI **nunca** consulta Firestore diretamente — acesso sempre via repositório/observable sobre DB local
- RN03: Uma tela que só funciona com internet é considerada bug de UX; rede é _enhancement_, não requisito

### **6.2 Estratégia de sincronização (Last-Write-Wins)**

- RN04: Conflitos são resolvidos por **Last-Write-Wins (LWW)** baseado em timestamp do servidor
- RN05: `updatedAt` é sempre carimbado pelo servidor (`serverTimestamp()` do Firestore); cliente jamais escreve esse campo (evita drift entre dispositivos)
- RN06: Em conflito real entre edição offline (admin) e edição remota, o **servidor prevalece** — perda rara de edição offline é aceitável

### **6.3 Cadência de sincronização**

- RN07: **Pull** (servidor → local) ocorre automaticamente em três gatilhos: abertura do app, a cada 15 min em foreground, e ao retornar de background
- RN08: **Push** (local → servidor) ocorre imediatamente a cada mutação local, com retry de backoff exponencial (1s, 2s, 4s... máximo 60s)
- RN09: Ao reconectar (offline → online), o sistema executa **pull + push imediatos**
- RN10: Pull só puxa registros com `updatedAt > lastPulledAt` (sync incremental; nunca full re-fetch em uso rotineiro)

### **6.4 Integridade de dados**

- RN11: Exclusões usam **soft delete** (campo `deleted_at`); a remoção física só ocorre após sincronização bem-sucedida
- RN12: Cada registro carrega estado local (`_status`: `created`, `updated`, `deleted`, `synced`) para controlar o que precisa ser enviado
- RN13: Writes enviados ao backend em **batch de no máximo 500 operações** (limite do Firestore); operações em loop são proibidas
- RN14: Migrations de schema são **append-only**; migrations antigas jamais podem ser editadas (risco de corromper devices em versões anteriores)

### **6.5 Dados do usuário**

- RN15: Favoritos são locais ao dispositivo, sem dependência de identidade do usuário
- RN16: Usuário deve poder disparar "limpar cache e ressincronizar" em caso de dados corrompidos ou inconsistentes

### **6.6 Performance em runtime**

- RN17: Listas devem sempre usar paginação/lazy loading; carregar coleções completas é proibido
- RN18: Queries de listagem devem usar índices compostos (`date`, `poloId`, `category` etc.); query sem índice é bug
- RN19: Imagens consumidas exclusivamente via cache em disco; leitura direta da rede em caminho crítico de UI é proibida

---

## **7 Fluxo Offline-First**

### **7.1 Primeiro uso (fresh install, online)**

1. Splash
2. Sync inicial (full pull) em background, com skeleton na UI
3. Assim que a primeira tabela (events) chega → home liberada
4. Demais tabelas continuam populando em background; telas se atualizam via observables

### **7.2 Primeiro uso (fresh install, offline)**

1. Splash
2. DB vazio → tela informativa de "baixe os dados do evento" (sem redirecionar para erro)
3. Usuário ao entrar em qualquer tela → empty state informativo, sem crash e sem loading infinito

### **7.3 Uso no evento (sem sinal, DB populado)**

1. Todas as telas funcionam normalmente a partir do cache local
2. Indicador discreto de "modo offline" no header (não bloqueante)
3. Favoritar → escrita local + `_status = created` + fila de push
4. Sinal volta → push automático, indicador some

### **7.4 Atualização de conteúdo durante o evento**

1. Admin publica novo show no Firestore
2. Device com sinal puxa a alteração no próximo ciclo de pull (máx 15 min ou na próxima abertura)
3. Observable atualiza lista → UI reflete sem refresh manual

### **7.5 Resolução de conflito (caso raro)**

1. Admin editou offline; servidor também foi editado por outro admin
2. No push, LWW compara `updatedAt` (server-stamped) → servidor vence
3. Local sobrescreve com valor remoto; edição offline é descartada

---

## **8 Stack Tecnológica**

### **Front-end**

- TypeScript + React Native  
- Expo  
- UI: NativeWind  
- Navegação: Expo Router  
- Estado: Zustand
- Imagens: expo-image (cache de disco nativo)

---

### **Back-end**

- Firebase Firestore (fonte da verdade)  
- Firebase Storage (mídia)

---

### **Offline & Sincronização**

- **Mobile**: WatermelonDB (SQLite) com sync engine custom (`pullChanges` / `pushChanges`)
- **Web**: Firestore offline persistence (IndexedDB, via `persistentLocalCache`)
- **Preferências/flags**: MMKV / AsyncStorage
- **Estratégia**: Last-Write-Wins com timestamp do servidor
- **Soft delete** com campo `deleted_at`
- **Sync metadata**: `lastPulledAt` / `lastPushedAt`

---

### **Integração e validação**

- HTTP Client: Axios  
- Validação: Zod

---

### **DevOps**

- CI/CD: GitHub Actions  
- Build: EAS Build
- Dev Client obrigatório (WatermelonDB tem código nativo; não roda em Expo Go)

---

### **Testes e Monitoramento**

- Testes: Jest + Detox  
- **Performance**: [Flashlight](https://flashlight.dev/) (medição de FPS, CPU, RAM, cold start em Android) — ver [docs/PERFORMANCE.md](PERFORMANCE.md)
- Monitoramento: Sentry + Firebase Crashlytics
- Telemetria de sync: breadcrumbs no Sentry com tempos de pull/push

---

## **9 Modelo de Dados (Resumo)**

### **Evento**

- id, nome, data, horário, local, polo, `updatedAt`, `deletedAt`, `_status`

### **Polo**

- id, nome, lat, lng, endereço, `updatedAt`, `deletedAt`, `_status`

### **Artista**

- id, nome, tipo (banda/cantor), bio, foto, `updatedAt`, `deletedAt`, `_status`

### **Event_Artists** (relação N:N)

- eventId, artistId

### **Turismo**

- id, título, descrição, categoria (história, cultura, gastronomia), imagem, `updatedAt`, `deletedAt`, `_status`

### **Favoritos** (local ao dispositivo)

- id, entityType, entityId, `_status`

### **Sync Metadata**

- `lastPulledAt`, `lastPushedAt`

**Índices críticos** (perf em listas): `events.date`, `events.poloId`, `tourism.category`.

---

## **10 Considerações Finais**

O diferencial do sistema é:

- Arquitetura **Offline-First** real — não apenas "funciona sem internet", e sim "projetado como se internet não existisse"
- **Performance não-negociável** — métricas concretas (60 FPS, < 2s cold start, < 100ms cache hit) como parte do contrato de produto
- Sincronização **transparente e automática** com LWW sobre timestamp do servidor
- Integração fluida entre eventos e turismo
