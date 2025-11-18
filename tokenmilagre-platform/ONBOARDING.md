# Guia de Onboarding - Novo Sistema de Artigos

Bem-vindo ao projeto **TokenMilagre Platform**! Este guia vai te ajudar a entender rapidamente a arquitetura do novo sistema de artigos e como começar a contribuir.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Setup do Ambiente](#setup-do-ambiente)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Services Core](#services-core)
6. [Dependency Injection](#dependency-injection)
7. [Como Criar um Artigo](#como-criar-um-artigo)
8. [Rodando Testes](#rodando-testes)
9. [Boas Práticas](#boas-práticas)
10. [FAQ](#faq)

---

## Visão Geral

### O que foi construído?

Um **novo sistema de gerenciamento de artigos** com foco em:
- 📦 **Modularidade:** Services desacoplados e testáveis
- 🔒 **Type Safety:** 100% TypeScript com Zod validation
- 🧪 **Testabilidade:** 98%+ de cobertura de testes
- 📊 **Observabilidade:** Logging estruturado + Sentry
- 🚀 **Performance:** Operações em lote, cache, índices otimizados

### Sistema Antigo vs Novo

| Aspecto | Sistema Antigo | Novo Sistema |
|---------|----------------|--------------|
| **Validação** | 4 camadas (client+server) | Server-side único (Zod) |
| **Erros** | `console.log` em produção | ErrorService + Sentry |
| **Logging** | `console.log` sem estrutura | LoggerService (Pino) estruturado |
| **Duplicação** | ~40% código duplicado | <10% (services compartilhados) |
| **Testes** | 0% coverage | 98%+ coverage |
| **DI** | Nenhum | tsyringe container |
| **Schema** | JSON como strings | Relações type-safe (Prisma) |

### Status Atual

✅ **Semana 1:** Infraestrutura base (Logger, Schema v2, Seed)
✅ **Semana 2:** Services Core (Error, Validation, Article) + DI
⏳ **Semana 3:** APIs v2 + React Query hooks
⏳ **Semana 4:** E2E tests + Load tests
⏳ **Semana 5-6:** Migração gradual + Monitoramento

**⚠️ Importante:** O sistema antigo (3 páginas) **NÃO foi modificado**. O novo sistema roda em **paralelo** e será migrado gradualmente após validação de 30 dias.

---

## Arquitetura

### Clean Architecture (4 camadas)

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (Next.js App Router)            │
│  - API Routes (/api/v2/articles)                    │
│  - Server Components                                 │
│  - Client Components (via React Query)              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Application Layer (Use Cases)                       │
│  - ArticleService (CRUD, bulk ops)                  │
│  - ValidationService (Zod schemas)                  │
│  - ErrorService (error handling)                    │
│  - LoggerService (structured logging)               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Domain Layer (Business Logic)                       │
│  - Zod Schemas (article-schemas.ts)                 │
│  - Type Definitions                                  │
│  - Business Rules                                    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Infrastructure Layer                                │
│  - Prisma ORM (schema-v2.prisma)                    │
│  - Database (PostgreSQL)                             │
│  - External APIs (Perplexity, OpenAI)               │
│  - Sentry (monitoring)                               │
└─────────────────────────────────────────────────────┘
```

### Dependency Injection

```typescript
// Services são injetados via DI Container (tsyringe)
import { ServiceLocator } from '@/lib/di/container'

const logger = ServiceLocator.getLogger()
const validation = ServiceLocator.getValidation()
const articleService = ServiceLocator.getArticle()
```

**Benefícios:**
- ✅ Singleton garantido (estado consistente)
- ✅ Fácil de mockar em testes
- ✅ Desacoplamento de dependências
- ✅ Type-safe (autocomplete + validação)

---

## Setup do Ambiente

### 1. Pré-requisitos

```bash
# Versões requeridas
Node.js >= 18.x
npm >= 9.x
PostgreSQL >= 14.x
```

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/dogespartano-cyber/tokenmilagre-platform
cd tokenmilagre-platform

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Edite .env.local com suas credenciais:
# DATABASE_URL="postgresql://user:password@localhost:5432/tokenmilagre"
# NEXT_PUBLIC_SENTRY_DSN="..."
```

### 3. Database Setup

```bash
# Gere o Prisma Client (schema atual)
npx prisma generate

# Rode as migrations
npx prisma migrate dev

# (Opcional) Seed com dados de teste usando schema-v2
npx tsx prisma/seed-v2.ts
```

### 4. Rode o servidor

```bash
# Desenvolvimento
npm run dev

# Testes
npm test

# Testes com coverage
npm test -- --coverage

# Testes de um arquivo específico
npm test -- lib/services/__tests__/article-service.test.ts
```

---

## Estrutura de Pastas

```
tokenmilagre-platform/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Páginas antigas (NÃO modificar)
│   │   ├── gerar-em-massa/     # Bulk generation (LEGADO)
│   │   ├── criar-artigo/       # Article creation (LEGADO)
│   │   └── artigos/            # Article management (LEGADO)
│   └── api/
│       └── v2/                  # Nova API (futuro)
│           └── articles/        # Article endpoints
├── lib/
│   ├── di/                      # Dependency Injection
│   │   ├── container.ts        # DI Container (tsyringe)
│   │   ├── examples.md         # Guia de uso DI
│   │   └── __tests__/
│   ├── services/               # Services Core
│   │   ├── logger-service.ts   # LoggerService (Pino)
│   │   ├── error-service.ts    # ErrorService (hierarquia)
│   │   ├── validation-service.ts # ValidationService (Zod)
│   │   ├── article-service.ts  # ArticleService (CRUD)
│   │   └── __tests__/          # Testes (98%+ coverage)
│   ├── schemas/                # Zod Schemas
│   │   ├── article-schemas.ts  # Article validation
│   │   └── category-schemas.ts # Category/Tag validation
│   ├── __mocks__/              # Mocks para testes
│   │   └── prisma.ts           # Prisma mock
│   └── prisma.ts               # Prisma Client
├── prisma/
│   ├── schema.prisma           # Schema atual (LEGADO)
│   ├── schema-v2.prisma        # Novo schema otimizado
│   └── seed-v2.ts              # Seed data
├── docs/                        # Documentação
│   ├── NEW_SYSTEM_ARCHITECTURE.md
│   ├── NEW_PRISMA_SCHEMA.md
│   ├── API_V2_SPECIFICATION.md
│   ├── LOGGING_MONITORING.md
│   ├── TEST_PLAN.md
│   └── IMPLEMENTATION_ROADMAP.md
└── ONBOARDING.md               # Este arquivo
```

---

## Services Core

### 1. LoggerService

**Propósito:** Logging estruturado em JSON com integração Sentry.

```typescript
import { ServiceLocator } from '@/lib/di/container'

const logger = ServiceLocator.getLogger()

// Set context
logger.setContext({ userId: 'user-123', endpoint: '/api/articles' })

// Log messages
logger.info('Article created', { articleId: 'art-456' })
logger.error('Validation failed', error, { field: 'title' })

// Clean context
logger.clearContext()

// Measure performance
import { measureTime } from '@/lib/services/logger-service'

const result = await measureTime(
  async () => articleService.create(data, userId),
  'article.create',
  { userId }
)
```

### 2. ErrorService

**Propósito:** Hierarquia de erros type-safe + middleware.

```typescript
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  errorHandler,
  assertExists,
} from '@/lib/services/error-service'

// Throw specific errors
throw new ValidationError('Email inválido', { field: 'email' })
throw new NotFoundError('Artigo não encontrado', { articleId: '123' })

// Use in API routes
export async function POST(request: Request) {
  try {
    const article = await articleService.create(data, userId)
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    return errorHandler(error) // Auto-handles errors + Sentry
  }
}

// Type assertion
const article = await prisma.article.findUnique({ where: { id } })
assertExists(article, 'Artigo não encontrado', { articleId: id })
// TypeScript agora sabe que article não é null
```

### 3. ValidationService

**Propósito:** Validação server-side com Zod + sanitização HTML.

```typescript
import { ServiceLocator } from '@/lib/di/container'
import { articleCreateSchema } from '@/lib/schemas/article-schemas'

const validation = ServiceLocator.getValidation()

// Validate (throws ValidationError se inválido)
const validated = validation.validate(articleCreateSchema, data)

// Validate safe (retorna { success, data } ou { success, errors })
const result = validation.validateSafe(articleCreateSchema, data)
if (!result.success) {
  console.log(result.errors.fieldErrors)
}

// Generate slug
const slug = validation.generateSlug('Bitcoin Atinge US$ 100 mil!')
// => 'bitcoin-atinge-us-100-mil'

// Calculate read time
const readTime = validation.calculateReadTime(content)
// => 5 (minutos)

// Sanitize HTML (XSS prevention)
const safe = validation.sanitizeHtml('<script>alert("xss")</script><p>Safe</p>')
// => '<p>Safe</p>'
```

### 4. ArticleService

**Propósito:** CRUD completo de artigos + bulk operations.

```typescript
import { ServiceLocator } from '@/lib/di/container'

const articleService = ServiceLocator.getArticle()

// Create
const article = await articleService.create({
  title: 'Bitcoin Atinge US$ 100 mil',
  slug: 'bitcoin-atinge-us-100-mil',
  content: 'Conteúdo do artigo...',
  type: 'NEWS',
  categoryId: 'cat-123',
  authorId: 'user-123',
  tagIds: ['tag-1', 'tag-2'],
  status: 'DRAFT',
}, 'user-123')

// Read
const article = await articleService.getById('art-123')
const article = await articleService.getBySlug('bitcoin-news')

// List with filters
const result = await articleService.list({
  page: 1,
  limit: 10,
  type: 'NEWS',
  status: 'PUBLISHED',
  search: 'Bitcoin',
  sortBy: 'publishedAt',
  sortOrder: 'desc',
})

// Update
await articleService.update('art-123', {
  title: 'Novo Título',
  status: 'PUBLISHED',
}, 'user-123')

// Soft delete
await articleService.delete('art-123', 'user-123')

// Restore
await articleService.restore('art-123', 'user-123')

// Bulk operations
const count = await articleService.bulkOperation({
  articleIds: ['art-1', 'art-2', 'art-3'],
  operation: 'publish', // 'publish' | 'archive' | 'delete' | 'restore'
}, 'user-123')

// Stats
const stats = await articleService.getStats()
// { total: 100, published: 50, draft: 30, byType: {...}, byCategory: {...} }
```

---

## Dependency Injection

### Por que usar?

- ✅ **Testabilidade:** Mock fácil de dependências
- ✅ **Singleton:** Uma única instância por service
- ✅ **Type Safety:** Autocomplete + validação
- ✅ **Desacoplamento:** Fácil de refatorar

### Como usar?

```typescript
// Opção 1: ServiceLocator (recomendado)
import { ServiceLocator } from '@/lib/di/container'

const logger = ServiceLocator.getLogger()
const validation = ServiceLocator.getValidation()
const articleService = ServiceLocator.getArticle()

// Opção 2: Container direto
import { container, TOKENS } from '@/lib/di/container'

const logger = container.resolve(TOKENS.LoggerService)
```

### Em Testes

```typescript
import { ServiceLocator } from '@/lib/di/container'

beforeEach(() => {
  // Reset container antes de cada teste
  ServiceLocator.reset()
})

it('should work', async () => {
  const articleService = ServiceLocator.getArticle()
  // ... teste
})
```

**📖 Guia completo:** Veja `lib/di/examples.md` para mais exemplos.

---

## Como Criar um Artigo

### Via Service (recomendado)

```typescript
import { ServiceLocator } from '@/lib/di/container'

const articleService = ServiceLocator.getArticle()

const article = await articleService.create({
  title: 'Bitcoin Atinge US$ 100 mil em Marco Histórico',
  slug: 'bitcoin-atinge-us-100-mil',
  content: `
    <h2>Mercado Celebra</h2>
    <p>Bitcoin atingiu a marca histórica de US$ 100 mil...</p>
  `,
  excerpt: 'Bitcoin atingiu US$ 100 mil pela primeira vez na história.',
  type: 'NEWS',
  status: 'DRAFT',
  categoryId: 'cat-bitcoin',
  authorId: 'user-123',
  tagIds: ['tag-bitcoin', 'tag-crypto'],
  citations: [
    {
      url: 'https://www.coindesk.com/bitcoin-100k',
      title: 'Bitcoin Hits $100K',
    },
  ],
  relatedArticleIds: ['art-related-1'],
}, 'user-123')

console.log(`Artigo criado: ${article.id}`)
```

### Via API Route (futuro)

```typescript
// app/api/v2/articles/route.ts
import { NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'

export async function POST(request: Request) {
  try {
    const articleService = ServiceLocator.getArticle()
    const body = await request.json()
    const userId = 'user-123' // TODO: Get from session

    const article = await articleService.create(body, userId)

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
```

---

## Rodando Testes

### Todos os testes

```bash
npm test
```

### Testes de um service específico

```bash
# ArticleService
npm test -- lib/services/__tests__/article-service.test.ts

# ValidationService
npm test -- lib/services/__tests__/validation-service.test.ts

# ErrorService
npm test -- lib/services/__tests__/error-service.test.ts

# LoggerService
npm test -- lib/services/__tests__/logger-service.test.ts

# DI Container
npm test -- lib/di/__tests__/container.test.ts
```

### Coverage completo

```bash
npm test -- --coverage
```

### Watch mode (desenvolvimento)

```bash
npm test -- --watch
```

### Resultado Esperado

```
Test Suites: 5 passed, 5 total
Tests:       167 passed, 167 total
Coverage:    98.87% (statements)
Time:        ~15s
```

---

## Boas Práticas

### ✅ DO (Faça)

```typescript
// ✅ Use ServiceLocator
const articleService = ServiceLocator.getArticle()

// ✅ Sempre use errorHandler em API routes
try {
  const result = await articleService.create(data, userId)
  return NextResponse.json(result)
} catch (error) {
  return errorHandler(error)
}

// ✅ Configure context do logger
logger.setContext({ userId, endpoint: '/api/articles' })
try {
  // ... operação
} finally {
  logger.clearContext()
}

// ✅ Valide no server-side
const validated = validation.validate(articleCreateSchema, data)

// ✅ Use Zod schemas
import { articleCreateSchema } from '@/lib/schemas/article-schemas'

// ✅ Reset DI container em testes
beforeEach(() => {
  ServiceLocator.reset()
})
```

### ❌ DON'T (Não faça)

```typescript
// ❌ Não use console.log em produção
console.log('Article created') // Use logger.info()

// ❌ Não instancie services diretamente
const service = new ArticleService() // Use ServiceLocator

// ❌ Não valide no client-side
if (!title) return // Valide server-side com Zod

// ❌ Não modifique as 3 páginas antigas
// app/dashboard/gerar-em-massa/page.tsx // NÃO TOCAR

// ❌ Não esqueça de tratar erros
const article = await articleService.create(data, userId) // Faltou try/catch

// ❌ Não use JSON como string no schema
citations: string // ❌ Use relation table

// ❌ Não compartilhe estado entre requisições
let cache = {} // NUNCA faça isso
```

---

## FAQ

### 1. Posso modificar as 3 páginas antigas?

**❌ NÃO!** As páginas antigas (`gerar-em-massa`, `criar-artigo`, `artigos`) devem permanecer **intocadas** até a migração final (após 30 dias de validação do novo sistema).

### 2. Como adicionar um novo service?

1. Crie o service em `lib/services/my-service.ts`
2. Adicione testes em `lib/services/__tests__/my-service.test.ts`
3. Registre no DI container (`lib/di/container.ts`)
4. Adicione ao ServiceLocator
5. Documente o uso

### 3. Como testar mudanças sem quebrar o sistema atual?

O novo sistema roda **em paralelo**. Use:
- Rotas diferentes (`/api/v2/...`)
- Feature flags
- Testes A/B

### 4. Onde está a documentação completa?

- **Arquitetura:** `docs/NEW_SYSTEM_ARCHITECTURE.md`
- **API v2:** `docs/API_V2_SPECIFICATION.md`
- **Testes:** `docs/TEST_PLAN.md`
- **Schema:** `docs/NEW_PRISMA_SCHEMA.md`
- **Logging:** `docs/LOGGING_MONITORING.md`
- **Roadmap:** `docs/IMPLEMENTATION_ROADMAP.md`
- **DI Examples:** `lib/di/examples.md`

### 5. Como rodar apenas os novos testes?

```bash
# Todos os testes do novo sistema
npm test -- lib/services lib/di

# Específico
npm test -- lib/services/__tests__/article-service.test.ts
```

### 6. O que fazer se encontrar um bug no sistema antigo?

- **Bug crítico:** Corrija no sistema antigo
- **Bug não-crítico:** Documente e garanta que o novo sistema não tem esse problema

### 7. Como adicionar um novo campo no Article?

1. Atualize `prisma/schema-v2.prisma`
2. Atualize Zod schema (`lib/schemas/article-schemas.ts`)
3. Rode migration (se necessário)
4. Atualize testes

---

## Próximos Passos

Agora que você entende o sistema:

1. 📖 Leia a documentação em `docs/`
2. 🧪 Rode os testes: `npm test`
3. 🏗️ Explore os services em `lib/services/`
4. 📝 Leia exemplos de DI em `lib/di/examples.md`
5. 🎯 Pegue uma tarefa no backlog

**Dúvidas?** Abra uma issue ou pergunte no canal #dev-platform.

---

**Bem-vindo ao time!** 🚀
