'use client';

import QuizComponent from '@/components/QuizComponent';
import Breadcrumbs from '@/components/Breadcrumbs';

const sampleQuestions = [
    {
        id: 1,
        text: "O que é a Solana?",
        options: [
            "Uma marca de protetor solar",
            "Uma blockchain de alta performance (Layer 1)",
            "Uma carteira digital apenas para Bitcoin",
            "Um novo tipo de banco digital"
        ],
        correctAnswer: 1,
        explanation: "Solana é uma blockchain de camada 1 (Layer 1) conhecida por sua alta velocidade e baixas taxas de transação."
    },
    {
        id: 2,
        text: "Qual é o mecanismo de consenso exclusivo da Solana?",
        options: [
            "Proof of Work (PoW)",
            "Proof of History (PoH)",
            "Proof of Authority (PoA)",
            "Proof of Space (PoS)"
        ],
        correctAnswer: 1,
        explanation: "Proof of History (PoH) é uma inovação da Solana que cria um registro histórico que prova que um evento ocorreu em um momento específico."
    },
    {
        id: 3,
        text: "O que é uma 'Wallet' (Carteira) no mundo cripto?",
        options: [
            "Um lugar físico para guardar moedas",
            "Um software que armazena suas chaves privadas e interage com a blockchain",
            "Uma conta bancária tradicional",
            "Um aplicativo de mensagens"
        ],
        correctAnswer: 1,
        explanation: "Uma carteira cripto (Wallet) armazena suas chaves privadas, permitindo que você assine transações e gerencie seus ativos na blockchain."
    }
];

export default function QuizDemoPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Breadcrumbs
                    items={[
                        { label: 'Educação', href: '/educacao' },
                        { label: 'Quiz Demo', href: '/educacao/quiz-demo' }
                    ]}
                />
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-poppins)]">
                        Teste seus Conhecimentos
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        Veja como o nosso novo componente de Quiz funciona na prática.
                    </p>
                </div>

                <QuizComponent
                    title="Quiz: Fundamentos da Solana"
                    questions={sampleQuestions}
                />
            </div>
        </div>
    );
}
