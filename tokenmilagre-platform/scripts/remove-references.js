const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function removeReferences() {
  try {
    console.log('🔍 Buscando últimos 10 posts de notícias...\n');

    // Buscar últimos 10 artigos de notícias
    const articles = await prisma.article.findMany({
      where: {
        type: 'news'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log(`✅ Encontrados ${articles.length} artigos de notícias\n`);

    let updatedCount = 0;

    for (const article of articles) {
      // Verificar se tem referências numéricas [1], [2], etc
      const hasReferences = /\[\d+\]|\[\d+\]\[\d+\]/g.test(article.content);

      if (hasReferences) {
        console.log(`📝 Artigo: "${article.title}"`);
        console.log(`   Slug: ${article.slug}`);

        // Remover referências numéricas do conteúdo
        // Padrões: [1], [2], [1][2], [10][15], etc
        const cleanContent = article.content.replace(/\[\d+\](\[\d+\])*/g, '');

        // Também limpar excerpt se tiver
        const cleanExcerpt = article.excerpt
          ? article.excerpt.replace(/\[\d+\](\[\d+\])*/g, '')
          : article.excerpt;

        // Atualizar no banco
        await prisma.article.update({
          where: { id: article.id },
          data: {
            content: cleanContent.trim(),
            excerpt: cleanExcerpt ? cleanExcerpt.trim() : cleanExcerpt
          }
        });

        console.log(`   ✅ Referências removidas!\n`);
        updatedCount++;
      } else {
        console.log(`✓ Artigo: "${article.title}" - Sem referências\n`);
      }
    }

    console.log(`\n🎉 Concluído!`);
    console.log(`   Total analisado: ${articles.length}`);
    console.log(`   Artigos atualizados: ${updatedCount}`);

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

removeReferences();
