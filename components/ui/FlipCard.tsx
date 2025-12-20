/**
 * @module ui/FlipCard
 * @description Card com efeito de virar (flip) ao passar o mouse
 */

'use client';

import { ReactNode } from 'react';

interface FlipCardProps {
    front: ReactNode;
    back: ReactNode;
    className?: string;
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
    return (
        <div className={`flip-card-container ${className}`}>
            <div className="flip-card-inner">
                {/* Frente do card */}
                <div className="flip-card-front">
                    {front}
                </div>

                {/* Verso do card (explicação) */}
                <div className="flip-card-back">
                    {back}
                </div>
            </div>

            <style jsx>{`
                .flip-card-container {
                    perspective: 1000px;
                    min-height: 150px;
                }
                
                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    min-height: 150px;
                    height: 100%;
                    transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
                    transform-style: preserve-3d;
                }
                
                .flip-card-container:hover .flip-card-inner {
                    transform: rotateY(180deg);
                }
                
                .flip-card-front,
                .flip-card-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    min-height: 150px;
                    height: 100%;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                .flip-card-front {
                    z-index: 2;
                }
                
                .flip-card-back {
                    transform: rotateY(180deg);
                    z-index: 1;
                }
            `}</style>
        </div>
    );
}
