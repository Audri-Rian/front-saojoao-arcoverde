# Especificacao de Telas - Sao Joao em Arcoverde

Documento criado a partir da pagina inicial atual do projeto e dos requisitos em `docs/Projeto São João em Arcoverde - DOCUMENTACAO.md`.

## Base visual e navegacao

### Identidade visual

- Tema: Sao Joao, cultura popular, sertao, forro, coco, quadrilhas e turismo local.
- Estilo atual: cartaz popular/festa junina, bordas pretas fortes, sombras duras, bandeirinhas, cores quentes e alto contraste.
- Paleta base:
  - Fundo: `#FCF9F0`
  - Vermelho/laranja principal: `#D53E1B`, `#FF5A2A`, `#B12401`
  - Amarelo: `#FFB229`, `#FFE07A`
  - Azul de apoio: `#305C9C`, `#0066FF`
  - Texto: `#000`, `#1C1C17`, `#3D2B1F`
- Componentes recorrentes:
  - `FestaChrome`: topo, marca, busca, menu e navegacao inferior.
  - Cards com borda preta de 2px e sombra chapada preta.
  - Chips/filtros com texto em caixa alta.
  - Icones MaterialIcons.

### Navegacao principal

Abas atuais:

- Inicio
- Eventos
- Mapa
- Mais

Rotas existentes:

- `/`: hoje abre `WelcomeScreen`.
- `/eventos`: lista simples de eventos.
- `/mapa`: placeholder de pontos principais.
- `/mais`: placeholder de opcoes.
- `/evento/[id]`: detalhe simples de evento.

Recomendacao de fluxo:

1. Primeiro acesso mostra a tela de boas-vindas.
2. Botao "Explorar eventos" leva para a Home operacional.
3. Depois do primeiro acesso, `/` pode abrir direto a Home operacional.
4. As abas inferiores ficam disponiveis nas telas principais.

## Telas prioritarias

### 1. Boas-vindas

- Status atual: existe em `components/welcome-screen.tsx`, mas o CTA nao navega.
- Rota sugerida: `/welcome` ou uso condicional em `/`.
- Objetivo: apresentar o app e levar o usuario para a experiencia principal.
- Elementos:
  - Marca: "Sao Joao em Arcoverde".
  - Imagem/ilustracao principal.
  - Texto de proposta: eventos, tradicoes e cultura local.
  - Botao primario: "Explorar eventos".
  - Indicador de paginas, se houver onboarding com mais de uma etapa.
  - Ornamentos juninos: bandeirinhas, fogueira, faixa inferior.
- Acoes:
  - Tocar em "Explorar eventos" salva flag de onboarding concluido e navega para `/home` ou `/`.
- Estados:
  - Primeiro acesso online.
  - Primeiro acesso offline com dados ja empacotados.
  - Acessibilidade: textos grandes, botao com area de toque minima de 44px.
- Dados necessarios:
  - Flag local: `hasSeenWelcome`.

### 2. Inicio / Home operacional

- Status atual: existe em `components/sao-joao-screen.tsx`, mas nao esta conectada na rota inicial.
- Rota sugerida: `/` ou `/home`.
- Objetivo: ser o painel rapido do visitante durante o evento.
- Elementos:
  - Header com marca, menu e busca.
  - Indicador discreto de offline/sincronizacao.
  - Hero: evento em destaque, local, descricao curta e CTA "Ver evento".
  - Busca rapida: placeholder "Buscar festas, shows ou tradicoes".
  - Categorias horizontais: Sao Joao, Quadrilhas, Forro, Coco, Feiras.
  - Proximos eventos: cards com data, titulo, local, tag e acao "Detalhes".
  - Destaques da regiao: cards de cultura/turismo com imagem, titulo e resumo.
- Acoes:
  - Tocar no hero abre o detalhe do evento em destaque.
  - Buscar abre resultados filtrados.
  - Tocar em categoria filtra eventos e destaques.
  - Tocar em evento abre `/evento/[id]`.
  - Tocar em destaque abre detalhe turistico/cultural.
- Estados:
  - Com eventos.
  - Sem eventos para categoria selecionada.
  - Offline com cache populado.
  - Sincronizando em background.
  - Fresh install offline sem dados: mostrar chamada para baixar dados quando houver conexao.
- Dados necessarios:
  - Eventos destacados.
  - Eventos proximos ordenados por data/hora.
  - Categorias.
  - Destaques culturais/turisticos.
  - Status de sync.

### 3. Busca global

- Status atual: nao existe como tela dedicada.
- Rota sugerida: `/buscar`.
- Objetivo: permitir encontrar eventos, polos, artistas, comidas, pontos turisticos e conteudos culturais.
- Elementos:
  - Campo de busca fixo no topo com botao voltar.
  - Sugestoes recentes ou populares.
  - Filtros por tipo: Eventos, Polos, Turismo, Gastronomia, Cultura.
  - Lista de resultados agrupados por tipo.
  - Botao para limpar busca.
- Acoes:
  - Digitar atualiza resultados locais.
  - Tocar em resultado navega para o detalhe correspondente.
  - Filtro altera a lista sem depender de internet.
- Estados:
  - Sem termo digitado.
  - Carregando indice local, se necessario.
  - Sem resultados.
  - Offline normal, pois a busca deve consultar cache local.
- Dados necessarios:
  - Indice local pesquisavel de eventos, polos, artistas, turismo e gastronomia.

### 4. Programacao de eventos

- Status atual: existe como lista simples em `/eventos`.
- Rota: `/eventos`.
- Objetivo: listar a programacao completa com filtros uteis para uso durante o evento.
- Elementos:
  - Titulo: "Programacao".
  - Abas ou chips de dia: Hoje, 20 Jun, 21 Jun, 22 Jun...
  - Filtros: categoria, polo, horario, favoritos.
  - Lista paginada/lazy de eventos.
  - Card de evento com data, hora, nome, local, tag, favorito e status.
  - Opcao de ordenacao: por horario ou por polo.
- Acoes:
  - Tocar em card abre `/evento/[id]`.
  - Favoritar evento direto no card.
  - Filtrar por dia, polo ou categoria.
  - Pull-to-refresh dispara tentativa de sync, mas a UI continua usando cache.
- Estados:
  - Lista populada.
  - Sem eventos no filtro.
  - Offline com aviso discreto.
  - Sync com erro nao bloqueante.
- Dados necessarios:
  - Eventos.
  - Polos.
  - Categorias.
  - Favoritos locais.

### 5. Detalhe do evento

- Status atual: existe em `/evento/[id]`, mas ainda simples e fora do `FestaChrome`.
- Rota: `/evento/[id]`.
- Objetivo: entregar todas as informacoes necessarias para o visitante decidir ir ao evento.
- Elementos:
  - Header com voltar, titulo compacto e favorito.
  - Nome do evento.
  - Data, hora e duracao estimada.
  - Local/polo com botao "Ver no mapa".
  - Tag/categoria.
  - Descricao completa.
  - Lista de artistas/atracoes, quando houver.
  - Avisos: alteracao de horario, lotacao, cancelamento, acessibilidade.
  - Acoes: favoritar, compartilhar, criar lembrete, abrir rota no mapa.
  - Bloco "Eventos relacionados".
- Acoes:
  - Favoritar offline.
  - Abrir polo no mapa.
  - Compartilhar link/texto.
  - Criar lembrete local.
- Estados:
  - Evento encontrado.
  - Evento removido/indisponivel.
  - Evento atualizado recentemente.
  - Offline normal.
- Dados necessarios:
  - Evento completo.
  - Polo/local.
  - Artistas.
  - Favorito local.
  - Metadados de atualizacao.

### 6. Mapa dos polos

- Status atual: existe placeholder em `/mapa`.
- Rota: `/mapa`.
- Objetivo: ajudar o visitante a localizar polos, banheiros, estacionamentos, comida, acessibilidade e pontos de apoio.
- Elementos:
  - Titulo: "Mapa do Sao Joao".
  - Mapa visual offline ou lista/mapa esquematico se mapa nativo nao estiver disponivel.
  - Marcadores de polos: Praca da Estacao, Polo Multicultural, Alto do Cruzeiro.
  - Filtros de pontos: Palcos, Comida, Banheiros, Saude, Seguranca, Turismo.
  - Lista inferior de pontos proximos ou principais.
  - Botao "Centralizar" se houver geolocalizacao.
- Acoes:
  - Tocar em marcador abre resumo do ponto.
  - Tocar em "Ver detalhes" abre `/polo/[id]` ou detalhe turistico.
  - Abrir rota em app externo quando online.
- Estados:
  - Sem permissao de localizacao.
  - Offline com mapa/lista local.
  - Mapa externo indisponivel.
  - Marcador selecionado.
- Dados necessarios:
  - Polos com coordenadas.
  - Pontos de apoio.
  - Categorias de ponto.

### 7. Detalhe do polo/local

- Status atual: nao existe.
- Rota sugerida: `/polo/[id]`.
- Objetivo: concentrar programacao e informacoes praticas de um local.
- Elementos:
  - Nome do polo.
  - Imagem ou icone do local.
  - Endereco e referencia.
  - Botoes: "Ver no mapa", "Como chegar", "Favoritar".
  - Programacao daquele polo por dia.
  - Servicos proximos: banheiros, comida, saude, seguranca.
  - Notas de acessibilidade.
- Acoes:
  - Filtrar eventos por dia.
  - Abrir detalhe de evento.
  - Abrir rota externa.
- Estados:
  - Polo com eventos.
  - Polo sem programacao no dia.
  - Offline.
- Dados necessarios:
  - Polo/local.
  - Eventos vinculados.
  - Pontos de apoio proximos.

### 8. Turismo e cultura

- Status atual: aparece como "Destaques da regiao" na home e como placeholder dentro de "Mais".
- Rota sugerida: `/turismo` ou dentro de `/mais`.
- Objetivo: apresentar Arcoverde alem dos shows.
- Elementos:
  - Titulo: "Turismo e cultura".
  - Banner editorial com foto real/local.
  - Categorias: Pontos turisticos, Historia, Cultura, Gastronomia, Artesanato.
  - Cards com imagem, titulo, resumo, distancia/local e favorito.
  - Secao "Imperdiveis".
  - Secao "Perto dos polos".
- Acoes:
  - Tocar em card abre detalhe.
  - Filtrar por categoria.
  - Favoritar conteudo turistico.
- Estados:
  - Conteudo populado.
  - Sem resultados para categoria.
  - Offline com imagens em cache.
- Dados necessarios:
  - Conteudos turisticos.
  - Categorias.
  - Imagens cacheadas.
  - Relacao com locais/polos.

### 9. Detalhe turistico/cultural

- Status atual: nao existe.
- Rota sugerida: `/turismo/[id]`.
- Objetivo: detalhar pontos turisticos, historia, cultura, gastronomia ou artesanato.
- Elementos:
  - Imagem principal.
  - Categoria.
  - Titulo.
  - Resumo curto.
  - Conteudo completo em blocos legiveis.
  - Localizacao, quando aplicavel.
  - Horarios, preco, contato, acessibilidade, quando aplicavel.
  - Acoes: favoritar, compartilhar, ver no mapa.
  - Conteudos relacionados.
- Acoes:
  - Favoritar.
  - Compartilhar.
  - Abrir no mapa.
- Estados:
  - Conteudo completo.
  - Conteudo sem localizacao.
  - Imagem indisponivel, usando fallback local.
- Dados necessarios:
  - Conteudo turistico.
  - Midias.
  - Localizacao opcional.
  - Favorito local.

### 10. Favoritos

- Status atual: citado em `/mais`, mas nao existe como tela.
- Rota sugerida: `/favoritos`.
- Objetivo: reunir eventos, polos e conteudos salvos pelo usuario.
- Elementos:
  - Titulo: "Favoritos".
  - Abas: Eventos, Turismo, Polos.
  - Lista de itens favoritos.
  - Estado vazio com convite para explorar.
  - Indicador de itens salvos offline.
- Acoes:
  - Abrir detalhe.
  - Remover favorito.
  - Filtrar por tipo.
- Estados:
  - Sem favoritos.
  - Favoritos locais pendentes de sync, se houver push futuro.
  - Offline normal.
- Dados necessarios:
  - Favoritos locais.
  - Referencias dos itens favoritados.

### 11. Mais

- Status atual: existe placeholder em `/mais`.
- Rota: `/mais`.
- Objetivo: funcionar como hub secundario do app.
- Elementos:
  - Titulo: "Mais".
  - Lista de entradas:
    - Favoritos
    - Turismo e cultura
    - Gastronomia
    - Sobre o evento
    - Configuracoes
    - Ajuda e informacoes uteis
  - Card de status offline/sync.
  - Versao do app.
- Acoes:
  - Navegar para telas secundarias.
  - Abrir configuracoes.
  - Executar ressincronizacao em configuracoes.
- Estados:
  - Offline.
  - Sync pendente.
  - Atualizado.
- Dados necessarios:
  - Status de sync.
  - Versao/build.

### 12. Configuracoes e dados offline

- Status atual: nao existe.
- Rota sugerida: `/configuracoes`.
- Objetivo: dar controle e confianca sobre dados offline.
- Elementos:
  - Titulo: "Configuracoes".
  - Status da ultima sincronizacao.
  - Tamanho aproximado do cache.
  - Toggle de baixar imagens para uso offline, se aplicavel.
  - Botao "Sincronizar agora".
  - Botao "Limpar cache e ressincronizar".
  - Secao "Sobre o app".
- Acoes:
  - Sincronizar agora.
  - Limpar cache com confirmacao.
  - Alterar preferencias locais.
- Estados:
  - Sincronizando.
  - Sync concluido.
  - Sync com falha.
  - Sem conexao.
- Dados necessarios:
  - Metadados de sync.
  - Preferencias locais.
  - Tamanho de cache.

### 13. Estado inicial sem dados

- Status atual: nao existe.
- Rota sugerida: estado reutilizavel, nao necessariamente uma rota.
- Objetivo: tratar fresh install offline sem crash, erro ou loading infinito.
- Elementos:
  - Icone/ilustracao simples.
  - Titulo: "Dados do evento ainda nao baixados".
  - Texto curto explicando que e necessario conectar uma vez para baixar a programacao.
  - Botao "Tentar baixar dados".
  - Link para informacoes basicas empacotadas, se existirem.
- Acoes:
  - Tentar sync.
  - Continuar com conteudo minimo local, se disponivel.
- Estados:
  - Sem conexao.
  - Baixando dados.
  - Falha no download.
  - Sucesso, navegando para Home.
- Dados necessarios:
  - Status de conexao.
  - Status de primeira sincronizacao.

## Telas de apoio opcionais

### Compartilhamento / modal de acoes

- Rota sugerida: modal interno.
- Uso: evento, polo e turismo.
- Elementos: compartilhar, copiar texto, favoritar, abrir mapa.

### Avisos oficiais

- Rota sugerida: `/avisos`.
- Uso: comunicados da organizacao, mudancas de horario, seguranca e transporte.
- Elementos: lista de avisos, destaque de urgencia, data de atualizacao.

### Ajuda e informacoes uteis

- Rota sugerida: `/ajuda`.
- Uso: telefones, postos de saude, achados e perdidos, transporte, acessibilidade.
- Elementos: secoes colapsaveis e botoes de chamada externa.

## Componentes que devem ser criados ou evoluidos

- `EventListScreen`: lista performatica com filtros, favoritos e empty states.
- `SearchScreen`: busca local global.
- `EventDetailScreen`: detalhe completo usando o mesmo chrome visual.
- `MapScreen`: mapa/lista offline de polos e pontos de apoio.
- `PlaceDetailScreen`: detalhe de polo/local.
- `TourismHubScreen`: hub de turismo e cultura.
- `TourismDetailScreen`: detalhe editorial de turismo/cultura/gastronomia.
- `FavoritesScreen`: itens salvos localmente.
- `SettingsScreen`: sync, cache e preferencias.
- `OfflineEmptyState`: estado de primeiro uso sem dados.
- `SyncStatusBadge`: indicador discreto de offline/sync no header.
- `FilterChips`: componente reutilizavel para categorias/dias.
- `FavoriteButton`: acao reutilizavel para eventos, polos e turismo.

## Ordem recomendada de implementacao

1. Conectar a Home operacional ao fluxo inicial e fazer o CTA da Boas-vindas navegar.
2. Completar Programacao de eventos com filtros, favoritos e empty states.
3. Completar Detalhe do evento com local, acoes e relacionamento com mapa.
4. Criar Busca global local.
5. Completar Mapa dos polos e Detalhe do polo.
6. Criar Turismo e cultura + Detalhe turistico.
7. Criar Favoritos.
8. Criar Configuracoes e estados offline/sync.
9. Remover a tela `explore` de exemplo do template, se nao for mais usada.

## Checklist minimo por tela

- Funciona sem internet quando o cache existe.
- Nao exibe loading infinito.
- Tem empty state especifico.
- Tem erro nao bloqueante para sync.
- Usa dados locais como fonte primaria.
- Usa listas performaticas para colecoes grandes.
- Mantem toque minimo confortavel em botoes e cards.
- Evita depender de imagem remota no caminho critico.
- Mantem linguagem clara e regional, sem excesso de texto.
