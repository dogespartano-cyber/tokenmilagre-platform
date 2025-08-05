# Integração Claude Code + Gemini CLI

## Visão Geral
Este documento apresenta ideias para integrar o Claude Code e Gemini CLI no mesmo projeto, aproveitando as capacidades locais de ambas as ferramentas sem necessidade de APIs externas.

## Ferramentas Disponíveis

### Claude Code
- Ferramentas de arquivo: Read, Write, Edit, MultiEdit
- Pesquisa: Grep, Glob
- Execução: Bash
- Gestão de tarefas: TodoWrite
- Busca web: WebSearch, WebFetch
- Agentes especializados: Task

### Gemini CLI (via MCP)
- `ask-gemini`: Análise e perguntas gerais
- `brainstorm`: Geração de ideias criativas
- `ping`: Teste de conectividade
- Modo sandbox para execução segura
- Modo changeMode para edições estruturadas

## Estratégias de Integração

### 1. **Divisão por Especialização**
```bash
# Claude para análise técnica e estrutural
claude-code --prompt "Analyze the codebase structure"

# Gemini para brainstorming e ideias criativas  
gemini --prompt "Brainstorm new features for this project"
```

### 2. **Pipeline Sequencial**
1. **Claude**: Análise inicial do código e identificação de problemas
2. **Gemini**: Geração de soluções criativas
3. **Claude**: Implementação das soluções escolhidas

### 3. **Colaboração em Tempo Real**
- Claude foca em: refactoring, debugging, testes, estrutura
- Gemini foca em: arquitetura, novas funcionalidades, otimizações

### 4. **Workflow Scripts**

#### Script de Análise Completa
```bash
#!/bin/bash
# analyze-project.sh

echo "=== Claude Analysis ==="
claude-code --prompt "Analyze code quality and suggest improvements"

echo "=== Gemini Brainstorm ==="
gemini --prompt "Based on this codebase, brainstorm 5 improvement ideas" -s
```

#### Script de Desenvolvimento
```bash
#!/bin/bash
# dev-workflow.sh

TASK="$1"

echo "=== Planning with Gemini ==="
gemini --prompt "Create implementation plan for: $TASK" --model gemini-2.5-flash

echo "=== Implementation with Claude ==="
claude-code --prompt "Implement the planned feature: $TASK"
```

### 5. **Configuração de Projeto**

#### `.claude-gemini-config.json`
```json
{
  "workflow": {
    "analysis": "claude",
    "planning": "gemini", 
    "implementation": "claude",
    "testing": "claude",
    "documentation": "both"
  },
  "gemini_settings": {
    "model": "gemini-2.5-pro",
    "sandbox": true
  },
  "claude_settings": {
    "use_todo": true,
    "auto_lint": true
  }
}
```

## Casos de Uso Específicos

### Desenvolvimento de Features
1. **Gemini**: Brainstorm da funcionalidade
2. **Claude**: Análise de viabilidade técnica
3. **Gemini**: Refinamento da arquitetura
4. **Claude**: Implementação e testes

### Debug e Otimização
1. **Claude**: Identificação de bugs/gargalos
2. **Gemini**: Sugestões de otimização criativas
3. **Claude**: Implementação das correções

### Revisão de Código
1. **Claude**: Análise técnica (sintaxe, padrões, testes)
2. **Gemini**: Sugestões de melhoria arquitetural
3. **Claude**: Aplicação das melhorias

## Automação com Aliases

### `.bashrc` / `.zshrc`
```bash
# Integração Claude + Gemini
alias cg-analyze='claude-code --prompt "Analyze current project" && gemini --prompt "Suggest improvements based on analysis"'
alias cg-feature='function _cg_feature() { gemini --prompt "Plan feature: $1" && claude-code --prompt "Implement planned feature: $1"; }; _cg_feature'
alias cg-debug='claude-code --prompt "Find bugs and issues" && gemini --prompt "Creative debugging solutions"'
alias cg-refactor='gemini --prompt "Refactoring strategies" && claude-code --prompt "Apply best refactoring suggestions"'
```

## Fluxo de Trabalho Recomendado

### Para Novos Projetos
```
Gemini (Arquitetura) → Claude (Setup) → Gemini (Features) → Claude (Implementação)
```

### Para Projetos Existentes
```
Claude (Análise) → Gemini (Melhorias) → Claude (Implementação) → Gemini (Otimização)
```

### Para Debugging
```
Claude (Identificação) → Gemini (Soluções) → Claude (Correção) → Claude (Testes)
```

## Vantagens da Integração

1. **Complementaridade**: Claude para precisão técnica, Gemini para criatividade
2. **Eficiência**: Cada ferramenta no que faz melhor
3. **Local**: Sem dependência de APIs externas
4. **Flexibilidade**: Pode alternar entre ferramentas conforme necessário
5. **Automação**: Scripts podem orquestrar o uso de ambas

## Considerações Técnicas

- Ambas as ferramentas mantêm contexto independente
- Transferência de contexto via arquivos temporários ou prompts estruturados
- Use o modo sandbox do Gemini para operações experimentais
- Claude gerencia melhor o estado do projeto (todos, arquivos)
- Gemini oferece melhor brainstorming e soluções criativas

## Próximos Passos

1. Criar scripts de automação personalizados
2. Definir convenções de nomenclatura para arquivos compartilhados
3. Estabelecer workflows específicos por tipo de projeto
4. Documentar padrões de prompts para cada ferramenta