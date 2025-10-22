const { PrismaClient } = require('../../lib/generated/prisma');
const prisma = new PrismaClient();

/**
 * Gera um slug único verificando duplicatas no banco de dados
 * @param {string} baseSlug - Slug base (sem sufixo)
 * @returns {Promise<string>} - Slug único garantido
 */
async function generateUniqueSlug(baseSlug) {
  // Tentar slug original primeiro
  const existing = await prisma.article.findUnique({
    where: { slug: baseSlug }
  });

  if (!existing) {
    console.log('✅ Slug disponível:', baseSlug);
    return baseSlug;
  }

  console.log('⚠️  Slug já existe:', baseSlug);
  console.log('🔄 Gerando slug único...');

  // Se já existe, adicionar sufixo incremental
  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (true) {
    const check = await prisma.article.findUnique({
      where: { slug: uniqueSlug }
    });

    if (!check) {
      console.log('✅ Slug único gerado:', uniqueSlug);
      return uniqueSlug;
    }

    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;

    // Limite de segurança (evitar loop infinito)
    if (counter > 100) {
      // Se chegou a 100 tentativas, usar timestamp
      const timestamp = Date.now();
      uniqueSlug = `${baseSlug}-${timestamp}`;
      console.log('⚠️  Muitas duplicatas! Usando timestamp:', uniqueSlug);
      return uniqueSlug;
    }
  }
}

/**
 * Converte título em slug (kebab-case)
 * @param {string} title - Título do artigo
 * @returns {string} - Slug em kebab-case
 */
function titleToSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, ''); // Remove hífens do início/fim
}

/**
 * Gera slug com data automática
 * @param {string} title - Título do artigo
 * @param {Date} date - Data de publicação (opcional, padrão: hoje)
 * @returns {string} - Slug com data no formato YYYYMMDD
 */
function slugWithDate(title, date = new Date()) {
  const baseSlug = titleToSlug(title);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${baseSlug}-${year}${month}${day}`;
}

module.exports = {
  generateUniqueSlug,
  titleToSlug,
  slugWithDate
};

// Se executado diretamente (para testes)
if (require.main === module) {
  const testSlug = process.argv[2] || 'bitcoin-recua-107-mil-medo-extremo-mercado-20251022';

  generateUniqueSlug(testSlug)
    .then(uniqueSlug => {
      console.log('\n📋 Resultado final:', uniqueSlug);
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
