/**
 * Script para inserir TODOS os artigos da trilha "Comece por Aqui"
 * 
 * Uso: npx tsx prisma/seeds/seed-trilha-comece-por-aqui.ts
 */

import { PrismaClient, WarningLevel } from '../../lib/generated/prisma';
import { fundamentosCriptoArticle } from './fundamentos-cripto';
import { segurancaPrimeiroArticle } from './seguranca-primeiro';
import { glossarioEssencialArticle } from './glossario-essencial';
import { comoPesquisarProjetoArticle } from './como-pesquisar-projeto';
import { carteirasECustodiaArticle } from './carteiras-e-custodia';
import { taxasGasERedesArticle } from './taxas-gas-e-redes';
import { golpesComunsCriptoArticle } from './golpes-comuns-cripto';
import { trilhasPorNivelArticle } from './trilhas-por-nivel';

const prisma = new PrismaClient();

// Lista de todos os artigos na ordem da trilha
const allArticles = [
    fundamentosCriptoArticle,
    segurancaPrimeiroArticle,
    glossarioEssencialArticle,
    comoPesquisarProjetoArticle,
    carteirasECustodiaArticle,
    taxasGasERedesArticle,
    golpesComunsCriptoArticle,
    trilhasPorNivelArticle,
];

async function main() {
    console.log('🚀 Inserindo artigos da trilha "Comece por Aqui"...\n');

    // Buscar admin para autoria
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        throw new Error('Nenhum usuário ADMIN encontrado. Execute seed.ts primeiro.');
    }

    let created = 0;
    let updated = 0;

    for (const articleData of allArticles) {
        // Converter warningLevel string para enum
        const data = {
            ...articleData,
            warningLevel: (articleData.warningLevel || 'info') as WarningLevel,
            authorId: admin.id,
        };

        // Upsert do artigo (atualiza se já existir)
        const article = await prisma.article.upsert({
            where: { slug: data.slug },
            update: data,
            create: data,
        });

        // Verificar se foi criado ou atualizado
        const existingArticle = await prisma.article.findUnique({
            where: { slug: data.slug },
        });

        if (existingArticle && existingArticle.createdAt.getTime() === existingArticle.updatedAt.getTime()) {
            created++;
            console.log(`✅ Criado: ${article.title}`);
        } else {
            updated++;
            console.log(`🔄 Atualizado: ${article.title}`);
        }
    }

    console.log('\n📊 Resumo:');
    console.log(`   Total de artigos: ${allArticles.length}`);
    console.log(`   Criados: ${created}`);
    console.log(`   Atualizados: ${updated}`);

    // Verificar
    const trilhaArticles = await prisma.article.findMany({
        where: {
            slug: { in: allArticles.map(a => a.slug) },
            published: true,
        },
        select: {
            slug: true,
            title: true,
            level: true,
            readTime: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    console.log('\n📚 Artigos da Trilha:');
    trilhaArticles.forEach((a, i) => {
        console.log(`   ${i + 1}. [${a.level}] ${a.title} (${a.readTime})`);
    });

    console.log('\n🎉 Trilha "Comece por Aqui" pronta!');
    console.log('   Acesse: /educacao/fundamentos-cripto');
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
