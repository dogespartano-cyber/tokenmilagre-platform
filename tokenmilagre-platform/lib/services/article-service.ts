/**
 * ArticleService - STUB VERSION (API v2 Disabled)
 *
 * ⚠️ Este é um STUB temporário. A implementação completa está desabilitada
 * até a migração do schema v2 ser concluída.
 *
 * @see MIGRATION_PLAN.md - Plano completo de migração
 * @see article-service.DISABLED.ts - Documentação completa dos métodos
 * @see article-service.ORIGINAL-BACKUP.ts - Implementação original completa
 */

import type {
  ArticleQuery,
  ArticleCreateInput,
  ArticleUpdateInput,
  BulkArticleOperation,
} from '@/lib/schemas/article-schemas'

const DISABLED_MSG = 'API v2 disabled: Awaiting schema-v2 migration. See MIGRATION_PLAN.md'

/**
 * Placeholder types for API v2 (will be properly typed after migration)
 */
export type ArticleWithRelations = Record<string, any>
export type ArticleListResult = {
  articles: ArticleWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
}
export type PaginatedArticles = ArticleListResult
export type ArticleStats = Record<string, any>
export type BulkOperationResult = {
  count: number
  articleIds: string[]
}

/**
 * ArticleService - Stub implementation
 * All methods throw errors directing to migration documentation
 */
export class ArticleService {
  async create(_data: ArticleCreateInput, _userId: string): Promise<ArticleWithRelations> {
    throw new Error(DISABLED_MSG)
  }

  async getById(_id: string): Promise<ArticleWithRelations> {
    throw new Error(DISABLED_MSG)
  }

  async getBySlug(_slug: string): Promise<ArticleWithRelations> {
    throw new Error(DISABLED_MSG)
  }

  async list(_query: Partial<ArticleQuery>): Promise<ArticleListResult> {
    throw new Error(DISABLED_MSG)
  }

  async update(
    _id: string,
    _data: Partial<ArticleUpdateInput>,
    _userId: string
  ): Promise<ArticleWithRelations> {
    throw new Error(DISABLED_MSG)
  }

  async delete(_id: string, _userId: string): Promise<void> {
    throw new Error(DISABLED_MSG)
  }

  async restore(_id: string, _userId: string): Promise<ArticleWithRelations> {
    throw new Error(DISABLED_MSG)
  }

  async bulkOperation(_operation: BulkArticleOperation, _userId?: string): Promise<BulkOperationResult> {
    throw new Error(DISABLED_MSG)
  }

  async getStats(): Promise<ArticleStats> {
    throw new Error(DISABLED_MSG)
  }
}

// Export singleton instance
export const articleService = new ArticleService()

/**
 * To reactivate this service:
 * 1. Complete database migration (MIGRATION_PLAN.md)
 * 2. Restore original implementation from backup
 * 3. Enable ENABLE_API_V2=true
 * 4. Remove this stub file
 */
