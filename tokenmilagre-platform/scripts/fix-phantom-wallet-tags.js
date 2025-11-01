const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const resource = await prisma.resource.findUnique({
    where: { slug: 'phantom-wallet' }
  });

  if (!resource) {
    console.log('❌ Phantom Wallet não encontrado');
    return;
  }

  console.log('\n📦 Recurso: Phantom Wallet');
  console.log('   Tags antes:', resource.tags);

  // Parse double-encoded tags
  let tags = JSON.parse(resource.tags); // Primeira parseada = string
  tags = JSON.parse(tags); // Segunda parseada = array

  console.log('   Tags depois:', JSON.stringify(tags));

  // Atualizar no banco
  await prisma.resource.update({
    where: { slug: 'phantom-wallet' },
    data: {
      tags: JSON.stringify(tags)
    }
  });

  console.log('\n✅ Tags corrigidas com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
