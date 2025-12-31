#!/bin/bash
# =============================================================================
# run-all-checks.sh - Executa todas as verificações de qualidade
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FAST_MODE=false
if [ "$1" == "--fast" ]; then
    FAST_MODE=true
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔍 TokenMilagre Quality Checks                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

FAILED=0

# 1. TypeScript check
echo -e "${YELLOW}[1/5] TypeScript type check...${NC}"
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ TypeScript OK${NC}"
else
    echo -e "${RED}  ❌ TypeScript errors found${NC}"
    FAILED=$((FAILED + 1))
fi

# 2. ESLint
echo -e "${YELLOW}[2/5] ESLint...${NC}"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ ESLint OK${NC}"
else
    echo -e "${RED}  ❌ ESLint errors found${NC}"
    FAILED=$((FAILED + 1))
fi

# 3. Prisma validate
echo -e "${YELLOW}[3/5] Prisma schema validation...${NC}"
if npx prisma validate > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Prisma schema OK${NC}"
else
    echo -e "${RED}  ❌ Prisma schema errors${NC}"
    FAILED=$((FAILED + 1))
fi

# 4. Tests (skip in fast mode)
if [ "$FAST_MODE" = false ]; then
    echo -e "${YELLOW}[4/5] Running tests...${NC}"
    if npm test -- --passWithNoTests > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Tests passed${NC}"
    else
        echo -e "${RED}  ❌ Tests failed${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}[4/5] Tests skipped (fast mode)${NC}"
fi

# 5. Build check (skip in fast mode)
if [ "$FAST_MODE" = false ]; then
    echo -e "${YELLOW}[5/5] Build check...${NC}"
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Build OK${NC}"
    else
        echo -e "${RED}  ❌ Build failed${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}[5/5] Build skipped (fast mode)${NC}"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ All quality checks passed!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ❌ $FAILED check(s) failed${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    exit 1
fi
