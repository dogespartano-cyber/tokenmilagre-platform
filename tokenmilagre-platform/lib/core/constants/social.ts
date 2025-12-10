/**
 * 🔗 Social Links Constants
 * 
 * @agi-domain core
 * @agi-purpose Single source of truth for all social media links
 * @agi-note Update these values when links expire - all usages will update automatically
 * 
 * Usage:
 * ```typescript
 * import { SOCIAL_LINKS } from '@/lib/core/constants/social'
 * ```
 */

export const SOCIAL_LINKS = {
    /**
     * Discord Community Invite Link
     * @note Discord links can expire. Update here when needed.
     * @updated 2025-12-09
     */
    DISCORD: 'https://discord.gg/9BU3mFVX58',

    /**
     * Telegram Community Group Link
     * @updated 2025-12-09
     */
    TELEGRAM: 'https://t.me/+Bop_TVFc_mg3Njlh',

    /**
     * Twitter/X Account
     */
    TWITTER: 'https://x.com/TokenMilagre',

    /**
     * GitHub Repository
     */
    GITHUB: 'https://github.com/dogespartano-cyber/tokenmilagre-platform',

    /**
     * Main Website
     */
    WEBSITE: 'https://tokenmilagre.xyz',
} as const;

/**
 * Social link metadata for buttons
 */
export const SOCIAL_LINKS_META = {
    discord: {
        name: 'Discord',
        url: SOCIAL_LINKS.DISCORD,
        color: '#5865F2', // Discord brand color
        hoverBg: 'hover:bg-[#5865F2]/10',
        borderHover: 'hover:border-[#5865F2]/30',
    },
    telegram: {
        name: 'Telegram',
        url: SOCIAL_LINKS.TELEGRAM,
        color: '#0088cc', // Telegram brand color
        hoverBg: 'hover:bg-[#0088cc]/10',
        borderHover: 'hover:border-[#0088cc]/30',
    },
    twitter: {
        name: 'X (Twitter)',
        url: SOCIAL_LINKS.TWITTER,
        color: '#000000',
        hoverBg: 'hover:bg-white/10',
        borderHover: 'hover:border-white/30',
    },
    github: {
        name: 'GitHub',
        url: SOCIAL_LINKS.GITHUB,
        color: '#333333',
        hoverBg: 'hover:bg-white/10',
        borderHover: 'hover:border-white/30',
    },
} as const;

export type SocialLinkKey = keyof typeof SOCIAL_LINKS_META;
