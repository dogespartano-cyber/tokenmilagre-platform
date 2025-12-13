/**
 * Script para inserir artigo "Segurança Primeiro" no banco de dados
 * 
 * Uso: npx tsx prisma/seeds/seed-seguranca-primeiro.ts
 */

import { PrismaClient, WarningLevel } from '../../lib/generated/prisma';
import { segurancaPrimeiroArticle, segurancaPrimeiroCitations } from './seguranca-primeiro';

const prisma = new PrismaClient();

// Converter warningLevel string para enum
const articleData = {
    ...segurancaPrimeiroArticle,
    warningLevel: segurancaPrimeiroArticle.warningLevel as WarningLevel,
};

async function main() {
    console.log('🔐 Inserindo artigo "Segurança Primeiro"...');

    // Buscar admin para autoria
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        throw new Error('Nenhum usuário ADMIN encontrado. Execute seed.ts primeiro.');
    }

    // Upsert do artigo (atualiza se já existir)
    const article = await prisma.article.upsert({
        where: { slug: articleData.slug },
        update: {
            ...articleData,
            authorId: admin.id,
        },
        create: {
            ...articleData,
            authorId: admin.id,
        },
    });

    console.log(`✅ Artigo criado/atualizado: ${article.title}`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Slug: ${article.slug}`);

    // Inserir citations (deletar antigas primeiro)
    await prisma.citation.deleteMany({
        where: { articleId: article.id },
    });

    for (const citation of segurancaPrimeiroCitations) {
        await prisma.citation.create({
            data: {
                ...citation,
                articleId: article.id,
            },
        });
    }

    console.log(`✅ ${segurancaPrimeiroCitations.length} citations inseridas`);

    // Verificar
    const createdArticle = await prisma.article.findUnique({
        where: { slug: 'seguranca-primeiro' },
        include: { citations: true },
    });

    console.log('\n📊 Resumo:');
    console.log(`   Título: ${createdArticle?.title}`);
    console.log(`   Nível: ${createdArticle?.level}`);
    console.log(`   Categoria: ${createdArticle?.category}`);
    console.log(`   Tempo de leitura: ${createdArticle?.readTime}`);
    console.log(`   Citations: ${createdArticle?.citations.length}`);
    console.log(`   Quiz: ${createdArticle?.quizData ? 'Sim' : 'Não'}`);
    console.log(`   Publicado: ${createdArticle?.published ? 'Sim' : 'Não'}`);
    console.log('\n🎉 Artigo pronto! Acesse: /educacao/seguranca-primeiro');
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
