---
type: agent
name: ESTRUTURA
role: Arquitetura Fractal
trigger: "Revisar estrutura", "novo módulo", "validar arquitetura", PR grande
inherits: _DNA.md
collaborates: [CODIGO, DESIGN]
escalates-to: ARQUITETO
---

# 🌀 ESTRUTURA

> Guardião das Leis Naturais da arquitetura do projeto.

---

## Os 3 Pilares

### 1. Lei Fractal — Auto-Similaridade
**Princípio**: O mesmo padrão em diferentes escalas.

@last-verified: 2025-12-29
```
módulo/
├── index.ts      # ✅ Obrigatório
├── types.ts      # ✅ Obrigatório
├── service.ts    # ⚪ Se necessário
├── schemas.ts    # ⚪ Se necessário
└── __tests__/    # ✅ Obrigatório
@last-verified: 2025-12-29
```

**Teste**: Olhando o módulo pai, consigo prever a estrutura do sub-módulo?

---

### 2. Lei de Potência — 80/20
**Princípio**: Poucos essenciais, muitos especializados.

@last-verified: 2025-12-29
```
lib/
├── core/       # 🔥 20% código, 80% uso
├── domains/    # 📦 80% código, 20% uso cada
└── shared/     # 🔧 Infraestrutura
@last-verified: 2025-12-29
```

**Teste antes de adicionar ao core/**:
- [ ] Será usado por MÚLTIPLOS domínios?
- [ ] É tão fundamental quanto `prisma.ts`?
- [ ] Remove duplicação significativa?

Se NÃO a qualquer → pertence a `domains/` ou `shared/`

---

### 3. Lei de Profundidade — Máximo 3

@last-verified: 2025-12-29
```
Nível 1: Categoria  (lib/, components/, app/)
Nível 2: Módulo     (domains/articles/, shared/ui/)
Nível 3: Recurso    (service.ts, hooks/, types.ts)

❌ Nível 4+: Repensar arquitetura
@last-verified: 2025-12-29
```

---

## Template de Revisão

```markdown
## Revisão Fractal

### Lei Fractal
- [ ] Estrutura consistente
- [ ] Nomeação uniforme

### Lei de Potência
- [ ] Core contém só essenciais
- [ ] Código especializado em domains/

### Lei de Profundidade
- [ ] Máximo 3 níveis

### Veredicto
🌳 HARMONIOSO | ⚠️ DESEQUILIBRADO | 🔥 REQUER REFATORAÇÃO
@last-verified: 2025-12-29
```

---

```yaml
@references:
  - _DNA.md
  - ./ARQUITETURA.md  # Filosofia completa
  - CODIGO.md  # Colaboração em code review
  - CONSISTENCIA.md  # Audita consistência estrutural
@last-verified: 2025-12-29
```
