
import * as fs from 'fs';
import * as path from 'path';

/**
 * Verify Persistence
 * 
 * Script de segurança para validar se artefatos foram realmente salvos em disco.
 * Pode ser estendido para verificar Banco de Dados.
 * 
 * Uso: npx tsx scripts/safety/verify-persistence.ts --file "caminho/do/arquivo"
 */

async function main() {
    const args = process.argv.slice(2);
    const fileIndex = args.indexOf('--file');

    if (fileIndex === -1) {
        console.log('Usage: verify-persistence.ts --file <path>');
        process.exit(1);
    }

    const relativePath = args[fileIndex + 1];
    const absolutePath = path.resolve(process.cwd(), relativePath);

    console.log(`🔍 Verifying persistence of: ${relativePath}`);

    // 1. Verificação de Existência Física
    if (!fs.existsSync(absolutePath)) {
        console.error('❌ FAILURE: File does not exist on disk.');
        process.exit(1);
    }

    // 2. Verificação de Integridade (Tamanho > 0)
    const stats = fs.statSync(absolutePath);
    if (stats.size === 0) {
        console.error('❌ FAILURE: File exists but is empty (0 bytes).');
        process.exit(1);
    }

    // 3. Verificação de Acesso (Leitura)
    try {
        fs.accessSync(absolutePath, fs.constants.R_OK);
    } catch {
        console.error('❌ FAILURE: File exists but is not readable.');
        process.exit(1);
    }

    // 4. Timestamp Check (Recente?)
    const modifiedTime = new Date(stats.mtime);
    const now = new Date();
    const diffMs = now.getTime() - modifiedTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    console.log('✅ SUCCESS: File persisted correctly.');
    console.log(`   - Size: ${stats.size} bytes`);
    console.log(`   - Last Modified: ${diffMinutes.toFixed(2)} minutes ago`);

    // Confirmação para Agent
    console.log('VERIFICATION_PASSED');
}

main().catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
});
