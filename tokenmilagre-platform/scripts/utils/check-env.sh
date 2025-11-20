#!/bin/bash
###############################################################################
# Environment Variables Sanity Check
#
# Validates required environment variables before deployment
# Supports multiple environments (development, staging, production)
#
# Usage:
#   ./scripts/utils/check-env.sh [development|staging|production]
#   ./scripts/utils/check-env.sh                    # Auto-detect from NODE_ENV
#
# Examples:
#   ./scripts/utils/check-env.sh production
#   NODE_ENV=production ./scripts/utils/check-env.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Determine environment
ENV=${1:-${NODE_ENV:-development}}

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔍 ENVIRONMENT VARIABLES SANITY CHECK"
echo "  Environment: ${ENV^^}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Load .env file if exists
if [ -f .env ]; then
  echo -e "${BLUE}Loading .env file...${NC}\n"
  set -a
  source .env
  set +a
fi

###############################################################################
# Define Required Variables by Environment
###############################################################################

# Common variables (all environments)
COMMON_VARS=(
  "DATABASE_URL:Database connection URL"
  "NEXTAUTH_SECRET:NextAuth secret key"
  "NEXTAUTH_URL:NextAuth callback URL"
)

# Development-specific
DEV_VARS=(
  "DIRECT_URL:Direct database connection (for migrations)"
)

# Staging-specific
STAGING_VARS=(
  "DIRECT_URL:Direct database connection"
  "STAGING_DATABASE_URL:Staging database URL"
  "VERCEL_ENV:Vercel environment"
)

# Production-specific
PROD_VARS=(
  "DIRECT_URL:Direct database connection"
  "VERCEL_ENV:Vercel environment"
  "SENTRY_DSN:Sentry error tracking DSN"
  "SENTRY_AUTH_TOKEN:Sentry authentication token"
)

# Optional but recommended
OPTIONAL_VARS=(
  "NEXT_PUBLIC_SOLANA_NETWORK:Solana network (mainnet-beta/devnet)"
  "NEXT_PUBLIC_TOKEN_ADDRESS:Token contract address"
  "SENTRY_DSN:Sentry error tracking"
)

###############################################################################
# Validation Functions
###############################################################################

check_var() {
  local var_name=$1
  local var_desc=$2
  local var_value="${!var_name}"

  if [ -n "$var_value" ]; then
    # Mask sensitive values
    if [[ $var_name == *"SECRET"* ]] || [[ $var_name == *"TOKEN"* ]] || [[ $var_name == *"PASSWORD"* ]]; then
      local masked_value="${var_value:0:4}****${var_value: -4}"
      echo -e "${GREEN}✅ $var_name${NC}"
      echo -e "   $var_desc"
      echo -e "   Value: ${masked_value}"
    elif [[ $var_name == *"URL"* ]] || [[ $var_name == *"DSN"* ]]; then
      # Show only protocol and host for URLs
      local masked_url=$(echo "$var_value" | sed -E 's/(\/\/[^:]+:)[^@]+(@)/\1****\2/g')
      echo -e "${GREEN}✅ $var_name${NC}"
      echo -e "   $var_desc"
      echo -e "   Value: ${masked_url}"
    else
      echo -e "${GREEN}✅ $var_name${NC}"
      echo -e "   $var_desc"
      echo -e "   Value: $var_value"
    fi
    return 0
  else
    echo -e "${RED}❌ $var_name${NC}"
    echo -e "   $var_desc"
    echo -e "   ${RED}Missing or empty${NC}"
    return 1
  fi
}

check_optional_var() {
  local var_name=$1
  local var_desc=$2
  local var_value="${!var_name}"

  if [ -n "$var_value" ]; then
    echo -e "${GREEN}✅ $var_name${NC} (optional)"
    echo -e "   $var_desc"
  else
    echo -e "${YELLOW}⚠️  $var_name${NC} (optional)"
    echo -e "   $var_desc"
    echo -e "   ${YELLOW}Not set (recommended for full functionality)${NC}"
  fi
}

###############################################################################
# Main Validation
###############################################################################

FAILED_COUNT=0
TOTAL_COUNT=0

# Check common variables
echo -e "${BLUE}=== Common Variables ===${NC}\n"
for var_entry in "${COMMON_VARS[@]}"; do
  IFS=':' read -r var_name var_desc <<< "$var_entry"
  if ! check_var "$var_name" "$var_desc"; then
    ((FAILED_COUNT++))
  fi
  ((TOTAL_COUNT++))
  echo ""
done

# Check environment-specific variables
case $ENV in
  development)
    echo -e "${BLUE}=== Development Variables ===${NC}\n"
    for var_entry in "${DEV_VARS[@]}"; do
      IFS=':' read -r var_name var_desc <<< "$var_entry"
      if ! check_var "$var_name" "$var_desc"; then
        ((FAILED_COUNT++))
      fi
      ((TOTAL_COUNT++))
      echo ""
    done
    ;;
  staging)
    echo -e "${BLUE}=== Staging Variables ===${NC}\n"
    for var_entry in "${STAGING_VARS[@]}"; do
      IFS=':' read -r var_name var_desc <<< "$var_entry"
      if ! check_var "$var_name" "$var_desc"; then
        ((FAILED_COUNT++))
      fi
      ((TOTAL_COUNT++))
      echo ""
    done
    ;;
  production)
    echo -e "${BLUE}=== Production Variables ===${NC}\n"
    for var_entry in "${PROD_VARS[@]}"; do
      IFS=':' read -r var_name var_desc <<< "$var_entry"
      if ! check_var "$var_name" "$var_desc"; then
        ((FAILED_COUNT++))
      fi
      ((TOTAL_COUNT++))
      echo ""
    done
    ;;
esac

# Check optional variables
echo -e "${BLUE}=== Optional Variables ===${NC}\n"
for var_entry in "${OPTIONAL_VARS[@]}"; do
  IFS=':' read -r var_name var_desc <<< "$var_entry"
  check_optional_var "$var_name" "$var_desc"
  echo ""
done

###############################################################################
# Database Connection Test
###############################################################################

echo -e "${BLUE}=== Database Connection Test ===${NC}\n"

if [ -n "$DATABASE_URL" ]; then
  echo "Testing database connection..."

  # Try to connect using psql or prisma
  if command -v psql &> /dev/null; then
    if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
      echo -e "${GREEN}✅ Database connection successful${NC}\n"
    else
      echo -e "${RED}❌ Database connection failed${NC}\n"
      ((FAILED_COUNT++))
    fi
  elif command -v npx &> /dev/null; then
    if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
      echo -e "${GREEN}✅ Database connection successful${NC}\n"
    else
      echo -e "${YELLOW}⚠️  Could not verify database connection${NC}\n"
    fi
  else
    echo -e "${YELLOW}⚠️  No database client available to test connection${NC}\n"
  fi
else
  echo -e "${YELLOW}⚠️  DATABASE_URL not set, skipping connection test${NC}\n"
fi

###############################################################################
# Security Checks
###############################################################################

echo -e "${BLUE}=== Security Checks ===${NC}\n"

# Check NEXTAUTH_SECRET strength
if [ -n "$NEXTAUTH_SECRET" ]; then
  SECRET_LENGTH=${#NEXTAUTH_SECRET}
  if [ $SECRET_LENGTH -lt 32 ]; then
    echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET is too short ($SECRET_LENGTH chars)${NC}"
    echo -e "   Recommended: 32+ characters\n"
  else
    echo -e "${GREEN}✅ NEXTAUTH_SECRET has adequate length ($SECRET_LENGTH chars)${NC}\n"
  fi
fi

# Check for development secrets in production
if [ "$ENV" = "production" ]; then
  if [[ $NEXTAUTH_SECRET == *"development"* ]] || [[ $NEXTAUTH_SECRET == "secret" ]]; then
    echo -e "${RED}❌ Using development secret in production!${NC}\n"
    ((FAILED_COUNT++))
  fi
fi

###############################################################################
# Summary
###############################################################################

echo "═══════════════════════════════════════════════════════════════"

PASSED_COUNT=$((TOTAL_COUNT - FAILED_COUNT))

if [ $FAILED_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ ALL REQUIRED CHECKS PASSED ($PASSED_COUNT/$TOTAL_COUNT)${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $FAILED_COUNT REQUIRED CHECK(S) FAILED ($PASSED_COUNT/$TOTAL_COUNT passed)${NC}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "💡 Tips:"
  echo "  - Copy .env.example to .env and fill in the values"
  echo "  - Use strong, randomly generated secrets"
  echo "  - Never commit .env files to version control"
  echo "  - Use Vercel environment variables for production"
  echo ""
  exit 1
fi
