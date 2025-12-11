/**
 * Article Bulk Service
 * Handles batch operations on articles
 */

import { prisma } from '@/lib/core/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { ServiceLocator } from '@/lib/di/container';
import { ValidationError } from '@/lib/services/error-service';
import type { BulkArticleOperationCurrent as BulkArticleOperation } from '@/lib/schemas/article-schemas';
import type { BulkOperationResult } from '../types';

export class ArticleBulkService {
    private get logger() {
        return ServiceLocator.getLogger();
    }

    /**
     * Bulk operations on articles
     */
    async bulkOperation(operation: BulkArticleOperation, userId?: string): Promise<BulkOperationResult> {
        this.logger.setContext({ operation: 'article.bulkOperation', userId });

        try {
            this.logger.info('Executing bulk operation', {
                action: operation.action,
                articleIds: operation.articleIds.length,
            });

            let result: Prisma.BatchPayload;
            const articleIds = operation.articleIds;

            if (articleIds.length > 50) {
                throw new ValidationError('Cannot perform bulk operation on more than 50 articles');
            }

            switch (operation.action) {
                case 'publish':
                    result = await prisma.article.updateMany({
                        where: { id: { in: articleIds } },
                        data: { published: true },
                    });
                    break;

                case 'unpublish':
                    result = await prisma.article.updateMany({
                        where: { id: { in: articleIds } },
                        data: { published: false },
                    });
                    break;

                case 'delete':
                    result = await prisma.article.deleteMany({
                        where: { id: { in: articleIds } },
                    });
                    break;

                case 'updateCategory':
                    if (!operation.data?.category) {
                        throw new ValidationError('Category is required for updateCategory action');
                    }
                    result = await prisma.article.updateMany({
                        where: { id: { in: articleIds } },
                        data: { category: operation.data.category },
                    });
                    break;

                default:
                    throw new ValidationError(`Unknown bulk action: ${(operation as any).action}`);
            }

            this.logger.info('Bulk operation completed', {
                action: operation.action,
                count: result.count,
            });

            return {
                count: result.count,
                articleIds,
            };
        } catch (error) {
            this.logger.error('Error in bulk operation', error as Error, {
                action: operation.action,
            });
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }
}
