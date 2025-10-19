import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import matter from 'gray-matter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📝 Nota de Transparência (adicionada automaticamente)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TRANSPARENCY_NOTE = `
---

> **📊 Nota de Transparência**
>
> **Publicado por $MILAGRE Research** | Última atualização: {DATE}
>
> Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).

---
`;

/**
 * Verifica se o conteúdo já tem nota de transparência
 */
function hasTransparencyNote(content: string): boolean {
  return content.includes('Nota de Transparência') ||
         content.includes('$MILAGRE Research') ||
         content.includes('Sobre Este Conteúdo');
}

/**
 * Adiciona nota de transparência ao conteúdo markdown
 */
function addTransparencyNote(content: string, date: Date = new Date()): string {
  // Se já tem, retornar sem modificar
  if (hasTransparencyNote(content)) {
    return content;
  }

  // Formatar data
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Preparar nota com data
  const noteWithDate = TRANSPARENCY_NOTE.replace('{DATE}', formattedDate);

  // Tentar adicionar antes da seção "Fontes"
  if (content.includes('**Fontes:**')) {
    return content.replace('**Fontes:**', noteWithDate + '\n**Fontes:**');
  }

  // Tentar adicionar antes do último "---"
  const lastSeparatorIndex = content.lastIndexOf('\n---\n');
  if (lastSeparatorIndex !== -1) {
    return content.substring(0, lastSeparatorIndex) +
           noteWithDate +
           content.substring(lastSeparatorIndex);
  }

  // Se não encontrou local específico, adicionar no final
  return content + '\n' + noteWithDate;
}

// POST /api/articles/import - Importar artigo de Markdown (autenticado)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação via API Key (para scripts) ou Session (para usuários)
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.ARTICLES_API_KEY;

    // Se API Key estiver configurada e for válida, permitir
    if (validApiKey && apiKey === validApiKey) {
      // Autenticado via API Key - prosseguir
    } else {
      // Caso contrário, verificar sessão de usuário
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json(
          { success: false, error: 'Não autenticado. Use API Key ou faça login.' },
          { status: 401 }
        );
      }

      // Verificar se é ADMIN ou EDITOR
      if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
        return NextResponse.json(
          { success: false, error: 'Sem permissão para importar artigos' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { markdown, filename, factCheckResult } = body;

    if (!markdown) {
      return NextResponse.json(
        { success: false, error: 'Markdown é obrigatório' },
        { status: 400 }
      );
    }

    // Parse frontmatter
    const { data: frontmatter, content } = matter(markdown);

    // Validar campos obrigatórios
    const requiredFields = ['title', 'summary', 'category', 'tags', 'sentiment'];
    const missingFields = requiredFields.filter(field => !frontmatter[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Gerar slug do título ou usar o nome do arquivo
    const slug = frontmatter.slug ||
                 filename?.replace(/\.md$/, '').toLowerCase() ||
                 frontmatter.title
                   .toLowerCase()
                   .normalize('NFD')
                   .replace(/[\u0300-\u036f]/g, '')
                   .replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-+|-+$/g, '');

    // Verificar se slug já existe
    const existing = await prisma.article.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Artigo com slug "${slug}" já existe`
        },
        { status: 400 }
      );
    }

    // Manter conteúdo em markdown (não converter para HTML)
    // O ArtigoClient usa ReactMarkdown que precisa de markdown puro
    // ✅ ADICIONAR NOTA DE TRANSPARÊNCIA AUTOMATICAMENTE
    const markdownContent = addTransparencyNote(content);

    // Processar tags
    const tags = typeof frontmatter.tags === 'string'
      ? frontmatter.tags.split(',').map((t: string) => t.trim())
      : frontmatter.tags;

    // Buscar usuário autor (se especificado)
    let authorId: string;

    if (frontmatter.author) {
      const author = await prisma.user.findUnique({
        where: { email: frontmatter.author }
      });

      if (!author) {
        return NextResponse.json(
          {
            success: false,
            error: `Autor "${frontmatter.author}" não encontrado`
          },
          { status: 400 }
        );
      }

      authorId = author.id;
    } else {
      // Usar primeiro admin como autor padrão
      const defaultAuthor = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });

      if (!defaultAuthor) {
        return NextResponse.json(
          { success: false, error: 'Nenhum autor disponível' },
          { status: 500 }
        );
      }

      authorId = defaultAuthor.id;
    }

    // Validar sentiment
    const validSentiments = ['positive', 'neutral', 'negative'];
    const sentiment = validSentiments.includes(frontmatter.sentiment)
      ? frontmatter.sentiment
      : 'neutral';

    // Preparar dados de fact-checking (se fornecidos)
    const factCheckData = factCheckResult ? {
      factCheckScore: factCheckResult.score,
      factCheckSources: JSON.stringify(factCheckResult.sources || []),
      factCheckDate: new Date(factCheckResult.checkedAt),
      factCheckStatus: factCheckResult.status
    } : {};

    // Criar artigo
    const article = await prisma.article.create({
      data: {
        title: frontmatter.title,
        slug,
        content: markdownContent,
        excerpt: frontmatter.summary,
        category: frontmatter.category,
        tags: JSON.stringify(tags),
        sentiment: sentiment,
        published: frontmatter.published !== false, // Publicar por padrão
        authorId,
        ...factCheckData
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        message: `Artigo "${article.title}" importado com sucesso!`
      }
    });
  } catch (error) {
    console.error('Erro ao importar artigo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao importar artigo'
      },
      { status: 500 }
    );
  }
}
