/**
 * Script para gerar artigos educacionais usando Perplexity API
 * 
 * Uso: npx tsx scripts/generate-articles-perplexity.ts
 * 
 * NOTA: Requer PERPLEXITY_API_KEY no .env
 */

import { PerplexityAdapter } from '../lib/shared/adapters/perplexity-adapter';
import * as fs from 'fs';
import * as path from 'path';

// Interface para artigo gerado
interface GeneratedArticle {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    type: 'educational';
    category: string;
    level: 'iniciante' | 'intermediario' | 'avancado';
    contentType: 'Artigo' | 'Tutorial' | 'Curso';
    readTime: string;
    warningLevel: 'info' | 'warning' | 'critical';
    tags: string;
    securityTips: string;
    published: boolean;
    citations?: string[];
}

// Definição dos artigos a gerar
const ARTICLES_TO_GENERATE = [
    // DeFi
    {
        slug: 'introducao-defi',
        title: 'Introdução ao DeFi: O que é e Como Funciona',
        category: 'defi',
        level: 'iniciante' as const,
        prompt: 'Escreva um artigo educacional sobre DeFi (Finanças Descentralizadas). Explique o que é, como funciona, principais protocolos (Aave, Uniswap, Compound), vantagens e riscos. Inclua comparação com finanças tradicionais.',
    },
    {
        slug: 'yield-farming-liquidity',
        title: 'Yield Farming e Liquidez: Riscos e Recompensas',
        category: 'defi',
        level: 'intermediario' as const,
        prompt: 'Escreva sobre Yield Farming e provisão de liquidez. Explique AMMs, pools de liquidez, como calcular APY real, riscos de impermanent loss, e estratégias para iniciantes.',
    },
    {
        slug: 'lending-borrowing-cripto',
        title: 'Empréstimos em Cripto: Aave, Compound e Outros',
        category: 'defi',
        level: 'intermediario' as const,
        prompt: 'Explique empréstimos descentralizados. Como funcionam Aave e Compound, colateralização, liquidação, taxas de juros variáveis, riscos e casos de uso práticos.',
    },
    {
        slug: 'impermanent-loss',
        title: 'Impermanent Loss: O Risco Oculto do DeFi',
        category: 'defi',
        level: 'avancado' as const,
        prompt: 'Artigo técnico sobre Impermanent Loss. Fórmulas de cálculo, quando ocorre, como minimizar, comparação entre pools, simulações práticas com exemplos numéricos.',
    },

    // Trading
    {
        slug: 'primeiros-passos-trading',
        title: 'Primeiros Passos no Trading de Criptomoedas',
        category: 'trading',
        level: 'iniciante' as const,
        prompt: 'Guia para iniciantes em trading de cripto. Tipos de ordens (market, limit, stop), diferença entre spot e derivativos, escolha de exchange, gestão básica de capital.',
    },
    {
        slug: 'analise-tecnica-basica',
        title: 'Análise Técnica Básica: Suporte, Resistência e Tendências',
        category: 'trading',
        level: 'intermediario' as const,
        prompt: 'Introdução à análise técnica de criptomoedas. Suporte e resistência, linhas de tendência, médias móveis, RSI, MACD. Foque em conceitos práticos e exemplos visuais.',
    },
    {
        slug: 'gestao-risco-cripto',
        title: 'Gestão de Risco: Stop Loss, Position Sizing e DCA',
        category: 'trading',
        level: 'intermediario' as const,
        prompt: 'Artigo sobre gestão de risco em trading de cripto. Stop loss, take profit, position sizing (regra de 1-2%), DCA (Dollar Cost Averaging), diversificação.',
    },
    {
        slug: 'psicologia-trading',
        title: 'Psicologia do Trading: Emoções e Disciplina',
        category: 'trading',
        level: 'avancado' as const,
        prompt: 'Artigo sobre psicologia do trading. FOMO, FUD, viés de confirmação, overtrading, importância de ter um plano escrito, journaling de trades.',
    },

    // NFTs
    {
        slug: 'introducao-nfts',
        title: 'Introdução aos NFTs: O que São e Como Funcionam',
        category: 'nfts',
        level: 'iniciante' as const,
        prompt: 'Explique NFTs para iniciantes. O que são tokens não-fungíveis, padrões ERC-721 e ERC-1155, casos de uso (arte, gaming, música), como comprar e armazenar.',
    },
    {
        slug: 'como-criar-nft',
        title: 'Como Criar e Vender seu Primeiro NFT',
        category: 'nfts',
        level: 'intermediario' as const,
        prompt: 'Tutorial passo-a-passo para criar NFT. Escolha de blockchain (Ethereum vs Solana), plataformas (OpenSea, Magic Eden), custos de gas, royalties, marketing.',
    },
    {
        slug: 'nfts-utilidade-gaming',
        title: 'NFTs de Utilidade: Gaming, Música e Arte',
        category: 'nfts',
        level: 'intermediario' as const,
        prompt: 'Explore NFTs além de arte digital. Gaming play-to-earn, música e royalties, ticketing, identidade digital, metaverso. Casos reais e futuro do mercado.',
    },

    // Blockchain
    {
        slug: 'como-funciona-blockchain',
        title: 'Como Funciona a Blockchain: Explicação Visual',
        category: 'blockchain',
        level: 'iniciante' as const,
        prompt: 'Explique blockchain de forma visual e didática. Blocos, hash, consenso, descentralização, imutabilidade. Use analogias simples, idealmente com exemplos do dia-a-dia.',
    },
    {
        slug: 'layer2-scaling',
        title: 'Layer 2 e Escalabilidade: Polygon, Arbitrum, Optimism',
        category: 'blockchain',
        level: 'intermediario' as const,
        prompt: 'Artigo sobre soluções Layer 2. Por que são necessárias, tipos (rollups, sidechains), comparação entre Polygon, Arbitrum, Optimism, Base. Como usar na prática.',
    },
    {
        slug: 'smart-contracts',
        title: 'Smart Contracts: O Código que Movimenta o DeFi',
        category: 'blockchain',
        level: 'avancado' as const,
        prompt: 'Explique smart contracts em profundidade. Como funcionam, Solidity básico, riscos de segurança, auditorias, exemplos de código simples.',
    },

    // Staking
    {
        slug: 'staking-para-iniciantes',
        title: 'Staking para Iniciantes: Ganhe Rendimentos Passivos',
        category: 'staking',
        level: 'iniciante' as const,
        prompt: 'Guia completo de staking. O que é, como funciona PoS, onde fazer staking (exchanges vs native), riscos (slashing, unbonding), moedas populares para staking.',
    },
    {
        slug: 'validadores-delegacao',
        title: 'Validadores e Delegação: Escolhendo Onde Delegar',
        category: 'staking',
        level: 'intermediario' as const,
        prompt: 'Como escolher validadores para delegação. Métricas importantes (uptime, comissão, stake), riscos de slashing, diversificação, staking líquido (Lido).',
    },

    // Regulação
    {
        slug: 'declarar-cripto-brasil',
        title: 'Como Declarar Criptomoedas no IR 2025 (Brasil)',
        category: 'regulacao',
        level: 'iniciante' as const,
        prompt: 'Guia para declarar criptomoedas no Imposto de Renda 2025 no Brasil. Obrigatoriedade, como calcular ganhos, formulários da Receita Federal, DARF para vendas acima de R$35.000.',
    },
    {
        slug: 'regulacao-cripto-mundial',
        title: 'Regulação de Criptomoedas: Panorama Mundial 2025',
        category: 'regulacao',
        level: 'intermediario' as const,
        prompt: 'Panorama da regulação de criptomoedas no mundo em 2025. EUA, Europa (MiCA), Brasil, Ásia. Tendências, impacto no mercado, stablecoins.',
    },
];

// Prompt base para artigos
const BASE_SYSTEM_PROMPT = `Você é um especialista em criptomoedas e blockchain escrevendo para a plataforma TokenMilagre.

Requisitos do artigo:
- Idioma: Português brasileiro
- Tamanho: 1500-2500 palavras
- Tom: Didático, acessível, sem jargões desnecessários
- Público: Brasileiros interessados em criptomoedas

Estrutura obrigatória:
1. Introdução - O que é e por que importa
2. Conceitos fundamentais - Explicação clara
3. Exemplos práticos - Casos de uso reais
4. Passo a passo (se aplicável)
5. Riscos e considerações - Alertas de segurança
6. Conclusão - Próximos passos

Formato:
- Use Markdown
- Use emojis moderadamente para destacar pontos (🔐 ⚠️ ✅ ❌ 💡)
- Use blocos de citação (>) para avisos importantes
- Inclua listas e tabelas quando apropriado

Obrigatório no final:
- Disclaimer: "Este artigo é apenas educacional e não constitui recomendação de investimento."
- Data de referência: Dezembro 2024`;

// Função para estimar tempo de leitura
function estimateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
}

// Função para gerar tags baseadas no conteúdo
function generateTags(title: string, category: string, level: string): string {
    const baseTags = [category, level];

    const keywordMap: Record<string, string[]> = {
        defi: ['DeFi', 'finanças descentralizadas', 'smart contracts'],
        trading: ['trading', 'investimento', 'análise'],
        nfts: ['NFT', 'tokens', 'colecionáveis'],
        blockchain: ['blockchain', 'tecnologia', 'descentralização'],
        staking: ['staking', 'renda passiva', 'validadores'],
        regulacao: ['regulação', 'impostos', 'compliance'],
    };

    return JSON.stringify([...baseTags, ...(keywordMap[category] || [])]);
}

// Função para gerar security tips baseado na categoria
function generateSecurityTips(category: string): string {
    const tips: Record<string, Array<{ icon: string; title: string; description: string }>> = {
        defi: [
            { icon: '🔐', title: 'Verifique Contratos', description: 'Sempre verifique se o contrato é auditado antes de interagir.' },
            { icon: '⚠️', title: 'Comece Pequeno', description: 'Teste com valores pequenos antes de comprometer capital significativo.' },
        ],
        trading: [
            { icon: '📊', title: 'Gestão de Risco', description: 'Nunca arrisque mais do que pode perder. Use stop loss.' },
            { icon: '🧠', title: 'Controle Emocional', description: 'Siga seu plano de trading, não suas emoções.' },
        ],
        nfts: [
            { icon: '🔍', title: 'Verifique Autenticidade', description: 'Confirme que o NFT é do criador oficial antes de comprar.' },
            { icon: '💰', title: 'Avalie Liquidez', description: 'Considere se conseguirá vender o NFT no futuro.' },
        ],
        blockchain: [
            { icon: '🔐', title: 'Chaves Privadas', description: 'Nunca compartilhe suas chaves privadas ou seed phrases.' },
            { icon: '🔄', title: 'Mantenha Atualizado', description: 'Use sempre as versões mais recentes de wallets e software.' },
        ],
        staking: [
            { icon: '🔍', title: 'Pesquise Validadores', description: 'Escolha validadores com bom histórico e baixa taxa de slashing.' },
            { icon: '⏰', title: 'Período de Unbonding', description: 'Considere o tempo necessário para retirar seus fundos.' },
        ],
        regulacao: [
            { icon: '📋', title: 'Mantenha Registros', description: 'Guarde todos os registros de transações para declaração.' },
            { icon: '👨‍💼', title: 'Consulte Especialista', description: 'Em caso de dúvidas, consulte um contador especializado em cripto.' },
        ],
    };

    return JSON.stringify(tips[category] || tips.blockchain);
}

// Função principal para gerar artigo
async function generateArticle(
    adapter: PerplexityAdapter,
    articleDef: typeof ARTICLES_TO_GENERATE[0]
): Promise<GeneratedArticle> {
    console.log(`\n📝 Gerando: ${articleDef.title}...`);

    const response = await adapter.chat([
        { role: 'system', content: BASE_SYSTEM_PROMPT },
        { role: 'user', content: articleDef.prompt },
    ]);

    const content = response.choices[0].message.content;
    const citations = response.citations || [];

    // Extrair excerpt (primeiros 160 caracteres do conteúdo limpo)
    const cleanContent = content.replace(/^#.*\n/, '').replace(/\*\*/g, '').trim();
    const excerpt = cleanContent.substring(0, 160).replace(/\n/g, ' ').trim() + '...';

    const article: GeneratedArticle = {
        slug: articleDef.slug,
        title: articleDef.title,
        excerpt,
        content,
        type: 'educational',
        category: articleDef.category,
        level: articleDef.level,
        contentType: 'Artigo',
        readTime: estimateReadTime(content),
        warningLevel: articleDef.category === 'defi' ? 'warning' : 'info',
        tags: generateTags(articleDef.title, articleDef.category, articleDef.level),
        securityTips: generateSecurityTips(articleDef.category),
        published: true,
        citations,
    };

    console.log(`   ✅ Gerado (${article.readTime}, ${citations.length} citações)`);

    return article;
}

// Função para salvar artigos em arquivo seed
function saveToSeedFile(articles: GeneratedArticle[], category: string): void {
    const outputPath = path.join(__dirname, '..', 'prisma', 'seeds', `generated-${category}-articles.ts`);

    const content = `/**
 * Artigos gerados via Perplexity API
 * Categoria: ${category}
 * Gerado em: ${new Date().toISOString()}
 */

export const ${category}Articles = ${JSON.stringify(articles, null, 2)};
`;

    fs.writeFileSync(outputPath, content);
    console.log(`\n💾 Salvo: ${outputPath}`);
}

// Main
async function main() {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
        console.error('❌ PERPLEXITY_API_KEY não encontrada no ambiente');
        console.log('   Configure a variável de ambiente e tente novamente.');
        process.exit(1);
    }

    console.log('🚀 Iniciando geração de artigos com Perplexity API\n');
    console.log(`📊 Total de artigos a gerar: ${ARTICLES_TO_GENERATE.length}`);

    const adapter = new PerplexityAdapter({
        apiKey,
        model: 'sonar-pro', // Current valid model (Dec 2024)
    });

    const articlesByCategory: Record<string, GeneratedArticle[]> = {};

    for (const articleDef of ARTICLES_TO_GENERATE) {
        try {
            const article = await generateArticle(adapter, articleDef);

            if (!articlesByCategory[article.category]) {
                articlesByCategory[article.category] = [];
            }
            articlesByCategory[article.category].push(article);

            // Rate limiting - esperar 2 segundos entre requests
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ Erro ao gerar ${articleDef.slug}:`, error);
        }
    }

    // Salvar por categoria
    for (const [category, articles] of Object.entries(articlesByCategory)) {
        saveToSeedFile(articles, category);
    }

    console.log('\n✅ Geração concluída!');
    console.log(`   Total gerado: ${Object.values(articlesByCategory).flat().length} artigos`);
}

main().catch(console.error);
