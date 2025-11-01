const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const solflare = await prisma.resource.findUnique({
    where: { slug: 'solflare-wallet' }
  });

  if (!solflare) {
    console.log('❌ Solflare não encontrado no banco.');
    return;
  }

  console.log('\n📦 Deletando recurso:');
  console.log('   Nome:', solflare.name);
  console.log('   Slug:', solflare.slug);

  await prisma.resource.delete({
    where: { slug: 'solflare-wallet' }
  });

  console.log('\n✅ Solflare Wallet deletado com sucesso!');
  console.log('\n🔄 Agora você pode criar um novo recurso no dashboard com o padrão completo:');
  console.log('   - 6 features com ícones emoji');
  console.log('   - 6 security tips com ícones emoji');
  console.log('   - 5 passos no guia');
  console.log('   - 4 perguntas FAQ');
  console.log('   - 8 prós e 4 contras');
  console.log('   - 3 recursos relacionados');
  console.log('   - Gradiente CSS válido');
  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
