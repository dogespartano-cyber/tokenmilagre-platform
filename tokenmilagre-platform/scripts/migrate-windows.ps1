# Script de Migração para Windows
# Execute: powershell.exe -ExecutionPolicy Bypass -File scripts/migrate-windows.ps1

Write-Host "🚀 MIGRAÇÃO NEON → SUPABASE" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# Definir URLs
$env:POSTGRES_PRISMA_URL = "postgresql://neondb_owner:npg_W0awYJLdgUV1@ep-rapid-paper-adrzxy4v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SUPABASE_POSTGRES_PRISMA_URL = "postgresql://postgres.zuolipvqfwznzqqqcobw:zk3FbnA9EErzDHmW@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

Write-Host "✅ Variáveis de ambiente configuradas" -ForegroundColor Green
Write-Host ""

# Navegar para diretório do projeto
Set-Location $PSScriptRoot\..

# Executar migração
Write-Host "🔄 Executando migração..." -ForegroundColor Yellow
node scripts/migrate-now.js

# Capturar código de saída
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Execute o script de validação: node scripts/validate-migration.js"
    Write-Host "2. Teste a aplicação com Supabase"
    Write-Host "3. Atualize DATABASE_URL para apontar para Supabase"
} else {
    Write-Host ""
    Write-Host "❌ ERRO NA MIGRAÇÃO!" -ForegroundColor Red
    Write-Host "Verifique os logs acima para detalhes" -ForegroundColor Yellow
}

exit $exitCode
