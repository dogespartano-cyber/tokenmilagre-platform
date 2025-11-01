/**
 * Script de Teste: Gemini Image API (Nano Banana)
 * Verifica se a API key tem permissão e quota para gerar imagens
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY não encontrada no .env');
  process.exit(1);
}

console.log('🔑 API Key encontrada:', GEMINI_API_KEY.substring(0, 20) + '...');
console.log('');

async function testImageGeneration() {
  try {
    console.log('📡 Testando API Gemini Image...');
    console.log('🎯 Modelo: gemini-2.0-flash-preview-image-generation');
    console.log('💡 Nota: gemini-2.5-flash-image não tem quota no free tier');
    console.log('');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`,
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
                  text: 'Create a simple abstract geometric pattern with purple and gold gradient. Minimalist design. No text.'
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

    console.log('📊 Status da resposta:', response.status, response.statusText);
    console.log('');

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ ERRO DA API:');
      console.error(JSON.stringify(errorData, null, 2));
      console.error('');

      if (response.status === 429) {
        console.error('🚫 QUOTA EXCEDIDA');
        console.error('');
        console.error('Possíveis causas:');
        console.error('1. Limite diário atingido (100 imagens/dia no free tier)');
        console.error('2. Limite por minuto atingido (10 imagens/minuto no free tier)');
        console.error('3. API key não tem permissão para geração de imagens');
        console.error('');
        console.error('Soluções:');
        console.error('• Verificar uso: https://ai.dev/usage?tab=rate-limit');
        console.error('• Aguardar reset (meia-noite UTC)');
        console.error('• Verificar se API key está configurada corretamente');
      } else if (response.status === 403) {
        console.error('🚫 ACESSO NEGADO');
        console.error('');
        console.error('API key não tem permissão para este modelo.');
        console.error('Verifique se a key foi criada com permissões corretas no Google AI Studio.');
      }

      process.exit(1);
    }

    const data = await response.json();

    console.log('✅ API FUNCIONANDO!');
    console.log('');
    console.log('📦 Estrutura da resposta:');
    console.log('- Candidates:', data.candidates?.length || 0);
    console.log('- Has Content:', !!data.candidates?.[0]?.content);
    console.log('- Parts:', data.candidates?.[0]?.content?.parts?.length || 0);

    // Verificar se tem imagem
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (part) => part.inline_data
    );

    if (imagePart && imagePart.inline_data) {
      console.log('');
      console.log('✅✅✅ IMAGEM GERADA COM SUCESSO! ✅✅✅');
      console.log('');
      console.log('📊 Detalhes da imagem:');
      console.log('- MIME type:', imagePart.inline_data.mime_type);
      console.log('- Tamanho (base64):', imagePart.inline_data.data.length, 'caracteres');
      console.log('- Tamanho estimado:', Math.round((imagePart.inline_data.data.length * 3) / 4 / 1024), 'KB');
      console.log('');
      console.log('🎉 Sua API key está funcionando perfeitamente!');
      console.log('');
      console.log('💡 Dica: Se estava com erro 429 antes, provavelmente você:');
      console.log('   - Atingiu o limite de 10 req/min (aguarde 1 minuto)');
      console.log('   - Atingiu o limite de 100 req/dia (aguarde até meia-noite UTC)');
    } else {
      console.log('');
      console.log('⚠️ API respondeu mas sem imagem');
      console.log('');
      console.log('Resposta completa:');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ EXCEÇÃO:', error.message);
    console.error('');
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Executar teste
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║   🧪 TESTE - Gemini Image API (Nano Banana)         ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('');

testImageGeneration()
  .then(() => {
    console.log('');
    console.log('🏁 Teste concluído!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Erro fatal:', err);
    process.exit(1);
  });
