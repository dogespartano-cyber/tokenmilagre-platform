
const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function debugArticleQuery() {
    console.log('--- Debugging Article Query ---');

    // 1. Simulate API List Query
    console.log('\n1. Simulating API List Query (type="educational", status="published")...');
    const articles = await prisma.article.findMany({
        where: {
            type: 'educational',
            status: 'published',
            deletedAt: null,
        },
        take: 5,
        select: { slug: true, title: true, type: true, status: true }
    });

    console.log(`Found ${articles.length} articles.`);
    if (articles.length === 0) {
        console.log('No articles found. Checking if any exist with different case...');
        const allArticles = await prisma.article.findMany({ take: 5, select: { slug: true, type: true, status: true } });
        console.log('Sample of all articles:', allArticles);
        return;
    }

    articles.forEach(a => console.log(`- [${a.type}] ${a.title} (slug: ${a.slug})`));

    // 2. Simulate Detail Page Query for the first article
    const targetSlug = articles[0].slug;
    console.log(`\n2. Simulating Detail Page Query for slug: "${targetSlug}"...`);

    const article = await prisma.article.findFirst({
        where: {
            slug: targetSlug,
            type: 'educational',
            status: 'published',
            deletedAt: null,
        }
    });

    if (article) {
        console.log('SUCCESS: Article found via detail query.');
    } else {
        console.log('FAILURE: Article NOT found via detail query.');

        // Debugging why it failed
        console.log('\n--- Diagnosing Failure ---');
        const bySlugOnly = await prisma.article.findUnique({ where: { slug: targetSlug } });
        console.log('Query by slug only:', bySlugOnly ? 'Found' : 'Not Found');
        if (bySlugOnly) {
            console.log('Actual values:');
            console.log(`- type: "${bySlugOnly.type}" (Expected: "educational")`);
            console.log(`- status: "${bySlugOnly.status}" (Expected: "published")`);
            console.log(`- deletedAt: ${bySlugOnly.deletedAt} (Expected: null)`);
        }
    }
}

debugArticleQuery()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
