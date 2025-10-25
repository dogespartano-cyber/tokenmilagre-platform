const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.article.count({
    where: { type: 'news' }
  });
  console.log(`📰 Total de notícias no banco: ${count}`);

  const latest = await prisma.article.findFirst({
    where: { type: 'news' },
    orderBy: { createdAt: 'desc' },
    select: {
      title: true,
      slug: true,
      createdAt: true,
      sentiment: true,
      category: true
    }
  });

  if (latest) {
    console.log('');
    console.log('✅ Última notícia publicada:');
    console.log('📰 Título:', latest.title);
    console.log('🔗 Slug:', latest.slug);
    console.log('📅 Data:', latest.createdAt.toLocaleString('pt-BR'));
    console.log('😊 Sentimento:', latest.sentiment);
    console.log('🏷️  Categoria:', latest.category);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
