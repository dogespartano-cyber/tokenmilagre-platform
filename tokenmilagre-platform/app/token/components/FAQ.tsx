/**
 * FAQ Section - Accordion with common questions
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={24} className="text-purple-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-white/10 pt-6">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'O $MILAGRE é seguro?',
      answer: (
        <>
          <strong className="text-white">Sim!</strong> É um token SPL padrão na Solana, auditado automaticamente pela
          blockchain. Você pode verificar todas as transações no{' '}
          <a
            href="https://solscan.io/token/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Solscan
          </a>
          . Não há backdoors ou funções maliciosas. O código é transparente e verificável.
        </>
      ),
    },
    {
      question: 'Qual o risco de investir?',
      answer: (
        <>
          <strong className="text-red-400">Alto risco!</strong> Estamos em early stage (~6.7% para graduação). Tokens
          em pump.fun são altamente voláteis e especulativos. <strong className="text-white">Invista apenas o que pode
          perder.</strong> Nosso foco é educação, não promessas de lucro. O preço pode cair a qualquer momento.
        </>
      ),
    },
    {
      question: 'O que acontece após a graduação?',
      answer: (
        <>
          <p className="mb-3">
            Quando atingirmos <strong className="text-white">$69k de market cap</strong>, o Pump.fun automaticamente:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Adiciona liquidez na Raydium (maior DEX da Solana)</li>
            <li>Queima os LP tokens (liquidez permanente e bloqueada)</li>
            <li>Permite trading 24/7 em exchanges descentralizadas</li>
            <li>Aumenta visibilidade e acessibilidade do token</li>
          </ol>
          <p className="mt-3 text-sm text-gray-400">
            Isso é 100% automático e garantido pela smart contract do Pump.fun.
          </p>
        </>
      ),
    },
    {
      question: 'Como o token financia a plataforma?',
      answer: (
        <>
          <p className="mb-3">
            <strong className="text-white">50% dos lucros</strong> da plataforma Token Milagre (anúncios, parcerias,
            serviços premium) são usados para <strong className="text-green-400">buy-backs do $MILAGRE</strong>,
            criando pressão de compra sustentável.
          </p>
          <p>
            Além disso, parte da treasury inicial (10%) está alocada em $MILAGRE. Quando o token cresce, todos
            crescemos juntos. É um ciclo virtuoso de educação → valor → mais educação.
          </p>
        </>
      ),
    },
    {
      question: 'Posso perder meu dinheiro?',
      answer: (
        <>
          <p className="mb-3">
            <strong className="text-red-400">Sim, absolutamente!</strong> Crypto é extremamente volátil. O preço pode
            cair 50% ou mais em um único dia. Você pode perder 100% do investimento.
          </p>
          <p className="mb-3 text-white font-semibold">
            Nunca invista o que não pode perder. Sempre faça sua própria pesquisa (DYOR).
          </p>
          <p className="text-sm text-gray-400">
            Nosso foco é educação e transparência. O token é secundário. Se você está aqui apenas pelo lucro rápido,
            este projeto não é para você.
          </p>
        </>
      ),
    },
    {
      question: 'Como vocês diferem de outros meme coins?',
      answer: (
        <>
          <div className="space-y-3">
            <div>
              <strong className="text-purple-400">1. Utilidade Real:</strong>
              <p className="ml-4 mt-1">Financia educação gratuita. Não é apenas especulação.</p>
            </div>
            <div>
              <strong className="text-purple-400">2. Transparência:</strong>
              <p className="ml-4 mt-1">
                Tudo open source no GitHub. Dados on-chain verificáveis. Zero segredos.
              </p>
            </div>
            <div>
              <strong className="text-purple-400">3. Comunidade:</strong>
              <p className="ml-4 mt-1">
                2.3k+ membros ativos ajudando uns aos outros. Não é pump & dump.
              </p>
            </div>
            <div>
              <strong className="text-purple-400">4. Longevidade:</strong>
              <p className="ml-4 mt-1">Projeto de 2+ anos. Equipe comprometida com longo prazo.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      question: 'Quem criou o $MILAGRE?',
      answer: (
        <>
          <p className="mb-3">
            O $MILAGRE foi criado pela equipe do{' '}
            <strong className="text-white">Token Milagre</strong>, uma plataforma educacional brasileira sobre
            criptomoedas lançada em 2023.
          </p>
          <p className="mb-3">
            Somos desenvolvedores, educadores e entusiastas de crypto que acreditam na democratização do conhecimento.
            Nosso objetivo é tornar educação financeira acessível a todos os brasileiros.
          </p>
          <p className="text-sm text-gray-400">
            Projeto 100% open source:{' '}
            <a
              href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              GitHub
            </a>
          </p>
        </>
      ),
    },
    {
      question: 'Como posso ajudar o projeto?',
      answer: (
        <>
          <p className="mb-3">Existem várias formas de contribuir:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="text-white">Compre tokens</strong> e ajude a crescer o market cap
            </li>
            <li>
              <strong className="text-white">Compartilhe</strong> a plataforma com amigos
            </li>
            <li>
              <strong className="text-white">Participe</strong> da comunidade (Discord/Telegram)
            </li>
            <li>
              <strong className="text-white">Contribua</strong> com código no GitHub
            </li>
            <li>
              <strong className="text-white">Crie conteúdo</strong> educacional
            </li>
            <li>
              <strong className="text-white">Dê feedback</strong> e sugestões
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-400">
            Todo tipo de contribuição é valorizado. Somos uma comunidade!
          </p>
        </>
      ),
    },
  ];

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/30 mb-6">
            <HelpCircle size={18} className="text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">FAQ</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Perguntas Frequentes 💭</h2>
          <p className="text-xl text-gray-400">
            Todas as respostas que você precisa. Sem marketing enganoso.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-3xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ainda tem dúvidas?</h3>
          <p className="text-gray-300 mb-6">
            Entre em contato com nossa comunidade no Discord ou Telegram. Estamos aqui para ajudar!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/xk4zrz8j"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-xl transition-all"
            >
              Discord
            </a>
            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#0088cc] hover:bg-[#006699] text-white font-semibold rounded-xl transition-all"
            >
              Telegram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
