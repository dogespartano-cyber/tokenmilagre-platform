
import 'dotenv/config';
import { PrismaClient } from './lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const targetSlug = 'vanguard-abre-plataforma-para-etfs-de-bitcoin-ethereum-e-xrp-e-revoluciona-o-mercado-cripto-miqcilrr';

    console.log('\n--- Checking News List (Direct Prisma) ---');
    try {
        const articles = await prisma.article.findMany({
            where: {
                type: 'news',
                published: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true
            }
        });

        console.log(`Total Found (Top 10): ${articles.length}`);
        articles.forEach((a, i) => {
            console.log(`${i + 1}. [${a.createdAt.toISOString()}] ${a.title} (Slug: ${a.slug})`);
        });

        const foundInList = articles.find(a => a.slug === targetSlug);
        if (foundInList) {
            console.log(`\n✅ Target article IS in the top 10 results at index ${articles.findIndex(a => a.slug === targetSlug)}.`);
        } else {
            console.log('\n❌ Target article is NOT in the top 10 results.');
        }

    } catch (error) {
        console.error('Error querying Prisma:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
