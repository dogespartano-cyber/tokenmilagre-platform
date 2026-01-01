'use client';

import { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import {
      Shield,
      Search,
      CheckCircle,
      AlertTriangle,
      XCircle,
      Lightbulb,
      TrendingUp,
      Flag,
      Lock,
      Globe,
      AlertCircle,
      ShieldCheck,
      ShieldAlert,
      Loader2
} from 'lucide-react';

const pageHeader = {
      title: 'Verificador de Links',
      description: 'Proteja-se contra phishing e scams antes de clicar em links suspeitos.',
      shortTitle: 'Verificador'
};

interface VerificationResult {
      safe: boolean;
      threat?: {
            level: 'critical' | 'warning' | 'suspicious';
            reasons: string[];
            educationalTip: string;
            similarLegitDomain?: string;
            source: string;
      };
      cached: boolean;
      checkedAt: string;
}

export default function VerificadorURLPage() {
      const [url, setUrl] = useState('');
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState<VerificationResult | null>(null);
      const [error, setError] = useState<string | null>(null);

      const handleVerify = async () => {
            if (!url.trim()) {
                  setError('Por favor, insira uma URL');
                  return;
            }

            setLoading(true);
            setError(null);
            setResult(null);

            try {
                  const response = await fetch('/api/check-url', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url.trim() }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                        throw new Error(data.error || 'Erro ao verificar URL');
                  }

                  setResult(data);
            } catch (err) {
                  setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                  setLoading(false);
            }
      };

      const handleKeyPress = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                  handleVerify();
            }
      };

      return (
            <PageWrapper header={pageHeader}>
                  <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-8 space-y-12">

                        {/* Search Section */}
                        <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
                              <div className="relative flex flex-col sm:flex-row items-center bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-2xl p-2 shadow-xl gap-2">
                                    <div className="hidden sm:block pl-4 text-[var(--text-tertiary)]">
                                          <Shield className="w-6 h-6" />
                                    </div>
                                    <input
                                          type="text"
                                          value={url}
                                          onChange={(e) => setUrl(e.target.value)}
                                          onKeyPress={handleKeyPress}
                                          placeholder="Cole o link suspeito aqui..."
                                          className="w-full sm:flex-1 bg-transparent border-none focus:ring-0 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] h-12 sm:h-14 px-4 text-base sm:text-lg text-center sm:text-left"
                                          disabled={loading}
                                    />
                                    <button
                                          onClick={handleVerify}
                                          disabled={loading || !url.trim()}
                                          className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-xl px-8 h-12 transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                          {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                          ) : (
                                                <>
                                                      <Search className="w-5 h-5" />
                                                      <span>Verificar</span>
                                                </>
                                          )}
                                    </button>
                              </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-3 animate-fade-in">
                                    <AlertCircle className="w-6 h-6 text-rose-500 mt-0.5" />
                                    <div>
                                          <h3 className="font-bold text-rose-500">Erro na verificação</h3>
                                          <p className="text-rose-400/80 text-sm">{error}</p>
                                    </div>
                              </div>
                        )}

                        {/* Result Section */}
                        {result && (
                              <div className="animate-fade-in-up">
                                    {result.safe ? (
                                          // SAFE RESULT - Modern Editorial Glass Style
                                          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-12">
                                                <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5">
                                                      <ShieldCheck className="w-32 h-32 md:w-64 md:h-64 text-emerald-500" />
                                                </div>

                                                <div className="relative z-10">
                                                      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 text-center md:text-left">
                                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                                                  <CheckCircle className="w-7 h-7 md:w-8 md:h-8" />
                                                            </div>
                                                            <div>
                                                                  <p className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-1">Status da Verificação</p>
                                                                  <h2 className="text-2xl md:text-4xl font-serif text-[var(--text-primary)]">Link Aparentemente Seguro</h2>
                                                            </div>
                                                      </div>

                                                      <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-emerald-500/30 pl-6 my-6 md:my-8 text-left">
                                                            Nenhuma ameaça conhecida foi detectada em nossos bancos de dados para este domínio.
                                                            <br />
                                                            <span className="text-sm opacity-70 mt-2 block">Lembre-se: Scams novos surgem a todo momento. Mantenha a cautela.</span>
                                                      </p>

                                                      {result.cached && (
                                                            <div className="flex items-center gap-2 text-xs text-emerald-500/60 font-mono">
                                                                  <TrendingUp className="w-3 h-3" />
                                                                  Resultado do cache • {new Date(result.checkedAt).toLocaleString('pt-BR')}
                                                            </div>
                                                      )}
                                                </div>
                                          </div>
                                    ) : (
                                          // DANGEROUS RESULT
                                          <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 md:p-12">
                                                <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5">
                                                      <ShieldAlert className="w-32 h-32 md:w-64 md:h-64 text-rose-500" />
                                                </div>

                                                <div className="relative z-10">
                                                      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 text-center md:text-left">
                                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                                                                  {result.threat?.level === 'critical' ? (
                                                                        <XCircle className="w-7 h-7 md:w-8 md:h-8" />
                                                                  ) : (
                                                                        <AlertTriangle className="w-7 h-7 md:w-8 md:h-8" />
                                                                  )}
                                                            </div>
                                                            <div>
                                                                  <p className="text-rose-500 font-bold tracking-widest text-xs uppercase mb-1">Alerta de Segurança</p>
                                                                  <h2 className="text-2xl md:text-4xl font-serif text-[var(--text-primary)]">
                                                                        {result.threat?.level === 'critical' ? 'Ameaça Crítica Detectada' : 'Link Suspeito'}
                                                                  </h2>
                                                            </div>
                                                      </div>

                                                      <div className="glass bg-rose-500/5 border-rose-500/20 rounded-2xl p-6 mb-8 text-left">
                                                            <h3 className="font-bold text-rose-500 flex items-center gap-2 mb-4">
                                                                  <AlertTriangle className="w-5 h-5 shrink-0" />
                                                                  Motivos do Alerta:
                                                            </h3>
                                                            <ul className="space-y-3">
                                                                  {result.threat?.reasons.map((reason, idx) => (
                                                                        <li key={idx} className="flex items-start gap-3 text-rose-400 group text-sm md:text-base">
                                                                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 group-hover:scale-150 transition-transform shrink-0" />
                                                                              {reason}
                                                                        </li>
                                                                  ))}
                                                            </ul>
                                                      </div>

                                                      {/* Educational Tip */}
                                                      {result.threat?.educationalTip && (
                                                            <div className="flex gap-4 p-5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm">
                                                                  <Lightbulb className="w-6 h-6 text-yellow-500 shrink-0" />
                                                                  <div>
                                                                        <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">Dica de Segurança</h4>
                                                                        <p className="text-[var(--text-secondary)] text-sm">{result.threat.educationalTip}</p>
                                                                  </div>
                                                            </div>
                                                      )}

                                                      {/* Similar Domain Warning */}
                                                      {result.threat?.similarLegitDomain && (
                                                            <div className="mt-4 flex gap-4 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                                                                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                                                                  <div>
                                                                        <h4 className="font-bold text-emerald-500 text-sm mb-1">Site Oficial Identificado</h4>
                                                                        <p className="text-emerald-400/80 text-sm">
                                                                              Você provavelmente está procurando por: <br />
                                                                              <a href={`https://${result.threat.similarLegitDomain}`} target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline hover:text-emerald-400 font-bold">
                                                                                    {result.threat.similarLegitDomain}
                                                                              </a>
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      )}

                                                      <p className="mt-6 text-xs text-[var(--text-tertiary)] opacity-60">
                                                            Fonte: {result.threat?.source} • Verificado em {new Date(result.checkedAt).toLocaleString('pt-BR')}
                                                      </p>
                                                </div>
                                          </div>
                                    )}
                              </div>
                        )}

                        {/* Education Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                              {/* Safe Signs */}
                              <div className="p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/30 backdrop-blur hover:border-emerald-500/20 transition-all">
                                    <h3 className="font-serif text-xl text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                <ShieldCheck className="w-5 h-5" />
                                          </div>
                                          Sinais de Segurança
                                    </h3>
                                    <ul className="space-y-4">
                                          {[
                                                { icon: Lock, text: 'Verifique se há HTTPS (cadeado)' },
                                                { icon: Globe, text: 'Confira a ortografia do domínio' },
                                                { icon: CheckCircle, text: 'Use bookmarks para sites frequentes' }
                                          ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)] text-sm group">
                                                      <item.icon className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                                                      {item.text}
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              {/* Danger Signs */}
                              <div className="p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]/30 backdrop-blur hover:border-rose-500/20 transition-all">
                                    <h3 className="font-serif text-xl text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                                                <AlertTriangle className="w-5 h-5" />
                                          </div>
                                          Bandeiras Vermelhas
                                    </h3>
                                    <ul className="space-y-4">
                                          {[
                                                { icon: AlertCircle, text: 'Promessas de lucro garantido' },
                                                { icon: AlertCircle, text: 'Senso de urgência artificial' },
                                                { icon: AlertCircle, text: 'Solicitação de Seed Phrase' }
                                          ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)] text-sm group">
                                                      <item.icon className="w-4 h-4 text-rose-500/50 group-hover:text-rose-500 transition-colors" />
                                                      {item.text}
                                                </li>
                                          ))}
                                    </ul>
                              </div>
                        </div>

                        {/* Community Report */}
                        <div className="text-center pt-8 border-t border-[var(--border-light)]">
                              <button
                                    onClick={() => alert('Em breve: Sistema de reputação descentralizado!')}
                                    className="group inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                              >
                                    <Flag className="w-4 h-4 group-hover:text-rose-500 transition-colors" />
                                    Reportar um link malicioso
                              </button>
                        </div>

                  </div>
            </PageWrapper>
      );
}
