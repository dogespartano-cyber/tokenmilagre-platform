import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // 1. Validar API Key
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
        }

        // 2. Parse body
        const body = await request.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt é obrigatório' }, { status: 400 });
        }

        // 3. Chamar Gemini 2.5 Flash Image API (Nano Banana)
        // Billing Ativo: Usando modelo de produção
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
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
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        responseModalities: ['IMAGE', 'TEXT']
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Generative AI Error:', errorData);
            return NextResponse.json(
                { error: errorData.error?.message || 'Erro na geração da imagem' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // 4. Extrair imagem da resposta
        const imagePart = data.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.inlineData
        );

        if (!imagePart || !imagePart.inlineData) {
            return NextResponse.json({ error: 'Nenhuma imagem gerada pelo modelo' }, { status: 500 });
        }

        // 5. Retornar a imagem em base64
        return NextResponse.json({
            success: true,
            image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
            mimeType: imagePart.inlineData.mimeType
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
