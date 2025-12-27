import { PrismaClient } from '../../lib/generated/prisma';
import { securityArticles } from './security-articles';

const prisma = new PrismaClient();

async function main() {
  console.log('🛡️ Seeding extra security articles...');

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    throw new Error('Nenhum usuário ADMIN encontrado.');
  }

  for (const articleData of securityArticles) {
    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        ...articleData as any,
        authorId: admin.id,
      },
      create: {
        ...articleData as any,
        authorId: admin.id,
      },
    });
    console.log(`✅ Security article seeded: ${articleData.title}`);
  }

  console.log(`\n🎉 ${securityArticles.length} extra security articles seeded!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
