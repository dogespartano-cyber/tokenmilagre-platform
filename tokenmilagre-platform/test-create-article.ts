import { PrismaClient } from './lib/generated/prisma';

const prisma = new PrismaClient();

async function testCreateArticle() {
    console.log('--- Testing Article Creation ---');

    // 1. Get a user (author)
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('No user found. Cannot create article.');
        return;
    }
    console.log(`Using author: ${user.email} (${user.id})`);

    // 2. Check Category (Note: In v1 schema, category is a string, but this script seems to assume v2 logic or mixed. 
    // Adjusting to v1 compatible logic for now based on schema.prisma)
    
    // V1 Schema: category is a String field on Article, not a separate model.
    // However, the previous script tried to find a 'Category' model. 
    // If we are strictly on v1, there is no Category model.
    // I will adapt this to work with the current V1 schema which uses string category.
    
    const categorySlug = 'bitcoin';
    console.log(`Using category slug: ${categorySlug}`);

    // 3. Simulate Payload (with content)
    const payload = {
        type: "news",
        title: "SEC dos EUA Cancela Capítulo Especial para Criptomoedas e Bitcoin Cai Abaixo de US$ 90.000",
        category: categorySlug,
        slug: "sec-dos-eua-cancela-capitulo-especial-para-criptomoedas-e-bitcoin-cai-abaixo-de-us-90000-20251119-test",
        content: "Conteúdo de teste...",
        published: false, // v1 uses published boolean
        authorId: user.id,
    };

    console.log('Attempting to create article via Prisma...');
    try {
        const article = await prisma.article.create({
            data: {
                title: payload.title,
                slug: payload.slug,
                content: payload.content,
                type: payload.type,
                published: payload.published,
                authorId: payload.authorId,
                category: payload.category, // v1: string
                tags: "[]" // v1: string (json)
            }
        });
        console.log('SUCCESS: Article created:', article.id);

        // Clean up
        await prisma.article.delete({ where: { id: article.id } });
        console.log('Article deleted (cleanup).');
    } catch (error) {
        console.error('FAILURE: Could not create article.');
        console.error(error);
    }
}

testCreateArticle()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
