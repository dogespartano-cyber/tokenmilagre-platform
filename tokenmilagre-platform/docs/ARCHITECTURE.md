# 🏗️ Arquitetura do Token Milagre Platform

**Versão:** 2.0.0
**Última Atualização:** 2025-11-19
**Status:** ✅ Produção

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Clean Architecture](#clean-architecture)
3. [Fluxo de Requisição](#fluxo-de-requisição)
4. [Dependency Injection](#dependency-injection)
5. [Services Core](#services-core)
6. [Padrões de Código](#padrões-de-código)
7. [Segurança](#segurança)
8. [Performance e Cache](#performance-e-cache)
9. [Monitoramento](#monitoramento)

---

## 🎯 Visão Geral

### Princípios Arquiteturais

O Token Milagre Platform segue os princípios de **Clean Architecture** e **Domain-Driven Design**:

- **Separation of Concerns:** Cada camada tem responsabilidades bem definidas
- **Dependency Inversion:** Dependências apontam para abstrações, não implementações
- **Single Responsibility:** Cada módulo/classe tem uma única responsabilidade
- **DRY (Don't Repeat Yourself):** Código reutilizável via services e helpers
- **Type Safety:** 100% TypeScript com validação Zod

### Stack Tecnológico

```mermaid
graph TB
    subgraph Frontend["Frontend"]
        Next[Next.js 15.5.4<br/>App Router + Turbopack]
        React[React 19.1.0<br/>Server & Client Components]
        TailwindCSS[Tailwind CSS 4<br/>Styling]
        ReactQuery[@tanstack/react-query<br/>State Management]
    end

    subgraph Backend["Backend"]
        NextAPI[Next.js API Routes<br/>Serverless Functions]
        Prisma[Prisma 6.19.0<br/>ORM]
        DI[tsyringe<br/>Dependency Injection]
    end

    subgraph Database["Database"]
        PostgreSQL[(Neon PostgreSQL<br/>Database)]
    end

    subgraph External["External Services"]
        Solana[Solana Web3.js<br/>Blockchain]
        Binance[Binance API<br/>Market Data]
        Perplexity[Perplexity AI<br/>Content Generation]
        Sentry[Sentry<br/>Error Tracking]
    end

    React --> Next
    Next --> NextAPI
    NextAPI --> DI
    DI --> Prisma
    Prisma --> PostgreSQL
    NextAPI --> External

    style Frontend fill:#e3f2fd
    style Backend fill:#fff3e0
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

---

## 🏛️ Clean Architecture

### Arquitetura em 4 Camadas

```mermaid
graph TB
    subgraph Presentation["🎨 Presentation Layer"]
        direction TB
        Pages[Next.js Pages<br/>app/**/*.tsx]
        API[API Routes<br/>app/api/**/*.ts]
        Components[Client Components<br/>components/**/*.tsx]
    end

    subgraph Application["⚙️ Application Layer - Services"]
        direction TB
        ArticleService[ArticleService<br/>CRUD + Bulk Operations]
        ValidationService[ValidationService<br/>Zod Schemas + Sanitization]
        ErrorService[ErrorService<br/>Error Handling + Logging]
        LoggerService[LoggerService<br/>Structured Logging]
    end

    subgraph Domain["💼 Domain Layer - Business Logic"]
        direction TB
        Schemas[Zod Schemas<br/>article-schemas.ts]
        Types[TypeScript Types<br/>DTOs & Interfaces]
        Rules[Business Rules<br/>Validation Rules]
    end

    subgraph Infrastructure["🔧 Infrastructure Layer"]
        direction TB
        Prisma[Prisma Client<br/>Type-safe ORM]
        DB[(PostgreSQL<br/>Neon Database)]
        ExternalAPIs[External APIs<br/>Adapters]
        Monitoring[Sentry<br/>Monitoring]
    end

    Pages --> ArticleService
    API --> ArticleService
    Components --> API

    ArticleService --> ValidationService
    ArticleService --> ErrorService
    ArticleService --> LoggerService

    ValidationService --> Schemas
    ErrorService --> LoggerService
    ArticleService --> Types

    ArticleService --> Prisma
    ArticleService --> ExternalAPIs
    Prisma --> DB
    ErrorService --> Monitoring

    style Presentation fill:#e1f5ff
    style Application fill:#fff4e6
    style Domain fill:#f3e5f5
    style Infrastructure fill:#e8f5e9
```

### Responsabilidades das Camadas

#### 🎨 Presentation Layer
- **Responsabilidade:** Interface com o usuário e entrada de dados
- **Tecnologias:** Next.js App Router, React Components
- **Regras:**
  - Não contém lógica de negócio
  - Apenas validação básica de UI (UX)
  - Chama services via DI container
  - Trata respostas e exibe ao usuário

#### ⚙️ Application Layer (Services)
- **Responsabilidade:** Orquestração de casos de uso
- **Tecnologias:** TypeScript Classes, tsyringe
- **Regras:**
  - Contém toda a lógica de negócio
  - Services são singleton (DI container)
  - Validação server-side obrigatória
  - Logging estruturado em todas as operações

#### 💼 Domain Layer
- **Responsabilidade:** Regras de negócio e definições de tipos
- **Tecnologias:** Zod, TypeScript
- **Regras:**
  - Schemas Zod como fonte de verdade
  - Regras de validação centralizadas
  - Independente de frameworks

#### 🔧 Infrastructure Layer
- **Responsabilidade:** Acesso a dados e serviços externos
- **Tecnologias:** Prisma, Fetch API, Sentry
- **Regras:**
  - Adapters para APIs externas
  - Type-safe database queries
  - Tratamento de erros de infraestrutura

---

## 🔄 Fluxo de Requisição

### Fluxo Completo (Create Article)

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant API as API Route<br/>/api/v2/articles
    participant Auth as Auth Helper<br/>requireAdmin()
    participant ArticleService as ArticleService
    participant Validation as ValidationService
    participant Logger as LoggerService
    participant Error as ErrorService
    participant Prisma as Prisma Client
    participant DB as Database
    participant Sentry as Sentry

    User->>API: POST /api/v2/articles<br/>{title, content, ...}

    API->>Auth: Verificar autenticação
    Auth-->>API: {success: true, user}

    API->>Logger: setContext({userId, endpoint})
    API->>ArticleService: create(data, userId)

    ArticleService->>Validation: validate(articleCreateSchema, data)
    Validation->>Validation: Zod validation
    Validation->>Validation: Sanitize HTML
    Validation-->>ArticleService: validated data

    ArticleService->>Logger: info('Creating article', {data})

    ArticleService->>Validation: generateSlug(title)
    Validation-->>ArticleService: slug

    ArticleService->>Prisma: article.create({data})
    Prisma->>DB: INSERT INTO Article
    DB-->>Prisma: Article row
    Prisma-->>ArticleService: Article object

    ArticleService->>Logger: info('Article created', {articleId})
    ArticleService-->>API: Article

    API->>Logger: clearContext()
    API-->>User: 201 Created<br/>{article}

    Note over Error,Sentry: Em caso de erro
    ArticleService->>Error: throw ValidationError()
    Error->>Logger: error('Validation failed', error)
    Error->>Sentry: captureException(error)
    Error-->>API: errorHandler(error)
    API-->>User: 400 Bad Request<br/>{error}
```

### Fluxo de Autenticação

```mermaid
graph LR
    Request[HTTP Request] --> AuthHelper{Auth Helper<br/>requireAdmin/requireEditor}

    AuthHelper --> GetSession[getServerSession<br/>NextAuth]
    GetSession --> CheckSession{Session<br/>exists?}

    CheckSession -->|No| Unauthorized[401 Unauthorized<br/>Response]
    CheckSession -->|Yes| CheckRole{Has<br/>required role?}

    CheckRole -->|No| Forbidden[403 Forbidden<br/>Response]
    CheckRole -->|Yes| Success[✅ Continue to<br/>Service Layer]

    style Request fill:#e3f2fd
    style Success fill:#c8e6c9
    style Unauthorized fill:#ffcdd2
    style Forbidden fill:#ffcdd2
```

### Fluxo de Validação

```mermaid
graph TB
    Input[User Input] --> ValidationService[ValidationService.validate]

    ValidationService --> ZodValidate[Zod Schema<br/>Validation]
    ZodValidate --> ZodValid{Valid?}

    ZodValid -->|No| ThrowError[throw ValidationError<br/>with field errors]
    ZodValid -->|Yes| Sanitize[Sanitize HTML<br/>DOMPurify]

    Sanitize --> GenerateSlug{Need<br/>slug?}
    GenerateSlug -->|Yes| Slug[generateSlug]
    GenerateSlug -->|No| CalcRead{Calculate<br/>readTime?}

    Slug --> CalcRead
    CalcRead -->|Yes| ReadTime[calculateReadTime]
    CalcRead -->|No| Return[Return validated<br/>& sanitized data]

    ReadTime --> Return

    style Input fill:#e3f2fd
    style Return fill:#c8e6c9
    style ThrowError fill:#ffcdd2
```

---

## 💉 Dependency Injection

### DI Container Architecture

```mermaid
graph TB
    subgraph Container["DI Container (tsyringe)"]
        Registry[Service Registry<br/>Singleton Pattern]
    end

    subgraph ServiceDefinitions["Service Definitions"]
        LoggerDef["@injectable()<br/>class LoggerService"]
        ValidationDef["@injectable()<br/>class ValidationService"]
        ErrorDef["@injectable()<br/>class ErrorService"]
        ArticleDef["@injectable()<br/>class ArticleService"]
    end

    subgraph ServiceLocator["ServiceLocator Facade"]
        GetLogger[getLogger]
        GetValidation[getValidation]
        GetError[getError]
        GetArticle[getArticle]
    end

    subgraph Consumers["Consumers"]
        APIRoutes[API Routes]
        Components[Components]
        Tests[Unit Tests]
    end

    LoggerDef -.register.-> Registry
    ValidationDef -.register.-> Registry
    ErrorDef -.register.-> Registry
    ArticleDef -.register.-> Registry

    GetLogger --> Registry
    GetValidation --> Registry
    GetError --> Registry
    GetArticle --> Registry

    APIRoutes --> ServiceLocator
    Components --> ServiceLocator
    Tests --> ServiceLocator

    Registry -.inject dependencies.-> ArticleDef

    style Container fill:#e3f2fd
    style ServiceDefinitions fill:#fff3e0
    style ServiceLocator fill:#f3e5f5
    style Consumers fill:#c8e6c9
```

### Exemplo de Uso

```typescript
// ❌ NÃO FAZER - Instanciar diretamente
const service = new ArticleService(prisma, logger, validation)

// ✅ FAZER - Usar DI Container
import { ServiceLocator } from '@/lib/di/container'

const articleService = ServiceLocator.getArticle()
const logger = ServiceLocator.getLogger()
const validation = ServiceLocator.getValidation()
```

### Benefícios

- **Singleton Garantido:** Cada service tem uma única instância
- **Testabilidade:** Fácil mock de dependências
- **Type Safety:** Autocomplete e validação TypeScript
- **Desacoplamento:** Serviços não conhecem implementação dos outros
- **Manutenibilidade:** Mudanças em dependências não quebram código

---

## 🔧 Services Core

### Hierarquia de Services

```mermaid
graph TB
    ArticleService[ArticleService<br/>CRUD + Bulk Operations]

    ArticleService --> LoggerService[LoggerService<br/>Structured Logging]
    ArticleService --> ValidationService[ValidationService<br/>Zod + Sanitization]
    ArticleService --> ErrorService[ErrorService<br/>Error Handling]

    ValidationService --> LoggerService
    ErrorService --> LoggerService
    ErrorService --> Sentry[Sentry SDK]

    ArticleService --> PrismaClient[Prisma Client<br/>Database]

    style ArticleService fill:#4fc3f7
    style LoggerService fill:#fff176
    style ValidationService fill:#81c784
    style ErrorService fill:#e57373
```

### LoggerService

**Responsabilidade:** Logging estruturado em JSON com contexto rico

```typescript
// Configuração de contexto
logger.setContext({ userId: 'user-123', endpoint: '/api/articles' })

// Logging em diferentes níveis
logger.debug('Processing request', { filters })
logger.info('Article created', { articleId: 'art-456' })
logger.warn('Slow query detected', { duration: 1500 })
logger.error('Validation failed', error, { field: 'title' })

// Limpeza de contexto
logger.clearContext()

// Medição de performance
const result = await measureTime(
  () => articleService.create(data, userId),
  'article.create',
  { userId }
)
```

**Output Example:**
```json
{
  "timestamp": "2025-11-19T10:30:00.123Z",
  "level": "info",
  "message": "Article created",
  "context": {
    "userId": "user-123",
    "endpoint": "/api/articles"
  },
  "metadata": {
    "articleId": "art-456"
  }
}
```

### ValidationService

**Responsabilidade:** Validação server-side e sanitização

```typescript
// Validação com Zod (throws ValidationError se inválido)
const validated = validation.validate(articleCreateSchema, data)

// Validação segura (retorna result object)
const result = validation.validateSafe(articleCreateSchema, data)
if (!result.success) {
  console.log(result.errors.fieldErrors)
}

// Utilitários
const slug = validation.generateSlug('Bitcoin Atinge US$ 100 mil!')
const readTime = validation.calculateReadTime(content) // minutos
const safeHtml = validation.sanitizeHtml(content) // XSS prevention
```

### ErrorService

**Responsabilidade:** Hierarquia de erros type-safe

```mermaid
classDiagram
    class AppError {
        +string code
        +string message
        +number statusCode
        +boolean isOperational
        +object metadata
    }

    class ValidationError {
        statusCode = 400
    }

    class NotFoundError {
        statusCode = 404
    }

    class UnauthorizedError {
        statusCode = 401
    }

    class ForbiddenError {
        statusCode = 403
    }

    class ConflictError {
        statusCode = 409
    }

    class ExternalAPIError {
        statusCode = 502
    }

    AppError <|-- ValidationError
    AppError <|-- NotFoundError
    AppError <|-- UnauthorizedError
    AppError <|-- ForbiddenError
    AppError <|-- ConflictError
    AppError <|-- ExternalAPIError
```

```typescript
// Lançar erros específicos
throw new ValidationError('Email inválido', { field: 'email' })
throw new NotFoundError('Artigo não encontrado', { articleId: '123' })
throw new UnauthorizedError('Token expirado')

// Uso em API routes
export async function POST(request: Request) {
  try {
    const article = await articleService.create(data, userId)
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    return errorHandler(error) // Auto-logs + Sentry + proper response
  }
}
```

### ArticleService

**Responsabilidade:** CRUD completo + operações em lote

**Métodos Principais:**

```typescript
// Create
create(data: ArticleCreateInput, userId: string): Promise<Article>

// Read
getById(id: string): Promise<Article | null>
getBySlug(slug: string): Promise<Article | null>
list(filters: ArticleFilters): Promise<PaginatedResult<Article>>

// Update
update(id: string, data: ArticleUpdateInput, userId: string): Promise<Article>

// Delete (soft delete)
delete(id: string, userId: string): Promise<void>
restore(id: string, userId: string): Promise<Article>

// Bulk operations
bulkOperation(params: BulkOperationParams, userId: string): Promise<number>

// Stats
getStats(): Promise<ArticleStats>
```

---

## 📐 Padrões de Código

### Adapter Pattern (External APIs)

Todas as APIs externas são encapsuladas em adapters:

```mermaid
graph TB
    Service[ArticleService] --> Adapter[BinanceAdapter]
    Adapter --> ExternalAPI[Binance API]

    Adapter --> ErrorHandling[Error Handling<br/>Retry Logic]
    Adapter --> Logging[Structured Logging]
    Adapter --> TypeSafety[Type-safe Responses]

    style Service fill:#e3f2fd
    style Adapter fill:#fff3e0
    style ExternalAPI fill:#c8e6c9
```

**Adapters Implementados:**
- `lib/adapters/binance-adapter.ts` - Binance market data
- `lib/adapters/perplexity-adapter.ts` - Perplexity AI
- `lib/adapters/solana-adapter.ts` - Solana blockchain

### Repository Pattern (Prisma)

```typescript
// Services interagem com Prisma Client via abstração
class ArticleService {
  constructor(
    private prisma: PrismaClient,
    private logger: LoggerService,
    private validation: ValidationService
  ) {}

  async create(data: ArticleCreateInput, userId: string): Promise<Article> {
    // Business logic
    const validated = this.validation.validate(articleCreateSchema, data)

    // Repository pattern - Prisma
    const article = await this.prisma.article.create({
      data: validated,
      include: { tags: true, category: true }
    })

    return article
  }
}
```

### Response Helpers Pattern

```typescript
// Padronização de respostas
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  notFoundResponse
} from '@/lib/helpers/response-helpers'

// Success
return successResponse(article, 201)
// => { success: true, data: article, timestamp: '...' }

// Error
return errorResponse('Validation failed', 400)
// => { success: false, error: { message: '...', code: 'VALIDATION_ERROR' }, timestamp: '...' }

// Paginated
return paginatedResponse(articles, total, page, limit)
// => { success: true, data: articles, pagination: {...}, timestamp: '...' }
```

---

## 🔒 Segurança

### Camadas de Segurança

```mermaid
graph TB
    Input[User Input] --> Auth[Authentication<br/>NextAuth]
    Auth --> RBAC[Authorization<br/>Role-Based Access Control]
    RBAC --> Validation[Validation<br/>Zod Schemas]
    Validation --> Sanitization[Sanitization<br/>DOMPurify]
    Sanitization --> RateLimit[Rate Limiting<br/>Per IP/User]
    RateLimit --> CSRF[CSRF Protection<br/>Tokens]
    CSRF --> SQLInjection[SQL Injection<br/>Prisma prevents]
    SQLInjection --> XSS[XSS Protection<br/>Content Security Policy]
    XSS --> Process[Process Request]

    style Input fill:#ffcdd2
    style Process fill:#c8e6c9
```

### Práticas de Segurança

1. **Input Validation (Zod):** Validação server-side obrigatória
2. **Sanitization (DOMPurify):** Remoção de scripts maliciosos
3. **Authentication (NextAuth):** Sessões seguras
4. **Authorization (RBAC):** Controle de acesso por role
5. **Rate Limiting:** Proteção contra DoS
6. **CSRF Tokens:** Proteção contra Cross-Site Request Forgery
7. **SQL Injection:** Prisma ORM com prepared statements
8. **XSS Protection:** Content Security Policy headers

---

## ⚡ Performance e Cache

### Estratégia de Cache

```mermaid
graph TB
    Request[Request] --> Cache{Cache<br/>Hit?}

    Cache -->|Yes| Return[Return Cached<br/>Data]
    Cache -->|No| Service[ArticleService]

    Service --> DB[(Database)]
    DB --> StoreCache[Store in Cache<br/>React Query]
    StoreCache --> Return

    Mutation[Mutation<br/>Create/Update/Delete] --> Invalidate[Invalidate<br/>Cache Keys]
    Invalidate --> Service

    style Request fill:#e3f2fd
    style Return fill:#c8e6c9
    style Mutation fill:#fff3e0
```

**Configuração React Query:**

```typescript
const cacheConfig = {
  articles: {
    staleTime: 5 * 60 * 1000,  // 5 min
    cacheTime: 30 * 60 * 1000, // 30 min
  },
  article: {
    staleTime: 10 * 60 * 1000, // 10 min
    cacheTime: 60 * 60 * 1000, // 1 hour
  }
}
```

---

## 📊 Monitoramento

### Observabilidade

```mermaid
graph TB
    App[Application] --> Logger[LoggerService<br/>Structured Logs]
    App --> Sentry[Sentry<br/>Error Tracking]
    App --> Metrics[Performance Metrics]

    Logger --> Logs[(Log Storage)]
    Sentry --> Dashboard[Sentry Dashboard]
    Metrics --> Analytics[Analytics Dashboard]

    style App fill:#e3f2fd
    style Logs fill:#fff3e0
    style Dashboard fill:#ffcdd2
    style Analytics fill:#c8e6c9
```

**Métricas Monitoradas:**
- Request latency (p50, p95, p99)
- Error rate por endpoint
- Cache hit rate
- Database query performance
- External API response times

---

## 📚 Referências

- **Clean Architecture:** [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)
- **API Specification:** [API_V2_SPECIFICATION.md](API_V2_SPECIFICATION.md)
- **Testing Guide:** [TEST_PLAN.md](TEST_PLAN.md)
- **Logging & Monitoring:** [LOGGING_MONITORING.md](LOGGING_MONITORING.md)
- **DI Examples:** [../lib/di/examples.md](../lib/di/examples.md)

---

**Última Atualização:** 2025-11-19
**Mantenedor:** Time de Desenvolvimento Token Milagre
