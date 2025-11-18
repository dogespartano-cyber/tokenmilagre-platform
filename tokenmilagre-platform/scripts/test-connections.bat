@echo off
REM Script para testar conexões com Neon e Supabase
REM Execute com duplo clique ou: scripts\test-connections.bat

echo.
echo ============================================================
echo         TESTE DE CONEXAO - NEON E SUPABASE
echo ============================================================
echo.

REM Definir URLs
set POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
set SUPABASE_POSTGRES_PRISMA_URL=postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

echo [OK] Variaveis de ambiente configuradas
echo.

REM Navegar para diretório do projeto
cd /d "%~dp0.."

REM Executar teste de conexões
node scripts/test-database-connections.js

echo.
echo ============================================================
echo                    TESTE CONCLUIDO
echo ============================================================
echo.

pause
