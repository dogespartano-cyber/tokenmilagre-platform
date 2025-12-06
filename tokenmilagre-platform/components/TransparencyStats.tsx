'use client';

import { useEffect, useState } from 'react';
import { Server, Code, Zap, Activity, GitBranch, BookOpen } from 'lucide-react';

interface PublicStats {
    articles: {
        total: number;
        news: number;
        educational: number;
    };
    resources: number;
    updatedAt: string;
}

export default function TransparencyStats() {
    const [stats, setStats] = useState<PublicStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        // Atualizar a cada 30 segundos
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/public-stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sistema Operacional */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/10 rounded-xl text-green-600 dark:text-green-400">
                        <Server className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-green-600 dark:text-green-400">Sistema</h3>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">100%</p>
                    <p className="text-sm text-green-700/60 dark:text-green-300/60 mb-1">Online</p>
                </div>
                <p className="text-xs text-green-700/60 dark:text-green-300/60 mt-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Uptime 99.9%
                </p>
            </div>

            {/* Desenvolvimento */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                        <Code className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-blue-600 dark:text-blue-400">Desenvolvimento</h3>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">Ativo</p>
                </div>
                <p className="text-xs text-blue-700/60 dark:text-blue-300/60 mt-2 flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    Branch main atualizada
                </p>
            </div>

            {/* IA Generativa - Artigos com breakdown */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-purple-600 dark:text-purple-400">Artigos IA</h3>
                </div>
                <div className="flex items-end gap-2">
                    {loading ? (
                        <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">...</p>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stats?.articles.total || 0}
                        </p>
                    )}
                    <p className="text-sm text-purple-700/60 dark:text-purple-300/60 mb-1">Total</p>
                </div>
                {!loading && stats && (
                    <p className="text-xs text-purple-700/60 dark:text-purple-300/60 mt-2">
                        {stats.articles.news} notícias • {stats.articles.educational} educacionais
                    </p>
                )}
            </div>

            {/* Recursos */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-amber-600 dark:text-amber-400">Recursos</h3>
                </div>
                <div className="flex items-end gap-2">
                    {loading ? (
                        <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">...</p>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stats?.resources || 0}
                        </p>
                    )}
                    <p className="text-sm text-amber-700/60 dark:text-amber-300/60 mb-1">Avaliações</p>
                </div>
                <p className="text-xs text-amber-700/60 dark:text-amber-300/60 mt-2">
                    Exchanges, wallets e mais
                </p>
            </div>
        </div>
    );
}
