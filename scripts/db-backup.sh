#!/bin/bash
# =============================================================================
# db-backup.sh - Backup automático do banco Supabase
# =============================================================================

set -e

BACKUP_DIR="/home/zenfoco/Documentos/Backup Supabase"
# Formato legível: "Banco de dados - dia 27-12 - 14 horas.sql"
TIMESTAMP=$(date +"dia %d-%m - %H horas")
BACKUP_FILE="$BACKUP_DIR/Banco de dados - $TIMESTAMP.sql"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Iniciando backup do banco de dados...${NC}"

# Criar diretório se não existir
mkdir -p "$BACKUP_DIR"

# Carregar variáveis de ambiente
# pg_dump precisa de conexão direta (sem PgBouncer), então usamos DIRECT_URL
if [ -f "$PROJECT_DIR/.env" ]; then
    # Tentar DIRECT_URL primeiro (conexão direta, sem pooler)
    DIRECT_URL=$(grep -E "^DIRECT_URL=" "$PROJECT_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\n')
    if [ -n "$DIRECT_URL" ]; then
        DATABASE_URL="$DIRECT_URL"
    else
        DATABASE_URL=$(grep -E "^DATABASE_URL=" "$PROJECT_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\n')
    fi
elif [ -f "$PROJECT_DIR/.env.local" ]; then
    DIRECT_URL=$(grep -E "^DIRECT_URL=" "$PROJECT_DIR/.env.local" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\n')
    if [ -n "$DIRECT_URL" ]; then
        DATABASE_URL="$DIRECT_URL"
    else
        DATABASE_URL=$(grep -E "^DATABASE_URL=" "$PROJECT_DIR/.env.local" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\n')
    fi
else
    echo -e "${RED}❌ Arquivo .env não encontrado${NC}"
    exit 1
fi

# Executar backup
echo -e "${YELLOW}🔄 Executando pg_dump...${NC}"
pg_dump "$DATABASE_URL" > "$BACKUP_FILE" 2>/dev/null

# Verificar sucesso
if [ $? -eq 0 ] && [ -s "$BACKUP_FILE" ]; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup criado com sucesso!${NC}"
    echo -e "   📁 Arquivo: $BACKUP_FILE"
    echo -e "   📊 Tamanho: $FILE_SIZE"
    
    # Manter apenas os últimos 7 backups
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/Banco\ de\ dados*.sql "$BACKUP_DIR"/db_backup_*.sql 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt 7 ]; then
        echo -e "${YELLOW}🧹 Removendo backups antigos (mantendo últimos 7)...${NC}"
        ls -t "$BACKUP_DIR"/Banco\ de\ dados*.sql "$BACKUP_DIR"/db_backup_*.sql 2>/dev/null | tail -n +8 | xargs -r rm
    fi
    
    echo -e "${GREEN}📦 Backups disponíveis: $(ls -1 "$BACKUP_DIR"/Banco\ de\ dados*.sql "$BACKUP_DIR"/db_backup_*.sql 2>/dev/null | wc -l)${NC}"
else
    echo -e "${RED}❌ Erro ao criar backup${NC}"
    rm -f "$BACKUP_FILE"
    exit 1
fi
