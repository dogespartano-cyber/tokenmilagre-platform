import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        error: errorData.error?.message || 'Erro ao listar modelos'
      }, { status: response.status });
    }

    const data = await response.json();

    // Filtrar apenas modelos que suportam generateContent
    const models = data.models?.filter((model: any) =>
      model.supportedGenerationMethods?.includes('generateContent')
    ).map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedMethods: model.supportedGenerationMethods
    }));

    return NextResponse.json({
      success: true,
      models,
      totalCount: models?.length || 0
    });

  } catch (error: any) {
    console.error('Erro ao listar modelos Gemini:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao listar modelos'
    }, { status: 500 });
  }
}
