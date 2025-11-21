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

-- CreateIndex
CREATE INDEX "Resource_slug_idx" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");

-- CreateIndex
CREATE INDEX "Resource_verified_idx" ON "Resource"("verified");

-- CreateIndex: interactiveType index (added in FASE 1.4 but need to create if table doesn't exist)
CREATE INDEX "Resource_interactiveType_idx" ON "Resource"("interactiveType");
