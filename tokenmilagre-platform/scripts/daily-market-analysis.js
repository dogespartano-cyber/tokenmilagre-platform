/**
 * Script de Análise Diária Automatizada do Mercado Cripto
 *
 * Este script deve ser executado diariamente às 21h BR via cron job.
 * Gera uma análise completa do mercado das últimas 24h usando Perplexity API.
 *
 * Uso:
 *   node scripts/daily-market-analysis.js
 *
 * Cron job (executar às 21h BR todos os dias):
 *   0 21 * * * cd /path/to/tokenmilagre-platform && node scripts/daily-market-analysis.js
 */

const fetch = require('node-fetch');
const { PrismaClient } = require('../lib/generated/prisma');
const { generateUniqueSlug, slugWithDate } = require('./helpers/generate-unique-slug');

const prisma = new PrismaClient();

// Configuração
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// ID do usuário EDITOR (quem "escreve" as análises automatizadas)
const EDITOR_USER_ID = 'cmggcrcr40001ijinifhwp0zq';

async function generateDailyAnalysis() {
  console.log('📊 Iniciando geração da análise diária do mercado...\n');
  console.log(`⏰ Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n`);

  // Verificar API key
  if (!PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY não configurada!');
    console.error('💡 Configure a variável de ambiente no arquivo .env\n');
    process.exit(1);
  }

  // Prompt para Perplexity
  const prompt = `Você é um jornalista especializado em criptomoedas e blockchain.

**TAREFA**: Escrever uma notícia completa em português (PT-BR) sobre: "Análise completa do mercado de criptomoedas nas últimas 24 horas (${new Date().toLocaleDateString('pt-BR')})"

**CONTEÚDO DA ANÁLISE**:
1. Bitcoin (BTC): Preço atual, variação 24h, volume, resistências/suportes
2. Ethereum (ETH): Performance, volume, desenvolvimentos
3. Principais Altcoins: Valorizações/desvalorizações, projetos em destaque
4. Mercado Global: Capitalização, volume, dominância BTC/ETH
5. Sentimento: Índice Fear & Greed, tendências
6. Eventos Importantes: Regulação, adoção institucional, tech
7. Perspectivas: O que esperar, pontos de atenção

**ESTRUTURA JORNALÍSTICA OBRIGATÓRIA**:
Siga o padrão: Fato → Contexto → Impacto → Visão → Reflexão → Desafios

- Use 5-6 seções H2 (##) com títulos DESCRITIVOS (não genéricos)
- ✅ CORRETO: "## Bitcoin Rompe Barreira de $115 Mil", "## Impacto no Mercado Institucional"
- ❌ ERRADO: "## Introdução", "## Desenvolvimento", "## Conclusão"
- Integre a conclusão como subseção (###) da última seção H2
- NÃO incluir H1 no início
- NÃO incluir fontes/referências
- NÃO incluir nota de transparência

**REGRAS CRÍTICAS**:
1. "excerpt" = Resumo destacado (1-2 frases, máx 200 caracteres)
2. "content" = Começa DIRETO com ## (H2), NÃO repete o excerpt
3. Primeira seção = Fato principal (notícia do dia)
4. Últimas seções = Reflexão + Desafios (subseção ###)

**CATEGORIAS DISPONÍVEIS**: bitcoin, ethereum, defi, politica, nfts, altcoins, regulacao, mercado

**FORMATO DE SAÍDA**:
{
  "title": "Título atrativo da notícia (máx 80 caracteres)",
  "excerpt": "Resumo destacado - não repetir no content!",
  "content": "## Marco Histórico\\n\\nTexto da primeira seção...\\n\\n## Contexto do Mercado\\n\\nTexto...",
  "category": "mercado",
  "sentiment": "positive" | "neutral" | "negative",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Retorne APENAS o JSON, sem explicações adicionais.`;

  console.log('🔧 Configuração:');
  console.log('  - Modelo: sonar (econômico)');
  console.log('  - Tipo: news');
  console.log('  - API: Perplexity (direto)\n');

  try {
    console.log('🌐 Chamando Perplexity API...');

    // Chamar Perplexity API diretamente
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates structured articles in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Perplexity API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const perplexityData = await response.json();
    const generatedText = perplexityData.choices[0].message.content;

    // Parse JSON gerado
    let articleData;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[0]);
      } else {
        articleData = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error('❌ Erro ao parsear resposta da IA');
      console.error('Resposta recebida:', generatedText);
      throw new Error('Erro ao parsear resposta da API');
    }

    console.log('✅ Conteúdo gerado pela IA!\n');
    console.log('📰 Título:', articleData.title);
    console.log('📊 Sentimento:', articleData.sentiment);
    console.log('🏷️  Categoria:', articleData.category);

    // Calcular custo
    const inputTokens = perplexityData.usage?.prompt_tokens || 0;
    const outputTokens = perplexityData.usage?.completion_tokens || 0;
    const inputCost = (inputTokens / 1000000) * 0.2;
    const outputCost = (outputTokens / 1000000) * 0.2;
    const estimatedCost = inputCost + outputCost + 0.005;
    console.log('💰 Custo:', `$${estimatedCost.toFixed(4)}`);

    // Adicionar tag "analise-diaria"
    const tags = [...(articleData.tags || [])];
    if (!tags.includes('analise-diaria')) {
      tags.push('analise-diaria');
    }

    // Gerar slug único com data
    console.log('\n🔍 Gerando slug único...');
    const baseSlug = slugWithDate(articleData.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug);
    console.log('✅ Slug final:', uniqueSlug);

    // Salvar no banco de dados
    console.log('\n💾 Salvando no banco de dados...');
    const article = await prisma.article.create({
      data: {
        slug: uniqueSlug,
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: articleData.category,
        tags: JSON.stringify(tags),
        sentiment: articleData.sentiment,
        type: 'news',
        published: true,
        authorId: EDITOR_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('\n✅ Análise diária criada e publicada com sucesso!\n');
    console.log('📰 Título:', article.title);
    console.log('🔗 Slug:', article.slug);
    console.log('📊 Sentimento:', article.sentiment);
    console.log('🏷️  Categoria:', article.category);
    console.log('🏷️  Tags:', tags.join(', '));
    console.log('🕐 Publicado em:', article.createdAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    console.log('🌐 URL:', `http://localhost:3000/dashboard/noticias/${article.slug}`);
    console.log('\n💡 A análise foi marcada com tag "analise-diaria" e será');
    console.log('   exibida automaticamente na seção Hero da home page.\n');

    return article;

  } catch (error) {
    console.error('\n❌ Erro ao gerar análise diária:', error.message);
    console.error('\n🔍 Detalhes do erro:', error);
    console.error('\n💡 Verifique:');
    console.error('   1. Se a variável PERPLEXITY_API_KEY está configurada');
    console.error('   2. Se há saldo suficiente na API da Perplexity');
    console.error('   3. Se a conexão com o banco de dados está ativa\n');
    process.exit(1);
  }
}

// Executar
generateDailyAnalysis()
  .then(() => {
    console.log('🎉 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro crítico:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
