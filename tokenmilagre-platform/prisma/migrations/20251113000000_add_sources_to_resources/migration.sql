-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "sources" TEXT;

-- Comment
COMMENT ON COLUMN "Resource"."sources" IS 'JSON array: URLs das fontes verificadas (similar to Article.factCheckSources)';
