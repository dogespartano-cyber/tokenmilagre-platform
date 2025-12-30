/**
 * Script para corrigir e salvar o artigo Impermanent Loss via Regex
 * 
 * Uso: npx tsx scripts/finalize-impermanent.ts
 */

import { defiArticles } from '../prisma/seeds/generated-defi-articles';
import * as fs from 'fs';
import * as path from 'path';

function estimateReadTime(content: string): string {
    const wordsPerMinute = 250;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
}

function generateSecurityTips(category: string): string {
    const tips = [
        { icon: '🔐', title: 'Verifique Contratos', description: 'Sempre verifique se o contrato é auditado antes de interagir.' },
        { icon: '⚠️', title: 'Comece Pequeno', description: 'Teste com valores pequenos antes de comprometer capital significativo.' },
    ];
    return JSON.stringify(tips);
}

// Quiz hardcoded do output anterior (já que parsear o array é complexo com regex)
const QUIZ = [
    {
        "id": 1,
        "text": "Qual a fórmula exata do Impermanent Loss para um pool 50/50 AMM com razão de preço d = p1/p0?",
        "options": ["IL = 2√d / (1 + d) - 1", "IL = (√d - 1)^2", "IL = d - 1 / √d", "IL = 1 - 2/(1 + √d)"],
        "correctAnswer": 0,
        "explanation": "Derivada do produto constante x*y=k, essa fórmula captura a perda relativa vs HODL."
    },
    {
        "id": 2,
        "text": "Em uma simulação com d=2 (ETH dobra de preço), qual o IL aproximado em um pool 50/50?",
        "options": ["-2.0%", "-5.7%", "-13.4%", "-20.0%"],
        "correctAnswer": 1,
        "explanation": "Cálculo: 2√2/(1+2)-1 ≈ 0.057 ou -5.7%, mostrando aceleração não-linear."
    },
    {
        "id": 3,
        "text": "Por que o IL é simétrico (mesmo para alta ou baixa de preço)?",
        "options": ["Depende da direção absoluta", "Fórmula usa |d| implícito via √d", "Arbitragistas sempre compram", "Fees compensam downside"],
        "correctAnswer": 1,
        "explanation": "A raiz quadrada de d (ou 1/d para downside) produz magnitude idêntica na fórmula normalizada."
    },
    {
        "id": 4,
        "text": "Qual pool AMM tipicamente minimiza IL para pares estáveis?",
        "options": ["Uniswap v2 50/50", "Balancer 80/20", "Curve stable swap", "SushiSwap v2"],
        "correctAnswer": 2,
        "explanation": "Curva híbrida da Curve otimiza para baixa volatilidade em stables, resultando em IL próximo de zero."
    },
    {
        "id": 5,
        "text": "Em Uniswap v3, como mitigar IL em posições concentradas?",
        "options": ["Aumentar range amplo", "Hedging com perps delta-neutral", "Pesos customizados", "Aumentar slippage"],
        "correctAnswer": 1,
        "explanation": "Hedging neutraliza exposição direcional para superar IL projetado."
    }
];

async function main() {
    console.log('🔧 Extraindo conteúdo via Regex...');

    const debugPath = path.join(__dirname, '..', 'debug-impermanent.txt');
    let rawContent = fs.readFileSync(debugPath, 'utf-8');

    // Tentar extrair Title
    const titleMatch = rawContent.match(/"title":\s*"(.*?)"/);
    const title = titleMatch ? titleMatch[1] : "Impermanent Loss: O Risco Oculto do DeFi";

    // Tentar extrair Description
    const descMatch = rawContent.match(/"description":\s*"(.*?)"/);
    const description = descMatch ? descMatch[1] : "Artigo técnico sobre risco em DeFi";

    // Tentar extrair Content (até "category")
    // Captura tudo entre "content": " e ", "category"
    const contentMatch = rawContent.match(/"content":\s*"([\s\S]*?)",\n\s*"category"/);
    let content = contentMatch ? contentMatch[1] : "";

    if (!content) {
        console.error("❌ Falha na extração do content via regex");
        // Fallback: usar regex mais generoso
        const contentMatch2 = rawContent.match(/"content":\s*"([\s\S]*?)"\s*}/); // Caso seja ultimo campo (improvável)
        if (contentMatch2) content = contentMatch2[1];
    }

    // Limpar escapes excessivos do content extraído (ex: \\n -> \n)
    // No arquivo raw, \n é representado como \ e n. Regex pega como eles são.
    // Preciso converter para string real.
    // JSON.parse(`"${content}"`) falharia pelos mesmos motivos.
    // Vou substituir manualmente sequências comuns
    content = content
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        // Remover backslashes soltos que sobram de LaTeX mal formado, mas manter estrutura visual
        // Ex: \( -> (
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\[/g, '[')
        .replace(/\\\]/g, ']')
        // Remover backslashes restantes se não forem escapes válidos? 
        // Melhor deixar, Markdown aceita.
        ;

    const newArticle = {
        slug: 'impermanent-loss',
        title: title,
        description: description,
        content: content,
        type: 'educational',
        category: 'defi',
        level: 'avancado' as const,
        contentType: 'Artigo',
        readTime: estimateReadTime(content),
        warningLevel: 'warning',
        tags: JSON.stringify(['impermanent-loss', 'defi', 'avancado', 'amm']),
        securityTips: generateSecurityTips('defi'),
        published: true,
        quiz: QUIZ
    };

    // Atualizar arquivo de seed
    const currentArticles = defiArticles.filter(a => a.slug !== 'impermanent-loss');
    const newArticlesList = [...currentArticles, newArticle];

    const outputPath = path.join(__dirname, '..', 'prisma', 'seeds', 'generated-defi-articles.ts');

    const fileContent = `/**
 * Artigos gerados via Perplexity API (PROMPT CORRETO)
 * Categoria: defi
 * Atualizado em: ${new Date().toISOString()}
 */

export const defiArticles = ${JSON.stringify(newArticlesList, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Arquivo gerado com sucesso: ${outputPath}`);
    console.log(`📊 Total de artigos no arquivo: ${newArticlesList.length}`);
}

main().catch(console.error);
