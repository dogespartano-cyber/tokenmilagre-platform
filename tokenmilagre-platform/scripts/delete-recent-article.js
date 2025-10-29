const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'bitcoin-oscila-abaixo-de-us-115-mil-enquanto-mercado-aguarda-decisao-do-fed-20251029';

  console.log('🗑️  Removendo artigo...');
  console.log('🔗 Slug:', slug);

  const deleted = await prisma.article.delete({
    where: { slug }
  });

  console.log('✅ Artigo removido com sucesso!');
  console.log('📰 Título:', deleted.title);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
