import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * 🛡️ VALIDATOR NODE
 * 
 * Verifica se um Token fornecido corresponde à verdade imutável no disco.
 * Funciona como um oráculo de verdade para a identidade dos agentes.
 */

const WORKFLOWS_DIR = path.join(process.cwd(), '.agent', 'workflows');

async function validateIdentity(agentName: string, candidateToken: string) {
    console.log(`\n🕵️  Iniciando Protocolo de Verificação de Identidade...`);
    console.log(`Target Agent: ${agentName}`);
    console.log(`Candidate Hash: ${candidateToken}`);

    // 1. Localizar o arquivo do Agente (Bloco Genesis)
    const filename = `${agentName.toUpperCase()}-agent.md`;
    const filePath = path.join(WORKFLOWS_DIR, filename);

    if (!fs.existsSync(filePath)) {
        console.error(`\n❌ CRITICAL FAILURE: Agente '${agentName}' não existe no registro.`);
        console.error(`Status: ALUCINAÇÃO DE IDENTIDADE (404)`);
        process.exit(1);
    }

    // 2. Extrair o Token Verdadeiro (Proof of Truth)
    const content = fs.readFileSync(filePath, 'utf8');
    const tokenMatch = content.match(/identity-token: (\w+)/);

    if (!tokenMatch) {
        console.error(`\n❌ INTEGRITY ERROR: Agente '${agentName}' existe mas não possui Token de Identidade.`);
        console.error(`Status: ARQUIVO CORROMPIDO OU LEGADO`);
        process.exit(1);
    }

    const trueToken = tokenMatch[1].trim();

    // 3. Comparação Criptográfica (Match)
    // Usamos timingSafeEqual para evitar timing attacks, embora overkill aqui, mantém a vibe "sec"
    const candidateBuffer = Buffer.from(candidateToken);
    const trueBuffer = Buffer.from(trueToken);

    let isMatch = false;
    try {
        isMatch = crypto.timingSafeEqual(candidateBuffer, trueBuffer);
    } catch (e) {
        isMatch = false; // Lengths differ
    }

    if (candidateToken === trueToken) {
        console.log(`\n✅ VERIFICATION SUCCESSFUL (MATCH)`);
        console.log(`=========================================`);
        console.log(`Identity: CONFIRMED`);
        console.log(`Source:   ${filePath}`);
        console.log(`Status:   AUTHENTIC`);
        console.log(`=========================================`);
        process.exit(0);
    } else {
        console.error(`\n⛔ VERIFICATION FAILED (MISMATCH)`);
        console.error(`=========================================`);
        console.error(`Expected: ${trueToken}`);
        console.error(`Received: ${candidateToken}`);
        console.error(`Status:   FRAUD DETECTED`);
        console.error(`=========================================`);
        process.exit(1);
    }
}

// CLI Args
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: npx tsx validate-token.ts <AGENT_NAME> <TOKEN>");
    process.exit(1);
}

validateIdentity(args[0], args[1]);
