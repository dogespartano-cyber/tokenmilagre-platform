/**
 * Bonding Curve Explainer - Interactive visualization
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Target, Zap, Rocket } from 'lucide-react';
import { useBondingCurve, getBondingCurveStages, getStageColor } from '../hooks/useBondingCurve';
import { formatMarketCap, formatTokenPrice, formatTokenAmount } from '../utils/formatters';
import { animations } from '../utils/design-tokens';

interface StageProps {
  number: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future';
}

function Stage({ number, title, description, status }: StageProps) {
  const color = getStageColor(status);
  const isActive = status === 'current';

  return (
    <motion.div
      className={`relative p-6 rounded-2xl border-2 transition-all ${
        isActive ? 'bg-purple-500/10 border-purple-500' : 'bg-white/5 border-white/10'
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: number * 0.1 }}
    >
      {/* Number Badge */}
      <div
        className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
        style={{ background: color }}
      >
        {number}
      </div>

      <div className="ml-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {isActive && (
          <motion.div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-semibold text-purple-300">ESTÁGIO ATUAL</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function BondingCurveExplainer() {
  const [currentMarketCap] = useState(4600);
  const [currentPrice] = useState(0.0000046);

  const { points, userSimulation, setUserSOLAmount, graduationTarget, progressPercentage } = useBondingCurve(
    currentMarketCap,
    currentPrice
  );

  const [solInput, setSolInput] = useState('0.1');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSolInput(value.toFixed(2));
    setUserSOLAmount(value);
  };

  const stages = getBondingCurveStages(currentMarketCap);

  // Prepare chart data
  const chartData = points.map((p) => ({
    marketCap: p.marketCap / 1000, // Convert to K for readability
    price: p.price * 1000000, // Scale up for visibility
  }));

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30 mb-6">
            <TrendingUp size={18} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">BONDING CURVE</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Como Funciona o Pump.fun? 📈</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Entenda a mecânica transparente por trás do preço do token e simule seu investimento.
          </p>
        </motion.div>

        {/* Interactive Simulator */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="text-yellow-400" />
            Simulador Interativo
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Quanto SOL você quer investir?
              </label>

              <input
                type="range"
                min="0.01"
                max="10"
                step="0.01"
                value={solInput}
                onChange={handleSliderChange}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #9945FF 0%, #9945FF ${
                    (parseFloat(solInput) / 10) * 100
                  }%, #374151 ${(parseFloat(solInput) / 10) * 100}%, #374151 100%)`,
                }}
              />

              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>0.01 SOL</span>
                <span className="text-xl font-bold text-white">{solInput} SOL</span>
                <span>10 SOL</span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Valor em USD (SOL @ $150)</span>
                  <span className="font-semibold text-white">${(parseFloat(solInput) * 150).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Rocket className="text-green-400" size={20} />
                Você Receberá
              </h4>

              {userSimulation && (
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {formatTokenAmount(userSimulation.tokensReceived, '$MILAGRE')}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Tokens estimados</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400">Impacto no Preço</p>
                      <p className="text-lg font-bold text-yellow-400">
                        +{userSimulation.priceImpact.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Novo Market Cap</p>
                      <p className="text-lg font-bold text-green-400">
                        {formatMarketCap(userSimulation.newMarketCap)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-bold text-white mb-4">Visualização da Curva de Ligação</h4>
            <div className="bg-gray-900/50 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="marketCap"
                    stroke="#9CA3AF"
                    label={{ value: 'Market Cap ($K)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    label={{ value: 'Preço (×10⁶)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <ReferenceLine
                    x={graduationTarget / 1000}
                    stroke="#10B981"
                    strokeDasharray="5 5"
                    label={{ value: 'Graduação', fill: '#10B981' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#9945FF" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Stages */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Estágios do Token</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage) => (
              <Stage
                key={stage.id}
                number={stage.id}
                title={stage.title}
                description={stage.description}
                status={stage.status}
              />
            ))}
          </div>
        </div>

        {/* Info Callout */}
        <motion.div
          className="bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="text-blue-400" size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">💡 Transparência Total</h4>
              <p className="text-gray-300 leading-relaxed">
                Cada compra aumenta o preço automaticamente pela curva matemática. Sem manipulação possível. Quando
                atingirmos $69k, o Pump.fun automaticamente adiciona liquidez na Raydium e queima os LP tokens,
                garantindo liquidez permanente.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
