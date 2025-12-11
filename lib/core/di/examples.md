# Dependency Injection - Exemplos de Uso

Este guia mostra como usar o container de Dependency Injection (DI) com tsyringe no projeto.

## 📋 Índice

- [Por que usar DI?](#por-que-usar-di)
- [Uso Básico](#uso-básico)
- [Em API Routes](#em-api-routes)
- [Em Server Components](#em-server-components)
- [Em Testes](#em-testes)
- [Boas Práticas](#boas-práticas)

---

## Por que usar DI?

### Benefícios

✅ **Testabilidade:** Mock fácil de dependências nos testes
✅ **Desacoplamento:** Services não dependem de implementações concretas
✅ **Singleton Garantido:** Uma única instância por service (consistência de estado)
✅ **Type Safety:** Autocompletar e validação em tempo de desenvolvimento
✅ **Manutenibilidade:** Mudanças centralizadas, fácil de refatorar

### Quando usar?

- ✅ Em **API routes** (Next.js Route Handlers)
- ✅ Em **Server Actions**
- ✅ Em **Server Components**
- ✅ Em **testes unitários/integração**
- ❌ Não usar em Client Components (use hooks/context)

---

## Uso Básico

### Opção 1: ServiceLocator (Recomendado)

```typescript
import { ServiceLocator } from '@/lib/di/container'

// Obter services
const logger = ServiceLocator.getLogger()
const validation = ServiceLocator.getValidation()
const articleService = ServiceLocator.getArticle()

// Usar
logger.info('Application started')
const articles = await articleService.list({ page: 1, limit: 10 })
```

### Opção 2: Container direto

```typescript
import { container, TOKENS } from '@/lib/di/container'
import { LoggerService } from '@/lib/services/logger-service'

// Resolver por token
const logger = container.resolve<LoggerService>(TOKENS.LoggerService)

// Ou resolver por classe
const logger = container.resolve(LoggerService)
```

---

## Em API Routes

### Next.js App Router (Route Handlers)

```typescript
// app/api/articles/route.ts
import { NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'

export async function GET(request: Request) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: '/api/articles', method: 'GET' })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await articleService.list({ page, limit })

    logger.info('Articles fetched successfully', {
      count: result.articles.length,
      total: result.total,
    })

    return NextResponse.json(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export async function POST(request: Request) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: '/api/articles', method: 'POST' })

    const body = await request.json()
    const userId = 'user-123' // TODO: Get from session

    const article = await articleService.create(body, userId)

    logger.info('Article created', { articleId: article.id })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
```

### Endpoint Específico (GET by slug)

```typescript
// app/api/articles/[slug]/route.ts
import { NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const articleService = ServiceLocator.getArticle()
    const article = await articleService.getBySlug(params.slug)

    return NextResponse.json(article)
  } catch (error) {
    return errorHandler(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    const body = await request.json()
    const userId = 'user-123' // TODO: Get from session

    // Get article ID from slug
    const existing = await articleService.getBySlug(params.slug)

    // Update article
    const article = await articleService.update(existing.id, body, userId)

    logger.info('Article updated', { articleId: article.id, slug: params.slug })

    return NextResponse.json(article)
  } catch (error) {
    return errorHandler(error)
  }
}
```

---

## Em Server Components

```typescript
// app/dashboard/artigos/page.tsx
import { ServiceLocator } from '@/lib/di/container'

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const articleService = ServiceLocator.getArticle()

  const articles = await articleService.list({
    page: parseInt(searchParams.page || '1'),
    limit: 10,
    search: searchParams.search,
    status: 'PUBLISHED',
  })

  return (
    <div>
      <h1>Artigos ({articles.total})</h1>
      {articles.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

---

## Em Testes

### Teste Unitário (com mock)

```typescript
// __tests__/api/articles.test.ts
import { ServiceLocator } from '@/lib/di/container'
import { ArticleService } from '@/lib/services/article-service'

// Mock do service
jest.mock('@/lib/services/article-service')

describe('Articles API', () => {
  beforeEach(() => {
    // Reset container antes de cada teste
    ServiceLocator.reset()
  })

  it('should list articles', async () => {
    const mockArticles = [
      { id: '1', title: 'Test Article', slug: 'test-article' },
    ]

    // Mock do método list
    const mockList = jest.fn().mockResolvedValue({
      articles: mockArticles,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    })

    // Substituir implementação
    ArticleService.prototype.list = mockList

    // Usar service
    const articleService = ServiceLocator.getArticle()
    const result = await articleService.list({ page: 1, limit: 10 })

    expect(result.articles).toHaveLength(1)
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 10 })
  })
})
```

### Teste de Integração (sem mock)

```typescript
// __tests__/integration/article-service.test.ts
import { ServiceLocator } from '@/lib/di/container'
import { prismaMock } from '@/lib/__mocks__/prisma'

describe('ArticleService Integration', () => {
  beforeEach(() => {
    ServiceLocator.reset()
  })

  it('should create and retrieve article', async () => {
    const articleService = ServiceLocator.getArticle()

    // Mock Prisma responses
    prismaMock.article.findUnique.mockResolvedValue(null)
    prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-1' } as any)
    prismaMock.tag.findMany.mockResolvedValue([{ id: 'tag-1' }] as any)
    prismaMock.article.create.mockResolvedValue({
      id: 'art-1',
      title: 'Test',
      slug: 'test',
    } as any)

    const article = await articleService.create(
      {
        title: 'Test Article',
        slug: 'test-article',
        content: 'Content here...',
        type: 'NEWS',
        categoryId: 'cat-1',
        authorId: 'user-1',
        tagIds: ['tag-1'],
        status: 'DRAFT',
      },
      'user-1'
    )

    expect(article).toBeDefined()
    expect(article.slug).toBe('test')
  })
})
```

---

## Boas Práticas

### ✅ DO (Faça)

```typescript
// ✅ Use ServiceLocator para type safety
const articleService = ServiceLocator.getArticle()

// ✅ Resete o container em testes
beforeEach(() => {
  ServiceLocator.reset()
})

// ✅ Configure context do logger
const logger = ServiceLocator.getLogger()
logger.setContext({ userId: 'user-123', endpoint: '/api/articles' })

// ✅ Use errorHandler para tratamento de erros
try {
  const result = await articleService.create(data, userId)
  return NextResponse.json(result)
} catch (error) {
  return errorHandler(error)
}

// ✅ Limpe context após operação
try {
  // ... operação
} finally {
  logger.clearContext()
}
```

### ❌ DON'T (Não faça)

```typescript
// ❌ Não use em Client Components
'use client'
import { ServiceLocator } from '@/lib/di/container' // ERRO!

// ❌ Não instancie services diretamente
const service = new ArticleService() // Use ServiceLocator

// ❌ Não compartilhe estado entre requisições
let cachedData = null // NUNCA faça isso em services

// ❌ Não esqueça de tratar erros
const article = await articleService.create(data, userId) // Faltou try/catch
```

---

## Migração de Código Existente

### Antes (sem DI)

```typescript
import { articleService } from '@/lib/services/article-service'

export async function GET() {
  const articles = await articleService.list({ page: 1, limit: 10 })
  return NextResponse.json(articles)
}
```

### Depois (com DI)

```typescript
import { ServiceLocator } from '@/lib/di/container'

export async function GET() {
  const articleService = ServiceLocator.getArticle()
  const articles = await articleService.list({ page: 1, limit: 10 })
  return NextResponse.json(articles)
}
```

**Nota:** O código antigo ainda funciona (backward compatible), mas o novo código deve usar DI.

---

## Troubleshooting

### Erro: "Cannot find module 'reflect-metadata'"

**Solução:** Adicione `import 'reflect-metadata'` no topo do arquivo de entrada:

```typescript
// app/layout.tsx (ou global setup)
import 'reflect-metadata'
```

### Erro: "Singleton not registered"

**Solução:** Certifique-se de que o container foi inicializado:

```typescript
import { initializeContainer } from '@/lib/di/container'
initializeContainer()
```

### Erro em Testes: "Service returns undefined"

**Solução:** Reset o container antes de cada teste:

```typescript
beforeEach(() => {
  ServiceLocator.reset()
})
```

---

## Referências

- [tsyringe Documentation](https://github.com/microsoft/tsyringe)
- [Dependency Injection Patterns](https://martinfowler.com/articles/injection.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
