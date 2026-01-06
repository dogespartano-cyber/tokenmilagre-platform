---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Verificação obrigatória antes de claims de conclusão - evidência antes de afirmações
source: Superpowers - obra/superpowers (verification-before-completion)
---

# Verificação Antes de Conclusão

> Declarar trabalho completo sem verificação é desonestidade, não eficiência.

**Iron Law:** NENHUMA claim de conclusão sem evidência de verificação fresh.

---

## O Gate Function

@last-verified: 2025-12-29
```
ANTES de declarar qualquer status ou expressar satisfação:

1. IDENTIFICAR: Qual comando prova essa claim?
2. EXECUTAR: Execute o comando COMPLETO (fresh, completo)
3. LER: Output completo, verifique exit code
4. VERIFICAR: Output confirma a claim?
   - Se NÃO: Declare status real com evidência
   - Se SIM: Declare claim COM evidência
5. SÓ ENTÃO: Faça a claim

Pular qualquer step = mentir, não verificar
@last-verified: 2025-12-29
```

---

## Falhas Comuns

| Claim | Requer | Não é Suficiente |
|-------|--------|------------------|
| Testes passam | Output: 0 falhas | Run anterior, "deve passar" |
| Linter limpo | Output: 0 erros | Verificação parcial |
| Build sucesso | Exit code: 0 | Linter passando |
| Bug corrigido | Teste original: passa | "Código mudou" |
| Requisitos atendidos | Checklist linha-a-linha | Testes passando |

---

## Red Flags - PARE

- Usando "deve", "provavelmente", "parece que"
- Expressando satisfação antes de verificar ("Ótimo!", "Perfeito!", "Pronto!")
- Prestes a commit/push sem verificação
- Confiando em verificação parcial
- "Só dessa vez"
- Cansado e querendo terminar logo
- **QUALQUER wording implicando sucesso sem ter executado verificação**

---

## Prevenção de Racionalização

| Desculpa | Realidade |
|----------|-----------|
| "Deve funcionar agora" | EXECUTE a verificação |
| "Estou confiante" | Confiança ≠ evidência |
| "Só dessa vez" | Sem exceções |
| "Linter passou" | Linter ≠ compilador |
| "Verificação parcial basta" | Parcial não prova nada |
| "Estou cansado" | Cansaço ≠ desculpa |

---

## Padrões Corretos

### Testes

@last-verified: 2025-12-29
```
✅ [Executa comando] [Vê: 34/34 pass] "Todos os testes passam"
❌ "Deve passar agora" / "Parece correto"
@last-verified: 2025-12-29
```

### Build

@last-verified: 2025-12-29
```
✅ [Executa build] [Vê: exit 0] "Build passa"
❌ "Linter passou" (linter não verifica compilação)
@last-verified: 2025-12-29
```

### Requisitos

@last-verified: 2025-12-29
```
✅ Re-lê plano → Cria checklist → Verifica cada → Reporta gaps ou conclusão
❌ "Testes passam, fase completa"
@last-verified: 2025-12-29
```

---

## Por Que Isso Importa

- Confiança quebrada
- Funções undefined enviadas
- Requisitos faltando
- Tempo desperdiçado em conclusão falsa → redirect → retrabalho

---

## Quando Aplicar

**SEMPRE antes de:**
- QUALQUER variação de claims de sucesso/conclusão
- QUALQUER expressão de satisfação
- QUALQUER declaração positiva sobre estado do trabalho
- Commit, PR, conclusão de tarefa
- Mover para próxima tarefa

---

## The Bottom Line

**Sem atalhos para verificação.**

Execute o comando. Leia o output. SÓ ENTÃO declare o resultado.

Isso é não-negociável.

---

```yaml
@workflow-links:
  - /tdd: Verificar ciclo red-green-refactor
  - /debug: Verificar que fix resolveu o problema
  - /execucao: Verificar cada batch antes de prosseguir
@source: https://github.com/obra/superpowers
@created: 2025-12-22
@last-verified: 2025-12-29
```
