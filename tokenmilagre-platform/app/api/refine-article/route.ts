import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseJSONRobust } from '@/lib/json-sanitizer';
import { validateProcessedArticle } from '@/lib/article-processor-client';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { article, refinementPrompt, articleType } = await request.json();

    if (!article || !refinementPrompt) {
      return NextResponse.json(
        { error: 'Artigo e prompt de refinamento são obrigatórios' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prompt para refinamento baseado no tipo
    const systemPrompt = `Você é um editor especializado em conteúdo sobre criptomoedas e blockchain.

TAREFA: Refinar o artigo seguindo EXATAMENTE as instruções do usuário.

ARTIGO ATUAL:
${JSON.stringify(article, null, 2)}

INSTRUÇÕES DO USUÁRIO: ${refinementPrompt}

⚠️ REGRAS CRÍTICAS DE PRESERVAÇÃO (NUNCA QUEBRE ISSO):

1. **ESTRUTURA MARKDOWN - PRESERVAR EXATAMENTE**:
   ✅ Se uma seção é ## (H2), mantenha como ##
   ✅ Se uma subseção é ### (H3), mantenha como ###
   ✅ NÃO mude hierarquia de headers (## não vira ###, ### não vira ##)
   ✅ NÃO adicione # (H1) em lugar nenhum
   ✅ Mantenha o número de seções H2 (ideal 5-6 para notícias, min 4, max 7)

2. **TAGS (HASHTAGS) - CAMPO CORRETO**:
   ✅ Tags SEMPRE ficam no campo "tags" como array JSON: ["tag1", "tag2", "tag3"]
   ❌ NUNCA coloque hashtags no content como #bitcoin #crypto
   ❌ NUNCA escreva tags como texto corrido no content
   ❌ NUNCA mova tags do campo "tags" para o "content"
   ✅ Mantenha as tags existentes a menos que o usuário peça para mudá-las

3. **ESTRUTURA DO JSON**:
   ✅ Mantenha TODOS os campos: title, excerpt/description, content, category, tags, sentiment, level, etc
   ✅ NÃO remova campos existentes
   ✅ NÃO adicione campos novos não solicitados
   ✅ Mantenha o slug original SEMPRE
   ✅ Preserve coverImage, coverImageAlt, citations se existirem

4. **FORMATAÇÃO DO CONTENT**:
   ❌ NUNCA incluir título H1 (# Título) no início do content
   ❌ NUNCA incluir seção "Fontes", "Referências", "Bibliografia" ao final
   ❌ NUNCA incluir referências numéricas [1][2][3] no texto
   ❌ NUNCA incluir nota de transparência ou disclaimer
   ✅ Content deve começar DIRETO com ## (H2) ou parágrafo introdutório
   ✅ Use \\n\\n para separar parágrafos (quebra dupla)
   ✅ Use ** para negrito, * para itálico
${articleType === 'news' ? `
5. **REGRAS ESPECÍFICAS PARA NOTÍCIAS**:
   ✅ excerpt: Resumo objetivo (1-2 frases, máx 200 chars)
   ✅ content: Começar com ## (primeira seção H2), NÃO repetir excerpt
   ✅ sentiment: positive | neutral | negative
   ✅ Estrutura típica: Lead → Contexto Histórico → Métricas → Perspectivas → Impacto → Conclusão
   ✅ 5-6 seções H2 (mínimo 4, máximo 7)
   ✅ Tom jornalístico, neutro, sem sensacionalismo
   ✅ Citar fontes no texto (ex: "segundo dados da Glassnode")
` : articleType === 'educational' ? `
5. **REGRAS ESPECÍFICAS PARA EDUCAÇÃO**:
   ✅ description: Breve descrição do que aprenderá
   ✅ level: iniciante | intermediario | avancado (mantenha se já existe)
   ✅ category: blockchain | trading | defi | nfts | seguranca | desenvolvimento
   ✅ readTime: tempo estimado (ex: "15 min")
   ✅ Estrutura típica: Introdução → O Que É → Como Funciona → Características → Vantagens/Desvantagens → Casos de Uso → Como Começar
   ✅ Tom educacional, acessível, com exemplos práticos
   ✅ Começar com parágrafo introdutório (não com ##)
` : `
5. **REGRAS ESPECÍFICAS PARA RECURSOS**:
   ✅ description: Breve descrição do recurso
   ✅ category: exchanges | wallets | ferramentas | plataformas
   ✅ Mantenha campos específicos: name, shortDescription, officialUrl, platforms
   ✅ Preserve estrutura de features, howToStartSteps, pros, cons, faq, securityTips
`}

⚠️ INSTRUÇÕES DE REFINAMENTO:
- Aplique SOMENTE as mudanças solicitadas pelo usuário
- Preserve TODO o resto do artigo (estrutura, formatação, campos)
- Se usuário pedir para "adicionar", adicione SEM remover conteúdo existente
- Se usuário pedir para "simplificar", reduza complexidade MANTENDO a estrutura markdown
- Se usuário pedir para "expandir", adicione detalhes DENTRO das seções existentes
- Se usuário pedir para "mudar tom", ajuste linguagem MAS preserve estrutura
- NUNCA reorganize seções a menos que explicitamente solicitado

❌ EXEMPLOS DO QUE **NÃO FAZER**:
- Mover tags do campo "tags" para o content: ❌ "## Bitcoin #crypto #blockchain"
- Adicionar hashtags no texto: ❌ "O mercado de #Bitcoin está..."
- Mudar ## para ###: ❌ "### Contexto Histórico" (se era ##)
- Adicionar H1: ❌ "# Título Principal\\n\\n## Seção..."
- Adicionar fontes ao final: ❌ "## Referências\\n\\n1. CoinDesk..."
- Remover campos: ❌ Deletar "tags" ou "sentiment"
- Quebrar formatação markdown: ❌ "##Seção Sem Espaço" (correto: "## Seção")

✅ FORMATO DE RETORNO:
Retorne APENAS o objeto JSON puro, sem:
- Markdown code blocks (\`\`\`json)
- Texto explicativo antes ou depois
- Comentários no JSON
- Apenas o JSON limpo: { ... }`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // Parsear JSON de forma robusta
    const refinedArticle = parseJSONRobust(responseText, 'refine-article');

    // Validar artigo refinado (apenas para news e educational)
    let validation = null;
    if (articleType === 'news' || articleType === 'educational') {
      validation = validateProcessedArticle(refinedArticle, articleType);
    }

    return NextResponse.json({
      article: refinedArticle,
      validation
    });

  } catch (error: any) {
    console.error('Erro ao refinar artigo:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao refinar artigo' },
      { status: 500 }
    );
  }
}
