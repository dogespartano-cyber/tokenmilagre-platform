/**
 * Final CTA Section - Final call-to-action with sticky mobile bar
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, BookOpen, TrendingUp, X } from 'lucide-react';
import { useTokenStats } from '../hooks/useTokenData';
import { formatTokenPrice, formatPercentage } from '../utils/formatters';
import { animations } from '../utils/design-tokens';

export default function FinalCTA() {
  const [showMobileBar, setShowMobileBar] = useState(false);
  const { data: stats } = useTokenStats();

  useEffect(() => {
    const handleScroll = () => {
      // Show mobile bar after scrolling 50% of the page
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setShowMobileBar(scrollPercentage > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="relative bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border-2 border-purple-500/50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                className="inline-block mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <span className="text-7xl">❤️</span>
              </motion.div>

              <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
                Pronto para Fazer Parte?
              </h2>

              <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                Junte-se a <strong className="text-purple-400">247 holders</strong> que já acreditam em educação
                financeira acessível para todos os brasileiros.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <motion.a
                  href="https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(16, 185, 129, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <Rocket size={24} />
                    <span>Comprar $MILAGRE Agora</span>
                  </div>
                </motion.a>

                <motion.a
                  href="/educacao"
                  className="px-10 py-5 rounded-2xl font-bold text-xl text-white border-2 border-white/30 bg-white/10 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={24} />
                    <span>Aprender Mais Primeiro</span>
                  </div>
                </motion.a>
              </div>

              {/* Risk Disclaimer */}
              <motion.div
                className="inline-flex items-start gap-3 px-6 py-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-sm text-gray-300 text-left">
                  Investir em criptomoedas envolve <strong className="text-white">alto risco</strong>. Você pode perder
                  todo seu investimento. Sempre faça sua própria pesquisa (DYOR) e invista apenas o que pode perder.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Sticky Bar */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-xl border-t-2 border-white/20 px-4 py-3 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                {/* Price Ticker */}
                <div className="flex-1">
                  <p className="text-xs text-white/80 mb-0.5">$MILAGRE</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white">
                      {stats ? formatTokenPrice(stats.price) : '$0.0000046'}
                    </p>
                    {stats && (
                      <span
                        className={`text-xs font-semibold ${
                          stats.priceChange24h >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}
                      >
                        {formatPercentage(stats.priceChange24h)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Buy Button */}
                <a
                  href="https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <Rocket size={18} />
                  <span>Comprar</span>
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setShowMobileBar(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Fechar"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
