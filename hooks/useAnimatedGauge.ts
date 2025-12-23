/**
 * @module hooks/useAnimatedGauge
 * @description Hook reutilizável para animação de gauge com cleanup adequado
 */

'use client';

import { useState, useEffect, useRef } from 'react';

interface UseAnimatedGaugeOptions {
    duration?: number;
    steps?: number;
}

/**
 * Hook para animar valor de gauge de 0 até o valor alvo
 * com easing ease-out cubic e cleanup adequado
 */
export function useAnimatedGauge(
    targetValue: number,
    options: UseAnimatedGaugeOptions = {}
): number {
    const { duration = 2000, steps = 60 } = options;
    const [gaugeValue, setGaugeValue] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const stepDuration = duration / steps;
        let currentStep = 0;

        // Reset to 0
        setGaugeValue(0);

        // Easing function - ease out cubic
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
                timeoutRef.current = setTimeout(animate, stepDuration);
            } else {
                setGaugeValue(targetValue);
            }
        };

        animate();

        // Cleanup: cancelar timeout se componente desmontar
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [targetValue, duration, steps]);

    return gaugeValue;
}
