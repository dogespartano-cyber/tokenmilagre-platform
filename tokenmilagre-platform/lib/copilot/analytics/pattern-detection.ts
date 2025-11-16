/**
 * Pattern Detection
 * Detects patterns in content creation and user behavior
 */

import { prisma } from '@/lib/prisma';

export interface DetectedPattern {
  type: 'category' | 'timing' | 'quality' | 'author';
  pattern: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  data?: any;
}

/**
 * Detect all patterns
 */
export async function detectPatterns(): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  // Detect popular categories
  const categoryPatterns = await detectCategoryPatterns();
  patterns.push(...categoryPatterns);

  // Detect timing patterns
  const timingPatterns = await detectTimingPatterns();
  patterns.push(...timingPatterns);

  // Detect quality patterns
  const qualityPatterns = await detectQualityPatterns();
  patterns.push(...qualityPatterns);

  return patterns;
}

/**
 * Detect category popularity patterns
 */
async function detectCategoryPatterns(): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  try {
    // Get articles from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const articles = await prisma.article.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        published: true
      },
      select: {
        category: true
      }
    });

    // Count by category
    const categoryCounts = new Map<string, number>();
    for (const article of articles) {
      categoryCounts.set(article.category, (categoryCounts.get(article.category) || 0) + 1);
    }

    // Find trending categories (>20% of content)
    const total = articles.length;
    const threshold = total * 0.2;

    for (const [category, count] of categoryCounts.entries()) {
      if (count > threshold) {
        const percentage = Math.round((count / total) * 100);
        patterns.push({
          type: 'category',
          pattern: `Categoria '${category}' representa ${percentage}% do conteúdo`,
          confidence: count > total * 0.3 ? 0.9 : 0.7,
          impact: count > total * 0.3 ? 'high' : 'medium',
          recommendation: `Categoria popular - continuar produzindo conteúdo sobre ${category}`,
          data: { category, count, percentage }
        });
      }
    }

    // Find underrepresented categories
    const lowThreshold = total * 0.05; // <5% is underrepresented
    for (const [category, count] of categoryCounts.entries()) {
      if (count < lowThreshold && count > 0) {
        const percentage = Math.round((count / total) * 100);
        patterns.push({
          type: 'category',
          pattern: `Categoria '${category}' subrepresentada (${percentage}%)`,
          confidence: 0.8,
          impact: 'low',
          recommendation: `Considerar aumentar produção sobre ${category} ou descontinuar`,
          data: { category, count, percentage }
        });
      }
    }

  } catch (error) {
    console.error('Error detecting category patterns:', error);
  }

  return patterns;
}

/**
 * Detect timing patterns (when articles are published)
 */
async function detectTimingPatterns(): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const articles = await prisma.article.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        published: true
      },
      select: {
        createdAt: true
      }
    });

    // Count by hour
    const hourCounts = new Map<number, number>();
    for (const article of articles) {
      const hour = article.createdAt.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    }

    // Find peak hours (>10% of content)
    const total = articles.length;
    const threshold = total * 0.1;

    for (const [hour, count] of hourCounts.entries()) {
      if (count > threshold) {
        const percentage = Math.round((count / total) * 100);
        patterns.push({
          type: 'timing',
          pattern: `${percentage}% dos artigos publicados entre ${hour}h-${hour + 1}h`,
          confidence: 0.7,
          impact: 'medium',
          recommendation: `Horário de pico detectado - otimizar agenda de publicação`,
          data: { hour, count, percentage }
        });
      }
    }

  } catch (error) {
    console.error('Error detecting timing patterns:', error);
  }

  return patterns;
}

/**
 * Detect quality patterns
 */
async function detectQualityPatterns(): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  try {
    const articles = await prisma.article.findMany({
      where: {
        factCheckScore: { not: null },
        published: true
      },
      select: {
        type: true,
        category: true,
        factCheckScore: true
      }
    });

    if (articles.length < 20) {
      return patterns; // Insufficient data
    }

    // Compare quality by type
    const newsArticles = articles.filter((a: any) => a.type === 'news');
    const eduArticles = articles.filter((a: any) => a.type === 'educational');

    if (newsArticles.length > 0 && eduArticles.length > 0) {
      const newsAvg = newsArticles.reduce((sum: any, a: any) => sum + (a.factCheckScore || 0), 0) / newsArticles.length;
      const eduAvg = eduArticles.reduce((sum: any, a: any) => sum + (a.factCheckScore || 0), 0) / eduArticles.length;

      const diff = Math.abs(newsAvg - eduAvg);
      if (diff > 10) {
        const better = newsAvg > eduAvg ? 'notícias' : 'educacionais';
        const worse = newsAvg > eduAvg ? 'educacionais' : 'notícias';
        patterns.push({
          type: 'quality',
          pattern: `Artigos ${better} têm qualidade ${Math.round(diff)} pontos maior`,
          confidence: diff > 15 ? 0.9 : 0.7,
          impact: 'high',
          recommendation: `Melhorar processo de criação de artigos ${worse}`,
          data: { newsAvg: Math.round(newsAvg), eduAvg: Math.round(eduAvg) }
        });
      }
    }

    // Compare quality by category
    const categoryScores = new Map<string, number[]>();
    for (const article of articles) {
      if (!categoryScores.has(article.category)) {
        categoryScores.set(article.category, []);
      }
      categoryScores.get(article.category)!.push(article.factCheckScore!);
    }

    const categoryAverages = new Map<string, number>();
    for (const [category, scores] of categoryScores.entries()) {
      if (scores.length >= 5) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        categoryAverages.set(category, avg);
      }
    }

    // Find best and worst categories
    if (categoryAverages.size > 2) {
      const sorted = Array.from(categoryAverages.entries()).sort((a, b) => b[1] - a[1]);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];

      if (best[1] - worst[1] > 15) {
        patterns.push({
          type: 'quality',
          pattern: `Categoria '${best[0]}' tem melhor qualidade (${Math.round(best[1])} vs ${Math.round(worst[1])})`,
          confidence: 0.8,
          impact: 'medium',
          recommendation: `Aplicar boas práticas de '${best[0]}' em '${worst[0]}'`,
          data: { bestCategory: best[0], bestScore: Math.round(best[1]), worstCategory: worst[0], worstScore: Math.round(worst[1]) }
        });
      }
    }

  } catch (error) {
    console.error('Error detecting quality patterns:', error);
  }

  return patterns;
}
