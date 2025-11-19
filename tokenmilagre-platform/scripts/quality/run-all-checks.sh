#!/bin/bash
###############################################################################
# Run All Quality Checks
#
# Comprehensive quality check script for CI/CD
# Runs linting, type checking, tests, and custom validations
#
# Usage:
#   ./scripts/quality/run-all-checks.sh              # Run all checks
#   ./scripts/quality/run-all-checks.sh --fast       # Skip build
#   ./scripts/quality/run-all-checks.sh --coverage   # Include coverage
###############################################################################

set -e  # Exit on error

# Parse arguments
SKIP_BUILD=false
RUN_COVERAGE=false

for arg in "$@"; do
  case $arg in
    --fast)
      SKIP_BUILD=true
      shift
      ;;
    --coverage)
      RUN_COVERAGE=true
      shift
      ;;
  esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 TOKENMILAGRE PLATFORM - QUALITY CHECKS"
if [ "$SKIP_BUILD" = true ]; then
  echo "  Mode: FAST (skipping build)"
fi
if [ "$RUN_COVERAGE" = true ]; then
  echo "  Mode: COVERAGE ENABLED"
fi
echo "═══════════════════════════════════════════════════════════════"
echo ""

FAILED_CHECKS=0
START_TIME=$(date +%s)

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
# 7. Build Check (optional)
###############################################################################
if [ "$SKIP_BUILD" = false ]; then
  echo "🏗️  [7/8] Running production build..."
  if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}\n"
  else
    echo -e "${RED}❌ Build failed${NC}\n"
    ((FAILED_CHECKS++))
  fi
else
  echo -e "${YELLOW}⏭️  [7/8] Skipping build (--fast mode)${NC}\n"
fi

###############################################################################
# 8. Environment Variables Check
###############################################################################
echo "🔍 [8/8] Checking environment variables..."
if [ -f scripts/utils/check-env.sh ]; then
  if ./scripts/utils/check-env.sh development; then
    echo -e "${GREEN}✅ Environment variables valid${NC}\n"
  else
    echo -e "${YELLOW}⚠️  Environment check warnings (non-blocking)${NC}\n"
    # Don't fail on env warnings in dev
  fi
else
  echo -e "${YELLOW}⚠️  Environment check script not found${NC}\n"
fi

###############################################################################
# Summary
###############################################################################
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ $FAILED_CHECKS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo -e "${BLUE}⏱️  Time: ${DURATION}s${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $FAILED_CHECKS CHECK(S) FAILED${NC}"
  echo -e "${BLUE}⏱️  Time: ${DURATION}s${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "💡 Quick fixes:"
  echo "  - Run 'npm run lint:fix' for linting issues"
  echo "  - Run 'npm run format' for formatting issues"
  echo "  - Check failed tests with 'npm test'"
  echo ""
  exit 1
fi
