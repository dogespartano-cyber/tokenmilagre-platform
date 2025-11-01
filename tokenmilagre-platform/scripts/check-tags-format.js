const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const resources = await prisma.resource.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      tags: true
    }
  });

  console.log(`\n📊 Verificando formato de tags em ${resources.length} recursos...\n`);

  let hasErrors = false;

  for (const resource of resources) {
    console.log(`\n📦 ${resource.name} (${resource.slug})`);
    console.log(`   Tags (raw): ${resource.tags}`);

    try {
      const parsed = JSON.parse(resource.tags);
      if (Array.isArray(parsed)) {
        console.log(`   ✅ Array válido com ${parsed.length} tags`);
      } else {
        console.log(`   ❌ ERRO: JSON parseado não é array!`);
        console.log(`   Tipo: ${typeof parsed}`);
        hasErrors = true;
      }
    } catch (e) {
      console.log(`   ❌ ERRO ao parsear: ${e.message}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log('\n\n⚠️  Encontrados recursos com tags mal formatadas!');
  } else {
    console.log('\n\n✅ Todos os recursos têm tags corretamente formatadas.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
