const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function findOldNotes() {
  try {
    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    const searchTerms = [
      'Este artigo foi pesquisado via Claude com busca web em tempo real',
      '$MILAGRE Research',
      'Nota de Transparência:'
    ];

    let foundCount = 0;

    articles.forEach(article => {
      const hasOldNote = searchTerms.some(term => article.content.includes(term));

      if (hasOldNote) {
        foundCount++;
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅ ENCONTRADO #${foundCount}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📝 Título: ${article.title}`);
        console.log(`🔗 Slug: ${article.slug}`);
        console.log(`🆔 ID: ${article.id}`);
        console.log(`\n📄 Últimos 300 caracteres:`);
        console.log(article.content.slice(-300));
      }
    });

    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 RESUMO:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total de artigos: ${articles.length}`);
    console.log(`Com nota antiga: ${foundCount}`);
    console.log(`Sem nota antiga: ${articles.length - foundCount}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findOldNotes();
