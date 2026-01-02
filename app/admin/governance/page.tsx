'use client';

import { useEffect, useState } from 'react';
import { getAuditTrail, AuditEntry } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faLink, faRobot, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

export default function GovernanceDashboard() {
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

    useEffect(() => {
        getAuditTrail().then(setAuditLog);
    }, []);

    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center gap-4 border-b border-gray-700 pb-6">
                <div className="p-4 rounded-xl bg-purple-900/30 text-purple-400">
                    <FontAwesomeIcon icon={faGavel} className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Conselho de Governança de IA</h1>
                    <p className="text-gray-400">Trilha de auditoria imutável (Hash-Chained) das decisões dos Agentes.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {auditLog.map((entry) => (
                    <div key={entry._hash} className="group relative pl-8 border-l-2 border-gray-700 hover:border-purple-500 transition-colors">
                        {/* Chain Link Icon */}
                        <div className="absolute -left-3 top-0 bg-gray-900 p-1 rounded-full border border-gray-700 text-gray-500 group-hover:text-purple-400 transition-colors">
                            <FontAwesomeIcon icon={faLink} className="w-3 h-3" />
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${entry.agent === 'ARQUITETO' ? 'bg-amber-900/50 text-amber-200' :
                                            entry.agent === 'SEGURANCA' ? 'bg-red-900/50 text-red-200' :
                                                'bg-blue-900/50 text-blue-200'
                                        }`}>
                                        <FontAwesomeIcon icon={faRobot} className="mr-2" />
                                        {entry.agent}
                                    </span>
                                    <span className="text-gray-400 text-sm font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-widest">Trust Score</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.trustScore >= 9 ? 'bg-green-500 text-black' :
                                            entry.trustScore >= 6 ? 'bg-yellow-500 text-black' :
                                                'bg-red-500 text-white'
                                        }`}>
                                        {entry.trustScore}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{entry.intent}</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 bg-black/20 p-4 rounded-lg font-mono mb-4">
                                <div><span className="opacity-50">Tool:</span> {entry.tool}</div>
                                <div><span className="opacity-50">Result:</span> {entry.result}</div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 break-all font-mono bg-black/40 p-2 rounded">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <span className="text-purple-500">Hash:</span> {entry._hash}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
