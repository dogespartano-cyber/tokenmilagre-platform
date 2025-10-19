const fetch = require('node-fetch');

async function testAPI() {
  const slug = 'mineradores-bitcoin-migram-ia-rentabilidade-20251019-1430';
  const url = `http://localhost:3000/api/articles/${slug}`;

  console.log('🔍 Testando API...');
  console.log('URL:', url);
  console.log('');

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.data) {
      const article = data.data;

      console.log('✅ API respondeu com sucesso!\n');
      console.log('📝 Dados retornados:');
      console.log('   Título:', article.title);
      console.log('   Sentiment:', article.sentiment);
      console.log('   Categoria:', article.category);
      console.log('   Source:', article.source);
      console.log('');

      // Testar as funções de exibição
      const getSentimentLabel = (sentiment) => {
        switch (sentiment) {
          case 'positive': return 'Positivo';
          case 'negative': return 'Negativo';
          default: return 'Neutro';
        }
      };

      const getSentimentColor = (sentiment) => {
        switch (sentiment) {
          case 'positive': return '#22c55e (verde)';
          case 'negative': return '#ef4444 (vermelho)';
          default: return '#eab308 (amarelo)';
        }
      };

      console.log('🎨 Como será exibido:');
      console.log('   Label:', getSentimentLabel(article.sentiment));
      console.log('   Cor:', getSentimentColor(article.sentiment));
      console.log('');

      if (article.sentiment === 'neutral') {
        console.log('🟡 Badge exibirá: "Neutro" com fundo AMARELO');
      } else if (article.sentiment === 'positive') {
        console.log('🟢 Badge exibirá: "Positivo" com fundo VERDE');
      } else {
        console.log('🔴 Badge exibirá: "Negativo" com fundo VERMELHO');
      }

    } else {
      console.log('❌ Erro na resposta da API:', data);
    }
  } catch (error) {
    console.error('❌ Erro ao chamar API:', error.message);
    console.log('\n⚠️  Certifique-se de que o servidor está rodando em http://localhost:3000');
  }
}

testAPI();
