'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram, faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { SOCIAL_LINKS, SOCIAL_LINKS_META, type SocialLinkKey } from '@/lib/core/constants/social';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * 🔗 Social Links Component
 * 
 * @agi-domain shared
 * @agi-purpose Centralized social media buttons for Discord, Telegram, etc.
 * @agi-note All links come from lib/core/constants/social.ts for easy maintenance
 * 
 * Usage:
 * ```tsx
 * // Full buttons with labels
 * <SocialLinks variant="buttons" />
 * 
 * // Compact icon-only buttons
 * <SocialLinks variant="icons" />
 * 
 * // Specific platforms only
 * <SocialLinks variant="buttons" platforms={['discord', 'telegram']} />
 * ```
 */

const ICON_MAP: Record<SocialLinkKey, IconDefinition> = {
    discord: faDiscord,
    telegram: faTelegram,
    twitter: faXTwitter,
    github: faGithub,
};

interface SocialLinksProps {
    /** Display variant */
    variant?: 'buttons' | 'icons' | 'minimal' | 'glass';
    /** Which platforms to show (default: all) */
    platforms?: SocialLinkKey[];
    /** Additional class names for the container */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Show labels (only for buttons variant) */
    showLabels?: boolean;
}

export default function SocialLinks({
    variant = 'buttons',
    platforms = ['discord', 'telegram'],
    className = '',
    size = 'md',
    showLabels = true,
}: SocialLinksProps) {
    const sizeClasses = {
        sm: {
            button: 'px-3 py-1.5 text-xs gap-1.5',
            icon: 'p-1.5',
            iconSize: 'w-3.5 h-3.5',
        },
        md: {
            button: 'px-4 py-2 text-sm gap-2',
            icon: 'p-2',
            iconSize: 'w-5 h-5',
        },
        lg: {
            button: 'px-6 py-3 text-base gap-3',
            icon: 'p-3',
            iconSize: 'w-6 h-6',
        },
    };

    const sizes = sizeClasses[size];

    if (variant === 'icons') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {platforms.map((platform) => {
                    const meta = SOCIAL_LINKS_META[platform];
                    const icon = ICON_MAP[platform];

                    return (
                        <a
                            key={platform}
                            href={meta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                ${sizes.icon}
                rounded-lg
                bg-[var(--bg-tertiary)]/50
                border border-[var(--border-light)]
                text-[var(--text-secondary)]
                hover:text-white
                ${meta.hoverBg}
                ${meta.borderHover}
                transition-all
              `}
                            aria-label={meta.name}
                        >
                            <FontAwesomeIcon icon={icon} className={sizes.iconSize} />
                        </a>
                    );
                })}
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <div className={`flex items-center gap-4 ${className}`}>
                {platforms.map((platform) => {
                    const meta = SOCIAL_LINKS_META[platform];
                    const icon = ICON_MAP[platform];

                    return (
                        <a
                            key={platform}
                            href={meta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--text-secondary)] hover:text-white transition-colors"
                            aria-label={meta.name}
                        >
                            <FontAwesomeIcon icon={icon} className={sizes.iconSize} />
                        </a>
                    );
                })}
            </div>
        );
    }

    if (variant === 'glass') {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                {platforms.map((platform) => {
                    const meta = SOCIAL_LINKS_META[platform];
                    const icon = ICON_MAP[platform];

                    return (
                        <a
                            key={platform}
                            href={meta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                  flex items-center ${sizes.button}
                  rounded-xl
                  bg-black/5 dark:bg-white/5
                  border border-black/5 dark:border-white/10
                  font-semibold
                  text-black/70 dark:text-white/80
                  hover:text-black dark:hover:text-white
                  hover:bg-black/10 dark:hover:bg-white/10
                  hover:border-black/10 dark:hover:border-white/20
                  transition-all
                  backdrop-blur-md
                  shadow-lg shadow-black/5
                `}
                        >
                            <FontAwesomeIcon icon={icon} className={sizes.iconSize} />
                            {showLabels && <span>{meta.name}</span>}
                        </a>
                    );
                })}
            </div>
        );
    }

    // Default: buttons variant
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {platforms.map((platform) => {
                const meta = SOCIAL_LINKS_META[platform];
                const icon = ICON_MAP[platform];

                return (
                    <a
                        key={platform}
                        href={meta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
              flex items-center ${sizes.button}
              rounded-xl
              bg-[var(--bg-tertiary)]/50
              border border-[var(--border-light)]
              font-semibold
              text-[var(--text-secondary)]
              hover:text-white
              ${meta.hoverBg}
              ${meta.borderHover}
              transition-all
              backdrop-blur-sm
            `}
                    >
                        <FontAwesomeIcon icon={icon} className={sizes.iconSize} />
                        {showLabels && <span>{meta.name}</span>}
                    </a>
                );
            })}
        </div>
    );
}

/**
 * Single social link button
 * For when you need just one platform
 */
export function SocialLinkButton({
    platform,
    className = '',
    size = 'md',
    showLabel = true,
    children,
}: {
    platform: SocialLinkKey;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    children?: React.ReactNode;
}) {
    const meta = SOCIAL_LINKS_META[platform];
    const icon = ICON_MAP[platform];

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-3',
    };

    const iconSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <a
            href={meta.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        flex items-center ${sizeClasses[size]}
        rounded-xl
        bg-[var(--bg-tertiary)]/50
        border border-[var(--border-light)]
        font-semibold
        text-[var(--text-secondary)]
        hover:text-white
        ${meta.hoverBg}
        ${meta.borderHover}
        transition-all
        backdrop-blur-sm
        ${className}
      `}
        >
            <FontAwesomeIcon icon={icon} className={iconSizes[size]} />
            {showLabel && <span>{children || meta.name}</span>}
        </a>
    );
}

/**
 * Discord-specific CTA button with branding
 */
export function DiscordButton({
    className = '',
    size = 'md',
    label = 'Entrar no Discord',
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}) {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm gap-2',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-3',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <a
            href={SOCIAL_LINKS.DISCORD}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        flex items-center justify-center ${sizeClasses[size]}
        rounded-xl
        bg-[#5865F2]
        hover:bg-[#4752C4]
        text-white
        font-bold
        shadow-lg shadow-[#5865F2]/25
        hover:shadow-xl hover:shadow-[#5865F2]/30
        transition-all
        ${className}
      `}
        >
            <FontAwesomeIcon icon={faDiscord} className={iconSizes[size]} />
            <span>{label}</span>
        </a>
    );
}

/**
 * Telegram-specific CTA button with branding
 */
export function TelegramButton({
    className = '',
    size = 'md',
    label = 'Entrar no Telegram',
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}) {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm gap-2',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-3',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <a
            href={SOCIAL_LINKS.TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        flex items-center justify-center ${sizeClasses[size]}
        rounded-xl
        bg-[#0088cc]
        hover:bg-[#0077b3]
        text-white
        font-bold
        shadow-lg shadow-[#0088cc]/25
        hover:shadow-xl hover:shadow-[#0088cc]/30
        transition-all
        ${className}
      `}
        >
            <FontAwesomeIcon icon={faTelegram} className={iconSizes[size]} />
            <span>{label}</span>
        </a>
    );
}
