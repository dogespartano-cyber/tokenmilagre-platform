const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function removeSourcesWithUrls() {
  try {
    console.log('\n🧹 REMOVENDO SEÇÕES DE FONTES COM URLs\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos analisados: ${articles.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const article of articles) {
      if (!article.content) {
        skipped++;
        continue;
      }

      let newContent = article.content;
      const originalLength = newContent.length;

      // Padrão 1: **Fontes:** seguido de lista com URLs ou links
      // Captura desde **Fontes:** até o próximo --- ou até a nota de transparência
      newContent = newContent.replace(
        /\*\*Fontes:\*\*\s*\n(?:[-•]\s*.*?\n)*(?:[-•]\s*.*?)?(?=\n\n---|\n\n>|$)/gs,
        ''
      );

      // Padrão 2: ## Fontes (caso tenha como heading)
      newContent = newContent.replace(
        /##\s*Fontes\s*\n(?:[-•]\s*.*?\n)*(?:[-•]\s*.*?)?(?=\n\n---|\n\n>|$)/gs,
        ''
      );

      // Limpar múltiplas linhas vazias
      newContent = newContent.replace(/\n\n\n+/g, '\n\n');
      newContent = newContent.trim();

      if (newContent.length !== originalLength) {
        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent }
        });

        console.log(`✅ Seção de fontes removida de: "${article.title}"`);
        console.log(`   Caracteres removidos: ${originalLength - newContent.length}\n`);
        updated++;
      } else {
        skipped++;
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Artigos atualizados: ${updated}`);
    console.log(`⏭️  Artigos pulados (sem alterações): ${skipped}`);
    console.log(`📝 Total processado: ${articles.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro ao remover seções de fontes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeSourcesWithUrls();
