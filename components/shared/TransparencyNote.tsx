'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import ZenithCard from '@/components/ui/ZenithCard';

interface TransparencyNoteProps {
  publishedAt: string | Date;
}

export default function TransparencyNote({ publishedAt }: TransparencyNoteProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="relative group mt-12 overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm transition-all hover:border-[var(--brand-primary)]/30">

      {/* Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--brand-primary)] to-transparent opacity-50" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Nota de Transparência
              </h3>
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                Compromisso $MILAGRE
              </p>
            </div>
          </div>


        </div>

        <div className="relative">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)] italic">
            "Este conteúdo é educacional e não constitui aconselhamento financeiro (DYOR).
            Ferramentas como o <strong>Perplexity</strong> podem cometer erros, por isso revisamos
            nossos dados — mas a verificação final é sempre sua responsabilidade."
          </p>
        </div>
      </div>
    </div>
  );
}
