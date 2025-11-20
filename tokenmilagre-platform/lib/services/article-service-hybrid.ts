import { prismaHybrid } from '@/lib/prisma-hybrid';
import { ArticleStatus } from '@/lib/generated/prisma-hybrid';

// Types compatible with both schemas
export interface CreateArticleDTO {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    authorId: string;

    // v1 fields
    published?: boolean;
    category?: string; // slug
    tags?: string; // JSON string

    // v2 fields
    status?: ArticleStatus;
    categoryId?: string; // UUID
    tagIds?: string[]; // UUIDs
}

export class ArticleServiceHybrid {

    async create(data: CreateArticleDTO) {
        // Logic to handle Dual Write / Hybrid State

        // 1. Determine Status (v2) from Published (v1) if not provided
        let status = data.status;
        if (!status) {
            status = data.published ? ArticleStatus.published : ArticleStatus.draft;
        }

        // 2. Determine Published (v1) from Status (v2) if not provided
        let published = data.published;
        if (published === undefined && status) {
            published = status === ArticleStatus.published;
        }

        // 3. Handle Category
        // If categoryId (v2) is provided, we should try to get the slug for v1 compatibility
        // If category (v1 slug) is provided, we should try to find the ID for v2 compatibility

        let categorySlug = data.category;
        let categoryId = data.categoryId;

        if (categorySlug && !categoryId) {
            // Try to find category by slug to get ID
            const cat = await prismaHybrid.category.findUnique({ where: { slug: categorySlug } });
            if (cat) {
                categoryId = cat.id;
            }
        } else if (categoryId && !categorySlug) {
            const cat = await prismaHybrid.category.findUnique({ where: { id: categoryId } });
            if (cat) {
                categorySlug = cat.slug;
            }
        }

        // 4. Create Article writing to BOTH sets of fields
        const article = await prismaHybrid.article.create({
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                authorId: data.authorId,

                // v1
                published: published || false,
                category: categorySlug || 'uncategorized', // Default for v1 if missing
                tags: data.tags || '[]',

                // v2
                status: status,
                categoryId: categoryId,
                // tagsRel: connect if tagIds provided (omitted for brevity in this initial step)
            }
        });

        return article;
    }

    async list() {
        return prismaHybrid.article.findMany({
            include: {
                categoryRel: true, // v2 relation
                author: true
            }
        });
    }
}

export const articleServiceHybrid = new ArticleServiceHybrid();
