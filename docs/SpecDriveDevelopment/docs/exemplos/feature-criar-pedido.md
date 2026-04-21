# 🧩 Feature: Criar Pedido

> **Slug:** criar-pedido
> **Prioridade:** alta
> **Escopo:** fullstack

---

## 🎯 Objetivo

> O que essa feature faz?

* Qual é o objetivo principal?
* Qual resultado final esperado?

**Resposta:** Permitir que clientes autenticados criem pedidos selecionando produtos do catálogo, definindo quantidade e confirmando a compra. O resultado final é um pedido persistido com status "pendente", visível no painel do cliente e do admin.

---

## ❗ Problema que resolve

> Por que essa feature existe?

* Qual dor do usuário/sistema?
* O que acontece se isso não existir?

**Resposta:** Hoje os pedidos são feitos por WhatsApp e registrados manualmente em planilha. Isso gera erros de digitação, pedidos duplicados e perda de histórico. Sem essa feature, a operação não escala além de ~30 pedidos/dia.

---

## 🚫 Não-objetivos

> O que essa feature **NÃO** faz?

* O que está explicitamente fora do escopo?
* Quais funcionalidades relacionadas ficam para o futuro?

**Resposta:**
- NÃO inclui pagamento online (será feature separada `processar-pagamento`).
- NÃO inclui cálculo de frete (por enquanto é valor fixo configurável).
- NÃO inclui carrinho persistente (o "carrinho" é apenas o estado do formulário de pedido).

---

## 👤 Atores envolvidos

* Quem usa essa feature?
* Existe mais de um tipo de usuário/papel?
* Algum ator é um sistema (cron, webhook, serviço externo)?

**Resposta:**
- **Cliente** (role: `customer`) — cria o pedido.
- **Admin** (role: `admin`) — visualiza pedidos criados (não faz parte desta feature, mas é impactado).
- **Sistema** — envia e-mail de confirmação após criação (job assíncrono).

---

## 📋 Casos de uso

Para cada caso, descreva pré-condição, ação e resultado:

| # | Pré-condição | Ação do ator | Resultado esperado |
|---|-------------|-------------|-------------------|
| 1 | Cliente logado, catálogo com produtos | Seleciona 2 produtos, define qtd, confirma | Pedido criado com status "pendente", e-mail enviado |
| 2 | Cliente logado, produto sem estoque | Tenta adicionar produto sem estoque | Mensagem "Produto indisponível", não permite adicionar |
| 3 | Cliente logado, pedido com valor > R$500 | Confirma pedido | Pedido criado com flag `revisao_manual = true` |

**Resposta:** Cobertos acima.

---

## ⚖️ Regras de negócio (OBRIGATÓRIO)

* Quais condições devem ser respeitadas?
* Existem limites? (quantidade, valor, tempo)
* Existem cálculos? (fórmulas, arredondamentos)
* Existem regras condicionais? (se X então Y)

**Resposta:**
- Mínimo de 1 produto por pedido.
- Máximo de 20 itens distintos por pedido.
- Quantidade por item: 1 a 999.
- Valor total = soma de (preço_unitário × quantidade) para cada item + frete fixo (configurável em env).
- Se valor total > R$500, pedido é marcado `revisao_manual = true`.
- Estoque é reservado (decrementado) no momento da criação — se falhar, rollback.
- Preço usado é o preço do produto **no momento da criação** (snapshot), não referência ao catálogo.

---

## 🚧 Restrições

* O que NÃO pode acontecer?
* Limitações técnicas? (performance, compatibilidade)
* Limitações de negócio? (legais, compliance)

**Resposta:**
- Não pode criar pedido com produto que tenha estoque = 0.
- Não pode alterar pedido após criação (feature futura `editar-pedido`).
- Não pode criar pedido sem estar autenticado.

---

## 🔄 Fluxo geral (resumido)

Descreva o passo a passo macro:

1. Cliente acessa página de novo pedido.
2. Seleciona produtos e quantidades.
3. Revisa resumo (itens + valor total + frete).
4. Confirma pedido.
5. Sistema valida estoque, cria pedido, reserva estoque, envia e-mail.
6. Cliente vê confirmação com número do pedido.

---

## 📥 Entradas esperadas

* Quais dados entram?
* Tipos?
* Obrigatórios?
* Existem valores default?

**Resposta:**

| Campo | Tipo | Obrigatório | Default | Regra |
|-------|------|-------------|---------|-------|
| items | array | Sim | — | Mín 1, máx 20 elementos |
| items[].product_id | UUID | Sim | — | Deve existir no catálogo |
| items[].quantity | integer | Sim | — | 1–999 |
| notes | string | Não | null | Máx 500 caracteres |

---

## 📤 Saídas esperadas

* O que a feature retorna/produz?
* Qual o resultado final para o usuário?
* Qual o resultado final para o sistema? (dados persistidos, eventos emitidos)

**Resposta:**
- **Para o usuário:** tela de confirmação com número do pedido, lista de itens e valor total.
- **Para o sistema:** registro na tabela `orders` + itens em `order_items`, estoque decrementado em `products.stock`, evento `pedido.criado` emitido, job de e-mail enfileirado.

---

## ⚠️ Erros e exceções

Para cada erro previsível:

| Situação | Mensagem ao usuário | Código HTTP (se API) | Ação de recuperação |
|----------|--------------------|--------------------|-------------------|
| Produto sem estoque | "Produto X está indisponível no momento" | 422 | Remover item e tentar novamente |
| Produto não encontrado | "Produto não encontrado" | 404 | Verificar catálogo |
| Quantidade inválida | "Quantidade deve ser entre 1 e 999" | 422 | Corrigir quantidade |
| Lista de itens vazia | "Adicione pelo menos 1 produto" | 422 | Adicionar produto |
| Não autenticado | Redireciona para login | 401 | Fazer login |
| Erro interno | "Erro ao criar pedido. Tente novamente." | 500 | Retry |

**Resposta:** Cobertos acima.

---

## 🔐 Segurança

* Precisa autenticação?
* Permissões específicas por papel/role?
* Manipula dados sensíveis? (PII, senhas, cartões)
* Validações contra input malicioso?

**Resposta:**
- Autenticação obrigatória (JWT).
- Apenas role `customer` pode criar pedidos.
- Não manipula dados sensíveis (sem pagamento nesta feature).
- Sanitização de `notes` contra XSS.
- Validação de `product_id` como UUID válido para evitar injection.

---

## 🧱 Dependências

* Depende de API externa?
* Depende de tabelas/schema de banco?
* Depende de outras features? Quais?
* Depende de serviço terceiro? (pagamento, e-mail, storage)

**Resposta:**
- Tabelas: `products` (existente), `orders` (nova), `order_items` (nova).
- Feature: catálogo de produtos (já implementada).
- Serviço: envio de e-mail (SMTP configurado).

---

## 🧩 Impacto no sistema

* Quais partes do sistema serão afetadas?
* Existe risco de quebrar algo existente?
* Exige migração de dados?

**Resposta:**
- Tabela `products` terá campo `stock` decrementado — risco de race condition se dois pedidos simultâneos.
- Migração: criar tabelas `orders` e `order_items`.
- Não quebra funcionalidade existente.

---

## 🧪 Critérios de aceitação (OBRIGATÓRIO)

- [ ] Deve criar pedido com status "pendente" ao confirmar
- [ ] Deve decrementar estoque dos produtos ao criar pedido
- [ ] Deve impedir criação se produto sem estoque
- [ ] Deve impedir criação sem autenticação
- [ ] Deve impedir criação com role diferente de `customer`
- [ ] Deve marcar `revisao_manual = true` se valor > R$500
- [ ] Deve enviar e-mail de confirmação após criar
- [ ] Deve exibir número do pedido na tela de confirmação
- [ ] Deve retornar erro claro para cada cenário de falha

---

## 📎 Artefatos derivados

Marque quais specs filhas serão criadas a partir desta feature:

- [x] Flow — `docs/specs/flows/criar-pedido.md`
- [x] API — `docs/specs/api/criar-pedido.md`
- [x] Page — `docs/specs/pages/criar-pedido.md`
- [ ] UI Component — não necessário (usa componentes existentes)
- [x] Modal — `docs/specs/modals/criar-pedido.md` (modal de confirmação)
- [x] Backend Structure — `docs/specs/backend/criar-pedido.md`

---

## ✅ Gate 1 — Checklist de validação

> **Antes de expandir em artefatos filhos, TODOS os itens obrigatórios devem estar respondidos.**

| Pergunta | Status |
|----------|--------|
| Regras de negócio estão completas e testáveis? | (x) Sim ( ) Não |
| Entradas e saídas definidas (tipos, obrigatoriedade)? | (x) Sim ( ) Não |
| Erros e exceções mapeados (mensagens, códigos, recuperação)? | (x) Sim ( ) Não |
| Segurança (auth, permissões, dados sensíveis)? | (x) Sim ( ) Não |
| Critérios de aceitação em formato verificável? | (x) Sim ( ) Não |
| Dependências e impacto no sistema listados? | (x) Sim ( ) Não |

> Gate 1 **aprovado**. Pode expandir em artefatos filhos.

---

## ❓ Dúvidas em aberto

* Frete fixo: qual o valor inicial? (aguardando definição do PM — prazo: 10/04)
* Limite de 20 itens é suficiente? (validar com operação)

---

## 📝 Observações

* Essa feature é pré-requisito para a feature `processar-pagamento`.
