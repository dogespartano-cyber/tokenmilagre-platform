-- CreateEnum: Novos enums para as fases
CREATE TYPE "WarningLevel" AS ENUM ('info', 'warning', 'critical');
CREATE TYPE "StoryCategory" AS ENUM ('transformation', 'social_project', 'achievement');
CREATE TYPE "ProjectCategory" AS ENUM ('donations', 'microcredit', 'education', 'infrastructure');

-- AlterTable User: Adicionar gamificação (FASE 3)
ALTER TABLE "User" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "badges" TEXT;

-- AlterTable Article: Adicionar novos campos para FASES 1, 2 e 5
ALTER TABLE "Article" ADD COLUMN "warningLevel" "WarningLevel";
ALTER TABLE "Article" ADD COLUMN "securityTips" TEXT;
ALTER TABLE "Article" ADD COLUMN "courseSequence" INTEGER;
ALTER TABLE "Article" ADD COLUMN "relatedArticles" TEXT;
ALTER TABLE "Article" ADD COLUMN "projectHighlight" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Article" ADD COLUMN "quizData" TEXT;

-- Atualizar contentType para aceitar 'Curso'
-- (PostgreSQL permite strings, então não precisa alterar tipo)

-- AlterTable Resource: Adicionar campos de FASES 1 e 4
ALTER TABLE "Resource" ADD COLUMN "securityAudit" TEXT;
ALTER TABLE "Resource" ADD COLUMN "securityAuditDate" TIMESTAMP(3);
ALTER TABLE "Resource" ADD COLUMN "auditedByCommunity" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Resource" ADD COLUMN "toolConfig" TEXT;
ALTER TABLE "Resource" ADD COLUMN "interactiveType" TEXT;

-- CreateTable CommunityStory (FASE 3)
CREATE TABLE "CommunityStory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorAvatar" TEXT,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "StoryCategory" NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable SocialProject (FASE 3)
CREATE TABLE "SocialProject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "fundingGoal" DOUBLE PRECISION NOT NULL,
    "currentFunding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "walletAddress" TEXT,
    "category" "ProjectCategory" NOT NULL,
    "location" TEXT,
    "tags" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "supporters" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "coverImage" TEXT,
    "gallery" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerEmail" TEXT,
    "organizerPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable ProjectMap (FASE 4)
CREATE TABLE "ProjectMap" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Brasil',
    "markerColor" TEXT NOT NULL DEFAULT '#8B5CF6',
    "markerIcon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable UserProgress (FASE 5)
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "quizScore" DOUBLE PRECISION,
    "quizAttempts" INTEGER NOT NULL DEFAULT 0,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "certificateUrl" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityStory_slug_key" ON "CommunityStory"("slug");
CREATE INDEX "CommunityStory_slug_idx" ON "CommunityStory"("slug");
CREATE INDEX "CommunityStory_category_idx" ON "CommunityStory"("category");
CREATE INDEX "CommunityStory_published_idx" ON "CommunityStory"("published");
CREATE INDEX "CommunityStory_featured_idx" ON "CommunityStory"("featured");
CREATE INDEX "CommunityStory_userId_idx" ON "CommunityStory"("userId");

CREATE UNIQUE INDEX "SocialProject_slug_key" ON "SocialProject"("slug");
CREATE INDEX "SocialProject_slug_idx" ON "SocialProject"("slug");
CREATE INDEX "SocialProject_category_idx" ON "SocialProject"("category");
CREATE INDEX "SocialProject_verified_idx" ON "SocialProject"("verified");
CREATE INDEX "SocialProject_active_idx" ON "SocialProject"("active");
CREATE INDEX "SocialProject_featured_idx" ON "SocialProject"("featured");

CREATE UNIQUE INDEX "ProjectMap_projectId_key" ON "ProjectMap"("projectId");
CREATE INDEX "ProjectMap_city_idx" ON "ProjectMap"("city");
CREATE INDEX "ProjectMap_state_idx" ON "ProjectMap"("state");

CREATE UNIQUE INDEX "UserProgress_userId_articleSlug_key" ON "UserProgress"("userId", "articleSlug");
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");
CREATE INDEX "UserProgress_articleSlug_idx" ON "UserProgress"("articleSlug");
CREATE INDEX "UserProgress_completed_idx" ON "UserProgress"("completed");

CREATE INDEX "Article_projectHighlight_idx" ON "Article"("projectHighlight");
CREATE INDEX "Resource_interactiveType_idx" ON "Resource"("interactiveType");

-- AddForeignKey
ALTER TABLE "CommunityStory" ADD CONSTRAINT "CommunityStory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
