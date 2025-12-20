'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import ZenithCard from '@/components/ui/ZenithCard';

interface TransparencyNoteProps {
    publishedAt: string | Date;
}

export default function TransparencyNote({ publishedAt }: TransparencyNoteProps) {
    const formattedDate = new Date(publishedAt).toLocaleDateString('pt-BR');

    return (
        <ZenithCard variant="teal" className="mt-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400 transition-transform duration-300 group-hover:scale-110">
                    <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-teal-600 dark:text-teal-400">
                    Nota de Transparência
                </h3>
            </div>

            <div className="space-y-2">
                <p className="text-sm leading-relaxed text-[var(--text-article-body)]">
                    Publicado por{' '}
                    <Link
                        href="/transparencia"
                        className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                        $MILAGRE Research
                    </Link>
                    {' '}· {formattedDate}
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-article-body)]">
                    Assistido por IA · Revisão humana ·{' '}
                    <Link href="/transparencia" className="text-teal-600 dark:text-teal-400 hover:underline">
                        Código aberto
                    </Link>
                </p>
                <p className="text-xs text-teal-700/60 dark:text-teal-300/60 mt-2">
                    Este conteúdo é educacional. Não é aconselhamento financeiro. DYOR. Perplexity pode cometer erros. Por isso, é bom checar as respostas.
                </p>
            </div>
        </ZenithCard>
    );
}
