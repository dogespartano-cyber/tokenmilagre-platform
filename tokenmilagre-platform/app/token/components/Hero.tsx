/**
 * Hero Section - Above the fold content with token stats
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TrendingUp, Users, Target, ShieldCheck, Eye, Heart } from 'lucide-react';
import { useTokenStats } from '../hooks/useTokenData';
import { formatMarketCap, formatNumber, formatPercentage, formatProgress } from '../utils/formatters';
import { colors, animations } from '../utils/design-tokens';

interface StatProps {
  label: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function Stat({ label, value, trend, icon, isLoading }: StatProps) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      variants={animations.fadeInUp}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          {icon}
        </div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      </div>

      {isLoading ? (
        <div className="h-8 bg-white/10 rounded animate-pulse"></div>
      ) : (
        <>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {trend}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}

interface BadgeProps {
  icon: React.ReactNode;
  text: string;
}

function Badge({ icon, text }: BadgeProps) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-sm font-medium text-white">{text}</span>
    </motion.div>
  );
}

export default function Hero() {
  const { data: stats, isLoading, error } = useTokenStats();

  // Fallback data for loading/error states
  const displayStats = {
    marketCap: stats?.marketCap || 4600,
    price: stats?.price || 0.0000046,
    holders: stats?.holders || 247,
    priceChange24h: stats?.priceChange24h || 12.3,
    progressPercentage: stats?.progressPercentage || 6.7,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={animations.staggerContainer}
        >
          {/* Token Logo */}
          <motion.div className="flex justify-center mb-8" variants={animations.fadeInUp}>
            <motion.div
              className="w-32 h-32 rounded-3xl overflow-hidden border-4 shadow-2xl"
              style={{ borderColor: colors.solana.purple }}
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Image
                src="/images/TOKEN-MILAGRE-.webp"
                alt="$MILAGRE Token"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-white mb-4 leading-tight"
            variants={animations.fadeInUp}
          >
            $MILAGRE{' '}
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              ❤️
            </motion.span>
          </motion.h1>

          <motion.p className="text-2xl text-gray-300 mb-2" variants={animations.fadeInUp}>
            Nunca Estarás Sozinho
          </motion.p>

          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            variants={animations.fadeInUp}
          >
            Token comunitário na Solana que financia educação gratuita sobre criptomoedas para todos os
            brasileiros.
          </motion.p>

          {/* Trust Badges */}
          <motion.div className="flex flex-wrap justify-center gap-4 mb-16" variants={animations.fadeInUp}>
            <Badge icon={<ShieldCheck size={18} className="text-green-400" />} text="100% On-Chain" />
            <Badge icon={<Eye size={18} className="text-blue-400" />} text="Verificável" />
            <Badge icon={<Heart size={18} className="text-pink-400" />} text="Comunidade" />
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial="initial"
          animate="animate"
          variants={animations.staggerContainer}
        >
          <Stat
            label="Market Cap"
            value={formatMarketCap(displayStats.marketCap)}
            trend={formatPercentage(displayStats.priceChange24h)}
            icon={<TrendingUp size={20} className="text-white" />}
            isLoading={isLoading}
          />
          <Stat
            label="Holders"
            value={formatNumber(displayStats.holders)}
            trend="+23 hoje"
            icon={<Users size={20} className="text-white" />}
            isLoading={isLoading}
          />
          <Stat
            label="Progresso"
            value={formatProgress(displayStats.marketCap, 69000)}
            trend="Meta: $69k"
            icon={<Target size={20} className="text-white" />}
            isLoading={isLoading}
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial="initial"
          animate="animate"
          variants={animations.staggerContainer}
        >
          <motion.a
            href="https://pump.fun/coin/3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl font-bold text-lg text-white shadow-2xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            }}
            variants={animations.fadeInUp}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Comprar $MILAGRE Agora
          </motion.a>

          <motion.a
            href="#live-data"
            className="px-8 py-4 rounded-xl font-bold text-lg text-white border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
            variants={animations.fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 Ver Gráfico Ao Vivo
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center mt-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
            <motion.div
              className="w-1 h-2 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
