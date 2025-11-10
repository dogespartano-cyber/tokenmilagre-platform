---
name: tokenmilagre-scripts
description: "Utility scripts and automation patterns (data migration, bulk processing). TRIGGERS: 'script', 'automação', 'migration script', 'bulk processing', 'data processing', 'utility'. Use when building scripts for data processing, database operations, content migration, platform automation, maintenance tasks."
license: MIT
---

# Token Milagre - Scripts & Automation Guide

Complete guide for creating utility scripts and automation tools for the Token Milagre Platform.

## Purpose

Provide standardized patterns for building scripts that automate common tasks, process data, perform migrations, and maintain platform health.

## When to Use This Skill

Use this skill when:
- Creating data migration scripts
- Building automation tools
- Processing bulk data
- Generating reports
- Performing database maintenance
- Importing/exporting content
- Analyzing codebase metrics
- Setting up scheduled tasks

## Script Types

### 1. Data Migration Scripts
### 2. Analysis & Reporting Scripts
### 3. Content Processing Scripts
### 4. Database Maintenance Scripts
### 5. Deployment & Build Scripts

## Script Structure Template

```typescript
#!/usr/bin/env ts-node
/**
 * Script Name: my-script.ts
 * Purpose: Brief description of what this script does
 * Usage: npx ts-node scripts/my-script.ts [options]
 *
 * Examples:
 *   npx ts-node scripts/my-script.ts --dry-run
 *   npx ts-node scripts/my-script.ts --limit 100
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
interface ScriptConfig {
  dryRun: boolean;
  limit?: number;
  verbose: boolean;
}

// Parse CLI arguments
function parseArgs(): ScriptConfig {
  const args = process.argv.slice(2);

  return {
    dryRun: args.includes('--dry-run'),
    limit: args.includes('--limit')
      ? parseInt(args[args.indexOf('--limit') + 1])
      : undefined,
    verbose: args.includes('--verbose') || args.includes('-v')
  };
}

// Main script logic
async function main() {
  const config = parseArgs();

  console.log('🚀 Starting script...');
  console.log('Config:', config);

  try {
    // Script operations here
    const result = await performOperation(config);

    console.log('\n✅ Script completed successfully');
    console.log('Result:', result);

  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
}

async function performOperation(config: ScriptConfig) {
  // Implementation here
  return { success: true };
}

// Execute script
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Real-World Script Examples

### Example 1: Bulk Article Import

```typescript
#!/usr/bin/env ts-node
/**
 * Import articles from JSON file
 * Usage: npx ts-node scripts/import-articles.ts articles.json [--dry-run]
 */

import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface ImportArticle {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  published?: boolean;
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: Array<{ title: string; error: string }>;
}

async function importArticles(
  filePath: string,
  dryRun: boolean = false
): Promise<ImportResult> {
  const result: ImportResult = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: []
  };

  // Read JSON file
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const articles: ImportArticle[] = JSON.parse(fileContent);
  result.total = articles.length;

  console.log(`📄 Found ${articles.length} articles to import`);

  // Get or create admin user for authorship
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tokenmilagre.com' },
    update: {},
    create: {
      email: 'admin@tokenmilagre.com',
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  // Import each article
  for (const article of articles) {
    try {
      // Generate slug
      const slug = generateSlug(article.title);

      // Check if already exists
      const existing = await prisma.article.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`⏭️  Skipping "${article.title}" (already exists)`);
        result.skipped++;
        continue;
      }

      if (dryRun) {
        console.log(`[DRY RUN] Would import: "${article.title}"`);
      } else {
        // Create article
        const articleData: Prisma.ArticleCreateInput = {
          title: article.title,
          slug,
          content: article.content,
          excerpt: article.content.substring(0, 200) + '...',
          type: 'educational',
          category: article.category,
          published: article.published ?? false,
          tags: article.tags ? JSON.stringify(article.tags) : null,
          author: {
            connect: { id: adminUser.id }
          }
        };

        await prisma.article.create({ data: articleData });
        console.log(`✅ Imported: "${article.title}"`);
      }

      result.imported++;

    } catch (error) {
      console.error(`❌ Failed to import "${article.title}":`, error);
      result.errors.push({
        title: article.title,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return result;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Usage: npx ts-node scripts/import-articles.ts <file.json> [--dry-run]');
    process.exit(1);
  }

  const filePath = args[0];
  const dryRun = args.includes('--dry-run');

  console.log('📦 Import Articles Script');
  console.log('File:', filePath);
  console.log('Dry run:', dryRun);
  console.log('');

  const result = await importArticles(filePath, dryRun);

  console.log('\n📊 Import Summary:');
  console.log(`Total articles: ${result.total}`);
  console.log(`Imported: ${result.imported}`);
  console.log(`Skipped: ${result.skipped}`);
  console.log(`Errors: ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(({ title, error }) => {
      console.log(`  - "${title}": ${error}`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Example 2: Generate SEO Metadata for Existing Articles

```typescript
#!/usr/bin/env ts-node
/**
 * Generate SEO metadata for articles missing it
 * Usage: npx ts-node scripts/generate-seo-metadata.ts [--limit N] [--dry-run]
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SEOMetadata {
  keywords: string[];
  metaDescription: string;
}

async function generateSEOMetadata(content: string, title: string, category: string): Promise<SEOMetadata> {
  // Extract keywords (simplified - in production, use NLP)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4);

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Get top keywords
  const keywords = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  // Add category as keyword
  keywords.unshift(category);

  // Generate meta description (first 150 chars of content)
  const cleanContent = content
    .replace(/[#*`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  let metaDescription = cleanContent.substring(0, 147);
  if (cleanContent.length > 147) {
    metaDescription += '...';
  }

  return { keywords, metaDescription };
}

async function main() {
  const args = process.argv.slice(2);
  const limit = args.includes('--limit')
    ? parseInt(args[args.indexOf('--limit') + 1])
    : 50;
  const dryRun = args.includes('--dry-run');

  console.log('🔍 Generate SEO Metadata Script');
  console.log('Limit:', limit);
  console.log('Dry run:', dryRun);
  console.log('');

  // Find articles without keywords
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { keywords: null },
        { keywords: '' }
      ]
    },
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      slug: true
    }
  });

  console.log(`📄 Found ${articles.length} articles without SEO metadata\n`);

  let updated = 0;

  for (const article of articles) {
    try {
      const seo = await generateSEOMetadata(
        article.content,
        article.title,
        article.category
      );

      console.log(`Processing: "${article.title}"`);
      console.log(`  Keywords: ${seo.keywords.slice(0, 5).join(', ')}...`);
      console.log(`  Meta: ${seo.metaDescription.substring(0, 50)}...`);

      if (!dryRun) {
        await prisma.article.update({
          where: { id: article.id },
          data: {
            keywords: JSON.stringify(seo.keywords)
            // Could also update excerpt with metaDescription
          }
        });
      }

      updated++;
    } catch (error) {
      console.error(`❌ Failed for "${article.title}":`, error);
    }
  }

  console.log(`\n✅ Updated ${updated}/${articles.length} articles`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Example 3: Calculate Fact-Check Scores

```typescript
#!/usr/bin/env ts-node
/**
 * Calculate and update fact-check scores for all articles
 * Usage: npx ts-node scripts/calculate-fact-scores.ts [--dry-run]
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FactCheckResult {
  score: number;
  status: 'verified' | 'partial' | 'unverified';
  citationCount: number;
}

function calculateFactCheckScore(factCheckSources: string | null): FactCheckResult {
  if (!factCheckSources) {
    return {
      score: 0,
      status: 'unverified',
      citationCount: 0
    };
  }

  const citations = JSON.parse(factCheckSources);
  const citationCount = citations.length;

  // Quality domains
  const qualityDomains = [
    'coindesk.com',
    'cointelegraph.com',
    'decrypt.co',
    'theblock.co'
  ];

  const qualitySources = citations.filter((c: any) =>
    qualityDomains.some(domain => c.url?.includes(domain))
  ).length;

  // Calculate score
  let score = 0;

  // Citation count (0-50 points)
  if (citationCount >= 5) score += 50;
  else if (citationCount >= 3) score += 35;
  else if (citationCount >= 1) score += 20;

  // Quality ratio (0-50 points)
  const qualityRatio = qualitySources / Math.max(citationCount, 1);
  score += Math.round(qualityRatio * 50);

  // Determine status
  let status: 'verified' | 'partial' | 'unverified';
  if (score >= 70) status = 'verified';
  else if (score >= 40) status = 'partial';
  else status = 'unverified';

  return { score, status, citationCount };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🔬 Calculate Fact-Check Scores');
  console.log('Dry run:', dryRun);
  console.log('');

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      factCheckSources: true,
      factCheckScore: true
    }
  });

  console.log(`📄 Processing ${articles.length} articles\n`);

  let updated = 0;
  const stats = {
    verified: 0,
    partial: 0,
    unverified: 0
  };

  for (const article of articles) {
    const result = calculateFactCheckScore(article.factCheckSources);

    console.log(`${article.title.substring(0, 50)}...`);
    console.log(`  Score: ${result.score} (${result.status})`);
    console.log(`  Citations: ${result.citationCount}`);

    stats[result.status]++;

    if (!dryRun && result.score !== article.factCheckScore) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          factCheckScore: result.score,
          factCheckStatus: result.status
        }
      });
      updated++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`Updated: ${updated}/${articles.length}`);
  console.log(`Verified: ${stats.verified}`);
  console.log(`Partial: ${stats.partial}`);
  console.log(`Unverified: ${stats.unverified}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Example 4: Database Cleanup

```typescript
#!/usr/bin/env ts-node
/**
 * Clean up old/orphaned data
 * Usage: npx ts-node scripts/cleanup-database.ts [--dry-run]
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CleanupResult {
  orphanedActivities: number;
  oldDrafts: number;
  emptyResources: number;
}

async function cleanup(dryRun: boolean): Promise<CleanupResult> {
  const result: CleanupResult = {
    orphanedActivities: 0,
    oldDrafts: 0,
    emptyResources: 0
  };

  console.log('🧹 Starting cleanup...\n');

  // 1. Remove orphaned copilot activities (user deleted)
  console.log('1️⃣ Checking for orphaned activities...');
  const orphanedCount = await prisma.copilotActivity.count({
    where: {
      user: null
    }
  });

  if (orphanedCount > 0) {
    console.log(`   Found ${orphanedCount} orphaned activities`);
    if (!dryRun) {
      await prisma.copilotActivity.deleteMany({
        where: { user: null }
      });
      console.log('   ✅ Deleted');
    }
    result.orphanedActivities = orphanedCount;
  } else {
    console.log('   ✅ No orphaned activities');
  }

  // 2. Remove old unpublished drafts (>90 days)
  console.log('\n2️⃣ Checking for old drafts...');
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const oldDrafts = await prisma.article.count({
    where: {
      published: false,
      createdAt: {
        lt: ninetyDaysAgo
      }
    }
  });

  if (oldDrafts > 0) {
    console.log(`   Found ${oldDrafts} old unpublished drafts`);
    if (!dryRun) {
      await prisma.article.deleteMany({
        where: {
          published: false,
          createdAt: { lt: ninetyDaysAgo }
        }
      });
      console.log('   ✅ Deleted');
    }
    result.oldDrafts = oldDrafts;
  } else {
    console.log('   ✅ No old drafts');
  }

  // 3. Remove resources without title
  console.log('\n3️⃣ Checking for invalid resources...');
  const emptyResources = await prisma.resource.count({
    where: {
      OR: [
        { title: '' },
        { title: null },
        { url: '' },
        { url: null }
      ]
    }
  });

  if (emptyResources > 0) {
    console.log(`   Found ${emptyResources} invalid resources`);
    if (!dryRun) {
      await prisma.resource.deleteMany({
        where: {
          OR: [
            { title: '' },
            { title: null },
            { url: '' },
            { url: null }
          ]
        }
      });
      console.log('   ✅ Deleted');
    }
    result.emptyResources = emptyResources;
  } else {
    console.log('   ✅ No invalid resources');
  }

  return result;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🗑️  Database Cleanup Script');
  console.log('Dry run:', dryRun);
  console.log('');

  const result = await cleanup(dryRun);

  console.log('\n📊 Cleanup Summary:');
  console.log(`Orphaned activities: ${result.orphanedActivities}`);
  console.log(`Old drafts: ${result.oldDrafts}`);
  console.log(`Invalid resources: ${result.emptyResources}`);
  console.log(`Total items: ${Object.values(result).reduce((a, b) => a + b, 0)}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Example 5: Generate Analytics Report

```typescript
#!/usr/bin/env ts-node
/**
 * Generate platform analytics report
 * Usage: npx ts-node scripts/generate-report.ts [--format json|markdown]
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface AnalyticsReport {
  timestamp: string;
  articles: {
    total: number;
    published: number;
    drafts: number;
    byCategory: Record<string, number>;
    avgFactScore: number;
  };
  users: {
    total: number;
    admins: number;
    editors: number;
  };
  copilot: {
    totalActivities: number;
    activitiesLast30Days: number;
    topTools: Array<{ tool: string; count: number }>;
  };
}

async function generateReport(): Promise<AnalyticsReport> {
  // Articles stats
  const totalArticles = await prisma.article.count();
  const publishedArticles = await prisma.article.count({
    where: { published: true }
  });

  const categoryBreakdown = await prisma.article.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } }
  });

  const byCategory: Record<string, number> = {};
  categoryBreakdown.forEach(item => {
    byCategory[item.category] = item._count.category;
  });

  const avgScore = await prisma.article.aggregate({
    _avg: { factCheckScore: true },
    where: { factCheckScore: { not: null } }
  });

  // Users stats
  const totalUsers = await prisma.user.count();
  const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
  const editors = await prisma.user.count({ where: { role: 'EDITOR' } });

  // Copilot stats
  const totalActivities = await prisma.copilotActivity.count();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentActivities = await prisma.copilotActivity.count({
    where: { timestamp: { gte: thirtyDaysAgo } }
  });

  const topTools = await prisma.copilotActivity.groupBy({
    by: ['toolName'],
    _count: { toolName: true },
    orderBy: { _count: { toolName: 'desc' } },
    take: 5
  });

  return {
    timestamp: new Date().toISOString(),
    articles: {
      total: totalArticles,
      published: publishedArticles,
      drafts: totalArticles - publishedArticles,
      byCategory,
      avgFactScore: avgScore._avg.factCheckScore || 0
    },
    users: {
      total: totalUsers,
      admins,
      editors
    },
    copilot: {
      totalActivities,
      activitiesLast30Days: recentActivities,
      topTools: topTools.map(t => ({
        tool: t.toolName,
        count: t._count.toolName
      }))
    }
  };
}

function formatMarkdown(report: AnalyticsReport): string {
  return `# Token Milagre Platform - Analytics Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}

## 📊 Articles

- **Total Articles:** ${report.articles.total}
- **Published:** ${report.articles.published}
- **Drafts:** ${report.articles.drafts}
- **Avg Fact-Check Score:** ${report.articles.avgFactScore.toFixed(1)}

### By Category

${Object.entries(report.articles.byCategory)
  .map(([cat, count]) => `- **${cat}:** ${count}`)
  .join('\n')}

## 👥 Users

- **Total Users:** ${report.users.total}
- **Admins:** ${report.users.admins}
- **Editors:** ${report.users.editors}

## 🤖 Copilot Usage

- **Total Activities:** ${report.copilot.totalActivities}
- **Last 30 Days:** ${report.copilot.activitiesLast30Days}

### Top Tools

${report.copilot.topTools
  .map((t, i) => `${i + 1}. **${t.tool}:** ${t.count} uses`)
  .join('\n')}
`;
}

async function main() {
  const args = process.argv.slice(2);
  const format = args.includes('--format')
    ? args[args.indexOf('--format') + 1]
    : 'markdown';

  console.log('📈 Generating analytics report...\n');

  const report = await generateReport();

  if (format === 'json') {
    const json = JSON.stringify(report, null, 2);
    console.log(json);
    await fs.writeFile('report.json', json);
    console.log('\n✅ Saved to report.json');
  } else {
    const markdown = formatMarkdown(report);
    console.log(markdown);
    await fs.writeFile('report.md', markdown);
    console.log('\n✅ Saved to report.md');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Script Patterns Library

### Pattern 1: Progress Indicator

```typescript
function createProgressBar(current: number, total: number, width: number = 40): string {
  const percentage = (current / total) * 100;
  const filled = Math.round((width * current) / total);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${current}/${total} (${percentage.toFixed(1)}%)`;
}

// Usage
for (let i = 0; i < items.length; i++) {
  process.stdout.write(`\r${createProgressBar(i + 1, items.length)}`);
  await processItem(items[i]);
}
console.log(); // New line after completion
```

### Pattern 2: Batch Processing

```typescript
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    );
    results.push(...batchResults);

    console.log(`Processed ${Math.min(i + batchSize, items.length)}/${items.length}`);
  }

  return results;
}
```

### Pattern 3: Error Collection

```typescript
interface ProcessResult<T> {
  success: T[];
  failed: Array<{ item: any; error: string }>;
}

async function processWithErrorCollection<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<ProcessResult<R>> {
  const result: ProcessResult<R> = {
    success: [],
    failed: []
  };

  for (const item of items) {
    try {
      const processed = await processor(item);
      result.success.push(processed);
    } catch (error) {
      result.failed.push({
        item,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return result;
}
```

## Best Practices

1. **Always include --dry-run option** - Let users preview changes
2. **Log progress clearly** - Show what's happening
3. **Handle errors gracefully** - Don't crash on single failure
4. **Use transactions** - For multi-step database operations
5. **Validate inputs** - Check arguments before processing
6. **Provide examples** - Show usage in comments
7. **Make scripts idempotent** - Safe to run multiple times
8. **Clean up resources** - Disconnect from database
9. **Add progress indicators** - For long-running operations
10. **Generate reports** - Summarize what was done

## Related Skills

- `tokenmilagre-database` - Database operations
- `tokenmilagre-content-quality` - Content processing
- `project-context` - Platform architecture

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
