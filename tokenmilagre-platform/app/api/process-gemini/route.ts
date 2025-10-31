import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Validar API Key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
    }

    // 3. Parse body
    const body = await request.json();
    const { article, articleType } = body;

    if (!article || typeof article !== 'object') {
      return NextResponse.json({ error: 'Artigo inválido' }, { status: 400 });
    }

    if (!articleType || !['news', 'education', 'resource'].includes(articleType)) {
      return NextResponse.json({ error: 'Tipo de artigo inválido' }, { status: 400 });
    }

    // 4. Criar prompt baseado no tipo
    const systemPrompts: Record<string, string> = {
      news: `Você é um processador de artigos de notícias. Sua tarefa é:

1. **Remover referências numéricas** [1], [2], etc do content (IMPORTANTE!)
2. **Validar categoria**: bitcoin, ethereum, defi, politica, nfts, altcoins
3. **Analisar sentiment**: positive, neutral, negative
4. **Gerar slug**: título em kebab-case com data (ex: bitcoin-100k-20251031)
5. **Calcular readTime**: baseado em palavras (250 palavras/min)

**Retornar JSON limpo:**
\`\`\`json
{
  "title": "string",
  "slug": "string-kebab-case-20251031",
  "excerpt": "string",
  "content": "string SEM referências [1][2]",
  "category": "string",
  "tags": ["string"],
  "sentiment": "positive|neutral|negative",
  "readTime": "X min"
}
\`\`\`

**IMPORTANTE**: Remover TODAS as referências numéricas [1], [2], etc do content!`,

      education: `Você é um processador de artigos educacionais. Sua tarefa é:

1. **Remover referências/fontes** do content
2. **Validar categoria**: blockchain, trading, defi, nfts, seguranca, desenvolvimento
3. **Validar level**: iniciante, intermediario, avancado
4. **Gerar slug**: título em kebab-case
5. **Calcular readTime**: baseado em palavras (250 palavras/min)

**Retornar JSON limpo:**
\`\`\`json
{
  "title": "string",
  "slug": "string-kebab-case",
  "description": "string",
  "content": "string SEM referências",
  "category": "string",
  "level": "iniciante|intermediario|avancado",
  "type": "Artigo|Tutorial",
  "tags": ["string"],
  "readTime": "X min"
}
\`\`\``,

      resource: `Você é um processador de recursos/ferramentas. Sua tarefa é:

1. **Validar estrutura** do JSON
2. **Gerar slug**: nome em kebab-case
3. **Validar category**: wallets, exchanges, defi, explorers, tools, browsers
4. **Adicionar campos obrigatórios** se faltarem

**Retornar JSON completo e válido com todas as seções.**`
    };

    // 5. Chamar Gemini API (usando 2.5-flash - mais rápido)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompts[articleType]}\n\n**Artigo para processar:**\n${JSON.stringify(article, null, 2)}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Erro Gemini:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const geminiData = await geminiResponse.json();

    // 6. Extrair resposta
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error('Resposta vazia do Gemini');
    }

    // 7. Parser JSON (remover markdown code blocks se houver)
    let cleanedResponse = responseText;

    // Remover markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Extrair JSON (primeiro { ao último })
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Resposta do Gemini:', responseText);
      throw new Error('Gemini não retornou JSON válido');
    }

    const processedArticle = JSON.parse(jsonMatch[0]);

    // 8. Remover referências [1][2] manualmente (fallback)
    if (processedArticle.content) {
      processedArticle.content = processedArticle.content.replace(/\[\d+\]/g, '');
    }

    // 9. Retornar artigo processado
    return NextResponse.json({
      success: true,
      article: processedArticle
    });

  } catch (error: any) {
    console.error('Erro em /api/process-gemini:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
