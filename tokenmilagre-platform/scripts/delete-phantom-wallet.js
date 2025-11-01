const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.resource.delete({
    where: { slug: 'phantom-wallet' }
  });

  console.log('✅ phantom-wallet deletado com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
