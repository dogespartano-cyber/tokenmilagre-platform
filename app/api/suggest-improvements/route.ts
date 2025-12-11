import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireEditor } from '@/lib/shared/helpers/auth-helpers';
import { checkAIRateLimit } from '@/lib/shared/helpers/rate-limit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  // Autenticação: Apenas ADMIN e EDITOR podem usar esta API (custo de IA)
  const auth = await requireEditor(request);
  if (!auth.success) return auth.response;

  // Rate Limiting: 10 req/min por usuário
  const rateLimit = await checkAIRateLimit(auth.user.id);
  if (!rateLimit.success) return rateLimit.response!;

  try {
    const { article, articleType } = await request.json();

    if (!article) {
      return NextResponse.json(
        { error: 'Artigo é obrigatório' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prompt para análise e sugestões
    const systemPrompt = `Você é um editor especializado em conteúdo sobre criptomoedas e blockchain.

TAREFA: Analise o artigo abaixo e sugira melhorias específicas e acionáveis.

ARTIGO ATUAL:
${JSON.stringify(article, null, 2)}

TIPO: ${articleType || 'desconhecido'}

ANALISE OS SEGUINTES ASPECTOS:

1. **Título (Title)**
   - É chamativo e descritivo?
   - Contém palavras-chave relevantes?
   - Desperta curiosidade sem ser clickbait?

2. **Resumo (Excerpt/Description)**
   - É conciso e informativo?
   - Destaca o ponto principal?
   - Incentiva a leitura?

3. **Estrutura do Conteúdo**
   - Seções estão bem organizadas?
   - Fluxo lógico e coerente?
   - Introdução clara e conclusão forte?

4. **Qualidade do Texto**
   - Linguagem clara e acessível?
   - Sem jargões excessivos?
   - Tom apropriado para o público?

5. **SEO e Keywords**
   - Tags relevantes e bem escolhidas?
   - Categoria apropriada?
   - Palavras-chave estratégicas?

6. **Engajamento**
   - Conteúdo interessante e relevante?
   - Exemplos práticos e aplicáveis?
   - Call-to-action quando apropriado?

FORMATO DA RESPOSTA:
Retorne uma lista de **sugestões específicas e acionáveis** em português, seguindo este formato:

🎯 **[Área]**: Sugestão concreta
💡 **Como aplicar**: Instrução clara para implementar

Exemplo:
🎯 **Título**: Adicionar número ou dado específico para maior impacto
💡 **Como aplicar**: "Bitcoin Atinge Máxima Histórica" → "Bitcoin Atinge US$ 100 Mil pela Primeira Vez em 2024"

IMPORTANTE:
- Seja ESPECÍFICO (não diga "melhore o título", diga COMO melhorar)
- Priorize sugestões de ALTO IMPACTO
- Máximo 6 sugestões
- Seja direto e objetivo
- Foque em melhorias práticas e implementáveis

NÃO retorne JSON, retorne texto em markdown formatado.`;

    const result = await model.generateContent(systemPrompt);
    const suggestions = result.response.text();

    return NextResponse.json({ suggestions });

  } catch (error: any) {
    console.error('Erro ao gerar sugestões:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar sugestões' },
      { status: 500 }
    );
  }
}
