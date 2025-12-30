'use client';

import { CalloutBlock, QuizBlock, type QuizQuestion } from '@/lib/domains/articles/editor/blocks';

// Quiz de exemplo para demonstração
const sampleQuiz: QuizQuestion[] = [
    {
        id: 1,
        text: "O que é uma blockchain?",
        options: [
            "Um banco de dados centralizado",
            "Um registro distribuído e imutável de transações",
            "Uma criptomoeda",
            "Um tipo de carteira digital"
        ],
        correctAnswer: 1,
        explanation: "Blockchain é um registro distribuído (ledger) onde as transações são registradas de forma imutável e verificável por toda a rede, sem necessidade de uma autoridade central."
    },
    {
        id: 2,
        text: "Qual a função principal de uma carteira cripto (wallet)?",
        options: [
            "Minerar criptomoedas",
            "Armazenar as chaves privadas para acessar seus ativos",
            "Trocar moedas automaticamente",
            "Pagar taxas de rede"
        ],
        correctAnswer: 1,
        explanation: "A carteira armazena suas chaves privadas, que são o que realmente dá acesso aos seus ativos na blockchain. Sem as chaves, você não tem controle sobre suas criptomoedas."
    },
    {
        id: 3,
        text: "O que significa DeFi?",
        options: [
            "Definição Financeira",
            "Deficiência Fiscal",
            "Finanças Descentralizadas",
            "Depósito Fiduciário"
        ],
        correctAnswer: 2,
        explanation: "DeFi (Decentralized Finance) refere-se a serviços financeiros construídos em blockchain que operam sem intermediários tradicionais como bancos."
    }
];

export default function BlocksDemoPage() {
    return (
        <div className="min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-4xl mx-auto">
                <h1
                    className="text-3xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    🧱 Demo: Blocos Customizados
                </h1>
                <p
                    className="mb-8"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Demonstração dos componentes modulares para artigos educacionais.
                </p>

                {/* Callout Blocks */}
                <section className="mb-12">
                    <h2
                        className="text-2xl font-bold mb-4"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        📢 Callout Blocks
                    </h2>

                    <CalloutBlock type="tip" title="Dica Pro">
                        <p>Use carteiras hardware (cold wallets) para armazenar grandes quantidades de criptomoedas. Elas mantêm suas chaves privadas offline, protegendo contra ataques hackers.</p>
                    </CalloutBlock>

                    <CalloutBlock type="warning" title="Atenção">
                        <p>Nunca compartilhe sua seed phrase (frase de recuperação) com ninguém! Empresas legítimas NUNCA pedirão essa informação.</p>
                    </CalloutBlock>

                    <CalloutBlock type="note" title="Nota">
                        <p>As taxas de transação (gas fees) variam conforme a demanda da rede. Em horários de pico, podem ser significativamente mais altas.</p>
                    </CalloutBlock>

                    <CalloutBlock type="security" title="Segurança">
                        <p>Ative a autenticação de dois fatores (2FA) em todas as suas exchanges e carteiras. Preferencialmente usando um aplicativo autenticador, não SMS.</p>
                    </CalloutBlock>

                    <CalloutBlock type="danger" title="Perigo">
                        <p>Cuidado com esquemas de "pump and dump"! Se alguém promete retornos garantidos ou lucros rápidos, provavelmente é um golpe.</p>
                    </CalloutBlock>

                    <CalloutBlock type="tip" title="Seção Colapsável" collapsible defaultOpen={false}>
                        <p>Este é um callout que pode ser expandido ou recolhido pelo usuário. Útil para informações opcionais ou detalhes técnicos.</p>
                    </CalloutBlock>
                </section>

                {/* Quiz Block */}
                <section>
                    <h2
                        className="text-2xl font-bold mb-4"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        ❓ Quiz Block
                    </h2>

                    <QuizBlock
                        questions={sampleQuiz}
                        title="Teste Seus Conhecimentos de Cripto!"
                    />
                </section>
            </div>
        </div>
    );
}
