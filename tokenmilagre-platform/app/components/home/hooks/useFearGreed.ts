/**
 * @module home/hooks/useFearGreed
 * @description Hook para Fear & Greed Index com animação
 * @agi-purpose Separar lógica de animação do gauge
 */

'use client';

import { useState, useEffect } from 'react';
import type { FearGreedData } from '../types';

interface UseFearGreedReturn {
    fearGreed: FearGreedData | null;
    gaugeValue: number;
}

export function useFearGreed(): UseFearGreedReturn {
    const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
    const [gaugeValue, setGaugeValue] = useState(0);

    // Buscar Fear & Greed Index
    useEffect(() => {
        const CACHE_KEY = 'fear_greed_index';

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                setFearGreed(cachedData);
            } catch (error) {
                console.error('Erro ao carregar cache:', error);
            }
        }

        const fetchFearGreed = async () => {
            try {
                const response = await fetch('/api/fear-greed');
                const result = await response.json();

                if (result.success && result.data) {
                    setFearGreed(result.data);
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
                }
            } catch (error) {
                console.error('Erro ao buscar Fear & Greed Index:', error);
            }
        };

        fetchFearGreed();
    }, []);

    // Animação do ponteiro do velocímetro
    useEffect(() => {
        if (fearGreed) {
            const targetValue = parseInt(fearGreed.value);
            const duration = 2500;
            const steps = 60;
            const stepDuration = duration / steps;

            let currentStep = 0;
            setGaugeValue(0);

            const easeOutCubic = (t: number): number => {
                return 1 - Math.pow(1 - t, 3);
            };

            const animate = () => {
                currentStep++;
                const progress = currentStep / steps;
                const easedProgress = easeOutCubic(progress);
                const newValue = Math.floor(easedProgress * targetValue);

                setGaugeValue(newValue);

                if (currentStep < steps) {
                    setTimeout(animate, stepDuration);
                } else {
                    setGaugeValue(targetValue);
                }
            };

            animate();
        }
    }, [fearGreed]);

    return {
        fearGreed,
        gaugeValue,
    };
}
