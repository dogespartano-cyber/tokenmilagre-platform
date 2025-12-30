/**
 * Script para corrigir o artigo Impermanent Loss que falhou
 * e adicionar ao arquivo de seed existente
 * 
 * Uso: npx tsx scripts/fix-impermanent-loss.ts
 */

import { PerplexityAdapter } from '../lib/shared/adapters/perplexity-adapter';
import { defiArticles } from '../prisma/seeds/generated-defi-articles';
import * as fs from 'fs';
import * as path from 'path';

const ARTICLE_TO_FIX = {
    slug: 'impermanent-loss',
    title: 'Impermanent Loss: O Risco Oculto do DeFi',
    category: 'defi',
    level: 'avancado' as const,
    prompt: 'Crie um artigo técnico avançado sobre Impermanent Loss. Fórmulas de cálculo, quando ocorre, como minimizar, comparação entre pools, simulações práticas com exemplos numéricos.',
};

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

function estimateReadTime(content: string): string {
    const wordsPerMinute = 250;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
}

function generateSecurityTips(category: string): string {
    const tips = {
        icon: '🔐',
        title: 'Verifique Contratos',
        description: 'Sempre verifique se o contrato é auditado antes de interagir.'
    };
    return JSON.stringify([tips, { ...tips, title: 'Comece Pequeno', description: 'Teste com valores baixos.' }]);
}

// Função robusta para limpar JSON antes de parsear
function cleanJsonString(str: string): string {
    // Tenta remover caracteres de escape problemáticos que não sejam json-valid
    return str
        .replace(/\\'/g, "'") // Remove escape de aspas simples
        // .replace(/\\/g, '\\\\') // CUIDADO: Isso pode quebrar escapes válidos
        .replace(/[\u0000-\u001F]+/g, ""); // Remove caracteres de controle
}

async function main() {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) throw new Error('Api key missing');

    const adapter = new PerplexityAdapter({
        apiKey,
        model: 'sonar-pro',
    });

    console.log(`📝 Regenerando: ${ARTICLE_TO_FIX.title}...`);

    const response = await adapter.chat([
        { role: 'system', content: SYSTEM_PROMPT_EDUCATIONAL },
        { role: 'user', content: `${ARTICLE_TO_FIX.prompt}\n\nNível do artigo: ${ARTICLE_TO_FIX.level}` },
    ]);

    let rawContent = response.choices[0].message.content;
    fs.writeFileSync('debug-impermanent.txt', rawContent); // Salvar para debug
    const citations = response.citations || [];

    // Extração do JSON
    const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)```/);
    let jsonStr = jsonMatch ? jsonMatch[1] : rawContent;

    // Fallback para encontrar chaves se não tiver markdown
    if (!jsonMatch) {
        const firstBrace = rawContent.indexOf('{');
        const lastBrace = rawContent.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = rawContent.substring(firstBrace, lastBrace + 1);
        }
    }

    let parsed;
    try {
        parsed = JSON.parse(jsonStr);
    } catch (e) {
        console.log('⚠️ Erro no primeiro parse, tentando limpar string...');
        try {
            // Tentativa de limpeza básica
            parsed = JSON.parse(cleanJsonString(jsonStr));
        } catch (e2) {
            console.error('❌ Falha total ao parsear JSON:', e2);
            console.log('Conteúdo bruto:', jsonStr);
            process.exit(1);
        }
    }

    const newArticle = {
        slug: ARTICLE_TO_FIX.slug,
        title: parsed.title || ARTICLE_TO_FIX.title,
        description: parsed.description || '',
        content: parsed.content || '',
        type: 'educational',
        category: ARTICLE_TO_FIX.category,
        level: ARTICLE_TO_FIX.level,
        contentType: parsed.type === 'Tutorial' ? 'Tutorial' : 'Artigo',
        readTime: estimateReadTime(parsed.content || ''),
        warningLevel: 'warning',
        tags: JSON.stringify(parsed.tags || ['defi', 'avancado']),
        securityTips: generateSecurityTips(ARTICLE_TO_FIX.category),
        published: true,
        citations,
        quiz: parsed.quiz,
    };

    console.log('✅ Artigo regenerado com sucesso!');

    // Atualizar arquivo
    const newArticlesList = [...defiArticles, newArticle];

    const outputPath = path.join(__dirname, '..', 'prisma', 'seeds', 'generated-defi-articles.ts');

    const fileContent = `/**
 * Artigos gerados via Perplexity API (PROMPT CORRETO)
 * Categoria: defi
 * Atualizado em: ${new Date().toISOString()}
 */

export const defiArticles = ${JSON.stringify(newArticlesList, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Arquivo atualizado: ${outputPath}`);
}

main().catch(console.error);
