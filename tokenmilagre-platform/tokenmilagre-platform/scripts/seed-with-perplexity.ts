#!/usr/bin/env ts-node
/**
 * 🤖 Script de Automação - Seed com Perplexity API
 * 
 * Este script gera e publica automaticamente artigos usando a Perplexity API.
 * Reutiliza toda a lógica do /dashboard/criar-artigo.
 * 
 * Ver README-PERPLEXITY-SEED.md para documentação completa.
 * 
 * TODO: Implementar funções de geração e salvamento
 * Por enquanto, este é um stub/placeholder.
 * 
 * Estrutura esperada:
 * 1. callPerplexityAPI() - Chama API com prompts
 * 2. generateNewsArticle() - Gera notícia
 * 3. generateEducationalArticle() - Gera artigo educacional
 * 4. generateResourceArticle() - Gera recurso
 * 5. saveNewsArticle() - Salva no banco
 * 6. saveEducationalArticle() - Salva no banco
 * 7. saveResource() - Salva no banco
 * 8. main() - Loop principal
 */

import { PrismaClient } from '@/lib/generated/prisma';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Config
const config = {
  perplexityApiKey: process.env.PERPLEXITY_API_KEY || '',
  perplexityApiUrl: 'https://api.perplexity.ai/chat/completions',
  model: 'sonar',
  delayBetweenRequests: 2000,
  maxRetries: 3,
  dryRun: process.argv.includes('--dry-run')
};

// Topics
const NEWS_TOPICS = [
  'Bitcoin ultrapassa $100.000 pela primeira vez na história',
  'Ethereum 2.0 completa upgrade de escalabilidade com sucesso',
  // ... adicionar mais 8 tópicos
];

const EDUCATIONAL_TOPICS = [
  'Guia completo: Como comprar sua primeira criptomoeda com segurança',
  'Blockchain explicado: A tecnologia por trás do Bitcoin',
  // ... adicionar mais 8 tópicos
];

const RESOURCE_TOPICS = [
  'MetaMask: A carteira mais popular para Ethereum e Web3',
  'Ledger: Hardware wallet para máxima segurança das suas criptos',
  // ... adicionar mais 8 tópicos
];

// Helpers
function generateSlug(title: string, addDate: boolean = false): string {
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (addDate) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    slug = `${slug}-${dateStr}`;
  }

  return slug.substring(0, 100);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main
async function main() {
  console.log('🤖 Script de Automação - Seed com Perplexity API\n');

  // Validar config
  if (!config.perplexityApiKey) {
    console.error('❌ PERPLEXITY_API_KEY não configurada no .env');
    process.exit(1);
  }

  // Buscar admin
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    console.error('❌ Nenhum usuário ADMIN encontrado no banco');
    process.exit(1);
  }

  console.log(`✓ Usando usuário: ${adminUser.email}`);
  console.log(`✓ Modelo: ${config.model}`);
  console.log(`✓ Dry run: ${config.dryRun ? 'SIM' : 'NÃO'}\n`);

  console.log('TODO: Implementar loops de geração');
  console.log('Ver README-PERPLEXITY-SEED.md para estrutura completa\n');

  // TODO: Implementar:
  // 1. Loop para NEWS_TOPICS
  // 2. Loop para EDUCATIONAL_TOPICS
  // 3. Loop para RESOURCE_TOPICS
  // 4. Cada um com: callAPI -> processar -> salvar -> delay
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
