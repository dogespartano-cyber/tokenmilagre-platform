#!/usr/bin/env ts-node
/**
 * Execute Schema Migration v2
 * Aplica o schema v2 SQL incrementalmente
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================');
  console.log('SCHEMA MIGRATION v2');
  console.log('========================================\n');

  try {
    console.log('🔄 Criando enums...\n');

    // 1. Criar ArticleStatus enum
    try {
      await prisma.$executeRaw`
        DO $$ BEGIN
            CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published', 'archived');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('  ✓ Enum ArticleStatus criado');
    } catch (e) {
      console.log('  → Enum ArticleStatus já existe');
    }

    // 2. Criar ArticleType enum
    try {
      await prisma.$executeRaw`
        DO $$ BEGIN
            CREATE TYPE "ArticleType" AS ENUM ('news', 'educational');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('  ✓ Enum ArticleType criado\n');
    } catch (e) {
      console.log('  → Enum ArticleType já existe\n');
    }

    console.log('🔄 Criando tabela Category...\n');

    await prisma.$executeRaw`
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
      )
    `;
    console.log('  ✓ Tabela Category criada\n');

    console.log('🔄 Criando índices da Category...\n');

    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Category_type_idx" ON "Category"("type")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Category_parentId_idx" ON "Category"("parentId")`;
    console.log('  ✓ Índices criados\n');

    console.log('🔄 Criando tabela Tag...\n');

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Tag" (
          "id" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
      )
    `;
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Tag_slug_key" ON "Tag"("slug")`;
    console.log('  ✓ Tabela Tag criada\n');

    console.log('🔄 Criando tabela ArticleTag...\n');

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ArticleTag" (
          "articleId" TEXT NOT NULL,
          "tagId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("articleId","tagId")
      )
    `;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "ArticleTag_tagId_idx" ON "ArticleTag"("tagId")`;
    console.log('  ✓ Tabela ArticleTag criada\n');

    console.log('🔄 Adicionando colunas em Article...\n');

    await prisma.$executeRaw`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "categoryId" TEXT`;
    console.log('  ✓ categoryId');

    await prisma.$executeRaw`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "status" "ArticleStatus"`;
    console.log('  ✓ status');

    await prisma.$executeRaw`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)`;
    console.log('  ✓ deletedAt');

    await prisma.$executeRaw`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0`;
    console.log('  ✓ viewCount\n');

    console.log('🔄 Criando índices em Article...\n');

    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Article_categoryId_idx" ON "Article"("categoryId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Article_status_idx" ON "Article"("status")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Article_deletedAt_idx" ON "Article"("deletedAt")`;
    console.log('  ✓ Índices criados\n');

    console.log('🔄 Adicionando foreign keys...\n');

    await prisma.$executeRaw`
      DO $$ BEGIN
          ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey"
              FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('  ✓ Category.parentId FK');

    await prisma.$executeRaw`
      DO $$ BEGIN
          ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey"
              FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('  ✓ Article.categoryId FK');

    await prisma.$executeRaw`
      DO $$ BEGIN
          ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_articleId_fkey"
              FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('  ✓ ArticleTag.articleId FK');

    await prisma.$executeRaw`
      DO $$ BEGIN
          ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_tagId_fkey"
              FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('  ✓ ArticleTag.tagId FK\n');

    console.log('✅ Schema v2 aplicado com sucesso!\n');
    console.log('Próximo passo: Execute data-migration-v2 para popular os dados.\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao aplicar schema:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
