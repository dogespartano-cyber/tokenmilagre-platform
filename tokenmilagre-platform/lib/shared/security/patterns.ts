/**
 * Pattern Detection para URLs maliciosas
 *
 * Detecta typosquatting, homograph attacks, e padrões suspeitos
 */

import scamDomains from '@/lib/domains/crypto/data/scam-domains.json';
import trustedDomains from '@/lib/domains/crypto/data/trusted-domains.json';

// Levenshtein distance para detectar typosquatting
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Detecta se um domínio é typosquatting de um domínio legítimo
export function detectTyposquatting(domain: string): {
    isTyposquatting: boolean;
    legitimate?: string;
    distance?: number;
} {
    const allTrusted = [
        ...trustedDomains.exchanges,
        ...trustedDomains.wallets,
        ...trustedDomains.news,
        ...trustedDomains.official,
        ...trustedDomains.analytics,
        ...trustedDomains.defi,
    ];

    for (const legitDomain of allTrusted) {
        const distance = levenshteinDistance(domain, legitDomain);
        // Se a distância for <= 2, é provável typosquatting
        const threshold = Math.min(2, Math.floor(legitDomain.length * 0.2));

        if (distance > 0 && distance <= threshold) {
            return {
                isTyposquatting: true,
                legitimate: legitDomain,
                distance,
            };
        }
    }

    return { isTyposquatting: false };
}

// Caracteres Unicode que se parecem com ASCII (homograph attack)
const homographMap: Record<string, string> = {
    'а': 'a', // Cirílico
    'е': 'e',
    'о': 'o',
    'р': 'p',
    'с': 'c',
    'х': 'x',
    'у': 'y',
    'ν': 'v', // Grego
    'ο': 'o',
    'ρ': 'p',
    'ϲ': 'c',
    'ѕ': 's',
};

// Detecta homograph attacks
export function detectHomograph(domain: string): {
    hasHomograph: boolean;
    suspiciousChars?: string[];
} {
    const suspiciousChars: string[] = [];

    for (const char of domain) {
        if (char in homographMap) {
            suspiciousChars.push(char);
        }
    }

    return {
        hasHomograph: suspiciousChars.length > 0,
        suspiciousChars: suspiciousChars.length > 0 ? suspiciousChars : undefined,
    };
}

// Palavras-chave suspeitas comuns em scams
const suspiciousKeywords = [
    'free',
    'giveaway',
    'airdrop',
    'double',
    'triple',
    'guaranteed',
    'profit',
    'earn',
    'claim',
    'bonus',
    'reward',
    'prize',
    'winner',
    'lucky',
];

// TLDs gratuitos frequentemente usados em scams
const suspiciousTLDs = [
    '.tk',
    '.ml',
    '.ga',
    '.cf',
    '.gq',
];

// Detecta padrões suspeitos
export function detectSuspiciousPatterns(domain: string): {
    isSuspicious: boolean;
    reasons: string[];
} {
    const reasons: string[] = [];

    // Verifica keywords
    const lowerDomain = domain.toLowerCase();
    for (const keyword of suspiciousKeywords) {
        if (lowerDomain.includes(keyword)) {
            reasons.push(`Contém palavra suspeita: "${keyword}"`);
        }
    }

    // Verifica TLDs suspeitos
    for (const tld of suspiciousTLDs) {
        if (lowerDomain.endsWith(tld)) {
            reasons.push(`TLD suspeito: ${tld} (frequente em scams)`);
        }
    }

    // Domínio muito longo (> 40 caracteres é suspeito)
    if (domain.length > 40) {
        reasons.push('Domínio excepcionalmente longo');
    }

    // Muitos hífens (> 3 é suspeito)
    const hyphens = (domain.match(/-/g) || []).length;
    if (hyphens > 3) {
        reasons.push(`Muitos hífens no domínio (${hyphens})`);
    }

    // Números misturados com letras de forma suspeita
    if (/\d{3,}/.test(domain)) {
        reasons.push('Sequência longa de números no domínio');
    }

    return {
        isSuspicious: reasons.length > 0,
        reasons,
    };
}

// Verifica se domínio está na blacklist
export function isInBlacklist(domain: string): {
    isBlacklisted: boolean;
    entry?: typeof scamDomains.domains[0];
} {
    const entry = scamDomains.domains.find(
        (item) => item.domain.toLowerCase() === domain.toLowerCase()
    );

    return {
        isBlacklisted: !!entry,
        entry,
    };
}

// Verifica se domínio está na whitelist
export function isInWhitelist(domain: string): boolean {
    const lowerDomain = domain.toLowerCase();

    const allTrusted = [
        ...trustedDomains.exchanges,
        ...trustedDomains.wallets,
        ...trustedDomains.news,
        ...trustedDomains.official,
        ...trustedDomains.analytics,
        ...trustedDomains.defi,
    ];

    return allTrusted.some((trusted) => trusted.toLowerCase() === lowerDomain);
}

// Extrai domínio de URL completa
export function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname.replace(/^www\./, '');
    } catch {
        // Se não for URL válida, assume que já é um domínio
        return url.replace(/^www\./, '').split('/')[0];
    }
}

// Análise completa de URL
export interface URLAnalysis {
    safe: boolean;
    level?: 'critical' | 'warning' | 'suspicious';
    reasons: string[];
    educationalTip?: string;
    similarLegitDomain?: string;
    source: 'whitelist' | 'blacklist' | 'pattern' | 'unknown';
}

export function analyzeURL(url: string): URLAnalysis {
    const domain = extractDomain(url);

    // 1. Whitelist (safe imediatamente)
    if (isInWhitelist(domain)) {
        return {
            safe: true,
            reasons: ['Domínio verificado e confiável'],
            source: 'whitelist',
        };
    }

    // 2. Blacklist (critical threat)
    const blacklistCheck = isInBlacklist(domain);
    if (blacklistCheck.isBlacklisted && blacklistCheck.entry) {
        const entry = blacklistCheck.entry;
        const reasons = [`Domínio conhecido como ${entry.type}`];

        if (entry.legitimate) {
            reasons.push(`Imita o site legítimo: ${entry.legitimate}`);
        }

        return {
            safe: false,
            level: 'critical',
            reasons,
            educationalTip: entry.type === 'typosquatting'
                ? 'Typosquatting é quando golpistas registram domínios com pequenos erros de digitação para enganar usuários. Sempre confira o domínio letra por letra!'
                : entry.type === 'homograph'
                    ? 'Ataques homográficos usam caracteres Unicode que PARECEM iguais mas são diferentes. Seu navegador pode mostrar idênticos ao site real!'
                    : 'Este site foi reportado como scam pela comunidade. Nunca compartilhe suas chaves privadas ou senhas!',
            similarLegitDomain: entry.legitimate,
            source: 'blacklist',
        };
    }

    // 3. Typosquatting detection
    const typoCheck = detectTyposquatting(domain);
    if (typoCheck.isTyposquatting) {
        return {
            safe: false,
            level: 'critical',
            reasons: [
                `Possível typosquatting de "${typoCheck.legitimate}"`,
                `Distância de edição: ${typoCheck.distance}`,
            ],
            educationalTip: 'Typosquatting é quando golpistas registram domínios com pequenos erros de digitação (ex: binanse.com vs binance.com). Sempre confira o domínio completo!',
            similarLegitDomain: typoCheck.legitimate,
            source: 'pattern',
        };
    }

    // 4. Homograph detection
    const homographCheck = detectHomograph(domain);
    if (homographCheck.hasHomograph) {
        return {
            safe: false,
            level: 'critical',
            reasons: [
                'Ataque homográfico detectado',
                `Caracteres suspeitos: ${homographCheck.suspiciousChars?.join(', ')}`,
            ],
            educationalTip: 'Este domínio usa caracteres Unicode que PARECEM letras normais mas são diferentes. Muito usado em phishing!',
            source: 'pattern',
        };
    }

    // 5. Suspicious patterns
    const patternCheck = detectSuspiciousPatterns(domain);
    if (patternCheck.isSuspicious) {
        return {
            safe: false,
            level: 'warning',
            reasons: patternCheck.reasons,
            educationalTip: 'Cuidado com promessas de ganhos fáceis ou lucros garantidos. Se parece bom demais para ser verdade, provavelmente é scam!',
            source: 'pattern',
        };
    }

    // 6. Desconhecido (avisar mas permitir)
    return {
        safe: true,
        reasons: ['Nenhuma ameaça detectada nos padrões conhecidos'],
        source: 'unknown',
    };
}
