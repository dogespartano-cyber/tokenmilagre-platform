const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function fixConclusionMarkdown() {
  try {
    console.log('\n🔧 CORRIGINDO MARKDOWN DA CONCLUSÃO\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Buscar artigo específico
    const article = await prisma.article.findUnique({
      where: { slug: 'bybit-obtm-licena-de-cripto-nos-emirados-rabes-unidos-20251010-1045' }
    });

    if (!article) {
      console.log('❌ Artigo não encontrado.');
      return;
    }

    console.log(`📝 Artigo: "${article.title}"\n`);

    const originalContent = article.content;

    // Corrigir espaçamento entre conclusão e ---
    // Padrão: texto seguido diretamente de \n--- (sem linha em branco)
    let newContent = originalContent.replace(
      /(\n[^\n]+)\n---/g,
      '$1\n\n---'
    );

    if (newContent !== originalContent) {
      await prisma.article.update({
        where: { id: article.id },
        data: { content: newContent }
      });

      console.log('✅ Markdown da conclusão corrigido!');
      console.log('   Adicionada linha em branco antes do separador ---\n');
    } else {
      console.log('⚠️  Nenhuma correção necessária.\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixConclusionMarkdown();
