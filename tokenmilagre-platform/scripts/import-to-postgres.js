const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('📥 Importando dados para PostgreSQL...\n');

    // Ler backup
    const backupPath = path.join(__dirname, '../prisma/backup-sqlite.json');

    if (!fs.existsSync(backupPath)) {
      console.error('❌ Arquivo de backup não encontrado!');
      console.error(`   Esperado em: ${backupPath}`);
      console.error('   Execute: node scripts/export-sqlite-data.js primeiro');
      process.exit(1);
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`📦 Backup de ${backup.exportDate}`);
    console.log(`   - ${backup.data.users.length} usuários`);
    console.log(`   - ${backup.data.articles.length} artigos\n`);

    // Limpar banco (cuidado em produção!)
    console.log('🗑️  Limpando banco de dados...');
    await prisma.article.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Banco limpo\n');

    // Importar usuários
    console.log('👥 Importando usuários...');
    for (const user of backup.data.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }
      });
    }
    console.log(`✅ ${backup.data.users.length} usuários importados\n`);

    // Importar artigos
    console.log('📰 Importando artigos...');
    let imported = 0;
    for (const article of backup.data.articles) {
      // Encontrar autor pelo email
      const author = await prisma.user.findUnique({
        where: { email: article.authorEmail }
      });

      if (!author) {
        console.warn(`⚠️  Autor não encontrado para: ${article.title}`);
        continue;
      }

      await prisma.article.create({
        data: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          published: article.published,
          category: article.category,
          tags: article.tags,
          sentiment: article.sentiment,
          factCheckScore: article.factCheckScore,
          factCheckSources: article.factCheckSources,
          factCheckDate: article.factCheckDate ? new Date(article.factCheckDate) : null,
          factCheckStatus: article.factCheckStatus,
          authorId: author.id,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        }
      });
      imported++;
    }
    console.log(`✅ ${imported} artigos importados\n`);

    // Verificar
    const totalUsers = await prisma.user.count();
    const totalArticles = await prisma.article.count();
    const publishedArticles = await prisma.article.count({
      where: { published: true }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Usuários: ${totalUsers}`);
    console.log(`📰 Artigos: ${totalArticles} (${publishedArticles} publicados)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro ao importar dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
