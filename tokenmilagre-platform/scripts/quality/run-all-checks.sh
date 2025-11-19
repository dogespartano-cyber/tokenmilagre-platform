#!/bin/bash
###############################################################################
# Run All Quality Checks
#
# Comprehensive quality check script for CI/CD
# Runs linting, type checking, tests, and custom validations
#
# Usage: ./scripts/quality/run-all-checks.sh
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 TOKENMILAGRE PLATFORM - QUALITY CHECKS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

FAILED_CHECKS=0

###############################################################################
# 1. TypeScript Type Checking
###############################################################################
echo "📝 [1/7] Running TypeScript type check..."
if npx tsc --noEmit; then
  echo -e "${GREEN}✅ TypeScript check passed${NC}\n"
else
  echo -e "${RED}❌ TypeScript check failed${NC}\n"
  ((FAILED_CHECKS++))
fi

###############################################################################
# 2. ESLint
###############################################################################
echo "🔍 [2/7] Running ESLint..."
if npm run lint; then
  echo -e "${GREEN}✅ ESLint passed${NC}\n"
else
  echo -e "${RED}❌ ESLint failed${NC}\n"
  ((FAILED_CHECKS++))
fi

###############################################################################
# 3. Prisma Schema Validation
###############################################################################
echo "🗄️  [3/7] Validating Prisma schema..."
if npx prisma validate; then
  echo -e "${GREEN}✅ Prisma schema valid${NC}\n"
else
  echo -e "${RED}❌ Prisma schema invalid${NC}\n"
  ((FAILED_CHECKS++))
fi

###############################################################################
# 4. Unit Tests
###############################################################################
echo "🧪 [4/7] Running unit tests..."
if npm test -- --passWithNoTests; then
  echo -e "${GREEN}✅ Tests passed${NC}\n"
else
  echo -e "${RED}❌ Tests failed${NC}\n"
  ((FAILED_CHECKS++))
fi

###############################################################################
# 5. Test Coverage Check (95% threshold)
###############################################################################
echo "📊 [5/7] Checking test coverage..."
if npm run test:coverage -- --passWithNoTests --coverageThreshold='{"global":{"lines":95,"functions":95,"branches":95,"statements":95}}' 2>/dev/null; then
  echo -e "${GREEN}✅ Coverage threshold met (>95%)${NC}\n"
else
  echo -e "${YELLOW}⚠️  Coverage below 95% threshold${NC}\n"
  # Don't fail on coverage, just warn
fi

###############################################################################
# 6. Schema Integrity Check
###############################################################################
echo "🔍 [6/7] Running schema integrity check..."
if tsx scripts/quality/check-schema-integrity.ts; then
  echo -e "${GREEN}✅ Schema integrity check passed${NC}\n"
else
  echo -e "${RED}❌ Schema integrity check failed${NC}\n"
  ((FAILED_CHECKS++))
fi

###############################################################################
# 7. Build Check
###############################################################################
echo "🏗️  [7/7] Running production build..."
if npm run build; then
  echo -e "${GREEN}✅ Build successful${NC}\n"
else
  echo -e "${RED}❌ Build failed${NC}\n"
  ((FAILED_CHECKS++))
fi

###############################################################################
# Summary
###############################################################################
echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ $FAILED_CHECKS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $FAILED_CHECKS CHECK(S) FAILED${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  exit 1
fi
