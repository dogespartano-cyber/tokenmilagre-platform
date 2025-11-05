#!/bin/bash
# Backup da pasta docs-local/

BACKUP_DIR="$HOME/backup-tokenmilagre"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Verificar se docs-local/ existe
if [ ! -d "docs-local" ]; then
  echo "❌ Pasta docs-local/ não encontrada!"
  exit 1
fi

# Fazer backup compactado
tar -czf "$BACKUP_DIR/docs-local-$TIMESTAMP.tar.gz" docs-local/

echo "✅ Backup de docs-local/ criado:"
echo "   $BACKUP_DIR/docs-local-$TIMESTAMP.tar.gz"
echo ""
ls -lh "$BACKUP_DIR/docs-local-$TIMESTAMP.tar.gz"
echo ""
echo "📊 Conteúdo do backup:"
tar -tzf "$BACKUP_DIR/docs-local-$TIMESTAMP.tar.gz" | head -10
