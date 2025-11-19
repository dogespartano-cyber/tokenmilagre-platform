-- Migração: Converter enums ArticleStatus e ArticleType para text
-- Data: 2025-11-18
-- Motivo: Incompatibilidade entre schema v2 (String) e banco (enum)

BEGIN;

-- Converter coluna status de enum para text
ALTER TABLE "Article"
  ALTER COLUMN "status" TYPE text
  USING status::text;

-- Deletar enum ArticleStatus (não é mais usado)
DROP TYPE IF EXISTS "ArticleStatus";

-- Converter coluna type para text (se ainda estiver como enum)
-- Verificar primeiro se já não é text
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Article'
    AND column_name = 'type'
    AND udt_name = 'ArticleType'
  ) THEN
    ALTER TABLE "Article"
      ALTER COLUMN "type" TYPE text
      USING type::text;
  END IF;
END $$;

-- Deletar enum ArticleType (não é mais usado)
DROP TYPE IF EXISTS "ArticleType";

-- Deletar outros enums não usados (sentiment, level, contentType)
DROP TYPE IF EXISTS "Sentiment";
DROP TYPE IF EXISTS "Level";
DROP TYPE IF EXISTS "ContentType";

COMMIT;
