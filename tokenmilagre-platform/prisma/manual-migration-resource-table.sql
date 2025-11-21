-- Manual migration to create Resource table
-- Run this SQL directly in your database if migration doesn't work
-- Database: PostgreSQL

-- Check if Resource table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Resource') THEN
        -- CreateTable Resource
        CREATE TABLE "Resource" (
            "id" TEXT NOT NULL,
            "slug" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "category" TEXT NOT NULL,
            "verified" BOOLEAN NOT NULL DEFAULT true,
            "shortDescription" TEXT NOT NULL,
            "officialUrl" TEXT NOT NULL,
            "platforms" TEXT NOT NULL,
            "tags" TEXT NOT NULL,
            "heroTitle" TEXT NOT NULL,
            "heroDescription" TEXT NOT NULL,
            "heroGradient" TEXT NOT NULL,
            "whyGoodTitle" TEXT NOT NULL,
            "whyGoodContent" TEXT NOT NULL,
            "features" TEXT NOT NULL,
            "howToStartTitle" TEXT NOT NULL,
            "howToStartSteps" TEXT NOT NULL,
            "pros" TEXT NOT NULL,
            "cons" TEXT NOT NULL,
            "faq" TEXT NOT NULL,
            "securityTips" TEXT NOT NULL,
            "securityAudit" TEXT,
            "securityAuditDate" TIMESTAMP(3),
            "auditedByCommunity" BOOLEAN NOT NULL DEFAULT false,
            "toolConfig" TEXT,
            "interactiveType" TEXT,
            "showCompatibleWallets" BOOLEAN NOT NULL DEFAULT false,
            "relatedResources" TEXT,
            "views" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "lastVerified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
        );

        -- CreateIndex
        CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");
        CREATE INDEX "Resource_slug_idx" ON "Resource"("slug");
        CREATE INDEX "Resource_category_idx" ON "Resource"("category");
        CREATE INDEX "Resource_verified_idx" ON "Resource"("verified");
        CREATE INDEX "Resource_interactiveType_idx" ON "Resource"("interactiveType");

        RAISE NOTICE 'Resource table created successfully';
    ELSE
        RAISE NOTICE 'Resource table already exists, skipping creation';
    END IF;
END $$;
