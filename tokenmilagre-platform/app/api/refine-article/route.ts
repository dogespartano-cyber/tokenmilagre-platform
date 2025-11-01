import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

REGRAS CRÍTICAS:
1. Mantenha a estrutura do JSON (title, excerpt/description, content, category, tags, etc)
2. NO CONTENT: NUNCA incluir título H1 no início
3. NO CONTENT: Começar direto com ## (H2) ou parágrafo introdutório
4. NO CONTENT: NUNCA incluir nota de transparência ou seção de fontes
${articleType === 'news' ? `
5. Para notícias:
   - excerpt: Resumo curto (1-2 frases)
   - content: Começar com ## (seções), NÃO repetir excerpt
   - sentiment: positive | neutral | negative
   - Estrutura: Fato → Contexto → Impacto → Visão → Reflexão → Desafios
   - 5-6 seções H2 ideais (mínimo 4, máximo 7)
` : articleType === 'educational' ? `
5. Para educação:
   - description: Breve descrição
   - level: iniciante | intermediario | avancado
   - category: blockchain | trading | defi | nfts | seguranca | desenvolvimento
   - readTime: tempo estimado (ex: "15 min")
` : `
5. Para recursos:
   - description: Breve descrição
   - category: exchanges | wallets | ferramentas | plataformas
`}

IMPORTANTE:
- Aplique SOMENTE as mudanças solicitadas pelo usuário
- Preserve todo o resto do artigo
- Mantenha o slug original
- Se usuário pedir para "adicionar", adicione conteúdo sem remover o existente
- Se usuário pedir para "simplificar", reduza a complexidade mantendo a informação
- Se usuário pedir para "expandir", adicione mais detalhes e exemplos

RETORNAR: JSON válido com o artigo refinado (SEM markdown code blocks, APENAS o JSON puro).`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    // Extrair JSON
    let jsonMatch = responseText.match(/```json\n?([\s\S]*?)```/);
    let refinedArticle;

    if (jsonMatch) {
      refinedArticle = JSON.parse(jsonMatch[1]);
    } else {
      // Tentar parsear direto
      refinedArticle = JSON.parse(responseText);
    }

    return NextResponse.json({ article: refinedArticle });

  } catch (error: any) {
    console.error('Erro ao refinar artigo:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao refinar artigo' },
      { status: 500 }
    );
  }
}
