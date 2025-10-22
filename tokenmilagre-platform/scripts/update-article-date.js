const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const slug = 'bitcoin-recua-107-mil-medo-extremo-mercado-20251022';

  // Atualizar data/hora para agora
  const updated = await prisma.article.update({
    where: { slug },
    data: {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log('✅ Artigo atualizado com sucesso!');
  console.log('📰 Título:', updated.title);
  console.log('🕐 Nova data:', updated.createdAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
  console.log('🌐 URL: http://localhost:3000/dashboard/noticias/' + slug);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao atualizar artigo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
