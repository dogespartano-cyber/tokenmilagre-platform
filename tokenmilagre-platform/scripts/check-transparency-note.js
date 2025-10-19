const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function checkTransparencyNote() {
  try {
    console.log('\n🔍 VERIFICANDO NOTA DE TRANSPARÊNCIA NOS ARTIGOS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    // Padrões de busca para a nota de transparência
    const notePatterns = [
      'Nota de Transparência',
      '$MILAGRE Research',
      'Este conteúdo é educacional e informativo'
    ];

    let withNote = 0;
    let withoutNote = 0;
    const articlesWithoutNote = [];

    for (const article of articles) {
      if (!article.content) {
        withoutNote++;
        articlesWithoutNote.push(article);
        continue;
      }

      // Verificar se tem algum dos padrões
      const hasNote = notePatterns.some(pattern =>
        article.content.includes(pattern)
      );

      if (hasNote) {
        withNote++;
      } else {
        withoutNote++;
        articlesWithoutNote.push(article);
      }
    }

    // Exibir artigos sem nota
    if (articlesWithoutNote.length > 0) {
      console.log('❌ ARTIGOS SEM NOTA DE TRANSPARÊNCIA:\n');
      articlesWithoutNote.forEach((article, index) => {
        console.log(`${index + 1}. "${article.title}"`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   ID: ${article.id}`);
        console.log('');
      });
    } else {
      console.log('✅ Todos os artigos possuem a nota de transparência!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total de artigos: ${articles.length}`);
    console.log(`Com nota de transparência: ${withNote}`);
    console.log(`Sem nota de transparência: ${withoutNote}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTransparencyNote();
