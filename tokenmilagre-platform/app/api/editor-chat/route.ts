import { NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/helpers/auth-helpers';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface EditorChatRequest {
  messages: Message[];
  selectedText?: string; // Texto selecionado pelo usuário
  fullContent?: string; // Conteúdo completo do artigo
  editMode?: 'selection' | 'full'; // Se deve editar apenas seleção ou artigo inteiro
}

// Rate limiting simples
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // 20 requests por minuto (mais generoso para editor)
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação via Clerk
    const auth = await requireEditor(request);
    if (!auth.success) return auth.response;

    const { user } = auth;

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { success: false, error: 'Limite de requisições excedido. Aguarde 1 minuto.' },
        { status: 429 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const body: EditorChatRequest = await request.json();
    const { messages, selectedText, fullContent, editMode = 'full' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensagens inválidas' },
        { status: 400 }
      );
    }

    // Detectar se o usuário está pedindo para editar apenas um trecho específico
    const lastMessageContent = messages[messages.length - 1].content.toLowerCase();
    const hasTrechoEspecifico =
      lastMessageContent.includes('apenas') ||
      lastMessageContent.includes('só') ||
      lastMessageContent.includes('somente') ||
      lastMessageContent.includes('corrija a formatação do texto') ||
      lastMessageContent.includes('corrija o texto') ||
      lastMessageContent.includes('ajuste o texto');

    // Se mencionar trecho específico, extrair texto entre aspas
    let extractedText = null;
    const quotedTextMatch = messages[messages.length - 1].content.match(/"([^"]+)"/);
    if (quotedTextMatch) {
      extractedText = quotedTextMatch[1];
    }

    // Determinar modo real baseado na intenção
    const realEditMode = (hasTrechoEspecifico && extractedText) ? 'selection' : editMode;

    // Separar mensagens de sistema
    const systemMessages = messages.filter(msg => msg.role === 'system');
    const regularMessages = messages.filter(msg => msg.role !== 'system');

    // Última mensagem do usuário
    const lastUserMessage = regularMessages[regularMessages.length - 1];

    if (!lastUserMessage || lastUserMessage.role !== 'user') {
      return NextResponse.json(
        { success: false, error: 'Última mensagem deve ser do usuário' },
        { status: 400 }
      );
    }

    // Construir system instruction baseado no modo de edição
    let systemInstruction = '';

    // Usar texto extraído ou texto selecionado
    const textToEdit = extractedText || selectedText;

    if (realEditMode === 'selection' && textToEdit) {
      // Modo de edição de seleção
      systemInstruction = `Você é um editor de texto especializado em criptomoedas e blockchain.

🎯 **SUA TAREFA**: O usuário pediu para editar APENAS um TRECHO ESPECÍFICO do artigo.

**TEXTO PARA EDITAR**:
"""
${textToEdit.substring(0, 500)}${textToEdit.length > 500 ? '...' : ''}
"""

**⚠️ INSTRUÇÕES CRÍTICAS**:
1. Retorne APENAS o trecho editado (NÃO o artigo inteiro)
2. Mantenha o formato markdown original
3. Aplique APENAS a edição solicitada pelo usuário
4. NÃO adicione explicações antes do bloco markdown
5. NÃO retorne o artigo completo
6. Use este formato exato:

\`\`\`markdown
[APENAS O TRECHO EDITADO AQUI]
\`\`\`

**Mudanças**: [breve explicação do que mudou]

**EXEMPLO CORRETO**:
Se o usuário pedir "corrija a formatação desta tabela", você deve retornar:

\`\`\`markdown
| Coluna 1 | Coluna 2 |
|----------|----------|
| Dado 1   | Dado 2   |
\`\`\`

**Mudanças**: Formatei a tabela corretamente com pipes alinhados.`;

    } else if (fullContent) {
      // Modo de edição completa
      systemInstruction = `Você é um editor de texto especializado em criptomoedas e blockchain.

🎯 **SUA TAREFA**: Editar o artigo completo aplicando as mudanças solicitadas.

**ARTIGO COMPLETO ATUAL**:
"""
${fullContent}
"""

**INSTRUÇÕES CRÍTICAS**:
1. Retorne o artigo COMPLETO com suas edições
2. Inclua TODAS as seções (mesmo as não modificadas)
3. Mantenha a formatação markdown
4. Aplique apenas as mudanças específicas pedidas
5. Retorne dentro de um bloco markdown
6. Após o bloco, em uma nova linha, explique brevemente o que mudou

**FORMATO DE RESPOSTA**:
\`\`\`markdown
[ARTIGO COMPLETO EDITADO]
\`\`\`

**Mudanças**: [breve explicação]`;
    } else {
      // Sem contexto específico - resposta geral
      systemInstruction = `Você é um assistente especializado em criptomoedas e blockchain.
Responda de forma clara e objetiva às perguntas do usuário.`;
    }

    // Adicionar mensagens de sistema adicionais se houver
    if (systemMessages.length > 0) {
      systemInstruction += '\n\n' + systemMessages.map(msg => msg.content).join('\n\n');
    }

    // Converter mensagens para formato Gemini
    const geminiMessages = regularMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Log para debug
    console.log('🎯 [Editor Chat] Modo:', realEditMode);
    console.log('🎯 [Editor Chat] Texto a editar:', textToEdit ? textToEdit.substring(0, 100) + '...' : 'Nenhum');
    console.log('🎯 [Editor Chat] Detecção:', hasTrechoEspecifico ? 'Trecho específico detectado' : 'Edição geral');

    // Chamar Gemini 2.5 Pro API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Resposta vazia do Gemini');
    }

    return NextResponse.json({
      success: true,
      message: responseText,
      editMode: realEditMode,
      originalText: textToEdit ? textToEdit.substring(0, 200) : null,
      usage: {
        model: 'gemini-2.5-pro',
        inputTokens: geminiData.usageMetadata?.promptTokenCount || 0,
        outputTokens: geminiData.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: geminiData.usageMetadata?.totalTokenCount || 0
      }
    });

  } catch (error: any) {
    console.error('Erro em /api/editor-chat:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao processar chat do editor'
    }, { status: 500 });
  }
}
