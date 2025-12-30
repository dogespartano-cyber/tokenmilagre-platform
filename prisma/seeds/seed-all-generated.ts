/**
 * Script para inserir todos os artigos gerados no banco de dados
 * 
 * Uso: npx tsx prisma/seeds/seed-all-generated.ts
 */

import { PrismaClient, WarningLevel } from '../../lib/generated/prisma';
import { defiArticles } from './generated-defi-articles';
import { tradingArticles } from './generated-trading-articles';
import { nftsArticles } from './generated-nfts-articles';
import { blockchainArticles } from './generated-blockchain-articles';
import { stakingArticles } from './generated-staking-articles';
import { regulacaoArticles } from './generated-regulacao-articles';

const prisma = new PrismaClient();

// Combinar todos os artigos
const allArticles = [
    ...defiArticles,
    ...tradingArticles,
    ...nftsArticles,
    ...blockchainArticles,
    ...stakingArticles,
    ...regulacaoArticles,
];

async function main() {
    console.log('🚀 Inserindo artigos gerados no banco de dados...\n');
    console.log(`📊 Total de artigos: ${allArticles.length}`);

    // Buscar admin para autoria
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        throw new Error('Nenhum usuário ADMIN encontrado. Execute npx prisma db seed primeiro.');
    }

    console.log(`\n👤 Autor: ${admin.email}\n`);

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const articleData of allArticles) {
        try {
            // Preparar dados para inserção
            const data = {
                slug: articleData.slug,
                title: articleData.title,
                excerpt: (articleData as { excerpt?: string; description?: string }).excerpt
                    || (articleData as { description?: string }).description,
                content: articleData.content,
                type: articleData.type,
                category: articleData.category,
                level: articleData.level,
                contentType: articleData.contentType,
                readTime: articleData.readTime,
                warningLevel: (articleData.warningLevel || 'info') as WarningLevel,
                tags: articleData.tags,
                securityTips: articleData.securityTips,
                published: articleData.published,
                authorId: admin.id,
                // Sincroniza quiz se existir no seed
                quizData: (articleData as { quiz?: unknown }).quiz
                    ? JSON.stringify((articleData as { quiz: unknown }).quiz)
                    : null,
            };

            // Verificar se já existe
            const existing = await prisma.article.findUnique({
                where: { slug: data.slug },
            });

            if (existing) {
                // Atualizar existente
                await prisma.article.update({
                    where: { slug: data.slug },
                    data,
                });
                updated++;
                console.log(`🔄 Atualizado: ${data.title}`);
            } else {
                // Criar novo
                await prisma.article.create({
                    data,
                });
                created++;
                console.log(`✅ Criado: ${data.title}`);
            }
        } catch (error) {
            const errorMsg = `${articleData.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            errors.push(errorMsg);
            console.error(`❌ Erro: ${errorMsg}`);
        }
    }

    console.log('\n📊 Resumo:');
    console.log(`   Total processado: ${allArticles.length}`);
    console.log(`   Criados: ${created}`);
    console.log(`   Atualizados: ${updated}`);
    console.log(`   Erros: ${errors.length}`);

    if (errors.length > 0) {
        console.log('\n⚠️ Erros:');
        errors.forEach(e => console.log(`   - ${e}`));
    }

    // Verificar contagem final
    const totalArticles = await prisma.article.count();
    const educationalArticles = await prisma.article.count({
        where: { type: 'educational' },
    });

    console.log('\n📈 Estado final do banco:');
    console.log(`   Total de artigos: ${totalArticles}`);
    console.log(`   Artigos educacionais: ${educationalArticles}`);

    console.log('\n🎉 Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro fatal:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
