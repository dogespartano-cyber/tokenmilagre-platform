
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrophy, faBolt } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

// Mock data until real API is ready
const USER_MOCK = {
    currentPoints: 1250,
    nextLevelPoints: 2000,
    level: 5,
    rank: 'Embaixador'
};

export default function UserLevelWidget() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar on mount
        const p = (USER_MOCK.currentPoints / USER_MOCK.nextLevelPoints) * 100;
        setTimeout(() => setProgress(p), 100);
    }, []);

    return (
        <div className="hidden md:flex items-center gap-4 bg-[var(--bg-tertiary)] py-1.5 px-4 rounded-full border border-[var(--border-light)] hover:border-[var(--brand-primary)] transition-colors group cursor-pointer relative overflow-hidden">

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            {/* Level Badge */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-yellow-400/20">
                    <FontAwesomeIcon icon={faTrophy} className="w-3 h-3" />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">Nível {USER_MOCK.level}</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{USER_MOCK.rank}</span>
                </div>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-[var(--border-medium)] opacity-50" />

            {/* Points Progress */}
            <div className="flex flex-col w-24 gap-1">
                <div className="flex justify-between items-end leading-none">
                    <span className="text-[10px] font-bold text-[var(--brand-primary)] flex items-center gap-1">
                        <FontAwesomeIcon icon={faBolt} className="w-2 h-2" />
                        {USER_MOCK.currentPoints}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                        / {USER_MOCK.nextLevelPoints}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-[var(--bg-page)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
