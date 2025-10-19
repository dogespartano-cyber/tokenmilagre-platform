const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('📦 Exportando dados do SQLite...\n');

    // Exportar usuários
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
      }
    });
    console.log(`✅ Usuários: ${users.length}`);

    // Exportar artigos
    const articles = await prisma.article.findMany({
      include: {
        author: true
      }
    });
    console.log(`✅ Artigos: ${articles.length}`);

    // Criar objeto de backup
    const backup = {
      exportDate: new Date().toISOString(),
      database: 'SQLite',
      version: '1.0',
      data: {
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        articles: articles.map(article => ({
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
          factCheckDate: article.factCheckDate,
          factCheckStatus: article.factCheckStatus,
          authorEmail: article.author.email,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        }))
      }
    };

    // Salvar backup
    const backupPath = path.join(__dirname, '../prisma/backup-sqlite.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log('\n✅ Backup criado com sucesso!');
    console.log(`📁 Arquivo: ${backupPath}`);
    console.log(`📊 Tamanho: ${(fs.statSync(backupPath).size / 1024).toFixed(2)} KB`);

    console.log('\n📋 RESUMO:');
    console.log(`   - ${backup.data.users.length} usuários`);
    console.log(`   - ${backup.data.articles.length} artigos`);

  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
