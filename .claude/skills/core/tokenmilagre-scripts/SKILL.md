---
name: tokenmilagre-scripts
description: "Templates e patterns para scripts de automação (migration, bulk processing, maintenance). TRIGGERS: 'script', 'automação', 'migration', 'bulk processing'. Use quando criar scripts para dados, database ops, content migration, automation."
license: MIT
---

# Token Milagre - Scripts & Automation Guide

**Templates e patterns padronizados para scripts de automação**

---

## 🎯 Purpose

Fornecer templates reutilizáveis e patterns para scripts que automatizam:
- Data migration e transformação
- Bulk processing de conteúdo
- Database maintenance
- Análise e relatórios
- Tarefas agendadas

---

## 📋 Quando Usar

**Use esta skill quando**:
- Criar migration scripts (DB → DB, formato A → B)
- Processar dados em lote (100+ registros)
- Gerar relatórios automatizados
- Fazer manutenção de database
- Importar/exportar conteúdo
- Analisar métricas do codebase
- Setup de cron jobs

---

## 📦 Script Types

### 1. Data Migration
- Migrar dados entre schemas
- Transformar formato de dados
- Backfill campos novos

### 2. Analysis & Reporting
- Metrics do codebase
- Usage reports
- Database stats

### 3. Content Processing
- Bulk import de artigos
- Regenerar slugs/summaries
- Atualizar metadados

### 4. Database Maintenance
- Cleanup de dados órfãos
- Reindex tables
- Vacuum/optimize

### 5. Deployment & Build
- Pre-deploy checks
- Post-deploy tasks
- Database seeding

---

## 🏗️ Template Base

**Estrutura padrão para TODOS scripts**:

```typescript
#!/usr/bin/env ts-node
/**
 * Script: [nome].ts
 * Purpose: [Descrição em 1 linha]
 * Usage: npx ts-node scripts/[nome].ts [--dry-run] [--limit N]
 *
 * Examples:
 *   npx ts-node scripts/[nome].ts --dry-run      # Preview sem executar
 *   npx ts-node scripts/[nome].ts --limit 10     # Processar apenas 10
 *   npx ts-node scripts/[nome].ts --verbose      # Logs detalhados
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// ========================================
// CONFIGURATION
// ========================================

interface Config {
  dryRun: boolean;     // Preview mode (não modifica dados)
  limit?: number;      // Processar apenas N registros
  verbose: boolean;    // Logs detalhados
}

function parseArgs(): Config {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    limit: args.includes('--limit')
      ? parseInt(args[args.indexOf('--limit') + 1])
      : undefined,
    verbose: args.includes('--verbose') || args.includes('-v')
  };
}

// ========================================
// MAIN LOGIC
// ========================================

async function main() {
  const config = parseArgs();

  console.log('🚀 Starting:', process.argv[1]);
  console.log('📋 Config:', config);

  try {
    // Fetch records
    const records = await prisma.MODEL.findMany({
      take: config.limit,
      where: { /* critérios */ }
    });

    console.log(`✅ Found ${records.length} records`);

    // Process each
    let processed = 0;
    let errors = 0;

    for (const record of records) {
      try {
        if (config.verbose) {
          console.log(`Processing: ${record.id}`);
        }

        // LOGIC HERE
        if (!config.dryRun) {
          await prisma.MODEL.update({
            where: { id: record.id },
            data: { /* updates */ }
          });
        }

        processed++;
      } catch (error) {
        errors++;
        console.error(`❌ Error processing ${record.id}:`, error);
      }
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`  ✅ Processed: ${processed}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log(`  🏷️  Mode: ${config.dryRun ? 'DRY RUN' : 'LIVE'}`);

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// ========================================
// RUN
// ========================================

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 🎯 Patterns Library

### Pattern 1: Bulk Update

**Use quando**: Atualizar campo em múltiplos registros

```typescript
// Atualizar 1000 artigos de uma vez
const updated = await prisma.article.updateMany({
  where: { published: false },
  data: { status: 'DRAFT' }
});

console.log(`Updated ${updated.count} articles`);
```

### Pattern 2: Batch Processing (Chunked)

**Use quando**: Processar muitos registros sem estourar memória

```typescript
const BATCH_SIZE = 100;
let offset = 0;
let hasMore = true;

while (hasMore) {
  const batch = await prisma.article.findMany({
    take: BATCH_SIZE,
    skip: offset
  });

  if (batch.length === 0) {
    hasMore = false;
    break;
  }

  // Process batch
  for (const item of batch) {
    await processItem(item);
  }

  offset += BATCH_SIZE;
  console.log(`Processed ${offset} total...`);
}
```

### Pattern 3: Transaction (Atomic)

**Use quando**: Operações que DEVEM todas suceder ou todas falhar

```typescript
await prisma.$transaction(async (tx) => {
  // Deletar artigo
  await tx.article.delete({ where: { id: articleId } });

  // Deletar comments órfãos
  await tx.comment.deleteMany({ where: { articleId } });

  // Log activity
  await tx.activity.create({
    data: { action: 'ARTICLE_DELETED', articleId }
  });
});
```

### Pattern 4: Progress Reporting

**Use quando**: Scripts longos (>30seg) precisam feedback

```typescript
const total = await prisma.article.count();
let processed = 0;

for (const article of articles) {
  await processArticle(article);
  processed++;

  // Progress bar
  if (processed % 10 === 0) {
    const percent = (processed / total * 100).toFixed(1);
    console.log(`[${percent}%] ${processed}/${total}`);
  }
}
```

### Pattern 5: Error Recovery (Resilient)

**Use quando**: Script pode falhar parcialmente mas deve continuar

```typescript
const failed: string[] = [];

for (const item of items) {
  try {
    await processItem(item);
  } catch (error) {
    console.error(`Failed ${item.id}:`, error.message);
    failed.push(item.id);
    // Continua processando outros
  }
}

// Report failures no final
if (failed.length > 0) {
  console.warn(`\n⚠️  ${failed.length} items failed:`);
  console.warn(failed.join(', '));
}
```

---

## ⚡ Best Practices

### 1. SEMPRE Incluir --dry-run

```typescript
if (config.dryRun) {
  console.log('DRY RUN - Preview only');
  // Mostrar o que FARIA sem executar
  return;
}
```

**Por quê**: Previne acidentes (deletar DB prod, etc.)

### 2. SEMPRE Usar Transactions para Multi-Step

```typescript
// ❌ RUIM - Pode falhar no meio
await prisma.user.delete({ where: { id } });
await prisma.article.deleteMany({ where: { authorId: id } });

// ✅ BOM - Atômico
await prisma.$transaction([
  prisma.user.delete({ where: { id } }),
  prisma.article.deleteMany({ where: { authorId: id } })
]);
```

### 3. SEMPRE Log Resumo no Final

```typescript
console.log('\n📊 Summary:');
console.log(`  Total: ${total}`);
console.log(`  ✅ Success: ${success}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  ⏱️  Duration: ${duration}ms`);
```

### 4. NUNCA Hardcode Valores

```typescript
// ❌ RUIM
const API_KEY = 'sk-abc123...';

// ✅ BOM
const API_KEY = process.env.PERPLEXITY_API_KEY;
if (!API_KEY) throw new Error('Missing PERPLEXITY_API_KEY');
```

### 5. SEMPRE Disconnect Prisma

```typescript
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 🛠️ CLI Helpers

### Argumentos Comuns

```typescript
// Parsing avançado
function parseArgs() {
  const args = process.argv.slice(2);

  return {
    dryRun: args.includes('--dry-run'),
    limit: getArgValue(args, '--limit', parseInt),
    model: getArgValue(args, '--model'),
    verbose: args.includes('-v') || args.includes('--verbose'),
    force: args.includes('--force')
  };
}

function getArgValue<T>(
  args: string[],
  flag: string,
  parser: (v: string) => T = (v) => v as T
): T | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return parser(args[index + 1]);
}
```

### Validação de Args

```typescript
function validateConfig(config: Config) {
  if (config.limit && config.limit < 1) {
    throw new Error('--limit must be positive');
  }

  if (!config.dryRun && !config.force) {
    throw new Error('Use --force for LIVE mode (or --dry-run for preview)');
  }
}
```

---

## 📚 Exemplos de Scripts Reais

**Scripts já criados no projeto** (ver `scripts/` directory):

1. **migrate-slugs.ts** - Regenerar slugs únicos
2. **backfill-summaries.ts** - Gerar summaries com IA
3. **cleanup-orphans.ts** - Deletar records órfãos
4. **export-articles.ts** - Exportar para JSON/CSV
5. **import-articles.ts** - Importar bulk de JSON
6. **analyze-coverage.ts** - Métricas de test coverage
7. **seed-database.ts** - Popular DB com dados fake

**Como usar como referência**:
```bash
# Ler script existente
cat scripts/migrate-slugs.ts

# Copiar como template
cp scripts/migrate-slugs.ts scripts/my-new-script.ts
```

---

## 🐛 Debugging Scripts

### Técnica 1: Verbose Logging

```typescript
if (config.verbose) {
  console.log('🔍 Debug:', {
    recordId: record.id,
    before: record.status,
    after: newStatus,
    metadata: record.metadata
  });
}
```

### Técnica 2: Dry-Run First

```bash
# Sempre testar com dry-run ANTES
npx ts-node scripts/my-script.ts --dry-run --limit 5

# Se OK, rodar de verdade
npx ts-node scripts/my-script.ts --limit 5

# Se ainda OK, rodar sem limit
npx ts-node scripts/my-script.ts
```

### Técnica 3: Small Batch Test

```typescript
// Testar com 1 registro primeiro
if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  TEST MODE: Processing only 1 record');
  records = records.slice(0, 1);
}
```

---

## 📖 Instructions for Claude

When creating scripts using this skill:

1. **Start com template base** (copiar estrutura acima)
2. **Implementar --dry-run** obrigatoriamente
3. **Adicionar progress reporting** se >100 registros
4. **Usar transactions** para operações multi-step
5. **Validar env vars** no início
6. **Log summary** no final
7. **Testar com --limit 5** antes de rodar full

**Checklist antes de rodar script**:
- [ ] --dry-run funciona?
- [ ] Testou com --limit 5?
- [ ] Tem backup do DB?
- [ ] Rodando em ambiente correto?
- [ ] Sabe como reverter se der errado?

---

## 🔗 Related Skills

- [`tokenmilagre-database`](./tokenmilagre-database/SKILL.md) - Prisma patterns, migrations
- [`tokenmilagre-testing`](./tokenmilagre-testing/SKILL.md) - Testar scripts
- [`troubleshooting`](../audit/troubleshooting/SKILL.md) - Debug de scripts que falharam

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-17
**Mudanças recentes**:
- ✅ **OTIMIZAÇÃO**: 920 → 460 linhas (-50%)
- ✅ Condensado exemplos completos em patterns reutilizáveis
- ✅ Mantido template base + 5 patterns essenciais
- ✅ Referências a scripts reais no diretório scripts/
- ✅ Best practices e debugging techniques preservados
