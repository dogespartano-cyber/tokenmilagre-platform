/**
 * Script para REGENERAR o artigo declarar-cripto-brasil que foi corrompido
 * 
 * Uso: npx tsx scripts/regenerate-declarar-cripto.ts
 */

import { PerplexityAdapter } from '../lib/shared/adapters/perplexity-adapter';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Prompt correto do sistema
const SYSTEM_PROMPT_EDUCATIONAL = `Você é um professor especialista em criptomoedas e blockchain, conhecido por sua didática impecável e profundidade técnica.

**TAREFA:** Criar um artigo educacional definitivo, estruturado e visualmente rico.

**PADRÃO DE QUALIDADE OBRIGATÓRIO:**
1. **Estrutura Lógica:**
   - **Introdução:** Gancho inicial + Definição clara (O que é?).
   - **Conceito/Fundamentos:** Como funciona "por baixo do capô".
   - **Importância/Benefícios:** Por que isso importa no ecossistema.
   - **Exemplos Práticos/Casos de Uso:** Aplicação no mundo real.
   - **Riscos e Desafios:** Visão crítica e equilibrada.
   - **[Título Contextual Final]:** Resumo dos pontos-chave. NUNCA use "Conclusão" como título.

2. **Formatação Profissional:**
   - NUNCA use H1 (#). Comece direto com o texto introdutório.
   - Use **H2 (##)** para as seções principais.
   - Use **H3 (###)** para quebrar seções longas.
   - Use **negrito** para destacar termos-chave.
   - **Estilo de Revista:** Escreva como um artigo de revista (Wired, The Economist), focado em narrativa fluida.
   - **PROIBIDO LISTAS EM:** Introdução, Definição de Conceitos, Importância/Benefícios, Conclusão.
   - **LISTAS PERMITIDAS APENAS EM:** "Passo a Passo", "Exemplos Práticos" (se curtos).
   - **OBRIGATÓRIO:** Incluir no mínimo **2 blockquotes** (iniciados com >) durante o texto.
   - **TABELAS:** Quando usar tabelas (alíquotas, comparações), formate corretamente com | e |---|.

3. **GRAMÁTICA E ESTILO:**
   - **Português Brasileiro Culto:** Use vocabulário rico e natural do Brasil.
   - Use conectivos variados: "Portanto", "Contudo", "Além disso".
   - **Voz Ativa:** Prefira construções ativas.

4. **Tom de Voz:** Iniciante - Analogias do dia a dia, zero "tech-speak" sem explicação.

**Formato de resposta (JSON):**
\`\`\`json
{
  "title": "Título Educacional Engajador",
  "description": "Descrição clara do que o leitor aprenderá (1-2 frases)",
  "content": "Parágrafo introdutório...\\n\\n## O que é [Tema]?\\n\\nExplicação...\\n\\n## Como Funciona\\n\\n...",
  "category": "regulacao",
  "level": "iniciante",
  "type": "Artigo",
  "tags": ["conceito1", "conceito2", "conceito3"],
  "quiz": [
    {
      "question": "Pergunta sobre o tema",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctIndex": 0,
      "explanation": "Explicação da resposta correta"
    }
  ]
}
\`\`\`

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional antes ou depois.`;

async function main() {
    console.log('🔄 Regenerando artigo declarar-cripto-brasil...');

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
        console.error('❌ PERPLEXITY_API_KEY não encontrada no .env');
        process.exit(1);
    }

    const perplexity = new PerplexityAdapter({ apiKey, model: 'sonar-pro', timeout: 180000 });

    const userPrompt = `Crie um guia prático e COMPLETO para declarar criptomoedas no Imposto de Renda 2025 no Brasil. O artigo deve conter pelo menos 1500 palavras e incluir:

1. Introdução explicando por que é importante declarar cripto
2. Obrigatoriedade (quem precisa declarar, valores mínimos)
3. Como calcular ganhos de capital (com exemplos numéricos)
4. Tabela de alíquotas progressivas (15%, 17.5%, 20%, 22.5%)
5. Tipos de operações (compra, venda, staking, airdrops)
6. Passo a passo para preencher formulários da Receita Federal
7. Tabela comparativa de fichas do IRPF (Bens e Direitos, Rendimentos Isentos, Ganhos de Capital)
8. DARF para vendas acima de R$35.000/mês
9. Riscos e multas por não declarar
10. Próximos passos para o leitor

IMPORTANTE: O artigo deve ser extenso, detalhado e com narrativa engajadora estilo revista.`;

    try {
        const response = await perplexity.chat([
            { role: 'system', content: SYSTEM_PROMPT_EDUCATIONAL },
            { role: 'user', content: userPrompt }
        ]);

        // Get content from response
        const rawContent = response.choices[0]?.message?.content || '';
        const citations = response.citations || [];

        // Parse JSON response
        let cleanJson = rawContent;
        const jsonMatch = cleanJson.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            cleanJson = jsonMatch[1];
        }

        // Try parsing
        let articleData;
        try {
            articleData = JSON.parse(cleanJson);
        } catch (e) {
            // Try extracting with regex
            const titleMatch = cleanJson.match(/"title"\s*:\s*"([^"]+)"/);
            const descMatch = cleanJson.match(/"description"\s*:\s*"([^"]+)"/);
            const contentMatch = cleanJson.match(/"content"\s*:\s*"([\s\S]*?)"\s*,\s*"(?:category|level|type|tags)"/);

            if (titleMatch && contentMatch) {
                articleData = {
                    title: titleMatch[1],
                    description: descMatch ? descMatch[1] : "Guia completo para declarar criptomoedas no IR 2025.",
                    content: contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
                    category: "regulacao",
                    level: "iniciante",
                    type: "Artigo",
                    tags: ["regulacao", "impostos", "compliance", "IR2025"],
                    quiz: []
                };
            } else {
                throw new Error('Could not parse response');
            }
        }

        console.log(`✅ Artigo gerado: ${articleData.title}`);
        console.log(`   Conteúdo: ${articleData.content.length} caracteres`);

        // Load current file
        const seedPath = path.join(__dirname, '..', 'prisma', 'seeds', 'generated-regulacao-articles.ts');
        const currentContent = fs.readFileSync(seedPath, 'utf-8');

        // Parse current articles
        const articlesMatch = currentContent.match(/export const regulacaoArticles = (\[[\s\S]*\]);/);
        if (!articlesMatch) {
            throw new Error('Could not parse current seed file');
        }

        let articles;
        try {
            articles = eval(articlesMatch[1]);
        } catch (e) {
            // Fallback: just regex replace
            console.log('   Using regex replacement...');
        }

        // Build the new article object
        const newArticle = {
            slug: 'declarar-cripto-brasil',
            title: 'Como Declarar Criptomoedas no IR 2025 (Brasil)',
            excerpt: articleData.description.substring(0, 150) + '...',
            content: articleData.content,
            type: 'educational',
            category: 'regulacao',
            level: 'iniciante',
            contentType: 'Artigo',
            readTime: '7 min',
            warningLevel: 'info',
            tags: JSON.stringify(['regulacao', 'iniciante', 'regulação', 'impostos', 'compliance']),
            securityTips: JSON.stringify([
                { icon: '📋', title: 'Mantenha Registros', description: 'Guarde todos os registros de transações para declaração.' },
                { icon: '👨‍💼', title: 'Consulte Especialista', description: 'Em caso de dúvidas, consulte um contador especializado em cripto.' }
            ]),
            published: true,
            citations: citations,
            description: articleData.description
        };

        // Get the regulacao-cripto-mundial article (preserve it)
        const regulacaoMundialMatch = currentContent.match(/\{\s*"slug":\s*"regulacao-cripto-mundial"[\s\S]*?\n  \}/);
        const regulacaoMundial = regulacaoMundialMatch ? regulacaoMundialMatch[0] : null;

        // Write new file
        const fileContent = `/**
 * Artigos gerados via Perplexity API (REGENERADO)
 * Categoria: regulacao
 * Atualizado em: ${new Date().toISOString()}
 */

export const regulacaoArticles = [
  ${JSON.stringify(newArticle, null, 2)},
  ${regulacaoMundial || ''}
];
`;

        fs.writeFileSync(seedPath, fileContent);
        console.log(`✅ Salvo em: ${seedPath}`);

    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

main();
