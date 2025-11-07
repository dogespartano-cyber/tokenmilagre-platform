# Guia de Otimização Prisma

## Evitando N+1 Queries

O problema N+1 ocorre quando você faz uma query principal e depois N queries adicionais para cada resultado.

### ❌ Antipadrão (N+1 Query)

```typescript
// Query 1: Buscar artigos
const articles = await prisma.article.findMany();

// N queries: Buscar autor de cada artigo
for (const article of articles) {
  const author = await prisma.user.findUnique({
    where: { id: article.authorId }
  });
  console.log(author.name);
}
```

**Problema:** Se houver 100 artigos, serão feitas **101 queries** (1 + 100).

### ✅ Solução: Eager Loading com `include`

```typescript
// 1 query apenas com JOIN
const articles = await prisma.article.findMany({
  include: {
    author: {
      select: {
        name: true,
        email: true,
      },
    },
  },
});

// Acesso direto sem queries adicionais
articles.forEach(article => {
  console.log(article.author.name);
});
```

**Benefício:** Apenas **1 query** com JOIN.

## Estratégias de Otimização

### 1. Use `include` para Relações

```typescript
// Buscar artigos com autor e progresso do usuário
const articles = await prisma.article.findMany({
  include: {
    author: true,
    userProgress: {
      where: { userId: currentUserId },
    },
  },
});
```

### 2. Use `select` para Limitar Campos

```typescript
// Apenas campos necessários
const articles = await prisma.article.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    author: {
      select: {
        name: true,
        email: true,
      },
    },
  },
});
```

**Benefício:** Menos dados transferidos, query mais rápida.

### 3. Paginação Eficiente

```typescript
// Pagination com cursor (recomendado para grandes datasets)
const articles = await prisma.article.findMany({
  take: 20,
  skip: page > 1 ? 1 : undefined,
  cursor: page > 1 ? { id: lastCursor } : undefined,
  orderBy: { createdAt: 'desc' },
});

// Pagination com offset (simples, mas menos eficiente)
const articles = await prisma.article.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

### 4. Agregações Eficientes

```typescript
// Contar sem carregar todos os registros
const count = await prisma.article.count({
  where: { published: true },
});

// Agregações múltiplas em uma query
const stats = await prisma.article.aggregate({
  _count: true,
  _avg: { factCheckScore: true },
  where: { type: 'news' },
});
```

### 5. Batch Queries com `findMany` + `where IN`

```typescript
// Em vez de múltiplas queries
const userIds = articles.map(a => a.authorId);
const authors = await prisma.user.findMany({
  where: {
    id: { in: userIds },
  },
});

// Criar mapa para lookup rápido
const authorMap = new Map(authors.map(a => [a.id, a]));
articles.forEach(article => {
  article.author = authorMap.get(article.authorId);
});
```

### 6. Transactions para Operações Atômicas

```typescript
// Garantir consistência em múltiplas operações
const result = await prisma.$transaction(async (tx) => {
  const article = await tx.article.create({ data: articleData });

  await tx.copilotActivity.create({
    data: {
      userId,
      action: 'create_article',
      parameters: JSON.stringify({ articleId: article.id }),
    },
  });

  return article;
});
```

## Índices Importantes

O schema já possui índices estratégicos:

```prisma
model Article {
  // Índices para queries frequentes
  @@index([authorId])
  @@index([published])
  @@index([slug])
  @@index([category])
  @@index([type])
  @@index([projectHighlight])
}
```

## Monitoramento de Performance

### Development

```typescript
// Habilitar query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Production

Use o helper de timing:

```typescript
import { withTiming } from '@/lib/logger';

const articles = await withTiming(
  'Fetch articles',
  () => prisma.article.findMany({ include: { author: true } }),
  { limit: 20 }
);
```

## Checklist de Otimização

- [ ] Todas as relações usam `include` ou `select` (não queries separadas)
- [ ] Campos desnecessários são excluídos com `select`
- [ ] Paginação implementada com `take` e `skip`/`cursor`
- [ ] Índices criados para campos filtrados (`where`) e ordenados (`orderBy`)
- [ ] Queries complexas medidas com `withTiming`
- [ ] Contagens feitas com `count()` não `findMany().length`
- [ ] Agregações usam `aggregate()` não `reduce()` em memória

## Exemplos no Projeto

### ✅ Otimizado

```typescript
// /app/api/admin/articles/route.ts:48
const articles = await prisma.article.findMany({
  where,
  include: {
    author: {
      select: { name: true, email: true }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: limit
});
```

### Próximos Passos

Verificar e otimizar:

1. `/app/educacao/page.tsx` - Queries de artigos educacionais
2. `/app/dashboard/noticias/page.tsx` - Queries de notícias
3. `/app/api/copilot/*` - Queries do copiloto
4. Qualquer endpoint com `findMany()` seguido de loops

## Recursos

- [Prisma Performance Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Solving N+1 Queries](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance)
