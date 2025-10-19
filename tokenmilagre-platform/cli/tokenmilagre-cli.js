#!/usr/bin/env node

/**
 * 🪄 TokenMilagre CLI - Centro de Comando para Artigos
 *
 * Features:
 * - Verificar melhores artigos do dia
 * - Criar artigo com Gemini (com análise de sentimento)
 * - Fact-check automático
 * - Publicação com validação
 * - Slugs SEO-friendly automáticos
 */

import prompts from 'prompts';
import fetch from 'node-fetch';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';
import { homedir } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuração
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const ARTICLES_DIR = process.env.ARTICLES_DIR || resolve(homedir(), 'Trabalho', 'gemini', 'articles');

// Endpoints
const IMPORT_ENDPOINT = `${API_BASE}/api/articles/import`;
const FACTCHECK_ENDPOINT = `${API_BASE}/api/articles/fact-check`;
const LIST_ENDPOINT = `${API_BASE}/api/articles`;
const ARTICLE_BY_SLUG = (slug) => `${API_BASE}/api/articles/${slug}`;

// Cores ANSI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function color(text, colorCode) {
  return `${colorCode}${text}${colors.reset}`;
}

// Helper: gerar slug SEO-friendly
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
}

// Helper: analisar sentimento do artigo com Gemini
async function analyzeSentiment(content, title) {
  try {
    const prompt = `Analise o sentimento desta notícia sobre criptomoedas e responda APENAS com uma palavra: positive, neutral ou negative.

TÍTULO: ${title}

CONTEÚDO:
${content}

Critérios:
- positive: notícia otimista, alta de preço, adoção, regulação favorável
- negative: notícia pessimista, queda de preço, FUD, regulação negativa
- neutral: informativa, análise técnica, dados factuais

Responda apenas: positive, neutral ou negative`;

    const { stdout } = await execAsync(`gemini "${prompt.replace(/"/g, '\\"')}"`);
    const sentiment = stdout.trim().toLowerCase();

    // Validar resposta
    if (['positive', 'neutral', 'negative'].includes(sentiment)) {
      return sentiment;
    }

    // Fallback: analisar por palavras-chave
    const contentLower = (title + ' ' + content).toLowerCase();
    const positiveKeywords = ['alta', 'recorde', 'adoção', 'bull', 'otimista', 'sucesso', 'crescimento'];
    const negativeKeywords = ['queda', 'crash', 'bear', 'pessimista', 'fraude', 'hack', 'recessão'];

    const positiveCount = positiveKeywords.filter(k => contentLower.includes(k)).length;
    const negativeCount = negativeKeywords.filter(k => contentLower.includes(k)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  } catch (error) {
    console.warn(color('⚠️  Erro ao analisar sentimento, usando neutral', colors.yellow));
    return 'neutral';
  }
}

// Helper: detectar categoria do artigo
function detectCategory(title, content) {
  const text = (title + ' ' + content).toLowerCase();

  const categories = {
    bitcoin: ['bitcoin', 'btc'],
    ethereum: ['ethereum', 'eth', 'ether'],
    solana: ['solana', 'sol'],
    defi: ['defi', 'descentralizado', 'yield', 'staking', 'liquidity'],
    nfts: ['nft', 'nfts', 'token não fungível', 'colecionável'],
    regulacao: ['regulação', 'sec', 'cvm', 'lei', 'governo', 'regulatório'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => text.includes(k))) {
      return category;
    }
  }

  return 'bitcoin'; // fallback
}

// Helper: extrair tags relevantes
function extractTags(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  const allTags = [
    'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol',
    'defi', 'nft', 'cripto', 'blockchain', 'mercado',
    'preço', 'alta', 'queda', 'análise', 'investimento',
    'regulação', 'etf', 'halving', 'mining'
  ];

  const foundTags = allTags.filter(tag => text.includes(tag));
  return foundTags.slice(0, 5); // Máximo 5 tags
}

// Menu principal
async function main() {
  let exit = false;

  while (!exit) {
    console.clear();
    console.log(color(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  ${color('🪄 TokenMilagre CLI - Centro de Comando', colors.cyan)}          ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ${color('1.', colors.bright)} 📊 Verificar artigos do dia                    ║
║  ${color('2.', colors.bright)} ✍️  Criar novo artigo (com Gemini)             ║
║  ${color('3.', colors.bright)} 🔍 Fact-check de artigo                        ║
║  ${color('4.', colors.bright)} 🚀 Publicar/Gerenciar artigo                   ║
║  ${color('5.', colors.bright)} 📈 Estatísticas do sistema                     ║
║  ${color('0.', colors.bright)} 👋 Sair                                        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `, colors.reset));

    const { option } = await prompts({
      type: 'number',
      name: 'option',
      message: color('Digite sua escolha:', colors.cyan),
      validate: (value) => [0, 1, 2, 3, 4, 5].includes(value) ? true : 'Opção inválida',
    });

    switch (option) {
      case 1:
        await showTopArticles();
        break;
      case 2:
        await createArticleInteractive();
        break;
      case 3:
        await factCheckArticle();
        break;
      case 4:
        await manageArticle();
        break;
      case 5:
        await showStatistics();
        break;
      default:
        exit = true;
        break;
    }

    if (!exit) {
      const { continue: cont } = await prompts({
        type: 'toggle',
        name: 'continue',
        message: 'Voltar ao menu?',
        initial: true,
        active: 'Sim',
        inactive: 'Não',
      });
      if (!cont) exit = true;
    }
  }

  console.log(color('\n👋 Até a próxima! Continue criando artigos incríveis! 🚀\n', colors.green));
}

// Opção 1: Mostrar artigos do dia
async function showTopArticles() {
  console.log(color('\n📊 Consultando artigos do dia...\n', colors.cyan));

  try {
    const res = await fetch(`${LIST_ENDPOINT}?category=all`, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const articles = json.data || [];

    if (!articles.length) {
      console.log(color('📭 Nenhum artigo encontrado. Hora de criar um!\n', colors.yellow));
      return;
    }

    // Ordenar por data (mais recentes primeiro)
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    console.log(color(`✅ Encontrados ${articles.length} artigo(s):\n`, colors.green));

    articles.slice(0, 15).forEach((article, idx) => {
      const sentimentIcon = {
        positive: '🟢',
        neutral: '🟡',
        negative: '🔴'
      }[article.sentiment] || '⚪';

      const factCheckInfo = article.factChecked
        ? color(`✅ Verificado (${article.factCheckScore || 'N/A'}%)`, colors.green)
        : color('⚠️  Não verificado', colors.yellow);

      console.log(color(`${idx + 1}. ${article.title}`, colors.bright));
      console.log(`   ${sentimentIcon} Sentiment: ${article.sentiment}`);
      console.log(`   🏷️  Categoria: ${Array.isArray(article.category) ? article.category.join(', ') : article.category}`);
      console.log(`   🔗 Slug: ${article.slug}`);
      console.log(`   ${factCheckInfo}`);
      console.log(`   📅 Publicado: ${new Date(article.publishedAt).toLocaleString('pt-BR')}`);
      console.log(`   🌐 URL: ${API_BASE}/dashboard/noticias/${article.slug}`);
      console.log('');
    });
  } catch (err) {
    console.error(color(`❌ Erro ao buscar artigos: ${err.message}`, colors.red));
  }
}

// Opção 2: Criar artigo interativo
async function createArticleInteractive() {
  console.log(color('\n✍️  Vamos criar um novo artigo!\n', colors.cyan));

  const responses = await prompts([
    {
      type: 'select',
      name: 'mode',
      message: 'Escolha o modo de criação:',
      choices: [
        { title: '🤖 Gemini automático (prompt)', value: 'gemini' },
        { title: '📄 Importar arquivo .md existente', value: 'import' },
        { title: '✍️  Criar manualmente (editor)', value: 'manual' },
      ],
    },
  ]);

  if (responses.mode === 'gemini') {
    await createWithGemini();
  } else if (responses.mode === 'import') {
    await importExistingMarkdown();
  } else if (responses.mode === 'manual') {
    await createManually();
  }
}

// Criar artigo com Gemini
async function createWithGemini() {
  const { topic, category } = await prompts([
    {
      type: 'text',
      name: 'topic',
      message: 'Sobre o que você quer escrever?',
      validate: (value) => value.trim() ? true : 'Campo obrigatório',
    },
    {
      type: 'select',
      name: 'category',
      message: 'Categoria:',
      choices: [
        { title: 'Bitcoin', value: 'bitcoin' },
        { title: 'Ethereum', value: 'ethereum' },
        { title: 'Solana', value: 'solana' },
        { title: 'DeFi', value: 'defi' },
        { title: 'NFTs', value: 'nfts' },
        { title: 'Regulação', value: 'regulacao' },
      ],
    },
  ]);

  console.log(color('\n🤖 Gemini trabalhando...\n', colors.cyan));

  try {
    const prompt = `Crie um artigo completo sobre: ${topic}

Categoria: ${category}

Formato esperado:
- Título atraente e informativo
- 3-5 parágrafos bem estruturados
- Informações atualizadas e precisas
- Tom profissional mas acessível
- Inclua dados e fatos concretos

Escreva o artigo completo em formato markdown (sem metadados YAML, só o conteúdo):`;

    const { stdout } = await execAsync(`gemini "${prompt.replace(/"/g, '\\"')}"`);
    const content = stdout.trim();

    // Extrair título (primeira linha com #)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Artigo sobre ' + topic;

    // Gerar dados do artigo
    const slug = generateSlug(title);
    const sentiment = await analyzeSentiment(content, title);
    const tags = extractTags(title, content);
    const summary = content.split('\n\n')[1]?.substring(0, 150) || 'Artigo sobre ' + topic;

    console.log(color('\n✅ Artigo gerado!\n', colors.green));
    console.log(color('Preview:', colors.bright));
    console.log(color('─'.repeat(60), colors.cyan));
    console.log(content.substring(0, 500) + '...');
    console.log(color('─'.repeat(60), colors.cyan));

    const { confirm } = await prompts({
      type: 'toggle',
      name: 'confirm',
      message: 'Salvar este artigo?',
      initial: true,
      active: 'Sim',
      inactive: 'Não',
    });

    if (!confirm) {
      console.log(color('❌ Artigo descartado.', colors.yellow));
      return;
    }

    // Criar markdown com frontmatter
    const markdown = `---
title: "${title}"
summary: "${summary}"
category: ${category}
tags: [${tags.join(', ')}]
sentiment: ${sentiment}
author: admin@tokenmilagre.xyz
---

${content}

---

**Gerado por:** TokenMilagre CLI + Gemini
**Data:** ${new Date().toLocaleDateString('pt-BR')}
`;

    // Salvar arquivo
    const filename = `${slug}.md`;
    const filepath = resolve(ARTICLES_DIR, filename);
    writeFileSync(filepath, markdown, 'utf-8');

    console.log(color(`\n✅ Artigo salvo: ${filepath}`, colors.green));
    console.log(color('🔄 O watcher processará automaticamente em ~5 segundos...', colors.cyan));

    // Perguntar se quer fazer fact-check
    const { factcheck } = await prompts({
      type: 'toggle',
      name: 'factcheck',
      message: 'Executar fact-check agora?',
      initial: true,
      active: 'Sim',
      inactive: 'Não',
    });

    if (factcheck) {
      console.log(color('\n🔍 Aguardando processamento...', colors.cyan));
      await new Promise(resolve => setTimeout(resolve, 6000)); // Aguardar watcher
      await runFactCheckBySlug(slug);
    }
  } catch (error) {
    console.error(color(`❌ Erro ao criar artigo: ${error.message}`, colors.red));
  }
}

// Importar markdown existente
async function importExistingMarkdown() {
  const { filepath } = await prompts({
    type: 'text',
    name: 'filepath',
    message: 'Caminho do arquivo .md:',
    validate: (value) => {
      const path = resolvePath(value);
      return existsSync(path) ? true : 'Arquivo não encontrado';
    },
  });

  const resolvedPath = resolvePath(filepath);

  try {
    const markdown = readFileSync(resolvedPath, 'utf-8');

    // Verificar se tem frontmatter
    if (!markdown.startsWith('---')) {
      console.log(color('\n⚠️  Arquivo sem frontmatter. Adicionando metadados...', colors.yellow));

      const { title, category } = await prompts([
        {
          type: 'text',
          name: 'title',
          message: 'Título do artigo:',
          validate: (v) => v.trim() ? true : 'Obrigatório',
        },
        {
          type: 'select',
          name: 'category',
          message: 'Categoria:',
          choices: [
            { title: 'Bitcoin', value: 'bitcoin' },
            { title: 'Ethereum', value: 'ethereum' },
            { title: 'Solana', value: 'solana' },
            { title: 'DeFi', value: 'defi' },
            { title: 'NFTs', value: 'nfts' },
            { title: 'Regulação', value: 'regulacao' },
          ],
        },
      ]);

      const sentiment = await analyzeSentiment(markdown, title);
      const tags = extractTags(title, markdown);
      const summary = markdown.split('\n\n')[0]?.substring(0, 150) || title;

      const newMarkdown = `---
title: "${title}"
summary: "${summary}"
category: ${category}
tags: [${tags.join(', ')}]
sentiment: ${sentiment}
author: admin@tokenmilagre.xyz
---

${markdown}`;

      writeFileSync(resolvedPath, newMarkdown, 'utf-8');
      console.log(color('✅ Frontmatter adicionado!', colors.green));
    }

    console.log(color('\n🔄 Artigo será processado pelo watcher...', colors.cyan));
    console.log(color(`📁 Arquivo: ${resolvedPath}`, colors.cyan));
  } catch (error) {
    console.error(color(`❌ Erro: ${error.message}`, colors.red));
  }
}

// Criar manualmente
async function createManually() {
  console.log(color('\n✍️  Modo manual: preencha os dados\n', colors.cyan));

  const responses = await prompts([
    {
      type: 'text',
      name: 'title',
      message: 'Título:',
      validate: (v) => v.trim() ? true : 'Obrigatório',
    },
    {
      type: 'text',
      name: 'summary',
      message: 'Resumo (1-2 linhas):',
      validate: (v) => v.trim() ? true : 'Obrigatório',
    },
    {
      type: 'select',
      name: 'category',
      message: 'Categoria:',
      choices: [
        { title: 'Bitcoin', value: 'bitcoin' },
        { title: 'Ethereum', value: 'ethereum' },
        { title: 'Solana', value: 'solana' },
        { title: 'DeFi', value: 'defi' },
        { title: 'NFTs', value: 'nfts' },
        { title: 'Regulação', value: 'regulacao' },
      ],
    },
    {
      type: 'list',
      name: 'tags',
      message: 'Tags (separadas por vírgula):',
      separator: ',',
    },
    {
      type: 'select',
      name: 'sentiment',
      message: 'Sentimento:',
      choices: [
        { title: '🟢 Positive (otimista)', value: 'positive' },
        { title: '🟡 Neutral (neutro)', value: 'neutral' },
        { title: '🔴 Negative (pessimista)', value: 'negative' },
      ],
    },
    {
      type: 'text',
      name: 'content',
      message: 'Conteúdo (markdown):',
      validate: (v) => v.trim() ? true : 'Obrigatório',
    },
  ]);

  const slug = generateSlug(responses.title);
  const markdown = `---
title: "${responses.title}"
summary: "${responses.summary}"
category: ${responses.category}
tags: [${responses.tags.join(', ')}]
sentiment: ${responses.sentiment}
author: admin@tokenmilagre.xyz
---

${responses.content}`;

  const filename = `${slug}.md`;
  const filepath = resolve(ARTICLES_DIR, filename);
  writeFileSync(filepath, markdown, 'utf-8');

  console.log(color(`\n✅ Artigo criado: ${filepath}`, colors.green));
  console.log(color('🔄 Será processado automaticamente pelo watcher', colors.cyan));
}

// Opção 3: Fact-check de artigo
async function factCheckArticle() {
  console.log(color('\n🔍 Fact-check de artigo\n', colors.cyan));

  const { method } = await prompts({
    type: 'select',
    name: 'method',
    message: 'Escolha o método:',
    choices: [
      { title: '🔗 Por slug (artigo já publicado)', value: 'slug' },
      { title: '📄 Por arquivo .md', value: 'file' },
    ],
  });

  if (method === 'slug') {
    const { slug } = await prompts({
      type: 'text',
      name: 'slug',
      message: 'Slug do artigo:',
      validate: (v) => v.trim() ? true : 'Obrigatório',
    });

    await runFactCheckBySlug(slug);
  } else {
    const { filepath } = await prompts({
      type: 'text',
      name: 'filepath',
      message: 'Caminho do arquivo .md:',
      validate: (value) => {
        const path = resolvePath(value);
        return existsSync(path) ? true : 'Arquivo não encontrado';
      },
    });

    const resolvedPath = resolvePath(filepath);
    const markdown = readFileSync(resolvedPath, 'utf-8');
    await runFactCheck(markdown);
  }
}

async function runFactCheckBySlug(slug) {
  try {
    // Buscar artigo
    const res = await fetch(ARTICLE_BY_SLUG(slug));
    if (!res.ok) throw new Error('Artigo não encontrado');

    const json = await res.json();
    if (!json.success) throw new Error('Erro ao buscar artigo');

    const article = json.data;

    if (article.factChecked) {
      console.log(color('\n✅ Este artigo já foi verificado:', colors.green));
      console.log(`   Score: ${article.factCheckScore || 'N/A'}%`);
      console.log(`   Status: ${article.factChecked ? 'Verificado' : 'Não verificado'}`);
      console.log('');
    }

    // Montar markdown para fact-check
    const markdown = `---
title: "${article.title}"
summary: "${article.summary}"
category: ${Array.isArray(article.category) ? article.category[0].toLowerCase() : article.category}
tags: ${JSON.stringify(article.keywords || [])}
sentiment: ${article.sentiment}
---

${article.content}`;

    await runFactCheck(markdown);
  } catch (error) {
    console.error(color(`❌ Erro: ${error.message}`, colors.red));
  }
}

async function runFactCheck(markdown) {
  console.log(color('\n🔍 Executando fact-check...\n', colors.cyan));

  try {
    const res = await fetch(FACTCHECK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown, threshold: 70, maxClaims: 10 }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (!json.success) throw new Error('Fact-check falhou');

    const data = json.data;

    console.log(color('📊 Resultado do Fact-Check:', colors.bright));
    console.log(color('═'.repeat(60), colors.cyan));
    console.log('');

    const statusColor = data.passed ? colors.green : colors.red;
    const statusIcon = data.passed ? '✅' : '❌';

    console.log(`${color(`${statusIcon} Status:`, statusColor)} ${data.status.toUpperCase()}`);
    console.log(`📈 Score: ${color(`${data.score}/${data.threshold}`, statusColor)}`);
    console.log(`📄 Claims analisados: ${data.totalClaims}`);
    console.log(`✅ Verificados: ${color(data.verifiedClaims, colors.green)}`);
    console.log(`❌ Não verificados: ${color(data.failedClaims, colors.red)}`);
    console.log(`🔗 Fontes consultadas: ${data.sources.length}`);
    console.log(`🔍 APIs usadas: ${data.searchAPIsUsed.join(', ') || 'Nenhuma'}`);
    console.log('');

    if (data.verifications && data.verifications.length > 0) {
      console.log(color('📋 Detalhes das Verificações:', colors.bright));
      console.log(color('─'.repeat(60), colors.cyan));

      data.verifications.forEach((v, idx) => {
        const icon = v.verified ? '✅' : '❌';
        console.log(`\n${idx + 1}. ${v.claim}`);
        console.log(`   ${icon} Confiança: ${v.confidence}%`);
        console.log(`   📚 Fontes: ${v.sourcesCount}`);
        console.log(`   💡 ${v.reasoning}`);
      });
    }

    console.log('\n' + color('═'.repeat(60), colors.cyan));
  } catch (error) {
    console.error(color(`❌ Erro ao executar fact-check: ${error.message}`, colors.red));
  }
}

// Opção 4: Gerenciar artigo
async function manageArticle() {
  console.log(color('\n🚀 Gerenciamento de Artigos\n', colors.cyan));

  const { slug } = await prompts({
    type: 'text',
    name: 'slug',
    message: 'Slug do artigo:',
    validate: (v) => v.trim() ? true : 'Obrigatório',
  });

  try {
    const res = await fetch(ARTICLE_BY_SLUG(slug));
    if (!res.ok) throw new Error('Artigo não encontrado');

    const json = await res.json();
    if (!json.success) throw new Error('Erro ao buscar artigo');

    const article = json.data;

    console.log(color('\n📄 Artigo:', colors.bright));
    console.log(color('─'.repeat(60), colors.cyan));
    console.log(`Título: ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Categoria: ${Array.isArray(article.category) ? article.category.join(', ') : article.category}`);
    console.log(`Sentiment: ${article.sentiment}`);
    console.log(`Fact-check: ${article.factChecked ? `✅ ${article.factCheckScore}%` : '❌ Não verificado'}`);
    console.log(`URL: ${API_BASE}/dashboard/noticias/${article.slug}`);
    console.log(color('─'.repeat(60), colors.cyan));

    console.log(color('\n✅ Artigo já está publicado!', colors.green));
    console.log(color(`🌐 Acesse: ${API_BASE}/dashboard/noticias/${article.slug}`, colors.cyan));
  } catch (error) {
    console.error(color(`❌ Erro: ${error.message}`, colors.red));
  }
}

// Opção 5: Estatísticas
async function showStatistics() {
  console.log(color('\n📈 Estatísticas do Sistema\n', colors.cyan));

  try {
    const res = await fetch(`${LIST_ENDPOINT}?category=all`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const articles = json.data || [];

    const total = articles.length;
    const verified = articles.filter(a => a.factChecked).length;
    const positive = articles.filter(a => a.sentiment === 'positive').length;
    const neutral = articles.filter(a => a.sentiment === 'neutral').length;
    const negative = articles.filter(a => a.sentiment === 'negative').length;

    const avgScore = verified > 0
      ? (articles.filter(a => a.factCheckScore).reduce((sum, a) => sum + a.factCheckScore, 0) / verified).toFixed(1)
      : 0;

    console.log(color('📊 Estatísticas Gerais:', colors.bright));
    console.log(color('═'.repeat(60), colors.cyan));
    console.log(`\n📄 Total de artigos: ${color(total, colors.bright)}`);
    console.log(`✅ Verificados: ${color(verified, colors.green)} (${((verified / total) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Não verificados: ${color(total - verified, colors.yellow)}`);
    console.log(`📈 Score médio: ${color(avgScore + '%', colors.cyan)}`);

    console.log(`\n${color('Sentimentos:', colors.bright)}`);
    console.log(`🟢 Positive: ${color(positive, colors.green)} (${((positive / total) * 100).toFixed(1)}%)`);
    console.log(`🟡 Neutral: ${color(neutral, colors.yellow)} (${((neutral / total) * 100).toFixed(1)}%)`);
    console.log(`🔴 Negative: ${color(negative, colors.red)} (${((negative / total) * 100).toFixed(1)}%)`);

    console.log('\n' + color('═'.repeat(60), colors.cyan));
  } catch (error) {
    console.error(color(`❌ Erro: ${error.message}`, colors.red));
  }
}

// Helper: resolver path com ~
function resolvePath(inputPath) {
  if (!inputPath) return inputPath;
  if (inputPath.startsWith('~')) {
    return resolve(homedir(), inputPath.slice(2));
  }
  return resolve(inputPath);
}

// Executar
main().catch((err) => {
  console.error(color(`\n💥 Erro inesperado: ${err.message}`, colors.red));
  process.exit(1);
});
