#!/bin/bash
# =============================================================================
# db-safe.sh - Wrapper seguro para comandos Prisma destrutivos
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Lista de padrões de comandos destrutivos
DESTRUCTIVE_PATTERNS=(
    "--force-reset"
    "migrate reset"
    "db push --force"
    "--accept-data-loss"
)

# Verificar se é comando destrutivo
IS_DESTRUCTIVE=false
FULL_COMMAND="$*"

for pattern in "${DESTRUCTIVE_PATTERNS[@]}"; do
    if [[ "$FULL_COMMAND" == *"$pattern"* ]]; then
        IS_DESTRUCTIVE=true
        break
    fi
done

if [ "$IS_DESTRUCTIVE" = true ]; then
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ⚠️  COMANDO DESTRUTIVO DETECTADO                          ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Comando: npx prisma $FULL_COMMAND${NC}"
    echo ""
    echo -e "${GREEN}📦 Criando backup obrigatório antes de prosseguir...${NC}"
    echo ""
    
    # Executar backup
    "$SCRIPT_DIR/db-backup.sh"
    
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}❌ Backup falhou. Comando abortado por segurança.${NC}"
        echo -e "${RED}   Resolva o problema do backup antes de tentar novamente.${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ Backup criado com sucesso!${NC}"
    echo ""
    read -p "Prosseguir com o comando destrutivo? (s/N): " confirm
    
    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        echo -e "${YELLOW}Operação cancelada pelo usuário.${NC}"
        exit 0
    fi
    
    echo ""
    echo -e "${YELLOW}🔄 Executando comando...${NC}"
fi

# Executar comando Prisma
npx prisma "$@"
