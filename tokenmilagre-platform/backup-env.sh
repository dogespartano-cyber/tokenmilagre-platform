#!/bin/bash
# Backup do arquivo .env

BACKUP_DIR="$HOME/backup-tokenmilagre"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Verificar se .env existe
if [ ! -f ".env" ]; then
  echo "❌ Arquivo .env não encontrado!"
  exit 1
fi

# Fazer backup
cp .env "$BACKUP_DIR/env-$TIMESTAMP.bak"

echo "✅ Backup do .env criado:"
echo "   $BACKUP_DIR/env-$TIMESTAMP.bak"
echo ""
ls -lh "$BACKUP_DIR/env-$TIMESTAMP.bak"
