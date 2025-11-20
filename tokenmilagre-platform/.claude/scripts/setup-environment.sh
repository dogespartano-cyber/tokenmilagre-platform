#!/bin/bash
# ==============================================
# Claude Code Web - Environment Setup Script
# ==============================================
# Executa automaticamente no início de cada sessão
# Configura dependências e ferramentas necessárias

set -e

echo "🚀 Iniciando configuração do ambiente..."

# Detectar se está rodando no Claude Code Web
if [ "$CLAUDE_CODE_REMOTE" = "true" ]; then
  echo "☁️  Ambiente: Claude Code Web (Cloud)"
else
  echo "💻 Ambiente: Claude Code Local"
fi

# Verificar Node.js
echo "📦 Node.js version:"
node --version

# Verificar npm
echo "📦 npm version:"
npm --version

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
  echo "📥 Instalando dependências do projeto..."
  npm install
else
  echo "✅ Dependências já instaladas"
fi

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Verificar ferramentas disponíveis
echo "🛠️  Verificando ferramentas disponíveis:"
echo "  - Git: $(git --version 2>/dev/null || echo 'não disponível')"
echo "  - PostgreSQL: $(psql --version 2>/dev/null || echo 'não disponível')"
echo "  - TypeScript: $(npx tsc --version 2>/dev/null || echo 'não disponível')"

# Verificar variáveis de ambiente essenciais
echo "🔐 Verificando variáveis de ambiente:"
if [ -n "$DATABASE_URL" ]; then
  echo "  ✅ DATABASE_URL configurado"
else
  echo "  ⚠️  DATABASE_URL não configurado"
fi

if [ -n "$NEXTAUTH_SECRET" ]; then
  echo "  ✅ NEXTAUTH_SECRET configurado"
else
  echo "  ⚠️  NEXTAUTH_SECRET não configurado"
fi

echo ""
echo "✅ Ambiente configurado com sucesso!"
echo "📁 Diretório do projeto: ${CLAUDE_PROJECT_DIR:-$(pwd)}"
echo ""
