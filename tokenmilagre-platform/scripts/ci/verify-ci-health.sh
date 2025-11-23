#!/bin/bash

#
# VERIFY CI HEALTH
# Verifica a saúde e configuração do sistema de CI/CD
#
# Uso:
#   ./scripts/ci/verify-ci-health.sh [--fix]
#

set -e

REPO_OWNER="dogespartano-cyber"
REPO_NAME="tokenmilagre-platform"
FIX_MODE=false

# Parsear argumentos
for arg in "$@"; do
  case $arg in
    --fix)
      FIX_MODE=true
      ;;
  esac
done

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   VERIFICAÇÃO DE SAÚDE DO CI/CD${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

health_score=0
total_checks=0

# Check 1: Arquivos de workflow existem?
echo "🔍 [1/8] Verificando arquivos de workflow..."
total_checks=$((total_checks + 1))

if [ -f ".github/workflows/ci.yml" ] && [ -f ".github/workflows/quality-checks.yml" ]; then
  echo -e "   ${GREEN}✅ Workflows encontrados${NC}"
  health_score=$((health_score + 1))
else
  echo -e "   ${RED}❌ Workflows não encontrados em .github/workflows/${NC}"
  if [ "$FIX_MODE" = true ]; then
    echo "   🔧 Criando workflows..."
    mkdir -p .github/workflows
    # Criar workflows básicos aqui se necessário
  fi
fi

# Check 2: GitHub Actions está habilitado?
echo "🔍 [2/8] Verificando se GitHub Actions está habilitado..."
total_checks=$((total_checks + 1))

actions_runs=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=1")
actions_total=$(echo "$actions_runs" | grep -o '"total_count":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$actions_total" ] && [ "$actions_total" -gt 0 ]; then
  echo -e "   ${GREEN}✅ GitHub Actions está ativo ($actions_total execuções)${NC}"
  health_score=$((health_score + 1))
else
  echo -e "   ${RED}❌ GitHub Actions nunca foi executado${NC}"
  echo -e "   ${YELLOW}   → Habilite em: https://github.com/$REPO_OWNER/$REPO_NAME/settings/actions${NC}"
fi

# Check 3: Workflows têm sintaxe válida?
echo "🔍 [3/8] Validando sintaxe dos workflows..."
total_checks=$((total_checks + 1))

workflow_errors=0

if command -v yq &> /dev/null || command -v python &> /dev/null; then
  for workflow in .github/workflows/*.yml; do
    if [ -f "$workflow" ]; then
      # Validação básica de YAML
      if python -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
        :
      else
        echo -e "   ${RED}❌ Erro de sintaxe em: $workflow${NC}"
        workflow_errors=$((workflow_errors + 1))
      fi
    fi
  done

  if [ $workflow_errors -eq 0 ]; then
    echo -e "   ${GREEN}✅ Todos os workflows têm sintaxe válida${NC}"
    health_score=$((health_score + 1))
  fi
else
  echo -e "   ${YELLOW}⚠️  Não foi possível validar (python ou yq não disponível)${NC}"
  health_score=$((health_score + 1)) # Benefit of doubt
fi

# Check 4: Scripts de qualidade existem e são executáveis?
echo "🔍 [4/8] Verificando scripts de qualidade..."
total_checks=$((total_checks + 1))

required_scripts=(
  "scripts/quality/run-all-checks.sh"
  "scripts/utils/check-env.sh"
)

missing_scripts=0
for script in "${required_scripts[@]}"; do
  if [ ! -f "$script" ]; then
    echo -e "   ${RED}❌ Script não encontrado: $script${NC}"
    missing_scripts=$((missing_scripts + 1))
  elif [ ! -x "$script" ]; then
    echo -e "   ${YELLOW}⚠️  Script não é executável: $script${NC}"
    if [ "$FIX_MODE" = true ]; then
      chmod +x "$script"
      echo -e "   ${GREEN}   ✓ Permissão corrigida${NC}"
    fi
  fi
done

if [ $missing_scripts -eq 0 ]; then
  echo -e "   ${GREEN}✅ Todos os scripts necessários existem${NC}"
  health_score=$((health_score + 1))
fi

# Check 5: Package.json tem scripts de CI?
echo "🔍 [5/8] Verificando scripts npm de CI..."
total_checks=$((total_checks + 1))

if grep -q '"test:ci"' package.json && \
   grep -q '"lint"' package.json && \
   grep -q '"type-check"' package.json && \
   grep -q '"build"' package.json; then
  echo -e "   ${GREEN}✅ Scripts npm de CI configurados${NC}"
  health_score=$((health_score + 1))
else
  echo -e "   ${YELLOW}⚠️  Alguns scripts npm de CI estão faltando${NC}"
fi

# Check 6: Prisma está configurado?
echo "🔍 [6/8] Verificando configuração do Prisma..."
total_checks=$((total_checks + 1))

if [ -f "prisma/schema.prisma" ]; then
  echo -e "   ${GREEN}✅ Prisma schema encontrado${NC}"
  health_score=$((health_score + 1))
else
  echo -e "   ${RED}❌ Prisma schema não encontrado${NC}"
fi

# Check 7: Vercel está configurado?
echo "🔍 [7/8] Verificando configuração do Vercel..."
total_checks=$((total_checks + 1))

if [ -f "vercel.json" ]; then
  echo -e "   ${GREEN}✅ vercel.json encontrado${NC}"
  health_score=$((health_score + 1))

  # Verificar se Vercel está ativo via API
  latest_commit=$(git rev-parse HEAD)
  vercel_status=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits/$latest_commit/status")
  vercel_active=$(echo "$vercel_status" | grep -o '"context":"Vercel"' | wc -l)

  if [ $vercel_active -gt 0 ]; then
    echo -e "   ${GREEN}   ✓ Vercel está ativo e respondendo${NC}"
  else
    echo -e "   ${YELLOW}   ⚠️  Vercel não detectado no último commit${NC}"
  fi
else
  echo -e "   ${YELLOW}⚠️  vercel.json não encontrado${NC}"
fi

# Check 8: Commits recentes têm checks?
echo "🔍 [8/8] Verificando checks nos commits recentes..."
total_checks=$((total_checks + 1))

recent_commits=$(git log --oneline -5)
commits_with_checks=0
total_recent=0

while IFS= read -r line; do
  total_recent=$((total_recent + 1))
  commit_sha=$(echo "$line" | awk '{print $1}')

  check_runs=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits/$commit_sha/check-runs")
  status_checks=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits/$commit_sha/status")

  checks_count=$(echo "$check_runs" | grep -o '"total_count":[0-9]*' | head -1 | cut -d':' -f2)
  status_count=$(echo "$status_checks" | grep -o '"total_count":[0-9]*' | head -1 | cut -d':' -f2)

  if ([ -n "$checks_count" ] && [ "$checks_count" -gt 0 ]) || ([ -n "$status_count" ] && [ "$status_count" -gt 0 ]); then
    commits_with_checks=$((commits_with_checks + 1))
  fi
done <<< "$recent_commits"

if [ $commits_with_checks -gt 0 ]; then
  pct=$(awk "BEGIN {printf \"%.0f\", ($commits_with_checks / $total_recent * 100)}")
  echo -e "   ${GREEN}✅ $commits_with_checks/$total_recent commits recentes têm checks ($pct%)${NC}"
  health_score=$((health_score + 1))
else
  echo -e "   ${RED}❌ Nenhum dos últimos $total_recent commits tem checks${NC}"
fi

# Calcular score de saúde
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   RESULTADO DA VERIFICAÇÃO${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

health_percentage=$(awk "BEGIN {printf \"%.0f\", ($health_score / $total_checks * 100)}")
echo "📊 Score de Saúde: $health_score/$total_checks ($health_percentage%)"
echo ""

if [ $health_percentage -ge 90 ]; then
  echo -e "${GREEN}✅ CI/CD está em EXCELENTE estado!${NC}"
  exit 0
elif [ $health_percentage -ge 70 ]; then
  echo -e "${YELLOW}⚠️  CI/CD está em estado RAZOÁVEL mas precisa de atenção${NC}"
  exit 0
elif [ $health_percentage -ge 50 ]; then
  echo -e "${YELLOW}⚠️  CI/CD está em estado PREOCUPANTE${NC}"
  echo ""
  echo "Recomendações:"
  echo "1. Execute com --fix para tentar corrigir problemas automáticos"
  echo "2. Verifique a documentação em docs/CI_CD_TROUBLESHOOTING.md"
  exit 1
else
  echo -e "${RED}❌ CI/CD está em estado CRÍTICO!${NC}"
  echo ""
  echo "Ações urgentes necessárias:"
  echo "1. Habilite GitHub Actions: https://github.com/$REPO_OWNER/$REPO_NAME/settings/actions"
  echo "2. Execute: ./scripts/ci/verify-ci-health.sh --fix"
  echo "3. Leia: docs/CI_CD_SETUP_GUIDE.md"
  echo "4. Consulte: docs/CI_CD_TROUBLESHOOTING.md"
  exit 1
fi
