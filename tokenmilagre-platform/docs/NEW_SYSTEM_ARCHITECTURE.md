# 🏗️ ARQUITETURA DO NOVO SISTEMA DE ARTIGOS

**Data**: 2025-11-18
**Status**: PLANEJAMENTO
**Versão**: 2.0.0-alpha
**Autor**: Claude Code (DevSenior)

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Princípios de Design](#princípios-de-design)
3. [Arquitetura em Camadas](#arquitetura-em-camadas)
4. [Módulos Core](#módulos-core)
5. [Schema de Dados Otimizado](#schema-de-dados-otimizado)
6. [APIs v2 - Especificação](#apis-v2---especificação)
7. [Sistema de Logging e Monitoramento](#sistema-de-logging-e-monitoramento)
8. [Estratégia de Cache e Performance](#estratégia-de-cache-e-performance)
9. [Segurança e Validação](#segurança-e-validação)
10. [Plano de Testes](#plano-de-testes)
11. [Roadmap de Implementação](#roadmap-de-implementação)
12. [Plano de Migração](#plano-de-migração)

---

## 🎯 VISÃO GERAL

### Objetivo

Criar um sistema **modular**, **escalável** e **testável** para gerenciamento de artigos, substituindo as 3 páginas atuais por uma arquitetura moderna baseada em:

- **Clean Architecture** (camadas desacopladas)
- **Domain-Driven Design** (lógica de negócio centralizada)
- **API-First** (contratos bem definidos)
- **Test-Driven Development** (cobertura >80%)

### Restrições

- ✅ **Páginas antigas INTOCÁVEIS** até validação completa
- ✅ **Novo sistema roda em paralelo** (versionamento de APIs)
- ✅ **Zero breaking changes** nas APIs públicas existentes
- ✅ **Migração gradual** com rollback seguro

---

## 🏛️ PRINCÍPIOS DE DESIGN

### 1. **Separation of Concerns**
- Lógica de negócio separada de UI
- Services isolados e reutilizáveis
- Hooks customizados APENAS para state management

### 2. **Single Source of Truth**
- Cache centralizado (React Query)
- Validação única (server-side)
- Schema Prisma como fonte de verdade

### 3. **Fail-Safe & Observable**
- Erros sempre tratados com fallback
- Logs estruturados em todos os pontos críticos
- Métricas de performance em tempo real

### 4. **API-First Development**
- Contratos OpenAPI documentados
- Idempotência garantida
- Versionamento semântico (v2, v3...)

### 5. **Progressive Enhancement**
- Sistema funciona sem JavaScript (SSR)
- Cache otimista melhora UX
- Loading states e skeletons

---

## 🧱 ARQUITETURA EM CAMADAS

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (Next.js Pages, React Components, Client Hooks)         │
│                                                           │
│  - /dashboard/v2/articles/                               │
│  - useArticles(), useCreateArticle(), useBulkGenerate()  │
│  - ArticleList, ArticleForm, BulkGenerator (components)  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│         (API Routes, DTOs, Request Handlers)             │
│                                                           │
│  - /api/v2/articles                                      │
│  - Validation Middleware (Zod)                           │
│  - Error Handling Middleware                             │
│  - Rate Limiting Middleware                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER (CORE)                   │
│        (Business Logic, Services, Use Cases)             │
│                                                           │
│  ArticleService (CRUD + validação)                       │
│  BulkGenerationService (geração em massa)                │
│  ValidationService (regras de negócio)                   │
│  PerplexityService (integração AI)                       │
│  CacheService (invalidação inteligente)                  │
│  ErrorService (tratamento padronizado)                   │
│  LoggerService (logs estruturados)                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                     │
│      (Prisma ORM, External APIs, File System)            │
│                                                           │
│  - Prisma Client (database)                              │
│  - Perplexity API Client                                 │
│  - Sentry SDK (monitoring)                               │
│  - Redis Client (cache - opcional)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 MÓDULOS CORE

### 1. **ArticleService** (`lib/services/article-service.ts`)

**Responsabilidades**:
- CRUD completo de artigos
- Validação de regras de negócio
- Geração de slugs únicos
- Cálculo de readTime
- Processamento de conteúdo Markdown

**Métodos Públicos**:
```typescript
class ArticleService {
  // Queries
  async findById(id: string): Promise<Article | null>
  async findBySlug(slug: string): Promise<Article | null>
  async findMany(filters: ArticleFilters, pagination: Pagination): Promise<PaginatedArticles>
  async count(filters: ArticleFilters): Promise<number>

  // Mutations
  async create(data: CreateArticleDTO): Promise<Article>
  async update(id: string, data: UpdateArticleDTO): Promise<Article>
  async delete(id: string): Promise<void>
  async publish(id: string): Promise<Article>
  async unpublish(id: string): Promise<Article>

  // Utilities
  async generateSlug(title: string, type: ArticleType): Promise<string>
  calculateReadTime(content: string): string
  validateContent(content: string, type: ArticleType): ValidationResult
}
```

**Dependências**:
- `PrismaClient` (injetado via DI)
- `LoggerService` (injetado via DI)
- `ValidationService` (injetado via DI)

---

### 2. **BulkGenerationService** (`lib/services/bulk-generation-service.ts`)

**Responsabilidades**:
- Geração em massa via Perplexity
- Gerenciamento de filas (queue)
- Progress tracking
- Retry automático com exponential backoff
- Detecção de duplicados

**Métodos Públicos**:
```typescript
class BulkGenerationService {
  async searchTopics(type: ArticleType, count: number): Promise<string[]>
  async checkDuplicates(topics: string[], type: ArticleType): Promise<string[]>
  async generateBatch(topics: string[], type: ArticleType): Promise<BatchResult>
  async generateSingle(topic: string, type: ArticleType): Promise<Article>

  // Progress tracking
  subscribeToProgress(batchId: string, callback: ProgressCallback): Unsubscribe
  getBatchStatus(batchId: string): BatchStatus
}
```

**Features Avançadas**:
- **Queue System**: Evita sobrecarga de API
- **Parallel Execution**: Gera até 3 artigos em paralelo (configurável)
- **Smart Retry**: Exponential backoff com jitter
- **Duplicate Detection**: Hash-based + similaridade semântica

---

### 3. **ValidationService** (`lib/services/validation-service.ts`)

**Responsabilidades**:
- Validação única server-side (Zod)
- Sanitização de inputs
- Regras de negócio customizadas
- Validação de permissões (RBAC)

**Métodos Públicos**:
```typescript
class ValidationService {
  // Schema validation
  validateArticle(data: unknown, type: ArticleType): ValidationResult<Article>
  validateResource(data: unknown): ValidationResult<Resource>

  // Business rules
  canUserPublish(userId: string, articleId: string): Promise<boolean>
  canUserDelete(userId: string, articleId: string): Promise<boolean>

  // Content validation
  sanitizeMarkdown(content: string): string
  validateSlugUniqueness(slug: string, excludeId?: string): Promise<boolean>

  // Batch validation
  validateBatch(items: unknown[], type: ArticleType): BatchValidationResult
}
```

**Schemas Zod**:
- `ArticleCreateSchema`
- `ArticleUpdateSchema`
- `ResourceCreateSchema`
- `BulkGenerationSchema`

---

### 4. **PerplexityService** (`lib/services/perplexity-service.ts`)

**Responsabilidades**:
- Chamadas à API Perplexity
- Retry com exponential backoff
- Circuit breaker pattern
- Response parsing e validação

**Métodos Públicos**:
```typescript
class PerplexityService {
  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>
  async generateArticle(prompt: string, type: ArticleType): Promise<GeneratedArticle>
  async searchTopics(query: string, count: number): Promise<string[]>

  // Advanced
  async streamChat(messages: Message[], onChunk: ChunkCallback): Promise<void>
  getUsageStats(): UsageStats
}
```

**Circuit Breaker**:
- Abre após 5 erros consecutivos
- Half-open após 30s
- Fecha após 2 sucessos

---

### 5. **ErrorService** (`lib/services/error-service.ts`)

**Responsabilidades**:
- Tratamento padronizado de erros
- Logging estruturado
- Error boundaries
- User-friendly messages

**Hierarquia de Erros**:
```typescript
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public isOperational: boolean = true
  )
}

class ValidationError extends AppError
class NotFoundError extends AppError
class UnauthorizedError extends AppError
class ConflictError extends AppError
class ExternalAPIError extends AppError
```

**Error Handler Middleware**:
```typescript
async function errorHandler(
  err: Error,
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse> {
  // Log error
  logger.error(err)

  // Send to Sentry (production)
  if (isProd) Sentry.captureException(err)

  // Return user-friendly response
  return NextResponse.json({
    error: {
      code: err.code,
      message: err.isOperational ? err.message : 'Internal server error',
      ...(isDev && { stack: err.stack })
    }
  }, { status: err.statusCode || 500 })
}
```

---

### 6. **LoggerService** (`lib/services/logger-service.ts`)

**Responsabilidades**:
- Logs estruturados (JSON)
- Níveis: debug, info, warn, error, fatal
- Context enrichment (userId, requestId, etc)
- Integration com Sentry, LogRocket

**Interface**:
```typescript
interface Logger {
  debug(message: string, meta?: object): void
  info(message: string, meta?: object): void
  warn(message: string, meta?: object): void
  error(message: string, error: Error, meta?: object): void
  fatal(message: string, error: Error, meta?: object): void
}

class LoggerService implements Logger {
  private context: LogContext = {}

  setContext(context: LogContext): void
  clearContext(): void
  child(context: LogContext): Logger
}
```

**Formato de Log**:
```json
{
  "timestamp": "2025-11-18T10:30:00.123Z",
  "level": "error",
  "message": "Failed to create article",
  "context": {
    "userId": "user_123",
    "requestId": "req_abc",
    "articleType": "news"
  },
  "error": {
    "name": "ValidationError",
    "message": "Title is required",
    "stack": "..."
  }
}
```

---

### 7. **CacheService** (`lib/services/cache-service.ts`)

**Responsabilidades**:
- Gerenciamento de cache (React Query)
- Invalidação inteligente
- Prefetching estratégico
- Optimistic updates

**Estratégias de Cache**:
```typescript
const cacheConfig = {
  articles: {
    staleTime: 5 * 60 * 1000, // 5min
    cacheTime: 30 * 60 * 1000, // 30min
    refetchOnWindowFocus: true,
  },

  article: {
    staleTime: 10 * 60 * 1000, // 10min
    cacheTime: 60 * 60 * 1000, // 1h
    refetchOnMount: false,
  },

  bulkGeneration: {
    staleTime: 0, // always fresh
    cacheTime: 5 * 60 * 1000, // 5min
    refetchInterval: 2000, // poll every 2s
  }
}
```

**Invalidation Rules**:
```typescript
// After create
queryClient.invalidateQueries(['articles'])
queryClient.invalidateQueries(['articles-count'])

// After update
queryClient.invalidateQueries(['article', articleId])
queryClient.invalidateQueries(['articles'])

// After delete
queryClient.removeQueries(['article', articleId])
queryClient.invalidateQueries(['articles'])
```

---

## 🗄️ SCHEMA DE DADOS OTIMIZADO

Ver arquivo separado: `docs/NEW_PRISMA_SCHEMA.md`

**Principais Melhorias**:
1. **Tabelas Pivot** para relacionamentos M:N
2. **Índices Compostos** para queries combinadas
3. **JSON Fields** substituídos por relações quando possível
4. **Soft Deletes** para auditoria
5. **Timestamps** completos (createdAt, updatedAt, deletedAt)

---

## 🌐 APIs v2 - ESPECIFICAÇÃO

Ver arquivo separado: `docs/API_V2_SPECIFICATION.md`

**Endpoints Principais**:
```
GET    /api/v2/articles
GET    /api/v2/articles/:id
POST   /api/v2/articles
PATCH  /api/v2/articles/:id
DELETE /api/v2/articles/:id
POST   /api/v2/articles/:id/publish
POST   /api/v2/articles/:id/unpublish

POST   /api/v2/bulk/search-topics
POST   /api/v2/bulk/generate
GET    /api/v2/bulk/:batchId/status
```

---

## 📊 SISTEMA DE LOGGING E MONITORAMENTO

Ver arquivo separado: `docs/LOGGING_MONITORING.md`

**Stack**:
- **Sentry** (error tracking)
- **LogRocket** (session replay - opcional)
- **Custom Logger** (structured logs)
- **Dashboard** (real-time metrics)

**Métricas Chave**:
- Request latency (p50, p95, p99)
- Error rate (por endpoint)
- Cache hit rate
- AI API usage & costs
- User actions (analytics)

---

## ⚡ ESTRATÉGIA DE CACHE E PERFORMANCE

Ver arquivo separado: `docs/CACHE_PERFORMANCE.md`

**Otimizações**:
1. **React Query** para data fetching
2. **Optimistic Updates** para mutations
3. **Prefetching** em hover/focus
4. **Virtualization** para listas longas
5. **Code Splitting** por rota
6. **Image Optimization** (Next.js)

**Targets de Performance**:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTI < 3.5s

---

## 🔐 SEGURANÇA E VALIDAÇÃO

Ver arquivo separado: `docs/SECURITY.md`

**Camadas de Segurança**:
1. **Input Validation** (Zod server-side)
2. **Sanitization** (DOMPurify, markdown-it-sanitizer)
3. **CSRF Protection** (tokens)
4. **Rate Limiting** (por IP, por usuário)
5. **RBAC** (role-based access control)
6. **SQL Injection** (Prisma previne)
7. **XSS Protection** (Content Security Policy)

---

## 🧪 PLANO DE TESTES

Ver arquivo separado: `docs/TEST_PLAN.md`

**Cobertura Mínima**: 80%

**Tipos de Teste**:
1. **Unit Tests** (Jest) - Services, utils
2. **Integration Tests** (Playwright) - API routes
3. **E2E Tests** (Playwright) - User flows
4. **Load Tests** (k6) - Performance
5. **Security Tests** (OWASP ZAP) - Vulnerabilities

---

## 🗺️ ROADMAP DE IMPLEMENTAÇÃO

Ver arquivo separado: `docs/IMPLEMENTATION_ROADMAP.md`

**Fases**:
1. **Semana 1**: Setup + Schema + Services Core
2. **Semana 2**: APIs v2 + Validation + Error Handling
3. **Semana 3**: Logging + Monitoring + Cache
4. **Semana 4**: Testes + Documentação
5. **Semana 5**: Validação + Stress Tests
6. **Semana 6+**: Migração Gradual

---

## 🔄 PLANO DE MIGRAÇÃO

Ver arquivo separado: `docs/MIGRATION_PLAN.md`

**Estratégia**: Feature Flags + Canary Deployment

**Timeline**:
- **Dia 0**: Deploy novo sistema (v2) em paralelo
- **Dia 1-7**: Testes internos (admin/editor)
- **Dia 8-14**: Beta testing (10% usuários)
- **Dia 15-30**: Rollout gradual (50% → 100%)
- **Dia 31+**: Deprecate v1, remove páginas antigas

**Rollback Plan**: Feature flag toggle imediato

---

## 📚 PRÓXIMOS PASSOS

1. ✅ **Review desta documentação** (você está aqui)
2. ⏳ Criar schemas detalhados (Prisma, Zod)
3. ⏳ Implementar módulos core
4. ⏳ Criar APIs v2
5. ⏳ Implementar testes
6. ⏳ Validar com casos reais
7. ⏳ Migração gradual

---

**Status**: 📝 AGUARDANDO APROVAÇÃO PARA IMPLEMENTAÇÃO

**Última Atualização**: 2025-11-18 10:35 BRT
