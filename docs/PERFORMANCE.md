# Performance — Medição e Metas

> **Por que isso importa**: o app roda no meio do São João de Arcoverde — evento de massa, rede saturada, dispositivos modestos, bateria baixa. Performance não é "nice to have", é **contrato de produto**. Este documento define como medir e contra o que comparar.

## 1. Metas não-negociáveis

Toda tarefa que toque telas, listas, animações, imagens ou sincronização deve ser validada contra estas metas antes de considerar-se "pronta":

| Métrica                                      | Alvo       | Ferramenta             |
| -------------------------------------------- | ---------- | ---------------------- |
| Cold start até primeira tela interativa      | **< 2s**   | Flashlight             |
| Scroll em lista de shows (500+ items)        | **60 FPS** | Flashlight / RN Perf   |
| Tap em item → tela de detalhes (cache hit)   | **< 100ms**| Cronometrado em release|
| Query no DB local                            | **< 50ms** | `console.time` em DB   |
| Sync incremental completo                    | **< 3s** em 4G | Telemetria Sentry |
| Memória em uso contínuo                      | **< 200MB**| Flashlight / Instruments|

Se uma mudança sua não bate essa meta → **não feche a task**. Ou otimiza, ou escala o problema.

## 2. Ferramenta oficial: Flashlight

[Flashlight](https://flashlight.dev/) é a ferramenta padrão do projeto para medir performance real em Android. Mede CPU, RAM, FPS, threads JS/UI e score agregado em device físico ou emulador, sem precisar instrumentar o app.

### 2.1 Instalação

Flashlight é distribuído como binário standalone (não via npm). Instale uma vez por máquina:

```bash
curl https://get-flashlight.dev | bash
```

Depois, garanta que `~/.flashlight/bin` esteja no `PATH` (o script de instalação orienta sobre isso no final).

Verifique:

```bash
flashlight --version
```

### 2.2 Pré-requisitos

- **Android SDK Platform Tools** (`adb`) instalado e no PATH
- Device Android conectado via USB (com "Depuração USB" habilitada) **ou** emulador Android rodando
- App instalado em modo **release** ou **preview** (medir `development` produz números enganosos — JIT, warnings, DevTools rodando)

Para buildar um preview otimizado:

```bash
eas build --profile preview --platform android --local
# ou release via EAS cloud
```

### 2.3 WSL2 (Windows)

Quem desenvolve em WSL2 precisa expor o `adb` do Windows para o WSL, ou rodar o `flashlight` no Windows mesmo. Caminho mais simples:

```bash
# No WSL, aponte para o adb do Windows
export ADB=/mnt/c/Users/<seu-user>/AppData/Local/Android/Sdk/platform-tools/adb.exe
```

Ou use `usbipd-win` para encaminhar o USB do Windows para dentro do WSL. Em último caso, rode o Flashlight direto num terminal Windows (PowerShell/Git Bash).

## 3. Scripts npm

Atalhos configurados em `package.json`:

```bash
npm run perf:measure   # modo interativo: mede o app em tempo real
npm run perf:test      # roda um teste automatizado (precisa script de teste)
npm run perf:report    # abre relatório HTML de um JSON já gerado
```

### 3.1 Medição interativa (rotina de dev)

Use durante desenvolvimento exploratório, ao suspeitar de regressão:

```bash
npm run perf:measure
# seleciona o device/emulador
# seleciona o package do app
# interage com o app (scroll, navegação, etc.)
# encerra → Flashlight gera report
```

### 3.2 Medição automatizada (CI / release gate)

Para cenários repetíveis, crie scripts em `perf/` (ex.: `perf/scroll-shows.js`) e rode:

```bash
npm run perf:test
```

O Flashlight suporta scripts que automatizam o app via `adb` (taps, swipes, espera) e comparam resultados contra baseline. Ver [flashlight.dev/docs/e2e-testing](https://docs.flashlight.dev/).

### 3.3 Visualizar relatório

Relatórios são salvos em JSON. Para abrir:

```bash
npm run perf:report -- <caminho/do/report.json>
```

Ou faça upload em [app.flashlight.dev](https://app.flashlight.dev) para ver visualmente.

## 4. Quando medir (obrigatório)

Rode Flashlight **antes** de considerar a task pronta sempre que tocar:

- [ ] Telas de lista (`FlatList`, `FlashList`, etc.) — especialmente Home e Lista de Shows
- [ ] Animações novas ou modificadas (Reanimated, LayoutAnimation)
- [ ] Fluxo de navegação em caminho crítico (tap → detalhes)
- [ ] Código de sincronização (pull/push, observables)
- [ ] Imagens (adição de novas, mudança de cache, preload)
- [ ] Qualquer mudança em `app/_layout.tsx` ou bootstrap
- [ ] Upgrade de libs core (React Native, Expo, Reanimated, WatermelonDB)

Se sua mudança não cai em nenhuma dessas categorias, medir é opcional mas recomendado.

## 5. Fluxo recomendado

1. **Baseline**: rode `perf:measure` antes da mudança. Salve o JSON.
2. **Implemente**.
3. **Após**: rode `perf:measure` de novo no mesmo cenário.
4. **Compare**: FPS, JS thread, UI thread, memória.
5. **Decida**:
   - Dentro da meta → segue.
   - Regressão menor mas justificada → documente no PR.
   - Regressão alta → otimize ou escale.

## 6. Interpretando o report

Flashlight devolve, entre outras coisas:

- **Average FPS**: < 55 em lista → suspeite de re-render, lista não virtualizada, ou trabalho síncrono no scroll
- **JS Thread %**: > 70% sustentado → código JS pesado (merge/sort/filter grande, JSON.parse em loop)
- **UI Thread %**: > 70% sustentado → render nativo pesado (sombras, blur, muitas `View` aninhadas)
- **RAM delta**: crescimento linear no tempo → memory leak (listener não removido, closure retendo estado)
- **Score**: agregado (0–100). Use como proxy rápido, mas sempre olhe as métricas individuais.

## 7. Não consegue medir? Diga isso.

Se você **não** tem Android/emulador disponível (ex.: está só no Web, ou só tem iOS sem simulador Android), **declare isso explicitamente** no relato de entrega:

> "Não foi possível medir com Flashlight — ambiente sem Android. Revisor por favor medir antes de merge."

Nunca assuma que está dentro das metas sem medir. Código que "parece rápido no seu dev" regularmente droppa frame em device real.

## 8. Alternativas / complementos

- **React Native Perf Monitor** (Cmd+D → Perf Monitor): FPS rápido, mas só dá pista grosseira.
- **React DevTools Profiler**: ótimo para pegar re-render desnecessário em nível de componente.
- **Sentry Performance**: métricas em produção (cold start, navegação, queries). Complementa Flashlight (que é dev/CI).
- **Xcode Instruments** / **Android Studio Profiler**: quando Flashlight não for suficiente pra investigar causa raiz.

## 9. Referências

- Site oficial: https://flashlight.dev
- Docs: https://docs.flashlight.dev
- Metas deste projeto: [OFFLINE.md §6](OFFLINE.md#6-performance--metas-não-negociáveis)
- Contrato de produto: [Projeto São João em Arcoverde - DOCUMENTACAO.md §5.1](Projeto%20São%20João%20em%20Arcoverde%20-%20DOCUMENTACAO.md)
