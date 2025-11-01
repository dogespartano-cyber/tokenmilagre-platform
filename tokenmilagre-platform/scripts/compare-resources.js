const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const solflare = await prisma.resource.findUnique({
    where: { slug: 'solflare-wallet' }
  });

  const phantom = await prisma.resource.findUnique({
    where: { slug: 'phantom' }
  });

  console.log('\n=== PHANTOM (Referência) ===\n');
  if (phantom) {
    console.log('Campos preenchidos:');
    Object.keys(phantom).forEach(key => {
      if (phantom[key] !== null && phantom[key] !== '') {
        const value = phantom[key];
        const preview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`  ✅ ${key}: ${preview}`);
      }
    });
  }

  console.log('\n=== SOLFLARE (Novo) ===\n');
  if (solflare) {
    console.log('Campos preenchidos:');
    Object.keys(solflare).forEach(key => {
      if (solflare[key] !== null && solflare[key] !== '') {
        const value = solflare[key];
        const preview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`  ✅ ${key}: ${preview}`);
      }
    });

    console.log('\nCampos vazios/null:');
    Object.keys(solflare).forEach(key => {
      if (solflare[key] === null || solflare[key] === '') {
        console.log(`  ❌ ${key}`);
      }
    });
  }

  console.log('\n=== DIFERENÇAS ===\n');
  if (phantom && solflare) {
    Object.keys(phantom).forEach(key => {
      const phantomHas = phantom[key] !== null && phantom[key] !== '';
      const solflareHas = solflare[key] !== null && solflare[key] !== '';
      
      if (phantomHas && !solflareHas) {
        console.log(`  ⚠️  ${key}: Phantom tem, Solflare está vazio`);
      }
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
