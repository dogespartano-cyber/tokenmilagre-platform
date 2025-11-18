-- ============================================================================
-- ROLLBACK: Schema v2 → v1
-- Data: 2025-11-18
-- Descrição: Reverte migração do schema v2 para v1
-- ============================================================================

-- IMPORTANTE: Execute SOMENTE se a migração v2 falhou ou precisa ser revertida
-- IMPORTANTE: Certifique-se de ter backup completo antes!

BEGIN;

-- ============================================================================
-- 1. RESTAURAR Article.published A PARTIR DE Article.status
-- ============================================================================

-- Se os campos ainda existem (migração parcial)
DO $$
BEGIN
  -- Verificar se coluna 'published' existe
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Article'
      AND column_name = 'published'
  ) THEN
    -- Restaurar valores
    UPDATE "Article"
    SET published = CASE
      WHEN status = 'published'::article_status THEN true
      ELSE false
    END;

    RAISE NOTICE 'Campo published restaurado';
  ELSE
    RAISE NOTICE 'Campo published não existe - migração foi completa';
  END IF;
END $$;

-- ============================================================================
-- 2. RESTAURAR Article.category A PARTIR DE Article.categoryId
-- ============================================================================

DO $$
BEGIN
  -- Verificar se coluna 'category' existe
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Article'
      AND column_name = 'category'
  ) THEN
    -- Restaurar valores
    UPDATE "Article" a
    SET category = c.slug
    FROM "Category" c
    WHERE a."categoryId" = c.id;

    RAISE NOTICE 'Campo category restaurado';
  ELSE
    RAISE NOTICE 'Campo category não existe - migração foi completa';
  END IF;
END $$;

-- ============================================================================
-- 3. RESTAURAR Article.type PARA STRING
-- ============================================================================

-- Converter enum de volta para string (se necessário)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Article'
      AND column_name = 'type'
      AND data_type = 'USER-DEFINED'
  ) THEN
    -- Tipo já é enum, conversão necessária
    -- Nota: Isso só funciona se a coluna ainda aceitar string
    RAISE NOTICE 'Tipo é enum - conversão manual necessária';
  END IF;
END $$;

-- ============================================================================
-- 4. LIMPAR DADOS NOVOS (SE APLICÁVEL)
-- ============================================================================

-- Resetar campos que não existiam em v1
UPDATE "Article"
SET
  "deletedAt" = NULL,
  "readTime" = NULL,
  "viewCount" = 0;

-- ============================================================================
-- 5. RELATÓRIO DE ROLLBACK
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RELATÓRIO DE ROLLBACK';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Artigos processados: %', (SELECT COUNT(*) FROM "Article");
  RAISE NOTICE 'Artigos com published=true: %', (
    SELECT COUNT(*) FROM "Article"
    WHERE published = true
  );
  RAISE NOTICE 'Artigos com category definida: %', (
    SELECT COUNT(*) FROM "Article"
    WHERE category IS NOT NULL
  );
  RAISE NOTICE '========================================';
END $$;

COMMIT;

-- ============================================================================
-- PRÓXIMOS PASSOS PARA ROLLBACK COMPLETO
-- ============================================================================

/*
1. REVERTER SCHEMA PRISMA:
   mv prisma/schema.prisma.backup prisma/schema.prisma

2. GERAR CLIENT ANTIGO:
   npx prisma generate

3. REVERTER CÓDIGO:
   git revert <commit-hash-da-migracao>
   git push origin main

4. DEPLOYMENT:
   vercel --prod

5. VALIDAÇÃO:
   - Testar rotas principais
   - Verificar dados no dashboard
   - Monitorar logs do Sentry

6. SE ROLLBACK COMPLETO NECESSÁRIO (DROP TABLES):

   -- ATENÇÃO: Isso apaga dados permanentemente!
   DROP TABLE IF EXISTS "ArticleTag" CASCADE;
   DROP TABLE IF EXISTS "Tag" CASCADE;
   DROP TABLE IF EXISTS "Category" CASCADE;

   -- Dropar enums criados
   DROP TYPE IF EXISTS article_type CASCADE;
   DROP TYPE IF EXISTS article_status CASCADE;
   DROP TYPE IF EXISTS level CASCADE;
   DROP TYPE IF EXISTS content_type CASCADE;

   -- Restaurar a partir do backup SQL completo
   psql $DATABASE_URL < backup-YYYYMMDD.sql

7. COMUNICAÇÃO:
   - Notificar equipe sobre rollback
   - Documentar causa raiz
   - Planejar nova tentativa de migração
*/

-- ============================================================================
-- FIM DO ROLLBACK
-- ============================================================================
