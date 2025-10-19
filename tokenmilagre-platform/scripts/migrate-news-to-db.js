const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateNewsToDatabase() {
  try {
    console.log('🚀 Iniciando migração de artigos do news.json para o banco de dados...\n');

    // 1. Verificar se existe um usuário admin
    let author = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!author) {
      console.log('⚠️  Nenhum usuário ADMIN encontrado. Buscando qualquer usuário...');
      author = await prisma.user.findFirst();
    }

    if (!author) {
      console.log('❌ Erro: Nenhum usuário encontrado no banco de dados.');
      console.log('💡 Crie um usuário primeiro antes de migrar os artigos.');
      return;
    }

    console.log(`✅ Usando autor: ${author.name} (${author.email})\n`);

    // 2. Ler arquivo news.json
    const newsFilePath = path.join(process.cwd(), 'data', 'news.json');
    const fileContent = fs.readFileSync(newsFilePath, 'utf-8');
    const newsArticles = JSON.parse(fileContent);

    console.log(`📊 Total de artigos no news.json: ${newsArticles.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    // 3. Processar cada artigo
    for (const newsItem of newsArticles) {
      try {
        // Verificar se já existe no banco
        const existing = await prisma.article.findUnique({
          where: { slug: newsItem.slug }
        });

        if (existing) {
          console.log(`⏭️  Pulando (já existe): "${newsItem.title}"`);
          skipped++;
          continue;
        }

        // Mapear campos do news.json para o schema do Prisma
        const articleData = {
          slug: newsItem.slug,
          title: newsItem.title,
          content: newsItem.content || '',
          excerpt: newsItem.summary || '',
          authorId: author.id,
          category: Array.isArray(newsItem.category) && newsItem.category.length > 0
            ? newsItem.category[0].toLowerCase()
            : 'bitcoin',
          tags: JSON.stringify(newsItem.keywords || []),
          sentiment: newsItem.sentiment || 'neutral',
          published: true,
          factCheckStatus: newsItem.factChecked ? 'verified' : null,
          factCheckSources: newsItem.sources ? JSON.stringify(newsItem.sources) : null,
          factCheckDate: newsItem.lastVerified ? new Date(newsItem.lastVerified) : null,
          factCheckScore: newsItem.factChecked ? 85.0 : null,
          createdAt: newsItem.publishedAt ? new Date(newsItem.publishedAt) : new Date(),
          updatedAt: newsItem.lastVerified ? new Date(newsItem.lastVerified) : new Date()
        };

        // Criar artigo no banco
        await prisma.article.create({
          data: articleData
        });

        console.log(`✅ Migrado: "${newsItem.title}"`);
        migrated++;

      } catch (error) {
        console.error(`❌ Erro ao migrar "${newsItem.title}":`, error.message);
        errors++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DA MIGRAÇÃO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Artigos migrados: ${migrated}`);
    console.log(`⏭️  Artigos pulados (já existiam): ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📝 Total processado: ${newsArticles.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 4. Verificar total de artigos no banco após migração
    const totalInDb = await prisma.article.count();
    console.log(`💾 Total de artigos no banco de dados agora: ${totalInDb}\n`);

    if (migrated > 0) {
      console.log('💡 Dica: Você pode agora remover ou arquivar o arquivo news.json');
      console.log('   já que todos os artigos estão no banco de dados.\n');
    }

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateNewsToDatabase();
