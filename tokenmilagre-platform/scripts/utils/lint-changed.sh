#!/bin/bash
###############################################################################
# Lint Changed Files
#
# Runs ESLint and TypeScript checks only on changed files
# Useful for pre-commit hooks and incremental CI/CD
#
# Usage:
#   ./scripts/utils/lint-changed.sh              # Check staged files
#   ./scripts/utils/lint-changed.sh --all        # Check all uncommitted
#   ./scripts/utils/lint-changed.sh main         # Check vs branch
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔍 LINT CHANGED FILES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Determine which files to check
if [ "$1" = "--all" ]; then
  echo -e "${BLUE}Mode: All uncommitted files${NC}\n"
  FILES=$(git diff --name-only HEAD | grep -E '\.(ts|tsx|js|jsx)$' || true)
elif [ -n "$1" ]; then
  echo -e "${BLUE}Mode: Comparing with branch '$1'${NC}\n"
  FILES=$(git diff --name-only "$1"...HEAD | grep -E '\.(ts|tsx|js|jsx)$' || true)
else
  echo -e "${BLUE}Mode: Staged files only${NC}\n"
  FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx|js|jsx)$' || true)
fi

# Check if there are files to lint
if [ -z "$FILES" ]; then
  echo -e "${YELLOW}⚠️  No TypeScript/JavaScript files changed${NC}"
  echo ""
  exit 0
fi

# Count files
FILE_COUNT=$(echo "$FILES" | wc -l)
echo -e "${GREEN}Found $FILE_COUNT file(s) to check:${NC}"
echo "$FILES" | sed 's/^/  - /'
echo ""

# Convert to array
FILES_ARRAY=($FILES)

###############################################################################
# 1. ESLint
###############################################################################
echo "📝 Running ESLint on changed files..."
ESLINT_FAILED=0

if npx eslint "${FILES_ARRAY[@]}" 2>&1; then
  echo -e "${GREEN}✅ ESLint passed${NC}\n"
else
  echo -e "${RED}❌ ESLint failed${NC}\n"
  ESLINT_FAILED=1
fi

###############################################################################
# 2. TypeScript Type Check (only .ts/.tsx files)
###############################################################################
TS_FILES=$(echo "$FILES" | grep -E '\.(ts|tsx)$' || true)

if [ -n "$TS_FILES" ]; then
  echo "📝 Running TypeScript check on changed files..."

  # Create temporary tsconfig that includes only changed files
  TEMP_TSCONFIG=$(mktemp)
  cat > "$TEMP_TSCONFIG" << EOF
{
  "extends": "./tsconfig.json",
  "include": [
$(echo "$TS_FILES" | sed 's/^/    "/' | sed 's/$/",/')
  ]
}
EOF

  TSC_FAILED=0
  if npx tsc --noEmit --project "$TEMP_TSCONFIG" 2>&1; then
    echo -e "${GREEN}✅ TypeScript check passed${NC}\n"
  else
    echo -e "${RED}❌ TypeScript check failed${NC}\n"
    TSC_FAILED=1
  fi

  rm -f "$TEMP_TSCONFIG"
else
  echo -e "${YELLOW}⚠️  No TypeScript files to check${NC}\n"
  TSC_FAILED=0
fi

###############################################################################
# Summary
###############################################################################
echo "═══════════════════════════════════════════════════════════════"

TOTAL_FAILED=$((ESLINT_FAILED + TSC_FAILED))

if [ $TOTAL_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED ($FILE_COUNT files)${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $TOTAL_FAILED CHECK(S) FAILED${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "💡 Tips:"
  echo "  - Run 'npm run lint:fix' to auto-fix ESLint errors"
  echo "  - Check TypeScript errors in your editor"
  echo ""
  exit 1
fi
