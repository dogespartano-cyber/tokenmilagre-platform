#!/usr/bin/env python3
"""
Script para gerar templates de "Skills Relacionadas" para todas as 23 skills
Usa o arquivo SKILLS-RELATIONSHIPS.json como fonte de verdade
"""

import json
import os
from pathlib import Path

# Cores para terminal
class Colors:
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def load_relationships():
    """Carrega o JSON de relacionamentos"""
    json_path = Path(__file__).parent / 'SKILLS-RELATIONSHIPS.json'
    
    if not json_path.exists():
        print(f"{Colors.RED}❌ Erro: SKILLS-RELATIONSHIPS.json não encontrado{Colors.NC}")
        return None
    
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_templates_dir():
    """Cria diretório de templates"""
    templates_dir = Path(__file__).parent / 'templates'
    templates_dir.mkdir(exist_ok=True)
    return templates_dir

def generate_template(skill_name, skill_data):
    """Gera template de seção "Skills Relacionadas" para uma skill"""
    template = skill_data.get('template', '')
    
    if not template:
        print(f"{Colors.YELLOW}⚠️  Sem template para: {skill_name}{Colors.NC}")
        return None
    
    return template

def save_template(templates_dir, skill_name, content):
    """Salva template em arquivo"""
    filename = f"{skill_name}_related-skills.md"
    filepath = templates_dir / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return filepath

def main():
    print(f"{Colors.BLUE}🚀 Gerando templates de Skills Relacionadas...{Colors.NC}\n")
    
    # Carregar dados
    data = load_relationships()
    if not data:
        return 1
    
    # Criar diretório
    templates_dir = create_templates_dir()
    
    # Estatísticas
    total = len(data['skills'])
    generated = 0
    skipped = 0
    
    # Gerar templates
    for skill_name, skill_data in data['skills'].items():
        template_content = generate_template(skill_name, skill_data)
        
        if template_content:
            filepath = save_template(templates_dir, skill_name, template_content)
            print(f"{Colors.GREEN}✅ {skill_name:40s} → {filepath.name}{Colors.NC}")
            generated += 1
        else:
            print(f"{Colors.YELLOW}⚠️  {skill_name:40s} → SEM TEMPLATE{Colors.NC}")
            skipped += 1
    
    # Relatório final
    print(f"\n{Colors.BLUE}{'='*70}{Colors.NC}")
    print(f"{Colors.GREEN}✅ Templates gerados: {generated}/{total}{Colors.NC}")
    if skipped > 0:
        print(f"{Colors.YELLOW}⚠️  Pulados (sem template): {skipped}/{total}{Colors.NC}")
    print(f"{Colors.BLUE}📁 Diretório: {templates_dir}{Colors.NC}")
    print(f"{Colors.BLUE}{'='*70}{Colors.NC}\n")
    
    print(f"{Colors.GREEN}🎉 Concluído!{Colors.NC}\n")
    print(f"📋 Próximos passos:")
    print(f"   1. Revisar templates: ls -la {templates_dir}")
    print(f"   2. Executar script de atualização: bash UPDATE-ALL-SKILLS.sh")
    print(f"   3. Validar mudanças: git diff .claude/skills\n")
    
    return 0

if __name__ == '__main__':
    exit(main())
