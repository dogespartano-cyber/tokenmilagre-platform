'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Verificar se o usuário já aceitou os cookies
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Pequeno delay para não ser intrusivo imediatamente
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-fade-in-up">
            <div className="glass-card !backdrop-blur-2xl !bg-white/90 dark:!bg-gray-900/90 p-6 rounded-2xl shadow-2xl border border-[var(--brand-primary)]/20 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-start gap-4 relative z-10">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)]">
                        <FontAwesomeIcon icon={faCookieBite} className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-[var(--text-primary)] mb-2 font-[family-name:var(--font-poppins)]">
                            Nós valorizamos sua privacidade
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                            Utilizamos cookies para melhorar sua experiência e analisar o tráfego. Ao continuar, você concorda com nossa{' '}
                            <Link href="/privacidade" className="text-[var(--brand-primary)] hover:underline font-medium">
                                Política de Privacidade
                            </Link>.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={acceptCookies}
                                className="flex-1 px-4 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-[var(--brand-primary)]/30"
                            >
                                Aceitar
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="px-4 py-2 bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-semibold rounded-lg transition-all border border-[var(--border-light)]"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
