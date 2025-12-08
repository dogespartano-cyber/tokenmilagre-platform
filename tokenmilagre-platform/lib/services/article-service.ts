/** @deprecated Use @/lib/domains/articles/services/article-facade */
export * from '@/lib/domains/articles/services/article-facade';
export { articleService as default } from '@/lib/domains/articles/services/article-facade';
// Re-export types and schemas that were previously bundled
export * from '@/lib/domains/articles/types';
export * from '@/lib/domains/articles/schemas/article.schema';
