#!/usr/bin/env tsx
/**
 * Migrate Fallback Knowledge to Graphiti
 *
 * This script migrates all entries from knowledge-fallback.jsonl
 * to the Graphiti knowledge graph database.
 *
 * Usage:
 *   npx tsx scripts/knowledge/migrate-fallback-to-graphiti.ts
 */

import fs from 'fs';
import path from 'path';

const FALLBACK_FILE = path.join(process.cwd(), 'Feedback/logs/knowledge-fallback.jsonl');
const GRAPHITI_URL = 'http://localhost:8000';

interface FallbackEntry {
  type: string;
  text: string;
  source: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

async function addToGraphiti(entry: FallbackEntry): Promise<boolean> {
  try {
    const response = await fetch(`${GRAPHITI_URL}/add-episode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: entry.source || 'system',
        text: entry.text,
        metadata: {
          type: entry.type,
          timestamp: entry.timestamp,
          ...entry.metadata,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to add entry: ${error}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Network error:`, error);
    return false;
  }
}

async function checkGraphitiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${GRAPHITI_URL}/health`);
    if (!response.ok) {
      console.error('❌ Graphiti is not healthy');
      return false;
    }

    const health = await response.json();
    if (!health.graphiti_ready) {
      console.error('❌ Graphiti is not ready (FalkorDB connection issue?)');
      return false;
    }

    console.log('✅ Graphiti is healthy and ready');
    return true;
  } catch (error) {
    console.error('❌ Cannot connect to Graphiti:', error);
    return false;
  }
}

async function migrate() {
  console.log('🚀 Starting fallback → Graphiti migration\n');

  // Check if fallback file exists
  if (!fs.existsSync(FALLBACK_FILE)) {
    console.error(`❌ Fallback file not found: ${FALLBACK_FILE}`);
    process.exit(1);
  }

  // Check Graphiti health
  console.log('🔍 Checking Graphiti health...');
  const isHealthy = await checkGraphitiHealth();
  if (!isHealthy) {
    console.error('\n❌ Migration aborted: Graphiti is not available');
    process.exit(1);
  }

  // Read fallback file
  console.log(`\n📖 Reading fallback file: ${FALLBACK_FILE}`);
  const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  console.log(`📦 Found ${lines.length} entries to migrate\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    try {
      const entry: FallbackEntry = JSON.parse(line);

      console.log(`[${i + 1}/${lines.length}] Migrating: ${entry.type} - ${new Date(entry.timestamp).toLocaleString()}`);
      console.log(`   Text preview: ${entry.text.substring(0, 80)}...`);

      const result = await addToGraphiti(entry);

      if (result) {
        success++;
        console.log(`   ✅ Success\n`);
      } else {
        failed++;
        console.log(`   ❌ Failed\n`);
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      failed++;
      console.error(`   ❌ Error parsing entry:`, error);
      console.error(`   Raw line: ${line}\n`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total entries: ${lines.length}`);
  console.log(`✅ Successful: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60));

  if (success > 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify data: curl -X POST http://localhost:8000/search -H "Content-Type: application/json" -d \'{"query":"","limit":10}\'');
    console.log('   2. Force save: podman exec falkordb redis-cli SAVE');
    process.exit(0);
  } else {
    console.log('\n❌ Migration failed - no entries were migrated');
    process.exit(1);
  }
}

// Run migration
migrate().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
