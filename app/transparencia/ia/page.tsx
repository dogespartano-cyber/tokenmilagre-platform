import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faFingerprint, faShieldHalved, faBookOpen } from '@fortawesome/free-solid-svg-icons';

export default function AITransparencyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
            <div className="container mx-auto px-4 py-24 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-4 block">Relatório de Transparência</span>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-6">
                        Como nossa IA pensa.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Não acreditamos em "Caixas Pretas". Aqui está o modelo operacional, ético e de segurança que rege cada decisão algorítmica do TokenMilagre.
                    </p>
                </div>

                {/* The 3 Pillars */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
                        <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">A Constituição (DNA)</h3>
                        <p className="text-gray-400 text-sm">
                            Todo agente obedece a um arquivo "DNA" imutável que prioriza verdade, transparência e proteção do usuário acima de qualquer métrica de lucro.
                        </p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-3xl text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Protocolo Sentinel</h3>
                        <p className="text-gray-400 text-sm">
                            Um sistema criptográfico verifica a identidade de cada agente antes de permitir ações, impedindo "alucinações" ou impersonação não autorizada.
                        </p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-colors">
                        <FontAwesomeIcon icon={faFingerprint} className="text-3xl text-green-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Auditoria Imutável</h3>
                        <p className="text-gray-400 text-sm">
                            Cada decisão crítica é gravada em uma "Blockchain Privada" de logs (Hash Chain), garantindo que o histórico de ações nunca possa ser adulterado.
                        </p>
                    </div>
                </div>

                {/* Deep Dive Section */}
                <div className="space-y-12 mb-24">
                    <section>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
                            Tomada de Decisão Ética
                        </h2>
                        <div className="prose prose-invert prose-lg text-gray-300">
                            <p>
                                Diferente de IAs generativas comuns que buscam apenas "satisfazer o usuário", nossos agentes operam sob o <strong>Princípio de Madre Teresa</strong>: não lutamos contra o mal, construímos soluções que o tornam irrelevante.
                            </p>
                            <p>
                                Quando o Oráculo analisa um token, ele não olha apenas para liquidez. Ele consulta o DNA do projeto para perguntar: <em>"Esta informação protege o usuário ou o expõe ao risco?"</em>. Se a confiança (Trust Score) for baixa, o sistema bloqueia a recomendação, mesmo que os números financeiros pareçam bons.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                            Governança 2026 Ready
                        </h2>
                        <div className="prose prose-invert prose-lg text-gray-300">
                            <p>
                                Estamos antecipando as regulações globais de IA previstas para 2026. Nossa arquitetura já implementa:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
                                <li><strong>Explicabilidade (XAI):</strong> Cada output técnico vem acompanhado de uma justificativa em linguagem natural.</li>
                                <li><strong>Human-in-the-Loop:</strong> Decisões de alto impacto (Categoria 9-10) requerem aprovação explícita do "Conselho Humano" (Admin).</li>
                                <li><strong>Segurança por Design:</strong> O sistema de arquivos é blindado contra auto-modificação não autorizada pelo Sentinel.</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-12 text-center text-gray-500 text-sm">
                    <p>Esta página é gerada automaticamente pelo Agente de Transparência do TokenMilagre.</p>
                    <p className="mt-2 text-xs font-mono opacity-50">Last Audit: {new Date().toISOString().split('T')[0]}</p>
                </div>

            </div>
        </div>
    );
}
