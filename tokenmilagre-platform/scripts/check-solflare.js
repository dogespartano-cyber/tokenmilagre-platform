const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const solflare = await prisma.resource.findUnique({
    where: { slug: 'solflare-wallet' }
  });

  if (solflare) {
    console.log('\n✅ Solflare encontrado no banco de dados!\n');
    console.log('ID:', solflare.id);
    console.log('Nome:', solflare.name);
    console.log('Slug:', solflare.slug);
    console.log('Categoria:', solflare.category);
    console.log('Criado em:', solflare.createdAt.toLocaleString('pt-BR'));
    console.log('\n📊 Dados:');
    console.log('- Features:', JSON.parse(solflare.features || '[]').length, 'itens');
    console.log('- Security Tips:', JSON.parse(solflare.securityTips || '[]').length, 'itens');
    console.log('- Related Resources:', solflare.relatedResources ? JSON.parse(solflare.relatedResources).length : 0, 'recursos');
    console.log('- Hero Gradient:', solflare.heroGradient);
  } else {
    console.log('\n❌ Solflare NÃO encontrado no banco de dados.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
