# Prisma Types Reference for Token Milagre Platform

Quick reference guide for using Prisma-generated types in the Token Milagre Platform codebase.

## Import Statement

Always import the Prisma namespace:

```typescript
import { Prisma } from '@prisma/client';
```

## Common Types by Model

### Article Types

```typescript
// Query/Filter types
Prisma.ArticleWhereInput          // WHERE clauses
Prisma.ArticleWhereUniqueInput    // Unique identifiers (id, slug)
Prisma.ArticleOrderByWithRelationInput  // ORDER BY clauses

// Mutation types
Prisma.ArticleCreateInput         // Create operations
Prisma.ArticleUpdateInput         // Update operations
Prisma.ArticleUpsertArgs          // Upsert operations

// Select/Include types
Prisma.ArticleSelect              // Select specific fields
Prisma.ArticleInclude             // Include relations

// Aggregation
Prisma.ArticleGroupByArgs         // GROUP BY operations
Prisma.ArticleAggregateArgs       // Aggregate functions
```

### User Types

```typescript
Prisma.UserWhereInput             // User queries
Prisma.UserCreateInput            // Create user
Prisma.UserUpdateInput            // Update user
Prisma.UserSelect                 // Select user fields
```

### Resource Types

```typescript
Prisma.ResourceWhereInput         // Resource queries
Prisma.ResourceCreateInput        // Create resource
Prisma.ResourceUpdateInput        // Update resource
```

### CopilotActivity Types

```typescript
Prisma.CopilotActivityWhereInput  // Activity queries
Prisma.CopilotActivityCreateInput // Log activity
Prisma.CopilotActivityUpdateInput // Update status
```

## Common Patterns

### 1. Building WHERE Clauses

```typescript
const where: Prisma.ArticleWhereInput = {};

// Simple equality
where.type = 'news';
where.published = true;

// Conditional filters
if (typeof args.published === 'boolean') {
  where.published = args.published;
}

// Text search
where.OR = [
  { title: { contains: query, mode: 'insensitive' } },
  { content: { contains: query, mode: 'insensitive' } }
];

// Numeric ranges (avoid spread - see Pattern Library)
if (minScore !== undefined && maxScore !== undefined) {
  where.factCheckScore = { gte: minScore, lte: maxScore };
} else if (minScore !== undefined) {
  where.factCheckScore = { gte: minScore };
} else if (maxScore !== undefined) {
  where.factCheckScore = { lte: maxScore };
}

// Dates
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
where.createdAt = { gte: weekAgo };

// Relations
where.author = {
  role: 'ADMIN'
};
```

### 2. Creating Records

```typescript
const articleData: Prisma.ArticleCreateInput = {
  title: 'My Article',
  slug: 'my-article',
  content: 'Article content',
  type: 'news',
  category: 'bitcoin',
  published: false,
  // Connect to existing user
  author: { connect: { id: userId } }
};

const article = await prisma.article.create({
  data: articleData,
  include: { author: true }
});
```

### 3. Updating Records

```typescript
const updateData: Prisma.ArticleUpdateInput = {};

if (title) updateData.title = title;
if (content) updateData.content = content;
if (typeof published === 'boolean') updateData.published = published;

const updated = await prisma.article.update({
  where: { id: articleId },
  data: updateData
});
```

### 4. Selecting Fields

```typescript
const article = await prisma.article.findUnique({
  where: { slug },
  select: {
    id: true,
    title: true,
    content: true,
    author: {
      select: {
        name: true,
        email: true
      }
    }
  }
});
```

### 5. Aggregations

```typescript
const stats = await prisma.article.aggregate({
  _avg: { factCheckScore: true },
  _count: { id: true },
  where: { published: true }
});

const avgScore = stats._avg.factCheckScore || 0;
```

### 6. Group By

```typescript
const categoryStats = await prisma.article.groupBy({
  by: ['category'],
  _count: { category: true },
  orderBy: { _count: { category: 'desc' } },
  take: 5,
  where: { published: true }
});

// Result: Array<{ category: string; _count: { category: number } }>
```

## Type Safety Tips

### Avoid Common Mistakes

❌ **Don't use `any`:**
```typescript
const where: any = {};  // Bad
```

✅ **Use Prisma types:**
```typescript
const where: Prisma.ArticleWhereInput = {};  // Good
```

---

❌ **Don't spread conditional types:**
```typescript
where.factCheckScore = { ...where.factCheckScore, lte: max };  // Build error!
```

✅ **Build complete objects:**
```typescript
if (min && max) {
  where.factCheckScore = { gte: min, lte: max };
}
```

---

❌ **Don't use wrong mutation type:**
```typescript
const data: Prisma.ArticleCreateInput = { /* updates */ };
await prisma.article.update({ data });  // Type error!
```

✅ **Match operation to type:**
```typescript
const data: Prisma.ArticleUpdateInput = { /* updates */ };
await prisma.article.update({ data });
```

## Schema Reference

### Article Model Fields

```typescript
{
  id: string           // UUID
  slug: string         // Unique
  title: string
  content: string
  excerpt: string | null
  type: 'news' | 'educational'
  category: string
  published: boolean
  tags: string | null  // JSON string
  sentiment: 'positive' | 'neutral' | 'negative' | null
  factCheckScore: number | null
  factCheckStatus: string | null
  level: string | null
  readTime: string | null
  coverImage: string | null
  keywords: string | null  // JSON string
  contentType: string | null
  authorId: string
  author: User         // Relation
  createdAt: Date
  updatedAt: Date
}
```

### User Model Fields

```typescript
{
  id: string
  email: string | null
  name: string | null
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | null
  articles: Article[]  // Relation
  copilotActivities: CopilotActivity[]  // Relation
  createdAt: Date
}
```

## Resources

- **Prisma Docs:** https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
- **Schema Location:** `prisma/schema.prisma`
- **Generated Types:** `lib/generated/prisma/`

---

**Last Updated:** 2025-01-09
