#!/usr/bin/env python3
"""
Script de geração automática do SKILL-INDEX.md
Autor: Claude Code
Data: 2025-11-18
"""

import os
import json
from pathlib import Path
from datetime import datetime

# Configuração
SKILLS_DIR = Path("/home/user/tokenmilagre-platform/.claude/skills")
OUTPUT_FILE = SKILLS_DIR / "SKILL-INDEX.md"
TOKENS_PER_LINE = 3.68

# Categorias
CATEGORIES = {
    "_meta": "Meta",
    "core": "Core",
    "features": "Features",
    "audit": "Audit",
    "project-specific": "Project-Specific"
}

# Size limits por categoria
SIZE_LIMITS = {
    "_meta": 300,
    "core": 500,
    "features": 400,
    "audit": 350,
    "project-specific": 350
}

# Frequência de uso (baseado em SKILLS-ECOSYSTEM.md)
USAGE_FREQUENCY = {
    "project-context": "daily",
    "skills-navigator": "daily",
    "design-system": "daily",
    "tokenmilagre-database": "daily",
    "troubleshooting": "daily",
    "tokenmilagre-article-workflow": "weekly",
    "tokenmilagre-refactoring": "weekly",
    "tokenmilagre-testing": "weekly",
    "pages-reference": "weekly",
    "tokenmilagre-api-integrations": "weekly",
    "tokenmilagre-citations": "weekly",
    "tokenmilagre-content-quality": "weekly",
    "platform-audit": "monthly",
    "server-manager": "monthly",
    "tokenmilagre-scripts": "monthly",
    "tokenmilagre-copilot-tools": "monthly",
    "tokenmilagre-component-patterns": "monthly",
    "due-diligence-report": "occasional",
    "database-setup": "occasional",
    "tokenmilagre-url-security": "occasional",
    "project-manager-brutal-honesty": "occasional",
    "article-creation": "occasional",
    "chat-workflow": "occasional",
    "skill-optimization-playbook": "occasional"
}

def count_lines(filepath):
    """Conta linhas de um arquivo"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except:
        return 0

def find_skills():
    """Encontra todas as skills ativas (SKILL.md sem .backup)"""
    skills = []

    for category_dir in ["_meta", "core", "features", "audit", "project-specific"]:
        category_path = SKILLS_DIR / category_dir
        if not category_path.exists():
            continue

        for skill_file in category_path.rglob("SKILL.md"):
            # Ignora backups
            if ".backup" in str(skill_file):
                continue

            lines = count_lines(skill_file)
            tokens = int(lines * TOKENS_PER_LINE)

            # Extrai nome da skill
            skill_name = skill_file.parent.name

            # Determina categoria
            category = category_dir

            # Determina frequência
            frequency = USAGE_FREQUENCY.get(skill_name, "occasional")

            # Calcula limite
            limit = SIZE_LIMITS.get(category, 400)

            # Determina status
            if lines > limit:
                if lines > limit * 1.5:
                    status = "🔴 CRÍTICO"
                    priority = "🔥 URGENTE"
                else:
                    status = "🟡 ALTO"
                    priority = "⚠️ ALTA"
            else:
                status = "🟢 OK"
                priority = "-"

            # Calcula % de otimização recomendada
            if lines > limit:
                target_lines = limit
                reduction_pct = int(((lines - target_lines) / lines) * 100)
                opt_target = f"-{reduction_pct}%"
            else:
                opt_target = "-"

            skills.append({
                "name": skill_name,
                "category": category,
                "path": str(skill_file.relative_to(SKILLS_DIR)),
                "lines": lines,
                "tokens": tokens,
                "frequency": frequency,
                "limit": limit,
                "status": status,
                "priority": priority,
                "opt_target": opt_target
            })

    return skills

def generate_index(skills):
    """Gera conteúdo do SKILL-INDEX.md"""
    total_lines = sum(s["lines"] for s in skills)
    total_tokens = sum(s["tokens"] for s in skills)
    total_skills = len(skills)

    # Ordena por tamanho (maior primeiro)
    skills_by_size = sorted(skills, key=lambda x: x["lines"], reverse=True)

    # Skills por categoria
    skills_by_category = {}
    for skill in skills:
        cat = skill["category"]
        if cat not in skills_by_category:
            skills_by_category[cat] = []
        skills_by_category[cat].append(skill)

    # Skills críticas
    critical_skills = [s for s in skills if "🔴" in s["status"]]
    high_skills = [s for s in skills if "🟡" in s["status"]]

    # Gera markdown
    md = f"""# Token Milagre - Skills Index

**Última atualização**: {datetime.now().strftime("%Y-%m-%d %H:%M UTC")}
**Total de skills**: {total_skills}
**Total de linhas**: {total_lines:,}
**Tokens estimados**: ~{total_tokens:,} (usando {TOKENS_PER_LINE} tokens/linha)

---

## 📊 Ranking por Tamanho

| Rank | Skill | Linhas | Tokens | Categoria | Frequência | Status | Otimização |
|------|-------|--------|--------|-----------|------------|--------|------------|
"""

    for i, skill in enumerate(skills_by_size, 1):
        md += f"| {i} | {skill['name']} | {skill['lines']:,} | ~{skill['tokens']:,} | {skill['category']} | {skill['frequency']} | {skill['status']} | {skill['opt_target']} |\n"

    md += f"""
---

## 🎯 Status de Otimização

### 🔴 Skills Críticas (Excede limite em >50%)

"""

    if critical_skills:
        for skill in critical_skills:
            md += f"- **{skill['name']}**: {skill['lines']:,} linhas (limite: {skill['limit']}) - {skill['opt_target']} recomendado\n"
    else:
        md += "✅ Nenhuma skill crítica!\n"

    md += f"""
### 🟡 Skills com Oportunidades (Excede limite)

"""

    if high_skills:
        for skill in high_skills:
            md += f"- **{skill['name']}**: {skill['lines']:,} linhas (limite: {skill['limit']}) - {skill['opt_target']} recomendado\n"
    else:
        md += "✅ Todas dentro do limite!\n"

    md += f"""
### 🟢 Skills OK (Dentro do limite)

Total: {len([s for s in skills if '🟢' in s['status']])} skills

---

## 📋 Skills por Categoria

"""

    for category, skills_in_cat in sorted(skills_by_category.items()):
        total_cat_lines = sum(s["lines"] for s in skills_in_cat)
        total_cat_tokens = sum(s["tokens"] for s in skills_in_cat)

        md += f"""
### {CATEGORIES[category]} ({category}/) - {len(skills_in_cat)} skills

**Total**: {total_cat_lines:,} linhas (~{total_cat_tokens:,} tokens)
**Limite por skill**: {SIZE_LIMITS[category]} linhas

| Skill | Linhas | Status | Frequência |
|-------|--------|--------|------------|
"""

        for skill in sorted(skills_in_cat, key=lambda x: x["lines"], reverse=True):
            md += f"| {skill['name']} | {skill['lines']:,} | {skill['status']} | {skill['frequency']} |\n"

    md += f"""
---

## 📈 Métricas de Eficiência

### Por Frequência de Uso

**Daily** ({len([s for s in skills if s['frequency'] == 'daily'])} skills):
"""

    for freq, label in [("daily", "Daily"), ("weekly", "Weekly"), ("monthly", "Monthly"), ("occasional", "Occasional")]:
        freq_skills = [s for s in skills if s["frequency"] == freq]
        total_freq_lines = sum(s["lines"] for s in freq_skills)

        md += f"""
**{label}** ({len(freq_skills)} skills): {total_freq_lines:,} linhas
"""

        for skill in sorted(freq_skills, key=lambda x: x["lines"]):
            md += f"- {skill['name']}: {skill['lines']:,}L\n"

    md += f"""
---

## 🎯 Recomendações de Otimização

### Size Limits por Categoria

```yaml
skill_size_limits:
  _meta: {SIZE_LIMITS['_meta']} lines max
  core: {SIZE_LIMITS['core']} lines max
  features: {SIZE_LIMITS['features']} lines max
  audit: {SIZE_LIMITS['audit']} lines max
  project-specific: {SIZE_LIMITS['project-specific']} lines max
```

### Próximas Ações

"""

    # Ações urgentes
    urgent_skills = [s for s in skills_by_size if "🔴" in s["status"] or ("🟡" in s["status"] and s["lines"] > 600)]

    if urgent_skills:
        md += "**Urgente** (Esta Semana):\n"
        for skill in urgent_skills[:3]:
            target = int(skill["lines"] * (1 - int(skill["opt_target"].strip("-%")) / 100))
            md += f"- Otimizar **{skill['name']}**: {skill['lines']:,} → ~{target:,} linhas ({skill['opt_target']})\n"

    md += f"""

---

## 📚 Referências

- **Geração**: Script automático `generate-skill-index.py`
- **Auditoria completa**: `BRUTAL-AUDIT-REPORT.md`
- **Workflow**: `SKILLS-WORKFLOW.md`
- **Ecosystem**: `SKILLS-ECOSYSTEM.md`

---

**Gerado automaticamente por**: `generate-skill-index.py`
**Próxima atualização**: Rodar script após modificações
**CI/CD**: Configurar pre-commit hook para auto-update
"""

    return md

def main():
    print("🔍 Procurando skills...")
    skills = find_skills()

    print(f"✅ Encontradas {len(skills)} skills")
    print(f"📊 Total: {sum(s['lines'] for s in skills):,} linhas")

    print("📝 Gerando SKILL-INDEX.md...")
    content = generate_index(skills)

    print(f"💾 Salvando em {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ SKILL-INDEX.md atualizado com sucesso!")

    # Estatísticas
    critical = len([s for s in skills if "🔴" in s["status"]])
    high = len([s for s in skills if "🟡" in s["status"]])
    ok = len([s for s in skills if "🟢" in s["status"]])

    print(f"\n📊 Status:")
    print(f"  🔴 Crítico: {critical}")
    print(f"  🟡 Alto: {high}")
    print(f"  🟢 OK: {ok}")

if __name__ == "__main__":
    main()
