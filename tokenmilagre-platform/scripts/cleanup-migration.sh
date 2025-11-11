#!/bin/bash

# Script para limpar rotas temporárias de migração
# Execute este script APENAS após confirmar que a migração foi bem-sucedida

set -e

echo "🧹 Limpando rotas temporárias de migração..."
echo ""
echo "⚠️  ATENÇÃO: Este script vai deletar:"
echo "   - app/api/setup-supabase-schema/"
echo "   - app/api/migrate-database/"
echo "   - app/api/validate-migration/"
echo "   - MIGRATION.md"
echo "   - scripts/cleanup-migration.sh (este script)"
echo ""
read -p "Tem certeza que deseja continuar? (sim/não): " -r
echo ""

if [[ ! $REPLY =~ ^[Ss][Ii][Mm]$ ]]; then
    echo "❌ Operação cancelada."
    exit 1
fi

# Verificar se estamos no diretório correto
if [ ! -d "app/api" ]; then
    echo "❌ Erro: Execute este script a partir da raiz do projeto!"
    exit 1
fi

# Deletar rotas temporárias
echo "🗑️  Deletando app/api/setup-supabase-schema..."
rm -rf app/api/setup-supabase-schema

echo "🗑️  Deletando app/api/migrate-database..."
rm -rf app/api/migrate-database

echo "🗑️  Deletando app/api/validate-migration..."
rm -rf app/api/validate-migration

echo "🗑️  Deletando MIGRATION.md..."
rm -f MIGRATION.md

echo "🗑️  Deletando este script..."
rm -f scripts/cleanup-migration.sh

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Commit das mudanças: git add . && git commit -m 'chore: remover rotas temporárias de migração'"
echo "   2. Push para o repositório: git push"
echo "   3. Deploy no Vercel"
echo ""
echo "🎉 Migração Neon → Supabase completa!"
