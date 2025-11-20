#!/usr/bin/env tsx
/**
 * Schema Integrity Check
 *
 * Automated script to verify database schema integrity
 * Run daily via CI/CD or manually
 *
 * Usage: npm run check:schema
 */

import { prisma } from '../../lib/prisma';
import { ServiceLocator } from '../../lib/di/container';

const logger = ServiceLocator.getLogger();

interface IntegrityCheck {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

/**
 * Run all integrity checks
 */
async function runIntegrityChecks(): Promise<IntegrityCheck[]> {
  const checks: IntegrityCheck[] = [];

  // Check 1: Database connection
  checks.push(await checkDatabaseConnection());

  // Check 2: Required tables exist
  checks.push(await checkRequiredTables());

  // Check 3: Orphaned records
  checks.push(await checkOrphanedRecords());

  // Check 4: Duplicate slugs
  checks.push(await checkDuplicateSlugs());

  // Check 5: Invalid enum values
  checks.push(await checkInvalidEnums());

  // Check 6: Missing required fields
  checks.push(await checkMissingFields());

  return checks;
}

/**
 * Check database connection
 */
async function checkDatabaseConnection(): Promise<IntegrityCheck> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: 'Database Connection', passed: true };
  } catch (error) {
    return {
      name: 'Database Connection',
      passed: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Check required tables exist
 */
async function checkRequiredTables(): Promise<IntegrityCheck> {
  try {
    const requiredTables = [
      'User',
      'Account',
      'Session',
      'Article',
      'Resource',
      'CommunityStory',
      'SocialProject',
    ];

    for (const table of requiredTables) {
      // Try to count records in each table
      const model = (prisma as any)[table.charAt(0).toLowerCase() + table.slice(1)];
      if (!model) {
        throw new Error(`Table ${table} not found in Prisma client`);
      }
      await model.count();
    }

    return { name: 'Required Tables', passed: true, details: { tables: requiredTables } };
  } catch (error) {
    return {
      name: 'Required Tables',
      passed: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Check for orphaned article records
 */
async function checkOrphanedRecords(): Promise<IntegrityCheck> {
  try {
    // Find articles with non-existent authors
    const orphanedArticles = await prisma.$queryRaw<any[]>`
      SELECT a.id, a.title, a.authorId
      FROM "Article" a
      LEFT JOIN "User" u ON a.authorId = u.id
      WHERE u.id IS NULL
    `;

    if (orphanedArticles.length > 0) {
      return {
        name: 'Orphaned Records',
        passed: false,
        error: `Found ${orphanedArticles.length} articles with invalid authorId`,
        details: { orphanedArticles },
      };
    }

    return { name: 'Orphaned Records', passed: true };
  } catch (error) {
    return {
      name: 'Orphaned Records',
      passed: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Check for duplicate article slugs
 */
async function checkDuplicateSlugs(): Promise<IntegrityCheck> {
  try {
    const duplicates = await prisma.$queryRaw<any[]>`
      SELECT slug, COUNT(*) as count
      FROM "Article"
      GROUP BY slug
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length > 0) {
      return {
        name: 'Duplicate Slugs',
        passed: false,
        error: `Found ${duplicates.length} duplicate slugs`,
        details: { duplicates },
      };
    }

    return { name: 'Duplicate Slugs', passed: true };
  } catch (error) {
    return {
      name: 'Duplicate Slugs',
      passed: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Check for invalid enum values
 */
async function checkInvalidEnums(): Promise<IntegrityCheck> {
  try {
    const validRoles = ['ADMIN', 'EDITOR', 'VIEWER'];
    const validSentiments = ['positive', 'neutral', 'negative'];

    // Check user roles
    const invalidRoles = await prisma.$queryRaw<any[]>`
      SELECT id, email, role
      FROM "User"
      WHERE role NOT IN (${validRoles.map(r => `'${r}'`).join(',')})
    `;

    // Check article sentiments
    const invalidSentiments = await prisma.$queryRaw<any[]>`
      SELECT id, title, sentiment
      FROM "Article"
      WHERE sentiment IS NOT NULL
        AND sentiment NOT IN (${validSentiments.map(s => `'${s}'`).join(',')})
    `;

    if (invalidRoles.length > 0 || invalidSentiments.length > 0) {
      return {
        name: 'Invalid Enum Values',
        passed: false,
        error: `Found ${invalidRoles.length} invalid roles and ${invalidSentiments.length} invalid sentiments`,
        details: { invalidRoles, invalidSentiments },
      };
    }

    return { name: 'Invalid Enum Values', passed: true };
  } catch (error) {
    return {
      name: 'Invalid Enum Values',
      passed: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Check for missing required fields
 */
async function checkMissingFields(): Promise<IntegrityCheck> {
  try {
    // Check articles with missing required fields
    const articlesWithMissingFields = await prisma.article.findMany({
      where: {
        OR: [
          { title: { equals: '' } },
          { slug: { equals: '' } },
          { content: { equals: '' } },
          { category: { equals: '' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (articlesWithMissingFields.length > 0) {
      return {
        name: 'Missing Required Fields',
        passed: false,
        error: `Found ${articlesWithMissingFields.length} articles with missing required fields`,
        details: { articlesWithMissingFields },
      };
    }

    return { name: 'Missing Required Fields', passed: true };
  } catch (error) {
    return {
      name: 'Missing Required Fields',
      passed: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Running Schema Integrity Checks...\n');

  logger.setContext({ script: 'check-schema-integrity' });

  try {
    const checks = await runIntegrityChecks();

    const passed = checks.filter(c => c.passed).length;
    const failed = checks.filter(c => !c.passed).length;

    console.log('═══════════════════════════════════════════════════════\n');

    for (const check of checks) {
      const icon = check.passed ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);

      if (!check.passed) {
        console.log(`   Error: ${check.error}`);
        if (check.details) {
          console.log(`   Details: ${JSON.stringify(check.details, null, 2)}`);
        }
      }

      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`Results: ${passed} passed, ${failed} failed\n`);

    if (failed > 0) {
      logger.error('Schema integrity check failed', new Error(`${failed} checks failed`), { checks });
      process.exit(1);
    } else {
      logger.info('Schema integrity check passed', { checks });
      console.log('✅ All integrity checks passed!\n');
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error running integrity checks', error as Error);
    console.error('\n❌ Error running integrity checks:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    logger.clearContext();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { runIntegrityChecks };
