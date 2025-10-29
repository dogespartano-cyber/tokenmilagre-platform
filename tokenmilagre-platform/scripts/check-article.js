const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'mercado-de-criptomoedas-em-29102025-bitcoin-se-aproxima-dos-us-115-mil-e-altcoins-reagem-20251029';

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.log('❌ Artigo não encontrado!');
    return;
  }

  console.log('📰 Título:', article.title);
  console.log('📝 Excerpt:', article.excerpt);
  console.log('\n📄 CONTENT (primeiros 1000 caracteres):');
  console.log('─'.repeat(80));
  console.log(article.content.substring(0, 1000));
  console.log('─'.repeat(80));
  console.log('\n✅ Verificações:');
  console.log('  - Começa com H1?', article.content.startsWith('#') && !article.content.startsWith('##') ? '❌ SIM (ERRADO)' : '✅ NÃO');
  console.log('  - Começa com H2?', article.content.startsWith('##') ? '✅ SIM' : '❌ NÃO (ERRADO)');
  console.log('  - Repete excerpt?', article.content.includes(article.excerpt.substring(0, 50)) ? '❌ SIM (ERRADO)' : '✅ NÃO');
  console.log('  - Tem fontes no final?', /\*\*Fontes:\*\*/i.test(article.content) || /\[1\]/i.test(article.content) ? '❌ SIM (ERRADO)' : '✅ NÃO');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
