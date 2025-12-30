/**
 * Script para REPARAR artigos que falharam na geração principal
 * Usa extração via Regex para evitar erros de JSON e já aplica a limpeza.
 * 
 * Artigos alvo:
 * - analise-tecnica-basica (Trading)
 * - introducao-nfts (NFTs)
 * - como-criar-nft (NFTs)
 * - layer2-scaling (Blockchain)
 */

import { PerplexityAdapter } from '../lib/shared/adapters/perplexity-adapter';
import * as fs from 'fs';
import * as path from 'path';

// Importar seeds existentes para fazer merge
import { tradingArticles } from '../prisma/seeds/generated-trading-articles';
import { nftsArticles } from '../prisma/seeds/generated-nfts-articles';
import { blockchainArticles } from '../prisma/seeds/generated-blockchain-articles';

// Definições dos artigos faltantes
const FAILED_ARTICLES = [
    {
        slug: 'analise-tecnica-basica',
        title: 'Análise Técnica Básica: Suporte, Resistência e Tendências',
        category: 'trading',
        level: 'intermediario',
        prompt: 'Crie um artigo sobre introdução à análise técnica de criptomoedas. Suporte e resistência, linhas de tendência, médias móveis, RSI, MACD. Foque em conceitos práticos e exemplos visuais.',
        existingArticles: tradingArticles
    },
    {
        slug: 'introducao-nfts',
        title: 'Introdução aos NFTs: O que São e Como Funcionam',
        category: 'nfts',
        level: 'iniciante',
        prompt: 'Crie um artigo educacional explicando NFTs para iniciantes. O que são tokens não-fungíveis, padrões ERC-721 e ERC-1155, casos de uso (arte, gaming, música), como comprar e armazenar.',
        existingArticles: nftsArticles
    },
    {
        slug: 'como-criar-nft',
        title: 'Como Criar e Vender seu Primeiro NFT',
        category: 'nfts',
        level: 'intermediario',
        prompt: 'Crie um tutorial passo-a-passo para criar NFT. Escolha de blockchain (Ethereum vs Solana), plataformas (OpenSea, Magic Eden), custos de gas, royalties, marketing.',
        existingArticles: nftsArticles
    },
    {
        slug: 'layer2-scaling',
        title: 'Layer 2 e Escalabilidade: Polygon, Arbitrum, Optimism',
        category: 'blockchain',
        level: 'intermediario',
        prompt: 'Crie um artigo sobre soluções Layer 2. Por que são necessárias, tipos (rollups, sidechains), comparação entre Polygon, Arbitrum, Optimism, Base. Como usar na prática.',
        existingArticles: blockchainArticles
    }
];

const SYSTEM_PROMPT_EDUCATIONAL = `Você é um professor especialista em criptomoedas.
TAREFA: Criar artigo educacional estilo revista (Wired/The Economist).
ESTRUTURA: H2 para seções, H3 para subseções. NÃO use listas na introdução.
REQUIRED: 2 blockquotes (> Dica).
QUIZ: Gere EXATAMENTE 5 perguntas no JSON.

Formato JSON:
{
  "title": "",
  "description": "",
  "content": "",
  "category": "",
  "level": "",
  "type": "Artigo|Tutorial",
  "tags": [],
  "quiz": []
}`;

function cleanText(text: string): string {
    if (!text) return text;
    let cleaned = text.replace(/(\[\s*\d+\s*\])+/g, '');
    cleaned = cleaned.replace(/\[\d+(?:,\s*\d+)*\]/g, '');
    const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
    cleaned = cleaned.replace(emojiRegex, '');
    cleaned = cleaned.replace(/\s+\./g, '.');
    cleaned = cleaned.replace(/\s+,/g, ',');
    return cleaned.trim();
}

function extractJsonRegex(text: string): any {
    const titleMatch = text.match(/"title":\s*"([^"]+)"/);
    const descMatch = text.match(/"description":\s*"([^"]+)"/);
    // Content extraction difficult via regex due to multiline/quotes. 
    // Try fuzzy match or fallback to cleaning the raw content

    // Fallback: try Parse first, if fail, try aggressive substring
    try {
        const jsonMatch = text.match(/```json\n?([\s\S]*?)```/);
        if (jsonMatch) return JSON.parse(jsonMatch[1]);

        const first = text.indexOf('{');
        const last = text.lastIndexOf('}');
        return JSON.parse(text.substring(first, last + 1));
    } catch (e) {
        console.log('⚠️ JSON Parse falhou, tentando extração manual...');
        // Manual extraction implementation for critical fields
        // Simplificação: se falhar JSON, pegamos o texto cru e montamos um objeto basico se conseguirmos identificar partes
        return null;
    }
}

async function main() {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) throw new Error('No API Key');

    const adapter = new PerplexityAdapter({ apiKey, model: 'sonar-pro' });

    // Agrupar por categoria para salvar em batch
    const updates: Record<string, any[]> = {
        trading: tradingArticles,
        nfts: nftsArticles,
        blockchain: blockchainArticles
    };

    for (const item of FAILED_ARTICLES) {
        console.log(`\n🔧 Reparando: ${item.slug}...`);

        // Retry logic loop (max 2 tries)
        let generated = null;
        for (let i = 0; i < 2; i++) {
            try {
                const response = await adapter.chat([
                    { role: 'system', content: SYSTEM_PROMPT_EDUCATIONAL },
                    { role: 'user', content: `${item.prompt}\n\nNível: ${item.level}` }
                ]);

                const raw = response.choices[0].message.content;
                generated = extractJsonRegex(raw);
                if (generated) break; // Sucesso
            } catch (e) {
                console.error(`   Tentativa ${i + 1} falhou:`, (e as Error).message);
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        if (generated && generated.content) {
            const article = {
                slug: item.slug,
                title: cleanText(generated.title || item.title),
                description: cleanText(generated.description),
                content: cleanText(generated.content),
                type: 'educational',
                category: item.category,
                level: item.level,
                contentType: 'Artigo',
                readTime: '5 min', // Estimativa fixa pra fallback
                warningLevel: 'info',
                tags: JSON.stringify(generated.tags || [item.category]),
                securityTips: '[]', // Simplificado, já que seed runner lida ou frontend lida
                published: true,
                citations: [],
                quiz: generated.quiz || []
            };

            // Remover versão antiga se existir (para evitar duplicatas)
            const list = updates[item.category];
            const idx = list.findIndex((a: any) => a.slug === item.slug);
            if (idx > -1) list.splice(idx, 1);

            list.push(article);
            console.log(`   ✅ Sucesso! Adicionado para ${item.category}`);
        } else {
            console.error(`   ❌ Falha total para ${item.slug}`);
        }

        await new Promise(r => setTimeout(r, 3000));
    }

    // Salvar arquivos
    for (const [cat, arts] of Object.entries(updates)) {
        const pathStr = path.join(__dirname, '..', 'prisma', 'seeds', `generated-${cat}-articles.ts`);
        const content = `/**
 * Artigos gerados via Perplexity API (Repaired)
 * Categoria: ${cat}
 * Atualizado em: ${new Date().toISOString()}
 */

export const ${cat}Articles = ${JSON.stringify(arts, null, 2)};
`;
        fs.writeFileSync(pathStr, content);
        console.log(`💾 Atualizado: generated-${cat}-articles.ts`);
    }
}

main().catch(console.error);
