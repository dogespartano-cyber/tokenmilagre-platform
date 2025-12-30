/**
 * Script de Reparo MANUAL para artigos de regulação.
 * Motivo: O layout quebrou (newlines sumiram) e emojis persistiram no excerpt.
 * Ação: Re-hidratar o markdown e limpar campos sem usar API externa.
 */

import * as fs from 'fs';
import * as path from 'path';
import { regulacaoArticles } from '../prisma/seeds/generated-regulacao-articles';

// Lista de slugs para corrigir
const TARGET_SLUGS = ['declarar-cripto-brasil', 'regulacao-cripto-mundial'];

const HEADER_TITLES = [
    '## 1. Introdução - O que é e por que importa',
    '## 2. Conceitos fundamentais - Explicação clara',
    '## 3. Exemplos práticos - Casos de uso reais',
    '## 4. Passo a passo - Como declarar e pagar',
    '## 4. Passo a passo: Como se adequar à regulação em 2025',
    '## 5. Riscos e considerações - Alertas de segurança',
    '## 6. Conclusão - Próximos passos'
];

function rehydrateMarkdown(text: string): string {
    if (!text) return text;

    let fixed = text;

    // 0. Restaurar H1 (Separar do parágrafo)
    // Padrão: "# Titulo Texto" -> "# Titulo\n\nTexto"
    // Vamos ser específicos para os artigos conhecidos para não quebrar outros
    fixed = fixed.replace(/(# Panorama da Regulação de Criptomoedas no Mundo em 2025)\s+(Bem-vindo)/, '$1\n\n$2');
    fixed = fixed.replace(/(# Guia Completo para Declarar Criptomoedas no Imposto de Renda 2025 no Brasil)\s+(Bem-vindo)/, '$1\n\n$2');

    // 1. Restaurar Headers H2 (Início da linha)
    fixed = fixed.replace(/\s+(##\s)/g, '\n\n$1');
    fixed = fixed.replace(/\.(##\s)/g, '.\n\n$1');

    // 2. Separar Título do Conteúdo (Crucial para o Índice)
    // O texto estava "## Titulo Conteudo". Precisamos "## Titulo\n\nConteudo"
    HEADER_TITLES.forEach(title => {
        // Escapar caracteres regex se necessário (mas aqui são simples)
        // Tentamos dar match no titulo seguido de espaço e qualquer texto
        // E inserimos quebra de linha
        const regex = new RegExp(`(${title})(?![\\n\\r])\\s+`, 'g');
        fixed = fixed.replace(regex, '$1\n\n');
    });

    // 3. Restaurar Headers H3
    fixed = fixed.replace(/\s+(###\s)/g, '\n\n$1');
    fixed = fixed.replace(/\.(###\s)/g, '.\n\n$1');

    // 4. Restaurar Blockquotes
    fixed = fixed.replace(/\s+(>\s\*\*)/g, '\n\n$1');

    // 5. Tabelas - FIX MANUAL ROBUSTO
    // Tabela 1: Imposto de Renda
    const table1Correct = `
| Base de Lucro Mensal | Alíquota |
|---|---|
| Até R$ 5 milhões | 15% |
| R$ 5 mi a R$ 10 mi | 17,5% |
| R$ 10 mi a R$ 30 mi | 20% |
| Acima de R$ 30 mi | 22,5% |

`;
    // Regex ultra-permissiva para pegar a tabela "amassada" (sem newlines)
    // Substituindo 's' flag por [\s\S]
    // Pega desde o cabeçalho até o último valor, tolerando qualquer caracter no meio
    fixed = fixed.replace(/\| Base de Lucro Mensal[\s\S]*?22,5%/g, (match) => {
        console.log('   [DEBUG] Tabela 1 match found & replaced');
        return table1Correct.trim();
    });
    // Fallback: se tiver traços repetidos aglomerados
    fixed = fixed.replace(/\| Base de Lucro Mensal[\s\S]*\|---|[\s\S]*22,5%[\s\S]*?\|/g, (match) => {
        console.log('   [DEBUG] Tabela 1 match found (fallback)');
        return table1Correct.trim();
    });


    // Tabela 2: Regulação
    // USANDO \n EXPLÍCITO para garantir quebra de linha
    const table2Correct = '\n\n| Conceito | O que é? | Exemplo em 2025 |\n|---|---|---|\n| **MiCA (Europa)** | Marco unificado para criptoativos | Licenças para stablecoins e bolsas |\n| **GENIUS Act (EUA)** | Regra federal para stablecoins | Lastro 100%, auditorias obrigatórias |\n| **Ativos Virtuais (Brasil)** | Supervisão do BC para exchanges | Governança e integração ao câmbio |\n\n';

    // Regex para pegar a versão one-liner que o user descreveu
    fixed = fixed.replace(/\| Conceito[\s\S]*?integração ao câmbio[\s\S]*?\|/g, (match) => {
        console.log('   [DEBUG] Tabela 2 match found & replaced');
        return table2Correct;
    });


    // Tabela 3: Impactos Regionais
    const table3Correct = '\n\n| Região | Tendência Principal | Impacto no Mercado |\n| :--- | :--- | :--- |\n| **EUA** | GENIUS Act pró-stablecoins | + Institucionais, ETFs crescem |\n| **Europa** | MiCA harmonizado | Adoção corporativa +50% |\n| **Brasil** | Supervisão BC | Menos fraudes, integração câmbio |\n| **Ásia** | Hubs como HK/SG | Liquidez global, inovação |\n\n';

    fixed = fixed.replace(/\| Região[\s\S]*?Liquidez global, inovação[\s\S]*?\|/g, (match) => {
        console.log('   [DEBUG] Tabela 3 match found & replaced');
        return table3Correct;
    });

    // 6. Listas Numeradas (Novo)
    // Encontra "1. Item" "2. Item" colados em texto anterior.
    // Ex: "texto. 2. Item" -> "texto.\n\n2. Item"
    // Cuidado para não pegar valores monetários ou versões (v2.0).
    // Exigimos Ponto/DoisPontos/Parenteses antes + Espaço + Digito + Ponto + Espaço + Letra Maiúscula
    fixed = fixed.replace(/([.:)])\s+(\d+\.\s+[A-ZÀ-Ú])/g, '$1\n\n$2');

    // Lista Específica do "Passo a passo" (pode não ter Letra Maiúscula em alguns casos ou ter formatação)
    // "1. Escolha jurisdição"
    fixed = fixed.replace(/(\d+\.\s+[A-Z][a-zçãõéáíóú]+:)/g, '\n\n$1');

    // FIX FINAL: Garantir que o item 1 separe da frase introdutória (ex: "siga isso: 1.")
    fixed = fixed.replace(/(:|\.)\s+(1\.\s)/g, '$1\n\n$2');

    // Tabela 4: Ficha no IRPF (declarar-cripto-brasil) - SEVERAMENTE DANIFICADA
    // Problema: header rows faltando, dashes órfãos, newlines entre colunas
    const table4Correct = '\n\n| Ficha no IRPF | O que declarar | Código/Exemplo |\n|---|---|---|\n| Bens e Direitos | Saldos em 31/12 | 08-01 (BTC) |\n| Rend. Isentos | Ganhos isentos (< R$35k) | 05 Ganho de capital |\n| Ganhos de Capital | Lucros tributados (GCAP import) | Automático |\n\n';

    // Match padrão quebrado: começa com dashes e vai até Automático com | final
    fixed = fixed.replace(/-{5,}\|[\s\S]*?Automático[\s\S]*?\|/g, (match) => {
        console.log('   [DEBUG] Tabela 4 (Ficha IRPF) match found & replaced');
        return table4Correct;
    });

    // Remover tabelas duplicadas (Table 1 aparece 2x em declarar-cripto-brasil)
    // Após primeira substituição, pode sobrar resíduo "| Base de Lucro..." sem contexto
    // Remover linhas órfãs de tabela que ficaram
    fixed = fixed.replace(/\| Base de Lucro Mensal[\s\S]*?22,5%[\s\S]*?\| \|/g, '');
    fixed = fixed.replace(/\| \|[\s]*\n/g, '\n');

    return fixed;
}


function cleanEmojiAndRefs(text: string): string {
    if (!text) return text;
    let cleaned = text;

    // Remove refs
    cleaned = cleaned.replace(/(\[\s*\d+\s*\])+/g, '');
    cleaned = cleaned.replace(/\[\d+(?:,\s*\d+)*\]/g, '');

    // Remove Emojis Específicos e Faixas
    // Adicionando \u{1F30D} (Earth) e ranges estendidos
    cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    // Fallback explicito se regex unicode falhar
    cleaned = cleaned.replace(/🌍|✈️|️/g, '');

    return cleaned.trim();
}

function main() {
    console.log('🔧 Iniciando reparo manual de artigos Regulacao...');

    const correctedArticles = regulacaoArticles.map(article => {
        if (!TARGET_SLUGS.includes(article.slug)) return article;

        console.log(`   Processando: ${article.slug}`);

        // Corrigir excerpt (que contém o emoji 🌍)
        // O seed usa 'excerpt', mas o type espera 'description' (ou vice versa). 
        // Vamos limpar ambos se existirem.
        let newExcerpt = (article as any).excerpt || article.description;
        newExcerpt = cleanEmojiAndRefs(newExcerpt);

        // Corrigir content (Re-hidratar + Limpar sujeira residual)
        let newContent = rehydrateMarkdown(article.content);
        newContent = cleanEmojiAndRefs(newContent);

        return {
            ...article,
            excerpt: newExcerpt, // Garantir que está limpo no campo certo
            description: newExcerpt, // Sincronizar
            content: newContent
        };
    });

    const outputPath = path.join(__dirname, '..', 'prisma', 'seeds', `generated-regulacao-articles.ts`);
    const fileContent = `/**
 * Artigos gerados via Perplexity API (MANUAL FIX)
 * Categoria: regulacao
 * Atualizado em: ${new Date().toISOString()}
 */

export const regulacaoArticles = ${JSON.stringify(correctedArticles, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`✅ Salvo com sucesso: ${outputPath}`);
}

main();
