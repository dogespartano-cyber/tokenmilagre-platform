#!/bin/bash

# analyze-project.sh
# Script de análise colaborativa Claude + Gemini
# Uso: ./analyze-project.sh [caminho_do_projeto]

set -e

PROJECT_PATH="${1:-.}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ANALYSIS_DIR="analysis_$TIMESTAMP"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Iniciando análise colaborativa Claude + Gemini${NC}"
echo -e "${YELLOW}Projeto: $PROJECT_PATH${NC}"
echo

# Criar diretório para análise
mkdir -p "$ANALYSIS_DIR"

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
if ! command_exists claude-code; then
    echo -e "${RED}❌ Claude Code não encontrado${NC}"
    exit 1
fi

if ! command_exists gemini; then
    echo -e "${RED}❌ Gemini CLI não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Ferramentas verificadas${NC}"
echo

# Fase 1: Análise técnica com Claude
echo -e "${BLUE}📊 Fase 1: Análise técnica (Claude)${NC}"
cd "$PROJECT_PATH"

CLAUDE_PROMPT="Analise este projeto de forma estruturada:

1. ESTRUTURA DO PROJETO
   - Arquitetura geral
   - Organização de pastas
   - Principais arquivos e suas funções

2. QUALIDADE DO CÓDIGO
   - Padrões seguidos
   - Problemas identificados
   - Sugestões de melhoria

3. DEPENDÊNCIAS E CONFIGURAÇÃO
   - Principais dependências
   - Arquivos de configuração
   - Scripts disponíveis

4. TESTES E DOCUMENTAÇÃO
   - Cobertura de testes
   - Qualidade da documentação
   - Lacunas identificadas

Salve a análise em formato markdown estruturado."

echo "Executando análise com Claude..."
if claude-code --prompt "$CLAUDE_PROMPT" > "../$ANALYSIS_DIR/claude_analysis.md" 2>&1; then
    echo -e "${GREEN}✅ Análise Claude completa${NC}"
else
    echo -e "${RED}❌ Erro na análise Claude${NC}"
    exit 1
fi

# Fase 2: Brainstorming com Gemini
echo
echo -e "${BLUE}💡 Fase 2: Brainstorming estratégico (Gemini)${NC}"

cd "../$ANALYSIS_DIR"

GEMINI_PROMPT="Baseado na análise técnica do arquivo claude_analysis.md, faça um brainstorming estratégico:

1. OPORTUNIDADES DE MELHORIA
   - 5 melhorias técnicas prioritárias
   - 3 refatorações importantes
   - Sugestões de arquitetura

2. NOVAS FUNCIONALIDADES
   - 5 features que fariam sentido
   - Integrações possíveis
   - Expansões do produto

3. OTIMIZAÇÕES
   - Performance
   - Segurança
   - Experiência do usuário
   - DevOps/Deploy

4. ROADMAP SUGERIDO
   - Próximos passos (curto prazo)
   - Objetivos médio prazo
   - Visão longo prazo

Seja criativo mas pragmático. Base suas sugestões na análise técnica fornecida."

echo "Executando brainstorming com Gemini..."
if gemini --prompt "$GEMINI_PROMPT @claude_analysis.md" > "gemini_brainstorm.md" 2>&1; then
    echo -e "${GREEN}✅ Brainstorming Gemini completo${NC}"
else
    echo -e "${RED}❌ Erro no brainstorming Gemini${NC}"
    exit 1
fi

# Fase 3: Síntese final com Claude
echo
echo -e "${BLUE}📋 Fase 3: Síntese e plano de ação (Claude)${NC}"

SYNTHESIS_PROMPT="Com base nos arquivos:
1. claude_analysis.md (análise técnica)
2. gemini_brainstorm.md (brainstorming estratégico)

Crie um PLANO DE AÇÃO estruturado e priorizado:

1. AÇÕES IMEDIATAS (1-2 semanas)
   - Correções críticas
   - Melhorias rápidas
   - Setup de ferramentas

2. DESENVOLVIMENTO MÉDIO PRAZO (1-3 meses)
   - Refatorações importantes
   - Novas funcionalidades prioritárias
   - Melhorias de arquitetura

3. OBJETIVOS LONGO PRAZO (3+ meses)
   - Features avançadas
   - Otimizações complexas
   - Expansões do produto

4. MÉTRICAS DE SUCESSO
   - Como medir progresso
   - KPIs técnicos
   - Critérios de qualidade

Seja específico e acionável. Cada item deve ter uma descrição clara do que fazer."

echo "Criando síntese final com Claude..."
if claude-code --prompt "$SYNTHESIS_PROMPT" > "action_plan.md" 2>&1; then
    echo -e "${GREEN}✅ Plano de ação criado${NC}"
else
    echo -e "${RED}❌ Erro na síntese final${NC}"
    exit 1
fi

# Resumo final
echo
echo -e "${GREEN}🎉 Análise colaborativa completa!${NC}"
echo
echo -e "${YELLOW}Arquivos gerados em $ANALYSIS_DIR/:${NC}"
echo "📊 claude_analysis.md    - Análise técnica detalhada"
echo "💡 gemini_brainstorm.md  - Ideias e oportunidades"
echo "📋 action_plan.md        - Plano de ação priorizado"
echo
echo -e "${BLUE}Para visualizar os resultados:${NC}"
echo "cd $ANALYSIS_DIR && ls -la"
echo
echo -e "${GREEN}Próximo passo sugerido: Revisar action_plan.md e começar pelas ações imediatas${NC}"