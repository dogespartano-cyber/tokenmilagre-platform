CREATE TABLE IF NOT EXISTS "Citation" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "domain" TEXT,
    "articleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Citation_articleId_idx" ON "Citation"("articleId");

CREATE INDEX IF NOT EXISTS "Citation_domain_idx" ON "Citation"("domain");

ALTER TABLE "Citation"
ADD CONSTRAINT "Citation_articleId_fkey"
FOREIGN KEY ("articleId")
REFERENCES "Article"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
