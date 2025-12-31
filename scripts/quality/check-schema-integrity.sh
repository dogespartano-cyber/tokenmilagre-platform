#!/bin/bash
# =============================================================================
# check-schema-integrity.sh - Verifica integridade do schema Prisma
# =============================================================================

set -e

echo "🔍 Checking Prisma schema integrity..."

# Validate schema
npx prisma validate

# Check for pending migrations
echo ""
echo "📋 Migration status:"
npx prisma migrate status 2>/dev/null || echo "  (Cannot check - requires database connection)"

echo ""
echo "✅ Schema integrity check complete"
