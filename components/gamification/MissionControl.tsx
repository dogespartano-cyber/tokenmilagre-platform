
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faGem, faFire, faClock } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type Mission = {
    id: string;
    title: string;
    description: string;
    reward: number;
    completed: boolean;
    type: 'daily' | 'weekly';
    progress: number;
    total: number;
    claimed?: boolean;
};

const MOCK_MISSIONS: Mission[] = [
    {
        id: '1',
        title: 'Leitor Voraz',
        description: 'Leia 3 artigos educacionais hoje.',
        reward: 50,
        completed: false,
        type: 'daily',
        progress: 1,
        total: 3
    },
    {
        id: '2',
        title: 'Guardião da Transparência',
        description: 'Verifique a página de Transparência.',
        reward: 20,
        completed: true,
        type: 'daily',
        progress: 1,
        total: 1
    },
    {
        id: '3',
        title: 'Explorador Cripto',
        description: 'Acesse a análise de 5 criptomoedas diferentes.',
        reward: 100,
        completed: false,
        type: 'weekly',
        progress: 2,
        total: 5,
        claimed: false
    }
];

export default function MissionControl() {
    const [missions, setMissions] = useState(MOCK_MISSIONS);

    // Mock user state
    const [userPoints, setUserPoints] = useState(1250);
    const [showConfetti, setShowConfetti] = useState(false);

    const claimReward = (id: string, reward: number) => {
        // 1. Update Mission UI
        setMissions(prev => prev.map(m =>
            m.id === id ? { ...m, claimed: true } : m
        ));

        // 2. Add Points Animation
        setUserPoints(prev => prev + reward);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // TODO: Call backend API to persist claim
        // await fetch('/api/gamification/claim', { method: 'POST', body: JSON.stringify({ missionId: id }) });
    };

    return (
        <div className="glass-card rounded-2xl p-6 border border-[var(--border-light)] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Confetti Animation */}
            {showConfetti && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full animate-confetti"
                            style={{
                                backgroundColor: ['#22c55e', '#eab308', '#f97316', '#3b82f6'][i % 4],
                                left: `${50 + (Math.random() * 40 - 20)}%`,
                                top: `${50 + (Math.random() * 40 - 20)}%`,
                                animationDuration: `${0.5 + Math.random()}s`,
                                animationDelay: `${Math.random() * 0.2}s`,
                                opacity: 0
                            }}
                        />
                    ))}
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-bounce drop-shadow-xl transform scale-150">
                        +{missions.find(m => m.claimed)?.reward || 50} MP!
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                        Missões Diárias
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">Complete tarefas para ganhar Pontos de Milagre (MP)</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Streak</div>
                    <div className="text-2xl font-black text-orange-500 flex items-center justify-end gap-1">
                        <FontAwesomeIcon icon={faFire} />
                        <span>5 Dias</span>
                    </div>
                </div>
            </div>

            {/* Mission List */}
            <div className="space-y-4 relative z-10">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className={`p-4 rounded-xl border transition-all duration-300 ${mission.completed
                            ? 'bg-[var(--bg-tertiary)]/50 border-[var(--border-light)]'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-medium)] hover:border-[var(--brand-primary)]'
                            }`}
                    >
                        <div className="flex justify-between items-start gap-4">
                            {/* Icon Status */}
                            <div className="mt-1">
                                <FontAwesomeIcon
                                    icon={mission.completed ? faCheckCircle : faCircle}
                                    className={`text-xl ${mission.completed ? 'text-green-500' : 'text-[var(--text-tertiary)]'}`}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-bold ${mission.completed ? 'text-[var(--text-secondary)] line-through decoration-emerald-500/50' : 'text-[var(--text-primary)]'}`}>
                                        {mission.title}
                                    </h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${mission.completed ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        <FontAwesomeIcon icon={faGem} />
                                        +{mission.reward} MP
                                    </span>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] mb-3">
                                    {mission.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-[var(--bg-page)] rounded-full overflow-hidden mb-2">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${mission.completed ? 'bg-green-500' : 'bg-[var(--brand-primary)]'}`}
                                        style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-[var(--text-tertiary)] font-mono">
                                    <span>Progresso</span>
                                    <span>{mission.progress} / {mission.total}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {mission.completed && !mission.claimed && (
                                <button
                                    onClick={() => claimReward(mission.id, mission.reward)}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-green-500/20 animate-pulse"
                                >
                                    Resgatar
                                </button>
                            )}
                            {mission.claimed && (
                                <span className="text-xs font-bold text-green-500 flex items-center gap-1 px-3 py-2">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    Resgatado
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Timer */}
            <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex justify-center text-xs text-[var(--text-tertiary)] gap-2">
                <FontAwesomeIcon icon={faClock} />
                Novas missões em: <span className="font-mono font-bold">14:32:05</span>
            </div>
        </div>
    );
}
