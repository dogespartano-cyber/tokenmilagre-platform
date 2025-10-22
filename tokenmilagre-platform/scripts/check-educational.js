const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function checkEducationalArticles() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        type: 'educational'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        level: true,
        readTime: true,
        createdAt: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log('📚 Artigos Educacionais no Banco de Dados:\n');
    console.log('Total:', articles.length);
    console.log('\n---\n');

    articles.forEach((article, index) => {
      console.log(`${index + 1}. [${article.level}] ${article.title}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Tempo: ${article.readTime}`);
      console.log(`   Criado: ${article.createdAt}`);
      console.log('');
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erro ao buscar artigos:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkEducationalArticles();
