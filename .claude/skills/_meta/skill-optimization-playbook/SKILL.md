---
name: skill-optimization-playbook
description: "META-SKILL: Processo sistemático e repetível para otimizar skills do ecossistema Token Milagre. TRIGGERS: 'otimizar skill', 'reduzir tokens', 'skill muito grande', 'skill optimization', 'playbook'. Use quando precisar otimizar uma skill, reduzir verbosidade, eliminar duplicação ou aplicar batch optimization."
allowed-tools: Read, Grep, Bash, Edit, Write
---

# 📖 Skill Optimization Playbook

**META-SKILL** - Processo sistemático para otimizar skills do ecossistema

**Case de Sucesso**: `project-context` (964 → 356 linhas, -64% tokens)
**Economia**: ~2,000 tokens por conversa
**Tempo de execução**: ~1h por skill

---

## 🎯 Propósito

Documentar processo **repetível e escalável** para otimizar skills grandes, eliminando duplicação, verbosidade e movendo conteúdo para o local correto.

**Por quê isso importa?**
- Skills são carregadas em TODA conversa
- Cada linha extra = tokens desperdiçados infinitamente
- Conteúdo duplicado = manutenção 2x mais difícil
- Conteúdo no lugar errado = desenvolvedores confusos

---

## 📊 Quando Otimizar uma Skill

### ✅ OTIMIZE Quando:

1. **Tamanho > 700 linhas**
   - Exceção: Skills puramente técnicas (database, troubleshooting)
   - Motivo: Provavelmente tem duplicação ou verbosidade

2. **Conteúdo Duplicado**
   - Mesma informação aparece em 2+ skills
   - Exemplos repetidos excessivamente
   - Padrões de código que poderiam ser referências

3. **Verbosidade Excessiva**
   - Explicações longas demais
   - Múltiplos exemplos para o mesmo conceito
   - Seções > 100 linhas

4. **Conteúdo no Lugar Errado**
   - Informação técnica específica em skill genérica
   - Snapshots temporais (auditorias, relatórios) em skill permanente
   - Workflows detalhados em skill de overview

5. **Baixa Frequência de Uso**
   - Skill com conteúdo que raramente é necessário
   - Informação histórica que poderia estar em docs/
   - Tutoriais extensos que poderiam ser links externos

### ❌ NÃO OTIMIZE Quando:

1. **Skill < 400 linhas**
   - Já está concisa
   - Otimização não vale o tempo

2. **Skill puramente técnica e especializada**
   - `troubleshooting` (1,648 linhas) - Histórico técnico crítico
   - `tokenmilagre-database` (1,247 linhas) - Referência técnica completa
   - Motivo: Conteúdo não pode ser simplificado sem perder valor

3. **Skill recém-criada** (< 1 mês)
   - Ainda em evolução
   - Padrões de uso não estabelecidos

4. **Redução esperada < 30%**
   - ROI baixo demais
   - Foque em wins maiores primeiro

---

## 🔄 Processo de Otimização (6 Passos)

### PASSO 1: Análise Inicial

**Objetivo**: Entender tamanho, estrutura e conteúdo da skill

**Comandos**:
```bash
# Tamanho atual
wc -l .claude/skills/CATEGORIA/NOME-SKILL/SKILL.md

# Estrutura de seções
grep "^##" .claude/skills/CATEGORIA/NOME-SKILL/SKILL.md | wc -l

# Blocos de código
grep -c '```' .claude/skills/CATEGORIA/NOME-SKILL/SKILL.md

# Listas
grep -c "^- " .claude/skills/CATEGORIA/NOME-SKILL/SKILL.md

# Exemplos
grep -ci "example\|exemplo" .claude/skills/CATEGORIA/NOME-SKILL/SKILL.md
```

**Output esperado**:
```
Linhas: 932
Seções (##): 71
Código blocks (```): 58
Listas (- ): 144
Exemplos: 23
```

**Decision**:
- Se linhas > 700 → Prossiga para Passo 2
- Se linhas < 700 → Avalie se verbosidade justifica otimização

---

### PASSO 2: Identificação de Duplicação

**Objetivo**: Encontrar conteúdo que existe em múltiplas skills

**Checklist de Duplicação**:

```markdown
## 🔍 Checklist de Duplicação

- [ ] **Conceitos Fundamentais** - Aparece em outra skill? (ex: "O que é Prisma?")
- [ ] **Regras de Projeto** - Já está em project-context?
- [ ] **Stack Tecnológica** - Duplica info de project-context?
- [ ] **Workflow de Desenvolvimento** - Duplica server-manager?
- [ ] **Database Patterns** - Duplica tokenmilagre-database?
- [ ] **Testing Patterns** - Duplica tokenmilagre-testing?
- [ ] **Brutal Honesty Guidelines** - Duplica project-manager-brutal-honesty?
- [ ] **Navegação de Skills** - Duplica skills-navigator?
```

**Comandos para detectar duplicação**:
```bash
# Procurar por conceitos comuns
grep -i "database\|prisma\|postgres" .claude/skills/CATEGORIA/NOME-SKILL/SKILL.md | wc -l

# Comparar com outra skill
diff <(grep "^##" .claude/skills/CATEGORIA/SKILL-A/SKILL.md) \
     <(grep "^##" .claude/skills/CATEGORIA/SKILL-B/SKILL.md)
```

**Ação**:
- Marque seções duplicadas para remoção
- Anote skill de destino para cada seção

---

### PASSO 3: Análise de Verbosidade

**Objetivo**: Identificar conteúdo que pode ser condensado

**Checklist de Verbosidade**:

```markdown
## 📝 Checklist de Verbosidade

- [ ] **Seções > 100 linhas** - Podem ser condensadas?
- [ ] **Múltiplos Exemplos** - 3+ exemplos para o mesmo conceito?
- [ ] **Explicações Longas** - Pode ser resumido em bullet points?
- [ ] **Histórico Detalhado** - Deve estar em docs/ não em skill?
- [ ] **Tutoriais Completos** - Pode ser link externo?
- [ ] **Tabelas Extensas** - Podem ser simplificadas?
- [ ] **Code Blocks Longos** - Podem ser templates/snippets?
```

**Técnica de Condensação**:

**ANTES (Verboso)**:
```markdown
## Como Usar Prisma em Server Components

O Prisma é um ORM moderno que permite acessar o banco de dados
diretamente de Server Components no Next.js. Isso elimina a
necessidade de criar API routes separadas, reduz a latência,
e simplifica a arquitetura da aplicação.

### Exemplo Completo

Aqui está um exemplo completo de como buscar artigos do banco
de dados usando Prisma em um Server Component:

[50+ linhas de código]
```

**DEPOIS (Condensado)**:
```markdown
## Prisma em Server Components

Acesse banco direto, sem API routes. Reduz latência e simplifica código.

```typescript
import { prisma } from '@/lib/prisma';
export default async function Page() {
  const articles = await prisma.article.findMany();
  return <div>{articles.map(...)}</div>;
}
```

**📚 Detalhes**: Ver [`tokenmilagre-database`](link)
```

**Redução**: ~80 linhas → 15 linhas (-81%)

---

### PASSO 4: Plano de Otimização

**Objetivo**: Criar roadmap detalhado de mudanças

**Template de Plano**:

```markdown
# Plano de Otimização: [NOME DA SKILL]

**Data**: YYYY-MM-DD
**Analista**: Claude Code

## 📊 Métricas Atuais

- Linhas: XXX
- Seções: XX
- Código blocks: XX
- Estimativa de tokens: ~X,XXX

## 🎯 Meta de Otimização

- Linhas alvo: XXX (redução: -XX%)
- Tokens economizados: ~X,XXX por conversa
- Tempo estimado: Xh

## ✂️ Mudanças Planejadas

### 1. REMOVER Duplicação (XX linhas)

| Seção | Linhas | Motivo | Destino |
|-------|--------|--------|---------|
| Database Optimization | 172 | Duplica tokenmilagre-database | Mover para tokenmilagre-database |
| Brutal Honesty Mode | 8 | Duplica project-manager-brutal-honesty | Remover, deixar referência |

### 2. CONDENSAR Verbosidade (XX linhas)

| Seção | Antes | Depois | Técnica |
|-------|-------|--------|---------|
| Propósito do Projeto | 124 | 50 | Bullet points, remover exemplos redundantes |
| Workflow Development | 135 | 40 | Resumo + link para server-manager |

### 3. MOVER para Docs (XX linhas)

| Conteúdo | Linhas | Destino |
|----------|--------|---------|
| Auditoria 2025-11-13 | 200 | docs/audits/2025-11-13.md |
| Migration Neon → Supabase | 150 | docs/MIGRACAO-SUPABASE.md |

## 📈 Resultado Esperado

**ANTES**:
- Linhas: XXX
- Tokens: ~X,XXX

**DEPOIS**:
- Linhas: XXX (-XX%)
- Tokens: ~X,XXX (-XX%)

**Economia**: ~X,XXX tokens por conversa × ∞ conversas = ♾️
```

---

### PASSO 5: Execução

**Objetivo**: Aplicar mudanças planejadas de forma sistemática

**Workflow de Execução**:

```bash
# 1. BACKUP OBRIGATÓRIO
cd .claude/skills/CATEGORIA/NOME-SKILL
cp SKILL.md SKILL.backup.md
echo "✅ Backup criado"

# 2. CRIAR ARQUIVO OTIMIZADO (versão draft)
# Usar Write tool para gerar SKILL-OPTIMIZED.md

# 3. VALIDAR ESTRUTURA
echo "=== COMPARAÇÃO ==="
echo "Original: $(wc -l SKILL.md | awk '{print $1}') linhas"
echo "Otimizado: $(wc -l SKILL-OPTIMIZED.md | awk '{print $1}') linhas"
echo "Redução: $(($(wc -l SKILL.md | awk '{print $1}') - $(wc -l SKILL-OPTIMIZED.md | awk '{print $1}'))) linhas"

# 4. MOVER CONTEÚDO PARA SKILLS DE DESTINO
# Ex: Adicionar seção em tokenmilagre-database usando Edit tool

# 5. SUBSTITUIR ARQUIVO ORIGINAL
mv SKILL-OPTIMIZED.md SKILL.md
echo "✅ Otimização aplicada"

# 6. COMMIT
git add SKILL.md SKILL.backup.md
git commit -m "refactor(skills): Optimize [NOME-SKILL]: -XX% tokens"
git push
```

**Checklist de Validação**:
```markdown
- [ ] Backup criado (SKILL.backup.md)
- [ ] Arquivo otimizado gerado (SKILL-OPTIMIZED.md)
- [ ] Comparação de tamanho OK (redução >= 30%)
- [ ] Conteúdo movido para skills de destino
- [ ] Links de referência atualizados
- [ ] Nenhuma informação crítica perdida
- [ ] Estrutura markdown válida
- [ ] Commit com mensagem clara
```

---

### PASSO 6: Validação e Medição

**Objetivo**: Confirmar que otimização foi bem-sucedida

**Métricas de Sucesso**:

```bash
# Comparar antes/depois
echo "=== MÉTRICAS DE SUCESSO ==="
echo "Redução de linhas: XX%"
echo "Redução de tokens: ~X,XXX"
echo "Seções: XX → XX"
echo "Código blocks: XX → XX"

# Validar que skill ainda funciona
# (testar em conversa real se possível)
```

**Critérios de Aprovação**:
- ✅ Redução >= 30%
- ✅ Nenhuma informação crítica perdida
- ✅ Links de referência válidos
- ✅ Skill ainda compreensível e útil

**Se FALHOU** (redução < 30%):
- Revisar Passo 3 (Verbosidade)
- Considerar se skill deve ser subdividida
- Restaurar backup se necessário

---

## 📐 Padrões de Destino

### Pattern 1: Conteúdo Técnico Específico

**Quando**: Informação técnica detalhada em skill genérica

**Destino**: Skill técnica especializada

**Exemplo**:
- ❌ Database Optimization em `project-context`
- ✅ Database Optimization em `tokenmilagre-database`

**Template de Movimentação**:
```markdown
<!-- Em SKILL ORIGEM (após otimização) -->
**⚠️ Database Management**: Ver skill [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) para:
- Quota management e otimizações
- Prisma schema e migrations
- Query optimization
- Build configuration

<!-- Em SKILL DESTINO (após adicionar conteúdo) -->
## ⚠️ Database Optimization - Free Tier Quota Management

[Conteúdo completo movido de project-context]

**Version:** 1.2.0 (Added Database Optimization section from project-context)
```

---

### Pattern 2: Snapshot Temporal

**Quando**: Auditoria, relatório, análise com data específica

**Destino**: `docs/` como arquivo histórico

**Exemplo**:
- ❌ Auditoria 2025-11-13 completa em `platform-audit` skill (200+ linhas)
- ✅ Template de auditoria em skill + snapshot completo em `docs/audits/2025-11-13.md`

**Template de Movimentação**:
```markdown
<!-- Em SKILL (após otimização) -->
## Como Executar Auditoria

[Template e processo - 50 linhas]

**📊 Auditorias Passadas**:
- [2025-11-13 - Full Platform Audit](../../../docs/audits/2025-11-13-full-audit.md)
- [2025-08-01 - Security Audit](../../../docs/audits/2025-08-01-security.md)

<!-- Em docs/audits/2025-11-13-full-audit.md -->
# Platform Audit - 2025-11-13

[Snapshot completo com todas as métricas e análises - 200+ linhas]
```

---

### Pattern 3: Workflow Detalhado

**Quando**: Processo passo-a-passo em skill de overview

**Destino**: Skill especializada de workflow

**Exemplo**:
- ❌ Server Management workflow completo em `project-context` (135 linhas)
- ✅ Resumo em `project-context` + detalhes em `server-manager`

**Template de Movimentação**:
```markdown
<!-- Em SKILL ORIGEM (após otimização) -->
## 🔄 Workflow de Desenvolvimento

### ⚡ Fluxo Resumido

```
1. Desenvolver → Claude Web (preview automático)
2. Testar local → server-manager.sh start-preview
3. Validar → Testes manuais
4. Produção → server-manager.sh promote-preview
```

**📚 Detalhes completos**: Ver skill [`server-manager`](../../project-specific/server-manager/SKILL.md)

<!-- Em SKILL DESTINO -->
## Workflow Completo - Claude Web + CLI

[Workflow detalhado com todos os comandos e exemplos - 135 linhas]
```

---

### Pattern 4: Exemplos Excessivos

**Quando**: 3+ exemplos do mesmo conceito

**Ação**: Manter 1-2 exemplos essenciais, remover redundantes

**Template**:
```markdown
<!-- ANTES (verboso) -->
## Exemplos de Uso

### Exemplo 1: Buscar Todos Artigos
[Código - 20 linhas]

### Exemplo 2: Buscar Artigos Publicados
[Código - 20 linhas]

### Exemplo 3: Buscar Artigos por Categoria
[Código - 20 linhas]

### Exemplo 4: Buscar com Paginação
[Código - 20 linhas]

<!-- DEPOIS (conciso) -->
## Exemplos

```typescript
// Buscar com filtros
const articles = await prisma.article.findMany({
  where: { published: true, category: 'bitcoin' },
  take: 10,
  skip: 0
});
```

**📚 Mais exemplos**: Ver [`tokenmilagre-database`](link) → Query Optimization
```

---

### Pattern 5: Conceitos Duplicados

**Quando**: Mesma explicação em múltiplas skills

**Ação**: Manter em UMA skill autoritativa, referenciar nas outras

**Exemplo**:
- ❌ "O que é Prisma?" em 3 skills diferentes
- ✅ Explicação completa em `tokenmilagre-database`, referência nas outras

**Template**:
```markdown
<!-- SKILL AUTORITATIVA -->
## O Que É Prisma

Prisma é um ORM (Object-Relational Mapping) moderno para Node.js e TypeScript...

[Explicação completa - 50 linhas]

<!-- OUTRAS SKILLS (apenas referência) -->
## Database Access

Este projeto usa Prisma ORM para acesso ao banco. Ver [`tokenmilagre-database`](link) para detalhes completos sobre Prisma, schema, migrations.

```typescript
import { prisma } from '@/lib/prisma';
const articles = await prisma.article.findMany();
```
```

---

## 🎯 Decision Tree: Otimizar vs Não Otimizar

```
Skill tem > 700 linhas?
│
├─ NÃO → Não otimize agora
│         (ROI muito baixo)
│
└─ SIM → É skill técnica especializada?
          (troubleshooting, database)
          │
          ├─ SIM → Avaliar caso a caso
          │         (pode ter duplicação mesmo sendo técnica)
          │
          └─ NÃO → Tem conteúdo duplicado em outras skills?
                    │
                    ├─ SIM → OTIMIZE! (alta prioridade)
                    │         Redução esperada: 40-60%
                    │
                    └─ NÃO → Tem verbosidade excessiva?
                              (seções > 100 linhas, 3+ exemplos)
                              │
                              ├─ SIM → OTIMIZE! (média prioridade)
                              │         Redução esperada: 30-50%
                              │
                              └─ NÃO → Skill está bem otimizada
                                        Não precisa de ação agora
```

---

## 📊 Métricas de Benchmark

**Baseado em `project-context` otimização**:

| Métrica | Antes | Depois | Economia |
|---------|-------|--------|----------|
| Linhas | 964 | 356 | -608 (-64%) |
| Tokens | ~3,500 | ~1,500 | -2,000 (-57%) |
| Seções (##) | ~60 | ~35 | -25 (-42%) |
| Tempo de leitura | ~8min | ~3min | -5min (-62%) |

**Economia por conversa**: ~2,000 tokens
**Conversas por mês**: ~100
**Economia mensal**: ~200,000 tokens
**ROI**: Tempo investido (1h) vs economia infinita = ∞

---

## 🚀 Batch Optimization Strategy

**Quando otimizar múltiplas skills**:

### Fase 1: Priorização (30min)

```bash
# Listar todas skills por tamanho
find .claude/skills -name "SKILL.md" -exec wc -l {} + | sort -rn > skill-sizes.txt

# Identificar top candidates (> 700 linhas)
awk '$1 > 700' skill-sizes.txt

# Criar matriz de prioridade
# Alta: Duplicação + Verbosidade + > 800 linhas
# Média: Verbosidade ou Duplicação + > 700 linhas
# Baixa: Apenas tamanho grande
```

### Fase 2: Execução em Batch (4-6h)

**Ordem recomendada**:
1. Skills META (_meta/) - Afetam todas as outras
2. Skills CORE (core/) - Base da plataforma
3. Skills FEATURES (features/) - Funcionalidades
4. Skills PROJECT-SPECIFIC (project-specific/)
5. Skills AUDIT (audit/)

**Processo**:
```markdown
Para cada skill:
1. Executar Passos 1-6 do processo
2. Commitar individualmente
3. Atualizar metrics log
4. Próxima skill

Total: 5-8 skills em 4-6 horas
```

### Fase 3: Validação (30min)

```bash
# Calcular economia total
echo "=== BATCH OPTIMIZATION RESULTS ==="
echo "Skills otimizadas: X"
echo "Linhas removidas: X,XXX"
echo "Tokens economizados: ~XX,XXX por conversa"
echo "Redução média: XX%"

# Verificar integridade
find .claude/skills -name "*.md" -exec grep -l "\[.*\](.*)" {} \; | xargs -I {} sh -c 'echo "Checking links in {}"; grep -o "\[.*\](.*)" {}'
```

---

## 📚 Case Studies

### Case 1: project-context (SUCCESS ✅)

**Antes**: 964 linhas, ~3,500 tokens
**Depois**: 356 linhas, ~1,500 tokens
**Redução**: -64%
**Tempo**: 1h

**Mudanças aplicadas**:
- ✂️ Database Optimization (172 linhas) → tokenmilagre-database
- ✂️ Propósito verboso (124 → 50 linhas)
- ✂️ Workflow detalhado (135 → 40 linhas)
- ✂️ Proactive Skills (152 → 60 linhas)

**Lições aprendidas**:
- Backup é ESSENCIAL
- Preview antes de commit
- Atualizar skills de destino ANTES de remover da origem

---

## 🎓 Best Practices

### ✅ DO:

1. **Sempre criar backup** antes de modificar
2. **Validar links** após otimização
3. **Testar skill** em conversa real
4. **Documentar mudanças** no commit message
5. **Atualizar versão** da skill
6. **Preservar informação crítica**

### ❌ DON'T:

1. **Não otimize sem backup**
2. **Não remova informação única** sem mover para outro lugar
3. **Não quebre links** para outras skills
4. **Não otimize tudo de uma vez** (faça incremental)
5. **Não ignore ROI** (tempo vs economia)

---

## 📖 Instructions for Claude

When this playbook is invoked:

1. **Use como REFERÊNCIA** para otimizar qualquer skill
2. **Siga o processo de 6 passos** rigorosamente
3. **Documente TUDO** no plano de otimização
4. **Peça aprovação** do usuário antes de executar mudanças
5. **Valide resultados** após otimização
6. **Atualize este playbook** com novos learnings

**Modo de operação**:
- Para 1 skill: Execute processo completo
- Para batch (5-8 skills): Use Batch Optimization Strategy

---

## 🔄 Continuous Improvement

Este playbook é um **documento vivo**. Após cada otimização:

1. Documente learnings em Case Studies
2. Atualize métricas de benchmark
3. Refine decision tree se necessário
4. Adicione novos padrões identificados

---

**Skill criada por**: Claude Code
**Data de criação**: 2025-11-17
**Última atualização**: 2025-11-17
**Versão**: 1.0.0
**Case Studies**: 1 (project-context)
**Skills otimizadas com este playbook**: 1
**Economia total gerada**: ~2,000 tokens/conversa
