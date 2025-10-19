const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function countArticles() {
  try {
    const total = await prisma.article.count();
    const published = await prisma.article.count({ where: { published: true } });
    const draft = await prisma.article.count({ where: { published: false } });

    console.log('\n📊 ESTATÍSTICAS DO BANCO DE DADOS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📝 Total de artigos: ${total}`);
    console.log(`✅ Publicados: ${published}`);
    console.log(`📄 Rascunhos: ${draft}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countArticles();
