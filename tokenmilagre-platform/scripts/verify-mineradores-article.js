const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const article = await prisma.article.findUnique({
    where: { slug: 'mineradores-bitcoin-migram-ia-rentabilidade-20251019-1430' },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!article) {
    console.log('❌ Artigo não encontrado');
    return;
  }

  console.log('✅ Notícia verificada com sucesso!\n');
  console.log('📝 Informações:');
  console.log('   ID:', article.id);
  console.log('   Título:', article.title);
  console.log('   Slug:', article.slug);
  console.log('   Categoria:', article.category);
  console.log('   Sentiment:', article.sentiment);
  console.log('   Publicado:', article.published ? 'Sim' : 'Não');
  console.log('   Autor:', article.author.name, `(${article.author.email})`);
  console.log('   Data criação:', article.createdAt.toISOString());
  console.log('\n📊 Estatísticas:');
  console.log('   Tamanho do conteúdo:', article.content.length, 'caracteres');
  console.log('   Tamanho do resumo:', article.excerpt?.length || 0, 'caracteres');
  console.log('   Tags:', JSON.parse(article.tags).join(', '));
  console.log('\n🌐 URL: http://localhost:3000/dashboard/noticias/' + article.slug);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
