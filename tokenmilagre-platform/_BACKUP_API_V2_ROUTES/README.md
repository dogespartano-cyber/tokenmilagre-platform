# Backup: API v2 Routes (Temporariamente Removidas)

**Data do Backup:** 2025-11-18
**Origem:** Commit `187fccd^` (antes da remoção)
**Motivo:** Rotas removidas temporariamente para estabilizar produção durante migração de schema

---

## 📦 Arquivos Neste Backup

### 1. `articles-route.ts`
**Caminho original:** `app/api/v2/articles/route.ts`
**Endpoints:**
- `GET /api/v2/articles` - List articles (com filtros, paginação, busca)
- `POST /api/v2/articles` - Create article

**Features:**
- Filtros: type, status, categoryId, authorId, tagId, search
- Paginação: page, limit
- Sorting: sortBy, sortOrder
- Authentication: Optional (public endpoint com features extras para autenticados)
- Rate limiting: Por role
- Validação completa com Zod

### 2. `articles-id-route.ts`
**Caminho original:** `app/api/v2/articles/[id]/route.ts`
**Endpoints:**
- `GET /api/v2/articles/[id]` - Get article by ID
- `PATCH /api/v2/articles/[id]` - Update article
- `DELETE /api/v2/articles/[id]` - Delete article (soft delete)

**Features:**
- Ownership checks (AUTHOR pode editar apenas próprios artigos)
- Role checks (ADMIN pode editar qualquer artigo)
- Soft delete (deletedAt)
- Validação de permissões granular
- Error handling robusto

### 3. `articles-id-restore-route.ts`
**Caminho original:** `app/api/v2/articles/[id]/restore/route.ts`
**Endpoints:**
- `POST /api/v2/articles/[id]/restore` - Restore deleted article

**Features:**
- Apenas EDITOR+ pode restaurar
- Valida se artigo está deletado antes
- Limpa deletedAt e atualiza status

### 4. `articles-bulk-route.ts`
**Caminho original:** `app/api/v2/articles/bulk/route.ts`
**Endpoints:**
- `POST /api/v2/articles/bulk` - Bulk operations (publish, archive, delete)

**Features:**
- Operações em massa (até 50 artigos)
- Operations: 'publish', 'archive', 'delete'
- Transacional (tudo ou nada)
- Apenas EDITOR+ tem acesso
- Validação de limites (max 50 artigos)

### 5. `articles-stats-route.ts`
**Caminho original:** `app/api/v2/articles/stats/route.ts`
**Endpoints:**
- `GET /api/v2/articles/stats` - Get statistics (total, by status, by type)

**Features:**
- Estatísticas agregadas
- Total de artigos
- Count por status (DRAFT, PUBLISHED, ARCHIVED)
- Count por type (NEWS, EDUCATIONAL, RESOURCE)
- Performance otimizado com queries agregadas

---

## 🔄 Como Restaurar

**Quando a migração do schema v2 estiver completa**, execute:

```bash
# 1. Criar estrutura de diretórios
mkdir -p app/api/v2/articles/[id]/restore
mkdir -p app/api/v2/articles/bulk
mkdir -p app/api/v2/articles/stats

# 2. Copiar arquivos de backup para os caminhos originais
cp _BACKUP_API_V2_ROUTES/articles-route.ts app/api/v2/articles/route.ts
cp _BACKUP_API_V2_ROUTES/articles-id-route.ts app/api/v2/articles/[id]/route.ts
cp _BACKUP_API_V2_ROUTES/articles-id-restore-route.ts app/api/v2/articles/[id]/restore/route.ts
cp _BACKUP_API_V2_ROUTES/articles-bulk-route.ts app/api/v2/articles/bulk/route.ts
cp _BACKUP_API_V2_ROUTES/articles-stats-route.ts app/api/v2/articles/stats/route.ts

# 3. Habilitar feature flag
# Vercel: ENABLE_API_V2=true
# OU .env.local: ENABLE_API_V2=true

# 4. Testar
npm run build
npm run test
npx playwright test
```

**Ver:** `ACTIVATION_PROCEDURE_API_V2.md` para procedimento completo passo a passo.

---

## 📋 Dependências

Estes arquivos dependem de:

### Services (também em backup)
- `lib/services/article-service.ts` (backup em `_BACKUP-article-service.ORIGINAL.txt`)
- `lib/services/logger-service.ts` (backup em `_BACKUP-logger-service.ORIGINAL.txt`)
- `lib/services/validation-service.ts`
- `lib/services/error-service.ts`

### Schemas
- `lib/schemas/article-schemas.ts` (já presente)
  - `articleQuerySchema`
  - `articleCreateSchema`
  - `articleUpdateSchema`
  - `bulkOperationSchema`

### Middleware
- `lib/middleware/auth.ts`
  - `authenticate()`
  - `authenticateOptional()`
  - `requireMinimumRole()`

- `lib/middleware/rate-limit.ts`
  - `checkRateLimit()`
  - `getRateLimitInfo()`

### DI Container
- `lib/di/container.ts`
  - `ServiceLocator.getArticle()`
  - `ServiceLocator.getLogger()`
  - `ServiceLocator.getValidation()`

### Prisma Schema
- `schema-v2.prisma` (DEVE estar aplicado no banco)
  - Model: `Article`
  - Model: `Category`
  - Model: `Tag`
  - Model: `ArticleTag`
  - Enum: `ArticleType`
  - Enum: `ArticleStatus`

---

## ⚠️ IMPORTANTE

**NÃO restaure estes arquivos até que:**

1. ✅ Schema v2 esteja aplicado no banco de produção
2. ✅ Dados tenham sido migrados (categorias, status, etc.)
3. ✅ Testes em staging tenham passado 100%
4. ✅ Services também tenham sido restaurados dos backups
5. ✅ Feature flag `ENABLE_API_V2=true` esteja configurada

**Se restaurar antes da migração de schema:**
- ❌ **Erros de schema** (campos não existem)
- ❌ **Falha de build** (TypeScript errors)
- ❌ **Runtime errors** (Prisma queries falham)
- ❌ **Dados corrompidos** (se forçar execução)

---

## 🧪 Testes Relacionados

Estes testes dependem das rotas restauradas:

### Integration Tests (Supertest)
- `__tests__/api/v2/articles/list.test.ts` (30 testes)
- `__tests__/api/v2/articles/create.test.ts` (35 testes)
- `__tests__/api/v2/articles/update-delete.test.ts` (25 testes)
- `__tests__/api/v2/articles/bulk-restore.test.ts` (30 testes)
- `__tests__/api/v2/articles/stats.test.ts` (15 testes)

**Total:** 135 testes de integração

### E2E Tests (Playwright)
- `e2e/tests/article-crud.spec.ts` (27 testes)
- `e2e/tests/bulk-operations.spec.ts` (15 testes)
- `e2e/tests/optimistic-updates.spec.ts` (18 testes)
- `e2e/tests/search-filter.spec.ts` (35 testes)
- `e2e/tests/pagination.spec.ts` (42 testes)
- `e2e/tests/error-handling.spec.ts` (28 testes)

**Total:** 165+ testes E2E

**Cobertura Total:** 300+ testes dependem destas rotas.

---

## 📚 Documentação

- [ACTIVATION_PROCEDURE_API_V2.md](../ACTIVATION_PROCEDURE_API_V2.md) - Procedimento completo
- [MIGRATION_PLAN.md](../MIGRATION_PLAN.md) - Plano de migração
- [STATUS.md](../STATUS.md) - Status atual do sistema
- [e2e/README.md](../e2e/README.md) - Documentação E2E
- [__tests__/api/v2/README.md](../__tests__/api/v2/README.md) - Testes de integração

---

## 🔍 Verificação de Integridade

Para verificar que os backups estão completos:

```bash
# Verificar se todos os 5 arquivos existem
ls -lh _BACKUP_API_V2_ROUTES/
# Deve mostrar:
# - articles-route.ts (5.7K)
# - articles-id-route.ts (6.1K)
# - articles-id-restore-route.ts (2.1K)
# - articles-bulk-route.ts (2.8K)
# - articles-stats-route.ts (2.1K)

# Verificar sintaxe TypeScript (deve compilar sem erros)
npx tsc --noEmit _BACKUP_API_V2_ROUTES/*.ts

# Verificar imports (não deve ter imports quebrados)
grep -r "import.*from" _BACKUP_API_V2_ROUTES/
```

---

**Backup criado automaticamente por:** Claude Code
**Data:** 2025-11-18
**Commit origem:** `187fccd^` (antes da remoção)
**Status:** ✅ ÍNTEGRO - Pronto para restauração
