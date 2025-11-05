/**
 * Forecasting and Predictive Analytics
 * Simple time series forecasting using linear regression
 */

import { linearRegression, linearRegressionLine } from 'simple-statistics';
import { prisma } from '@/lib/prisma';

export interface ForecastResult {
  metric: string;
  current: number;
  predicted: number;
  change: number;
  changePercent: number;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

/**
 * Forecast article creation for next period
 */
export async function forecastArticleCreation(
  daysAhead = 30
): Promise<ForecastResult> {
  try {
    // Get article creation data for last 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const articles = await prisma.article.findMany({
      where: {
        createdAt: { gte: sixtyDaysAgo }
      },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by day
    const dailyCounts = new Map<string, number>();
    for (const article of articles) {
      const day = article.createdAt.toISOString().split('T')[0];
      dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
    }

    // Convert to data points (day number, count)
    const dataPoints: [number, number][] = [];
    let dayIndex = 0;
    const startDate = sixtyDaysAgo;

    for (let i = 0; i < 60; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const day = currentDate.toISOString().split('T')[0];
      const count = dailyCounts.get(day) || 0;
      dataPoints.push([dayIndex++, count]);
    }

    // Calculate linear regression
    const regression = linearRegression(dataPoints);
    const predict = linearRegressionLine(regression);

    // Current average (last 7 days)
    const recentCounts = dataPoints.slice(-7).map(p => p[1]);
    const currentAvg = recentCounts.reduce((a, b) => a + b, 0) / recentCounts.length;

    // Predict for days ahead
    const futureDay = 60 + daysAhead;
    const predicted = predict(futureDay);

    // Calculate trend
    const change = predicted - currentAvg;
    const changePercent = (change / currentAvg) * 100;

    // Determine confidence based on data variance
    const variance = calculateVariance(recentCounts);
    const confidence = variance < 2 ? 'high' : variance < 5 ? 'medium' : 'low';

    return {
      metric: 'Article Creation',
      current: Math.round(currentAvg),
      predicted: Math.round(predicted),
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
      confidence,
      trend: change > 1 ? 'up' : change < -1 ? 'down' : 'stable'
    };

  } catch (error) {
    console.error('Error forecasting article creation:', error);
    throw error;
  }
}

/**
 * Forecast average quality score
 */
export async function forecastQualityScore(): Promise<ForecastResult> {
  try {
    // Get articles with scores from last 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const articles = await prisma.article.findMany({
      where: {
        createdAt: { gte: sixtyDaysAgo },
        factCheckScore: { not: null }
      },
      select: {
        createdAt: true,
        factCheckScore: true
      },
      orderBy: { createdAt: 'asc' }
    });

    if (articles.length < 10) {
      throw new Error('Insufficient data for quality score forecast');
    }

    // Group by week and calculate average
    const weeklyScores = new Map<number, number[]>();

    for (const article of articles) {
      const weekNumber = Math.floor(
        (article.createdAt.getTime() - sixtyDaysAgo.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      if (!weeklyScores.has(weekNumber)) {
        weeklyScores.set(weekNumber, []);
      }
      weeklyScores.get(weekNumber)!.push(article.factCheckScore!);
    }

    // Calculate weekly averages
    const dataPoints: [number, number][] = [];
    for (const [week, scores] of weeklyScores.entries()) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      dataPoints.push([week, avg]);
    }

    // Linear regression
    const regression = linearRegression(dataPoints);
    const predict = linearRegressionLine(regression);

    // Current average
    const recentScores = articles
      .slice(-20)
      .map(a => a.factCheckScore!)
      .filter(s => s !== null);
    const currentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

    // Predict next week
    const nextWeek = Math.max(...weeklyScores.keys()) + 1;
    const predicted = predict(nextWeek);

    const change = predicted - currentAvg;
    const changePercent = (change / currentAvg) * 100;

    const variance = calculateVariance(recentScores);
    const confidence = variance < 100 ? 'high' : variance < 200 ? 'medium' : 'low';

    return {
      metric: 'Quality Score',
      current: Math.round(currentAvg * 10) / 10,
      predicted: Math.round(predicted * 10) / 10,
      change: Math.round(change * 10) / 10,
      changePercent: Math.round(changePercent * 10) / 10,
      confidence,
      trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
    };

  } catch (error) {
    console.error('Error forecasting quality score:', error);
    throw error;
  }
}

/**
 * Get all forecasts
 */
export async function getAllForecasts(): Promise<{
  forecasts: ForecastResult[];
  generatedAt: Date;
}> {
  const forecasts: ForecastResult[] = [];

  try {
    forecasts.push(await forecastArticleCreation(30));
  } catch (error) {
    console.error('Failed to forecast article creation:', error);
  }

  try {
    forecasts.push(await forecastQualityScore());
  } catch (error) {
    console.error('Failed to forecast quality score:', error);
  }

  return {
    forecasts,
    generatedAt: new Date()
  };
}

/**
 * Calculate variance of a dataset
 */
function calculateVariance(data: number[]): number {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
}
