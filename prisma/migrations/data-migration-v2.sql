-- ============================================================================
-- DATA MIGRATION: Schema v1 → v2
-- Data: 2025-11-18
-- Descrição: Migra dados existentes para estrutura do schema v2
-- ============================================================================

-- IMPORTANTE: Execute este script APÓS aplicar as migrations estruturais do Prisma
-- IMPORTANTE: Faça backup completo antes de executar!

BEGIN;

-- ============================================================================
-- 1. CRIAR CATEGORIAS A PARTIR DE STRINGS ÚNICAS
-- ============================================================================

-- Inserir categorias únicas encontradas em Article.category
INSERT INTO "Category" (id, slug, name, description, "createdAt", "updatedAt")
SELECT
  gen_random_uuid() as id,
  LOWER(TRIM(category)) as slug,
  INITCAP(TRIM(category)) as name,
  NULL as description,
  NOW() as "createdAt",
  NOW() as "updatedAt"
FROM (
  SELECT DISTINCT category
  FROM "Article"
  WHERE category IS NOT NULL
    AND category != ''
) unique_categories
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. ATUALIZAR Article.categoryId COM BASE EM Article.category
-- ============================================================================

-- Vincular artigos às categorias criadas
UPDATE "Article" a
SET "categoryId" = c.id
FROM "Category" c
WHERE LOWER(TRIM(a.category)) = c.slug
  AND a.category IS NOT NULL
  AND a.category != '';

-- ============================================================================
-- 3. MIGRAR Article.published → Article.status
-- ============================================================================

-- Converter boolean published para enum status
UPDATE "Article"
SET status = CASE
  WHEN published = true THEN 'published'::article_status
  ELSE 'draft'::article_status
END
WHERE status IS NULL;

-- ============================================================================
-- 4. NORMALIZAR Article.type
-- ============================================================================

-- Garantir que todos os tipos sejam válidos
UPDATE "Article"
SET type = CASE
  WHEN LOWER(type) IN ('news', 'educational') THEN LOWER(type)::article_type
  ELSE 'news'::article_type
END;

-- ============================================================================
-- 5. INICIALIZAR NOVOS CAMPOS
-- ============================================================================

-- Inicializar viewCount para artigos existentes
UPDATE "Article"
SET "viewCount" = 0
WHERE "viewCount" IS NULL;

-- Calcular readTime aproximado (baseado em palavras)
-- Fórmula: ~200 palavras por minuto
UPDATE "Article"
SET "readTime" =
  CASE
    WHEN LENGTH(content) > 0 THEN
      CONCAT(
        GREATEST(1, ROUND(LENGTH(content) / 1000.0)), -- aproximação: 5 chars = 1 palavra
        ' min'
      )
    ELSE '1 min'
  END
WHERE "readTime" IS NULL;

-- ============================================================================
-- 6. LIMPAR DADOS ÓRFÃOS/INVÁLIDOS
-- ============================================================================

-- Remover artigos sem autor (caso existam)
DELETE FROM "Article"
WHERE "authorId" IS NULL
  OR NOT EXISTS (
    SELECT 1 FROM "User" WHERE "User".id = "Article"."authorId"
  );

-- Marcar artigos sem categoria como "Sem Categoria"
DO $$
DECLARE
  uncategorized_id UUID;
BEGIN
  -- Criar categoria "Sem Categoria" se não existir
  INSERT INTO "Category" (id, slug, name, description, "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    'sem-categoria',
    'Sem Categoria',
    'Artigos sem categoria definida',
    NOW(),
    NOW()
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO uncategorized_id;

  -- Se já existia, buscar o ID
  IF uncategorized_id IS NULL THEN
    SELECT id INTO uncategorized_id
    FROM "Category"
    WHERE slug = 'sem-categoria';
  END IF;

  -- Atribuir aos artigos sem categoria
  UPDATE "Article"
  SET "categoryId" = uncategorized_id
  WHERE "categoryId" IS NULL;
END $$;

-- ============================================================================
-- 7. VALIDAÇÕES PÓS-MIGRAÇÃO
-- ============================================================================

-- Verificar se todos os artigos têm categoria
DO $$
DECLARE
  articles_without_category INT;
BEGIN
  SELECT COUNT(*) INTO articles_without_category
  FROM "Article"
  WHERE "categoryId" IS NULL;

  IF articles_without_category > 0 THEN
    RAISE EXCEPTION 'Migração falhou: % artigos sem categoria', articles_without_category;
  END IF;
END $$;

-- Verificar se todos os artigos têm status
DO $$
DECLARE
  articles_without_status INT;
BEGIN
  SELECT COUNT(*) INTO articles_without_status
  FROM "Article"
  WHERE status IS NULL;

  IF articles_without_status > 0 THEN
    RAISE EXCEPTION 'Migração falhou: % artigos sem status', articles_without_status;
  END IF;
END $$;

-- ============================================================================
-- 8. RELATÓRIO DE MIGRAÇÃO
-- ============================================================================

-- Gerar relatório
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RELATÓRIO DE MIGRAÇÃO';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Categorias criadas: %', (SELECT COUNT(*) FROM "Category");
  RAISE NOTICE 'Artigos migrados: %', (SELECT COUNT(*) FROM "Article");
  RAISE NOTICE 'Artigos publicados: %', (SELECT COUNT(*) FROM "Article" WHERE status = 'published');
  RAISE NOTICE 'Artigos em rascunho: %', (SELECT COUNT(*) FROM "Article" WHERE status = 'draft');
  RAISE NOTICE '========================================';
END $$;

COMMIT;

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

-- PRÓXIMOS PASSOS:
-- 1. Verificar dados migrados manualmente
-- 2. Executar testes da aplicação
-- 3. Se tudo OK, pode dropar campos antigos:
--    ALTER TABLE "Article" DROP COLUMN IF EXISTS "published";
--    ALTER TABLE "Article" DROP COLUMN IF EXISTS "category";
