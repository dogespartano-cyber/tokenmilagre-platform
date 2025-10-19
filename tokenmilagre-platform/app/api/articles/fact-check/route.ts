import { NextRequest, NextResponse } from 'next/server';
import matter from 'gray-matter';
import { factCheckArticle, generateFactCheckReport } from '@/lib/services/fact-checker';

// POST /api/articles/fact-check - Verificar fatos de um artigo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdown, threshold, maxClaims } = body;

    if (!markdown) {
      return NextResponse.json(
        { success: false, error: 'Markdown é obrigatório' },
        { status: 400 }
      );
    }

    // Parse frontmatter para extrair título
    const { data: frontmatter, content } = matter(markdown);
    const title = frontmatter.title || 'Artigo sem título';

    console.log(`\n🔍 Iniciando fact-check: "${title}"`);

    // Realizar fact-checking
    const result = await factCheckArticle(content, title, {
      threshold: threshold || 70,
      maxClaims: maxClaims || 10
    });

    // Gerar relatório
    const report = generateFactCheckReport(result);
    console.log('\n' + report);

    return NextResponse.json({
      success: true,
      data: {
        passed: result.passed,
        score: result.score,
        threshold: result.threshold,
        status: result.status,
        totalClaims: result.totalClaims,
        verifiedClaims: result.verifiedClaims,
        failedClaims: result.failedClaims,
        sources: result.sources,
        checkedAt: result.checkedAt,
        searchAPIsUsed: result.searchAPIsUsed,
        verifications: result.verifications.map(v => ({
          claim: v.claim.text,
          verified: v.verified,
          confidence: v.confidence,
          sourcesCount: v.sources.length,
          reasoning: v.reasoning
        })),
        report
      }
    });
  } catch (error) {
    console.error('❌ Erro ao realizar fact-check:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao realizar fact-check'
      },
      { status: 500 }
    );
  }
}
