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
      slug: true,
      title: true,
      category: true,
      level: true,
      excerpt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  console.log('\n📚 Artigos Educacionais Existentes:\n');
  console.log('Total:', articles.length, 'artigos\n');

  articles.forEach((article, index) => {
    console.log(`${index + 1}. "${article.title}"`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Categoria: ${article.category} | Nível: ${article.level || 'N/A'}`);
    console.log(`   Resumo: ${article.excerpt ? article.excerpt.substring(0, 80) + '...' : 'Sem resumo'}`);
    console.log('');
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
