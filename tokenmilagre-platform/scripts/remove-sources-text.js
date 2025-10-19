const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

// Texto exato a ser removido
const SOURCES_TEXT_PATTERN = /Fontes Consultadas:\s*\n\s*\nCoinDesk\s*\nCointelegraph\s*\nBeInCrypto\s*\nDecrypt\s*\nCoinTelegraph Brasil\s*/gi;

// Variações do texto
const VARIATIONS = [
  /Fontes Consultadas:\s*\n\s*\nCoinDesk\s*\nCointelegraph\s*\nBeInCrypto\s*\nDecrypt\s*\nCoinTelegraph Brasil\s*/gi,
  /Fontes Consultadas:\s*[\r\n]+\s*CoinDesk\s*[\r\n]+\s*Cointelegraph\s*[\r\n]+\s*BeInCrypto\s*[\r\n]+\s*Decrypt\s*[\r\n]+\s*CoinTelegraph Brasil\s*/gi,
  /## Fontes Consultadas:\s*\n\s*\nCoinDesk\s*\nCointelegraph\s*\nBeInCrypto\s*\nDecrypt\s*\nCoinTelegraph Brasil\s*/gi,
  /\*\*Fontes Consultadas:\*\*\s*\n\s*\nCoinDesk\s*\nCointelegraph\s*\nBeInCrypto\s*\nDecrypt\s*\nCoinTelegraph Brasil\s*/gi
];

async function removeSourcesText() {
  try {
    console.log('\n🧹 REMOVENDO TEXTO DE FONTES DOS ARTIGOS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Buscar todos os artigos
    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos analisados: ${articles.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const article of articles) {
      if (!article.content) {
        skipped++;
        continue;
      }

      let originalContent = article.content;
      let newContent = article.content;
      let changed = false;

      // Tentar todas as variações
      for (const pattern of VARIATIONS) {
        const beforeLength = newContent.length;
        newContent = newContent.replace(pattern, '');

        if (newContent.length !== beforeLength) {
          changed = true;
        }
      }

      // Limpar espaços extras no final
      newContent = newContent.trim();

      if (changed && newContent !== originalContent) {
        // Atualizar artigo no banco
        await prisma.article.update({
          where: { id: article.id },
          data: { content: newContent }
        });

        console.log(`✅ Texto removido de: "${article.title}"`);
        console.log(`   Caracteres removidos: ${originalContent.length - newContent.length}`);
        updated++;
      } else {
        skipped++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
