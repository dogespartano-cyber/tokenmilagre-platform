const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function removeWatcherGuru() {
  try {
    console.log('\n🧹 REMOVENDO TEXTO "Watcher.Guru"\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Buscar artigo específico
    const article = await prisma.article.findUnique({
      where: { slug: 'bybit-obtm-licena-de-cripto-nos-emirados-rabes-unidos-20251010-1045' }
    });

    if (!article) {
      console.log('❌ Artigo não encontrado.');
      return;
    }

    console.log(`📝 Artigo encontrado: "${article.title}"\n`);

    const originalContent = article.content;

    // Remover "Watcher.Guru" e variações
    let newContent = originalContent
      .replace(/\n?\s*-\s*Watcher\.Guru\s*\n?/g, '\n')
      .replace(/\n?\s*Watcher\.Guru\s*\n?/g, '\n')
      .replace(/\n\n\n+/g, '\n\n')
      .trim();

    if (newContent !== originalContent) {
      await prisma.article.update({
        where: { id: article.id },
        data: { content: newContent }
      });

      console.log('✅ Texto "Watcher.Guru" removido com sucesso!');
      console.log(`   Caracteres removidos: ${originalContent.length - newContent.length}\n`);
    } else {
      console.log('⚠️  Texto "Watcher.Guru" não encontrado no artigo.\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeWatcherGuru();
