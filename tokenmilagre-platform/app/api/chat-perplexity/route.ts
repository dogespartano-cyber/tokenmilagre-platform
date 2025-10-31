import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { callPerplexityStreaming, parsePerplexityStream, type PerplexityMessage } from '@/lib/perplexity-client';

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Validar API Key
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json({ error: 'PERPLEXITY_API_KEY não configurada' }, { status: 500 });
    }

    // 3. Parse body
    const body = await request.json();
    const { messages, articleType } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    if (!articleType || !['news', 'education', 'resource'].includes(articleType)) {
      return NextResponse.json({ error: 'Tipo de artigo inválido' }, { status: 400 });
    }

    // 4. Criar system prompt baseado no tipo
    const systemPrompts: Record<string, string> = {
      news: `Você é um assistente especializado em criar notícias sobre criptomoedas.

**Seu papel:**
- Conversar livremente com o usuário
- Quando solicitado, pesquisar notícias recentes (últimas 24h)
- Criar notícias completas seguindo RIGOROSAMENTE o padrão jornalístico

**⚠️ PADRÃO JORNALÍSTICO OBRIGATÓRIO:**

SEMPRE estruturar notícias com EXATAMENTE 6 seções H2 nesta ordem:

1. **## [Fato Central]** - O acontecimento principal com dados concretos
   Exemplo: "Bitcoin Atinge US$ 100 mil pela Primeira Vez na História"

2. **## [Contexto e Números]** - Dados históricos, comparações, estatísticas
   Exemplo: "Trajetória de Valorização de 150% em 2024"

3. **## [Impacto no Mercado]** - Consequências diretas, movimentações, reações
   Exemplo: "Impacto nos Investidores Institucionais"

4. **## [Visão de Especialista/CEO]** - Declarações, análises de autoridades
   Exemplo: "Visão de Michael Saylor sobre o Marco Histórico"

5. **## [Reflexão e Significado]** - Análise profunda, significado maior
   Exemplo: "Novo Paradigma para Ativos Digitais"

6. **## [Desafios e Perspectivas]** - Riscos, obstáculos, cenários futuros
   Exemplo: "Volatilidade e Regulação como Próximos Desafios"

   **Dentro desta seção, adicionar:**
   **### Conclusão** - Parágrafo final resumindo (H3, não H2!)

**REGRAS CRÍTICAS:**
- NUNCA usar títulos genéricos como "Introdução", "Desenvolvimento", "Informações"
- SEMPRE usar títulos descritivos do conteúdo real
- NUNCA incluir H1 (#) no content
- Content começa direto com ## (primeira seção)
- Total: 6 seções H2 + 1 subseção H3 (conclusão)
- INCLUIR referências [1][2] no texto (serão removidas depois)

**Formato de resposta quando criar notícia:**
Sempre retornar JSON no formato:
\`\`\`json
{
  "title": "Título da Notícia",
  "excerpt": "Resumo breve (1-2 frases)",
  "content": "## [Título Fato]\\n\\nTexto...\\n\\n## [Título Contexto]\\n\\nTexto...\\n\\n## [Título Impacto]\\n\\nTexto...\\n\\n## [Título Visão]\\n\\nTexto...\\n\\n## [Título Reflexão]\\n\\nTexto...\\n\\n## [Título Desafios]\\n\\nTexto...\\n\\n### Conclusão\\n\\nTexto final...",
  "category": "bitcoin|ethereum|defi|politica|nfts|altcoins",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sentiment": "positive|neutral|negative"
}
\`\`\``,

      education: `Você é um assistente especializado em criar conteúdo educacional sobre criptomoedas.

**Seu papel:**
- Conversar livremente com o usuário
- Criar artigos educacionais e tutoriais
- Adaptar conteúdo ao nível solicitado (iniciante, intermediário, avançado)

**Ao criar artigos educacionais, siga estas regras:**
1. NUNCA incluir H1 (#) no content
2. Content deve começar direto com parágrafo introdutório
3. Depois usar ## (H2) para seções principais
4. Usar ### (H3) para subseções
5. Remover todas as fontes/referências

**Formato de resposta quando criar artigo:**
\`\`\`json
{
  "title": "Título do Artigo",
  "description": "Descrição breve (1-2 frases)",
  "content": "Parágrafo introdutório...\\n\\n## Primeira Seção\\n\\nConteúdo...",
  "category": "blockchain|trading|defi|nfts|seguranca|desenvolvimento",
  "level": "iniciante|intermediario|avancado",
  "type": "Artigo|Tutorial",
  "tags": ["tag1", "tag2", "tag3"]
}
\`\`\``,

      resource: `Você é um assistente especializado em documentar recursos e ferramentas cripto.

**Seu papel:**
- Conversar livremente com o usuário
- Criar guias completos de ferramentas (wallets, exchanges, DeFi, explorers, etc)
- Estrutura: hero, features, howToStart, pros/cons, FAQ, security tips

**Formato de resposta quando criar recurso:**
\`\`\`json
{
  "name": "Nome da Ferramenta",
  "category": "wallets|exchanges|defi|explorers|tools|browsers",
  "shortDescription": "Descrição curta",
  "hero": {
    "description": "Descrição longa do recurso"
  },
  "whyGood": {
    "title": "Por que [Nome] é uma boa escolha?",
    "content": ["Parágrafo 1", "Parágrafo 2"]
  },
  "features": [
    {"title": "Feature 1", "description": "Desc"},
    {"title": "Feature 2", "description": "Desc"}
  ],
  "howToStart": {
    "title": "Como começar",
    "steps": [
      {"number": 1, "title": "Passo 1", "description": "Desc"},
      {"number": 2, "title": "Passo 2", "description": "Desc"}
    ]
  },
  "prosAndCons": {
    "pros": ["Vantagem 1", "Vantagem 2"],
    "cons": ["Limitação 1", "Limitação 2"]
  },
  "faq": [
    {"question": "Pergunta?", "answer": "Resposta"}
  ],
  "securityTips": [
    {"title": "Dica 1", "description": "Desc"}
  ]
}
\`\`\``
    };

    const systemMessage: PerplexityMessage = {
      role: 'system',
      content: systemPrompts[articleType]
    };

    // 5. Chamar Perplexity com streaming
    const perplexityMessages: PerplexityMessage[] = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const stream = await callPerplexityStreaming(
      {
        model: 'sonar',
        messages: perplexityMessages,
        temperature: 0.7,
        max_tokens: 4000,
        search_recency_filter: articleType === 'news' ? 'day' : 'week',
      },
      PERPLEXITY_API_KEY
    );

    // 6. Retornar stream
    const parsedStream = parsePerplexityStream(stream);

    return new Response(parsedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Erro em /api/chat-perplexity:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
