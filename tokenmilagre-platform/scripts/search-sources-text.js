const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function searchSourcesText() {
  try {
    console.log('\n🔍 BUSCANDO TEXTO DE FONTES NOS ARTIGOS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const articles = await prisma.article.findMany();

    console.log(`📊 Total de artigos: ${articles.length}\n`);

    let found = 0;

    for (const article of articles) {
      if (!article.content) continue;

      // Procurar variações
      const searches = [
        'Fontes Consultadas',
        'CoinDesk',
        'Cointelegraph',
        'BeInCrypto',
        'Decrypt',
        'CoinTelegraph Brasil'
      ];

      let hasAny = false;
      const matches = [];

      searches.forEach(term => {
        if (article.content.includes(term)) {
          matches.push(term);
          hasAny = true;
        }
      });

      if (hasAny) {
        found++;
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅ ENCONTRADO #${found}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📝 Título: "${article.title}"`);
        console.log(`🔗 Slug: ${article.slug}`);
        console.log(`📌 Termos encontrados: ${matches.join(', ')}`);
        console.log(`\n📄 Últimos 500 caracteres do artigo:`);
        console.log(article.content.slice(-500));
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 RESUMO:`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total de artigos: ${articles.length}`);
    console.log(`Com texto de fontes: ${found}`);
    console.log(`Sem texto de fontes: ${articles.length - found}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

searchSourcesText();
