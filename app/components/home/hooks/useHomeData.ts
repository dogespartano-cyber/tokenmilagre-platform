/**
 * @module home/hooks/useHomeData
 * @description Hook principal para dados da Home Page
 * @agi-purpose Centralizar lógica de fetch com cache
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MarketData, NewsItem, EducationItem, ResourceItem } from '../types';

interface UseHomeDataReturn {
    marketData: MarketData | null;
    news: NewsItem[];
    education: EducationItem[];
    resources: ResourceItem[];
    dailyAnalysis: NewsItem | null;
    loading: boolean;
    loadingResources: boolean;
}

// Helper: Gradiente baseado na categoria
const getResourceGradient = (category: string): string => {
    const gradients: Record<string, string> = {
        wallet: 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)',
        exchange: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        'defi-protocol': 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
        browsers: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        analytics: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        explorers: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'development-tools': 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
        tools: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
        'portfolio-tracker': 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    };
    return gradients[category] || 'linear-gradient(135deg, #64748B 0%, #475569 100%)';
};

// Helper: Stats baseado na categoria
const getResourceStats = (category: string): string => {
    const stats: Record<string, string> = {
        wallet: 'Verificado',
        exchange: 'Popular',
        'defi-protocol': 'DeFi',
        browsers: 'Web3',
        analytics: 'Analytics',
        explorers: 'Explorer',
        'development-tools': 'Dev',
        tools: 'Tools',
        'portfolio-tracker': 'Portfolio',
    };
    return stats[category] || 'Verificado';
};

export function useHomeData(): UseHomeDataReturn {
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [dailyAnalysis, setDailyAnalysis] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingResources, setLoadingResources] = useState(true);

    const fetchMarketData = useCallback(async () => {
        const CACHE_KEY = 'home_market_data';

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                setMarketData(cachedData);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar cache de market data:', error);
            }
        }

        try {
            const response = await fetch('/api/market');
            const result = await response.json();

            if (result.success && result.data) {
                setMarketData(result.data);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
            }
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar dados do mercado:', error);
            setLoading(false);
        }
    }, []);

    const fetchNews = useCallback(async () => {
        const CACHE_KEY = 'home_news_list_v2';

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                setNews(cachedData);
            } catch (error) {
                console.error('Erro ao carregar cache de notícias:', error);
            }
        }

        try {
            const response = await fetch(`/api/articles?type=news&published=true&t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            const data = await response.json();
            if (data.success && data.data) {
                const sortedNews = data.data
                    .sort((a: NewsItem, b: NewsItem) =>
                        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                    )
                    .slice(0, 5);
                setNews(sortedNews);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(sortedNews));
            }
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            if (!cached) setNews([]);
        }
    }, []);

    const fetchEducation = useCallback(async () => {
        const CACHE_KEY = 'home_education_list';

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                setEducation(cachedData);
            } catch (error) {
                console.error('Erro ao carregar cache de educação:', error);
            }
        }

        try {
            const response = await fetch('/api/articles?type=educational');
            const data = await response.json();
            if (data.success && data.data) {
                let educationalArticles = data.data;

                // Fallback Content Generator
                const fallbackContent: EducationItem[] = [
                    {
                        id: 'fallback-1',
                        slug: 'o-que-e-defi',
                        title: 'O que é DeFi? Finanças Descentralizadas Explicadas',
                        summary: 'Descubra como o DeFi está eliminando intermediários financeiros através de Smart Contracts e criando um novo sistema bancário global aberto.',
                        level: 'Iniciante',
                        readTime: '6 min'
                    },
                    {
                        id: 'fallback-2',
                        slug: 'analise-tecnica-vs-fundamentalista',
                        title: 'Análise Técnica vs. Fundamentalista: O Guia Completo',
                        summary: 'Aprenda a combinar gráficos e fundamentos do projeto para tomar decisões de investimento mais assertivas e evitar armadilhas comuns.',
                        level: 'Intermediário',
                        readTime: '8 min'
                    },
                    {
                        id: 'fallback-3',
                        slug: 'seguranca-crypto-avancada',
                        title: 'Segurança Máxima: Hardware Wallets e OpSec',
                        summary: 'Proteja seu patrimônio contra hacks. Um guia prático sobre Cold Wallets, frases de recuperação e como evitar ataques de engenharia social.',
                        level: 'Avançado',
                        readTime: '12 min'
                    },
                    {
                        id: 'fallback-4',
                        slug: 'tokenomics-101',
                        title: 'Tokenomics: A Ciência da Economia dos Tokens',
                        summary: 'Entenda como oferta, demanda, vesting e utilidade influenciam o preço de um ativo no longo prazo. O que olhar antes de investir?',
                        level: 'Intermediário',
                        readTime: '7 min'
                    },
                    {
                        id: 'fallback-5',
                        slug: 'web3-basics',
                        title: 'Web3 e o Futuro da Internet',
                        summary: 'Como a internet descentralizada devolve a propriedade dos dados aos usuários e o impacto disso nas redes sociais e economia digital.',
                        level: 'Iniciante',
                        readTime: '5 min'
                    }
                ];

                // Merge API data with Fallback if needed to reach 6 items
                if (educationalArticles.length < 6) {
                    const needed = 6 - educationalArticles.length;
                    const extras = fallbackContent.slice(0, needed);
                    educationalArticles = [...educationalArticles, ...extras];
                }

                const finalSelection = educationalArticles.slice(0, 6);
                setEducation(finalSelection);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(finalSelection));
            }
        } catch (error) {
            console.error('Erro ao buscar artigos educacionais:', error);
            if (!cached) setEducation([]);
        }
    }, []);

    const fetchResources = useCallback(async () => {
        try {
            setLoadingResources(true);
            const response = await fetch('/api/resources?verified=true');
            const data = await response.json();

            if (data.success && data.data && data.data.length > 0) {
                const topResources = data.data.slice(0, 6).map((r: Record<string, unknown>) => ({
                    name: r.name as string,
                    category: ((r.category as string).charAt(0).toUpperCase() + (r.category as string).slice(1)),
                    description: r.shortDescription as string,
                    gradient: getResourceGradient(r.category as string),
                    stats: getResourceStats(r.category as string),
                    verified: r.verified as boolean,
                    url: `/recursos/${r.slug}`
                }));
                setResources(topResources);
            } else {
                setResources([]);
            }
        } catch (error) {
            console.error('Erro ao buscar recursos:', error);
            setResources([]);
        } finally {
            setLoadingResources(false);
        }
    }, []);

    const fetchDailyAnalysis = useCallback(async () => {
        const CACHE_KEY = 'home_daily_analysis';

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                const cacheDate = new Date(cachedData.publishedAt).toDateString();
                const today = new Date().toDateString();
                if (cacheDate === today) {
                    setDailyAnalysis(cachedData);
                }
            } catch (error) {
                console.error('Erro ao carregar cache da análise diária:', error);
            }
        }

        try {
            const response = await fetch('/api/articles?type=news&limit=20');
            const data = await response.json();

            if (data.success && data.data) {
                const today = new Date().toDateString();

                const analysis = data.data.find((article: NewsItem) => {
                    const articleDate = new Date(article.publishedAt).toDateString();
                    const articleTags = article.keywords || [];
                    const hasTag = articleTags.some((tag: string) =>
                        tag.toLowerCase() === 'analise-diaria'
                    );
                    return hasTag && articleDate === today;
                });

                if (analysis) {
                    setDailyAnalysis(analysis);
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(analysis));
                } else {
                    setDailyAnalysis(null);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar análise diária:', error);
            if (!cached) setDailyAnalysis(null);
        }
    }, []);

    useEffect(() => {
        fetchMarketData();
        fetchNews();
        fetchEducation();
        fetchResources();
        fetchDailyAnalysis();

        const interval = setInterval(() => {
            fetchMarketData();
            fetchNews();
            fetchEducation();
            fetchResources();
            fetchDailyAnalysis();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchMarketData, fetchNews, fetchEducation, fetchResources, fetchDailyAnalysis]);

    return {
        marketData,
        news,
        education,
        resources,
        dailyAnalysis,
        loading,
        loadingResources,
    };
}
