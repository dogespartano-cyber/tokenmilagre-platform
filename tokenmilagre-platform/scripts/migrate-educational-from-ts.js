const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Script para migrar artigos educacionais do arquivo TypeScript hardcoded
 * para o banco de dados PostgreSQL
 */

async function extractArticlesFromTS() {
  const tsFilePath = path.join(__dirname, '../app/educacao/[slug]/page.tsx');
  const content = fs.readFileSync(tsFilePath, 'utf-8');

  // Extrair o array de artigos usando regex
  const arrayMatch = content.match(/const articles: EducationalArticle\[\] = \[([\s\S]*?)\];[\s\S]*?async function getArticle/);

  if (!arrayMatch) {
    throw new Error('Não foi possível encontrar o array de artigos no arquivo TypeScript');
  }

  // Converter o código TypeScript para dados utilizáveis
  // Como é um array JavaScript literal, podemos usar eval com cuidado (ambiente controlado)
  const articlesCode = `[${arrayMatch[1]}]`;

  // Usar Function constructor é mais seguro que eval
  const articles = new Function('return ' + articlesCode)();

  return articles;
}

async function main() {
  console.log('🚀 Iniciando migração de artigos educacionais do TypeScript...\n');

  // Buscar ID do usuário Editor
  const editor = await prisma.user.findUnique({
    where: { email: 'editor@tokenmilagre.xyz' }
  });

  if (!editor) {
    console.error('❌ Usuário editor não encontrado!');
    process.exit(1);
  }

  console.log(`✅ Usuário editor encontrado: ${editor.email} (${editor.id})\n`);

  // Extrair artigos do arquivo TypeScript
  let articles;
  try {
    articles = await extractArticlesFromTS();
    console.log(`📚 Encontrados ${articles.length} artigos no arquivo TypeScript\n`);
  } catch (error) {
    console.error('❌ Erro ao extrair artigos:', error.message);
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      // Verificar se já existe
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug }
      });

      if (existing) {
        console.log(`⏭️  Artigo já existe: ${article.slug}`);
        skipCount++;
        continue;
      }

      // Criar artigo educacional
      const created = await prisma.article.create({
        data: {
          slug: article.slug,
          title: article.title,
          excerpt: article.description, // description do TS vira excerpt no DB
          content: article.content,
          category: article.category,
          level: article.level,
          contentType: article.type, // 'Artigo' ou 'Tutorial'
          readTime: article.readTime,
          tags: JSON.stringify(article.tags),
          type: 'educational', // Marcar como educacional
          published: true,
          authorId: editor.id,
          createdAt: new Date(article.publishedAt),
          updatedAt: new Date(article.publishedAt)
        }
      });

      console.log(`✅ Artigo criado: ${created.title}`);
      console.log(`   📝 Slug: ${created.slug}`);
      console.log(`   📊 Nível: ${created.level}`);
      console.log(`   📖 Tipo: ${created.contentType}`);
      console.log(`   ⏱️  Leitura: ${created.readTime}`);
      console.log(`   🔗 URL: /educacao/${created.slug}\n`);
      successCount++;

    } catch (error) {
      console.error(`❌ Erro ao criar artigo ${article.slug}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Resumo da migração:');
  console.log(`   ✅ Criados: ${successCount}`);
  console.log(`   ⏭️  Ignorados (já existem): ${skipCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📚 Total processado: ${articles.length}`);

  if (successCount > 0) {
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('   Os artigos educacionais agora estão no banco de dados PostgreSQL.');
    console.log('   Próximo passo: atualizar as páginas para buscar do banco.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
