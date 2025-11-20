#!/bin/bash
###############################################################################
# Database Backup/Restore Utility
#
# Automated backup and restore for local and staging databases
# Supports PostgreSQL via pg_dump and psql
#
# Usage:
#   ./scripts/utils/backup-db.sh backup [local|staging]
#   ./scripts/utils/backup-db.sh restore [local|staging] [backup-file]
#   ./scripts/utils/backup-db.sh list
#
# Examples:
#   ./scripts/utils/backup-db.sh backup local
#   ./scripts/utils/backup-db.sh restore local backup-20250119-143022.sql
#   ./scripts/utils/backup-db.sh list
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups/db"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

###############################################################################
# Helper Functions
###############################################################################

show_usage() {
  echo "Usage: $0 [backup|restore|list] [environment] [file]"
  echo ""
  echo "Commands:"
  echo "  backup [local|staging]           Create database backup"
  echo "  restore [local|staging] [file]   Restore from backup"
  echo "  list                             List available backups"
  echo ""
  echo "Examples:"
  echo "  $0 backup local"
  echo "  $0 restore staging backup-20250119-143022.sql"
  echo "  $0 list"
  echo ""
}

get_db_url() {
  local env=$1

  # Load .env file if exists
  if [ -f .env ]; then
    set -a
    source .env
    set +a
  fi

  case $env in
    local)
      if [ -n "$DATABASE_URL" ]; then
        echo "$DATABASE_URL"
      elif [ -n "$POSTGRES_PRISMA_URL" ]; then
        echo "$POSTGRES_PRISMA_URL"
      else
        echo ""
      fi
      ;;
    staging)
      if [ -n "$STAGING_DATABASE_URL" ]; then
        echo "$STAGING_DATABASE_URL"
      elif [ -n "$SUPABASE_POSTGRES_PRISMA_URL" ]; then
        echo "$SUPABASE_POSTGRES_PRISMA_URL"
      else
        echo ""
      fi
      ;;
    *)
      echo ""
      ;;
  esac
}

###############################################################################
# Backup Function
###############################################################################

backup_database() {
  local env=$1

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  💾 DATABASE BACKUP - ${env^^}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  # Get database URL
  DB_URL=$(get_db_url "$env")

  if [ -z "$DB_URL" ]; then
    echo -e "${RED}❌ Error: No database URL found for environment '$env'${NC}"
    echo ""
    echo "Set one of these environment variables:"
    if [ "$env" = "local" ]; then
      echo "  - DATABASE_URL"
      echo "  - POSTGRES_PRISMA_URL"
    else
      echo "  - STAGING_DATABASE_URL"
      echo "  - SUPABASE_POSTGRES_PRISMA_URL"
    fi
    echo ""
    exit 1
  fi

  # Generate backup filename
  BACKUP_FILE="$BACKUP_DIR/backup-${env}-${TIMESTAMP}.sql"

  echo -e "${BLUE}Database: $env${NC}"
  echo -e "${BLUE}Backup file: $BACKUP_FILE${NC}"
  echo ""

  # Perform backup
  echo "📦 Creating backup..."

  if command -v pg_dump &> /dev/null; then
    if pg_dump "$DB_URL" > "$BACKUP_FILE" 2>/dev/null; then
      BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
      echo -e "${GREEN}✅ Backup created successfully${NC}"
      echo -e "${GREEN}   Size: $BACKUP_SIZE${NC}"
      echo -e "${GREEN}   File: $BACKUP_FILE${NC}"
      echo ""

      # Create latest symlink
      ln -sf "$(basename "$BACKUP_FILE")" "$BACKUP_DIR/latest-${env}.sql"
      echo "🔗 Created symlink: $BACKUP_DIR/latest-${env}.sql"
    else
      echo -e "${RED}❌ Backup failed${NC}"
      rm -f "$BACKUP_FILE"
      exit 1
    fi
  else
    echo -e "${RED}❌ Error: pg_dump not found${NC}"
    echo "Install PostgreSQL client tools:"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  - macOS: brew install postgresql"
    echo ""
    exit 1
  fi

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
}

###############################################################################
# Restore Function
###############################################################################

restore_database() {
  local env=$1
  local backup_file=$2

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  🔄 DATABASE RESTORE - ${env^^}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  # Check if backup file exists
  if [ ! -f "$backup_file" ]; then
    # Try in backup directory
    if [ -f "$BACKUP_DIR/$backup_file" ]; then
      backup_file="$BACKUP_DIR/$backup_file"
    else
      echo -e "${RED}❌ Error: Backup file not found: $backup_file${NC}"
      echo ""
      echo "Available backups:"
      list_backups
      exit 1
    fi
  fi

  # Get database URL
  DB_URL=$(get_db_url "$env")

  if [ -z "$DB_URL" ]; then
    echo -e "${RED}❌ Error: No database URL found for environment '$env'${NC}"
    exit 1
  fi

  echo -e "${BLUE}Database: $env${NC}"
  echo -e "${BLUE}Backup file: $backup_file${NC}"
  echo ""

  # Warning
  echo -e "${YELLOW}⚠️  WARNING: This will overwrite the current database!${NC}"
  read -p "Are you sure you want to continue? (yes/no): " -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Restore cancelled."
    echo ""
    exit 0
  fi

  # Perform restore
  echo "🔄 Restoring database..."

  if command -v psql &> /dev/null; then
    if psql "$DB_URL" < "$backup_file" 2>/dev/null; then
      echo -e "${GREEN}✅ Database restored successfully${NC}"
    else
      echo -e "${RED}❌ Restore failed${NC}"
      exit 1
    fi
  else
    echo -e "${RED}❌ Error: psql not found${NC}"
    echo "Install PostgreSQL client tools."
    exit 1
  fi

  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
}

###############################################################################
# List Backups Function
###############################################################################

list_backups() {
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "  📋 AVAILABLE BACKUPS"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
    echo -e "${YELLOW}No backups found${NC}"
    echo ""
    return
  fi

  # List backup files with details
  ls -lh "$BACKUP_DIR"/*.sql 2>/dev/null | awk '{
    size = $5
    file = $9
    split(file, parts, "/")
    filename = parts[length(parts)]
    printf "  📦 %-40s %8s\n", filename, size
  }' || echo -e "${YELLOW}No backups found${NC}"

  echo ""
}

###############################################################################
# Main
###############################################################################

COMMAND=${1:-}
ENV=${2:-}
FILE=${3:-}

case $COMMAND in
  backup)
    if [ -z "$ENV" ]; then
      echo -e "${RED}Error: Environment required (local|staging)${NC}"
      show_usage
      exit 1
    fi
    backup_database "$ENV"
    ;;
  restore)
    if [ -z "$ENV" ] || [ -z "$FILE" ]; then
      echo -e "${RED}Error: Environment and backup file required${NC}"
      show_usage
      exit 1
    fi
    restore_database "$ENV" "$FILE"
    ;;
  list)
    list_backups
    ;;
  *)
    show_usage
    exit 1
    ;;
esac
