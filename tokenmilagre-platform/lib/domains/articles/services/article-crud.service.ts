/**
 * Article CRUD Service
 * Handles Create, Read, Update, Delete operations
 */

import { prisma } from '@/lib/core/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { ServiceLocator } from '@/lib/core/di/container';
import { NotFoundError, ConflictError } from '@/lib/shared/services/error.service';
import type {
    ArticleCreateInputCurrent as ArticleCreateInput,
    ArticleUpdateInputCurrent as ArticleUpdateInput,
} from '@/lib/schemas/article-schemas';
import type { ArticleWithRelations } from '../types';

export class ArticleCrudService {
    private get logger() {
        return ServiceLocator.getLogger();
    }

    private get validation() {
        return ServiceLocator.getValidation();
    }

    /**
     * Create a new article
     */
    async create(data: ArticleCreateInput, userId: string): Promise<ArticleWithRelations> {
        this.logger.setContext({ operation: 'article.create', userId, slug: data.slug });

        try {
            this.logger.info('Creating article', { title: data.title, type: data.type });

            // Check slug uniqueness
            const existing = await prisma.article.findUnique({
                where: { slug: data.slug },
                select: { id: true },
            });

            if (existing) {
                throw new ConflictError(`Article with slug "${data.slug}" already exists`);
            }

            // Verify relationships
            if (data.categoryId || data.tagIds || data.relatedArticleIds) {
                await this.verifyRelationships({
                    categoryId: data.categoryId,
                    tagIds: data.tagIds,
                    relatedArticleIds: data.relatedArticleIds,
                });
            }

            // Auto-calculate readTime
            let readTime: string;
            if (data.readTime) {
                readTime = typeof data.readTime === 'number'
                    ? `${data.readTime} min`
                    : data.readTime;
            } else {
                const minutes = this.validation.calculateReadTime(data.content);
                readTime = `${minutes} min`;
            }

            // Sanitize content
            const sanitizedContent = this.validation.sanitizeHtml(data.content);

            // Prepare tags array
            const tagsArray = data.tagIds || data.tags || [];

            // Create article data object
            const createData: any = {
                title: data.title,
                slug: data.slug,
                content: sanitizedContent,
                type: data.type || 'news',
                excerpt: data.excerpt,
                published: data.published ?? false,
                authorId: data.authorId || userId,
                category: data.category,
                tags: JSON.stringify(tagsArray),
                sentiment: data.sentiment || 'neutral',
                level: data.level,
                contentType: data.contentType,
                readTime,
                warningLevel: data.warningLevel,
                securityTips: data.securityTips ? JSON.stringify(data.securityTips) : null,
                coverImage: data.coverImage,
                coverImageAlt: data.coverImageAlt,
                relatedArticles: data.relatedArticles ? JSON.stringify(data.relatedArticles) : null,
                projectHighlight: data.projectHighlight ?? false,
                factCheckScore: data.factCheckScore,
                factCheckSources: data.factCheckSources ? JSON.stringify(data.factCheckSources) : null,
                factCheckDate: data.factCheckDate,
                factCheckStatus: data.factCheckStatus,
                quizData: data.quizData ? (typeof data.quizData === 'string' ? data.quizData : JSON.stringify(data.quizData)) : null,
            };

            // Add citations
            if (data.citations && data.citations.length > 0) {
                createData.citations = {
                    create: data.citations.map((citation, index) => {
                        const normalized = this.validation.normalizeCitation(citation);
                        return {
                            url: normalized.url,
                            title: normalized.title,
                            domain: normalized.domain,
                            order: citation.order ?? index,
                            verified: citation.verified ?? false,
                        };
                    }),
                };
            }

            const article = await prisma.article.create({
                data: createData,
                include: {
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            this.logger.info('Article created successfully', { articleId: article.id, slug: article.slug });

            return article;
        } catch (error) {
            this.logger.error('Error creating article', error as Error, { slug: data.slug });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }

    /**
     * Get article by ID
     */
    async getById(id: string): Promise<ArticleWithRelations> {
        this.logger.setContext({ operation: 'article.getById', id });

        try {
            const article = await prisma.article.findUnique({
                where: { id },
                include: {
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            if (!article) {
                throw new NotFoundError(`Article with ID "${id}" not found`);
            }

            this.logger.info('Article found by ID', { id, slug: article.slug });
            return article;
        } catch (error) {
            this.logger.error('Error getting article by ID', error as Error, { id });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }

    /**
     * Get article by slug
     */
    async getBySlug(slug: string): Promise<ArticleWithRelations> {
        this.logger.setContext({ operation: 'article.getBySlug', slug });

        try {
            const article = await prisma.article.findUnique({
                where: { slug },
                include: {
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            if (!article) {
                throw new NotFoundError(`Article with slug "${slug}" not found`);
            }

            this.logger.info('Article found by slug', { id: article.id, slug });
            return article;
        } catch (error) {
            this.logger.error('Error getting article by slug', error as Error, { slug });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }

    /**
     * Update article
     */
    async update(
        id: string,
        data: Partial<ArticleUpdateInput>,
        userId: string
    ): Promise<ArticleWithRelations> {
        this.logger.setContext({ operation: 'article.update', id, userId });

        try {
            this.logger.info('Updating article', { id, fields: Object.keys(data) });

            // Check if article exists
            const existing = await prisma.article.findUnique({
                where: { id },
                select: { id: true, slug: true },
            });

            if (!existing) {
                throw new NotFoundError(`Article with ID "${id}" not found`);
            }

            // Verify relationships
            if (data.categoryId || data.tagIds || data.relatedArticleIds) {
                await this.verifyRelationships({
                    categoryId: data.categoryId,
                    tagIds: data.tagIds,
                    relatedArticleIds: data.relatedArticleIds,
                });
            }

            // Check slug uniqueness
            if (data.slug && data.slug !== existing.slug) {
                const slugExists = await prisma.article.findUnique({
                    where: { slug: data.slug },
                    select: { id: true },
                });

                if (slugExists) {
                    throw new ConflictError(`Article with slug "${data.slug}" already exists`);
                }
            }

            // Prepare update data
            const updateData: Prisma.ArticleUpdateInput = {};

            if (data.title !== undefined) updateData.title = data.title;
            if (data.slug !== undefined) updateData.slug = data.slug;
            if (data.content !== undefined) {
                updateData.content = this.validation.sanitizeHtml(data.content);
                if (data.readTime === undefined) {
                    const minutes = this.validation.calculateReadTime(data.content);
                    updateData.readTime = `${minutes} min`;
                }
            }
            if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
            if (data.type !== undefined) updateData.type = data.type;
            if (data.published !== undefined) updateData.published = data.published;
            if (data.category !== undefined) updateData.category = data.category;
            if (data.categoryId !== undefined) updateData.category = data.categoryId;

            if (data.tagIds !== undefined) {
                updateData.tags = JSON.stringify(data.tagIds);
            } else if (data.tags !== undefined) {
                updateData.tags = JSON.stringify(data.tags);
            }
            if (data.sentiment !== undefined) updateData.sentiment = data.sentiment;
            if (data.level !== undefined) updateData.level = data.level;
            if (data.contentType !== undefined) updateData.contentType = data.contentType;
            if (data.readTime !== undefined) {
                updateData.readTime = typeof data.readTime === 'number'
                    ? `${data.readTime} min`
                    : data.readTime;
            }
            if (data.warningLevel !== undefined) updateData.warningLevel = data.warningLevel;
            if (data.securityTips !== undefined) {
                updateData.securityTips = JSON.stringify(data.securityTips);
            }
            if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
            if (data.coverImageAlt !== undefined) updateData.coverImageAlt = data.coverImageAlt;
            if (data.relatedArticles !== undefined) {
                updateData.relatedArticles = JSON.stringify(data.relatedArticles);
            }
            if (data.projectHighlight !== undefined) updateData.projectHighlight = data.projectHighlight;
            if (data.factCheckScore !== undefined) updateData.factCheckScore = data.factCheckScore;
            if (data.factCheckSources !== undefined) {
                updateData.factCheckSources = JSON.stringify(data.factCheckSources);
            }
            if (data.factCheckDate !== undefined) updateData.factCheckDate = data.factCheckDate;
            if (data.factCheckStatus !== undefined) updateData.factCheckStatus = data.factCheckStatus;
            if (data.quizData !== undefined) {
                updateData.quizData = data.quizData ? (typeof data.quizData === 'string' ? data.quizData : JSON.stringify(data.quizData)) : null;
            }

            if (data.relatedArticleIds !== undefined) {
                updateData.relatedArticles = JSON.stringify(data.relatedArticleIds);
            }

            // Update citations if provided
            if (data.citations) {
                updateData.citations = {
                    deleteMany: {},
                    create: data.citations.map((citation, index) => {
                        const normalized = this.validation.normalizeCitation(citation);
                        return {
                            url: normalized.url,
                            title: normalized.title,
                            domain: normalized.domain,
                            order: citation.order ?? index,
                            verified: citation.verified ?? false,
                        };
                    }),
                };
            }

            const article = await prisma.article.update({
                where: { id },
                data: updateData,
                include: {
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            this.logger.info('Article updated successfully', { id, slug: article.slug });
            return article;
        } catch (error) {
            this.logger.error('Error updating article', error as Error, { id });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }

    /**
     * Delete article
     */
    async delete(id: string, userId: string): Promise<void> {
        this.logger.setContext({ operation: 'article.delete', id, userId });

        try {
            this.logger.info('Deleting article', { id });

            const article = await prisma.article.findUnique({
                where: { id },
                select: { id: true, slug: true },
            });

            if (!article) {
                throw new NotFoundError(`Article with ID "${id}" not found`);
            }

            await prisma.article.delete({
                where: { id },
            });

            this.logger.info('Article deleted successfully', { id, slug: article.slug });
        } catch (error) {
            this.logger.error('Error deleting article', error as Error, { id });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }

    /**
     * Verify relationships (Private Helper)
     */
    private async verifyRelationships(data: {
        categoryId?: string;
        tagIds?: string[];
        relatedArticleIds?: string[];
    }): Promise<void> {
        if (data.relatedArticleIds && data.relatedArticleIds.length > 0) {
            const articles = await prisma.article.findMany({
                where: { id: { in: data.relatedArticleIds } },
                select: { id: true },
            });

            if (articles.length !== data.relatedArticleIds.length) {
                const foundIds = articles.map((a) => a.id);
                const missingIds = data.relatedArticleIds.filter((id) => !foundIds.includes(id));
                throw new NotFoundError(`Related articles not found: ${missingIds.join(', ')}`);
            }
        }
    }
}
