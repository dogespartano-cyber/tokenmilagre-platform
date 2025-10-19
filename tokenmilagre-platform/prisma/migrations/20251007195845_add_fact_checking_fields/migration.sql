-- AlterTable
ALTER TABLE "Article" ADD COLUMN "factCheckDate" DATETIME;
ALTER TABLE "Article" ADD COLUMN "factCheckScore" REAL;
ALTER TABLE "Article" ADD COLUMN "factCheckSources" TEXT;
ALTER TABLE "Article" ADD COLUMN "factCheckStatus" TEXT;
