#!/bin/bash

# Script de Migração Direta usando pg_dump/pg_restore
# Migra dados do Neon para Supabase sem depender do Prisma

set -e

echo "🚀 MIGRAÇÃO NEON → SUPABASE (via pg_dump)"
echo "═══════════════════════════════════════════════════════════"

# URLs dos bancos
NEON_URL="postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
SUPABASE_URL="postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

echo "✅ URLs configuradas"
echo ""

# Criar dump do Neon
echo "📦 [1/3] Criando backup do Neon..."
pg_dump "$NEON_URL" \
  --data-only \
  --no-owner \
  --no-acl \
  --disable-triggers \
  --inserts \
  > /tmp/neon_backup.sql

if [ $? -eq 0 ]; then
  echo "   ✅ Backup criado com sucesso"
  FILE_SIZE=$(du -h /tmp/neon_backup.sql | cut -f1)
  echo "   📁 Tamanho: $FILE_SIZE"
else
  echo "   ❌ Erro ao criar backup"
  exit 1
fi

echo ""

# Aplicar migração no Supabase
echo "📦 [2/3] Aplicando dados no Supabase..."
psql "$SUPABASE_URL" < /tmp/neon_backup.sql 2>&1 | grep -E "(INSERT|COPY|ERROR)" | tail -20

if [ $? -eq 0 ]; then
  echo "   ✅ Dados aplicados com sucesso"
else
  echo "   ⚠️  Aplicação concluída com avisos (duplicatas são esperadas)"
fi

echo ""

# Validação
echo "📦 [3/3] Validando migração..."
echo ""
echo "Contando registros no NEON:"
psql "$NEON_URL" -t -c "
SELECT
  'users: ' || COUNT(*) FROM \"User\"
  UNION ALL
  SELECT 'articles: ' || COUNT(*) FROM \"Article\"
  UNION ALL
  SELECT 'resources: ' || COUNT(*) FROM \"Resource\"
  UNION ALL
  SELECT 'cryptocurrencies: ' || COUNT(*) FROM \"Cryptocurrency\";
"

echo ""
echo "Contando registros no SUPABASE:"
psql "$SUPABASE_URL" -t -c "
SELECT
  'users: ' || COUNT(*) FROM \"User\"
  UNION ALL
  SELECT 'articles: ' || COUNT(*) FROM \"Article\"
  UNION ALL
  SELECT 'resources: ' || COUNT(*) FROM \"Resource\"
  UNION ALL
  SELECT 'cryptocurrencies: ' || COUNT(*) FROM \"Cryptocurrency\";
"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ MIGRAÇÃO COMPLETA!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verifique se os counts batem acima"
echo "   2. Teste a aplicação apontando para Supabase"
echo "   3. Atualize DATABASE_URL para usar Supabase"
echo ""

# Limpar arquivo temporário
rm -f /tmp/neon_backup.sql
echo "🧹 Backup temporário removido"
