'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowRight, faCoins, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';

export default function MarketFlow() {
  return (
    <div className="space-y-12">
      {/* Header Text */}
      <div className="pt-6 border-t border-gray-200 dark:border-white/10">
<h3 className="title-newtab text-xl mb-2">
          Caminho do Dinheiro
        </h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Investidores direcionam lucros das grandes ações (S&P 500) para projetos de maior risco e retorno, como Bitcoin. Com os lucros do BTC, diversificam para Ethereum e, finalmente, para altcoins de alto risco/retorno.
        </p>
      </div>

      {/* Desktop: Horizontal Flow with SVG Connectors */}
      <div className="hidden md:flex items-start justify-between relative px-4">
        {/* Step 1: S&P 500 */}
        <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-6 relative bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all duration-300">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
<h3 className="title-newtab text-xl mb-1">S&P 500</h3>
          <span className="text-xs font-bold uppercase tracking-wider mb-2">Baixo Risco</span>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[150px]">Capital global institucional</p>
        </div>

        {/* Arrow */}
        <div className="pt-8 text-gray-300 dark:text-gray-700">
          <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </div>

        {/* Step 2: Bitcoin */}
        <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-6 relative bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] transition-all duration-300">
            <FontAwesomeIcon icon={faBitcoin} />
          </div>
<h3 className="title-newtab text-xl mb-1">Bitcoin</h3>
          <span className="text-xs font-bold uppercase tracking-wider mb-2">Risco Médio</span>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[150px]">Porta de entrada cripto</p>
        </div>

        {/* Arrow */}
        <div className="pt-8 text-gray-300 dark:text-gray-700">
          <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </div>

        {/* Step 3: Ethereum */}
        <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-6 relative bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-all duration-300">
            <FontAwesomeIcon icon={faEthereum} />
          </div>
<h3 className="title-newtab text-xl mb-1">Ethereum</h3>
          <span className="text-xs font-bold uppercase tracking-wider mb-2">Risco Elevado</span>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[150px]">Inovação e DeFi</p>
        </div>

        {/* Arrow */}
        <div className="pt-8 text-gray-300 dark:text-gray-700">
          <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </div>

        {/* Step 4: Altcoins */}
        <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-6 relative bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(239,68,68,0.4)] transition-all duration-300">
            <FontAwesomeIcon icon={faCoins} />
          </div>
<h3 className="title-newtab text-xl mb-1">Altcoins</h3>
          <span className="text-xs font-bold uppercase tracking-wider mb-2">Alto Risco</span>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[150px]">Alto potencial de retorno</p>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden relative px-4">
        {/* Connecting Line */}
        <div className="absolute top-8 bottom-8 left-[2.25rem] w-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>

        <div className="space-y-8">
          {[
            { icon: faChartLine, title: 'S&P 500', risk: 'Baixo Risco', desc: 'Capital global', color: '', bg: 'bg-blue-500/10', shadow: 'shadow-blue-500/20' },
            { icon: faBitcoin, title: 'Bitcoin', risk: 'Risco Médio', desc: 'Porta de entrada', color: '', bg: 'bg-amber-500/10', shadow: 'shadow-amber-500/20' },
            { icon: faEthereum, title: 'Ethereum', risk: 'Risco Elevado', desc: 'Inovação', color: '', bg: 'bg-indigo-500/10', shadow: 'shadow-indigo-500/20' },
            { icon: faCoins, title: 'Altcoins', risk: 'Alto Risco', desc: 'Alto retorno', color: '', bg: 'bg-red-500/10', shadow: 'shadow-red-500/20' }
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shrink-0 ${step.bg} ${step.color} shadow-lg ${step.shadow}`}>
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <div>
<h3 className="title-newtab text-lg">{step.title}</h3>
                <span className={`text-xs font-bold ${step.color} uppercase block mb-1`}>{step.risk}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
