import { NextRequest, NextResponse } from 'next/server';
import { analyzeURL, extractDomain } from '@/lib/url-security/patterns';

/**
 * API Route: POST /api/check-url
 *
 * Verifica se uma URL é segura ou maliciosa
 *
 * Body: { url: string }
 * Response: { safe: boolean, threat?: {...}, cached: boolean, checkedAt: string }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validação
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      );
    }

    // Validação de URL
    let domain: string;
    try {
      domain = extractDomain(url);
    } catch (error) {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      );
    }

    // Análise de segurança
    const analysis = analyzeURL(url);

    // Formatar resposta
    const response: any = {
      safe: analysis.safe,
      cached: false, // TODO: Implementar cache em DB
      checkedAt: new Date().toISOString(),
    };

    // Se não for seguro, incluir detalhes da ameaça
    if (!analysis.safe) {
      response.threat = {
        level: analysis.level,
        reasons: analysis.reasons,
        educationalTip: analysis.educationalTip,
        similarLegitDomain: analysis.similarLegitDomain,
        source: analysis.source,
      };
    }

    // TODO: Salvar resultado em cache (Prisma)
    // TODO: Incrementar contador de verificações
    // TODO: Analytics

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao verificar URL:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

// GET não é permitido
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido. Use POST.' },
    { status: 405 }
  );
}
