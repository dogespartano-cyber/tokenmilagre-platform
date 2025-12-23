import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faExclamationTriangle, faGavel, faHandshake } from '@fortawesome/free-solid-svg-icons';

export default function TermsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-poppins)]">Termos de Uso</h1>
                <p className="text-lg text-[var(--text-secondary)]">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
            </div>

            <div className="space-y-8 glass-card p-8 rounded-2xl">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-[var(--text-primary)]">
                        1. Aceitação dos Termos
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Ao acessar e usar a plataforma $MILAGRE ("nós", "nosso" ou "plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não deve acessar ou usar nossos serviços.
                    </p>
                </section>

                <section className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-yellow-500 mb-4">
                            2. Isenção de Responsabilidade Financeira
                        </h2>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                            O conteúdo fornecido na plataforma $MILAGRE é estritamente para fins <strong>educacionais e informativos</strong>. Nenhuma informação contida aqui deve ser interpretada como aconselhamento financeiro, legal ou de investimento.
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-[var(--text-secondary)]">
                            <li>Criptomoedas são ativos voláteis e de alto risco.</li>
                            <li>Você deve realizar sua própria pesquisa (DYOR) antes de tomar qualquer decisão financeira.</li>
                            <li>Não nos responsabilizamos por quaisquer perdas ou danos resultantes do uso das informações contidas neste site.</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-[var(--text-primary)]">
                        3. Uso da Plataforma
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Você concorda em usar a plataforma apenas para fins legais e de uma maneira que não infrinja os direitos de, restrinja ou iniba o uso e aproveitamento da plataforma por qualquer terceiro. Comportamentos proibidos incluem assediar ou causar angústia ou inconveniência a qualquer outro usuário, transmitir conteúdo obsceno ou ofensivo ou interromper o fluxo normal de diálogo dentro da plataforma.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">4. Propriedade Intelectual</h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Todo o conteúdo, marcas registradas, logotipos e propriedade intelectual exibidos na plataforma são de propriedade do projeto $MILAGRE ou de seus respectivos licenciadores. Você não pode reproduzir, distribuir ou criar trabalhos derivados sem nossa permissão expressa.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">5. Links para Terceiros</h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Nossa plataforma pode conter links para sites ou serviços de terceiros que não são de nossa propriedade ou controlados por nós. Não temos controle sobre, e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">6. Alterações nos Termos</h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. É sua responsabilidade verificar estes Termos periodicamente para verificar alterações. O uso continuado da plataforma após a publicação de quaisquer alterações constitui aceitação dessas alterações.
                    </p>
                </section>

                <div className="pt-8 border-t border-[var(--border-light)]">
                    <p className="text-sm text-[var(--text-tertiary)] text-center">
                        Para dúvidas sobre estes termos, entre em contato através dos nossos canais oficiais na comunidade.
                    </p>
                </div>
            </div>
        </div>
    );
}
