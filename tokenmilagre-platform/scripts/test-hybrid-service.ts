import { articleServiceHybrid } from '../lib/services/article-service-hybrid';
import { prismaHybrid } from '../lib/prisma-hybrid';

async function testHybridService() {
    console.log('--- Testing Hybrid Article Service ---');

    try {
        // 1. Setup: Ensure a user exists
        const user = await prismaHybrid.user.findFirst();
        if (!user) {
            console.error('No user found. Cannot run test.');
            return;
        }
        console.log(`Using author: ${user.email}`);

        // 2. Setup: Ensure a category exists (for v2 relation)
        // We try to find or create a 'news' category
        let category = await prismaHybrid.category.findUnique({ where: { slug: 'news' } });
        if (!category) {
            console.log('Category "news" not found. Creating it...');
            try {
                category = await prismaHybrid.category.create({
                    data: {
                        slug: 'news',
                        name: 'News',
                        type: 'news'
                    }
                });
                console.log('Category created:', category.id);
            } catch (e) {
                console.warn('Could not create category (might need migration):', e);
            }
        }

        // 3. Test Case 1: Create with v1 data (published=true) -> Expect status=published
        console.log('\nTest 1: Create with v1 data (published=true)');
        const article1 = await articleServiceHybrid.create({
            title: 'Hybrid Test v1 Input',
            slug: 'hybrid-test-v1-' + Date.now(),
            content: 'Content...',
            authorId: user.id,
            published: true,
            category: 'news' // v1 slug
        });

        console.log('Article 1 Created:', article1.id);
        console.log(`  v1 published: ${article1.published}`);
        console.log(`  v2 status:    ${article1.status}`);

        if (article1.published === true && article1.status === 'published') {
            console.log('  ✅ PASS: Status synced correctly.');
        } else {
            console.error('  ❌ FAIL: Status mismatch.');
        }

        // 4. Test Case 2: Create with v2 data (status=draft) -> Expect published=false
        console.log('\nTest 2: Create with v2 data (status=draft)');
        const article2 = await articleServiceHybrid.create({
            title: 'Hybrid Test v2 Input',
            slug: 'hybrid-test-v2-' + Date.now(),
            content: 'Content...',
            authorId: user.id,
            status: 'draft',
            categoryId: category?.id
        });

        console.log('Article 2 Created:', article2.id);
        console.log(`  v1 published: ${article2.published}`);
        console.log(`  v2 status:    ${article2.status}`);

        if (article2.published === false && article2.status === 'draft') {
            console.log('  ✅ PASS: Published synced correctly.');
        } else {
            console.error('  ❌ FAIL: Published mismatch.');
        }

        // Cleanup
        console.log('\nCleaning up...');
        await prismaHybrid.article.delete({ where: { id: article1.id } });
        await prismaHybrid.article.delete({ where: { id: article2.id } });
        if (category) {
            // Optional: delete category if we created it? Better leave it.
        }
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await prismaHybrid.$disconnect();
    }
}

testHybridService();
