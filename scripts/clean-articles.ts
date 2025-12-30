/**
 * Script para limpar "emotion" (emojis) e referências [1][2] do texto dos artigos
 * Sem afetar os ícones de security tips e features controlados
 * 
 * Uso: npx tsx scripts/clean-articles.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Importar os arrays de artigos diretamente
import { defiArticles } from '../prisma/seeds/generated-defi-articles';
import { tradingArticles } from '../prisma/seeds/generated-trading-articles';
import { nftsArticles } from '../prisma/seeds/generated-nfts-articles';
import { blockchainArticles } from '../prisma/seeds/generated-blockchain-articles';
import { stakingArticles } from '../prisma/seeds/generated-staking-articles';
import { regulacaoArticles } from '../prisma/seeds/generated-regulacao-articles';

// Lista de categorias para iterar
const CATEGORIES = {
    defi: defiArticles,
    trading: tradingArticles,
    nfts: nftsArticles,
    blockchain: blockchainArticles,
    staking: stakingArticles,
    regulacao: regulacaoArticles,
};

function cleanText(text: string): string {
    if (!text) return text;

    // 1. Remover citações [1], [1][2], [1, 2]
    // Regex pega [1] e também [1][2] repetidos
    let cleaned = text.replace(/(\[\s*\d+\s*\])+/g, '');
    // Remove também [1, 2]
    cleaned = cleaned.replace(/\[\d+(?:,\s*\d+)*\]/g, '');

    // 2. Remover Emojis - Regex mais agressivo para pegar tudo
    // Inclui ranges de emoticons, dingbats, suplementares, etc.
    const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
    cleaned = cleaned.replace(emojiRegex, '');

    // 3. Limpezas extras de espaços e pontuação
    cleaned = cleaned.replace(/\s+\./g, '.');
    cleaned = cleaned.replace(/\s+,/g, ',');
    // REMOVIDO: cleaned = cleaned.replace(/\s{2,}/g, ' '); // Isso quebrava as newlines do markdown!

    return cleaned.trim();
}

function processCategory(categoryName: string, articles: any[]) {
    console.log(`Processing category: ${categoryName} (${articles.length} articles)`);

    const cleanedArticles = articles.map(article => {
        // Limpar apenas campos de texto livre
        return {
            ...article,
            title: cleanText(article.title),
            description: cleanText(article.description),
            content: cleanText(article.content),
            // Manter quiz, tags, securityTips intactos
        };
    });

    // Salvar arquivo
    const outputPath = path.join(__dirname, '..', 'prisma', 'seeds', `generated-${categoryName}-articles.ts`);
    const fileContent = `/**
 * Artigos gerados via Perplexity API (Limpos de citation/emoji)
 * Categoria: ${categoryName}
 * Atualizado em: ${new Date().toISOString()}
 */

export const ${categoryName}Articles = ${JSON.stringify(cleanedArticles, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`✅ Saved ${categoryName} with ${cleanedArticles.length} clean articles.`);

    // Verificar se funcionou no primeiro artigo
    const sample = cleanedArticles[0];
    if (sample && (sample.content.includes('[1]') || sample.content.match(/[\u2700-\u27BF]/))) {
        console.error(`⚠️ AVISO: Artigo ${sample.slug} ainda pode conter sujeira!`);
    }
}

async function main() {
    console.log('🧹 Iniciando limpeza de artigos (Refined Regex)...');

    for (const [name, articles] of Object.entries(CATEGORIES)) {
        processCategory(name, articles);
    }

    console.log('\n✨ Limpeza concluída! Agora rode o seed runner.');
}

main().catch(console.error);
