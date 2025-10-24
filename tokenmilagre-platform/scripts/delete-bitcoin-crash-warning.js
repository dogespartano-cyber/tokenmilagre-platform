const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'tom-lee-peter-brandt-bitcoin-queda-50-20251024';

  const deleted = await prisma.article.deleteMany({
    where: {
      slug: slug
    }
  });

  console.log(`✅ ${deleted.count} notícia(s) deletada(s) com slug: ${slug}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao deletar:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
