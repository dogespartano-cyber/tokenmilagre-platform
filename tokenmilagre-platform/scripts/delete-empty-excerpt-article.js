const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'estrategias-simples-para-diversificar-seu-portfolio-de-criptoativos';

  // Buscar artigo
  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      excerpt: true
    }
  });

  if (!article) {
    console.log(`❌ Artigo não encontrado: ${slug}`);
    return;
  }

  console.log(`\n📄 Artigo encontrado:`);
  console.log(`   Título: ${article.title}`);
  console.log(`   Excerpt: ${article.excerpt || '❌ VAZIO'}`);
  console.log('');

  // Deletar
  await prisma.article.delete({
    where: { slug }
  });

  console.log('✅ Artigo deletado com sucesso!');
  console.log('');
  console.log('🔄 Agora você pode criar um novo artigo educacional no dashboard.');
  console.log('   A descrição será salva corretamente com a correção aplicada.');
  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
