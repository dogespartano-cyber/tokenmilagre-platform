const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log(`\n📊 Analisando ${resources.length} recursos...\n`);

  for (const resource of resources) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 ${resource.name} (${resource.slug})`);
    console.log(`${'='.repeat(60)}\n`);

    // Hero Gradient
    console.log('🎨 Hero Gradient:');
    console.log(`   ${resource.heroGradient}`);
    const isValidCSS = resource.heroGradient && resource.heroGradient.includes('linear-gradient');
    console.log(`   ${isValidCSS ? '✅' : '❌'} ${isValidCSS ? 'CSS válido' : 'Formato Tailwind (precisa converter)'}\n`);

    // Features
    if (resource.features) {
      const features = JSON.parse(resource.features);
      console.log(`⚡ Features: ${features.length} itens`);
      const featuresWithIcons = features.filter(f => f.icon).length;
      console.log(`   ${featuresWithIcons > 0 ? '✅' : '❌'} Ícones: ${featuresWithIcons}/${features.length}`);

      if (features.length > 0) {
        console.log(`   Exemplo: ${features[0].icon || '(sem ícone)'} ${features[0].title}`);
      }
    }

    // Security Tips
    if (resource.securityTips) {
      const tips = JSON.parse(resource.securityTips);
      console.log(`\n🔒 Security Tips: ${tips.length} itens`);
      const tipsWithIcons = tips.filter(t => t.icon).length;
      console.log(`   ${tipsWithIcons > 0 ? '✅' : '❌'} Ícones: ${tipsWithIcons}/${tips.length}`);

      if (tips.length > 0) {
        console.log(`   Exemplo: ${tips[0].icon || '(sem ícone)'} ${tips[0].title}`);
      }
    }

    // Related Resources
    console.log(`\n🔗 Recursos Relacionados:`);
    if (resource.relatedResources) {
      const related = JSON.parse(resource.relatedResources);
      console.log(`   ✅ ${related.length} recursos: ${related.join(', ')}`);
    } else {
      console.log(`   ❌ Nenhum`);
    }

    // How To Start Steps
    if (resource.howToStartSteps) {
      const steps = JSON.parse(resource.howToStartSteps);
      console.log(`\n📋 How To Start: ${steps.length} passos`);
    }

    // FAQ
    if (resource.faq) {
      const faq = JSON.parse(resource.faq);
      console.log(`❓ FAQ: ${faq.length} perguntas`);
    }

    // Pros/Cons
    if (resource.pros) {
      const pros = JSON.parse(resource.pros);
      console.log(`👍 Prós: ${pros.length} itens`);
    }
    if (resource.cons) {
      const cons = JSON.parse(resource.cons);
      console.log(`👎 Contras: ${cons.length} itens`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\n📈 RESUMO ESTATÍSTICO\n');

  // Estatísticas
  const withRelated = resources.filter(r => r.relatedResources).length;
  const withValidGradient = resources.filter(r => r.heroGradient && r.heroGradient.includes('linear-gradient')).length;

  console.log(`Recursos com relatedResources: ${withRelated}/${resources.length}`);
  console.log(`Recursos com gradiente CSS válido: ${withValidGradient}/${resources.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
