
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Migration: Add Identity Tokens to Agents
 * 
 * Percorre todos os arquivos .md em .agent/workflows/
 * Adiciona o campo 'identity-token' se não existir.
 */

const WORKFLOWS_DIR = path.join(process.cwd(), '.agent', 'workflows');

function generateToken(name: string): string {
    // Deterministic seed based on name for stability (optional) or purely random
    // Using random for security as requested
    return crypto.randomBytes(4).toString('hex'); // 8 chars
}

function migrate() {
    console.log('🚀 Starting Agent Token Migration...');

    if (!fs.existsSync(WORKFLOWS_DIR)) {
        console.error('❌ Workflows directory not found!');
        process.exit(1);
    }

    const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.md'));
    let updatedCount = 0;

    files.forEach(file => {
        const filePath = path.join(WORKFLOWS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Verifica se é um arquivo de agente (tem type: agent ou similar)
        if (!content.includes('type: agent') && !content.includes('type: core-dna') && !content.includes('type: meta-agent')) {
            console.log(`Skipping ${file} (not an agent definition)`);
            return;
        }

        // Verifica se já tem token
        if (content.includes('identity-token:')) {
            console.log(`Skipping ${file} (already has token)`);
            return;
        }

        // Extrai o nome para log
        const nameMatch = content.match(/name: (.*)/);
        const agentName = nameMatch ? nameMatch[1].trim() : file.replace('-agent.md', '');

        const newToken = generateToken(agentName);

        // Injeta o token logo após o name:
        let newContent = content;
        if (nameMatch) {
            newContent = content.replace(
                `name: ${agentName}`,
                `name: ${agentName}\nidentity-token: ${newToken}`
            );
        } else {
            // Se não achar name, tenta por type
            newContent = content.replace(
                /type: .*/,
                (match) => `${match}\nidentity-token: ${newToken}`
            );
        }

        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated ${file} (Agent: ${agentName}) -> Token: ${newToken}`);
        updatedCount++;
    });

    console.log(`\n✨ Migration Complete. ${updatedCount} agents updated.`);
}

migrate();
