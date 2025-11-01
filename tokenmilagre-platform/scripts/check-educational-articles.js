const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    where: {
      type: 'educational',
      published: true
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(`\n📚 Artigos educacionais publicados: ${articles.length}\n`);

  articles.forEach((article, index) => {
    console.log(`${index + 1}. "${article.title}"`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Excerpt: ${article.excerpt || '❌ VAZIO'}`);
    console.log(`   Publicado em: ${article.createdAt.toLocaleString('pt-BR')}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
