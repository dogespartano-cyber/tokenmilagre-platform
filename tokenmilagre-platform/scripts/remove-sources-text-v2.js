const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function removeSourcesText() {
  try {
    console.log('\n🧹 REMOVENDO TEXTO DE FONTES DOS ARTIGOS\n');
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

      // Padrão 1: Formato completo com lista
      newContent = newContent.replace(
        /\*\*Fontes Consultadas:\*\*\s*\n-\s*CoinDesk\s*\n-\s*Cointelegraph\s*\n-\s*BeInCrypto\s*\n-\s*Decrypt\s*\n-\s*CoinTelegraph Brasil\s*/g,
        ''
      );

      // Padrão 2: Variação sem CoinTelegraph Brasil
      newContent = newContent.replace(
        /\*\*Fontes Consultadas:\*\*\s*\n-\s*CoinDesk\s*\n-\s*Cointelegraph\s*\n-\s*BeInCrypto\s*\n-\s*Decrypt\s*/g,
        ''
      );

      // Padrão 3: Outras variações
      newContent = newContent.replace(
        /\*\*Fontes Consultadas:\*\*\s*[\s\S]*?(?=\n\n---|$)/g,
        ''
      );

      // Limpar espaços duplos e triplos criados pela remoção
      newContent = newContent.replace(/\n\n\n+/g, '\n\n');
      newContent = newContent.trim();

      if (newContent.length !== originalLength) {
        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent }
        });

        console.log(`✅ Texto removido de: "${article.title}"`);
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
    console.error('❌ Erro ao remover texto:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeSourcesText();
