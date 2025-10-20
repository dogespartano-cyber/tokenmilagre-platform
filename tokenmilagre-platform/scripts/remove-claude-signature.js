const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function removeClaudeSignature() {
  try {
    // Buscar artigos publicados hoje (2025-10-20)
    const today = new Date('2025-10-20');
    const tomorrow = new Date('2025-10-21');

    const articles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    console.log(`\n📊 Encontrados ${articles.length} artigos criados hoje:\n`);

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Created: ${article.createdAt}`);
      console.log('');
    });

    let updated = 0;

    for (const article of articles) {
      let cleanedContent = article.content;
      let wasModified = false;

      // Remover linha horizontal no final (vários formatos possíveis)
      // Remove ---\n no final
      if (cleanedContent.endsWith('\n---\n')) {
        cleanedContent = cleanedContent.slice(0, -5);
        wasModified = true;
      } else if (cleanedContent.endsWith('\n---')) {
        cleanedContent = cleanedContent.slice(0, -4);
        wasModified = true;
      } else if (cleanedContent.endsWith('---\n')) {
        cleanedContent = cleanedContent.slice(0, -4);
        wasModified = true;
      } else if (cleanedContent.endsWith('---')) {
        cleanedContent = cleanedContent.slice(0, -3);
        wasModified = true;
      }

      // Remover <hr> no final
      if (cleanedContent.endsWith('<hr>') || cleanedContent.endsWith('<hr/>') || cleanedContent.endsWith('<hr />')) {
        cleanedContent = cleanedContent.replace(/<hr\s*\/?>$/g, '');
        wasModified = true;
      }

      // Remover múltiplas linhas em branco no final
      cleanedContent = cleanedContent.replace(/\n\n+$/g, '\n');

      if (wasModified) {
        await prisma.article.update({
          where: { id: article.id },
          data: { content: cleanedContent }
        });

        console.log(`✅ Removida linha horizontal de: ${article.title}`);
        updated++;
      }
    }

    console.log(`\n✨ Total atualizado: ${updated} artigos`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeClaudeSignature();
