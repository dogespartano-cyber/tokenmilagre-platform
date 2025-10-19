const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function listArticles() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        slug: true,
        title: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total de artigos: ${articles.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   ID: ${article.id}\n`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listArticles();
