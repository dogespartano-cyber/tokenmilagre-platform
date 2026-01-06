
import fs from 'fs';
import path from 'path';

// Configuration
const ROUTER_FILE = path.join(process.cwd(), '.agent/workflows/ROUTER-agent.md');

// Interface for Rules
interface RoutingRule {
    keywords: string[];
    agent: string;
}

// 1. Parsing Logic
function parseRouterRules(filePath: string): RoutingRule[] {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Router file not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const rules: RoutingRule[] = [];

    // Regex to capture table rows: | `key`, `word` | **AGENT** |
    // This is a simplified parser assuming the table structure in ROUTER-agent.md
    const lines = content.split('\n');
    let inTable = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // Detect Table Start
        if (trimmed.startsWith('| KEYWORDS')) {
            inTable = true;
            continue;
        }
        if (inTable && trimmed.startsWith('| :---')) continue;

        if (inTable && trimmed.startsWith('|')) {
            // Parse Row
            const parts = trimmed.split('|').filter(p => p.trim() !== '');
            if (parts.length >= 2) {
                const keywordsRaw = parts[0].trim(); // e.g., `código`, `ts`
                const agentRaw = parts[1].trim();    // e.g., **CODIGO**

                // Clean Agent Name
                const agentName = agentRaw.replace(/\*\*/g, '').trim();

                // Clean Keywords
                const keywords = keywordsRaw
                    .split(',')
                    .map(k => k.trim().replace(/`/g, ''))
                    .filter(k => k.length > 0);

                rules.push({ keywords, agent: agentName });
            }
        }

        // Detect Table End (empty line or header)
        if (inTable && trimmed === '') {
            inTable = false;
        }
    }

    return rules;
}

// 2. Matching Logic (Deterministic)
function calculateMatch(input: string, rules: RoutingRule[]) {
    const normalizedInput = input.toLowerCase();

    // Find all matches
    const matches = rules.map(rule => {
        const matchedKeywords = rule.keywords.filter(k => normalizedInput.includes(k.toLowerCase()));
        const score = matchedKeywords.length > 0 ? 1.0 : 0.0; // Simplified deterministic scoring
        return { rule, score, matchedKeywords };
    });

    // Sort by score
    const bestMatch = matches.sort((a, b) => b.score - a.score)[0];

    return bestMatch.score > 0 ? bestMatch : null;
}

// 3. Test Scenarios
const SCENARIOS = [
    { input: "Preciso ajustar o css do botão", expected: "DESIGN" },
    { input: "Ocorreu um erro de tipagem no código", expected: "CODIGO" },
    { input: "Vamos escrever um artigo sobre SEO", expected: "CONTEUDO" },
    { input: "O banco de dados precisa de migration", expected: "DATABASE" },
    { input: "Quero criar um token na solana", expected: "TOKEN" },
    { input: "Analise se essa ideia faz sentido financeiramente (roi)", expected: "VALOR" },
    { input: "Ideia para um novo feature viral", expected: "IDEIAS" }, // May match IDEIAS or VIRAL depending on keywords
    { input: "Faça uma auditoria de segurança", expected: "SEGURANCA" },
    { input: "Organizar a estrutura de pastas", expected: "ESTRUTURA" },
    { input: "Commitar e dar push no repo", expected: "GITHUB" },
    { input: "Verificar integridade dos dados e estatísticas", expected: "DADOS" },
    { input: "Como rodar isso no host via podman?", expected: "BRIDGE" },
    { input: "É ético fazer isso?", expected: "ARQUITETO" }, // Fallback check or explicit rule?
    { input: "Configurar o deploy na vercel", expected: "DEVOPS" }
];

// 4. Execution
function runTests() {
    console.log("🔍 Parsing Rules from:", ROUTER_FILE);
    const rules = parseRouterRules(ROUTER_FILE);
    console.log(`✅ Loaded ${rules.length} routing rules.\n`);

    console.log("🧪 Running Deterministic Stress Test...\n");

    let passed = 0;
    let failed = 0;

    SCENARIOS.forEach(scenario => {
        const result = calculateMatch(scenario.input, rules);

        if (result && result.rule.agent === scenario.expected) {
            console.log(`✅ PASS: "${scenario.input}" -> [${result.rule.agent}] (Matched: ${result.matchedKeywords.join(', ')})`);
            passed++;
        } else {
            // Special handling for overlapped keywords (Mocking acceptable overlaps if needed, strictly check for now)
            console.log(`❌ FAIL: "${scenario.input}"`);
            console.log(`   Expected: [${scenario.expected}]`);
            console.log(`   Actual:   ${result ? `[${result.rule.agent}] (Matched: ${result.matchedKeywords})` : "NO MATCH"}`);
            failed++;
        }
    });

    console.log(`\n📊 SUMMARY: ${passed}/${SCENARIOS.length} Passed`);

    if (failed > 0) {
        console.log("⚠️  Routing Logic has gaps or ambiguities.");
        process.exit(1);
    } else {
        console.log("🚀 SOLID: Routing logic is deterministic and accurate.");
    }
}

runTests();
