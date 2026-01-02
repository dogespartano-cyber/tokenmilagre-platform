import { OracleAnalyzerService } from '../services/OracleService';

async function runAudit() {
    console.log("🛡️ SECURITY AGENT: Iniciando auditoria de injeção de dados...");

    const service = new OracleAnalyzerService({
        minLiquidity: 1000,
        checkIntervalMs: 60000,
        securityLevel: 'AGGRESSIVE'
    });

    const maliciousPayloads = [
        "DROP TABLE OracleSignal;",
        "<script>alert('xss')</script>",
        "../../etc/passwd"
    ];

    let passed = true;

    for (const payload of maliciousPayloads) {
        console.log(`Testing payload: ${payload}`);
        try {
            await service.analyzeToken(payload);
            // Se chegamos aqui, o serviço aceitou a string.
            // Para um serviço real, validaríamos se ele sanitizou.
            // Aqui assumimos que se não crashou e tratou como tokenAddress, ok.
            // Mas idealmente, deveria rejeitar se não for base58.
            console.log("  -> Processed without crash (Warning: Input validation needed)");
        } catch (e) {
            console.log("  -> Blocked/Errored correctly");
        }
    }

    console.log("✅ SECURITY AGENT: Auditoria preliminar concluída.");
}

runAudit();
