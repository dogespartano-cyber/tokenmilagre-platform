/**
 * Script para verificar configuração NextAuth
 */

console.log('🔍 Verificando configuração NextAuth...\n')

// Verificar variáveis de ambiente
const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'DATABASE_URL'
]

console.log('╔════════════════════════════════════════════════════════╗')
console.log('║ VARIÁVEIS DE AMBIENTE NEXTAUTH                         ║')
console.log('╠════════════════════════════════════════════════════════╣')

requiredVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  const display = value
    ? (varName.includes('SECRET') || varName.includes('PASSWORD'))
      ? `${value.substring(0, 20)}...`
      : value
    : 'NÃO DEFINIDA'

  console.log(`║ ${status} ${varName.padEnd(20)} │ ${display.substring(0, 25).padEnd(25)} ║`)
})

console.log('╚════════════════════════════════════════════════════════╝\n')

// Verificar se secret é forte
const secret = process.env.NEXTAUTH_SECRET
if (secret && secret.length < 32) {
  console.log('⚠️  AVISO: NEXTAUTH_SECRET é muito curta (< 32 caracteres)')
  console.log('   Recomendado: gerar nova com `openssl rand -base64 32`\n')
}

if (secret === 'your-super-secret-key-change-in-production') {
  console.log('🚨 CRÍTICO: NEXTAUTH_SECRET está usando valor padrão!')
  console.log('   Você DEVE mudar isso em produção!\n')
}

// Verificar NEXTAUTH_URL
const url = process.env.NEXTAUTH_URL
if (url && url.includes('localhost')) {
  console.log('⚠️  NEXTAUTH_URL aponta para localhost')
  console.log('   Em produção, deve ser a URL do Vercel\n')
}

console.log('📋 Valores recomendados para PRODUÇÃO (Vercel):')
console.log('   NEXTAUTH_SECRET="[GERAR NOVA - 32+ caracteres]"')
console.log('   NEXTAUTH_URL="https://tokenmilagre-platform.vercel.app"')
console.log('   (OU deixar vazio - Vercel detecta automaticamente)\n')

console.log('✨ Verificação concluída!')
