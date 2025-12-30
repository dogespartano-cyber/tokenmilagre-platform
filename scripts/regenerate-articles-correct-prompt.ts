/**
 * Script para REGENERAR artigos educacionais usando Perplexity API
 * COM O PROMPT CORRETO do sistema TokenMilagre
 * 
 * Uso: npx tsx scripts/regenerate-articles-correct-prompt.ts
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
    description: string;
    content: string;
    type: 'educational';
    category: string;
    level: 'iniciante' | 'intermediario' | 'avancado';
    contentType: 'Artigo' | 'Tutorial';
    readTime: string;
    warningLevel: 'info' | 'warning' | 'critical';
    tags: string;
    securityTips: string;
    published: boolean;
    citations?: string[];
    quiz?: any[];
}

// Definição dos artigos a gerar
const ARTICLES_TO_GENERATE = [
    // DeFi
    {
        slug: 'introducao-defi',
        title: 'Introdução ao DeFi: O que é e Como Funciona',
        category: 'defi',
        level: 'iniciante' as const,
        prompt: 'Crie um artigo educacional completo sobre DeFi (Finanças Descentralizadas). Explique o que é, como funciona, principais protocolos (Aave, Uniswap, Compound), vantagens e riscos. Inclua comparação com finanças tradicionais.',
    },
    {
        slug: 'yield-farming-liquidity',
        title: 'Yield Farming e Liquidez: Riscos e Recompensas',
        category: 'defi',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre Yield Farming e provisão de liquidez. Explique AMMs, pools de liquidez, como calcular APY real, riscos de impermanent loss, e estratégias para iniciantes.',
    },
    {
        slug: 'lending-borrowing-cripto',
        title: 'Empréstimos em Cripto: Aave, Compound e Outros',
        category: 'defi',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre empréstimos descentralizados. Como funcionam Aave e Compound, colateralização, liquidação, taxas de juros variáveis, riscos e casos de uso práticos.',
    },
    {
        slug: 'impermanent-loss',
        title: 'Impermanent Loss: O Risco Oculto do DeFi',
        category: 'defi',
        level: 'avancado' as const,
        prompt: 'Crie um artigo técnico avançado sobre Impermanent Loss. Fórmulas de cálculo, quando ocorre, como minimizar, comparação entre pools, simulações práticas com exemplos numéricos.',
    },

    // Trading
    {
        slug: 'primeiros-passos-trading',
        title: 'Primeiros Passos no Trading de Criptomoedas',
        category: 'trading',
        level: 'iniciante' as const,
        prompt: 'Crie um artigo educacional para iniciantes em trading de cripto. Tipos de ordens (market, limit, stop), diferença entre spot e derivativos, escolha de exchange, gestão básica de capital.',
    },
    {
        slug: 'analise-tecnica-basica',
        title: 'Análise Técnica Básica: Suporte, Resistência e Tendências',
        category: 'trading',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre introdução à análise técnica de criptomoedas. Suporte e resistência, linhas de tendência, médias móveis, RSI, MACD. Foque em conceitos práticos e exemplos visuais.',
    },
    {
        slug: 'gestao-risco-cripto',
        title: 'Gestão de Risco: Stop Loss, Position Sizing e DCA',
        category: 'trading',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre gestão de risco em trading de cripto. Stop loss, take profit, position sizing (regra de 1-2%), DCA (Dollar Cost Averaging), diversificação.',
    },
    {
        slug: 'psicologia-trading',
        title: 'Psicologia do Trading: Emoções e Disciplina',
        category: 'trading',
        level: 'avancado' as const,
        prompt: 'Crie um artigo avançado sobre psicologia do trading. FOMO, FUD, viés de confirmação, overtrading, importância de ter um plano escrito, journaling de trades.',
    },

    // NFTs
    {
        slug: 'introducao-nfts',
        title: 'Introdução aos NFTs: O que São e Como Funcionam',
        category: 'nfts',
        level: 'iniciante' as const,
        prompt: 'Crie um artigo educacional explicando NFTs para iniciantes. O que são tokens não-fungíveis, padrões ERC-721 e ERC-1155, casos de uso (arte, gaming, música), como comprar e armazenar.',
    },
    {
        slug: 'como-criar-nft',
        title: 'Como Criar e Vender seu Primeiro NFT',
        category: 'nfts',
        level: 'intermediario' as const,
        prompt: 'Crie um tutorial passo-a-passo para criar NFT. Escolha de blockchain (Ethereum vs Solana), plataformas (OpenSea, Magic Eden), custos de gas, royalties, marketing.',
    },
    {
        slug: 'nfts-utilidade-gaming',
        title: 'NFTs de Utilidade: Gaming, Música e Arte',
        category: 'nfts',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo explorando NFTs além de arte digital. Gaming play-to-earn, música e royalties, ticketing, identidade digital, metaverso. Casos reais e futuro do mercado.',
    },

    // Blockchain
    {
        slug: 'como-funciona-blockchain',
        title: 'Como Funciona a Blockchain: Explicação Visual',
        category: 'blockchain',
        level: 'iniciante' as const,
        prompt: 'Crie um artigo explicando blockchain de forma visual e didática. Blocos, hash, consenso, descentralização, imutabilidade. Use analogias simples, idealmente com exemplos do dia-a-dia.',
    },
    {
        slug: 'layer2-scaling',
        title: 'Layer 2 e Escalabilidade: Polygon, Arbitrum, Optimism',
        category: 'blockchain',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre soluções Layer 2. Por que são necessárias, tipos (rollups, sidechains), comparação entre Polygon, Arbitrum, Optimism, Base. Como usar na prática.',
    },
    {
        slug: 'smart-contracts',
        title: 'Smart Contracts: O Código que Movimenta o DeFi',
        category: 'blockchain',
        level: 'avancado' as const,
        prompt: 'Crie um artigo avançado sobre smart contracts. Como funcionam, Solidity básico, riscos de segurança, auditorias, exemplos de código simples.',
    },

    // Staking
    {
        slug: 'staking-para-iniciantes',
        title: 'Staking para Iniciantes: Ganhe Rendimentos Passivos',
        category: 'staking',
        level: 'iniciante' as const,
        prompt: 'Crie um guia completo sobre staking para iniciantes. O que é, como funciona PoS, onde fazer staking (exchanges vs native), riscos (slashing, unbonding), moedas populares para staking.',
    },
    {
        slug: 'validadores-delegacao',
        title: 'Validadores e Delegação: Escolhendo Onde Delegar',
        category: 'staking',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre como escolher validadores para delegação. Métricas importantes (uptime, comissão, stake), riscos de slashing, diversificação, staking líquido (Lido).',
    },

    // Regulação
    {
        slug: 'declarar-cripto-brasil',
        title: 'Como Declarar Criptomoedas no IR 2025 (Brasil)',
        category: 'seguranca',
        level: 'iniciante' as const,
        prompt: 'Crie um guia prático para declarar criptomoedas no Imposto de Renda 2025 no Brasil. Obrigatoriedade, como calcular ganhos, formulários da Receita Federal, DARF para vendas acima de R$35.000.',
    },
    {
        slug: 'regulacao-cripto-mundial',
        title: 'Regulação de Criptomoedas: Panorama Mundial 2025',
        category: 'seguranca',
        level: 'intermediario' as const,
        prompt: 'Crie um artigo sobre panorama da regulação de criptomoedas no mundo em 2025. EUA, Europa (MiCA), Brasil, Ásia. Tendências, impacto no mercado, stablecoins.',
    },
];

// ============================================================================
// PROMPT CORRETO DO SISTEMA TOKENMILAGRE
// Copiado de /app/api/chat-perplexity/route.ts (linhas 158-232)
// ============================================================================
const SYSTEM_PROMPT_EDUCATIONAL = `Você é um professor especialista em criptomoedas e blockchain, conhecido por sua didática impecável e profundidade técnica.

**TAREFA:** Criar um artigo educacional definitivo, estruturado e visualmente rico.

**PADRÃO DE QUALIDADE OBRIGATÓRIO:**
1. **Estrutura Lógica:**
   - **Introdução:** Gancho inicial + Definição clara (O que é?).
   - **Conceito/Fundamentos:** Como funciona "por baixo do capô".
   - **Importância/Benefícios:** Por que isso importa no ecossistema.
   - **Exemplos Práticos/Casos de Uso:** Aplicação no mundo real.
   - **Riscos e Desafios:** Visão crítica e equilibrada.
   - **[Título Contextual Final]:** Resumo dos pontos-chave. NUNCA use "Conclusão" como título. Use algo como "O Futuro do [Tema]" ou "Considerações Finais".

2. **Formatação Profissional:**
   - NUNCA use H1 (#). Comece direto com o texto introdutório.
   - Use **H2 (##)** para as seções principais listadas acima.
   - Use **H3 (###)** para quebrar seções longas.
   - Use **negrito** para destacar termos-chave e conceitos importantes.
   - **HARMONIA VISUAL E NARRATIVA (CRÍTICO):**
     - **Estilo de Revista:** Escreva como um artigo de revista (Wired, The Economist), focado em narrativa fluida e envolvente. NÃO escreva como manual técnico ou slide de PowerPoint.
     - **PROIBIDO LISTAS EM:** Introdução, Definição de Conceitos, Importância/Benefícios, Conclusão. Estas seções devem ser 100% texto corrido (parágrafos bem construídos).
     - **LISTAS PERMITIDAS APENAS EM:** "Passo a Passo", "Exemplos Práticos" (se curtos), "Prós e Contras" ou dados estatísticos.
     - **REGRA DE OURO:** Antes de qualquer lista, deve haver pelo menos 2 parágrafos explicativos introduzindo o contexto. NUNCA comece uma seção com uma lista.
   - **PONTUAÇÃO BRASILEIRA:** Use espaços ao redor de travessões ( — ) para separar orações. Evite o padrão americano "colado" (—). Prefira vírgulas para pausas simples.
   - **OBRIGATÓRIO:** Incluir no mínimo **2 blockquotes** (iniciados com >) durante o texto.
     - Exemplo: "> **Dica Pro:** ..." ou "> **Curiosidade:** ..."
     - Use para destacar fatos interessantes, dicas práticas ou avisos importantes.

3. **GRAMÁTICA E ESTILO (MESTRE):**
   - **Português Brasileiro Culto:** Use vocabulário rico e natural do Brasil. Evite repetições de palavras.
   - **Anti-Anglicismos:** NUNCA use estruturas frasais traduzidas literalmente do inglês.
     - ❌ ERRADO: "A Tether é a ponte—que conecta..." (Travessão colado é erro grave).
     - ✅ CORRETO: "A Tether é a ponte — que conecta..." (Espaços obrigatórios).
   - **Conectivos Variados:** Use "Portanto", "Contudo", "Além disso", "Por outro lado" para criar coesão. Evite o uso excessivo de "E" ou "Mas" no início de frases.
   - **Voz Ativa:** Prefira "O mercado valorizou o ativo" em vez de "O ativo foi valorizado pelo mercado".

4. **Tom de Voz:**
   - **Iniciante:** Analogias do dia a dia, zero "tech-speak" sem explicação.
   - **Intermediário:** Foco em mecanismos e interações de sistemas.
   - **Avançado:** Detalhes de protocolo, código (se aplicável), economia de tokens.

**Formato de resposta (JSON):**
\`\`\`json
{
  "title": "Título Educacional Engajador",
  "description": "Descrição clara do que o leitor aprenderá (1-2 frases)",
  "content": "Parágrafo introdutório...\\n\\n## O que é [Tema]?\\n\\nExplicação...\\n\\n## Como Funciona\\n\\n...",
  "category": "blockchain|trading|defi|nfts|seguranca|desenvolvimento",
  "level": "iniciante|intermediario|avancado",
  "type": "Artigo|Tutorial",
  "tags": ["conceito1", "conceito2", "conceito3"],
  "quiz": [
    {
      "id": 1,
      "text": "Pergunta desafiadora sobre o conteúdo?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswer": 0,
      "explanation": "Explicação didática do porquê esta é a correta."
    },
    { "id": 2, "text": "..." },
    { "id": 3, "text": "..." },
    { "id": 4, "text": "..." },
    { "id": 5, "text": "..." }
  ]
}
\`\`\`

**IMPORTANTE SOBRE O QUIZ:**
- Gere **EXATAMENTE 5 PERGUNTAS**.
- As perguntas devem testar a compreensão real, não apenas memorização.
- As explicações devem ser educativas.`;

// Função para estimar tempo de leitura
function estimateReadTime(content: string): string {
    const wordsPerMinute = 250;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
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
        seguranca: [
            { icon: '📋', title: 'Mantenha Registros', description: 'Guarde todos os registros de transações para declaração.' },
            { icon: '👨‍💼', title: 'Consulte Especialista', description: 'Em caso de dúvidas, consulte um contador especializado em cripto.' },
        ],
    };

    return JSON.stringify(tips[category] || tips.blockchain);
}

// Função para parsear resposta JSON da Perplexity
function parsePerplexityResponse(text: string): any {
    console.log('🔍 Tentando parsear resposta...');

    // Estratégia 1: Markdown code blocks
    const jsonMatch = text.match(/```json\n?([\s\S]*?)```/);
    if (jsonMatch) {
        console.log('✅ JSON encontrado em markdown block');
        try {
            return JSON.parse(jsonMatch[1].trim());
        } catch (e) {
            console.error('❌ Erro ao parsear JSON do markdown:', e);
        }
    }

    // Estratégia 2: Extrair do primeiro { ao último }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const extracted = text.substring(firstBrace, lastBrace + 1);
        console.log('🔍 Tentando extrair JSON bruto...');
        try {
            return JSON.parse(extracted);
        } catch (e) {
            console.error('❌ Erro ao parsear JSON extraído:', e);
        }
    }

    console.log('❌ Nenhum JSON válido encontrado');
    return null;
}

// Função principal para gerar artigo
async function generateArticle(
    adapter: PerplexityAdapter,
    articleDef: typeof ARTICLES_TO_GENERATE[0]
): Promise<GeneratedArticle | null> {
    console.log(`\n📝 Gerando: ${articleDef.title}...`);
    console.log(`   Nível: ${articleDef.level}`);

    const response = await adapter.chat([
        { role: 'system', content: SYSTEM_PROMPT_EDUCATIONAL },
        { role: 'user', content: `${articleDef.prompt}\n\nNível do artigo: ${articleDef.level}` },
    ]);

    const rawContent = response.choices[0].message.content;
    const citations = response.citations || [];

    // Parsear JSON da resposta
    const parsed = parsePerplexityResponse(rawContent);

    if (!parsed) {
        console.error(`❌ Falha ao parsear resposta para ${articleDef.slug}`);
        return null;
    }

    const article: GeneratedArticle = {
        slug: articleDef.slug,
        title: parsed.title || articleDef.title,
        description: parsed.description || '',
        content: parsed.content || '',
        type: 'educational',
        category: articleDef.category,
        level: articleDef.level,
        contentType: parsed.type === 'Tutorial' ? 'Tutorial' : 'Artigo',
        readTime: estimateReadTime(parsed.content || ''),
        warningLevel: articleDef.category === 'defi' ? 'warning' : 'info',
        tags: JSON.stringify(parsed.tags || [articleDef.category, articleDef.level]),
        securityTips: generateSecurityTips(articleDef.category),
        published: true,
        citations,
        quiz: parsed.quiz,
    };

    console.log(`   ✅ Gerado (${article.readTime}, ${citations.length} citações, ${parsed.quiz?.length || 0} quiz questions)`);

    return article;
}

// Função para salvar artigos em arquivo seed
function saveToSeedFile(articles: GeneratedArticle[], category: string): void {
    const outputPath = path.join(__dirname, '..', 'prisma', 'seeds', `generated-${category}-articles.ts`);

    const content = `/**
 * Artigos gerados via Perplexity API (PROMPT CORRETO)
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

    console.log('🚀 REGENERANDO artigos com prompt CORRETO do TokenMilagre\n');
    console.log(`📊 Total de artigos a regenerar: ${ARTICLES_TO_GENERATE.length}`);

    const adapter = new PerplexityAdapter({
        apiKey,
        model: 'sonar-pro',
    });

    const articlesByCategory: Record<string, GeneratedArticle[]> = {};
    let successCount = 0;
    let failCount = 0;

    for (const articleDef of ARTICLES_TO_GENERATE) {
        try {
            const article = await generateArticle(adapter, articleDef);

            if (article) {
                if (!articlesByCategory[article.category]) {
                    articlesByCategory[article.category] = [];
                }
                articlesByCategory[article.category].push(article);
                successCount++;
            } else {
                failCount++;
            }

            // Rate limiting - esperar 3 segundos entre requests
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error(`❌ Erro ao gerar ${articleDef.slug}:`, error);
            failCount++;
        }
    }

    // Salvar por categoria
    for (const [category, articles] of Object.entries(articlesByCategory)) {
        saveToSeedFile(articles, category);
    }

    console.log('\n✅ Regeneração concluída!');
    console.log(`   Sucesso: ${successCount} artigos`);
    console.log(`   Falhas: ${failCount} artigos`);
}

main().catch(console.error);
