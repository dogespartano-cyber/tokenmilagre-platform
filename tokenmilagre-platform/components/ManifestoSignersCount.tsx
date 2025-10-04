'use client';

import { useManifestoSigners } from '@/hooks/useManifestoSigners';

interface ManifestoSignersCountProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function ManifestoSignersCount({ variant = 'default', className = '' }: ManifestoSignersCountProps) {
  const { count, loading } = useManifestoSigners();

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full border border-green-300/40 animate-pulse ${className}`}>
        <span className="text-2xl">✍️</span>
        <div className="text-left">
          <p className="text-white/80 text-xs font-semibold">Signatários do Manifesto</p>
          <p className="text-white font-bold text-xl">
            <span className="text-yellow-200">...</span> pessoas
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 ${className}`}>
        <p className="text-white/90 text-sm">
          <span className="font-bold text-yellow-200 text-lg">{count}</span> {count === 1 ? 'pessoa assinou' : 'pessoas assinaram'}
        </p>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full border border-green-300/40 ${className}`}>
      <span className="text-2xl">✍️</span>
      <div className="text-left">
        <p className="text-white/80 text-xs font-semibold">Signatários do Manifesto</p>
        <p className="text-white font-bold text-xl">
          <span className="text-yellow-200">{count}</span> pessoas
        </p>
      </div>
    </div>
  );
}
