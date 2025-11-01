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

    if (!articleType || !['news', 'educational', 'resource'].includes(articleType)) {
      return NextResponse.json({ error: 'Tipo de artigo inválido' }, { status: 400 });
    }

    // 4. Criar prompt baseado no tipo
    const systemPrompts: Record<string, string> = {
      news: `Você é um processador de artigos de notícias. Sua tarefa é:

1. **Remover referências numéricas** [1], [2], etc do content (IMPORTANTE!)
2. **Remover instruções dos títulos** como [Fato Central], [Contexto e Números], etc (IMPORTANTE!)
3. **Validar categoria**: bitcoin, ethereum, defi, politica, nfts, altcoins
4. **Analisar sentiment**: positive, neutral, negative
5. **Gerar slug**: título em kebab-case com data (ex: bitcoin-100k-20251031)
6. **Calcular readTime**: baseado em palavras (250 palavras/min)

**LIMPEZA DE TÍTULOS:**
- ❌ ERRADO: "## [Fato Central] Bitcoin atinge..."
- ✅ CORRETO: "## Bitcoin atinge..."
- ❌ ERRADO: "## [Contexto e Números] Trajetória..."
- ✅ CORRETO: "## Trajetória..."

**Retornar JSON limpo:**
\`\`\`json
{
  "title": "string",
  "slug": "string-kebab-case-20251031",
  "excerpt": "string",
  "content": "string SEM referências [1][2] e SEM colchetes nos títulos",
  "category": "string",
  "tags": ["string"],
  "sentiment": "positive|neutral|negative",
  "readTime": "X min"
}
\`\`\`

**IMPORTANTE**: Remover TODAS as referências numéricas [1], [2] E todos os colchetes com instruções [Texto] dos títulos!`,

      educational: `Você é um processador de artigos educacionais. Sua tarefa é:

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

1. **Manter TODOS os ícones emoji** em features e securityTips (CRÍTICO!)
2. **Converter gradiente Tailwind → CSS** se necessário
   - Se heroGradient contém "from-" ou "to-": converter para linear-gradient()
   - Exemplo: "from-blue-500 to-purple-600" → "linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)"
3. **Validar estrutura** do JSON
4. **Gerar slug**: nome em kebab-case se não existir
5. **Validar category**: wallets, exchanges, defi, explorers, tools, browsers
6. **Preencher relatedResources** se vazio (sugerir 3 recursos similares)
7. **Adicionar campos obrigatórios** se faltarem

**IMPORTANTE**: NÃO remover ícones emoji! Eles são essenciais para o design.

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

    // 8. Limpeza manual do content (fallback)
    if (processedArticle.content) {
      // Remover referências numéricas [1][2][3]
      processedArticle.content = processedArticle.content.replace(/\[\d+\]/g, '');

      // Remover instruções dos títulos como "[Fato Central]", "[Contexto e Números]", etc
      // Regex: ## seguido de colchetes com texto dentro, depois espaço e o resto do título
      processedArticle.content = processedArticle.content.replace(/^(##\s*)\[[\w\s]+\]\s*/gm, '$1');
      processedArticle.content = processedArticle.content.replace(/^(###\s*)\[[\w\s]+\]\s*/gm, '$1');
    }

    // 9. Mapear campos específicos por tipo (unificar nomenclatura)
    if (articleType === 'educational' && processedArticle.description) {
      // Artigos educacionais: description → excerpt (campo do banco)
      processedArticle.excerpt = processedArticle.description;
      delete processedArticle.description;
    }

    if (articleType === 'resource') {
      // Recursos: mapear estrutura gerada para formato da API

      // Campos obrigatórios que podem faltar
      if (!processedArticle.slug && processedArticle.name) {
        processedArticle.slug = processedArticle.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      if (!processedArticle.officialUrl) {
        processedArticle.officialUrl = '#'; // Placeholder
      }

      if (!processedArticle.platforms) {
        processedArticle.platforms = ['Web']; // Default
      }

      if (!processedArticle.tags) {
        processedArticle.tags = [];
      }

      // Converter gradiente Tailwind para CSS
      if (processedArticle.heroGradient && (processedArticle.heroGradient.includes('from-') || processedArticle.heroGradient.includes('to-'))) {
        // Mapeamento Tailwind colors → Hex
        const tailwindColors: Record<string, string> = {
          'blue-400': '#60A5FA', 'blue-500': '#3B82F6', 'blue-600': '#2563EB',
          'purple-400': '#C084FC', 'purple-500': '#A855F7', 'purple-600': '#9333EA',
          'indigo-400': '#818CF8', 'indigo-500': '#6366F1', 'indigo-600': '#4F46E5',
          'violet-400': '#A78BFA', 'violet-500': '#8B5CF6', 'violet-600': '#7C3AED',
          'pink-400': '#F472B6', 'pink-500': '#EC4899', 'pink-600': '#DB2777',
          'green-400': '#4ADE80', 'green-500': '#22C55E', 'green-600': '#16A34A',
          'orange-400': '#FB923C', 'orange-500': '#F97316', 'orange-600': '#EA580C',
          'red-400': '#F87171', 'red-500': '#EF4444', 'red-600': '#DC2626',
        };

        const match = processedArticle.heroGradient.match(/from-(\S+)\s+to-(\S+)/);
        if (match) {
          const fromColor = tailwindColors[match[1]] || '#3B82F6';
          const toColor = tailwindColors[match[2]] || '#9333EA';
          processedArticle.heroGradient = `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
        }
      }

      // Mapear estruturas aninhadas para campos flat
      if (processedArticle.hero) {
        processedArticle.heroDescription = processedArticle.hero.description || processedArticle.hero;
        processedArticle.heroTitle = processedArticle.name;
        if (!processedArticle.heroGradient) {
          processedArticle.heroGradient = 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)'; // Default
        }
        delete processedArticle.hero;
      }

      if (processedArticle.whyGood) {
        processedArticle.whyGoodTitle = processedArticle.whyGood.title || `Por que ${processedArticle.name}?`;
        processedArticle.whyGoodContent = processedArticle.whyGood.content || [];
        delete processedArticle.whyGood;
      }

      if (processedArticle.howToStart) {
        processedArticle.howToStartTitle = processedArticle.howToStart.title || 'Como Começar';
        processedArticle.howToStartSteps = processedArticle.howToStart.steps || [];
        delete processedArticle.howToStart;
      }

      if (processedArticle.prosAndCons) {
        processedArticle.pros = processedArticle.prosAndCons.pros || [];
        processedArticle.cons = processedArticle.prosAndCons.cons || [];
        delete processedArticle.prosAndCons;
      }

      // Garantir arrays vazios para campos opcionais
      processedArticle.faq = processedArticle.faq || [];
      processedArticle.securityTips = processedArticle.securityTips || [];
      processedArticle.features = processedArticle.features || [];

      // Sugerir recursos relacionados se vazio
      if (!processedArticle.relatedResources || processedArticle.relatedResources.length === 0) {
        const relatedByCategory: Record<string, string[]> = {
          'wallets': ['metamask', 'phantom', 'trust-wallet'],
          'exchanges': ['binance', 'coinbase', 'kraken'],
          'defi': ['aave', 'uniswap', 'compound'],
          'explorers': ['etherscan', 'solscan', 'bscscan'],
          'tools': ['coingecko', 'coinmarketcap', 'defillama'],
          'browsers': ['brave', 'opera-crypto', 'metamask']
        };

        const category = processedArticle.category || 'tools';
        processedArticle.relatedResources = relatedByCategory[category] || relatedByCategory['tools'];
      }
    }

    // 10. Retornar artigo processado
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
