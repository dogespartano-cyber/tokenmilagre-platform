/**
 * Tokenomics Section - Simple explanation of token economics
 */

'use client';

import { motion } from 'framer-motion';
import { Infinity, Lock, Users, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { animations } from '../utils/design-tokens';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

function Card({ icon, title, value, description }: CardProps) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
      variants={animations.fadeInUp}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-purple-400 mb-3">{value}</p>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface ComparisonRowProps {
  feature: string;
  milagre: string | boolean;
  typical: string | boolean;
}

function ComparisonRow({ feature, milagre, typical }: ComparisonRowProps) {
  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="text-green-400 mx-auto" size={24} />
      ) : (
        <XCircle className="text-red-400 mx-auto" size={24} />
      );
    }
    return <span className="font-semibold text-white">{value}</span>;
  };

  return (
    <motion.tr
      className="border-b border-white/10"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <td className="py-4 px-4 text-gray-300 font-medium">{feature}</td>
      <td className="py-4 px-4 text-center">{renderValue(milagre)}</td>
      <td className="py-4 px-4 text-center">{renderValue(typical)}</td>
    </motion.tr>
  );
}

export default function Tokenomics() {
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
            <DollarSign size={18} className="text-green-400" />
            <span className="text-sm font-semibold text-green-300">TOKENOMICS</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Tokenomics Simples 🪙</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sem truques, sem taxas escondidas. Apenas transparência e simplicidade.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={animations.staggerContainer}
        >
          <Card
            icon={<Infinity size={32} className="text-white" />}
            title="Supply"
            value="1 Bilhão"
            description="Supply fixo, sem inflação. Nunca serão criados mais tokens."
          />

          <Card
            icon={<Lock size={32} className="text-white" />}
            title="Liquidez"
            value="Bloqueada"
            description="Após graduação, Pump.fun queima LP tokens automaticamente."
          />

          <Card
            icon={<Users size={32} className="text-white" />}
            title="Distribuição"
            value="100% Comunidade"
            description="Zero pré-venda ou team allocation. Tudo para a comunidade."
          />

          <Card
            icon={<DollarSign size={32} className="text-white" />}
            title="Taxas"
            value="0% Tax"
            description="Sem buy/sell tax. Mercado livre e transparente."
          />
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Compare com Outros Tokens
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-500">
                  <th className="py-4 px-4 text-left text-gray-300 font-semibold">Característica</th>
                  <th className="py-4 px-4 text-center text-purple-400 font-bold">$MILAGRE</th>
                  <th className="py-4 px-4 text-center text-gray-400 font-semibold">Token Típico</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Taxa de Compra/Venda" milagre="0%" typical="5-10%" />
                <ComparisonRow feature="Liquidez Bloqueada" milagre={true} typical={false} />
                <ComparisonRow feature="Team Allocation" milagre="0%" typical="20%+" />
                <ComparisonRow feature="Pré-venda" milagre={false} typical={true} />
                <ComparisonRow feature="Mint Authority" milagre="Revogado" typical="Ativo" />
                <ComparisonRow feature="Código Open Source" milagre={true} typical={false} />
                <ComparisonRow feature="Auditoria Pública" milagre="On-Chain" typical="Privada" />
              </tbody>
            </table>
          </div>

          <motion.div
            className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Por Que Isso Importa?</h4>
                <p className="text-gray-300 leading-relaxed">
                  A maioria dos tokens cobra taxas ocultas, tem team allocations não divulgadas e pode criar mais
                  tokens a qualquer momento. O $MILAGRE é 100% transparente: o que você vê na blockchain é exatamente
                  o que existe. Sem surpresas, sem rug pulls.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
