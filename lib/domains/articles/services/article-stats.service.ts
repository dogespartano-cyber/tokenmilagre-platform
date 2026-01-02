/**
 * Article Stats Service
 * Handles statistical aggregations for articles
 */

import { prisma } from '@/lib/core/prisma';
import { ServiceLocator } from '@/lib/di/container';
import type { ArticleStats } from '../types';

export class ArticleStatsService {
    private get logger() {
        return ServiceLocator.getLogger();
    }

    /**
     * Get article statistics
     */
    async getStats(): Promise<ArticleStats> {
        this.logger.setContext({ operation: 'article.getStats' });

        try {
            this.logger.info('Fetching article statistics');

            const [
                total,
                published,
                draft,
                byType,
                byCategory,
                bySentiment,
            ] = await Promise.all([
                prisma.article.count(),
                prisma.article.count({ where: { published: true } }),
                prisma.article.count({ where: { published: false } }),
                prisma.article.groupBy({
                    by: ['type'],
                    _count: true,
                }),
                prisma.article.groupBy({
                    by: ['category'],
                    _count: true,
                }),
                prisma.article.groupBy({
                    by: ['sentiment'],
                    _count: true,
                }),
            ]);

            const stats: ArticleStats = {
                total,
                published,
                draft,
                byType: Object.fromEntries(byType.map((t) => [t.type, t._count])),
                byCategory: Object.fromEntries(byCategory.map((c) => [c.category, c._count])),
                bySentiment: Object.fromEntries(bySentiment.map((s) => [s.sentiment, s._count])),
            };

            this.logger.info('Article statistics fetched', stats);

            return stats;
        } catch (error) {
            this.logger.error('Error fetching article statistics', error as Error);
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }
}
