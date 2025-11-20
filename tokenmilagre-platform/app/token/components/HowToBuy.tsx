/**
 * How to Buy Section - Step-by-step guide
 */

'use client';

import { motion } from 'framer-motion';
import { Wallet, DollarSign, Send, ShoppingCart, PlayCircle } from 'lucide-react';
import { animations } from '../utils/design-tokens';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta?: {
    text: string;
    href: string;
  };
}

function Step({ number, icon, title, description, cta }: StepProps) {
  return (
    <motion.div
      className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      variants={animations.fadeInUp}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Step Number Badge */}
      <div
        className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
        }}
      >
        {number}
      </div>

      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-6 mt-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-white mb-3 text-center">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-center mb-6">{description}</p>

      {/* CTA */}
      {cta && (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-white text-center transition-all"
        >
          {cta.text}
        </a>
      )}
    </motion.div>
  );
}

export default function HowToBuy() {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30 mb-6">
            <ShoppingCart size={18} className="text-green-400" />
            <span className="text-sm font-semibold text-green-300">COMO COMPRAR</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Como Comprar $MILAGRE? 🛒</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Siga este guia passo a passo. Mesmo se você nunca comprou crypto antes, conseguirá em 10 minutos.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={animations.staggerContainer}
        >
          <Step
            number={1}
            icon={<Wallet size={40} className="text-white" />}
            title="Instale uma Wallet Solana"
            description="Recomendamos Phantom ou Solflare. São gratuitas, seguras e fáceis de usar."
            cta={{
              text: '📱 Baixar Phantom',
              href: 'https://phantom.app/',
            }}
          />

          <Step
            number={2}
            icon={<DollarSign size={40} className="text-white" />}
            title="Compre SOL"
            description="Use Binance, Mercado Bitcoin ou outro exchange. Você precisa de ~$10 em SOL para começar."
            cta={{
              text: '💳 Ver Exchanges',
              href: 'https://www.coingecko.com/en/coins/solana#markets',
            }}
          />

          <Step
            number={3}
            icon={<Send size={40} className="text-white" />}
            title="Envie SOL para sua Wallet"
            description="Copie seu endereço Solana da Phantom e envie SOL do exchange para sua wallet."
            cta={{
              text: '📺 Ver Tutorial',
              href: 'https://www.youtube.com/results?search_query=como+usar+phantom+wallet',
            }}
          />

          <Step
            number={4}
            icon={<ShoppingCart size={40} className="text-white" />}
            title="Compre $MILAGRE"
            description="Acesse Pump.fun, conecte sua wallet e troque SOL por $MILAGRE. Pronto!"
            cta={{
              text: '🚀 Ir para Pump.fun',
              href: 'https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
            }}
          />
        </motion.div>

        {/* Video Tutorial */}
        <motion.div
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-3xl p-8 mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <PlayCircle size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Tutorial Completo em Vídeo</h3>
              <p className="text-gray-400">Comprando $MILAGRE pela primeira vez (3:42)</p>
            </div>
          </div>

          <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <PlayCircle size={64} className="text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Vídeo tutorial em breve!</p>
              <p className="text-sm text-gray-500 mt-2">
                Enquanto isso, siga os passos acima ou pergunte no Discord
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            className="bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Dica: Comece Pequeno</h4>
            <p className="text-sm text-gray-400">
              Se é sua primeira vez, comece com $10-20. Teste o processo antes de investir mais.
            </p>
          </motion.div>

          <motion.div
            className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Atenção: Taxas de Rede</h4>
            <p className="text-sm text-gray-400">
              Deixe sempre ~0.01 SOL na wallet para pagar taxas de transação (gas). Solana é barato!
            </p>
          </motion.div>

          <motion.div
            className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Segurança: Guarde sua Seed</h4>
            <p className="text-sm text-gray-400">
              Anote sua frase de recuperação (seed) em papel. Nunca compartilhe com ninguém. É sua única proteção!
            </p>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            }}
          >
            <ShoppingCart size={24} />
            <span>Comprar Agora no Pump.fun</span>
          </a>

          <p className="text-gray-400 mt-6 text-sm">
            Precisa de ajuda? Pergunte no{' '}
            <a
              href="https://discord.gg/xk4zrz8j"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Discord
            </a>{' '}
            ou{' '}
            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Telegram
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
