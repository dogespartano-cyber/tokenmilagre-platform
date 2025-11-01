const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const phantom1 = await prisma.resource.findUnique({
    where: { slug: 'phantom' }
  });

  const phantom2 = await prisma.resource.findUnique({
    where: { slug: 'phantom-wallet' }
  });

  if (!phantom1 || !phantom2) {
    console.log('❌ Não foram encontrados ambos os recursos Phantom');
    return;
  }

  console.log('\n' + '='.repeat(70));
  console.log('COMPARAÇÃO: PHANTOM vs PHANTOM WALLET');
  console.log('='.repeat(70));

  // Informações básicas
  console.log('\n📋 INFORMAÇÕES BÁSICAS\n');
  console.log('Phantom (phantom):');
  console.log(`  Criado em: ${phantom1.createdAt.toLocaleString('pt-BR')}`);
  console.log(`  Visualizações: ${phantom1.views}`);
  console.log(`  URL: ${phantom1.officialUrl}`);

  console.log('\nPhantom Wallet (phantom-wallet):');
  console.log(`  Criado em: ${phantom2.createdAt.toLocaleString('pt-BR')}`);
  console.log(`  Visualizações: ${phantom2.views}`);
  console.log(`  URL: ${phantom2.officialUrl}`);

  // Descrições
  console.log('\n📝 DESCRIÇÕES\n');
  console.log('Phantom:');
  console.log(`  "${phantom1.shortDescription}"`);
  console.log('\nPhantom Wallet:');
  console.log(`  "${phantom2.shortDescription}"`);

  // Hero
  console.log('\n🎨 HERO SECTION\n');
  console.log('Phantom:');
  console.log(`  Título: ${phantom1.heroTitle}`);
  console.log(`  Descrição: ${phantom1.heroDescription.substring(0, 80)}...`);
  console.log(`  Gradiente: ${phantom1.heroGradient}`);

  console.log('\nPhantom Wallet:');
  console.log(`  Título: ${phantom2.heroTitle}`);
  console.log(`  Descrição: ${phantom2.heroDescription.substring(0, 80)}...`);
  console.log(`  Gradiente: ${phantom2.heroGradient}`);

  // Features
  const features1 = JSON.parse(phantom1.features);
  const features2 = JSON.parse(phantom2.features);

  console.log('\n⚡ FEATURES\n');
  console.log(`Phantom: ${features1.length} features`);
  features1.forEach((f, i) => {
    console.log(`  ${i+1}. ${f.icon || '(sem ícone)'} ${f.title}`);
  });

  console.log(`\nPhantom Wallet: ${features2.length} features`);
  features2.forEach((f, i) => {
    console.log(`  ${i+1}. ${f.icon || '(sem ícone)'} ${f.title}`);
  });

  // Security Tips
  const tips1 = JSON.parse(phantom1.securityTips);
  const tips2 = JSON.parse(phantom2.securityTips);

  console.log('\n🔒 SECURITY TIPS\n');
  console.log(`Phantom: ${tips1.length} dicas`);
  tips1.forEach((t, i) => {
    console.log(`  ${i+1}. ${t.icon || '(sem ícone)'} ${t.title}`);
  });

  console.log(`\nPhantom Wallet: ${tips2.length} dicas`);
  tips2.forEach((t, i) => {
    console.log(`  ${i+1}. ${t.icon || '(sem ícone)'} ${t.title}`);
  });

  // Prós e Contras
  const pros1 = JSON.parse(phantom1.pros);
  const cons1 = JSON.parse(phantom1.cons);
  const pros2 = JSON.parse(phantom2.pros);
  const cons2 = JSON.parse(phantom2.cons);

  console.log('\n👍👎 PRÓS E CONTRAS\n');
  console.log(`Phantom: ${pros1.length} prós, ${cons1.length} contras`);
  console.log(`Phantom Wallet: ${pros2.length} prós, ${cons2.length} contras`);

  // FAQ
  const faq1 = JSON.parse(phantom1.faq);
  const faq2 = JSON.parse(phantom2.faq);

  console.log('\n❓ FAQ\n');
  console.log(`Phantom: ${faq1.length} perguntas`);
  console.log(`Phantom Wallet: ${faq2.length} perguntas`);

  // How To Start
  const steps1 = JSON.parse(phantom1.howToStartSteps);
  const steps2 = JSON.parse(phantom2.howToStartSteps);

  console.log('\n📋 COMO COMEÇAR\n');
  console.log(`Phantom: ${steps1.length} passos`);
  console.log(`Phantom Wallet: ${steps2.length} passos`);

  // Related Resources
  console.log('\n🔗 RECURSOS RELACIONADOS\n');
  if (phantom1.relatedResources) {
    const related1 = JSON.parse(phantom1.relatedResources);
    console.log(`Phantom: ${related1.length} recursos - [${related1.join(', ')}]`);
  } else {
    console.log('Phantom: Nenhum');
  }

  if (phantom2.relatedResources) {
    const related2 = JSON.parse(phantom2.relatedResources);
    console.log(`Phantom Wallet: ${related2.length} recursos - [${related2.join(', ')}]`);
  } else {
    console.log('Phantom Wallet: Nenhum');
  }

  // SCORE
  console.log('\n' + '='.repeat(70));
  console.log('📊 ANÁLISE DE QUALIDADE');
  console.log('='.repeat(70) + '\n');

  let score1 = 0;
  let score2 = 0;

  // Critérios
  console.log('Critério                           Phantom    Phantom Wallet');
  console.log('-'.repeat(70));

  // Features com ícones
  const icons1 = features1.filter(f => f.icon).length;
  const icons2 = features2.filter(f => f.icon).length;
  console.log(`Features com ícones                ${icons1}/6        ${icons2}/6`);
  if (icons1 === 6) score1 += 10;
  if (icons2 === 6) score2 += 10;

  // Security tips com ícones
  const iconsTips1 = tips1.filter(t => t.icon).length;
  const iconsTips2 = tips2.filter(t => t.icon).length;
  console.log(`Security tips com ícones           ${iconsTips1}/6        ${iconsTips2}/6`);
  if (iconsTips1 === 6) score1 += 10;
  if (iconsTips2 === 6) score2 += 10;

  // Quantidade de features
  console.log(`Número de features                 ${features1.length}          ${features2.length}`);
  if (features1.length >= 6) score1 += 10;
  if (features2.length >= 6) score2 += 10;

  // Quantidade de security tips
  console.log(`Número de security tips            ${tips1.length}          ${tips2.length}`);
  if (tips1.length >= 6) score1 += 10;
  if (tips2.length >= 6) score2 += 10;

  // Prós e contras
  console.log(`Prós / Contras                     ${pros1.length}/${cons1.length}       ${pros2.length}/${cons2.length}`);
  if (pros1.length >= 8) score1 += 10;
  if (pros2.length >= 8) score2 += 10;

  // FAQ
  console.log(`FAQ                                ${faq1.length}          ${faq2.length}`);
  if (faq1.length >= 4) score1 += 10;
  if (faq2.length >= 4) score2 += 10;

  // How to start
  console.log(`Como começar (passos)              ${steps1.length}          ${steps2.length}`);
  if (steps1.length >= 5) score1 += 10;
  if (steps2.length >= 5) score2 += 10;

  // Related resources
  const hasRelated1 = phantom1.relatedResources ? JSON.parse(phantom1.relatedResources).length : 0;
  const hasRelated2 = phantom2.relatedResources ? JSON.parse(phantom2.relatedResources).length : 0;
  console.log(`Recursos relacionados              ${hasRelated1}          ${hasRelated2}`);
  if (hasRelated1 >= 3) score1 += 10;
  if (hasRelated2 >= 3) score2 += 10;

  // Gradiente CSS válido
  const validGradient1 = phantom1.heroGradient.includes('linear-gradient');
  const validGradient2 = phantom2.heroGradient.includes('linear-gradient');
  console.log(`Gradiente CSS válido               ${validGradient1 ? 'Sim' : 'Não'}        ${validGradient2 ? 'Sim' : 'Não'}`);
  if (validGradient1) score1 += 10;
  if (validGradient2) score2 += 10;

  // Idade (mais antigo = mais tempo testado)
  console.log(`Mais antigo (+ testado)            ${phantom1.createdAt < phantom2.createdAt ? 'Sim' : 'Não'}        ${phantom2.createdAt < phantom1.createdAt ? 'Sim' : 'Não'}`);
  if (phantom1.createdAt < phantom2.createdAt) score1 += 10;
  if (phantom2.createdAt < phantom1.createdAt) score2 += 10;

  console.log('-'.repeat(70));
  console.log(`SCORE TOTAL                        ${score1}/100      ${score2}/100`);
  console.log('='.repeat(70));

  if (score1 > score2) {
    console.log(`\n🏆 VENCEDOR: Phantom (phantom) - ${score1} pontos`);
    console.log('\n💡 RECOMENDAÇÃO: Deletar "phantom-wallet" e manter "phantom"');
  } else if (score2 > score1) {
    console.log(`\n🏆 VENCEDOR: Phantom Wallet (phantom-wallet) - ${score2} pontos`);
    console.log('\n💡 RECOMENDAÇÃO: Deletar "phantom" e manter "phantom-wallet"');
  } else {
    console.log(`\n🤝 EMPATE: Ambos com ${score1} pontos`);
    console.log('\n💡 RECOMENDAÇÃO: Manter o mais antigo (phantom) por ter mais tempo testado');
  }

  console.log('');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
