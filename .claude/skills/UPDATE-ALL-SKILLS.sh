#!/bin/bash

# Script de atualização automatizada de todas as 23 skills
# Adiciona seção "Skills Relacionadas" em cada skill

echo "🚀 Iniciando atualização do ecossistema de skills..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador
UPDATED=0
SKIPPED=0
ERRORS=0

# Função para adicionar seção de skills relacionadas
add_related_skills() {
    local skill_file="$1"
    local template_file="$2"
    local skill_name=$(basename "$(dirname "$skill_file")")
    
    # Verificar se arquivo existe
    if [ ! -f "$skill_file" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $skill_file${NC}"
        ((ERRORS++))
        return 1
    fi
    
    # Verificar se template existe
    if [ ! -f "$template_file" ]; then
        echo -e "${YELLOW}⚠️  Template não encontrado para: $skill_name${NC}"
        ((SKIPPED++))
        return 1
    fi
    
    # Verificar se já tem seção de skills relacionadas
    if grep -q "## 🔗 Skills Relacionadas" "$skill_file"; then
        echo -e "${YELLOW}⚠️  $skill_name já tem seção de Skills Relacionadas (pulando)${NC}"
        ((SKIPPED++))
        return 1
    fi
    
    # Adicionar seção ao final do arquivo
    echo "" >> "$skill_file"
    echo "---" >> "$skill_file"
    echo "" >> "$skill_file"
    cat "$template_file" >> "$skill_file"
    
    echo -e "${GREEN}✅ $skill_name - Seção adicionada${NC}"
    ((UPDATED++))
    return 0
}

# Diretório base
SKILLS_DIR=".claude/skills"
TEMPLATES_DIR="$SKILLS_DIR/templates"

# Verificar se templates existem
if [ ! -d "$TEMPLATES_DIR" ]; then
    echo -e "${RED}❌ Diretório de templates não encontrado: $TEMPLATES_DIR${NC}"
    echo "Execute primeiro: python3 generate-templates.py"
    exit 1
fi

echo -e "${BLUE}📁 Processando skills em: $SKILLS_DIR${NC}"
echo ""

# Atualizar skills em _meta/
echo -e "${BLUE}=== Meta Skills ===${NC}"
for skill_dir in "$SKILLS_DIR/_meta"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        skill_file="$skill_dir/SKILL.md"
        template_file="$TEMPLATES_DIR/${skill_name}_related-skills.md"
        add_related_skills "$skill_file" "$template_file"
    fi
done

# Atualizar skills em core/
echo ""
echo -e "${BLUE}=== Core Skills ===${NC}"
for skill_dir in "$SKILLS_DIR/core"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        skill_file="$skill_dir/SKILL.md"
        template_file="$TEMPLATES_DIR/${skill_name}_related-skills.md"
        add_related_skills "$skill_file" "$template_file"
    fi
done

# Atualizar skills em features/
echo ""
echo -e "${BLUE}=== Feature Skills ===${NC}"
for skill_dir in "$SKILLS_DIR/features"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        skill_file="$skill_dir/SKILL.md"
        template_file="$TEMPLATES_DIR/${skill_name}_related-skills.md"
        add_related_skills "$skill_file" "$template_file"
    fi
done

# Atualizar skills em project-specific/
echo ""
echo -e "${BLUE}=== Project-Specific Skills ===${NC}"
for skill_dir in "$SKILLS_DIR/project-specific"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        skill_file="$skill_dir/SKILL.md"
        template_file="$TEMPLATES_DIR/${skill_name}_related-skills.md"
        add_related_skills "$skill_file" "$template_file"
    fi
done

# Atualizar skills em audit/
echo ""
echo -e "${BLUE}=== Audit Skills ===${NC}"
for skill_dir in "$SKILLS_DIR/audit"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        skill_file="$skill_dir/SKILL.md"
        template_file="$TEMPLATES_DIR/${skill_name}_related-skills.md"
        add_related_skills "$skill_file" "$template_file"
    fi
done

# Relatório final
echo ""
echo -e "${BLUE}${'='*70}${NC}"
echo -e "${GREEN}✅ Atualizados: $UPDATED${NC}"
echo -e "${YELLOW}⚠️  Pulados: $SKIPPED${NC}"
echo -e "${RED}❌ Erros: $ERRORS${NC}"
echo -e "${BLUE}${'='*70}${NC}"
echo ""

if [ $UPDATED -gt 0 ]; then
    echo -e "${GREEN}🎉 Atualização concluída com sucesso!${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Revisar mudanças: git diff $SKILLS_DIR"
    echo "   2. Commit: git add $SKILLS_DIR && git commit -m 'docs(skills): Adicionar interligações'"
    echo ""
else
    echo -e "${YELLOW}ℹ️  Nenhuma skill foi atualizada (já possuem seções ou templates faltando)${NC}"
fi

exit 0
