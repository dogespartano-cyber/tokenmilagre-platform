/**
 * Cliente para Gemini 2.5 Flash Image (Nano Banana)
 * Geração de imagens de capa para artigos com padrão visual Token Milagre
 */

// Esquema de cores da marca Token Milagre por categoria
const brandColors = {
  bitcoin: { from: '#F59E0B', to: '#EF4444', name: 'golden-red gradient' },
  ethereum: { from: '#627EEA', to: '#4F46E5', name: 'ethereum blue gradient' },
  defi: { from: '#10B981', to: '#059669', name: 'emerald green gradient' },
  politica: { from: '#7C3AED', to: '#5B21B6', name: 'deep purple gradient' },
  regulacao: { from: '#7C3AED', to: '#5B21B6', name: 'deep purple gradient' },
  nfts: { from: '#EC4899', to: '#DB2777', name: 'pink gradient' },
  altcoins: { from: '#F59E0B', to: '#F97316', name: 'orange gradient' },
  mercado: { from: '#3B82F6', to: '#1D4ED8', name: 'blue gradient' },
  blockchain: { from: '#7C3AED', to: '#5B21B6', name: 'purple gradient' },
  trading: { from: '#22C55E', to: '#15803D', name: 'green gradient' },
  seguranca: { from: '#EF4444', to: '#B91C1C', name: 'red gradient' },
  desenvolvimento: { from: '#6366F1', to: '#4338CA', name: 'indigo gradient' },
  default: { from: '#7C3AED', to: '#F59E0B', name: 'purple-golden gradient' }
};

// Mapear sentiment para mood visual
const sentimentMood = {
  positive: 'optimistic and energetic',
  neutral: 'professional and analytical',
  negative: 'serious and cautious'
};

interface GenerateCoverImageOptions {
  title: string;
  category: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  articleType: 'news' | 'educational' | 'resource';
}

interface GenerateCoverImageResult {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Gera imagem de capa usando Gemini 2.5 Flash Image (Nano Banana)
 */
export async function generateCoverImage(
  options: GenerateCoverImageOptions,
  apiKey: string
): Promise<GenerateCoverImageResult> {
  try {
    const { title, category, sentiment = 'neutral', articleType } = options;

    console.log('[generateCoverImage] 🚀 Iniciando geração...');
    console.log('[generateCoverImage] Parâmetros:', { title, category, sentiment, articleType });

    // Obter cores da categoria
    const colors = brandColors[category as keyof typeof brandColors] || brandColors.default;
    const mood = sentimentMood[sentiment];

    console.log('[generateCoverImage] 🎨 Cores selecionadas:', colors);
    console.log('[generateCoverImage] 🎭 Mood:', mood);

    // Construir prompt otimizado
    const prompt = buildImagePrompt(title, colors, mood, articleType);
    console.log('[generateCoverImage] 📝 Prompt construído (primeiros 200 chars):', prompt.substring(0, 200) + '...');

    // Chamar Gemini 2.0 Flash Image API
    // Nota: gemini-2.5-flash-image não tem quota no free tier, usar 2.0
    console.log('[generateCoverImage] 📡 Chamando API Gemini Image...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
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
            // CRÍTICO: Gemini 2.0 Image requer ambos modalities
            responseModalities: ['IMAGE', 'TEXT']
          }
        })
      }
    );

    console.log('[generateCoverImage] 📊 Status da resposta:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[generateCoverImage] ❌ Erro da API:', JSON.stringify(errorData, null, 2));
      throw new Error(`Gemini Image API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('[generateCoverImage] 📦 Resposta recebida (estrutura):', {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length,
      firstCandidate: data.candidates?.[0] ? {
        hasContent: !!data.candidates[0].content,
        partsLength: data.candidates[0].content?.parts?.length
      } : null
    });

    // Log completo da resposta (pode ser grande)
    console.log('[generateCoverImage] 📄 Resposta completa (JSON):', JSON.stringify(data, null, 2));

    // Extrair imagem da resposta
    // Gemini 2.0 retorna imagem em base64 com camelCase: inlineData
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    console.log('[generateCoverImage] 🔍 Procurando inlineData...');
    console.log('[generateCoverImage] imagePart encontrado:', !!imagePart);

    if (!imagePart || !imagePart.inlineData) {
      console.error('[generateCoverImage] ❌ Estrutura da resposta não contém inlineData');
      console.error('[generateCoverImage] Parts disponíveis:', data.candidates?.[0]?.content?.parts?.map((p: any) => Object.keys(p)));
      throw new Error('Nenhuma imagem gerada pela API');
    }

    console.log('[generateCoverImage] ✅ Imagem extraída com sucesso!');
    console.log('[generateCoverImage] MIME type:', imagePart.inlineData.mimeType);
    console.log('[generateCoverImage] Base64 length:', imagePart.inlineData.data?.length || 0);

    return {
      success: true,
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/jpeg'
    };

  } catch (error: any) {
    console.error('[generateCoverImage] ❌❌❌ ERRO:', error);
    console.error('[generateCoverImage] Stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao gerar imagem'
    };
  }
}

/**
 * Constrói prompt otimizado para geração de capa
 */
function buildImagePrompt(
  title: string,
  colors: { from: string; to: string; name: string },
  mood: string,
  articleType: string
): string {
  // Limpar título (máximo 60 caracteres para prompt)
  const cleanTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;

  // Prompt base otimizado para Nano Banana
  const basePrompt = `Create a professional cover image for a cryptocurrency ${articleType} article.

**Article Theme:** ${cleanTitle}

**Visual Style:**
- Modern minimalist financial technology design
- Token Milagre brand identity
- Abstract geometric patterns with subtle crypto elements
- Clean composition with depth and sophistication

**Color Palette (MUST USE):**
- Primary gradient: ${colors.name} (${colors.from} to ${colors.to})
- Accent: Golden highlights (#F59E0B) for emphasis
- Background: Deep dark tones (#1E1B4B, #0F172A) for contrast

**Mood:** ${mood}

**Technical Requirements:**
- Dimensions: 1200x630 pixels (16:9 aspect ratio)
- NO text, NO logos, NO faces, NO readable words
- Pure abstract design with crypto-inspired geometry
- Professional and elegant aesthetic
- High contrast for visibility

**Elements to Include:**
- Subtle blockchain network patterns
- Abstract geometric shapes (hexagons, lines, nodes)
- Flowing gradient transitions
- Depth through layering and shadows
- Golden accent elements strategically placed

**Elements to AVOID:**
- Any text or typography
- Literal cryptocurrency logos or symbols
- Human faces or figures
- Cluttered or busy compositions
- Generic stock photo aesthetics`;

  return basePrompt;
}

/**
 * Valida se imagem base64 é válida
 */
export function validateBase64Image(base64: string): boolean {
  try {
    // Verificar se começa com caractere válido de base64
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    // Remover possíveis espaços/quebras de linha
    const cleanBase64 = base64.replace(/\s/g, '');

    // Verificar tamanho mínimo (imagem deve ter pelo menos 1KB)
    if (cleanBase64.length < 1024) {
      return false;
    }

    // Validar formato base64
    return base64Regex.test(cleanBase64);
  } catch {
    return false;
  }
}

/**
 * Calcula tamanho estimado da imagem em bytes
 */
export function estimateImageSize(base64: string): number {
  // Fórmula: (base64.length * 3) / 4
  // Remove padding se houver
  const padding = (base64.match(/=/g) || []).length;
  return ((base64.length * 3) / 4) - padding;
}
