import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const PROCESSED_DIR = '/home/destakar/Trabalho/gemini/articles/.processed';

async function restoreProcessedFiles() {
  try {
    console.log('🔄 Restaurando arquivos .processed a partir do banco de dados...\n');

    // Buscar artigos que foram atualizados
    const slugs = [
      'japao-post-bank-lancara-iene-digital-em-2026-20251010-1143',
      'fundo-soberano-de-luxemburgo-investe-em-etf-de-bitcoin-20251010-1156',
      'franca-e-suica-aceleram-regulamentacao-de-criptomoedas-20251010-1306',
      'bitcoin-em-us121k-us122k-fase-de-consolidacao-20251010-1238',
      'europa-acelera-regulamentacao-de-criptomoedas-20251010-1717',
      'bitcoin-acima-de-us121k-analistas-otimistas-para-uptober-20251010-1658',
      'ark-lanca-governanca-dao-e-co-governanca-de-ia-20251010-1753'
    ];

    for (const slug of slugs) {
      const article = await prisma.article.findUnique({ where: { slug } });

      if (article) {
        const filename = `${slug}.md`;
        const filepath = path.join(PROCESSED_DIR, filename);

        // Criar conteúdo markdown completo
        const content = `---
title: "${article.title}"
summary: "${article.excerpt}"
category: ${article.category}
tags: ${article.tags}
sentiment: ${article.sentiment}
author: admin@tokenmilagre.xyz
---

${article.content}
`;

        fs.writeFileSync(filepath, content, 'utf-8');
        console.log(`✅ Restaurado: ${filename}`);
      }
    }

    console.log('\n✨ Arquivos restaurados com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreProcessedFiles();
