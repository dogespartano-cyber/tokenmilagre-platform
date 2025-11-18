-- ============================================================================
-- SCHEMA MIGRATION v2
-- Aplica schema v2 incrementalmente sem perder dados
-- Data: 2025-11-18
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CRIAR ENUMS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ArticleType" AS ENUM ('news', 'educational');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. CRIAR TABELA Category
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'news',
    "parentId" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_type_idx" ON "Category"("type");
CREATE INDEX IF NOT EXISTS "Category_parentId_idx" ON "Category"("parentId");

-- ============================================================================
-- 3. CRIAR TABELA Tag
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Tag_slug_key" ON "Tag"("slug");

-- ============================================================================
-- 4. CRIAR TABELA ArticleTag (Many-to-Many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "ArticleTag" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("articleId","tagId")
);

CREATE INDEX IF NOT EXISTS "ArticleTag_tagId_idx" ON "ArticleTag"("tagId");

-- ============================================================================
-- 5. ADICIONAR NOVAS COLUNAS EM Article (nullable primeiro)
-- ============================================================================

-- categoryId (nullable primeiro, será populado depois)
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

-- status (nullable primeiro, será populado depois)
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "status" "ArticleStatus";

-- deletedAt (soft delete)
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- viewCount (com valor padrão)
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;

-- readTime já existe

-- ============================================================================
-- 6. CRIAR ÍNDICES em Article
-- ============================================================================

CREATE INDEX IF NOT EXISTS "Article_categoryId_idx" ON "Article"("categoryId");
CREATE INDEX IF NOT EXISTS "Article_status_idx" ON "Article"("status");
CREATE INDEX IF NOT EXISTS "Article_deletedAt_idx" ON "Article"("deletedAt");

-- ============================================================================
-- 7. ADICIONAR FOREIGN KEYS
-- ============================================================================

DO $$ BEGIN
    ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey"
        FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_articleId_fkey"
        FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_tagId_fkey"
        FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

COMMIT;

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================

-- PRÓXIMO PASSO: Executar data-migration-v2.sql para popular os dados
