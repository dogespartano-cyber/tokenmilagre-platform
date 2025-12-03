'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowRight, faCoins, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';

export default function MarketFlow() {
    return (
        <div className="space-y-8">
            {/* Desktop: Horizontal Flow with SVG Connectors */}
            <div className="hidden md:flex items-center justify-between relative">
                {/* Connecting Line Background */}


                {/* Step 1: S&P 500 */}
                <div className="relative z-10 flex-1 max-w-[240px] group">
                    <div className="glass-card p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative bg-blue-500/10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faChartLine} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">S&P 500</h3>
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Baixo Risco</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Capital global institucional</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="relative z-10 bg-white dark:bg-[#0F1419] p-2 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400">
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>

                {/* Step 2: Bitcoin */}
                <div className="relative z-10 flex-1 max-w-[240px] group">
                    <div className="glass-card p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)] text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faBitcoin} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Bitcoin</h3>
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Risco Médio</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Porta de entrada cripto</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="relative z-10 bg-white dark:bg-[#0F1419] p-2 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400">
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>

                {/* Step 3: Ethereum */}
                <div className="relative z-10 flex-1 max-w-[240px] group">
                    <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative bg-indigo-500/10 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faEthereum} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Ethereum</h3>
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Risco Elevado</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Inovação e DeFi</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="relative z-10 bg-white dark:bg-[#0F1419] p-2 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400">
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>

                {/* Step 4: Altcoins */}
                <div className="relative z-10 flex-1 max-w-[240px] group">
                    <div className="glass-card p-6 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(239,68,68,0.3)] text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl relative bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] group-hover:scale-110 transition-transform duration-300">
                            <FontAwesomeIcon icon={faCoins} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Altcoins</h3>
                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Alto Risco</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Alto potencial de retorno</p>
                    </div>
                </div>
            </div>

            {/* Mobile: Vertical Flow */}
            <div className="md:hidden space-y-4">
                {[
                    { icon: faChartLine, title: 'S&P 500', risk: 'Baixo Risco', desc: 'Capital global', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { icon: faBitcoin, title: 'Bitcoin', risk: 'Risco Médio', desc: 'Porta de entrada', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                    { icon: faEthereum, title: 'Ethereum', risk: 'Risco Elevado', desc: 'Inovação', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                    { icon: faCoins, title: 'Altcoins', risk: 'Alto Risco', desc: 'Alto retorno', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
                ].map((step, idx) => (
                    <div key={idx} className="relative">
                        {idx > 0 && (
                            <div className="absolute -top-4 left-8 w-0.5 h-4 bg-gray-200 dark:bg-gray-800"></div>
                        )}
                        <div className={`glass-card p-4 rounded-xl border ${step.border} flex items-center gap-4`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${step.bg} ${step.color}`}>
                                <FontAwesomeIcon icon={step.icon} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{step.title}</h3>
                                <span className={`text-xs font-bold ${step.color} uppercase`}>{step.risk}</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
