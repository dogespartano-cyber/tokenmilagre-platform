'use client';

import { useHolderCount } from '@/hooks/useHolderCount';

export function HolderCounter() {
  const { count, loading, error } = useHolderCount();

  if (error) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-300/30">
        <span className="text-red-300 text-sm">⚠️ Erro ao carregar holders</span>
      </div>
    );
  }

  if (loading || count === null) {
    return (
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border-2 border-white/30 shadow-lg animate-pulse">
        <span className="text-2xl">👥</span>
        <div className="flex flex-col">
          <span className="text-white/60 text-xs font-semibold">Holders</span>
          <span className="text-white font-bold text-lg">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-lg rounded-full border-2 border-yellow-300/40 shadow-lg hover:shadow-yellow-300/50 transition-all">
      <span className="text-2xl animate-bounce">👥</span>
      <div className="flex flex-col">
        <span className="text-yellow-200 text-xs font-semibold">Holders Ativos</span>
        <span className="text-white font-bold text-2xl tabular-nums">
          {count.toLocaleString('pt-BR')}
        </span>
      </div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Ao vivo" />
    </div>
  );
}
