'use client';

import React from 'react';

export default function GlobalBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* DARK MODE: Institutional Tech (Black & Yellow) */}
            <div className="hidden dark:block absolute inset-0 bg-[#0b0e11]">
                {/* 1. The "Solar Gold" Sun (Top Left) */}
                <div
                    className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[#FCD535]/10 rounded-full blur-[140px] animate-pulse-slow mix-blend-screen"
                    style={{ animationDuration: '10s' }}
                />

                {/* 2. Secondary Tech Beam (Bottom Right - Subtle Blue/Gray) */}
                <div
                    className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#1E2329] rounded-full blur-[120px] animate-pulse-slow mix-blend-overlay border-[50px] border-[#FCD535]/5"
                    style={{ animationDelay: '2s' }}
                />

                {/* 3. Central Gold Haze */}
                <div
                    className="absolute top-[30%] left-[20%] w-[600px] h-[600px] bg-[#FCD535]/5 rounded-full blur-[100px] animate-pulse-slow"
                    style={{ animationDelay: '5s' }}
                />
            </div>

            {/* LIGHT MODE: Pure Clean White (No Effects) */}
            <div className="block dark:hidden absolute inset-0 bg-[#FAFAFA]" />
        </div>
    );
}
