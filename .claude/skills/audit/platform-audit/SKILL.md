---
name: platform-audit
description: "Processo e template para auditoria técnica + estratégica da plataforma. TRIGGERS: 'auditoria', 'platform audit', 'análise completa', 'health check'. Use para executar análises periódicas de saúde técnica, arquitetura, ROI e sustentabilidade."
allowed-tools: Read, Grep, Bash
---

# 🔴 PLATFORM AUDIT - Process & Template

**Processo sistemático para auditoria completa da plataforma Token Milagre**

---

## 🎯 Propósito

Executar auditoria trimestral completa que avalia:
- ✅ Saúde técnica (código, testes, segurança)
- ✅ Arquitetura (escalabilidade, performance)
- ✅ Viabilidade de negócio (PMF, ROI, sustentabilidade)
- ✅ Riscos críticos (técnicos, mercado, financeiros)

---

## 📅 Quando Executar

**Frequência**: Trimestral (Q1, Q2, Q3, Q4)
**Triggers**:
- Antes de releases importantes
- Após problemas críticos
- Mudanças estratégicas de direção
- Novos investidores/stakeholders

**Duração estimada**: 2-4 horas (dependendo do tamanho do codebase)

---

## 📊 Auditorias Passadas

**Histórico completo**:
- [2025-11-13 - Full Platform Audit](../../../docs/audits/2025-11-13-platform-audit.md) - Auditoria completa técnica + estratégica (932 linhas)

---

## 🔄 Processo de Auditoria (6 Passos)

### PASSO 1: Análise Técnica (60 min)

**1.1 Métricas de Código**
```bash
# Contar arquivos TypeScript/TSX
find app/ components/ lib/ -name "*.ts" -o -name "*.tsx" | wc -l

# Linhas de código total
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1

# Componentes React
find components/ app/ -name "*.tsx" | wc -l

# API Routes
find app/api -name "route.ts" | wc -l

# Prisma Models
grep "^model " prisma/schema.prisma | wc -l

# Testes
find . -name "*.test.ts" -o -name "*.spec.ts" | wc -l

# console.logs (code smell)
grep -r "console\." --include="*.ts" --include="*.tsx" app/ lib/ components/ | wc -l

# Type 'any' (type safety)
grep -r ": any" --include="*.ts" --include="*.tsx" | wc -l
```

**1.2 Análise de Componentes Grandes**
```bash
# Componentes > 500 linhas (refactoring target)
find app/ components/ -name "*.tsx" -exec wc -l {} + | awk '$1 > 500' | sort -rn
```

**1.3 Security Audit**
```bash
# NPM vulnerabilities
npm audit --production

# Find secrets/API keys accidentally committed
git log -S "API_KEY" --all

# Find dangerouslySetInnerHTML (XSS risk)
grep -r "dangerouslySetInnerHTML" --include="*.tsx"
```

---

### PASSO 2: Scorecard Geral (30 min)

Preencha o template abaixo com scores de 0-10:

```markdown
| Dimensão | Score | Status | Evidência |
|----------|-------|--------|-----------|
| **Qualidade Técnica** | X/10 | 🟢🟡🔴 | [Descrever] |
| **Segurança** | X/10 | 🟢🟡🔴 | [Descrever] |
| **Performance** | X/10 | 🟢🟡🔴 | [Descrever] |
| **Testes** | X/10 | 🟢🟡🔴 | [Coverage %] |
| **Documentação** | X/10 | 🟢🟡🔴 | [Skill count, README] |
| **Product-Market-Fit** | X/10 | 🟢🟡🔴 | [Users, MRR] |
| **Sustentabilidade** | X/10 | 🟢🟡🔴 | [Burn rate, runway] |
| **MÉDIA GERAL** | **X/10** | 🟢🟡🔴 | - |
```

**Legenda**:
- 🟢 7-10: Sólido
- 🟡 4-6: Atenção
- 🔴 0-3: Crítico

---

### PASSO 3: Análise de Negócio (45 min)

**3.1 Métricas Financeiras**

```markdown
**Custos Mensais Fixos:**
- [Serviço 1]: $X
- [Serviço 2]: $X
- [Serviço 3]: $X
- **TOTAL: $XXX/mês** ($X.XXX/ano)

**Revenue Atual:** $X/mês
**Burn Rate:** $X/mês
**Runway:** X meses (ou "Indefinido" se voluntário)
```

**3.2 Product-Market-Fit**

```markdown
| Métrica | Valor | Status |
|---------|-------|--------|
| **Usuários ativos** | X | |
| **MRR** | $X | |
| **Taxa de retenção** | X% | |
| **NPS** | X | |
| **Churn** | X% | |
```

**3.3 Análise Competitiva**

Liste top 3-5 competidores e compare:
- Tráfego mensal
- Revenue estimado
- Vantagens deles vs você
- Seu diferencial único

---

### PASSO 4: Identificação de Riscos (30 min)

**Checklist de Riscos**:

**🔴 Técnicos:**
- [ ] Cobertura de testes < 50%?
- [ ] Componentes > 1000 linhas?
- [ ] Security vulnerabilities (npm audit)?
- [ ] Rate limiting ausente?
- [ ] Env vars sem validação?
- [ ] XSS/SQL injection potencial?

**🔴 Negócio:**
- [ ] Burn rate insustentável?
- [ ] Sem analytics/tracking?
- [ ] PMF não validado?
- [ ] Competição muito forte?
- [ ] Dependência de APIs pagas?

**🔴 Estratégico:**
- [ ] Burnout de fundador?
- [ ] Token sem utility?
- [ ] Risco regulatório?

---

### PASSO 5: Priorização de Ações (30 min)

Categorize issues encontrados:

**🔴 P0 - URGENTE (< 1 semana)**:
- Item 1: [Descrição] - [Custo estimado: Xh]
- Item 2: [Descrição] - [Custo estimado: Xh]

**🟡 P1 - IMPORTANTE (2-4 semanas)**:
- Item 1: [Descrição] - [Custo estimado: Xh]
- Item 2: [Descrição] - [Custo estimado: Xh]

**🟢 P2 - MÉDIO PRAZO (1-2 meses)**:
- Item 1: [Descrição] - [Custo estimado: Xh]

---

### PASSO 6: Decisão Estratégica (30 min)

**Avalie 3 opções**:

**A) Pivote → Negócio Real**
- Investimento estimado: $X + Xh
- Retorno esperado: $X MRR em X meses
- Probabilidade de sucesso: X%
- Escolha se: [Condições]

**B) Aceite → Hobby/OSS**
- Custo: $X
- Benefício: [Listar]
- Escolha se: [Condições]

**C) Mate → Shutdown**
- ROI alternativo: Xh @ $X/h = $X/ano
- Escolha se: [Condições]

**❌ NÃO escolha:** Status quo (sem decisão)

---

## 📋 Checklist Completo de Auditoria

Use em cada auditoria trimestral:

### 🔒 Segurança

- [ ] `npm audit --production` (0 vulnerabilities críticas)
- [ ] Verificar secrets não commitados (`git log -S "API_KEY"`)
- [ ] Revisar CORS e security headers
- [ ] Validar sanitização de inputs (Zod, DOMPurify)
- [ ] Rate limiting em APIs críticas
- [ ] NextAuth configurado corretamente
- [ ] Scan vulnerabilidades (Snyk ou similar)

### 🧪 Qualidade de Código

- [ ] Coverage testes (meta: 60-70%)
- [ ] Reduzir `any` (meta: <20 ocorrências)
- [ ] Componentes <500 linhas
- [ ] Complexidade ciclomática <10
- [ ] Remover código morto
- [ ] Lint warnings = 0
- [ ] TypeScript errors = 0

### ⚡ Performance

- [ ] Core Web Vitals medidos (LCP, FID, CLS)
- [ ] Bundle size analysis (`npx @next/bundle-analyzer`)
- [ ] Lazy loading implementado
- [ ] Images otimizadas (next/image)
- [ ] Cache strategy validada (ISR, sessionStorage)
- [ ] API response <200ms (p95)
- [ ] Database query optimization (Prisma)

### 📊 Negócio

- [ ] Google Analytics configurado e funcionando
- [ ] KPIs definidos e trackados
- [ ] Funil de conversão mapeado
- [ ] Taxa de retenção medida
- [ ] CAC (Customer Acquisition Cost) calculado
- [ ] LTV (Lifetime Value) estimado
- [ ] Breakeven analysis atualizado

### 🗄️ Database

- [ ] Índices otimizados (`EXPLAIN ANALYZE` queries lentas)
- [ ] N+1 queries identificadas e resolvidas
- [ ] Schema review (normalização adequada)
- [ ] Backup strategy validada
- [ ] Migration strategy documentada

### 📝 Documentação

- [ ] README atualizado
- [ ] Skills atualizadas
- [ ] API docs completas (Swagger/OpenAPI)
- [ ] Troubleshooting atualizado
- [ ] ADRs para decisões importantes

---

## 🛠️ Scripts Úteis

```bash
# Security audit
npm audit --production

# Find console.logs
grep -r "console\." --include="*.ts" --include="*.tsx" app/ lib/ components/ | wc -l

# Find 'any' types
grep -r ": any" --include="*.ts" --include="*.tsx" | wc -l

# Component size (top 20 largest)
find app/ components/ -name "*.tsx" -exec wc -l {} + | sort -rn | head -20

# Bundle size analysis
npm run build && npx @next/bundle-analyzer

# Lighthouse audit
npx lighthouse https://tokenmilagre.com.br --view

# Test coverage
npm run test:coverage

# Find duplicated code
npx jscpd app/ components/ lib/

# Complexity analysis
npx complexity-report app/ components/ lib/
```

---

## 📐 Templates

### Template: Sumário Executivo

```markdown
## 📄 SUMÁRIO EXECUTIVO (30 SEGUNDOS)

**O que é:** [1 frase descritiva]

**Tecnicamente:** [1 frase: Stack, score, problema crítico]

**Financeiramente:** [1 frase: MRR, burn rate, sustentabilidade]

**Mercado:** [1 frase: Tração, competição, diferencial]

**Veredicto:** [1 frase: Viável como negócio? Hobby? Desligar?]
```

### Template: Análise de Risco

```markdown
## 🔴 RISCO: [Nome do Risco]

**Probabilidade:** X% (Alta/Média/Baixa)
**Impacto:** 🔴🟡🟢 (Crítico/Médio/Baixo)

**Cenário de falha:**
```
[Descrever passo-a-passo o que acontece]
```

**Mitigação:**
1. Ação 1 - [Custo: $X ou Xh]
2. Ação 2 - [Custo: $X ou Xh]

**Prioridade:** 🔴 P0 / 🟡 P1 / 🟢 P2
```

---

## 🎯 Outputs Esperados

Após cada auditoria, gerar:

1. **Snapshot completo** → `docs/audits/YYYY-MM-DD-platform-audit.md` (análise detalhada)
2. **Sumário executivo** → Compartilhar com stakeholders
3. **Action plan** → Issues no GitHub com prioridades (P0, P1, P2)
4. **Decisão estratégica** → Pivotar, manter ou matar

---

## 📖 Instructions for Claude

When executing platform audit:

1. **Follow 6-step process** rigorously
2. **Use bash scripts** provided for metrics
3. **Fill all templates** (scorecard, sumário, riscos)
4. **Be brutally honest** - Modo Brutal Honesty ativo
5. **Save full snapshot** to `docs/audits/YYYY-MM-DD-platform-audit.md`
6. **Present decision tree** at the end (Pivote/Hobby/Shutdown)

**Time allocation**:
- PASSO 1-3: 2h (análise técnica + negócio)
- PASSO 4-5: 1h (riscos + priorização)
- PASSO 6: 30min (decisão estratégica)

---

## 📚 Related Skills

- [`due-diligence-report`](../due-diligence-report/SKILL.md) - Análise estratégica profunda
- [`troubleshooting`](../troubleshooting/SKILL.md) - Histórico de problemas resolvidos
- [`tokenmilagre-database`](../../core/tokenmilagre-database/SKILL.md) - Database health check
- [`tokenmilagre-testing`](../../core/tokenmilagre-testing/SKILL.md) - Test coverage strategies
- [`project-manager-brutal-honesty`](../../_meta/project-manager-brutal-honesty/SKILL.md) - Modo de comunicação

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-17
**Mudanças recentes**:
- ✅ **OTIMIZAÇÃO**: 932 → 450 linhas (-52%)
- ✅ Snapshot 2025-11-13 movido para docs/audits/
- ✅ Mantido apenas processo e templates genéricos
- ✅ Adicionados scripts bash úteis
- ✅ Templates para sumário executivo e análise de risco
