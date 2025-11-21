---
name: tokenmilagre-database
description: "Database management with Prisma (schema, migrations, optimization). TRIGGERS: 'Prisma', 'schema', 'migration', 'database', 'query optimization', 'modelo de dados'. Use when modifying database schema, creating migrations, optimizing queries, troubleshooting database issues, data modeling."
license: MIT
---

# Token Milagre - Database Management Guide

Complete guide for managing the PostgreSQL database with Prisma ORM in the Token Milagre Platform.

## Purpose

Provide standardized patterns for database schema design, migrations, query optimization, and data integrity in the Token Milagre Platform.

## When to Use This Skill

Use this skill when:
- Adding new database tables/models
- Modifying existing schema
- Creating Prisma migrations
- Optimizing slow queries
- Troubleshooting database errors
- Planning data relationships
- Setting up indexes

## Database Stack

- **Database:** Supabase PostgreSQL (Free Tier) - Migrated from Neon on 2025-11-12
- **ORM:** Prisma 6.3.0
- **Connection:** Prisma Client with connection pooling
- **Migrations:** Prisma Migrate
- **Location:** `prisma/schema.prisma`
- **Prisma Client Location:** `lib/generated/prisma` (custom path)
- **Total Users:** 2 (Admin + Editor)

---

## ⚠️ Critical Rules - Token Milagre Specific

### 1. ALWAYS Use Prisma Directly in Server Components

```typescript
// ❌ WRONG: HTTP fetch in Server Components
const res = await fetch('http://localhost:3000/api/articles');

// ✅ CORRECT: Direct Prisma access
import { prisma } from '@/lib/prisma';
const articles = await prisma.article.findMany();
```

**Why?** Eliminates HTTP overhead, environment variables dependency, serialization costs.

### 2. Correct Prisma Client Path

```typescript
// ✅ CORRECT - Custom path
import { prisma } from '@/lib/prisma';

// ❌ WRONG - Default path (don't use)
import { PrismaClient } from '@prisma/client';
```

### 3. When to Use API Routes

- ✅ Public endpoints (webhooks, external integrations)
- ✅ Client Components making mutations
- ✅ External scripts (CLI, watchers)
- ❌ Server Components fetching database data

### 4. Build Configuration (Offline Strategy)

**This project uses Prisma stub files** for restricted environments (no internet, firewall blocks).

**Required in `package.json`:**
```json
{
  "scripts": {
    "postinstall-disabled": "prisma generate"  // DISABLED
  }
}
```

**Required in `next.config.ts`:**
```typescript
{
  eslint: { ignoreDuringBuilds: true }
}
```

**Schema Configuration:**
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
  engineType = "library"  // For stub compatibility
}
```

**Vercel Build Checklist:**
- [ ] `postinstall-disabled` (NOT `postinstall`)
- [ ] Stub files committed in `lib/generated/prisma/`
- [ ] `next.config.ts` with `eslint.ignoreDuringBuilds: true`
- [ ] `DATABASE_URL` + `DIRECT_URL` set in Vercel

### 5. Environment Variables

```env
# Production (Vercel) - Supabase
DATABASE_URL=postgresql://... (pooled via Supavisor)
DIRECT_URL=postgresql://... (direct for migrations)
```

### 6. Migration History

**2025-11-12**: Neon → Supabase PostgreSQL (better free tier, docs: `docs/MIGRACAO-SUPABASE.md`)
**2025-10-19**: SQLite → Neon PostgreSQL

**⚠️ NEVER use SQLite in production** - Vercel serverless doesn't persist files.

---

## Current Schema Overview

**Full schema**: `prisma/schema.prisma`

**Main Models**:
- **User** (id, email, name, role) - Authentication + authors
- **Article** (id, slug, title, content, category, published, etc.) - Platform content
- **Resource** (id, slug, title, url, category, type) - External resources
- **CopilotActivity** (id, userId, toolName, action, details) - AI tool logging

**Key Indexes**:
- Article: slug, category, published, authorId, createdAt
- Resource: slug, category, type
- CopilotActivity: userId, timestamp

**JSON Fields** (stored as strings):
- Article: tags, keywords, factCheckSources
- Resource: tags
- CopilotActivity: details

---

## Schema Design Patterns

### Pattern 1: Enum vs String

```prisma
// ✅ PREFERRED: String (flexible, no migration for new values)
model Article {
  type String  // 'news' | 'educational'
}

// ❌ AVOID: Enum (requires migration for new values)
enum ArticleType {
  NEWS
  EDUCATIONAL
}
```

### Pattern 2: JSON Fields

```prisma
// Store as String, parse in application
tags String?  // JSON string: '["bitcoin", "ethereum"]'

// Application layer
const tags = article.tags ? JSON.parse(article.tags) : [];
```

### Pattern 3: Indexes

**Always index**:
- Foreign keys
- WHERE clause fields
- ORDER BY fields
- Unique constraints

```prisma
@@index([category])     // Filter: where: { category: 'bitcoin' }
@@index([published])    // Filter: where: { published: true }
@@index([createdAt])    // Sort: orderBy: { createdAt: 'desc' }
```

### Pattern 4: Text Fields

```prisma
// Short text: String (default)
title String

// Long text: @db.Text
content String @db.Text
```

---

## Migration Workflows

### Creating Migrations

```bash
# 1. Modify prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_article_level

# 3. Migration file created in prisma/migrations/
```

### Applying Migrations (Production)

```bash
# Vercel automatically runs: prisma migrate deploy
# Or manually:
npx prisma migrate deploy
```

### Reset Database (Dev Only)

```bash
npx prisma migrate reset  # DANGER: Deletes all data
```

### Seed Database

```bash
npx prisma db seed
```

**Seed file**: `prisma/seed.ts`

---

## Query Optimization

### Pattern 1: Select Only What You Need

```typescript
// ❌ BAD: Fetch all fields
const article = await prisma.article.findUnique({ where: { slug } });

// ✅ GOOD: Select specific fields
const article = await prisma.article.findUnique({
  where: { slug },
  select: { id: true, title: true, content: true }
});
```

### Pattern 2: Use Indexes

```typescript
// ✅ INDEXED: Fast
where: { category: 'bitcoin' }  // Has @@index([category])

// ❌ NOT INDEXED: Slow
where: { excerpt: { contains: 'crypto' } }  // No index on excerpt
```

### Pattern 3: Pagination

```typescript
// ✅ Cursor-based (fast, consistent)
const articles = await prisma.article.findMany({
  take: 10,
  skip: 1,
  cursor: { id: lastArticleId },
  orderBy: { createdAt: 'desc' }
});

// ⚠️ Offset-based (slower for large offsets)
const articles = await prisma.article.findMany({
  take: 10,
  skip: 50,  // Slow if offset is large
  orderBy: { createdAt: 'desc' }
});
```

### Pattern 4: Aggregate Queries

```typescript
// Count
const count = await prisma.article.count({ where: { published: true } });

// Group by
const stats = await prisma.article.groupBy({
  by: ['category'],
  _count: { category: true },
  orderBy: { _count: { category: 'desc' } }
});
```

### Pattern 5: Transactions

```typescript
// Use $transaction for atomic operations
await prisma.$transaction([
  prisma.article.update({ where: { id }, data: { published: true } }),
  prisma.copilotActivity.create({ data: { userId, action: 'publish' } })
]);
```

---

## Connection Management

**Prisma Client**: Singleton pattern in `lib/prisma.ts`

```typescript
import { PrismaClient } from '@/lib/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Connection Pooling**: Handled by Supabase Supavisor (pooled connection).

---

## Data Integrity

### Validation Rules

**In Prisma Schema**:
- `@unique`: Enforced at database level
- `@default`: Default values
- Required fields: No `?` marker

**In Application**:
- Zod schemas for input validation
- Custom validation logic in API routes

### Foreign Key Constraints

```prisma
model Article {
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

**Cascade**: Not configured (manual cleanup required on User delete).

---

## Common Tasks

### Create Record

```typescript
const article = await prisma.article.create({
  data: {
    title: 'New Article',
    slug: 'new-article',
    content: '...',
    category: 'bitcoin',
    author: { connect: { id: userId } }
  }
});
```

### Update Record

```typescript
const article = await prisma.article.update({
  where: { id },
  data: { published: true, updatedAt: new Date() }
});
```

### Delete Record

```typescript
await prisma.article.delete({ where: { id } });
```

### Upsert (Create or Update)

```typescript
const resource = await prisma.resource.upsert({
  where: { slug: 'binance' },
  update: { title: 'Binance Updated' },
  create: { slug: 'binance', title: 'Binance', url: '...' }
});
```

---

## Troubleshooting

**Common Issues**:

1. **"Unknown field" error**: Schema not synced
   - **Fix**: Run `npx prisma generate`

2. **"Prisma Client not found"**: Path issue
   - **Fix**: Verify `output = "../lib/generated/prisma"` in schema
   - **Fix**: Use `import { prisma } from '@/lib/prisma'`

3. **"Can't reach database"**: Connection string wrong
   - **Fix**: Verify `DATABASE_URL` in `.env`
   - **Fix**: Check Supabase connection pooling enabled

4. **Slow queries**: Missing indexes
   - **Fix**: Add `@@index([field])` to schema
   - **Fix**: Run `EXPLAIN ANALYZE` on slow queries

5. **"Table does not exist" error**: Missing migration
   - **Symptom**: Home page showing "Carregando recursos..." infinitely
   - **Error**: `relation "Resource" does not exist`
   - **Cause**: Schema defines model but table was never created via migration
   - **Fix Option 1**: Run `npx prisma migrate deploy` (recommended)
   - **Fix Option 2**: Run `npx prisma db push` (development)
   - **Fix Option 3**: Execute `prisma/manual-migration-resource-table.sql` manually
   - **Documentation**: See `RESOURCE_TABLE_FIX.md` for detailed steps
   - **Bugfix Date**: 2025-11-21
   - **Session**: claude/skill-review-verification-01Vc8iNrX4QCpWqQXpU2faRa

**For detailed troubleshooting**: See skill [`troubleshooting`](../../audit/troubleshooting/SKILL.md)

---

## Best Practices

1. **Always use transactions** for multi-step operations
2. **Index foreign keys** and filter fields
3. **Select specific fields** instead of fetching all
4. **Use cursor pagination** for large datasets
5. **Validate input** before database operations
6. **Log slow queries** in development
7. **Never expose PrismaClient** to client-side code
8. **Use DIRECT_URL** for migrations (Supabase requirement)
9. **Keep schema.prisma** as single source of truth
10. **Test migrations** in dev before production

---

## ⚠️ Database Optimization - Free Tier Quota Management

### 🚨 Critical: Free Tier Limitations

**Database**: Supabase PostgreSQL (Free Tier)
**Status**: ✅ RESOLVED with optimization

**Comportamento ATUAL - DEPOIS das otimizações**:
```
Build 1, 2, 3... 100, 200 (quantos forem):
├─ Compila TypeScript ✅
└─ Query ao banco? ❌ ZERO
= Builds infinitos, ZERO impacto no banco ✅
```

**Como foi resolvido**:
1. **Stub files** eliminaram `prisma generate` no build
2. Prisma Client já está no `@prisma/client` (npm package)
3. Build usa stubs para types, runtime usa client real

**Limitações do Free Tier** (Supabase):
- **500 MB** storage
- **2 GB** bandwidth/month
- **50k** rows per table (não crítico para Token Milagre)
- **Connection limit**: 60 simultaneous (Supavisor pooling)

**Monitoramento**:
- Supabase Dashboard → Database → Usage
- Alertar se storage > 80% (400 MB)

---

## Related Skills

- [`tokenmilagre-refactoring`](../tokenmilagre-refactoring/SKILL.md) - Type safety patterns
- [`tokenmilagre-testing`](../tokenmilagre-testing/SKILL.md) - Database testing strategies
- [`troubleshooting`](../../audit/troubleshooting/SKILL.md) - Database error solutions
- [`project-context`](../../_meta/project-context/SKILL.md) - Overall architecture

---

**Last Updated**: 2025-11-17
**Version**: 2.0.0
**Mudanças recentes:**
- ✅ **OTIMIZAÇÃO**: 1,247 → 623 linhas (-50%, -2,295 tokens)
- ✅ Schema Overview condensado (full schema referenciado)
- ✅ Query Optimization patterns em vez de exemplos completos
- ✅ Troubleshooting condensado com referência à skill dedicada
- ✅ Database Optimization mantido mas simplificado
- ✅ Foco em PADRÕES reutilizáveis vs verbosidade
