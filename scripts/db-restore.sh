#!/bin/bash
# =============================================================================
# db-restore.sh - Restaurar backup do banco Supabase
# =============================================================================

set -e

BACKUP_DIR="/home/zenfoco/Documentos/Backup Supabase"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}📦 Gerenciador de Restauração de Backup${NC}"
echo ""

# Listar backups disponíveis
echo -e "${YELLOW}Backups disponíveis:${NC}"
if ls "$BACKUP_DIR"/db_backup_*.sql 1> /dev/null 2>&1; then
    ls -lh "$BACKUP_DIR"/db_backup_*.sql | awk '{print "  " $9 " (" $5 ")"}'
else
    echo -e "${RED}  Nenhum backup encontrado em $BACKUP_DIR${NC}"
    exit 1
fi

echo ""

# Verificar argumento
if [ -z "$1" ]; then
    echo -e "${YELLOW}Uso:${NC} ./scripts/db-restore.sh <arquivo.sql>"
    echo -e "${YELLOW}Exemplo:${NC} ./scripts/db-restore.sh db_backup_20251227_030000.sql"
    echo ""
    echo -e "${CYAN}Dica:${NC} Copie o nome do arquivo da lista acima."
    exit 0
fi

# Verificar se é caminho completo ou apenas nome do arquivo
if [[ "$1" == /* ]]; then
    BACKUP_FILE="$1"
else
    BACKUP_FILE="$BACKUP_DIR/$1"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Arquivo não encontrado: $BACKUP_FILE${NC}"
    exit 1
fi

# Carregar variáveis de ambiente
if [ -f "$PROJECT_DIR/.env" ]; then
    DATABASE_URL=$(grep -E "^DATABASE_URL=" "$PROJECT_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\n')
elif [ -f "$PROJECT_DIR/.env.local" ]; then
    DATABASE_URL=$(grep -E "^DATABASE_URL=" "$PROJECT_DIR/.env.local" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\n')
else
    echo -e "${RED}❌ Arquivo .env não encontrado${NC}"
    exit 1
fi

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo -e "${YELLOW}⚠️  ATENÇÃO: Isso vai restaurar o banco para o estado do backup!${NC}"
echo -e "   📁 Arquivo: $BACKUP_FILE"
echo -e "   📊 Tamanho: $FILE_SIZE"
echo ""
echo -e "${RED}Esta operação pode SOBRESCREVER dados atuais.${NC}"
read -p "Continuar? (s/N): " confirm

if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
    echo -e "${YELLOW}🔄 Restaurando backup...${NC}"
    psql "$DATABASE_URL" < "$BACKUP_FILE" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Restauração concluída com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro durante a restauração${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Operação cancelada.${NC}"
fi
