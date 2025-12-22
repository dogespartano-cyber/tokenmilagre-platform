---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Escrita de planos de implementação detalhados com tarefas bite-sized
source: Superpowers - obra/superpowers (writing-plans)
---

# Escrevendo Planos de Implementação

> Escreva planos assumindo que o engenheiro tem zero contexto e gosto questionável.

Documente tudo: arquivos, código completo, como testar, commits frequentes.

---

## Granularidade Bite-Sized

**Cada step é UMA ação (2-5 minutos):**

```markdown
- "Escrever o teste que falha" - step
- "Executar para confirmar que falha" - step  
- "Implementar código mínimo para passar" - step
- "Executar testes e confirmar que passam" - step
- "Commit" - step
```

Não agrupe múltiplas ações em um step.

---

## Estrutura do Documento

### Header Obrigatório

```markdown
# [Nome da Feature] - Plano de Implementação

**Objetivo:** [Uma frase descrevendo o que isso constrói]

**Arquitetura:** [2-3 frases sobre a abordagem]

**Stack:** [Tecnologias/bibliotecas principais]

---
```

---

### Estrutura de Tarefas

```markdown
### Tarefa N: [Nome do Componente]

**Arquivos:**
- Criar: `caminho/exato/para/arquivo.ts`
- Modificar: `caminho/exato/para/existente.ts:123-145`
- Teste: `tests/caminho/exato/test.ts`

**Step 1: Escrever o teste que falha**

\`\`\`typescript
test('comportamento específico', () => {
  const result = funcao(input);
  expect(result).toBe(expected);
});
\`\`\`

**Step 2: Executar para confirmar que falha**

\`\`\`bash
npm test tests/path/test.ts -- --grep "comportamento específico"
\`\`\`

Esperado: FAIL com "funcao is not defined"

**Step 3: Implementar código mínimo**

\`\`\`typescript
function funcao(input: string): string {
  return expected;
}
\`\`\`

**Step 4: Executar para confirmar que passa**

\`\`\`bash
npm test tests/path/test.ts
\`\`\`

Esperado: PASS

**Step 5: Commit**

\`\`\`bash
git add tests/path/test.ts src/path/file.ts
git commit -m "feat: adiciona funcionalidade específica"
\`\`\`
```

---

## Regras de Ouro

| Princípio | Aplicação |
|-----------|-----------|
| **DRY** | Don't Repeat Yourself |
| **YAGNI** | You Aren't Gonna Need It |
| **TDD** | Teste primeiro, sempre |
| **Commits frequentes** | Pequenos, atômicos, reversíveis |

---

## Checklist do Plano

Antes de entregar o plano:

- [ ] Caminhos de arquivo exatos
- [ ] Código completo (não "adicione validação")
- [ ] Comandos exatos com output esperado
- [ ] Cada tarefa é 2-5 minutos
- [ ] Testes vêm antes de implementação
- [ ] Commits definidos para cada tarefa

---

## Salvar Plano

Salve planos em: `docs/plans/YYYY-MM-DD-<feature-name>.md`

---

```yaml
@workflow-links:
  - /execucao: Para executar o plano criado
  - /tdd: Referência para ciclo de testes
@source: https://github.com/obra/superpowers
@created: 2025-12-22
```
