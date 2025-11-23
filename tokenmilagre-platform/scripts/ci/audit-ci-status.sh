#!/bin/bash

#
# AUDIT CI STATUS
# Audita o status real de CI/CD do repositório consultando a API do GitHub
#
# Uso:
#   ./scripts/ci/audit-ci-status.sh [--days=7] [--branch=nome] [--output=json|markdown]
#
# Exemplo:
#   ./scripts/ci/audit-ci-status.sh --days=2 --branch=main --output=markdown
#

set -e

# Configurações padrão
REPO_OWNER="dogespartano-cyber"
REPO_NAME="tokenmilagre-platform"
DAYS=7
BRANCH=""
OUTPUT_FORMAT="markdown"
CHECK_LATEST=false

# Parsear argumentos
for arg in "$@"; do
  case $arg in
    --days=*)
      DAYS="${arg#*=}"
      ;;
    --branch=*)
      BRANCH="${arg#*=}"
      ;;
    --output=*)
      OUTPUT_FORMAT="${arg#*=}"
      ;;
    --check-latest)
      CHECK_LATEST=true
      ;;
    --help|-h)
      echo "Uso: $0 [opções]"
      echo ""
      echo "Opções:"
      echo "  --days=N          Número de dias para análise (padrão: 7)"
      echo "  --branch=NOME     Branch específica para analisar"
      echo "  --output=FORMATO  Formato de saída: json ou markdown (padrão: markdown)"
      echo "  --check-latest    Verifica apenas o commit mais recente"
      echo "  --help, -h        Mostra esta mensagem"
      exit 0
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
echo -e "${BLUE}   AUDITORIA DE CI/CD - tokenmilagre-platform${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Configuração:"
echo "   Repositório: $REPO_OWNER/$REPO_NAME"
echo "   Período: Últimos $DAYS dias"
if [ -n "$BRANCH" ]; then
  echo "   Branch: $BRANCH"
fi
echo "   Formato: $OUTPUT_FORMAT"
echo ""

# Função para buscar commits
get_commits() {
  local since_date=$(date -u -d "$DAYS days ago" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-${DAYS}d +%Y-%m-%dT%H:%M:%SZ)

  if [ -n "$BRANCH" ]; then
    git log "origin/$BRANCH" --since="$DAYS days ago" --pretty=format:'%H|%h|%an|%ai|%s' --date=iso
  else
    git log --all --since="$DAYS days ago" --pretty=format:'%H|%h|%an|%ai|%s' --date=iso
  fi
}

# Função para verificar checks de um commit via API do GitHub
check_commit_ci() {
  local commit_sha=$1

  # Buscar check-runs
  local check_runs_response=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits/$commit_sha/check-runs")
  local check_runs_total=$(echo "$check_runs_response" | grep -o '"total_count":[0-9]*' | head -1 | cut -d':' -f2)

  # Buscar status (Vercel, etc)
  local status_response=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits/$commit_sha/status")
  local status_state=$(echo "$status_response" | grep -o '"state":"[^"]*"' | head -1 | cut -d'"' -f4)
  local status_total=$(echo "$status_response" | grep -o '"total_count":[0-9]*' | head -1 | cut -d':' -f2)

  # Contar sucessos e falhas
  local check_runs_success=0
  local check_runs_failure=0

  if [ -n "$check_runs_total" ] && [ "$check_runs_total" -gt 0 ]; then
    check_runs_success=$(echo "$check_runs_response" | grep -o '"conclusion":"success"' | wc -l)
    check_runs_failure=$(echo "$check_runs_response" | grep -o '"conclusion":"failure"' | wc -l)
  fi

  # Status geral
  local overall_status="NO_CHECKS"
  if [ -n "$check_runs_total" ] && [ "$check_runs_total" -gt 0 ]; then
    if [ "$check_runs_failure" -gt 0 ]; then
      overall_status="FAILURE"
    elif [ "$check_runs_success" -eq "$check_runs_total" ]; then
      overall_status="SUCCESS"
    else
      overall_status="PENDING"
    fi
  elif [ -n "$status_total" ] && [ "$status_total" -gt 0 ]; then
    case "$status_state" in
      success)
        overall_status="SUCCESS"
        ;;
      failure)
        overall_status="FAILURE"
        ;;
      pending)
        overall_status="PENDING"
        ;;
    esac
  fi

  echo "$check_runs_total|$check_runs_success|$check_runs_failure|$status_total|$status_state|$overall_status"
}

# Verificar se GitHub Actions está habilitado
echo "🔍 Verificando GitHub Actions..."
actions_runs=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=1")
actions_total=$(echo "$actions_runs" | grep -o '"total_count":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$actions_total" ] || [ "$actions_total" = "0" ]; then
  echo -e "${RED}❌ GitHub Actions: NUNCA EXECUTADO${NC}"
  echo -e "${YELLOW}⚠️  Workflows configurados mas não estão rodando!${NC}"
  echo ""
else
  echo -e "${GREEN}✅ GitHub Actions: ATIVO${NC}"
  echo "   Total de execuções: $actions_total"
  echo ""
fi

# Analisar commits
echo "📊 Analisando commits..."
echo ""

commits_analyzed=0
commits_no_checks=0
commits_with_checks=0
commits_all_passed=0
commits_with_failures=0

output_file="ci-audit-report-$(date +%Y%m%d-%H%M%S)"

if [ "$OUTPUT_FORMAT" = "json" ]; then
  output_file="$output_file.json"
  echo "{" > "$output_file"
  echo "  \"repository\": \"$REPO_OWNER/$REPO_NAME\"," >> "$output_file"
  echo "  \"analysis_date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> "$output_file"
  echo "  \"period_days\": $DAYS," >> "$output_file"
  if [ -n "$BRANCH" ]; then
    echo "  \"branch\": \"$BRANCH\"," >> "$output_file"
  fi
  echo "  \"github_actions_total_runs\": $actions_total," >> "$output_file"
  echo "  \"commits\": [" >> "$output_file"
else
  output_file="$output_file.md"
  echo "# Relatório de Auditoria CI/CD" > "$output_file"
  echo "" >> "$output_file"
  echo "**Repositório**: $REPO_OWNER/$REPO_NAME" >> "$output_file"
  echo "**Data da Análise**: $(date)" >> "$output_file"
  echo "**Período**: Últimos $DAYS dias" >> "$output_file"
  if [ -n "$BRANCH" ]; then
    echo "**Branch**: $BRANCH" >> "$output_file"
  fi
  echo "" >> "$output_file"
  echo "## Status do GitHub Actions" >> "$output_file"
  echo "" >> "$output_file"
  if [ -z "$actions_total" ] || [ "$actions_total" = "0" ]; then
    echo "❌ **CRÍTICO**: GitHub Actions NUNCA foi executado neste repositório!" >> "$output_file"
  else
    echo "✅ GitHub Actions está ativo: $actions_total execuções registradas" >> "$output_file"
  fi
  echo "" >> "$output_file"
  echo "## Análise de Commits" >> "$output_file"
  echo "" >> "$output_file"
  echo "| SHA | Mensagem | GitHub Actions | Status | Vercel | Status Geral |" >> "$output_file"
  echo "|-----|----------|----------------|--------|--------|--------------|" >> "$output_file"
fi

first_commit=true

while IFS='|' read -r full_sha short_sha author date message; do
  commits_analyzed=$((commits_analyzed + 1))

  printf "Analisando: %s - %s... " "$short_sha" "$message"

  # Verificar checks
  ci_info=$(check_commit_ci "$full_sha")

  IFS='|' read -r check_runs_total check_runs_success check_runs_failure status_total status_state overall_status <<< "$ci_info"

  # Contabilizar
  case "$overall_status" in
    NO_CHECKS)
      commits_no_checks=$((commits_no_checks + 1))
      echo -e "${YELLOW}sem checks${NC}"
      status_icon="⚪"
      ;;
    SUCCESS)
      commits_with_checks=$((commits_with_checks + 1))
      commits_all_passed=$((commits_all_passed + 1))
      echo -e "${GREEN}PASSOU${NC}"
      status_icon="✅"
      ;;
    FAILURE)
      commits_with_checks=$((commits_with_checks + 1))
      commits_with_failures=$((commits_with_failures + 1))
      echo -e "${RED}FALHOU${NC}"
      status_icon="❌"
      ;;
    PENDING)
      commits_with_checks=$((commits_with_checks + 1))
      echo -e "${BLUE}pendente${NC}"
      status_icon="⏳"
      ;;
  esac

  # Gravar resultado
  if [ "$OUTPUT_FORMAT" = "json" ]; then
    if [ "$first_commit" = false ]; then
      echo "," >> "$output_file"
    fi
    first_commit=false

    echo "    {" >> "$output_file"
    echo "      \"sha\": \"$short_sha\"," >> "$output_file"
    echo "      \"full_sha\": \"$full_sha\"," >> "$output_file"
    echo "      \"message\": \"$message\"," >> "$output_file"
    echo "      \"author\": \"$author\"," >> "$output_file"
    echo "      \"date\": \"$date\"," >> "$output_file"
    echo "      \"github_actions_checks\": $check_runs_total," >> "$output_file"
    echo "      \"github_actions_success\": $check_runs_success," >> "$output_file"
    echo "      \"github_actions_failure\": $check_runs_failure," >> "$output_file"
    echo "      \"status_checks\": $status_total," >> "$output_file"
    echo "      \"status_state\": \"$status_state\"," >> "$output_file"
    echo "      \"overall_status\": \"$overall_status\"," >> "$output_file"
    echo "      \"commit_url\": \"https://github.com/$REPO_OWNER/$REPO_NAME/commit/$short_sha\"" >> "$output_file"
    echo -n "    }" >> "$output_file"
  else
    ga_info="$check_runs_success/$check_runs_total"
    if [ "$check_runs_total" = "0" ] || [ -z "$check_runs_total" ]; then
      ga_info="Nenhum"
    fi

    vercel_info="-"
    if [ "$status_total" != "0" ] && [ -n "$status_total" ]; then
      vercel_info="$status_state"
    fi

    echo "| $short_sha | $message | $ga_info | $([ "$check_runs_failure" -gt 0 ] && echo "❌" || echo "-") | $vercel_info | $status_icon $overall_status |" >> "$output_file"
  fi

done <<< "$(get_commits)"

# Finalizar output
if [ "$OUTPUT_FORMAT" = "json" ]; then
  echo "" >> "$output_file"
  echo "  ]," >> "$output_file"
  echo "  \"summary\": {" >> "$output_file"
  echo "    \"total_commits\": $commits_analyzed," >> "$output_file"
  echo "    \"commits_no_checks\": $commits_no_checks," >> "$output_file"
  echo "    \"commits_with_checks\": $commits_with_checks," >> "$output_file"
  echo "    \"commits_all_passed\": $commits_all_passed," >> "$output_file"
  echo "    \"commits_with_failures\": $commits_with_failures," >> "$output_file"
  echo "    \"success_rate\": \"$(awk "BEGIN {printf \"%.1f\", ($commits_with_checks > 0 ? $commits_all_passed / $commits_with_checks * 100 : 0)}")%\"" >> "$output_file"
  echo "  }" >> "$output_file"
  echo "}" >> "$output_file"
else
  echo "" >> "$output_file"
  echo "## Resumo" >> "$output_file"
  echo "" >> "$output_file"
  echo "- **Total de commits**: $commits_analyzed" >> "$output_file"
  echo "- **Commits sem checks**: $commits_no_checks ($( awk "BEGIN {printf \"%.1f\", ($commits_analyzed > 0 ? $commits_no_checks / $commits_analyzed * 100 : 0)}" )%)" >> "$output_file"
  echo "- **Commits com checks**: $commits_with_checks ($( awk "BEGIN {printf \"%.1f\", ($commits_analyzed > 0 ? $commits_with_checks / $commits_analyzed * 100 : 0)}" )%)" >> "$output_file"
  echo "- **Commits com todos os checks verdes**: $commits_all_passed" >> "$output_file"
  echo "- **Commits com falhas**: $commits_with_failures" >> "$output_file"

  if [ $commits_with_checks -gt 0 ]; then
    success_rate=$(awk "BEGIN {printf \"%.1f\", ($commits_all_passed / $commits_with_checks * 100)}")
    echo "- **Taxa de sucesso**: $success_rate%" >> "$output_file"
  else
    echo "- **Taxa de sucesso**: N/A (nenhum commit com checks)" >> "$output_file"
  fi
fi

# Sumário no terminal
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   RESUMO DA AUDITORIA${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📊 Total de commits analisados: $commits_analyzed"
echo ""
echo "🔍 Distribuição:"
echo "   ⚪ Sem checks: $commits_no_checks"
echo "   ✅ Todos os checks verdes: $commits_all_passed"
echo "   ❌ Com falhas: $commits_with_failures"
echo ""

if [ $commits_with_checks -gt 0 ]; then
  success_rate=$(awk "BEGIN {printf \"%.1f\", ($commits_all_passed / $commits_with_checks * 100)}")
  echo "📈 Taxa de sucesso: $success_rate%"
else
  echo "⚠️  Taxa de sucesso: N/A (nenhum commit tem checks configurados)"
fi

echo ""
echo "💾 Relatório salvo em: $output_file"
echo ""

# Recomendações
if [ -z "$actions_total" ] || [ "$actions_total" = "0" ]; then
  echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}   ⚠️  AÇÃO NECESSÁRIA${NC}"
  echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo "GitHub Actions não está habilitado ou não está executando."
  echo ""
  echo "Para habilitar:"
  echo "1. Acesse: https://github.com/$REPO_OWNER/$REPO_NAME/settings/actions"
  echo "2. Habilite: 'Allow all actions and reusable workflows'"
  echo "3. Configure: 'Read and write permissions'"
  echo "4. Faça um push para testar: git commit --allow-empty -m 'test: Trigger CI' && git push"
  echo ""
fi

if [ $commits_no_checks -gt 0 ]; then
  pct_no_checks=$(awk "BEGIN {printf \"%.0f\", ($commits_no_checks / $commits_analyzed * 100)}")
  if [ $pct_no_checks -gt 50 ]; then
    echo -e "${YELLOW}⚠️  $pct_no_checks% dos commits não têm checks de CI configurados${NC}"
    echo "   Considere configurar GitHub Actions para melhorar a qualidade."
    echo ""
  fi
fi

echo "✅ Auditoria concluída!"
echo ""
