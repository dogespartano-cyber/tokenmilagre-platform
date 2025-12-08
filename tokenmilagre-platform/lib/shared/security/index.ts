/**
 * 🛡️ Security Module
 * 
 * @agi-purpose: URL security analysis, scam detection
 */

export {
    detectTyposquatting,
    detectHomograph,
    detectSuspiciousPatterns,
    isInBlacklist,
    isInWhitelist,
    extractDomain,
    analyzeURL,
    type URLAnalysis,
} from './patterns';
