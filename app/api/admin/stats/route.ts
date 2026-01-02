import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/shared/helpers/auth-helpers';
import { successResponse, errorResponse } from '@/lib/shared/helpers/response-helpers';
import { ServiceLocator } from '@/lib/di/container';
import { TIME_MS } from '@/lib/constants/time';
import { prisma } from '@/lib/core/prisma';

/**
 * GET /api/admin/stats
 * Returns comprehensive platform statistics
 * Protected: ADMIN only
 *
 * @returns Platform statistics including articles, users, and trends
 */
export async function GET(request: NextRequest) {
  // 1. Authentication & Authorization
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  // 2. Logging context
  const logger = ServiceLocator.getLogger();
  logger.setContext({ endpoint: '/api/admin/stats', method: 'GET', userId: auth.user.id });

  try {
    logger.info('Fetching admin statistics');

    // 3. Get services
    const articleService = ServiceLocator.getArticle();
    const userService = ServiceLocator.getUser();

    // 4. Fetch comprehensive statistics in parallel
    const [articleStats, userStats, weeklyPublished, educationalByLevel] = await Promise.all([
      // Article statistics (using service)
      articleService.getStats(),

      // User statistics (using service)
      userService.getStats(),

      // Published this week (direct Prisma for now - can be moved to service later)
      prisma.article.count({
        where: {
          published: true,
          createdAt: {
            gte: new Date(Date.now() - TIME_MS.WEEK),
          },
        },
      }),

      // Educational articles by level
      prisma.article.groupBy({
        by: ['level'],
        where: {
          type: 'educational',
          published: true,
          level: {
            not: null,
          },
        },
        _count: true,
      }),
    ]);

    // 5. Process educational by level
    const levelCounts = {
      iniciante: 0,
      intermediario: 0,
      avancado: 0,
    };

    educationalByLevel.forEach((item) => {
      if (item.level) {
        levelCounts[item.level as keyof typeof levelCounts] = item._count;
      }
    });

    // 6. Prepare response data
    const stats = {
      // Article statistics
      articles: {
        total: articleStats.total,
        published: articleStats.published,
        draft: articleStats.draft,
        byType: articleStats.byType,
        byCategory: articleStats.byCategory,
        bySentiment: articleStats.bySentiment,
        publishedThisWeek: weeklyPublished,
        educationalByLevel: levelCounts,
      },
      // User statistics
      users: {
        total: userStats.total,
        byRole: userStats.byRole,
        totalPoints: userStats.totalPoints,
        avgPointsPerUser: userStats.avgPointsPerUser,
        withBadges: userStats.withBadges,
      },
    };

    logger.info('Admin statistics fetched successfully', {
      totalArticles: articleStats.total,
      totalUsers: userStats.total,
    });

    // 7. Return standardized response
    return successResponse(stats);
  } catch (error) {
    logger.error('Error fetching admin statistics', error as Error);
    return errorResponse(error as Error);
  } finally {
    logger.clearContext();
  }
}
