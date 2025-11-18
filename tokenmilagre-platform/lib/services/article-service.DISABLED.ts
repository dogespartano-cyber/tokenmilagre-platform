/**
 * ArticleService - DISABLED UNTIL SCHEMA V2 MIGRATION
 *
 * ⚠️ IMPORTANTE: Este serviço foi temporariamente desabilitado porque depende
 * do schema-v2.prisma que ainda não foi aplicado ao banco de dados.
 *
 * RAZÃO DA DESATIVAÇÃO:
 * - Schema v2 introduz campos JSON (coverImage, seo, citations)
 * - Schema v2 usa enums ArticleStatus e ArticleType
 * - Schema v2 adiciona soft deletes (deletedAt)
 * - Schema v2 normaliza Categories e Tags em tabelas separadas
 *
 * PARA REATIVAR:
 * 1. Executar migração do schema conforme MIGRATION_PLAN.md
 * 2. Aplicar scripts SQL de data migration
 * 3. Validar testes em staging
 * 4. Renomear este arquivo de volta para article-service.ts
 * 5. Habilitar ENABLE_API_V2=true
 *
 * CÓDIGO ORIGINAL PRESERVADO EM:
 * - Git history: commit anterior a esta desativação
 * - Documentação: docs/API_V2_SPECIFICATION.md
 * - Testes: __tests__/api/v2/articles/*.test.ts
 *
 * @see MIGRATION_PLAN.md
 * @see docs/NEW_PRISMA_SCHEMA.md
 */

import type { ArticleQuery, ArticleCreateInput, ArticleUpdateInput, BulkArticleOperation } from '@/lib/schemas/article-schemas'

/**
 * STUB: ArticleService methods throw explicit errors
 * All methods preserved with correct signatures for future migration
 */
export class ArticleService {
  private static DISABLED_ERROR = new Error(
    'ArticleService disabled: Awaiting schema-v2 migration. See MIGRATION_PLAN.md'
  )

  async create(_data: ArticleCreateInput, _userId: string): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async getById(_id: string): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async getBySlug(_slug: string): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async list(_query: Partial<ArticleQuery>): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async update(_id: string, _data: Partial<ArticleUpdateInput>, _userId: string): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async delete(_id: string, _userId: string): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async restore(_id: string, _userId: string): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async bulkOperation(_operation: BulkArticleOperation): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }

  async getStats(): Promise<never> {
    throw ArticleService.DISABLED_ERROR
  }
}

// Export singleton instance
export const articleService = new ArticleService()

/**
 * MIGRATION CHECKLIST (Remove when activating):
 *
 * [ ] Schema v2 applied to database
 * [ ] Data migration scripts executed
 * [ ] All tests passing in staging
 * [ ] Categories and Tags populated
 * [ ] Soft delete working correctly
 * [ ] API v2 feature flag enabled
 * [ ] This file renamed to article-service.ts
 * [ ] Original implementation restored from git history
 */
