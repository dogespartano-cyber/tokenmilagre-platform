# docs-local/

Este diretório contém **documentação local e específica do desenvolvedor** que **não deve ser versionada** no Git.

---

## 📁 Estrutura

```
docs-local/
├── .gitignore                    # Ignora arquivos sensíveis
├── README.md                     # Este arquivo (versionado)
├── CLAUDE-MEMORY.example.md      # Template versionado ✅
├── CLAUDE-MEMORY.md              # Seu arquivo pessoal ❌ (não commitado)
├── LOG.md                        # Seu log pessoal ❌ (não commitado)
└── sugestões.md                  # Suas ideias ❌ (não commitadas)
```

### ✅ Arquivos Versionados (commitados)
- `README.md` - Esta documentação
- `CLAUDE-MEMORY.example.md` - Template para outros desenvolvedores
- `.gitignore` - Configuração de arquivos ignorados

### ❌ Arquivos NÃO Versionados (ignorados)
- `CLAUDE-MEMORY.md` - **Sua versão personalizada** com informações específicas
- `LOG.md` - Seu histórico de desenvolvimento
- `sugestões.md` - Suas ideias e backlog pessoal

---

## 🚀 Setup Inicial

### 1. Copiar o Template

```bash
cd docs-local/
cp CLAUDE-MEMORY.example.md CLAUDE-MEMORY.md
```

### 2. Personalizar o CLAUDE-MEMORY.md

Abra `CLAUDE-MEMORY.md` e customize:

- **Links oficiais** - Adicione seus links reais (Telegram, Twitter, etc)
- **Notas pessoais** - Adicione comandos customizados, preferências
- **Histórico** - Documente suas decisões e mudanças importantes

### 3. Criar Arquivos Opcionais

```bash
# Log de desenvolvimento
touch LOG.md

# Sugestões e ideias
touch sugestões.md
```

---

## 📖 Uso com Claude Code

### Skill `project-context`

A skill `project-context` carrega automaticamente o `CLAUDE-MEMORY.md` no início de cada conversa.

**Como funciona**:
1. Você invoca: `project-context` skill
2. Claude lê: `docs-local/CLAUDE-MEMORY.md`
3. Claude entende: Regras críticas, filosofia, arquitetura

**Se o arquivo não existir**:
- Claude usará `docs-local/CLAUDE-MEMORY.example.md` como fallback
- Você receberá um aviso para criar sua versão personalizada

### Outros Arquivos

- **LOG.md** - Histórico detalhado de mudanças e decisões técnicas
  - Claude consultará quando precisar de contexto histórico

- **sugestões.md** - Backlog de ideias e melhorias
  - Claude consultará antes de sugerir novas features

---

## 🔒 Segurança

### ⚠️ NUNCA Commite Estes Arquivos

O `.gitignore` já está configurado para ignorar:
- `CLAUDE-MEMORY.md`
- `LOG.md`
- `sugestões.md`

**Por quê?**
- Podem conter informações sensíveis (caminhos, usernames)
- São específicos do seu ambiente de desenvolvimento
- Outros desenvolvedores devem criar suas próprias versões

### ✅ Sempre Commite

- `CLAUDE-MEMORY.example.md` - Template sem informações sensíveis
- `README.md` - Esta documentação
- `.gitignore` - Configuração de segurança

---

## 📝 Boas Práticas

### 1. Mantenha o CLAUDE-MEMORY.md Atualizado

Sempre que houver mudanças significativas:
- Nova feature importante
- Mudança de arquitetura
- Novas regras ou processos
- Links ou credenciais atualizados

### 2. Use o LOG.md Regularmente

Documente:
- Decisões técnicas e seus motivos
- Problemas encontrados e soluções
- Experimentos e resultados
- Refatorações importantes

### 3. Organize o sugestões.md

Categorize ideias:
```markdown
## 🚀 Próximas Features
- [ ] Feature 1
- [ ] Feature 2

## 🐛 Bugs Conhecidos
- [ ] Bug 1
- [ ] Bug 2

## 🎨 Melhorias de Design
- [ ] Melhoria 1
```

---

## 🤝 Contribuindo

Se você é um novo desenvolvedor:

1. **Copie o template**: `cp CLAUDE-MEMORY.example.md CLAUDE-MEMORY.md`
2. **Personalize**: Adicione suas informações
3. **Não commite**: Seus arquivos locais ficam apenas no seu ambiente
4. **Mantenha o .example atualizado**: Se adicionar seções úteis, atualize o `.example.md` (este sim é commitado)

---

## 📚 Mais Informações

- **Skills disponíveis**: `.claude/skills/`
- **Skill principal**: `.claude/skills/project-context/SKILL.md`
- **Gitignore principal**: `../.gitignore` (raiz do projeto)

---

**Última atualização**: 2025-11-10
**Mantido por**: Token Milagre Team
