/**
 * Footer Component
 * Rodapé da aplicação
 * 
 * @agi-domain: layout
 * @refactored Extraído de layout-root.tsx
 */

'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-transparent border-none relative z-10">
            <div className="container mx-auto px-4 py-8">
                {/* Filosofia de Prosperidade */}


                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-sm font-semibold text-[var(--text-tertiary)]">
                            $MILAGRE &quot;Acreditamos em riqueza construída com fundamentos, paciência e ética!&quot;
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
                        <Link href="/transparencia" className="hover:text-[var(--brand-primary)] transition-colors">
                            Transparência
                        </Link>
                        <Link href="/manifesto" className="hover:text-[var(--brand-primary)] transition-colors">
                            Manifesto
                        </Link>
                        <Link href="/termos" className="hover:text-[var(--brand-primary)] transition-colors">
                            Termos de Uso
                        </Link>
                        <Link href="/privacidade" className="hover:text-[var(--brand-primary)] transition-colors">
                            Política de Privacidade
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
