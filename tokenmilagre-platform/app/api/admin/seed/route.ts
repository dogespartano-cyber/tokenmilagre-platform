import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Sentiment } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * POST /api/admin/seed
 * Popula o banco de dados com dados de exemplo
 * Requer autenticação como ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se é ADMIN
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Apenas administradores podem executar seed' },
        { status: 403 }
      );
    }

    // Verificar se já existem artigos
    const existingArticles = await prisma.article.count();

    if (existingArticles > 0) {
      return NextResponse.json({
        success: false,
        error: `Banco de dados já contém ${existingArticles} artigos. Seed cancelado para evitar duplicação.`,
        hint: 'Delete os artigos existentes primeiro se deseja recriar o seed.'
      }, { status: 400 });
    }

    // Obter ID do usuário admin atual
    const adminId = session.user.id;

    // Criar artigos de notícias
    const newsArticles = [
      {
        title: 'Bitcoin atinge novo recorde histórico acima de $100k',
        slug: 'bitcoin-atinge-novo-recorde-historico',
        content: `# Bitcoin atinge novo recorde histórico acima de $100k

O Bitcoin (BTC) alcançou um marco histórico nesta semana, ultrapassando a barreira dos $100.000 pela primeira vez. Este movimento representa um crescimento de mais de 150% em relação ao início do ano.

## Fatores que impulsionaram a alta

Diversos fatores contribuíram para esta valorização expressiva:

- **Aprovação de ETFs de Bitcoin spot** pela SEC nos Estados Unidos
- **Adoção institucional crescente** com empresas adicionando BTC ao balanço
- **Halvening do Bitcoin** reduzindo a emissão de novas moedas
- **Instabilidade econômica global** levando investidores a buscar ativos alternativos

## Análise técnica

Os analistas apontam que o próximo nível de resistência está em $120.000, com suporte forte em $95.000. O volume de negociação aumentou 300% nas últimas 24 horas.

## Perspectivas para o futuro

Especialistas permanecem otimistas, com previsões variando de $150.000 a $200.000 para os próximos 12 meses.`,
        excerpt: 'Bitcoin ultrapassa $100k pela primeira vez na história, impulsionado por aprovação de ETFs e adoção institucional crescente.',
        type: 'news',
        category: 'mercado',
        tags: JSON.stringify(['Bitcoin', 'BTC', 'Recorde', 'Mercado', 'Análise']),
        published: true,
        sentiment: Sentiment.positive,
        authorId: adminId
      },
      {
        title: 'Ethereum 2.0: Nova atualização promete reduzir taxas em 90%',
        slug: 'ethereum-2-0-nova-atualizacao-reduz-taxas',
        content: `# Ethereum 2.0: Nova atualização promete reduzir taxas em 90%

A rede Ethereum está prestes a implementar sua mais significativa atualização, prometendo reduzir drasticamente as taxas de transação e aumentar a escalabilidade.

## Principais melhorias

- Redução de taxas em até 90%
- Aumento da velocidade de transações
- Maior eficiência energética
- Melhor experiência para usuários de DeFi

## Impacto no mercado

Esta atualização pode ser um divisor de águas para a adoção em massa de aplicações descentralizadas.`,
        excerpt: 'Ethereum 2.0 promete revolucionar a rede com redução de 90% nas taxas e maior escalabilidade.',
        type: 'news',
        category: 'tecnologia',
        tags: JSON.stringify(['Ethereum', 'ETH', 'Ethereum 2.0', 'DeFi', 'Escalabilidade']),
        published: true,
        sentiment: Sentiment.positive,
        authorId: adminId
      },
      {
        title: 'Regulamentação cripto: Novos marcos legais em discussão',
        slug: 'regulamentacao-cripto-novos-marcos-legais',
        content: `# Regulamentação cripto: Novos marcos legais em discussão

Governos ao redor do mundo estão acelerando discussões sobre regulamentação do mercado de criptomoedas.

## Brasil avança na regulamentação

O Banco Central e a CVM estão trabalhando em conjunto para criar um framework regulatório claro e equilibrado.

## Impacto para investidores

A regulamentação pode trazer mais segurança jurídica, mas também novas obrigações de compliance.`,
        excerpt: 'Governos aceleram discussões sobre regulamentação cripto, buscando equilíbrio entre inovação e proteção.',
        type: 'news',
        category: 'regulacao',
        tags: JSON.stringify(['Regulação', 'Brasil', 'Legislação', 'Compliance']),
        published: true,
        sentiment: Sentiment.neutral,
        authorId: adminId
      },
      {
        title: 'Solana supera Ethereum em transações diárias',
        slug: 'solana-supera-ethereum-transacoes-diarias',
        content: `# Solana supera Ethereum em transações diárias

A blockchain Solana registrou um recorde de 65 milhões de transações em 24 horas, superando Ethereum pela primeira vez.

## O que impulsionou o crescimento

- Baixas taxas de transação (menos de $0.01)
- Velocidade superior (50.000+ TPS)
- Crescimento do ecossistema DeFi e NFT
- Novos protocolos lançados na rede

## Perspectivas

Analistas veem potencial para Solana consolidar-se como alternativa viável ao Ethereum.`,
        excerpt: 'Solana registra recorde de 65 milhões de transações em 24h, superando Ethereum com taxas baixíssimas.',
        type: 'news',
        category: 'mercado',
        tags: JSON.stringify(['Solana', 'SOL', 'Ethereum', 'Blockchain', 'DeFi']),
        published: true,
        sentiment: Sentiment.positive,
        authorId: adminId
      }
    ];

    const educationalArticles = [
      {
        title: 'O que é Bitcoin? Guia completo para iniciantes',
        slug: 'o-que-e-bitcoin-guia-completo',
        content: `# O que é Bitcoin? Guia completo para iniciantes

Bitcoin é a primeira e mais conhecida criptomoeda do mundo, criada em 2009 por uma pessoa (ou grupo) sob o pseudônimo Satoshi Nakamoto.

## Como funciona o Bitcoin

O Bitcoin funciona através de uma tecnologia chamada blockchain, que é um livro-razão digital descentralizado.

### Características principais:

1. **Descentralizado**: Não é controlado por nenhum governo ou instituição
2. **Limitado**: Apenas 21 milhões de bitcoins existirão
3. **Transparente**: Todas as transações são públicas
4. **Seguro**: Usa criptografia avançada

## Como comprar Bitcoin

Você pode comprar Bitcoin em exchanges como Binance, Mercado Bitcoin, ou através de P2P.

## Armazenamento seguro

Use carteiras (wallets) para guardar seus bitcoins com segurança. Nunca deixe grandes quantias em exchanges.`,
        excerpt: 'Aprenda o básico sobre Bitcoin: o que é, como funciona e como começar a investir com segurança.',
        type: 'educational',
        category: 'fundamentos',
        level: 'iniciante',
        contentType: 'Guia',
        readTime: '8 min',
        tags: JSON.stringify(['Bitcoin', 'Iniciante', 'Blockchain', 'Criptomoedas']),
        published: true,
        sentiment: Sentiment.neutral,
        authorId: adminId
      },
      {
        title: 'Como funciona uma carteira de criptomoedas',
        slug: 'como-funciona-carteira-criptomoedas',
        content: `# Como funciona uma carteira de criptomoedas

Uma carteira de criptomoedas é um software ou hardware que permite armazenar, enviar e receber criptomoedas de forma segura.

## Tipos de carteiras

### 1. Carteiras Hot (Online)
- Conectadas à internet
- Mais convenientes
- Menos seguras

### 2. Carteiras Cold (Offline)
- Não conectadas à internet
- Mais seguras
- Menos convenientes

## Como escolher sua carteira

Considere: segurança, facilidade de uso, criptomoedas suportadas e seu volume de investimento.

## Seed Phrase: Sua chave mestra

A seed phrase (frase de recuperação) é a chave mestra da sua carteira. NUNCA compartilhe com ninguém!`,
        excerpt: 'Entenda como funcionam as carteiras de criptomoedas e como escolher a melhor para você.',
        type: 'educational',
        category: 'seguranca',
        level: 'iniciante',
        contentType: 'Tutorial',
        readTime: '6 min',
        tags: JSON.stringify(['Wallet', 'Segurança', 'Iniciante', 'Tutorial']),
        published: true,
        sentiment: Sentiment.neutral,
        authorId: adminId
      },
      {
        title: 'DeFi explicado: O futuro das finanças descentralizadas',
        slug: 'defi-explicado-financas-descentralizadas',
        content: `# DeFi explicado: O futuro das finanças descentralizadas

DeFi (Decentralized Finance) refere-se a serviços financeiros construídos sobre blockchain, sem intermediários.

## Principais protocolos DeFi

### Empréstimos
- Aave
- Compound
- MakerDAO

### Exchanges descentralizadas (DEX)
- Uniswap
- PancakeSwap
- Raydium

## Riscos do DeFi

- Smart contract bugs
- Impermanent loss
- Rug pulls e scams

## Como começar em DeFi

Comece com pequenas quantias, aprenda sobre cada protocolo e sempre faça sua própria pesquisa (DYOR).`,
        excerpt: 'Descubra o mundo das finanças descentralizadas (DeFi) e seus principais protocolos e riscos.',
        type: 'educational',
        category: 'defi',
        level: 'intermediario',
        contentType: 'Guia',
        readTime: '10 min',
        tags: JSON.stringify(['DeFi', 'Intermediário', 'Protocolos', 'Finanças']),
        published: true,
        sentiment: Sentiment.neutral,
        authorId: adminId
      },
      {
        title: 'Análise técnica em criptomoedas: Guia avançado',
        slug: 'analise-tecnica-criptomoedas-guia-avancado',
        content: `# Análise técnica em criptomoedas: Guia avançado

A análise técnica é fundamental para traders que buscam identificar padrões e oportunidades no mercado cripto.

## Indicadores essenciais

### 1. Médias Móveis (MA)
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)

### 2. RSI (Relative Strength Index)
- Identifica condições de sobrecompra/sobrevenda
- Valores acima de 70: sobrecomprado
- Valores abaixo de 30: sobrevendido

### 3. MACD (Moving Average Convergence Divergence)
- Identifica mudanças de momentum
- Crossovers indicam pontos de entrada/saída

## Padrões de candles

- Doji
- Hammer
- Engulfing patterns

## Estratégias de trading

Combine múltiplos indicadores para confirmar sinais e sempre use stop loss.`,
        excerpt: 'Domine a análise técnica com indicadores avançados e estratégias de trading para criptomoedas.',
        type: 'educational',
        category: 'trading',
        level: 'avancado',
        contentType: 'Tutorial',
        readTime: '15 min',
        tags: JSON.stringify(['Trading', 'Análise Técnica', 'Avançado', 'Indicadores']),
        published: true,
        sentiment: Sentiment.neutral,
        authorId: adminId
      }
    ];

    // Criar todos os artigos
    const createdNews = [];
    for (const article of newsArticles) {
      const created = await prisma.article.create({ data: article });
      createdNews.push(created);
    }

    const createdEducational = [];
    for (const article of educationalArticles) {
      const created = await prisma.article.create({ data: article });
      createdEducational.push(created);
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados populado com sucesso!',
      data: {
        news: createdNews.length,
        educational: createdEducational.length,
        total: createdNews.length + createdEducational.length
      }
    });

  } catch (error) {
    console.error('Erro ao executar seed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao popular banco de dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
