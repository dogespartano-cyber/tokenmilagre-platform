const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const solflare = await prisma.resource.findUnique({
    where: { slug: 'solflare-wallet' }
  });

  const phantom = await prisma.resource.findUnique({
    where: { slug: 'phantom' }
  });

  console.log('\n=== PHANTOM - Features ===\n');
  if (phantom && phantom.features) {
    const features = JSON.parse(phantom.features);
    features.forEach((f, i) => {
      console.log(`${i + 1}. ${f.icon ? f.icon + ' ' : ''}${f.title}`);
      console.log(`   ${f.description.substring(0, 60)}...`);
    });
  }

  console.log('\n=== SOLFLARE - Features ===\n');
  if (solflare && solflare.features) {
    const features = JSON.parse(solflare.features);
    features.forEach((f, i) => {
      console.log(`${i + 1}. ${f.icon ? f.icon + ' ' : '(sem ícone) '}${f.title}`);
      console.log(`   ${f.description.substring(0, 60)}...`);
    });
  }

  console.log('\n=== PHANTOM - Hero Gradient ===');
  console.log(phantom?.heroGradient);

  console.log('\n=== SOLFLARE - Hero Gradient ===');
  console.log(solflare?.heroGradient);

  console.log('\n=== PHANTOM - Security Tips ===\n');
  if (phantom && phantom.securityTips) {
    const tips = JSON.parse(phantom.securityTips);
    tips.forEach((t, i) => {
      console.log(`${i + 1}. ${t.icon ? t.icon + ' ' : ''}${t.title}`);
    });
  }

  console.log('\n=== SOLFLARE - Security Tips ===\n');
  if (solflare && solflare.securityTips) {
    const tips = JSON.parse(solflare.securityTips);
    tips.forEach((t, i) => {
      console.log(`${i + 1}. ${t.icon ? t.icon + ' ' : '(sem ícone) '}${t.title}`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
