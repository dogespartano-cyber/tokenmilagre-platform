/**
 * Article Service Facade
 * Delegates operations to specialized domain services
 * 
 * Moved from @/lib/services/article-service.ts on 2025-12-08
 */

import { ArticleCrudService } from './article-crud.service';
import { ArticleQueryService } from './article-query.service';
import { ArticleStatsService } from './article-stats.service';
import { ArticleBulkService } from './article-bulk.service';

import type {
    ArticleCreateInputCurrent as ArticleCreateInput,
    ArticleUpdateInputCurrent as ArticleUpdateInput,
    BulkArticleOperationCurrent as BulkArticleOperation,
    ArticleQueryCurrent as ArticleQuery
} from '@/lib/schemas/article-schemas';

import type {
    ArticleWithRelations,
    ArticleListResult,
    ArticleStats,
    BulkOperationResult,
} from '@/lib/domains/articles/types';

// Re-export types for backward compatibility and consumers
export type {
    ArticleWithRelations,
    ArticleListResult,
    ArticleStats,
    BulkOperationResult,
} from '@/lib/domains/articles/types';

export class ArticleService {
    private crud: ArticleCrudService;
    private query: ArticleQueryService;
    private stats: ArticleStatsService;
    private bulk: ArticleBulkService;

    constructor() {
        this.crud = new ArticleCrudService();
        this.query = new ArticleQueryService();
        this.stats = new ArticleStatsService();
        this.bulk = new ArticleBulkService();
    }

    // ============================================
    // DELEGATION METHODS
    // ============================================

    async create(data: ArticleCreateInput, userId: string): Promise<ArticleWithRelations> {
        return this.crud.create(data, userId);
    }

    async getById(id: string): Promise<ArticleWithRelations> {
        return this.crud.getById(id);
    }

    async getBySlug(slug: string): Promise<ArticleWithRelations> {
        return this.crud.getBySlug(slug);
    }

    async update(
        id: string,
        data: Partial<ArticleUpdateInput>,
        userId: string
    ): Promise<ArticleWithRelations> {
        return this.crud.update(id, data, userId);
    }

    async delete(id: string, userId: string): Promise<void> {
        return this.crud.delete(id, userId);
    }

    async restore(id: string, userId: string): Promise<ArticleWithRelations> {
        throw new Error('Restore not implemented - current schema does not support soft deletes');
    }

    async list(query: Partial<ArticleQuery> = {}): Promise<ArticleListResult> {
        return this.query.list(query);
    }

    async getStats(): Promise<ArticleStats> {
        return this.stats.getStats();
    }

    async bulkOperation(operation: BulkArticleOperation, userId?: string): Promise<BulkOperationResult> {
        return this.bulk.bulkOperation(operation, userId);
    }
}

// Export singleton instance
export const articleService = new ArticleService();
