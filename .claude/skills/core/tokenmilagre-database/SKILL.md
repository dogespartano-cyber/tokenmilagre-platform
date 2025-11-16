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
- Managing database backups

## Database Stack

- **Database:** PostgreSQL (Neon serverless via Vercel Marketplace)
- **ORM:** Prisma 6.3.0
- **Connection:** Prisma Client with connection pooling
- **Migrations:** Prisma Migrate
- **Location:** `prisma/schema.prisma`
- **Prisma Client Location:** `lib/generated/prisma` (custom path)
- **Total Users:** 2 (Admin + Editor)

## ⚠️ Critical Rules - Token Milagre Specific

### 1. ALWAYS Use Prisma Directly in Server Components

```typescript
// ❌ WRONG: Fetching HTTP in Server Components
async function getArticles() {
  const res = await fetch('http://localhost:3000/api/articles');
  return await res.json();
}

// ✅ CORRECT: Direct Prisma access
import { prisma } from '@/lib/prisma';

async function getArticles() {
  return await prisma.article.findMany();
}
```

**Why?**
- Requires environment variables (`NEXT_PUBLIC_API_URL`, `VERCEL_URL`)
- Adds HTTP overhead (serialization, network, deserialization)
- Prone to errors in different environments
- Slower than direct database access

### 2. Correct Prisma Client Path

```typescript
// ✅ CORRECT - This project uses custom path
import { prisma } from '@/lib/prisma';

// OR in Node.js scripts:
const { PrismaClient } = require('../lib/generated/prisma');

// ❌ WRONG - Don't use default path
import { PrismaClient } from '@prisma/client';
```

### 3. When to Use API Routes

- ✅ Public endpoints (webhooks, external integrations)
- ✅ Client Components making mutations
- ✅ External scripts (CLI, watchers)
- ❌ Server Components fetching database data

### 4. Build Configuration

**⚠️ IMPORTANT: Offline Build Strategy**

This project uses **Prisma stub files** to enable builds in restricted environments (no internet, firewall blocks, HTTP 403 errors).

**Required in `package.json`:**
```json
{
  "scripts": {
    "postinstall-disabled": "prisma generate"  // DISABLED for offline builds
  }
}
```

**Why disabled?**
- `prisma generate` downloads binaries from GitHub (can fail with 403)
- Stub files committed to git provide types for TypeScript compilation
- Real Prisma Client from `@prisma/client` is used at runtime

**Required in `next.config.ts`:**
```typescript
{
  eslint: {
    ignoreDuringBuilds: true // Don't lint Prisma generated files
  }
}
```

**Stub Files Location:**
- `lib/generated/prisma/index.js` - Re-exports PrismaClient from @prisma/client
- `lib/generated/prisma/index.d.ts` - TypeScript type definitions
- `lib/generated/prisma/.gitkeep` - Keeps directory in git

**Schema Configuration:**
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
  engineType = "library"  // Important for stub compatibility
}
```

**Vercel Build Checklist:**
- [ ] `postinstall-disabled` (NOT `postinstall`)
- [ ] Stub files committed to git in `lib/generated/prisma/`
- [ ] `next.config.ts` with `eslint.ignoreDuringBuilds: true`
- [ ] `prisma/schema.prisma` pointing to PostgreSQL with `engineType = "library"`
- [ ] `DATABASE_URL` set in Vercel (DIRECT_URL not required)
- [ ] Neon integration connected

### 5. Environment Variables

**Production (Vercel)** - Auto-configured by Neon integration:
```env
DATABASE_URL=postgresql://... (with pooling)
DIRECT_URL=postgresql://... (without pooling, for migrations)
```

**Development** - Copy from Vercel Settings → Environment Variables:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### 6. Migration History - SQLite → PostgreSQL

**Completed:** 2025-10-19

- **Previous:** SQLite (`prisma/dev.db`)
- **Current:** Neon PostgreSQL
- **Backup:** `prisma/backup-sqlite.json` (gitignored)
- **Documentation:** `MIGRACAO-POSTGRES.md`

**Important:** NEVER use SQLite in production on Vercel - serverless environment doesn't persist files.

## Current Schema Overview

```prisma
// prisma/schema.prisma

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

// Main Models
model User {
  id                String              @id @default(uuid())
  email             String?             @unique
  name              String?
  role              Role?
  articles          Article[]
  copilotActivities CopilotActivity[]
  createdAt         DateTime            @default(now())
}

model Article {
  id               String    @id @default(uuid())
  slug             String    @unique
  title            String
  content          String    @db.Text
  excerpt          String?
  type             String    // 'news' | 'educational'
  category         String
  published        Boolean   @default(false)
  tags             String?   // JSON string
  sentiment        String?   // 'positive' | 'neutral' | 'negative'
  factCheckScore   Int?
  factCheckStatus  String?
  factCheckSources String?   @db.Text // JSON string
  level            String?   // 'iniciante' | 'intermediario' | 'avancado'
  readTime         String?
  coverImage       String?
  keywords         String?   // JSON string
  contentType      String?
  authorId         String
  author           User      @relation(fields: [authorId], references: [id])
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([slug])
  @@index([category])
  @@index([published])
  @@index([authorId])
  @@index([createdAt])
}

model Resource {
  id          String   @id @default(uuid())
  slug        String   @unique
  title       String
  description String?
  url         String
  category    String
  type        String   // 'tool' | 'exchange' | 'wallet' | 'education'
  featured    Boolean  @default(false)
  tags        String?  // JSON string
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([category])
  @@index([type])
}

model CopilotActivity {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  toolName  String
  action    String
  details   String?  @db.Text // JSON string
  status    String   @default("success")
  timestamp DateTime @default(now())

  @@index([userId])
  @@index([timestamp])
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}
```

## Schema Design Patterns

### Pattern 1: Adding a New Model

```prisma
// Step 1: Define model in schema.prisma
model Newsletter {
  id          String   @id @default(uuid())
  email       String   @unique
  subscribed  Boolean  @default(true)
  tags        String?  // JSON string array
  source      String?  // Where they subscribed from
  confirmedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([email])
  @@index([subscribed])
  @@index([createdAt])
}
```

```bash
# Step 2: Create migration
npx prisma migrate dev --name add_newsletter_model

# Step 3: Generate Prisma Client
npx prisma generate
```

```typescript
// Step 4: Use in code
import { prisma } from '@/lib/prisma';

async function subscribeToNewsletter(email: string) {
  return await prisma.newsletter.create({
    data: {
      email,
      subscribed: true,
      source: 'homepage',
      confirmedAt: new Date()
    }
  });
}
```

### Pattern 2: Adding Fields to Existing Model

```prisma
// Before
model Article {
  id      String @id @default(uuid())
  title   String
  content String @db.Text
  // ...
}

// After - Add new optional fields
model Article {
  id      String @id @default(uuid())
  title   String
  content String @db.Text
  // NEW: Social media metadata
  socialTitle       String?  // Custom title for social sharing
  socialDescription String?  // Custom description for social
  socialImage       String?  // Custom image for Open Graph
  // ...
}
```

```bash
# Create migration
npx prisma migrate dev --name add_social_metadata_to_article
```

**Important:** New fields should be optional (`?`) to avoid breaking existing data.

### Pattern 3: Relations

**One-to-Many (User → Articles):**
```prisma
model User {
  id       String    @id @default(uuid())
  articles Article[] // One user has many articles
}

model Article {
  id       String @id @default(uuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

**Many-to-Many (Articles ↔ Tags):**
```prisma
model Article {
  id   String        @id @default(uuid())
  tags ArticleTag[]
}

model Tag {
  id       String        @id @default(uuid())
  name     String        @unique
  articles ArticleTag[]
}

model ArticleTag {
  articleId String
  article   Article @relation(fields: [articleId], references: [id])
  tagId     String
  tag       Tag     @relation(fields: [tagId], references: [id])

  @@id([articleId, tagId])
  @@index([articleId])
  @@index([tagId])
}
```

**One-to-One (User ↔ Profile):**
```prisma
model User {
  id      String   @id @default(uuid())
  profile Profile?
}

model Profile {
  id     String @id @default(uuid())
  bio    String?
  avatar String?
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### Pattern 4: Indexes for Performance

```prisma
model Article {
  id        String   @id @default(uuid())
  slug      String   @unique
  category  String
  published Boolean
  createdAt DateTime @default(now())

  // Single-column indexes
  @@index([slug])      // Fast slug lookups
  @@index([category])  // Filter by category
  @@index([published]) // Published/unpublished filter
  @@index([createdAt]) // Order by date

  // Composite indexes (multiple columns)
  @@index([category, published]) // Filter by both
  @@index([published, createdAt(sort: Desc)]) // Published articles by date
}
```

**Index Strategy:**
- Index foreign keys (e.g., `authorId`)
- Index frequently queried fields (e.g., `slug`, `category`)
- Index fields used in ORDER BY (e.g., `createdAt`)
- Composite indexes for common query combinations
- Don't over-index - each index has storage/write cost

### Pattern 5: Enum Types

```prisma
enum ArticleType {
  NEWS
  EDUCATIONAL
  ANALYSIS
  TUTORIAL
}

enum ArticleStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}

model Article {
  id     String        @id @default(uuid())
  type   ArticleType   @default(NEWS)
  status ArticleStatus @default(DRAFT)
}
```

**Benefits:**
- Type safety in TypeScript
- Database-level constraint
- Clear allowed values

### Pattern 6: JSON Fields (Current Pattern)

```prisma
model Article {
  tags     String? // JSON string: '["bitcoin","defi"]'
  keywords String? // JSON string
}
```

```typescript
// Usage
const article = await prisma.article.create({
  data: {
    title: 'My Article',
    tags: JSON.stringify(['bitcoin', 'defi']),
    keywords: JSON.stringify(['crypto', 'blockchain'])
  }
});

// Reading
const tags = article.tags ? JSON.parse(article.tags) : [];
```

**Alternative: Native JSON type (recommended for new fields):**
```prisma
model Article {
  metadata Json? // Native JSON support
}
```

```typescript
const article = await prisma.article.create({
  data: {
    metadata: {
      seo: { title: '...', description: '...' },
      analytics: { views: 0, shares: 0 }
    }
  }
});
```

## Migration Workflows

### Creating a Migration

```bash
# 1. Modify schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name descriptive_migration_name

# Examples:
npx prisma migrate dev --name add_newsletter_model
npx prisma migrate dev --name add_social_fields_to_article
npx prisma migrate dev --name create_article_tag_relation
```

### Viewing Migration History

```bash
# Show applied migrations
npx prisma migrate status

# Show SQL for a migration
cat prisma/migrations/20250109_add_newsletter_model/migration.sql
```

### Rolling Back (Development)

```bash
# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Apply migrations up to a specific one
npx prisma migrate resolve --applied "20250109_add_newsletter_model"
```

### Production Migrations

```bash
# Generate migration without applying
npx prisma migrate dev --create-only --name migration_name

# Review the generated SQL
cat prisma/migrations/YYYYMMDD_migration_name/migration.sql

# Apply in production
npx prisma migrate deploy
```

**Production Best Practices:**
1. Test migration on staging first
2. Backup database before migration
3. Run during low-traffic window
4. Monitor for errors
5. Have rollback plan ready

## Query Optimization

### Pattern 1: Select Only Needed Fields

```typescript
// ❌ Bad: Fetch all fields (including large content)
const articles = await prisma.article.findMany();

// ✅ Good: Select only needed fields
const articles = await prisma.article.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true, // Don't fetch full content for list view
    createdAt: true
  }
});
```

### Pattern 2: Paginate Large Result Sets

```typescript
// ❌ Bad: Fetch everything
const articles = await prisma.article.findMany();

// ✅ Good: Paginate
const page = 1;
const pageSize = 20;

const articles = await prisma.article.findMany({
  take: pageSize,
  skip: (page - 1) * pageSize,
  orderBy: { createdAt: 'desc' }
});

const total = await prisma.article.count();
```

### Pattern 3: Use Include Wisely

```typescript
// ❌ Bad: Over-fetching nested relations
const article = await prisma.article.findUnique({
  where: { slug },
  include: {
    author: true, // Fetches all author fields
    // This would fetch even more if author had relations
  }
});

// ✅ Good: Select specific fields from relations
const article = await prisma.article.findUnique({
  where: { slug },
  include: {
    author: {
      select: {
        name: true,
        email: true
        // Don't fetch unnecessary fields
      }
    }
  }
});
```

### Pattern 4: Batch Operations

```typescript
// ❌ Bad: Multiple individual queries
for (const slug of slugs) {
  await prisma.article.update({
    where: { slug },
    data: { published: true }
  });
}

// ✅ Good: Single batch update
await prisma.article.updateMany({
  where: {
    slug: { in: slugs }
  },
  data: { published: true }
});
```

### Pattern 5: Use Transactions for Multiple Operations

```typescript
// ✅ Good: Atomic operations
await prisma.$transaction(async (tx) => {
  // Create article
  const article = await tx.article.create({
    data: articleData
  });

  // Log activity
  await tx.copilotActivity.create({
    data: {
      userId,
      toolName: 'create_article',
      action: 'created',
      details: JSON.stringify({ articleId: article.id })
    }
  });

  // Update user stats
  await tx.user.update({
    where: { id: userId },
    data: {
      // Update article count, etc.
    }
  });
});
```

### Pattern 6: Avoid N+1 Queries

```typescript
// ❌ Bad: N+1 query problem
const articles = await prisma.article.findMany();
for (const article of articles) {
  const author = await prisma.user.findUnique({
    where: { id: article.authorId }
  }); // Separate query for each article!
}

// ✅ Good: Single query with include
const articles = await prisma.article.findMany({
  include: {
    author: {
      select: {
        name: true,
        email: true
      }
    }
  }
});
```

## Connection Management

### Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@/lib/generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

**Why singleton?**
- Prevents connection pool exhaustion in Next.js dev mode
- Reuses connections across hot reloads
- Better performance

### Connection Pooling (Neon)

```env
# .env.local
DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true&connection_limit=10"
DIRECT_URL="postgresql://user:pass@host/db"
```

- `DATABASE_URL`: Pooled connection (for queries)
- `DIRECT_URL`: Direct connection (for migrations)

## Data Integrity

### Validation Before Insert

```typescript
async function createArticle(data: any) {
  // Validate
  if (!data.title || data.title.length < 10) {
    throw new Error('Title must be at least 10 characters');
  }

  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
    throw new Error('Invalid slug format');
  }

  // Check uniqueness
  const existing = await prisma.article.findUnique({
    where: { slug: data.slug }
  });

  if (existing) {
    throw new Error('Article with this slug already exists');
  }

  // Create
  return await prisma.article.create({ data });
}
```

### Default Values

```prisma
model Article {
  id        String   @id @default(uuid())
  published Boolean  @default(false) // Default: unpublished
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt      // Auto-update on save
}
```

### Cascading Deletes

```prisma
model User {
  id       String    @id @default(uuid())
  articles Article[]
}

model Article {
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

**Cascade modes:**
- `Cascade`: Delete related records
- `SetNull`: Set foreign key to null
- `Restrict`: Prevent deletion if relations exist (default)
- `NoAction`: Database handles it

## Common Tasks

### Add New Column

```bash
# 1. Edit schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_view_count_to_article

# 3. Generate types
npx prisma generate
```

### Seed Database

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tokenmilagre.com' },
    update: {},
    create: {
      email: 'admin@tokenmilagre.com',
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  // Create sample articles
  await prisma.article.createMany({
    data: [
      {
        slug: 'bitcoin-basics',
        title: 'Bitcoin Basics',
        content: '...',
        type: 'educational',
        category: 'bitcoin',
        authorId: admin.id
      }
      // More articles...
    ]
  });

  console.log('✅ Database seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```bash
# Run seed
npx prisma db seed
```

### Backup Database

```bash
# Using pg_dump (requires PostgreSQL client)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Using Neon dashboard (recommended)
# Go to Neon dashboard → Branches → Create branch
```

### Reset Database (Development)

```bash
# ⚠️ WARNING: Deletes all data
npx prisma migrate reset

# This will:
# 1. Drop database
# 2. Create database
# 3. Apply all migrations
# 4. Run seed (if configured)
```

## Troubleshooting

### Issue: "Can't reach database server"

**Symptoms:** P1001 error, connection timeout

**Solutions:**
1. Check `DATABASE_URL` in `.env.local`
2. Verify Neon database is running
3. Check connection limits
4. Use `DIRECT_URL` for migrations

### Issue: Migration conflicts

**Symptoms:** "Migration X conflicts with Y"

**Solutions:**
1. Development: `npx prisma migrate reset`
2. Production: Resolve manually or rollback

### Issue: Type errors after schema change

**Symptoms:** TypeScript errors, "Property does not exist"

**Solutions:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: HTTP 403 when downloading Prisma binaries

**Symptoms:**
- Build fails with "Failed to fetch" or "HTTP 403 Forbidden"
- Error during `prisma generate` in postinstall
- "Can't locate Query Engine" errors

**Cause:** Firewall blocking GitHub downloads, restricted network environment

**Solution:** This project uses **stub files** to bypass binary downloads

**Verify stub files exist:**
```bash
ls -la lib/generated/prisma/
# Should show: index.js, index.d.ts, .gitkeep
```

**Verify postinstall is disabled:**
```bash
grep "postinstall" package.json
# Should show: "postinstall-disabled": "prisma generate"
```

**If stub files are missing:**
1. Restore from git: `git checkout lib/generated/prisma/`
2. Or recreate following `troubleshooting` skill (Problema 9)

**Reference:** See `troubleshooting` skill → "Problema 9: Prisma 403 Error"

### Issue: Slow queries

**Solutions:**
1. Add indexes for frequently queried fields
2. Use `select` to fetch only needed fields
3. Paginate large result sets
4. Use `explain` to analyze query plan

## Best Practices

1. **Always use migrations** - Don't manually edit database
2. **Index strategically** - Foreign keys, query fields, sort fields
3. **Select only needed fields** - Avoid fetching large text fields unnecessarily
4. **Paginate** - Never fetch unbounded result sets
5. **Use transactions** - For multi-step operations
6. **Validate before insert** - Check data integrity
7. **Test migrations** - On staging before production
8. **Backup before migrations** - Always have rollback plan
9. **Use connection pooling** - Configure Neon properly
10. **Monitor query performance** - Use Prisma logging in dev

## Offline Build Strategy (Prisma Stub Files)

### Overview

This project uses a **stub file approach** to enable builds in environments with network restrictions:

**Problem:**
- Prisma generates client by downloading platform-specific binaries
- Firewalls/restricted networks block downloads (HTTP 403)
- Build fails before TypeScript compilation

**Solution:**
- Disable `postinstall` hook that runs `prisma generate`
- Commit stub files to git that re-export `@prisma/client`
- TypeScript builds successfully using stub types
- Runtime uses real Prisma Client from `@prisma/client` package

### Stub File Structure

**`lib/generated/prisma/index.js`:**
```javascript
const { PrismaClient: BasePrismaClient } = require('@prisma/client');

class PrismaClient extends BasePrismaClient {
  constructor(options) {
    super(options);
  }
}

module.exports = {
  PrismaClient,
  Prisma: {}
};
module.exports.PrismaClient = PrismaClient;
```

**`lib/generated/prisma/index.d.ts`:**
```typescript
// Re-export everything from @prisma/client (includes enums, types)
export * from '@prisma/client';

// Re-export PrismaClient for convenience
export { PrismaClient } from '@prisma/client';

// Additional namespace types for compatibility
export declare namespace Prisma {
  export type ArticleWhereInput = any;
  export type ArticleSelect = any;
  export type ArticleInclude = any;
  export type ArticleOrderByWithRelationInput = any;
  export type ArticleCreateInput = any;
  export type ArticleUpdateInput = any;
  export type UserWhereInput = any;
  export type ResourceWhereInput = any;
  export type CryptocurrencyWhereInput = any;
}
```

### How It Works

**Build Time:**
1. npm install runs
2. `postinstall` is disabled, so no binary download
3. TypeScript compiler uses stub types from `lib/generated/prisma/index.d.ts`
4. Build succeeds without network access

**Runtime:**
1. Code imports: `import { prisma } from '@/lib/prisma'`
2. Stub re-exports from `@prisma/client` package
3. Real Prisma Client (from node_modules) is used
4. Connects to database normally

### When to Regenerate Stub

Regenerate stub files when:
- Schema changes significantly (new models, major refactoring)
- New Prisma types are needed in stub namespace
- Upgrading Prisma version with breaking changes

**Don't need to regenerate for:**
- Adding/removing columns to existing models
- Changing indexes
- Minor schema adjustments

### Manual Prisma Generate (Development)

If you need to generate full Prisma Client locally:

```bash
# Temporarily enable postinstall
npm run postinstall-disabled  # This still works as a direct script

# Or run directly
npx prisma generate

# Or in package.json, rename back to "postinstall" temporarily
```

**Remember:** Re-disable before committing to avoid build failures.

### Advantages & Limitations

**✅ Advantages:**
- Builds work without internet/in restricted networks
- No HTTP 403 errors from binary downloads
- Faster builds (no download step)
- TypeScript types available for compilation

**⚠️ Limitations:**
- Stub types are generic (`any`) instead of specific
- Need manual update if schema changes drastically
- No Prisma Studio access without full generation
- Migrations need `npx prisma db push` in build script

**Note:** This is a workaround for build environments. In production runtime, the full Prisma Client works normally.

## Related Skills

- `tokenmilagre-refactoring` - Prisma types reference
- `tokenmilagre-copilot-tools` - Database query patterns
- `project-context` - Database architecture
- `troubleshooting` - Problema 9 (Prisma 403 Error detailed guide)

---

**Last Updated:** 2025-11-16
**Version:** 1.1.0 (Added offline build strategy documentation)
