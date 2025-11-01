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

  console.log('\n📦 Recurso: BingX Exchange');
  console.log('   Tags antes:', resource.tags);

  // Parse double-encoded tags
  let tags = JSON.parse(resource.tags); // Primeira parseada = string
  tags = JSON.parse(tags); // Segunda parseada = array

  console.log('   Tags depois:', JSON.stringify(tags));

  // Atualizar no banco
  await prisma.resource.update({
    where: { slug: 'bingx-exchange' },
    data: {
      tags: JSON.stringify(tags)
    }
  });

  console.log('\n✅ Tags do BingX corrigidas com sucesso!');
  console.log('\n🔄 Agora a página /recursos deve carregar sem erros.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
