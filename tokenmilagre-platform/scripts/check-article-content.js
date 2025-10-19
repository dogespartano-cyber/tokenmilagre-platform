const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function checkArticleContent() {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: 'bitcoin-ultrapassa-us-120000-com-inicio-do-uptober-e-forte-entrada-de-capital-institucional' }
    });

    if (!article) {
      console.log('❌ Artigo não encontrado');
      return;
    }

    console.log('📝 Título:', article.title);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 Últimos 500 caracteres do conteúdo:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(article.content.slice(-500));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verificar se contém alguma variação da nota
    const variations = [
      'Nota de Transparência:',
      'Este artigo foi pesquisado via Claude',
      '$MILAGRE Research'
    ];

    console.log('🔍 Verificando variações da nota:\n');
    variations.forEach(text => {
      const found = article.content.includes(text);
      console.log(`${found ? '✅' : '❌'} "${text}": ${found ? 'ENCONTRADO' : 'NÃO encontrado'}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticleContent();
