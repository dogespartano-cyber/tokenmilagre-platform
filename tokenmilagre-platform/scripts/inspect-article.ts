
import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const slug = 'como-os-fundamentos-do-bitcoin-influenciarao-seu-preco-em-2026';
    console.log(`Inspecting article: ${slug}`);

    const article = await prisma.article.findUnique({
        where: { slug },
    });

    if (!article) {
        console.log('Article not found');
        return;
    }

    console.log('--- START CONTENT ---');
    console.log(article.content);
    console.log('--- END CONTENT ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
