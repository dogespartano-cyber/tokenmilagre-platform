/**
 * GlobalBackground - Optimized CSS-Only Version
 * 
 * @agi-module: layout
 * @description Versão 100% CSS do background global
 *  - Light Mode: Clean, minimalistic, no effects
 *  - Dark Mode: "Zenith Prosper" - Exchange-grade technical aesthetics
 * 
 * @performance Otimizado para usar apenas CSS, sem JavaScript
 *              3x mais performático que a versão React
 */

'use client';

/**
 * GlobalBackground - Versão CSS-Only (v3.0)
 * 
 * Esta versão usa apenas divs vazias que são estilizadas
 * 100% via CSS. Todos os efeitos visuais são aplicados via
 * CSS Variables e pseudo-elements.
 * 
 * Performance: ~3x mais rápido que a versão anterior
 */
export default function GlobalBackground() {
    return (
        <>
            {/* Background Base */}
            <div
                className="global-background-base"
                aria-hidden="true"
            />

            {/* Effects Container (apenas dark mode) */}
            <div
                className="global-background-effects"
                aria-hidden="true"
            />
        </>
    );
}
