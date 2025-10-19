#!/usr/bin/env node

const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function deleteArticle(slug) {
  try {
    const article = await prisma.article.delete({
      where: { slug }
    });

    console.log(`✅ Artigo deletado: "${article.title}" (slug: ${slug})`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log(`❌ Artigo não encontrado: ${slug}`);
    } else {
      console.error('❌ Erro ao deletar artigo:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

const slug = process.argv[2];

if (!slug) {
  console.error('❌ Uso: node delete-article.js <slug>');
  process.exit(1);
}

deleteArticle(slug);
