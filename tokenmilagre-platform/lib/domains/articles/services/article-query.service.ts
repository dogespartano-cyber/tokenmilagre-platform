/**
 * Article Query Service
 * Handles listing, filtering, and searching articles
 */

import { prisma } from '@/lib/core/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { ServiceLocator } from '@/lib/di/container';
import { PAGINATION } from '@/lib/constants/pagination';
import type { ArticleQueryCurrent as ArticleQuery } from '@/lib/schemas/article-schemas';
import type { ArticleListResult } from '../types';

export class ArticleQueryService {
    private get logger() {
        return ServiceLocator.getLogger();
    }

    /**
     * List articles with pagination and filters
     */
    async list(query: Partial<ArticleQuery> = {}): Promise<ArticleListResult> {
        const page = Number(query.page ?? PAGINATION.DEFAULT_PAGE);
        const limit = Math.min(Number(query.limit ?? PAGINATION.DEFAULT_LIMIT), PAGINATION.MAX_LIMIT);
        const skip = (page - 1) * limit;

        this.logger.setContext({ operation: 'article.list', page, limit });

        try {
            // Build where clause
            const where: Prisma.ArticleWhereInput = {};

            if (query.published !== undefined) {
                where.published = String(query.published) === 'true';
            }

            if (query.type) {
                where.type = query.type;
            }

            if ((query as any).status) {
                (where as any).status = (query as any).status;
            }

            if (query.category) {
                where.category = query.category;
            }

            if (query.authorId) {
                where.authorId = query.authorId;
            }

            if (query.search) {
                where.OR = [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { content: { contains: query.search, mode: 'insensitive' } },
                    { excerpt: { contains: query.search, mode: 'insensitive' } },
                ];
            }

            if (query.sentiment) {
                where.sentiment = query.sentiment;
            }

            if (query.level) {
                where.level = query.level;
            }

            if (query.projectHighlight !== undefined) {
                where.projectHighlight = String(query.projectHighlight) === 'true';
            }

            // Build orderBy
            const orderBy: Prisma.ArticleOrderByWithRelationInput = {};
            if (query.sortBy) {
                (orderBy as any)[query.sortBy] = query.sortOrder || 'desc';
            } else {
                orderBy.createdAt = 'desc';
            }

            // Execute queries in parallel
            const [articles, total] = await Promise.all([
                prisma.article.findMany({
                    where,
                    orderBy,
                    skip,
                    take: limit,
                    include: {
                        author: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                }),
                prisma.article.count({ where }),
            ]);

            const totalPages = Math.ceil(total / limit);
            const hasMore = page < totalPages;

            this.logger.info('Articles listed successfully', {
                count: articles.length,
                total,
                page,
                totalPages,
            });

            return {
                articles,
                total,
                page,
                limit,
                totalPages,
                hasMore,
            };
        } catch (error) {
            this.logger.error('Error listing articles', error as Error, { page, limit });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }
}
