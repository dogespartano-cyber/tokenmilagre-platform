/**
 * Fear & Greed Gauge Component
 * Velocímetro do índice Fear & Greed
 * 
 * @agi-domain: layout
 * @refactored Extraído de layout-root.tsx
 */

'use client';

interface FearGreedGaugeNavbarProps {
    value: number;
}

export default function FearGreedGaugeNavbar({ value }: FearGreedGaugeNavbarProps) {
    return (
        <div
            className="flex items-center shrink-0 mr-12 relative"
            style={{ marginLeft: '-8px', marginRight: '-8px' }}
        >
            <div
                className="relative flex items-center justify-center group cursor-pointer"
                style={{ width: '120px', height: '90px', marginTop: '-28px' }}
                title="Fear & Greed - Sentimento de mercado"
            >
                <svg viewBox="20 -25 140 140" className="w-full h-full" style={{ overflow: 'visible' }}>
                    <defs>
                        {/* Gradiente arco-íris */}
                        <linearGradient id="rainbowGradientNavbar" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="20%" stopColor="#EA580C" />
                            <stop offset="40%" stopColor="#F59E0B" />
                            <stop offset="60%" stopColor="#84CC16" />
                            <stop offset="80%" stopColor="#22C55E" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>

                        {/* Filtros */}
                        <filter id="softShadowNavbar" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                            <feOffset dx="0" dy="1" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="intensiveGlowNavbar" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Arco de fundo */}
                    <path
                        d="M 30 100 A 60 60 0 0 1 150 100"
                        fill="none"
                        stroke="var(--border-medium)"
                        strokeWidth="16"
                        strokeLinecap="butt"
                        opacity="0.2"
                    />

                    {/* Arco colorido */}
                    <path
                        d="M 30 100 A 60 60 0 0 1 150 100"
                        fill="none"
                        stroke="url(#rainbowGradientNavbar)"
                        strokeWidth="16"
                        strokeLinecap="butt"
                        filter="url(#intensiveGlowNavbar)"
                    />

                    {/* Marcações principais */}
                    {[
                        { value: 0, label: '0', color: '#DC2626' },
                        { value: 25, label: '25', color: '#F59E0B' },
                        { value: 50, label: '50', color: '#84CC16' },
                        { value: 75, label: '75', color: '#22C55E' },
                        { value: 100, label: '100', color: '#10B981' }
                    ].map((mark, idx) => {
                        const angle = -180 + (mark.value * 1.8);
                        const radian = (angle * Math.PI) / 180;
                        const innerRadius = 52;
                        const outerRadius = 58;
                        const labelRadius = 70;

                        const x1 = 90 + innerRadius * Math.cos(radian);
                        const y1 = 100 + innerRadius * Math.sin(radian);
                        const x2 = 90 + outerRadius * Math.cos(radian);
                        const y2 = 100 + outerRadius * Math.sin(radian);
                        const labelX = 90 + labelRadius * Math.cos(radian);
                        const labelY = 100 + labelRadius * Math.sin(radian);

                        return (
                            <g key={idx}>
                                <line
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={mark.color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <text
                                    x={labelX}
                                    y={labelY}
                                    fill="var(--text-primary)"
                                    fontSize="10"
                                    fontWeight="700"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {mark.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Ponteiro */}
                    <g
                        style={{
                            transform: `rotate(${(value * 1.8) - 90}deg)`,
                            transformOrigin: '90px 100px',
                            transition: 'transform 0.05s linear'
                        }}
                    >
                        <path
                            d="M 90 100 L 87 97 L 88 50 L 90 47 L 92 50 L 93 97 Z"
                            fill="#000000"
                            opacity="0.15"
                            transform="translate(1, 2)"
                        />
                        <path
                            d="M 90 100 L 87 97 L 88 50 L 90 47 L 92 50 L 93 97 Z"
                            fill={
                                value <= 20 ? '#DC2626' :
                                    value <= 40 ? '#F59E0B' :
                                        value <= 60 ? '#84CC16' :
                                            value <= 80 ? '#22C55E' : '#10B981'
                            }
                            filter="url(#softShadowNavbar)"
                        />
                    </g>

                    {/* Base do ponteiro */}
                    <circle
                        cx="90"
                        cy="100"
                        r="10"
                        fill="var(--bg-elevated)"
                        stroke="var(--border-medium)"
                        strokeWidth="1.5"
                    />
                    <circle
                        cx="90"
                        cy="100"
                        r="6"
                        fill={
                            value <= 20 ? '#DC2626' :
                                value <= 40 ? '#F59E0B' :
                                    value <= 60 ? '#84CC16' :
                                        value <= 80 ? '#22C55E' : '#10B981'
                        }
                        filter="url(#intensiveGlowNavbar)"
                    />

                    {/* Valor numérico */}
                    <text
                        x="90"
                        y="80"
                        fill="var(--text-primary)"
                        fontSize="20"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {value}
                    </text>
                </svg>
            </div>
        </div>
    );
}
