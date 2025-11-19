#!/bin/bash
###############################################################################
# Dependency Audit & Update Helper
#
# Performs security audit and helps with dependency updates
# Useful for regular maintenance and security compliance
#
# Usage:
#   ./scripts/utils/audit-deps.sh audit         # Security audit
#   ./scripts/utils/audit-deps.sh outdated      # Check outdated packages
#   ./scripts/utils/audit-deps.sh fix           # Auto-fix vulnerabilities
#   ./scripts/utils/audit-deps.sh report        # Generate report
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

COMMAND=${1:-audit}

###############################################################################
# Functions
###############################################################################

audit_dependencies() {
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  🔍 SECURITY AUDIT"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  # Run npm audit
  echo "Running npm audit..."
  echo ""

  if npm audit --audit-level=moderate 2>&1; then
    echo ""
    echo -e "${GREEN}✅ No moderate or higher vulnerabilities found${NC}"
  else
    AUDIT_EXIT_CODE=$?
    echo ""
    echo -e "${YELLOW}⚠️  Vulnerabilities detected${NC}"

    # Get counts
    AUDIT_JSON=$(npm audit --json 2>/dev/null || echo '{}')

    if command -v jq &> /dev/null; then
      INFO=$(echo "$AUDIT_JSON" | jq -r '.metadata.vulnerabilities.info // 0')
      LOW=$(echo "$AUDIT_JSON" | jq -r '.metadata.vulnerabilities.low // 0')
      MODERATE=$(echo "$AUDIT_JSON" | jq -r '.metadata.vulnerabilities.moderate // 0')
      HIGH=$(echo "$AUDIT_JSON" | jq -r '.metadata.vulnerabilities.high // 0')
      CRITICAL=$(echo "$AUDIT_JSON" | jq -r '.metadata.vulnerabilities.critical // 0')

      echo ""
      echo "Summary:"
      echo "  Info:     $INFO"
      echo "  Low:      $LOW"
      echo "  Moderate: $MODERATE"
      echo "  High:     $HIGH"
      echo "  Critical: $CRITICAL"
      echo ""

      if [ "$CRITICAL" -gt 0 ]; then
        echo -e "${RED}❌ CRITICAL vulnerabilities found! Fix immediately.${NC}"
        echo "Run: npm run audit:fix"
      elif [ "$HIGH" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  HIGH vulnerabilities found. Fix recommended.${NC}"
        echo "Run: npm run audit:fix"
      fi
    fi

    return $AUDIT_EXIT_CODE
  fi

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
}

check_outdated() {
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  📦 OUTDATED PACKAGES"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  echo "Checking for outdated packages..."
  echo ""

  npm outdated || true

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "💡 Tips:"
  echo "  - Update packages: npm update"
  echo "  - Update specific: npm update <package-name>"
  echo "  - Major updates: npm install <package>@latest"
  echo ""
}

fix_vulnerabilities() {
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  🔧 FIX VULNERABILITIES"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  echo -e "${YELLOW}⚠️  This will attempt to automatically fix vulnerabilities${NC}"
  echo -e "${YELLOW}   by updating dependencies.${NC}"
  echo ""
  read -p "Continue? (yes/no): " -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Cancelled."
    exit 0
  fi

  echo "Running npm audit fix..."
  echo ""

  if npm audit fix; then
    echo ""
    echo -e "${GREEN}✅ Vulnerabilities fixed${NC}"
  else
    echo ""
    echo -e "${YELLOW}⚠️  Some vulnerabilities could not be auto-fixed${NC}"
    echo ""
    echo "Try:"
    echo "  - npm audit fix --force  (may introduce breaking changes)"
    echo "  - Manual package updates"
  fi

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
}

generate_report() {
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  📊 GENERATING DEPENDENCY REPORT"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  REPORT_DIR="./reports"
  TIMESTAMP=$(date +%Y%m%d-%H%M%S)
  REPORT_FILE="$REPORT_DIR/dependency-report-${TIMESTAMP}.txt"

  mkdir -p "$REPORT_DIR"

  echo "Generating report..."
  echo ""

  {
    echo "═══════════════════════════════════════════════════════════════"
    echo "  DEPENDENCY REPORT - $(date)"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""

    echo "=== SECURITY AUDIT ==="
    echo ""
    npm audit || true
    echo ""

    echo "=== OUTDATED PACKAGES ==="
    echo ""
    npm outdated || true
    echo ""

    echo "=== DEPENDENCY TREE (TOP LEVEL) ==="
    echo ""
    npm list --depth=0 || true
    echo ""

    echo "═══════════════════════════════════════════════════════════════"
  } > "$REPORT_FILE"

  echo -e "${GREEN}✅ Report generated${NC}"
  echo ""
  echo "File: $REPORT_FILE"
  echo "Size: $(du -h "$REPORT_FILE" | cut -f1)"
  echo ""

  # Also save JSON version
  REPORT_JSON="$REPORT_DIR/dependency-report-${TIMESTAMP}.json"
  npm audit --json > "$REPORT_JSON" 2>/dev/null || echo '{}' > "$REPORT_JSON"

  echo "JSON: $REPORT_JSON"
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
}

###############################################################################
# Main
###############################################################################

case $COMMAND in
  audit)
    audit_dependencies
    ;;
  outdated)
    check_outdated
    ;;
  fix)
    fix_vulnerabilities
    ;;
  report)
    generate_report
    ;;
  *)
    echo "Usage: $0 [audit|outdated|fix|report]"
    echo ""
    echo "Commands:"
    echo "  audit     - Run security audit"
    echo "  outdated  - Check for outdated packages"
    echo "  fix       - Auto-fix vulnerabilities"
    echo "  report    - Generate detailed report"
    echo ""
    exit 1
    ;;
esac
