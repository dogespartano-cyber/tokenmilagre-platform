-- ============================================================================
-- PRÉ-MIGRATION CHECK: Análise de Dados Existentes
-- Data: 2025-11-18
-- Descrição: Analisa dados atuais antes da migração v2
-- ============================================================================

-- Execute este script ANTES de iniciar a migração
-- psql $DATABASE_URL < scripts/pre-migration-check.sql

\echo '========================================'
\echo 'PRE-MIGRATION CHECK - Schema v2'
\echo '========================================'
\echo ''

-- ============================================================================
-- 1. CONTAGEM GERAL DE REGISTROS
-- ============================================================================

\echo '1. CONTAGEM GERAL'
\echo '----------------------------------------'

SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Articles', COUNT(*) FROM "Article"
UNION ALL
SELECT 'Accounts', COUNT(*) FROM "Account"
UNION ALL
SELECT 'Sessions', COUNT(*) FROM "Session";

\echo ''

-- ============================================================================
-- 2. ANÁLISE DE MODELS A SEREM REMOVIDOS
-- ============================================================================

\echo '2. MODELS A SEREM REMOVIDOS'
\echo '----------------------------------------'

-- ImpactStory
DO $$
DECLARE
  count_impact_stories INT;
BEGIN
  SELECT COUNT(*) INTO count_impact_stories
  FROM information_schema.tables
  WHERE table_name = 'ImpactStory';

  IF count_impact_stories > 0 THEN
    EXECUTE 'SELECT ''ImpactStory'' as table_name, COUNT(*) as count FROM "ImpactStory"';
  ELSE
    RAISE NOTICE 'Table ImpactStory does not exist';
  END IF;
END $$;

-- SocialProject
DO $$
DECLARE
  count_social_projects INT;
BEGIN
  SELECT COUNT(*) INTO count_social_projects
  FROM information_schema.tables
  WHERE table_name = 'SocialProject';

  IF count_social_projects > 0 THEN
    EXECUTE 'SELECT ''SocialProject'' as table_name, COUNT(*) as count FROM "SocialProject"';
  ELSE
    RAISE NOTICE 'Table SocialProject does not exist';
  END IF;
END $$;

-- WarningAlert
DO $$
DECLARE
  count_warnings INT;
BEGIN
  SELECT COUNT(*) INTO count_warnings
  FROM information_schema.tables
  WHERE table_name = 'WarningAlert';

  IF count_warnings > 0 THEN
    EXECUTE 'SELECT ''WarningAlert'' as table_name, COUNT(*) as count FROM "WarningAlert"';
  ELSE
    RAISE NOTICE 'Table WarningAlert does not exist';
  END IF;
END $$;

-- Cryptocurrency
DO $$
DECLARE
  count_cryptos INT;
BEGIN
  SELECT COUNT(*) INTO count_cryptos
  FROM information_schema.tables
  WHERE table_name = 'Cryptocurrency';

  IF count_cryptos > 0 THEN
    EXECUTE 'SELECT ''Cryptocurrency'' as table_name, COUNT(*) as count FROM "Cryptocurrency"';
  ELSE
    RAISE NOTICE 'Table Cryptocurrency does not exist';
  END IF;
END $$;

-- MarketData
DO $$
DECLARE
  count_market_data INT;
BEGIN
  SELECT COUNT(*) INTO count_market_data
  FROM information_schema.tables
  WHERE table_name = 'MarketData';

  IF count_market_data > 0 THEN
    EXECUTE 'SELECT ''MarketData'' as table_name, COUNT(*) as count FROM "MarketData"';
  ELSE
    RAISE NOTICE 'Table MarketData does not exist';
  END IF;
END $$;

\echo ''

-- ============================================================================
-- 3. ANÁLISE DE CATEGORIAS ÚNICAS
-- ============================================================================

\echo '3. CATEGORIAS ÚNICAS (serão criadas)'
\echo '----------------------------------------'

SELECT
  LOWER(TRIM(category)) as slug,
  INITCAP(TRIM(category)) as name,
  COUNT(*) as article_count
FROM "Article"
WHERE category IS NOT NULL
  AND category != ''
GROUP BY LOWER(TRIM(category))
ORDER BY article_count DESC;

\echo ''

-- ============================================================================
-- 4. ANÁLISE DE Article.type
-- ============================================================================

\echo '4. TIPOS DE ARTIGOS'
\echo '----------------------------------------'

SELECT
  type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Article"), 2) as percentage
FROM "Article"
GROUP BY type
ORDER BY count DESC;

\echo ''

-- ============================================================================
-- 5. ANÁLISE DE Article.published
-- ============================================================================

\echo '5. STATUS DE PUBLICAÇÃO'
\echo '----------------------------------------'

SELECT
  published,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Article"), 2) as percentage
FROM "Article"
GROUP BY published
ORDER BY published DESC;

\echo ''

-- ============================================================================
-- 6. ARTIGOS SEM CATEGORIA
-- ============================================================================

\echo '6. ARTIGOS SEM CATEGORIA'
\echo '----------------------------------------'

SELECT COUNT(*) as articles_without_category
FROM "Article"
WHERE category IS NULL OR category = '';

\echo ''

-- ============================================================================
-- 7. ARTIGOS SEM AUTOR (ÓRFÃOS)
-- ============================================================================

\echo '7. ARTIGOS ÓRFÃOS (sem autor)'
\echo '----------------------------------------'

SELECT COUNT(*) as orphaned_articles
FROM "Article"
WHERE "authorId" IS NULL
  OR NOT EXISTS (
    SELECT 1 FROM "User" WHERE "User".id = "Article"."authorId"
  );

\echo ''

-- ============================================================================
-- 8. DISTRIBUIÇÃO DE AUTORES
-- ============================================================================

\echo '8. ARTIGOS POR AUTOR'
\echo '----------------------------------------'

SELECT
  u.name,
  u.email,
  COUNT(a.id) as article_count
FROM "User" u
LEFT JOIN "Article" a ON a."authorId" = u.id
GROUP BY u.id, u.name, u.email
ORDER BY article_count DESC
LIMIT 10;

\echo ''

-- ============================================================================
-- 9. CHECKLIST DE AÇÕES NECESSÁRIAS
-- ============================================================================

\echo '9. CHECKLIST DE AÇÕES'
\echo '----------------------------------------'

DO $$
DECLARE
  orphaned_count INT;
  no_category_count INT;
  invalid_type_count INT;
BEGIN
  -- Artigos órfãos
  SELECT COUNT(*) INTO orphaned_count
  FROM "Article"
  WHERE "authorId" IS NULL
    OR NOT EXISTS (SELECT 1 FROM "User" WHERE "User".id = "Article"."authorId");

  IF orphaned_count > 0 THEN
    RAISE WARNING '[ ] AÇÃO NECESSÁRIA: % artigos órfãos precisam ser removidos ou ter autor atribuído', orphaned_count;
  ELSE
    RAISE NOTICE '[✓] OK: Nenhum artigo órfão encontrado';
  END IF;

  -- Artigos sem categoria
  SELECT COUNT(*) INTO no_category_count
  FROM "Article"
  WHERE category IS NULL OR category = '';

  IF no_category_count > 0 THEN
    RAISE WARNING '[ ] AÇÃO NECESSÁRIA: % artigos sem categoria receberão "Sem Categoria"', no_category_count;
  ELSE
    RAISE NOTICE '[✓] OK: Todos os artigos têm categoria';
  END IF;

  -- Tipos inválidos
  SELECT COUNT(*) INTO invalid_type_count
  FROM "Article"
  WHERE LOWER(type) NOT IN ('news', 'educational');

  IF invalid_type_count > 0 THEN
    RAISE WARNING '[ ] AÇÃO NECESSÁRIA: % artigos com tipo inválido serão convertidos para "news"', invalid_type_count;
  ELSE
    RAISE NOTICE '[✓] OK: Todos os tipos são válidos';
  END IF;
END $$;

\echo ''
\echo '========================================'
\echo 'FIM DO PRE-MIGRATION CHECK'
\echo '========================================'
\echo ''
\echo 'PRÓXIMOS PASSOS:'
\echo '1. Revise os resultados acima'
\echo '2. Resolva quaisquer ações necessárias'
\echo '3. Faça backup completo do banco'
\echo '4. Execute a migração: prisma migrate dev'
\echo '5. Execute data migration: psql < data-migration-v2.sql'
\echo ''
