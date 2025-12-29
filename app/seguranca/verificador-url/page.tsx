'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
      faShieldHalved,
      faSearch,
      faCheckCircle,
      faExclamationTriangle,
      faTimesCircle,
      faLightbulb,
      faChartLine,
      faFlag,
      faLock,
      faGlobe,
      faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

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
            <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
                        {/* Header */}
                        <div className="text-center mb-12">
                              <div className="inline-block mb-4">
                                    <FontAwesomeIcon
                                          icon={faShieldHalved}
                                          className="w-16 h-16"
                                          style={{ color: 'var(--brand-primary)' }}
                                    />
                              </div>
                              <h1
                                    className="title-newtab text-4xl mb-4 font-inter"
                                    style={{ color: 'var(--text-primary)' }}
                              >
                                    Verificador de Links
                              </h1>
                              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                                    Proteja-se contra phishing e scams antes de clicar em links suspeitos
                              </p>
                        </div>

                        {/* Verification Form */}
                        <div
                              className="rounded-2xl p-8 mb-8 border shadow-lg"
                              style={{
                                    backgroundColor: 'var(--bg-elevated)',
                                    borderColor: 'var(--border-light)',
                              }}
                        >
                              <div className="flex gap-3">
                                    <div className="flex-1">
                                          <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="https://exemplo.com"
                                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                                                style={{
                                                      backgroundColor: 'var(--bg-secondary)',
                                                      borderColor: 'var(--border-medium)',
                                                      color: 'var(--text-primary)',
                                                }}
                                                disabled={loading}
                                          />
                                    </div>
                                    <button
                                          onClick={handleVerify}
                                          disabled={loading}
                                          className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                          style={{
                                                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                                                color: 'white',
                                          }}
                                    >
                                          {loading ? (
                                                'Verificando...'
                                          ) : (
                                                <>
                                                      <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                                      Verificar
                                                </>
                                          )}
                                    </button>
                              </div>

                              {/* Error Message */}
                              {error && (
                                    <div
                                          className="mt-4 p-4 rounded-lg border flex items-start gap-3"
                                          style={{
                                                backgroundColor: 'var(--error-bg)',
                                                borderColor: 'var(--error-border)',
                                          }}
                                    >
                                          <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 mt-0.5" style={{ color: 'var(--error)' }} />
                                          <p style={{ color: 'var(--error)' }}>{error}</p>
                                    </div>
                              )}

                              {/* Result */}
                              {result && (
                                    <div className="mt-6">
                                          {result.safe ? (
                                                // Safe Result
                                                <div
                                                      className="p-6 rounded-xl border"
                                                      style={{
                                                            backgroundColor: 'var(--success-bg)',
                                                            borderColor: 'var(--success-border)',
                                                      }}
                                                >
                                                      <div className="flex items-start gap-4">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-8 mt-1" style={{ color: 'var(--success)' }} />
                                                            <div className="flex-1">
                                                                  <h3 className="title-newtab text-xl mb-2" style={{ color: 'var(--success)' }}>
                                                                        Link Seguro ✅
                                                                  </h3>
                                                                  <p style={{ color: 'var(--success)' }}>
                                                                        Nenhuma ameaça detectada. Este link parece ser seguro para acessar.
                                                                  </p>
                                                                  {result.cached && (
                                                                        <p className="text-sm mt-2" style={{ color: 'var(--success-light)' }}>
                                                                              Resultado do cache • Verificado em {new Date(result.checkedAt).toLocaleString('pt-BR')}
                                                                        </p>
                                                                  )}
                                                            </div>
                                                      </div>
                                                </div>
                                          ) : (
                                                // Threat Detected
                                                <div
                                                      className="p-6 rounded-xl border"
                                                      style={{
                                                            backgroundColor: result.threat?.level === 'critical' ? 'var(--error-bg)' : 'var(--warning-bg)',
                                                            borderColor: result.threat?.level === 'critical' ? 'var(--error-border)' : 'var(--warning-border)',
                                                      }}
                                                >
                                                      <div className="flex items-start gap-4">
                                                            <FontAwesomeIcon
                                                                  icon={result.threat?.level === 'critical' ? faTimesCircle : faExclamationTriangle}
                                                                  className="w-8 h-8 mt-1"
                                                                  style={{ color: result.threat?.level === 'critical' ? 'var(--error)' : 'var(--warning)' }}
                                                            />
                                                            <div className="flex-1">
                                                                  <h3
                                                                        className="title-newtab text-xl mb-2"
                                                                        style={{ color: result.threat?.level === 'critical' ? 'var(--error)' : 'var(--warning)' }}
                                                                  >
                                                                        {result.threat?.level === 'critical' ? '🔴 SITE PERIGOSO DETECTADO' : '⚠️ SITE SUSPEITO'}
                                                                  </h3>

                                                                  <div className="space-y-3">
                                                                        {/* Reasons */}
                                                                        <div>
                                                                              <p
                                                                                    className="font-semibold mb-2"
                                                                                    style={{ color: result.threat?.level === 'critical' ? 'var(--error)' : 'var(--warning)' }}
                                                                              >
                                                                                    Ameaças detectadas:
                                                                              </p>
                                                                              <ul className="list-disc list-inside space-y-1">
                                                                                    {result.threat?.reasons.map((reason, idx) => (
                                                                                          <li
                                                                                                key={idx}
                                                                                                style={{ color: result.threat?.level === 'critical' ? 'var(--error)' : 'var(--warning)' }}
                                                                                          >
                                                                                                {reason}
                                                                                          </li>
                                                                                    ))}
                                                                              </ul>
                                                                        </div>

                                                                        {/* Educational Tip */}
                                                                        {result.threat?.educationalTip && (
                                                                              <div
                                                                                    className="p-4 rounded-lg border"
                                                                                    style={{
                                                                                          backgroundColor: 'var(--bg-elevated)',
                                                                                          borderColor: 'var(--border-light)',
                                                                                    }}
                                                                              >
                                                                                    <p className="flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
                                                                                          <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-yellow-500 mt-0.5" />
                                                                                          <span>
                                                                                                <strong>Dica de Segurança:</strong> {result.threat.educationalTip}
                                                                                          </span>
                                                                                    </p>
                                                                              </div>
                                                                        )}

                                                                        {/* Similar Legit Domain */}
                                                                        {result.threat?.similarLegitDomain && (
                                                                              <div
                                                                                    className="p-4 rounded-lg border"
                                                                                    style={{
                                                                                          backgroundColor: 'var(--success-bg)',
                                                                                          borderColor: 'var(--success-border)',
                                                                                    }}
                                                                              >
                                                                                    <p style={{ color: 'var(--success)' }}>
                                                                                          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                                                          <strong>Você quis dizer:</strong>{' '}
                                                                                          <a
                                                                                                href={`https://${result.threat.similarLegitDomain}`}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="underline hover:no-underline"
                                                                                          >
                                                                                                {result.threat.similarLegitDomain}
                                                                                          </a>
                                                                                    </p>
                                                                              </div>
                                                                        )}

                                                                        {/* Source */}
                                                                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                                                              Fonte: {result.threat?.source} • Verificado em{' '}
                                                                              {new Date(result.checkedAt).toLocaleString('pt-BR')}
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          )}
                                    </div>
                              )}
                        </div>

                        {/* Security Tips */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                              {/* Como Identificar Links Seguros */}
                              <div
                                    className="rounded-xl p-6 border"
                                    style={{
                                          backgroundColor: 'var(--bg-elevated)',
                                          borderColor: 'var(--border-light)',
                                    }}
                              >
                                    <h3
                                          className="title-newtab text-xl mb-4 flex items-center gap-2"
                                          style={{ color: 'var(--text-primary)' }}
                                    >
                                          <FontAwesomeIcon icon={faCheckCircle} className="" />
                                          Como Identificar Links Seguros
                                    </h3>
                                    <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faLock} className="w-4 h-4 mt-1" />
                                                <span>Verifique o domínio completo (letra por letra)</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 mt-1" />
                                                <span>Busque HTTPS (cadeado verde no navegador)</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mt-1" />
                                                <span>Desconfie de erros de ortografia</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mt-1" />
                                                <span>Use bookmarks para sites importantes</span>
                                          </li>
                                    </ul>
                              </div>

                              {/* Sinais de Alerta */}
                              <div
                                    className="rounded-xl p-6 border"
                                    style={{
                                          backgroundColor: 'var(--bg-elevated)',
                                          borderColor: 'var(--border-light)',
                                    }}
                              >
                                    <h3
                                          className="title-newtab text-xl mb-4 flex items-center gap-2"
                                          style={{ color: 'var(--text-primary)' }}
                                    >
                                          <FontAwesomeIcon icon={faExclamationTriangle} className="" />
                                          Sinais de Alerta
                                    </h3>
                                    <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4 mt-1" />
                                                <span>Promessas de lucro garantido</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4 mt-1" />
                                                <span>Urgência excessiva (&quot;só hoje!&quot;, &quot;última chance&quot;)</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4 mt-1" />
                                                <span>Pedidos de senha ou chave privada</span>
                                          </li>
                                          <li className="flex items-start gap-2">
                                                <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4 mt-1" />
                                                <span>Domínios com caracteres estranhos</span>
                                          </li>
                                    </ul>
                              </div>
                        </div>

                        {/* Stats Placeholder */}
                        <div
                              className="rounded-xl p-6 border text-center"
                              style={{
                                    backgroundColor: 'var(--bg-elevated)',
                                    borderColor: 'var(--border-light)',
                              }}
                        >
                              <h3
                                    className="title-newtab text-xl mb-4 flex items-center justify-center gap-2"
                                    style={{ color: 'var(--text-primary)' }}
                              >
                                    <FontAwesomeIcon icon={faChartLine} />
                                    Estatísticas de Segurança
                              </h3>
                              <div className="grid grid-cols-3 gap-6">
                                    <div>
                                          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                                                -
                                          </p>
                                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                URLs Verificadas
                                          </p>
                                    </div>
                                    <div>
                                          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                                                -
                                          </p>
                                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                Ameaças Bloqueadas
                                          </p>
                                    </div>
                                    <div>
                                          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-primary)' }}>
                                                -
                                          </p>
                                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                Usuários Protegidos
                                          </p>
                                    </div>
                              </div>
                              <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
                                    Estatísticas serão ativadas após implementação completa
                              </p>
                        </div>

                        {/* Report Section */}
                        <div className="mt-8 text-center">
                              <button
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                                    style={{
                                          backgroundColor: 'var(--bg-elevated)',
                                          borderColor: 'var(--border-medium)',
                                          color: 'var(--text-primary)',
                                    }}
                                    onClick={() => alert('Funcionalidade de report será implementada em breve!')}
                              >
                                    <FontAwesomeIcon icon={faFlag} />
                                    Reportar Link Suspeito
                              </button>
                              <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                    Ajude a comunidade reportando links maliciosos
                              </p>
                        </div>
                  </div>
            </div>
      );
}
