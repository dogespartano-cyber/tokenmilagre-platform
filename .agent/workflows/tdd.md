---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Test-Driven Development - escreva o teste primeiro, veja falhar, implemente
source: Superpowers - obra/superpowers (test-driven-development)
---

# Test-Driven Development (TDD)

> Escreva o teste primeiro. Veja falhar. Escreva código mínimo para passar.

**Iron Law:** NENHUM código de produção sem teste falhando primeiro.

Escreveu código antes do teste? Delete. Comece de novo.

---

## Quando Usar

**Sempre:**
- Novas features
- Bug fixes
- Refatoração
- Mudanças de comportamento

**Exceções (pergunte ao usuário):**
- Protótipos descartáveis
- Código gerado
- Arquivos de configuração

---

## Red-Green-Refactor

### 🔴 RED - Escreva Teste que Falha

Escreva um teste mínimo mostrando o que deveria acontecer.

```typescript
// ✅ BOM: Nome claro, testa comportamento real, uma coisa
test('rejeita email vazio', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email obrigatório');
});

// ❌ RUIM: Nome vago, testa mock não código
test('validação funciona', async () => {
  const mock = jest.fn().mockResolvedValue(true);
  await validate(mock);
  expect(mock).toHaveBeenCalled();
});
```

**Requisitos:**
- Um comportamento
- Nome claro
- Código real (sem mocks a menos que inevitável)

---

### Verifique RED - Veja Falhar

**OBRIGATÓRIO. Nunca pule.**

```bash
npm test path/to/test.test.ts
```

Confirme:
- Teste falha (não dá erro)
- Mensagem de falha é esperada
- Falha porque feature está faltando (não typos)

**Teste passou?** Você está testando comportamento existente. Corrija o teste.

---

### 🟢 GREEN - Código Mínimo

Escreva o código mais simples para passar o teste.

```typescript
// ✅ BOM: Apenas o suficiente para passar
function submitForm(data: FormData) {
  if (!data.email?.trim()) {
    return { error: 'Email obrigatório' };
  }
  // ...
}

// ❌ RUIM: Over-engineered
function submitForm(data: FormData, options?: {
  maxRetries?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number) => void;
}) {
  // YAGNI - You Aren't Gonna Need It
}
```

Não adicione features, refatore outro código, ou "melhore" além do teste.

---

### Verifique GREEN - Veja Passar

**OBRIGATÓRIO.**

```bash
npm test path/to/test.test.ts
```

Confirme:
- Teste passa
- Outros testes continuam passando
- Output limpo (sem erros, warnings)

---

### 🔵 REFACTOR - Limpe

Somente após green:
- Remova duplicação
- Melhore nomes
- Extraia helpers

Mantenha testes verdes. Não adicione comportamento.

---

## Racionalização Comum

| Desculpa | Realidade |
|----------|-----------|
| "Simples demais para testar" | Código simples quebra. Teste leva 30 segundos. |
| "Vou testar depois" | Testes passando imediatamente não provam nada. |
| "Já testei manualmente" | Ad-hoc ≠ sistemático. Sem registro, não pode re-executar. |
| "Deletar X horas é desperdício" | Sunk cost fallacy. Manter código não verificado é dívida técnica. |
| "TDD vai me atrasar" | TDD é mais rápido que debugging. |

---

## Red Flags - PARE e Comece de Novo

- Código antes do teste
- Teste depois da implementação
- Teste passa imediatamente
- Não consegue explicar por que teste falhou
- "Só dessa vez"

**Todos esses significam: Delete código. Comece de novo com TDD.**

---

## Checklist de Verificação

Antes de marcar trabalho como completo:

- [ ] Toda nova função/método tem teste
- [ ] Vi cada teste falhar antes de implementar
- [ ] Cada teste falhou pela razão esperada
- [ ] Escrevi código mínimo para passar cada teste
- [ ] Todos os testes passam
- [ ] Output limpo (sem erros, warnings)
- [ ] Testes usam código real (mocks só se inevitável)
- [ ] Edge cases e erros cobertos

---

```yaml
@workflow-links:
  - /debug: Para bugs, use debugging sistemático primeiro
  - /verificacao: Verificar antes de declarar sucesso
@source: https://github.com/obra/superpowers
@created: 2025-12-22
```
