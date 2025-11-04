/**
 * Smart Recommendations Engine
 * Generates actionable recommendations based on data analysis
 */

import { detectPatterns, DetectedPattern } from './pattern-detection';
import { getAllForecasts, ForecastResult } from './forecasting';
import { runHealthCheck } from '../monitoring/monitor';
import { getTrendingTopics, getTopTrendingTopics } from '../cache/trending-cache';

export interface Recommendation {
  id: string;
  category: 'content' | 'quality' | 'growth' | 'automation' | 'trending';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  basedOn: string;
  data?: any;
}

let recommendationIdCounter = 1;

/**
 * Generate all recommendations
 */
export async function generateRecommendations(): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  // Health-based recommendations
  const healthRecs = await generateHealthRecommendations();
  recommendations.push(...healthRecs);

  // Pattern-based recommendations
  const patternRecs = await generatePatternRecommendations();
  recommendations.push(...patternRecs);

  // Forecast-based recommendations
  const forecastRecs = await generateForecastRecommendations();
  recommendations.push(...forecastRecs);

  // Trending-based recommendations
  const trendingRecs = generateTrendingRecommendations();
  recommendations.push(...trendingRecs);

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Generate recommendations based on health check
 */
async function generateHealthRecommendations(): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  try {
    const healthCheck = await runHealthCheck();

    // Quality recommendations
    if (healthCheck.checks.lowQualityArticles.status === 'fail') {
      recommendations.push({
        id: `rec_${recommendationIdCounter++}`,
        category: 'quality',
        priority: 'high',
        title: 'Melhorar artigos com score crítico',
        description: `${healthCheck.checks.lowQualityArticles.count} artigos com score abaixo de 50`,
        action: 'Usar ferramenta analyze_content_quality para identificar e corrigir problemas',
        impact: 'Melhora significativa na qualidade geral do conteúdo',
        effort: 'medium',
        basedOn: 'Health Check - Low Quality Articles'
      });
    }

    // Freshness recommendations
    if (healthCheck.checks.outdatedArticles.status !== 'pass') {
      recommendations.push({
        id: `rec_${recommendationIdCounter++}`,
        category: 'content',
        priority: healthCheck.checks.outdatedArticles.status === 'fail' ? 'high' : 'medium',
        title: 'Atualizar artigos desatualizados',
        description: `${healthCheck.checks.outdatedArticles.count} notícias antigas detectadas`,
        action: 'Usar check_outdated_articles e atualizar ou arquivar conteúdo antigo',
        impact: 'Mantém relevância e precisão das informações',
        effort: 'medium',
        basedOn: 'Health Check - Outdated Articles'
      });
    }

    // Media recommendations
    if (healthCheck.checks.missingCoverImages.status === 'warning') {
      recommendations.push({
        id: `rec_${recommendationIdCounter++}`,
        category: 'content',
        priority: 'low',
        title: 'Adicionar imagens de capa',
        description: `${healthCheck.checks.missingCoverImages.count} artigos sem capa`,
        action: 'Gerar capas com IA para melhorar engajamento visual',
        impact: 'Aumenta taxa de cliques e compartilhamentos',
        effort: 'low',
        basedOn: 'Health Check - Missing Cover Images'
      });
    }

  } catch (error) {
    console.error('Error generating health recommendations:', error);
  }

  return recommendations;
}

/**
 * Generate recommendations based on patterns
 */
async function generatePatternRecommendations(): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  try {
    const patterns = await detectPatterns();

    for (const pattern of patterns) {
      if (pattern.impact === 'high' || pattern.impact === 'medium') {
        recommendations.push({
          id: `rec_${recommendationIdCounter++}`,
          category: pattern.type === 'quality' ? 'quality' : 'content',
          priority: pattern.impact === 'high' ? 'high' : 'medium',
          title: pattern.pattern,
          description: pattern.recommendation,
          action: pattern.recommendation,
          impact: 'Baseado em análise de padrões dos últimos 30 dias',
          effort: 'medium',
          basedOn: `Pattern Detection - ${pattern.type}`,
          data: pattern.data
        });
      }
    }

  } catch (error) {
    console.error('Error generating pattern recommendations:', error);
  }

  return recommendations;
}

/**
 * Generate recommendations based on forecasts
 */
async function generateForecastRecommendations(): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  try {
    const { forecasts } = await getAllForecasts();

    for (const forecast of forecasts) {
      // Growth opportunities
      if (forecast.trend === 'up' && forecast.changePercent > 20) {
        recommendations.push({
          id: `rec_${recommendationIdCounter++}`,
          category: 'growth',
          priority: 'medium',
          title: `${forecast.metric}: Crescimento previsto`,
          description: `Previsão de aumento de ${forecast.changePercent}% (${forecast.current} → ${forecast.predicted})`,
          action: 'Preparar recursos para suportar crescimento projetado',
          impact: 'Capitalizar tendência de crescimento',
          effort: 'low',
          basedOn: 'Forecast Analysis',
          data: forecast
        });
      }

      // Decline warnings
      if (forecast.trend === 'down' && forecast.changePercent < -10) {
        recommendations.push({
          id: `rec_${recommendationIdCounter++}`,
          category: 'growth',
          priority: 'high',
          title: `${forecast.metric}: Declínio previsto`,
          description: `Previsão de queda de ${Math.abs(forecast.changePercent)}% (${forecast.current} → ${forecast.predicted})`,
          action: 'Investigar causas e implementar estratégias de reversão',
          impact: 'Prevenir declínio significativo',
          effort: 'high',
          basedOn: 'Forecast Analysis',
          data: forecast
        });
      }
    }

  } catch (error) {
    console.error('Error generating forecast recommendations:', error);
  }

  return recommendations;
}

/**
 * Generate recommendations based on trending topics
 */
function generateTrendingRecommendations(): Recommendation[] {
  const recommendations: Recommendation[] = [];

  try {
    const topTrending = getTopTrendingTopics(5);

    if (topTrending.length > 0) {
      for (const topic of topTrending.slice(0, 3)) {
        recommendations.push({
          id: `rec_${recommendationIdCounter++}`,
          category: 'trending',
          priority: topic.urgency === 'high' ? 'high' : 'medium',
          title: `Criar artigo: ${topic.title}`,
          description: topic.description,
          action: `Criar ${topic.suggestedArticleType === 'news' ? 'notícia' : 'artigo educacional'} sobre ${topic.title}`,
          impact: 'Capitalizar tópico em alta no mercado crypto',
          effort: 'medium',
          basedOn: 'Trending Topics Cache',
          data: topic
        });
      }
    }

  } catch (error) {
    console.error('Error generating trending recommendations:', error);
  }

  return recommendations;
}

/**
 * Get top recommendations (limited)
 */
export async function getTopRecommendations(limit = 10): Promise<Recommendation[]> {
  const all = await generateRecommendations();
  return all.slice(0, limit);
}
