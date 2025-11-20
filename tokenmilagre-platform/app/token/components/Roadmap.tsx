/**
 * Roadmap Timeline - Project phases and milestones
 */

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Rocket, TrendingUp, Globe, Smartphone } from 'lucide-react';
import { animations } from '../utils/design-tokens';

interface PhaseProps {
  status: 'completed' | 'current' | 'future';
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function Phase({ status, icon, title, items }: PhaseProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          iconBg: 'from-green-500 to-green-600',
          textColor: 'text-green-400',
        };
      case 'current':
        return {
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/50',
          iconBg: 'from-purple-500 to-purple-600',
          textColor: 'text-purple-400',
        };
      case 'future':
        return {
          bgColor: 'bg-white/5',
          borderColor: 'border-white/10',
          iconBg: 'from-gray-600 to-gray-700',
          textColor: 'text-gray-400',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <motion.div
      className={`relative ${styles.bgColor} backdrop-blur-sm rounded-2xl p-8 border-2 ${styles.borderColor}`}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status Badge */}
      <div
        className={`absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${styles.iconBg} flex items-center justify-center shadow-xl`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="ml-8">
        <h3 className={`text-2xl font-bold ${styles.textColor} mb-4`}>{title}</h3>

        <ul className="space-y-3">
          {items.map((item, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <Circle className={`${styles.textColor} flex-shrink-0 mt-0.5`} size={20} />
              )}
              <span className="text-gray-300 leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>

        {status === 'current' && (
          <motion.div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-sm font-semibold text-purple-300">EM ANDAMENTO</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Roadmap() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/30 mb-6">
            <Rocket size={18} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">ROADMAP</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">O Que o $MILAGRE Financia? 🎯</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Nosso compromisso é claro: transformar o $MILAGRE em uma força real para educação financeira no Brasil.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-8">
          <Phase
            status="completed"
            icon={<CheckCircle2 size={28} className="text-white" />}
            title="Fase 1: Fundação"
            items={[
              'Plataforma educacional lançada (tokenmilagre.xyz)',
              '50+ artigos sobre criptomoedas e blockchain',
              'Comunidade de 500+ membros no Discord e Telegram',
              'Token $MILAGRE criado no Pump.fun',
              'Open source no GitHub com 140+ stars',
            ]}
          />

          <Phase
            status="current"
            icon={<TrendingUp size={28} className="text-white" />}
            title="Fase 2: Crescimento (Agora)"
            items={[
              'Curso gratuito de trading para iniciantes (em produção)',
              'Bot educacional no Telegram com alertas de mercado',
              'Sistema de recompensas por aprendizado',
              'Graduação do token no Pump.fun ($69k market cap)',
              'Parcerias com exchanges brasileiras',
            ]}
          />

          <Phase
            status="future"
            icon={<Smartphone size={28} className="text-white" />}
            title="Fase 3: Expansão"
            items={[
              'App mobile (iOS + Android) para educação crypto',
              'Dashboard avançado com análises on-chain',
              'Eventos presenciais de educação em 5 capitais',
              'Programa de afiliados para educadores',
              'Integração com principais wallets brasileiras',
            ]}
          />

          <Phase
            status="future"
            icon={<Globe size={28} className="text-white" />}
            title="Fase 4: Impacto Global"
            items={[
              'Expansão para América Latina (ES + EN)',
              'Fundação sem fins lucrativos para educação',
              'Bolsas de estudo para comunidades carentes',
              'Certificações profissionais em blockchain',
              'Ecossistema completo de ferramentas educacionais',
            ]}
          />
        </div>

        {/* Commitment */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/30 rounded-3xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">💚 Nosso Compromisso</h3>
              <p className="text-xl text-gray-300 leading-relaxed mb-4">
                <strong className="text-green-400">50% dos lucros</strong> da plataforma Token Milagre (anúncios,
                parcerias, serviços premium) são reinvestidos em <strong className="text-green-400">buy-backs do
                $MILAGRE</strong>, criando pressão de compra sustentável e valorizando o token.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Além disso, parte da treasury inicial (10%) está alocada em $MILAGRE, alinhando nossos incentivos com
                os da comunidade. Quando o token cresce, todos crescem juntos.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
