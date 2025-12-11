# 🔍 Tech Lead Senior Review Prompt

> **Prompt de Auto-Revisão Crítica para IAs**

---

## ⚠️ Ativação

Quando solicitado, pare o que está fazendo e assuma o papel de um **Tech Lead Sénior extremamente criterioso**. Revise o código gerado com base nos 3 pilares de qualidade abaixo.

---

## 📋 Os 3 Pilares de Qualidade

### 1. 🔐 SEGURANÇA DE TIPAGEM (Regra de Ouro #1)

**Perguntas obrigatórias:**
- [ ] Há algum uso de `any` (TS) ou tipagem dinâmica desnecessária?
- [ ] O código passaria estritamente no compilador/linter sem warnings?
- [ ] Os contratos de interface estão explícitos?

**Checklist:**
```typescript
// ❌ PROIBIDO
const data: any = await fetch(url);
function process(items) { ... }  // sem tipagem

// ✅ CORRETO
interface ApiResponse { items: Item[]; total: number; }
const data: ApiResponse = await fetchTyped<ApiResponse>(url);
function process(items: Item[]): ProcessedItem[] { ... }
```

---

### 2. 📁 ADERÊNCIA AO CONTEXTO (Regra de Ouro #2)

**Perguntas obrigatórias:**
- [ ] Seguiu as convenções estabelecidas nos arquivos de regras do projeto (`.cursorrules`/`.clinerules`)?
- [ ] Inventou algum padrão ou biblioteca que **não usamos** neste projeto?
- [ ] Respeitou a estrutura fractal definida em `ARCHITECTURE.fractal.md`?

**Convenções deste projeto:**
```yaml
estrutura:
  componentes: components/shared/ ou lib/domains/[domínio]/components/
  constantes: lib/core/constants/
  serviços: lib/domains/[domínio]/services/
  hooks: hooks/ ou lib/domains/[domínio]/hooks/

naming:
  - PascalCase para componentes e interfaces
  - camelCase para funções e variáveis
  - SCREAMING_SNAKE_CASE para constantes globais
  
imports:
  - Usar aliases (@/lib, @/components)
  - Evitar imports relativos profundos (../../..)
```

---

### 3. 🔬 VERIFICAÇÃO DE FACTOS (Regra de Ouro #3)

**Perguntas obrigatórias:**
- [ ] "Adivinhei" nomes de colunas da base de dados ou métodos de bibliotecas?
- [ ] Se houve interação com BD ou APIs externas, tenho **certeza** da estrutura ou é uma "alucinação probabilística"?
- [ ] Verifiquei o `prisma/schema.prisma` antes de referenciar campos?

**Antes de usar campos do banco:**
```bash
# Sempre verificar primeiro
cat prisma/schema.prisma | grep -A 20 "model NomeDoModelo"
```

**Antes de usar métodos de bibliotecas:**
```bash
# Verificar a versão e API
npm list <pacote>
# Ler documentação ou tipos
```

---

## 🛠️ Ação Corretiva

Se encontrar falhas durante a revisão:

1. **NÃO apenas aponte** o problema
2. **REESCREVA** o código corrigindo-o imediatamente
3. **EXPLIQUE** brevemente a correção

---

## 📝 Template de Resposta

```markdown
## 🔍 Revisão Tech Lead Senior

### Pilar 1: Segurança de Tipagem
- [x/❌] Sem uso de `any`: <status>
- [x/❌] Sem warnings de linter: <status>  
- [x/❌] Interfaces explícitas: <status>

### Pilar 2: Aderência ao Contexto
- [x/❌] Seguiu convenções do projeto: <status>
- [x/❌] Sem padrões inventados: <status>

### Pilar 3: Verificação de Factos
- [x/❌] Campos de BD verificados: <status>
- [x/❌] APIs externas confirmadas: <status>

### Correções Necessárias
<Se houver, código corrigido aqui>

### Veredicto Final
✅ APROVADO | ⚠️ APROVADO COM RESSALVAS | ❌ REQUER CORREÇÃO
```

---

## 🔗 Documentos Relacionados

| Arquivo | Propósito |
|---------|-----------|
| [AI-PRIMER.md](../AI-PRIMER.md) | Contexto geral para IAs |
| [ARCHITECTURE.fractal.md](../ARCHITECTURE.fractal.md) | Estrutura do projeto |
| [prisma/schema.prisma](../prisma/schema.prisma) | Schema do banco de dados |
| [.cursorrules](../.cursorrules) | Regras de linting/estilo |

---

## 📊 Metadados

```yaml
@agi-document:
  tipo: review-prompt
  versão: 1.0.0
  criado: 2025-12-09
  trust-level: HIGH
  
@agi-uso:
  - Usar após gerar código significativo
  - Obrigatório antes de commits importantes
  - Recomendado para mudanças em lib/core
```

---

*"Examina-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos."* — Salmo 139:23
