@echo off
REM Script de Migração para Windows (CMD)
REM Execute com duplo clique ou: scripts\migrate-windows.bat

echo.
echo ============================================================
echo            MIGRACAO NEON -^> SUPABASE
echo ============================================================
echo.

REM Definir URLs
set POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
set SUPABASE_POSTGRES_PRISMA_URL=postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

echo [OK] Variaveis de ambiente configuradas
echo.

REM Navegar para diretório do projeto
cd /d "%~dp0.."

REM Executar migração
echo Executando migracao...
echo.
node scripts/migrate-now.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo           MIGRACAO CONCLUIDA COM SUCESSO!
    echo ============================================================
    echo.
    echo Proximos passos:
    echo 1. Execute: node scripts/validate-migration.js
    echo 2. Teste a aplicacao com Supabase
    echo 3. Atualize DATABASE_URL para Supabase
    echo.
) else (
    echo.
    echo ============================================================
    echo                  ERRO NA MIGRACAO!
    echo ============================================================
    echo.
    echo Verifique os logs acima para detalhes
    echo.
)

pause
