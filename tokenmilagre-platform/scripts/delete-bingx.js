const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const resource = await prisma.resource.findUnique({
    where: { slug: 'bingx-exchange' }
  });

  if (!resource) {
    console.log('❌ BingX Exchange não encontrado');
    return;
  }

  console.log('\n📦 Deletando recurso:');
  console.log(`   Nome: ${resource.name}`);
  console.log(`   Slug: ${resource.slug}`);
  console.log(`   Criado em: ${resource.createdAt.toLocaleString('pt-BR')}`);

  await prisma.resource.delete({
    where: { slug: 'bingx-exchange' }
  });

  console.log('\n✅ BingX Exchange deletado com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
